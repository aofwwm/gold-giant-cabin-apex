export const HASH_STARTERS = [
  { id: "brainstorm", label: "Brainstorm", prompt: "What ideas should we explore?" },
  { id: "blockers", label: "What's not working?", prompt: "What is slowing this project down?" },
  { id: "prioritise", label: "Prioritise", prompt: "What should we tackle first?" },
  { id: "retro", label: "Retrospective", prompt: "What should we keep, change, or stop?" },
  { id: "open", label: "Open question", prompt: "What should we talk about?" },
  { id: "custom", label: "Custom", prompt: "" },
] as const;

export type HashStarter = (typeof HASH_STARTERS)[number]["id"];
export type HashIdentity = "anonymous" | "named" | "choice";
export type HashStatus = "open" | "paused" | "voting" | "closed";
export type HashSource = "rules" | "ai" | "facilitator";
export type HashAction = "" | "action" | "park" | "discuss" | "decide";

export type HashSubmissionDraft = {
  id: string;
  text: string;
  anonymous: boolean;
  createdAt: string;
  clusterId: string | null;
  hidden: boolean;
};

export type HashClusterDraft = {
  id: string;
  title: string;
  summary: string;
  userLocked: boolean;
  source: HashSource;
  pinned: boolean;
  hidden: boolean;
  actionKind: HashAction;
  actionNote: string;
};

export type HashSeparation = { a: string; b: string };

const STOP = new Set(["the", "and", "for", "our", "are", "was", "were", "this", "that", "with", "too", "very", "just", "from", "have", "has", "all", "but", "not", "you", "your", "its", "into", "about", "there", "their"]);

const KEYWORDS: { title: string; summary: string; words: string[] }[] = [
  { title: "Approval process", summary: "Multiple approval layers are slowing decisions.", words: ["approval", "approvals", "approve", "clearance", "director"] },
  { title: "Meeting overload", summary: "Too many meetings without clear decisions.", words: ["meeting", "meetings", "agenda", "standup"] },
  { title: "Changing requirements", summary: "Requirements keep moving.", words: ["requirement", "requirements", "scope"] },
  { title: "Clearer ownership", summary: "Ownership and follow-up are unclear.", words: ["owner", "owners", "ownership", "owns", "follow"] },
  { title: "Unclear decisions", summary: "Decisions are not landing clearly.", words: ["decision", "decisions"] },
];

export function normHash(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashTokens(text: string): string[] {
  return normHash(text)
    .split(" ")
    .filter((word) => word.length > 2 && !STOP.has(word));
}

export function tokenSimilarity(left: string, right: string): number {
  const a = normHash(left);
  const b = normHash(right);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if ((a.includes(b) || b.includes(a)) && Math.min(a.length, b.length) >= 12) return 0.9;
  const A = new Set(hashTokens(left));
  const B = new Set(hashTokens(right));
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const token of A) if (B.has(token)) shared += 1;
  return shared / (A.size + B.size - shared);
}

export function sepKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function separationSet(pairs: readonly HashSeparation[]): Set<string> {
  return new Set(pairs.map((pair) => sepKey(pair.a, pair.b)));
}

export function pairBlocked(left: string, right: string, blocked: Set<string>): boolean {
  if (!left || !right || left === right) return false;
  return blocked.has(sepKey(left, right));
}

function keywordFor(text: string): { title: string; summary: string } | null {
  const tokens = new Set(hashTokens(text));
  let best: { title: string; summary: string; hits: number } | null = null;
  for (const theme of KEYWORDS) {
    const hits = theme.words.filter((word) => tokens.has(word)).length;
    if (!hits) continue;
    if (!best || hits > best.hits) best = { title: theme.title, summary: theme.summary, hits };
  }
  return best ? { title: best.title, summary: best.summary } : null;
}

