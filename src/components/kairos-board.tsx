import { useState } from "react";
import { CalendarPlus, Sparkles, Users } from "lucide-react";
import { clsx } from "clsx";
import { applyMomentContext, type MissionContext } from "@/lib/mission";
import { cosmicPoints, momentPoints, voiceLine, whyBullets, type KairosReading, type Mission } from "@/lib/reading";
import { pickWinner, type ScoredSlot } from "@/lib/score";
import { rosterSize } from "@/lib/tally";
import type { Choice } from "@/lib/kairos.types";
import { formatMoment } from "@/lib/time";
import { MARK } from "@/components/vote-style";
import { KairosVoice } from "@/components/kairos-voice";
import type { ExplanationView } from "@/lib/explain";

export type { ScoredSlot } from "@/lib/score";
export { pickWinner, scoreSlots } from "@/lib/score";

const MISSION_COPY: Record<Mission, string> = {
  pitch: "Budget discussion",
  vendor: "Vendor discussion",
  difficult: "Difficult conversation",
  bonding: "Team bonding",
  makan: "Team makan",
  general: "Working conversation",
};

function markClass(mark: string) {
  if (mark === "吉") return "text-jade";
  if (mark === "平") return "text-gold";
  return "text-vermilion";
}

function Bar({ value, max, tone }: { value: number; max: number; tone: "jade" | "gold" | "cream" }) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  const color = tone === "jade" ? "bg-jade" : tone === "gold" ? "bg-gold" : "bg-cream";
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-ink" aria-hidden>
      <div className={clsx("h-full rounded-full", color)} style={{ width: `${width}%` }} />
    </div>
  );
}

function pct(value: number, max: number) {
  return `${Math.round((Math.max(0, value) / max) * 100)}%`;
}

function faces(votes: { choice: Choice }[]) {
  return votes.map((vote) => MARK[vote.choice]).join(" ");
}

