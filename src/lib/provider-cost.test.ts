import assert from "node:assert/strict";
import test from "node:test";
import { PROVIDER_COST } from "./provider-cost.ts";
import { noteCache, noteCall, noteFailure, resetUsage, usageSnapshot } from "./provider-usage.ts";
import { TtlCache } from "./travel-cache.ts";

test("cost config does not require a paid API", () => {
  assert.ok(PROVIDER_COST.length >= 10);
  for (const row of PROVIDER_COST) {
    assert.equal(row.billing === "no" || row.billing === "not_required" || row.billing === "only_if_enabled", true);
    assert.equal(/sk-|AIza|AQ\./.test(JSON.stringify(row)), false);
  }
  assert.equal(PROVIDER_COST.find((row) => row.id === "gemini")?.apiKey, "yes");
  assert.equal(PROVIDER_COST.find((row) => row.id === "reviews")?.cost, "external_handoff");
  assert.equal(PROVIDER_COST.find((row) => row.id === "foursquare")?.billing, "only_if_enabled");
  assert.equal(PROVIDER_COST.find((row) => row.id === "navigation")?.apiKey, "no");
});

test("usage counters stay on this process and hide nothing secret", () => {
  resetUsage();
  noteCall("gemini", "gemini-test");
  noteCache("discovery", false);
  noteCache("discovery", true);
  noteFailure("routing", "osrm", "HTTP 503");
  const snap = usageSnapshot();
  assert.equal(snap.session.gemini.calls, 1);
  assert.equal(snap.today.discovery.misses, 1);
  assert.equal(snap.today.discovery.hits, 1);
  assert.equal(snap.recentFailures[0]?.message, "HTTP 503");
  assert.equal(JSON.stringify(snap).includes("AQ."), false);
  const cache = new TtlCache<string>(60_000, 10, "photo");
  assert.equal(cache.get("missing"), undefined);
  cache.set("tower", "file");
  assert.equal(cache.get("tower"), "file");
  assert.equal(cache.peek("tower"), "file");
  const after = usageSnapshot();
  assert.equal(after.session.photo.misses, 1);
  assert.equal(after.session.photo.hits, 1);
  resetUsage();
});
