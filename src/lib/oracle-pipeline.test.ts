import assert from "node:assert/strict";
import test from "node:test";
import { dailyKey, oracleCallPlan, oracleFingerprint } from "./oracle-cache.ts";
import { buildOracle, type OracleReading } from "./oracle.ts";

const asOf = "2026-10-03";

function seq(values: number[]) {
  let index = 0;
  return () => values[index++] ?? 0.2;
}

function face(reading: OracleReading) {
  return {
    questionType: reading.questionType,
    topic: reading.topic,
    guard: reading.guard,
    mode: reading.mode,
    energy: reading.energy,
    methods: reading.methods.map((item) => ({ method: item.method, selected: item.selected, status: item.status, reason: item.reason })),
    layers: reading.layers.map((layer) => ({ id: layer.id, result: layer.result, detail: layer.detail, lean: layer.lean, line: layer.line })),
    sides: reading.sides.map((side) => ({
      label: side.label,
      energy: side.energy,
      layers: side.layers.map((layer) => ({ id: layer.id, result: layer.result, detail: layer.detail, lean: layer.lean })),
    })),
    dates: reading.dates.map((day) => ({
      date: day.date,
      band: day.band,
      action: day.action,
      layers: day.layers.map((layer) => ({ id: layer.id, result: layer.result, detail: layer.detail, lean: layer.lean })),
    })),
    band: reading.synthesis?.band ?? null,
    action: reading.synthesis?.action ?? null,
    agreement: reading.synthesis?.agreement ?? null,
    mixed: reading.synthesis?.mixed ?? null,
    conflict: reading.synthesis?.conflict ?? null,
    goodFor: reading.synthesis?.goodFor ?? [],
    lessFor: reading.synthesis?.lessFor ?? [],
    signals: reading.signals.map((signal) => ({
      method: signal.method,
      signal: signal.signal,
      raw: signal.raw,
      interpretation: signal.interpretation,
      whyItMatters: signal.whyItMatters,
    })),
    says: reading.says,
    attention: reading.attention,
    expand: reading.expand,
  };
}

const FIXTURES = [
  { id: "A", question: "Is tomorrow a good day to ask my boss for a promotion?", mode: "ask" as const, rng: [0.4, 0.1, 0.3, 0.2, 0.2, 0.2, 0.2, 0.2], calls: 1 as const },
  { id: "B", question: "Should I leave my current job?", mode: "ask" as const, rng: [0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2], calls: 1 as const },
  { id: "C", question: "Are we compatible?", mode: "ask" as const, rng: [0.25, 0.7, 0.2, 0.2, 0.2, 0.2], calls: 1 as const, birthDate: "1990-05-17", birthDateB: "1992-11-03" },
  { id: "D", question: "Which day next week should I launch?", mode: "dates" as const, rng: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2], calls: 1 as const },
  { id: "E", question: "Should I choose Job A or Job B?", mode: "compare" as const, rng: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 8 / 22 + 0.001, 0.8, 0.001, 0.2], calls: 1 as const },
  { id: "F", question: "Should I change jobs?", mode: "ask" as const, rng: [0.37, 0.8, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2], calls: 1 as const },
  { id: "G", question: "What is the energy of today?", mode: "daily" as const, rng: [0.42, 0.2, 0.15, 0.2, 0.2, 0.2, 0.2, 0.2], calls: 1 as const },
];

