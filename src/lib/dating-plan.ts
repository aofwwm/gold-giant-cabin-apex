import type { DateFood, DatePlace, DateRole, DateType, DateVibe, DatingPlan, DatingStop } from "./dating.ts";

export type PlanBrief = {
  dateType: DateType;
  date: string;
  startMin: number;
  span: "quick" | "half" | "full";
  budget: number;
  freeOnly: boolean;
  setting: "indoor" | "outdoor" | "either" | "mix";
  vibes: DateVibe[];
  foods: DateFood[];
  pressure: "low" | "balanced" | "memorable";
  formality: "casual" | "smart" | "dress";
  crowd: "avoid" | "ok" | "lively";
  area: string;
  seen: string[];
  rejected: string[];
  spin: number;
};

export type StepLean = "talk" | "move" | "look" | "play" | "taste" | "sweet";

export type StepSpec = {
  role: DateRole;
  minutes: number;
  slot: string;
  food: boolean;
  lean: StepLean;
  /** Minutes after the requested start when this beat should begin. */
  targetOffset: number;
};

export type DateShape = {
  id: string;
  label: string;
  steps: StepSpec[];
};

export type RankContext = {
  origin: { lat: number; lng: number };
  here: { lat: number; lng: number };
  first: boolean;
  vibes: DateVibe[];
  dateType: DateType;
  pressure: "low" | "balanced" | "memorable";
  crowd: "avoid" | "ok" | "lively";
  formality: "casual" | "smart" | "dress";
  budget: number;
  seen: string[];
  usedCuisines: string[];
  usedNames: string[];
  seed: string;
  minute: number;
  date: string;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MAGNETS = ["lau pa sat", "maxwell", "newton food", "gardens by the bay", "din tai fung", "national gallery", "jumbo seafood", "marina bay sands"];

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function normalName(value: string): string {
  return value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}

/** True when the label is a district or a walk, not a bookable venue. */
export function looksLikeArea(name: string): boolean {
  const clean = name.trim();
  if (!clean) return false;
  if (/hawker|food centre|food center|food court|restaurant|cafe|café|mall|market|library|museum|hotel|bakery|bistro|kitchen|cinema|theatre|bowling|karaoke|arcade/i.test(clean)) return false;
  if (/park|garden|beach|reservoir|wetland/i.test(clean)) return false;
  return /\b(village|quay|waterfront|promenade|boardwalk|hill)\b/i.test(clean) || /\b(neighbourhood|neighborhood|district)\b/i.test(clean);
}

export function placeTitle(place: DatePlace): string {
  if (!looksLikeArea(place.name)) return place.name;
  const coastal = /changi village|beach|coast|waterfront|sea|jetty/i.test(`${place.name} ${place.cuisine} ${place.address} ${place.blurb}`);
  if (coastal && /village/i.test(place.name)) return `Explore ${place.name} + waterfront`;
  return `Explore ${place.name}`;
}

export function namesCollide(a: string, b: string): boolean {
  const left = normalName(a);
  const right = normalName(b);
  if (!left || !right) return false;
  if (left === right) return true;
  const shorter = left.length <= right.length ? left : right;
  const longer = left.length <= right.length ? right : left;
  return shorter.length >= 8 && longer.startsWith(`${shorter} `);
}

export function discoveryBucket(place: DatePlace): string {
  const blob = `${place.name} ${place.cuisine}`.toLowerCase();
  if (/workshop|cooking class|pottery|craft class/.test(blob)) return "workshop";
  if (/festival|pop-up|popup|performance/.test(blob)) return "live event";
  if (/cinema|theatre|theater|karaoke|arcade|bowling|entertainment/.test(blob)) return "entertainment";
  if (/mall|bookstore|bookshop|department store|books\b/.test(blob)) return "shopping";
  if (/museum|gallery|aquarium|attraction|exhibition/.test(blob)) return "attraction";
  if (/park|garden|beach|nature reserve|wetland|mangrove/.test(blob)) return "park";
  if (/dessert|ice cream|bakery|gelato|cake/.test(blob)) return "dessert";
  if (place.role === "scenic") return "scenic";
  if (place.role === "cafe") return "cafe";
  if (place.role === "meal") return "restaurant";
  if (place.role === "activity") return "activity";
  return "other";
}

function placeSpecificity(place: DatePlace): number {
  let score = 0;
  if (looksLikeArea(place.name)) score -= 4;
  if (/hawker|food centre|food center|library|museum|mall|park|beach|bowling|karaoke|cinema/i.test(place.name)) score += 2;
  if (place.source === "directory") score += 1;
  if (place.approxSgd > 0) score += 1;
  if (place.opening) score += 1;
  return score;
}

function sameDestination(a: DatePlace, b: DatePlace): boolean {
  if (a.id && a.id === b.id) return true;
  const meters = haversine(a, b);
  const left = normalName(a.name);
  const right = normalName(b.name);
  if (left && left === right && meters < 450) return true;
  const addressA = normalName(a.address);
  const addressB = normalName(b.address);
  if (left && left === right && addressA.length > 8 && addressA === addressB) return true;
  if (meters > 450) return false;
  return namesCollide(a.name, b.name);
}

/** One row per real destination. Provider id, then name + coordinates, then name + address, then a close alias. */
export function dedupePlaces(places: DatePlace[]): DatePlace[] {
  const byId = new Map<string, DatePlace>();
  for (const place of places) {
    if (!byId.has(place.id)) byId.set(place.id, place);
  }
  const kept: DatePlace[] = [];
  for (const place of byId.values()) {
    const index = kept.findIndex((other) => sameDestination(place, other));
    if (index < 0) {
      kept.push(place);
      continue;
    }
    const current = kept[index];
    if (!current) continue;
    const better = placeSpecificity(place) > placeSpecificity(current)
      || (placeSpecificity(place) === placeSpecificity(current) && place.name.length > current.name.length);
    if (better) kept[index] = place;
  }
  return kept;
}

function cuisineKey(place: DatePlace): string {
  return place.cuisine.split(/[;,]/)[0]?.trim().toLowerCase() ?? "";
}

function isMagnet(place: DatePlace): boolean {
  const name = place.name.toLowerCase();
  return MAGNETS.some((magnet) => name.includes(magnet));
}

function loud(place: DatePlace): boolean {
  return /karaoke|bowling|climb|escape|night safari|arcade|bouldering/i.test(`${place.name} ${place.cuisine}`);
}

function hawker(place: DatePlace): boolean {
  return /hawker|food centre|food center|food court|kopitiam|\bmarket\b/i.test(`${place.name} ${place.cuisine}`);
}

/** A room where two people can hear each other. Not a hawker hall. */
export function isConversational(place: DatePlace): boolean {
  if (hawker(place) || loud(place)) return false;
  const blob = `${place.name} ${place.cuisine}`;
  if (place.role === "cafe") return true;
  if (place.role === "meal" && /bistro|spanish|coffee|cafe|brew|taproom|grill|western|gelato|dessert|bar/i.test(blob)) return true;
  if (place.role === "meal" && place.vibes.some((vibe) => vibe === "cosy" || vibe === "quiet" || vibe === "romantic")) return true;
  if (place.role === "scenic" && place.vibes.includes("quiet")) return true;
  return false;
}

function quietPlace(place: DatePlace): boolean {
  return place.role === "scenic" || /museum|gallery|library|garden|park|reservoir/i.test(`${place.name} ${place.cuisine}`);
}

export function dayToken(dateISO: string): string | null {
  const [year, month, day] = dateISO.split("-").map(Number);
  if (!year || !month || !day) return null;
  return DAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()] ?? null;
}

