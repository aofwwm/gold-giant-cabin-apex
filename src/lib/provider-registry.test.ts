import assert from "node:assert/strict";
import test from "node:test";
import { disabledAffiliateSettings } from "./affiliate.ts";
import { placeActions } from "./external-actions.ts";
import { PROVIDER_COST } from "./provider-cost.ts";
import { WORKFLOW_REQUESTS, providerRegistry } from "./provider-registry.ts";
import { rankStaysForPlan } from "./travel-model.ts";

test("optional paid providers stay off and no card is required by default", () => {
  const rows = providerRegistry({});
  assert.equal(rows.find((row) => row.id === "yelp")?.enabled, false);
  assert.equal(rows.find((row) => row.id === "foursquare")?.enabled, false);
  assert.equal(rows.find((row) => row.id === "foursquare")?.requiresCreditCard, true);
  assert.equal(rows.find((row) => row.id === "foursquare")?.requiresBilling, true);
  assert.equal(rows.some((row) => row.requiresCreditCard && row.enabled), false);
  assert.equal(rows.some((row) => row.requiresBilling && row.enabled), false);
  assert.equal(rows.find((row) => row.id === "gemini")?.requiresCreditCard, false);
  assert.equal(rows.find((row) => row.id === "gemini")?.requiresBilling, false);
  assert.equal(/sk-|AIza|AQ\./.test(JSON.stringify(rows)), false);
  const turnedOn = providerRegistry({ YELP_API_KEY: "present", FOURSQUARE_API_KEY: "present", FOURSQUARE_PHOTOS: "on" });
  assert.equal(turnedOn.find((row) => row.id === "yelp")?.enabled, true);
  assert.equal(turnedOn.find((row) => row.id === "foursquare")?.enabled, true);
  assert.equal(PROVIDER_COST.find((row) => row.id === "foursquare")?.billing, "only_if_enabled");
});

test("a free-tier outage degrades instead of throwing", () => {
  const rows = providerRegistry({});
  for (const id of ["gemini", "overpass", "wikimedia", "osrm", "met-no", "affiliate"]) {
    const row = rows.find((item) => item.id === id);
    assert.ok(row);
    assert.doesNotMatch(row.note, /crash|throw|blank screen/i);
    assert.ok(row.note.length > 12);
  }
  const stays = [
    { name: "Near Hotel", lat: 48.86, lng: 2.3, category: "stay" as const },
    { name: "Far Hotel", lat: 48.95, lng: 2.45, category: "stay" as const },
  ];
  assert.deepEqual(rankStaysForPlan(stays, [{ lat: 48.858, lng: 2.294 }]).map((stay) => stay.name), ["Near Hotel", "Far Hotel"]);
  const actions = placeActions({
    mode: "travel",
    kind: "attraction",
    countryCode: "FR",
    navigate: true,
    from: { lat: 48.86, lng: 2.35, name: "Hotel" },
    place: { name: "Eiffel Tower", city: "Paris", countryCode: "FR", lat: 48.858, lng: 2.294 },
  }, "other", disabledAffiliateSettings());
  assert.equal(actions.some((action) => action.type === "REVIEWS"), true);
  assert.equal(actions.some((action) => action.type === "NAVIGATE"), true);
  assert.equal(actions.some((action) => action.source === "affiliate"), false);
  assert.ok(WORKFLOW_REQUESTS.some((row) => row.workflow === "Today load" && /0/.test(row.requests)));
});
