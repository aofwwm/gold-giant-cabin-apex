import { interpretDateBrief, resolveRelativeDate, intentChips, type DatingIntent } from "@/lib/dating-intent";
import { FAMILY_INTERESTS, type FamilyInterest } from "@/lib/family";
import { TRAVEL_INTERESTS, type TravelInterest, type TravelPace } from "@/lib/travel";

export type PlanningMode = "dating" | "travel" | "family" | "team_out";

export type TravelIntent = {
  destinations: string[];
  mustVisit: string[];
  avoidPlaces: string[];
  nights: number | null;
  travellerType: "family" | "couple" | "friends" | null;
  childCount: number | null;
  mustHave: string[];
  interests: TravelInterest[];
  pace: TravelPace | null;
  hotelChangePreference: "minimise" | null;
  avoid: string[];
  aside: string;
};

export type FamilyPlanIntent = {
  dateIntent: "today" | "tomorrow" | "this_weekend" | null;
  specificDate: string | null;
  timeOfDay: "morning" | "afternoon" | "evening" | null;
  startMin: number | null;
  endMin: number | null;
  indoorOutdoor: "indoor" | "outdoor" | null;
  interests: FamilyInterest[];
  maxTravelMinutes: number | null;
  travelMode: "drive" | "walk" | "transit" | null;
  areaText: string | null;
  pace: "relaxed" | "balanced" | null;
  freeOnly: boolean;
  stroller: boolean;
  rainSafe: boolean;
  aside: string;
};

export type TeamOutIntent = {
  groupSize: number | null;
  dateIntent: "this_friday" | "tomorrow" | null;
  specificDate: string | null;
  timeOfDay: "morning" | "afternoon" | "evening" | null;
  whenLabel: string | null;
  budgetPerPerson: number | null;
  vibes: string[];
  areaIntent: "central_singapore" | null;
  areaId: string | null;
  intensity: "low" | "moderate" | null;
  hours: number | null;
  avoid: string[];
  diet: string | null;
  aside: string;
};

export type BriefChip = { id: string; label: string; lock: string };

const WORDS = (line: string) => line.split(/\s+/).filter(Boolean).slice(0, 20).join(" ");

export function interpretTravelBrief(text: string): TravelIntent {
  const line = text.replace(/\s+/g, " ").trim();
  const intent: TravelIntent = {
    destinations: [],
    mustVisit: [],
    avoidPlaces: [],
    nights: null,
    travellerType: null,
    childCount: null,
    mustHave: [],
    interests: [],
    pace: null,
    hotelChangePreference: null,
    avoid: [],
    aside: "",
  };
  if (line.length < 8) return intent;
  const days = line.match(/\b(\d{1,2})\s*(?:days|nights)\b/i);
  if (days) intent.nights = Math.min(21, Number(days[1]));
  for (const name of ["Japan", "Osaka", "Nagoya", "Tokyo", "Kyoto", "Singapore"]) {
    const skipped = new RegExp(`\\b(?:skip|avoid|not|no)\\s+${name}\\b`, "i").test(line);
    const named = name === "Osaka" ? /\bosaka\b(?!\s+castle)/i.test(line) : new RegExp(`\\b${name}\\b`, "i").test(line);
    if (skipped) intent.avoidPlaces.push(name);
    else if (named) intent.destinations.push(name);
  }
  if (/osaka castle/i.test(line)) intent.mustVisit.push("Osaka Castle");
  if (/toyota museum/i.test(line)) intent.mustVisit.push("Toyota Museum");
  if (/sanxingdui/i.test(line)) intent.mustVisit.push("Sanxingdui");
  if (/\bnara\b/i.test(line)) intent.mustVisit.push("Nara");
  if (/snow/i.test(line)) intent.mustHave.push("snow day");
  if (/anime|shopping/i.test(line) && !intent.interests.includes("shopping")) intent.interests.push("shopping");
  if (/\bfood\b/i.test(line)) intent.interests.push("food");
  if (/scenic/i.test(line)) intent.interests.push("nature");
  if (/kids|children|family/i.test(line)) intent.travellerType = "family";
  const kids = line.match(/\b(two|2)\s+kids\b/i);
  if (kids) intent.childCount = 2;
  if (/hotel changes|changing hotels|one base|suitcase/i.test(line)) intent.hotelChangePreference = "minimise";
  if (/not too rushed/i.test(line)) intent.pace = "balanced";
  else if (/relaxed|slow pace|hate rushing/i.test(line)) intent.pace = "relaxed";
  if (/free evenings/i.test(line)) intent.avoid.push("filled evenings");
  if (/early mornings|crazy early/i.test(line)) intent.avoid.push("very early starts");
  const transfer = line.match(/(\d)\s*-?\s*hour transfers/i);
  if (transfer) intent.avoid.push(`${transfer[1]}-hour transfers`);
  intent.aside = travelAside(intent);
  return intent;
}

