import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { resolveCommerceActions } from "./affiliate.ts";
import { distanceMeters } from "./coord.ts";
import { applyBookedHotel, chooseHotelHit, hotelOptimizerEnabled, recommendStayAreas } from "./hotel-bases.ts";
import { DEFAULT_HOTEL_PREFERENCES, emptyHotelMemory, shortlistHotels, type HotelCandidate } from "./hotel-shortlist.ts";
import { buildTrip, estimateMinutes, type DiscoveredPlace, type TravelArea } from "./travel-model.ts";

function spot(area: TravelArea, id: string, name: string, lat: number, lng: number, category: DiscoveredPlace["category"] = "attraction"): DiscoveredPlace {
  return {
    id,
    provider: "osm",
    providerId: id,
    name,
    category,
    address: area.name,
    lat,
    lng,
    indoor: false,
    area: area.name,
    opening: "",
  };
}

function trip(destination: string, areas: TravelArea[], spots: DiscoveredPlace[], extra: Partial<Parameters<typeof buildTrip>[0]> = {}) {
  return buildTrip({
    destination,
    areas,
    start: "2026-10-12",
    nights: 5,
    adults: 2,
    childAges: [],
    pace: "balanced",
    move: "transit",
    oneBase: true,
    interests: ["culture"],
    rejected: [],
    mustVisit: [],
    salt: 1,
    lockedDates: [],
    spots,
    weather: [],
    foodPlanning: "minimal",
    ...extra,
  });
}

test("318 minutes is a straight-line walk, and a far Travelodge is not best overall", () => {
  assert.equal(estimateMinutes("walk", 23850), 318);
  assert.equal(estimateMinutes("walk", 31050), 414);
  const hotel: HotelCandidate = {
    id: "travelodge",
    name: "Travelodge",
    lat: 51.47,
    lng: -0.45,
    stars: null,
    roomSqm: null,
    air: "unknown",
    breakfast: "unknown",
    wheelchair: "unknown",
    parking: "unknown",
    kind: "hotel",
  };
  const days = [
    { day: 0, category: "attraction", lat: 51.4995, lng: -0.1248 },
    { day: 1, category: "museum", lat: 51.5194, lng: -0.1269 },
    { day: 2, category: "attraction", lat: 51.5055, lng: -0.115 },
    { day: 3, category: "attraction", lat: 51.4826, lng: -0.0077 },
  ];
  const meters = days.map((day) => distanceMeters(hotel.lat, hotel.lng, day.lat, day.lng));
  assert.ok(Math.min(...meters) > 15000);
  const card = shortlistHotels([hotel], days, DEFAULT_HOTEL_PREFERENCES, emptyHotelMemory(), "walk")[0];
  assert.equal(card?.role, "Far from these days");
  assert.equal(card?.closeDays, 0);
  assert.ok((card?.averageMin ?? 0) > 90);
  const london: TravelArea = { name: "London", latitude: 51.5074, longitude: -0.1278 };
  const planned = trip("London", [london], [
    spot(london, "tl", "Travelodge", hotel.lat, hotel.lng, "stay"),
    ...days.map((day, index) => spot(london, `s${index}`, `Sight ${index}`, day.lat, day.lng)),
  ]);
  const areas = recommendStayAreas(planned);
  assert.ok(areas.length >= 1 && areas.length <= 3);
  assert.equal(areas.some((area) => area.role === "Best overall base" && area.closeDays === 0), false);
  assert.equal(areas.some((area) => /travelodge/i.test(area.name)), false);
});

test("the nearer Travelodge branch is kept when the name collides", () => {
  const hit = chooseHotelHit([
    { name: "Travelodge", lat: 51.48, lng: -0.45, address: "Bath Road, Heathrow", provider: "osm", providerId: "osm:node:far" },
    { name: "Travelodge", lat: 51.513, lng: -0.12, address: "City of London", provider: "osm", providerId: "osm:node:near" },
  ], [{ lat: 51.5074, lng: -0.1278 }], "Travelodge");
  assert.equal(hit?.providerId, "osm:node:near");
  assert.equal(chooseHotelHit([
    { name: "Travelodge", lat: -0.1278, lng: 51.5074, address: "Swapped", provider: "osm", providerId: "osm:node:swap" },
  ], [{ lat: 51.5074, lng: -0.1278 }], "Travelodge"), null);
  assert.equal(chooseHotelHit([], [{ lat: 51.5, lng: -0.12 }], "Travelodge"), null);
});

test("Tokyo recommends a west-side base, not an exact hotel", () => {
  const tokyo: TravelArea = { name: "Tokyo", latitude: 35.69, longitude: 139.7 };
  const planned = trip("Tokyo", [tokyo], [
    spot(tokyo, "meiji", "Meiji Jingu", 35.6764, 139.6993),
    spot(tokyo, "gyoen", "Shinjuku Gyoen", 35.6852, 139.71),
    spot(tokyo, "shibuya", "Shibuya Sky", 35.658, 139.7022),
    spot(tokyo, "senso", "Senso-ji", 35.7148, 139.7967),
  ]);
  const areas = recommendStayAreas(planned);
  assert.ok(areas.length >= 1 && areas.length <= 3);
  assert.match(areas[0]?.name ?? "", /Shinjuku|Shibuya|Ginza|Asakusa|Tokyo Station|Meiji|Gyoen/);
  assert.equal(areas.some((area) => area.role === "Best overall base" && area.closeDays === 0), false);
  assert.equal(/hotel/i.test(areas.map((area) => area.name).join(" ")), false);
});

