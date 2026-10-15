import "@tanstack/react-start/server-only";

import { randomBytes } from "node:crypto";
import { prominence as voiceProminence, type HashRoom, type HashSynthesis, type HashTheme, type HashVoice } from "@/lib/hash";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";

export function makeHashId(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return out;
}

export class HashDatabaseError extends Error {
  missing: boolean;
  constructor(message: string, missing: boolean) {
    super(message);
    this.missing = missing;
  }
}

function fail(error: { message?: string; details?: string; hint?: string; code?: string } | null): never {
  const message = error?.message || "The room did not answer";
  const missing = error?.code === "PGRST202" || /schema cache|Could not find the function/i.test(message);
  throw new HashDatabaseError(missing ? `The shared database is missing ${message}` : message, missing);
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  if (!supabaseConfigured()) throw new Error("Hash It Out needs the shared database.");
  const { data, error } = await getSupabase().rpc(fn, args);
  if (error) fail(error);
  return data as T;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asBool(value: unknown): boolean {
  return value === true;
}

function asInt(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}

function asVoice(value: unknown, fallbackId = ""): HashVoice | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const text = asString(row.text);
  const id = asString(row.id) || fallbackId;
  if (!text || !id) return null;
  const anonymous = row.anonymous !== false;
  const name = pick(row, ["label", "displayName", "display_name"]);
  const moderation = pick(row, ["moderationStatus", "moderation_status"]).toUpperCase();
  return {
    id,
    text,
    label: !anonymous && name && name.toLowerCase() !== "anonymous" ? name : "Anonymous",
    anonymous,
    createdAt: pick(row, ["createdAt", "created_at"]),
    mine: asBool(row.mine),
    hidden: asBool(row.hidden) || moderation === "HIDDEN",
  };
}

function themeSource(value: string): HashTheme["source"] {
  const source = value.toLowerCase();
  if (source === "ai" || source === "gemini") return "ai";
  if (source === "host" || source === "facilitator") return "facilitator";
  return "rules";
}

function asTheme(value: unknown, mineVotes: Set<string>, mineSame: Set<string>): HashTheme | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const id = pick(row, ["id", "cluster_id", "clusterId"]);
  if (!id) return null;
  const voices = asInt(row.voices ?? row.voiceCount ?? row.voice_count);
  const rawLines = Array.isArray(row.lines) ? row.lines : Array.isArray(row.submissions) ? row.submissions : [];
  const lines = rawLines
    .map((line, index) => asVoice(line, `${id}:${index}`))
    .filter((line): line is HashVoice => Boolean(line));
  if (voices === 0 && lines.length === 0) return null;
  const anonymousVoices = row.anonymousVoices != null || row.anonymous_voices != null
    ? asInt(row.anonymousVoices ?? row.anonymous_voices)
    : lines.filter((line) => line.anonymous && !line.hidden).length;
  const rank = typeof row.prominence === "number"
    ? row.prominence >= 3 ? 3 : row.prominence === 2 ? 2 : row.prominence === 1 ? 1 : 0
    : voiceProminence(voices);
  return {
    id,
    title: pick(row, ["title"], "New thread"),
    summary: pick(row, ["summary"]),
    voices: voices || lines.filter((line) => !line.hidden).length,
    anonymousVoices,
    support: asInt(row.support ?? row.sameHereCount ?? row.same_here ?? row.supportCount),
    votes: asInt(row.votes ?? row.voteCount ?? row.vote_count),
    pinned: pickBool(row, ["pinned", "is_pinned", "isPinned"]),
    hidden: pickBool(row, ["hidden", "is_hidden", "isHidden"]),
    locked: pickBool(row, ["locked", "userLocked", "locked_by_host", "lockedByHost"]),
    source: themeSource(pick(row, ["source"])),
    actionKind: asAction(pick(row, ["actionKind", "action_status", "actionStatus"])),
    actionNote: pick(row, ["actionNote", "action_note"]),
    mineSupported: mineSame.has(id) || pickBool(row, ["mineSupported", "mine_supported"]),
    mineVoted: mineVotes.has(id) || pickBool(row, ["mineVoted", "mine_voted"]),
    prominence: rank,
    lines,
  };
}

