import { geminiJson } from "./gemini.server-D3PyYOAp.mjs";
import { n as supabaseConfigured, t as getSupabase } from "./supabase-BKxuSUOP.mjs";
import { a as clusterNearDuplicates, c as luckyPick, d as tallyTheme, f as visibleToGuest, i as canCastVote, l as prominence, n as applyAiGroups, o as clusterThemes, r as boardCovered, s as guestAuthor, u as rulesSynthesis } from "./hash-lgZwuMrP.mjs";
import { t as getSql } from "./db-DS0ec2FZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hash.server-jKaHWnSQ.js
var alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
function makeHashId(length) {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	let out = "";
	for (const byte of bytes) out += alphabet[byte % 31];
	return out;
}
async function hashTokenDigest(token) {
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
	return [...new Uint8Array(buf)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function stamp(value) {
	if (!value) return "";
	if (value instanceof Date) return value.toISOString();
	const date = new Date(String(value));
	return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}
function asIdentity(value) {
	return value === "anonymous" || value === "named" ? value : "choice";
}
function asStatus(value) {
	if (value === "paused" || value === "voting" || value === "closed") return value;
	return "open";
}
function asSource(value) {
	if (value === "ai" || value === "facilitator") return value;
	return "rules";
}
function asAction(value) {
	if (value === "action" || value === "park" || value === "discuss" || value === "decide") return value;
	return "";
}
function mapSession(row) {
	return {
		id: String(row.id),
		code: String(row.code),
		hostTokenHash: String(row.host_token_hash ?? ""),
		prompt: String(row.prompt ?? ""),
		context: String(row.context ?? ""),
		starter: String(row.starter ?? "custom"),
		identityMode: asIdentity(String(row.identity_mode ?? "choice")),
		showLiveBoard: Boolean(row.show_live_board),
		blindRound: Boolean(row.blind_round),
		revealed: Boolean(row.revealed),
		votingEnabled: Boolean(row.voting_enabled),
		voteLimit: Number(row.vote_limit) === 1 ? 1 : 3,
		cosmicEnabled: Boolean(row.cosmic_enabled),
		status: asStatus(String(row.status ?? "open")),
		luckyClusterId: String(row.lucky_cluster_id ?? ""),
		synthesis: String(row.synthesis ?? ""),
		llmCalls: Number(row.llm_calls) || 0,
		autoLlm: Number(row.auto_llm) || 0,
		lastCollateAt: row.last_collate_at ? stamp(row.last_collate_at) : null,
		createdAt: stamp(row.created_at)
	};
}
var sbHash = null;
var sbChecked = 0;
async function useSupabase() {
	if (sbHash === true) return true;
	if (sbHash === false && Date.now() - sbChecked < 6e4) return false;
	sbChecked = Date.now();
	if (!supabaseConfigured()) {
		sbHash = false;
		return false;
	}
	try {
		const { error } = await getSupabase().from("hash_sessions").select("code").limit(1);
		sbHash = !error;
		return sbHash;
	} catch {
		sbHash = false;
		return false;
	}
}
async function loadSql(code) {
	const sql = await getSql();
	const sessionRow = (await sql`select * from hash_sessions where code = ${code} limit 1`)[0];
	if (!sessionRow) return null;
	const session = mapSession(sessionRow);
	const [participants, submissions, clusters, separations, supports, votes] = await Promise.all([
		sql`select id, token_hash, display_name, anonymous from hash_participants where session_id = ${session.id}`,
		sql`select id, participant_id, anonymous, display_name, body, cluster_id, hidden, created_at from hash_submissions where session_id = ${session.id} order by created_at asc`,
		sql`select * from hash_clusters where session_id = ${session.id}`,
		sql`select left_id, right_id from hash_separations where session_id = ${session.id}`,
		sql`select id, cluster_id, participant_id from hash_supports where session_id = ${session.id}`,
		sql`select id, cluster_id, participant_id from hash_votes where session_id = ${session.id}`
	]);
	const submissionParticipant = {};
	const submissionNames = {};
	return {
		session,
		participants: participants.map((row) => ({
			id: String(row.id),
			tokenHash: String(row.token_hash),
			displayName: String(row.display_name ?? ""),
			anonymous: Boolean(row.anonymous)
		})),
		submissions: submissions.map((row) => {
			submissionParticipant[String(row.id)] = String(row.participant_id ?? "");
			submissionNames[String(row.id)] = row.anonymous ? "" : String(row.display_name ?? "");
			return {
				id: String(row.id),
				text: String(row.body ?? ""),
				anonymous: Boolean(row.anonymous),
				createdAt: stamp(row.created_at),
				clusterId: row.cluster_id ? String(row.cluster_id) : null,
				hidden: Boolean(row.hidden)
			};
		}),
		clusters: clusters.map((row) => ({
			id: String(row.id),
			title: String(row.title ?? ""),
			summary: String(row.summary ?? ""),
			userLocked: Boolean(row.user_locked),
			source: asSource(String(row.source ?? "rules")),
			pinned: Boolean(row.pinned),
			hidden: Boolean(row.hidden),
			actionKind: asAction(String(row.action_kind ?? "")),
			actionNote: String(row.action_note ?? "")
		})),
		separations: separations.map((row) => ({
			a: String(row.left_id),
			b: String(row.right_id)
		})),
		supports: supports.map((row) => ({
			id: String(row.id),
			clusterId: String(row.cluster_id),
			participantId: String(row.participant_id)
		})),
		votes: votes.map((row) => ({
			id: String(row.id),
			clusterId: String(row.cluster_id),
			participantId: String(row.participant_id)
		})),
		submissionParticipant,
		submissionNames
	};
}
async function loadSb(code) {
	const sb = getSupabase();
	const { data, error } = await sb.from("hash_sessions").select("*").eq("code", code).maybeSingle();
	if (error) throw new Error(error.message);
	if (!data) return null;
	const session = mapSession(data);
	const [participants, submissions, clusters, separations, supports, votes] = await Promise.all([
		sb.from("hash_participants").select("id, token_hash, display_name, anonymous").eq("session_id", session.id),
		sb.from("hash_submissions").select("id, participant_id, anonymous, display_name, body, cluster_id, hidden, created_at").eq("session_id", session.id).order("created_at"),
		sb.from("hash_clusters").select("*").eq("session_id", session.id),
		sb.from("hash_separations").select("left_id, right_id").eq("session_id", session.id),
		sb.from("hash_supports").select("id, cluster_id, participant_id").eq("session_id", session.id),
		sb.from("hash_votes").select("id, cluster_id, participant_id").eq("session_id", session.id)
	]);
	for (const result of [
		participants,
		submissions,
		clusters,
		separations,
		supports,
		votes
	]) if (result.error) throw new Error(result.error.message);
	const submissionParticipant = {};
	const submissionNames = {};
	return {
		session,
		participants: (participants.data ?? []).map((row) => ({
			id: String(row.id),
			tokenHash: String(row.token_hash),
			displayName: String(row.display_name ?? ""),
			anonymous: Boolean(row.anonymous)
		})),
		submissions: (submissions.data ?? []).map((row) => {
			submissionParticipant[String(row.id)] = String(row.participant_id ?? "");
			submissionNames[String(row.id)] = row.anonymous ? "" : String(row.display_name ?? "");
			return {
				id: String(row.id),
				text: String(row.body ?? ""),
				anonymous: Boolean(row.anonymous),
				createdAt: stamp(row.created_at),
				clusterId: row.cluster_id ? String(row.cluster_id) : null,
				hidden: Boolean(row.hidden)
			};
		}),
		clusters: (clusters.data ?? []).map((row) => ({
			id: String(row.id),
			title: String(row.title ?? ""),
			summary: String(row.summary ?? ""),
			userLocked: Boolean(row.user_locked),
			source: asSource(String(row.source ?? "rules")),
			pinned: Boolean(row.pinned),
			hidden: Boolean(row.hidden),
			actionKind: asAction(String(row.action_kind ?? "")),
			actionNote: String(row.action_note ?? "")
		})),
		separations: (separations.data ?? []).map((row) => ({
			a: String(row.left_id),
			b: String(row.right_id)
		})),
		supports: (supports.data ?? []).map((row) => ({
			id: String(row.id),
			clusterId: String(row.cluster_id),
			participantId: String(row.participant_id)
		})),
		votes: (votes.data ?? []).map((row) => ({
			id: String(row.id),
			clusterId: String(row.cluster_id),
			participantId: String(row.participant_id)
		})),
		submissionParticipant,
		submissionNames
	};
}
async function loadHashBundle(code) {
	if (await useSupabase()) return loadSb(code);
	return loadSql(code);
}
async function hashCodeTaken(code) {
	return Boolean(await loadHashBundle(code));
}
async function insertHashSession(row) {
	const revealed = !row.blindRound;
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_sessions").insert({
			id: row.id,
			code: row.code,
			host_token_hash: row.hostTokenHash,
			prompt: row.prompt,
			context: row.context,
			starter: row.starter,
			identity_mode: row.identityMode,
			show_live_board: row.showLiveBoard,
			blind_round: row.blindRound,
			revealed,
			vote_limit: row.voteLimit,
			cosmic_enabled: row.cosmicEnabled
		});
		if (error) throw new Error(error.message);
		return;
	}
	await (await getSql())`insert into hash_sessions (id, code, host_token_hash, prompt, context, starter, identity_mode, show_live_board, blind_round, revealed, vote_limit, cosmic_enabled)
    values (${row.id}, ${row.code}, ${row.hostTokenHash}, ${row.prompt}, ${row.context}, ${row.starter}, ${row.identityMode}, ${row.showLiveBoard}, ${row.blindRound}, ${revealed}, ${row.voteLimit}, ${row.cosmicEnabled})`;
}
async function upsertParticipant(sessionId, tokenHash, displayName, anonymous) {
	if (await useSupabase()) {
		const sb = getSupabase();
		const existing = await sb.from("hash_participants").select("id").eq("session_id", sessionId).eq("token_hash", tokenHash).maybeSingle();
		if (existing.error) throw new Error(existing.error.message);
		if (existing.data?.id) {
			const { error } = await sb.from("hash_participants").update({
				display_name: displayName,
				anonymous
			}).eq("id", existing.data.id);
			if (error) throw new Error(error.message);
			return String(existing.data.id);
		}
		const id = makeHashId(16);
		const { error } = await sb.from("hash_participants").insert({
			id,
			session_id: sessionId,
			token_hash: tokenHash,
			display_name: displayName,
			anonymous
		});
		if (error) throw new Error(error.message);
		return id;
	}
	const sql = await getSql();
	const found = await sql`select id from hash_participants where session_id = ${sessionId} and token_hash = ${tokenHash} limit 1`;
	if (found[0]?.id) {
		await sql`update hash_participants set display_name = ${displayName}, anonymous = ${anonymous} where id = ${found[0].id}`;
		return found[0].id;
	}
	const id = makeHashId(16);
	await sql`insert into hash_participants (id, session_id, token_hash, display_name, anonymous) values (${id}, ${sessionId}, ${tokenHash}, ${displayName}, ${anonymous})`;
	return id;
}
async function recentSubmissionAt(participantId) {
	if (await useSupabase()) {
		const { data, error } = await getSupabase().from("hash_submissions").select("created_at").eq("participant_id", participantId).order("created_at", { ascending: false }).limit(1).maybeSingle();
		if (error) throw new Error(error.message);
		return stamp(data?.created_at);
	}
	return stamp((await (await getSql())`select created_at from hash_submissions where participant_id = ${participantId} order by created_at desc limit 1`)[0]?.created_at);
}
async function submissionCountFor(participantId) {
	if (await useSupabase()) {
		const { count, error } = await getSupabase().from("hash_submissions").select("id", {
			count: "exact",
			head: true
		}).eq("participant_id", participantId);
		if (error) throw new Error(error.message);
		return count ?? 0;
	}
	const rows = await (await getSql())`select count(*) as n from hash_submissions where participant_id = ${participantId}`;
	return Number(rows[0]?.n) || 0;
}
async function insertSubmission(row) {
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_submissions").insert({
			id: row.id,
			session_id: row.sessionId,
			participant_id: row.participantId,
			anonymous: row.anonymous,
			display_name: row.displayName,
			body: row.body
		});
		if (error) throw new Error(error.message);
		return;
	}
	await (await getSql())`insert into hash_submissions (id, session_id, participant_id, anonymous, display_name, body) values (${row.id}, ${row.sessionId}, ${row.participantId}, ${row.anonymous}, ${row.displayName}, ${row.body})`;
}
async function persistClusters(sessionId, before, after, beforeSubs, afterSubs) {
	const beforeIds = new Set(before.map((item) => item.id));
	const afterIds = new Set(after.map((item) => item.id));
	const created = after.filter((item) => !beforeIds.has(item.id));
	const updated = after.filter((item) => beforeIds.has(item.id));
	const removed = before.filter((item) => !afterIds.has(item.id)).map((item) => item.id);
	const moved = afterSubs.filter((item) => beforeSubs.find((prev) => prev.id === item.id)?.clusterId !== item.clusterId);
	if (await useSupabase()) {
		const sb = getSupabase();
		if (created.length) {
			const { error } = await sb.from("hash_clusters").insert(created.map((item) => ({
				id: item.id,
				session_id: sessionId,
				title: item.title,
				summary: item.summary,
				pinned: item.pinned,
				hidden: item.hidden,
				user_locked: item.userLocked,
				source: item.source,
				action_kind: item.actionKind,
				action_note: item.actionNote
			})));
			if (error) throw new Error(error.message);
		}
		for (const item of updated) {
			const { error } = await sb.from("hash_clusters").update({
				title: item.title,
				summary: item.summary,
				pinned: item.pinned,
				hidden: item.hidden,
				user_locked: item.userLocked,
				source: item.source,
				action_kind: item.actionKind,
				action_note: item.actionNote,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", item.id);
			if (error) throw new Error(error.message);
		}
		for (const item of moved) {
			const { error } = await sb.from("hash_submissions").update({ cluster_id: item.clusterId }).eq("id", item.id);
			if (error) throw new Error(error.message);
		}
		if (removed.length) {
			const { error } = await sb.from("hash_clusters").delete().in("id", removed);
			if (error) throw new Error(error.message);
		}
		return;
	}
	const sql = await getSql();
	for (const item of created) await sql`insert into hash_clusters (id, session_id, title, summary, pinned, hidden, user_locked, source, action_kind, action_note)
      values (${item.id}, ${sessionId}, ${item.title}, ${item.summary}, ${item.pinned}, ${item.hidden}, ${item.userLocked}, ${item.source}, ${item.actionKind}, ${item.actionNote})`;
	for (const item of updated) await sql`update hash_clusters set title = ${item.title}, summary = ${item.summary}, pinned = ${item.pinned}, hidden = ${item.hidden}, user_locked = ${item.userLocked}, source = ${item.source}, action_kind = ${item.actionKind}, action_note = ${item.actionNote}, updated_at = now() where id = ${item.id}`;
	for (const item of moved) await sql`update hash_submissions set cluster_id = ${item.clusterId} where id = ${item.id}`;
	for (const id of removed) await sql`delete from hash_clusters where id = ${id}`;
}
async function patchSession(id, patch) {
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_sessions").update(patch).eq("id", id);
		if (error) throw new Error(error.message);
		return;
	}
	const sql = await getSql();
	const keys = Object.keys(patch);
	if (!keys.length) return;
	const assignments = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
	const values = keys.map((key) => patch[key]);
	await sql.query(`update hash_sessions set ${assignments} where id = $${keys.length + 1}`, [...values, id]);
}
async function patchCluster(id, patch) {
	const next = {
		...patch,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_clusters").update(next).eq("id", id);
		if (error) throw new Error(error.message);
		return;
	}
	const sql = await getSql();
	const keys = Object.keys(next);
	const assignments = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
	await sql.query(`update hash_clusters set ${assignments} where id = $${keys.length + 1}`, [...keys.map((key) => next[key]), id]);
}
async function moveSubmission(submissionId, clusterId) {
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_submissions").update({ cluster_id: clusterId }).eq("id", submissionId);
		if (error) throw new Error(error.message);
		return;
	}
	await (await getSql())`update hash_submissions set cluster_id = ${clusterId} where id = ${submissionId}`;
}
async function hideSubmission(submissionId, hidden) {
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_submissions").update({ hidden }).eq("id", submissionId);
		if (error) throw new Error(error.message);
		return;
	}
	await (await getSql())`update hash_submissions set hidden = ${hidden} where id = ${submissionId}`;
}
async function addSeparations(sessionId, pairs) {
	const unique = /* @__PURE__ */ new Map();
	for (const pair of pairs) {
		if (!pair.a || !pair.b || pair.a === pair.b) continue;
		const left = pair.a < pair.b ? pair.a : pair.b;
		const right = pair.a < pair.b ? pair.b : pair.a;
		unique.set(`${left}|${right}`, {
			a: left,
			b: right
		});
	}
	if (!unique.size) return;
	if (await useSupabase()) {
		const sb = getSupabase();
		for (const pair of unique.values()) {
			const { error } = await sb.from("hash_separations").upsert({
				session_id: sessionId,
				left_id: pair.a,
				right_id: pair.b
			}, { onConflict: "session_id,left_id,right_id" });
			if (error) throw new Error(error.message);
		}
		return;
	}
	const sql = await getSql();
	for (const pair of unique.values()) await sql`insert into hash_separations (session_id, left_id, right_id) values (${sessionId}, ${pair.a}, ${pair.b}) on conflict do nothing`;
}
async function removeSeparations(sessionId, ids) {
	if (ids.length < 2) return;
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_separations").delete().eq("session_id", sessionId).in("left_id", ids).in("right_id", ids);
		if (error) throw new Error(error.message);
		return;
	}
	await (await getSql()).query("delete from hash_separations where session_id = $1 and left_id = any($2::text[]) and right_id = any($2::text[])", [sessionId, ids]);
}
async function deleteCluster(id) {
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_clusters").delete().eq("id", id);
		if (error) throw new Error(error.message);
		return;
	}
	await (await getSql())`delete from hash_clusters where id = ${id}`;
}
async function insertSupport(sessionId, clusterId, participantId) {
	const id = makeHashId(16);
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_supports").insert({
			id,
			session_id: sessionId,
			cluster_id: clusterId,
			participant_id: participantId
		});
		if (error && error.code !== "23505") throw new Error(error.message);
		return;
	}
	await (await getSql())`insert into hash_supports (id, session_id, cluster_id, participant_id) values (${id}, ${sessionId}, ${clusterId}, ${participantId}) on conflict do nothing`;
}
async function insertVote(sessionId, clusterId, participantId) {
	const id = makeHashId(16);
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_votes").insert({
			id,
			session_id: sessionId,
			cluster_id: clusterId,
			participant_id: participantId
		});
		if (error && error.code !== "23505") throw new Error(error.message);
		return;
	}
	await (await getSql())`insert into hash_votes (id, session_id, cluster_id, participant_id) values (${id}, ${sessionId}, ${clusterId}, ${participantId}) on conflict do nothing`;
}
async function retargetCluster(fromId, intoId) {
	if (await useSupabase()) {
		const sb = getSupabase();
		const supports = await sb.from("hash_supports").select("id, participant_id").eq("cluster_id", fromId);
		const votes = await sb.from("hash_votes").select("id, participant_id").eq("cluster_id", fromId);
		if (supports.error) throw new Error(supports.error.message);
		if (votes.error) throw new Error(votes.error.message);
		for (const row of supports.data ?? []) if ((await sb.from("hash_supports").select("id").eq("cluster_id", intoId).eq("participant_id", row.participant_id).maybeSingle()).data?.id) await sb.from("hash_supports").delete().eq("id", row.id);
		else await sb.from("hash_supports").update({ cluster_id: intoId }).eq("id", row.id);
		for (const row of votes.data ?? []) if ((await sb.from("hash_votes").select("id").eq("cluster_id", intoId).eq("participant_id", row.participant_id).maybeSingle()).data?.id) await sb.from("hash_votes").delete().eq("id", row.id);
		else await sb.from("hash_votes").update({ cluster_id: intoId }).eq("id", row.id);
		return;
	}
	const sql = await getSql();
	await sql.query(`delete from hash_supports s using hash_supports t
     where s.cluster_id = $1 and t.cluster_id = $2 and s.participant_id = t.participant_id`, [fromId, intoId]);
	await sql.query(`update hash_supports set cluster_id = $2 where cluster_id = $1`, [fromId, intoId]);
	await sql.query(`delete from hash_votes s using hash_votes t
     where s.cluster_id = $1 and t.cluster_id = $2 and s.participant_id = t.participant_id`, [fromId, intoId]);
	await sql.query(`update hash_votes set cluster_id = $2 where cluster_id = $1`, [fromId, intoId]);
}
async function insertCluster(sessionId, cluster) {
	if (await useSupabase()) {
		const { error } = await getSupabase().from("hash_clusters").insert({
			id: cluster.id,
			session_id: sessionId,
			title: cluster.title,
			summary: cluster.summary,
			pinned: cluster.pinned,
			hidden: cluster.hidden,
			user_locked: cluster.userLocked,
			source: cluster.source,
			action_kind: cluster.actionKind,
			action_note: cluster.actionNote
		});
		if (error) throw new Error(error.message);
		return;
	}
	await (await getSql())`insert into hash_clusters (id, session_id, title, summary, pinned, hidden, user_locked, source, action_kind, action_note)
    values (${cluster.id}, ${sessionId}, ${cluster.title}, ${cluster.summary}, ${cluster.pinned}, ${cluster.hidden}, ${cluster.userLocked}, ${cluster.source}, ${cluster.actionKind}, ${cluster.actionNote})`;
}
function safeEqual(left, right) {
	if (left.length !== right.length) return false;
	let out = 0;
	for (let index = 0; index < left.length; index += 1) out |= left.charCodeAt(index) ^ right.charCodeAt(index);
	return out === 0;
}
function parseSynthesis(raw) {
	if (!raw.trim()) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.topThemes)) return null;
		return {
			topThemes: parsed.topThemes.map(String).slice(0, 6),
			agreement: (parsed.agreement ?? []).map(String).slice(0, 6),
			differing: (parsed.differing ?? []).map(String).slice(0, 6),
			nextActions: (parsed.nextActions ?? []).map(String).slice(0, 6),
			questions: (parsed.questions ?? []).map(String).slice(0, 4),
			source: parsed.source === "ai" ? "ai" : "rules"
		};
	} catch {
		return null;
	}
}
function shapeRoom(bundle, viewer) {
	const session = bundle.session;
	const host = viewer.host;
	const mineId = viewer.participantId;
	const supportBy = /* @__PURE__ */ new Map();
	const voteBy = /* @__PURE__ */ new Map();
	const mineSupport = /* @__PURE__ */ new Set();
	const mineVote = /* @__PURE__ */ new Set();
	for (const row of bundle.supports) {
		supportBy.set(row.clusterId, (supportBy.get(row.clusterId) ?? 0) + 1);
		if (row.participantId === mineId) mineSupport.add(row.clusterId);
	}
	for (const row of bundle.votes) {
		voteBy.set(row.clusterId, (voteBy.get(row.clusterId) ?? 0) + 1);
		if (row.participantId === mineId) mineVote.add(row.clusterId);
	}
	const voiceFor = (item) => {
		const participant = bundle.submissionParticipant[item.id] ?? "";
		const mine = Boolean(mineId) && participant === mineId;
		return {
			id: item.id,
			text: item.text,
			label: guestAuthor(item.anonymous, bundle.submissionNames[item.id] ?? ""),
			anonymous: item.anonymous,
			createdAt: item.createdAt,
			mine,
			hidden: item.hidden
		};
	};
	const canSee = (item) => {
		if (item.hidden && !host) return false;
		const mine = Boolean(mineId) && bundle.submissionParticipant[item.id] === mineId;
		if (host) return true;
		return visibleToGuest({
			blind: session.blindRound,
			revealed: session.revealed,
			showLive: session.showLiveBoard,
			mine
		});
	};
	const themes = bundle.clusters.map((cluster) => {
		const lines = bundle.submissions.filter((item) => item.clusterId === cluster.id && canSee(item)).map(voiceFor);
		const visibleLines = lines.filter((line) => !line.hidden);
		const anonymousVoices = visibleLines.filter((line) => line.anonymous).length;
		const tally = tallyTheme(visibleLines.length, supportBy.get(cluster.id) ?? 0, voteBy.get(cluster.id) ?? 0);
		return {
			id: cluster.id,
			title: cluster.title,
			summary: cluster.summary,
			voices: tally.independentVoiceCount,
			anonymousVoices,
			support: host || session.revealed || session.showLiveBoard ? tally.supportCount : 0,
			votes: tally.voteCount,
			pinned: cluster.pinned,
			hidden: cluster.hidden,
			locked: cluster.userLocked,
			source: cluster.source,
			actionKind: cluster.actionKind,
			actionNote: cluster.actionNote,
			mineSupported: mineSupport.has(cluster.id),
			mineVoted: mineVote.has(cluster.id),
			prominence: prominence(tally.independentVoiceCount),
			lines: host ? lines : visibleLines
		};
	}).filter((theme) => host ? true : !theme.hidden && theme.voices > 0).sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.voices - a.voices || b.votes - a.votes || a.title.localeCompare(b.title));
	const loose = bundle.submissions.filter((item) => !item.clusterId && canSee(item)).map(voiceFor).filter((line) => host || !line.hidden);
	const cover = boardCovered({
		host,
		blind: session.blindRound,
		revealed: session.revealed,
		showLive: session.showLiveBoard
	});
	const ownLines = bundle.submissions.filter((item) => Boolean(mineId) && bundle.submissionParticipant[item.id] === mineId && !item.hidden).map(voiceFor);
	const visibleThemes = themes.filter((theme) => !theme.hidden && theme.voices > 0);
	const strongest = [...visibleThemes].sort((a, b) => b.voices - a.voices)[0];
	const favourite = [...visibleThemes].filter((theme) => theme.votes > 0).sort((a, b) => b.votes - a.votes)[0];
	const hiddenSignal = [...visibleThemes].filter((theme) => theme.anonymousVoices >= 2 && theme.anonymousVoices >= theme.voices - theme.anonymousVoices).sort((a, b) => b.anonymousVoices - a.anonymousVoices)[0];
	return {
		role: host ? "host" : "guest",
		sessionId: session.id,
		code: session.code,
		prompt: session.prompt,
		context: session.context,
		starter: session.starter,
		identityMode: session.identityMode,
		showLiveBoard: session.showLiveBoard,
		blindRound: session.blindRound,
		revealed: session.revealed,
		votingEnabled: session.status === "voting",
		voteLimit: session.voteLimit,
		votesCast: mineId ? bundle.votes.filter((vote) => vote.participantId === mineId).length : 0,
		cosmicEnabled: session.cosmicEnabled,
		status: session.status,
		participantCount: cover ? ownLines.length ? 1 : 0 : bundle.participants.length,
		submissionCount: cover ? ownLines.length : bundle.submissions.filter((item) => !item.hidden || host).length,
		uncollatedCount: cover ? 0 : bundle.submissions.filter((item) => !item.clusterId && !item.hidden).length,
		themeCount: cover ? 0 : visibleThemes.length,
		llmCalls: host ? session.llmCalls : 0,
		themes: cover ? [] : themes,
		loose: cover ? ownLines : loose,
		strongestId: cover ? "" : strongest?.id ?? "",
		favouriteId: cover ? "" : favourite?.id ?? "",
		hiddenSignalId: cover ? "" : hiddenSignal?.id ?? "",
		luckyId: !cover && session.cosmicEnabled ? session.luckyClusterId : "",
		synthesis: cover ? null : parseSynthesis(session.synthesis),
		sharePath: `/?mode=hash&code=${session.code}`
	};
}
async function roomFor(code, participantToken, hostToken) {
	const bundle = await loadHashBundle(code);
	if (!bundle) throw new Error("That code has no room.");
	const digest = participantToken ? await hashTokenDigest(participantToken) : "";
	const participant = bundle.participants.find((item) => item.tokenHash === digest);
	const hostDigest = hostToken ? await hashTokenDigest(hostToken) : "";
	return shapeRoom(bundle, {
		host: Boolean(hostDigest) && safeEqual(hostDigest, bundle.session.hostTokenHash),
		participantId: participant?.id ?? ""
	});
}
async function requireBundle(code, hostToken) {
	const bundle = await loadHashBundle(code);
	if (!bundle) throw new Error("That code has no room.");
	if (!safeEqual(await hashTokenDigest(hostToken), bundle.session.hostTokenHash)) throw new Error("Only the host can do that.");
	return bundle;
}
async function resolveJoin(code) {
	return await hashCodeTaken(code) ? { kind: "hash" } : { kind: "meet" };
}
async function createHashSession(input) {
	const hostToken = makeHashId(32);
	const hostTokenHash = await hashTokenDigest(hostToken);
	for (let attempt = 0; attempt < 5; attempt += 1) {
		const code = makeHashId(6);
		if (await hashCodeTaken(code)) continue;
		const id = makeHashId(16);
		try {
			await insertHashSession({
				id,
				code,
				hostTokenHash,
				prompt: input.prompt,
				context: input.context,
				starter: input.starter,
				identityMode: input.identityMode,
				showLiveBoard: input.showLiveBoard,
				blindRound: input.blindRound,
				voteLimit: input.voteLimit,
				cosmicEnabled: input.cosmicEnabled
			});
			return {
				code,
				hostToken
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : "";
			if (!/duplicate|unique/i.test(message) || attempt === 4) throw error;
		}
	}
	throw new Error("Could not open a room.");
}
async function readHashRoom(code, participantToken, hostToken) {
	return roomFor(code, participantToken, hostToken);
}
function cleanName(value) {
	const name = value.trim().slice(0, 24);
	if (!name || name.includes("@")) return "";
	return name;
}
async function throwIdea(input) {
	const bundle = await loadHashBundle(input.code);
	if (!bundle) throw new Error("That code has no room.");
	if (bundle.session.status === "paused") throw new Error("The room is paused.");
	if (bundle.session.status === "closed" || bundle.session.status === "voting") throw new Error("The room is not taking ideas right now.");
	const text = input.text.trim().replace(/\s+/g, " ").slice(0, 240);
	if (text.length < 2) throw new Error("Throw in a few words.");
	const forcedAnon = bundle.session.identityMode === "anonymous" || bundle.session.identityMode === "choice" && input.anonymous;
	const named = bundle.session.identityMode === "named" || bundle.session.identityMode === "choice" && !input.anonymous;
	const displayName = forcedAnon ? "" : cleanName(input.displayName);
	if (named && !displayName) throw new Error(bundle.session.identityMode === "named" ? "Add a name." : "Add a name, or stay anonymous.");
	const anonymous = !displayName;
	const tokenHash = await hashTokenDigest(input.participantToken);
	const participantId = await upsertParticipant(bundle.session.id, tokenHash, displayName, anonymous);
	if (await submissionCountFor(participantId) >= 20) throw new Error("That's plenty from you for this room.");
	const previous = await recentSubmissionAt(participantId);
	if (previous && Date.now() - new Date(previous).getTime() < 800) throw new Error("Give it a second.");
	await insertSubmission({
		id: makeHashId(16),
		sessionId: bundle.session.id,
		participantId,
		anonymous,
		displayName,
		body: text
	});
	await regroup(input.code, "near");
	return roomFor(input.code, input.participantToken, input.hostToken);
}
async function regroup(code, mode) {
	const bundle = await loadHashBundle(code);
	if (!bundle) return null;
	const next = mode === "near" ? clusterNearDuplicates(bundle.submissions, bundle.clusters, bundle.separations) : clusterThemes(bundle.submissions, bundle.clusters, bundle.separations);
	await persistClusters(bundle.session.id, bundle.clusters, next.clusters, bundle.submissions, next.submissions);
	return loadHashBundle(code);
}
async function supportTheme(input) {
	const bundle = await loadHashBundle(input.code);
	if (!bundle) throw new Error("That code has no room.");
	if (bundle.session.status === "closed" || bundle.session.status === "paused") throw new Error("The room is not taking that right now.");
	if (!bundle.clusters.some((cluster) => cluster.id === input.clusterId && !cluster.hidden)) throw new Error("That theme is gone.");
	const tokenHash = await hashTokenDigest(input.participantToken);
	const participantId = await upsertParticipant(bundle.session.id, tokenHash, "", true);
	await insertSupport(bundle.session.id, input.clusterId, participantId);
	return roomFor(input.code, input.participantToken, "");
}
async function voteTheme(input) {
	const bundle = await loadHashBundle(input.code);
	if (!bundle) throw new Error("That code has no room.");
	if (bundle.session.status !== "voting") throw new Error("Voting is not open.");
	if (!bundle.clusters.some((cluster) => cluster.id === input.clusterId && !cluster.hidden)) throw new Error("That theme is gone.");
	const tokenHash = await hashTokenDigest(input.participantToken);
	const participantId = bundle.participants.find((item) => item.tokenHash === tokenHash)?.id ?? await upsertParticipant(bundle.session.id, tokenHash, "", true);
	const cast = bundle.votes.filter((vote) => vote.participantId === participantId);
	if (cast.some((vote) => vote.clusterId === input.clusterId)) return roomFor(input.code, input.participantToken, "");
	if (!canCastVote(cast.length, bundle.session.voteLimit)) throw new Error(`You have ${bundle.session.voteLimit} ${bundle.session.voteLimit === 1 ? "vote" : "votes"}.`);
	await insertVote(bundle.session.id, input.clusterId, participantId);
	return roomFor(input.code, input.participantToken, "");
}
async function askGemini(bundle) {
	const loose = bundle.submissions.filter((item) => !item.clusterId && !item.hidden).slice(0, 40);
	if (!loose.length) return [];
	const existing = bundle.clusters.filter((cluster) => !cluster.hidden).map((cluster) => cluster.title).slice(0, 12);
	const raw = await geminiJson("You group short workplace comments into themes. Use only the comments given. Do not invent organisations, motives, fear, morale, or facts that were not written. Titles are 2-4 words. Summaries are one sentence using their words. Do not merge comments a host has already separated. Return JSON only.", JSON.stringify({
		prompt: bundle.session.prompt,
		existingThemes: existing,
		comments: loose.map((item) => ({
			id: item.id,
			text: item.text
		}))
	}), {
		type: "object",
		properties: { groups: {
			type: "array",
			items: {
				type: "object",
				properties: {
					title: { type: "string" },
					summary: { type: "string" },
					submissionIds: {
						type: "array",
						items: { type: "string" }
					}
				},
				required: [
					"title",
					"summary",
					"submissionIds"
				]
			}
		} },
		required: ["groups"]
	}, 700);
	if (!raw || typeof raw !== "object") return null;
	const groups = raw.groups;
	if (!Array.isArray(groups)) return null;
	return groups.map((group) => {
		const row = group;
		return {
			title: typeof row.title === "string" ? row.title : "",
			summary: typeof row.summary === "string" ? row.summary : "",
			submissionIds: Array.isArray(row.submissionIds) ? row.submissionIds.filter((id) => typeof id === "string") : []
		};
	}).filter((group) => group.title && group.submissionIds.length);
}
async function collateRoom(code, hostToken, auto) {
	const bundle = await requireBundle(code, hostToken);
	const now = Date.now();
	const last = bundle.session.lastCollateAt ? new Date(bundle.session.lastCollateAt).getTime() : 0;
	if (last && now - last < (auto ? 15e3 : 4e3)) return roomFor(code, "", hostToken);
	const current = await regroup(code, "themes") ?? bundle;
	const loose = current.submissions.filter((item) => !item.clusterId && !item.hidden);
	if (!(loose.length === 0 || auto && (bundle.session.autoLlm >= 2 || loose.length < 3))) {
		const groups = await askGemini(current);
		if (groups?.length) {
			const applied = applyAiGroups(current.submissions, current.clusters, current.separations, groups);
			await persistClusters(current.session.id, current.clusters, applied.clusters, current.submissions, applied.submissions);
			await patchSession(current.session.id, {
				llm_calls: bundle.session.llmCalls + 1,
				auto_llm: bundle.session.autoLlm + (auto ? 1 : 0),
				last_collate_at: (/* @__PURE__ */ new Date()).toISOString()
			});
		} else await patchSession(current.session.id, { last_collate_at: (/* @__PURE__ */ new Date()).toISOString() });
	} else await patchSession(current.session.id, { last_collate_at: (/* @__PURE__ */ new Date()).toISOString() });
	return roomFor(code, "", hostToken);
}
async function summariseRoom(code, hostToken) {
	const bundle = await requireBundle(code, hostToken);
	const themes = bundle.clusters.map((cluster) => ({
		title: cluster.title,
		summary: cluster.summary,
		voices: bundle.submissions.filter((item) => item.clusterId === cluster.id && !item.hidden).length,
		actionKind: cluster.actionKind,
		actionNote: cluster.actionNote,
		lines: bundle.submissions.filter((item) => item.clusterId === cluster.id && !item.hidden).map((item) => item.text).slice(0, 8)
	})).filter((theme) => theme.voices > 0);
	const fallback = rulesSynthesis(bundle.session.prompt, themes);
	const raw = await geminiJson("Summarise only the comments provided. Do not invent organisational facts, emotions, or causes that nobody wrote. Keep each line under 18 words.", JSON.stringify({
		prompt: bundle.session.prompt,
		themes
	}), {
		type: "object",
		properties: {
			topThemes: {
				type: "array",
				items: { type: "string" }
			},
			agreement: {
				type: "array",
				items: { type: "string" }
			},
			differing: {
				type: "array",
				items: { type: "string" }
			},
			nextActions: {
				type: "array",
				items: { type: "string" }
			},
			questions: {
				type: "array",
				items: { type: "string" }
			}
		},
		required: [
			"topThemes",
			"agreement",
			"differing",
			"nextActions",
			"questions"
		]
	}, 500);
	const synthesis = raw && typeof raw === "object" ? {
		topThemes: arrayOf(raw, "topThemes"),
		agreement: arrayOf(raw, "agreement"),
		differing: arrayOf(raw, "differing"),
		nextActions: arrayOf(raw, "nextActions"),
		questions: arrayOf(raw, "questions"),
		source: "ai"
	} : fallback;
	await patchSession(bundle.session.id, {
		synthesis: JSON.stringify(synthesis),
		llm_calls: bundle.session.llmCalls + (synthesis.source === "ai" ? 1 : 0)
	});
	return roomFor(code, "", hostToken);
}
function arrayOf(raw, key) {
	const value = raw[key];
	return Array.isArray(value) ? value.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 6) : [];
}
async function hostCommand(code, hostToken, command) {
	const bundle = await requireBundle(code, hostToken);
	const session = bundle.session;
	if (command.action === "pause") await patchSession(session.id, { status: "paused" });
	if (command.action === "resume") await patchSession(session.id, { status: session.status === "closed" ? "closed" : "open" });
	if (command.action === "reveal") await patchSession(session.id, {
		revealed: true,
		show_live_board: true
	});
	if (command.action === "end") await patchSession(session.id, { status: "closed" });
	if (command.action === "voting") await patchSession(session.id, {
		status: command.open ? "voting" : "open",
		voting_enabled: command.open,
		...command.voteLimit ? { vote_limit: command.voteLimit } : {}
	});
	if (command.action === "live") await patchSession(session.id, { show_live_board: command.show });
	if (command.action === "cosmic") await patchSession(session.id, {
		cosmic_enabled: command.enabled,
		...command.enabled ? {} : { lucky_cluster_id: "" }
	});
	if (command.action === "rename") {
		const title = command.title.trim().slice(0, 60);
		if (title) await patchCluster(command.clusterId, {
			title,
			user_locked: true,
			source: "facilitator"
		});
	}
	if (command.action === "pin") await patchCluster(command.clusterId, {
		pinned: command.pinned,
		user_locked: true,
		source: "facilitator"
	});
	if (command.action === "mark") await patchCluster(command.clusterId, {
		action_kind: command.kind,
		action_note: (command.note ?? "").trim().slice(0, 160),
		user_locked: true,
		source: "facilitator"
	});
	if (command.action === "hide") await hideSubmission(command.submissionId, command.hidden);
	if (command.action === "merge" && command.intoId !== command.fromId) {
		const members = bundle.submissions.filter((item) => item.clusterId === command.intoId || item.clusterId === command.fromId).map((item) => item.id);
		for (const item of bundle.submissions) if (item.clusterId === command.fromId) await moveSubmission(item.id, command.intoId);
		await removeSeparations(session.id, members);
		await retargetCluster(command.fromId, command.intoId);
		await patchCluster(command.intoId, {
			user_locked: true,
			source: "facilitator"
		});
		await deleteCluster(command.fromId);
	}
	if (command.action === "split") {
		const origin = bundle.submissions.filter((item) => item.clusterId === command.clusterId);
		const moving = origin.find((item) => item.id === command.submissionId);
		if (moving) {
			const created = {
				id: makeHashId(16),
				title: moving.text.trim().slice(0, 42),
				summary: moving.text.trim().slice(0, 140),
				userLocked: true,
				source: "facilitator",
				pinned: false,
				hidden: false,
				actionKind: "",
				actionNote: ""
			};
			await insertCluster(session.id, created);
			await moveSubmission(moving.id, created.id);
			await addSeparations(session.id, origin.filter((item) => item.id !== moving.id).map((item) => ({
				a: moving.id,
				b: item.id
			})));
			if (origin.filter((item) => item.id !== moving.id).length === 0) await deleteCluster(command.clusterId);
			else await patchCluster(command.clusterId, {
				user_locked: true,
				source: "facilitator"
			});
		}
	}
	if (command.action === "move") {
		const current = bundle.submissions.find((item) => item.id === command.submissionId);
		if (current && command.clusterId) {
			const siblings = bundle.submissions.filter((item) => item.clusterId === current.clusterId && item.id !== current.id);
			await moveSubmission(current.id, command.clusterId);
			await addSeparations(session.id, siblings.map((item) => ({
				a: current.id,
				b: item.id
			})));
			await patchCluster(command.clusterId, {
				user_locked: true,
				source: "facilitator"
			});
		}
	}
	if (command.action === "lucky") {
		const eligible = bundle.clusters.filter((cluster) => !cluster.hidden && cluster.actionKind !== "park").filter((cluster) => bundle.submissions.some((item) => item.clusterId === cluster.id && !item.hidden)).map((cluster) => cluster.id);
		const pick = luckyPick(eligible, session.id);
		if (pick) await patchSession(session.id, {
			lucky_cluster_id: pick,
			cosmic_enabled: true
		});
	}
	return roomFor(code, "", hostToken);
}
//#endregion
export { collateRoom, createHashSession, hostCommand, readHashRoom, resolveJoin, summariseRoom, supportTheme, throwIdea, voteTheme };
