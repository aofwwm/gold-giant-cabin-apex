/** Display names for Travel. The canonical `name` stays the source string. */

export type NameQuality = "official" | "romanised" | "translated" | "unresolved";
export type NameConfidence = "high" | "medium" | "low";

export type PlaceNameInput = {
  name: string;
  nameEn?: string;
  nameLatin?: string;
  nameLocal?: string;
  romanized?: string;
  translated?: { english: string; romanized: string; confidence: NameConfidence };
  countryCode?: string;
  lat?: number;
  lng?: number;
  englishSource?: string;
};

export type PlaceNameFields = {
  nameLocal: string;
  nameEnglish: string;
  nameRomanized: string;
  displayName: string;
  displaySubtitle: string;
  language: string;
  translationSource: string;
  displayNameQuality: NameQuality;
};

/** Fields stored on a place. `name` itself is never replaced by these. */
export type PlaceNameRecord = {
  nameEn?: string;
  nameLatin?: string;
  nameLocal?: string;
  nameEnglish?: string;
  nameRomanized?: string;
  displayName?: string;
  displaySubtitle?: string;
  language?: string;
  translationSource?: string;
  displayNameQuality?: NameQuality;
  descriptionDisplay?: string;
  addressLocal?: string;
  addressDisplay?: string;
  localNameSource?: string;
};

const NON_LATIN = /[\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]/;

export function hasNonLatin(text: string): boolean {
  return NON_LATIN.test(text);
}

/** Common OSM admin names that arrive in local script. Not an itinerary. */
const ADMIN_ENGLISH: Record<string, string> = {
  "東京都": "Tokyo",
  "東京": "Tokyo",
  "東京市": "Tokyo",
  "大阪市": "Osaka",
  "大阪": "Osaka",
  "大阪府": "Osaka",
  "京都市": "Kyoto",
  "京都": "Kyoto",
  "京都府": "Kyoto",
  "名古屋市": "Nagoya",
  "名古屋": "Nagoya",
  "愛知県": "Aichi",
  "北海道": "Hokkaido",
  "日本": "Japan",
  "서울": "Seoul",
  "서울특별시": "Seoul",
  "대한민국": "South Korea",
  "成都市": "Chengdu",
  "成都": "Chengdu",
  "四川省": "Sichuan",
  "中国": "China",
  "パリ": "Paris",
  "フランス": "France",
  "싱가포르": "Singapore",
  "สิงคโปร์": "Singapore",
  "กรุงเทพมหานคร": "Bangkok",
};

/** English label for a generated sentence. Local script stays off headings and meal lines. */
export function englishAreaName(name: string, fallback = ""): string {
  const clean = (name || "").replace(/\s+/g, " ").trim();
  if (ADMIN_ENGLISH[clean]) return ADMIN_ENGLISH[clean];
  if (clean && !hasNonLatin(clean)) return clean;
  const other = (fallback || "").replace(/\s+/g, " ").trim();
  if (ADMIN_ENGLISH[other]) return ADMIN_ENGLISH[other];
  if (other && !hasNonLatin(other)) return other;
  return clean || other || "this area";
}

/** Day theme text. Strips a repeated prefix, then prefers an English area name. */
export function cleanTheme(title: string, fallback = ""): string {
  let text = (title || "").replace(/\s+/g, " ").trim();
  while (/^More time in\s+/i.test(text)) text = text.replace(/^More time in\s+/i, "").trim();
  text = text.replace(/^More of (the\s+)?/i, "").trim();
  return englishAreaName(text, fallback);
}

