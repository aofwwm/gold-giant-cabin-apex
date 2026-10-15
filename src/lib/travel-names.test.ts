import assert from "node:assert/strict";
import test from "node:test";
import { mergePlaces } from "./travel-knowledge.ts";
import type { DiscoveredPlace } from "./travel-model.ts";
import {
  destinationLocalName,
  localSubtitle,
  placeCopy,
  placeMatches,
  polishAddress,
  polishReading,
  readableName,
  resolvePlaceDisplayName,
  translationFits,
} from "./travel-names.ts";

const nagoya = { name: "Nagoya", latitude: 35.18, longitude: 136.9 };

function place(partial: Partial<DiscoveredPlace> & Pick<DiscoveredPlace, "id" | "name">): DiscoveredPlace {
  return {
    provider: "osm",
    providerId: partial.id,
    category: "museum",
    address: "Nagoya",
    lat: 35.17,
    lng: 136.9,
    indoor: true,
    area: "Nagoya",
    opening: "",
    ...partial,
  };
}

test("official English leads and the local name stays underneath", () => {
  const named = resolvePlaceDisplayName({
    name: "東横イン桜通口本館",
    nameEn: "Toyoko Inn Nagoya Sakuradori-guchi Honkan",
    nameLocal: "東横イン桜通口本館",
    countryCode: "JP",
    lat: 35.17,
    lng: 136.91,
    englishSource: "osm_name_en",
  });
  assert.equal(named.displayName, "Toyoko Inn Nagoya Sakuradori-guchi Honkan");
  assert.equal(named.displaySubtitle, "東横イン桜通口本館");
  assert.equal(named.nameLocal, "東横イン桜通口本館");
  assert.equal(named.displayNameQuality, "official");
  assert.equal(named.translationSource, "osm_name_en");
  assert.equal(named.language, "ja");
});

test("a Latin source name is not rewritten", () => {
  const named = resolvePlaceDisplayName({ name: "Musée du Louvre", countryCode: "FR", lat: 48.86, lng: 2.34 });
  assert.equal(named.displayName, "Musée du Louvre");
  assert.equal(named.displaySubtitle, "");
  assert.equal(named.displayNameQuality, "official");
  assert.equal(readableName({ name: "Musée du Louvre", displayName: named.displayName }), "Musée du Louvre");
});

test("Tokyo, Seoul, Chengdu, and Bangkok prefer the official English name", () => {
  const tokyo = resolvePlaceDisplayName({ name: "東京タワー", nameEn: "Tokyo Tower", nameLocal: "東京タワー", countryCode: "JP", lat: 35.66, lng: 139.75 });
  const seoul = resolvePlaceDisplayName({ name: "경복궁", nameEn: "Gyeongbokgung Palace", nameLocal: "경복궁", countryCode: "KR", lat: 37.58, lng: 126.98 });
  const chengdu = resolvePlaceDisplayName({ name: "武侯祠", nameEn: "Wuhou Shrine", nameLocal: "武侯祠", countryCode: "CN", lat: 30.64, lng: 104.05 });
  const bangkok = resolvePlaceDisplayName({ name: "วัดพระแก้ว", nameEn: "Wat Phra Kaew", nameLocal: "วัดพระแก้ว", countryCode: "TH", lat: 13.75, lng: 100.49 });
  assert.equal(tokyo.displayName, "Tokyo Tower");
  assert.equal(tokyo.displaySubtitle, "東京タワー");
  assert.equal(seoul.displayName, "Gyeongbokgung Palace");
  assert.equal(seoul.displaySubtitle, "경복궁");
  assert.equal(chengdu.displayName, "Wuhou Shrine");
  assert.equal(chengdu.displaySubtitle, "武侯祠");
  assert.equal(bangkok.displayName, "Wat Phra Kaew");
  assert.equal(bangkok.displaySubtitle, "วัดพระแก้ว");
});

test("a low-confidence translation does not replace romanisation", () => {
  const named = resolvePlaceDisplayName({
    name: "熱田神宮",
    nameLocal: "熱田神宮",
    romanized: "Atsuta Jingu",
    translated: { english: "Tokyo Skytree", romanized: "Atsuta Jingu", confidence: "low" },
    countryCode: "JP",
    lat: 35.12,
    lng: 136.91,
  });
  assert.equal(named.displayName, "Atsuta Jingu");
  assert.equal(named.displaySubtitle, "熱田神宮");
  assert.equal(named.displayNameQuality, "romanised");
  assert.equal(translationFits("Atsuta Jingu", "Tokyo Skytree"), false);
  assert.equal(translationFits("Nagoya Jo", "Nagoya Castle"), true);
});

