import "@tanstack/react-start/server-only";

import { distanceMeters } from "@/lib/coord";
import { geminiJson, KAIROS_VOICE } from "@/lib/gemini.server";
import { shareRequest, TtlCache } from "@/lib/travel-cache";
import {
  applyRoute,
  buildTrip,
  dayStops,
  itineraryRequestPlan,
  localTripVoice,
  voiceStaysInside,
  type DiscoveryHealth,
  type TravelArea,
  type Trip,
  type DiscoveredPlace,
} from "@/lib/travel-model";
import { mergePlaces, destinationProfile } from "@/lib/travel-knowledge";
import { attachPlacePhotos } from "@/lib/travel-photo.server";
import { attachPlaceStories } from "@/lib/travel-story.server";
import { labelPlaces } from "@/lib/travel-names.server";
import { readableName } from "@/lib/travel-names";
import { discoverPlaces, travelMatrix, travelRoute, travelWeather } from "@/lib/travel-providers.server";
import { explicitChildAges, type TravelBrief } from "@/lib/travel";
import { adaptPlaybook, baseAreasFor, searchAreasFor } from "@/lib/travel-playbook";
import { bootstrapPopularPlaybooks, enablePlaybookPersistence, playbooksForPlanning, setPlaybookNetwork } from "@/lib/travel-playbook-registry";
import { importKnowledgeSnapshot, onKnowledgePersist } from "@/lib/travel-knowledge-pack";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const knowledgePath = "data/knowledge/packs.json";
try {
  const fs = require("node:fs") as typeof import("node:fs");
  if (fs.existsSync(knowledgePath)) {
    const body = JSON.parse(fs.readFileSync(knowledgePath, "utf8")) as { packs?: Parameters<typeof importKnowledgeSnapshot>[0] };
    if (Array.isArray(body.packs)) importKnowledgeSnapshot(body.packs);
  }
} catch {
  // The compiler rebuilds a missing cache.
}
onKnowledgePersist((packs) => {
  try {
    const fs = require("node:fs") as typeof import("node:fs");
    const path = require("node:path") as typeof import("node:path");
    fs.mkdirSync(path.dirname(knowledgePath), { recursive: true });
    fs.writeFileSync(knowledgePath, JSON.stringify({ packs }));
  } catch {
    // A full disk should not stop a trip.
  }
});

setPlaybookNetwork(true);
enablePlaybookPersistence();
bootstrapPopularPlaybooks(80);

export { searchTravelDestinations, locateHotel } from "@/lib/travel-providers.server";

export type TravelPlanInput = TravelBrief & {
  areas?: TravelArea[];
  mustVisit?: string[];
};

function areasOf(input: TravelPlanInput): TravelArea[] {
  const extra = (input.areas ?? []).filter((area) => area.name && Number.isFinite(area.latitude) && Number.isFinite(area.longitude));
  if (extra.length) return extra.slice(0, 3);
  return [{ name: input.destination, latitude: input.latitude, longitude: input.longitude }];
}

const voiceCache = new TtlCache<string>(12 * 60 * 60 * 1000, 40, "gemini");

async function awayLine(facts: string, fallback: string): Promise<string> {
  const cached = voiceCache.get(facts);
  if (cached) return cached;
  const raw = await geminiJson(
    `${KAIROS_VOICE} You are Kairos · Away. One sentence, under 20 words. Use only the names, burden, and weather in the JSON. Do not mention children, strollers, or a family unless child ages are in the JSON. Do not invent hotels, restaurants, prices, opening hours, ratings, or routes.`,
    facts,
    { type: "object", properties: { line: { type: "string" } } },
    80,
  ).catch(() => null);
  const line = raw && typeof raw === "object" ? (raw as { line?: unknown }).line : null;
  if (typeof line !== "string" || !voiceStaysInside(line)) return fallback;
  const spoken = line.replace(/\s+/g, " ").trim();
  voiceCache.set(facts, spoken);
  return spoken;
}

export async function planTravel(input: TravelPlanInput): Promise<Trip> {
  const areas = areasOf(input);
  const signature = JSON.stringify({
    areas: areas.map((area) => [area.name, area.latitude.toFixed(3), area.longitude.toFixed(3)]),
    start: input.start,
    nights: input.nights,
    pace: input.pace,
    move: input.move,
    oneBase: input.oneBase,
    interests: input.interests,
    rejected: input.rejected,
    mustVisit: input.mustVisit ?? [],
    salt: input.salt,
    childAges: explicitChildAges(input.childAges),
    styles: input.styles ?? [],
    balance: input.balance ?? "balanced",
    firstVisit: input.firstVisit !== false,
    focus: input.focus ?? "icons",
    foodPlanning: input.foodPlanning ?? "balanced",
  });
  return shareRequest(`plan:${signature}`, () => planFresh(input, areas));
}

