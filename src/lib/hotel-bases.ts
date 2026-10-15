/**
 * Where to stay. Ranks neighbourhoods and overnight towns from the itinerary.
 * Hotel brands are not candidates. Nothing in this file is allowed to sort areas by a partner.
 */

import { distanceMeters } from "@/lib/coord";
import { hasYoungChild } from "@/lib/travel";
import { estimateMinutes, retimeDay, type Trip, type TripStop } from "@/lib/travel-model";

export type StayRole = "Best overall base" | "Alternative" | "Overnight base" | "Closest area";

export type StayArea = {
  id: string;
  name: string;
  role: StayRole;
  why: string[];
  tradeoff: string;
  averageMin: number;
  longestMin: number;
  closeDays: number;
  dayCount: number;
  nightsLabel: string;
  lat: number;
  lng: number;
};

export type CanonicalHotel = {
  name: string;
  lat: number;
  lng: number;
  address: string;
  provider: "osm" | "wikidata";
  providerId: string;
};

type DayPoint = {
  day: number;
  lat: number;
  lng: number;
  names: string[];
  localities: string[];
  areas: string[];
};

const FOOD = new Set(["restaurant", "cafe", "market", "nightlife"]);

const LABELS: { city: string; name: string; lat: number; lng: number }[] = [
  { city: "paris", name: "Louvre and Palais Royal", lat: 48.8606, lng: 2.3376 },
  { city: "paris", name: "Le Marais", lat: 48.8596, lng: 2.3622 },
  { city: "paris", name: "Saint-Germain", lat: 48.854, lng: 2.333 },
  { city: "paris", name: "Latin Quarter", lat: 48.8499, lng: 2.3469 },
  { city: "paris", name: "Champ de Mars", lat: 48.8556, lng: 2.2986 },
  { city: "paris", name: "Montmartre", lat: 48.8867, lng: 2.3431 },
  { city: "tokyo", name: "Shinjuku", lat: 35.6938, lng: 139.7034 },
  { city: "tokyo", name: "Shibuya", lat: 35.6595, lng: 139.7004 },
  { city: "tokyo", name: "Ginza", lat: 35.6717, lng: 139.765 },
  { city: "tokyo", name: "Asakusa", lat: 35.7148, lng: 139.7967 },
  { city: "tokyo", name: "Tokyo Station", lat: 35.6812, lng: 139.7671 },
  { city: "london", name: "Westminster", lat: 51.4995, lng: -0.1248 },
  { city: "london", name: "South Bank", lat: 51.5055, lng: -0.115 },
  { city: "london", name: "Bloomsbury", lat: 51.5194, lng: -0.127 },
  { city: "london", name: "Greenwich", lat: 51.4826, lng: -0.0077 },
];

/** Exact-hotel ranking stays in the codebase. It is off unless this is explicitly enabled. */
export function hotelOptimizerEnabled(): boolean {
  const value = typeof process !== "undefined" ? process.env.ENABLE_HOTEL_OPTIMIZER : undefined;
  return value === "true" || value === "1" || value === "on";
}

function threshold(move: Trip["move"]): number {
  return move === "walk" ? 25 : 30;
}

function sightseeing(trip: Trip): DayPoint[] {
  const groups = new Map<number, TripStop[]>();
  for (const stop of trip.stops) {
    if (stop.day == null || stop.excluded || stop.category === "stay" || FOOD.has(stop.category) || stop.meal) continue;
    if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) continue;
    const list = groups.get(stop.day) ?? [];
    list.push(stop);
    groups.set(stop.day, list);
  }
  return [...groups.entries()].map(([day, list]) => ({
    day,
    lat: list.reduce((sum, stop) => sum + stop.lat, 0) / list.length,
    lng: list.reduce((sum, stop) => sum + stop.lng, 0) / list.length,
    names: list.map((stop) => stop.displayName || stop.name).filter(Boolean),
    localities: list.map((stop) => stop.locality || "").filter(Boolean),
    areas: list.map((stop) => stop.area || "").filter(Boolean),
  })).sort((a, b) => a.day - b.day);
}

function loadFor(lat: number, lng: number, days: DayPoint[], move: Trip["move"], child: boolean) {
  const limit = child ? Math.min(20, threshold(move)) : threshold(move);
  const perDay = days.map((day) => estimateMinutes(move, distanceMeters(lat, lng, day.lat, day.lng)));
  const average = perDay.length ? Math.round(perDay.reduce((sum, value) => sum + value, 0) / perDay.length) : 0;
  const longest = perDay.length ? Math.max(...perDay) : 0;
  return { perDay, average, longest, close: perDay.filter((value) => value <= limit).length, limit };
}

