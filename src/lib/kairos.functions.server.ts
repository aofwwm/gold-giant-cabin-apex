import "@tanstack/react-start/server-only";
import { localOracle, readAlmanac } from "@/lib/almanac";
import { getSql } from "@/lib/db";
import {
  kairosSupabaseReady,
  sbBoardSize,
  sbCastVote,
  sbCommentCount,
  sbInsertComment,
  sbInsertEvent,
  sbInsertSlot,
  sbLoadEvent,
  sbSlotLabels,
  sbUpdateOracle,
} from "@/lib/supabase-store.server";
import type { Choice, EventView, Kind, OracleSource, SlotView } from "@/lib/kairos.types";
import { assertReasonableIso, formatWhen, localSgtToIso, nextEveningIso, preferEvening } from "@/lib/time";
import { categoryLabel, pickVenue, venueSalt, type CategoryId } from "@/lib/venues";
import { readMission, writeMission } from "@/lib/mission-store.server";
import type { MissionContext } from "@/lib/mission";
import { counts, leadingSlot } from "@/lib/tally";
import { geminiText, KAIROS_VOICE } from "@/lib/gemini.server";
import {
  cleanMeetingUrl,
  EMPTY_PLACE,
  type MeetingFormat,
  type MeetingPlatform,
  type MakanWhen,
  type PlaceView,
} from "@/lib/place";

function makeCode(length: number): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return out;
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
  format?: string;
  venue_name?: string;
  room?: string;
  address?: string;
  platform?: string;
  meeting_url?: string;
  makan_when?: string;
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

function isUnique(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "23505";
}

type EventRow = {
  id: string;
  code: string;
  title: string;
  kind: string;
  duration_min: number;
  category: string;
  anchor_at: string;
  oracle_text: string;
  oracle_source: string;
  oracle_at: string;
  format: string;
  venue_name: string;
  room: string;
  address: string;
  platform: string;
  meeting_url: string;
  makan_when: string;
};

type SlotRow = {
  id: string;
  label: string;
  venue_note: string;
  starts_at: string;
  cosmic_score: number;
  yi: string;
  yi_note: string;
  ji: string;
  ji_note: string;
  tarot: string;
  tarot_note: string;
  zodiac: string;
  zodiac_note: string;
  boss: string;
};