async function planFresh(input: TravelPlanInput, areas: TravelArea[]): Promise<Trip> {
  const countryCode = areas.find((area) => area.countryCode)?.countryCode ?? "";
  const books = await playbooksForPlanning(input.destination, {
    latitude: input.latitude,
    longitude: input.longitude,
    countryCode,
  }).catch(() => undefined);
  const adapted = adaptPlaybook({
    destination: input.destination,
    nights: input.nights,
    pace: input.pace,
    oneBase: input.oneBase,
    interests: input.interests,
    styles: input.styles,
    balance: input.balance ?? "balanced",
    firstVisit: input.firstVisit !== false,
    childAges: explicitChildAges(input.childAges),
  }, books);
  const discover = searchAreasFor(areas, adapted);
  const stayAreas = baseAreasFor(areas, adapted);
  const primary = discover[0] ?? areas[0] ?? { name: input.destination, latitude: input.latitude, longitude: input.longitude };
  const [profile, firstFound] = await Promise.all([
    destinationProfile(primary).catch(() => null),
    discoverPlaces(primary),
  ]);
  const found = [firstFound];
  for (const area of discover.slice(1)) found.push(await discoverPlaces(area));
  const discovered: DiscoveredPlace[] = [];
  discover.forEach((area, index) => {
    const spots = found[index]?.places ?? [];
    const knowledge = index === 0 && profile && profile.status !== "failed" ? profile.places : [];
    discovered.push(...mergePlaces(spots, knowledge, area));
  });
  const osm: DiscoveryHealth["osm"] = found.some((item) => item.status === "ok") ? "ok" : found.some((item) => item.status === "empty") ? "empty" : "failed";
  const hotels: DiscoveryHealth["hotels"] = found.some((item) => item.hotels === "ok") ? "ok" : found.some((item) => item.hotels === "empty") ? "empty" : "failed";
  const wikidata: DiscoveryHealth["wikidata"] = profile?.status ?? "failed";
  const sightCount = discovered.filter((spot) => spot.category !== "stay" && spot.category !== "restaurant" && spot.category !== "cafe" && spot.category !== "nightlife" && spot.category !== "transport" && spot.category !== "other").length;
  let note = "";
  if (!sightCount && (osm === "failed" || wikidata === "failed")) {
    note = `Couldn't load places for ${input.destination}.`;
  } else if (!sightCount) {
    note = `No places came back for ${input.destination}.`;
  }
  const discovery = { osm, wikidata, hotels, note };
  const dates = Array.from({ length: Math.min(7, input.nights) }, (_, index) => {
    const [year, month, day] = input.start.split("-").map(Number);
    const next = new Date(Date.UTC(year, (month || 1) - 1, (day || 1) + index));
    return next.toISOString().slice(0, 10);
  });
  const [listed, weather] = await Promise.all([
    labelPlaces(spreadPlaces(discovered, discover.length > 2 ? 80 : 56), {
      countryCode,
      latitude: primary.latitude,
      longitude: primary.longitude,
    }).then((rows) => attachPlacePhotos(rows)).then((rows) => attachPlaceStories(rows, primary.name)),
    travelWeather({ lat: primary.latitude, lng: primary.longitude }, dates),
  ]);
  const points = [...stayAreas.map((area) => ({ lat: area.latitude, lng: area.longitude })), ...listed.map((spot) => ({ lat: spot.lat, lng: spot.lng }))];
  const matrix = await travelMatrix(input.move, points);
  const transfers = matrix ? stayAreas.map((_, from) => stayAreas.map((__, to) => matrix.minutes[from]?.[to] ?? null)) : null;
  const spotMatrix = matrix ? matrix.minutes.slice(stayAreas.length).map((row) => row.slice(stayAreas.length)) : null;
  let trip = buildTrip({
    destination: input.destination,
    areas: stayAreas,
    start: input.start,
    nights: input.nights,
    adults: input.adults,
    childAges: explicitChildAges(input.childAges),
    pace: input.pace,
    move: input.move,
    oneBase: input.oneBase,
    interests: input.interests,
    rejected: input.rejected,
    mustVisit: input.mustVisit ?? [],
    salt: input.salt,
    lockedDates: input.lockedDates,
    spots: listed,
    weather,
    matrix: spotMatrix,
    transfers,
    styles: input.styles,
    balance: input.balance,
    firstVisit: input.firstVisit,
    focus: input.focus,
    foodPlanning: input.foodPlanning,
    profileNote: "",
    countryCode,
    discovery,
    skeleton: adapted?.days,
    playbook: adapted?.view,
  });
  for (const day of trip.days) {
    if (input.lockedDates.includes(day.date)) continue;
    const rows = dayStops(trip, day.index);
    if (rows.length < 2) continue;
    const route = await travelRoute(input.move, rows.map((stop) => ({ lat: stop.lat, lng: stop.lng })));
    if (route.source !== "osrm") continue;
    trip = applyRoute(trip, day.index, route);
  }
  const fallback = localTripVoice(trip.burden, trip.days.find((day) => day.outdoorOk === false)?.label ?? "");
  const facts = JSON.stringify({
    destination: trip.destination,
    burden: trip.burden.line,
    bases: trip.bases.map((base) => ({ label: base.label, chosen: base.chosen, note: base.note })),
    days: trip.days.slice(0, 7).map((day) => ({
      label: day.label,
      weather: day.weather,
      stops: dayStops(trip, day.index).map((stop) => readableName(stop)),
    })),
    why: trip.whyTrip,
    coverage: (trip.coverage ?? []).map((row) => ({ group: row.group, status: row.status, example: row.example })),
    requests: itineraryRequestPlan(areas.length, dates.length),
  });
  trip.voice = await awayLine(facts, fallback);
  logGeneration(input, adapted, trip);
  return trip;
}

