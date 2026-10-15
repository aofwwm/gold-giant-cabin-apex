import assert from "node:assert/strict";
import test from "node:test";
import { selectKairosGeminiModel, type ListedGeminiModel } from "./gemini-model.ts";

function model(name: string, extra: Partial<ListedGeminiModel> = {}): ListedGeminiModel {
  return {
    name: `models/${name}`,
    description: extra.description ?? name,
    supportedGenerationMethods: ["generateContent", "countTokens"],
    inputTokenLimit: 1048576,
    outputTokenLimit: 65536,
    thinking: true,
    ...extra,
  };
}

const LIVE = [
  model("gemini-2.5-flash", { description: "Stable version of Gemini 2.5 Flash" }),
  model("gemini-2.5-pro", { description: "Stable release of Gemini 2.5 Pro" }),
  model("gemini-2.5-flash-image"),
  model("gemini-2.5-flash-preview-tts"),
  model("gemini-flash-latest", { description: "Latest release of Gemini Flash" }),
  model("gemini-pro-latest", { description: "Latest release of Gemini Pro" }),
  model("gemini-3-flash-preview", { description: "Gemini 3 Flash Preview" }),
  model("gemini-3.1-pro-preview", { description: "Gemini 3.1 Pro Preview" }),
  model("gemini-3.1-flash-lite"),
  model("gemini-3.5-flash"),
  model("gemini-3.5-flash-lite"),
  model("gemini-3.6-flash"),
  model("gemini-3.7-flash"),
  model("gemini-3.8-flash", { description: "Gemini 3.8 Flash" }),
  model("gemini-embedding-001"),
  model("gemini-robotics-er-2-preview"),
  model("gemini-2.5-computer-use-preview-10-2025"),
  model("gemini-3.8-live"),
  model("gemini-3.1-flash-live-preview"),
  model("lyria-3.5"),
  model("gemma-4-31b-it"),
];

const opts = { allowPreview: false, allowExperimental: false, fallbackModel: "gemini-3.5-flash" };

test("selects the newest stable flash, not an alias, preview, or 2.5", () => {
  const selected = selectKairosGeminiModel(LIVE, opts);
  assert.equal(selected.model, "gemini-3.8-flash");
  assert.equal(selected.source, "discovered");
  assert.equal(selected.stability, "stable");
  assert.deepEqual(selected.chain.slice(0, 4), ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.5-flash"]);
  assert.equal(selected.catalog.aliases.includes("gemini-flash-latest"), true);
  assert.equal(selected.catalog.preview.includes("gemini-3.1-pro-preview"), true);
  assert.equal(selected.catalog.stable.includes("gemini-2.5-flash"), true);
  assert.equal(selected.passedOver.some((item) => item.model === "gemini-3.1-pro-preview"), true);
});

test("does not rank model ids lexicographically", () => {
  const selected = selectKairosGeminiModel(
    [model("gemini-3.9-flash"), model("gemini-3.10-flash"), model("gemini-9-flash"), model("gemini-10-flash")],
    opts,
  );
  assert.equal(selected.model, "gemini-10-flash");
  const lexical = ["gemini-3.9-flash", "gemini-3.10-flash", "gemini-9-flash", "gemini-10-flash"].sort();
  assert.notEqual(lexical[lexical.length - 1], "gemini-10-flash");
});

test("preview and experimental stay out unless explicitly enabled", () => {
  const listed = [model("gemini-3.8-flash"), model("gemini-3.9-flash-preview"), model("gemini-4-flash-exp")];
  assert.equal(selectKairosGeminiModel(listed, opts).model, "gemini-3.8-flash");
  assert.equal(selectKairosGeminiModel(listed, { ...opts, allowPreview: true }).model, "gemini-3.9-flash-preview");
  assert.equal(selectKairosGeminiModel(listed, { ...opts, allowPreview: true, allowExperimental: true }).model, "gemini-4-flash-exp");
});

test("same generation prefers flash, but a newer pro beats an older flash", () => {
  const same = selectKairosGeminiModel([model("gemini-3.8-pro"), model("gemini-3.8-flash-lite"), model("gemini-3.8-flash")], opts);
  assert.equal(same.model, "gemini-3.8-flash");
  const newerPro = selectKairosGeminiModel([model("gemini-3.8-flash"), model("gemini-4-pro")], opts);
  assert.equal(newerPro.model, "gemini-4-pro");
});

test("override pins a verified model and ignores missing, alias, and specialised pins", () => {
  assert.equal(selectKairosGeminiModel(LIVE, { ...opts, override: "gemini-3.5-flash" }).model, "gemini-3.5-flash");
  assert.equal(selectKairosGeminiModel(LIVE, { ...opts, override: "gemini-3.5-flash" }).source, "override");
  assert.equal(selectKairosGeminiModel(LIVE, { ...opts, override: "gemini-nope" }).model, "gemini-3.8-flash");
  assert.equal(selectKairosGeminiModel(LIVE, { ...opts, override: "gemini-flash-latest" }).model, "gemini-3.8-flash");
  assert.equal(selectKairosGeminiModel(LIVE, { ...opts, override: "gemini-2.5-flash-image" }).source, "discovered");
});

test("falls back when the list fails or nothing usable remains", () => {
  const failed = selectKairosGeminiModel([], { ...opts, listFailed: true });
  assert.equal(failed.source, "fallback");
  assert.equal(failed.model, "gemini-3.5-flash");
  const images = selectKairosGeminiModel([model("gemini-3.9-flash-image"), model("gemini-embedding-2")], opts);
  assert.equal(images.source, "fallback");
});

test("a blocked newest model yields the next stable flash", () => {
  const selected = selectKairosGeminiModel(LIVE, { ...opts, blocked: ["gemini-3.8-flash"] });
  assert.equal(selected.model, "gemini-3.7-flash");
});
