import { o as __toESM } from "../_runtime.mjs";
import { a as literal, c as record, d as union, i as discriminatedUnion, l as string, n as array, o as number, r as boolean, s as object, t as _enum, u as tuple } from "../_libs/zod.mjs";
import { a as missionSchema, i as inferMission, n as TYPE_LABEL$1, t as MEETING_TYPES } from "./mission-DOaVQo-M.mjs";
import { l as sgtNow, o as localSgtToIso, t as addCalendarDays, u as suggestMeetingSlots } from "./time-I2ZWfIie.mjs";
import { a as readReading, r as markOf } from "./reading-Dc18t2Vi.mjs";
import { c as placeSummary, o as cleanMeetingUrl, s as mealFollowOn } from "./place-Cj_BvgPc.mjs";
import { Q as require_react, Z as require_jsx_runtime, b as Link, n as require_react_dom, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { i as Seal, n as Frame, o as fieldClass } from "./kairos-ui-Cn9dlenL.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { C as withShareUrl, S as saveDatingPlanId, _ as readConfirmedDating, a as dressLabel, b as rememberDatingReply, c as generateInviteSlug, d as inviteUrlIsLocal, f as onlyRecipientShare, g as publicInviteUrl, h as publicArea, i as draftInvitation, l as invitationStatusLabel, m as plannerInviteUrl, o as durationLabel, r as buildShareMessage, s as ensureInviteSlug, t as INVITE_SLUG, u as inviteFooter, v as readDatingInviteLink, x as saveDatingInviteLink, y as readDatingPlanId } from "./dating-invite-DIfg4EzO.mjs";
import { a as rememberSeenPlaces, i as readSeenPlaces, n as DATE_TYPES, r as DATE_VIBES, t as DATE_FOODS } from "./dating-DQG0N1wV.mjs";
import { a as Sparkles, c as MapPin, i as Sun, l as Flame, m as Check, o as Plus, p as Clock, r as Target, s as Minus, u as Dices } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as fetchEvent, S as createEvent, T as createSsrRpc, _ as saveDatingPlan, a as Route$5, c as KAIROS_WORK, h as polishDatingInvite, m as planDate, o as KAIROS_LIFE, p as parseDateBrief, s as KAIROS_TODAY, u as createDatingInvite } from "./router-TB2ea2rn.mjs";
import { t as KairosVoice } from "./kairos-voice-nMPgfjeS.mjs";
import { i as createGoogleCalendarUrl, n as InviteStage, r as analyzeMission, s as saveMission } from "./kairos.intelligence-DeDoxrIH.mjs";
import { t as loadPlannerInvite } from "./dating-planner-read-BhfJwk7W.mjs";
import { C as sortMakanHits, S as resultBlurb, _ as originFromArea, b as placeKindLabel, c as buildConcepts, d as distanceMeters, g as matchArea, i as PLACE_TYPES, n as CUISINE_OPTIONS, r as MORE_CUISINES, t as AREAS, u as cuisineLabel, w as spinOne, x as priceLabel, y as parseOuting } from "./coord-Cq5LMP_P.mjs";
import { n as supabaseConfigured, t as getSupabase } from "./supabase-BKxuSUOP.mjs";
import { a as reconcileControls, n as budgetLabel, r as intentChips } from "./dating-intent-C7K9jveX.mjs";
import { t as FAMILY_INTERESTS } from "./family-DnghGkQV.mjs";
import { t as clockLabel } from "./family-day-CMmGyjLO.mjs";
import { t as HASH_STARTERS } from "./hash-lgZwuMrP.mjs";
import { l as plannedSteps, n as ORACLE_HOW, o as dailyKey, s as oracleAvailability, t as ORACLE_FRAMING } from "./oracle-cache-tWnckiID.mjs";
import { a as explicitChildAges, c as parseChildAges, d as selectTravelDestination, l as planningDestinations, n as TRAVEL_STYLES, o as hasYoungChild, r as addDays, s as itemsFromTravel, t as TRAVEL_INTERESTS } from "./travel-tYjUPdjH.mjs";
import { a as teamChips, o as travelChips, t as familyChips } from "./planning-brief--f7cMx2Y.mjs";
import { a as freeWindows, c as itemsFromFamily, d as located, h as travelPairs, i as findConflicts, l as itemsFromMeets, m as replanDay, n as confirmedInviteItem, o as itemsForDate, p as repeatLabel, r as dayAside, s as itemsFromDating, t as activeItems, u as leaveBy } from "./today-F8WbxiwB.mjs";
import { c as photoCredit, o as isPermittedPhotoUrl } from "./travel-photo-CU-qA7uW.mjs";
import { $ as normalizeTravelParty, A as estimateMinutes, At as unscheduleStop, B as inferCountry, D as durationPhrase, E as displayClock, F as handoffChoices, J as matchBookedHotel, K as localSubtitle, L as hotelOptimizerEnabled, M as experienceBalance, Mt as verifiedWebsite, N as externalPlaceLinks, Ot as toggleKeptHotel, Pt as writeNavPreference, R as hoursLine, St as setHotelPreferences, T as discoverSections, Tt as suggestOrder, U as keepLockedDays, W as likeHotel, X as navLabel, Y as moveStop, Z as navigationHref, _t as savePlace, b as cleanTheme, bt as selectLegMode, c as applyBookedHotel, ct as readNavPreference, d as applySuggestedOrder, dt as recommendStayAreas, et as notableOmissions, ft as rejectHotel, gt as routeLabel, h as budgetText, ht as retimeDay, i as TRAVEL_MAP_STYLE, it as placeMatches, j as excludePlace, jt as usefulLegReason, l as applyPlacePhoto, lt as readableName, m as bestDayFor, n as EXPERIENCE_LABEL, nt as pinKey, p as automaticNav, pt as rerollHotels, r as TRAVEL_MAP_CREDIT, rt as placeCopy, s as appendStops, st as presetPreferences, t as DEFAULT_HOTEL_PREFERENCES, u as applyRoute, ut as rebalanceTrip, vt as scheduleStop, w as detectPlatform, wt as stayNearPoints, x as dayStops, yt as selectBase } from "./hotel-bases-bpQ2rCBh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DB4rXmre.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var AFFILIATE_DISCLOSURE = "Some booking links are affiliate links. Kairos may earn a commission at no additional cost to you.";
var RATE_NOTE = "The booking site shows the current price. Kairos has not compared rates.";
var EMPTY_SLOT = {
	enabled: false,
	id: "",
	template: ""
};
function disabledAffiliateSettings() {
	return {
		trip: { ...EMPTY_SLOT },
		agoda: { ...EMPTY_SLOT },
		booking: { ...EMPTY_SLOT },
		klook: { ...EMPTY_SLOT },
		tripExperience: { ...EMPTY_SLOT },
		reserve: { ...EMPTY_SLOT },
		order: { ...EMPTY_SLOT },
		quote: { ...EMPTY_SLOT },
		transport: { ...EMPTY_SLOT },
		esim: { ...EMPTY_SLOT },
		car: { ...EMPTY_SLOT }
	};
}
var SLOTS = [
	{
		key: "trip",
		env: "TRIP",
		name: "Trip.com",
		category: "HOTEL",
		plain: true
	},
	{
		key: "agoda",
		env: "AGODA",
		name: "Agoda",
		category: "HOTEL",
		plain: true
	},
	{
		key: "booking",
		env: "BOOKING",
		name: "Booking.com",
		category: "HOTEL",
		plain: true
	},
	{
		key: "klook",
		env: "KLOOK",
		name: "Klook",
		category: "ACTIVITY",
		plain: false
	},
	{
		key: "tripExperience",
		env: "TRIP_EXPERIENCE",
		name: "Trip.com",
		category: "ATTRACTION",
		plain: false
	},
	{
		key: "reserve",
		env: "RESERVE",
		name: "Reserve",
		category: "RESTAURANT",
		plain: false
	},
	{
		key: "order",
		env: "ORDER",
		name: "Order",
		category: "FOOD_DELIVERY",
		plain: false
	},
	{
		key: "quote",
		env: "QUOTE",
		name: "Request quote",
		category: "TEAM_ACTIVITY",
		plain: false
	},
	{
		key: "transport",
		env: "TRANSPORT",
		name: "Transport",
		category: "TRANSPORT",
		plain: false
	},
	{
		key: "esim",
		env: "ESIM",
		name: "eSIM",
		category: "ESIM",
		plain: false
	},
	{
		key: "car",
		env: "CAR",
		name: "Car rental",
		category: "CAR_RENTAL",
		plain: false
	}
];
var PLACEHOLDERS = [
	"id",
	"query",
	"name",
	"city",
	"country",
	"checkin",
	"checkout",
	"adults",
	"lat",
	"lng",
	"itemId"
];
function clean$1(value) {
	return (value ?? "").replace(/\s+/g, " ").trim();
}
function publicEnv(key) {
	try {
		const value = {
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/",
			"VITE_AUTH_ENABLED": "false",
			"VITE_DEV_SERVER_HOST": "0.0.0.0",
			"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZm16bmJnbnlodW1nd3dlc3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NDA0NTQsImV4cCI6MjEwNjUxNjQ1NH0.BdJnQY2gDTOm9vn9DeeTMH4KtPLbwPSQpWEUO_NK54I",
			"VITE_SUPABASE_URL": "https://eafmznbgnyhumgwweszt.supabase.co"
		}[key];
		return typeof value === "string" ? value.trim() : "";
	} catch {
		return "";
	}
}
function readRaw(envName, env) {
	if (env) return clean$1(env[envName] ?? env[`VITE_${envName}`]);
	return (typeof process !== "undefined" && process.env ? clean$1(process.env[envName]) : "") || publicEnv(`VITE_${envName}`);
}
function slotFromEnv(prefix, env) {
	const enabled = /^(1|true|on|yes)$/i.test(readRaw(`${prefix}_ENABLED`, env));
	const id = readRaw(`${prefix}_ID`, env);
	const template = readRaw(`${prefix}_TEMPLATE`, env);
	return enabled && /^[A-Za-z0-9_-]{1,64}$/.test(id) && template.includes("{id}") && template.startsWith("https://") ? {
		enabled: true,
		id,
		template
	} : {
		enabled: false,
		id: "",
		template: ""
	};
}
function readAffiliateConfig(env) {
	const settings = disabledAffiliateSettings();
	for (const slot of SLOTS) settings[slot.key] = slotFromEnv(`AFFILIATE_${slot.env}`, env);
	return settings;
}
function iso(value) {
	return /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") ? value ?? "" : "";
}
function searchText(item, context) {
	return [
		item.name,
		item.city,
		context.destination
	].map(clean$1).filter(Boolean).filter((part, index, all) => all.findIndex((other) => other.toLowerCase() === part.toLowerCase()) === index).join(" ").slice(0, 120);
}
function fillTemplate(template, values) {
	if (!template.startsWith("https://") || template.length > 500 || !template.includes("{id}")) return "";
	if (/\{(?!id\}|query\}|name\}|city\}|country\}|checkin\}|checkout\}|adults\}|lat\}|lng\}|itemId\})/.test(template)) return "";
	let url = template;
	for (const key of PLACEHOLDERS) url = url.split(`{${key}}`).join(encodeURIComponent(values[key] ?? ""));
	if (url.includes("{") || url.includes("}")) return "";
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:" || parsed.username || parsed.password) return "";
		return parsed.toString();
	} catch {
		return "";
	}
}
function valuesFor(item, context, id) {
	const adults = context.adults && context.adults > 0 && context.adults < 30 ? String(Math.round(context.adults)) : "";
	return {
		id,
		query: searchText(item, context),
		name: clean$1(item.name).slice(0, 80),
		city: clean$1(item.city).slice(0, 60),
		country: clean$1(item.country).slice(0, 40),
		checkin: iso(context.checkIn),
		checkout: iso(context.checkOut),
		adults,
		lat: Number.isFinite(item.lat) ? String(item.lat) : "",
		lng: Number.isFinite(item.lng) ? String(item.lng) : "",
		itemId: clean$1(item.id).slice(0, 80)
	};
}
function childAges(context) {
	return (context.childAges ?? []).filter((age) => age >= 0 && age <= 17).slice(0, 6);
}
function plainHotelUrl(provider, item, context) {
	const query = searchText(item, context);
	if (query.length < 3) return "";
	const checkIn = iso(context.checkIn);
	const checkOut = iso(context.checkOut);
	const ages = childAges(context);
	if (provider === "trip") {
		const url = new URL("https://www.trip.com/hotels/list");
		url.searchParams.set("keyword", query);
		return url.toString();
	}
	if (provider === "agoda") {
		const url = new URL("https://www.agoda.com/search");
		url.searchParams.set("q", query);
		if (checkIn) url.searchParams.set("checkIn", checkIn);
		if (checkOut) url.searchParams.set("checkOut", checkOut);
		url.searchParams.set("rooms", "1");
		if (context.adults && context.adults > 0 && context.adults < 30) url.searchParams.set("adults", String(Math.round(context.adults)));
		if (ages.length) url.searchParams.set("children", String(ages.length));
		return url.toString();
	}
	const url = new URL("https://www.booking.com/searchresults.html");
	url.searchParams.set("ss", query);
	if (checkIn) url.searchParams.set("checkin", checkIn);
	if (checkOut) url.searchParams.set("checkout", checkOut);
	if (context.adults && context.adults > 0 && context.adults < 30) url.searchParams.set("group_adults", String(Math.round(context.adults)));
	if (ages.length) {
		url.searchParams.set("group_children", String(ages.length));
		for (const age of ages) url.searchParams.append("age", String(age));
	}
	url.searchParams.set("no_rooms", "1");
	return url.toString();
}
function hotelLabel(name) {
	return `Check ${name}`;
}
function experienceLabel(category, name) {
	if (category === "ATTRACTION") return `Check tickets · ${name}`;
	if (category === "ACTIVITY") return `Book experience · ${name}`;
	if (category === "RESTAURANT") return "Reserve";
	if (category === "FOOD_DELIVERY") return "Order";
	if (category === "TEAM_ACTIVITY") return "Request quote";
	return name;
}
function actionType(category) {
	if (category === "HOTEL") return "BOOK_HOTEL";
	if (category === "ATTRACTION") return "BUY_TICKET";
	if (category === "ACTIVITY") return "BOOK_ACTIVITY";
	if (category === "RESTAURANT") return "RESERVE_RESTAURANT";
	if (category === "FOOD_DELIVERY") return "ORDER_FOOD";
	if (category === "TEAM_ACTIVITY") return "REQUEST_QUOTE";
	if (category === "TRANSPORT") return "BOOK_TRANSPORT";
	if (category === "ESIM") return "BUY_ESIM";
	if (category === "CAR_RENTAL") return "RENT_CAR";
	return null;
}
function matches(slotCategory, asked) {
	if (slotCategory === asked) return true;
	if (asked === "ATTRACTION" && (slotCategory === "ACTIVITY" || slotCategory === "ATTRACTION")) return true;
	if (asked === "ACTIVITY" && (slotCategory === "ACTIVITY" || slotCategory === "ATTRACTION")) return true;
	return false;
}
function resolveCommerceActions(item, context, settings = readAffiliateConfig()) {
	if (searchText(item, context).length < 3) return [];
	const actions = [];
	for (const slot of SLOTS) {
		if (!matches(slot.category, item.category)) continue;
		const type = actionType(item.category);
		if (!type) continue;
		const configured = settings[slot.key];
		const affiliateUrl = configured.enabled ? fillTemplate(configured.template, valuesFor(item, context, configured.id)) : "";
		const plain = !affiliateUrl && slot.plain && slot.category === "HOTEL" && (slot.key === "trip" || slot.key === "booking" || slot.key === "agoda") ? plainHotelUrl(slot.key, item, context) : "";
		const url = affiliateUrl || plain;
		if (!url) continue;
		const affiliate = Boolean(affiliateUrl);
		actions.push({
			id: `commerce-${slot.key}`,
			type,
			provider: slot.key === "trip" || slot.key === "tripExperience" ? "trip.com" : slot.key === "booking" ? "booking.com" : slot.key,
			label: slot.category === "HOTEL" ? hotelLabel(slot.name) : experienceLabel(item.category, slot.name),
			url,
			webUrl: url,
			placeId: item.id,
			source: affiliate ? "affiliate" : "public-search",
			affiliateEligible: affiliate,
			disclosureRequired: true,
			disclosure: affiliate ? AFFILIATE_DISCLOSURE : slot.category === "HOTEL" ? RATE_NOTE : ""
		});
	}
	return actions;
}
var clicks = [];
/** Records the outbound click only. Nothing after the user leaves Kairos. */
function recordAffiliateClick(action, mode, category) {
	if (action.source !== "affiliate") return;
	clicks.push({
		event: "affiliate_click",
		provider: action.provider,
		category,
		itemId: action.placeId ?? "",
		mode,
		at: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (clicks.length > 40) clicks.shift();
}
var STAKES = [
	"low",
	"medium",
	"high"
];
var LEANS = [
	"positive",
	"neutral",
	"negative"
];
function MissionRead({ title, reading, editing, pending, onRead, onEdit, onCloseEdit, onChange, onUseDuration }) {
	const ready = title.trim().length >= 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onRead,
			disabled: !ready || pending,
			className: "press min-h-11 text-sm font-semibold text-gold disabled:opacity-40",
			children: pending ? "Kairos is reading the room..." : reading ? "Read the room again" : "Read the room"
		}), reading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 rounded-xl bg-ink p-3 ring-1 ring-line",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-gold",
					children: "KAIROS UNDERSTANDS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-mute",
					children: ["You said: ", title.trim()]
				}),
				editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-cream",
							children: ["Type", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line",
								value: reading.meeting_type,
								onChange: (event) => onChange({
									...reading,
									meeting_type: event.target.value
								}),
								children: MEETING_TYPES.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: type,
									children: TYPE_LABEL$1[type]
								}, type))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-cream",
							children: ["Stakes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line",
								value: reading.stakes,
								onChange: (event) => onChange({
									...reading,
									stakes: event.target.value
								}),
								children: STAKES.map((stakes) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: stakes,
									children: stakes
								}, stakes))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-cream",
							children: ["Goal", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: reading.meeting_goal,
								maxLength: 140,
								onChange: (event) => onChange({
									...reading,
									meeting_goal: event.target.value
								}),
								className: "mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-cream",
							children: ["Tone", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: reading.tone,
								maxLength: 40,
								onChange: (event) => onChange({
									...reading,
									tone: event.target.value
								}),
								className: "mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-cream",
							children: ["Practical conditions, one per line", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: reading.preferred_conditions.join("\n"),
								maxLength: 240,
								rows: 3,
								onChange: (event) => onChange({
									...reading,
									preferred_conditions: event.target.value.split("\n").slice(0, 4).map((line) => line.slice(0, 80))
								}),
								className: "mt-1 w-full rounded-xl bg-panel px-3 py-2 text-cream ring-1 ring-line"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-cream",
							children: ["Summary", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: reading.summary,
								maxLength: 220,
								rows: 3,
								onChange: (event) => onChange({
									...reading,
									summary: event.target.value
								}),
								className: "mt-1 w-full rounded-xl bg-panel px-3 py-2 text-cream ring-1 ring-line"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2",
							children: [
								"morning",
								"afternoon",
								"late_day"
							].map((band) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-mute",
								children: [band === "late_day" ? "Late day" : band, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "mt-1 h-11 w-full rounded-xl bg-panel px-2 text-sm text-cream ring-1 ring-line",
									value: reading.time_preferences[band],
									onChange: (event) => onChange({
										...reading,
										time_preferences: {
											...reading.time_preferences,
											[band]: event.target.value
										}
									}),
									children: LEANS.map((lean) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: lean,
										children: lean
									}, lean))
								})]
							}, band))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onCloseEdit,
							className: "press min-h-11 text-sm font-semibold text-cream",
							children: "Looks right"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm text-cream",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
										className: "size-4 text-gold",
										"aria-hidden": true
									}),
									TYPE_LABEL$1[reading.meeting_type],
									" · ",
									reading.tone
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
									className: clsx("size-4", reading.stakes === "high" ? "text-vermilion" : "text-gold"),
									"aria-hidden": true
								}), reading.stakes === "high" ? "High stakes" : reading.stakes === "medium" ? "Medium stakes" : "Low stakes"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
										className: "size-4 text-cream",
										"aria-hidden": true
									}),
									"Recommend ",
									reading.suggested_duration_minutes,
									" min"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
									className: "size-4 text-gold",
									"aria-hidden": true
								}), reading.preferred_conditions[0] ?? "A workable hour"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
						mode: "meet",
						text: reading.summary,
						status: reading.stakes === "high" ? "warning" : "neutral"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-x-4 gap-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onCloseEdit,
								className: "press min-h-11 text-sm font-semibold text-cream",
								children: "Looks right"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onEdit,
								className: "press min-h-11 text-sm font-semibold text-gold",
								children: "Edit"
							}),
							reading.suggested_duration_minutes !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onUseDuration(reading.suggested_duration_minutes),
								className: "press min-h-11 text-sm font-semibold text-mute",
								children: [
									"Use ",
									reading.suggested_duration_minutes,
									" min"
								]
							}) : null
						]
					})
				] })
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs text-mute",
			children: "A first reading from the words you used. Read the room if you want Kairos to refine it. The score still comes from the rules."
		})]
	});
}
function parse(schema, input) {
	const result = schema.safeParse(input);
	if (!result.success) throw new Error(result.error.issues[0]?.message ?? "Check that and try again");
	return result.data;
}
var codeSchema = string().trim().regex(/^[a-zA-Z0-9]{4,12}$/, "That code does not look right").transform((value) => value.toLowerCase());
var participantSchema = string().trim().regex(/^[a-zA-Z0-9]{16,64}$/, "Join again from this phone");
var hostSchema = union([string().trim().regex(/^[a-zA-Z0-9]{20,80}$/), literal("")]).optional().default("");
var HostCommand = discriminatedUnion("action", [
	object({ action: literal("pause") }),
	object({ action: literal("resume") }),
	object({ action: literal("reveal") }),
	object({ action: literal("end") }),
	object({
		action: literal("voting"),
		open: boolean(),
		voteLimit: union([literal(1), literal(3)]).optional()
	}),
	object({
		action: literal("live"),
		show: boolean()
	}),
	object({
		action: literal("cosmic"),
		enabled: boolean()
	}),
	object({
		action: literal("rename"),
		clusterId: string().min(4).max(40),
		title: string().trim().min(1).max(60)
	}),
	object({
		action: literal("merge"),
		intoId: string().min(4).max(40),
		fromId: string().min(4).max(40)
	}),
	object({
		action: literal("split"),
		clusterId: string().min(4).max(40),
		submissionId: string().min(4).max(40)
	}),
	object({
		action: literal("move"),
		submissionId: string().min(4).max(40),
		clusterId: string().min(4).max(40)
	}),
	object({
		action: literal("pin"),
		clusterId: string().min(4).max(40),
		pinned: boolean()
	}),
	object({
		action: literal("hide"),
		submissionId: string().min(4).max(40),
		hidden: boolean()
	}),
	object({
		action: literal("mark"),
		clusterId: string().min(4).max(40),
		kind: _enum([
			"",
			"action",
			"park",
			"discuss",
			"decide"
		]),
		note: string().max(160).optional()
	}),
	object({ action: literal("lucky") })
]);
var resolveJoinCode = createServerFn({ method: "GET" }).validator((input) => parse(object({ code: codeSchema }), input)).handler(createSsrRpc("03bc041f2ee67c0432269c28716e44d2c143fee99e2b694cd9ee61e79cc07de8"));
var createHashSession = createServerFn({ method: "POST" }).validator((input) => parse(object({
	prompt: string().trim().min(2, "Ask a question").max(200),
	context: string().trim().max(500).optional().default(""),
	starter: string().trim().max(24).optional().default("custom"),
	identityMode: _enum([
		"anonymous",
		"named",
		"choice"
	]),
	showLiveBoard: boolean(),
	blindRound: boolean(),
	voteLimit: union([literal(1), literal(3)]),
	cosmicEnabled: boolean()
}), input)).handler(createSsrRpc("c7a363c677c079bcc1706cdf2eeebf0e753272f5c81b3063e5903b83058171b8"));
var fetchHashRoom = createServerFn({ method: "GET" }).validator((input) => parse(object({
	code: codeSchema,
	participantToken: participantSchema.or(literal("")),
	hostToken: hostSchema
}), input)).handler(createSsrRpc("f5e308501adf8aaf95bf49d7a229376b9fe2b33087f96c7caee414c580fc11df"));
var throwHashIdea = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	participantToken: participantSchema,
	hostToken: hostSchema,
	text: string().trim().min(2, "Throw in a few words").max(240),
	anonymous: boolean(),
	displayName: string().trim().max(24).optional().default("")
}), input)).handler(createSsrRpc("48321ba401c04a761624b2959415d4b07d236d0e5e284208967502bce6bda806"));
var supportHashTheme = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	participantToken: participantSchema,
	clusterId: string().min(4).max(40)
}), input)).handler(createSsrRpc("ac8f6a1e42683712ab8e9c88fd311da815dee08a7c41a20488de8ac6620c5308"));
var voteHashTheme = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	participantToken: participantSchema,
	clusterId: string().min(4).max(40)
}), input)).handler(createSsrRpc("e7e80644b429d31cbf6d2378ce09b8e226d7dbee043bbcbef9b7d10e6181a4b7"));
var collateHashRoom = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	hostToken: string().trim().min(20).max(80),
	auto: boolean().optional().default(false)
}), input)).handler(createSsrRpc("9c8104f3c3b184bd462c28c64208e3afc5048870e6b7b1366331ce40d85831b4"));
var summariseHashRoom = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	hostToken: string().trim().min(20).max(80)
}), input)).handler(createSsrRpc("89d41bdd6132ea3b911dd0fa92c70adf7670d53fb86a6e5c7aabc9fb3692d58f"));
var hostHashRoom = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	hostToken: string().trim().min(20).max(80),
	command: HostCommand
}), input)).handler(createSsrRpc("5eca2a3959f127efbc25e9cac6b25656573e0ce6c372ab36cade6c62e992f87a"));
function hostKey(code) {
	return `kairos-hash-host-${code}`;
}
function meKey(code) {
	return `kairos-hash-me-${code}`;
}
function participantToken(code) {
	const existing = localStorage.getItem(meKey(code));
	if (existing && /^[a-zA-Z0-9]{16,64}$/.test(existing)) return existing;
	const next = crypto.randomUUID().replace(/-/g, "");
	localStorage.setItem(meKey(code), next);
	return next;
}
function clock(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function HashStudio({ code }) {
	const navigate = useNavigate();
	const [room, setRoom] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [anonymous, setAnonymous] = (0, import_react.useState)(true);
	const [thrown, setThrown] = (0, import_react.useState)(false);
	const [openId, setOpenId] = (0, import_react.useState)("");
	const [present, setPresent] = (0, import_react.useState)(false);
	const [rename, setRename] = (0, import_react.useState)("");
	const [actionNote, setActionNote] = (0, import_react.useState)("");
	const [prompt, setPrompt] = (0, import_react.useState)("What is slowing this project down?");
	const [context, setContext] = (0, import_react.useState)("");
	const [starter, setStarter] = (0, import_react.useState)("blockers");
	const [identityMode, setIdentityMode] = (0, import_react.useState)("choice");
	const [live, setLive] = (0, import_react.useState)(true);
	const [blind, setBlind] = (0, import_react.useState)(false);
	const [cosmic, setCosmic] = (0, import_react.useState)(false);
	const [voteLimit, setVoteLimit] = (0, import_react.useState)(3);
	(0, import_react.useEffect)(() => {
		if (!code) return;
		let stop = false;
		const load = async () => {
			try {
				const next = await fetchHashRoom({ data: {
					code,
					participantToken: participantToken(code),
					hostToken: localStorage.getItem(hostKey(code)) ?? ""
				} });
				if (!stop) {
					setRoom(next);
					setError("");
				}
			} catch (err) {
				if (!stop) setError(err instanceof Error ? err.message : "The room did not open");
			}
		};
		load();
		const id = window.setInterval(() => {
			if (!document.hidden) load();
		}, 2500);
		return () => {
			stop = true;
			window.clearInterval(id);
		};
	}, [code]);
	(0, import_react.useEffect)(() => {
		if (!room?.sessionId || !supabaseConfigured()) return;
		const sb = getSupabase();
		const channel = sb.channel(`hash-${room.sessionId}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "hash_submissions",
			filter: `session_id=eq.${room.sessionId}`
		}, () => {
			fetchHashRoom({ data: {
				code: room.code,
				participantToken: participantToken(room.code),
				hostToken: localStorage.getItem(hostKey(room.code)) ?? ""
			} }).then(setRoom).catch(() => void 0);
		}).subscribe();
		return () => {
			sb.removeChannel(channel);
		};
	}, [room?.sessionId, room?.code]);
	const roomRef = (0, import_react.useRef)(null);
	roomRef.current = room;
	(0, import_react.useEffect)(() => {
		const current = roomRef.current;
		if (!current || current.role !== "host" || current.status !== "open" || current.uncollatedCount < 4) return;
		const roomCode = current.code;
		const timer = window.setTimeout(() => {
			const latest = roomRef.current;
			if (!latest || latest.uncollatedCount < 4 || latest.status !== "open") return;
			const hostToken = localStorage.getItem(hostKey(roomCode)) ?? "";
			if (!hostToken) return;
			collateHashRoom({ data: {
				code: roomCode,
				hostToken,
				auto: true
			} }).then(setRoom).catch(() => void 0);
		}, 12e3);
		return () => window.clearTimeout(timer);
	}, [
		room?.code,
		room?.role,
		room?.status,
		room?.uncollatedCount
	]);
	async function createRoom() {
		setBusy(true);
		setError("");
		try {
			const created = await createHashSession({ data: {
				prompt: prompt.trim(),
				context: context.trim(),
				starter,
				identityMode,
				showLiveBoard: live,
				blindRound: blind,
				voteLimit,
				cosmicEnabled: cosmic
			} });
			localStorage.setItem(hostKey(created.code), created.hostToken);
			await navigate({
				to: "/",
				search: {
					mode: "hash",
					code: created.code
				}
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not open the room");
		} finally {
			setBusy(false);
		}
	}
	async function throwIn() {
		if (!room) return;
		const line = text.trim();
		if (line.length < 2) return;
		setBusy(true);
		setThrown(true);
		setText("");
		try {
			const next = await throwHashIdea({ data: {
				code: room.code,
				participantToken: participantToken(room.code),
				hostToken: localStorage.getItem(hostKey(room.code)) ?? "",
				text: line,
				anonymous: room.identityMode === "anonymous" || room.identityMode === "choice" && anonymous,
				displayName: name
			} });
			setRoom(next);
			setError("");
		} catch (err) {
			setText(line);
			setThrown(false);
			setError(err instanceof Error ? err.message : "That one did not land");
		} finally {
			setBusy(false);
		}
	}
	async function host(command) {
		if (!room) return;
		const hostToken = localStorage.getItem(hostKey(room.code)) ?? "";
		setBusy(true);
		try {
			setRoom(await hostHashRoom({ data: {
				code: room.code,
				hostToken,
				command
			} }));
			setError("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "The host action did not land");
		} finally {
			setBusy(false);
		}
	}
	if (!code) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "lg:col-span-5 mx-auto w-full max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-gold",
				children: "WORK · HASH IT OUT"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-3xl text-cream",
				children: "Open a room"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: "One question. Everyone throws ideas in. You collate when the room is full."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: HASH_STARTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": starter === item.id,
					onClick: () => {
						setStarter(item.id);
						if (item.prompt) setPrompt(item.prompt);
					},
					className: clsx("press min-h-10 rounded-full px-3 text-sm", starter === item.id ? "bg-vermilion font-semibold text-cream" : "bg-[#1a1410] text-cream ring-1 ring-[#8a5a3a]"),
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-4 block text-sm font-medium text-cream",
				htmlFor: "hash-prompt",
				children: "Question"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "hash-prompt",
				value: prompt,
				onChange: (event) => setPrompt(event.target.value),
				maxLength: 200,
				className: clsx(fieldClass, "mt-2 h-24 py-3")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-4 block text-sm font-medium text-cream",
				htmlFor: "hash-context",
				children: "Context, optional"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "hash-context",
				value: context,
				onChange: (event) => setContext(event.target.value),
				maxLength: 500,
				className: clsx(fieldClass, "mt-2"),
				placeholder: "Project, team, or what this is for"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Names"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-3 gap-2",
				children: [
					"choice",
					"anonymous",
					"named"
				].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": identityMode === mode,
					onClick: () => setIdentityMode(mode),
					className: clsx("press min-h-11 rounded-xl px-2 text-sm font-semibold", identityMode === mode ? "bg-vermilion text-cream" : "bg-[#1a1410] text-cream ring-1 ring-[#8a5a3a]"),
					children: mode === "choice" ? "Their choice" : mode === "anonymous" ? "Anonymous" : "Named"
				}, mode))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2 text-sm text-cream",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: live,
							onChange: (event) => setLive(event.target.checked)
						}), " Participants can see the live board"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: blind,
							onChange: (event) => setBlind(event.target.checked)
						}), " Blind first round"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: cosmic,
							onChange: (event) => setCosmic(event.target.checked)
						}), " Cosmic mode, for a lucky pick later"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-3 block text-sm text-cream",
				htmlFor: "hash-votes",
				children: "Votes each, once voting opens"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				id: "hash-votes",
				value: voteLimit,
				onChange: (event) => setVoteLimit(event.target.value === "1" ? 1 : 3),
				className: clsx(fieldClass, "mt-2"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: 3,
					children: "3 votes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: 1,
					children: "1 vote"
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-vermilion",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy || prompt.trim().length < 2,
				onClick: () => void createRoom(),
				className: "press mt-4 min-h-12 w-full rounded-xl bg-vermilion font-semibold text-cream disabled:opacity-50",
				children: "Open the room"
			})
		]
	});
	if (!room) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "lg:col-span-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-mute",
			children: error || "Opening the room…"
		})
	});
	const hostMode = room.role === "host";
	const boardVisible = hostMode || room.revealed && room.showLiveBoard || !room.blindRound && room.showLiveBoard;
	const open = room.themes.find((theme) => theme.id === openId) ?? null;
	const covered = !hostMode && room.blindRound && !room.revealed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: clsx("lg:col-span-5", present && "fixed inset-0 z-40 overflow-auto bg-ink px-4 py-6 sm:px-10"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold tracking-brand text-gold",
						children: ["HASH IT OUT", hostMode ? " · HOST" : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: clsx("mt-1 max-w-3xl font-display text-cream", present ? "text-4xl sm:text-5xl" : "text-3xl"),
						children: room.prompt
					}),
					room.context ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-mute",
						children: room.context
					}) : null
				] }), hostMode && !present ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-2xl tracking-widest text-gold",
						children: room.code
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press mt-1 text-sm font-semibold text-cream",
						onClick: () => void navigator.clipboard.writeText(`${window.location.origin}${room.sharePath}`).then(() => toast.success("Link copied")),
						children: "Copy link"
					})]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-mute",
				children: [
					room.participantCount,
					" in the room · ",
					room.submissionCount,
					" ",
					room.submissionCount === 1 ? "voice" : "voices",
					" here",
					room.uncollatedCount > 0 ? " · The room is thinking" : room.themeCount > 1 ? " · Common ground found" : "",
					room.status === "paused" ? " · Paused" : room.status === "voting" ? " · Voting" : room.status === "closed" ? " · Closed" : ""
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-vermilion",
				children: error
			}) : null,
			room.status === "open" || room.status === "paused" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-2xl bg-[#1a1410] p-3 ring-1 ring-[#8a5a3a]",
				children: [
					covered ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-sm text-gold",
						children: "Blind round. The board stays covered until the host reveals it."
					}) : null,
					room.identityMode === "choice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": anonymous,
							onClick: () => setAnonymous(true),
							className: clsx("press min-h-10 rounded-full px-3 text-sm", anonymous ? "bg-vermilion text-cream" : "text-mute ring-1 ring-line"),
							children: "Anonymous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": !anonymous,
							onClick: () => setAnonymous(false),
							className: clsx("press min-h-10 rounded-full px-3 text-sm", !anonymous ? "bg-gold text-ink" : "text-mute ring-1 ring-line"),
							children: "Use a name"
						})]
					}) : null,
					room.identityMode === "named" || room.identityMode === "choice" && !anonymous ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: name,
						onChange: (event) => setName(event.target.value),
						placeholder: "Name",
						maxLength: 24,
						className: clsx(fieldClass, "mb-2")
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: "hash-idea",
						children: "Throw in an idea"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "hash-idea",
						value: text,
						onChange: (event) => setText(event.target.value),
						placeholder: "Throw in an idea...",
						maxLength: 240,
						className: clsx(fieldClass, "h-24 py-3 text-base")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy || room.status !== "open" || text.trim().length < 2,
						onClick: () => void throwIn(),
						className: "press mt-2 min-h-12 w-full rounded-xl bg-vermilion text-base font-semibold text-cream disabled:opacity-50",
						children: "Throw it in"
					}),
					thrown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-gold",
						children: "Thrown in. Add another whenever you want."
					}) : null
				]
			}) : null,
			hostMode && !present ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void collateHashRoom({ data: {
							code: room.code,
							hostToken: localStorage.getItem(hostKey(room.code)) ?? "",
							auto: false
						} }).then(setRoom).catch((err) => setError(err instanceof Error ? err.message : "Collate failed")),
						className: "press min-h-12 rounded-xl bg-gold px-4 font-semibold text-ink",
						children: "Collate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void summariseHashRoom({ data: {
							code: room.code,
							hostToken: localStorage.getItem(hostKey(room.code)) ?? ""
						} }).then(setRoom),
						className: "press min-h-12 rounded-xl bg-[#1a1410] px-4 font-semibold text-cream ring-1 ring-gold",
						children: "Summarise the room"
					}),
					room.blindRound && !room.revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void host({ action: "reveal" }),
						className: "press min-h-12 rounded-xl bg-vermilion px-4 font-semibold text-cream",
						children: "Reveal"
					}) : null,
					room.status === "open" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void host({ action: "pause" }),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: "Pause"
					}) : null,
					room.status === "paused" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void host({ action: "resume" }),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: "Resume"
					}) : null,
					room.status !== "voting" && room.status !== "closed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void host({
							action: "voting",
							open: true,
							voteLimit: room.voteLimit === 1 ? 1 : 3
						}),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: "Open voting"
					}) : null,
					room.status === "voting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void host({
							action: "voting",
							open: false
						}),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: "Close voting"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void host({
							action: "live",
							show: !room.showLiveBoard
						}),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: room.showLiveBoard ? "Hide board" : "Show board"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void host({
							action: "cosmic",
							enabled: !room.cosmicEnabled
						}),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: room.cosmicEnabled ? "Cosmic on" : "Cosmic off"
					}),
					room.cosmicEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void host({ action: "lucky" }),
						className: "press min-h-11 rounded-xl px-3 text-sm text-gold ring-1 ring-gold",
						children: "Lucky pick"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPresent(true),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: "Present"
					}),
					room.status !== "closed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void host({ action: "end" }),
						className: "press min-h-11 rounded-xl px-3 text-sm text-mute ring-1 ring-line",
						children: "End session"
					}) : null
				]
			}) : null,
			present ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setPresent(false),
				className: "press mt-4 min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
				children: "Leave present mode"
			}) : null,
			boardVisible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Results, { room }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-gold",
						children: covered && !hostMode ? "YOUR IDEAS" : "LIVE COMMON GROUND"
					}),
					!room.themes.length && !room.loose.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-2xl text-cream",
						children: "Quiet room. Throw in the first idea."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: clsx("mt-3 grid gap-3", present ? "sm:grid-cols-2" : "sm:grid-cols-2"),
						children: room.themes.map((theme) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeCard, {
							theme,
							present,
							onOpen: () => {
								setOpenId(theme.id);
								setRename(theme.title);
								setActionNote(theme.actionNote);
							}
						}, `${theme.id}-${theme.voices}`))
					}),
					room.loose.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [covered && !hostMode ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold tracking-brand text-mute",
							children: ["STILL ON THEIR OWN · ", room.loose.length]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: room.loose.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-xl bg-panel px-3 py-3 text-cream ring-1 ring-line",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line.text }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-mute",
									children: [
										line.label,
										" · ",
										clock(line.createdAt),
										covered && !hostMode ? "" : " · New thread emerging"
									]
								})]
							}, line.id))
						})]
					}) : null
				]
			}),
			open && boardVisible ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-2xl bg-ink p-4 ring-1 ring-gold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl uppercase tracking-wide text-cream",
								children: open.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-gold",
								children: [
									open.voices,
									" ",
									open.voices === 1 ? "voice" : "voices",
									open.support ? ` · Same here ${open.support}` : "",
									open.votes ? ` · ${open.votes} ${open.votes === 1 ? "vote" : "votes"}` : ""
								]
							}),
							open.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-mute",
								children: open.summary
							}) : null
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOpenId(""),
							className: "press min-h-10 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
							children: "Close"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: open.mineSupported || busy,
							onClick: () => void supportHashTheme({ data: {
								code: room.code,
								participantToken: participantToken(room.code),
								clusterId: open.id
							} }).then(setRoom),
							className: "press min-h-11 rounded-xl bg-[#1a1410] px-3 text-sm font-semibold text-cream ring-1 ring-[#8a5a3a] disabled:opacity-50",
							children: open.mineSupported ? "You said same here" : "Same here"
						}), room.status === "voting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: open.mineVoted || room.votesCast >= room.voteLimit || busy,
							onClick: () => void voteHashTheme({ data: {
								code: room.code,
								participantToken: participantToken(room.code),
								clusterId: open.id
							} }).then(setRoom),
							className: "press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink disabled:opacity-50",
							children: [
								"Vote · ",
								Math.max(0, room.voteLimit - room.votesCast),
								" left"
							]
						}) : null]
					}),
					hostMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: rename,
									onChange: (event) => setRename(event.target.value),
									className: fieldClass,
									"aria-label": "Theme name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void host({
										action: "rename",
										clusterId: open.id,
										title: rename
									}),
									className: "press min-h-12 shrink-0 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
									children: "Rename"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void host({
										action: "pin",
										clusterId: open.id,
										pinned: !open.pinned
									}),
									className: "press min-h-10 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
									children: open.pinned ? "Unpin" : "Pin"
								}), room.themes.filter((theme) => theme.id !== open.id).map((theme) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void host({
										action: "merge",
										intoId: open.id,
										fromId: theme.id
									}),
									className: "press min-h-10 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
									children: ["Merge in ", theme.title]
								}, theme.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									"action",
									"park",
									"discuss",
									"decide"
								].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void host({
										action: "mark",
										clusterId: open.id,
										kind,
										note: actionNote
									}),
									className: clsx("press min-h-10 rounded-xl px-3 text-sm", open.actionKind === kind ? "bg-vermilion text-cream" : "text-cream ring-1 ring-line"),
									children: kind === "decide" ? "Decide now" : kind[0]?.toUpperCase() + kind.slice(1)
								}, kind))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: actionNote,
								onChange: (event) => setActionNote(event.target.value),
								placeholder: "Action note, optional",
								className: fieldClass
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: open.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: clsx("rounded-xl px-3 py-3 ring-1", line.hidden ? "bg-ink text-mute ring-line" : "bg-[#1a1410] text-cream ring-[#8a5a3a]"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line.text }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-mute",
									children: [
										line.hidden ? "Hidden · " : "",
										line.label,
										" · ",
										clock(line.createdAt)
									]
								}),
								hostMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => void host({
												action: "split",
												clusterId: open.id,
												submissionId: line.id
											}),
											className: "press min-h-10 rounded-xl px-3 text-xs text-cream ring-1 ring-line",
											children: "Split out"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => void host({
												action: "hide",
												submissionId: line.id,
												hidden: !line.hidden
											}),
											className: "press min-h-10 rounded-xl px-3 text-xs text-cream ring-1 ring-line",
											children: line.hidden ? "Restore" : "Hide"
										}),
										room.themes.filter((theme) => theme.id !== open.id).slice(0, 6).map((theme) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => void host({
												action: "move",
												submissionId: line.id,
												clusterId: theme.id
											}),
											className: "press min-h-10 rounded-xl px-3 text-xs text-cream ring-1 ring-line",
											children: ["Move to ", theme.title]
										}, theme.id))
									]
								}) : null
							]
						}, line.id))
					})
				]
			}) : null
		]
	});
}
function ThemeCard({ theme, present, onOpen }) {
	const grow = theme.prominence;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onOpen,
		className: clsx("hash-tile press rounded-2xl bg-[#1c1612] p-4 text-left text-cream ring-1", grow === 3 ? "sm:col-span-2 ring-2 ring-vermilion" : grow === 2 ? "ring-2 ring-[#e23b28]/80" : grow === 1 ? "ring-[#e6b34d]/80" : "ring-[#8a5a3a]", theme.hidden && "opacity-50"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: clsx("font-semibold uppercase tracking-wide", present || grow >= 2 ? "text-2xl" : "text-lg"),
				children: theme.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm font-semibold text-gold",
				children: [
					theme.voices,
					" ",
					theme.voices === 1 ? "voice" : "voices",
					theme.voices >= 3 ? " · This one is growing" : ""
				]
			}),
			theme.support > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-cream",
				children: ["Same here · ", theme.support]
			}) : null,
			theme.votes > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-cream",
				children: [
					theme.votes,
					" ",
					theme.votes === 1 ? "vote" : "votes"
				]
			}) : null,
			theme.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: theme.summary
			}) : null,
			theme.actionKind ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs font-semibold tracking-brand text-gold",
				children: [theme.actionKind === "decide" ? "DECIDE NOW" : theme.actionKind.toUpperCase(), theme.actionNote ? ` · ${theme.actionNote}` : ""]
			}) : null
		]
	});
}
function Results({ room }) {
	const strongest = room.themes.find((theme) => theme.id === room.strongestId);
	const favourite = room.themes.find((theme) => theme.id === room.favouriteId);
	const hidden = room.themes.find((theme) => theme.id === room.hiddenSignalId);
	const lucky = room.cosmicEnabled ? room.themes.find((theme) => theme.id === room.luckyId) : void 0;
	if (!strongest && !favourite && !hidden && !lucky && !room.synthesis) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 grid gap-3 sm:grid-cols-2",
		children: [
			strongest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl bg-[#1a1410] p-4 ring-1 ring-vermilion",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-gold",
						children: "STRONGEST SIGNAL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl text-cream",
						children: strongest.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-mute",
						children: [
							strongest.voices,
							" independent ",
							strongest.voices === 1 ? "voice" : "voices"
						]
					})
				]
			}) : null,
			favourite ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl bg-[#1a1410] p-4 ring-1 ring-gold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-gold",
						children: "CROWD FAVOURITE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl text-cream",
						children: favourite.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-mute",
						children: [
							favourite.votes,
							" ",
							favourite.votes === 1 ? "vote" : "votes",
							" · not the same thing as how often it was raised"
						]
					})
				]
			}) : null,
			hidden && hidden.id !== strongest?.id && hidden.id !== favourite?.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl bg-[#1a1410] p-4 ring-1 ring-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-mute",
						children: "HIDDEN SIGNAL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl text-cream",
						children: hidden.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-mute",
						children: [
							"Several anonymous responses mention ",
							hidden.summary || hidden.title.toLowerCase(),
							"."
						]
					})
				]
			}) : null,
			lucky ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl bg-[#1a1410] p-4 ring-1 ring-gold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-gold",
						children: "LUCKY PICK"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xl text-cream",
						children: lucky.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mute",
						children: "The universe gets one vote. It does not change the count."
					})
				]
			}) : null,
			room.synthesis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl bg-[#1a1410] p-4 ring-1 ring-line sm:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold tracking-brand text-gold",
						children: ["AI SYNTHESIS", room.synthesis.source === "rules" ? " · FROM THE BOARD" : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SynthesisList, {
						label: "Top themes",
						items: room.synthesis.topThemes
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SynthesisList, {
						label: "Areas of agreement",
						items: room.synthesis.agreement
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SynthesisList, {
						label: "Differing views",
						items: room.synthesis.differing
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SynthesisList, {
						label: "Possible next actions",
						items: room.synthesis.nextActions
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SynthesisList, {
						label: "Questions to explore",
						items: room.synthesis.questions
					})
				]
			}) : null
		]
	});
}
function SynthesisList({ label, items }) {
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-semibold text-cream",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-1 list-disc space-y-1 pl-5 text-sm text-mute",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
		})]
	});
}
var LIFE_ON = {
	family: "bg-[#6fafa6] text-[#120e0c]",
	dating: "bg-[#c4899a] text-[#1a1214]",
	travel: "bg-[#d7b07a] text-[#1a1410]",
	oracle: "bg-[#7157a6] text-[#f4eadc]"
};
function KairosNav({ active, code = "" }) {
	const searchFor = (mode) => ({
		mode,
		code: mode === "makan" || mode === "hash" && active === "hash" ? code : ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Kairos mode",
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/",
			search: searchFor("today"),
			"aria-current": active === "today" ? "page" : void 0,
			className: clsx("press flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl px-4 py-3", active === "today" ? "bg-[#6F7FD8] text-[#f4eadc]" : "bg-[#1c1830] text-[#f4eadc] ring-1 ring-[#6F7FD8]/45"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[11px] font-semibold tracking-brand",
				style: { color: active === "today" ? "#dbe3ff" : "#9AA8FF" },
				children: "COMMAND CENTRE"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-xl font-semibold leading-none",
				children: KAIROS_TODAY.label
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				style: { color: active === "today" ? "#eef1ff" : "#9AA8FF" },
				children: "Your day"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[11px] font-semibold tracking-brand text-mute",
				children: "WORK"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-2 gap-2",
				children: KAIROS_WORK.map((link) => {
					const on = active === link.mode;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						search: searchFor(link.mode),
						"aria-current": on ? "page" : void 0,
						className: clsx("press inline-flex min-h-12 items-center justify-center rounded-xl px-2 text-center text-sm font-semibold leading-tight whitespace-nowrap", on ? "bg-vermilion text-cream ring-1 ring-gold" : "bg-[#1a1410] text-[#f4eadc] ring-1 ring-[#8a5a3a]"),
						children: link.label
					}, link.mode);
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[11px] font-semibold tracking-brand text-mute",
				children: "LIFE"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-2 gap-2",
				children: KAIROS_LIFE.map((link) => {
					const on = active === link.mode;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						search: searchFor(link.mode),
						"aria-current": on ? "page" : void 0,
						className: clsx("press inline-flex min-h-12 items-center justify-center rounded-xl px-2 text-center text-sm font-semibold leading-tight whitespace-nowrap", on ? LIFE_ON[link.mode] : "bg-panel text-mute ring-1 ring-line"),
						children: link.label
					}, link.mode);
				})
			})] })]
		})]
	});
}
var minutes = union([
	literal(5),
	literal(10),
	literal(15),
	literal(25)
]);
var cuisineEnum = _enum([...CUISINE_OPTIONS, ...MORE_CUISINES].map((item) => item.id));
var placeEnum = _enum(PLACE_TYPES.map((item) => item.id));
var findMakan = createServerFn({ method: "POST" }).validator((input) => object({
	text: string().trim().max(400).optional().default(""),
	areaId: string().trim().max(24).optional().default(""),
	address: string().trim().max(160).optional().default(""),
	groupSize: number().int().min(1).max(40).optional().default(4),
	minutes,
	budget: union([
		literal(0),
		literal(1),
		literal(2),
		literal(3)
	]).optional().default(0),
	dietary: _enum([
		"",
		"halal",
		"vegetarian",
		"vegan"
	]).optional().default(""),
	mood: _enum([
		"",
		"quick",
		"comfortable",
		"different",
		"coffee",
		"casual"
	]).optional().default(""),
	timing: _enum([
		"",
		"before",
		"after"
	]).optional().default(""),
	explain: boolean().optional().default(true),
	latitude: number().gte(-90).lte(90).nullable().optional(),
	longitude: number().gte(-180).lte(180).nullable().optional(),
	originSource: _enum([
		"",
		"meeting",
		"office",
		"home",
		"current",
		"choose"
	]).optional().default(""),
	originName: string().trim().max(80).optional().default(""),
	allowDistance: boolean().optional().default(false),
	cuisines: array(cuisineEnum).max(16).optional().default([]),
	placeTypes: array(placeEnum).max(5).optional().default([]),
	savedPlaces: array(object({
		id: string().trim().max(80),
		name: string().trim().max(80),
		address: string().trim().max(160).optional().default(""),
		latitude: number().gte(-90).lte(90),
		longitude: number().gte(-180).lte(180),
		cuisine: string().trim().max(80).optional().default(""),
		placeKind: string().trim().max(24).optional().default("")
	})).max(24).optional().default([])
}).parse(input)).handler(createSsrRpc("5673e20680bdbc750f5973614a9c4a560c3764a69ee58983ea50386c4eb5f37e"));
var findOuting = createServerFn({ method: "POST" }).validator((input) => object({
	text: string().trim().min(8).max(500),
	areaId: string().trim().max(24).optional().default(""),
	groupSize: number().int().min(2).max(80).optional().default(12),
	budget: number().int().min(0).max(200).optional().default(50),
	budgetMin: number().int().min(0).max(200).optional().default(0)
}).parse(input)).handler(createSsrRpc("37fc7d5a0be024cde92b4599293d57d082b8f05fd788adcc1d04db394f5620ba"));
var point$1 = {
	latitude: number().gte(-90).lte(90),
	longitude: number().gte(-180).lte(180)
};
var reversePlace = createServerFn({ method: "POST" }).validator((input) => object(point$1).parse(input)).handler(createSsrRpc("2b37212ba9d7a362873f46322d17fc3edc6ef8cef3c0fa5d057d4239b7a58348"));
var lookupPlace = createServerFn({ method: "POST" }).validator((input) => object({ query: string().trim().min(2).max(120) }).parse(input)).handler(createSsrRpc("aae47111b8ba1a6c8f72a3197cf2a24411952a39f18b5e18529be8119f5fc93d"));
var OFFICE_KEY = "kairos-office";
var HOME_KEY = "kairos-home";
function readPlace(key) {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		const address = String(parsed.address ?? "").trim().slice(0, 160);
		const name = String(parsed.name ?? "").trim().slice(0, 80);
		if (address.length < 3 && name.length < 3) return null;
		const areaId = String(parsed.areaId ?? "").slice(0, 24);
		const latitude = typeof parsed.latitude === "number" && Number.isFinite(parsed.latitude) ? parsed.latitude : void 0;
		const longitude = typeof parsed.longitude === "number" && Number.isFinite(parsed.longitude) ? parsed.longitude : void 0;
		return {
			name: name || address,
			address: address || name,
			areaId,
			latitude,
			longitude
		};
	} catch {
		return null;
	}
}
function writePlace(key, place) {
	localStorage.setItem(key, JSON.stringify(place));
}
function readOffice() {
	return readPlace(OFFICE_KEY);
}
function writeOffice(office) {
	writePlace(OFFICE_KEY, office);
}
function readHome() {
	return readPlace(HOME_KEY);
}
function writeHome(home) {
	writePlace(HOME_KEY, home);
}
/** Kairos decides. These URLs only open an app the user already has. No Gemini. No paid API. */
var REVIEW_NOTE = "Opens that service. Kairos has not read those reviews.";
function clean(value) {
	return (value ?? "").replace(/\s+/g, " ").trim();
}
function countryOf(input) {
	return clean(input.countryCode || input.place.countryCode).toUpperCase();
}
function linkInput(input) {
	const place = input.place;
	return {
		name: place.name,
		nameEn: place.nameEn,
		nameLocal: place.nameLocal,
		localName: place.localName,
		displayName: place.displayName,
		nameEnglish: place.nameEnglish,
		nameRomanized: place.nameRomanized,
		address: place.address,
		city: place.city,
		region: place.region,
		countryCode: countryOf(input),
		lat: place.lat,
		lng: place.lng,
		website: place.website,
		googlePlaceId: place.googlePlaceId
	};
}
function point(input) {
	const lat = input.place.lat;
	const lng = input.place.lng;
	if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
	if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
	return {
		lat,
		lng,
		name: clean(input.place.nameLocal || input.place.localName || input.place.name).slice(0, 80) || "Place"
	};
}
function originPoint(input, dest) {
	const from = input.from;
	if (!from || !Number.isFinite(from.lat) || !Number.isFinite(from.lng)) return null;
	if (Math.abs(from.lat) > 90 || Math.abs(from.lng) > 180) return null;
	if (Math.abs(from.lat - dest.lat) < 1e-5 && Math.abs(from.lng - dest.lng) < 1e-5) return null;
	return {
		lat: from.lat,
		lng: from.lng,
		name: clean(from.name).slice(0, 80) || "Start"
	};
}
function push(list, action) {
	if (!action?.url || !action.url.startsWith("https://")) return;
	if (list.some((item) => item.url === action.url && item.type === action.type)) return;
	list.push(action);
}
function verifiedAction(type, provider, label, raw, placeId) {
	const url = verifiedWebsite(raw);
	if (!url) return null;
	return {
		id: type.toLowerCase(),
		type,
		provider,
		label,
		url,
		webUrl: url,
		placeId,
		source: "verified-url",
		affiliateEligible: false,
		disclosureRequired: false
	};
}
function singaporeInstant(date, minutes) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
	const [year, month, day] = date.split("-").map(Number);
	const hour = Math.floor(minutes / 60);
	const minute = minutes % 60;
	if (!year || !month || !day || hour < 0 || hour > 23 || minute < 0 || minute > 59) return "";
	return new Date(Date.UTC(year, month - 1, day, hour - 8, minute)).toISOString();
}
function calendarAction(input) {
	const when = input.when;
	if (!when || when.timezone && when.timezone !== "Asia/Singapore") return null;
	const start = singaporeInstant(when.date, when.startMin);
	if (!start) return null;
	const duration = Math.max(30, Math.min(480, when.endMin - when.startMin));
	try {
		const url = createGoogleCalendarUrl({
			title: clean(input.place.name).slice(0, 80) || "Plan",
			startTime: start,
			durationMinutes: Number.isFinite(duration) ? duration : 60,
			timezone: "Asia/Singapore",
			venueName: clean(input.place.name).slice(0, 80),
			address: clean(input.place.address).slice(0, 120)
		});
		return {
			id: "calendar",
			type: "ADD_TO_CALENDAR",
			provider: "google-calendar",
			label: "Add to calendar",
			url,
			webUrl: url,
			placeId: input.place.id,
			source: "calendar-template",
			affiliateEligible: false,
			disclosureRequired: false
		};
	} catch {
		return null;
	}
}
function commerceContext(input) {
	return {
		mode: input.mode,
		destination: input.destination,
		checkIn: input.checkIn,
		checkOut: input.checkOut,
		adults: input.adults,
		childAges: input.childAges
	};
}
function shareAction(input, mapUrl) {
	const name = clean(input.place.name);
	if (!name) return null;
	const text = [
		name,
		clean(input.place.address),
		clean(input.place.city),
		mapUrl
	].filter(Boolean).join("\n").slice(0, 400);
	const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
	return {
		id: "share",
		type: "SHARE",
		provider: "whatsapp",
		label: "Share",
		url,
		webUrl: url,
		placeId: input.place.id,
		source: "share-link",
		affiliateEligible: false,
		disclosureRequired: false
	};
}
/**
* Build only the actions we can actually open.
* A missing ticket, reservation, order, or quote URL is omitted. Nothing is invented.
*/
function placeActions(input, platform = "other", affiliate) {
	const actions = [];
	const country = countryOf(input);
	const links = externalPlaceLinks(linkInput(input), input.from);
	const placeId = input.place.id;
	const show = /* @__PURE__ */ new Set();
	if (input.mode === "travel" && input.kind === "hotel") show.add("BOOK_HOTEL");
	if (input.kind !== "restaurant" || input.mode === "travel" || input.mode === "family") show.add("OFFICIAL_WEBSITE");
	if (input.mode === "makan") show.add("OFFICIAL_WEBSITE");
	if (input.kind === "attraction" || input.kind === "activity" || input.kind === "venue") show.add("BUY_TICKET");
	if (input.kind === "activity" || input.kind === "venue") show.add("BOOK_ACTIVITY");
	if (input.kind === "restaurant") show.add("RESERVE_RESTAURANT");
	if (input.mode === "makan" && input.kind === "restaurant") show.add("ORDER_FOOD");
	if (input.mode === "out") show.add("REQUEST_QUOTE");
	if (links.localPlace && (country === "CN" || country === "KR")) push(actions, {
		id: "local-place",
		type: "REVIEWS",
		provider: country === "CN" ? "amap" : "kakao",
		label: links.localPlace.label,
		url: links.localPlace.href,
		appUrl: links.localPlace.href,
		webUrl: links.localPlace.href,
		placeId,
		source: "regional-place",
		affiliateEligible: false,
		disclosureRequired: true,
		disclosure: REVIEW_NOTE
	});
	if (country === "KR") {
		const query = links.googleMapsSearch ? new URL(links.googleMapsSearch).searchParams.get("query") || "" : "";
		if (query) {
			const url = `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
			push(actions, {
				id: "naver-place",
				type: "REVIEWS",
				provider: "naver",
				label: "View on Naver Map",
				url,
				webUrl: url,
				placeId,
				source: "regional-place",
				affiliateEligible: false,
				disclosureRequired: true,
				disclosure: REVIEW_NOTE
			});
		}
	}
	if (links.googleReviews) push(actions, {
		id: "google-reviews",
		type: "REVIEWS",
		provider: "google-maps",
		label: "View Google reviews",
		url: links.googleReviews,
		webUrl: links.googleReviews,
		placeId,
		source: "maps-search",
		affiliateEligible: false,
		disclosureRequired: true,
		disclosure: REVIEW_NOTE
	});
	if (show.has("OFFICIAL_WEBSITE")) push(actions, verifiedAction("OFFICIAL_WEBSITE", "official", "Official website", input.place.website, placeId));
	if (show.has("BUY_TICKET")) push(actions, verifiedAction("BUY_TICKET", "official", "Check tickets", input.place.ticketUrl, placeId));
	if (show.has("BOOK_ACTIVITY")) push(actions, verifiedAction("BOOK_ACTIVITY", "official", "Book activity", input.place.activityUrl, placeId));
	if (show.has("RESERVE_RESTAURANT")) push(actions, verifiedAction("RESERVE_RESTAURANT", "official", "Reserve", input.place.reserveUrl, placeId));
	if (show.has("ORDER_FOOD")) push(actions, verifiedAction("ORDER_FOOD", "official", "Order", input.place.orderUrl, placeId));
	if (show.has("REQUEST_QUOTE")) push(actions, verifiedAction("REQUEST_QUOTE", "official", "Request quote", input.place.quoteUrl, placeId));
	const commerce = commerceContext(input);
	if (show.has("BOOK_HOTEL")) for (const action of resolveCommerceActions({
		id: placeId,
		name: input.place.name,
		city: input.place.city,
		country,
		lat: input.place.lat,
		lng: input.place.lng,
		category: "HOTEL"
	}, commerce, affiliate)) push(actions, action);
	if (show.has("BUY_TICKET") || show.has("BOOK_ACTIVITY")) {
		const category = input.kind === "activity" || input.kind === "venue" ? "ACTIVITY" : "ATTRACTION";
		for (const action of resolveCommerceActions({
			id: placeId,
			name: input.place.name,
			city: input.place.city,
			country,
			lat: input.place.lat,
			lng: input.place.lng,
			category
		}, commerce, affiliate)) push(actions, action);
	}
	if (show.has("RESERVE_RESTAURANT")) for (const action of resolveCommerceActions({
		id: placeId,
		name: input.place.name,
		city: input.place.city,
		country,
		category: "RESTAURANT"
	}, commerce, affiliate)) push(actions, action);
	if (show.has("ORDER_FOOD")) for (const action of resolveCommerceActions({
		id: placeId,
		name: input.place.name,
		city: input.place.city,
		country,
		category: "FOOD_DELIVERY"
	}, commerce, affiliate)) push(actions, action);
	if (show.has("REQUEST_QUOTE")) for (const action of resolveCommerceActions({
		id: placeId,
		name: input.place.name,
		city: input.place.city,
		country,
		category: "TEAM_ACTIVITY"
	}, commerce, affiliate)) push(actions, action);
	const dest = point(input);
	const from = dest ? originPoint(input, dest) : null;
	if (input.navigate !== false && dest && from) {
		const app = automaticNav(country, platform);
		const mode = input.navMode ?? "drive";
		const appUrl = navigationHref(app, from, dest, mode);
		push(actions, {
			id: "navigate",
			type: "NAVIGATE",
			provider: app,
			label: "Navigate",
			url: appUrl,
			appUrl,
			webUrl: navigationHref("google", from, dest, mode),
			placeId,
			source: "navigation-handoff",
			affiliateEligible: false,
			disclosureRequired: false
		});
	}
	if (input.mode === "today") push(actions, calendarAction(input));
	if (input.share) push(actions, shareAction(input, links.googleMapsSearch));
	return actions;
}
function kindFromTravelCategory(category) {
	if (category === "stay") return "hotel";
	if (category === "restaurant" || category === "cafe" || category === "nightlife" || category === "market") return "restaurant";
	if (category === "theme_park" || category === "zoo" || category === "aquarium") return "activity";
	return "attraction";
}
/** Production has no authorised rate feed. The UI must not call this and then invent numbers. */
function liveHotelRates() {
	return null;
}
var CATEGORY = {
	BOOK_HOTEL: "HOTEL",
	BUY_TICKET: "ATTRACTION",
	BOOK_ACTIVITY: "ACTIVITY",
	RESERVE_RESTAURANT: "RESTAURANT",
	ORDER_FOOD: "FOOD_DELIVERY",
	REQUEST_QUOTE: "TEAM_ACTIVITY",
	BOOK_TRANSPORT: "TRANSPORT",
	BUY_ESIM: "ESIM",
	RENT_CAR: "CAR_RENTAL"
};
/** Opens the specialist app or a new browser tab. Never an embedded page. */
function ExternalActions({ input, heading = "ELSEWHERE", notes = true }) {
	const actions = placeActions(input, detectPlatform());
	if (!actions.length) return null;
	const hotels = actions.filter((action) => action.type === "BOOK_HOTEL");
	const rest = actions.filter((action) => action.type !== "BOOK_HOTEL");
	const affiliate = actions.some((action) => action.source === "affiliate");
	const notesList = [...new Set(rest.map((action) => action.disclosure).filter((line) => Boolean(line) && line !== "Some booking links are affiliate links. Kairos may earn a commission at no additional cost to you." && line !== "The booking site shows the current price. Kairos has not compared rates."))];
	const live = Boolean(liveHotelRates());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [
			hotels.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: live ? "COMPARE LIVE PRICES" : "CHECK HOTELS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: hotels.map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RateLink, {
						action,
						mode: input.mode,
						live
					}, action.id))
				}),
				notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-mute",
					children: RATE_NOTE
				}) : null
			] }) : null,
			rest.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: hotels.length ? "mt-4" : "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: heading
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: rest.map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionLink, {
						action,
						mode: input.mode
					}, action.id))
				})]
			}) : null,
			notes ? notesList.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-mute",
				children: note
			}, note)) : null,
			notes && affiliate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-mute",
				children: AFFILIATE_DISCLOSURE
			}) : null
		]
	});
}
function RateLink({ action, mode, live }) {
	const name = action.label.replace(/^Check /, "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: action.url,
		target: "_blank",
		rel: "noreferrer",
		"aria-label": action.label,
		onClick: () => track(action, mode),
		className: "press min-w-28 rounded-xl px-3 py-2 ring-1 ring-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-xs text-mute",
			children: name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 block text-sm text-cream",
			children: live ? "Check live price" : "Open"
		})]
	});
}
function ActionLink({ action, mode }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: action.url,
		target: "_blank",
		rel: "noreferrer",
		onClick: () => track(action, mode),
		className: "press inline-flex min-h-11 items-center rounded-xl px-3 text-sm text-cream ring-1 ring-line",
		children: action.label
	});
}
function track(action, mode) {
	const category = CATEGORY[action.type];
	if (!category) return;
	recordAffiliateClick(action, mode, category);
}
var WALKS = [
	{
		id: 5,
		label: "5 min walk"
	},
	{
		id: 10,
		label: "10 min walk"
	},
	{
		id: 15,
		label: "15 min walk"
	},
	{
		id: 25,
		label: "Short ride"
	}
];
var BUDGETS = [
	{
		id: 1,
		label: "<$10"
	},
	{
		id: 2,
		label: "$10–$20"
	},
	{
		id: 0,
		label: "Any"
	}
];
var DIETS = [
	{
		id: "",
		label: "No restriction"
	},
	{
		id: "halal",
		label: "Halal"
	},
	{
		id: "vegetarian",
		label: "Vegetarian"
	},
	{
		id: "vegan",
		label: "Vegan"
	},
	{
		id: "other",
		label: "Other"
	}
];
var MOODS = [
	{
		id: "",
		label: "Any"
	},
	{
		id: "quick",
		label: "Quick"
	},
	{
		id: "comfortable",
		label: "Comfortable"
	},
	{
		id: "different",
		label: "Something different"
	},
	{
		id: "coffee",
		label: "Coffee"
	},
	{
		id: "casual",
		label: "Casual team lunch"
	}
];
var MEALS = [
	{
		id: "breakfast",
		label: "Breakfast"
	},
	{
		id: "lunch",
		label: "Lunch"
	},
	{
		id: "dinner",
		label: "Dinner"
	},
	{
		id: "before",
		label: "Before meeting"
	},
	{
		id: "after",
		label: "After meeting"
	}
];
function favKey(hit) {
	return hit.id || hit.name.toLowerCase();
}
function readFavs() {
	if (typeof localStorage === "undefined") return [];
	try {
		const raw = JSON.parse(localStorage.getItem("kairos-makan-favs") ?? "[]");
		return Array.isArray(raw) ? raw.filter((item) => item && typeof item.name === "string" && typeof item.id === "string").slice(0, 24) : [];
	} catch {
		return [];
	}
}
function writeFavs(next) {
	localStorage.setItem("kairos-makan-favs", JSON.stringify(next.slice(0, 24)));
}
function budgetCopy(id) {
	if (id === 1) return "Under $10/pax";
	if (id === 2) return "$10–$20/pax";
	return "Any budget";
}
function mealWindow(meal) {
	if (meal === "breakfast") return "8:00 AM – 9:30 AM";
	if (meal === "lunch") return "11:40 AM – 12:45 PM";
	if (meal === "dinner") return "6:30 PM – 8:00 PM";
	if (meal === "before") return "Before the meeting";
	return "After the meeting";
}
function dietApi(value) {
	return value === "other" ? "" : value;
}
function MakanStudio({ code }) {
	const [event, setEvent] = (0, import_react.useState)(null);
	const [origin, setOrigin] = (0, import_react.useState)(code ? "meeting" : "choose");
	const [areaId, setAreaId] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [groupSize, setGroupSize] = (0, import_react.useState)(6);
	const [minutes, setMinutes] = (0, import_react.useState)(10);
	const [budget, setBudget] = (0, import_react.useState)(2);
	const [dietary, setDietary] = (0, import_react.useState)("");
	const [mood, setMood] = (0, import_react.useState)("");
	const [cuisines, setCuisines] = (0, import_react.useState)([]);
	const [placeTypes, setPlaceTypes] = (0, import_react.useState)([]);
	const [moreCuisine, setMoreCuisine] = (0, import_react.useState)(false);
	const [sortMode, setSortMode] = (0, import_react.useState)("match");
	const [randomSeed, setRandomSeed] = (0, import_react.useState)(1);
	const [showMore, setShowMore] = (0, import_react.useState)(false);
	const [favs, setFavs] = (0, import_react.useState)([]);
	const [forcedIds, setForcedIds] = (0, import_react.useState)([]);
	const [meal, setMeal] = (0, import_react.useState)("lunch");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [pool, setPool] = (0, import_react.useState)([]);
	const [pick, setPick] = (0, import_react.useState)(null);
	const [chosenId, setChosenId] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [originLabel, setOriginLabel] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [office, setOffice] = (0, import_react.useState)(null);
	const [officeName, setOfficeName] = (0, import_react.useState)("");
	const [home, setHome] = (0, import_react.useState)(null);
	const [homeName, setHomeName] = (0, import_react.useState)("");
	const [searchStatus, setSearchStatus] = (0, import_react.useState)("");
	const [resolvedFrom, setResolvedFrom] = (0, import_react.useState)("");
	const [geo, setGeo] = (0, import_react.useState)(null);
	const [locating, setLocating] = (0, import_react.useState)(false);
	const [locError, setLocError] = (0, import_react.useState)("");
	const [locKind, setLocKind] = (0, import_react.useState)("");
	const [approximate, setApproximate] = (0, import_react.useState)(false);
	const [lookup, setLookup] = (0, import_react.useState)("");
	const [lookups, setLookups] = (0, import_react.useState)([]);
	const [lookingUp, setLookingUp] = (0, import_react.useState)(false);
	const [lookupMiss, setLookupMiss] = (0, import_react.useState)(false);
	const locateGen = (0, import_react.useRef)(0);
	const lookupGen = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		setFavs(readFavs());
	}, []);
	(0, import_react.useEffect)(() => {
		if (origin !== "choose") return;
		const query = lookup.trim();
		if (geo?.source === "manual" && query === (geo.label || "")) return;
		if (query.length < 2) {
			setLookups([]);
			setLookupMiss(false);
			return;
		}
		const gen = lookupGen.current + 1;
		lookupGen.current = gen;
		const timer = window.setTimeout(() => {
			setLookingUp(true);
			setLookupMiss(false);
			lookupPlace({ data: { query } }).then((found) => {
				if (lookupGen.current !== gen) return;
				setLookups(found);
				setLookupMiss(found.length === 0);
				if (found.length) setError("");
			}).catch(() => {
				if (lookupGen.current !== gen) return;
				setLookups([]);
				setLookupMiss(true);
				setError("The place search did not answer. Try again.");
			}).finally(() => {
				if (lookupGen.current === gen) setLookingUp(false);
			});
		}, 400);
		return () => window.clearTimeout(timer);
	}, [
		lookup,
		origin,
		geo?.label,
		geo?.source
	]);
	(0, import_react.useEffect)(() => {
		const saved = readOffice();
		if (!saved) return;
		setOffice(saved);
		setOfficeName(saved.name);
		if (!code) {
			setOrigin("office");
			setAddress(saved.address);
			if (saved.areaId) setAreaId(saved.areaId);
			setOriginLabel(saved.name || saved.address);
			setGeo({
				source: "office",
				label: saved.name || saved.address,
				address: saved.address,
				latitude: saved.latitude,
				longitude: saved.longitude
			});
		}
	}, [code]);
	(0, import_react.useEffect)(() => {
		const saved = readHome();
		if (!saved) return;
		setHome(saved);
		setHomeName(saved.name);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!code) return;
		let live = true;
		fetchEvent({ data: { code } }).then((loaded) => {
			if (!live || !loaded) return;
			setEvent(loaded);
			const place = loaded.place;
			const where = place.address || place.venueName;
			if (where) {
				setAddress(where);
				setOriginLabel(where);
				setGeo({
					source: "meeting_location",
					label: where,
					address: where
				});
				lookupPlace({ data: { query: where } }).then((found) => {
					const first = found[0];
					if (!live || !first) return;
					setGeo({
						source: "meeting_location",
						label: first.label || where,
						address: first.address || where,
						latitude: first.latitude,
						longitude: first.longitude
					});
					const area = matchArea(`${first.label} ${first.address}`);
					if (area) setAreaId(area.id);
				}).catch(() => {});
			}
			const area = matchArea(`${place.address} ${place.venueName}`);
			if (area) setAreaId(area.id);
			if (place.makanWhen === "before") setMeal("before");
			else if (place.makanWhen === "after") setMeal("after");
			setOrigin(where ? "meeting" : "choose");
		});
		return () => {
			live = false;
		};
	}, [code]);
	const timing = meal === "before" || meal === "after" ? meal : "";
	const fromLabel = originLabel || address.trim() || AREAS.find((area) => area.id === areaId)?.label || (origin === "office" ? "My office" : "Pick a place");
	const dietLabel = DIETS.find((item) => item.id === dietary)?.label ?? "No restriction";
	const walkLabel = WALKS.find((item) => item.id === minutes)?.label ?? "10 min walk";
	const shown = (pick ? [pick] : hits).filter((hit) => searchStatus === "distance" ? hit.verified !== true : hit.verified === true && hit.minutes <= minutes);
	const matchContext = {
		groupSize,
		minutes,
		budget,
		dietary: dietApi(dietary),
		mood,
		meal: MEALS.find((item) => item.id === meal)?.label ?? "Lunch",
		cuisines,
		placeTypes,
		favouriteKeys: favs.map((fav) => favKey(fav)),
		seed: randomSeed
	};
	const sorted = sortMakanHits(shown, sortMode === "favourites" ? "favourites" : sortMode, matchContext);
	const visible = sortMode === "random" ? sorted.slice(0, 1) : sorted.slice(0, showMore ? sorted.length : 8);
	const shownKeys = new Set(sorted.map((hit) => favKey(hit)));
	const outsideFavs = favs.filter((fav) => !shownKeys.has(favKey(fav)) && !forcedIds.includes(favKey(fav)));
	const forcedFavs = favs.filter((fav) => forcedIds.includes(favKey(fav)) && !shownKeys.has(favKey(fav)));
	const cards = shown;
	const chosen = cards.find((hit) => hit.id === chosenId) ?? null;
	const originWord = origin === "office" ? "Office" : origin === "home" ? "Home" : origin === "current" ? "Current location" : origin === "meeting" ? "Meeting" : "Place";
	const emptyStatus = cards.length === 0 && searchStatus === "ok" ? "walk" : searchStatus;
	function meetingText() {
		if (!event) return "";
		return [event.place.venueName, event.place.address].map((part) => part.trim()).filter(Boolean).join(", ");
	}
	function activePoint() {
		if (!geo || geo.latitude == null || geo.longitude == null) return null;
		const source = origin === "current" ? "current_location" : origin === "office" ? "office" : origin === "home" ? "home" : origin === "meeting" ? "meeting_location" : "manual";
		if (geo.source !== source) return null;
		return {
			lat: geo.latitude,
			lng: geo.longitude,
			label: geo.label || geo.address || "Here"
		};
	}
	function applySaved(kind, saved) {
		if (kind === "office") {
			setOffice(saved);
			setOfficeName(saved.name);
		} else {
			setHome(saved);
			setHomeName(saved.name);
		}
		setAddress(saved.address);
		setOriginLabel(saved.name || saved.address);
		setOrigin(kind);
		setGeo({
			source: kind,
			label: saved.name || saved.address,
			address: saved.address,
			latitude: saved.latitude,
			longitude: saved.longitude
		});
		setLocError("");
		setError("");
	}
	function pickManual(hit) {
		const name = hit.name || hit.label;
		setGeo({
			source: "manual",
			label: name,
			address: hit.address,
			latitude: hit.latitude,
			longitude: hit.longitude,
			providerId: hit.providerId
		});
		setAddress(hit.address || name);
		setOriginLabel(name);
		setLookup(name);
		setLookups([]);
		setLookupMiss(false);
		setError("");
	}
	function clearManual() {
		lookupGen.current += 1;
		setGeo(null);
		setLookup("");
		setLookups([]);
		setLookupMiss(false);
		setLookingUp(false);
		setAddress("");
		setOriginLabel("");
		setError("");
	}
	async function pinAddress(source, label, line) {
		setAddress(line);
		setOriginLabel(label);
		setGeo({
			source,
			label,
			address: line
		});
		try {
			const first = (await lookupPlace({ data: { query: line } }))[0];
			if (!first) return;
			setGeo({
				source,
				label: first.label || label,
				address: first.address || line,
				latitude: first.latitude,
				longitude: first.longitude
			});
			const area = matchArea(`${first.label} ${first.address}`);
			if (area) setAreaId(area.id);
		} catch {}
	}
	function requestCurrentLocation() {
		setOrigin("current");
		setError("");
		setLocError("");
		setLocKind("");
		setApproximate(false);
		if (typeof window === "undefined" || !window.isSecureContext) {
			setLocKind("insecure");
			setLocError("Location needs a secure page. Open Kairos on https, or choose a location.");
			return;
		}
		if (!navigator.geolocation) {
			setLocKind("unsupported");
			setLocError("Your browser doesn’t support location detection.");
			return;
		}
		setLocating(true);
		const gen = locateGen.current + 1;
		locateGen.current = gen;
		navigator.geolocation.getCurrentPosition((position) => {
			if (locateGen.current !== gen) return;
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			const accuracyMeters = Math.round(position.coords.accuracy);
			setApproximate(accuracyMeters > 500);
			setGeo({
				source: "current_location",
				label: "Current location detected",
				latitude,
				longitude,
				accuracyMeters
			});
			setOriginLabel("Current location detected");
			setLocating(false);
			reversePlace({ data: {
				latitude,
				longitude
			} }).then((found) => {
				if (locateGen.current !== gen || !found?.label) return;
				setOriginLabel(found.label);
				setAddress(found.address || "");
				setGeo((current) => current?.source === "current_location" ? {
					...current,
					label: found.label,
					address: found.address
				} : current);
				const area = matchArea(`${found.label} ${found.address}`);
				if (area) setAreaId(area.id);
			}).catch(() => {});
		}, (err) => {
			if (locateGen.current !== gen) return;
			setLocating(false);
			setGeo((current) => current?.source === "current_location" ? null : current);
			if (err.code === err.PERMISSION_DENIED) {
				setLocKind("denied");
				setLocError("Location access was blocked.");
			} else if (err.code === err.TIMEOUT) {
				setLocKind("timeout");
				setLocError("Location is taking too long.");
			} else {
				setLocKind("unavailable");
				setLocError("We couldn’t determine your current location.");
			}
		}, {
			enableHighAccuracy: true,
			timeout: 1e4,
			maximumAge: 3e5
		});
	}
	function chooseOrigin(value) {
		setError("");
		if (value === "current") {
			requestCurrentLocation();
			return;
		}
		setOrigin(value);
		setLocError("");
		locateGen.current += 1;
		if (value === "office" || value === "home") {
			const saved = value === "office" ? office ?? readOffice() : home ?? readHome();
			if (saved) applySaved(value, saved);
			else {
				setAddress("");
				setGeo(null);
				setOriginLabel("");
				setError(value === "office" ? "Office location not set." : "Home location not set.");
			}
			return;
		}
		if (value === "meeting") {
			const where = meetingText();
			if (!where) {
				setGeo(null);
				setError("No physical meeting location available.");
				return;
			}
			const area = matchArea(`${event?.place.address ?? ""} ${event?.place.venueName ?? ""}`);
			if (area) setAreaId(area.id);
			pinAddress("meeting_location", where, where);
		}
	}
	async function savePlace(kind) {
		const line = address.trim();
		const name = (kind === "office" ? officeName : homeName).trim() || line;
		if (name.length < 3) {
			setError(kind === "office" ? "Type the office building or street, then save it." : "Type the home street, then save it.");
			return;
		}
		const saved = {
			name: name.slice(0, 80),
			address: (line || name).slice(0, 160),
			areaId: ""
		};
		if (kind === "office") writeOffice(saved);
		else writeHome(saved);
		applySaved(kind, saved);
		toast.success(kind === "office" ? "Office saved on this browser" : "Home saved on this browser");
		try {
			const first = (await lookupPlace({ data: { query: saved.address } }))[0];
			if (!first) return;
			const pinned = {
				...saved,
				latitude: first.latitude,
				longitude: first.longitude
			};
			if (kind === "office") writeOffice(pinned);
			else writeHome(pinned);
			applySaved(kind, pinned);
		} catch {}
	}
	async function runLookup() {
		const query = lookup.trim();
		if (query.length < 2) {
			setError("Type a building, mall, MRT, or address.");
			return;
		}
		const gen = lookupGen.current + 1;
		lookupGen.current = gen;
		setLookingUp(true);
		setLookupMiss(false);
		setError("");
		try {
			const found = await lookupPlace({ data: { query } });
			if (lookupGen.current !== gen) return;
			setLookups(found);
			setLookupMiss(found.length === 0);
		} catch {
			if (lookupGen.current !== gen) return;
			setLookups([]);
			setLookupMiss(true);
			setError("The place search did not answer. Try again.");
		} finally {
			if (lookupGen.current === gen) setLookingUp(false);
		}
	}
	async function onFind(override) {
		const walk = override?.minutes ?? minutes;
		const spend = override?.budget ?? budget;
		const diet = override?.dietary ?? dietary;
		const vibe = override?.mood ?? mood;
		const chosenCuisines = override && "cuisines" in override ? override.cuisines ?? [] : cuisines;
		const chosenPlaces = override && "placeTypes" in override ? override.placeTypes ?? [] : placeTypes;
		if (override?.minutes) setMinutes(override.minutes);
		if (override?.budget != null) setBudget(override.budget);
		if (override?.dietary != null) setDietary(override.dietary);
		if (override?.mood != null) setMood(override.mood);
		if (override && "cuisines" in override) setCuisines(chosenCuisines);
		if (override && "placeTypes" in override) setPlaceTypes(chosenPlaces);
		if (origin === "current" && locating) {
			setError("Still finding you.");
			return;
		}
		if (origin === "office" && !office) {
			setError("Office location not set.");
			return;
		}
		if (origin === "home" && !home) {
			setError("Home location not set.");
			return;
		}
		if (origin === "meeting" && !meetingText()) {
			setError("No physical meeting location available.");
			return;
		}
		if (origin === "current" && geo?.source !== "current_location") {
			setError(locError || "Use my current location, or choose a place.");
			return;
		}
		if (origin === "choose" && !(geo?.source === "manual" && geo.latitude != null && geo.longitude != null)) {
			setError("Select a place from the search results.");
			return;
		}
		setError("");
		setSearchStatus("");
		setPick(null);
		setChosenId("");
		setHits([]);
		setPool([]);
		setShowMore(false);
		setForcedIds([]);
		setNote(walk < 25 ? "Checking walking routes…" : "Checking the map…");
		const here = activePoint();
		const placeName = origin === "home" ? home?.name || homeName : origin === "office" ? office?.name || officeName : "";
		const queryAddress = address.trim() || (origin === "home" ? home?.address || "" : origin === "office" ? office?.address || "" : geo?.address || geo?.label || "");
		setPending(true);
		try {
			const result = await findMakan({ data: {
				text: `${meal} ${queryAddress} ${groupSize} pax ${diet} ${vibe}`.trim(),
				areaId: "",
				address: queryAddress,
				groupSize,
				minutes: walk,
				budget: spend,
				dietary: dietApi(diet),
				mood: vibe,
				timing,
				explain: true,
				latitude: here?.lat ?? null,
				longitude: here?.lng ?? null,
				originName: geo?.label || placeName || "",
				savedPlaces: favs.filter((fav) => Number.isFinite(fav.lat) && Number.isFinite(fav.lng)).slice(0, 24).map((fav) => ({
					id: fav.id,
					name: fav.name,
					address: fav.address,
					latitude: fav.lat,
					longitude: fav.lng,
					cuisine: fav.cuisine ?? "",
					placeKind: fav.placeKind ?? ""
				})),
				originSource: origin,
				allowDistance: override?.allowDistance ?? false,
				cuisines: chosenCuisines,
				placeTypes: chosenPlaces
			} });
			setResolvedFrom(result.originAddress || result.originLabel || queryAddress);
			setOriginLabel(placeName || result.originLabel || queryAddress);
			setSearchStatus(result.status);
			if (result.status === "ok" || result.status === "distance") {
				setHits(result.hits);
				setPool(result.hits);
				setNote(result.note);
				setError("");
			} else {
				setHits([]);
				setPool([]);
				setNote(result.note);
				setError("");
			}
		} catch (err) {
			setHits([]);
			setPool([]);
			setSearchStatus("routes");
			setNote(err instanceof Error ? err.message : "Walking routes are temporarily unavailable.");
		} finally {
			setPending(false);
		}
	}
	function toggleCuisine(id) {
		setCuisines((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
	}
	function togglePlace(id) {
		setPlaceTypes((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
	}
	function toggleFav(hit) {
		const key = favKey(hit);
		const exists = favs.some((fav) => favKey(fav) === key);
		const next = exists ? favs.filter((fav) => favKey(fav) !== key) : [{
			id: hit.id,
			name: hit.name,
			address: hit.address,
			mapsUrl: hit.mapsUrl,
			lat: hit.lat,
			lng: hit.lng,
			cuisine: hit.cuisine,
			placeKind: hit.placeKind,
			cuisines: hit.cuisines,
			minutes: "minutes" in hit ? hit.minutes : void 0,
			verified: "verified" in hit ? hit.verified : void 0
		}, ...favs].slice(0, 24);
		setFavs(next);
		writeFavs(next);
		toast.success(exists ? "Removed from favourites" : "Saved on this browser");
	}
	function editFilters() {
		document.getElementById("makan-form")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}
	function onSpin() {
		if (origin === "office" && !office) {
			setError("Office location not set.");
			return;
		}
		if (origin === "home" && !home) {
			setError("Home location not set.");
			return;
		}
		const source = pool.length ? pool : hits;
		const next = spinOne(source, pick?.id);
		if (!next) {
			setError("Find makan first. Roulette only spins places already inside the walk.");
			return;
		}
		if (!pool.length) {
			setPool(source);
			setHits(source);
			setOriginLabel(geo?.label || address.trim() || office?.name || home?.name || "");
		}
		setPick(next);
		setChosenId(next.id);
		setError("");
		setNote("Enough discussion. The universe has chosen.");
	}
	function saveIcs(hit) {
		const start = mealStart(event, timing);
		const end = new Date(start.getTime() + 36e5);
		const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
		const ics = [
			"BEGIN:VCALENDAR",
			"VERSION:2.0",
			"PRODID:-//Kairos//EN",
			"BEGIN:VEVENT",
			`DTSTART:${stamp(start)}`,
			`DTEND:${stamp(end)}`,
			`SUMMARY:${`Makan · ${hit.name}`.replace(/[\n,;]/g, " ")}`,
			`LOCATION:${`${hit.name}, ${hit.address}`.replace(/[\n,;]/g, " ")}`,
			`DESCRIPTION:${hit.why.replace(/[\n,;]/g, " ")}`,
			"END:VEVENT",
			"END:VCALENDAR"
		].join("\r\n");
		const blob = new Blob([ics], { type: "text/calendar" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "kairos-makan.ics";
		link.click();
		window.setTimeout(() => URL.revokeObjectURL(url), 1500);
	}
	const follow = event?.slots[0] ? mealFollowOn(event.place, event.slots[0].startsAt, event.durationMin) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		id: "makan-form",
		className: "lg:col-span-2",
		onSubmit: (eventForm) => {
			eventForm.preventDefault();
			onFind();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-gold",
				children: "1 · SET THE MAKAN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-2xl text-cream",
				children: "Where are we eating from?"
			}),
			event ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-mute",
				children: [
					"From ",
					event.title,
					follow ? ` · ${follow.title.replace("?", "")}` : "",
					placeSummary(event.place) ? ` · ${placeSummary(event.place)}` : ""
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
						on: origin === "meeting",
						onClick: () => chooseOrigin("meeting"),
						children: "Meeting location"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
						on: origin === "office",
						onClick: () => chooseOrigin("office"),
						children: "Office"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
						on: origin === "home",
						onClick: () => chooseOrigin("home"),
						children: "Home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
						on: origin === "current",
						disabled: locating,
						onClick: () => chooseOrigin("current"),
						children: locating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								className: "size-3.5",
								"aria-hidden": true
							}), "Finding you..."]
						}) : geo?.source === "current_location" && origin === "current" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "size-3.5",
								"aria-hidden": true
							}), "Current location"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								className: "size-3.5",
								"aria-hidden": true
							}), "Use my current location"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
						on: origin === "choose",
						onClick: () => chooseOrigin("choose"),
						children: "Choose location"
					})
				]
			}),
			origin === "meeting" ? meetingText() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-cream",
				children: geo?.source === "meeting_location" ? geo.label || meetingText() : meetingText()
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-mute",
				children: "No physical meeting location available."
			}) : null,
			origin === "current" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 rounded-xl bg-ink px-3 py-3 ring-1 ring-line",
				children: locating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-cream",
					children: "Finding you..."
				}) : locError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-sm text-vermilion",
						children: locError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mute",
						children: locKind === "denied" ? "Choose an area instead." : "Choose a location instead."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [locKind === "timeout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: requestCurrentLocation,
							className: "press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
							children: "Try again"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => chooseOrigin("choose"),
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
							children: "Choose location"
						})]
					})
				] }) : geo?.source === "current_location" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-cream",
						children: geo.label || "Current location detected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mute",
						children: "Used only to find places nearby."
					}),
					approximate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-gold",
							children: "Location is approximate."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => chooseOrigin("choose"),
							className: "press mt-2 text-sm font-semibold text-cream",
							children: "Choose location instead"
						})]
					}) : null
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-mute",
					children: "Used only to find places nearby."
				})
			}) : origin === "office" || origin === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-xl bg-ink px-3 py-3 ring-1 ring-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-gold",
						children: origin === "office" ? "OFFICE" : "HOME"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mute",
						children: origin === "office" ? office ? `${office.name}. ${office.address}` : "Office location not set." : home ? `${home.name}. ${home.address}` : "Home location not set."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: origin === "office" ? officeName : homeName,
						onChange: (input) => origin === "office" ? setOfficeName(input.target.value) : setHomeName(input.target.value),
						placeholder: origin === "office" ? "Office name" : "Home name",
						maxLength: 80,
						className: clsx(fieldClass, "mt-3")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: address,
						onChange: (input) => setAddress(input.target.value),
						placeholder: "Street or building",
						maxLength: 160,
						className: clsx(fieldClass, "mt-2")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void savePlace(origin === "home" ? "home" : "office"),
						className: "press mt-3 min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
						children: origin === "office" ? office ? "Update office location" : "Set office location" : home ? "Update home" : "Set home location"
					})
				]
			}) : origin === "choose" ? geo?.source === "manual" && geo.latitude != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-xl bg-ink px-3 py-3 ring-1 ring-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-gold",
						children: "SEARCHING FROM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-semibold text-cream",
						children: geo.label
					}),
					geo.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mute",
						children: geo.address
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: clearManual,
						className: "press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
						children: "Change"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: lookup,
						onChange: (input) => {
							setLookup(input.target.value);
							if (geo?.source === "manual") setGeo(null);
						},
						onKeyDown: (input) => {
							if (input.key === "Enter") {
								input.preventDefault();
								runLookup();
							}
						},
						placeholder: "Search building, mall, MRT or address...",
						maxLength: 120,
						className: fieldClass
					}),
					lookingUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-mute",
						children: "Searching places..."
					}) : null,
					lookups.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 space-y-2",
						children: lookups.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-ink px-3 py-3 ring-1 ring-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-cream",
									children: hit.name || hit.label
								}),
								hit.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-mute",
									children: hit.address
								}) : null,
								hit.kind ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-cream",
									children: hit.kind
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => pickManual(hit),
									className: "press mt-3 min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
									children: "Select"
								})
							]
						}, `${hit.providerId || hit.label}-${hit.latitude}`))
					}) : null,
					lookupMiss && !lookingUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-xl bg-ink px-3 py-3 ring-1 ring-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-cream",
							children: "We couldn't find that place."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: clearManual,
								className: "press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
								children: "Try another search"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => chooseOrigin("current"),
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
								children: "Use current location"
							})]
						})]
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "When?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: MEALS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
					on: meal === item.id,
					onClick: () => setMeal(item.id),
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-4 block text-sm font-medium text-cream",
				htmlFor: "makan-pax",
				children: "Group size"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "makan-pax",
				type: "number",
				min: 1,
				max: 40,
				value: groupSize,
				onChange: (input) => setGroupSize(Math.max(1, Math.min(40, Number(input.target.value) || 1))),
				className: clsx(fieldClass, "mt-2 max-w-32")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Budget"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: BUDGETS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
					on: budget === item.id,
					onClick: () => setBudget(item.id),
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Dietary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: DIETS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
					on: dietary === item.id,
					onClick: () => setDietary(item.id),
					children: item.label
				}, item.id || "none"))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "How far?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: WALKS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
					on: minutes === item.id,
					onClick: () => setMinutes(item.id),
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "What do you feel like?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
						on: cuisines.length === 0,
						onClick: () => setCuisines([]),
						children: "Any"
					}),
					CUISINE_OPTIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
						on: cuisines.includes(item.id),
						onClick: () => toggleCuisine(item.id),
						children: cuisines.includes(item.id) ? `${item.label} ✓` : item.label
					}, item.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
						on: moreCuisine || MORE_CUISINES.some((item) => cuisines.includes(item.id)),
						onClick: () => setMoreCuisine((open) => !open),
						children: "More"
					}),
					moreCuisine || MORE_CUISINES.some((item) => cuisines.includes(item.id)) ? MORE_CUISINES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
						on: cuisines.includes(item.id),
						onClick: () => toggleCuisine(item.id),
						children: cuisines.includes(item.id) ? `${item.label} ✓` : item.label
					}, item.id)) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "What kind of place?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
					on: placeTypes.length === 0,
					onClick: () => setPlaceTypes([]),
					children: "Any"
				}), PLACE_TYPES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
					on: placeTypes.includes(item.id),
					onClick: () => togglePlace(item.id),
					children: placeTypes.includes(item.id) ? `${item.label} ✓` : item.label
				}, item.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Vibe"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: MOODS.filter((item) => item.id).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
					on: mood === item.id,
					onClick: () => setMood(item.id),
					children: item.label
				}, item.id))
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mt-4 text-sm text-vermilion",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: pending,
				className: "press mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-vermilion text-base font-semibold text-cream disabled:opacity-50",
				children: pending ? "Looking around…" : "Find makan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onSpin,
				className: "press mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-panel text-sm font-semibold text-gold ring-1 ring-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, {
					className: "size-4",
					"aria-hidden": true
				}), pick ? "Spin again" : "Makan roulette"]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "lg:col-span-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "kairos-result",
			className: "rounded-2xl bg-panel p-5 shadow-card sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-gold",
					children: "LOCATION + GROUP + APPETITE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 max-w-xl font-sans text-3xl font-semibold leading-tight text-cream sm:text-4xl",
					children: "Find somewhere nearby that fits the group — before someone says “anything lah”."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor$3, {
							kicker: "LOCATION FIT",
							tone: "jade",
							value: walkLabel,
							note: resolvedFrom ? `Searching from: ${originWord} · ${resolvedFrom}` : "From the place you named."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor$3, {
							kicker: "GROUP FIT",
							tone: "cream",
							value: `${groupSize} pax`,
							note: dietLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor$3, {
							kicker: "MEAL FIT",
							tone: "gold",
							value: MEALS.find((item) => item.id === meal)?.label ?? "Lunch",
							note: budgetCopy(budget)
						})
					]
				}),
				searchStatus === "ok" || searchStatus === "filters" || searchStatus === "distance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center gap-2 text-sm text-cream",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-ink px-3 py-1",
							children: minutes < 25 ? `${minutes} min walk` : "Short ride"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-ink px-3 py-1",
							children: cuisines.length ? cuisines.map(cuisineLabel).join(" + ") : "Any cuisine"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-ink px-3 py-1",
							children: placeTypes.length ? placeTypes.map((item) => placeKindLabel(item)).join(" + ") : "Any place"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-ink px-3 py-1",
							children: budget === 1 ? "≤$10/pax" : budget === 2 ? "$10–$20/pax" : "Any budget"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-ink px-3 py-1",
							children: dietary ? dietLabel : "No dietary restriction"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: editFilters,
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-gold",
							children: "Edit filters"
						})
					]
				}) : null,
				cards.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-xl bg-ink px-4 py-4",
					children: [resolvedFrom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-cream",
						children: [
							"Searching from: ",
							originWord,
							" · ",
							resolvedFrom
						]
					}) : null, emptyStatus === "geocode" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-cream",
						children: origin === "home" ? "We couldn't locate your saved home." : origin === "office" ? "We couldn't locate your saved office." : "We couldn't find that place."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: origin === "office" || origin === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => chooseOrigin(origin),
							className: "press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
							children: origin === "home" ? "Update home" : "Update office location"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								clearManual();
								chooseOrigin("choose");
							},
							className: "press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
							children: "Try another search"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => chooseOrigin("current"),
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
							children: "Use current location"
						})] })
					})] }) : emptyStatus === "routes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-cream",
						children: "Walking routes are temporarily unavailable."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void onFind(),
								className: "press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
								children: "Try again"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => chooseOrigin("choose"),
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
								children: "Choose another location"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void onFind({ allowDistance: true }),
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
								children: "Show nearby by distance instead"
							})
						]
					})] }) : emptyStatus === "walk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-cream",
						children: [
							"No suitable places found within a ",
							minutes,
							"-minute walk."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [minutes < 15 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void onFind({ minutes: minutes === 5 ? 10 : 15 }),
							className: "press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
							children: [
								"Expand to ",
								minutes === 5 ? 10 : 15,
								" min"
							]
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => chooseOrigin("choose"),
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
							children: "Choose another location"
						})]
					})] }) : emptyStatus === "filters" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-cream",
							children: "No places matched all your filters."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-2 space-y-1 text-sm text-mute",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"≤",
									minutes,
									" min walk"
								] }),
								cuisines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: cuisines.map(cuisineLabel).join(" + ") }) : null,
								placeTypes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: placeTypes.map((item) => placeKindLabel(item)).join(" + ") }) : null,
								budget === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "≤$10/pax" }) : budget === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "$10–$20/pax" }) : null,
								dietary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: dietLabel }) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								minutes < 15 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void onFind({ minutes: minutes === 5 ? 10 : 15 }),
									className: "press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
									children: [
										"Expand to ",
										minutes === 5 ? 10 : 15,
										" min"
									]
								}) : null,
								cuisines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void onFind({ cuisines: [] }),
									className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
									children: "Clear cuisine"
								}) : null,
								placeTypes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void onFind({ placeTypes: [] }),
									className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
									children: "Clear place type"
								}) : null,
								budget !== 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void onFind({ budget: 0 }),
									className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
									children: "Increase budget"
								}) : null,
								dietary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void onFind({ dietary: "" }),
									className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
									children: "Clear dietary"
								}) : null
							]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-cream",
							children: "PREPARING THE SEARCH"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-1 text-sm text-cream",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Searching from: ", fromLabel] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									MEALS.find((item) => item.id === meal)?.label,
									" window: ",
									mealWindow(meal)
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									groupSize,
									" people · ",
									walkLabel,
									" · ",
									budgetCopy(budget),
									dietary ? ` · ${dietLabel}` : ""
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-mute",
							children: note || "Real places only. Kairos will not invent a restaurant."
						})
					] })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
							mode: "makan",
							text: `${groupSize} people, ${walkLabel.replace(" walk", "")}, ${budgetCopy(budget).toLowerCase()}. I've narrowed the argument down.`
						}),
						pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-gold",
							children: "Enough discussion. The universe has chosen."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-cream",
								children: cards.length === 1 ? "1 match found in Kairos's current place sources." : `${cards.length} matches found in Kairos's current place sources.`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: "Not every food place nearby is in these sources."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: sortMode === "closest" ? "Closest verified walks" : sortMode === "random" ? "One place from the filtered shortlist" : sortMode === "favourites" ? "Saved places that still fit" : "Best match for this group"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									["closest", "Closest"],
									["match", "Best match"],
									["random", "Random"],
									["favourites", "Favourites"]
								].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$3, {
									on: sortMode === id,
									onClick: () => {
										if (id === "random") setRandomSeed((seed) => seed + 1);
										setSortMode(id);
									},
									children: label
								}, id))
							})
						] }),
						visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-cream",
							children: "No saved favourites fit these filters."
						}) : null,
						visible.map((hit, index) => {
							const kind = placeKindLabel(hit.placeKind);
							const meta = [(hit.cuisines ?? []).slice(0, 2).map(cuisineLabel).join(" · "), kind].filter(Boolean).join(" · ");
							const saved = favs.some((fav) => favKey(fav) === favKey(hit));
							const knownPrice = hit.approxSgd != null || hit.price > 0 ? priceLabel(hit.price, hit.approxSgd) : "";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-xl bg-ink px-4 py-4",
								children: [
									pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold tracking-brand text-gold",
										children: "KAIROS PICK"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-2xl text-cream",
										children: pick ? hit.name : `${index + 1} · ${hit.name}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-cream",
										children: searchStatus === "distance" || !hit.verified ? `${hit.meters} m straight line` : `${hit.minutes} min walk`
									}),
									meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-cream",
										children: meta
									}) : null,
									knownPrice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-cream",
										children: knownPrice
									}) : null,
									hit.openingHours ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-mute",
										children: ["Hours: ", hit.openingHours]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-sm text-mute",
										children: ["Why Kairos picked it: ", pick ? hit.why : resultBlurb(hit, matchContext, {
											favourite: saved,
											rank: index,
											mode: sortMode
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 flex flex-wrap gap-2",
										children: pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: hit.mapsUrl,
											target: "_blank",
											rel: "noreferrer",
											className: "press inline-flex min-h-11 items-center rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
											children: "Go here"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setChosenId(hit.id),
												className: "press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
												children: "View"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: hit.mapsUrl,
												target: "_blank",
												rel: "noreferrer",
												className: "press inline-flex min-h-11 items-center rounded-xl bg-ink px-3 text-sm font-semibold text-cream ring-1 ring-line",
												children: "Directions"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => toggleFav(hit),
												className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
												children: saved ? "★ Saved" : "★ Save"
											})
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalActions, { input: {
										mode: "makan",
										kind: "restaurant",
										countryCode: "SG",
										navMode: "walk",
										from: geo?.latitude != null && geo.longitude != null ? {
											lat: geo.latitude,
											lng: geo.longitude,
											name: geo.label || "Start"
										} : void 0,
										place: {
											id: hit.id,
											name: hit.name,
											address: hit.address,
											city: hit.area || "Singapore",
											countryCode: "SG",
											lat: hit.lat,
											lng: hit.lng
										}
									} }),
									pick || chosen?.id === hit.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => saveIcs(hit),
											className: "press min-h-11 rounded-xl bg-panel px-3 text-sm font-semibold text-cream ring-1 ring-line",
											children: "Add to calendar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												const move = hit.verified ? `${hit.minutes} min walk` : `${hit.meters} m straight line`;
												const blurb = [
													hit.name,
													move,
													meta,
													knownPrice,
													hit.openingHours ? `Hours: ${hit.openingHours}` : "",
													hit.address,
													hit.mapsUrl
												].filter(Boolean).join("\n");
												navigator.clipboard.writeText(blurb).then(() => toast.success("Shared text copied"), () => toast.message("Copy did not land. The name is on screen."));
											},
											className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream",
											children: "Share with group"
										})]
									}) : null
								]
							}, hit.id);
						}),
						!pick && sortMode !== "random" && sorted.length > 8 && !showMore ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowMore(true),
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-gold",
							children: "Show more"
						}) : null,
						forcedFavs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-gold",
								children: "USING ANYWAY"
							}), forcedFavs.map((fav) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-xl bg-ink px-4 py-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-2xl text-cream",
										children: fav.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-mute",
										children: "Outside the current filters. Not rechecked as a verified walk for this search."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: fav.mapsUrl,
										target: "_blank",
										rel: "noreferrer",
										className: "press mt-3 inline-flex min-h-11 items-center rounded-xl bg-ink px-3 text-sm font-semibold text-cream ring-1 ring-line",
										children: "Directions"
									})
								]
							}, fav.id))]
						}) : null,
						outsideFavs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-ink px-4 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-cream",
								children: "Favourite, but outside your current filters"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-3",
								children: outsideFavs.map((fav) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-cream",
											children: fav.name
										}),
										fav.verified && fav.minutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-mute",
											children: [fav.minutes, " min walk"]
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-mute",
											children: ["Current limit: ", minutes < 25 ? `${minutes} min walk` : "short ride"]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setForcedIds((current) => current.includes(favKey(fav)) ? current : [...current, favKey(fav)]),
										className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
										children: "Use anyway"
									})]
								}, fav.id))
							})]
						}) : null,
						pick ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onSpin,
							className: "press inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, {
								className: "size-4",
								"aria-hidden": true
							}), "Spin again"]
						}) : null,
						note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-mute",
							children: note
						}) : null
					]
				})
			]
		})
	})] });
}
function Factor$3({ kicker, value, note, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: clsx("border-l-2 pl-3", tone === "jade" ? "border-jade" : tone === "gold" ? "border-gold" : "border-cream"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: clsx("text-xs font-semibold tracking-brand", tone === "jade" ? "text-jade" : tone === "gold" ? "text-gold" : "text-cream"),
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-lg font-semibold text-cream",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: note
			})
		]
	});
}
function Chip$3({ on, onClick, children, disabled = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		disabled,
		onClick,
		className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold disabled:opacity-50", on ? "bg-jade text-ink" : "bg-panel text-cream ring-1 ring-line"),
		children
	});
}
function mealStart(event, timing) {
	const slot = event?.slots[0];
	if (slot && event) {
		const start = new Date(slot.startsAt);
		const shift = timing === "before" ? -75 : event.durationMin + 15;
		return new Date(start.getTime() + shift * 6e4);
	}
	const now = /* @__PURE__ */ new Date();
	return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 4, 30));
}
var VOICE = {
	dating: { mode: "dating" },
	travel: {
		mode: "travel",
		label: "Kairos · Away"
	},
	family: { mode: "family" },
	team_out: { mode: "out" }
};
function PlanningBrief({ mode, kicker, question, hint, placeholder, value, onChange, onUnderstand, reading, failed, chips, onRemove, aside, conflicts, onKeep, onUse }) {
	const voice = VOICE[mode];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold tracking-brand text-accent",
			children: kicker
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-1 font-display text-2xl text-cream",
			children: question
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-mute",
			children: hint
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value,
			rows: 4,
			maxLength: 500,
			placeholder,
			onChange: (event) => onChange(event.target.value),
			onKeyDown: (event) => {
				if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
					event.preventDefault();
					onUnderstand();
				}
			},
			className: "mt-4 w-full rounded-xl bg-ink px-3 py-3 text-base text-cream ring-1 ring-line outline-none placeholder:text-mute"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: reading ? "Understanding your brief…" : "Kairos reads this, then the form follows."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onUnderstand,
				className: "press min-h-11 shrink-0 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
				children: "Understand my brief"
			})]
		}),
		failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-cream",
			children: "Couldn’t fully understand that brief."
		}) : null,
		chips.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: "KAIROS UNDERSTOOD"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: chips.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onRemove(chip),
						className: "press min-h-11 rounded-xl bg-ink px-3 text-sm capitalize text-cream ring-1 ring-accent",
						children: [
							chip.label,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-mute",
								children: "×"
							})
						]
					}, chip.id))
				}),
				conflicts?.map((conflict) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-cream",
					children: [
						"Your brief suggests ",
						conflict.suggested,
						", but you selected ",
						conflict.current,
						".",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onKeep?.(conflict.key),
							className: "ml-2 font-semibold text-accent",
							children: ["Keep ", conflict.current]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onUse?.(conflict.key),
							className: "ml-2 font-semibold text-accent",
							children: "Use brief"
						})
					]
				}, conflict.key)),
				aside ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
						mode: voice.mode,
						label: voice.label,
						text: aside
					})
				}) : null
			]
		}) : null
	] });
}
var parsePlanBrief = createServerFn({ method: "POST" }).validator((input) => object({
	mode: _enum([
		"dating",
		"travel",
		"family",
		"team_out"
	]),
	text: string().max(500),
	today: string().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(input)).handler(createSsrRpc("5002368017319ec0c13fcbb04b20eb1a6773c33d12c79501e4b9c12733863aae"));
var ENERGY = [
	{
		id: "low",
		label: "Chill"
	},
	{
		id: "moderate",
		label: "Moderate"
	},
	{
		id: "high",
		label: "Active"
	}
];
var SETTINGS = [
	{
		id: "indoor",
		label: "Indoor"
	},
	{
		id: "outdoor",
		label: "Outdoor"
	},
	{
		id: "either",
		label: "Either"
	}
];
var WINDOWS = [
	"Friday afternoon",
	"After work",
	"Morning",
	"This week"
];
var SPEND = [
	{
		id: "under10",
		label: "<$10",
		budget: 9,
		budgetMin: 0
	},
	{
		id: "mid",
		label: "$10–$20",
		budget: 20,
		budgetMin: 10
	},
	{
		id: "any",
		label: "Any",
		budget: 200,
		budgetMin: 0
	}
];
function OutStudio() {
	const navigate = useNavigate();
	const [text, setText] = (0, import_react.useState)("");
	const [where, setWhere] = (0, import_react.useState)("office");
	const [areaId, setAreaId] = (0, import_react.useState)("");
	const [groupSize, setGroupSize] = (0, import_react.useState)(20);
	const [spend, setSpend] = (0, import_react.useState)("any");
	const [groupTouched, setGroupTouched] = (0, import_react.useState)(false);
	const [energy, setEnergy] = (0, import_react.useState)("");
	const [setting, setSetting] = (0, import_react.useState)("");
	const [when, setWhen] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [concepts, setConcepts] = (0, import_react.useState)([]);
	const [origin, setOrigin] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [polling, setPolling] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("");
	const [roll, setRoll] = (0, import_react.useState)(0);
	const [rolled, setRolled] = (0, import_react.useState)(null);
	const [office, setOffice] = (0, import_react.useState)(null);
	const [officeName, setOfficeName] = (0, import_react.useState)("");
	const [officeAddress, setOfficeAddress] = (0, import_react.useState)("");
	const [readingBrief, setReadingBrief] = (0, import_react.useState)(false);
	const [briefFailed, setBriefFailed] = (0, import_react.useState)(false);
	const [teamIntent, setTeamIntent] = (0, import_react.useState)(null);
	const [hiddenBrief, setHiddenBrief] = (0, import_react.useState)([]);
	const [briefLocks, setBriefLocks] = (0, import_react.useState)({});
	const [budgetEach, setBudgetEach] = (0, import_react.useState)(null);
	const [briefConflicts, setBriefConflicts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const saved = readOffice();
		if (!saved) return;
		setOffice(saved);
		setOfficeName(saved.name);
		setOfficeAddress(saved.address);
		if (saved.areaId) setAreaId(saved.areaId);
	}, []);
	const live = (0, import_react.useMemo)(() => parseOuting(text), [text]);
	function lockBrief(key) {
		setBriefLocks((current) => ({
			...current,
			[key]: true
		}));
	}
	function applyTeam(parsed, locks = briefLocks) {
		setTeamIntent(parsed);
		const conflicts = [];
		if (parsed.groupSize) {
			if ((locks.group || groupTouched) && parsed.groupSize !== groupSize) conflicts.push({
				key: "group",
				suggested: `${parsed.groupSize} people`,
				current: `${groupSize} people`
			});
			else if (!locks.group && !groupTouched) setGroupSize(parsed.groupSize);
		}
		if (parsed.whenLabel) {
			if (locks.when && parsed.whenLabel !== when) conflicts.push({
				key: "when",
				suggested: parsed.whenLabel,
				current: when || "unset"
			});
			else if (!locks.when) setWhen(parsed.whenLabel);
		}
		if (parsed.budgetPerPerson) {
			if (locks.budget && parsed.budgetPerPerson !== budgetEach) conflicts.push({
				key: "budget",
				suggested: `≤ $${parsed.budgetPerPerson}`,
				current: budgetEach ? `≤ $${budgetEach}` : spend
			});
			else if (!locks.budget) setBudgetEach(parsed.budgetPerPerson);
		}
		if (parsed.intensity === "low") {
			if (locks.energy && energy !== "low") conflicts.push({
				key: "energy",
				suggested: "Not too physical",
				current: energy || "unset"
			});
			else if (!locks.energy) setEnergy("low");
		}
		if (parsed.areaId) {
			if (!locks.area) {
				setWhere("area");
				setAreaId(parsed.areaId);
			}
		}
		setBriefConflicts(conflicts);
	}
	function understandTeam() {
		const query = text.trim();
		if (query.length < 8) return;
		setReadingBrief(true);
		setBriefFailed(false);
		parsePlanBrief({ data: {
			mode: "team_out",
			text: query,
			today: new Intl.DateTimeFormat("en-CA", {
				timeZone: "Asia/Singapore",
				year: "numeric",
				month: "2-digit",
				day: "2-digit"
			}).format(/* @__PURE__ */ new Date())
		} }).then((result) => {
			if (result.mode !== "team_out") return;
			const parsed = result.intent;
			if (!parsed.groupSize && !parsed.whenLabel && !parsed.budgetPerPerson && !parsed.areaIntent) {
				setBriefFailed(true);
				return;
			}
			applyTeam(parsed);
		}).catch(() => setBriefFailed(true)).finally(() => setReadingBrief(false));
	}
	const shownEnergy = energy || (text.trim().length > 8 ? live.energy : "moderate");
	const shownWhen = when || live.when;
	const spendChoice = SPEND.find((item) => item.id === spend) ?? SPEND[2];
	const areaLabel = AREAS.find((area) => area.id === areaId)?.label || (where === "anywhere" ? "Anywhere" : office?.name || "Near the office");
	const looking = lookingFor(live, setting, shownEnergy);
	async function onShape() {
		const line = text.trim();
		if (line.length < 8) {
			setError("Say who, roughly when, and what you do not want.");
			return;
		}
		setError("");
		const extra = [
			shownWhen,
			setting === "indoor" ? "indoor" : setting === "outdoor" ? "outdoor" : "",
			shownEnergy === "low" ? "chill" : shownEnergy === "high" ? "active" : "moderate energy"
		].filter(Boolean).join(", ");
		const packed = extra ? `${line}. ${extra}` : line;
		const localOrigin = where === "anywhere" ? null : originFromArea(where === "office" ? office?.areaId || areaId : areaId, `${packed} ${office?.address ?? ""}`);
		const localBrief = {
			...parseOuting(packed),
			areaId: where === "anywhere" ? "" : office?.areaId || areaId,
			groupSize,
			budget: budgetEach ?? spendChoice.budget,
			budgetMin: budgetEach ? 0 : spendChoice.budgetMin
		};
		setConcepts(buildConcepts(localOrigin, localBrief));
		setOrigin(localOrigin?.label || areaLabel);
		setRoll(0);
		setRolled({
			origin: localOrigin,
			brief: localBrief
		});
		setPending(true);
		try {
			const result = await findOuting({ data: {
				text: packed,
				areaId: where === "anywhere" ? "" : office?.areaId || areaId,
				groupSize,
				budget: budgetEach ?? spendChoice.budget,
				budgetMin: budgetEach ? 0 : spendChoice.budgetMin
			} });
			setConcepts(result.concepts);
			setOrigin(result.originLabel);
			setSource(result.source);
			setRoll(0);
			setRolled({
				origin: localOrigin,
				brief: result.brief
			});
			if (result.concepts.length === 0) setError("Nothing real fit that brief. Widen the area or the budget.");
		} catch (err) {
			if (concepts.length === 0) setError(err instanceof Error ? err.message : "The brief did not land");
		} finally {
			setPending(false);
		}
	}
	function onReroll() {
		if (!rolled) return;
		const nextRoll = roll + 1;
		const next = buildConcepts(rolled.origin, rolled.brief, nextRoll);
		const same = next.map((concept) => concept.title).join("|") === concepts.map((concept) => concept.title).join("|");
		if (!next.length || same) {
			setError("That's the full list for this brief.");
			return;
		}
		setError("");
		setRoll(nextRoll);
		setConcepts(next);
		setSource("rules");
	}
	async function onPoll(concept) {
		setPolling(concept.id);
		try {
			const stop = concept.stops[0];
			const created = await createEvent({ data: {
				title: concept.title.slice(0, 80),
				kind: "meeting",
				durationMin: concept.hours >= 2 ? 120 : 90,
				category: "",
				slots: suggestMeetingSlots().slice(0, 3).map((startsAt) => ({
					startsAt,
					label: stop?.name ?? ""
				})),
				place: {
					format: "physical",
					venueName: stop?.name ?? "",
					room: "",
					address: stop?.address ?? "",
					platform: "",
					meetingUrl: "",
					makanWhen: concept.stops.length > 1 ? "after" : ""
				}
			} });
			toast.success("Poll is open");
			await navigate({
				to: "/meet/$code",
				params: { code: created.code }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not open the poll");
			setPolling("");
		}
	}
	text.trim().length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "lg:col-span-2",
		onSubmit: (event) => {
			event.preventDefault();
			onShape();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanningBrief, {
				mode: "team_out",
				kicker: "TEAM OUT",
				question: "What kind of team outing are we planning?",
				hint: "Tell Kairos the group, budget, timing and what kind of experience you want.",
				placeholder: "About 20 people next Friday afternoon. $50 each, something interactive, preferably central, and please not another dinner.",
				value: text,
				onChange: setText,
				onUnderstand: understandTeam,
				reading: readingBrief,
				failed: briefFailed,
				chips: teamIntent ? teamChips(teamIntent).filter((chip) => !hiddenBrief.includes(chip.id)) : [],
				onRemove: (chip) => {
					lockBrief(chip.lock);
					setHiddenBrief((current) => [...current, chip.id]);
				},
				aside: teamIntent?.aside ?? "",
				conflicts: briefConflicts,
				onKeep: (key) => setBriefConflicts((items) => items.filter((item) => item.key !== key)),
				onUse: (key) => {
					const next = {
						...briefLocks,
						[key]: false
					};
					setBriefLocks(next);
					if (key === "group") setGroupTouched(false);
					if (teamIntent) applyTeam(teamIntent, key === "group" ? next : {
						...next,
						group: groupTouched
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-cream",
							children: "Location"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: [
								["office", "Near office"],
								["area", "Choose area"],
								["anywhere", "Anywhere"]
							].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$2, {
								on: where === id,
								onClick: () => {
									lockBrief("area");
									setWhere(id);
								},
								children: label
							}, id))
						}),
						where === "area" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: AREAS.map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$2, {
								on: areaId === area.id,
								onClick: () => setAreaId(area.id === areaId ? "" : area.id),
								children: area.label
							}, area.id))
						}) : where === "office" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 rounded-xl bg-ink px-3 py-3 ring-1 ring-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-mute",
									children: office ? `Using ${office.name}. Saved on this browser.` : "No office saved yet. Add it once, then Near office has a place."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: officeName,
									onChange: (input) => setOfficeName(input.target.value),
									placeholder: "Office name",
									maxLength: 80,
									className: "mt-2 h-12 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: officeAddress,
									onChange: (input) => setOfficeAddress(input.target.value),
									placeholder: "Street or building",
									maxLength: 160,
									className: "mt-2 h-12 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: AREAS.map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$2, {
										on: areaId === area.id,
										onClick: () => setAreaId(area.id),
										children: area.label
									}, area.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										const name = officeName.trim() || officeAddress.trim();
										if (name.length < 3) {
											setError("Type the office building or street, then save it.");
											return;
										}
										const saved = {
											name: name.slice(0, 80),
											address: (officeAddress.trim() || name).slice(0, 160),
											areaId
										};
										writeOffice(saved);
										setOffice(saved);
										setError("");
										toast.success("Office saved on this browser");
									},
									className: "press mt-2 min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink",
									children: office ? "Update office" : "Save office"
								})
							]
						}) : null
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm text-cream",
							children: ["Group size", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 2,
								max: 80,
								value: groupSize,
								onChange: (input) => {
									lockBrief("group");
									setGroupTouched(true);
									setGroupSize(Math.max(2, Math.min(80, Number(input.target.value) || 2)));
								},
								className: "mt-1 block h-12 w-24 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm text-cream",
							children: ["Budget / pax", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap gap-2",
								children: [budgetEach ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$2, {
									on: true,
									onClick: () => {
										lockBrief("budget");
										setBudgetEach(null);
									},
									children: `≤ $${budgetEach}`
								}) : null, SPEND.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$2, {
									on: !budgetEach && spend === item.id,
									onClick: () => {
										lockBrief("budget");
										setBudgetEach(null);
										setSpend(item.id);
									},
									children: item.label
								}, item.id))]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-cream",
						children: "Time window"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: WINDOWS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$2, {
							on: when === item,
							onClick: () => {
								lockBrief("when");
								setWhen(when === item ? "" : item);
							},
							children: item
						}, item))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-cream",
						children: "Energy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: ENERGY.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$2, {
							on: shownEnergy === item.id,
							onClick: () => {
								lockBrief("energy");
								setEnergy(item.id);
							},
							children: item.label
						}, item.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-cream",
						children: "Indoor / outdoor"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: SETTINGS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$2, {
							on: setting === item.id,
							onClick: () => setSetting(item.id),
							children: item.label
						}, item.id))
					})] })
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mt-4 text-sm text-vermilion",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: pending,
				className: "press mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-vermilion text-base font-semibold text-cream disabled:opacity-50",
				children: pending ? "Reading the brief…" : "Find something worth doing"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "lg:col-span-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "kairos-result",
			className: "rounded-2xl bg-panel p-5 shadow-card sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-gold",
					children: "PEOPLE + PLACE + VIBE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 max-w-xl font-sans text-3xl font-semibold leading-tight text-cream sm:text-4xl",
					children: "Find something the department will actually want to turn up for."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor$2, {
							kicker: "GROUP FIT",
							tone: "jade",
							value: `${groupSize} pax`,
							note: areaLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor$2, {
							kicker: "PRACTICAL FIT",
							tone: "cream",
							value: budgetEach ? `≤ $${budgetEach}` : spendChoice.label === "Any" ? "Any" : spendChoice.label,
							note: teamIntent?.hours ? `${teamIntent.hours} hrs` : live.hours ? `${live.hours} hrs` : "A few hours"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor$2, {
							kicker: "VIBE FIT",
							tone: "gold",
							value: ENERGY.find((item) => item.id === shownEnergy)?.label ?? "Moderate",
							note: setting === "either" || !setting ? "Indoor or outdoor" : setting === "indoor" ? "Indoor" : "Outdoor"
						})
					]
				}),
				concepts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-xl bg-ink px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-cream",
							children: "KAIROS IS LOOKING FOR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-1 text-sm text-cream",
							children: looking.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-mute",
							children: "Real places only. Nothing here is booked, and prices are typical, not a quote."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
					mode: "out",
					text: roll > 0 ? "Okay. Another set. Still real places, still nobody in matching shirts." : "Something social, not too corporate, and nobody has to wear matching T-shirts."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-4 space-y-3",
					children: [
						concepts.map((concept, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl bg-ink px-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-semibold tracking-brand text-gold",
									children: [
										String(index + 1).padStart(2, "0"),
										" · ",
										concept.personality.toUpperCase()
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 font-display text-2xl text-cream",
									children: concept.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-mute",
									children: [
										concept.hours,
										" hrs · ~$",
										concept.approxSgd,
										"/pax · ",
										concept.pax,
										" pax",
										origin ? ` · ${origin}` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-cream",
									children: concept.why
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-2",
									children: concept.stops.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-mute",
										children: stop.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalActions, {
										heading: "VENUE",
										input: {
											mode: "out",
											kind: "venue",
											countryCode: "SG",
											from: rolled?.origin ? {
												lat: rolled.origin.lat,
												lng: rolled.origin.lng,
												name: origin || "Start"
											} : void 0,
											place: {
												id: stop.id,
												name: stop.name,
												address: stop.address,
												city: "Singapore",
												countryCode: "SG",
												lat: stop.lat,
												lng: stop.lng
											}
										}
									})] }, stop.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: polling === concept.id,
									onClick: () => void onPoll(concept),
									className: "press mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-vermilion font-semibold text-cream disabled:opacity-50",
									children: polling === concept.id ? "Opening the poll…" : "Need a date? Create a Kairos poll"
								})
							]
						}, concept.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onReroll,
							className: "press inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dices, {
								className: "size-4",
								"aria-hidden": true
							}), "Re-roll options"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-mute",
							children: ["Real places only", source === "grok" ? ". Kairos phrased the fit." : ". Rules picked the fit."]
						})
					]
				})] })
			]
		})
	})] });
}
function lookingFor(brief, setting, energy) {
	const lines = [
		"Creative workshop",
		"Light competitive activity",
		"Social outdoor option"
	];
	if (brief.styles.includes("creative") || brief.avoid.includes("corporate")) lines[0] = "Something memorable, not a town hall";
	if (energy === "low" || brief.styles.includes("chill")) lines[2] = "Easy conversation, low planning";
	if (energy === "high" || brief.styles.includes("competitive")) lines[1] = "Light competitive activity";
	if (setting === "indoor") lines[2] = "Indoor, rain does not cancel it";
	if (brief.avoid.includes("dinner-only")) lines.push("Not dinner-only");
	return lines.slice(0, 3);
}
function Factor$2({ kicker, value, note, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: clsx("border-l-2 pl-3", tone === "jade" ? "border-jade" : tone === "gold" ? "border-gold" : "border-cream"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: clsx("text-xs font-semibold tracking-brand", tone === "jade" ? "text-jade" : tone === "gold" ? "text-gold" : "text-cream"),
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-lg font-semibold text-cream",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: note
			})
		]
	});
}
function Chip$2({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", on ? "bg-gold text-ink" : "bg-panel text-cream ring-1 ring-line"),
		children
	});
}
var pin = object({
	placeId: string().max(80),
	kind: _enum([
		"activity",
		"lunch",
		"dinner"
	]),
	title: string().max(80),
	address: string().max(160),
	latitude: number().gte(-90).lte(90),
	longitude: number().gte(-180).lte(180),
	setting: _enum([
		"indoor",
		"outdoor",
		""
	])
});
var brief$1 = object({
	adults: number().int().min(1).max(8),
	ages: array(number().int().min(0).max(17)).max(6),
	when: string().trim().max(40).optional().default(""),
	date: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	location: string().trim().min(2).max(80),
	latitude: number().gte(-90).lte(90),
	longitude: number().gte(-180).lte(180),
	startAddress: string().trim().max(160).optional().default(""),
	endLabel: string().trim().min(2).max(80),
	endAddress: string().trim().max(160).optional().default(""),
	endLatitude: number().gte(-90).lte(90),
	endLongitude: number().gte(-180).lte(180),
	maxTravel: number().int().min(15).max(120),
	budget: number().int().min(0).max(500),
	freeOnly: boolean(),
	setting: _enum([
		"indoor",
		"outdoor",
		"either",
		"mix"
	]),
	interests: array(_enum(FAMILY_INTERESTS)).max(12),
	avoid: array(string().trim().max(40)).max(8).optional().default([]),
	toddler: boolean(),
	stroller: boolean(),
	mixedAge: boolean(),
	rainSafe: boolean(),
	wheelchair: boolean().optional().default(false),
	longWalk: boolean().optional().default(false),
	span: _enum([
		"short",
		"half",
		"full"
	]),
	pace: _enum([
		"relaxed",
		"balanced",
		"packed"
	]),
	travelMode: _enum([
		"drive",
		"transit",
		"ride",
		"walk"
	]),
	startMin: number().int().min(360).max(1200),
	endMin: number().int().min(420).max(1380),
	napStart: number().int().min(0).max(1440).nullable().optional().default(null),
	napEnd: number().int().min(0).max(1440).nullable().optional().default(null),
	booking: _enum([
		"any",
		"free",
		"nobook"
	]).optional().default("any"),
	rejected: array(string().max(80)).max(24).optional().default([]),
	locked: array(pin).max(8).optional().default([]),
	text: string().trim().max(500).optional().default("")
});
var planFamily = createServerFn({ method: "POST" }).validator((input) => brief$1.parse(input)).handler(createSsrRpc("58111672aec3173bfd11833461e7fb5ccbd2cc820f6a29108904fa740c9829e6"));
var savedStop = object({
	sequence: number().int().min(0).max(24),
	stopType: string().max(20),
	title: string().max(80),
	address: string().max(160),
	latitude: number().nullable(),
	longitude: number().nullable(),
	startTime: string().max(8),
	endTime: string().max(8),
	estimatedCost: number().nullable(),
	indoorOutdoor: string().max(12),
	sourceUrl: string().max(200).optional().default(""),
	sourceType: string().max(20),
	locked: boolean()
});
var saveFamilyPlan = createServerFn({ method: "POST" }).validator((input) => object({
	title: string().trim().min(2).max(80),
	startDate: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	startTime: string().max(8),
	endTime: string().max(8),
	startLocation: string().max(80),
	endLocation: string().max(80),
	adults: number().int(),
	childAges: array(number()),
	budget: number().int(),
	travelMode: string().max(20),
	pace: string().max(20),
	interests: array(string()).max(12),
	preferences: record(string(), string()).optional().default({}),
	familyScore: number().int().nullable(),
	stops: array(savedStop).max(24)
}).parse(input)).handler(createSsrRpc("d152135fd1003f620179e775225ccea9ff59c9fc2a519e08c53098fdfbb07aff"));
var INTEREST_LABEL = {
	animals: "Animals",
	science: "Science",
	dinosaurs: "Dinosaurs",
	art: "Art",
	crafts: "Craft",
	cars: "Cars",
	trains: "Trains",
	water: "Water play",
	sports: "Sports",
	nature: "Nature",
	characters: "Characters",
	playground: "Playground",
	performances: "Performances",
	festivals: "Festivals",
	food: "Food",
	technology: "Technology",
	books: "Books",
	museum: "Museums",
	cycling: "Cycling",
	games: "Games"
};
var AVOID = [
	["long-walks", "Long walks"],
	["museums", "Museums"],
	["crowds", "Crowds"],
	["water", "Water"],
	["noisy", "Very noisy"],
	["high-energy", "High energy"]
];
function sgtDate$1(offset = 0) {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(new Date(Date.now() + offset * 864e5));
}
function nextSaturday(offsetWeeks = 0) {
	const [year, month, day] = sgtDate$1(offsetWeeks * 7).split("-").map(Number);
	const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
	const weekday = date.getUTCDay();
	date.setUTCDate(date.getUTCDate() + (weekday === 6 ? 0 : 6 - weekday));
	return date.toISOString().slice(0, 10);
}
function dayName$1(date) {
	return new Intl.DateTimeFormat("en-SG", {
		weekday: "long",
		timeZone: "Asia/Singapore"
	}).format(/* @__PURE__ */ new Date(`${date}T12:00:00+08:00`));
}
function toTime(minutes) {
	return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
function fromTime(value) {
	const [hour, minute] = value.split(":").map(Number);
	return (hour || 0) * 60 + (minute || 0);
}
function loadSaved$1() {
	try {
		const raw = JSON.parse(localStorage.getItem("kairos-family-saved") ?? "[]");
		return Array.isArray(raw) ? raw.filter((item) => item && typeof item.latitude === "number").slice(0, 6) : [];
	} catch {
		return [];
	}
}
function homePoint() {
	const saved = readHome();
	if (!saved || typeof saved.latitude !== "number" || typeof saved.longitude !== "number") return null;
	return {
		label: saved.name || "Home",
		address: saved.address,
		latitude: saved.latitude,
		longitude: saved.longitude
	};
}
function FamilyStudio() {
	const [adults, setAdults] = (0, import_react.useState)(2);
	const [childCount, setChildCount] = (0, import_react.useState)(2);
	const [ages, setAges] = (0, import_react.useState)([3, 8]);
	const [date, setDate] = (0, import_react.useState)(nextSaturday);
	const [when, setWhen] = (0, import_react.useState)("This weekend");
	const [originKind, setOriginKind] = (0, import_react.useState)("home");
	const [origin, setOrigin] = (0, import_react.useState)(null);
	const [endKind, setEndKind] = (0, import_react.useState)("home");
	const [endPoint, setEndPoint] = (0, import_react.useState)(null);
	const [savedPlaces, setSavedPlaces] = (0, import_react.useState)([]);
	const [lookup, setLookup] = (0, import_react.useState)("");
	const [lookups, setLookups] = (0, import_react.useState)([]);
	const [endLookup, setEndLookup] = (0, import_react.useState)("");
	const [locating, setLocating] = (0, import_react.useState)(false);
	const [travelMode, setTravelMode] = (0, import_react.useState)("drive");
	const [maxTravel, setMaxTravel] = (0, import_react.useState)(30);
	const [span, setSpan] = (0, import_react.useState)("full");
	const [startMin, setStartMin] = (0, import_react.useState)(540);
	const [endMin, setEndMin] = (0, import_react.useState)(1140);
	const [pace, setPace] = (0, import_react.useState)("balanced");
	const [nap, setNap] = (0, import_react.useState)("");
	const [interests, setInterests] = (0, import_react.useState)([]);
	const [avoid, setAvoid] = (0, import_react.useState)([]);
	const [budget, setBudget] = (0, import_react.useState)(100);
	const [freeOnly, setFreeOnly] = (0, import_react.useState)(false);
	const [setting, setSetting] = (0, import_react.useState)("mix");
	const [stroller, setStroller] = (0, import_react.useState)(false);
	const [toddler, setToddler] = (0, import_react.useState)(false);
	const [rainSafe, setRainSafe] = (0, import_react.useState)(false);
	const [wheelchair, setWheelchair] = (0, import_react.useState)(false);
	const [longWalk, setLongWalk] = (0, import_react.useState)(false);
	const [booking, setBooking] = (0, import_react.useState)("any");
	const [more, setMore] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [weather, setWeather] = (0, import_react.useState)(null);
	const [stops, setStops] = (0, import_react.useState)([]);
	const [backup, setBackup] = (0, import_react.useState)(null);
	const [score, setScore] = (0, import_react.useState)(null);
	const [spend, setSpend] = (0, import_react.useState)(null);
	const [travelTotal, setTravelTotal] = (0, import_react.useState)(null);
	const [why, setWhy] = (0, import_react.useState)("");
	const [eventsNote, setEventsNote] = (0, import_react.useState)("");
	const [bookingNote, setBookingNote] = (0, import_react.useState)("");
	const [understood, setUnderstood] = (0, import_react.useState)([]);
	const [rejected, setRejected] = (0, import_react.useState)([]);
	const [locked, setLocked] = (0, import_react.useState)({});
	const [readingBrief, setReadingBrief] = (0, import_react.useState)(false);
	const [briefFailed, setBriefFailed] = (0, import_react.useState)(false);
	const [familyIntent, setFamilyIntent] = (0, import_react.useState)(null);
	const [hiddenBrief, setHiddenBrief] = (0, import_react.useState)([]);
	const [briefLocks, setBriefLocks] = (0, import_react.useState)({});
	const [briefConflicts, setBriefConflicts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setSavedPlaces(loadSaved$1());
		setOrigin(homePoint());
	}, []);
	const end = endKind === "start" ? origin : endKind === "home" ? homePoint() ?? origin : endPoint ?? origin;
	const young = ages.some((age) => age < 6);
	const ageLabel = ages.length ? ages.map((age) => `${age} yrs`).join(" + ") : "No children";
	function lockBrief(key) {
		setBriefLocks((current) => ({
			...current,
			[key]: true
		}));
	}
	async function applyFamily(parsed, locks = briefLocks) {
		setFamilyIntent(parsed);
		const conflicts = [];
		if (parsed.specificDate) {
			if (locks.date && parsed.specificDate !== date) conflicts.push({
				key: "date",
				suggested: parsed.specificDate,
				current: date
			});
			else if (!locks.date) {
				setDate(parsed.specificDate);
				setWhen(parsed.dateIntent === "tomorrow" ? "Tomorrow" : when);
			}
		}
		if (parsed.startMin != null && !locks.time) setStartMin(parsed.startMin);
		if (parsed.endMin != null) {
			if (locks.end && parsed.endMin !== endMin) conflicts.push({
				key: "end",
				suggested: "Home by 6",
				current: clockLabel(endMin)
			});
			else if (!locks.end) setEndMin(parsed.endMin);
		}
		if (parsed.indoorOutdoor) {
			if (locks.setting && parsed.indoorOutdoor !== setting) conflicts.push({
				key: "setting",
				suggested: parsed.indoorOutdoor,
				current: setting
			});
			else if (!locks.setting) setSetting(parsed.indoorOutdoor);
		}
		if (parsed.interests.length && !locks.interests) setInterests(parsed.interests);
		if (parsed.maxTravelMinutes != null && !locks.travel) setMaxTravel(parsed.maxTravelMinutes);
		if (parsed.travelMode && !locks.travel) setTravelMode(parsed.travelMode);
		if (parsed.pace && !locks.pace) setPace(parsed.pace);
		if (parsed.freeOnly && !locks.budget) setFreeOnly(true);
		if (parsed.stroller && !locks.stroller) setStroller(true);
		if (parsed.rainSafe && !locks.setting) setRainSafe(true);
		setBriefConflicts(conflicts);
		if (parsed.areaText && !locks.area) {
			setOriginKind("choose");
			setLookup(parsed.areaText);
			const points = (await lookupPlace({ data: { query: parsed.areaText } }).catch(() => [])).slice(0, 4).map((hit) => ({
				label: hit.name || hit.label,
				address: hit.address || hit.label,
				latitude: hit.latitude,
				longitude: hit.longitude
			}));
			setLookups(points);
			const match = points.find((point) => point.label.toLowerCase().includes(parsed.areaText.toLowerCase()));
			if (match) setOrigin(match);
		}
	}
	function understandFamily() {
		const query = text.trim();
		if (query.length < 8) return;
		setReadingBrief(true);
		setBriefFailed(false);
		parsePlanBrief({ data: {
			mode: "family",
			text: query,
			today: sgtDate$1()
		} }).then((result) => {
			if (result.mode !== "family") return;
			const parsed = result.intent;
			if (![
				parsed.dateIntent,
				parsed.indoorOutdoor,
				parsed.maxTravelMinutes,
				parsed.interests.length
			].filter(Boolean).length) {
				setBriefFailed(true);
				return;
			}
			return applyFamily(parsed);
		}).catch(() => setBriefFailed(true)).finally(() => setReadingBrief(false));
	}
	function setChildren(count) {
		const next = Math.max(0, Math.min(6, count));
		setChildCount(next);
		setAges((current) => Array.from({ length: next }, (_, index) => current[index] ?? 5));
	}
	function applyLength(next) {
		setSpan(next);
		if (next === "short") {
			setStartMin(600);
			setEndMin(780);
		} else if (next === "half") {
			setStartMin(600);
			setEndMin(900);
		} else {
			setStartMin(540);
			setEndMin(1140);
		}
	}
	async function search(query, which) {
		if (query.trim().length < 2) return;
		try {
			const points = (await lookupPlace({ data: { query } })).slice(0, 4).map((hit) => ({
				label: hit.name || hit.label,
				address: hit.address || hit.label,
				latitude: hit.latitude,
				longitude: hit.longitude
			}));
			setLookups(points);
			if (which === "end" && points[0]) setEndPoint(points[0]);
		} catch {
			setLookups([]);
		}
	}
	function useCurrent() {
		if (!navigator.geolocation) {
			setError("This browser cannot share a location.");
			return;
		}
		setLocating(true);
		navigator.geolocation.getCurrentPosition(async (position) => {
			try {
				const hit = await reversePlace({ data: {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				} });
				setOrigin({
					label: hit?.name || "Current location",
					address: hit?.address || hit?.label || "Current location",
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
				setOriginKind("current");
				setError("");
			} catch {
				setError("Kairos could not name that location.");
			} finally {
				setLocating(false);
			}
		}, () => {
			setLocating(false);
			setError("Location access was blocked. Choose a place instead.");
		}, {
			enableHighAccuracy: true,
			timeout: 1e4,
			maximumAge: 3e5
		});
	}
	function saveHome() {
		if (!origin) return;
		writeHome({
			name: "Home",
			address: origin.address || origin.label,
			areaId: "",
			latitude: origin.latitude,
			longitude: origin.longitude
		});
		setOrigin({
			...origin,
			label: "Home"
		});
		setOriginKind("home");
		toast.success("Home saved on this browser");
	}
	function rememberPlace() {
		if (!origin) return;
		const next = [origin, ...savedPlaces.filter((item) => item.label !== origin.label)].slice(0, 6);
		setSavedPlaces(next);
		localStorage.setItem("kairos-family-saved", JSON.stringify(next));
		toast.success("Place saved on this browser");
	}
	async function plan(extra) {
		if (!origin || !end) {
			setError("Choose where the day starts.");
			return;
		}
		if (endMin <= startMin + 60) {
			setError("The day needs a later home time.");
			return;
		}
		setError("");
		setPending(true);
		const nextRejected = extra?.rejected ?? rejected;
		const lockedPins = stops.filter((stop) => locked[stop.placeId] && (stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner")).map((stop) => ({
			placeId: stop.placeId,
			kind: stop.kind,
			title: stop.title,
			address: stop.address,
			latitude: stop.latitude,
			longitude: stop.longitude,
			setting: stop.setting
		}));
		try {
			const result = await planFamily({ data: {
				adults,
				ages,
				when,
				date,
				location: origin.label,
				latitude: origin.latitude,
				longitude: origin.longitude,
				startAddress: origin.address,
				endLabel: end.label,
				endAddress: end.address,
				endLatitude: end.latitude,
				endLongitude: end.longitude,
				maxTravel,
				budget: freeOnly ? 0 : budget,
				freeOnly,
				setting: extra?.indoor ? "indoor" : setting,
				interests,
				avoid,
				toddler: toddler || ages.some((age) => age < 4),
				stroller,
				mixedAge: ages.length > 1,
				rainSafe: extra?.indoor ? true : rainSafe,
				wheelchair,
				longWalk,
				span,
				pace,
				travelMode,
				startMin,
				endMin,
				napStart: young && nap === "12" ? 720 : young && nap === "13" ? 780 : null,
				napEnd: young && nap === "12" ? 840 : young && nap === "13" ? 900 : null,
				booking,
				rejected: nextRejected,
				locked: extra?.rejected ? lockedPins : lockedPins,
				text
			} });
			setWeather(result.weather);
			setStops(result.stops);
			setBackup(result.backup);
			setScore(result.score);
			setSpend(result.spend);
			setTravelTotal(result.travelTotal);
			setWhy(result.why);
			setEventsNote(result.eventsNote);
			setBookingNote(result.bookingNote);
			setUnderstood(result.understood);
			if (!result.stops.some((stop) => stop.kind === "activity")) setError("Nothing real fitted that day. Widen the travel time, or drop a filter.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "The family plan did not land.");
		} finally {
			setPending(false);
		}
	}
	function another() {
		const ids = stops.filter((stop) => stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner").map((stop) => stop.placeId).filter((id) => id && !locked[id]);
		const next = [.../* @__PURE__ */ new Set([...rejected, ...ids])];
		setRejected(next);
		plan({ rejected: next });
	}
	function remix() {
		const ids = stops.filter((stop) => (stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner") && !locked[stop.placeId]).map((stop) => stop.placeId);
		const next = [.../* @__PURE__ */ new Set([...rejected, ...ids])];
		setRejected(next);
		plan({ rejected: next });
	}
	const bonus = score ? markOf(readReading(`${date}T10:00:00+08:00`, "family day").score) : null;
	const publicStops = (0, import_react.useMemo)(() => stops.map((stop) => stop.kind === "leave" || stop.kind === "home" || stop.kind === "return" ? {
		...stop,
		address: ""
	} : stop), [stops]);
	async function onSave() {
		if (!origin || !score) return;
		const payload = {
			title: `${dayName$1(date)} family plan`,
			startDate: date,
			startTime: toTime(startMin),
			endTime: toTime(endMin),
			startLocation: origin.label === "Home" ? "Home" : origin.label,
			endLocation: end?.label === "Home" ? "Home" : end?.label || "End",
			adults,
			childAges: ages,
			budget: freeOnly ? 0 : budget,
			travelMode,
			pace,
			interests,
			preferences: {
				setting,
				booking
			},
			familyScore: score.total,
			stops: publicStops.map((stop, index) => ({
				sequence: index,
				stopType: stop.kind,
				title: stop.title,
				address: stop.address,
				latitude: stop.kind === "leave" || stop.kind === "home" ? null : stop.latitude,
				longitude: stop.kind === "leave" || stop.kind === "home" ? null : stop.longitude,
				startTime: clockLabel(stop.startMin),
				endTime: clockLabel(stop.endMin),
				estimatedCost: stop.cost,
				indoorOutdoor: stop.setting,
				sourceUrl: "",
				sourceType: stop.liveLabel || "place",
				locked: Boolean(locked[stop.placeId])
			}))
		};
		localStorage.setItem("kairos-family-plan", JSON.stringify(payload));
		try {
			const saved = await saveFamilyPlan({ data: payload });
			toast.success(saved.saved ? "Plan saved" : "Saved on this browser. The Supabase family tables are not there yet.");
		} catch {
			toast.success("Saved on this browser");
		}
	}
	function onShare() {
		const lines = publicStops.map((stop) => `${clockLabel(stop.startMin)} ${stop.title}${stop.address ? ` — ${stop.address}` : ""}`);
		navigator.clipboard.writeText([`${dayName$1(date)} family plan`, ...lines].join("\n"));
		toast.success("Copied. Home street is left out.");
	}
	function onCalendar() {
		if (!stops.length) return;
		const first = stops.find((stop) => stop.kind === "activity");
		const start = /* @__PURE__ */ new Date(`${date}T${toTime(startMin)}:00+08:00`);
		const url = createGoogleCalendarUrl({
			title: `${dayName$1(date)} family plan`,
			startTime: start.toISOString(),
			durationMinutes: Math.max(60, endMin - startMin),
			meetingFormat: "physical",
			venueName: first?.title,
			address: first?.address,
			purpose: publicStops.map((stop) => `${clockLabel(stop.startMin)} ${stop.title}`).join("\n"),
			kairosScore: score?.total ?? null,
			kairosStatus: bonus ?? ""
		});
		window.open(url, "_blank", "noopener,noreferrer");
	}
	const weatherValue = weather ? weather.morningOutdoor ? "Outdoor morning" : "Indoor morning" : "Not checked yet";
	const weatherNote = weather ? weather.afternoonOutdoor ? "Outdoor afternoon" : "Indoor afternoon" : "Real forecast, once you plan";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "lg:col-span-2",
		onSubmit: (event) => {
			event.preventDefault();
			setRejected([]);
			setLocked({});
			plan({ rejected: [] });
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanningBrief, {
				mode: "family",
				kicker: "FAMILY",
				question: "What would make a good family day?",
				hint: "Tell Kairos when, who’s coming and what the kids are into. Ages stay on the form, not guessed from the sentence.",
				placeholder: "Something indoors tomorrow afternoon for the kids. They like animals and science, and I don’t want to drive more than 20 minutes.",
				value: text,
				onChange: setText,
				onUnderstand: understandFamily,
				reading: readingBrief,
				failed: briefFailed,
				chips: familyIntent ? familyChips(familyIntent).filter((chip) => !hiddenBrief.includes(chip.id)) : [],
				onRemove: (chip) => {
					lockBrief(chip.lock);
					setHiddenBrief((current) => [...current, chip.id]);
				},
				aside: familyIntent?.aside ?? "",
				conflicts: briefConflicts,
				onKeep: (key) => setBriefConflicts((items) => items.filter((item) => item.key !== key)),
				onUse: (key) => {
					const next = {
						...briefLocks,
						[key]: false
					};
					setBriefLocks(next);
					if (familyIntent) applyFamily(familyIntent, next);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Starting from"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: originKind === "home",
						onClick: () => {
							setOriginKind("home");
							setOrigin(homePoint());
						},
						children: "Home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: originKind === "current",
						onClick: useCurrent,
						children: locating ? "Finding you…" : "Current location"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: originKind === "choose",
						onClick: () => setOriginKind("choose"),
						children: "Choose location"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: originKind === "saved",
						onClick: () => setOriginKind("saved"),
						children: "Saved place"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: false,
						onClick: rememberPlace,
						children: "+"
					})
				]
			}),
			originKind === "home" && !homePoint() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: "Set your home location."
			}) : null,
			origin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-cream",
				children: [origin.label, origin.address && origin.label !== "Home" ? ` · ${origin.address}` : ""]
			}) : null,
			originKind === "home" || originKind === "choose" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: lookup,
						onChange: (event) => setLookup(event.target.value),
						onKeyDown: (event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								search(lookup, "start");
							}
						},
						placeholder: "Address, building, postal code, or neighbourhood",
						className: "h-12 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: lookups.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
							on: origin?.label === hit.label,
							onClick: () => setOrigin(hit),
							children: hit.label
						}, `${hit.latitude}-${hit.label}`))
					}),
					origin && originKind === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: saveHome,
						className: "press mt-2 min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
						children: "Save as Home"
					}) : null
				]
			}) : null,
			originKind === "saved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: savedPlaces.length ? savedPlaces.map((place) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
					on: origin?.label === place.label,
					onClick: () => setOrigin(place),
					children: place.label
				}, place.label)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-mute",
					children: "No saved place yet. Choose one, then +."
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "End at"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: endKind === "home",
						onClick: () => setEndKind("home"),
						children: "Back home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: endKind === "start",
						onClick: () => setEndKind("start"),
						children: "Same as start"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: endKind === "other",
						onClick: () => setEndKind("other"),
						children: "Choose another location"
					})
				]
			}),
			endKind === "other" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: endLookup,
				onChange: (event) => setEndLookup(event.target.value),
				onKeyDown: (event) => {
					if (event.key === "Enter") {
						event.preventDefault();
						search(endLookup, "end");
					}
				},
				placeholder: "Where the day should finish",
				className: "mt-2 h-12 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "How are we getting around?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					["drive", "Drive"],
					["transit", "Public transport"],
					["ride", "Taxi / ride-hail"],
					["walk", "Walk"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
					on: travelMode === id,
					onClick: () => {
						lockBrief("travel");
						setTravelMode(id);
					},
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Max one-way travel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [[
					15,
					20,
					30,
					45,
					60
				].map((minutes) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
					on: maxTravel === minutes,
					onClick: () => {
						lockBrief("travel");
						setMaxTravel(minutes);
					},
					children: `${minutes} min`
				}, minutes)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
					on: maxTravel === 120,
					onClick: () => {
						lockBrief("travel");
						setMaxTravel(120);
					},
					children: "No preference"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Plan length"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: span === "short",
						onClick: () => applyLength("short"),
						children: "2–3 hours"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: span === "half",
						onClick: () => applyLength("half"),
						children: "Half day"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: span === "full",
						onClick: () => applyLength("full"),
						children: "Full day"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-cream",
					children: ["Start", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "time",
						value: toTime(startMin),
						onChange: (event) => setStartMin(fromTime(event.target.value)),
						className: "mt-1 block h-12 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-cream",
					children: ["Back home by", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "time",
						value: toTime(endMin),
						onChange: (event) => {
							lockBrief("end");
							setEndMin(fromTime(event.target.value));
						},
						className: "mt-1 block h-12 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "When"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: when === "Today",
						onClick: () => {
							setWhen("Today");
							setDate(sgtDate$1());
						},
						children: "Today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: when === "Tomorrow",
						onClick: () => {
							setWhen("Tomorrow");
							setDate(sgtDate$1(1));
						},
						children: "Tomorrow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: when === "This weekend",
						onClick: () => {
							setWhen("This weekend");
							setDate(nextSaturday());
						},
						children: "This weekend"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: when === "Next weekend",
						onClick: () => {
							setWhen("Next weekend");
							setDate(nextSaturday(1));
						},
						children: "Next weekend"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "date",
				value: date,
				onChange: (event) => {
					setDate(event.target.value);
					setWhen("Choose dates");
				},
				className: "mt-2 h-12 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
					label: "Adults",
					value: adults,
					min: 1,
					max: 8,
					onChange: setAdults
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, {
					label: "Children",
					value: childCount,
					min: 0,
					max: 6,
					onChange: setChildren
				})]
			}),
			ages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: ages.map((age, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-mute",
					children: [
						"Child ",
						index + 1,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							max: 17,
							value: age,
							onChange: (event) => setAges((current) => current.map((item, itemIndex) => itemIndex === index ? Math.max(0, Math.min(17, Number(event.target.value) || 0)) : item)),
							className: "mt-1 block h-12 w-20 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
						})
					]
				}, index))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Pace"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					"relaxed",
					"balanced",
					"packed"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
					on: pace === item,
					onClick: () => {
						lockBrief("pace");
						setPace(item);
					},
					children: item === "packed" ? "Pack it in" : item === "relaxed" ? "Relaxed" : "Balanced"
				}, item))
			}),
			young ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Nap / rest window"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: nap === "",
						onClick: () => setNap(""),
						children: "None"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: nap === "12",
						onClick: () => setNap("12"),
						children: "12–2 PM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: nap === "13",
						onClick: () => setNap("13"),
						children: "1–3 PM"
					})
				]
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Interests"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: FAMILY_INTERESTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
					on: interests.includes(item),
					onClick: () => {
						lockBrief("interests");
						setInterests((current) => current.includes(item) ? current.filter((id) => id !== item) : [...current, item]);
					},
					children: INTEREST_LABEL[item]
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Not interested in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: AVOID.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
					on: avoid.includes(id),
					onClick: () => setAvoid((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Family total"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
					on: freeOnly,
					onClick: () => setFreeOnly(true),
					children: "Free only"
				}), [
					30,
					60,
					100,
					150
				].map((amount) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
					on: !freeOnly && budget === amount,
					onClick: () => {
						setFreeOnly(false);
						setBudget(amount);
					},
					children: `≤ $${amount}`
				}, amount))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Indoor / outdoor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					["mix", "Mix both"],
					["either", "Either"],
					["indoor", "Indoor"],
					["outdoor", "Outdoor"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
					on: setting === id,
					onClick: () => {
						lockBrief("setting");
						setSetting(id);
					},
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setMore((value) => !value),
				className: "mt-4 text-sm font-semibold text-accent",
				children: more ? "Hide preferences" : "More preferences"
			}),
			more ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: toddler,
						onClick: () => setToddler((value) => !value),
						children: "Toddler friendly"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: stroller,
						onClick: () => {
							lockBrief("stroller");
							setStroller((value) => !value);
						},
						children: "Stroller friendly"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: wheelchair,
						onClick: () => setWheelchair((value) => !value),
						children: "Wheelchair accessible"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: longWalk,
						onClick: () => setLongWalk((value) => !value),
						children: "Avoid long walks"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: rainSafe,
						onClick: () => {
							lockBrief("setting");
							setRainSafe((value) => !value);
						},
						children: "Rain-safe"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: booking === "any",
						onClick: () => setBooking("any"),
						children: "Anything"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: booking === "nobook",
						onClick: () => setBooking("nobook"),
						children: "No booking needed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip$1, {
						on: booking === "free",
						onClick: () => {
							setBooking("free");
							setFreeOnly(true);
						},
						children: "Free entry preferred"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-mute",
				children: "Crowds, toilets, parking, and booking are not verified unless the map says so."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mt-4 text-sm text-vermilion",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: pending || !origin,
				className: "press mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-accent-ink disabled:opacity-50",
				children: pending ? "Checking routes and weather…" : "Plan something for us"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "lg:col-span-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-2xl bg-panel p-5 shadow-card sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: "AGE + WEATHER + INTERESTS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-sans text-3xl font-semibold leading-tight text-cream",
					children: "A day the household can actually keep."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor$1, {
							tone: "accent",
							kicker: "AGE FIT",
							value: ageLabel,
							note: `${adults} adults · ${span === "full" ? "Full day" : span === "half" ? "Half day" : "2–3 hours"}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor$1, {
							tone: weather?.morningOutdoor ? "leaf" : "sky",
							kicker: "WEATHER FIT",
							value: weatherValue,
							note: weatherNote
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor$1, {
							tone: "sun",
							kicker: "VALUE FIT",
							value: freeOnly ? "Free only" : `≤ $${budget}`,
							note: origin ? `Start ${origin.label}` : "Start not set"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-1 text-sm text-cream",
					children: (understood.length ? understood : [
						"Both children’s ages",
						"Start and end",
						"Weather-aware",
						`${pace} pace`
					]).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
				}),
				weather ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-mute",
					children: [
						dayName$1(date),
						" · ",
						weather.windowLabel,
						". ",
						weather.windowNote,
						". Rain peaks at ",
						Math.round(weather.maxRain),
						"%.",
						weather.thunder ? " Thunder is in the forecast." : "",
						" Kairos does not guess this."
					]
				}) : null,
				score ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-xl bg-ink px-4 py-4 ring-1 ring-accent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "FAMILY KAIROS FIT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-display text-4xl text-accent",
							children: [score.total, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl text-mute",
								children: " / 100"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-mute",
							children: [
								"Age ",
								score.age,
								"/25 · Interest ",
								score.interest,
								"/20 · Weather ",
								score.weather,
								"/20 · Practical ",
								score.practical,
								"/15 · Value ",
								score.value,
								"/10 · Timing ",
								score.timing,
								"/10"
							]
						}),
						bonus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-mute",
							children: [
								"Bonus ",
								bonus,
								". It does not override weather, ages, or travel."
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
							mode: "family",
							text: why,
							status: weather && !weather.afternoonOutdoor ? "warning" : weather?.morningOutdoor ? "good" : "neutral"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-mute",
							children: [spend == null ? "Estimated family spend: price unavailable" : `Estimated family spend ~$${spend}. Typical figures only, not a quote.`, travelTotal != null ? ` · Verified travel ~${travelTotal} min` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-mute",
							children: [
								eventsNote,
								" ",
								bookingNote
							]
						})
					]
				}) : null,
				stops.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 space-y-3",
					children: stops.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-ink px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold tracking-brand text-sky",
								children: [clockLabel(stop.startMin), stop.endMin !== stop.startMin ? `–${clockLabel(stop.endMin)}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold tracking-brand text-accent",
										children: stop.liveLabel || stop.kind.toUpperCase()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-2xl text-cream",
										children: stop.title
									}),
									stop.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-cream",
										children: stop.address
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-mute",
										children: [
											stop.travelLabel ? `${stop.travelLabel} from the previous stop` : "",
											stop.setting ? ` · ${stop.setting === "indoor" ? "Indoor" : "Outdoor"}` : "",
											stop.ages ? ` · ${stop.ages}` : ""
										]
									}),
									stop.opening ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-mute",
										children: ["Hours on the map: ", stop.opening]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-cream",
										children: stop.cost == null ? stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner" ? "Price unavailable" : stop.why : `Typical ~$${stop.cost}/pax, not a quote`
									}),
									stop.why && stop.cost != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-mute",
										children: stop.why
									}) : null
								] }), stop.placeId && stop.kind !== "leave" && stop.kind !== "home" && stop.kind !== "return" && stop.kind !== "rest" && stop.kind !== "snack" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": Boolean(locked[stop.placeId]),
									onClick: () => setLocked((current) => ({
										...current,
										[stop.placeId]: !current[stop.placeId]
									})),
									className: clsx("press min-h-11 shrink-0 rounded-xl px-3 text-sm font-semibold", locked[stop.placeId] ? "bg-accent text-accent-ink" : "text-accent ring-1 ring-accent"),
									children: locked[stop.placeId] ? "Keep" : "Lock"
								}) : null]
							}),
							stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalActions, { input: {
								mode: "family",
								kind: stop.kind === "activity" ? "attraction" : "restaurant",
								countryCode: "SG",
								navMode: travelMode === "walk" ? "walk" : travelMode === "transit" ? "transit" : "drive",
								from: (() => {
									const index = stops.findIndex((item) => item.id === stop.id);
									const previous = stops[index - 1];
									return previous ? {
										lat: previous.latitude,
										lng: previous.longitude,
										name: previous.title
									} : void 0;
								})(),
								place: {
									id: stop.placeId,
									name: stop.title,
									address: stop.address,
									city: "Singapore",
									countryCode: "SG",
									lat: stop.latitude,
									lng: stop.longitude
								}
							} }) : null
						]
					}, stop.id))
				}) : null,
				backup ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl bg-ink px-4 py-4 ring-1 ring-sky",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-sky",
							children: "WEATHER BACKUP"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-2xl text-cream",
							children: backup.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-cream",
							children: backup.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-mute",
							children: [
								backup.travelLabel,
								" · ",
								backup.setting
							]
						})
					]
				}) : null,
				stops.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: another,
							className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
							children: "Another plan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: remix,
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
							children: "Remix unlocked parts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void plan({ indoor: true }),
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-sky ring-1 ring-sky",
							children: "Indoor backup"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void onSave(),
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
							children: "Save plan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onShare,
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
							children: "Share with family"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onCalendar,
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
							children: "Add itinerary to calendar"
						})
					]
				}) : null
			]
		})
	})] });
}
function Count({ label, value, min, max, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-sm text-cream",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			min,
			max,
			value,
			onChange: (event) => onChange(Math.max(min, Math.min(max, Number(event.target.value) || min))),
			className: "mt-1 block h-12 w-24 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
		})]
	});
}
function Factor$1({ kicker, value, note, tone }) {
	const toneClass = {
		accent: "border-accent text-accent",
		sky: "border-sky text-sky",
		sun: "border-sun text-sun",
		leaf: "border-leaf text-leaf"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: clsx("border-l-2 pl-3", toneClass),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-lg font-semibold text-cream",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: note
			})
		]
	});
}
function Chip$1({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", on ? "bg-accent text-accent-ink" : "bg-panel text-cream ring-1 ring-line"),
		children
	});
}
var INVITE_MEMORY = "kairos-dating-invite";
function readInviteMemory() {
	try {
		const raw = localStorage.getItem(INVITE_MEMORY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed.slug !== "string" || !INVITE_SLUG.test(parsed.slug)) return null;
		return {
			slug: parsed.slug,
			seen: parsed.seen && typeof parsed.seen === "object" ? parsed.seen : {}
		};
	} catch {
		return null;
	}
}
function rememberInvite(slug, status) {
	const current = readInviteMemory();
	const seen = current?.slug === slug ? { ...current.seen } : {};
	if (status && !seen[status]) seen[status] = (/* @__PURE__ */ new Date()).toISOString();
	localStorage.setItem(INVITE_MEMORY, JSON.stringify({
		slug,
		seen
	}));
	return status ? seen[status] ?? "" : "";
}
function updatedLabel(iso) {
	const delta = Date.now() - new Date(iso).getTime();
	if (!Number.isFinite(delta) || delta < 6e4) return "Updated just now";
	const minutes = Math.round(delta / 6e4);
	if (minutes < 60) return `Updated ${minutes} min ago`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return `Updated ${hours} hr ago`;
	return `Updated ${Math.round(hours / 24)} days ago`;
}
var TONE_LABEL = {
	minimal: "Minimal",
	warm: "Warm",
	playful: "Playful",
	romantic: "Romantic"
};
async function writeClipboard(text) {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return "copied";
		}
	} catch {}
	const field = document.createElement("textarea");
	field.value = text;
	field.setAttribute("readonly", "");
	field.style.position = "fixed";
	field.style.top = "0";
	field.style.left = "0";
	field.style.opacity = "0";
	document.body.appendChild(field);
	field.focus();
	field.select();
	let ok = false;
	try {
		ok = document.execCommand("copy");
	} catch {
		ok = false;
	}
	field.remove();
	return ok ? "copied" : "manual";
}
function DatingInvitePanel({ dateType, weekday, when, span, areaLabel, formality, vibes, stops, mark, planId, date, statusOnly = false }) {
	const area = publicArea(areaLabel);
	const [tone, setTone] = (0, import_react.useState)("warm");
	const [visibility, setVisibility] = (0, import_react.useState)("full");
	const [name, setName] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [ownVoice, setOwnVoice] = (0, import_react.useState)(false);
	const [slug, setSlug] = (0, import_react.useState)("");
	const [plannerToken, setPlannerToken] = (0, import_react.useState)("");
	const [editToken, setEditToken] = (0, import_react.useState)("");
	const [publishedKey, setPublishedKey] = (0, import_react.useState)("");
	const [reply, setReply] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [shareError, setShareError] = (0, import_react.useState)("");
	const [shareOpen, setShareOpen] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [manualCopy, setManualCopy] = (0, import_react.useState)("");
	const [previewOpen, setPreviewOpen] = (0, import_react.useState)(false);
	const [preview, setPreview] = (0, import_react.useState)("");
	const [previewEdited, setPreviewEdited] = (0, import_react.useState)(false);
	const [replyChecked, setReplyChecked] = (0, import_react.useState)("");
	const [replyError, setReplyError] = (0, import_react.useState)("");
	const [canNative, setCanNative] = (0, import_react.useState)(false);
	const draft = (0, import_react.useMemo)(() => draftInvitation({
		tone,
		dateType,
		weekday,
		area,
		span,
		when
	}), [
		tone,
		dateType,
		weekday,
		area,
		span,
		when
	]);
	const shown = ownVoice ? message : message || draft.message;
	const cardStops = visibility === "mystery" ? [] : visibility === "first" ? stops.slice(0, 1) : stops;
	const footer = inviteFooter(mark);
	const clock = stops[0] ? clockLabel(stops[0].startMin) : when;
	const visibleStop = visibility === "mystery" ? "" : cardStops[0]?.title ?? "";
	const snapshot = JSON.stringify({
		title: draft.title,
		clock,
		area,
		message: shown,
		note,
		tone,
		visibility,
		name,
		stops: cardStops.map((stop) => stop.placeId)
	});
	(0, import_react.useEffect)(() => {
		setCanNative(typeof navigator.share === "function");
	}, []);
	(0, import_react.useEffect)(() => {
		const saved = readDatingInviteLink(planId);
		const token = saved?.plannerToken ?? "";
		setPlannerToken(token);
		setSlug(saved?.inviteSlug ?? "");
		if (!token) setReply(null);
	}, [planId]);
	(0, import_react.useEffect)(() => {
		if (!plannerToken || !INVITE_SLUG.test(plannerToken)) return;
		let stop = false;
		async function load() {
			if (document.visibilityState === "hidden") return;
			const found = await loadPlannerInvite(plannerToken);
			if (stop) return;
			if (!found) {
				setReplyError("Couldn’t refresh the reply.");
				return;
			}
			setReplyError("");
			setSlug(found.slug);
			setReply(found);
			setPhase("ready");
			setReplyChecked(found.updatedAt || rememberInvite(found.slug, found.status));
			rememberDatingReply(planId, found.status, {
				inviteSlug: found.slug,
				date,
				title: draft.title,
				area,
				startMin: stops[0]?.startMin,
				endMin: stops[stops.length - 1]?.endMin
			});
		}
		load();
		const timer = window.setInterval(() => void load(), 12e3);
		const onFocus = () => void load();
		const onVisible = () => {
			if (document.visibilityState === "visible") load();
		};
		window.addEventListener("focus", onFocus);
		document.addEventListener("visibilitychange", onVisible);
		return () => {
			stop = true;
			window.clearInterval(timer);
			window.removeEventListener("focus", onFocus);
			document.removeEventListener("visibilitychange", onVisible);
		};
	}, [
		plannerToken,
		planId,
		date,
		draft.title,
		area,
		stops
	]);
	(0, import_react.useEffect)(() => {
		if (!previewOpen || previewEdited || !slug) return;
		setPreview(buildShareMessage({
			visibility,
			weekday,
			time: clock,
			area,
			duration: durationLabel(span),
			name,
			note,
			firstStop: visibleStop,
			url: publicInviteUrl(slug)
		}));
	}, [
		previewOpen,
		previewEdited,
		slug,
		visibility,
		weekday,
		clock,
		area,
		span,
		name,
		note,
		visibleStop
	]);
	async function publish() {
		if (slug && publishedKey === snapshot) {
			setPhase("ready");
			return publicInviteUrl(slug);
		}
		setPhase("creating");
		setShareError("");
		setPending(true);
		console.info("[Dating Share] 1. Share initiated");
		try {
			console.info("[Dating Share] 2. Public payload generated");
			console.info("[Dating Share] 3. Supabase RPC create_dating_invitation started");
			const payload = {
				title: draft.title.slice(0, 80),
				whenLabel: `${weekday}${stops[0] ? ` · ${clockLabel(stops[0].startMin)}` : ""}`.trim().slice(0, 60),
				area: area.slice(0, 80),
				message: shown.slice(0, 280),
				note,
				duration: durationLabel(span).slice(0, 40),
				dress: dressLabel(formality).slice(0, 40),
				vibe: (vibes.slice(0, 3).join(" · ") || "Easy").slice(0, 80),
				tone,
				visibility,
				recipientName: name.slice(0, 40),
				dateType: dateType.slice(0, 20),
				stops: cardStops.slice(0, 8).map((stop) => ({
					slot: stop.slot.slice(0, 40),
					title: stop.title.slice(0, 80),
					address: stop.address.slice(0, 160),
					time: `${clockLabel(stop.startMin)}–${clockLabel(stop.endMin)}`.slice(0, 40),
					setting: stop.setting.slice(0, 12)
				})),
				footer: footer.slice(0, 80),
				slug: ensureInviteSlug(slug),
				editToken
			};
			console.log("[INVITE] payload before validation", payload);
			console.log("[INVITE] slug", payload.slug);
			console.log("[INVITE] slug length", payload.slug.length);
			console.log("[INVITE] regex passes", INVITE_SLUG.test(payload.slug));
			if (!INVITE_SLUG.test(payload.slug)) throw new Error("Invalid invite slug generated");
			const saved = await createDatingInvite({ data: payload });
			console.info("[Dating Share] 4. Supabase response received");
			console.info("[Dating Share] 5. invite_slug obtained", saved.slug);
			setSlug(saved.slug);
			setPlannerToken(saved.plannerToken);
			saveDatingInviteLink(planId || "current", {
				plannerToken: saved.plannerToken,
				inviteSlug: saved.slug,
				date,
				title: draft.title,
				area,
				startMin: stops[0]?.startMin,
				endMin: stops[stops.length - 1]?.endMin,
				status: "pending"
			});
			setEditToken(saved.editToken);
			setPublishedKey(snapshot);
			rememberInvite(saved.slug);
			const url = publicInviteUrl(saved.slug);
			console.info("[Dating Share] 6. public URL generated", url);
			setPhase("ready");
			console.info("[Dating Share] 7. Share buttons enabled");
			return url;
		} catch (err) {
			console.error("[Dating Share] failed:", err);
			setPhase("error");
			setShareError(err instanceof Error ? err.message : "");
			return "";
		} finally {
			setPending(false);
		}
	}
	function composed(url) {
		const generated = buildShareMessage({
			visibility,
			weekday,
			time: clock,
			area,
			duration: durationLabel(span),
			name,
			note,
			firstStop: visibleStop,
			url
		});
		return onlyRecipientShare(previewEdited ? withShareUrl(preview, url) : generated);
	}
	function flash(kind) {
		setCopied(kind);
		setNotice(kind === "planner" ? "Planner link copied ✓" : kind === "link" ? "Link copied ✓" : "Message copied ✓");
		window.setTimeout(() => {
			setCopied("");
			setNotice("");
		}, 1800);
	}
	async function openShare() {
		setShareOpen(true);
		setManualCopy("");
		await publish();
	}
	async function copyLink() {
		const url = link || await publish();
		if (!url.includes("/date/")) return;
		await revealCopy(url, "link");
	}
	function copyReadyLink() {
		if (!link) {
			copyLink();
			return;
		}
		const field = document.getElementById("invite-public-url");
		if (field instanceof HTMLInputElement) {
			field.focus();
			field.select();
		}
		revealCopy(link, "link");
	}
	async function revealCopy(text, kind) {
		if (await writeClipboard(text) === "copied") {
			setManualCopy("");
			flash(kind);
			return;
		}
		setManualCopy(text);
		setNotice(kind === "link" ? "Select the link, then copy it." : "Select the message, then copy it.");
		window.setTimeout(() => {
			const field = document.getElementById(kind === "link" ? "invite-public-url" : "invite-manual-copy");
			if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
				field.focus();
				field.select();
			}
		}, 0);
	}
	async function openMessage() {
		const url = link || await publish();
		if (!url) return;
		setPreviewOpen(true);
		if (!previewEdited) setPreview(buildShareMessage({
			visibility,
			weekday,
			time: clock,
			area,
			duration: durationLabel(span),
			name,
			note,
			firstStop: visibleStop,
			url
		}));
	}
	async function copyMessage() {
		const url = link || await publish();
		if (!url) return;
		await revealCopy(withShareUrl(preview || composed(url), url), "message");
	}
	function shareNative() {
		if (!link || typeof navigator.share !== "function") return;
		const text = composed(link).replace(link, "").trim();
		navigator.share({
			title: draft.title,
			text,
			url: link
		}).catch(() => {
			setNotice("Sharing was cancelled. The link is still here to copy.");
		});
	}
	async function suggest() {
		setPending(true);
		try {
			const result = await polishDatingInvite({ data: {
				tone,
				draft: shown,
				note,
				dateType
			} });
			if (result.message) {
				setOwnVoice(true);
				setMessage(result.message);
			} else toast.message("Kept the original wording.");
		} finally {
			setPending(false);
		}
	}
	async function checkReply() {
		if (!plannerToken || !INVITE_SLUG.test(plannerToken)) return;
		const found = await loadPlannerInvite(plannerToken);
		if (!found) {
			setReplyError("Couldn’t refresh the reply.");
			return;
		}
		setReplyError("");
		setSlug(found.slug);
		setReply(found);
		setReplyChecked(found.updatedAt || rememberInvite(found.slug, found.status));
		rememberDatingReply(planId, found.status, {
			inviteSlug: found.slug,
			date,
			title: draft.title,
			area,
			startMin: stops[0]?.startMin,
			endMin: stops[stops.length - 1]?.endMin
		});
	}
	const link = slug && !publicInviteUrl(slug).includes("/date/manage/") ? publicInviteUrl(slug) : "";
	const plannerLink = plannerToken ? plannerInviteUrl(plannerToken) : "";
	const shared = link ? composed(link) : "";
	const whatsappHref = link && !shared.includes("/date/manage/") ? `https://wa.me/?text=${encodeURIComponent(shared)}` : "";
	const statusCard = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvitationStatus, {
		plannerToken,
		slug,
		reply,
		updatedAt: reply?.updatedAt || replyChecked,
		error: replyError,
		onRefresh: () => void checkReply()
	});
	const privateLink = plannerLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-semibold tracking-brand text-mute",
				htmlFor: "invite-planner-url",
				children: "Keep this link private."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "invite-planner-url",
				readOnly: true,
				value: plannerLink,
				onFocus: (event) => event.currentTarget.select(),
				className: "mt-1 h-11 w-full rounded-xl bg-panel px-3 text-sm text-cream ring-1 ring-line"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void revealCopy(plannerLink, "planner"),
				className: "press mt-2 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
				children: copied === "planner" ? "Copied ✓" : "Copy planner link"
			})
		]
	}) : null;
	if (statusOnly) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 rounded-2xl bg-ink px-4 py-4 ring-1 ring-line",
		children: [statusCard, privateLink]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 rounded-2xl bg-ink px-4 py-4 ring-1 ring-line",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-accent",
				children: "SHARE THE PLAN"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-mute",
				children: "A short note for the other person. They do not need an account."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-4 block text-sm text-cream",
				htmlFor: "invite-name",
				children: "Recipient name, optional"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "invite-name",
				value: name,
				onChange: (event) => setName(event.target.value),
				maxLength: 40,
				className: "mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-cream",
				children: "Tone"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: Object.keys(TONE_LABEL).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": tone === item,
					onClick: () => {
						setTone(item);
						if (!ownVoice) setMessage("");
					},
					className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", tone === item ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
					children: TONE_LABEL[item]
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-cream",
				children: "What they see"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					["full", "Full plan"],
					["first", "First stop only"],
					["mystery", "Mystery"]
				].map(([item, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": visibility === item,
					onClick: () => {
						setVisibility(item);
						setPreviewEdited(false);
					},
					className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", visibility === item ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
					children: label
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-4 block text-sm text-cream",
				htmlFor: "invite-note",
				children: "Personal note, optional"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "invite-note",
				value: note,
				onChange: (event) => setNote(event.target.value),
				maxLength: 180,
				rows: 2,
				placeholder: "Been wanting to check this place out with you.",
				className: "mt-1 w-full rounded-xl bg-panel px-3 py-2 text-cream ring-1 ring-line"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: pending,
					onClick: () => void suggest(),
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
					children: "Suggest wording"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setOwnVoice(true);
						setMessage("");
					},
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
					children: "Write it myself"
				})]
			}),
			ownVoice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: message,
				onChange: (event) => setMessage(event.target.value),
				maxLength: 280,
				rows: 3,
				placeholder: "Your words.",
				className: "mt-2 w-full rounded-xl bg-panel px-3 py-2 text-cream ring-1 ring-line"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rise mt-4 rounded-2xl bg-panel px-4 py-5 ring-1 ring-accent",
				children: [
					name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-mute",
						children: ["For ", name]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl text-cream",
						children: draft.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-sky",
						children: [weekday, stops[0] ? ` · ${clockLabel(stops[0].startMin)}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-cream",
						children: area
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-cream",
						children: shown
					}),
					note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-mute",
						children: note
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-mute",
						children: [
							durationLabel(span),
							" · ",
							dressLabel(formality),
							vibes.length ? ` · ${vibes.slice(0, 2).join(" + ")}` : ""
						]
					}),
					visibility === "mystery" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-cream",
						children: "The rest of the plan stays with you until later."
					}) : null,
					cardStops.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 border-t border-line pt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold tracking-brand text-accent",
								children: [
									stop.slot,
									" · ",
									clockLabel(stop.startMin)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-cream",
								children: stop.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-mute",
								children: stop.address
							})
						]
					}, stop.placeId)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-mute",
						children: footer
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvitationStatus, {
				plannerToken,
				slug,
				reply,
				updatedAt: reply?.updatedAt || replyChecked,
				error: replyError,
				onRefresh: () => void checkReply()
			}),
			privateLink,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: pending,
					onClick: () => void openShare(),
					className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
					children: "Share"
				})
			}),
			shareOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-2xl bg-panel px-4 py-4 ring-1 ring-accent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-accent",
						children: "SHARE YOUR INVITATION"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: whatsappHref || void 0,
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-disabled": phase !== "ready" || !whatsappHref,
								onClick: (event) => {
									if (phase !== "ready" || !whatsappHref) event.preventDefault();
								},
								className: clsx("press inline-flex min-h-11 items-center rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink", (phase !== "ready" || !whatsappHref) && "pointer-events-none opacity-50"),
								children: "WhatsApp"
							}),
							canNative ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: phase !== "ready" || !link,
								onClick: shareNative,
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
								children: "Share…"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: phase !== "ready" || !link,
								onClick: copyReadyLink,
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
								children: copied === "link" ? "Copied ✓" : "Copy link"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: phase !== "ready" || !link,
								onClick: () => void openMessage(),
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
								children: "Copy message + link"
							})
						]
					}),
					phase === "creating" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-mute",
						children: "Creating the link…"
					}) : null,
					phase === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-cream",
								children: "Couldn’t create the invitation."
							}),
							shareError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-mute",
								children: shareError
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void publish(),
								className: "press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
								children: "Try again"
							})
						]
					}) : null,
					notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "mt-3 text-sm text-leaf",
						children: notice
					}) : null,
					previewOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-accent",
								children: "MESSAGE PREVIEW"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "share-preview",
								value: preview,
								rows: 5,
								maxLength: 500,
								onChange: (event) => {
									setPreviewEdited(true);
									setPreview(event.target.value);
								},
								className: "mt-2 w-full rounded-xl bg-ink px-3 py-2 text-sm text-cream ring-1 ring-line"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => document.getElementById("share-preview")?.focus(),
									className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
									children: "Edit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: pending,
									onClick: () => void copyMessage(),
									className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
									children: copied === "message" ? "Copied ✓" : "Copy"
								})]
							})
						]
					}) : null,
					manualCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "invite-manual-copy",
						readOnly: true,
						value: manualCopy,
						onFocus: (event) => event.currentTarget.select(),
						rows: 4,
						className: "mt-3 w-full rounded-xl bg-ink px-3 py-2 text-sm text-cream ring-1 ring-line"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-3 block text-xs font-semibold tracking-brand text-mute",
						htmlFor: "invite-public-url",
						children: "Invitation link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "invite-public-url",
						readOnly: true,
						value: phase === "ready" ? link : phase === "error" ? "" : phase === "creating" ? "Creating the link…" : "",
						onFocus: (event) => event.currentTarget.select(),
						className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-sm text-cream ring-1 ring-line"
					}),
					link && inviteUrlIsLocal(link) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-caution",
						children: "This link is only available on your local machine."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-mute",
						children: "Nothing is sent until you press send in WhatsApp or another app."
					})
				]
			}) : null,
			slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
				mode: "dating",
				text: visibility === "mystery" ? "Less information. More confidence. I respect it." : "The note is ready. Send it when you are.",
				status: "good",
				mark: "吉"
			}) : null
		]
	});
}
function InvitationStatus({ plannerToken, slug, reply, updatedAt, error, onRefresh }) {
	const quote = reply?.replyNote?.trim() ?? "";
	const label = reply ? invitationStatusLabel(reply.status) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-4 rounded-2xl bg-panel px-4 py-4 ring-1 ring-line",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: "INVITATION"
				}), plannerToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onRefresh,
					className: "text-xs font-semibold text-mute",
					children: "Refresh"
				}) : null]
			}),
			!plannerToken && !slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm font-semibold text-cream",
				children: "NOT SENT"
			}) : null,
			plannerToken && !reply && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: "Checking the reply…"
			}) : null,
			label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: clsx("mt-2 text-sm font-semibold", reply?.status === "sounds_good" ? "text-leaf" : reply?.status === "alternate_time_requested" ? "tracking-brand text-accent" : "text-cream"),
				children: label
			}) : null,
			quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-cream",
				children: [
					"“",
					quote,
					"”"
				]
			}) : null,
			reply?.status === "alternate_time_requested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#dating-when",
				className: "press mt-3 inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
				children: "Review timing"
			}) : null,
			reply && reply.status !== "pending" && updatedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-mute",
				children: updatedLabel(updatedAt)
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-caution",
				children: error
			}) : null
		]
	});
}
var TYPE_LABEL = {
	first: "First date",
	casual: "Casual date",
	night: "Date night",
	anniversary: "Anniversary",
	surprise: "Surprise date",
	married: "Married couple",
	parents: "Parents’ night out"
};
var WHEN = [
	[
		"breakfast",
		"Breakfast",
		540
	],
	[
		"brunch",
		"Brunch",
		660
	],
	[
		"afternoon",
		"Afternoon",
		840
	],
	[
		"sunset",
		"Sunset",
		1050
	],
	[
		"dinner",
		"Dinner",
		1140
	],
	[
		"night",
		"Night",
		1230
	]
];
function sgtDate(offset = 0) {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(new Date(Date.now() + offset * 864e5));
}
function nextFriday() {
	const [year, month, day] = sgtDate().split("-").map(Number);
	const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
	const weekday = date.getUTCDay();
	const hop = weekday === 5 ? 0 : (5 - weekday + 7) % 7;
	date.setUTCDate(date.getUTCDate() + hop);
	return date.toISOString().slice(0, 10);
}
function timeValue(minutes) {
	return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
function dayName(date) {
	return new Intl.DateTimeFormat("en-SG", {
		weekday: "long",
		timeZone: "Asia/Singapore"
	}).format(/* @__PURE__ */ new Date(`${date}T12:00:00+08:00`));
}
function DatingStudio() {
	const [text, setText] = (0, import_react.useState)("");
	const [locks, setLocks] = (0, import_react.useState)({});
	const [intent, setIntent] = (0, import_react.useState)(null);
	const [reading, setReading] = (0, import_react.useState)(false);
	const [conflicts, setConflicts] = (0, import_react.useState)([]);
	const [hiddenChips, setHiddenChips] = (0, import_react.useState)([]);
	const [tightHop, setTightHop] = (0, import_react.useState)(false);
	const [avoid, setAvoid] = (0, import_react.useState)([]);
	const [pendingPlace, setPendingPlace] = (0, import_react.useState)("");
	const [dateType, setDateType] = (0, import_react.useState)("first");
	const [startMin, setStartMin] = (0, import_react.useState)(1140);
	const [span, setSpan] = (0, import_react.useState)("half");
	const [budget, setBudget] = (0, import_react.useState)(80);
	const [freeOnly, setFreeOnly] = (0, import_react.useState)(false);
	const [date, setDate] = (0, import_react.useState)(nextFriday);
	const [origin, setOrigin] = (0, import_react.useState)(null);
	const [lookup, setLookup] = (0, import_react.useState)("");
	const [lookups, setLookups] = (0, import_react.useState)([]);
	const [lookupNote, setLookupNote] = (0, import_react.useState)("");
	const [locating, setLocating] = (0, import_react.useState)(false);
	const searchGen = (0, import_react.useRef)(0);
	const parseGen = (0, import_react.useRef)(0);
	const locksRef = (0, import_react.useRef)(locks);
	locksRef.current = locks;
	const [maxTravel, setMaxTravel] = (0, import_react.useState)(30);
	const [travelMode, setTravelMode] = (0, import_react.useState)("drive");
	const [setting, setSetting] = (0, import_react.useState)("either");
	const [vibes, setVibes] = (0, import_react.useState)(["cosy", "quiet"]);
	const [foods, setFoods] = (0, import_react.useState)(["dinner", "dessert"]);
	const [pressure, setPressure] = (0, import_react.useState)("low");
	const [formality, setFormality] = (0, import_react.useState)("smart");
	const [alcohol, setAlcohol] = (0, import_react.useState)("any");
	const [crowd, setCrowd] = (0, import_react.useState)("ok");
	const [diets, setDiets] = (0, import_react.useState)([]);
	const [more, setMore] = (0, import_react.useState)(false);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [weather, setWeather] = (0, import_react.useState)(null);
	const [stops, setStops] = (0, import_react.useState)([]);
	const [backup, setBackup] = (0, import_react.useState)(null);
	const [planId, setPlanId] = (0, import_react.useState)("");
	const [restoreInvite, setRestoreInvite] = (0, import_react.useState)(false);
	const [score, setScore] = (0, import_react.useState)(null);
	const [datePlan, setDatePlan] = (0, import_react.useState)(null);
	const [spin, setSpin] = (0, import_react.useState)(0);
	const [spend, setSpend] = (0, import_react.useState)(null);
	const [why, setWhy] = (0, import_react.useState)("");
	const [eventsNote, setEventsNote] = (0, import_react.useState)("");
	const [widenNote, setWidenNote] = (0, import_react.useState)("");
	const [understood, setUnderstood] = (0, import_react.useState)([]);
	const [rejected, setRejected] = (0, import_react.useState)([]);
	const [rejectedVenues, setRejectedVenues] = (0, import_react.useState)([]);
	const [locked, setLocked] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const id = readDatingPlanId();
		if (!id) return;
		setPlanId(id);
		setRestoreInvite(Boolean(readDatingInviteLink(id)?.plannerToken));
	}, []);
	(0, import_react.useEffect)(() => {
		if (planId) saveDatingPlanId(planId);
	}, [planId]);
	function clearPlan() {
		setStops([]);
		setBackup(null);
		setScore(null);
		setDatePlan(null);
		setWeather(null);
		setWhy("");
		setUnderstood([]);
		setEventsNote("");
		setWidenNote("");
		setSpend(null);
		setRejected([]);
		setRejectedVenues([]);
		setLocked({});
	}
	function chooseOrigin(next, fromUser = true) {
		if (!Number.isFinite(next.latitude) || !Number.isFinite(next.longitude)) {
			setError("We couldn't verify this starting location.");
			return;
		}
		if (fromUser) setLocks((current) => ({
			...current,
			area: true
		}));
		setOrigin(next);
		setError("");
		clearPlan();
	}
	async function searchArea(raw = lookup) {
		const query = raw.trim();
		if (query.length < 2) {
			setLookups([]);
			setLookupNote(query ? "Type a little more of the place name." : "");
			return;
		}
		const gen = searchGen.current + 1;
		searchGen.current = gen;
		setLookupNote("");
		try {
			const found = await lookupPlace({ data: { query } });
			if (gen !== searchGen.current) return;
			const rows = found.slice(0, 5).map((hit) => ({
				source: "manual_search",
				provider: "photon",
				providerId: hit.providerId || `${hit.latitude.toFixed(5)},${hit.longitude.toFixed(5)}`,
				name: hit.name || hit.label,
				formattedAddress: hit.address || hit.label,
				area: hit.area || "",
				latitude: hit.latitude,
				longitude: hit.longitude
			}));
			setLookups(rows);
			if (!rows.length) setLookupNote("No places matched. Try a mall, an MRT, or a street.");
			else if (pendingPlace && !locksRef.current.area) {
				const match = rows.find((row) => row.name.toLowerCase().includes(pendingPlace.toLowerCase()));
				if (match) {
					setPendingPlace("");
					chooseOrigin(match, false);
				}
			}
		} catch {
			if (gen !== searchGen.current) return;
			setLookups([]);
			setLookupNote("Location search did not answer. Try again.");
		}
	}
	(0, import_react.useEffect)(() => {
		const query = lookup.trim();
		if (origin && (query === origin.name || query === origin.formattedAddress)) return;
		const handle = window.setTimeout(() => {
			searchArea(lookup);
		}, 350);
		return () => window.clearTimeout(handle);
	}, [lookup, origin]);
	function lock(key) {
		setLocks((current) => ({
			...current,
			[key]: true
		}));
		setConflicts((current) => current.filter((item) => item.key !== key));
	}
	function controlsNow() {
		return {
			dateType,
			date,
			startMin,
			span,
			budget,
			freeOnly,
			vibes,
			foods,
			setting,
			pressure,
			maxTravel,
			crowd
		};
	}
	function applyIntent(parsed, locked = locksRef.current) {
		setIntent(parsed);
		const { next, conflicts: found } = reconcileControls(controlsNow(), parsed, locked);
		setDateType(next.dateType);
		setDate(next.date);
		setStartMin(next.startMin);
		setSpan(next.span);
		setBudget(next.budget);
		setFreeOnly(next.freeOnly);
		setVibes(next.vibes);
		setFoods(next.foods);
		setSetting(next.setting);
		setPressure(next.pressure);
		setMaxTravel(next.maxTravel);
		setCrowd(next.crowd);
		setTightHop(!locked.travel && parsed.travelPreference === "short_second_leg");
		setAvoid(parsed.avoid);
		setConflicts(found);
		if (!locked.area && parsed.areaKind === "region" && parsed.areaLabel && parsed.latitude != null && parsed.longitude != null) {
			setLookup(parsed.areaLabel);
			setLookups([]);
			chooseOrigin({
				source: "manual_search",
				provider: "region",
				providerId: parsed.areaText || "region",
				name: parsed.areaLabel,
				formattedAddress: parsed.areaLabel,
				area: parsed.areaLabel,
				latitude: parsed.latitude,
				longitude: parsed.longitude
			}, false);
		} else if (!locked.area && parsed.areaKind === "place" && parsed.areaLabel) {
			setPendingPlace(parsed.areaLabel);
			setLookup(parsed.areaLabel);
		}
	}
	const applyRef = (0, import_react.useRef)(applyIntent);
	applyRef.current = applyIntent;
	function dismissChip(id, key) {
		lock(key);
		setHiddenChips((current) => [...current, id]);
		if (id.startsWith("vibe-")) {
			const vibe = id.slice(5);
			setVibes((current) => current.filter((item) => item !== vibe));
		}
		if (id === "area" && origin?.provider === "region") {
			setOrigin(null);
			setLookup("");
		}
		if (id === "talk") setCrowd("ok");
		if (id === "travel") {
			setTightHop(false);
			setMaxTravel(30);
		}
	}
	function useBrief(key) {
		const nextLocks = {
			...locksRef.current,
			[key]: false
		};
		locksRef.current = nextLocks;
		setLocks(nextLocks);
		if (intent) applyIntent(intent, nextLocks);
	}
	function understandNow() {
		const query = text.trim();
		if (query.length < 8) return;
		setReading(true);
		const gen = parseGen.current + 1;
		parseGen.current = gen;
		parseDateBrief({ data: {
			text: query,
			today: sgtDate()
		} }).then((parsed) => {
			if (gen !== parseGen.current) return;
			applyRef.current(parsed);
		}).catch(() => {
			if (gen !== parseGen.current) return;
		}).finally(() => {
			if (gen === parseGen.current) setReading(false);
		});
	}
	function pickBudget(amount) {
		lock("budget");
		if (amount === "free") {
			setFreeOnly(true);
			noteBudget("Free");
			return;
		}
		setFreeOnly(false);
		setBudget(amount);
		noteBudget(amount >= 250 ? "Premium" : `≤ $${amount}`);
	}
	function noteBudget(current) {
		if (!intent || intent.budgetMax == null) return;
		const suggested = budgetLabel(intent);
		if (suggested === current) {
			setConflicts((items) => items.filter((item) => item.key !== "budget"));
			return;
		}
		setConflicts((items) => [...items.filter((item) => item.key !== "budget"), {
			key: "budget",
			suggested,
			current
		}]);
	}
	function useCurrent() {
		if (!navigator.geolocation) return;
		setLocating(true);
		navigator.geolocation.getCurrentPosition(async (position) => {
			try {
				const hit = await reversePlace({ data: {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				} });
				chooseOrigin({
					source: "current",
					provider: "geolocation",
					providerId: "",
					name: hit?.name || "Current location",
					formattedAddress: hit?.address || "Current location",
					area: hit?.area || "",
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			} finally {
				setLocating(false);
			}
		}, () => setLocating(false), {
			enableHighAccuracy: true,
			timeout: 1e4,
			maximumAge: 3e5
		});
	}
	async function buildDate(extraRejected, indoor = false, nextSpin = spin, extraNames) {
		if (!origin || !Number.isFinite(origin.latitude) || !Number.isFinite(origin.longitude)) {
			setError("We couldn't verify this starting location.");
			return;
		}
		setError("");
		setPending(true);
		const nextRejected = extraRejected ?? rejected;
		const nextNames = extraNames ?? rejectedVenues;
		try {
			const result = await planDate({ data: {
				dateType,
				date,
				whenLabel: clockLabel(startMin),
				startMin,
				span,
				budget: freeOnly ? 0 : budget,
				freeOnly,
				latitude: origin.latitude,
				longitude: origin.longitude,
				area: origin.name,
				originAddress: origin.source === "home" ? "" : origin.formattedAddress,
				originProvider: origin.provider,
				originId: origin.providerId,
				maxTravel,
				travelMode,
				setting: indoor ? "indoor" : setting,
				vibes,
				foods,
				pressure,
				formality,
				alcohol,
				crowd,
				diets,
				goal: pressure === "low" ? "Get to know each other" : pressure === "memorable" ? "Celebrate" : "Spend quality time",
				text,
				rejected: nextRejected,
				rejectedVenues: nextNames,
				seen: readSeenPlaces(origin.latitude, origin.longitude),
				spin: nextSpin,
				tightSecondLeg: tightHop,
				avoid,
				locked: stops.filter((stop) => locked[stop.placeId]).map((stop) => ({
					placeId: stop.placeId,
					title: stop.title,
					address: stop.address,
					latitude: stop.latitude,
					longitude: stop.longitude,
					setting: stop.setting,
					kind: stop.kind
				}))
			} });
			setWeather(result.weather);
			setStops(result.stops);
			setBackup(result.backup);
			setScore(result.score);
			setDatePlan(result.plan);
			setPlanId((current) => current || generateInviteSlug());
			setSpend(result.spend);
			setWhy(result.why);
			setEventsNote(result.eventsNote);
			setWidenNote(result.widenNote ?? "");
			setUnderstood(result.understood);
			if (result.discovery) console.info("[DATE DISCOVERY]", result.discovery);
			if (result.stops.length) rememberSeenPlaces(origin.latitude, origin.longitude, result.stops.flatMap((stop) => [stop.placeId, stop.title]));
			if (!result.stops.length) setError(travelMode === "transit" ? "Nothing real fitted that travel limit." : "Nothing real fitted that brief. Widen the travel time or the budget.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "The date plan did not land.");
		} finally {
			setPending(false);
		}
	}
	function suggestedName(title) {
		return title.replace(/^Explore\s+/i, "").replace(/\s+\+\s+waterfront$/i, "").trim();
	}
	function rememberRejected() {
		const open = stops.filter((stop) => !locked[stop.placeId]);
		const names = open.map((stop) => suggestedName(stop.title)).filter(Boolean);
		const ids = open.map((stop) => stop.placeId).filter(Boolean);
		const nextNames = [.../* @__PURE__ */ new Set([...rejectedVenues, ...names])].slice(0, 48);
		const nextRejected = [.../* @__PURE__ */ new Set([
			...rejected,
			...ids,
			...nextNames
		])].slice(0, 48);
		setRejectedVenues(nextNames);
		setRejected(nextRejected);
		return {
			nextNames,
			nextRejected
		};
	}
	function another() {
		setPlanId(generateInviteSlug());
		const { nextNames, nextRejected } = rememberRejected();
		const nextSpin = spin + 1;
		setSpin(nextSpin);
		buildDate(nextRejected, false, nextSpin, nextNames);
	}
	function differentShape() {
		const { nextNames, nextRejected } = rememberRejected();
		const nextSpin = spin + 1;
		setSpin(nextSpin);
		buildDate(nextRejected, false, nextSpin, nextNames);
	}
	const mark = markOf(readReading(`${date}T${String(Math.floor(startMin / 60)).padStart(2, "0")}:00:00+08:00`, "date evening").score);
	async function onSave() {
		if (!origin || !score) return;
		const payload = {
			title: `${TYPE_LABEL[dateType]} · ${dayName(date)}`,
			date,
			dateType,
			budget,
			travelMode,
			area: origin.source === "home" ? "Home" : origin.name,
			startTime: clockLabel(startMin),
			duration: span,
			preferences: {
				setting,
				pressure,
				formality,
				alcohol,
				originName: origin.name,
				originAddress: origin.source === "home" ? "" : origin.formattedAddress,
				originProvider: origin.provider,
				originId: origin.providerId,
				latitude: String(origin.latitude),
				longitude: String(origin.longitude)
			},
			datingScore: score.total,
			stops: stops.map((stop, index) => ({
				sequence: index,
				stopType: stop.kind,
				title: stop.title,
				address: stop.address,
				latitude: stop.latitude,
				longitude: stop.longitude,
				startTime: clockLabel(stop.startMin),
				endTime: clockLabel(stop.endMin),
				estimatedCost: stop.cost,
				indoorOutdoor: stop.setting,
				sourceUrl: "",
				sourceType: "place",
				locked: Boolean(locked[stop.placeId])
			}))
		};
		localStorage.setItem("kairos-dating-plan", JSON.stringify(payload));
		try {
			const saved = await saveDatingPlan({ data: payload });
			toast.success(saved.saved ? "Date saved" : "Saved on this browser. The dating tables are not in Supabase yet.");
		} catch {
			toast.success("Saved on this browser");
		}
	}
	function onCalendar() {
		if (!stops[0]) return;
		const start = /* @__PURE__ */ new Date(`${date}T${String(Math.floor(startMin / 60)).padStart(2, "0")}:${String(startMin % 60).padStart(2, "0")}:00+08:00`);
		const end = stops[stops.length - 1]?.endMin ?? startMin + 120;
		window.open(createGoogleCalendarUrl({
			title: TYPE_LABEL[dateType],
			startTime: start.toISOString(),
			durationMinutes: Math.max(60, end - startMin),
			meetingFormat: "physical",
			venueName: stops[0].title,
			address: stops[0].address,
			purpose: stops.map((stop) => `${clockLabel(stop.startMin)} ${stop.title}, ${stop.address}`).join("\n"),
			kairosScore: score?.total ?? null
		}), "_blank", "noopener,noreferrer");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "lg:col-span-2",
		onSubmit: (event) => {
			event.preventDefault();
			if (!origin && lookup.trim().length >= 2) {
				searchArea();
				return;
			}
			setRejected([]);
			setLocked({});
			setSpin(0);
			buildDate([], false, 0);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanningBrief, {
				mode: "dating",
				kicker: "DATING",
				question: "What kind of date are we planning?",
				hint: "Give me the mood. I'll build the evening: what you do, where you eat, and how you move.",
				placeholder: "First date, east side, Friday evening. Cosy, not expensive, somewhere we can actually talk.",
				value: text,
				onChange: setText,
				onUnderstand: () => void understandNow(),
				reading,
				failed: false,
				chips: intent ? intentChips(intent).filter((chip) => !hiddenChips.includes(chip.id)) : [],
				onRemove: (chip) => dismissChip(chip.id, chip.lock),
				aside: intent?.aside ?? "",
				conflicts,
				onKeep: (key) => setConflicts((items) => items.filter((item) => item.key !== key)),
				onUse: (key) => useBrief(key)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Date type"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: DATE_TYPES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: dateType === item,
					onClick: () => {
						lock("dateType");
						setDateType(item);
					},
					children: TYPE_LABEL[item]
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: "dating-when",
				className: "mt-4 text-sm font-medium text-cream",
				children: "Time"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: WHEN.map(([id, label, minutes]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: startMin === minutes,
					onClick: () => {
						lock("time");
						setStartMin(minutes);
					},
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 flex items-center justify-between gap-3 rounded-xl bg-ink px-3 py-2 ring-1 ring-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-cream",
					children: ["Start at ", clockLabel(startMin)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "time",
					value: timeValue(startMin),
					onChange: (event) => {
						const [hour, minute] = event.target.value.split(":").map(Number);
						if (!Number.isFinite(hour) || !Number.isFinite(minute)) return;
						lock("time");
						setStartMin(Math.min(1425, Math.max(360, hour * 60 + minute)));
					},
					className: "h-11 bg-transparent text-cream"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: date === sgtDate(),
						onClick: () => {
							lock("date");
							setDate(sgtDate());
						},
						children: "Today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: date === sgtDate(1),
						onClick: () => {
							lock("date");
							setDate(sgtDate(1));
						},
						children: "Tomorrow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: date === nextFriday(),
						onClick: () => {
							lock("date");
							setDate(nextFriday());
						},
						children: "This Friday"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "date",
				value: date,
				onChange: (event) => {
					lock("date");
					setDate(event.target.value);
				},
				className: "mt-2 h-12 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "What kind of plan?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: span === "quick",
						onClick: () => {
							lock("span");
							setSpan("quick");
						},
						children: "Food only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: span === "half",
						onClick: () => {
							lock("span");
							setSpan("half");
						},
						children: "Half day with food"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: span === "full",
						onClick: () => {
							lock("span");
							setSpan("full");
						},
						children: "Full day with food"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-mute",
				children: "Food only is one sitting. Anything longer is a full date: something you do, a table, the move between them, and a rain plan."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Budget, for two"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: freeOnly,
						onClick: () => pickBudget("free"),
						children: "Free"
					}),
					[
						30,
						60,
						80,
						100,
						150
					].map((amount) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: !freeOnly && budget === amount,
						onClick: () => pickBudget(amount),
						children: `≤ $${amount}`
					}, amount)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: !freeOnly && budget === 250,
						onClick: () => pickBudget(250),
						children: "Premium"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Starting from"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: origin?.source === "home",
					onClick: () => {
						const home = readHome();
						if (home?.latitude == null || home.longitude == null) {
							setError("Set your home location.");
							return;
						}
						chooseOrigin({
							source: "home",
							provider: "saved",
							providerId: "home",
							name: "Home",
							formattedAddress: home.address,
							area: "",
							latitude: home.latitude,
							longitude: home.longitude
						});
					},
					children: "Home"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: origin?.source === "current",
					onClick: useCurrent,
					children: locating ? "Finding you…" : "Current location"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: lookup,
					onChange: (event) => setLookup(event.target.value),
					onKeyDown: (event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							searchArea();
						}
					},
					placeholder: "Oasia Resort Sentosa, a mall, a postal code",
					className: "h-12 min-w-0 flex-1 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void searchArea(),
					className: "press h-12 shrink-0 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
					children: "Find"
				})]
			}),
			lookupNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: lookupNote
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-2",
				children: lookups.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setLookup(hit.name);
						setLookups([]);
						chooseOrigin(hit);
					},
					className: "press block w-full rounded-xl bg-ink px-3 py-3 text-left ring-1 ring-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-semibold text-cream",
							children: hit.name
						}),
						hit.area ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-sky",
							children: hit.area
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-mute",
							children: hit.formattedAddress
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-2 inline-flex text-sm font-semibold text-accent",
							children: "Use this location"
						})
					]
				}, hit.providerId))
			}),
			origin?.source === "manual_search" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					writeHome({
						name: "Home",
						address: origin.formattedAddress,
						areaId: "",
						latitude: origin.latitude,
						longitude: origin.longitude
					});
					toast.success("Home saved on this browser");
				},
				className: "press mt-2 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
				children: "Save as Home"
			}) : null,
			origin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-xl bg-ink px-3 py-3 ring-1 ring-accent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-accent",
						children: "SEARCHING FROM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-semibold text-cream",
						children: origin.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mute",
						children: origin.source === "home" ? "Saved on this browser. The street stays off shared invites." : origin.formattedAddress
					}),
					origin.area ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-sky",
						children: origin.area
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: "Choose a result. Typing a name does not set the start."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Travel limit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [[
					15,
					30,
					45
				].map((minutes) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: maxTravel === minutes,
					onClick: () => {
						lock("travel");
						setTightHop(false);
						setMaxTravel(minutes);
						clearPlan();
					},
					children: `${minutes} min`
				}, minutes)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: maxTravel === 90,
					onClick: () => {
						lock("travel");
						setTightHop(false);
						setMaxTravel(90);
						clearPlan();
					},
					children: "No preference"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					["drive", "Drive"],
					["walk", "Walk"],
					["ride", "Taxi"],
					["transit", "Public transport"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: travelMode === id,
					onClick: () => {
						setTravelMode(id);
						clearPlan();
					},
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Indoor / outdoor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					"indoor",
					"outdoor",
					"either",
					"mix"
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: setting === item,
					onClick: () => {
						lock("setting");
						setSetting(item);
					},
					children: item === "mix" ? "Mixed" : item[0]?.toUpperCase() + item.slice(1)
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Vibe"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: DATE_VIBES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: vibes.includes(item),
					onClick: () => {
						lock("vibes");
						setVibes((current) => current.includes(item) ? current.filter((id) => id !== item) : [...current, item]);
					},
					children: item[0]?.toUpperCase() + item.slice(1)
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-medium text-cream",
				children: "Food and activity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: DATE_FOODS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: foods.includes(item),
					onClick: () => {
						lock("foods");
						setFoods((current) => current.includes(item) ? current.filter((id) => id !== item) : [...current, item]);
					},
					children: item[0]?.toUpperCase() + item.slice(1)
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setMore((value) => !value),
				className: "mt-4 text-sm font-semibold text-accent",
				children: more ? "Hide preferences" : "More preferences"
			}),
			more ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: pressure === "low",
								onClick: () => {
									lock("pressure");
									setPressure("low");
								},
								children: "Low-pressure"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: pressure === "balanced",
								onClick: () => {
									lock("pressure");
									setPressure("balanced");
								},
								children: "Balanced"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: pressure === "memorable",
								onClick: () => {
									lock("pressure");
									setPressure("memorable");
								},
								children: "Make it memorable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: formality === "casual",
								onClick: () => setFormality("casual"),
								children: "Casual"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: formality === "smart",
								onClick: () => setFormality("smart"),
								children: "Smart casual"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: formality === "dress",
								onClick: () => setFormality("dress"),
								children: "Dress up"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: alcohol === "none",
								onClick: () => setAlcohol("none"),
								children: "No alcohol"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: alcohol === "ok",
								onClick: () => setAlcohol("ok"),
								children: "Drinks okay"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: crowd === "avoid",
								onClick: () => {
									lock("crowd");
									setCrowd("avoid");
								},
								children: "Avoid crowds"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: crowd === "lively",
								onClick: () => {
									lock("crowd");
									setCrowd("lively");
								},
								children: "Lively is okay"
							}),
							[
								"halal",
								"vegetarian",
								"vegan"
							].map((diet) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: diets.includes(diet),
								onClick: () => setDiets((current) => current.includes(diet) ? current.filter((item) => item !== diet) : [...current, diet]),
								children: diet
							}, diet))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-mute",
						children: "Noise and crowds are not measured. Diet is only applied when a place actually lists it."
					})
				]
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mt-4 text-sm text-vermilion",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: pending || !origin,
				className: "press mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-accent-ink disabled:opacity-50",
				children: pending ? "Building the date…" : "Build the date"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "lg:col-span-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-2xl bg-panel p-5 shadow-card sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: datePlan ? "THE DATE" : "THE EVENING"
				}),
				datePlan && stops.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-sans text-3xl font-semibold leading-tight text-cream",
						children: datePlan.title
					}),
					datePlan.partial ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm font-semibold text-sky",
						children: "Only a partial plan could be verified."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base leading-relaxed text-cream",
						children: datePlan.thesis
					}),
					widenNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-cream",
						children: widenNote
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-mute",
						children: datePlan.arc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-l-2 border-accent pl-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-brand text-accent",
									children: "HOW LONG"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm leading-relaxed text-cream",
									children: datePlan.pacing
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-l-2 border-accent pl-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-brand text-accent",
									children: "WHAT TO WEAR"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm leading-relaxed text-cream",
									children: datePlan.dress
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-l-2 border-accent pl-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-brand text-accent",
									children: "IF IT RAINS"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm leading-relaxed text-cream",
									children: datePlan.rain
								})]
							})
						]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-sans text-3xl font-semibold leading-tight text-cream",
					children: "Tell me the mood. I’ll come back with the evening, not a list of restaurants."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor, {
							kicker: "VIBE FIT",
							value: vibes.slice(0, 2).join(" · ") || "Open",
							note: TYPE_LABEL[dateType]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor, {
							kicker: "PRACTICAL FIT",
							value: freeOnly ? "Free" : `≤ $${budget} total`,
							note: `${maxTravel === 90 ? "Travel open" : `${maxTravel} min travel`} · ${origin?.name ?? "Start not set"}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factor, {
							kicker: "MOMENT FIT",
							value: clockLabel(startMin),
							note: `${dayName(date)} · ${WHEN.find((item) => item[2] === startMin)?.[1] ?? "Your time"}`
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-1 text-sm text-cream",
					children: (understood.length ? understood : [
						"What the two of you actually do",
						"A table, not a crawl",
						"A different plan if you ask again"
					]).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
				}),
				stops.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 space-y-3",
					children: stops.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-ink px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold tracking-brand text-sky",
								children: [
									clockLabel(stop.startMin),
									"–",
									clockLabel(stop.endMin)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold tracking-brand text-accent",
										children: stop.slot
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-2xl text-cream",
										children: stop.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-cream",
										children: stop.doThis
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-mute",
										children: stop.address
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-sm text-mute",
										children: [
											stop.travelLabel,
											" · ",
											stop.setting === "indoor" ? "Indoor" : "Outdoor",
											stop.cost == null ? " · Price unavailable" : ` · typical ~$${stop.cost}/pax`
										]
									}),
									stop.opening ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-mute",
										children: ["Hours on the map: ", stop.opening]
									}) : null,
									stop.why && stop.why !== stop.doThis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-mute",
										children: stop.why
									}) : null
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": Boolean(locked[stop.placeId]),
									onClick: () => setLocked((current) => ({
										...current,
										[stop.placeId]: !current[stop.placeId]
									})),
									className: clsx("press min-h-11 shrink-0 rounded-xl px-3 text-sm font-semibold", locked[stop.placeId] ? "bg-accent text-accent-ink" : "text-accent ring-1 ring-accent"),
									children: locked[stop.placeId] ? "Keep" : "Lock"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalActions, { input: {
								mode: "dating",
								kind: stop.kind === "meal" || stop.kind === "cafe" ? "restaurant" : "activity",
								countryCode: "SG",
								navMode: "walk",
								from: (() => {
									const index = stops.findIndex((item) => item.id === stop.id);
									const previous = stops[index - 1];
									if (previous) return {
										lat: previous.latitude,
										lng: previous.longitude,
										name: previous.title
									};
									return origin ? {
										lat: origin.latitude,
										lng: origin.longitude,
										name: origin.name
									} : void 0;
								})(),
								place: {
									id: stop.placeId,
									name: stop.title,
									address: stop.address,
									city: "Singapore",
									countryCode: "SG",
									lat: stop.latitude,
									lng: stop.longitude
								}
							} })
						]
					}, stop.id))
				}) : null,
				backup && setting !== "indoor" && stops.some((stop) => stop.setting !== "indoor") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl bg-ink px-4 py-4 ring-1 ring-sky",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-sky",
							children: "RAIN BACKUP"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-2xl text-cream",
							children: backup.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-cream",
							children: backup.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-mute",
							children: backup.travelLabel
						})
					]
				}) : null,
				score ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-xl bg-ink px-4 py-4 ring-1 ring-accent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "DATE FIT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-display text-4xl text-accent",
							children: [score.total, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl text-mute",
								children: " / 100"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-1 text-sm text-cream",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: score.vibe >= 12 ? "Good setting for a conversation" : "The vibe is a loose fit" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: score.value >= 8 ? "Within the budget you set" : "Budget is tight, or a price is missing" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: stops.some((stop) => stop.travelLabel.includes("estimated")) ? "Public transport time is an estimate, not a live bus." : stops.some((stop) => stop.travelMin != null) ? "Travel between stops is a real route." : "Travel time was not verified." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: weather ? `Weather: ${weather.windowNote}` : "Weather did not come back" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
							mode: "dating",
							text: why,
							status: setting !== "indoor" && weather && !weather.afternoonOutdoor ? "warning" : mark === "吉" ? "good" : "neutral",
							mark: mark === "吉" ? "吉" : void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-mute",
							children: spend == null ? "Estimated spend: price unavailable" : `Typical couple spend ~$${spend}. Not a quote.`
						}),
						eventsNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-mute",
							children: eventsNote
						}) : null
					]
				}) : null,
				stops.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: another,
							className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
							children: "A different date"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: differentShape,
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
							children: "Different shape"
						}),
						setting !== "indoor" && stops.some((stop) => stop.setting !== "indoor") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void buildDate(rejected, true),
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-sky ring-1 ring-sky",
							children: "Rain backup"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void onSave(),
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
							children: "Save plan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onCalendar,
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
							children: "Add to calendar"
						})
					]
				}) : null,
				stops.length && origin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatingInvitePanel, {
					planId,
					date,
					dateType,
					weekday: dayName(date),
					when: clockLabel(startMin),
					span,
					areaLabel: origin.name,
					formality,
					vibes,
					stops,
					mark
				}) : restoreInvite && planId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatingInvitePanel, {
					statusOnly: true,
					planId,
					date,
					dateType,
					weekday: dayName(date),
					when: clockLabel(startMin),
					span,
					areaLabel: origin?.name ?? "",
					formality,
					vibes,
					stops,
					mark
				}) : null
			]
		})
	})] });
}
function Factor({ kicker, value, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-l-2 border-accent pl-3 text-accent",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-lg font-semibold text-cream",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: note
			})
		]
	});
}
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", on ? "bg-accent text-accent-ink" : "bg-panel text-cream ring-1 ring-line"),
		children
	});
}
var todayWeather = createServerFn({ method: "POST" }).validator((input) => object({
	date: string(),
	latitude: number(),
	longitude: number()
}).parse(input)).handler(createSsrRpc("fed238c535e248a1dce1402c7c70a342edbd7f2b5cee70ea9d6b47e50f2746b1"));
var todayRoutes = createServerFn({ method: "POST" }).validator((input) => object({ pairs: array(object({
	key: string(),
	from: object({
		lat: number(),
		lng: number()
	}),
	to: object({
		lat: number(),
		lng: number()
	})
})).max(12) }).parse(input)).handler(createSsrRpc("9aff3b83a2c635aacc63ab55463d8cdf260cb1fa80f9c2423d6cd9e0c809b5b9"));
var parseToday = createServerFn({ method: "POST" }).validator((input) => object({
	text: string().min(2).max(240),
	date: string()
}).parse(input)).handler(createSsrRpc("005fba698d594760ed8c043ad00e6dcacb192674a659ab85fc4647e2401f427a"));
var explainToday = createServerFn({ method: "POST" }).validator((input) => object({ facts: string().max(1200) }).parse(input)).handler(createSsrRpc("0078b9e4d1d785f6da7f5b22862f0e967ee845530d4f33f8200251065e952a72"));
var ITEMS = "kairos-today-items";
var MEETS = "kairos-meet-pins";
function readTodayItems() {
	return read(ITEMS);
}
function writeTodayItems(items) {
	localStorage.setItem(ITEMS, JSON.stringify(items));
}
function readMeetPins() {
	if (typeof localStorage === "undefined") return [];
	try {
		const raw = JSON.parse(localStorage.getItem(MEETS) ?? "[]");
		return Array.isArray(raw) ? raw : [];
	} catch {
		return [];
	}
}
function pinMeet(pin) {
	const next = [pin, ...readMeetPins().filter((item) => item.code !== pin.code)].slice(0, 12);
	localStorage.setItem(MEETS, JSON.stringify(next));
}
function readJson(key) {
	if (typeof localStorage === "undefined") return null;
	try {
		return JSON.parse(localStorage.getItem(key) ?? "null");
	} catch {
		return null;
	}
}
function read(key) {
	if (typeof localStorage === "undefined") return [];
	try {
		const raw = JSON.parse(localStorage.getItem(key) ?? "[]");
		return Array.isArray(raw) ? raw.filter((item) => item && typeof item.id === "string" && typeof item.date === "string") : [];
	} catch {
		return [];
	}
}
function blankItem(date, kind) {
	return {
		id: `manual-${Date.now().toString(36)}`,
		sourceType: "manual",
		sourceId: "",
		title: "",
		kind,
		date,
		startMin: 900,
		endMin: 930,
		place: null,
		status: kind === "task" || kind === "errand" ? "flexible" : "tentative",
		flexible: kind === "task" || kind === "errand" || kind === "personal",
		locked: kind === "appointment",
		notes: "",
		online: false,
		outdoor: false,
		href: ""
	};
}
var KIND = {
	meet: "Meet",
	makan: "Makan",
	out: "Team Out",
	family: "Family",
	date: "Date",
	task: "Task",
	errand: "Errand",
	appointment: "Appointment",
	personal: "Personal",
	travel: "Travel"
};
function isoDate(offset = 0) {
	const now = sgtNow();
	const day = addCalendarDays(now.y, now.m, now.d, offset);
	return `${day.y}-${String(day.m).padStart(2, "0")}-${String(day.d).padStart(2, "0")}`;
}
function shift(date, days) {
	const [year, month, day] = date.split("-").map(Number);
	const next = addCalendarDays(year ?? 2026, month ?? 1, day ?? 1, days);
	return `${next.y}-${String(next.m).padStart(2, "0")}-${String(next.d).padStart(2, "0")}`;
}
function heading(date) {
	const now = sgtNow();
	const minutes = now.hour * 60 + now.minute;
	const greet = date !== isoDate() ? "The day" : minutes < 720 ? "Good morning" : minutes < 1020 ? "Good afternoon" : "Good evening";
	const [weekday, ...rest] = new Intl.DateTimeFormat("en-SG", {
		timeZone: "Asia/Singapore",
		weekday: "long",
		day: "numeric",
		month: "long"
	}).format(/* @__PURE__ */ new Date(`${date}T12:00:00+08:00`)).split(" ");
	return {
		greet,
		weekday: weekday?.replace(",", "") ?? "",
		rest: rest.join(" ")
	};
}
function TodayStudio() {
	const [date, setDate] = (0, import_react.useState)(isoDate);
	const [manual, setManual] = (0, import_react.useState)([]);
	const [locks, setLocks] = (0, import_react.useState)({});
	const [legs, setLegs] = (0, import_react.useState)([]);
	const [weather, setWeather] = (0, import_react.useState)("");
	const [weatherState, setWeatherState] = (0, import_react.useState)("loading");
	const [outdoorLater, setOutdoorLater] = (0, import_react.useState)(true);
	const [voice, setVoice] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)("");
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [parsed, setParsed] = (0, import_react.useState)(null);
	const [windowUse, setWindowUse] = (0, import_react.useState)(null);
	const [proposal, setProposal] = (0, import_react.useState)(null);
	const [moves, setMoves] = (0, import_react.useState)([]);
	const [routing, setRouting] = (0, import_react.useState)(false);
	const [ignored, setIgnored] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setManual(readTodayItems());
		try {
			const raw = JSON.parse(localStorage.getItem("kairos-today-locks") ?? "{}");
			if (raw && typeof raw === "object") setLocks(raw);
		} catch {
			setLocks({});
		}
	}, []);
	const items = (0, import_react.useMemo)(() => {
		const family = itemsFromFamily(date, readJson("kairos-family-plan"));
		const savedPlan = readJson("kairos-dating-plan");
		const agreed = readConfirmedDating(date);
		const datingSource = Boolean(savedPlan && typeof savedPlan === "object" && savedPlan.date === date) ? {
			...savedPlan,
			confirmed: Boolean(agreed)
		} : savedPlan;
		const dating = itemsFromDating(date, datingSource);
		const agreedItem = dating.length || !agreed ? [] : [confirmedInviteItem(date, agreed)];
		const meets = itemsFromMeets(date, readMeetPins());
		const travel = itemsFromTravel(date, readJson("kairos-travel-plan"));
		return activeItems([
			...itemsForDate(manual, date),
			...family,
			...dating,
			...agreedItem,
			...meets,
			...travel
		]).map((item) => locks[item.id] == null ? item : {
			...item,
			locked: locks[item.id] ?? item.locked,
			flexible: !(locks[item.id] ?? item.locked)
		});
	}, [
		date,
		manual,
		locks
	]);
	const routeKey = travelPairs(items).map((pair) => pair.key).join(";");
	(0, import_react.useEffect)(() => {
		const pairs = travelPairs(items).map((pair) => ({
			key: pair.key,
			from: pair.from,
			to: pair.to
		}));
		if (!pairs.length) {
			setLegs([]);
			return;
		}
		let cancel = false;
		setRouting(true);
		todayRoutes({ data: { pairs } }).then((result) => {
			if (!cancel) setLegs(result.map((leg) => ({
				...leg,
				fromId: leg.key.split("|")[0] ?? "",
				toId: leg.key.split("|")[2] ?? ""
			})));
		}).catch(() => {
			if (!cancel) setLegs([]);
		}).finally(() => {
			if (!cancel) setRouting(false);
		});
		return () => {
			cancel = true;
		};
	}, [routeKey]);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		setWeatherState("loading");
		todayWeather({ data: {
			date,
			latitude: 1.3521,
			longitude: 103.8198
		} }).then((result) => {
			if (cancel) return;
			if (!result) {
				setWeather("");
				setWeatherState("none");
				return;
			}
			setWeather(result.summary);
			setOutdoorLater(result.afternoonOutdoor);
			setWeatherState("ready");
		}).catch(() => {
			if (!cancel) setWeatherState("none");
		});
		return () => {
			cancel = true;
		};
	}, [date]);
	const windows = freeWindows(items, legs);
	const conflicts = findConflicts(items, legs).filter((item) => !ignored.includes(item.id));
	const tasks = items.filter((item) => item.kind === "task" || item.kind === "errand");
	const plans = items.filter((item) => item.kind !== "task" && item.kind !== "errand");
	const aside = dayAside({
		plans: plans.length,
		tasks: tasks.filter((item) => item.status !== "completed").length,
		windows,
		conflicts,
		tight: !outdoorLater && items.some((item) => item.outdoor) ? "Rain is in the forecast. Keep the outdoor plan earlier." : void 0
	});
	(0, import_react.useEffect)(() => {
		const facts = JSON.stringify({
			plans: plans.map((item) => item.title),
			tasks: tasks.filter((item) => item.status !== "completed").map((item) => item.title),
			conflicts: conflicts.map((item) => item.text),
			free: windows.map((item) => clockLabel(item.startMin)),
			weather: weather || "unavailable"
		});
		let cancel = false;
		explainToday({ data: { facts } }).then((line) => {
			if (!cancel && line) setVoice(line);
		}).catch(() => void 0);
		return () => {
			cancel = true;
		};
	}, [
		date,
		items.map((item) => item.id).join(","),
		conflicts.length,
		weather
	]);
	function saveManual(next) {
		setManual(next);
		writeTodayItems(next);
	}
	function commit(item) {
		saveManual([item, ...manual.filter((entry) => entry.id !== item.id)]);
		setAdding(false);
		setParsed(null);
		setDraft("");
		setWindowUse(null);
	}
	async function readDraft() {
		const text = draft.trim();
		if (text.length < 2) return;
		const result = await parseToday({ data: {
			text,
			date
		} }).catch(() => null);
		const start = result?.startMin ?? result?.deadlineMin ?? 960;
		const duration = result?.duration ?? 30;
		const item = blankItem(result?.date || date, result?.kind ?? "task");
		item.title = result?.title || text;
		item.date = result?.date || date;
		item.startMin = result?.deadlineMin != null ? Math.max(480, result.deadlineMin - duration) : start;
		item.endMin = (result?.deadlineMin ?? item.startMin) + (result?.deadlineMin != null ? 0 : duration);
		if (result?.deadlineMin != null) item.endMin = result.deadlineMin;
		item.flexible = result?.flexible ?? true;
		item.locked = !item.flexible;
		item.notes = result?.deadlineMin != null ? `Before ${clockLabel(result.deadlineMin)}` : "";
		setParsed(item);
	}
	function applyReplan() {
		if (!proposal) return;
		const manualIds = new Set(manual.map((item) => item.id));
		saveManual(proposal.filter((item) => manualIds.has(item.id) || item.sourceType === "manual"));
		setProposal(null);
	}
	const head = heading(date);
	const now = sgtNow();
	const nowMin = now.hour * 60 + now.minute;
	const viewingToday = date === isoDate();
	const next = items.find((item) => item.endMin >= nowMin) ?? items[0];
	const nextLeave = next ? leaveBy(next.startMin, legs.find((leg) => leg.toId === next.id)?.minutes ?? null) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg:col-span-5 grid items-start gap-8 lg:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "lg:col-span-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: head.greet
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-4xl text-cream",
							children: head.weekday
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg text-cream",
							children: head.rest
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-mute",
							children: "Singapore"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDate(shift(date, -1)),
								className: "press grid size-11 place-items-center rounded-xl bg-ink text-cream ring-1 ring-line",
								"aria-label": "Previous day",
								children: "←"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDate(isoDate()),
								className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", date === isoDate() ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
								children: "Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDate(shift(date, 1)),
								className: "press grid size-11 place-items-center rounded-xl bg-ink text-cream ring-1 ring-line",
								"aria-label": "Next day",
								children: "→"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: date,
					onChange: (event) => event.target.value && setDate(event.target.value),
					className: "mt-3 h-11 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-cream",
					children: [
						plans.length,
						" ",
						plans.length === 1 ? "plan" : "plans",
						" · ",
						tasks.filter((item) => item.status !== "completed").length,
						" ",
						tasks.length === 1 ? "task" : "tasks",
						" · ",
						windows.length,
						" free ",
						windows.length === 1 ? "window" : "windows"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-sky",
					children: weatherState === "loading" ? "Checking weather…" : weatherState === "none" ? "Weather unavailable" : weather
				}),
				!outdoorLater && items.some((item) => item.outdoor) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-caution",
					children: "Rain is expected later. Outdoor plans are safer earlier."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setAdding(true);
								setParsed(null);
							},
							className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
							children: "+ Add"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const result = replanDay(items, legs);
								setProposal(result.next);
								setMoves(result.moves.map((move) => move.to == null ? move.reason : `${move.title}: ${clockLabel(move.from)} → ${clockLabel(move.to)}`));
							},
							className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
							children: "Replan my day"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
								className: "press flex min-h-11 cursor-pointer list-none items-center rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
								children: "Find something"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute z-10 mt-2 flex w-48 flex-col rounded-xl bg-panel p-2 ring-1 ring-line",
								children: [
									["makan", "Makan"],
									["family", "Family"],
									["dating", "Dating"],
									["out", "Team Out"]
								].map(([mode, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									search: {
										mode,
										code: ""
									},
									className: "press min-h-11 rounded-lg px-3 py-2 text-sm text-cream",
									children: label
								}, mode))
							})]
						})
					]
				}),
				items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-2xl bg-panel px-5 py-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "YOUR DAY IS OPEN"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-lg text-cream",
							children: "Nothing scheduled yet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAdding(true),
							className: "press mt-4 min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
							children: "Add something"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
							mode: "today",
							text: "Rare sighting: an empty day."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "today-spine mt-8 space-y-3",
					children: [
						viewingToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "today-now text-xs font-semibold tracking-brand",
							children: ["NOW · ", clockLabel(nowMin)]
						}) : null,
						items.map((item, index) => {
							const previous = items[index - 1];
							const leg = previous ? legs.find((entry) => entry.fromId === previous.id && entry.toId === item.id) : void 0;
							const depart = leaveBy(item.startMin, leg?.minutes ?? null);
							const past = viewingToday && item.endMin < nowMin;
							const conflict = conflicts.find((entry) => entry.afterId === item.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								leg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 text-sm text-mute",
									children: leg.minutes == null ? "Travel time unavailable" : `Drive ${leg.minutes} min`
								}) : null,
								!leg && previous && !previous.online && !item.online && (!located(previous.place) || !located(item.place)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 text-sm text-mute",
									children: "Location not set"
								}) : null,
								windows.filter((window) => previous && window.startMin >= previous.endMin && window.endMin <= item.startMin).map((window) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreeCard, {
									window,
									onUse: () => setWindowUse(window)
								}, `${window.startMin}`)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelected(item.id),
									className: clsx("today-item w-full rounded-xl bg-panel px-4 py-3 text-left", past && "opacity-60", item.status === "completed" && "opacity-50", selected === item.id && "today-item-on"),
									"data-kind": item.kind,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "today-tag text-xs font-semibold tracking-brand",
											"data-kind": item.kind,
											children: item.kind === "date" && item.status === "confirmed" ? "DATE · CONFIRMED" : `${KIND[item.kind]} · ${clockLabel(item.startMin)}–${clockLabel(item.endMin)}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: clsx("mt-1 text-lg text-cream", item.status === "completed" && "line-through"),
											children: [item.status === "completed" ? "Done · " : "", item.title]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-mute",
											children: [item.kind === "date" && item.status === "confirmed" ? `${clockLabel(item.startMin)}–${clockLabel(item.endMin)} · ` : "", item.online ? "Online · no travel" : item.place?.address || item.place?.name || "Location not set"]
										}),
										item.repeat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-sky",
											children: repeatLabel(item.repeat)
										}) : null,
										depart != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "today-leave mt-1 text-sm",
											children: ["Leave by ", clockLabel(depart)]
										}) : null,
										item.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-mute",
											children: "Locked"
										}) : null
									]
								}),
								conflict ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 rounded-xl bg-ink px-3 py-3 ring-1 ring-vermilion",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold tracking-brand text-vermilion",
											children: "CONFLICT"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-cream",
											children: conflict.text
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													const result = replanDay(items, legs);
													setProposal(result.next);
													setMoves(result.moves.map((move) => move.reason));
												},
												className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
												children: "Fix it"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setIgnored((current) => [...current, conflict.id]),
												className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-mute",
												children: "Ignore"
											})]
										})
									]
								}) : null
							] }, item.id);
						}),
						windows.filter((window) => !items.some((item) => window.endMin <= item.startMin && window.startMin >= (items[items.indexOf(item) - 1]?.endMin ?? 0))).slice(-1).map((window) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreeCard, {
							window,
							onUse: () => setWindowUse(window)
						}) }, window.startMin))
					]
				}),
				routing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-mute",
					children: "Checking travel…"
				}) : null,
				items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
					mode: "today",
					text: voice || aside,
					status: conflicts.length || !outdoorLater ? "warning" : "neutral"
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-panel p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "TODAY AT A GLANCE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs font-semibold tracking-brand text-sky",
							children: "NEXT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg text-cream",
							children: next ? `${next.title} · ${clockLabel(next.startMin)}` : "Nothing yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs font-semibold tracking-brand text-sky",
							children: "LEAVE BY"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "today-leave text-lg",
							children: nextLeave != null ? clockLabel(nextLeave) : "No verified trip"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs font-semibold tracking-brand text-sky",
							children: "WEATHER"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sky",
							children: weatherState === "none" ? "Weather unavailable" : weather || "Checking weather…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs font-semibold tracking-brand text-sky",
							children: "TASKS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-cream",
							children: [tasks.filter((item) => item.status !== "completed").length, " remaining"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs font-semibold tracking-brand text-sky",
							children: "FREE TIME"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-cream",
							children: windows[0] ? `${Math.floor(windows[0].minutes / 60)} hr ${windows[0].minutes % 60} min` : "No long gap"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
							mode: "today",
							text: voice || aside
						})
					]
				}),
				selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
					item: items.find((item) => item.id === selected) ?? null,
					onClose: () => setSelected(""),
					onChange: (next) => {
						const series = next.seriesId;
						if (series) {
							saveManual(manual.map((item) => {
								if (item.id !== series) return item;
								const done = new Set(item.doneOn ?? []);
								if (next.status === "completed") done.add(next.date);
								else done.delete(next.date);
								return {
									...item,
									title: next.title,
									locked: next.locked,
									flexible: !next.locked,
									place: next.place,
									repeat: next.repeat,
									doneOn: [...done]
								};
							}));
							return;
						}
						if (next.sourceType === "manual") saveManual(manual.map((item) => item.id === next.id ? {
							...item,
							...next,
							doneOn: next.status === "completed" ? [.../* @__PURE__ */ new Set([...item.doneOn ?? [], next.date])] : (item.doneOn ?? []).filter((day) => day !== next.date)
						} : item));
						else {
							const map = {
								...locks,
								[next.id]: next.locked
							};
							setLocks(map);
							localStorage.setItem("kairos-today-locks", JSON.stringify(map));
						}
					},
					onDelete: (id) => {
						const hit = items.find((item) => item.id === id);
						if (hit?.repeat || hit?.seriesId) {
							const series = hit.seriesId || hit.id;
							saveManual(manual.map((item) => item.id === series ? {
								...item,
								skipped: [.../* @__PURE__ */ new Set([...item.skipped ?? [], hit.date])]
							} : item));
							return;
						}
						saveManual(manual.filter((item) => item.id !== id));
					}
				}) : null,
				adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-2xl bg-ink p-4 ring-1 ring-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "QUICK ADD"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: [
								"personal",
								"task",
								"errand",
								"appointment"
							].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setParsed({
									...blankItem(date, kind),
									title: KIND[kind]
								}),
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
								children: KIND[kind]
							}, kind))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: draft,
							onChange: (event) => setDraft(event.target.value),
							rows: 2,
							placeholder: "Collect parcel before 6",
							className: "mt-3 w-full rounded-xl bg-panel px-3 py-2 text-cream ring-1 ring-line"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void readDraft(),
							className: "press mt-2 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
							children: "Read it"
						}),
						parsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confirm, {
							item: parsed,
							onChange: setParsed,
							onSave: () => commit(parsed),
							onCancel: () => setParsed(null)
						}) : null
					]
				}) : null,
				windowUse ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-2xl bg-ink p-4 ring-1 ring-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "USE THIS TIME"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-mute",
							children: [
								clockLabel(windowUse.startMin),
								"–",
								clockLabel(windowUse.endMin),
								". Nothing is added until you confirm."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								"task",
								"errand",
								"personal"
							].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setParsed({
									...blankItem(date, kind),
									title: "",
									startMin: windowUse.startMin,
									endMin: Math.min(windowUse.endMin, windowUse.startMin + 45)
								}),
								className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
								children: KIND[kind]
							}, kind))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setWindowUse(null),
							className: "press mt-3 min-h-11 text-sm font-semibold text-mute",
							children: "Leave it free"
						}),
						parsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confirm, {
							item: parsed,
							onChange: setParsed,
							onSave: () => commit(parsed),
							onCancel: () => setParsed(null)
						}) : null
					]
				}) : null,
				proposal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-2xl bg-ink p-4 ring-1 ring-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "PROPOSED CHANGES"
						}),
						moves.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-cream",
							children: "Nothing flexible can move. Locked plans stay where they are."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1 text-sm text-cream",
							children: moves.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: applyReplan,
								className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
								children: "Apply changes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setProposal(null),
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
								children: "Keep current plan"
							})]
						})
					]
				}) : null
			]
		})]
	});
}
function FreeCard({ window, onUse }) {
	const hours = Math.floor(window.minutes / 60);
	const mins = window.minutes % 60;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "today-free mb-3 rounded-xl border border-dashed px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-semibold tracking-brand text-accent",
				children: [
					"FREE · ",
					clockLabel(window.startMin),
					"–",
					clockLabel(window.endMin)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-cream",
				children: [hours ? `${hours} hr ` : "", mins ? `${mins} min` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
				mode: "today",
				text: "You have a useful gap. Enough for an errand, not a second outing."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onUse,
					className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
					children: "Use this time"
				})
			})
		]
	});
}
function Confirm({ item, onChange, onSave, onCancel }) {
	const personal = item.kind === "appointment" || item.kind === "personal";
	const repeat = item.repeat ?? null;
	const mode = !repeat ? "once" : repeat.every === 1 && repeat.unit === "day" && !repeat.until ? "day" : repeat.every === 1 && repeat.unit === "week" && !repeat.until ? "week" : "custom";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-xl bg-panel p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-mute",
				children: "Check this before it joins the day."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: item.title,
				onChange: (event) => onChange({
					...item,
					title: event.target.value
				}),
				className: "mt-2 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs text-mute",
					children: ["Starts", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "time",
						value: minutesToTime(item.startMin),
						onChange: (event) => onChange(withClock(item, event.target.value, "start")),
						className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs text-mute",
					children: ["Ends", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "time",
						value: minutesToTime(item.endMin),
						onChange: (event) => onChange(withClock(item, event.target.value, "end")),
						className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceField, {
				place: item.place,
				onChange: (place) => onChange({
					...item,
					place,
					online: false
				})
			}),
			personal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-mute",
						children: "Repeats"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: [
							["once", "Once"],
							["day", "Every day"],
							["week", "Every week"],
							["custom", "Custom"]
						].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": mode === key,
							onClick: () => onChange({
								...item,
								repeat: key === "once" ? null : key === "day" ? {
									every: 1,
									unit: "day",
									until: ""
								} : key === "week" ? {
									every: 1,
									unit: "week",
									until: ""
								} : {
									every: 2,
									unit: "week",
									until: ""
								}
							}),
							className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", mode === key ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
							children: label
						}, key))
					}),
					mode === "custom" && repeat ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-2 text-sm text-cream",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Every" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								max: 52,
								value: repeat.every,
								onChange: (event) => onChange({
									...item,
									repeat: {
										...repeat,
										every: Math.max(1, Math.min(52, Number(event.target.value) || 1))
									}
								}),
								className: "h-11 w-16 rounded-xl bg-ink px-2 text-cream ring-1 ring-line"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: repeat.unit,
								onChange: (event) => onChange({
									...item,
									repeat: {
										...repeat,
										unit: event.target.value
									}
								}),
								className: "h-11 rounded-xl bg-ink px-2 text-cream ring-1 ring-line",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "day",
										children: "days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "week",
										children: "weeks"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "month",
										children: "months"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-mute",
								children: ["Until", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: repeat.until,
									onChange: (event) => onChange({
										...item,
										repeat: {
											...repeat,
											until: event.target.value
										}
									}),
									className: "ml-2 h-11 rounded-xl bg-ink px-2 text-cream ring-1 ring-line"
								})]
							})
						]
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-cream",
				children: [
					KIND[item.kind],
					" · ",
					clockLabel(item.startMin),
					"–",
					clockLabel(item.endMin),
					repeat ? ` · ${repeatLabel(repeat)}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !item.title.trim(),
					onClick: onSave,
					className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
					children: "Add to today"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onCancel,
					className: "press min-h-11 rounded-xl px-3 text-sm text-mute",
					children: "Cancel"
				})]
			})
		]
	});
}
function minutesToTime(minutes) {
	const day = (minutes % 1440 + 1440) % 1440;
	return `${String(Math.floor(day / 60)).padStart(2, "0")}:${String(day % 60).padStart(2, "0")}`;
}
function withClock(item, value, edge) {
	const [hour, minute] = value.split(":").map(Number);
	if (!Number.isFinite(hour) || !Number.isFinite(minute)) return item;
	const next = hour * 60 + minute;
	if (edge === "start") return {
		...item,
		startMin: next,
		endMin: Math.max(item.endMin, next + 15)
	};
	return {
		...item,
		endMin: Math.max(next, item.startMin + 15)
	};
}
function PlaceField({ place, onChange }) {
	const [query, setQuery] = (0, import_react.useState)(place?.name ?? "");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	async function search() {
		const text = query.trim();
		if (text.length < 2) return;
		setNote("Looking up that place…");
		const found = await lookupPlace({ data: { query: text } }).catch(() => []);
		setHits(found.slice(0, 5).map((hit) => ({
			name: hit.name,
			address: hit.address || hit.label,
			latitude: hit.latitude,
			longitude: hit.longitude
		})));
		setNote(found.length ? "" : "No matching place. Try a mall, station, or address.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs text-mute",
				htmlFor: "today-place",
				children: "Location"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "today-place",
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Tampines Mall, or 1 Depot Road",
					className: "h-11 min-w-0 flex-1 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void search(),
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
					children: "Find"
				})]
			}),
			place ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-cream",
				children: [place.name, place.address ? ` · ${place.address}` : ""]
			}) : null,
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: note
			}) : null,
			hits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1",
				children: hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onChange({
							name: hit.name,
							address: hit.address,
							latitude: hit.latitude,
							longitude: hit.longitude
						});
						setHits([]);
						setQuery(hit.name);
					},
					className: "press min-h-11 w-full rounded-xl px-3 text-left text-sm text-cream ring-1 ring-line",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block",
						children: hit.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-mute",
						children: hit.address
					})]
				}) }, `${hit.latitude}-${hit.longitude}`))
			}) : null
		]
	});
}
function Detail({ item, onClose, onChange, onDelete }) {
	if (!item) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 rounded-2xl bg-ink p-4 ring-1 ring-line",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "today-tag text-xs font-semibold tracking-brand",
				"data-kind": item.kind,
				children: item.kind === "date" && item.status === "confirmed" ? "DATE · CONFIRMED" : KIND[item.kind]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 text-xl text-cream",
				children: item.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-mute",
				children: [
					clockLabel(item.startMin),
					"–",
					clockLabel(item.endMin)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-cream",
				children: item.online ? "Online" : item.place?.address || item.place?.name || "Location not set"
			}),
			item.repeat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-sky",
				children: repeatLabel(item.repeat)
			}) : null,
			item.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: item.notes
			}) : null,
			!item.online && item.place ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalActions, {
				heading: "FOR THIS PLAN",
				input: {
					mode: "today",
					kind: "place",
					countryCode: "SG",
					share: true,
					when: {
						date: item.date,
						startMin: item.startMin,
						endMin: item.endMin,
						timezone: "Asia/Singapore"
					},
					place: {
						name: item.place.name || item.title,
						address: item.place.address,
						city: "Singapore",
						countryCode: "SG",
						lat: item.place.latitude ?? void 0,
						lng: item.place.longitude ?? void 0
					}
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					item.sourceType === "manual" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onChange({
							...item,
							status: item.status === "completed" ? "flexible" : "completed"
						}),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: item.status === "completed" ? "Undo" : "Done"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onChange({
							...item,
							locked: !item.locked,
							flexible: item.locked,
							status: item.locked ? item.status : "confirmed"
						}),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: item.locked ? "Unlock" : "Lock"
					}),
					item.href.startsWith("/meet/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/meet/$code",
						params: { code: item.sourceId },
						className: "press inline-flex min-h-11 items-center rounded-xl px-3 text-sm text-sky",
						children: "Open plan"
					}) : item.kind === "family" || item.kind === "date" || item.kind === "travel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						search: {
							mode: item.kind === "date" ? "dating" : item.kind === "travel" ? "travel" : "family",
							code: ""
						},
						className: "press inline-flex min-h-11 items-center rounded-xl px-3 text-sm text-sky",
						children: "Open plan"
					}) : null,
					item.sourceType === "manual" && (item.repeat || item.seriesId) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onChange({
							...item,
							repeat: null
						}),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: "Stop repeating"
					}) : null,
					item.sourceType === "manual" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onDelete(item.id);
							onClose();
						},
						className: "press min-h-11 rounded-xl px-3 text-sm text-mute",
						children: item.repeat || item.seriesId ? "Delete this time" : "Delete"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "press min-h-11 rounded-xl px-3 text-sm text-mute",
						children: "Close"
					})
				]
			})
		]
	});
}
var searchTravelDestinations = createServerFn({ method: "POST" }).validator((input) => object({ query: string().trim().min(2).max(80) }).parse(input)).handler(createSsrRpc("9928ed1eb08bd6a5ed2352864af23adf4443cd8f837649a3eb55614a2d570af3"));
var area = object({
	name: string().trim().min(2).max(80),
	latitude: number().gte(-90).lte(90),
	longitude: number().gte(-180).lte(180),
	countryCode: string().trim().max(8).optional().default(""),
	bbox: tuple([
		number(),
		number(),
		number(),
		number()
	]).optional()
});
var brief = object({
	destination: string().trim().min(2).max(80),
	address: string().trim().max(160).optional().default(""),
	latitude: number().gte(-90).lte(90),
	longitude: number().gte(-180).lte(180),
	start: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	nights: number().int().min(1).max(90),
	adults: number().int().min(1).max(16),
	childAges: array(number().int().min(0).max(17)).max(6).optional().default([]),
	pace: _enum([
		"relaxed",
		"balanced",
		"full"
	]),
	move: _enum([
		"walk",
		"drive",
		"transit"
	]),
	budget: _enum([
		"simple",
		"mid",
		"splurge"
	]),
	interests: array(_enum(TRAVEL_INTERESTS)).max(7).optional().default([]),
	oneBase: boolean(),
	rejected: array(string().trim().max(80)).max(24).optional().default([]),
	lockedDates: array(string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(7).optional().default([]),
	salt: number().int().min(0).max(20).optional().default(0),
	areas: array(area).max(3).optional().default([]),
	mustVisit: array(string().trim().max(80)).max(8).optional().default([]),
	styles: array(_enum(TRAVEL_STYLES)).max(2).optional().default(["comfort"]),
	balance: _enum([
		"city",
		"balanced",
		"nature"
	]).optional().default("balanced"),
	firstVisit: boolean().optional().default(true),
	focus: _enum(["icons", "local"]).optional().default("icons"),
	foodPlanning: _enum([
		"minimal",
		"meals",
		"balanced",
		"feature"
	]).optional().default("balanced")
});
var resolveTravelHotel = createServerFn({ method: "POST" }).validator((input) => object({
	query: string().trim().min(2).max(120),
	near: array(object({
		lat: number().gte(-90).lte(90),
		lng: number().gte(-180).lte(180)
	})).min(1).max(8)
}).parse(input)).handler(createSsrRpc("410e1484bb2bc15d4a4348fd9f181e1856bec4d560374eb6ffb9d4a30b7469e6"));
var planTrip = createServerFn({ method: "POST" }).validator((input) => brief.parse(input)).handler(createSsrRpc("760ec96b7cb1a76b7dcb6e3a99aff168eee1c02a9b36807735664993e67a8641"));
var refreshPlacePhoto = createServerFn({ method: "POST" }).validator((input) => object({
	name: string().trim().max(120).optional().default(""),
	localName: string().trim().max(120).optional().default(""),
	wikidataId: string().trim().max(16).optional().default(""),
	fileTitle: string().trim().max(300).optional().default(""),
	imagePage: string().trim().max(500).optional().default(""),
	osmFile: string().trim().max(300).optional().default(""),
	commonsCategory: string().trim().max(200).optional().default(""),
	wikipedia: string().trim().max(200).optional().default(""),
	failedUrl: string().trim().max(500).optional().default(""),
	rejectFileTitles: array(string().trim().max(300)).max(8).optional().default([]),
	category: string().trim().max(40).optional().default("")
}).parse(input)).handler(createSsrRpc("e24a43f6c8fc99feab3616ba6c1a2e4563263f5e332556fd744ff263c6fdadec"));
var routeTripDay = createServerFn({ method: "POST" }).validator((input) => object({
	move: _enum([
		"walk",
		"drive",
		"transit"
	]),
	points: array(object({
		lat: number().gte(-90).lte(90),
		lng: number().gte(-180).lte(180)
	})).min(2).max(8)
}).parse(input)).handler(createSsrRpc("0d49d77cf5025214d073066ef199643849328be86d0af8373a5deece2a95d606"));
var STORAGE_KEY = "kairos-place-photos";
var EMPTY_PHOTO = {
	source: "commons_search",
	fileTitle: "",
	thumbnailUrl: "",
	originalUrl: "",
	descriptionUrl: "",
	width: 0,
	height: 0,
	mime: "",
	creator: "",
	license: "",
	licenseUrl: "",
	attributionRequired: false
};
function qidOf(value) {
	return value && /^Q\d+$/.test(value) ? value : "";
}
function photoCacheKey(target) {
	const id = target.id?.trim() || "";
	if (id) return `place:${id}`;
	const qid = qidOf(target.wikidataId);
	return qid ? `wd:${qid}` : "";
}
function photoQuery(target, extra) {
	return {
		name: target.name,
		localName: target.localName || "",
		wikidataId: qidOf(target.wikidataId),
		fileTitle: target.fileTitle || target.photo?.fileTitle || "",
		imagePage: target.imagePage || "",
		osmFile: "",
		commonsCategory: target.commonsCategory || "",
		wikipedia: target.wikipedia || "",
		failedUrl: extra?.failedUrl || "",
		rejectFileTitles: extra?.rejectFileTitles || [],
		commercial: false
	};
}
function knownPhoto(target) {
	if (target.photo?.thumbnailUrl && isPermittedPhotoUrl(target.photo.thumbnailUrl)) return target.photo;
	if (target.image && isPermittedPhotoUrl(target.image)) return {
		...EMPTY_PHOTO,
		source: target.photo?.source || "wikidata_image",
		fileTitle: target.fileTitle || target.photo?.fileTitle || "",
		thumbnailUrl: target.image,
		originalUrl: target.photo?.originalUrl || target.image,
		descriptionUrl: target.imagePage || target.photo?.descriptionUrl || "",
		license: target.photo?.license || "",
		licenseUrl: target.photo?.licenseUrl || "",
		creator: target.photo?.creator || "",
		attributionRequired: target.photo?.attributionRequired || false,
		retrievedAt: target.photo?.retrievedAt
	};
	return null;
}
function createPhotoStore() {
	const records = /* @__PURE__ */ new Map();
	const placeholders = /* @__PURE__ */ new Map();
	const alias = /* @__PURE__ */ new Map();
	const listeners = /* @__PURE__ */ new Set();
	const inflight = /* @__PURE__ */ new Map();
	const pending = [];
	let active = 0;
	let limit = 3;
	let seq = 0;
	let hydrated = false;
	function notify() {
		for (const listener of listeners) listener();
	}
	function placeholder(key) {
		const found = placeholders.get(key);
		if (found) return found;
		const next = {
			key,
			status: "UNRESOLVED",
			photo: null
		};
		placeholders.set(key, next);
		return next;
	}
	function canonical(key) {
		return alias.get(key) ?? key;
	}
	function read(key) {
		const id = canonical(key);
		return records.get(id) ?? placeholder(id);
	}
	function write(key, record) {
		records.set(key, record);
		placeholders.delete(key);
		notify();
	}
	function link(target, key) {
		const qid = qidOf(target.wikidataId);
		if (qid) alias.set(`wd:${qid}`, key);
		if (target.providerId) alias.set(`provider:${target.providerId}`, key);
	}
	function persist() {
		if (typeof localStorage === "undefined") return;
		const rows = [];
		for (const [key, record] of records) {
			if (record.status !== "READY" || !record.photo || !isPermittedPhotoUrl(record.photo.thumbnailUrl)) continue;
			rows.push({
				key,
				photo: record.photo,
				at: Date.now()
			});
		}
		const kept = rows.slice(-80);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({
				v: 1,
				rows: kept
			}));
		} catch {}
	}
	function hydrate(raw) {
		if (hydrated && raw === void 0) return;
		hydrated = true;
		const text = raw !== void 0 ? raw : typeof localStorage === "undefined" ? null : localStorage.getItem(STORAGE_KEY);
		if (!text) return;
		try {
			const parsed = JSON.parse(text);
			for (const row of parsed.rows ?? []) {
				if (!row?.key || !row.photo || !isPermittedPhotoUrl(row.photo.thumbnailUrl)) continue;
				if (records.has(row.key)) continue;
				records.set(row.key, {
					key: row.key,
					status: "READY",
					photo: row.photo
				});
			}
			notify();
		} catch {}
	}
	function serialize() {
		const rows = [];
		for (const [key, record] of records) if (record.status === "READY" && record.photo) rows.push({
			key,
			photo: record.photo
		});
		return JSON.stringify({
			v: 1,
			rows
		});
	}
	function pump() {
		pending.sort((a, b) => a.priority - b.priority || a.seq - b.seq);
		while (active < limit && pending.length) {
			const task = pending.shift();
			if (!task) break;
			active += 1;
			run(task).finally(() => {
				active -= 1;
				inflight.delete(task.key);
				pump();
			});
		}
	}
	async function run(task) {
		const ready = knownPhoto(task.target);
		if (ready && !task.failedUrl) {
			const record = {
				key: task.key,
				status: "READY",
				photo: ready
			};
			write(task.key, record);
			task.target;
			persist();
			task.finish(record);
			return;
		}
		const loading = {
			key: task.key,
			status: "LOADING",
			photo: null
		};
		write(task.key, loading);
		task.target;
		let attempts = 0;
		while (attempts < 2) {
			attempts += 1;
			try {
				const photo = await task.resolve(task.target, photoQuery(task.target, {
					failedUrl: task.failedUrl,
					rejectFileTitles: task.rejectFileTitles
				}));
				if (photo?.thumbnailUrl && isPermittedPhotoUrl(photo.thumbnailUrl)) {
					const record = {
						key: task.key,
						status: "READY",
						photo
					};
					write(task.key, record);
					task.target;
					persist();
					task.finish(record);
					return;
				}
				const record = {
					key: task.key,
					status: "UNAVAILABLE",
					photo: null
				};
				write(task.key, record);
				task.target;
				task.finish(record);
				return;
			} catch {
				if (attempts >= 2) break;
			}
		}
		const record = {
			key: task.key,
			status: "ERROR",
			photo: null
		};
		write(task.key, record);
		task.target;
		task.finish(record);
	}
	function enqueue(target, priority, resolve, extra) {
		const key = photoCacheKey(target);
		if (!key) return Promise.resolve(placeholder(""));
		link(target, key);
		const retry = Boolean(extra?.failedUrl);
		const current = records.get(key);
		const readyNow = !retry && knownPhoto(target);
		if (readyNow) {
			const record = {
				key,
				status: "READY",
				photo: readyNow
			};
			write(key, record);
			persist();
			return Promise.resolve(record);
		}
		if (!retry && current && (current.status === "READY" || current.status === "UNAVAILABLE" || current.status === "ERROR")) return Promise.resolve(current);
		const existing = inflight.get(key);
		if (existing && !retry) return existing;
		if (retry) {
			const index = pending.findIndex((task) => task.key === key);
			if (index >= 0) pending.splice(index, 1);
		}
		const promise = new Promise((finish) => {
			pending.push({
				key,
				priority,
				seq: ++seq,
				target,
				failedUrl: extra?.failedUrl || "",
				rejectFileTitles: extra?.rejectFileTitles || [],
				resolve,
				finish
			});
		});
		inflight.set(key, promise);
		write(key, {
			key,
			status: "LOADING",
			photo: null
		});
		return promise;
	}
	function prefetch(targets, options) {
		hydrate();
		if (options.concurrency) limit = Math.max(1, Math.min(4, options.concurrency));
		const priority = new Set(options.priorityIds ?? []);
		const unique = [];
		const seen = /* @__PURE__ */ new Set();
		for (const target of targets) {
			const key = photoCacheKey(target);
			if (!key || seen.has(key)) continue;
			seen.add(key);
			unique.push(target);
		}
		const jobs = unique.map((target) => {
			return enqueue(target, priority.has(target.id) ? 0 : typeof target.rank === "number" ? target.rank : target.day == null ? 80 : 10 + Math.max(0, target.day), options.resolve);
		});
		pump();
		return Promise.all(jobs);
	}
	function retry(target, failedUrl, resolve) {
		const job = enqueue(target, 0, resolve, {
			failedUrl,
			rejectFileTitles: [target.fileTitle, target.photo?.fileTitle].filter((value) => Boolean(value))
		});
		pump();
		return job;
	}
	return {
		read,
		subscribe(listener) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		prefetch,
		enqueue,
		retry,
		hydrate,
		serialize,
		reset() {
			records.clear();
			placeholders.clear();
			alias.clear();
			inflight.clear();
			pending.splice(0, pending.length);
			active = 0;
			seq = 0;
			hydrated = false;
			notify();
		}
	};
}
var placePhotos = createPhotoStore();
function targetFromStop(stop) {
	return {
		id: stop.id,
		name: stop.displayName || stop.nameEnglish || stop.name,
		localName: stop.nameLocal || stop.localName || "",
		wikidataId: stop.wikidataId,
		provider: stop.provider,
		providerId: stop.providerId,
		fileTitle: stop.photo?.fileTitle || stop.commonsFile || "",
		imagePage: stop.imagePage,
		commonsCategory: stop.commonsCategory,
		wikipedia: stop.wikipedia,
		category: stop.category,
		image: stop.image,
		photo: stop.photo,
		day: stop.day
	};
}
var resolveStop = (target, query) => refreshPlacePhoto({ data: {
	name: query.name,
	localName: query.localName || "",
	wikidataId: query.wikidataId || "",
	fileTitle: query.fileTitle || "",
	imagePage: query.imagePage || "",
	osmFile: query.osmFile || "",
	commonsCategory: query.commonsCategory || "",
	wikipedia: query.wikipedia || "",
	failedUrl: query.failedUrl || "",
	rejectFileTitles: query.rejectFileTitles || [],
	category: target.category || ""
} });
function prefetchScheduledPhotos(stops, priorityIds = []) {
	const lead = new Set(priorityIds);
	const targets = stops.filter((stop) => stop.category !== "stay" && stop.provider !== "area").map((stop) => ({
		...targetFromStop(stop),
		rank: lead.has(stop.id) ? 0 : stop.day == null ? 80 : 10 + stop.day
	}));
	return placePhotos.prefetch(targets, {
		priorityIds,
		resolve: resolveStop,
		concurrency: 3
	}).then(() => void 0);
}
function ensureStopPhoto(stop) {
	if (stop.provider === "area") return;
	const lead = stop.day === 0 ? [stop.id] : [];
	placePhotos.prefetch([targetFromStop(stop)], {
		priorityIds: lead,
		resolve: resolveStop,
		concurrency: 3
	});
}
function retryStopPhoto(stop, failedUrl) {
	return placePhotos.retry(targetFromStop(stop), failedUrl, resolveStop).then((record) => record.photo);
}
function PlaceTitle({ place, className }) {
	const sub = localSubtitle(place);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: className ?? "block text-cream",
		children: readableName(place)
	}), sub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "block text-sm text-mute",
		children: sub
	}) : null] });
}
function navPoint(point, fallback) {
	return {
		lat: point.lat,
		lng: point.lng,
		name: routeLabel(point) || fallback
	};
}
function NavigateControl({ from, to, mode, countryCode }) {
	const [pref, setPref] = (0, import_react.useState)(readNavPreference);
	const [open, setOpen] = (0, import_react.useState)(false);
	const country = inferCountry(to.lat, to.lng, countryCode);
	const resolved = pref === "automatic" ? automaticNav(country, detectPlatform()) : pref;
	const href = navigationHref(resolved, from, to, mode);
	if (pref !== "automatic") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		target: "_blank",
		rel: "noreferrer",
		className: "press inline-flex min-h-11 items-center rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
		children: "Navigate"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setOpen((value) => !value),
			className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
			children: "Navigate"
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 grid gap-2 rounded-xl bg-ink p-3 ring-1 ring-line",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: "OPEN WITH"
				}),
				handoffChoices(country).slice(0, 3).map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: navigationHref(app, from, to, mode),
					target: "_blank",
					rel: "noreferrer",
					className: "press inline-flex min-h-11 items-center text-sm text-cream",
					children: navLabel(app)
				}, app)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						writeNavPreference(resolved);
						setPref(resolved);
						setOpen(false);
					},
					className: "press min-h-11 text-left text-sm text-cream",
					children: ["Always use ", navLabel(resolved)]
				})
			]
		}) : null]
	});
}
function PlacePhoto({ stop, tall, onPhoto }) {
	const key = photoCacheKey(stop);
	const record = (0, import_react.useSyncExternalStore)(placePhotos.subscribe, () => placePhotos.read(key), () => placePhotos.read(key));
	const gallery = (stop.photos ?? []).map((photo) => photo.thumbnailUrl).filter((url) => isPermittedPhotoUrl(url));
	const [pick, setPick] = (0, import_react.useState)(0);
	const stored = record.status === "READY" && record.photo && isPermittedPhotoUrl(record.photo.thumbnailUrl) ? record.photo.thumbnailUrl : "";
	const direct = isPermittedPhotoUrl(stop.image) ? stop.image ?? "" : "";
	const preferred = gallery[pick] || stored || direct;
	const waiting = !preferred && (record.status === "UNRESOLVED" || record.status === "LOADING");
	const [broken, setBroken] = (0, import_react.useState)(false);
	const tried = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const onPhotoRef = (0, import_react.useRef)(onPhoto);
	onPhotoRef.current = onPhoto;
	const box = tall ? "h-64 w-full" : "h-16 w-16 shrink-0";
	(0, import_react.useEffect)(() => {
		setPick(0);
		setBroken(false);
		tried.current = /* @__PURE__ */ new Set();
	}, [stop.id]);
	(0, import_react.useEffect)(() => {
		ensureStopPhoto(stop);
	}, [
		stop.id,
		stop.wikidataId,
		stop.commonsFile,
		stop.image,
		stop.wikipedia
	]);
	(0, import_react.useEffect)(() => {
		const photo = record.photo;
		if (record.status !== "READY" || !photo || !isPermittedPhotoUrl(photo.thumbnailUrl)) return;
		if (stop.image === photo.thumbnailUrl) return;
		onPhotoRef.current?.(stop.id, photo);
	}, [
		record.status,
		record.photo,
		stop.id,
		stop.image
	]);
	const showImage = Boolean(preferred) && !broken;
	if (!showImage && (waiting || record.status === "LOADING")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `${box} animate-pulse rounded-xl bg-white/10`,
		"aria-hidden": "true"
	});
	if (!showImage) {
		if (!tall) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `${box} rounded-xl bg-white/5`,
			"aria-hidden": "true"
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `grid ${box} place-items-center rounded-xl bg-white/5 text-sm text-mute`,
			children: "No photo available"
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: preferred,
		alt: readableName(stop),
		referrerPolicy: "no-referrer",
		className: `${box} rounded-xl object-cover`,
		onError: () => {
			if (tried.current.has(preferred)) {
				setBroken(true);
				return;
			}
			tried.current.add(preferred);
			const nextPick = gallery.find((url) => !tried.current.has(url));
			if (nextPick) {
				setPick(gallery.indexOf(nextPick));
				return;
			}
			if (stop.photo?.source === "yelp" || stop.photo?.source === "foursquare" || stop.photo?.source === "mapillary" || stop.photo?.source === "panoramax" || record.photo?.source === "yelp" || record.photo?.source === "foursquare") {
				setBroken(true);
				return;
			}
			setBroken(true);
			retryStopPhoto(stop, preferred).then((photo) => {
				if (photo?.thumbnailUrl && isPermittedPhotoUrl(photo.thumbnailUrl) && !tried.current.has(photo.thumbnailUrl)) setBroken(false);
			});
		}
	}), tall && gallery.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 flex gap-2",
		children: gallery.slice(0, 4).map((url, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setPick(index),
			className: `h-14 w-14 overflow-hidden rounded-lg ring-1 ${index === pick ? "ring-accent" : "ring-line"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: url,
				alt: "",
				referrerPolicy: "no-referrer",
				className: "h-full w-full object-cover"
			})
		}, url))
	}) : null] });
}
function Elsewhere({ stop, trip }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalActions, {
		heading: "CHECK ELSEWHERE",
		input: {
			mode: "travel",
			kind: kindFromTravelCategory(stop.category),
			countryCode: trip.countryCode,
			navigate: false,
			checkIn: trip.start,
			checkOut: addDays(trip.start, trip.nights),
			adults: trip.adults,
			childAges: trip.childAges,
			destination: trip.destination,
			place: {
				id: stop.id,
				name: stop.name,
				nameEn: stop.nameEn,
				nameLocal: stop.nameLocal,
				localName: stop.localName,
				displayName: stop.displayName,
				nameEnglish: stop.nameEnglish,
				nameRomanized: stop.nameRomanized,
				address: stop.addressDisplay || stop.address,
				city: stop.area,
				region: stop.region,
				countryCode: trip.countryCode,
				lat: stop.lat,
				lng: stop.lng,
				website: stop.website
			}
		}
	});
}
function PlaceDetail({ trip, stop, best, onClose, onAdd, onSave, onExclude, onRemove, onMove, onShowMap, onPhoto, returnScroll = 0 }) {
	const scheduled = stop.day != null;
	const from = trip.stops.find((item) => item.day === stop.day && item.category === "stay") ?? trip.areas[0];
	const origin = from && "lat" in from ? from : {
		lat: trip.areas[0]?.latitude ?? stop.lat,
		lng: trip.areas[0]?.longitude ?? stop.lng
	};
	const copy = placeCopy(stop);
	const story = stop.story;
	const area = trip.areas[0];
	const originPoint = "name" in origin ? navPoint(origin, "Start") : {
		lat: origin.lat,
		lng: origin.lng,
		name: area?.name || "Start"
	};
	const placeLine = [area?.name, trip.destination].filter((value, index, list) => value && list.indexOf(value) === index).join(", ");
	const profile = Object.entries(story?.experienceProfile ?? {});
	const hours = hoursLine(stop.opening);
	const hero = stop.photos?.[0] || stop.photo;
	(0, import_react.useEffect)(() => {
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const y = returnScroll;
		return () => {
			document.body.style.overflow = previous;
			requestAnimationFrame(() => window.scrollTo(0, y));
		};
	}, [returnScroll, stop]);
	if (typeof document === "undefined") return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] flex bg-ink lg:justify-end lg:bg-ink/50",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": readableName(stop),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 hidden lg:block",
			"aria-label": "Close place",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex h-[100dvh] w-full flex-col bg-panel lg:w-[28rem] lg:shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-10 flex items-center justify-between gap-3 bg-panel px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] ring-1 ring-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: "PLACE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
					children: "Close"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacePhoto, {
						stop,
						tall: true,
						onPhoto
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs font-semibold tracking-brand text-accent",
						children: [
							(stop.importance ?? "place").toUpperCase(),
							" · ",
							stop.category.replace(/_/g, " ")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl text-cream",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceTitle, {
							place: stop,
							className: "font-display text-2xl text-cream"
						})
					}),
					placeLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-mute",
						children: placeLine
					}) : null,
					story?.whyIconic ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "WHY IT'S ICONIC"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-cream",
							children: story.whyIconic
						})]
					}) : null,
					story?.whyGo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "WHY GO"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-cream",
							children: story.whyGo
						})]
					}) : null,
					!story?.whyIconic && !story?.whyGo && copy.description && !/located|situated/i.test(copy.description) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-cream",
						children: copy.description
					}) : null,
					story?.signatureExperiences.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-mute",
						children: story.signatureExperiences.join(" · ")
					}) : null,
					profile.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-accent",
								children: "KAIROS EXPERIENCE PROFILE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-mute",
								children: "What kind of visit this is."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1",
								children: profile.slice(0, 6).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between text-sm text-cream",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: EXPERIENCE_LABEL[key] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tracking-wide text-accent",
										"aria-label": `${value} of 5`,
										children: ["★".repeat(value), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-line/40",
											children: "★".repeat(Math.max(0, 5 - value))
										})]
									})]
								}, key))
							})
						]
					}) : null,
					story?.bestFor.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "BEST FOR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-cream",
							children: story.bestFor.join(" · ")
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs font-semibold tracking-brand text-accent",
						children: "PLAN FOR"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-cream",
						children: story?.visitLabel || `${stop.duration} min`
					}),
					story?.bestTime ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-mute",
						children: ["Best time · ", story.bestTime]
					}) : null,
					story?.effort ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mute",
						children: story.effort
					}) : null,
					hours ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-cream",
						children: ["Hours · ", hours]
					}) : null,
					story?.nearbyCombos.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "GOOD TO COMBINE WITH"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-cream",
							children: story.nearbyCombos.join(" · ")
						})]
					}) : null,
					copy.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-cream",
						children: copy.address
					}) : null,
					copy.addressLocal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mute",
						children: copy.addressLocal
					}) : null,
					best && !scheduled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-cream",
						children: [
							"Best fit · Day ",
							best.day + 1,
							". ",
							best.reason
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							scheduled ? trip.days.slice(0, 7).map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onMove(day.index),
								className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
								children: ["Move to day ", day.index + 1]
							}, day.date)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onAdd(best?.day ?? 0),
								className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
								children: "Add"
							}),
							!scheduled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onSave,
								className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
								children: "Save"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onShowMap,
								className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
								children: "Show on map"
							}),
							scheduled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onRemove(true),
								className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
								children: "Remove, keep saved"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onExclude,
								className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
								children: "Not for me"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Elsewhere, {
						stop,
						trip
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "GET THERE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigateControl, {
								from: originPoint,
								to: navPoint(stop, readableName(stop)),
								mode: "taxi",
								countryCode: trip.countryCode
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "mt-4 rounded-xl bg-ink px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer text-sm text-cream",
							children: "Sources & photo credits"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-1 text-xs text-mute",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Place facts come from OpenStreetMap and Wikidata. A Wikipedia introduction, when used, is CC BY-SA and is not copied in full." }),
								story?.localNameSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Local name · ", story.localNameSource.replace(/_/g, " ")] }) : null,
								story?.descriptionSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Description · ", story.descriptionSource.replace(/_/g, " ")] }) : null,
								stop.opening ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Opening hours · OpenStreetMap",
									hours ? "" : " (could not be read as a simple range)",
									stop.opening ? `: ${stop.opening}` : ""
								] }) : null,
								(stop.photos?.length ? stop.photos : hero ? [hero] : []).map((photo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Photo · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-accent",
										href: photo.descriptionUrl || photo.thumbnailUrl,
										target: "_blank",
										rel: "noreferrer",
										children: photoCredit(photo.source)
									}),
									photo.license ? photo.licenseUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "text-accent",
										href: photo.licenseUrl,
										target: "_blank",
										rel: "noreferrer",
										children: photo.license
									})] }) : ` · ${photo.license}` : "",
									photo.creator ? ` · ${photo.creator}` : "",
									photo.fileTitle ? ` · ${photo.fileTitle.replace(/^File:/, "")}` : ""
								] }, photo.thumbnailUrl)),
								hero?.attributionRequired ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Attribution is required for this photo." }) : null,
								stop.commerce?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "text-accent",
									href: stop.commerce.url,
									target: "_blank",
									rel: "noreferrer",
									children: [
										stop.commerce.provider === "yelp" ? "Yelp" : "Foursquare",
										" · ",
										stop.commerce.name
									]
								}) }) : null
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "press mt-3 min-h-11 text-sm text-mute lg:hidden",
						children: "Back to the itinerary"
					})
				]
			})]
		})]
	}), document.body);
}
var PRESETS$1 = [
	{
		id: "overall",
		label: "Best overall"
	},
	{
		id: "location",
		label: "Best location"
	},
	{
		id: "quiet",
		label: "Quiet"
	},
	{
		id: "value",
		label: "Value"
	},
	{
		id: "family",
		label: "Family"
	},
	{
		id: "luxury",
		label: "Luxury"
	},
	{
		id: "minimum-travel",
		label: "Minimum travel"
	}
];
var REASONS = [
	["too-expensive", "Too expensive"],
	["too-far", "Too far"],
	["too-small", "Too small"],
	["too-basic", "Too basic"],
	["too-noisy", "Too noisy"],
	["area", "Don't like the area"],
	["", "Skip"]
];
function HotelShortlist({ trip, highlighted, onChange, onHighlight, onOpen, onPhoto }) {
	if (!hotelOptimizerEnabled()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhereToStay, {
		trip,
		onChange
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HotelOptimizer, {
		trip,
		highlighted,
		onChange,
		onHighlight,
		onOpen,
		onPhoto
	});
}
function WhereToStay({ trip, onChange }) {
	const areas = recommendStayAreas(trip);
	const booked = trip.stops.find((stop) => stop.category === "stay" && stop.day != null && stop.bookingStatus === "booked" && stop.provider !== "area");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-accent",
				children: "WHERE TO STAY"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-mute",
				children: "Kairos recommends the area. You check hotels on a booking site, then add the one you book."
			})] }),
			booked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-ink px-3 py-3 text-sm ring-1 ring-accent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-accent",
						children: "YOUR HOTEL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-semibold text-cream",
						children: booked.displayName || booked.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-mute",
						children: booked.address
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-mute",
						children: "This is the base for the nearby days. The sights are unchanged."
					})
				]
			}) : null,
			areas.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3",
				children: areas.map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StayCard, {
					trip,
					area
				}, area.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: "No base area yet. The sightseeing days need to be on the plan first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookedHotelForm, {
				trip,
				onChange
			})
		]
	});
}
function StayCard({ trip, area }) {
	const actions = resolveCommerceActions({
		id: area.id,
		name: area.name,
		city: trip.destination,
		country: trip.countryCode,
		lat: area.lat,
		lng: area.lng,
		category: "HOTEL"
	}, {
		mode: "travel",
		destination: trip.destination,
		checkIn: trip.start,
		checkOut: addDays(trip.start, trip.nights),
		adults: trip.adults,
		childAges: explicitChildAges(trip.childAges)
	});
	const affiliate = actions.some((action) => action.source === "affiliate");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-xl bg-ink px-3 py-3 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-accent",
				children: area.role.toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-semibold text-cream",
				children: area.name
			}),
			area.nightsLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-mute",
				children: area.nightsLabel
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1 text-mute",
				children: area.why.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", line] }, line))
			}),
			area.tradeoff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-mute",
				children: area.tradeoff
			}) : null,
			actions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-accent",
						children: "CHECK HOTELS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: actions.map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: action.url,
							target: "_blank",
							rel: "noreferrer",
							className: "press inline-flex min-h-11 items-center rounded-xl px-3 text-sm text-cream ring-1 ring-line",
							children: action.label.replace(/^Check /, "")
						}, action.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-mute",
						children: RATE_NOTE
					}),
					affiliate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-mute",
						children: AFFILIATE_DISCLOSURE
					}) : null
				]
			}) : null
		]
	});
}
function BookedHotelForm({ trip, onChange }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function find() {
		const text = query.trim();
		if (text.length < 2) return;
		const local = matchBookedHotel(trip, text);
		if (local) {
			const next = applyBookedHotel(trip, local);
			if (next === trip) {
				setMessage("That hotel is too far from these days to use as the base.");
				return;
			}
			onChange(next);
			setMessage(`${local.name} is the base. The sights stay where they are.`);
			return;
		}
		setBusy(true);
		try {
			const hit = await resolveTravelHotel({ data: {
				query: text,
				near: stayNearPoints(trip)
			} });
			if (!hit) {
				setMessage("Couldn't place that hotel. Use the full property name. Kairos will not guess from the name alone.");
				return;
			}
			const next = applyBookedHotel(trip, hit);
			if (next === trip) {
				setMessage("That hotel is too far from these days to use as the base.");
				return;
			}
			onChange(next);
			setMessage(`${hit.name} is the base. The sights stay where they are.`);
		} catch {
			setMessage("The map search did not answer. The itinerary is unchanged.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-ink px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-accent",
				children: "ALREADY BOOKED?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-2 block text-sm text-mute",
				htmlFor: "booked-hotel",
				children: "Add my hotel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "booked-hotel",
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Hotel name and city",
					className: "min-h-11 flex-1 rounded-xl bg-transparent px-3 text-sm text-cream ring-1 ring-line"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => void find(),
					className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
					children: busy ? "Looking" : "Add my hotel"
				})]
			}),
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: message
			}) : null
		]
	});
}
function HotelOptimizer({ trip, highlighted, onChange, onHighlight, onOpen, onPhoto }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [compare, setCompare] = (0, import_react.useState)(false);
	const [rejecting, setRejecting] = (0, import_react.useState)(null);
	const prefs = {
		...DEFAULT_HOTEL_PREFERENCES,
		...trip.hotelPreferences
	};
	const hotels = trip.hotels ?? [];
	const party = partyLine(trip);
	const base = trip.stops.find((stop) => stop.category === "stay" && stop.day != null) ?? null;
	const rates = liveHotelRates();
	const affiliate = hotels.some((hotel) => {
		const stop = hotelStop(trip, hotel);
		return stop ? placeActions(actionInput(trip, stop), detectPlatform()).some((action) => action.source === "affiliate") : false;
	});
	function apply(next) {
		onChange(setHotelPreferences(trip, next));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-accent",
						children: "HOTELS FOR THIS TRIP"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-cream",
						children: summary(prefs)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mute",
						children: party
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-expanded": open,
					onClick: () => setOpen((value) => !value),
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
					children: open ? "Close" : "Hotel preferences"
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencePanel, {
				prefs,
				onChange: apply
			}) : null,
			prefs.ac === "individual" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: "Individual room control is not the same as a hotel that has air conditioning. Kairos cannot verify room-by-room control from the map."
			}) : null,
			base && !hotels.some((hotel) => hotel.stopId === base.providerId || hotel.name === base.name) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-mute",
				children: [
					"The days currently start at ",
					base.name,
					". Selecting a hotel moves that base. The sights stay."
				]
			}) : null,
			hotels.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3",
				children: hotels.map((hotel) => {
					const reasons = hotel.reasons ?? [];
					const matches = hotel.matches ?? [];
					const unverified = hotel.unverified ?? [];
					const tradeoffs = (hotel.tradeoffs ?? []).filter((line) => !line.startsWith("We couldn't verify"));
					const stop = hotelStop(trip, hotel);
					const chosen = Boolean(base && (base.providerId === hotel.stopId || base.name === hotel.name));
					const onMap = Boolean(stop && (highlighted === stop.id || stop.providerId && highlighted === stop.providerId));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: clsx("rounded-xl bg-ink px-3 py-3 text-sm ring-1", chosen || onMap ? "ring-accent" : "ring-transparent"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [stop && (stop.image || stop.commonsFile || stop.wikidataId) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacePhoto, {
									stop,
									onPhoto
								}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => stop && onHighlight(stop.id),
									className: "press min-h-11 flex-1 text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold tracking-brand text-accent",
										children: (hotel.role || "Suggested").toUpperCase()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceTitle, {
										place: stop ?? { name: hotel.name },
										className: "font-semibold text-cream"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-cream",
								children: hotel.location || hotel.why
							}),
							reasons.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1 text-mute",
								children: reasons.map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", reason] }, reason))
							}) : null,
							matches.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 flex flex-wrap gap-2",
								children: matches.map((match) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-lg px-2 py-1 text-cream ring-1 ring-line",
									children: ["✓ ", match.label]
								}, match.label))
							}) : null,
							unverified.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
									className: "min-h-11 cursor-pointer text-mute",
									children: [
										unverified.length,
										" ",
										unverified.length === 1 ? "preference" : "preferences",
										" not verified"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-1 space-y-1 text-mute",
									children: unverified.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [item, ". We couldn't verify this requirement."] }, item))
								})]
							}) : null,
							tradeoffs.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-mute",
								children: ["Trade-off · ", line]
							}, line)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": Boolean(trip.hotelMemory?.kept?.includes(hotel.stopId) || hotel.role === "Kept"),
										onClick: () => onChange(toggleKeptHotel(trip, hotel.stopId)),
										className: "press min-h-11 rounded-xl px-3 text-cream ring-1 ring-line",
										children: trip.hotelMemory?.kept?.includes(hotel.stopId) ? "Kept" : "Keep"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setRejecting((value) => value === hotel.stopId ? null : hotel.stopId),
										className: "press min-h-11 rounded-xl px-3 text-cream ring-1 ring-line",
										children: "Not for me"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => onChange(likeHotel(trip, hotel.stopId)),
										className: "press min-h-11 rounded-xl px-3 text-cream ring-1 ring-line",
										children: "More like this"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											onChange(selectBase(trip, hotel.stopId));
											if (stop) onHighlight(stop.id);
										},
										className: "press min-h-11 rounded-xl bg-accent px-3 font-semibold text-accent-ink",
										children: chosen ? "Selected base" : "Select this hotel"
									}),
									stop ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => onOpen(stop.id),
										className: "press min-h-11 rounded-xl px-3 text-cream ring-1 ring-line",
										children: "Details"
									}) : null
								]
							}),
							rejecting === hotel.stopId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: REASONS.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										onChange(rejectHotel(trip, hotel.stopId, id));
										setRejecting(null);
									},
									className: "press min-h-11 rounded-xl px-3 text-cream ring-1 ring-line",
									children: label
								}, label))
							}) : null,
							stop ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalActions, {
								notes: false,
								heading: "CHECK ELSEWHERE",
								input: actionInput(trip, stop)
							}) : null
						]
					}, hotel.stopId);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: "No hotel came back for this area."
			}),
			hotels.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(rerollHotels(trip)),
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
					children: "Reroll unlocked hotels"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": compare,
					onClick: () => setCompare((value) => !value),
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
					children: compare ? "Hide comparison" : "Compare"
				})]
			}) : null,
			trip.hotelNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: trip.hotelNote
			}) : null,
			compare && hotels.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HotelCompare, {
				trip,
				hotels
			}) : null,
			hotels.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: "BOOKING"
				}),
				rates ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-mute",
					children: ["Live rates are not connected. ", RATE_NOTE]
				}),
				affiliate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-mute",
					children: AFFILIATE_DISCLOSURE
				}) : null
			] }) : null
		]
	});
}
function PreferencePanel({ prefs, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 rounded-xl bg-ink p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: PRESETS$1.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": prefs.preset === preset.id,
					onClick: () => onChange(presetPreferences(preset.id, prefs)),
					className: clsx("press min-h-11 rounded-xl px-3 text-sm", prefs.preset === preset.id ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
					children: preset.label
				}, preset.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Price per night",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: prefs.budget,
							onChange: (event) => onChange({
								...prefs,
								preset: "overall",
								budget: event.target.value
							}),
							className: selectClass,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "any",
									children: "Any"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: "under-150",
									children: [
										"Under ",
										unit(prefs),
										"150"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: "150-250",
									children: [unit(prefs), "150–250"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: "250-400",
									children: [unit(prefs), "250–400"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: "400-600",
									children: [unit(prefs), "400–600"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: "over-600",
									children: [unit(prefs), "600+"]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Currency",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: prefs.currency,
							onChange: (event) => onChange({
								...prefs,
								currency: event.target.value
							}),
							className: selectClass,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "SGD",
									children: "SGD"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "USD",
									children: "USD"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "EUR",
									children: "EUR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "JPY",
									children: "JPY"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Hotel quality",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: prefs.quality,
							onChange: (event) => onChange({
								...prefs,
								preset: "overall",
								quality: event.target.value
							}),
							className: selectClass,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "any",
									children: "Any"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "3",
									children: "3★+"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "4",
									children: "4★+"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "5",
									children: "5★"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Quality is a must",
						on: prefs.qualityMust,
						onClick: () => onChange({
							...prefs,
							qualityMust: !prefs.qualityMust
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Travel burden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: prefs.burden,
							onChange: (event) => onChange({
								...prefs,
								preset: "overall",
								burden: event.target.value
							}),
							className: selectClass,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "minimise",
									children: "Minimise daily travel"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "balanced",
									children: "Balanced location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "loose",
									children: "Location less important"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Location focus",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: prefs.location,
							onChange: (event) => onChange({
								...prefs,
								preset: "overall",
								location: event.target.value
							}),
							className: selectClass,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "itinerary",
									children: "Closest to the itinerary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "station",
									children: "Near a major station"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "nightlife",
									children: "Central nightlife / food"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "quiet-area",
									children: "Quiet neighbourhood"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "airport",
									children: "Near the airport"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "attraction",
									children: "Near one attraction"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Room size",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: prefs.room,
							onChange: (event) => onChange({
								...prefs,
								room: event.target.value
							}),
							className: selectClass,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "any",
								children: "No preference"
							}), [
								"20",
								"25",
								"30",
								"35",
								"40"
							].map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: size,
								children: [size, " m²+"]
							}, size))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Room size is a must",
						on: prefs.roomMust,
						onClick: () => onChange({
							...prefs,
							roomMust: !prefs.roomMust
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Air conditioning",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: prefs.ac,
							onChange: (event) => onChange({
								...prefs,
								ac: event.target.value
							}),
							className: selectClass,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "any",
									children: "No preference"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ac",
									children: "Must have air conditioning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "individual",
									children: "Individual room control"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Air conditioning is a must",
						on: prefs.acMust,
						onClick: () => onChange({
							...prefs,
							acMust: !prefs.acMust
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Noise",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: prefs.noise,
							onChange: (event) => onChange({
								...prefs,
								noise: event.target.value
							}),
							className: selectClass,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "any",
									children: "No preference"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "prefer",
									children: "Prefer quiet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "strong",
									children: "Strongly prefer quiet"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Style",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: prefs.style,
							onChange: (event) => onChange({
								...prefs,
								style: event.target.value
							}),
							className: selectClass,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "any",
									children: "No preference"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "luxury",
									children: "Luxury"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "boutique",
									children: "Boutique"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "business",
									children: "Business"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "family",
									children: "Family-friendly"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "value",
									children: "Value"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "traditional",
									children: "Traditional"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "modern",
									children: "Modern"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bed",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: prefs.bed,
							onChange: (event) => onChange({
								...prefs,
								bed: event.target.value
							}),
							className: selectClass,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "any",
									children: "No preference"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "double",
									children: "Double"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "twin",
									children: "Twin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "king",
									children: "King"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "family",
									children: "Family room"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "connecting",
									children: "Connecting rooms"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Breakfast",
						on: prefs.breakfast,
						onClick: () => onChange({
							...prefs,
							breakfast: !prefs.breakfast
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Parking",
						on: prefs.parking,
						onClick: () => onChange({
							...prefs,
							parking: !prefs.parking
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Wheelchair access",
						on: prefs.wheelchair,
						onClick: () => onChange({
							...prefs,
							wheelchair: !prefs.wheelchair
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-mute",
				children: "A must removes a hotel only when the map says it fails. Missing facts stay, with a warning. Price is not used to rank, because no live rate is connected."
			})
		]
	});
}
function HotelCompare({ trip, hotels }) {
	const rows = [
		{
			label: "Estimated first leg",
			value: (hotel) => `${hotel.averageMin} min average · ${hotel.longestMin} min longest`
		},
		{
			label: "Stars",
			value: (hotel) => verified(hotelStop(trip, hotel), "stars")
		},
		{
			label: "Room size",
			value: (hotel) => verified(hotelStop(trip, hotel), "room")
		},
		{
			label: "Air conditioning",
			value: (hotel) => verified(hotelStop(trip, hotel), "air")
		},
		{
			label: "Breakfast",
			value: (hotel) => verified(hotelStop(trip, hotel), "breakfast")
		},
		{
			label: "Wheelchair",
			value: (hotel) => verified(hotelStop(trip, hotel), "wheelchair")
		},
		{
			label: "Parking",
			value: (hotel) => verified(hotelStop(trip, hotel), "parking")
		}
	].filter((row) => hotels.some((hotel) => row.value(hotel)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 md:grid-cols-3",
		children: hotels.map((hotel) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-xl bg-ink p-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: (hotel.role || "Suggested").toUpperCase()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-semibold text-cream",
					children: hotel.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-2 space-y-2",
					children: rows.map((row) => {
						const text = row.value(hotel);
						if (!text) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-mute",
							children: row.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-cream",
							children: text
						})] }, row.label);
					})
				})
			]
		}, hotel.stopId))
	});
}
function verified(stop, kind) {
	const hotel = stop?.hotel;
	if (!hotel) return null;
	if (kind === "stars") {
		const stars = Number((hotel.stars || "").match(/\d(?:\.\d)?/)?.[0]);
		return stars >= 1 && stars <= 5 ? `${stars}★ on OpenStreetMap` : null;
	}
	if (kind === "room") {
		const room = Number((hotel.roomSize || "").match(/\d{2,3}/)?.[0]);
		return room >= 8 && room <= 200 ? `${room} m² on OpenStreetMap` : null;
	}
	const value = kind === "air" ? hotel.airConditioning : hotel[kind];
	if (value === "yes") return kind === "air" ? "Hotel air conditioning. Not individual room control." : "Yes, on OpenStreetMap";
	if (value === "no") return "No, on OpenStreetMap";
	return null;
}
function hotelStop(trip, hotel) {
	return trip.stops.find((stop) => stop.category === "stay" && (stop.providerId === hotel.stopId || stop.id === hotel.stopId)) ?? null;
}
function actionInput(trip, stop) {
	return {
		mode: "travel",
		kind: "hotel",
		countryCode: trip.countryCode,
		navigate: false,
		checkIn: trip.start,
		checkOut: addDays(trip.start, trip.nights),
		adults: trip.adults,
		childAges: trip.childAges,
		destination: trip.destination,
		place: {
			id: stop.providerId || stop.id,
			name: stop.name,
			nameEn: stop.nameEn,
			nameLocal: stop.nameLocal,
			localName: stop.localName,
			displayName: stop.displayName,
			nameEnglish: stop.nameEnglish,
			nameRomanized: stop.nameRomanized,
			address: stop.addressDisplay || stop.address,
			city: stop.area,
			region: stop.region,
			countryCode: trip.countryCode,
			lat: stop.lat,
			lng: stop.lng,
			website: stop.website
		}
	};
}
function partyLine(trip) {
	const children = trip.childAges.length ? ` · ${trip.childAges.length === 1 ? "child" : "children"} ${trip.childAges.join(", ")}` : "";
	return `${trip.adults} adult${trip.adults === 1 ? "" : "s"}${children}`;
}
function summary(prefs) {
	return [
		budgetText(prefs),
		prefs.quality === "any" ? "Any quality" : `${prefs.quality}★+`,
		prefs.burden === "minimise" ? "Minimise travel" : prefs.burden === "loose" ? "Location flexible" : "Balanced location"
	].join(" · ");
}
function unit(prefs) {
	if (prefs.currency === "EUR") return "€";
	if (prefs.currency === "JPY") return "¥";
	if (prefs.currency === "USD") return "US$";
	return "S$";
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-xs text-mute",
		children: [label, children]
	});
}
function Toggle({ label, on, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: clsx("press min-h-11 rounded-xl px-3 text-left text-sm", on ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
		children: label
	});
}
var selectClass = "mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line";
var DAY_COLOR = [
	"#d7b07a",
	"#7aa0b5",
	"#7d9a84",
	"#e6b34d",
	"#c4899a",
	"#6fafa6",
	"#e23b28"
];
function empty() {
	return {
		type: "FeatureCollection",
		features: []
	};
}
function colorFor(day) {
	return DAY_COLOR[day % DAY_COLOR.length] ?? DAY_COLOR[0];
}
function escapeHtml(value) {
	return value.replace(/[&<>"']/g, (ch) => {
		if (ch === "&") return "&";
		if (ch === "<") return "<";
		if (ch === ">") return ">";
		if (ch.charCodeAt(0) === 34) return "&quot;";
		return "&#39;";
	});
}
function TravelMap({ trip, days, selected, onSelect }) {
	const host = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const onSelectRef = (0, import_react.useRef)(onSelect);
	const dataRef = (0, import_react.useRef)({
		stops: empty(),
		lines: empty(),
		selected: null
	});
	const [broken, setBroken] = (0, import_react.useState)(false);
	onSelectRef.current = onSelect;
	const hotelIds = new Set((trip.hotels ?? []).filter((hotel) => hotelOptimizerEnabled() || hotel.booked).map((hotel) => hotel.stopId));
	const pins = /* @__PURE__ */ new Map();
	for (const stop of trip.stops) {
		if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) continue;
		const onDay = stop.day != null && days.includes(stop.day);
		const picked = stop.id === selected;
		const shortlisted = hotelIds.has(stop.id) || Boolean(stop.providerId && hotelIds.has(stop.providerId));
		if (!onDay && !picked && !shortlisted) continue;
		const key = pinKey(stop);
		if (!pins.has(key) || picked) pins.set(key, stop);
	}
	const stopFeatures = {
		type: "FeatureCollection",
		features: [...pins.values()].map((stop) => ({
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [stop.lng, stop.lat]
			},
			properties: {
				id: stop.id,
				name: readableName(stop),
				local: localSubtitle(stop),
				image: isPermittedPhotoUrl(stop.image) ? stop.image ?? "" : "",
				color: colorFor(stop.day ?? 0),
				selected: stop.id === selected ? "yes" : "no"
			}
		}))
	};
	const lineFeatures = {
		type: "FeatureCollection",
		features: trip.days.filter((day) => days.includes(day.index) && day.line && day.line.length > 1).map((day) => ({
			type: "Feature",
			geometry: {
				type: "LineString",
				coordinates: day.line
			},
			properties: {
				color: colorFor(day.index),
				id: day.date
			}
		}))
	};
	dataRef.current = {
		stops: stopFeatures,
		lines: lineFeatures,
		selected
	};
	function paint(map) {
		const stops = map.getSource("stops");
		const lines = map.getSource("lines");
		if (!stops || !lines) return;
		stops.setData(dataRef.current.stops);
		lines.setData(dataRef.current.lines);
		const focus = dataRef.current.stops.features.find((feature) => feature.properties.id === dataRef.current.selected);
		if (focus && Array.isArray(focus.geometry.coordinates)) {
			const [lng, lat] = focus.geometry.coordinates;
			map.easeTo({
				center: [lng, lat],
				duration: 400
			});
			return;
		}
		const coords = dataRef.current.stops.features.map((feature) => feature.geometry.coordinates).filter((pair) => pair?.length === 2);
		if (coords.length === 1 && coords[0]) map.easeTo({
			center: coords[0],
			zoom: 12,
			duration: 0
		});
		else if (coords.length > 1) {
			const west = Math.min(...coords.map((pair) => pair[0]));
			const east = Math.max(...coords.map((pair) => pair[0]));
			const south = Math.min(...coords.map((pair) => pair[1]));
			const north = Math.max(...coords.map((pair) => pair[1]));
			map.fitBounds([[west, south], [east, north]], {
				padding: 48,
				maxZoom: 13,
				duration: 0
			});
		}
	}
	(0, import_react.useEffect)(() => {
		const node = host.current;
		if (!node) return;
		let gone = false;
		let map = null;
		const area = trip.areas[0];
		import("../_libs/maplibre-gl.mjs").then((n) => n.t).then((ml) => {
			if (gone || !node) return;
			ml.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
			map = new ml.Map({
				container: node,
				style: TRAVEL_MAP_STYLE,
				center: [area?.longitude ?? 0, area?.latitude ?? 0],
				zoom: 11
			});
			map.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
			map.on("load", () => {
				if (!map) return;
				map.addSource("lines", {
					type: "geojson",
					data: empty()
				});
				map.addSource("stops", {
					type: "geojson",
					data: empty()
				});
				map.addLayer({
					id: "lines",
					type: "line",
					source: "lines",
					paint: {
						"line-color": ["get", "color"],
						"line-width": 3
					}
				});
				map.addLayer({
					id: "stops",
					type: "circle",
					source: "stops",
					paint: {
						"circle-radius": [
							"case",
							[
								"==",
								["get", "selected"],
								"yes"
							],
							10,
							7
						],
						"circle-color": ["get", "color"],
						"circle-stroke-width": 2,
						"circle-stroke-color": "#f4eadc"
					}
				});
				map.on("click", "stops", (event) => {
					const feature = event.features?.[0];
					const id = feature?.properties?.id;
					const title = typeof feature?.properties?.name === "string" ? feature.properties.name : "";
					const local = typeof feature?.properties?.local === "string" ? feature.properties.local : "";
					const image = typeof feature?.properties?.image === "string" && isPermittedPhotoUrl(feature.properties.image) ? feature.properties.image : "";
					if (typeof id === "string") onSelectRef.current(id);
					if (!map || !title) return;
					const picture = image ? `<img src="${escapeHtml(image)}" alt="" style="display:block;width:100%;height:72px;object-fit:cover;border-radius:8px;margin-bottom:6px" />` : "";
					new ml.Popup({
						closeButton: true,
						maxWidth: "220px"
					}).setLngLat(event.lngLat).setHTML(`${picture}<strong>${escapeHtml(title)}</strong>${local ? `<div>${escapeHtml(local)}</div>` : ""}`).addTo(map);
				});
				mapRef.current = map;
				paint(map);
			});
			map.on("error", () => {
				if (!map?.isStyleLoaded()) setBroken(true);
			});
		}).catch(() => setBroken(true));
		return () => {
			gone = true;
			map?.remove();
			mapRef.current = null;
		};
	}, [trip.id]);
	const stamp = `${days.join(",")}:${selected ?? ""}:${stopFeatures.features.map((feature) => feature.properties.id).join(",")}:${lineFeatures.features.length}`;
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!map?.isStyleLoaded()) return;
		paint(map);
	}, [stamp]);
	const listed = [...pins.values()];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: host,
			className: "h-96 w-full overflow-hidden rounded-xl bg-ink"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs text-mute",
			children: TRAVEL_MAP_CREDIT
		}),
		broken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-mute",
			children: "The map tiles did not load. The stops are still in the plan, with the coordinates we already have."
		}) : null,
		!listed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-mute",
			children: "No mapped stops in this view."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: listed.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(stop.id),
				className: "press min-h-11 w-full rounded-xl px-3 text-left text-sm ring-1 ring-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-cream",
						children: readableName(stop)
					}),
					localSubtitle(stop) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-mute",
						children: localSubtitle(stop)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 block text-mute",
						children: [
							"Day ",
							(stop.day ?? 0) + 1,
							" · ",
							stop.category.replace(/_/g, " ")
						]
					})
				]
			}) }, pinKey(stop)))
		})
	] });
}
var FOOD = /* @__PURE__ */ new Set([
	"restaurant",
	"cafe",
	"market",
	"nightlife"
]);
function minutesOf(value) {
	if (!value) return 720;
	const [hour, minute] = value.split(":").map(Number);
	return (hour || 0) * 60 + (minute || 0);
}
function themeLine(stops) {
	const bits = [];
	if (stops.some((stop) => stop.category === "museum" || stop.category === "historic" || stop.category === "landmark")) bits.push("Culture");
	if (stops.some((stop) => stop.category === "historic" || /temple|shrine|daibutsu|buddha/i.test(stop.name))) bits.push("Temples");
	if (stops.some((stop) => stop.category === "park" || stop.category === "garden" || stop.category === "beach" || stop.category === "viewpoint")) bits.push("Outdoors");
	if (stops.some((stop) => stop.category === "theme_park")) bits.push("Theme park");
	if (stops.some((stop) => stop.foodRole === "local-specialty")) bits.push("Local food");
	return [...new Set(bits)].slice(0, 3).join(" · ");
}
function commonLocality(stops) {
	const counts = /* @__PURE__ */ new Map();
	for (const stop of stops) {
		const name = (stop.locality || "").trim();
		if (!name) continue;
		counts.set(name, (counts.get(name) ?? 0) + 1);
	}
	return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}
function dayOutline(trip, day) {
	const info = trip.days.find((item) => item.index === day);
	const rows = dayStops(trip, day);
	const stay = rows.find((stop) => stop.category === "stay");
	const body = rows.filter((stop) => stop.category !== "stay");
	const minutes = trip.legs.filter((leg) => leg.day === day).reduce((sum, leg) => sum + (leg.minutes ?? 0), 0) + body.reduce((sum, stop) => sum + (stop.foodRole === "meal-window" ? 60 : stop.duration), 0);
	const origin = stay ?? rows[0];
	const far = origin ? body.filter((stop) => distanceMeters(origin.lat, origin.lng, stop.lat, stop.lng) >= 12e3) : [];
	const locality = commonLocality(far.length ? far : body);
	const dayTrip = far.length > 0;
	const theme = cleanTheme(info?.theme || info?.intent || "", trip.destination);
	const headline = theme && theme !== "this area" ? theme : dayTrip ? locality && !/[\u3040-\u30FF\u3400-\u9FFF]/.test(locality) ? `${locality} day trip` : "Day trip" : cleanTheme(locality || info?.area || trip.destination, trip.destination);
	const route = dayTrip ? `${stay?.area || trip.destination} ↔ ${locality || readableName(far[0] ?? body[0] ?? { name: headline })}` : "";
	const character = themeLine(body) || (dayTrip ? "Out of town" : "In town");
	const shape = dayTrip ? "Day trip" : body.length >= 4 ? "Full day" : "In town";
	return {
		index: day,
		title: (info?.label || `Day ${day + 1}`).replace(/\s+/g, " ").trim(),
		headline,
		character,
		route,
		stops: body.length,
		minutes,
		minutesLabel: `~${durationPhrase(Math.max(minutes, 0))}`,
		collapsed: [
			headline,
			`${body.length} stops`,
			route || shape
		].filter(Boolean).join(" · ")
	};
}
function nearbyContext(trip, day, anchorId) {
	const rows = dayStops(trip, day);
	if (!rows.length) return null;
	const anchor = (anchorId ? rows.find((stop) => stop.id === anchorId) : null) ?? [...rows].reverse().find((stop) => stop.category !== "stay") ?? rows[0];
	if (!anchor) return null;
	const later = rows.find((stop) => stop.id !== anchor.id && minutesOf(stop.startTime) >= minutesOf(anchor.endTime));
	const stay = rows.find((stop) => stop.category === "stay" && stop.id !== anchor.id);
	const next = later ?? stay ?? null;
	const freeStart = minutesOf(anchor.endTime ?? anchor.startTime);
	const freeEnd = later ? minutesOf(later.startTime) : Math.max(freeStart + 30, 1110);
	const remaining = freeEnd - freeStart;
	if (remaining < 30) return null;
	const nextPoint = next ?? anchor;
	return {
		day,
		anchorId: anchor.id,
		anchorName: readableName(anchor),
		lat: anchor.lat,
		lng: anchor.lng,
		freeStart,
		freeEnd,
		remaining,
		nextName: next ? readableName(next) : "the end of the day",
		nextLat: nextPoint.lat,
		nextLng: nextPoint.lng,
		hasNext: Boolean(later)
	};
}
function bandFor(stop, rank) {
	if (stop.category === "cafe") return "coffee";
	if (FOOD.has(stop.category)) return "food";
	if (stop.category === "park" || stop.category === "garden" || stop.category === "viewpoint" || stop.category === "beach") return "scenery";
	if (stop.importance === "iconic" || stop.importance === "major") return rank < 3 ? "pick" : "essential";
	return rank < 3 ? "pick" : "fit";
}
function nearbyOptions(trip, context) {
	const radius = context.remaining < 75 ? 1500 : context.remaining < 180 ? 4e3 : 8e3;
	const move = trip.move === "walk" ? "walk" : "drive";
	const foodPlan = trip.foodPlanning ?? "balanced";
	const rows = [];
	for (const stop of trip.stops) {
		if (stop.day != null || stop.excluded || stop.category === "stay" || stop.provider === "area") continue;
		if (FOOD.has(stop.category) && foodPlan === "minimal" && stop.category === "cafe") continue;
		const travel = estimateMinutes(move, distanceMeters(context.lat, context.lng, stop.lat, stop.lng));
		const meters = distanceMeters(context.lat, context.lng, stop.lat, stop.lng);
		if (meters > radius) continue;
		const direct = distanceMeters(context.lat, context.lng, context.nextLat, context.nextLng);
		const via = meters + distanceMeters(stop.lat, stop.lng, context.nextLat, context.nextLng);
		const detour = context.hasNext ? via - direct : 0;
		if (context.hasNext && detour > 2500 && context.remaining < 180) continue;
		const visit = stop.duration || 60;
		if (travel + visit + (context.hasNext ? Math.min(travel, 20) : 0) > context.remaining + 20 && context.remaining < 180) continue;
		rows.push({
			stop,
			travel,
			visit,
			detour
		});
	}
	rows.sort((a, b) => {
		const aFit = a.travel + a.visit <= context.remaining ? 0 : 1;
		const bFit = b.travel + b.visit <= context.remaining ? 0 : 1;
		if (aFit !== bFit) return aFit - bFit;
		const aInterest = trip.interests?.length && likedStop(a.stop, trip) ? 0 : 1;
		const bInterest = trip.interests?.length && likedStop(b.stop, trip) ? 0 : 1;
		if (aInterest !== bInterest) return aInterest - bInterest;
		return a.travel + a.detour - (b.travel + b.detour);
	});
	return rows.slice(0, 12).map((row, index) => {
		const fits = row.travel + row.visit <= context.remaining;
		const band = fits ? bandFor(row.stop, index) : "later";
		const whyNow = fits ? `${row.travel} min from ${context.anchorName}. Allow ${durationPhrase(row.visit)}. Fits before ${context.nextName}.` : `${row.travel} min away and about ${durationPhrase(row.visit)}. It needs more time than this gap.`;
		return {
			stopId: row.stop.id,
			band,
			travelMinutes: row.travel,
			visitMinutes: row.visit,
			fits,
			whyNow
		};
	}).filter((row) => row.fits || context.remaining >= 180);
}
function likedStop(stop, trip) {
	const interests = trip.interests ?? [];
	if (!interests.length) return false;
	const table = {
		food: [
			"restaurant",
			"cafe",
			"market",
			"nightlife"
		],
		nature: [
			"park",
			"garden",
			"viewpoint",
			"beach"
		],
		culture: [
			"museum",
			"historic",
			"landmark",
			"attraction"
		],
		beach: ["beach"],
		walks: [
			"park",
			"garden",
			"viewpoint"
		],
		shopping: ["shopping", "market"],
		night: ["nightlife"]
	};
	return interests.some((interest) => (table[interest] ?? []).includes(stop.category) || stop.groups?.includes(interest));
}
/** A small sequence for one free window. Other days stay as they are. */
function fillFreeGap(trip, day) {
	const context = nearbyContext(trip, day);
	if (!context || context.remaining < 150) return trip;
	const options = nearbyOptions(trip, context).filter((option) => option.fits);
	const food = options.find((option) => option.band === "food");
	const sights = options.filter((option) => option.band === "pick" || option.band === "essential" || option.band === "fit" || option.band === "scenery");
	const coffee = trip.pace === "full" || trip.foodPlanning === "minimal" ? void 0 : options.find((option) => option.band === "coffee");
	const sequence = [
		food,
		sights[0],
		coffee,
		sights[1]
	].filter((option) => Boolean(option));
	const ids = [];
	let budget = context.remaining;
	for (const option of sequence) {
		if (ids.includes(option.stopId)) continue;
		if (option.travelMinutes + option.visitMinutes > budget) continue;
		budget -= option.travelMinutes + option.visitMinutes;
		ids.push(option.stopId);
	}
	if (!ids.length) return trip;
	const otherDays = trip.stops.filter((stop) => stop.day != null && stop.day !== day).map((stop) => `${stop.id}:${stop.day}`);
	const next = appendStops(trip, day, ids);
	if (next.stops.filter((stop) => stop.day != null && stop.day !== day).map((stop) => `${stop.id}:${stop.day}`).join("|") !== otherDays.join("|")) return trip;
	return next;
}
function keepStop(trip, stopId) {
	return {
		...trip,
		stops: trip.stops.map((stop) => stop.id === stopId ? {
			...stop,
			kept: true
		} : stop)
	};
}
function foodAlternatives(trip, stopId) {
	const stop = trip.stops.find((item) => item.id === stopId);
	if (!stop || stop.day == null || !FOOD.has(stop.category)) return [];
	const rows = dayStops(trip, stop.day);
	const anchor = rows[rows.findIndex((item) => item.id === stopId) - 1] ?? stop;
	return trip.stops.filter((item) => item.day == null && !item.excluded && item.category === stop.category && item.id !== stop.id && distanceMeters(anchor.lat, anchor.lng, item.lat, item.lng) < 3e3).slice(0, 5);
}
function swapFoodStop(trip, stopId) {
	const stop = trip.stops.find((item) => item.id === stopId);
	if (!stop || stop.day == null || stop.kept || !FOOD.has(stop.category) || stop.provider === "area") return trip;
	const next = foodAlternatives(trip, stopId)[0];
	if (!next) return trip;
	const day = stop.day;
	const rows = dayStops(trip, day);
	const anchor = rows[rows.findIndex((item) => item.id === stopId) - 1] ?? stop;
	const why = `Convenient route-fit meal. About ${estimateMinutes(trip.move === "walk" ? "walk" : "drive", distanceMeters(anchor.lat, anchor.lng, next.lat, next.lng))} min from ${readableName(anchor)}.`;
	const role = "route-fit";
	const cleared = unscheduleStop(trip, stopId);
	const tagged = {
		...cleared,
		stops: cleared.stops.map((item) => item.id === next.id ? {
			...item,
			why,
			note: why,
			foodRole: role,
			meal: stop.meal ?? "lunch"
		} : item)
	};
	return appendStops(tagged, day, [next.id]);
}
function applyFoodPlanning(trip, level) {
	let next = {
		...trip,
		foodPlanning: level
	};
	if (level === "minimal" || level === "meals") for (const stop of [...next.stops]) {
		if (stop.day == null || stop.kept || stop.provider === "area") continue;
		if (stop.category === "cafe" || level === "minimal" && FOOD.has(stop.category)) next = unscheduleStop(next, stop.id);
	}
	if (level === "minimal") for (const day of next.days) {
		const rows = dayStops(next, day.index);
		const sights = rows.filter((stop) => stop.category !== "stay");
		if (!sights.length || rows.some((stop) => stop.category === "restaurant" || stop.category === "cafe")) continue;
		const anchor = sights[0];
		const why = "A meal window in this area. Choose a restaurant when you are there.";
		const windowStop = {
			id: `meal-lunch-d${day.index}`,
			provider: "area",
			providerId: "",
			name: `Lunch · ${anchor.locality || anchor.area || "this area"}`,
			category: "restaurant",
			address: anchor.area,
			lat: anchor.lat,
			lng: anchor.lng,
			day: day.index,
			startTime: "23:40",
			endTime: null,
			duration: 60,
			bookingStatus: "none",
			bucket: "scheduled",
			indoor: true,
			area: anchor.area,
			note: why,
			opening: "",
			why,
			foodRole: "meal-window",
			meal: "lunch"
		};
		next = retimeDay({
			...next,
			stops: [...next.stops, windowStop]
		}, day.index);
	}
	if (level === "feature") for (const day of next.days) {
		const rows = dayStops(next, day.index);
		if (rows.some((stop) => stop.category === "restaurant" || stop.category === "market")) continue;
		const anchor = rows.find((stop) => stop.category !== "stay") ?? rows[0];
		if (!anchor) continue;
		const pick = next.stops.find((stop) => stop.day == null && !stop.excluded && (stop.category === "restaurant" || stop.category === "market") && distanceMeters(anchor.lat, anchor.lng, stop.lat, stop.lng) < 4e3);
		if (!pick) continue;
		const why = `A food place that fits this part of the route. About ${estimateMinutes("walk", distanceMeters(anchor.lat, anchor.lng, pick.lat, pick.lng))} min from ${readableName(anchor)}.`;
		next = {
			...next,
			stops: next.stops.map((stop) => stop.id === pick.id ? {
				...stop,
				why,
				note: why,
				foodRole: "local-specialty",
				meal: "lunch"
			} : stop)
		};
		next = appendStops(next, day.index, [pick.id]);
	}
	return next;
}
var VIEWS = [
	"Plan",
	"Discover",
	"Map",
	"Bookings"
];
function TravelWorkspace({ trip, busy, onChange, onLock, onRemixDay, onAnother, onExclude }) {
	const [view, setView] = (0, import_react.useState)("Plan");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [daysOn, setDaysOn] = (0, import_react.useState)("all");
	const [routing, setRouting] = (0, import_react.useState)(false);
	const shown = daysOn === "all" ? trip.days.map((day) => day.index) : daysOn;
	const tripRef = (0, import_react.useRef)(trip);
	tripRef.current = trip;
	(0, import_react.useEffect)(() => {
		const next = normalizeTravelParty(trip);
		if (next !== trip) onChange(next);
	}, [trip, onChange]);
	function rememberPhoto(stopId, photo) {
		const next = applyPlacePhoto(tripRef.current, stopId, photo);
		tripRef.current = next;
		onChange(next);
	}
	const stale = trip.days.some((day) => dayStops(trip, day.index).length > 1 && (day.line == null || trip.legs.some((leg) => leg.day === day.index && leg.source !== "osrm" && leg.shown !== "walk")));
	const openStop = trip.stops.find((stop) => stop.id === detail) ?? null;
	const scrollRef = (0, import_react.useRef)(0);
	function open(id) {
		scrollRef.current = typeof window === "undefined" ? 0 : window.scrollY;
		setSelected(id);
		setDetail(id);
	}
	function closeDetail() {
		setDetail(null);
		const y = scrollRef.current;
		requestAnimationFrame(() => window.scrollTo(0, y));
	}
	async function updateRoutes() {
		setRouting(true);
		let next = trip;
		for (const day of trip.days) {
			const rows = dayStops(next, day.index);
			if (rows.length < 2) continue;
			if (day.line && next.legs.filter((leg) => leg.day === day.index).every((leg) => leg.source === "osrm" || leg.shown === "walk")) continue;
			const route = await routeTripDay({ data: {
				move: trip.move === "walk" ? "walk" : "drive",
				points: rows.map((stop) => ({
					lat: stop.lat,
					lng: stop.lng
				}))
			} }).catch(() => null);
			if (route) next = applyRoute(next, day.index, route);
		}
		setRouting(false);
		onChange(next);
	}
	function toggleDay(index) {
		setDaysOn((current) => {
			if (current === "all") return [index];
			const next = current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
			return next.length ? next : "all";
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg:grid lg:grid-cols-5 lg:items-start lg:gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:col-span-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: "TRIP"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-2xl text-cream",
							children: trip.title
						}),
						trip.playbook ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-brand text-accent",
									children: trip.playbook.title.toUpperCase()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-cream",
									children: trip.playbook.visit
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-cream",
									children: trip.playbook.line
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs font-semibold tracking-brand text-accent",
									children: "YOUR VERSION"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-cream",
									children: trip.playbook.version
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-mute",
									children: trip.playbook.route
								}),
								trip.playbook.changes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs font-semibold tracking-brand text-accent",
									children: "PERSONALISED FOR YOU"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-1 space-y-1",
									children: trip.playbook.changes.map((change) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "text-sm text-cream",
										children: change
									}, change))
								})] }) : null
							]
						}) : null,
						trip.whyTrip && !/^(First visit|Return visit)\./.test(trip.whyTrip) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-cream",
							children: trip.whyTrip
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-cream",
							children: trip.burden.line
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-mute",
							children: [
								trip.burden.transitMinutes,
								" min moving · ",
								trip.burden.hotelChanges,
								" hotel change",
								trip.burden.hotelChanges === 1 ? "" : "s",
								" · ",
								trip.burden.density,
								" days"
							]
						}),
						trip.transitNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-mute",
							children: trip.transitNote
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
							mode: "travel",
							label: "Kairos · Away",
							text: trip.voice,
							status: trip.burden.line.includes("tiring") ? "warning" : "good"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						role: "tablist",
						"aria-label": "Trip views",
						children: VIEWS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": view === item,
							onClick: () => setView(item),
							className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", item === "Map" && "lg:hidden", view === item ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
							children: item
						}, item))
					}),
					view === "Plan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanView, {
						trip,
						selected,
						busy,
						routing,
						stale,
						onOpen: open,
						onChange,
						onLock,
						onRemixDay,
						onAnother,
						onRoutes: () => void updateRoutes(),
						onDiscover: () => setView("Discover"),
						onHighlight: setSelected,
						onMode: (fromId, toId, mode) => onChange(selectLegMode(trip, fromId, toId, mode)),
						onPhoto: rememberPhoto
					}) : null,
					view === "Discover" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscoverView, {
						trip,
						onOpen: open,
						onChange,
						onPhoto: rememberPhoto
					}) : null,
					view === "Map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayFilters, {
							trip,
							daysOn,
							onAll: () => setDaysOn("all"),
							onToggle: toggleDay
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TravelMap, {
							trip,
							days: shown,
							selected,
							onSelect: open
						})]
					}) : null,
					view === "Bookings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingsView, {
						trip,
						onChange
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-3 hidden lg:col-span-2 lg:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayFilters, {
					trip,
					daysOn,
					onAll: () => setDaysOn("all"),
					onToggle: toggleDay
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TravelMap, {
					trip,
					days: shown,
					selected,
					onSelect: open
				})]
			}),
			openStop ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceDetail, {
				trip,
				stop: openStop,
				best: openStop.day == null ? bestDayFor(trip, openStop.id) : null,
				onClose: closeDetail,
				onAdd: (day) => {
					onChange(scheduleStop(trip, openStop.id, day));
					setDetail(null);
				},
				onSave: () => onChange(savePlace(trip, openStop.id)),
				onExclude: () => {
					onExclude?.(openStop.name);
					onChange(excludePlace(trip, openStop.id));
					setDetail(null);
				},
				onRemove: () => {
					onChange(unscheduleStop(trip, openStop.id));
					setDetail(null);
				},
				onMove: (day) => {
					onChange(scheduleStop(unscheduleStop(trip, openStop.id), openStop.id, day));
				},
				onShowMap: () => {
					setSelected(openStop.id);
					setView("Map");
					setDetail(null);
				},
				onPhoto: rememberPhoto,
				returnScroll: scrollRef.current
			}) : null
		]
	});
}
function DayFilters({ trip, daysOn, onAll, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex flex-wrap gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onAll,
			className: clsx("press min-h-11 rounded-xl px-3 text-sm", daysOn === "all" ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
			children: "Whole trip"
		}), trip.days.filter((day) => dayStops(trip, day.index).some((stop) => stop.category !== "stay")).map((day) => {
			const on = daysOn !== "all" && daysOn.includes(day.index);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onToggle(day.index),
				className: clsx("press min-h-11 rounded-xl px-3 text-sm", on ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
				children: `Day ${day.index + 1}`
			}, day.date);
		})]
	});
}
function PlanView({ trip, selected, busy, routing, stale, onOpen, onChange, onLock, onRemixDay, onAnother, onRoutes, onDiscover, onHighlight, onMode, onPhoto }) {
	const sightsPlanned = trip.stops.some((stop) => stop.day != null && stop.category !== "stay");
	const balance = experienceBalance(trip.coverage, trip.areas[0]?.name || trip.destination);
	const omissions = notableOmissions(trip);
	const timed = trip.legs.some((leg) => leg.minutes != null);
	const [folded, setFolded] = (0, import_react.useState)({});
	const [nearbyDay, setNearbyDay] = (0, import_react.useState)(null);
	const [nearbyAnchor, setNearbyAnchor] = (0, import_react.useState)(void 0);
	const [foodOnly, setFoodOnly] = (0, import_react.useState)(false);
	const scheduledKey = trip.stops.filter((stop) => stop.day != null && stop.category !== "stay" && stop.provider !== "area").map((stop) => `${stop.day}:${stop.id}`).join("|");
	const foldKey = trip.days.map((day) => folded[String(day.index)] ? "1" : "0").join("");
	(0, import_react.useEffect)(() => {
		const scheduled = trip.stops.filter((stop) => stop.day != null && stop.category !== "stay" && stop.provider !== "area");
		const open = trip.days.find((day) => !folded[String(day.index)] && scheduled.some((stop) => stop.day === day.index))?.index ?? scheduled[0]?.day ?? 0;
		prefetchScheduledPhotos(scheduled, scheduled.filter((stop) => stop.day === open).map((stop) => stop.id));
	}, [
		trip.id,
		scheduledKey,
		foldKey
	]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = sessionStorage.getItem(`kairos-day-fold:${trip.id}`);
			setFolded(raw ? JSON.parse(raw) : {});
		} catch {
			setFolded({});
		}
	}, [trip.id]);
	function writeFolds(next) {
		setFolded(next);
		try {
			sessionStorage.setItem(`kairos-day-fold:${trip.id}`, JSON.stringify(next));
		} catch {}
	}
	function openNearby(day, anchorId, meals = false) {
		setNearbyDay(day);
		setNearbyAnchor(anchorId);
		setFoodOnly(meals);
	}
	const nearby = nearbyDay == null ? null : nearbyContext(trip, nearbyDay, nearbyAnchor);
	const nearbyRows = nearby ? nearbyOptions(trip, nearby).filter((row) => !foodOnly || row.band === "food" || row.band === "coffee") : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			sightsPlanned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					"city",
					"nature",
					"culture",
					"local",
					"relaxed",
					"more"
				].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(rebalanceTrip(trip, kind)),
					className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
					children: kind === "city" ? "More city" : kind === "nature" ? "More nature" : kind === "culture" ? "More culture" : kind === "local" ? "More local" : kind === "relaxed" ? "More relaxed" : "Fit more in"
				}, kind))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-ink px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-semibold text-cream",
						children: [
							"Couldn't load ",
							trip.destination,
							" places"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mute",
						children: trip.placeNote || "Places didn't load. Try again."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: onAnother,
						className: "press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
						children: busy ? "Retrying…" : "Retry"
					})
				]
			}),
			sightsPlanned && balance.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: "TRIP BALANCE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-wrap gap-2",
					children: balance.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg px-2 py-1 text-sm text-cream ring-1 ring-line",
						children: [
							row.state === "in" ? "✓" : "○",
							" ",
							row.label,
							row.state === "optional" ? " · optional" : ""
						]
					}, row.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onDiscover,
					className: "press mt-2 min-h-11 text-sm text-accent",
					children: "Explore more in Discover"
				})
			] }) : null,
			omissions.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-ink px-3 py-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-cream",
						children: readableName(stop)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-mute",
						children: "Not included. It needs most of a day, and would make the rest of this trip rushed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onChange(scheduleStop(trip, stop.id, bestDayFor(trip, stop.id)?.day ?? 0)),
						className: "press mt-2 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
						children: "Add anyway"
					})
				]
			}, stop.id)),
			trip.areas.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2",
				children: trip.bases.map((base) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-ink px-3 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-semibold text-cream",
						children: [base.chosen ? "Chosen base · " : "Compared · ", base.label]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-mute",
						children: base.note
					})]
				}, base.id))
			}) : null,
			sightsPlanned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HotelShortlist, {
				trip,
				highlighted: selected,
				onChange,
				onHighlight,
				onOpen,
				onPhoto
			}) : null,
			trip.unmatched.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-mute",
				children: [
					"Couldn't place: ",
					trip.unmatched.join(", "),
					"."
				]
			}) : null,
			timed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-mute",
				children: "Travel times are estimates and may differ from live navigation."
			}) : null,
			stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: routing,
				onClick: onRoutes,
				className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
				children: routing ? "Routing…" : "Update travel times"
			}) : null,
			sightsPlanned ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => writeFolds(Object.fromEntries(trip.days.map((day) => [String(day.index), true]))),
					className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
					children: "Collapse all"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => writeFolds({}),
					className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
					children: "Expand all"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-8",
				children: trip.days.map((day) => {
					const rows = dayStops(trip, day.index);
					if (!sightsPlanned) return null;
					const idea = suggestOrder(trip, day.index);
					const outline = dayOutline(trip, day.index);
					const closed = Boolean(folded[String(day.index)]);
					const gap = nearbyContext(trip, day.index);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "scroll-mt-4 overflow-visible rounded-2xl bg-ink ring-1 ring-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
							className: "sticky top-0 z-10 rounded-t-2xl bg-ink px-3 py-3 ring-1 ring-line",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold tracking-brand text-accent",
											children: outline.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-lg text-cream",
											children: outline.headline
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-mute",
											children: [outline.character, day.weather ? ` · ${day.weather}` : ""]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-cream",
											children: closed ? outline.collapsed : `${outline.stops} stops · ${outline.minutesLabel}${outline.route ? ` · ${outline.route}` : ""}`
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-expanded": !closed,
									onClick: () => writeFolds({
										...folded,
										[String(day.index)]: !closed
									}),
									className: "press min-h-11 shrink-0 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
									children: closed ? "Expand" : "Collapse"
								})]
							})
						}), closed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 pb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => onLock(day.date),
										className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
										children: day.locked ? "Kept" : "Keep day"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: busy || day.locked,
										onClick: () => onRemixDay(day.date),
										className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
										children: "Remix day"
									})]
								}),
								idea ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 rounded-xl px-3 py-2 ring-1 ring-line",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-cream",
										children: [
											"Better order available. About ",
											idea.saved,
											" min less backtracking: ",
											idea.names.join(" → "),
											"."
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => onChange(applySuggestedOrder(trip, day.index)),
										className: "press mt-2 min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
										children: "Apply"
									})]
								}) : null,
								rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "mt-3 space-y-3",
									children: rows.map((stop, index) => {
										const leg = index === 0 ? null : trip.legs.find((item) => item.day === day.index && item.toId === stop.id);
										const food = stop.category === "restaurant" || stop.category === "cafe" || stop.category === "market";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [leg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegLine, {
											trip,
											leg,
											onMode: (mode) => onMode(leg.fromId, leg.toId, mode)
										}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: clsx("flex gap-3 rounded-xl bg-panel/40 px-3 py-2 ring-1", selected === stop.id ? "ring-accent" : "ring-line"),
											children: [stop.category !== "stay" && stop.provider !== "area" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacePhoto, {
												stop,
												onPhoto
											}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-start gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															onClick: () => onOpen(stop.id),
															className: "press min-h-11 min-w-0 flex-1 text-left",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "text-xs font-semibold tracking-brand text-accent",
																	children: [
																		displayClock(stop.startTime ?? "09:00"),
																		"–",
																		displayClock(stop.endTime ?? "10:00")
																	]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceTitle, { place: stop }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "text-sm text-mute",
																	children: stopSummary(stop)
																}),
																food && stop.why ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "mt-1 text-sm text-cream",
																	children: stop.why
																}) : null
															]
														}), stop.category !== "stay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StopMenu, {
															onEarlier: () => onChange(moveStop(trip, stop.id, -1)),
															onLater: () => onChange(moveStop(trip, stop.id, 1)),
															onRemove: () => onChange(unscheduleStop(trip, stop.id)),
															onNearby: () => openNearby(day.index, stop.id, food)
														}) : null]
													}),
													food && stop.provider !== "area" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-1 flex flex-wrap gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => onChange(keepStop(trip, stop.id)),
																className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
																children: stop.kept ? "Kept" : "Keep"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																disabled: !foodAlternatives(trip, stop.id).length,
																onClick: () => onChange(swapFoodStop(trip, stop.id)),
																className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
																children: "Swap"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => openNearby(day.index, stop.id, true),
																className: "press min-h-11 rounded-xl px-3 text-sm text-accent",
																children: "Find another nearby"
															})
														]
													}) : null,
													food && stop.provider === "area" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => openNearby(day.index, stop.id, true),
														className: "press mt-1 min-h-11 text-sm text-accent",
														children: "Choose restaurant"
													}) : null
												]
											})]
										})] }, stop.id);
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-mute",
									children: "Nothing scheduled."
								}),
								day.freeNote && rows.length && !/open time after/i.test(day.freeNote) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 rounded-xl bg-panel/50 px-3 py-3 ring-1 ring-line",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold tracking-brand text-accent",
											children: "FREE TIME"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-cream",
											children: day.freeNote.replace(/^Flight noted:.*$/i, "").trim()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex flex-wrap gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => openNearby(day.index),
												className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
												children: "Find nearby"
											}), gap && gap.remaining >= 150 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => onChange(fillFreeGap(trip, day.index)),
												className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
												children: "Fill this gap"
											}) : null]
										})
									]
								}) : null
							]
						})]
					}, day.date);
				})
			}),
			nearby ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NearbySheet, {
				title: foodOnly ? `Food near ${nearby.anchorName}` : `Near ${nearby.anchorName}`,
				note: `You have ${durationPhrase(nearby.remaining)} free${nearby.hasNext ? ` before ${nearby.nextName}` : ""}.`,
				rows: nearbyRows,
				trip,
				onClose: () => setNearbyDay(null),
				onOpen,
				onAdd: (id) => {
					onChange(scheduleStop(trip, id, nearby.day));
					setNearbyDay(null);
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy,
				onClick: onAnother,
				className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
				children: "Another itinerary"
			})
		]
	});
}
function LegLine({ trip, leg, onMode }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const from = trip.stops.find((stop) => stop.id === leg.fromId);
	const to = trip.stops.find((stop) => stop.id === leg.toId);
	const missing = leg.minutes == null || leg.source === "none";
	const reason = missing ? "" : usefulLegReason(leg.recommendationReason, hasYoungChild(trip.childAges));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 ml-3 border-l border-line pl-3",
		children: [
			(leg.meters ?? 0) >= 8e3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-accent",
				children: "EXCURSION"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-accent",
				children: "↓ BEST WAY"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-cream",
				children: missing ? "Route not calculated" : leg.label
			}),
			reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: reason
			}) : null,
			missing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: "Couldn't time this hop."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen((value) => !value),
					className: "press min-h-11 text-sm text-mute",
					children: "Alternatives"
				}), from && to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigateControl, {
					from: {
						lat: from.lat,
						lng: from.lng,
						name: routeLabel(from)
					},
					to: {
						lat: to.lat,
						lng: to.lng,
						name: routeLabel(to)
					},
					mode: leg.shown ?? "taxi",
					countryCode: trip.countryCode
				}) : null]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid gap-2",
				children: (leg.alternatives ?? []).map((alt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: alt.source === "unavailable" || alt.minutes == null,
					onClick: () => onMode(alt.mode),
					className: "press min-h-11 rounded-xl px-3 text-left text-sm text-cream ring-1 ring-line",
					children: [alt.label, alt.mode === leg.recommendedMode ? " · Suggested" : ""]
				}, alt.mode))
			}) : null
		]
	});
}
function StopMenu({ onEarlier, onLater, onRemove, onNearby }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Stop actions",
			"aria-expanded": open,
			onClick: () => setOpen((value) => !value),
			className: "press min-h-11 min-w-11 rounded-xl text-lg text-cream ring-1 ring-line",
			children: "⋯"
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 z-20 mt-1 grid min-w-44 rounded-xl bg-panel p-1 ring-1 ring-line",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						onEarlier();
						setOpen(false);
					},
					className: "press min-h-11 rounded-lg px-3 text-left text-sm text-cream",
					children: "Move earlier"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						onLater();
						setOpen(false);
					},
					className: "press min-h-11 rounded-lg px-3 text-left text-sm text-cream",
					children: "Move later"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						onNearby();
						setOpen(false);
					},
					className: "press min-h-11 rounded-lg px-3 text-left text-sm text-cream",
					children: "Find nearby"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						onRemove();
						setOpen(false);
					},
					className: "press min-h-11 rounded-lg px-3 text-left text-sm text-cream",
					children: "Remove"
				})
			]
		}) : null]
	});
}
function NearbySheet({ title, note, rows, trip, onClose, onOpen, onAdd }) {
	const bands = [
		{
			id: "pick",
			label: "Kairos picks"
		},
		{
			id: "essential",
			label: "Essential nearby"
		},
		{
			id: "fit",
			label: "Good fit"
		},
		{
			id: "food",
			label: "Food"
		},
		{
			id: "coffee",
			label: "Coffee / break"
		},
		{
			id: "scenery",
			label: "Scenery"
		},
		{
			id: "later",
			label: "If you have more time"
		}
	];
	if (typeof document === "undefined") return null;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[70] flex items-end justify-center bg-ink/70 lg:items-center",
		role: "dialog",
		"aria-label": title,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0",
			"aria-label": "Close nearby",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-panel ring-1 ring-line lg:max-h-[80vh] lg:max-w-lg lg:rounded-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-accent",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-cream",
					children: note
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
					children: "Close"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
				children: [!rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-mute",
					children: "Nothing nearby fits this window. The rest of Discover is unchanged."
				}) : null, bands.map((band) => {
					const items = rows.filter((row) => row.band === band.id);
					if (!items.length) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-accent",
							children: band.label.toUpperCase()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: items.map((row) => {
								const stop = trip.stops.find((item) => item.id === row.stopId);
								if (!stop) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-xl bg-ink px-3 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => onOpen(stop.id),
											className: "press min-h-11 w-full text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceTitle, { place: stop }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm text-mute",
												children: [
													kindLabel(stop.category),
													" · ",
													durationPhrase(row.visitMinutes)
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-cream",
											children: row.whyNow
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => onAdd(stop.id),
											className: "press mt-2 min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
											children: "Add"
										})
									]
								}, row.stopId);
							})
						})]
					}, band.id);
				})]
			})]
		})]
	}), document.body);
}
function DiscoverView({ trip, onOpen, onChange, onPhoto }) {
	const discoverKey = trip.stops.filter((stop) => stop.day == null && stop.category !== "stay" && stop.provider !== "area").map((stop) => stop.id).join("|");
	(0, import_react.useEffect)(() => {
		prefetchScheduledPhotos(trip.stops.filter((stop) => stop.day == null && stop.category !== "stay" && stop.provider !== "area"), []);
	}, [trip.id, discoverKey]);
	const [query, setQuery] = (0, import_react.useState)("");
	const sections = discoverSections(trip);
	const needle = query.trim();
	const seen = /* @__PURE__ */ new Set();
	const matches = needle ? trip.stops.filter((stop) => {
		const key = stop.providerId || stop.id;
		if (seen.has(key) || !placeMatches(stop, needle)) return false;
		seen.add(key);
		return true;
	}) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			trip.cluster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-cream",
				children: trip.cluster
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-mute",
				children: ["Search places", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Nagoya Castle or 名古屋城",
					className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
				})]
			}),
			needle ? matches.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: matches.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscoverCard, {
					trip,
					stop,
					onOpen,
					onChange,
					onPhoto
				}, stop.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: "No place matched that English, romanised, or local name."
			}) : null,
			!needle && !sections.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: "No other places came back for this search."
			}) : null,
			!needle ? sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-brand text-accent",
				children: section.title.toUpperCase()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-2",
				children: section.stops.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscoverCard, {
					trip,
					stop,
					onOpen,
					onChange,
					onPhoto
				}, `${section.id}-${stop.id}`))
			})] }, section.id)) : null
		]
	});
}
function DiscoverCard({ trip, stop, onOpen, onChange, onPhoto }) {
	const best = bestDayFor(trip, stop.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-xl bg-ink px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlacePhoto, {
				stop,
				onPhoto
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onOpen(stop.id),
				className: "press min-h-11 flex-1 text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceTitle, { place: stop }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-mute",
						children: [kindLabel(stop.category), stop.story?.visitLabel ? ` · ${stop.story.visitLabel}` : ` · ${durationPhrase(stop.duration)}`]
					}),
					stop.story?.shortDescription ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm text-cream",
						children: stop.story.shortDescription
					}) : null,
					stop.story?.bestFor.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm text-mute",
						children: stop.story.bestFor.slice(0, 3).join(" · ")
					}) : null
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onChange(scheduleStop(trip, stop.id, best?.day ?? 0)),
					className: "press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink",
					children: ["Add to day ", (best?.day ?? 0) + 1]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(savePlace(trip, stop.id)),
					className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
					children: "Save"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(excludePlace(trip, stop.id)),
					className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
					children: "Not for me"
				})
			]
		})]
	});
}
function stopSummary(stop) {
	if (stop.category === "stay") return stop.bookingStatus === "booked" ? "Your hotel" : stop.provider === "area" ? "Suggested area" : "Base";
	const hours = hoursLine(stop.opening);
	return [
		visitKind(stop),
		durationPhrase(stop.duration),
		hours
	].filter(Boolean).join(" · ");
}
function visitKind(stop) {
	const start = stop.startTime ?? "";
	if (stop.category === "restaurant" || stop.category === "cafe" || stop.category === "market") {
		if (start >= "16:30") return "Dinner";
		if (start >= "11:00") return stop.category === "cafe" ? "Coffee" : "Lunch";
		return stop.category === "cafe" ? "Coffee" : "Breakfast";
	}
	if (stop.category === "nightlife") return "Evening";
	return kindLabel(stop.category);
}
function kindLabel(category) {
	const text = category.replace(/_/g, " ");
	return text.charAt(0).toUpperCase() + text.slice(1);
}
function BookingsView({ trip, onChange }) {
	const [draft, setDraft] = (0, import_react.useState)({
		id: "",
		kind: "hotel",
		name: "",
		reference: "",
		when: "",
		address: "",
		notes: "",
		link: ""
	});
	function save() {
		const name = draft.name.trim();
		if (name.length < 2) return;
		const booking = {
			...draft,
			id: `book-${Date.now()}`,
			name
		};
		let next = {
			...trip,
			bookings: [booking, ...trip.bookings].slice(0, 30)
		};
		if (booking.kind === "hotel") {
			const stay = next.stops.find((stop) => stop.category === "stay" && placeMatches(stop, name));
			if (stay) next = selectBase(next, stay.id, true);
		}
		onChange(next);
		setDraft({
			id: "",
			kind: "hotel",
			name: "",
			reference: "",
			when: "",
			address: "",
			notes: "",
			link: ""
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: "A note of what you already booked. Kairos does not sell the ticket."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-mute",
						children: ["Type", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: draft.kind,
							onChange: (event) => setDraft({
								...draft,
								kind: event.target.value
							}),
							className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line",
							children: [
								"flight",
								"hotel",
								"train",
								"reservation",
								"ticket",
								"other"
							].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: kind,
								children: kind
							}, kind))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-mute",
						children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft.name,
							onChange: (event) => setDraft({
								...draft,
								name: event.target.value
							}),
							className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-mute",
						children: ["Reference", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft.reference,
							onChange: (event) => setDraft({
								...draft,
								reference: event.target.value
							}),
							className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-mute",
						children: ["When", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft.when,
							onChange: (event) => setDraft({
								...draft,
								when: event.target.value
							}),
							placeholder: "3 Oct, 14:20",
							className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-mute sm:col-span-2",
						children: ["Address or notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft.notes,
							onChange: (event) => setDraft({
								...draft,
								notes: event.target.value
							}),
							className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: save,
				className: "press min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink",
				children: "Save booking"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: trip.bookings.map((booking) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-ink px-3 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold capitalize text-cream",
							children: [
								booking.kind,
								" · ",
								booking.name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-mute",
							children: [
								booking.when,
								booking.reference,
								booking.notes
							].filter(Boolean).join(" · ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onChange({
								...trip,
								bookings: trip.bookings.filter((item) => item.id !== booking.id)
							}),
							className: "press mt-2 min-h-11 text-sm text-cream",
							children: "Remove"
						})
					]
				}, booking.id))
			}),
			!trip.bookings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: "No bookings stored."
			}) : null
		]
	});
}
var STORE$1 = "kairos-travel-plan";
function todayIso() {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Singapore",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(/* @__PURE__ */ new Date());
}
function TravelStudio() {
	const [destination, setDestination] = (0, import_react.useState)("");
	const [destinations, setDestinations] = (0, import_react.useState)([]);
	const [hits, setHits] = (0, import_react.useState)([]);
	const [start, setStart] = (0, import_react.useState)(todayIso());
	const [nightsText, setNightsText] = (0, import_react.useState)("3");
	const [adultsText, setAdultsText] = (0, import_react.useState)("2");
	const [ages, setAges] = (0, import_react.useState)("");
	const [pace, setPace] = (0, import_react.useState)("balanced");
	const [styles, setStyles] = (0, import_react.useState)(["comfort"]);
	const [balance, setBalance] = (0, import_react.useState)("balanced");
	const [firstVisit, setFirstVisit] = (0, import_react.useState)(true);
	const [move, setMove] = (0, import_react.useState)("walk");
	const [budget, setBudget] = (0, import_react.useState)("mid");
	const [interests, setInterests] = (0, import_react.useState)([]);
	const [foodPlanning, setFoodPlanning] = (0, import_react.useState)("balanced");
	const [oneBase, setOneBase] = (0, import_react.useState)(true);
	const [trip, setTrip] = (0, import_react.useState)(null);
	const [locked, setLocked] = (0, import_react.useState)([]);
	const [rejected, setRejected] = (0, import_react.useState)([]);
	const [salt, setSalt] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("");
	const [brief, setBrief] = (0, import_react.useState)("");
	const [reading, setReading] = (0, import_react.useState)(false);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [intent, setIntent] = (0, import_react.useState)(null);
	const [hidden, setHidden] = (0, import_react.useState)([]);
	const [fieldLocks, setFieldLocks] = (0, import_react.useState)({});
	const [mustVisit, setMustVisit] = (0, import_react.useState)([]);
	const [avoidPlaces, setAvoidPlaces] = (0, import_react.useState)([]);
	const [briefConflicts, setBriefConflicts] = (0, import_react.useState)([]);
	const [detailError, setDetailError] = (0, import_react.useState)("");
	const childAges = (0, import_react.useMemo)(() => parseChildAges(ages), [ages]);
	const nights = Number(nightsText);
	const adults = Number(adultsText);
	const nightsOk = Number.isInteger(nights) && nights >= 1 && nights <= 90;
	const adultsOk = Number.isInteger(adults) && adults >= 1 && adults <= 16;
	const chosen = planningDestinations(destinations);
	const picked = chosen[0] ?? null;
	const checkout = nightsOk ? addDays(start, nights) : "";
	const lastQuery = (0, import_react.useRef)("");
	const searchSeq = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		try {
			const raw = JSON.parse(localStorage.getItem(STORE$1) ?? "null");
			if (raw && Array.isArray(raw.stops) && Array.isArray(raw.days)) {
				const repaired = normalizeTravelParty(raw);
				setTrip(repaired);
				if (repaired.adults) setAdultsText(String(repaired.adults));
				if (repaired.childAges.length) setAges(repaired.childAges.join(", "));
			}
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!trip) return;
		try {
			localStorage.setItem(STORE$1, JSON.stringify(trip));
		} catch {}
	}, [trip]);
	(0, import_react.useEffect)(() => {
		const query = destination.trim();
		if (query.length < 2) return;
		const handle = window.setTimeout(() => {
			if (lastQuery.current === query.toLowerCase()) return;
			const seq = ++searchSeq.current;
			lastQuery.current = query.toLowerCase();
			searchTravelDestinations({ data: { query } }).then((found) => {
				if (seq !== searchSeq.current) return;
				setHits(found);
			}).catch(() => {
				if (seq === searchSeq.current) setHits([]);
			});
		}, 600);
		return () => window.clearTimeout(handle);
	}, [destination]);
	function lockField(key) {
		setFieldLocks((current) => ({
			...current,
			[key]: true
		}));
	}
	async function applyTravel(parsed, locks = fieldLocks) {
		setIntent(parsed);
		setFailed(false);
		const conflicts = [];
		if (parsed.nights) {
			if (locks.nights && String(parsed.nights) !== nightsText) conflicts.push({
				key: "nights",
				suggested: `${parsed.nights} nights`,
				current: `${nightsText} nights`
			});
			else if (!locks.nights) setNightsText(String(parsed.nights));
		}
		if (parsed.pace) {
			if (locks.pace && parsed.pace !== pace) conflicts.push({
				key: "pace",
				suggested: parsed.pace,
				current: pace
			});
			else if (!locks.pace) setPace(parsed.pace);
		}
		if (parsed.hotelChangePreference === "minimise") {
			if (locks.hotels && !oneBase) conflicts.push({
				key: "hotels",
				suggested: "Minimise hotel changes",
				current: "A second base"
			});
			else if (!locks.hotels) setOneBase(true);
		}
		if (parsed.interests.length && !locks.interests) setInterests(parsed.interests);
		if (!locks.mustVisit) setMustVisit(parsed.mustVisit);
		if (!locks.avoidPlaces) setAvoidPlaces(parsed.avoidPlaces);
		setBriefConflicts(conflicts);
		if (!locks.destinations && parsed.destinations.length) {
			const names = parsed.destinations.filter((item) => item.toLowerCase() !== "japan").slice(0, 3);
			const found = [];
			for (const city of names.length ? names : parsed.destinations.slice(0, 1)) {
				const hitsForCity = await searchTravelDestinations({ data: { query: city } }).catch(() => []);
				const match = hitsForCity.find((hit) => hit.name.toLowerCase() === city.toLowerCase() && hit.type !== "country") ?? hitsForCity.find((hit) => hit.type !== "country");
				if (match && !found.some((item) => item.name === match.name && item.countryCode === match.countryCode)) found.push(match);
			}
			if (found.length) {
				setDestinations(found);
				setDestination(found.map((item) => item.name).join(", "));
				setHits([]);
			}
		}
	}
	function understandTravel() {
		const query = brief.trim();
		if (query.length < 8) return;
		setReading(true);
		setFailed(false);
		parsePlanBrief({ data: {
			mode: "travel",
			text: query,
			today: todayIso()
		} }).then((result) => {
			if (result.mode !== "travel") return;
			const parsed = result.intent;
			if (!(parsed.destinations.length + parsed.mustVisit.length + (parsed.nights ? 1 : 0) + parsed.mustHave.length)) {
				setFailed(true);
				return;
			}
			return applyTravel(parsed).then(() => {
				if (/already (done|been|seen)|second visit|not my first/i.test(query)) setFirstVisit(false);
				if (/nature-heavy|mostly nature|more nature/i.test(query)) setBalance("nature");
				if (/city only|city-heavy|no nature/i.test(query)) setBalance("city");
				if (/backpack/i.test(query)) setStyles(["backpacking"]);
				else if (/luxury/i.test(query)) setStyles(["luxury"]);
				else if (/slow travel|take it slow/i.test(query)) setStyles(["slow"]);
				else if (/wellness|spa/i.test(query)) setStyles(["wellness"]);
				else if (/adventure|hike|hiking/i.test(query)) setStyles(["adventure"]);
			});
		}).catch(() => setFailed(true)).finally(() => setReading(false));
	}
	async function search() {
		const query = destination.trim();
		if (query.length < 2) return;
		const seq = ++searchSeq.current;
		lastQuery.current = query.toLowerCase();
		setDetailError("");
		setNote("Looking up that destination…");
		const found = await searchTravelDestinations({ data: { query } }).catch(() => []);
		if (seq !== searchSeq.current) return;
		setHits(found);
		setNote(found.length ? "" : "No country, city, or region matched. Try Japan, Osaka, or Paris.");
	}
	function addDestination(hit) {
		searchSeq.current += 1;
		lastQuery.current = hit.displayName.toLowerCase();
		const next = selectTravelDestination(destinations, hit);
		if (next === destinations) {
			setDetailError("Couldn’t load destination details.");
			setNote("Couldn’t load destination details.");
			return;
		}
		setDestinations(next);
		setDestination(hit.displayName);
		setHits([]);
		setDetailError("");
		setNote("");
	}
	async function run(nextSalt = salt, nextRejected = rejected, nextLocked = locked) {
		if (!picked) {
			setNote("Choose a destination from the list first.");
			return;
		}
		if (!nightsOk || !adultsOk) {
			setNote(!nightsOk ? "Nights need to be from 1 to 90." : "Adults need to be from 1 to 16.");
			return;
		}
		setBusy(true);
		setNote("");
		const next = await planTrip({ data: {
			destination: chosen.map((item) => item.name).join(", ") || picked.name,
			address: picked.displayName,
			latitude: picked.latitude,
			longitude: picked.longitude,
			start,
			nights,
			adults,
			childAges,
			pace,
			move,
			budget,
			interests,
			foodPlanning,
			oneBase,
			rejected: [.../* @__PURE__ */ new Set([...nextRejected, ...avoidPlaces])].slice(0, 24),
			lockedDates: nextLocked,
			salt: nextSalt,
			areas: chosen.map((item) => ({
				name: item.name,
				latitude: item.latitude,
				longitude: item.longitude,
				countryCode: item.countryCode,
				bbox: item.bbox
			})),
			mustVisit,
			styles,
			balance,
			firstVisit
		} }).catch(() => null);
		setBusy(false);
		if (!next) {
			setNote("The trip could not be planned. Try again.");
			return;
		}
		const kept = keepLockedDays(trip ? {
			...trip,
			days: trip.days.map((day) => ({
				...day,
				locked: nextLocked.includes(day.date)
			}))
		} : null, next);
		setTrip(kept);
	}
	function reroll() {
		const names = trip?.days.flatMap((day) => day.locked ? [] : trip.stops.filter((stop) => stop.day === day.index && stop.category !== "stay").map((stop) => stop.name)) ?? [];
		const nextRejected = [.../* @__PURE__ */ new Set([...rejected, ...names])].slice(-24);
		const nextSalt = Math.min(20, salt + 1);
		setRejected(nextRejected);
		setSalt(nextSalt);
		run(nextSalt, nextRejected);
	}
	function remixDay(date) {
		const day = trip?.days.find((item) => item.date === date);
		const names = trip?.stops.filter((stop) => stop.day === day?.index && stop.category !== "stay").map((stop) => stop.name) ?? [];
		const nextRejected = [.../* @__PURE__ */ new Set([...rejected, ...names])].slice(-24);
		const nextLocked = locked.filter((item) => item !== date);
		const nextSalt = Math.min(20, salt + 1);
		setRejected(nextRejected);
		setLocked(nextLocked);
		setSalt(nextSalt);
		if (trip) setTrip({
			...trip,
			days: trip.days.map((item) => item.date === date ? {
				...item,
				locked: false
			} : item)
		});
		run(nextSalt, nextRejected, nextLocked);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg:col-span-5 grid gap-8 lg:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanningBrief, {
					mode: "travel",
					kicker: "TRAVEL",
					question: "What kind of trip are we planning?",
					hint: "Tell Kairos where you’re thinking of going, who’s coming, and what kind of trip you want.",
					placeholder: "7 days in Japan with two kids. We definitely want Osaka and Nagoya, one snow day, not too many hotel changes, and no crazy early mornings.",
					value: brief,
					onChange: setBrief,
					onUnderstand: understandTravel,
					reading,
					failed,
					chips: intent ? travelChips(intent).filter((chip) => !hidden.includes(chip.id)) : [],
					onRemove: (chip) => {
						lockField(chip.lock);
						setHidden((current) => [...current, chip.id]);
					},
					aside: intent?.aside ?? "",
					conflicts: briefConflicts,
					onKeep: (key) => setBriefConflicts((items) => items.filter((item) => item.key !== key)),
					onUse: (key) => {
						const next = {
							...fieldLocks,
							[key]: false
						};
						setFieldLocks(next);
						if (intent) applyTravel(intent, next);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-4 block text-xs text-mute",
					htmlFor: "travel-where",
					children: "Destination"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "travel-where",
						value: destination,
						onChange: (event) => {
							lockField("destinations");
							setDestination(event.target.value);
							setHits([]);
						},
						placeholder: "Japan, Osaka, Paris",
						className: "h-11 min-w-0 flex-1 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void search(),
						className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
						children: "Find"
					})]
				}),
				destinations.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-wrap gap-2",
					children: destinations.map((place) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setDestinations(destinations.filter((item) => item !== place)),
						className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
						children: [
							place.name,
							" · ",
							place.type === "country" ? "selected · remove" : "remove"
						]
					}) }, place.providerId || `${place.type}-${place.name}-${place.countryCode}`))
				}) : null,
				picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-cream",
					role: "status",
					children: [picked.displayName, " selected"]
				}) : null,
				hits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1",
					children: hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => addDestination(hit),
						className: "press min-h-11 w-full rounded-xl px-3 text-left text-sm text-cream ring-1 ring-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: hit.displayName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-mute",
							children: [placeType(hit.type), " · add, up to 3 cities"]
						})]
					}) }, hit.providerId || `${hit.type}-${hit.name}-${hit.latitude}`))
				}) : null,
				detailError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-mute",
					children: [
						detailError,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void search(),
							className: "press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line",
							children: "Retry"
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-mute",
							children: ["Start", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: start,
								onChange: (event) => setStart(event.target.value),
								className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountField, {
							label: "Nights",
							text: nightsText,
							min: 1,
							max: 90,
							onText: (value) => {
								lockField("nights");
								setNightsText(value);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountField, {
							label: "Adults",
							text: adultsText,
							min: 1,
							max: 16,
							onText: setAdultsText
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-mute",
							children: ["Children’s ages", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: ages,
								onChange: (event) => setAges(event.target.value),
								placeholder: "5, 9",
								className: "mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
							})]
						})
					]
				}),
				checkout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-cream",
					children: ["Checkout ", prettyDate(checkout)]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
					label: "Pace",
					value: pace,
					options: [
						["relaxed", "Relaxed"],
						["balanced", "Balanced"],
						["full", "See more"]
					],
					onChange: (value) => {
						lockField("pace");
						setPace(value);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-mute",
					children: "Travel style · primary, and one more if you want"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: TRAVEL_STYLES.map((item) => {
						const on = styles.includes(item);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": on,
							onClick: () => setStyles((current) => on ? current.filter((entry) => entry !== item) : [...current, item].slice(-2)),
							className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold capitalize", on ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
							children: item
						}, item);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
					label: "City and nature",
					value: balance,
					options: [
						["city", "City-heavy"],
						["balanced", "Balanced"],
						["nature", "Nature-heavy"]
					],
					onChange: setBalance
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": firstVisit,
					onClick: () => setFirstVisit((value) => !value),
					className: clsx("press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold", firstVisit ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
					children: firstVisit ? "First visit. Cover the defining places." : "Not a first visit. Ease off the famous sights."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
					label: "Getting around",
					value: move,
					options: [
						["walk", "Walk"],
						["transit", "Transit"],
						["drive", "Drive"]
					],
					onChange: setMove
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-mute",
					children: "A preference for each hop. Navigate opens your map app."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationSetting, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
					label: "Budget",
					value: budget,
					options: [
						["simple", "Simple"],
						["mid", "Mid"],
						["splurge", "Splurge"]
					],
					onChange: setBudget
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
					label: "Food planning",
					value: foodPlanning,
					options: [
						["minimal", "Minimal"],
						["meals", "Meals only"],
						["balanced", "Balanced"],
						["feature", "Food is part of the trip"]
					],
					onChange: (value) => {
						setFoodPlanning(value);
						setTrip((current) => current ? applyFoodPlanning(current, value) : current);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-mute",
					children: "Interests"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: TRAVEL_INTERESTS.map((item) => {
						const on = interests.includes(item);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": on,
							onClick: () => {
								lockField("interests");
								setInterests(on ? interests.filter((entry) => entry !== item) : [...interests, item]);
							},
							className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold capitalize", on ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
							children: item
						}, item);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": oneBase,
					onClick: () => {
						lockField("hotels");
						setOneBase((value) => !value);
					},
					className: clsx("press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold", oneBase ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
					children: oneBase ? "One base. No hotel hop." : "A second base only if the sights split."
				}),
				mustVisit.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-cream",
					children: [
						"Look for ",
						mustVisit.join(", "),
						"."
					]
				}) : null,
				avoidPlaces.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-mute",
					children: [
						"Leave out ",
						avoidPlaces.join(", "),
						"."
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-mute",
					children: "Budget is a preference. Live prices stay on the booking sites."
				}),
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-mute",
					children: note
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => void run(),
					className: "press mt-4 min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink",
					children: busy ? "Planning…" : "Plan the trip"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "lg:col-span-3",
			children: !trip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-mute",
				children: "Plan, map, saved places, and bookings will share one trip."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TravelWorkspace, {
				trip,
				busy,
				onChange: setTrip,
				onLock: (date) => {
					setLocked((current) => current.includes(date) ? current.filter((item) => item !== date) : [...current, date]);
					setTrip((current) => current ? {
						...current,
						days: current.days.map((day) => day.date === date ? {
							...day,
							locked: !day.locked
						} : day)
					} : current);
				},
				onRemixDay: remixDay,
				onAnother: reroll,
				onExclude: (name) => setRejected((current) => [.../* @__PURE__ */ new Set([...current, name])].slice(-24))
			})
		})]
	});
}
function placeType(type) {
	if (type === "country") return "Country";
	if (type === "city") return "City";
	if (type === "region") return "Region";
	if (type === "island") return "Island";
	return "Destination";
}
function prettyDate(iso) {
	const [year, month, day] = iso.split("-").map(Number);
	return new Intl.DateTimeFormat("en-SG", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	}).format(new Date(Date.UTC(year, (month || 1) - 1, day || 1)));
}
function CountField({ label, text, min, max, onText }) {
	const parsed = Number(text);
	const valid = text !== "" && Number.isInteger(parsed) && parsed >= min && parsed <= max;
	function step(delta) {
		onText(String(Math.min(max, Math.max(min, (valid ? parsed : min) + delta))));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-mute",
			id: `${label}-label`,
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-1 flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => step(-1),
					"aria-label": `Fewer ${label}`,
					className: "press h-11 w-11 rounded-xl text-lg text-cream ring-1 ring-line",
					children: "−"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-labelledby": `${label}-label`,
					inputMode: "numeric",
					value: text,
					onChange: (event) => onText(event.target.value.replace(/[^\d]/g, "").slice(0, 2)),
					className: "h-11 w-16 rounded-xl bg-ink px-2 text-center text-cream ring-1 ring-line"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => step(1),
					"aria-label": `More ${label}`,
					className: "press h-11 w-11 rounded-xl text-lg text-cream ring-1 ring-line",
					children: "+"
				})
			]
		}),
		text !== "" && !valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-xs text-caution",
			children: [
				"Use ",
				min,
				" to ",
				max,
				"."
			]
		}) : null
	] });
}
function NavigationSetting() {
	const [value, setValue] = (0, import_react.useState)("automatic");
	(0, import_react.useEffect)(() => {
		setValue(readNavPreference());
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-mute",
				children: "Navigation app"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					["automatic", "Automatic"],
					["google", "Google Maps"],
					["apple", "Apple Maps"],
					["amap", "Amap"],
					["kakao", "Kakao Map"],
					["naver", "Naver Map"]
				].map(([key, text]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": value === key,
					onClick: () => {
						writeNavPreference(key);
						setValue(key);
					},
					className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", value === key ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
					children: text
				}, key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-mute",
				children: value === "automatic" ? "Automatic picks a map app for the country and this device. It does not change how Kairos calculates the trip." : `${navLabel(value)} opens when you tap Navigate. Kairos still plans the day itself.`
			})
		]
	});
}
function ChipRow({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-mute",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex flex-wrap gap-2",
			children: options.map(([key, text]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": value === key,
				onClick: () => onChange(key),
				className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", value === key ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
				children: text
			}, key))
		})]
	});
}
var ask = object({
	question: string().max(500).optional().default(""),
	mode: _enum([
		"ask",
		"daily",
		"compare",
		"dates"
	]).optional().default("ask"),
	hint: string().max(40).optional().default(""),
	optionA: string().max(80).optional().default(""),
	optionB: string().max(80).optional().default(""),
	windowDays: number().int().min(3).max(14).optional().default(7),
	birthDate: string().max(10).optional().default(""),
	birthDateB: string().max(10).optional().default(""),
	birthTime: string().max(5).optional().default(""),
	birthPlace: string().max(40).optional().default(""),
	include: array(_enum([
		"tong_shu",
		"tarot",
		"iching",
		"numerology",
		"zodiac",
		"bazi",
		"astrology"
	])).max(7).optional(),
	fresh: boolean().optional().default(false)
});
var askOracle = createServerFn({ method: "POST" }).validator((input) => ask.parse(input)).handler(createSsrRpc("5c9a6735bce1dbe814b3eaa3150424a62da7d65dd6a7f90faac37e8f1e43fca6"));
var HINTS = [
	{
		id: "love",
		label: "Love"
	},
	{
		id: "career",
		label: "Career"
	},
	{
		id: "money",
		label: "Money"
	},
	{
		id: "timing",
		label: "Timing"
	},
	{
		id: "travel",
		label: "Travel"
	},
	{
		id: "family",
		label: "Family"
	},
	{
		id: "decision",
		label: "Decisions"
	},
	{
		id: "",
		label: "Ask anything"
	}
];
var EXAMPLES = [
	"Is tomorrow a good day to ask my boss for a promotion?",
	"Should I leave my current job?",
	"Are we compatible?",
	"Which day between 10 and 20 October is best to launch?"
];
var STORE = "kairos-oracle-readings";
var CURRENT = "kairos-oracle-current";
var DAILY = "kairos-oracle-daily";
function sgtIso() {
	const now = sgtNow();
	const pad = (n) => String(n).padStart(2, "0");
	return `${now.y}-${pad(now.m)}-${pad(now.d)}`;
}
function loadSaved() {
	try {
		const raw = JSON.parse(localStorage.getItem(STORE) ?? "[]");
		return Array.isArray(raw) ? raw.filter((item) => item && typeof item.id === "string").slice(0, 20) : [];
	} catch {
		return [];
	}
}
function loadDaily(key) {
	try {
		const raw = JSON.parse(localStorage.getItem(DAILY) ?? "null");
		if (!raw || raw.key !== key || typeof raw.reading?.id !== "string" || !Array.isArray(raw.reading.layers)) return null;
		return raw.reading;
	} catch {
		return null;
	}
}
function storeDaily(key, reading) {
	try {
		localStorage.setItem(DAILY, JSON.stringify({
			key,
			reading
		}));
	} catch {}
}
function statusWord(status) {
	if (status === "not_connected") return "Not connected";
	if (status === "needs_info") return "Needs information";
	if (status === "not_relevant") return "Not relevant";
	if (status === "not_used") return "Not used";
	return "";
}
function CrystalBall({ phase, steps, reading, question }) {
	const synthesis = reading?.synthesis;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "oracle-ball",
		"data-phase": phase,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "oracle-ball__mist",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "oracle-ball__mist oracle-ball__mist--slow",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "oracle-ball__copy",
				"aria-live": "polite",
				children: [
					phase === "idle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "oracle-ball__kicker",
						children: "ASK ORACLE"
					}), question.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "oracle-ball__says",
						children: question.trim()
					}) : null] }) : null,
					phase === "reading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "oracle-ball__steps",
						children: steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "oracle-ball__step",
							children: step
						}, step))
					}) : null,
					phase === "reveal" && synthesis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "oracle-ball__kicker",
							children: "OVERALL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "oracle-ball__band",
							children: synthesis.band
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "oracle-ball__quiet",
							children: synthesis.bandLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "oracle-ball__action",
							children: synthesis.action
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "oracle-ball__quiet",
							children: synthesis.actionLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "oracle-ball__says",
							children: reading?.says
						})
					] }) : null,
					phase === "reveal" && reading && !synthesis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "oracle-ball__says",
						children: reading.says
					}) : null
				]
			})
		]
	});
}
function MethodReport({ methods }) {
	const selected = methods.filter((item) => item.selected);
	const rest = methods.filter((item) => !item.selected);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Divination methods Kairos selected",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-semibold tracking-brand text-sky",
				children: [
					"KAIROS SELECTED · ",
					selected.length,
					" ",
					selected.length === 1 ? "METHOD" : "METHODS"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: "Based on what you're asking, these methods are most relevant."
			}),
			selected.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-3",
				children: selected.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-l-2 border-sky pl-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-cream",
						children: [item.name, item.mark ? ` · ${item.mark}` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-mute",
						children: item.reason
					})]
				}, item.method))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-cream",
				children: "No divination method fits this question."
			}),
			rest.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "flex min-h-11 cursor-pointer items-center text-sm font-semibold text-sky",
					children: "View all methods"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3 pb-2",
					children: rest.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-semibold text-cream",
							children: [item.name, item.mark ? ` · ${item.mark}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-sun",
							children: statusWord(item.status)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-mute",
							children: item.reason
						})
					] }, item.method))
				})]
			}) : null
		]
	});
}
function SignalEssay({ signal, open }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		...open ? { open: true } : {},
		className: "rounded-xl bg-panel px-4 py-3 ring-1 ring-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "flex min-h-11 cursor-pointer items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm font-semibold text-cream",
				children: [signal.name, signal.mark ? ` · ${signal.mark}` : ""]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-3xl text-cream",
				children: signal.signal
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-3 grid gap-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs font-semibold tracking-brand text-sky",
					children: "STRENGTH"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "text-cream",
					children: signal.strengthLabel
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs font-semibold tracking-brand text-sky",
					children: "ANALYSIS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "leading-relaxed text-mute",
					children: signal.interpretation
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs font-semibold tracking-brand text-sky",
					children: "WHY IT MATTERS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "leading-relaxed text-mute",
					children: signal.whyItMatters
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs font-semibold tracking-brand text-sky",
					children: "RAW RESULT"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "text-cream",
					"data-oracle-raw": signal.method,
					children: signal.raw
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs font-semibold tracking-brand text-sky",
					children: "INTERPRETATION"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "leading-relaxed text-mute",
					children: signal.interpretation
				})] })
			]
		})]
	});
}
function LayerBlock({ layer }) {
	const signal = layer.lean === "favourable" ? "吉" : layer.lean === "neutral" ? "中" : "忌";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-ink px-4 py-3 ring-1 ring-line",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-sky",
					children: layer.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl text-cream",
					children: signal
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-cream",
				"data-oracle-raw": layer.id,
				children: layer.result
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-sun",
				children: layer.detail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-mute",
				children: layer.line
			})
		]
	});
}
function UsedList({ reading }) {
	const signals = reading.signals ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Used in this reading",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold tracking-brand text-sky",
			children: "USED IN THIS READING"
		}), signals.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-3",
			children: signals.map((signal) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "border-l-2 border-sky pl-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-cream",
						children: [
							signal.name,
							signal.mark ? ` · ${signal.mark}` : "",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 font-display text-xl",
								children: signal.signal
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-cream",
						children: signal.raw
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mute",
						children: signal.interpretation
					})
				]
			}, signal.method))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-mute",
			children: "No method produced a result for this question."
		})]
	});
}
function OracleStudio() {
	const [question, setQuestion] = (0, import_react.useState)("");
	const [hint, setHint] = (0, import_react.useState)("");
	const [panel, setPanel] = (0, import_react.useState)("ask");
	const [optionA, setOptionA] = (0, import_react.useState)("");
	const [optionB, setOptionB] = (0, import_react.useState)("");
	const [windowDays, setWindowDays] = (0, import_react.useState)(7);
	const [birthDate, setBirthDate] = (0, import_react.useState)("");
	const [birthDateB, setBirthDateB] = (0, import_react.useState)("");
	const [birthTime, setBirthTime] = (0, import_react.useState)("");
	const [birthPlace, setBirthPlace] = (0, import_react.useState)("");
	const [manual, setManual] = (0, import_react.useState)(false);
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [reading, setReading] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [pendingMode, setPendingMode] = (0, import_react.useState)("ask");
	const [error, setError] = (0, import_react.useState)("");
	const [why, setWhy] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)([]);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [added, setAdded] = (0, import_react.useState)("");
	const flight = (0, import_react.useRef)(null);
	const catalog = oracleAvailability(birthDate);
	const selectable = catalog.filter((item) => item.status === "available").map((item) => item.method);
	(0, import_react.useEffect)(() => {
		setSaved(loadSaved());
		try {
			const raw = sessionStorage.getItem(CURRENT);
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (parsed && typeof parsed.id === "string" && Array.isArray(parsed.layers)) {
				setReading(parsed);
				setQuestion(parsed.question ?? "");
			}
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!reading) return;
		try {
			sessionStorage.setItem(CURRENT, JSON.stringify(reading));
		} catch {}
	}, [reading]);
	async function ask(mode = panel === "ask" ? "ask" : panel, fresh = false) {
		if (flight.current) return;
		const text = question.trim();
		if (mode !== "daily" && mode !== "compare" && text.length < 4) {
			setError("Ask a real question. A word is not an omen.");
			return;
		}
		if (mode === "compare" && (optionA.trim().length < 2 || optionB.trim().length < 2) && !/\bor\b/i.test(text)) {
			setError("Name both choices.");
			return;
		}
		const include = manual ? picked.filter((id) => selectable.includes(id)) : void 0;
		const dayKey = dailyKey({
			birthDate,
			birthDateB,
			include
		}, sgtIso());
		if (mode === "daily" && !fresh) {
			const cached = loadDaily(dayKey);
			if (cached) {
				setError("");
				setReading(cached);
				setQuestion(cached.question);
				return;
			}
		}
		setError("");
		setPendingMode(mode);
		setPending(true);
		setWhy(false);
		setCopied(false);
		setAdded("");
		const run = (async () => {
			const next = await askOracle({ data: {
				question: mode === "daily" ? "What is the energy of today?" : text,
				mode,
				hint: mode === "compare" ? "compare" : mode === "dates" ? "which day" : hint,
				optionA,
				optionB,
				windowDays,
				birthDate,
				birthDateB,
				birthTime,
				birthPlace,
				include,
				fresh
			} });
			setReading(next);
			if (mode === "daily") storeDaily(dayKey, next);
		})();
		flight.current = run;
		try {
			await run;
		} catch (err) {
			setError(err instanceof Error ? err.message : "The reading did not come back.");
		} finally {
			flight.current = null;
			setPending(false);
		}
	}
	function saveReading() {
		if (!reading || reading.guard !== "none") return;
		const next = [{
			id: reading.id,
			date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			question: reading.question,
			energy: reading.synthesis?.band ?? reading.energy,
			category: reading.questionType,
			reading
		}, ...loadSaved().filter((item) => item.id !== reading.id)].slice(0, 20);
		localStorage.setItem(STORE, JSON.stringify(next));
		setSaved(next);
	}
	async function shareReading() {
		if (!reading) return;
		const synthesis = reading.synthesis;
		const text = [
			"ORACLE",
			reading.question,
			synthesis ? `OVERALL ${synthesis.band} · ${synthesis.bandLabel}` : reading.energy,
			synthesis ? `FOR THIS ACTION ${synthesis.action} · ${synthesis.actionLabel}` : "",
			synthesis ? `AGREEMENT ${synthesis.agreement}` : "",
			"神婆 SAYS",
			reading.says,
			ORACLE_FRAMING
		].filter(Boolean).join("\n");
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
		} catch {
			setError("The reading stayed on this page. Copy is blocked.");
		}
	}
	function addDate(iso, label) {
		const items = readTodayItems();
		const title = `Oracle · ${label}`;
		if (items.some((item) => item.date === iso && item.title === title)) {
			setAdded(iso);
			return;
		}
		writeTodayItems([{
			...blankItem(iso, "personal"),
			title,
			notes: "A timing note from Oracle. Reflection, not a booking.",
			status: "tentative",
			flexible: true
		}, ...items]);
		setAdded(iso);
	}
	function toggleMethod(method) {
		setPicked((current) => current.includes(method) ? current.filter((item) => item !== method) : [...current, method]);
	}
	const steps = pending ? plannedSteps({
		question: pendingMode === "daily" ? "What is the energy of today?" : question,
		mode: pendingMode,
		hint: pendingMode === "compare" ? "compare" : pendingMode === "dates" ? "which day" : hint,
		birthDate,
		include: manual ? picked.filter((id) => selectable.includes(id)) : void 0
	}) : [];
	const phase = pending ? "reading" : reading ? "reveal" : "idle";
	const savedThis = Boolean(reading && saved.some((item) => item.id === reading.id));
	const howLead = ORACLE_HOW.slice(0, ORACLE_HOW.lastIndexOf("Different")).trim();
	const howRest = ORACLE_HOW.slice(ORACLE_HOW.lastIndexOf("Different"));
	const form = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-brand text-sky",
					children: "READING METHODS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": !manual,
						onClick: () => setManual(false),
						className: clsx("press min-h-11 rounded-full px-3 text-sm font-semibold", !manual ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
						children: "AUTO"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": manual,
						onClick: () => {
							setManual(true);
							setPicked(selectable);
						},
						className: clsx("press min-h-11 rounded-full px-3 text-sm font-semibold", manual ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
						children: "Choose"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-mute",
					children: manual ? "Only the methods you tick are used. Anything not connected stays off." : "Kairos will select the methods relevant to your question."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "flex min-h-11 cursor-pointer items-center text-sm font-semibold text-sky",
						children: "View methods"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3 pb-2",
						children: catalog.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-start gap-3",
							children: [manual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mt-1 size-4",
								disabled: item.status !== "available",
								checked: item.status === "available" && picked.includes(item.method),
								onChange: () => toggleMethod(item.method)
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-semibold text-cream",
									children: [item.name, item.mark ? ` · ${item.mark}` : ""]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-xs font-semibold tracking-brand text-sun",
									children: item.statusLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-sm text-mute",
									children: item.blurb
								})
							] })]
						}) }, item.method))
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: HINTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": hint === item.id && panel === "ask",
				onClick: () => {
					setPanel("ask");
					setHint(item.id);
				},
				className: clsx("press min-h-11 rounded-full px-3 text-sm font-semibold", hint === item.id && panel === "ask" ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
				children: item.label
			}, item.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "mt-5 block text-sm font-semibold text-cream",
			htmlFor: "oracle-question",
			children: "What would you like to ask?"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			id: "oracle-question",
			value: question,
			onChange: (event) => setQuestion(event.target.value),
			rows: 4,
			placeholder: "Should I make the move?",
			className: "mt-2 w-full resize-none rounded-2xl bg-ink px-4 py-3 text-base text-cream ring-1 ring-line outline-none placeholder:text-mute"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: EXAMPLES.map((example) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setPanel("ask");
					setQuestion(example);
				},
				className: "press min-h-11 rounded-full px-3 text-left text-sm text-mute ring-1 ring-line",
				children: example
			}, example))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setPanel("ask");
						ask("ask");
					},
					disabled: pending,
					className: "press min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink",
					children: pending && panel === "ask" ? "Reading…" : "Ask Oracle"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPanel("compare"),
					className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", panel === "compare" ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
					children: "Compare two choices"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPanel("dates"),
					className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", panel === "dates" ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line"),
					children: "Pick a date"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void ask("daily"),
					disabled: pending,
					className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-sky ring-1 ring-sky",
					children: "Daily reading"
				})
			]
		}),
		panel === "compare" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm text-cream",
					children: ["Option A", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: optionA,
						onChange: (event) => setOptionA(event.target.value),
						className: `${fieldClass} mt-1`,
						placeholder: "Job A"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm text-cream",
					children: ["Option B", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: optionB,
						onChange: (event) => setOptionB(event.target.value),
						className: `${fieldClass} mt-1`,
						placeholder: "Job B"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void ask("compare"),
					disabled: pending,
					className: "press min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink sm:col-span-2",
					children: "Compare"
				})
			]
		}) : null,
		panel === "dates" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap items-end gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm text-cream",
				children: ["Window, if you do not name dates", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: windowDays,
					onChange: (event) => setWindowDays(Number(event.target.value)),
					className: `${fieldClass} mt-1`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: 7,
						children: "Next 7 days"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: 14,
						children: "Next 14 days"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void ask("dates"),
				disabled: pending,
				className: "press min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink",
				children: "Find dates"
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
			className: "mt-4 rounded-xl bg-panel px-4 py-3 ring-1 ring-line",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "cursor-pointer text-sm font-semibold text-cream",
					children: "Personal details, optional"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-mute",
					children: "A date of birth lets Chinese Zodiac join a compatibility question. BaZi and astrology are not connected, so birth time and place are not used. Shared readings leave birth details out."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm text-cream",
							children: ["Date of birth", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: birthDate,
								onChange: (event) => setBirthDate(event.target.value),
								className: `${fieldClass} mt-1`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm text-cream",
							children: ["Another date of birth", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: birthDateB,
								onChange: (event) => setBirthDateB(event.target.value),
								className: `${fieldClass} mt-1`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm text-cream",
							children: ["Time of birth", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "time",
								value: birthTime,
								onChange: (event) => setBirthTime(event.target.value),
								className: `${fieldClass} mt-1`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm text-cream",
							children: ["Birth place", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: birthPlace,
								onChange: (event) => setBirthPlace(event.target.value),
								placeholder: "Singapore",
								className: `${fieldClass} mt-1`
							})]
						})
					]
				})
			]
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-caution",
			children: error
		}) : null
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg:col-span-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-sans text-4xl font-semibold tracking-brand text-cream",
					children: "ORACLE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-base text-cream",
					children: "Ask what’s on your mind."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-mute",
					children: "Timing, choices, relationships, work — or just curiosity."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid items-start gap-8 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrystalBall, {
						phase,
						steps,
						reading,
						question
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-3",
					children: reading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: clsx(pending && "opacity-60"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-sky",
								children: "QUESTION"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 font-display text-2xl text-cream",
								children: reading.question
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
								mode: "oracle",
								label: "神婆 SAYS",
								text: reading.says,
								status: reading.synthesis?.action === "忌" ? "warning" : reading.synthesis?.action === "宜" ? "good" : "neutral"
							}),
							reading.cameo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-sun",
								children: reading.cameo
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 grid gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsedList, { reading }), reading.methods?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MethodReport, { methods: reading.methods }, reading.id) : null]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-sky",
							children: "HOW ORACLE WORKS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-cream",
							children: howLead
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-mute",
							children: howRest
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs font-semibold tracking-brand text-sky",
							children: "THE SIGNS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-mute",
							children: [catalog.filter((item) => item.status === "available").length, " methods available. Chinese Zodiac needs a date of birth. BaZi and astrology are not connected."]
						}),
						form,
						!pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosVoice, {
							mode: "oracle",
							label: "神婆 SAYS",
							text: "Questions first. Omens later."
						}) : null
					] })
				})]
			}),
			reading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: clsx("mt-8", pending && "opacity-60"),
				children: [
					(reading.signals ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-sky",
							children: "DETAILED READING"
						}), (reading.signals ?? []).map((signal, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalEssay, {
							signal,
							open: index === 0
						}, signal.method))]
					}) : null,
					reading.sides.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-sky",
								children: "THE TWO CHOICES"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-mute",
								children: reading.synthesis?.actionLabel || "No winner was assigned."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid gap-3 sm:grid-cols-2",
								children: reading.sides.map((side) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "rounded-xl bg-panel px-4 py-4 ring-1 ring-line",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold tracking-brand text-sky",
											children: side.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-mute",
											children: side.tradeoff
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 grid gap-2",
											children: side.layers.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayerBlock, { layer }, `${side.label}-${layer.name}-${layer.result}`))
										})
									]
								}, side.label))
							})
						]
					}) : null,
					reading.dates.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-sky",
								children: "CANDIDATE DATES"
							}),
							reading.scanned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-mute",
								children: reading.scanned
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-3 space-y-3",
								children: reading.dates.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-xl bg-panel px-4 py-4 ring-1 ring-line",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display text-2xl text-cream",
												children: day.label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-cream",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-display text-3xl",
													children: day.band
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-3 font-display text-2xl text-sun",
													children: day.action
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-mute",
												children: day.actionLabel
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => addDate(day.date, day.label),
											className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent",
											children: added === day.date ? "Added" : "Add to Today"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 grid gap-2",
										children: day.layers.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayerBlock, { layer }, `${day.date}-${layer.id}`))
									})]
								}, day.date))
							})
						]
					}) : null,
					reading.synthesis ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8 max-w-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-sky",
								children: "METHOD AGREEMENT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-4xl text-cream",
								children: reading.synthesis.agreement
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-mute",
								children: [
									reading.synthesis.supportive,
									" supportive · ",
									reading.synthesis.neutral,
									" neutral · ",
									reading.synthesis.cautionary,
									" cautionary"
								]
							}),
							reading.synthesis.mixed && reading.mode !== "compare" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 font-display text-3xl text-cream",
								children: "THE SIGNS ARE MIXED"
							}) : null,
							(reading.signals ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-1 text-sm text-cream",
								children: (reading.signals ?? []).map((signal) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									signal.name,
									": ",
									signal.signal
								] }, `agree-${signal.method}`))
							}) : null,
							reading.synthesis.conflict ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-xl text-sm leading-relaxed text-mute",
								children: reading.synthesis.conflict
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold tracking-brand text-sky",
										children: "WHAT THIS MEANS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm font-semibold text-cream",
										children: "Good for"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-1 list-disc space-y-1 pl-5 text-sm text-cream",
										children: reading.synthesis.goodFor.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm font-semibold text-cream",
										children: "Less suitable for"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-1 list-disc space-y-1 pl-5 text-sm text-cream",
										children: reading.synthesis.lessFor.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm text-mute",
										children: reading.synthesis.note
									})
								]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setWhy((open) => !open),
						className: "press mt-6 min-h-11 text-sm font-semibold text-sky",
						children: why ? "Hide the longer note" : "Why?"
					}),
					why ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm leading-relaxed text-mute",
						children: reading.expand
					}) : null,
					reading.attention.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-sky",
							children: "PAY ATTENTION TO"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1 text-sm text-cream",
							children: reading.attention.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-sun",
						children: ORACLE_FRAMING
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							reading.layers.some((layer) => layer.id === "tarot" || layer.id === "iching") || reading.sides.some((side) => side.layers.some((layer) => layer.id === "tarot")) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: pending,
								onClick: () => void ask(reading.mode === "daily" ? "daily" : reading.mode === "dates" ? "dates" : reading.mode === "compare" ? "compare" : "ask", true),
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line disabled:opacity-50",
								children: "Draw again"
							}) : null,
							reading.guard === "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: saveReading,
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
								children: savedThis ? "Saved" : "Save reading"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void shareReading(),
								className: "press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line",
								children: copied ? "Copied" : "Share reading"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-mute",
						children: "Refresh keeps this draw. Draw again, or a new question, is the only thing that changes it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "mt-8 max-w-xl rounded-xl bg-panel px-4 py-3 ring-1 ring-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer text-sm font-semibold text-cream",
							children: "Ask another question"
						}), form]
					}),
					saved.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-sky",
							children: "MY READINGS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: saved.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setReading(item.reading);
									setQuestion(item.question);
								},
								className: "press flex min-h-11 w-full items-center justify-between gap-3 rounded-xl bg-panel px-3 text-left ring-1 ring-line",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-sm text-cream",
									children: item.question
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-xs text-mute",
									children: item.energy
								})]
							}) }, item.id))
						})]
					}) : null
				]
			}) : null
		]
	});
}
var DURATIONS = [
	30,
	45,
	60,
	90,
	120
];
var PRESETS = [
	"Budget pitch to boss",
	"Vendor technical sync",
	"Difficult 1:1",
	"Friday makan",
	"Team bonding"
];
function loadRecent() {
	try {
		const raw = JSON.parse(localStorage.getItem("kairos-recent") ?? "[]");
		if (!Array.isArray(raw)) return [];
		return raw.filter((item) => item && typeof item.code === "string" && typeof item.title === "string").slice(0, 6);
	} catch {
		return [];
	}
}
function remember(item) {
	const next = [item, ...loadRecent().filter((entry) => entry.code !== item.code)].slice(0, 6);
	localStorage.setItem("kairos-recent", JSON.stringify(next));
}
function Home() {
	const { mode, code } = Route$5.useSearch();
	const navigate = useNavigate();
	const kind = "meeting";
	const [title, setTitle] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)(60);
	const [slots, setSlots] = (0, import_react.useState)(() => suggestMeetingSlots());
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [joinCode, setJoinCode] = (0, import_react.useState)("");
	const [recent, setRecent] = (0, import_react.useState)([]);
	const [shared, setShared] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [mission, setMission] = (0, import_react.useState)(null);
	const [missionSource, setMissionSource] = (0, import_react.useState)("rules");
	const [missionTitle, setMissionTitle] = (0, import_react.useState)("");
	const [readingRoom, setReadingRoom] = (0, import_react.useState)(false);
	const [editingMission, setEditingMission] = (0, import_react.useState)(false);
	const [format, setFormat] = (0, import_react.useState)("physical");
	const [venueName, setVenueName] = (0, import_react.useState)("");
	const [room, setRoom] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [platform, setPlatform] = (0, import_react.useState)("");
	const [meetingUrl, setMeetingUrl] = (0, import_react.useState)("");
	const [makanWhen, setMakanWhen] = (0, import_react.useState)("");
	const missionLock = (0, import_react.useRef)("");
	const missionFlight = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		setRecent(loadRecent());
	}, []);
	(0, import_react.useEffect)(() => {
		const line = title.trim();
		const lock = `${kind}|${line}`;
		if (line.length < 2 || editingMission) return;
		if (missionLock.current === `grok|${lock}` || missionLock.current === `edit|${lock}`) return;
		setMission(inferMission(line, kind, duration));
		setMissionSource("rules");
		setMissionTitle(line);
	}, [
		title,
		kind,
		duration,
		editingMission
	]);
	const moments = (0, import_react.useMemo)(() => {
		const unique = [...new Set(slots.filter(Boolean))];
		const next = [];
		for (const local of unique) try {
			const iso = localSgtToIso(local);
			next.push({
				local,
				iso,
				reading: readReading(iso, title.trim() || "Untitled gathering", {
					kind,
					durationMin: duration
				})
			});
		} catch {}
		return next;
	}, [
		kind,
		slots,
		title,
		duration
	]);
	const draftKey = JSON.stringify({
		title: title.trim(),
		kind,
		duration,
		format,
		venueName,
		room,
		address,
		platform,
		meetingUrl,
		makanWhen,
		times: moments.map((moment) => moment.local)
	});
	(0, import_react.useEffect)(() => {
		setShared((current) => current && current.key !== draftKey ? null : current);
	}, [draftKey]);
	function validate() {
		if (title.trim().length < 2) return "Name the mission first.";
		if (moments.length === 0) return "Add at least one time.";
		if ((format === "online" || format === "hybrid") && meetingUrl.trim() && !cleanMeetingUrl(meetingUrl)) return "The meeting link needs to be a web address.";
		return "";
	}
	function missionForShare() {
		const line = title.trim();
		const context = mission && missionTitle === line ? mission : inferMission(line, kind, duration);
		const parsed = missionSchema.safeParse({
			...context,
			preferred_conditions: context.preferred_conditions.map((item) => item.trim()).filter((item) => item.length > 1).slice(0, 4)
		});
		if (!parsed.success) return null;
		return {
			mission: parsed.data,
			source: mission && missionTitle === line ? missionSource : "rules"
		};
	}
	async function persistMission(code) {
		const packed = missionForShare();
		if (!packed) return;
		try {
			await saveMission({ data: {
				code,
				mission: packed.mission,
				source: packed.source
			} });
		} catch {}
	}
	async function ensureBoard() {
		if (shared && shared.key === draftKey) {
			await persistMission(shared.code);
			return shared.code;
		}
		const packed = missionForShare();
		const created = await createEvent({ data: {
			title: title.trim(),
			kind,
			durationMin: duration,
			category: "",
			anchorAt: "",
			slots: moments.map((moment) => ({ startsAt: moment.local })),
			mission: packed?.mission,
			missionSource: packed?.source ?? "rules",
			place: {
				format,
				venueName: venueName.trim(),
				room: room.trim(),
				address: address.trim(),
				platform,
				meetingUrl: cleanMeetingUrl(meetingUrl),
				makanWhen
			}
		} });
		remember({
			code: created.code,
			title: title.trim(),
			kind
		});
		pinMeet({
			code: created.code,
			title: title.trim(),
			durationMin: duration,
			format,
			venue: venueName.trim(),
			address: address.trim(),
			slots: moments.map((moment) => moment.local)
		});
		setRecent(loadRecent());
		setShared({
			code: created.code,
			key: draftKey
		});
		return created.code;
	}
	async function onShare(event) {
		event?.preventDefault();
		const problem = validate();
		setError(problem);
		if (problem) return;
		setPending(true);
		try {
			const code = await ensureBoard();
			const url = `${window.location.origin}/meet/${code}`;
			try {
				await navigator.clipboard.writeText(url);
				setCopied(true);
				toast.success("Link copied");
			} catch {
				setCopied(false);
				toast.message("Board is open. Copy the code if the link did not.");
			}
			if (window.innerWidth < 1024) document.getElementById("kairos-result")?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not open the board");
		} finally {
			setPending(false);
		}
	}
	async function onPoll() {
		const problem = validate();
		setError(problem);
		if (problem) return;
		setPending(true);
		try {
			const code = await ensureBoard();
			await navigate({
				to: "/meet/$code",
				params: { code }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not open the board");
			setPending(false);
		}
	}
	async function onJoin(event) {
		event.preventDefault();
		const next = joinCode.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
		if (next.length < 4) {
			setError("Codes look like k7m2qx.");
			return;
		}
		try {
			if ((await resolveJoinCode({ data: { code: next } })).kind === "hash") {
				await navigate({
					to: "/",
					search: {
						mode: "hash",
						code: next
					}
				});
				return;
			}
		} catch {}
		navigate({
			to: "/meet/$code",
			params: { code: next }
		});
	}
	async function readRoom(force = false) {
		const line = title.trim();
		if (line.length < 2 || readingRoom) return;
		const lock = `${kind}|${line}`;
		if (!force && missionLock.current === `grok|${lock}`) return;
		if (missionFlight.current === lock) return;
		missionFlight.current = lock;
		setReadingRoom(true);
		try {
			const result = await analyzeMission({ data: {
				title: line,
				kind,
				durationMin: duration
			} });
			if (title.trim() !== line) return;
			setMission(result.context);
			setMissionSource(result.source);
			setMissionTitle(line);
			setEditingMission(false);
			missionLock.current = result.source === "grok" ? `grok|${lock}` : "";
			if (shared) try {
				await saveMission({ data: {
					code: shared.code,
					mission: result.context,
					source: result.source
				} });
			} catch {}
		} catch {
			const fallback = inferMission(line, kind, duration);
			setMission(fallback);
			setMissionSource("rules");
			setMissionTitle(line);
		} finally {
			if (missionFlight.current === lock) missionFlight.current = "";
			setReadingRoom(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "rise flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seal, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-brand text-gold",
							children: "GOOD TIMES"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-sans text-4xl font-semibold leading-none tracking-brand sm:text-5xl",
							children: "KAIROS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-2xl text-vermilion",
							children: "良辰吉日"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onJoin,
				className: "flex w-full gap-2 sm:w-72",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: "join-code",
						children: "Event code"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "join-code",
						value: joinCode,
						onChange: (event) => setJoinCode(event.target.value),
						placeholder: "Have a code?",
						autoCapitalize: "none",
						autoCorrect: "off",
						className: fieldClass
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "press h-12 shrink-0 rounded-xl bg-panel px-4 font-semibold text-cream ring-1 ring-line",
						children: "Join"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-mode": mode === "family" || mode === "dating" || mode === "today" || mode === "travel" || mode === "oracle" ? mode : "work",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rise rise-2 mt-5 max-w-2xl text-base text-mute",
					children: "Find the right time. The right place. And what to do next."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KairosNav, {
						active: mode,
						code
					})
				}),
				recent.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-brand text-mute",
						children: "RECENT"
					}), recent.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/meet/$code",
						params: { code: item.code },
						className: "press inline-flex min-h-9 max-w-full items-center gap-2 rounded-full bg-panel px-3 text-sm text-cream ring-1 ring-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs tracking-widest text-gold",
							children: item.code
						})]
					}, item.code))]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mode-swap mt-8 grid items-start gap-8 lg:grid-cols-5",
					children: mode === "today" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayStudio, {}) : mode === "makan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MakanStudio, { code }) : mode === "out" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutStudio, {}) : mode === "family" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FamilyStudio, {}) : mode === "dating" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatingStudio, {}) : mode === "travel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TravelStudio, {})
					}) : mode === "oracle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OracleStudio, {}) : mode === "hash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HashStudio, { code }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						id: "mission",
						onSubmit: (event) => void onShare(event),
						className: "lg:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold tracking-brand text-gold",
								children: "1 · SET THE MISSION"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-2xl text-cream",
								children: "What are you trying to land?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: PRESETS.map((preset) => {
									const selected = title === preset;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": selected,
										onClick: () => {
											setTitle(preset);
											if (preset === "Friday makan") setDuration(90);
										},
										className: clsx("press min-h-9 rounded-full px-3 text-sm", selected ? "bg-vermilion font-semibold text-cream" : "bg-panel text-cream ring-1 ring-line"),
										children: preset
									}, preset);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-4 block text-sm font-medium text-cream",
								htmlFor: "event-title",
								children: "Mission"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "event-title",
								value: title,
								onChange: (event) => setTitle(event.target.value),
								onBlur: () => {
									if (title.trim().length >= 24) readRoom();
								},
								maxLength: 180,
								placeholder: "Need to ask Director for additional project funding",
								className: clsx(fieldClass, "mt-2")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissionRead, {
								title,
								reading: mission && missionTitle === title.trim() ? mission : null,
								editing: editingMission,
								pending: readingRoom,
								onRead: () => void readRoom(true),
								onEdit: () => setEditingMission(true),
								onCloseEdit: () => {
									setEditingMission(false);
									if (shared) persistMission(shared.code);
								},
								onChange: (next) => {
									missionLock.current = `edit|${kind}|${title.trim()}`;
									setMission(next);
									setMissionSource("rules");
									setMissionTitle(title.trim());
								},
								onUseDuration: (minutes) => setDuration(minutes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm font-medium text-cream",
								children: "How long"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: DURATIONS.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": duration === value,
									onClick: () => setDuration(value),
									className: clsx("press min-h-11 min-w-14 rounded-xl px-3 text-sm font-semibold tabular-nums", duration === value ? "bg-gold text-ink" : "bg-panel text-cream ring-1 ring-line"),
									children: [value, "m"]
								}, value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4",
								id: "times",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold tracking-brand text-gold",
										children: "2 · POSSIBLE MOMENTS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium text-cream",
										children: "Two to five times, Singapore"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 space-y-2",
										children: (slots.length ? slots : [
											"",
											"",
											""
										]).map((slot, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "sr-only",
													htmlFor: `slot-${index}`,
													children: ["Time ", index + 1]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													id: `slot-${index}`,
													type: "datetime-local",
													value: slot,
													onChange: (event) => setSlots((prev) => prev.map((item, itemIndex) => itemIndex === index ? event.target.value : item)),
													className: fieldClass
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": `Remove time ${index + 1}`,
													disabled: slots.length <= 1,
													onClick: () => setSlots((prev) => prev.filter((_, itemIndex) => itemIndex !== index)),
													className: "press grid size-12 shrink-0 place-items-center rounded-xl bg-panel text-cream ring-1 ring-line disabled:opacity-40",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
														className: "size-4",
														"aria-hidden": true
													})
												})
											]
										}, index))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: slots.length >= 6,
										onClick: () => setSlots((prev) => {
											if (prev.length >= 6) return prev;
											const next = suggestMeetingSlots().find((slot) => !prev.includes(slot)) ?? prev[prev.length - 1] ?? "";
											return [...prev, next];
										}),
										className: "press mt-2 flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-gold disabled:opacity-40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
											className: "size-4",
											"aria-hidden": true
										}), "Add a time"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm font-medium text-cream",
								children: "Where"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [
									["physical", "Physical"],
									["online", "Online"],
									["hybrid", "Hybrid"]
								].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": format === value,
									onClick: () => setFormat(value),
									className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", format === value ? "bg-gold text-ink" : "bg-panel text-cream ring-1 ring-line"),
									children: label
								}, value))
							}),
							format !== "online" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: venueName,
										onChange: (event) => setVenueName(event.target.value),
										placeholder: "Venue or office",
										maxLength: 80,
										className: fieldClass
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: room,
										onChange: (event) => setRoom(event.target.value),
										placeholder: "Level, room",
										maxLength: 80,
										className: fieldClass
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: address,
										onChange: (event) => setAddress(event.target.value),
										placeholder: "Street address",
										maxLength: 160,
										className: fieldClass
									})
								]
							}) : null,
							format !== "physical" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										["teams", "Teams"],
										["zoom", "Zoom"],
										["skype", "Skype"],
										["meet", "Google Meet"],
										["webex", "Webex"],
										["other", "Other"]
									].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": platform === value,
										onClick: () => setPlatform(value),
										className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", platform === value ? "bg-jade text-ink" : "bg-panel text-cream ring-1 ring-line"),
										children: label
									}, value))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: meetingUrl,
									onChange: (event) => setMeetingUrl(event.target.value),
									placeholder: "https://teams.microsoft.com/...",
									inputMode: "url",
									className: fieldClass
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm font-medium text-cream",
								children: "Add makan?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [
									["before", "Before"],
									["after", "After"],
									["", "Not now"]
								].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": makanWhen === value,
									onClick: () => setMakanWhen(value),
									className: clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", makanWhen === value ? "bg-vermilion text-cream" : "bg-panel text-cream ring-1 ring-line"),
									children: label
								}, label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-mute",
								children: makanWhen ? "After the board is shared, Kairos carries this place and time into Makan." : "Before or after the meeting. Not another mode."
							}),
							shared && makanWhen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								search: {
									mode: "makan",
									code: shared.code
								},
								className: "mt-3 inline-flex text-sm font-semibold text-gold",
								children: "Find makan nearby"
							}) : null,
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "mt-4 text-sm text-vermilion",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-xs font-semibold tracking-brand text-gold",
								children: "3 · INVITE THE PEOPLE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: pending,
								className: "press mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-vermilion text-base font-semibold text-cream disabled:opacity-50",
								children: pending ? "Opening the board…" : "Share the moments"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-center text-xs text-mute",
								children: "Guests vote with a nickname. No login. No calendar access."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteStage, {
							durationMin: duration,
							moments: moments.map((moment) => ({
								iso: moment.iso,
								reading: moment.reading
							})),
							sharedCode: shared?.code ?? "",
							copied,
							pending,
							onOpen: () => void onPoll(),
							context: mission && missionTitle === title.trim() ? mission : null
						})
					})] })
				}, mode),
				mode === "meet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-3",
					children: [
						[
							"1",
							"Pick the moments",
							"Offer a few possible times. Not a whole empty week."
						],
						[
							"2",
							"Let people vote",
							"Not just whether they can make it. How much they actually want the slot."
						],
						[
							"3",
							"Let Kairos decide",
							"Human preference, meeting context, and a little cosmic luck."
						]
					].map(([step, heading, copy]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl text-gold",
							children: step
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-1 flex items-center gap-2 font-semibold text-cream",
							children: [heading, step === "3" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								className: "size-4 text-gold",
								"aria-hidden": true
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-mute",
							children: copy
						})
					] }, step))
				}) : null
			]
		})]
	}) });
}
//#endregion
export { Home as component };
