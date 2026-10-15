import "@tanstack/react-start/server-only";

import { createRequire } from "node:module";
import anyAscii from "any-ascii";
import { pinyin } from "pinyin-pro";
import { geminiJson } from "@/lib/gemini.server";
import { TtlCache } from "@/lib/travel-cache";
import {
  hasNonLatin,
  localNameFits,
  tidyLocalLabel,
  polishAddress,
  polishReading,
  resolvePlaceDisplayName,
  sourceLanguage,
  tidyLatin,
  translationFits,
  type NameConfidence,
  type PlaceNameFields,
} from "@/lib/travel-names";

const require = createRequire(import.meta.url);
const nameCache = new TtlCache<Translated>(30 * 24 * 60 * 60 * 1000, 800, "gemini");
const textCache = new TtlCache<string>(30 * 24 * 60 * 60 * 1000, 400, "gemini");

type Translated = { english: string; romanized: string; confidence: NameConfidence };

type Named = {
  id: string;
  name: string;
  category?: string;
  lat: number;
  lng: number;
  nameEn?: string;
  nameLatin?: string;
  nameLocal?: string;
  description?: string;
  address?: string;
  descriptionDisplay?: string;
  addressLocal?: string;
  addressDisplay?: string;
} & Partial<PlaceNameFields>;

type Hint = { countryCode?: string; latitude?: number; longitude?: number };

function construct<T>(mod: unknown): T | null {
  let current = mod;
  for (let hop = 0; hop < 4; hop += 1) {
    if (typeof current === "function") return current as T;
    if (current && typeof current === "object" && "default" in current) {
      current = (current as { default: unknown }).default;
      continue;
    }
    return null;
  }
  return null;
}

type Kuro = { init: (analyzer: unknown) => Promise<void>; convert: (text: string, options: Record<string, string>) => Promise<string> };

let japanese: Promise<Kuro | null> | null = null;

function japaneseEngine(): Promise<Kuro | null> {
  if (!japanese) {
    japanese = (async () => {
      try {
        const kuroMod = await import("kuroshiro");
        const anaMod = await import("kuroshiro-analyzer-kuromoji");
        const Kuroshiro = construct<new () => Kuro>(kuroMod);
        const Analyzer = construct<new () => unknown>(anaMod);
        if (!Kuroshiro || !Analyzer) return null;
        const engine = new Kuroshiro();
        await engine.init(new Analyzer());
        return engine;
      } catch {
        return null;
      }
    })();
  }
  return japanese;
}

function korean(text: string): string {
  try {
    const mod = require("aromanize") as { romanize?: (value: string) => string };
    const value = mod.romanize?.(text) ?? "";
    return tidyLatin(value.replace(/[?.!]+$/g, ""));
  } catch {
    return "";
  }
}

/** Deterministic reading. Not an official English name. Japanese does not fall through to Chinese readings. */
export async function romanizeName(text: string, language: string): Promise<string> {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean || !hasNonLatin(clean)) return "";
  if (language === "ja") {
    const engine = await japaneseEngine();
    if (!engine) return "";
    const value = await engine.convert(clean, { to: "romaji", mode: "spaced", romajiSystem: "passport" }).catch(() => "");
    return polishReading(clean, tidyLatin(value), "ja");
  }
  if (language === "zh") {
    const value = pinyin(clean, { toneType: "none", type: "string", separator: " " });
    const tidy = tidyLatin(value);
    if (tidy) return polishReading(clean, tidy, "zh");
  }
  if (language === "ko") {
    const value = korean(clean);
    if (value) return polishReading(clean, value, "ko");
  }
  const ascii = tidyLatin(anyAscii(clean));
  return polishReading(clean, ascii, language);
}

function cacheKey(local: string, category: string): string {
  return `en|${category}|${local}`;
}

function confidenceOf(value: string): NameConfidence {
  const text = value.toLowerCase();
  if (text === "high") return "high";
  if (text === "medium") return "medium";
  return "low";
}

