/** Kairos decides. These URLs only open an app the user already has. No Gemini. No paid API. */

import { createGoogleCalendarUrl } from "@/lib/google-calendar";
import { resolveCommerceActions, type AffiliateSettings, type CommerceContext } from "@/lib/affiliate";
import { externalPlaceLinks, verifiedWebsite, type PlaceLinkInput } from "@/lib/travel-links";
import { automaticNav, navigationHref, type NavPlatform, type NavPoint } from "@/lib/travel-routing";

export type ExternalActionType =
  | "REVIEWS"
  | "NAVIGATE"
  | "BOOK_HOTEL"
  | "BOOK_ACTIVITY"
  | "RESERVE_RESTAURANT"
  | "BUY_TICKET"
  | "OFFICIAL_WEBSITE"
  | "ADD_TO_CALENDAR"
  | "SHARE"
  | "ORDER_FOOD"
  | "REQUEST_QUOTE"
  | "BOOK_TRANSPORT"
  | "BUY_ESIM"
  | "RENT_CAR";

export type ExternalAction = {
  id: string;
  type: ExternalActionType;
  provider: string;
  label: string;
  url: string;
  appUrl?: string;
  webUrl?: string;
  placeId?: string;
  source: string;
  affiliateEligible: boolean;
  disclosureRequired: boolean;
  disclosure?: string;
};

export type ActionKind = "hotel" | "attraction" | "restaurant" | "activity" | "venue" | "place";

export type ActionPlace = {
  id?: string;
  name: string;
  nameEn?: string;
  nameLocal?: string;
  localName?: string;
  displayName?: string;
  nameEnglish?: string;
  nameRomanized?: string;
  address?: string;
  city?: string;
  region?: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
  website?: string;
  /** Verified page only. Never guessed. */
  ticketUrl?: string;
  reserveUrl?: string;
  orderUrl?: string;
  quoteUrl?: string;
  activityUrl?: string;
  googlePlaceId?: string;
};

export type ActionInput = {
  mode: "travel" | "makan" | "dating" | "family" | "out" | "today";
  kind: ActionKind;
  countryCode?: string;
  place: ActionPlace;
  from?: { lat: number; lng: number; name?: string };
  navMode?: "walk" | "drive" | "transit";
  /** Travel keeps NavigateControl. Other modes include the link. */
  navigate?: boolean;
  share?: boolean;
  when?: { date: string; startMin: number; endMin: number; timezone?: string };
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  childAges?: number[];
  destination?: string;
};

const REVIEW_NOTE = "Opens that service. Kairos has not read those reviews.";

function clean(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function countryOf(input: ActionInput): string {
  return clean(input.countryCode || input.place.countryCode).toUpperCase();
}

function linkInput(input: ActionInput): PlaceLinkInput {
  const place = input.place;
  return {
    name: place.name,
    nameEn: place.nameEn,
    nameLocal: place.nameLocal,
    localName: place.localName,
    displayName: place.displayName,
    nameEnglish: place.nameEnglish,
    nameRomanized: place.nameRomanized,
    address: place.address,
    city: place.city,
    region: place.region,
    countryCode: countryOf(input),
    lat: place.lat,
    lng: place.lng,
    website: place.website,
    googlePlaceId: place.googlePlaceId,
  };
}

function point(input: ActionInput): NavPoint | null {
  const lat = input.place.lat;
  const lng = input.place.lng;
  if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  const name = clean(input.place.nameLocal || input.place.localName || input.place.name).slice(0, 80) || "Place";
  return { lat, lng, name };
}

function originPoint(input: ActionInput, dest: NavPoint): NavPoint | null {
  const from = input.from;
  if (!from || !Number.isFinite(from.lat) || !Number.isFinite(from.lng)) return null;
  if (Math.abs(from.lat) > 90 || Math.abs(from.lng) > 180) return null;
  if (Math.abs(from.lat - dest.lat) < 0.00001 && Math.abs(from.lng - dest.lng) < 0.00001) return null;
  return { lat: from.lat, lng: from.lng, name: clean(from.name).slice(0, 80) || "Start" };
}

function push(list: ExternalAction[], action: ExternalAction | null): void {
  if (!action?.url || !action.url.startsWith("https://")) return;
  if (list.some((item) => item.url === action.url && item.type === action.type)) return;
  list.push(action);
}

function verifiedAction(type: ExternalActionType, provider: string, label: string, raw: string | undefined, placeId?: string): ExternalAction | null {
  const url = verifiedWebsite(raw);
  if (!url) return null;
  return {
    id: type.toLowerCase(),
    type,
    provider,
    label,
    url,
    webUrl: url,
    placeId,
    source: "verified-url",
    affiliateEligible: false,
    disclosureRequired: false,
  };
}

function singaporeInstant(date: string, minutes: number): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const [year, month, day] = date.split("-").map(Number);
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  if (!year || !month || !day || hour < 0 || hour > 23 || minute < 0 || minute > 59) return "";
  return new Date(Date.UTC(year, month - 1, day, hour - 8, minute)).toISOString();
}

