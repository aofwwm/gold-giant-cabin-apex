import { createServerFn } from "@tanstack/react-start";
import { providerRegistry } from "@/lib/provider-registry";
import { usageSnapshot } from "@/lib/provider-usage";

export const readCostDiagnostics = createServerFn({ method: "POST" })
  .validator(() => ({}))
  .handler(async () => {
    const enabled = process.env.NODE_ENV !== "production" || process.env.KAIROS_DIAGNOSTICS === "1";
    if (!enabled) return { enabled: false as const };
    const { peekKairosModel } = await import("@/lib/gemini.server");
    const model = peekKairosModel();
    return {
      enabled: true as const,
      usage: usageSnapshot(),
      model: {
        activeModel: model.activeModel,
        selection: model.selection,
        lastServed: model.lastServed,
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
        enabled: row.enabled,
      })),
    };
  });