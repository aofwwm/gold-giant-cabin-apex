import assert from "node:assert/strict";
import test from "node:test";
import { classifyVisit } from "./travel-knowledge.ts";
import { applyFoodPlanning, dayOutline, fillFreeGap, nearbyContext, nearbyOptions } from "./travel-itinerary.ts";
import { buildTrip, categoryFromTags, explainLeg, isAreaPlace, unscheduleStop, type DiscoveredPlace, type TravelArea } from "./travel-model.ts";

const tokyo: TravelArea = { name: "Tokyo", latitude: 35.68, longitude: 139.76 };

function spot(id: string, name: string, category: DiscoveredPlace["category"], shift = 0.01): DiscoveredPlace {
  return {
    id,
    provider: "osm",
    providerId: id,
    name,
    category,
    address: "Tokyo",
    lat: tokyo.latitude + shift,
    lng: tokyo.longitude + shift,
    indoor: category === "museum" || category === "restaurant" || category === "cafe",
    area: "Tokyo",
    opening: "",
  };
}

const base = {
  destination: "Tokyo",
  areas: [tokyo],
  start: "2026-10-22",
  nights: 4,
  adults: 2,
  childAges: [] as number[],
  pace: "balanced" as const,
  move: "drive" as const,
  oneBase: true,
  interests: [] as [],
  rejected: [] as string[],
  mustVisit: [] as string[],
  salt: 1,
  lockedDates: [] as string[],
  weather: [] as { date: string; outdoorOk: boolean | null; summary: string }[],
};

test("a city is not a 90-minute attraction", () => {
  assert.equal(classifyVisit("city | big city | tourist destination | city of Japan", "Kamakura"), null);
  assert.equal(classifyVisit("tourist attraction | tower", "Tokyo Tower")?.category, "attraction");
  assert.equal(categoryFromTags({ place: "city", tourism: "attraction", name: "Kamakura" }), null);
  assert.equal(categoryFromTags({ tourism: "attraction", name: "Senso-ji" })?.category, "attraction");
  const city = { ...spot("city", "Kamakura", "attraction", 0.45), description: "city in Kanagawa Prefecture, Japan", importance: "iconic" as const, sitelinks: 80 };
  const buddha = { ...spot("buddha", "Great Buddha", "historic", 0.452), importance: "major" as const, sitelinks: 12, locality: "Kamakura", groups: ["heritage"], excursion: "full" as const, distanceKm: 50 };
  assert.equal(isAreaPlace(city), true);
  const trip = buildTrip({ ...base, spots: [spot("stay", "Hotel", "stay", 0.002), city, buddha, spot("tower", "Tokyo Tower", "attraction", 0.01)] });
  assert.equal(trip.stops.some((stop) => stop.name === "Kamakura"), false);
  assert.equal(trip.stops.some((stop) => stop.name === "Kamakura" && stop.duration === 90), false);
  const visit = trip.stops.find((stop) => stop.name === "Great Buddha" && stop.day != null);
  assert.ok(visit);
  assert.notEqual(visit?.category, "stay");
});

test("a long walk is not shown as a huge minute count", () => {
  const leg = explainLeg({
    fromId: "hotel",
    toId: "buddha",
    day: 0,
    mode: "drive",
    minutes: 65,
    meters: 52000,
    source: "osrm",
    label: "",
  }, "drive", ["comfort"], false);
  const walk = leg.alternatives?.find((item) => item.mode === "walk");
  const rail = leg.alternatives?.find((item) => item.mode === "transit");
  assert.equal(walk?.label, "Walking · Not practical");
  assert.equal(walk?.minutes, null);
  assert.doesNotMatch(`${leg.label} ${leg.recommendationReason ?? ""} ${walk?.label}`, /766|52000|693/);
  assert.match(leg.label, /Taxi|Drive/);
  assert.match(rail?.label ?? "", /Navigate|train/i);
  assert.equal(/\d/.test(rail?.label ?? "no"), false);
});

