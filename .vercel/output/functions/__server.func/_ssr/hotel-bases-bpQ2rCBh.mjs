import { d as distanceMeters } from "./coord-Cq5LMP_P.mjs";
import { a as explicitChildAges, i as dayLabel, o as hasYoungChild, r as addDays } from "./travel-tYjUPdjH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hotel-bases-bpQ2rCBh.js
var DEFAULT_HOTEL_PREFERENCES = {
	preset: "overall",
	budget: "any",
	currency: "SGD",
	quality: "any",
	qualityMust: false,
	burden: "balanced",
	room: "any",
	roomMust: false,
	ac: "any",
	acMust: false,
	noise: "any",
	style: "any",
	location: "itinerary",
	bed: "any",
	breakfast: false,
	wheelchair: false,
	parking: false
};
function emptyHotelMemory() {
	return {
		shown: [],
		previous: [],
		kept: [],
		rejected: [],
		reasons: {},
		similar: ""
	};
}
function presetPreferences(preset, current = DEFAULT_HOTEL_PREFERENCES) {
	const next = {
		...current,
		preset
	};
	if (preset === "overall") return {
		...next,
		burden: "balanced",
		style: "any",
		location: "itinerary"
	};
	if (preset === "location") return {
		...next,
		burden: "minimise",
		location: "itinerary"
	};
	if (preset === "minimum-travel") return {
		...next,
		burden: "minimise",
		location: "itinerary"
	};
	if (preset === "quiet") return {
		...next,
		noise: "prefer",
		location: "quiet-area",
		burden: "balanced"
	};
	if (preset === "value") return {
		...next,
		budget: current.budget === "any" ? "under-150" : current.budget,
		quality: "3",
		qualityMust: false,
		style: "value"
	};
	if (preset === "family") return {
		...next,
		style: "family"
	};
	if (preset === "luxury") return {
		...next,
		quality: "5",
		qualityMust: false,
		style: "luxury"
	};
	return next;
}
function budgetText(prefs) {
	const unit = prefs.currency === "EUR" ? "€" : prefs.currency === "JPY" ? "¥" : prefs.currency === "USD" ? "US$" : "S$";
	if (prefs.budget === "under-150") return `Under ${unit}150 / night`;
	if (prefs.budget === "150-250") return `${unit}150–250 / night`;
	if (prefs.budget === "250-400") return `${unit}250–400 / night`;
	if (prefs.budget === "400-600") return `${unit}400–600 / night`;
	if (prefs.budget === "over-600") return `${unit}600+ / night`;
	return "Any nightly budget";
}
function metersBetween(aLat, aLng, bLat, bLng) {
	const p1 = aLat * Math.PI / 180;
	const p2 = bLat * Math.PI / 180;
	const dLat = (bLat - aLat) * Math.PI / 180;
	const dLng = (bLng - aLng) * Math.PI / 180;
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2;
	return 12742e3 * Math.asin(Math.min(1, Math.sqrt(h)));
}
function minutesFor(meters, move) {
	if (meters < 80) return 1;
	return Math.max(1, Math.round(meters / (move === "walk" ? 75 : 450)));
}
function dayClusters(stops) {
	const groups = /* @__PURE__ */ new Map();
	for (const stop of stops) {
		if (stop.day == null || stop.category === "stay") continue;
		const list = groups.get(stop.day) ?? [];
		list.push({
			lat: stop.lat,
			lng: stop.lng
		});
		groups.set(stop.day, list);
	}
	return [...groups.entries()].map(([day, list]) => ({
		day,
		lat: list.reduce((sum, item) => sum + item.lat, 0) / list.length,
		lng: list.reduce((sum, item) => sum + item.lng, 0) / list.length,
		count: list.length
	})).sort((a, b) => a.day - b.day);
}
function median(values) {
	if (!values.length) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 ? sorted[mid] ?? 0 : Math.round(((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2);
}
function burden(hotel, clusters, move) {
	const perDay = clusters.map((cluster) => minutesFor(metersBetween(hotel.lat, hotel.lng, cluster.lat, cluster.lng), move));
	const average = perDay.length ? Math.round(perDay.reduce((sum, value) => sum + value, 0) / perDay.length) : 0;
	const longest = perDay.length ? Math.max(...perDay) : 0;
	return {
		perDay,
		average,
		median: median(perDay),
		longest,
		close: perDay.filter((value) => value <= 20).length
	};
}
function locationLine(days, close, average, longest, nightlife) {
	const word = average <= 15 && longest <= 30 ? "Excellent" : average <= 25 ? "Good" : average <= 40 ? "Workable" : "Far";
	if (!days) return "No sightseeing days were set, so this is only the mapped hotel.";
	return `${word} for this trip. ${close} of ${days} ${nightlife ? "planned evening stops" : "sightseeing days"} start within about 20 min. Estimated average first leg: ${average} min. Longest: ${longest} min. Distance estimate, not a live route.`;
}
function judge(hotel, prefs, load, memory, liked, locationGap) {
	const matches = [];
	const unverified = [];
	let excluded = false;
	const floor = prefs.quality === "any" ? 0 : Number(prefs.quality);
	if (floor) {
		if (hotel.stars == null) unverified.push(`${floor}★+`);
		else if (hotel.stars >= floor) matches.push({
			label: `${floor}★+`,
			state: "met"
		});
		else if (prefs.qualityMust) excluded = true;
	}
	const room = prefs.room === "any" ? 0 : Number(prefs.room);
	if (room) {
		if (hotel.roomSqm == null) unverified.push(`${room} m²+ room`);
		else if (hotel.roomSqm >= room) matches.push({
			label: `${room} m²+ room`,
			state: "met"
		});
		else if (prefs.roomMust) excluded = true;
	}
	if (prefs.ac === "individual") {
		unverified.push("Individual room control");
		if (hotel.air === "yes") matches.push({
			label: "Hotel air conditioning",
			state: "met"
		});
		else if (hotel.air === "unknown") unverified.push("Hotel air conditioning");
	} else if (prefs.ac === "ac") {
		if (hotel.air === "yes") matches.push({
			label: "Air conditioning",
			state: "met"
		});
		else if (hotel.air === "no" && prefs.acMust) excluded = true;
		else unverified.push("Air conditioning");
	}
	if (prefs.noise !== "any") unverified.push(prefs.noise === "strong" ? "Strongly quiet rooms" : "Quiet rooms");
	if (prefs.budget !== "any") unverified.push(budgetText(prefs));
	if (prefs.bed !== "any") unverified.push(`${prefs.bed} bed`);
	if (locationGap) unverified.push(locationGap);
	if (prefs.breakfast) {
		if (hotel.breakfast === "yes") matches.push({
			label: "Breakfast",
			state: "met"
		});
		else if (hotel.breakfast === "no") excluded = true;
		else unverified.push("Breakfast");
	}
	if (prefs.wheelchair) {
		if (hotel.wheelchair === "yes") matches.push({
			label: "Wheelchair access",
			state: "met"
		});
		else if (hotel.wheelchair === "no") excluded = true;
		else unverified.push("Wheelchair access");
	}
	if (prefs.parking) {
		if (hotel.parking === "yes") matches.push({
			label: "Parking",
			state: "met"
		});
		else if (hotel.parking === "no") excluded = true;
		else unverified.push("Parking");
	}
	if (prefs.style === "luxury") {
		if (hotel.stars != null && hotel.stars >= 5) matches.push({
			label: "Luxury, from a verified 5★",
			state: "met"
		});
		else unverified.push("Luxury style");
	} else if (prefs.style === "family") unverified.push("Family room layout");
	else if (prefs.style !== "any" && prefs.style !== "value") unverified.push(`${prefs.style} style`);
	const weight = prefs.burden === "minimise" ? 8 : prefs.burden === "loose" ? 1.5 : 4;
	let score = 1e3 - load.average * weight - load.longest * .35 + load.close * 12;
	if (floor && hotel.stars != null && hotel.stars >= floor) score += 40 + (hotel.stars - floor) * 8;
	if (room && hotel.roomSqm != null && hotel.roomSqm >= room) score += 25;
	if (prefs.ac === "ac" && hotel.air === "yes") score += 15;
	if (prefs.style === "luxury" && hotel.stars != null && hotel.stars >= 5) score += 20;
	if (prefs.style === "value" && hotel.kind === "guest_house") score += 8;
	if (liked && liked.id !== hotel.id && metersBetween(hotel.lat, hotel.lng, liked.lat, liked.lng) < 900) score += 30;
	if (liked && liked.id !== hotel.id && liked.stars != null && hotel.stars != null && liked.stars === hotel.stars) score += 15;
	if (memory.reasons[hotel.id] === "too-far") score -= 200;
	if (memory.reasons[hotel.id] === "too-basic" && hotel.stars != null && hotel.stars <= 3) score -= 80;
	return {
		excluded,
		matches,
		unverified,
		score
	};
}
function adjusted(score, id, memory) {
	if (memory.kept.includes(id)) return score + 1e4;
	if (memory.rejected.includes(id)) return score - 5e3;
	if (memory.previous.includes(id)) return score - 800;
	if (memory.shown.includes(id)) return score - 400;
	return score;
}
function takeShortlist(ranked, memory, hold) {
	const eligible = new Map(ranked.map((item) => [item.hotel.id, item]));
	const held = [...new Set(hold.filter((id) => eligible.has(id)))];
	const heldSet = new Set(held);
	const fillers = ranked.filter((item) => !heldSet.has(item.hotel.id));
	const previous = memory.previous.filter((id, index, all) => all.indexOf(id) === index).slice(0, 3);
	if (!previous.length) {
		const kept = ranked.filter((item) => memory.kept.includes(item.hotel.id));
		const rest = ranked.filter((item) => !memory.kept.includes(item.hotel.id));
		return [...kept, ...rest].slice(0, 3);
	}
	const slots = previous.map((id) => heldSet.has(id) ? eligible.get(id) ?? null : null);
	while (slots.length < 3) slots.push(null);
	for (const id of held) {
		if (slots.some((slot) => slot?.hotel.id === id)) continue;
		const empty = slots.findIndex((slot) => !slot);
		if (empty >= 0) slots[empty] = eligible.get(id) ?? null;
	}
	const placed = slots.filter((slot) => Boolean(slot));
	let cursor = 0;
	for (let index = 0; index < slots.length; index += 1) {
		if (slots[index]) continue;
		let pick = null;
		while (cursor < fillers.length) {
			const item = fillers[cursor];
			cursor += 1;
			if (!item) break;
			if (placed.some((other) => metersBetween(item.hotel.lat, item.hotel.lng, other.hotel.lat, other.hotel.lng) < 150) && cursor < fillers.length) continue;
			pick = item;
			break;
		}
		slots[index] = pick;
		if (pick) placed.push(pick);
	}
	return slots.filter((slot) => Boolean(slot)).slice(0, 3);
}
function shortlistHotels(candidates, stops, prefs, memory = emptyHotelMemory(), move = "walk", hold = []) {
	const unique = [];
	for (const hotel of candidates) {
		if (!hotel.name || !Number.isFinite(hotel.lat) || !Number.isFinite(hotel.lng)) continue;
		if (unique.some((item) => item.id === hotel.id || item.name.toLowerCase() === hotel.name.toLowerCase())) continue;
		unique.push(hotel);
	}
	const days = dayClusters(stops);
	const nightlife = prefs.location === "nightlife" ? dayClusters(stops.filter((stop) => stop.category === "nightlife")) : [];
	const clusters = nightlife.length ? nightlife : days;
	const locationGap = prefs.location === "station" ? "Near a major station" : prefs.location === "quiet-area" ? "Quiet neighbourhood" : prefs.location === "airport" ? "Near the airport" : prefs.location === "attraction" ? "Near one chosen attraction" : prefs.location === "nightlife" && !nightlife.length ? "Near nightlife" : "";
	const liked = unique.find((item) => item.id === memory.similar) ?? null;
	const chosen = takeShortlist([...unique.map((hotel) => {
		const load = burden(hotel, clusters, move);
		const result = judge(hotel, prefs, load, memory, liked, locationGap);
		let score = result.score;
		for (const other of unique) {
			if (other.id === hotel.id) continue;
			const reason = memory.reasons[other.id];
			if (!reason) continue;
			const near = metersBetween(hotel.lat, hotel.lng, other.lat, other.lng) < 500;
			if ((reason === "too-far" || reason === "area" || reason === "too-noisy") && near) score -= 120;
			if (reason === "too-small" && hotel.roomSqm != null && other.roomSqm != null && hotel.roomSqm <= other.roomSqm) score -= 80;
			if (reason === "too-basic" && hotel.stars != null && other.stars != null && hotel.stars <= other.stars) score -= 80;
		}
		return {
			hotel,
			load,
			...result,
			score
		};
	}).filter((item) => !item.excluded)].sort((a, b) => {
		const exposure = (id) => memory.rejected.includes(id) ? 3 : memory.previous.includes(id) ? 2 : memory.shown.includes(id) ? 1 : 0;
		return exposure(a.hotel.id) - exposure(b.hotel.id) || adjusted(b.score, b.hotel.id, memory) - adjusted(a.score, a.hotel.id, memory) || a.hotel.name.localeCompare(b.hotel.name);
	}), memory, hold.length ? hold : memory.kept);
	const topId = chosen[0]?.hotel.id ?? "";
	return chosen.map((item) => {
		const others = chosen.filter((other) => other.hotel.id !== item.hotel.id);
		const shorter = item.hotel.id !== topId && others.length > 0 && others.every((other) => item.load.average + 3 < other.load.average);
		const highestStars = item.hotel.stars != null && item.hotel.id !== topId && others.every((other) => (other.hotel.stars ?? -1) < (item.hotel.stars ?? -1));
		const reasons = [
			clusters.length ? `${item.load.close} of ${clusters.length} ${nightlife.length ? "evening stops" : "planned days"} are close` : "Mapped hotel. The days were not set.",
			shorter ? "Shorter estimated first leg than the other shortlisted hotels" : "",
			...item.matches.map((match) => match.label)
		].filter(Boolean).slice(0, 4);
		const longer = others.find((other) => other.load.average + 5 < item.load.average);
		const mustGap = item.unverified.filter((label) => prefs.qualityMust && label.includes("★") || prefs.roomMust && label.includes("m²") || prefs.acMust && /control|conditioning/i.test(label) || prefs.breakfast && label === "Breakfast" || prefs.wheelchair && label === "Wheelchair access");
		const tradeoffs = [longer ? `Longer estimated first leg than ${longer.hotel.name}` : "", mustGap.length ? `We couldn't verify: ${mustGap.join(", ")}.` : ""].filter(Boolean);
		const far = item.load.close === 0 || item.load.average >= 90 || item.load.longest >= 180;
		const role = memory.kept.includes(item.hotel.id) ? "Kept" : item.hotel.id === topId ? far ? "Far from these days" : "Best overall" : shorter ? "Lowest travel burden" : highestStars ? "Highest verified rating" : "Also fits this trip";
		return {
			stopId: item.hotel.id,
			name: item.hotel.name,
			role,
			why: reasons.join(". "),
			reasons,
			tradeoffs,
			matches: item.matches,
			unverified: item.unverified,
			location: locationLine(clusters.length, item.load.close, item.load.average, item.load.longest, nightlife.length > 0),
			averageMin: item.load.average,
			longestMin: item.load.longest,
			closeDays: item.load.close,
			dayCount: clusters.length,
			booked: false
		};
	});
}
function rememberShortlist(memory, cards) {
	const ids = cards.map((card) => card.stopId);
	return {
		...memory,
		previous: ids,
		shown: [.../* @__PURE__ */ new Set([...memory.shown, ...ids])].slice(-40)
	};
}
var OPEN = "Public walk and drive routing. Not live traffic, and not a production promise. No transit feed is connected.";
`${OPEN}`, `${OPEN}`, `${OPEN}`, `${OPEN}`, `${OPEN}`;
var LEG_FILLER = /not live traffic|no fare is shown|comfortable choice|sensible hop|recommended option|best fit for this journey|kairos chose|chosen from the times|walking is the sensible|fits a backpacking|slow day intact|reasonable for an active|fewer long walks/i;
/** A reason is shown only when it tells the traveller something the time itself does not. */
function legRecommendation(input) {
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
function usefulLegReason(reason, child) {
	const text = (reason ?? "").replace(/\s+/g, " ").trim();
	if (!text || LEG_FILLER.test(text)) return "";
	if (/young child|stroller|child-friendly|family walking/i.test(text) && !child) return "";
	if (/cuts walking from \d{3,}/i.test(text)) return "Walking is not practical for this hop.";
	return text;
}
var NAV_KEY = "kairos-nav-app";
function readNavPreference() {
	if (typeof localStorage === "undefined") return "automatic";
	const raw = localStorage.getItem(NAV_KEY);
	if (raw === "google" || raw === "apple" || raw === "amap" || raw === "kakao" || raw === "naver" || raw === "automatic") return raw;
	return "automatic";
}
function writeNavPreference(value) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(NAV_KEY, value);
}
function detectPlatform(ua = typeof navigator === "undefined" ? "" : navigator.userAgent) {
	if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
	if (/Android/i.test(ua)) return "android";
	if (/Macintosh|Mac OS X/i.test(ua)) return "mac";
	return "other";
}
function inferCountry(lat, lng, code) {
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
function automaticNav(country, platform) {
	const code = country.toUpperCase();
	if (code === "CN") return "amap";
	if (code === "KR") return "kakao";
	if (platform === "ios" || platform === "mac") return "apple";
	return "google";
}
function handoffChoices(country) {
	const code = country.toUpperCase();
	if (code === "CN") return [
		"amap",
		"apple",
		"google",
		"kakao",
		"naver"
	];
	if (code === "KR") return [
		"kakao",
		"naver",
		"google",
		"apple",
		"amap"
	];
	return [
		"google",
		"apple",
		"amap",
		"kakao",
		"naver"
	];
}
function navLabel(app) {
	if (app === "google") return "Google Maps";
	if (app === "apple") return "Apple Maps";
	if (app === "amap") return "Amap";
	if (app === "kakao") return "Kakao Map";
	return "Naver Map";
}
function googleMode(mode) {
	if (mode === "walk") return "walking";
	if (mode === "transit") return "transit";
	return "driving";
}
function appleFlag(mode) {
	if (mode === "walk") return "w";
	if (mode === "transit") return "r";
	return "d";
}
function amapMode(mode) {
	if (mode === "walk") return "walk";
	if (mode === "transit") return "bus";
	return "car";
}
function inChina(lat, lng) {
	if (lat < 18 || lat > 53.6 || lng < 73.5 || lng > 134.8) return false;
	if (lat > 33 && lat < 43.1 && lng > 124.1 && lng < 131.9) return false;
	if (lng > 130.8 && lat > 30) return false;
	return true;
}
/** WGS-84 to GCJ-02. Used only so an Amap link inside China is not sent as the wrong system. */
function wgsToGcj(lat, lng) {
	if (!inChina(lat, lng)) return {
		lat,
		lng
	};
	const transformLat = (x, y) => {
		let value = -100 + 2 * x + 3 * y + .2 * y * y + .1 * x * y + .2 * Math.sqrt(Math.abs(x));
		value += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
		value += (20 * Math.sin(y * Math.PI) + 40 * Math.sin(y / 3 * Math.PI)) * 2 / 3;
		value += (160 * Math.sin(y / 12 * Math.PI) + 320 * Math.sin(y * Math.PI / 30)) * 2 / 3;
		return value;
	};
	const transformLng = (x, y) => {
		let value = 300 + x + 2 * y + .1 * x * x + .1 * x * y + .1 * Math.sqrt(Math.abs(x));
		value += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
		value += (20 * Math.sin(x * Math.PI) + 40 * Math.sin(x / 3 * Math.PI)) * 2 / 3;
		value += (150 * Math.sin(x / 12 * Math.PI) + 300 * Math.sin(x / 30 * Math.PI)) * 2 / 3;
		return value;
	};
	let dLat = transformLat(lng - 105, lat - 35);
	let dLng = transformLng(lng - 105, lat - 35);
	const rad = lat / 180 * Math.PI;
	let magic = Math.sin(rad);
	magic = 1 - .006693421622965943 * magic * magic;
	const sqrt = Math.sqrt(magic);
	dLat = dLat * 180 / (6335552.717000426 / (magic * sqrt) * Math.PI);
	dLng = dLng * 180 / (6378245 / sqrt * Math.cos(rad) * Math.PI);
	return {
		lat: lat + dLat,
		lng: lng + dLng
	};
}
function navigationHref(app, from, to, mode) {
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
	if (app === "kakao") return `https://map.kakao.com/link/to/${encodeURIComponent(to.name || "Destination")},${to.lat},${to.lng}`;
	const option = mode === "walk" ? "walk" : mode === "transit" ? "transit" : "car";
	return `https://map.naver.com/p/directions/${`${from.lng},${from.lat},${encodeURIComponent(from.name || "Start")},,`}/${`${to.lng},${to.lat},${encodeURIComponent(to.name || "End")},,`}/-/${option}`;
}
var NON_LATIN = /[\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]/;
function hasNonLatin(text) {
	return NON_LATIN.test(text);
}
/** Common OSM admin names that arrive in local script. Not an itinerary. */
var ADMIN_ENGLISH = {
	"東京都": "Tokyo",
	"東京": "Tokyo",
	"東京市": "Tokyo",
	"大阪市": "Osaka",
	"大阪": "Osaka",
	"大阪府": "Osaka",
	"京都市": "Kyoto",
	"京都": "Kyoto",
	"京都府": "Kyoto",
	"名古屋市": "Nagoya",
	"名古屋": "Nagoya",
	"愛知県": "Aichi",
	"北海道": "Hokkaido",
	"日本": "Japan",
	"서울": "Seoul",
	"서울특별시": "Seoul",
	"대한민국": "South Korea",
	"成都市": "Chengdu",
	"成都": "Chengdu",
	"四川省": "Sichuan",
	"中国": "China",
	"パリ": "Paris",
	"フランス": "France",
	"싱가포르": "Singapore",
	"สิงคโปร์": "Singapore",
	"กรุงเทพมหานคร": "Bangkok"
};
/** English label for a generated sentence. Local script stays off headings and meal lines. */
function englishAreaName(name, fallback = "") {
	const clean = (name || "").replace(/\s+/g, " ").trim();
	if (ADMIN_ENGLISH[clean]) return ADMIN_ENGLISH[clean];
	if (clean && !hasNonLatin(clean)) return clean;
	const other = (fallback || "").replace(/\s+/g, " ").trim();
	if (ADMIN_ENGLISH[other]) return ADMIN_ENGLISH[other];
	if (other && !hasNonLatin(other)) return other;
	return clean || other || "this area";
}
/** Day theme text. Strips a repeated prefix, then prefers an English area name. */
function cleanTheme(title, fallback = "") {
	let text = (title || "").replace(/\s+/g, " ").trim();
	while (/^More time in\s+/i.test(text)) text = text.replace(/^More time in\s+/i, "").trim();
	text = text.replace(/^More of (the\s+)?/i, "").trim();
	return englishAreaName(text, fallback);
}
/** A full day titled only with the destination is geography, not a plan. */
function isGenericDayTheme(theme, destination) {
	const text = (theme || "").replace(/\s+/g, " ").trim().toLowerCase();
	const place = (destination || "").replace(/\s+/g, " ").trim().toLowerCase();
	if (!text || text === "this area") return true;
	const bare = text.replace(/^(more time in|more of|more)\s+/i, "").trim();
	if (!bare) return true;
	if (place && (bare === place || text === place)) return true;
	return false;
}
function tidyLatin(text) {
	const clean = text.replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
	if (!clean || hasNonLatin(clean)) return "";
	const letters = clean.replace(/[^A-Za-z]+/g, "");
	if (!letters) return clean;
	const allLower = letters === letters.toLowerCase();
	const allUpper = letters === letters.toUpperCase() && letters.length > 3;
	if (!allLower && !allUpper) return clean;
	return clean.replace(/[A-Za-z]+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}
function sourceLanguage(text, countryCode = "", lat, lng) {
	let kana = 0;
	let hangul = 0;
	let thai = 0;
	let arab = 0;
	let cyr = 0;
	let han = 0;
	for (const ch of text) {
		const code = ch.codePointAt(0) ?? 0;
		if (code >= 12352 && code <= 12543) kana += 1;
		else if (code >= 44032 && code <= 55215) hangul += 1;
		else if (code >= 3584 && code <= 3711) thai += 1;
		else if (code >= 1536 && code <= 1791) arab += 1;
		else if (code >= 1024 && code <= 1279) cyr += 1;
		else if (code >= 13312 && code <= 40959) han += 1;
	}
	if (kana > 0) return "ja";
	if (hangul > 0) return "ko";
	if (thai > 0) return "th";
	if (arab > 0) return "ar";
	if (cyr > 0) return "ru";
	if (han > 0) return hanLanguage(countryCode, lat, lng);
	return "und";
}
function hanLanguage(countryCode, lat, lng) {
	const country = countryCode.toUpperCase();
	if (country === "JP") return "ja";
	if (country === "KR" || country === "KP") return "ko";
	if (country === "CN" || country === "TW" || country === "HK" || country === "MO") return "zh";
	if (country === "TH") return "th";
	if (lat != null && lng != null) {
		if (lng >= 129 && lng <= 146 && lat >= 24 && lat <= 46) return "ja";
		if (lng >= 124 && lng < 130 && lat >= 33 && lat <= 39) return "ko";
		if (lng >= 73 && lng < 125 && lat >= 18 && lat <= 45) return "zh";
	}
	return "zh";
}
/**
* Pick the user-facing name. English is the Travel default.
* Order: official English, source Latin name, deterministic romanisation, cached translation.
* A low-confidence translation never replaces the romanised name.
* `userLanguage` is reserved so a future UI language can lead with the local name.
* This does not replace the canonical source name.
*/
function resolvePlaceDisplayName(input, userLanguage = "en") {
	const canonical = input.name.replace(/\s+/g, " ").trim();
	const language = sourceLanguage(input.nameLocal || canonical, input.countryCode, input.lat, input.lng);
	const local = (input.nameLocal || (hasNonLatin(canonical) ? canonical : "")).trim();
	const official = tidyLatin(input.nameEn || "");
	const latinTag = tidyLatin(input.nameLatin || "");
	const roman = tidyLatin(input.romanized || "");
	let nameEnglish = "";
	let nameRomanized = latinTag || roman;
	let displayName = "";
	let quality = "unresolved";
	let source = "unresolved";
	if (official) {
		nameEnglish = official;
		displayName = official;
		quality = "official";
		source = input.englishSource || "official_en";
		if (!nameRomanized) nameRomanized = official;
	} else if (canonical && !hasNonLatin(canonical)) {
		displayName = canonical;
		nameEnglish = canonical;
		nameRomanized = nameRomanized || canonical;
		quality = "official";
		source = "source_name";
	} else if (latinTag) {
		displayName = latinTag;
		nameRomanized = latinTag;
		quality = "romanised";
		source = "osm_name_latin";
	} else if (roman) {
		displayName = roman;
		nameRomanized = roman;
		quality = "romanised";
		source = "transliteration";
	}
	const translated = input.translated;
	const translatedEnglish = tidyLatin(translated?.english || "");
	const verifiedLatin = Boolean(latinTag) && !official && hasNonLatin(canonical);
	if (translated && translated.confidence !== "low" && translatedEnglish && quality !== "official" && !verifiedLatin) {
		if (!roman || translationFits(roman, translatedEnglish) || translationFits(translated.romanized || "", translatedEnglish)) {
			displayName = translatedEnglish;
			nameEnglish = translatedEnglish;
			const translatedRoman = tidyLatin(translated.romanized || "");
			if (translatedRoman) nameRomanized = translatedRoman;
			else if (!nameRomanized) nameRomanized = translatedEnglish;
			quality = "translated";
			source = "gemini";
		}
	}
	if (!displayName) {
		displayName = canonical;
		quality = "unresolved";
		source = "unresolved";
	}
	const subtitle = local && local !== displayName ? local : "";
	const leadLocal = userLanguage !== "en" && userLanguage === language && local;
	return {
		nameLocal: local,
		nameEnglish,
		nameRomanized,
		displayName: leadLocal ? local : displayName,
		displaySubtitle: leadLocal ? nameEnglish && nameEnglish !== local ? nameEnglish : "" : subtitle,
		language,
		translationSource: source,
		displayNameQuality: quality
	};
}
/** A translation has to share a token with the romanisation, so it cannot become a different attraction. */
function translationFits(romanized, english) {
	const tokens = romanized.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((word) => word.length >= 3);
	if (!tokens.length) return false;
	const hay = english.toLowerCase();
	return tokens.some((word) => hay.includes(word));
}
/**
* Turn a deterministic reading into the form a traveller expects.
* Proper nouns stay romanised. Only generic endings and a few official chain names are adjusted.
*/
function polishReading(local, romanized, language) {
	const clean = romanized.replace(/\s+/g, " ").trim();
	if (!clean || !local.trim()) return clean;
	if (language === "ja") return polishJapanese(local, clean);
	if (language === "zh") return polishChinese(local, clean);
	if (language === "ko") return polishKorean(local, clean);
	return clean;
}
function polishJapanese(local, romanized) {
	let text = romanized;
	if (local.includes("東横イン")) text = text.replace(/Higashiyoko\s+In\b/i, "Toyoko Inn");
	if (local.includes("桜通")) text = text.replace(/Sakura\s+Dori\b/i, "Sakuradori");
	if (local.includes("口")) text = text.replace(/\s+Guchi\b/i, "-guchi");
	for (const [ending, pattern, english] of [
		[
			"タワー",
			/\s*Tawa$/i,
			" Tower"
		],
		[
			"城",
			/\s*Jo$/i,
			" Castle"
		],
		[
			"駅",
			/\s*Eki$/i,
			" Station"
		],
		[
			"神社",
			/\s*Jinja$/i,
			" Shrine"
		],
		[
			"寺",
			/\s*(?:Ji|Tera)$/i,
			" Temple"
		]
	]) {
		if (!local.endsWith(ending) || !pattern.test(text)) continue;
		return `${text.replace(pattern, "").trim()}${english}`.replace(/\s+/g, " ").trim();
	}
	if (local.includes("七宝") && local.includes("参考館")) text = text.replace(/\bDai\s+Kichi\b/i, "Daikichi").replace(/\bBijutsu\b/i, "Art").replace(/\bShippoyaki\b/i, "Cloisonne").replace(/\bSanko\s+Kan\b/i, "Reference Museum").replace(/\bArt\s+Cloisonne\b/i, "Cloisonne Art");
	return text.replace(/\s+/g, " ").trim();
}
function polishChinese(local, romanized) {
	for (const [ending, pattern, english] of [
		[
			"博物馆",
			/\s*Bo Wu Guan$/i,
			" Museum"
		],
		[
			"美术馆",
			/\s*Mei Shu Guan$/i,
			" Art Museum"
		],
		[
			"纪念馆",
			/\s*Ji Nian Guan$/i,
			" Memorial"
		],
		[
			"祠",
			/\s*Ci$/i,
			" Shrine"
		],
		[
			"寺",
			/\s*Si$/i,
			" Temple"
		],
		[
			"塔",
			/\s*Ta$/i,
			" Tower"
		],
		[
			"站",
			/\s*Zhan$/i,
			" Station"
		],
		[
			"宫",
			/\s*Gong$/i,
			" Palace"
		]
	]) {
		if (!local.endsWith(ending) || !pattern.test(romanized)) continue;
		const stem = romanized.replace(pattern, "").trim();
		const parts = stem.split(/\s+/).filter(Boolean);
		const joined = parts.length > 0 && parts.length <= 3 && parts.every((part) => part.length <= 4) ? parts.join("") : stem;
		return `${joined ? joined.charAt(0).toUpperCase() + joined.slice(1).toLowerCase() : joined}${english}`.trim();
	}
	return romanized;
}
function polishKorean(local, romanized) {
	if (local.endsWith("궁") && !/palace/i.test(romanized)) return `${romanized} Palace`;
	if (local.endsWith("역") && !/station/i.test(romanized)) return `${romanized.replace(/\s*Yeok$/i, "").trim()} Station`;
	return romanized;
}
/** Japanese municipal addresses: city, ward, and block. The local line is stored separately. */
function polishAddress(local, romanized, language) {
	const text = romanized.replace(/\s+/g, " ").trim();
	if (language !== "ja" || !text || !local.trim()) return text;
	const normalized = local.includes("本丸") ? text.replace(/\bHommaru\b/g, "Honmaru") : text;
	const ward = normalized.match(/^(.+?)\s+Shi\s+(.+?)\s+Ku\s+(.+?)\s+(\d+)\s*-\s*(\d+)$/i);
	if (ward) {
		const block = ward[3].replace(/\s+/g, "");
		return `${ward[4]}-${ward[5]} ${block}, ${ward[2]} Ward, ${ward[1]}`;
	}
	return normalized.replace(/\s+-\s+/g, "-");
}
function readableName(place) {
	const display = (place.displayName || "").replace(/\s+/g, " ").trim();
	if (display && !hasNonLatin(display)) return display;
	const name = (place.name || "").replace(/\s+/g, " ").trim();
	if (name && !hasNonLatin(name)) return name;
	return display || name;
}
function localSubtitle(place) {
	const lead = readableName(place);
	const explicit = (place.displaySubtitle || "").replace(/\s+/g, " ").trim();
	if (explicit && explicit !== lead) return explicit;
	const local = (place.nameLocal || place.localName || "").replace(/\s+/g, " ").trim();
	if (local && local !== lead) return local;
	const name = (place.name || "").replace(/\s+/g, " ").trim();
	if (hasNonLatin(name) && name !== lead) return name;
	return "";
}
/** Label passed to a local map app. Coordinates still do the routing. */
function routeLabel(place) {
	const local = (place.nameLocal || place.localName || "").replace(/\s+/g, " ").trim();
	if (local) return local;
	return (place.name || "").trim();
}
function placeCopy(place) {
	const raw = (place.description || "").replace(/\s+/g, " ").trim();
	const description = (place.descriptionDisplay || "").replace(/\s+/g, " ").trim() || (!hasNonLatin(raw) ? raw : "");
	const descriptionLocal = raw && hasNonLatin(raw) && raw !== description ? raw : "";
	const addressRaw = (place.address || "").replace(/\s+/g, " ").trim();
	const addressEn = (place.addressDisplay || "").replace(/\s+/g, " ").trim();
	const address = (addressEn && !hasNonLatin(addressEn) ? addressEn : "") || (!hasNonLatin(addressRaw) ? addressRaw : "");
	const storedLocal = (place.addressLocal || (hasNonLatin(addressRaw) ? addressRaw : "")).replace(/\s+/g, " ").trim();
	return {
		description,
		descriptionLocal,
		address,
		addressLocal: storedLocal && storedLocal !== address ? storedLocal : ""
	};
}
function placeMatches(place, query) {
	const needle = query.trim().toLowerCase();
	if (!needle) return true;
	return [
		place.name,
		place.nameLocal,
		place.localName,
		place.nameEn,
		place.nameLatin,
		place.nameEnglish,
		place.nameRomanized,
		place.displayName,
		place.displaySubtitle
	].some((field) => (field ?? "").toLowerCase().includes(needle));
}
var LATIN_LANG = /* @__PURE__ */ new Set([
	"en",
	"fr",
	"de",
	"es",
	"it",
	"pt",
	"nl",
	"ms",
	"id",
	"vi",
	"pl",
	"sv",
	"no",
	"da",
	"fi",
	"cs",
	"hu",
	"ro",
	"tr",
	"ca"
]);
/** Official languages for the destination, not a random Wikidata label. */
function destinationLanguages(countryCode) {
	return {
		FR: ["fr"],
		MC: ["fr"],
		BE: ["nl", "fr"],
		CH: [
			"de",
			"fr",
			"it"
		],
		DE: ["de"],
		AT: ["de"],
		IT: ["it"],
		ES: ["es"],
		PT: ["pt"],
		NL: ["nl"],
		LU: ["fr", "de"],
		JP: ["ja"],
		KR: ["ko"],
		CN: [
			"zh",
			"zh-hans",
			"zh-cn"
		],
		TW: [
			"zh-hant",
			"zh-tw",
			"zh"
		],
		HK: [
			"zh-hant",
			"zh-hk",
			"zh"
		],
		MO: ["zh-hant", "zh"],
		SG: [
			"en",
			"ms",
			"zh",
			"ta"
		],
		MY: [
			"ms",
			"en",
			"zh"
		],
		TH: ["th"],
		VN: ["vi"],
		ID: ["id"],
		AE: ["ar", "en"],
		SA: ["ar"],
		RU: ["ru"],
		US: ["en"],
		GB: ["en"],
		AU: ["en"],
		CA: ["en", "fr"],
		IE: ["en"],
		NZ: ["en"]
	}[countryCode.toUpperCase()] ?? ["en"];
}
/** A local subtitle has to be a language the destination actually uses. */
function localNameFits(text, countryCode) {
	const value = text.replace(/\s+/g, " ").trim();
	if (!value) return false;
	if (!countryCode.trim()) return true;
	const langs = destinationLanguages(countryCode);
	if (!hasNonLatin(value)) return langs.some((lang) => LATIN_LANG.has(lang.split("-")[0] ?? lang));
	const script = sourceLanguage(value, countryCode);
	if (script === "und") return false;
	if (script === "zh") return langs.some((lang) => lang === "zh" || lang.startsWith("zh-"));
	return langs.some((lang) => lang === script || lang.startsWith(`${script}-`));
}
function tidyLocalLabel(value) {
	const clean = value.replace(/\s+/g, " ").trim();
	if (!clean || hasNonLatin(clean)) return clean.slice(0, 80);
	return (clean.charAt(0).toUpperCase() + clean.slice(1)).slice(0, 80);
}
/**
* Keep a local name only when it belongs to the destination.
* A Japanese or Chinese label is not the local name of a French place.
*/
function destinationLocalName(input) {
	const country = (input.countryCode || "").toUpperCase();
	const english = tidyLatin(input.nameEn || "");
	const ordered = [{
		value: input.nameLocal || "",
		source: "destination_language"
	}, {
		value: input.name || "",
		source: "source_name"
	}];
	for (const row of ordered) {
		const value = tidyLocalLabel(row.value);
		if (!value) continue;
		if (country && !localNameFits(value, country)) continue;
		if (english && value.toLowerCase() === english.toLowerCase()) continue;
		return {
			name: value,
			source: row.source
		};
	}
	return {
		name: "",
		source: ""
	};
}
var GAZETTEER = [
	{
		id: "westminster",
		destinationId: "london",
		areaId: "westminster",
		areaName: "Westminster",
		name: "Palace of Westminster",
		localName: "Palace of Westminster",
		lat: 51.4995,
		lng: -.1248,
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 75,
		category: "historic",
		wikidataId: "Q3444573",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "british-museum",
		destinationId: "london",
		areaId: "museums",
		areaName: "Bloomsbury",
		name: "British Museum",
		localName: "British Museum",
		lat: 51.5194,
		lng: -.1269,
		groups: ["heritage"],
		tier: "core",
		duration: 120,
		category: "museum",
		indoor: true,
		wikidataId: "Q6373",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "tower-london",
		destinationId: "london",
		areaId: "tower",
		areaName: "The Tower",
		name: "Tower of London",
		localName: "Tower of London",
		lat: 51.5081,
		lng: -.0759,
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 90,
		category: "historic",
		wikidataId: "Q62378",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "london-eye",
		destinationId: "london",
		areaId: "south-bank",
		areaName: "South Bank",
		name: "London Eye",
		localName: "London Eye",
		lat: 51.5033,
		lng: -.1195,
		groups: ["landmark", "views"],
		tier: "strong",
		duration: 50,
		category: "viewpoint",
		wikidataId: "Q205293",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "borough-market",
		destinationId: "london",
		areaId: "south-bank",
		areaName: "South Bank",
		name: "Borough Market",
		localName: "Borough Market",
		lat: 51.5055,
		lng: -.091,
		groups: ["food", "neighbourhood"],
		tier: "strong",
		duration: 60,
		category: "market",
		wikidataId: "Q658434",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "windsor-castle",
		destinationId: "london",
		areaId: "windsor",
		areaName: "Windsor",
		name: "Windsor Castle",
		localName: "Windsor Castle",
		lat: 51.4839,
		lng: -.6044,
		groups: ["heritage"],
		tier: "core",
		duration: 120,
		category: "historic",
		excursion: "full",
		wikidataId: "Q42646",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "greenwich",
		destinationId: "london",
		areaId: "greenwich",
		areaName: "Greenwich",
		name: "Royal Observatory",
		localName: "Royal Observatory Greenwich",
		lat: 51.4778,
		lng: -.0014,
		groups: ["heritage", "landmark"],
		tier: "strong",
		duration: 70,
		category: "historic",
		excursion: "half",
		wikidataId: "Q192688",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "gyeongbokgung",
		destinationId: "seoul",
		areaId: "jongno",
		areaName: "Jongno",
		name: "Gyeongbokgung",
		localName: "경복궁",
		lat: 37.5796,
		lng: 126.977,
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 90,
		category: "historic",
		wikidataId: "Q492410",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "bukchon",
		destinationId: "seoul",
		areaId: "jongno",
		areaName: "Jongno",
		name: "Bukchon Hanok Village",
		localName: "북촌한옥마을",
		lat: 37.5826,
		lng: 126.985,
		groups: ["neighbourhood", "heritage"],
		tier: "strong",
		duration: 60,
		category: "historic",
		wikidataId: "Q498746",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "changdeokgung",
		destinationId: "seoul",
		areaId: "jongno",
		areaName: "Jongno",
		name: "Changdeokgung",
		localName: "창덕궁",
		lat: 37.5794,
		lng: 126.991,
		groups: ["heritage"],
		tier: "strong",
		duration: 80,
		category: "historic",
		wikidataId: "Q478096",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "namsan",
		destinationId: "seoul",
		areaId: "namsan",
		areaName: "Namsan",
		name: "N Seoul Tower",
		localName: "N서울타워",
		lat: 37.5512,
		lng: 126.9882,
		groups: ["views", "landmark"],
		tier: "strong",
		duration: 60,
		category: "viewpoint",
		wikidataId: "Q494734",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "hwaseong",
		destinationId: "seoul",
		areaId: "suwon",
		areaName: "Suwon",
		name: "Hwaseong Fortress",
		localName: "화성",
		lat: 37.2857,
		lng: 127.0124,
		groups: ["heritage"],
		tier: "core",
		duration: 90,
		category: "historic",
		excursion: "full",
		wikidataId: "Q495094",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "colosseum",
		destinationId: "rome",
		areaId: "ancient",
		areaName: "Ancient Rome",
		name: "Colosseum",
		localName: "Colosseo",
		lat: 41.8902,
		lng: 12.4922,
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 90,
		category: "historic",
		wikidataId: "Q10285",
		sources: [
			"wikidata",
			"wikivoyage",
			"wikipedia"
		]
	},
	{
		id: "forum",
		destinationId: "rome",
		areaId: "ancient",
		areaName: "Ancient Rome",
		name: "Roman Forum",
		localName: "Foro Romano",
		lat: 41.8925,
		lng: 12.4853,
		groups: ["heritage"],
		tier: "core",
		duration: 70,
		category: "historic",
		wikidataId: "Q187578",
		sources: [
			"wikidata",
			"wikivoyage",
			"wikipedia"
		]
	},
	{
		id: "vatican",
		destinationId: "rome",
		areaId: "vatican",
		areaName: "Vatican",
		name: "Vatican Museums",
		localName: "Musei Vaticani",
		lat: 41.9065,
		lng: 12.4536,
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 150,
		category: "museum",
		indoor: true,
		wikidataId: "Q182955",
		sources: [
			"wikidata",
			"wikivoyage",
			"wikipedia"
		]
	},
	{
		id: "trevi",
		destinationId: "rome",
		areaId: "centre",
		areaName: "Centro",
		name: "Trevi Fountain",
		localName: "Fontana di Trevi",
		lat: 41.9009,
		lng: 12.4833,
		groups: ["landmark", "neighbourhood"],
		tier: "strong",
		duration: 30,
		category: "landmark",
		wikidataId: "Q186125",
		sources: [
			"wikidata",
			"wikivoyage",
			"wikipedia"
		]
	},
	{
		id: "tivoli",
		destinationId: "rome",
		areaId: "tivoli",
		areaName: "Tivoli",
		name: "Villa d'Este",
		localName: "Villa d'Este",
		lat: 41.9636,
		lng: 12.7965,
		groups: ["heritage", "nature"],
		tier: "strong",
		duration: 90,
		category: "garden",
		excursion: "full",
		wikidataId: "Q821299",
		sources: [
			"wikidata",
			"wikivoyage",
			"wikipedia"
		]
	},
	{
		id: "sagrada",
		destinationId: "barcelona",
		areaId: "eixample",
		areaName: "Eixample",
		name: "Sagrada Família",
		localName: "Sagrada Família",
		lat: 41.4036,
		lng: 2.1744,
		groups: ["landmark", "heritage"],
		tier: "core",
		duration: 90,
		category: "historic",
		wikidataId: "Q48435",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "gothic",
		destinationId: "barcelona",
		areaId: "gothic",
		areaName: "Gothic Quarter",
		name: "Barcelona Cathedral",
		localName: "Catedral de Barcelona",
		lat: 41.3839,
		lng: 2.1762,
		groups: ["heritage", "neighbourhood"],
		tier: "strong",
		duration: 50,
		category: "historic",
		wikidataId: "Q17155",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "guell",
		destinationId: "barcelona",
		areaId: "guell",
		areaName: "Park Güell",
		name: "Park Güell",
		localName: "Park Güell",
		lat: 41.4145,
		lng: 2.1527,
		groups: ["landmark", "nature"],
		tier: "strong",
		duration: 70,
		category: "garden",
		wikidataId: "Q212013",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "montjuic",
		destinationId: "barcelona",
		areaId: "montjuic",
		areaName: "Montjuïc",
		name: "Montjuïc",
		localName: "Montjuïc",
		lat: 41.3634,
		lng: 2.1649,
		groups: ["views", "nature"],
		tier: "strong",
		duration: 70,
		category: "viewpoint",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "montserrat",
		destinationId: "barcelona",
		areaId: "montserrat",
		areaName: "Montserrat",
		name: "Santa Maria de Montserrat",
		localName: "Santa Maria de Montserrat",
		lat: 41.593,
		lng: 1.837,
		groups: ["heritage", "nature"],
		tier: "core",
		duration: 120,
		category: "historic",
		excursion: "full",
		wikidataId: "Q1128683",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "odori",
		destinationId: "hokkaido",
		areaId: "sapporo",
		areaName: "Sapporo",
		name: "Odori Park",
		localName: "大通公園",
		lat: 43.0596,
		lng: 141.347,
		groups: ["neighbourhood", "nature"],
		tier: "core",
		duration: 50,
		category: "park",
		wikidataId: "Q1194787",
		sources: [
			"wikidata",
			"wikivoyage",
			"tourism-board"
		]
	},
	{
		id: "nijo-market",
		destinationId: "hokkaido",
		areaId: "sapporo-park",
		areaName: "Sapporo",
		name: "Nijo Market",
		localName: "二条市場",
		lat: 43.062,
		lng: 141.354,
		groups: ["food"],
		tier: "strong",
		duration: 50,
		category: "market",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "otaru-canal",
		destinationId: "hokkaido",
		areaId: "otaru",
		areaName: "Otaru",
		name: "Otaru Canal",
		localName: "小樽運河",
		lat: 43.196,
		lng: 141.002,
		groups: ["neighbourhood"],
		tier: "strong",
		duration: 70,
		category: "landmark",
		excursion: "half",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "blue-pond",
		destinationId: "hokkaido",
		areaId: "biei",
		areaName: "Biei",
		name: "Blue Pond",
		localName: "青い池",
		lat: 43.4934,
		lng: 142.6142,
		groups: ["nature"],
		tier: "core",
		duration: 40,
		category: "viewpoint",
		excursion: "full",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "farm-tomita",
		destinationId: "hokkaido",
		areaId: "furano",
		areaName: "Furano",
		name: "Farm Tomita",
		localName: "ファーム富田",
		lat: 43.419,
		lng: 142.429,
		groups: ["nature"],
		tier: "strong",
		duration: 60,
		category: "garden",
		excursion: "full",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "hallgrimskirkja",
		destinationId: "iceland",
		areaId: "reykjavik",
		areaName: "Reykjavík",
		name: "Hallgrímskirkja",
		localName: "Hallgrímskirkja",
		lat: 64.1417,
		lng: -21.9266,
		groups: ["landmark"],
		tier: "core",
		duration: 40,
		category: "historic",
		wikidataId: "Q547340",
		sources: ["wikidata", "wikivoyage"]
	},
	{
		id: "thingvellir",
		destinationId: "iceland",
		areaId: "golden",
		areaName: "Golden Circle",
		name: "Þingvellir",
		localName: "Þingvellir",
		lat: 64.255,
		lng: -21.129,
		groups: ["nature", "heritage"],
		tier: "core",
		duration: 70,
		category: "park",
		excursion: "full",
		wikidataId: "Q844882",
		sources: ["wikidata", "wikivoyage"]
	},
	{
		id: "geysir",
		destinationId: "iceland",
		areaId: "golden",
		areaName: "Golden Circle",
		name: "Geysir",
		localName: "Geysir",
		lat: 64.3104,
		lng: -20.3024,
		groups: ["nature"],
		tier: "core",
		duration: 40,
		category: "viewpoint",
		excursion: "full",
		wikidataId: "Q217437",
		sources: ["wikidata", "wikivoyage"]
	},
	{
		id: "skogafoss",
		destinationId: "iceland",
		areaId: "south",
		areaName: "South Coast",
		name: "Skógafoss",
		localName: "Skógafoss",
		lat: 63.5321,
		lng: -19.5114,
		groups: ["nature"],
		tier: "core",
		duration: 40,
		category: "viewpoint",
		excursion: "full",
		wikidataId: "Q826123",
		sources: ["wikidata", "wikivoyage"]
	},
	{
		id: "jokulsarlon",
		destinationId: "iceland",
		areaId: "south",
		areaName: "South Coast",
		name: "Jökulsárlón",
		localName: "Jökulsárlón",
		lat: 64.0784,
		lng: -16.2306,
		groups: ["nature"],
		tier: "strong",
		duration: 50,
		category: "viewpoint",
		excursion: "full",
		wikidataId: "Q834127",
		sources: ["wikidata", "wikivoyage"]
	},
	{
		id: "ubud-palace",
		destinationId: "bali",
		areaId: "ubud",
		areaName: "Ubud",
		name: "Ubud Palace",
		localName: "Puri Saren Agung",
		lat: -8.5065,
		lng: 115.2626,
		groups: ["heritage", "neighbourhood"],
		tier: "core",
		duration: 40,
		category: "historic",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "monkey-forest",
		destinationId: "bali",
		areaId: "ubud",
		areaName: "Ubud",
		name: "Sacred Monkey Forest",
		localName: "Mandala Suci Wenara Wana",
		lat: -8.5183,
		lng: 115.2586,
		groups: ["nature"],
		tier: "strong",
		duration: 60,
		category: "park",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "tegallalang",
		destinationId: "bali",
		areaId: "ubud-ridge",
		areaName: "Ubud ridge",
		name: "Tegallalang Rice Terrace",
		localName: "Tegallalang",
		lat: -8.4312,
		lng: 115.2792,
		groups: ["nature"],
		tier: "core",
		duration: 50,
		category: "viewpoint",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "uluwatu-temple",
		destinationId: "bali",
		areaId: "uluwatu",
		areaName: "Uluwatu",
		name: "Uluwatu Temple",
		localName: "Pura Luhur Uluwatu",
		lat: -8.8291,
		lng: 115.0849,
		groups: ["heritage", "views"],
		tier: "core",
		duration: 70,
		category: "historic",
		excursion: "full",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "tanah-lot",
		destinationId: "bali",
		areaId: "tanah-lot",
		areaName: "Tanah Lot",
		name: "Tanah Lot",
		localName: "Pura Tanah Lot",
		lat: -8.6212,
		lng: 115.0868,
		groups: ["heritage", "views"],
		tier: "strong",
		duration: 60,
		category: "historic",
		excursion: "half",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "tekapo",
		destinationId: "nz-south-island",
		areaId: "tekapo",
		areaName: "Lake Tekapo",
		name: "Lake Tekapo",
		localName: "Lake Tekapo",
		lat: -44.0047,
		lng: 170.4771,
		groups: ["nature"],
		tier: "core",
		duration: 60,
		category: "viewpoint",
		excursion: "full",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "aoraki",
		destinationId: "nz-south-island",
		areaId: "aoraki",
		areaName: "Aoraki / Mount Cook",
		name: "Aoraki / Mount Cook",
		localName: "Aoraki",
		lat: -43.734,
		lng: 170.096,
		groups: ["nature"],
		tier: "core",
		duration: 90,
		category: "viewpoint",
		excursion: "full",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "queenstown-gardens",
		destinationId: "nz-south-island",
		areaId: "queenstown",
		areaName: "Queenstown",
		name: "Queenstown Gardens",
		localName: "Queenstown Gardens",
		lat: -45.038,
		lng: 168.66,
		groups: ["nature", "neighbourhood"],
		tier: "strong",
		duration: 50,
		category: "park",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "wanaka",
		destinationId: "nz-south-island",
		areaId: "wanaka",
		areaName: "Wanaka",
		name: "Lake Wanaka",
		localName: "Lake Wānaka",
		lat: -44.694,
		lng: 169.142,
		groups: ["nature"],
		tier: "strong",
		duration: 50,
		category: "viewpoint",
		sources: ["wikivoyage", "tourism-board"]
	},
	{
		id: "milford",
		destinationId: "nz-south-island",
		areaId: "milford",
		areaName: "Milford Sound",
		name: "Milford Sound",
		localName: "Piopiotahi",
		lat: -44.671,
		lng: 167.926,
		groups: ["nature"],
		tier: "core",
		duration: 120,
		category: "viewpoint",
		excursion: "full",
		sources: ["wikivoyage", "tourism-board"]
	}
];
var cache = /* @__PURE__ */ new Map();
var facts = [];
var curated = [];
var builds = 0;
var persist = null;
function setDestinationFacts(rows) {
	facts = rows;
}
function registerCuratedPacks(packs) {
	curated = packs;
}
function onKnowledgePersist(save) {
	persist = save;
}
function exportKnowledgeSnapshot() {
	return [...cache.values()].filter((pack) => pack.status !== "VERIFIED");
}
function importKnowledgeSnapshot(packs) {
	for (const pack of packs) {
		if (!pack?.id || !pack.anchors?.length || cache.has(pack.id)) continue;
		cache.set(pack.id, pack);
	}
}
function today() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function slug(value) {
	return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function scopeOf(scope) {
	if (scope === "country") return "COUNTRY";
	if (scope === "region") return "REGION";
	if (scope === "island") return "ISLAND";
	if (scope === "nature") return "NATURE_REGION";
	if (scope === "road") return "ROAD_TRIP_REGION";
	if (scope === "excursion") return "EXCURSION_AREA";
	if (scope === "corridor") return "MULTI_DESTINATION_CORRIDOR";
	return "CITY";
}
function validCoord(lat, lng) {
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
	if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
	if (Math.abs(lat) < .01 && Math.abs(lng) < .01) return false;
	return true;
}
function findFact(name) {
	const text = name.trim().toLowerCase();
	const id = slug(name);
	return facts.find((fact) => fact.id === id || fact.id === text || fact.name.toLowerCase() === text || fact.aliases.some((alias) => alias.toLowerCase() === text));
}
function findCurated(name) {
	const text = name.trim().toLowerCase();
	const head = text.split(",")[0]?.trim() ?? text;
	const id = slug(head);
	return curated.find((pack) => pack.id === id || pack.id === head || pack.aliases.includes(text) || pack.aliases.includes(head));
}
function childrenOf(id) {
	return facts.filter((fact) => fact.parent === id);
}
function anchorFromGazetteer(place) {
	if (!validCoord(place.lat, place.lng)) return null;
	if (!place.name.trim()) return null;
	return {
		id: place.id,
		name: place.name,
		localName: place.localName || place.name,
		lat: place.lat,
		lng: place.lng,
		areaId: place.areaId,
		areaName: place.areaName,
		groups: place.groups,
		tier: place.tier,
		duration: place.duration,
		category: place.category,
		indoor: place.indoor ?? place.category === "museum",
		excursion: place.excursion ?? "none",
		wikidataId: place.wikidataId,
		sources: place.sources ?? ["wikidata", "wikivoyage"]
	};
}
function areaAnchor(area, sources) {
	if (!validCoord(area.lat, area.lng)) return null;
	const groups = area.groups.length ? area.groups : ["landmark"];
	const heritage = groups.includes("heritage");
	const nature = groups.includes("nature");
	const category = groups.includes("food") ? "market" : nature ? "park" : heritage ? "historic" : "landmark";
	const excursion = area.role === "day-trip" || area.role === "excursion" ? "full" : "none";
	return {
		id: area.id,
		name: area.name,
		localName: area.name,
		lat: area.lat,
		lng: area.lng,
		areaId: area.id,
		areaName: area.name,
		groups,
		tier: area.role === "day-trip" || area.role === "focus" ? "core" : "strong",
		duration: excursion === "full" ? 150 : 75,
		category,
		indoor: false,
		excursion,
		sources
	};
}
function patternsFor(destination, anchors, fact, evidence) {
	const areas = /* @__PURE__ */ new Map();
	for (const anchor of anchors) {
		const list = areas.get(anchor.areaId) ?? [];
		list.push(anchor);
		areas.set(anchor.areaId, list);
	}
	const patterns = [];
	for (const [areaId, rows] of areas) {
		const meta = fact?.areas.find((area) => area.id === areaId);
		const theme = meta?.name && !isGenericDayTheme(meta.name, destination) ? meta.name : rows[0]?.areaName && !isGenericDayTheme(rows[0].areaName, destination) ? rows[0].areaName : rows[0]?.name ?? "";
		if (!theme || isGenericDayTheme(theme, destination)) continue;
		const mode = meta?.role === "day-trip" ? "DAY_TRIP" : meta?.role === "excursion" || rows.some((row) => row.excursion === "full") ? "EXCURSION" : "STAY";
		const groups = [...new Set(rows.flatMap((row) => row.groups))];
		patterns.push({
			id: `${slug(destination)}-${areaId}`,
			theme,
			areaIds: [areaId],
			requiredGroups: groups.slice(0, 2),
			anchorIds: rows.map((row) => row.id),
			optionalGroups: groups.slice(2),
			visitMode: mode,
			expectedMinutes: rows.reduce((sum, row) => sum + row.duration, 0),
			evidence
		});
	}
	return patterns;
}
function packShell(input) {
	const groups = [...new Set(input.anchors.flatMap((anchor) => anchor.groups))];
	const clusters = /* @__PURE__ */ new Map();
	for (const anchor of input.anchors) {
		const current = clusters.get(anchor.areaId) ?? {
			id: anchor.areaId,
			name: anchor.areaName,
			lat: anchor.lat,
			lng: anchor.lng,
			anchorIds: []
		};
		current.anchorIds.push(anchor.id);
		clusters.set(anchor.areaId, current);
	}
	const sourceTypes = new Set(input.evidence.map((row) => row.sourceType));
	const confidence = input.status === "VERIFIED" ? "high" : input.anchors.length >= 4 && sourceTypes.size >= 2 ? "high" : input.anchors.length >= 3 ? "medium" : "low";
	const bases = (input.fact?.areas ?? []).filter((area) => area.role === "base").map((area) => ({
		areaId: area.id,
		role: "primary-base"
	}));
	const excursions = (input.fact?.areas ?? []).filter((area) => area.role === "day-trip" || area.role === "excursion").map((area) => ({
		from: bases[0]?.areaId || input.id,
		to: area.id,
		relation: area.role === "excursion" ? "excursion" : "day-trip",
		anchorIds: input.anchors.filter((anchor) => anchor.areaId === area.id).map((anchor) => anchor.id)
	}));
	const stamp = today();
	return {
		id: input.id,
		destinationId: input.id,
		destinationName: input.name,
		destinationScope: input.scope,
		countryCode: input.countryCode,
		parentDestinationId: input.parent,
		childDestinationIds: input.children ?? childrenOf(input.id).map((fact) => fact.id),
		playbookIds: [input.id],
		experienceGroups: groups,
		anchors: input.anchors,
		dayPatterns: input.patterns,
		excursionRelationships: excursions,
		baseRelationships: bases,
		geographicClusters: [...clusters.values()],
		durationGuidance: input.patterns.map((pattern) => ({
			patternId: pattern.id,
			minutes: pattern.expectedMinutes
		})),
		seasonNotes: [],
		sourceEvidence: input.evidence,
		unresolvedHints: input.unresolved,
		status: input.status,
		confidence,
		version: 1,
		createdAt: stamp,
		lastVerified: stamp
	};
}
function compileFact(fact) {
	const places = GAZETTEER.filter((place) => place.destinationId === fact.id);
	const covered = new Set(places.map((place) => place.areaId));
	const sourceTypes = [...new Set(fact.sources.map((source) => source.sourceType))];
	const anchors = [];
	for (const place of places) {
		const anchor = anchorFromGazetteer(place);
		if (anchor) anchors.push(anchor);
	}
	const unresolved = [];
	for (const area of fact.areas) {
		if (area.later) continue;
		if (covered.has(area.id)) {
			for (const hint of area.hints) if (!anchors.some((anchor) => anchor.areaId === area.id && anchor.name.toLowerCase().includes(hint.toLowerCase())) && hint.length > 2) unresolved.push(hint);
			continue;
		}
		if (area.name.trim().toLowerCase() === fact.name.trim().toLowerCase()) {
			unresolved.push(...area.hints);
			continue;
		}
		const anchor = areaAnchor(area, sourceTypes.length ? sourceTypes : ["wikivoyage"]);
		if (anchor) anchors.push(anchor);
		else unresolved.push(area.name);
	}
	const evidence = fact.sources.map((source) => ({
		name: source.name,
		sourceType: source.sourceType,
		sourceUrl: source.sourceUrl
	}));
	if (places.length) evidence.push({
		name: "Open place gazetteer",
		sourceType: "wikidata",
		sourceUrl: "https://www.wikidata.org/"
	});
	const patterns = patternsFor(fact.name, anchors, fact, evidence.map((row) => row.name));
	const status = anchors.length >= 3 ? "COMPILED" : "THIN";
	return packShell({
		id: fact.id,
		name: fact.name,
		scope: scopeOf(fact.scope),
		countryCode: fact.countryCode,
		parent: fact.parent,
		anchors,
		patterns,
		evidence,
		unresolved: [...new Set(unresolved)].slice(0, 12),
		status,
		fact
	});
}
function compileCurated(pack, fact) {
	const evidence = fact?.sources.map((source) => ({
		name: source.name,
		sourceType: source.sourceType,
		sourceUrl: source.sourceUrl
	})) ?? [];
	evidence.push({
		name: "Verified anchor pack",
		sourceType: "wikidata",
		sourceUrl: "https://www.wikidata.org/"
	});
	return packShell({
		id: pack.id,
		name: fact?.name ?? pack.id,
		scope: scopeOf(fact?.scope ?? "city"),
		countryCode: fact?.countryCode ?? "",
		parent: fact?.parent,
		anchors: pack.anchors,
		patterns: pack.patterns,
		evidence,
		unresolved: [],
		status: "VERIFIED",
		fact
	});
}
function compileChildren(id, name) {
	const kids = childrenOf(id);
	if (!kids.length && !GAZETTEER.some((place) => place.destinationId === id)) return null;
	const anchors = [];
	const seen = /* @__PURE__ */ new Set();
	for (const child of kids) {
		const pack = ensureDestinationKnowledge(child.name);
		for (const anchor of pack?.anchors ?? []) {
			if (anchor.tier === "optional" || anchor.tier === "niche") continue;
			if (seen.has(anchor.id)) continue;
			seen.add(anchor.id);
			anchors.push(anchor);
		}
	}
	for (const place of GAZETTEER.filter((item) => item.destinationId === id)) {
		const anchor = anchorFromGazetteer(place);
		if (!anchor || seen.has(anchor.id)) continue;
		seen.add(anchor.id);
		anchors.push(anchor);
	}
	if (!anchors.length) return null;
	const fact = findFact(name);
	return packShell({
		id,
		name: fact?.name ?? name,
		scope: fact ? scopeOf(fact.scope) : kids.length ? "COUNTRY" : "REGION",
		countryCode: fact?.countryCode ?? kids[0]?.countryCode ?? "",
		parent: fact?.parent,
		anchors,
		patterns: patternsFor(fact?.name ?? name, anchors, fact, ["Child destination knowledge"]),
		evidence: [{
			name: "Composed from regional knowledge",
			sourceType: "wikivoyage",
			sourceUrl: "https://en.wikivoyage.org/"
		}],
		unresolved: [],
		status: anchors.length >= 3 ? "COMPILED" : "THIN",
		children: kids.map((child) => child.id),
		fact
	});
}
function buildDestinationAnchorPack(destination) {
	const curatedPack = findCurated(destination);
	if (curatedPack) return compileCurated(curatedPack, findFact(curatedPack.id) ?? findFact(destination));
	const fact = findFact(destination);
	if (fact && (fact.areas.length || GAZETTEER.some((place) => place.destinationId === fact.id))) return compileFact(fact);
	const id = slug(destination);
	if (GAZETTEER.some((place) => place.destinationId === id)) return compileFact({
		id,
		name: destination.trim(),
		aliases: [id],
		scope: "region",
		countryCode: "",
		areas: [],
		sources: [{
			name: "Open place gazetteer",
			sourceType: "wikidata",
			sourceUrl: "https://www.wikidata.org/"
		}]
	});
	return compileChildren(fact?.id ?? id, fact?.name ?? destination.trim());
}
function ensureDestinationKnowledge(destination) {
	const key = (findCurated(destination)?.id ?? findFact(destination)?.id ?? slug(destination)).trim();
	if (!key) return null;
	const cached = cache.get(key);
	if (cached) return cached;
	builds += 1;
	const pack = buildDestinationAnchorPack(destination);
	if (!pack) {
		builds -= 1;
		return null;
	}
	cache.set(pack.id, pack);
	persist?.(exportKnowledgeSnapshot());
	return pack;
}
function knowledgeAnchors(destination) {
	return ensureDestinationKnowledge(destination)?.anchors ?? [];
}
function knowledgePatterns(destination) {
	return ensureDestinationKnowledge(destination)?.dayPatterns ?? [];
}
function anchor$1(input) {
	return {
		id: input.id,
		name: input.name,
		localName: input.localName,
		lat: input.lat,
		lng: input.lng,
		areaId: input.areaId,
		areaName: input.areaName,
		groups: input.groups,
		tier: input.tier,
		duration: input.duration,
		category: input.category,
		indoor: input.indoor ?? false,
		excursion: input.excursion ?? "none",
		wikidataId: input.wikidataId,
		sources: input.sources ?? [
			"wikidata",
			"wikivoyage",
			"wikipedia"
		]
	};
}
function pattern(input) {
	return input;
}
var tokyoAnchors = [
	anchor$1({
		id: "tokyo-tower",
		name: "Tokyo Tower",
		localName: "東京タワー",
		lat: 35.6586,
		lng: 139.7454,
		areaId: "tokyo",
		areaName: "Tokyo",
		groups: ["landmark", "views"],
		tier: "core",
		duration: 75,
		category: "viewpoint",
		wikidataId: "Q267221"
	}),
	anchor$1({
		id: "imperial-gardens",
		name: "Imperial Palace East Gardens",
		localName: "皇居東御苑",
		lat: 35.686,
		lng: 139.757,
		areaId: "tokyo",
		areaName: "Tokyo",
		groups: ["heritage", "nature"],
		tier: "strong",
		duration: 75,
		category: "garden"
	}),
	anchor$1({
		id: "hamarikyu",
		name: "Hama-rikyu Gardens",
		localName: "浜離宮恩賜庭園",
		lat: 35.6597,
		lng: 139.7634,
		areaId: "tokyo",
		areaName: "Tokyo",
		groups: ["nature", "heritage"],
		tier: "strong",
		duration: 70,
		category: "garden"
	}),
	anchor$1({
		id: "tsukiji",
		name: "Tsukiji Outer Market",
		localName: "築地場外市場",
		lat: 35.6654,
		lng: 139.7707,
		areaId: "tokyo",
		areaName: "Tokyo",
		groups: ["food", "neighbourhood"],
		tier: "strong",
		duration: 70,
		category: "shopping"
	}),
	anchor$1({
		id: "teamlab",
		name: "teamLab Planets",
		localName: "チームラボプラネッツ",
		lat: 35.6494,
		lng: 139.7898,
		areaId: "tokyo",
		areaName: "Tokyo",
		groups: ["family", "landmark"],
		tier: "strong",
		duration: 90,
		category: "attraction",
		indoor: true
	}),
	anchor$1({
		id: "senso-ji",
		name: "Senso-ji",
		localName: "浅草寺",
		lat: 35.7148,
		lng: 139.7967,
		areaId: "asakusa",
		areaName: "Asakusa",
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 80,
		category: "historic",
		wikidataId: "Q876342"
	}),
	anchor$1({
		id: "nakamise",
		name: "Nakamise-dori",
		localName: "仲見世通り",
		lat: 35.7114,
		lng: 139.7963,
		areaId: "asakusa",
		areaName: "Asakusa",
		groups: ["neighbourhood", "food"],
		tier: "strong",
		duration: 45,
		category: "shopping"
	}),
	anchor$1({
		id: "skytree",
		name: "Tokyo Skytree",
		localName: "東京スカイツリー",
		lat: 35.7101,
		lng: 139.8107,
		areaId: "asakusa",
		areaName: "Asakusa",
		groups: ["landmark", "views"],
		tier: "strong",
		duration: 80,
		category: "viewpoint",
		wikidataId: "Q213447"
	}),
	anchor$1({
		id: "ueno-park",
		name: "Ueno Park",
		localName: "上野公園",
		lat: 35.7142,
		lng: 139.7714,
		areaId: "asakusa",
		areaName: "Asakusa",
		groups: ["nature", "family"],
		tier: "strong",
		duration: 70,
		category: "park"
	}),
	anchor$1({
		id: "tokyo-national",
		name: "Tokyo National Museum",
		localName: "東京国立博物館",
		lat: 35.7188,
		lng: 139.7765,
		areaId: "asakusa",
		areaName: "Asakusa",
		groups: ["heritage", "museum"],
		tier: "strong",
		duration: 90,
		category: "museum",
		indoor: true,
		wikidataId: "Q653433"
	}),
	anchor$1({
		id: "ueno-zoo",
		name: "Ueno Zoo",
		localName: "上野動物園",
		lat: 35.7164,
		lng: 139.7714,
		areaId: "asakusa",
		areaName: "Asakusa",
		groups: ["family", "nature"],
		tier: "strong",
		duration: 120,
		category: "zoo",
		wikidataId: "Q1365095"
	}),
	anchor$1({
		id: "shibuya-crossing",
		name: "Shibuya Crossing",
		localName: "渋谷スクランブル交差点",
		lat: 35.6595,
		lng: 139.7004,
		areaId: "shibuya",
		areaName: "Shibuya and Harajuku",
		groups: ["neighbourhood", "landmark"],
		tier: "core",
		duration: 40,
		category: "landmark",
		wikidataId: "Q1152535"
	}),
	anchor$1({
		id: "meiji",
		name: "Meiji Jingu",
		localName: "明治神宮",
		lat: 35.6764,
		lng: 139.6993,
		areaId: "shibuya",
		areaName: "Shibuya and Harajuku",
		groups: ["heritage", "nature"],
		tier: "core",
		duration: 75,
		category: "historic",
		wikidataId: "Q182763"
	}),
	anchor$1({
		id: "takeshita",
		name: "Takeshita Street",
		localName: "竹下通り",
		lat: 35.6716,
		lng: 139.7028,
		areaId: "shibuya",
		areaName: "Shibuya and Harajuku",
		groups: ["neighbourhood"],
		tier: "strong",
		duration: 45,
		category: "shopping"
	}),
	anchor$1({
		id: "yoyogi",
		name: "Yoyogi Park",
		localName: "代々木公園",
		lat: 35.6717,
		lng: 139.6964,
		areaId: "shibuya",
		areaName: "Shibuya and Harajuku",
		groups: ["nature"],
		tier: "optional",
		duration: 60,
		category: "park",
		wikidataId: "Q1120470"
	}),
	anchor$1({
		id: "shinjuku-gyoen",
		name: "Shinjuku Gyoen",
		localName: "新宿御苑",
		lat: 35.6852,
		lng: 139.71,
		areaId: "shibuya",
		areaName: "Shibuya and Harajuku",
		groups: ["nature"],
		tier: "strong",
		duration: 70,
		category: "garden",
		wikidataId: "Q750886"
	}),
	anchor$1({
		id: "kotokuin",
		name: "Kotoku-in",
		localName: "高徳院",
		lat: 35.3168,
		lng: 139.5357,
		areaId: "kamakura",
		areaName: "Kamakura",
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 60,
		category: "historic",
		excursion: "full",
		wikidataId: "Q848358"
	}),
	anchor$1({
		id: "hachimangu",
		name: "Tsurugaoka Hachimangu",
		localName: "鶴岡八幡宮",
		lat: 35.326,
		lng: 139.5565,
		areaId: "kamakura",
		areaName: "Kamakura",
		groups: ["heritage", "neighbourhood"],
		tier: "core",
		duration: 70,
		category: "historic",
		excursion: "full",
		wikidataId: "Q1060676"
	}),
	anchor$1({
		id: "hasedera",
		name: "Hasedera",
		localName: "長谷寺",
		lat: 35.3126,
		lng: 139.5334,
		areaId: "kamakura",
		areaName: "Kamakura",
		groups: ["heritage"],
		tier: "strong",
		duration: 50,
		category: "historic",
		excursion: "full"
	}),
	anchor$1({
		id: "lake-ashi",
		name: "Lake Ashi",
		localName: "芦ノ湖",
		lat: 35.204,
		lng: 139.026,
		areaId: "hakone",
		areaName: "Hakone",
		groups: ["nature", "views"],
		tier: "core",
		duration: 80,
		category: "viewpoint",
		excursion: "full"
	}),
	anchor$1({
		id: "hakone-shrine",
		name: "Hakone Shrine",
		localName: "箱根神社",
		lat: 35.2044,
		lng: 139.0256,
		areaId: "hakone",
		areaName: "Hakone",
		groups: ["heritage", "nature"],
		tier: "strong",
		duration: 50,
		category: "historic",
		excursion: "full"
	}),
	anchor$1({
		id: "owakudani",
		name: "Owakudani",
		localName: "大涌谷",
		lat: 35.243,
		lng: 139.019,
		areaId: "hakone",
		areaName: "Hakone",
		groups: ["nature"],
		tier: "strong",
		duration: 70,
		category: "viewpoint",
		excursion: "full"
	})
];
var parisAnchors = [
	anchor$1({
		id: "notre-dame",
		name: "Notre-Dame",
		localName: "Notre-Dame de Paris",
		lat: 48.853,
		lng: 2.3499,
		areaId: "paris",
		areaName: "Paris",
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 60,
		category: "historic",
		wikidataId: "Q2981",
		sources: [
			"wikidata",
			"wikivoyage",
			"wikipedia",
			"tourism-board"
		]
	}),
	anchor$1({
		id: "sainte-chapelle",
		name: "Sainte-Chapelle",
		localName: "Sainte-Chapelle",
		lat: 48.8554,
		lng: 2.345,
		areaId: "paris",
		areaName: "Paris",
		groups: ["heritage"],
		tier: "strong",
		duration: 50,
		category: "historic",
		indoor: true,
		wikidataId: "Q187992"
	}),
	anchor$1({
		id: "eiffel",
		name: "Eiffel Tower",
		localName: "Tour Eiffel",
		lat: 48.8584,
		lng: 2.2945,
		areaId: "eiffel",
		areaName: "Eiffel and the Seine",
		groups: ["landmark", "views"],
		tier: "core",
		duration: 90,
		category: "landmark",
		wikidataId: "Q243"
	}),
	anchor$1({
		id: "champ-de-mars",
		name: "Champ de Mars",
		localName: "Champ-de-Mars",
		lat: 48.8556,
		lng: 2.2986,
		areaId: "eiffel",
		areaName: "Eiffel and the Seine",
		groups: ["neighbourhood", "nature"],
		tier: "strong",
		duration: 40,
		category: "park",
		wikidataId: "Q189674"
	}),
	anchor$1({
		id: "trocadero",
		name: "Trocadero",
		localName: "Trocadéro",
		lat: 48.862,
		lng: 2.2875,
		areaId: "eiffel",
		areaName: "Eiffel and the Seine",
		groups: ["views", "landmark"],
		tier: "strong",
		duration: 40,
		category: "viewpoint"
	}),
	anchor$1({
		id: "louvre",
		name: "Louvre Museum",
		localName: "Musée du Louvre",
		lat: 48.8606,
		lng: 2.3376,
		areaId: "louvre",
		areaName: "Louvre and the Tuileries",
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 150,
		category: "museum",
		indoor: true,
		wikidataId: "Q19675"
	}),
	anchor$1({
		id: "tuileries",
		name: "Tuileries Garden",
		localName: "Jardin des Tuileries",
		lat: 48.8634,
		lng: 2.3275,
		areaId: "louvre",
		areaName: "Louvre and the Tuileries",
		groups: ["nature", "neighbourhood"],
		tier: "strong",
		duration: 50,
		category: "garden",
		wikidataId: "Q182339"
	}),
	anchor$1({
		id: "orsay",
		name: "Musee d'Orsay",
		localName: "Musée d'Orsay",
		lat: 48.86,
		lng: 2.3266,
		areaId: "louvre",
		areaName: "Louvre and the Tuileries",
		groups: ["heritage"],
		tier: "strong",
		duration: 90,
		category: "museum",
		indoor: true,
		wikidataId: "Q23402"
	}),
	anchor$1({
		id: "vosges",
		name: "Place des Vosges",
		localName: "Place des Vosges",
		lat: 48.8556,
		lng: 2.3655,
		areaId: "marais",
		areaName: "The Marais",
		groups: ["neighbourhood", "heritage"],
		tier: "core",
		duration: 40,
		category: "landmark"
	}),
	anchor$1({
		id: "pompidou",
		name: "Centre Pompidou",
		localName: "Centre Pompidou",
		lat: 48.8606,
		lng: 2.3522,
		areaId: "marais",
		areaName: "The Marais",
		groups: ["heritage"],
		tier: "strong",
		duration: 80,
		category: "museum",
		indoor: true
	}),
	anchor$1({
		id: "rue-mouffetard",
		name: "Rue Mouffetard",
		localName: "Rue Mouffetard",
		lat: 48.8422,
		lng: 2.3496,
		areaId: "marais",
		areaName: "The Marais",
		groups: ["food", "neighbourhood"],
		tier: "strong",
		duration: 50,
		category: "shopping"
	}),
	anchor$1({
		id: "sacre-coeur",
		name: "Sacre-Coeur",
		localName: "Sacré-Cœur",
		lat: 48.8867,
		lng: 2.3431,
		areaId: "paris",
		areaName: "Paris",
		groups: ["heritage", "views"],
		tier: "strong",
		duration: 60,
		category: "historic",
		wikidataId: "Q193123"
	}),
	anchor$1({
		id: "versailles",
		name: "Palace of Versailles",
		localName: "Château de Versailles",
		lat: 48.8049,
		lng: 2.1204,
		areaId: "versailles",
		areaName: "Versailles",
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 150,
		category: "historic",
		indoor: true,
		excursion: "full",
		wikidataId: "Q2946"
	}),
	anchor$1({
		id: "versailles-gardens",
		name: "Gardens of Versailles",
		localName: "Parc de Versailles",
		lat: 48.8046,
		lng: 2.11,
		areaId: "versailles",
		areaName: "Versailles",
		groups: ["nature", "heritage"],
		tier: "strong",
		duration: 70,
		category: "garden",
		excursion: "full"
	})
];
var chengduAnchors = [
	anchor$1({
		id: "wuhou",
		name: "Wuhou Shrine",
		localName: "武侯祠",
		lat: 30.646,
		lng: 104.048,
		areaId: "chengdu",
		areaName: "Chengdu",
		groups: ["heritage"],
		tier: "core",
		duration: 70,
		category: "historic"
	}),
	anchor$1({
		id: "jinli",
		name: "Jinli",
		localName: "锦里",
		lat: 30.645,
		lng: 104.049,
		areaId: "chengdu",
		areaName: "Chengdu",
		groups: ["neighbourhood", "food"],
		tier: "core",
		duration: 60,
		category: "shopping"
	}),
	anchor$1({
		id: "kuanzhai",
		name: "Kuanzhai Alley",
		localName: "宽窄巷子",
		lat: 30.669,
		lng: 104.044,
		areaId: "chengdu",
		areaName: "Chengdu",
		groups: [
			"neighbourhood",
			"food",
			"heritage"
		],
		tier: "core",
		duration: 70,
		category: "shopping"
	}),
	anchor$1({
		id: "peoples-park",
		name: "People's Park",
		localName: "人民公园",
		lat: 30.659,
		lng: 104.058,
		areaId: "chengdu",
		areaName: "Chengdu",
		groups: ["neighbourhood", "food"],
		tier: "strong",
		duration: 60,
		category: "park"
	}),
	anchor$1({
		id: "panda",
		name: "Chengdu Research Base of Giant Panda Breeding",
		localName: "成都大熊猫繁育研究基地",
		lat: 30.733,
		lng: 104.146,
		areaId: "panda",
		areaName: "Panda base",
		groups: [
			"wildlife",
			"family",
			"nature"
		],
		tier: "core",
		duration: 150,
		category: "zoo",
		excursion: "half"
	}),
	anchor$1({
		id: "dujiangyan",
		name: "Dujiangyan",
		localName: "都江堰",
		lat: 30.998,
		lng: 103.617,
		areaId: "dujiangyan",
		areaName: "Dujiangyan",
		groups: ["heritage", "nature"],
		tier: "core",
		duration: 90,
		category: "historic",
		excursion: "full"
	}),
	anchor$1({
		id: "qingcheng",
		name: "Mount Qingcheng",
		localName: "青城山",
		lat: 30.9,
		lng: 103.567,
		areaId: "dujiangyan",
		areaName: "Dujiangyan",
		groups: ["nature", "heritage"],
		tier: "strong",
		duration: 120,
		category: "park",
		excursion: "full"
	}),
	anchor$1({
		id: "leshan",
		name: "Leshan Giant Buddha",
		localName: "乐山大佛",
		lat: 29.5447,
		lng: 103.769,
		areaId: "leshan",
		areaName: "Leshan",
		groups: ["heritage", "landmark"],
		tier: "core",
		duration: 90,
		category: "historic",
		excursion: "full",
		wikidataId: "Q33761"
	})
];
var ANCHOR_PACKS = [
	{
		id: "tokyo",
		aliases: ["tokyo"],
		firstVisitGroups: [
			"heritage",
			"neighbourhood",
			"landmark",
			"food",
			"nature"
		],
		anchors: tokyoAnchors,
		patterns: [
			pattern({
				id: "tokyo-centre",
				theme: "Central Tokyo",
				areaIds: ["tokyo"],
				requiredGroups: ["landmark", "heritage"],
				anchorIds: [
					"tokyo-tower",
					"imperial-gardens",
					"hamarikyu",
					"tsukiji"
				],
				optionalGroups: ["food", "family"],
				visitMode: "STAY",
				expectedMinutes: 300,
				mealContext: "market",
				evidence: [
					"Wikivoyage Tokyo",
					"Wikidata",
					"Tokyo Tourism"
				]
			}),
			pattern({
				id: "tokyo-east",
				theme: "Historic East Tokyo",
				areaIds: ["asakusa"],
				requiredGroups: ["heritage", "neighbourhood"],
				anchorIds: [
					"senso-ji",
					"nakamise",
					"skytree",
					"tokyo-national"
				],
				optionalGroups: ["views", "family"],
				visitMode: "STAY",
				expectedMinutes: 360,
				evidence: [
					"Wikivoyage Tokyo",
					"Wikidata",
					"Tokyo Tourism"
				]
			}),
			pattern({
				id: "tokyo-west",
				theme: "Shibuya and Harajuku",
				areaIds: ["shibuya"],
				requiredGroups: ["neighbourhood", "heritage"],
				anchorIds: [
					"shibuya-crossing",
					"meiji",
					"takeshita",
					"yoyogi"
				],
				optionalGroups: ["nature"],
				visitMode: "STAY",
				expectedMinutes: 330,
				evidence: ["Wikivoyage Tokyo", "Wikidata"]
			}),
			pattern({
				id: "tokyo-kamakura",
				theme: "Temples of Kamakura",
				areaIds: ["kamakura"],
				requiredGroups: ["heritage"],
				anchorIds: [
					"kotokuin",
					"hachimangu",
					"hasedera"
				],
				optionalGroups: ["neighbourhood"],
				visitMode: "DAY_TRIP",
				expectedMinutes: 360,
				evidence: ["Wikivoyage Tokyo", "Wikidata"]
			}),
			pattern({
				id: "tokyo-hakone",
				theme: "Hakone",
				areaIds: ["hakone"],
				requiredGroups: ["nature"],
				anchorIds: [
					"lake-ashi",
					"hakone-shrine",
					"owakudani"
				],
				optionalGroups: ["heritage", "views"],
				visitMode: "EXCURSION",
				expectedMinutes: 360,
				evidence: ["Wikivoyage Japan", "Wikidata"]
			})
		]
	},
	{
		id: "paris",
		aliases: ["paris"],
		firstVisitGroups: [
			"heritage",
			"landmark",
			"neighbourhood",
			"food"
		],
		anchors: parisAnchors,
		patterns: [
			pattern({
				id: "paris-centre",
				theme: "Central Paris",
				areaIds: ["paris"],
				requiredGroups: ["heritage", "landmark"],
				anchorIds: [
					"notre-dame",
					"sainte-chapelle",
					"sacre-coeur"
				],
				optionalGroups: ["views"],
				visitMode: "STAY",
				expectedMinutes: 300,
				evidence: ["Wikivoyage Paris", "Wikidata"]
			}),
			pattern({
				id: "paris-eiffel",
				theme: "Eiffel and the Seine",
				areaIds: ["eiffel"],
				requiredGroups: ["landmark", "views"],
				anchorIds: [
					"eiffel",
					"champ-de-mars",
					"trocadero"
				],
				optionalGroups: ["nature"],
				visitMode: "STAY",
				expectedMinutes: 300,
				evidence: ["Wikivoyage Paris", "Wikidata"]
			}),
			pattern({
				id: "paris-louvre",
				theme: "Louvre and the Tuileries",
				areaIds: ["louvre"],
				requiredGroups: ["heritage"],
				anchorIds: [
					"louvre",
					"tuileries",
					"orsay"
				],
				optionalGroups: ["nature"],
				visitMode: "STAY",
				expectedMinutes: 360,
				evidence: ["Wikivoyage Paris", "Wikidata"]
			}),
			pattern({
				id: "paris-marais",
				theme: "The Marais",
				areaIds: ["marais"],
				requiredGroups: ["neighbourhood", "heritage"],
				anchorIds: [
					"vosges",
					"pompidou",
					"rue-mouffetard"
				],
				optionalGroups: ["food"],
				visitMode: "STAY",
				expectedMinutes: 300,
				mealContext: "market street",
				evidence: ["Wikivoyage Paris"]
			}),
			pattern({
				id: "paris-versailles",
				theme: "Versailles",
				areaIds: ["versailles"],
				requiredGroups: ["heritage"],
				anchorIds: ["versailles", "versailles-gardens"],
				optionalGroups: ["nature"],
				visitMode: "DAY_TRIP",
				expectedMinutes: 360,
				evidence: ["Wikivoyage Paris", "Wikidata"]
			})
		]
	},
	{
		id: "chengdu",
		aliases: ["chengdu"],
		firstVisitGroups: [
			"heritage",
			"neighbourhood",
			"wildlife",
			"food"
		],
		anchors: chengduAnchors,
		patterns: [
			pattern({
				id: "chengdu-old",
				theme: "Historic Chengdu",
				areaIds: ["chengdu"],
				requiredGroups: ["heritage", "neighbourhood"],
				anchorIds: [
					"wuhou",
					"jinli",
					"kuanzhai"
				],
				optionalGroups: ["food"],
				visitMode: "STAY",
				expectedMinutes: 330,
				mealContext: "alley food",
				evidence: ["Wikivoyage Chengdu", "Wikipedia"]
			}),
			pattern({
				id: "chengdu-park",
				theme: "Teahouses and the park",
				areaIds: ["chengdu"],
				requiredGroups: ["neighbourhood", "food"],
				anchorIds: ["peoples-park", "kuanzhai"],
				optionalGroups: ["heritage"],
				visitMode: "STAY",
				expectedMinutes: 280,
				evidence: ["Wikivoyage Chengdu"]
			}),
			pattern({
				id: "chengdu-panda",
				theme: "Panda base",
				areaIds: ["panda"],
				requiredGroups: ["wildlife"],
				anchorIds: ["panda"],
				optionalGroups: ["family", "nature"],
				visitMode: "EXCURSION",
				expectedMinutes: 240,
				evidence: ["Wikivoyage Chengdu", "Wikipedia"]
			}),
			pattern({
				id: "chengdu-dujiangyan",
				theme: "Dujiangyan and Qingcheng",
				areaIds: ["dujiangyan"],
				requiredGroups: ["heritage", "nature"],
				anchorIds: ["dujiangyan", "qingcheng"],
				optionalGroups: [],
				visitMode: "DAY_TRIP",
				expectedMinutes: 360,
				evidence: ["Wikivoyage Chengdu"]
			}),
			pattern({
				id: "chengdu-leshan",
				theme: "Leshan",
				areaIds: ["leshan"],
				requiredGroups: ["heritage"],
				anchorIds: ["leshan"],
				optionalGroups: ["landmark"],
				visitMode: "DAY_TRIP",
				expectedMinutes: 300,
				evidence: ["Wikivoyage Chengdu", "Wikidata"]
			})
		]
	}
];
registerCuratedPacks(ANCHOR_PACKS);
function packFor(destinationOrId) {
	const key = destinationOrId.trim().toLowerCase();
	const head = key.split(",")[0]?.trim() ?? key;
	return ANCHOR_PACKS.find((pack) => pack.id === key || pack.id === head || pack.aliases.includes(key) || pack.aliases.includes(head)) ?? null;
}
function attachExperience(book) {
	if (book.anchors?.length && book.patterns?.length) return book;
	const known = ensureDestinationKnowledge(book.destinationName) ?? ensureDestinationKnowledge(book.id);
	const pack = packFor(book.id) ?? packFor(book.destinationName);
	const anchors = book.anchors?.length ? book.anchors : known?.anchors.length ? known.anchors : pack?.anchors ?? [];
	const patterns = book.patterns?.length ? book.patterns : known?.dayPatterns.length ? known.dayPatterns : pack?.patterns ?? [];
	const firstVisitGroups = book.firstVisitGroups?.length ? book.firstVisitGroups : known?.experienceGroups.length ? known.experienceGroups : pack?.firstVisitGroups ?? [];
	if (!anchors.length && !patterns.length) return book;
	return {
		...book,
		anchors,
		patterns,
		firstVisitGroups
	};
}
function anchorsForDestination(destination) {
	const known = knowledgeAnchors(destination);
	if (known.length) return known;
	return packFor(destination)?.anchors ?? [];
}
function themeForArea(area, destination) {
	const patterns = knowledgePatterns(destination);
	const needle = area.trim().toLowerCase();
	if (needle) {
		const known = patterns.find((item) => item.areaIds.some((id) => id === needle) || item.theme.toLowerCase() === needle || item.theme.toLowerCase().includes(needle));
		if (known) return known.theme;
	}
	const pack = packFor(destination);
	if (!pack) return "";
	if (!needle) return "";
	return pack.patterns.find((item) => item.areaIds.some((id) => id === needle) || item.theme.toLowerCase() === needle || item.theme.toLowerCase().includes(needle))?.theme ?? "";
}
var TRAVEL_MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
var TRAVEL_MAP_CREDIT = "Map data © OpenStreetMap contributors. Tiles © OpenFreeMap.";
var FOOD$2 = /* @__PURE__ */ new Set([
	"restaurant",
	"cafe",
	"market",
	"nightlife"
]);
var SEE = /* @__PURE__ */ new Set([
	"attraction",
	"museum",
	"park",
	"garden",
	"viewpoint",
	"landmark",
	"historic",
	"theme_park",
	"zoo",
	"aquarium",
	"shopping",
	"beach",
	"family"
]);
function clockTime(minutes) {
	const day = (minutes % 1440 + 1440) % 1440;
	return `${String(Math.floor(day / 60)).padStart(2, "0")}:${String(day % 60).padStart(2, "0")}`;
}
function displayClock(minutesOrClock) {
	const day = ((typeof minutesOrClock === "number" ? minutesOrClock : clockToMinutes(minutesOrClock)) % 1440 + 1440) % 1440;
	const hour24 = Math.floor(day / 60);
	const minute = day % 60;
	const period = hour24 >= 12 ? "PM" : "AM";
	return `${hour24 % 12 || 12}:${String(minute).padStart(2, "0")} ${period}`;
}
function durationPhrase(minutes) {
	const value = Math.max(0, Math.round(minutes));
	if (value < 60) return `${value} min`;
	const hours = Math.floor(value / 60);
	const rest = value % 60;
	const hourLabel = hours === 1 ? "1 hr" : `${hours} hr`;
	return rest ? `${hourLabel} ${rest} min` : hourLabel;
}
/** A usable gap before evening. Empty when the day already runs late. */
function freeWindow(endTime) {
	const end = clockToMinutes(endTime);
	if (!Number.isFinite(end) || end >= 960 || end < 480) return "";
	const until = 1110;
	const gap = until - end;
	if (gap < 90) return "";
	return `${displayClock(end)}–${displayClock(until)} · ${durationPhrase(gap)}`;
}
function forecastLocal(iso, lng) {
	const time = new Date(iso).getTime();
	if (!Number.isFinite(time)) return {
		date: "",
		hour: 0
	};
	const shift = Math.round(lng / 15) * 60 * 60 * 1e3;
	const local = new Date(time + shift);
	return {
		date: local.toISOString().slice(0, 10),
		hour: local.getUTCHours()
	};
}
function categoryFromTags(tags) {
	if (isContainerTags(tags)) return null;
	const tourism = tags.tourism ?? "";
	const leisure = tags.leisure ?? "";
	const amenity = tags.amenity ?? "";
	const historic = tags.historic ?? "";
	const shop = tags.shop ?? "";
	if (tourism === "hotel" || tourism === "guest_house" || tourism === "hostel") return {
		category: "stay",
		indoor: true
	};
	if (tourism === "museum" || tourism === "gallery") return {
		category: "museum",
		indoor: true
	};
	if (tourism === "theme_park") return {
		category: "theme_park",
		indoor: false
	};
	if (tourism === "zoo") return {
		category: "zoo",
		indoor: false
	};
	if (tourism === "aquarium") return {
		category: "aquarium",
		indoor: true
	};
	if (tourism === "viewpoint") return {
		category: "viewpoint",
		indoor: false
	};
	if (tourism === "attraction") return {
		category: "attraction",
		indoor: false
	};
	if (leisure === "park" || leisure === "nature_reserve") return {
		category: "park",
		indoor: false
	};
	if (leisure === "garden") return {
		category: "garden",
		indoor: false
	};
	if (leisure === "beach_resort" || tags.natural === "beach") return {
		category: "beach",
		indoor: false
	};
	if (historic === "castle" || historic === "monument" || historic === "ruins" || historic === "memorial" || historic === "temple" || historic === "church" || historic === "cathedral" || historic === "monastery" || historic === "palace" || historic === "city_gate" || historic === "fort") return {
		category: "historic",
		indoor: historic === "church" || historic === "cathedral" || historic === "monastery" || historic === "palace"
	};
	if (tags.building === "cathedral" || tags.building === "church" || tags.building === "basilica" || tags.building === "chapel") return {
		category: "historic",
		indoor: true
	};
	if (tags.building === "triumphal_arch") return {
		category: "landmark",
		indoor: false
	};
	if (tags.man_made === "tower" || tags.man_made === "obelisk") return {
		category: "attraction",
		indoor: false
	};
	if (amenity === "arts_centre" || amenity === "theatre") return {
		category: "attraction",
		indoor: true
	};
	if (amenity === "marketplace" || shop === "mall" || shop === "department_store") return {
		category: shop ? "shopping" : "market",
		indoor: true
	};
	if (amenity === "restaurant") return {
		category: "restaurant",
		indoor: true
	};
	if (amenity === "cafe") return {
		category: "cafe",
		indoor: true
	};
	if (amenity === "bar" || amenity === "pub" || amenity === "nightclub") return {
		category: "nightlife",
		indoor: true
	};
	if (amenity === "bus_station" || amenity === "ferry_terminal" || tags.railway === "station") return {
		category: "transport",
		indoor: true
	};
	return null;
}
var CONTAINER_PLACE = /* @__PURE__ */ new Set([
	"city",
	"town",
	"village",
	"municipality",
	"suburb",
	"quarter",
	"neighbourhood",
	"neighborhood",
	"borough",
	"hamlet",
	"district",
	"county",
	"state",
	"province",
	"region",
	"country"
]);
/** Administrative places are containers. A city tagged as an attraction is still a city. */
function isContainerTags(tags) {
	const place = (tags.place || "").toLowerCase();
	if (CONTAINER_PLACE.has(place)) return true;
	if ((tags.boundary || "") === "administrative" && !tags.tourism && !tags.historic && !tags.amenity && !tags.leisure) return true;
	return false;
}
/** Wikidata cities arrive as "city in …". They must not become timed stops. */
function isAreaPlace(spot) {
	const description = (spot.description ?? "").trim().toLowerCase();
	if (/^(city|town|village|municipality|ward|special ward|prefecture|county|province|metropolis|human settlement|tourist destination)\b/.test(description)) return true;
	return false;
}
function estimateMinutes(move, meters) {
	if (meters < 80) return 1;
	return Math.max(1, Math.round(meters / (move === "walk" ? 75 : 450)));
}
function legLabel(move, minutes, source) {
	if (minutes == null || source === "none") return "Route unavailable";
	if (move === "walk") return source === "estimate" ? `Walk · about ${minutes} min · estimated` : `Walk · ${minutes} min`;
	if (move === "drive") return source === "estimate" ? `Drive · about ${minutes} min · estimated` : `Drive · ${minutes} min`;
	return source === "estimate" ? `Taxi · about ${minutes} min · estimated road time, not a timetable` : `Taxi · ${minutes} min · road time, not a timetable`;
}
function itineraryRequestPlan(areas, days) {
	const plan = {
		overpass: Math.max(1, Math.min(3, areas)),
		weather: 1,
		matrix: 1,
		routes: Math.max(1, Math.min(7, days)),
		llm: 2,
		total: 0
	};
	plan.total = plan.overpass + plan.weather + plan.matrix + plan.routes + plan.llm;
	return plan;
}
function liked(category, interests, children) {
	if (children && (category === "zoo" || category === "aquarium" || category === "theme_park" || category === "park")) return true;
	if (!interests.length) return true;
	const table = {
		food: [
			"restaurant",
			"cafe",
			"market",
			"nightlife"
		],
		nature: [
			"park",
			"garden",
			"viewpoint",
			"beach"
		],
		culture: [
			"museum",
			"historic",
			"landmark",
			"attraction"
		],
		beach: ["beach"],
		walks: [
			"park",
			"garden",
			"viewpoint"
		],
		shopping: ["shopping", "market"],
		night: ["nightlife"]
	};
	return interests.some((interest) => table[interest].includes(category));
}
function compareBases(areas, transfers, oneBase, nights) {
	const name = areas[0]?.name || "the city";
	if (areas.length <= 1) return {
		mode: "single",
		options: [{
			id: "one",
			label: `Stay in ${name}`,
			hotelChanges: 0,
			lostMinutes: 0,
			note: "One city, so the bag stays put.",
			chosen: true
		}]
	};
	const hop = (from, to) => {
		const value = transfers?.[from]?.[to];
		return typeof value === "number" && value >= 0 ? value : null;
	};
	let dayTrip = 0;
	let dayKnown = true;
	for (let index = 1; index < areas.length; index += 1) {
		const there = hop(0, index);
		const back = hop(index, 0);
		if (there == null || back == null) dayKnown = false;
		else dayTrip += there + back;
	}
	let splitCost = 0;
	let splitKnown = true;
	for (let index = 1; index < areas.length; index += 1) {
		const leg = hop(index - 1, index);
		if (leg == null) splitKnown = false;
		else splitCost += leg + 90;
	}
	const changes = areas.length - 1;
	const single = {
		id: "one",
		label: `${name} base, other cities as day trips`,
		hotelChanges: 0,
		lostMinutes: dayTrip,
		note: dayKnown ? `Day trips add about ${dayTrip} min of transfers, there and back. The bag stays in ${name}.` : "Transfer times were missing, so the day-trip cost is only a sketch.",
		chosen: false
	};
	const split = {
		id: "split",
		label: areas.map((area) => area.name).join(" → "),
		hotelChanges: changes,
		lostMinutes: splitCost,
		note: splitKnown ? `${changes} hotel change${changes === 1 ? "" : "s"}. Checkout, luggage, and check-in are counted, not just the kilometres.` : "The hotel-change time could not be routed.",
		chosen: false
	};
	let mode = "single";
	if (!oneBase && nights >= 4 && dayKnown && splitKnown && splitCost + 20 < dayTrip) mode = "split";
	if (oneBase || !dayKnown) mode = "single";
	if (mode === "single" && dayKnown && dayTrip > 150) single.note += " Possible, but the transfer is tiring.";
	single.chosen = mode === "single";
	split.chosen = mode === "split";
	return {
		mode,
		options: [single, split]
	};
}
function areaPlan(count, days, mode) {
	if (mode === "split") {
		const span = Math.max(1, Math.ceil(days / count));
		return Array.from({ length: days }, (_, index) => Math.min(count - 1, Math.floor(index / span)));
	}
	const plan = Array.from({ length: days }, () => 0);
	let slot = days > 2 ? 1 : 0;
	for (let area = 1; area < count && slot < days; area += 1) {
		if (days > 2 && slot === days - 1) break;
		plan[slot] = area;
		slot += 2;
	}
	return plan;
}
function rejectedName(spot, rejected) {
	return [
		spot.name,
		spot.displayName,
		spot.nameEnglish,
		spot.nameLocal,
		spot.localName,
		spot.nameRomanized
	].some((value) => value && rejected.has(value.toLowerCase()));
}
function askedFor(spot, names) {
	return names.some((name) => name.trim().length >= 2 && placeMatches(spot, name));
}
function areaDayStop(intent, day) {
	const why = "A full day here. It is not a short stop on the way to somewhere else.";
	return {
		id: `playbook:${intent.nodeId}:d${day}`,
		provider: "area",
		providerId: intent.nodeId,
		name: intent.title,
		category: "attraction",
		address: intent.areaName,
		lat: intent.latitude,
		lng: intent.longitude,
		day,
		startTime: null,
		endTime: null,
		duration: 300,
		bookingStatus: "none",
		bucket: "scheduled",
		indoor: false,
		area: intent.areaName,
		note: why,
		opening: "",
		importance: "major",
		groups: intent.groups,
		excursion: "full",
		why,
		displayName: intent.title,
		locality: intent.areaName
	};
}
function anchorTier(note) {
	return /playbook-anchor:(core|strong|optional|niche)/.exec(note ?? "")?.[1] || "";
}
function isAnchorNote(note) {
	return (note ?? "").includes("playbook-anchor");
}
function normPlace(value) {
	return value.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "");
}
function sameAnchor(left, right) {
	const other = normPlace(right.name);
	if (other.length < 4) return false;
	if (![
		left.name,
		left.displayName,
		left.nameEnglish
	].map((value) => normPlace(value || "")).filter((value) => value.length >= 4).some((name) => name === other || name.includes(other) || other.includes(name))) return false;
	return distanceMeters(left.lat, left.lng, right.lat, right.lng) < 1800;
}
function discoveredAnchor(place) {
	const importance = place.tier === "core" ? "iconic" : place.tier === "strong" ? "major" : place.tier === "optional" ? "interest" : "local";
	return {
		id: `anchor:${place.id}`,
		provider: "wikidata",
		providerId: place.wikidataId ? `wd:${place.wikidataId}` : place.id,
		name: place.name,
		category: place.category,
		address: place.areaName,
		lat: place.lat,
		lng: place.lng,
		indoor: place.indoor,
		area: place.areaName,
		opening: "",
		localName: place.localName,
		nameLocal: place.localName,
		wikidataId: place.wikidataId,
		importance,
		groups: place.groups,
		excursion: place.excursion,
		sourceNote: `playbook-anchor:${place.tier}`,
		locality: place.areaName,
		visitMinutes: place.duration,
		sitelinks: place.tier === "core" ? 40 : place.tier === "strong" ? 18 : 8,
		mentioned: place.tier === "core" || place.tier === "strong"
	};
}
function mergeAnchorSpots(spots, anchors) {
	const next = spots.map((spot) => ({ ...spot }));
	for (const anchor of anchors) {
		const hit = next.find((spot) => sameAnchor(spot, anchor));
		if (!hit) {
			next.push(anchor);
			continue;
		}
		hit.groups = [.../* @__PURE__ */ new Set([...hit.groups ?? [], ...anchor.groups ?? []])];
		if (!hit.importance || hit.importance === "local" || hit.importance === "optional") hit.importance = anchor.importance;
		hit.sourceNote = isAnchorNote(hit.sourceNote) ? hit.sourceNote : `${hit.sourceNote ? `${hit.sourceNote}; ` : ""}playbook-anchor:${anchorTier(anchor.sourceNote) || "strong"}`;
		hit.visitMinutes = hit.visitMinutes ?? anchor.visitMinutes;
		hit.wikidataId = hit.wikidataId || anchor.wikidataId;
		hit.localName = hit.localName || anchor.localName;
		hit.nameLocal = hit.nameLocal || anchor.nameLocal;
		if (!hit.excursion || hit.excursion === "none") hit.excursion = anchor.excursion;
	}
	return next;
}
function familyFit(spot, youngest) {
	const family = (spot.groups ?? []).includes("family") || spot.category === "zoo" || spot.category === "aquarium" || spot.category === "theme_park";
	if (youngest <= 5) return family || spot.category === "park" || spot.category === "garden";
	if (youngest <= 8) return family || spot.category === "park" || spot.category === "attraction";
	return family || spot.category === "museum" || spot.category === "viewpoint";
}
function stopsForIntent(intent, spots, used, count, salt, ages, firstVisit) {
	const radius = intent.visitMode === "DAY_TRIP" || intent.visitMode === "EXCURSION" ? Math.max(18e3, intent.radiusKm * 1e3) : 16e3;
	const areaName = intent.areaName.trim().toLowerCase();
	const required = new Set(intent.requiredGroups?.length ? intent.requiredGroups : intent.groups);
	const wantsFood = required.has("food") || intent.groups.includes("food") || intent.role === "food";
	const wantsFamily = ages.length > 0 && (required.has("family") || intent.groups.includes("family") || intent.role === "family");
	const candidates = spots.filter((spot) => {
		if (used.has(spot.id) || isAreaPlace(spot)) return false;
		if (spot.name.trim().toLowerCase() === areaName) return false;
		if (isAnchorNote(spot.sourceNote) && spot.locality && areaName && spot.locality.toLowerCase() !== areaName) return false;
		if (!(SEE.has(spot.category) || wantsFood && spot.category === "market")) return false;
		return distanceMeters(intent.latitude, intent.longitude, spot.lat, spot.lng) <= radius;
	});
	const hinted = (spot) => intent.hints.some((hint) => {
		const needle = hint.toLowerCase();
		if (needle.length < 3) return false;
		return [
			spot.name,
			spot.displayName,
			spot.locality,
			spot.nameEnglish,
			spot.localName
		].some((value) => (value || "").toLowerCase().includes(needle));
	});
	const grouped = (spot) => {
		const groups = spot.groups ?? [];
		if ([...required].some((group) => groups.includes(group))) return true;
		if (intent.groups.some((group) => groups.includes(group))) return true;
		if (wantsFamily && familyFit(spot, Math.min(...ages))) return true;
		if (wantsFood && (spot.category === "market" || spot.category === "shopping" || groups.includes("food"))) return true;
		if (intent.role === "icons" && (spot.importance === "iconic" || spot.importance === "major")) return true;
		if ((intent.role === "nature" || intent.role === "regional" || required.has("nature")) && (groups.includes("nature") || groups.includes("wildlife") || groups.includes("views") || spot.category === "park" || spot.category === "viewpoint" || spot.category === "garden")) return true;
		if ((intent.role === "heritage" || intent.role === "day-trip" || required.has("heritage")) && (spot.category === "historic" || spot.category === "museum" || spot.category === "landmark" || groups.includes("heritage"))) return true;
		return false;
	};
	const score = (spot) => {
		let value = 0;
		const tier = anchorTier(spot.sourceNote);
		const anchorId = spot.id.replace(/^anchor:/, "");
		const listed = (intent.anchorIds ?? []).includes(anchorId);
		if (isAnchorNote(spot.sourceNote)) value += listed || !(intent.anchorIds ?? []).length ? 36 : 8;
		if (tier === "core") value += firstVisit ? 28 : 6;
		else if (tier === "strong") value += 16;
		else if (tier === "niche") value -= 18;
		if (!firstVisit && tier === "core") value -= 10;
		if (hinted(spot)) value += 50;
		if (grouped(spot)) value += 20;
		if (spot.importance === "iconic") value += 12;
		else if (spot.importance === "major") value += 8;
		else if (spot.importance === "interest") value += 3;
		if (wantsFamily && familyFit(spot, Math.min(...ages))) value += ages.some((age) => age <= 8) ? 24 : 12;
		if ((required.has("heritage") || intent.groups.includes("heritage")) && (spot.category === "historic" || spot.category === "museum")) value += 14;
		if ((required.has("nature") || intent.groups.includes("nature")) && (spot.category === "park" || spot.category === "garden" || spot.category === "viewpoint" || (spot.groups ?? []).includes("nature"))) value += 14;
		if (wantsFood && (spot.groups ?? []).includes("food")) value += 18;
		value -= Math.min(20, distanceMeters(intent.latitude, intent.longitude, spot.lat, spot.lng) / 2e3);
		return value;
	};
	const ranked = [...candidates].sort((a, b) => {
		const delta = score(b) - score(a);
		if (Math.abs(delta) > 3) return delta;
		return (a.name.length + salt) % 5 - (b.name.length + salt) % 5;
	});
	const preferred = ranked.filter((spot) => hinted(spot) || grouped(spot) || isAnchorNote(spot.sourceNote) || spot.importance === "iconic" || spot.importance === "major");
	const pool = (preferred.length ? preferred : ranked).filter((spot) => spot.importance !== "local" || isAnchorNote(spot.sourceNote));
	const list = pool.length ? pool : ranked;
	const nearKm = intent.visitMode === "DAY_TRIP" || intent.visitMode === "EXCURSION" ? 8e3 : 5e3;
	const picked = [];
	const covered = /* @__PURE__ */ new Set();
	for (const spot of list) {
		if (picked.length >= count) break;
		if (!(!picked.length || picked.some((item) => distanceMeters(item.lat, item.lng, spot.lat, spot.lng) <= nearKm))) continue;
		const groups = spot.groups ?? [];
		if (!(!picked.length || groups.some((group) => required.has(group) && !covered.has(group))) && picked.length >= Math.min(2, count) && !isAnchorNote(spot.sourceNote) && spot.importance !== "iconic") continue;
		picked.push(spot);
		groups.forEach((group) => covered.add(group));
	}
	if (picked.length < Math.min(count, 2)) for (const spot of list) {
		if (picked.length >= count) break;
		if (picked.some((item) => item.id === spot.id)) continue;
		if (!(!picked.length || picked.some((item) => distanceMeters(item.lat, item.lng, spot.lat, spot.lng) <= nearKm))) continue;
		picked.push(spot);
	}
	if (!wantsFamily || !ages.length) return picked.slice(0, count);
	const youngest = Math.min(...ages);
	if (picked.some((spot) => familyFit(spot, youngest))) return picked.slice(0, count);
	const extra = list.find((spot) => !picked.some((item) => item.id === spot.id) && familyFit(spot, youngest) && picked.some((item) => distanceMeters(item.lat, item.lng, spot.lat, spot.lng) <= nearKm));
	if (!extra) return picked.slice(0, count);
	if (picked.length < count) return [...picked, extra];
	const replaceAt = [...picked].reverse().findIndex((spot) => spot.importance !== "iconic");
	if (replaceAt < 0) return picked.slice(0, count);
	const index = picked.length - 1 - replaceAt;
	const swapped = [...picked];
	swapped[index] = extra;
	return swapped;
}
function placeStop(place, day, bucket, note) {
	const kind = place.visitMinutes ?? place.story?.suggestedVisitMinutes ?? (place.excursion === "full" ? 180 : place.excursion === "half" ? 150 : FOOD$2.has(place.category) ? 70 : place.category === "stay" ? 20 : 90);
	return {
		id: place.id,
		provider: place.provider,
		providerId: place.providerId,
		name: place.name,
		category: place.category,
		address: place.address,
		lat: place.lat,
		lng: place.lng,
		day,
		startTime: null,
		endTime: null,
		duration: kind,
		bookingStatus: "none",
		bucket,
		indoor: place.indoor,
		area: place.area,
		note,
		opening: place.opening,
		localName: place.localName || place.nameLocal,
		description: place.description,
		image: place.image,
		imagePage: place.imagePage,
		photo: place.photo,
		wikidataId: place.wikidataId,
		commonsFile: place.commonsFile,
		commonsCategory: place.commonsCategory,
		wikipedia: place.wikipedia,
		mapillaryId: place.mapillaryId,
		panoramaxId: place.panoramaxId,
		website: place.website,
		region: place.region,
		commerce: place.commerce,
		sitelinks: place.sitelinks,
		importance: place.importance,
		groups: place.groups,
		excursion: place.excursion,
		distanceKm: place.distanceKm,
		hotel: place.hotel,
		sourceNote: place.sourceNote,
		why: note,
		story: place.story,
		photos: place.photos,
		nameEn: place.nameEn,
		nameLatin: place.nameLatin,
		nameLocal: place.nameLocal || place.localName,
		nameEnglish: place.nameEnglish,
		nameRomanized: place.nameRomanized,
		displayName: place.displayName,
		displaySubtitle: place.displaySubtitle,
		language: place.language,
		translationSource: place.translationSource,
		displayNameQuality: place.displayNameQuality,
		descriptionDisplay: place.descriptionDisplay,
		addressLocal: place.addressLocal,
		addressDisplay: place.addressDisplay,
		locality: place.locality
	};
}
function anchor(area) {
	return {
		id: `anchor-${area.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
		provider: "area",
		providerId: "",
		name: `Suggested base area · ${area.name}`,
		category: "stay",
		address: area.name,
		lat: area.latitude,
		lng: area.longitude,
		day: null,
		startTime: null,
		endTime: null,
		duration: 20,
		bookingStatus: "none",
		bucket: "scheduled",
		indoor: true,
		area: area.name,
		note: "Suggested area. Not a hotel, and not a booking.",
		opening: "",
		displayName: area.name
	};
}
function hopMinutes(move, from, to, matrix, spots) {
	if (matrix) {
		const left = spots.findIndex((spot) => spot.lat === from.lat && spot.lng === from.lng);
		const right = spots.findIndex((spot) => spot.lat === to.lat && spot.lng === to.lng);
		if (left >= 0 && right >= 0) {
			const value = matrix[left]?.[right];
			if (typeof value === "number") return {
				minutes: Math.max(1, Math.round(value)),
				source: "osrm"
			};
		}
	}
	return {
		minutes: estimateMinutes(move, distanceMeters(from.lat, from.lng, to.lat, to.lng)),
		source: "estimate"
	};
}
function burdenFrom(legs, hotelChanges, stops, move, child) {
	const known = legs.filter((leg) => leg.minutes != null);
	const transitMinutes = known.reduce((sum, leg) => sum + (leg.minutes ?? 0), 0);
	const cap = move === "walk" ? 25 : move === "transit" ? 50 : 35;
	const longHops = known.filter((leg) => (leg.minutes ?? 0) > cap).length;
	const starts = stops.filter((stop) => stop.day != null && stop.startTime).map((stop) => stop.startTime ?? "09:00");
	const ends = stops.filter((stop) => stop.day != null && stop.endTime).map((stop) => stop.endTime ?? "18:00");
	const early = starts.some((time) => time < "08:00");
	const late = ends.some((time) => time >= (child ? "19:30" : "21:00"));
	const per = stops.filter((stop) => stop.day != null && stop.category !== "stay").length / (new Set(stops.filter((stop) => stop.day != null).map((stop) => stop.day)).size || 1);
	const density = per <= 2 ? "light" : per <= 4 ? "steady" : "heavy";
	let line = hotelChanges === 0 ? "One stay. The days stay inside a sensible radius." : `${hotelChanges} hotel change${hotelChanges === 1 ? "" : "s"}. Packing is part of the cost.`;
	if (longHops >= 2 || transitMinutes > 180) line = "Possible, but unnecessarily tiring.";
	else if (hotelChanges >= 2) line = "A lot of packing for the distance saved.";
	return {
		transitMinutes,
		hops: legs.length,
		longHops,
		hotelChanges,
		early,
		late,
		density,
		line
	};
}
function localTripVoice(burden, wet) {
	const sky = wet ? ` ${wet} looks wet, so that day stays indoors.` : "";
	return `${burden.line}${sky}`.replace(/\s+/g, " ").trim();
}
function voiceStaysInside(line) {
	const clean = line.replace(/\s+/g, " ").trim();
	if (clean.length < 12 || clean.length > 180) return false;
	if (/\b(guarantee|michelin|five-star|\$\d|\d+\s*%|opening hours are|rated\s+\d|book now)\b/i.test(clean)) return false;
	return true;
}
function orderPlaces(origin, pool, count, salt, interests, children, pinned, balance, focus) {
	const rest = pool.filter((spot) => !pinned.some((pin) => pin.id === spot.id));
	rest.sort((a, b) => {
		const ar = focus === "local" ? 4 - importanceRank(a) : importanceRank(a);
		const br = focus === "local" ? 4 - importanceRank(b) : importanceRank(b);
		if (ar !== br) return ar - br;
		const ap = balancePenalty(a, balance);
		const bp = balancePenalty(b, balance);
		if (ap !== bp) return ap - bp;
		const ai = liked(a.category, interests, children) ? 0 : 1;
		const bi = liked(b.category, interests, children) ? 0 : 1;
		if (ai !== bi) return ai - bi;
		return distanceMeters(origin.lat, origin.lng, a.lat, a.lng) - distanceMeters(origin.lat, origin.lng, b.lat, b.lng);
	});
	const window = rest.slice(0, Math.min(rest.length, Math.max(count, 1) + 3));
	const start = window.length ? Math.abs(salt) % window.length : 0;
	const rotated = window.slice(start).concat(window.slice(0, start));
	return [...pinned, ...rotated].slice(0, Math.max(count, pinned.length));
}
function foodWhy(role, minutes, anchorName) {
	const hop = anchorName && role !== "meal-window" ? ` About ${Math.max(1, Math.round(minutes))} min from ${anchorName}.` : "";
	if (role === "meal-window") return "A meal window in this area. Choose a restaurant when you are there.";
	if (role === "cafe-break") return `A short break that fits the pace.${hop}`;
	if (role === "quick") return `A quick meal so the rest of the day stays intact.${hop}`;
	if (role === "local-specialty") return `A food place that fits this part of the route.${hop}`;
	return `Convenient route-fit meal.${hop}`;
}
function nearestFood(spots, anchor, used, kinds, maxMeters) {
	const rows = spots.filter((spot) => kinds.includes(spot.category) && !used.has(spot.id) && !isAreaPlace(spot) && distanceMeters(anchor.lat, anchor.lng, spot.lat, spot.lng) <= maxMeters);
	rows.sort((a, b) => distanceMeters(anchor.lat, anchor.lng, a.lat, a.lng) - distanceMeters(anchor.lat, anchor.lng, b.lat, b.lng));
	return rows[0] ?? null;
}
function mealWindow(day, meal, areaName, anchor) {
	const why = foodWhy("meal-window", 0, "");
	const name = meal === "dinner" ? `Dinner · ${areaName}` : meal === "cafe" ? `Coffee · ${areaName}` : `Lunch · ${areaName}`;
	return {
		id: `meal-${meal}-d${day}`,
		provider: "area",
		providerId: "",
		name,
		category: meal === "cafe" ? "cafe" : "restaurant",
		address: areaName,
		lat: anchor.lat,
		lng: anchor.lng,
		day,
		startTime: null,
		endTime: null,
		duration: meal === "cafe" ? 40 : 60,
		bookingStatus: "none",
		bucket: "scheduled",
		indoor: true,
		area: areaName,
		note: why,
		opening: "",
		why,
		foodRole: "meal-window",
		meal
	};
}
function namedMeal(place, day, meal, role, why) {
	return {
		...placeStop(place, day, "scheduled", why),
		id: `${place.id}-d${day}-${meal}`,
		duration: meal === "cafe" ? 40 : meal === "dinner" ? 80 : 70,
		foodRole: role,
		meal,
		why,
		note: why
	};
}
function planDayMeals(input) {
	const none = {
		lunch: null,
		cafe: null,
		dinner: null
	};
	if (input.lastDay || !input.hasSights) return none;
	const areaName = input.areaName || "this area";
	let lunch = null;
	if (input.foodPlanning === "minimal") lunch = mealWindow(input.day, "lunch", areaName, input.anchor);
	else {
		const max = input.foodPlanning === "feature" ? 4e3 : 2200;
		const kinds = input.foodPlanning === "feature" ? ["restaurant", "market"] : ["restaurant"];
		let place = nearestFood(input.spots, input.anchor, input.used, kinds, max);
		if (input.foodPlanning === "feature") {
			const notable = input.spots.filter((spot) => kinds.includes(spot.category) && !input.used.has(spot.id) && (spot.importance === "major" || spot.importance === "iconic") && distanceMeters(input.anchor.lat, input.anchor.lng, spot.lat, spot.lng) <= max);
			notable.sort((a, b) => distanceMeters(input.anchor.lat, input.anchor.lng, a.lat, a.lng) - distanceMeters(input.anchor.lat, input.anchor.lng, b.lat, b.lng));
			if (notable[0]) place = notable[0];
		}
		if (place && (input.foodPlanning === "feature" || place.importance === "iconic" || place.importance === "major" || (place.sitelinks ?? 0) >= 8)) {
			const minutes = estimateMinutes("walk", distanceMeters(input.anchor.lat, input.anchor.lng, place.lat, place.lng));
			const role = input.foodPlanning === "feature" && (place.importance === "major" || place.importance === "iconic") ? "local-specialty" : input.pace === "full" ? "quick" : "route-fit";
			lunch = namedMeal(place, input.day, "lunch", role, foodWhy(role, minutes, input.anchorName));
			input.used.add(place.id);
		} else lunch = mealWindow(input.day, "lunch", areaName, input.anchor);
	}
	let cafe = null;
	if (!input.child && (input.foodPlanning === "feature" || input.foodPlanning === "balanced" && (input.pace === "relaxed" || input.slow))) {
		const found = nearestFood(input.spots, input.anchor, input.used, ["cafe"], 1500);
		const notable = Boolean(found && (found.importance === "major" || found.importance === "iconic" || (found.sitelinks ?? 0) >= 8));
		if (found && (input.pace !== "full" || notable)) {
			const minutes = estimateMinutes("walk", distanceMeters(input.anchor.lat, input.anchor.lng, found.lat, found.lng));
			cafe = namedMeal(found, input.day, "cafe", "cafe-break", foodWhy("cafe-break", minutes, input.anchorName));
			input.used.add(found.id);
		}
	}
	let dinner = null;
	if (!input.excursionDay && !input.child && input.pace !== "relaxed" && input.foodPlanning !== "minimal") {
		const place = nearestFood(input.spots, input.base, input.used, ["restaurant"], 2200);
		if (place && (place.importance === "iconic" || place.importance === "major" || (place.sitelinks ?? 0) >= 8)) {
			const minutes = estimateMinutes("walk", distanceMeters(input.base.lat, input.base.lng, place.lat, place.lng));
			dinner = namedMeal(place, input.day, "dinner", input.pace === "full" ? "quick" : "route-fit", foodWhy(input.pace === "full" ? "quick" : "route-fit", minutes, input.baseName));
			input.used.add(place.id);
		}
	}
	return {
		lunch,
		cafe,
		dinner
	};
}
function buildTrip(input) {
	const areas = input.areas.filter((area) => Number.isFinite(area.latitude) && Number.isFinite(area.longitude)).slice(0, 3);
	const primary = areas[0] ?? {
		name: input.destination,
		latitude: 0,
		longitude: 0
	};
	const rejected = new Set(input.rejected.map((name) => name.toLowerCase()));
	const namedDestination = englishAreaName(input.destination, input.destination);
	const rawSpots = input.spots.filter((spot) => !rejectedName(spot, rejected) && Number.isFinite(spot.lat) && Number.isFinite(spot.lng) && !isAreaPlace(spot));
	const outside = rawSpots.filter((spot) => SEE.has(spot.category));
	const spots = mergeAnchorSpots(rawSpots, (input.skeleton?.length || outside.length === 0 ? anchorsForDestination(namedDestination === "this area" ? input.destination : namedDestination).map(discoveredAnchor) : []).filter((spot) => !rejectedName(spot, rejected)));
	const nights = Math.max(1, Math.min(90, input.nights));
	const planned = Math.min(7, nights);
	const childAges = explicitChildAges(input.childAges);
	const child = hasYoungChild(childAges);
	const styles = input.styles?.length ? input.styles.slice(0, 2) : ["comfort"];
	const balance = input.balance ?? "balanced";
	const firstVisit = input.firstVisit !== false;
	const focus = input.focus ?? "icons";
	const foodPlanning = input.foodPlanning ?? "balanced";
	const slow = styles.includes("slow") || styles.includes("wellness");
	if (!spots.filter((spot) => SEE.has(spot.category)).length && !input.skeleton?.length) return unloadedTrip(input, areas.length ? areas : [primary], primary, nights, planned, styles, balance, firstVisit, spots);
	const stay = compareBases(areas.length ? areas : [primary], input.transfers ?? areas.map((from) => areas.map((to) => from === to ? 0 : estimateMinutes("drive", distanceMeters(from.latitude, from.longitude, to.latitude, to.longitude)))), input.oneBase, nights);
	const assignment = areaPlan(Math.max(1, areas.length), planned, stay.mode);
	if (input.skeleton?.length) {
		const stayOrder = [];
		for (const day of input.skeleton) if (!stayOrder.includes(day.stayName)) stayOrder.push(day.stayName);
		if (stayOrder.length > 1) {
			const changes = input.skeleton.reduce((count, day, index) => count + (index > 0 && day.stayName !== input.skeleton?.[index - 1]?.stayName ? 1 : 0), 0);
			stay.mode = "split";
			stay.options = [{
				id: "route",
				label: stayOrder.join(" → "),
				hotelChanges: changes,
				lostMinutes: 0,
				note: input.playbook?.hotelNote || `${changes} hotel change${changes === 1 ? "" : "s"}. The nights are too far apart for one hotel.`,
				chosen: true
			}];
		} else if (input.playbook?.hotelNote) stay.options = stay.options.map((option) => option.chosen ? {
			...option,
			note: input.playbook?.hotelNote || option.note
		} : option);
	}
	const used = /* @__PURE__ */ new Set();
	const unmatched = input.mustVisit.filter((name) => !rejected.has(name.toLowerCase()) && !input.spots.some((spot) => askedFor(spot, [name])));
	const stops = [];
	const legs = [];
	const days = [];
	const reps = focus === "local" || !firstVisit ? [] : representatives(spots, balance, styles, planned);
	for (let index = 0; index < planned; index += 1) {
		const date = addDays(input.start, index);
		const sky = input.weather.find((day) => day.date === date);
		const intent = input.skeleton?.[index];
		const area = intent ? {
			name: englishAreaName(intent.stayName, input.destination),
			latitude: intent.stayLatitude,
			longitude: intent.stayLongitude,
			countryCode: intent.countryCode
		} : areas[assignment[index] ?? 0] ?? primary;
		const areaLabel = englishAreaName(area.name, input.destination);
		const base = {
			...anchor({
				...area,
				name: areaLabel
			}),
			id: `anchor-${areaLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-d${index}`,
			day: index
		};
		const indoorOnly = sky?.outdoorOk === false;
		const sights = spots.filter((spot) => SEE.has(spot.category) && !used.has(spot.id) && (spot.area === area.name || distanceMeters(area.latitude, area.longitude, spot.lat, spot.lng) < 12e3 || (spot.distanceKm ?? 0) >= 18));
		const indoors = indoorOnly ? sights.filter((spot) => spot.indoor) : sights;
		const iconicOutside = indoorOnly ? sights.filter((spot) => !spot.indoor && (spot.importance === "iconic" || spot.importance === "major")) : [];
		const pool = indoors.length ? [...indoors, ...iconicOutside] : sights;
		const near = pool.length ? pool : sights;
		const cityKept = balance === "city" ? near.filter((spot) => !((spot.distanceKm ?? 0) >= 18 || spot.excursion === "full" || spot.groups?.includes("excursion"))) : near;
		const nearby = balance === "city" ? cityKept : near;
		const reserved = new Set(reps.filter((row) => {
			if (row.day === index) return false;
			const date = addDays(input.start, row.day);
			if (input.weather.find((day) => day.date === date)?.outdoorOk === false && !row.place.indoor) return false;
			return true;
		}).map((row) => row.place.id));
		const forced = reps.filter((row) => row.day === index && !used.has(row.place.id) && (!indoorOnly || row.place.indoor || row.place.importance === "iconic")).map((row) => row.place);
		const openList = nearby.filter((spot) => !reserved.has(spot.id));
		const source = [...forced, ...openList.filter((spot) => !forced.some((item) => item.id === spot.id))];
		const pinnedOpen = [...forced, ...source.filter((spot) => askedFor(spot, input.mustVisit) && !forced.some((item) => item.id === spot.id))].filter((spot) => !used.has(spot.id));
		const pinnedFar = balance === "city" ? void 0 : pinnedOpen.find((spot) => placeIsFar(spot));
		const dayType = classifyBuiltDay(index, planned, intent, false);
		const count = sightBudget(input.pace, dayType, child, slow);
		let chosen;
		if (intent) chosen = stopsForIntent(intent, spots, used, intent.visitMode === "DAY_TRIP" || intent.visitMode === "EXCURSION" ? Math.min(count, child || slow ? 1 : 3) : count, input.salt + index, childAges, firstVisit);
		else if (pinnedFar && index !== planned - 1) {
			const around = source.filter((spot) => spot.id !== pinnedFar.id && spot.excursion !== "full" && distanceMeters(pinnedFar.lat, pinnedFar.lng, spot.lat, spot.lng) < 4e3);
			const extra = child || slow ? 1 : input.pace === "full" ? 3 : 2;
			chosen = [pinnedFar, ...orderPlaces(pinnedFar, around, extra, input.salt + index, input.interests, child, [], balance, focus).filter((spot) => spot.id !== pinnedFar.id)].slice(0, 1 + extra);
		} else {
			const cityChoices = orderPlaces(base, source, count, input.salt + index, input.interests, child, pinnedOpen, balance, focus).filter((spot) => !placeIsFar(spot));
			const leadPick = cityChoices[0];
			const nearLead = leadPick ? cityChoices.filter((spot) => spot.id === leadPick.id || distanceMeters(leadPick.lat, leadPick.lng, spot.lat, spot.lng) < 8e3) : [];
			chosen = pinnedFar ? [pinnedFar] : nearLead.slice(0, count);
		}
		chosen.forEach((spot) => used.add(spot.id));
		const reservedDay = Boolean(intent && !chosen.length && (intent.visitMode === "DAY_TRIP" || intent.visitMode === "EXCURSION" || intent.role === "nature" || intent.role === "family"));
		const leadPlace = chosen[0];
		const excursionDay = reservedDay || chosen.some((spot) => placeIsFar(spot) || (leadPlace ? distanceMeters(area.latitude, area.longitude, leadPlace.lat, leadPlace.lng) >= 12e3 : false) || intent?.visitMode === "DAY_TRIP" || intent?.visitMode === "EXCURSION");
		const [lead, ...later] = chosen;
		const reservedAnchor = reservedDay && intent ? {
			lat: intent.latitude,
			lng: intent.longitude
		} : null;
		const lunchAnchor = lead ?? (reservedAnchor ? {
			...base,
			...reservedAnchor,
			locality: intent?.areaName
		} : base);
		const localRaw = lunchAnchor.locality || "";
		const mealArea = englishAreaName(!localRaw || hasNonLatin(localRaw) ? intent?.areaName || areaLabel : localRaw, areaLabel);
		const meals = planDayMeals({
			spots,
			used,
			day: index,
			lastDay: index === planned - 1,
			excursionDay,
			pace: input.pace,
			foodPlanning,
			child,
			slow,
			hasSights: chosen.length > 0 || reservedDay,
			anchor: lunchAnchor,
			base,
			areaName: mealArea,
			anchorName: readableName(lunchAnchor),
			baseName: areaLabel
		});
		const sequence = [{ stop: base }];
		if (lead) sequence.push({ stop: {
			...placeStop(lead, index, "scheduled", whyStop(lead, excursionDay, indoorOnly)),
			id: `${lead.id}-d${index}`
		} });
		else if (reservedDay && intent) sequence.push({ stop: areaDayStop(intent, index) });
		if (meals.lunch) sequence.push({ stop: meals.lunch });
		if (meals.cafe) sequence.push({ stop: meals.cafe });
		for (const spot of later) sequence.push({ stop: {
			...placeStop(spot, index, "scheduled", whyStop(spot, false, indoorOnly)),
			id: `${spot.id}-d${index}`
		} });
		if (meals.dinner) sequence.push({ stop: meals.dinner });
		let cursor = child || input.pace === "relaxed" || slow ? 600 : styles.includes("adventure") ? 480 : 540;
		let previous = sequence[0]?.stop ?? base;
		const dayStops = [];
		sequence.forEach((entry, entryIndex) => {
			const stop = {
				...entry.stop,
				day: index
			};
			if (child && entryIndex > 0 && cursor >= 1020 && stop.category !== "stay") return;
			if (entryIndex > 0) {
				const from = {
					lat: previous.lat,
					lng: previous.lng
				};
				const hop = hopMinutes(input.move, from, stop, input.matrix ?? null, spots);
				const minutes = hop.minutes;
				if (child && cursor + (minutes ?? 0) >= 1020) return;
				cursor += minutes ?? 0;
				if (stop.meal === "lunch" && cursor < 690) cursor = 690;
				if (stop.meal === "cafe" && cursor < 840) cursor = 840;
				if (stop.meal === "dinner" && cursor < 1050) cursor = 1050;
				legs.push(explainLeg({
					fromId: previous.id,
					toId: stop.id,
					day: index,
					mode: input.move,
					minutes,
					meters: Math.round(distanceMeters(from.lat, from.lng, stop.lat, stop.lng)),
					source: hop.source,
					label: legLabel(input.move, minutes, hop.source)
				}, input.move, styles, child));
			}
			stop.startTime = clockTime(cursor);
			stop.endTime = clockTime(cursor + stop.duration);
			cursor += stop.duration;
			previous = stop;
			dayStops.push(stop);
		});
		const lastEnd = dayStops[dayStops.length - 1]?.endTime ?? "12:00";
		const farLocal = chosen.map((spot) => spot.locality).find((value) => value && !hasNonLatin(value)) || "";
		const themeRaw = cleanTheme(intent?.title || (excursionDay && farLocal ? `${farLocal} day trip` : areaLabel), input.destination);
		const resolvedType = classifyBuiltDay(index, planned, intent, excursionDay);
		const theme = resolvedType === "FULL_DAY" && isGenericDayTheme(themeRaw, input.destination) ? themeForArea(intent?.areaName || "", input.destination) || themeRaw : themeRaw;
		days.push({
			index,
			date,
			label: `Day ${index + 1} · ${dayLabel(date)}`,
			weather: sky?.summary || "Weather was not available for this day.",
			outdoorOk: sky?.outdoorOk ?? null,
			locked: input.lockedDates.includes(date),
			area: englishAreaName(intent?.areaName || areaLabel, input.destination),
			intent: theme,
			theme,
			dayType: resolvedType,
			line: null,
			freeNote: freeWindow(lastEnd),
			requiredGroups: intent?.requiredGroups ?? intent?.groups,
			focusLat: intent?.latitude,
			focusLng: intent?.longitude
		});
		stops.push(...dayStops);
	}
	for (let index = planned; index < nights; index += 1) {
		const date = addDays(input.start, index);
		days.push({
			index,
			date,
			label: `Day ${index + 1} · ${dayLabel(date)}`,
			weather: "Open day.",
			outdoorOk: null,
			locked: false,
			area: primary.name,
			line: null,
			freeNote: ""
		});
	}
	const chosenStay = new Set(stops.filter((stop) => stop.category === "stay" && stop.providerId).map((stop) => stop.providerId));
	spots.filter((spot) => spot.category === "stay" ? !chosenStay.has(spot.providerId) : !used.has(spot.id)).forEach((spot) => {
		const wanted = askedFor(spot, input.mustVisit);
		const bucket = FOOD$2.has(spot.category) ? "food" : wanted ? "must" : SEE.has(spot.category) ? "saved" : "maybe";
		stops.push(placeStop(spot, null, bucket, "Saved. Not placed on a day yet."));
	});
	const burden = burdenFrom(legs, stay.options.find((option) => option.chosen)?.hotelChanges ?? 0, stops, input.move, child);
	const wet = days.find((day) => day.outdoorOk === false)?.label ?? "";
	const cluster = clusterLine(stops);
	const coverage = assessCoverage(spots, stops, nights, firstVisit, balance);
	const hotels = hotelPicks(stops, DEFAULT_HOTEL_PREFERENCES, emptyHotelMemory(), input.move);
	const whyTrip = whyLine(balance, styles, firstVisit, input.oneBase || stay.mode === "single", coverage);
	const notes = [
		whyTrip,
		stay.options.find((option) => option.chosen)?.note ?? "",
		input.move === "transit" ? "Transit times aren't available, so these hops use a taxi or a walk." : "",
		nights > planned ? `The stay is ${nights} nights. The first ${planned} days are planned.` : "",
		unmatched.length ? `Couldn't place: ${unmatched.join(", ")}.` : ""
	].filter(Boolean);
	return repairTrip({
		id: input.id || `trip-${input.destination}-${input.start}-${input.salt}`,
		title: `${input.destination}, ${nights} night${nights === 1 ? "" : "s"}`,
		destination: input.destination,
		areas: areas.length ? areas : [primary],
		start: input.start,
		nights,
		adults: input.adults,
		childAges,
		pace: input.pace,
		move: input.move,
		oneBase: stay.mode === "single",
		days,
		stops,
		legs,
		bookings: [],
		bases: stay.options,
		burden,
		voice: localTripVoice(burden, wet),
		notes,
		cluster,
		unmatched,
		placeNote: input.discovery?.note ?? "",
		transitNote: input.move === "transit" ? "Transit times aren't available, so these hops use a taxi or a walk." : "",
		styles,
		balance,
		firstVisit,
		coverage,
		whyTrip,
		hotels,
		hotelPreferences: { ...DEFAULT_HOTEL_PREFERENCES },
		hotelMemory: rememberShortlist(emptyHotelMemory(), hotels),
		hotelNote: "",
		profileNote: input.profileNote ?? "",
		countryCode: input.countryCode || areas.find((area) => area.countryCode)?.countryCode || "",
		discovery: input.discovery,
		interests: input.interests,
		foodPlanning,
		partyExplicit: true,
		hotelSelectionSource: "NONE",
		playbook: input.playbook
	});
}
function sightBudget(pace, type, child, slow) {
	if (child || slow) return type === "FULL_DAY" ? 2 : 1;
	if (type === "ARRIVAL_DAY" || type === "DEPARTURE_DAY") return pace === "full" ? 2 : 2;
	if (type === "EXCURSION_DAY") return pace === "relaxed" ? 2 : 3;
	if (pace === "relaxed") return 3;
	if (pace === "full") return 5;
	return 4;
}
function classifyBuiltDay(index, planned, intent, excursion) {
	if (intent?.visitMode === "DAY_TRIP" || intent?.visitMode === "EXCURSION" || excursion) return "EXCURSION_DAY";
	if (intent?.role === "departure") return "DEPARTURE_DAY";
	if (intent?.role === "arrival" || index === 0 && planned > 1) return "ARRIVAL_DAY";
	return "FULL_DAY";
}
function meaningfulSight(stop) {
	return stop.category !== "stay" && !FOOD$2.has(stop.category) && stop.provider !== "area";
}
function repairTrip(trip) {
	let next = dedupeDayMeals(trip);
	next = clearUnaskedHotels(next);
	const filled = fillThinDays(next);
	next = filled.trip;
	const covered = coverExperienceGaps(next);
	next = covered.trip;
	next = repairGenericThemes(next);
	next = labelFreeTime(next);
	return {
		...next,
		curation: curationReport(next, filled.repairs + covered.repairs)
	};
}
function clearUnaskedHotels(trip) {
	if (trip.hotelSelectionSource === "USER_BOOKED" || trip.hotelSelectionSource === "USER_SELECTED" || trip.hotelSelectionSource === "IMPORT") return trip;
	if (!trip.stops.filter((stop) => stop.day != null && stop.category === "stay" && stop.provider !== "area").length) return trip;
	const stops = trip.stops.map((stop) => {
		if (stop.category !== "stay" || stop.provider === "area" || stop.day == null) return stop;
		return {
			...anchor({
				name: englishAreaName(stop.area || trip.destination, trip.destination),
				latitude: stop.lat,
				longitude: stop.lng
			}),
			id: stop.id,
			day: stop.day,
			startTime: stop.startTime,
			endTime: stop.endTime
		};
	});
	return {
		...trip,
		stops,
		hotelSelectionSource: "NONE"
	};
}
function dedupeDayMeals(trip) {
	const drop = /* @__PURE__ */ new Set();
	for (const day of trip.days) {
		const lunches = trip.stops.filter((stop) => stop.day === day.index).filter((stop) => stop.meal === "lunch" || FOOD$2.has(stop.category) && stop.meal !== "dinner" && stop.meal !== "cafe" && (stop.startTime ?? "") >= "11:00" && (stop.startTime ?? "") < "15:30");
		if (lunches.length <= 1) continue;
		const notable = lunches.find((stop) => stop.provider !== "area" && (stop.importance === "iconic" || stop.importance === "major" || (stop.sitelinks ?? 0) >= 8));
		const window = lunches.find((stop) => stop.foodRole === "meal-window" || stop.provider === "area");
		const keep = notable ?? window ?? lunches[0];
		for (const stop of lunches) if (stop && keep && stop.id !== keep.id) drop.add(stop.id);
	}
	if (!drop.size) return trip;
	const stops = trip.stops.flatMap((stop) => {
		if (!drop.has(stop.id)) return [stop];
		if (stop.provider === "area") return [];
		return [{
			...stop,
			day: null,
			startTime: null,
			endTime: null,
			bucket: "food",
			meal: void 0,
			note: "Saved. A second lunch was not scheduled."
		}];
	});
	let next = {
		...trip,
		stops
	};
	for (const day of trip.days) next = retimeDay(next, day.index);
	return next;
}
function fillThinDays(trip) {
	let next = trip;
	let repairs = 0;
	const min = trip.pace === "full" ? 4 : trip.pace === "relaxed" ? 2 : 3;
	for (const day of trip.days) {
		if (day.dayType !== "FULL_DAY" && day.dayType !== "EXCURSION_DAY" && day.dayType !== "ARRIVAL_DAY") continue;
		const rows = next.stops.filter((stop) => stop.day === day.index);
		const sights = rows.filter(meaningfulSight);
		const floor = day.dayType === "FULL_DAY" ? min : 2;
		if (sights.length >= floor) continue;
		const focus = dayFocus(day, sights, rows);
		if (!focus) continue;
		const have = new Set(sights.flatMap((stop) => stop.groups ?? []));
		const missing = (day.requiredGroups ?? []).filter((group) => !have.has(group));
		const need = floor - sights.length;
		const candidates = next.stops.filter((stop) => {
			if (stop.day != null || stop.excluded || stop.provider === "area") return false;
			if (!SEE.has(stop.category)) return false;
			if (stop.importance === "local" && !isAnchorNote(stop.sourceNote)) return false;
			if (day.outdoorOk === false && !stop.indoor && stop.importance !== "iconic" && stop.importance !== "major") return false;
			if ((stop.excursion === "full" || (stop.distanceKm ?? 0) >= 28) && day.dayType !== "EXCURSION_DAY") return false;
			const limit = Boolean(stop.locality && day.area && stop.locality.toLowerCase() === day.area.toLowerCase()) ? 12e3 : isAnchorNote(stop.sourceNote) ? 8e3 : 6e3;
			if (distanceMeters(focus.lat, focus.lng, stop.lat, stop.lng) > limit) return false;
			if (missing.length && !(stop.groups ?? []).some((group) => missing.includes(group)) && !isAnchorNote(stop.sourceNote)) return false;
			return true;
		}).sort((a, b) => {
			const help = (stop) => (stop.groups ?? []).some((group) => missing.includes(group)) ? 0 : 1;
			const rank = (stop) => stop.importance === "iconic" ? 0 : stop.importance === "major" ? 1 : 2;
			return help(a) - help(b) || rank(a) - rank(b) || distanceMeters(focus.lat, focus.lng, a.lat, a.lng) - distanceMeters(focus.lat, focus.lng, b.lat, b.lng);
		}).slice(0, need);
		if (!candidates.length) continue;
		repairs += 1;
		const stops = next.stops.map((stop) => {
			const index = candidates.findIndex((item) => item.id === stop.id);
			if (index < 0) return stop;
			return {
				...stop,
				day: day.index,
				bucket: "scheduled",
				startTime: clockTime(840 + index * 20),
				note: stop.why || "Fits the missing part of this day."
			};
		});
		next = retimeDay({
			...next,
			stops
		}, day.index);
	}
	return {
		trip: next,
		repairs
	};
}
function coverExperienceGaps(trip) {
	if (trip.firstVisit === false) return {
		trip,
		repairs: 0
	};
	const required = packFor(trip.destination)?.firstVisitGroups ?? [];
	if (!required.length) return {
		trip,
		repairs: 0
	};
	let next = trip;
	let repairs = 0;
	const have = () => new Set(next.stops.filter((stop) => stop.day != null && meaningfulSight(stop)).flatMap((stop) => stop.groups ?? []));
	for (const group of required) {
		if (have().has(group)) continue;
		const candidate = next.stops.filter((stop) => stop.day == null && !stop.excluded && SEE.has(stop.category) && (stop.groups ?? []).includes(group) && isAnchorNote(stop.sourceNote)).sort((a, b) => (a.importance === "iconic" ? 0 : 1) - (b.importance === "iconic" ? 0 : 1))[0];
		if (!candidate) continue;
		const day = dayForAnchor(next, candidate);
		if (!day) continue;
		const sights = next.stops.filter((stop) => stop.day === day.index && meaningfulSight(stop));
		const cap = next.pace === "full" ? 5 : next.pace === "relaxed" ? 3 : 4;
		let stops = next.stops;
		if (sights.length >= cap) {
			const weak = [...sights].reverse().find((stop) => !isAnchorNote(stop.sourceNote) && stop.importance !== "iconic");
			if (!weak) continue;
			stops = stops.map((stop) => stop.id === weak.id ? {
				...stop,
				day: null,
				bucket: "saved",
				startTime: null,
				endTime: null
			} : stop);
		}
		stops = stops.map((stop) => stop.id === candidate.id ? {
			...stop,
			day: day.index,
			bucket: "scheduled",
			note: stop.why || "A defining stop for this destination."
		} : stop);
		next = retimeDay({
			...next,
			stops
		}, day.index);
		repairs += 1;
	}
	return {
		trip: next,
		repairs
	};
}
function dayForAnchor(trip, candidate) {
	const days = trip.days.filter((day) => day.dayType === "FULL_DAY" || day.dayType === "ARRIVAL_DAY" || day.dayType === "EXCURSION_DAY");
	let best = null;
	let bestScore = Number.POSITIVE_INFINITY;
	for (const day of days) {
		const rows = trip.stops.filter((stop) => stop.day === day.index);
		const sights = rows.filter(meaningfulSight);
		const focus = dayFocus(day, sights, rows);
		if (!focus) continue;
		const meters = distanceMeters(focus.lat, focus.lng, candidate.lat, candidate.lng);
		const sameArea = Boolean(candidate.locality && day.area && candidate.locality.toLowerCase() === day.area.toLowerCase());
		const excursion = candidate.excursion === "full" || candidate.excursion === "half";
		if (!sameArea && meters > (excursion ? 2e4 : 1e4)) continue;
		if (excursion && day.dayType !== "EXCURSION_DAY" && !sameArea && meters > 12e3) continue;
		const score = (sameArea ? 0 : meters) + sights.length * 500;
		if (score < bestScore) {
			bestScore = score;
			best = day;
		}
	}
	return best;
}
function dayFocus(day, sights, rows) {
	if (Number.isFinite(day.focusLat) && Number.isFinite(day.focusLng)) return {
		lat: day.focusLat,
		lng: day.focusLng
	};
	const pin = sights[0] ?? rows.find((stop) => stop.provider === "area" && stop.category !== "stay") ?? rows.find((stop) => stop.category === "stay");
	return pin ? {
		lat: pin.lat,
		lng: pin.lng
	} : null;
}
function repairGenericThemes(trip) {
	const days = trip.days.map((day) => {
		if (day.dayType !== "FULL_DAY") return day;
		if (!isGenericDayTheme(day.theme || day.intent || "", trip.destination)) return day;
		const better = themeForArea(day.area, trip.destination);
		if (!better || isGenericDayTheme(better, trip.destination)) return day;
		return {
			...day,
			theme: better,
			intent: better
		};
	});
	return {
		...trip,
		days
	};
}
function curationReport(trip, thinRepairs) {
	const scheduled = trip.stops.filter((stop) => stop.day != null && meaningfulSight(stop));
	const anchorStops = scheduled.filter((stop) => isAnchorNote(stop.sourceNote)).length;
	const osmStops = scheduled.filter((stop) => stop.provider === "osm" && !isAnchorNote(stop.sourceNote)).length;
	const have = new Set(scheduled.flatMap((stop) => stop.groups ?? []));
	const required = packFor(trip.destination)?.firstVisitGroups ?? [];
	const groupsSatisfied = required.filter((group) => have.has(group));
	const groupsMissing = trip.firstVisit === false ? [] : required.filter((group) => !have.has(group));
	const fallback = [];
	if (!packFor(trip.destination)) fallback.push("no-canonical-pool");
	if (trip.stops.some((stop) => stop.day != null && stop.provider === "area" && stop.category !== "stay" && !FOOD$2.has(stop.category))) fallback.push("area-reserve");
	return {
		anchorStops,
		osmStops,
		groupsSatisfied,
		groupsMissing,
		thinRepairs,
		fallback
	};
}
function labelFreeTime(trip) {
	const min = trip.pace === "full" ? 4 : trip.pace === "relaxed" ? 2 : 3;
	const days = trip.days.map((day) => {
		const rows = trip.stops.filter((stop) => stop.day === day.index);
		const sights = rows.filter(meaningfulSight);
		const end = rows[rows.length - 1]?.endTime ?? "";
		const endMin = end ? clockToMinutes(end) : 1080;
		const area = englishAreaName(day.area || day.theme || trip.destination, trip.destination);
		if (day.dayType === "FULL_DAY" && sights.length >= Math.min(min, 2) && endMin < 960) return {
			...day,
			freeNote: `FREE AFTERNOON · Explore ${area} at your own pace.`
		};
		if (day.dayType === "FULL_DAY" && sights.length > 0 && sights.length < min && endMin < 960) return {
			...day,
			freeNote: `Open time in ${area}. Nothing else that fits this day was left unused.`
		};
		return day;
	});
	return {
		...trip,
		days
	};
}
function unloadedTrip(input, areas, primary, nights, planned, styles, balance, firstVisit, spots) {
	const days = [];
	for (let index = 0; index < nights; index += 1) {
		const date = addDays(input.start, index);
		const sky = input.weather.find((day) => day.date === date);
		days.push({
			index,
			date,
			label: `Day ${index + 1} · ${dayLabel(date)}`,
			weather: index < planned ? sky?.summary || "Weather was not available for this day." : "Places didn't load.",
			outdoorOk: sky?.outdoorOk ?? null,
			locked: input.lockedDates.includes(date),
			area: input.skeleton?.[index]?.title || primary.name,
			intent: input.skeleton?.[index]?.title,
			line: null,
			freeNote: ""
		});
	}
	const stays = spots.filter((spot) => spot.category === "stay").map((spot) => placeStop(spot, null, "saved", "Saved stay. Sights did not load, so this is not a day plan."));
	const failed = input.discovery?.osm === "failed" && input.discovery?.wikidata === "failed";
	const childAges = explicitChildAges(input.childAges);
	const placeNote = input.discovery?.note || (failed ? `Couldn't load places for ${input.destination}.` : `No places came back for ${input.destination}.`);
	const burden = burdenFrom([], 0, stays, input.move, hasYoungChild(childAges));
	const hotels = hotelPicks(stays, DEFAULT_HOTEL_PREFERENCES, emptyHotelMemory(), input.move);
	return {
		id: input.id || `trip-${input.destination}-${input.start}-empty`,
		title: `${input.destination}, ${nights} night${nights === 1 ? "" : "s"}`,
		destination: input.destination,
		areas,
		start: input.start,
		nights,
		adults: input.adults,
		childAges,
		pace: input.pace,
		move: input.move,
		oneBase: input.oneBase,
		days,
		stops: stays,
		legs: [],
		bookings: [],
		bases: [{
			id: "one",
			label: `Stay in ${primary.name}`,
			hotelChanges: 0,
			lostMinutes: 0,
			note: "No sights loaded, so no base was compared.",
			chosen: true
		}],
		burden,
		voice: localTripVoice(burden, ""),
		notes: [placeNote],
		cluster: "",
		unmatched: input.mustVisit,
		placeNote,
		transitNote: "",
		styles,
		balance,
		firstVisit,
		coverage: [],
		whyTrip: placeNote,
		hotels,
		hotelPreferences: { ...DEFAULT_HOTEL_PREFERENCES },
		hotelMemory: rememberShortlist(emptyHotelMemory(), hotels),
		hotelNote: "",
		profileNote: input.profileNote ?? "",
		countryCode: input.countryCode || areas.find((area) => area.countryCode)?.countryCode || "",
		discovery: input.discovery ?? {
			osm: "failed",
			wikidata: "failed",
			hotels: "failed",
			note: placeNote
		},
		partyExplicit: true,
		playbook: input.playbook
	};
}
function annotatePlace(spot, originLat, originLng) {
	const distanceKm = Math.round(distanceMeters(originLat, originLng, spot.lat, spot.lng) / 1e3 * 10) / 10;
	const name = spot.name.toLowerCase();
	const groups = [];
	if (spot.category === "zoo" || spot.category === "aquarium" || /panda|wildlife|safari/.test(name)) groups.push("wildlife");
	if (spot.category === "museum" || spot.category === "historic" || spot.category === "landmark" || /temple|monastery|palace|cathedral|heritage/.test(name)) groups.push("heritage");
	if (FOOD$2.has(spot.category)) groups.push("food");
	if (spot.category === "shopping" || spot.category === "market") groups.push("shopping");
	if (spot.category === "nightlife") groups.push("nightlife");
	if (spot.category === "park" || spot.category === "garden" || spot.category === "viewpoint" || spot.category === "beach" || /mountain|scenic|national park/.test(name)) groups.push("nature");
	if (/alley|old town|old street|district|neighbourhood|neighborhood/.test(name)) groups.push("neighbourhood");
	if (distanceKm >= 18) groups.push("excursion");
	if (!groups.length) groups.push("city");
	const links = spot.sitelinks ?? 0;
	let importance = "local";
	if (links >= 25 || spot.mentioned && links >= 8) importance = "iconic";
	else if (links >= 10 || spot.mentioned) importance = "major";
	else if (links >= 4) importance = "interest";
	else if (FOOD$2.has(spot.category) || spot.category === "park" || spot.category === "market") importance = "local";
	else importance = "optional";
	let excursion = "none";
	if (groups.includes("excursion") && (groups.includes("nature") || groups.includes("heritage") || groups.includes("wildlife"))) excursion = distanceKm >= 28 ? "full" : "half";
	return {
		...spot,
		distanceKm,
		importance: spot.importance ?? importance,
		groups: spot.groups?.length ? spot.groups : [...new Set(groups)].slice(0, 3),
		excursion: spot.excursion ?? excursion
	};
}
function importanceRank(spot) {
	return {
		iconic: 0,
		major: 1,
		interest: 2,
		local: 3,
		optional: 4
	}[spot.importance ?? "local"];
}
function placeIsFar(spot) {
	return spot.excursion === "full";
}
function farBudget(balance, days) {
	if (balance === "city" || days < 3) return 0;
	if (balance === "nature") return Math.min(3, Math.max(1, days - 2));
	return Math.min(2, Math.max(1, days - 3));
}
function balancePenalty(spot, balance) {
	if (balance === "city" && placeIsFar(spot)) return 4;
	if (balance === "nature" && (spot.groups?.includes("nature") || spot.groups?.includes("wildlife") || spot.groups?.includes("excursion"))) return -1;
	return 0;
}
function representatives(spots, balance, styles, days) {
	const notable = spots.filter((spot) => (spot.importance === "iconic" || spot.importance === "major") && spot.category !== "stay" && !FOOD$2.has(spot.category));
	const farPicked = notable.filter(placeIsFar).sort((a, b) => (b.sitelinks ?? 0) - (a.sitelinks ?? 0) || importanceRank(a) - importanceRank(b)).slice(0, farBudget(balance, days));
	const farIds = new Set(farPicked.map((spot) => spot.id));
	const byGroup = /* @__PURE__ */ new Map();
	for (const spot of notable) {
		if (farIds.has(spot.id) || placeIsFar(spot)) continue;
		const group = spot.groups?.[0] ?? "city";
		byGroup.set(group, [...byGroup.get(group) ?? [], spot]);
	}
	for (const list of byGroup.values()) list.sort((a, b) => (b.sitelinks ?? 0) - (a.sitelinks ?? 0) || importanceRank(a) - importanceRank(b));
	const weight = (group) => {
		if (styles.includes("culture") && group === "heritage") return -2;
		if ((styles.includes("adventure") || balance === "nature") && (group === "nature" || group === "wildlife")) return -2;
		return 0;
	};
	const cityPicked = [];
	for (const group of [...byGroup.keys()].sort((a, b) => weight(a) - weight(b) || a.localeCompare(b))) {
		if (cityPicked.length >= Math.max(0, days - farPicked.length)) break;
		const place = byGroup.get(group)?.[0];
		if (place) cityPicked.push(place);
	}
	const usedDays = /* @__PURE__ */ new Set();
	const picked = [];
	const farDays = Array.from({ length: days }, (_, day) => day).filter((day) => (days <= 2 || day !== 0) && (days <= 3 || day !== days - 1));
	farPicked.forEach((place, index) => {
		const day = farDays[index] ?? farDays.at(-1) ?? 0;
		if (usedDays.has(day)) return;
		usedDays.add(day);
		picked.push({
			day,
			place
		});
	});
	let cursor = 0;
	for (const place of cityPicked) {
		while (cursor < days && usedDays.has(cursor)) cursor += 1;
		if (cursor >= days) break;
		usedDays.add(cursor);
		picked.push({
			day: cursor,
			place
		});
		cursor += 1;
	}
	return picked;
}
function whyStop(place, excursion, wet) {
	if (wet && !place.indoor) return "Weather is poor, so this stop is a compromise.";
	if (place.story?.whyGo) return place.story.whyGo;
	if (excursion || place.excursion === "full") return "A full day out. It is not squeezed between two city meals.";
	return "Placed with the nearby stops.";
}
function modeWord(mode) {
	if (mode === "walk") return "Walk";
	if (mode === "drive") return "Drive";
	if (mode === "taxi") return "Taxi";
	return "Transit";
}
function explainLeg(leg, preference, styles, child) {
	const meters = leg.meters ?? 0;
	const roadKnown = preference !== "walk" && leg.minutes != null && leg.source !== "none";
	const walkKnown = preference === "walk" && leg.minutes != null && leg.source !== "none";
	const roadMinutes = roadKnown ? leg.minutes : meters ? estimateMinutes("drive", meters) : null;
	const walkMinutes = walkKnown ? leg.minutes : meters ? estimateMinutes("walk", meters) : null;
	const roadSource = roadKnown ? leg.source : roadMinutes == null ? "none" : "estimate";
	const walkSource = walkKnown ? leg.source : walkMinutes == null ? "none" : "estimate";
	const roadMode = preference === "drive" ? "drive" : "taxi";
	const walkQuality = walkSource === "osrm" ? "routing_estimate" : walkMinutes == null ? "unavailable" : "approximate";
	const roadQuality = roadSource === "osrm" ? "routing_estimate" : roadMinutes == null ? "unavailable" : "approximate";
	const impracticalWalk = (walkMinutes ?? 0) >= 90 || meters >= 7e3;
	const excursionHop = meters >= 8e3 || (roadMinutes ?? 0) >= 50;
	const alternatives = [
		impracticalWalk ? {
			mode: "walk",
			minutes: null,
			meters: meters || null,
			source: "unavailable",
			quality: "unavailable",
			provider: "open-street",
			walkingMinutes: null,
			transfers: 0,
			label: "Walking · Not practical"
		} : {
			mode: "walk",
			minutes: walkMinutes,
			meters: meters || null,
			source: walkSource,
			quality: walkQuality,
			provider: "open-street",
			walkingMinutes: walkMinutes,
			transfers: 0,
			label: walkMinutes == null ? "Walk unavailable" : walkSource === "estimate" ? `Walk · ~${walkMinutes} min` : `Walk · ${walkMinutes} min`
		},
		{
			mode: roadMode,
			minutes: roadMinutes,
			meters: meters || null,
			source: roadSource,
			quality: roadQuality,
			provider: "open-street",
			transfers: 0,
			label: roadMinutes == null ? "Road time unavailable" : roadSource === "estimate" ? `${modeWord(roadMode)} · ~${roadMinutes} min` : `${modeWord(roadMode)} · ${roadMinutes} min`
		},
		{
			mode: "transit",
			minutes: null,
			meters: null,
			source: "unavailable",
			quality: "unavailable",
			provider: "none",
			transfers: null,
			label: excursionHop ? "Rail · open Navigate to check trains" : "Transit routing unavailable"
		}
	];
	const shown = pickMode(preference, styles, child, walkMinutes, roadMinutes, roadMode);
	const chosen = alternatives.find((item) => item.mode === shown) ?? alternatives[1] ?? alternatives[0];
	const source = chosen?.source === "osrm" || chosen?.source === "estimate" || chosen?.source === "none" ? chosen.source : "none";
	const reason = legRecommendation({
		mode: shown,
		styles,
		child,
		walkMinutes,
		roadMinutes
	});
	return {
		...leg,
		minutes: chosen?.minutes ?? leg.minutes,
		source,
		label: chosen?.label ?? (chosen?.minutes == null ? "Route not calculated" : leg.label),
		shown,
		selectedMode: shown,
		recommendedMode: shown,
		recommendationReason: reason,
		planningProvider: "open-street",
		alternatives
	};
}
var BALANCE_THEMES = [
	{
		label: "Major landmarks",
		groups: ["city", "landmark"]
	},
	{
		label: "Historic centre",
		groups: ["heritage"]
	},
	{
		label: "Art & culture",
		groups: ["museum", "culture"]
	},
	{
		label: "Neighbourhood atmosphere",
		groups: ["neighbourhood"]
	},
	{
		label: "Parks & gardens",
		groups: [
			"nature",
			"garden",
			"park"
		]
	},
	{
		label: "Wildlife",
		groups: ["wildlife"]
	},
	{
		label: "Food",
		groups: ["food"]
	},
	{
		label: "Regional excursion",
		groups: ["excursion"],
		optional: true
	}
];
function experienceBalance(rows, place = "") {
	const coverage = rows ?? [];
	const out = [];
	for (const theme of BALANCE_THEMES) {
		const matched = coverage.filter((row) => theme.groups.includes(row.group));
		if (!matched.length) continue;
		const label = theme.groups.includes("heritage") && place ? `Historic ${place}` : theme.label;
		if (matched.some((row) => row.status === "covered")) out.push({
			label,
			state: "in"
		});
		else if (theme.optional) out.push({
			label,
			state: "optional"
		});
	}
	return out;
}
function notableOmissions(trip) {
	return trip.stops.filter((stop) => {
		if (stop.day != null || stop.excluded) return false;
		if (stop.importance !== "iconic") return false;
		return stop.excursion === "full" || (stop.distanceKm ?? 0) >= 28 || Boolean(stop.groups?.includes("excursion"));
	}).slice(0, 2);
}
function sameParty(left, right) {
	if (!right || left.length !== right.length) return false;
	return left.every((age, index) => age === right[index]);
}
/** A saved trip whose only child age is 0, and which was never marked explicit, came from a blank ages box. */
function normalizeTravelParty(trip) {
	const ages = explicitChildAges(trip.childAges);
	const phantom = trip.partyExplicit !== true && ages.length === 1 && ages[0] === 0;
	const childAges = phantom ? [] : ages;
	if (!phantom && trip.partyExplicit === true && sameParty(childAges, trip.childAges)) return trip;
	const legs = phantom ? trip.legs.map((leg) => explainLeg(leg, trip.move, trip.styles ?? [], false)) : trip.legs;
	return {
		...trip,
		childAges,
		partyExplicit: true,
		legs
	};
}
function pickMode(preference, styles, child, walkMinutes, roadMinutes, roadMode) {
	const luxury = styles.includes("luxury");
	const wellness = styles.includes("wellness");
	const easy = styles.includes("backpacking") || styles.includes("slow");
	const adventure = styles.includes("adventure");
	if (child && walkMinutes != null && walkMinutes <= 8 && !luxury) return "walk";
	if (wellness && walkMinutes != null && walkMinutes <= 15 && !luxury) return "walk";
	if (walkMinutes != null && walkMinutes <= 12 && !luxury) return "walk";
	if (walkMinutes != null && walkMinutes <= 25 && easy && !child && !wellness) return "walk";
	if (walkMinutes != null && walkMinutes <= 35 && adventure && !child && !luxury) return "walk";
	if (preference === "walk" && walkMinutes != null && walkMinutes <= (child || wellness ? 20 : 45) && !luxury) return "walk";
	if (walkMinutes != null && roadMinutes != null && walkMinutes <= 18 && preference !== "drive" && !luxury && !child && !wellness) return "walk";
	return roadMode;
}
function assessCoverage(spots, scheduled, nights, firstVisit, balance) {
	const defining = /* @__PURE__ */ new Map();
	for (const spot of spots) {
		if (spot.importance !== "iconic" && spot.importance !== "major") continue;
		for (const group of spot.groups ?? []) {
			const current = defining.get(group);
			if (!current || (spot.sitelinks ?? 0) > (current.sitelinks ?? 0)) defining.set(group, spot);
		}
	}
	const food = spots.filter((spot) => FOOD$2.has(spot.category));
	if (food.length >= 3 && !defining.has("food")) defining.set("food", food[0]);
	const rows = [];
	for (const [group, example] of defining) {
		if (scheduled.some((stop) => stop.day != null && !stop.excluded && (stop.name === example.name || stop.groups?.includes(group) || group === "food" && FOOD$2.has(stop.category)))) {
			rows.push({
				group,
				status: "covered",
				reason: "In the first cut.",
				example: readableName(example)
			});
			continue;
		}
		const far = example.excursion === "full" || (example.distanceKm ?? 0) >= 28 || group === "excursion";
		let reason = "Left in Discover. It did not fit this cut.";
		if (balance === "city" && (group === "nature" || group === "excursion")) reason = "Left out to keep the trip city-heavy, as you asked.";
		else if (far) reason = "Needs most of a day, so it was left out of this cut.";
		else if (nights < 5 || !firstVisit) reason = firstVisit ? "Not enough days to add it without crowding the rest." : "Held back because this is not treated as a first visit.";
		rows.push({
			group,
			status: "omitted",
			reason,
			example: readableName(example)
		});
	}
	for (const spot of spots) {
		if (spot.importance !== "iconic" || spot.category === "stay" || FOOD$2.has(spot.category)) continue;
		if (!(spot.excursion === "full" || (spot.distanceKm ?? 0) >= 28 || spot.groups?.includes("excursion"))) continue;
		if (scheduled.some((stop) => stop.day != null && !stop.excluded && stop.name === spot.name)) continue;
		if (rows.some((row) => row.example === spot.name || row.example === readableName(spot))) continue;
		const reason = balance === "city" ? "Left out to keep the trip city-heavy, as you asked." : "Needs most of a day, so it was left out of this cut.";
		rows.push({
			group: "excursion",
			status: "omitted",
			reason,
			example: readableName(spot)
		});
	}
	return rows.sort((a, b) => a.status.localeCompare(b.status) || a.group.localeCompare(b.group) || a.example.localeCompare(b.example));
}
function hotelCandidate(stop) {
	if (stop.category !== "stay" || stop.provider === "area") return null;
	const stars = Number((stop.hotel?.stars ?? "").match(/\d(?:\.\d)?/)?.[0]);
	const room = Number((stop.hotel?.roomSize ?? "").match(/\d{2,3}/)?.[0]);
	const flag = (value) => value === "yes" ? "yes" : value === "no" ? "no" : "unknown";
	return {
		id: stop.providerId || stop.id,
		name: readableName(stop),
		lat: stop.lat,
		lng: stop.lng,
		stars: stars >= 1 && stars <= 5 ? stars : null,
		roomSqm: room >= 8 && room <= 200 ? room : null,
		air: stop.hotel?.airConditioning ?? "unknown",
		breakfast: flag(stop.hotel?.breakfast),
		wheelchair: flag(stop.hotel?.wheelchair),
		parking: flag(stop.hotel?.parking),
		kind: stop.hotel?.kind ?? ""
	};
}
function hotelPicks(stops, prefs = DEFAULT_HOTEL_PREFERENCES, memory = emptyHotelMemory(), move = "walk", hold = []) {
	return shortlistHotels(stops.map(hotelCandidate).filter((item) => Boolean(item)), stops, prefs, memory, move, hold).map((card) => ({
		stopId: card.stopId,
		name: card.name,
		role: card.role,
		why: card.why,
		reasons: card.reasons,
		tradeoffs: card.tradeoffs,
		matches: card.matches,
		unverified: card.unverified,
		location: card.location,
		averageMin: card.averageMin,
		longestMin: card.longestMin,
		booked: false
	}));
}
function applyHotelShortlist(trip, prefs, memory, hold = []) {
	const booked = new Set((trip.hotels ?? []).filter((hotel) => hotel.booked).map((hotel) => hotel.stopId));
	const hotels = hotelPicks(trip.stops, prefs, memory, trip.move, hold).map((hotel) => ({
		...hotel,
		booked: booked.has(hotel.stopId)
	}));
	return {
		...trip,
		hotelPreferences: prefs,
		hotelMemory: rememberShortlist(memory, hotels),
		hotels,
		hotelNote: ""
	};
}
function setHotelPreferences(trip, prefs) {
	const memory = trip.hotelMemory ?? emptyHotelMemory();
	return applyHotelShortlist(trip, prefs, {
		...memory,
		previous: [],
		shown: []
	}, memory.kept);
}
function rerollHotels(trip) {
	const prefs = trip.hotelPreferences ?? DEFAULT_HOTEL_PREFERENCES;
	const memory = trip.hotelMemory ?? emptyHotelMemory();
	const seeded = memory.previous.length ? memory : {
		...memory,
		previous: (trip.hotels ?? []).map((hotel) => hotel.stopId)
	};
	const before = (trip.hotels ?? []).filter((hotel) => !seeded.kept.includes(hotel.stopId)).map((hotel) => hotel.stopId).join("|");
	const next = applyHotelShortlist(trip, prefs, seeded, seeded.kept);
	const after = (next.hotels ?? []).filter((hotel) => !seeded.kept.includes(hotel.stopId)).map((hotel) => hotel.stopId).join("|");
	if (before && before === after) return {
		...next,
		hotelNote: "These are the only stays that fit. Reroll couldn't find another."
	};
	return next;
}
function toggleKeptHotel(trip, stopId) {
	const memory = trip.hotelMemory ?? emptyHotelMemory();
	const kept = memory.kept.includes(stopId) ? memory.kept.filter((id) => id !== stopId) : [...memory.kept, stopId].slice(-3);
	const hotels = (trip.hotels ?? []).map((hotel) => hotel.stopId === stopId ? {
		...hotel,
		role: kept.includes(stopId) ? "Kept" : hotel.role === "Kept" ? "Also fits this trip" : hotel.role
	} : hotel);
	return {
		...trip,
		hotels,
		hotelMemory: {
			...memory,
			kept
		}
	};
}
function rejectHotel(trip, stopId, reason = "") {
	const prefs = trip.hotelPreferences ?? DEFAULT_HOTEL_PREFERENCES;
	const memory = trip.hotelMemory ?? emptyHotelMemory();
	const rejected = memory.rejected.includes(stopId) ? memory.rejected : [...memory.rejected, stopId].slice(-40);
	const kept = memory.kept.filter((id) => id !== stopId);
	const reasons = reason ? {
		...memory.reasons,
		[stopId]: reason
	} : memory.reasons;
	const previous = memory.previous.length ? memory.previous : (trip.hotels ?? []).map((hotel) => hotel.stopId);
	const hold = (trip.hotels ?? []).map((hotel) => hotel.stopId).filter((id) => id !== stopId && !rejected.includes(id));
	const next = applyHotelShortlist(trip, prefs, {
		...memory,
		rejected,
		kept,
		reasons,
		previous
	}, hold);
	if ((next.hotels ?? []).some((hotel) => hotel.stopId === stopId)) return {
		...next,
		hotelNote: "No other stay fits, so this one stays."
	};
	return next;
}
function likeHotel(trip, stopId) {
	const prefs = trip.hotelPreferences ?? DEFAULT_HOTEL_PREFERENCES;
	const memory = trip.hotelMemory ?? emptyHotelMemory();
	const previous = memory.previous.length ? memory.previous : (trip.hotels ?? []).map((hotel) => hotel.stopId);
	const hold = [.../* @__PURE__ */ new Set([...memory.kept, stopId])];
	return applyHotelShortlist(trip, prefs, {
		...memory,
		similar: stopId,
		previous
	}, hold);
}
function whyLine(balance, styles, firstVisit, oneBase, _coverage) {
	const feel = styles.join(" and ") || "comfort";
	return `${firstVisit ? "First visit" : "Return visit"}. ${balance === "city" ? "City-heavy" : balance === "nature" ? "Nature-heavy" : "City and nature"}, ${feel}, ${oneBase ? "one base" : "a second base only if the move is worth it"}.`;
}
function clusterLine(stops) {
	const saved = stops.filter((stop) => stop.day == null && (stop.bucket === "saved" || stop.bucket === "must"));
	const scheduled = stops.filter((stop) => stop.day != null && stop.category !== "stay");
	if (saved.length < 3 || !scheduled.length) return "";
	const groups = /* @__PURE__ */ new Map();
	for (const spot of saved) {
		let best = scheduled[0];
		let bestMeters = Number.POSITIVE_INFINITY;
		for (const stop of scheduled) {
			const meters = distanceMeters(spot.lat, spot.lng, stop.lat, stop.lng);
			if (meters < bestMeters) {
				best = stop;
				bestMeters = meters;
			}
		}
		if (!best || best.day == null || bestMeters > 4e3) continue;
		groups.set(best.day, [...groups.get(best.day) ?? [], spot]);
	}
	const winner = [...groups.entries()].sort((a, b) => b[1].length - a[1].length)[0];
	if (!winner || winner[1].length < 3) return "";
	return `These places cluster with day ${winner[0] + 1}: ${winner[1].slice(0, 3).map((stop) => readableName(stop)).join(", ")}.`;
}
function dayStops(trip, day) {
	return trip.stops.filter((stop) => stop.day === day).sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
}
function retimeDay(trip, day) {
	const rows = dayStops(trip, day);
	if (!rows.length) return trip;
	const child = hasYoungChild(trip.childAges);
	let cursor = child || trip.pace === "relaxed" ? 600 : 540;
	const nextStops = trip.stops.map((stop) => ({ ...stop }));
	const legs = trip.legs.filter((leg) => leg.day !== day);
	let previous = null;
	for (const row of rows) {
		const stop = nextStops.find((item) => item.id === row.id);
		if (!stop) continue;
		if (previous) {
			const minutes = estimateMinutes(trip.move, distanceMeters(previous.lat, previous.lng, stop.lat, stop.lng));
			cursor += minutes;
			legs.push(explainLeg({
				fromId: previous.id,
				toId: stop.id,
				day,
				mode: trip.move,
				minutes,
				meters: Math.round(distanceMeters(previous.lat, previous.lng, stop.lat, stop.lng)),
				source: "estimate",
				label: legLabel(trip.move, minutes, "estimate")
			}, trip.move, trip.styles ?? [], child));
		}
		stop.startTime = clockTime(cursor);
		stop.endTime = clockTime(cursor + stop.duration);
		cursor += stop.duration;
		previous = stop;
	}
	const days = trip.days.map((item) => item.index === day ? {
		...item,
		line: null,
		freeNote: freeWindow(clockTime(cursor))
	} : item);
	const burden = burdenFrom(legs, trip.burden.hotelChanges, nextStops, trip.move, child);
	return {
		...trip,
		stops: nextStops,
		legs,
		days,
		burden
	};
}
function moveStop(trip, stopId, direction) {
	const stop = trip.stops.find((item) => item.id === stopId);
	if (!stop || stop.day == null || stop.category === "stay") return trip;
	const rows = dayStops(trip, stop.day).filter((item) => item.category !== "stay");
	const swap = rows[rows.findIndex((item) => item.id === stopId) + direction];
	if (!swap) return trip;
	return retimeDay({
		...trip,
		stops: trip.stops.map((item) => {
			if (item.id === stop.id) return {
				...item,
				startTime: swap.startTime
			};
			if (item.id === swap.id) return {
				...item,
				startTime: stop.startTime
			};
			return item;
		})
	}, stop.day);
}
function unscheduleStop(trip, stopId) {
	const stop = trip.stops.find((item) => item.id === stopId);
	if (!stop || stop.day == null || stop.category === "stay") return trip;
	const day = stop.day;
	const bucket = FOOD$2.has(stop.category) ? "food" : "saved";
	const retimed = retimeDay({
		...trip,
		stops: trip.stops.map((item) => item.id === stopId ? {
			...item,
			day: null,
			startTime: null,
			endTime: null,
			bucket,
			note: "Saved. Not placed on a day."
		} : item),
		cluster: ""
	}, day);
	return {
		...retimed,
		cluster: clusterLine(retimed.stops)
	};
}
function scheduleStop(trip, stopId, day) {
	if (!trip.stops.find((item) => item.id === stopId) || !trip.days.some((item) => item.index === day)) return trip;
	const next = {
		...trip,
		stops: trip.stops.map((item) => item.id === stopId ? {
			...item,
			day,
			bucket: "scheduled",
			startTime: "23:59",
			note: "Added to the day. Update travel times for a real route."
		} : item)
	};
	return {
		...retimeDay(next, day),
		cluster: clusterLine(next.stops)
	};
}
/** Add already-known places to one day. Other days are left untouched. */
function appendStops(trip, day, stopIds) {
	const rank = new Map(stopIds.map((id, index) => [id, index]));
	if (!rank.size || !trip.days.some((item) => item.index === day)) return trip;
	const next = {
		...trip,
		stops: trip.stops.map((item) => rank.has(item.id) ? {
			...item,
			day,
			bucket: "scheduled",
			startTime: clockTime(1380 + (rank.get(item.id) ?? 0)),
			note: item.why || item.note || "Added for this free window."
		} : item)
	};
	return {
		...retimeDay(next, day),
		cluster: clusterLine(next.stops)
	};
}
function applyRoute(trip, day, route) {
	const rows = dayStops(trip, day);
	const child = hasYoungChild(trip.childAges);
	const legs = trip.legs.filter((leg) => leg.day !== day);
	let cursor = rows[0]?.startTime ? Number(rows[0].startTime.slice(0, 2)) * 60 + Number(rows[0].startTime.slice(3)) : 540;
	const nextStops = trip.stops.map((stop) => ({ ...stop }));
	rows.forEach((row, index) => {
		const stop = nextStops.find((item) => item.id === row.id);
		if (!stop) return;
		if (index > 0) {
			const minutes = route.minutes[index - 1] ?? null;
			const meters = route.meters[index - 1] ?? null;
			if (minutes != null) cursor += minutes;
			legs.push(explainLeg({
				fromId: rows[index - 1]?.id ?? row.id,
				toId: row.id,
				day,
				mode: trip.move,
				minutes,
				meters,
				source: minutes == null ? "none" : route.source,
				label: legLabel(trip.move, minutes, minutes == null ? "none" : route.source)
			}, trip.move, trip.styles ?? [], child));
		}
		stop.startTime = clockTime(cursor);
		stop.endTime = clockTime(cursor + stop.duration);
		cursor += stop.duration;
	});
	const days = trip.days.map((item) => item.index === day ? {
		...item,
		line: route.line
	} : item);
	const burden = burdenFrom(legs, trip.burden.hotelChanges, nextStops, trip.move, child);
	return {
		...trip,
		stops: nextStops,
		legs,
		days,
		burden
	};
}
function keepLockedDays(previous, next) {
	if (!previous) return next;
	const locked = new Set(previous.days.filter((day) => day.locked).map((day) => day.date));
	if (!locked.size) return next;
	const keptDays = next.days.map((day) => locked.has(day.date) ? previous.days.find((item) => item.date === day.date) ?? day : day);
	const keptIndexes = new Set(keptDays.filter((day) => locked.has(day.date)).map((day) => day.index));
	const stops = [...next.stops.filter((stop) => stop.day == null || !keptIndexes.has(stop.day)), ...previous.stops.filter((stop) => stop.day != null && keptIndexes.has(stop.day))];
	const legs = [...next.legs.filter((leg) => !keptIndexes.has(leg.day)), ...previous.legs.filter((leg) => keptIndexes.has(leg.day))];
	return {
		...next,
		days: keptDays.filter((day) => Boolean(day)),
		stops,
		legs,
		bookings: previous.bookings
	};
}
function pinKey(stop) {
	if (stop.providerId) return `${stop.provider}:${stop.providerId}`;
	return `${stop.lat.toFixed(4)},${stop.lng.toFixed(4)}`;
}
function bestDayFor(trip, stopId) {
	const stop = trip.stops.find((item) => item.id === stopId);
	if (!stop) return null;
	const incomingFar = placeIsFar(stop);
	let best = null;
	for (const day of trip.days.slice(0, 7)) {
		const rows = dayStops(trip, day.index).filter((item) => item.category !== "stay");
		if (!rows.length) continue;
		let near = rows[0];
		let meters = distanceMeters(stop.lat, stop.lng, near.lat, near.lng);
		for (const row of rows) {
			const next = distanceMeters(stop.lat, stop.lng, row.lat, row.lng);
			if (next < meters) {
				meters = next;
				near = row;
			}
		}
		const minutes = estimateMinutes(trip.move === "walk" ? "walk" : "drive", meters);
		const dayFar = rows.some((row) => placeIsFar(row));
		let score = minutes;
		if (incomingFar && dayFar) score += 500;
		if (incomingFar) score += rows.length * 40;
		else if (rows.length >= 4) score += 40;
		const reason = incomingFar && dayFar ? `Day ${day.index + 1} already has an excursion. Another day is a better fit.` : `Close to ${readableName(near)} on day ${day.index + 1}. About ${minutes} min extra, estimated.`;
		if (!best || score < best.score) best = {
			day: day.index,
			score,
			minutes,
			reason
		};
	}
	if (!best) return {
		day: 0,
		minutes: 0,
		reason: "No day has stops yet. Day 1 is the open slot."
	};
	return {
		day: best.day,
		minutes: best.minutes,
		reason: best.reason
	};
}
function suggestOrder(trip, day) {
	const rows = dayStops(trip, day);
	const stay = rows.find((stop) => stop.category === "stay");
	const sights = rows.filter((stop) => stop.category !== "stay");
	if (!stay || sights.length < 3) return null;
	const current = sights.reduce((sum, stop, index) => {
		const from = index === 0 ? stay : sights[index - 1];
		return sum + estimateMinutes(trip.move === "walk" ? "walk" : "drive", distanceMeters(from.lat, from.lng, stop.lat, stop.lng));
	}, 0);
	const pending = [...sights];
	const ordered = [];
	let cursor = stay;
	while (pending.length) {
		pending.sort((a, b) => distanceMeters(cursor.lat, cursor.lng, a.lat, a.lng) - distanceMeters(cursor.lat, cursor.lng, b.lat, b.lng));
		const next = pending.shift();
		if (!next) break;
		ordered.push(next);
		cursor = next;
	}
	const saved = current - ordered.reduce((sum, stop, index) => {
		const from = index === 0 ? stay : ordered[index - 1];
		return sum + estimateMinutes(trip.move === "walk" ? "walk" : "drive", distanceMeters(from.lat, from.lng, stop.lat, stop.lng));
	}, 0);
	if (ordered.every((stop, index) => stop.id === sights[index]?.id) || saved < 15) return null;
	return {
		saved,
		names: ordered.map((stop) => readableName(stop))
	};
}
function applySuggestedOrder(trip, day) {
	if (!suggestOrder(trip, day)) return trip;
	const rows = dayStops(trip, day);
	const stay = rows.find((stop) => stop.category === "stay");
	const sights = rows.filter((stop) => stop.category !== "stay");
	if (!stay) return trip;
	const pending = [...sights];
	const ordered = [];
	let cursor = stay;
	while (pending.length) {
		pending.sort((a, b) => distanceMeters(cursor.lat, cursor.lng, a.lat, a.lng) - distanceMeters(cursor.lat, cursor.lng, b.lat, b.lng));
		const next = pending.shift();
		if (!next) break;
		ordered.push(next);
		cursor = next;
	}
	const rank = new Map(ordered.map((stop, index) => [stop.id, index]));
	return retimeDay({
		...trip,
		stops: trip.stops.map((stop) => rank.has(stop.id) ? {
			...stop,
			startTime: clockTime(720 + (rank.get(stop.id) ?? 0))
		} : stop)
	}, day);
}
function applyPlacePhoto(trip, stopId, photo) {
	return {
		...trip,
		stops: trip.stops.map((stop) => stop.id === stopId ? {
			...stop,
			photo,
			image: photo.thumbnailUrl,
			imagePage: photo.descriptionUrl
		} : stop)
	};
}
function savePlace(trip, stopId) {
	return {
		...trip,
		stops: trip.stops.map((stop) => stop.id === stopId ? {
			...stop,
			bucket: stop.day == null ? "saved" : stop.bucket,
			note: stop.day == null ? "Saved for later." : stop.note
		} : stop)
	};
}
function excludePlace(trip, stopId) {
	const stop = trip.stops.find((item) => item.id === stopId);
	if (!stop || stop.category === "stay") return trip;
	const day = stop.day;
	const next = {
		...trip,
		stops: trip.stops.map((item) => item.id === stopId ? {
			...item,
			day: null,
			startTime: null,
			endTime: null,
			excluded: true,
			bucket: "maybe",
			note: "Not for this trip."
		} : item)
	};
	const retimed = day == null ? next : retimeDay(next, day);
	return {
		...retimed,
		cluster: clusterLine(retimed.stops)
	};
}
function selectBase(trip, stopId, booked = false) {
	const hotel = trip.stops.find((item) => item.category === "stay" && item.provider !== "area" && (item.id === stopId || item.providerId === stopId));
	if (!hotel) return trip;
	const current = trip.stops.filter((stop) => stop.category === "stay" && stop.day != null)[0];
	let stops = trip.stops;
	const same = Boolean(current && current.providerId && current.providerId === hotel.providerId);
	if (current && !same && current.provider !== "area" && current.providerId) {
		if (!stops.some((stop) => stop.category === "stay" && stop.day == null && stop.providerId === current.providerId)) {
			const archiveId = stops.some((stop) => stop.id === current.providerId) ? `${current.providerId}-saved` : current.providerId;
			stops = [...stops, {
				...current,
				id: archiveId,
				day: null,
				startTime: null,
				endTime: null,
				bucket: "saved",
				note: "Mapped stay. Not the selected base."
			}];
		}
	}
	let next = {
		...trip,
		hotels: (trip.hotels ?? []).map((item) => ({
			...item,
			booked: booked && (item.stopId === hotel.id || item.stopId === hotel.providerId)
		})),
		stops: stops.map((stop) => {
			if (stop.category !== "stay" || stop.day == null) return stop;
			return {
				...stop,
				name: hotel.name,
				lat: hotel.lat,
				lng: hotel.lng,
				provider: hotel.provider,
				providerId: hotel.providerId,
				address: hotel.address,
				hotel: hotel.hotel,
				localName: hotel.localName,
				nameEn: hotel.nameEn,
				nameLatin: hotel.nameLatin,
				nameLocal: hotel.nameLocal,
				nameEnglish: hotel.nameEnglish,
				nameRomanized: hotel.nameRomanized,
				displayName: hotel.displayName,
				displaySubtitle: hotel.displaySubtitle,
				language: hotel.language,
				translationSource: hotel.translationSource,
				displayNameQuality: hotel.displayNameQuality,
				description: hotel.description,
				descriptionDisplay: hotel.descriptionDisplay,
				addressLocal: hotel.addressLocal,
				addressDisplay: hotel.addressDisplay,
				bookingStatus: booked ? "booked" : "none",
				note: booked ? "Booked hotel. This is the base, not a suggestion." : "Suggested base from the map. Not a reservation."
			};
		})
	};
	if (same) return {
		...trip,
		hotels: next.hotels
	};
	for (const day of trip.days) if (dayStops(next, day.index).length > 1) next = retimeDay(next, day.index);
	return next;
}
function selectLegMode(trip, fromId, toId, mode) {
	const leg = trip.legs.find((item) => item.fromId === fromId && item.toId === toId);
	const alt = leg?.alternatives?.find((item) => item.mode === mode);
	if (!leg || !alt || alt.minutes == null || alt.source === "unavailable") return trip;
	const delta = alt.minutes - (leg.minutes ?? alt.minutes);
	const legs = trip.legs.map((item) => item === leg ? {
		...item,
		minutes: alt.minutes,
		label: alt.label,
		shown: mode,
		selectedMode: mode,
		source: alt.source === "osrm" || alt.source === "estimate" ? alt.source : item.source,
		recommendationReason: mode === item.recommendedMode ? item.recommendationReason : ""
	} : item);
	const stops = trip.stops.map((stop) => {
		if (stop.day !== leg.day || !stop.startTime || stop.id === fromId) return stop;
		const rows = dayStops(trip, leg.day);
		const fromIndex = rows.findIndex((row) => row.id === fromId);
		const stopIndex = rows.findIndex((row) => row.id === stop.id);
		if (fromIndex < 0 || stopIndex <= fromIndex) return stop;
		const start = clockToMinutes(stop.startTime) + delta;
		return {
			...stop,
			startTime: clockTime(start),
			endTime: clockTime(start + stop.duration)
		};
	});
	return {
		...trip,
		legs,
		stops
	};
}
function clockToMinutes(value) {
	const [hour, minute] = value.split(":").map(Number);
	return (hour || 0) * 60 + (minute || 0);
}
function rebalanceTrip(trip, kind) {
	let next = trip;
	if (kind === "relaxed") {
		for (const day of trip.days) {
			if (day.locked) continue;
			const sights = dayStops(next, day.index).filter((stop) => stop.category !== "stay" && !FOOD$2.has(stop.category));
			const last = sights.at(-1);
			if (sights.length > 1 && last) next = unscheduleStop(next, last.id);
		}
		return {
			...next,
			balance: trip.balance,
			whyTrip: "Unlocked days were eased off. Kept days stayed."
		};
	}
	if (kind === "more") {
		for (const day of trip.days) {
			if (day.locked) continue;
			if (dayStops(next, day.index).filter((stop) => stop.category !== "stay").length >= 4) continue;
			const candidate = next.stops.find((stop) => stop.day == null && !stop.excluded && SEE.has(stop.category));
			if (candidate) next = scheduleStop(next, candidate.id, day.index);
		}
		return {
			...next,
			whyTrip: "A few saved places were added to lighter days. The rest of the trip stayed."
		};
	}
	const want = kind === "nature" ? [
		"nature",
		"excursion",
		"wildlife"
	] : kind === "culture" ? ["heritage"] : kind === "city" ? [
		"city",
		"heritage",
		"shopping",
		"food"
	] : ["local"];
	for (const day of trip.days) {
		if (day.locked) continue;
		if (kind === "city") {
			const far = dayStops(next, day.index).find((stop) => stop.excursion === "full" || (stop.distanceKm ?? 0) >= 18);
			if (far) next = unscheduleStop(next, far.id);
			continue;
		}
		if (dayStops(next, day.index).some((stop) => stop.groups?.some((group) => want.includes(group)) || kind === "local" && stop.importance === "local")) continue;
		const candidate = next.stops.find((stop) => stop.day == null && !stop.excluded && (kind === "local" ? stop.importance === "local" || stop.importance === "interest" : stop.groups?.some((group) => want.includes(group))));
		if (!candidate) continue;
		const heavy = dayStops(next, day.index).filter((stop) => stop.category !== "stay" && !FOOD$2.has(stop.category));
		if (heavy.length >= 3) {
			const drop = heavy.find((stop) => !stop.groups?.some((group) => want.includes(group)));
			if (drop) next = unscheduleStop(next, drop.id);
		}
		next = scheduleStop(next, candidate.id, day.index);
	}
	const line = kind === "nature" ? "Nature days were filled from places already found." : kind === "culture" ? "Heritage places already found were moved onto open days." : kind === "local" ? "A local place replaced a busier stop where one was waiting." : "Far excursions were taken off unlocked days.";
	return {
		...next,
		balance: kind === "city" || kind === "nature" ? kind : trip.balance,
		whyTrip: line
	};
}
function discoverSections(trip) {
	const open = trip.stops.filter((stop) => stop.day == null && !stop.excluded && stop.category !== "stay");
	const sections = [];
	const push = (id, title, stops) => {
		const unique = stops.filter((stop, index) => stops.findIndex((item) => item.id === stop.id) === index);
		if (unique.length) sections.push({
			id,
			title,
			stops: unique.slice(0, 8)
		});
	};
	push("major", "Other major sights", open.filter((stop) => stop.importance === "iconic" || stop.importance === "major"));
	push("picks", "Kairos picks", open.filter((stop) => stop.importance === "iconic" || stop.importance === "interest"));
	push("food", "Food and drink", open.filter((stop) => FOOD$2.has(stop.category)));
	push("culture", "Culture", open.filter((stop) => stop.groups?.includes("heritage") || stop.category === "museum" || stop.category === "historic"));
	push("nature", "Nature", open.filter((stop) => stop.groups?.includes("nature") || stop.groups?.includes("excursion") || stop.category === "park"));
	push("shopping", "Shopping", open.filter((stop) => stop.category === "shopping" || stop.category === "market"));
	push("evening", "Evening", open.filter((stop) => stop.category === "nightlife"));
	push("rain", "Rainy-day options", open.filter((stop) => stop.indoor && SEE.has(stop.category)));
	push("saved", "Saved", open.filter((stop) => stop.bucket === "saved" || stop.bucket === "must"));
	for (const day of trip.days.slice(0, 7)) {
		const rows = dayStops(trip, day.index);
		if (!rows.length) continue;
		const near = open.filter((stop) => rows.some((row) => distanceMeters(stop.lat, stop.lng, row.lat, row.lng) < 2500)).slice(0, 6);
		push(`near-${day.index}`, `Near day ${day.index + 1}`, near);
	}
	if (!sections.length && open.length) push("open", "Unscheduled", open);
	return sections;
}
/** External place handoff. These are ordinary map URLs. No Google Places API and no API key. */
var COUNTRY_NAME = {
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
	TR: "Turkey"
};
var NOT_OFFICIAL = /(^|\.)((google|facebook|instagram|twitter|x|yelp|tripadvisor|booking|maps)\.[a-z.]+|goo\.gl|maps\.app\.goo\.gl)$/i;
function clean(value) {
	return (value ?? "").replace(/\s+/g, " ").trim();
}
function fold(value) {
	return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/\s+/g, "");
}
function countryName(code) {
	return COUNTRY_NAME[clean(code).toUpperCase()] ?? "";
}
function cityName(input) {
	const raw = clean(input.city) || clean(input.area);
	if (!raw) return "";
	return raw.split(",")[0]?.trim() ?? "";
}
function streetAddress(input, city) {
	const address = clean(input.addressDisplay) || clean(input.address);
	if (!address) return "";
	const folded = fold(address);
	if (city && (folded === fold(city) || folded === fold(`${city} ${countryName(input.countryCode)}`))) return "";
	return address;
}
function addPart(parts, value) {
	const next = clean(value);
	if (next.length < 2) return;
	if (parts.some((part) => fold(part) === fold(next))) return;
	if (parts.some((part) => fold(part).includes(fold(next)) && fold(next).length >= 4)) return;
	parts.push(next);
}
/** Deterministic search text. Never invents an address or a place name. */
function buildGoogleMapsPlaceQuery(input) {
	const city = cityName(input);
	const country = countryName(input.countryCode);
	const street = streetAddress(input, city);
	const parts = [];
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
	if (!Boolean(street || city || country) && query.length < 18) return "";
	return query.slice(0, 240);
}
function verifiedWebsite(value) {
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
function googleSearch(query, placeId = "") {
	if (!query) return "";
	const url = new URL("https://www.google.com/maps/search/");
	url.searchParams.set("api", "1");
	url.searchParams.set("query", query);
	if (/^ChI[\w-]{10,}$/.test(placeId)) url.searchParams.set("query_place_id", placeId);
	return url.toString();
}
function placePoint(input) {
	if (input.lat == null || input.lng == null) return null;
	if (!Number.isFinite(input.lat) || !Number.isFinite(input.lng)) return null;
	if (Math.abs(input.lat) > 90 || Math.abs(input.lng) > 180) return null;
	const name = clean(input.nameLocal || input.localName || input.name).slice(0, 80) || "Place";
	return {
		lat: input.lat,
		lng: input.lng,
		name
	};
}
function amapPlace(point, country) {
	const shifted = country === "CN" ? wgsToGcj(point.lat, point.lng) : point;
	const url = new URL("https://uri.amap.com/marker");
	url.searchParams.set("position", `${shifted.lng},${shifted.lat}`);
	url.searchParams.set("name", point.name);
	url.searchParams.set("src", "kairos");
	url.searchParams.set("coordinate", country === "CN" ? "gaode" : "gps");
	url.searchParams.set("callnative", "1");
	return url.toString();
}
function routeSet(from, to) {
	return {
		googleMaps: navigationHref("google", from, to, "drive"),
		appleMaps: navigationHref("apple", from, to, "drive"),
		amap: navigationHref("amap", from, to, "drive"),
		kakao: navigationHref("kakao", from, to, "drive"),
		naver: navigationHref("naver", from, to, "drive")
	};
}
function externalPlaceLinks(input, from) {
	const google = googleSearch(buildGoogleMapsPlaceQuery(input), input.googlePlaceId);
	const country = clean(input.countryCode).toUpperCase();
	const point = placePoint(input);
	const website = verifiedWebsite(input.website);
	const localName = clean(input.nameLocal || input.localName || input.name);
	let localPlace = null;
	if (point && country === "CN") localPlace = {
		label: "View on Amap",
		href: amapPlace(point, country)
	};
	else if (point && country === "KR") localPlace = {
		label: "View on Kakao Map",
		href: `https://map.kakao.com/link/map/${encodeURIComponent(localName)},${point.lat},${point.lng}`
	};
	const origin = from && Number.isFinite(from.lat) && Number.isFinite(from.lng) ? {
		lat: from.lat,
		lng: from.lng,
		name: clean(from.name) || "Start"
	} : point;
	const navigation = point && origin ? routeSet(origin, point) : {
		googleMaps: "",
		appleMaps: "",
		amap: "",
		kakao: "",
		naver: ""
	};
	return {
		googleMapsSearch: google,
		googleReviews: google,
		officialWebsite: website,
		localPlace,
		navigation
	};
}
/** Traveller-facing place copy. Scores come from category and verified text, not from reviews. */
var FILLER = /popular tourist destination|worth visiting|nice place to|famous place in|open place list|private ranking|major attraction worth|a must-see|iconic stop from|a nice place/i;
var FOOD$1 = /* @__PURE__ */ new Set([
	"restaurant",
	"cafe",
	"nightlife",
	"market"
]);
function isGenericCopy(text) {
	const value = text.replace(/\s+/g, " ").trim();
	if (value.length < 24) return true;
	return FILLER.test(value);
}
function isLocator(text) {
	const value = text.replace(/\s+/g, " ").trim();
	if (value.length > 110) return false;
	return /\b(located|situated)\b/i.test(value) || /^[\w\s'"’.-]{0,48}\bin\b\s+[A-Z]/i.test(value);
}
function acceptExperienceLine(line, facts) {
	const text = line.replace(/\s+/g, " ").trim();
	if (!text || isGenericCopy(text) || isLocator(text)) return false;
	return (text.match(/\b(?:1[0-9]{3}|20[0-9]{2})\b/g) ?? []).every((year) => facts.includes(year));
}
var DAY = {
	Mo: "Mon",
	Tu: "Tue",
	We: "Wed",
	Th: "Thu",
	Fr: "Fri",
	Sa: "Sat",
	Su: "Sun"
};
function clockLabel(value) {
	const [hourRaw, minuteRaw] = value.split(":");
	const hour = Number(hourRaw);
	const minute = Number(minuteRaw);
	if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value;
	const wrapped = (hour % 24 + 24) % 24;
	const suffix = wrapped >= 12 ? "PM" : "AM";
	return `${wrapped % 12 || 12}:${String(minute).padStart(2, "0")} ${suffix}`;
}
/** A readable slice of OSM opening_hours. Unparsed syntax stays out of the main card. */
function formatOpeningHours(raw) {
	const text = raw.replace(/\s+/g, " ").trim();
	if (!text) return {
		summary: "",
		seasonal: false
	};
	const parts = text.split(";").map((part) => part.trim()).filter(Boolean);
	const seasonal = parts.length > 1 || /[A-Z][a-z]{2}\s+\d/.test(text) || /\boff\b/i.test(text);
	const first = parts[0] ?? "";
	const day = first.match(/\b(Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(Mo|Tu|We|Th|Fr|Sa|Su))?\b/);
	const time = first.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
	if (!time) return {
		summary: "",
		seasonal
	};
	const days = !day ? "Daily" : day[2] ? `${DAY[day[1]]}–${DAY[day[2]]}` : DAY[day[1]];
	const range = `${clockLabel(time[1])} – ${clockLabel(time[2])}`;
	return {
		summary: days === "Daily" ? range : `${days} ${range}`,
		seasonal
	};
}
function hoursLine(opening) {
	const parsed = formatOpeningHours(opening || "");
	if (!parsed.summary) return "";
	return parsed.seasonal ? `${parsed.summary}. Seasonal hours may vary.` : parsed.summary;
}
function cleanExtract(text) {
	return text.replace(/\s*\([^)]*[:[\]][^)]*\)/g, "").replace(/\s+/g, " ").trim();
}
function sentences(text) {
	return text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/).map((part) => part.trim()).filter((part) => part.length > 24).slice(0, 3);
}
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function iconicFromExtract(name, city, extract) {
	const parts = sentences(extract);
	if (!parts.length) return "";
	let lead = parts[0] ?? "";
	const prefix = new RegExp(`^(?:the\\s+)?${escapeRegExp(name.trim())}\\s+is\\s+`, "i");
	if (prefix.test(lead)) {
		lead = lead.replace(prefix, "");
		lead = lead.charAt(0).toUpperCase() + lead.slice(1);
	}
	const fact = (parts[1] ?? "").match(/(named after [^.]{3,90}|built [^.]{0,24}\d{4}[^.]{0,48}|designed [^.]{3,90})/i);
	let text = lead.replace(/\.$/, "");
	if (fact) {
		const bit = fact[1].trim().replace(/\.$/, "");
		if (!text.toLowerCase().includes(bit.slice(0, 16).toLowerCase())) text = `${text}, ${bit.charAt(0).toLowerCase()}${bit.slice(1)}`;
	}
	if (city) text = text.replace(new RegExp(`,?\\s+in\\s+${escapeRegExp(city)}(?:,\\s+[A-Za-z][A-Za-z .'-]{1,24})?`, "i"), "");
	text = text.replace(/\s+/g, " ").trim();
	if (text.length > 280) text = text.slice(0, 277).replace(/\s+\S*$/, "").trim();
	if (!text) return "";
	if (!/[.!?]$/.test(text)) text += ".";
	return text;
}
function bump(scores, key, value) {
	scores[key] = Math.max(scores[key] ?? 0, value);
}
function experienceProfile(input) {
	const category = input.category;
	const text = `${category} ${input.name} ${input.description ?? ""} ${input.extract ?? ""}`.toLowerCase();
	const scores = {};
	if (FOOD$1.has(category)) {
		bump(scores, "food", 4);
		if (category === "nightlife" || /bar|wine|evening|romantic/.test(text)) bump(scores, "romance", 3);
		if (/family|kids/.test(text)) bump(scores, "family", 3);
		return Object.fromEntries(Object.entries(scores).filter(([, value]) => (value ?? 0) >= 3));
	}
	if (category === "viewpoint" || /tower|observation|panorama|overlook|deck|ferris/.test(text)) {
		bump(scores, "views", 5);
		bump(scores, "photography", 5);
		bump(scores, "architecture", category === "viewpoint" ? 3 : 5);
	}
	if (category === "museum" || /museum|gallery|collection/.test(text)) {
		bump(scores, "culture", 5);
		bump(scores, "history", 4);
		bump(scores, "architecture", 3);
		bump(scores, "family", 3);
	}
	if (category === "historic" || /palace|castle|cathedral|temple|shrine|heritage|monument|basilica/.test(text)) {
		bump(scores, "history", 5);
		bump(scores, "architecture", 4);
		bump(scores, "culture", 4);
	}
	if (category === "park" || category === "garden" || category === "beach" || /park|garden|lawn|greenspace|green space|promenade/.test(text)) {
		bump(scores, "nature", category === "beach" ? 4 : 5);
		bump(scores, "photography", 4);
		if (/view|tower|skyline|panorama|overlook/.test(text)) bump(scores, "views", 4);
	}
	if (category === "zoo" || category === "aquarium" || /panda|wildlife|zoo|aquarium|safari/.test(text)) {
		bump(scores, "nature", 4);
		bump(scores, "family", 5);
	}
	if (category === "shopping" || category === "market") bump(scores, "shopping", 4);
	if (category === "nightlife") bump(scores, "nightlife", 4);
	if ((scores.views ?? 0) >= 4 && ((scores.architecture ?? 0) >= 4 || /seine|sunset|evening|night/.test(text))) bump(scores, "romance", 4);
	if (category === "park" || category === "garden" || category === "zoo" || category === "theme_park") bump(scores, "family", 4);
	return Object.fromEntries(Object.entries(scores).filter(([, value]) => (value ?? 0) >= 3));
}
function joinAnd(items) {
	if (items.length <= 1) return items[0] ?? "";
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}
function whyGoFromProfile(profile, category, text) {
	if (FOOD$1.has(category)) return category === "nightlife" ? "Go for the atmosphere and a meal out." : "Go for the food. Check the latest reviews before you commit.";
	if (category === "zoo" || category === "aquarium" || /panda|wildlife/.test(text)) return "Go for the animals. Plan it as a slow visit, not a quick look.";
	if (category === "museum" && (profile.culture ?? 0) >= 4) return "Go for the collections and the building. It needs time inside, not a photo stop.";
	if ((profile.nature ?? 0) >= 4 && (profile.views ?? 0) >= 3) return "Go for the green space and the view. It suits a walk, a pause, and photographs.";
	if ((profile.nature ?? 0) >= 4) return "Go for the open space. It suits walking, sitting, and photographs.";
	if ((profile.views ?? 0) >= 4 && (profile.architecture ?? 0) >= 4) return "Go for the views and the architecture. Evening light is part of the visit.";
	if ((profile.views ?? 0) >= 4) return "Go for the view. The reason to stop is what you can see from here.";
	if ((profile.history ?? 0) >= 4 && (profile.architecture ?? 0) >= 4) return "Go for the history you can walk through, and for the building itself.";
	if ((profile.history ?? 0) >= 4) return "Go for the history. Give it enough time to walk the site.";
	const bits = [];
	if ((profile.views ?? 0) >= 4) bits.push("the views");
	if ((profile.architecture ?? 0) >= 4) bits.push("the architecture");
	if ((profile.culture ?? 0) >= 4) bits.push("the culture");
	if ((profile.shopping ?? 0) >= 4) bits.push("a wander and the shops");
	if (!bits.length) return "";
	return `Go for ${joinAnd(bits)}.`;
}
function signatures(profile, category) {
	const items = [];
	if ((profile.views ?? 0) >= 4) items.push("Panoramic views");
	if ((profile.architecture ?? 0) >= 4) items.push(category === "historic" ? "Historic architecture" : "Architecture");
	if ((profile.culture ?? 0) >= 4 && category === "museum") items.push("Museum collections");
	else if ((profile.culture ?? 0) >= 4) items.push("Culture");
	if ((profile.history ?? 0) >= 4 && !items.includes("Historic architecture")) items.push("History");
	if ((profile.nature ?? 0) >= 4) items.push(category === "garden" ? "Garden walk" : "Green space");
	if ((profile.photography ?? 0) >= 4) items.push("Photography");
	if ((profile.food ?? 0) >= 4) items.push("Local food");
	if (category === "zoo" || category === "aquarium") items.push("Wildlife");
	return [...new Set(items)].slice(0, 4);
}
function bestFor(profile, importance) {
	const tags = [];
	if (importance === "iconic" || importance === "major") tags.push("First visit");
	if ((profile.views ?? 0) >= 4) tags.push("Views");
	if ((profile.photography ?? 0) >= 4) tags.push("Photography");
	if ((profile.architecture ?? 0) >= 4) tags.push("Architecture");
	if ((profile.history ?? 0) >= 4) tags.push("History");
	if ((profile.romance ?? 0) >= 4) tags.push("Couples");
	if ((profile.family ?? 0) >= 4) tags.push("Families");
	if ((profile.nature ?? 0) >= 4) tags.push("Nature");
	if ((profile.food ?? 0) >= 4) tags.push("Food");
	return tags.slice(0, 4);
}
function visitPlan(category, importance, name) {
	const label = name.toLowerCase();
	if (/versailles|forbidden city/.test(label)) return {
		minutes: 240,
		label: "Half day"
	};
	if (category === "theme_park") return {
		minutes: 240,
		label: "Half day"
	};
	if (category === "zoo" || category === "aquarium") return {
		minutes: 180,
		label: "2–3 hr"
	};
	if (category === "museum" && (importance === "iconic" || /louvre|palace|national museum/.test(label))) return {
		minutes: 150,
		label: "2–3 hr"
	};
	if (category === "museum") return {
		minutes: 90,
		label: "1.5–2 hr"
	};
	if (category === "viewpoint" || /tower/.test(label)) return {
		minutes: 120,
		label: "1.5–2.5 hr"
	};
	if (category === "park" || category === "garden") return {
		minutes: 75,
		label: "1–1.5 hr"
	};
	if (category === "beach") return {
		minutes: 120,
		label: "2–3 hr"
	};
	if (category === "historic" && importance === "iconic") return {
		minutes: 120,
		label: "1.5–2.5 hr"
	};
	if (category === "historic") return {
		minutes: 90,
		label: "1–2 hr"
	};
	if (FOOD$1.has(category)) return {
		minutes: 75,
		label: "1–1.5 hr"
	};
	return {
		minutes: 90,
		label: "1–2 hr"
	};
}
function setting(category, indoor) {
	if (category === "museum" || category === "aquarium") return indoor ? "indoor" : "mixed";
	if (category === "park" || category === "garden" || category === "beach" || category === "viewpoint") return "outdoor";
	if (indoor) return "indoor";
	return "mixed";
}
function bestTime(profile, category, indoor) {
	if ((profile.views ?? 0) >= 4 && !indoor && category !== "museum") return "Sunset or evening";
	if (category === "park" || category === "garden" || category === "beach") return "Daylight";
	return "";
}
function effort(category, indoor, name) {
	if (category === "viewpoint" || /tower/.test(name)) return "Outdoor. Expect some walking, and stairs or a lift.";
	if (category === "park" || category === "garden" || category === "beach") return "Easy walking. Weather matters.";
	if (category === "zoo" || category === "theme_park") return "Mostly outdoor. Weather matters.";
	if (indoor || category === "museum") return "Mostly indoor.";
	return "";
}
function buildPlaceStory(input, nearby = []) {
	const name = (input.displayName || input.nameEn || input.name).trim();
	const city = (input.city || "").trim();
	const extract = cleanExtract(input.extract || "");
	const factsInput = {
		...input,
		extract
	};
	const description = (input.description || "").trim();
	const facts = `${extract} ${description}`;
	const profile = experienceProfile(factsInput);
	const visit = visitPlan(input.category, input.importance || "", name);
	const iconic = iconicFromExtract(name, city, extract);
	const whyIconic = iconic && acceptExperienceLine(iconic, facts) ? iconic : "";
	const whyGoRaw = whyGoFromProfile(profile, input.category, facts.toLowerCase());
	const whyGo = whyGoRaw && !isGenericCopy(whyGoRaw) ? whyGoRaw : "";
	const short = whyGo || whyIconic;
	const where = setting(input.category, Boolean(input.indoor));
	const time = bestTime(profile, input.category, Boolean(input.indoor));
	const practical = effort(input.category, Boolean(input.indoor), name);
	const confidence = extract ? "verified" : description && !isLocator(description) ? "category" : input.category ? "category" : "thin";
	return {
		shortDescription: short,
		whyIconic,
		whyGo,
		signatureExperiences: signatures(profile, input.category),
		bestFor: bestFor(profile, input.importance || ""),
		experienceProfile: profile,
		suggestedVisitMinutes: visit.minutes,
		visitLabel: visit.label,
		bestTime: time || void 0,
		effort: practical || void 0,
		indoorOutdoor: where,
		nearbyCombos: nearby.slice(0, 3),
		sourceConfidence: whyIconic ? "verified" : confidence,
		descriptionSource: extract ? "wikipedia_intro" : description ? "wikidata_description" : "",
		imageSource: input.imageSource || "",
		hoursSource: input.opening ? "openstreetmap" : "",
		localNameSource: input.localNameSource || "",
		factSource: extract ? "wikipedia" : description ? "wikidata" : "category"
	};
}
function nearbyPlaceNames(place, all) {
	return all.filter((other) => other.id !== place.id && other.category !== "stay" && other.category !== "transport" && !FOOD$1.has(other.category)).map((other) => ({
		other,
		meters: distanceMeters(place.lat, place.lng, other.lat, other.lng)
	})).filter((row) => row.meters > 30 && row.meters < 1400).sort((a, b) => {
		const rank = (value) => value === "iconic" ? 0 : value === "major" ? 1 : 2;
		return rank(a.other.importance) - rank(b.other.importance) || a.meters - b.meters;
	}).slice(0, 3).map((row) => (row.other.displayName || row.other.name).trim()).filter(Boolean);
}
var EXPERIENCE_LABEL = {
	views: "Views",
	culture: "Culture",
	history: "History",
	architecture: "Architecture",
	nature: "Nature",
	food: "Food",
	family: "Family",
	romance: "Romance",
	shopping: "Shopping",
	nightlife: "Nightlife",
	photography: "Photography"
};
/**
* Where to stay. Ranks neighbourhoods and overnight towns from the itinerary.
* Hotel brands are not candidates. Nothing in this file is allowed to sort areas by a partner.
*/
var FOOD = /* @__PURE__ */ new Set([
	"restaurant",
	"cafe",
	"market",
	"nightlife"
]);
var LABELS = [
	{
		city: "paris",
		name: "Louvre and Palais Royal",
		lat: 48.8606,
		lng: 2.3376
	},
	{
		city: "paris",
		name: "Le Marais",
		lat: 48.8596,
		lng: 2.3622
	},
	{
		city: "paris",
		name: "Saint-Germain",
		lat: 48.854,
		lng: 2.333
	},
	{
		city: "paris",
		name: "Latin Quarter",
		lat: 48.8499,
		lng: 2.3469
	},
	{
		city: "paris",
		name: "Champ de Mars",
		lat: 48.8556,
		lng: 2.2986
	},
	{
		city: "paris",
		name: "Montmartre",
		lat: 48.8867,
		lng: 2.3431
	},
	{
		city: "tokyo",
		name: "Shinjuku",
		lat: 35.6938,
		lng: 139.7034
	},
	{
		city: "tokyo",
		name: "Shibuya",
		lat: 35.6595,
		lng: 139.7004
	},
	{
		city: "tokyo",
		name: "Ginza",
		lat: 35.6717,
		lng: 139.765
	},
	{
		city: "tokyo",
		name: "Asakusa",
		lat: 35.7148,
		lng: 139.7967
	},
	{
		city: "tokyo",
		name: "Tokyo Station",
		lat: 35.6812,
		lng: 139.7671
	},
	{
		city: "london",
		name: "Westminster",
		lat: 51.4995,
		lng: -.1248
	},
	{
		city: "london",
		name: "South Bank",
		lat: 51.5055,
		lng: -.115
	},
	{
		city: "london",
		name: "Bloomsbury",
		lat: 51.5194,
		lng: -.127
	},
	{
		city: "london",
		name: "Greenwich",
		lat: 51.4826,
		lng: -.0077
	}
];
/** Exact-hotel ranking stays in the codebase. It is off unless this is explicitly enabled. */
function hotelOptimizerEnabled() {
	const value = typeof process !== "undefined" ? process.env.ENABLE_HOTEL_OPTIMIZER : void 0;
	return value === "true" || value === "1" || value === "on";
}
function threshold(move) {
	return move === "walk" ? 25 : 30;
}
function sightseeing(trip) {
	const groups = /* @__PURE__ */ new Map();
	for (const stop of trip.stops) {
		if (stop.day == null || stop.excluded || stop.category === "stay" || FOOD.has(stop.category) || stop.meal) continue;
		if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) continue;
		const list = groups.get(stop.day) ?? [];
		list.push(stop);
		groups.set(stop.day, list);
	}
	return [...groups.entries()].map(([day, list]) => ({
		day,
		lat: list.reduce((sum, stop) => sum + stop.lat, 0) / list.length,
		lng: list.reduce((sum, stop) => sum + stop.lng, 0) / list.length,
		names: list.map((stop) => stop.displayName || stop.name).filter(Boolean),
		localities: list.map((stop) => stop.locality || "").filter(Boolean),
		areas: list.map((stop) => stop.area || "").filter(Boolean)
	})).sort((a, b) => a.day - b.day);
}
function loadFor(lat, lng, days, move, child) {
	const limit = child ? Math.min(20, threshold(move)) : threshold(move);
	const perDay = days.map((day) => estimateMinutes(move, distanceMeters(lat, lng, day.lat, day.lng)));
	return {
		perDay,
		average: perDay.length ? Math.round(perDay.reduce((sum, value) => sum + value, 0) / perDay.length) : 0,
		longest: perDay.length ? Math.max(...perDay) : 0,
		close: perDay.filter((value) => value <= limit).length,
		limit
	};
}
function acceptable(average, close, days) {
	if (!days) return false;
	if (average >= 120) return false;
	if (close === 0 && average > 45) return false;
	return true;
}
function bestOverall(average, close, days) {
	return days > 0 && close > 0 && close / days >= .5 && average <= 40 && average < 90;
}
function nightsLabel(days) {
	const nights = [...new Set(days)].sort((a, b) => a - b).map((day) => day + 1);
	if (!nights.length) return "";
	if (nights.length === 1) return `Night ${nights[0]}`;
	return nights.every((night, index) => index === 0 || night === (nights[index - 1] ?? 0) + 1) ? `Night ${nights[0]}–${nights[nights.length - 1]}` : `Nights ${nights.join(", ")}`;
}
function namedLabel(lat, lng, destination, sample) {
	const city = destination.toLowerCase();
	const label = LABELS.filter((item) => city.includes(item.city) && distanceMeters(lat, lng, item.lat, item.lng) < 4e3).sort((a, b) => distanceMeters(lat, lng, a.lat, a.lng) - distanceMeters(lat, lng, b.lat, b.lng))[0];
	if (label) return label.name;
	const locality = sample.localities.find((value) => value && value.toLowerCase() !== city && !city.includes(value.toLowerCase()));
	if (locality) return locality;
	const area = sample.areas.find((value) => value && value.toLowerCase() !== city && !city.includes(value.toLowerCase()));
	if (area) return area;
	return [...tripAreasNear(sample)].find(Boolean) || sample.names[0] ? `Near ${sample.names[0]}` : destination;
}
function tripAreasNear(sample) {
	return sample.areas;
}
function clusterDays(days, meters) {
	const groups = [];
	for (const day of days) {
		const group = groups.find((items) => {
			const lat = items.reduce((sum, item) => sum + item.lat, 0) / items.length;
			const lng = items.reduce((sum, item) => sum + item.lng, 0) / items.length;
			return distanceMeters(lat, lng, day.lat, day.lng) <= meters;
		});
		if (group) group.push(day);
		else groups.push([day]);
	}
	return groups.sort((a, b) => (a[0]?.day ?? 0) - (b[0]?.day ?? 0));
}
function centroid(days) {
	return {
		lat: days.reduce((sum, day) => sum + day.lat, 0) / days.length,
		lng: days.reduce((sum, day) => sum + day.lng, 0) / days.length
	};
}
function cardFor(id, name, lat, lng, days, all, trip, role) {
	const child = hasYoungChild(trip.childAges);
	const load = loadFor(lat, lng, all, trip.move, child);
	if (!acceptable(load.average, load.close, all.length)) return null;
	const changes = new Set(trip.bases.filter((base) => base.chosen).map((base) => base.hotelChanges)).values().next().value ?? 0;
	const why = [
		`${load.close} of ${all.length} sightseeing days start within about ${load.limit} min.`,
		`Estimated average first journey: about ${load.average} min.`,
		changes > 0 ? `${changes} hotel change${changes === 1 ? "" : "s"}.` : "One base. No hotel change."
	];
	if (child) why.push("Shorter first journeys, because this trip includes a young child.");
	if (trip.stops.some((stop) => stop.day != null && FOOD.has(stop.category) && distanceMeters(lat, lng, stop.lat, stop.lng) < 1500)) why.push("Meals already on these days sit in this area.");
	const tradeoff = load.longest > load.limit * 3 ? `The longest first journey is about ${load.longest} min. That day works better as a day trip than as a reason to move the base.` : load.average > 25 ? `Some days start further out. Average first journey is about ${load.average} min.` : "";
	return {
		id,
		name,
		role: role === "Best overall base" && !bestOverall(load.average, load.close, all.length) ? "Closest area" : role,
		why: why.filter(Boolean).slice(0, 4),
		tradeoff,
		averageMin: load.average,
		longestMin: load.longest,
		closeDays: load.close,
		dayCount: all.length,
		nightsLabel: nightsLabel(days.map((day) => day.day)),
		lat,
		lng
	};
}
function recommendStayAreas(trip) {
	const days = sightseeing(trip);
	if (days.length < 1) return [];
	const span = days.reduce((max, day) => Math.max(max, ...days.map((other) => distanceMeters(day.lat, day.lng, other.lat, other.lng))), 0);
	const areaSpan = trip.areas.reduce((max, area) => Math.max(max, ...trip.areas.map((other) => distanceMeters(area.latitude, area.longitude, other.latitude, other.longitude))), 0);
	if (span > 8e4 || areaSpan > 8e4) {
		const stays = trip.stops.filter((stop) => stop.day != null && stop.category === "stay").sort((a, b) => (a.day ?? 0) - (b.day ?? 0));
		const nights = (stays.length ? stays : []).map((stay) => {
			const nearest = trip.areas.map((area) => ({
				area,
				meters: distanceMeters(area.latitude, area.longitude, stay.lat, stay.lng)
			})).sort((a, b) => a.meters - b.meters)[0];
			const pinned = nearest && nearest.meters < 4e4 ? nearest.area : null;
			return {
				day: stay.day ?? 0,
				name: pinned?.name || stay.area || trip.destination,
				lat: pinned?.latitude ?? stay.lat,
				lng: pinned?.longitude ?? stay.lng
			};
		});
		const groups = [];
		for (const night of nights) {
			const last = groups[groups.length - 1];
			if (last?.[0] && last[0].name === night.name) last.push(night);
			else groups.push([night]);
		}
		const changes = Math.max(0, groups.length - 1);
		const cards = [];
		groups.slice(0, 3).forEach((group, index) => {
			const sample = group[0];
			if (!sample) return;
			const local = days.filter((day) => group.some((night) => night.day === day.day));
			const child = hasYoungChild(trip.childAges);
			const load = local.length ? loadFor(sample.lat, sample.lng, local, trip.move, child) : {
				average: 0,
				longest: 0,
				close: 0,
				limit: threshold(trip.move)
			};
			const label = nightsLabel(group.map((night) => night.day));
			cards.push({
				id: `overnight-${index}`,
				name: sample.name,
				role: "Overnight base",
				why: [
					label,
					local.length ? "The sightseeing on these nights stays in this area." : "Overnight stop. The sights for these nights were not loaded.",
					changes ? `${changes} hotel change${changes === 1 ? "" : "s"} on this trip. Each change costs a morning.` : "One base. No hotel change."
				],
				tradeoff: changes ? "Moving hotels is worth it only because the next nights are too far for a day trip." : "",
				averageMin: load.average,
				longestMin: load.longest,
				closeDays: load.close,
				dayCount: local.length || group.length,
				nightsLabel: label,
				lat: sample.lat,
				lng: sample.lng
			});
		});
		return cards;
	}
	const seeds = [];
	const push = (seed) => {
		if (seeds.some((item) => item.name.toLowerCase() === seed.name.toLowerCase() || distanceMeters(item.lat, item.lng, seed.lat, seed.lng) < 1500)) return;
		seeds.push(seed);
	};
	for (const group of clusterDays(days, 6e3)) {
		const centre = centroid(group);
		const sample = group[0];
		if (!sample) continue;
		push({
			id: `cluster-${sample.day}`,
			name: namedLabel(centre.lat, centre.lng, trip.destination, sample),
			lat: centre.lat,
			lng: centre.lng,
			days: group
		});
	}
	const city = trip.destination.toLowerCase();
	for (const label of LABELS) {
		if (!city.includes(label.city)) continue;
		const covered = days.filter((day) => distanceMeters(label.lat, label.lng, day.lat, day.lng) < 2500);
		if (!covered.length) continue;
		push({
			id: `label-${label.name}`,
			name: label.name,
			lat: label.lat,
			lng: label.lng,
			days: covered
		});
	}
	const ranked = seeds.map((seed) => ({
		seed,
		card: cardFor(seed.id, seed.name, seed.lat, seed.lng, seed.days, days, trip, "Alternative")
	})).filter((item) => Boolean(item.card)).sort((a, b) => b.card.closeDays - a.card.closeDays || a.card.averageMin - b.card.averageMin || a.card.name.localeCompare(b.card.name));
	if (!ranked.length) return [];
	const [first, ...rest] = ranked;
	if (!first) return [];
	const best = {
		...first.card,
		nightsLabel: "",
		role: bestOverall(first.card.averageMin, first.card.closeDays, first.card.dayCount) ? "Best overall base" : "Closest area"
	};
	return [best, ...rest.filter((item) => item.card.closeDays >= Math.ceil(days.length / 2) || item.card.averageMin + 8 < best.averageMin).slice(0, 2).map((item) => ({
		...item.card,
		nightsLabel: "",
		role: "Alternative"
	}))];
}
function canonicalHotel(input) {
	if (!input?.name || input.name.trim().length < 2) return null;
	if (input.provider !== "osm" && input.provider !== "wikidata") return null;
	if (!input.providerId || !input.address?.trim()) return null;
	const lat = input.lat;
	const lng = input.lng;
	if (typeof lat !== "number" || typeof lng !== "number" || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
	if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
	return {
		name: input.name.trim().slice(0, 80),
		lat,
		lng,
		address: input.address.trim().slice(0, 160),
		provider: input.provider,
		providerId: input.providerId.slice(0, 80)
	};
}
/** Picks a geocoded property near the trip. A name with no coordinates is ignored. Lat and lng are never swapped. */
function chooseHotelHit(hits, near, query) {
	const words = query.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 4);
	return hits.map((hit) => canonicalHotel(hit)).filter((hit) => Boolean(hit)).map((hit) => {
		return {
			hit,
			meters: near.length ? Math.min(...near.map((point) => distanceMeters(hit.lat, hit.lng, point.lat, point.lng))) : 0,
			named: words.length === 0 || words.some((word) => hit.name.toLowerCase().includes(word))
		};
	}).filter((item) => item.named && item.meters <= 8e4).sort((a, b) => a.meters - b.meters)[0]?.hit ?? null;
}
function matchBookedHotel(trip, query) {
	const words = query.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 3);
	if (!words.length) return null;
	const hit = trip.stops.filter((stop) => stop.category === "stay" && stop.provider !== "area" && Number.isFinite(stop.lat) && Number.isFinite(stop.lng)).find((stop) => {
		const name = `${stop.displayName || ""} ${stop.name} ${stop.address}`.toLowerCase();
		return words.every((word) => name.includes(word));
	});
	if (!hit || hit.provider !== "osm" && hit.provider !== "wikidata") return null;
	return canonicalHotel({
		name: hit.displayName || hit.name,
		lat: hit.lat,
		lng: hit.lng,
		address: hit.address || trip.destination,
		provider: hit.provider,
		providerId: hit.providerId || hit.id
	});
}
function stayNearPoints(trip) {
	const days = sightseeing(trip);
	return [...trip.areas.map((area) => ({
		lat: area.latitude,
		lng: area.longitude
	})), ...days.map((day) => ({
		lat: day.lat,
		lng: day.lng
	}))].filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng)).slice(0, 8);
}
/** Uses a resolved property as the base. Sightseeing stops stay on their days. */
function applyBookedHotel(trip, hotel) {
	const place = canonicalHotel(hotel);
	if (!place) return trip;
	const scheduled = trip.stops.filter((stop) => stop.category === "stay" && stop.day != null);
	if (!scheduled.length) return trip;
	const closest = [...scheduled].sort((a, b) => distanceMeters(a.lat, a.lng, place.lat, place.lng) - distanceMeters(b.lat, b.lng, place.lat, place.lng))[0];
	if (!closest || distanceMeters(closest.lat, closest.lng, place.lat, place.lng) > 8e4) return trip;
	const targets = new Set(scheduled.filter((stop) => distanceMeters(stop.lat, stop.lng, place.lat, place.lng) <= 4e4 || stop.id === closest.id).map((stop) => stop.id));
	const stops = trip.stops.map((stop) => {
		if (!targets.has(stop.id)) return stop;
		return {
			...stop,
			name: place.name,
			lat: place.lat,
			lng: place.lng,
			provider: place.provider,
			providerId: place.providerId,
			address: place.address,
			bookingStatus: "booked",
			note: "Your hotel. The sights are unchanged.",
			displayName: place.name
		};
	});
	let next = {
		...trip,
		stops,
		hotelSelectionSource: "USER_BOOKED"
	};
	const days = new Set(stops.filter((stop) => targets.has(stop.id) && stop.day != null).map((stop) => stop.day));
	for (const day of days) next = retimeDay(next, day);
	return next;
}
//#endregion
export { normalizeTravelParty as $, estimateMinutes as A, unscheduleStop as At, inferCountry as B, destinationLocalName as C, sourceLanguage as Ct, durationPhrase as D, tidyLocalLabel as Dt, displayClock as E, tidyLatin as Et, handoffChoices as F, localNameFits as G, itineraryRequestPlan as H, hasNonLatin as I, matchBookedHotel as J, localSubtitle as K, hotelOptimizerEnabled as L, experienceBalance as M, verifiedWebsite as Mt, externalPlaceLinks as N, voiceStaysInside as Nt, englishAreaName as O, toggleKeptHotel as Ot, forecastLocal as P, writeNavPreference as Pt, nearbyPlaceNames as Q, hoursLine as R, destinationLanguages as S, setHotelPreferences as St, discoverSections as T, suggestOrder as Tt, keepLockedDays as U, isGenericDayTheme as V, likeHotel as W, navLabel as X, moveStop as Y, navigationHref as Z, buildTrip as _, savePlace as _t, acceptExperienceLine as a, polishAddress as at, cleanTheme as b, selectLegMode as bt, applyBookedHotel as c, readNavPreference as ct, applySuggestedOrder as d, recommendStayAreas as dt, notableOmissions as et, attachExperience as f, rejectHotel as ft, buildPlaceStory as g, routeLabel as gt, budgetText as h, retimeDay as ht, TRAVEL_MAP_STYLE as i, placeMatches as it, excludePlace as j, usefulLegReason as jt, ensureDestinationKnowledge as k, translationFits as kt, applyPlacePhoto as l, readableName as lt, bestDayFor as m, resolvePlaceDisplayName as mt, EXPERIENCE_LABEL as n, pinKey as nt, annotatePlace as o, polishReading as ot, automaticNav as p, rerollHotels as pt, localTripVoice as q, TRAVEL_MAP_CREDIT as r, placeCopy as rt, appendStops as s, presetPreferences as st, DEFAULT_HOTEL_PREFERENCES as t, onKnowledgePersist as tt, applyRoute as u, rebalanceTrip as ut, categoryFromTags as v, scheduleStop as vt, detectPlatform as w, stayNearPoints as wt, dayStops as x, setDestinationFacts as xt, chooseHotelHit as y, selectBase as yt, importKnowledgeSnapshot as z };
