import "@tanstack/react-start/server-only";

import { geminiJson } from "@/lib/gemini.server";
import {
  applyAiGroups,
  clusterNearDuplicates,
  clusterThemes,
  rulesSynthesis,
  type AiGroup,
  type HashAction,
  type HashClusterDraft,
  type HashIdentity,
  type HashRoom,
  type HashSubmissionDraft,
  type HashSynthesis,
  type HashTheme,
} from "@/lib/hash";
import {
  applyRoomExtras,
  castVote,
  clusterIdOf,
  createHashRow,
  hostCreateCluster,
  hostMerge,
  hostMove,
  hostUpdateCluster,
  hostUpdateSession,
  hostVisibility,
  joinHash,
  loadExtras,
  loadHost,
  loadMyMarks,
  loadPublic,
  luckyPick,
  makeHashId,
  HashDatabaseError,
  sameHere,
  saveRoomSummary,
  setActionNote,
  submitIdea,
} from "@/lib/hash.store.server";

const collatedAt = new Map<string, number>();
const autoLlmCalls = new Map<string, number>();

async function room(code: string, participantToken: string, hostToken: string): Promise<HashRoom> {
  if (hostToken) {
    try {
      return await loadHost(code, hostToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (!/only the host|invalid host token|not the host/i.test(message)) throw error;
    }
  }
  if (!participantToken) throw new Error("Join again from this phone");
  return loadPublic(code, participantToken);
}

function missing(error: unknown): boolean {
  return error instanceof HashDatabaseError && error.missing;
}

function persistError(error: unknown): never {
  if (missing(error)) throw new Error("This needs the Hash persistence update in Supabase. Run that SQL, then try again.");
  throw error;
}

async function finish(code: string, participantToken: string, hostToken: string): Promise<HashRoom> {
  const current = await room(code, participantToken, hostToken);
  let next = current;
  if (current.role === "host" && participantToken) {
    try {
      const marks = await loadMyMarks(code, participantToken);
      next = {
        ...current,
        votesCast: marks.votes.length,
        themes: current.themes.map((theme) => ({
          ...theme,
          mineVoted: marks.votes.includes(theme.id),
          mineSupported: marks.same.includes(theme.id),
        })),
      };
    } catch {
      // The host has not joined this room as a participant, so there is no personal vote to show.
    }
  }
  try {
    const extras = await loadExtras(code, current.role === "host" ? hostToken : "", participantToken);
    next = applyRoomExtras(next, extras);
  } catch (error) {
    if (!missing(error)) throw error;
  }
  return next;
}

export async function resolveJoin(code: string, participantToken: string): Promise<{ kind: "hash" | "meet" }> {
  try {
    await joinHash(code, participantToken, null);
    return { kind: "hash" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/room not found/i.test(message)) return { kind: "meet" };
    if (missing(error)) throw new Error("Hash It Out is not installed on the shared database.");
    throw error;
  }
}

export async function createHashSession(input: {
  prompt: string;
  context: string;
  starter: string;
  identityMode: HashIdentity;
  showLiveBoard: boolean;
  blindRound: boolean;
  voteLimit: 1 | 3;
  cosmicEnabled: boolean;
}): Promise<{ code: string; hostToken: string }> {
  const hostToken = makeHashId(32);
  const code = await createHashRow({ ...input, hostToken });
  return { code, hostToken };
}

export async function readHashRoom(code: string, participantToken: string, hostToken: string): Promise<HashRoom> {
  return finish(code, participantToken, hostToken);
}

function cleanName(value: string): string {
  const name = value.trim().slice(0, 24);
  if (!name || name.includes("@")) return "";
  return name;
}

export async function throwIdea(input: { code: string; participantToken: string; hostToken: string; text: string; anonymous: boolean; displayName: string }): Promise<HashRoom> {
  const current = await room(input.code, input.participantToken, input.hostToken);
  const text = input.text.trim().replace(/\s+/g, " ").slice(0, 240);
  if (text.length < 2) throw new Error("Throw in a few words.");
  const forcedAnon = current.identityMode === "anonymous" || (current.identityMode === "choice" && input.anonymous);
  const named = current.identityMode === "named" || (current.identityMode === "choice" && !input.anonymous);
  const displayName = forcedAnon ? "" : cleanName(input.displayName);
  if (named && !displayName) throw new Error(current.identityMode === "named" ? "Add a name." : "Add a name, or stay anonymous.");
  await joinHash(input.code, input.participantToken, displayName ? displayName : null);
  await submitIdea({ code: input.code, participantToken: input.participantToken, text, anonymous: !displayName });
  return finish(input.code, input.participantToken, input.hostToken);
}

export async function supportTheme(input: { code: string; participantToken: string; hostToken?: string; clusterId: string }): Promise<HashRoom> {
  await sameHere(input.code, input.participantToken, input.clusterId);
  return finish(input.code, input.participantToken, input.hostToken ?? "");
}

export async function voteTheme(input: { code: string; participantToken: string; hostToken?: string; clusterId: string }): Promise<HashRoom> {
  await castVote(input.code, input.participantToken, input.clusterId);
  return finish(input.code, input.participantToken, input.hostToken ?? "");
}

function draftsFromRoom(source: HashRoom): { submissions: HashSubmissionDraft[]; clusters: HashClusterDraft[] } {
  const clusters: HashClusterDraft[] = source.themes.map((theme) => ({
    id: theme.id,
    title: theme.title,
    summary: theme.summary,
    userLocked: theme.locked || theme.source === "facilitator",
    source: theme.source,
    pinned: theme.pinned,
    hidden: theme.hidden,
    actionKind: theme.actionKind,
    actionNote: theme.actionNote,
  }));
  const submissions: HashSubmissionDraft[] = [
    ...source.themes.flatMap((theme) =>
      theme.lines.map((line) => ({
        id: line.id,
        text: line.text,
        anonymous: line.anonymous,
        createdAt: line.createdAt,
        clusterId: theme.id,
        hidden: line.hidden,
      })),
    ),
    ...source.loose.map((line) => ({
      id: line.id,
      text: line.text,
      anonymous: line.anonymous,
      createdAt: line.createdAt,
      clusterId: null,
      hidden: line.hidden,
    })),
  ];
  return { submissions, clusters };
}

async function askGemini(prompt: string, loose: { id: string; text: string }[], existing: string[]): Promise<AiGroup[] | null> {
  if (!loose.length) return [];
  const raw = await geminiJson(
    "You group short workplace comments into themes. Use only the comments given. Do not invent organisations, motives, fear, morale, or facts that were not written. Titles are 2-4 words. Summaries are one sentence using their words. Do not merge comments a host has already separated. Return JSON only.",
    JSON.stringify({ prompt, existingThemes: existing.slice(0, 12), comments: loose.slice(0, 40) }),
    {
      type: "object",
      properties: {
        groups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              submissionIds: { type: "array", items: { type: "string" } },
            },
            required: ["title", "summary", "submissionIds"],
          },
        },
      },
      required: ["groups"],
    },
    700,
  );
  if (!raw || typeof raw !== "object") return null;
  const groups = (raw as { groups?: unknown }).groups;
  if (!Array.isArray(groups)) return null;
  return groups
    .map((group) => {
      const row = group as { title?: unknown; summary?: unknown; submissionIds?: unknown };
      return {
        title: typeof row.title === "string" ? row.title : "",
        summary: typeof row.summary === "string" ? row.summary : "",
        submissionIds: Array.isArray(row.submissionIds) ? row.submissionIds.filter((id): id is string => typeof id === "string") : [],
      };
    })
    .filter((group) => group.title && group.submissionIds.length);
}

