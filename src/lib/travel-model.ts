import { distanceMeters } from "@/lib/coord";
import { DEFAULT_HOTEL_PREFERENCES, emptyHotelMemory, rememberShortlist, shortlistHotels, type HotelMemory, type HotelPreferences, type HotelCandidate } from "@/lib/hotel-shortlist";
import type { CommercialProfile, PlacePhoto } from "@/lib/travel-photo";
import { legRecommendation } from "@/lib/travel-routing";
import { placeMatches, readableName, cleanTheme, englishAreaName, hasNonLatin, isGenericDayTheme, type PlaceNameRecord } from "@/lib/travel-names";
import type { PlaceStory } from "@/lib/travel-story";
import { addDays, dayLabel, explicitChildAges, hasYoungChild, type FoodPlanning, type TravelBalance, type TravelFocus, type TravelInterest, type TravelMove, type TravelPace, type TravelStyle } from "@/lib/travel";
import "@/lib/travel-playbook-facts";
import { anchorsForDestination, packFor, themeForArea } from "@/lib/travel-anchors";
import type { DayIntent, PlaybookAnchor, TripPlaybookView } from "@/lib/travel-playbook";

export const TRAVEL_MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
export const TRAVEL_MAP_CREDIT = "Map data © OpenStreetMap contributors. Tiles © OpenFreeMap.";
export const PLANNED_DAY_CAP = 7;

export type TravelArea = {
  name: string;
  latitude: number;
  longitude: number;
  countryCode?: string;
  /** South, west, north, east. */
  bbox?: [number, number, number, number];
};

export type ProviderState = "ok" | "empty" | "failed";

export type DiscoveryHealth = {
  osm: ProviderState;
  wikidata: ProviderState;
  hotels: ProviderState;
  note: string;
};

export type StopCategory =
  | "stay"
  | "attraction"
  | "museum"
  | "park"
  | "garden"
  | "viewpoint"
  | "landmark"
  | "historic"
  | "theme_park"
  | "zoo"
  | "aquarium"
  | "shopping"
  | "market"
  | "restaurant"
  | "cafe"
  | "nightlife"
  | "beach"
  | "family"
  | "transport"
  | "other";

export type Importance = "iconic" | "major" | "interest" | "local" | "optional";
export type ExcursionSpan = "none" | "half" | "full";
export type LegMode = "walk" | "taxi" | "drive" | "transit";
export type FoodRole = "meal-destination" | "route-fit" | "quick" | "cafe-break" | "scenic" | "local-specialty" | "meal-window";
export type MealSlot = "breakfast" | "lunch" | "cafe" | "dinner";

export type HotelFacts = {
  airConditioning: "yes" | "no" | "unknown";
  stars: string;
  internet: string;
  breakfast: string;
  parking: string;
  wheelchair: string;
  roomSize: string;
  kind?: string;
};

export type TripStop = {
  id: string;
  provider: "osm" | "area" | "wikidata";
  providerId: string;
  name: string;
  category: StopCategory;
  address: string;
  lat: number;
  lng: number;
  day: number | null;
  startTime: string | null;
  endTime: string | null;
  duration: number;
  bookingStatus: "none" | "needed" | "booked";
  bucket: "scheduled" | "must" | "saved" | "food" | "maybe";
  indoor: boolean;
  area: string;
  note: string;
  opening: string;
  localName?: string;
  description?: string;
  image?: string;
  imagePage?: string;
  photo?: PlacePhoto;
  wikidataId?: string;
  commonsFile?: string;
  commonsCategory?: string;
  wikipedia?: string;
  mapillaryId?: string;
  panoramaxId?: string;
  website?: string;
  region?: string;
  commerce?: CommercialProfile;
  sitelinks?: number;
  importance?: Importance;
  groups?: string[];
  excursion?: ExcursionSpan;
  distanceKm?: number;
  hotel?: HotelFacts;
  sourceNote?: string;
  why?: string;
  story?: PlaceStory;
  photos?: PlacePhoto[];
  locality?: string;
  foodRole?: FoodRole;
  meal?: MealSlot;
  kept?: boolean;
  excluded?: boolean;
} & PlaceNameRecord;

export type LegAlt = {
  mode: LegMode;
  minutes: number | null;
  meters: number | null;
  source: "osrm" | "estimate" | "none" | "unavailable";
  label: string;
  transfers?: number | null;
  walkingMinutes?: number | null;
  quality?: "realtime" | "scheduled" | "routing_estimate" | "approximate" | "unavailable";
  provider?: string;
};

export type TripLeg = {
  fromId: string;
  toId: string;
  day: number;
  mode: TravelMove;
  minutes: number | null;
  meters: number | null;
  source: "osrm" | "estimate" | "none";
  label: string;
  shown?: LegMode;
  alternatives?: LegAlt[];
  recommendedMode?: LegMode;
  recommendationReason?: string;
  selectedMode?: LegMode;
  planningProvider?: string;
};

export type TripBooking = {
  id: string;
  kind: "flight" | "hotel" | "train" | "reservation" | "ticket" | "other";
  name: string;
  reference: string;
  when: string;
  address: string;
  notes: string;
  link: string;
};

export type TravelDayType = "ARRIVAL_DAY" | "DEPARTURE_DAY" | "FULL_DAY" | "HALF_DAY" | "EXCURSION_DAY" | "FREE_DAY" | "REST_DAY";

export type HotelSelectionSource = "NONE" | "USER_SELECTED" | "USER_BOOKED" | "IMPORT";

export type TripDay = {
  index: number;
  date: string;
  label: string;
  weather: string;
  outdoorOk: boolean | null;
  locked: boolean;
  area: string;
  line: [number, number][] | null;
  freeNote: string;
  /** Playbook day title, when the day was shaped before the place list. */
  intent?: string;
  /** What the day is about. The UI formats this once. */
  theme?: string;
  dayType?: TravelDayType;
  requiredGroups?: string[];
  focusLat?: number;
  focusLng?: number;
};

export type BaseOption = {
  id: string;
  label: string;
  hotelChanges: number;
  lostMinutes: number;
  note: string;
  chosen: boolean;
};

export type TravelBurden = {
  transitMinutes: number;
  hops: number;
  longHops: number;
  hotelChanges: number;
  early: boolean;
  late: boolean;
  density: "light" | "steady" | "heavy";
  line: string;
};

export type CoverageRow = {
  group: string;
  status: "covered" | "omitted" | "optional";
  reason: string;
  example: string;
};

export type HotelPick = {
  stopId: string;
  name: string;
  role: string;
  why: string;
  reasons: string[];
  tradeoffs: string[];
  matches: { label: string; state: "met" | "unverified" }[];
  unverified: string[];
  location: string;
  averageMin: number;
  longestMin: number;
  booked: boolean;
};

export type Trip = {
  id: string;
  title: string;
  destination: string;
  areas: TravelArea[];
  start: string;
  nights: number;
  adults: number;
  childAges: number[];
  pace: TravelPace;
  move: TravelMove;
  oneBase: boolean;
  days: TripDay[];
  stops: TripStop[];
  legs: TripLeg[];
  bookings: TripBooking[];
  bases: BaseOption[];
  burden: TravelBurden;
  voice: string;
  notes: string[];
  cluster: string;
  unmatched: string[];
  placeNote: string;
  transitNote: string;
  styles?: TravelStyle[];
  balance?: TravelBalance;
  firstVisit?: boolean;
  coverage?: CoverageRow[];
  whyTrip?: string;
  hotels?: HotelPick[];
  hotelPreferences?: HotelPreferences;
  hotelMemory?: HotelMemory;
  hotelNote?: string;
  profileNote?: string;
  countryCode?: string;
  discovery?: DiscoveryHealth;
  interests?: TravelInterest[];
  foodPlanning?: FoodPlanning;
  /** True once the Travel form, not a blank ages box, set the party. */
  partyExplicit?: boolean;
  playbook?: TripPlaybookView;
  /** Exact properties are never chosen unless the traveller did. */
  hotelSelectionSource?: HotelSelectionSource;
  curation?: CurationReport;
};

export type CurationReport = {
  anchorStops: number;
  osmStops: number;
  groupsSatisfied: string[];
  groupsMissing: string[];
  thinRepairs: number;
  fallback: string[];
};

export type DiscoveredPlace = {
  id: string;
  provider: "osm" | "wikidata";
  providerId: string;
  name: string;
  category: StopCategory;
  address: string;
  lat: number;
  lng: number;
  indoor: boolean;
  area: string;
  opening: string;
  localName?: string;
  description?: string;
  image?: string;
  imagePage?: string;
  photo?: PlacePhoto;
  wikidataId?: string;
  commonsFile?: string;
  commonsCategory?: string;
  wikipedia?: string;
  mapillaryId?: string;
  panoramaxId?: string;
  website?: string;
  region?: string;
  commerce?: CommercialProfile;
  sitelinks?: number;
  mentioned?: boolean;
  importance?: Importance;
  groups?: string[];
  excursion?: ExcursionSpan;
  distanceKm?: number;
  hotel?: HotelFacts;
  sourceNote?: string;
  story?: PlaceStory;
  photos?: PlacePhoto[];
  locality?: string;
  /** Minutes from the playbook anchor, when the place was not timed by a story. */
  visitMinutes?: number;
} & PlaceNameRecord;

const FOOD = new Set<StopCategory>(["restaurant", "cafe", "market", "nightlife"]);
const SEE = new Set<StopCategory>(["attraction", "museum", "park", "garden", "viewpoint", "landmark", "historic", "theme_park", "zoo", "aquarium", "shopping", "beach", "family"]);

