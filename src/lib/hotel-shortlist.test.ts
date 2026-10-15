import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { disabledAffiliateSettings, readAffiliateConfig, resolveCommerceActions } from "./affiliate.ts";
import { compareRateOffers, liveHotelRates, type HotelRateOffer } from "./hotel-rates.ts";
import { shortlistHotels, type HotelCandidate, type HotelPreferences } from "./hotel-shortlist.ts";
import { buildTrip, rerollHotels, selectBase, setHotelPreferences, toggleKeptHotel, type DiscoveredPlace, type TravelArea } from "./travel-model.ts";

const paris: TravelArea = { name: "Paris", latitude: 48.8566, longitude: 2.3522 };

function place(id: string, name: string, category: DiscoveredPlace["category"], shift: number, hotel?: DiscoveredPlace["hotel"]): DiscoveredPlace {
  return {
    id,
    provider: "osm",
    providerId: id,
    name,
    category,
    address: "Paris",
    lat: paris.latitude + shift,
    lng: paris.longitude + shift * 0.4,
    indoor: true,
    area: "Paris",
    opening: "",
    hotel,
  };
}

const facts = (stars: string, room: string): DiscoveredPlace["hotel"] => ({
  airConditioning: "unknown",
  stars,
  internet: "",
  breakfast: "",
  parking: "",
  wheelchair: "",
  roomSize: room,
});

const parisPrefs: HotelPreferences = {
  preset: "luxury",
  budget: "250-400",
  currency: "SGD",
  quality: "4",
  qualityMust: true,
  burden: "minimise",
  room: "25",
  roomMust: true,
  ac: "individual",
  acMust: true,
  noise: "prefer",
  style: "luxury",
  location: "itinerary",
  bed: "any",
  breakfast: false,
  wheelchair: false,
  parking: false,
};

function parisTrip() {
  const spots = [
    place("a", "Hotel A", "stay", 0.001, facts("4", "28")),
    place("b", "Hotel B", "stay", 0.004, facts("5", "32")),
    place("c", "Hotel C", "stay", 0.008, facts("4", "26")),
    place("d", "Hotel D", "stay", 0.02, facts("4", "30")),
    place("e", "Hotel E", "stay", 0.028, facts("4", "")),
    place("f", "Hotel F", "stay", 0.036, facts("4", "27")),
    place("g", "Hotel G", "stay", 0.0004, facts("4", "18")),
    place("h", "Hotel H", "stay", 0.002, facts("2", "40")),
    place("s1", "Louvre", "museum", 0.0015),
    place("s2", "Orsay", "museum", 0.002),
    place("s3", "Notre Dame", "historic", 0.0025),
    place("s4", "Marais", "attraction", 0.0012),
    place("s5", "Montmartre", "viewpoint", 0.0018),
  ];
  return setHotelPreferences(buildTrip({
    destination: "Paris",
    areas: [paris],
    start: "2026-10-12",
    nights: 5,
    adults: 2,
    childAges: [6, 10],
    pace: "balanced",
    move: "walk",
    oneBase: true,
    interests: ["culture"],
    rejected: [],
    mustVisit: [],
    salt: 1,
    lockedDates: [],
    spots,
    weather: [],
  }), parisPrefs);
}

test("Paris shortlist explains three hotels and does not invent prices or individual air conditioning", () => {
  const trip = parisTrip();
  const cards = trip.hotels ?? [];
  assert.equal(cards.length, 3);
  assert.equal(cards.some((card) => /another mapped stay/i.test(card.role) || /another mapped stay/i.test(card.why)), false);
  assert.equal(cards.some((card) => card.name === "Hotel G" || card.name === "Hotel H"), false);
  for (const card of cards) {
    assert.ok(card.reasons.length >= 1);
    assert.equal(card.unverified.includes("Individual room control"), true);
    assert.ok(card.unverified.some((item) => item.includes("250")));
    assert.equal(card.unverified.includes("Quiet rooms"), true);
    assert.equal(/cheapest|nightly|totalPrice|from S\$/i.test(JSON.stringify(card)), false);
  }
  assert.equal(cards[0]?.role === "Best overall" || cards[0]?.role === "Kept", true);
  assert.equal(liveHotelRates(), null);
});

test("keep then reroll holds the locked hotels and does not cycle the ones just removed", () => {
  let trip = parisTrip();
  const initial = (trip.hotels ?? []).map((hotel) => hotel.name);
  assert.deepEqual(initial, ["Hotel B", "Hotel A", "Hotel C"]);
  const keptFirst = trip.hotels?.[0];
  assert.ok(keptFirst);
  trip = toggleKeptHotel(trip, keptFirst.stopId);
  trip = rerollHotels(trip);
  assert.deepEqual((trip.hotels ?? []).map((hotel) => hotel.name), ["Hotel B", "Hotel D", "Hotel E"]);
  assert.equal(trip.stops.length > 0, true);
  const keptE = trip.hotels?.find((hotel) => hotel.name === "Hotel E");
  assert.ok(keptE);
  trip = toggleKeptHotel(trip, keptE.stopId);
  trip = rerollHotels(trip);
  assert.deepEqual((trip.hotels ?? []).map((hotel) => hotel.name), ["Hotel B", "Hotel F", "Hotel E"]);
  assert.equal(trip.hotelPreferences?.budget, "250-400");
  assert.equal(trip.hotelMemory?.kept.includes(keptFirst.stopId), true);
  assert.equal(trip.hotelMemory?.kept.includes(keptE.stopId), true);
});