function coversDay(spec: string, day: string): boolean {
  for (const part of spec.split(",").map((item) => item.trim())) {
    const range = /^([A-Za-z]{2})-([A-Za-z]{2})$/.exec(part);
    if (range) {
      const start = DAYS.indexOf(range[1] ?? "");
      const end = DAYS.indexOf(range[2] ?? "");
      const index = DAYS.indexOf(day);
      if (start < 0 || end < 0 || index < 0) continue;
      if (start <= end && index >= start && index <= end) return true;
      if (start > end && (index >= start || index <= end)) return true;
    } else if (part.slice(0, 2) === day) return true;
  }
  return false;
}

/** True only when the listed hours clearly miss this minute. Unknown hours stay open. */
export function likelyClosed(opening: string, dateISO: string, minute: number): boolean {
  const text = opening.trim();
  if (!text || /24\s*\/\s*7/i.test(text)) return false;
  const day = dayToken(dateISO);
  if (!day) return false;
  let sawDay = false;
  let openForDay = false;
  for (const rule of text.split(";").map((item) => item.trim()).filter(Boolean)) {
    const match = /^([A-Za-z]{2}(?:-[A-Za-z]{2})?(?:,[A-Za-z]{2}(?:-[A-Za-z]{2})?)*)\s+(.+)$/.exec(rule);
    if (!match) continue;
    sawDay = true;
    if (!coversDay(match[1] ?? "", day)) continue;
    openForDay = true;
    const hours = match[2] ?? "";
    if (/off|closed/i.test(hours)) return true;
    const span = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/.exec(hours);
    if (!span) return false;
    const open = Number(span[1]) * 60 + Number(span[2]);
    let close = Number(span[3]) * 60 + Number(span[4]);
    if (close <= open) close += 24 * 60;
    const at = minute < open ? minute + 24 * 60 : minute;
    if (at < open - 15 || at > close - 25) return true;
    return false;
  }
  return sawDay && !openForDay;
}

