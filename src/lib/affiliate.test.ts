import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  AFFILIATE_DISCLOSURE,
  affiliateClicks,
  authorisedHotelRates,
  disabledAffiliateSettings,
  readAffiliateConfig,
  recordAffiliateClick,
  resetAffiliateClicks,
  resolveCommerceActions,
} from "./affiliate.ts";
import { rankPlaces, type RankContext, type StepSpec } from "./dating-plan.ts";
import type { DatePlace } from "./dating.ts";
import { sortMakanHits, type Hit } from "./coord.ts";
import { placeActions } from "./external-actions.ts";
import { rankStaysForPlan } from "./travel-model.ts";

const BOOKING_TEMPLATE = "https://www.booking.com/searchresults.html?ss={query}&aid={id}&checkin={checkin}&checkout={checkout}";
const AGODA_TEMPLATE = "https://www.agoda.com/partners/partnersearch.aspx?cid={id}&q={query}";
const KLOOK_TEMPLATE = "https://www.klook.com/search/?query={query}&aid={id}";

function bookingOn(commission: string) {
  return readAffiliateConfig({
    AFFILIATE_BOOKING_ENABLED: "1",
    AFFILIATE_BOOKING_ID: "partner",
    AFFILIATE_BOOKING_TEMPLATE: BOOKING_TEMPLATE,
    AFFILIATE_BOOKING_COMMISSION: commission,
  });
}

test("unconfigured programmes stay plain or hidden", () => {
  const settings = readAffiliateConfig({});
  assert.equal(settings.booking.enabled, false);
  assert.equal(settings.agoda.enabled, false);
  assert.equal(settings.klook.enabled, false);
  const actions = resolveCommerceActions(
    { id: "hotel-1", name: "Chengdu Shangri-La", city: "Chengdu", category: "HOTEL" },
    { mode: "travel", destination: "Chengdu", checkIn: "2026-11-01", checkOut: "2026-11-06", adults: 2 },
    settings,
  );
  const providers = actions.map((action) => action.provider);
  assert.deepEqual(providers, ["trip.com", "agoda", "booking.com"]);
  assert.equal(actions.every((action) => action.source === "public-search"), true);
  assert.equal(actions.every((action) => action.affiliateEligible === false), true);
  assert.equal(actions.some((action) => action.disclosure === AFFILIATE_DISCLOSURE), false);
  for (const action of actions) {
    assert.doesNotMatch(action.url, /aid=|affiliate|cid=/i);
    assert.doesNotMatch(action.label, /cheapest|S\$|USD|€|£/i);
    assert.equal("amount" in action, false);
  }
  const booking = actions.find((action) => action.provider === "booking.com");
  const agodaLink = actions.find((action) => action.provider === "agoda");
  assert.match(booking?.url ?? "", /checkin=2026-11-01/);
  assert.match(booking?.url ?? "", /group_adults=2/);
  assert.match(agodaLink?.url ?? "", /checkIn=2026-11-01/);
  assert.match(agodaLink?.url ?? "", /adults=2/);
  assert.equal(authorisedHotelRates(), null);
});

test("a configured partner id is used, and a missing template is not invented", () => {
  const partial = readAffiliateConfig({ AFFILIATE_AGODA_ENABLED: "true", AFFILIATE_AGODA_ID: "999" });
  assert.equal(partial.agoda.enabled, false);
  const bad = readAffiliateConfig({
    AFFILIATE_AGODA_ENABLED: "1",
    AFFILIATE_AGODA_ID: "999",
    AFFILIATE_AGODA_TEMPLATE: "https://www.agoda.com/search?q={query}",
  });
  assert.equal(bad.agoda.enabled, false);
  const ready = readAffiliateConfig({
    AFFILIATE_AGODA_ENABLED: "1",
    AFFILIATE_AGODA_ID: "999",
    AFFILIATE_AGODA_TEMPLATE: AGODA_TEMPLATE,
    AFFILIATE_BOOKING_ENABLED: "1",
    AFFILIATE_BOOKING_ID: "bad id",
    AFFILIATE_BOOKING_TEMPLATE: BOOKING_TEMPLATE,
  });
  assert.equal(ready.agoda.enabled, true);
  assert.equal(ready.booking.enabled, false);
  const actions = resolveCommerceActions(
    { name: "Hotel Royal", city: "Paris", category: "HOTEL" },
    { mode: "travel" },
    ready,
  );
  const agoda = actions.find((action) => action.provider === "agoda");
  assert.equal(agoda?.source, "affiliate");
  assert.match(agoda?.url ?? "", /cid=999/);
  assert.equal(agoda?.disclosure, AFFILIATE_DISCLOSURE);
  assert.equal(actions.some((action) => action.label.includes("S$")), false);
});

