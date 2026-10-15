import { n as noteCall, r as noteFailure } from "./provider-usage-CqiDrKv8.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region node_modules/.nitro/vite/services/ssr/assets/gemini.server-D3PyYOAp.js
/** How long a 429 should keep a model out of the retry loop. No network. */
function quotaPauseMs(message, retryAfter) {
	const match = /retry in\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+(?:\.\d+)?)s)?/i.exec(message);
	if (match && (match[1] || match[2] || match[3])) {
		const hours = Number(match[1] || 0);
		const minutes = Number(match[2] || 0);
		const seconds = Number(match[3] || 0);
		return Math.round(((hours * 60 + minutes) * 60 + seconds) * 1e3);
	}
	const header = Number(retryAfter);
	if (retryAfter && Number.isFinite(header) && header >= 0) return Math.min(header * 1e3, 864e5);
	if (/quota|resource_exhausted|daily/i.test(message)) return 216e5;
	return 6e4;
}
var SPECIALISED = [
	"image",
	"tts",
	"embed",
	"audio",
	"live",
	"robot",
	"computer-use",
	"transcribe",
	"translate",
	"lyria",
	"veo",
	"aqa",
	"research",
	"antigravity",
	"customtools",
	"banana",
	"omni",
	"native",
	"clip",
	"realtime",
	"imagen"
];
var VERSION = /^gemini-(\d+)(?:\.(\d+))?-(flash-lite|flash|pro)\b/;
var TIER_SCORE = {
	flash: 3,
	pro: 2,
	"flash-lite": 1
};
function geminiModelId(name) {
	return name.trim().replace(/^models\//, "");
}
function isSpecialised(id) {
	const hay = id.toLowerCase();
	return SPECIALISED.some((token) => hay.includes(token));
}
function capabilitiesOf(model) {
	const capabilities = ["generateContent", "text-generation"];
	if (model.thinking) capabilities.push("reasoning");
	return capabilities;
}
function stabilityOf(id, description) {
	if (id.endsWith("-latest")) return "alias";
	if (/(?:^|-)exp(?:-|$)|experimental/.test(id)) return "experimental";
	if (id.includes("-preview") || /\bpreview\b/i.test(description)) return "preview";
	return "stable";
}
function classifyGeminiModel(model) {
	const id = geminiModelId(model.name || "");
	if (!id.startsWith("gemini-") || isSpecialised(id)) return "excluded";
	if (!(model.supportedGenerationMethods ?? []).includes("generateContent")) return "excluded";
	if (model.inputTokenLimit != null && model.inputTokenLimit < 32e3) return "excluded";
	const stability = stabilityOf(id, model.description ?? "");
	if (stability === "alias") return "alias";
	const match = VERSION.exec(id);
	if (!match) return "excluded";
	const tier = match[3];
	return {
		id,
		stability,
		major: Number(match[1]),
		minor: match[2] ? Number(match[2]) : 0,
		tier,
		capabilities: capabilitiesOf(model)
	};
}
function byNewest(a, b) {
	if (a.major !== b.major) return b.major - a.major;
	if (a.minor !== b.minor) return b.minor - a.minor;
	const tier = TIER_SCORE[b.tier] - TIER_SCORE[a.tier];
	if (tier !== 0) return tier;
	return a.id.localeCompare(b.id);
}
function skipReason(model, options) {
	if ((options.blocked ?? []).map(geminiModelId).includes(model.id)) return "Skipped because the compatibility probe could not use it.";
	if (model.stability === "preview" && !options.allowPreview) return "Preview model. GEMINI_ALLOW_PREVIEW is false.";
	if (model.stability === "experimental" && !options.allowExperimental) return "Experimental model. Left out unless GEMINI_ALLOW_EXPERIMENTAL is set.";
	if (model.stability === "alias") return "Alias, not a concrete model id.";
	return "Older or lighter than the selected stable model.";
}
function selection(partial) {
	return {
		...partial,
		passedOver: partial.passedOver ?? []
	};
}
function selectKairosGeminiModel(listed, options) {
	const checkedAt = options.checkedAt ?? (/* @__PURE__ */ new Date()).toISOString();
	const fallbackModel = geminiModelId(options.fallbackModel || "gemini-3.5-flash");
	const blocked = new Set((options.blocked ?? []).map(geminiModelId));
	const generalPurpose = [];
	const aliases = [];
	let excluded = 0;
	for (const model of listed) {
		const id = geminiModelId(model.name || "");
		if (id.endsWith("-latest") && id.startsWith("gemini-") && !isSpecialised(id)) {
			aliases.push(id);
			continue;
		}
		const classified = classifyGeminiModel(model);
		if (classified === "alias") aliases.push(id);
		else if (classified === "excluded") excluded += 1;
		else generalPurpose.push(classified);
	}
	const catalog = {
		generalPurpose,
		stable: generalPurpose.filter((model) => model.stability === "stable").map((model) => model.id),
		preview: generalPurpose.filter((model) => model.stability === "preview").map((model) => model.id),
		experimental: generalPurpose.filter((model) => model.stability === "experimental").map((model) => model.id),
		aliases,
		excluded
	};
	const fallback = (reason) => selection({
		model: fallbackModel,
		source: "fallback",
		stability: stabilityOf(fallbackModel, "") === "alias" ? "stable" : stabilityOf(fallbackModel, ""),
		capabilities: [
			"generateContent",
			"text-generation",
			"structured-json"
		],
		checkedAt,
		reason,
		availableCount: listed.length,
		chain: [fallbackModel],
		catalog
	});
	if (options.listFailed) return fallback(`Model list failed. Using configured fallback ${fallbackModel}.`);
	const override = geminiModelId(options.override || "");
	if (override) {
		if (override.endsWith("-latest")) {} else {
			const found = generalPurpose.find((model) => model.id === override);
			if (found && !blocked.has(override)) return selection({
				model: found.id,
				source: "override",
				stability: found.stability === "alias" ? "stable" : found.stability,
				capabilities: found.capabilities,
				checkedAt,
				reason: "GEMINI_MODEL_OVERRIDE is set and this model is available to the key.",
				availableCount: listed.length,
				chain: [found.id],
				catalog
			});
		}
	}
	const pool = generalPurpose.filter((model) => {
		if (blocked.has(model.id)) return false;
		if (model.stability === "stable") return true;
		if (model.stability === "preview") return options.allowPreview;
		if (model.stability === "experimental") return options.allowExperimental;
		return false;
	});
	pool.sort(byNewest);
	const chosen = pool[0];
	if (!chosen) return fallback(`${override ? `Override ${override} is not an available general-purpose model, and no compatible model remained.` : "No compatible general-purpose Gemini model remained."} Using configured fallback ${fallbackModel}.`);
	const chain = pool.slice(0, 4).map((model) => model.id);
	const passedOver = generalPurpose.filter((model) => model.id !== chosen.id).filter((model) => model.major > chosen.major || model.major === chosen.major && model.minor > chosen.minor || model.stability !== "stable").sort(byNewest).slice(0, 16).map((model) => ({
		model: model.id,
		reason: skipReason(model, options)
	}));
	const overrideNote = override ? ` Override ${override} was not used because it is not an available concrete general-purpose model.` : "";
	return selection({
		model: chosen.id,
		source: "discovered",
		stability: chosen.stability === "alias" ? "stable" : chosen.stability,
		capabilities: chosen.capabilities,
		checkedAt,
		reason: `Newest ${chosen.stability} general-purpose ${chosen.tier} model available to this key (generation ${chosen.major}.${chosen.minor}).${overrideNote}`,
		availableCount: listed.length,
		chain,
		passedOver,
		catalog
	});
}
/** Server-only Gemini auth key. Never import this module from client code. */
var GEMINI_API_KEY = "AQ.Ab8RN6LxSUP9NJ-DV30M2FaYSdzS4aCBLgUu5fA012y1Le65YA";
var KAIROS_VOICE = `You are Kairos (良辰吉日), a Singapore group-planning voice.
For a date: a quick funny Tong Shu line with 宜 and 忌, a humorous tarot aside, and light Singlish boss advice.
Never claim Tong Shu, tarot, zodiac, or numerology predicts success, approval, or a probability.
No percentages. No participant names. Humans still decide.
For food and outings: talk only about the real places you are given. Do not invent eateries, hawker centres, prices, hours, ratings, or reviews.`;
var cached = null;
var inflight = null;
var lastServedModel = null;
var servedNotes = /* @__PURE__ */ new Set();
var quotaUntil = /* @__PURE__ */ new Map();
var traces = new AsyncLocalStorage();
async function tracedGemini(run) {
	const trace = {
		calls: 0,
		inputTokens: 0,
		outputTokens: 0,
		modelsTried: [],
		served: null,
		primary: "",
		fallback: false
	};
	return {
		value: await traces.run(trace, run),
		trace
	};
}
function noteTrace(model, text, served) {
	const trace = traces.getStore();
	if (!trace) return;
	trace.calls += 1;
	if (!trace.modelsTried.includes(model)) trace.modelsTried.push(model);
	try {
		const usage = JSON.parse(text).usageMetadata;
		trace.inputTokens += usage?.promptTokenCount ?? 0;
		trace.outputTokens += usage?.candidatesTokenCount ?? 0;
	} catch {}
	if (served) {
		trace.served = model;
		trace.fallback = Boolean(trace.primary && model !== trace.primary);
	}
}
function readKey() {
	return process.env.GEMINI_API_KEY?.trim() || GEMINI_API_KEY;
}
function flag(name) {
	const value = process.env[name]?.trim().toLowerCase();
	return value === "1" || value === "true" || value === "yes";
}
function refreshMs() {
	const raw = Number(process.env.GEMINI_MODEL_REFRESH_MS);
	if (!Number.isFinite(raw) || raw <= 0) return 216e5;
	return Math.max(6e4, raw);
}
function debugLogs() {
	return process.env.KAIROS_AI_DEBUG === "1";
}
function answerText(body) {
	return (body?.candidates?.[0]?.content?.parts ?? []).filter((part) => part.text && !part.thought).map((part) => part.text).join("").trim();
}
function extractJson(text) {
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("no json");
	return JSON.parse(text.slice(start, end + 1));
}
function geminiSchema(schema) {
	if (Array.isArray(schema)) return schema.map((item) => geminiSchema(item));
	if (!schema || typeof schema !== "object") return schema;
	const next = {};
	for (const [key, value] of Object.entries(schema)) {
		if (key === "additionalProperties") continue;
		next[key] = geminiSchema(value);
	}
	return next;
}
function selectionSource(source) {
	return source === "discovered" ? "automatic" : source;
}
function logSelection(selection, through) {
	if (!debugLogs()) return;
	console.info(`[KAIROS AI]
Selected Gemini model: ${selection.model}
Stability: ${selection.stability}
Selection source: ${selectionSource(selection.source)}
Available through API key: ${through}`);
	if (selection.source === "fallback") console.info(`[KAIROS AI] Fallback model: ${selection.model}. ${selection.reason}`);
}
function remember(selected, served) {
	lastServedModel = served;
	if (served === selected || servedNotes.has(served)) return;
	servedNotes.add(served);
	if (!debugLogs()) return;
	console.info(`[KAIROS AI]\nCall served by ${served}. Selected model remains ${selected}.`);
}
async function post(model, body) {
	noteCall("gemini", model);
	const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-goog-api-key": readKey()
		},
		signal: AbortSignal.timeout(18e3),
		body: JSON.stringify(body)
	});
	const text = await res.text();
	noteTrace(model, text, res.status === 200);
	if (res.status !== 200) noteFailure("gemini", model, `HTTP ${res.status}`);
	return {
		status: res.status,
		text,
		retryAfter: res.headers.get("retry-after")
	};
}
function holdQuota(model, text, retryAfter) {
	const pause = quotaPauseMs(text, retryAfter);
	const until = Date.now() + Math.max(pause, 1e3);
	quotaUntil.set(model, until);
	if (cached && !cached.deferred.includes(model)) cached.deferred = [...cached.deferred, model];
}
function quotaBlocked(model) {
	const until = quotaUntil.get(model);
	if (!until) return false;
	if (until <= Date.now()) {
		quotaUntil.delete(model);
		if (cached) cached.deferred = cached.deferred.filter((item) => item !== model);
		return false;
	}
	return true;
}
function payload(system, user, maxTokens, thinking, schema, sample) {
	return {
		systemInstruction: system ? { parts: [{ text: system }] } : void 0,
		contents: [{
			role: "user",
			parts: [{ text: user }]
		}],
		generationConfig: {
			temperature: sample?.temperature ?? .4,
			...sample?.topP != null ? { topP: sample.topP } : {},
			maxOutputTokens: Math.max(maxTokens, 64),
			...thinking ? { thinkingConfig: { thinkingBudget: 0 } } : {},
			...schema ? {
				responseMimeType: "application/json",
				responseSchema: geminiSchema(schema)
			} : {}
		}
	};
}
async function once(model, system, user, maxTokens, schema, sample) {
	let response = await post(model, payload(system, user, maxTokens, true, schema, sample));
	if (response.status === 400 && /thinking/i.test(response.text)) response = await post(model, payload(system, user, maxTokens, false, schema, sample));
	return response;
}
async function listModels() {
	const models = [];
	let pageToken = "";
	for (let page = 0; page < 20; page += 1) {
		const url = new URL("https://generativelanguage.googleapis.com/v1beta/models");
		url.searchParams.set("pageSize", "100");
		if (pageToken) url.searchParams.set("pageToken", pageToken);
		const res = await fetch(url, {
			headers: { "x-goog-api-key": readKey() },
			signal: AbortSignal.timeout(15e3)
		});
		if (!res.ok) throw new Error(`model-list ${res.status}`);
		const body = await res.json();
		models.push(...body.models ?? []);
		pageToken = body.nextPageToken || "";
		if (!pageToken) break;
	}
	return models;
}
function optionsFromEnv(blocked = []) {
	return {
		allowPreview: flag("GEMINI_ALLOW_PREVIEW"),
		allowExperimental: flag("GEMINI_ALLOW_EXPERIMENTAL"),
		override: process.env.GEMINI_MODEL_OVERRIDE?.trim() || "",
		fallbackModel: process.env.GEMINI_FALLBACK_MODEL?.trim() || "gemini-3.5-flash",
		checkedAt: (/* @__PURE__ */ new Date()).toISOString(),
		blocked
	};
}
async function loadModel() {
	if (!readKey()) {
		const selection = selectKairosGeminiModel([], {
			...optionsFromEnv(),
			listFailed: true,
			checkedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		const cache = {
			selection,
			structuredOutput: "unverified",
			through: "no",
			deferred: [],
			expiresAt: Date.now() + Math.min(refreshMs(), 3e5)
		};
		logSelection(selection, "no");
		return cache;
	}
	try {
		const selection = selectKairosGeminiModel(await listModels(), optionsFromEnv());
		const through = selection.source === "fallback" ? "unverified" : "yes";
		const ttl = selection.source === "fallback" ? Math.min(refreshMs(), 3e5) : refreshMs();
		logSelection(selection, through);
		return {
			selection,
			structuredOutput: "unverified",
			through,
			deferred: [],
			expiresAt: Date.now() + ttl
		};
	} catch {
		const selection = selectKairosGeminiModel([], {
			...optionsFromEnv(),
			listFailed: true
		});
		logSelection(selection, "unverified");
		console.info(`[KAIROS AI] Model discovery failed. Fallback model: ${selection.model}.`);
		return {
			selection,
			structuredOutput: "unverified",
			through: "unverified",
			deferred: [],
			expiresAt: Date.now() + Math.min(refreshMs(), 3e5)
		};
	}
}
function peekKairosModel() {
	const selection = cached?.selection;
	const mode = !selection ? "NOT_LOADED" : selection.source === "discovered" ? "AUTO" : selection.source === "override" ? "OVERRIDE" : "FALLBACK";
	return {
		activeModel: selection?.model || process.env.GEMINI_MODEL_OVERRIDE?.trim() || "gemini-3.5-flash",
		selection: mode,
		lastServed: lastServedModel
	};
}
async function resolveKairosGeminiModel() {
	if (cached && Date.now() < cached.expiresAt) return cached.selection;
	if (!inflight) inflight = loadModel().finally(() => {
		inflight = null;
	});
	cached = await inflight;
	return cached.selection;
}
function answered(text) {
	try {
		return answerText(JSON.parse(text)) || null;
	} catch {
		return null;
	}
}
function jsonReady(text) {
	try {
		extractJson(text);
		return true;
	} catch {
		return false;
	}
}
async function generate(system, user, maxTokens, schema, sample) {
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
				const plain = await once(model, system, user, maxTokens, void 0, sample);
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
		} catch {}
	}
	return null;
}
async function geminiText(system, user, maxTokens, sample) {
	return generate(system, user, maxTokens, void 0, sample);
}
async function geminiJson(system, user, schema, maxTokens, sample) {
	const text = await generate(`${system}\nReply with one JSON object only.`, user, maxTokens, schema, sample);
	if (!text) return null;
	try {
		return extractJson(text);
	} catch {
		return null;
	}
}
//#endregion
export { KAIROS_VOICE, geminiJson, geminiText, peekKairosModel, tracedGemini };