export type DurationRule = {
  min: number;
  target: number;
  max: number;
  minStops: number;
  maxStops: number;
};

/** Deterministic. The model does not decide whether "full day" means three hours or nine. */
export function durationRule(span: PlanBrief["span"]): DurationRule {
  if (span === "quick") return { min: 90, target: 120, max: 150, minStops: 1, maxStops: 2 };
  if (span === "half") return { min: 210, target: 255, max: 300, minStops: 2, maxStops: 4 };
  return { min: 420, target: 540, max: 690, minStops: 4, maxStops: 7 };
}

export function formatClock(minute: number): string {
  const clock = ((minute % 1440) + 1440) % 1440;
  const hour = Math.floor(clock / 60);
  const mins = clock % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelve = hour % 12 || 12;
  return `${twelve}:${String(mins).padStart(2, "0")} ${suffix}`;
}

/** Meal and break names follow the clock. 9:14 is never Lunch. 10:37 is never Dinner. */
export function clockSlot(minute: number, role: DateRole, lean: StepLean): string {
  const clock = ((minute % 1440) + 1440) % 1440;
  if (role === "cafe" || lean === "sweet") {
    if (clock < 14 * 60) return "Coffee";
    if (clock < 17 * 60 + 30) return "Afternoon tea";
    if (clock >= 21 * 60) return "Late dessert";
    return "Dessert";
  }
  if (role === "meal" || lean === "taste") {
    if (clock < 10 * 60 + 30) return "Breakfast";
    if (clock < 11 * 60 + 30) return "Brunch";
    if (clock < 14 * 60 + 30) return "Lunch";
    if (clock < 17 * 60 + 30) return "Afternoon bite";
    return clock < 21 * 60 + 30 ? "Dinner" : "Supper";
  }
  if (clock < 12 * 60) return "Morning";
  if (clock < 17 * 60) return "Afternoon";
  if (clock < 21 * 60) return "Evening";
  return "Late";
}

export function nextStart(anchor: number, previousEnd: number | null, travelMin: number, targetOffset: number): number {
  const earliest = (previousEnd ?? anchor) + Math.max(0, travelMin);
  const target = anchor + Math.max(0, targetOffset);
  return Math.max(anchor, earliest, target);
}

export function assessSpan(
  span: PlanBrief["span"],
  anchor: number,
  stops: { startMin: number; endMin: number; kind: string }[],
): { partial: boolean; line: string } {
  if (!stops.length) return { partial: true, line: "Only a partial plan could be verified." };
  const rule = durationRule(span);
  const end = stops[stops.length - 1]?.endMin ?? anchor;
  const horizon = end - anchor;
  const ordered = stops.every((stop, index) => index === 0 || stop.startMin >= (stops[index - 1]?.endMin ?? 0));
  if (!ordered) return { partial: true, line: "Only a partial plan could be verified." };
  if (span === "quick" && (stops.length > rule.maxStops || horizon > rule.max + 20)) {
    return { partial: true, line: "Only a partial plan could be verified." };
  }
  if (span === "half" && (horizon < rule.min - 20 || horizon > rule.max + 25)) {
    return { partial: true, line: "Only a partial plan could be verified." };
  }
  if (span === "full") {
    const lateStart = anchor >= 15 * 60;
    const midday = stops.some((stop) => stop.kind === "meal" && stop.startMin >= 11 * 60 + 30 && stop.startMin < 16 * 60);
    const reachesEvening = stops.some((stop) => stop.endMin >= 17 * 60 + 30);
    const longEnough = horizon >= rule.min;
    const enoughStops = stops.length >= (lateStart ? 3 : rule.minStops);
    const mealsOk = anchor >= 12 * 60 || midday;
    if (!longEnough || !enoughStops || !reachesEvening || !mealsOk) {
      return { partial: true, line: "Only a partial plan could be verified." };
    }
  }
  return { partial: false, line: "" };
}

function beat(role: DateRole, minutes: number, lean: StepLean, food: boolean, offset: number): StepSpec {
  return { role, minutes, lean, food, slot: "Pending", targetOffset: Math.max(0, offset) };
}