export function clockTime(minutes: number): string {
  const day = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(day / 60)).padStart(2, "0")}:${String(day % 60).padStart(2, "0")}`;
}

export function displayClock(minutesOrClock: number | string): string {
  const minutes = typeof minutesOrClock === "number" ? minutesOrClock : clockToMinutes(minutesOrClock);
  const day = ((minutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(day / 60);
  const minute = day % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 || 12;
  return `${hour}:${String(minute).padStart(2, "0")} ${period}`;
}

export function durationPhrase(minutes: number): string {
  const value = Math.max(0, Math.round(minutes));
  if (value < 60) return `${value} min`;
  const hours = Math.floor(value / 60);
  const rest = value % 60;
  const hourLabel = hours === 1 ? "1 hr" : `${hours} hr`;
  return rest ? `${hourLabel} ${rest} min` : hourLabel;
}

/** A usable gap before evening. Empty when the day already runs late. */
export function freeWindow(endTime: string): string {
  const end = clockToMinutes(endTime);
  if (!Number.isFinite(end) || end >= 16 * 60 || end < 8 * 60) return "";
  const until = 18 * 60 + 30;
  const gap = until - end;
  if (gap < 90) return "";
  return `${displayClock(end)}–${displayClock(until)} · ${durationPhrase(gap)}`;
}

export function forecastLocal(iso: string, lng: number): { date: string; hour: number } {
  const time = new Date(iso).getTime();
  if (!Number.isFinite(time)) return { date: "", hour: 0 };
  const shift = Math.round(lng / 15) * 60 * 60 * 1000;
  const local = new Date(time + shift);
  return { date: local.toISOString().slice(0, 10), hour: local.getUTCHours() };
}

export function categoryFromTags(tags: Record<string, string>): { category: StopCategory; indoor: boolean } | null {
  if (isContainerTags(tags)) return null;
  const tourism = tags.tourism ?? "";
  const leisure = tags.leisure ?? "";
  const amenity = tags.amenity ?? "";
  const historic = tags.historic ?? "";
  const shop = tags.shop ?? "";
  if (tourism === "hotel" || tourism === "guest_house" || tourism === "hostel") return { category: "stay", indoor: true };
  if (tourism === "museum" || tourism === "gallery") return { category: "museum", indoor: true };
  if (tourism === "theme_park") return { category: "theme_park", indoor: false };
  if (tourism === "zoo") return { category: "zoo", indoor: false };
  if (tourism === "aquarium") return { category: "aquarium", indoor: true };
  if (tourism === "viewpoint") return { category: "viewpoint", indoor: false };
  if (tourism === "attraction") return { category: "attraction", indoor: false };
  if (leisure === "park" || leisure === "nature_reserve") return { category: "park", indoor: false };
  if (leisure === "garden") return { category: "garden", indoor: false };
  if (leisure === "beach_resort" || tags.natural === "beach") return { category: "beach", indoor: false };
  if (historic === "castle" || historic === "monument" || historic === "ruins" || historic === "memorial" || historic === "temple" || historic === "church" || historic === "cathedral" || historic === "monastery" || historic === "palace" || historic === "city_gate" || historic === "fort") return { category: "historic", indoor: historic === "church" || historic === "cathedral" || historic === "monastery" || historic === "palace" };
  if (tags.building === "cathedral" || tags.building === "church" || tags.building === "basilica" || tags.building === "chapel") return { category: "historic", indoor: true };
  if (tags.building === "triumphal_arch") return { category: "landmark", indoor: false };
  if (tags.man_made === "tower" || tags.man_made === "obelisk") return { category: "attraction", indoor: false };
  if (amenity === "arts_centre" || amenity === "theatre") return { category: "attraction", indoor: true };
  if (amenity === "marketplace" || shop === "mall" || shop === "department_store") return { category: shop ? "shopping" : "market", indoor: true };
  if (amenity === "restaurant") return { category: "restaurant", indoor: true };
  if (amenity === "cafe") return { category: "cafe", indoor: true };
  if (amenity === "bar" || amenity === "pub" || amenity === "nightclub") return { category: "nightlife", indoor: true };
  if (amenity === "bus_station" || amenity === "ferry_terminal" || tags.railway === "station") return { category: "transport", indoor: true };
  return null;
}

const CONTAINER_PLACE = new Set(["city", "town", "village", "municipality", "suburb", "quarter", "neighbourhood", "neighborhood", "borough", "hamlet", "district", "county", "state", "province", "region", "country"]);

/** Administrative places are containers. A city tagged as an attraction is still a city. */
export function isContainerTags(tags: Record<string, string>): boolean {
  const place = (tags.place || "").toLowerCase();
  if (CONTAINER_PLACE.has(place)) return true;
  if ((tags.boundary || "") === "administrative" && !tags.tourism && !tags.historic && !tags.amenity && !tags.leisure) return true;
  return false;
}

/** Wikidata cities arrive as "city in …". They must not become timed stops. */
export function isAreaPlace(spot: { description?: string; provider?: string }): boolean {
  const description = (spot.description ?? "").trim().toLowerCase();
  if (/^(city|town|village|municipality|ward|special ward|prefecture|county|province|metropolis|human settlement|tourist destination)\b/.test(description)) return true;
  return false;
}

export function estimateMinutes(move: TravelMove, meters: number): number {
  if (meters < 80) return 1;
  const perMin = move === "walk" ? 75 : 450;
  return Math.max(1, Math.round(meters / perMin));
}

export function legLabel(move: TravelMove, minutes: number | null, source: TripLeg["source"]): string {
  if (minutes == null || source === "none") return "Route unavailable";
  if (move === "walk") return source === "estimate" ? `Walk · about ${minutes} min · estimated` : `Walk · ${minutes} min`;
  if (move === "drive") return source === "estimate" ? `Drive · about ${minutes} min · estimated` : `Drive · ${minutes} min`;
  return source === "estimate" ? `Taxi · about ${minutes} min · estimated road time, not a timetable` : `Taxi · ${minutes} min · road time, not a timetable`;
}

export function itineraryRequestPlan(areas: number, days: number): { overpass: number; weather: number; matrix: number; routes: number; llm: number; total: number } {
  const overpass = Math.max(1, Math.min(3, areas));
  const routes = Math.max(1, Math.min(PLANNED_DAY_CAP, days));
  const plan = { overpass, weather: 1, matrix: 1, routes, llm: 2, total: 0 };
  plan.total = plan.overpass + plan.weather + plan.matrix + plan.routes + plan.llm;
  return plan;
}

function liked(category: StopCategory, interests: TravelInterest[], children: boolean): boolean {
  if (children && (category === "zoo" || category === "aquarium" || category === "theme_park" || category === "park")) return true;
  if (!interests.length) return true;
  const table: Record<TravelInterest, StopCategory[]> = {
    food: ["restaurant", "cafe", "market", "nightlife"],
    nature: ["park", "garden", "viewpoint", "beach"],
    culture: ["museum", "historic", "landmark", "attraction"],
    beach: ["beach"],
    walks: ["park", "garden", "viewpoint"],
    shopping: ["shopping", "market"],
    night: ["nightlife"],
  };
  return interests.some((interest) => table[interest].includes(category));
}

export function compareBases(areas: { name: string }[], transfers: (number | null)[][] | null, oneBase: boolean, nights: number): { mode: "single" | "split"; options: BaseOption[] } {
  const name = areas[0]?.name || "the city";
  if (areas.length <= 1) {
    return {
      mode: "single",
      options: [{ id: "one", label: `Stay in ${name}`, hotelChanges: 0, lostMinutes: 0, note: "One city, so the bag stays put.", chosen: true }],
    };
  }
  const hop = (from: number, to: number) => {
    const value = transfers?.[from]?.[to];
    return typeof value === "number" && value >= 0 ? value : null;
  };
  let dayTrip = 0;
  let dayKnown = true;
  for (let index = 1; index < areas.length; index += 1) {
    const there = hop(0, index);
    const back = hop(index, 0);
    if (there == null || back == null) dayKnown = false;
    else dayTrip += there + back;
  }
  let splitCost = 0;
  let splitKnown = true;
  for (let index = 1; index < areas.length; index += 1) {
    const leg = hop(index - 1, index);
    if (leg == null) splitKnown = false;
    else splitCost += leg + 90;
  }
  const changes = areas.length - 1;
  const single: BaseOption = {
    id: "one",
    label: `${name} base, other cities as day trips`,
    hotelChanges: 0,
    lostMinutes: dayTrip,
    note: dayKnown
      ? `Day trips add about ${dayTrip} min of transfers, there and back. The bag stays in ${name}.`
      : "Transfer times were missing, so the day-trip cost is only a sketch.",
    chosen: false,
  };
  const split: BaseOption = {
    id: "split",
    label: areas.map((area) => area.name).join(" → "),
    hotelChanges: changes,
    lostMinutes: splitCost,
    note: splitKnown
      ? `${changes} hotel change${changes === 1 ? "" : "s"}. Checkout, luggage, and check-in are counted, not just the kilometres.`
      : "The hotel-change time could not be routed.",
    chosen: false,
  };
  let mode: "single" | "split" = "single";
  if (!oneBase && nights >= 4 && dayKnown && splitKnown && splitCost + 20 < dayTrip) mode = "split";
  if (oneBase || !dayKnown) mode = "single";
  if (mode === "single" && dayKnown && dayTrip > 150) single.note += " Possible, but the transfer is tiring.";
  single.chosen = mode === "single";
  split.chosen = mode === "split";
  return { mode, options: [single, split] };
}

function areaPlan(count: number, days: number, mode: "single" | "split"): number[] {
  if (mode === "split") {
    const span = Math.max(1, Math.ceil(days / count));
    return Array.from({ length: days }, (_, index) => Math.min(count - 1, Math.floor(index / span)));
  }
  const plan = Array.from({ length: days }, () => 0);
  let slot = days > 2 ? 1 : 0;
  for (let area = 1; area < count && slot < days; area += 1) {
    if (days > 2 && slot === days - 1) break;
    plan[slot] = area;
    slot += 2;
  }
  return plan;
}

function rejectedName(spot: { name: string; displayName?: string; nameEnglish?: string; nameLocal?: string; localName?: string; nameRomanized?: string }, rejected: Set<string>): boolean {
  return [spot.name, spot.displayName, spot.nameEnglish, spot.nameLocal, spot.localName, spot.nameRomanized]
    .some((value) => value && rejected.has(value.toLowerCase()));
}

function askedFor(spot: DiscoveredPlace, names: string[]): boolean {
  return names.some((name) => name.trim().length >= 2 && placeMatches(spot, name));
}

function areaDayStop(intent: DayIntent, day: number): TripStop {
  const why = "A full day here. It is not a short stop on the way to somewhere else.";
  return {
    id: `playbook:${intent.nodeId}:d${day}`,
    provider: "area",
    providerId: intent.nodeId,
    name: intent.title,
    category: "attraction",
    address: intent.areaName,
    lat: intent.latitude,
    lng: intent.longitude,
    day,
    startTime: null,
    endTime: null,
    duration: 300,
    bookingStatus: "none",
    bucket: "scheduled",
    indoor: false,
    area: intent.areaName,
    note: why,
    opening: "",
    importance: "major",
    groups: intent.groups,
    excursion: "full",
    why,
    displayName: intent.title,
    locality: intent.areaName,
  };
}

function anchorTier(note?: string): PlaybookAnchor["tier"] | "" {
  const match = /playbook-anchor:(core|strong|optional|niche)/.exec(note ?? "");
  return (match?.[1] as PlaybookAnchor["tier"]) || "";
}

function isAnchorNote(note?: string): boolean {
  return (note ?? "").includes("playbook-anchor");
}

function normPlace(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "");
}

function sameAnchor(left: { name: string; lat: number; lng: number; displayName?: string; nameEnglish?: string }, right: { name: string; lat: number; lng: number }): boolean {
  const other = normPlace(right.name);
  if (other.length < 4) return false;
  const names = [left.name, left.displayName, left.nameEnglish].map((value) => normPlace(value || "")).filter((value) => value.length >= 4);
  const nameHit = names.some((name) => name === other || name.includes(other) || other.includes(name));
  if (!nameHit) return false;
  return distanceMeters(left.lat, left.lng, right.lat, right.lng) < 1800;
}

function discoveredAnchor(place: PlaybookAnchor): DiscoveredPlace {
  const importance: Importance = place.tier === "core" ? "iconic" : place.tier === "strong" ? "major" : place.tier === "optional" ? "interest" : "local";
  return {
    id: `anchor:${place.id}`,
    provider: "wikidata",
    providerId: place.wikidataId ? `wd:${place.wikidataId}` : place.id,
    name: place.name,
    category: place.category,
    address: place.areaName,
    lat: place.lat,
    lng: place.lng,
    indoor: place.indoor,
    area: place.areaName,
    opening: "",
    localName: place.localName,
    nameLocal: place.localName,
    wikidataId: place.wikidataId,
    importance,
    groups: place.groups,
    excursion: place.excursion,
    sourceNote: `playbook-anchor:${place.tier}`,
    locality: place.areaName,
    visitMinutes: place.duration,
    sitelinks: place.tier === "core" ? 40 : place.tier === "strong" ? 18 : 8,
    mentioned: place.tier === "core" || place.tier === "strong",
  };
}

function mergeAnchorSpots(spots: DiscoveredPlace[], anchors: DiscoveredPlace[]): DiscoveredPlace[] {
  const next = spots.map((spot) => ({ ...spot }));
  for (const anchor of anchors) {
    const hit = next.find((spot) => sameAnchor(spot, anchor));
    if (!hit) {
      next.push(anchor);
      continue;
    }
    hit.groups = [...new Set([...(hit.groups ?? []), ...(anchor.groups ?? [])])];
    if (!hit.importance || hit.importance === "local" || hit.importance === "optional") hit.importance = anchor.importance;
    hit.sourceNote = isAnchorNote(hit.sourceNote) ? hit.sourceNote : `${hit.sourceNote ? `${hit.sourceNote}; ` : ""}playbook-anchor:${anchorTier(anchor.sourceNote) || "strong"}`;
    hit.visitMinutes = hit.visitMinutes ?? anchor.visitMinutes;
    hit.wikidataId = hit.wikidataId || anchor.wikidataId;
    hit.localName = hit.localName || anchor.localName;
    hit.nameLocal = hit.nameLocal || anchor.nameLocal;
    if (!hit.excursion || hit.excursion === "none") hit.excursion = anchor.excursion;
  }
  return next;
}

function familyFit(spot: DiscoveredPlace, youngest: number): boolean {
  const family = (spot.groups ?? []).includes("family") || spot.category === "zoo" || spot.category === "aquarium" || spot.category === "theme_park";
  if (youngest <= 5) return family || spot.category === "park" || spot.category === "garden";
  if (youngest <= 8) return family || spot.category === "park" || spot.category === "attraction";
  return family || spot.category === "museum" || spot.category === "viewpoint";
}

function stopsForIntent(intent: DayIntent, spots: DiscoveredPlace[], used: Set<string>, count: number, salt: number, ages: number[], firstVisit: boolean): DiscoveredPlace[] {
  const radius = intent.visitMode === "DAY_TRIP" || intent.visitMode === "EXCURSION" ? Math.max(18000, intent.radiusKm * 1000) : 16000;
  const areaName = intent.areaName.trim().toLowerCase();
  const required = new Set(intent.requiredGroups?.length ? intent.requiredGroups : intent.groups);
  const wantsFood = required.has("food") || intent.groups.includes("food") || intent.role === "food";
  const wantsFamily = ages.length > 0 && (required.has("family") || intent.groups.includes("family") || intent.role === "family");
  const candidates = spots.filter((spot) => {
    if (used.has(spot.id) || isAreaPlace(spot)) return false;
    if (spot.name.trim().toLowerCase() === areaName) return false;
    if (isAnchorNote(spot.sourceNote) && spot.locality && areaName && spot.locality.toLowerCase() !== areaName) return false;
    const visible = SEE.has(spot.category) || (wantsFood && spot.category === "market");
    if (!visible) return false;
    return distanceMeters(intent.latitude, intent.longitude, spot.lat, spot.lng) <= radius;
  });
  const hinted = (spot: DiscoveredPlace) => intent.hints.some((hint) => {
    const needle = hint.toLowerCase();
    if (needle.length < 3) return false;
    return [spot.name, spot.displayName, spot.locality, spot.nameEnglish, spot.localName].some((value) => (value || "").toLowerCase().includes(needle));
  });
  const grouped = (spot: DiscoveredPlace) => {
    const groups = spot.groups ?? [];
    if ([...required].some((group) => groups.includes(group))) return true;
    if (intent.groups.some((group) => groups.includes(group))) return true;
    if (wantsFamily && familyFit(spot, Math.min(...ages))) return true;
    if (wantsFood && (spot.category === "market" || spot.category === "shopping" || groups.includes("food"))) return true;
    if (intent.role === "icons" && (spot.importance === "iconic" || spot.importance === "major")) return true;
    if ((intent.role === "nature" || intent.role === "regional" || required.has("nature")) && (groups.includes("nature") || groups.includes("wildlife") || groups.includes("views") || spot.category === "park" || spot.category === "viewpoint" || spot.category === "garden")) return true;
    if ((intent.role === "heritage" || intent.role === "day-trip" || required.has("heritage")) && (spot.category === "historic" || spot.category === "museum" || spot.category === "landmark" || groups.includes("heritage"))) return true;
    return false;
  };
  const score = (spot: DiscoveredPlace) => {
    let value = 0;
    const tier = anchorTier(spot.sourceNote);
    const anchorId = spot.id.replace(/^anchor:/, "");
    const listed = (intent.anchorIds ?? []).includes(anchorId);
    if (isAnchorNote(spot.sourceNote)) value += listed || !(intent.anchorIds ?? []).length ? 36 : 8;
    if (tier === "core") value += firstVisit ? 28 : 6;
    else if (tier === "strong") value += 16;
    else if (tier === "niche") value -= 18;
    if (!firstVisit && tier === "core") value -= 10;
    if (hinted(spot)) value += 50;
    if (grouped(spot)) value += 20;
    if (spot.importance === "iconic") value += 12;
    else if (spot.importance === "major") value += 8;
    else if (spot.importance === "interest") value += 3;
    if (wantsFamily && familyFit(spot, Math.min(...ages))) value += ages.some((age) => age <= 8) ? 24 : 12;
    if ((required.has("heritage") || intent.groups.includes("heritage")) && (spot.category === "historic" || spot.category === "museum")) value += 14;
    if ((required.has("nature") || intent.groups.includes("nature")) && (spot.category === "park" || spot.category === "garden" || spot.category === "viewpoint" || (spot.groups ?? []).includes("nature"))) value += 14;
    if (wantsFood && (spot.groups ?? []).includes("food")) value += 18;
    value -= Math.min(20, distanceMeters(intent.latitude, intent.longitude, spot.lat, spot.lng) / 2000);
    return value;
  };
  const ranked = [...candidates].sort((a, b) => {
    const delta = score(b) - score(a);
    if (Math.abs(delta) > 3) return delta;
    return ((a.name.length + salt) % 5) - ((b.name.length + salt) % 5);
  });
  const preferred = ranked.filter((spot) => hinted(spot) || grouped(spot) || isAnchorNote(spot.sourceNote) || spot.importance === "iconic" || spot.importance === "major");
  const pool = (preferred.length ? preferred : ranked).filter((spot) => spot.importance !== "local" || isAnchorNote(spot.sourceNote));
  const list = pool.length ? pool : ranked;
  const nearKm = intent.visitMode === "DAY_TRIP" || intent.visitMode === "EXCURSION" ? 8000 : 5000;
  const picked: DiscoveredPlace[] = [];
  const covered = new Set<string>();
  for (const spot of list) {
    if (picked.length >= count) break;
    const near = !picked.length || picked.some((item) => distanceMeters(item.lat, item.lng, spot.lat, spot.lng) <= nearKm);
    if (!near) continue;
    const groups = spot.groups ?? [];
    const helps = !picked.length || groups.some((group) => required.has(group) && !covered.has(group));
    if (!helps && picked.length >= Math.min(2, count) && !isAnchorNote(spot.sourceNote) && spot.importance !== "iconic") continue;
    picked.push(spot);
    groups.forEach((group) => covered.add(group));
  }
  if (picked.length < Math.min(count, 2)) {
    for (const spot of list) {
      if (picked.length >= count) break;
      if (picked.some((item) => item.id === spot.id)) continue;
      const near = !picked.length || picked.some((item) => distanceMeters(item.lat, item.lng, spot.lat, spot.lng) <= nearKm);
      if (!near) continue;
      picked.push(spot);
    }
  }
  if (!wantsFamily || !ages.length) return picked.slice(0, count);
  const youngest = Math.min(...ages);
  if (picked.some((spot) => familyFit(spot, youngest))) return picked.slice(0, count);
  const extra = list.find((spot) => !picked.some((item) => item.id === spot.id) && familyFit(spot, youngest) && picked.some((item) => distanceMeters(item.lat, item.lng, spot.lat, spot.lng) <= nearKm));
  if (!extra) return picked.slice(0, count);
  if (picked.length < count) return [...picked, extra];
  const replaceAt = [...picked].reverse().findIndex((spot) => spot.importance !== "iconic");
  if (replaceAt < 0) return picked.slice(0, count);
  const index = picked.length - 1 - replaceAt;
  const swapped = [...picked];
  swapped[index] = extra;
  return swapped;
}

function nearestStay(area: TravelArea, spots: DiscoveredPlace[]): DiscoveredPlace | null {
  const stays = spots.filter((spot) => spot.category === "stay" && distanceMeters(area.latitude, area.longitude, spot.lat, spot.lng) < 12000);
  stays.sort((a, b) => distanceMeters(area.latitude, area.longitude, a.lat, a.lng) - distanceMeters(area.latitude, area.longitude, b.lat, b.lng));
  return stays[0] ?? null;
}

function placeStop(place: DiscoveredPlace, day: number | null, bucket: TripStop["bucket"], note: string): TripStop {
  const kind = place.visitMinutes
    ?? place.story?.suggestedVisitMinutes
    ?? (place.excursion === "full" ? 180 : place.excursion === "half" ? 150 : FOOD.has(place.category) ? 70 : place.category === "stay" ? 20 : 90);
  return {
    id: place.id,
    provider: place.provider,
    providerId: place.providerId,
    name: place.name,
    category: place.category,
    address: place.address,
    lat: place.lat,
    lng: place.lng,
    day,
    startTime: null,
    endTime: null,
    duration: kind,
    bookingStatus: "none",
    bucket,
    indoor: place.indoor,
    area: place.area,
    note,
    opening: place.opening,
    localName: place.localName || place.nameLocal,
    description: place.description,
    image: place.image,
    imagePage: place.imagePage,
    photo: place.photo,
    wikidataId: place.wikidataId,
    commonsFile: place.commonsFile,
    commonsCategory: place.commonsCategory,
    wikipedia: place.wikipedia,
    mapillaryId: place.mapillaryId,
    panoramaxId: place.panoramaxId,
    website: place.website,
    region: place.region,
    commerce: place.commerce,
    sitelinks: place.sitelinks,
    importance: place.importance,
    groups: place.groups,
    excursion: place.excursion,
    distanceKm: place.distanceKm,
    hotel: place.hotel,
    sourceNote: place.sourceNote,
    why: note,
    story: place.story,
    photos: place.photos,
    nameEn: place.nameEn,
    nameLatin: place.nameLatin,
    nameLocal: place.nameLocal || place.localName,
    nameEnglish: place.nameEnglish,
    nameRomanized: place.nameRomanized,
    displayName: place.displayName,
    displaySubtitle: place.displaySubtitle,
    language: place.language,
    translationSource: place.translationSource,
    displayNameQuality: place.displayNameQuality,
    descriptionDisplay: place.descriptionDisplay,
    addressLocal: place.addressLocal,
    addressDisplay: place.addressDisplay,
    locality: place.locality,
  };
}

function anchor(area: TravelArea): TripStop {
  return {
    id: `anchor-${area.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    provider: "area",
    providerId: "",
    name: `Suggested base area · ${area.name}`,
    category: "stay",
    address: area.name,
    lat: area.latitude,
    lng: area.longitude,
    day: null,
    startTime: null,
    endTime: null,
    duration: 20,
    bookingStatus: "none",
    bucket: "scheduled",
    indoor: true,
    area: area.name,
    note: "Suggested area. Not a hotel, and not a booking.",
    opening: "",
    displayName: area.name,
  };
}

