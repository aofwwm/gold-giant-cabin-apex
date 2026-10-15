//#region node_modules/.nitro/vite/services/ssr/assets/voice-1qktAoll.js
var BANNED = /soulmate|destiny|eternal love|\bfated\b|true love|meant to be/i;
function clipVoice(text, max = 20) {
	const clean = text.replace(/[“”]/g, "").replace(/\s+/g, " ").trim();
	if (!clean || BANNED.test(clean)) return "";
	const words = clean.split(" ").filter(Boolean);
	const cut = words.slice(0, max).join(" ");
	if (!cut) return "";
	if (words.length <= max || /[.!?]$/.test(cut)) return cut;
	return `${cut.replace(/[,:;]$/, "")}.`;
}
//#endregion
export { clipVoice as t };