test("commission is not stored and cannot change hotel order", () => {
  const low = bookingOn("5");
  const high = bookingOn("80");
  assert.equal(JSON.stringify(low).includes("5"), false);
  assert.equal(JSON.stringify(high).includes("80"), false);
  assert.deepEqual(low, high);
  const stays = [
    { name: "Far Hotel", lat: 48.9, lng: 2.42, category: "stay" as const },
    { name: "Near Hotel", lat: 48.859, lng: 2.295, category: "stay" as const },
    { name: "Mid Hotel", lat: 48.87, lng: 2.34, category: "stay" as const },
  ];
  const targets = [{ lat: 48.8584, lng: 2.2945 }];
  const off = rankStaysForPlan(stays, targets).map((stay) => stay.name);
  const on = rankStaysForPlan(stays, targets).map((stay) => stay.name);
  assert.deepEqual(off, ["Near Hotel", "Mid Hotel", "Far Hotel"]);
  assert.deepEqual(on, off);
  const links = (settings: ReturnType<typeof bookingOn>) => rankStaysForPlan(stays, targets).map((stay) => ({
    name: stay.name,
    providers: resolveCommerceActions({ name: stay.name, city: "Paris", category: "HOTEL" }, { mode: "travel" }, settings).map((action) => action.provider),
  }));
  const plain = links(disabledAffiliateSettings());
  const paid = links(high);
  assert.deepEqual(plain.map((row) => row.name), paid.map((row) => row.name));
  assert.equal(plain[0]?.providers.includes("booking.com"), true);
  assert.notEqual(
    resolveCommerceActions({ name: "Near Hotel", city: "Paris", category: "HOTEL" }, { mode: "travel" }, disabledAffiliateSettings()).find((action) => action.provider === "booking.com")?.url,
    resolveCommerceActions({ name: "Near Hotel", city: "Paris", category: "HOTEL" }, { mode: "travel", checkIn: "2026-12-01", checkOut: "2026-12-03" }, high).find((action) => action.provider === "booking.com")?.url,
  );
});

