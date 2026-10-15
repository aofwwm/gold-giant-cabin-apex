import assert from "node:assert/strict";
import test from "node:test";
import { RequestGate, TtlCache } from "./travel-cache.ts";
import { itemsFromTravel } from "./travel.ts";
import { classifyVisit, discoveryBox, mergePlaces } from "./travel-knowledge.ts";
import {
  annotatePlace,
  applySuggestedOrder,
  assessCoverage,
  bestDayFor,
  buildTrip,
  burdenFrom,
  categoryFromTags,
  compareBases,
  discoverSections,
  excludePlace,
  forecastLocal,
  itineraryRequestPlan,
  moveStop,
  pinKey,
  savePlace,
  suggestOrder,
  unscheduleStop,
  voiceStaysInside,
  type DiscoveredPlace,
  type TravelArea,
  type TripLeg,
} from "./travel-model.ts";

const osaka: TravelArea = { name: "Osaka", latitude: 34.69, longitude: 135.5 };
const kyoto: TravelArea = { name: "Kyoto", latitude: 35.01, longitude: 135.77 };

function spot(id: string, name: string, area: TravelArea, category: DiscoveredPlace["category"], indoor: boolean, shift = 0.01): DiscoveredPlace {
  return {
    id,
    provider: "osm",
    providerId: id,
    name,
    category,
    address: area.name,
    lat: area.latitude + shift,
    lng: area.longitude + shift,
    indoor,
    area: area.name,
    opening: category === "museum" ? "Tu-Su 10:00-17:00" : "",
  };
}

const spots: DiscoveredPlace[] = [
  spot("stay-o", "Dorm near Umeda", osaka, "stay", true, 0.002),
  spot("museum", "Osaka Museum", osaka, "museum", true, 0.01),
  spot("park", "Castle Park", osaka, "park", false, 0.02),
  spot("food", "Dotonbori Kitchen", osaka, "restaurant", true, 0.012),
  spot("stay-k", "Inn near Kawaramachi", kyoto, "stay", true, 0.002),
  spot("temple", "Kiyomizu", kyoto, "historic", false, 0.01),
  spot("cafe", "Gion Cafe", kyoto, "cafe", true, 0.011),
];

const baseInput = {
  destination: "Osaka",
  areas: [osaka, kyoto],
  start: "2026-10-10",
  nights: 5,
  adults: 2,
  childAges: [] as number[],
  pace: "balanced" as const,
  move: "transit" as const,
  oneBase: true,
  interests: [] as [],
  rejected: [] as string[],
  mustVisit: [] as string[],
  salt: 0,
  lockedDates: [] as string[],
  spots,
  weather: [] as { date: string; outdoorOk: boolean | null; summary: string }[],
};

