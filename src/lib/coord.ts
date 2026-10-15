import { AREAS, matchArea, SPOTS, type Diet, type Mood, type Spot, type Style } from "@/lib/directory";

export type MakanBrief = {
  location: string;
  areaId: string;
  groupSize: number;
  budget: 0 | 1 | 2 | 3;
  dietary: "" | Diet;
  minutes: 5 | 10 | 15 | 25;
  mood: "" | Mood;
  timing: "" | "before" | "after";
  cuisines: CuisineId[];
  placeTypes: PlaceKind[];
};

export type OutingBrief = {
  groupSize: number;
  budget: number;
  budgetMin?: number;
  areaId: string;
  areaLabel: string;
  when: string;
  hours: number;
  energy: "low" | "moderate" | "high";
  styles: Style[];
  avoid: string[];
  summary: string;
};

export type Hit = {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  area: string;
  lat: number;
  lng: number;
  minutes: number;
  meters: number;
  price: 0 | 1 | 2 | 3;
  approxSgd: number | null;
  dietary: Diet[];
  why: string;
  source: "directory" | "map";
  mapsUrl: string;
  verified?: boolean;
  cuisines?: CuisineId[];
  placeKind?: PlaceKind | "other";
  openingHours?: string;
  amenity?: string;
};

export type Stop = { id: string; name: string; address: string; note: string; lat: number; lng: number };

export type Concept = {
  id: string;
  personality: "Competitive" | "Creative" | "Chill";
  title: string;
  why: string;
  hours: number;
  approxSgd: number;
  pax: number;
  stops: Stop[];
  steps: string[];
};

const MINUTES = [5, 10, 15, 25] as const;

export function walkMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 80));
}

