import { c as record, l as string, n as array, o as number, r as boolean, s as object, t as _enum } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { s as ensureInviteSlug, t as INVITE_SLUG } from "./dating-invite-DIfg4EzO.mjs";
import { n as DATE_TYPES, r as DATE_VIBES, t as DATE_FOODS } from "./dating-DQG0N1wV.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dating.functions-Cs9jtoNy.js
var brief = object({
	dateType: _enum(DATE_TYPES),
	date: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	whenLabel: string().max(40).optional().default(""),
	startMin: number().int().min(360).max(1320),
	span: _enum([
		"quick",
		"half",
		"full"
	]),
	budget: number().int().min(0).max(500),
	freeOnly: boolean(),
	latitude: number(),
	longitude: number(),
	area: string().trim().min(2).max(80),
	originAddress: string().max(160).optional().default(""),
	originProvider: string().max(40).optional().default(""),
	originId: string().max(80).optional().default(""),
	maxTravel: number().int().min(15).max(120),
	travelMode: _enum([
		"drive",
		"walk",
		"ride",
		"transit"
	]),
	setting: _enum([
		"indoor",
		"outdoor",
		"either",
		"mix"
	]),
	vibes: array(_enum(DATE_VIBES)).max(8),
	foods: array(_enum(DATE_FOODS)).max(8),
	pressure: _enum([
		"low",
		"balanced",
		"memorable"
	]),
	formality: _enum([
		"casual",
		"smart",
		"dress"
	]),
	alcohol: _enum([
		"any",
		"none",
		"ok"
	]),
	crowd: _enum([
		"avoid",
		"ok",
		"lively"
	]),
	diets: array(string().max(20)).max(6).optional().default([]),
	goal: string().max(40).optional().default(""),
	text: string().max(500).optional().default(""),
	rejected: array(string().max(120)).max(48).optional().default([]),
	rejectedVenues: array(string().max(120)).max(48).optional().default([]),
	seen: array(string().max(80)).max(24).optional().default([]),
	spin: number().int().min(0).max(24).optional().default(0),
	tightSecondLeg: boolean().optional().default(false),
	avoid: array(string().max(40)).max(6).optional().default([]),
	locked: array(object({
		placeId: string().max(80),
		title: string().max(80),
		address: string().max(160),
		latitude: number(),
		longitude: number(),
		setting: _enum(["indoor", "outdoor"]),
		kind: _enum([
			"meal",
			"cafe",
			"scenic",
			"activity"
		])
	})).max(4).optional().default([])
});
var planDate_createServerFn_handler = createServerRpc({
	id: "e29ccccefb8dd142cc60e045b14a25e2bda8a6944ffba918c4e2419e7aeed49a",
	name: "planDate",
	filename: "src/lib/dating.functions.ts"
}, (opts) => planDate.__executeServer(opts));
var planDate = createServerFn({ method: "POST" }).validator((input) => brief.parse(input)).handler(planDate_createServerFn_handler, async ({ data }) => {
	const { searchDating } = await import("./dating.server-CkKxdbA_.mjs");
	return searchDating({
		...data,
		whenLabel: data.whenLabel ?? "",
		diets: data.diets ?? [],
		goal: data.goal ?? "",
		text: data.text ?? "",
		rejected: data.rejected ?? [],
		rejectedVenues: data.rejectedVenues ?? [],
		tightSecondLeg: data.tightSecondLeg ?? false,
		avoid: data.avoid ?? [],
		locked: data.locked ?? [],
		seen: data.seen ?? [],
		spin: data.spin ?? 0
	});
});
var parseDateBrief_createServerFn_handler = createServerRpc({
	id: "94b8ce4b46056e1390fbae660704627cae72f500c56f41f58b85a70bd74e418a",
	name: "parseDateBrief",
	filename: "src/lib/dating.functions.ts"
}, (opts) => parseDateBrief.__executeServer(opts));
var parseDateBrief = createServerFn({ method: "POST" }).validator((input) => object({
	text: string().max(500),
	today: string().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(input)).handler(parseDateBrief_createServerFn_handler, async ({ data }) => {
	const { parseDatingIntent } = await import("./dating.server-CkKxdbA_.mjs");
	return parseDatingIntent(data.text, data.today);
});
var saveDatingPlan_createServerFn_handler = createServerRpc({
	id: "2dd9364caf902479557461692b971dd763efa6d59ff66a074192c855a19b343b",
	name: "saveDatingPlan",
	filename: "src/lib/dating.functions.ts"
}, (opts) => saveDatingPlan.__executeServer(opts));
var saveDatingPlan = createServerFn({ method: "POST" }).validator((input) => object({
	title: string().min(2).max(80),
	dateType: string().max(20),
	budget: number().int(),
	travelMode: string().max(20),
	area: string().max(80),
	startTime: string().max(8),
	duration: string().max(20),
	preferences: record(string(), string()).optional().default({}),
	datingScore: number().int().nullable(),
	stops: array(object({
		sequence: number().int(),
		stopType: string().max(20),
		title: string().max(80),
		address: string().max(160),
		latitude: number(),
		longitude: number(),
		startTime: string().max(12),
		endTime: string().max(12),
		estimatedCost: number().nullable(),
		indoorOutdoor: string().max(12),
		sourceUrl: string().max(200).optional().default(""),
		sourceType: string().max(20),
		locked: boolean()
	})).max(6)
}).parse(input)).handler(saveDatingPlan_createServerFn_handler, async ({ data }) => {
	const { getSupabase, supabaseConfigured } = await import("./supabase-BKxuSUOP.mjs").then((n) => n.r).then((n) => n.r);
	if (!supabaseConfigured()) return {
		saved: false,
		reason: "supabase"
	};
	const supabase = getSupabase();
	const inserted = await supabase.from("dating_plans").insert({
		title: data.title,
		date_type: data.dateType,
		budget: data.budget,
		travel_mode: data.travelMode,
		area: data.area,
		start_time: data.startTime,
		duration: data.duration,
		preferences: data.preferences,
		dating_score: data.datingScore
	}).select("id").single();
	if (inserted.error || !inserted.data?.id) return {
		saved: false,
		reason: "table"
	};
	await supabase.from("dating_plan_stops").insert(data.stops.map((stop) => ({
		plan_id: inserted.data.id,
		sequence: stop.sequence,
		stop_type: stop.stopType,
		title: stop.title,
		address: stop.address,
		latitude: stop.latitude,
		longitude: stop.longitude,
		start_time: stop.startTime,
		end_time: stop.endTime,
		estimated_cost: stop.estimatedCost,
		indoor_outdoor: stop.indoorOutdoor,
		source_url: stop.sourceUrl,
		source_type: stop.sourceType,
		locked: stop.locked
	})));
	return {
		saved: true,
		id: inserted.data.id
	};
});
var inviteInput = object({
	title: string().min(2).max(80),
	whenLabel: string().max(60),
	area: string().max(80),
	message: string().max(280),
	note: string().max(180).optional().default(""),
	duration: string().max(40),
	dress: string().max(40),
	vibe: string().max(80),
	tone: _enum([
		"minimal",
		"warm",
		"playful",
		"romantic"
	]),
	visibility: _enum([
		"full",
		"first",
		"mystery"
	]),
	recipientName: string().max(40).optional().default(""),
	dateType: string().max(20),
	stops: array(object({
		slot: string().max(40),
		title: string().max(80),
		address: string().max(160),
		time: string().max(40),
		setting: string().max(12)
	})).max(8),
	footer: string().max(80),
	slug: string().regex(INVITE_SLUG),
	editToken: string().max(80).optional().default("")
});
function parseInviteInput(input) {
	const source = input && typeof input === "object" ? { ...input } : {};
	const incoming = typeof source.slug === "string" ? source.slug : "";
	console.log("[INVITE] payload before validation", {
		...source,
		slug: incoming
	});
	console.log("[INVITE] slug", incoming);
	console.log("[INVITE] slug length", incoming.length);
	console.log("[INVITE] regex passes", INVITE_SLUG.test(incoming));
	const slug = ensureInviteSlug(incoming);
	console.log("[INVITE] slug used", slug);
	console.log("[INVITE] slug used length", slug.length);
	console.log("[INVITE] regex passes", INVITE_SLUG.test(slug));
	return inviteInput.parse({
		...source,
		slug
	});
}
var createDatingInvite_createServerFn_handler = createServerRpc({
	id: "06c6bf4aeb71caf45227cc48e8112f0855ef3126743b751fdbe46322f17f924f",
	name: "createDatingInvite",
	filename: "src/lib/dating.functions.ts"
}, (opts) => createDatingInvite.__executeServer(opts));
var createDatingInvite = createServerFn({ method: "POST" }).validator(parseInviteInput).handler(createDatingInvite_createServerFn_handler, async ({ data }) => {
	const { saveDatingInvite } = await import("./dating-invite.server-IMenVABN.mjs");
	return await saveDatingInvite({
		...data,
		note: data.note ?? "",
		recipientName: data.recipientName ?? "",
		slug: data.slug ?? "",
		status: "pending",
		replyNote: "",
		replyTimes: [],
		updatedAt: ""
	}, data.editToken ?? "");
});
var fetchDatingInvite_createServerFn_handler = createServerRpc({
	id: "fd81c138688ef8bc5749bf641df4fa47829c6fbf26bbd3ab758428b95965c4d0",
	name: "fetchDatingInvite",
	filename: "src/lib/dating.functions.ts"
}, (opts) => fetchDatingInvite.__executeServer(opts));
var fetchDatingInvite = createServerFn({ method: "POST" }).validator((input) => object({ slug: string().min(1).max(64) }).parse(input)).handler(fetchDatingInvite_createServerFn_handler, async ({ data }) => {
	const { readPublicInvite } = await import("./dating-invite.server-IMenVABN.mjs");
	return readPublicInvite(data.slug);
});
var fetchPlannerDatingInvite_createServerFn_handler = createServerRpc({
	id: "43bcd84bbb0af6838ff1e3828448b225d2dc896f927265487bb8d84a6096b871",
	name: "fetchPlannerDatingInvite",
	filename: "src/lib/dating.functions.ts"
}, (opts) => fetchPlannerDatingInvite.__executeServer(opts));
var fetchPlannerDatingInvite = createServerFn({ method: "POST" }).validator((input) => object({ plannerToken: string().regex(INVITE_SLUG) }).parse(input)).handler(fetchPlannerDatingInvite_createServerFn_handler, async ({ data }) => {
	const { readPlannerInvite } = await import("./dating-invite.server-IMenVABN.mjs");
	return readPlannerInvite(data.plannerToken);
});
var revokeDatingInvite_createServerFn_handler = createServerRpc({
	id: "bfc62d71ad0086150773f239f6f586f6631f11bb29af6c364067720ec59db49f",
	name: "revokeDatingInvite",
	filename: "src/lib/dating.functions.ts"
}, (opts) => revokeDatingInvite.__executeServer(opts));
var revokeDatingInvite = createServerFn({ method: "POST" }).validator((input) => object({ plannerToken: string().regex(INVITE_SLUG) }).parse(input)).handler(revokeDatingInvite_createServerFn_handler, async ({ data }) => {
	const { revokePlannerInvite } = await import("./dating-invite.server-IMenVABN.mjs");
	return revokePlannerInvite(data.plannerToken);
});
var answerDatingInvite_createServerFn_handler = createServerRpc({
	id: "c535ac0301a1bf0f8991713b0033614c7606874c4f1eb4beb3a135128911a7ef",
	name: "answerDatingInvite",
	filename: "src/lib/dating.functions.ts"
}, (opts) => answerDatingInvite.__executeServer(opts));
var answerDatingInvite = createServerFn({ method: "POST" }).validator((input) => object({
	slug: string().regex(INVITE_SLUG),
	status: _enum(["sounds_good", "alternate_time_requested"]),
	note: string().max(280).optional().default(""),
	times: array(string().max(40)).max(3).optional().default([])
}).parse(input)).handler(answerDatingInvite_createServerFn_handler, async ({ data }) => {
	const { replyDatingInvite } = await import("./dating-invite.server-IMenVABN.mjs");
	return replyDatingInvite(data.slug, {
		status: data.status,
		note: data.note ?? "",
		times: data.times ?? []
	});
});
var polishDatingInvite_createServerFn_handler = createServerRpc({
	id: "efb727d2169e35057d727edd35d33aec4cd2fd8972b7ccc170e7e29e2f642139",
	name: "polishDatingInvite",
	filename: "src/lib/dating.functions.ts"
}, (opts) => polishDatingInvite.__executeServer(opts));
var polishDatingInvite = createServerFn({ method: "POST" }).validator((input) => object({
	tone: _enum([
		"minimal",
		"warm",
		"playful",
		"romantic"
	]),
	draft: string().max(280),
	note: string().max(180).optional().default(""),
	dateType: string().max(20)
}).parse(input)).handler(polishDatingInvite_createServerFn_handler, async ({ data }) => {
	const { suggestInviteLine } = await import("./dating-invite.server-IMenVABN.mjs");
	return { message: await suggestInviteLine({
		tone: data.tone,
		draft: data.draft,
		note: data.note ?? "",
		dateType: data.dateType
	}) };
});
//#endregion
export { answerDatingInvite_createServerFn_handler, createDatingInvite_createServerFn_handler, fetchDatingInvite_createServerFn_handler, fetchPlannerDatingInvite_createServerFn_handler, parseDateBrief_createServerFn_handler, planDate_createServerFn_handler, polishDatingInvite_createServerFn_handler, revokeDatingInvite_createServerFn_handler, saveDatingPlan_createServerFn_handler };
