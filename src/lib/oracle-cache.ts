import { classifyQuestion, type OracleInput, type OracleLayer, type OracleReading } from "./oracle.ts";

export const ORACLE_PROMPT_VERSION = "oracle-contract-2";
export const ORACLE_SCHEMA_VERSION = "says-attention-expand-cameo-1";

export type OracleLedger = {
  promptVersion: string;
  schemaVersion: string;
  model: string;
  fallbackModelUsed: boolean;
  generatedAt: string;
  classifier: "LOCAL";
  llmCalls: number;
  cache: "HIT" | "MISS";
};

export function oracleCallPlan(input: Pick<OracleInput, "question" | "mode" | "hint">): { classifier: "LOCAL"; llmCalls: 0 | 1 } {
  const mode = input.mode ?? "ask";
  const hint = mode === "compare" ? "compare" : mode === "dates" ? "which day" : mode === "daily" ? "today" : input.hint ?? "";
  const question = (input.question ?? "").trim() || (mode === "daily" ? "What is the energy of today?" : "");
  const classified = classifyQuestion(question, hint);
  if (classified.guard !== "none") return { classifier: "LOCAL", llmCalls: 0 };
  return { classifier: "LOCAL", llmCalls: 1 };
}

function layerStamp(layer: OracleLayer): string {
  return [layer.id, layer.result, layer.detail, layer.lean].join("|");
}

export function oracleFingerprint(reading: OracleReading): string {
  const methods = reading.methods.filter((item) => item.selected).map((item) => item.method).join(",");
  const layers = [
    ...reading.layers.map(layerStamp),
    ...reading.sides.flatMap((side) => [side.label, ...side.layers.map(layerStamp)]),
    ...reading.dates.flatMap((day) => [day.date, day.band, day.action, ...day.layers.map(layerStamp)]),
  ].join("~");
  return [ORACLE_PROMPT_VERSION, ORACLE_SCHEMA_VERSION, reading.question.trim().toLowerCase(), reading.questionType, reading.mode, methods, layers].join("§");
}

export function dailyKey(input: Pick<OracleInput, "birthDate" | "birthDateB" | "include" | "asOf">, day: string): string {
  const include = (input.include ?? []).slice().sort().join(",");
  return [day, input.birthDate ?? "", input.birthDateB ?? "", include].join("|");
}
