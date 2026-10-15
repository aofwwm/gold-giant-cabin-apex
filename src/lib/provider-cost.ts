/**
 * Compatibility view of the cost registry.
 * New code should use providerRegistry() in provider-registry.ts.
 */

import { providerRegistry, type GuardrailClass } from "@/lib/provider-registry";

export type CostClass = "free_open" | "free_with_limits" | "optional_commercial" | "external_handoff" | "needs_review";

export type ProviderCost = {
  id: string;
  role: string;
  module: string;
  cost: CostClass;
  apiKey: "no" | "optional" | "yes";
  billing: "no" | "not_required" | "only_if_enabled";
  failure: string;
};

function legacyClass(cost: GuardrailClass): CostClass {
  if (cost === "OPEN") return "free_open";
  if (cost === "FREE_LIMITED") return "free_with_limits";
  if (cost === "OPTIONAL_PAID") return "optional_commercial";
  return "external_handoff";
}

export function providerCostRows(): ProviderCost[] {
  return providerRegistry().map((row) => ({
    id: row.id,
    role: row.feature,
    module: "provider-registry",
    cost: legacyClass(row.costClass),
    apiKey: row.requiresKey ? (row.costClass === "OPTIONAL_PAID" || row.id === "supabase" ? "optional" : "yes") : "no",
    billing: row.costClass === "OPTIONAL_PAID" || row.id === "supabase" ? "only_if_enabled" : row.requiresKey ? "not_required" : "no",
    failure: row.note,
  }));
}

export const PROVIDER_COST: ProviderCost[] = providerCostRows();

export function costLabel(cost: CostClass): string {
  if (cost === "free_open") return "Free/open";
  if (cost === "free_with_limits") return "Free with limits";
  if (cost === "optional_commercial") return "Optional commercial";
  if (cost === "external_handoff") return "External handoff only";
  return "Needs review";
}

export function guardrailLabel(cost: GuardrailClass): string {
  if (cost === "OPEN") return "Open";
  if (cost === "FREE_LIMITED") return "Free with limits";
  if (cost === "OPTIONAL_PAID") return "Optional paid";
  return "External handoff";
}