function hopMinutes(move: TravelMove, from: { lat: number; lng: number }, to: { lat: number; lng: number }, matrix: (number | null)[][] | null, spots: DiscoveredPlace[]): { minutes: number | null; source: TripLeg["source"] } {
  if (matrix) {
    const left = spots.findIndex((spot) => spot.lat === from.lat && spot.lng === from.lng);
    const right = spots.findIndex((spot) => spot.lat === to.lat && spot.lng === to.lng);
    if (left >= 0 && right >= 0) {
      const value = matrix[left]?.[right];
      if (typeof value === "number") return { minutes: Math.max(1, Math.round(value)), source: "osrm" };
    }
  }
  return { minutes: estimateMinutes(move, distanceMeters(from.lat, from.lng, to.lat, to.lng)), source: "estimate" };
}

export function burdenFrom(legs: TripLeg[], hotelChanges: number, stops: TripStop[], move: TravelMove, child: boolean): TravelBurden {
  const known = legs.filter((leg) => leg.minutes != null);
  const transitMinutes = known.reduce((sum, leg) => sum + (leg.minutes ?? 0), 0);
  const cap = move === "walk" ? 25 : move === "transit" ? 50 : 35;
  const longHops = known.filter((leg) => (leg.minutes ?? 0) > cap).length;
  const starts = stops.filter((stop) => stop.day != null && stop.startTime).map((stop) => stop.startTime ?? "09:00");
  const ends = stops.filter((stop) => stop.day != null && stop.endTime).map((stop) => stop.endTime ?? "18:00");
  const early = starts.some((time) => time < "08:00");
  const late = ends.some((time) => time >= (child ? "19:30" : "21:00"));
  const scheduled = stops.filter((stop) => stop.day != null && stop.category !== "stay").length;
  const days = new Set(stops.filter((stop) => stop.day != null).map((stop) => stop.day)).size || 1;
  const per = scheduled / days;
  const density: TravelBurden["density"] = per <= 2 ? "light" : per <= 4 ? "steady" : "heavy";
  let line = hotelChanges === 0 ? "One stay. The days stay inside a sensible radius." : `${hotelChanges} hotel change${hotelChanges === 1 ? "" : "s"}. Packing is part of the cost.`;
  if (longHops >= 2 || transitMinutes > 180) line = "Possible, but unnecessarily tiring.";
  else if (hotelChanges >= 2) line = "A lot of packing for the distance saved.";
  return { transitMinutes, hops: legs.length, longHops, hotelChanges, early, late, density, line };
}

export function localTripVoice(burden: TravelBurden, wet: string): string {
  const sky = wet ? ` ${wet} looks wet, so that day stays indoors.` : "";
  return `${burden.line}${sky}`.replace(/\s+/g, " ").trim();
}

export function voiceStaysInside(line: string): boolean {
  const clean = line.replace(/\s+/g, " ").trim();
  if (clean.length < 12 || clean.length > 180) return false;
  if (/\b(guarantee|michelin|five-star|\$\d|\d+\s*%|opening hours are|rated\s+\d|book now)\b/i.test(clean)) return false;
  return true;
}

function orderPlaces(origin: { lat: number; lng: number }, pool: DiscoveredPlace[], count: number, salt: number, interests: TravelInterest[], children: boolean, pinned: DiscoveredPlace[], balance: TravelBalance, focus: TravelFocus): DiscoveredPlace[] {
  const rest = pool.filter((spot) => !pinned.some((pin) => pin.id === spot.id));
  rest.sort((a, b) => {
    const ar = focus === "local" ? 4 - importanceRank(a) : importanceRank(a);
    const br = focus === "local" ? 4 - importanceRank(b) : importanceRank(b);
    if (ar !== br) return ar - br;
    const ap = balancePenalty(a, balance);
    const bp = balancePenalty(b, balance);
    if (ap !== bp) return ap - bp;
    const ai = liked(a.category, interests, children) ? 0 : 1;
    const bi = liked(b.category, interests, children) ? 0 : 1;
    if (ai !== bi) return ai - bi;
    return distanceMeters(origin.lat, origin.lng, a.lat, a.lng) - distanceMeters(origin.lat, origin.lng, b.lat, b.lng);
  });
  const window = rest.slice(0, Math.min(rest.length, Math.max(count, 1) + 3));
  const start = window.length ? Math.abs(salt) % window.length : 0;
  const rotated = window.slice(start).concat(window.slice(0, start));
  return [...pinned, ...rotated].slice(0, Math.max(count, pinned.length));
}

function foodWhy(role: FoodRole, minutes: number, anchorName: string): string {
  const hop = anchorName && role !== "meal-window" ? ` About ${Math.max(1, Math.round(minutes))} min from ${anchorName}.` : "";
  if (role === "meal-window") return "A meal window in this area. Choose a restaurant when you are there.";
  if (role === "cafe-break") return `A short break that fits the pace.${hop}`;
  if (role === "quick") return `A quick meal so the rest of the day stays intact.${hop}`;
  if (role === "local-specialty") return `A food place that fits this part of the route.${hop}`;
  return `Convenient route-fit meal.${hop}`;
}

function nearestFood(spots: DiscoveredPlace[], anchor: { lat: number; lng: number }, used: Set<string>, kinds: StopCategory[], maxMeters: number): DiscoveredPlace | null {
  const rows = spots.filter((spot) => kinds.includes(spot.category) && !used.has(spot.id) && !isAreaPlace(spot) && distanceMeters(anchor.lat, anchor.lng, spot.lat, spot.lng) <= maxMeters);
  rows.sort((a, b) => distanceMeters(anchor.lat, anchor.lng, a.lat, a.lng) - distanceMeters(anchor.lat, anchor.lng, b.lat, b.lng));
  return rows[0] ?? null;
}

function mealWindow(day: number, meal: MealSlot, areaName: string, anchor: { lat: number; lng: number }): TripStop {
  const why = foodWhy("meal-window", 0, "");
  const name = meal === "dinner" ? `Dinner · ${areaName}` : meal === "cafe" ? `Coffee · ${areaName}` : `Lunch · ${areaName}`;
  return {
    id: `meal-${meal}-d${day}`,
    provider: "area",
    providerId: "",
    name,
    category: meal === "cafe" ? "cafe" : "restaurant",
    address: areaName,
    lat: anchor.lat,
    lng: anchor.lng,
    day,
    startTime: null,
    endTime: null,
    duration: meal === "cafe" ? 40 : 60,
    bookingStatus: "none",
    bucket: "scheduled",
    indoor: true,
    area: areaName,
    note: why,
    opening: "",
    why,
    foodRole: "meal-window",
    meal,
  };
}

function namedMeal(place: DiscoveredPlace, day: number, meal: MealSlot, role: FoodRole, why: string): TripStop {
  return {
    ...placeStop(place, day, "scheduled", why),
    id: `${place.id}-d${day}-${meal}`,
    duration: meal === "cafe" ? 40 : meal === "dinner" ? 80 : 70,
    foodRole: role,
    meal,
    why,
    note: why,
  };
}

function planDayMeals(input: {
  spots: DiscoveredPlace[];
  used: Set<string>;
  day: number;
  lastDay: boolean;
  excursionDay: boolean;
  pace: TravelPace;
  foodPlanning: FoodPlanning;
  child: boolean;
  slow: boolean;
  hasSights: boolean;
  anchor: { lat: number; lng: number };
  base: { lat: number; lng: number };
  areaName: string;
  anchorName: string;
  baseName: string;
}): { lunch: TripStop | null; cafe: TripStop | null; dinner: TripStop | null } {
  const none = { lunch: null, cafe: null, dinner: null };
  if (input.lastDay || !input.hasSights) return none;
  const areaName = input.areaName || "this area";
  let lunch: TripStop | null = null;
  if (input.foodPlanning === "minimal") {
    lunch = mealWindow(input.day, "lunch", areaName, input.anchor);
  } else {
    const max = input.foodPlanning === "feature" ? 4000 : 2200;
    const kinds: StopCategory[] = input.foodPlanning === "feature" ? ["restaurant", "market"] : ["restaurant"];
    let place = nearestFood(input.spots, input.anchor, input.used, kinds, max);
    if (input.foodPlanning === "feature") {
      const notable = input.spots.filter((spot) => kinds.includes(spot.category) && !input.used.has(spot.id) && (spot.importance === "major" || spot.importance === "iconic") && distanceMeters(input.anchor.lat, input.anchor.lng, spot.lat, spot.lng) <= max);
      notable.sort((a, b) => distanceMeters(input.anchor.lat, input.anchor.lng, a.lat, a.lng) - distanceMeters(input.anchor.lat, input.anchor.lng, b.lat, b.lng));
      if (notable[0]) place = notable[0];
    }
    if (place && (input.foodPlanning === "feature" || place.importance === "iconic" || place.importance === "major" || (place.sitelinks ?? 0) >= 8)) {
      const minutes = estimateMinutes("walk", distanceMeters(input.anchor.lat, input.anchor.lng, place.lat, place.lng));
      const role: FoodRole = input.foodPlanning === "feature" && (place.importance === "major" || place.importance === "iconic") ? "local-specialty" : input.pace === "full" ? "quick" : "route-fit";
      lunch = namedMeal(place, input.day, "lunch", role, foodWhy(role, minutes, input.anchorName));
      input.used.add(place.id);
    } else {
      lunch = mealWindow(input.day, "lunch", areaName, input.anchor);
    }
  }
  let cafe: TripStop | null = null;
  const wantCafe = !input.child && (input.foodPlanning === "feature" || (input.foodPlanning === "balanced" && (input.pace === "relaxed" || input.slow)));
  if (wantCafe) {
    const found = nearestFood(input.spots, input.anchor, input.used, ["cafe"], 1500);
    const notable = Boolean(found && (found.importance === "major" || found.importance === "iconic" || (found.sitelinks ?? 0) >= 8));
    if (found && (input.pace !== "full" || notable)) {
      const minutes = estimateMinutes("walk", distanceMeters(input.anchor.lat, input.anchor.lng, found.lat, found.lng));
      cafe = namedMeal(found, input.day, "cafe", "cafe-break", foodWhy("cafe-break", minutes, input.anchorName));
      input.used.add(found.id);
    }
  }
  let dinner: TripStop | null = null;
  if (!input.excursionDay && !input.child && input.pace !== "relaxed" && input.foodPlanning !== "minimal") {
    const place = nearestFood(input.spots, input.base, input.used, ["restaurant"], 2200);
    if (place && (place.importance === "iconic" || place.importance === "major" || (place.sitelinks ?? 0) >= 8)) {
      const minutes = estimateMinutes("walk", distanceMeters(input.base.lat, input.base.lng, place.lat, place.lng));
      dinner = namedMeal(place, input.day, "dinner", input.pace === "full" ? "quick" : "route-fit", foodWhy(input.pace === "full" ? "quick" : "route-fit", minutes, input.baseName));
      input.used.add(place.id);
    }
  }
  return { lunch, cafe, dinner };
}

