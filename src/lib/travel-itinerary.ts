import { distanceMeters } from "@/lib/coord";
import { readableName, cleanTheme } from "@/lib/travel-names";
import type { FoodPlanning } from "@/lib/travel";
import {
  appendStops,
  dayStops,
  durationPhrase,
  estimateMinutes,
  retimeDay,
  unscheduleStop,
  type FoodRole,
  type Trip,
  type TripStop,
} from "@/lib/travel-model";

const FOOD = new Set<TripStop["category"]>(["restaurant", "cafe", "market", "nightlife"]);

export type DayOutline = {
  index: number;
  title: string;
  headline: string;
  character: string;
  route: string;
  stops: number;
  minutes: number;
  minutesLabel: string;
  collapsed: string;
};

export type NearbyContext = {
  day: number;
  anchorId: string;
  anchorName: string;
  lat: number;
  lng: number;
  freeStart: number;
  freeEnd: number;
  remaining: number;
  nextName: string;
  nextLat: number;
  nextLng: number;
  hasNext: boolean;
};

export type NearbyBand = "pick" | "essential" | "fit" | "food" | "coffee" | "scenery" | "later";

export type NearbyOption = {
  stopId: string;
  band: NearbyBand;
  travelMinutes: number;
  visitMinutes: number;
  fits: boolean;
  whyNow: string;
};