export async function collateRoom(code: string, hostToken: string, auto: boolean, participantToken = ""): Promise<HashRoom> {
  const current = await loadHost(code, hostToken);
  const last = collatedAt.get(code) ?? 0;
  if (last && Date.now() - last < (auto ? 15000 : 4000)) return finish(code, participantToken, hostToken);
  const before = draftsFromRoom(current);
  const near = clusterNearDuplicates(before.submissions, before.clusters, []);
  let next = clusterThemes(near.submissions, near.clusters, []);
  const loose = next.submissions.filter((item) => !item.clusterId && !item.hidden);
  const spent = Math.max(current.llmCalls, autoLlmCalls.get(code) ?? 0);
  const skipAi = loose.length === 0 || (auto && (spent >= 2 || loose.length < 3));
  if (!skipAi) {
    const groups = await askGemini(
      current.prompt,
      loose.map((item) => ({ id: item.id, text: item.text })),
      next.clusters.filter((cluster) => !cluster.hidden).map((cluster) => cluster.title),
    );
    if (groups?.length) {
      next = applyAiGroups(next.submissions, next.clusters, [], groups);
      if (auto) autoLlmCalls.set(code, spent + 1);
    }
  }
  const known = new Set(before.clusters.map((cluster) => cluster.id));
  for (const cluster of next.clusters) {
    const members = next.submissions.filter((item) => item.clusterId === cluster.id && !item.hidden);
    if (!members.length) continue;
    if (!known.has(cluster.id)) {
      const created = await hostCreateCluster(code, hostToken, cluster.title, cluster.summary, cluster.source === "ai" ? "ai" : "rules");
      const id = clusterIdOf(created);
      if (!id) throw new Error(`hash_host_create_cluster did not return a theme id (${JSON.stringify(created).slice(0, 180)})`);
      for (const item of members) await hostMove(code, hostToken, item.id, id, null);
      continue;
    }
    const previous = before.clusters.find((item) => item.id === cluster.id);
    if (previous && !previous.userLocked && previous.title !== cluster.title) {
      const theme = current.themes.find((item) => item.id === cluster.id);
      if (theme) await hostUpdateCluster(code, hostToken, theme, { title: cluster.title, summary: cluster.summary || theme.summary });
    }
  }
  for (const item of next.submissions) {
    const previous = before.submissions.find((row) => row.id === item.id);
    if (!previous || previous.clusterId === item.clusterId || !item.clusterId || !known.has(item.clusterId)) continue;
    await hostMove(code, hostToken, item.id, item.clusterId, null);
  }
  collatedAt.set(code, Date.now());
  return finish(code, participantToken, hostToken);
}

