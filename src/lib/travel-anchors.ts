import type { PlaybookAnchor, PlaybookDayPattern, TravelPlaybook } from "@/lib/travel-playbook";
import { ensureDestinationKnowledge, knowledgeAnchors, knowledgePatterns, registerCuratedPacks } from "@/lib/travel-knowledge-pack";

/**
 * Canonical experience pools for major playbooks.
 * Each record is a place identity: name, local name, coordinates, Wikidata id when known,
 * experience groups, and which open sources agree it belongs here.
 * Guide prose is not stored. OpenStreetMap may confirm a place later. It does not have to introduce it.
 */

export type AnchorPack = {
  id: string;
  aliases: string[];
  anchors: PlaybookAnchor[];
  patterns: PlaybookDayPattern[];
  firstVisitGroups: string[];
};

type AnchorInput = {
  id: string;
  name: string;
  localName: string;
  lat: number;
  lng: number;
  areaId: string;
  areaName: string;
  groups: string[];
  tier: PlaybookAnchor["tier"];
  duration: number;
  category: PlaybookAnchor["category"];
  indoor?: boolean;
  excursion?: PlaybookAnchor["excursion"];
  wikidataId?: string;
  sources?: PlaybookAnchor["sources"];
};

function anchor(input: AnchorInput): PlaybookAnchor {
  return {
    id: input.id,
    name: input.name,
    localName: input.localName,
    lat: input.lat,
    lng: input.lng,
    areaId: input.areaId,
    areaName: input.areaName,
    groups: input.groups,
    tier: input.tier,
    duration: input.duration,
    category: input.category,
    indoor: input.indoor ?? false,
    excursion: input.excursion ?? "none",
    wikidataId: input.wikidataId,
    sources: input.sources ?? ["wikidata", "wikivoyage", "wikipedia"],
  };
}

function pattern(input: PlaybookDayPattern): PlaybookDayPattern {
  return input;
}

