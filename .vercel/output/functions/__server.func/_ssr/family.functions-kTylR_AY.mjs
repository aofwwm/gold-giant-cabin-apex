import { c as record, l as string, n as array, o as number, r as boolean, s as object, t as _enum } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { t as FAMILY_INTERESTS } from "./family-DnghGkQV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/family.functions-kTylR_AY.js
var pin = object({
	placeId: string().max(80),
	kind: _enum([
		"activity",
		"lunch",
		"dinner"
	]),
	title: string().max(80),
	address: string().max(160),
	latitude: number().gte(-90).lte(90),
	longitude: number().gte(-180).lte(180),
	setting: _enum([
		"indoor",
		"outdoor",
		""
	])
});
var brief = object({
	adults: number().int().min(1).max(8),
	ages: array(number().int().min(0).max(17)).max(6),
	when: string().trim().max(40).optional().default(""),
	date: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	location: string().trim().min(2).max(80),
	latitude: number().gte(-90).lte(90),
	longitude: number().gte(-180).lte(180),
	startAddress: string().trim().max(160).optional().default(""),
	endLabel: string().trim().min(2).max(80),
	endAddress: string().trim().max(160).optional().default(""),
	endLatitude: number().gte(-90).lte(90),
	endLongitude: number().gte(-180).lte(180),
	maxTravel: number().int().min(15).max(120),
	budget: number().int().min(0).max(500),
	freeOnly: boolean(),
	setting: _enum([
		"indoor",
		"outdoor",
		"either",
		"mix"
	]),
	interests: array(_enum(FAMILY_INTERESTS)).max(12),
	avoid: array(string().trim().max(40)).max(8).optional().default([]),
	toddler: boolean(),
	stroller: boolean(),
	mixedAge: boolean(),
	rainSafe: boolean(),
	wheelchair: boolean().optional().default(false),
	longWalk: boolean().optional().default(false),
	span: _enum([
		"short",
		"half",
		"full"
	]),
	pace: _enum([
		"relaxed",
		"balanced",
		"packed"
	]),
	travelMode: _enum([
		"drive",
		"transit",
		"ride",
		"walk"
	]),
	startMin: number().int().min(360).max(1200),
	endMin: number().int().min(420).max(1380),
	napStart: number().int().min(0).max(1440).nullable().optional().default(null),
	napEnd: number().int().min(0).max(1440).nullable().optional().default(null),
	booking: _enum([
		"any",
		"free",
		"nobook"
	]).optional().default("any"),
	rejected: array(string().max(80)).max(24).optional().default([]),
	locked: array(pin).max(8).optional().default([]),
	text: string().trim().max(500).optional().default("")
});
var planFamily_createServerFn_handler = createServerRpc({
	id: "58111672aec3173bfd11833461e7fb5ccbd2cc820f6a29108904fa740c9829e6",
	name: "planFamily",
	filename: "src/lib/family.functions.ts"
}, (opts) => planFamily.__executeServer(opts));
var planFamily = createServerFn({ method: "POST" }).validator((input) => brief.parse(input)).handler(planFamily_createServerFn_handler, async ({ data }) => {
	const { searchFamily } = await import("./family.server-Nh0QeptJ.mjs").then((n) => n.t).then((n) => n.t);
	return searchFamily({
		...data,
		avoid: data.avoid ?? [],
		wheelchair: data.wheelchair ?? false,
		longWalk: data.longWalk ?? false,
		napStart: data.napStart ?? null,
		napEnd: data.napEnd ?? null,
		booking: data.booking ?? "any",
		rejected: data.rejected ?? [],
		locked: data.locked ?? [],
		text: data.text ?? "",
		when: data.when ?? "",
		startAddress: data.startAddress ?? "",
		endAddress: data.endAddress ?? ""
	});
});
var savedStop = object({
	sequence: number().int().min(0).max(24),
	stopType: string().max(20),
	title: string().max(80),
	address: string().max(160),
	latitude: number().nullable(),
	longitude: number().nullable(),
	startTime: string().max(8),
	endTime: string().max(8),
	estimatedCost: number().nullable(),
	indoorOutdoor: string().max(12),
	sourceUrl: string().max(200).optional().default(""),
	sourceType: string().max(20),
	locked: boolean()
});
var saveFamilyPlan_createServerFn_handler = createServerRpc({
	id: "d152135fd1003f620179e775225ccea9ff59c9fc2a519e08c53098fdfbb07aff",
	name: "saveFamilyPlan",
	filename: "src/lib/family.functions.ts"
}, (opts) => saveFamilyPlan.__executeServer(opts));
var saveFamilyPlan = createServerFn({ method: "POST" }).validator((input) => object({
	title: string().trim().min(2).max(80),
	startDate: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	startTime: string().max(8),
	endTime: string().max(8),
	startLocation: string().max(80),
	endLocation: string().max(80),
	adults: number().int(),
	childAges: array(number()),
	budget: number().int(),
	travelMode: string().max(20),
	pace: string().max(20),
	interests: array(string()).max(12),
	preferences: record(string(), string()).optional().default({}),
	familyScore: number().int().nullable(),
	stops: array(savedStop).max(24)
}).parse(input)).handler(saveFamilyPlan_createServerFn_handler, async ({ data }) => {
	const { getSupabase, supabaseConfigured } = await import("./supabase-BKxuSUOP.mjs").then((n) => n.r).then((n) => n.r);
	if (!supabaseConfigured()) return {
		saved: false,
		reason: "supabase"
	};
	const supabase = getSupabase();
	const inserted = await supabase.from("family_plans").insert({
		title: data.title,
		start_date: data.startDate,
		start_time: data.startTime,
		end_time: data.endTime,
		start_location: data.startLocation,
		end_location: data.endLocation,
		adults: data.adults,
		child_ages: data.childAges,
		budget: data.budget,
		travel_mode: data.travelMode,
		pace: data.pace,
		interests: data.interests,
		preferences: data.preferences,
		family_score: data.familyScore
	}).select("id").single();
	if (inserted.error || !inserted.data?.id) return {
		saved: false,
		reason: "table"
	};
	const planId = inserted.data.id;
	if (data.stops.length) await supabase.from("family_plan_stops").insert(data.stops.map((stop) => ({
		plan_id: planId,
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
		id: planId
	};
});
//#endregion
export { planFamily_createServerFn_handler, saveFamilyPlan_createServerFn_handler };
