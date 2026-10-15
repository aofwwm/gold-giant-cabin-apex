import { a as literal, d as union, l as string, n as array, o as number, r as boolean, s as object, t as _enum } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { i as PLACE_TYPES, n as CUISINE_OPTIONS, r as MORE_CUISINES } from "./coord-Cq5LMP_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coord.functions-5b4UFjim.js
var minutes = union([
	literal(5),
	literal(10),
	literal(15),
	literal(25)
]);
var cuisineEnum = _enum([...CUISINE_OPTIONS, ...MORE_CUISINES].map((item) => item.id));
var placeEnum = _enum(PLACE_TYPES.map((item) => item.id));
var findMakan_createServerFn_handler = createServerRpc({
	id: "5673e20680bdbc750f5973614a9c4a560c3764a69ee58983ea50386c4eb5f37e",
	name: "findMakan",
	filename: "src/lib/coord.functions.ts"
}, (opts) => findMakan.__executeServer(opts));
var findMakan = createServerFn({ method: "POST" }).validator((input) => object({
	text: string().trim().max(400).optional().default(""),
	areaId: string().trim().max(24).optional().default(""),
	address: string().trim().max(160).optional().default(""),
	groupSize: number().int().min(1).max(40).optional().default(4),
	minutes,
	budget: union([
		literal(0),
		literal(1),
		literal(2),
		literal(3)
	]).optional().default(0),
	dietary: _enum([
		"",
		"halal",
		"vegetarian",
		"vegan"
	]).optional().default(""),
	mood: _enum([
		"",
		"quick",
		"comfortable",
		"different",
		"coffee",
		"casual"
	]).optional().default(""),
	timing: _enum([
		"",
		"before",
		"after"
	]).optional().default(""),
	explain: boolean().optional().default(true),
	latitude: number().gte(-90).lte(90).nullable().optional(),
	longitude: number().gte(-180).lte(180).nullable().optional(),
	originSource: _enum([
		"",
		"meeting",
		"office",
		"home",
		"current",
		"choose"
	]).optional().default(""),
	originName: string().trim().max(80).optional().default(""),
	allowDistance: boolean().optional().default(false),
	cuisines: array(cuisineEnum).max(16).optional().default([]),
	placeTypes: array(placeEnum).max(5).optional().default([]),
	savedPlaces: array(object({
		id: string().trim().max(80),
		name: string().trim().max(80),
		address: string().trim().max(160).optional().default(""),
		latitude: number().gte(-90).lte(90),
		longitude: number().gte(-180).lte(180),
		cuisine: string().trim().max(80).optional().default(""),
		placeKind: string().trim().max(24).optional().default("")
	})).max(24).optional().default([])
}).parse(input)).handler(findMakan_createServerFn_handler, async ({ data }) => {
	const { searchMakan } = await import("./coord.server-CiNzmMuE.mjs");
	return searchMakan(data);
});
var findOuting_createServerFn_handler = createServerRpc({
	id: "37fc7d5a0be024cde92b4599293d57d082b8f05fd788adcc1d04db394f5620ba",
	name: "findOuting",
	filename: "src/lib/coord.functions.ts"
}, (opts) => findOuting.__executeServer(opts));
var findOuting = createServerFn({ method: "POST" }).validator((input) => object({
	text: string().trim().min(8).max(500),
	areaId: string().trim().max(24).optional().default(""),
	groupSize: number().int().min(2).max(80).optional().default(12),
	budget: number().int().min(0).max(200).optional().default(50),
	budgetMin: number().int().min(0).max(200).optional().default(0)
}).parse(input)).handler(findOuting_createServerFn_handler, async ({ data }) => {
	const { shapeOuting } = await import("./coord.server-CiNzmMuE.mjs");
	return shapeOuting(data);
});
//#endregion
export { findMakan_createServerFn_handler, findOuting_createServerFn_handler };