function arrayOf(raw: object, key: string): string[] {
  const value = (raw as Record<string, unknown>)[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 6) : [];
}

export async function summariseRoom(code: string, hostToken: string, participantToken = ""): Promise<HashRoom> {
  const current = await finish(code, participantToken, hostToken);
  const themes = current.themes
    .filter((theme) => !theme.hidden && theme.voices > 0)
    .map((theme) => ({
      title: theme.title,
      summary: theme.summary,
      voices: theme.voices,
      actionKind: theme.actionKind,
      actionNote: theme.actionNote,
      lines: theme.lines.filter((line) => !line.hidden).map((line) => line.text).slice(0, 8),
    }));
  const fallback = rulesSynthesis(current.prompt, themes);
  const raw = await geminiJson(
    "Summarise only the comments provided. Do not invent organisational facts, emotions, or causes that nobody wrote. Keep each line under 18 words.",
    JSON.stringify({ prompt: current.prompt, themes }),
    {
      type: "object",
      properties: {
        topThemes: { type: "array", items: { type: "string" } },
        agreement: { type: "array", items: { type: "string" } },
        differing: { type: "array", items: { type: "string" } },
        nextActions: { type: "array", items: { type: "string" } },
        questions: { type: "array", items: { type: "string" } },
      },
      required: ["topThemes", "agreement", "differing", "nextActions", "questions"],
    },
    500,
  );
  const synthesis: HashSynthesis = raw && typeof raw === "object"
    ? {
        topThemes: arrayOf(raw, "topThemes"),
        agreement: arrayOf(raw, "agreement"),
        differing: arrayOf(raw, "differing"),
        nextActions: arrayOf(raw, "nextActions"),
        questions: arrayOf(raw, "questions"),
        source: "ai",
      }
    : fallback;
  try {
    await saveRoomSummary(code, hostToken, synthesis);
  } catch (error) {
    persistError(error);
  }
  return finish(code, participantToken, hostToken);
}

async function withSession(code: string, hostToken: string, patch: (theme: HashRoom) => {
  status: string;
  revealed: boolean;
  showLiveBoard: boolean;
  voteLimit: number;
  cosmicEnabled: boolean;
}): Promise<void> {
  const current = await loadHost(code, hostToken);
  await hostUpdateSession(code, hostToken, patch(current));
}

function themeOrThrow(current: HashRoom, clusterId: string): HashTheme {
  const theme = current.themes.find((item) => item.id === clusterId);
  if (!theme) throw new Error("That theme is gone.");
  return theme;
}

