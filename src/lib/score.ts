import { applyMomentContext, type MissionContext } from "@/lib/mission";
import { markOf, readReading, scoreLayers, type LayerScore } from "@/lib/reading";
import type { Kind, SlotView } from "@/lib/kairos.types";
import { rosterSize } from "@/lib/tally";

export type ScoredSlot = {
  slot: SlotView;
  layer: LayerScore & { momentNotes: string[] };
};

export function scoreSlots(
  slots: SlotView[],
  title: string,
  kind: Kind,
  durationMin: number,
  context: MissionContext | null = null,
): ScoredSlot[] {
  const roster = rosterSize(slots);
  return slots.map((slot) => {
    const reading = readReading(slot.startsAt, title, { kind, durationMin });
    const layer = scoreLayers(reading, slot.votes, roster);
    const adjusted = applyMomentContext(layer.moment, reading, durationMin, slot.startsAt, context);
    const total = layer.people.waiting ? null : Math.max(0, Math.min(100, layer.people.points + adjusted.moment + layer.cosmicFit));
    return {
      slot,
      layer: {
        ...layer,
        moment: adjusted.moment,
        momentNotes: adjusted.notes,
        total,
        mark: total == null ? "" : markOf(total),
      },
    };
  });
}

export function pickWinner(scored: ScoredSlot[]): ScoredSlot | null {
  const voted = scored.filter((item) => item.layer.total != null);
  if (voted.length === 0) return null;
  return voted.reduce((best, item) => {
    if (item.layer.total! > best.layer.total!) return item;
    if (item.layer.total === best.layer.total && item.layer.people.points > best.layer.people.points) return item;
    return best;
  });
}

export function scoreFingerprint(scored: ScoredSlot[]): string {
  return scored
    .map((item) => {
      const people = item.layer.people;
      return [
        item.slot.id,
        item.layer.total ?? "x",
        people.points,
        item.layer.moment,
        item.layer.cosmicFit,
        people.love,
        people.yes,
        people.soft,
        people.no,
      ].join(".");
    })
    .join("|");
}