const tokyoAnchors: PlaybookAnchor[] = [
  anchor({ id: "tokyo-tower", name: "Tokyo Tower", localName: "東京タワー", lat: 35.6586, lng: 139.7454, areaId: "tokyo", areaName: "Tokyo", groups: ["landmark", "views"], tier: "core", duration: 75, category: "viewpoint", wikidataId: "Q267221" }),
  anchor({ id: "imperial-gardens", name: "Imperial Palace East Gardens", localName: "皇居東御苑", lat: 35.686, lng: 139.757, areaId: "tokyo", areaName: "Tokyo", groups: ["heritage", "nature"], tier: "strong", duration: 75, category: "garden" }),
  anchor({ id: "hamarikyu", name: "Hama-rikyu Gardens", localName: "浜離宮恩賜庭園", lat: 35.6597, lng: 139.7634, areaId: "tokyo", areaName: "Tokyo", groups: ["nature", "heritage"], tier: "strong", duration: 70, category: "garden" }),
  anchor({ id: "tsukiji", name: "Tsukiji Outer Market", localName: "築地場外市場", lat: 35.6654, lng: 139.7707, areaId: "tokyo", areaName: "Tokyo", groups: ["food", "neighbourhood"], tier: "strong", duration: 70, category: "shopping" }),
  anchor({ id: "teamlab", name: "teamLab Planets", localName: "チームラボプラネッツ", lat: 35.6494, lng: 139.7898, areaId: "tokyo", areaName: "Tokyo", groups: ["family", "landmark"], tier: "strong", duration: 90, category: "attraction", indoor: true }),
  anchor({ id: "senso-ji", name: "Senso-ji", localName: "浅草寺", lat: 35.7148, lng: 139.7967, areaId: "asakusa", areaName: "Asakusa", groups: ["heritage", "landmark"], tier: "core", duration: 80, category: "historic", wikidataId: "Q876342" }),
  anchor({ id: "nakamise", name: "Nakamise-dori", localName: "仲見世通り", lat: 35.7114, lng: 139.7963, areaId: "asakusa", areaName: "Asakusa", groups: ["neighbourhood", "food"], tier: "strong", duration: 45, category: "shopping" }),
  anchor({ id: "skytree", name: "Tokyo Skytree", localName: "東京スカイツリー", lat: 35.7101, lng: 139.8107, areaId: "asakusa", areaName: "Asakusa", groups: ["landmark", "views"], tier: "strong", duration: 80, category: "viewpoint", wikidataId: "Q213447" }),
  anchor({ id: "ueno-park", name: "Ueno Park", localName: "上野公園", lat: 35.7142, lng: 139.7714, areaId: "asakusa", areaName: "Asakusa", groups: ["nature", "family"], tier: "strong", duration: 70, category: "park" }),
  anchor({ id: "tokyo-national", name: "Tokyo National Museum", localName: "東京国立博物館", lat: 35.7188, lng: 139.7765, areaId: "asakusa", areaName: "Asakusa", groups: ["heritage", "museum"], tier: "strong", duration: 90, category: "museum", indoor: true, wikidataId: "Q653433" }),
  anchor({ id: "ueno-zoo", name: "Ueno Zoo", localName: "上野動物園", lat: 35.7164, lng: 139.7714, areaId: "asakusa", areaName: "Asakusa", groups: ["family", "nature"], tier: "strong", duration: 120, category: "zoo", wikidataId: "Q1365095" }),
  anchor({ id: "shibuya-crossing", name: "Shibuya Crossing", localName: "渋谷スクランブル交差点", lat: 35.6595, lng: 139.7004, areaId: "shibuya", areaName: "Shibuya and Harajuku", groups: ["neighbourhood", "landmark"], tier: "core", duration: 40, category: "landmark", wikidataId: "Q1152535" }),
  anchor({ id: "meiji", name: "Meiji Jingu", localName: "明治神宮", lat: 35.6764, lng: 139.6993, areaId: "shibuya", areaName: "Shibuya and Harajuku", groups: ["heritage", "nature"], tier: "core", duration: 75, category: "historic", wikidataId: "Q182763" }),
  anchor({ id: "takeshita", name: "Takeshita Street", localName: "竹下通り", lat: 35.6716, lng: 139.7028, areaId: "shibuya", areaName: "Shibuya and Harajuku", groups: ["neighbourhood"], tier: "strong", duration: 45, category: "shopping" }),
  anchor({ id: "yoyogi", name: "Yoyogi Park", localName: "代々木公園", lat: 35.6717, lng: 139.6964, areaId: "shibuya", areaName: "Shibuya and Harajuku", groups: ["nature"], tier: "optional", duration: 60, category: "park", wikidataId: "Q1120470" }),
  anchor({ id: "shinjuku-gyoen", name: "Shinjuku Gyoen", localName: "新宿御苑", lat: 35.6852, lng: 139.71, areaId: "shibuya", areaName: "Shibuya and Harajuku", groups: ["nature"], tier: "strong", duration: 70, category: "garden", wikidataId: "Q750886" }),
  anchor({ id: "kotokuin", name: "Kotoku-in", localName: "高徳院", lat: 35.3168, lng: 139.5357, areaId: "kamakura", areaName: "Kamakura", groups: ["heritage", "landmark"], tier: "core", duration: 60, category: "historic", excursion: "full", wikidataId: "Q848358" }),
  anchor({ id: "hachimangu", name: "Tsurugaoka Hachimangu", localName: "鶴岡八幡宮", lat: 35.326, lng: 139.5565, areaId: "kamakura", areaName: "Kamakura", groups: ["heritage", "neighbourhood"], tier: "core", duration: 70, category: "historic", excursion: "full", wikidataId: "Q1060676" }),
  anchor({ id: "hasedera", name: "Hasedera", localName: "長谷寺", lat: 35.3126, lng: 139.5334, areaId: "kamakura", areaName: "Kamakura", groups: ["heritage"], tier: "strong", duration: 50, category: "historic", excursion: "full" }),
  anchor({ id: "lake-ashi", name: "Lake Ashi", localName: "芦ノ湖", lat: 35.204, lng: 139.026, areaId: "hakone", areaName: "Hakone", groups: ["nature", "views"], tier: "core", duration: 80, category: "viewpoint", excursion: "full" }),
  anchor({ id: "hakone-shrine", name: "Hakone Shrine", localName: "箱根神社", lat: 35.2044, lng: 139.0256, areaId: "hakone", areaName: "Hakone", groups: ["heritage", "nature"], tier: "strong", duration: 50, category: "historic", excursion: "full" }),
  anchor({ id: "owakudani", name: "Owakudani", localName: "大涌谷", lat: 35.243, lng: 139.019, areaId: "hakone", areaName: "Hakone", groups: ["nature"], tier: "strong", duration: 70, category: "viewpoint", excursion: "full" }),
];