export async function loadEvent(code: string): Promise<EventView | null> {
  if (await kairosSupabaseReady()) return sbLoadEvent(code);
  const sql = await getSql();
  const events = await sql<EventRow>`
    select
      id,
      code,
      title,
      kind,
      duration_min,
      category,
      coalesce(to_char(anchor_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') as anchor_at,
      oracle_text,
      oracle_source,
      coalesce(to_char(oracle_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '') as oracle_at,
      coalesce(format, 'physical') as format,
      coalesce(venue_name, '') as venue_name,
      coalesce(room, '') as room,
      coalesce(address, '') as address,
      coalesce(platform, '') as platform,
      coalesce(meeting_url, '') as meeting_url,
      coalesce(makan_when, '') as makan_when
    from events
    where code = ${code}
  `;
  const event = events[0];
  if (!event) return null;

  const slotRows = await sql<SlotRow>`
    select
      id,
      label,
      venue_note,
      to_char(starts_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as starts_at,
      cosmic_score,
      yi,
      yi_note,
      ji,
      ji_note,
      tarot,
      tarot_note,
      zodiac,
      zodiac_note,
      boss
    from slots
    where event_id = ${event.id}
    order by starts_at, sort_order, label
  `;

  const voteRows = await sql<{ slot_id: string; nickname: string; choice: string }>`
    select slot_id, nickname, choice
    from votes
    where event_id = ${event.id}
    order by created_at
  `;

  const commentRows = await sql<{ id: string; nickname: string; body: string; created_at: string }>`
    select
      id,
      nickname,
      body,
      to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
    from comments
    where event_id = ${event.id}
    order by created_at desc
    limit 40
  `;

  const votesBySlot = new Map<string, SlotView["votes"]>();
  for (const vote of voteRows) {
    const list = votesBySlot.get(vote.slot_id) ?? [];
    list.push({ nickname: vote.nickname, choice: asChoice(vote.choice) });
    votesBySlot.set(vote.slot_id, list);
  }

  const mission = await readMission(event.id);

  return {
    id: event.id,
    code: event.code,
    title: event.title,
    kind: asKind(event.kind),
    durationMin: Number(event.duration_min),
    category: event.category,
    anchorAt: event.anchor_at,
    oracleText: event.oracle_text,
    oracleSource: asSource(event.oracle_source),
    mission,
    place: asPlace(event),
    slots: slotRows.map((slot) => {
      const reading = readAlmanac(slot.starts_at, event.title, {
        kind: asKind(event.kind),
        durationMin: Number(event.duration_min),
      });
      return {
        id: slot.id,
        label: slot.label,
        venueNote: slot.venue_note,
        startsAt: slot.starts_at,
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
    comments: commentRows.map((comment) => ({
      id: comment.id,
      nickname: comment.nickname,
      body: comment.body,
      createdAt: comment.created_at,
    })),
  };
}

async function insertSlot(
  eventId: string,
  title: string,
  iso: string,
  label: string,
  venueNote: string,
  sortOrder: number,
): Promise<void> {
  if (await kairosSupabaseReady()) {
    await sbInsertSlot(eventId, title, iso, label, venueNote, sortOrder);
    return;
  }
  const sql = await getSql();
  const reading = readAlmanac(iso, title);
  await sql`
    insert into slots (
      id, event_id, label, venue_note, starts_at, sort_order,
      cosmic_score, yi, yi_note, ji, ji_note, tarot, tarot_note, zodiac, zodiac_note, boss
    ) values (
      ${makeCode(12)},
      ${eventId},
      ${label},
      ${venueNote},
      ${iso},
      ${sortOrder},
      ${reading.score},
      ${reading.yi},
      ${reading.yiNote},
      ${reading.ji},
      ${reading.jiNote},
      ${reading.tarot},
      ${reading.tarotNote},
      ${reading.zodiac},
      ${reading.zodiacNote},
      ${reading.boss}
    )
  `;
}

export async function createEvent(data: {
  title: string;
  kind: "meeting" | "makan";
  durationMin: number;
  category: "" | "supper" | "pickle" | "board" | "drink" | "neighbourhood";
  slots: { startsAt: string; label?: string }[];
  anchorAt?: string;
  mission?: MissionContext;
  missionSource?: "grok" | "rules";
  place?: PlaceView;
}) {
  if (data.kind === "meeting" && data.slots.length < 1) {
    throw new Error("Add at least one time");
  }
  const anchorLocal = data.kind === "makan" ? data.anchorAt || data.slots[0]?.startsAt || "" : "";
  if (data.kind === "makan" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(anchorLocal)) {
    throw new Error("Pick a meetup time");
  }
  const anchorIso = anchorLocal ? localSgtToIso(anchorLocal) : "";
  if (anchorIso) assertReasonableIso(anchorIso);

  const prepared = data.slots.map((slot, index) => {
    const iso = localSgtToIso(slot.startsAt);
    assertReasonableIso(iso);
    return { iso, label: (slot.label ?? "").slice(0, 80), index };
  });

  const place = data.place ?? EMPTY_PLACE;
  const meetingUrl = cleanMeetingUrl(place.meetingUrl);
  let code = "";
  let eventId = "";
  if (await kairosSupabaseReady()) {
    const created = await sbInsertEvent({
      title: data.title,
      kind: data.kind,
      durationMin: data.durationMin,
      category: data.kind === "makan" ? data.category : "",
      anchorIso,
      place,
      meetingUrl,
    });
    code = created.code;
    eventId = created.eventId;
  } else {
    const sql = await getSql();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      code = makeCode(7);
      eventId = makeCode(16);
      try {
        await sql`
        insert into events (
          id, code, title, kind, duration_min, category, anchor_at,
          format, venue_name, room, address, platform, meeting_url, makan_when
        )
        values (
          ${eventId},
          ${code},
          ${data.title},
          ${data.kind},
          ${data.durationMin},
          ${data.kind === "makan" ? data.category : ""},
          ${anchorIso || null},
          ${place.format},
          ${place.venueName.slice(0, 80)},
          ${place.room.slice(0, 80)},
          ${place.address.slice(0, 160)},
          ${place.platform},
          ${meetingUrl},
          ${place.makanWhen}
        )
      `;
        break;
      } catch (error) {
        if (!isUnique(error) || attempt === 2) throw error;
      }
    }
  }

  for (const slot of prepared) {
    await insertSlot(eventId, data.title, slot.iso, slot.label, "", slot.index);
  }
  if (data.mission) {
    await writeMission(eventId, data.mission, data.missionSource ?? "rules");
  }
  return { code };
}

export async function castVote(data: { code: string; slotId: string; nickname: string; choice: Choice }) {
  if (await kairosSupabaseReady()) {
    await sbCastVote(data);
    return { ok: true as const };
  }
  const sql = await getSql();
  const rows = await sql<{ id: string; event_id: string }>`
    select s.id, s.event_id
    from slots s
    join events e on e.id = s.event_id
    where s.id = ${data.slotId} and e.code = ${data.code}
  `;
  const slot = rows[0];
  if (!slot) throw new Error("That option has left the board");
  const key = data.nickname.toLowerCase();
  await sql`
    insert into votes (id, slot_id, event_id, nickname, nickname_key, choice)
    values (${makeCode(12)}, ${slot.id}, ${slot.event_id}, ${data.nickname}, ${key}, ${data.choice})
    on conflict (slot_id, nickname_key)
    do update set choice = excluded.choice, nickname = excluded.nickname, created_at = now()
  `;
  return { ok: true as const };
}

export async function addSlot(data: { code: string; startsAt: string; label?: string }) {
  const event = await (async () => {
    if (await kairosSupabaseReady()) return sbBoardSize(data.code);
    const sql = await getSql();
    const events = await sql<{ id: string; title: string; n: number }>`
      select e.id, e.title, (select count(*) from slots s where s.event_id = e.id) as n
      from events e
      where e.code = ${data.code}
    `;
    const row = events[0];
    return row ? { id: row.id, title: row.title, n: Number(row.n) } : null;
  })();
  if (!event) throw new Error("That board does not exist");
  if (event.n >= 8) throw new Error("Eight options is the house limit");
  const iso = localSgtToIso(data.startsAt);
  assertReasonableIso(iso);
  await insertSlot(event.id, event.title, iso, data.label ?? "", "", event.n);
  return { ok: true as const };
}

export async function addComment(data: { code: string; nickname: string; body: string }) {
  if (await kairosSupabaseReady()) {
    const event = await sbCommentCount(data.code);
    if (!event) throw new Error("That board does not exist");
    if (event.n >= 40) throw new Error("This board is full of slips. Say the rest in person.");
    await sbInsertComment(event.id, data.nickname, data.body);
    return { ok: true as const };
  }
  const sql = await getSql();
  const events = await sql<{ id: string; n: number }>`
    select e.id, (select count(*) from comments c where c.event_id = e.id) as n
    from events e
    where e.code = ${data.code}
  `;
  const event = events[0];
  if (!event) throw new Error("That board does not exist");
  if (Number(event.n) >= 40) throw new Error("This board is full of slips. Say the rest in person.");
  await sql`
    insert into comments (id, event_id, nickname, body)
    values (${makeCode(12)}, ${event.id}, ${data.nickname}, ${data.body})
  `;
  return { ok: true as const };
}

function twoSentences(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const parts = clean.split(/(?<=[.!?])\s+/);
  return parts.slice(0, 2).join(" ").slice(0, 420);
}

async function askGrok(system: string, user: string, maxTokens: number): Promise<string | null> {
  return geminiText(system, user, maxTokens);
}

export async function consultOracle(data: { code: string }): Promise<{ text: string; source: "grok" | "almanac" }> {
  const event = await loadEvent(data.code);
  if (!event) throw new Error("That board does not exist");
  const lead = leadingSlot(event.slots) ?? event.slots[0] ?? null;
  const when = lead ? formatWhen(lead.startsAt) : "an open hour";
  const score = lead?.score ?? 0;
  const tally = counts(event.slots.flatMap((slot) => slot.votes));
  const grok = await askGrok(
    `${KAIROS_VOICE} Write exactly two short sentences. First: a funny Tong Shu note with one 宜 and one 忌, using only the facts given. Second: light Singlish boss advice. Do not name voters. Do not use a percentage.`,
    `Title: ${event.title}. Moment: ${when}. Almanac mark context ${score} out of 100. Votes: ${tally.love} great, ${tally.yes} can, ${tally.soft} please no, ${tally.no} cannot.`,
    160,
  );
  const text = twoSentences(grok || localOracle(event.title, when, score));
  const source = grok ? "grok" : "almanac";
  if (await kairosSupabaseReady()) {
    await sbUpdateOracle(event.id, text, source);
    return { text, source };
  }
  const sql = await getSql();
  await sql`
    update events
    set oracle_text = ${text}, oracle_source = ${source}, oracle_at = now()
    where id = ${event.id}
  `;
  return { text, source };
}

export async function spinVenue(data: { code: string; category: CategoryId; startsAt?: string }): Promise<{ name: string; source: "grok" | "list" }> {
  const found = await (async () => {
    if (await kairosSupabaseReady()) {
      const event = await sbBoardSize(data.code);
      if (!event) return null;
      return { event, avoid: await sbSlotLabels(event.id) };
    }
    const sql = await getSql();
    const events = await sql<{ id: string; title: string; n: number }>`
      select e.id, e.title, (select count(*) from slots s where s.event_id = e.id) as n
      from events e
      where e.code = ${data.code}
    `;
    const event = events[0];
    if (!event) return null;
    const existing = await sql<{ label: string }>`select label from slots where event_id = ${event.id}`;
    return {
      event: { id: event.id, title: event.title, n: Number(event.n) },
      avoid: existing.map((row) => row.label).filter(Boolean),
    };
  })();
  if (!found) throw new Error("That board does not exist");
  const { event, avoid } = found;
  if (event.n >= 8) throw new Error("Eight options is the house limit");
  const house = pickVenue(data.category, venueSalt(data.category, event.id), avoid);
  const grok = await askGrok(
    `Reply with exactly this venue name if it fits, or the word skip: ${house.name}`,
    `Category: ${categoryLabel(data.category)}. ${house.area}. ${house.blurb}`,
    24,
  );
  const echoed = Boolean(grok && grok.toLowerCase().includes(house.name.toLowerCase()));
  const local = data.startsAt && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(data.startsAt) ? localSgtToIso(data.startsAt) : nextEveningIso();
  const iso = preferEvening(local);
  assertReasonableIso(iso);
  await insertSlot(event.id, event.title, iso, house.name, `${house.area}. ${house.blurb}`.slice(0, 180), event.n);
  return { name: house.name, source: echoed ? "grok" : "list" };
}
