import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

const sqlText = readFileSync(new URL("../supabase/hash_persistence.sql", import.meta.url), "utf8");

async function db() {
  const pg = new PGlite();
  await pg.waitReady;
  await pg.exec(`
    do $$
    begin
      if not exists (select 1 from pg_roles where rolname = 'anon') then
        create role anon;
      end if;
      if not exists (select 1 from pg_roles where rolname = 'authenticated') then
        create role authenticated;
      end if;
    end
    $$;
    create table public.hash_sessions (
      id uuid primary key default gen_random_uuid(),
      join_code text not null unique,
      host_token_hash text not null,
      prompt text not null default '',
      show_live_board boolean not null default true,
      blind_first_round boolean not null default false,
      revealed boolean not null default false,
      cosmic_enabled boolean not null default false,
      status text not null default 'OPEN',
      room_summary jsonb,
      lucky_cluster_id uuid,
      lucky_picked_at timestamptz,
      updated_at timestamptz not null default now()
    );
    create table public.hash_participants (
      id uuid primary key default gen_random_uuid(),
      session_id uuid not null,
      participant_token_hash text not null
    );
    create table public.hash_clusters (
      id uuid primary key default gen_random_uuid(),
      session_id uuid not null,
      title text not null default '',
      is_hidden boolean not null default false,
      action_status text,
      action_note text,
      updated_at timestamptz not null default now()
    );
    create table public.hash_submissions (
      id uuid primary key default gen_random_uuid(),
      session_id uuid not null,
      cluster_id uuid,
      moderation_status text not null default 'VISIBLE'
    );
    create table public.hash_votes (
      id uuid primary key default gen_random_uuid(),
      session_id uuid not null,
      cluster_id uuid not null,
      participant_id uuid not null
    );
    create schema if not exists extensions;
    create sequence if not exists ext_seq;
    create or replace function extensions.gen_random_bytes(n integer)
    returns bytea language plpgsql as $fn$
    declare
      v integer := nextval('ext_seq');
      b bytea := '\\x00000000'::bytea;
    begin
      b := set_byte(b, 0, v);
      return b;
    end;
    $fn$;
    create or replace function public.hash_require_host(p_host_token text, p_join_code text)
    returns public.hash_sessions language plpgsql as $fn$
    declare s public.hash_sessions;
    begin
      select * into s from public.hash_sessions
      where join_code = p_join_code and host_token_hash = p_host_token;
      if s.id is null then raise exception 'Only the host can do that'; end if;
      return s;
    end;
    $fn$;
    create or replace function public.hash_require_participant(p_join_code text, p_participant_token text)
    returns public.hash_participants language plpgsql as $fn$
    declare s public.hash_sessions; p public.hash_participants;
    begin
      select * into s from public.hash_sessions where join_code = p_join_code;
      if s.id is null then raise exception 'Room not found'; end if;
      select * into p from public.hash_participants
      where session_id = s.id and participant_token_hash = p_participant_token;
      if p.id is null then raise exception 'Join again from this phone'; end if;
      return p;
    end;
    $fn$;
  `);
  await pg.exec(sqlText);
  return pg;
}

const host = "hosttokenhosttokenhosttoken";
const guest = "guesttokenguesttokenguesttoken";

async function seed(pg) {
  const session = await pg.query(
    `insert into public.hash_sessions (join_code, host_token_hash, prompt, show_live_board, cosmic_enabled)
     values ('E1CA55', $1, 'What is one thing slowing us down at work?', true, false)
     returning id`,
    [host],
  );
  const sessionId = session.rows[0].id;
  await pg.query(
    `insert into public.hash_participants (session_id, participant_token_hash) values ($1, $2)`,
    [sessionId, guest],
  );
  const make = async (title, status, hidden, moderation) => {
    const cluster = await pg.query(
      `insert into public.hash_clusters (session_id, title, action_status, is_hidden)
       values ($1, $2, $3, $4) returning id`,
      [sessionId, title, status, hidden],
    );
    const id = cluster.rows[0].id;
    await pg.query(
      `insert into public.hash_submissions (session_id, cluster_id, moderation_status) values ($1, $2, $3)`,
      [sessionId, id, moderation],
    );
    return id;
  };
  const meetings = await make("too many meetings", null, false, "VISIBLE");
  const approval = await make("approval takes too long", null, false, "VISIBLE");
  const parked = await make("parked theme", "PARK", false, "VISIBLE");
  const hidden = await make("hidden theme", null, true, "VISIBLE");
  await pg.query(
    `insert into public.hash_votes (session_id, cluster_id, participant_id)
     select $1, $2, id from public.hash_participants where session_id = $1 limit 1`,
    [sessionId, meetings],
  );
  return { sessionId, meetings, approval, parked, hidden };
}