export function buildTrip(input: {
  id?: string;
  destination: string;
  areas: TravelArea[];
  start: string;
  nights: number;
  adults: number;
  childAges: number[];
  pace: TravelPace;
  move: TravelMove;
  oneBase: boolean;
  interests: TravelInterest[];
  rejected: string[];
  mustVisit: string[];
  salt: number;
  lockedDates: string[];
  spots: DiscoveredPlace[];
  weather: { date: string; outdoorOk: boolean | null; summary: string }[];
  matrix?: (number | null)[][] | null;
  transfers?: (number | null)[][] | null;
  styles?: TravelStyle[];
  balance?: TravelBalance;
  firstVisit?: boolean;
  focus?: TravelFocus;
  foodPlanning?: FoodPlanning;
  profileNote?: string;
  countryCode?: string;
  discovery?: DiscoveryHealth;
  skeleton?: DayIntent[];
  playbook?: TripPlaybookView;
}): Trip {
  const areas = input.areas.filter((area) => Number.isFinite(area.latitude) && Number.isFinite(area.longitude)).slice(0, 3);
  const primary = areas[0] ?? { name: input.destination, latitude: 0, longitude: 0 };
  const rejected = new Set(input.rejected.map((name) => name.toLowerCase()));
  const namedDestination = englishAreaName(input.destination, input.destination);
  const rawSpots = input.spots.filter((spot) => !rejectedName(spot, rejected) && Number.isFinite(spot.lat) && Number.isFinite(spot.lng) && !isAreaPlace(spot));
  const outside = rawSpots.filter((spot) => SEE.has(spot.category));
  const anchorSpots = (input.skeleton?.length || outside.length === 0)
    ? anchorsForDestination(namedDestination === "this area" ? input.destination : namedDestination).map(discoveredAnchor)
    : [];
  const spots = mergeAnchorSpots(rawSpots, anchorSpots.filter((spot) => !rejectedName(spot, rejected)));
  const nights = Math.max(1, Math.min(90, input.nights));
  const planned = Math.min(PLANNED_DAY_CAP, nights);
  const childAges = explicitChildAges(input.childAges);
  const child = hasYoungChild(childAges);
  const styles = input.styles?.length ? input.styles.slice(0, 2) : ["comfort" as TravelStyle];
  const balance = input.balance ?? "balanced";
  const firstVisit = input.firstVisit !== false;
  const focus = input.focus ?? "icons";
  const foodPlanning = input.foodPlanning ?? "balanced";
  const slow = styles.includes("slow") || styles.includes("wellness");
  const sightPool = spots.filter((spot) => SEE.has(spot.category));
  if (!sightPool.length && !input.skeleton?.length) return unloadedTrip(input, areas.length ? areas : [primary], primary, nights, planned, styles, balance, firstVisit, spots);
  const stay = compareBases(
    areas.length ? areas : [primary],
    input.transfers ?? areas.map((from) => areas.map((to) => from === to ? 0 : estimateMinutes("drive", distanceMeters(from.latitude, from.longitude, to.latitude, to.longitude)))),
    input.oneBase,
    nights,
  );
  const assignment = areaPlan(Math.max(1, areas.length), planned, stay.mode);
  if (input.skeleton?.length) {
    const stayOrder: string[] = [];
    for (const day of input.skeleton) if (!stayOrder.includes(day.stayName)) stayOrder.push(day.stayName);
    if (stayOrder.length > 1) {
      const changes = input.skeleton.reduce((count, day, index) => count + (index > 0 && day.stayName !== input.skeleton?.[index - 1]?.stayName ? 1 : 0), 0);
      stay.mode = "split";
      stay.options = [{
        id: "route",
        label: stayOrder.join(" → "),
        hotelChanges: changes,
        lostMinutes: 0,
        note: input.playbook?.hotelNote || `${changes} hotel change${changes === 1 ? "" : "s"}. The nights are too far apart for one hotel.`,
        chosen: true,
      }];
    } else if (input.playbook?.hotelNote) {
      stay.options = stay.options.map((option) => option.chosen ? { ...option, note: input.playbook?.hotelNote || option.note } : option);
    }
  }
  const used = new Set<string>();
  const unmatched = input.mustVisit.filter((name) => !rejected.has(name.toLowerCase()) && !input.spots.some((spot) => askedFor(spot, [name])));
  const stops: TripStop[] = [];
  const legs: TripLeg[] = [];
  const days: TripDay[] = [];
  const reps = focus === "local" || !firstVisit ? [] : representatives(spots, balance, styles, planned);

  for (let index = 0; index < planned; index += 1) {
    const date = addDays(input.start, index);
    const sky = input.weather.find((day) => day.date === date);
    const intent = input.skeleton?.[index];
    const area = intent
      ? { name: englishAreaName(intent.stayName, input.destination), latitude: intent.stayLatitude, longitude: intent.stayLongitude, countryCode: intent.countryCode }
      : (areas[assignment[index] ?? 0] ?? primary);
    const areaLabel = englishAreaName(area.name, input.destination);
    const base = { ...anchor({ ...area, name: areaLabel }), id: `anchor-${areaLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-d${index}`, day: index };
    const indoorOnly = sky?.outdoorOk === false;
    const sights = spots.filter((spot) => SEE.has(spot.category) && !used.has(spot.id) && (spot.area === area.name || distanceMeters(area.latitude, area.longitude, spot.lat, spot.lng) < 12000 || (spot.distanceKm ?? 0) >= 18));
    const indoors = indoorOnly ? sights.filter((spot) => spot.indoor) : sights;
    const iconicOutside = indoorOnly ? sights.filter((spot) => !spot.indoor && (spot.importance === "iconic" || spot.importance === "major")) : [];
    const pool = indoors.length ? [...indoors, ...iconicOutside] : sights;
    const near = pool.length ? pool : sights;
    const cityKept = balance === "city" ? near.filter((spot) => !((spot.distanceKm ?? 0) >= 18 || spot.excursion === "full" || spot.groups?.includes("excursion"))) : near;
    const nearby = balance === "city" ? cityKept : near;
    const reserved = new Set(reps.filter((row) => {
      if (row.day === index) return false;
      const date = addDays(input.start, row.day);
      const wet = input.weather.find((day) => day.date === date)?.outdoorOk === false;
      if (wet && !row.place.indoor) return false;
      return true;
    }).map((row) => row.place.id));
    const forced = reps.filter((row) => row.day === index && !used.has(row.place.id) && (!indoorOnly || row.place.indoor || row.place.importance === "iconic")).map((row) => row.place);
    const openList = nearby.filter((spot) => !reserved.has(spot.id));
    const source = [...forced, ...openList.filter((spot) => !forced.some((item) => item.id === spot.id))];
    const pinned = [
      ...forced,
      ...source.filter((spot) => askedFor(spot, input.mustVisit) && !forced.some((item) => item.id === spot.id)),
    ];
    const pinnedOpen = pinned.filter((spot) => !used.has(spot.id));
    const pinnedFar = balance === "city" ? undefined : pinnedOpen.find((spot) => placeIsFar(spot));
    const dayType = classifyBuiltDay(index, planned, intent, false);
    const count = sightBudget(input.pace, dayType, child, slow);
    let chosen: DiscoveredPlace[];
    if (intent) {
      const away = intent.visitMode === "DAY_TRIP" || intent.visitMode === "EXCURSION";
      const want = away ? Math.min(count, child || slow ? 1 : 3) : count;
      chosen = stopsForIntent(intent, spots, used, want, input.salt + index, childAges, firstVisit);
    } else if (pinnedFar && index !== planned - 1) {
      const around = source.filter((spot) => spot.id !== pinnedFar.id && spot.excursion !== "full" && distanceMeters(pinnedFar.lat, pinnedFar.lng, spot.lat, spot.lng) < 4000);
      const extra = child || slow ? 1 : input.pace === "full" ? 3 : 2;
      const companions = orderPlaces(pinnedFar, around, extra, input.salt + index, input.interests, child, [], balance, focus);
      chosen = [pinnedFar, ...companions.filter((spot) => spot.id !== pinnedFar.id)].slice(0, 1 + extra);
    } else {
      const ordered = orderPlaces(base, source, count, input.salt + index, input.interests, child, pinnedOpen, balance, focus);
      const cityChoices = ordered.filter((spot) => !placeIsFar(spot));
      const leadPick = cityChoices[0];
      const nearLead = leadPick ? cityChoices.filter((spot) => spot.id === leadPick.id || distanceMeters(leadPick.lat, leadPick.lng, spot.lat, spot.lng) < 8000) : [];
      chosen = pinnedFar ? [pinnedFar] : nearLead.slice(0, count);
    }
    chosen.forEach((spot) => used.add(spot.id));
    const reservedDay = Boolean(intent && !chosen.length && (intent.visitMode === "DAY_TRIP" || intent.visitMode === "EXCURSION" || intent.role === "nature" || intent.role === "family"));
    const leadPlace = chosen[0];
    const excursionDay = reservedDay || chosen.some((spot) => placeIsFar(spot) || (leadPlace ? distanceMeters(area.latitude, area.longitude, leadPlace.lat, leadPlace.lng) >= 12000 : false) || (intent?.visitMode === "DAY_TRIP" || intent?.visitMode === "EXCURSION"));
    const [lead, ...later] = chosen;
    const reservedAnchor = reservedDay && intent ? { lat: intent.latitude, lng: intent.longitude } : null;
    const lunchAnchor = lead ?? (reservedAnchor ? { ...base, ...reservedAnchor, locality: intent?.areaName } : base);
    const localRaw = lunchAnchor.locality || "";
    const mealArea = englishAreaName(!localRaw || hasNonLatin(localRaw) ? (intent?.areaName || areaLabel) : localRaw, areaLabel);
    const meals = planDayMeals({
      spots,
      used,
      day: index,
      lastDay: index === planned - 1,
      excursionDay,
      pace: input.pace,
      foodPlanning,
      child,
      slow,
      hasSights: chosen.length > 0 || reservedDay,
      anchor: lunchAnchor,
      base,
      areaName: mealArea,
      anchorName: readableName(lunchAnchor),
      baseName: areaLabel,
    });
    const sequence: { stop: TripStop }[] = [{ stop: base }];
    if (lead) sequence.push({ stop: { ...placeStop(lead, index, "scheduled", whyStop(lead, excursionDay, indoorOnly)), id: `${lead.id}-d${index}` } });
    else if (reservedDay && intent) sequence.push({ stop: areaDayStop(intent, index) });
    if (meals.lunch) sequence.push({ stop: meals.lunch });
    if (meals.cafe) sequence.push({ stop: meals.cafe });
    for (const spot of later) sequence.push({ stop: { ...placeStop(spot, index, "scheduled", whyStop(spot, false, indoorOnly)), id: `${spot.id}-d${index}` } });
    if (meals.dinner) sequence.push({ stop: meals.dinner });

    let cursor = child || input.pace === "relaxed" || slow ? 10 * 60 : styles.includes("adventure") ? 8 * 60 : 9 * 60;
    let previous = sequence[0]?.stop ?? base;
    const dayStops: TripStop[] = [];
    sequence.forEach((entry, entryIndex) => {
      const stop = { ...entry.stop, day: index };
      if (child && entryIndex > 0 && cursor >= 17 * 60 && stop.category !== "stay") return;
      if (entryIndex > 0) {
        const from = { lat: previous.lat, lng: previous.lng };
        const hop = hopMinutes(input.move, from, stop, input.matrix ?? null, spots);
        const minutes = hop.minutes;
        if (child && cursor + (minutes ?? 0) >= 17 * 60) return;
        cursor += minutes ?? 0;
        if (stop.meal === "lunch" && cursor < 11 * 60 + 30) cursor = 11 * 60 + 30;
        if (stop.meal === "cafe" && cursor < 14 * 60) cursor = 14 * 60;
        if (stop.meal === "dinner" && cursor < 17 * 60 + 30) cursor = 17 * 60 + 30;
        legs.push(explainLeg({
          fromId: previous.id,
          toId: stop.id,
          day: index,
          mode: input.move,
          minutes,
          meters: Math.round(distanceMeters(from.lat, from.lng, stop.lat, stop.lng)),
          source: hop.source,
          label: legLabel(input.move, minutes, hop.source),
        }, input.move, styles, child));
      }
      stop.startTime = clockTime(cursor);
      stop.endTime = clockTime(cursor + stop.duration);
      cursor += stop.duration;
      previous = stop;
      dayStops.push(stop);
    });
    const lastEnd = dayStops[dayStops.length - 1]?.endTime ?? "12:00";
    const farLocal = chosen.map((spot) => spot.locality).find((value) => value && !hasNonLatin(value)) || "";
    const themeRaw = cleanTheme(intent?.title || (excursionDay && farLocal ? `${farLocal} day trip` : areaLabel), input.destination);
    const resolvedType = classifyBuiltDay(index, planned, intent, excursionDay);
    const theme = resolvedType === "FULL_DAY" && isGenericDayTheme(themeRaw, input.destination)
      ? (themeForArea(intent?.areaName || "", input.destination) || themeRaw)
      : themeRaw;
    days.push({
      index,
      date,
      label: `Day ${index + 1} · ${dayLabel(date)}`,
      weather: sky?.summary || "Weather was not available for this day.",
      outdoorOk: sky?.outdoorOk ?? null,
      locked: input.lockedDates.includes(date),
      area: englishAreaName(intent?.areaName || areaLabel, input.destination),
      intent: theme,
      theme,
      dayType: resolvedType,
      line: null,
      freeNote: freeWindow(lastEnd),
      requiredGroups: intent?.requiredGroups ?? intent?.groups,
      focusLat: intent?.latitude,
      focusLng: intent?.longitude,
    });
    stops.push(...dayStops);
  }

  for (let index = planned; index < nights; index += 1) {
    const date = addDays(input.start, index);
    days.push({
      index,
      date,
      label: `Day ${index + 1} · ${dayLabel(date)}`,
      weather: "Open day.",
      outdoorOk: null,
      locked: false,
      area: primary.name,
      line: null,
      freeNote: "",
    });
  }

  const chosenStay = new Set(stops.filter((stop) => stop.category === "stay" && stop.providerId).map((stop) => stop.providerId));
  const leftover = spots.filter((spot) => spot.category === "stay" ? !chosenStay.has(spot.providerId) : !used.has(spot.id));
  leftover.forEach((spot) => {
    const wanted = askedFor(spot, input.mustVisit);
    const bucket: TripStop["bucket"] = FOOD.has(spot.category) ? "food" : wanted ? "must" : SEE.has(spot.category) ? "saved" : "maybe";
    stops.push(placeStop(spot, null, bucket, "Saved. Not placed on a day yet."));
  });

  const burden = burdenFrom(legs, stay.options.find((option) => option.chosen)?.hotelChanges ?? 0, stops, input.move, child);
  const wet = days.find((day) => day.outdoorOk === false)?.label ?? "";
  const cluster = clusterLine(stops);
  const coverage = assessCoverage(spots, stops, nights, firstVisit, balance);
  const hotels = hotelPicks(stops, DEFAULT_HOTEL_PREFERENCES, emptyHotelMemory(), input.move);
  const whyTrip = whyLine(balance, styles, firstVisit, input.oneBase || stay.mode === "single", coverage);
  const notes = [
    whyTrip,
    stay.options.find((option) => option.chosen)?.note ?? "",
    input.move === "transit" ? "Transit times aren't available, so these hops use a taxi or a walk." : "",
    nights > planned ? `The stay is ${nights} nights. The first ${planned} days are planned.` : "",
    unmatched.length ? `Couldn't place: ${unmatched.join(", ")}.` : "",
  ].filter(Boolean);

  return repairTrip({
    id: input.id || `trip-${input.destination}-${input.start}-${input.salt}`,
    title: `${input.destination}, ${nights} night${nights === 1 ? "" : "s"}`,
    destination: input.destination,
    areas: areas.length ? areas : [primary],
    start: input.start,
    nights,
    adults: input.adults,
    childAges,
    pace: input.pace,
    move: input.move,
    oneBase: stay.mode === "single",
    days,
    stops,
    legs,
    bookings: [],
    bases: stay.options,
    burden,
    voice: localTripVoice(burden, wet),
    notes,
    cluster,
    unmatched,
    placeNote: input.discovery?.note ?? "",
    transitNote: input.move === "transit" ? "Transit times aren't available, so these hops use a taxi or a walk." : "",
    styles,
    balance,
    firstVisit,
    coverage,
    whyTrip,
    hotels,
    hotelPreferences: { ...DEFAULT_HOTEL_PREFERENCES },
    hotelMemory: rememberShortlist(emptyHotelMemory(), hotels),
    hotelNote: "",
    profileNote: input.profileNote ?? "",
    countryCode: input.countryCode || areas.find((area) => area.countryCode)?.countryCode || "",
    discovery: input.discovery,
    interests: input.interests,
    foodPlanning,
    partyExplicit: true,
    hotelSelectionSource: "NONE",
    playbook: input.playbook,
  });
}

function sightBudget(pace: TravelPace, type: TravelDayType, child: boolean, slow: boolean): number {
  if (child || slow) return type === "FULL_DAY" ? 2 : 1;
  if (type === "ARRIVAL_DAY" || type === "DEPARTURE_DAY") return pace === "full" ? 2 : 2;
  if (type === "EXCURSION_DAY") return pace === "relaxed" ? 2 : 3;
  if (pace === "relaxed") return 3;
  if (pace === "full") return 5;
  return 4;
}

function classifyBuiltDay(index: number, planned: number, intent: DayIntent | undefined, excursion: boolean): TravelDayType {
  if (intent?.visitMode === "DAY_TRIP" || intent?.visitMode === "EXCURSION" || excursion) return "EXCURSION_DAY";
  if (intent?.role === "departure") return "DEPARTURE_DAY";
  if (intent?.role === "arrival" || (index === 0 && planned > 1)) return "ARRIVAL_DAY";
  return "FULL_DAY";
}

function meaningfulSight(stop: TripStop): boolean {
  return stop.category !== "stay" && !FOOD.has(stop.category) && stop.provider !== "area";
}

export type DayValidation = {
  valid: boolean;
  dayType: TravelDayType;
  meaningfulStops: number;
  activeSpanMinutes: number;
  unexplainedGapMinutes: number;
  duplicateMealWindows: number;
  requiredExperienceCoverage: boolean;
  problems: string[];
};

