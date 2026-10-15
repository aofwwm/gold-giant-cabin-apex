import assert from "node:assert/strict";
import test from "node:test";
import type { DatePlace } from "./dating.ts";
import { DATING_PLACES } from "./dating-places.ts";
import { likelyClosed, narrateDate, pickShape, rankPlaces, shapesFor, assessSpan, clockSlot, durationRule, nextStart, dedupePlaces, placeTitle, scorePlace, type PlanBrief, type RankContext, type StepSpec } from "./dating-plan.ts";

function brief(over: Partial<PlanBrief> = {}): PlanBrief {
  return {
    dateType: "casual",
    date: "2026-10-09",
    startMin: 19 * 60,
    span: "half",
    budget: 80,
    freeOnly: false,
    setting: "either",
    vibes: ["cosy", "scenic"],
    foods: ["dinner", "walk"],
    pressure: "balanced",
    formality: "smart",
    crowd: "ok",
    area: "East Coast",
    seen: [],
    rejected: [],
    spin: 0,
    ...over,
  };
}

function ctx(over: Partial<RankContext> = {}): RankContext {
  return {
    origin: { lat: 1.301, lng: 103.912 },
    here: { lat: 1.301, lng: 103.912 },
    first: true,
    vibes: ["cosy", "scenic"],
    dateType: "casual",
    pressure: "balanced",
    crowd: "ok",
    formality: "smart",
    budget: 80,
    seen: [],
    usedCuisines: [],
    usedNames: [],
    seed: "test",
    minute: 19 * 60,
    date: "2026-10-09",
    ...over,
  };
}

const scenic: StepSpec = { role: "scenic", minutes: 50, slot: "Before you eat", food: false, lean: "move", targetOffset: 0 };
const meal: StepSpec = { role: "meal", minutes: 90, slot: "Dinner", food: true, lean: "taste", targetOffset: 100 };
const play: StepSpec = { role: "activity", minutes: 70, slot: "The thing you do", food: false, lean: "play", targetOffset: 0 };

test("an east-coast evening prefers the park and the lagoon over downtown magnets", () => {
  const gallery = DATING_PLACES.find((place) => place.name === "National Museum of Singapore");
  const park = DATING_PLACES.find((place) => place.name === "East Coast Park") ?? place({
    id: "east-coast",
    name: "East Coast Park",
    lat: 1.3008,
    lng: 103.912,
    role: "scenic",
    cuisine: "Park",
    vibes: ["scenic", "chill"],
  });
  const gardens: DatePlace = place({
    id: "gardens",
    name: "Gardens by the Bay",
    lat: 1.2816,
    lng: 103.8636,
    role: "scenic",
    cuisine: "Gardens",
    vibes: ["scenic"],
  });
  const lagoon = DATING_PLACES.find((place) => place.id === "date-lagoon")!;
  const maxwell: DatePlace = place({
    id: "maxwell",
    name: "Maxwell Food Centre",
    lat: 1.2803,
    lng: 103.8448,
    role: "meal",
    cuisine: "Hawker",
    vibes: ["foodie"],
    approxSgd: 8,
  });
  const views = rankPlaces([park, gardens], scenic, ctx(), []);
  assert.equal(views[0]?.name, "East Coast Park");
  const tables = rankPlaces([lagoon, maxwell], meal, ctx(), []);
  assert.equal(tables[0]?.name, "East Coast Lagoon Food Village");
  assert.ok(gallery);
});

test("rejected and recently shown places lose", () => {
  const lagoon = DATING_PLACES.find((place) => place.id === "date-lagoon")!;
  const airport = DATING_PLACES.find((place) => place.id === "date-old-airport")!;
  const fresh = rankPlaces([lagoon, airport], meal, ctx(), []);
  assert.equal(fresh[0]?.id, "date-lagoon");
  const blocked = rankPlaces([lagoon, airport], meal, ctx(), ["East Coast Lagoon Food Village"]);
  assert.equal(blocked[0]?.id, "date-old-airport");
  assert.ok(blocked.every((place) => place.id !== "date-lagoon"));
  const seen = rankPlaces([lagoon, airport], meal, ctx({ seen: [lagoon.id, lagoon.name] }), []);
  assert.equal(seen[0]?.id, "date-old-airport");
});

