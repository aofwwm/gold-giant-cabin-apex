import assert from "node:assert/strict";
import test from "node:test";
import { buildTrip, type DiscoveredPlace, type TravelArea } from "./travel-model.ts";
import {
  adaptPlaybook,
  consensusFrom,
  describePlaybook,
  selectBand,
  type PlaybookInput,
} from "./travel-playbook.ts";
import { PLAYBOOKS } from "./travel-playbooks.ts";

const japanBase: PlaybookInput = {
  destination: "Japan",
  nights: 7,
  pace: "balanced",
  oneBase: true,
  interests: ["food"],
  styles: ["comfort", "culture"],
  balance: "balanced",
  firstVisit: true,
  childAges: [],
};

function plan(overrides: Partial<PlaybookInput> = {}) {
  const next = adaptPlaybook({ ...japanBase, ...overrides });
  assert.ok(next);
  return next;
}

test("Japan classic is a route, not a blank POI list", () => {
  const next = plan();
  assert.equal(next.bandId, "classic");
  assert.equal(next.view.title, "Kairos Classic");
  assert.match(next.view.line, /proven starting point/i);
  assert.match(next.view.version, /Culture \+ Food/);
  const nodes = next.days.map((day) => day.nodeId);
  assert.ok(nodes.includes("tokyo"));
  assert.ok(nodes.includes("kyoto"));
  assert.ok(nodes.includes("fuji"));
  assert.ok(next.days.some((day) => day.nodeId === "nara" && day.visitMode === "DAY_TRIP"));
  assert.ok(next.days.some((day) => day.role === "food"));
  assert.equal(next.days.filter((day) => day.role === "family").length, 0);
  assert.doesNotMatch(next.view.changes.join(" "), /child/i);
  const changes = next.days.reduce((count, day, index) => count + (index > 0 && day.stayName !== next.days[index - 1]?.stayName ? 1 : 0), 0);
  assert.ok(changes <= 2);
  assert.match(next.view.hotelNote, /day trip/i);
});

test("a shorter Japan trip uses a different band, not a crushed classic", () => {
  const week = plan();
  const taste = plan({ nights: 5, interests: [], styles: ["comfort"] });
  assert.equal(taste.bandId, "taste");
  assert.notEqual(taste.bandId, week.bandId);
  assert.equal(taste.days.length, 5);
  assert.equal(plan({ nights: 10 }).bandId, "deeper");
  assert.ok(plan({ nights: 10 }).days.some((day) => day.nodeId === "hiroshima"));
});

test("nature adds scenic time and does not invent a child", () => {
  const classic = plan();
  const nature = plan({ balance: "nature", interests: ["nature"], styles: ["comfort"] });
  const natureDays = (input: typeof classic) => input.days.filter((day) => day.role === "nature" || day.groups.includes("nature")).length;
  assert.ok(natureDays(nature) > natureDays(classic));
  assert.ok(nature.days.some((day) => day.nodeId === "kyoto" || day.nodeId === "tokyo"));
  assert.equal(nature.days.filter((day) => day.role === "family").length, 0);
});

test("children change the plan only when the current trip has them", () => {
  const none = plan({ interests: [], styles: ["comfort"] });
  const family = plan({ interests: [], styles: ["comfort"], childAges: [3] });
  assert.equal(none.days.some((day) => day.role === "family" || day.groups.includes("family")), false);
  assert.equal(family.days.some((day) => day.groups.includes("family")), true);
  assert.equal(family.days.some((day) => /family day|with the children/i.test(day.title)), false);
  assert.match(family.view.changes.join(" "), /children on this trip/);
  assert.doesNotMatch(none.view.changes.join("\n"), /child/i);
});

test("a city-heavy Japan plan uses Kamakura as a day trip", () => {
  const city = plan({ balance: "city", interests: [], styles: ["culture"] });
  const kamakura = city.days.find((day) => day.nodeId === "kamakura");
  assert.ok(kamakura);
  assert.equal(kamakura?.visitMode, "DAY_TRIP");
  const book = PLAYBOOKS.find((item) => item.id === "japan");
  assert.equal(book?.nodes.find((node) => node.id === "kamakura")?.kind, "town");
});

