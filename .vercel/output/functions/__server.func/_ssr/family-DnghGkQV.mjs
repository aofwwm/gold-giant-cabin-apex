//#region node_modules/.nitro/vite/services/ssr/assets/family-DnghGkQV.js
var FAMILY_INTERESTS = [
	"animals",
	"science",
	"dinosaurs",
	"art",
	"crafts",
	"cars",
	"trains",
	"water",
	"sports",
	"nature",
	"characters",
	"playground",
	"performances",
	"festivals",
	"food",
	"technology",
	"books",
	"museum",
	"cycling",
	"games"
];
var clamp = (value, min, max) => Math.max(min, Math.min(max, Math.round(value)));
function travelMinutes(meters) {
	const walk = Math.round(meters * 1.35 / 75);
	if (walk <= 25) return Math.max(1, walk);
	return Math.max(10, Math.round(meters / 400));
}
function ageFit(place, ages) {
	if (!ages.length) return 16;
	const youngest = Math.min(...ages);
	const oldest = Math.max(...ages);
	let score = 10;
	if (youngest < 4) score += place.toddler ? 12 : place.interests.includes("nature") ? 4 : -6;
	else if (youngest < 13) score += place.interests.some((item) => [
		"playground",
		"nature",
		"museum",
		"cycling",
		"animals",
		"water"
	].includes(item)) ? 10 : 3;
	else score += place.mixedAge || place.interests.includes("museum") || place.interests.includes("games") ? 8 : 4;
	if (oldest - youngest >= 6) score += place.mixedAge ? 5 : -4;
	if (oldest >= 13 && place.toddler && !place.mixedAge) score -= 4;
	return clamp(score, 0, 25);
}
function interestFit(place, selected) {
	if (!selected.length) return 12;
	const hits = selected.filter((item) => place.interests.includes(item)).length;
	if (!hits) return 2;
	return clamp(hits / selected.length * 20, 4, 20);
}
function weatherFit(place, weather) {
	if (!weather) return place.setting === "indoor" || place.rainSafe ? 12 : 8;
	if (place.setting === "indoor" || place.rainSafe) return weather.outdoorOk ? 14 : 20;
	if (!weather.outdoorOk || weather.thunder) return 3;
	if (weather.rainRisk === "low" && !weather.heat) return 20;
	if (weather.rainRisk === "moderate" || weather.heat || weather.uvHigh) return 11;
	return 6;
}
function scoreFamily(place, brief, weather) {
	const age = ageFit(place, brief.ages);
	const interest = interestFit(place, brief.interests);
	const weatherScore = weatherFit(place, weather);
	let practical = place.travelMin <= brief.maxTravel / 2 ? 13 : place.travelMin <= brief.maxTravel ? 9 : 4;
	if (brief.stroller && place.stroller) practical += 2;
	if (brief.toddler && place.toddler) practical += 0;
	practical = clamp(practical, 0, 15);
	const value = place.free ? 10 : place.approxSgd <= 20 ? 7 : place.approxSgd <= brief.budget ? 5 : 2;
	const timing = place.setting === "outdoor" ? weather?.outdoorOk ? 10 : 3 : 8;
	const total = clamp(age + interest + weatherScore + practical + value + timing, 0, 100);
	const lines = [];
	if (age >= 20) lines.push("Great age fit");
	else if (age >= 14) lines.push("Works across these ages");
	if (weatherScore >= 16) lines.push(place.setting === "outdoor" ? "Good weather window" : "Rain-safe");
	else if (place.setting === "outdoor" && weather && !weather.outdoorOk) lines.push("Poor outdoor conditions");
	if (place.free) lines.push("Free activity");
	if (place.travelMin <= 20) lines.push("Short travel");
	return {
		total,
		age,
		interest,
		weather: weatherScore,
		practical,
		value,
		timing,
		lines: lines.slice(0, 4)
	};
}
function hourLabel(hour) {
	return `${hour % 12 === 0 ? 12 : hour % 12} ${hour < 12 ? "AM" : "PM"}`;
}
function thunder(code) {
	return code >= 95;
}
function rainy(code) {
	return code >= 51 && code <= 67 || code >= 80 && code <= 82 || thunder(code);
}
function readWeather(date, hours) {
	const day = hours.filter((hour) => hour.hour >= 7 && hour.hour <= 19);
	const pool = day.length ? day : hours;
	const maxRain = pool.reduce((max, hour) => Math.max(max, hour.rain), 0);
	const maxUv = pool.reduce((max, hour) => Math.max(max, hour.uv), 0);
	const maxWind = pool.reduce((max, hour) => Math.max(max, hour.wind), 0);
	const thunderOn = pool.some((hour) => thunder(hour.code));
	const heat = pool.some((hour) => hour.temp >= 33);
	let best = null;
	for (let index = 0; index < pool.length - 1; index += 1) {
		const left = pool[index];
		const right = pool[index + 1];
		if (!left || !right || right.hour !== left.hour + 1) continue;
		const rain = (left.rain + right.rain) / 2;
		const temp = (left.temp + right.temp) / 2;
		let score = 100 - rain;
		if (thunder(left.code) || thunder(right.code)) score -= 50;
		if (temp >= 33) score -= 18;
		if (Math.max(left.uv, right.uv) >= 9 && left.hour >= 11 && left.hour <= 15) score -= 8;
		if (left.hour >= 8 && left.hour <= 10) score += 8;
		if (!best || score > best.score) best = {
			start: left.hour,
			end: right.hour + 1,
			score,
			rain,
			temp
		};
	}
	const morning = pool.filter((hour) => hour.hour >= 8 && hour.hour <= 11);
	const afternoon = pool.filter((hour) => hour.hour >= 13 && hour.hour <= 16);
	const slotOutdoor = (hours) => hours.length > 0 && !hours.some((hour) => thunder(hour.code)) && hours.reduce((sum, hour) => sum + hour.rain, 0) / hours.length < 40;
	const morningOutdoor = slotOutdoor(morning);
	const afternoonOutdoor = slotOutdoor(afternoon);
	const rainRisk = maxRain >= 60 || thunderOn ? "high" : maxRain >= 35 ? "moderate" : "low";
	const outdoorOk = Boolean(best && best.rain < 40 && best.score >= 55 && !thunderOn);
	const windowLabel = best ? `${hourLabel(best.start)}–${hourLabel(best.end)}` : "No calm window";
	const windowNote = !best ? "No usable daylight window in the forecast." : [best.rain < 35 ? "Lower rain risk" : "Rain still possible", best.temp < 32 ? "Cooler conditions" : "Hot"].join(" · ");
	const summary = outdoorOk ? `${windowLabel}. ${windowNote}.` : thunderOn ? "Thunderstorms are in the forecast. Keep this one indoors." : rainy(pool[0]?.code ?? 0) || rainRisk !== "low" ? "Rain is likely. Indoor options come first." : heat ? "It stays hot. Morning is the kinder outdoor window." : `${windowLabel}. ${windowNote}.`;
	return {
		date,
		outdoorOk,
		rainRisk,
		heat,
		thunder: thunderOn,
		uvHigh: maxUv >= 8,
		windy: maxWind >= 35,
		maxRain,
		maxUv,
		maxWind,
		morningOutdoor,
		afternoonOutdoor,
		windowLabel,
		windowNote,
		summary
	};
}
//#endregion
export { travelMinutes as i, readWeather as n, scoreFamily as r, FAMILY_INTERESTS as t };
