import { o as __toESM } from "../_runtime.mjs";
import { a as literal, d as union, l as string, r as boolean, s as object, t as _enum } from "../_libs/zod.mjs";
import { a as missionSchema, r as applyMomentContext } from "./mission-DOaVQo-M.mjs";
import { r as formatMoment } from "./time-I2ZWfIie.mjs";
import { i as rosterSize } from "./tally-BBpMkCHy.mjs";
import { c as whyBullets, i as momentPoints, s as voiceLine, t as cosmicPoints } from "./reading-Dc18t2Vi.mjs";
import { t as pickWinner } from "./score-CShSeQph.mjs";
import { Q as require_react, Z as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { r as MARK } from "./kairos-ui-Cn9dlenL.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { a as Sparkles, h as CalendarPlus, t as Users } from "../_libs/lucide-react.mjs";
import { T as createSsrRpc } from "./router-TB2ea2rn.mjs";
import { t as KairosVoice } from "./kairos-voice-nMPgfjeS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kairos.intelligence-DeDoxrIH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MISSION_COPY = {
	pitch: "Budget discussion",
	vendor: "Vendor discussion",
	difficult: "Difficult conversation",
	bonding: "Team bonding",
	makan: "Team makan",
	general: "Working conversation"
};
function markClass(mark) {
	if (mark === "吉") return "text-jade";
	if (mark === "平") return "text-gold";
	return "text-vermilion";
}
function Bar({ value, max, tone }) {
	const width = Math.max(0, Math.min(100, value / max * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 overflow-hidden rounded-full bg-ink",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: clsx("h-full rounded-full", tone === "jade" ? "bg-jade" : tone === "gold" ? "bg-gold" : "bg-cream"),
			style: { width: `${width}%` }
		})
	});
}
function faces(votes) {
	return votes.map((vote) => MARK[vote.choice]).join(" ");
}
function BoardHero({ scored, durationMin, revealed, onReveal, onShare, onCopy, onFull, onInvite, pending, explanation = null, explainPending = false, stale = false, onRefreshExplanation, cosmicText = "", cosmicPending = false, missionLabel = "", missionSummary = "", where = "", followOn = null, onGoogleCalendar, googleNote = "" }) {
	const [full, setFull] = (0, import_react.useState)(false);
	const winner = pickWinner(scored);
	const voters = rosterSize(scored.map((item) => item.slot));
	if (scored.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "kairos-result",
		className: "rounded-2xl bg-panel p-5 shadow-card sm:p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-gold",
				children: "HUMAN PREFERENCE + MOMENT + COSMOS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-sans text-3xl font-semibold leading-tight text-cream",
				children: "Add a moment first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-mute",
				children: "Kairos compares times people can actually vote on. Spin a spot, or add an hour."
			})
		]
	});
	if (!revealed || !winner || winner.layer.total == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "kairos-result",
		className: "rounded-2xl bg-panel p-5 shadow-card sm:p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-gold",
				children: "HUMAN PREFERENCE + MOMENT + COSMOS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-sans text-3xl font-semibold leading-tight text-cream",
				children: voters === 0 ? "Not every free slot is a wanted slot." : "The nicknames are in."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm text-mute",
				children: voters === 0 ? "People vote with a nickname. No login. No calendar. Kairos waits for willingness before it names a moment." : `${voters} ${voters === 1 ? "person has" : "people have"} weighed in. Kairos can compare preference, context, and a smaller cosmic vote.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-jade pl-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-jade",
								children: "PEOPLE FIT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-2xl font-semibold tabular-nums text-cream",
								children: "40"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: "Willingness, not just availability."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-cream pl-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-cream",
								children: "MOMENT FIT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-2xl font-semibold tabular-nums text-cream",
								children: "30"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: "Purpose, length, and the shape of the day."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-gold pl-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-gold",
								children: "COSMIC FIT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-2xl font-semibold tabular-nums text-cream",
								children: "30"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: "A playful vote. Not a forecast."
							})
						]
					})
				]
			}),
			voters > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onReveal,
				className: "press mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-vermilion text-base font-semibold text-cream",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					className: "size-4",
					"aria-hidden": true
				}), "Find our Kairos moment"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-mute",
				children: "The cosmos gets a vote. Humans still decide."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-3",
				children: scored.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-ink px-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-cream",
								children: item.slot.label || formatMoment(item.slot.startsAt)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-mute",
								children: "People fit waiting"
							})]
						}),
						item.slot.votes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-lg leading-none",
							"aria-hidden": true,
							children: faces(item.slot.votes)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-mute",
							children: "No votes on this time yet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-mute",
							children: [
								"Moment ",
								item.layer.moment,
								" / 30 · Cosmos ",
								item.layer.cosmicFit,
								" / 30"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: item.layer.moment,
								max: 30,
								tone: "cream"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: item.layer.cosmicFit,
								max: 30,
								tone: "gold"
							})]
						})
					]
				}, item.slot.id))
			})
		]
	});
	const layer = winner.layer;
	const when = winner.slot.label || formatMoment(winner.slot.startsAt);
	const weekdayHint = formatMoment(winner.slot.startsAt).slice(0, 3);
	const bullets = explanation?.reasoning?.length ? explanation.reasoning : whyBullets(layer, durationMin);
	const comment = explanation?.comment || voiceLine(layer, weekdayHint);
	const count = scored.length;
	const answered = scored.filter((item) => item.layer.total != null).length;
	const bestLine = answered === count ? `Best of ${count} proposed ${count === 1 ? "time" : "times"}` : `Best of ${answered} answered ${answered === 1 ? "time" : "times"}`;
	const peopleLine = layer.people.points >= 30 ? "The people agree." : layer.people.soft + layer.people.no > 0 ? "The people are split." : "The people can live with it.";
	const momentLine = layer.moment >= 20 ? "The timing works." : "The timing is ordinary.";
	const cosmicLine = layer.cosmicFit >= 20 ? "The universe is not complaining either." : "The universe is merely polite.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "kairos-result",
		className: "rounded-2xl bg-panel p-5 shadow-card sm:p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-xs font-semibold tracking-brand text-gold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "size-3.5",
							"aria-hidden": true
						}), "KAIROS PICK"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-sans text-3xl font-semibold leading-tight text-cream sm:text-4xl",
						children: when
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-mute",
						children: [
							durationMin,
							" min · ",
							bestLine
						]
					}),
					where ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-cream",
						children: where
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: clsx("grid size-14 shrink-0 -rotate-6 place-items-center rounded-sm border-2 font-display text-3xl leading-none", layer.mark === "吉" ? "border-jade text-jade" : layer.mark === "平" ? "border-gold text-gold" : "border-vermilion text-vermilion"),
					"aria-hidden": true,
					children: layer.mark
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-end gap-x-4 gap-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-6xl font-semibold leading-none tabular-nums tracking-tight text-cream",
					children: layer.total
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-cream",
						children: "/ 100"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mute",
						children: "Kairos Score"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex h-2 overflow-hidden rounded-full bg-ink",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-jade",
						style: { width: `${layer.people.points}%` }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-cream",
						style: { width: `${layer.moment}%` }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-gold",
						style: { width: `${layer.cosmicFit}%` }
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-mute",
				children: "Jade is the people. Cream is the moment. Gold is the cosmos, and it weighs less."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center gap-2 text-cream",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
					className: "size-4 text-jade",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg leading-none",
					"aria-hidden": true,
					children: faces(winner.slot.votes)
				})]
			}),
			winner.slot.votes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-wrap gap-1.5",
				children: winner.slot.votes.map((vote) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-full bg-ink px-2.5 py-1 text-xs ring-1 ring-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						"aria-hidden": true,
						children: [MARK[vote.choice], " "]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-cream",
						children: vote.nickname
					})]
				}, vote.nickname))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-base text-cream",
				children: peopleLine
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base text-cream",
				children: momentLine
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base text-cream",
				children: cosmicLine
			}),
			explanation?.headline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm font-semibold text-cream",
				children: explanation.headline
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
				mode: "meet",
				text: comment,
				status: layer.mark === "吉" ? "good" : layer.mark === "凶" ? "warning" : "neutral",
				mark: layer.mark === "吉" ? "吉" : void 0
			}),
			explainPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: "Aligning people, timing and the cosmos..."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-jade pl-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-brand text-jade",
									children: "PEOPLE FIT"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-lg font-semibold tabular-nums text-cream",
									children: [layer.people.points, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium text-mute",
										children: " / 40"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: layer.people.points,
								max: 40,
								tone: "jade"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-cream",
								children: [
									layer.people.able,
									" / ",
									layer.people.roster,
									" can attend"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-mute",
								children: [
									layer.people.love,
									" great · ",
									layer.people.yes,
									" can make it · ",
									layer.people.soft,
									" please no · ",
									layer.people.no,
									" cannot"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-cream pl-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-brand text-cream",
									children: "MOMENT FIT"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-lg font-semibold tabular-nums text-cream",
									children: [layer.moment, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium text-mute",
										children: " / 30"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: layer.moment,
								max: 30,
								tone: "cream"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-mute",
								children: [
									missionLabel || MISSION_COPY[layer.reading.mission],
									" · ",
									durationMin,
									" min"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: layer.reading.fit.note
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: layer.reading.breathing.note
							}),
							layer.momentNotes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: note
							}, note)),
							missionSummary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-mute",
								children: missionSummary
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-gold pl-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-brand text-gold",
									children: "COSMIC FIT"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-lg font-semibold tabular-nums text-cream",
									children: [layer.cosmicFit, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium text-mute",
										children: " / 30"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: layer.cosmicFit,
								max: 30,
								tone: "gold"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-mute",
								children: [
									"Tong Shu ",
									layer.reading.tongshu.hundred,
									layer.reading.tongshu.mark ? ` · ${layer.reading.tongshu.mark}` : "",
									" · ",
									layer.reading.tongshu.note
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-mute",
								children: [
									layer.reading.zodiac.note,
									" · ",
									layer.reading.tarot.note
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-mute",
				children: "The cosmos gets a vote. Humans still decide."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-semibold tracking-brand text-cream",
						children: "WHY THIS MOMENT?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: bullets.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-cream",
							children: line
						}, line))
					}),
					explanation?.backupLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-mute",
						children: [
							"Backup: ",
							explanation.backupLabel,
							". ",
							explanation.backupReason
						]
					}) : null,
					stale && onRefreshExplanation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onRefreshExplanation,
						className: "press mt-3 min-h-11 text-sm font-semibold text-gold",
						children: "Align the reading"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xs font-semibold tracking-brand text-gold",
					children: [
						"YOUR ",
						count,
						" ",
						count === 1 ? "MOMENT" : "MOMENTS"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: scored.map((item) => {
						const picked = item.slot.id === winner.slot.id;
						const total = item.layer.total;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: clsx("rounded-xl px-3 py-3", picked ? "bg-ink" : ""),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-cream",
										children: item.slot.label || formatMoment(item.slot.startsAt)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-semibold tabular-nums text-cream",
										children: [total == null ? "—" : total, item.layer.mark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: clsx("ml-2 font-display", markClass(item.layer.mark)),
											children: item.layer.mark
										}) : null]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-mute",
									children: [
										"People ",
										item.layer.people.waiting ? "—" : item.layer.people.points,
										" · Moment ",
										item.layer.moment,
										" · Cosmos",
										" ",
										item.layer.cosmicFit
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-mute",
									children: item.layer.people.waiting ? "No votes on this time yet." : `${item.layer.people.able} / ${item.layer.people.roster} can attend${item.layer.people.love ? ` · ${item.layer.people.love} great` : ""}${item.layer.people.soft ? ` · ${item.layer.people.soft} please no` : ""}`
								}),
								explanation?.lines.find((line) => line.slotId === item.slot.id)?.line ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-cream",
									children: explanation.lines.find((line) => line.slotId === item.slot.id)?.line
								}) : null,
								item.slot.votes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-base leading-none",
									"aria-hidden": true,
									children: faces(item.slot.votes)
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: item.layer.people.waiting ? 0 : item.layer.people.points,
											max: 40,
											tone: "jade"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: item.layer.moment,
											max: 30,
											tone: "cream"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: item.layer.cosmicFit,
											max: 30,
											tone: "gold"
										})
									]
								}),
								picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs font-semibold text-gold",
									children: "Kairos pick"
								}) : null
							]
						}, item.slot.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 border-t border-line pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-gold",
						children: "HOUR NOTE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-2xl text-cream",
						children: layer.reading.weather.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-cream",
						children: layer.reading.weather.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-gold",
						children: layer.reading.weather.forecast
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-mute",
						children: "A joke about the shape of the hour. Not a diary, and not anyone’s mood."
					})
				]
			}),
			full ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullReading, {
				reading: layer.reading,
				durationMin,
				prose: cosmicText,
				pending: cosmicPending,
				missionLabel
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-3",
				children: [
					followOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: followOn.href,
						className: "block rounded-xl bg-ink px-4 py-3 ring-1 ring-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-cream",
								children: followOn.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-mute",
								children: followOn.note
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-semibold text-gold",
								children: followOn.label
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onShare,
						disabled: pending,
						className: "press flex h-12 w-full items-center justify-center rounded-xl bg-vermilion font-semibold text-cream disabled:opacity-50",
						children: "Share this moment"
					}),
					onGoogleCalendar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onGoogleCalendar,
						className: "press flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink text-sm font-semibold text-cream ring-1 ring-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, {
							className: "size-4 text-gold",
							"aria-hidden": true
						}), "Add to Google Calendar"]
					}) : null,
					googleNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-mute",
						children: googleNote
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-x-4 gap-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setFull(true);
									onFull();
								},
								className: "press min-h-11 text-sm font-semibold text-gold",
								children: "See full cosmic reading"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onCopy,
								className: "press min-h-11 text-sm font-semibold text-cream",
								children: "Copy result"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onInvite,
								className: "press min-h-11 text-sm font-semibold text-cream",
								children: "Create calendar invite"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "press inline-flex min-h-11 items-center text-sm font-semibold text-mute",
								href: "#votes",
								children: "Try another time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "press inline-flex min-h-11 items-center text-sm font-semibold text-mute",
								href: "#nickname",
								children: "Reopen voting"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-mute",
						children: "The invite is a file for your own calendar. Nobody else is connected."
					})
				]
			})
		]
	});
}
function FullReading({ reading, durationMin, prose, pending, missionLabel }) {
	const rows = [
		[
			"Tong Shu",
			`${reading.tongshu.hundred} · ${reading.tongshu.note}`,
			reading.tongshu.detail
		],
		[
			"Zodiac",
			reading.zodiac.note,
			reading.zodiac.detail
		],
		[
			"Tarot",
			reading.tarot.note,
			reading.tarot.detail
		],
		[
			"Western astrology",
			reading.astrology.note,
			reading.astrology.detail
		],
		[
			"Numerology",
			`${reading.numerology.hundred} · ${reading.numerology.note}`,
			reading.numerology.detail
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "full-reading",
		className: "mt-8 border-t border-line pt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xs font-semibold tracking-brand text-gold",
				children: "FULL READING"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-mute",
				children: [
					missionLabel || MISSION_COPY[reading.mission],
					" · ",
					durationMin,
					" min. Cosmic blend ",
					reading.blend,
					" / 100. Playful, not proven."
				]
			}),
			pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-gold",
				children: "Consulting the universe..."
			}) : null,
			prose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-cream",
				children: prose
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: rows.map(([label, note, detail]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-cream",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-cream",
						children: note
					}),
					detail && detail !== note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mute",
						children: detail
					}) : null
				] }, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-mute",
				children: reading.fit.note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: reading.breathing.note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-mute",
				children: "The cosmos gets a vote. Humans still decide."
			})
		]
	});
}
function InviteStage({ durationMin, moments, sharedCode, copied, pending, onOpen, context = null }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "kairos-result",
		className: "rounded-2xl bg-panel p-5 shadow-card sm:p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-gold",
				children: "HUMAN PREFERENCE + MOMENT + COSMOS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 max-w-xl font-sans text-3xl font-semibold leading-tight text-cream sm:text-4xl",
				children: "Find when everyone can make it, when they actually want to, and whether the universe approves."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm text-mute",
				children: "Normal tools ask who is free. Kairos asks who wants the hour. Guests vote with a nickname. No login. No calendar."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-jade pl-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-jade",
								children: "PEOPLE FIT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-2xl font-semibold tabular-nums text-cream",
								children: "40"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: "Great, can, please no, cannot."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-cream pl-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-cream",
								children: "MOMENT FIT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-2xl font-semibold tabular-nums text-cream",
								children: "30"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: "Purpose, length, time of day."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-gold pl-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-gold",
								children: "COSMIC FIT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-2xl font-semibold tabular-nums text-cream",
								children: "30"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: "Tong Shu gets a vote. You decide."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-mute",
				children: "The cosmos gets a vote. Humans still decide."
			}),
			sharedCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl bg-ink p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-gold",
						children: "THE LINK"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-2xl tracking-widest text-gold",
						children: sharedCode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-cream",
						children: [copied ? "Link copied." : "Board is open.", " Send it. They vote. Then Kairos decides."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onOpen,
						disabled: pending,
						className: "press mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-vermilion font-semibold text-cream disabled:opacity-50",
						children: "Open the board"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-semibold tracking-brand text-cream",
						children: "CONTEXT PREVIEW"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-mute",
						children: "Moment and cosmos only. People fit stays blank until nicknames vote. This is not a Kairos Score."
					}),
					moments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-mute",
						children: "Add two or three times. Kairos will not invent a winner from an empty list."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: moments.map((moment) => {
							const base = momentPoints(moment.reading.real);
							const adjusted = applyMomentContext(base, moment.reading, durationMin, moment.iso, context);
							const momentFit = adjusted.moment;
							const cosmicFit = cosmicPoints(moment.reading.cosmic);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-xl bg-ink px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-baseline justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-cream",
											children: formatMoment(moment.iso)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-mute",
											children: [durationMin, " min"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-mute",
										children: moment.reading.fit.note
									}),
									adjusted.notes[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-mute",
										children: adjusted.notes[0]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs text-mute",
										children: [
											"Moment ",
											momentFit,
											" / 30 · Cosmos ",
											cosmicFit,
											" / 30 · People waiting"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: momentFit,
											max: 30,
											tone: "cream"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: cosmicFit,
											max: 30,
											tone: "gold"
										})]
									})
								]
							}, moment.iso);
						})
					})
				]
			})
		]
	});
}
var DEFAULT_TIMEZONE = "Asia/Singapore";
function clean(value) {
	return (value ?? "").replace(/\s+/g, " ").trim();
}
function joinParts(parts) {
	return parts.map((part) => clean(part)).filter(Boolean).join(", ");
}
/** Wall-clock digits in `timeZone`, not UTC. Google reads these with `ctz`. */
function formatGoogleDate(instant, timeZone) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23"
	}).formatToParts(instant);
	const read = (type) => parts.find((part) => part.type === type)?.value ?? "00";
	const hour = read("hour") === "24" ? "00" : read("hour");
	return `${read("year")}${read("month")}${read("day")}T${hour}${read("minute")}${read("second")}`;
}
function physicalLocation(event) {
	return joinParts([
		event.venueName,
		event.room,
		event.address
	]);
}
function locationFor(event) {
	const format = event.meetingFormat || "physical";
	const physical = physicalLocation(event);
	const platform = clean(event.onlinePlatform);
	if (format === "online") return platform || physical;
	return physical;
}
function descriptionFor(event) {
	const lines = ["Decided with Kairos 良辰吉日 AI"];
	if (typeof event.kairosScore === "number" && Number.isFinite(event.kairosScore)) {
		const mark = clean(event.kairosStatus);
		lines.push(`Kairos Score: ${event.kairosScore}/100${mark ? ` · ${mark}` : ""}`);
	}
	const roster = event.participantCount;
	if (typeof roster === "number" && roster > 0 && typeof event.canAttend === "number") lines.push(`${event.canAttend}/${roster} participants can attend.`);
	if (typeof roster === "number" && roster > 0 && typeof event.preferredCount === "number") lines.push(`${event.preferredCount}/${roster} marked this as their preferred timing.`);
	const purpose = clean(event.purpose);
	if (purpose) {
		lines.push("");
		lines.push("Purpose:");
		lines.push(purpose);
	}
	const url = clean(event.onlineUrl);
	const platform = clean(event.onlinePlatform);
	if (url && (event.meetingFormat === "online" || event.meetingFormat === "hybrid")) {
		lines.push("");
		lines.push(event.meetingFormat === "hybrid" ? "Join online:" : "Online meeting:");
		if (platform) lines.push(platform);
		lines.push(url);
	}
	const makanName = clean(event.makanName);
	if (makanName) {
		lines.push("");
		lines.push(`${clean(event.makanLabel) || "Makan"}:`);
		lines.push(makanName);
		const makanTime = clean(event.makanTime);
		if (makanTime) lines.push(makanTime);
	}
	lines.push("");
	lines.push("The cosmos gets a vote. Humans still decide.");
	return lines.join("\n");
}
function createGoogleCalendarUrl(event) {
	const timeZone = clean(event.timezone) || DEFAULT_TIMEZONE;
	const start = new Date(event.startTime);
	if (Number.isNaN(start.getTime())) throw new Error("That start time cannot be calendared");
	const minutes = Number.isFinite(event.durationMinutes) ? Math.max(1, Math.round(event.durationMinutes)) : 60;
	const end = new Date(start.getTime() + minutes * 6e4);
	const params = new URLSearchParams({
		action: "TEMPLATE",
		text: clean(event.title) || "Meeting",
		dates: `${formatGoogleDate(start, timeZone)}/${formatGoogleDate(end, timeZone)}`,
		details: descriptionFor(event),
		ctz: timeZone
	});
	const location = locationFor(event);
	if (location) params.set("location", location);
	return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
var codeSchema = string().trim().regex(/^[a-zA-Z0-9]{4,12}$/).transform((value) => value.toLowerCase());
var durationSchema = union([
	literal(30),
	literal(45),
	literal(60),
	literal(90),
	literal(120)
]);
var analyzeMission = createServerFn({ method: "POST" }).validator((input) => object({
	title: string().trim().min(2).max(200),
	kind: _enum(["meeting", "makan"]),
	durationMin: durationSchema
}).parse(input)).handler(createSsrRpc("9df038b20cb63ce8c7f21b024b127abe529448cbe4a64eb9e8b73906de2fd2d3"));
var explainKairos = createServerFn({ method: "POST" }).validator((input) => object({
	code: codeSchema,
	refresh: boolean().optional()
}).parse(input)).handler(createSsrRpc("388175e52087477d5871ba99a0ab563fb6e034712d9929e8f20c91d9c679f095"));
var interpretCosmos = createServerFn({ method: "POST" }).validator((input) => object({
	code: codeSchema,
	slotId: string().trim().min(6).max(16)
}).parse(input)).handler(createSsrRpc("5b495d32f05ca017d7e6b22bae05182ac2a63e7d4147f5744ae67fc251e702e5"));
var saveMission = createServerFn({ method: "POST" }).validator((input) => object({
	code: codeSchema,
	mission: missionSchema,
	source: _enum(["grok", "rules"]).optional()
}).parse(input)).handler(createSsrRpc("59af517741876a2dc001aa72ab35a55444d3b454ffb0663333f5ca50d5059a65"));
//#endregion
export { explainKairos as a, createGoogleCalendarUrl as i, InviteStage as n, interpretCosmos as o, analyzeMission as r, saveMission as s, BoardHero as t };