test("Paris base is a neighbourhood, not the whole city and not Versailles", () => {
  const paris: TravelArea = { name: "Paris", latitude: 48.8566, longitude: 2.3522 };
  const planned = trip("Paris", [paris], [
    spot(paris, "louvre", "Louvre Museum", 48.8606, 2.3376, "museum"),
    spot(paris, "orsay", "Musée d'Orsay", 48.86, 2.3266, "museum"),
    spot(paris, "dame", "Notre-Dame", 48.853, 2.3499, "historic"),
    spot(paris, "marais", "Place des Vosges", 48.8554, 2.3656),
    spot(paris, "versailles", "Palace of Versailles", 48.8049, 2.1204, "historic"),
  ]);
  const areas = recommendStayAreas(planned);
  assert.ok(areas.length >= 1 && areas.length <= 3);
  assert.notEqual(areas[0]?.name, "Paris");
  assert.match(areas[0]?.name ?? "", /Louvre|Marais|Saint-Germain|Latin Quarter|Champ de Mars|Notre-Dame|Orsay|Vosges/);
  assert.equal(areas.some((area) => /Versailles/i.test(area.name)), false);
  assert.equal(areas.some((area) => area.role === "Best overall base" && area.averageMin >= 120), false);
});

test("Iceland uses overnight towns, not one hotel for the country", () => {
  const reykjavik: TravelArea = { name: "Reykjavík", latitude: 64.1466, longitude: -21.9426 };
  const vik: TravelArea = { name: "Vík", latitude: 63.4186, longitude: -19.006 };
  const planned = trip("Iceland", [reykjavik, vik], [
    spot(reykjavik, "hall", "Hallgrímskirkja", 64.1419, -21.9266, "historic"),
    spot(reykjavik, "sun", "Sun Voyager", 64.1474, -21.922),
    spot(vik, "reynis", "Reynisfjara", 63.404, -19.07),
    spot(vik, "church", "Vík church", 63.419, -19.008, "historic"),
  ], {
    nights: 6,
    oneBase: false,
    move: "drive",
    transfers: [[0, 180], [180, 0]],
  });
  const areas = recommendStayAreas(planned);
  assert.equal(areas.length >= 2, true);
  assert.ok(areas.every((area) => area.role === "Overnight base"));
  assert.match(areas.map((area) => area.name).join(" "), /Reykjavík/);
  assert.match(areas.map((area) => area.name).join(" "), /Vík/);
  assert.equal(areas.some((area) => /hotel/i.test(area.name)), false);
});

test("a booked hotel keeps the sights and moves only the base", () => {
  const tokyo: TravelArea = { name: "Tokyo", latitude: 35.69, longitude: 139.7 };
  const planned = trip("Tokyo", [tokyo], [
    spot(tokyo, "meiji", "Meiji Jingu", 35.6764, 139.6993),
    spot(tokyo, "gyoen", "Shinjuku Gyoen", 35.6852, 139.71),
  ]);
  const before = planned.stops.filter((stop) => stop.category !== "stay").map((stop) => `${stop.name}:${stop.day}`);
  const next = applyBookedHotel(planned, {
    name: "Mandarin Oriental Tokyo",
    lat: 35.6847,
    lng: 139.773,
    address: "2-1-1 Nihonbashi Muromachi, Tokyo",
    provider: "osm",
    providerId: "osm:node:mandarin",
  });
  const after = next.stops.filter((stop) => stop.category !== "stay").map((stop) => `${stop.name}:${stop.day}`);
  assert.deepEqual(after, before);
  const stay = next.stops.find((stop) => stop.category === "stay" && stop.day != null);
  assert.equal(stay?.name, "Mandarin Oriental Tokyo");
  assert.equal(stay?.lat, 35.6847);
  assert.equal(stay?.lng, 139.773);
  assert.equal(stay?.providerId, "osm:node:mandarin");
  assert.equal(stay?.bookingStatus, "booked");
  assert.equal(applyBookedHotel(planned, { name: "Nameless", lat: 35.6, lng: 139.7, address: "", provider: "osm", providerId: "" }), planned);
});

test("hotel links are external searches and do not invent a price", () => {
  const actions = resolveCommerceActions({
    id: "base-shinjuku",
    name: "Shinjuku",
    city: "Tokyo",
    country: "JP",
    lat: 35.6938,
    lng: 139.7034,
    category: "HOTEL",
  }, {
    mode: "travel",
    destination: "Tokyo",
    checkIn: "2026-10-12",
    checkOut: "2026-10-17",
    adults: 2,
    childAges: [],
  });
  assert.ok(actions.some((action) => action.url.includes("trip.com")));
  assert.ok(actions.some((action) => action.url.includes("agoda.com") && action.url.includes("checkIn=2026-10-12")));
  assert.ok(actions.some((action) => action.url.includes("booking.com") && action.url.includes("checkin=2026-10-12")));
  assert.equal(actions.some((action) => /live price|\$|¥|€/.test(action.label)), false);
});

test("base ranking cannot see affiliate commission", () => {
  const source = readFileSync(new URL("./hotel-bases.ts", import.meta.url), "utf8");
  assert.equal(/commission|affiliate|price/i.test(source), false);
  assert.equal(hotelOptimizerEnabled(), false);
});