/** A full day titled only with the destination is geography, not a plan. */
export function isGenericDayTheme(theme: string, destination: string): boolean {
  const text = (theme || "").replace(/\s+/g, " ").trim().toLowerCase();
  const place = (destination || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (!text || text === "this area") return true;
  const bare = text.replace(/^(more time in|more of|more)\s+/i, "").trim();
  if (!bare) return true;
  if (place && (bare === place || text === place)) return true;
  return false;
}

export function tidyLatin(text: string): string {
  const clean = text.replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!clean || hasNonLatin(clean)) return "";
  const letters = clean.replace(/[^A-Za-z]+/g, "");
  if (!letters) return clean;
  const allLower = letters === letters.toLowerCase();
  const allUpper = letters === letters.toUpperCase() && letters.length > 3;
  if (!allLower && !allUpper) return clean;
  return clean.replace(/[A-Za-z]+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function sourceLanguage(text: string, countryCode = "", lat?: number, lng?: number): string {
  let kana = 0;
  let hangul = 0;
  let thai = 0;
  let arab = 0;
  let cyr = 0;
  let han = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 0x3040 && code <= 0x30ff) kana += 1;
    else if (code >= 0xac00 && code <= 0xd7af) hangul += 1;
    else if (code >= 0x0e00 && code <= 0x0e7f) thai += 1;
    else if (code >= 0x0600 && code <= 0x06ff) arab += 1;
    else if (code >= 0x0400 && code <= 0x04ff) cyr += 1;
    else if (code >= 0x3400 && code <= 0x9fff) han += 1;
  }
  if (kana > 0) return "ja";
  if (hangul > 0) return "ko";
  if (thai > 0) return "th";
  if (arab > 0) return "ar";
  if (cyr > 0) return "ru";
  if (han > 0) return hanLanguage(countryCode, lat, lng);
  return "und";
}

function hanLanguage(countryCode: string, lat?: number, lng?: number): string {
  const country = countryCode.toUpperCase();
  if (country === "JP") return "ja";
  if (country === "KR" || country === "KP") return "ko";
  if (country === "CN" || country === "TW" || country === "HK" || country === "MO") return "zh";
  if (country === "TH") return "th";
  if (lat != null && lng != null) {
    if (lng >= 129 && lng <= 146 && lat >= 24 && lat <= 46) return "ja";
    if (lng >= 124 && lng < 130 && lat >= 33 && lat <= 39) return "ko";
    if (lng >= 73 && lng < 125 && lat >= 18 && lat <= 45) return "zh";
  }
  return "zh";
}

/**
 * Pick the user-facing name. English is the Travel default.
 * Order: official English, source Latin name, deterministic romanisation, cached translation.
 * A low-confidence translation never replaces the romanised name.
 * `userLanguage` is reserved so a future UI language can lead with the local name.
 * This does not replace the canonical source name.
 */
export function resolvePlaceDisplayName(input: PlaceNameInput, userLanguage = "en"): PlaceNameFields {
  const canonical = input.name.replace(/\s+/g, " ").trim();
  const language = sourceLanguage(input.nameLocal || canonical, input.countryCode, input.lat, input.lng);
  const local = (input.nameLocal || (hasNonLatin(canonical) ? canonical : "")).trim();
  const official = tidyLatin(input.nameEn || "");
  const latinTag = tidyLatin(input.nameLatin || "");
  const roman = tidyLatin(input.romanized || "");
  let nameEnglish = "";
  let nameRomanized = latinTag || roman;
  let displayName = "";
  let quality: NameQuality = "unresolved";
  let source = "unresolved";

  if (official) {
    nameEnglish = official;
    displayName = official;
    quality = "official";
    source = input.englishSource || "official_en";
    if (!nameRomanized) nameRomanized = official;
  } else if (canonical && !hasNonLatin(canonical)) {
    displayName = canonical;
    nameEnglish = canonical;
    nameRomanized = nameRomanized || canonical;
    quality = "official";
    source = "source_name";
  } else if (latinTag) {
    displayName = latinTag;
    nameRomanized = latinTag;
    quality = "romanised";
    source = "osm_name_latin";
  } else if (roman) {
    displayName = roman;
    nameRomanized = roman;
    quality = "romanised";
    source = "transliteration";
  }

  const translated = input.translated;
  const translatedEnglish = tidyLatin(translated?.english || "");
  const verifiedLatin = Boolean(latinTag) && !official && hasNonLatin(canonical);
  if (translated && translated.confidence !== "low" && translatedEnglish && quality !== "official" && !verifiedLatin) {
    const tied = !roman || translationFits(roman, translatedEnglish) || translationFits(translated.romanized || "", translatedEnglish);
    if (tied) {
      displayName = translatedEnglish;
      nameEnglish = translatedEnglish;
      const translatedRoman = tidyLatin(translated.romanized || "");
      if (translatedRoman) nameRomanized = translatedRoman;
      else if (!nameRomanized) nameRomanized = translatedEnglish;
      quality = "translated";
      source = "gemini";
    }
  }

  if (!displayName) {
    displayName = canonical;
    quality = "unresolved";
    source = "unresolved";
  }

  const subtitle = local && local !== displayName ? local : "";
  const leadLocal = userLanguage !== "en" && userLanguage === language && local;
  return {
    nameLocal: local,
    nameEnglish,
    nameRomanized,
    displayName: leadLocal ? local : displayName,
    displaySubtitle: leadLocal ? (nameEnglish && nameEnglish !== local ? nameEnglish : "") : subtitle,
    language,
    translationSource: source,
    displayNameQuality: quality,
  };
}