test("date, family-style scores, and makan order ignore affiliate configuration", () => {
  const places: DatePlace[] = [
    { id: "far", name: "Far Climb", address: "Far", lat: 1.35, lng: 103.9, role: "activity", setting: "indoor", approxSgd: 40, cuisine: "", vibes: [], diets: [], alcohol: false, opening: "", source: "directory", blurb: "A long blurb for the far place that is still just a place." },
    { id: "near", name: "Near Gallery", address: "Near", lat: 1.301, lng: 103.841, role: "activity", setting: "indoor", approxSgd: 20, cuisine: "art", vibes: [], diets: [], alcohol: false, opening: "", source: "directory", blurb: "A long blurb for the near place that is still just a place." },
  ];
  const step: StepSpec = { role: "activity", minutes: 90, slot: "Evening", food: false, lean: "look", targetOffset: 0 };
  const ctx: RankContext = {
    origin: { lat: 1.3, lng: 103.84 },
    here: { lat: 1.3, lng: 103.84 },
    first: false,
    vibes: [],
    dateType: "first",
    pressure: "balanced",
    crowd: "ok",
    formality: "casual",
    budget: 80,
    seen: [],
    usedCuisines: [],
    usedNames: [],
    seed: "trust",
    minute: 18 * 60,
    date: "2026-10-10",
  };
  const ranked = rankPlaces(places, step, ctx, []).map((place) => place.id);
  const again = rankPlaces(places, step, ctx, []).map((place) => place.id);
  assert.deepEqual(ranked, again);
  assert.equal(ranked[0], "near");
  const hits: Hit[] = [
    { id: "a", name: "Far Supper", cuisine: "", address: "", area: "", lat: 0, lng: 0, minutes: 20, meters: 1600, price: 2, approxSgd: 18, dietary: [], why: "", source: "directory", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Far" },
    { id: "b", name: "Near Supper", cuisine: "", address: "", area: "", lat: 0, lng: 0, minutes: 6, meters: 400, price: 2, approxSgd: 18, dietary: [], why: "", source: "directory", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Near" },
  ];
  const makan = sortMakanHits(hits, "match").map((hit) => hit.id);
  assert.deepEqual(makan, sortMakanHits(hits, "match").map((hit) => hit.id));
  assert.equal(makan[0], "b");
  const klook = readAffiliateConfig({ AFFILIATE_KLOOK_ENABLED: "1", AFFILIATE_KLOOK_ID: "k1", AFFILIATE_KLOOK_TEMPLATE: KLOOK_TEMPLATE });
  const withLinks = ranked.map((id) => resolveCommerceActions({ id, name: id, city: "Singapore", category: "ACTIVITY" }, { mode: "dating" }, klook).map((action) => action.provider));
  assert.deepEqual(ranked, ["near", "far"]);
  assert.deepEqual(withLinks, [["klook"], ["klook"]]);
});

test("ranking modules cannot see affiliate settings", () => {
  const files = [
    "src/lib/travel-model.ts",
    "src/lib/dating-plan.ts",
    "src/lib/coord.ts",
    "src/lib/family.ts",
    "src/lib/family.server.ts",
  ];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /resolveCommerceActions|readAffiliateConfig|AFFILIATE_|commissionRate|expectedRevenue|providerPayout/);
  }
});

test("clicks record the handoff only, and the app still plans with every programme off", () => {
  resetAffiliateClicks();
  recordAffiliateClick({ source: "public-search", provider: "booking.com", placeId: "h1" }, "travel", "HOTEL");
  assert.equal(affiliateClicks().length, 0);
  recordAffiliateClick({ source: "affiliate", provider: "booking.com", placeId: "h1" }, "travel", "HOTEL");
  const click = affiliateClicks()[0];
  assert.equal(click?.event, "affiliate_click");
  assert.equal(click?.itemId, "h1");
  assert.equal(click?.mode, "travel");
  assert.doesNotMatch(JSON.stringify(click), /birthday|oracle|profile|family|commission/i);
  const actions = placeActions({
    mode: "travel",
    kind: "hotel",
    countryCode: "CN",
    navigate: false,
    place: { name: "Chengdu Shangri-La", city: "Chengdu", countryCode: "CN", lat: 30.66, lng: 104.06, website: "https://www.shangri-la.com/chengdu/shangrila/" },
  }, "other", disabledAffiliateSettings());
  assert.equal(actions.some((action) => action.source === "affiliate"), false);
  assert.ok(actions.some((action) => action.type === "OFFICIAL_WEBSITE"));
  assert.ok(actions.some((action) => action.provider === "trip.com"));
  const agoda = actions.find((action) => action.provider === "agoda");
  assert.equal(agoda?.source, "public-search");
  assert.equal(agoda?.affiliateEligible, false);
  assert.match(agoda?.url ?? "", /agoda\.com\/search/);
  const restaurant = placeActions({
    mode: "makan",
    kind: "restaurant",
    countryCode: "SG",
    place: { name: "Newton Food Centre", city: "Singapore", countryCode: "SG", lat: 1.31, lng: 103.84 },
  }, "other", disabledAffiliateSettings());
  assert.equal(restaurant.some((action) => action.type === "RESERVE_RESTAURANT" || action.type === "ORDER_FOOD"), false);
});