test("one base stays chosen when asked, and the other city is still compared", () => {
  const trip = buildTrip({ ...baseInput, transfers: [[0, 200], [200, 0]] });
  assert.equal(trip.bases.find((base) => base.id === "one")?.chosen, true);
  assert.equal(trip.burden.hotelChanges, 0);
  assert.match(trip.bases.find((base) => base.id === "split")?.note ?? "", /luggage|check/i);
  assert.equal(trip.days.some((day) => day.area === "Kyoto"), true);
  assert.match(trip.transitNote, /aren't available|taxi/i);
  assert.equal(trip.stops.some((stop) => /rating|stars/i.test(JSON.stringify(stop))), false);
});

test("a hotel change is chosen only when the day trips cost more", () => {
  const forced = compareBases([{ name: "Osaka" }, { name: "Kyoto" }], [[0, 200], [200, 0]], true, 6);
  assert.equal(forced.mode, "single");
  const split = compareBases([{ name: "Osaka" }, { name: "Kyoto" }], [[0, 200], [200, 0]], false, 6);
  assert.equal(split.mode, "split");
  assert.equal(split.options.find((option) => option.chosen)?.hotelChanges, 1);
});

test("missing hotels become an area anchor, not a made-up property", () => {
  const trip = buildTrip({ ...baseInput, areas: [osaka], spots: spots.filter((item) => item.category !== "stay"), oneBase: true });
  const stay = trip.stops.find((stop) => stop.category === "stay");
  assert.equal(stay?.provider, "area");
  assert.match(stay?.name ?? "", /^Suggested base area · Osaka/);
  assert.match(stay?.note ?? "", /Not a hotel/);
});

test("a wet day prefers the indoor museum and keeps the opening hours that were mapped", () => {
  const trip = buildTrip({
    ...baseInput,
    areas: [osaka],
    spots: spots.filter((item) => item.area === "Osaka"),
    weather: [{ date: "2026-10-10", outdoorOk: false, summary: "Rain." }],
    nights: 1,
    pace: "full",
  });
  const names = trip.stops.filter((stop) => stop.day === 0).map((stop) => stop.name);
  assert.ok(names.includes("Osaka Museum"));
  assert.equal(names.includes("Castle Park"), false);
  assert.match(trip.stops.find((stop) => stop.name === "Osaka Museum")?.opening ?? "", /10:00/);
});

test("rejected and missing names are not invented onto the map", () => {
  const trip = buildTrip({ ...baseInput, areas: [osaka], rejected: ["Osaka Museum"], mustVisit: ["Osaka Museum", "Nara"], spots: spots.filter((item) => item.area === "Osaka") });
  assert.equal(trip.stops.some((stop) => stop.name === "Osaka Museum"), false);
  assert.deepEqual(trip.unmatched, ["Nara"]);
  assert.match(trip.notes.join(" "), /Nara/);
});

test("moving or unscheduling a stop keeps its coordinates", () => {
  const trip = buildTrip({ ...baseInput, areas: [osaka], spots: spots.filter((item) => item.area === "Osaka"), nights: 3 });
  const sight = trip.stops.find((stop) => stop.day === 0 && stop.category !== "stay" && stop.category !== "restaurant");
  assert.ok(sight);
  const moved = moveStop(trip, sight.id, 1);
  const after = moved.stops.find((stop) => stop.id === sight.id);
  assert.equal(after?.lat, sight.lat);
  assert.equal(after?.lng, sight.lng);
  const saved = unscheduleStop(trip, sight.id);
  const loose = saved.stops.find((stop) => stop.id === sight.id);
  assert.equal(loose?.day, null);
  assert.equal(loose?.lat, sight.lat);
  assert.equal(saved.stops.filter((stop) => stop.day === 0).some((stop) => stop.id === sight.id), false);
});

test("a young child does not start before 10:00", () => {
  const trip = buildTrip({ ...baseInput, areas: [osaka], spots: spots.filter((item) => item.area === "Osaka"), childAges: [4], nights: 2 });
  const first = trip.stops.find((stop) => stop.day === 0 && stop.category === "stay");
  assert.equal(first?.startTime, "10:00");
});

test("today reads the new trip and still reads an older plan", () => {
  const trip = buildTrip({ ...baseInput, areas: [osaka], spots: spots.filter((item) => item.area === "Osaka"), nights: 2 });
  const items = itemsFromTravel("2026-10-10", trip);
  assert.ok(items.length >= 1);
  assert.equal(items.some((item) => item.title.startsWith("Stay near")), false);
  assert.equal(items.every((item) => Number.isFinite(item.place?.latitude)), true);
  const old = itemsFromTravel("2026-10-10", {
    days: [{
      date: "2026-10-10",
      locked: false,
      stops: [{ id: "old", kind: "morning", title: "Old stop", address: "Osaka", latitude: 1, longitude: 2, minutes: 5, indoor: false, startMin: 600, endMin: 660, note: "" }],
    }],
  });
  assert.equal(old[0]?.title, "Old stop");
});

test("burden, voice guard, forecast hour, and request count stay honest", () => {
  const leg = { fromId: "a", toId: "b", day: 0, mode: "walk" as const, minutes: 40, meters: 3000, source: "osrm" as const, label: "" };
  const tired = burdenFrom([leg, { ...leg, minutes: 50 }] as TripLeg[], 0, [], "walk", false);
  assert.match(tired.line, /tiring/);
  assert.equal(voiceStaysInside("Book now at a five-star hotel."), false);
  assert.equal(voiceStaysInside("One stay. The wet day stays indoors."), true);
  assert.deepEqual(forecastLocal("2026-10-03T16:00:00Z", 135), { date: "2026-10-04", hour: 1 });
  assert.equal(itineraryRequestPlan(2, 7).total, 2 + 1 + 1 + 7 + 2);
  assert.equal(itineraryRequestPlan(2, 7).routes, 7);
  assert.equal(itineraryRequestPlan(2, 7).overpass, 2);
  assert.equal(categoryFromTags({ tourism: "museum" })?.category, "museum");
  assert.equal(categoryFromTags({ amenity: "restaurant", name: "X" })?.category, "restaurant");
  assert.equal(categoryFromTags({ shop: "bakery" }), null);
});

test("pins collapse to one coordinate key and the gate blocks a burst", () => {
  const trip = buildTrip({ ...baseInput, areas: [osaka], spots: spots.filter((item) => item.area === "Osaka"), nights: 2 });
  const stays = trip.stops.filter((stop) => stop.providerId === "stay-o");
  assert.ok(stays.length >= 1);
  assert.equal(new Set(stays.map((stop) => pinKey(stop))).size, 1);
  const gate = new RequestGate(2, 1_000);
  assert.equal(gate.allow(1_000), true);
  assert.equal(gate.allow(1_100), true);
  assert.equal(gate.allow(1_200), false);
  const cache = new TtlCache<string>(1_000);
  cache.set("osaka", "hit");
  assert.equal(cache.get("osaka"), "hit");
});

test("transit is never labelled as a road journey", () => {
  const trip = buildTrip({ ...baseInput, areas: [osaka], spots: spots.filter((item) => item.area === "Osaka"), nights: 2, move: "transit" });
  assert.match(trip.transitNote, /aren't available|taxi/i);
  for (const leg of trip.legs) {
    assert.equal(/by road/i.test(leg.label), false);
    assert.equal(leg.shown === "transit", false);
    assert.equal(leg.alternatives?.some((item) => item.mode === "transit" && item.source === "unavailable"), true);
  }
});

test("city balance leaves a far mountain out, nature balance keeps it", () => {
  const museum = { ...spot("museum", "City Museum", osaka, "museum", true, 0.01), importance: "iconic" as const, groups: ["heritage"], sitelinks: 40, distanceKm: 2, excursion: "none" as const };
  const mountain = { ...spot("peak", "Qingcheng Mountain", osaka, "park", false, 0.45), importance: "iconic" as const, groups: ["nature", "excursion"], sitelinks: 30, distanceKm: 45, excursion: "full" as const };
  const local = spots.filter((item) => item.area === "Osaka" && item.category !== "museum" && item.category !== "park");
  const shared = { ...baseInput, areas: [osaka], spots: [...local, museum, mountain], nights: 6, interests: ["culture", "nature"] as ("culture" | "nature")[], firstVisit: true };
  const city = buildTrip({ ...shared, balance: "city" });
  const nature = buildTrip({ ...shared, balance: "nature" });
  assert.equal(city.stops.some((stop) => stop.day != null && stop.name === "Qingcheng Mountain"), false);
  assert.equal(nature.stops.some((stop) => stop.day != null && stop.name === "Qingcheng Mountain"), true);
  assert.equal(city.stops.some((stop) => stop.day != null && stop.name === "City Museum"), true);
  const row = nature.coverage?.find((item) => item.example === "City Museum" || item.group === "heritage");
  assert.ok(row);
  assert.equal(city.coverage?.some((item) => item.example === "Qingcheng Mountain" && item.status === "omitted"), true);
});

test("omitted major sights stay available to add, save, or refuse", () => {
  const museum = { ...spot("museum", "City Museum", osaka, "museum", true, 0.01), importance: "major" as const, groups: ["heritage"], sitelinks: 12, distanceKm: 2 };
  const other = { ...spot("temple", "Wenshu", osaka, "historic", true, 0.03), importance: "iconic" as const, groups: ["heritage"], sitelinks: 20, distanceKm: 3, description: "A Buddhist temple." };
  const trip = buildTrip({ ...baseInput, areas: [osaka], spots: [...spots.filter((item) => item.area === "Osaka" && item.id !== "museum"), museum, other], nights: 2, balance: "city" });
  const sections = discoverSections(trip);
  const names = sections.flatMap((section) => section.stops.map((stop) => stop.name));
  assert.equal(names.includes("Wenshu") || trip.stops.some((stop) => stop.name === "Wenshu" && stop.day != null), true);
  const loose = trip.stops.find((stop) => stop.day == null && stop.name === "Wenshu") ?? trip.stops.find((stop) => stop.name === "Wenshu");
  assert.ok(loose);
  const saved = savePlace(trip, loose.id);
  assert.equal(saved.stops.find((stop) => stop.id === loose.id)?.bucket === "saved" || saved.stops.find((stop) => stop.id === loose.id)?.day != null, true);
  const gone = excludePlace(trip, loose.id);
  assert.equal(gone.stops.find((stop) => stop.id === loose.id)?.excluded, true);
  assert.equal(discoverSections(gone).some((section) => section.stops.some((stop) => stop.id === loose.id)), false);
});

test("hotel facts stay off the card when the traveller did not ask, and nothing is invented", () => {
  const hotel = { ...spot("stay-o", "Dorm near Umeda", osaka, "stay", true, 0.002), hotel: { airConditioning: "unknown" as const, stars: "", internet: "", breakfast: "", parking: "", wheelchair: "", roomSize: "" } };
  const trip = buildTrip({ ...baseInput, areas: [osaka], spots: [hotel, ...spots.filter((item) => item.area === "Osaka" && item.category !== "stay")], nights: 2 });
  const card = trip.hotels?.find((item) => item.name === "Dorm near Umeda");
  assert.ok(card);
  assert.equal(card?.role, "Best overall");
  assert.deepEqual(card?.unverified, []);
  assert.equal(/another mapped stay|not verified|no reliable review/i.test(`${card?.why} ${card?.role} ${card?.location}`), false);
  assert.equal(card?.booked, false);
  assert.equal(trip.hotelPreferences?.burden, "balanced");
  assert.ok(trip.hotelMemory?.previous.includes(card?.stopId ?? ""));
});

test("a backtracking day can be reordered without a new plan", () => {
  const east = spot("east", "East Gate", osaka, "museum", true, 0.02);
  const west = spot("west", "West Gate", osaka, "historic", true, -0.02);
  const mid = spot("mid", "Mid Hall", osaka, "attraction", true, 0.0);
  const trip = buildTrip({ ...baseInput, areas: [osaka], spots: [spot("stay-o", "Dorm near Umeda", osaka, "stay", true, 0.002), east, west, mid], nights: 1, pace: "full" });
  const day = 0;
  const jumbled = {
    ...trip,
    stops: trip.stops.map((stop) => {
      if (stop.name === "West Gate") return { ...stop, startTime: "09:30" };
      if (stop.name === "East Gate") return { ...stop, startTime: "11:00" };
      if (stop.name === "Mid Hall") return { ...stop, startTime: "13:00" };
      return stop;
    }),
  };
  const idea = suggestOrder(jumbled, day);
  if (idea) {
    const applied = applySuggestedOrder(jumbled, day);
    assert.equal(applied.stops.find((stop) => stop.name === "West Gate")?.lat, west.lat);
    assert.ok((idea.saved ?? 0) >= 15);
  }
  const loose = trip.stops.find((stop) => stop.day == null);
  if (loose) {
    const fit = bestDayFor(trip, loose.id);
    assert.equal(typeof fit?.day, "number");
  }
});

test("a far place keeps the day, and two far places do not share one", () => {
  const stay = spot("stay-o", "Dorm near Umeda", osaka, "stay", true, 0.002);
  const museum = { ...spot("museum", "City Museum", osaka, "museum", true, 0.01), importance: "iconic" as const, groups: ["heritage"], sitelinks: 20, distanceKm: 2, excursion: "none" as const };
  const mountain = { ...spot("peak", "Qingcheng Mountain", osaka, "park", false, 0.45), importance: "iconic" as const, groups: ["nature", "excursion"], sitelinks: 36, distanceKm: 45, excursion: "full" as const };
  const water = { ...spot("dam", "Dujiangyan", osaka, "historic", false, 0.5), importance: "iconic" as const, groups: ["heritage", "excursion"], sitelinks: 37, distanceKm: 50, excursion: "full" as const };
  const panda = { ...spot("panda", "Panda Base", osaka, "zoo", false, 0.08), importance: "major" as const, groups: ["wildlife"], sitelinks: 13, distanceKm: 10, excursion: "none" as const };
  const trip = buildTrip({
    ...baseInput,
    areas: [osaka],
    spots: [stay, museum, mountain, water, panda],
    nights: 6,
    balance: "balanced",
    firstVisit: true,
    interests: ["culture", "nature"],
  });
  const days = new Set<number>();
  for (const name of ["Qingcheng Mountain", "Dujiangyan"]) {
    const stop = trip.stops.find((item) => item.name === name && item.day != null);
    assert.ok(stop, name);
    const sights = trip.stops.filter((item) => item.day === stop?.day && item.category !== "stay" && item.category !== "restaurant" && item.category !== "cafe");
    assert.equal(sights.length, 1, name);
    days.add(stop?.day ?? -1);
  }
  assert.equal(days.size, 2);
  assert.equal(trip.stops.some((item) => item.day != null && item.name === "Panda Base"), true);
});

test("importance comes from sitelinks, not a made-up score", () => {
  const iconic = annotatePlace({ ...spot("panda", "Giant Panda Base", osaka, "zoo", false, 0.05), sitelinks: 40 }, osaka.latitude, osaka.longitude);
  const local = annotatePlace(spot("cafe", "Side Cafe", osaka, "cafe", true, 0.01), osaka.latitude, osaka.longitude);
  assert.equal(iconic.importance, "iconic");
  assert.equal(iconic.groups?.includes("wildlife"), true);
  assert.notEqual(local.importance, "iconic");
  const rows = assessCoverage([iconic, local], [], 6, true, "balanced");
  assert.equal(rows.some((row) => row.example === "Giant Panda Base" && row.status === "omitted"), true);
});

test("Paris-shaped types are visitable and admin junk is not", () => {
  assert.equal(classifyVisit("lattice tower | architectural landmark", "Eiffel Tower")?.category, "attraction");
  assert.equal(classifyVisit("Catholic cathedral | minor basilica", "Notre-Dame de Paris")?.category, "historic");
  assert.equal(classifyVisit("triumphal arch", "Arc de Triomphe")?.category, "historic");
  assert.equal(classifyVisit("boulevard | avenue", "avenue des Champs-Élysées")?.groups?.[0], "neighbourhood");
  assert.equal(classifyVisit("urban park", "Jardin du Luxembourg")?.category, "park");
  assert.equal(classifyVisit("public garden", "Tuileries Garden")?.category, "garden");
  assert.equal(classifyVisit("language | natural language", "French"), null);
  assert.equal(classifyVisit("commune of France", "Boulogne-Billancourt"), null);
  assert.equal(classifyVisit("megacity | global city", "Paris"), null);
  assert.equal(categoryFromTags({ historic: "church", name: "Notre-Dame" })?.category, "historic");
  assert.equal(categoryFromTags({ man_made: "tower", name: "Tour" })?.category, "attraction");
});

test("the same landmark from two sources becomes one place", () => {
  const osm = spot("osm:way:1", "Tour Eiffel", osaka, "attraction", false, 0.01);
  const wiki = { ...spot("wd:Q243", "Eiffel Tower", osaka, "attraction", false, 0.011), provider: "wikidata" as const, sitelinks: 191, description: "Tower" };
  const louvreOsm = spot("osm:rel:2", "Musée du Louvre", osaka, "museum", true, 0.02);
  const louvreWiki = { ...spot("wd:Q19675", "Louvre Museum", osaka, "museum", true, 0.021), provider: "wikidata" as const, sitelinks: 169 };
  const station = spot("osm:node:3", "Louvre - Rivoli", osaka, "museum", true, 0.03);
  const merged = mergePlaces([osm, louvreOsm, station], [wiki, louvreWiki], osaka);
  assert.equal(merged.filter((item) => /eiffel/i.test(item.name)).length, 1);
  assert.equal(merged.filter((item) => /louvre/i.test(item.name)).length, 2);
  assert.equal(merged.find((item) => item.name === "Musée du Louvre")?.sitelinks, 169);
});

test("a failed discovery does not invent a stay-near itinerary", () => {
  const trip = buildTrip({
    ...baseInput,
    areas: [osaka],
    spots: [],
    nights: 5,
    discovery: { osm: "failed", wikidata: "failed", hotels: "failed", note: "Couldn't load places for Osaka. OpenStreetMap timed out." },
  });
  assert.equal(trip.stops.some((stop) => stop.name.startsWith("Stay near")), false);
  assert.equal(trip.stops.some((stop) => stop.day != null), false);
  assert.match(trip.placeNote, /Couldn't load places/);
  assert.equal(trip.coverage?.length, 0);
});

test("a city boundary is wider than a two-kilometre circle", () => {
  const paris = discoveryBox({ latitude: 48.8534951, longitude: 2.3483915, bbox: [48.8155755, 2.224122, 48.902156, 2.4697602] });
  assert.ok(paris.north - paris.south > 0.08);
  assert.ok(paris.east - paris.west > 0.2);
  assert.ok(paris.south < 48.86 && paris.north > 48.85);
  assert.ok(paris.west < 2.3 && paris.east > 2.4);
});

