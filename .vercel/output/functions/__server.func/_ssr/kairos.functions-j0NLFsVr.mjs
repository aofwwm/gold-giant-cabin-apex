import { a as literal, d as union, l as string, n as array, s as object, t as _enum } from "../_libs/zod.mjs";
import { a as missionSchema } from "./mission-DOaVQo-M.mjs";
import { i as PLATFORMS, n as FORMATS, r as MAKAN_WHEN } from "./place-Cj_BvgPc.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kairos.functions-j0NLFsVr.js
function parse(schema, input) {
	const result = schema.safeParse(input);
	if (!result.success) throw new Error(result.error.issues[0]?.message ?? "Check that and try again");
	return result.data;
}
var localTime = string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Check the date and time");
var codeSchema = string().trim().regex(/^[a-zA-Z0-9]{4,12}$/, "That code does not look right").transform((value) => value.toLowerCase());
var nicknameSchema = string().trim().min(1, "Add a nickname").max(24, "Nickname is too long").refine((value) => !value.includes("@"), "Use a nickname, not an email").refine((value) => !/[\u0000-\u001f]/.test(value), "That nickname will not print");
var CreateInput = object({
	title: string().trim().min(2, "Give it a name").max(180, "Keep the purpose to a sentence or two"),
	kind: _enum(["meeting", "makan"]),
	durationMin: union([
		literal(30),
		literal(45),
		literal(60),
		literal(90),
		literal(120)
	]),
	category: _enum([
		"",
		"supper",
		"pickle",
		"board",
		"drink",
		"neighbourhood"
	]),
	slots: array(object({
		startsAt: localTime,
		label: string().trim().max(80).optional()
	})).max(6, "Six times is enough drama"),
	anchorAt: string().optional(),
	mission: missionSchema.optional(),
	missionSource: _enum(["grok", "rules"]).optional(),
	place: object({
		format: _enum(FORMATS),
		venueName: string().trim().max(80).optional().default(""),
		room: string().trim().max(80).optional().default(""),
		address: string().trim().max(160).optional().default(""),
		platform: _enum(PLATFORMS).optional().default(""),
		meetingUrl: string().trim().max(300).optional().default(""),
		makanWhen: _enum(MAKAN_WHEN).optional().default("")
	}).optional()
});
var fetchEvent_createServerFn_handler = createServerRpc({
	id: "6f1f13049f815a5a6d9513233a1231cddc1e40d5eab2008d00eafc033beb6912",
	name: "fetchEvent",
	filename: "src/lib/kairos.functions.ts"
}, (opts) => fetchEvent.__executeServer(opts));
var fetchEvent = createServerFn({ method: "GET" }).validator((input) => parse(object({ code: codeSchema }), input)).handler(fetchEvent_createServerFn_handler, async ({ data }) => {
	const { loadEvent } = await import("./kairos.functions.server-C6w-CO8i.mjs").then((n) => n.t);
	return loadEvent(data.code);
});
var createEvent_createServerFn_handler = createServerRpc({
	id: "ec4d578cf42812aca08340fd31123882787c7c5df0b8f166ab4f87950ea28bf7",
	name: "createEvent",
	filename: "src/lib/kairos.functions.ts"
}, (opts) => createEvent.__executeServer(opts));
var createEvent = createServerFn({ method: "POST" }).validator((input) => parse(CreateInput, input)).handler(createEvent_createServerFn_handler, async ({ data }) => {
	const { createEvent: create } = await import("./kairos.functions.server-C6w-CO8i.mjs").then((n) => n.t);
	return create(data);
});
var castVote_createServerFn_handler = createServerRpc({
	id: "c6960ff97f5671bb624eac0552b9590e04c759f34804057ba74bbd82c5e06659",
	name: "castVote",
	filename: "src/lib/kairos.functions.ts"
}, (opts) => castVote.__executeServer(opts));
var castVote = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	slotId: string().trim().min(6).max(16),
	nickname: nicknameSchema,
	choice: _enum([
		"love",
		"yes",
		"soft",
		"no"
	])
}), input)).handler(castVote_createServerFn_handler, async ({ data }) => {
	const { castVote: vote } = await import("./kairos.functions.server-C6w-CO8i.mjs").then((n) => n.t);
	return vote(data);
});
var addSlot_createServerFn_handler = createServerRpc({
	id: "e5a59f19c24c8c7088f3614fd97dc86388efd47728c06f7862ee338eba0038b5",
	name: "addSlot",
	filename: "src/lib/kairos.functions.ts"
}, (opts) => addSlot.__executeServer(opts));
var addSlot = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	startsAt: localTime,
	label: string().trim().max(80).optional()
}), input)).handler(addSlot_createServerFn_handler, async ({ data }) => {
	const { addSlot: add } = await import("./kairos.functions.server-C6w-CO8i.mjs").then((n) => n.t);
	return add(data);
});
var addComment_createServerFn_handler = createServerRpc({
	id: "0581028e42d6e834fe699238364d4fe812c6ce3353b109fe02a156926b527085",
	name: "addComment",
	filename: "src/lib/kairos.functions.ts"
}, (opts) => addComment.__executeServer(opts));
var addComment = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	nickname: nicknameSchema,
	body: string().trim().min(1, "Write a short note").max(180, "Keep the slip short")
}), input)).handler(addComment_createServerFn_handler, async ({ data }) => {
	const { addComment: add } = await import("./kairos.functions.server-C6w-CO8i.mjs").then((n) => n.t);
	return add(data);
});
var consultOracle_createServerFn_handler = createServerRpc({
	id: "2744c2fe57e760f93eceaa845f79e4da2b74bb428973626f91b7bee796d3235a",
	name: "consultOracle",
	filename: "src/lib/kairos.functions.ts"
}, (opts) => consultOracle.__executeServer(opts));
var consultOracle = createServerFn({ method: "POST" }).validator((input) => parse(object({ code: codeSchema }), input)).handler(consultOracle_createServerFn_handler, async ({ data }) => {
	const { consultOracle: consult } = await import("./kairos.functions.server-C6w-CO8i.mjs").then((n) => n.t);
	return consult(data);
});
var spinVenue_createServerFn_handler = createServerRpc({
	id: "210bbbdbe9f24a08f76680fba0e1384f0e36f15a0cc304d6065ef40b155e6182",
	name: "spinVenue",
	filename: "src/lib/kairos.functions.ts"
}, (opts) => spinVenue.__executeServer(opts));
var spinVenue = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	category: _enum([
		"supper",
		"pickle",
		"board",
		"drink",
		"neighbourhood"
	]),
	startsAt: string().optional()
}), input)).handler(spinVenue_createServerFn_handler, async ({ data }) => {
	const { spinVenue: spin } = await import("./kairos.functions.server-C6w-CO8i.mjs").then((n) => n.t);
	return spin(data);
});
//#endregion
export { addComment_createServerFn_handler, addSlot_createServerFn_handler, castVote_createServerFn_handler, consultOracle_createServerFn_handler, createEvent_createServerFn_handler, fetchEvent_createServerFn_handler, spinVenue_createServerFn_handler };
