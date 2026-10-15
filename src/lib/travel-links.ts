/** External place handoff. These are ordinary map URLs. No Google Places API and no API key. */

import { navigationHref, wgsToGcj, type NavPoint } from "@/lib/travel-routing";

export type PlaceLinkInput = {
  name: string;
  nameEn?: string;
  nameLocal?: string;
  localName?: string;
  displayName?: string;
  nameEnglish?: string;
  nameRomanized?: string;
  address?: string;
  addressDisplay?: string;
  city?: string;
  area?: string;
  region?: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
  website?: string;
  /** Only if a future source already has one. Never fetched from Google Places. */
  googlePlaceId?: string;
};

export type ExternalPlaceLinks = {
  googleMapsSearch: string;
  googleReviews: string;
  officialWebsite: string;
  localPlace: { label: string; href: string } | null;
  navigation: {
    googleMaps: string;
    appleMaps: string;
    amap: string;
    kakao: string;
    naver: string;
  };
};

const COUNTRY_NAME: Record<string, string> = {
  JP: "Japan",
  FR: "France",
  US: "United States",
  SG: "Singapore",
  KR: "South Korea",
  CN: "China",
  GB: "United Kingdom",
  IT: "Italy",
  ES: "Spain",
  DE: "Germany",
  TH: "Thailand",
  AU: "Australia",
  CA: "Canada",
  NL: "Netherlands",
  MY: "Malaysia",
  ID: "Indonesia",
  VN: "Vietnam",
  TW: "Taiwan",
  HK: "Hong Kong",
  IN: "India",
  AE: "United Arab Emirates",
  TR: "Turkey",
};

const NOT_OFFICIAL = /(^|\.)((google|facebook|instagram|twitter|x|yelp|tripadvisor|booking|maps)\.[a-z.]+|goo\.gl|maps\.app\.goo\.gl)$/i;

function clean(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function fold(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/\s+/g, "");
}

function countryName(code: string | undefined): string {
  const key = clean(code).toUpperCase();
  return COUNTRY_NAME[key] ?? "";
}

function cityName(input: PlaceLinkInput): string {
  const raw = clean(input.city) || clean(input.area);
  if (!raw) return "";
  const head = raw.split(",")[0]?.trim() ?? "";
  return head;
}

function streetAddress(input: PlaceLinkInput, city: string): string {
  const address = clean(input.addressDisplay) || clean(input.address);
  if (!address) return "";
  const folded = fold(address);
  if (city && (folded === fold(city) || folded === fold(`${city} ${countryName(input.countryCode)}`))) return "";
  return address;
}

function addPart(parts: string[], value: string): void {
  const next = clean(value);
  if (next.length < 2) return;
  if (parts.some((part) => fold(part) === fold(next))) return;
  if (parts.some((part) => fold(part).includes(fold(next)) && fold(next).length >= 4)) return;
  parts.push(next);
}

/** Deterministic search text. Never invents an address or a place name. */
export function buildGoogleMapsPlaceQuery(input: PlaceLinkInput): string {
  const city = cityName(input);
  const country = countryName(input.countryCode);
  const street = streetAddress(input, city);
  const parts: string[] = [];
  addPart(parts, input.nameEnglish || input.nameEn || "");
  addPart(parts, input.nameRomanized || "");
  addPart(parts, input.displayName || "");
  addPart(parts, input.name);
  addPart(parts, input.nameLocal || input.localName || "");
  addPart(parts, street);
  addPart(parts, city);
  addPart(parts, input.region || "");
  addPart(parts, country);
  const query = parts.join(" ").replace(/\s+/g, " ").trim();
  const hasContext = Boolean(street || city || country);
  if (!hasContext && query.length < 18) return "";
  return query.slice(0, 240);
}

export function verifiedWebsite(value: string | undefined): string {
  const raw = clean(value);
  if (!raw || raw.length > 300) return "";
  const withScheme = /^https?:\/\//i.test(raw) ? raw : /^[\w.-]+\.[a-z]{2,}([/?#].*)?$/i.test(raw) ? `https://${raw}` : "";
  if (!withScheme) return "";
  try {
    const url = new URL(withScheme);
    if (url.username || url.password) return "";
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    const host = url.hostname.toLowerCase();
    if (!host.includes(".") || host === "localhost" || host.endsWith(".local") || /^\d+\.\d+\.\d+\.\d+$/.test(host)) return "";
    if (NOT_OFFICIAL.test(host)) return "";
    return url.toString();
  } catch {
    return "";
  }
}

function googleSearch(query: string, placeId = ""): string {
  if (!query) return "";
  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", query);
  if (/^ChI[\w-]{10,}$/.test(placeId)) url.searchParams.set("query_place_id", placeId);
  return url.toString();
}

function placePoint(input: PlaceLinkInput): { lat: number; lng: number; name: string } | null {
  if (input.lat == null || input.lng == null) return null;
  if (!Number.isFinite(input.lat) || !Number.isFinite(input.lng)) return null;
  if (Math.abs(input.lat) > 90 || Math.abs(input.lng) > 180) return null;
  const name = clean(input.nameLocal || input.localName || input.name).slice(0, 80) || "Place";
  return { lat: input.lat, lng: input.lng, name };
}

function amapPlace(point: { lat: number; lng: number; name: string }, country: string): string {
  const shifted = country === "CN" ? wgsToGcj(point.lat, point.lng) : point;
  const url = new URL("https://uri.amap.com/marker");
  url.searchParams.set("position", `${shifted.lng},${shifted.lat}`);
  url.searchParams.set("name", point.name);
  url.searchParams.set("src", "kairos");
  url.searchParams.set("coordinate", country === "CN" ? "gaode" : "gps");
  url.searchParams.set("callnative", "1");
  return url.toString();
}

function routeSet(from: NavPoint, to: NavPoint): ExternalPlaceLinks["navigation"] {
  return {
    googleMaps: navigationHref("google", from, to, "drive"),
    appleMaps: navigationHref("apple", from, to, "drive"),
    amap: navigationHref("amap", from, to, "drive"),
    kakao: navigationHref("kakao", from, to, "drive"),
    naver: navigationHref("naver", from, to, "drive"),
  };
}

export function externalPlaceLinks(input: PlaceLinkInput, from?: { lat: number; lng: number; name?: string }): ExternalPlaceLinks {
  const query = buildGoogleMapsPlaceQuery(input);
  const google = googleSearch(query, input.googlePlaceId);
  const country = clean(input.countryCode).toUpperCase();
  const point = placePoint(input);
  const website = verifiedWebsite(input.website);
  const localName = clean(input.nameLocal || input.localName || input.name);
  let localPlace: ExternalPlaceLinks["localPlace"] = null;
  if (point && country === "CN") localPlace = { label: "View on Amap", href: amapPlace(point, country) };
  else if (point && country === "KR") localPlace = { label: "View on Kakao Map", href: `https://map.kakao.com/link/map/${encodeURIComponent(localName)},${point.lat},${point.lng}` };
  const origin = from && Number.isFinite(from.lat) && Number.isFinite(from.lng) ? { lat: from.lat, lng: from.lng, name: clean(from.name) || "Start" } : point;
  const navigation = point && origin ? routeSet(origin, point) : { googleMaps: "", appleMaps: "", amap: "", kakao: "", naver: "" };
  return {
    googleMapsSearch: google,
    googleReviews: google,
    officialWebsite: website,
    localPlace,
    navigation,
  };
}