async function translateNames(rows: { id: string; local: string; romanized: string; category: string }[]): Promise<Map<string, Translated>> {
  const found = new Map<string, Translated>();
  const pending: typeof rows = [];
  for (const row of rows) {
    const cached = nameCache.get(cacheKey(row.local, row.category));
    if (cached) found.set(row.id, cached);
    else pending.push(row);
  }
  for (let index = 0; index < pending.length; index += 24) {
    const chunk = pending.slice(index, index + 24);
    const raw = await geminiJson(
      "You name places for an English-speaking traveller. For each item, return the established English name if one is commonly used, otherwise a close reading of the local name. Keep the same place. Do not substitute a different attraction, hotel, station, or neighbourhood. Do not add facts, descriptions, or addresses. A proper noun with no established English name should stay close to the romanized hint. If you are unsure, repeat the romanized hint and set confidence to low.",
      JSON.stringify({ names: chunk.map((row) => ({ placeId: row.id, localName: row.local, romanizedHint: row.romanized, category: row.category })) }),
      {
        type: "object",
        properties: {
          names: {
            type: "array",
            items: {
              type: "object",
              properties: {
                placeId: { type: "string" },
                localName: { type: "string" },
                englishName: { type: "string" },
                romanizedName: { type: "string" },
                confidence: { type: "string" },
              },
              required: ["placeId", "englishName", "romanizedName", "confidence"],
            },
          },
        },
        required: ["names"],
      },
      1200,
    ).catch(() => null);
    const names = raw && typeof raw === "object" && Array.isArray((raw as { names?: unknown }).names) ? (raw as { names: { placeId?: string; englishName?: string; romanizedName?: string; confidence?: string }[] }).names : [];
    if (!raw) continue;
    const byId = new Map(chunk.map((row) => [row.id, row]));
    for (const item of names) {
      const id = item.placeId ?? "";
      const row = byId.get(id);
      if (!row || !item.englishName) continue;
      const translated: Translated = {
        english: item.englishName.replace(/\s+/g, " ").trim().slice(0, 120),
        romanized: (item.romanizedName ?? row.romanized).replace(/\s+/g, " ").trim().slice(0, 120),
        confidence: confidenceOf(item.confidence ?? ""),
      };
      if (!translated.english || hasNonLatin(translated.english)) continue;
      const anchored = row.romanized
        ? translationFits(row.romanized, translated.english) || translationFits(translated.romanized, translated.english)
        : translated.confidence === "high";
      if (!anchored) translated.confidence = "low";
      nameCache.set(cacheKey(row.local, row.category), translated);
      found.set(id, translated);
    }
    for (const row of chunk) {
      if (found.has(row.id)) continue;
      const missed: Translated = { english: row.romanized, romanized: row.romanized, confidence: "low" };
      nameCache.set(cacheKey(row.local, row.category), missed);
      found.set(row.id, missed);
    }
  }
  return found;
}

async function translateDescriptions(rows: { id: string; text: string }[]): Promise<Map<string, string>> {
  const found = new Map<string, string>();
  const pending: typeof rows = [];
  for (const row of rows) {
    const cached = textCache.get(row.text);
    if (cached) found.set(row.id, cached);
    else pending.push(row);
  }
  for (let index = 0; index < pending.length; index += 20) {
    const chunk = pending.slice(index, index + 20);
    const raw = await geminiJson(
      "Translate each description into one concise English sentence. Use only the text given. Do not add places, prices, hours, ratings, or history that is not in the text. If you cannot translate it, return an empty english string.",
      JSON.stringify({ texts: chunk.map((row) => ({ placeId: row.id, text: row.text })) }),
      {
        type: "object",
        properties: {
          texts: {
            type: "array",
            items: {
              type: "object",
              properties: { placeId: { type: "string" }, english: { type: "string" } },
              required: ["placeId", "english"],
            },
          },
        },
        required: ["texts"],
      },
      900,
    ).catch(() => null);
    const texts = raw && typeof raw === "object" && Array.isArray((raw as { texts?: unknown }).texts) ? (raw as { texts: { placeId?: string; english?: string }[] }).texts : [];
    if (!raw) continue;
    const byId = new Map(chunk.map((row) => [row.id, row]));
    for (const item of texts) {
      const row = byId.get(item.placeId ?? "");
      const english = (item.english ?? "").replace(/\s+/g, " ").trim().slice(0, 280);
      if (!row || !english || hasNonLatin(english)) continue;
      textCache.set(row.text, english);
      found.set(row.id, english);
    }
  }
  return found;
}