function logGeneration(input: TravelPlanInput, adapted: ReturnType<typeof adaptPlaybook>, trip: Trip): void {
  if (process.env.KAIROS_TRAVEL_LOG === "0") return;
  const days = trip.days.filter((day) => trip.stops.some((stop) => stop.day === day.index && stop.category !== "stay"));
  const lines = [
    "[TRAVEL GENERATION]",
    `canonical destination: ${trip.destination}`,
    `selected TravelPlaybook ID: ${adapted?.id ?? "none"}`,
    `TravelPlaybook confidence: ${adapted?.confidence ?? "none"}`,
    `playbook duration band: ${adapted?.bandId ?? "none"}`,
    `fallback planner used: ${adapted ? "NO" : "YES"}`,
    `hotel selected by user: ${(trip.hotelSelectionSource ?? "NONE") === "NONE" ? "NO" : "YES"}`,
    `exact hotel ID: null`,
    `day themes: ${trip.days.map((day) => day.theme || day.intent || day.area).join(" | ")}`,
    `scheduled stops per day: ${trip.days.map((day) => trip.stops.filter((stop) => stop.day === day.index && stop.category !== "stay").length).join(",")}`,
    `validation: ${days.length ? "days-present" : "empty"}`,
    `playbook anchor stops: ${trip.curation?.anchorStops ?? 0}`,
    `supplementary osm stops: ${trip.curation?.osmStops ?? 0}`,
    `experience groups satisfied: ${(trip.curation?.groupsSatisfied ?? []).join(", ") || "none"}`,
    `thin-day repairs: ${trip.curation?.thinRepairs ?? 0}`,
    `fallback: ${(trip.curation?.fallback ?? []).join(", ") || "none"}`,
    "Gemini calls: 0 or 1 voice line, none for the plan",
    `final itinerary source: ${adapted ? "TravelPlaybook" : "place-list"}`,
  ];
  console.info(lines.join("\n"));
}

const SEE = new Set(["attraction", "museum", "park", "garden", "viewpoint", "landmark", "historic", "theme_park", "zoo", "aquarium", "shopping", "beach", "family"]);
const FOOD = new Set(["restaurant", "cafe", "market", "nightlife"]);

function spreadPlaces(spots: DiscoveredPlace[], limit = 56): DiscoveredPlace[] {
  const rank = (spot: DiscoveredPlace) => spot.importance === "iconic" ? 0 : spot.importance === "major" ? 1 : spot.importance === "interest" ? 2 : 3;
  const byArea = new Map<string, typeof spots>();
  for (const spot of spots) {
    const list = byArea.get(spot.area) ?? [];
    list.push(spot);
    byArea.set(spot.area, list);
  }
  const picked: typeof spots = [];
  for (const list of byArea.values()) {
    const stays = list.filter((spot) => spot.category === "stay").slice(0, 8);
    const food = list.filter((spot) => FOOD.has(spot.category)).sort((a, b) => rank(a) - rank(b)).slice(0, 8);
    const sights = list.filter((spot) => SEE.has(spot.category)).sort((a, b) => rank(a) - rank(b)).slice(0, 40);
    picked.push(...stays, ...food, ...sights);
  }
  const unique: typeof spots = [];
  for (const spot of picked.sort((a, b) => rank(a) - rank(b))) {
    if (unique.some((item) => item.id === spot.id)) continue;
    const sameName = unique.find((item) => item.name.toLowerCase() === spot.name.toLowerCase());
    if (sameName) {
      const separateBranch = spot.category === "stay" && sameName.category === "stay" && distanceMeters(spot.lat, spot.lng, sameName.lat, sameName.lng) > 1500;
      if (!separateBranch) continue;
    }
    unique.push(spot);
    if (unique.length === limit) break;
  }
  return unique;
}

export async function routeTravelDay(move: TravelBrief["move"], points: { lat: number; lng: number }[]) {
  return travelRoute(move, points);
}