function asSynthesis(value: unknown): HashSynthesis | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (!Array.isArray(row.topThemes)) return null;
  const list = (key: string) => (Array.isArray(row[key]) ? row[key].filter((item): item is string => typeof item === "string").slice(0, 6) : []);
  return {
    topThemes: list("topThemes"),
    agreement: list("agreement"),
    differing: list("differing"),
    nextActions: list("nextActions"),
    questions: list("questions"),
    source: row.source === "ai" ? "ai" : "rules",
    generatedAt: typeof row.generatedAt === "string" ? row.generatedAt : typeof row.generated_at === "string" ? row.generated_at : undefined,
    summaryVersion: typeof row.summaryVersion === "number" ? row.summaryVersion : typeof row.summary_version === "number" ? row.summary_version : undefined,
  };
}

function pick(row: Record<string, unknown>, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string") return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function pickBool(row: Record<string, unknown>, keys: string[], fallback = false): boolean {
  for (const key of keys) {
    if (typeof row[key] === "boolean") return row[key] as boolean;
  }
  return fallback;
}

function lowerMode(value: string): "anonymous" | "named" | "choice" {
  const mode = value.toLowerCase();
  return mode === "anonymous" || mode === "named" ? mode : "choice";
}

function lowerStatus(value: string): "open" | "paused" | "voting" | "closed" {
  const status = value.toLowerCase();
  if (status === "paused" || status === "voting" || status === "closed") return status;
  return "open";
}

