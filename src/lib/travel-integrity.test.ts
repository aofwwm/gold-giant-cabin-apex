import assert from "node:assert/strict";
import test from "node:test";
import { adaptPlaybook } from "./travel-playbook.ts";
import { ensureTravelPlaybook, listPlaybooks, resetPlaybookRegistryForTests } from "./travel-playbook-registry.ts";
import { buildTrip, validateTravelDay, validateWholeTrip, type DiscoveredPlace, type TravelArea } from "./travel-model.ts";
import { dayOutline } from "./travel-itinerary.ts";
import { cleanTheme } from "./travel-names.ts";

const tokyo: TravelArea = { name: "Tokyo", latitude: 35.6812, longitude: 139.7671 };

function spot(id: string, name: string, category: DiscoveredPlace["category"], lat: number, lng: number, extra: Partial<DiscoveredPlace> = {}): DiscoveredPlace {
  return {
    id,
    provider: "osm",
    providerId: id,
    name,
    category,
    address: "Tokyo",
    lat,
    lng,
    indoor: category === "museum",
    area: "Tokyo",
    opening: "",
    locality: "東京都",
    ...extra,
  };
}

test("padding a short pattern does not stack More time in", async () => {
  await ensureTravelPlaybook("Tokyo", { latitude: 35.6812, longitude: 139.7671, countryCode: "JP" });
  const plan = adaptPlaybook({
    destination: "Tokyo",
    nights: 7,
    pace: "balanced",
    oneBase: true,
    interests: [],
    styles: ["comfort"],
    balance: "balanced",
    firstVisit: true,
    childAges: [],
  }, listPlaybooks());
  assert.ok(plan);
  assert.equal(plan?.id, "tokyo");
  const titles = plan?.days.map((day) => day.title) ?? [];
  assert.equal(titles.some((title) => /More time in/i.test(title)), false);
  assert.equal(titles.some((title) => /More time in\s+More time in/i.test(title)), false);
  assert.equal(titles.some((title) => /[\u3040-\u30FF\u3400-\u9FFF]/.test(title)), false);
});

test("a Japanese admin name still loads the Tokyo playbook", async () => {
  resetPlaybookRegistryForTests();
  const book = await ensureTravelPlaybook("東京都", { latitude: 35.68, longitude: 139.76, countryCode: "JP" });
  assert.equal(book?.id, "tokyo");
  const plan = adaptPlaybook({
    destination: "東京都",
    nights: 5,
    pace: "balanced",
    oneBase: true,
    interests: [],
    styles: ["comfort"],
    balance: "balanced",
    firstVisit: true,
    childAges: [],
  }, listPlaybooks());
  assert.equal(plan?.id, "tokyo");
  const titles = plan?.days.map((day) => day.title) ?? [];
  assert.ok(titles.some((title) => /Asakusa|Shibuya|Kamakura/i.test(title)));
  assert.equal(titles.some((title) => /More time in/i.test(title)), false);
});

