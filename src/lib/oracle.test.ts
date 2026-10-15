import assert from "node:assert/strict";
import test from "node:test";
import { bandFromScore, buildOracle, castIChing, classifyQuestion, cycleYears, dateNumber, dateSpan, dayPillar, drawIChing, drawTarot, lifePath, lunarZodiac, oracleAvailability, overallEnergy, personalDay, personalYear, selectMethods, tongShuLayer, voiceFitsReading, type OracleMethodId, type OracleReading } from "./oracle.ts";
import { answerFits, parseQuestionContract } from "./oracle-contract.ts";

const asOf = "2026-10-03";

function seq(values: number[]) {
  let index = 0;
  return () => values[index++] ?? 0.2;
}

function signalIds(reading: OracleReading): Set<string> {
  return new Set(
    [...reading.layers, ...reading.sides.flatMap((side) => side.layers), ...reading.dates.flatMap((day) => day.layers)].map((layer) => layer.id),
  );
}

const LAYER_OF = {
  tong_shu: "tongShu",
  tarot: "tarot",
  iching: "iching",
  numerology: "numerology",
  zodiac: "zodiac",
  bazi: "bazi",
} as const;

function methodsMatchSignals(reading: OracleReading, extra: { birthDate?: string; include?: OracleMethodId[] } = {}) {
  const ids = signalIds(reading);
  for (const method of reading.methods) {
    assert.ok(method.reason.trim().length > 8, method.method);
    if (method.method === "astrology" || method.method === "bazi") {
      assert.equal(method.selected, false);
      assert.equal(method.status, "not_connected");
      continue;
    }
    assert.equal(ids.has(LAYER_OF[method.method]), method.selected, `${method.method} reason: ${method.reason}`);
  }
  assert.deepEqual(
    reading.methods,
    selectMethods({
      question: reading.question,
      mode: reading.mode === "daily" ? "daily" : reading.mode === "dates" ? "dates" : reading.mode === "compare" ? "compare" : "ask",
      asOf,
      birthDate: extra.birthDate ?? "",
      include: extra.include,
    }),
  );
}

test("tomorrow’s promotion ask is career timing, not a guarantee", () => {
  const question = "Is tomorrow a good time to talk to my boss about promotion?";
  const classified = classifyQuestion(question);
  assert.equal(classified.questionType, "career_timing");
  assert.equal(classified.guard, "none");
  const reading = buildOracle({ question, asOf, rng: seq([0.4, 0.1, 0.3]) });
  assert.equal(reading.questionType, "career_timing");
  assert.equal(reading.methods.find((item) => item.method === "tong_shu")?.selected, true);
  assert.match(reading.methods.find((item) => item.method === "tong_shu")?.reason ?? "", /timing|auspicious/i);
  assert.equal(reading.methods.find((item) => item.method === "tarot")?.selected, true);
  assert.ok(reading.layers.some((layer) => layer.id === "tongShu"));
  assert.ok(reading.layers.some((layer) => layer.id === "iching"));
  assert.ok(reading.layers.some((layer) => layer.id === "numerology"));
  assert.ok(reading.layers.some((layer) => layer.id === "tarot"));
  assert.equal(reading.layers.some((layer) => layer.id === "bazi"), false);
  assert.equal(reading.bazi, null);
  assert.equal(reading.methods.find((item) => item.method === "astrology")?.status, "not_connected");
  assert.ok(reading.synthesis);
  assert.ok(["大吉", "吉", "中吉", "中", "中凶", "凶"].includes(reading.synthesis?.band ?? ""));
  assert.ok(["宜", "忌", "平"].includes(reading.synthesis?.action ?? ""));
  assert.equal(reading.signals.find((item) => item.method === "tong_shu")?.weight, 1);
  assert.ok((reading.signals.find((item) => item.method === "tarot")?.weight ?? 1) < 0.5);
  methodsMatchSignals(reading);
  assert.doesNotMatch(reading.says, /guarantee|definitely|promoted/i);
  assert.doesNotMatch(reading.energy, /%/);
  assert.equal(reading.energy.includes("/"), false);
});