function asAction(value: string): HashTheme["actionKind"] {
  const kind = value.toLowerCase().replace(/[\s-]+/g, "_");
  if (kind === "action") return "action";
  if (kind === "park" || kind === "parked") return "park";
  if (kind === "discuss" || kind === "discussion") return "discuss";
  if (kind === "decide" || kind === "decide_now" || kind === "decidenow") return "decide";
  return "";
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function derivedSignals(themes: HashTheme[]): { strongestId: string; favouriteId: string; hiddenSignalId: string } {
  const visible = themes.filter((theme) => !theme.hidden && theme.voices > 0);
  const byVoices = [...visible].sort((a, b) => b.voices - a.voices || a.title.localeCompare(b.title));
  const strongest = byVoices.find((theme) => theme.voices >= 2);
  const favourite = [...visible].sort((a, b) => b.votes - a.votes || a.title.localeCompare(b.title)).find((theme) => theme.votes > 0);
  const hidden = [...visible]
    .filter((theme) => theme.id !== strongest?.id)
    .sort((a, b) => b.anonymousVoices - a.anonymousVoices || a.title.localeCompare(b.title))
    .find((theme) => theme.anonymousVoices >= 2);
  return {
    strongestId: strongest?.id ?? "",
    favouriteId: favourite?.id ?? "",
    hiddenSignalId: hidden?.id ?? "",
  };
}

export function asHashRoom(value: unknown): HashRoom {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const nested = row.room && typeof row.room === "object" && !Array.isArray(row.room) ? (row.room as Record<string, unknown>) : null;
  const meta = nested ?? row;
  const mineVotes = new Set(stringList(row.myVoteClusterIds ?? row.my_vote_cluster_ids));
  const mineSame = new Set(stringList(row.mySameHereClusterIds ?? row.my_same_here_cluster_ids));
  const covered = row.boardVisible === false || row.board_visible === false;
  const clusterRows = covered
    ? []
    : Array.isArray(row.clusters)
      ? row.clusters
      : Array.isArray(meta.clusters)
        ? meta.clusters
        : Array.isArray(row.themes)
          ? row.themes
          : Array.isArray(meta.themes)
            ? meta.themes
            : [];
  const themes = clusterRows.map((item) => asTheme(item, mineVotes, mineSame)).filter((theme): theme is HashTheme => Boolean(theme));
  const looseRows = Array.isArray(row.loose) ? row.loose : Array.isArray(meta.loose) ? meta.loose : [];
  const loose = covered ? [] : looseRows.map((item) => asVoice(item)).filter((line): line is HashVoice => Boolean(line));
  const identity = lowerMode(pick(meta, ["identityMode", "identity_mode"], "choice"));
  const status = lowerStatus(pick(meta, ["status"], "open"));
  const code = pick(meta, ["code", "join_code", "joinCode"]);
  const signals = derivedSignals(themes);
  const count = (source: Record<string, unknown>, camel: string, snake: string): number => asInt(source[camel] ?? source[snake]);
  return {
    role: row.role === "host" || row.is_host === true || row.isHost === true || meta.role === "host" || meta.is_host === true || meta.isHost === true ? "host" : "guest",
    sessionId: pick(meta, ["sessionId", "session_id"]) || pick(row, ["sessionId", "session_id"]),
    code,
    prompt: pick(meta, ["prompt", "question"]),
    context: pick(meta, ["context"]),
    starter: pick(meta, ["starter", "starter_type", "starterType"], "custom").toLowerCase(),
    identityMode: identity,
    showLiveBoard: covered ? false : pickBool(meta, ["showLiveBoard", "show_live_board"], true),
    blindRound: pickBool(meta, ["blindRound", "blind_first_round"]),
    revealed: pickBool(meta, ["revealed"], true),
    votingEnabled: pickBool(meta, ["votingEnabled", "voting_enabled"]) || status === "voting",
    voteLimit: asInt(meta.voteLimit ?? meta.vote_limit) === 1 ? 1 : 3,
    votesCast: count(row, "votesCast", "votes_cast") || count(meta, "votesCast", "votes_cast") || mineVotes.size,
    cosmicEnabled: pickBool(meta, ["cosmicEnabled", "cosmic_enabled"]),
    status,
    participantCount: count(row, "participantCount", "participant_count") || count(meta, "participantCount", "participant_count"),
    submissionCount: count(row, "submissionCount", "submission_count") || count(meta, "submissionCount", "submission_count"),
    uncollatedCount: row.uncollatedCount != null || row.uncollated_count != null || meta.uncollatedCount != null
      ? asInt(row.uncollatedCount ?? row.uncollated_count ?? meta.uncollatedCount)
      : loose.length,
    themeCount: count(row, "themeCount", "theme_count") || count(meta, "themeCount", "theme_count") || themes.length,
    llmCalls: count(row, "llmCalls", "llm_calls") || count(meta, "llmCalls", "llm_calls"),
    themes,
    loose,
    strongestId: pick(row, ["strongestId", "strongest_id"]) || pick(meta, ["strongestId", "strongest_id"]) || signals.strongestId,
    favouriteId: pick(row, ["favouriteId", "favoriteId", "favourite_id"]) || pick(meta, ["favouriteId", "favoriteId", "favourite_id"]) || signals.favouriteId,
    hiddenSignalId: pick(row, ["hiddenSignalId", "hidden_signal_id"]) || pick(meta, ["hiddenSignalId", "hidden_signal_id"]) || signals.hiddenSignalId,
    luckyId: pick(row, ["luckyId", "lucky_id"]) || pick(meta, ["luckyId", "lucky_id"]),
    synthesis: asSynthesis(row.synthesis ?? meta.synthesis),
    sharePath: pick(meta, ["sharePath", "share_path"], code ? `/?mode=hash&code=${code}` : ""),
  };
}

const STARTER_TYPE: Record<string, string> = {
  brainstorm: "BRAINSTORM",
  blockers: "WHATS_NOT_WORKING",
  prioritise: "PRIORITISE",
  retro: "RETROSPECTIVE",
  open: "OPEN",
  custom: "CUSTOM",
};

const IDENTITY_MODE: Record<string, string> = {
  anonymous: "ANONYMOUS",
  named: "NAMED",
  choice: "CHOICE",
};

function sessionStatus(status: string): string {
  if (status === "paused") return "PAUSED";
  if (status === "voting") return "VOTING";
  if (status === "closed") return "CLOSED";
  return "OPEN";
}

function actionStatus(kind: string): string | null {
  if (kind === "action") return "ACTION";
  if (kind === "park") return "PARK";
  if (kind === "discuss") return "DISCUSS";
  if (kind === "decide") return "DECIDE";
  return null;
}

function codeOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const row = value as Record<string, unknown>;
  return pick(row, ["join_code", "joinCode", "code"]);
}

export function clusterIdOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const row = value as Record<string, unknown>;
  return pick(row, ["id", "cluster_id", "clusterId", "new_cluster_id"]);
}

