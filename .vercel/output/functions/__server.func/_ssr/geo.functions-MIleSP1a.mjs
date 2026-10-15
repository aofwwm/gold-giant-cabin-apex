import { l as string, o as number, s as object } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/geo.functions-MIleSP1a.js
var point = {
	latitude: number().gte(-90).lte(90),
	longitude: number().gte(-180).lte(180)
};
var reversePlace_createServerFn_handler = createServerRpc({
	id: "2b37212ba9d7a362873f46322d17fc3edc6ef8cef3c0fa5d057d4239b7a58348",
	name: "reversePlace",
	filename: "src/lib/geo.functions.ts"
}, (opts) => reversePlace.__executeServer(opts));
var reversePlace = createServerFn({ method: "POST" }).validator((input) => object(point).parse(input)).handler(reversePlace_createServerFn_handler, async ({ data }) => {
	const { reverseLabel } = await import("./coord.server-CiNzmMuE.mjs");
	return reverseLabel(data.latitude, data.longitude);
});
var lookupPlace_createServerFn_handler = createServerRpc({
	id: "aae47111b8ba1a6c8f72a3197cf2a24411952a39f18b5e18529be8119f5fc93d",
	name: "lookupPlace",
	filename: "src/lib/geo.functions.ts"
}, (opts) => lookupPlace.__executeServer(opts));
var lookupPlace = createServerFn({ method: "POST" }).validator((input) => object({ query: string().trim().min(2).max(120) }).parse(input)).handler(lookupPlace_createServerFn_handler, async ({ data }) => {
	const { searchPlaces } = await import("./coord.server-CiNzmMuE.mjs");
	return searchPlaces(data.query);
});
//#endregion
export { lookupPlace_createServerFn_handler, reversePlace_createServerFn_handler };