export type HostCommand =
  | { action: "pause" }
  | { action: "resume" }
  | { action: "reveal" }
  | { action: "end" }
  | { action: "voting"; open: boolean; voteLimit?: 1 | 3 }
  | { action: "live"; show: boolean }
  | { action: "cosmic"; enabled: boolean }
  | { action: "rename"; clusterId: string; title: string }
  | { action: "summary"; clusterId: string; summary: string }
  | { action: "merge"; intoId: string; fromId: string }
  | { action: "split"; clusterId: string; submissionId: string }
  | { action: "move"; submissionId: string; clusterId: string }
  | { action: "pin"; clusterId: string; pinned: boolean }
  | { action: "hide"; submissionId: string; hidden: boolean }
  | { action: "mark"; clusterId: string; kind: HashAction; note?: string }
  | { action: "lucky" }
  | { action: "reroll" };

export async function hostCommand(code: string, hostToken: string, command: HostCommand, participantToken = ""): Promise<HashRoom> {
  if (command.action === "lucky" || command.action === "reroll") {
    try {
      await luckyPick(code, hostToken, command.action === "reroll");
    } catch (error) {
      persistError(error);
    }
  }
  if (command.action === "pause") await withSession(code, hostToken, (current) => ({ status: "paused", revealed: current.revealed, showLiveBoard: current.showLiveBoard, voteLimit: current.voteLimit, cosmicEnabled: current.cosmicEnabled }));
  if (command.action === "resume") await withSession(code, hostToken, (current) => ({ status: current.status === "closed" ? "closed" : "open", revealed: current.revealed, showLiveBoard: current.showLiveBoard, voteLimit: current.voteLimit, cosmicEnabled: current.cosmicEnabled }));
  if (command.action === "reveal") await withSession(code, hostToken, (current) => ({ status: current.status, revealed: true, showLiveBoard: true, voteLimit: current.voteLimit, cosmicEnabled: current.cosmicEnabled }));
  if (command.action === "end") await withSession(code, hostToken, (current) => ({ status: "closed", revealed: current.revealed, showLiveBoard: current.showLiveBoard, voteLimit: current.voteLimit, cosmicEnabled: current.cosmicEnabled }));
  if (command.action === "voting") {
    await withSession(code, hostToken, (current) => ({
      status: command.open ? "voting" : "open",
      revealed: current.revealed,
      showLiveBoard: current.showLiveBoard,
      voteLimit: command.voteLimit ?? current.voteLimit,
      cosmicEnabled: current.cosmicEnabled,
    }));
  }
  if (command.action === "live") await withSession(code, hostToken, (current) => ({ status: current.status, revealed: current.revealed, showLiveBoard: command.show, voteLimit: current.voteLimit, cosmicEnabled: current.cosmicEnabled }));
  if (command.action === "cosmic") await withSession(code, hostToken, (current) => ({ status: current.status, revealed: current.revealed, showLiveBoard: current.showLiveBoard, voteLimit: current.voteLimit, cosmicEnabled: command.enabled }));
  if (command.action === "rename" || command.action === "summary" || command.action === "pin" || command.action === "mark") {
    const current = await loadHost(code, hostToken);
    const theme = themeOrThrow(current, command.clusterId);
    if (command.action === "rename") await hostUpdateCluster(code, hostToken, theme, { title: command.title });
    if (command.action === "summary") await hostUpdateCluster(code, hostToken, theme, { summary: command.summary });
    if (command.action === "pin") await hostUpdateCluster(code, hostToken, theme, { pinned: command.pinned });
    if (command.action === "mark") {
      await hostUpdateCluster(code, hostToken, theme, { actionKind: command.kind });
      try {
        await setActionNote(code, hostToken, command.clusterId, command.note ?? "");
      } catch (error) {
        persistError(error);
      }
    }
  }
  if (command.action === "merge") await hostMerge(code, hostToken, command.intoId, command.fromId);
  if (command.action === "split") {
    const current = await loadHost(code, hostToken);
    const line = current.themes.flatMap((theme) => theme.lines).find((item) => item.id === command.submissionId)
      ?? current.loose.find((item) => item.id === command.submissionId);
    await hostMove(code, hostToken, command.submissionId, null, (line?.text || "New thread").slice(0, 60));
  }
  if (command.action === "move") await hostMove(code, hostToken, command.submissionId, command.clusterId, null);
  if (command.action === "hide") await hostVisibility(code, hostToken, command.submissionId, !command.hidden);
  return finish(code, participantToken, hostToken);
}
