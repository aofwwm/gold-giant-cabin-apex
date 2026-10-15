import { KairosVoice, type VoiceMode } from "@/components/kairos-voice";
import type { BriefChip, PlanningMode } from "@/lib/planning-brief";

const VOICE: Record<PlanningMode, { mode: VoiceMode; label?: string }> = {
  dating: { mode: "dating" },
  travel: { mode: "travel", label: "Kairos · Away" },
  family: { mode: "family" },
  team_out: { mode: "out" },
};

export function PlanningBrief({
  mode,
  kicker,
  question,
  hint,
  placeholder,
  value,
  onChange,
  onUnderstand,
  reading,
  failed,
  chips,
  onRemove,
  aside,
  conflicts,
  onKeep,
  onUse,
}: {
  mode: PlanningMode;
  kicker: string;
  question: string;
  hint: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onUnderstand: () => void;
  reading: boolean;
  failed: boolean;
  chips: BriefChip[];
  onRemove: (chip: BriefChip) => void;
  aside: string;
  conflicts?: { key: string; suggested: string; current: string }[];
  onKeep?: (key: string) => void;
  onUse?: (key: string) => void;
}) {
  const voice = VOICE[mode];
  return (
    <div>
      <p className="text-xs font-semibold tracking-brand text-accent">{kicker}</p>
      <h2 className="mt-1 font-display text-2xl text-cream">{question}</h2>
      <p className="mt-2 text-sm text-mute">{hint}</p>
      <textarea
        value={value}
        rows={4}
        maxLength={500}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            onUnderstand();
          }
        }}
        className="mt-4 w-full rounded-xl bg-ink px-3 py-3 text-base text-cream ring-1 ring-line outline-none placeholder:text-mute"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-sm text-mute">{reading ? "Understanding your brief…" : "Kairos reads this, then the form follows."}</p>
        <button type="button" onClick={onUnderstand} className="press min-h-11 shrink-0 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Understand my brief</button>
      </div>
      {failed ? <p className="mt-2 text-sm text-cream">Couldn’t fully understand that brief.</p> : null}
      {chips.length ? (
        <div className="mt-3">
          <p className="text-xs font-semibold tracking-brand text-accent">KAIROS UNDERSTOOD</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button key={chip.id} type="button" onClick={() => onRemove(chip)} className="press min-h-11 rounded-xl bg-ink px-3 text-sm capitalize text-cream ring-1 ring-accent">
                {chip.label} <span className="text-mute">×</span>
              </button>
            ))}
          </div>
          {conflicts?.map((conflict) => (
            <p key={conflict.key} className="mt-2 text-sm text-cream">
              Your brief suggests {conflict.suggested}, but you selected {conflict.current}.
              <button type="button" onClick={() => onKeep?.(conflict.key)} className="ml-2 font-semibold text-accent">Keep {conflict.current}</button>
              <button type="button" onClick={() => onUse?.(conflict.key)} className="ml-2 font-semibold text-accent">Use brief</button>
            </p>
          ))}
          {aside ? (
            <div className="mt-3">
              <KairosVoice mode={voice.mode} label={voice.label} text={aside} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
