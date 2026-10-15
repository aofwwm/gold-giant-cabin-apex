import type { TodayItem } from "@/lib/today";

export const TRAVEL_INTERESTS = ["food", "nature", "culture", "beach", "walks", "shopping", "night"] as const;
export type TravelInterest = (typeof TRAVEL_INTERESTS)[number];
export const TRAVEL_STYLES = ["backpacking", "comfort", "luxury", "adventure", "slow", "wellness", "culture"] as const;
export type TravelStyle = (typeof TRAVEL_STYLES)[number];
export type TravelPace = "relaxed" | "balanced" | "full";
export type TravelMove = "walk" | "drive" | "transit";
export type TravelBudget = "simple" | "mid" | "splurge";
export type TravelBalance = "city" | "balanced" | "nature";
export type TravelFocus = "icons" | "local";
export type FoodPlanning = "minimal" | "meals" | "balanced" | "feature";
export type DestinationType = "country" | "city" | "region" | "island" | "destination";

export const YOUNG_CHILD_AGE = 7;

/** Ages typed into the Travel form. An empty box is not a child. */
export function parseChildAges(value: string): number[] {
  return value
    .split(/[^0-9]+/)
    .filter((token) => /^\d+$/.test(token))
    .map((token) => Number(token))
    .filter((age) => age >= 0 && age <= 17)
    .slice(0, 6);
}

/** The current Travel party. Family mode, old trips, and blank fields do not count. */
export function explicitChildAges(ages: readonly unknown[] | null | undefined): number[] {
  if (!Array.isArray(ages)) return [];
  return ages
    .filter((age): age is number => typeof age === "number" && Number.isInteger(age) && age >= 0 && age <= 17)
    .slice(0, 6);
}

export function hasYoungChild(ages: readonly unknown[] | null | undefined): boolean {
  return explicitChildAges(ages).some((age) => age < YOUNG_CHILD_AGE);
}

export type TravelDestination = {
  name: string;
  displayName: string;
  type: DestinationType;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  provider: "photon";
  providerId: string;
  bbox?: [number, number, number, number];
};

type PhotonProps = {
  name?: string;
  country?: string;
  countrycode?: string;
  state?: string;
  county?: string;
  osm_key?: string;
  osm_value?: string;
  osm_type?: string;
  osm_id?: number;
  extent?: number[];
  boundingbox?: Array<string | number>;
};

const TYPE_RANK: Record<DestinationType, number> = {
  country: 500,
  city: 400,
  region: 320,
  island: 280,
  destination: 180,
};

const ALLOWED_SUFFIX = new Set(["prefecture", "province", "region", "state", "island", "islands", "county"]);

function boundaryBox(props: PhotonProps): [number, number, number, number] | undefined {
  const extent = props.extent;
  if (Array.isArray(extent) && extent.length === 4) {
    const west = Number(extent[0]);
    const north = Number(extent[1]);
    const east = Number(extent[2]);
    const south = Number(extent[3]);
    if ([south, west, north, east].every(Number.isFinite) && south < north && west < east) return [south, west, north, east];
  }
  const box = props.boundingbox;
  if (Array.isArray(box) && box.length === 4) {
    const south = Number(box[0]);
    const north = Number(box[1]);
    const west = Number(box[2]);
    const east = Number(box[3]);
    if ([south, west, north, east].every(Number.isFinite) && south < north && west < east) return [south, west, north, east];
  }
  return undefined;
}

