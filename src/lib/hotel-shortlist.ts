/**
 * Hotel shortlist. Ranking uses the trip and verified hotel facts only.
 * It does not read affiliate commission, prices, or review text, and it does not call a model.
 * Unknown facts are not treated as a pass and are not a reason to drop a hotel.
 */

export type BudgetBand = "any" | "under-150" | "150-250" | "250-400" | "400-600" | "over-600";
export type QualityFloor = "any" | "3" | "4" | "5";
export type BurdenPreference = "minimise" | "balanced" | "loose";
export type RoomFloor = "any" | "20" | "25" | "30" | "35" | "40";
export type AcNeed = "any" | "ac" | "individual";
export type NoisePreference = "any" | "prefer" | "strong";
export type HotelPreset = "overall" | "location" | "quiet" | "value" | "family" | "luxury" | "minimum-travel";
export type HotelStyle = "any" | "luxury" | "boutique" | "business" | "family" | "value" | "traditional" | "modern";
export type LocationFocus = "itinerary" | "station" | "nightlife" | "quiet-area" | "airport" | "attraction";
export type BedPreference = "any" | "double" | "twin" | "king" | "family" | "connecting";

export type HotelPreferences = {
  preset: HotelPreset;
  budget: BudgetBand;
  currency: "SGD" | "USD" | "EUR" | "JPY";
  quality: QualityFloor;
  qualityMust: boolean;
  burden: BurdenPreference;
  room: RoomFloor;
  roomMust: boolean;
  ac: AcNeed;
  acMust: boolean;
  noise: NoisePreference;
  style: HotelStyle;
  location: LocationFocus;
  bed: BedPreference;
  breakfast: boolean;
  wheelchair: boolean;
  parking: boolean;
};

export type HotelMemory = {
  shown: string[];
  previous: string[];
  kept: string[];
  rejected: string[];
  reasons: Record<string, string>;
  similar: string;
};

export type HotelCandidate = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  stars: number | null;
  roomSqm: number | null;
  air: "yes" | "no" | "unknown";
  breakfast: "yes" | "no" | "unknown";
  wheelchair: "yes" | "no" | "unknown";
  parking: "yes" | "no" | "unknown";
  kind: string;
};

export type DayCluster = { day: number; lat: number; lng: number; count: number };

export type HotelMatch = { label: string; state: "met" | "unverified" };

export type HotelCard = {
  stopId: string;
  name: string;
  role: string;
  why: string;
  reasons: string[];
  tradeoffs: string[];
  matches: HotelMatch[];
  unverified: string[];
  location: string;
  averageMin: number;
  longestMin: number;
  closeDays: number;
  dayCount: number;
  booked: boolean;
};

export const DEFAULT_HOTEL_PREFERENCES: HotelPreferences = {
  preset: "overall",
  budget: "any",
  currency: "SGD",
  quality: "any",
  qualityMust: false,
  burden: "balanced",
  room: "any",
  roomMust: false,
  ac: "any",
  acMust: false,
  noise: "any",
  style: "any",
  location: "itinerary",
  bed: "any",
  breakfast: false,
  wheelchair: false,
  parking: false,
};

export function emptyHotelMemory(): HotelMemory {
  return { shown: [], previous: [], kept: [], rejected: [], reasons: {}, similar: "" };
}

export function presetPreferences(preset: HotelPreset, current: HotelPreferences = DEFAULT_HOTEL_PREFERENCES): HotelPreferences {
  const next: HotelPreferences = { ...current, preset };
  if (preset === "overall") return { ...next, burden: "balanced", style: "any", location: "itinerary" };
  if (preset === "location") return { ...next, burden: "minimise", location: "itinerary" };
  if (preset === "minimum-travel") return { ...next, burden: "minimise", location: "itinerary" };
  if (preset === "quiet") return { ...next, noise: "prefer", location: "quiet-area", burden: "balanced" };
  if (preset === "value") return { ...next, budget: current.budget === "any" ? "under-150" : current.budget, quality: "3", qualityMust: false, style: "value" };
  if (preset === "family") return { ...next, style: "family" };
  if (preset === "luxury") return { ...next, quality: "5", qualityMust: false, style: "luxury" };
  return next;
}

export function budgetText(prefs: HotelPreferences): string {
  const unit = prefs.currency === "EUR" ? "€" : prefs.currency === "JPY" ? "¥" : prefs.currency === "USD" ? "US$" : "S$";
  if (prefs.budget === "under-150") return `Under ${unit}150 / night`;
  if (prefs.budget === "150-250") return `${unit}150–250 / night`;
  if (prefs.budget === "250-400") return `${unit}250–400 / night`;
  if (prefs.budget === "400-600") return `${unit}400–600 / night`;
  if (prefs.budget === "over-600") return `${unit}600+ / night`;
  return "Any nightly budget";
}

