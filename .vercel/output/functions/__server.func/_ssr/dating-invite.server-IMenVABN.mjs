import { c as generateInviteSlug, n as INVITE_TONES, t as INVITE_SLUG } from "./dating-invite-DIfg4EzO.mjs";
import { KAIROS_VOICE, geminiJson } from "./gemini.server-D3PyYOAp.mjs";
import { n as supabaseConfigured, t as getSupabase } from "./supabase-BKxuSUOP.mjs";
import { randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/dating-invite.server-IMenVABN.js
function fromRow(row) {
	const raw = row.public_payload ?? row.payload;
	const payload = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
	const slug = row.invite_slug || (typeof payload.slug === "string" ? payload.slug : "");
	if (!INVITE_SLUG.test(slug)) return null;
	const columnVisibility = row.visibility === "first_stop" ? "first" : row.visibility === "mystery" ? "mystery" : row.visibility === "full_plan" ? "full" : void 0;
	const visibility = payload.visibility === "full" || payload.visibility === "first" || payload.visibility === "mystery" ? payload.visibility : columnVisibility ?? "full";
	const tone = INVITE_TONES.includes(payload.tone) ? payload.tone : INVITE_TONES.includes(row.tone) ? row.tone : "warm";
	const payloadMessage = typeof payload.message === "string" ? payload.message : "";
	const columnMessage = typeof row.message === "string" ? row.message : "";
	const storedReply = (typeof row.recipient_note === "string" ? row.recipient_note.trim() : "") || (columnMessage && payloadMessage && columnMessage !== payloadMessage ? columnMessage : "");
	const reply = row.reply ?? {};
	const stops = Array.isArray(payload.stops) ? payload.stops : [];
	const status = row.status === "sounds_good" || row.status === "alternate_time_requested" || row.status === "revoked" ? row.status : "pending";
	return {
		slug,
		title: payload.title || row.title || "Invitation",
		whenLabel: payload.whenLabel || "",
		area: payload.area || "",
		message: payloadMessage || (storedReply && storedReply === columnMessage ? "" : columnMessage),
		note: payload.note || "",
		duration: payload.duration || "",
		dress: payload.dress || "",
		vibe: payload.vibe || "",
		tone,
		visibility,
		recipientName: payload.recipientName || row.recipient_name || "",
		dateType: payload.dateType || "",
		stops,
		footer: payload.footer || "",
		status,
		replyNote: typeof reply.note === "string" && reply.note || storedReply || payload.replyNote || "",
		replyTimes: Array.isArray(reply.times) ? reply.times.filter((item) => typeof item === "string").slice(0, 3) : payload.replyTimes || [],
		updatedAt: typeof row.updated_at === "string" ? row.updated_at : ""
	};
}
function freshToken() {
	return randomBytes(18).toString("base64url");
}
function publicCard(invite) {
	return {
		...invite,
		stops: invite.stops.map((stop) => ({
			slot: stop.slot,
			title: stop.title,
			address: stop.address,
			time: stop.time,
			setting: stop.setting
		}))
	};
}
function stripPlannerSecrets(row) {
	if (!row || typeof row !== "object") return null;
	const copy = { ...row };
	delete copy.planner_token;
	delete copy.plannerToken;
	const payload = copy.public_payload;
	if (payload && typeof payload === "object" && !Array.isArray(payload)) {
		const clean = { ...payload };
		delete clean.plannerToken;
		delete clean.planner_token;
		delete clean.editToken;
		copy.public_payload = clean;
	}
	return copy;
}
function shareLog(stage, detail) {
	if (detail === void 0) console.info(`[Dating Share] ${stage}`);
	else console.info(`[Dating Share] ${stage}`, detail);
}
function duplicateSlug(code, message) {
	return code === "23505" || /duplicate key|dating_invitations_invite_slug/i.test(message ?? "");
}
var RPC_VISIBILITY = {
	full: "full_plan",
	first: "first_stop",
	mystery: "mystery"
};
function freshPlannerToken(slug) {
	let token = generateInviteSlug();
	while (token === slug) token = generateInviteSlug();
	return token;
}
function rpcInvite(data) {
	const row = Array.isArray(data) ? data[0] : data;
	if (!row || typeof row !== "object") return {
		slug: "",
		plannerToken: ""
	};
	const slug = row.invite_slug;
	const plannerToken = row.planner_token;
	return {
		slug: typeof slug === "string" && INVITE_SLUG.test(slug) ? slug : "",
		plannerToken: typeof plannerToken === "string" && INVITE_SLUG.test(plannerToken) ? plannerToken : ""
	};
}
async function saveDatingInvite(invite, editToken = "") {
	shareLog("1. Share initiated");
	if (!supabaseConfigured()) {
		console.error("[Dating Share] Supabase is not configured");
		throw new Error("Couldn’t create the invitation.");
	}
	const token = editToken.trim() || freshToken();
	const db = getSupabase();
	let slug = generateInviteSlug();
	let plannerToken = freshPlannerToken(slug);
	console.log("[INVITE] Supabase RPC starting");
	console.log("[INVITE] slug", slug);
	let lastMessage = "Couldn’t create the invitation.";
	for (let attempt = 0; attempt < 3; attempt += 1) {
		if (!INVITE_SLUG.test(slug)) slug = generateInviteSlug();
		if (!INVITE_SLUG.test(plannerToken) || plannerToken === slug) plannerToken = freshPlannerToken(slug);
		const card = publicCard({
			...invite,
			slug,
			status: "pending",
			replyNote: "",
			replyTimes: [],
			updatedAt: ""
		});
		const payload = { ...card };
		delete payload.plannerToken;
		delete payload.planner_token;
		delete payload.editToken;
		shareLog("2. Public payload generated", {
			slug,
			visibility: card.visibility,
			stops: card.stops.length
		});
		shareLog("3. Supabase RPC create_dating_invitation started", { attempt });
		const created = await db.rpc("create_dating_invitation", {
			p_invite_slug: slug,
			p_planner_token: plannerToken,
			p_recipient_name: card.recipientName,
			p_title: card.title,
			p_message: card.message,
			p_tone: card.tone,
			p_visibility: RPC_VISIBILITY[card.visibility],
			p_public_payload: payload
		});
		const saved = created.error ? {
			slug: "",
			plannerToken: ""
		} : rpcInvite(created.data);
		shareLog("4. Supabase response received", created.error ? {
			code: created.error.code,
			message: created.error.message
		} : {
			slug: saved.slug,
			planner: Boolean(saved.plannerToken)
		});
		if (saved.slug && saved.plannerToken && saved.slug !== saved.plannerToken) {
			console.log("[INVITE] Supabase RPC success");
			console.log("[INVITE] invite_slug:", saved.slug);
			console.log("[INVITE] planner_token:", saved.plannerToken);
			shareLog("5. invite_slug obtained", saved.slug);
			return {
				slug: saved.slug,
				plannerToken: saved.plannerToken,
				editToken: token
			};
		}
		if (created.error && duplicateSlug(created.error.code, created.error.message)) {
			slug = generateInviteSlug();
			plannerToken = freshPlannerToken(slug);
			continue;
		}
		if (created.error?.code === "PGRST202") throw new Error("Supabase still has the old invitation function, so the private planner link cannot be saved yet.");
		lastMessage = created.error?.message || lastMessage;
		console.error("[Dating Share] Supabase RPC failed:", created.error?.code, created.error?.message);
		break;
	}
	console.error("[INVITE] Supabase RPC failed", lastMessage);
	throw new Error("Couldn’t create the invitation.");
}
async function readPublicInvite(slug) {
	console.info("[PUBLIC INVITE] route slug:", slug);
	if (!INVITE_SLUG.test(slug)) {
		console.info("[PUBLIC INVITE] RPC error:", "The route slug is not a valid invitation id.");
		return { state: "missing" };
	}
	if (!supabaseConfigured()) {
		console.info("[PUBLIC INVITE] RPC error:", "Supabase is not configured");
		return {
			state: "error",
			message: "Supabase is not configured"
		};
	}
	console.info("[PUBLIC INVITE] RPC started");
	const result = await getSupabase().rpc("get_dating_invitation", { p_invite_slug: slug });
	const row = stripPlannerSecrets(Array.isArray(result.data) ? result.data[0] : result.data);
	console.info("[PUBLIC INVITE] RPC data:", row);
	console.info("[PUBLIC INVITE] RPC error:", result.error);
	if (result.error) return {
		state: "error",
		message: result.error.message
	};
	if (!row || typeof row !== "object") return { state: "missing" };
	if (row.status === "revoked") return { state: "missing" };
	const invite = fromRow(row);
	if (!invite) return {
		state: "error",
		message: "The invitation payload could not be read."
	};
	return {
		state: "ready",
		invite
	};
}
async function replyDatingInvite(slug, reply) {
	const response = reply.status === "sounds_good" || reply.status === "alternate_time_requested" ? reply.status : "";
	const note = [reply.note.trim(), ...reply.times.map((time) => time.trim()).filter(Boolean)].filter(Boolean).join("\n").slice(0, 280);
	if (!INVITE_SLUG.test(slug) || !response || !supabaseConfigured()) {
		const error = { message: "Couldn’t send your reply." };
		console.error("[Dating response error]", error);
		return {
			state: "error",
			message: error.message
		};
	}
	const answered = await getSupabase().rpc("respond_to_dating_invitation", {
		p_invite_slug: slug,
		p_response: response,
		p_note: note || null
	});
	if (answered.error) {
		console.error("[Dating response error]", answered.error);
		return {
			state: "error",
			message: "Couldn’t send your reply."
		};
	}
	const loaded = await readPublicInvite(slug);
	if (loaded.state !== "ready") {
		console.error("[Dating response error]", loaded);
		return {
			state: "error",
			message: "Couldn’t send your reply."
		};
	}
	return {
		state: "ready",
		invite: loaded.invite
	};
}
async function readPlannerInvite(token) {
	if (!INVITE_SLUG.test(token) || !supabaseConfigured()) return { state: "missing" };
	const result = await getSupabase().rpc("get_dating_invitation_for_planner", { p_planner_token: token });
	if (result.error) {
		console.error("[Dating planner]", result.error);
		return {
			state: "error",
			message: "Couldn’t open this invitation."
		};
	}
	const row = stripPlannerSecrets(Array.isArray(result.data) ? result.data[0] : result.data);
	if (!row) return { state: "missing" };
	const invite = fromRow(row);
	if (!invite) return {
		state: "error",
		message: "The invitation payload could not be read."
	};
	return {
		state: "ready",
		invite
	};
}
async function revokePlannerInvite(token) {
	if (!INVITE_SLUG.test(token) || !supabaseConfigured()) return {
		state: "error",
		message: "Couldn’t revoke this invitation."
	};
	const result = await getSupabase().rpc("revoke_dating_invitation", { p_planner_token: token });
	if (result.error) {
		console.error("[Dating revoke]", result.error);
		return {
			state: "error",
			message: "Couldn’t revoke this invitation."
		};
	}
	return { state: "ready" };
}
async function suggestInviteLine(input) {
	const raw = await geminiJson(`${KAIROS_VOICE} Rewrite a date invitation in one or two short sentences. Elegant, low-pressure, adult. Do not invent venues, feelings, or a relationship. Do not say love, soulmate, destiny, fate, or forever. Keep the sender's own note if one is given. Tone: ${input.tone}.`, JSON.stringify({
		dateType: input.dateType,
		draft: input.draft.slice(0, 240),
		note: input.note.slice(0, 180)
	}), {
		type: "object",
		properties: { message: { type: "string" } }
	}, 160);
	if (!raw || typeof raw !== "object") return null;
	const message = raw.message;
	if (typeof message !== "string") return null;
	const clean = message.replace(/\s+/g, " ").trim();
	if (!clean || /soulmate|destiny|fated|i love you|forever/i.test(clean)) return null;
	if (!INVITE_TONES.includes(input.tone)) return null;
	return clean.slice(0, 220);
}
//#endregion
export { readPlannerInvite, readPublicInvite, replyDatingInvite, revokePlannerInvite, saveDatingInvite, suggestInviteLine };
