import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { i as usageSnapshot } from "./provider-usage-CqiDrKv8.mjs";
import { n as providerRegistry } from "./provider-registry-DT28z4U1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/diagnostics.functions-DCi8tPLu.js
var readCostDiagnostics_createServerFn_handler = createServerRpc({
	id: "6af1ea66d03cb6df257d83acb276f473e768fae20eff4e2f182dcd4a3ed8bcc7",
	name: "readCostDiagnostics",
	filename: "src/lib/diagnostics.functions.ts"
}, (opts) => readCostDiagnostics.__executeServer(opts));
var readCostDiagnostics = createServerFn({ method: "POST" }).validator(() => ({})).handler(readCostDiagnostics_createServerFn_handler, async () => {
	if (!(process.env.KAIROS_DIAGNOSTICS === "1")) return { enabled: false };
	const { peekKairosModel } = await import("./gemini.server-D3PyYOAp.mjs");
	const model = peekKairosModel();
	return {
		enabled: true,
		usage: usageSnapshot(),
		model: {
			activeModel: model.activeModel,
			selection: model.selection,
			lastServed: model.lastServed
		},
		providers: providerRegistry().map((row) => ({
			id: row.id,
			feature: row.feature,
			costClass: row.costClass,
			requiresKey: row.requiresKey,
			requiresBilling: row.requiresBilling,
			requiresCreditCard: row.requiresCreditCard,
			cacheable: row.cacheable,
			fallbackProvider: row.fallbackProvider,
			enabled: row.enabled
		}))
	};
});
//#endregion
export { readCostDiagnostics_createServerFn_handler };
