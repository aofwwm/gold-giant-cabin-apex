/** Traveller-facing place copy. Scores come from category and verified text, not from reviews. */

import { distanceMeters } from "@/lib/coord";

export type ExperienceKey =
  | "views"
  | "culture"
  | "history"
  | "architecture"
  | "nature"
  | "food"
  | "family"
  | "romance"
  | "shopping"
  | "nightlife"
  | "photography";

export type PlaceStory = {
  shortDescription: string;
  whyIconic: string;
  whyGo: string;
  signatureExperiences: string[];
  bestFor: string[];
  experienceProfile: Partial<Record<ExperienceKey, number>>;
  suggestedVisitMinutes: number;
  visitLabel: string;
  bestTime?: string;
  effort?: string;
  indoorOutdoor?: "indoor" | "outdoor" | "mixed";
  nearbyCombos: string[];
  sourceConfidence: "verified" | "category" | "thin";
  descriptionSource: string;
  imageSource: string;
  hoursSource: string;
  localNameSource: string;
  factSource: string;
};

export type StoryInput = {
  id?: string;
  name: string;
  displayName?: string;
  nameEn?: string;
  category: string;
  indoor?: boolean;
  importance?: string;
  description?: string;
  extract?: string;
  opening?: string;
  city?: string;
  localNameSource?: string;
  imageSource?: string;
  lat?: number;
  lng?: number;
};

const FILLER = /popular tourist destination|worth visiting|nice place to|famous place in|open place list|private ranking|major attraction worth|a must-see|iconic stop from|a nice place/i;
const FOOD = new Set(["restaurant", "cafe", "nightlife", "market"]);

export function isGenericCopy(text: string): boolean {
  const value = text.replace(/\s+/g, " ").trim();
  if (value.length < 24) return true;
  return FILLER.test(value);
}