test("a first date does not lead with karaoke", () => {
  const karaoke: DatePlace = place({
    id: "ktv",
    name: "Party World KTV",
    lat: 1.302,
    lng: 103.913,
    role: "activity",
    cuisine: "Karaoke",
    vibes: ["playful"],
    approxSgd: 35,
  });
  const museum = DATING_PLACES.find((place) => place.id === "date-museum")!;
  const park = place({
    id: "east-coast",
    name: "East Coast Park",
    lat: 1.3008,
    lng: 103.912,
    role: "scenic",
    cuisine: "Park",
    vibes: ["scenic", "quiet", "chill"],
  });
  const ranked = rankPlaces(
    [karaoke, { ...museum, lat: 1.302, lng: 103.913, opening: "" }, park],
    play,
    ctx({ dateType: "first", pressure: "low", vibes: ["quiet", "cosy"] }),
    [],
  );
  assert.notEqual(ranked[0]?.name, "Party World KTV");
});

test("cosy and quiet ranks a hawker below a conversational table", () => {
  const hawker = DATING_PLACES.find((place) => place.id === "date-changi-village")!;
  const cove = DATING_PLACES.find((place) => place.id === "date-east-georges")!;
  const coastal = DATING_PLACES.find((place) => place.id === "date-east-coastal")!;
  const origin = { lat: 1.37305, lng: 103.9493 };
  const here = ctx({ origin, here: origin, vibes: ["cosy", "quiet"], crowd: "avoid" });
  const ranked = rankPlaces([hawker, cove, coastal], meal, here, []);
  assert.notEqual(ranked[0]?.id, "date-changi-village");
  assert.ok(scorePlace(hawker, meal, here) < scorePlace(cove, meal, here));
  const banned = rankPlaces([hawker, cove, coastal], meal, here, ["Georges @ The Cove", "The Coastal Settlement"]);
  assert.equal(banned.length, 1);
  assert.equal(banned[0]?.id, "date-changi-village");
});

test("hours that clearly miss the evening are closed", () => {
  assert.equal(likelyClosed("Mo-Su 10:00-19:00", "2026-10-09", 19 * 60), true);
  assert.equal(likelyClosed("Mo-Su 10:00-19:00", "2026-10-09", 17 * 60), false);
  assert.equal(likelyClosed("Mo-Fr 10:00-18:00", "2026-10-11", 12 * 60), true);
  assert.equal(likelyClosed("", "2026-10-09", 21 * 60), false);
});

test("half-day shapes are a date, not a restaurant list, and spin changes the shape", () => {
  const shapes = shapesFor(brief());
  assert.ok(shapes.every((shape) => shape.steps.some((step) => !step.food)));
  const first = pickShape(brief({ spin: 0 }));
  const later = pickShape(brief({ spin: 1 }));
  assert.notEqual(first.id, later.id);
  assert.equal(pickShape(brief({ spin: 0 })).id, first.id);
});

test("the narration names the actual stops and says what the date is", () => {
  const shape = pickShape(brief({ dateType: "first", span: "half" }));
  const stops = [
    stop("East Coast Park", "scenic", "Evening", 19 * 60 + 10, 20 * 60 + 20),
    stop("East Coast Lagoon Food Village", "meal", "Dinner", 20 * 60 + 40, 22 * 60 + 20),
  ];
  const plan = narrateDate({ brief: brief({ dateType: "first" }), shape, stops, backupTitle: "National Library Building", thin: false });
  assert.match(plan.thesis, /East Coast Park/);
  assert.match(plan.thesis, /Lagoon/);
  assert.match(plan.rain, /National Library Building/);
  assert.match(plan.pacing, /7:00 PM/);
  assert.equal(plan.partial, false);
  assert.doesNotMatch(plan.thesis, /here are some places/i);
});

test("a 9:14 lunch and a 10:37 dinner is not a full day", () => {
  assert.equal(clockSlot(9 * 60 + 14, "meal", "taste"), "Breakfast");
  assert.equal(clockSlot(10 * 60 + 37, "meal", "taste"), "Brunch");
  assert.notEqual(clockSlot(10 * 60 + 37, "meal", "taste"), "Dinner");
  assert.equal(clockSlot(12 * 60 + 30, "meal", "taste"), "Lunch");
  assert.equal(clockSlot(19 * 60, "meal", "taste"), "Dinner");
  const bad = assessSpan("full", 9 * 60, [
    { startMin: 9 * 60 + 14, endMin: 10 * 60 + 24, kind: "meal" },
    { startMin: 10 * 60 + 37, endMin: 12 * 60 + 2, kind: "meal" },
  ]);
  assert.equal(bad.partial, true);
  assert.equal(bad.line, "Only a partial plan could be verified.");
});