function titleFromText(text: string): string {
  const words = normHash(text).split(" ").filter(Boolean).slice(0, 4);
  if (!words.length) return "New thread";
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function membersOf(submissions: readonly HashSubmissionDraft[], clusterId: string): HashSubmissionDraft[] {
  return submissions.filter((item) => item.clusterId === clusterId && !item.hidden);
}

function blockedFromCluster(submissionId: string, members: readonly HashSubmissionDraft[], blocked: Set<string>): boolean {
  return members.some((member) => pairBlocked(submissionId, member.id, blocked));
}

function cloneSubs(submissions: readonly HashSubmissionDraft[]): HashSubmissionDraft[] {
  return submissions.map((item) => ({ ...item }));
}

function cloneClusters(clusters: readonly HashClusterDraft[]): HashClusterDraft[] {
  return clusters.map((item) => ({ ...item }));
}

export function clusterNearDuplicates(
  submissions: readonly HashSubmissionDraft[],
  clusters: readonly HashClusterDraft[],
  separations: readonly HashSeparation[],
): { submissions: HashSubmissionDraft[]; clusters: HashClusterDraft[] } {
  const nextSubs = cloneSubs(submissions);
  const nextClusters = cloneClusters(clusters);
  const blocked = separationSet(separations);
  const open = nextSubs.filter((item) => !item.hidden).sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  for (const item of open) {
    if (item.clusterId) continue;
    let best: { id: string; score: number } | null = null;
    for (const cluster of nextClusters) {
      const members = membersOf(nextSubs, cluster.id);
      if (!members.length || blockedFromCluster(item.id, members, blocked)) continue;
      let score = 0;
      for (const member of members) score = Math.max(score, tokenSimilarity(item.text, member.text));
      if (score >= 0.82 && (!best || score > best.score)) best = { id: cluster.id, score };
    }
    if (best) {
      item.clusterId = best.id;
      continue;
    }
    const twin = open.find((other) => other.id !== item.id && other.clusterId && normHash(other.text) === normHash(item.text) && !pairBlocked(item.id, other.id, blocked));
    if (twin?.clusterId && !blockedFromCluster(item.id, membersOf(nextSubs, twin.clusterId), blocked)) {
      item.clusterId = twin.clusterId;
      continue;
    }
    const exact = open.find((other) => other !== item && !other.clusterId && normHash(other.text) === normHash(item.text));
    if (!exact) continue;
    const cluster: HashClusterDraft = {
      id: `c-${item.id}`,
      title: titleFromText(item.text),
      summary: item.text.trim().slice(0, 140),
      userLocked: false,
      source: "rules",
      pinned: false,
      hidden: false,
      actionKind: "",
      actionNote: "",
    };
    nextClusters.push(cluster);
    item.clusterId = cluster.id;
    if (exact && normHash(exact.text) === normHash(item.text)) exact.clusterId = cluster.id;
  }
  return { submissions: nextSubs, clusters: nextClusters };
}

export function clusterThemes(
  submissions: readonly HashSubmissionDraft[],
  clusters: readonly HashClusterDraft[],
  separations: readonly HashSeparation[],
): { submissions: HashSubmissionDraft[]; clusters: HashClusterDraft[] } {
  const nextSubs = cloneSubs(submissions);
  const nextClusters = cloneClusters(clusters);
  const blocked = separationSet(separations);
  for (const cluster of nextClusters) {
    if (cluster.userLocked || cluster.source === "facilitator") continue;
    const members = membersOf(nextSubs, cluster.id);
    const sample = members[0];
    if (!sample) continue;
    const theme = keywordFor(sample.text);
    if (!theme) continue;
    if (!members.every((item) => keywordFor(item.text)?.title === theme.title)) continue;
    cluster.title = theme.title;
    if (!cluster.summary || cluster.source === "rules") cluster.summary = theme.summary;
  }
  const loose = nextSubs.filter((item) => !item.hidden && !item.clusterId).sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  for (const item of loose) {
    const theme = keywordFor(item.text);
    if (!theme) continue;
    const existing = nextClusters.find((cluster) => {
      if (normHash(cluster.title) !== normHash(theme.title)) return false;
      return !blockedFromCluster(item.id, membersOf(nextSubs, cluster.id), blocked);
    });
    if (existing) {
      item.clusterId = existing.id;
      if (!existing.userLocked && existing.source !== "facilitator" && !existing.summary) existing.summary = theme.summary;
      continue;
    }
    const created: HashClusterDraft = {
      id: `c-${item.id}`,
      title: theme.title,
      summary: theme.summary,
      userLocked: false,
      source: "rules",
      pinned: false,
      hidden: false,
      actionKind: "",
      actionNote: "",
    };
    nextClusters.push(created);
    item.clusterId = created.id;
  }
  const byTitle = new Map<string, HashClusterDraft[]>();
  for (const cluster of nextClusters) {
    if (cluster.userLocked || cluster.source === "facilitator") continue;
    const key = normHash(cluster.title);
    const list = byTitle.get(key) ?? [];
    list.push(cluster);
    byTitle.set(key, list);
  }
  for (const group of byTitle.values()) {
    if (group.length < 2) continue;
    const [keep, ...rest] = group;
    if (!keep) continue;
    for (const other of rest) {
      const moving = nextSubs.filter((item) => item.clusterId === other.id);
      const staying = membersOf(nextSubs, keep.id);
      const clash = moving.some((item) => blockedFromCluster(item.id, staying, blocked) || staying.some((member) => pairBlocked(item.id, member.id, blocked)));
      if (clash) continue;
      for (const item of moving) item.clusterId = keep.id;
    }
  }
  return { submissions: nextSubs, clusters: nextClusters.filter((cluster) => membersOf(nextSubs, cluster.id).length > 0 || cluster.userLocked || cluster.pinned) };
}

export type AiGroup = { title: string; summary: string; submissionIds: string[] };

export function applyAiGroups(
  submissions: readonly HashSubmissionDraft[],
  clusters: readonly HashClusterDraft[],
  separations: readonly HashSeparation[],
  groups: readonly AiGroup[],
): { submissions: HashSubmissionDraft[]; clusters: HashClusterDraft[] } {
  const nextSubs = cloneSubs(submissions);
  const nextClusters = cloneClusters(clusters);
  const blocked = separationSet(separations);
  const loose = new Set(nextSubs.filter((item) => !item.clusterId && !item.hidden).map((item) => item.id));
  for (const group of groups) {
    const title = group.title.trim().slice(0, 60);
    const summary = group.summary.trim().slice(0, 180);
    if (!title) continue;
    const ids = group.submissionIds.filter((id) => loose.has(id));
    if (!ids.length) continue;
    const existing = nextClusters.find((cluster) => normHash(cluster.title) === normHash(title));
    const target = existing && !ids.some((id) => blockedFromCluster(id, membersOf(nextSubs, existing.id), blocked))
      ? existing
      : null;
    const home = target ?? {
      id: `c-${ids[0]}`,
      title,
      summary,
      userLocked: false,
      source: "ai" as const,
      pinned: false,
      hidden: false,
      actionKind: "" as const,
      actionNote: "",
    };
    if (!target) nextClusters.push(home);
    else if (!home.userLocked && home.source !== "facilitator" && summary) home.summary = summary;
    const placed: string[] = [];
    for (const id of ids) {
      const row = nextSubs.find((item) => item.id === id);
      if (!row || row.clusterId) continue;
      if (blockedFromCluster(id, membersOf(nextSubs, home.id), blocked)) continue;
      if (placed.some((other) => pairBlocked(id, other, blocked))) continue;
      row.clusterId = home.id;
      placed.push(id);
      loose.delete(id);
    }
  }
  return {
    submissions: nextSubs,
    clusters: nextClusters.filter((cluster) => membersOf(nextSubs, cluster.id).length > 0 || cluster.userLocked || cluster.pinned),
  };
}

export function guestAuthor(anonymous: boolean, name: string): string {
  if (anonymous) return "Anonymous";
  const clean = name.trim();
  return clean || "Anonymous";
}

export function visibleToGuest(input: { blind: boolean; revealed: boolean; showLive: boolean; mine: boolean }): boolean {
  if (input.mine) return true;
  if (input.blind && !input.revealed) return false;
  if (!input.showLive) return false;
  return true;
}

export function boardCovered(input: { host: boolean; blind: boolean; revealed: boolean; showLive: boolean }): boolean {
  if (input.host) return false;
  if (input.blind && !input.revealed) return true;
  return !input.showLive;
}

export function tallyTheme(submissionCount: number, supportCount: number, voteCount: number): {
  independentVoiceCount: number;
  supportCount: number;
  voteCount: number;
} {
  return { independentVoiceCount: submissionCount, supportCount, voteCount };
}

export function canCastVote(alreadyCast: number, limit: number): boolean {
  return alreadyCast < limit;
}

export function luckyPick(ids: readonly string[], seed: string): string | null {
  const eligible = [...new Set(ids.filter(Boolean))].sort();
  if (eligible.length < 2) return null;
  let hash = 2166136261;
  const text = `${seed}:${eligible.join(",")}`;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return eligible[(hash >>> 0) % eligible.length] ?? null;
}

export function rulesSynthesis(prompt: string, themes: { title: string; summary: string; voices: number; actionKind: HashAction; actionNote: string }[]): {
  topThemes: string[];
  agreement: string[];
  differing: string[];
  nextActions: string[];
  questions: string[];
  source: "rules";
} {
  const ranked = [...themes].sort((a, b) => b.voices - a.voices || a.title.localeCompare(b.title));
  return {
    topThemes: ranked.slice(0, 4).map((theme) => `${theme.title} · ${theme.voices} ${theme.voices === 1 ? "voice" : "voices"}`),
    agreement: ranked.filter((theme) => theme.voices >= 3).map((theme) => theme.summary || theme.title),
    differing: ranked.filter((theme) => theme.voices === 1).map((theme) => theme.title),
    nextActions: ranked.filter((theme) => theme.actionKind === "action" || theme.actionKind === "decide").map((theme) => theme.actionNote || theme.title),
    questions: prompt.trim() ? [prompt.trim()] : [],
    source: "rules",
  };
}

export type HashVoice = {
  id: string;
  text: string;
  label: string;
  anonymous: boolean;
  createdAt: string;
  mine: boolean;
  hidden: boolean;
};

export type HashTheme = {
  id: string;
  title: string;
  summary: string;
  voices: number;
  anonymousVoices: number;
  support: number;
  votes: number;
  pinned: boolean;
  hidden: boolean;
  locked: boolean;
  source: HashSource;
  actionKind: HashAction;
  actionNote: string;
  mineSupported: boolean;
  mineVoted: boolean;
  prominence: 0 | 1 | 2 | 3;
  lines: HashVoice[];
};

export type HashSynthesis = {
  topThemes: string[];
  agreement: string[];
  differing: string[];
  nextActions: string[];
  questions: string[];
  source: "ai" | "rules";
  generatedAt?: string;
  summaryVersion?: number;
};

export type HashRoom = {
  role: "host" | "guest";
  sessionId: string;
  code: string;
  prompt: string;
  context: string;
  starter: string;
  identityMode: HashIdentity;
  showLiveBoard: boolean;
  blindRound: boolean;
  revealed: boolean;
  votingEnabled: boolean;
  voteLimit: number;
  votesCast: number;
  cosmicEnabled: boolean;
  status: HashStatus;
  participantCount: number;
  submissionCount: number;
  uncollatedCount: number;
  themeCount: number;
  llmCalls: number;
  themes: HashTheme[];
  loose: HashVoice[];
  strongestId: string;
  favouriteId: string;
  hiddenSignalId: string;
  luckyId: string;
  synthesis: HashSynthesis | null;
  sharePath: string;
};

export function prominence(voices: number): 0 | 1 | 2 | 3 {
  if (voices >= 8) return 3;
  if (voices >= 4) return 2;
  if (voices >= 2) return 1;
  return 0;
}
