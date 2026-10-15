import "@tanstack/react-start/server-only";

import { distanceMeters } from "@/lib/coord";
import { DATING_PLACES, eastConversationalNames } from "@/lib/dating-places";
import { acceptModelIntent, interpretDateBrief } from "@/lib/dating-intent";
import {
  clockSlot,
  dedupePlaces,
  discoveryBucket,
  doThis,
  durationRule,
  formatClock,
  likelyClosed,
  looksLikeArea,
  namesCollide,
  nextStart,
  normalName,
  pickShape,
  placeTitle,
  rankPlaces,
  narrateDate,
  landedShape,
  isConversational,
  type StepSpec,
} from "@/lib/dating-plan";
import { scoreDating, type DateFood, type DatePlace, type DateRole, type DateType, type DateVibe, type DatingPlan, type DatingScore, type DatingStop } from "@/lib/dating";
import { SPOTS } from "@/lib/directory";
import { forecast } from "@/lib/family.server";
import type { WeatherDay } from "@/lib/family";
import { geminiJson, KAIROS_VOICE, type GeminiSample } from "@/lib/gemini.server";
import { noteCall, noteFailure } from "@/lib/provider-usage";
import { shareRequest, TtlCache } from "@/lib/travel-cache";
import { clipVoice } from "@/lib/voice";

export type DatingQuery = {
  dateType: DateType;
  date: string;
  whenLabel: string;
  startMin: number;
  span: "quick" | "half" | "full";
  budget: number;
  freeOnly: boolean;
  latitude: number;
  longitude: number;
  area: string;
  originAddress: string;
  originProvider: string;
  originId: string;
  maxTravel: number;
  travelMode: "drive" | "walk" | "ride" | "transit";
  setting: "indoor" | "outdoor" | "either" | "mix";
  vibes: DateVibe[];
  foods: DateFood[];
  pressure: "low" | "balanced" | "memorable";
  formality: "casual" | "smart" | "dress";
  alcohol: "any" | "none" | "ok";
  crowd: "avoid" | "ok" | "lively";
  diets: string[];
  goal: string;
  text: string;
  rejected: string[];
  rejectedVenues: string[];
  seen: string[];
  spin: number;
  tightSecondLeg: boolean;
  avoid: string[];
  locked: {
    placeId: string;
    title: string;
    address: string;
    latitude: number;
    longitude: number;
    setting: "indoor" | "outdoor";
    kind: DateRole;
  }[];
};

export type DateDiscovery = {
  area: string;
  raw: number;
  unique: number;
  byCategory: Record<string, number>;
  afterGeographic: number;
  afterTravel: number;
  travelVerified: boolean;
  afterOpeningHours: number;
  afterDateVibe: number;
  vibeMatches: number;
  widened: boolean;
  passedToPlanner: number;
};

export type DatingResult = {
  weather: WeatherDay | null;
  stops: DatingStop[];
  backup: { title: string; address: string; travelLabel: string; setting: "indoor" | "outdoor" } | null;
  score: DatingScore | null;
  spend: number | null;
  why: string;
  cupid: string;
  eventsNote: string;
  understood: string[];
  plan: DatingPlan | null;
  discovery: DateDiscovery;
  widenNote: string;
};

function datingOutdoor(weather: WeatherDay | null, _startMin: number): boolean | null {
  if (!weather) return null;
  if (weather.thunder || weather.rainRisk === "high") return false;
  return true;
}

function datingAside(brief: DatingQuery, stops: DatingStop[], outdoorOk: boolean | null, rain: boolean): string {
  const hop = stops[0]?.travelMin;
  if (brief.locked.length) return "Keeping this stop. Fixing everything after it.";
  if (brief.rejected.length) return "You're hard to please. One more.";
  if (brief.dateType === "first") return "First date. Keep it simple. Good food, easy conversation, optional second stop.";
  if (brief.freeOnly) return "Romance remains available without GST.";
  if (brief.budget >= 250) return "Okay, somebody is trying.";
  if (brief.setting !== "indoor" && (rain || outdoorOk === false)) return "Rain is in the forecast. Do the indoor bit before the sky changes.";
  if (hop != null && hop >= 30) return `${hop} minutes to the first stop. I would not stretch that for dessert.`;
  if (hop != null) return `${hop} minutes to the first stop. Enough time to decide on dessert.`;
  return "Dinner is sorted. The rest is chemistry, not my department.";
}

const DATE_GEMINI: GeminiSample = { temperature: 0.95, topP: 0.95 };
export const DATE_WIDEN_NOTE = "Expanded slightly into Siglap/Changi rustic edge for better conversational vibes.";
const OVERPASS = ["https://overpass.openstreetmap.fr/api/interpreter", "https://overpass-api.de/api/interpreter"];
const dateOsmCache = new TtlCache<OsmElement[]>(6 * 60 * 60 * 1000, 60, "discovery");
const dateRouteCache = new TtlCache<RouteHit | null>(6 * 60 * 60 * 1000, 400, "routing");

type OsmElement = {
  type?: string;
  id?: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
};

function discoveryRadius(brief: Pick<DatingQuery, "travelMode" | "maxTravel">): number {
  if (brief.travelMode === "walk") return Math.min(4200, Math.max(1800, 800 + brief.maxTravel * 70));
  if (brief.travelMode === "transit") return Math.min(12000, Math.max(5000, 2000 + brief.maxTravel * 160));
  return Math.min(14000, Math.max(6000, 2400 + brief.maxTravel * 180));
}

