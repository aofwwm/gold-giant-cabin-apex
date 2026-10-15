/**
 * Affiliate handoff. Ranking code must not import this module.
 * Partner ids are public referral codes, not secrets. There is no affiliate API and no price feed.
 * A slot stays off until enabled, id, and an https template containing {id} are all configured.
 */

import type { ExternalAction, ExternalActionType } from "@/lib/external-actions";

export type AffiliateCategory =
  | "HOTEL"
  | "ACTIVITY"
  | "ATTRACTION"
  | "RESTAURANT"
  | "FOOD_DELIVERY"
  | "TRANSPORT"
  | "ESIM"
  | "CAR_RENTAL"
  | "TEAM_ACTIVITY";

export type AffiliateSlot = {
  enabled: boolean;
  id: string;
  template: string;
};

/** No commission, payout, or expected revenue. Those fields are deliberately absent. */
export type AffiliateSettings = {
  trip: AffiliateSlot;
  agoda: AffiliateSlot;
  booking: AffiliateSlot;
  klook: AffiliateSlot;
  tripExperience: AffiliateSlot;
  reserve: AffiliateSlot;
  order: AffiliateSlot;
  quote: AffiliateSlot;
  transport: AffiliateSlot;
  esim: AffiliateSlot;
  car: AffiliateSlot;
};

export type CommerceItem = {
  id?: string;
  name: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  category: AffiliateCategory;
};

export type CommerceContext = {
  mode: "travel" | "makan" | "dating" | "family" | "out" | "today";
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  childAges?: number[];
};

export type AffiliateClick = {
  event: "affiliate_click";
  provider: string;
  category: AffiliateCategory;
  itemId: string;
  mode: string;
  at: string;
};

export const AFFILIATE_DISCLOSURE = "Some booking links are affiliate links. Kairos may earn a commission at no additional cost to you.";
export const RATE_NOTE = "The booking site shows the current price. Kairos has not compared rates.";

const EMPTY_SLOT: AffiliateSlot = { enabled: false, id: "", template: "" };

export function disabledAffiliateSettings(): AffiliateSettings {
  return {
    trip: { ...EMPTY_SLOT },
    agoda: { ...EMPTY_SLOT },
    booking: { ...EMPTY_SLOT },
    klook: { ...EMPTY_SLOT },
    tripExperience: { ...EMPTY_SLOT },
    reserve: { ...EMPTY_SLOT },
    order: { ...EMPTY_SLOT },
    quote: { ...EMPTY_SLOT },
    transport: { ...EMPTY_SLOT },
    esim: { ...EMPTY_SLOT },
    car: { ...EMPTY_SLOT },
  };
}

type SlotKey = keyof AffiliateSettings;

const SLOTS: { key: SlotKey; env: string; name: string; category: AffiliateCategory; plain: boolean }[] = [
  { key: "trip", env: "TRIP", name: "Trip.com", category: "HOTEL", plain: true },
  { key: "agoda", env: "AGODA", name: "Agoda", category: "HOTEL", plain: true },
  { key: "booking", env: "BOOKING", name: "Booking.com", category: "HOTEL", plain: true },
  { key: "klook", env: "KLOOK", name: "Klook", category: "ACTIVITY", plain: false },
  { key: "tripExperience", env: "TRIP_EXPERIENCE", name: "Trip.com", category: "ATTRACTION", plain: false },
  { key: "reserve", env: "RESERVE", name: "Reserve", category: "RESTAURANT", plain: false },
  { key: "order", env: "ORDER", name: "Order", category: "FOOD_DELIVERY", plain: false },
  { key: "quote", env: "QUOTE", name: "Request quote", category: "TEAM_ACTIVITY", plain: false },
  { key: "transport", env: "TRANSPORT", name: "Transport", category: "TRANSPORT", plain: false },
  { key: "esim", env: "ESIM", name: "eSIM", category: "ESIM", plain: false },
  { key: "car", env: "CAR", name: "Car rental", category: "CAR_RENTAL", plain: false },
];

const PLACEHOLDERS = ["id", "query", "name", "city", "country", "checkin", "checkout", "adults", "lat", "lng", "itemId"];