export function activityLean(brief: PlanBrief): Exclude<StepLean, "talk" | "taste" | "sweet"> {
  if (brief.foods.includes("museum") || brief.vibes.includes("artsy")) return "look";
  if (brief.foods.some((food) => food === "workshop" || food === "games" || food === "karaoke")) return "play";
  if (brief.foods.some((food) => food === "walk" || food === "view" || food === "nature" || food === "picnic") || brief.vibes.includes("scenic") || brief.setting === "outdoor") return "move";
  if (brief.vibes.some((vibe) => vibe === "fun" || vibe === "playful" || vibe === "active")) return "play";
  if (brief.setting === "indoor" || brief.dateType === "parents") return "look";
  if (brief.dateType === "first") return brief.spin % 2 === 0 ? "move" : "look";
  return (["move", "look", "play"] as const)[Math.abs(brief.spin) % 3] ?? "move";
}

function roleFor(lean: Exclude<StepLean, "talk" | "taste" | "sweet">): DateRole {
  return lean === "move" ? "scenic" : "activity";
}

function otherLean(lean: Exclude<StepLean, "talk" | "taste" | "sweet">, spin: number): Exclude<StepLean, "talk" | "taste" | "sweet"> {
  const order: Exclude<StepLean, "talk" | "taste" | "sweet">[] = lean === "move" ? ["look", "play"] : lean === "look" ? ["play", "move"] : ["move", "look"];
  return order[Math.abs(spin) % 2] ?? "look";
}

function fullMorning(brief: PlanBrief, swap: boolean): DateShape {
  const start = brief.startMin;
  const primary = activityLean(brief);
  const second = otherLean(primary, brief.spin + (swap ? 1 : 0));
  const third = otherLean(second, brief.spin + 2);
  const firstLean = swap ? second : primary;
  const midLean = swap ? primary : second;
  return {
    id: swap ? "whole-day-swap" : "whole-day",
    label: "The whole day",
    steps: [
      beat(roleFor(firstLean), 80, firstLean, false, 0),
      beat("cafe", 40, "sweet", true, 95),
      beat("meal", 75, "taste", true, Math.max(180, 12 * 60 + 15 - start)),
      beat(roleFor(midLean), 100, midLean, false, Math.max(270, 13 * 60 + 45 - start)),
      beat("cafe", 40, "sweet", true, Math.max(390, 15 * 60 + 30 - start)),
      beat(roleFor(third), 60, third, false, Math.max(450, 16 * 60 + 40 - start)),
      beat("meal", 90, "taste", true, Math.max(520, 18 * 60 - start)),
    ],
  };
}

function fullForward(brief: PlanBrief): DateShape {
  const start = brief.startMin;
  const lean = activityLean(brief);
  const second = otherLean(lean, brief.spin);
  const cap = Math.max(120, 23 * 60 + 15 - start);
  const horizon = Math.min(540, cap);
  const dinnerClock = start >= 17 * 60 + 30 ? start + Math.round(horizon * 0.35) : Math.max(start + 180, 17 * 60 + 30);
  const dinnerOffset = Math.min(Math.max(90, horizon - 90), Math.max(90, dinnerClock - start));
  const drafted = [
    beat(roleFor(lean), 75, lean, false, 0),
    beat("cafe", 35, "sweet", true, Math.min(Math.max(40, dinnerOffset - 50), Math.round(horizon * 0.22))),
    beat("meal", 80, "taste", true, dinnerOffset),
    beat(roleFor(second), 70, second, false, Math.min(horizon - 80, dinnerOffset + 100)),
    beat("cafe", 40, "sweet", true, Math.min(horizon - 40, Math.max(dinnerOffset + 180, horizon - 50))),
  ];
  const steps: StepSpec[] = [];
  for (const step of drafted) {
    if (step.targetOffset + step.minutes > cap + 20) continue;
    const prev = steps[steps.length - 1];
    if (prev && step.targetOffset < prev.targetOffset + 30) continue;
    steps.push(step);
  }
  return { id: "whole-day-forward", label: "The long stretch", steps: steps.length ? steps : drafted.slice(0, 3) };
}

function halfMorning(brief: PlanBrief, swap: boolean): DateShape {
  const start = brief.startMin;
  const lean = activityLean(brief);
  const lunchClock = 12 * 60;
  const lunchAt = Math.min(220, Math.max(150, lunchClock - start));
  const steps = swap
    ? [
        beat("cafe", 40, "sweet", true, 0),
        beat(roleFor(lean), 80, lean, false, 55),
        beat("meal", 80, "taste", true, lunchAt),
      ]
    : [
        beat(roleFor(lean), 90, lean, false, 0),
        beat("cafe", 40, "sweet", true, 110),
        beat("meal", 80, "taste", true, lunchAt),
      ];
  return { id: swap ? "half-morning-swap" : "half-morning", label: "Until lunch", steps };
}

