export const KAIROS_MODES = ["today", "meet", "makan", "out", "hash", "family", "dating", "travel", "oracle"] as const;

export type KairosMode = (typeof KAIROS_MODES)[number];

export const KAIROS_TODAY = { mode: "today" as const, label: "Today" };

export const KAIROS_WORK = [
  { mode: "meet" as const, label: "Meet" },
  { mode: "makan" as const, label: "Makan" },
  { mode: "out" as const, label: "Team Out" },
  { mode: "hash" as const, label: "Hash It Out" },
];

export const KAIROS_LIFE = [
  { mode: "family" as const, label: "Family" },
  { mode: "dating" as const, label: "Dating" },
  { mode: "travel" as const, label: "Travel" },
  { mode: "oracle" as const, label: "Oracle" },
];

export function isKairosMode(value: unknown): value is KairosMode {
  return typeof value === "string" && (KAIROS_MODES as readonly string[]).includes(value);
}
