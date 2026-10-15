import type { Choice, SlotView, VoteView } from "@/lib/kairos.types";

export function heat(votes: VoteView[]): number {
  let score = 0;
  for (const vote of votes) {
    if (vote.choice === "love") score += 4;
    else if (vote.choice === "yes") score += 2;
    else if (vote.choice === "soft") score += 0;
    else score -= 3;
  }
  return score;
}

export function counts(votes: VoteView[]): Record<Choice, number> {
  return {
    love: votes.filter((v) => v.choice === "love").length,
    yes: votes.filter((v) => v.choice === "yes").length,
    soft: votes.filter((v) => v.choice === "soft").length,
    no: votes.filter((v) => v.choice === "no").length,
  };
}

export function rosterSize(slots: { votes: VoteView[] }[]): number {
  const names = new Set<string>();
  for (const slot of slots) {
    for (const vote of slot.votes) names.add(vote.nickname.trim().toLowerCase());
  }
  return names.size;
}

export type PeopleFit = {
  points: number;
  max: 40;
  waiting: boolean;
  roster: number;
  voted: number;
  love: number;
  yes: number;
  soft: number;
  no: number;
  able: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Willingness, not just availability. Empty ballots do not invent a score. */
export function peopleFit(votes: VoteView[], roster: number): PeopleFit {
  const tally = counts(votes);
  const voted = tally.love + tally.yes + tally.soft + tally.no;
  const able = tally.love + tally.yes + tally.soft;
  const base = {
    max: 40 as const,
    roster,
    voted,
    love: tally.love,
    yes: tally.yes,
    soft: tally.soft,
    no: tally.no,
    able,
  };
  if (roster === 0 || voted === 0) {
    return { ...base, points: 0, waiting: true };
  }
  const attendance = able / roster;
  const enthusiasm = (tally.love + tally.yes * 0.45) / roster;
  const coverage = voted / roster;
  let points = Math.round(22 * attendance + 14 * enthusiasm + 4 * coverage);
  points -= Math.min(16, tally.no * 6 + tally.soft * 2);
  return { ...base, points: clamp(points, 0, 40), waiting: false };
}

export function peopleLine(fit: PeopleFit): string {
  if (fit.waiting) return "No votes on this time yet.";
  const bits: string[] = [];
  if (fit.love) bits.push(`${fit.love} great`);
  if (fit.yes) bits.push(`${fit.yes} can make it`);
  if (fit.soft) bits.push(`${fit.soft} please no`);
  if (fit.no) bits.push(`${fit.no} cannot`);
  return `${fit.able} / ${fit.roster} can attend · ${bits.join(" · ")}`;
}

export function leadingSlot(slots: SlotView[]): SlotView | null {
  let best: SlotView | null = null;
  let bestHeat = 0;
  for (const slot of slots) {
    const value = heat(slot.votes);
    if (value <= 0) continue;
    if (!best || value > bestHeat || (value === bestHeat && slot.score > best.score)) {
      best = slot;
      bestHeat = value;
    }
  }
  return best;
}
