import "@tanstack/react-start/server-only";
import { readAlmanac } from "@/lib/almanac";
import type { Choice, EventView, Kind, OracleSource } from "@/lib/kairos.types";
import { missionSchema, type MissionContext } from "@/lib/mission";
import type { MeetingFormat, MeetingPlatform, MakanWhen, PlaceView } from "@/lib/place";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

let schemaReady = false;
let schemaLogged = false;

function makeCode(length: number): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return out;
}

function tagged(error: { message: string; code?: string }): Error & { code?: string } {
  const err = new Error(error.message) as Error & { code?: string };
  err.code = error.code;
  return err;
}

function asKind(value: string): Kind {
  return value === "makan" ? "makan" : "meeting";
}

function asChoice(value: string): Choice {
  if (value === "love" || value === "yes" || value === "soft" || value === "no") return value;
  if (value === "maybe") return "yes";
  return "no";
}

function asSource(value: string): OracleSource {
  if (value === "grok" || value === "almanac") return value;
  return "";
}

function asPlace(row: {
  format?: string | null;
  venue_name?: string | null;
  room?: string | null;
  address?: string | null;
  platform?: string | null;
  meeting_url?: string | null;
  makan_when?: string | null;
}): PlaceView {
  const format: MeetingFormat = row.format === "online" || row.format === "hybrid" ? row.format : "physical";
  const platform: MeetingPlatform =
    row.platform === "teams" ||
    row.platform === "zoom" ||
    row.platform === "skype" ||
    row.platform === "meet" ||
    row.platform === "webex" ||
    row.platform === "other"
      ? row.platform
      : "";
  const makanWhen: MakanWhen = row.makan_when === "before" || row.makan_when === "after" ? row.makan_when : "";
  return {
    format,
    venueName: row.venue_name ?? "",
    room: row.room ?? "",
    address: row.address ?? "",
    platform,
    meetingUrl: row.meeting_url ?? "",
    makanWhen,
  };
}

function utcStamp(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

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

/** True only when the anon key can read the current Kairos `events.code` column. */
export async function kairosSupabaseReady(): Promise<boolean> {
  if (schemaReady) return true;
  if (!supabaseConfigured()) return false;
  try {
    const { error } = await getSupabase().from("events").select("code").limit(1);
    if (!error) {
      schemaReady = true;
      return true;
    }
    if (!schemaLogged) {
      schemaLogged = true;
      console.error("[supabase] Kairos tables are not ready:", error.message);
    }
    return false;
  } catch (error) {
    if (!schemaLogged) {
      schemaLogged = true;
      console.error("[supabase] connection failed:", error);
    }
    return false;
  }
}

export async function sbLoadEvent(code: string): Promise<EventView | null> {
  const sb = getSupabase();
  const { data: event, error } = await sb
    .from("events")
    .select(
      "id, code, title, kind, duration_min, category, anchor_at, oracle_text, oracle_source, oracle_at, format, venue_name, room, address, platform, meeting_url, makan_when",
    )
    .eq("code", code)
    .maybeSingle();
  if (error) throw tagged(error);
  if (!event) return null;

  const { data: slotRows, error: slotError } = await sb
    .from("slots")
    .select("id, label, venue_note, starts_at, sort_order, cosmic_score")
    .eq("event_id", event.id)
    .order("starts_at", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });
  if (slotError) throw tagged(slotError);

  const { data: voteRows, error: voteError } = await sb
    .from("votes")
    .select("slot_id, nickname, choice, created_at")
    .eq("event_id", event.id)
    .order("created_at", { ascending: true });
  if (voteError) throw tagged(voteError);

  const { data: commentRows, error: commentError } = await sb
    .from("comments")
    .select("id, nickname, body, created_at")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false })
    .limit(40);
  if (commentError) throw tagged(commentError);

  const { data: missionRow, error: missionError } = await sb
    .from("event_ai_context")
    .select("meeting_type, meeting_goal, stakes, tone, preferred_conditions, time_preferences, suggested_duration_minutes, summary")
    .eq("event_id", event.id)
    .maybeSingle();
  if (missionError) throw tagged(missionError);

  const votesBySlot = new Map<string, EventView["slots"][number]["votes"]>();
  for (const vote of voteRows ?? []) {
    const list = votesBySlot.get(vote.slot_id) ?? [];
    list.push({ nickname: vote.nickname, choice: asChoice(vote.choice) });
    votesBySlot.set(vote.slot_id, list);
  }

  const parsedMission = missionRow
    ? missionSchema.safeParse({
        meeting_type: missionRow.meeting_type,
        meeting_goal: missionRow.meeting_goal,
        stakes: missionRow.stakes,
        tone: missionRow.tone,
        preferred_conditions: asObject(missionRow.preferred_conditions),
        time_preferences: asObject(missionRow.time_preferences),
        suggested_duration_minutes: Number(missionRow.suggested_duration_minutes),
        summary: missionRow.summary,
      })
    : null;

  return {
    id: event.id,
    code: event.code,
    title: event.title,
    kind: asKind(event.kind),
    durationMin: Number(event.duration_min),
    category: event.category ?? "",
    anchorAt: utcStamp(event.anchor_at),
    oracleText: event.oracle_text ?? "",
    oracleSource: asSource(event.oracle_source ?? ""),
    mission: parsedMission?.success ? parsedMission.data : null,
    place: asPlace(event),
    slots: (slotRows ?? []).map((slot) => {
      const startsAt = utcStamp(slot.starts_at);
      const reading = readAlmanac(startsAt, event.title, {
        kind: asKind(event.kind),
        durationMin: Number(event.duration_min),
      });
      return {
        id: slot.id,
        label: slot.label ?? "",
        venueNote: slot.venue_note ?? "",
        startsAt,
        score: reading.score,
        yi: reading.yi,
        yiNote: reading.yiNote,
        ji: reading.ji,
        jiNote: reading.jiNote,
        tarot: reading.tarot,
        tarotNote: reading.tarotNote,
        zodiac: reading.zodiac,
        zodiacNote: reading.zodiacNote,
        boss: reading.boss,
        votes: votesBySlot.get(slot.id) ?? [],
      };
    }),
    comments: (commentRows ?? []).map((comment) => ({
      id: comment.id,
      nickname: comment.nickname,
      body: comment.body,
      createdAt: utcStamp(comment.created_at),
    })),
  };
}

