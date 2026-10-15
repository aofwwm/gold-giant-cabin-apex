import assert from "node:assert/strict";
import test from "node:test";
import { anchorsForDestination } from "./travel-anchors.ts";
import { buildTrip, validateTravelDay, type DiscoveredPlace, type TravelArea } from "./travel-model.ts";
import { adaptPlaybook } from "./travel-playbook.ts";
import { ensureTravelPlaybook, listPlaybooks, resetPlaybookRegistryForTests } from "./travel-playbook-registry.ts";
import { isGenericDayTheme } from "./travel-names.ts";

const tokyo: TravelArea = { name: "Tokyo", latitude: 35.6812, longitude: 139.7671 };
const paris: TravelArea = { name: "Paris", latitude: 48.8566, longitude: 2.3522 };
const chengdu: TravelArea = { name: "Chengdu", latitude: 30.6598, longitude: 104.0657 };

function spot(id: string, name: string, category: DiscoveredPlace["category"], lat: number, lng: number): DiscoveredPlace {
  return { id, provider: "osm", providerId: id, name, category, address: name, lat, lng, indoor: false, area: name, opening: "", importance: "interest", groups: ["neighbourhood"] };
}

const planInput = {
  nights: 5,
  pace: "balanced" as const,
  oneBase: true,
  interests: [] as [],
  styles: ["comfort"] as ("comfort" | "culture")[],
  balance: "balanced" as const,
  firstVisit: true,
  childAges: [] as number[],
};

async function planned(destination: string, area: TravelArea, spots: DiscoveredPlace[], extra: Partial<typeof planInput> = {}) {
  await ensureTravelPlaybook(destination, { latitude: area.latitude, longitude: area.longitude });
  const plan = adaptPlaybook({ destination, ...planInput, ...extra }, listPlaybooks());
  assert.ok(plan);
  return buildTrip({
    destination,
    areas: [area],
    start: "2026-11-02",
    nights: extra.nights ?? 5,
    adults: 2,
    childAges: extra.childAges ?? [],
    pace: "balanced",
    move: "transit",
    oneBase: true,
    interests: extra.interests ?? [],
    rejected: [],
    mustVisit: [],
    salt: 2,
    lockedDates: [],
    spots,
    weather: [],
    styles: extra.styles ?? ["comfort"],
    balance: extra.balance ?? "balanced",
    firstVisit: true,
    skeleton: plan?.days,
    playbook: plan?.view,
  });
}

function sights(trip: ReturnType<typeof buildTrip>, day: number) {
  return trip.stops.filter((stop) => stop.day === day && stop.category !== "stay" && stop.category !== "restaurant" && stop.category !== "cafe" && stop.provider !== "area");
}

test("a major playbook carries anchors, not only area nodes", async () => {
  resetPlaybookRegistryForTests();
  const book = await ensureTravelPlaybook("Tokyo", { latitude: 35.6812, longitude: 139.7671, countryCode: "JP" });
  assert.ok((book?.anchors?.length ?? 0) >= 8);
  assert.ok(book?.patterns?.some((pattern) => pattern.theme === "Historic East Tokyo"));
  assert.ok(book?.anchors?.some((item) => item.areaId === "kamakura" && item.tier === "core"));
  assert.ok(anchorsForDestination("Tokyo").some((item) => item.wikidataId));
});

test("sparse Tokyo OSM still produces a first-trip shape", async () => {
  const trip = await planned("Tokyo", tokyo, [spot("aki", "Akihabara Radio Kaikan", "shopping", 35.6984, 139.7731)]);
  const names = trip.stops.filter((stop) => stop.day != null).map((stop) => stop.name).join(" | ");
  assert.match(names, /Senso-ji/);
  assert.match(names, /Meiji Jingu|Shibuya Crossing/);
  assert.match(names, /Kotoku-in|Tsurugaoka Hachimangu/);
  assert.doesNotMatch(names, /^Akihabara/);
  const full = trip.days.filter((day) => day.dayType === "FULL_DAY");
  assert.ok(full.length >= 1);
  for (const day of full) {
    assert.equal(isGenericDayTheme(day.theme || "", "Tokyo"), false, day.theme);
    assert.ok(sights(trip, day.index).length >= 2, `${day.theme} ${sights(trip, day.index).map((stop) => stop.name).join(",")}`);
  }
  const east = trip.days.find((day) => /Historic East Tokyo|Asakusa/i.test(`${day.theme} ${day.area}`));
  assert.ok(east);
  assert.ok(sights(trip, east.index).length >= 2);
  const kamakura = trip.days.find((day) => /Kamakura/i.test(`${day.theme} ${day.area}`));
  assert.equal(kamakura?.dayType, "EXCURSION_DAY");
  const kamakuraSights = sights(trip, kamakura?.index ?? -1);
  assert.ok(kamakuraSights.length >= 2);
  assert.equal(kamakuraSights.some((stop) => stop.name === "Kamakura"), false);
  assert.equal(kamakuraSights.some((stop) => stop.name === "Kamakura" && stop.duration <= 90), false);
  assert.ok((trip.curation?.anchorStops ?? 0) >= 4);
  assert.ok((trip.curation?.groupsSatisfied ?? []).includes("heritage"));
  assert.equal(trip.days.some((day) => isGenericDayTheme(day.theme || "", "Tokyo") && day.dayType === "FULL_DAY"), false);
});