function clean(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function publicEnv(key: string): string {
  try {
    const env = (import.meta as { env?: Record<string, string | undefined> }).env;
    const value = env?.[key];
    return typeof value === "string" ? value.trim() : "";
  } catch {
    return "";
  }
}

function readRaw(envName: string, env?: Record<string, string | undefined>): string {
  if (env) return clean(env[envName] ?? env[`VITE_${envName}`]);
  const server = typeof process !== "undefined" && process.env ? clean(process.env[envName]) : "";
  return server || publicEnv(`VITE_${envName}`);
}

function slotFromEnv(prefix: string, env?: Record<string, string | undefined>): AffiliateSlot {
  const enabled = /^(1|true|on|yes)$/i.test(readRaw(`${prefix}_ENABLED`, env));
  const id = readRaw(`${prefix}_ID`, env);
  const template = readRaw(`${prefix}_TEMPLATE`, env);
  const ready = enabled && /^[A-Za-z0-9_-]{1,64}$/.test(id) && template.includes("{id}") && template.startsWith("https://");
  return ready ? { enabled: true, id, template } : { enabled: false, id: "", template: "" };
}

export function readAffiliateConfig(env?: Record<string, string | undefined>): AffiliateSettings {
  const settings = disabledAffiliateSettings();
  for (const slot of SLOTS) settings[slot.key] = slotFromEnv(`AFFILIATE_${slot.env}`, env);
  return settings;
}

function iso(value: string | undefined): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") ? value ?? "" : "";
}

function searchText(item: CommerceItem, context: CommerceContext): string {
  return [item.name, item.city, context.destination].map(clean).filter(Boolean).filter((part, index, all) => all.findIndex((other) => other.toLowerCase() === part.toLowerCase()) === index).join(" ").slice(0, 120);
}

function fillTemplate(template: string, values: Record<string, string>): string {
  if (!template.startsWith("https://") || template.length > 500 || !template.includes("{id}")) return "";
  if (/\{(?!id\}|query\}|name\}|city\}|country\}|checkin\}|checkout\}|adults\}|lat\}|lng\}|itemId\})/.test(template)) return "";
  let url = template;
  for (const key of PLACEHOLDERS) url = url.split(`{${key}}`).join(encodeURIComponent(values[key] ?? ""));
  if (url.includes("{") || url.includes("}")) return "";
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function valuesFor(item: CommerceItem, context: CommerceContext, id: string): Record<string, string> {
  const adults = context.adults && context.adults > 0 && context.adults < 30 ? String(Math.round(context.adults)) : "";
  return {
    id,
    query: searchText(item, context),
    name: clean(item.name).slice(0, 80),
    city: clean(item.city).slice(0, 60),
    country: clean(item.country).slice(0, 40),
    checkin: iso(context.checkIn),
    checkout: iso(context.checkOut),
    adults,
    lat: Number.isFinite(item.lat) ? String(item.lat) : "",
    lng: Number.isFinite(item.lng) ? String(item.lng) : "",
    itemId: clean(item.id).slice(0, 80),
  };
}

function childAges(context: CommerceContext): number[] {
  return (context.childAges ?? []).filter((age) => age >= 0 && age <= 17).slice(0, 6);
}

function plainHotelUrl(provider: "trip" | "booking" | "agoda", item: CommerceItem, context: CommerceContext): string {
  const query = searchText(item, context);
  if (query.length < 3) return "";
  const checkIn = iso(context.checkIn);
  const checkOut = iso(context.checkOut);
  const ages = childAges(context);
  if (provider === "trip") {
    const url = new URL("https://www.trip.com/hotels/list");
    url.searchParams.set("keyword", query);
    return url.toString();
  }
  if (provider === "agoda") {
    const url = new URL("https://www.agoda.com/search");
    url.searchParams.set("q", query);
    if (checkIn) url.searchParams.set("checkIn", checkIn);
    if (checkOut) url.searchParams.set("checkOut", checkOut);
    url.searchParams.set("rooms", "1");
    if (context.adults && context.adults > 0 && context.adults < 30) url.searchParams.set("adults", String(Math.round(context.adults)));
    if (ages.length) url.searchParams.set("children", String(ages.length));
    return url.toString();
  }
  const url = new URL("https://www.booking.com/searchresults.html");
  url.searchParams.set("ss", query);
  if (checkIn) url.searchParams.set("checkin", checkIn);
  if (checkOut) url.searchParams.set("checkout", checkOut);
  if (context.adults && context.adults > 0 && context.adults < 30) url.searchParams.set("group_adults", String(Math.round(context.adults)));
  if (ages.length) {
    url.searchParams.set("group_children", String(ages.length));
    for (const age of ages) url.searchParams.append("age", String(age));
  }
  url.searchParams.set("no_rooms", "1");
  return url.toString();
}