export async function sbInsertEvent(row: {
  title: string;
  kind: "meeting" | "makan";
  durationMin: number;
  category: string;
  anchorIso: string;
  place: PlaceView;
  meetingUrl: string;
}): Promise<{ code: string; eventId: string }> {
  const sb = getSupabase();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const code = makeCode(7);
    const eventId = makeCode(16);
    const { error } = await sb.from("events").insert({
      id: eventId,
      code,
      title: row.title,
      kind: row.kind,
      duration_min: row.durationMin,
      category: row.category,
      anchor_at: row.anchorIso || null,
      format: row.place.format,
      venue_name: row.place.venueName.slice(0, 80),
      room: row.place.room.slice(0, 80),
      address: row.place.address.slice(0, 160),
      platform: row.place.platform,
      meeting_url: row.meetingUrl,
      makan_when: row.place.makanWhen,
    });
    if (!error) return { code, eventId };
    if (error.code !== "23505" || attempt === 2) throw tagged(error);
  }
  throw new Error("Could not open a board");
}

export async function sbInsertSlot(
  eventId: string,
  title: string,
  iso: string,
  label: string,
  venueNote: string,
  sortOrder: number,
): Promise<void> {
  const reading = readAlmanac(iso, title);
  const { error } = await getSupabase().from("slots").insert({
    id: makeCode(12),
    event_id: eventId,
    label,
    venue_note: venueNote,
    starts_at: iso,
    sort_order: sortOrder,
    cosmic_score: reading.score,
    yi: reading.yi,
    yi_note: reading.yiNote,
    ji: reading.ji,
    ji_note: reading.jiNote,
    tarot: reading.tarot,
    tarot_note: reading.tarotNote,
    zodiac: reading.zodiac,
    zodiac_note: reading.zodiacNote,
    boss: reading.boss,
  });
  if (error) throw tagged(error);
}

export async function sbBoardSize(code: string): Promise<{ id: string; title: string; n: number } | null> {
  const sb = getSupabase();
  const { data: event, error } = await sb.from("events").select("id, title").eq("code", code).maybeSingle();
  if (error) throw tagged(error);
  if (!event) return null;
  const { count, error: countError } = await sb
    .from("slots")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id);
  if (countError) throw tagged(countError);
  return { id: event.id, title: event.title, n: count ?? 0 };
}

export async function sbSlotLabels(eventId: string): Promise<string[]> {
  const { data, error } = await getSupabase().from("slots").select("label").eq("event_id", eventId);
  if (error) throw tagged(error);
  return (data ?? []).map((row) => row.label).filter((label): label is string => Boolean(label));
}