test("summary, action note, and lucky pick persist without exposing tables", async () => {
  const pg = await db();
  const { sessionId, meetings, approval, parked, hidden } = await seed(pg);
  const summary = {
    topThemes: ["Too many meetings"],
    agreement: ["Meetings are heavy"],
    differing: ["Some want more time"],
    nextActions: ["Review the approval workflow"],
    questions: ["What is one thing slowing us down at work?"],
    source: "ai",
  };
  const saved = await pg.query(
    "select public.hash_host_save_summary($1, $2, $3::jsonb) as summary",
    ["E1CA55", host, JSON.stringify(summary)],
  );
  assert.equal(saved.rows[0].summary.summaryVersion, 1);
  assert.equal(saved.rows[0].summary.source, "ai");
  assert.equal(saved.rows[0].summary.topThemes[0], "Too many meetings");
  assert.ok(saved.rows[0].summary.generatedAt);
  const again = await pg.query(
    "select public.hash_host_save_summary($1, $2, $3::jsonb) as summary",
    ["E1CA55", host, JSON.stringify({ ...summary, source: "rules" })],
  );
  assert.equal(again.rows[0].summary.summaryVersion, 2);

  await assert.rejects(
    pg.query("select public.hash_host_save_summary($1, $2, $3::jsonb)", ["E1CA55", "nope-nope-nope-nope-nope-nope", JSON.stringify(summary)]),
    /only the host/i,
  );

  await pg.query("select public.hash_host_set_action_note($1, $2, $3, $4)", [
    "E1CA55",
    host,
    approval,
    "Review and simplify the approval workflow.",
  ]);
  const noted = await pg.query("select action_status, action_note from public.hash_clusters where id = $1", [approval]);
  assert.equal(noted.rows[0].action_note, "Review and simplify the approval workflow.");
  assert.equal(noted.rows[0].action_status, null);
  await pg.query("update public.hash_clusters set title = 'Approval process', action_status = 'ACTION' where id = $1", [approval]);
  const kept = await pg.query("select action_note, action_status from public.hash_clusters where id = $1", [approval]);
  assert.equal(kept.rows[0].action_note, "Review and simplify the approval workflow.");
  assert.equal(kept.rows[0].action_status, "ACTION");
  await pg.query("select public.hash_host_set_action_note($1, $2, $3, '')", ["E1CA55", host, approval]);
  const cleared = await pg.query("select action_note from public.hash_clusters where id = $1", [approval]);
  assert.equal(cleared.rows[0].action_note, null);
  await pg.query("select public.hash_host_set_action_note($1, $2, $3, $4)", [
    "E1CA55",
    host,
    approval,
    "Review and simplify the approval workflow.",
  ]);

  await assert.rejects(
    pg.query("select public.hash_host_lucky_pick($1, $2, false)", ["E1CA55", host]),
    /cosmic mode/i,
  );
  await pg.query("update public.hash_sessions set cosmic_enabled = true where id = $1", [sessionId]);
  const first = await pg.query("select public.hash_host_lucky_pick($1, $2, false) as pick", ["E1CA55", host]);
  const luckyId = first.rows[0].pick.luckyId;
  assert.ok(luckyId === meetings || luckyId === approval);
  assert.notEqual(luckyId, parked);
  assert.notEqual(luckyId, hidden);
  const second = await pg.query("select public.hash_host_lucky_pick($1, $2, false) as pick", ["E1CA55", host]);
  assert.equal(second.rows[0].pick.luckyId, luckyId);
  const rerolled = await pg.query("select public.hash_host_lucky_pick($1, $2, true) as pick", ["E1CA55", host]);
  assert.notEqual(rerolled.rows[0].pick.luckyId, luckyId);
  assert.ok(rerolled.rows[0].pick.luckyId === meetings || rerolled.rows[0].pick.luckyId === approval);
  const votes = await pg.query("select count(*)::int as n from public.hash_votes where session_id = $1", [sessionId]);
  assert.equal(votes.rows[0].n, 1);

  const hostView = await pg.query("select public.hash_get_room_extras($1, $2, '') as extras", ["E1CA55", host]);
  assert.equal(hostView.rows[0].extras.shown, true);
  assert.equal(hostView.rows[0].extras.summary.summaryVersion, 2);
  assert.equal(hostView.rows[0].extras.notes.length, 1);
  assert.equal(hostView.rows[0].extras.notes[0].actionNote, "Review and simplify the approval workflow.");
  assert.equal(hostView.rows[0].extras.luckyId, rerolled.rows[0].pick.luckyId);
  assert.equal(Object.hasOwn(hostView.rows[0].extras, "host_token_hash"), false);

  const guestView = await pg.query("select public.hash_get_room_extras($1, '', $2) as extras", ["E1CA55", guest]);
  assert.equal(guestView.rows[0].extras.summary.topThemes[0], "Too many meetings");
  assert.equal(guestView.rows[0].extras.luckyId, rerolled.rows[0].pick.luckyId);

  await pg.query("update public.hash_sessions set show_live_board = false where id = $1", [sessionId]);
  const covered = await pg.query("select public.hash_get_room_extras($1, '', $2) as extras", ["E1CA55", guest]);
  assert.equal(covered.rows[0].extras.shown, false);
  assert.equal(covered.rows[0].extras.summary, null);
  assert.equal(covered.rows[0].extras.luckyId, "");
  assert.equal(covered.rows[0].extras.notes.length, 0);
  const hostCovered = await pg.query("select public.hash_get_room_extras($1, $2, '') as extras", ["E1CA55", host]);
  assert.equal(hostCovered.rows[0].extras.shown, true);
  assert.equal(hostCovered.rows[0].extras.summary.summaryVersion, 2);

  const who = await pg.query("select current_user as user");
  await pg.exec("set role anon");
  await assert.rejects(pg.query("select id from public.hash_sessions"), /permission denied/i);
  await assert.rejects(pg.query("select public.hash_finish_host($1, $2)", [host, "E1CA55"]), /permission denied/i);
  await pg.exec(`set role "${who.rows[0].user}"`);
});