function apply(place: Named, hint: Hint, extra?: { romanized?: string; translated?: Translated }): Named {
  const country = (hint.countryCode ?? "").toUpperCase();
  let nameLocal = place.nameLocal || "";
  if (country && nameLocal && !localNameFits(nameLocal, country)) nameLocal = "";
  if (!nameLocal) {
    const candidate = tidyLocalLabel(place.name || "");
    const english = (place.nameEn || "").trim();
    if (candidate && (!country || localNameFits(candidate, country)) && candidate.toLowerCase() !== english.toLowerCase()) nameLocal = candidate;
  }
  const fields = resolvePlaceDisplayName({
    name: place.name,
    nameEn: place.nameEn,
    nameLatin: place.nameLatin,
    nameLocal,
    romanized: extra?.romanized || place.nameRomanized,
    translated: extra?.translated,
    countryCode: country,
    lat: place.lat,
    lng: place.lng,
    englishSource: place.nameEn ? (place.translationSource === "wikidata_en" ? "wikidata_en" : "osm_name_en") : "",
  }, "en");
  return { ...place, ...fields, localName: fields.nameLocal || nameLocal || "" } as Named;
}

/**
 * Resolve display names once per plan. Official English, then verified Latin, then romanisation, then one batched translation.
 * Results are cached in memory. Rendering does not call this. The canonical `name` is left as the source returned it.
 */
export async function labelPlaces<T extends Named>(places: T[], hint: Hint = {}): Promise<T[]> {
  try {
    const seeded = places.map((place) => apply(place, hint));
    const roman = new Map<string, string>();
    for (const place of seeded) {
      const local = place.nameLocal || (hasNonLatin(place.name) ? place.name : "");
      if (!local || !hasNonLatin(local)) continue;
      if (place.nameLatin && tidyLatin(place.nameLatin)) continue;
      const language = sourceLanguage(local, hint.countryCode, place.lat || hint.latitude, place.lng || hint.longitude);
      const value = await romanizeName(local, language).catch(() => "");
      if (value) roman.set(place.id, value);
    }
    const read = seeded.map((place) => roman.has(place.id) ? apply(place, hint, { romanized: roman.get(place.id) }) : place);
    const unresolved = read.filter((place) => {
      const local = place.nameLocal || place.name;
      if (!hasNonLatin(local)) return false;
      if (place.displayNameQuality === "official") return false;
      if (place.translationSource === "osm_name_latin") return false;
      return true;
    });
    const translated = unresolved.length
      ? await translateNames(unresolved.map((place) => ({
        id: place.id,
        local: place.nameLocal || place.name,
        romanized: place.nameRomanized || "",
        category: place.category || "place",
      })))
      : new Map<string, Translated>();
    const named = read.map((place) => translated.has(place.id) ? apply(place, hint, { romanized: roman.get(place.id) || place.nameRomanized, translated: translated.get(place.id) }) : place);
    const descriptions = named.filter((place) => place.description && hasNonLatin(place.description));
    const englishText = descriptions.length
      ? await translateDescriptions(descriptions.map((place) => ({ id: place.id, text: place.description || "" })))
      : new Map<string, string>();
    const addressed = await Promise.all(named.map(async (place) => {
      const descriptionDisplay = englishText.get(place.id) || (place.description && !hasNonLatin(place.description) ? place.description : place.descriptionDisplay || "");
      let addressDisplay = place.addressDisplay && !hasNonLatin(place.addressDisplay) ? place.addressDisplay : "";
      let addressLocal = place.addressLocal || "";
      if (place.address && hasNonLatin(place.address)) {
        addressLocal = place.addressLocal || place.address;
        if (!addressDisplay) {
          const language = sourceLanguage(place.address, hint.countryCode, place.lat || hint.latitude, place.lng || hint.longitude);
          addressDisplay = polishAddress(place.address, await romanizeName(place.address, language).catch(() => ""), language);
        }
      } else if (place.address && !addressDisplay) {
        addressDisplay = place.address;
      }
      return { ...place, descriptionDisplay, addressLocal, addressDisplay };
    }));
    return addressed as T[];
  } catch {
    return places;
  }
}