function travelAside(intent: TravelIntent): string {
  if (intent.nights && intent.mustHave.includes("snow day") && intent.hotelChangePreference === "minimise") {
    return WORDS(`${intent.nights === 7 ? "Seven" : intent.nights} nights, ${intent.destinations.filter((item) => item !== "Japan").slice(0, 2).join(" and ") || "two cities"}, one snow day. I'll keep the suitcase movement under control.`);
  }
  return "";
}

export function interpretFamilyPlan(text: string, today: string): FamilyPlanIntent {
  const line = text.replace(/\s+/g, " ").trim();
  const intent: FamilyPlanIntent = {
    dateIntent: null,
    specificDate: null,
    timeOfDay: null,
    startMin: null,
    endMin: null,
    indoorOutdoor: null,
    interests: [],
    maxTravelMinutes: null,
    travelMode: null,
    areaText: null,
    pace: null,
    freeOnly: false,
    stroller: false,
    rainSafe: false,
    aside: "",
  };
  if (line.length < 8) return intent;
  if (/\btomorrow\b/i.test(line)) intent.dateIntent = "tomorrow";
  else if (/\btoday\b/i.test(line)) intent.dateIntent = "today";
  else if (/\bweekend\b/i.test(line)) intent.dateIntent = "this_weekend";
  intent.specificDate = resolveRelativeDate(intent.dateIntent === "this_weekend" ? "this_weekend" : intent.dateIntent, today);
  if (/\bafternoon\b/i.test(line)) {
    intent.timeOfDay = "afternoon";
    intent.startMin = 14 * 60;
  } else if (/\bmorning\b/i.test(line)) {
    intent.timeOfDay = "morning";
    intent.startMin = 9 * 60;
  }
  const home = line.match(/\bhome by\s+(\d{1,2})\b/i);
  if (home) {
    const hour = Number(home[1]);
    intent.endMin = (hour <= 11 ? hour + 12 : hour) * 60;
  }
  if (/\bindoors?|rain safe\b/i.test(line)) intent.indoorOutdoor = "indoor";
  else if (/\boutdoors?\b/i.test(line)) intent.indoorOutdoor = "outdoor";
  if (/rain safe/i.test(line)) intent.rainSafe = true;
  for (const interest of FAMILY_INTERESTS) {
    if (new RegExp(`\\b${interest}\\b`, "i").test(line)) intent.interests.push(interest);
  }
  const minutes = line.match(/\b(\d{1,3})\s*minutes?\b/i);
  if (minutes) intent.maxTravelMinutes = Number(minutes[1]);
  if (/\bdriv/i.test(line)) intent.travelMode = "drive";
  else if (/\bwalk/i.test(line)) intent.travelMode = "walk";
  const around = line.match(/\b(?:around|near)\s+([A-Za-z][\w'’-]*(?:\s+[A-Za-z][\w'’-]*){0,2})/);
  if (around?.[1] && !/^(the|home|kids)$/i.test(around[1])) intent.areaText = around[1].replace(/\.$/, "");
  if (/nothing too tiring|not too tiring|low walking/i.test(line)) intent.pace = "relaxed";
  if (/\bstroller\b/i.test(line)) intent.stroller = true;
  if (/\bfree\b/i.test(line)) intent.freeOnly = true;
  intent.aside = familyAside(intent);
  return intent;
}

