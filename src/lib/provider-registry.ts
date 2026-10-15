/**
 * Solo-founder cost registry. This is configuration, not a bill.
 * Optional paid providers stay off until their own environment flag is set.
 * Nothing in this file stores or prints a key.
 *
 * See docs/cost-guardrail.md.
 */

export type GuardrailClass = "OPEN" | "FREE_LIMITED" | "EXTERNAL_HANDOFF" | "OPTIONAL_PAID";

export type ProviderRecord = {
  id: string;
  feature: string;
  costClass: GuardrailClass;
  requiresKey: boolean;
  requiresBilling: boolean;
  requiresCreditCard: boolean;
  cacheable: boolean;
  fallbackProvider: string;
  enabled: boolean;
  note: string;
};

type Env = Record<string, string | undefined>;

function on(value: string | undefined): boolean {
  return /^(1|true|on|yes)$/i.test((value ?? "").trim());
}

function present(value: string | undefined): boolean {
  return Boolean(value && value.trim());
}

export function providerRegistry(env: Env = process.env): ProviderRecord[] {
  const gemini = present(env.GEMINI_API_KEY);
  const yelp = present(env.YELP_API_KEY);
  const foursquare = present(env.FOURSQUARE_API_KEY) && env.FOURSQUARE_PHOTOS === "on";
  const supabase = present(env.SUPABASE_URL) || present(env.DATABASE_URL);
  const affiliate = ["TRIP", "AGODA", "BOOKING", "KLOOK", "TRIP_EXPERIENCE", "RESERVE", "ORDER", "QUOTE"].some((name) =>
    on(env[`AFFILIATE_${name}_ENABLED`]) && present(env[`AFFILIATE_${name}_ID`]) && (env[`AFFILIATE_${name}_TEMPLATE`] ?? "").includes("{id}"),
  );
  return [
    { id: "directory", feature: "Bundled places", costClass: "OPEN", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: false, fallbackProvider: "", enabled: true, note: "Ships with the app. No network call." },
    { id: "travel-playbook", feature: "Trip patterns", costClass: "OPEN", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "overpass", enabled: true, note: "Curated and generated playbooks stay in memory. A missing destination is built from structural facts or Wikivoyage headings, then saved. No Gemini call and no tour-operator API. A failed build uses the existing place planner." },
    { id: "photon", feature: "Geocoding", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "nominatim", enabled: true, note: "A miss falls through to Nominatim, then an empty list. The plan is not invented." },
    { id: "nominatim", feature: "Geocoding", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "", enabled: true, note: "Used only if Photon returns nothing." },
    { id: "overpass", feature: "Place discovery", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "wikidata", enabled: true, note: "Saved and directory places still show. Nothing is invented." },
    { id: "wikidata", feature: "Place discovery", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "overpass", enabled: true, note: "OpenStreetMap places still plan. Coverage notes the gap." },
    { id: "wikivoyage", feature: "Place discovery", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "wikidata", enabled: true, note: "Guide marks are skipped. Places stay." },
    { id: "wikimedia", feature: "Open photos", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "", enabled: true, note: "The place stays, with no open photo. No Gemini call." },
    { id: "openfreemap", feature: "Map display", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "", enabled: true, note: "Tiles fail. Stops remain listed with coordinates." },
    { id: "met-no", feature: "Weather", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "", enabled: true, note: "The itinerary stays. Outdoor advice says weather did not answer." },
    { id: "osrm", feature: "Road routing", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "navigation", enabled: true, note: "Times drop out. Stop order remains. Navigate still hands off." },
    { id: "osm-foot", feature: "Walk routing", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "osrm", enabled: true, note: "Walk times become an estimate or stay blank." },
    { id: "transit", feature: "Transit", costClass: "FREE_LIMITED", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: false, fallbackProvider: "osrm", enabled: false, note: "No transit feed is connected. Road times are never labelled as transit." },
    { id: "gemini", feature: "Editorial synthesis", costClass: "FREE_LIMITED", requiresKey: true, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "", enabled: gemini, note: "Rules and the deterministic plan remain. Commentary is skipped." },
    { id: "supabase", feature: "Saved rows", costClass: "FREE_LIMITED", requiresKey: true, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "overpass", enabled: supabase, note: "Live map search still runs. Saved food rows are skipped." },
    { id: "yelp", feature: "Commercial photos", costClass: "OPTIONAL_PAID", requiresKey: true, requiresBilling: false, requiresCreditCard: false, cacheable: true, fallbackProvider: "wikimedia", enabled: yelp, note: "Off unless YELP_API_KEY is set, and capped at 30 calls a day." },
    { id: "foursquare", feature: "Commercial photos", costClass: "OPTIONAL_PAID", requiresKey: true, requiresBilling: true, requiresCreditCard: true, cacheable: true, fallbackProvider: "wikimedia", enabled: foursquare, note: "Off unless FOURSQUARE_PHOTOS=on. The photo endpoint is a paid Premium call." },
    { id: "navigation", feature: "Navigate", costClass: "EXTERNAL_HANDOFF", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: false, fallbackProvider: "", enabled: true, note: "A public map URL opens. Kairos does not call a routing API." },
    { id: "reviews", feature: "Google reviews", costClass: "EXTERNAL_HANDOFF", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: false, fallbackProvider: "", enabled: true, note: "A public search URL opens. No Google Places API." },
    { id: "hotels", feature: "Hotel comparison", costClass: "EXTERNAL_HANDOFF", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: false, fallbackProvider: "affiliate", enabled: true, note: "No booking API and no prices. A missing hotel does not remove attractions." },
    { id: "affiliate", feature: "Referral links", costClass: "EXTERNAL_HANDOFF", requiresKey: false, requiresBilling: false, requiresCreditCard: false, cacheable: false, fallbackProvider: "hotels", enabled: affiliate, note: "Off until a public partner id and https template are set. Ranking never reads this." },
  ];
}

