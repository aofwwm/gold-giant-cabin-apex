import { C as sortMakanHits, T as walkMinutes, _ as originFromArea, c as buildConcepts, d as distanceMeters, f as foreignName, g as matchArea, h as mapsLink, l as constrainMakan, m as makanWhy, o as annotatePlace, p as makanConstraint, s as applyVerifiedWalks, t as AREAS, v as parseMakan, y as parseOuting } from "./coord-Cq5LMP_P.mjs";
import { n as noteCall } from "./provider-usage-CqiDrKv8.mjs";
import { KAIROS_VOICE, geminiJson } from "./gemini.server-D3PyYOAp.mjs";
import { n as TtlCache, r as shareRequest } from "./travel-cache-BPZkLeXq.mjs";
import { n as supabaseConfigured, t as getSupabase } from "./supabase-BKxuSUOP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coord.server-CiNzmMuE.js
function rowToHit(row, origin) {
	if (!row.name || !Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) return null;
	const meters = distanceMeters(origin.lat, origin.lng, row.latitude, row.longitude);
	const kind = row.place_type;
	return annotatePlace({
		id: row.id || `${row.provider}-${row.provider_id}`,
		name: row.name.slice(0, 80),
		cuisine: "",
		address: (row.address || origin.label).slice(0, 120),
		area: row.mall_name || origin.label,
		lat: row.latitude,
		lng: row.longitude,
		minutes: walkMinutes(meters),
		meters: Math.round(meters),
		price: 0,
		approxSgd: null,
		dietary: [],
		why: "",
		source: "map",
		mapsUrl: mapsLink(row.name, row.address || origin.label),
		placeKind: kind === "restaurant" || kind === "cafe" || kind === "hawker" || kind === "kopitiam" || kind === "bakery" || kind === "other" ? kind : void 0
	}, {
		cuisineText: (row.cuisine_tags ?? []).join(" "),
		amenity: row.place_type
	});
}
async function readCachedFood(origin, radius) {
	try {
		if (!supabaseConfigured()) return [];
		const dLat = radius / 111320;
		const dLng = radius / (111320 * Math.cos(origin.lat * Math.PI / 180));
		const { data, error } = await getSupabase().from("food_places").select("id, provider, provider_id, name, address, latitude, longitude, place_type, cuisine_tags, mall_name, unit_number, source").gte("latitude", origin.lat - dLat).lte("latitude", origin.lat + dLat).gte("longitude", origin.lng - dLng).lte("longitude", origin.lng + dLng).limit(200);
		if (error || !data) return [];
		const hits = [];
		for (const row of data) {
			const hit = rowToHit(row, origin);
			if (!hit || hit.meters > radius + 40) continue;
			hits.push(hit);
		}
		return hits;
	} catch {
		return [];
	}
}
async function rememberFoodPlaces(hits, mallName = "") {
	try {
		if (!supabaseConfigured() || !hits.length) return 0;
		const rows = hits.slice(0, 80).map((hit) => {
			const providerId = hit.id.replace(/^osm-/, "");
			return {
				id: hit.id.slice(0, 120),
				provider: hit.id.startsWith("osm-") ? "osm" : "kairos",
				provider_id: providerId.slice(0, 80),
				name: hit.name.slice(0, 80),
				address: hit.address.slice(0, 160),
				latitude: hit.lat,
				longitude: hit.lng,
				place_type: hit.placeKind && hit.placeKind !== "other" ? hit.placeKind : "",
				cuisine_tags: hit.cuisines ?? [],
				mall_name: hit.meters < 250 ? mallName.slice(0, 80) : "",
				unit_number: "",
				source: "osm",
				verified_at: (/* @__PURE__ */ new Date()).toISOString()
			};
		});
		const { error } = await getSupabase().from("food_places").upsert(rows, { onConflict: "id" });
		return error ? 0 : rows.length;
	} catch {
		return 0;
	}
}
async function geocode(query) {
	const q = query.trim();
	if (q.length < 3) return null;
	const top = (await searchPlaces(q))[0];
	if (top) return {
		lat: top.latitude,
		lng: top.longitude,
		label: top.name
	};
	const exact = AREAS.find((area) => area.label.toLowerCase() === q.toLowerCase());
	return exact ? {
		lat: exact.lat,
		lng: exact.lng,
		label: exact.label
	} : null;
}
var SG_BIAS = {
	lat: "1.3521",
	lon: "103.8198"
};
var geocodeCache = new TtlCache(864e5, 200, "geocode");
var reverseCache = new TtlCache(864e5, 80, "geocode");
var makanOsmCache = new TtlCache(216e5, 40, "discovery");
var makanIntentCache = new TtlCache(432e5, 40, "gemini");
var PLACE_NOISE = /* @__PURE__ */ new Set([
	"footway",
	"toilets",
	"taxi",
	"bus_stop",
	"parking",
	"political",
	"boundary"
]);
function tidy(value) {
	return (value ?? "").replace(/\s+/g, " ").trim();
}
function plain(value) {
	return value.toLowerCase().replace(/@/g, " ").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function kindLabel(key, value) {
	return {
		mall: "Shopping mall",
		station: key === "railway" ? "MRT station" : "Station",
		subway_entrance: "MRT entrance",
		stop: "Transit stop",
		bus_stop: "Bus stop",
		postcode: "Postal code",
		building: "Building",
		office: "Office",
		commercial: "Building",
		university: "Campus",
		college: "Campus",
		school: "School",
		hotel: "Hotel",
		attraction: "Landmark",
		museum: "Landmark",
		neighbourhood: "Neighbourhood",
		suburb: "Neighbourhood",
		quarter: "Neighbourhood",
		residential: "Street",
		house: "Address",
		yes: "Building",
		government: "Building",
		restaurant: "Restaurant",
		cafe: "Cafe"
	}[value || key || ""] || "Place";
}
function kindWeight(key, value) {
	return {
		mall: 90,
		station: key === "railway" ? 88 : 50,
		university: 70,
		college: 68,
		postcode: 72,
		house: 70,
		building: 64,
		office: 62,
		commercial: 60,
		government: 60,
		attraction: 55,
		museum: 55,
		hotel: 30,
		neighbourhood: 28,
		suburb: 26,
		subway_entrance: 24,
		stop: 12,
		bus_stop: 8,
		taxi: 4,
		footway: 0,
		toilets: 0,
		restaurant: 10,
		cafe: 10
	}[value || ""] ?? 22;
}
function formatPlaceAddress(props) {
	return tidy([tidy([props.housenumber, props.street].filter(Boolean).join(" ")), tidy(["Singapore", props.postcode].filter(Boolean).join(" "))].filter(Boolean).join(", ")) || "Singapore";
}
function scorePlace(query, props) {
	const name = plain(props.name || "");
	const asked = plain(query);
	const askingMrt = /\bmrt\b/.test(asked);
	let score = kindWeight(props.osm_key, props.osm_value);
	if (name && name === asked) score += 120;
	else if (name && (asked.startsWith(name) || name.startsWith(asked))) score += 70;
	else if (name && (asked.includes(name) || name.includes(asked))) score += 36;
	const tokens = asked.split(" ").filter((token) => token.length > 1);
	score += tokens.filter((token) => name.includes(token)).length * 14;
	const streetLine = plain([props.housenumber, props.street].filter(Boolean).join(" "));
	if (streetLine && (asked === streetLine || asked.includes(streetLine))) score += 48;
	if (/^\d{6}$/.test(query.trim()) && (props.osm_value === "postcode" || props.postcode === query.trim())) score += 80;
	if (askingMrt && props.osm_key === "railway" && (props.osm_value === "station" || props.osm_value === "stop")) score += 46;
	if (askingMrt && PLACE_NOISE.has(props.osm_value || "")) score -= 50;
	return score;
}
async function photonSearch(query, asked) {
	const url = new URL("https://photon.komoot.io/api/");
	url.searchParams.set("q", query);
	url.searchParams.set("limit", "8");
	url.searchParams.set("lat", SG_BIAS.lat);
	url.searchParams.set("lon", SG_BIAS.lon);
	url.searchParams.set("lang", "en");
	noteCall("geocode", "photon");
	const res = await fetch(url, {
		headers: {
			Accept: "application/json",
			"User-Agent": "Kairos/1.0 (Singapore group coordination)"
		},
		signal: AbortSignal.timeout(7e3)
	});
	if (!res.ok) return [];
	const body = await res.json();
	const hits = [];
	for (const feature of body.features ?? []) {
		const props = feature.properties ?? {};
		if (props.countrycode && props.countrycode !== "SG") continue;
		const [lng, lat] = feature.geometry?.coordinates ?? [];
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
		const name = tidy(props.name) || tidy([props.housenumber, props.street].filter(Boolean).join(" "));
		if (name.length < 2) continue;
		const postcode = tidy(props.postcode) || (/^\d{6}$/.test(tidy(props.name)) ? tidy(props.name) : "");
		const providerId = props.osm_type && props.osm_id ? `osm:${props.osm_type}:${props.osm_id}` : postcode ? `postcode:${postcode}` : "";
		hits.push({
			name,
			label: name,
			address: formatPlaceAddress({
				...props,
				postcode
			}),
			kind: kindLabel(props.osm_key, props.osm_value),
			latitude: lat,
			longitude: lng,
			providerId,
			area: tidy(props.district || props.suburb || props.locality || props.city || props.county)
		});
		Object.assign(hits[hits.length - 1], {
			score: scorePlace(asked, props),
			noise: PLACE_NOISE.has(props.osm_value || "")
		});
	}
	return hits;
}
async function searchPlaces(query) {
	const q = query.trim();
	if (q.length < 2) return [];
	const key = q.toLowerCase();
	const cached = geocodeCache.get(key);
	if (cached) return cached;
	return shareRequest(`sg-geo:${key}`, async () => {
		const again = geocodeCache.peek(key);
		if (again) return again;
		const found = await searchPlacesLive(q);
		if (found.length) geocodeCache.set(key, found);
		return found;
	});
}
async function searchPlacesLive(q) {
	const stripped = q.replace(/\b(mrt|station)\b/gi, " ").replace(/\s+/g, " ").trim();
	const queries = [q];
	if (stripped.length >= 3 && stripped.toLowerCase() !== q.toLowerCase()) queries.push(stripped);
	else if (!/singapore/i.test(q)) queries.push(`${q}, Singapore`);
	try {
		const merged = (await Promise.all(queries.map((item) => photonSearch(item, q).catch(() => [])))).flat();
		merged.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
		const useful = merged.some((hit) => !hit.noise && (hit.score ?? 0) >= 40) ? merged.filter((hit) => !hit.noise) : merged;
		const unique = [];
		for (const hit of useful) {
			const key = plain(hit.name);
			if (unique.some((item) => plain(item.name) === key && Math.abs(item.latitude - hit.latitude) < .01)) continue;
			unique.push({
				name: hit.name,
				label: hit.name,
				address: hit.address,
				kind: hit.kind,
				latitude: hit.latitude,
				longitude: hit.longitude,
				providerId: hit.providerId,
				area: hit.area
			});
			if (unique.length === 5) break;
		}
		return unique;
	} catch {
		return [];
	}
}
async function reverseLabel(latitude, longitude) {
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
	const key = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
	const cached = reverseCache.get(key);
	if (cached !== void 0) return cached;
	try {
		const url = new URL("https://photon.komoot.io/reverse");
		url.searchParams.set("lat", String(latitude));
		url.searchParams.set("lon", String(longitude));
		noteCall("geocode", "photon");
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"User-Agent": "Kairos/1.0 (Singapore group coordination)"
			},
			signal: AbortSignal.timeout(7e3)
		});
		if (!res.ok) return null;
		const props = (await res.json()).features?.[0]?.properties;
		if (!props || props.countrycode && props.countrycode !== "SG") return null;
		const name = tidy(props.name) || tidy([props.housenumber, props.street].filter(Boolean).join(" "));
		if (!name) return null;
		const hit = {
			name,
			label: name,
			address: formatPlaceAddress(props),
			kind: kindLabel(props.osm_key, props.osm_value),
			latitude,
			longitude,
			providerId: props.osm_type && props.osm_id ? `osm:${props.osm_type}:${props.osm_id}` : "",
			area: tidy(props.district || props.suburb || props.locality || props.city || props.county)
		};
		reverseCache.set(key, hit);
		return hit;
	} catch {
		return null;
	}
}
async function geocodeStreet(query) {
	const top = (await searchPlaces(query))[0];
	if (!top) return null;
	return {
		lat: top.latitude,
		lng: top.longitude,
		label: top.name
	};
}
async function footRoutes(origin, hits) {
	const nearest = [...hits].sort((a, b) => a.meters - b.meters).slice(0, 120);
	if (!nearest.length) return /* @__PURE__ */ new Map();
	const routes = /* @__PURE__ */ new Map();
	const slices = [];
	for (let index = 0; index < nearest.length; index += 20) slices.push(nearest.slice(index, index + 20));
	const routeSlice = async (slice) => {
		const coords = [`${origin.lng},${origin.lat}`, ...slice.map((hit) => `${hit.lng},${hit.lat}`)].join(";");
		try {
			const res = await fetch(`https://routing.openstreetmap.de/routed-foot/table/v1/foot/${coords}?sources=0&annotations=duration,distance`, {
				headers: {
					Accept: "application/json",
					"User-Agent": "Kairos/1.0 (group coordination)"
				},
				signal: AbortSignal.timeout(12e3)
			});
			if (!res.ok) return;
			const body = await res.json();
			const durations = body.durations?.[0];
			const distances = body.distances?.[0];
			if (!durations) return;
			slice.forEach((hit, offset) => {
				const seconds = durations[offset + 1];
				const meters = distances?.[offset + 1];
				if (typeof seconds !== "number" || typeof meters !== "number") return;
				if (!Number.isFinite(seconds) || !Number.isFinite(meters) || seconds <= 0 || meters <= 0) return;
				const speed = meters / seconds;
				if (speed < .3 || speed > 2.2) return;
				routes.set(hit.id, {
					seconds,
					meters
				});
			});
		} catch {}
	};
	for (let index = 0; index < slices.length; index += 2) await Promise.all(slices.slice(index, index + 2).map((slice) => routeSlice(slice)));
	return routes.size ? routes : null;
}
var OVERPASS_HOSTS = ["https://overpass.openstreetmap.fr/api/interpreter", "https://overpass-api.de/api/interpreter"];
var FOOD_AMENITY = "restaurant|fast_food|cafe|food_court|ice_cream";
var FOOD_SHOP = "bakery|pastry|confectionery|ice_cream";
function dedupeFood(hits) {
	const kept = [];
	for (const hit of hits) {
		const name = hit.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
		if (!kept.find((item) => {
			if (item.id === hit.id) return true;
			const other = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
			return Math.abs(item.lat - hit.lat) < 6e-4 && Math.abs(item.lng - hit.lng) < 6e-4 && (other === name || other.includes(name) || name.includes(other));
		})) kept.push(hit);
	}
	return kept;
}
function discoveryRadius(minutes) {
	if (minutes <= 5) return 800;
	if (minutes <= 10) return 1200;
	if (minutes <= 15) return 2e3;
	return 4e3;
}
function overpassQuery(origin, radius) {
	const around = `(around:${Math.round(radius)},${origin.lat},${origin.lng})`;
	return `[out:json][timeout:20];(nwr["amenity"~"^(${FOOD_AMENITY})$"]${around};nwr["shop"~"^(${FOOD_SHOP})$"]${around};);out center;`;
}
async function overpass(origin, radius) {
	const key = `${origin.lat.toFixed(3)},${origin.lng.toFixed(3)}:${radius}`;
	const cached = makanOsmCache.get(key);
	if (cached) return cached;
	return shareRequest(`makan-osm:${key}`, async () => {
		const again = makanOsmCache.peek(key);
		if (again) return again;
		const hits = await loadMakanPlaces(origin, radius);
		if (hits.length) makanOsmCache.set(key, hits);
		return hits;
	});
}
async function loadMakanPlaces(origin, radius) {
	const query = overpassQuery(origin, radius);
	for (const host of OVERPASS_HOSTS) try {
		noteCall("discovery", "overpass-makan");
		const res = await fetch(host, {
			method: "POST",
			headers: {
				"Content-Type": "text/plain",
				"User-Agent": "Kairos/1.0 (group coordination)"
			},
			body: query,
			signal: AbortSignal.timeout(2e4)
		});
		if (!res.ok) continue;
		const body = await res.json();
		const hits = [];
		for (const element of body.elements ?? []) {
			const tags = element.tags ?? {};
			const name = (tags.name ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
			if (name.length < 2) continue;
			const lat = element.lat ?? element.center?.lat;
			const lng = element.lon ?? element.center?.lon;
			if (lat == null || lng == null) continue;
			const meters = distanceMeters(origin.lat, origin.lng, lat, lng);
			if (meters > radius + 40) continue;
			const dietary = [];
			if (tags["diet:halal"] === "yes" || tags["halal"] === "yes") dietary.push("halal");
			if (tags["diet:vegetarian"] === "yes" || tags["diet:vegan"] === "only") dietary.push("vegetarian");
			if (tags["diet:vegan"] === "yes" || tags["diet:vegan"] === "only") dietary.push("vegan");
			const address = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ") || tags["addr:full"] || origin.label;
			const cuisineText = tags.cuisine ?? "";
			const amenity = tags.amenity || tags.shop || "";
			const hit = annotatePlace({
				id: `osm-${element.type}-${element.id}`,
				name,
				cuisine: cuisineText.replace(/_/g, " "),
				address: address.slice(0, 120),
				area: origin.label,
				lat,
				lng,
				minutes: walkMinutes(meters),
				meters: Math.round(meters),
				price: 0,
				approxSgd: null,
				dietary,
				why: "",
				source: "map",
				mapsUrl: mapsLink(name, address),
				openingHours: tags.opening_hours?.replace(/\s+/g, " ").trim().slice(0, 160) || void 0,
				amenity
			}, {
				cuisineText,
				amenity,
				types: [tags.amenity, tags.shop].filter((item) => Boolean(item))
			});
			hit.why = makanWhy(hit);
			hits.push(hit);
		}
		return hits;
	} catch {}
	return [];
}
async function nominatimFood(origin, radius) {
	const dLat = radius / 111320;
	const dLng = radius / (111320 * Math.cos(origin.lat * Math.PI / 180));
	const viewbox = `${origin.lng - dLng},${origin.lat + dLat},${origin.lng + dLng},${origin.lat - dLat}`;
	const hits = [];
	for (const term of ["restaurant", "cafe"]) try {
		const url = new URL("https://nominatim.openstreetmap.org/search");
		url.searchParams.set("q", term);
		url.searchParams.set("format", "jsonv2");
		url.searchParams.set("limit", "25");
		url.searchParams.set("countrycodes", "sg");
		url.searchParams.set("viewbox", viewbox);
		url.searchParams.set("bounded", "1");
		url.searchParams.set("addressdetails", "1");
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"User-Agent": "Kairos/1.0 (group coordination)"
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) continue;
		const body = await res.json();
		for (const item of body) {
			const name = (item.name ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
			if (name.length < 2) continue;
			if (item.category && item.category !== "amenity") continue;
			if (item.type && ![
				"restaurant",
				"cafe",
				"fast_food",
				"food_court"
			].includes(item.type)) continue;
			const lat = Number(item.lat);
			const lng = Number(item.lon);
			if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
			const meters = distanceMeters(origin.lat, origin.lng, lat, lng);
			if (meters > radius + 40) continue;
			const id = `osm-${item.osm_type ?? "n"}-${item.osm_id ?? name.toLowerCase()}`;
			if (hits.some((hit) => hit.id === id)) continue;
			const address = [item.address?.house_number, item.address?.road].filter(Boolean).join(" ") || (item.display_name ?? name).split(",").slice(0, 3).join(",");
			const hit = annotatePlace({
				id,
				name,
				cuisine: (item.type ?? term).replace(/_/g, " "),
				address: address.slice(0, 120),
				area: origin.label,
				lat,
				lng,
				minutes: walkMinutes(meters),
				meters: Math.round(meters),
				price: 0,
				approxSgd: null,
				dietary: [],
				why: "",
				source: "map",
				mapsUrl: mapsLink(name, address)
			}, { amenity: item.type ?? term });
			hit.why = makanWhy(hit);
			hits.push(hit);
		}
	} catch {}
	return hits;
}
async function askJson(system, user, schemaName, schema) {
	const key = `${schemaName}|${user.slice(0, 500)}`;
	const cached = makanIntentCache.get(key);
	if (cached !== void 0) return cached;
	const raw = await geminiJson(system, user, schema, 500);
	if (raw) makanIntentCache.set(key, raw);
	return raw;
}
var makanSchema = {
	type: "object",
	additionalProperties: false,
	required: [
		"location",
		"group_size",
		"max_budget_band",
		"dietary",
		"travel_limit_minutes",
		"mood",
		"timing"
	],
	properties: {
		location: { type: "string" },
		group_size: { type: "integer" },
		max_budget_band: { type: "integer" },
		dietary: { type: "string" },
		travel_limit_minutes: { type: "integer" },
		mood: { type: "string" },
		timing: { type: "string" }
	}
};
var whySchema = {
	type: "object",
	additionalProperties: false,
	required: ["picks"],
	properties: { picks: {
		type: "array",
		items: {
			type: "object",
			additionalProperties: false,
			required: ["id", "why"],
			properties: {
				id: { type: "string" },
				why: { type: "string" }
			}
		}
	} }
};
var outingSchema = {
	type: "object",
	additionalProperties: false,
	required: [
		"group_size",
		"budget_per_person",
		"area",
		"when_label",
		"hours",
		"energy",
		"avoid_notes"
	],
	properties: {
		group_size: { type: "integer" },
		budget_per_person: { type: "integer" },
		area: { type: "string" },
		when_label: { type: "string" },
		hours: { type: "integer" },
		energy: { type: "string" },
		avoid_notes: { type: "string" }
	}
};
var phraseSchema = {
	type: "object",
	additionalProperties: false,
	required: ["concepts"],
	properties: { concepts: {
		type: "array",
		items: {
			type: "object",
			additionalProperties: false,
			required: [
				"id",
				"title",
				"why"
			],
			properties: {
				id: { type: "string" },
				title: { type: "string" },
				why: { type: "string" }
			}
		}
	} }
};
function snapMinutes(value) {
	if (value <= 5) return 5;
	if (value <= 10) return 10;
	if (value <= 15) return 15;
	return 25;
}
function applyMakanJson(base, raw) {
	if (!raw || typeof raw !== "object") return base;
	const record = raw;
	const dietary = String(record.dietary ?? "");
	const mood = String(record.mood ?? "");
	const timing = String(record.timing ?? "");
	const area = matchArea(String(record.location ?? ""));
	return {
		...base,
		location: String(record.location ?? base.location).slice(0, 80),
		areaId: area?.id || base.areaId,
		groupSize: clampInt(record.group_size, base.groupSize, 1, 40),
		budget: [
			0,
			1,
			2,
			3
		].includes(Number(record.max_budget_band)) ? Number(record.max_budget_band) : base.budget,
		dietary: dietary === "halal" || dietary === "vegetarian" || dietary === "vegan" ? dietary : base.dietary,
		minutes: snapMinutes(clampInt(record.travel_limit_minutes, base.minutes, 5, 25)),
		mood: mood === "quick" || mood === "comfortable" || mood === "different" || mood === "coffee" || mood === "casual" ? mood : base.mood,
		timing: timing === "before" || timing === "after" ? timing : base.timing
	};
}
function clampInt(value, fallback, min, max) {
	const number = Number(value);
	if (!Number.isFinite(number)) return fallback;
	return Math.max(min, Math.min(max, Math.round(number)));
}
async function searchMakan(input) {
	let brief = parseMakan(input.text, {
		location: input.address,
		areaId: input.areaId,
		groupSize: input.groupSize,
		budget: input.budget,
		dietary: input.dietary,
		minutes: input.minutes,
		mood: input.mood,
		timing: input.timing,
		cuisines: input.cuisines ?? [],
		placeTypes: input.placeTypes ?? []
	});
	if (input.areaId) brief.areaId = input.areaId;
	if (input.groupSize) brief.groupSize = input.groupSize;
	if (input.minutes) brief.minutes = input.minutes;
	if (input.budget) brief.budget = input.budget;
	if (input.dietary) brief.dietary = input.dietary;
	if (input.mood) brief.mood = input.mood;
	let source = "rules";
	if (input.explain && input.text.trim().length > 8) {
		const raw = await askJson("Turn a makan request into JSON. Do not invent restaurants. dietary is halal, vegetarian, vegan, or empty. mood is quick, comfortable, different, coffee, casual, or empty. timing is before, after, or empty. max_budget_band is 0 any, 1 under $10, 2 from $10 to $20. travel_limit_minutes is 5, 10, 15, or 25.", input.text.slice(0, 400), "makan_brief", makanSchema);
		if (raw) {
			brief = applyMakanJson(brief, raw);
			source = "grok";
		}
	}
	if (input.areaId) brief.areaId = input.areaId;
	if (input.address) brief.location = input.address.slice(0, 80);
	if (input.groupSize) brief.groupSize = input.groupSize;
	if (input.minutes) brief.minutes = input.minutes;
	brief.budget = input.budget;
	brief.dietary = input.dietary;
	brief.mood = input.mood;
	brief.cuisines = input.cuisines ?? [];
	brief.placeTypes = input.placeTypes ?? [];
	if (input.timing) brief.timing = input.timing;
	const pinned = typeof input.latitude === "number" && typeof input.longitude === "number" && Number.isFinite(input.latitude) && Number.isFinite(input.longitude) ? {
		lat: input.latitude,
		lng: input.longitude,
		label: input.originName || input.address || "Current location"
	} : null;
	const sourceKind = input.originSource || "";
	const origin = Boolean(pinned) && [
		"current",
		"choose",
		"office",
		"home",
		"meeting"
	].includes(sourceKind) ? pinned : sourceKind === "choose" ? null : await geocodeStreet(input.address || brief.location || "");
	if (!origin) {
		const missing = sourceKind === "office" ? "We couldn't locate your saved office." : sourceKind === "home" ? "We couldn't locate your saved home." : "We couldn't find that place.";
		return {
			originLabel: "",
			originAddress: input.address || "",
			brief,
			hits: [],
			pool: 0,
			note: missing,
			source: "rules",
			routed: false,
			status: "geocode"
		};
	}
	const originPoint = {
		lat: origin.lat,
		lng: origin.lng,
		label: origin.label || input.address || "Singapore"
	};
	const walkLimit = brief.minutes < 25;
	const radius = discoveryRadius(brief.minutes);
	const [mapped, cached] = await Promise.all([overpass(originPoint, radius), readCachedFood(originPoint, radius)]);
	const discovered = mapped.length ? mapped : await nominatimFood(originPoint, radius);
	const saved = (input.savedPlaces ?? []).flatMap((place) => {
		if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude) || place.name.trim().length < 2) return [];
		const meters = distanceMeters(originPoint.lat, originPoint.lng, place.latitude, place.longitude);
		return [annotatePlace({
			id: place.id.slice(0, 80) || `fav-${place.name.toLowerCase()}`,
			name: place.name.slice(0, 80),
			cuisine: place.cuisine ?? "",
			address: (place.address || originPoint.label).slice(0, 120),
			area: originPoint.label,
			lat: place.latitude,
			lng: place.longitude,
			minutes: walkMinutes(meters),
			meters: Math.round(meters),
			price: 0,
			approxSgd: null,
			dietary: [],
			why: "",
			source: "map",
			mapsUrl: mapsLink(place.name, place.address || originPoint.label)
		}, {
			cuisineText: place.cuisine ?? "",
			amenity: place.placeKind ?? ""
		})];
	});
	const gathered = dedupeFood([
		...discovered,
		...cached,
		...saved
	]).filter((hit) => hit.meters <= radius + 80);
	rememberFoodPlaces(mapped, originPoint.label);
	gathered.filter((hit) => !brief.placeTypes.length || hit.placeKind && hit.placeKind !== "other" && brief.placeTypes.includes(hit.placeKind)).filter((hit) => !brief.cuisines.length || (hit.cuisines ?? []).some((id) => brief.cuisines.includes(id)));
	const shortlist = constrainMakan(gathered, brief);
	let routed = false;
	let walked = [];
	if (!shortlist.length) walked = [];
	else if (walkLimit) {
		const routes = await footRoutes(originPoint, shortlist);
		if (!routes) {
			if (!input.allowDistance) return {
				originLabel: originPoint.label,
				originAddress: originPoint.label,
				brief,
				hits: [],
				pool: shortlist.length,
				note: "Walking routes are temporarily unavailable.",
				source: "rules",
				routed: false,
				status: "routes"
			};
			walked = shortlist.map((hit) => ({
				...hit,
				verified: false,
				why: "Straight-line distance — walking time not verified."
			}));
		} else {
			const applied = applyVerifiedWalks(shortlist, routes, brief.minutes);
			walked = applied.kept;
			applied.resolved;
			routed = true;
		}
	} else walked = shortlist.map((hit) => ({
		...hit,
		verified: false,
		why: "Straight-line distance — walking time not verified."
	}));
	const filtered = walked;
	const status = gathered.length > 0 && shortlist.length === 0 ? "filters" : !routed || !walkLimit ? filtered.length ? "distance" : walked.length ? "filters" : "walk" : walked.length === 0 ? "walk" : "ok";
	let ranked = status === "ok" || status === "distance" ? filtered : [];
	ranked = sortMakanHits(ranked, "closest");
	if (input.explain && status === "ok" && ranked.length > 1) {
		const catalog = ranked.slice(0, 8).map((hit) => ({
			id: hit.id,
			name: hit.name,
			minutes: hit.minutes,
			price: hit.approxSgd,
			dietary: hit.dietary,
			cuisine: hit.cuisine
		}));
		const raw = await askJson(`${KAIROS_VOICE} These places were already found on the map and already passed the walk and the filters. why is one sentence about why this real place fits. Mention hawker, cafe, or restaurant only if that is already in the fields. Do not invent a place, price, hours, rating, or review. Do not drop a place. Do not add a place that is not in the list.`, JSON.stringify({
			brief: input.text.slice(0, 240),
			places: catalog
		}), "makan_rank", whySchema);
		if (raw && typeof raw === "object" && Array.isArray(raw.picks)) {
			const picks = raw.picks;
			const byId = new Map(ranked.map((hit) => [hit.id, hit]));
			for (const pick of picks) {
				const hit = pick.id ? byId.get(pick.id) : void 0;
				if (!hit) continue;
				const why = String(pick.why ?? "").replace(/\s+/g, " ").trim().slice(0, 180);
				if (why && !foreignName(why, [hit.name]) && !/\d(\.\d)?\s*star|rating|review/i.test(why)) hit.why = why;
			}
			ranked = sortMakanHits(ranked, "closest");
			source = "grok";
		}
	}
	const constraint = makanConstraint(brief);
	const note = status === "filters" ? `No places matched all the filters: ${constraint}.` : status === "walk" ? `No suitable places found within a ${brief.minutes}-minute walk.` : status === "distance" ? "Straight-line distance — walking time not verified." : `${filtered.length} ${filtered.length === 1 ? "match" : "matches"} found in Kairos's current place sources. Walking times are verified. This is not every food place nearby.`;
	return {
		originLabel: originPoint.label,
		originAddress: originPoint.label,
		brief,
		hits: ranked,
		pool: filtered.length,
		note,
		source,
		routed: status === "ok",
		status
	};
}
async function shapeOuting(input) {
	let brief = parseOuting(input.text);
	if (input.areaId) brief.areaId = input.areaId;
	if (input.groupSize) brief.groupSize = input.groupSize;
	if (input.budget) brief.budget = input.budget;
	let source = "rules";
	if (input.text.trim().length > 8) {
		const raw = await askJson("Read an outing brief. Do not invent venues. energy is low, moderate, or high. budget_per_person is a number. avoid_notes is a short phrase or empty. area is a Singapore neighbourhood or empty.", input.text.slice(0, 500), "outing_brief", outingSchema);
		if (raw && typeof raw === "object") {
			const record = raw;
			const area = matchArea(String(record.area ?? ""));
			const energy = String(record.energy ?? "");
			brief = {
				...brief,
				groupSize: clampInt(record.group_size, brief.groupSize, 2, 80),
				budget: clampInt(record.budget_per_person, brief.budget, 0, 200),
				areaId: input.areaId || area?.id || brief.areaId,
				areaLabel: area?.label || String(record.area ?? brief.areaLabel).slice(0, 40),
				when: String(record.when_label ?? brief.when).slice(0, 40),
				hours: clampInt(record.hours, brief.hours, 1, 8),
				energy: energy === "low" || energy === "high" || energy === "moderate" ? energy : brief.energy
			};
			const avoid = String(record.avoid_notes ?? "").toLowerCase();
			if (avoid.includes("dinner")) brief.avoid = [.../* @__PURE__ */ new Set([...brief.avoid, "dinner-only"])];
			if (avoid.includes("child") || avoid.includes("embarrass")) brief.avoid = [.../* @__PURE__ */ new Set([...brief.avoid, "childish"])];
			if (avoid.includes("hr") || avoid.includes("corporate")) brief.avoid = [.../* @__PURE__ */ new Set([...brief.avoid, "corporate"])];
			source = "grok";
		}
	}
	brief.budget = input.budget;
	brief.budgetMin = input.budgetMin ?? 0;
	const origin = originFromArea(brief.areaId, `${brief.areaLabel} ${input.text}`) ?? await geocode(brief.areaLabel || input.text);
	let concepts = buildConcepts(origin, brief);
	if (concepts.length) {
		const allowed = concepts.flatMap((concept) => concept.stops.map((stop) => stop.name));
		const raw = await askJson(`${KAIROS_VOICE} Rewrite outing concepts. Use only the given ids. title may combine the provided stop names and nothing else. why is one sentence about a real leisure stop in the list. Do not add venues, prices, or a claim that something is scientifically better. Do not mention booking availability.`, JSON.stringify({
			brief: input.text.slice(0, 300),
			concepts: concepts.map((concept) => ({
				id: concept.id,
				personality: concept.personality,
				stops: concept.stops.map((stop) => stop.name),
				why: concept.why
			}))
		}), "outing_phrase", phraseSchema);
		if (raw && typeof raw === "object" && Array.isArray(raw.concepts)) {
			const phrases = raw.concepts;
			concepts = concepts.map((concept) => {
				const phrase = phrases.find((item) => item.id === concept.id);
				if (!phrase) return concept;
				const title = String(phrase.title ?? "").replace(/\s+/g, " ").trim().slice(0, 60);
				const why = String(phrase.why ?? "").replace(/\s+/g, " ").trim().slice(0, 200);
				const names = concept.stops.map((stop) => stop.name);
				return {
					...concept,
					title: title && !foreignName(title, allowed) ? title : concept.title,
					why: why && !foreignName(why, names) ? why : concept.why
				};
			});
			source = "grok";
		}
	}
	return {
		brief,
		concepts,
		source,
		originLabel: origin?.label || brief.areaLabel || "Singapore"
	};
}
//#endregion
export { reverseLabel, searchMakan, searchPlaces, shapeOuting };
