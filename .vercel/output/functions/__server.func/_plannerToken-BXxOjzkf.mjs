import { o as __toESM } from "./_runtime.mjs";
import { Q as require_react, Z as require_jsx_runtime, b as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { b as rememberDatingReply, g as publicInviteUrl, l as invitationStatusLabel, p as planIdForPlannerToken, t as INVITE_SLUG } from "./_ssr/dating-invite-DIfg4EzO.mjs";
import { g as revokeDatingInvite, n as Route } from "./_ssr/router-TB2ea2rn.mjs";
import { t as loadPlannerInvite } from "./_ssr/dating-planner-read-BhfJwk7W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_plannerToken-BXxOjzkf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ManagePage() {
	const { plannerToken } = Route.useParams();
	const initial = Route.useLoaderData();
	const [result, setResult] = (0, import_react.useState)(initial);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [confirmRevoke, setConfirmRevoke] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	const invite = result.state === "ready" ? result.invite : null;
	const recipientUrl = invite ? publicInviteUrl(invite.slug) : "";
	const [booting, setBooting] = (0, import_react.useState)(initial.state !== "ready");
	async function refresh(quiet = false) {
		if (!INVITE_SLUG.test(plannerToken)) {
			setResult({ state: "missing" });
			return;
		}
		if (!quiet) setPending(true);
		try {
			const found = await loadPlannerInvite(plannerToken);
			if (!found) {
				if (!quiet) setResult({ state: "missing" });
				return;
			}
			const planId = planIdForPlannerToken(plannerToken);
			if (planId) rememberDatingReply(planId, found.status, { inviteSlug: found.slug });
			setResult({
				state: "ready",
				invite: found
			});
		} catch (err) {
			console.error("[Dating planner]", err);
			setResult({
				state: "error",
				message: "Couldn’t open this invitation."
			});
		} finally {
			if (!quiet) setPending(false);
		}
	}
	(0, import_react.useEffect)(() => {
		let stop = false;
		async function tick() {
			if (document.visibilityState === "hidden") return;
			await refresh(true);
			if (!stop) setBooting(false);
		}
		tick();
		const timer = window.setInterval(() => void tick(), 12e3);
		const onFocus = () => void tick();
		const onVisible = () => {
			if (document.visibilityState === "visible") tick();
		};
		window.addEventListener("focus", onFocus);
		document.addEventListener("visibilitychange", onVisible);
		return () => {
			stop = true;
			window.clearInterval(timer);
			window.removeEventListener("focus", onFocus);
			document.removeEventListener("visibilitychange", onVisible);
		};
	}, [plannerToken]);
	async function copyRecipient() {
		if (!recipientUrl || recipientUrl.includes("/date/manage/")) return;
		try {
			await navigator.clipboard.writeText(recipientUrl);
			setNotice("Recipient link copied");
		} catch {
			setNotice(recipientUrl);
		}
	}
	async function revoke() {
		setPending(true);
		try {
			if ((await revokeDatingInvite({ data: { plannerToken } })).state === "error") {
				setNotice("Couldn’t revoke this invitation.");
				return;
			}
			setConfirmRevoke(false);
			await refresh();
		} finally {
			setPending(false);
		}
	}
	if (booting && !invite) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Opening your invitation…" }) });
	if (result.state === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We couldn’t open this invitation right now." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => void refresh(),
		className: "press mt-4 min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
		children: "Try again"
	})] });
	if (!invite) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This planner link is not available." }) });
	if (invite.status === "revoked") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold tracking-brand text-accent",
			children: "DATE INVITATION"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl text-cream",
			children: invite.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm font-semibold text-cream",
			children: "INVITATION CANCELLED"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-cream",
			children: "The recipient link no longer opens."
		})
	] });
	const statusLabel = invitationStatusLabel(invite.status);
	const code = `KAI-${invite.slug.slice(-4).toUpperCase()}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold tracking-brand text-accent",
			children: "DATE INVITATION"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl text-cream",
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
			className: "mt-5 text-sm text-mute",
			children: "Status"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: invite.status === "sounds_good" ? "text-sm font-semibold text-leaf" : "text-sm font-semibold text-cream",
			children: statusLabel
		}),
		invite.replyNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-cream",
			children: [
				"“",
				invite.replyNote,
				"”"
			]
		}) : null,
		invite.updatedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-xs text-mute",
			children: ["Updated ", invite.updatedAt.slice(0, 16).replace("T", " ")]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-cream",
			children: invite.message
		}),
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
					className: "mt-1 text-cream",
					children: stop.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-mute",
					children: stop.address
				})
			]
		}, `${stop.time}-${stop.title}`)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 text-xs text-mute",
			children: [
				"Date code ",
				code,
				". This is only a reference, not the private link."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: recipientUrl ? `https://wa.me/?text=${encodeURIComponent(recipientUrl)}` : void 0,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "press inline-flex min-h-11 items-center rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
					children: "Share again"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void copyRecipient(),
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
					children: "Copy recipient link"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: pending,
					onClick: () => void refresh(),
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
					children: "Refresh"
				}),
				invite.status === "alternate_time_requested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					search: {
						mode: "dating",
						code: ""
					},
					className: "press inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
					children: "Review timing"
				}) : null
			]
		}),
		notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-mute",
			children: notice
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 border-t border-line pt-4",
			children: confirmRevoke ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-cream",
				children: "Revoke this invitation? The recipient link will stop opening."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: pending,
					onClick: () => void revoke(),
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
					children: "Revoke"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setConfirmRevoke(false),
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-mute",
					children: "Cancel"
				})]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setConfirmRevoke(true),
				className: "text-sm font-semibold text-mute",
				children: "Revoke invitation"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-xs text-mute",
			children: "This page is private. Share the recipient link, not this address."
		})
	] });
}
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		"data-mode": "dating",
		className: "min-h-screen bg-ink px-4 py-16 text-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			className: "mx-auto max-w-md rounded-3xl bg-panel px-6 py-8 shadow-card",
			children
		})
	});
}
//#endregion
export { ManagePage as component };
