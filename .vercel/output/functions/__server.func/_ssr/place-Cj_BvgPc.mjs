//#region node_modules/.nitro/vite/services/ssr/assets/place-Cj_BvgPc.js
var FORMATS = [
	"physical",
	"online",
	"hybrid"
];
var PLATFORMS = [
	"",
	"teams",
	"zoom",
	"skype",
	"meet",
	"webex",
	"other"
];
var MAKAN_WHEN = [
	"",
	"before",
	"after"
];
var EMPTY_PLACE = {
	format: "physical",
	venueName: "",
	room: "",
	address: "",
	platform: "",
	meetingUrl: "",
	makanWhen: ""
};
var PLATFORM_LABEL = {
	"": "Online",
	teams: "Teams",
	zoom: "Zoom",
	skype: "Skype",
	meet: "Google Meet",
	webex: "Webex",
	other: "Online"
};
function cleanMeetingUrl(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
	try {
		const url = new URL(withScheme);
		if (url.protocol !== "https:" && url.protocol !== "http:") return "";
		return url.toString().slice(0, 300);
	} catch {
		return "";
	}
}
function placeSummary(place) {
	const physical = [
		place.venueName,
		place.room,
		place.address
	].map((part) => part.trim()).filter(Boolean).join(" · ");
	const online = place.meetingUrl ? PLATFORM_LABEL[place.platform] : place.platform ? PLATFORM_LABEL[place.platform] : "";
	if (place.format === "online") return online || "Online";
	if (place.format === "hybrid") return [physical || "Hybrid", online].filter(Boolean).join(" · ");
	return physical;
}
function sgtHour(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return 12;
	return (date.getUTCHours() + 8) % 24;
}
function mealFollowOn(place, startsAt, durationMin) {
	const start = sgtHour(startsAt);
	const end = (start + Math.max(1, Math.round(durationMin / 60))) % 24;
	if (place.makanWhen === "before" || place.makanWhen !== "after" && start < 11) return {
		title: `${start < 11 ? "Breakfast" : "Makan"} before this?`,
		note: place.format === "online" && !place.address ? "Online meeting. Choose where to base the search." : "Leave time to walk there and still start on time.",
		label: "Find something nearby"
	};
	return {
		title: `${end < 11 ? "Breakfast" : end < 16 ? "Lunch" : end < 21 ? "Dinner" : "Supper"} after this?`,
		note: place.format === "online" && !place.address ? "Online meeting. Choose where to base the search." : "After it ends, near the meeting.",
		label: "Find makan nearby"
	};
}
//#endregion
export { PLATFORM_LABEL as a, placeSummary as c, PLATFORMS as i, FORMATS as n, cleanMeetingUrl as o, MAKAN_WHEN as r, mealFollowOn as s, EMPTY_PLACE as t };