export function validateTravelDay(trip: Trip, day: number): DayValidation {
  const info = trip.days.find((item) => item.index === day);
  const rows = trip.stops.filter((stop) => stop.day === day).sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
  const dayType = info?.dayType ?? "FULL_DAY";
  const sights = rows.filter(meaningfulSight);
  const start = rows[0]?.startTime ? clockToMinutes(rows[0].startTime) : 9 * 60;
  const end = rows[rows.length - 1]?.endTime ? clockToMinutes(rows[rows.length - 1].endTime ?? "") : start;
  const active = Math.max(0, end - start);
  const lunches = rows.filter((stop) => stop.meal === "lunch" || (stop.category === "restaurant" && (stop.startTime ?? "") >= "11:00" && (stop.startTime ?? "") < "16:00" && stop.meal !== "dinner"));
  const problems: string[] = [];
  const min = trip.pace === "full" ? 4 : trip.pace === "relaxed" ? 2 : 3;
  if (dayType === "FULL_DAY" && sights.length < min && sights.length > 0) problems.push("thin");
  if (dayType === "FULL_DAY" && active > 0 && active < 5 * 60 && sights.length < min) problems.push("short-span");
  if (lunches.length > 1) problems.push("duplicate-lunch");
  if (rows.some((stop) => stop.category === "stay" && stop.provider !== "area" && stop.bookingStatus !== "booked" && trip.hotelSelectionSource !== "USER_BOOKED" && trip.hotelSelectionSource !== "USER_SELECTED")) problems.push("unasked-hotel");
  const theme = info?.theme || info?.intent || "";
  if (/More time in\s+More time in/i.test(theme)) problems.push("duplicated-title");
  if (hasNonLatin(theme) || hasNonLatin(info?.area || "")) problems.push("local-script-heading");
  if (dayType === "FULL_DAY" && isGenericDayTheme(theme, trip.destination) && info?.dayType !== "FREE_DAY") problems.push("generic-theme");
  const covered = new Set(sights.flatMap((stop) => stop.groups ?? []));
  const required = info?.requiredGroups ?? [];
  const gap = dayType === "FULL_DAY" && end < 16 * 60 ? (18 * 60 + 30) - end : 0;
  return {
    valid: problems.length === 0,
    dayType,
    meaningfulStops: sights.length,
    activeSpanMinutes: active,
    unexplainedGapMinutes: gap > 90 && sights.length < min ? gap : 0,
    duplicateMealWindows: Math.max(0, lunches.length - 1),
    requiredExperienceCoverage: required.length ? required.every((group) => covered.has(group) || group === "family") : sights.length > 0,
    problems,
  };
}

export function validateWholeTrip(trip: Trip): { valid: boolean; problems: string[] } {
  const problems: string[] = [];
  if ((trip.hotelSelectionSource ?? "NONE") === "NONE") {
    const named = trip.stops.find((stop) => stop.day != null && stop.category === "stay" && stop.provider !== "area");
    if (named) problems.push("exact-hotel-without-source");
  }
  for (const day of trip.days) {
    const check = validateTravelDay(trip, day.index);
    if (!check.valid && day.dayType !== "FREE_DAY") problems.push(`day-${day.index}:${check.problems.join(",")}`);
    if (/More time in\s+More time in/i.test(`${day.intent || ""} ${day.theme || ""}`)) problems.push("duplicated-title");
  }
  const titles = trip.days.map((day) => day.theme || day.intent || "");
  if (titles.filter((title) => /More time in/i.test(title)).length > 1) problems.push("generic-more-time");
  return { valid: problems.length === 0, problems };
}

function repairTrip(trip: Trip): Trip {
  let next = dedupeDayMeals(trip);
  next = clearUnaskedHotels(next);
  const filled = fillThinDays(next);
  next = filled.trip;
  const covered = coverExperienceGaps(next);
  next = covered.trip;
  next = repairGenericThemes(next);
  next = labelFreeTime(next);
  return { ...next, curation: curationReport(next, filled.repairs + covered.repairs) };
}

function clearUnaskedHotels(trip: Trip): Trip {
  if (trip.hotelSelectionSource === "USER_BOOKED" || trip.hotelSelectionSource === "USER_SELECTED" || trip.hotelSelectionSource === "IMPORT") return trip;
  const scheduled = trip.stops.filter((stop) => stop.day != null && stop.category === "stay" && stop.provider !== "area");
  if (!scheduled.length) return trip;
  const stops = trip.stops.map((stop) => {
    if (stop.category !== "stay" || stop.provider === "area" || stop.day == null) return stop;
    const area = englishAreaName(stop.area || trip.destination, trip.destination);
    return {
      ...anchor({ name: area, latitude: stop.lat, longitude: stop.lng }),
      id: stop.id,
      day: stop.day,
      startTime: stop.startTime,
      endTime: stop.endTime,
    };
  });
  return { ...trip, stops, hotelSelectionSource: "NONE" };
}

function dedupeDayMeals(trip: Trip): Trip {
  const drop = new Set<string>();
  for (const day of trip.days) {
    const rows = trip.stops.filter((stop) => stop.day === day.index);
    const lunches = rows.filter((stop) => stop.meal === "lunch" || (FOOD.has(stop.category) && stop.meal !== "dinner" && stop.meal !== "cafe" && (stop.startTime ?? "") >= "11:00" && (stop.startTime ?? "") < "15:30"));
    if (lunches.length <= 1) continue;
    const notable = lunches.find((stop) => stop.provider !== "area" && (stop.importance === "iconic" || stop.importance === "major" || (stop.sitelinks ?? 0) >= 8));
    const window = lunches.find((stop) => stop.foodRole === "meal-window" || stop.provider === "area");
    const keep = notable ?? window ?? lunches[0];
    for (const stop of lunches) if (stop && keep && stop.id !== keep.id) drop.add(stop.id);
  }
  if (!drop.size) return trip;
  const stops = trip.stops.flatMap((stop) => {
    if (!drop.has(stop.id)) return [stop];
    if (stop.provider === "area") return [];
    return [{ ...stop, day: null, startTime: null, endTime: null, bucket: "food" as const, meal: undefined, note: "Saved. A second lunch was not scheduled." }];
  });
  let next: Trip = { ...trip, stops };
  for (const day of trip.days) next = retimeDay(next, day.index);
  return next;
}

function fillThinDays(trip: Trip): { trip: Trip; repairs: number } {
  let next = trip;
  let repairs = 0;
  const min = trip.pace === "full" ? 4 : trip.pace === "relaxed" ? 2 : 3;
  for (const day of trip.days) {
    if (day.dayType !== "FULL_DAY" && day.dayType !== "EXCURSION_DAY" && day.dayType !== "ARRIVAL_DAY") continue;
    const rows = next.stops.filter((stop) => stop.day === day.index);
    const sights = rows.filter(meaningfulSight);
    const floor = day.dayType === "FULL_DAY" ? min : 2;
    if (sights.length >= floor) continue;
    const focus = dayFocus(day, sights, rows);
    if (!focus) continue;
    const have = new Set(sights.flatMap((stop) => stop.groups ?? []));
    const missing = (day.requiredGroups ?? []).filter((group) => !have.has(group));
    const need = floor - sights.length;
    const candidates = next.stops.filter((stop) => {
      if (stop.day != null || stop.excluded || stop.provider === "area") return false;
      if (!SEE.has(stop.category)) return false;
      if (stop.importance === "local" && !isAnchorNote(stop.sourceNote)) return false;
      if (day.outdoorOk === false && !stop.indoor && stop.importance !== "iconic" && stop.importance !== "major") return false;
      const away = stop.excursion === "full" || (stop.distanceKm ?? 0) >= 28;
      if (away && day.dayType !== "EXCURSION_DAY") return false;
      const sameArea = Boolean(stop.locality && day.area && stop.locality.toLowerCase() === day.area.toLowerCase());
      const limit = sameArea ? 12000 : isAnchorNote(stop.sourceNote) ? 8000 : 6000;
      if (distanceMeters(focus.lat, focus.lng, stop.lat, stop.lng) > limit) return false;
      if (missing.length && !(stop.groups ?? []).some((group) => missing.includes(group)) && !isAnchorNote(stop.sourceNote)) return false;
      return true;
    }).sort((a, b) => {
      const help = (stop: TripStop) => (stop.groups ?? []).some((group) => missing.includes(group)) ? 0 : 1;
      const rank = (stop: TripStop) => stop.importance === "iconic" ? 0 : stop.importance === "major" ? 1 : 2;
      return help(a) - help(b) || rank(a) - rank(b) || distanceMeters(focus.lat, focus.lng, a.lat, a.lng) - distanceMeters(focus.lat, focus.lng, b.lat, b.lng);
    }).slice(0, need);
    if (!candidates.length) continue;
    repairs += 1;
    const stops = next.stops.map((stop) => {
      const index = candidates.findIndex((item) => item.id === stop.id);
      if (index < 0) return stop;
      return { ...stop, day: day.index, bucket: "scheduled" as const, startTime: clockTime(14 * 60 + index * 20), note: stop.why || "Fits the missing part of this day." };
    });
    next = retimeDay({ ...next, stops }, day.index);
  }
  return { trip: next, repairs };
}

function coverExperienceGaps(trip: Trip): { trip: Trip; repairs: number } {
  if (trip.firstVisit === false) return { trip, repairs: 0 };
  const required = packFor(trip.destination)?.firstVisitGroups ?? [];
  if (!required.length) return { trip, repairs: 0 };
  let next = trip;
  let repairs = 0;
  const have = () => new Set(next.stops.filter((stop) => stop.day != null && meaningfulSight(stop)).flatMap((stop) => stop.groups ?? []));
  for (const group of required) {
    if (have().has(group)) continue;
    const candidate = next.stops
      .filter((stop) => stop.day == null && !stop.excluded && SEE.has(stop.category) && (stop.groups ?? []).includes(group) && isAnchorNote(stop.sourceNote))
      .sort((a, b) => (a.importance === "iconic" ? 0 : 1) - (b.importance === "iconic" ? 0 : 1))[0];
    if (!candidate) continue;
    const day = dayForAnchor(next, candidate);
    if (!day) continue;
    const sights = next.stops.filter((stop) => stop.day === day.index && meaningfulSight(stop));
    const cap = next.pace === "full" ? 5 : next.pace === "relaxed" ? 3 : 4;
    let stops = next.stops;
    if (sights.length >= cap) {
      const weak = [...sights].reverse().find((stop) => !isAnchorNote(stop.sourceNote) && stop.importance !== "iconic");
      if (!weak) continue;
      stops = stops.map((stop) => stop.id === weak.id ? { ...stop, day: null, bucket: "saved" as const, startTime: null, endTime: null } : stop);
    }
    stops = stops.map((stop) => stop.id === candidate.id ? { ...stop, day: day.index, bucket: "scheduled" as const, note: stop.why || "A defining stop for this destination." } : stop);
    next = retimeDay({ ...next, stops }, day.index);
    repairs += 1;
  }
  return { trip: next, repairs };
}

function dayForAnchor(trip: Trip, candidate: TripStop): TripDay | null {
  const days = trip.days.filter((day) => day.dayType === "FULL_DAY" || day.dayType === "ARRIVAL_DAY" || day.dayType === "EXCURSION_DAY");
  let best: TripDay | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  for (const day of days) {
    const rows = trip.stops.filter((stop) => stop.day === day.index);
    const sights = rows.filter(meaningfulSight);
    const focus = dayFocus(day, sights, rows);
    if (!focus) continue;
    const meters = distanceMeters(focus.lat, focus.lng, candidate.lat, candidate.lng);
    const sameArea = Boolean(candidate.locality && day.area && candidate.locality.toLowerCase() === day.area.toLowerCase());
    const excursion = candidate.excursion === "full" || candidate.excursion === "half";
    if (!sameArea && meters > (excursion ? 20000 : 10000)) continue;
    if (excursion && day.dayType !== "EXCURSION_DAY" && !sameArea && meters > 12000) continue;
    const score = (sameArea ? 0 : meters) + sights.length * 500;
    if (score < bestScore) {
      bestScore = score;
      best = day;
    }
  }
  return best;
}

function dayFocus(day: TripDay, sights: TripStop[], rows: TripStop[]): { lat: number; lng: number } | null {
  if (Number.isFinite(day.focusLat) && Number.isFinite(day.focusLng)) return { lat: day.focusLat as number, lng: day.focusLng as number };
  const pin = sights[0] ?? rows.find((stop) => stop.provider === "area" && stop.category !== "stay") ?? rows.find((stop) => stop.category === "stay");
  return pin ? { lat: pin.lat, lng: pin.lng } : null;
}

function repairGenericThemes(trip: Trip): Trip {
  const days = trip.days.map((day) => {
    if (day.dayType !== "FULL_DAY") return day;
    const theme = day.theme || day.intent || "";
    if (!isGenericDayTheme(theme, trip.destination)) return day;
    const better = themeForArea(day.area, trip.destination);
    if (!better || isGenericDayTheme(better, trip.destination)) return day;
    return { ...day, theme: better, intent: better };
  });
  return { ...trip, days };
}

function curationReport(trip: Trip, thinRepairs: number): CurationReport {
  const scheduled = trip.stops.filter((stop) => stop.day != null && meaningfulSight(stop));
  const anchorStops = scheduled.filter((stop) => isAnchorNote(stop.sourceNote)).length;
  const osmStops = scheduled.filter((stop) => stop.provider === "osm" && !isAnchorNote(stop.sourceNote)).length;
  const have = new Set(scheduled.flatMap((stop) => stop.groups ?? []));
  const required = packFor(trip.destination)?.firstVisitGroups ?? [];
  const groupsSatisfied = required.filter((group) => have.has(group));
  const groupsMissing = trip.firstVisit === false ? [] : required.filter((group) => !have.has(group));
  const fallback: string[] = [];
  if (!packFor(trip.destination)) fallback.push("no-canonical-pool");
  if (trip.stops.some((stop) => stop.day != null && stop.provider === "area" && stop.category !== "stay" && !FOOD.has(stop.category))) fallback.push("area-reserve");
  return { anchorStops, osmStops, groupsSatisfied, groupsMissing, thinRepairs, fallback };
}

function labelFreeTime(trip: Trip): Trip {
  const min = trip.pace === "full" ? 4 : trip.pace === "relaxed" ? 2 : 3;
  const days = trip.days.map((day) => {
    const rows = trip.stops.filter((stop) => stop.day === day.index);
    const sights = rows.filter(meaningfulSight);
    const end = rows[rows.length - 1]?.endTime ?? "";
    const endMin = end ? clockToMinutes(end) : 18 * 60;
    const area = englishAreaName(day.area || day.theme || trip.destination, trip.destination);
    if (day.dayType === "FULL_DAY" && sights.length >= Math.min(min, 2) && endMin < 16 * 60) {
      return { ...day, freeNote: `FREE AFTERNOON · Explore ${area} at your own pace.` };
    }
    if (day.dayType === "FULL_DAY" && sights.length > 0 && sights.length < min && endMin < 16 * 60) {
      return { ...day, freeNote: `Open time in ${area}. Nothing else that fits this day was left unused.` };
    }
    return day;
  });
  return { ...trip, days };
}

