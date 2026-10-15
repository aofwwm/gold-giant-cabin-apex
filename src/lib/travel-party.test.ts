import assert from "node:assert/strict";
import test from "node:test";
import { explicitChildAges, hasYoungChild, parseChildAges } from "./travel.ts";
import { buildTrip, explainLeg, experienceBalance, normalizeTravelParty, type DiscoveredPlace, type TravelArea, type Trip } from "./travel-model.ts";

const osaka: TravelArea = { name: "Osaka", latitude: 34.6937, longitude: 135.5023, countryCode: "JP" };

function spot(id: string, name: string, category: DiscoveredPlace["category"], shift = 0.01): DiscoveredPlace {
  return {
    id,
    provider: "osm",
    providerId: id,
    name,
    address: name,
    lat: osaka.latitude + shift,
    lng: osaka.longitude + shift,
    category,
    indoor: true,
    area: "Osaka",
    opening: "",
    importance: "major",
    groups: ["heritage"],
    sitelinks: 10,
    distanceKm: 1,
    excursion: "none",
  };
}

const input = {
  destination: "Osaka",
  areas: [osaka],
  start: "2026-10-10",
  nights: 3,
  adults: 2,
  childAges: [] as number[],
  pace: "balanced" as const,
  move: "walk" as const,
  oneBase: true,
  interests: [] as [],
  rejected: [] as string[],
  mustVisit: [] as string[],
  salt: 0,
  lockedDates: [] as string[],
  spots: [
    spot("stay", "Inn", "stay", 0.001),
    spot("museum", "Castle", "museum", 0.01),
    spot("food", "Lunch", "restaurant", 0.012),
  ],
  weather: [] as { date: string; outdoorOk: boolean | null; summary: string }[],
  styles: ["luxury", "culture"] as ("luxury" | "culture")[],
};

function surface(trip: Trip): string {
  return [
    trip.whyTrip,
    trip.placeNote,
    trip.profileNote,
    trip.voice,
    ...trip.days.map((day) => day.freeNote),
    ...trip.legs.flatMap((leg) => [leg.label, leg.recommendationReason]),
    ...experienceBalance(trip.coverage, trip.destination).map((row) => row.label),
  ].join("\n");
}

test("an empty ages box is not a child", () => {
  assert.deepEqual(parseChildAges(""), []);
  assert.deepEqual(parseChildAges("   "), []);
  assert.deepEqual(parseChildAges(","), []);
  assert.deepEqual(parseChildAges("0"), [0]);
  assert.deepEqual(parseChildAges("5, 9"), [5, 9]);
  assert.deepEqual(explicitChildAges([null, Number.NaN, 4, 99]), [4]);
  assert.equal(hasYoungChild([]), false);
  assert.equal(hasYoungChild(undefined), false);
  assert.equal(hasYoungChild([0]), true);
  assert.equal(hasYoungChild([3]), true);
  assert.equal(hasYoungChild([9]), false);
});

test("two adults and no children never produce a young-child reason", () => {
  const trip = buildTrip(input);
  assert.deepEqual(trip.childAges, []);
  assert.equal(trip.partyExplicit, true);
  assert.equal(hasYoungChild(trip.childAges), false);
  assert.doesNotMatch(surface(trip), /young child|stroller|child-friendly|family walking|Not covered|Still in Discover|open place list|Nothing was invented|No permitted photo|Open time after|Wikidata|coverage check/i);
  assert.equal(trip.days.some((day) => /open time after/i.test(day.freeNote)), false);
});

test("a three-year-old can explain a long walk, and a later adult trip does not inherit it", () => {
  const family = buildTrip({ ...input, childAges: [3] });
  const leg = explainLeg({
    fromId: "a",
    toId: "b",
    day: 0,
    mode: "drive",
    minutes: 8,
    meters: 2500,
    source: "osrm",
    label: "",
  }, "drive", ["comfort"], true);
  assert.equal(family.childAges[0], 3);
  assert.match(leg.recommendationReason ?? "", /young child/);
  const adult = buildTrip({ ...input, childAges: [] });
  assert.doesNotMatch(surface(adult), /young child/i);
  assert.equal(adult.stops.some((stop) => stop.note?.includes(family.stops[0]?.id ?? "nope")), false);
});

test("a blank-box age of 0 on an old trip is not a child", () => {
  const trip = buildTrip(input);
  const phantom = normalizeTravelParty({
    ...trip,
    partyExplicit: undefined,
    childAges: [0],
    legs: trip.legs.map((leg) => ({ ...leg, recommendationReason: "With a young child, the longer walk is a poor fit." })),
  });
  assert.deepEqual(phantom.childAges, []);
  assert.equal(phantom.partyExplicit, true);
  assert.doesNotMatch(phantom.legs.map((leg) => leg.recommendationReason).join(" "), /young child/i);
  const infant = normalizeTravelParty({ ...trip, partyExplicit: true, childAges: [0] });
  assert.deepEqual(infant.childAges, [0]);
});

test("coverage stays a category summary, not one row per landmark", () => {
  const louvre = { ...spot("louvre", "Louvre", "museum", 0.01), importance: "iconic" as const, groups: ["heritage"], sitelinks: 100 };
  const arc = { ...spot("arc", "Arc de Triomphe", "historic", 0.02), importance: "iconic" as const, groups: ["heritage"], sitelinks: 80 };
  const orsay = { ...spot("orsay", "Musée d'Orsay", "museum", 0.03), importance: "iconic" as const, groups: ["heritage"], sitelinks: 70 };
  const versailles = { ...spot("versailles", "Versailles", "historic", 0.4), importance: "iconic" as const, groups: ["heritage", "excursion"], sitelinks: 90, distanceKm: 20, excursion: "full" as const };
  const trip = buildTrip({ ...input, nights: 4, spots: [spot("stay", "Inn", "stay", 0.001), louvre, arc, orsay, versailles], styles: ["culture"] });
  const examples = (trip.coverage ?? []).map((row) => row.example);
  assert.equal(examples.filter((name) => name === "Arc de Triomphe" || name === "Musée d'Orsay").length, 0);
  assert.equal((trip.coverage ?? []).some((row) => /Still in Discover|Another stop already covers/.test(row.reason)), false);
  const balance = experienceBalance(trip.coverage, "Paris");
  assert.equal(balance.some((row) => row.label === "Historic Paris" && row.state === "in") || balance.every((row) => !/Not covered/.test(row.label)), true);
});
