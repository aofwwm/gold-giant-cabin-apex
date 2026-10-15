/** Planning routes and navigation handoff are different jobs. Planning uses open street routing. Navigate only opens a map app. */

export type RouteQuality = "realtime" | "scheduled" | "routing_estimate" | "approximate" | "unavailable";
export type TransitState = "realtime" | "scheduled" | "partial" | "unavailable";
export type PlanMode = "walk" | "drive" | "cycle" | "transit";
export type NavApp = "google" | "apple" | "amap" | "kakao" | "naver";
export type NavPreference = "automatic" | NavApp;
export type NavPlatform = "ios" | "mac" | "android" | "other";

export type RoutingCapability = {
  country: string;
  drive: boolean;
  walk: boolean;
  cycle: boolean;
  transit: TransitState;
  planning: "open-street";
  note: string;
};

const OPEN = "Public walk and drive routing. Not live traffic, and not a production promise. No transit feed is connected.";

/** Capabilities Kairos can actually use. A country entry does not mean a private API is called. */
export const ROUTING_CAPABILITIES: Record<string, RoutingCapability> = {
  "*": { country: "*", drive: true, walk: true, cycle: false, transit: "unavailable", planning: "open-street", note: OPEN },
  SG: { country: "SG", drive: true, walk: true, cycle: false, transit: "unavailable", planning: "open-street", note: `${OPEN} OneMap is not connected. It needs a developer token.` },
  CN: { country: "CN", drive: true, walk: true, cycle: false, transit: "unavailable", planning: "open-street", note: `${OPEN} Amap’s routing API is not called. It needs a key. Navigate can still open Amap.` },
  KR: { country: "KR", drive: true, walk: true, cycle: false, transit: "unavailable", planning: "open-street", note: `${OPEN} Kakao and Naver routing APIs are not called. They need keys. Navigate can still open them.` },
  FR: { country: "FR", drive: true, walk: true, cycle: false, transit: "unavailable", planning: "open-street", note: `${OPEN} No GTFS router is connected for Paris.` },
  US: { country: "US", drive: true, walk: true, cycle: false, transit: "unavailable", planning: "open-street", note: `${OPEN} No GTFS router is connected for US cities.` },
  CA: { country: "CA", drive: true, walk: true, cycle: false, transit: "unavailable", planning: "open-street", note: OPEN },
};

export function resolveRoutingProvider(input: { country?: string }): RoutingCapability {
  const code = (input.country ?? "").trim().toUpperCase();
  return ROUTING_CAPABILITIES[code] ?? { ...ROUTING_CAPABILITIES["*"], country: code || "*" };
}

const LEG_FILLER = /not live traffic|no fare is shown|comfortable choice|sensible hop|recommended option|best fit for this journey|kairos chose|chosen from the times|walking is the sensible|fits a backpacking|slow day intact|reasonable for an active|fewer long walks/i;

/** A reason is shown only when it tells the traveller something the time itself does not. */
export function legRecommendation(input: {
  mode: "walk" | "taxi" | "drive" | "transit";
  styles: string[];
  child: boolean;
  walkMinutes: number | null;
  roadMinutes: number | null;
}): string {
  const { mode, child, walkMinutes, roadMinutes } = input;
  if (mode === "transit") return "";
  const walk = walkMinutes;
  const road = roadMinutes;
  if (walk != null && walk >= 90 && mode !== "walk") return "Walking is not practical for this hop.";
  let reason = "";
  if (mode === "walk" && walk != null && road != null && walk > road) {
    const gap = walk - road;
    if (gap > 0 && gap <= 8) reason = gap === 1 ? "Only 1 min slower than a taxi." : `Only ${gap} min slower than a taxi.`;
  } else if (mode !== "walk") {
    if (child && walk != null && walk >= 20) reason = "The walk is long for a young child.";
    else if (walk != null && road != null && walk >= road + 8) reason = `Cuts walking from ${walk} min to ${road} min.`;
  }
  return usefulLegReason(reason, child);
}

export function usefulLegReason(reason: string | undefined, child: boolean): string {
  const text = (reason ?? "").replace(/\s+/g, " ").trim();
  if (!text || LEG_FILLER.test(text)) return "";
  if (/young child|stroller|child-friendly|family walking/i.test(text) && !child) return "";
  if (/cuts walking from \d{3,}/i.test(text)) return "Walking is not practical for this hop.";
  return text;
}

const NAV_KEY = "kairos-nav-app";

export function readNavPreference(): NavPreference {
  if (typeof localStorage === "undefined") return "automatic";
  const raw = localStorage.getItem(NAV_KEY);
  if (raw === "google" || raw === "apple" || raw === "amap" || raw === "kakao" || raw === "naver" || raw === "automatic") return raw;
  return "automatic";
}

export function writeNavPreference(value: NavPreference): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(NAV_KEY, value);
}

export function detectPlatform(ua = typeof navigator === "undefined" ? "" : navigator.userAgent): NavPlatform {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Macintosh|Mac OS X/i.test(ua)) return "mac";
  return "other";
}

export function inferCountry(lat: number, lng: number, code?: string): string {
  const given = (code ?? "").trim().toUpperCase();
  if (given) return given;
  if (lat > 33 && lat < 39.5 && lng > 124.5 && lng < 132) return "KR";
  if (lat >= 30 && lat <= 45.7 && lng >= 129 && lng <= 146) return "JP";
  if (lat > 18 && lat < 54 && lng > 73 && lng < 135) return "CN";
  if (lat >= 42 && lat <= 51.2 && lng >= -5 && lng <= 8.3) return "FR";
  if (lat >= 1.15 && lat <= 1.48 && lng >= 103.6 && lng <= 104.1) return "SG";
  if (lat >= 5.5 && lat <= 20.5 && lng >= 97 && lng <= 106) return "TH";
  return "";
}

