import { r as applyMomentContext } from "./mission-DOaVQo-M.mjs";
import { i as rosterSize } from "./tally-BBpMkCHy.mjs";
import { a as readReading, o as scoreLayers, r as markOf } from "./reading-Dc18t2Vi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/score-CShSeQph.js
function scoreSlots(slots, title, kind, durationMin, context = null) {
	const roster = rosterSize(slots);
	return slots.map((slot) => {
		const reading = readReading(slot.startsAt, title, {
			kind,
			durationMin
		});
		const layer = scoreLayers(reading, slot.votes, roster);
		const adjusted = applyMomentContext(layer.moment, reading, durationMin, slot.startsAt, context);
		const total = layer.people.waiting ? null : Math.max(0, Math.min(100, layer.people.points + adjusted.moment + layer.cosmicFit));
		return {
			slot,
			layer: {
				...layer,
				moment: adjusted.moment,
				momentNotes: adjusted.notes,
				total,
				mark: total == null ? "" : markOf(total)
			}
		};
	});
}
function pickWinner(scored) {
	const voted = scored.filter((item) => item.layer.total != null);
	if (voted.length === 0) return null;
	return voted.reduce((best, item) => {
		if (item.layer.total > best.layer.total) return item;
		if (item.layer.total === best.layer.total && item.layer.people.points > best.layer.people.points) return item;
		return best;
	});
}
function scoreFingerprint(scored) {
	return scored.map((item) => {
		const people = item.layer.people;
		return [
			item.slot.id,
			item.layer.total ?? "x",
			people.points,
			item.layer.moment,
			item.layer.cosmicFit,
			people.love,
			people.yes,
			people.soft,
			people.no
		].join(".");
	}).join("|");
}
//#endregion
export { scoreFingerprint as n, scoreSlots as r, pickWinner as t };