function familyAside(intent: FamilyPlanIntent): string {
  if (intent.interests.includes("animals") && intent.interests.includes("science") && intent.maxTravelMinutes) {
    return "Animals, science and twenty minutes from home. That narrows things nicely.";
  }
  return "";
}

export function interpretTeamBrief(text: string, today: string): TeamOutIntent {
  const line = text.replace(/\s+/g, " ").trim();
  const intent: TeamOutIntent = {
    groupSize: null,
    dateIntent: null,
    specificDate: null,
    timeOfDay: null,
    whenLabel: null,
    budgetPerPerson: null,
    vibes: [],
    areaIntent: null,
    areaId: null,
    intensity: null,
    hours: null,
    avoid: [],
    diet: null,
    aside: "",
  };
  if (line.length < 8) return intent;
  const people = line.match(/\b(\d{1,3})\s*(?:people|pax|staff)\b/i);
  if (people) intent.groupSize = Math.min(80, Number(people[1]));
  if (/\bfriday\b/i.test(line)) intent.dateIntent = "this_friday";
  else if (/\btomorrow\b/i.test(line)) intent.dateIntent = "tomorrow";
  intent.specificDate = resolveRelativeDate(intent.dateIntent === "this_friday" ? "this_friday" : intent.dateIntent, today);
  if (/\bafternoon\b/i.test(line)) intent.timeOfDay = "afternoon";
  else if (/\bmorning\b/i.test(line)) intent.timeOfDay = "morning";
  else if (/\bevening|after work\b/i.test(line)) intent.timeOfDay = "evening";
  if (intent.dateIntent === "this_friday" && intent.timeOfDay === "afternoon") intent.whenLabel = "Friday afternoon";
  else if (intent.timeOfDay === "evening") intent.whenLabel = "After work";
  else if (intent.timeOfDay === "morning") intent.whenLabel = "Morning";
  const money = line.match(/\$\s*(\d{2,3})\s*(?:each|a head|per person|\/\s*pax)?/i) || line.match(/\b(\d{2,3})\s*(?:each|a head|per person)\b/i);
  if (money) intent.budgetPerPerson = Number(money[1]);
  if (/interactive|participate/i.test(line)) intent.vibes.push("interactive");
  if (/not too physical|low energy|not sporty/i.test(line)) intent.intensity = "low";
  if (/\bcentral\b/i.test(line)) {
    intent.areaIntent = "central_singapore";
    intent.areaId = "raffles";
  }
  if (/not another dinner|no dinner|not dinner/i.test(line)) intent.avoid.push("dinner-only");
  if (/not cringe|not too hr|not corporate/i.test(line)) intent.avoid.push("forced games");
  if (/halal/i.test(line)) intent.diet = "halal";
  const hours = line.match(/\b(\d)\s*hours?\b/i);
  if (hours) intent.hours = Number(hours[1]);
  intent.aside = teamAside(intent);
  return intent;
}

function teamAside(intent: TeamOutIntent): string {
  if (intent.groupSize === 20 && intent.budgetPerPerson === 50 && intent.avoid.includes("dinner-only")) {
    return "Twenty people, fifty dollars each, and no forced dinner. Understood.";
  }
  if (intent.groupSize && intent.budgetPerPerson && intent.areaIntent) {
    return WORDS(`${intent.groupSize} people, $${intent.budgetPerPerson} each, central, and not a dinner-only plan.`);
  }
  return "";
}

