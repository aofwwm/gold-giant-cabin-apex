import "@tanstack/react-start/server-only";

import { chooseHotelHit, type HotelHit } from "@/lib/hotel-bases";
import { distanceMeters } from "@/lib/coord";
import { RequestGate, shareRequest, TtlCache } from "@/lib/travel-cache";
import { noteCall, noteFailure } from "@/lib/provider-usage";
import { readWeather, type WeatherHour } from "@/lib/family";
import {
  categoryFromTags,
  forecastLocal,
  type DiscoveredPlace,
} from "@/lib/travel-model";
import { rankTravelDestinations, travelDestinationFromPhoton, type TravelDestination, type TravelMove } from "@/lib/travel";
import { destinationLanguages, englishAreaName, hasNonLatin, localNameFits, tidyLocalLabel } from "@/lib/travel-names";
import { inferCountry } from "@/lib/travel-routing";
import { discoveryBox, type GeoBox } from "@/lib/travel-knowledge";
import { verifiedWebsite } from "@/lib/travel-links";
import { commonsCategoryTitle, commonsFileTitle, parseWikipedia } from "@/lib/travel-photo";

const photonCache = new TtlCache<TravelDestination[]>(24 * 60 * 60 * 1000, 200, "geocode");
const placeCache = new TtlCache<PlaceDiscovery>(12 * 60 * 60 * 1000, 200, "discovery");
const matrixCache = new TtlCache<MinuteMatrix>(6 * 60 * 60 * 1000, 200, "routing");
const routeCache = new TtlCache<DayRoute>(6 * 60 * 60 * 1000, 200, "routing");
const weatherCache = new TtlCache<DaySky[]>(3 * 60 * 60 * 1000, 200, "weather");

const photonGate = new RequestGate(4, 10_000);
const nominatimGate = new RequestGate(1, 1_100);
const overpassGate = new RequestGate(2, 4_000);
const routeGate = new RequestGate(8, 10_000);
const weatherGate = new RequestGate(2, 10_000);

const OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.openstreetmap.fr/api/interpreter"];
const UA = "Kairos/1.0 (travel; contact: local)";

export type MinuteMatrix = { minutes: (number | null)[][]; meters: (number | null)[][] };
export type DaySky = { date: string; outdoorOk: boolean | null; summary: string };
export type DayRoute = { minutes: (number | null)[]; meters: (number | null)[]; line: [number, number][] | null; source: "osrm" | "estimate" };

function keyOf(points: { lat: number; lng: number }[]): string {
  return points.map((point) => `${point.lat.toFixed(3)},${point.lng.toFixed(3)}`).join(";");
}

async function photon(query: string): Promise<TravelDestination[]> {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "12");
  url.searchParams.set("lang", "en");
  for (const layer of ["country", "state", "city", "county", "locality"]) url.searchParams.append("layer", layer);
  noteCall("geocode", "photon");
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) {
    noteFailure("geocode", "photon", `HTTP ${res.status}`);
    return [];
  }
  const body = (await res.json()) as {
    features?: { geometry?: { coordinates?: number[] }; properties?: { name?: string; country?: string; countrycode?: string; state?: string; county?: string; osm_key?: string; osm_value?: string; osm_type?: string; osm_id?: number } }[];
  };
  const hits: TravelDestination[] = [];
  for (const feature of body.features ?? []) {
    const [lng, lat] = feature.geometry?.coordinates ?? [];
    const hit = travelDestinationFromPhoton(feature.properties ?? {}, lat, lng);
    if (hit) hits.push(hit);
  }
  return rankTravelDestinations(query, hits);
}