function around(radius: number, origin: { lat: number; lng: number }): string {
  return `(around:${Math.round(radius)},${origin.lat},${origin.lng})`;
}

async function overpass(body: string): Promise<OsmElement[]> {
  let hash = 0;
  for (let index = 0; index < body.length; index += 1) hash = (hash * 33 + body.charCodeAt(index)) >>> 0;
  const key = hash.toString(16);
  const cached = dateOsmCache.get(key);
  if (cached) return cached;
  return shareRequest(`date-osm:${key}`, async () => {
    const again = dateOsmCache.peek(key);
    if (again) return again;
    for (const host of OVERPASS) {
      try {
        noteCall("discovery", "overpass-dating");
        const res = await fetch(host, {
          method: "POST",
          headers: { "Content-Type": "text/plain", "User-Agent": "Kairos/1.0 (dating places)" },
          body,
          signal: AbortSignal.timeout(16000),
        });
        if (!res.ok) continue;
        const json = (await res.json()) as { elements?: OsmElement[] };
        const elements = json.elements ?? [];
        if (elements.length) {
          dateOsmCache.set(key, elements);
          return elements;
        }
      } catch {
        // Next host.
      }
    }
    noteFailure("discovery", "overpass-dating", "Dating places did not load.");
    return [];
  });
}

function weakVenue(name: string, leisure: string): boolean {
  if (/carpark|car park|toilet|playground$/i.test(name)) return true;
  if (leisure === "fitness_centre") return true;
  return /anytime fitness|f45|celebrity fitness|pure fitness|fitness first|gymmboxx|ampt fitness|\bblock \d+\b/i.test(name);
}

function classifyOsm(tags: Record<string, string>, name: string): { role: DateRole; cuisine: string; outdoor: boolean } | null {
  const amenity = tags.amenity ?? "";
  const tourism = tags.tourism ?? "";
  const leisure = tags.leisure ?? "";
  const shop = tags.shop ?? "";
  const natural = tags.natural ?? "";
  const blob = `${name} ${amenity} ${tourism} ${leisure} ${shop}`;
  if (weakVenue(name, leisure)) return null;
  if (looksLikeArea(name) && !/hawker|food centre|food center/i.test(name)) {
    return { role: "scenic", cuisine: /water|beach|coast|quay/i.test(blob) ? "Waterfront" : "Neighbourhood", outdoor: true };
  }
  if (/karaoke/i.test(blob)) return { role: "activity", cuisine: "Karaoke", outdoor: false };
  if (/bowling/i.test(blob)) return { role: "activity", cuisine: "Bowling", outdoor: false };
  if (/arcade/i.test(blob)) return { role: "activity", cuisine: "Arcade", outdoor: false };
  if (/promenade|boardwalk/i.test(name)) return { role: "scenic", cuisine: "Waterfront", outdoor: true };
  if (amenity === "restaurant" || amenity === "food_court") return { role: "meal", cuisine: (tags.cuisine || "Restaurant").split(";")[0]?.slice(0, 40) || "Restaurant", outdoor: false };
  if (amenity === "marketplace" && /hawker|food|market/i.test(name)) return { role: "meal", cuisine: "Hawker", outdoor: false };
  if (amenity === "cafe" || amenity === "ice_cream" || amenity === "bar" || amenity === "pub" || amenity === "biergarten" || shop === "bakery") {
    const cuisine = shop === "bakery" || amenity === "ice_cream" ? (amenity === "ice_cream" ? "Ice cream" : "Bakery") : (tags.cuisine || "Cafe").split(";")[0]?.slice(0, 40) || "Cafe";
    return { role: "cafe", cuisine, outdoor: amenity === "biergarten" };
  }
  if (["cinema", "theatre"].includes(amenity)) return { role: "activity", cuisine: amenity === "cinema" ? "Cinema" : "Theatre", outdoor: false };
  if (["museum", "gallery", "aquarium", "theme_park", "attraction"].includes(tourism)) return { role: "activity", cuisine: tourism === "theme_park" ? "Attraction" : tourism[0]?.toUpperCase() + tourism.slice(1), outdoor: false };
  if (tourism === "viewpoint" || natural === "beach" || leisure === "marina") return { role: "scenic", cuisine: natural === "beach" ? "Beach" : "View", outdoor: true };
  if (["park", "garden", "nature_reserve"].includes(leisure)) return { role: "scenic", cuisine: leisure === "park" ? "Park" : "Garden", outdoor: true };
  if (["library", "arts_centre", "community_centre", "bowling_alley"].includes(amenity)) return { role: "activity", cuisine: amenity === "library" ? "Library" : amenity === "arts_centre" ? "Arts" : "Activity", outdoor: false };
  if (["sports_centre", "ice_rink", "miniature_golf", "escape_game", "water_park", "amusement_arcade", "bowling_alley"].includes(leisure)) {
    return { role: "activity", cuisine: leisure === "water_park" ? "Water park" : leisure === "escape_game" ? "Escape game" : "Activity", outdoor: leisure === "water_park" };
  }
  if (shop === "books" || shop === "mall" || shop === "department_store" || shop === "art") {
    return { role: "activity", cuisine: shop === "mall" || shop === "department_store" ? "Mall" : shop === "books" ? "Books" : "Art", outdoor: false };
  }
  if (amenity === "marketplace") return { role: "activity", cuisine: "Market", outdoor: false };
  return null;
}

