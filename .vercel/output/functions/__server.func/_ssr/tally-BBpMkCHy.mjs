//#region node_modules/.nitro/vite/services/ssr/assets/tally-BBpMkCHy.js
function heat(votes) {
	let score = 0;
	for (const vote of votes) if (vote.choice === "love") score += 4;
	else if (vote.choice === "yes") score += 2;
	else if (vote.choice === "soft") score += 0;
	else score -= 3;
	return score;
}
function counts(votes) {
	return {
		love: votes.filter((v) => v.choice === "love").length,
		yes: votes.filter((v) => v.choice === "yes").length,
		soft: votes.filter((v) => v.choice === "soft").length,
		no: votes.filter((v) => v.choice === "no").length
	};
}
function rosterSize(slots) {
	const names = /* @__PURE__ */ new Set();
	for (const slot of slots) for (const vote of slot.votes) names.add(vote.nickname.trim().toLowerCase());
	return names.size;
}
function clamp(n, min, max) {
	return Math.max(min, Math.min(max, n));
}
/** Willingness, not just availability. Empty ballots do not invent a score. */
function peopleFit(votes, roster) {
	const tally = counts(votes);
	const voted = tally.love + tally.yes + tally.soft + tally.no;
	const able = tally.love + tally.yes + tally.soft;
	const base = {
		max: 40,
		roster,
		voted,
		love: tally.love,
		yes: tally.yes,
		soft: tally.soft,
		no: tally.no,
		able
	};
	if (roster === 0 || voted === 0) return {
		...base,
		points: 0,
		waiting: true
	};
	const attendance = able / roster;
	const enthusiasm = (tally.love + tally.yes * .45) / roster;
	const coverage = voted / roster;
	let points = Math.round(22 * attendance + 14 * enthusiasm + 4 * coverage);
	points -= Math.min(16, tally.no * 6 + tally.soft * 2);
	return {
		...base,
		points: clamp(points, 0, 40),
		waiting: false
	};
}
function leadingSlot(slots) {
	let best = null;
	let bestHeat = 0;
	for (const slot of slots) {
		const value = heat(slot.votes);
		if (value <= 0) continue;
		if (!best || value > bestHeat || value === bestHeat && slot.score > best.score) {
			best = slot;
			bestHeat = value;
		}
	}
	return best;
}
//#endregion
export { rosterSize as i, leadingSlot as n, peopleFit as r, counts as t };