test("Job A or Job B compares two draws and does not crown a winner", () => {
  const reading = buildOracle({
    question: "Should I take Job A or Job B?",
    asOf,
    rng: seq([0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 8 / 22 + 0.001, 0.8, 0.001, 0.2]),
  });
  assert.equal(reading.mode, "compare");
  assert.equal(reading.sides.length, 2);
  assert.notEqual(reading.sides[0]?.layers.find((layer) => layer.id === "tarot")?.result, reading.sides[1]?.layers.find((layer) => layer.id === "tarot")?.result);
  assert.equal(reading.methods.find((item) => item.method === "tong_shu")?.selected, false);
  assert.match(reading.methods.find((item) => item.method === "tong_shu")?.reason ?? "", /not primarily about date or timing/i);
  methodsMatchSignals(reading);
  assert.doesNotMatch(`${reading.says} ${reading.expand}`, /winner|guarantee/i);
});

test("a question about dying is refused, even with a birth date", () => {
  const reading = buildOracle({
    question: "i am 36. female. married no kids. when will be a good time to die?",
    asOf,
    birthDate: "1990-01-13",
    rng: seq([0.2, 0.4, 0.6]),
  });
  assert.equal(reading.guard, "harm");
  assert.equal(reading.layers.length, 0);
  assert.equal(reading.dates.length, 0);
  assert.equal(reading.synthesis, null);
  assert.equal(reading.methods.some((item) => item.selected), false);
  assert.match(reading.says, /will not name a time to die/i);
  assert.match(reading.says, /1767|988/);
  assert.doesNotMatch(`${reading.says} ${reading.expand}`, /favourable|吉|Tong Shu|tarot/i);
  assert.equal(classifyQuestion("I'm dying to know if Friday is a good day to sign").guard, "none");
  assert.equal(classifyQuestion("When is a good day to pass away?").guard, "harm");
});

test("a health question is not given a divination diagnosis", () => {
  const reading = buildOracle({ question: "Do I have cancer?", asOf, rng: seq([0.2, 0.2]) });
  assert.equal(reading.guard, "health");
  assert.equal(reading.layers.length, 0);
  assert.equal(reading.dates.length, 0);
  assert.equal(reading.methods.some((item) => item.selected), false);
  assert.match(reading.says, /clinician|doctor/i);
  assert.doesNotMatch(reading.says, /Strength|Hermit|cancer/i);
  assert.doesNotMatch(reading.used, /divinity/i);
});

test("a stock promise is not treated as an investment forecast", () => {
  const reading = buildOracle({ question: "Will this stock definitely double?", asOf, rng: seq([0.2, 0.2]) });
  assert.equal(reading.guard, "money");
  assert.equal(reading.energy, "UNCLEAR");
  assert.equal(reading.layers.length, 0);
  assert.equal(reading.methods.some((item) => item.selected), false);
  assert.match(reading.says, /broker|profit/i);
  assert.doesNotMatch(reading.says, /buy|sell|double your/i);
});

test("the day pillar for 1 Jan 2000 is 戊午, and numbers are calculated", () => {
  assert.equal(dayPillar("2000-01-01").label, "戊午");
  assert.equal(dateNumber("2026-10-04"), dateNumber("2026-10-04"));
  assert.equal(lifePath("1990-05-17"), lifePath("1990-05-17"));
  const day = personalDay("1990-05-17", "2026-10-04");
  assert.ok(day >= 1 && day <= 33);
  assert.equal(personalDay("1990-05-17", "2026-10-04"), day);
});

test("picking a date ranks by timing rules, not by the card draw", () => {
  const first = buildOracle({ question: "What is a good day next week to launch?", mode: "dates", asOf, windowDays: 7, rng: seq([0.1, 0.1, 0.9]) });
  const second = buildOracle({ question: "What is a good day next week to launch?", mode: "dates", asOf, windowDays: 7, rng: seq([0.9, 0.9, 0.1]) });
  assert.equal(first.mode, "dates");
  assert.equal(first.dates.length, 3);
  assert.deepEqual(first.dates.map((item) => item.date), second.dates.map((item) => item.date));
  assert.ok(first.dates.every((item) => item.layers.some((layer) => layer.id === "tongShu")));
  assert.equal(first.methods.find((item) => item.method === "tong_shu")?.selected, true);
  assert.match(first.methods.find((item) => item.method === "tong_shu")?.reason ?? "", /date|timing|auspicious/i);
  assert.equal(first.methods.find((item) => item.method === "tarot")?.selected, false);
  methodsMatchSignals(first);
  assert.doesNotMatch(first.says, /guarantee|certain win/i);
});

test("drawing again can change the card", () => {
  const upright = drawTarot(seq([8 / 22 + 0.001, 0.8]));
  const another = drawTarot(seq([0 / 22 + 0.001, 0.1]));
  assert.equal(upright.result, "Strength");
  assert.equal(upright.detail, "Upright");
  assert.notEqual(upright.result, another.result);
});

