//#region node_modules/.nitro/vite/services/ssr/assets/dating-invite-DIfg4EzO.js
var INVITE_SLUG = /^[A-Za-z0-9]{8,16}$/;
var SLUG_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateInviteSlug(length = 12) {
	const values = new Uint32Array(length);
	crypto.getRandomValues(values);
	const slug = Array.from(values, (value) => SLUG_ALPHABET[value % 62]).join("");
	if (!INVITE_SLUG.test(slug)) throw new Error(`Generated invalid invite slug: ${slug}`);
	return slug;
}
function ensureInviteSlug(value) {
	const incoming = typeof value === "string" ? value : "";
	const slug = INVITE_SLUG.test(incoming) ? incoming : generateInviteSlug();
	if (!INVITE_SLUG.test(slug)) throw new Error(`Generated invalid invite slug: ${slug}`);
	return slug;
}
function publicInviteUrl(slug) {
	return `${inviteOrigin()}/date/${slug}`;
}
function plannerInviteUrl(token) {
	return `${inviteOrigin()}/date/manage/${token}`;
}
function inviteOrigin() {
	return typeof window === "undefined" ? "" : window.location.origin;
}
function inviteUrlIsLocal(url) {
	return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(url);
}
var INVITE_TONES = [
	"minimal",
	"warm",
	"playful",
	"romantic"
];
var DATING_INVITES = "kairosDatingInvites";
var LEGACY_TOKENS = "kairosDatingPlannerTokens";
var LEGACY_SLUGS = "kairosDatingPlannerSlugs";
var PLAN_KEY = "kairos-dating-plan";
var PLAN_ID_KEY = "kairosDatingPlanId";
function saveDatingPlanId(planId) {
	if (typeof window === "undefined" || !INVITE_SLUG.test(planId)) return;
	localStorage.setItem(PLAN_ID_KEY, planId);
}
function readDatingPlanId() {
	if (typeof window === "undefined") return "";
	try {
		const value = localStorage.getItem(PLAN_ID_KEY) ?? "";
		return INVITE_SLUG.test(value) ? value : "";
	} catch {
		return "";
	}
}
function readJsonRecord(key) {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(key);
		const parsed = raw ? JSON.parse(raw) : {};
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
function cleanStored(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	if (!INVITE_SLUG.test(row.plannerToken ?? "")) return null;
	const status = row.status === "sounds_good" || row.status === "alternate_time_requested" || row.status === "revoked" || row.status === "pending" ? row.status : void 0;
	return {
		plannerToken: row.plannerToken ?? "",
		inviteSlug: INVITE_SLUG.test(row.inviteSlug ?? "") ? row.inviteSlug ?? "" : "",
		date: typeof row.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(row.date) ? row.date : void 0,
		title: typeof row.title === "string" ? row.title.slice(0, 80) : void 0,
		area: typeof row.area === "string" ? row.area.slice(0, 80) : void 0,
		startMin: typeof row.startMin === "number" && Number.isFinite(row.startMin) ? row.startMin : void 0,
		endMin: typeof row.endMin === "number" && Number.isFinite(row.endMin) ? row.endMin : void 0,
		status
	};
}
function readDatingInvites() {
	const parsed = readJsonRecord(DATING_INVITES);
	const book = {};
	for (const [planId, value] of Object.entries(parsed)) {
		const clean = cleanStored(value);
		if (planId && clean) book[planId] = clean;
	}
	const legacy = readJsonRecord(LEGACY_TOKENS);
	const legacySlugs = readJsonRecord(LEGACY_SLUGS);
	let dirty = false;
	for (const [planId, token] of Object.entries(legacy)) {
		if (!planId || typeof token !== "string" || !INVITE_SLUG.test(token) || book[planId]) continue;
		const slug = legacySlugs[token];
		book[planId] = {
			plannerToken: token,
			inviteSlug: typeof slug === "string" && INVITE_SLUG.test(slug) ? slug : ""
		};
		dirty = true;
	}
	if (dirty && typeof window !== "undefined") localStorage.setItem(DATING_INVITES, JSON.stringify(book));
	return book;
}
function readDatingInviteLink(planId) {
	if (!planId) return null;
	return readDatingInvites()[planId] ?? null;
}
function planIdForPlannerToken(token) {
	if (!INVITE_SLUG.test(token)) return "";
	const book = readDatingInvites();
	return Object.keys(book).find((planId) => book[planId]?.plannerToken === token) ?? "";
}
function saveDatingInviteLink(planId, record) {
	if (typeof window === "undefined" || !planId || !INVITE_SLUG.test(record.plannerToken)) return;
	if (record.inviteSlug && !INVITE_SLUG.test(record.inviteSlug)) return;
	const book = readDatingInvites();
	const prev = book[planId];
	book[planId] = {
		...prev,
		...record,
		plannerToken: record.plannerToken,
		inviteSlug: record.inviteSlug || prev?.inviteSlug || "",
		date: prev?.date || record.date,
		status: record.status ?? prev?.status
	};
	localStorage.setItem(DATING_INVITES, JSON.stringify(book));
}
/** Remember the reply. sounds_good confirms the plan already saved for that date. It never moves the date. */
function rememberDatingReply(planId, status, patch = {}) {
	const current = readDatingInviteLink(planId);
	if (!current) return;
	const next = {
		...current,
		title: patch.title || current.title,
		area: patch.area || current.area,
		startMin: current.startMin ?? patch.startMin,
		endMin: current.endMin ?? patch.endMin,
		inviteSlug: patch.inviteSlug && INVITE_SLUG.test(patch.inviteSlug) ? patch.inviteSlug : current.inviteSlug,
		date: current.date || (patch.date && /^\d{4}-\d{2}-\d{2}$/.test(patch.date) ? patch.date : void 0),
		status
	};
	saveDatingInviteLink(planId, next);
	if (status !== "sounds_good" || !next.date || typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(PLAN_KEY);
		if (!raw) return;
		const plan = JSON.parse(raw);
		if (!plan || plan.date !== next.date || plan.confirmed) return;
		localStorage.setItem(PLAN_KEY, JSON.stringify({
			...plan,
			confirmed: true
		}));
	} catch {}
}
function readConfirmedDating(date) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
	const match = Object.values(readDatingInvites()).find((item) => item.status === "sounds_good" && item.date === date);
	if (!match) return null;
	const startMin = match.startMin ?? 1140;
	return {
		title: match.title || "Date",
		area: match.area || "",
		startMin,
		endMin: Math.max(match.endMin ?? startMin + 120, startMin + 30),
		sourceId: match.inviteSlug || match.plannerToken
	};
}
function invitationStatusLabel(status) {
	if (status === "sounds_good") return "✓ I'M UP FOR IT";
	if (status === "alternate_time_requested") return "ANOTHER TIME REQUESTED";
	if (status === "revoked") return "INVITATION CANCELLED";
	return "SENT · WAITING FOR REPLY";
}
function buildShareMessage(input) {
	const name = input.name.trim();
	const note = input.note.trim().replace(/\s+/g, " ");
	const place = input.visibility === "mystery" ? "" : input.firstStop.trim();
	const lines = [];
	if (name && note) {
		const spoken = note.charAt(0).toLowerCase() + note.slice(1);
		lines.push(`Hey ${name} — ${spoken.replace(/[.]+$/, "")}.`);
	} else if (note) lines.push(/[.!?]$/.test(note) ? note : `${note}.`);
	else if (input.visibility === "mystery") lines.push(`Keeping most of ${input.weekday} a surprise.`);
	else if (name) lines.push(`Hey ${name} — thought this could be nice.`);
	else if (/friday/i.test(input.weekday)) lines.push("Free Friday evening? I have an idea.");
	else lines.push(`Made a little plan for ${input.weekday}.`);
	if (input.visibility === "mystery") {
		lines.push(`${input.time} · ${input.area}`);
		lines.push(input.duration);
	} else if (place) {
		lines.push(`${input.weekday} · ${input.time} · ${input.area}`);
		lines.push(place);
	} else lines.push(`${input.weekday} · ${input.time} · ${input.area}`);
	lines.push(input.url);
	return lines.join("\n");
}
function onlyRecipientShare(text) {
	return text.split("\n").filter((line) => !/\/date\/manage\//.test(line)).join("\n").trim();
}
function withShareUrl(text, url) {
	const clean = text.replace(/\s+$/g, "").trim();
	if (!url || clean.includes(url)) return clean;
	return `${clean}\n${url}`;
}
function publicArea(label) {
	const clean = label.trim();
	if (!clean || /^home$/i.test(clean) || /current location/i.test(clean)) return "Somewhere easy to meet";
	return clean.slice(0, 80);
}
function durationLabel(span) {
	if (span === "quick") return "About 2 hours";
	if (span === "full") return "Most of the day";
	return "Around 3 hours";
}
function dressLabel(formality) {
	if (formality === "casual") return "Casual";
	if (formality === "dress") return "A little dressed up";
	return "Smart casual";
}
var FIRST = /* @__PURE__ */ new Set(["first", "casual"]);
function eveningWhen(when) {
	if (/dinner|night|sunset/i.test(when)) return true;
	const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(when);
	if (!match) return false;
	const hour = Number(match[1]);
	if (match[3] === "AM" || hour === 12) return false;
	return hour >= 5;
}
function draftInvitation(input) {
	const first = FIRST.has(input.dateType);
	const area = input.area;
	const evening = eveningWhen(input.when);
	if (input.tone === "minimal") return {
		title: `${input.weekday} · ${area}`,
		message: first ? "Dinner, and one optional second stop. Low planning." : `${evening ? "Dinner" : "The plan"}, then whatever still feels easy.`
	};
	if (input.tone === "playful") return {
		title: first ? `${input.weekday} evening · ${area}` : `${input.weekday} · ${area}`,
		message: first ? "Dinner, and one optional second stop if we're still talking. Easy to leave, easy to stay." : "Dinner somewhere new, then a walk if the weather behaves."
	};
	if (input.tone === "romantic" && !first) return {
		title: `${input.weekday} night`,
		message: "Dinner somewhere new, then a little time after if the evening is going well."
	};
	if (first) return {
		title: `${input.weekday} evening · ${area}`,
		message: "Somewhere easy to talk, not too formal, and not too much planning required."
	};
	return {
		title: evening ? `A ${input.weekday} evening for two` : `${input.weekday} for two`,
		message: "I thought this could be a nice way to spend the time. Dinner first, then somewhere nearby if we feel like it."
	};
}
function inviteFooter(mark) {
	if (mark === "吉") return "月老 gives this one a quiet nod · 吉";
	return "Timing looks good.";
}
//#endregion
export { withShareUrl as C, saveDatingPlanId as S, readConfirmedDating as _, dressLabel as a, rememberDatingReply as b, generateInviteSlug as c, inviteUrlIsLocal as d, onlyRecipientShare as f, publicInviteUrl as g, publicArea as h, draftInvitation as i, invitationStatusLabel as l, plannerInviteUrl as m, INVITE_TONES as n, durationLabel as o, planIdForPlannerToken as p, buildShareMessage as r, ensureInviteSlug as s, INVITE_SLUG as t, inviteFooter as u, readDatingInviteLink as v, saveDatingInviteLink as x, readDatingPlanId as y };