function minutesOf(value: string | null | undefined): number {
  if (!value) return 12 * 60;
  const [hour, minute] = value.split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function themeLine(stops: TripStop[]): string {
  const bits: string[] = [];
  if (stops.some((stop) => stop.category === "museum" || stop.category === "historic" || stop.category === "landmark")) bits.push("Culture");
  if (stops.some((stop) => stop.category === "historic" || /temple|shrine|daibutsu|buddha/i.test(stop.name))) bits.push("Temples");
  if (stops.some((stop) => stop.category === "park" || stop.category === "garden" || stop.category === "beach" || stop.category === "viewpoint")) bits.push("Outdoors");
  if (stops.some((stop) => stop.category === "theme_park")) bits.push("Theme park");
  if (stops.some((stop) => stop.foodRole === "local-specialty")) bits.push("Local food");
  return [...new Set(bits)].slice(0, 3).join(" · ");
}

function commonLocality(stops: TripStop[]): string {
  const counts = new Map<string, number>();
  for (const stop of stops) {
    const name = (stop.locality || "").trim();
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

export function dayOutline(trip: Trip, day: number): DayOutline {
  const info = trip.days.find((item) => item.index === day);
  const rows = dayStops(trip, day);
  const stay = rows.find((stop) => stop.category === "stay");
  const body = rows.filter((stop) => stop.category !== "stay");
  const moving = trip.legs.filter((leg) => leg.day === day).reduce((sum, leg) => sum + (leg.minutes ?? 0), 0);
  const visiting = body.reduce((sum, stop) => sum + (stop.foodRole === "meal-window" ? 60 : stop.duration), 0);
  const minutes = moving + visiting;
  const origin = stay ?? rows[0];
  const far = origin ? body.filter((stop) => distanceMeters(origin.lat, origin.lng, stop.lat, stop.lng) >= 12000) : [];
  const locality = commonLocality(far.length ? far : body);
  const dayTrip = far.length > 0;
  const theme = cleanTheme(info?.theme || info?.intent || "", trip.destination);
  const headline = theme && theme !== "this area"
    ? theme
    : dayTrip ? (locality && !/[\u3040-\u30FF\u3400-\u9FFF]/.test(locality) ? `${locality} day trip` : "Day trip") : cleanTheme(locality || info?.area || trip.destination, trip.destination);
  const route = dayTrip ? `${stay?.area || trip.destination} ↔ ${locality || readableName(far[0] ?? body[0] ?? { name: headline })}` : "";
  const character = themeLine(body) || (dayTrip ? "Out of town" : "In town");
  const shape = dayTrip ? "Day trip" : body.length >= 4 ? "Full day" : "In town";
  const title = (info?.label || `Day ${day + 1}`).replace(/\s+/g, " ").trim();
  return {
    index: day,
    title,
    headline,
    character,
    route,
    stops: body.length,
    minutes,
    minutesLabel: `~${durationPhrase(Math.max(minutes, 0))}`,
    collapsed: [headline, `${body.length} stops`, route || shape].filter(Boolean).join(" · "),
  };
}

export function nearbyContext(trip: Trip, day: number, anchorId?: string): NearbyContext | null {
  const rows = dayStops(trip, day);
  if (!rows.length) return null;
  const anchor = (anchorId ? rows.find((stop) => stop.id === anchorId) : null)
    ?? [...rows].reverse().find((stop) => stop.category !== "stay")
    ?? rows[0];
  if (!anchor) return null;
  const later = rows.find((stop) => stop.id !== anchor.id && minutesOf(stop.startTime) >= minutesOf(anchor.endTime));
  const stay = rows.find((stop) => stop.category === "stay" && stop.id !== anchor.id);
  const next = later ?? stay ?? null;
  const freeStart = minutesOf(anchor.endTime ?? anchor.startTime);
  const freeEnd = later ? minutesOf(later.startTime) : Math.max(freeStart + 30, 18 * 60 + 30);
  const remaining = freeEnd - freeStart;
  if (remaining < 30) return null;
  const nextPoint = next ?? anchor;
  return {
    day,
    anchorId: anchor.id,
    anchorName: readableName(anchor),
    lat: anchor.lat,
    lng: anchor.lng,
    freeStart,
    freeEnd,
    remaining,
    nextName: next ? readableName(next) : "the end of the day",
    nextLat: nextPoint.lat,
    nextLng: nextPoint.lng,
    hasNext: Boolean(later),
  };
}

function bandFor(stop: TripStop, rank: number): NearbyBand {
  if (stop.category === "cafe") return "coffee";
  if (FOOD.has(stop.category)) return "food";
  if (stop.category === "park" || stop.category === "garden" || stop.category === "viewpoint" || stop.category === "beach") return "scenery";
  if (stop.importance === "iconic" || stop.importance === "major") return rank < 3 ? "pick" : "essential";
  return rank < 3 ? "pick" : "fit";
}

export function nearbyOptions(trip: Trip, context: NearbyContext): NearbyOption[] {
  const radius = context.remaining < 75 ? 1500 : context.remaining < 180 ? 4000 : 8000;
  const move = trip.move === "walk" ? "walk" : "drive";
  const foodPlan = trip.foodPlanning ?? "balanced";
  const rows: { stop: TripStop; travel: number; visit: number; detour: number }[] = [];
  for (const stop of trip.stops) {
    if (stop.day != null || stop.excluded || stop.category === "stay" || stop.provider === "area") continue;
    if (FOOD.has(stop.category) && foodPlan === "minimal" && stop.category === "cafe") continue;
    const travel = estimateMinutes(move, distanceMeters(context.lat, context.lng, stop.lat, stop.lng));
    const meters = distanceMeters(context.lat, context.lng, stop.lat, stop.lng);
    if (meters > radius) continue;
    const direct = distanceMeters(context.lat, context.lng, context.nextLat, context.nextLng);
    const via = meters + distanceMeters(stop.lat, stop.lng, context.nextLat, context.nextLng);
    const detour = context.hasNext ? via - direct : 0;
    if (context.hasNext && detour > 2500 && context.remaining < 180) continue;
    const visit = stop.duration || 60;
    const cost = travel + visit + (context.hasNext ? Math.min(travel, 20) : 0);
    if (cost > context.remaining + 20 && context.remaining < 180) continue;
    rows.push({ stop, travel, visit, detour });
  }
  rows.sort((a, b) => {
    const aFit = a.travel + a.visit <= context.remaining ? 0 : 1;
    const bFit = b.travel + b.visit <= context.remaining ? 0 : 1;
    if (aFit !== bFit) return aFit - bFit;
    const aInterest = trip.interests?.length && likedStop(a.stop, trip) ? 0 : 1;
    const bInterest = trip.interests?.length && likedStop(b.stop, trip) ? 0 : 1;
    if (aInterest !== bInterest) return aInterest - bInterest;
    return a.travel + a.detour - (b.travel + b.detour);
  });
  return rows.slice(0, 12).map((row, index) => {
    const fits = row.travel + row.visit <= context.remaining;
    const band = fits ? bandFor(row.stop, index) : "later";
    const whyNow = fits
      ? `${row.travel} min from ${context.anchorName}. Allow ${durationPhrase(row.visit)}. Fits before ${context.nextName}.`
      : `${row.travel} min away and about ${durationPhrase(row.visit)}. It needs more time than this gap.`;
    return { stopId: row.stop.id, band, travelMinutes: row.travel, visitMinutes: row.visit, fits, whyNow };
  }).filter((row) => row.fits || context.remaining >= 180);
}

function likedStop(stop: TripStop, trip: Trip): boolean {
  const interests = trip.interests ?? [];
  if (!interests.length) return false;
  const table: Record<string, TripStop["category"][]> = {
    food: ["restaurant", "cafe", "market", "nightlife"],
    nature: ["park", "garden", "viewpoint", "beach"],
    culture: ["museum", "historic", "landmark", "attraction"],
    beach: ["beach"],
    walks: ["park", "garden", "viewpoint"],
    shopping: ["shopping", "market"],
    night: ["nightlife"],
  };
  return interests.some((interest) => (table[interest] ?? []).includes(stop.category) || stop.groups?.includes(interest));
}

/** A small sequence for one free window. Other days stay as they are. */
export function fillFreeGap(trip: Trip, day: number): Trip {
  const context = nearbyContext(trip, day);
  if (!context || context.remaining < 150) return trip;
  const options = nearbyOptions(trip, context).filter((option) => option.fits);
  const food = options.find((option) => option.band === "food");
  const sights = options.filter((option) => option.band === "pick" || option.band === "essential" || option.band === "fit" || option.band === "scenery");
  const coffee = trip.pace === "full" || trip.foodPlanning === "minimal" ? undefined : options.find((option) => option.band === "coffee");
  const sequence = [food, sights[0], coffee, sights[1]].filter((option): option is NearbyOption => Boolean(option));
  const ids: string[] = [];
  let budget = context.remaining;
  for (const option of sequence) {
    if (ids.includes(option.stopId)) continue;
    if (option.travelMinutes + option.visitMinutes > budget) continue;
    budget -= option.travelMinutes + option.visitMinutes;
    ids.push(option.stopId);
  }
  if (!ids.length) return trip;
  const otherDays = trip.stops.filter((stop) => stop.day != null && stop.day !== day).map((stop) => `${stop.id}:${stop.day}`);
  const next = appendStops(trip, day, ids);
  const still = next.stops.filter((stop) => stop.day != null && stop.day !== day).map((stop) => `${stop.id}:${stop.day}`);
  if (still.join("|") !== otherDays.join("|")) return trip;
  return next;
}

export function keepStop(trip: Trip, stopId: string): Trip {
  return { ...trip, stops: trip.stops.map((stop) => stop.id === stopId ? { ...stop, kept: true } : stop) };
}

export function foodAlternatives(trip: Trip, stopId: string): TripStop[] {
  const stop = trip.stops.find((item) => item.id === stopId);
  if (!stop || stop.day == null || !FOOD.has(stop.category)) return [];
  const rows = dayStops(trip, stop.day);
  const index = rows.findIndex((item) => item.id === stopId);
  const anchor = rows[index - 1] ?? stop;
  return trip.stops.filter((item) => item.day == null && !item.excluded && item.category === stop.category && item.id !== stop.id && distanceMeters(anchor.lat, anchor.lng, item.lat, item.lng) < 3000).slice(0, 5);
}

export function swapFoodStop(trip: Trip, stopId: string): Trip {
  const stop = trip.stops.find((item) => item.id === stopId);
  if (!stop || stop.day == null || stop.kept || !FOOD.has(stop.category) || stop.provider === "area") return trip;
  const next = foodAlternatives(trip, stopId)[0];
  if (!next) return trip;
  const day = stop.day;
  const rows = dayStops(trip, day);
  const index = rows.findIndex((item) => item.id === stopId);
  const anchor = rows[index - 1] ?? stop;
  const minutes = estimateMinutes(trip.move === "walk" ? "walk" : "drive", distanceMeters(anchor.lat, anchor.lng, next.lat, next.lng));
  const why = `Convenient route-fit meal. About ${minutes} min from ${readableName(anchor)}.`;
  const role: FoodRole = "route-fit";
  const cleared = unscheduleStop(trip, stopId);
  const tagged = {
    ...cleared,
    stops: cleared.stops.map((item) => item.id === next.id ? { ...item, why, note: why, foodRole: role, meal: stop.meal ?? "lunch" } : item),
  };
  return appendStops(tagged, day, [next.id]);
}

export function applyFoodPlanning(trip: Trip, level: FoodPlanning): Trip {
  let next: Trip = { ...trip, foodPlanning: level };
  if (level === "minimal" || level === "meals") {
    for (const stop of [...next.stops]) {
      if (stop.day == null || stop.kept || stop.provider === "area") continue;
      if (stop.category === "cafe" || (level === "minimal" && FOOD.has(stop.category))) next = unscheduleStop(next, stop.id);
    }
  }
  if (level === "minimal") {
    for (const day of next.days) {
      const rows = dayStops(next, day.index);
      const sights = rows.filter((stop) => stop.category !== "stay");
      if (!sights.length || rows.some((stop) => stop.category === "restaurant" || stop.category === "cafe")) continue;
      const anchor = sights[0]!;
      const why = "A meal window in this area. Choose a restaurant when you are there.";
      const windowStop: TripStop = {
        id: `meal-lunch-d${day.index}`,
        provider: "area",
        providerId: "",
        name: `Lunch · ${anchor.locality || anchor.area || "this area"}`,
        category: "restaurant",
        address: anchor.area,
        lat: anchor.lat,
        lng: anchor.lng,
        day: day.index,
        startTime: "23:40",
        endTime: null,
        duration: 60,
        bookingStatus: "none",
        bucket: "scheduled",
        indoor: true,
        area: anchor.area,
        note: why,
        opening: "",
        why,
        foodRole: "meal-window",
        meal: "lunch",
      };
      next = retimeDay({ ...next, stops: [...next.stops, windowStop] }, day.index);
    }
  }
  if (level === "feature") {
    for (const day of next.days) {
      const rows = dayStops(next, day.index);
      if (rows.some((stop) => stop.category === "restaurant" || stop.category === "market")) continue;
      const anchor = rows.find((stop) => stop.category !== "stay") ?? rows[0];
      if (!anchor) continue;
      const pick = next.stops.find((stop) => stop.day == null && !stop.excluded && (stop.category === "restaurant" || stop.category === "market") && distanceMeters(anchor.lat, anchor.lng, stop.lat, stop.lng) < 4000);
      if (!pick) continue;
      const why = `A food place that fits this part of the route. About ${estimateMinutes("walk", distanceMeters(anchor.lat, anchor.lng, pick.lat, pick.lng))} min from ${readableName(anchor)}.`;
      next = {
        ...next,
        stops: next.stops.map((stop) => stop.id === pick.id ? { ...stop, why, note: why, foodRole: "local-specialty" as const, meal: "lunch" as const } : stop),
      };
      next = appendStops(next, day.index, [pick.id]);
    }
  }
  return next;
}