function acceptable(average: number, close: number, days: number): boolean {
  if (!days) return false;
  if (average >= 120) return false;
  if (close === 0 && average > 45) return false;
  return true;
}

function bestOverall(average: number, close: number, days: number): boolean {
  return days > 0 && close > 0 && close / days >= 0.5 && average <= 40 && average < 90;
}

function nightsLabel(days: number[]): string {
  const nights = [...new Set(days)].sort((a, b) => a - b).map((day) => day + 1);
  if (!nights.length) return "";
  if (nights.length === 1) return `Night ${nights[0]}`;
  const contiguous = nights.every((night, index) => index === 0 || night === (nights[index - 1] ?? 0) + 1);
  return contiguous ? `Night ${nights[0]}–${nights[nights.length - 1]}` : `Nights ${nights.join(", ")}`;
}

function namedLabel(lat: number, lng: number, destination: string, sample: DayPoint): string {
  const city = destination.toLowerCase();
  const label = LABELS
    .filter((item) => city.includes(item.city) && distanceMeters(lat, lng, item.lat, item.lng) < 4000)
    .sort((a, b) => distanceMeters(lat, lng, a.lat, a.lng) - distanceMeters(lat, lng, b.lat, b.lng))[0];
  if (label) return label.name;
  const locality = sample.localities.find((value) => value && value.toLowerCase() !== city && !city.includes(value.toLowerCase()));
  if (locality) return locality;
  const area = sample.areas.find((value) => value && value.toLowerCase() !== city && !city.includes(value.toLowerCase()));
  if (area) return area;
  const near = [...tripAreasNear(sample)].find(Boolean);
  return near || sample.names[0] ? `Near ${sample.names[0]}` : destination;
}

function tripAreasNear(sample: DayPoint): string[] {
  return sample.areas;
}

function clusterDays(days: DayPoint[], meters: number): DayPoint[][] {
  const groups: DayPoint[][] = [];
  for (const day of days) {
    const group = groups.find((items) => {
      const lat = items.reduce((sum, item) => sum + item.lat, 0) / items.length;
      const lng = items.reduce((sum, item) => sum + item.lng, 0) / items.length;
      return distanceMeters(lat, lng, day.lat, day.lng) <= meters;
    });
    if (group) group.push(day);
    else groups.push([day]);
  }
  return groups.sort((a, b) => (a[0]?.day ?? 0) - (b[0]?.day ?? 0));
}

function centroid(days: DayPoint[]): { lat: number; lng: number } {
  return {
    lat: days.reduce((sum, day) => sum + day.lat, 0) / days.length,
    lng: days.reduce((sum, day) => sum + day.lng, 0) / days.length,
  };
}

function cardFor(id: string, name: string, lat: number, lng: number, days: DayPoint[], all: DayPoint[], trip: Trip, role: StayRole): StayArea | null {
  const child = hasYoungChild(trip.childAges);
  const load = loadFor(lat, lng, all, trip.move, child);
  if (!acceptable(load.average, load.close, all.length)) return null;
  const changes = new Set(trip.bases.filter((base) => base.chosen).map((base) => base.hotelChanges)).values().next().value ?? 0;
  const why = [
    `${load.close} of ${all.length} sightseeing days start within about ${load.limit} min.`,
    `Estimated average first journey: about ${load.average} min.`,
    changes > 0 ? `${changes} hotel change${changes === 1 ? "" : "s"}.` : "One base. No hotel change.",
  ];
  if (child) why.push("Shorter first journeys, because this trip includes a young child.");
  const meals = trip.stops.some((stop) => stop.day != null && FOOD.has(stop.category) && distanceMeters(lat, lng, stop.lat, stop.lng) < 1500);
  if (meals) why.push("Meals already on these days sit in this area.");
  const far = load.longest > load.limit * 3;
  const tradeoff = far
    ? `The longest first journey is about ${load.longest} min. That day works better as a day trip than as a reason to move the base.`
    : load.average > 25
      ? `Some days start further out. Average first journey is about ${load.average} min.`
      : "";
  const qualified: StayRole = role === "Best overall base" && !bestOverall(load.average, load.close, all.length) ? "Closest area" : role;
  return {
    id,
    name,
    role: qualified,
    why: why.filter(Boolean).slice(0, 4),
    tradeoff,
    averageMin: load.average,
    longestMin: load.longest,
    closeDays: load.close,
    dayCount: all.length,
    nightsLabel: nightsLabel(days.map((day) => day.day)),
    lat,
    lng,
  };
}

