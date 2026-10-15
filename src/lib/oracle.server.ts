import "@tanstack/react-start/server-only";

import { geminiJson, tracedGemini } from "@/lib/gemini.server";
import { dailyKey, ORACLE_PROMPT_VERSION, ORACLE_SCHEMA_VERSION, oracleFingerprint, type OracleLedger } from "@/lib/oracle-cache";
import { buildOracle, voiceAllowed, voiceFitsReading, type OracleInput, type OracleReading } from "@/lib/oracle";

const SYSTEM = `You are 神婆, the voice inside Kairos Oracle.
ANSWER THE USER'S EXACT QUESTION. The question contract decides the shape.
If answerShape is timeframe, name the window or say timing cannot be dated. Do not answer with only yes or no.
If answerShape is yes_no, do not invent a year.
If answerShape is mechanism, describe how the period unfolds. Do not turn it into a date.
Interpret only the JSON you are given. The band, the window, the 宜/忌 action, and every raw result are already decided.
Do not change them. Do not invent tarot cards, Tong Shu results, I Ching hexagrams, numbers, zodiac animals, dates, planets, houses, or BaZi pillars.
Do not mention a method that is absent from signals and layers.
Do not guarantee an outcome. No percentages. No diagnosis. No investment instruction. No hours of the day.
No destiny, fate, or soulmate. Never say someone will be rich, promoted, or married in a specific month.
Voice: observant, dry, lightly mischievous, warm, concise. Synthesise across the methods. Do not paraphrase a single card.
says is one sentence, at most 30 words, and must still answer the question shape.
attention is exactly 3 short phrases.
expand is at most 90 words and may name only the signals in the JSON.
If synthesis.mixed is true, say the signs disagree.
If topic is love, cameo may be a short aside mentioning 月老 once. Otherwise cameo is empty.`;

const SCHEMA = {
  type: "object",
  properties: {
    says: { type: "string" },
    attention: { type: "array", items: { type: "string" } },
    expand: { type: "string" },
    cameo: { type: "string" },
  },
};

type Voice = { says?: string; attention?: string[]; expand?: string; cameo?: string; model: string; primary: string; fallback: boolean };

const voiceCache = new Map<string, Voice>();
const dailyCache = new Map<string, OracleReading>();
const dailyFlight = new Map<string, Promise<OracleReading>>();

function debug(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.KAIROS_AI_DEBUG === "1";
}

function logOracle(reading: OracleReading, ledger: OracleLedger, tokens = { input: 0, output: 0 }, primary = ""): void {
  if (!debug()) return;
  const methods = reading.methods.filter((item) => item.selected).map((item) => item.method).join(", ") || "none";
  console.info(`[ORACLE AI]
Reading ID: ${reading.id}
Classifier: LOCAL
Contract: ${reading.contract ? `${reading.contract.domain}/${reading.contract.questionType}/${reading.contract.answerShape}` : "none"}
Methods: ${methods}
Relevance: ${reading.methods.map((item) => `${item.method}:${item.relevance}`).join(", ")}
Missing: ${reading.contract?.missingInputs.join(", ") || "none"}
Validation: ${reading.validation ? `${reading.validation.ok ? "PASS" : "FAIL"} ${reading.validation.reason}` : "n/a"}
Primary model: ${primary || ledger.model || "none"}
Fallback model used: ${ledger.fallbackModelUsed ? "YES" : "NO"}
LLM call count: ${ledger.llmCalls}
Input tokens: ${tokens.input}
Output tokens: ${tokens.output}
Cache: ${ledger.cache}`);
}

function stamp(reading: OracleReading, ledger: OracleLedger): OracleReading {
  reading.ledger = ledger;
  return reading;
}

function applyVoice(reading: OracleReading, voice: Voice | null): void {
  if (!voice) return;
  const card = [...reading.layers, ...reading.sides.flatMap((side) => side.layers)].find((layer) => layer.id === "tarot")?.result ?? "";
  if (voice.says && voiceAllowed(voice.says, card) && voiceFitsReading(reading, voice.says)) reading.says = voice.says.replace(/\s+/g, " ").trim();
  if (voice.attention?.length === 3 && voice.attention.every((item) => voiceAllowed(item, card) && voiceFitsReading(reading, item))) reading.attention = voice.attention.map((item) => item.trim());
  if (voice.expand && voiceAllowed(voice.expand, card) && voiceFitsReading(reading, voice.expand)) reading.expand = voice.expand.replace(/\s+/g, " ").trim();
  if (voice.cameo && voice.cameo.trim() && voiceAllowed(voice.cameo, card) && reading.topic === "love") reading.cameo = voice.cameo.replace(/\s+/g, " ").trim();
}

