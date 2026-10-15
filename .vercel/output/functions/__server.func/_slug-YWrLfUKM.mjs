import { o as __toESM } from "./_runtime.mjs";
import { Q as require_react, Z as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { d as fetchDatingInvite, i as Route$2, l as answerDatingInvite } from "./_ssr/router-TB2ea2rn.mjs";
import { t as KairosVoice } from "./_ssr/kairos-voice-nMPgfjeS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-YWrLfUKM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InvitePage() {
	const params = Route$2.useParams();
	const initial = Route$2.useLoaderData();
	const [result, setResult] = (0, import_react.useState)(initial);
	const [opening, setOpening] = (0, import_react.useState)(false);
	async function retry() {
		setOpening(true);
		console.info("[PUBLIC INVITE] route slug:", params.slug);
		console.info("[PUBLIC INVITE] RPC started");
		try {
			const next = await fetchDatingInvite({ data: { slug: params.slug } });
			console.info("[PUBLIC INVITE] RPC data:", next.state === "ready" ? next.invite : null);
			console.info("[PUBLIC INVITE] RPC error:", next.state === "error" ? next.message : null);
			setResult(next);
		} catch (err) {
			const message = err instanceof Error ? err.message : "The invitation request failed.";
			console.info("[PUBLIC INVITE] RPC error:", message);
			setResult({
				state: "error",
				message
			});
		} finally {
			setOpening(false);
		}
	}
	if (opening) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		"data-mode": "dating",
		className: "grid min-h-screen place-items-center bg-ink px-6 text-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Opening your invitation…" })
	});
	if (result.state === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		"data-mode": "dating",
		className: "grid min-h-screen place-items-center bg-ink px-6 text-center text-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We couldn’t open this invitation right now." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => void retry(),
			className: "press mt-4 min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
			children: "Try again"
		})] })
	});
	if (result.state === "missing") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		"data-mode": "dating",
		className: "grid min-h-screen place-items-center bg-ink px-6 text-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This invitation is no longer available." })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteCard, { initial: result.invite });
}
function InviteCard({ initial }) {
	const [invite, setInvite] = (0, import_react.useState)(initial);
	const [note, setNote] = (0, import_react.useState)("");
	const [times, setTimes] = (0, import_react.useState)("");
	const [asking, setAsking] = (0, import_react.useState)(false);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [replyError, setReplyError] = (0, import_react.useState)("");
	const [lastTry, setLastTry] = (0, import_react.useState)(null);
	async function send(status) {
		setPending(true);
		setReplyError("");
		setLastTry(status);
		try {
			const next = await answerDatingInvite({ data: {
				slug: invite.slug,
				status,
				note,
				times: times.split("\n").map((line) => line.trim()).filter(Boolean)
			} });
			if (next.state === "error") {
				console.error("[Dating response error]", next.message);
				setReplyError("Couldn’t send your reply.");
				return;
			}
			setInvite(next.invite);
			setAsking(false);
		} catch (err) {
			console.error("[Dating response error]", err);
			setReplyError("Couldn’t send your reply.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		"data-mode": "dating",
		className: "min-h-screen bg-ink px-4 py-16 text-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rise mx-auto max-w-md rounded-3xl bg-panel px-6 py-8 shadow-card",
			children: [
				invite.recipientName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-mute",
					children: ["For ", invite.recipientName]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl leading-tight text-cream",
					children: invite.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-sky",
					children: invite.whenLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg text-cream",
					children: invite.area
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-base text-cream",
					children: invite.message
				}),
				invite.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-mute",
					children: invite.note
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-5 text-sm text-mute",
					children: [
						invite.duration,
						" · ",
						invite.dress,
						invite.vibe ? ` · ${invite.vibe}` : ""
					]
				}),
				invite.visibility === "mystery" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-cream",
					children: "Everything else is revealed later."
				}) : null,
				invite.stops.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 border-t border-line pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: [
								stop.slot,
								" · ",
								stop.time
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-lg text-cream",
							children: stop.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-mute",
							children: stop.address
						})
					]
				}, `${stop.time}-${stop.title}`)),
				invite.footer.includes("吉") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
					mode: "dating",
					text: "Solid plan. I'll leave the rest to you.",
					status: "good",
					mark: "吉"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs text-mute",
					children: invite.footer
				}),
				invite.status === "sounds_good" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold tracking-brand text-leaf",
							children: "YOU’RE IN ✓"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-cream",
							children: "Nice. The planner has your reply."
						}),
						invite.replyNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-mute",
							children: invite.replyNote
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
							mode: "dating",
							text: "Good. My work here is mostly done.",
							status: "good",
							mark: "吉"
						})
					]
				}) : null,
				invite.status === "alternate_time_requested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold tracking-brand text-accent",
							children: "GOT IT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-cream",
							children: "Your timing preference has been sent back."
						}),
						invite.replyNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-mute",
							children: invite.replyNote
						}) : null
					]
				}) : null,
				invite.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-6 block text-sm text-cream",
						htmlFor: "reply-note",
						children: "A note, optional"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "reply-note",
						value: note,
						onChange: (event) => setNote(event.target.value),
						maxLength: 280,
						rows: 2,
						className: "mt-1 w-full rounded-xl bg-ink px-3 py-2 text-cream ring-1 ring-line"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: pending,
							onClick: () => void send("sounds_good"),
							className: "press min-h-12 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink",
							children: invite.dateType === "first" ? "I’m up for it" : "Sounds good"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAsking((value) => !value),
							className: "press min-h-12 rounded-xl px-4 text-sm font-semibold text-cream ring-1 ring-line",
							children: invite.dateType === "first" ? "Suggest another time" : "Another day?"
						})]
					}),
					asking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm text-cream",
								htmlFor: "other-times",
								children: "Times that work better"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "other-times",
								value: times,
								onChange: (event) => setTimes(event.target.value),
								rows: 3,
								placeholder: "Saturday evening\nSunday afternoon",
								className: "mt-1 w-full rounded-xl bg-ink px-3 py-2 text-cream ring-1 ring-line"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: pending,
								onClick: () => void send("alternate_time_requested"),
								className: "press mt-2 min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
								children: "Send times"
							})
						]
					}) : null,
					replyError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-cream",
							children: "Couldn’t send your reply."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: pending || !lastTry,
							onClick: () => lastTry && void send(lastTry),
							className: "press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
							children: "Try again"
						})]
					}) : null
				] }) : null
			]
		})
	});
}
//#endregion
export { InvitePage as component };