test("an unasked hotel is not the base, and a random restaurant is not a second lunch", async () => {
  await ensureTravelPlaybook("Tokyo", { latitude: 35.6812, longitude: 139.7671, countryCode: "JP" });
  const plan = adaptPlaybook({
    destination: "Tokyo",
    nights: 5,
    pace: "balanced",
    oneBase: true,
    interests: [],
    styles: ["comfort"],
    balance: "balanced",
    firstVisit: true,
    childAges: [],
  }, listPlaybooks());
  assert.ok(plan);
  const spots = [
    spot("hotel", "Mandarin Oriental Tokyo", "stay", 35.687, 139.773),
    spot("casa", "CASA MONTES", "restaurant", 35.698, 139.771),
    spot("senso", "Senso-ji", "historic", 35.7148, 139.7967, { importance: "iconic", groups: ["heritage"], sitelinks: 40 }),
    spot("nakamise", "Nakamise", "shopping", 35.711, 139.796, { importance: "major", groups: ["heritage"] }),
    spot("skytree", "Tokyo Skytree", "viewpoint", 35.71, 139.8107, { importance: "major", groups: ["landmark"] }),
    spot("ueno", "Tokyo National Museum", "museum", 35.7188, 139.7765, { importance: "major", groups: ["heritage"], indoor: true }),
    spot("meiji", "Meiji Jingu", "historic", 35.6764, 139.6993, { importance: "iconic", groups: ["heritage"], sitelinks: 30 }),
    spot("harajuku", "Takeshita Street", "shopping", 35.6717, 139.703, { importance: "interest", groups: ["neighbourhood"] }),
    spot("shibuya", "Shibuya Crossing", "landmark", 35.6595, 139.7004, { importance: "iconic", groups: ["city"], sitelinks: 50 }),
    spot("shinjuku", "Tokyo Metropolitan Government Building", "viewpoint", 35.6896, 139.6917, { importance: "major", groups: ["landmark"] }),
    spot("ginza", "Kabukiza", "historic", 35.6696, 139.7677, { importance: "major", groups: ["heritage"] }),
    spot("teamlab", "teamLab Borderless", "attraction", 35.626, 139.783, { importance: "major", groups: ["city"] }),
  ];
  const trip = buildTrip({
    destination: "Tokyo",
    areas: [tokyo],
    start: "2026-11-02",
    nights: 5,
    adults: 2,
    childAges: [],
    pace: "balanced",
    move: "transit",
    oneBase: true,
    interests: [],
    rejected: [],
    mustVisit: [],
    salt: 1,
    lockedDates: [],
    spots,
    weather: [],
    styles: ["comfort"],
    balance: "balanced",
    firstVisit: true,
    skeleton: plan?.days,
    playbook: plan?.view,
    foodPlanning: "balanced",
  });
  assert.equal(trip.hotelSelectionSource, "NONE");
  assert.equal(trip.stops.some((stop) => stop.day != null && /Mandarin/i.test(stop.name)), false);
  assert.equal(trip.stops.some((stop) => stop.day != null && stop.category === "stay" && stop.provider !== "area"), false);
  const lunches = trip.stops.filter((stop) => stop.day != null && stop.meal === "lunch");
  const byDay = new Map<number, number>();
  for (const stop of lunches) byDay.set(stop.day ?? -1, (byDay.get(stop.day ?? -1) ?? 0) + 1);
  assert.equal([...byDay.values()].every((count) => count <= 1), true);
  assert.equal(trip.stops.some((stop) => stop.day != null && stop.name === "CASA MONTES"), false);
  assert.equal(trip.days.some((day) => /東京都|More time in More time/i.test(`${day.theme} ${day.intent} ${day.area}`)), false);
  const full = trip.days.filter((day) => day.dayType === "FULL_DAY");
  assert.ok(full.length >= 1);
  for (const day of full) {
    const sights = trip.stops.filter((stop) => stop.day === day.index && stop.category !== "stay" && stop.category !== "restaurant" && stop.category !== "cafe");
    assert.ok(sights.length >= 3, `${day.theme} had ${sights.length}`);
  }
  const outline = dayOutline(trip, 1);
  assert.doesNotMatch(outline.headline, /More time in More time|東京都/);
  assert.equal(validateWholeTrip(trip).problems.some((item) => item.includes("exact-hotel")), false);
  const check = validateTravelDay(trip, full[0]?.index ?? 1);
  assert.equal(check.duplicateMealWindows, 0);
});

test("culture, nature, and a child change the Tokyo shape, and no child does not", async () => {
  await ensureTravelPlaybook("Tokyo", { latitude: 35.6812, longitude: 139.7671, countryCode: "JP" });
  const base = {
    destination: "Tokyo",
    nights: 5,
    pace: "balanced" as const,
    oneBase: true,
    interests: [] as ("culture" | "nature" | "food")[],
    balance: "balanced" as const,
    firstVisit: true,
    childAges: [] as number[],
  };
  const comfort = adaptPlaybook({ ...base, styles: ["comfort"] }, listPlaybooks());
  const culture = adaptPlaybook({ ...base, styles: ["culture"] }, listPlaybooks());
  const nature = adaptPlaybook({ ...base, styles: ["comfort"], balance: "nature", interests: ["nature"] }, listPlaybooks());
  const family = adaptPlaybook({ ...base, styles: ["comfort"], childAges: [6] }, listPlaybooks());
  const adults = adaptPlaybook({ ...base, styles: ["comfort"], childAges: [] }, listPlaybooks());
  assert.ok(culture?.days.some((day) => day.groups.includes("heritage") || day.role === "heritage" || day.role === "day-trip"));
  assert.ok(nature?.days.some((day) => day.role === "nature" || day.groups.includes("nature")));
  assert.equal(family?.days.some((day) => day.groups.includes("family")), true);
  assert.equal(family?.days.some((day) => /family day|with the children/i.test(day.title)), false);
  assert.equal(adults?.days.some((day) => day.role === "family" || day.groups.includes("family")), false);
  assert.doesNotMatch(adults?.view.changes.join(" ") ?? "", /child/i);
  assert.ok(comfort);
});

test("cleanTheme collapses a duplicated local-script heading", () => {
  assert.equal(cleanTheme("More time in More time in 東京都", "Tokyo"), "Tokyo");
  assert.equal(cleanTheme("Asakusa", "Tokyo"), "Asakusa");
});