test("the I Ching table has a distinct figure for every cast", () => {
  const figures = new Set(Array.from({ length: 64 }, (_, index) => castIChing(index).detail));
  const names = new Set(Array.from({ length: 64 }, (_, index) => castIChing(index).result));
  assert.equal(figures.size, 64);
  assert.equal(names.size, 64);
});

test("overall energy stays qualitative", () => {
  assert.equal(overallEnergy(["favourable", "wait"]), "MIXED");
  assert.equal(overallEnergy(["favourable", "caution"]), "FAVOURABLE WITH CAUTION");
  assert.equal(overallEnergy(["wait"]), "BETTER TO WAIT");
  assert.equal(overallEnergy([]), "UNCLEAR");
});

test("BaZi and astrology stay disconnected, even with a birth date", () => {
  const reading = buildOracle({
    question: "Are we compatible?",
    asOf,
    birthDate: "1990-05-17",
    birthTime: "08:30",
    birthPlace: "Singapore",
    rng: seq([0.2, 0.8, 0.4]),
  });
  assert.equal(reading.bazi, null);
  assert.equal(reading.layers.some((layer) => layer.id === "bazi"), false);
  assert.equal(reading.sides.some((side) => side.layers.some((layer) => layer.id === "bazi")), false);
  assert.doesNotMatch(reading.layers.map((layer) => `${layer.result} ${layer.detail}`).join(" "), /pillar|Partial/);
  assert.equal(reading.methods.find((item) => item.method === "bazi")?.status, "not_connected");
  assert.equal(reading.methods.find((item) => item.method === "bazi")?.selected, false);
  assert.equal(reading.methods.find((item) => item.method === "astrology")?.status, "not_connected");
  assert.equal(reading.methods.find((item) => item.method === "zodiac")?.selected, false);
  assert.match(reading.methods.find((item) => item.method === "zodiac")?.reason ?? "", /both dates of birth/);
  assert.equal(reading.methods.find((item) => item.method === "tong_shu")?.selected, false);
  methodsMatchSignals(reading, { birthDate: "1990-05-17" });
});

test("Friday’s contract is a timing question, so Tong Shu is chosen and explained", () => {
  const question = "Is Friday a good day to sign the contract?";
  const reading = buildOracle({ question, asOf, rng: seq([0.3, 0.4, 0.2]) });
  const tong = reading.methods.find((item) => item.method === "tong_shu");
  assert.equal(tong?.selected, true);
  assert.match(tong?.reason ?? "", /auspicious timing|date/i);
  assert.equal(reading.layers.find((layer) => layer.id === "tongShu")?.detail, tongShuLayer("2026-10-09", "sign").detail);
  assert.equal(reading.dates.length, 0);
  methodsMatchSignals(reading);
});

test("a job change does not drag Tong Shu in unless the question is about timing", () => {
  const question = "Should I change jobs?";
  const reading = buildOracle({ question, asOf, rng: seq([0.2, 0.4, 0.6, 0.1]) });
  for (const method of ["tarot", "iching", "numerology"] as const) {
    const choice = reading.methods.find((item) => item.method === method);
    assert.equal(choice?.selected, true, method);
    assert.ok((choice?.reason.length ?? 0) > 12);
  }
  const tong = reading.methods.find((item) => item.method === "tong_shu");
  assert.equal(tong?.selected, false);
  assert.match(tong?.reason ?? "", /not primarily about date or timing/i);
  assert.equal(reading.layers.some((layer) => layer.id === "tongShu"), false);
  methodsMatchSignals(reading);
});

test("compatibility uses relationship methods and says why the others wait", () => {
  const question = "Are we compatible?";
  const reading = buildOracle({ question, asOf, rng: seq([0.25, 0.7]) });
  assert.equal(reading.methods.find((item) => item.method === "tarot")?.selected, true);
  assert.match(reading.methods.find((item) => item.method === "tarot")?.reason ?? "", /emotional|tension/i);
  assert.equal(reading.methods.find((item) => item.method === "tong_shu")?.selected, false);
  assert.equal(reading.methods.find((item) => item.method === "zodiac")?.selected, false);
  assert.match(reading.methods.find((item) => item.method === "zodiac")?.reason ?? "", /both dates of birth/);
  assert.equal(reading.methods.find((item) => item.method === "bazi")?.selected, false);
  assert.equal(reading.methods.find((item) => item.method === "bazi")?.status, "not_connected");
  assert.equal(reading.methods.find((item) => item.method === "astrology")?.status, "not_connected");
  methodsMatchSignals(reading);
});