export function BoardHero({
  scored,
  durationMin,
  revealed,
  onReveal,
  onShare,
  onCopy,
  onFull,
  onInvite,
  pending,
  explanation = null,
  explainPending = false,
  stale = false,
  onRefreshExplanation,
  cosmicText = "",
  cosmicPending = false,
  missionLabel = "",
  missionSummary = "",
  where = "",
  followOn = null,
  onGoogleCalendar,
  googleNote = "",
}: {
  scored: ScoredSlot[];
  durationMin: number;
  revealed: boolean;
  onReveal: () => void;
  onShare: () => void;
  onCopy: () => void;
  onFull: () => void;
  onInvite: () => void;
  pending: boolean;
  explanation?: ExplanationView | null;
  explainPending?: boolean;
  stale?: boolean;
  onRefreshExplanation?: () => void;
  cosmicText?: string;
  cosmicPending?: boolean;
  missionLabel?: string;
  missionSummary?: string;
  where?: string;
  followOn?: { title: string; note: string; href: string; label: string } | null;
  onGoogleCalendar?: () => void;
  googleNote?: string;
}) {
  const [full, setFull] = useState(false);
  const winner = pickWinner(scored);
  const voters = rosterSize(scored.map((item) => item.slot));

  if (scored.length === 0) {
    return (
      <section id="kairos-result" className="rounded-2xl bg-panel p-5 shadow-card sm:p-7">
        <p className="text-xs font-semibold tracking-brand text-gold">HUMAN PREFERENCE + MOMENT + COSMOS</p>
        <h2 className="mt-2 font-sans text-3xl font-semibold leading-tight text-cream">Add a moment first.</h2>
        <p className="mt-3 text-sm text-mute">Kairos compares times people can actually vote on. Spin a spot, or add an hour.</p>
      </section>
    );
  }

  if (!revealed || !winner || winner.layer.total == null) {
    return (
      <section id="kairos-result" className="rounded-2xl bg-panel p-5 shadow-card sm:p-7">
        <p className="text-xs font-semibold tracking-brand text-gold">HUMAN PREFERENCE + MOMENT + COSMOS</p>
        <h2 className="mt-2 font-sans text-3xl font-semibold leading-tight text-cream">
          {voters === 0 ? "Not every free slot is a wanted slot." : "The nicknames are in."}
        </h2>
        <p className="mt-3 max-w-xl text-sm text-mute">
          {voters === 0
            ? "People vote with a nickname. No login. No calendar. Kairos waits for willingness before it names a moment."
            : `${voters} ${voters === 1 ? "person has" : "people have"} weighed in. Kairos can compare preference, context, and a smaller cosmic vote.`}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="border-l-2 border-jade pl-3">
            <p className="text-xs font-semibold tracking-brand text-jade">PEOPLE FIT</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-cream">40%</p>
            <p className="text-sm text-mute">Willingness, not just availability.</p>
          </div>
          <div className="border-l-2 border-cream pl-3">
            <p className="text-xs font-semibold tracking-brand text-cream">MOMENT FIT</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-cream">30%</p>
            <p className="text-sm text-mute">Purpose, length, and the shape of the day.</p>
          </div>
          <div className="border-l-2 border-gold pl-3">
            <p className="text-xs font-semibold tracking-brand text-gold">COSMIC FIT</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-cream">30%</p>
            <p className="text-sm text-mute">A playful vote. Not a forecast.</p>
          </div>
        </div>
        {voters > 0 ? (
          <button
            type="button"
            onClick={onReveal}
            className="press mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-vermilion text-base font-semibold text-cream"
          >
            <Sparkles className="size-4" aria-hidden />
            Find our Kairos moment
          </button>
        ) : (
          <p className="mt-6 text-sm text-mute">The cosmos gets a vote. Humans still decide.</p>
        )}
        <ul className="mt-6 space-y-3">
          {scored.map((item) => (
            <li key={item.slot.id} className="rounded-xl bg-ink px-3 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-cream">{item.slot.label || formatMoment(item.slot.startsAt)}</p>
                <p className="text-xs text-mute">People fit waiting</p>
              </div>
              {item.slot.votes.length > 0 ? (
                <p className="mt-2 text-lg leading-none" aria-hidden>
                  {faces(item.slot.votes)}
                </p>
              ) : (
                <p className="mt-2 text-xs text-mute">No votes on this time yet.</p>
              )}
              <p className="mt-2 text-xs text-mute">
                Moment {pct(item.layer.moment, 30)} · Cosmos {pct(item.layer.cosmicFit, 30)}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Bar value={item.layer.moment} max={30} tone="cream" />
                <Bar value={item.layer.cosmicFit} max={30} tone="gold" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const layer = winner.layer;
  const when = winner.slot.label || formatMoment(winner.slot.startsAt);
  const weekdayHint = formatMoment(winner.slot.startsAt).slice(0, 3);
  const bullets = explanation?.reasoning?.length ? explanation.reasoning : whyBullets(layer, durationMin);
  const comment = explanation?.comment || voiceLine(layer, weekdayHint);
  const count = scored.length;
  const answered = scored.filter((item) => item.layer.total != null).length;
  const bestLine =
    answered === count
      ? `Best of ${count} proposed ${count === 1 ? "time" : "times"}`
      : `Best of ${answered} answered ${answered === 1 ? "time" : "times"}`;
  const peopleLine =
    layer.people.points >= 30
      ? "The people agree."
      : layer.people.soft + layer.people.no > 0
        ? "The people are split."
        : "The people can live with it.";
  const momentLine = layer.moment >= 20 ? "The timing works." : "The timing is ordinary.";
  const cosmicLine = layer.cosmicFit >= 20 ? "The universe is not complaining either." : "The universe is merely polite.";

  return (
    <section id="kairos-result" className="rounded-2xl bg-panel p-5 shadow-card sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-brand text-gold">
            <Sparkles className="size-3.5" aria-hidden />
            KAIROS PICK
          </p>
          <h2 className="mt-2 font-sans text-3xl font-semibold leading-tight text-cream sm:text-4xl">{when}</h2>
          <p className="mt-2 text-sm text-mute">
            {durationMin} min · {bestLine}
          </p>
          {where ? <p className="mt-1 text-sm text-cream">{where}</p> : null}
        </div>
        <div
          className={clsx(
            "grid size-14 shrink-0 -rotate-6 place-items-center rounded-sm border-2 font-display text-3xl leading-none",
            layer.mark === "吉" ? "border-jade text-jade" : layer.mark === "平" ? "border-gold text-gold" : "border-vermilion text-vermilion",
          )}
          aria-hidden
        >
          {layer.mark}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1">
        <p className="font-sans text-6xl font-semibold leading-none tabular-nums tracking-tight text-cream">{layer.total}%</p>
        <div className="pb-1">
          <p className="text-sm text-mute">Kairos Score</p>
        </div>
      </div>

      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-ink" aria-hidden>
        <div className="h-full bg-jade" style={{ width: `${layer.people.points}%` }} />
        <div className="h-full bg-cream" style={{ width: `${layer.moment}%` }} />
        <div className="h-full bg-gold" style={{ width: `${layer.cosmicFit}%` }} />
      </div>
      <p className="mt-2 text-xs text-mute">Jade is the people. Cream is the moment. Gold is the cosmos, and it weighs less.</p>

      <div className="mt-5 flex items-center gap-2 text-cream">
        <Users className="size-4 text-jade" aria-hidden />
        <p className="text-lg leading-none" aria-hidden>
          {faces(winner.slot.votes)}
        </p>
      </div>
      {winner.slot.votes.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {winner.slot.votes.map((vote) => (
            <li key={vote.nickname} className="rounded-full bg-ink px-2.5 py-1 text-xs ring-1 ring-line">
              <span aria-hidden>{MARK[vote.choice]} </span>
              <span className="text-cream">{vote.nickname}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 text-base text-cream">{peopleLine}</p>
      <p className="text-base text-cream">{momentLine}</p>
      <p className="text-base text-cream">{cosmicLine}</p>
      {explanation?.headline ? <p className="mt-3 text-sm font-semibold text-cream">{explanation.headline}</p> : null}
      <KairosVoice mode="meet" text={comment} status={layer.mark === "吉" ? "good" : layer.mark === "凶" ? "warning" : "neutral"} mark={layer.mark === "吉" ? "吉" : undefined} />
      {explainPending ? <p className="mt-2 text-sm text-mute">Aligning people, timing and the cosmos...</p> : null}

      <div className="mt-8 space-y-4">
        <div className="border-l-2 border-jade pl-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-semibold tracking-brand text-jade">PEOPLE FIT</p>
            <p className="text-lg font-semibold tabular-nums text-cream">{pct(layer.people.points, 40)}</p>
          </div>
          <Bar value={layer.people.points} max={40} tone="jade" />
          <p className="mt-2 text-sm text-cream">
            {layer.people.able} / {layer.people.roster} can attend
          </p>
          <p className="mt-1 text-sm text-mute">
            {layer.people.love} great · {layer.people.yes} can make it · {layer.people.soft} please no · {layer.people.no} cannot
          </p>
        </div>
        <div className="border-l-2 border-cream pl-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-semibold tracking-brand text-cream">MOMENT FIT</p>
            <p className="text-lg font-semibold tabular-nums text-cream">{pct(layer.moment, 30)}</p>
          </div>
          <Bar value={layer.moment} max={30} tone="cream" />
          <p className="mt-2 text-sm text-mute">
            {missionLabel || MISSION_COPY[layer.reading.mission]} · {durationMin} min
          </p>
          <p className="text-sm text-mute">{layer.reading.fit.note}</p>
          <p className="text-sm text-mute">{layer.reading.breathing.note}</p>
          {layer.momentNotes.map((note) => (
            <p key={note} className="text-sm text-mute">
              {note}
            </p>
          ))}
          {missionSummary ? <p className="mt-1 text-sm text-mute">{missionSummary}</p> : null}
        </div>
        <div className="border-l-2 border-gold pl-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-semibold tracking-brand text-gold">COSMIC FIT</p>
            <p className="text-lg font-semibold tabular-nums text-cream">{pct(layer.cosmicFit, 30)}</p>
          </div>
          <Bar value={layer.cosmicFit} max={30} tone="gold" />
          <p className="mt-2 text-sm text-mute">
            Tong Shu {layer.reading.tongshu.hundred}
            {layer.reading.tongshu.mark ? ` · ${layer.reading.tongshu.mark}` : ""} · {layer.reading.tongshu.note}
          </p>
          <p className="text-sm text-mute">
            {layer.reading.zodiac.note} · {layer.reading.tarot.note}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-mute">The cosmos gets a vote. Humans still decide.</p>

      <div className="mt-8">
        <h3 className="text-xs font-semibold tracking-brand text-cream">WHY THIS MOMENT?</h3>
        <ul className="mt-3 space-y-2">
          {bullets.map((line) => (
            <li key={line} className="text-sm text-cream">
              {line}
            </li>
          ))}
        </ul>
        {explanation?.backupLabel ? (
          <p className="mt-3 text-sm text-mute">
            Backup: {explanation.backupLabel}. {explanation.backupReason}
          </p>
        ) : null}
        {stale && onRefreshExplanation ? (
          <button type="button" onClick={onRefreshExplanation} className="press mt-3 min-h-11 text-sm font-semibold text-gold">
            Align the reading
          </button>
        ) : null}
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-semibold tracking-brand text-gold">
          YOUR {count} {count === 1 ? "MOMENT" : "MOMENTS"}
        </h3>
        <ul className="mt-3 space-y-2">
          {scored.map((item) => {
            const picked = item.slot.id === winner.slot.id;
            const total = item.layer.total;
            return (
              <li key={item.slot.id} className={clsx("rounded-xl px-3 py-3", picked ? "bg-ink" : "")}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-cream">{item.slot.label || formatMoment(item.slot.startsAt)}</p>
                  <p className="text-sm font-semibold tabular-nums text-cream">
                    {total == null ? "—" : `${total}%`}
                    {item.layer.mark ? (
                      <span className={clsx("ml-2 font-display", markClass(item.layer.mark))}>{item.layer.mark}</span>
                    ) : null}
                  </p>
                </div>
                <p className="mt-1 text-xs text-mute">
                  People {item.layer.people.waiting ? "—" : pct(item.layer.people.points, 40)} · Moment {pct(item.layer.moment, 30)} · Cosmos{" "}
                  {pct(item.layer.cosmicFit, 30)}
                </p>
                <p className="mt-1 text-sm text-mute">
                  {item.layer.people.waiting
                    ? "No votes on this time yet."
                    : `${item.layer.people.able} / ${item.layer.people.roster} can attend${
                        item.layer.people.love ? ` · ${item.layer.people.love} great` : ""
                      }${item.layer.people.soft ? ` · ${item.layer.people.soft} please no` : ""}`}
                </p>
                {explanation?.lines.find((line) => line.slotId === item.slot.id)?.line ? (
                  <p className="mt-1 text-sm text-cream">{explanation.lines.find((line) => line.slotId === item.slot.id)?.line}</p>
                ) : null}
                {item.slot.votes.length > 0 ? (
                  <p className="mt-1 text-base leading-none" aria-hidden>
                    {faces(item.slot.votes)}
                  </p>
                ) : null}
                <div className="mt-2 space-y-1">
                  <Bar value={item.layer.people.waiting ? 0 : item.layer.people.points} max={40} tone="jade" />
                  <Bar value={item.layer.moment} max={30} tone="cream" />
                  <Bar value={item.layer.cosmicFit} max={30} tone="gold" />
                </div>
                {picked ? <p className="mt-2 text-xs font-semibold text-gold">Kairos pick</p> : null}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 border-t border-line pt-5">
        <p className="text-xs font-semibold tracking-brand text-gold">HOUR NOTE</p>
        <p className="mt-2 font-display text-2xl text-cream">{layer.reading.weather.label}</p>
        <p className="mt-2 text-sm text-cream">{layer.reading.weather.summary}</p>
        <p className="mt-1 text-sm text-gold">{layer.reading.weather.forecast}</p>
        <p className="mt-2 text-xs text-mute">A joke about the shape of the hour. Not a diary, and not anyone’s mood.</p>
      </div>

      {full ? (
        <FullReading
          reading={layer.reading}
          durationMin={durationMin}
          prose={cosmicText}
          pending={cosmicPending}
          missionLabel={missionLabel}
        />
      ) : null}

      <div className="mt-8 space-y-3">
        {followOn ? (
          <a href={followOn.href} className="block rounded-xl bg-ink px-4 py-3 ring-1 ring-line">
            <p className="font-semibold text-cream">{followOn.title}</p>
            <p className="mt-1 text-sm text-mute">{followOn.note}</p>
            <p className="mt-2 text-sm font-semibold text-gold">{followOn.label}</p>
          </a>
        ) : null}
        <button
          type="button"
          onClick={onShare}
          disabled={pending}
          className="press flex h-12 w-full items-center justify-center rounded-xl bg-vermilion font-semibold text-cream disabled:opacity-50"
        >
          Share this moment
        </button>
        {onGoogleCalendar ? (
          <button
            type="button"
            onClick={onGoogleCalendar}
            className="press flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink text-sm font-semibold text-cream ring-1 ring-line"
          >
            <CalendarPlus className="size-4 text-gold" aria-hidden />
            Add to Google Calendar
          </button>
        ) : null}
        {googleNote ? <p className="text-xs text-mute">{googleNote}</p> : null}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={() => {
              setFull(true);
              onFull();
            }}
            className="press min-h-11 text-sm font-semibold text-gold"
          >
            See full cosmic reading
          </button>
          <button type="button" onClick={onCopy} className="press min-h-11 text-sm font-semibold text-cream">
            Copy result
          </button>
          <button type="button" onClick={onInvite} className="press min-h-11 text-sm font-semibold text-cream">
            Create calendar invite
          </button>
          <a className="press inline-flex min-h-11 items-center text-sm font-semibold text-mute" href="#votes">
            Try another time
          </a>
          <a className="press inline-flex min-h-11 items-center text-sm font-semibold text-mute" href="#nickname">
            Reopen voting
          </a>
        </div>
        <p className="text-xs text-mute">The invite is a file for your own calendar. Nobody else is connected.</p>
      </div>
    </section>
  );
}

function FullReading({
  reading,
  durationMin,
  prose,
  pending,
  missionLabel,
}: {
  reading: KairosReading;
  durationMin: number;
  prose: string;
  pending: boolean;
  missionLabel: string;
}) {
  const rows = [
    ["Tong Shu", `${reading.tongshu.hundred} · ${reading.tongshu.note}`, reading.tongshu.detail],
    ["Zodiac", reading.zodiac.note, reading.zodiac.detail],
    ["Tarot", reading.tarot.note, reading.tarot.detail],
    ["Western astrology", reading.astrology.note, reading.astrology.detail],
    ["Numerology", `${reading.numerology.hundred} · ${reading.numerology.note}`, reading.numerology.detail],
  ];
  return (
    <div id="full-reading" className="mt-8 border-t border-line pt-5">
      <h3 className="text-xs font-semibold tracking-brand text-gold">FULL READING</h3>
      <p className="mt-2 text-sm text-mute">
        {missionLabel || MISSION_COPY[reading.mission]} · {durationMin} min. Cosmic blend {reading.blend}%. Playful, not proven.
      </p>
      {pending ? <p className="mt-3 text-sm text-gold">Consulting the universe...</p> : null}
      {prose ? <p className="mt-3 text-sm text-cream">{prose}</p> : null}
      <ul className="mt-4 space-y-3">
        {rows.map(([label, note, detail]) => (
          <li key={label}>
            <p className="text-xs font-semibold tracking-brand text-cream">{label}</p>
            <p className="text-sm text-cream">{note}</p>
            {detail && detail !== note ? <p className="text-sm text-mute">{detail}</p> : null}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-mute">{reading.fit.note}</p>
      <p className="text-sm text-mute">{reading.breathing.note}</p>
      <p className="mt-3 text-sm text-mute">The cosmos gets a vote. Humans still decide.</p>
    </div>
  );
}

export function InviteStage({
  durationMin,
  moments,
  sharedCode,
  copied,
  pending,
  onOpen,
  context = null,
}: {
  durationMin: number;
  moments: { iso: string; reading: KairosReading }[];
  sharedCode: string;
  copied: boolean;
  pending: boolean;
  onOpen: () => void;
  context?: MissionContext | null;
}) {
  return (
    <section id="kairos-result" className="rounded-2xl bg-panel p-5 shadow-card sm:p-7">
      <p className="text-xs font-semibold tracking-brand text-gold">HUMAN PREFERENCE + MOMENT + COSMOS</p>
      <h2 className="mt-2 max-w-xl font-sans text-3xl font-semibold leading-tight text-cream sm:text-4xl">
        Find when everyone can make it, when they actually want to, and whether the universe approves.
      </h2>
      <p className="mt-3 max-w-xl text-sm text-mute">
        Normal tools ask who is free. Kairos asks who wants the hour. Guests vote with a nickname. No login. No calendar.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="border-l-2 border-jade pl-3">
          <p className="text-xs font-semibold tracking-brand text-jade">PEOPLE FIT</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-cream">40%</p>
          <p className="text-sm text-mute">Great, can, please no, cannot.</p>
        </div>
        <div className="border-l-2 border-cream pl-3">
          <p className="text-xs font-semibold tracking-brand text-cream">MOMENT FIT</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-cream">30%</p>
          <p className="text-sm text-mute">Purpose, length, time of day.</p>
        </div>
        <div className="border-l-2 border-gold pl-3">
          <p className="text-xs font-semibold tracking-brand text-gold">COSMIC FIT</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-cream">30%</p>
          <p className="text-sm text-mute">Tong Shu gets a vote. You decide.</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-mute">The cosmos gets a vote. Humans still decide.</p>

      {sharedCode ? (
        <div className="mt-6 rounded-xl bg-ink p-4">
          <p className="text-xs font-semibold tracking-brand text-gold">THE LINK</p>
          <p className="mt-1 font-mono text-2xl tracking-widest text-gold">{sharedCode}</p>
          <p className="mt-2 text-sm text-cream">{copied ? "Link copied." : "Board is open."} Send it. They vote. Then Kairos decides.</p>
          <button
            type="button"
            onClick={onOpen}
            disabled={pending}
            className="press mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-vermilion font-semibold text-cream disabled:opacity-50"
          >
            Open the board
          </button>
        </div>
      ) : null}

      <div className="mt-8">
        <h3 className="text-xs font-semibold tracking-brand text-cream">CONTEXT PREVIEW</h3>
        <p className="mt-2 text-sm text-mute">
          Moment and cosmos only. People fit stays blank until nicknames vote. This is not a Kairos Score.
        </p>
        {moments.length === 0 ? (
          <p className="mt-4 text-sm text-mute">Add two or three times. Kairos will not invent a winner from an empty list.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {moments.map((moment) => {
              const base = momentPoints(moment.reading.real);
              const adjusted = applyMomentContext(base, moment.reading, durationMin, moment.iso, context);
              const momentFit = adjusted.moment;
              const cosmicFit = cosmicPoints(moment.reading.cosmic);
              return (
                <li key={moment.iso} className="rounded-xl bg-ink px-3 py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-cream">{formatMoment(moment.iso)}</p>
                    <p className="text-xs text-mute">{durationMin} min</p>
                  </div>
                  <p className="mt-1 text-sm text-mute">{moment.reading.fit.note}</p>
                  {adjusted.notes[0] ? <p className="text-sm text-mute">{adjusted.notes[0]}</p> : null}
                  <p className="mt-2 text-xs text-mute">
                    Moment {pct(momentFit, 30)} · Cosmos {pct(cosmicFit, 30)} · People waiting
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Bar value={momentFit} max={30} tone="cream" />
                    <Bar value={cosmicFit} max={30} tone="gold" />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
