import { l as string, s as object, t as _enum } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/planning.functions-DRnkEBeK.js
var parsePlanBrief_createServerFn_handler = createServerRpc({
	id: "5002368017319ec0c13fcbb04b20eb1a6773c33d12c79501e4b9c12733863aae",
	name: "parsePlanBrief",
	filename: "src/lib/planning.functions.ts"
}, (opts) => parsePlanBrief.__executeServer(opts));
var parsePlanBrief = createServerFn({ method: "POST" }).validator((input) => object({
	mode: _enum([
		"dating",
		"travel",
		"family",
		"team_out"
	]),
	text: string().max(500),
	today: string().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(input)).handler(parsePlanBrief_createServerFn_handler, async ({ data }) => {
	const { parsePlanningBrief } = await import("./planning-brief.server-jjBBrJxI.mjs");
	return parsePlanningBrief(data.mode, data.text, data.today);
});
//#endregion
export { parsePlanBrief_createServerFn_handler };