function halfAfternoon(brief: PlanBrief, swap: boolean): DateShape {
  const start = brief.startMin;
  const lean = activityLean(brief);
  const dinnerAt = Math.max(190, 17 * 60 + 30 - start);
  const steps = swap
    ? [
        beat("meal", 75, "taste", true, 0),
        beat(roleFor(lean), 70, lean, false, 100),
        beat("cafe", 40, "sweet", true, Math.min(dinnerAt, 230)),
      ]
    : [
        beat(roleFor(lean), 80, lean, false, 0),
        beat("cafe", 40, "sweet", true, 100),
        beat("meal", 80, "taste", true, dinnerAt),
      ];
  return { id: swap ? "half-afternoon-swap" : "half-afternoon", label: "The afternoon", steps };
}

function halfEvening(brief: PlanBrief, variant: number): DateShape {
  const lean = activityLean(brief);
  if (variant === 1) {
    return {
      id: "half-table-then-air",
      label: "The table, then air",
      steps: [
        beat("meal", 90, "taste", true, 0),
        beat(roleFor(lean), 60, lean, false, 110),
        beat("cafe", 40, "sweet", true, 190),
      ],
    };
  }
  if (variant === 2) {
    return {
      id: "half-hands",
      label: "Do one thing, then eat",
      steps: [
        beat(roleFor(lean), 80, lean, false, 0),
        beat("meal", 95, "taste", true, 110),
      ],
    };
  }
  return {
    id: "half-evening",
    label: "The evening",
    steps: [
      beat(roleFor(lean), 70, lean, false, 0),
      beat("meal", 90, "taste", true, 100),
      beat("cafe", 40, "sweet", true, 210),
    ],
  };
}

function foodOnly(brief: PlanBrief): DateShape {
  const meal: DateRole = brief.foods.includes("cafe") && !brief.foods.includes("dinner") ? "cafe" : "meal";
  const sweet = brief.foods.some((food) => food === "dessert" || food === "cafe" || food === "drinks");
  const steps = [beat(meal, 80, meal === "cafe" ? "sweet" : "taste", true, 0)];
  if (sweet && meal !== "cafe") steps.push(beat("cafe", 40, "sweet", true, 95));
  return {
    id: steps.length > 1 ? "table-and-sweet" : "one-sitting",
    label: steps.length > 1 ? "The meal, then something sweet" : "One sitting",
    steps,
  };
}

export function shapesFor(brief: PlanBrief): DateShape[] {
  if (brief.span === "quick") return [foodOnly(brief)];
  if (brief.span === "full") {
    if (brief.startMin < 12 * 60) return [fullMorning(brief, false), fullMorning(brief, true)];
    return [fullForward(brief), fullMorning(brief, false)];
  }
  if (brief.startMin >= 17 * 60) return [halfEvening(brief, 0), halfEvening(brief, 1), halfEvening(brief, 2)];
  if (brief.startMin >= 14 * 60) return [halfAfternoon(brief, false), halfAfternoon(brief, true)];
  return [halfMorning(brief, false), halfMorning(brief, true)];
}

export function pickShape(brief: PlanBrief): DateShape {
  const shapes = shapesFor(brief);
  const index = hashString([brief.date, brief.dateType, brief.span, String(brief.startMin), brief.foods.join(","), brief.vibes.join(","), String(brief.spin)].join("|")) % shapes.length;
  return shapes[index] ?? shapes[0]!;
}

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const radius = 6371000;
  const p1 = (a.lat * Math.PI) / 180;
  const p2 = (b.lat * Math.PI) / 180;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.min(1, Math.sqrt(h)));
}

function rejected(place: DatePlace, list: string[]): boolean {
  const name = normalName(place.name);
  return list.some((item) => item === place.id || normalName(item) === name || namesCollide(item, place.name));
}

function seenPenalty(place: DatePlace, seen: string[]): number {
  const name = normalName(place.name);
  const index = seen.findIndex((item) => item === place.id || normalName(item) === name);
  if (index < 0) return 0;
  if (index < 3) return 46;
  if (index < 8) return 30;
  return 16;
}

function distanceScore(meters: number, first: boolean, role: DateRole): number {
  if (first) {
    if (meters < 350 && (role === "meal" || role === "cafe")) return -16;
    if (meters < 1600) return 22;
    if (meters < 4000) return 16;
    if (meters < 7000) return 6;
    return -10 - Math.min(28, Math.round((meters - 7000) / 350));
  }
  if (meters < 250) return 4;
  if (meters < 1800) return 24;
  if (meters < 3200) return 12;
  return -16 - Math.min(20, Math.round((meters - 3200) / 400));
}

