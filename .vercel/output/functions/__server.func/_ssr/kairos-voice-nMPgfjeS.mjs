import { Z as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as CloudRain, i as Sun, p as Clock } from "../_libs/lucide-react.mjs";
import { t as clipVoice } from "./voice-1qktAoll.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kairos-voice-nMPgfjeS.js
var import_jsx_runtime = require_jsx_runtime();
function KairosVoice({ mode, text, status = "neutral", mark, label }) {
	const line = clipVoice(text);
	if (!line) return null;
	const voice = mode === "dating" ? "dating" : mode === "family" ? "family" : mode === "today" ? "today" : mode === "travel" ? "travel" : mode === "oracle" ? "oracle" : "work";
	const heading = label ?? (mode === "dating" ? "月老 says" : mode === "oracle" ? "神婆 says" : mode === "today" ? "Kairos · Today" : "Kairos says");
	const seal = mode === "dating" && (mark || status === "good") ? mark || "吉" : mode !== "dating" ? mark : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "kairos-voice",
		"data-voice": voice,
		"data-status": status,
		children: [
			voice === "dating" || voice === "oracle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "kairos-voice__thread",
				"aria-hidden": true
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: "kairos-voice__label",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: heading }),
					voice === "family" && status === "good" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
						className: "kairos-voice__glyph",
						"aria-hidden": true
					}) : null,
					voice === "family" && status === "warning" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, {
						className: "kairos-voice__glyph",
						"aria-hidden": true
					}) : null,
					voice === "today" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
						className: "kairos-voice__glyph",
						"aria-hidden": true
					}) : null,
					voice === "oracle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kairos-voice__orb",
						"aria-hidden": true
					}) : null,
					seal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kairos-voice__seal",
						children: seal
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "kairos-voice__rule",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
				className: "kairos-voice__quote",
				children: line
			})
		]
	}, line);
}
//#endregion
export { KairosVoice as t };
