import assert from "node:assert/strict";
import { after } from "node:test";
import test from "node:test";
import { buildOracle } from "./oracle.ts";

const originalFetch = globalThis.fetch;
const hits: string[] = [];
let failModel = "";

function seq(values: number[]) {
  let index = 0;
  return () => values[index++] ?? 0.2;
}

function generated(): number {
  return hits.filter((url) => url.includes(":generateContent")).length;
}

globalThis.fetch = async (input: RequestInfo | URL) => {
  const url = String(input);
  if (!url.includes("generativelanguage.googleapis.com")) return originalFetch(input);
  if (url.includes(":generateContent")) {
    hits.push(url);
    const model = /models\/([^:]+):generateContent/.exec(url)?.[1] ?? "";
    if (model === failModel) {
      return new Response(JSON.stringify({ error: { message: "Quota exceeded for generate_content_free_tier. Please retry in 10h37m52s." } }), {
        status: 429,
        headers: { "retry-after": "38000" },
      });
    }
    const voice = { says: "The timing favours opening the conversation, not forcing the outcome.", attention: ["timing", "tone", "expectations"], expand: "The package already holds the signs. Read them, then decide for yourself.", cameo: "" };
    return new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify(voice) }] } }],
      usageMetadata: { promptTokenCount: 20, candidatesTokenCount: 12 },
    }), { status: 200, headers: { "content-type": "application/json" } });
  }
  if (url.includes("/models")) {
    hits.push("list");
    return new Response(JSON.stringify({
      models: [
        { name: "models/gemini-3.8-flash", supportedGenerationMethods: ["generateContent"], description: "Stable Gemini 3.8 Flash" },
        { name: "models/gemini-3.5-flash", supportedGenerationMethods: ["generateContent"], description: "Stable Gemini 3.5 Flash" },
      ],
    }), { status: 200, headers: { "content-type": "application/json" } });
  }
  return new Response("missing", { status: 404 });
};

after(() => {
  globalThis.fetch = originalFetch;
});

process.env.GEMINI_API_KEY = "test-key";
delete process.env.GEMINI_MODEL_OVERRIDE;
delete process.env.GEMINI_ALLOW_PREVIEW;

const { readOracle } = await import("./oracle.server.ts");

const asOf = "2026-10-03";
const promotion = "Is tomorrow a good day to ask my boss for a promotion?";
const draw = [0.4, 0.1, 0.3, 0.2, 0.2, 0.2, 0.2, 0.2];

test("a guard spends no Gemini call and does not redraw", async () => {
  const before = generated();
  const reading = await readOracle({ question: "Do I have cancer?", asOf, rng: seq([0.2, 0.2]) });
  assert.equal(generated(), before);
  assert.equal(reading.ledger?.llmCalls, 0);
  assert.equal(reading.ledger?.classifier, "LOCAL");
  assert.equal(reading.guard, "health");
  assert.equal(reading.layers.length, 0);
});

test("the same locked draw is one synthesis, then a voice-cache hit", async () => {
  const local = buildOracle({ question: promotion, asOf, rng: seq(draw) });
  const before = generated();
  const first = await readOracle({ question: promotion, asOf, rng: seq(draw) });
  assert.equal(generated() - before, 1);
  assert.equal(first.ledger?.llmCalls, 1);
  assert.equal(first.ledger?.cache, "MISS");
  assert.equal(first.ledger?.classifier, "LOCAL");
  assert.equal(first.layers.find((layer) => layer.id === "tarot")?.result, local.layers.find((layer) => layer.id === "tarot")?.result);
  assert.equal(first.layers.find((layer) => layer.id === "iching")?.detail, local.layers.find((layer) => layer.id === "iching")?.detail);
  assert.equal(first.layers.find((layer) => layer.id === "tongShu")?.result, local.layers.find((layer) => layer.id === "tongShu")?.result);
  assert.equal(first.synthesis?.band, local.synthesis?.band);
  assert.equal(first.synthesis?.action, local.synthesis?.action);
  assert.equal(first.synthesis?.agreement, local.synthesis?.agreement);
  assert.deepEqual(first.methods.map((item) => [item.method, item.selected, item.reason]), local.methods.map((item) => [item.method, item.selected, item.reason]));
  const second = await readOracle({ question: promotion, asOf, rng: seq(draw) });
  assert.equal(generated() - before, 1);
  assert.equal(second.ledger?.llmCalls, 0);
  assert.equal(second.ledger?.cache, "HIT");
  assert.equal(second.layers.find((layer) => layer.id === "tarot")?.result, first.layers.find((layer) => layer.id === "tarot")?.result);
});

