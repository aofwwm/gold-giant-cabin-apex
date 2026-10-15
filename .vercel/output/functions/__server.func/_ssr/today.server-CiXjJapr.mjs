import { t as clipVoice } from "./voice-1qktAoll.mjs";
import { n as noteCall, r as noteFailure } from "./provider-usage-CqiDrKv8.mjs";
import { KAIROS_VOICE, geminiJson } from "./gemini.server-D3PyYOAp.mjs";
import { n as TtlCache, r as shareRequest } from "./travel-cache-BPZkLeXq.mjs";
import { n as forecast } from "./family.server-Nh0QeptJ.mjs";
import { f as parseQuickRules } from "./today-F8WbxiwB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/today.server-CiXjJapr.js
async function readTodayWeather(date, latitude, longitude) {
	try {
		const weather = (await forecast({
			lat: latitude,
			lng: longitude
		}, date)).weather;
		if (!weather) return null;
		return {
			summary: weather.windowNote || weather.windowLabel,
			rain: weather.rainRisk,
			afternoonOutdoor: weather.afternoonOutdoor,
			morningOutdoor: weather.morningOutdoor,
			thunder: weather.thunder
		};
	} catch {
		return null;
	}
}
var todayRouteCache = new TtlCache(216e5, 200, "routing");
var todayVoiceCache = new TtlCache(432e5, 40, "gemini");
async function routeTodayLegs(pairs) {
	const legs = [];
	for (const pair of pairs.slice(0, 12)) {
		const cacheKey = `${pair.from.lat.toFixed(3)},${pair.from.lng.toFixed(3)};${pair.to.lat.toFixed(3)},${pair.to.lng.toFixed(3)}`;
		const cached = todayRouteCache.get(cacheKey);
		if (cached !== void 0) {
			legs.push(cached ? {
				key: pair.key,
				...cached
			} : {
				key: pair.key,
				minutes: null,
				meters: null
			});
			continue;
		}
		const leg = await shareRequest(`today-route:${cacheKey}`, () => fetchTodayLeg(cacheKey, pair));
		legs.push(leg ? {
			key: pair.key,
			...leg
		} : {
			key: pair.key,
			minutes: null,
			meters: null
		});
	}
	return legs;
}
async function fetchTodayLeg(cacheKey, pair) {
	const again = todayRouteCache.peek(cacheKey);
	if (again !== void 0) return again;
	const url = `https://router.project-osrm.org/route/v1/driving/${pair.from.lng},${pair.from.lat};${pair.to.lng},${pair.to.lat}?overview=false`;
	try {
		noteCall("routing", "osrm");
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"User-Agent": "Kairos/1.0 (today routing)"
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) {
			noteFailure("routing", "osrm", `HTTP ${res.status}`);
			return null;
		}
		const route = (await res.json()).routes?.[0];
		if (!route?.duration || !route.distance) return null;
		const speed = route.distance / route.duration;
		if (speed < 1 || speed > 40) return null;
		const leg = {
			minutes: Math.max(1, Math.round(route.duration / 60)),
			meters: Math.round(route.distance)
		};
		todayRouteCache.set(cacheKey, leg);
		return leg;
	} catch {
		return null;
	}
}
async function parseTodayLine(text, date) {
	const rules = parseQuickRules(text, date);
	const raw = await geminiJson(`${KAIROS_VOICE} Turn one schedule note into JSON. Use only the words given. Do not invent a place, a time, or a duration that is not implied. kind is task, errand, appointment, or personal. Times are HH:MM 24-hour or empty.`, JSON.stringify({
		text: text.slice(0, 240),
		today: date,
		rules
	}), {
		type: "object",
		properties: {
			kind: { type: "string" },
			title: { type: "string" },
			date: { type: "string" },
			start: { type: "string" },
			duration: { type: "number" },
			deadline: { type: "string" },
			flexible: { type: "boolean" }
		}
	}, 180);
	const kinds = [
		"task",
		"errand",
		"appointment",
		"personal"
	];
	if (!raw || typeof raw !== "object") return {
		...rules,
		source: "rules"
	};
	const record = raw;
	return {
		kind: kinds.find((item) => item === record.kind) ?? rules.kind,
		title: typeof record.title === "string" && record.title.trim() ? record.title.trim().slice(0, 80) : rules.title,
		date: typeof record.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.date) ? record.date : rules.date,
		startMin: clock(typeof record.start === "string" ? record.start : "") ?? rules.startMin,
		duration: typeof record.duration === "number" && record.duration > 0 ? Math.min(240, Math.round(record.duration)) : rules.duration,
		deadlineMin: clock(typeof record.deadline === "string" ? record.deadline : "") ?? rules.deadlineMin,
		flexible: typeof record.flexible === "boolean" ? record.flexible : rules.flexible,
		source: "kairos"
	};
}
function clock(value) {
	const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
	if (!match) return null;
	const hour = Number(match[1]);
	const minute = Number(match[2]);
	if (hour > 23 || minute > 59) return null;
	return hour * 60 + minute;
}
async function todayVoice(facts) {
	const key = facts.slice(0, 800);
	const cached = todayVoiceCache.get(key);
	if (cached !== void 0) return cached;
	return shareRequest(`today-voice:${key}`, () => fetchTodayVoice(key, facts));
}
async function fetchTodayVoice(key, facts) {
	const again = todayVoiceCache.peek(key);
	if (again !== void 0) return again;
	const raw = await geminiJson(`${KAIROS_VOICE} One practical sentence about this day, maximum 20 words. Use only the JSON. Do not invent weather, travel, places, or events.`, facts, {
		type: "object",
		properties: { line: { type: "string" } }
	}, 80);
	if (!raw || typeof raw !== "object" || typeof raw.line !== "string") return "";
	const line = clipVoice(raw.line);
	if (line) todayVoiceCache.set(key, line);
	return line;
}
//#endregion
export { parseTodayLine, readTodayWeather, routeTodayLegs, todayVoice };
