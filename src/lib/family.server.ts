import "@tanstack/react-start/server-only";
import { SPOTS } from "@/lib/directory";
import { distanceMeters } from "@/lib/coord";
import { geminiJson, KAIROS_VOICE } from "@/lib/gemini.server";
import { noteCall, noteFailure } from "@/lib/provider-usage";
import { shareRequest, TtlCache } from "@/lib/travel-cache";
import { clipVoice } from "@/lib/voice";
import {
  FAMILY_INTERESTS,
  readWeather,
  scoreFamily,
  travelMinutes,
  type FamilyBrief,
  type FamilyInterest,
  type FamilyPlace,
  type LockedPin,
  type WeatherHour,
} from "@/lib/family";
import { stampDay, type DayLeg, type PlannedStop } from "@/lib/family-day";

const OVERPASS = ["https://overpass.openstreetmap.fr/api/interpreter", "https://overpass-api.de/api/interpreter"];
const familyMapCache = new TtlCache<FamilyPlace[]>(6 * 60 * 60 * 1000, 40, "discovery");
const familyMealCache = new TtlCache<FamilyPlace[]>(6 * 60 * 60 * 1000, 40, "discovery");
const familyRouteCache = new TtlCache<number | null>(6 * 60 * 60 * 1000, 300, "routing");
const familySkyCache = new TtlCache<{ weather: ReturnType<typeof readWeather> | null; hours: WeatherHour[] }>(60 * 60 * 1000, 48, "weather");
const familyBriefCache = new TtlCache<Partial<FamilyBrief>>(24 * 60 * 60 * 1000, 40, "gemini");
const familyVoiceCache = new TtlCache<string>(12 * 60 * 60 * 1000, 40, "gemini");

function interestList(tags: Record<string, string>, name: string): FamilyInterest[] {
  const blob = `${name} ${tags.leisure ?? ""} ${tags.tourism ?? ""} ${tags.amenity ?? ""}`.toLowerCase();
  const found = new Set<FamilyInterest>();
  if (/park|garden|nature/.test(blob)) found.add("nature");
  if (/playground|play/.test(blob)) found.add("playground");
  if (/museum|gallery|library|art/.test(blob)) found.add("museum");
  if (/cycle|bicycle|bike/.test(blob)) found.add("cycling");
  if (/zoo|aquarium|bird|farm/.test(blob)) found.add("animals");
  if (/beach|water|pool|splash/.test(blob)) found.add("water");
  if (/craft|pottery|workshop/.test(blob)) found.add("crafts");
  if (/science|discovery|experiment/.test(blob)) found.add("science");
  if (/dinosaur/.test(blob)) found.add("dinosaurs");
  if (/art|gallery/.test(blob)) found.add("art");
  if (/car|vehicle/.test(blob)) found.add("cars");
  if (/train|rail/.test(blob)) found.add("trains");
  if (/sport|swim|ball/.test(blob)) found.add("sports");
  if (/anime|character/.test(blob)) found.add("characters");
  if (/theatre|theater|perform/.test(blob)) found.add("performances");
  if (/festival|market/.test(blob)) found.add("festivals");
  if (/food|cafe|kitchen/.test(blob)) found.add("food");
  if (/tech|digital/.test(blob)) found.add("technology");
  if (/book|library/.test(blob)) found.add("books");
  if (/game|bowl|climb/.test(blob)) found.add("games");
  return [...found];
}

function fromDirectory(origin: { lat: number; lng: number }): FamilyPlace[] {
  return SPOTS.filter((spot) => spot.kind === "out" && spot.id !== "party-world").map((spot) => {
    const meters = distanceMeters(origin.lat, origin.lng, spot.lat, spot.lng);
    const indoor = spot.styles.includes("indoor") || /gallery|museum|cafe|bowl|climb|escape|pottery|cultural/i.test(`${spot.name} ${spot.cuisine}`);
    const interests = interestList({ leisure: spot.styles.join(" ") }, `${spot.name} ${spot.cuisine} ${spot.blurb}`);
    const setting = indoor && !spot.styles.includes("outdoor") ? "indoor" : spot.styles.includes("outdoor") && !indoor ? "outdoor" : indoor ? "indoor" : "outdoor";
    return {
      id: `dir-${spot.id}`,
      name: spot.name,
      address: spot.address,
      lat: spot.lat,
      lng: spot.lng,
      setting,
      interests,
      free: spot.approxSgd === 0,
      approxSgd: spot.approxSgd,
      toddler: /garden|park|gallery|museum|botanic|east coast/i.test(spot.name),
      stroller: /garden|park|gallery|museum|botanic|east coast|cultural/i.test(spot.name),
      mixedAge: !/escape|climb|boulder|karaoke/i.test(spot.name),
      rainSafe: setting === "indoor",
      meters: Math.round(meters),
      travelMin: travelMinutes(meters),
      source: "directory" as const,
      blurb: spot.blurb,
      opening: "",
      wheelchair: null,
    };
  });
}

