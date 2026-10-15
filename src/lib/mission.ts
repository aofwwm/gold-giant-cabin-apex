import { z } from "zod";
import type { KairosReading } from "@/lib/reading";
import type { Kind } from "@/lib/kairos.types";

export const MEETING_TYPES = [
  "approval",
  "decision",
  "negotiation",
  "difficult_conversation",
  "brainstorming",
  "presentation",
  "project_sync",
  "vendor_meeting",
  "social",
  "makan",
  "team_bonding",
  "networking",
  "casual",
  "other",
] as const;

export type MeetingType = (typeof MEETING_TYPES)[number];
export type Stakes = "low" | "medium" | "high";
export type Lean = "positive" | "neutral" | "negative";

export type MissionContext = {
  meeting_type: MeetingType;
  meeting_goal: string;
  stakes: Stakes;
  tone: string;
  preferred_conditions: string[];
  suggested_duration_minutes: 30 | 45 | 60 | 90 | 120;
  time_preferences: { morning: Lean; afternoon: Lean; late_day: Lean };
  summary: string;
};

const DURATIONS = [30, 45, 60, 90, 120] as const;

export function snapDuration(value: number): MissionContext["suggested_duration_minutes"] {
  return DURATIONS.reduce((best, item) => (Math.abs(item - value) < Math.abs(best - value) ? item : best));
}

const lean = z.enum(["positive", "neutral", "negative"]);

export const missionSchema = z.object({
  meeting_type: z.enum(MEETING_TYPES),
  meeting_goal: z.string().trim().min(2).max(140),
  stakes: z.enum(["low", "medium", "high"]),
  tone: z.string().trim().min(2).max(40),
  preferred_conditions: z.array(z.string().trim().min(2).max(80)).max(4),
  suggested_duration_minutes: z.union([z.literal(30), z.literal(45), z.literal(60), z.literal(90), z.literal(120)]),
  time_preferences: z.object({
    morning: lean,
    afternoon: lean,
    late_day: lean,
  }),
  summary: z.string().trim().min(8).max(220),
});

export const TYPE_LABEL: Record<MeetingType, string> = {
  approval: "Approval",
  decision: "Decision",
  negotiation: "Negotiation",
  difficult_conversation: "Difficult conversation",
  brainstorming: "Brainstorm",
  presentation: "Presentation",
  project_sync: "Project sync",
  vendor_meeting: "Vendor meeting",
  social: "Social",
  makan: "Makan",
  team_bonding: "Team bonding",
  networking: "Networking",
  casual: "Casual",
  other: "Other",
};

const PREF = {
  work: { morning: "positive", afternoon: "neutral", late_day: "negative" },
  easy: { morning: "neutral", afternoon: "positive", late_day: "positive" },
  flat: { morning: "neutral", afternoon: "neutral", late_day: "neutral" },
} as const;

function mission(partial: Omit<MissionContext, "time_preferences" | "suggested_duration_minutes"> & {
  time_preferences?: MissionContext["time_preferences"];
  suggested_duration_minutes?: number;
  durationMin: number;
}): MissionContext {
  return missionSchema.parse({
    ...partial,
    time_preferences: partial.time_preferences ?? PREF.flat,
    suggested_duration_minutes: snapDuration(partial.suggested_duration_minutes ?? partial.durationMin),
  });
}