/** A translation has to share a token with the romanisation, so it cannot become a different attraction. */
export function translationFits(romanized: string, english: string): boolean {
  const tokens = romanized.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((word) => word.length >= 3);
  if (!tokens.length) return false;
  const hay = english.toLowerCase();
  return tokens.some((word) => hay.includes(word));
}

/**
 * Turn a deterministic reading into the form a traveller expects.
 * Proper nouns stay romanised. Only generic endings and a few official chain names are adjusted.
 */
export function polishReading(local: string, romanized: string, language: string): string {
  const clean = romanized.replace(/\s+/g, " ").trim();
  if (!clean || !local.trim()) return clean;
  if (language === "ja") return polishJapanese(local, clean);
  if (language === "zh") return polishChinese(local, clean);
  if (language === "ko") return polishKorean(local, clean);
  return clean;
}

function polishJapanese(local: string, romanized: string): string {
  let text = romanized;
  if (local.includes("東横イン")) text = text.replace(/Higashiyoko\s+In\b/i, "Toyoko Inn");
  if (local.includes("桜通")) text = text.replace(/Sakura\s+Dori\b/i, "Sakuradori");
  if (local.includes("口")) text = text.replace(/\s+Guchi\b/i, "-guchi");
  const endings: [string, RegExp, string][] = [
    ["タワー", /\s*Tawa$/i, " Tower"],
    ["城", /\s*Jo$/i, " Castle"],
    ["駅", /\s*Eki$/i, " Station"],
    ["神社", /\s*Jinja$/i, " Shrine"],
    ["寺", /\s*(?:Ji|Tera)$/i, " Temple"],
  ];
  for (const [ending, pattern, english] of endings) {
    if (!local.endsWith(ending) || !pattern.test(text)) continue;
    return `${text.replace(pattern, "").trim()}${english}`.replace(/\s+/g, " ").trim();
  }
  if (local.includes("七宝") && local.includes("参考館")) {
    text = text
      .replace(/\bDai\s+Kichi\b/i, "Daikichi")
      .replace(/\bBijutsu\b/i, "Art")
      .replace(/\bShippoyaki\b/i, "Cloisonne")
      .replace(/\bSanko\s+Kan\b/i, "Reference Museum")
      .replace(/\bArt\s+Cloisonne\b/i, "Cloisonne Art");
  }
  return text.replace(/\s+/g, " ").trim();
}

