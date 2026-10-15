import { clsx } from "clsx";
import { useEffect, useState, type ReactNode } from "react";
import { MARK, VOTE_LABEL, VOTE_ORDER } from "@/components/vote-style";
import type { Choice, SlotView } from "@/lib/kairos.types";
import { counts } from "@/lib/tally";
import { formatWhen } from "@/lib/time";

export const fieldClass =
  "h-12 w-full min-w-0 rounded-xl bg-ink px-3 text-base text-cream ring-1 ring-line outline-none placeholder:text-mute";

export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="grid-veil pointer-events-none fixed inset-0 -z-10" aria-hidden />
      <div className="h-1 bg-vermilion" />
      {children}
    </div>
  );
}

export function Seal({ label = "吉" }: { label?: string }) {
  return (
    <div className="seal" aria-hidden>
      {label}
    </div>
  );
}

export function ScoreRing({ score }: { score: number }) {
  const tone = score >= 80 ? "text-jade" : score >= 55 ? "text-gold" : "text-vermilion";
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  return (
    <div className="relative size-16 shrink-0" role="img" aria-label={`Kairos score ${score} out of 100`}>
      <svg viewBox="0 0 72 72" className="size-16">
        <circle cx="36" cy="36" r={radius} fill="none" strokeWidth="4" className="text-line" stroke="currentColor" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className={tone}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center leading-none">
        <span className="text-center">
          <span className={clsx("block text-sm font-semibold tabular-nums", tone)}>{score}</span>
          <span className="block text-xs text-mute">/100</span>
        </span>
      </div>
    </div>
  );
}

const VOTE_TONE: Record<Choice, string> = {
  love: "bg-jade text-ink",
  yes: "bg-gold text-ink",
  soft: "bg-panel text-cream ring-1 ring-gold",
  no: "bg-vermilion text-cream",
};

export function SlotCard({
  slot,
  durationMin,
  leading = false,
  mine,
  onVote,
  pending = false,
  preview = false,
}: {
  slot: SlotView;
  durationMin: number;
  leading?: boolean;
  mine?: Choice;
  onVote?: (choice: Choice) => void;
  pending?: boolean;
  preview?: boolean;
}) {
  const tally = counts(slot.votes);
  const headline = slot.label || formatWhen(slot.startsAt);
  const detail = slot.label ? `${formatWhen(slot.startsAt)} · ${durationMin} min` : `${durationMin} min`;
  const shown = slot.votes.slice(0, 8);
  const extra = slot.votes.length - shown.length;

  return (
    <article className="rounded-2xl bg-panel p-4 shadow-card sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight text-cream">{headline}</h3>
          <p className="mt-1 text-sm text-mute">{detail}</p>
        </div>
        {leading ? <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-ink">Kairos pick</span> : null}
      </div>
      {slot.venueNote ? <p className="mt-2 text-sm text-cream">{slot.venueNote}</p> : null}
      {slot.votes.length > 0 ? (
        <p className="mt-3 text-lg leading-none" aria-hidden>
          {slot.votes.map((vote) => MARK[vote.choice]).join(" ")}
        </p>
      ) : (
        <p className="mt-3 text-sm text-mute">No preference yet. Can is not the same as want.</p>
      )}

      <div className={clsx("mt-4 grid grid-cols-2 gap-2", preview && "pointer-events-none")} aria-hidden={preview}>
        {VOTE_ORDER.map((choice) => {
          const active = mine === choice;
          return (
            <button
              key={choice}
              type="button"
              className={clsx(
                "press min-h-11 rounded-xl px-2 text-sm font-semibold",
                active ? VOTE_TONE[choice] : "bg-ink text-cream ring-1 ring-line",
              )}
              aria-pressed={active}
              disabled={preview ? false : pending || !onVote}
              onClick={() => onVote?.(choice)}
            >
              <span className="block" aria-hidden>
                {MARK[choice]}
              </span>
              <span className="block">{VOTE_LABEL[choice]}</span>
              <span className="block tabular-nums font-medium">{tally[choice]}</span>
            </button>
          );
        })}
      </div>

      {shown.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {shown.map((vote) => (
            <li key={vote.nickname} className="rounded-full bg-ink px-2.5 py-1 text-xs ring-1 ring-line">
              <span aria-hidden>{MARK[vote.choice]} </span>
              <span className="text-cream">{vote.nickname}</span>
              <span className="text-mute"> {VOTE_LABEL[vote.choice].toLowerCase()}</span>
            </li>
          ))}
          {extra > 0 ? <li className="px-1 py-1 text-xs text-mute">+{extra}</li> : null}
        </ul>
      ) : null}
    </article>
  );
}

export function ConfettiBurst({ burst }: { burst: number }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  if (!burst || reduced) return null;
  const bits = Array.from({ length: 28 }, (_, index) => {
    const angle = (index / 28) * Math.PI * 2;
    const dist = 88 + (index % 6) * 24;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 36,
      rot: (index % 2 === 0 ? 1 : -1) * (90 + index * 9),
      color: index % 3 === 0 ? "bg-vermilion" : index % 3 === 1 ? "bg-gold" : "bg-jade",
      delay: (index % 5) * 18,
    };
  });
  return (
    <div key={burst} className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {bits.map((bit, index) => (
        <span
          key={`${burst}-${index}`}
          className={clsx("confetti-bit", bit.color)}
          style={{
            animationDelay: `${bit.delay}ms`,
            ["--dx" as string]: `${bit.dx}px`,
            ["--dy" as string]: `${bit.dy}px`,
            ["--rot" as string]: `${bit.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}