test("leaving a job stays a decision, not a Tong Shu reading", () => {
  const reading = buildOracle({ question: "Should I leave my current job?", asOf, rng: seq([0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]) });
  assert.equal(reading.methods.find((item) => item.method === "tong_shu")?.selected, false);
  assert.equal(reading.methods.find((item) => item.method === "tarot")?.selected, true);
  assert.equal(reading.methods.find((item) => item.method === "iching")?.selected, true);
  methodsMatchSignals(reading);
});

test("a named October range is scored, not the next seven days", () => {
  const question = "Which day between 10 and 20 October is best to launch?";
  const span = dateSpan(question, asOf);
  assert.deepEqual(span?.[0], "2026-10-10");
  assert.deepEqual(span?.at(-1), "2026-10-20");
  assert.equal(span?.length, 11);
  const reading = buildOracle({ question, asOf, rng: seq([0.2, 0.2, 0.2, 0.2, 0.2, 0.2]) });
  assert.equal(reading.mode, "dates");
  assert.equal(reading.dates.length, 3);
  assert.ok(reading.dates.every((day) => day.date >= "2026-10-10" && day.date <= "2026-10-20"));
  assert.ok(reading.dates.every((day) => day.band && day.action && day.layers.some((layer) => layer.id === "tongShu")));
  assert.match(reading.scanned, /10/);
  assert.match(reading.scanned, /20/);
  assert.equal(reading.methods.find((item) => item.method === "tong_shu")?.selected, true);
  assert.equal(reading.methods.find((item) => item.method === "tarot")?.selected, false);
  assert.equal(reading.bazi, null);
  methodsMatchSignals(reading);
});

test("three-coin I Ching keeps the cast, the changing lines, and the relating figure", () => {
  const layer = drawIChing(seq([0.01, 0.2, 0.6, 0.9, 0.2, 0.01]));
  assert.match(layer.detail, /coins 678976/);
  assert.equal(layer.result, castIChing(26).result);
  assert.match(layer.line, /Changing lines 1, 4, 6/);
  assert.match(layer.line, /move toward/);
  assert.ok(layer.line.includes(castIChing(51).result));
  const reading = buildOracle({ question: "Should I change jobs?", asOf, rng: seq([0.37, 0.8, 0.01, 0.2, 0.6, 0.9, 0.2, 0.01]) });
  assert.equal(reading.layers.find((item) => item.id === "iching")?.detail.includes("coins 678976"), true);
});

test("lunar new year, not the Gregorian year, picks the animal", () => {
  assert.equal(lunarZodiac("2026-02-16"), "Snake");
  assert.equal(lunarZodiac("2026-02-17"), "Horse");
  const reading = buildOracle({
    question: "Are we compatible?",
    asOf,
    birthDate: "2026-02-16",
    birthDateB: "2026-02-17",
    rng: seq([0.2, 0.8]),
  });
  const zodiac = reading.layers.find((layer) => layer.id === "zodiac");
  assert.match(zodiac?.result ?? "", /Snake/);
  assert.match(zodiac?.result ?? "", /Horse/);
  assert.match(zodiac?.detail ?? "", /lunar boundary/);
});

test("manual include cannot turn on BaZi and can turn methods off", () => {
  const reading = buildOracle({
    question: "Should I change jobs?",
    asOf,
    include: ["tarot", "bazi"],
    rng: seq([0.2, 0.8]),
  });
  assert.equal(reading.methods.find((item) => item.method === "tarot")?.selected, true);
  assert.equal(reading.methods.find((item) => item.method === "iching")?.selected, false);
  assert.equal(reading.methods.find((item) => item.method === "bazi")?.selected, false);
  assert.equal(reading.methods.find((item) => item.method === "bazi")?.status, "not_connected");
  assert.deepEqual(reading.layers.map((layer) => layer.id), ["tarot"]);
  methodsMatchSignals(reading, { include: ["tarot", "bazi"] });
});

test("disagreement is kept visible", () => {
  const reading = buildOracle({
    question: "Should I change jobs?",
    asOf,
    rng: seq([0.37, 0.8, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]),
  });
  assert.equal(reading.layers.find((layer) => layer.id === "tarot")?.result, "Strength");
  assert.equal(reading.synthesis?.mixed, true);
  assert.equal(reading.synthesis?.agreement, "MIXED");
  assert.match(reading.synthesis?.conflict ?? "", /cautionary/);
  assert.match(reading.says, /mixed/i);
});

