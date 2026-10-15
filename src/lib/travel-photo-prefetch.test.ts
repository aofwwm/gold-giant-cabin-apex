import assert from "node:assert/strict";
import test from "node:test";
import type { PlacePhoto } from "./travel-photo.ts";
import { createPhotoStore, photoCacheKey, type PhotoResolver, type PrefetchTarget } from "./travel-photo-prefetch.ts";

function sample(name: string): PlacePhoto {
  const file = name.replace(/\s+/g, "_");
  return {
    source: "commons_search",
    fileTitle: `File:${file}.jpg`,
    thumbnailUrl: `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/${file}.jpg/960px-${file}.jpg`,
    originalUrl: `https://upload.wikimedia.org/wikipedia/commons/a/ab/${file}.jpg`,
    descriptionUrl: `https://commons.wikimedia.org/wiki/File:${file}.jpg`,
    width: 960,
    height: 640,
    mime: "image/jpeg",
    creator: "Tester",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    attributionRequired: true,
    retrievedAt: "2026-01-01T00:00:00.000Z",
  };
}

function place(partial: Partial<PrefetchTarget> & Pick<PrefetchTarget, "id" | "name">): PrefetchTarget {
  return { day: 0, ...partial };
}

test("photo cache key is the canonical place id, with a wikidata alias", () => {
  assert.equal(photoCacheKey({ id: "anchor:lake-ashi" }), "place:anchor:lake-ashi");
  assert.equal(photoCacheKey({ id: "anchor:meiji", wikidataId: "Q182763" }), "place:anchor:meiji");
  assert.equal(photoCacheKey({ wikidataId: "Q182763" }), "wd:Q182763");
});

test("Lake Ashi resolves without a place-detail open and a second pass uses the cache", async () => {
  const store = createPhotoStore();
  let calls = 0;
  const resolve: PhotoResolver = async (target) => {
    calls += 1;
    assert.equal(target.id, "anchor:lake-ashi");
    return sample("Lake Ashi");
  };
  assert.equal(store.read("place:anchor:lake-ashi").status, "UNRESOLVED");
  const first = await store.prefetch([place({ id: "anchor:lake-ashi", name: "Lake Ashi", localName: "芦ノ湖", day: 2 })], { resolve, concurrency: 2 });
  assert.equal(first[0]?.status, "READY");
  assert.match(store.read("place:anchor:lake-ashi").photo?.thumbnailUrl || "", /Lake_Ashi/);
  assert.notEqual(store.read("place:anchor:lake-ashi").status, "UNRESOLVED");
  await store.prefetch([place({ id: "anchor:lake-ashi", name: "Lake Ashi" })], { resolve, concurrency: 2 });
  assert.equal(calls, 1);
});

test("Meiji Jingu and Tokyo Tower share one key across wikidata and place id", async () => {
  const store = createPhotoStore();
  const resolve: PhotoResolver = async (target) => sample(target.name);
  await store.prefetch([
    place({ id: "anchor:meiji", name: "Meiji Jingu", wikidataId: "Q182763", day: 0 }),
    place({ id: "anchor:tokyo-tower", name: "Tokyo Tower", wikidataId: "Q267221", day: 0 }),
  ], { priorityIds: ["anchor:meiji", "anchor:tokyo-tower"], resolve, concurrency: 2 });
  assert.equal(store.read("place:anchor:meiji").status, "READY");
  assert.equal(store.read("wd:Q182763").status, "READY");
  assert.equal(store.read("wd:Q182763").photo?.fileTitle, store.read("place:anchor:meiji").photo?.fileTitle);
  assert.equal(store.read("place:anchor:tokyo-tower").status, "READY");
  assert.equal(store.read("wd:Q267221").photo?.thumbnailUrl, store.read("place:anchor:tokyo-tower").photo?.thumbnailUrl);
});

test("a photo-less place becomes UNAVAILABLE only after resolution", async () => {
  const store = createPhotoStore();
  const key = "place:obscure";
  assert.equal(store.read(key).status, "UNRESOLVED");
  let calls = 0;
  await store.prefetch([place({ id: "obscure", name: "Obscure Stone" })], {
    resolve: async () => {
      calls += 1;
      return null;
    },
    concurrency: 1,
  });
  assert.equal(store.read(key).status, "UNAVAILABLE");
  await store.prefetch([place({ id: "obscure", name: "Obscure Stone" })], {
    resolve: async () => {
      calls += 1;
      return sample("Obscure Stone");
    },
    concurrency: 1,
  });
  assert.equal(calls, 1);
  assert.equal(store.read(key).status, "UNAVAILABLE");
});

test("one provider failure does not reject the batch or block another place", async () => {
  const store = createPhotoStore();
  const calls = new Map<string, number>();
  const done = store.prefetch([
    place({ id: "anchor:hakone-shrine", name: "Hakone Shrine", day: 2 }),
    place({ id: "anchor:lake-ashi", name: "Lake Ashi", day: 2 }),
  ], {
    concurrency: 2,
    resolve: async (target) => {
      calls.set(target.id, (calls.get(target.id) ?? 0) + 1);
      if (target.id === "anchor:hakone-shrine") throw new Error("wikimedia down");
      return sample(target.name);
    },
  });
  const records = await done;
  assert.equal(records.length, 2);
  assert.equal(store.read("place:anchor:hakone-shrine").status, "ERROR");
  assert.equal(store.read("place:anchor:lake-ashi").status, "READY");
  assert.equal(calls.get("anchor:hakone-shrine"), 2);
  assert.equal(calls.get("anchor:lake-ashi"), 1);
  const before = calls.get("anchor:hakone-shrine");
  await store.prefetch([place({ id: "anchor:hakone-shrine", name: "Hakone Shrine" })], {
    resolve: async (target) => {
      calls.set(target.id, (calls.get(target.id) ?? 0) + 1);
      return sample(target.name);
    },
    concurrency: 1,
  });
  assert.equal(calls.get("anchor:hakone-shrine"), before);
});

test("the open day is resolved before later days", async () => {
  const store = createPhotoStore();
  const order: string[] = [];
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const resolve: PhotoResolver = async (target) => {
    order.push(target.name);
    if (target.name === "Late") await gate;
    return sample(target.name);
  };
  const first = store.prefetch([place({ id: "late", name: "Late", day: 4 })], { resolve, concurrency: 1 });
  assert.deepEqual(order, ["Late"]);
  const rest = store.prefetch([
    place({ id: "soon", name: "Soon", day: 3 }),
    place({ id: "first", name: "First", day: 0 }),
  ], { priorityIds: ["first"], resolve, concurrency: 1 });
  release();
  await first;
  await rest;
  assert.deepEqual(order, ["Late", "First", "Soon"]);
});

test("a hydrated cache shows the photo without another lookup", async () => {
  const first = createPhotoStore();
  await first.prefetch([place({ id: "anchor:tokyo-tower", name: "Tokyo Tower", wikidataId: "Q267221" })], {
    resolve: async () => sample("Tokyo Tower"),
    concurrency: 1,
  });
  const raw = first.serialize();
  const second = createPhotoStore();
  second.hydrate(raw);
  assert.equal(second.read("place:anchor:tokyo-tower").status, "READY");
  let calls = 0;
  await second.prefetch([place({ id: "anchor:tokyo-tower", name: "Tokyo Tower", wikidataId: "Q267221" })], {
    resolve: async () => {
      calls += 1;
      return sample("Tokyo Tower");
    },
    concurrency: 1,
  });
  assert.equal(calls, 0);
});