for (const fixture of FIXTURES) {
  test(`golden ${fixture.id} keeps the same divination face and one local plan`, () => {
    const input = {
      question: fixture.question,
      mode: fixture.mode,
      asOf,
      birthDate: fixture.birthDate,
      birthDateB: fixture.birthDateB,
      hint: fixture.mode === "compare" ? "compare" : fixture.mode === "dates" ? "which day" : "",
    };
    const plan = oracleCallPlan(input);
    assert.equal(plan.classifier, "LOCAL");
    assert.equal(plan.llmCalls, fixture.calls);
    const left = buildOracle({ ...input, rng: seq(fixture.rng) });
    const right = buildOracle({ ...input, rng: seq(fixture.rng) });
    assert.deepEqual(face(left), face(right));
    assert.equal(oracleFingerprint(left), oracleFingerprint(right));
    assert.ok(left.methods.every((item) => item.reason.trim().length > 8));
    if (left.synthesis) {
      assert.ok(left.synthesis.goodFor.length > 0);
      assert.ok(left.synthesis.lessFor.length > 0);
      assert.ok(left.signals.length > 0);
      assert.ok(left.signals.every((signal) => signal.interpretation.trim().length > 12 && signal.whyItMatters.trim().length > 12));
      assert.ok(left.expand.length > 40);
      assert.equal(left.attention.length, 3);
    }
    if (fixture.id === "A") {
      assert.equal(left.questionType, "career_timing");
      assert.equal(left.methods.find((item) => item.method === "tong_shu")?.selected, true);
    }
    if (fixture.id === "B") {
      assert.equal(left.methods.find((item) => item.method === "tong_shu")?.selected, false);
      assert.equal(left.methods.find((item) => item.method === "tarot")?.selected, true);
      assert.equal(left.methods.find((item) => item.method === "iching")?.selected, true);
    }
    if (fixture.id === "C") {
      assert.equal(left.methods.find((item) => item.method === "zodiac")?.selected, true);
      assert.equal(left.methods.find((item) => item.method === "tarot")?.selected, true);
      assert.equal(left.methods.find((item) => item.method === "iching")?.selected, false);
      assert.match(left.layers.find((layer) => layer.id === "zodiac")?.result ?? "", /1990|1992|Rat|Ox|Tiger|Rabbit|Dragon|Snake|Horse|Goat|Monkey|Rooster|Dog|Pig/);
    }
    if (fixture.id === "D") {
      assert.equal(left.mode, "dates");
      assert.ok(left.dates.length >= 1);
      assert.ok(left.dates.length < 8);
      assert.equal(plan.llmCalls, 1);
    }
    if (fixture.id === "E") {
      assert.equal(left.mode, "compare");
      assert.equal(left.sides.length, 2);
      assert.equal(plan.llmCalls, 1);
    }
    if (fixture.id === "F") {
      assert.equal(left.layers.find((layer) => layer.id === "tarot")?.result, "Strength");
      assert.equal(left.synthesis?.agreement, "MIXED");
      assert.equal(left.synthesis?.mixed, true);
    }
    if (fixture.id === "G") {
      assert.equal(left.mode, "daily");
      assert.ok(left.layers.some((layer) => layer.id === "tongShu"));
    }
  });
}

test("a health guard is local and spends no synthesis call", () => {
  const plan = oracleCallPlan({ question: "Do I have cancer?" });
  assert.equal(plan.classifier, "LOCAL");
  assert.equal(plan.llmCalls, 0);
  const reading = buildOracle({ question: "Do I have cancer?", asOf, rng: seq([0.2]) });
  assert.equal(reading.guard, "health");
  assert.equal(reading.layers.length, 0);
  assert.equal(reading.synthesis, null);
});

test("fingerprint follows the draw, not the question text alone", () => {
  const reading = buildOracle({ question: "Should I change jobs?", asOf, rng: seq([0.37, 0.8, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]) });
  const sameQuestion = buildOracle({ question: "Should I change jobs?", asOf, rng: seq([0.9, 0.1, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]) });
  assert.notEqual(reading.layers.find((layer) => layer.id === "tarot")?.result, sameQuestion.layers.find((layer) => layer.id === "tarot")?.result);
  assert.notEqual(oracleFingerprint(reading), oracleFingerprint(sameQuestion));
  const moved = structuredClone(reading);
  const tarot = moved.layers.find((layer) => layer.id === "tarot");
  assert.ok(tarot);
  tarot.result = "The Moon";
  assert.notEqual(oracleFingerprint(moved), oracleFingerprint(reading));
  assert.equal(moved.synthesis?.band, reading.synthesis?.band);
});

test("daily reuse key changes with the day and the profile, not the prose", () => {
  const day = dailyKey({ birthDate: "1990-05-17", birthDateB: "" }, "2026-10-04");
  assert.equal(day, dailyKey({ birthDate: "1990-05-17", birthDateB: "" }, "2026-10-04"));
  assert.notEqual(day, dailyKey({ birthDate: "1991-01-01", birthDateB: "" }, "2026-10-04"));
  assert.notEqual(day, dailyKey({ birthDate: "1990-05-17", birthDateB: "" }, "2026-10-05"));
  assert.notEqual(day, dailyKey({ birthDate: "1990-05-17", include: ["tarot"] }, "2026-10-04"));
});

test("an unclear question still classifies locally", () => {
  const plan = oracleCallPlan({ question: "What should I do?" });
  assert.equal(plan.classifier, "LOCAL");
  assert.equal(plan.llmCalls, 1);
  const reading = buildOracle({ question: "What should I do?", asOf, rng: seq([0.2, 0.2, 0.2, 0.2]) });
  assert.equal(reading.questionType, "curiosity");
  assert.ok(reading.signals.length > 0);
});
