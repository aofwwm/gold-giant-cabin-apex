import { o as __toESM } from "../_runtime.mjs";
import { a as literal, c as record, d as union, l as string, n as array, o as number, r as boolean, s as object, t as _enum } from "../_libs/zod.mjs";
import { a as missionSchema } from "./mission-DOaVQo-M.mjs";
import { i as PLATFORMS, n as FORMATS, r as MAKAN_WHEN } from "./place-Cj_BvgPc.mjs";
import { Q as require_react, S as useRouter, X as notFound, Z as require_jsx_runtime, _ as lazyRouteComponent, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, q as redirect, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Frame } from "./kairos-ui-Cn9dlenL.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { s as ensureInviteSlug, t as INVITE_SLUG } from "./dating-invite-DIfg4EzO.mjs";
import { n as DATE_TYPES, r as DATE_VIBES, t as DATE_FOODS } from "./dating-DQG0N1wV.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-C1p7zOu_.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/kairos.functions-Cy0RzYQp.js
function parse(schema, input) {
	const result = schema.safeParse(input);
	if (!result.success) throw new Error(result.error.issues[0]?.message ?? "Check that and try again");
	return result.data;
}
var localTime = string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Check the date and time");
var codeSchema = string().trim().regex(/^[a-zA-Z0-9]{4,12}$/, "That code does not look right").transform((value) => value.toLowerCase());
var nicknameSchema = string().trim().min(1, "Add a nickname").max(24, "Nickname is too long").refine((value) => !value.includes("@"), "Use a nickname, not an email").refine((value) => !/[\u0000-\u001f]/.test(value), "That nickname will not print");
var CreateInput = object({
	title: string().trim().min(2, "Give it a name").max(180, "Keep the purpose to a sentence or two"),
	kind: _enum(["meeting", "makan"]),
	durationMin: union([
		literal(30),
		literal(45),
		literal(60),
		literal(90),
		literal(120)
	]),
	category: _enum([
		"",
		"supper",
		"pickle",
		"board",
		"drink",
		"neighbourhood"
	]),
	slots: array(object({
		startsAt: localTime,
		label: string().trim().max(80).optional()
	})).max(6, "Six times is enough drama"),
	anchorAt: string().optional(),
	mission: missionSchema.optional(),
	missionSource: _enum(["grok", "rules"]).optional(),
	place: object({
		format: _enum(FORMATS),
		venueName: string().trim().max(80).optional().default(""),
		room: string().trim().max(80).optional().default(""),
		address: string().trim().max(160).optional().default(""),
		platform: _enum(PLATFORMS).optional().default(""),
		meetingUrl: string().trim().max(300).optional().default(""),
		makanWhen: _enum(MAKAN_WHEN).optional().default("")
	}).optional()
});
var fetchEvent = createServerFn({ method: "GET" }).validator((input) => parse(object({ code: codeSchema }), input)).handler(createSsrRpc("6f1f13049f815a5a6d9513233a1231cddc1e40d5eab2008d00eafc033beb6912"));
var createEvent = createServerFn({ method: "POST" }).validator((input) => parse(CreateInput, input)).handler(createSsrRpc("ec4d578cf42812aca08340fd31123882787c7c5df0b8f166ab4f87950ea28bf7"));
var castVote = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	slotId: string().trim().min(6).max(16),
	nickname: nicknameSchema,
	choice: _enum([
		"love",
		"yes",
		"soft",
		"no"
	])
}), input)).handler(createSsrRpc("c6960ff97f5671bb624eac0552b9590e04c759f34804057ba74bbd82c5e06659"));
var addSlot = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	startsAt: localTime,
	label: string().trim().max(80).optional()
}), input)).handler(createSsrRpc("e5a59f19c24c8c7088f3614fd97dc86388efd47728c06f7862ee338eba0038b5"));
var addComment = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	nickname: nicknameSchema,
	body: string().trim().min(1, "Write a short note").max(180, "Keep the slip short")
}), input)).handler(createSsrRpc("0581028e42d6e834fe699238364d4fe812c6ce3353b109fe02a156926b527085"));
var consultOracle = createServerFn({ method: "POST" }).validator((input) => parse(object({ code: codeSchema }), input)).handler(createSsrRpc("2744c2fe57e760f93eceaa845f79e4da2b74bb428973626f91b7bee796d3235a"));
var spinVenue = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	category: _enum([
		"supper",
		"pickle",
		"board",
		"drink",
		"neighbourhood"
	]),
	startsAt: string().optional()
}), input)).handler(createSsrRpc("210bbbdbe9f24a08f76680fba0e1384f0e36f15a0cc304d6065ef40b155e6182"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/dating.functions-DAiQ1U54.js
var brief = object({
	dateType: _enum(DATE_TYPES),
	date: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	whenLabel: string().max(40).optional().default(""),
	startMin: number().int().min(360).max(1320),
	span: _enum([
		"quick",
		"half",
		"full"
	]),
	budget: number().int().min(0).max(500),
	freeOnly: boolean(),
	latitude: number(),
	longitude: number(),
	area: string().trim().min(2).max(80),
	originAddress: string().max(160).optional().default(""),
	originProvider: string().max(40).optional().default(""),
	originId: string().max(80).optional().default(""),
	maxTravel: number().int().min(15).max(120),
	travelMode: _enum([
		"drive",
		"walk",
		"ride",
		"transit"
	]),
	setting: _enum([
		"indoor",
		"outdoor",
		"either",
		"mix"
	]),
	vibes: array(_enum(DATE_VIBES)).max(8),
	foods: array(_enum(DATE_FOODS)).max(8),
	pressure: _enum([
		"low",
		"balanced",
		"memorable"
	]),
	formality: _enum([
		"casual",
		"smart",
		"dress"
	]),
	alcohol: _enum([
		"any",
		"none",
		"ok"
	]),
	crowd: _enum([
		"avoid",
		"ok",
		"lively"
	]),
	diets: array(string().max(20)).max(6).optional().default([]),
	goal: string().max(40).optional().default(""),
	text: string().max(500).optional().default(""),
	rejected: array(string().max(120)).max(48).optional().default([]),
	rejectedVenues: array(string().max(120)).max(48).optional().default([]),
	seen: array(string().max(80)).max(24).optional().default([]),
	spin: number().int().min(0).max(24).optional().default(0),
	tightSecondLeg: boolean().optional().default(false),
	avoid: array(string().max(40)).max(6).optional().default([]),
	locked: array(object({
		placeId: string().max(80),
		title: string().max(80),
		address: string().max(160),
		latitude: number(),
		longitude: number(),
		setting: _enum(["indoor", "outdoor"]),
		kind: _enum([
			"meal",
			"cafe",
			"scenic",
			"activity"
		])
	})).max(4).optional().default([])
});
var planDate = createServerFn({ method: "POST" }).validator((input) => brief.parse(input)).handler(createSsrRpc("e29ccccefb8dd142cc60e045b14a25e2bda8a6944ffba918c4e2419e7aeed49a"));
var parseDateBrief = createServerFn({ method: "POST" }).validator((input) => object({
	text: string().max(500),
	today: string().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(input)).handler(createSsrRpc("94b8ce4b46056e1390fbae660704627cae72f500c56f41f58b85a70bd74e418a"));
var saveDatingPlan = createServerFn({ method: "POST" }).validator((input) => object({
	title: string().min(2).max(80),
	dateType: string().max(20),
	budget: number().int(),
	travelMode: string().max(20),
	area: string().max(80),
	startTime: string().max(8),
	duration: string().max(20),
	preferences: record(string(), string()).optional().default({}),
	datingScore: number().int().nullable(),
	stops: array(object({
		sequence: number().int(),
		stopType: string().max(20),
		title: string().max(80),
		address: string().max(160),
		latitude: number(),
		longitude: number(),
		startTime: string().max(12),
		endTime: string().max(12),
		estimatedCost: number().nullable(),
		indoorOutdoor: string().max(12),
		sourceUrl: string().max(200).optional().default(""),
		sourceType: string().max(20),
		locked: boolean()
	})).max(6)
}).parse(input)).handler(createSsrRpc("2dd9364caf902479557461692b971dd763efa6d59ff66a074192c855a19b343b"));
var inviteInput = object({
	title: string().min(2).max(80),
	whenLabel: string().max(60),
	area: string().max(80),
	message: string().max(280),
	note: string().max(180).optional().default(""),
	duration: string().max(40),
	dress: string().max(40),
	vibe: string().max(80),
	tone: _enum([
		"minimal",
		"warm",
		"playful",
		"romantic"
	]),
	visibility: _enum([
		"full",
		"first",
		"mystery"
	]),
	recipientName: string().max(40).optional().default(""),
	dateType: string().max(20),
	stops: array(object({
		slot: string().max(40),
		title: string().max(80),
		address: string().max(160),
		time: string().max(40),
		setting: string().max(12)
	})).max(8),
	footer: string().max(80),
	slug: string().regex(INVITE_SLUG),
	editToken: string().max(80).optional().default("")
});
function parseInviteInput(input) {
	const source = input && typeof input === "object" ? { ...input } : {};
	const incoming = typeof source.slug === "string" ? source.slug : "";
	console.log("[INVITE] payload before validation", {
		...source,
		slug: incoming
	});
	console.log("[INVITE] slug", incoming);
	console.log("[INVITE] slug length", incoming.length);
	console.log("[INVITE] regex passes", INVITE_SLUG.test(incoming));
	const slug = ensureInviteSlug(incoming);
	console.log("[INVITE] slug used", slug);
	console.log("[INVITE] slug used length", slug.length);
	console.log("[INVITE] regex passes", INVITE_SLUG.test(slug));
	return inviteInput.parse({
		...source,
		slug
	});
}
var createDatingInvite = createServerFn({ method: "POST" }).validator(parseInviteInput).handler(createSsrRpc("06c6bf4aeb71caf45227cc48e8112f0855ef3126743b751fdbe46322f17f924f"));
var fetchDatingInvite = createServerFn({ method: "POST" }).validator((input) => object({ slug: string().min(1).max(64) }).parse(input)).handler(createSsrRpc("fd81c138688ef8bc5749bf641df4fa47829c6fbf26bbd3ab758428b95965c4d0"));
var fetchPlannerDatingInvite = createServerFn({ method: "POST" }).validator((input) => object({ plannerToken: string().regex(INVITE_SLUG) }).parse(input)).handler(createSsrRpc("43bcd84bbb0af6838ff1e3828448b225d2dc896f927265487bb8d84a6096b871"));
var revokeDatingInvite = createServerFn({ method: "POST" }).validator((input) => object({ plannerToken: string().regex(INVITE_SLUG) }).parse(input)).handler(createSsrRpc("bfc62d71ad0086150773f239f6f586f6631f11bb29af6c364067720ec59db49f"));
var answerDatingInvite = createServerFn({ method: "POST" }).validator((input) => object({
	slug: string().regex(INVITE_SLUG),
	status: _enum(["sounds_good", "alternate_time_requested"]),
	note: string().max(280).optional().default(""),
	times: array(string().max(40)).max(3).optional().default([])
}).parse(input)).handler(createSsrRpc("c535ac0301a1bf0f8991713b0033614c7606874c4f1eb4beb3a135128911a7ef"));
var polishDatingInvite = createServerFn({ method: "POST" }).validator((input) => object({
	tone: _enum([
		"minimal",
		"warm",
		"playful",
		"romantic"
	]),
	draft: string().max(280),
	note: string().max(180).optional().default(""),
	dateType: string().max(20)
}).parse(input)).handler(createSsrRpc("efb727d2169e35057d727edd35d33aec4cd2fd8972b7ccc170e7e29e2f642139"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-TB2ea2rn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-ink px-6 text-center text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-vermilion",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "The board stumbled"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-mute",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function CostPanel() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [report, setReport] = (0, import_react.useState)(null);
	return null;
}
var styles_default = "/assets/styles-CkCwkz2Z.css";
var APP_NAME = "Kairos";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: `${APP_NAME} · 良辰吉日` },
			{
				name: "description",
				content: "Meet, makan, or a team outing. Nickname votes. Real places. No login. No calendar access."
			},
			{
				name: "theme-color",
				content: "#120e0c"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700&family=Outfit:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				toastOptions: { style: {
					background: "var(--color-panel)",
					color: "var(--color-cream)",
					border: "1px solid var(--color-line)"
				} }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CostPanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var KAIROS_MODES = [
	"today",
	"meet",
	"makan",
	"out",
	"hash",
	"family",
	"dating",
	"travel",
	"oracle"
];
var KAIROS_TODAY = {
	mode: "today",
	label: "Today"
};
var KAIROS_WORK = [
	{
		mode: "meet",
		label: "Meet"
	},
	{
		mode: "makan",
		label: "Makan"
	},
	{
		mode: "out",
		label: "Team Out"
	},
	{
		mode: "hash",
		label: "Hash It Out"
	}
];
var KAIROS_LIFE = [
	{
		mode: "family",
		label: "Family"
	},
	{
		mode: "dating",
		label: "Dating"
	},
	{
		mode: "travel",
		label: "Travel"
	},
	{
		mode: "oracle",
		label: "Oracle"
	}
];
function isKairosMode(value) {
	return typeof value === "string" && KAIROS_MODES.includes(value);
}
var $$splitComponentImporter$3 = () => import("./routes-DB4rXmre.mjs");
var Route$5 = createFileRoute("/")({
	validateSearch: (search) => ({
		mode: isKairosMode(search.mode) ? search.mode : "meet",
		code: typeof search.code === "string" ? search.code.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toLowerCase() : ""
	}),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var Route$4 = createFileRoute("/makan")({
	validateSearch: (search) => ({ code: typeof search.code === "string" ? search.code.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toLowerCase() : "" }),
	beforeLoad: ({ search }) => {
		throw redirect({
			to: "/",
			search: {
				mode: "makan",
				code: search.code
			}
		});
	}
});
var Route$3 = createFileRoute("/out")({ beforeLoad: () => {
	throw redirect({
		to: "/",
		search: {
			mode: "out",
			code: ""
		}
	});
} });
var $$splitComponentImporter$2 = () => import("../_slug-YWrLfUKM.mjs");
var Route$2 = createFileRoute("/date/$slug")({
	loader: async ({ params }) => {
		console.info("[PUBLIC INVITE] route slug:", params.slug);
		return fetchDatingInvite({ data: { slug: params.slug } });
	},
	head: ({ loaderData }) => ({ meta: [{ title: loaderData?.state === "ready" ? `${loaderData.invite.title} · Kairos` : "Kairos" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_code-D0gVPf9_.mjs");
var $$splitNotFoundComponentImporter = () => import("../_code-DafOsRP3.mjs");
var Route$1 = createFileRoute("/meet/$code")({
	loader: async ({ params }) => {
		if (!/^[a-zA-Z0-9]{4,12}$/.test(params.code)) throw notFound();
		const event = await fetchEvent({ data: { code: params.code } });
		if (!event) throw notFound();
		return event;
	},
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.title} · Kairos` : "Kairos" }] }),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	pendingComponent: Pending,
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
function Pending() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-6 py-24 text-center text-mute",
		children: "Opening the board…"
	}) });
}
var $$splitComponentImporter = () => import("../_plannerToken-BXxOjzkf.mjs");
var Route = createFileRoute("/date/manage/$plannerToken")({
	loader: async ({ params }) => {
		if (!INVITE_SLUG.test(params.plannerToken)) return { state: "missing" };
		return fetchPlannerDatingInvite({ data: { plannerToken: params.plannerToken } });
	},
	head: () => ({ meta: [{ title: "Your invitation · Kairos" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	MakanRoute: Route$4.update({
		id: "/makan",
		path: "/makan",
		getParentRoute: () => Route$6
	}),
	OutRoute: Route$3.update({
		id: "/out",
		path: "/out",
		getParentRoute: () => Route$6
	}),
	DateSlugRoute: Route$2.update({
		id: "/date/$slug",
		path: "/date/$slug",
		getParentRoute: () => Route$6
	}),
	MeetCodeRoute: Route$1.update({
		id: "/meet/$code",
		path: "/meet/$code",
		getParentRoute: () => Route$6
	}),
	DateManagePlannerTokenRoute: Route.update({
		id: "/date/manage/$plannerToken",
		path: "/date/manage/$plannerToken",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { fetchEvent as C, createEvent as S, createSsrRpc as T, saveDatingPlan as _, Route$5 as a, castVote as b, KAIROS_WORK as c, fetchDatingInvite as d, fetchPlannerDatingInvite as f, revokeDatingInvite as g, polishDatingInvite as h, Route$2 as i, answerDatingInvite as l, planDate as m, Route as n, KAIROS_LIFE as o, parseDateBrief as p, Route$1 as r, KAIROS_TODAY as s, router_exports as t, createDatingInvite as u, addComment as v, spinVenue as w, consultOracle as x, addSlot as y };
