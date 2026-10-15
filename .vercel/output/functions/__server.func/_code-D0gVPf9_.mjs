import { o as __toESM } from "./_runtime.mjs";
import { n as TYPE_LABEL } from "./_ssr/mission-DOaVQo-M.mjs";
import { a as isoToLocal, d as suggestSupper, i as formatWhen, r as formatMoment } from "./_ssr/time-I2ZWfIie.mjs";
import { n as categoryLabel, r as isCategory, t as CATEGORIES } from "./_ssr/venues-BoGl0zhE.mjs";
import { a as PLATFORM_LABEL, c as placeSummary, s as mealFollowOn } from "./_ssr/place-Cj_BvgPc.mjs";
import { n as explainFromScores, t as cosmicProse } from "./_ssr/explain-iXlrEn1O.mjs";
import { n as scoreFingerprint, r as scoreSlots, t as pickWinner } from "./_ssr/score-CShSeQph.mjs";
import { Q as require_react, S as useRouter, Z as require_jsx_runtime, b as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "./_libs/clsx.mjs";
import { a as SlotCard, n as Frame, o as fieldClass, t as ConfettiBurst } from "./_ssr/kairos-ui-Cn9dlenL.mjs";
import { a as Sparkles, d as Copy, g as ArrowLeft, m as Check, o as Plus, u as Dices } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { b as castVote, r as Route$1, v as addComment, w as spinVenue, x as consultOracle, y as addSlot } from "./_ssr/router-TB2ea2rn.mjs";
import { a as explainKairos, i as createGoogleCalendarUrl, o as interpretCosmos, t as BoardHero } from "./_ssr/kairos.intelligence-DeDoxrIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_code-D0gVPf9_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function mergeVotes(slot, nick, optimistic) {
	const key = nick.trim().toLowerCase();
	const choice = optimistic[slot.id];
	if (!choice || !key) return slot.votes;
	return [...slot.votes.filter((vote) => vote.nickname.toLowerCase() !== key), {
		nickname: nick.trim(),
		choice
	}];
}
function MeetPage() {
	const data = Route$1.useLoaderData();
	const { code } = Route$1.useParams();
	const router = useRouter();
	const [nick, setNick] = (0, import_react.useState)("");
	const [nickReady, setNickReady] = (0, import_react.useState)(false);
	const [optimistic, setOptimistic] = (0, import_react.useState)({});
	const [pendingSlot, setPendingSlot] = (0, import_react.useState)("");
	const [burst, setBurst] = (0, import_react.useState)(0);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [oracle, setOracle] = (0, import_react.useState)(null);
	const [oracleBusy, setOracleBusy] = (0, import_react.useState)(false);
	const [vibe, setVibe] = (0, import_react.useState)(isCategory(data.category) ? data.category : "supper");
	const [spinning, setSpinning] = (0, import_react.useState)(false);
	const [extraTime, setExtraTime] = (0, import_react.useState)("");
	const [extraLabel, setExtraLabel] = (0, import_react.useState)("");
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("");
	const [noting, setNoting] = (0, import_react.useState)(false);
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [explanation, setExplanation] = (0, import_react.useState)(null);
	const [explainPending, setExplainPending] = (0, import_react.useState)(false);
	const [stale, setStale] = (0, import_react.useState)(false);
	const [cosmicText, setCosmicText] = (0, import_react.useState)("");
	const [cosmicPending, setCosmicPending] = (0, import_react.useState)(false);
	const [calendarNote, setCalendarNote] = (0, import_react.useState)("");
	const cosmicFor = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		setNick(localStorage.getItem("kairos-nick") ?? "");
		setNickReady(true);
		try {
			if (sessionStorage.getItem(`kairos-revealed-${code}`) === "1") setRevealed(true);
		} catch {}
	}, [code]);
	(0, import_react.useEffect)(() => {
		setExtraTime((current) => {
			if (current) return current;
			const anchor = data.anchorAt || data.slots[0]?.startsAt || "";
			return anchor ? isoToLocal(anchor) : suggestSupper();
		});
	}, [data.anchorAt, data.slots]);
	(0, import_react.useEffect)(() => {
		if (!nickReady) return;
		localStorage.setItem("kairos-nick", nick);
	}, [nick, nickReady]);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			if (!document.hidden) router.invalidate();
		}, 5e3);
		return () => window.clearInterval(id);
	}, [router]);
	(0, import_react.useEffect)(() => {
		setOptimistic((prev) => {
			let changed = false;
			const next = { ...prev };
			const key = nick.trim().toLowerCase();
			for (const slot of data.slots) {
				const choice = next[slot.id];
				if (!choice || !key) continue;
				if (slot.votes.some((vote) => vote.nickname.toLowerCase() === key && vote.choice === choice)) {
					delete next[slot.id];
					changed = true;
				}
			}
			return changed ? next : prev;
		});
	}, [data, nick]);
	const displaySlots = data.slots.map((slot) => ({
		...slot,
		votes: mergeVotes(slot, nick, optimistic)
	}));
	const scored = scoreSlots(displaySlots, data.title, data.kind, data.durationMin, data.mission);
	const winner = pickWinner(scored);
	const where = placeSummary(data.place);
	const follow = revealed && winner && winner.layer.total != null ? {
		...mealFollowOn(data.place, winner.slot.startsAt, data.durationMin),
		href: `/?mode=makan&code=${code}`
	} : null;
	const askedFingerprint = (0, import_react.useRef)("");
	const fingerprint = scoreFingerprint(scored);
	const localExplanation = {
		...explainFromScores(scored, data.durationMin, data.mission),
		fingerprint,
		source: "rules"
	};
	const shownExplanation = explanation?.fingerprint === fingerprint ? explanation : localExplanation;
	const oracleText = oracle?.text || data.oracleText;
	const oracleSource = oracle?.source || data.oracleSource;
	function reveal() {
		setRevealed(true);
		try {
			sessionStorage.setItem(`kairos-revealed-${code}`, "1");
		} catch {}
		if (window.innerWidth < 1024) document.getElementById("kairos-result")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}
	function requestExplanation(fp, refresh = false) {
		askedFingerprint.current = fp;
		setExplainPending(true);
		let settled = false;
		const timer = window.setTimeout(() => {
			if (settled) return;
			settled = true;
			setExplainPending(false);
			setStale(true);
		}, 22e3);
		explainKairos({ data: {
			code,
			refresh
		} }).then((result) => {
			if (settled || askedFingerprint.current !== fp) return;
			setExplanation(result);
			setStale(result.fingerprint !== fp || result.source === "rules");
		}).catch(() => {
			if (settled) return;
			setExplanation(null);
			setStale(true);
		}).finally(() => {
			settled = true;
			window.clearTimeout(timer);
			setExplainPending(false);
		});
	}
	(0, import_react.useEffect)(() => {
		if (!revealed || !winner || winner.layer.total == null) return;
		if (explanation && explanation.fingerprint !== fingerprint) {
			setStale(true);
			return;
		}
		if (explanation?.fingerprint === fingerprint) {
			setStale(explanation.source === "rules");
			return;
		}
		if (askedFingerprint.current === fingerprint) return;
		requestExplanation(fingerprint);
	}, [
		revealed,
		fingerprint,
		explanation,
		code
	]);
	function refreshExplanation() {
		requestExplanation(fingerprint, true);
	}
	function openCosmic() {
		if (!winner) return;
		const local = cosmicProse(winner.layer.reading);
		window.setTimeout(() => {
			document.getElementById("full-reading")?.scrollIntoView({
				behavior: "smooth",
				block: "nearest"
			});
		}, 40);
		if (cosmicFor.current === winner.slot.id) return;
		if (!cosmicText) setCosmicText(local);
		const slotId = winner.slot.id;
		setCosmicPending(true);
		interpretCosmos({ data: {
			code,
			slotId
		} }).then((result) => {
			setCosmicText(result.prose || local);
			cosmicFor.current = slotId;
		}).catch(() => setCosmicText(local)).finally(() => setCosmicPending(false));
	}
	async function copyText(text, ok) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(ok);
		} catch {
			toast.error("Could not copy. The code is on screen.");
		}
	}
	function shareMoment() {
		if (!winner || winner.layer.total == null) return;
		const when = winner.slot.label || formatMoment(winner.slot.startsAt);
		copyText([
			data.title,
			`Kairos pick: ${when}`,
			`Kairos Score: ${winner.layer.total} / 100`,
			`People ${winner.layer.people.points}/40 · Moment ${winner.layer.moment}/30 · Cosmos ${winner.layer.cosmicFit}/30`,
			`${window.location.origin}/meet/${code}`
		].join("\n"), "Moment copied");
	}
	function copyResult() {
		if (!winner || winner.layer.total == null) return;
		const when = winner.slot.label || formatMoment(winner.slot.startsAt);
		const lines = scored.map((item) => {
			return `${item.slot.label || formatMoment(item.slot.startsAt)}: ${item.layer.total == null ? "waiting" : `${item.layer.total}`} · people ${item.layer.people.waiting ? "—" : item.layer.people.points} · moment ${item.layer.moment} · cosmos ${item.layer.cosmicFit}`;
		});
		copyText([
			`${data.title}`,
			`Kairos pick: ${when} · ${winner.layer.total} / 100`,
			...lines
		].join("\n"), "Result copied");
	}
	function downloadInvite() {
		if (!winner || winner.layer.total == null) return;
		const start = new Date(winner.slot.startsAt);
		const end = new Date(start.getTime() + data.durationMin * 6e4);
		const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
		const when = winner.slot.label || formatMoment(winner.slot.startsAt);
		const description = `Kairos Score ${winner.layer.total} / 100. People ${winner.layer.people.points}/40, moment ${winner.layer.moment}/30, cosmos ${winner.layer.cosmicFit}/30. ${when}.`;
		const ics = [
			"BEGIN:VCALENDAR",
			"VERSION:2.0",
			"PRODID:-//Kairos//EN",
			"BEGIN:VEVENT",
			`DTSTART:${stamp(start)}`,
			`DTEND:${stamp(end)}`,
			`SUMMARY:${data.title.replace(/[\n,;]/g, " ")}`,
			`LOCATION:${placeSummary(data.place).replace(/[\n,;]/g, " ")}`,
			data.place.meetingUrl ? `URL:${data.place.meetingUrl}` : "",
			`DESCRIPTION:${description.replace(/[\n,;]/g, " ")}`,
			"END:VEVENT",
			"END:VCALENDAR"
		].filter(Boolean).join("\r\n");
		const blob = new Blob([ics], { type: "text/calendar" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "kairos.ics";
		link.click();
		window.setTimeout(() => URL.revokeObjectURL(url), 1500);
	}
	function openGoogleCalendar() {
		if (!winner || winner.layer.total == null) return;
		const platform = data.place.platform === "teams" ? "Microsoft Teams" : data.place.platform === "zoom" ? "Zoom" : data.place.platform === "skype" ? "Skype" : data.place.platform === "meet" ? "Google Meet" : data.place.platform === "webex" ? "Webex" : data.place.meetingUrl ? "Online" : "";
		const people = winner.layer.people;
		const url = createGoogleCalendarUrl({
			title: data.title,
			startTime: winner.slot.startsAt,
			durationMinutes: data.durationMin,
			timezone: "Asia/Singapore",
			meetingFormat: data.place.format,
			venueName: data.place.venueName,
			room: data.place.room,
			address: data.place.address,
			onlinePlatform: platform,
			onlineUrl: data.place.meetingUrl,
			kairosScore: winner.layer.total,
			kairosStatus: winner.layer.mark,
			participantCount: people.waiting ? void 0 : people.roster,
			canAttend: people.waiting ? void 0 : people.able,
			preferredCount: people.waiting ? void 0 : people.love,
			purpose: data.mission?.summary ?? ""
		});
		const opened = window.open(url, "_blank", "noopener,noreferrer");
		setCalendarNote(opened ? "Review and save the event in Google Calendar." : "Allow pop-ups, then try Add to Google Calendar again.");
	}
	async function copyLink() {
		const url = `${window.location.origin}/meet/${code}`;
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			toast.success("Link copied");
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			toast.error("Could not copy. The code is on screen.");
		}
	}
	async function vote(slotId, choice) {
		const name = nick.trim();
		if (!name) {
			toast.error("Add a nickname. The cosmos does not take blank ballots.");
			document.getElementById("nickname")?.focus();
			return;
		}
		setOptimistic((prev) => ({
			...prev,
			[slotId]: choice
		}));
		setPendingSlot(slotId);
		try {
			await castVote({ data: {
				code,
				slotId,
				nickname: name,
				choice
			} });
			if (choice === "love" || choice === "yes") setBurst((value) => value + 1);
			await router.invalidate();
		} catch (err) {
			setOptimistic((prev) => {
				const next = { ...prev };
				delete next[slotId];
				return next;
			});
			toast.error(err instanceof Error ? err.message : "That vote did not land");
		} finally {
			setPendingSlot("");
		}
	}
	async function askOracle() {
		setOracleBusy(true);
		try {
			const result = await consultOracle({ data: { code } });
			setOracle(result);
			await router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "The oracle is quiet");
		} finally {
			setOracleBusy(false);
		}
	}
	async function spin() {
		setSpinning(true);
		try {
			const result = await spinVenue({ data: {
				code,
				category: vibe,
				startsAt: extraTime || void 0
			} });
			toast.success(result.source === "grok" ? `${result.name} — Kairos checked the name` : `${result.name} — from the house list`);
			await router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "The wheel stuck");
		} finally {
			setSpinning(false);
		}
	}
	async function onAdd(event) {
		event.preventDefault();
		if (!extraTime) {
			toast.error("Pick a time");
			return;
		}
		setAdding(true);
		try {
			await addSlot({ data: {
				code,
				startsAt: extraTime,
				label: extraLabel.trim() || void 0
			} });
			setExtraLabel("");
			await router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not add that");
		} finally {
			setAdding(false);
		}
	}
	async function onNote(event) {
		event.preventDefault();
		const name = nick.trim();
		const body = note.trim();
		if (!name) {
			toast.error("Sign the slip with a nickname.");
			document.getElementById("nickname")?.focus();
			return;
		}
		if (!body) return;
		setNoting(true);
		try {
			await addComment({ data: {
				code,
				nickname: name,
				body
			} });
			setNote("");
			await router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "The slip did not stick");
		} finally {
			setNoting(false);
		}
	}
	const mineFor = (slot) => {
		const key = nick.trim().toLowerCase();
		if (!key) return void 0;
		return slot.votes.find((vote) => vote.nickname.toLowerCase() === key)?.choice;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfettiBurst, { burst }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-20 border-b border-line bg-ink",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						search: {
							mode: "meet",
							code: ""
						},
						className: "press grid size-11 place-items-center rounded-xl ring-1 ring-line",
						"aria-label": "Home",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex gap-3 text-sm",
						"aria-label": "Kairos",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								search: {
									mode: "meet",
									code: ""
								},
								className: "font-semibold text-cream",
								children: "Meet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/makan",
								search: { code },
								className: "text-mute",
								children: "Makan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/out",
								className: "text-mute",
								children: "Team Out"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tracking-brand",
								children: data.kind === "makan" ? "MAKAN" : "MEETING"
							}), data.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium text-mute",
								children: [" · ", categoryLabel(data.category)]
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate font-display text-xl",
							children: data.title
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm tracking-widest text-gold",
						children: code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void copyLink(),
						className: "press inline-flex h-11 items-center gap-2 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-4",
							"aria-hidden": true
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
							className: "size-4",
							"aria-hidden": true
						}), copied ? "Copied" : "Copy link"]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl items-start gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "votes",
				className: "order-2 min-w-0 space-y-4 lg:order-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-panel p-4 ring-1 ring-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "nickname",
								className: "text-sm font-medium text-cream",
								children: "Your nickname"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "nickname",
								value: nick,
								onChange: (event) => setNick(event.target.value),
								maxLength: 24,
								autoComplete: "nickname",
								placeholder: "Mei, not mei@company.com",
								className: clsx(fieldClass, "mt-2")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-mute",
								children: [
									"No login. No calendar. ",
									data.durationMin,
									" min",
									data.anchorAt ? ` · gather ${formatWhen(data.anchorAt)}` : "",
									". One face per time. Names are not accounts."
								]
							}),
							where || data.place.meetingUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 border-t border-line pt-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold tracking-brand text-gold",
										children: data.place.format === "online" ? "ONLINE" : data.place.format === "hybrid" ? "HYBRID" : "PHYSICAL"
									}),
									where ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-cream",
										children: where
									}) : null,
									data.place.meetingUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: data.place.meetingUrl,
										target: "_blank",
										rel: "noreferrer",
										className: "mt-1 inline-flex text-sm font-semibold text-gold",
										children: ["Join ", PLATFORM_LABEL[data.place.platform]]
									}) : null
								]
							}) : null
						]
					}),
					displaySlots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-panel px-4 py-10 text-center shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "No options on the table"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-mute",
							children: "Spin a venue or add a time. Then the ballots open."
						})]
					}) : displaySlots.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotCard, {
						slot,
						durationMin: data.durationMin,
						leading: revealed && winner?.slot.id === slot.id,
						mine: mineFor(slot),
						pending: pendingSlot === slot.id,
						onVote: (choice) => void vote(slot.id, choice)
					}, slot.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl bg-panel p-4 shadow-card sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Slips"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (event) => void onNote(event),
								className: "mt-3 flex flex-col gap-2 sm:flex-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "sr-only",
										htmlFor: "slip",
										children: "Short note"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "slip",
										value: note,
										onChange: (event) => setNote(event.target.value),
										maxLength: 180,
										placeholder: "Running ten minutes late",
										className: fieldClass
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: noting,
										className: "press h-12 shrink-0 rounded-xl bg-ink px-4 font-semibold text-cream ring-1 ring-line disabled:opacity-50",
										children: "Leave a slip"
									})
								]
							}),
							data.comments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-mute",
								children: "No slips yet. One line beats a twelve-message thread."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-3",
								children: data.comments.map((comment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "border-t border-line pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-cream",
										children: comment.body
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-mute",
										children: [
											comment.nickname,
											" · ",
											formatWhen(comment.createdAt)
										]
									})]
								}, comment.id))
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "order-1 space-y-4 lg:sticky lg:top-20 lg:order-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardHero, {
						scored,
						durationMin: data.durationMin,
						revealed,
						onReveal: reveal,
						onShare: shareMoment,
						onCopy: copyResult,
						onFull: openCosmic,
						onInvite: downloadInvite,
						pending: false,
						explanation: revealed ? shownExplanation : null,
						explainPending,
						stale,
						onRefreshExplanation: refreshExplanation,
						cosmicText,
						cosmicPending,
						missionLabel: data.mission ? `${TYPE_LABEL[data.mission.meeting_type]} · ${data.mission.stakes} stakes` : "",
						missionSummary: data.mission?.summary ?? "",
						where,
						followOn: follow,
						onGoogleCalendar: openGoogleCalendar,
						googleNote: calendarNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl bg-panel p-4 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "size-4 text-gold",
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl",
									children: "Oracle"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-mute",
								children: "Two sentences. The title, the votes, and a Singaporean shrug."
							}),
							oracleText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "fortune-slip mt-3 rounded-xl px-4 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-base leading-snug",
									children: oracleText
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs",
									children: oracleSource === "grok" ? "Read by Kairos" : "Local tong shu — Kairos was offline"
								})]
							}, oracleText) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void askOracle(),
								disabled: oracleBusy,
								className: "press mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-cream ring-1 ring-line disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "size-4",
									"aria-hidden": true
								}), oracleBusy ? "Consulting…" : oracleText ? "Ask again" : "Consult the oracle"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl bg-panel p-4 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, {
									className: "size-4 text-jade",
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl",
									children: "Makan roulette"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-mute",
								children: data.kind === "makan" ? "Spin a Singapore spot onto the board." : "After the meeting: spin a supper, a court, or a drink."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": vibe === item.id,
									onClick: () => setVibe(item.id),
									className: clsx("press min-h-10 rounded-xl px-2.5 text-left text-xs font-semibold", vibe === item.id ? "bg-jade text-ink" : "bg-ink text-cream ring-1 ring-line"),
									children: item.label
								}, item.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void spin(),
								disabled: spinning,
								className: "press mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-jade font-semibold text-ink disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, {
									className: "size-4",
									"aria-hidden": true
								}), spinning ? "Spinning…" : "Spin the roulette"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (event) => void onAdd(event),
						className: "rounded-2xl bg-panel p-4 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Add an option"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-3 block text-sm text-mute",
								htmlFor: "extra-label",
								children: "Place, optional"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "extra-label",
								value: extraLabel,
								onChange: (event) => setExtraLabel(event.target.value),
								maxLength: 80,
								placeholder: "Swee Choon",
								className: clsx(fieldClass, "mt-1")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-3 block text-sm text-mute",
								htmlFor: "extra-time",
								children: "Time, Singapore"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "extra-time",
								type: "datetime-local",
								value: extraTime,
								onChange: (event) => setExtraTime(event.target.value),
								className: clsx(fieldClass, "mt-1")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: adding,
								className: "press mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-cream ring-1 ring-line disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-4",
									"aria-hidden": true
								}), adding ? "Adding…" : "Add to the board"]
							})
						]
					})
				]
			})]
		})
	] });
}
//#endregion
export { MeetPage as component };
