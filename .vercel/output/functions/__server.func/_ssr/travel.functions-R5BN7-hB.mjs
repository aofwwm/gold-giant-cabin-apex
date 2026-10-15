import { l as string, n as array, o as number, r as boolean, s as object, t as _enum, u as tuple } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as explicitChildAges, n as TRAVEL_STYLES, t as TRAVEL_INTERESTS } from "./travel-tYjUPdjH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/travel.functions-R5BN7-hB.js
var searchTravelDestinations_createServerFn_handler = createServerRpc({
	id: "9928ed1eb08bd6a5ed2352864af23adf4443cd8f837649a3eb55614a2d570af3",
	name: "searchTravelDestinations",
	filename: "src/lib/travel.functions.ts"
}, (opts) => searchTravelDestinations.__executeServer(opts));
var searchTravelDestinations = createServerFn({ method: "POST" }).validator((input) => object({ query: string().trim().min(2).max(80) }).parse(input)).handler(searchTravelDestinations_createServerFn_handler, async ({ data }) => {
	const { searchTravelDestinations: search } = await import("./travel.server-CtpmsciF.mjs");
	return search(data.query);
});
var area = object({
	name: string().trim().min(2).max(80),
	latitude: number().gte(-90).lte(90),
	longitude: number().gte(-180).lte(180),
	countryCode: string().trim().max(8).optional().default(""),
	bbox: tuple([
		number(),
		number(),
		number(),
		number()
	]).optional()
});
var brief = object({
	destination: string().trim().min(2).max(80),
	address: string().trim().max(160).optional().default(""),
	latitude: number().gte(-90).lte(90),
	longitude: number().gte(-180).lte(180),
	start: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	nights: number().int().min(1).max(90),
	adults: number().int().min(1).max(16),
	childAges: array(number().int().min(0).max(17)).max(6).optional().default([]),
	pace: _enum([
		"relaxed",
		"balanced",
		"full"
	]),
	move: _enum([
		"walk",
		"drive",
		"transit"
	]),
	budget: _enum([
		"simple",
		"mid",
		"splurge"
	]),
	interests: array(_enum(TRAVEL_INTERESTS)).max(7).optional().default([]),
	oneBase: boolean(),
	rejected: array(string().trim().max(80)).max(24).optional().default([]),
	lockedDates: array(string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(7).optional().default([]),
	salt: number().int().min(0).max(20).optional().default(0),
	areas: array(area).max(3).optional().default([]),
	mustVisit: array(string().trim().max(80)).max(8).optional().default([]),
	styles: array(_enum(TRAVEL_STYLES)).max(2).optional().default(["comfort"]),
	balance: _enum([
		"city",
		"balanced",
		"nature"
	]).optional().default("balanced"),
	firstVisit: boolean().optional().default(true),
	focus: _enum(["icons", "local"]).optional().default("icons"),
	foodPlanning: _enum([
		"minimal",
		"meals",
		"balanced",
		"feature"
	]).optional().default("balanced")
});
var resolveTravelHotel_createServerFn_handler = createServerRpc({
	id: "410e1484bb2bc15d4a4348fd9f181e1856bec4d560374eb6ffb9d4a30b7469e6",
	name: "resolveTravelHotel",
	filename: "src/lib/travel.functions.ts"
}, (opts) => resolveTravelHotel.__executeServer(opts));
var resolveTravelHotel = createServerFn({ method: "POST" }).validator((input) => object({
	query: string().trim().min(2).max(120),
	near: array(object({
		lat: number().gte(-90).lte(90),
		lng: number().gte(-180).lte(180)
	})).min(1).max(8)
}).parse(input)).handler(resolveTravelHotel_createServerFn_handler, async ({ data }) => {
	const { locateHotel } = await import("./travel.server-CtpmsciF.mjs");
	return locateHotel(data.query, data.near);
});
var planTrip_createServerFn_handler = createServerRpc({
	id: "760ec96b7cb1a76b7dcb6e3a99aff168eee1c02a9b36807735664993e67a8641",
	name: "planTrip",
	filename: "src/lib/travel.functions.ts"
}, (opts) => planTrip.__executeServer(opts));
var planTrip = createServerFn({ method: "POST" }).validator((input) => brief.parse(input)).handler(planTrip_createServerFn_handler, async ({ data }) => {
	const { planTravel } = await import("./travel.server-CtpmsciF.mjs");
	return planTravel({
		...data,
		address: data.address ?? "",
		childAges: explicitChildAges(data.childAges),
		interests: data.interests ?? [],
		rejected: data.rejected ?? [],
		lockedDates: data.lockedDates ?? [],
		salt: data.salt ?? 0,
		areas: data.areas ?? [],
		mustVisit: data.mustVisit ?? [],
		styles: data.styles ?? ["comfort"],
		balance: data.balance ?? "balanced",
		firstVisit: data.firstVisit !== false,
		focus: data.focus ?? "icons",
		foodPlanning: data.foodPlanning ?? "balanced"
	});
});
var refreshPlacePhoto_createServerFn_handler = createServerRpc({
	id: "e24a43f6c8fc99feab3616ba6c1a2e4563263f5e332556fd744ff263c6fdadec",
	name: "refreshPlacePhoto",
	filename: "src/lib/travel.functions.ts"
}, (opts) => refreshPlacePhoto.__executeServer(opts));
var refreshPlacePhoto = createServerFn({ method: "POST" }).validator((input) => object({
	name: string().trim().max(120).optional().default(""),
	localName: string().trim().max(120).optional().default(""),
	wikidataId: string().trim().max(16).optional().default(""),
	fileTitle: string().trim().max(300).optional().default(""),
	imagePage: string().trim().max(500).optional().default(""),
	osmFile: string().trim().max(300).optional().default(""),
	commonsCategory: string().trim().max(200).optional().default(""),
	wikipedia: string().trim().max(200).optional().default(""),
	failedUrl: string().trim().max(500).optional().default(""),
	rejectFileTitles: array(string().trim().max(300)).max(8).optional().default([]),
	category: string().trim().max(40).optional().default("")
}).parse(input)).handler(refreshPlacePhoto_createServerFn_handler, async ({ data }) => {
	const { resolvePlacePhoto } = await import("./travel-photo.server-Ctjtfrfe.mjs");
	const { isCommercialCategory } = await import("./travel-photo-CU-qA7uW.mjs").then((n) => n.p);
	const qid = /^Q\d+$/.test(data.wikidataId) ? data.wikidataId : "";
	return resolvePlacePhoto({
		...data,
		wikidataId: qid,
		commercial: isCommercialCategory(data.category)
	});
});
var routeTripDay_createServerFn_handler = createServerRpc({
	id: "0d49d77cf5025214d073066ef199643849328be86d0af8373a5deece2a95d606",
	name: "routeTripDay",
	filename: "src/lib/travel.functions.ts"
}, (opts) => routeTripDay.__executeServer(opts));
var routeTripDay = createServerFn({ method: "POST" }).validator((input) => object({
	move: _enum([
		"walk",
		"drive",
		"transit"
	]),
	points: array(object({
		lat: number().gte(-90).lte(90),
		lng: number().gte(-180).lte(180)
	})).min(2).max(8)
}).parse(input)).handler(routeTripDay_createServerFn_handler, async ({ data }) => {
	const { routeTravelDay } = await import("./travel.server-CtpmsciF.mjs");
	return routeTravelDay(data.move, data.points);
});
//#endregion
export { planTrip_createServerFn_handler, refreshPlacePhoto_createServerFn_handler, resolveTravelHotel_createServerFn_handler, routeTripDay_createServerFn_handler, searchTravelDestinations_createServerFn_handler };
