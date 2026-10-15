import { writeFileSync } from "node:fs";
import { geminiJson, kairosModelStatus } from "../src/lib/gemini.server.ts";
import { classifyQuestion, selectMethods } from "../src/lib/oracle.ts";
import { interpretDateBrief } from "../src/lib/dating-intent.ts";
import { interpretFamilyPlan, interpretTravelBrief } from "../src/lib/planning-brief.ts";
import { parseQuickRules } from "../src/lib/today.ts";

const cards = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Star", "The Moon", "The Sun", "Judgement", "The World"];

function objectOf(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

async function modelCase(name: string, run: () => Promise<unknown>) {
  const before = (await kairosModelStatus()).lastServedModel;
  const value = await run();
  const status = await kairosModelStatus();
  const served = status.lastServedModel;
  const record = objectOf(value);
  return { name, ok: record != null, served, changed: served !== before, value };
}

const status = await kairosModelStatus();
const dating = await modelCase("dating-intent", () =>
  geminiJson(
    "Parse a Singapore date-planning brief into JSON. Do not invent venues, addresses, travel times, weather, or prices. budgetMax only if the user stated a number. dateIntent is today, tomorrow, this_friday, this_weekend, or empty. timeOfDay is breakfast, brunch, afternoon, evening, night, or empty. areaText is a region or place name, or empty. budgetLevel is free, cheap, moderate, premium, or empty.",
    "Friday night near Tiong Bahru, under $80, relaxed and conversational.",
    {
      type: "object",
      properties: {
        dateIntent: { type: "string" },
        timeOfDay: { type: "string" },
        areaText: { type: "string" },
        budgetLevel: { type: "string" },
        budgetMax: { type: "number" },
        vibes: { type: "array", items: { type: "string" } },
      },
    },
    400,
  ),
);
const travel = await modelCase("travel-intent", () =>
  geminiJson(
    "Parse a planning brief into JSON. Do not invent ages, coordinates, prices, venues, weather, or travel times. Only name places and constraints that the user actually wrote.",
    "3 nights in Kyoto, food, slow pace.",
    {
      type: "object",
      properties: {
        destinations: { type: "array", items: { type: "string" } },
        nights: { type: "number" },
        pace: { type: "string" },
        mustHave: { type: "array", items: { type: "string" } },
      },
    },
    420,
  ),
);
const family = await modelCase("family-intent", () =>
  geminiJson(
    "Read a family-day request. Return JSON only. Do not invent weather, places, prices, or travel times. interests must be chosen from: animals, science, dinosaurs, art. pace is relaxed, balanced, packed, or empty. setting is indoor, outdoor, either, mix, or empty.",
    "Saturday with the kids, indoor if it rains, science museum, home by 5.",
    {
      type: "object",
      properties: {
        interests: { type: "array", items: { type: "string" } },
        setting: { type: "string" },
        pace: { type: "string" },
      },
    },
    300,
  ),
);
const oracleClass = await modelCase("oracle-classifier-schema", () =>
  geminiJson(
    "Classify the question. questionType is a short snake_case label. topic is career, sign, travel, money, love, family, or general. guard is none, health, or money. Do not answer the question.",
    "Is Friday a good day to sign the contract?",
    {
      type: "object",
      properties: {
        questionType: { type: "string" },
        topic: { type: "string" },
        guard: { type: "string" },
      },
    },
    180,
  ),
);
const oracleVoice = await modelCase("oracle-synthesis", () =>
  geminiJson(
    "You are 神婆. Interpret only the JSON. Do not invent tarot cards, hexagrams, dates, or guarantees. says is one sentence. attention is exactly 3 short phrases. expand is at most 70 words. cameo is empty.",
    JSON.stringify({
      question: "Should I change jobs?",
      energy: "MIXED",
      signals: [{ method: "TAROT", raw: "The Tower upright" }, { method: "I CHING", raw: "䷀ 乾 The Creative" }],
    }),
    {
      type: "object",
      properties: {
        says: { type: "string" },
        attention: { type: "array", items: { type: "string" } },
        expand: { type: "string" },
        cameo: { type: "string" },
      },
    },
    420,
  ),
);
const today = await modelCase("today-line", () =>
  geminiJson(
    "Turn one schedule note into JSON. Use only the words given. kind is task, errand, appointment, or personal. Times are HH:MM 24-hour or empty.",
    JSON.stringify({ text: "Dentist at 3pm", today: "2026-10-03" }),
    {
      type: "object",
      properties: {
        kind: { type: "string" },
        title: { type: "string" },
        start: { type: "string" },
      },
    },
    180,
  ),
);

const voice = objectOf(oracleVoice.value);
const voiceText = `${voice?.says ?? ""} ${voice?.expand ?? ""} ${(Array.isArray(voice?.attention) ? voice.attention : []).join(" ")}`;
const invented = cards.filter((card) => card !== "The Tower" && new RegExp(`\\b${card}\\b`, "i").test(voiceText));
const localDate = interpretDateBrief("Friday night near Tiong Bahru under $80, relaxed and conversational", "2026-10-03");
const localTravel = interpretTravelBrief("3 nights in Kyoto, food, slow pace.");
const localFamily = interpretFamilyPlan("This weekend with the kids, indoor if it rains, science museum, home by 5.", "2026-10-03");
const localToday = parseQuickRules("Dentist at 3pm", "2026-10-03");
const friday = classifyQuestion("Is Friday a good day to sign the contract?");
const fridayMethods = selectMethods({ question: "Is Friday a good day to sign the contract?" });
const jobMethods = selectMethods({ question: "Should I change jobs?" });

const local = {
  dating: {
    dateIntent: localDate.dateIntent,
    timeOfDay: localDate.timeOfDay,
    budgetMax: localDate.budgetMax,
    areaText: localDate.areaText,
    ok: localDate.dateIntent === "this_friday" && localDate.timeOfDay === "night" && localDate.budgetMax === 80 && /tiong/i.test(localDate.areaText ?? ""),
  },
  travel: {
    destinations: localTravel.destinations,
    nights: localTravel.nights,
    pace: localTravel.pace,
    interests: localTravel.interests,
    ok: localTravel.destinations.includes("Kyoto") && localTravel.nights === 3 && localTravel.pace === "relaxed" && localTravel.interests.includes("food"),
  },
  family: {
    dateIntent: localFamily.dateIntent,
    indoorOutdoor: localFamily.indoorOutdoor,
    interests: localFamily.interests,
    endMin: localFamily.endMin,
    ok: localFamily.dateIntent === "this_weekend" && localFamily.indoorOutdoor === "indoor" && localFamily.interests.includes("science") && localFamily.endMin === 17 * 60,
  },
  today: {
    kind: localToday.kind,
    title: localToday.title,
    startMin: localToday.startMin,
    ok: localToday.kind === "appointment" && localToday.startMin === 15 * 60,
  },
  oracleFriday: {
    classified: friday,
    tongShu: fridayMethods.find((method) => method.method === "tong_shu"),
    ok: friday.guard === "none" && fridayMethods.some((method) => method.method === "tong_shu" && method.selected),
  },
  oracleJob: {
    selected: jobMethods.filter((method) => method.selected).map((method) => method.method),
    tongShu: jobMethods.find((method) => method.method === "tong_shu")?.selected ?? false,
    ok: jobMethods.some((method) => method.method === "tarot" && method.selected) && jobMethods.some((method) => method.method === "tong_shu" && !method.selected),
  },
};

function schemaOk(name: string, value: unknown, check: (record: Record<string, unknown>) => boolean): boolean {
  const record = objectOf(value);
  return Boolean(record && check(record));
}

const schemas = {
  dating: schemaOk("dating", dating.value, (record) => typeof record.dateIntent === "string" && typeof record.areaText === "string"),
  travel: schemaOk("travel", travel.value, (record) => Array.isArray(record.destinations) && record.destinations.some((item) => typeof item === "string" && /kyoto/i.test(item))),
  family: schemaOk("family", family.value, (record) => Array.isArray(record.interests)),
  oracleClass: schemaOk("oracle", oracleClass.value, (record) => typeof record.questionType === "string" && typeof record.topic === "string" && typeof record.guard === "string"),
  oracleVoice: schemaOk("voice", oracleVoice.value, (record) => typeof record.says === "string" && Array.isArray(record.attention) && record.attention.length >= 3 && typeof record.expand === "string"),
  today: schemaOk("today", today.value, (record) => typeof record.kind === "string" && typeof record.title === "string"),
};

const finalStatus = await kairosModelStatus();
const report = {
  status: finalStatus,
  served: {
    dating: dating.served,
    travel: travel.served,
    family: family.served,
    oracleClass: oracleClass.served,
    oracleVoice: oracleVoice.served,
    today: today.served,
  },
  schemas,
  inventedCards: invented,
  samples: {
    dating: dating.value,
    travel: travel.value,
    family: family.value,
    oracleClass: oracleClass.value,
    oracleVoice: oracleVoice.value,
    today: today.value,
  },
  local,
};
writeFileSync("/tmp/kairos-ai-report.json", JSON.stringify(report, null, 2));
const blob = JSON.stringify(report);
if (blob.includes("AQ.")) {
  console.error("report contained a key-like token");
  process.exit(2);
}
console.log(JSON.stringify({
  activeModel: finalStatus.activeModel,
  selection: finalStatus.selection,
  stable: finalStatus.stable,
  structuredOutput: finalStatus.structuredOutput,
  quotaDeferred: finalStatus.quotaDeferred,
  chain: finalStatus.chain,
  availableModelCount: finalStatus.availableModelCount,
  generalPurpose: finalStatus.generalPurpose,
  stableModels: finalStatus.stableModels,
  previewModels: finalStatus.previewModels,
  experimentalModels: finalStatus.experimentalModels,
  aliases: finalStatus.aliases,
  reason: finalStatus.reason,
  served: report.served,
  schemas,
  localOk: {
    dating: local.dating.ok,
    travel: local.travel.ok,
    family: local.family.ok,
    today: local.today.ok,
    oracleFriday: local.oracleFriday.ok,
    oracleJob: local.oracleJob.ok,
  },
  invented,
}, null, 2));
const failed = Object.entries(schemas).filter(([, ok]) => !ok).map(([name]) => name);
const localFailed = Object.entries(report.local).filter(([, item]) => !item.ok).map(([name]) => name);
if (failed.length || localFailed.length) {
  console.error("failed", { failed, localFailed });
  process.exit(1);
}