function calendarAction(input: ActionInput): ExternalAction | null {
  const when = input.when;
  if (!when || (when.timezone && when.timezone !== "Asia/Singapore")) return null;
  const start = singaporeInstant(when.date, when.startMin);
  if (!start) return null;
  const duration = Math.max(30, Math.min(8 * 60, when.endMin - when.startMin));
  try {
    const url = createGoogleCalendarUrl({
      title: clean(input.place.name).slice(0, 80) || "Plan",
      startTime: start,
      durationMinutes: Number.isFinite(duration) ? duration : 60,
      timezone: "Asia/Singapore",
      venueName: clean(input.place.name).slice(0, 80),
      address: clean(input.place.address).slice(0, 120),
    });
    return {
      id: "calendar",
      type: "ADD_TO_CALENDAR",
      provider: "google-calendar",
      label: "Add to calendar",
      url,
      webUrl: url,
      placeId: input.place.id,
      source: "calendar-template",
      affiliateEligible: false,
      disclosureRequired: false,
    };
  } catch {
    return null;
  }
}

function commerceContext(input: ActionInput): CommerceContext {
  return {
    mode: input.mode,
    destination: input.destination,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: input.adults,
    childAges: input.childAges,
  };
}

function shareAction(input: ActionInput, mapUrl: string): ExternalAction | null {
  const name = clean(input.place.name);
  if (!name) return null;
  const text = [name, clean(input.place.address), clean(input.place.city), mapUrl].filter(Boolean).join("\n").slice(0, 400);
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  return {
    id: "share",
    type: "SHARE",
    provider: "whatsapp",
    label: "Share",
    url,
    webUrl: url,
    placeId: input.place.id,
    source: "share-link",
    affiliateEligible: false,
    disclosureRequired: false,
  };
}

/**
 * Build only the actions we can actually open.
 * A missing ticket, reservation, order, or quote URL is omitted. Nothing is invented.
 */