function packageFor(reading: OracleReading) {
  return {
    question: reading.question,
    questionType: reading.questionType,
    answerShape: reading.contract?.answerShape ?? "",
    domain: reading.contract?.domain ?? reading.topic,
    timeHorizon: reading.contract?.timeHorizon ?? "",
    contextFacts: reading.contract?.contextFacts ?? [],
    directAnswer: reading.answer?.direct ?? reading.says,
    topic: reading.topic,
    energy: reading.energy,
    synthesis: reading.synthesis,
    signals: reading.signals.map((signal) => ({
      method: signal.name,
      signal: signal.signal,
      strength: signal.strengthLabel,
      raw: signal.raw,
      interpretation: signal.interpretation,
    })),
    layers: reading.layers,
    sides: reading.sides.map((side) => ({ label: side.label, energy: side.energy, tradeoff: side.tradeoff, layers: side.layers })),
    dates: reading.dates.map((day) => ({ date: day.date, label: day.label, band: day.band, action: day.action, actionLabel: day.actionLabel, layers: day.layers })),
    scanned: reading.scanned,
  };
}

async function synthesise(reading: OracleReading): Promise<OracleReading> {
  if (reading.guard !== "none" || !reading.synthesis) {
    const ledger: OracleLedger = {
      promptVersion: ORACLE_PROMPT_VERSION,
      schemaVersion: ORACLE_SCHEMA_VERSION,
      model: "",
      fallbackModelUsed: false,
      generatedAt: new Date().toISOString(),
      classifier: "LOCAL",
      llmCalls: 0,
      cache: "MISS",
    };
    logOracle(reading, ledger);
    return stamp(reading, ledger);
  }
  const fingerprint = oracleFingerprint(reading);
  const cachedVoice = voiceCache.get(fingerprint);
  if (cachedVoice) {
    applyVoice(reading, cachedVoice);
    const ledger: OracleLedger = {
      promptVersion: ORACLE_PROMPT_VERSION,
      schemaVersion: ORACLE_SCHEMA_VERSION,
      model: cachedVoice.model,
      fallbackModelUsed: cachedVoice.fallback,
      generatedAt: new Date().toISOString(),
      classifier: "LOCAL",
      llmCalls: 0,
      cache: "HIT",
    };
    logOracle(reading, ledger, { input: 0, output: 0 }, cachedVoice.primary);
    return stamp(reading, ledger);
  }
  const { value: raw, trace } = await tracedGemini(() => geminiJson(
    SYSTEM,
    JSON.stringify(packageFor(reading)),
    SCHEMA,
    420,
    { temperature: 0.7, topP: 0.9 },
  ));
  const voice = raw && typeof raw === "object" ? raw as { says?: unknown; attention?: unknown; expand?: unknown; cameo?: unknown } : null;
  const stored: Voice = {
    model: trace.served ?? trace.primary,
    primary: trace.primary || trace.served || "",
    fallback: trace.fallback,
    says: typeof voice?.says === "string" ? voice.says : undefined,
    attention: Array.isArray(voice?.attention) ? voice.attention.filter((item): item is string => typeof item === "string").slice(0, 3) : undefined,
    expand: typeof voice?.expand === "string" ? voice.expand : undefined,
    cameo: typeof voice?.cameo === "string" ? voice.cameo : undefined,
  };
  if (stored.attention?.length !== 3) stored.attention = undefined;
  applyVoice(reading, stored);
  if (trace.calls > 0 && (stored.says || stored.expand)) voiceCache.set(fingerprint, stored);
  const ledger: OracleLedger = {
    promptVersion: ORACLE_PROMPT_VERSION,
    schemaVersion: ORACLE_SCHEMA_VERSION,
    model: stored.model,
    fallbackModelUsed: stored.fallback,
    generatedAt: new Date().toISOString(),
    classifier: "LOCAL",
    llmCalls: trace.calls,
    cache: "MISS",
  };
  logOracle(reading, ledger, { input: trace.inputTokens, output: trace.outputTokens }, stored.primary);
  return stamp(reading, ledger);
}

function todayKey(input: OracleInput): string {
  const asOf = input.asOf && /^\d{4}-\d{2}-\d{2}$/.test(input.asOf) ? input.asOf : new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(new Date());
  return dailyKey(input, asOf);
}

export async function readOracle(input: OracleInput): Promise<OracleReading> {
  const mode = input.mode ?? "ask";
  if (mode === "daily" && !input.fresh) {
    const key = todayKey(input);
    const saved = dailyCache.get(key);
    if (saved) {
      logOracle(saved, { ...(saved.ledger ?? {
        promptVersion: ORACLE_PROMPT_VERSION,
        schemaVersion: ORACLE_SCHEMA_VERSION,
        model: "",
        fallbackModelUsed: false,
        generatedAt: new Date().toISOString(),
        classifier: "LOCAL",
        llmCalls: 0,
        cache: "HIT",
      }), llmCalls: 0, cache: "HIT" });
      return saved;
    }
    const pending = dailyFlight.get(key);
    if (pending) return pending;
    const job = synthesise(buildOracle(input)).then((reading) => {
      dailyCache.set(key, reading);
      return reading;
    });
    dailyFlight.set(key, job);
    try {
      return await job;
    } finally {
      dailyFlight.delete(key);
    }
  }
  const reading = await synthesise(buildOracle(input));
  if (mode === "daily" && input.fresh) dailyCache.set(todayKey(input), reading);
  return reading;
}
