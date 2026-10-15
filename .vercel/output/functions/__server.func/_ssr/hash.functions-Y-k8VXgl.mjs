import { a as literal, d as union, i as discriminatedUnion, l as string, r as boolean, s as object, t as _enum } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hash.functions-Y-k8VXgl.js
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
var resolveJoinCode_createServerFn_handler = createServerRpc({
	id: "03bc041f2ee67c0432269c28716e44d2c143fee99e2b694cd9ee61e79cc07de8",
	name: "resolveJoinCode",
	filename: "src/lib/hash.functions.ts"
}, (opts) => resolveJoinCode.__executeServer(opts));
var resolveJoinCode = createServerFn({ method: "GET" }).validator((input) => parse(object({ code: codeSchema }), input)).handler(resolveJoinCode_createServerFn_handler, async ({ data }) => {
	const { resolveJoin } = await import("./hash.server-jKaHWnSQ.mjs");
	return resolveJoin(data.code);
});
var createHashSession_createServerFn_handler = createServerRpc({
	id: "c7a363c677c079bcc1706cdf2eeebf0e753272f5c81b3063e5903b83058171b8",
	name: "createHashSession",
	filename: "src/lib/hash.functions.ts"
}, (opts) => createHashSession.__executeServer(opts));
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
}), input)).handler(createHashSession_createServerFn_handler, async ({ data }) => {
	const { createHashSession: create } = await import("./hash.server-jKaHWnSQ.mjs");
	return create({
		...data,
		identityMode: data.identityMode
	});
});
var fetchHashRoom_createServerFn_handler = createServerRpc({
	id: "f5e308501adf8aaf95bf49d7a229376b9fe2b33087f96c7caee414c580fc11df",
	name: "fetchHashRoom",
	filename: "src/lib/hash.functions.ts"
}, (opts) => fetchHashRoom.__executeServer(opts));
var fetchHashRoom = createServerFn({ method: "GET" }).validator((input) => parse(object({
	code: codeSchema,
	participantToken: participantSchema.or(literal("")),
	hostToken: hostSchema
}), input)).handler(fetchHashRoom_createServerFn_handler, async ({ data }) => {
	const { readHashRoom } = await import("./hash.server-jKaHWnSQ.mjs");
	return readHashRoom(data.code, data.participantToken, data.hostToken);
});
var throwHashIdea_createServerFn_handler = createServerRpc({
	id: "48321ba401c04a761624b2959415d4b07d236d0e5e284208967502bce6bda806",
	name: "throwHashIdea",
	filename: "src/lib/hash.functions.ts"
}, (opts) => throwHashIdea.__executeServer(opts));
var throwHashIdea = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	participantToken: participantSchema,
	hostToken: hostSchema,
	text: string().trim().min(2, "Throw in a few words").max(240),
	anonymous: boolean(),
	displayName: string().trim().max(24).optional().default("")
}), input)).handler(throwHashIdea_createServerFn_handler, async ({ data }) => {
	const { throwIdea } = await import("./hash.server-jKaHWnSQ.mjs");
	return throwIdea(data);
});
var supportHashTheme_createServerFn_handler = createServerRpc({
	id: "ac8f6a1e42683712ab8e9c88fd311da815dee08a7c41a20488de8ac6620c5308",
	name: "supportHashTheme",
	filename: "src/lib/hash.functions.ts"
}, (opts) => supportHashTheme.__executeServer(opts));
var supportHashTheme = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	participantToken: participantSchema,
	clusterId: string().min(4).max(40)
}), input)).handler(supportHashTheme_createServerFn_handler, async ({ data }) => {
	const { supportTheme } = await import("./hash.server-jKaHWnSQ.mjs");
	return supportTheme(data);
});
var voteHashTheme_createServerFn_handler = createServerRpc({
	id: "e7e80644b429d31cbf6d2378ce09b8e226d7dbee043bbcbef9b7d10e6181a4b7",
	name: "voteHashTheme",
	filename: "src/lib/hash.functions.ts"
}, (opts) => voteHashTheme.__executeServer(opts));
var voteHashTheme = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	participantToken: participantSchema,
	clusterId: string().min(4).max(40)
}), input)).handler(voteHashTheme_createServerFn_handler, async ({ data }) => {
	const { voteTheme } = await import("./hash.server-jKaHWnSQ.mjs");
	return voteTheme(data);
});
var collateHashRoom_createServerFn_handler = createServerRpc({
	id: "9c8104f3c3b184bd462c28c64208e3afc5048870e6b7b1366331ce40d85831b4",
	name: "collateHashRoom",
	filename: "src/lib/hash.functions.ts"
}, (opts) => collateHashRoom.__executeServer(opts));
var collateHashRoom = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	hostToken: string().trim().min(20).max(80),
	auto: boolean().optional().default(false)
}), input)).handler(collateHashRoom_createServerFn_handler, async ({ data }) => {
	const { collateRoom } = await import("./hash.server-jKaHWnSQ.mjs");
	return collateRoom(data.code, data.hostToken, data.auto);
});
var summariseHashRoom_createServerFn_handler = createServerRpc({
	id: "89d41bdd6132ea3b911dd0fa92c70adf7670d53fb86a6e5c7aabc9fb3692d58f",
	name: "summariseHashRoom",
	filename: "src/lib/hash.functions.ts"
}, (opts) => summariseHashRoom.__executeServer(opts));
var summariseHashRoom = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	hostToken: string().trim().min(20).max(80)
}), input)).handler(summariseHashRoom_createServerFn_handler, async ({ data }) => {
	const { summariseRoom } = await import("./hash.server-jKaHWnSQ.mjs");
	return summariseRoom(data.code, data.hostToken);
});
var hostHashRoom_createServerFn_handler = createServerRpc({
	id: "5eca2a3959f127efbc25e9cac6b25656573e0ce6c372ab36cade6c62e992f87a",
	name: "hostHashRoom",
	filename: "src/lib/hash.functions.ts"
}, (opts) => hostHashRoom.__executeServer(opts));
var hostHashRoom = createServerFn({ method: "POST" }).validator((input) => parse(object({
	code: codeSchema,
	hostToken: string().trim().min(20).max(80),
	command: HostCommand
}), input)).handler(hostHashRoom_createServerFn_handler, async ({ data }) => {
	const { hostCommand } = await import("./hash.server-jKaHWnSQ.mjs");
	return hostCommand(data.code, data.hostToken, data.command);
});
//#endregion
export { collateHashRoom_createServerFn_handler, createHashSession_createServerFn_handler, fetchHashRoom_createServerFn_handler, hostHashRoom_createServerFn_handler, resolveJoinCode_createServerFn_handler, summariseHashRoom_createServerFn_handler, supportHashTheme_createServerFn_handler, throwHashIdea_createServerFn_handler, voteHashTheme_createServerFn_handler };