test("nearby stays next to the anchor, and a gap fill leaves other days alone", () => {
  const buddha = { ...spot("buddha", "Great Buddha", "historic", 0.45), importance: "iconic" as const, sitelinks: 30, groups: ["heritage", "excursion"], excursion: "full" as const, distanceKm: 48, locality: "Kamakura" };
  const hase = { ...spot("hase", "Hase-dera", "historic", 0.452), importance: "interest" as const, sitelinks: 6, locality: "Kamakura", groups: ["heritage"] };
  const tower = { ...spot("tower", "Tokyo Tower", "attraction", 0.012), importance: "iconic" as const, sitelinks: 40, groups: ["city"] };
  const museum = { ...spot("museum", "National Museum", "museum", 0.02), importance: "major" as const, sitelinks: 15, groups: ["heritage"] };
  const trip = buildTrip({
    ...base,
    nights: 5,
    spots: [spot("stay", "Hotel", "stay", 0.001), buddha, hase, tower, museum],
    interests: ["culture"],
    foodPlanning: "minimal",
  });
  const anchor = trip.stops.find((stop) => stop.name === "Great Buddha" && stop.day != null);
  assert.ok(anchor);
  const haseStop = trip.stops.find((stop) => stop.name === "Hase-dera");
  const looseTrip = haseStop?.day != null ? unscheduleStop(trip, haseStop.id) : trip;
  const context = nearbyContext(looseTrip, anchor.day ?? 0);
  assert.ok(context, looseTrip.stops.filter((stop) => stop.day === anchor.day).map((stop) => `${stop.name} ${stop.startTime}-${stop.endTime}`).join(", "));
  assert.ok((context?.remaining ?? 0) >= 45);
  const options = nearbyOptions(looseTrip, context!);
  const names = options.map((option) => looseTrip.stops.find((stop) => stop.id === option.stopId)?.name);
  assert.equal(names.includes("Hase-dera"), true);
  assert.equal(names.includes("Tokyo Tower"), false);
  assert.match(options.find((option) => looseTrip.stops.find((stop) => stop.id === option.stopId)?.name === "Hase-dera")?.whyNow ?? "", /min from/);
  const before = looseTrip.stops.filter((stop) => stop.day != null && stop.day !== anchor!.day).map((stop) => `${stop.day}:${stop.id}`);
  const filled = fillFreeGap(looseTrip, anchor!.day ?? 0);
  const after = filled.stops.filter((stop) => stop.day != null && stop.day !== anchor!.day).map((stop) => `${stop.day}:${stop.id}`);
  assert.deepEqual(after, before);
  const outline = dayOutline(filled, anchor!.day ?? 0);
  assert.match(outline.headline, /Kamakura|Day trip/);
  assert.equal(JSON.stringify(filled.stops.map((stop) => stop.id)), JSON.stringify(dayOutline(filled, 0) && filled.stops.map((stop) => stop.id)));
});

test("food planning changes which meals are named, without inventing a reputation", () => {
  const kitchen = { ...spot("kitchen", "Station Kitchen", "restaurant", 0.012), importance: "major" as const, sitelinks: 12 };
  const cafe = { ...spot("cafe", "Side Cafe", "cafe", 0.011), importance: "local" as const };
  const spots = [spot("stay", "Hotel", "stay", 0.001), spot("museum", "National Museum", "museum", 0.01), kitchen, cafe];
  const featured = buildTrip({ ...base, nights: 3, pace: "relaxed", foodPlanning: "feature", spots });
  const minimal = buildTrip({ ...base, nights: 3, pace: "relaxed", foodPlanning: "minimal", spots });
  assert.equal(featured.stops.some((stop) => stop.day != null && stop.name === "Station Kitchen"), true);
  assert.equal(minimal.stops.some((stop) => stop.day != null && stop.name === "Station Kitchen"), false);
  assert.equal(minimal.stops.some((stop) => stop.day != null && stop.foodRole === "meal-window"), true);
  assert.equal(minimal.stops.some((stop) => stop.day != null && stop.category === "cafe" && stop.provider !== "area"), false);
  const reasons = featured.stops.map((stop) => stop.why || "").join(" ");
  assert.doesNotMatch(reasons, /famous for|one of the best|locals love|highly rated/i);
  const eased = applyFoodPlanning(featured, "minimal");
  assert.equal(eased.stops.some((stop) => stop.day != null && stop.name === "Station Kitchen"), false);
  assert.equal(eased.foodPlanning, "minimal");
});