export async function createHashRow(input: {
  hostToken: string;
  prompt: string;
  context: string;
  starter: string;
  identityMode: string;
  showLiveBoard: boolean;
  blindRound: boolean;
  voteLimit: number;
  cosmicEnabled: boolean;
}): Promise<string> {
  const created = await rpc("hash_create_session", {
    p_host_token: input.hostToken,
    p_prompt: input.prompt,
    p_context: input.context,
    p_starter_type: STARTER_TYPE[input.starter] ?? "CUSTOM",
    p_title: input.prompt.slice(0, 120),
    p_identity_mode: IDENTITY_MODE[input.identityMode] ?? "CHOICE",
    p_show_live_board: input.showLiveBoard,
    p_blind_first_round: input.blindRound,
    p_vote_limit: input.voteLimit,
    p_cosmic_enabled: input.cosmicEnabled,
  });
  const code = codeOf(created);
  if (!code) throw new Error("Could not open a room.");
  return code;
}

export async function joinHash(code: string, participantToken: string, displayName: string | null): Promise<HashRoom> {
  const raw = await rpc("hash_join_session", {
    p_join_code: code,
    p_participant_token: participantToken,
    p_display_name: displayName,
  });
  return asHashRoom(raw);
}

export async function loadPublic(code: string, participantToken: string): Promise<HashRoom> {
  return asHashRoom(await rpc("hash_get_public_snapshot", { p_join_code: code, p_participant_token: participantToken }));
}

export async function loadHost(code: string, hostToken: string): Promise<HashRoom> {
  const room = asHashRoom(await rpc("hash_get_host_snapshot", { p_join_code: code, p_host_token: hostToken }));
  room.role = "host";
  if (!room.code) room.code = code;
  return room;
}

export async function submitIdea(input: { code: string; participantToken: string; text: string; anonymous: boolean }): Promise<void> {
  await rpc("hash_submit_idea", {
    p_join_code: input.code,
    p_participant_token: input.participantToken,
    p_text: input.text,
    p_anonymous: input.anonymous,
  });
}

export async function sameHere(code: string, participantToken: string, clusterId: string): Promise<void> {
  await rpc("hash_add_same_here", { p_join_code: code, p_participant_token: participantToken, p_cluster_id: clusterId });
}

export async function castVote(code: string, participantToken: string, clusterId: string): Promise<void> {
  await rpc("hash_cast_vote", { p_join_code: code, p_participant_token: participantToken, p_cluster_id: clusterId });
}

export async function hostUpdateSession(code: string, hostToken: string, patch: {
  status: string;
  revealed: boolean;
  showLiveBoard: boolean;
  voteLimit: number;
  cosmicEnabled: boolean;
}): Promise<void> {
  await rpc("hash_host_update_session", {
    p_join_code: code,
    p_host_token: hostToken,
    p_status: sessionStatus(patch.status),
    p_revealed: patch.revealed,
    p_show_live_board: patch.showLiveBoard,
    p_vote_limit: patch.voteLimit,
    p_cosmic_enabled: patch.cosmicEnabled,
  });
}

export async function hostCreateCluster(code: string, hostToken: string, title: string, summary: string, source: string): Promise<unknown> {
  return rpc("hash_host_create_cluster", {
    p_join_code: code,
    p_host_token: hostToken,
    p_title: title.slice(0, 60),
    p_summary: summary.slice(0, 180),
    p_source: source === "ai" ? "GEMINI" : "KEYWORD",
  });
}

export async function hostUpdateCluster(code: string, hostToken: string, theme: HashTheme, patch: {
  title?: string;
  summary?: string;
  pinned?: boolean;
  hidden?: boolean;
  actionKind?: string;
}): Promise<void> {
  await rpc("hash_host_update_cluster", {
    p_join_code: code,
    p_host_token: hostToken,
    p_cluster_id: theme.id,
    p_title: (patch.title ?? theme.title).slice(0, 60),
    p_summary: (patch.summary ?? theme.summary).slice(0, 180),
    p_is_pinned: patch.pinned ?? theme.pinned,
    p_is_hidden: patch.hidden ?? theme.hidden,
    p_action_status: actionStatus(patch.actionKind ?? theme.actionKind),
  });
}

