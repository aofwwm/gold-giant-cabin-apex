//#region node_modules/.nitro/vite/services/ssr/assets/time-I2ZWfIie.js
var WEEKDAY = {
	Sun: 0,
	Mon: 1,
	Tue: 2,
	Wed: 3,
	Thu: 4,
	Fri: 5,
	Sat: 6
};
function sgtNow(from = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Singapore",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		weekday: "short",
		hourCycle: "h23"
	}).formatToParts(from);
	const g = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	return {
		y: Number(g.year),
		m: Number(g.month),
		d: Number(g.day),
		hour: Number(g.hour),
		minute: Number(g.minute),
		wd: WEEKDAY[g.weekday] ?? 0
	};
}
function pad(n) {
	return String(n).padStart(2, "0");
}
function addCalendarDays(y, m, d, days) {
	const dt = new Date(Date.UTC(y, m - 1, d + days));
	return {
		y: dt.getUTCFullYear(),
		m: dt.getUTCMonth() + 1,
		d: dt.getUTCDate()
	};
}
function weekdayOf(y, m, d) {
	return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}
function formatLocal(y, m, d, hour, minute) {
	return `${y}-${pad(m)}-${pad(d)}T${pad(hour)}:${pad(minute)}`;
}
/** `YYYY-MM-DDTHH:mm` interpreted as Asia/Singapore. */
function localSgtToIso(local) {
	if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) throw new Error("Check the date and time");
	const date = /* @__PURE__ */ new Date(`${local}:00+08:00`);
	if (Number.isNaN(date.getTime())) throw new Error("Check the date and time");
	return date.toISOString();
}
function assertReasonableIso(iso) {
	const t = new Date(iso).getTime();
	if (Number.isNaN(t)) throw new Error("Check the date and time");
	const now = Date.now();
	if (t < now - 1728e5) throw new Error("That hour has already left");
	if (t > now + 3456e7) throw new Error("The tong shu does not stock that year");
}
function isoToLocal(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Singapore",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(date);
	const g = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	return `${g.year}-${g.month}-${g.day}T${g.hour}:${g.minute}`;
}
function formatWhen(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "Unscheduled";
	return new Intl.DateTimeFormat("en-SG", {
		timeZone: "Asia/Singapore",
		weekday: "short",
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit"
	}).format(date);
}
function formatMoment(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "Unscheduled";
	return `${new Intl.DateTimeFormat("en-SG", {
		timeZone: "Asia/Singapore",
		weekday: "short",
		day: "numeric",
		month: "short"
	}).format(date)} · ${new Intl.DateTimeFormat("en-SG", {
		timeZone: "Asia/Singapore",
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	}).format(date).replace(/\bam\b/i, "AM").replace(/\bpm\b/i, "PM")}`;
}
function suggestMeetingSlots(from = /* @__PURE__ */ new Date()) {
	const now = sgtNow(from);
	const found = [];
	const push = (dayOffset, hour, minute) => {
		const date = addCalendarDays(now.y, now.m, now.d, dayOffset);
		const key = formatLocal(date.y, date.m, date.d, hour, minute);
		if (!found.includes(key)) found.push(key);
	};
	for (let i = 0; i < 12; i += 1) {
		const date = addCalendarDays(now.y, now.m, now.d, i);
		const wd = weekdayOf(date.y, date.m, date.d);
		if (wd === 0 || wd === 6) continue;
		if (i === 0 && (now.hour > 10 || now.hour === 10 && now.minute >= 30)) continue;
		push(i, 10, 30);
		break;
	}
	for (let i = 0; i < 12; i += 1) {
		const date = addCalendarDays(now.y, now.m, now.d, i);
		const wd = weekdayOf(date.y, date.m, date.d);
		if (wd === 0 || wd === 6) continue;
		if (i === 0 && now.hour >= 16) continue;
		push(i, 16, 0);
		break;
	}
	for (let i = 0; i < 14; i += 1) {
		const date = addCalendarDays(now.y, now.m, now.d, i);
		if (weekdayOf(date.y, date.m, date.d) !== 5) continue;
		if (i === 0 && now.hour >= 16) continue;
		push(i, 16, 0);
		break;
	}
	if (found.length < 2) {
		push(1, 10, 30);
		push(1, 16, 0);
	}
	return found.slice(0, 3);
}
function suggestSupper(from = /* @__PURE__ */ new Date()) {
	const now = sgtNow(from);
	const add = now.hour >= 17 ? 1 : 0;
	const date = addCalendarDays(now.y, now.m, now.d, add);
	return formatLocal(date.y, date.m, date.d, 19, 0);
}
function nextEveningIso(from = /* @__PURE__ */ new Date()) {
	return localSgtToIso(suggestSupper(from));
}
/** Outings should not inherit a 10:30 pitch slot. Keep 5–9pm; otherwise move to 7pm. */
function preferEvening(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return nextEveningIso();
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Singapore",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		hourCycle: "h23"
	}).formatToParts(date);
	const g = Object.fromEntries(parts.map((p) => [p.type, p.value]));
	let hour = Number(g.hour);
	if (hour === 24) hour = 0;
	if (hour >= 17 && hour <= 21) return date.toISOString();
	const y = Number(g.year);
	const m = Number(g.month);
	const d = Number(g.day);
	let candidate = localSgtToIso(formatLocal(y, m, d, 19, 0));
	if (new Date(candidate).getTime() < Date.now() + 27e5) {
		const next = addCalendarDays(y, m, d, 1);
		candidate = localSgtToIso(formatLocal(next.y, next.m, next.d, 19, 0));
	}
	return candidate;
}
//#endregion
export { isoToLocal as a, preferEvening as c, suggestSupper as d, formatWhen as i, sgtNow as l, assertReasonableIso as n, localSgtToIso as o, formatMoment as r, nextEveningIso as s, addCalendarDays as t, suggestMeetingSlots as u };
