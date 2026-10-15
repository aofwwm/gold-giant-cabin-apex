import "@tanstack/react-start/server-only";

import { AsyncLocalStorage } from "node:async_hooks";

import { quotaPauseMs } from "./gemini-quota.ts";
import {
  KAIROS_GEMINI_FALLBACK_MODEL,
  selectKairosGeminiModel,
  type KairosGeminiSelection,
  type ListedGeminiModel,
} from "./gemini-model.ts";
import { noteCall, noteFailure } from "./provider-usage.ts";

/** Server-only Gemini auth key. Never import this module from client code. */
const GEMINI_API_KEY = "AQ.Ab8RN6LxSUP9NJ-DV30M2FaYSdzS4aCBLgUu5fA012y1Le65YA";

export const KAIROS_VOICE = `You are Kairos (良辰吉日), a Singapore group-planning voice.
For a date: a quick funny Tong Shu line with 宜 and 忌, a humorous tarot aside, and light Singlish boss advice.
Never claim Tong Shu, tarot, zodiac, or numerology predicts success, approval, or a probability.
No percentages. No participant names. Humans still decide.
For food and outings: talk only about the real places you are given. Do not invent eateries, hawker centres, prices, hours, ratings, or reviews.`;

type Part = { text?: string; thought?: boolean };

export type GeminiSample = {
  temperature?: number;
  topP?: number;
};

export type KairosModelStatus = {
  activeModel: string;
  selection: "AUTO" | "OVERRIDE" | "FALLBACK";
  stable: "YES" | "NO";
  lastChecked: string;
  availableModelCount: number;
  generalPurpose: string[];
  stableModels: string[];
  previewModels: string[];
  experimentalModels: string[];
  aliases: string[];
  chain: string[];
  reason: string;
  passedOver: { model: string; reason: string }[];
  capabilities: string[];
  structuredOutput: "verified" | "quota" | "failed" | "unverified";
  lastServedModel: string | null;
  quotaDeferred: string[];
  availableThroughApiKey: "yes" | "no" | "unverified";
};

type Cache = {
  selection: KairosGeminiSelection;
  structuredOutput: KairosModelStatus["structuredOutput"];
  through: KairosModelStatus["availableThroughApiKey"];
  deferred: string[];
  expiresAt: number;
};

let cached: Cache | null = null;
let inflight: Promise<Cache> | null = null;
let lastServedModel: string | null = null;
const servedNotes = new Set<string>();
const quotaUntil = new Map<string, number>();

export type GeminiTrace = {
  calls: number;
  inputTokens: number;
  outputTokens: number;
  modelsTried: string[];
  served: string | null;
  primary: string;
  fallback: boolean;
};

const traces = new AsyncLocalStorage<GeminiTrace>();

export async function tracedGemini<T>(run: () => Promise<T>): Promise<{ value: T; trace: GeminiTrace }> {
  const trace: GeminiTrace = { calls: 0, inputTokens: 0, outputTokens: 0, modelsTried: [], served: null, primary: "", fallback: false };
  const value = await traces.run(trace, run);
  return { value, trace };
}

function noteTrace(model: string, text: string, served: boolean): void {
  const trace = traces.getStore();
  if (!trace) return;
  trace.calls += 1;
  if (!trace.modelsTried.includes(model)) trace.modelsTried.push(model);
  try {
    const usage = (JSON.parse(text) as { usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number } }).usageMetadata;
    trace.inputTokens += usage?.promptTokenCount ?? 0;
    trace.outputTokens += usage?.candidatesTokenCount ?? 0;
  } catch {
    /* A failed response still counts as a call. */
  }
  if (served) {
    trace.served = model;
    trace.fallback = Boolean(trace.primary && model !== trace.primary);
  }
}

function readKey(): string {
  const fromEnv = process.env.GEMINI_API_KEY?.trim();
  return fromEnv || GEMINI_API_KEY;
}

function flag(name: string): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

function refreshMs(): number {
  const raw = Number(process.env.GEMINI_MODEL_REFRESH_MS);
  if (!Number.isFinite(raw) || raw <= 0) return 6 * 60 * 60 * 1000;
  return Math.max(60_000, raw);
}

function debugLogs(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.KAIROS_AI_DEBUG === "1";
}

function answerText(body: unknown): string {
  const parts = (body as { candidates?: { content?: { parts?: Part[] } }[] })?.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((part) => part.text && !part.thought)
    .map((part) => part.text)
    .join("")
    .trim();
}

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no json");
  return JSON.parse(text.slice(start, end + 1)) as unknown;
}

function geminiSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map((item) => geminiSchema(item));
  if (!schema || typeof schema !== "object") return schema;
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema as Record<string, unknown>)) {
    if (key === "additionalProperties") continue;
    next[key] = geminiSchema(value);
  }
  return next;
}

