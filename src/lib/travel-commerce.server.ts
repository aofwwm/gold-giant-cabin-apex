import { distanceMeters } from "@/lib/coord";
import { env } from "@/lib/env.server";
import { RequestGate, TtlCache } from "@/lib/travel-cache";
import type { DiscoveredPlace } from "@/lib/travel-model";
import {
  commercialNameMatch,
  isPermittedPhotoUrl,
  type CommercialProfile,
  type PlacePhoto,
} from "@/lib/travel-photo";

const yelpCache = new TtlCache<YelpOutcome>(24 * 60 * 60 * 1000, 200, "photo");
const streetCache = new TtlCache<PlacePhoto | null>(7 * 24 * 60 * 60 * 1000, 200, "photo");
const yelpGate = new RequestGate(6, 60_000);
const streetGate = new RequestGate(6, 10_000);
const UA = "Kairos/1.0 (travel photos; contact: local)";
const YELP_DAY_CAP = 30;

let yelpDay = "";
let yelpUsed = 0;

type YelpOutcome = { photo: PlacePhoto | null; profile: CommercialProfile | null; match: boolean };

type YelpBiz = {
  id?: string;
  name?: string;
  image_url?: string;
  url?: string;
  rating?: number;
  review_count?: number;
  price?: string;
  categories?: { title?: string }[];
  coordinates?: { latitude?: number; longitude?: number };
  location?: { address1?: string; city?: string };
};

export type CommercialReport = {
  osm: boolean;
  wikimedia: boolean;
  yelpConfigured: boolean;
  yelpMatch: boolean;
  yelpPhoto: boolean;
  foursquareConfigured: boolean;
  foursquareMatch: boolean;
  foursquarePhoto: boolean;
  panoramax: boolean;
  mapillary: boolean;
  selected: string;
  note: string;
};

type PanoramaFeature = {
  id?: string;
  geometry?: { coordinates?: number[] };
  assets?: { thumb?: { href?: string }; sd?: { href?: string } };
  properties?: { license?: string; "geovisio:producer"?: string };
  links?: { rel?: string; href?: string; title?: string }[];
};

function namesOf(place: DiscoveredPlace): string[] {
  return [place.name, place.nameLocal, place.localName, place.nameEn, place.displayName].filter((name): name is string => Boolean(name && name.trim()));
}

function houseAgrees(left: string, right: string): boolean {
  const a = left.match(/\d{1,4}/)?.[0] ?? "";
  const b = right.match(/\d{1,4}/)?.[0] ?? "";
  if (!a || !b) return true;
  return a === b;
}

function yelpLocale(place: DiscoveredPlace): string {
  if (place.lat >= 30 && place.lat <= 46 && place.lng >= 129 && place.lng <= 146) return "ja_JP";
  if (place.lat >= 33 && place.lat <= 43 && place.lng >= 124 && place.lng < 130) return "ko_KR";
  if (/[\u4e00-\u9fff]/.test(place.name)) return "zh_CN";
  return "";
}

function yelpBudget(): boolean {
  const day = new Date().toISOString().slice(0, 10);
  if (day !== yelpDay) {
    yelpDay = day;
    yelpUsed = 0;
  }
  if (yelpUsed >= YELP_DAY_CAP || !yelpGate.allow()) return false;
  yelpUsed += 1;
  return true;
}

function photoShell(partial: Omit<PlacePhoto, "retrievedAt">): PlacePhoto | null {
  if (!isPermittedPhotoUrl(partial.thumbnailUrl)) return null;
  return { ...partial, retrievedAt: new Date().toISOString() };
}

