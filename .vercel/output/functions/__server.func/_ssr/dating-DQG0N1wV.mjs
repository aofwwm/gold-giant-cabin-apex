//#region node_modules/.nitro/vite/services/ssr/assets/dating-DQG0N1wV.js
var DATE_TYPES = [
	"first",
	"casual",
	"night",
	"anniversary",
	"surprise",
	"married",
	"parents"
];
var DATE_VIBES = [
	"cosy",
	"romantic",
	"fun",
	"chill",
	"classy",
	"playful",
	"quiet",
	"scenic",
	"foodie",
	"artsy",
	"active"
];
var DATE_FOODS = [
	"dinner",
	"cafe",
	"dessert",
	"drinks",
	"museum",
	"workshop",
	"walk",
	"view",
	"games",
	"karaoke",
	"picnic",
	"nature"
];
var clamp = (value, min, max) => Math.max(min, Math.min(max, Math.round(value)));
var SEEN_KEY = "kairos-dating-seen-v1";
function seenAreaKey(lat, lng) {
	return `${lat.toFixed(2)}:${lng.toFixed(2)}`;
}
function neighborKeys(lat, lng) {
	const keys = [];
	for (const dLat of [
		-.01,
		0,
		.01
	]) for (const dLng of [
		-.01,
		0,
		.01
	]) keys.push(seenAreaKey(lat + dLat, lng + dLng));
	return keys;
}
function readSeenPlaces(lat, lng) {
	if (typeof localStorage === "undefined") return [];
	try {
		const book = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
		const out = [];
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
function rememberSeenPlaces(lat, lng, ids) {
	if (typeof localStorage === "undefined") return;
	try {
		const book = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
		const key = seenAreaKey(lat, lng);
		const prev = Array.isArray(book[key]) ? book[key] : [];
		book[key] = [...ids.filter(Boolean), ...prev.filter((id) => !ids.includes(id))].slice(0, 16);
		const keys = Object.keys(book);
		if (keys.length > 14) for (const old of keys.slice(0, keys.length - 14)) delete book[old];
		localStorage.setItem(SEEN_KEY, JSON.stringify(book));
	} catch {}
}
function scoreDating(places, input) {
	const lead = places[0];
	const vibeHits = lead ? input.vibes.filter((vibe) => lead.vibes.includes(vibe)).length : 0;
	const vibe = input.vibes.length ? clamp(vibeHits / input.vibes.length * 25, vibeHits ? 8 : 4, 25) : 16;
	const practical = input.travelMin == null ? 8 : input.travelMin <= input.maxTravel ? clamp(20 - Math.floor(input.travelMin / 15), 10, 20) : 4;
	const outdoorLead = lead?.setting === "outdoor";
	const moment = input.weatherOutdoor == null ? 12 : outdoorLead && !input.weatherOutdoor ? 6 : 18;
	const flow = input.stops >= 3 ? 15 : input.stops === 2 ? 12 : 7;
	const known = places.reduce((sum, place) => sum + (place.approxSgd > 0 ? place.approxSgd * 2 : 0), 0);
	const value = input.freeOnly ? known === 0 ? 10 : 2 : known === 0 ? 6 : known <= input.budget ? 10 : 3;
	const weather = input.weatherOutdoor == null ? 5 : outdoorLead && !input.weatherOutdoor ? 2 : input.weatherOutdoor ? 10 : 8;
	const lines = [
		vibeHits ? "The place matches the vibe you asked for." : "The vibe is a loose fit.",
		input.travelMin != null ? `${input.travelMin} min on a verified route.` : "Travel time was not verified.",
		known > 0 ? `Typical couple spend ~$${known}. Not a quote.` : "Price unavailable on at least one stop."
	];
	return {
		total: clamp(vibe + practical + moment + flow + value + weather, 0, 100),
		vibe,
		practical,
		moment,
		flow,
		value,
		weather,
		lines
	};
}
//#endregion
export { rememberSeenPlaces as a, readSeenPlaces as i, DATE_TYPES as n, scoreDating as o, DATE_VIBES as r, DATE_FOODS as t };