function unloadedTrip(
  input: {
    id?: string;
    destination: string;
    start: string;
    nights: number;
    adults: number;
    childAges: number[];
    pace: TravelPace;
    move: TravelMove;
    interests: TravelInterest[];
    mustVisit: string[];
    lockedDates: string[];
    weather: { date: string; outdoorOk: boolean | null; summary: string }[];
    profileNote?: string;
    countryCode?: string;
    discovery?: DiscoveryHealth;
    oneBase: boolean;
    skeleton?: DayIntent[];
    playbook?: TripPlaybookView;
  },
  areas: TravelArea[],
  primary: TravelArea,
  nights: number,
  planned: number,
  styles: TravelStyle[],
  balance: TravelBalance,
  firstVisit: boolean,
  spots: DiscoveredPlace[],
): Trip {
  const days: TripDay[] = [];
  for (let index = 0; index < nights; index += 1) {
    const date = addDays(input.start, index);
    const sky = input.weather.find((day) => day.date === date);
    days.push({
      index,
      date,
      label: `Day ${index + 1} · ${dayLabel(date)}`,
      weather: index < planned ? (sky?.summary || "Weather was not available for this day.") : "Places didn't load.",
      outdoorOk: sky?.outdoorOk ?? null,
      locked: input.lockedDates.includes(date),
      area: input.skeleton?.[index]?.title || primary.name,
      intent: input.skeleton?.[index]?.title,
      line: null,
      freeNote: "",
    });
  }
  const stays = spots.filter((spot) => spot.category === "stay").map((spot) => placeStop(spot, null, "saved", "Saved stay. Sights did not load, so this is not a day plan."));
  const failed = input.discovery?.osm === "failed" && input.discovery?.wikidata === "failed";
  const childAges = explicitChildAges(input.childAges);
  const placeNote = input.discovery?.note
    || (failed
      ? `Couldn't load places for ${input.destination}.`
      : `No places came back for ${input.destination}.`);
  const burden = burdenFrom([], 0, stays, input.move, hasYoungChild(childAges));
  const hotels = hotelPicks(stays, DEFAULT_HOTEL_PREFERENCES, emptyHotelMemory(), input.move);
  return {
    id: input.id || `trip-${input.destination}-${input.start}-empty`,
    title: `${input.destination}, ${nights} night${nights === 1 ? "" : "s"}`,
    destination: input.destination,
    areas,
    start: input.start,
    nights,
    adults: input.adults,
    childAges,
    pace: input.pace,
    move: input.move,
    oneBase: input.oneBase,
    days,
    stops: stays,
    legs: [],
    bookings: [],
    bases: [{ id: "one", label: `Stay in ${primary.name}`, hotelChanges: 0, lostMinutes: 0, note: "No sights loaded, so no base was compared.", chosen: true }],
    burden,
    voice: localTripVoice(burden, ""),
    notes: [placeNote],
    cluster: "",
    unmatched: input.mustVisit,
    placeNote,
    transitNote: "",
    styles,
    balance,
    firstVisit,
    coverage: [],
    whyTrip: placeNote,
    hotels,
    hotelPreferences: { ...DEFAULT_HOTEL_PREFERENCES },
    hotelMemory: rememberShortlist(emptyHotelMemory(), hotels),
    hotelNote: "",
    profileNote: input.profileNote ?? "",
    countryCode: input.countryCode || areas.find((area) => area.countryCode)?.countryCode || "",
    discovery: input.discovery ?? { osm: "failed", wikidata: "failed", hotels: "failed", note: placeNote },
    partyExplicit: true,
    playbook: input.playbook,
  };
}

export function annotatePlace(spot: DiscoveredPlace, originLat: number, originLng: number): DiscoveredPlace {
  const distanceKm = Math.round((distanceMeters(originLat, originLng, spot.lat, spot.lng) / 1000) * 10) / 10;
  const name = spot.name.toLowerCase();
  const groups: string[] = [];
  if (spot.category === "zoo" || spot.category === "aquarium" || /panda|wildlife|safari/.test(name)) groups.push("wildlife");
  if (spot.category === "museum" || spot.category === "historic" || spot.category === "landmark" || /temple|monastery|palace|cathedral|heritage/.test(name)) groups.push("heritage");
  if (FOOD.has(spot.category)) groups.push("food");
  if (spot.category === "shopping" || spot.category === "market") groups.push("shopping");
  if (spot.category === "nightlife") groups.push("nightlife");
  if (spot.category === "park" || spot.category === "garden" || spot.category === "viewpoint" || spot.category === "beach" || /mountain|scenic|national park/.test(name)) groups.push("nature");
  if (/alley|old town|old street|district|neighbourhood|neighborhood/.test(name)) groups.push("neighbourhood");
  if (distanceKm >= 18) groups.push("excursion");
  if (!groups.length) groups.push("city");
  const links = spot.sitelinks ?? 0;
  let importance: Importance = "local";
  if (links >= 25 || (spot.mentioned && links >= 8)) importance = "iconic";
  else if (links >= 10 || spot.mentioned) importance = "major";
  else if (links >= 4) importance = "interest";
  else if (FOOD.has(spot.category) || spot.category === "park" || spot.category === "market") importance = "local";
  else importance = "optional";
  let excursion: ExcursionSpan = "none";
  if (groups.includes("excursion") && (groups.includes("nature") || groups.includes("heritage") || groups.includes("wildlife"))) excursion = distanceKm >= 28 ? "full" : "half";
  return {
    ...spot,
    distanceKm,
    importance: spot.importance ?? importance,
    groups: spot.groups?.length ? spot.groups : [...new Set(groups)].slice(0, 3),
    excursion: spot.excursion ?? excursion,
  };
}

function importanceRank(spot: DiscoveredPlace): number {
  const order: Record<Importance, number> = { iconic: 0, major: 1, interest: 2, local: 3, optional: 4 };
  return order[spot.importance ?? "local"];
}

function placeIsFar(spot: { distanceKm?: number; excursion?: ExcursionSpan; groups?: string[] }): boolean {
  return spot.excursion === "full";
}

function farBudget(balance: TravelBalance, days: number): number {
  if (balance === "city" || days < 3) return 0;
  if (balance === "nature") return Math.min(3, Math.max(1, days - 2));
  return Math.min(2, Math.max(1, days - 3));
}

function balancePenalty(spot: DiscoveredPlace, balance: TravelBalance): number {
  if (balance === "city" && placeIsFar(spot)) return 4;
  if (balance === "nature" && (spot.groups?.includes("nature") || spot.groups?.includes("wildlife") || spot.groups?.includes("excursion"))) return -1;
  return 0;
}

function representatives(spots: DiscoveredPlace[], balance: TravelBalance, styles: TravelStyle[], days: number): { day: number; place: DiscoveredPlace }[] {
  const notable = spots.filter((spot) => (spot.importance === "iconic" || spot.importance === "major") && spot.category !== "stay" && !FOOD.has(spot.category));
  const farPicked = notable.filter(placeIsFar).sort((a, b) => (b.sitelinks ?? 0) - (a.sitelinks ?? 0) || importanceRank(a) - importanceRank(b)).slice(0, farBudget(balance, days));
  const farIds = new Set(farPicked.map((spot) => spot.id));
  const byGroup = new Map<string, DiscoveredPlace[]>();
  for (const spot of notable) {
    if (farIds.has(spot.id) || placeIsFar(spot)) continue;
    const group = spot.groups?.[0] ?? "city";
    byGroup.set(group, [...(byGroup.get(group) ?? []), spot]);
  }
  for (const list of byGroup.values()) list.sort((a, b) => (b.sitelinks ?? 0) - (a.sitelinks ?? 0) || importanceRank(a) - importanceRank(b));
  const weight = (group: string) => {
    if (styles.includes("culture") && group === "heritage") return -2;
    if ((styles.includes("adventure") || balance === "nature") && (group === "nature" || group === "wildlife")) return -2;
    return 0;
  };
  const cityPicked: DiscoveredPlace[] = [];
  for (const group of [...byGroup.keys()].sort((a, b) => weight(a) - weight(b) || a.localeCompare(b))) {
    if (cityPicked.length >= Math.max(0, days - farPicked.length)) break;
    const place = byGroup.get(group)?.[0];
    if (place) cityPicked.push(place);
  }
  const usedDays = new Set<number>();
  const picked: { day: number; place: DiscoveredPlace }[] = [];
  const farDays = Array.from({ length: days }, (_, day) => day).filter((day) => (days <= 2 || day !== 0) && (days <= 3 || day !== days - 1));
  farPicked.forEach((place, index) => {
    const day = farDays[index] ?? farDays.at(-1) ?? 0;
    if (usedDays.has(day)) return;
    usedDays.add(day);
    picked.push({ day, place });
  });
  let cursor = 0;
  for (const place of cityPicked) {
    while (cursor < days && usedDays.has(cursor)) cursor += 1;
    if (cursor >= days) break;
    usedDays.add(cursor);
    picked.push({ day: cursor, place });
    cursor += 1;
  }
  return picked;
}

function whyStop(place: DiscoveredPlace, excursion: boolean, wet: boolean): string {
  if (wet && !place.indoor) return "Weather is poor, so this stop is a compromise.";
  if (place.story?.whyGo) return place.story.whyGo;
  if (excursion || place.excursion === "full") return "A full day out. It is not squeezed between two city meals.";
  return "Placed with the nearby stops.";
}

function modeWord(mode: LegMode): string {
  if (mode === "walk") return "Walk";
  if (mode === "drive") return "Drive";
  if (mode === "taxi") return "Taxi";
  return "Transit";
}

export function explainLeg(leg: TripLeg, preference: TravelMove, styles: TravelStyle[], child: boolean): TripLeg {
  const meters = leg.meters ?? 0;
  const roadKnown = preference !== "walk" && leg.minutes != null && leg.source !== "none";
  const walkKnown = preference === "walk" && leg.minutes != null && leg.source !== "none";
  const roadMinutes = roadKnown ? leg.minutes : meters ? estimateMinutes("drive", meters) : null;
  const walkMinutes = walkKnown ? leg.minutes : meters ? estimateMinutes("walk", meters) : null;
  const roadSource: LegAlt["source"] = roadKnown ? leg.source : roadMinutes == null ? "none" : "estimate";
  const walkSource: LegAlt["source"] = walkKnown ? leg.source : walkMinutes == null ? "none" : "estimate";
  const roadMode: LegMode = preference === "drive" ? "drive" : "taxi";
  const walkQuality = walkSource === "osrm" ? "routing_estimate" : walkMinutes == null ? "unavailable" : "approximate";
  const roadQuality = roadSource === "osrm" ? "routing_estimate" : roadMinutes == null ? "unavailable" : "approximate";
  const impracticalWalk = (walkMinutes ?? 0) >= 90 || meters >= 7000;
  const excursionHop = meters >= 8000 || (roadMinutes ?? 0) >= 50;
  const alternatives: LegAlt[] = [
    impracticalWalk
      ? { mode: "walk", minutes: null, meters: meters || null, source: "unavailable", quality: "unavailable", provider: "open-street", walkingMinutes: null, transfers: 0, label: "Walking · Not practical" }
      : { mode: "walk", minutes: walkMinutes, meters: meters || null, source: walkSource, quality: walkQuality, provider: "open-street", walkingMinutes: walkMinutes, transfers: 0, label: walkMinutes == null ? "Walk unavailable" : walkSource === "estimate" ? `Walk · ~${walkMinutes} min` : `Walk · ${walkMinutes} min` },
    { mode: roadMode, minutes: roadMinutes, meters: meters || null, source: roadSource, quality: roadQuality, provider: "open-street", transfers: 0, label: roadMinutes == null ? "Road time unavailable" : roadSource === "estimate" ? `${modeWord(roadMode)} · ~${roadMinutes} min` : `${modeWord(roadMode)} · ${roadMinutes} min` },
    { mode: "transit", minutes: null, meters: null, source: "unavailable", quality: "unavailable", provider: "none", transfers: null, label: excursionHop ? "Rail · open Navigate to check trains" : "Transit routing unavailable" },
  ];
  const shown = pickMode(preference, styles, child, walkMinutes, roadMinutes, roadMode);
  const chosen = alternatives.find((item) => item.mode === shown) ?? alternatives[1] ?? alternatives[0];
  const source = chosen?.source === "osrm" || chosen?.source === "estimate" || chosen?.source === "none" ? chosen.source : "none";
  const reason = legRecommendation({ mode: shown, styles, child, walkMinutes, roadMinutes });
  return {
    ...leg,
    minutes: chosen?.minutes ?? leg.minutes,
    source,
    label: chosen?.label ?? (chosen?.minutes == null ? "Route not calculated" : leg.label),
    shown,
    selectedMode: shown,
    recommendedMode: shown,
    recommendationReason: reason,
    planningProvider: "open-street",
    alternatives,
  };
}

const BALANCE_THEMES: { label: string; groups: string[]; optional?: boolean }[] = [
  { label: "Major landmarks", groups: ["city", "landmark"] },
  { label: "Historic centre", groups: ["heritage"] },
  { label: "Art & culture", groups: ["museum", "culture"] },
  { label: "Neighbourhood atmosphere", groups: ["neighbourhood"] },
  { label: "Parks & gardens", groups: ["nature", "garden", "park"] },
  { label: "Wildlife", groups: ["wildlife"] },
  { label: "Food", groups: ["food"] },
  { label: "Regional excursion", groups: ["excursion"], optional: true },
];

export function experienceBalance(rows: CoverageRow[] | undefined, place = ""): { label: string; state: "in" | "optional" }[] {
  const coverage = rows ?? [];
  const out: { label: string; state: "in" | "optional" }[] = [];
  for (const theme of BALANCE_THEMES) {
    const matched = coverage.filter((row) => theme.groups.includes(row.group));
    if (!matched.length) continue;
    const label = theme.groups.includes("heritage") && place ? `Historic ${place}` : theme.label;
    if (matched.some((row) => row.status === "covered")) out.push({ label, state: "in" });
    else if (theme.optional) out.push({ label, state: "optional" });
  }
  return out;
}

export function notableOmissions(trip: Trip): TripStop[] {
  return trip.stops.filter((stop) => {
    if (stop.day != null || stop.excluded) return false;
    if (stop.importance !== "iconic") return false;
    return stop.excursion === "full" || (stop.distanceKm ?? 0) >= 28 || Boolean(stop.groups?.includes("excursion"));
  }).slice(0, 2);
}

function sameParty(left: number[], right: number[] | undefined): boolean {
  if (!right || left.length !== right.length) return false;
  return left.every((age, index) => age === right[index]);
}

/** A saved trip whose only child age is 0, and which was never marked explicit, came from a blank ages box. */
export function normalizeTravelParty(trip: Trip): Trip {
  const ages = explicitChildAges(trip.childAges);
  const phantom = trip.partyExplicit !== true && ages.length === 1 && ages[0] === 0;
  const childAges = phantom ? [] : ages;
  if (!phantom && trip.partyExplicit === true && sameParty(childAges, trip.childAges)) return trip;
  const legs = phantom ? trip.legs.map((leg) => explainLeg(leg, trip.move, trip.styles ?? [], false)) : trip.legs;
  return { ...trip, childAges, partyExplicit: true, legs };
}

function pickMode(preference: TravelMove, styles: TravelStyle[], child: boolean, walkMinutes: number | null, roadMinutes: number | null, roadMode: LegMode): LegMode {
  const luxury = styles.includes("luxury");
  const wellness = styles.includes("wellness");
  const easy = styles.includes("backpacking") || styles.includes("slow");
  const adventure = styles.includes("adventure");
  if (child && walkMinutes != null && walkMinutes <= 8 && !luxury) return "walk";
  if (wellness && walkMinutes != null && walkMinutes <= 15 && !luxury) return "walk";
  if (walkMinutes != null && walkMinutes <= 12 && !luxury) return "walk";
  if (walkMinutes != null && walkMinutes <= 25 && easy && !child && !wellness) return "walk";
  if (walkMinutes != null && walkMinutes <= 35 && adventure && !child && !luxury) return "walk";
  if (preference === "walk" && walkMinutes != null && walkMinutes <= (child || wellness ? 20 : 45) && !luxury) return "walk";
  if (walkMinutes != null && roadMinutes != null && walkMinutes <= 18 && preference !== "drive" && !luxury && !child && !wellness) return "walk";
  return roadMode;
}

