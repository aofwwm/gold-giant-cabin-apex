//#region node_modules/.nitro/vite/services/ssr/assets/provider-usage-CqiDrKv8.js
function emptyCounts() {
	return {
		calls: 0,
		hits: 0,
		misses: 0,
		failures: 0
	};
}
function emptyBoard() {
	return {
		gemini: emptyCounts(),
		discovery: emptyCounts(),
		routing: emptyCounts(),
		photo: emptyCounts(),
		weather: emptyCounts(),
		geocode: emptyCounts()
	};
}
var startedAt = (/* @__PURE__ */ new Date()).toISOString();
var dayKey = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var session = emptyBoard();
var today = emptyBoard();
var failures = [];
function roll() {
	const next = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	if (next === dayKey) return;
	dayKey = next;
	today = emptyBoard();
}
function bump(board, channel, field) {
	board[channel][field] += 1;
}
function noteCall(channel, provider = "") {
	roll();
	bump(session, channel, "calls");
	bump(today, channel, "calls");
	if (provider.length > 80) provider = provider.slice(0, 80);
}
function noteCache(channel, hit) {
	roll();
	const field = hit ? "hits" : "misses";
	bump(session, channel, field);
	bump(today, channel, field);
}
function noteFailure(channel, provider, message) {
	roll();
	bump(session, channel, "failures");
	bump(today, channel, "failures");
	failures.unshift({
		channel,
		provider: provider.replace(/\s+/g, " ").trim().slice(0, 40),
		message: message.replace(/\s+/g, " ").trim().slice(0, 80)
	});
	if (failures.length > 12) failures.pop();
}
function usageSnapshot() {
	roll();
	return {
		since: startedAt,
		day: dayKey,
		session: structuredClone(session),
		today: structuredClone(today),
		recentFailures: failures.slice()
	};
}
//#endregion
export { usageSnapshot as i, noteCall as n, noteFailure as r, noteCache as t };