export async function sbCastVote(data: { code: string; slotId: string; nickname: string; choice: Choice }): Promise<void> {
  const sb = getSupabase();
  const { data: event, error: eventError } = await sb.from("events").select("id").eq("code", data.code).maybeSingle();
  if (eventError) throw tagged(eventError);
  if (!event) throw new Error("That option has left the board");
  const { data: slot, error: slotError } = await sb
    .from("slots")
    .select("id, event_id")
    .eq("id", data.slotId)
    .eq("event_id", event.id)
    .maybeSingle();
  if (slotError) throw tagged(slotError);
  if (!slot) throw new Error("That option has left the board");
  const key = data.nickname.toLowerCase();
  const { data: existing, error: existingError } = await sb
    .from("votes")
    .select("id")
    .eq("slot_id", slot.id)
    .eq("nickname_key", key)
    .maybeSingle();
  if (existingError) throw tagged(existingError);
  if (existing) {
    const { error } = await sb
      .from("votes")
      .update({ choice: data.choice, nickname: data.nickname, created_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw tagged(error);
    return;
  }
  const { error } = await sb.from("votes").insert({
    id: makeCode(12),
    slot_id: slot.id,
    event_id: slot.event_id,
    nickname: data.nickname,
    nickname_key: key,
    choice: data.choice,
  });
  if (error) throw tagged(error);
}

export async function sbCommentCount(code: string): Promise<{ id: string; n: number } | null> {
  const sb = getSupabase();
  const { data: event, error } = await sb.from("events").select("id").eq("code", code).maybeSingle();
  if (error) throw tagged(error);
  if (!event) return null;
  const { count, error: countError } = await sb
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id);
  if (countError) throw tagged(countError);
  return { id: event.id, n: count ?? 0 };
}

export async function sbInsertComment(eventId: string, nickname: string, body: string): Promise<void> {
  const { error } = await getSupabase().from("comments").insert({
    id: makeCode(12),
    event_id: eventId,
    nickname,
    body,
  });
  if (error) throw tagged(error);
}

export async function sbUpdateOracle(eventId: string, text: string, source: "grok" | "almanac"): Promise<void> {
  const { error } = await getSupabase()
    .from("events")
    .update({ oracle_text: text, oracle_source: source, oracle_at: new Date().toISOString() })
    .eq("id", eventId);
  if (error) throw tagged(error);
}

export async function sbReadMission(eventId: string): Promise<MissionContext | null> {
  const { data: row, error } = await getSupabase()
    .from("event_ai_context")
    .select("meeting_type, meeting_goal, stakes, tone, preferred_conditions, time_preferences, suggested_duration_minutes, summary")
    .eq("event_id", eventId)
    .maybeSingle();
  if (error) throw tagged(error);
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

export async function sbWriteMission(eventId: string, parsed: MissionContext, source: "grok" | "rules"): Promise<void> {
  const { error } = await getSupabase().from("event_ai_context").upsert(
    {
      event_id: eventId,
      meeting_type: parsed.meeting_type,
      meeting_goal: parsed.meeting_goal,
      stakes: parsed.stakes,
      tone: parsed.tone,
      preferred_conditions: parsed.preferred_conditions,
      time_preferences: parsed.time_preferences,
      suggested_duration_minutes: parsed.suggested_duration_minutes,
      summary: parsed.summary,
      source,
    },
    { onConflict: "event_id" },
  );
  if (error) throw tagged(error);
}

export type StoredExplanation = {
  fingerprint: string;
  ai_headline: string;
  ai_reasoning: unknown;
  ai_comment: string;
  backup_label: string;
  backup_reason: string;
  slot_lines: unknown;
  source: string;
};

export async function sbReadExplanation(eventId: string): Promise<StoredExplanation | null> {
  const { data, error } = await getSupabase()
    .from("kairos_results")
    .select("fingerprint, ai_headline, ai_reasoning, ai_comment, backup_label, backup_reason, slot_lines, source")
    .eq("event_id", eventId)
    .maybeSingle();
  if (error) throw tagged(error);
  return data;
}

export async function sbWriteExplanation(row: {
  eventId: string;
  winningSlotId: string;
  fingerprint: string;
  peopleScore: number;
  momentScore: number;
  cosmicScore: number;
  kairosScore: number;
  headline: string;
  reasoning: string[];
  comment: string;
  backupLabel: string;
  backupReason: string;
  lines: { slotId: string; line: string }[];
  source: string;
}): Promise<void> {
  const { error } = await getSupabase().from("kairos_results").upsert(
    {
      event_id: row.eventId,
      winning_slot_id: row.winningSlotId,
      fingerprint: row.fingerprint,
      people_score: row.peopleScore,
      moment_score: row.momentScore,
      cosmic_score: row.cosmicScore,
      kairos_score: row.kairosScore,
      ai_headline: row.headline,
      ai_reasoning: row.reasoning,
      ai_comment: row.comment,
      backup_label: row.backupLabel,
      backup_reason: row.backupReason,
      slot_lines: row.lines,
      source: row.source,
      generated_at: new Date().toISOString(),
    },
    { onConflict: "event_id" },
  );
  if (error) throw tagged(error);
}

export async function sbReadCosmic(eventId: string, slotId: string): Promise<string | null> {
  const { data, error } = await getSupabase()
    .from("cosmic_readings")
    .select("prose")
    .eq("event_id", eventId)
    .eq("slot_id", slotId)
    .maybeSingle();
  if (error) throw tagged(error);
  return data?.prose ?? null;
}

export async function sbWriteCosmic(eventId: string, slotId: string, prose: string, source: string): Promise<void> {
  const { error } = await getSupabase().from("cosmic_readings").upsert(
    {
      event_id: eventId,
      slot_id: slotId,
      prose,
      source,
      generated_at: new Date().toISOString(),
    },
    { onConflict: "event_id,slot_id" },
  );
  if (error) throw tagged(error);
}
