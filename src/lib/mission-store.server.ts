import "@tanstack/react-start/server-only";
import { getSql } from "@/lib/db";
import { missionSchema, type MissionContext } from "@/lib/mission";
import { kairosSupabaseReady, sbReadMission, sbWriteMission } from "@/lib/supabase-store.server";

function asObject(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as unknown;
    } catch {
      return null;
    }
  }
  return value;
}

export async function writeMission(eventId: string, context: MissionContext, source: "grok" | "rules"): Promise<void> {
  const parsed = missionSchema.parse(context);
  if (await kairosSupabaseReady()) {
    await sbWriteMission(eventId, parsed, source);
    return;
  }
  const sql = await getSql();
  await sql`
    insert into event_ai_context (
      event_id,
      meeting_type,
      meeting_goal,
      stakes,
      tone,
      preferred_conditions,
      time_preferences,
      suggested_duration_minutes,
      summary,
      source
    )
    values (
      ${eventId},
      ${parsed.meeting_type},
      ${parsed.meeting_goal},
      ${parsed.stakes},
      ${parsed.tone},
      ${JSON.stringify(parsed.preferred_conditions)}::jsonb,
      ${JSON.stringify(parsed.time_preferences)}::jsonb,
      ${parsed.suggested_duration_minutes},
      ${parsed.summary},
      ${source}
    )
    on conflict (event_id) do update set
      meeting_type = excluded.meeting_type,
      meeting_goal = excluded.meeting_goal,
      stakes = excluded.stakes,
      tone = excluded.tone,
      preferred_conditions = excluded.preferred_conditions,
      time_preferences = excluded.time_preferences,
      suggested_duration_minutes = excluded.suggested_duration_minutes,
      summary = excluded.summary,
      source = excluded.source
  `;
}

export async function readMission(eventId: string): Promise<MissionContext | null> {
  if (await kairosSupabaseReady()) return sbReadMission(eventId);
  const sql = await getSql();
  const rows = await sql<{
    meeting_type: string;
    meeting_goal: string;
    stakes: string;
    tone: string;
    preferred_conditions: unknown;
    time_preferences: unknown;
    suggested_duration_minutes: number;
    summary: string;
  }>`
    select
      meeting_type,
      meeting_goal,
      stakes,
      tone,
      preferred_conditions,
      time_preferences,
      suggested_duration_minutes,
      summary
    from event_ai_context
    where event_id = ${eventId}
  `;
  const row = rows[0];
  if (!row) return null;
  const parsed = missionSchema.safeParse({
    meeting_type: row.meeting_type,
    meeting_goal: row.meeting_goal,
    stakes: row.stakes,
    tone: row.tone,
    preferred_conditions: asObject(row.preferred_conditions),
    time_preferences: asObject(row.time_preferences),
    suggested_duration_minutes: Number(row.suggested_duration_minutes),
    summary: row.summary,
  });
  return parsed.success ? parsed.data : null;
}
