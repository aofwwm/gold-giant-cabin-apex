import { l as string, n as array, o as number, s as object } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/today.functions-ifEoK67d.js
var todayWeather_createServerFn_handler = createServerRpc({
	id: "fed238c535e248a1dce1402c7c70a342edbd7f2b5cee70ea9d6b47e50f2746b1",
	name: "todayWeather",
	filename: "src/lib/today.functions.ts"
}, (opts) => todayWeather.__executeServer(opts));
var todayWeather = createServerFn({ method: "POST" }).validator((input) => object({
	date: string(),
	latitude: number(),
	longitude: number()
}).parse(input)).handler(todayWeather_createServerFn_handler, async ({ data }) => {
	const { readTodayWeather } = await import("./today.server-CiXjJapr.mjs");
	return readTodayWeather(data.date, data.latitude, data.longitude);
});
var todayRoutes_createServerFn_handler = createServerRpc({
	id: "9aff3b83a2c635aacc63ab55463d8cdf260cb1fa80f9c2423d6cd9e0c809b5b9",
	name: "todayRoutes",
	filename: "src/lib/today.functions.ts"
}, (opts) => todayRoutes.__executeServer(opts));
var todayRoutes = createServerFn({ method: "POST" }).validator((input) => object({ pairs: array(object({
	key: string(),
	from: object({
		lat: number(),
		lng: number()
	}),
	to: object({
		lat: number(),
		lng: number()
	})
})).max(12) }).parse(input)).handler(todayRoutes_createServerFn_handler, async ({ data }) => {
	const { routeTodayLegs } = await import("./today.server-CiXjJapr.mjs");
	return routeTodayLegs(data.pairs);
});
var parseToday_createServerFn_handler = createServerRpc({
	id: "005fba698d594760ed8c043ad00e6dcacb192674a659ab85fc4647e2401f427a",
	name: "parseToday",
	filename: "src/lib/today.functions.ts"
}, (opts) => parseToday.__executeServer(opts));
var parseToday = createServerFn({ method: "POST" }).validator((input) => object({
	text: string().min(2).max(240),
	date: string()
}).parse(input)).handler(parseToday_createServerFn_handler, async ({ data }) => {
	const { parseTodayLine } = await import("./today.server-CiXjJapr.mjs");
	return parseTodayLine(data.text, data.date);
});
var explainToday_createServerFn_handler = createServerRpc({
	id: "0078b9e4d1d785f6da7f5b22862f0e967ee845530d4f33f8200251065e952a72",
	name: "explainToday",
	filename: "src/lib/today.functions.ts"
}, (opts) => explainToday.__executeServer(opts));
var explainToday = createServerFn({ method: "POST" }).validator((input) => object({ facts: string().max(1200) }).parse(input)).handler(explainToday_createServerFn_handler, async ({ data }) => {
	const { todayVoice } = await import("./today.server-CiXjJapr.mjs");
	return todayVoice(data.facts);
});
//#endregion
export { explainToday_createServerFn_handler, parseToday_createServerFn_handler, todayRoutes_createServerFn_handler, todayWeather_createServerFn_handler };