function fromElement(element: OsmElement): DatePlace | null {
  const tags = element.tags ?? {};
  const name = (tags.name ?? "").replace(/\s+/g, " ").trim();
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  if (name.length < 3 || lat == null || lng == null || !element.id) return null;
  const kind = classifyOsm(tags, name);
  if (!kind) return null;
  const address = [tags["addr:housenumber"], tags["addr:street"], tags["addr:postcode"]].filter(Boolean).join(" ");
  const outdoor = kind.outdoor || kind.role === "scenic";
  return {
    id: `date-${element.type}-${element.id}`,
    name: name.slice(0, 80),
    address: (address || "Singapore").slice(0, 140),
    lat,
    lng,
    role: kind.role,
    setting: outdoor ? "outdoor" : "indoor",
    approxSgd: 0,
    cuisine: kind.cuisine,
    vibes: outdoor ? ["scenic", "chill"] : kind.role === "cafe" ? ["cosy", "quiet"] : kind.role === "activity" ? ["artsy", "playful"] : ["foodie"],
    diets: tags.cuisine?.includes("halal") ? ["halal"] : [],
    alcohol: tags.amenity === "bar" || tags.amenity === "pub",
    opening: (tags.opening_hours ?? "").slice(0, 80),
    source: "osm",
    blurb: outdoor ? "A mapped place to walk. Price is not on the map." : "Mapped place. Price is not on the map.",
  };
}

async function fromMap(origin: { lat: number; lng: number }, radius: number): Promise<DatePlace[]> {
  const box = around(radius, origin);
  const foodBox = around(Math.min(radius, 4200), origin);
  const food = `[out:json][timeout:20];(nwr["name"]["amenity"~"^(restaurant|cafe|ice_cream|food_court)$"]${foodBox};nwr["name"]["shop"="bakery"]${foodBox};);out center;`;
  const going = `[out:json][timeout:18];(nwr["name"]["amenity"~"^(cinema|theatre|library|arts_centre|community_centre|bowling_alley|marketplace)$"]${box};nwr["name"]["leisure"~"^(sports_centre|ice_rink|miniature_golf|escape_game|bowling_alley|water_park|amusement_arcade|marina)$"]${box};nwr["name"]["tourism"~"^(museum|gallery|attraction|aquarium|theme_park|viewpoint)$"]${box};nwr["name"]["shop"~"^(books|mall|department_store|art)$"]${box};nwr["name"~"karaoke|bowling|arcade|promenade|boardwalk",i]${box};);out center;`;
  const outside = `[out:json][timeout:18];(nwr["name"]["leisure"="park"]${box};nwr["name"]["leisure"="garden"]${box};nwr["name"]["leisure"="nature_reserve"]${box};nwr["name"]["natural"="beach"]${box};);out center;`;
  const batches = await Promise.all([overpass(food), overpass(going), overpass(outside)]);
  const seen = new Set<string>();
  const hits: DatePlace[] = [];
  for (const element of batches.flat()) {
    const place = fromElement(element);
    if (!place || seen.has(place.id)) continue;
    seen.add(place.id);
    hits.push(place);
  }
  return hits;
}

function fromDirectory(origin: { lat: number; lng: number }, radius: number): DatePlace[] {
  const listed = SPOTS.map((spot): DatePlace => {
    const outdoor = spot.styles.includes("outdoor") && !spot.styles.includes("indoor");
    const scenic = spot.kind === "out" && /garden|coast|bay|walk|park|view|beach|reservoir/i.test(`${spot.name} ${spot.cuisine} ${spot.blurb}`);
    const cafe = spot.kind === "makan" && (spot.moods.includes("coffee") || /cafe|coffee|dessert|bakery|gelato/i.test(spot.cuisine));
    const role: DateRole = spot.kind === "makan" ? (cafe ? "cafe" : "meal") : scenic ? "scenic" : "activity";
    const vibes = new Set<DateVibe>();
    if (spot.moods.includes("coffee") || spot.moods.includes("comfortable")) vibes.add("cosy");
    if (spot.styles.includes("chill")) vibes.add("chill");
    if (scenic || outdoor) vibes.add("scenic");
    if (spot.kind === "makan") vibes.add("foodie");
    if (/gallery|museum|art|library/i.test(`${spot.name} ${spot.cuisine}`)) vibes.add("artsy");
    if (spot.price >= 3) vibes.add("classy");
    if (spot.moods.includes("different")) vibes.add("playful");
    if (/karaoke|bowl|climb|escape|game/i.test(`${spot.name} ${spot.cuisine}`)) vibes.add("playful");
    return {
      id: `dir-${spot.id}`,
      name: spot.name,
      address: spot.address,
      lat: spot.lat,
      lng: spot.lng,
      role,
      setting: outdoor ? "outdoor" : "indoor",
      approxSgd: spot.approxSgd,
      cuisine: spot.cuisine,
      vibes: [...vibes],
      diets: spot.dietary,
      alcohol: /bar|wine|cocktail|karaoke/i.test(`${spot.name} ${spot.cuisine}`),
      opening: "",
      source: "directory",
      blurb: spot.blurb,
    };
  });
  return [...listed, ...DATING_PLACES].filter((place) => distanceMeters(origin.lat, origin.lng, place.lat, place.lng) <= radius);
}

type RouteHit = { minutes: number; meters: number };

