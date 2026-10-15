import assert from "node:assert/strict";
import test from "node:test";
import { explainLeg } from "./travel-model.ts";
import {
  automaticNav,
  handoffChoices,
  inferCountry,
  navigationHref,
  resolveRoutingProvider,
  wgsToGcj,
} from "./travel-routing.ts";

const paris = { lat: 48.8606, lng: 2.3376, name: "Louvre" };
const eiffel = { lat: 48.8584, lng: 2.2945, name: "Eiffel Tower" };
const zoo = { lat: 1.4043, lng: 103.793, name: "Singapore Zoo" };
const bay = { lat: 1.2834, lng: 103.8607, name: "Marina Bay Sands" };
const panda = { lat: 30.733, lng: 104.145, name: "Panda Base" };
const centre = { lat: 30.66, lng: 104.063, name: "Centre" };
const palace = { lat: 37.5796, lng: 126.977, name: "Gyeongbokgung" };
const hongdae = { lat: 37.5563, lng: 126.9236, name: "Hongdae" };

test("routing capabilities stay honest about transit", () => {
  for (const country of ["FR", "US", "SG", "CN", "KR", "ZZ"]) {
    const row = resolveRoutingProvider({ country });
    assert.equal(row.drive, true);
    assert.equal(row.walk, true);
    assert.equal(row.cycle, false);
    assert.equal(row.transit, "unavailable");
    assert.equal(row.planning, "open-street");
  }
});

test("navigation links are public URLs with no API key", () => {
  const google = navigationHref("google", paris, eiffel, "walk");
  const apple = navigationHref("apple", paris, eiffel, "transit");
  const amap = navigationHref("amap", centre, panda, "drive");
  const kakao = navigationHref("kakao", palace, hongdae, "transit");
  const naver = navigationHref("naver", palace, hongdae, "walk");
  const abroad = navigationHref("amap", bay, zoo, "drive");
  for (const href of [google, apple, amap, kakao, naver, abroad]) {
    assert.equal(href.includes("key="), false);
    assert.equal(/googleapis\.com|routes\.googleapis|mapbox/i.test(href), false);
  }
  assert.match(google, /^https:\/\/www\.google\.com\/maps\/dir\//);
  assert.match(google, /travelmode=walking/);
  assert.match(apple, /^https:\/\/maps\.apple\.com\//);
  assert.match(amap, /coordinate=gaode/);
  assert.match(abroad, /coordinate=gps/);
  assert.match(kakao, /^https:\/\/map\.kakao\.com\/link\/to\//);
  assert.match(naver, /^https:\/\/map\.naver\.com\/p\/directions\//);
});

test("China coordinates are shifted for Amap and Europe is not", () => {
  const shifted = wgsToGcj(centre.lat, centre.lng);
  assert.notEqual(shifted.lat.toFixed(4), centre.lat.toFixed(4));
  const same = wgsToGcj(paris.lat, paris.lng);
  assert.equal(same.lat, paris.lat);
  const korea = wgsToGcj(palace.lat, palace.lng);
  assert.equal(korea.lat, palace.lat);
  const island = wgsToGcj(bay.lat, bay.lng);
  assert.equal(island.lat, bay.lat);
});

test("automatic navigation follows country, then device", () => {
  assert.equal(automaticNav("CN", "ios"), "amap");
  assert.equal(automaticNav("KR", "android"), "kakao");
  assert.equal(automaticNav("SG", "ios"), "apple");
  assert.equal(automaticNav("US", "android"), "google");
  assert.equal(automaticNav("FR", "other"), "google");
  assert.equal(handoffChoices("KR")[0], "kakao");
  assert.equal(inferCountry(palace.lat, palace.lng, ""), "KR");
  assert.equal(inferCountry(centre.lat, centre.lng, "SG"), "SG");
});

test("a road time is never presented as transit", () => {
  const leg = explainLeg({
    fromId: "a",
    toId: "b",
    day: 0,
    mode: "transit",
    minutes: 18,
    meters: 4000,
    source: "osrm",
    label: "",
  }, "transit", ["luxury"], false);
  const transit = leg.alternatives?.find((item) => item.mode === "transit");
  assert.equal(transit?.minutes, null);
  assert.equal(transit?.source, "unavailable");
  assert.match(transit?.label ?? "", /unavailable/i);
  assert.equal(/\d/.test(transit?.label ?? ""), false);
  assert.equal(leg.shown === "transit", false);
  assert.equal(/by road/i.test(leg.label), false);
  assert.equal(/young child/i.test(leg.recommendationReason ?? ""), false);
  assert.match(leg.recommendationReason ?? "", /Cuts walking|min/);
  const walk = explainLeg({
    fromId: "a",
    toId: "b",
    day: 0,
    mode: "transit",
    minutes: null,
    meters: 500,
    source: "none",
    label: "",
  }, "transit", ["backpacking"], false);
  assert.equal(walk.shown, "walk");
});