export function assessCoverage(spots: DiscoveredPlace[], scheduled: TripStop[], nights: number, firstVisit: boolean, balance: TravelBalance): CoverageRow[] {
  const defining = new Map<string, DiscoveredPlace>();
  for (const spot of spots) {
    if (spot.importance !== "iconic" && spot.importance !== "major") continue;
    for (const group of spot.groups ?? []) {
      const current = defining.get(group);
      if (!current || (spot.sitelinks ?? 0) > (current.sitelinks ?? 0)) defining.set(group, spot);
    }
  }
  const food = spots.filter((spot) => FOOD.has(spot.category));
  if (food.length >= 3 && !defining.has("food")) defining.set("food", food[0]!);
  const rows: CoverageRow[] = [];
  for (const [group, example] of defining) {
    const covered = scheduled.some((stop) => stop.day != null && !stop.excluded && (stop.name === example.name || stop.groups?.includes(group) || (group === "food" && FOOD.has(stop.category))));
    if (covered) {
      rows.push({ group, status: "covered", reason: "In the first cut.", example: readableName(example) });
      continue;
    }
    const far = example.excursion === "full" || (example.distanceKm ?? 0) >= 28 || group === "excursion";
    let reason = "Left in Discover. It did not fit this cut.";
    if (balance === "city" && (group === "nature" || group === "excursion")) reason = "Left out to keep the trip city-heavy, as you asked.";
    else if (far) reason = "Needs most of a day, so it was left out of this cut.";
    else if (nights < 5 || !firstVisit) reason = firstVisit ? "Not enough days to add it without crowding the rest." : "Held back because this is not treated as a first visit.";
    rows.push({ group, status: "omitted", reason, example: readableName(example) });
  }
  for (const spot of spots) {
    if (spot.importance !== "iconic" || spot.category === "stay" || FOOD.has(spot.category)) continue;
    const far = spot.excursion === "full" || (spot.distanceKm ?? 0) >= 28 || spot.groups?.includes("excursion");
    if (!far) continue;
    if (scheduled.some((stop) => stop.day != null && !stop.excluded && stop.name === spot.name)) continue;
    if (rows.some((row) => row.example === spot.name || row.example === readableName(spot))) continue;
    const reason = balance === "city"
      ? "Left out to keep the trip city-heavy, as you asked."
      : "Needs most of a day, so it was left out of this cut.";
    rows.push({ group: "excursion", status: "omitted", reason, example: readableName(spot) });
  }
  return rows.sort((a, b) => a.status.localeCompare(b.status) || a.group.localeCompare(b.group) || a.example.localeCompare(b.example));
}

function hotelCandidate(stop: TripStop): HotelCandidate | null {
  if (stop.category !== "stay" || stop.provider === "area") return null;
  const stars = Number((stop.hotel?.stars ?? "").match(/\d(?:\.\d)?/)?.[0]);
  const room = Number((stop.hotel?.roomSize ?? "").match(/\d{2,3}/)?.[0]);
  const flag = (value: string | undefined): "yes" | "no" | "unknown" => value === "yes" ? "yes" : value === "no" ? "no" : "unknown";
  return {
    id: stop.providerId || stop.id,
    name: readableName(stop),
    lat: stop.lat,
    lng: stop.lng,
    stars: stars >= 1 && stars <= 5 ? stars : null,
    roomSqm: room >= 8 && room <= 200 ? room : null,
    air: stop.hotel?.airConditioning ?? "unknown",
    breakfast: flag(stop.hotel?.breakfast),
    wheelchair: flag(stop.hotel?.wheelchair),
    parking: flag(stop.hotel?.parking),
    kind: stop.hotel?.kind ?? "",
  };
}

function hotelPicks(stops: TripStop[], prefs: HotelPreferences = DEFAULT_HOTEL_PREFERENCES, memory: HotelMemory = emptyHotelMemory(), move: "walk" | "drive" | "transit" = "walk", hold: string[] = []): HotelPick[] {
  const candidates = stops.map(hotelCandidate).filter((item): item is HotelCandidate => Boolean(item));
  return shortlistHotels(candidates, stops, prefs, memory, move, hold).map((card) => ({
    stopId: card.stopId,
    name: card.name,
    role: card.role,
    why: card.why,
    reasons: card.reasons,
    tradeoffs: card.tradeoffs,
    matches: card.matches,
    unverified: card.unverified,
    location: card.location,
    averageMin: card.averageMin,
    longestMin: card.longestMin,
    booked: false,
  }));
}

function applyHotelShortlist(trip: Trip, prefs: HotelPreferences, memory: HotelMemory, hold: string[] = []): Trip {
  const booked = new Set((trip.hotels ?? []).filter((hotel) => hotel.booked).map((hotel) => hotel.stopId));
  const hotels = hotelPicks(trip.stops, prefs, memory, trip.move, hold).map((hotel) => ({ ...hotel, booked: booked.has(hotel.stopId) }));
  return {
    ...trip,
    hotelPreferences: prefs,
    hotelMemory: rememberShortlist(memory, hotels),
    hotels,
    hotelNote: "",
  };
}

export function refreshHotels(trip: Trip, prefs: HotelPreferences = trip.hotelPreferences ?? DEFAULT_HOTEL_PREFERENCES, memory: HotelMemory = trip.hotelMemory ?? emptyHotelMemory()): Trip {
  return applyHotelShortlist(trip, prefs, { ...memory, previous: [], shown: [] }, memory.kept);
}

export function setHotelPreferences(trip: Trip, prefs: HotelPreferences): Trip {
  const memory = trip.hotelMemory ?? emptyHotelMemory();
  return applyHotelShortlist(trip, prefs, { ...memory, previous: [], shown: [] }, memory.kept);
}

export function rerollHotels(trip: Trip): Trip {
  const prefs = trip.hotelPreferences ?? DEFAULT_HOTEL_PREFERENCES;
  const memory = trip.hotelMemory ?? emptyHotelMemory();
  const seeded = memory.previous.length ? memory : { ...memory, previous: (trip.hotels ?? []).map((hotel) => hotel.stopId) };
  const before = (trip.hotels ?? []).filter((hotel) => !seeded.kept.includes(hotel.stopId)).map((hotel) => hotel.stopId).join("|");
  const next = applyHotelShortlist(trip, prefs, seeded, seeded.kept);
  const after = (next.hotels ?? []).filter((hotel) => !seeded.kept.includes(hotel.stopId)).map((hotel) => hotel.stopId).join("|");
  if (before && before === after) return { ...next, hotelNote: "These are the only stays that fit. Reroll couldn't find another." };
  return next;
}

export function toggleKeptHotel(trip: Trip, stopId: string): Trip {
  const memory = trip.hotelMemory ?? emptyHotelMemory();
  const kept = memory.kept.includes(stopId) ? memory.kept.filter((id) => id !== stopId) : [...memory.kept, stopId].slice(-3);
  const hotels = (trip.hotels ?? []).map((hotel) => hotel.stopId === stopId ? { ...hotel, role: kept.includes(stopId) ? "Kept" : hotel.role === "Kept" ? "Also fits this trip" : hotel.role } : hotel);
  return { ...trip, hotels, hotelMemory: { ...memory, kept } };
}

export function rejectHotel(trip: Trip, stopId: string, reason = ""): Trip {
  const prefs = trip.hotelPreferences ?? DEFAULT_HOTEL_PREFERENCES;
  const memory = trip.hotelMemory ?? emptyHotelMemory();
  const rejected = memory.rejected.includes(stopId) ? memory.rejected : [...memory.rejected, stopId].slice(-40);
  const kept = memory.kept.filter((id) => id !== stopId);
  const reasons = reason ? { ...memory.reasons, [stopId]: reason } : memory.reasons;
  const previous = memory.previous.length ? memory.previous : (trip.hotels ?? []).map((hotel) => hotel.stopId);
  const hold = (trip.hotels ?? []).map((hotel) => hotel.stopId).filter((id) => id !== stopId && !rejected.includes(id));
  const next = applyHotelShortlist(trip, prefs, { ...memory, rejected, kept, reasons, previous }, hold);
  if ((next.hotels ?? []).some((hotel) => hotel.stopId === stopId)) return { ...next, hotelNote: "No other stay fits, so this one stays." };
  return next;
}

export function likeHotel(trip: Trip, stopId: string): Trip {
  const prefs = trip.hotelPreferences ?? DEFAULT_HOTEL_PREFERENCES;
  const memory = trip.hotelMemory ?? emptyHotelMemory();
  const previous = memory.previous.length ? memory.previous : (trip.hotels ?? []).map((hotel) => hotel.stopId);
  const hold = [...new Set([...memory.kept, stopId])];
  return applyHotelShortlist(trip, prefs, { ...memory, similar: stopId, previous }, hold);
}

export function rankStaysForPlan<T extends { lat: number; lng: number; name: string; category?: string; provider?: string; providerId?: string }>(
  stays: T[],
  targets: { lat: number; lng: number }[],
): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];
  for (const stay of stays) {
    if (stay.category && stay.category !== "stay") continue;
    if (stay.provider === "area") continue;
    const key = stay.providerId || stay.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(stay);
  }
  return unique
    .map((stay) => {
      const meters = targets.length
        ? targets.reduce((sum, stop) => sum + distanceMeters(stay.lat, stay.lng, stop.lat, stop.lng), 0) / targets.length
        : 0;
      return { stay, meters };
    })
    .sort((a, b) => a.meters - b.meters)
    .map((row) => row.stay);
}

function whyLine(balance: TravelBalance, styles: TravelStyle[], firstVisit: boolean, oneBase: boolean, _coverage: CoverageRow[]): string {
  const feel = styles.join(" and ") || "comfort";
  const shape = balance === "city" ? "City-heavy" : balance === "nature" ? "Nature-heavy" : "City and nature";
  const visit = firstVisit ? "First visit" : "Return visit";
  const base = oneBase ? "one base" : "a second base only if the move is worth it";
  return `${visit}. ${shape}, ${feel}, ${base}.`;
}