export function recommendStayAreas(trip: Trip): StayArea[] {
  const days = sightseeing(trip);
  if (days.length < 1) return [];
  const span = days.reduce((max, day) => Math.max(max, ...days.map((other) => distanceMeters(day.lat, day.lng, other.lat, other.lng))), 0);
  const areaSpan = trip.areas.reduce((max, area) => Math.max(max, ...trip.areas.map((other) => distanceMeters(area.latitude, area.longitude, other.latitude, other.longitude))), 0);
  if (span > 80000 || areaSpan > 80000) {
    const stays = trip.stops.filter((stop) => stop.day != null && stop.category === "stay").sort((a, b) => (a.day ?? 0) - (b.day ?? 0));
    const nights = (stays.length ? stays : []).map((stay) => {
      const nearest = trip.areas
        .map((area) => ({ area, meters: distanceMeters(area.latitude, area.longitude, stay.lat, stay.lng) }))
        .sort((a, b) => a.meters - b.meters)[0];
      const pinned = nearest && nearest.meters < 40000 ? nearest.area : null;
      return {
        day: stay.day ?? 0,
        name: pinned?.name || stay.area || trip.destination,
        lat: pinned?.latitude ?? stay.lat,
        lng: pinned?.longitude ?? stay.lng,
      };
    });
    const groups: typeof nights[] = [];
    for (const night of nights) {
      const last = groups[groups.length - 1];
      if (last?.[0] && last[0].name === night.name) last.push(night);
      else groups.push([night]);
    }
    const changes = Math.max(0, groups.length - 1);
    const cards: StayArea[] = [];
    groups.slice(0, 3).forEach((group, index) => {
      const sample = group[0];
      if (!sample) return;
      const local = days.filter((day) => group.some((night) => night.day === day.day));
      const child = hasYoungChild(trip.childAges);
      const load = local.length ? loadFor(sample.lat, sample.lng, local, trip.move, child) : { average: 0, longest: 0, close: 0, limit: threshold(trip.move) };
      const label = nightsLabel(group.map((night) => night.day));
      cards.push({
        id: `overnight-${index}`,
        name: sample.name,
        role: "Overnight base",
        why: [
          label,
          local.length ? "The sightseeing on these nights stays in this area." : "Overnight stop. The sights for these nights were not loaded.",
          changes ? `${changes} hotel change${changes === 1 ? "" : "s"} on this trip. Each change costs a morning.` : "One base. No hotel change.",
        ],
        tradeoff: changes ? "Moving hotels is worth it only because the next nights are too far for a day trip." : "",
        averageMin: load.average,
        longestMin: load.longest,
        closeDays: load.close,
        dayCount: local.length || group.length,
        nightsLabel: label,
        lat: sample.lat,
        lng: sample.lng,
      });
    });
    return cards;
  }

  const seeds: { id: string; name: string; lat: number; lng: number; days: DayPoint[] }[] = [];
  const push = (seed: { id: string; name: string; lat: number; lng: number; days: DayPoint[] }) => {
    if (seeds.some((item) => item.name.toLowerCase() === seed.name.toLowerCase() || distanceMeters(item.lat, item.lng, seed.lat, seed.lng) < 1500)) return;
    seeds.push(seed);
  };
  for (const group of clusterDays(days, 6000)) {
    const centre = centroid(group);
    const sample = group[0];
    if (!sample) continue;
    push({ id: `cluster-${sample.day}`, name: namedLabel(centre.lat, centre.lng, trip.destination, sample), lat: centre.lat, lng: centre.lng, days: group });
  }
  const city = trip.destination.toLowerCase();
  for (const label of LABELS) {
    if (!city.includes(label.city)) continue;
    const covered = days.filter((day) => distanceMeters(label.lat, label.lng, day.lat, day.lng) < 2500);
    if (!covered.length) continue;
    push({ id: `label-${label.name}`, name: label.name, lat: label.lat, lng: label.lng, days: covered });
  }
  const ranked = seeds
    .map((seed) => ({ seed, card: cardFor(seed.id, seed.name, seed.lat, seed.lng, seed.days, days, trip, "Alternative") }))
    .filter((item): item is { seed: typeof seeds[number]; card: StayArea } => Boolean(item.card))
    .sort((a, b) => b.card.closeDays - a.card.closeDays || a.card.averageMin - b.card.averageMin || a.card.name.localeCompare(b.card.name));
  if (!ranked.length) return [];
  const [first, ...rest] = ranked;
  if (!first) return [];
  const best = { ...first.card, nightsLabel: "", role: bestOverall(first.card.averageMin, first.card.closeDays, first.card.dayCount) ? "Best overall base" as const : "Closest area" as const };
  const alternatives = rest
    .filter((item) => item.card.closeDays >= Math.ceil(days.length / 2) || item.card.averageMin + 8 < best.averageMin)
    .slice(0, 2)
    .map((item) => ({ ...item.card, nightsLabel: "", role: "Alternative" as const }));
  return [best, ...alternatives];
}

