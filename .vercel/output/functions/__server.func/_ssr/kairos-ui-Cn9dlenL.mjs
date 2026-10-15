import { o as __toESM } from "../_runtime.mjs";
import { i as formatWhen } from "./time-I2ZWfIie.mjs";
import { t as counts } from "./tally-BBpMkCHy.mjs";
import { Q as require_react, Z as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kairos-ui-Cn9dlenL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MARK = {
	love: "😍",
	yes: "🙂",
	soft: "😩",
	no: "❌"
};
var VOTE_LABEL = {
	love: "Great for me",
	yes: "Can make it",
	soft: "Please no",
	no: "Cannot"
};
var VOTE_ORDER = [
	"love",
	"yes",
	"soft",
	"no"
];
var fieldClass = "h-12 w-full min-w-0 rounded-xl bg-ink px-3 text-base text-cream ring-1 ring-line outline-none placeholder:text-mute";
function Frame({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid-veil pointer-events-none fixed inset-0 -z-10",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 bg-vermilion" }),
			children
		]
	});
}
function Seal({ label = "吉" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "seal",
		"aria-hidden": true,
		children: label
	});
}
var VOTE_TONE = {
	love: "bg-jade text-ink",
	yes: "bg-gold text-ink",
	soft: "bg-panel text-cream ring-1 ring-gold",
	no: "bg-vermilion text-cream"
};
function SlotCard({ slot, durationMin, leading = false, mine, onVote, pending = false, preview = false }) {
	const tally = counts(slot.votes);
	const headline = slot.label || formatWhen(slot.startsAt);
	const detail = slot.label ? `${formatWhen(slot.startsAt)} · ${durationMin} min` : `${durationMin} min`;
	const shown = slot.votes.slice(0, 8);
	const extra = slot.votes.length - shown.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl bg-panel p-4 shadow-card sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xl leading-tight text-cream",
						children: headline
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mute",
						children: detail
					})]
				}), leading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-ink",
					children: "Kairos pick"
				}) : null]
			}),
			slot.venueNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-cream",
				children: slot.venueNote
			}) : null,
			slot.votes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-lg leading-none",
				"aria-hidden": true,
				children: slot.votes.map((vote) => MARK[vote.choice]).join(" ")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-mute",
				children: "No preference yet. Can is not the same as want."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: clsx("mt-4 grid grid-cols-2 gap-2", preview && "pointer-events-none"),
				"aria-hidden": preview,
				children: VOTE_ORDER.map((choice) => {
					const active = mine === choice;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: clsx("press min-h-11 rounded-xl px-2 text-sm font-semibold", active ? VOTE_TONE[choice] : "bg-ink text-cream ring-1 ring-line"),
						"aria-pressed": active,
						disabled: preview ? false : pending || !onVote,
						onClick: () => onVote?.(choice),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								"aria-hidden": true,
								children: MARK[choice]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								children: VOTE_LABEL[choice]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block tabular-nums font-medium",
								children: tally[choice]
							})
						]
					}, choice);
				})
			}),
			shown.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 flex flex-wrap gap-1.5",
				children: [shown.map((vote) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-full bg-ink px-2.5 py-1 text-xs ring-1 ring-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							"aria-hidden": true,
							children: [MARK[vote.choice], " "]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-cream",
							children: vote.nickname
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-mute",
							children: [" ", VOTE_LABEL[vote.choice].toLowerCase()]
						})
					]
				}, vote.nickname)), extra > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "px-1 py-1 text-xs text-mute",
					children: ["+", extra]
				}) : null]
			}) : null
		]
	});
}
function ConfettiBurst({ burst }) {
	const [reduced, setReduced] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	}, []);
	if (!burst || reduced) return null;
	const bits = Array.from({ length: 28 }, (_, index) => {
		const angle = index / 28 * Math.PI * 2;
		const dist = 88 + index % 6 * 24;
		return {
			dx: Math.cos(angle) * dist,
			dy: Math.sin(angle) * dist - 36,
			rot: (index % 2 === 0 ? 1 : -1) * (90 + index * 9),
			color: index % 3 === 0 ? "bg-vermilion" : index % 3 === 1 ? "bg-gold" : "bg-jade",
			delay: index % 5 * 18
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-0 z-40 overflow-hidden",
		"aria-hidden": true,
		children: bits.map((bit, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: clsx("confetti-bit", bit.color),
			style: {
				animationDelay: `${bit.delay}ms`,
				["--dx"]: `${bit.dx}px`,
				["--dy"]: `${bit.dy}px`,
				["--rot"]: `${bit.rot}deg`
			}
		}, `${burst}-${index}`))
	}, burst);
}
//#endregion
export { SlotCard as a, Seal as i, Frame as n, fieldClass as o, MARK as r, ConfettiBurst as t };