const parisAnchors: PlaybookAnchor[] = [
  anchor({ id: "notre-dame", name: "Notre-Dame", localName: "Notre-Dame de Paris", lat: 48.853, lng: 2.3499, areaId: "paris", areaName: "Paris", groups: ["heritage", "landmark"], tier: "core", duration: 60, category: "historic", wikidataId: "Q2981", sources: ["wikidata", "wikivoyage", "wikipedia", "tourism-board"] }),
  anchor({ id: "sainte-chapelle", name: "Sainte-Chapelle", localName: "Sainte-Chapelle", lat: 48.8554, lng: 2.345, areaId: "paris", areaName: "Paris", groups: ["heritage"], tier: "strong", duration: 50, category: "historic", indoor: true, wikidataId: "Q187992" }),
  anchor({ id: "eiffel", name: "Eiffel Tower", localName: "Tour Eiffel", lat: 48.8584, lng: 2.2945, areaId: "eiffel", areaName: "Eiffel and the Seine", groups: ["landmark", "views"], tier: "core", duration: 90, category: "landmark", wikidataId: "Q243" }),
  anchor({ id: "champ-de-mars", name: "Champ de Mars", localName: "Champ-de-Mars", lat: 48.8556, lng: 2.2986, areaId: "eiffel", areaName: "Eiffel and the Seine", groups: ["neighbourhood", "nature"], tier: "strong", duration: 40, category: "park", wikidataId: "Q189674" }),
  anchor({ id: "trocadero", name: "Trocadero", localName: "Trocadéro", lat: 48.862, lng: 2.2875, areaId: "eiffel", areaName: "Eiffel and the Seine", groups: ["views", "landmark"], tier: "strong", duration: 40, category: "viewpoint" }),
  anchor({ id: "louvre", name: "Louvre Museum", localName: "Musée du Louvre", lat: 48.8606, lng: 2.3376, areaId: "louvre", areaName: "Louvre and the Tuileries", groups: ["heritage", "landmark"], tier: "core", duration: 150, category: "museum", indoor: true, wikidataId: "Q19675" }),
  anchor({ id: "tuileries", name: "Tuileries Garden", localName: "Jardin des Tuileries", lat: 48.8634, lng: 2.3275, areaId: "louvre", areaName: "Louvre and the Tuileries", groups: ["nature", "neighbourhood"], tier: "strong", duration: 50, category: "garden", wikidataId: "Q182339" }),
  anchor({ id: "orsay", name: "Musee d'Orsay", localName: "Musée d'Orsay", lat: 48.86, lng: 2.3266, areaId: "louvre", areaName: "Louvre and the Tuileries", groups: ["heritage"], tier: "strong", duration: 90, category: "museum", indoor: true, wikidataId: "Q23402" }),
  anchor({ id: "vosges", name: "Place des Vosges", localName: "Place des Vosges", lat: 48.8556, lng: 2.3655, areaId: "marais", areaName: "The Marais", groups: ["neighbourhood", "heritage"], tier: "core", duration: 40, category: "landmark" }),
  anchor({ id: "pompidou", name: "Centre Pompidou", localName: "Centre Pompidou", lat: 48.8606, lng: 2.3522, areaId: "marais", areaName: "The Marais", groups: ["heritage"], tier: "strong", duration: 80, category: "museum", indoor: true }),
  anchor({ id: "rue-mouffetard", name: "Rue Mouffetard", localName: "Rue Mouffetard", lat: 48.8422, lng: 2.3496, areaId: "marais", areaName: "The Marais", groups: ["food", "neighbourhood"], tier: "strong", duration: 50, category: "shopping" }),
  anchor({ id: "sacre-coeur", name: "Sacre-Coeur", localName: "Sacré-Cœur", lat: 48.8867, lng: 2.3431, areaId: "paris", areaName: "Paris", groups: ["heritage", "views"], tier: "strong", duration: 60, category: "historic", wikidataId: "Q193123" }),
  anchor({ id: "versailles", name: "Palace of Versailles", localName: "Château de Versailles", lat: 48.8049, lng: 2.1204, areaId: "versailles", areaName: "Versailles", groups: ["heritage", "landmark"], tier: "core", duration: 150, category: "historic", indoor: true, excursion: "full", wikidataId: "Q2946" }),
  anchor({ id: "versailles-gardens", name: "Gardens of Versailles", localName: "Parc de Versailles", lat: 48.8046, lng: 2.11, areaId: "versailles", areaName: "Versailles", groups: ["nature", "heritage"], tier: "strong", duration: 70, category: "garden", excursion: "full" }),
];