async function yelpMatch(place: DiscoveredPlace): Promise<YelpOutcome> {
  const empty = { photo: null, profile: null, match: false };
  const key = env("YELP_API_KEY");
  if (!key) return empty;
  const cacheKey = `${place.name.toLowerCase()}:${place.lat.toFixed(3)},${place.lng.toFixed(3)}`;
  const cached = yelpCache.get(cacheKey);
  if (cached) return cached;
  if (!yelpBudget()) return empty;
  const url = new URL("https://api.yelp.com/v3/businesses/search");
  url.searchParams.set("term", place.name);
  url.searchParams.set("latitude", String(place.lat));
  url.searchParams.set("longitude", String(place.lng));
  url.searchParams.set("radius", "200");
  url.searchParams.set("limit", "5");
  const locale = yelpLocale(place);
  if (locale) url.searchParams.set("locale", locale);
  let body: { businesses?: YelpBiz[] } | null = null;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${key}`, Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (res.status === 429 || !res.ok) return empty;
    body = await res.json() as { businesses?: YelpBiz[] };
  } catch {
    return empty;
  }
  const names = namesOf(place);
  let best: { distance: number; biz: YelpBiz } | null = null;
  for (const biz of body?.businesses ?? []) {
    const lat = biz.coordinates?.latitude;
    const lng = biz.coordinates?.longitude;
    if (lat == null || lng == null || !biz.name || !biz.id) continue;
    const distance = distanceMeters(place.lat, place.lng, lat, lng);
    if (distance > 120) continue;
    if (!names.some((name) => commercialNameMatch(name, biz.name || ""))) continue;
    const yelpAddress = [biz.location?.address1, biz.location?.city].filter(Boolean).join(" ");
    if (!houseAgrees(place.address, yelpAddress)) continue;
    if (!best || distance < best.distance) best = { distance, biz };
  }
  if (!best?.biz.id || !best.biz.name) {
    yelpCache.set(cacheKey, empty);
    return empty;
  }
  const profile: CommercialProfile = {
    provider: "yelp",
    id: best.biz.id,
    name: best.biz.name,
    url: best.biz.url || `https://www.yelp.com/biz/${best.biz.id}`,
    rating: typeof best.biz.rating === "number" ? best.biz.rating : undefined,
    reviewCount: typeof best.biz.review_count === "number" ? best.biz.review_count : undefined,
    price: best.biz.price || "",
    categories: (best.biz.categories ?? []).map((row) => row.title || "").filter(Boolean).slice(0, 4),
    matchedAt: new Date().toISOString(),
  };
  const image = best.biz.image_url || "";
  const photo = image ? photoShell({
    source: "yelp",
    fileTitle: "",
    thumbnailUrl: image,
    originalUrl: image,
    descriptionUrl: profile.url,
    width: 0,
    height: 0,
    mime: "",
    creator: "Yelp",
    license: "Yelp display terms",
    licenseUrl: "https://terms.yelp.com/developers/display_requirements",
    attributionRequired: true,
    sourcePlaceId: profile.id,
  }) : null;
  const outcome = { photo, profile, match: true };
  yelpCache.set(cacheKey, outcome);
  return outcome;
}

function foursquareGate(): { configured: boolean; enabled: boolean } {
  return { configured: Boolean(env("FOURSQUARE_API_KEY")), enabled: Boolean(env("FOURSQUARE_API_KEY")) && env("FOURSQUARE_PHOTOS") === "on" };
}

