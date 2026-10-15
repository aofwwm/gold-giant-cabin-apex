//#region node_modules/.nitro/vite/services/ssr/assets/hash-lgZwuMrP.js
var HASH_STARTERS = [
	{
		id: "brainstorm",
		label: "Brainstorm",
		prompt: "What ideas should we explore?"
	},
	{
		id: "blockers",
		label: "What's not working?",
		prompt: "What is slowing this project down?"
	},
	{
		id: "prioritise",
		label: "Prioritise",
		prompt: "What should we tackle first?"
	},
	{
		id: "retro",
		label: "Retrospective",
		prompt: "What should we keep, change, or stop?"
	},
	{
		id: "open",
		label: "Open question",
		prompt: "What should we talk about?"
	},
	{
		id: "custom",
		label: "Custom",
		prompt: ""
	}
];
var STOP = /* @__PURE__ */ new Set([
	"the",
	"and",
	"for",
	"our",
	"are",
	"was",
	"were",
	"this",
	"that",
	"with",
	"too",
	"very",
	"just",
	"from",
	"have",
	"has",
	"all",
	"but",
	"not",
	"you",
	"your",
	"its",
	"into",
	"about",
	"there",
	"their"
]);
var KEYWORDS = [
	{
		title: "Approval process",
		summary: "Multiple approval layers are slowing decisions.",
		words: [
			"approval",
			"approvals",
			"approve",
			"clearance",
			"director"
		]
	},
	{
		title: "Meeting overload",
		summary: "Too many meetings without clear decisions.",
		words: [
			"meeting",
			"meetings",
			"agenda",
			"standup"
		]
	},
	{
		title: "Changing requirements",
		summary: "Requirements keep moving.",
		words: [
			"requirement",
			"requirements",
			"scope"
		]
	},
	{
		title: "Clearer ownership",
		summary: "Ownership and follow-up are unclear.",
		words: [
			"owner",
			"owners",
			"ownership",
			"owns",
			"follow"
		]
	},
	{
		title: "Unclear decisions",
		summary: "Decisions are not landing clearly.",
		words: ["decision", "decisions"]
	}
];
function normHash(text) {
	return text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function hashTokens(text) {
	return normHash(text).split(" ").filter((word) => word.length > 2 && !STOP.has(word));
}
function tokenSimilarity(left, right) {
	const a = normHash(left);
	const b = normHash(right);
	if (!a || !b) return 0;
	if (a === b) return 1;
	if ((a.includes(b) || b.includes(a)) && Math.min(a.length, b.length) >= 12) return .9;
	const A = new Set(hashTokens(left));
	const B = new Set(hashTokens(right));
	if (!A.size || !B.size) return 0;
	let shared = 0;
	for (const token of A) if (B.has(token)) shared += 1;
	return shared / (A.size + B.size - shared);
}
function sepKey(a, b) {
	return a < b ? `${a}|${b}` : `${b}|${a}`;
}
function separationSet(pairs) {
	return new Set(pairs.map((pair) => sepKey(pair.a, pair.b)));
}
function pairBlocked(left, right, blocked) {
	if (!left || !right || left === right) return false;
	return blocked.has(sepKey(left, right));
}
function keywordFor(text) {
	const tokens = new Set(hashTokens(text));
	let best = null;
	for (const theme of KEYWORDS) {
		const hits = theme.words.filter((word) => tokens.has(word)).length;
		if (!hits) continue;
		if (!best || hits > best.hits) best = {
			title: theme.title,
			summary: theme.summary,
			hits
		};
	}
	return best ? {
		title: best.title,
		summary: best.summary
	} : null;
}
function titleFromText(text) {
	const words = normHash(text).split(" ").filter(Boolean).slice(0, 4);
	if (!words.length) return "New thread";
	return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function membersOf(submissions, clusterId) {
	return submissions.filter((item) => item.clusterId === clusterId && !item.hidden);
}
function blockedFromCluster(submissionId, members, blocked) {
	return members.some((member) => pairBlocked(submissionId, member.id, blocked));
}
function cloneSubs(submissions) {
	return submissions.map((item) => ({ ...item }));
}
function cloneClusters(clusters) {
	return clusters.map((item) => ({ ...item }));
}
function clusterNearDuplicates(submissions, clusters, separations) {
	const nextSubs = cloneSubs(submissions);
	const nextClusters = cloneClusters(clusters);
	const blocked = separationSet(separations);
	const open = nextSubs.filter((item) => !item.hidden).sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
	for (const item of open) {
		if (item.clusterId) continue;
		let best = null;
		for (const cluster of nextClusters) {
			const members = membersOf(nextSubs, cluster.id);
			if (!members.length || blockedFromCluster(item.id, members, blocked)) continue;
			let score = 0;
			for (const member of members) score = Math.max(score, tokenSimilarity(item.text, member.text));
			if (score >= .82 && (!best || score > best.score)) best = {
				id: cluster.id,
				score
			};
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
		const cluster = {
			id: `c-${item.id}`,
			title: titleFromText(item.text),
			summary: item.text.trim().slice(0, 140),
			userLocked: false,
			source: "rules",
			pinned: false,
			hidden: false,
			actionKind: "",
			actionNote: ""
		};
		nextClusters.push(cluster);
		item.clusterId = cluster.id;
		if (exact && normHash(exact.text) === normHash(item.text)) exact.clusterId = cluster.id;
	}
	return {
		submissions: nextSubs,
		clusters: nextClusters
	};
}
function clusterThemes(submissions, clusters, separations) {
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
		const created = {
			id: `c-${item.id}`,
			title: theme.title,
			summary: theme.summary,
			userLocked: false,
			source: "rules",
			pinned: false,
			hidden: false,
			actionKind: "",
			actionNote: ""
		};
		nextClusters.push(created);
		item.clusterId = created.id;
	}
	const byTitle = /* @__PURE__ */ new Map();
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
			if (moving.some((item) => blockedFromCluster(item.id, staying, blocked) || staying.some((member) => pairBlocked(item.id, member.id, blocked)))) continue;
			for (const item of moving) item.clusterId = keep.id;
		}
	}
	return {
		submissions: nextSubs,
		clusters: nextClusters.filter((cluster) => membersOf(nextSubs, cluster.id).length > 0 || cluster.userLocked || cluster.pinned)
	};
}
function applyAiGroups(submissions, clusters, separations, groups) {
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
		const target = existing && !ids.some((id) => blockedFromCluster(id, membersOf(nextSubs, existing.id), blocked)) ? existing : null;
		const home = target ?? {
			id: `c-${ids[0]}`,
			title,
			summary,
			userLocked: false,
			source: "ai",
			pinned: false,
			hidden: false,
			actionKind: "",
			actionNote: ""
		};
		if (!target) nextClusters.push(home);
		else if (!home.userLocked && home.source !== "facilitator" && summary) home.summary = summary;
		const placed = [];
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
		clusters: nextClusters.filter((cluster) => membersOf(nextSubs, cluster.id).length > 0 || cluster.userLocked || cluster.pinned)
	};
}
function guestAuthor(anonymous, name) {
	if (anonymous) return "Anonymous";
	return name.trim() || "Anonymous";
}
function visibleToGuest(input) {
	if (input.mine) return true;
	if (input.blind && !input.revealed) return false;
	if (!input.showLive) return false;
	return true;
}
function boardCovered(input) {
	if (input.host) return false;
	if (input.blind && !input.revealed) return true;
	return !input.showLive;
}
function tallyTheme(submissionCount, supportCount, voteCount) {
	return {
		independentVoiceCount: submissionCount,
		supportCount,
		voteCount
	};
}
function canCastVote(alreadyCast, limit) {
	return alreadyCast < limit;
}
function luckyPick(ids, seed) {
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
function rulesSynthesis(prompt, themes) {
	const ranked = [...themes].sort((a, b) => b.voices - a.voices || a.title.localeCompare(b.title));
	return {
		topThemes: ranked.slice(0, 4).map((theme) => `${theme.title} · ${theme.voices} ${theme.voices === 1 ? "voice" : "voices"}`),
		agreement: ranked.filter((theme) => theme.voices >= 3).map((theme) => theme.summary || theme.title),
		differing: ranked.filter((theme) => theme.voices === 1).map((theme) => theme.title),
		nextActions: ranked.filter((theme) => theme.actionKind === "action" || theme.actionKind === "decide").map((theme) => theme.actionNote || theme.title),
		questions: prompt.trim() ? [prompt.trim()] : [],
		source: "rules"
	};
}
function prominence(voices) {
	if (voices >= 8) return 3;
	if (voices >= 4) return 2;
	if (voices >= 2) return 1;
	return 0;
}
//#endregion
export { clusterNearDuplicates as a, luckyPick as c, tallyTheme as d, visibleToGuest as f, canCastVote as i, prominence as l, applyAiGroups as n, clusterThemes as o, boardCovered as r, guestAuthor as s, HASH_STARTERS as t, rulesSynthesis as u };
