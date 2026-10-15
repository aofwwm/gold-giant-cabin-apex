import "@tanstack/react-start/server-only";
import { forecast } from "@/lib/family.server";
import { geminiJson, KAIROS_VOICE } from "@/lib/gemini.server";
import { noteCall, noteFailure } from "@/lib/provider-usage";
import { TtlCache, shareRequest } from "@/lib/travel-cache";
import { clipVoice } from "@/lib/voice";
import { parseQuickRules, type TodayKind } from "@/lib/today";

export async function readTodayWeather(date: string, latitude: number, longitude: number) {
  try {
    const cast = await forecast({ lat: latitude, lng: longitude }, date);
    const weather = cast.weather;
    if (!weather) return null;
    return {
      summary: weather.windowNote || weather.windowLabel,
      rain: weather.rainRisk,
      afternoonOutdoor: weather.afternoonOutdoor,
      morningOutdoor: weather.morningOutdoor,
      thunder: weather.thunder,
    };
  } catch {
    return null;
  }
}

const todayRouteCache = new TtlCache<{ minutes: number; meters: number } | null>(6 * 60 * 60 * 1000, 200, "routing");
const todayVoiceCache = new TtlCache<string>(12 * 60 * 60 * 1000, 40, "gemini");

export async function routeTodayLegs(pairs: { key: string; from: { lat: number; lng: number }; to: { lat: number; lng: number } }[]) {
  const legs = [];
  for (const pair of pairs.slice(0, 12)) {
    const cacheKey = `${pair.from.lat.toFixed(3)},${pair.from.lng.toFixed(3)};${pair.to.lat.toFixed(3)},${pair.to.lng.toFixed(3)}`;
    const cached = todayRouteCache.get(cacheKey);
    if (cached !== undefined) {
      legs.push(cached ? { key: pair.key, ...cached } : { key: pair.key, minutes: null, meters: null });
      continue;
    }
    const leg = await shareRequest(`today-route:${cacheKey}`, () => fetchTodayLeg(cacheKey, pair));
    legs.push(leg ? { key: pair.key, ...leg } : { key: pair.key, minutes: null, meters: null });
  }
  return legs;
}

async function fetchTodayLeg(cacheKey: string, pair: { from: { lat: number; lng: number }; to: { lat: number; lng: number } }): Promise<{ minutes: number; meters: number } | null> {
  const again = todayRouteCache.peek(cacheKey);
  if (again !== undefined) return again;
  const url = `https://router.project-osrm.org/route/v1/driving/${pair.from.lng},${pair.from.lat};${pair.to.lng},${pair.to.lat}?overview=false`;
  try {
    noteCall("routing", "osrm");
    const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "Kairos/1.0 (today routing)" }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      noteFailure("routing", "osrm", `HTTP ${res.status}`);
      return null;
    }
    const body = (await res.json()) as { routes?: { duration?: number; distance?: number }[] };
    const route = body.routes?.[0];
    if (!route?.duration || !route.distance) return null;
    const speed = route.distance / route.duration;
    if (speed < 1 || speed > 40) return null;
    const leg = { minutes: Math.max(1, Math.round(route.duration / 60)), meters: Math.round(route.distance) };
    todayRouteCache.set(cacheKey, leg);
    return leg;
  } catch {
    return null;
  }
}

export async function parseTodayLine(text: string, date: string) {
  const rules = parseQuickRules(text, date);
  const raw = await geminiJson(
    `${KAIROS_VOICE} Turn one schedule note into JSON. Use only the words given. Do not invent a place, a time, or a duration that is not implied. kind is task, errand, appointment, or personal. Times are HH:MM 24-hour or empty.`,
    JSON.stringify({ text: text.slice(0, 240), today: date, rules }),
    {
      type: "object",
      properties: {
        kind: { type: "string" },
        title: { type: "string" },
        date: { type: "string" },
        start: { type: "string" },
        duration: { type: "number" },
        deadline: { type: "string" },
        flexible: { type: "boolean" },
      },
    },
    180,
  );
  const kinds: TodayKind[] = ["task", "errand", "appointment", "personal"];
  if (!raw || typeof raw !== "object") return { ...rules, source: "rules" as const };
  const record = raw as Record<string, unknown>;
  const kind = kinds.find((item) => item === record.kind) ?? rules.kind;
  const title = typeof record.title === "string" && record.title.trim() ? record.title.trim().slice(0, 80) : rules.title;
  return {
    kind,
    title,
    date: typeof record.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.date) ? record.date : rules.date,
    startMin: clock(typeof record.start === "string" ? record.start : "") ?? rules.startMin,
    duration: typeof record.duration === "number" && record.duration > 0 ? Math.min(240, Math.round(record.duration)) : rules.duration,
    deadlineMin: clock(typeof record.deadline === "string" ? record.deadline : "") ?? rules.deadlineMin,
    flexible: typeof record.flexible === "boolean" ? record.flexible : rules.flexible,
    source: "kairos" as const,
  };
}

function clock(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
}

export async function todayVoice(facts: string): Promise<string> {
  const key = facts.slice(0, 800);
  const cached = todayVoiceCache.get(key);
  if (cached !== undefined) return cached;
  return shareRequest(`today-voice:${key}`, () => fetchTodayVoice(key, facts));
}

async function fetchTodayVoice(key: string, facts: string): Promise<string> {
  const again = todayVoiceCache.peek(key);
  if (again !== undefined) return again;
  const raw = await geminiJson(
    `${KAIROS_VOICE} One practical sentence about this day, maximum 20 words. Use only the JSON. Do not invent weather, travel, places, or events.`,
    facts,
    { type: "object", properties: { line: { type: "string" } } },
    80,
  );
  if (!raw || typeof raw !== "object" || typeof (raw as { line?: string }).line !== "string") return "";
  const line = clipVoice((raw as { line: string }).line);
  if (line) todayVoiceCache.set(key, line);
  return line;
}