/** Keyword reading used when the model is offline. No moods, no calendars. */
export function inferMission(title: string, kind: Kind, durationMin: number): MissionContext {
  const text = title.trim().toLowerCase();
  if (kind === "makan" || /makan|supper|lunch|dinner|brunch|eat/.test(text)) {
    return mission({
      meeting_type: "makan",
      meeting_goal: "Share a meal",
      stakes: "low",
      tone: "warm",
      preferred_conditions: ["A proper meal hour", "Room to linger"],
      time_preferences: { morning: "negative", afternoon: "neutral", late_day: "positive" },
      summary: "A meal, not a meeting. The useful window is when people can actually eat.",
      durationMin,
      suggested_duration_minutes: durationMin >= 60 ? durationMin : 90,
    });
  }
  if (/bond|offsite|celebration|drinks|happy hour/.test(text)) {
    return mission({
      meeting_type: "team_bonding",
      meeting_goal: "Spend time together outside the agenda",
      stakes: "low",
      tone: "warm",
      preferred_conditions: ["After the formal day", "No hard decision on the table"],
      time_preferences: PREF.easy,
      summary: "A social hour. It works better once the working day has loosened.",
      durationMin,
    });
  }
  if (/1:1|one to one|difficult|feedback|performance|hard conversation/.test(text)) {
    return mission({
      meeting_type: "difficult_conversation",
      meeting_goal: "Have a direct conversation",
      stakes: "high",
      tone: "careful",
      preferred_conditions: ["Enough time", "Avoid a rushed edge of the day"],
      time_preferences: PREF.work,
      summary: "A high-stakes conversation. It needs time, and a part of the day that is not already squeezed.",
      durationMin,
    });
  }
  if (/budget|funding|approve|approval|\$|director|sign-off|sign off|pitch/.test(text)) {
    return mission({
      meeting_type: "approval",
      meeting_goal: "Secure a decision or extra funding",
      stakes: "high",
      tone: "persuasive",
      preferred_conditions: ["Enough time to explain", "Avoid a rushed window"],
      time_preferences: PREF.work,
      summary: "A high-stakes approval discussion. It needs room to explain, not a squeezed edge of the day.",
      durationMin: Math.max(durationMin, 45),
      suggested_duration_minutes: durationMin >= 45 ? durationMin : 60,
    });
  }
  if (/vendor|supplier|procurement/.test(text)) {
    return mission({
      meeting_type: "vendor_meeting",
      meeting_goal: "Align with a vendor",
      stakes: "medium",
      tone: "direct",
      preferred_conditions: ["A clean working hour", "Time for the decision, not the archaeology"],
      time_preferences: { morning: "positive", afternoon: "positive", late_day: "negative" },
      summary: "A vendor conversation. A clear working hour beats a late one.",
      durationMin,
    });
  }
  if (/brainstorm|idea|workshop/.test(text)) {
    return mission({
      meeting_type: "brainstorming",
      meeting_goal: "Generate options",
      stakes: "medium",
      tone: "open",
      preferred_conditions: ["Enough time to wander", "Not pinned against another meeting"],
      time_preferences: { morning: "positive", afternoon: "positive", late_day: "neutral" },
      summary: "A working session for ideas. It wants time, not a heroic mood.",
      durationMin,
    });
  }
  if (/sync|standup|status|check-in|check in/.test(text)) {
    return mission({
      meeting_type: "project_sync",
      meeting_goal: "Align on status",
      stakes: "low",
      tone: "direct",
      preferred_conditions: ["Keep it short", "A normal working hour"],
      time_preferences: PREF.work,
      summary: "A status sync. Short and inside the working day is enough.",
      durationMin,
      suggested_duration_minutes: durationMin > 45 ? 30 : durationMin,
    });
  }
  return mission({
    meeting_type: kind === "meeting" ? "decision" : "casual",
    meeting_goal: title.trim().slice(0, 140) || "Decide together",
    stakes: "medium",
    tone: "direct",
    preferred_conditions: ["A normal working hour", "Enough time for the actual decision"],
    time_preferences: PREF.work,
    summary: "A working conversation. The useful test is whether the hour can hold it.",
    durationMin,
  });
}

function sgtHour(iso: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Singapore",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  return hour === 24 ? 0 : hour;
}

export function hourBand(hour: number): "morning" | "afternoon" | "late_day" {
  if (hour < 12) return "morning";
  if (hour < 16) return "afternoon";
  return "late_day";
}

/**
 * Moment-fit nudges. Inspect and edit here.
 * The base 0–30 score still comes from the hour engine.
 * These deltas only apply once a mission reading exists, and they are capped at ±6.
 *
 *  +2  duration within 15 minutes of the suggested length
 *  −2  duration at least 15 minutes shorter than suggested
 *  +2  this part of the day is marked positive
 *  −3  this part of the day is marked negative
 *  +2  the ask wants slack and the hour has it
 *  −2  high stakes and the hour has little slack
 */
export function applyMomentContext(
  base: number,
  reading: KairosReading,
  durationMin: number,
  startsAt: string,
  context: MissionContext | null,
): { moment: number; notes: string[] } {
  if (!context) return { moment: base, notes: [] };
  const notes: { delta: number; text: string }[] = [];
  const suggested = context.suggested_duration_minutes;
  if (Math.abs(durationMin - suggested) <= 15) {
    notes.push({ delta: 2, text: "Duration matches the discussion" });
  } else if (durationMin + 15 < suggested) {
    notes.push({ delta: -2, text: "Shorter than this discussion needs" });
  }
  const pref = context.time_preferences[hourBand(sgtHour(startsAt))];
  if (pref === "positive") notes.push({ delta: 2, text: "This part of the day suits the ask" });
  if (pref === "negative") notes.push({ delta: -3, text: "This part of the day works against the ask" });
  const wantsCalm = context.preferred_conditions.some((line) => /unrush|calm|buffer|slack|quiet|enough time|room/i.test(line));
  if (wantsCalm && reading.breathing.points >= 11) {
    notes.push({ delta: 2, text: "Enough slack around the hour" });
  } else if (context.stakes === "high" && reading.breathing.points <= 7) {
    notes.push({ delta: -2, text: "Little slack for a high-stakes talk" });
  }
  const delta = Math.max(-6, Math.min(6, notes.reduce((sum, note) => sum + note.delta, 0)));
  return {
    moment: Math.max(0, Math.min(30, base + delta)),
    notes: notes.map((note) => note.text),
  };
}

export function unsafeCopy(text: string): boolean {
  return /\d+\s*%|guarantee|you will succeed|will approve|scientifically|certain to/i.test(text);
}