async function routeMinutes(kind: "walk" | "drive", from: { lat: number; lng: number }, to: { lat: number; lng: number }): Promise<RouteHit | null | "down"> {
  const key = `${kind}:${from.lat.toFixed(3)},${from.lng.toFixed(3)};${to.lat.toFixed(3)},${to.lng.toFixed(3)}`;
  const cached = dateRouteCache.get(key);
  if (cached !== undefined) return cached;
  return shareRequest(`date-route:${key}`, () => fetchDateRoute(kind, from, to, key));
}

async function fetchDateRoute(kind: "walk" | "drive", from: { lat: number; lng: number }, to: { lat: number; lng: number }, key: string): Promise<RouteHit | null | "down"> {
  const again = dateRouteCache.peek(key);
  if (again !== undefined) return again;
  const path = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = kind === "walk"
    ? `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${path}?overview=false`
    : `https://router.project-osrm.org/route/v1/driving/${path}?overview=false`;
  try {
    noteCall("routing", kind === "walk" ? "osm-foot" : "osrm");
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Kairos/1.0 (dating routing)" },
      signal: AbortSignal.timeout(4500),
    });
    if (!res.ok) return "down";
    const route = ((await res.json()) as { routes?: { duration?: number; distance?: number }[] }).routes?.[0];
    if (!route?.duration || !route.distance) return null;
    const speed = route.distance / route.duration;
    if (kind === "walk" && (speed < 0.3 || speed > 2.2)) return null;
    if (kind === "drive" && (speed < 1 || speed > 40)) return null;
    const minutes = Math.max(1, Math.round(route.duration / 60));
    if (distanceMeters(from.lat, from.lng, to.lat, to.lng) / (minutes * 60) > (kind === "walk" ? 2.2 : 25)) return null;
    const hit = { minutes, meters: Math.round(route.distance) };
    dateRouteCache.set(key, hit);
    return hit;
  } catch {
    return "down";
  }
}

export async function parseDatingIntent(text: string, today: string) {
  const local = interpretDateBrief(text, today);
  if (text.trim().length < 8) return local;
  const raw = await geminiJson(
    "Parse a Singapore date-planning brief into JSON. Do not invent venues, addresses, travel times, weather, or prices. budgetMax only if the user stated a number. dateIntent is today, tomorrow, this_friday, this_weekend, or empty. specificDate must be empty. timeOfDay is breakfast, brunch, afternoon, evening, night, or empty. areaText is a region or place name, or empty. budgetLevel is free, cheap, moderate, premium, or empty. vibes and planComponents use only the allowed words. indoorOutdoor is indoor, outdoor, or empty.",
    text.slice(0, 500),
    {
      type: "object",
      properties: {
        dateIntent: { type: "string" },
        specificDate: { type: "string" },
        timeOfDay: { type: "string" },
        areaText: { type: "string" },
        budgetLevel: { type: "string" },
        budgetMax: { type: "number" },
        vibes: { type: "array", items: { type: "string" } },
        planComponents: { type: "array", items: { type: "string" } },
        durationPreference: { type: "string" },
        conversationFriendly: { type: "boolean" },
        indoorOutdoor: { type: "string" },
        travelPreference: { type: "string" },
        dateType: { type: "string" },
        specialOccasion: { type: "string" },
        avoid: { type: "array", items: { type: "string" } },
        aside: { type: "string" },
      },
    },
    400,
    DATE_GEMINI,
  );
  return acceptModelIntent(local, raw, text);
}

function listedAddress(address: string): string {
  const clean = address.replace(/\s+/g, " ").trim();
  if (clean.length < 8 || /^singapore$/i.test(clean) || /^\d+$/.test(clean)) return "Full address was not on the map";
  return clean;
}

function allowed(place: DatePlace, brief: DatingQuery, outdoorOk: boolean | null): boolean {
  if (brief.avoid.some((item) => /child|kid/i.test(item)) && /playground|kids|children/i.test(place.name)) return false;
  if (brief.alcohol === "none" && place.alcohol) return false;
  if (brief.diets.length && !brief.diets.every((diet) => place.diets.includes(diet))) return false;
  if (brief.freeOnly && !(place.approxSgd === 0 && place.source === "directory")) return false;
  if (!brief.freeOnly && place.approxSgd > 0 && place.approxSgd * 2 > brief.budget) return false;
  if ((brief.setting === "indoor" || brief.crowd === "avoid") && place.setting === "outdoor" && brief.foods.includes("picnic")) return false;
  if (brief.setting === "indoor" && place.setting !== "indoor") return false;
  if (outdoorOk === false && place.setting === "outdoor" && brief.setting !== "mix") return false;
  return true;
}

const LIVE = {
  taste: "The meal",
  sweet: "The close",
  move: "Side by side",
  look: "One room",
  play: "Hands busy",
  talk: "The conversation",
} as const;

const POOL_CAP: Record<string, number> = {
  restaurant: 36,
  cafe: 16,
  dessert: 12,
  activity: 22,
  attraction: 12,
  park: 16,
  scenic: 12,
  entertainment: 14,
  shopping: 10,
  workshop: 8,
  "live event": 6,
  other: 8,
};

function asArea(place: DatePlace): DatePlace {
  if (!looksLikeArea(place.name) || place.role === "scenic") return place;
  return { ...place, role: "scenic", setting: "outdoor", cuisine: place.cuisine || "Neighbourhood" };
}