function metersBetween(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const p1 = (aLat * Math.PI) / 180;
  const p2 = (bLat * Math.PI) / 180;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function minutesFor(meters: number, move: "walk" | "drive" | "transit"): number {
  if (meters < 80) return 1;
  return Math.max(1, Math.round(meters / (move === "walk" ? 75 : 450)));
}

export function dayClusters(stops: { day: number | null; category: string; lat: number; lng: number }[]): DayCluster[] {
  const groups = new Map<number, { lat: number; lng: number }[]>();
  for (const stop of stops) {
    if (stop.day == null || stop.category === "stay") continue;
    const list = groups.get(stop.day) ?? [];
    list.push({ lat: stop.lat, lng: stop.lng });
    groups.set(stop.day, list);
  }
  return [...groups.entries()].map(([day, list]) => ({
    day,
    lat: list.reduce((sum, item) => sum + item.lat, 0) / list.length,
    lng: list.reduce((sum, item) => sum + item.lng, 0) / list.length,
    count: list.length,
  })).sort((a, b) => a.day - b.day);
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] ?? 0 : Math.round(((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2);
}

function burden(hotel: HotelCandidate, clusters: DayCluster[], move: "walk" | "drive" | "transit"): { perDay: number[]; average: number; median: number; longest: number; close: number } {
  const perDay = clusters.map((cluster) => minutesFor(metersBetween(hotel.lat, hotel.lng, cluster.lat, cluster.lng), move));
  const average = perDay.length ? Math.round(perDay.reduce((sum, value) => sum + value, 0) / perDay.length) : 0;
  const longest = perDay.length ? Math.max(...perDay) : 0;
  return { perDay, average, median: median(perDay), longest, close: perDay.filter((value) => value <= 20).length };
}

function locationLine(days: number, close: number, average: number, longest: number, nightlife: boolean): string {
  const word = average <= 15 && longest <= 30 ? "Excellent" : average <= 25 ? "Good" : average <= 40 ? "Workable" : "Far";
  if (!days) return "No sightseeing days were set, so this is only the mapped hotel.";
  const subject = nightlife ? "planned evening stops" : "sightseeing days";
  return `${word} for this trip. ${close} of ${days} ${subject} start within about 20 min. Estimated average first leg: ${average} min. Longest: ${longest} min. Distance estimate, not a live route.`;
}

type Judgement = { excluded: boolean; matches: HotelMatch[]; unverified: string[]; score: number };

function judge(hotel: HotelCandidate, prefs: HotelPreferences, load: ReturnType<typeof burden>, memory: HotelMemory, liked: HotelCandidate | null, locationGap: string): Judgement {
  const matches: HotelMatch[] = [];
  const unverified: string[] = [];
  let excluded = false;
  const floor = prefs.quality === "any" ? 0 : Number(prefs.quality);
  if (floor) {
    if (hotel.stars == null) unverified.push(`${floor}★+`);
    else if (hotel.stars >= floor) matches.push({ label: `${floor}★+`, state: "met" });
    else if (prefs.qualityMust) excluded = true;
  }
  const room = prefs.room === "any" ? 0 : Number(prefs.room);
  if (room) {
    if (hotel.roomSqm == null) unverified.push(`${room} m²+ room`);
    else if (hotel.roomSqm >= room) matches.push({ label: `${room} m²+ room`, state: "met" });
    else if (prefs.roomMust) excluded = true;
  }
  if (prefs.ac === "individual") {
    unverified.push("Individual room control");
    if (hotel.air === "yes") matches.push({ label: "Hotel air conditioning", state: "met" });
    else if (hotel.air === "unknown") unverified.push("Hotel air conditioning");
  } else if (prefs.ac === "ac") {
    if (hotel.air === "yes") matches.push({ label: "Air conditioning", state: "met" });
    else if (hotel.air === "no" && prefs.acMust) excluded = true;
    else unverified.push("Air conditioning");
  }
  if (prefs.noise !== "any") unverified.push(prefs.noise === "strong" ? "Strongly quiet rooms" : "Quiet rooms");
  if (prefs.budget !== "any") unverified.push(budgetText(prefs));
  if (prefs.bed !== "any") unverified.push(`${prefs.bed} bed`);
  if (locationGap) unverified.push(locationGap);
  if (prefs.breakfast) {
    if (hotel.breakfast === "yes") matches.push({ label: "Breakfast", state: "met" });
    else if (hotel.breakfast === "no") excluded = true;
    else unverified.push("Breakfast");
  }
  if (prefs.wheelchair) {
    if (hotel.wheelchair === "yes") matches.push({ label: "Wheelchair access", state: "met" });
    else if (hotel.wheelchair === "no") excluded = true;
    else unverified.push("Wheelchair access");
  }
  if (prefs.parking) {
    if (hotel.parking === "yes") matches.push({ label: "Parking", state: "met" });
    else if (hotel.parking === "no") excluded = true;
    else unverified.push("Parking");
  }
  if (prefs.style === "luxury") {
    if (hotel.stars != null && hotel.stars >= 5) matches.push({ label: "Luxury, from a verified 5★", state: "met" });
    else unverified.push("Luxury style");
  } else if (prefs.style === "family") unverified.push("Family room layout");
  else if (prefs.style !== "any" && prefs.style !== "value") unverified.push(`${prefs.style} style`);
  const weight = prefs.burden === "minimise" ? 8 : prefs.burden === "loose" ? 1.5 : 4;
  let score = 1000 - load.average * weight - load.longest * 0.35 + load.close * 12;
  if (floor && hotel.stars != null && hotel.stars >= floor) score += 40 + (hotel.stars - floor) * 8;
  if (room && hotel.roomSqm != null && hotel.roomSqm >= room) score += 25;
  if (prefs.ac === "ac" && hotel.air === "yes") score += 15;
  if (prefs.style === "luxury" && hotel.stars != null && hotel.stars >= 5) score += 20;
  if (prefs.style === "value" && hotel.kind === "guest_house") score += 8;
  if (liked && liked.id !== hotel.id && metersBetween(hotel.lat, hotel.lng, liked.lat, liked.lng) < 900) score += 30;
  if (liked && liked.id !== hotel.id && liked.stars != null && hotel.stars != null && liked.stars === hotel.stars) score += 15;
  if (memory.reasons[hotel.id] === "too-far") score -= 200;
  if (memory.reasons[hotel.id] === "too-basic" && hotel.stars != null && hotel.stars <= 3) score -= 80;
  return { excluded, matches, unverified, score };
}

function adjusted(score: number, id: string, memory: HotelMemory): number {
  if (memory.kept.includes(id)) return score + 10000;
  if (memory.rejected.includes(id)) return score - 5000;
  if (memory.previous.includes(id)) return score - 800;
  if (memory.shown.includes(id)) return score - 400;
  return score;
}

type Judged = { hotel: HotelCandidate; load: ReturnType<typeof burden>; excluded: boolean; matches: HotelMatch[]; unverified: string[]; score: number };

function takeShortlist(ranked: Judged[], memory: HotelMemory, hold: string[]): Judged[] {
  const eligible = new Map(ranked.map((item) => [item.hotel.id, item]));
  const held = [...new Set(hold.filter((id) => eligible.has(id)))];
  const heldSet = new Set(held);
  const fillers = ranked.filter((item) => !heldSet.has(item.hotel.id));
  const previous = memory.previous.filter((id, index, all) => all.indexOf(id) === index).slice(0, 3);
  if (!previous.length) {
    const kept = ranked.filter((item) => memory.kept.includes(item.hotel.id));
    const rest = ranked.filter((item) => !memory.kept.includes(item.hotel.id));
    return [...kept, ...rest].slice(0, 3);
  }
  const slots: (Judged | null)[] = previous.map((id) => heldSet.has(id) ? eligible.get(id) ?? null : null);
  while (slots.length < 3) slots.push(null);
  for (const id of held) {
    if (slots.some((slot) => slot?.hotel.id === id)) continue;
    const empty = slots.findIndex((slot) => !slot);
    if (empty >= 0) slots[empty] = eligible.get(id) ?? null;
  }
  const placed: Judged[] = slots.filter((slot): slot is Judged => Boolean(slot));
  let cursor = 0;
  for (let index = 0; index < slots.length; index += 1) {
    if (slots[index]) continue;
    let pick: Judged | null = null;
    while (cursor < fillers.length) {
      const item = fillers[cursor];
      cursor += 1;
      if (!item) break;
      const crowded = placed.some((other) => metersBetween(item.hotel.lat, item.hotel.lng, other.hotel.lat, other.hotel.lng) < 150);
      if (crowded && cursor < fillers.length) continue;
      pick = item;
      break;
    }
    slots[index] = pick;
    if (pick) placed.push(pick);
  }
  return slots.filter((slot): slot is Judged => Boolean(slot)).slice(0, 3);
}

export function shortlistHotels(
  candidates: HotelCandidate[],
  stops: { day: number | null; category: string; lat: number; lng: number }[],
  prefs: HotelPreferences,
  memory: HotelMemory = emptyHotelMemory(),
  move: "walk" | "drive" | "transit" = "walk",
  hold: string[] = [],
): HotelCard[] {
  const unique: HotelCandidate[] = [];
  for (const hotel of candidates) {
    if (!hotel.name || !Number.isFinite(hotel.lat) || !Number.isFinite(hotel.lng)) continue;
    if (unique.some((item) => item.id === hotel.id || item.name.toLowerCase() === hotel.name.toLowerCase())) continue;
    unique.push(hotel);
  }
  const days = dayClusters(stops);
  const nightlife = prefs.location === "nightlife" ? dayClusters(stops.filter((stop) => stop.category === "nightlife")) : [];
  const clusters = nightlife.length ? nightlife : days;
  const locationGap = prefs.location === "station"
    ? "Near a major station"
    : prefs.location === "quiet-area"
      ? "Quiet neighbourhood"
      : prefs.location === "airport"
        ? "Near the airport"
        : prefs.location === "attraction"
          ? "Near one chosen attraction"
          : prefs.location === "nightlife" && !nightlife.length
            ? "Near nightlife"
            : "";
  const liked = unique.find((item) => item.id === memory.similar) ?? null;
  const judged = unique.map((hotel) => {
    const load = burden(hotel, clusters, move);
    const result = judge(hotel, prefs, load, memory, liked, locationGap);
    let score = result.score;
    for (const other of unique) {
      if (other.id === hotel.id) continue;
      const reason = memory.reasons[other.id];
      if (!reason) continue;
      const near = metersBetween(hotel.lat, hotel.lng, other.lat, other.lng) < 500;
      if ((reason === "too-far" || reason === "area" || reason === "too-noisy") && near) score -= 120;
      if (reason === "too-small" && hotel.roomSqm != null && other.roomSqm != null && hotel.roomSqm <= other.roomSqm) score -= 80;
      if (reason === "too-basic" && hotel.stars != null && other.stars != null && hotel.stars <= other.stars) score -= 80;
    }
    return { hotel, load, ...result, score };
  }).filter((item) => !item.excluded);
  const ranked = [...judged].sort((a, b) => {
    const exposure = (id: string) => memory.rejected.includes(id) ? 3 : memory.previous.includes(id) ? 2 : memory.shown.includes(id) ? 1 : 0;
    return exposure(a.hotel.id) - exposure(b.hotel.id) || adjusted(b.score, b.hotel.id, memory) - adjusted(a.score, a.hotel.id, memory) || a.hotel.name.localeCompare(b.hotel.name);
  });
  const chosen = takeShortlist(ranked, memory, hold.length ? hold : memory.kept);
  const topId = chosen[0]?.hotel.id ?? "";
  return chosen.map((item) => {
    const others = chosen.filter((other) => other.hotel.id !== item.hotel.id);
    const shorter = item.hotel.id !== topId && others.length > 0 && others.every((other) => item.load.average + 3 < other.load.average);
    const highestStars = item.hotel.stars != null && item.hotel.id !== topId && others.every((other) => (other.hotel.stars ?? -1) < (item.hotel.stars ?? -1));
    const reasons = [
      clusters.length ? `${item.load.close} of ${clusters.length} ${nightlife.length ? "evening stops" : "planned days"} are close` : "Mapped hotel. The days were not set.",
      shorter ? "Shorter estimated first leg than the other shortlisted hotels" : "",
      ...item.matches.map((match) => match.label),
    ].filter(Boolean).slice(0, 4);
    const longer = others.find((other) => other.load.average + 5 < item.load.average);
    const mustGap = item.unverified.filter((label) => (prefs.qualityMust && label.includes("★")) || (prefs.roomMust && label.includes("m²")) || (prefs.acMust && /control|conditioning/i.test(label)) || (prefs.breakfast && label === "Breakfast") || (prefs.wheelchair && label === "Wheelchair access"));
    const tradeoffs = [
      longer ? `Longer estimated first leg than ${longer.hotel.name}` : "",
      mustGap.length ? `We couldn't verify: ${mustGap.join(", ")}.` : "",
    ].filter(Boolean);
    const far = item.load.close === 0 || item.load.average >= 90 || item.load.longest >= 180;
    const role = memory.kept.includes(item.hotel.id)
      ? "Kept"
      : item.hotel.id === topId
        ? far
          ? "Far from these days"
          : "Best overall"
        : shorter
          ? "Lowest travel burden"
          : highestStars
            ? "Highest verified rating"
            : "Also fits this trip";
    return {
      stopId: item.hotel.id,
      name: item.hotel.name,
      role,
      why: reasons.join(". "),
      reasons,
      tradeoffs,
      matches: item.matches,
      unverified: item.unverified,
      location: locationLine(clusters.length, item.load.close, item.load.average, item.load.longest, nightlife.length > 0),
      averageMin: item.load.average,
      longestMin: item.load.longest,
      closeDays: item.load.close,
      dayCount: clusters.length,
      booked: false,
    };
  });
}

export function rememberShortlist(memory: HotelMemory, cards: { stopId: string }[]): HotelMemory {
  const ids = cards.map((card) => card.stopId);
  return {
    ...memory,
    previous: ids,
    shown: [...new Set([...memory.shown, ...ids])].slice(-40),
  };
}