export async function hostMerge(code: string, hostToken: string, intoId: string, fromId: string): Promise<void> {
  await rpc("hash_host_merge_clusters", {
    p_join_code: code,
    p_host_token: hostToken,
    p_target_cluster_id: intoId,
    p_source_cluster_id: fromId,
  });
}

export async function hostMove(code: string, hostToken: string, submissionId: string, targetClusterId: string | null, newTitle: string | null): Promise<void> {
  await rpc("hash_host_move_submission", {
    p_join_code: code,
    p_host_token: hostToken,
    p_submission_id: submissionId,
    p_target_cluster_id: targetClusterId,
    p_new_cluster_title: newTitle,
  });
}

export async function hostVisibility(code: string, hostToken: string, submissionId: string, visible: boolean): Promise<void> {
  await rpc("hash_host_set_submission_visibility", {
    p_join_code: code,
    p_host_token: hostToken,
    p_submission_id: submissionId,
    p_visible: visible,
  });
}

export type RoomExtras = {
  shown: boolean;
  summary: unknown;
  luckyId: string;
  luckyPickedAt: string;
  notes: { clusterId: string; actionNote: string }[];
};

function asExtras(value: unknown): RoomExtras {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const notes = Array.isArray(row.notes) ? row.notes : [];
  return {
    shown: row.shown !== false,
    summary: row.summary ?? null,
    luckyId: pick(row, ["luckyId", "lucky_id"]),
    luckyPickedAt: pick(row, ["luckyPickedAt", "lucky_picked_at"]),
    notes: notes
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const note = item as Record<string, unknown>;
        const clusterId = pick(note, ["clusterId", "cluster_id"]);
        if (!clusterId) return null;
        return { clusterId, actionNote: pick(note, ["actionNote", "action_note"]) };
      })
      .filter((item): item is { clusterId: string; actionNote: string } => Boolean(item)),
  };
}

export function applyRoomExtras(room: HashRoom, extras: RoomExtras | null): HashRoom {
  if (!extras) return room;
  if (!extras.shown) {
    return {
      ...room,
      synthesis: null,
      luckyId: "",
      themes: room.themes.map((theme) => ({ ...theme, actionNote: "" })),
    };
  }
  const notes = new Map(extras.notes.map((note) => [note.clusterId, note.actionNote]));
  return {
    ...room,
    luckyId: extras.luckyId,
    synthesis: asSynthesis(extras.summary) ?? room.synthesis,
    themes: room.themes.map((theme) => ({ ...theme, actionNote: notes.get(theme.id) ?? "" })),
  };
}

export async function loadExtras(code: string, hostToken: string, participantToken: string): Promise<RoomExtras> {
  return asExtras(await rpc("hash_get_room_extras", {
    p_join_code: code,
    p_host_token: hostToken,
    p_participant_token: participantToken,
  }));
}

export async function loadMyMarks(code: string, participantToken: string): Promise<{ votes: string[]; same: string[] }> {
  const raw = await rpc<unknown>("hash_get_public_snapshot", { p_join_code: code, p_participant_token: participantToken });
  const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    votes: stringList(row.myVoteClusterIds ?? row.my_vote_cluster_ids),
    same: stringList(row.mySameHereClusterIds ?? row.my_same_here_cluster_ids),
  };
}

export async function saveRoomSummary(code: string, hostToken: string, synthesis: HashSynthesis): Promise<void> {
  await rpc("hash_host_save_summary", {
    p_join_code: code,
    p_host_token: hostToken,
    p_summary: {
      topThemes: synthesis.topThemes,
      agreement: synthesis.agreement,
      differing: synthesis.differing,
      nextActions: synthesis.nextActions,
      questions: synthesis.questions,
      source: synthesis.source,
    },
  });
}

export async function setActionNote(code: string, hostToken: string, clusterId: string, note: string): Promise<void> {
  await rpc("hash_host_set_action_note", {
    p_join_code: code,
    p_host_token: hostToken,
    p_cluster_id: clusterId,
    p_action_note: note.slice(0, 160),
  });
}

export async function luckyPick(code: string, hostToken: string, reroll: boolean): Promise<void> {
  await rpc("hash_host_lucky_pick", {
    p_join_code: code,
    p_host_token: hostToken,
    p_reroll: reroll,
  });
}
