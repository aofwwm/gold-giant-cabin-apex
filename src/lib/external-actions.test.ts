import assert from "node:assert/strict";
import test from "node:test";
import { placeActions, type ActionInput, type ExternalActionType } from "./external-actions.ts";

function types(actions: { type: ExternalActionType }[]): ExternalActionType[] {
  return actions.map((action) => action.type);
}

function byType(actions: ReturnType<typeof placeActions>, type: ExternalActionType) {
  return actions.filter((action) => action.type === type);
}

function base(over: Partial<ActionInput> & Pick<ActionInput, "place" | "kind">): ActionInput {
  return { mode: "travel", navigate: true, ...over };
}

test("a Nagoya restaurant can be reviewed and navigated, not reserved", () => {
  const actions = placeActions(base({
    mode: "makan",
    kind: "restaurant",
    countryCode: "JP",
    from: { lat: 35.17, lng: 136.91, name: "Nagoya Station" },
    place: { name: "丸八寿司", nameEn: "Maruhachi Sushi", city: "Nagoya", countryCode: "JP", lat: 35.168, lng: 136.906, address: "Sakae" },
  }), "other");
  assert.ok(byType(actions, "REVIEWS").some((action) => action.provider === "google-maps"));
  assert.match(byType(actions, "REVIEWS").find((action) => action.provider === "google-maps")?.url ?? "", /Maruhachi|丸八寿司/);
  assert.match(byType(actions, "REVIEWS").find((action) => action.provider === "google-maps")?.url ?? "", /Nagoya/);
  assert.equal(byType(actions, "NAVIGATE")[0]?.provider, "google");
  assert.equal(types(actions).includes("RESERVE_RESTAURANT"), false);
  assert.equal(types(actions).includes("ORDER_FOOD"), false);
  assert.equal(actions.some((action) => action.provider === "amap" || action.provider === "kakao" || action.provider === "naver"), false);
  assert.equal(actions.some((action) => /googleapis|key=/.test(action.url)), false);
});

test("a Nagoya attraction keeps the official site and does not invent tickets", () => {
  const actions = placeActions(base({
    kind: "attraction",
    countryCode: "JP",
    from: { lat: 35.17, lng: 136.9, name: "Hotel" },
    place: {
      name: "Tokugawa Art Museum",
      city: "Nagoya",
      countryCode: "JP",
      lat: 35.183, lng: 136.933,
      website: "https://www.tokugawa-art-museum.jp/",
    },
  }), "other");
  assert.equal(byType(actions, "OFFICIAL_WEBSITE")[0]?.url, "https://www.tokugawa-art-museum.jp/");
  assert.equal(types(actions).includes("BUY_TICKET"), false);
  assert.ok(byType(actions, "REVIEWS").some((action) => action.label === "View Google reviews"));
  assert.equal(actions.some((action) => action.provider === "amap"), false);
});

test("a Chengdu hotel opens Trip.com search and Amap, without a price", () => {
  const actions = placeActions(base({
    kind: "hotel",
    countryCode: "CN",
    from: { lat: 30.66, lng: 104.06, name: "Tianfu Square" },
    place: { name: "Chengdu Shangri-La", city: "Chengdu", countryCode: "CN", lat: 30.657, lng: 104.066, website: "https://www.shangri-la.com/chengdu/shangrila/" },
  }), "android");
  const book = byType(actions, "BOOK_HOTEL")[0];
  assert.equal(book?.provider, "trip.com");
  assert.match(book?.url ?? "", /trip\.com\/hotels/);
  assert.doesNotMatch(book?.url ?? "", /aid=|affiliate|price/i);
  assert.equal(book?.disclosureRequired, true);
  assert.ok(actions.some((action) => action.provider === "amap"));
  assert.equal(byType(actions, "NAVIGATE")[0]?.provider, "amap");
  assert.equal(actions.some((action) => action.provider === "kakao" || action.provider === "naver"), false);
  assert.equal(byType(actions, "OFFICIAL_WEBSITE")[0]?.url.startsWith("https://www.shangri-la.com/"), true);
});

