import { l as string, n as array, s as object } from "../_libs/zod.mjs";
import { a as missionSchema, i as inferMission, o as snapDuration, s as unsafeCopy, t as MEETING_TYPES } from "./mission-DOaVQo-M.mjs";
import { r as formatMoment } from "./time-I2ZWfIie.mjs";
import { a as readReading } from "./reading-Dc18t2Vi.mjs";
import { n as explainFromScores, t as cosmicProse } from "./explain-iXlrEn1O.mjs";
import { n as scoreFingerprint, r as scoreSlots, t as pickWinner } from "./score-CShSeQph.mjs";
import { KAIROS_VOICE, geminiJson } from "./gemini.server-D3PyYOAp.mjs";
import { t as getSql } from "./db-DS0ec2FZ.mjs";
import { a as sbReadCosmic, c as sbWriteExplanation, i as kairosSupabaseReady, n as loadEvent, o as sbReadExplanation, r as writeMission, s as sbWriteCosmic } from "./kairos.functions.server-C6w-CO8i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kairos.intelligence.server-BBqsF_Cu.js
string().trim().regex(/^[a-zA-Z0-9]{4,12}$/).transform((value) => value.toLowerCase());
var leanEnum = [
	"positive",
	"neutral",
	"negative"
];
var missionJsonSchema = {
	type: "object",
	additionalProperties: false,
	required: [
		"meeting_type",
		"meeting_goal",
		"stakes",
		"tone",
		"preferred_conditions",
		"suggested_duration_minutes",
		"time_preferences",
		"summary"
	],
	properties: {
		meeting_type: {
			type: "string",
			enum: [...MEETING_TYPES]
		},
		meeting_goal: { type: "string" },
		stakes: {
			type: "string",
			enum: [
				"low",
				"medium",
				"high"
			]
		},
		tone: { type: "string" },
		preferred_conditions: {
			type: "array",
			items: { type: "string" }
		},
		suggested_duration_minutes: { type: "integer" },
		time_preferences: {
			type: "object",
			additionalProperties: false,
			required: [
				"morning",
				"afternoon",
				"late_day"
			],
			properties: {
				morning: {
					type: "string",
					enum: [...leanEnum]
				},
				afternoon: {
					type: "string",
					enum: [...leanEnum]
				},
				late_day: {
					type: "string",
					enum: [...leanEnum]
				}
			}
		},
		summary: { type: "string" }
	}
};
var explanationJsonSchema = {
	type: "object",
	additionalProperties: false,
	required: [
		"headline",
		"reasoning",
		"kairos_comment",
		"backup_slot",
		"backup_reason",
		"comparisons"
	],
	properties: {
		headline: { type: "string" },
		reasoning: {
			type: "array",
			items: { type: "string" }
		},
		kairos_comment: { type: "string" },
		backup_slot: { type: "string" },
		backup_reason: { type: "string" },
		comparisons: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				required: ["label", "line"],
				properties: {
					label: { type: "string" },
					line: { type: "string" }
				}
			}
		}
	}
};
var cosmicJsonSchema = {
	type: "object",
	additionalProperties: false,
	required: ["prose"],
	properties: { prose: { type: "string" } }
};
async function askJson(system, user, _schemaName, schema, maxTokens) {
	return geminiJson(system, user, schema, maxTokens);
}
function cleanMission(raw) {
	if (!raw || typeof raw !== "object") return null;
	const record = raw;
	const conditions = Array.isArray(record.preferred_conditions) ? record.preferred_conditions : [];
	const prefs = record.time_preferences;
	const candidate = {
		meeting_type: record.meeting_type,
		meeting_goal: String(record.meeting_goal ?? "").trim().slice(0, 140),
		stakes: record.stakes,
		tone: String(record.tone ?? "").trim().slice(0, 40),
		preferred_conditions: conditions.map((item) => String(item).trim().slice(0, 80)).filter((item) => item.length > 1).slice(0, 4),
		suggested_duration_minutes: snapDuration(Number(record.suggested_duration_minutes) || 60),
		time_preferences: prefs,
		summary: String(record.summary ?? "").trim().slice(0, 220)
	};
	const parsed = missionSchema.safeParse(candidate);
	if (!parsed.success) return null;
	const blob = [
		parsed.data.summary,
		parsed.data.meeting_goal,
		...parsed.data.preferred_conditions
	].join(" ");
	if (unsafeCopy(blob)) return null;
	return parsed.data;
}
var explanationSchema = object({
	headline: string().trim().min(8).max(180),
	reasoning: array(string().trim().min(4).max(220)).min(2).max(4),
	kairos_comment: string().trim().min(4).max(220),
	backup_slot: string().trim().max(80),
	backup_reason: string().trim().max(220),
	comparisons: array(object({
		label: string().trim().min(2).max(80),
		line: string().trim().min(4).max(220)
	})).max(6)
});
function coerceExplanation(raw) {
	if (!raw || typeof raw !== "object") return raw;
	const record = raw;
	const clip = (value, max) => String(value ?? "").trim().slice(0, max);
	const reasoning = Array.isArray(record.reasoning) ? record.reasoning.map((item) => clip(item, 220)).filter((item) => item.length >= 4).slice(0, 4) : [];
	const comparisons = Array.isArray(record.comparisons) ? record.comparisons.map((item) => {
		if (!item || typeof item !== "object") return null;
		const row = item;
		return {
			label: clip(row.label, 80),
			line: clip(row.line, 220)
		};
	}).filter((item) => Boolean(item && item.label.length >= 2 && item.line.length >= 4)).slice(0, 6) : [];
	return {
		headline: clip(record.headline, 180),
		reasoning,
		kairos_comment: clip(record.kairos_comment, 220),
		backup_slot: clip(record.backup_slot, 80),
		backup_reason: clip(record.backup_reason, 220),
		comparisons
	};
}
async function analyzeMission(data) {
	const fallback = inferMission(data.title, data.kind, data.durationMin);
	const raw = await askJson("You extract meeting intent for Kairos, a group scheduling product. Do not guess anyone's mood, personality, or calendar. Describe the kind of conversation, not the people. stakes reflects the weight of the decision, not a person's feelings. preferred_conditions are practical, at most 4. summary is one sentence and must not predict an outcome. Never use percentages.", `Purpose: ${data.title}\nKind: ${data.kind}\nOrganiser duration: ${data.durationMin} minutes`, "mission_analysis", missionJsonSchema, 420);
	const parsedMission = raw ? cleanMission(raw) : null;
	return {
		context: parsedMission ?? fallback,
		source: parsedMission ? "grok" : "rules"
	};
}
function parseCached(value) {
	try {
		if (typeof value === "string") return JSON.parse(value);
		return value;
	} catch {
		return null;
	}
}
async function explainKairos(data) {
	const view = await loadEvent(data.code);
	if (!view) throw new Error("That board does not exist");
	const scored = scoreSlots(view.slots, view.title, view.kind, view.durationMin, view.mission);
	const fingerprint = scoreFingerprint(scored);
	const fallback = explainFromScores(scored, view.durationMin, view.mission);
	const winner = pickWinner(scored);
	if (!winner || winner.layer.total == null) return {
		...fallback,
		fingerprint,
		source: "rules"
	};
	const hit = await (async () => {
		if (await kairosSupabaseReady()) return sbReadExplanation(view.id);
		return (await (await getSql())`
        select fingerprint, ai_headline, ai_reasoning, ai_comment, backup_label, backup_reason, slot_lines, source
        from kairos_results
        where event_id = ${view.id}
      `)[0] ?? null;
	})();
	if (!data.refresh && hit && hit.fingerprint === fingerprint) {
		const lines = parseCached(hit.slot_lines);
		const reasoning = parseCached(hit.ai_reasoning);
		if (Array.isArray(lines) && Array.isArray(reasoning)) return {
			headline: hit.ai_headline,
			reasoning: reasoning.map(String).slice(0, 4),
			comment: hit.ai_comment,
			backupLabel: hit.backup_label,
			backupReason: hit.backup_reason,
			lines,
			fingerprint,
			source: hit.source === "grok" ? "grok" : "rules"
		};
	}
	const payload = {
		meeting: {
			title: view.title,
			type: view.mission?.meeting_type ?? "other",
			stakes: view.mission?.stakes ?? "medium",
			summary: view.mission?.summary ?? ""
		},
		slots: scored.map((item) => ({
			label: item.slot.label || formatMoment(item.slot.startsAt),
			people_fit: item.layer.people.waiting ? null : item.layer.people.points,
			moment_fit: item.layer.moment,
			moment_notes: item.layer.momentNotes,
			cosmic_fit: item.layer.cosmicFit,
			kairos_score: item.layer.total,
			can_attend: item.layer.people.able,
			roster: item.layer.people.roster,
			great: item.layer.people.love,
			can_make: item.layer.people.yes,
			please_no: item.layer.people.soft,
			cannot: item.layer.people.no,
			tong_shu: item.layer.reading.tongshu.note,
			tong_shu_mark: item.layer.reading.tongshu.mark,
			zodiac: item.layer.reading.zodiac.note,
			tarot: item.layer.reading.tarotName
		}))
	};
	const raw = await askJson(`${KAIROS_VOICE} You explain a Kairos Score that is already final. Do not change any number. Use only the JSON facts. Do not invent votes, names, or reasons that are not in the data. If stakes are high, stay plain and keep the Singlish to one short aside. kairos_comment is one sentence. reasoning is 2 to 4 short lines. comparisons has one line per slot label, copied exactly.`, JSON.stringify(payload), "kairos_explanation", explanationJsonSchema, 800);
	let body = fallback;
	let source = "rules";
	const parsed = explanationSchema.safeParse(coerceExplanation(raw));
	if (parsed.success) {
		const blob = [
			parsed.data.headline,
			parsed.data.kairos_comment,
			parsed.data.backup_reason,
			...parsed.data.reasoning,
			...parsed.data.comparisons.map((item) => item.line)
		].join(" ");
		if (!unsafeCopy(blob)) {
			const byLabel = new Map(parsed.data.comparisons.map((item) => [item.label, item.line]));
			body = {
				headline: parsed.data.headline,
				reasoning: parsed.data.reasoning,
				comment: parsed.data.kairos_comment,
				backupLabel: parsed.data.backup_slot,
				backupReason: parsed.data.backup_reason,
				lines: scored.map((item) => {
					const label = item.slot.label || formatMoment(item.slot.startsAt);
					return {
						slotId: item.slot.id,
						line: byLabel.get(label) || fallback.lines.find((line) => line.slotId === item.slot.id)?.line || ""
					};
				})
			};
			source = "grok";
		}
	}
	if (await kairosSupabaseReady()) await sbWriteExplanation({
		eventId: view.id,
		winningSlotId: winner.slot.id,
		fingerprint,
		peopleScore: winner.layer.people.points,
		momentScore: winner.layer.moment,
		cosmicScore: winner.layer.cosmicFit,
		kairosScore: Number(winner.layer.total),
		headline: body.headline,
		reasoning: body.reasoning,
		comment: body.comment,
		backupLabel: body.backupLabel,
		backupReason: body.backupReason,
		lines: body.lines,
		source
	});
	else await (await getSql())`
      insert into kairos_results (
        event_id, winning_slot_id, fingerprint, people_score, moment_score, cosmic_score, kairos_score,
        ai_headline, ai_reasoning, ai_comment, backup_label, backup_reason, slot_lines, source
      ) values (
        ${view.id},
        ${winner.slot.id},
        ${fingerprint},
        ${winner.layer.people.points},
        ${winner.layer.moment},
        ${winner.layer.cosmicFit},
        ${winner.layer.total},
        ${body.headline},
        ${JSON.stringify(body.reasoning)}::jsonb,
        ${body.comment},
        ${body.backupLabel},
        ${body.backupReason},
        ${JSON.stringify(body.lines)}::jsonb,
        ${source}
      )
      on conflict (event_id) do update set
        winning_slot_id = excluded.winning_slot_id,
        fingerprint = excluded.fingerprint,
        people_score = excluded.people_score,
        moment_score = excluded.moment_score,
        cosmic_score = excluded.cosmic_score,
        kairos_score = excluded.kairos_score,
        ai_headline = excluded.ai_headline,
        ai_reasoning = excluded.ai_reasoning,
        ai_comment = excluded.ai_comment,
        backup_label = excluded.backup_label,
        backup_reason = excluded.backup_reason,
        slot_lines = excluded.slot_lines,
        source = excluded.source,
        generated_at = now()
    `;
	return {
		...body,
		fingerprint,
		source
	};
}
async function interpretCosmos(data) {
	const view = await loadEvent(data.code);
	if (!view) throw new Error("That board does not exist");
	const slot = view.slots.find((item) => item.id === data.slotId);
	if (!slot) throw new Error("That time is not on the board");
	const cachedProse = await (async () => {
		if (await kairosSupabaseReady()) return sbReadCosmic(view.id, slot.id);
		return (await (await getSql())`
        select prose from cosmic_readings where event_id = ${view.id} and slot_id = ${slot.id}
      `)[0]?.prose ?? null;
	})();
	if (cachedProse) return {
		prose: cachedProse,
		source: "cache"
	};
	const reading = readReading(slot.startsAt, view.title, {
		kind: view.kind,
		durationMin: view.durationMin
	});
	const fallback = cosmicProse(reading);
	const raw = await askJson(`${KAIROS_VOICE} Write two or three sentences for this one date. Include a short 宜 and a short 忌 from the Tong Shu facts, a humorous line about the given tarot card, and one light Singlish boss aside. Use only the JSON. If stakes are high, keep the joke small. End by reminding the reader that humans still decide.`, JSON.stringify({
		when: formatMoment(slot.startsAt),
		meeting_type: view.mission?.meeting_type ?? "other",
		stakes: view.mission?.stakes ?? "medium",
		tong_shu: {
			score: reading.tongshu.hundred,
			mark: reading.tongshu.mark,
			note: reading.tongshu.note
		},
		zodiac: reading.zodiac.note,
		tarot: {
			card: reading.tarotName,
			note: reading.tarot.detail
		},
		astrology: reading.astrology.note,
		numerology: {
			score: reading.numerology.hundred,
			note: reading.numerology.note
		}
	}), "cosmic_reading", cosmicJsonSchema, 280);
	const proseRaw = raw && typeof raw === "object" && "prose" in raw ? String(raw.prose).trim() : "";
	const prose = proseRaw.length >= 20 && proseRaw.length <= 500 && !unsafeCopy(proseRaw) ? proseRaw : fallback;
	const source = prose === fallback ? "rules" : "grok";
	if (await kairosSupabaseReady()) await sbWriteCosmic(view.id, slot.id, prose, source);
	else await (await getSql())`
      insert into cosmic_readings (event_id, slot_id, prose, source)
      values (${view.id}, ${slot.id}, ${prose}, ${source})
      on conflict (event_id, slot_id) do update set prose = excluded.prose, source = excluded.source, generated_at = now()
    `;
	return {
		prose,
		source
	};
}
async function saveMission(data) {
	const view = await loadEvent(data.code);
	if (!view) throw new Error("That board does not exist");
	await writeMission(view.id, data.mission, data.source ?? "rules");
	return { ok: true };
}
//#endregion
export { analyzeMission, explainKairos, interpretCosmos, saveMission };