export function travelDestinationFromPhoton(props: PhotonProps, latitude: number, longitude: number): TravelDestination | null {
  const name = (props.name ?? "").replace(/\s+/g, " ").trim();
  const key = props.osm_key ?? "";
  const value = props.osm_value ?? "";
  if (name.length < 2 || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (["shop", "amenity", "highway", "office", "building", "landuse", "leisure", "craft", "tourism"].includes(key)) return null;
  let type: DestinationType | null = null;
  if (key === "place" && value === "country") type = "country";
  else if (key === "place" && (value === "city" || value === "town")) type = "city";
  else if (key === "place" && (value === "state" || value === "province" || value === "region")) type = "region";
  else if (key === "place" && (value === "island" || value === "archipelago")) type = "island";
  else if (key === "boundary" && value === "administrative") type = "region";
  if (!type) return null;
  const country = (props.country || (type === "country" ? name : "")).trim();
  const countryCode = (props.countrycode ?? "").toUpperCase();
  const region = (props.state || props.county || "").trim();
  return {
    name,
    displayName: type === "country" ? name : [name, region && region !== name ? region : "", country && country !== name ? country : ""].filter(Boolean).join(", "),
    type,
    country,
    countryCode,
    latitude,
    longitude,
    provider: "photon",
    providerId: props.osm_type && props.osm_id ? `osm:${props.osm_type}:${props.osm_id}` : "",
    bbox: boundaryBox(props),
  };
}

export function rankTravelDestinations(query: string, hits: TravelDestination[]): TravelDestination[] {
  const asked = query.trim().toLowerCase();
  const ranked = hits.map((hit) => {
    const name = hit.name.toLowerCase();
    const words = name.split(/\s+/);
    const exact = name === asked;
    const suffixOk = words.length === 2 && words[0] === asked && ALLOWED_SUFFIX.has(words[1] ?? "");
    const extra = !exact && !suffixOk;
    let score = TYPE_RANK[hit.type];
    if (exact) score += 240;
    else if (suffixOk) score += 80;
    else if (name.startsWith(asked)) score -= 40;
    else score -= 120;
    if (hit.country.toLowerCase() === asked && hit.type !== "country") score += 30;
    if (extra && hit.type !== "country") score -= 20;
    return { hit, score };
  });
  ranked.sort((a, b) => b.score - a.score || a.hit.name.length - b.hit.name.length);
  const exactExists = ranked.some((row) => row.hit.name.toLowerCase() === asked);
  const unique: TravelDestination[] = [];
  for (const row of ranked) {
    const name = row.hit.name.toLowerCase();
    const words = name.split(/\s+/);
    const exact = name === asked;
    const suffixOk = words.length === 2 && words[0] === asked && ALLOWED_SUFFIX.has(words[1] ?? "");
    if (row.score < 200) continue;
    if (exactExists && !exact && !suffixOk && row.hit.type !== "island") continue;
    const key = `${row.hit.type}:${row.hit.name.toLowerCase()}:${row.hit.countryCode}`;
    if (unique.some((item) => `${item.type}:${item.name.toLowerCase()}:${item.countryCode}` === key)) continue;
    unique.push(row.hit);
    if (unique.length === 6) break;
  }
  return unique;
}

function sameDestination(left: TravelDestination, right: TravelDestination): boolean {
  if (left.providerId && right.providerId && left.providerId === right.providerId) return true;
  return left.type === right.type && left.name.toLowerCase() === right.name.toLowerCase() && left.countryCode === right.countryCode;
}

/** Keep the geocoder object. A country is a real selection, not a dead click. */
export function selectTravelDestination(current: TravelDestination[], hit: TravelDestination): TravelDestination[] {
  if (!Number.isFinite(hit.latitude) || !Number.isFinite(hit.longitude) || Math.abs(hit.latitude) > 90 || Math.abs(hit.longitude) > 180) return current;
  if (hit.name.trim().length < 2) return current;
  if (hit.type === "country") {
    const cities = current.filter((item) => item.type !== "country" && item.countryCode === hit.countryCode && !sameDestination(item, hit));
    return [hit, ...cities].slice(0, 3);
  }
  const cities = current.filter((item) => item.type !== "country" && !sameDestination(item, hit));
  return [...cities, hit].slice(0, 3);
}

export function planningDestinations(destinations: TravelDestination[]): TravelDestination[] {
  const places = destinations.filter((item) => item.type !== "country");
  return (places.length ? places : destinations).slice(0, 3);
}

export type TravelBrief = {
  destination: string;
  address: string;
  latitude: number;
  longitude: number;
  start: string;
  nights: number;
  adults: number;
  childAges: number[];
  pace: TravelPace;
  move: TravelMove;
  budget: TravelBudget;
  interests: TravelInterest[];
  oneBase: boolean;
  rejected: string[];
  lockedDates: string[];
  salt: number;
  styles?: TravelStyle[];
  balance?: TravelBalance;
  firstVisit?: boolean;
  focus?: TravelFocus;
  foodPlanning?: FoodPlanning;
};

export function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const next = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

export function dayLabel(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-SG", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(year, (month || 1) - 1, day || 1)));
}

type TravelStopLike = {
  id?: string;
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
  day?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  duration?: number;
  note?: string;
  indoor?: boolean;
  category?: string;
};

type OldStop = {
  id: string;
  kind: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  minutes?: number;
  indoor?: boolean;
  startMin: number;
  endMin: number;
  note?: string;
};

export function itemsFromTravel(date: string, raw: unknown): TodayItem[] {
  if (!raw || typeof raw !== "object") return [];
  const body = raw as {
    stops?: TravelStopLike[];
    days?: { index?: number; date?: string; locked?: boolean; stops?: OldStop[] }[];
  };
  if (Array.isArray(body.stops) && body.stops.some((stop) => "lat" in stop || "startTime" in stop)) {
    const day = body.days?.find((item) => item.date === date);
    if (!day || typeof day.index !== "number") return [];
    return body.stops.filter((stop) => stop.day === day.index && stop.category !== "stay").flatMap((stop) => {
      const startMin = clockToMin(stop.startTime);
      const endMin = clockToMin(stop.endTime) ?? (startMin == null ? null : startMin + (stop.duration || 60));
      if (startMin == null || endMin == null || typeof stop.lat !== "number" || typeof stop.lng !== "number") return [];
      return [{
        id: `travel-${date}-${stop.id}`,
        sourceType: "travel" as const,
        sourceId: stop.id || stop.name || "stop",
        title: stop.name || "Stop",
        kind: "travel" as const,
        date,
        startMin,
        endMin,
        place: {
          name: stop.name || "Stop",
          address: stop.address || "",
          latitude: stop.lat,
          longitude: stop.lng,
        },
        status: "confirmed" as const,
        flexible: false,
        locked: Boolean(day.locked),
        notes: stop.note || "",
        online: false,
        outdoor: stop.indoor === false,
        href: "/?mode=travel",
      }];
    });
  }
  const day = body.days?.find((item) => item.date === date);
  if (!day?.stops) return [];
  return day.stops.filter((stop) => stop.kind !== "rest").map((stop) => ({
    id: `travel-${day.date}-${stop.id}`,
    sourceType: "travel" as const,
    sourceId: stop.id,
    title: stop.title,
    kind: "travel" as const,
    date,
    startMin: stop.startMin,
    endMin: stop.endMin,
    place: {
      name: stop.title,
      address: stop.address,
      latitude: stop.latitude,
      longitude: stop.longitude,
    },
    status: "confirmed" as const,
    flexible: false,
    locked: Boolean(day.locked),
    notes: stop.note ?? "",
    online: false,
    outdoor: !stop.indoor,
    href: "/?mode=travel",
  }));
}

function clockToMin(value: string | null | undefined): number | null {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}
