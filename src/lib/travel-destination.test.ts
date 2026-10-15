import assert from "node:assert/strict";
import test from "node:test";
import { planningDestinations, selectTravelDestination, type TravelDestination } from "./travel.ts";

function place(partial: Pick<TravelDestination, "name" | "type"> & Partial<TravelDestination>): TravelDestination {
  return {
    displayName: partial.name,
    country: partial.type === "country" ? partial.name : "Somewhere",
    countryCode: "XX",
    latitude: 10,
    longitude: 20,
    provider: "photon",
    providerId: `osm:relation:${partial.name}`,
    ...partial,
  };
}

const iceland = place({
  name: "Iceland",
  displayName: "Iceland",
  type: "country",
  country: "Iceland",
  countryCode: "IS",
  latitude: 64.963,
  longitude: -19.021,
  providerId: "osm:relation:299133",
  bbox: [63.3, -24.5, 66.6, -13.5],
});

test("clicking a country stores the geocoder object once", () => {
  const once = selectTravelDestination([], iceland);
  const twice = selectTravelDestination(once, iceland);
  assert.equal(once.length, 1);
  assert.equal(once[0]?.name, "Iceland");
  assert.equal(once[0]?.type, "country");
  assert.equal(once[0]?.countryCode, "IS");
  assert.equal(once[0]?.provider, "photon");
  assert.equal(once[0]?.providerId, "osm:relation:299133");
  assert.deepEqual(once[0]?.bbox, iceland.bbox);
  assert.equal(twice.filter((item) => item.type === "country").length, 1);
  assert.equal(planningDestinations(once)[0]?.name, "Iceland");
  assert.deepEqual(selectTravelDestination([], { ...iceland, latitude: Number.NaN }), []);
});

test("clicking a city still selects that city", () => {
  const paris = place({ name: "Paris", displayName: "Paris, France", type: "city", country: "France", countryCode: "FR", latitude: 48.85, longitude: 2.35, providerId: "osm:relation:7444" });
  const selected = selectTravelDestination([iceland], paris);
  assert.deepEqual(selected.map((item) => item.name), ["Paris"]);
  assert.equal(planningDestinations(selected)[0]?.type, "city");
  const japan = place({ name: "Japan", type: "country", country: "Japan", countryCode: "JP", latitude: 36.2, longitude: 138.2, providerId: "osm:relation:382313" });
  const france = place({ name: "France", type: "country", country: "France", countryCode: "FR", latitude: 46.6, longitude: 2.5, providerId: "osm:relation:2202162" });
  assert.equal(selectTravelDestination([], japan)[0]?.countryCode, "JP");
  assert.equal(selectTravelDestination([], france)[0]?.countryCode, "FR");
});