function balancePool(origin: { lat: number; lng: number }, places: DatePlace[]): DatePlace[] {
  const buckets = new Map<string, DatePlace[]>();
  for (const place of places) {
    const bucket = discoveryBucket(place);
    const list = buckets.get(bucket) ?? [];
    list.push(place);
    buckets.set(bucket, list);
  }
  const out: DatePlace[] = [];
  for (const [bucket, list] of buckets) {
    list.sort((a, b) => distanceMeters(origin.lat, origin.lng, a.lat, a.lng) - distanceMeters(origin.lat, origin.lng, b.lat, b.lng));
    out.push(...list.slice(0, POOL_CAP[bucket] ?? 8));
  }
  return out;
}

function openDuring(place: DatePlace, date: string, startMin: number, endMin: number): boolean {
  if (!place.opening) return true;
  const last = Math.max(startMin + 45, endMin);
  const mid = startMin + Math.round((last - startMin) / 2);
  return [startMin, mid, Math.min(last, 23 * 60 + 30)].some((minute) => !likelyClosed(place.opening, date, minute));
}

async function tableMinutes(kind: "walk" | "drive", origin: { lat: number; lng: number }, places: DatePlace[]): Promise<Map<string, number> | null> {
  const found = new Map<string, number>();
  const host = kind === "walk"
    ? "https://routing.openstreetmap.de/routed-foot/table/v1/foot"
    : "https://router.project-osrm.org/table/v1/driving";
  let verified = false;
  for (let index = 0; index < places.length; index += 50) {
    const slice = places.slice(index, index + 50);
    const coords = [`${origin.lng},${origin.lat}`, ...slice.map((place) => `${place.lng},${place.lat}`)].join(";");
    try {
      const res = await fetch(`${host}/${coords}?sources=0&annotations=duration`, {
        headers: { Accept: "application/json", "User-Agent": "Kairos/1.0 (dating routing)" },
        signal: AbortSignal.timeout(7000),
      });
      if (!res.ok) return verified ? found : null;
      const body = (await res.json()) as { durations?: (Array<number | null> | null)[] };
      const row = body.durations?.[0];
      if (!row) return verified ? found : null;
      verified = true;
      slice.forEach((place, placeIndex) => {
        const seconds = row[placeIndex + 1];
        if (typeof seconds === "number" && Number.isFinite(seconds)) found.set(place.id, Math.max(1, Math.round(seconds / 60)));
      });
    } catch {
      return verified ? found : null;
    }
  }
  return verified ? found : null;
}

async function withinTravel(brief: DatingQuery, origin: { lat: number; lng: number }, places: DatePlace[]): Promise<{ places: DatePlace[]; verified: boolean }> {
  const near: DatePlace[] = [];
  const check: DatePlace[] = [];
  for (const place of places) {
    const meters = distanceMeters(origin.lat, origin.lng, place.lat, place.lng);
    if (meters < 280) {
      near.push(place);
      continue;
    }
    if (impossible(brief.travelMode, meters, brief.maxTravel)) continue;
    if (brief.travelMode === "transit") {
      const minutes = Math.max(6, Math.round(meters / 260));
      if (minutes <= brief.maxTravel) near.push(place);
      continue;
    }
    check.push(place);
  }
  if (!check.length) return { places: near, verified: true };
  const kind = brief.travelMode === "walk" ? "walk" : "drive";
  const table = await tableMinutes(kind, origin, check);
  if (!table) return { places: [...near, ...check], verified: false };
  const kept = check.filter((place) => {
    const minutes = table.get(place.id);
    if (minutes == null) return distanceMeters(origin.lat, origin.lng, place.lat, place.lng) <= 900;
    return minutes <= brief.maxTravel;
  });
  return { places: [...near, ...kept], verified: true };
}

function impossible(mode: DatingQuery["travelMode"], meters: number, maxMin: number): boolean {
  if (mode === "walk") return meters / 75 > maxMin;
  if (mode === "transit") return meters / 220 > maxMin;
  return meters / 420 > maxMin;
}

type Router = { down: boolean; cache: Map<string, RouteHit | null> };

async function travelLeg(
  brief: DatingQuery,
  from: { lat: number; lng: number },
  fromName: string,
  place: DatePlace,
  maxMin: number,
  router: Router,
): Promise<{ minutes: number; meters: number; label: string } | null> {
  const meters = distanceMeters(from.lat, from.lng, place.lat, place.lng);
  if (meters < 280) return { minutes: 3, meters: Math.round(meters), label: `a short hop from ${fromName}` };
  if (impossible(brief.travelMode, meters, maxMin)) return null;
  if (brief.travelMode === "transit") {
    const minutes = Math.max(6, Math.round(meters / 260));
    if (minutes > maxMin) return null;
    return { minutes, meters: Math.round(meters), label: `${minutes} min by public transport from ${fromName}, estimated` };
  }
  const kind = brief.travelMode === "walk" ? "walk" : "drive";
  const key = `${kind}:${from.lat.toFixed(4)},${from.lng.toFixed(4)}:${place.id}`;
  if (!router.down) {
    let live = router.cache.get(key);
    if (live === undefined) {
      const routed = await routeMinutes(kind, from, place);
      if (routed === "down") {
        router.down = true;
        live = null;
      } else {
        live = routed;
        router.cache.set(key, live);
      }
    }
    if (live) {
      if (live.minutes > maxMin) return null;
      const word = brief.travelMode === "walk" ? "walk" : "drive";
      return { minutes: live.minutes, meters: live.meters, label: `${live.minutes} min ${word} from ${fromName}` };
    }
    if (!router.down && meters > 1800) return null;
  }
  const speed = brief.travelMode === "walk" ? 75 : 380;
  const minutes = Math.max(4, Math.round(meters / speed));
  if (minutes > maxMin) return null;
  const word = brief.travelMode === "walk" ? "walk" : "drive";
  return { minutes, meters: Math.round(meters), label: `about ${minutes} min ${word} from ${fromName}, estimated` };
}