export function canonicalHotel(input: Partial<CanonicalHotel> | null | undefined): CanonicalHotel | null {
  if (!input?.name || input.name.trim().length < 2) return null;
  if (input.provider !== "osm" && input.provider !== "wikidata") return null;
  if (!input.providerId || !input.address?.trim()) return null;
  const lat = input.lat;
  const lng = input.lng;
  if (typeof lat !== "number" || typeof lng !== "number" || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return {
    name: input.name.trim().slice(0, 80),
    lat,
    lng,
    address: input.address.trim().slice(0, 160),
    provider: input.provider,
    providerId: input.providerId.slice(0, 80),
  };
}

export type HotelHit = {
  name: string;
  lat: number;
  lng: number;
  address: string;
  provider: "osm" | "wikidata";
  providerId: string;
};

/** Picks a geocoded property near the trip. A name with no coordinates is ignored. Lat and lng are never swapped. */
export function chooseHotelHit(hits: HotelHit[], near: { lat: number; lng: number }[], query: string): CanonicalHotel | null {
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 4);
  const ranked = hits
    .map((hit) => canonicalHotel(hit))
    .filter((hit): hit is CanonicalHotel => Boolean(hit))
    .map((hit) => {
      const meters = near.length ? Math.min(...near.map((point) => distanceMeters(hit.lat, hit.lng, point.lat, point.lng))) : 0;
      const named = words.length === 0 || words.some((word) => hit.name.toLowerCase().includes(word));
      return { hit, meters, named };
    })
    .filter((item) => item.named && item.meters <= 80000)
    .sort((a, b) => a.meters - b.meters);
  return ranked[0]?.hit ?? null;
}

export function matchBookedHotel(trip: Trip, query: string): CanonicalHotel | null {
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 3);
  if (!words.length) return null;
  const stays = trip.stops.filter((stop) => stop.category === "stay" && stop.provider !== "area" && Number.isFinite(stop.lat) && Number.isFinite(stop.lng));
  const hit = stays.find((stop) => {
    const name = `${stop.displayName || ""} ${stop.name} ${stop.address}`.toLowerCase();
    return words.every((word) => name.includes(word));
  });
  if (!hit || (hit.provider !== "osm" && hit.provider !== "wikidata")) return null;
  return canonicalHotel({
    name: hit.displayName || hit.name,
    lat: hit.lat,
    lng: hit.lng,
    address: hit.address || trip.destination,
    provider: hit.provider,
    providerId: hit.providerId || hit.id,
  });
}

export function stayNearPoints(trip: Trip): { lat: number; lng: number }[] {
  const days = sightseeing(trip);
  const points = [
    ...trip.areas.map((area) => ({ lat: area.latitude, lng: area.longitude })),
    ...days.map((day) => ({ lat: day.lat, lng: day.lng })),
  ];
  return points.filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng)).slice(0, 8);
}

/** Uses a resolved property as the base. Sightseeing stops stay on their days. */
export function applyBookedHotel(trip: Trip, hotel: Partial<CanonicalHotel> | null | undefined): Trip {
  const place = canonicalHotel(hotel);
  if (!place) return trip;
  const scheduled = trip.stops.filter((stop) => stop.category === "stay" && stop.day != null);
  if (!scheduled.length) return trip;
  const closest = [...scheduled].sort((a, b) => distanceMeters(a.lat, a.lng, place.lat, place.lng) - distanceMeters(b.lat, b.lng, place.lat, place.lng))[0];
  if (!closest || distanceMeters(closest.lat, closest.lng, place.lat, place.lng) > 80000) return trip;
  const targets = new Set(scheduled.filter((stop) => distanceMeters(stop.lat, stop.lng, place.lat, place.lng) <= 40000 || stop.id === closest.id).map((stop) => stop.id));
  const stops = trip.stops.map((stop) => {
    if (!targets.has(stop.id)) return stop;
    return {
      ...stop,
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      provider: place.provider,
      providerId: place.providerId,
      address: place.address,
      bookingStatus: "booked" as const,
      note: "Your hotel. The sights are unchanged.",
      displayName: place.name,
    };
  });
  let next: Trip = { ...trip, stops, hotelSelectionSource: "USER_BOOKED" };
  const days = new Set(stops.filter((stop) => targets.has(stop.id) && stop.day != null).map((stop) => stop.day as number));
  for (const day of days) next = retimeDay(next, day);
  return next;
}