test("a tied translation can become the English display name", () => {
  const named = resolvePlaceDisplayName({
    name: "だいきち美術七宝焼参考館",
    nameLocal: "だいきち美術七宝焼参考館",
    romanized: "Daikichi Bijutsu Shippoyaki Sankokan",
    translated: { english: "Daikichi Cloisonne Art Reference Museum", romanized: "Daikichi Bijutsu Shippoyaki Sankokan", confidence: "high" },
    countryCode: "JP",
    lat: 35.17,
    lng: 136.9,
  });
  assert.equal(named.displayName, "Daikichi Cloisonne Art Reference Museum");
  assert.equal(named.nameLocal, "だいきち美術七宝焼参考館");
  assert.equal(named.displayNameQuality, "translated");
  assert.equal(localSubtitle(named), "だいきち美術七宝焼参考館");
});

test("search matches the English display name and the local name", () => {
  const castle = {
    name: "名古屋城",
    nameLocal: "名古屋城",
    nameEnglish: "Nagoya Castle",
    nameRomanized: "Nagoya Jo",
    displayName: "Nagoya Castle",
    displaySubtitle: "名古屋城",
  };
  assert.equal(placeMatches(castle, "Nagoya Castle"), true);
  assert.equal(placeMatches(castle, "名古屋城"), true);
  assert.equal(placeMatches(castle, "nagoya jo"), true);
  assert.equal(placeMatches(castle, "Osaka Castle"), false);
});

test("addresses keep a Latin line and the local line", () => {
  const copy = placeCopy({
    address: "名古屋市中区本丸1-1",
    addressDisplay: "1-1 Honmaru, Naka Ward, Nagoya",
    addressLocal: "名古屋市中区本丸1-1",
    description: "名古屋城は尾張の城である。",
    descriptionDisplay: "Nagoya Castle was the seat of Owari.",
  });
  assert.equal(copy.address, "1-1 Honmaru, Naka Ward, Nagoya");
  assert.equal(copy.addressLocal, "名古屋市中区本丸1-1");
  assert.equal(copy.description, "Nagoya Castle was the seat of Owari.");
  assert.match(copy.descriptionLocal, /名古屋城/);
});

test("readings keep the same place and use standard English endings", () => {
  assert.equal(polishReading("東京タワー", "Tokyo Tawa", "ja"), "Tokyo Tower");
  assert.equal(polishReading("名古屋城", "Nagoya Jo", "ja"), "Nagoya Castle");
  assert.equal(polishReading("名古屋駅", "Nagoya Eki", "ja"), "Nagoya Station");
  assert.equal(polishReading("東横イン桜通口本館", "Higashiyoko In Sakura Dori Guchi Honkan", "ja"), "Toyoko Inn Sakuradori-guchi Honkan");
  assert.equal(polishReading("だいきち美術七宝焼参考館", "Dai Kichi Bijutsu Shippoyaki Sanko Kan", "ja"), "Daikichi Cloisonne Art Reference Museum");
  assert.equal(polishReading("武侯祠", "Wu Hou Ci", "zh"), "Wuhou Shrine");
  assert.equal(polishReading("경복궁", "Gyeongbokgung", "ko"), "Gyeongbokgung Palace");
  assert.equal(polishReading("Musée du Louvre", "Musée du Louvre", "und"), "Musée du Louvre");
  assert.equal(polishAddress("名古屋市中区本丸1-1", "Nagoya Shi Naka Ku Hommaru 1 - 1", "ja"), "1-1 Honmaru, Naka Ward, Nagoya");
});

test("a French place does not take a Japanese or Chinese label as its local name", () => {
  const eiffel = destinationLocalName({
    name: "Tour Eiffel",
    nameEn: "Eiffel Tower",
    nameLocal: "エッフェル塔",
    countryCode: "FR",
  });
  assert.equal(eiffel.name, "Tour Eiffel");
  const champ = destinationLocalName({
    name: "Champ de Mars",
    nameEn: "Field of Mars",
    nameLocal: "战神广场",
    countryCode: "FR",
  });
  assert.equal(champ.name, "Champ de Mars");
  assert.notEqual(champ.name, "战神广场");
  const tokyo = destinationLocalName({ name: "東京タワー", nameEn: "Tokyo Tower", nameLocal: "東京タワー", countryCode: "JP" });
  assert.equal(tokyo.name, "東京タワー");
});

test("shared English text does not collapse two different local places", () => {
  const left = place({ id: "osm:a", name: "東横イン桜通口本館", nameLocal: "東横イン桜通口本館", displayName: "Toyoko Inn", lat: 35.17, lng: 136.9 });
  const right = place({ id: "osm:b", name: "東横イン名古屋駅", nameLocal: "東横イン名古屋駅", displayName: "Toyoko Inn", lat: 35.17, lng: 136.88 });
  const merged = mergePlaces([left, right], [], nagoya);
  assert.equal(merged.length, 2);
  assert.equal(merged[0]?.name, "東横イン桜通口本館");
  assert.equal(merged[1]?.name, "東横イン名古屋駅");
});
