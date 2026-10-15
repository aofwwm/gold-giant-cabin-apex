import { r as formatMoment } from "./time-I2ZWfIie.mjs";
import { s as voiceLine } from "./reading-Dc18t2Vi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explain-iXlrEn1O.js
function labelOf(item) {
	return item.slot.label || formatMoment(item.slot.startsAt);
}
function ranked(scored) {
	return scored.filter((item) => item.layer.total != null).sort((a, b) => b.layer.total - a.layer.total || b.layer.people.points - a.layer.people.points);
}
function slotLine(item, winner) {
	const people = item.layer.people;
	const parts = [];
	if (people.waiting) parts.push("No votes on this time yet");
	else if (people.soft + people.no > 0 && people.love === 0) parts.push("People can attend, but enthusiasm is lower");
	else if (people.love > 0 && people.soft === 0 && people.no === 0) parts.push("Strong participant preference");
	else parts.push(`${people.able} of ${people.roster} can attend`);
	if (item.layer.moment >= 24) parts.push("the hour suits the meeting");
	else if (item.layer.moment < 20) parts.push("the hour is a tighter fit");
	if (item.slot.id === winner.slot.id && item.layer.cosmicFit >= 22) parts.push("strongest cosmic alignment of the set");
	else if (item.layer.cosmicFit + 2 < winner.layer.cosmicFit) parts.push("weaker cosmic alignment");
	const line = parts.join(", ");
	return `${line.charAt(0).toUpperCase()}${line.slice(1)}.`;
}
function explainFromScores(scored, durationMin, context) {
	const order = ranked(scored);
	const winner = order[0];
	if (!winner || winner.layer.total == null) return {
		headline: "Kairos is waiting on votes.",
		reasoning: ["People fit stays blank until someone picks a face."],
		comment: "Share the moments. Nicknames do the rest.",
		backupLabel: "",
		backupReason: "",
		lines: []
	};
	const people = winner.layer.people;
	const when = labelOf(winner);
	const weekday = formatMoment(winner.slot.startsAt).slice(0, 3);
	const backup = order[1];
	const reasoning = [
		`${people.able} of ${people.roster} can attend.`,
		people.love > 0 ? `${people.love} of ${people.roster} actively prefer this slot.` : "Few people marked it as a favourite.",
		winner.layer.momentNotes[0] ?? (winner.layer.moment >= 22 ? `Moment fit is ${winner.layer.moment} / 30 for a ${durationMin}-minute ${context?.meeting_type.replaceAll("_", " ") ?? "meeting"}.` : `Moment fit is ${winner.layer.moment} / 30. The hour is ordinary for this ask.`),
		winner.layer.cosmicFit >= 22 ? "It also leads the cosmic reading. That layer is playful, not proof." : "The cosmic reading is not what carries this pick."
	];
	let comment = voiceLine(winner.layer, weekday);
	if (context?.stakes === "high") {
		comment = `${when} has the strongest overall fit: ${people.able} of ${people.roster} can attend, with the strongest preference of the set.`;
		if (winner.layer.reading.tongshu.mark === "吉") comment += " The cosmic reading also gives it a 吉.";
	}
	const weaker = [];
	if (backup) {
		if (backup.layer.people.points < people.points) weaker.push("weaker participant preference");
		if (backup.layer.moment < winner.layer.moment) weaker.push("a less suitable window");
		if (backup.layer.cosmicFit < winner.layer.cosmicFit) weaker.push("weaker cosmic alignment");
	}
	return {
		headline: `${when} has the strongest overall alignment.`,
		reasoning: reasoning.slice(0, 4),
		comment,
		backupLabel: backup ? labelOf(backup) : "",
		backupReason: backup ? weaker.length ? `Usable, with ${weaker.join(" and ")}.` : "Close on the numbers, but not the lead." : "",
		lines: scored.map((item) => ({
			slotId: item.slot.id,
			line: slotLine(item, winner)
		}))
	};
}
function cosmicProse(reading) {
	const mark = reading.tongshu.mark ? ` ${reading.tongshu.mark}` : "";
	return `Tong Shu is traditionally associated with “${reading.tongshu.note}” on this date (${reading.tongshu.hundred}${mark}). ${reading.zodiac.note} is a symbolic theme, not a forecast. For fun, ${reading.tarotName} adds a note of ${reading.tarot.detail.replace(/\.$/, "")}. The cosmos gets a vote. Humans still decide.`;
}
//#endregion
export { explainFromScores as n, cosmicProse as t };
