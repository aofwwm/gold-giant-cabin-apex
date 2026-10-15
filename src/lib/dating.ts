export const DATE_TYPES = ["first", "casual", "night", "anniversary", "surprise", "married", "parents"] as const;
export type DateType = (typeof DATE_TYPES)[number];

export const DATE_VIBES = ["cosy", "romantic", "fun", "chill", "classy", "playful", "quiet", "scenic", "foodie", "artsy", "active"] as const;
export type DateVibe = (typeof DATE_VIBES)[number];

export const DATE_FOODS = ["dinner", "cafe", "dessert", "drinks", "museum", "workshop", "walk", "view", "games", "karaoke", "picnic", "nature"] as const;
export type DateFood = (typeof DATE_FOODS)[number];

export type SelectedOrigin = {
  source: "manual_search" | "home" | "current" | "saved";
  provider: string;
  providerId: string;
  name: string;
  formattedAddress: string;
  area: string;
  latitude: number;
  longitude: number;
};

export type DateRole = "meal" | "cafe" | "scenic" | "activity";

export type DatePlace = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  role: DateRole;
  setting: "indoor" | "outdoor";
  approxSgd: number;
  cuisine: string;
  vibes: DateVibe[];
  diets: string[];
  alcohol: boolean;
  opening: string;
  source: "directory" | "osm";
  blurb: string;
};

export type DatingStop = {
  id: string;
  kind: "meal" | "cafe" | "scenic" | "activity";
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  startMin: number;
  endMin: number;
  setting: "indoor" | "outdoor";
  travelMin: number | null;
  travelLabel: string;
  cost: number | null;
  why: string;
  /** What the two of you actually do here. Not a place description. */
  doThis: string;
  placeId: string;
  liveLabel: string;
  opening: string;
  slot: string;
};

export type DatingPlan = {
  title: string;
  thesis: string;
  arc: string;
  dress: string;
  pacing: string;
  rain: string;
  shape: string;
  note: string;
  partial: boolean;
};

export type DatingScore = {
  total: number;
  vibe: number;
  practical: number;
  moment: number;
  flow: number;
  value: number;
  weather: number;
  lines: string[];
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(value)));

const SEEN_KEY = "kairos-dating-seen-v1";

export function seenAreaKey(lat: number, lng: number): string {
  return `${lat.toFixed(2)}:${lng.toFixed(2)}`;
}

function neighborKeys(lat: number, lng: number): string[] {
  const keys: string[] = [];
  for (const dLat of [-0.01, 0, 0.01]) {
    for (const dLng of [-0.01, 0, 0.01]) keys.push(seenAreaKey(lat + dLat, lng + dLng));
  }
  return keys;
}

export function readSeenPlaces(lat: number, lng: number): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const book = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}") as Record<string, unknown>;
    const out: string[] = [];
    for (const key of neighborKeys(lat, lng)) {
      const list = book[key];
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        if (typeof item !== "string" || out.includes(item)) continue;
        out.push(item);
      }
    }
    return out.slice(0, 24);
  } catch {
    return [];
  }
}

export function rememberSeenPlaces(lat: number, lng: number, ids: string[]) {
  if (typeof localStorage === "undefined") return;
  try {
    const book = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}") as Record<string, string[]>;
    const key = seenAreaKey(lat, lng);
    const prev = Array.isArray(book[key]) ? book[key] : [];
    const next = [...ids.filter(Boolean), ...prev.filter((id) => !ids.includes(id))].slice(0, 16);
    book[key] = next;
    const keys = Object.keys(book);
    if (keys.length > 14) {
      for (const old of keys.slice(0, keys.length - 14)) delete book[old];
    }
    localStorage.setItem(SEEN_KEY, JSON.stringify(book));
  } catch {
    // Memory is a convenience. The plan still stands without it.
  }
}

export function scoreDating(
  places: DatePlace[],
  input: {
    vibes: DateVibe[];
    foods: DateFood[];
    budget: number;
    freeOnly: boolean;
    travelMin: number | null;
    maxTravel: number;
    weatherOutdoor: boolean | null;
    stops: number;
  },
): DatingScore {
  const lead = places[0];
  const vibeHits = lead ? input.vibes.filter((vibe) => lead.vibes.includes(vibe)).length : 0;
  const vibe = input.vibes.length ? clamp((vibeHits / input.vibes.length) * 25, vibeHits ? 8 : 4, 25) : 16;
  const practical = input.travelMin == null ? 8 : input.travelMin <= input.maxTravel ? clamp(20 - Math.floor(input.travelMin / 15), 10, 20) : 4;
  const outdoorLead = lead?.setting === "outdoor";
  const moment = input.weatherOutdoor == null ? 12 : outdoorLead && !input.weatherOutdoor ? 6 : 18;
  const flow = input.stops >= 3 ? 15 : input.stops === 2 ? 12 : 7;
  const known = places.reduce((sum, place) => sum + (place.approxSgd > 0 ? place.approxSgd * 2 : 0), 0);
  const value = input.freeOnly ? (known === 0 ? 10 : 2) : known === 0 ? 6 : known <= input.budget ? 10 : 3;
  const weather = input.weatherOutdoor == null ? 5 : outdoorLead && !input.weatherOutdoor ? 2 : input.weatherOutdoor ? 10 : 8;
  const lines = [
    vibeHits ? "The place matches the vibe you asked for." : "The vibe is a loose fit.",
    input.travelMin != null ? `${input.travelMin} min on a verified route.` : "Travel time was not verified.",
    known > 0 ? `Typical couple spend ~$${known}. Not a quote.` : "Price unavailable on at least one stop.",
  ];
  return {
    total: clamp(vibe + practical + moment + flow + value + weather, 0, 100),
    vibe,
    practical,
    moment,
    flow,
    value,
    weather,
    lines,
  };
}