test("compare and a date window are one synthesis each", async () => {
  const before = generated();
  const compared = await readOracle({
    question: "Should I choose Job A or Job B?",
    mode: "compare",
    asOf,
    rng: seq([0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 8 / 22 + 0.001, 0.8, 0.001, 0.2]),
  });
  assert.equal(compared.sides.length, 2);
  assert.equal(generated() - before, 1);
  assert.equal(compared.ledger?.llmCalls, 1);
  const dated = await readOracle({
    question: "Which day next week should I launch?",
    mode: "dates",
    asOf,
    rng: seq([0.2, 0.2, 0.2, 0.2, 0.2, 0.2]),
  });
  assert.ok(dated.dates.length >= 1);
  assert.equal(generated() - before, 2);
  assert.equal(dated.ledger?.llmCalls, 1);
});

test("today's daily is reused until a deliberate redraw", async () => {
  const before = generated();
  const first = await readOracle({ mode: "daily", question: "What is the energy of today?", asOf, rng: seq([0.42, 0.2, 0.15, 0.2]) });
  assert.equal(generated() - before, 1);
  const second = await readOracle({ mode: "daily", question: "What is the energy of today?", asOf, rng: seq([0.99, 0.01, 0.5]) });
  assert.equal(second.id, first.id);
  assert.equal(second.layers.find((layer) => layer.id === "tarot")?.result, first.layers.find((layer) => layer.id === "tarot")?.result);
  assert.equal(generated() - before, 1);
  const redraw = await readOracle({ mode: "daily", question: "What is the energy of today?", asOf, fresh: true, rng: seq([0.91, 0.11, 0.31, 0.2]) });
  assert.notEqual(redraw.id, first.id);
  assert.equal(generated() - before, 2);
  assert.equal(redraw.ledger?.llmCalls, 1);
});

test("a daily quota 429 is not retried, and the same draw is kept", async () => {
  failModel = "gemini-3.8-flash";
  const values = [0.37, 0.8, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2];
  const question = "Should I change jobs?";
  const local = buildOracle({ question, asOf, rng: seq(values) });
  const before = generated();
  const blockedBefore = hits.filter((url) => url.includes("gemini-3.8-flash")).length;
  const reading = await readOracle({ question, asOf, rng: seq(values) });
  assert.equal(generated() - before, 2);
  assert.equal(reading.ledger?.fallbackModelUsed, true);
  assert.equal(reading.ledger?.llmCalls, 2);
  assert.equal(hits.filter((url) => url.includes("gemini-3.8-flash")).length - blockedBefore, 1);
  assert.equal(reading.layers.find((layer) => layer.id === "tarot")?.result, local.layers.find((layer) => layer.id === "tarot")?.result);
  assert.equal(reading.layers.find((layer) => layer.id === "iching")?.detail, local.layers.find((layer) => layer.id === "iching")?.detail);
  assert.equal(reading.synthesis?.band, local.synthesis?.band);
  assert.equal(reading.synthesis?.agreement, local.synthesis?.agreement);
  const later = generated();
  await readOracle({ question: "Should I leave my current job?", asOf, rng: seq([0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]) });
  assert.equal(generated() - later, 1);
  assert.equal(hits.at(-1)?.includes("gemini-3.5-flash"), true);
  assert.equal(hits.filter((url) => url.includes("gemini-3.8-flash")).length - blockedBefore, 1);
});