const chengduAnchors: PlaybookAnchor[] = [
  anchor({ id: "wuhou", name: "Wuhou Shrine", localName: "武侯祠", lat: 30.646, lng: 104.048, areaId: "chengdu", areaName: "Chengdu", groups: ["heritage"], tier: "core", duration: 70, category: "historic" }),
  anchor({ id: "jinli", name: "Jinli", localName: "锦里", lat: 30.645, lng: 104.049, areaId: "chengdu", areaName: "Chengdu", groups: ["neighbourhood", "food"], tier: "core", duration: 60, category: "shopping" }),
  anchor({ id: "kuanzhai", name: "Kuanzhai Alley", localName: "宽窄巷子", lat: 30.669, lng: 104.044, areaId: "chengdu", areaName: "Chengdu", groups: ["neighbourhood", "food", "heritage"], tier: "core", duration: 70, category: "shopping" }),
  anchor({ id: "peoples-park", name: "People's Park", localName: "人民公园", lat: 30.659, lng: 104.058, areaId: "chengdu", areaName: "Chengdu", groups: ["neighbourhood", "food"], tier: "strong", duration: 60, category: "park" }),
  anchor({ id: "panda", name: "Chengdu Research Base of Giant Panda Breeding", localName: "成都大熊猫繁育研究基地", lat: 30.733, lng: 104.146, areaId: "panda", areaName: "Panda base", groups: ["wildlife", "family", "nature"], tier: "core", duration: 150, category: "zoo", excursion: "half" }),
  anchor({ id: "dujiangyan", name: "Dujiangyan", localName: "都江堰", lat: 30.998, lng: 103.617, areaId: "dujiangyan", areaName: "Dujiangyan", groups: ["heritage", "nature"], tier: "core", duration: 90, category: "historic", excursion: "full" }),
  anchor({ id: "qingcheng", name: "Mount Qingcheng", localName: "青城山", lat: 30.9, lng: 103.567, areaId: "dujiangyan", areaName: "Dujiangyan", groups: ["nature", "heritage"], tier: "strong", duration: 120, category: "park", excursion: "full" }),
  anchor({ id: "leshan", name: "Leshan Giant Buddha", localName: "乐山大佛", lat: 29.5447, lng: 103.769, areaId: "leshan", areaName: "Leshan", groups: ["heritage", "landmark"], tier: "core", duration: 90, category: "historic", excursion: "full", wikidataId: "Q33761" }),
];

