/** Pure Gemini model selection. No network and no API key. */

export const KAIROS_GEMINI_FALLBACK_MODEL = "gemini-3.5-flash";

export type GeminiStability = "stable" | "preview" | "experimental" | "alias";

export type ListedGeminiModel = {
  name: string;
  displayName?: string | null;
  description?: string | null;
  inputTokenLimit?: number | null;
  outputTokenLimit?: number | null;
  supportedGenerationMethods?: string[] | null;
  thinking?: boolean | null;
};

export type GeminiSelectionSource = "discovered" | "override" | "fallback";

export type GeminiCandidate = {
  id: string;
  stability: GeminiStability;
  major: number;
  minor: number;
  tier: "flash" | "pro" | "flash-lite";
  capabilities: string[];
};

export type KairosGeminiSelection = {
  model: string;
  source: GeminiSelectionSource;
  stability: Exclude<GeminiStability, "alias">;
  capabilities: string[];
  checkedAt: string;
  reason: string;
  availableCount: number;
  chain: string[];
  passedOver: { model: string; reason: string }[];
  catalog: {
    generalPurpose: GeminiCandidate[];
    stable: string[];
    preview: string[];
    experimental: string[];
    aliases: string[];
    excluded: number;
  };
};

export type SelectGeminiOptions = {
  allowPreview: boolean;
  allowExperimental: boolean;
  override?: string;
  fallbackModel?: string;
  checkedAt?: string;
  listFailed?: boolean;
  blocked?: string[];
};

const SPECIALISED = [
  "image",
  "tts",
  "embed",
  "audio",
  "live",
  "robot",
  "computer-use",
  "transcribe",
  "translate",
  "lyria",
  "veo",
  "aqa",
  "research",
  "antigravity",
  "customtools",
  "banana",
  "omni",
  "native",
  "clip",
  "realtime",
  "imagen",
];

const VERSION = /^gemini-(\d+)(?:\.(\d+))?-(flash-lite|flash|pro)\b/;

const TIER_SCORE = { flash: 3, pro: 2, "flash-lite": 1 } as const;