test("a Paris attraction stays on Google and Apple, not Amap", () => {
  const actions = placeActions(base({
    kind: "attraction",
    countryCode: "FR",
    from: { lat: 48.86, lng: 2.34, name: "Hotel" },
    place: { name: "Eiffel Tower", city: "Paris", countryCode: "FR", lat: 48.8584, lng: 2.2945 },
  }), "ios");
  const review = new URL(byType(actions, "REVIEWS").find((action) => action.provider === "google-maps")?.url ?? "https://example.invalid").searchParams.get("query") ?? "";
  assert.match(review, /Eiffel Tower/);
  assert.match(review, /Paris/);
  assert.equal(byType(actions, "NAVIGATE")[0]?.provider, "apple");
  assert.equal(actions.some((action) => action.provider === "amap" || action.provider === "kakao"), false);
  assert.equal(types(actions).includes("BOOK_HOTEL"), false);
  assert.equal(types(actions).includes("BUY_TICKET"), false);
});

test("a Singapore restaurant does not grow a reservation or a China map", () => {
  const actions = placeActions(base({
    mode: "makan",
    kind: "restaurant",
    countryCode: "SG",
    from: { lat: 1.3, lng: 103.8, name: "Raffles Place" },
    navMode: "walk",
    place: { name: "Newton Food Centre", city: "Singapore", countryCode: "SG", lat: 1.311, lng: 103.838, address: "500 Clemenceau Ave" },
  }), "other");
  assert.ok(byType(actions, "REVIEWS").some((action) => action.provider === "google-maps"));
  assert.equal(byType(actions, "NAVIGATE")[0]?.provider, "google");
  assert.match(byType(actions, "NAVIGATE")[0]?.url ?? "", /travelmode=walking/);
  assert.equal(types(actions).includes("RESERVE_RESTAURANT"), false);
  assert.equal(types(actions).includes("BOOK_HOTEL"), false);
  assert.equal(actions.some((action) => action.provider === "amap" || action.provider === "naver"), false);
});

test("a Seoul attraction offers Kakao and Naver, and a real ticket link only when one exists", () => {
  const plain = placeActions(base({
    kind: "attraction",
    countryCode: "KR",
    from: { lat: 37.55, lng: 126.98, name: "Hotel" },
    place: { name: "Gyeongbokgung Palace", nameLocal: "경복궁", city: "Seoul", countryCode: "KR", lat: 37.5796, lng: 126.977, website: "https://www.royalpalace.go.kr/" },
  }), "android");
  assert.ok(plain.some((action) => action.provider === "kakao"));
  assert.ok(plain.some((action) => action.provider === "naver"));
  assert.equal(plain.some((action) => action.provider === "amap"), false);
  assert.equal(byType(plain, "NAVIGATE")[0]?.provider, "kakao");
  assert.equal(types(plain).includes("BUY_TICKET"), false);
  const ticketed = placeActions(base({
    kind: "attraction",
    countryCode: "KR",
    place: { name: "Gyeongbokgung Palace", city: "Seoul", countryCode: "KR", lat: 37.5796, lng: 126.977, ticketUrl: "https://www.royalpalace.go.kr/tickets" },
  }), "android");
  assert.equal(byType(ticketed, "BUY_TICKET")[0]?.url, "https://www.royalpalace.go.kr/tickets");
  const social = placeActions(base({
    kind: "restaurant",
    countryCode: "KR",
    place: { name: "식당", city: "Seoul", countryCode: "KR", lat: 37.5, lng: 127, reserveUrl: "https://facebook.com/not-a-booking" },
  }));
  assert.equal(types(social).includes("RESERVE_RESTAURANT"), false);
});

test("share and calendar carry the place only", () => {
  const actions = placeActions(base({
    mode: "today",
    kind: "place",
    countryCode: "SG",
    share: true,
    from: { lat: 1.29, lng: 103.85, name: "Home" },
    when: { date: "2026-10-04", startMin: 18 * 60, endMin: 20 * 60, timezone: "Asia/Singapore" },
    place: { name: "Newton Food Centre", address: "500 Clemenceau Ave", city: "Singapore", countryCode: "SG", lat: 1.311, lng: 103.838 },
  }));
  const share = byType(actions, "SHARE")[0];
  const text = decodeURIComponent(share?.url.split("text=")[1] ?? "");
  assert.match(text, /Newton Food Centre/);
  assert.doesNotMatch(text, /birthday|oracle|profile|family/i);
  const calendar = byType(actions, "ADD_TO_CALENDAR")[0];
  assert.match(calendar?.url ?? "", /calendar\.google\.com/);
  assert.doesNotMatch(calendar?.url ?? "", /birthday|oracle/i);
  assert.equal(actions.every((action) => action.url.startsWith("https://")), true);
});