/** Cold-cache request counts. A reload of the same result is zero. Not a price. */
export const WORKFLOW_REQUESTS: { workflow: string; requests: string }[] = [
  { workflow: "Travel generation", requests: "A cached playbook is local and 0 Gemini. The first request for an unknown place can add 1 Wikivoyage heading read and up to 4 Photon lookups, still 0 Gemini. Then 1 Photon if the place was searched, up to 4 Overpass boxes, 1 Wikidata, 1 weather, 1 route matrix, up to 1 road route per planned day, a few batched Wikimedia image calls, 1 Gemini voice. Gemini name translation only for unresolved non-Latin names, in batches of 24. Photos and reviews and Navigate are 0 Gemini." },
  { workflow: "Dating generation", requests: "3 Overpass, 1 weather, route lookups until a stop fits (capped at 12 candidates per step, then the router stops if the service fails), 1 Gemini sentence. A short typed brief can add 1 parse call. Opening the finished plan again is 0." },
  { workflow: "Family generation", requests: "2 Overpass, 1 weather, a few cached route pairs, 1 Gemini brief when the request is a sentence, 1 Gemini sentence. Rules cover an obvious form. Reload is 0." },
  { workflow: "Makan search", requests: "1 Overpass, walk-time checks for the shortlist, 0 Gemini when the filters are already set. A free-text search adds 1 parse call and, if asked to explain, 1 sentence about places already found." },
  { workflow: "Today load", requests: "1 weather, 1 road route per leg already on the day, 1 Gemini sentence. Same day opened again is served from cache. Reviews and Navigate are 0." },
];

let logged = false;

export function logCostGuardrail(): void {
  if (logged) return;
  if (typeof process === "undefined" || process.env.NODE_ENV === "production") return;
  if (process.argv.some((arg) => arg === "--test" || arg.includes("node:test"))) return;
  logged = true;
  const rows = providerRegistry();
  const paid = rows.filter((row) => row.costClass === "OPTIONAL_PAID");
  const cards = rows.filter((row) => row.requiresCreditCard);
  console.info(`[KAIROS COST] Optional paid: ${paid.map((row) => `${row.id} ${row.enabled ? "ON" : "OFF"}`).join(", ")}`);
  const liveCards = cards.filter((row) => row.enabled);
  if (liveCards.length) console.warn(`[KAIROS COST] Credit card required and currently ON: ${liveCards.map((row) => row.id).join(", ")}`);
  else if (cards.length) console.info(`[KAIROS COST] Credit-card providers stay OFF: ${cards.map((row) => row.id).join(", ")}`);
}

export function resetCostGuardrailLog(): void {
  logged = false;
}