export const ANCHOR_PACKS: AnchorPack[] = [
  {
    id: "tokyo",
    aliases: ["tokyo"],
    firstVisitGroups: ["heritage", "neighbourhood", "landmark", "food", "nature"],
    anchors: tokyoAnchors,
    patterns: [
      pattern({ id: "tokyo-centre", theme: "Central Tokyo", areaIds: ["tokyo"], requiredGroups: ["landmark", "heritage"], anchorIds: ["tokyo-tower", "imperial-gardens", "hamarikyu", "tsukiji"], optionalGroups: ["food", "family"], visitMode: "STAY", expectedMinutes: 300, mealContext: "market", evidence: ["Wikivoyage Tokyo", "Wikidata", "Tokyo Tourism"] }),
      pattern({ id: "tokyo-east", theme: "Historic East Tokyo", areaIds: ["asakusa"], requiredGroups: ["heritage", "neighbourhood"], anchorIds: ["senso-ji", "nakamise", "skytree", "tokyo-national"], optionalGroups: ["views", "family"], visitMode: "STAY", expectedMinutes: 360, evidence: ["Wikivoyage Tokyo", "Wikidata", "Tokyo Tourism"] }),
      pattern({ id: "tokyo-west", theme: "Shibuya and Harajuku", areaIds: ["shibuya"], requiredGroups: ["neighbourhood", "heritage"], anchorIds: ["shibuya-crossing", "meiji", "takeshita", "yoyogi"], optionalGroups: ["nature"], visitMode: "STAY", expectedMinutes: 330, evidence: ["Wikivoyage Tokyo", "Wikidata"] }),
      pattern({ id: "tokyo-kamakura", theme: "Temples of Kamakura", areaIds: ["kamakura"], requiredGroups: ["heritage"], anchorIds: ["kotokuin", "hachimangu", "hasedera"], optionalGroups: ["neighbourhood"], visitMode: "DAY_TRIP", expectedMinutes: 360, evidence: ["Wikivoyage Tokyo", "Wikidata"] }),
      pattern({ id: "tokyo-hakone", theme: "Hakone", areaIds: ["hakone"], requiredGroups: ["nature"], anchorIds: ["lake-ashi", "hakone-shrine", "owakudani"], optionalGroups: ["heritage", "views"], visitMode: "EXCURSION", expectedMinutes: 360, evidence: ["Wikivoyage Japan", "Wikidata"] }),
    ],
  },
  {
    id: "paris",
    aliases: ["paris"],
    firstVisitGroups: ["heritage", "landmark", "neighbourhood", "food"],
    anchors: parisAnchors,
    patterns: [
      pattern({ id: "paris-centre", theme: "Central Paris", areaIds: ["paris"], requiredGroups: ["heritage", "landmark"], anchorIds: ["notre-dame", "sainte-chapelle", "sacre-coeur"], optionalGroups: ["views"], visitMode: "STAY", expectedMinutes: 300, evidence: ["Wikivoyage Paris", "Wikidata"] }),
      pattern({ id: "paris-eiffel", theme: "Eiffel and the Seine", areaIds: ["eiffel"], requiredGroups: ["landmark", "views"], anchorIds: ["eiffel", "champ-de-mars", "trocadero"], optionalGroups: ["nature"], visitMode: "STAY", expectedMinutes: 300, evidence: ["Wikivoyage Paris", "Wikidata"] }),
      pattern({ id: "paris-louvre", theme: "Louvre and the Tuileries", areaIds: ["louvre"], requiredGroups: ["heritage"], anchorIds: ["louvre", "tuileries", "orsay"], optionalGroups: ["nature"], visitMode: "STAY", expectedMinutes: 360, evidence: ["Wikivoyage Paris", "Wikidata"] }),
      pattern({ id: "paris-marais", theme: "The Marais", areaIds: ["marais"], requiredGroups: ["neighbourhood", "heritage"], anchorIds: ["vosges", "pompidou", "rue-mouffetard"], optionalGroups: ["food"], visitMode: "STAY", expectedMinutes: 300, mealContext: "market street", evidence: ["Wikivoyage Paris"] }),
      pattern({ id: "paris-versailles", theme: "Versailles", areaIds: ["versailles"], requiredGroups: ["heritage"], anchorIds: ["versailles", "versailles-gardens"], optionalGroups: ["nature"], visitMode: "DAY_TRIP", expectedMinutes: 360, evidence: ["Wikivoyage Paris", "Wikidata"] }),
    ],
  },
  {
    id: "chengdu",
    aliases: ["chengdu"],
    firstVisitGroups: ["heritage", "neighbourhood", "wildlife", "food"],
    anchors: chengduAnchors,
    patterns: [
      pattern({ id: "chengdu-old", theme: "Historic Chengdu", areaIds: ["chengdu"], requiredGroups: ["heritage", "neighbourhood"], anchorIds: ["wuhou", "jinli", "kuanzhai"], optionalGroups: ["food"], visitMode: "STAY", expectedMinutes: 330, mealContext: "alley food", evidence: ["Wikivoyage Chengdu", "Wikipedia"] }),
      pattern({ id: "chengdu-park", theme: "Teahouses and the park", areaIds: ["chengdu"], requiredGroups: ["neighbourhood", "food"], anchorIds: ["peoples-park", "kuanzhai"], optionalGroups: ["heritage"], visitMode: "STAY", expectedMinutes: 280, evidence: ["Wikivoyage Chengdu"] }),
      pattern({ id: "chengdu-panda", theme: "Panda base", areaIds: ["panda"], requiredGroups: ["wildlife"], anchorIds: ["panda"], optionalGroups: ["family", "nature"], visitMode: "EXCURSION", expectedMinutes: 240, evidence: ["Wikivoyage Chengdu", "Wikipedia"] }),
      pattern({ id: "chengdu-dujiangyan", theme: "Dujiangyan and Qingcheng", areaIds: ["dujiangyan"], requiredGroups: ["heritage", "nature"], anchorIds: ["dujiangyan", "qingcheng"], optionalGroups: [], visitMode: "DAY_TRIP", expectedMinutes: 360, evidence: ["Wikivoyage Chengdu"] }),
      pattern({ id: "chengdu-leshan", theme: "Leshan", areaIds: ["leshan"], requiredGroups: ["heritage"], anchorIds: ["leshan"], optionalGroups: ["landmark"], visitMode: "DAY_TRIP", expectedMinutes: 300, evidence: ["Wikivoyage Chengdu", "Wikidata"] }),
    ],
  },
];