export function isLocator(text: string): boolean {
  const value = text.replace(/\s+/g, " ").trim();
  if (value.length > 110) return false;
  return /\b(located|situated)\b/i.test(value) || /^[\w\s'"’.-]{0,48}\bin\b\s+[A-Z]/i.test(value);
}

export function acceptExperienceLine(line: string, facts: string): boolean {
  const text = line.replace(/\s+/g, " ").trim();
  if (!text || isGenericCopy(text) || isLocator(text)) return false;
  const years = text.match(/\b(?:1[0-9]{3}|20[0-9]{2})\b/g) ?? [];
  return years.every((year) => facts.includes(year));
}

const DAY: Record<string, string> = { Mo: "Mon", Tu: "Tue", We: "Wed", Th: "Thu", Fr: "Fri", Sa: "Sat", Su: "Sun" };

function clockLabel(value: string): string {
  const [hourRaw, minuteRaw] = value.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value;
  const wrapped = ((hour % 24) + 24) % 24;
  const suffix = wrapped >= 12 ? "PM" : "AM";
  const twelve = wrapped % 12 || 12;
  return `${twelve}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/** A readable slice of OSM opening_hours. Unparsed syntax stays out of the main card. */
export function formatOpeningHours(raw: string): { summary: string; seasonal: boolean } {
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) return { summary: "", seasonal: false };
  const parts = text.split(";").map((part) => part.trim()).filter(Boolean);
  const seasonal = parts.length > 1 || /[A-Z][a-z]{2}\s+\d/.test(text) || /\boff\b/i.test(text);
  const first = parts[0] ?? "";
  const day = first.match(/\b(Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(Mo|Tu|We|Th|Fr|Sa|Su))?\b/);
  const time = first.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!time) return { summary: "", seasonal };
  const days = !day ? "Daily" : day[2] ? `${DAY[day[1]]}–${DAY[day[2]]}` : DAY[day[1]];
  const range = `${clockLabel(time[1])} – ${clockLabel(time[2])}`;
  return { summary: days === "Daily" ? range : `${days} ${range}`, seasonal };
}

export function hoursLine(opening: string | undefined): string {
  const parsed = formatOpeningHours(opening || "");
  if (!parsed.summary) return "";
  return parsed.seasonal ? `${parsed.summary}. Seasonal hours may vary.` : parsed.summary;
}

function cleanExtract(text: string): string {
  return text.replace(/\s*\([^)]*[:[\]][^)]*\)/g, "").replace(/\s+/g, " ").trim();
}

function sentences(text: string): string[] {
  return text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/).map((part) => part.trim()).filter((part) => part.length > 24).slice(0, 3);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function iconicFromExtract(name: string, city: string, extract: string): string {
  const parts = sentences(extract);
  if (!parts.length) return "";
  let lead = parts[0] ?? "";
  const prefix = new RegExp(`^(?:the\\s+)?${escapeRegExp(name.trim())}\\s+is\\s+`, "i");
  if (prefix.test(lead)) {
    lead = lead.replace(prefix, "");
    lead = lead.charAt(0).toUpperCase() + lead.slice(1);
  }
  const second = parts[1] ?? "";
  const fact = second.match(/(named after [^.]{3,90}|built [^.]{0,24}\d{4}[^.]{0,48}|designed [^.]{3,90})/i);
  let text = lead.replace(/\.$/, "");
  if (fact) {
    const bit = fact[1].trim().replace(/\.$/, "");
    if (!text.toLowerCase().includes(bit.slice(0, 16).toLowerCase())) text = `${text}, ${bit.charAt(0).toLowerCase()}${bit.slice(1)}`;
  }
  if (city) text = text.replace(new RegExp(`,?\\s+in\\s+${escapeRegExp(city)}(?:,\\s+[A-Za-z][A-Za-z .'-]{1,24})?`, "i"), "");
  text = text.replace(/\s+/g, " ").trim();
  if (text.length > 280) text = text.slice(0, 277).replace(/\s+\S*$/, "").trim();
  if (!text) return "";
  if (!/[.!?]$/.test(text)) text += ".";
  return text;
}

function bump(scores: Partial<Record<ExperienceKey, number>>, key: ExperienceKey, value: number): void {
  scores[key] = Math.max(scores[key] ?? 0, value);
}

export function experienceProfile(input: StoryInput): Partial<Record<ExperienceKey, number>> {
  const category = input.category;
  const text = `${category} ${input.name} ${input.description ?? ""} ${input.extract ?? ""}`.toLowerCase();
  const scores: Partial<Record<ExperienceKey, number>> = {};
  if (FOOD.has(category)) {
    bump(scores, "food", 4);
    if (category === "nightlife" || /bar|wine|evening|romantic/.test(text)) bump(scores, "romance", 3);
    if (/family|kids/.test(text)) bump(scores, "family", 3);
    return Object.fromEntries(Object.entries(scores).filter(([, value]) => (value ?? 0) >= 3)) as Partial<Record<ExperienceKey, number>>;
  }
  if (category === "viewpoint" || /tower|observation|panorama|overlook|deck|ferris/.test(text)) {
    bump(scores, "views", 5);
    bump(scores, "photography", 5);
    bump(scores, "architecture", category === "viewpoint" ? 3 : 5);
  }
  if (category === "museum" || /museum|gallery|collection/.test(text)) {
    bump(scores, "culture", 5);
    bump(scores, "history", 4);
    bump(scores, "architecture", 3);
    bump(scores, "family", 3);
  }
  if (category === "historic" || /palace|castle|cathedral|temple|shrine|heritage|monument|basilica/.test(text)) {
    bump(scores, "history", 5);
    bump(scores, "architecture", 4);
    bump(scores, "culture", 4);
  }
  if (category === "park" || category === "garden" || category === "beach" || /park|garden|lawn|greenspace|green space|promenade/.test(text)) {
    bump(scores, "nature", category === "beach" ? 4 : 5);
    bump(scores, "photography", 4);
    if (/view|tower|skyline|panorama|overlook/.test(text)) bump(scores, "views", 4);
  }
  if (category === "zoo" || category === "aquarium" || /panda|wildlife|zoo|aquarium|safari/.test(text)) {
    bump(scores, "nature", 4);
    bump(scores, "family", 5);
  }
  if (category === "shopping" || category === "market") bump(scores, "shopping", 4);
  if (category === "nightlife") bump(scores, "nightlife", 4);
  if ((scores.views ?? 0) >= 4 && ((scores.architecture ?? 0) >= 4 || /seine|sunset|evening|night/.test(text))) bump(scores, "romance", 4);
  if (category === "park" || category === "garden" || category === "zoo" || category === "theme_park") bump(scores, "family", 4);
  return Object.fromEntries(Object.entries(scores).filter(([, value]) => (value ?? 0) >= 3)) as Partial<Record<ExperienceKey, number>>;
}

function joinAnd(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function whyGoFromProfile(profile: Partial<Record<ExperienceKey, number>>, category: string, text: string): string {
  if (FOOD.has(category)) return category === "nightlife" ? "Go for the atmosphere and a meal out." : "Go for the food. Check the latest reviews before you commit.";
  if (category === "zoo" || category === "aquarium" || /panda|wildlife/.test(text)) return "Go for the animals. Plan it as a slow visit, not a quick look.";
  if (category === "museum" && (profile.culture ?? 0) >= 4) return "Go for the collections and the building. It needs time inside, not a photo stop.";
  if ((profile.nature ?? 0) >= 4 && (profile.views ?? 0) >= 3) return "Go for the green space and the view. It suits a walk, a pause, and photographs.";
  if ((profile.nature ?? 0) >= 4) return "Go for the open space. It suits walking, sitting, and photographs.";
  if ((profile.views ?? 0) >= 4 && (profile.architecture ?? 0) >= 4) return "Go for the views and the architecture. Evening light is part of the visit.";
  if ((profile.views ?? 0) >= 4) return "Go for the view. The reason to stop is what you can see from here.";
  if ((profile.history ?? 0) >= 4 && (profile.architecture ?? 0) >= 4) return "Go for the history you can walk through, and for the building itself.";
  if ((profile.history ?? 0) >= 4) return "Go for the history. Give it enough time to walk the site.";
  const bits: string[] = [];
  if ((profile.views ?? 0) >= 4) bits.push("the views");
  if ((profile.architecture ?? 0) >= 4) bits.push("the architecture");
  if ((profile.culture ?? 0) >= 4) bits.push("the culture");
  if ((profile.shopping ?? 0) >= 4) bits.push("a wander and the shops");
  if (!bits.length) return "";
  return `Go for ${joinAnd(bits)}.`;
}

function signatures(profile: Partial<Record<ExperienceKey, number>>, category: string): string[] {
  const items: string[] = [];
  if ((profile.views ?? 0) >= 4) items.push("Panoramic views");
  if ((profile.architecture ?? 0) >= 4) items.push(category === "historic" ? "Historic architecture" : "Architecture");
  if ((profile.culture ?? 0) >= 4 && category === "museum") items.push("Museum collections");
  else if ((profile.culture ?? 0) >= 4) items.push("Culture");
  if ((profile.history ?? 0) >= 4 && !items.includes("Historic architecture")) items.push("History");
  if ((profile.nature ?? 0) >= 4) items.push(category === "garden" ? "Garden walk" : "Green space");
  if ((profile.photography ?? 0) >= 4) items.push("Photography");
  if ((profile.food ?? 0) >= 4) items.push("Local food");
  if (category === "zoo" || category === "aquarium") items.push("Wildlife");
  return [...new Set(items)].slice(0, 4);
}

function bestFor(profile: Partial<Record<ExperienceKey, number>>, importance: string): string[] {
  const tags: string[] = [];
  if (importance === "iconic" || importance === "major") tags.push("First visit");
  if ((profile.views ?? 0) >= 4) tags.push("Views");
  if ((profile.photography ?? 0) >= 4) tags.push("Photography");
  if ((profile.architecture ?? 0) >= 4) tags.push("Architecture");
  if ((profile.history ?? 0) >= 4) tags.push("History");
  if ((profile.romance ?? 0) >= 4) tags.push("Couples");
  if ((profile.family ?? 0) >= 4) tags.push("Families");
  if ((profile.nature ?? 0) >= 4) tags.push("Nature");
  if ((profile.food ?? 0) >= 4) tags.push("Food");
  return tags.slice(0, 4);
}

export function visitPlan(category: string, importance: string, name: string): { minutes: number; label: string } {
  const label = name.toLowerCase();
  if (/versailles|forbidden city/.test(label)) return { minutes: 240, label: "Half day" };
  if (category === "theme_park") return { minutes: 240, label: "Half day" };
  if (category === "zoo" || category === "aquarium") return { minutes: 180, label: "2–3 hr" };
  if (category === "museum" && (importance === "iconic" || /louvre|palace|national museum/.test(label))) return { minutes: 150, label: "2–3 hr" };
  if (category === "museum") return { minutes: 90, label: "1.5–2 hr" };
  if (category === "viewpoint" || /tower/.test(label)) return { minutes: 120, label: "1.5–2.5 hr" };
  if (category === "park" || category === "garden") return { minutes: 75, label: "1–1.5 hr" };
  if (category === "beach") return { minutes: 120, label: "2–3 hr" };
  if (category === "historic" && importance === "iconic") return { minutes: 120, label: "1.5–2.5 hr" };
  if (category === "historic") return { minutes: 90, label: "1–2 hr" };
  if (FOOD.has(category)) return { minutes: 75, label: "1–1.5 hr" };
  return { minutes: 90, label: "1–2 hr" };
}

function setting(category: string, indoor: boolean): "indoor" | "outdoor" | "mixed" {
  if (category === "museum" || category === "aquarium") return indoor ? "indoor" : "mixed";
  if (category === "park" || category === "garden" || category === "beach" || category === "viewpoint") return "outdoor";
  if (indoor) return "indoor";
  return "mixed";
}

function bestTime(profile: Partial<Record<ExperienceKey, number>>, category: string, indoor: boolean): string {
  if ((profile.views ?? 0) >= 4 && !indoor && category !== "museum") return "Sunset or evening";
  if (category === "park" || category === "garden" || category === "beach") return "Daylight";
  return "";
}

function effort(category: string, indoor: boolean, name: string): string {
  if (category === "viewpoint" || /tower/.test(name)) return "Outdoor. Expect some walking, and stairs or a lift.";
  if (category === "park" || category === "garden" || category === "beach") return "Easy walking. Weather matters.";
  if (category === "zoo" || category === "theme_park") return "Mostly outdoor. Weather matters.";
  if (indoor || category === "museum") return "Mostly indoor.";
  return "";
}

export function buildPlaceStory(input: StoryInput, nearby: string[] = []): PlaceStory {
  const name = (input.displayName || input.nameEn || input.name).trim();
  const city = (input.city || "").trim();
  const extract = cleanExtract(input.extract || "");
  const factsInput = { ...input, extract };
  const description = (input.description || "").trim();
  const facts = `${extract} ${description}`;
  const profile = experienceProfile(factsInput);
  const visit = visitPlan(input.category, input.importance || "", name);
  const iconic = iconicFromExtract(name, city, extract);
  const whyIconic = iconic && acceptExperienceLine(iconic, facts) ? iconic : "";
  const whyGoRaw = whyGoFromProfile(profile, input.category, facts.toLowerCase());
  const whyGo = whyGoRaw && !isGenericCopy(whyGoRaw) ? whyGoRaw : "";
  const short = whyGo || whyIconic;
  const where = setting(input.category, Boolean(input.indoor));
  const time = bestTime(profile, input.category, Boolean(input.indoor));
  const practical = effort(input.category, Boolean(input.indoor), name);
  const confidence = extract ? "verified" : description && !isLocator(description) ? "category" : input.category ? "category" : "thin";
  return {
    shortDescription: short,
    whyIconic,
    whyGo,
    signatureExperiences: signatures(profile, input.category),
    bestFor: bestFor(profile, input.importance || ""),
    experienceProfile: profile,
    suggestedVisitMinutes: visit.minutes,
    visitLabel: visit.label,
    bestTime: time || undefined,
    effort: practical || undefined,
    indoorOutdoor: where,
    nearbyCombos: nearby.slice(0, 3),
    sourceConfidence: whyIconic ? "verified" : confidence,
    descriptionSource: extract ? "wikipedia_intro" : description ? "wikidata_description" : "",
    imageSource: input.imageSource || "",
    hoursSource: input.opening ? "openstreetmap" : "",
    localNameSource: input.localNameSource || "",
    factSource: extract ? "wikipedia" : description ? "wikidata" : "category",
  };
}

export function nearbyPlaceNames<T extends { id: string; name: string; displayName?: string; lat: number; lng: number; category: string; importance?: string }>(
  place: T,
  all: T[],
): string[] {
  return all
    .filter((other) => other.id !== place.id && other.category !== "stay" && other.category !== "transport" && !FOOD.has(other.category))
    .map((other) => ({ other, meters: distanceMeters(place.lat, place.lng, other.lat, other.lng) }))
    .filter((row) => row.meters > 30 && row.meters < 1400)
    .sort((a, b) => {
      const rank = (value?: string) => value === "iconic" ? 0 : value === "major" ? 1 : 2;
      return rank(a.other.importance) - rank(b.other.importance) || a.meters - b.meters;
    })
    .slice(0, 3)
    .map((row) => (row.other.displayName || row.other.name).trim())
    .filter(Boolean);
}

export const EXPERIENCE_LABEL: Record<ExperienceKey, string> = {
  views: "Views",
  culture: "Culture",
  history: "History",
  architecture: "Architecture",
  nature: "Nature",
  food: "Food",
  family: "Family",
  romance: "Romance",
  shopping: "Shopping",
  nightlife: "Nightlife",
  photography: "Photography",
};