test("overall bands use the documented thresholds and never a percentage", () => {
  assert.equal(bandFromScore(0.66), "大吉");
  assert.equal(bandFromScore(0.33), "吉");
  assert.equal(bandFromScore(0.12), "中吉");
  assert.equal(bandFromScore(0), "中");
  assert.equal(bandFromScore(-0.12), "中凶");
  assert.equal(bandFromScore(-0.2), "中凶");
  assert.equal(bandFromScore(-0.33), "凶");
  const reading = buildOracle({ question: "Should I change jobs?", asOf, rng: seq([0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]) });
  assert.doesNotMatch(JSON.stringify({ band: reading.synthesis?.band, action: reading.synthesis?.action, says: reading.says }), /\d+\s*\/\s*100|%/);
});

test("the catalogue tells the truth before a question is asked", () => {
  const closed = oracleAvailability();
  assert.equal(closed.find((item) => item.method === "tong_shu")?.statusLabel, "Available");
  assert.equal(closed.find((item) => item.method === "zodiac")?.statusLabel, "Needs both dates of birth");
  assert.equal(closed.find((item) => item.method === "bazi")?.status, "not_connected");
  assert.equal(closed.find((item) => item.method === "astrology")?.status, "not_connected");
  assert.equal(oracleAvailability("1990-05-17").find((item) => item.method === "zodiac")?.statusLabel, "Needs both dates of birth");
  assert.equal(oracleAvailability("1990-05-17", "1992-11-03").find((item) => item.method === "zodiac")?.statusLabel, "Available");
  assert.equal(oracleAvailability("1990-05-17").find((item) => item.method === "bazi")?.status, "not_connected");
});

test("when will I be rich is a wealth timing question, not a yes", () => {
  const bare = "when will i be rich?";
  const contract = parseQuestionContract(bare);
  assert.equal(contract.domain, "wealth");
  assert.equal(contract.questionType, "WHEN");
  assert.equal(contract.answerShape, "timeframe");
  assert.equal(contract.wealthKind, "accumulation");
  assert.equal(answerFits(contract, "The reading leans toward a yes, and away from a performance.").ok, false);
  const reading = buildOracle({ question: bare, asOf, rng: seq([0.2, 0.4, 0.6, 0.2]) });
  assert.equal(reading.questionType, "when");
  assert.equal(reading.topic, "money");
  assert.equal(reading.methods.find((item) => item.method === "tong_shu")?.selected, false);
  assert.equal(reading.methods.find((item) => item.method === "numerology")?.status, "needs_info");
  assert.equal(reading.methods.find((item) => item.method === "tarot")?.selected, true);
  assert.equal(reading.methods.find((item) => item.method === "iching")?.selected, true);
  assert.equal(reading.methods.find((item) => item.method === "bazi")?.status, "not_connected");
  assert.ok((reading.methods.find((item) => item.method === "bazi")?.relevance ?? 0) > (reading.methods.find((item) => item.method === "tarot")?.relevance ?? 100));
  assert.match(reading.methods.find((item) => item.method === "tarot")?.reason ?? "", /help or delay/i);
  assert.match(reading.says, /wealth/i);
  assert.match(reading.says, /conditions rather than|birth date/i);
  assert.doesNotMatch(reading.says, /leans toward a yes/i);
  assert.equal(reading.validation?.ok, true);
  assert.equal(reading.synthesis?.dimension, "TIMING");
  assert.match(reading.synthesis?.window ?? "", /birth date/i);
  assert.equal(reading.layers.some((layer) => layer.result.startsWith("Personal Day")), false);
  assert.equal(voiceFitsReading(reading, "The reading leans toward a yes, and away from a performance."), false);
});

test("a birth date turns a wealth when-question into a personal-year window", () => {
  const birth = "1990-05-17";
  const reading = buildOracle({ question: "When will I be rich?", asOf, birthDate: birth, rng: seq([0.2, 0.4, 0.6]) });
  const found = cycleYears(birth, asOf, 8);
  assert.equal(reading.methods.find((item) => item.method === "numerology")?.selected, true);
  assert.match(reading.layers.find((layer) => layer.id === "numerology")?.result ?? "", /Personal Year/);
  assert.doesNotMatch(reading.layers.find((layer) => layer.id === "numerology")?.result ?? "", /Personal Day/);
  assert.equal(reading.synthesis?.window, String(found.year));
  assert.match(reading.says, new RegExp(String(found.year)));
  assert.match(reading.says, /wealth/i);
  assert.doesNotMatch(reading.says, /you will be rich|leans toward a yes/i);
  assert.equal(personalYear(birth, asOf), personalYear(birth, asOf));
  assert.equal(voiceFitsReading(reading, `Your personal year is 3 and you will be rich in ${found.year}.`), false);
});