async function nominatim(query: string): Promise<TravelDestination[]> {
  if (!nominatimGate.allow()) return [];
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "en");
  noteCall("geocode", "nominatim");
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) {
    noteFailure("geocode", "nominatim", `HTTP ${res.status}`);
    return [];
  }
  const body = (await res.json()) as { display_name?: string; lat?: string; lon?: string; type?: string; addresstype?: string; osm_type?: string; osm_id?: number; address?: { country?: string; country_code?: string } }[];
  const hits: TravelDestination[] = [];
  for (const row of body) {
    const lat = Number(row.lat);
    const lng = Number(row.lon);
    const kind = row.addresstype || row.type || "";
    const mapped = kind === "country" ? "country" : kind === "state" || kind === "region" ? "region" : kind === "island" ? "island" : "city";
    const rawName = row.display_name?.split(",")[0]?.trim() || query;
    const named = englishAreaName(rawName, query);
    const fake = travelDestinationFromPhoton({
      name: named === "this area" ? rawName : named,
      country: row.address?.country || "",
      countrycode: row.address?.country_code || "",
      osm_key: "place",
      osm_value: mapped === "country" ? "country" : mapped === "region" ? "state" : mapped === "island" ? "island" : "city",
      osm_type: row.osm_type,
      osm_id: row.osm_id,
      boundingbox: (row as { boundingbox?: string[] }).boundingbox,
    }, lat, lng);
    if (fake) hits.push(fake);
  }
  return rankTravelDestinations(query, hits);
}

export async function searchTravelDestinations(query: string): Promise<TravelDestination[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const cacheKey = q.toLowerCase();
  const cached = photonCache.get(cacheKey);
  if (cached) return cached;
  return shareRequest(`geo:${cacheKey}`, async () => {
    const again = photonCache.peek(cacheKey);
    if (again) return again;
    let hits: TravelDestination[] = [];
    if (photonGate.allow()) hits = await photon(q).catch(() => []);
    if (!hits.length) hits = await nominatim(q).catch(() => []);
    photonCache.set(cacheKey, hits);
    return hits;
  });
}

