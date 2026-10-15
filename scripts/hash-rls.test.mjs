import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

const sqlText = readFileSync(new URL("../supabase/hash_it_out.sql", import.meta.url), "utf8");

async function db() {
  const pg = new PGlite();
  await pg.waitReady;
  await pg.exec(sqlText);
  return pg;
}

function token(length) {
  return "a".repeat(length);
}

test("sha256 is stored, not the raw token", async () => {
  const pg = await db();
  const host = "hosttokenhosttokenhost12";
  const created = await pg.query("select public.hash_create_session($1,$2,'','blockers','anonymous',true,false,3,false) as room", [
    host,
    "What is one thing slowing us down at work?",
  ]);
  const code = created.rows[0].room.code;
  const row = await pg.query("select host_token_hash from public.hash_sessions where join_code = $1", [code]);
  const expected = createHash("sha256").update(host).digest("hex");
  assert.equal(row.rows[0].host_token_hash, expected);
  assert.equal(row.rows[0].host_token_hash.includes(host), false);
});

test("anon cannot read hash tables and wrong tokens are denied", async () => {
  const pg = await db();
  const host = "hosttokenhosttokenhost12";
  const created = await pg.query("select public.hash_create_session($1,$2,'','blockers','choice',true,false,3,false) as room", [
    host,
    "What is one thing slowing us down at work?",
  ]);
  const code = created.rows[0].room.code;
  await pg.query("set role anon");
  for (const table of ["hash_sessions", "hash_participants", "hash_submissions", "hash_clusters", "hash_same_here", "hash_votes", "hash_cluster_events"]) {
    await assert.rejects(pg.query(`select * from public.${table}`), /permission denied|row-level security/i);
  }
  const guest = "participanttoken1";
  const snap = await pg.query("select public.hash_get_public_snapshot($1,$2) as room", [code, guest]);
  const payload = JSON.stringify(snap.rows[0].room);
  assert.equal(payload.includes("host_token_hash"), false);
  assert.equal(payload.includes("participant_token_hash"), false);
  assert.equal(payload.includes("participantId"), false);
  await assert.rejects(pg.query("select public.hash_get_host_snapshot($1,$2,$3)", [code, guest, guest]), /only the host/i);
  await assert.rejects(pg.query("select public.hash_get_public_snapshot($1,$2)", [code, "nope"]), /join again/i);
  await pg.query("reset role");
});

test("five anonymous voices stay five, survive a new connection, and blind is server-side", async () => {
  const pg = await db();
  const host = "hosttokenhosttokenhost12";
  const created = await pg.query(
    "select public.hash_create_session($1,$2,'context','blockers','anonymous',true,true,3,false) as room",
    [host, "What is one thing slowing us down at work?"],
  );
  const code = created.rows[0].room.code;
  const people = ["p111111111111111", "p222222222222222", "p333333333333333", "p444444444444444", "p555555555555555"];
  const lines = [
    "too many meetings",
    "meetings without decisions",
    "approval takes too long",
    "too many approval levels",
    "too many meetings",
  ];
  for (let i = 0; i < lines.length; i += 1) {
    await pg.query("select public.hash_submit_idea($1,$2,$3,true,'')", [code, people[i], lines[i]]);
  }
  const names = await pg.query("select display_name, anonymous from public.hash_submissions");
  assert.equal(names.rows.length, 5);
  assert.equal(names.rows.every((row) => row.display_name == null && row.anonymous === true), true);
  const again = await pg.query("select count(*)::int as n from public.hash_submissions");
  assert.equal(again.rows[0].n, 5);
  const hostRoom = (await pg.query("select public.hash_get_host_snapshot($1,$2,'') as room", [code, host])).rows[0].room;
  assert.equal(hostRoom.submissionCount, 5);
  assert.equal(JSON.stringify(hostRoom).includes("participant_token_hash"), false);
  const exact = hostRoom.themes.find((theme) => theme.voices === 2);
  assert.ok(exact, "exact repeats share one cluster");
  assert.equal(exact.lines.length, 2);
  const guest = (await pg.query("select public.hash_get_public_snapshot($1,$2) as room", [code, people[0]])).rows[0].room;
  assert.equal(guest.themes.length, 0);
  assert.equal(guest.loose.length, 1);
  assert.equal(guest.loose[0].text, "too many meetings");
  assert.equal(guest.submissionCount, 1);
  await pg.query("select public.hash_host_settings($1,$2,'reveal','{}'::jsonb)", [code, host]);
  const open = (await pg.query("select public.hash_get_public_snapshot($1,$2) as room", [code, people[1]])).rows[0].room;
  assert.ok(open.themes.length >= 1 || open.loose.length >= 1);
  await assert.rejects(pg.query("select public.hash_cast_vote($1,$2,$3)", [code, people[0], exact.id]), /voting is not open/i);
  await pg.query("select public.hash_host_settings($1,$2,'voting',$3::jsonb)", [code, host, JSON.stringify({ open: true, voteLimit: 1 })]);
  await pg.query("select public.hash_cast_vote($1,$2,$3)", [code, people[0], exact.id]);
  await assert.rejects(pg.query("select public.hash_cast_vote($1,$2,$3)", [code, people[0], exact.id === hostRoom.themes[0].id ? "missing" : hostRoom.themes[0].id]), /used your votes|theme is gone/i);
  const before = exact.voices;
  await pg.query("select public.hash_add_same_here($1,$2,$3)", [code, people[1], exact.id]);
  const after = (await pg.query("select public.hash_get_host_snapshot($1,$2,'') as room", [code, host])).rows[0].room;
  const theme = after.themes.find((item) => item.id === exact.id);
  assert.equal(theme.voices, before);
  assert.equal(theme.support, 1);
});

