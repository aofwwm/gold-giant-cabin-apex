import { geminiJson } from "./gemini.server-D3PyYOAp.mjs";
import { parseDatingIntent } from "./dating.server-CkKxdbA_.mjs";
import { i as interpretTravelBrief, n as interpretFamilyPlan, r as interpretTeamBrief } from "./planning-brief--f7cMx2Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/planning-brief.server-jjBBrJxI.js
var SCHEMAS = {
	travel: {
		type: "object",
		properties: {
			destinations: {
				type: "array",
				items: { type: "string" }
			},
			mustVisit: {
				type: "array",
				items: { type: "string" }
			},
			avoidPlaces: {
				type: "array",
				items: { type: "string" }
			},
			nights: { type: "number" },
			travellerType: { type: "string" },
			mustHave: {
				type: "array",
				items: { type: "string" }
			},
			pace: { type: "string" },
			hotelChangePreference: { type: "string" }
		}
	},
	family: {
		type: "object",
		properties: {
			dateIntent: { type: "string" },
			timeOfDay: { type: "string" },
			indoorOutdoor: { type: "string" },
			interests: {
				type: "array",
				items: { type: "string" }
			},
			maxTravelMinutes: { type: "number" },
			travelMode: { type: "string" },
			areaText: { type: "string" }
		}
	},
	team_out: {
		type: "object",
		properties: {
			groupSize: { type: "number" },
			dateIntent: { type: "string" },
			timeOfDay: { type: "string" },
			budgetPerPerson: { type: "number" },
			vibes: {
				type: "array",
				items: { type: "string" }
			},
			areaIntent: { type: "string" },
			avoid: {
				type: "array",
				items: { type: "string" }
			}
		}
	}
};
function mentioned(text, value) {
	return text.toLowerCase().includes(value.toLowerCase());
}
function mergeTravel(local, raw, text) {
	if (!raw || typeof raw !== "object") return local;
	const record = raw;
	const next = {
		...local,
		destinations: [...local.destinations],
		mustVisit: [...local.mustVisit],
		avoidPlaces: [...local.avoidPlaces],
		mustHave: [...local.mustHave],
		interests: [...local.interests],
		avoid: [...local.avoid]
	};
	for (const name of arrayOf(record.destinations)) if (!next.destinations.includes(name) && mentioned(text, name) && !next.avoidPlaces.includes(name)) next.destinations.push(name);
	for (const name of arrayOf(record.mustVisit)) if (!next.mustVisit.includes(name) && mentioned(text, name)) next.mustVisit.push(name);
	return next;
}
function mergeFamily(local, raw, text) {
	if (!raw || typeof raw !== "object") return local;
	const record = raw;
	const next = {
		...local,
		interests: [...local.interests]
	};
	for (const name of arrayOf(record.interests)) if (!next.interests.includes(name) && mentioned(text, name)) next.interests.push(name);
	if (!next.areaText && typeof record.areaText === "string" && mentioned(text, record.areaText)) next.areaText = record.areaText;
	return next;
}
function mergeTeam(local, raw, text) {
	if (!raw || typeof raw !== "object") return local;
	const record = raw;
	const next = {
		...local,
		vibes: [...local.vibes],
		avoid: [...local.avoid]
	};
	for (const name of arrayOf(record.vibes)) if (!next.vibes.includes(name) && mentioned(text, name)) next.vibes.push(name);
	if (next.groupSize == null && typeof record.groupSize === "number" && mentioned(text, String(record.groupSize))) next.groupSize = record.groupSize;
	if (next.budgetPerPerson == null && typeof record.budgetPerPerson === "number" && mentioned(text, String(record.budgetPerPerson))) next.budgetPerPerson = record.budgetPerPerson;
	return next;
}
function arrayOf(value) {
	return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.length > 1 && item.length < 60) : [];
}
async function parsePlanningBrief(mode, text, today) {
	if (mode === "dating") return {
		mode,
		intent: await parseDatingIntent(text, today)
	};
	const raw = await geminiJson("Parse a planning brief into JSON. Do not invent ages, coordinates, prices, venues, weather, or travel times. Only name places and constraints that the user actually wrote. Leave unspecified fields empty.", text.slice(0, 500), SCHEMAS[mode], 420);
	if (mode === "travel") return {
		mode,
		intent: mergeTravel(interpretTravelBrief(text), raw, text)
	};
	if (mode === "family") return {
		mode,
		intent: mergeFamily(interpretFamilyPlan(text, today), raw, text)
	};
	return {
		mode,
		intent: mergeTeam(interpretTeamBrief(text, today), raw, text)
	};
}
//#endregion
export { parsePlanningBrief };