function hotelLabel(name: string): string {
  return `Check ${name}`;
}

function experienceLabel(category: AffiliateCategory, name: string): string {
  if (category === "ATTRACTION") return `Check tickets · ${name}`;
  if (category === "ACTIVITY") return `Book experience · ${name}`;
  if (category === "RESTAURANT") return "Reserve";
  if (category === "FOOD_DELIVERY") return "Order";
  if (category === "TEAM_ACTIVITY") return "Request quote";
  return name;
}

function actionType(category: AffiliateCategory): ExternalActionType | null {
  if (category === "HOTEL") return "BOOK_HOTEL";
  if (category === "ATTRACTION") return "BUY_TICKET";
  if (category === "ACTIVITY") return "BOOK_ACTIVITY";
  if (category === "RESTAURANT") return "RESERVE_RESTAURANT";
  if (category === "FOOD_DELIVERY") return "ORDER_FOOD";
  if (category === "TEAM_ACTIVITY") return "REQUEST_QUOTE";
  if (category === "TRANSPORT") return "BOOK_TRANSPORT";
  if (category === "ESIM") return "BUY_ESIM";
  if (category === "CAR_RENTAL") return "RENT_CAR";
  return null;
}

function matches(slotCategory: AffiliateCategory, asked: AffiliateCategory): boolean {
  if (slotCategory === asked) return true;
  if (asked === "ATTRACTION" && (slotCategory === "ACTIVITY" || slotCategory === "ATTRACTION")) return true;
  if (asked === "ACTIVITY" && (slotCategory === "ACTIVITY" || slotCategory === "ATTRACTION")) return true;
  return false;
}

/**
 * Links for an item that has already been ranked. This function does not sort items.
 * A future authorised rate adapter can sit beside this. It is not called, and it must not rank.
 */
export function authorisedHotelRates(): null {
  return null;
}

export function resolveCommerceActions(item: CommerceItem, context: CommerceContext, settings: AffiliateSettings = readAffiliateConfig()): ExternalAction[] {
  const query = searchText(item, context);
  if (query.length < 3) return [];
  const actions: ExternalAction[] = [];
  for (const slot of SLOTS) {
    if (!matches(slot.category, item.category)) continue;
    const type = actionType(item.category);
    if (!type) continue;
    const configured = settings[slot.key];
    const affiliateUrl = configured.enabled ? fillTemplate(configured.template, valuesFor(item, context, configured.id)) : "";
    const plain = !affiliateUrl && slot.plain && slot.category === "HOTEL" && (slot.key === "trip" || slot.key === "booking" || slot.key === "agoda")
      ? plainHotelUrl(slot.key, item, context)
      : "";
    const url = affiliateUrl || plain;
    if (!url) continue;
    const affiliate = Boolean(affiliateUrl);
    actions.push({
      id: `commerce-${slot.key}`,
      type,
      provider: slot.key === "trip" || slot.key === "tripExperience" ? "trip.com" : slot.key === "booking" ? "booking.com" : slot.key,
      label: slot.category === "HOTEL" ? hotelLabel(slot.name) : experienceLabel(item.category, slot.name),
      url,
      webUrl: url,
      placeId: item.id,
      source: affiliate ? "affiliate" : "public-search",
      affiliateEligible: affiliate,
      disclosureRequired: true,
      disclosure: affiliate ? AFFILIATE_DISCLOSURE : slot.category === "HOTEL" ? RATE_NOTE : "",
    });
  }
  return actions;
}

const clicks: AffiliateClick[] = [];

/** Records the outbound click only. Nothing after the user leaves Kairos. */
export function recordAffiliateClick(action: Pick<ExternalAction, "source" | "provider" | "placeId">, mode: string, category: AffiliateCategory): void {
  if (action.source !== "affiliate") return;
  clicks.push({
    event: "affiliate_click",
    provider: action.provider,
    category,
    itemId: action.placeId ?? "",
    mode,
    at: new Date().toISOString(),
  });
  if (clicks.length > 40) clicks.shift();
}

export function affiliateClicks(): readonly AffiliateClick[] {
  return clicks;
}

export function resetAffiliateClicks(): void {
  clicks.length = 0;
}