export function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const radius = 6371000;
  const p1 = (aLat * Math.PI) / 180;
  const p2 = (bLat * Math.PI) / 180;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function mapsLink(name: string, address: string): string {
  const query = encodeURIComponent(`${name} ${address}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function priceLabel(price: number, approx: number | null): string {
  if (approx === 0) return "Free to enter";
  if (approx) return `~$${approx}/pax`;
  if (price === 1) return "$";
  if (price === 2) return "$$";
  if (price === 3) return "$$$";
  return "Price not listed";
}

export const CUISINE_OPTIONS = [
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "korean", label: "Korean" },
  { id: "western", label: "Western" },
  { id: "indian", label: "Indian" },
  { id: "malay", label: "Malay" },
  { id: "thai", label: "Thai" },
  { id: "vietnamese", label: "Vietnamese" },
  { id: "italian", label: "Italian" },
  { id: "local", label: "Local" },
] as const;

export const MORE_CUISINES = [
  { id: "seafood", label: "Seafood" },
  { id: "indonesian", label: "Indonesian" },
  { id: "peranakan", label: "Peranakan" },
  { id: "middle_eastern", label: "Middle Eastern" },
  { id: "mexican", label: "Mexican" },
  { id: "french", label: "French" },
] as const;

export type CuisineId = (typeof CUISINE_OPTIONS)[number]["id"] | (typeof MORE_CUISINES)[number]["id"];

export const PLACE_TYPES = [
  { id: "restaurant", label: "Restaurant" },
  { id: "cafe", label: "Cafe" },
  { id: "hawker", label: "Hawker / Food Centre" },
  { id: "kopitiam", label: "Kopitiam" },
  { id: "bakery", label: "Bakery / Dessert" },
] as const;

export type PlaceKind = (typeof PLACE_TYPES)[number]["id"];
export type MakanSort = "closest" | "match" | "random" | "favourites";

export type MatchContext = {
  groupSize?: number;
  minutes?: number;
  budget?: 0 | 1 | 2 | 3;
  dietary?: string;
  mood?: string;
  meal?: string;
  cuisines?: CuisineId[];
  placeTypes?: PlaceKind[];
  favouriteKeys?: string[];
  seed?: number;
};

const CUISINE_IDS = new Set<string>([...CUISINE_OPTIONS, ...MORE_CUISINES].map((item) => item.id));

const TYPE_CUISINE: Record<string, CuisineId> = {
  chinese_restaurant: "chinese",
  japanese_restaurant: "japanese",
  sushi_restaurant: "japanese",
  ramen_restaurant: "japanese",
  korean_restaurant: "korean",
  indian_restaurant: "indian",
  thai_restaurant: "thai",
  vietnamese_restaurant: "vietnamese",
  italian_restaurant: "italian",
  pizza_restaurant: "italian",
  american_restaurant: "western",
  hamburger_restaurant: "western",
  steak_house: "western",
  seafood_restaurant: "seafood",
  indonesian_restaurant: "indonesian",
  french_restaurant: "french",
  mediterranean_restaurant: "western",
  middle_eastern_restaurant: "middle_eastern",
  turkish_restaurant: "middle_eastern",
  mexican_restaurant: "mexican",
  malaysian_restaurant: "malay",
};

const CUISINE_WORDS: Record<CuisineId, string[]> = {
  chinese: ["chinese", "szechuan", "sichuan", "cantonese", "dim sum", "dimsum", "teochew", "hokkien", "hakka", "dumpling", "xiao long bao", "zi char"],
  japanese: ["japanese", "sushi", "ramen", "izakaya", "donburi", "udon"],
  korean: ["korean", "korean bbq", "kbbq"],
  western: ["western", "american", "burger", "steak", "european", "british"],
  indian: ["indian", "biryani", "tandoor"],
  malay: ["malay", "malaysian", "nasi lemak"],
  thai: ["thai"],
  vietnamese: ["vietnamese", "pho"],
  italian: ["italian", "pizza", "pasta"],
  local: ["singaporean", "chicken rice", "laksa", "hainanese", "zi char", "economy rice"],
  seafood: ["seafood"],
  indonesian: ["indonesian", "nasi padang", "padang"],
  peranakan: ["peranakan", "nyonya"],
  middle_eastern: ["middle eastern", "lebanese", "turkish", "kebab"],
  mexican: ["mexican", "taco"],
  french: ["french"],
};

export function cuisineLabel(id: CuisineId): string {
  return [...CUISINE_OPTIONS, ...MORE_CUISINES].find((item) => item.id === id)?.label ?? id;
}

export function placeKindLabel(kind: PlaceKind | "other" | undefined): string {
  if (!kind || kind === "other") return "";
  return PLACE_TYPES.find((item) => item.id === kind)?.label ?? "";
}

export function isCuisineId(value: string): value is CuisineId {
  return CUISINE_IDS.has(value);
}

export function isPlaceKind(value: string): value is PlaceKind {
  return PLACE_TYPES.some((item) => item.id === value);
}

export function inferCuisines(text: string, types: string[] = [], name = ""): CuisineId[] {
  const found = new Set<CuisineId>();
  const blob = `${text} ${name}`.toLowerCase().replace(/[_-]+/g, " ");
  for (const [id, words] of Object.entries(CUISINE_WORDS) as [CuisineId, string[]][]) {
    if (words.some((word) => blob.includes(word))) found.add(id);
  }
  for (const type of types) {
    const mapped = TYPE_CUISINE[type];
    if (mapped) found.add(mapped);
  }
  return [...found];
}

export function classifyPlace(input: { types?: string[]; amenity?: string; name?: string }): PlaceKind | "other" {
  const name = (input.name ?? "").toLowerCase();
  const types = new Set(input.types ?? []);
  const amenity = input.amenity ?? "";
  if (/kopitiam|coffeeshop/.test(name) || /\bcoffee shop\b/.test(name)) return "kopitiam";
  if (/hawker|food ?court|food ?centre|food ?center/.test(name) || amenity === "food_court" || types.has("food_court")) return "hawker";
  if (
    types.has("bakery") ||
    types.has("dessert_shop") ||
    types.has("dessert_restaurant") ||
    types.has("ice_cream_shop") ||
    amenity === "bakery" ||
    amenity === "pastry" ||
    amenity === "confectionery" ||
    amenity === "ice_cream" ||
    /bakery|dessert|gelato|ice cream|cake shop/.test(name)
  ) {
    return "bakery";
  }
  if (types.has("cafe") || types.has("coffee_shop") || amenity === "cafe" || amenity === "coffee") return "cafe";
  if (types.has("restaurant") || amenity === "restaurant" || amenity === "fast_food" || [...types].some((type) => type.endsWith("_restaurant"))) {
    return "restaurant";
  }
  return "other";
}

export function annotatePlace(hit: Hit, extra: { cuisineText?: string; types?: string[]; amenity?: string } = {}): Hit {
  const cuisines = inferCuisines(extra.cuisineText ?? hit.cuisine ?? "", extra.types ?? [], hit.name);
  const placeKind = classifyPlace({ types: extra.types, amenity: extra.amenity, name: hit.name });
  const label = cuisines.map(cuisineLabel).join(" · ");
  return {
    ...hit,
    cuisines,
    placeKind,
    cuisine: label || (extra.cuisineText ? extra.cuisineText.replace(/_/g, " ") : ""),
  };
}

function cuisineOk(hit: Hit, selected: CuisineId[] | undefined): boolean {
  if (!selected?.length) return true;
  const have = hit.cuisines ?? [];
  if (!have.length) return false;
  return selected.some((id) => have.includes(id));
}

function placeOk(hit: Hit, selected: PlaceKind[] | undefined): boolean {
  if (!selected?.length) return true;
  if (!hit.placeKind || hit.placeKind === "other") return false;
  return selected.includes(hit.placeKind);
}

function favouriteHit(hit: Hit, keys: string[] | undefined): boolean {
  if (!keys?.length) return false;
  const key = hit.id || hit.name.toLowerCase();
  return keys.includes(key) || keys.includes(hit.name.toLowerCase());
}

function vibeFits(hit: Hit, mood: string | undefined): boolean {
  if (!mood) return false;
  if (mood === "coffee") return hit.placeKind === "cafe" || hit.placeKind === "kopitiam";
  if (mood === "comfortable") return hit.placeKind === "restaurant";
  if (mood === "quick") return hit.minutes <= 7 || hit.amenity === "fast_food";
  if (mood === "casual") return hit.placeKind === "hawker" || hit.placeKind === "kopitiam" || hit.placeKind === "cafe";
  return false;
}

export function bestMatchScore(hit: Hit, ctx: MatchContext = {}): number {
  let score = Math.max(0, 30 - Math.min(hit.minutes, 30)) * 4;
  score -= Math.min(hit.meters, 3000) / 250;
  const cuisines = ctx.cuisines ?? [];
  const places = ctx.placeTypes ?? [];
  if (cuisines.length && (hit.cuisines ?? []).some((id) => cuisines.includes(id))) score += 16;
  if (places.length && hit.placeKind && hit.placeKind !== "other" && places.includes(hit.placeKind)) score += 14;
  if (ctx.dietary && hit.dietary.includes(ctx.dietary as Diet)) score += 12;
  if (ctx.budget && hit.approxSgd != null && withinMakanBudget(hit.approxSgd, ctx.budget)) score += 8;
  if (vibeFits(hit, ctx.mood)) score += 10;
  if (favouriteHit(hit, ctx.favouriteKeys)) score += 18;
  const group = ctx.groupSize ?? 1;
  if (group >= 8 && (hit.placeKind === "hawker" || hit.placeKind === "restaurant" || hit.placeKind === "kopitiam")) score += 6;
  if (group >= 8 && (hit.placeKind === "cafe" || hit.placeKind === "bakery")) score -= 4;
  return score;
}

function shuffleHits(hits: Hit[], seed: number): Hit[] {
  const copy = [...hits];
  let state = seed >>> 0 || 1;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = Math.floor((state / 4294967296) * (index + 1));
    const current = copy[index];
    copy[index] = copy[swap]!;
    copy[swap] = current!;
  }
  return copy;
}

export function sortMakanHits(hits: Hit[], mode: MakanSort, ctx: MatchContext = {}): Hit[] {
  if (mode === "favourites") return sortMakanHits(hits.filter((hit) => favouriteHit(hit, ctx.favouriteKeys)), "match", ctx);
  if (mode === "random") return shuffleHits(hits, ctx.seed ?? 1);
  if (mode === "closest") return [...hits].sort((a, b) => a.minutes - b.minutes || a.meters - b.meters);
  return [...hits].sort((a, b) => bestMatchScore(b, ctx) - bestMatchScore(a, ctx) || a.minutes - b.minutes || a.meters - b.meters);
}

export function resultBlurb(hit: Hit, ctx: MatchContext, options: { favourite: boolean; rank: number; mode: MakanSort }): string {
  const limit = ctx.minutes ?? hit.minutes;
  const cuisine = (hit.cuisines ?? []).map(cuisineLabel)[0];
  const kind = placeKindLabel(hit.placeKind);
  const meal = (ctx.meal || "meal").toLowerCase();
  if (!hit.verified) return "Straight-line distance only. Walking time was not verified.";
  if (options.mode === "closest" && options.rank === 0) {
    const what = [cuisine, kind].filter(Boolean).join(" ").toLowerCase();
    return what ? `Closest ${what} within your ${limit}-minute limit.` : `Closest option within your ${limit}-minute limit.`;
  }
  if (options.favourite && kind) return `Fits your ${kind.toLowerCase()} preference and is one of your saved favourites.`;
  if (options.favourite) return "One of your saved favourites, and it still fits this search.";
  if (ctx.mood === "quick") return `Best match for a quick ${meal} with ${ctx.groupSize ?? 1} people.`;
  if (ctx.mood === "comfortable" && kind === "Restaurant") {
    return cuisine ? `A sit-down ${cuisine.toLowerCase()} restaurant within your ${limit}-minute limit.` : `A sit-down restaurant within your ${limit}-minute limit.`;
  }
  if (cuisine && kind) return `${cuisine} · ${kind.toLowerCase()} within your ${limit}-minute walk.`;
  if (cuisine) return `${cuisine} option within your ${limit}-minute walk.`;
  if (kind) return `${kind} within your ${limit}-minute walk.`;
  return `Within your ${limit}-minute walk for ${ctx.groupSize ?? 1} people.`;
}

export function travelLabel(minutes: number): string {
  if (minutes <= 15) return `${minutes} min walk`;
  if (minutes <= 25) return `${minutes} min, or a short ride`;
  return `about ${minutes} min`;
}

function clampBudget(value: number): 0 | 1 | 2 | 3 {
  if (value <= 0) return 0;
  if (value < 10) return 1;
  if (value <= 20) return 2;
  return 0;
}

export function parseMakan(text: string, fallback: Partial<MakanBrief> = {}): MakanBrief {
  const line = text.toLowerCase();
  const group = /(\d{1,2})\s*(pax|people|person|staff|of us)/.exec(line);
  const money = /(?:\$|around|about|under|budget)\s*\$?\s*(\d{2,3})/.exec(line) ?? /(\d{2})\s*(?:dollars|bucks|a head|\/pax|per person)/.exec(line);
  const walk = /(\d{1,2})\s*(?:min|minute)/.exec(line);
  const area = matchArea(line);
  let dietary: MakanBrief["dietary"] = fallback.dietary ?? "";
  if (line.includes("vegan")) dietary = "vegan";
  else if (line.includes("vegetarian") || line.includes("plant")) dietary = "vegetarian";
  else if (line.includes("halal")) dietary = "halal";
  let mood: MakanBrief["mood"] = fallback.mood ?? "";
  if (line.includes("coffee") || line.includes("kopi")) mood = "coffee";
  else if (line.includes("quick") || line.includes("fast") || line.includes("not too heavy") || line.includes("light")) mood = "quick";
  else if (line.includes("different") || line.includes("something else")) mood = "different";
  else if (line.includes("comfortable") || line.includes("sit down") || line.includes("proper")) mood = "comfortable";
  else if (line.includes("casual")) mood = "casual";
  const minutes = walk ? (MINUTES.find((item) => item >= Number(walk[1])) ?? 25) : (fallback.minutes ?? 10);
  const timing: MakanBrief["timing"] = line.includes("before") ? "before" : line.includes("after") ? "after" : (fallback.timing ?? "");
  return {
    location: fallback.location ?? "",
    areaId: area?.id ?? fallback.areaId ?? "",
    groupSize: group ? Number(group[1]) : (fallback.groupSize ?? 4),
    budget: money ? clampBudget(Number(money[1])) : (fallback.budget ?? 0),
    dietary,
    minutes,
    mood,
    timing,
    cuisines: fallback.cuisines ?? [],
    placeTypes: fallback.placeTypes ?? [],
  };
}

export function parseOuting(text: string): OutingBrief {
  const line = text.toLowerCase();
  const group = /(\d{1,3})\s*(pax|people|person|staff|of us)/.exec(line);
  const money = /(?:\$|around|about|under|budget)\s*\$?\s*(\d{2,3})/.exec(line) ?? /(\d{2,3})\s*(?:dollars|each|a head|\/pax|per person)/.exec(line);
  const area = matchArea(line);
  const styles: Style[] = [];
  if (/interact|hands-on|do something|bowling|climb|escape/.test(line)) styles.push("interactive");
  if (/creat|art|pottery|workshop|gallery|not another dinner/.test(line)) styles.push("creative");
  if (/chill|walk|easy|not too tiring|conversation|relaxed/.test(line)) styles.push("chill");
  if (/outdoor|outside|park|ridge/.test(line)) styles.push("outdoor");
  if (/indoor|air-?con|rain/.test(line)) styles.push("indoor");
  if (/compet|active|sport/.test(line)) styles.push("competitive");
  const avoid: string[] = [];
  if (/not another dinner|no dinner|not dinner|not a dinner/.test(line)) avoid.push("dinner-only");
  if (/not childish|not kids|adult|mixed age|not embarrassing/.test(line)) avoid.push("childish");
  if (/not too hr|not corporate|doesn.?t feel like hr|not team-building|not team building/.test(line)) avoid.push("corporate");
  if (/not too expensive|cheap|budget/.test(line) && !money) avoid.push("pricey");
  let energy: OutingBrief["energy"] = "moderate";
  if (/not too tiring|chill|easy|low key|low-key/.test(line)) energy = "low";
  else if (/active|high energy|sport|climb|bowling/.test(line)) energy = "high";
  let when = "";
  if (line.includes("friday")) when = "Friday";
  if (line.includes("afternoon")) when = when ? `${when} afternoon` : "Afternoon";
  else if (line.includes("after work") || line.includes("evening")) when = when ? `${when} after work` : "After work";
  else if (line.includes("morning")) when = when ? `${when} morning` : "Morning";
  const hoursMatch = /(\d(?:\.\d)?)\s*(?:hour|hr)/.exec(line);
  return {
    groupSize: group ? Math.min(80, Number(group[1])) : 12,
    budget: money ? Number(money[1]) : avoid.includes("pricey") ? 25 : 50,
    areaId: area?.id ?? "",
    areaLabel: area?.label ?? (line.includes("singapore") ? "Singapore" : ""),
    when,
    hours: hoursMatch ? Number(hoursMatch[1]) : 3,
    energy,
    styles: styles.length ? styles : energy === "low" ? ["chill"] : energy === "high" ? ["competitive", "interactive"] : ["interactive"],
    avoid,
    summary: text.trim().slice(0, 280),
  };
}

function dietOk(spot: { dietary: Diet[] }, dietary: string): boolean {
  if (!dietary) return true;
  if (dietary === "vegan") return spot.dietary.includes("vegan");
  if (dietary === "vegetarian") return spot.dietary.includes("vegetarian") || spot.dietary.includes("vegan");
  if (dietary === "halal") return spot.dietary.includes("halal");
  return true;
}

/** 0 any, 1 under $10, 2 from $10 to $20. Unknown map prices stay in. */
export function withinMakanBudget(amount: number | null, budget: 0 | 1 | 2 | 3): boolean {
  if (budget === 0 || budget === 3) return true;
  if (amount == null) return true;
  if (budget === 1) return amount < 10;
  return amount >= 10 && amount <= 20;
}

function withinOutingBudget(amount: number, brief: OutingBrief): boolean {
  if (brief.budget >= 200) return true;
  return amount >= (brief.budgetMin ?? 0) && amount <= brief.budget;
}

export function makanWhy(hit: Pick<Hit, "minutes" | "approxSgd" | "dietary" | "cuisine">): string {
  const move = travelLabel(hit.minutes);
  const price = hit.approxSgd != null ? `about $${hit.approxSgd} a person.` : "";
  const diet = hit.dietary.includes("halal")
    ? "Halal."
    : hit.dietary.includes("vegan")
      ? "Plant-based."
      : hit.dietary.includes("vegetarian")
        ? "Vegetarian."
        : "";
  const close = hit.minutes <= 10 ? "Close enough that nobody needs to debate transport." : "Far enough to feel like you left the building.";
  return [ `${move}, ${price}.`, diet, close ].filter(Boolean).join(" ");
}

export function filterMakan(
  origin: { lat: number; lng: number },
  brief: MakanBrief,
  extras: Hit[] = [],
  capMeters?: number,
): Hit[] {
  const cap = capMeters ?? (brief.minutes <= 5 ? 450 : brief.minutes <= 10 ? 900 : brief.minutes <= 15 ? 1400 : 4500);
  const fromDirectory: Hit[] = SPOTS.filter((spot) => spot.kind === "makan").map((spot) => {
    const meters = distanceMeters(origin.lat, origin.lng, spot.lat, spot.lng);
    const hit: Hit = {
      id: spot.id,
      name: spot.name,
      cuisine: spot.cuisine,
      address: spot.address,
      area: spot.area,
      lat: spot.lat,
      lng: spot.lng,
      minutes: walkMinutes(meters),
      meters: Math.round(meters),
      price: spot.price,
      approxSgd: spot.approxSgd,
      dietary: spot.dietary,
      why: "",
      source: "directory",
      mapsUrl: mapsLink(spot.name, spot.address),
    };
    hit.why = makanWhy(hit);
    return hit;
  });
  const merged = new Map<string, Hit>();
  for (const hit of [...fromDirectory, ...extras]) {
    const key = hit.name.toLowerCase();
    const prev = merged.get(key);
    if (!prev || (hit.source === "directory" && prev.source === "map")) merged.set(key, hit);
  }
  return [...merged.values()]
    .filter((hit) => hit.meters <= cap)
    .filter((hit) => dietOk(hit, brief.dietary))
    .filter((hit) => {
      const spot = SPOTS.find((item) => item.id === hit.id);
      if (spot && brief.groupSize > spot.maxPax) return false;
      if (brief.mood && spot && !spot.moods.includes(brief.mood)) return false;
      if (brief.budget && !withinMakanBudget(hit.approxSgd, brief.budget)) return false;
      return true;
    })
    .sort((a, b) => rankMakan(b, brief) - rankMakan(a, brief));
}

/** Keep places whose routed walk is inside the limit. Missing routes are dropped, not guessed. */
export function applyVerifiedWalks(
  hits: Hit[],
  routes: Map<string, { seconds: number; meters: number }>,
  limitMinutes: number,
): { kept: Hit[]; resolved: number } {
  let resolved = 0;
  const kept: Hit[] = [];
  for (const hit of hits) {
    const route = routes.get(hit.id);
    if (!route || !Number.isFinite(route.seconds) || !Number.isFinite(route.meters)) continue;
    const speed = route.meters / route.seconds;
    if (!Number.isFinite(speed) || speed < 0.3 || speed > 2.2) continue;
    resolved += 1;
    const minutes = Math.max(1, Math.round(route.seconds / 60));
    if (minutes > limitMinutes) continue;
    const updated: Hit = { ...hit, minutes, meters: Math.round(route.meters), verified: true };
    updated.why = makanWhy(updated);
    kept.push(updated);
  }
  return { kept, resolved };
}

export function constrainMakan(hits: Hit[], brief: MakanBrief): Hit[] {
  return hits.filter((hit) => {
    if (!cuisineOk(hit, brief.cuisines)) return false;
    if (!placeOk(hit, brief.placeTypes)) return false;
    if (!dietOk(hit, brief.dietary)) return false;
    const spot = SPOTS.find((item) => item.id === hit.id);
    if (spot && brief.groupSize > spot.maxPax) return false;
    if (brief.mood && spot && !spot.moods.includes(brief.mood)) return false;
    if (brief.budget && !withinMakanBudget(hit.approxSgd, brief.budget)) return false;
    return true;
  });
}

export function makanConstraint(brief: MakanBrief): string {
  const parts = [`≤${brief.minutes} min walk`];
  if (brief.budget === 1) parts.push("under $10/pax");
  else if (brief.budget === 2) parts.push("$10–$20/pax");
  if (brief.dietary === "halal") parts.push("Halal");
  else if (brief.dietary === "vegetarian") parts.push("Vegetarian");
  else if (brief.dietary === "vegan") parts.push("Vegan");
  if (brief.cuisines.length) parts.push(brief.cuisines.map(cuisineLabel).join(" + "));
  if (brief.placeTypes.length) parts.push(brief.placeTypes.map(placeKindLabel).join(" + "));
  if (brief.mood) parts.push(brief.mood);
  return parts.join(" · ");
}

function rankMakan(hit: Hit, brief: MakanBrief): number {
  let score = 80 - Math.min(hit.minutes, 40);
  if (brief.budget && withinMakanBudget(hit.approxSgd, brief.budget) && hit.approxSgd != null) score += 16;
  if (!hit.price) score -= 6;
  if (brief.dietary && hit.dietary.includes(brief.dietary)) score += 24;
  const spot = SPOTS.find((item) => item.id === hit.id);
  if (brief.mood && spot?.moods.includes(brief.mood)) score += 14;
  if (spot && brief.groupSize <= spot.maxPax) score += 4;
  return score;
}

function spotHit(spot: Spot, origin: { lat: number; lng: number }): Hit {
  const meters = distanceMeters(origin.lat, origin.lng, spot.lat, spot.lng);
  return {
    id: spot.id,
    name: spot.name,
    cuisine: spot.cuisine,
    address: spot.address,
    area: spot.area,
    lat: spot.lat,
    lng: spot.lng,
    minutes: walkMinutes(meters),
    meters: Math.round(meters),
    price: spot.price,
    approxSgd: spot.approxSgd,
    dietary: spot.dietary,
    why: spot.blurb,
    source: "directory",
    mapsUrl: mapsLink(spot.name, spot.address),
  };
}

export function buildConcepts(origin: { lat: number; lng: number } | null, brief: OutingBrief, roll = 0): Concept[] {
  const cap = origin ? (brief.areaId ? 6000 : 18000) : 200000;
  const shift = Math.max(0, Math.floor(roll));
  const activities = SPOTS.filter((spot) => spot.kind === "out")
    .map((spot) => ({ spot, meters: origin ? distanceMeters(origin.lat, origin.lng, spot.lat, spot.lng) : 0 }))
    .filter(({ spot, meters }) => meters <= cap && withinOutingBudget(spot.approxSgd, brief) && brief.groupSize <= spot.maxPax)
    .filter(({ spot }) => {
      if (brief.avoid.includes("dinner-only") && spot.kind === "makan") return false;
      if (brief.styles.includes("outdoor") && !spot.styles.includes("outdoor")) return false;
      if (brief.styles.includes("indoor") && spot.styles.includes("outdoor") && !spot.styles.includes("indoor")) return false;
      return true;
    });

  const personalities: { id: string; personality: Concept["personality"]; style: Style }[] = [
    { id: "competitive", personality: "Competitive", style: "competitive" },
    { id: "creative", personality: "Creative", style: "creative" },
    { id: "chill", personality: "Chill", style: "chill" },
  ];
  const used = new Set<string>();
  const concepts: Concept[] = [];
  const order =
    brief.energy === "low"
      ? ["chill", "creative", "competitive"]
      : brief.energy === "high"
        ? ["competitive", "creative", "chill"]
        : brief.avoid.includes("corporate")
          ? ["creative", "chill", "competitive"]
          : ["competitive", "creative", "chill"];

  for (const id of order) {
    const meta = personalities.find((item) => item.id === id);
    if (!meta) continue;
    const pool = activities
      .filter(({ spot }) => spot.styles.includes(meta.style) && !used.has(spot.id))
      .sort((a, b) => a.meters - b.meters || a.spot.approxSgd - b.spot.approxSgd);
    let first = pool[0];
    for (let step = 0; step < pool.length; step += 1) {
      const candidate = pool[(shift + step) % pool.length];
      if (candidate && !used.has(candidate.spot.id)) {
        first = candidate;
        break;
      }
    }
    if (!first) continue;
    used.add(first.spot.id);
    const foods = brief.avoid.includes("dinner-only")
      ? []
      : SPOTS.filter((spot) => spot.kind === "makan" && brief.groupSize <= spot.maxPax && spot.id !== first.spot.id)
          .map((spot) => ({ spot, meters: distanceMeters(first.spot.lat, first.spot.lng, spot.lat, spot.lng) }))
          .filter(({ meters, spot }) => meters < 1200 && withinOutingBudget(spot.approxSgd, brief))
          .sort((a, b) => a.meters - b.meters);
    const food = foods.length ? foods[shift % foods.length] ?? null : null;
    const stops: Stop[] = [
      {
        id: first.spot.id,
        name: first.spot.name,
        address: first.spot.address,
        note: first.spot.blurb,
        lat: first.spot.lat,
        lng: first.spot.lng,
      },
    ];
    if (food) {
      stops.push({
        id: food.spot.id,
        name: food.spot.name,
        address: food.spot.address,
        note: `${walkMinutes(food.meters)} min from ${first.spot.name}. ${food.spot.blurb}`,
        lat: food.spot.lat,
        lng: food.spot.lng,
      });
    }
    const cost = first.spot.approxSgd + (food ? Math.round(food.spot.approxSgd * 0.6) : 0);
    const hours = Math.max(2, Math.min(5, brief.hours || 3));
    concepts.push({
      id: meta.id,
      personality: meta.personality,
      title: food ? `${first.spot.name} + ${food.spot.name}` : first.spot.name,
      why: conceptWhy(meta.personality, first.spot, brief),
      hours,
      approxSgd: cost,
      pax: brief.groupSize,
      stops,
      steps: stepsFor(hours, first.spot.name, food?.spot.name ?? ""),
    });
  }
  return concepts;
}

function conceptWhy(personality: Concept["personality"], spot: Spot, brief: OutingBrief): string {
  if (personality === "Competitive") return `${spot.name} is easy to organise and people can join without a rehearsal. Fits about ${brief.groupSize}.`;
  if (personality === "Creative") return `${spot.name} is more memorable than another dinner, without turning the afternoon into a workshop from HR.`;
  return `${spot.name} keeps the cost down and the plan loose. Good if the group would rather talk than perform.`;
}

function stepsFor(hours: number, primary: string, food: string): string[] {
  const endHour = 15 + Math.round(hours);
  const lines = ["2:30 pm · Leave", `3:00 pm · ${primary}`];
  if (food) lines.push(`${clock(endHour - 1)} · ${food}`);
  lines.push(`${clock(endHour)} · Head back`);
  return lines;
}

function clock(hour24: number): string {
  const hour = ((hour24 % 24) + 24) % 24;
  const suffix = hour >= 12 ? "pm" : "am";
  const face = hour % 12 || 12;
  return `${face}:00 ${suffix}`;
}

export function spinOne<T>(items: T[], avoidId?: string): T | null {
  const pool = items.filter((item) => (item as { id?: string }).id !== avoidId);
  const use = pool.length ? pool : items;
  if (!use.length) return null;
  const index = Math.floor(Math.random() * use.length);
  return use[index] ?? null;
}

export function originFromArea(areaId: string, text: string): { lat: number; lng: number; label: string } | null {
  const area = AREAS.find((item) => item.id === areaId) ?? matchArea(text);
  if (!area) return null;
  return { lat: area.lat, lng: area.lng, label: area.label };
}

export function knownNames(): string[] {
  return SPOTS.map((spot) => spot.name);
}

export function foreignName(text: string, allowed: string[]): boolean {
  const lower = text.toLowerCase();
  return knownNames().some((name) => !allowed.some((ok) => ok.toLowerCase() === name.toLowerCase()) && lower.includes(name.toLowerCase()));
}