export function scorePlace(place: DatePlace, step: StepSpec, ctx: RankContext): number {
  const fromHere = haversine(ctx.here, place);
  const fromOrigin = haversine(ctx.origin, place);
  let score = distanceScore(ctx.first ? fromOrigin : fromHere, ctx.first, place.role);
  if (!ctx.first && fromOrigin > 9000) score -= 18;
  score += place.vibes.filter((vibe) => ctx.vibes.includes(vibe)).length * 6;
  score -= seenPenalty(place, ctx.seen);
  if (isMagnet(place) && fromOrigin > 4500) score -= 30;
  else if (isMagnet(place) && fromOrigin > 1200) score -= 8;
  const cuisine = cuisineKey(place);
  if (cuisine && ctx.usedCuisines.includes(cuisine)) score -= 32;
  if (ctx.usedNames.includes(normalName(place.name))) score -= 40;
  if (hawker(place) && ctx.budget >= 120 && ctx.formality !== "casual") score -= 14;
  if (hawker(place) && ctx.budget <= 50) score += 12;
  if (place.approxSgd >= 40 && ctx.budget < 100) score -= 22;
  if (place.approxSgd > 0 && place.approxSgd * 2 <= ctx.budget) score += 4;
  if (ctx.dateType === "first" && ctx.pressure !== "memorable" && loud(place)) score -= 28;
  if (ctx.dateType === "first" && (place.role === "meal" || place.role === "cafe" || quietPlace(place))) score += 6;
  if (ctx.dateType === "parents" && (loud(place) || place.alcohol)) score -= 34;
  if (ctx.dateType === "parents" && place.setting === "indoor" && place.role === "meal") score += 10;
  if ((ctx.dateType === "anniversary" || ctx.formality === "dress") && place.approxSgd >= 35) score += 12;
  if (ctx.dateType === "anniversary" && hawker(place) && ctx.budget >= 100) score -= 10;
  if (ctx.dateType === "surprise" && !isMagnet(place)) score += 5;
  if (ctx.dateType === "married" && !hawker(place) && place.role === "meal") score += 4;
  if (ctx.vibes.includes("quiet") && loud(place)) score -= 16;
  const quietTalk = ctx.vibes.includes("quiet") && (ctx.vibes.includes("cosy") || ctx.crowd === "avoid");
  if (quietTalk && hawker(place)) score -= 58;
  if (quietTalk && loud(place)) score -= 20;
  if (quietTalk && isConversational(place)) score += 18;
  if (ctx.crowd === "avoid" && hawker(place)) score -= 12;
  if (ctx.crowd === "lively" && hawker(place)) score += 6;
  if (step.lean === "move" && place.role === "scenic") score += 16;
  if (step.lean === "look" && /museum|gallery|art|library|culture|aquarium/i.test(`${place.name} ${place.cuisine}`)) score += 16;
  if (step.lean === "play" && /bowl|climb|escape|game|karaoke|cook|pottery|science|bouldering/i.test(`${place.name} ${place.cuisine}`)) score += 16;
  if (step.lean === "talk" && place.setting === "indoor" && !hawker(place)) score += 10;
  if (step.lean === "sweet" && /cafe|dessert|ice|bakery|gelato|kopi|coffee/i.test(`${place.name} ${place.cuisine}`)) score += 8;
  if ((step.lean === "taste" || step.food) && place.role === "meal" && !hawker(place) && ctx.formality !== "casual") score += 6;
  if (place.source === "directory" && place.blurb.length > 40) score += 3;
  score += hashString(`${ctx.seed}|${place.id}`) % 11;
  return score;
}

function fits(place: DatePlace, step: StepSpec): boolean {
  if (place.role === step.role) return true;
  if (step.food) return false;
  if (step.lean === "move" && place.role === "scenic") return true;
  if (step.lean === "look" && (place.role === "activity" || place.role === "scenic")) return true;
  if (step.lean === "play" && place.role === "activity") return true;
  if (place.role === "scenic" || place.role === "activity") return place.role !== step.role;
  return false;
}

export function rankPlaces(places: DatePlace[], step: StepSpec, ctx: RankContext, rejectedIds: string[]): DatePlace[] {
  const eligible = places.filter((place) => {
    if (rejected(place, rejectedIds)) return false;
    if (likelyClosed(place.opening, ctx.date, ctx.minute)) return false;
    return fits(place, step);
  });
  const primary = eligible.filter((place) => place.role === step.role);
  const extra = eligible.filter((place) => place.role !== step.role);
  const list = !step.food && primary.length < 3 ? [...primary, ...extra] : primary.length ? primary : extra;
  return list
    .map((place) => ({ place, score: scorePlace(place, step, ctx) }))
    .sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name))
    .map((item) => item.place);
}

function pickLine(lines: string[], seed: string): string {
  return lines[hashString(seed) % lines.length] ?? lines[0] ?? "";
}