test("Iceland is a road corridor, with a different band for the ring", () => {
  const week = adaptPlaybook({
    destination: "Iceland",
    nights: 7,
    pace: "balanced",
    oneBase: true,
    interests: ["nature"],
    styles: ["adventure"],
    balance: "nature",
    firstVisit: true,
    childAges: [],
  });
  assert.ok(week);
  assert.equal(week?.bandId, "south");
  assert.ok(week?.days.some((day) => day.areaName === "Golden Circle" || day.areaName === "South Coast"));
  assert.ok(week?.days.some((day) => day.stayName !== "Reykjavík"));
  const taste = adaptPlaybook({ destination: "Iceland", nights: 4, pace: "balanced", oneBase: true, interests: [], styles: ["comfort"], balance: "nature", firstVisit: true, childAges: [] });
  const ring = adaptPlaybook({ destination: "Iceland", nights: 10, pace: "balanced", oneBase: false, interests: ["nature"], styles: ["adventure"], balance: "nature", firstVisit: true, childAges: [] });
  assert.equal(taste?.bandId, "taste");
  assert.equal(ring?.bandId, "ring");
  assert.notEqual(ring?.bandId, week?.bandId);
  assert.match(describePlaybook("iceland"), /Sources/);
});

test("Paris keeps Versailles as a day and the icons in the city", () => {
  const paris = adaptPlaybook({
    destination: "Paris, France",
    nights: 5,
    pace: "balanced",
    oneBase: true,
    interests: ["food"],
    styles: ["culture"],
    balance: "balanced",
    firstVisit: true,
    childAges: [],
  });
  assert.equal(paris?.id, "paris");
  assert.ok(paris?.days.some((day) => day.areaName === "Versailles" && day.visitMode === "DAY_TRIP"));
  assert.ok(paris?.days.some((day) => day.hints.some((hint) => /eiffel|louvre/i.test(hint))));
  assert.equal(new Set(paris?.days.map((day) => day.stayName)).size, 1);
});

test("Chengdu includes the panda base and a regional day", () => {
  const chengdu = adaptPlaybook({
    destination: "Chengdu",
    nights: 5,
    pace: "balanced",
    oneBase: true,
    interests: ["nature"],
    styles: ["culture", "comfort"],
    balance: "nature",
    firstVisit: true,
    childAges: [],
  });
  assert.ok(chengdu?.days.some((day) => day.hints.some((hint) => /panda/i.test(hint))));
  assert.ok(chengdu?.days.some((day) => day.visitMode !== "STAY" && /Dujiangyan|Leshan|Qingcheng/i.test(day.areaName + day.title)));
});

test("Nagoya is a base with an Inuyama day, not a city-wall plan", () => {
  const nagoya = adaptPlaybook({
    destination: "Nagoya",
    nights: 5,
    pace: "balanced",
    oneBase: true,
    interests: [],
    styles: ["comfort"],
    balance: "balanced",
    firstVisit: true,
    childAges: [],
  });
  const trip = nagoya?.days.find((day) => day.areaName === "Inuyama");
  assert.equal(trip?.visitMode, "DAY_TRIP");
  assert.equal(nagoya?.days.every((day) => day.stayName === "Nagoya"), true);
});

test("France, Switzerland, and Italy stay in one west-to-east route", () => {
  const multi = adaptPlaybook({
    destination: "France, Switzerland, Italy",
    nights: 12,
    pace: "balanced",
    oneBase: false,
    interests: ["culture"],
    styles: ["comfort", "culture"],
    balance: "balanced",
    firstVisit: true,
    childAges: [],
  });
  assert.equal(multi?.scope, "multi");
  const stays = multi?.days.map((day) => day.stayName) ?? [];
  const first = (name: string) => stays.indexOf(name);
  assert.ok(first("Paris") >= 0);
  assert.ok(first("Paris") < first("Lucerne"));
  assert.ok(first("Lucerne") < first("Florence"));
  assert.match(multi?.view.route ?? "", /Paris → Lucerne → Florence/);
});

test("consensus does not call a single-source city the same as a two-source pattern", () => {
  const iceland = PLAYBOOKS.find((book) => book.id === "iceland");
  assert.ok(iceland);
  const graph = consensusFrom(iceland?.references ?? []);
  const golden = graph.nodes.find((node) => node.name === "Golden Circle");
  assert.equal(golden?.signal, "core");
  assert.ok((golden?.sources ?? 0) >= 2);
  const japan = PLAYBOOKS.find((book) => book.id === "japan");
  const japanGraph = consensusFrom(japan?.references ?? []);
  const hiroshima = japanGraph.nodes.find((node) => node.name === "Hiroshima");
  assert.notEqual(hiroshima?.signal, "core");
  assert.equal(japan?.confidence, "medium");
});

test("an unknown destination has no playbook", () => {
  assert.equal(adaptPlaybook({ ...japanBase, destination: "Lagos" }), null);
});