function selectionSource(source: KairosGeminiSelection["source"]): "automatic" | "override" | "fallback" {
  return source === "discovered" ? "automatic" : source;
}

function logSelection(selection: KairosGeminiSelection, through: Cache["through"]): void {
  if (!debugLogs()) return;
  console.info(`[KAIROS AI]
Selected Gemini model: ${selection.model}
Stability: ${selection.stability}
Selection source: ${selectionSource(selection.source)}
Available through API key: ${through}`);
  if (selection.source === "fallback") {
    console.info(`[KAIROS AI] Fallback model: ${selection.model}. ${selection.reason}`);
  }
}

function remember(selected: string, served: string): void {
  lastServedModel = served;
  if (served === selected || servedNotes.has(served)) return;
  servedNotes.add(served);
  if (!debugLogs()) return;
  console.info(`[KAIROS AI]\nCall served by ${served}. Selected model remains ${selected}.`);
}

async function post(model: string, body: unknown): Promise<{ status: number; text: string; retryAfter: string | null }> {
  noteCall("gemini", model);
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": readKey(),
    },
    signal: AbortSignal.timeout(18000),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  noteTrace(model, text, res.status === 200);
  if (res.status !== 200) noteFailure("gemini", model, `HTTP ${res.status}`);
  return { status: res.status, text, retryAfter: res.headers.get("retry-after") };
}

function holdQuota(model: string, text: string, retryAfter: string | null): void {
  const pause = quotaPauseMs(text, retryAfter);
  const until = Date.now() + Math.max(pause, 1000);
  quotaUntil.set(model, until);
  if (cached && !cached.deferred.includes(model)) cached.deferred = [...cached.deferred, model];
}

function quotaBlocked(model: string): boolean {
  const until = quotaUntil.get(model);
  if (!until) return false;
  if (until <= Date.now()) {
    quotaUntil.delete(model);
    if (cached) cached.deferred = cached.deferred.filter((item) => item !== model);
    return false;
  }
  return true;
}