test("collation does not undo a host rename", async () => {
  const pg = await db();
  const host = "hosttokenhosttokenhost12";
  const created = await pg.query(
    "select public.hash_create_session($1,$2,'','blockers','anonymous',true,false,1,true) as room",
    [host, "What is one thing slowing us down at work?"],
  );
  const code = created.rows[0].room.code;
  await pg.query("select public.hash_submit_idea($1,$2,$3,true,'')", [code, "p111111111111111", "too many meetings"]);
  await pg.query("select public.hash_submit_idea($1,$2,$3,true,'')", [code, "p222222222222222", "too many meetings"]);
  await pg.query("select public.hash_submit_idea($1,$2,$3,true,'')", [code, "p333333333333333", "approval takes too long"]);
  const hostRoom = (await pg.query("select public.hash_get_host_snapshot($1,$2,'') as room", [code, host])).rows[0].room;
  const theme = hostRoom.themes.find((item) => item.voices === 2);
  assert.ok(theme);
  await pg.query("select public.hash_host_update_cluster($1,$2,$3,$4::jsonb)", [
    code,
    host,
    theme.id,
    JSON.stringify({ title: "Host title" }),
  ]);
  const group = [
    {
      id: theme.id,
      title: "Meeting overload",
      summary: "changed by collate",
      source: "rules",
      submissionIds: theme.lines.map((line) => line.id),
    },
  ];
  await pg.query("select public.hash_apply_collation($1,$2,$3::jsonb,false,false)", [code, host, JSON.stringify(group)]);
  const after = (await pg.query("select public.hash_get_host_snapshot($1,$2,'') as room", [code, host])).rows[0].room;
  const kept = after.themes.find((item) => item.id === theme.id);
  assert.equal(kept.title, "Host title");
  assert.equal(kept.locked, true);
  assert.equal(kept.voices, 2);
  await assert.rejects(
    pg.query("select public.hash_host_settings($1,$2,'lucky','{}'::jsonb)", [code, host]),
    /at least two themes/i,
  );
  const covered = (await pg.query("select public.hash_get_public_snapshot($1,$2) as room", [code, "p444444444444444"])).rows[0].room;
  await pg.query("select public.hash_host_settings($1,$2,'live',$3::jsonb)", [code, host, JSON.stringify({ show: false })]);
  const hiddenBoard = (await pg.query("select public.hash_get_public_snapshot($1,$2) as room", [code, "p111111111111111"])).rows[0].room;
  assert.equal(hiddenBoard.themes.length, 0);
  assert.equal(hiddenBoard.loose.length, 1);
  assert.equal(hiddenBoard.submissionCount, 1);
  assert.equal(JSON.stringify(hiddenBoard).includes("approval takes too long"), false);
  assert.equal(covered.role, "guest");
});