test("the sample questions keep their shape", () => {
  const promotion = buildOracle({ question: "Will I get the promotion?", asOf, rng: seq([0.2, 0.4, 0.6]) });
  assert.equal(parseQuestionContract("Will I get the promotion?").answerShape, "yes_no");
  assert.equal(promotion.methods.find((item) => item.method === "tong_shu")?.selected, false);
  assert.notEqual(promotion.questionType, "when");

  const resign = buildOracle({ question: "Should I resign and start my own company?", asOf, rng: seq([0.2, 0.4, 0.6]) });
  assert.equal(parseQuestionContract("Should I resign and start my own company?").questionType, "SHOULD_I");
  assert.equal(resign.methods.find((item) => item.method === "iching")?.selected, true);
  assert.equal(resign.methods.find((item) => item.method === "tong_shu")?.selected, false);

  const jobs = buildOracle({ question: "Which is better for me — Job A or Job B?", asOf, rng: seq([0.2, 0.2, 0.2, 0.2, 0.2, 0.2]) });
  assert.equal(jobs.mode, "compare");
  assert.equal(jobs.sides.length, 2);

  const contractDay = buildOracle({ question: "Is 18 December a good day to sign the contract?", asOf, rng: seq([0.3, 0.4, 0.2]) });
  assert.equal(contractDay.methods.find((item) => item.method === "tong_shu")?.selected, true);
  assert.equal(contractDay.layers.find((layer) => layer.id === "tongShu")?.detail, tongShuLayer("2026-12-18", "sign").detail);
  assert.equal(contractDay.layers.some((layer) => layer.result.startsWith("Personal Day")), false);

  const marriage = buildOracle({ question: "When will I get married?", asOf, rng: seq([0.2, 0.5]) });
  assert.equal(marriage.contract?.domain, "marriage");
  assert.equal(marriage.questionType, "when");
  assert.equal(marriage.methods.find((item) => item.method === "numerology")?.status, "needs_info");
  assert.match(marriage.says, /marriage/i);
  assert.match(marriage.says, /birth date|conditions rather than/i);
  assert.doesNotMatch(marriage.says, /leans toward a yes/i);

  const feelings = buildOracle({ question: "Does she like me?", asOf, rng: seq([0.4, 0.2]) });
  assert.match(feelings.says, /private feelings|cannot/i);
  assert.doesNotMatch(feelings.says, /leans toward a yes/i);

  const house = buildOracle({ question: "Should I buy this house?", asOf, rng: seq([0.2, 0.4, 0.6]) });
  assert.equal(parseQuestionContract("Should I buy this house?").domain, "property");
  assert.equal(house.methods.find((item) => item.method === "tong_shu")?.selected, false);
  assert.equal(house.methods.find((item) => item.method === "iching")?.selected, true);

  const business = buildOracle({ question: "How will my business perform next year?", asOf, rng: seq([0.2, 0.4, 0.6]) });
  assert.equal(business.questionType, "how");
  assert.equal(business.synthesis?.dimension, "PERIOD");
  assert.match(business.says, /business/i);
  assert.doesNotMatch(business.says, /leans toward a yes/i);
  assert.equal(business.layers.some((layer) => layer.result.startsWith("Personal Day")), false);

  const today = buildOracle({ question: "What should I know today?", mode: "daily", asOf, rng: seq([0.2, 0.4, 0.6]) });
  assert.equal(today.mode, "daily");
  assert.equal(today.methods.find((item) => item.method === "tarot")?.selected, true);
});

test("context in front of the question is kept", () => {
  const question = "I am thinking of leaving my company next March. Will the new business work?";
  const contract = parseQuestionContract(question);
  assert.ok(contract.contextFacts.some((fact) => /work|March|march|business/i.test(fact)));
  const reading = buildOracle({ question, asOf, birthDate: "1990-05-17", rng: seq([0.2, 0.4, 0.6]) });
  assert.match(reading.expand, /Context kept/i);
});

