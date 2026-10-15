import { a as missionSchema } from "./mission-DOaVQo-M.mjs";
import { c as preferEvening, i as formatWhen, n as assertReasonableIso, o as localSgtToIso, s as nextEveningIso } from "./time-I2ZWfIie.mjs";
import { n as leadingSlot, t as counts } from "./tally-BBpMkCHy.mjs";
import { a as readReading, n as hashString } from "./reading-Dc18t2Vi.mjs";
import { a as venueSalt, i as pickVenue, n as categoryLabel } from "./venues-BoGl0zhE.mjs";
import { o as cleanMeetingUrl, t as EMPTY_PLACE } from "./place-Cj_BvgPc.mjs";
import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { KAIROS_VOICE, geminiText } from "./gemini.server-D3PyYOAp.mjs";
import { n as supabaseConfigured, t as getSupabase } from "./supabase-BKxuSUOP.mjs";
import { t as getSql } from "./db-DS0ec2FZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kairos.functions.server-C6w-CO8i.js
function readAlmanac(iso, title, options) {
	const reading = readReading(iso, title, options);
	return {
		score: reading.score,
		yi: reading.yi,
		yiNote: reading.yiNote,
		ji: reading.ji,
		jiNote: reading.jiNote,
		tarot: reading.tarotName,
		tarotNote: reading.tarotNote,
		zodiac: reading.zodiacName,
		zodiacNote: reading.zodiacNote,
		boss: reading.boss
	};
}
function localOracle(title, when, score) {
	const n = hashString(`${title}|${when}`) % 4;
	return `${[
		`The hour and the almanac both looked at ${when}.`,
		`${when} carries a Kairos score of ${score} / 100 for “${title}”.`,
		`Tong shu circled ${when} and nodded, with reservations.`,
		`For “${title}”, the least crowded good hour is ${when}.`
	][n]} ${[
		`Open with the ask. The room will not fund a prologue.`,
		`Bring one number, one decision, and zero apology slides.`,
		`If someone says “let's take this offline”, the good hour is already going.`,
		`Humans still vote. The score is a briefing, not a prophecy.`
	][(n + score) % 4]}`;
}
var schemaReady = false;
var schemaLogged = false;
function makeCode$1(length) {
	const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	let out = "";
	for (const byte of bytes) out += alphabet[byte % 31];
	return out;
}
function tagged(error) {
	const err = new Error(error.message);
	err.code = error.code;
	return err;
}
function asKind$1(value) {
	return value === "makan" ? "makan" : "meeting";
}
function asChoice$1(value) {
	if (value === "love" || value === "yes" || value === "soft" || value === "no") return value;
	if (value === "maybe") return "yes";
	return "no";
}
function asSource$1(value) {
	if (value === "grok" || value === "almanac") return value;
	return "";
}
function asPlace$1(row) {
	const format = row.format === "online" || row.format === "hybrid" ? row.format : "physical";
	const platform = row.platform === "teams" || row.platform === "zoom" || row.platform === "skype" || row.platform === "meet" || row.platform === "webex" || row.platform === "other" ? row.platform : "";
	const makanWhen = row.makan_when === "before" || row.makan_when === "after" ? row.makan_when : "";
	return {
		format,
		venueName: row.venue_name ?? "",
		room: row.room ?? "",
		address: row.address ?? "",
		platform,
		meetingUrl: row.meeting_url ?? "",
		makanWhen
	};
}
function utcStamp(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}
function asObject$1(value) {
	if (typeof value === "string") try {
		return JSON.parse(value);
	} catch {
		return null;
	}
	return value;
}
/** True only when the anon key can read the current Kairos `events.code` column. */
async function kairosSupabaseReady() {
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
async function sbLoadEvent(code) {
	const sb = getSupabase();
	const { data: event, error } = await sb.from("events").select("id, code, title, kind, duration_min, category, anchor_at, oracle_text, oracle_source, oracle_at, format, venue_name, room, address, platform, meeting_url, makan_when").eq("code", code).maybeSingle();
	if (error) throw tagged(error);
	if (!event) return null;
	const { data: slotRows, error: slotError } = await sb.from("slots").select("id, label, venue_note, starts_at, sort_order, cosmic_score").eq("event_id", event.id).order("starts_at", { ascending: true }).order("sort_order", { ascending: true }).order("label", { ascending: true });
	if (slotError) throw tagged(slotError);
	const { data: voteRows, error: voteError } = await sb.from("votes").select("slot_id, nickname, choice, created_at").eq("event_id", event.id).order("created_at", { ascending: true });
	if (voteError) throw tagged(voteError);
	const { data: commentRows, error: commentError } = await sb.from("comments").select("id, nickname, body, created_at").eq("event_id", event.id).order("created_at", { ascending: false }).limit(40);
	if (commentError) throw tagged(commentError);
	const { data: missionRow, error: missionError } = await sb.from("event_ai_context").select("meeting_type, meeting_goal, stakes, tone, preferred_conditions, time_preferences, suggested_duration_minutes, summary").eq("event_id", event.id).maybeSingle();
	if (missionError) throw tagged(missionError);
	const votesBySlot = /* @__PURE__ */ new Map();
	for (const vote of voteRows ?? []) {
		const list = votesBySlot.get(vote.slot_id) ?? [];
		list.push({
			nickname: vote.nickname,
			choice: asChoice$1(vote.choice)
		});
		votesBySlot.set(vote.slot_id, list);
	}
	const parsedMission = missionRow ? missionSchema.safeParse({
		meeting_type: missionRow.meeting_type,
		meeting_goal: missionRow.meeting_goal,
		stakes: missionRow.stakes,
		tone: missionRow.tone,
		preferred_conditions: asObject$1(missionRow.preferred_conditions),
		time_preferences: asObject$1(missionRow.time_preferences),
		suggested_duration_minutes: Number(missionRow.suggested_duration_minutes),
		summary: missionRow.summary
	}) : null;
	return {
		id: event.id,
		code: event.code,
		title: event.title,
		kind: asKind$1(event.kind),
		durationMin: Number(event.duration_min),
		category: event.category ?? "",
		anchorAt: utcStamp(event.anchor_at),
		oracleText: event.oracle_text ?? "",
		oracleSource: asSource$1(event.oracle_source ?? ""),
		mission: parsedMission?.success ? parsedMission.data : null,
		place: asPlace$1(event),
		slots: (slotRows ?? []).map((slot) => {
			const startsAt = utcStamp(slot.starts_at);
			const reading = readAlmanac(startsAt, event.title, {
				kind: asKind$1(event.kind),
				durationMin: Number(event.duration_min)
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
				votes: votesBySlot.get(slot.id) ?? []
			};
		}),
		comments: (commentRows ?? []).map((comment) => ({
			id: comment.id,
			nickname: comment.nickname,
			body: comment.body,
			createdAt: utcStamp(comment.created_at)
		}))
	};
}
async function sbInsertEvent(row) {
	const sb = getSupabase();
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const code = makeCode$1(7);
		const eventId = makeCode$1(16);
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
			makan_when: row.place.makanWhen
		});
		if (!error) return {
			code,
			eventId
		};
		if (error.code !== "23505" || attempt === 2) throw tagged(error);
	}
	throw new Error("Could not open a board");
}
async function sbInsertSlot(eventId, title, iso, label, venueNote, sortOrder) {
	const reading = readAlmanac(iso, title);
	const { error } = await getSupabase().from("slots").insert({
		id: makeCode$1(12),
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
		boss: reading.boss
	});
	if (error) throw tagged(error);
}
async function sbBoardSize(code) {
	const sb = getSupabase();
	const { data: event, error } = await sb.from("events").select("id, title").eq("code", code).maybeSingle();
	if (error) throw tagged(error);
	if (!event) return null;
	const { count, error: countError } = await sb.from("slots").select("id", {
		count: "exact",
		head: true
	}).eq("event_id", event.id);
	if (countError) throw tagged(countError);
	return {
		id: event.id,
		title: event.title,
		n: count ?? 0
	};
}
async function sbSlotLabels(eventId) {
	const { data, error } = await getSupabase().from("slots").select("label").eq("event_id", eventId);
	if (error) throw tagged(error);
	return (data ?? []).map((row) => row.label).filter((label) => Boolean(label));
}
async function sbCastVote(data) {
	const sb = getSupabase();
	const { data: event, error: eventError } = await sb.from("events").select("id").eq("code", data.code).maybeSingle();
	if (eventError) throw tagged(eventError);
	if (!event) throw new Error("That option has left the board");
	const { data: slot, error: slotError } = await sb.from("slots").select("id, event_id").eq("id", data.slotId).eq("event_id", event.id).maybeSingle();
	if (slotError) throw tagged(slotError);
	if (!slot) throw new Error("That option has left the board");
	const key = data.nickname.toLowerCase();
	const { data: existing, error: existingError } = await sb.from("votes").select("id").eq("slot_id", slot.id).eq("nickname_key", key).maybeSingle();
	if (existingError) throw tagged(existingError);
	if (existing) {
		const { error } = await sb.from("votes").update({
			choice: data.choice,
			nickname: data.nickname,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", existing.id);
		if (error) throw tagged(error);
		return;
	}
	const { error } = await sb.from("votes").insert({
		id: makeCode$1(12),
		slot_id: slot.id,
		event_id: slot.event_id,
		nickname: data.nickname,
		nickname_key: key,
		choice: data.choice
	});
	if (error) throw tagged(error);
}
async function sbCommentCount(code) {
	const sb = getSupabase();
	const { data: event, error } = await sb.from("events").select("id").eq("code", code).maybeSingle();
	if (error) throw tagged(error);
	if (!event) return null;
	const { count, error: countError } = await sb.from("comments").select("id", {
		count: "exact",
		head: true
	}).eq("event_id", event.id);
	if (countError) throw tagged(countError);
	return {
		id: event.id,
		n: count ?? 0
	};
}
async function sbInsertComment(eventId, nickname, body) {
	const { error } = await getSupabase().from("comments").insert({
		id: makeCode$1(12),
		event_id: eventId,
		nickname,
		body
	});
	if (error) throw tagged(error);
}
async function sbUpdateOracle(eventId, text, source) {
	const { error } = await getSupabase().from("events").update({
		oracle_text: text,
		oracle_source: source,
		oracle_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", eventId);
	if (error) throw tagged(error);
}
async function sbReadMission(eventId) {
	const { data: row, error } = await getSupabase().from("event_ai_context").select("meeting_type, meeting_goal, stakes, tone, preferred_conditions, time_preferences, suggested_duration_minutes, summary").eq("event_id", eventId).maybeSingle();
	if (error) throw tagged(error);
	if (!row) return null;
	const parsed = missionSchema.safeParse({
		meeting_type: row.meeting_type,
		meeting_goal: row.meeting_goal,
		stakes: row.stakes,
		tone: row.tone,
		preferred_conditions: asObject$1(row.preferred_conditions),
		time_preferences: asObject$1(row.time_preferences),
		suggested_duration_minutes: Number(row.suggested_duration_minutes),
		summary: row.summary
	});
	return parsed.success ? parsed.data : null;
}
async function sbWriteMission(eventId, parsed, source) {
	const { error } = await getSupabase().from("event_ai_context").upsert({
		event_id: eventId,
		meeting_type: parsed.meeting_type,
		meeting_goal: parsed.meeting_goal,
		stakes: parsed.stakes,
		tone: parsed.tone,
		preferred_conditions: parsed.preferred_conditions,
		time_preferences: parsed.time_preferences,
		suggested_duration_minutes: parsed.suggested_duration_minutes,
		summary: parsed.summary,
		source
	}, { onConflict: "event_id" });
	if (error) throw tagged(error);
}
async function sbReadExplanation(eventId) {
	const { data, error } = await getSupabase().from("kairos_results").select("fingerprint, ai_headline, ai_reasoning, ai_comment, backup_label, backup_reason, slot_lines, source").eq("event_id", eventId).maybeSingle();
	if (error) throw tagged(error);
	return data;
}
async function sbWriteExplanation(row) {
	const { error } = await getSupabase().from("kairos_results").upsert({
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
		generated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "event_id" });
	if (error) throw tagged(error);
}
async function sbReadCosmic(eventId, slotId) {
	const { data, error } = await getSupabase().from("cosmic_readings").select("prose").eq("event_id", eventId).eq("slot_id", slotId).maybeSingle();
	if (error) throw tagged(error);
	return data?.prose ?? null;
}
async function sbWriteCosmic(eventId, slotId, prose, source) {
	const { error } = await getSupabase().from("cosmic_readings").upsert({
		event_id: eventId,
		slot_id: slotId,
		prose,
		source,
		generated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "event_id,slot_id" });
	if (error) throw tagged(error);
}
function asObject(value) {
	if (typeof value === "string") try {
		return JSON.parse(value);
	} catch {
		return null;
	}
	return value;
}
async function writeMission(eventId, context, source) {
	const parsed = missionSchema.parse(context);
	if (await kairosSupabaseReady()) {
		await sbWriteMission(eventId, parsed, source);
		return;
	}
	await (await getSql())`
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
async function readMission(eventId) {
	if (await kairosSupabaseReady()) return sbReadMission(eventId);
	const row = (await (await getSql())`
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
  `)[0];
	if (!row) return null;
	const parsed = missionSchema.safeParse({
		meeting_type: row.meeting_type,
		meeting_goal: row.meeting_goal,
		stakes: row.stakes,
		tone: row.tone,
		preferred_conditions: asObject(row.preferred_conditions),
		time_preferences: asObject(row.time_preferences),
		suggested_duration_minutes: Number(row.suggested_duration_minutes),
		summary: row.summary
	});
	return parsed.success ? parsed.data : null;
}
var kairos_functions_server_exports = /* @__PURE__ */ __exportAll({
	addComment: () => addComment,
	addSlot: () => addSlot,
	castVote: () => castVote,
	consultOracle: () => consultOracle,
	createEvent: () => createEvent,
	loadEvent: () => loadEvent,
	spinVenue: () => spinVenue
});
function makeCode(length) {
	const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	let out = "";
	for (const byte of bytes) out += alphabet[byte % 31];
	return out;
}
function asKind(value) {
	return value === "makan" ? "makan" : "meeting";
}
function asChoice(value) {
	if (value === "love" || value === "yes" || value === "soft" || value === "no") return value;
	if (value === "maybe") return "yes";
	return "no";
}
function asSource(value) {
	if (value === "grok" || value === "almanac") return value;
	return "";
}
function asPlace(row) {
	const format = row.format === "online" || row.format === "hybrid" ? row.format : "physical";
	const platform = row.platform === "teams" || row.platform === "zoom" || row.platform === "skype" || row.platform === "meet" || row.platform === "webex" || row.platform === "other" ? row.platform : "";
	const makanWhen = row.makan_when === "before" || row.makan_when === "after" ? row.makan_when : "";
	return {
		format,
		venueName: row.venue_name ?? "",
		room: row.room ?? "",
		address: row.address ?? "",
		platform,
		meetingUrl: row.meeting_url ?? "",
		makanWhen
	};
}
function isUnique(error) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}
async function loadEvent(code) {
	if (await kairosSupabaseReady()) return sbLoadEvent(code);
	const sql = await getSql();
	const event = (await sql`
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
  `)[0];
	if (!event) return null;
	const slotRows = await sql`
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
	const voteRows = await sql`
    select slot_id, nickname, choice
    from votes
    where event_id = ${event.id}
    order by created_at
  `;
	const commentRows = await sql`
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
	const votesBySlot = /* @__PURE__ */ new Map();
	for (const vote of voteRows) {
		const list = votesBySlot.get(vote.slot_id) ?? [];
		list.push({
			nickname: vote.nickname,
			choice: asChoice(vote.choice)
		});
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
				durationMin: Number(event.duration_min)
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
				votes: votesBySlot.get(slot.id) ?? []
			};
		}),
		comments: commentRows.map((comment) => ({
			id: comment.id,
			nickname: comment.nickname,
			body: comment.body,
			createdAt: comment.created_at
		}))
	};
}
async function insertSlot(eventId, title, iso, label, venueNote, sortOrder) {
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
async function createEvent(data) {
	if (data.kind === "meeting" && data.slots.length < 1) throw new Error("Add at least one time");
	const anchorLocal = data.kind === "makan" ? data.anchorAt || data.slots[0]?.startsAt || "" : "";
	if (data.kind === "makan" && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(anchorLocal)) throw new Error("Pick a meetup time");
	const anchorIso = anchorLocal ? localSgtToIso(anchorLocal) : "";
	if (anchorIso) assertReasonableIso(anchorIso);
	const prepared = data.slots.map((slot, index) => {
		const iso = localSgtToIso(slot.startsAt);
		assertReasonableIso(iso);
		return {
			iso,
			label: (slot.label ?? "").slice(0, 80),
			index
		};
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
			meetingUrl
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
	for (const slot of prepared) await insertSlot(eventId, data.title, slot.iso, slot.label, "", slot.index);
	if (data.mission) await writeMission(eventId, data.mission, data.missionSource ?? "rules");
	return { code };
}
async function castVote(data) {
	if (await kairosSupabaseReady()) {
		await sbCastVote(data);
		return { ok: true };
	}
	const sql = await getSql();
	const slot = (await sql`
    select s.id, s.event_id
    from slots s
    join events e on e.id = s.event_id
    where s.id = ${data.slotId} and e.code = ${data.code}
  `)[0];
	if (!slot) throw new Error("That option has left the board");
	const key = data.nickname.toLowerCase();
	await sql`
    insert into votes (id, slot_id, event_id, nickname, nickname_key, choice)
    values (${makeCode(12)}, ${slot.id}, ${slot.event_id}, ${data.nickname}, ${key}, ${data.choice})
    on conflict (slot_id, nickname_key)
    do update set choice = excluded.choice, nickname = excluded.nickname, created_at = now()
  `;
	return { ok: true };
}
async function addSlot(data) {
	const event = await (async () => {
		if (await kairosSupabaseReady()) return sbBoardSize(data.code);
		const row = (await (await getSql())`
      select e.id, e.title, (select count(*) from slots s where s.event_id = e.id) as n
      from events e
      where e.code = ${data.code}
    `)[0];
		return row ? {
			id: row.id,
			title: row.title,
			n: Number(row.n)
		} : null;
	})();
	if (!event) throw new Error("That board does not exist");
	if (event.n >= 8) throw new Error("Eight options is the house limit");
	const iso = localSgtToIso(data.startsAt);
	assertReasonableIso(iso);
	await insertSlot(event.id, event.title, iso, data.label ?? "", "", event.n);
	return { ok: true };
}
async function addComment(data) {
	if (await kairosSupabaseReady()) {
		const event = await sbCommentCount(data.code);
		if (!event) throw new Error("That board does not exist");
		if (event.n >= 40) throw new Error("This board is full of slips. Say the rest in person.");
		await sbInsertComment(event.id, data.nickname, data.body);
		return { ok: true };
	}
	const sql = await getSql();
	const event = (await sql`
    select e.id, (select count(*) from comments c where c.event_id = e.id) as n
    from events e
    where e.code = ${data.code}
  `)[0];
	if (!event) throw new Error("That board does not exist");
	if (Number(event.n) >= 40) throw new Error("This board is full of slips. Say the rest in person.");
	await sql`
    insert into comments (id, event_id, nickname, body)
    values (${makeCode(12)}, ${event.id}, ${data.nickname}, ${data.body})
  `;
	return { ok: true };
}
function twoSentences(text) {
	return text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/).slice(0, 2).join(" ").slice(0, 420);
}
async function askGrok(system, user, maxTokens) {
	return geminiText(system, user, maxTokens);
}
async function consultOracle(data) {
	const event = await loadEvent(data.code);
	if (!event) throw new Error("That board does not exist");
	const lead = leadingSlot(event.slots) ?? event.slots[0] ?? null;
	const when = lead ? formatWhen(lead.startsAt) : "an open hour";
	const score = lead?.score ?? 0;
	const tally = counts(event.slots.flatMap((slot) => slot.votes));
	const grok = await askGrok(`${KAIROS_VOICE} Write exactly two short sentences. First: a funny Tong Shu note with one 宜 and one 忌, using only the facts given. Second: light Singlish boss advice. Do not name voters. Do not use a percentage.`, `Title: ${event.title}. Moment: ${when}. Almanac mark context ${score} out of 100. Votes: ${tally.love} great, ${tally.yes} can, ${tally.soft} please no, ${tally.no} cannot.`, 160);
	const text = twoSentences(grok || localOracle(event.title, when, score));
	const source = grok ? "grok" : "almanac";
	if (await kairosSupabaseReady()) {
		await sbUpdateOracle(event.id, text, source);
		return {
			text,
			source
		};
	}
	await (await getSql())`
    update events
    set oracle_text = ${text}, oracle_source = ${source}, oracle_at = now()
    where id = ${event.id}
  `;
	return {
		text,
		source
	};
}
async function spinVenue(data) {
	const found = await (async () => {
		if (await kairosSupabaseReady()) {
			const event = await sbBoardSize(data.code);
			if (!event) return null;
			return {
				event,
				avoid: await sbSlotLabels(event.id)
			};
		}
		const sql = await getSql();
		const event = (await sql`
      select e.id, e.title, (select count(*) from slots s where s.event_id = e.id) as n
      from events e
      where e.code = ${data.code}
    `)[0];
		if (!event) return null;
		const existing = await sql`select label from slots where event_id = ${event.id}`;
		return {
			event: {
				id: event.id,
				title: event.title,
				n: Number(event.n)
			},
			avoid: existing.map((row) => row.label).filter(Boolean)
		};
	})();
	if (!found) throw new Error("That board does not exist");
	const { event, avoid } = found;
	if (event.n >= 8) throw new Error("Eight options is the house limit");
	const house = pickVenue(data.category, venueSalt(data.category, event.id), avoid);
	const grok = await askGrok(`Reply with exactly this venue name if it fits, or the word skip: ${house.name}`, `Category: ${categoryLabel(data.category)}. ${house.area}. ${house.blurb}`, 24);
	const echoed = Boolean(grok && grok.toLowerCase().includes(house.name.toLowerCase()));
	const local = data.startsAt && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(data.startsAt) ? localSgtToIso(data.startsAt) : nextEveningIso();
	const iso = preferEvening(local);
	assertReasonableIso(iso);
	await insertSlot(event.id, event.title, iso, house.name, `${house.area}. ${house.blurb}`.slice(0, 180), event.n);
	return {
		name: house.name,
		source: echoed ? "grok" : "list"
	};
}
//#endregion
export { sbReadCosmic as a, sbWriteExplanation as c, kairosSupabaseReady as i, loadEvent as n, sbReadExplanation as o, writeMission as r, sbWriteCosmic as s, kairos_functions_server_exports as t };
