import "@tanstack/react-start/server-only";
import { parseDatingIntent } from "@/lib/dating.server";
import { geminiJson } from "@/lib/gemini.server";
import { interpretFamilyPlan, interpretTeamBrief, interpretTravelBrief, type FamilyPlanIntent, type PlanningMode, type TeamOutIntent, type TravelIntent } from "@/lib/planning-brief";

const SCHEMAS: Record<Exclude<PlanningMode, "dating">, object> = {
  travel: {
    type: "object",
    properties: {
      destinations: { type: "array", items: { type: "string" } },
      mustVisit: { type: "array", items: { type: "string" } },
      avoidPlaces: { type: "array", items: { type: "string" } },
      nights: { type: "number" },
      travellerType: { type: "string" },
      mustHave: { type: "array", items: { type: "string" } },
      pace: { type: "string" },
      hotelChangePreference: { type: "string" },
    },
  },
  family: {
    type: "object",
    properties: {
      dateIntent: { type: "string" },
      timeOfDay: { type: "string" },
      indoorOutdoor: { type: "string" },
      interests: { type: "array", items: { type: "string" } },
      maxTravelMinutes: { type: "number" },
      travelMode: { type: "string" },
      areaText: { type: "string" },
    },
  },
  team_out: {
    type: "object",
    properties: {
      groupSize: { type: "number" },
      dateIntent: { type: "string" },
      timeOfDay: { type: "string" },
      budgetPerPerson: { type: "number" },
      vibes: { type: "array", items: { type: "string" } },
      areaIntent: { type: "string" },
      avoid: { type: "array", items: { type: "string" } },
    },
  },
};

function mentioned(text: string, value: string): boolean {
  return text.toLowerCase().includes(value.toLowerCase());
}

function mergeTravel(local: TravelIntent, raw: unknown, text: string): TravelIntent {
  if (!raw || typeof raw !== "object") return local;
  const record = raw as Record<string, unknown>;
  const next = { ...local, destinations: [...local.destinations], mustVisit: [...local.mustVisit], avoidPlaces: [...local.avoidPlaces], mustHave: [...local.mustHave], interests: [...local.interests], avoid: [...local.avoid] };
  for (const name of arrayOf(record.destinations)) {
    if (!next.destinations.includes(name) && mentioned(text, name) && !next.avoidPlaces.includes(name)) next.destinations.push(name);
  }
  for (const name of arrayOf(record.mustVisit)) {
    if (!next.mustVisit.includes(name) && mentioned(text, name)) next.mustVisit.push(name);
  }
  return next;
}

function mergeFamily(local: FamilyPlanIntent, raw: unknown, text: string): FamilyPlanIntent {
  if (!raw || typeof raw !== "object") return local;
  const record = raw as Record<string, unknown>;
  const next = { ...local, interests: [...local.interests] };
  for (const name of arrayOf(record.interests)) {
    if (!next.interests.includes(name as FamilyPlanIntent["interests"][number]) && mentioned(text, name)) next.interests.push(name as FamilyPlanIntent["interests"][number]);
  }
  if (!next.areaText && typeof record.areaText === "string" && mentioned(text, record.areaText)) next.areaText = record.areaText;
  return next;
}

function mergeTeam(local: TeamOutIntent, raw: unknown, text: string): TeamOutIntent {
  if (!raw || typeof raw !== "object") return local;
  const record = raw as Record<string, unknown>;
  const next = { ...local, vibes: [...local.vibes], avoid: [...local.avoid] };
  for (const name of arrayOf(record.vibes)) {
    if (!next.vibes.includes(name) && mentioned(text, name)) next.vibes.push(name);
  }
  if (next.groupSize == null && typeof record.groupSize === "number" && mentioned(text, String(record.groupSize))) next.groupSize = record.groupSize;
  if (next.budgetPerPerson == null && typeof record.budgetPerPerson === "number" && mentioned(text, String(record.budgetPerPerson))) next.budgetPerPerson = record.budgetPerPerson;
  return next;
}

function arrayOf(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.length > 1 && item.length < 60) : [];
}

export async function parsePlanningBrief(mode: PlanningMode, text: string, today: string) {
  if (mode === "dating") return { mode, intent: await parseDatingIntent(text, today) };
  const raw = await geminiJson(
    "Parse a planning brief into JSON. Do not invent ages, coordinates, prices, venues, weather, or travel times. Only name places and constraints that the user actually wrote. Leave unspecified fields empty.",
    text.slice(0, 500),
    SCHEMAS[mode],
    420,
  );
  if (mode === "travel") return { mode, intent: mergeTravel(interpretTravelBrief(text), raw, text) };
  if (mode === "family") return { mode, intent: mergeFamily(interpretFamilyPlan(text, today), raw, text) };
  return { mode, intent: mergeTeam(interpretTeamBrief(text, today), raw, text) };
}