test("changing hotel criteria does not rebuild the itinerary", () => {
  const trip = parisTrip();
  const next = setHotelPreferences(trip, { ...parisPrefs, budget: "under-150", quality: "5", qualityMust: true });
  assert.equal(next.stops, trip.stops);
  assert.equal(next.days, trip.days);
  assert.equal(next.legs, trip.legs);
  assert.equal(next.bookings, trip.bookings);
  assert.equal(next.hotelPreferences?.budget, "under-150");
  assert.equal(next.hotels?.some((hotel) => hotel.name === "Hotel A"), false);
  assert.equal(next.hotels?.some((hotel) => hotel.name === "Hotel B"), true);
});

test("selecting a hotel moves the base and leaves the sights in place", () => {
  const trip = parisTrip();
  const sight = trip.stops.find((stop) => stop.day != null && stop.category !== "stay");
  const pick = trip.hotels?.find((hotel) => hotel.name !== trip.stops.find((stop) => stop.category === "stay" && stop.day != null)?.name);
  assert.ok(sight && pick);
  const next = selectBase(trip, pick.stopId);
  assert.equal(next.stops.find((stop) => stop.id === sight.id)?.lat, sight.lat);
  assert.equal(next.stops.find((stop) => stop.id === sight.id)?.lng, sight.lng);
  assert.equal(next.days.length, trip.days.length);
  assert.equal(next.stops.find((stop) => stop.category === "stay" && stop.day === sight.day)?.name, pick.name);
  assert.equal(next.hotels?.some((hotel) => hotel.name === "Hotel A"), true);
});

test("hotel ranking does not read affiliate commission", () => {
  const source = readFileSync(new URL("./hotel-shortlist.ts", import.meta.url), "utf8");
  assert.equal(source.split("\n").some((line) => line.trimStart().startsWith("import ") && /affiliate|hotel-rates|gemini/.test(line)), false);
  const hotels: HotelCandidate[] = [
    { id: "near", name: "Near Hotel", lat: 48.859, lng: 2.295, stars: 4, roomSqm: 28, air: "unknown", breakfast: "unknown", wheelchair: "unknown", parking: "unknown", kind: "hotel" },
    { id: "mid", name: "Mid Hotel", lat: 48.87, lng: 2.34, stars: 4, roomSqm: 30, air: "unknown", breakfast: "unknown", wheelchair: "unknown", parking: "unknown", kind: "hotel" },
    { id: "far", name: "Far Hotel", lat: 48.9, lng: 2.42, stars: 5, roomSqm: 40, air: "yes", breakfast: "yes", wheelchair: "yes", parking: "yes", kind: "hotel" },
  ];
  const stops = [{ day: 0, category: "museum", lat: 48.8584, lng: 2.2945 }];
  const off = shortlistHotels(hotels, stops, parisPrefs).map((card) => card.name);
  const paid = readAffiliateConfig({
    AFFILIATE_BOOKING_ENABLED: "on",
    AFFILIATE_BOOKING_ID: "partner",
    AFFILIATE_BOOKING_TEMPLATE: "https://www.booking.com/searchresults.html?aid={id}&ss={query}",
    AFFILIATE_BOOKING_COMMISSION: "80",
  });
  assert.equal(JSON.stringify(paid).includes("80"), false);
  const on = shortlistHotels(hotels, stops, parisPrefs).map((card) => card.name);
  assert.deepEqual(off, on);
  assert.deepEqual(off, ["Near Hotel", "Mid Hotel", "Far Hotel"]);
  const plain = resolveCommerceActions({ name: "Near Hotel", city: "Paris", category: "HOTEL" }, { mode: "travel" }, disabledAffiliateSettings());
  const linked = resolveCommerceActions({ name: "Near Hotel", city: "Paris", category: "HOTEL" }, { mode: "travel" }, paid);
  assert.deepEqual(off, shortlistHotels(hotels, stops, parisPrefs).map((card) => card.name));
  assert.equal(plain.some((action) => action.provider === "booking.com"), true);
  assert.notEqual(plain.find((action) => action.provider === "booking.com")?.url, linked.find((action) => action.provider === "booking.com")?.url);
});

test("live rates stay empty, and mocked offers are comparable only when the product matches", () => {
  assert.equal(liveHotelRates(), null);
  const base: HotelRateOffer = {
    provider: "booking.com",
    providerHotelId: "hotel-a",
    checkIn: "2026-10-12",
    checkOut: "2026-10-17",
    adults: 2,
    childAges: [6, 10],
    rooms: 1,
    roomName: "Classic double",
    boardBasis: "room-only",
    refundable: false,
    cancellationSummary: "Non-refundable",
    nightlyPrice: 180,
    totalPrice: 900,
    taxesIncluded: true,
    currency: "SGD",
    fetchedAt: "2026-10-01T00:00:00Z",
    bookingUrl: "https://example.test/book",
    affiliate: false,
    dataSource: "test-fixture",
  };
  const same = { ...base, provider: "trip.com", nightlyPrice: 170, totalPrice: 850 };
  assert.equal(compareRateOffers([base, same]).status, "comparable");
  assert.equal(compareRateOffers([base, same]).cheapestProvider, "trip.com");
  const partial = compareRateOffers([base, { ...same, boardBasis: "breakfast", refundable: true }]);
  assert.equal(partial.status, "partial");
  assert.equal(partial.cheapestProvider, "");
  const unlike = compareRateOffers([base, { ...same, checkOut: "2026-10-18" }]);
  assert.equal(unlike.status, "not-comparable");
  assert.equal(unlike.cheapestProvider, "");
});