async function foursquareMatch(place: DiscoveredPlace): Promise<YelpOutcome> {
  const empty = { photo: null, profile: null, match: false };
  const gate = foursquareGate();
  if (!gate.enabled) return empty;
  const key = env("FOURSQUARE_API_KEY") || "";
  const url = new URL("https://api.foursquare.com/v3/places/search");
  url.searchParams.set("query", place.name);
  url.searchParams.set("ll", `${place.lat},${place.lng}`);
  url.searchParams.set("radius", "120");
  url.searchParams.set("limit", "5");
  try {
    const res = await fetch(url, { headers: { Authorization: key, Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return empty;
    const body = await res.json() as { results?: { fsq_id?: string; name?: string; distance?: number; link?: string; categories?: { name?: string }[] }[] };
    const names = namesOf(place);
    const biz = (body.results ?? []).find((row) => (row.distance ?? 999) <= 120 && row.fsq_id && row.name && names.some((name) => commercialNameMatch(name, row.name || "")));
    if (!biz?.fsq_id || !biz.name) return empty;
    const photos = await fetch(`https://api.foursquare.com/v3/places/${encodeURIComponent(biz.fsq_id)}/photos?limit=1`, {
      headers: { Authorization: key, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    const rows = photos.ok ? await photos.json() as { prefix?: string; suffix?: string }[] : [];
    const first = rows[0];
    const image = first?.prefix && first.suffix ? `${first.prefix}300x300${first.suffix}` : "";
    const profile: CommercialProfile = {
      provider: "foursquare",
      id: biz.fsq_id,
      name: biz.name,
      url: biz.link || "",
      categories: (biz.categories ?? []).map((row) => row.name || "").filter(Boolean).slice(0, 4),
      matchedAt: new Date().toISOString(),
    };
    const photo = image ? photoShell({
      source: "foursquare",
      fileTitle: "",
      thumbnailUrl: image,
      originalUrl: image,
      descriptionUrl: profile.url,
      width: 300,
      height: 300,
      mime: "",
      creator: "Foursquare",
      license: "Foursquare Places API terms",
      licenseUrl: "https://foursquare.com/legal/api-policy",
      attributionRequired: true,
      sourcePlaceId: biz.fsq_id,
    }) : null;
    return { photo, profile, match: true };
  } catch {
    return empty;
  }
}

function closestFeature(lat: number, lng: number, features: PanoramaFeature[]): { feature: PanoramaFeature; meters: number } | null {
  let best: { feature: PanoramaFeature; meters: number } | null = null;
  for (const feature of features) {
    const pair = feature.geometry?.coordinates;
    if (!pair || pair.length < 2) continue;
    const meters = distanceMeters(lat, lng, pair[1], pair[0]);
    if (meters > 50) continue;
    if (!best || meters < best.meters) best = { feature, meters };
  }
  return best;
}

async function panoramaPhoto(feature: PanoramaFeature): Promise<PlacePhoto | null> {
  let thumb = feature.assets?.thumb?.href || feature.assets?.sd?.href || "";
  let license = feature.properties?.license || "";
  let creator = feature.properties?.["geovisio:producer"] || "";
  let page = feature.links?.find((link) => link.rel === "self")?.href || "";
  const licenseHref = feature.links?.find((link) => link.rel === "license")?.href || "";
  if (!thumb && page) {
    if (!streetGate.allow()) return null;
    try {
      const res = await fetch(page, { headers: { Accept: "application/geo+json", "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const item = await res.json() as PanoramaFeature;
        thumb = item.assets?.thumb?.href || item.assets?.sd?.href || "";
        license = license || item.properties?.license || "";
        creator = creator || item.properties?.["geovisio:producer"] || "";
        page = item.links?.find((link) => link.rel === "self")?.href || page;
      }
    } catch {
      return null;
    }
  }
  if (!thumb || !feature.id) return null;
  return photoShell({
    source: "panoramax",
    fileTitle: "",
    thumbnailUrl: thumb,
    originalUrl: feature.assets?.sd?.href || thumb,
    descriptionUrl: page,
    width: 500,
    height: 0,
    mime: "",
    creator,
    license,
    licenseUrl: licenseHref,
    attributionRequired: true,
    sourcePlaceId: feature.id,
  });
}

async function panoramaxNear(lat: number, lng: number): Promise<PlacePhoto | null> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  const cached = streetCache.get(cacheKey);
  if (cached !== undefined) return cached;
  if (!streetGate.allow()) return null;
  const dLat = 50 / 111320;
  const dLng = 50 / (111320 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
  const url = new URL("https://api.panoramax.xyz/api/search");
  url.searchParams.set("bbox", `${lng - dLng},${lat - dLat},${lng + dLng},${lat + dLat}`);
  url.searchParams.set("limit", "5");
  try {
    const res = await fetch(url, { headers: { Accept: "application/geo+json", "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const body = await res.json() as { features?: PanoramaFeature[] };
    const near = closestFeature(lat, lng, body.features ?? []);
    const photo = near ? await panoramaPhoto(near.feature) : null;
    streetCache.set(cacheKey, photo);
    return photo;
  } catch {
    return null;
  }
}

async function mapillaryPicture(id: string, lat: number, lng: number): Promise<PlacePhoto | null> {
  const token = env("MAPILLARY_TOKEN");
  if (!token) return null;
  if (!streetGate.allow()) return null;
  const url = new URL(id ? `https://graph.mapillary.com/${encodeURIComponent(id)}` : "https://graph.mapillary.com/images");
  url.searchParams.set("access_token", token);
  url.searchParams.set("fields", "id,thumb_1024_url,creator");
  if (!id) {
    const dLat = 40 / 111320;
    const dLng = 40 / (111320 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
    url.searchParams.set("bbox", `${lng - dLng},${lat - dLat},${lng + dLng},${lat + dLat}`);
    url.searchParams.set("limit", "1");
  }
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const body = await res.json() as { id?: string; thumb_1024_url?: string; creator?: { username?: string }; data?: { id?: string; thumb_1024_url?: string }[] };
    const row = body.thumb_1024_url ? body : body.data?.[0];
    if (!row?.thumb_1024_url || !row.id) return null;
    return photoShell({
      source: "mapillary",
      fileTitle: "",
      thumbnailUrl: row.thumb_1024_url,
      originalUrl: row.thumb_1024_url,
      descriptionUrl: `https://www.mapillary.com/app/?focus=photo&pKey=${row.id}`,
      width: 1024,
      height: 0,
      mime: "",
      creator: body.creator?.username || "",
      license: "",
      licenseUrl: "https://www.mapillary.com/legal/terms",
      attributionRequired: true,
      sourcePlaceId: row.id,
    });
  } catch {
    return null;
  }
}

export async function referencedStreetPhoto(place: DiscoveredPlace): Promise<PlacePhoto | null> {
  if (place.mapillaryId) {
    const photo = await mapillaryPicture(place.mapillaryId, place.lat, place.lng);
    if (photo) return photo;
  }
  if (!place.panoramaxId) return null;
  const photo = await panoramaxNear(place.lat, place.lng);
  return photo?.sourcePlaceId === place.panoramaxId ? photo : null;
}

export async function enrichCommercialPlace(place: DiscoveredPlace, openPhoto: boolean): Promise<{ photo: PlacePhoto | null; profile: CommercialProfile | null; report: CommercialReport }> {
  const osm = Boolean(place.commonsFile || place.mapillaryId || place.panoramaxId);
  const yelp = await yelpMatch(place);
  const foursquare = yelp.photo ? { photo: null, profile: null, match: false } : await foursquareMatch(place);
  const street = !openPhoto && !yelp.photo && !foursquare.photo && (place.mapillaryId || place.panoramaxId)
    ? await referencedStreetPhoto(place)
    : null;
  const mapillary = street?.source === "mapillary" ? street : null;
  const panoramax = street?.source === "panoramax" ? street : null;
  const photo = openPhoto ? null : yelp.photo || foursquare.photo || street;
  const selected = openPhoto ? "open" : photo?.source || "none";
  const yelpConfigured = Boolean(env("YELP_API_KEY"));
  const foursquareState = foursquareGate();
  const note = [
    yelpConfigured ? "" : "Yelp was not called. No API key is configured, and Yelp Places is a 30-day trial followed by a paid plan.",
    foursquareState.enabled ? "" : "Foursquare photos were not called. They are a paid Premium endpoint and stay off unless FOURSQUARE_PHOTOS=on.",
    "Official website images are not fetched. A venue page does not grant a licence to reuse its pictures.",
    "Street photos are used only when OpenStreetMap references that Mapillary or Panoramax picture. A nearby frame is not treated as the storefront.",
  ].filter(Boolean).join(" ");
  const report: CommercialReport = {
    osm,
    wikimedia: openPhoto,
    yelpConfigured,
    yelpMatch: yelp.match,
    yelpPhoto: Boolean(yelp.photo),
    foursquareConfigured: foursquareState.configured,
    foursquareMatch: foursquare.match,
    foursquarePhoto: Boolean(foursquare.photo),
    panoramax: Boolean(panoramax),
    mapillary: Boolean(mapillary),
    selected,
    note,
  };
  console.info(`[PLACE PHOTO] commercial Place: ${place.name} OSM: ${osm ? "YES" : "NO"} Wikimedia: ${openPhoto ? "YES" : "NO"} Yelp match: ${yelpConfigured ? yelp.match ? "YES" : "NO" : "not called"} Yelp photo: ${yelp.photo ? "YES" : "NO"} Foursquare match: ${foursquareState.enabled ? foursquare.match ? "YES" : "NO" : "not called"} Panoramax: ${panoramax ? "YES" : "NO"} Selected: ${selected}`);
  return { photo, profile: yelp.profile || foursquare.profile, report };
}