function clusterLine(stops: TripStop[]): string {
  const saved = stops.filter((stop) => stop.day == null && (stop.bucket === "saved" || stop.bucket === "must"));
  const scheduled = stops.filter((stop) => stop.day != null && stop.category !== "stay");
  if (saved.length < 3 || !scheduled.length) return "";
  const groups = new Map<number, TripStop[]>();
  for (const spot of saved) {
    let best = scheduled[0];
    let bestMeters = Number.POSITIVE_INFINITY;
    for (const stop of scheduled) {
      const meters = distanceMeters(spot.lat, spot.lng, stop.lat, stop.lng);
      if (meters < bestMeters) {
        best = stop;
        bestMeters = meters;
      }
    }
    if (!best || best.day == null || bestMeters > 4000) continue;
    groups.set(best.day, [...(groups.get(best.day) ?? []), spot]);
  }
  const winner = [...groups.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  if (!winner || winner[1].length < 3) return "";
  return `These places cluster with day ${winner[0] + 1}: ${winner[1].slice(0, 3).map((stop) => readableName(stop)).join(", ")}.`;
}

export function dayStops(trip: Trip, day: number): TripStop[] {
  return trip.stops.filter((stop) => stop.day === day).sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
}

export function retimeDay(trip: Trip, day: number): Trip {
  const rows = dayStops(trip, day);
  if (!rows.length) return trip;
  const child = hasYoungChild(trip.childAges);
  let cursor = child || trip.pace === "relaxed" ? 10 * 60 : 9 * 60;
  const nextStops = trip.stops.map((stop) => ({ ...stop }));
  const legs = trip.legs.filter((leg) => leg.day !== day);
  let previous: TripStop | null = null;
  for (const row of rows) {
    const stop = nextStops.find((item) => item.id === row.id);
    if (!stop) continue;
    if (previous) {
      const minutes = estimateMinutes(trip.move, distanceMeters(previous.lat, previous.lng, stop.lat, stop.lng));
      cursor += minutes;
      legs.push(explainLeg({
        fromId: previous.id,
        toId: stop.id,
        day,
        mode: trip.move,
        minutes,
        meters: Math.round(distanceMeters(previous.lat, previous.lng, stop.lat, stop.lng)),
        source: "estimate",
        label: legLabel(trip.move, minutes, "estimate"),
      }, trip.move, trip.styles ?? [], child));
    }
    stop.startTime = clockTime(cursor);
    stop.endTime = clockTime(cursor + stop.duration);
    cursor += stop.duration;
    previous = stop;
  }
  const days = trip.days.map((item) => item.index === day ? { ...item, line: null, freeNote: freeWindow(clockTime(cursor)) } : item);
  const burden = burdenFrom(legs, trip.burden.hotelChanges, nextStops, trip.move, child);
  return { ...trip, stops: nextStops, legs, days, burden };
}

export function moveStop(trip: Trip, stopId: string, direction: -1 | 1): Trip {
  const stop = trip.stops.find((item) => item.id === stopId);
  if (!stop || stop.day == null || stop.category === "stay") return trip;
  const rows = dayStops(trip, stop.day).filter((item) => item.category !== "stay");
  const index = rows.findIndex((item) => item.id === stopId);
  const swap = rows[index + direction];
  if (!swap) return trip;
  const next = {
    ...trip,
    stops: trip.stops.map((item) => {
      if (item.id === stop.id) return { ...item, startTime: swap.startTime };
      if (item.id === swap.id) return { ...item, startTime: stop.startTime };
      return item;
    }),
  };
  return retimeDay(next, stop.day);
}

export function unscheduleStop(trip: Trip, stopId: string): Trip {
  const stop = trip.stops.find((item) => item.id === stopId);
  if (!stop || stop.day == null || stop.category === "stay") return trip;
  const day = stop.day;
  const bucket: TripStop["bucket"] = FOOD.has(stop.category) ? "food" : "saved";
  const next = {
    ...trip,
    stops: trip.stops.map((item) => item.id === stopId ? { ...item, day: null, startTime: null, endTime: null, bucket, note: "Saved. Not placed on a day." } : item),
    cluster: "",
  };
  const retimed = retimeDay(next, day);
  return { ...retimed, cluster: clusterLine(retimed.stops) };
}

export function scheduleStop(trip: Trip, stopId: string, day: number): Trip {
  const stop = trip.stops.find((item) => item.id === stopId);
  if (!stop || !trip.days.some((item) => item.index === day)) return trip;
  const next = {
    ...trip,
    stops: trip.stops.map((item) => item.id === stopId ? { ...item, day, bucket: "scheduled" as const, startTime: "23:59", note: "Added to the day. Update travel times for a real route." } : item),
  };
  return { ...retimeDay(next, day), cluster: clusterLine(next.stops) };
}

/** Add already-known places to one day. Other days are left untouched. */
export function appendStops(trip: Trip, day: number, stopIds: string[]): Trip {
  const rank = new Map(stopIds.map((id, index) => [id, index]));
  if (!rank.size || !trip.days.some((item) => item.index === day)) return trip;
  const next = {
    ...trip,
    stops: trip.stops.map((item) => rank.has(item.id) ? {
      ...item,
      day,
      bucket: "scheduled" as const,
      startTime: clockTime(23 * 60 + (rank.get(item.id) ?? 0)),
      note: item.why || item.note || "Added for this free window.",
    } : item),
  };
  return { ...retimeDay(next, day), cluster: clusterLine(next.stops) };
}

export function applyRoute(trip: Trip, day: number, route: { minutes: (number | null)[]; meters: (number | null)[]; line: [number, number][] | null; source: "osrm" | "estimate" }): Trip {
  const rows = dayStops(trip, day);
  const child = hasYoungChild(trip.childAges);
  const legs = trip.legs.filter((leg) => leg.day !== day);
  let cursor = rows[0]?.startTime ? Number(rows[0].startTime.slice(0, 2)) * 60 + Number(rows[0].startTime.slice(3)) : 9 * 60;
  const nextStops = trip.stops.map((stop) => ({ ...stop }));
  rows.forEach((row, index) => {
    const stop = nextStops.find((item) => item.id === row.id);
    if (!stop) return;
    if (index > 0) {
      const minutes = route.minutes[index - 1] ?? null;
      const meters = route.meters[index - 1] ?? null;
      if (minutes != null) cursor += minutes;
      legs.push(explainLeg({
        fromId: rows[index - 1]?.id ?? row.id,
        toId: row.id,
        day,
        mode: trip.move,
        minutes,
        meters,
        source: minutes == null ? "none" : route.source,
        label: legLabel(trip.move, minutes, minutes == null ? "none" : route.source),
      }, trip.move, trip.styles ?? [], child));
    }
    stop.startTime = clockTime(cursor);
    stop.endTime = clockTime(cursor + stop.duration);
    cursor += stop.duration;
  });
  const days = trip.days.map((item) => item.index === day ? { ...item, line: route.line } : item);
  const burden = burdenFrom(legs, trip.burden.hotelChanges, nextStops, trip.move, child);
  return { ...trip, stops: nextStops, legs, days, burden };
}

export function keepLockedDays(previous: Trip | null, next: Trip): Trip {
  if (!previous) return next;
  const locked = new Set(previous.days.filter((day) => day.locked).map((day) => day.date));
  if (!locked.size) return next;
  const keptDays = next.days.map((day) => locked.has(day.date) ? previous.days.find((item) => item.date === day.date) ?? day : day);
  const keptIndexes = new Set(keptDays.filter((day) => locked.has(day.date)).map((day) => day.index));
  const stops = [
    ...next.stops.filter((stop) => stop.day == null || !keptIndexes.has(stop.day)),
    ...previous.stops.filter((stop) => stop.day != null && keptIndexes.has(stop.day)),
  ];
  const legs = [
    ...next.legs.filter((leg) => !keptIndexes.has(leg.day)),
    ...previous.legs.filter((leg) => keptIndexes.has(leg.day)),
  ];
  return { ...next, days: keptDays.filter((day): day is TripDay => Boolean(day)), stops, legs, bookings: previous.bookings };
}

export function pinKey(stop: Pick<TripStop, "provider" | "providerId" | "lat" | "lng">): string {
  if (stop.providerId) return `${stop.provider}:${stop.providerId}`;
  return `${stop.lat.toFixed(4)},${stop.lng.toFixed(4)}`;
}

export function bestDayFor(trip: Trip, stopId: string): { day: number; minutes: number; reason: string } | null {
  const stop = trip.stops.find((item) => item.id === stopId);
  if (!stop) return null;
  const incomingFar = placeIsFar(stop);
  let best: { day: number; score: number; minutes: number; reason: string } | null = null;
  for (const day of trip.days.slice(0, PLANNED_DAY_CAP)) {
    const rows = dayStops(trip, day.index).filter((item) => item.category !== "stay");
    if (!rows.length) continue;
    let near = rows[0]!;
    let meters = distanceMeters(stop.lat, stop.lng, near.lat, near.lng);
    for (const row of rows) {
      const next = distanceMeters(stop.lat, stop.lng, row.lat, row.lng);
      if (next < meters) {
        meters = next;
        near = row;
      }
    }
    const minutes = estimateMinutes(trip.move === "walk" ? "walk" : "drive", meters);
    const dayFar = rows.some((row) => placeIsFar(row));
    let score = minutes;
    if (incomingFar && dayFar) score += 500;
    if (incomingFar) score += rows.length * 40;
    else if (rows.length >= 4) score += 40;
    const reason = incomingFar && dayFar
      ? `Day ${day.index + 1} already has an excursion. Another day is a better fit.`
      : `Close to ${readableName(near)} on day ${day.index + 1}. About ${minutes} min extra, estimated.`;
    if (!best || score < best.score) best = { day: day.index, score, minutes, reason };
  }
  if (!best) return { day: 0, minutes: 0, reason: "No day has stops yet. Day 1 is the open slot." };
  return { day: best.day, minutes: best.minutes, reason: best.reason };
}

export function suggestOrder(trip: Trip, day: number): { saved: number; names: string[] } | null {
  const rows = dayStops(trip, day);
  const stay = rows.find((stop) => stop.category === "stay");
  const sights = rows.filter((stop) => stop.category !== "stay");
  if (!stay || sights.length < 3) return null;
  const current = sights.reduce((sum, stop, index) => {
    const from = index === 0 ? stay : sights[index - 1]!;
    return sum + estimateMinutes(trip.move === "walk" ? "walk" : "drive", distanceMeters(from.lat, from.lng, stop.lat, stop.lng));
  }, 0);
  const pending = [...sights];
  const ordered: TripStop[] = [];
  let cursor = stay;
  while (pending.length) {
    pending.sort((a, b) => distanceMeters(cursor.lat, cursor.lng, a.lat, a.lng) - distanceMeters(cursor.lat, cursor.lng, b.lat, b.lng));
    const next = pending.shift();
    if (!next) break;
    ordered.push(next);
    cursor = next;
  }
  const nextMinutes = ordered.reduce((sum, stop, index) => {
    const from = index === 0 ? stay : ordered[index - 1]!;
    return sum + estimateMinutes(trip.move === "walk" ? "walk" : "drive", distanceMeters(from.lat, from.lng, stop.lat, stop.lng));
  }, 0);
  const saved = current - nextMinutes;
  const same = ordered.every((stop, index) => stop.id === sights[index]?.id);
  if (same || saved < 15) return null;
  return { saved, names: ordered.map((stop) => readableName(stop)) };
}

export function applySuggestedOrder(trip: Trip, day: number): Trip {
  const idea = suggestOrder(trip, day);
  if (!idea) return trip;
  const rows = dayStops(trip, day);
  const stay = rows.find((stop) => stop.category === "stay");
  const sights = rows.filter((stop) => stop.category !== "stay");
  if (!stay) return trip;
  const pending = [...sights];
  const ordered: TripStop[] = [];
  let cursor = stay;
  while (pending.length) {
    pending.sort((a, b) => distanceMeters(cursor.lat, cursor.lng, a.lat, a.lng) - distanceMeters(cursor.lat, cursor.lng, b.lat, b.lng));
    const next = pending.shift();
    if (!next) break;
    ordered.push(next);
    cursor = next;
  }
  const rank = new Map(ordered.map((stop, index) => [stop.id, index]));
  const next = {
    ...trip,
    stops: trip.stops.map((stop) => rank.has(stop.id) ? { ...stop, startTime: clockTime(12 * 60 + (rank.get(stop.id) ?? 0)) } : stop),
  };
  return retimeDay(next, day);
}

export function applyPlacePhoto(trip: Trip, stopId: string, photo: PlacePhoto): Trip {
  return {
    ...trip,
    stops: trip.stops.map((stop) => stop.id === stopId ? {
      ...stop,
      photo,
      image: photo.thumbnailUrl,
      imagePage: photo.descriptionUrl,
    } : stop),
  };
}

export function savePlace(trip: Trip, stopId: string): Trip {
  return {
    ...trip,
    stops: trip.stops.map((stop) => stop.id === stopId ? { ...stop, bucket: stop.day == null ? "saved" : stop.bucket, note: stop.day == null ? "Saved for later." : stop.note } : stop),
  };
}

export function excludePlace(trip: Trip, stopId: string): Trip {
  const stop = trip.stops.find((item) => item.id === stopId);
  if (!stop || stop.category === "stay") return trip;
  const day = stop.day;
  const next = {
    ...trip,
    stops: trip.stops.map((item) => item.id === stopId ? { ...item, day: null, startTime: null, endTime: null, excluded: true, bucket: "maybe" as const, note: "Not for this trip." } : item),
  };
  const retimed = day == null ? next : retimeDay(next, day);
  return { ...retimed, cluster: clusterLine(retimed.stops) };
}

export function selectBase(trip: Trip, stopId: string, booked = false): Trip {
  const hotel = trip.stops.find((item) => item.category === "stay" && item.provider !== "area" && (item.id === stopId || item.providerId === stopId));
  if (!hotel) return trip;
  const scheduled = trip.stops.filter((stop) => stop.category === "stay" && stop.day != null);
  const current = scheduled[0];
  let stops = trip.stops;
  const same = Boolean(current && current.providerId && current.providerId === hotel.providerId);
  if (current && !same && current.provider !== "area" && current.providerId) {
    const archived = stops.some((stop) => stop.category === "stay" && stop.day == null && stop.providerId === current.providerId);
    if (!archived) {
      const archiveId = stops.some((stop) => stop.id === current.providerId) ? `${current.providerId}-saved` : current.providerId;
      stops = [...stops, {
        ...current,
        id: archiveId,
        day: null,
        startTime: null,
        endTime: null,
        bucket: "saved",
        note: "Mapped stay. Not the selected base.",
      }];
    }
  }
  let next: Trip = {
    ...trip,
    hotels: (trip.hotels ?? []).map((item) => ({ ...item, booked: booked && (item.stopId === hotel.id || item.stopId === hotel.providerId) })),
    stops: stops.map((stop) => {
      if (stop.category !== "stay" || stop.day == null) return stop;
      return {
        ...stop,
        name: hotel.name,
        lat: hotel.lat,
        lng: hotel.lng,
        provider: hotel.provider,
        providerId: hotel.providerId,
        address: hotel.address,
        hotel: hotel.hotel,
        localName: hotel.localName,
        nameEn: hotel.nameEn,
        nameLatin: hotel.nameLatin,
        nameLocal: hotel.nameLocal,
        nameEnglish: hotel.nameEnglish,
        nameRomanized: hotel.nameRomanized,
        displayName: hotel.displayName,
        displaySubtitle: hotel.displaySubtitle,
        language: hotel.language,
        translationSource: hotel.translationSource,
        displayNameQuality: hotel.displayNameQuality,
        description: hotel.description,
        descriptionDisplay: hotel.descriptionDisplay,
        addressLocal: hotel.addressLocal,
        addressDisplay: hotel.addressDisplay,
        bookingStatus: booked ? "booked" : "none",
        note: booked ? "Booked hotel. This is the base, not a suggestion." : "Suggested base from the map. Not a reservation.",
      };
    }),
  };
  if (same) return { ...trip, hotels: next.hotels };
  for (const day of trip.days) {
    if (dayStops(next, day.index).length > 1) next = retimeDay(next, day.index);
  }
  return next;
}

export function selectLegMode(trip: Trip, fromId: string, toId: string, mode: LegMode): Trip {
  const leg = trip.legs.find((item) => item.fromId === fromId && item.toId === toId);
  const alt = leg?.alternatives?.find((item) => item.mode === mode);
  if (!leg || !alt || alt.minutes == null || alt.source === "unavailable") return trip;
  const delta = alt.minutes - (leg.minutes ?? alt.minutes);
  const legs = trip.legs.map((item) => item === leg ? {
    ...item,
    minutes: alt.minutes,
    label: alt.label,
    shown: mode,
    selectedMode: mode,
    source: alt.source === "osrm" || alt.source === "estimate" ? alt.source : item.source,
    recommendationReason: mode === item.recommendedMode ? item.recommendationReason : "",
  } : item);
  const stops = trip.stops.map((stop) => {
    if (stop.day !== leg.day || !stop.startTime || stop.id === fromId) return stop;
    const rows = dayStops(trip, leg.day);
    const fromIndex = rows.findIndex((row) => row.id === fromId);
    const stopIndex = rows.findIndex((row) => row.id === stop.id);
    if (fromIndex < 0 || stopIndex <= fromIndex) return stop;
    const start = clockToMinutes(stop.startTime) + delta;
    return { ...stop, startTime: clockTime(start), endTime: clockTime(start + stop.duration) };
  });
  return { ...trip, legs, stops };
}

function clockToMinutes(value: string): number {
  const [hour, minute] = value.split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

export type RebalanceKind = "city" | "nature" | "culture" | "local" | "relaxed" | "more";

export function rebalanceTrip(trip: Trip, kind: RebalanceKind): Trip {
  let next = trip;
  if (kind === "relaxed") {
    for (const day of trip.days) {
      if (day.locked) continue;
      const sights = dayStops(next, day.index).filter((stop) => stop.category !== "stay" && !FOOD.has(stop.category));
      const last = sights.at(-1);
      if (sights.length > 1 && last) next = unscheduleStop(next, last.id);
    }
    return { ...next, balance: trip.balance, whyTrip: "Unlocked days were eased off. Kept days stayed." };
  }
  if (kind === "more") {
    for (const day of trip.days) {
      if (day.locked) continue;
      const count = dayStops(next, day.index).filter((stop) => stop.category !== "stay").length;
      if (count >= 4) continue;
      const candidate = next.stops.find((stop) => stop.day == null && !stop.excluded && SEE.has(stop.category));
      if (candidate) next = scheduleStop(next, candidate.id, day.index);
    }
    return { ...next, whyTrip: "A few saved places were added to lighter days. The rest of the trip stayed." };
  }
  const want = kind === "nature" ? ["nature", "excursion", "wildlife"] : kind === "culture" ? ["heritage"] : kind === "city" ? ["city", "heritage", "shopping", "food"] : ["local"];
  for (const day of trip.days) {
    if (day.locked) continue;
    if (kind === "city") {
      const far = dayStops(next, day.index).find((stop) => stop.excursion === "full" || (stop.distanceKm ?? 0) >= 18);
      if (far) next = unscheduleStop(next, far.id);
      continue;
    }
    const already = dayStops(next, day.index).some((stop) => stop.groups?.some((group) => want.includes(group)) || (kind === "local" && stop.importance === "local"));
    if (already) continue;
    const candidate = next.stops.find((stop) => stop.day == null && !stop.excluded && (kind === "local" ? stop.importance === "local" || stop.importance === "interest" : stop.groups?.some((group) => want.includes(group))));
    if (!candidate) continue;
    const heavy = dayStops(next, day.index).filter((stop) => stop.category !== "stay" && !FOOD.has(stop.category));
    if (heavy.length >= 3) {
      const drop = heavy.find((stop) => !stop.groups?.some((group) => want.includes(group)));
      if (drop) next = unscheduleStop(next, drop.id);
    }
    next = scheduleStop(next, candidate.id, day.index);
  }
  const line = kind === "nature" ? "Nature days were filled from places already found." : kind === "culture" ? "Heritage places already found were moved onto open days." : kind === "local" ? "A local place replaced a busier stop where one was waiting." : "Far excursions were taken off unlocked days.";
  return { ...next, balance: kind === "city" || kind === "nature" ? kind : trip.balance, whyTrip: line };
}

export function discoverSections(trip: Trip): { id: string; title: string; stops: TripStop[] }[] {
  const open = trip.stops.filter((stop) => stop.day == null && !stop.excluded && stop.category !== "stay");
  const sections: { id: string; title: string; stops: TripStop[] }[] = [];
  const push = (id: string, title: string, stops: TripStop[]) => {
    const unique = stops.filter((stop, index) => stops.findIndex((item) => item.id === stop.id) === index);
    if (unique.length) sections.push({ id, title, stops: unique.slice(0, 8) });
  };
  push("major", "Other major sights", open.filter((stop) => stop.importance === "iconic" || stop.importance === "major"));
  push("picks", "Kairos picks", open.filter((stop) => stop.importance === "iconic" || stop.importance === "interest"));
  push("food", "Food and drink", open.filter((stop) => FOOD.has(stop.category)));
  push("culture", "Culture", open.filter((stop) => stop.groups?.includes("heritage") || stop.category === "museum" || stop.category === "historic"));
  push("nature", "Nature", open.filter((stop) => stop.groups?.includes("nature") || stop.groups?.includes("excursion") || stop.category === "park"));
  push("shopping", "Shopping", open.filter((stop) => stop.category === "shopping" || stop.category === "market"));
  push("evening", "Evening", open.filter((stop) => stop.category === "nightlife"));
  push("rain", "Rainy-day options", open.filter((stop) => stop.indoor && SEE.has(stop.category)));
  const saved = open.filter((stop) => stop.bucket === "saved" || stop.bucket === "must");
  push("saved", "Saved", saved);
  for (const day of trip.days.slice(0, PLANNED_DAY_CAP)) {
    const rows = dayStops(trip, day.index);
    if (!rows.length) continue;
    const near = open.filter((stop) => rows.some((row) => distanceMeters(stop.lat, stop.lng, row.lat, row.lng) < 2500)).slice(0, 6);
    push(`near-${day.index}`, `Near day ${day.index + 1}`, near);
  }
  if (!sections.length && open.length) push("open", "Unscheduled", open);
  return sections;
}

