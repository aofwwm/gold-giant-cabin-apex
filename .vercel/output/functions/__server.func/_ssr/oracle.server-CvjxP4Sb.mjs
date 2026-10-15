import { geminiJson, tracedGemini } from "./gemini.server-D3PyYOAp.mjs";
import { a as buildOracle, c as oracleFingerprint, i as ORACLE_SCHEMA_VERSION, o as dailyKey, r as ORACLE_PROMPT_VERSION, u as voiceAllowed } from "./oracle-cache-tWnckiID.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/oracle.server-CvjxP4Sb.js
var SYSTEM = `You are 神婆, the voice inside Kairos Oracle.
Interpret only the JSON you are given. The band, the 宜/忌 action, the agreement, and every raw result are already decided.
Do not change them. Do not invent tarot cards, Tong Shu results, I Ching hexagrams, numbers, zodiac animals, dates, planets, houses, or BaZi pillars.
Do not mention BaZi or astrology. Do not mention a method that is absent from signals, layers, and sides.
Do not guarantee an outcome. No percentages. No diagnosis. No investment instruction. No hours of the day.
No destiny, fate, or soulmate.
Voice: observant, dry, lightly mischievous, warm, concise. Synthesise across the methods. Do not paraphrase a single card.
says is one sentence, at most 22 words.
attention is exactly 3 short phrases.
expand is at most 70 words and may name only the signals in the JSON.
If synthesis.mixed is true, say the signs disagree.
If topic is love, cameo may be a short aside mentioning 月老 once. Otherwise cameo is empty.`;
var SCHEMA = {
	type: "object",
	properties: {
		says: { type: "string" },
		attention: {
			type: "array",
			items: { type: "string" }
		},
		expand: { type: "string" },
		cameo: { type: "string" }
	}
};
var voiceCache = /* @__PURE__ */ new Map();
var dailyCache = /* @__PURE__ */ new Map();
var dailyFlight = /* @__PURE__ */ new Map();
function debug() {
	return process.env.KAIROS_AI_DEBUG === "1";
}
function logOracle(reading, ledger, tokens = {
	input: 0,
	output: 0
}, primary = "") {
	if (!debug()) return;
	const methods = reading.methods.filter((item) => item.selected).map((item) => item.method).join(", ") || "none";
	console.info(`[ORACLE AI]
Reading ID: ${reading.id}
Classifier: LOCAL
Methods: ${methods}
Primary model: ${primary || ledger.model || "none"}
Fallback model used: ${ledger.fallbackModelUsed ? "YES" : "NO"}
LLM call count: ${ledger.llmCalls}
Input tokens: ${tokens.input}
Output tokens: ${tokens.output}
Cache: ${ledger.cache}`);
}
function stamp(reading, ledger) {
	reading.ledger = ledger;
	return reading;
}
function applyVoice(reading, voice) {
	if (!voice) return;
	const card = [...reading.layers, ...reading.sides.flatMap((side) => side.layers)].find((layer) => layer.id === "tarot")?.result ?? "";
	if (voice.says && voiceAllowed(voice.says, card)) reading.says = voice.says.replace(/\s+/g, " ").trim();
	if (voice.attention?.length === 3 && voice.attention.every((item) => voiceAllowed(item, card))) reading.attention = voice.attention.map((item) => item.trim());
	if (voice.expand && voiceAllowed(voice.expand, card)) reading.expand = voice.expand.replace(/\s+/g, " ").trim();
	if (voice.cameo && voice.cameo.trim() && voiceAllowed(voice.cameo, card) && reading.topic === "love") reading.cameo = voice.cameo.replace(/\s+/g, " ").trim();
}
function packageFor(reading) {
	return {
		question: reading.question,
		questionType: reading.questionType,
		topic: reading.topic,
		energy: reading.energy,
		synthesis: reading.synthesis,
		signals: reading.signals.map((signal) => ({
			method: signal.name,
			signal: signal.signal,
			strength: signal.strengthLabel,
			raw: signal.raw,
			interpretation: signal.interpretation
		})),
		layers: reading.layers,
		sides: reading.sides.map((side) => ({
			label: side.label,
			energy: side.energy,
			tradeoff: side.tradeoff,
			layers: side.layers
		})),
		dates: reading.dates.map((day) => ({
			date: day.date,
			label: day.label,
			band: day.band,
			action: day.action,
			actionLabel: day.actionLabel,
			layers: day.layers
		})),
		scanned: reading.scanned
	};
}
async function synthesise(reading) {
	if (reading.guard !== "none" || !reading.synthesis) {
		const ledger = {
			promptVersion: ORACLE_PROMPT_VERSION,
			schemaVersion: ORACLE_SCHEMA_VERSION,
			model: "",
			fallbackModelUsed: false,
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			classifier: "LOCAL",
			llmCalls: 0,
			cache: "MISS"
		};
		logOracle(reading, ledger);
		return stamp(reading, ledger);
	}
	const fingerprint = oracleFingerprint(reading);
	const cachedVoice = voiceCache.get(fingerprint);
	if (cachedVoice) {
		applyVoice(reading, cachedVoice);
		const ledger = {
			promptVersion: ORACLE_PROMPT_VERSION,
			schemaVersion: ORACLE_SCHEMA_VERSION,
			model: cachedVoice.model,
			fallbackModelUsed: cachedVoice.fallback,
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			classifier: "LOCAL",
			llmCalls: 0,
			cache: "HIT"
		};
		logOracle(reading, ledger, {
			input: 0,
			output: 0
		}, cachedVoice.primary);
		return stamp(reading, ledger);
	}
	const { value: raw, trace } = await tracedGemini(() => geminiJson(SYSTEM, JSON.stringify(packageFor(reading)), SCHEMA, 420, {
		temperature: .7,
		topP: .9
	}));
	const voice = raw && typeof raw === "object" ? raw : null;
	const stored = {
		model: trace.served ?? trace.primary,
		primary: trace.primary || trace.served || "",
		fallback: trace.fallback,
		says: typeof voice?.says === "string" ? voice.says : void 0,
		attention: Array.isArray(voice?.attention) ? voice.attention.filter((item) => typeof item === "string").slice(0, 3) : void 0,
		expand: typeof voice?.expand === "string" ? voice.expand : void 0,
		cameo: typeof voice?.cameo === "string" ? voice.cameo : void 0
	};
	if (stored.attention?.length !== 3) stored.attention = void 0;
	applyVoice(reading, stored);
	if (trace.calls > 0 && (stored.says || stored.expand)) voiceCache.set(fingerprint, stored);
	const ledger = {
		promptVersion: ORACLE_PROMPT_VERSION,
		schemaVersion: ORACLE_SCHEMA_VERSION,
		model: stored.model,
		fallbackModelUsed: stored.fallback,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		classifier: "LOCAL",
		llmCalls: trace.calls,
		cache: "MISS"
	};
	logOracle(reading, ledger, {
		input: trace.inputTokens,
		output: trace.outputTokens
	}, stored.primary);
	return stamp(reading, ledger);
}
function todayKey(input) {
	const asOf = input.asOf && /^\d{4}-\d{2}-\d{2}$/.test(input.asOf) ? input.asOf : new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(/* @__PURE__ */ new Date());
	return dailyKey(input, asOf);
}
async function readOracle(input) {
	const mode = input.mode ?? "ask";
	if (mode === "daily" && !input.fresh) {
		const key = todayKey(input);
		const saved = dailyCache.get(key);
		if (saved) {
			logOracle(saved, {
				...saved.ledger ?? {
					promptVersion: "oracle-shenpo-1",
					schemaVersion: "says-attention-expand-cameo-1",
					model: "",
					fallbackModelUsed: false,
					generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
					classifier: "LOCAL",
					llmCalls: 0,
					cache: "HIT"
				},
				llmCalls: 0,
				cache: "HIT"
			});
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
//#endregion
export { readOracle };