function polishChinese(local: string, romanized: string): string {
  const rows: [string, RegExp, string][] = [
    ["博物馆", /\s*Bo Wu Guan$/i, " Museum"],
    ["美术馆", /\s*Mei Shu Guan$/i, " Art Museum"],
    ["纪念馆", /\s*Ji Nian Guan$/i, " Memorial"],
    ["祠", /\s*Ci$/i, " Shrine"],
    ["寺", /\s*Si$/i, " Temple"],
    ["塔", /\s*Ta$/i, " Tower"],
    ["站", /\s*Zhan$/i, " Station"],
    ["宫", /\s*Gong$/i, " Palace"],
  ];
  for (const [ending, pattern, english] of rows) {
    if (!local.endsWith(ending) || !pattern.test(romanized)) continue;
    const stem = romanized.replace(pattern, "").trim();
    const parts = stem.split(/\s+/).filter(Boolean);
    const joined = parts.length > 0 && parts.length <= 3 && parts.every((part) => part.length <= 4) ? parts.join("") : stem;
    const tidyStem = joined ? joined.charAt(0).toUpperCase() + joined.slice(1).toLowerCase() : joined;
    return `${tidyStem}${english}`.trim();
  }
  return romanized;
}

function polishKorean(local: string, romanized: string): string {
  if (local.endsWith("궁") && !/palace/i.test(romanized)) return `${romanized} Palace`;
  if (local.endsWith("역") && !/station/i.test(romanized)) return `${romanized.replace(/\s*Yeok$/i, "").trim()} Station`;
  return romanized;
}

/** Japanese municipal addresses: city, ward, and block. The local line is stored separately. */
export function polishAddress(local: string, romanized: string, language: string): string {
  const text = romanized.replace(/\s+/g, " ").trim();
  if (language !== "ja" || !text || !local.trim()) return text;
  const normalized = local.includes("本丸") ? text.replace(/\bHommaru\b/g, "Honmaru") : text;
  const ward = normalized.match(/^(.+?)\s+Shi\s+(.+?)\s+Ku\s+(.+?)\s+(\d+)\s*-\s*(\d+)$/i);
  if (ward) {
    const block = ward[3].replace(/\s+/g, "");
    return `${ward[4]}-${ward[5]} ${block}, ${ward[2]} Ward, ${ward[1]}`;
  }
  return normalized.replace(/\s+-\s+/g, "-");
}

export function readableName(place: { name?: string; displayName?: string }): string {
  const display = (place.displayName || "").replace(/\s+/g, " ").trim();
  if (display && !hasNonLatin(display)) return display;
  const name = (place.name || "").replace(/\s+/g, " ").trim();
  if (name && !hasNonLatin(name)) return name;
  return display || name;
}

export function localSubtitle(place: {
  name?: string;
  displayName?: string;
  displaySubtitle?: string;
  nameLocal?: string;
  localName?: string;
}): string {
  const lead = readableName(place);
  const explicit = (place.displaySubtitle || "").replace(/\s+/g, " ").trim();
  if (explicit && explicit !== lead) return explicit;
  const local = (place.nameLocal || place.localName || "").replace(/\s+/g, " ").trim();
  if (local && local !== lead) return local;
  const name = (place.name || "").replace(/\s+/g, " ").trim();
  if (hasNonLatin(name) && name !== lead) return name;
  return "";
}

/** Label passed to a local map app. Coordinates still do the routing. */
export function routeLabel(place: { name?: string; nameLocal?: string; localName?: string }): string {
  const local = (place.nameLocal || place.localName || "").replace(/\s+/g, " ").trim();
  if (local) return local;
  return (place.name || "").trim();
}

export function placeCopy(place: {
  description?: string;
  descriptionDisplay?: string;
  address?: string;
  addressDisplay?: string;
  addressLocal?: string;
}): { description: string; descriptionLocal: string; address: string; addressLocal: string } {
  const raw = (place.description || "").replace(/\s+/g, " ").trim();
  const english = (place.descriptionDisplay || "").replace(/\s+/g, " ").trim();
  const description = english || (!hasNonLatin(raw) ? raw : "");
  const descriptionLocal = raw && hasNonLatin(raw) && raw !== description ? raw : "";
  const addressRaw = (place.address || "").replace(/\s+/g, " ").trim();
  const addressEn = (place.addressDisplay || "").replace(/\s+/g, " ").trim();
  const address = (addressEn && !hasNonLatin(addressEn) ? addressEn : "") || (!hasNonLatin(addressRaw) ? addressRaw : "");
  const storedLocal = (place.addressLocal || (hasNonLatin(addressRaw) ? addressRaw : "")).replace(/\s+/g, " ").trim();
  return {
    description,
    descriptionLocal,
    address,
    addressLocal: storedLocal && storedLocal !== address ? storedLocal : "",
  };
}