registerCuratedPacks(ANCHOR_PACKS);

export function packFor(destinationOrId: string): AnchorPack | null {
  const key = destinationOrId.trim().toLowerCase();
  const head = key.split(",")[0]?.trim() ?? key;
  return ANCHOR_PACKS.find((pack) => pack.id === key || pack.id === head || pack.aliases.includes(key) || pack.aliases.includes(head)) ?? null;
}

export function attachExperience(book: TravelPlaybook): TravelPlaybook {
  if (book.anchors?.length && book.patterns?.length) return book;
  const known = ensureDestinationKnowledge(book.destinationName) ?? ensureDestinationKnowledge(book.id);
  const pack = packFor(book.id) ?? packFor(book.destinationName);
  const anchors = book.anchors?.length ? book.anchors : known?.anchors.length ? known.anchors : pack?.anchors ?? [];
  const patterns = book.patterns?.length ? book.patterns : known?.dayPatterns.length ? known.dayPatterns : pack?.patterns ?? [];
  const firstVisitGroups = book.firstVisitGroups?.length ? book.firstVisitGroups : known?.experienceGroups.length ? known.experienceGroups : pack?.firstVisitGroups ?? [];
  if (!anchors.length && !patterns.length) return book;
  return { ...book, anchors, patterns, firstVisitGroups };
}

export function anchorsForDestination(destination: string): PlaybookAnchor[] {
  const known = knowledgeAnchors(destination);
  if (known.length) return known;
  return packFor(destination)?.anchors ?? [];
}

export function themeForArea(area: string, destination: string): string {
  const patterns = knowledgePatterns(destination);
  const needle = area.trim().toLowerCase();
  if (needle) {
    const known = patterns.find((item) => item.areaIds.some((id) => id === needle) || item.theme.toLowerCase() === needle || item.theme.toLowerCase().includes(needle));
    if (known) return known.theme;
  }
  const pack = packFor(destination);
  if (!pack) return "";
  if (!needle) return "";
  const hit = pack.patterns.find((item) => item.areaIds.some((id) => id === needle) || item.theme.toLowerCase() === needle || item.theme.toLowerCase().includes(needle));
  return hit?.theme ?? "";
}

export function patternForArea(areaId: string, destinationOrBook: string): PlaybookDayPattern | null {
  const pack = packFor(destinationOrBook);
  if (!pack) return null;
  return pack.patterns.find((item) => item.areaIds.includes(areaId)) ?? null;
}