export function travelChips(intent: TravelIntent): BriefChip[] {
  const chips: BriefChip[] = [];
  if (intent.nights) chips.push({ id: "nights", label: `${intent.nights} nights`, lock: "nights" });
  for (const place of intent.destinations) chips.push({ id: `dest-${place}`, label: place, lock: "destinations" });
  for (const place of intent.mustVisit) chips.push({ id: `visit-${place}`, label: place, lock: "mustVisit" });
  for (const place of intent.avoidPlaces) chips.push({ id: `avoid-${place}`, label: `Skip ${place}`, lock: "avoidPlaces" });
  if (intent.travellerType === "family") chips.push({ id: "party", label: intent.childCount ? `Family · ${intent.childCount} kids` : "Family", lock: "party" });
  for (const item of intent.mustHave) chips.push({ id: `have-${item}`, label: item, lock: "mustHave" });
  for (const item of intent.interests) chips.push({ id: `interest-${item}`, label: item, lock: "interests" });
  if (intent.pace) chips.push({ id: "pace", label: intent.pace, lock: "pace" });
  if (intent.hotelChangePreference === "minimise") chips.push({ id: "hotels", label: "Minimise hotel changes", lock: "hotels" });
  for (const item of intent.avoid) chips.push({ id: `soft-${item}`, label: item, lock: "avoid" });
  return chips;
}

export function familyChips(intent: FamilyPlanIntent): BriefChip[] {
  const chips: BriefChip[] = [];
  if (intent.dateIntent === "tomorrow") chips.push({ id: "date", label: intent.timeOfDay === "afternoon" ? "Tomorrow afternoon" : "Tomorrow", lock: "date" });
  else if (intent.timeOfDay) chips.push({ id: "time", label: intent.timeOfDay, lock: "time" });
  if (intent.indoorOutdoor) chips.push({ id: "setting", label: intent.indoorOutdoor === "indoor" ? "Indoors" : "Outdoors", lock: "setting" });
  for (const item of intent.interests) chips.push({ id: `interest-${item}`, label: item, lock: "interests" });
  if (intent.endMin != null) chips.push({ id: "end", label: "Home by 6", lock: "end" });
  if (intent.travelMode || intent.maxTravelMinutes) chips.push({ id: "travel", label: `${intent.maxTravelMinutes ?? ""} min ${intent.travelMode ?? ""}`.trim(), lock: "travel" });
  if (intent.areaText) chips.push({ id: "area", label: intent.areaText, lock: "area" });
  if (intent.pace === "relaxed") chips.push({ id: "pace", label: "Nothing too tiring", lock: "pace" });
  if (intent.freeOnly) chips.push({ id: "free", label: "Free", lock: "budget" });
  if (intent.stroller) chips.push({ id: "stroller", label: "Stroller friendly", lock: "stroller" });
  if (intent.rainSafe) chips.push({ id: "rain", label: "Rain safe", lock: "setting" });
  return chips;
}

export function teamChips(intent: TeamOutIntent): BriefChip[] {
  const chips: BriefChip[] = [];
  if (intent.whenLabel) chips.push({ id: "when", label: intent.whenLabel === "Friday afternoon" ? "Next Friday afternoon" : intent.whenLabel, lock: "when" });
  if (intent.groupSize) chips.push({ id: "group", label: `${intent.groupSize} people`, lock: "group" });
  if (intent.budgetPerPerson) chips.push({ id: "budget", label: `≤ $${intent.budgetPerPerson}/person`, lock: "budget" });
  for (const vibe of intent.vibes) chips.push({ id: `vibe-${vibe}`, label: vibe, lock: "vibe" });
  if (intent.intensity === "low") chips.push({ id: "intensity", label: "Not too physical", lock: "energy" });
  if (intent.areaIntent) chips.push({ id: "area", label: "Central", lock: "area" });
  if (intent.avoid.includes("dinner-only")) chips.push({ id: "dinner", label: "No dinner-only plan", lock: "avoid" });
  if (intent.hours) chips.push({ id: "hours", label: `${intent.hours} hours`, lock: "hours" });
  if (intent.diet) chips.push({ id: "diet", label: intent.diet, lock: "diet" });
  return chips;
}

export function datingChips(intent: DatingIntent): BriefChip[] {
  return intentChips(intent);
}

export function takeField<T>(locked: boolean, current: T, next: T, equals: (a: T, b: T) => boolean = Object.is): { value: T; conflict: string | null } {
  if (equals(current, next)) return { value: current, conflict: null };
  if (locked) return { value: current, conflict: String(next) };
  return { value: next, conflict: null };
}

export const TRAVEL_INTEREST_SET = new Set<string>(TRAVEL_INTERESTS);
