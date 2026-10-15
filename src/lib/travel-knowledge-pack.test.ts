import assert from "node:assert/strict";
import test from "node:test";
import "./travel-playbook-facts.ts";
import { anchorsForDestination } from "./travel-anchors.ts";
import { ensureDestinationKnowledge, knowledgeBuildCount, resetKnowledgeForTests } from "./travel-knowledge-pack.ts";

test("Tokyo stays on the verified anchor pack", () => {
  resetKnowledgeForTests();
  const pack = ensureDestinationKnowledge("Tokyo");
  assert.ok(pack);
  assert.equal(pack?.status, "VERIFIED");
  assert.equal(pack?.destinationScope, "CITY");
  assert.ok(pack?.anchors.some((anchor) => anchor.name === "Senso-ji"));
  assert.ok(pack?.dayPatterns.some((pattern) => pattern.theme === "Historic East Tokyo"));
  assert.equal(ensureDestinationKnowledge("Tokyo"), pack);
  assert.equal(knowledgeBuildCount(), 1);
});

test("London compiles named anchors and reuses them", () => {
  resetKnowledgeForTests();
  const pack = ensureDestinationKnowledge("London");
  assert.ok(pack);
  assert.equal(pack?.status, "COMPILED");
  assert.equal(pack?.destinationScope, "CITY");
  const names = pack?.anchors.map((anchor) => anchor.name).join(" ") ?? "";
  assert.match(names, /British Museum/);
  assert.match(names, /Windsor Castle/);
  assert.match(names, /Tower of London/);
  assert.equal(pack?.anchors.some((anchor) => anchor.name === "London"), false);
  assert.ok(pack?.dayPatterns.every((pattern) => pattern.theme.toLowerCase() !== "london"));
  assert.ok(pack?.anchors.every((anchor) => Number.isFinite(anchor.lat) && Number.isFinite(anchor.lng) && !(Math.abs(anchor.lat) < 0.5 && Math.abs(anchor.lng) < 0.5)));
  const before = knowledgeBuildCount();
  assert.equal(ensureDestinationKnowledge("London")?.id, "london");
  assert.equal(knowledgeBuildCount(), before);
  assert.ok(anchorsForDestination("London").some((anchor) => anchor.name === "British Museum"));
});

test("Hokkaido is not the Japan or Tokyo pack", () => {
  resetKnowledgeForTests();
  const hokkaido = ensureDestinationKnowledge("Hokkaido");
  const japan = ensureDestinationKnowledge("Japan");
  assert.ok(hokkaido);
  assert.equal(hokkaido?.destinationScope, "REGION");
  assert.equal(hokkaido?.parentDestinationId, "japan");
  const names = hokkaido?.anchors.map((anchor) => anchor.name).join(" ") ?? "";
  assert.match(names, /Odori Park|Blue Pond/);
  assert.doesNotMatch(names, /Senso-ji|Tokyo Tower/);
  assert.notEqual(hokkaido?.id, japan?.id);
  assert.ok(japan?.childDestinationIds.includes("hokkaido"));
  assert.ok(japan?.childDestinationIds.includes("tokyo"));
  assert.equal(japan?.anchors.some((anchor) => anchor.name === "Senso-ji"), true);
});

test("Seoul, Rome, Barcelona, Bali and the South Island compile their own anchors", () => {
  resetKnowledgeForTests();
  for (const [name, needle, scope] of [
    ["Seoul", "Gyeongbokgung", "CITY"],
    ["Rome", "Colosseum", "CITY"],
    ["Barcelona", "Sagrada Família", "CITY"],
    ["Bali", "Uluwatu Temple", "ISLAND"],
    ["New Zealand South Island", "Milford Sound", "ROAD_TRIP_REGION"],
    ["Iceland", "Skógafoss", "REGION"],
  ] as const) {
    const pack = ensureDestinationKnowledge(name);
    assert.ok(pack, name);
    assert.equal(pack?.destinationScope, scope, name);
    assert.ok((pack?.anchors.length ?? 0) >= 3, name);
    assert.match(pack?.anchors.map((anchor) => anchor.name).join(" ") ?? "", new RegExp(needle));
  }
});

test("a destination without a hand-written pack still gets anchors from its areas", () => {
  resetKnowledgeForTests();
  const pack = ensureDestinationKnowledge("Provence");
  assert.ok(pack);
  assert.match(pack?.anchors.map((anchor) => anchor.name).join(" ") ?? "", /Avignon/);
  assert.ok((pack?.anchors.length ?? 0) >= 3);
});