export function geminiModelId(name: string): string {
  return name.trim().replace(/^models\//, "");
}

function isSpecialised(id: string): boolean {
  const hay = id.toLowerCase();
  return SPECIALISED.some((token) => hay.includes(token));
}

function capabilitiesOf(model: ListedGeminiModel): string[] {
  const capabilities = ["generateContent", "text-generation"];
  if (model.thinking) capabilities.push("reasoning");
  return capabilities;
}

function stabilityOf(id: string, description: string): GeminiStability {
  if (id.endsWith("-latest")) return "alias";
  if (/(?:^|-)exp(?:-|$)|experimental/.test(id)) return "experimental";
  if (id.includes("-preview") || /\bpreview\b/i.test(description)) return "preview";
  return "stable";
}

export function classifyGeminiModel(model: ListedGeminiModel): GeminiCandidate | "alias" | "excluded" {
  const id = geminiModelId(model.name || "");
  if (!id.startsWith("gemini-") || isSpecialised(id)) return "excluded";
  const methods = model.supportedGenerationMethods ?? [];
  if (!methods.includes("generateContent")) return "excluded";
  if (model.inputTokenLimit != null && model.inputTokenLimit < 32000) return "excluded";
  const description = model.description ?? "";
  const stability = stabilityOf(id, description);
  if (stability === "alias") return "alias";
  const match = VERSION.exec(id);
  if (!match) return "excluded";
  const tier = match[3] as GeminiCandidate["tier"];
  return {
    id,
    stability,
    major: Number(match[1]),
    minor: match[2] ? Number(match[2]) : 0,
    tier,
    capabilities: capabilitiesOf(model),
  };
}

function byNewest(a: GeminiCandidate, b: GeminiCandidate): number {
  if (a.major !== b.major) return b.major - a.major;
  if (a.minor !== b.minor) return b.minor - a.minor;
  const tier = TIER_SCORE[b.tier] - TIER_SCORE[a.tier];
  if (tier !== 0) return tier;
  return a.id.localeCompare(b.id);
}

function skipReason(model: GeminiCandidate, options: SelectGeminiOptions): string {
  if ((options.blocked ?? []).map(geminiModelId).includes(model.id)) return "Skipped because the compatibility probe could not use it.";
  if (model.stability === "preview" && !options.allowPreview) return "Preview model. GEMINI_ALLOW_PREVIEW is false.";
  if (model.stability === "experimental" && !options.allowExperimental) return "Experimental model. Left out unless GEMINI_ALLOW_EXPERIMENTAL is set.";
  if (model.stability === "alias") return "Alias, not a concrete model id.";
  return "Older or lighter than the selected stable model.";
}

function selection(
  partial: Omit<KairosGeminiSelection, "catalog" | "passedOver"> & {
    catalog: KairosGeminiSelection["catalog"];
    passedOver?: { model: string; reason: string }[];
  },
): KairosGeminiSelection {
  return { ...partial, passedOver: partial.passedOver ?? [] };
}

export function selectKairosGeminiModel(listed: ListedGeminiModel[], options: SelectGeminiOptions): KairosGeminiSelection {
  const checkedAt = options.checkedAt ?? new Date().toISOString();
  const fallbackModel = geminiModelId(options.fallbackModel || KAIROS_GEMINI_FALLBACK_MODEL);
  const blocked = new Set((options.blocked ?? []).map(geminiModelId));
  const generalPurpose: GeminiCandidate[] = [];
  const aliases: string[] = [];
  let excluded = 0;
  for (const model of listed) {
    const id = geminiModelId(model.name || "");
    if (id.endsWith("-latest") && id.startsWith("gemini-") && !isSpecialised(id)) {
      aliases.push(id);
      continue;
    }
    const classified = classifyGeminiModel(model);
    if (classified === "alias") aliases.push(id);
    else if (classified === "excluded") excluded += 1;
    else generalPurpose.push(classified);
  }
  const catalog = {
    generalPurpose,
    stable: generalPurpose.filter((model) => model.stability === "stable").map((model) => model.id),
    preview: generalPurpose.filter((model) => model.stability === "preview").map((model) => model.id),
    experimental: generalPurpose.filter((model) => model.stability === "experimental").map((model) => model.id),
    aliases,
    excluded,
  };
  const fallback = (reason: string): KairosGeminiSelection =>
    selection({
      model: fallbackModel,
      source: "fallback",
      stability: stabilityOf(fallbackModel, "") === "alias" ? "stable" : (stabilityOf(fallbackModel, "") as Exclude<GeminiStability, "alias">),
      capabilities: ["generateContent", "text-generation", "structured-json"],
      checkedAt,
      reason,
      availableCount: listed.length,
      chain: [fallbackModel],
      catalog,
    });

  if (options.listFailed) {
    return fallback(`Model list failed. Using configured fallback ${fallbackModel}.`);
  }

  const override = geminiModelId(options.override || "");
  if (override) {
    if (override.endsWith("-latest")) {
      // Concrete ids only. An alias would hide which model is actually serving.
    } else {
      const found = generalPurpose.find((model) => model.id === override);
      if (found && !blocked.has(override)) {
        return selection({
          model: found.id,
          source: "override",
          stability: found.stability === "alias" ? "stable" : found.stability,
          capabilities: found.capabilities,
          checkedAt,
          reason: "GEMINI_MODEL_OVERRIDE is set and this model is available to the key.",
          availableCount: listed.length,
          chain: [found.id],
          catalog,
        });
      }
    }
  }

  const pool = generalPurpose.filter((model) => {
    if (blocked.has(model.id)) return false;
    if (model.stability === "stable") return true;
    if (model.stability === "preview") return options.allowPreview;
    if (model.stability === "experimental") return options.allowExperimental;
    return false;
  });
  pool.sort(byNewest);
  const chosen = pool[0];
  if (!chosen) {
    const why = override ? `Override ${override} is not an available general-purpose model, and no compatible model remained.` : "No compatible general-purpose Gemini model remained.";
    return fallback(`${why} Using configured fallback ${fallbackModel}.`);
  }
  const chain = pool.slice(0, 4).map((model) => model.id);
  const passedOver = generalPurpose
    .filter((model) => model.id !== chosen.id)
    .filter((model) => model.major > chosen.major || (model.major === chosen.major && model.minor > chosen.minor) || model.stability !== "stable")
    .sort(byNewest)
    .slice(0, 16)
    .map((model) => ({ model: model.id, reason: skipReason(model, options) }));
  const overrideNote = override ? ` Override ${override} was not used because it is not an available concrete general-purpose model.` : "";
  return selection({
    model: chosen.id,
    source: "discovered",
    stability: chosen.stability === "alias" ? "stable" : chosen.stability,
    capabilities: chosen.capabilities,
    checkedAt,
    reason: `Newest ${chosen.stability} general-purpose ${chosen.tier} model available to this key (generation ${chosen.major}.${chosen.minor}).${overrideNote}`,
    availableCount: listed.length,
    chain,
    passedOver,
    catalog,
  });
}