function asLocked(lock: DatingQuery["locked"][number]): DatePlace {
  return {
    id: lock.placeId,
    name: lock.title,
    address: lock.address,
    lat: lock.latitude,
    lng: lock.longitude,
    role: lock.kind,
    setting: lock.setting,
    approxSgd: 0,
    cuisine: "",
    vibes: [],
    diets: [],
    alcohol: false,
    opening: "",
    source: "directory",
    blurb: "Kept from the stop you locked.",
  };
}

function claimLock(step: StepSpec, locks: DatingQuery["locked"]): DatingQuery["locked"][number] | null {
  const index = locks.findIndex((lock) => lock.kind === step.role);
  if (index < 0) return null;
  return locks.splice(index, 1)[0] ?? null;
}

function toPlanBrief(brief: DatingQuery) {
  return {
    dateType: brief.dateType,
    date: brief.date,
    startMin: brief.startMin,
    span: brief.span,
    budget: brief.budget,
    freeOnly: brief.freeOnly,
    setting: brief.setting,
    vibes: brief.vibes,
    foods: brief.foods,
    pressure: brief.pressure,
    formality: brief.formality,
    crowd: brief.crowd,
    area: brief.area,
    seen: brief.seen ?? [],
    rejected: brief.rejected ?? [],
    spin: brief.spin ?? brief.rejected?.length ?? 0,
  };
}

type Chosen = {
  place: DatePlace;
  minutes: number;
  meters: number;
  label: string;
  step: StepSpec;
  start: number;
  end: number;
};

function quietTalk(brief: DatingQuery): boolean {
  const cosy = brief.vibes.includes("cosy");
  const quiet = brief.vibes.includes("quiet");
  if (cosy && quiet) return true;
  const talk = brief.crowd === "avoid" || /\b(talk|conversation)\b/i.test(brief.text);
  return talk && (cosy || quiet);
}

function nearPasirRis(brief: DatingQuery): boolean {
  const blob = `${brief.area} ${brief.originAddress}`.toLowerCase();
  if (/pasir ris|loyang|downtown east/.test(blob)) return true;
  return distanceMeters(brief.latitude, brief.longitude, 1.37305, 103.9493) <= 4500;
}

function eastSide(brief: DatingQuery): boolean {
  const blob = `${brief.area} ${brief.originAddress} ${brief.text}`.toLowerCase();
  if (/pasir ris|tampines|bedok|changi|katong|siglap|joo chiat|joochiat|east coast|loyang|simei|geylang serai/.test(blob)) return true;
  return brief.longitude >= 103.88 && brief.latitude >= 1.29 && brief.latitude <= 1.43;
}