test("band selection does not jump to a much longer pattern", () => {
  const japan = PLAYBOOKS.find((book) => book.id === "japan");
  assert.ok(japan);
  assert.equal(selectBand(japan, 5, true).id, "taste");
  assert.equal(selectBand(japan, 7, true).id, "classic");
  assert.equal(selectBand(japan, 14, true).id, "long");
});

test("Kamakura is not scheduled as the town itself", () => {
  const kamakura: TravelArea = { name: "Kamakura", latitude: 35.3192, longitude: 139.5467 };
  const tokyo: TravelArea = { name: "Tokyo", latitude: 35.6812, longitude: 139.7671 };
  const spot = (id: string, name: string, area: TravelArea, category: DiscoveredPlace["category"], shift = 0.01): DiscoveredPlace => ({
    id,
    provider: "osm",
    providerId: id,
    name,
    category,
    address: area.name,
    lat: area.latitude + shift,
    lng: area.longitude + shift,
    indoor: category !== "historic",
    area: area.name,
    opening: "",
  });
  const adapted = plan({ balance: "city", interests: [], styles: ["culture"] });
  const skeleton = adapted.days.map((day, index) => ({ ...day, index }));
  const trip = buildTrip({
    destination: "Japan",
    areas: [tokyo],
    start: "2026-11-02",
    nights: 7,
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
    spots: [
      spot("stay", "Hotel in Tokyo", tokyo, "stay", 0.002),
      spot("town", "Kamakura", kamakura, "attraction", 0),
      spot("buddha", "Kōtoku-in", kamakura, "historic", 0.004),
      spot("shrine", "Tsurugaoka Hachimangu", kamakura, "historic", 0.006),
      spot("cafe", "Shibuya Cafe", tokyo, "cafe", 0.01),
      spot("tower", "Tokyo Tower", tokyo, "landmark", 0.008),
    ],
    weather: [],
    styles: ["culture"],
    balance: "city",
    firstVisit: true,
    skeleton,
    playbook: adapted.view,
  });
  const kamakuraDay = trip.days.find((day) => day.intent === "Kamakura");
  assert.ok(kamakuraDay);
  const rows = trip.stops.filter((stop) => stop.day === kamakuraDay?.index && stop.category !== "stay");
  assert.ok(rows.some((stop) => /Hachimangu|Kōtoku|Kotoku/i.test(stop.name)));
  assert.equal(rows.some((stop) => stop.name === "Kamakura"), false);
  assert.equal(rows.some((stop) => stop.name === "Shibuya Cafe"), false);
  assert.equal(trip.playbook?.title, "Kairos Classic");
  assert.doesNotMatch(JSON.stringify(trip.legs.map((leg) => leg.recommendationReason)), /young child/i);
});

test("a day-trip area without places stays a full day, not a 90-minute stop", () => {
  const adapted = plan({ balance: "city", interests: [], styles: ["culture"] });
  const tokyo: TravelArea = { name: "Tokyo", latitude: 35.6812, longitude: 139.7671 };
  const trip = buildTrip({
    destination: "Japan",
    areas: [tokyo],
    start: "2026-11-02",
    nights: 7,
    adults: 2,
    childAges: [],
    pace: "balanced",
    move: "walk",
    oneBase: true,
    interests: [],
    rejected: [],
    mustVisit: [],
    salt: 0,
    lockedDates: [],
    spots: [],
    weather: [],
    skeleton: adapted.days,
    playbook: adapted.view,
  });
  const kamakuraDay = trip.days.find((day) => /Kamakura/i.test(`${day.intent ?? ""} ${day.theme ?? ""} ${day.area ?? ""}`));
  assert.ok(kamakuraDay);
  const rows = trip.stops.filter((stop) => stop.day === kamakuraDay?.index && stop.category !== "stay" && stop.category !== "restaurant" && stop.category !== "cafe");
  assert.equal(rows.some((stop) => stop.name === "Kamakura" && (stop.duration ?? 0) < 240), false);
  const block = rows.find((stop) => stop.name === "Kamakura" && stop.provider === "area");
  const places = rows.filter((stop) => stop.provider !== "area");
  if (!places.length) {
    assert.ok(block);
    assert.ok((block?.duration ?? 0) >= 240);
    assert.equal(block?.provider, "area");
  } else {
    assert.ok(places.some((stop) => /Hachimangu|Kōtoku|Kotoku|Hase/i.test(stop.name)));
    assert.equal(places.some((stop) => stop.name === "Kamakura"), false);
    assert.ok(places.every((stop) => (stop.duration ?? 0) >= 45));
  }
});