async function fromMap(origin: { lat: number; lng: number }, radius: number): Promise<FamilyPlace[]> {
  const key = `${origin.lat.toFixed(2)},${origin.lng.toFixed(2)}:${radius}`;
  const cached = familyMapCache.get(key);
  if (cached) return cached;
  return shareRequest(`family-map:${key}`, () => loadFamilyMap(origin, radius, key));
}

async function loadFamilyMap(origin: { lat: number; lng: number }, radius: number, key: string): Promise<FamilyPlace[]> {
  const dLat = radius / 111320;
  const dLng = radius / (111320 * Math.cos((origin.lat * Math.PI) / 180));
  const box = `${origin.lat - dLat},${origin.lng - dLng},${origin.lat + dLat},${origin.lng + dLng}`;
  const query = `[out:json][timeout:12];(node["leisure"="park"]["name"](${box});way["leisure"="park"]["name"](${box});node["leisure"="playground"]["name"](${box});way["leisure"="playground"]["name"](${box});node["amenity"="library"]["name"](${box});way["amenity"="library"]["name"](${box});node["tourism"="museum"]["name"](${box});way["tourism"="museum"]["name"](${box});node["tourism"="gallery"]["name"](${box});way["tourism"="gallery"]["name"](${box}););out center 40;`;
  for (const host of OVERPASS) {
    try {
      noteCall("discovery", "overpass-family");
      const res = await fetch(host, {
        method: "POST",
        headers: { "Content-Type": "text/plain", "User-Agent": "Kairos/1.0 (family planning)" },
        body: query,
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) continue;
      const body = (await res.json()) as {
        elements?: { type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[];
      };
      const hits: FamilyPlace[] = [];
      for (const element of body.elements ?? []) {
        const tags = element.tags ?? {};
        const name = (tags.name ?? "").replace(/\s+/g, " ").trim();
        if (name.length < 2) continue;
        const lat = element.lat ?? element.center?.lat;
        const lng = element.lon ?? element.center?.lon;
        if (lat == null || lng == null) continue;
        const meters = distanceMeters(origin.lat, origin.lng, lat, lng);
        const indoor = Boolean(tags.tourism === "museum" || tags.tourism === "gallery" || tags.amenity === "library");
        const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
        hits.push({
          id: `osm-${element.type}-${element.id}`,
          name: name.slice(0, 80),
          address: (street || tags["addr:full"] || "Singapore").slice(0, 120),
          lat,
          lng,
          setting: indoor ? "indoor" : "outdoor",
          interests: interestList(tags, name),
          free: tags.fee !== "yes" && (indoor ? tags.fee === "no" : true),
          approxSgd: tags.fee === "yes" ? 15 : 0,
          toddler: tags.leisure === "playground" || tags.leisure === "park",
          stroller: tags.leisure === "park" || indoor,
          mixedAge: true,
          rainSafe: indoor,
          meters: Math.round(meters),
          travelMin: travelMinutes(meters),
          source: "osm",
          blurb: indoor ? "Indoor. Rain does not cancel it." : "Outdoor. Weather decides the timing.",
          opening: (tags.opening_hours ?? "").slice(0, 80),
          wheelchair: tags.wheelchair === "yes" ? true : tags.wheelchair === "no" ? false : null,
        });
      }
      if (hits.length) familyMapCache.set(key, hits);
      return hits;
    } catch {
      // Try the next map host.
    }
  }
  return [];
}

export async function forecast(origin: { lat: number; lng: number }, date: string): Promise<{ weather: ReturnType<typeof readWeather> | null; hours: WeatherHour[] }> {
  const key = `${origin.lat.toFixed(2)},${origin.lng.toFixed(2)}:${date}`;
  const cached = familySkyCache.get(key);
  if (cached) return cached;
  return shareRequest(`family-sky:${key}`, async () => {
    const again = familySkyCache.peek(key);
    if (again) return again;
    const cast = await loadForecast(origin, date);
    if (cast.weather) familySkyCache.set(key, cast);
    return cast;
  });
}

async function loadForecast(origin: { lat: number; lng: number }, date: string): Promise<{ weather: ReturnType<typeof readWeather> | null; hours: WeatherHour[] }> {
  try {
    const url = new URL("https://api.met.no/weatherapi/locationforecast/2.0/complete");
    url.searchParams.set("lat", origin.lat.toFixed(4));
    url.searchParams.set("lon", origin.lng.toFixed(4));
    noteCall("weather", "met-no");
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Kairos/1.0 (family weather; Singapore)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      noteFailure("weather", "met-no", `HTTP ${res.status}`);
      return { weather: null, hours: [] };
    }
    const body = (await res.json()) as {
      properties?: {
        timeseries?: {
          time: string;
          data?: {
            instant?: { details?: { air_temperature?: number; wind_speed?: number; ultraviolet_index_clear_sky?: number } };
            next_1_hours?: { summary?: { symbol_code?: string }; details?: { precipitation_amount?: number; probability_of_precipitation?: number } };
            next_6_hours?: { summary?: { symbol_code?: string }; details?: { precipitation_amount?: number; probability_of_precipitation?: number } };
          };
        }[];
      };
    };
    const hours: WeatherHour[] = [];
    for (const entry of body.properties?.timeseries ?? []) {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Singapore",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date(entry.time));
      const read = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
      const stamp = `${read("year")}-${read("month")}-${read("day")}`;
      if (stamp !== date) continue;
      const slot = entry.data?.next_1_hours ?? entry.data?.next_6_hours;
      const symbol = slot?.summary?.symbol_code ?? "";
      const amount = slot?.details?.precipitation_amount ?? 0;
      const given = slot?.details?.probability_of_precipitation;
      let rain = typeof given === "number" ? given : 12;
      if (typeof given !== "number") {
        if (symbol.includes("thunder")) rain = 80;
        else if (symbol.includes("heavyrain")) rain = 75;
        else if (symbol.includes("rain")) rain = symbol.includes("light") ? 48 : 68;
        else if (symbol.includes("shower")) rain = 40;
        else if (symbol.includes("fog") || symbol.includes("cloud")) rain = 18;
        if (amount >= 1) rain = Math.max(rain, 70);
        else if (amount >= 0.3) rain = Math.max(rain, 50);
      }
      const code = symbol.includes("thunder") ? 95 : symbol.includes("rain") || symbol.includes("shower") ? 63 : 1;
      hours.push({
        hour: Number(read("hour")),
        temp: entry.data?.instant?.details?.air_temperature ?? 0,
        rain,
        code,
        wind: (entry.data?.instant?.details?.wind_speed ?? 0) * 3.6,
        uv: entry.data?.instant?.details?.ultraviolet_index_clear_sky ?? 0,
      });
    }
    if (!hours.length) return { weather: null, hours: [] };
    return { weather: readWeather(date, hours), hours };
  } catch {
    return { weather: null, hours: [] };
  }
}

async function fromMeals(origin: { lat: number; lng: number }, radius: number): Promise<FamilyPlace[]> {
  const key = `${origin.lat.toFixed(2)},${origin.lng.toFixed(2)}:${radius}`;
  const cached = familyMealCache.get(key);
  if (cached) return cached;
  const hits = await loadFamilyMeals(origin, radius);
  if (hits.length) familyMealCache.set(key, hits);
  return hits;
}

async function loadFamilyMeals(origin: { lat: number; lng: number }, radius: number): Promise<FamilyPlace[]> {
  const dLat = radius / 111320;
  const dLng = radius / (111320 * Math.cos((origin.lat * Math.PI) / 180));
  const box = `${origin.lat - dLat},${origin.lng - dLng},${origin.lat + dLat},${origin.lng + dLng}`;
  const query = `[out:json][timeout:12];(node["amenity"~"^(restaurant|cafe|fast_food)$"]["name"](${box});way["amenity"~"^(restaurant|cafe|fast_food)$"]["name"](${box}););out center 30;`;
  for (const host of OVERPASS) {
    try {
      noteCall("discovery", "overpass-family");
      const res = await fetch(host, {
        method: "POST",
        headers: { "Content-Type": "text/plain", "User-Agent": "Kairos/1.0 (family meals)" },
        body: query,
        signal: AbortSignal.timeout(14000),
      });
      if (!res.ok) continue;
      const body = (await res.json()) as {
        elements?: { type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[];
      };
      const hits: FamilyPlace[] = [];
      for (const element of body.elements ?? []) {
        const tags = element.tags ?? {};
        const name = (tags.name ?? "").replace(/\s+/g, " ").trim();
        const lat = element.lat ?? element.center?.lat;
        const lng = element.lon ?? element.center?.lon;
        if (name.length < 2 || lat == null || lng == null) continue;
        const street = [tags["addr:housenumber"], tags["addr:street"], tags["addr:postcode"]].filter(Boolean).join(" ");
        const meters = distanceMeters(origin.lat, origin.lng, lat, lng);
        hits.push({
          id: `meal-${element.type}-${element.id}`,
          name: name.slice(0, 80),
          address: (street || "Singapore").slice(0, 120),
          lat,
          lng,
          setting: "indoor",
          interests: ["food"],
          free: false,
          approxSgd: 0,
          toddler: true,
          stroller: true,
          mixedAge: true,
          rainSafe: true,
          meters: Math.round(meters),
          travelMin: travelMinutes(meters),
          source: "meal",
          blurb: "Mapped eatery. The price is not on the map.",
          opening: (tags.opening_hours ?? "").slice(0, 80),
          wheelchair: tags.wheelchair === "yes" ? true : tags.wheelchair === "no" ? false : null,
        });
      }
      return hits;
    } catch {
      // Try the next map host.
    }
  }
  return [];
}

function avoids(place: FamilyPlace, avoid: string[]): boolean {
  const blob = `${place.name} ${place.interests.join(" ")} ${place.blurb}`.toLowerCase();
  if (avoid.includes("museums") && /museum|gallery/.test(blob)) return true;
  if (avoid.includes("water") && place.interests.includes("water")) return true;
  if (avoid.includes("long-walks") && /ridge|hike|trail|southern ridges/.test(blob)) return true;
  if (avoid.includes("high-energy") && /climb|bowl|sport/.test(blob)) return true;
  if (avoid.includes("noisy") && /playground|bowl|climb/.test(blob)) return true;
  return false;
}

async function routeMinutes(kind: "walk" | "drive", from: { lat: number; lng: number }, to: { lat: number; lng: number }): Promise<number | null> {
  const key = `${kind}:${from.lat.toFixed(3)},${from.lng.toFixed(3)};${to.lat.toFixed(3)},${to.lng.toFixed(3)}`;
  const cached = familyRouteCache.get(key);
  if (cached !== undefined) return cached;
  return shareRequest(`family-route:${key}`, () => fetchFamilyRoute(kind, from, to, key));
}

async function fetchFamilyRoute(kind: "walk" | "drive", from: { lat: number; lng: number }, to: { lat: number; lng: number }, key: string): Promise<number | null> {
  const again = familyRouteCache.peek(key);
  if (again !== undefined) return again;
  const path = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url =
    kind === "walk"
      ? `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${path}?overview=false`
      : `https://router.project-osrm.org/route/v1/driving/${path}?overview=false`;
  try {
    noteCall("routing", kind === "walk" ? "osm-foot" : "osrm");
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Kairos/1.0 (family routing)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { routes?: { duration?: number; distance?: number }[] };
    const route = body.routes?.[0];
    if (!route || typeof route.duration !== "number" || typeof route.distance !== "number") return null;
    if (route.duration <= 0 || route.distance <= 0) return null;
    const speed = route.distance / route.duration;
    if (kind === "walk" && (speed < 0.3 || speed > 2.2)) return null;
    if (kind === "drive" && (speed < 1 || speed > 40)) return null;
    const hop = distanceMeters(from.lat, from.lng, to.lat, to.lng);
    const minutes = Math.max(1, Math.round(route.duration / 60));
    if (hop / (minutes * 60) > (kind === "walk" ? 2.2 : 25)) return null;
    familyRouteCache.set(key, minutes);
    return minutes;
  } catch {
    return null;
  }
}

async function takeFirst(
  from: { lat: number; lng: number },
  list: { place: FamilyPlace; score: ReturnType<typeof scoreFamily> }[],
  brief: FamilyBrief,
): Promise<{ place: FamilyPlace; score: ReturnType<typeof scoreFamily>; travelMin: number | null; travelLabel: string } | null> {
  const kind = brief.travelMode === "walk" ? "walk" : "drive";
  for (const item of list) {
    const minutes = await routeMinutes(kind, from, { lat: item.place.lat, lng: item.place.lng });
    if (minutes == null || minutes > brief.maxTravel) continue;
    if (brief.travelMode === "transit") return { ...item, travelMin: null, travelLabel: "Public transport time is not available" };
    const word = brief.travelMode === "walk" ? "walk" : brief.travelMode === "ride" ? "driving route" : "drive";
    return { ...item, travelMin: minutes, travelLabel: `${minutes} min ${word}` };
  }
  return null;
}

function asPlace(pin: LockedPin): FamilyPlace {
  return {
    id: pin.placeId,
    name: pin.title,
    address: pin.address,
    lat: pin.latitude,
    lng: pin.longitude,
    setting: pin.setting === "outdoor" ? "outdoor" : "indoor",
    interests: [],
    free: false,
    approxSgd: 0,
    toddler: true,
    stroller: true,
    mixedAge: true,
    rainSafe: pin.setting !== "outdoor",
    meters: 0,
    travelMin: 0,
    source: "directory",
    blurb: "Kept from the previous plan.",
    opening: "",
    wheelchair: null,
  };
}

async function readBrief(text: string): Promise<Partial<FamilyBrief> | null> {
  if (text.trim().length < 8) return null;
  const key = text.trim().slice(0, 500);
  const cached = familyBriefCache.get(key);
  if (cached) return cached;
  const raw = await geminiJson(
    `${KAIROS_VOICE} Read a family-day request. Return JSON only. Do not invent weather, places, prices, or travel times. interests must be chosen from: ${FAMILY_INTERESTS.join(", ")}. avoid is a short list of phrases they want to skip. pace is relaxed, balanced, packed, or empty. setting is indoor, outdoor, either, mix, or empty. free is true only if they ask for free.`,
    text.slice(0, 500),
    {
      type: "object",
      properties: {
        interests: { type: "array", items: { type: "string" } },
        avoid: { type: "array", items: { type: "string" } },
        setting: { type: "string" },
        pace: { type: "string" },
        free: { type: "boolean" },
      },
    },
    320,
  );
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const interests = Array.isArray(record.interests)
    ? record.interests.filter((item): item is FamilyInterest => FAMILY_INTERESTS.includes(item as FamilyInterest))
    : [];
  const setting = record.setting === "indoor" || record.setting === "outdoor" || record.setting === "either" || record.setting === "mix" ? record.setting : undefined;
  const pace = record.pace === "relaxed" || record.pace === "balanced" || record.pace === "packed" ? record.pace : undefined;
  const avoid = Array.isArray(record.avoid) ? record.avoid.filter((item): item is string => typeof item === "string").map((item) => item.slice(0, 40)).slice(0, 6) : [];
  const parsed: Partial<FamilyBrief> = { interests, setting, pace, avoid, freeOnly: record.free === true ? true : undefined };
  familyBriefCache.set(key, parsed);
  return parsed;
}

function shortlist(
  places: FamilyPlace[],
  brief: FamilyBrief,
  weather: ReturnType<typeof readWeather> | null,
  want: "indoor" | "outdoor" | "any",
  used: Set<string>,
) {
  const wheelchairOn = brief.wheelchair && places.some((place) => place.wheelchair === true);
  return places
    .filter((place) => !brief.rejected.includes(place.id) && !used.has(place.id) && !avoids(place, brief.avoid))
    .filter((place) => (brief.freeOnly || brief.booking === "free" ? place.free : true))
    .filter((place) => (want === "any" ? true : place.setting === want))
    .filter((place) => !brief.stroller || place.stroller || place.source === "meal")
    .filter((place) => !wheelchairOn || place.wheelchair === true)
    .map((place) => ({ place, score: scoreFamily(place, brief, weather) }))
    .sort((a, b) => b.score.total - a.score.total || a.place.meters - b.place.meters)
    .slice(0, 6);
}

export async function searchFamily(brief: FamilyBrief): Promise<{
  weather: ReturnType<typeof readWeather> | null;
  stops: PlannedStop[];
  backup: { title: string; address: string; travelLabel: string; setting: string; placeId: string } | null;
  score: ReturnType<typeof scoreFamily> | null;
  spend: number | null;
  travelTotal: number | null;
  why: string;
  eventsNote: string;
  understood: string[];
  bookingNote: string;
}> {
  const origin = { lat: brief.latitude, lng: brief.longitude };
  const radius = brief.travelMode === "walk" ? Math.min(3500, 500 + brief.maxTravel * 70) : Math.min(8000, 1800 + brief.maxTravel * 100);
  const [mapped, meals, cast, parsed] = await Promise.all([
    fromMap(origin, radius),
    fromMeals(origin, Math.min(radius, 4000)),
    forecast(origin, brief.date),
    readBrief(brief.text),
  ]);
  const next = { ...brief, avoid: brief.longWalk ? [...new Set([...brief.avoid, "long-walks"])] : brief.avoid };
  if (parsed?.interests?.length && !brief.interests.length) next.interests = parsed.interests;
  if (parsed?.avoid?.length) next.avoid = [...new Set([...brief.avoid, ...parsed.avoid])];
  if (parsed?.setting && brief.setting === "either") next.setting = parsed.setting;
  if (parsed?.pace && brief.text.trim().length > 8) next.pace = parsed.pace;
  if (parsed?.freeOnly) next.freeOnly = true;
  const weather = cast.weather;
  const places = [...mapped, ...fromDirectory(origin)];
  const used = new Set<string>();
  const lockedActivities = next.locked.filter((pin) => pin.kind === "activity").map(asPlace);
  const lockedLunch = next.locked.find((pin) => pin.kind === "lunch");
  const lockedDinner = next.locked.find((pin) => pin.kind === "dinner");
  const people = next.adults + next.ages.length;

  const want = (part: "morning" | "afternoon", morningSetting: "indoor" | "outdoor" | null): "indoor" | "outdoor" | "any" => {
    if (next.rainSafe || next.setting === "indoor") return "indoor";
    const ok = part === "morning" ? weather?.morningOutdoor : weather?.afternoonOutdoor;
    if (next.setting === "outdoor") return ok ? "outdoor" : "indoor";
    if (part === "afternoon" && next.setting === "mix" && morningSetting === "outdoor") return ok ? "any" : "indoor";
    if (part === "afternoon" && next.setting === "mix" && morningSetting === "indoor") return ok ? "outdoor" : "indoor";
    return ok ? "outdoor" : "indoor";
  };

  let here = origin;
  const legs: DayLeg[] = [];
  const activityScores: ReturnType<typeof scoreFamily>[] = [];
  const activityCount = next.span === "short" ? 1 : next.span === "half" && next.pace === "relaxed" ? 1 : next.pace === "packed" && next.span === "full" ? 3 : 2;
  let morningSetting: "indoor" | "outdoor" | null = null;

  for (let index = 0; index < activityCount; index += 1) {
    const part = index === 0 ? "morning" : "afternoon";
    const preferred = index < lockedActivities.length ? lockedActivities[index] : null;
    const pool = preferred
      ? [{ place: preferred, score: scoreFamily(preferred, next, weather) }]
      : shortlist(places, next, weather, want(part, morningSetting), used);
    const picked = await takeFirst(here, pool, next);
    if (!picked) continue;
    if (!morningSetting) morningSetting = picked.place.setting;
    used.add(picked.place.id);
    activityScores.push(picked.score);
    const perPerson = picked.place.source === "directory" && picked.place.approxSgd > 0 ? picked.place.approxSgd : null;
    legs.push({
      kind: "activity",
      title: picked.place.name,
      address: picked.place.address,
      latitude: picked.place.lat,
      longitude: picked.place.lng,
      setting: picked.place.setting,
      travelMin: picked.travelMin,
      travelLabel: picked.travelLabel,
      duration: index === 2 ? 60 : next.pace === "relaxed" ? 150 : next.pace === "packed" ? 90 : 120,
      cost: perPerson,
      ages: picked.score.lines[0] ?? "Fits the ages you entered",
      why: picked.score.lines.join(". "),
      placeId: picked.place.id,
      opening: picked.place.opening,
    });
    here = { lat: picked.place.lat, lng: picked.place.lng };
    if (index === 1 && next.span === "full") {
      legs.push({
        kind: "snack",
        title: "Snack / downtime",
        address: "",
        latitude: here.lat,
        longitude: here.lng,
        setting: "",
        travelMin: null,
        travelLabel: "",
        duration: next.pace === "packed" ? 15 : 25,
        cost: null,
        ages: "",
        why: "A pause. Kairos did not invent a snack shop.",
        placeId: "",
        opening: "",
      });
    }
    const mealKind = index === 0 ? "lunch" : "dinner";
    const needMeal = next.span === "full" || (next.span === "half" && mealKind === "lunch");
    if (!needMeal) continue;
    if (mealKind === "dinner" && next.endMin < 17 * 60) continue;
    const lockedMeal = mealKind === "lunch" ? lockedLunch : lockedDinner;
    const nearbyMeals = meals
      .map((place) => ({ ...place, meters: Math.round(distanceMeters(here.lat, here.lng, place.lat, place.lng)) }))
      .filter((place) => place.meters <= 2500)
      .sort((a, b) => a.meters - b.meters);
    const freshMeals = nearbyMeals.length ? nearbyMeals : await fromMeals(here, 1800);
    const mealPool = lockedMeal
      ? [{ place: asPlace(lockedMeal), score: scoreFamily(asPlace(lockedMeal), next, weather) }]
      : shortlist(freshMeals, next, weather, "any", used);
    const meal = await takeFirst(here, mealPool, next);
    if (!meal) continue;
    used.add(meal.place.id);
    legs.push({
      kind: mealKind,
      title: meal.place.name,
      address: meal.place.address,
      latitude: meal.place.lat,
      longitude: meal.place.lng,
      setting: "indoor",
      travelMin: meal.travelMin,
      travelLabel: meal.travelLabel,
      duration: next.pace === "relaxed" ? 70 : next.pace === "packed" ? 45 : 55,
      cost: null,
      ages: "",
      why: "A mapped place to eat. The price is not on the map.",
      placeId: meal.place.id,
      opening: meal.place.opening,
    });
    here = { lat: meal.place.lat, lng: meal.place.lng };
    if (mealKind === "lunch" && next.span !== "short" && next.napStart == null) {
      legs.push({
        kind: "rest",
        title: next.napStart != null ? "Nap / rest" : "Rest / travel buffer",
        address: "",
        latitude: here.lat,
        longitude: here.lng,
        setting: "",
        travelMin: null,
        travelLabel: "",
        duration: next.pace === "relaxed" ? 40 : next.pace === "packed" ? 15 : 30,
        cost: null,
        ages: "",
        why: "Breathing room. Nothing is booked.",
        placeId: "",
        opening: "",
      });
    }
  }

  const lastMoved = [...legs].reverse().find((leg) => leg.latitude && (leg.kind === "activity" || leg.kind === "lunch" || leg.kind === "dinner"));
  const backFrom = lastMoved ? { lat: lastMoved.latitude, lng: lastMoved.longitude } : here;
  const back = await routeMinutes(next.travelMode === "walk" ? "walk" : "drive", backFrom, { lat: next.endLatitude, lng: next.endLongitude });
  const returnLabel =
    back == null
      ? "Route unavailable"
      : next.travelMode === "transit"
        ? "Public transport time is not available"
        : `${back} min ${next.travelMode === "walk" ? "walk" : next.travelMode === "ride" ? "driving route" : "drive"}`;
  const stops = stampDay({
    start: { title: next.location, address: next.startAddress, latitude: next.latitude, longitude: next.longitude },
    end: { title: next.endLabel, address: next.endAddress, latitude: next.endLatitude, longitude: next.endLongitude },
    startMin: next.startMin,
    endMin: next.endMin,
    pace: next.pace,
    nap: next.napStart != null && next.napEnd != null ? { start: next.napStart, end: next.napEnd } : null,
    legs,
    returnTravelMin: next.travelMode === "transit" ? null : back,
    returnTravelLabel: returnLabel,
  });

  const indoor = shortlist(
    places.filter((place) => place.setting === "indoor"),
    next,
    weather,
    "indoor",
    used,
  );
  const backupPick = indoor[0] ? await takeFirst(origin, indoor.slice(0, 3), next) : null;
  const backup = backupPick
    ? {
        title: backupPick.place.name,
        address: backupPick.place.address,
        travelLabel: backupPick.travelLabel,
        setting: backupPick.place.setting,
        placeId: backupPick.place.id,
      }
    : null;

  const score = activityScores.length
    ? activityScores.reduce(
        (sum, item) => ({
          total: sum.total + item.total,
          age: sum.age + item.age,
          interest: sum.interest + item.interest,
          weather: sum.weather + item.weather,
          practical: sum.practical + item.practical,
          value: sum.value + item.value,
          timing: sum.timing + item.timing,
          lines: sum.lines,
        }),
        { total: 0, age: 0, interest: 0, weather: 0, practical: 0, value: 0, timing: 0, lines: activityScores[0]?.lines ?? [] },
      )
    : null;
  const count = activityScores.length || 1;
  const averaged = score
    ? {
        total: Math.round(score.total / count),
        age: Math.round(score.age / count),
        interest: Math.round(score.interest / count),
        weather: Math.round(score.weather / count),
        practical: Math.round(score.practical / count),
        value: Math.round(score.value / count),
        timing: Math.round(score.timing / count),
        lines: score.lines,
      }
    : null;
  const known = stops.filter((stop) => typeof stop.cost === "number").reduce((sum, stop) => sum + (stop.cost ?? 0), 0);
  const spend = known > 0 ? known * people : null;
  const travelTotal = stops.reduce((sum, stop) => sum + (stop.travelMin ?? 0), 0);
  const fallback = !weather
    ? "The day is planned from the places we could actually route."
    : !weather.afternoonOutdoor
      ? "The sky has other plans. Outdoor first, then somewhere indoors."
      : next.ages.length > 1
        ? "Two ages, one afternoon. I kept the walking short."
        : "Outdoor first, air-con later. Singapore weather has been consulted.";
  let why = fallback;
  const voiceFacts = JSON.stringify({
    ages: next.ages,
    rerolled: next.rejected.length > 0,
    weather: weather
      ? { morningOutdoor: weather.morningOutdoor, afternoonOutdoor: weather.afternoonOutdoor, rainRisk: weather.rainRisk }
      : null,
    stops: stops.filter((stop) => stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner").map((stop) => stop.title),
  });
  const spoken = familyVoiceCache.get(voiceFacts);
  if (spoken) why = spoken;
  else if (stops.some((stop) => stop.kind === "activity")) {
    const raw = await geminiJson(
      `${KAIROS_VOICE} Write one practical, lightly cheeky sentence for parents. Maximum 20 words. Use only the JSON. Do not invent places, prices, weather, or travel times. No baby talk.`,
      voiceFacts,
      { type: "object", properties: { why: { type: "string" } } },
      80,
    );
    if (raw && typeof raw === "object" && typeof (raw as { why?: string }).why === "string") {
      why = clipVoice((raw as { why: string }).why) || fallback;
      if (why !== fallback) familyVoiceCache.set(voiceFacts, why);
    }
  }
  return {
    weather,
    stops,
    backup,
    score: averaged,
    spend,
    travelTotal: travelTotal > 0 ? travelTotal : null,
    why,
    eventsNote: "No dated event feed is connected. This plan uses permanent places only.",
    understood: [
      next.ages.length ? `Ages ${next.ages.join(", ")}` : `${next.adults} adults`,
      weather ? `${weather.morningOutdoor ? "Outdoor morning" : "Indoor morning"} · ${weather.afternoonOutdoor ? "outdoor afternoon" : "indoor afternoon"}` : "Weather unavailable",
      next.interests.length ? next.interests.join(", ") : "Open interests",
      `${next.span === "short" ? "2–3 hours" : next.span === "half" ? "Half day" : "Full day"} · ${next.pace}`,
      `Start ${next.location}`,
    ],
    bookingNote: next.booking === "nobook" ? "Booking status is not verified." : "",
  };
}
