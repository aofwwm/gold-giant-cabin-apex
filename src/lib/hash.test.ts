import assert from "node:assert/strict";
import test from "node:test";
import { KAIROS_LIFE, KAIROS_TODAY, KAIROS_WORK } from "./kairos-modes.ts";
import {
  applyAiGroups,
  canCastVote,
  clusterNearDuplicates,
  clusterThemes,
  guestAuthor,
  luckyPick,
  tallyTheme,
  boardCovered,
  visibleToGuest,
  type HashClusterDraft,
  type HashSubmissionDraft,
} from "./hash.ts";

function sub(id: string, text: string, clusterId: string | null = null): HashSubmissionDraft {
  return { id, text, anonymous: true, createdAt: `2026-10-06T00:00:0${id.length}.000Z`, clusterId, hidden: false };
}

function cluster(id: string, title: string, locked = false): HashClusterDraft {
  return { id, title, summary: "", userLocked: locked, source: locked ? "facilitator" : "rules", pinned: false, hidden: false, actionKind: "", actionNote: "" };
}

test("navigation is Today, then Work, then Life", () => {
  assert.equal(KAIROS_TODAY.label, "Today");
  assert.deepEqual(KAIROS_WORK.map((item) => item.label), ["Meet", "Makan", "Team Out", "Hash It Out"]);
  assert.deepEqual(KAIROS_LIFE.map((item) => item.label), ["Family", "Dating", "Travel", "Oracle"]);
});

test("five identical ideas stay and count as five voices", () => {
  const seeds = ["a", "b", "c", "d", "e"].map((id) => sub(id, "too many meetings"));
  const result = clusterNearDuplicates(seeds, [], []);
  const ids = new Set(result.submissions.map((item) => item.clusterId));
  assert.equal(result.submissions.length, 5);
  assert.equal([...ids].filter(Boolean).length, 1);
  const clusterId = result.submissions[0]?.clusterId;
  assert.equal(result.submissions.filter((item) => item.clusterId === clusterId).length, 5);
});

test("approval phrases gather only when themes are collated", () => {
  const seeds = [
    sub("a", "Director approval takes too long"),
    sub("b", "too many approval levels"),
    sub("c", "clearance process delays everything"),
  ];
  const near = clusterNearDuplicates(seeds, [], []);
  assert.equal(near.submissions.every((item) => item.clusterId == null), true);
  const themed = clusterThemes(near.submissions, near.clusters, []);
  const ids = new Set(themed.submissions.map((item) => item.clusterId));
  assert.equal([...ids].filter(Boolean).length, 1);
  assert.equal(themed.clusters[0]?.title, "Approval process");
  assert.equal(tallyTheme(3, 1, 4).independentVoiceCount, 3);
  assert.equal(tallyTheme(3, 1, 4).supportCount, 1);
  assert.equal(tallyTheme(3, 1, 4).voteCount, 4);
});

test("meetings and requirements stay apart, and a split is not undone", () => {
  const seeds = [sub("a", "too many meetings"), sub("b", "unclear technical requirements")];
  const themed = clusterThemes(seeds, [], []);
  assert.notEqual(themed.submissions[0]?.clusterId, themed.submissions[1]?.clusterId);
  const meeting = cluster("m", "Meeting overload");
  const other = cluster("r", "Meeting overload");
  const split = clusterThemes(
    [{ ...sub("a", "too many meetings"), clusterId: "m" }, { ...sub("b", "meetings are too long"), clusterId: "r" }],
    [meeting, other],
    [{ a: "a", b: "b" }],
  );
  assert.notEqual(split.submissions.find((item) => item.id === "a")?.clusterId, split.submissions.find((item) => item.id === "b")?.clusterId);
  const ai = applyAiGroups(split.submissions, split.clusters, [{ a: "a", b: "b" }], [
    { title: "Meeting overload", summary: "Meetings are heavy.", submissionIds: ["a", "b"] },
  ]);
  assert.notEqual(ai.submissions.find((item) => item.id === "a")?.clusterId, ai.submissions.find((item) => item.id === "b")?.clusterId);
});

test("anonymous labels and blind rooms hide other people", () => {
  assert.equal(guestAuthor(true, "Jack"), "Anonymous");
  assert.equal(guestAuthor(false, "Mina"), "Mina");
  assert.equal(visibleToGuest({ blind: true, revealed: false, showLive: true, mine: false }), false);
  assert.equal(visibleToGuest({ blind: true, revealed: false, showLive: true, mine: true }), true);
  assert.equal(visibleToGuest({ blind: true, revealed: true, showLive: true, mine: false }), true);
  assert.equal(visibleToGuest({ blind: false, revealed: true, showLive: false, mine: false }), false);
  assert.equal(boardCovered({ host: false, blind: true, revealed: false, showLive: true }), true);
  assert.equal(boardCovered({ host: true, blind: true, revealed: false, showLive: true }), false);
  assert.equal(boardCovered({ host: false, blind: false, revealed: true, showLive: false }), true);
  assert.equal(boardCovered({ host: false, blind: true, revealed: true, showLive: true }), false);
});

test("votes are capped and lucky pick skips hidden ideas", () => {
  assert.equal(canCastVote(2, 2), false);
  assert.equal(canCastVote(1, 2), true);
  const pick = luckyPick(["hidden", "kept", "also"], "room");
  assert.ok(pick === "kept" || pick === "also" || pick === "hidden");
  const safe = luckyPick(["kept", "also"], "room");
  assert.ok(safe === "kept" || safe === "also");
  assert.equal(luckyPick(["only"], "room"), null);
});