export async function searchDating(brief: DatingQuery): Promise<DatingResult> {
  const origin = { lat: brief.latitude, lng: brief.longitude };
  const bannedNames = [...new Set((brief.rejectedVenues ?? []).map((name) => name.trim()).filter(Boolean))].slice(0, 48);
  const rejected = [...new Set([...(brief.rejected ?? []), ...bannedNames])].slice(0, 48);
  const next: DatingQuery = { ...brief, seen: brief.seen ?? [], rejected, rejectedVenues: bannedNames };
  const widenReady = quietTalk(next) && nearPasirRis(next);
  const radius = Math.max(discoveryRadius(next), widenReady ? 12000 : 0);
  const [mapped, cast] = await Promise.all([fromMap(origin, radius), forecast(origin, brief.date)]);
  const weather = cast.weather;
  const outdoorOk = datingOutdoor(weather, next.startMin);
  const rule = durationRule(next.span);
  const rawPlaces = [...fromDirectory(origin, radius), ...mapped].map(asArea);
  const unique = dedupePlaces(rawPlaces).filter((place) => distanceMeters(origin.lat, origin.lng, place.lat, place.lng) <= radius);
  const byCategory: Record<string, number> = {};
  for (const place of unique) {
    const bucket = discoveryBucket(place);
    byCategory[bucket] = (byCategory[bucket] ?? 0) + 1;
  }
  const geographic = unique;
  const shortlist = balancePool(origin, geographic);
  const travelled = await withinTravel(next, origin, shortlist);
  const afterTravel = travelled.places;
  const afterOpening = afterTravel.filter((place) => openDuring(place, next.date, next.startMin, next.startMin + rule.max));
  const afterDate = afterOpening.filter((place) => allowed(place, next, outdoorOk));
  let pool = afterDate;
  let widened = false;
  if (widenReady && pool.filter(isConversational).length < 4) {
    const again = await withinTravel({ ...next, maxTravel: Math.max(next.maxTravel, 22) }, origin, shortlist);
    const have = new Set(pool.map((place) => place.id));
    const extra = again.places.filter((place) => (
      !have.has(place.id)
      && isConversational(place)
      && openDuring(place, next.date, next.startMin, next.startMin + rule.max)
      && allowed(place, next, outdoorOk)
    ));
    if (extra.length) {
      pool = [...pool, ...extra];
      widened = true;
    }
  }
  const vibeMatches = pool.filter((place) => next.vibes.length === 0 || place.vibes.some((vibe) => next.vibes.includes(vibe))).length;
  const discovery = {
    area: next.area,
    raw: rawPlaces.length,
    unique: unique.length,
    byCategory,
    afterGeographic: geographic.length,
    afterTravel: afterTravel.length,
    travelVerified: travelled.verified,
    afterOpeningHours: afterOpening.length,
    afterDateVibe: pool.length,
    vibeMatches,
    widened,
    passedToPlanner: pool.length,
  };
  console.info("[DATE DISCOVERY]", discovery);
  const planBrief = toPlanBrief(next);
  const shape = pickShape(planBrief);
  console.info("[DATE PLAN]", {
    planType: next.span,
    startTime: formatClock(next.startMin),
    targetDurationMinutes: rule.target,
    minimumEndTime: formatClock(next.startMin + rule.min),
    maximumEndTime: formatClock(next.startMin + rule.max),
    shape: shape.id,
    stops: shape.steps.length,
  });
  console.info("[dating-origin]", {
    name: brief.area,
    address: brief.originAddress,
    provider: brief.originProvider,
    id: brief.originId,
    latitude: brief.latitude,
    longitude: brief.longitude,
    shape: shape.id,
    pool: pool.length,
  });
  const router: Router = { down: false, cache: new Map() };
  const used = new Set<string>();
  const usedCuisines: string[] = [];
  const usedNames: string[] = [];
  const locks = [...next.locked];
  let here = origin;
  let fromName = brief.area;
  let spent = 0;
  let previousEnd: number | null = null;
  const chosen: Chosen[] = [];
  for (let index = 0; index < shape.steps.length; index += 1) {
    const step = shape.steps[index]!;
    const stepNow: StepSpec = outdoorOk === false && next.setting !== "mix" && next.setting !== "outdoor" && step.role === "scenic"
      ? { ...step, role: "activity", lean: step.lean === "move" ? "look" : step.lean }
      : step;
    const intended = nextStart(next.startMin, previousEnd, 0, stepNow.targetOffset);
    const lock = claimLock(stepNow, locks);
    const lockedPlace = lock ? pool.find((place) => place.id === lock.placeId) ?? asLocked(lock) : null;
    const ranked = lockedPlace
      ? [lockedPlace]
      : rankPlaces(pool.filter((place) => !used.has(place.id)), stepNow, {
          origin,
          here,
          first: chosen.length === 0,
          vibes: next.vibes,
          dateType: next.dateType,
          pressure: next.pressure,
          crowd: next.crowd,
          formality: next.formality,
          budget: next.budget,
          seen: next.seen,
          usedCuisines,
          usedNames,
          seed: `${shape.id}|${stepNow.lean}|${stepNow.targetOffset}|${next.date}|${planBrief.spin}|${fromName}`,
          minute: intended,
          date: next.date,
        }, next.rejected);
    const hop = chosen.length === 0 ? next.maxTravel : Math.min(next.maxTravel, next.tightSecondLeg ? 15 : next.span === "full" ? 35 : 25);
    const laterFood = shape.steps.slice(index).filter((item) => item.food).length - (stepNow.food ? 1 : 0);
    const room = Math.max(0, next.budget - spent);
    const ceiling = laterFood > 0 ? Math.max(0, room - laterFood * 16) : room;
    let picked: Chosen | null = null;
    let routed = 0;
    const attemptCap = 12;
    for (const place of ranked) {
      if (!lockedPlace && usedNames.some((name) => namesCollide(name, place.name))) continue;
      const couple = place.approxSgd > 0 ? place.approxSgd * 2 : 0;
      if (!lockedPlace && !next.freeOnly && couple > ceiling) continue;
      if (routed >= attemptCap) break;
      const meters = distanceMeters(here.lat, here.lng, place.lat, place.lng);
      if (!impossible(next.travelMode, meters, next.maxTravel)) routed += 1;
      const leg = (await travelLeg(next, here, fromName, place, hop, router))
        ?? (hop < next.maxTravel ? await travelLeg(next, here, fromName, place, next.maxTravel, router) : null);
      if (!leg) continue;
      if (outdoorOk === false && place.setting === "outdoor" && next.setting !== "mix") continue;
      const start = nextStart(next.startMin, previousEnd, leg.minutes, stepNow.targetOffset);
      const end = start + stepNow.minutes;
      if (end > 23 * 60 + 50) continue;
      if (next.span !== "full" && end > next.startMin + rule.max + 15) continue;
      picked = { place, minutes: leg.minutes, meters: leg.meters, label: leg.label, step: stepNow, start, end };
      break;
    }
    if (!picked) continue;
    console.info("[dating-leg]", { from: fromName, destination: picked.place.name, minutes: picked.minutes, meters: picked.meters, slot: clockSlot(picked.start, picked.place.role, picked.step.lean) });
    used.add(picked.place.id);
    const cuisine = picked.place.cuisine.split(/[;,]/)[0]?.trim().toLowerCase();
    if (cuisine) usedCuisines.push(cuisine);
    usedNames.push(normalName(picked.place.name));
    chosen.push(picked);
    if (picked.place.approxSgd > 0) spent += picked.place.approxSgd * 2;
    here = { lat: picked.place.lat, lng: picked.place.lng };
    fromName = picked.place.name;
    previousEnd = picked.end;
  }

  const kept: Chosen[] = [];
  for (const item of chosen) {
    if (item.start < next.startMin || item.end <= item.start) continue;
    const prev = kept[kept.length - 1];
    if (prev && item.start < prev.end) continue;
    if (kept.length >= rule.maxStops) break;
    if (next.span !== "full" && item.end - next.startMin > rule.max + 20) continue;
    kept.push(item);
  }

  const stops: DatingStop[] = kept.map((item) => {
    const slot = clockSlot(item.start, item.place.role, item.step.lean);
    const labeled = { ...item.step, slot };
    return {
      id: item.place.id,
      kind: item.place.role,
      title: placeTitle(item.place),
      address: listedAddress(item.place.address),
      latitude: item.place.lat,
      longitude: item.place.lng,
      startMin: item.start,
      endMin: item.end,
      setting: item.place.setting,
      travelMin: item.minutes,
      travelLabel: item.label,
      cost: item.place.approxSgd > 0 ? item.place.approxSgd : null,
      why: item.place.blurb,
      doThis: doThis(item.place, labeled, next.dateType),
      placeId: item.place.id,
      liveLabel: LIVE[item.step.lean],
      opening: item.place.opening,
      slot,
    };
  });

  const indoor = next.setting !== "indoor" && stops.some((stop) => stop.setting === "outdoor")
    ? rankPlaces(pool.filter((place) => place.setting === "indoor" && !used.has(place.id)), {
        role: "activity",
        minutes: 45,
        slot: "Rain",
        food: false,
        lean: "look",
        targetOffset: 0,
      }, {
        origin,
        here,
        first: false,
        vibes: next.vibes,
        dateType: next.dateType,
        pressure: next.pressure,
        crowd: next.crowd,
        formality: next.formality,
        budget: next.budget,
        seen: next.seen,
        usedCuisines,
        usedNames,
        seed: `${shape.id}|rain|${next.date}`,
        minute: next.startMin,
        date: next.date,
      }, next.rejected).slice(0, 4)
    : [];
  let backupPick: { place: DatePlace; minutes: number; meters: number; label: string } | null = null;
  for (const place of indoor) {
    const leg = await travelLeg(next, here, fromName, place, next.maxTravel, router);
    if (!leg) continue;
    backupPick = { place, ...leg };
    break;
  }
  const backup = backupPick
    ? { title: placeTitle(backupPick.place), address: listedAddress(backupPick.place.address), travelLabel: backupPick.label, setting: backupPick.place.setting }
    : null;
  const told = landedShape(stops, shape);
  const plan = stops.length
    ? narrateDate({ brief: planBrief, shape: told, stops, backupTitle: backup?.title ?? null, thin: mapped.length < 4 })
    : null;
  const score = kept.length
    ? scoreDating(kept.map((item) => item.place), {
        vibes: next.vibes,
        foods: next.foods,
        budget: next.budget,
        freeOnly: next.freeOnly,
        travelMin: kept[0]?.minutes ?? null,
        maxTravel: next.maxTravel,
        weatherOutdoor: outdoorOk,
        stops: kept.length,
      })
    : null;
  const known = stops.reduce((sum, stop) => sum + (stop.cost ?? 0), 0);
  const spend = known > 0 ? known * 2 : null;
  let why = datingAside(next, stops, outdoorOk, Boolean(weather?.thunder) || outdoorOk === false);
  const banLine = bannedNames.length ? `BANNED VENUES (Do NOT suggest these again): ${bannedNames.join(", ")}` : "";
  const eastLine = eastSide(next)
    ? `East conversational rooms already on the real list: ${eastConversationalNames().join(", ")}. Prefer that character over a hawker centre when one of them is in the stops. Do not invent a venue.`
    : "";
  if (stops.length) {
    const raw = await geminiJson(
      `${KAIROS_VOICE} Write one dry sentence as 月老, maximum 18 words, about this date's shape. Comment only on the JSON. Do not invent weather, times, prices, or places. No destiny, fate, soulmate, or love. No emoji. Do not mention a banned venue. Do not name a place that is not in the JSON titles.`,
      [banLine, eastLine, JSON.stringify({
        shape: shape.label,
        type: next.dateType,
        rerolled: bannedNames.length > 0,
        titles: stops.map((stop) => stop.title),
        weather: weather ? weather.windowNote : null,
      })].filter(Boolean).join("\n"),
      { type: "object", properties: { why: { type: "string" } } },
      80,
      DATE_GEMINI,
    );
    if (raw && typeof raw === "object" && "why" in raw && typeof raw.why === "string") why = clipVoice(raw.why, 18) || why;
  }
  const cupid = next.setting === "indoor"
    ? "月老 gives this one a quiet nod."
    : !weather
      ? "Timing looks good. The forecast did not come back."
      : weather.thunder || outdoorOk === false
        ? "Cupid approves, quietly. The weather still decides anything outdoors."
        : "月老 gives this one a quiet nod.";
  const widenNote = widened ? DATE_WIDEN_NOTE : "";
  return {
    weather,
    stops,
    backup,
    score,
    spend,
    why,
    cupid,
    eventsNote: [widenNote, plan?.note ?? ""].filter(Boolean).join(" "),
    understood: [
      next.dateType.replace("night", "date night"),
      told.label,
      next.vibes.length ? next.vibes.join(" · ") : "Open vibe",
      next.area,
      next.freeOnly ? "Free" : `≤ $${next.budget} for two`,
      weather ? `${weather.windowLabel}. ${weather.windowNote}.` : "Weather unavailable",
    ],
    plan,
    discovery,
    widenNote,
  };
}
