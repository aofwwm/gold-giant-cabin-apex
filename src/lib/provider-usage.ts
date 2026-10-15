/** In-process counters for the development cost panel. No secrets and no network. */

export type UsageChannel = "gemini" | "discovery" | "routing" | "photo" | "weather" | "geocode";

export type UsageCounts = {
  calls: number;
  hits: number;
  misses: number;
  failures: number;
};

export type UsageSnapshot = {
  since: string;
  day: string;
  session: Record<UsageChannel, UsageCounts>;
  today: Record<UsageChannel, UsageCounts>;
  recentFailures: { channel: UsageChannel; provider: string; message: string }[];
};

const CHANNELS: UsageChannel[] = ["gemini", "discovery", "routing", "photo", "weather", "geocode"];

function emptyCounts(): UsageCounts {
  return { calls: 0, hits: 0, misses: 0, failures: 0 };
}

function emptyBoard(): Record<UsageChannel, UsageCounts> {
  return {
    gemini: emptyCounts(),
    discovery: emptyCounts(),
    routing: emptyCounts(),
    photo: emptyCounts(),
    weather: emptyCounts(),
    geocode: emptyCounts(),
  };
}

const startedAt = new Date().toISOString();
let dayKey = new Date().toISOString().slice(0, 10);
let session = emptyBoard();
let today = emptyBoard();
const failures: UsageSnapshot["recentFailures"] = [];

function roll(): void {
  const next = new Date().toISOString().slice(0, 10);
  if (next === dayKey) return;
  dayKey = next;
  today = emptyBoard();
}

function bump(board: Record<UsageChannel, UsageCounts>, channel: UsageChannel, field: keyof UsageCounts): void {
  board[channel][field] += 1;
}

export function noteCall(channel: UsageChannel, provider = ""): void {
  roll();
  bump(session, channel, "calls");
  bump(today, channel, "calls");
  if (provider.length > 80) provider = provider.slice(0, 80);
}

export function noteCache(channel: UsageChannel, hit: boolean): void {
  roll();
  const field = hit ? "hits" : "misses";
  bump(session, channel, field);
  bump(today, channel, field);
}

export function noteFailure(channel: UsageChannel, provider: string, message: string): void {
  roll();
  bump(session, channel, "failures");
  bump(today, channel, "failures");
  failures.unshift({
    channel,
    provider: provider.replace(/\s+/g, " ").trim().slice(0, 40),
    message: message.replace(/\s+/g, " ").trim().slice(0, 80),
  });
  if (failures.length > 12) failures.pop();
}

export function usageSnapshot(): UsageSnapshot {
  roll();
  return {
    since: startedAt,
    day: dayKey,
    session: structuredClone(session),
    today: structuredClone(today),
    recentFailures: failures.slice(),
  };
}

export function resetUsage(): void {
  session = emptyBoard();
  today = emptyBoard();
  failures.length = 0;
}

export const USAGE_CHANNELS = CHANNELS;
