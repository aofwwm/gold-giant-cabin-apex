//#region node_modules/.nitro/vite/services/ssr/assets/provider-registry-DT28z4U1.js
function on(value) {
	return /^(1|true|on|yes)$/i.test((value ?? "").trim());
}
function present(value) {
	return Boolean(value && value.trim());
}
function providerRegistry(env = process.env) {
	const gemini = present(env.GEMINI_API_KEY);
	const yelp = present(env.YELP_API_KEY);
	const foursquare = present(env.FOURSQUARE_API_KEY) && env.FOURSQUARE_PHOTOS === "on";
	const supabase = present(env.SUPABASE_URL) || present(env.DATABASE_URL);
	const affiliate = [
		"TRIP",
		"AGODA",
		"BOOKING",
		"KLOOK",
		"TRIP_EXPERIENCE",
		"RESERVE",
		"ORDER",
		"QUOTE"
	].some((name) => on(env[`AFFILIATE_${name}_ENABLED`]) && present(env[`AFFILIATE_${name}_ID`]) && (env[`AFFILIATE_${name}_TEMPLATE`] ?? "").includes("{id}"));
	return [
		{
			id: "directory",
			feature: "Bundled places",
			costClass: "OPEN",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: false,
			fallbackProvider: "",
			enabled: true,
			note: "Ships with the app. No network call."
		},
		{
			id: "travel-playbook",
			feature: "Trip patterns",
			costClass: "OPEN",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "overpass",
			enabled: true,
			note: "Curated and generated playbooks stay in memory. A missing destination is built from structural facts or Wikivoyage headings, then saved. No Gemini call and no tour-operator API. A failed build uses the existing place planner."
		},
		{
			id: "photon",
			feature: "Geocoding",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "nominatim",
			enabled: true,
			note: "A miss falls through to Nominatim, then an empty list. The plan is not invented."
		},
		{
			id: "nominatim",
			feature: "Geocoding",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "",
			enabled: true,
			note: "Used only if Photon returns nothing."
		},
		{
			id: "overpass",
			feature: "Place discovery",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "wikidata",
			enabled: true,
			note: "Saved and directory places still show. Nothing is invented."
		},
		{
			id: "wikidata",
			feature: "Place discovery",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "overpass",
			enabled: true,
			note: "OpenStreetMap places still plan. Coverage notes the gap."
		},
		{
			id: "wikivoyage",
			feature: "Place discovery",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "wikidata",
			enabled: true,
			note: "Guide marks are skipped. Places stay."
		},
		{
			id: "wikimedia",
			feature: "Open photos",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "",
			enabled: true,
			note: "The place stays, with no open photo. No Gemini call."
		},
		{
			id: "openfreemap",
			feature: "Map display",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "",
			enabled: true,
			note: "Tiles fail. Stops remain listed with coordinates."
		},
		{
			id: "met-no",
			feature: "Weather",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "",
			enabled: true,
			note: "The itinerary stays. Outdoor advice says weather did not answer."
		},
		{
			id: "osrm",
			feature: "Road routing",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "navigation",
			enabled: true,
			note: "Times drop out. Stop order remains. Navigate still hands off."
		},
		{
			id: "osm-foot",
			feature: "Walk routing",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "osrm",
			enabled: true,
			note: "Walk times become an estimate or stay blank."
		},
		{
			id: "transit",
			feature: "Transit",
			costClass: "FREE_LIMITED",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: false,
			fallbackProvider: "osrm",
			enabled: false,
			note: "No transit feed is connected. Road times are never labelled as transit."
		},
		{
			id: "gemini",
			feature: "Editorial synthesis",
			costClass: "FREE_LIMITED",
			requiresKey: true,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "",
			enabled: gemini,
			note: "Rules and the deterministic plan remain. Commentary is skipped."
		},
		{
			id: "supabase",
			feature: "Saved rows",
			costClass: "FREE_LIMITED",
			requiresKey: true,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "overpass",
			enabled: supabase,
			note: "Live map search still runs. Saved food rows are skipped."
		},
		{
			id: "yelp",
			feature: "Commercial photos",
			costClass: "OPTIONAL_PAID",
			requiresKey: true,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: true,
			fallbackProvider: "wikimedia",
			enabled: yelp,
			note: "Off unless YELP_API_KEY is set, and capped at 30 calls a day."
		},
		{
			id: "foursquare",
			feature: "Commercial photos",
			costClass: "OPTIONAL_PAID",
			requiresKey: true,
			requiresBilling: true,
			requiresCreditCard: true,
			cacheable: true,
			fallbackProvider: "wikimedia",
			enabled: foursquare,
			note: "Off unless FOURSQUARE_PHOTOS=on. The photo endpoint is a paid Premium call."
		},
		{
			id: "navigation",
			feature: "Navigate",
			costClass: "EXTERNAL_HANDOFF",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: false,
			fallbackProvider: "",
			enabled: true,
			note: "A public map URL opens. Kairos does not call a routing API."
		},
		{
			id: "reviews",
			feature: "Google reviews",
			costClass: "EXTERNAL_HANDOFF",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: false,
			fallbackProvider: "",
			enabled: true,
			note: "A public search URL opens. No Google Places API."
		},
		{
			id: "hotels",
			feature: "Hotel comparison",
			costClass: "EXTERNAL_HANDOFF",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: false,
			fallbackProvider: "affiliate",
			enabled: true,
			note: "No booking API and no prices. A missing hotel does not remove attractions."
		},
		{
			id: "affiliate",
			feature: "Referral links",
			costClass: "EXTERNAL_HANDOFF",
			requiresKey: false,
			requiresBilling: false,
			requiresCreditCard: false,
			cacheable: false,
			fallbackProvider: "hotels",
			enabled: affiliate,
			note: "Off until a public partner id and https template are set. Ranking never reads this."
		}
	];
}
function logCostGuardrail() {}
//#endregion
export { providerRegistry as n, logCostGuardrail as t };
