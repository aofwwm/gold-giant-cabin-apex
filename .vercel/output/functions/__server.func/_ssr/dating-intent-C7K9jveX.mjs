import { n as DATE_TYPES, r as DATE_VIBES, t as DATE_FOODS } from "./dating-DQG0N1wV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dating-intent-C7K9jveX.js
var REGIONS = [
	{
		id: "east",
		label: "East Singapore",
		latitude: 1.301,
		longitude: 103.912,
		pattern: /\b(the\s+east|east\s+side|east\s+singapore|eastern\s+singapore|east\s+coast)\b/i
	},
	{
		id: "west",
		label: "West Singapore",
		latitude: 1.34,
		longitude: 103.705,
		pattern: /\b(the\s+west|west\s+side|west\s+singapore|western\s+singapore)\b/i
	},
	{
		id: "north",
		label: "North Singapore",
		latitude: 1.43,
		longitude: 103.8,
		pattern: /\b(the\s+north|north\s+side|north\s+singapore)\b/i
	},
	{
		id: "central",
		label: "Central Singapore",
		latitude: 1.3,
		longitude: 103.845,
		pattern: /\b(central|town|cbd)\b/i
	}
];
var BUDGET_STEPS = [
	30,
	60,
	80,
	100,
	150,
	250
];
var FOOD_WORD = [
	{
		food: "dinner",
		pattern: /\bdinner\b/i
	},
	{
		food: "dessert",
		pattern: /\bdessert\b/i
	},
	{
		food: "cafe",
		pattern: /\b(coffee|cafe|café)\b/i
	},
	{
		food: "drinks",
		pattern: /\b(drinks|cocktails|wine)\b/i
	},
	{
		food: "museum",
		pattern: /\b(museum|gallery|art)\b/i
	},
	{
		food: "workshop",
		pattern: /\bworkshop\b/i
	},
	{
		food: "walk",
		pattern: /\bwalk\b/i
	},
	{
		food: "view",
		pattern: /\b(view|waterfront|rooftop)\b/i
	},
	{
		food: "games",
		pattern: /\b(games|arcade)\b/i
	},
	{
		food: "karaoke",
		pattern: /\bkaraoke\b/i
	},
	{
		food: "picnic",
		pattern: /\bpicnic\b/i
	},
	{
		food: "nature",
		pattern: /\b(nature|park)\b/i
	}
];
function emptyIntent() {
	return {
		dateIntent: null,
		specificDate: null,
		timeOfDay: null,
		startMin: null,
		areaText: null,
		areaKind: null,
		areaLabel: null,
		latitude: null,
		longitude: null,
		budgetLevel: null,
		budgetMax: null,
		vibes: [],
		planComponents: [],
		durationPreference: null,
		durationMinutes: null,
		conversationFriendly: null,
		indoorOutdoor: null,
		travelPreference: null,
		maxTravel: null,
		dateType: null,
		pressure: null,
		specialOccasion: null,
		avoid: [],
		span: null,
		aside: ""
	};
}
function resolveRelativeDate(intent, today) {
	const [year, month, day] = today.split("-").map(Number);
	if (!year || !month || !day) return null;
	const date = new Date(Date.UTC(year, month - 1, day));
	if (intent === "today") return today;
	if (intent === "tomorrow") {
		date.setUTCDate(date.getUTCDate() + 1);
		return date.toISOString().slice(0, 10);
	}
	if (intent === "this_friday" || intent === "this_weekend") {
		const target = intent === "this_friday" ? 5 : 6;
		const weekday = date.getUTCDay();
		const hop = weekday === target ? 0 : (target - weekday + 7) % 7;
		date.setUTCDate(date.getUTCDate() + hop);
		return date.toISOString().slice(0, 10);
	}
	return null;
}
function snapBudget(amount) {
	return [...BUDGET_STEPS].reverse().find((item) => item <= amount) ?? 30;
}
function words(line) {
	return line.split(/\s+/).filter(Boolean).slice(0, 20).join(" ");
}
function asideFor(intent) {
	if (intent.dateType === "first" && intent.conversationFriendly) return "First date. Low pressure. Good food. Optional second stop. That should do.";
	const east = intent.areaLabel === "East Singapore";
	const food = intent.planComponents.includes("dinner") && intent.planComponents.includes("dessert");
	if (intent.vibes.includes("cosy") && east && food) return "Cosy, east side, dinner and dessert. Sensible. I'll keep the travelling to a minimum.";
	if (intent.dateType === "anniversary" && intent.budgetLevel === "premium") return "Anniversary, scenic if we can, and the budget can stretch. Quietly noted.";
	if (intent.areaKind === "place" && intent.budgetMax) return words(`Dinner around ${intent.areaLabel}. Cap stays at $${intent.budgetMax}. The next stop stays close.`);
	return "";
}
function interpretDateBrief(text, today) {
	const intent = emptyIntent();
	const line = text.replace(/\s+/g, " ").trim();
	if (line.length < 8) return intent;
	if (/\bthis\s+friday\b|\bfriday\b/i.test(line)) intent.dateIntent = "this_friday";
	else if (/\btomorrow\b/i.test(line)) intent.dateIntent = "tomorrow";
	else if (/\btoday\b|\btonight\b/i.test(line)) intent.dateIntent = "today";
	else if (/\bthis\s+weekend\b|\bsaturday\b/i.test(line)) intent.dateIntent = "this_weekend";
	intent.specificDate = resolveRelativeDate(intent.dateIntent, today);
	if (/\b(after work|evening)\b/i.test(line)) {
		intent.timeOfDay = "evening";
		intent.startMin = 1140;
	} else if (/\bnight\b/i.test(line)) {
		intent.timeOfDay = "night";
		intent.startMin = 1230;
	} else if (/\bafternoon\b/i.test(line)) {
		intent.timeOfDay = "afternoon";
		intent.startMin = 840;
	} else if (/\bbrunch\b/i.test(line)) {
		intent.timeOfDay = "brunch";
		intent.startMin = 660;
	} else if (/\bbreakfast\b/i.test(line)) {
		intent.timeOfDay = "breakfast";
		intent.startMin = 540;
	}
	const explicitMoney = line.match(/\b(?:under|below|less than|max(?:imum)?|up to)\s*\$?\s*(\d{2,3})\b/i) || line.match(/\$\s*(\d{2,3})\b/);
	if (/\bfree\b/i.test(line) && !explicitMoney) {
		intent.budgetLevel = "free";
		intent.budgetMax = 0;
	} else if (explicitMoney?.[1]) {
		const amount = snapBudget(Number(explicitMoney[1]));
		intent.budgetMax = amount;
		intent.budgetLevel = amount >= 250 ? "premium" : null;
	} else if (/\b(splurge|premium|spare no expense|okay to splurge|ok to splurge)\b/i.test(line)) {
		intent.budgetLevel = "premium";
		intent.budgetMax = 250;
	} else if (/\b(cheap|budget|not too expensive|not too atas|inexpensive)\b/i.test(line)) {
		intent.budgetLevel = "moderate";
		intent.budgetMax = 80;
	} else if (/\b(mid-range|mid range|nice but not crazy)\b/i.test(line)) {
		intent.budgetLevel = "moderate";
		intent.budgetMax = 100;
	}
	if (/\b(first date|awkward)\b/i.test(line)) intent.dateType = "first";
	else if (/\banniversary\b/i.test(line)) intent.dateType = "anniversary";
	else if (/\b(my wife|my husband|married)\b/i.test(line)) intent.dateType = "married";
	else if (/\bparents\b/i.test(line)) intent.dateType = "parents";
	else if (/\bsurprise\b/i.test(line)) intent.dateType = "surprise";
	else if (/\bcasual\b/i.test(line)) intent.dateType = "casual";
	else if (/\bdate night\b/i.test(line)) intent.dateType = "night";
	if (/\banniversary\b/i.test(line)) intent.specialOccasion = "anniversary";
	if (/\b(cosy|cozy)\b/i.test(line)) intent.vibes.push("cosy");
	if (/\b(quiet|can talk|conversation|low[- ]key)\b/i.test(line)) intent.vibes.push("quiet");
	if (/\b(relaxed|chill|not too expensive)\b/i.test(line) && !intent.vibes.includes("chill")) intent.vibes.push("chill");
	if (/\bscenic\b/i.test(line)) intent.vibes.push("scenic");
	if (/\b(playful|fun)\b/i.test(line)) intent.vibes.push("playful");
	if (/\bart\b/i.test(line)) intent.vibes.push("artsy");
	if (/\bclassy\b/i.test(line)) intent.vibes.push("classy");
	if (/\b(can talk|conversation|somewhere quiet|don't make it awkward|do not make it awkward)\b/i.test(line)) intent.conversationFriendly = true;
	if (intent.conversationFriendly && !intent.vibes.includes("quiet")) intent.vibes.push("quiet");
	if (intent.conversationFriendly && !intent.vibes.includes("chill")) intent.vibes.push("chill");
	if (/\b(don't make it awkward|do not make it awkward|low[- ]pressure|low[- ]key)\b/i.test(line) || intent.dateType === "first") intent.pressure = "low";
	if (/\bnot childish\b/i.test(line)) intent.avoid.push("child-focused");
	for (const item of FOOD_WORD) if (item.pattern.test(line) && !intent.planComponents.includes(item.food)) intent.planComponents.push(item.food);
	const active = intent.planComponents.some((item) => [
		"museum",
		"workshop",
		"walk",
		"view",
		"games",
		"karaoke",
		"picnic",
		"nature"
	].includes(item));
	const eating = intent.planComponents.some((item) => [
		"dinner",
		"cafe",
		"dessert",
		"drinks"
	].includes(item));
	if (/\bfull day\b/i.test(line)) intent.span = "full";
	else if (active && eating) intent.span = "half";
	else if (eating) {
		intent.span = "quick";
		if (intent.planComponents.filter((item) => [
			"dinner",
			"cafe",
			"dessert",
			"drinks"
		].includes(item)).length > 1) {
			intent.durationPreference = "2-3 hours";
			intent.durationMinutes = 180;
		}
	}
	const region = REGIONS.find((item) => item.pattern.test(line));
	const place = line.match(/\b(?:around|near|at)\s+([A-Za-z][\w'’-]*(?:\s+[A-Za-z][\w'’-]*){0,2})/);
	const cleaned = (line.match(/\b([A-Za-z][\w'’.-]*(?:\s+[A-Za-z][\w'’.-]*){0,2}\s+Mall)\b/)?.[1] || place?.[1] || "").replace(/\b(for|after|before|two|the)\b.*$/i, "").trim();
	if (cleaned && !/^(the )?(east|west|north|central)$/i.test(cleaned)) {
		intent.areaKind = "place";
		intent.areaText = cleaned;
		intent.areaLabel = cleaned;
	} else if (region) {
		intent.areaKind = "region";
		intent.areaText = region.id;
		intent.areaLabel = region.label;
		intent.latitude = region.latitude;
		intent.longitude = region.longitude;
	}
	if (/\b(don't want to travel far|do not want to travel far|travel far after|somewhere nearby|don't make us cross|do not make us cross|whole island)\b/i.test(line)) {
		intent.travelPreference = /after\b/i.test(line) ? "short_second_leg" : "close";
		intent.maxTravel = 15;
	} else if (intent.areaKind === "region" && eating && intent.planComponents.length > 1) {
		intent.travelPreference = "close";
		intent.maxTravel = 30;
	}
	if (/\b(rain safe|indoors|indoor)\b/i.test(line)) intent.indoorOutdoor = "indoor";
	else if (/\b(outdoors|outdoor|al fresco)\b/i.test(line)) intent.indoorOutdoor = "outdoor";
	intent.aside = asideFor(intent);
	return intent;
}
function budgetLabel(intent) {
	if (intent.budgetLevel === "free") return "Free";
	if (intent.budgetLevel === "premium") return "Premium";
	if (intent.budgetLevel === "moderate" && intent.budgetMax === 80) return "Moderate budget";
	if (intent.budgetMax) return `≤ $${intent.budgetMax}`;
	if (intent.budgetLevel === "cheap") return "Cheap";
	return "Budget";
}
function intentChips(intent) {
	const chips = [];
	if (intent.specificDate && intent.dateIntent === "this_friday") chips.push({
		id: "when",
		label: intent.timeOfDay === "evening" ? "This Friday evening" : "This Friday",
		lock: "date"
	});
	else if (intent.specificDate && intent.dateIntent === "today") chips.push({
		id: "when",
		label: intent.timeOfDay ? `Today ${intent.timeOfDay}` : "Today",
		lock: "date"
	});
	else if (intent.specificDate && intent.dateIntent === "tomorrow") chips.push({
		id: "when",
		label: "Tomorrow",
		lock: "date"
	});
	else if (intent.timeOfDay) chips.push({
		id: "time",
		label: intent.timeOfDay[0].toUpperCase() + intent.timeOfDay.slice(1),
		lock: "time"
	});
	if (intent.areaLabel) chips.push({
		id: "area",
		label: intent.areaLabel,
		lock: "area"
	});
	for (const vibe of intent.vibes) {
		const label = vibe === "chill" ? "Relaxed" : vibe[0].toUpperCase() + vibe.slice(1);
		chips.push({
			id: `vibe-${vibe}`,
			label,
			lock: "vibes"
		});
	}
	if (intent.budgetLevel || intent.budgetMax != null) chips.push({
		id: "budget",
		label: budgetLabel(intent),
		lock: "budget"
	});
	if (intent.planComponents.length) {
		const names = intent.planComponents.filter((item) => [
			"dinner",
			"dessert",
			"cafe",
			"drinks"
		].includes(item) || intent.span !== "quick");
		const shown = (names.length ? names : intent.planComponents).map((item) => item === "cafe" ? "Coffee" : item[0].toUpperCase() + item.slice(1));
		chips.push({
			id: "plan",
			label: shown.join(" + "),
			lock: "foods"
		});
	}
	if (intent.durationPreference) chips.push({
		id: "duration",
		label: "2–3 hrs",
		lock: "span"
	});
	if (intent.conversationFriendly) chips.push({
		id: "talk",
		label: "Easy to talk",
		lock: "crowd"
	});
	if (intent.travelPreference) chips.push({
		id: "travel",
		label: intent.travelPreference === "short_second_leg" ? "Short hop after" : "Stops stay close",
		lock: "travel"
	});
	if (intent.dateType) chips.push({
		id: "type",
		label: intent.dateType === "first" ? "First date" : intent.dateType[0].toUpperCase() + intent.dateType.slice(1),
		lock: "dateType"
	});
	if (intent.indoorOutdoor) chips.push({
		id: "setting",
		label: intent.indoorOutdoor[0].toUpperCase() + intent.indoorOutdoor.slice(1),
		lock: "setting"
	});
	return chips;
}
function moneyLabel(freeOnly, budget) {
	if (freeOnly) return "Free";
	if (budget >= 250) return "Premium";
	return `≤ $${budget}`;
}
function reconcileControls(current, intent, locks) {
	const next = {
		...current,
		vibes: [...current.vibes],
		foods: [...current.foods]
	};
	const conflicts = [];
	function take(key, locked, suggested, apply, same) {
		if (same) return;
		if (locked) conflicts.push({
			key,
			suggested,
			current: suggestedCurrent(key, current)
		});
		else apply();
	}
	if (intent.dateType) take("dateType", Boolean(locks.dateType), intent.dateType, () => {
		next.dateType = intent.dateType;
	}, current.dateType === intent.dateType);
	if (intent.specificDate) take("date", Boolean(locks.date), intent.specificDate, () => {
		next.date = intent.specificDate;
	}, current.date === intent.specificDate);
	if (intent.startMin != null) take("time", Boolean(locks.time) || Boolean(locks.date), clock(intent.startMin), () => {
		next.startMin = intent.startMin;
	}, current.startMin === intent.startMin);
	if (intent.span) take("span", Boolean(locks.span), intent.span, () => {
		next.span = intent.span;
	}, current.span === intent.span);
	if (intent.budgetLevel === "free") take("budget", Boolean(locks.budget), "Free", () => {
		next.freeOnly = true;
		next.budget = 0;
	}, current.freeOnly);
	else if (intent.budgetMax != null) take("budget", Boolean(locks.budget), budgetLabel(intent), () => {
		next.freeOnly = false;
		next.budget = intent.budgetMax;
	}, !current.freeOnly && current.budget === intent.budgetMax);
	if (intent.vibes.length) {
		const merged = [.../* @__PURE__ */ new Set([...intent.vibes])];
		const same = merged.every((item) => current.vibes.includes(item)) && current.vibes.length === merged.length;
		take("vibes", Boolean(locks.vibes), merged.join(", "), () => {
			next.vibes = merged;
		}, same);
	}
	if (intent.planComponents.length) {
		const same = intent.planComponents.every((item) => current.foods.includes(item)) && current.foods.length === intent.planComponents.length;
		take("foods", Boolean(locks.foods), intent.planComponents.join(" + "), () => {
			next.foods = [...intent.planComponents];
		}, same);
	}
	if (intent.indoorOutdoor) take("setting", Boolean(locks.setting), intent.indoorOutdoor, () => {
		next.setting = intent.indoorOutdoor;
	}, current.setting === intent.indoorOutdoor);
	if (intent.pressure) take("pressure", Boolean(locks.pressure), intent.pressure, () => {
		next.pressure = intent.pressure;
	}, current.pressure === intent.pressure);
	if (intent.maxTravel != null) take("travel", Boolean(locks.travel), `${intent.maxTravel} min`, () => {
		next.maxTravel = intent.maxTravel;
	}, current.maxTravel === intent.maxTravel);
	if (intent.conversationFriendly) take("crowd", Boolean(locks.crowd), "Easy to talk", () => {
		next.crowd = "avoid";
	}, current.crowd === "avoid");
	return {
		next,
		conflicts
	};
}
function suggestedCurrent(key, current) {
	if (key === "budget") return moneyLabel(current.freeOnly, current.budget);
	if (key === "date") return current.date;
	if (key === "time") return clock(current.startMin);
	if (key === "dateType") return current.dateType;
	if (key === "span") return current.span;
	if (key === "setting") return current.setting;
	if (key === "travel") return `${current.maxTravel} min`;
	if (key === "vibes") return current.vibes.join(", ");
	if (key === "foods") return current.foods.join(", ");
	if (key === "pressure") return current.pressure;
	return current.crowd;
}
function clock(minutes) {
	const hour = Math.floor(minutes / 60);
	const minute = minutes % 60;
	const suffix = hour >= 12 ? "PM" : "AM";
	return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${suffix}`;
}
function acceptModelIntent(local, raw, text) {
	if (!raw || typeof raw !== "object") return local;
	const record = raw;
	const next = {
		...local,
		vibes: [...local.vibes],
		planComponents: [...local.planComponents],
		avoid: [...local.avoid]
	};
	const line = text.toLowerCase();
	const dateType = DATE_TYPES.find((item) => item === record.dateType);
	if (!next.dateType && dateType && line.includes(dateType === "first" ? "first" : dateType)) next.dateType = dateType;
	const vibes = Array.isArray(record.vibes) ? record.vibes.filter((item) => DATE_VIBES.includes(item)) : [];
	for (const vibe of vibes) if (!next.vibes.includes(vibe) && line.includes(vibe)) next.vibes.push(vibe);
	const foods = Array.isArray(record.planComponents) ? record.planComponents.filter((item) => DATE_FOODS.includes(item)) : [];
	for (const food of foods) if (!next.planComponents.includes(food) && line.includes(food === "cafe" ? "coffee" : food)) next.planComponents.push(food);
	if (next.conversationFriendly == null && record.conversationFriendly === true && /talk|quiet|conversation/.test(line)) next.conversationFriendly = true;
	if (!next.indoorOutdoor && (record.indoorOutdoor === "indoor" || record.indoorOutdoor === "outdoor") && line.includes(String(record.indoorOutdoor))) next.indoorOutdoor = record.indoorOutdoor;
	if (typeof record.aside === "string") {
		const aside = words(record.aside.replace(/[^\w\s$',.-]/g, ""));
		if (aside && !/\d{2,}|street|road|restaurant/i.test(aside)) next.aside = aside;
	}
	if (!next.aside) next.aside = asideFor(next);
	return next;
}
//#endregion
export { reconcileControls as a, interpretDateBrief as i, budgetLabel as n, resolveRelativeDate as o, intentChips as r, acceptModelIntent as t };