export function placeMatches(place: {
  name?: string;
  nameLocal?: string;
  nameEn?: string;
  nameLatin?: string;
  nameEnglish?: string;
  nameRomanized?: string;
  displayName?: string;
  displaySubtitle?: string;
  localName?: string;
}, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [place.name, place.nameLocal, place.localName, place.nameEn, place.nameLatin, place.nameEnglish, place.nameRomanized, place.displayName, place.displaySubtitle]
    .some((field) => (field ?? "").toLowerCase().includes(needle));
}

const LATIN_LANG = new Set(["en", "fr", "de", "es", "it", "pt", "nl", "ms", "id", "vi", "pl", "sv", "no", "da", "fi", "cs", "hu", "ro", "tr", "ca"]);

/** Official languages for the destination, not a random Wikidata label. */
export function destinationLanguages(countryCode: string): string[] {
  const country = countryCode.toUpperCase();
  const table: Record<string, string[]> = {
    FR: ["fr"],
    MC: ["fr"],
    BE: ["nl", "fr"],
    CH: ["de", "fr", "it"],
    DE: ["de"],
    AT: ["de"],
    IT: ["it"],
    ES: ["es"],
    PT: ["pt"],
    NL: ["nl"],
    LU: ["fr", "de"],
    JP: ["ja"],
    KR: ["ko"],
    CN: ["zh", "zh-hans", "zh-cn"],
    TW: ["zh-hant", "zh-tw", "zh"],
    HK: ["zh-hant", "zh-hk", "zh"],
    MO: ["zh-hant", "zh"],
    SG: ["en", "ms", "zh", "ta"],
    MY: ["ms", "en", "zh"],
    TH: ["th"],
    VN: ["vi"],
    ID: ["id"],
    AE: ["ar", "en"],
    SA: ["ar"],
    RU: ["ru"],
    US: ["en"],
    GB: ["en"],
    AU: ["en"],
    CA: ["en", "fr"],
    IE: ["en"],
    NZ: ["en"],
  };
  return table[country] ?? ["en"];
}

/** A local subtitle has to be a language the destination actually uses. */
export function localNameFits(text: string, countryCode: string): boolean {
  const value = text.replace(/\s+/g, " ").trim();
  if (!value) return false;
  if (!countryCode.trim()) return true;
  const langs = destinationLanguages(countryCode);
  if (!hasNonLatin(value)) return langs.some((lang) => LATIN_LANG.has(lang.split("-")[0] ?? lang));
  const script = sourceLanguage(value, countryCode);
  if (script === "und") return false;
  if (script === "zh") return langs.some((lang) => lang === "zh" || lang.startsWith("zh-"));
  return langs.some((lang) => lang === script || lang.startsWith(`${script}-`));
}

export function tidyLocalLabel(value: string): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean || hasNonLatin(clean)) return clean.slice(0, 80);
  return (clean.charAt(0).toUpperCase() + clean.slice(1)).slice(0, 80);
}

/**
 * Keep a local name only when it belongs to the destination.
 * A Japanese or Chinese label is not the local name of a French place.
 */
export function destinationLocalName(input: {
  name?: string;
  nameEn?: string;
  nameLocal?: string;
  countryCode?: string;
}): { name: string; source: string } {
  const country = (input.countryCode || "").toUpperCase();
  const english = tidyLatin(input.nameEn || "");
  const ordered = [
    { value: input.nameLocal || "", source: "destination_language" },
    { value: input.name || "", source: "source_name" },
  ];
  for (const row of ordered) {
    const value = tidyLocalLabel(row.value);
    if (!value) continue;
    if (country && !localNameFits(value, country)) continue;
    if (english && value.toLowerCase() === english.toLowerCase()) continue;
    return { name: value, source: row.source };
  }
  return { name: "", source: "" };
}
