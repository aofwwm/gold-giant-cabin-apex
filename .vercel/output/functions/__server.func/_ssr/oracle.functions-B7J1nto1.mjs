import { l as string, n as array, o as number, r as boolean, s as object, t as _enum } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/oracle.functions-B7J1nto1.js
var ask = object({
	question: string().max(500).optional().default(""),
	mode: _enum([
		"ask",
		"daily",
		"compare",
		"dates"
	]).optional().default("ask"),
	hint: string().max(40).optional().default(""),
	optionA: string().max(80).optional().default(""),
	optionB: string().max(80).optional().default(""),
	windowDays: number().int().min(3).max(14).optional().default(7),
	birthDate: string().max(10).optional().default(""),
	birthDateB: string().max(10).optional().default(""),
	birthTime: string().max(5).optional().default(""),
	birthPlace: string().max(40).optional().default(""),
	include: array(_enum([
		"tong_shu",
		"tarot",
		"iching",
		"numerology",
		"zodiac",
		"bazi",
		"astrology"
	])).max(7).optional(),
	fresh: boolean().optional().default(false)
});
var askOracle_createServerFn_handler = createServerRpc({
	id: "5c9a6735bce1dbe814b3eaa3150424a62da7d65dd6a7f90faac37e8f1e43fca6",
	name: "askOracle",
	filename: "src/lib/oracle.functions.ts"
}, (opts) => askOracle.__executeServer(opts));
var askOracle = createServerFn({ method: "POST" }).validator((input) => ask.parse(input)).handler(askOracle_createServerFn_handler, async ({ data }) => {
	const { readOracle } = await import("./oracle.server-CvjxP4Sb.mjs");
	return readOracle({
		question: data.question,
		mode: data.mode,
		hint: data.hint,
		optionA: data.optionA,
		optionB: data.optionB,
		windowDays: data.windowDays,
		birthDate: data.birthDate,
		birthDateB: data.birthDateB,
		birthTime: data.birthTime,
		birthPlace: data.birthPlace,
		include: data.include,
		fresh: data.fresh
	});
});
//#endregion
export { askOracle_createServerFn_handler };