test("full day from 9:00 spans into dinner and is longer than a half day", () => {
  const full = shapesFor(brief({ span: "full", startMin: 9 * 60 }))[0]!;
  const half = shapesFor(brief({ span: "half", startMin: 9 * 60 }))[0]!;
  assert.equal(full.id, "whole-day");
  assert.ok(full.steps.length >= 4 && full.steps.length <= 7);
  const meals = full.steps.filter((step) => step.role === "meal");
  const lunch = meals[0]!;
  const dinner = meals[meals.length - 1]!;
  assert.equal(clockSlot(9 * 60 + lunch.targetOffset, "meal", "taste"), "Lunch");
  assert.equal(9 * 60 + dinner.targetOffset, 18 * 60);
  assert.equal(clockSlot(9 * 60 + dinner.targetOffset, "meal", "taste"), "Dinner");
  const fullEnd = Math.max(...full.steps.map((step) => step.targetOffset + step.minutes));
  const halfEnd = Math.max(...half.steps.map((step) => step.targetOffset + step.minutes));
  assert.ok(fullEnd >= durationRule("full").min);
  assert.ok(halfEnd >= durationRule("half").min - 20 && halfEnd <= durationRule("half").max);
  assert.ok(fullEnd - halfEnd >= 180);
  assert.equal(nextStart(9 * 60, 11 * 60, 12, dinner.targetOffset), 18 * 60);
  const parents = pickShape(brief({ dateType: "parents", span: "full", startMin: 9 * 60, spin: 0 }));
  assert.ok(parents.id.startsWith("whole-day"));
});

test("evening half day and food only stay in their lanes", () => {
  const evening = shapesFor(brief({ span: "half", startMin: 18 * 60 }));
  assert.ok(evening.length >= 2);
  for (const shape of evening) {
    assert.ok(shape.steps.length >= 2 && shape.steps.length <= 4);
    const end = Math.max(...shape.steps.map((step) => step.targetOffset + step.minutes));
    assert.ok(end <= durationRule("half").max + 20);
    assert.ok(end >= durationRule("half").min - 30);
    for (const step of shape.steps) {
      const label = clockSlot(18 * 60 + step.targetOffset, step.role, step.lean);
      assert.notEqual(label, "Lunch");
      assert.notEqual(label, "Breakfast");
      assert.notEqual(label, "Morning");
    }
  }
  const food = shapesFor(brief({ span: "quick", startMin: 19 * 60, foods: ["dinner", "dessert"] }))[0]!;
  assert.ok(food.steps.length >= 1 && food.steps.length <= 2);
  const foodEnd = Math.max(...food.steps.map((step) => step.targetOffset + step.minutes));
  assert.ok(foodEnd <= durationRule("quick").max);
  assert.equal(clockSlot(19 * 60, "meal", "taste"), "Dinner");
});

test("changi village is one destination, and it is not a restaurant", () => {
  const area = place({ id: "area", name: "Changi Village", lat: 1.3888, lng: 103.9877, role: "meal", cuisine: "Restaurant" });
  const hawker = place({ id: "hawker", name: "Changi Village Hawker Centre", lat: 1.3885, lng: 103.9876, role: "meal", cuisine: "Hawker" });
  const katong = place({ id: "katong", name: "328 Katong Laksa", lat: 1.3052, lng: 103.9046, role: "meal", cuisine: "Laksa" });
  const kept = dedupePlaces([area, hawker, katong]);
  assert.equal(kept.length, 2);
  assert.ok(kept.some((item) => item.name === "Changi Village Hawker Centre"));
  assert.ok(kept.some((item) => item.name === "328 Katong Laksa"));
  assert.equal(placeTitle(area), "Explore Changi Village + waterfront");
  assert.equal(placeTitle(hawker), "Changi Village Hawker Centre");
});

function place(over: Partial<DatePlace> & Pick<DatePlace, "id" | "name" | "lat" | "lng" | "role">): DatePlace {
  return {
    address: "Singapore",
    setting: over.role === "scenic" ? "outdoor" : "indoor",
    approxSgd: 0,
    cuisine: "",
    vibes: [],
    diets: [],
    alcohol: false,
    opening: "",
    source: "directory",
    blurb: "A real place with a specific reason to go.",
    ...over,
  };
}

function stop(title: string, kind: DatePlace["role"], slot: string, startMin = 19 * 60 + 15, endMin = 21 * 60) {
  return {
    id: title,
    kind,
    title,
    address: "Singapore",
    latitude: 1.3,
    longitude: 103.9,
    startMin,
    endMin,
    setting: kind === "scenic" ? "outdoor" as const : "indoor" as const,
    travelMin: 12,
    travelLabel: "12 min drive",
    cost: 18,
    why: "Because.",
    doThis: "Do the thing.",
    placeId: title,
    liveLabel: slot,
    opening: "",
    slot,
  };
}
