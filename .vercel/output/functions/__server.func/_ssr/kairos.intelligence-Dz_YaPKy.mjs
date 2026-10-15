import { a as literal, d as union, l as string, r as boolean, s as object, t as _enum } from "../_libs/zod.mjs";
import { a as missionSchema } from "./mission-DOaVQo-M.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kairos.intelligence-Dz_YaPKy.js
var codeSchema = string().trim().regex(/^[a-zA-Z0-9]{4,12}$/).transform((value) => value.toLowerCase());
var durationSchema = union([
	literal(30),
	literal(45),
	literal(60),
	literal(90),
	literal(120)
]);
var analyzeMission_createServerFn_handler = createServerRpc({
	id: "9df038b20cb63ce8c7f21b024b127abe529448cbe4a64eb9e8b73906de2fd2d3",
	name: "analyzeMission",
	filename: "src/lib/kairos.intelligence.ts"
}, (opts) => analyzeMission.__executeServer(opts));
var analyzeMission = createServerFn({ method: "POST" }).validator((input) => object({
	title: string().trim().min(2).max(200),
	kind: _enum(["meeting", "makan"]),
	durationMin: durationSchema
}).parse(input)).handler(analyzeMission_createServerFn_handler, async ({ data }) => {
	const { analyzeMission: analyze } = await import("./kairos.intelligence.server-BBqsF_Cu.mjs");
	return analyze(data);
});
var explainKairos_createServerFn_handler = createServerRpc({
	id: "388175e52087477d5871ba99a0ab563fb6e034712d9929e8f20c91d9c679f095",
	name: "explainKairos",
	filename: "src/lib/kairos.intelligence.ts"
}, (opts) => explainKairos.__executeServer(opts));
var explainKairos = createServerFn({ method: "POST" }).validator((input) => object({
	code: codeSchema,
	refresh: boolean().optional()
}).parse(input)).handler(explainKairos_createServerFn_handler, async ({ data }) => {
	const { explainKairos: explain } = await import("./kairos.intelligence.server-BBqsF_Cu.mjs");
	return explain(data);
});
var interpretCosmos_createServerFn_handler = createServerRpc({
	id: "5b495d32f05ca017d7e6b22bae05182ac2a63e7d4147f5744ae67fc251e702e5",
	name: "interpretCosmos",
	filename: "src/lib/kairos.intelligence.ts"
}, (opts) => interpretCosmos.__executeServer(opts));
var interpretCosmos = createServerFn({ method: "POST" }).validator((input) => object({
	code: codeSchema,
	slotId: string().trim().min(6).max(16)
}).parse(input)).handler(interpretCosmos_createServerFn_handler, async ({ data }) => {
	const { interpretCosmos: interpret } = await import("./kairos.intelligence.server-BBqsF_Cu.mjs");
	return interpret(data);
});
var saveMission_createServerFn_handler = createServerRpc({
	id: "59af517741876a2dc001aa72ab35a55444d3b454ffb0663333f5ca50d5059a65",
	name: "saveMission",
	filename: "src/lib/kairos.intelligence.ts"
}, (opts) => saveMission.__executeServer(opts));
var saveMission = createServerFn({ method: "POST" }).validator((input) => object({
	code: codeSchema,
	mission: missionSchema,
	source: _enum(["grok", "rules"]).optional()
}).parse(input)).handler(saveMission_createServerFn_handler, async ({ data }) => {
	const { saveMission: save } = await import("./kairos.intelligence.server-BBqsF_Cu.mjs");
	return save(data);
});
//#endregion
export { analyzeMission_createServerFn_handler, explainKairos_createServerFn_handler, interpretCosmos_createServerFn_handler, saveMission_createServerFn_handler };