export function automaticNav(country: string, platform: NavPlatform): NavApp {
  const code = country.toUpperCase();
  if (code === "CN") return "amap";
  if (code === "KR") return "kakao";
  if (platform === "ios" || platform === "mac") return "apple";
  return "google";
}

export function handoffChoices(country: string): NavApp[] {
  const code = country.toUpperCase();
  if (code === "CN") return ["amap", "apple", "google", "kakao", "naver"];
  if (code === "KR") return ["kakao", "naver", "google", "apple", "amap"];
  return ["google", "apple", "amap", "kakao", "naver"];
}

export function navLabel(app: NavApp): string {
  if (app === "google") return "Google Maps";
  if (app === "apple") return "Apple Maps";
  if (app === "amap") return "Amap";
  if (app === "kakao") return "Kakao Map";
  return "Naver Map";
}

export type NavPoint = { lat: number; lng: number; name: string };

function googleMode(mode: string): string {
  if (mode === "walk") return "walking";
  if (mode === "transit") return "transit";
  return "driving";
}

function appleFlag(mode: string): string {
  if (mode === "walk") return "w";
  if (mode === "transit") return "r";
  return "d";
}

function amapMode(mode: string): string {
  if (mode === "walk") return "walk";
  if (mode === "transit") return "bus";
  return "car";
}

function inChina(lat: number, lng: number): boolean {
  if (lat < 18 || lat > 53.6 || lng < 73.5 || lng > 134.8) return false;
  if (lat > 33 && lat < 43.1 && lng > 124.1 && lng < 131.9) return false;
  if (lng > 130.8 && lat > 30) return false;
  return true;
}

/** WGS-84 to GCJ-02. Used only so an Amap link inside China is not sent as the wrong system. */
export function wgsToGcj(lat: number, lng: number): { lat: number; lng: number } {
  if (!inChina(lat, lng)) return { lat, lng };
  const transformLat = (x: number, y: number) => {
    let value = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    value += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
    value += (20 * Math.sin(y * Math.PI) + 40 * Math.sin((y / 3) * Math.PI)) * 2 / 3;
    value += (160 * Math.sin((y / 12) * Math.PI) + 320 * Math.sin((y * Math.PI) / 30)) * 2 / 3;
    return value;
  };
  const transformLng = (x: number, y: number) => {
    let value = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    value += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
    value += (20 * Math.sin(x * Math.PI) + 40 * Math.sin((x / 3) * Math.PI)) * 2 / 3;
    value += (150 * Math.sin((x / 12) * Math.PI) + 300 * Math.sin((x / 30) * Math.PI)) * 2 / 3;
    return value;
  };
  let dLat = transformLat(lng - 105, lat - 35);
  let dLng = transformLng(lng - 105, lat - 35);
  const rad = (lat / 180) * Math.PI;
  let magic = Math.sin(rad);
  magic = 1 - 0.006693421622965943 * magic * magic;
  const sqrt = Math.sqrt(magic);
  dLat = (dLat * 180) / (((6378245 * (1 - 0.006693421622965943)) / (magic * sqrt)) * Math.PI);
  dLng = (dLng * 180) / ((6378245 / sqrt) * Math.cos(rad) * Math.PI);
  return { lat: lat + dLat, lng: lng + dLng };
}

export function navigationHref(app: NavApp, from: NavPoint, to: NavPoint, mode: string): string {
  if (app === "google") {
    const url = new URL("https://www.google.com/maps/dir/");
    url.searchParams.set("api", "1");
    url.searchParams.set("origin", `${from.lat},${from.lng}`);
    url.searchParams.set("destination", `${to.lat},${to.lng}`);
    url.searchParams.set("travelmode", googleMode(mode));
    return url.toString();
  }
  if (app === "apple") {
    const url = new URL("https://maps.apple.com/");
    url.searchParams.set("saddr", `${from.lat},${from.lng}`);
    url.searchParams.set("daddr", `${to.lat},${to.lng}`);
    url.searchParams.set("dirflg", appleFlag(mode));
    return url.toString();
  }
  if (app === "amap") {
    const inside = inChina(from.lat, from.lng) && inChina(to.lat, to.lng);
    const start = inside ? wgsToGcj(from.lat, from.lng) : from;
    const end = inside ? wgsToGcj(to.lat, to.lng) : to;
    const url = new URL("https://uri.amap.com/navigation");
    url.searchParams.set("from", `${start.lng},${start.lat},${from.name || "Start"}`);
    url.searchParams.set("to", `${end.lng},${end.lat},${to.name || "End"}`);
    url.searchParams.set("mode", amapMode(mode));
    url.searchParams.set("src", "kairos");
    url.searchParams.set("coordinate", inside ? "gaode" : "gps");
    url.searchParams.set("callnative", "1");
    return url.toString();
  }
  if (app === "kakao") {
    return `https://map.kakao.com/link/to/${encodeURIComponent(to.name || "Destination")},${to.lat},${to.lng}`;
  }
  const option = mode === "walk" ? "walk" : mode === "transit" ? "transit" : "car";
  const start = `${from.lng},${from.lat},${encodeURIComponent(from.name || "Start")},,`;
  const goal = `${to.lng},${to.lat},${encodeURIComponent(to.name || "End")},,`;
  return `https://map.naver.com/p/directions/${start}/${goal}/-/${option}`;
}