test("generic full-day titles are rejected", () => {
  assert.equal(isGenericDayTheme("Tokyo", "Tokyo"), true);
  assert.equal(isGenericDayTheme("More Tokyo", "Tokyo"), true);
  assert.equal(isGenericDayTheme("More time in Tokyo", "Tokyo"), true);
  assert.equal(isGenericDayTheme("Historic East Tokyo", "Tokyo"), false);
  assert.equal(isGenericDayTheme("Shibuya and Harajuku", "Tokyo"), false);
  assert.equal(isGenericDayTheme("Paris", "Paris"), true);
});

test("a child adapts Tokyo days without a generic family day", async () => {
  const child = await planned("Tokyo", tokyo, [spot("aki", "Akihabara", "shopping", 35.698, 139.773)], { childAges: [6] });
  const adult = await planned("Tokyo", tokyo, [spot("aki", "Akihabara", "shopping", 35.698, 139.773)], { childAges: [] });
  assert.equal(child.days.some((day) => /family day|with the children/i.test(day.theme || "")), false);
  assert.ok(child.days.some((day) => day.requiredGroups?.includes("family") || day.groups === undefined));
  const childNames = child.stops.filter((stop) => stop.day != null).map((stop) => stop.name).join(" ");
  assert.match(childNames, /Ueno Zoo|teamLab Planets|Ueno Park|Yoyogi Park/);
  assert.doesNotMatch(adult.playbook?.changes.join(" ") ?? "", /child/i);
  assert.equal(adult.days.some((day) => day.requiredGroups?.includes("family")), false);
  assert.equal(validateTravelDay(child, child.days.find((day) => day.dayType === "FULL_DAY")?.index ?? 1).problems.includes("generic-theme"), false);
});

test("nature does not duplicate Hakone", async () => {
  const trip = await planned("Tokyo", tokyo, [], { balance: "nature", interests: ["nature"] });
  const hakone = trip.days.filter((day) => /Hakone/i.test(`${day.theme} ${day.area}`));
  assert.equal(hakone.length, 1);
  assert.match(trip.stops.filter((stop) => stop.day != null).map((stop) => stop.name).join(" "), /Lake Ashi|Owakudani|Hakone Shrine/);
});

test("sparse Paris and Chengdu keep defining anchors", async () => {
  const parisTrip = await planned("Paris", paris, [spot("cafe", "Cafe", "cafe", 48.86, 2.35)], { styles: ["culture"], interests: ["food"] });
  const parisNames = parisTrip.stops.filter((stop) => stop.day != null).map((stop) => stop.name).join(" ");
  assert.match(parisNames, /Eiffel Tower/);
  assert.match(parisNames, /Louvre/);
  assert.match(parisNames, /Versailles/);
  assert.equal(parisTrip.days.some((day) => day.dayType === "FULL_DAY" && isGenericDayTheme(day.theme || "", "Paris")), false);
  const chengduTrip = await planned("Chengdu", chengdu, [spot("lane", "Random Lane", "shopping", 30.66, 104.06)]);
  const chengduNames = chengduTrip.stops.filter((stop) => stop.day != null).map((stop) => stop.name).join(" ");
  assert.match(chengduNames, /Panda/);
  assert.match(chengduNames, /Wuhou|Jinli|Kuanzhai/);
  assert.ok((chengduTrip.curation?.anchorStops ?? 0) >= 3);
});