/** Resolves a hotel the traveller already booked. Requires coordinates. Never uses the name alone. */
export async function locateHotel(query: string, near: { lat: number; lng: number }[]): Promise<HotelHit | null> {
  const q = query.trim();
  const centre = near.find((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
  if (q.length < 2 || !centre || !nominatimGate.allow()) return null;
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("viewbox", `${centre.lng - 0.8},${centre.lat + 0.6},${centre.lng + 0.8},${centre.lat - 0.6}`);
  noteCall("geocode", "nominatim");
  try {
    const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      noteFailure("geocode", "nominatim", `HTTP ${res.status}`);
      return null;
    }
    const body = (await res.json()) as { display_name?: string; lat?: string; lon?: string; osm_type?: string; osm_id?: number; name?: string }[];
    const hits: HotelHit[] = [];
    for (const row of body) {
      const lat = Number(row.lat);
      const lng = Number(row.lon);
      const name = (row.name || row.display_name?.split(",")[0] || "").trim();
      if (!name || !Number.isFinite(lat) || !Number.isFinite(lng) || row.osm_id == null) continue;
      const kind = row.osm_type === "way" || row.osm_type === "relation" || row.osm_type === "node" ? row.osm_type : "node";
      hits.push({
        name: name.slice(0, 80),
        lat,
        lng,
        address: (row.display_name || name).slice(0, 160),
        provider: "osm",
        providerId: `osm:${kind}:${row.osm_id}`,
      });
    }
    return chooseHotelHit(hits, near, q);
  } catch {
    noteFailure("geocode", "nominatim", "Hotel lookup failed.");
    return null;
  }
}

export type PlaceDiscovery = {
  places: DiscoveredPlace[];
  status: "ok" | "empty" | "failed";
  hotels: "ok" | "empty" | "failed";
  error: string;
  rawCount: number;
  parsedCount: number;
};

function overpassQuery(area: { latitude: number; longitude: number; bbox?: [number, number, number, number] }, box: GeoBox): string {
  const { latitude: lat, longitude: lng } = area;
  const inner = `${box.south},${box.west},${box.north},${box.east}`;
  return `[out:json][timeout:18];
(
  node["name"]["tourism"~"^(hotel|guest_house|hostel)$"](around:4200,${lat},${lng});
  way["name"]["tourism"~"^(hotel|guest_house|hostel)$"](around:4200,${lat},${lng});
);
out center 24;
(
  relation["name"]["tourism"~"^(attraction|museum|gallery|viewpoint|zoo|aquarium|theme_park)$"](${inner});
);
out center 18;
(
  way["name"]["tourism"~"^(museum|gallery|viewpoint|zoo|aquarium|theme_park)$"](${inner});
  way["name"]["tourism"="attraction"]["wikidata"](${inner});
  way["name"]["historic"~"^(monument|church|cathedral|monastery|palace|castle|shrine|temple)$"]["wikidata"](${inner});
  way["name"]["leisure"="park"]["wikidata"](${inner});
  relation["name"]["historic"~"^(shrine|temple|castle|palace)$"](${inner});
);
out center 36;
(
  node["name"]["amenity"~"^(restaurant|cafe|marketplace)$"](around:900,${lat},${lng});
);
out center 8;`;
}

function osmLocalName(tags: Record<string, string>, country: string, name: string, nameEn: string): string {
  for (const lang of destinationLanguages(country)) {
    if (lang === "en") continue;
    const value = tidyLocalLabel(tags[`name:${lang}`] || tags[`name:${lang}-Hans`] || tags[`name:${lang}-Hant`] || "");
    if (value && (!country || localNameFits(value, country)) && value.toLowerCase() !== nameEn.toLowerCase()) return value;
  }
  const local = tidyLocalLabel(name);
  if (!local || (nameEn && local.toLowerCase() === nameEn.toLowerCase())) return "";
  if (country && !localNameFits(local, country)) return "";
  return local;
}

export async function discoverPlaces(area: { name: string; latitude: number; longitude: number; countryCode?: string; bbox?: [number, number, number, number] }): Promise<PlaceDiscovery> {
  const region = discoveryBox(area);
  const country = (area.countryCode || inferCountry(area.latitude, area.longitude) || "").toUpperCase();
  const cacheKey = `v9:${country}:${region.south.toFixed(2)},${region.west.toFixed(2)},${region.north.toFixed(2)},${region.east.toFixed(2)}`;
  const cached = placeCache.get(cacheKey);
  if (cached) return { ...cached, places: cached.places.map((spot) => ({ ...spot, area: area.name })) };
  return shareRequest(`places:${cacheKey}`, async () => {
    const again = placeCache.peek(cacheKey);
    if (again) return { ...again, places: again.places.map((spot) => ({ ...spot, area: area.name })) };
    const query = overpassQuery(area, region);
    let lastError = "OpenStreetMap did not answer.";
    for (const host of OVERPASS) {
      if (!overpassGate.allow()) {
        lastError = "OpenStreetMap rate limit.";
        break;
      }
      try {
        noteCall("discovery", "overpass");
        const res = await fetch(host, {
          method: "POST",
          headers: { "Content-Type": "text/plain", "User-Agent": UA },
          body: query,
          signal: AbortSignal.timeout(20000),
        });
        if (res.status === 429 || res.status === 504 || res.status === 502) {
          lastError = `OpenStreetMap HTTP ${res.status}.`;
          continue;
        }
        if (!res.ok) {
          lastError = `OpenStreetMap HTTP ${res.status}.`;
          continue;
        }
        const body = (await res.json()) as {
          remark?: string;
          elements?: { type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[];
        };
        const elements = body.elements ?? [];
        if (body.remark && /error|timeout|runtime/i.test(body.remark) && !elements.length) {
          lastError = body.remark.slice(0, 180);
          continue;
        }
        const seen = new Set<string>();
        const spots: DiscoveredPlace[] = [];
        for (const element of elements) {
          const tags = element.tags ?? {};
          const mapped = categoryFromTags(tags);
          const name = (tags.name || tags["name:en"] || tags["name:ja"] || tags["name:zh"] || tags["name:ko"] || tags["name:th"] || "").replace(/\s+/g, " ").trim();
          const lat = element.lat ?? element.center?.lat;
          const lng = element.lon ?? element.center?.lon;
          if (!mapped || name.length < 2 || lat == null || lng == null) continue;
          const id = `osm:${element.type}:${element.id}`;
          const nameKey = name.toLowerCase();
          if (seen.has(nameKey) && mapped.category !== "stay") continue;
          if (mapped.category !== "stay") seen.add(nameKey);
          const house = tags["addr:housenumber"] || "";
          const street = tags["addr:street"] || "";
          const city = tags["addr:city"] || "";
          const streetEn = tags["addr:street:en"] || "";
          const cityEn = tags["addr:city:en"] || "";
          const address = [house, street, city].filter(Boolean).join(" ");
          const addressEn = [house, streetEn, cityEn].filter(Boolean).join(" ");
          const nameEn = (tags["name:en"] || tags["official_name:en"] || tags.int_name || "").replace(/\s+/g, " ").trim();
          const nameLatin = (tags["name:latin"] || tags["name:ja-Latn"] || tags["name:zh-Latn"] || tags["name:ko-Latn"] || tags["name:th-Latn"] || "").replace(/\s+/g, " ").trim();
          const nameLocal = osmLocalName(tags, country, name, nameEn);
          const wikidataId = /^Q\d+$/.test(tags.wikidata || "") ? tags.wikidata : "";
          const commonsRaw = tags.wikimedia_commons || "";
          const imageTag = tags.image || "";
          const imageFile = commonsFileTitle(imageTag);
          const commonsFile = /^category:/i.test(commonsRaw)
            ? imageFile
            : commonsFileTitle(commonsRaw.startsWith("http") || /^(file|fichier|category):/i.test(commonsRaw) ? commonsRaw : commonsRaw ? `File:${commonsRaw}` : "") || imageFile;
          const commonsCategory = /^category:/i.test(commonsRaw) ? commonsCategoryTitle(commonsRaw) : "";
          const wikipedia = parseWikipedia(tags.wikipedia || (tags["wikipedia:en"] ? `en:${tags["wikipedia:en"]}` : "")) ? (tags.wikipedia || `en:${tags["wikipedia:en"]}`) : "";
          const mapillaryId = (tags.mapillary || "").trim().slice(0, 80);
          const panoramaxId = (tags.panoramax || tags["panoramax:id"] || "").trim().slice(0, 80);
          const website = verifiedWebsite(tags.website || tags["contact:website"] || "");
          const regionName = (tags["addr:province:en"] || tags["addr:state:en"] || tags["addr:province"] || tags["addr:state"] || "").replace(/\s+/g, " ").trim().slice(0, 40);
          const locality = (tags["addr:city:en"] || tags["addr:city"] || "").replace(/\s+/g, " ").trim().slice(0, 40);
          spots.push({
            id,
            provider: "osm",
            providerId: id,
            name: name.slice(0, 80),
            category: mapped.category,
            address: (address || area.name).slice(0, 140),
            lat,
            lng,
            indoor: mapped.indoor,
            area: area.name,
            opening: (tags.opening_hours ?? "").slice(0, 240),
            nameEn: nameEn.slice(0, 80),
            nameLatin: nameLatin && nameLatin !== nameEn ? nameLatin.slice(0, 80) : "",
            nameLocal: nameLocal.slice(0, 80),
            localName: nameLocal.slice(0, 80),
            addressLocal: hasNonLatin(address) ? address.slice(0, 140) : "",
            addressDisplay: addressEn && !hasNonLatin(addressEn) ? addressEn.slice(0, 140) : "",
            wikidataId,
            commonsFile,
            commonsCategory,
            wikipedia,
            mapillaryId,
            panoramaxId,
            website,
            region: regionName,
            locality,
            hotel: mapped.category === "stay" ? {
              airConditioning: tags.air_conditioning === "yes" ? "yes" : tags.air_conditioning === "no" ? "no" : "unknown",
              stars: (tags.stars ?? "").slice(0, 12),
              internet: (tags.internet_access ?? "").slice(0, 40),
              breakfast: (tags.breakfast ?? "").slice(0, 40),
              parking: (tags.parking ?? "").slice(0, 40),
              wheelchair: (tags.wheelchair ?? "").slice(0, 40),
              roomSize: (tags["room:size"] || tags.room_size || "").slice(0, 24),
              kind: (tags.tourism ?? "").slice(0, 40),
            } : undefined,
            localNameSource: nameLocal ? "osm_destination_language" : "",
            sourceNote: "OpenStreetMap",
          });
        }
        const stays = new Map<string, DiscoveredPlace>();
        const rest: DiscoveredPlace[] = [];
        for (const spot of spots) {
          if (spot.category !== "stay") {
            rest.push(spot);
            continue;
          }
          const key = spot.name.toLowerCase();
          const previous = stays.get(key);
          if (!previous || distanceMeters(area.latitude, area.longitude, spot.lat, spot.lng) < distanceMeters(area.latitude, area.longitude, previous.lat, previous.lng)) {
            stays.set(key, spot);
          }
        }
        const places = [...stays.values(), ...rest];
        const hotels = places.some((spot) => spot.category === "stay") ? "ok" : "empty";
        const status = places.length ? "ok" : "empty";
        const result: PlaceDiscovery = {
          places,
          status,
          hotels,
          error: places.length ? "" : "OpenStreetMap returned no named places in this area.",
          rawCount: elements.length,
          parsedCount: places.length,
        };
        if (places.length) placeCache.set(cacheKey, result);
        return { ...result, places: places.map((spot) => ({ ...spot, area: area.name })) };
      } catch (error) {
        lastError = error instanceof Error ? error.name === "TimeoutError" ? "OpenStreetMap timed out." : error.message : "OpenStreetMap request failed.";
      }
    }
    noteFailure("discovery", "overpass", lastError);
    return { places: [], status: "failed", hotels: "failed", error: lastError, rawCount: 0, parsedCount: 0 };
  });
}

function profile(move: TravelMove): { host: string; name: string } {
  if (move === "walk") return { host: "https://routing.openstreetmap.de/routed-foot", name: "foot" };
  return { host: "https://router.project-osrm.org", name: "driving" };
}

export async function travelMatrix(move: TravelMove, points: { lat: number; lng: number }[]): Promise<MinuteMatrix | null> {
  if (points.length < 2) return null;
  const limited = points.slice(0, 28);
  const cacheKey = `${move}:${keyOf(limited)}`;
  const cached = matrixCache.get(cacheKey);
  if (cached) return cached;
  return shareRequest(`matrix:${cacheKey}`, async () => {
    const again = matrixCache.peek(cacheKey);
    if (again) return again;
    const routed = profile(move === "transit" ? "drive" : move);
    if (!routeGate.allow()) return null;
    try {
      const path = limited.map((point) => `${point.lng},${point.lat}`).join(";");
      noteCall("routing", "osrm-matrix");
      const res = await fetch(`${routed.host}/table/v1/${routed.name}/${path}?annotations=duration,distance`, {
        headers: { Accept: "application/json", "User-Agent": UA },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) {
        noteFailure("routing", "osrm-matrix", `HTTP ${res.status}`);
        return null;
      }
      const body = (await res.json()) as { durations?: (number | null)[][]; distances?: (number | null)[][] };
      const minutes = (body.durations ?? []).map((row) => row.map((value) => (typeof value === "number" && value >= 0 ? Math.max(1, Math.round(value / 60)) : null)));
      const meters = (body.distances ?? []).map((row) => row.map((value) => (typeof value === "number" && value >= 0 ? Math.round(value) : null)));
      if (!minutes.length) return null;
      const matrix = { minutes, meters };
      matrixCache.set(cacheKey, matrix);
      return matrix;
    } catch {
      return null;
    }
  });
}

export async function travelRoute(move: TravelMove, points: { lat: number; lng: number }[]): Promise<DayRoute> {
  const empty: DayRoute = { minutes: [], meters: [], line: null, source: "estimate" };
  if (points.length < 2) return empty;
  const cacheKey = `${move}:${keyOf(points)}`;
  const cached = routeCache.get(cacheKey);
  if (cached) return cached;
  return shareRequest(`route:${cacheKey}`, async () => {
    const again = routeCache.peek(cacheKey);
    if (again) return again;
    const routed = profile(move === "transit" ? "drive" : move);
    if (!routeGate.allow()) return empty;
    try {
      const path = points.map((point) => `${point.lng},${point.lat}`).join(";");
      noteCall("routing", "osrm-route");
      const res = await fetch(`${routed.host}/route/v1/${routed.name}/${path}?overview=full&geometries=geojson&steps=false`, {
        headers: { Accept: "application/json", "User-Agent": UA },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) {
        noteFailure("routing", "osrm-route", `HTTP ${res.status}`);
        return empty;
      }
      const body = (await res.json()) as {
        routes?: { geometry?: { coordinates?: [number, number][] }; legs?: { duration?: number; distance?: number }[] }[];
      };
      const route = body.routes?.[0];
      if (!route?.legs?.length) return empty;
      const result: DayRoute = {
        minutes: route.legs.map((leg) => (typeof leg.duration === "number" ? Math.max(1, Math.round(leg.duration / 60)) : null)),
        meters: route.legs.map((leg) => (typeof leg.distance === "number" ? Math.round(leg.distance) : null)),
        line: route.geometry?.coordinates?.length ? route.geometry.coordinates : null,
        source: "osrm",
      };
      routeCache.set(cacheKey, result);
      return result;
    } catch {
      return empty;
    }
  });
}

export async function travelWeather(origin: { lat: number; lng: number }, dates: string[]): Promise<DaySky[]> {
  const cacheKey = `${origin.lat.toFixed(2)},${origin.lng.toFixed(2)}:${dates[0] ?? ""}:${dates.length}`;
  const cached = weatherCache.get(cacheKey);
  if (cached) return cached;
  return shareRequest(`weather:${cacheKey}`, async () => {
    const again = weatherCache.peek(cacheKey);
    if (again) return again;
    const missed = dates.map((date) => ({ date, outdoorOk: null as boolean | null, summary: "Weather did not answer." }));
    if (!weatherGate.allow()) return missed;
    try {
      const url = new URL("https://api.met.no/weatherapi/locationforecast/2.0/complete");
      url.searchParams.set("lat", origin.lat.toFixed(4));
      url.searchParams.set("lon", origin.lng.toFixed(4));
      noteCall("weather", "met-no");
      const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
      if (res.status === 429 || !res.ok) {
        noteFailure("weather", "met-no", `HTTP ${res.status}`);
        return missed;
      }
      const body = (await res.json()) as {
        properties?: { timeseries?: { time: string; data?: { instant?: { details?: { air_temperature?: number; wind_speed?: number; ultraviolet_index_clear_sky?: number } }; next_1_hours?: { summary?: { symbol_code?: string }; details?: { probability_of_precipitation?: number } }; next_6_hours?: { summary?: { symbol_code?: string }; details?: { probability_of_precipitation?: number } } } }[] };
      };
      const wanted = new Set(dates);
      const grouped = new Map<string, WeatherHour[]>();
      for (const entry of body.properties?.timeseries ?? []) {
        const local = forecastLocal(entry.time, origin.lng);
        if (!wanted.has(local.date)) continue;
        const slot = entry.data?.next_1_hours ?? entry.data?.next_6_hours;
        const symbol = slot?.summary?.symbol_code ?? "";
        const given = slot?.details?.probability_of_precipitation;
        const hours = grouped.get(local.date) ?? [];
        hours.push({
          hour: local.hour,
          temp: entry.data?.instant?.details?.air_temperature ?? 0,
          rain: typeof given === "number" ? given : symbol.includes("rain") || symbol.includes("thunder") ? 70 : 15,
          code: symbol.includes("thunder") ? 95 : symbol.includes("rain") ? 63 : 1,
          wind: (entry.data?.instant?.details?.wind_speed ?? 0) * 3.6,
          uv: entry.data?.instant?.details?.ultraviolet_index_clear_sky ?? 0,
        });
        grouped.set(local.date, hours);
      }
      const skies = dates.map((date) => {
        const hours = grouped.get(date) ?? [];
        if (!hours.length) return { date, outdoorOk: null, summary: "No forecast for this day yet." };
        const day = readWeather(date, hours);
        return { date, outdoorOk: day.outdoorOk, summary: day.summary };
      });
      weatherCache.set(cacheKey, skies);
      return skies;
    } catch {
      return missed;
    }
  });
}

export async function noEvents(): Promise<[]> {
  return [];
}