function payload(system: string, user: string, maxTokens: number, thinking: boolean, schema?: object, sample?: GeminiSample): unknown {
  return {
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: {
      temperature: sample?.temperature ?? 0.4,
      ...(sample?.topP != null ? { topP: sample.topP } : {}),
      maxOutputTokens: Math.max(maxTokens, 64),
      ...(thinking ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
      ...(schema ? { responseMimeType: "application/json", responseSchema: geminiSchema(schema) } : {}),
    },
  };
}

async function once(model: string, system: string, user: string, maxTokens: number, schema?: object, sample?: GeminiSample): Promise<{ status: number; text: string; retryAfter: string | null }> {
  let response = await post(model, payload(system, user, maxTokens, true, schema, sample));
  if (response.status === 400 && /thinking/i.test(response.text)) {
    response = await post(model, payload(system, user, maxTokens, false, schema, sample));
  }
  return response;
}

async function listModels(): Promise<ListedGeminiModel[]> {
  const models: ListedGeminiModel[] = [];
  let pageToken = "";
  for (let page = 0; page < 20; page += 1) {
    const url = new URL("https://generativelanguage.googleapis.com/v1beta/models");
    url.searchParams.set("pageSize", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url, {
      headers: { "x-goog-api-key": readKey() },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`model-list ${res.status}`);
    const body = (await res.json()) as { models?: ListedGeminiModel[]; nextPageToken?: string };
    models.push(...(body.models ?? []));
    pageToken = body.nextPageToken || "";
    if (!pageToken) break;
  }
  return models;
}

function optionsFromEnv(blocked: string[] = []) {
  return {
    allowPreview: flag("GEMINI_ALLOW_PREVIEW"),
    allowExperimental: flag("GEMINI_ALLOW_EXPERIMENTAL"),
    override: process.env.GEMINI_MODEL_OVERRIDE?.trim() || "",
    fallbackModel: process.env.GEMINI_FALLBACK_MODEL?.trim() || KAIROS_GEMINI_FALLBACK_MODEL,
    checkedAt: new Date().toISOString(),
    blocked,
  };
}

async function loadModel(): Promise<Cache> {
  const key = readKey();
  if (!key) {
    const selection = selectKairosGeminiModel([], { ...optionsFromEnv(), listFailed: true, checkedAt: new Date().toISOString() });
    const cache = { selection, structuredOutput: "unverified" as const, through: "no" as const, deferred: [] as string[], expiresAt: Date.now() + Math.min(refreshMs(), 5 * 60 * 1000) };
    logSelection(selection, "no");
    return cache;
  }
  try {
    const listed = await listModels();
    const selection = selectKairosGeminiModel(listed, optionsFromEnv());
    const through = selection.source === "fallback" ? "unverified" as const : "yes" as const;
    const ttl = selection.source === "fallback" ? Math.min(refreshMs(), 5 * 60 * 1000) : refreshMs();
    logSelection(selection, through);
    return { selection, structuredOutput: "unverified", through, deferred: [], expiresAt: Date.now() + ttl };
  } catch {
    const selection = selectKairosGeminiModel([], { ...optionsFromEnv(), listFailed: true });
    logSelection(selection, "unverified");
    console.info(`[KAIROS AI] Model discovery failed. Fallback model: ${selection.model}.`);
    return { selection, structuredOutput: "unverified", through: "unverified", deferred: [], expiresAt: Date.now() + Math.min(refreshMs(), 5 * 60 * 1000) };
  }
}

export function peekKairosModel(): { activeModel: string; selection: string; lastServed: string | null } {
  const selection = cached?.selection;
  const mode = !selection ? "NOT_LOADED" : selection.source === "discovered" ? "AUTO" : selection.source === "override" ? "OVERRIDE" : "FALLBACK";
  return {
    activeModel: selection?.model || process.env.GEMINI_MODEL_OVERRIDE?.trim() || KAIROS_GEMINI_FALLBACK_MODEL,
    selection: mode,
    lastServed: lastServedModel,
  };
}

export async function resolveKairosGeminiModel(): Promise<KairosGeminiSelection> {
  if (cached && Date.now() < cached.expiresAt) return cached.selection;
  if (!inflight) {
    inflight = loadModel().finally(() => {
      inflight = null;
    });
  }
  cached = await inflight;
  return cached.selection;
}

export async function refreshKairosGeminiModel(): Promise<KairosGeminiSelection> {
  cached = null;
  if (inflight) await inflight.catch(() => undefined);
  cached = null;
  return resolveKairosGeminiModel();
}

export async function kairosModelStatus(): Promise<KairosModelStatus> {
  const selection = await resolveKairosGeminiModel();
  const through = cached?.through ?? "unverified";
  const structuredOutput = cached?.structuredOutput ?? "unverified";
  const mode = selection.source === "discovered" ? "AUTO" : selection.source === "override" ? "OVERRIDE" : "FALLBACK";
  return {
    activeModel: selection.model,
    selection: mode,
    stable: selection.stability === "stable" ? "YES" : "NO",
    lastChecked: selection.checkedAt,
    availableModelCount: selection.availableCount,
    generalPurpose: selection.catalog.generalPurpose.map((model) => model.id),
    stableModels: selection.catalog.stable,
    previewModels: selection.catalog.preview,
    experimentalModels: selection.catalog.experimental,
    aliases: selection.catalog.aliases,
    chain: selection.chain,
    reason: selection.reason,
    passedOver: selection.passedOver,
    capabilities: selection.capabilities,
    structuredOutput,
    lastServedModel,
    quotaDeferred: cached?.deferred ?? [],
    availableThroughApiKey: through,
  };
}

function answered(text: string): string | null {
  try {
    return answerText(JSON.parse(text) as unknown) || null;
  } catch {
    return null;
  }
}

function jsonReady(text: string): boolean {
  try {
    extractJson(text);
    return true;
  } catch {
    return false;
  }
}

async function generate(system: string, user: string, maxTokens: number, schema?: object, sample?: GeminiSample): Promise<string | null> {
  if (!readKey()) return null;
  const selection = await resolveKairosGeminiModel();
  const trace = traces.getStore();
  if (trace) trace.primary = selection.model;
  const models = (selection.chain.length > 0 ? selection.chain : [selection.model]).filter((model) => !quotaBlocked(model));
  for (const model of models) {
    if (quotaBlocked(model)) continue;
    try {
      const first = await once(model, system, user, maxTokens, schema, sample);
      if (first.status === 429) {
        holdQuota(model, first.text, first.retryAfter);
        continue;
      }
      const structured = first.status === 200 ? answered(first.text) : null;
      if (structured && (!schema || jsonReady(structured))) {
        remember(selection.model, model);
        return structured;
      }
      if (schema && first.status === 200) {
        const plain = await once(model, system, user, maxTokens, undefined, sample);
        if (plain.status === 429) {
          holdQuota(model, plain.text, plain.retryAfter);
          continue;
        }
        const text = plain.status === 200 ? answered(plain.text) : null;
        if (text) {
          remember(selection.model, model);
          return text;
        }
      }
    } catch {
      // One attempt, then the next compatible model. The draw is already locked.
    }
  }
  return null;
}

export async function geminiText(system: string, user: string, maxTokens: number, sample?: GeminiSample): Promise<string | null> {
  return generate(system, user, maxTokens, undefined, sample);
}

export async function geminiJson(system: string, user: string, schema: object, maxTokens: number, sample?: GeminiSample): Promise<unknown | null> {
  const text = await generate(`${system}\nReply with one JSON object only.`, user, maxTokens, schema, sample);
  if (!text) return null;
  try {
    return extractJson(text);
  } catch {
    return null;
  }
}