export function doThis(place: DatePlace, step: StepSpec, dateType: DateType): string {
  const name = place.name;
  const seed = `${name}|${step.slot}|${dateType}|${step.lean}`;
  if (looksLikeArea(name)) {
    return `${placeTitle(place)} is the neighbourhood, not a restaurant. Walk a short stretch. Leave when the conversation has had some air.`;
  }
  if (step.lean === "sweet" || step.role === "cafe") {
    if (step.slot === "Coffee" || step.slot === "Afternoon tea") {
      return pickLine([
        `A drink and a short pause at ${name}. Then you keep going.`,
        `${name} is the break, not the destination. One thing to share, then the next part of the day.`,
      ], seed);
    }
    return pickLine([
      `One sweet thing and a drink at ${name}. This closes the date. It is not a second dinner.`,
      `${name} is the soft landing. Share one thing. If you are both done talking, you are allowed to go home.`,
    ], seed);
  }
  if (step.lean === "taste" || (step.food && step.role === "meal")) {
    if (dateType === "first") {
      return pickLine([
        `Sit at ${name} and share the meal. Two hours is a full date. You do not owe anyone a second venue.`,
        `${name} is the conversation. Stay for the sitting. If it goes quiet, that is information, not a reason to add karaoke.`,
      ], seed);
    }
    if (dateType === "parents") {
      return `A real table at ${name}. Order as if you mean to feed them well, then let the meal take its time.`;
    }
    if (hawker(place)) {
      return `Share three different plates at ${name}. Not two of the same thing. Leave while you still want the next stop.`;
    }
    return pickLine([
      `Take a full sitting at ${name}. Share at least one dish. This is the part you cannot rush without ruining the point.`,
      `Order at ${name} as if the meal is the plan, because it is. Phones down once the food arrives.`,
    ], seed);
  }
  if (step.lean === "move" || place.role === "scenic" || /esplanade|quay|boardwalk|concourse/i.test(place.name)) {
    return pickLine([
      `Walk ${name} without turning it into a photo job. One loop, side by side, then you go eat.`,
      `Use ${name} for the part where nobody has to hold eye contact. The path does the work. Talk if you want.`,
    ], seed);
  }
  if (step.lean === "look") {
    return pickLine([
      `One room at ${name}, not the whole building. Leave while you still want dinner.`,
      `At ${name}, pick a single thing to actually look at. The date is what you say about it afterwards.`,
    ], seed);
  }
  if (step.lean === "play") {
    return pickLine([
      `One round at ${name}. Stop while you are still glad you came. Winning is not the evening.`,
      `${name} gives your hands something to do, so the talking is allowed to be uneven.`,
    ], seed);
  }
  return `Spend the time at ${name}, then move on while you still like the idea.`;
}

function lengthLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours <= 0) return `${rest} min`;
  if (!rest) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${hours} hr${hours > 1 ? "s" : ""} ${rest} min`;
}

export function landedShape(stops: { kind: string }[], intended: DateShape): DateShape {
  if (intended.id.startsWith("whole-day") || intended.id.startsWith("half-")) return intended;
  const doing = stops.some((stop) => stop.kind === "scenic" || stop.kind === "activity");
  const meals = stops.filter((stop) => stop.kind === "meal" || stop.kind === "cafe").length;
  const lead = stops[0]?.kind;
  if (doing && meals && (lead === "scenic" || lead === "activity")) {
    if (lead === "activity" && /walk/i.test(intended.label)) return { ...intended, id: "one-room-then-eat", label: "One room, then supper" };
    return intended;
  }
  if (doing && meals) return { ...intended, id: "table-then-air", label: "The table, then air" };
  if (!doing && meals > 1) return { ...intended, id: "table-and-sweet", label: "The meal, then something sweet" };
  if (!doing && meals === 1) return { ...intended, id: "one-sitting", label: "One sitting" };
  return intended;
}

export function narrateDate(input: {
  brief: PlanBrief;
  shape: DateShape;
  stops: DatingStop[];
  backupTitle: string | null;
  thin: boolean;
}): DatingPlan {
  const { brief, shape, stops } = input;
  const first = stops[0];
  const second = stops[1];
  const third = stops[2];
  const outdoor = stops.filter((stop) => stop.setting === "outdoor");
  const spanMin = first && stops.length ? (stops[stops.length - 1]?.endMin ?? first.endMin) - brief.startMin : 0;
  const moves = Math.max(0, stops.length - 1);
  const moveLine = moves === 0 ? "You stay in one place." : moves === 1 ? "One move between the two stops." : `${moves} moves.`;
  const verdict = assessSpan(brief.span, brief.startMin, stops);
  const lunch = stops.find((stop) => stop.slot === "Lunch" || stop.slot === "Breakfast" || stop.slot === "Brunch");
  const dinner = stops.find((stop) => stop.slot === "Dinner" || stop.slot === "Supper");
  let thesis = first ? `${first.title}. Stay for it. Do not turn a good table into a crawl.` : "I could not build a full evening from places that fit.";
  if (brief.span === "full" && first && lunch && dinner && lunch.title !== dinner.title) {
    thesis = `Leave at ${formatClock(brief.startMin)}. ${first.title} opens it, ${lunch.title} is the middle, and ${dinner.title} is how the day ends.`;
  } else if (brief.span === "full" && first) {
    thesis = verdict.partial
      ? `${first.title} is as far as the day could be verified. It is not a full day yet.`
      : `${first.title} opens the day. Meals follow the clock, and the hours between them are for doing something.`;
  } else if (verdict.partial && first && brief.span !== "quick") {
    thesis = `${first.title} has to carry more of this than it should. Only a partial plan could be verified.`;
  } else if (brief.dateType === "first" && first && second && (first.kind === "scenic" || first.kind === "activity")) thesis = `${first.title} is something you do side by side. ${second.title} is where you sit and talk. Either of you can end it after the meal.`;
  else if (brief.dateType === "first" && first && second) thesis = `${first.title} is the meal. ${second.title} only if you are still glad to be sitting there.`;
  else if (brief.dateType === "first" && first) thesis = `${first.title} is the whole date. One sitting, somewhere you can hear each other, and an easy goodnight.`;
  else if (brief.dateType === "anniversary" && first && second) thesis = `${first.title}, then ${second.title}. The sequence is the occasion. You are not collecting venues.`;
  else if (brief.dateType === "parents" && first && second) thesis = `${first.title}, then a seated dinner at ${second.title}. Nothing that needs shouting, and nothing that ends at midnight.`;
  else if (brief.dateType === "parents" && first) thesis = `${first.title} is a proper sit-down. Eat well, talk, and be home before the night gets loud.`;
  else if (brief.dateType === "surprise" && first && second) thesis = `Tell them to meet you at ${first.title}. ${second.title} is the turn — keep that to yourself until you are already walking there.`;
  else if (brief.dateType === "married" && first && second) thesis = `You leave the house for ${first.title}, then ${second.title}. Not a performance. Just not the sofa.`;
  else if (brief.dateType === "casual" && first && second) thesis = `${first.title}, then ${second.title}. Neighbourhood scale. Nobody has to be impressive.`;
  else if (first && second && third) thesis = `${first.title}, then ${second.title}, then ${third.title} only if you are still glad to be out.`;
  else if (first && second) thesis = `${first.title}, then ${second.title}. That is the date: one thing you do, one place you eat.`;

  const dress = brief.formality === "dress"
    ? outdoor.length ? "Dress for the table. Shoes that can still walk." : "Dress up. This is not a sandals evening."
    : brief.formality === "casual"
      ? outdoor.length ? "Casual, and something you can walk in." : "Come as you are. Clean is enough."
      : brief.dateType === "first"
        ? "Smart casual. One notch above an errand, well short of a wedding."
        : outdoor.length ? "Smart casual, with shoes that survive a walk." : "Smart casual. You look like you decided.";

  const rain = !outdoor.length || brief.setting === "indoor"
    ? "The whole plan is indoors. The forecast can mind itself."
    : input.backupTitle
      ? `If it rains, drop ${outdoor[0]?.title ?? "the outdoor stop"} and use ${input.backupTitle} instead. The meal stays.`
      : outdoor.length === stops.length
        ? "This one lives outside. If the sky turns, eat earlier and skip the walk."
        : `If it rains, skip ${outdoor.map((stop) => stop.title).join(" and ")} and stay longer at the indoor stop.`;

  const endClock = stops[stops.length - 1]?.endMin;
  return {
    title: shape.label,
    thesis,
    arc: stops.map((stop) => `${stop.slot} · ${stop.title}`).join(" → "),
    dress,
    pacing: endClock
      ? `${formatClock(brief.startMin)}–${formatClock(endClock)}. About ${lengthLabel(Math.max(spanMin, 30))}. ${moveLine}`
      : `About ${lengthLabel(Math.max(spanMin, 30))}. ${moveLine}`,
    rain,
    shape: shape.id,
    partial: verdict.partial,
    note: verdict.partial
      ? "Only a partial plan could be verified."
      : input.thin
        ? "The live map was thin around this start, so I used places I know are real rather than inventing a restaurant."
        : "Real places, in an order. Prices are typical for two, not a quote.",
  };
}
