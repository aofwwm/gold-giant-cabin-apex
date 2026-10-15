import assert from "node:assert/strict";
import test from "node:test";
import { buildGoogleMapsPlaceQuery, externalPlaceLinks, verifiedWebsite } from "./travel-links.ts";

function queryOf(href: string): string {
  return new URL(href).searchParams.get("query") ?? "";
}

function noPaidGoogle(href: string): void {
  assert.equal(href.includes("key="), false);
  assert.equal(/googleapis\.com|places\.googleapis|maps\.googleapis/i.test(href), false);
  assert.equal(href.startsWith("https://www.google.com/maps/search/"), true);
  assert.equal(new URL(href).searchParams.get("api"), "1");
}

test("Tokugawa Art Museum opens a constrained Google Maps search", () => {
  const links = externalPlaceLinks({
    name: "Tokugawa Art Museum",
    nameLocal: "徳川美術館",
    address: "1017 Tokugawacho, Higashi Ward, Nagoya",
    city: "Nagoya",
    countryCode: "JP",
    lat: 35.184,
    lng: 136.933,
    website: "https://www.tokugawa-art-museum.jp/",
  });
  noPaidGoogle(links.googleReviews);
  const query = queryOf(links.googleReviews);
  assert.match(query, /Tokugawa Art Museum/);
  assert.match(query, /徳川美術館/);
  assert.match(query, /Nagoya/);
  assert.match(query, /Japan/);
  assert.equal(links.googleMapsSearch, links.googleReviews);
  assert.equal(links.officialWebsite, "https://www.tokugawa-art-museum.jp/");
  assert.equal(links.localPlace, null);
  assert.match(links.navigation.googleMaps, /\/maps\/dir\//);
  assert.notEqual(links.navigation.googleMaps, links.googleReviews);
});

test("a Japanese restaurant query keeps the local name and the city", () => {
  const sushi = buildGoogleMapsPlaceQuery({
    name: "丸八寿司",
    displayName: "Maruhachi Sushi",
    nameEnglish: "Maruhachi Sushi",
    city: "Nagoya",
    countryCode: "JP",
  });
  assert.match(sushi, /Maruhachi Sushi/);
  assert.match(sushi, /丸八寿司/);
  assert.match(sushi, /Nagoya/);
  assert.match(sushi, /Japan/);
  assert.equal(sushi.split(" ").filter((part) => part === "丸八寿司").length, 1);
  const hotpot = buildGoogleMapsPlaceQuery({ name: "BSD鍋", city: "Nagoya", region: "Aichi", countryCode: "JP" });
  assert.match(hotpot, /BSD鍋/);
  assert.match(hotpot, /Nagoya/);
  assert.match(hotpot, /Aichi/);
  assert.match(hotpot, /Japan/);
  assert.notEqual(hotpot, "BSD鍋");
});

test("an ambiguous cafe is not searched as a bare world query", () => {
  assert.equal(buildGoogleMapsPlaceQuery({ name: "Central Cafe" }), "");
  const query = buildGoogleMapsPlaceQuery({
    name: "Central Cafe",
    address: "12 High Street",
    city: "London",
    countryCode: "GB",
  });
  assert.match(query, /Central Cafe/);
  assert.match(query, /12 High Street/);
  assert.match(query, /London/);
  assert.match(query, /United Kingdom/);
});

test("a missing or unverified website hides the action", () => {
  assert.equal(verifiedWebsite(""), "");
  assert.equal(verifiedWebsite("not a url"), "");
  assert.equal(verifiedWebsite("https://www.facebook.com/cafe"), "");
  assert.equal(verifiedWebsite("https://maps.google.com/?q=cafe"), "");
  assert.equal(externalPlaceLinks({ name: "丸八寿司", city: "Nagoya", countryCode: "JP" }).officialWebsite, "");
});

test("Google Maps web is the fallback and a known place id is optional", () => {
  const plain = externalPlaceLinks({ name: "Eiffel Tower", city: "Paris", countryCode: "FR", lat: 48.8584, lng: 2.2945 });
  noPaidGoogle(plain.googleReviews);
  assert.equal(new URL(plain.googleReviews).searchParams.get("query_place_id"), null);
  const known = externalPlaceLinks({
    name: "Eiffel Tower",
    city: "Paris",
    countryCode: "FR",
    googlePlaceId: "ChIJLU7G7yFu5kcR4PcOOO6p3I0",
  });
  assert.equal(new URL(known.googleReviews).searchParams.get("query_place_id"), "ChIJLU7G7yFu5kcR4PcOOO6p3I0");
  assert.equal(new URL(externalPlaceLinks({ name: "Eiffel Tower", city: "Paris", countryCode: "FR", googlePlaceId: "guessed-id" }).googleReviews).searchParams.get("query_place_id"), null);
});

test("landmarks and a China restaurant use public links only", () => {
  const eiffel = queryOf(externalPlaceLinks({ name: "Eiffel Tower", city: "Paris", countryCode: "FR" }).googleReviews);
  assert.match(eiffel, /Eiffel Tower/);
  assert.match(eiffel, /Paris/);
  assert.match(eiffel, /France/);
  const merlion = queryOf(externalPlaceLinks({ name: "Merlion", city: "Singapore", countryCode: "SG" }).googleReviews);
  assert.match(merlion, /Merlion/);
  assert.match(merlion, /Singapore/);
  const palace = externalPlaceLinks({
    name: "Gyeongbokgung Palace",
    nameLocal: "경복궁",
    city: "Seoul",
    countryCode: "KR",
    lat: 37.5796,
    lng: 126.977,
  });
  assert.match(queryOf(palace.googleReviews), /Gyeongbokgung Palace/);
  assert.match(queryOf(palace.googleReviews), /경복궁/);
  assert.match(queryOf(palace.googleReviews), /Seoul/);
  assert.match(queryOf(palace.googleReviews), /South Korea/);
  assert.equal(palace.localPlace?.label, "View on Kakao Map");
  assert.match(palace.localPlace?.href ?? "", /^https:\/\/map\.kakao\.com\/link\/map\//);
  const chen = externalPlaceLinks({
    name: "陈麻婆豆腐",
    displayName: "Chen Mapo Tofu",
    city: "Chengdu",
    countryCode: "CN",
    lat: 30.673,
    lng: 104.056,
  });
  assert.match(queryOf(chen.googleReviews), /陈麻婆豆腐/);
  assert.match(queryOf(chen.googleReviews), /Chengdu/);
  assert.match(queryOf(chen.googleReviews), /China/);
  assert.equal(chen.localPlace?.label, "View on Amap");
  assert.match(chen.localPlace?.href ?? "", /^https:\/\/uri\.amap\.com\/marker/);
  assert.equal((chen.localPlace?.href ?? "").includes("key="), false);
  noPaidGoogle(chen.googleReviews);
});