export function placeActions(input: ActionInput, platform: NavPlatform = "other", affiliate?: AffiliateSettings): ExternalAction[] {
  const actions: ExternalAction[] = [];
  const country = countryOf(input);
  const links = externalPlaceLinks(linkInput(input), input.from);
  const placeId = input.place.id;
  const show = new Set<ExternalActionType>();
  if (input.mode === "travel" && input.kind === "hotel") show.add("BOOK_HOTEL");
  if (input.kind !== "restaurant" || input.mode === "travel" || input.mode === "family") show.add("OFFICIAL_WEBSITE");
  if (input.mode === "makan") show.add("OFFICIAL_WEBSITE");
  if (input.kind === "attraction" || input.kind === "activity" || input.kind === "venue") show.add("BUY_TICKET");
  if (input.kind === "activity" || input.kind === "venue") show.add("BOOK_ACTIVITY");
  if (input.kind === "restaurant") show.add("RESERVE_RESTAURANT");
  if (input.mode === "makan" && input.kind === "restaurant") show.add("ORDER_FOOD");
  if (input.mode === "out") show.add("REQUEST_QUOTE");

  if (links.localPlace && (country === "CN" || country === "KR")) {
    push(actions, {
      id: "local-place",
      type: "REVIEWS",
      provider: country === "CN" ? "amap" : "kakao",
      label: links.localPlace.label,
      url: links.localPlace.href,
      appUrl: links.localPlace.href,
      webUrl: links.localPlace.href,
      placeId,
      source: "regional-place",
      affiliateEligible: false,
      disclosureRequired: true,
      disclosure: REVIEW_NOTE,
    });
  }
  if (country === "KR") {
    const query = links.googleMapsSearch ? new URL(links.googleMapsSearch).searchParams.get("query") || "" : "";
    if (query) {
      const url = `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
      push(actions, {
        id: "naver-place",
        type: "REVIEWS",
        provider: "naver",
        label: "View on Naver Map",
        url,
        webUrl: url,
        placeId,
        source: "regional-place",
        affiliateEligible: false,
        disclosureRequired: true,
        disclosure: REVIEW_NOTE,
      });
    }
  }
  if (links.googleReviews) {
    push(actions, {
      id: "google-reviews",
      type: "REVIEWS",
      provider: "google-maps",
      label: "View Google reviews",
      url: links.googleReviews,
      webUrl: links.googleReviews,
      placeId,
      source: "maps-search",
      affiliateEligible: false,
      disclosureRequired: true,
      disclosure: REVIEW_NOTE,
    });
  }
  if (show.has("OFFICIAL_WEBSITE")) {
    push(actions, verifiedAction("OFFICIAL_WEBSITE", "official", "Official website", input.place.website, placeId));
  }
  if (show.has("BUY_TICKET")) push(actions, verifiedAction("BUY_TICKET", "official", "Check tickets", input.place.ticketUrl, placeId));
  if (show.has("BOOK_ACTIVITY")) push(actions, verifiedAction("BOOK_ACTIVITY", "official", "Book activity", input.place.activityUrl, placeId));
  if (show.has("RESERVE_RESTAURANT")) push(actions, verifiedAction("RESERVE_RESTAURANT", "official", "Reserve", input.place.reserveUrl, placeId));
  if (show.has("ORDER_FOOD")) push(actions, verifiedAction("ORDER_FOOD", "official", "Order", input.place.orderUrl, placeId));
  if (show.has("REQUEST_QUOTE")) push(actions, verifiedAction("REQUEST_QUOTE", "official", "Request quote", input.place.quoteUrl, placeId));
  const commerce = commerceContext(input);
  if (show.has("BOOK_HOTEL")) {
    for (const action of resolveCommerceActions({ id: placeId, name: input.place.name, city: input.place.city, country: country, lat: input.place.lat, lng: input.place.lng, category: "HOTEL" }, commerce, affiliate)) push(actions, action);
  }
  if (show.has("BUY_TICKET") || show.has("BOOK_ACTIVITY")) {
    const category = input.kind === "activity" || input.kind === "venue" ? "ACTIVITY" : "ATTRACTION";
    for (const action of resolveCommerceActions({ id: placeId, name: input.place.name, city: input.place.city, country: country, lat: input.place.lat, lng: input.place.lng, category }, commerce, affiliate)) push(actions, action);
  }
  if (show.has("RESERVE_RESTAURANT")) {
    for (const action of resolveCommerceActions({ id: placeId, name: input.place.name, city: input.place.city, country: country, category: "RESTAURANT" }, commerce, affiliate)) push(actions, action);
  }
  if (show.has("ORDER_FOOD")) {
    for (const action of resolveCommerceActions({ id: placeId, name: input.place.name, city: input.place.city, country: country, category: "FOOD_DELIVERY" }, commerce, affiliate)) push(actions, action);
  }
  if (show.has("REQUEST_QUOTE")) {
    for (const action of resolveCommerceActions({ id: placeId, name: input.place.name, city: input.place.city, country: country, category: "TEAM_ACTIVITY" }, commerce, affiliate)) push(actions, action);
  }

  const dest = point(input);
  const from = dest ? originPoint(input, dest) : null;
  if (input.navigate !== false && dest && from) {
    const app = automaticNav(country, platform);
    const mode = input.navMode ?? "drive";
    const appUrl = navigationHref(app, from, dest, mode);
    const webUrl = navigationHref("google", from, dest, mode);
    push(actions, {
      id: "navigate",
      type: "NAVIGATE",
      provider: app,
      label: "Navigate",
      url: appUrl,
      appUrl,
      webUrl,
      placeId,
      source: "navigation-handoff",
      affiliateEligible: false,
      disclosureRequired: false,
    });
  }
  if (input.mode === "today") push(actions, calendarAction(input));
  if (input.share) push(actions, shareAction(input, links.googleMapsSearch));
  return actions;
}

export function kindFromTravelCategory(category: string): ActionKind {
  if (category === "stay") return "hotel";
  if (category === "restaurant" || category === "cafe" || category === "nightlife" || category === "market") return "restaurant";
  if (category === "theme_park" || category === "zoo" || category === "aquarium") return "activity";
  return "attraction";
}
