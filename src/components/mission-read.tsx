import { Clock, Flame, Sun, Target } from "lucide-react";
import { clsx } from "clsx";
import { MEETING_TYPES, TYPE_LABEL, type Lean, type MeetingType, type MissionContext, type Stakes } from "@/lib/mission";
import { KairosVoice } from "@/components/kairos-voice";

const STAKES: Stakes[] = ["low", "medium", "high"];
const LEANS: Lean[] = ["positive", "neutral", "negative"];
const LENGTHS = [30, 45, 60, 90, 120] as const;

export function MissionRead({
  title,
  reading,
  editing,
  pending,
  onRead,
  onEdit,
  onCloseEdit,
  onChange,
  onUseDuration,
}: {
  title: string;
  reading: MissionContext | null;
  editing: boolean;
  pending: boolean;
  onRead: () => void;
  onEdit: () => void;
  onCloseEdit: () => void;
  onChange: (next: MissionContext) => void;
  onUseDuration: (minutes: (typeof LENGTHS)[number]) => void;
}) {
  const ready = title.trim().length >= 2;
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onRead}
        disabled={!ready || pending}
        className="press min-h-11 text-sm font-semibold text-gold disabled:opacity-40"
      >
        {pending ? "Kairos is reading the room..." : reading ? "Read the room again" : "Read the room"}
      </button>
      {reading ? (
        <div className="mt-3 rounded-xl bg-ink p-3 ring-1 ring-line">
          <p className="text-xs font-semibold tracking-brand text-gold">KAIROS UNDERSTANDS</p>
          <p className="mt-2 text-sm text-mute">You said: {title.trim()}</p>
          {editing ? (
            <div className="mt-3 space-y-3">
              <label className="block text-sm text-cream">
                Type
                <select
                  className="mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
                  value={reading.meeting_type}
                  onChange={(event) => onChange({ ...reading, meeting_type: event.target.value as MeetingType })}
                >
                  {MEETING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {TYPE_LABEL[type]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-cream">
                Stakes
                <select
                  className="mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
                  value={reading.stakes}
                  onChange={(event) => onChange({ ...reading, stakes: event.target.value as Stakes })}
                >
                  {STAKES.map((stakes) => (
                    <option key={stakes} value={stakes}>
                      {stakes}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-cream">
                Goal
                <input
                  value={reading.meeting_goal}
                  maxLength={140}
                  onChange={(event) => onChange({ ...reading, meeting_goal: event.target.value })}
                  className="mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
                />
              </label>
              <label className="block text-sm text-cream">
                Tone
                <input
                  value={reading.tone}
                  maxLength={40}
                  onChange={(event) => onChange({ ...reading, tone: event.target.value })}
                  className="mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
                />
              </label>
              <label className="block text-sm text-cream">
                Practical conditions, one per line
                <textarea
                  value={reading.preferred_conditions.join("\n")}
                  maxLength={240}
                  rows={3}
                  onChange={(event) =>
                    onChange({
                      ...reading,
                      preferred_conditions: event.target.value
                        .split("\n")
                        .slice(0, 4)
                        .map((line) => line.slice(0, 80)),
                    })
                  }
                  className="mt-1 w-full rounded-xl bg-panel px-3 py-2 text-cream ring-1 ring-line"
                />
              </label>
              <label className="block text-sm text-cream">
                Summary
                <textarea
                  value={reading.summary}
                  maxLength={220}
                  rows={3}
                  onChange={(event) => onChange({ ...reading, summary: event.target.value })}
                  className="mt-1 w-full rounded-xl bg-panel px-3 py-2 text-cream ring-1 ring-line"
                />
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["morning", "afternoon", "late_day"] as const).map((band) => (
                  <label key={band} className="text-xs text-mute">
                    {band === "late_day" ? "Late day" : band}
                    <select
                      className="mt-1 h-11 w-full rounded-xl bg-panel px-2 text-sm text-cream ring-1 ring-line"
                      value={reading.time_preferences[band]}
                      onChange={(event) =>
                        onChange({
                          ...reading,
                          time_preferences: { ...reading.time_preferences, [band]: event.target.value as Lean },
                        })
                      }
                    >
                      {LEANS.map((lean) => (
                        <option key={lean} value={lean}>
                          {lean}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <button type="button" onClick={onCloseEdit} className="press min-h-11 text-sm font-semibold text-cream">
                Looks right
              </button>
            </div>
          ) : (
            <>
              <ul className="mt-3 space-y-2 text-sm text-cream">
                <li className="flex items-center gap-2">
                  <Target className="size-4 text-gold" aria-hidden />
                  {TYPE_LABEL[reading.meeting_type]} · {reading.tone}
                </li>
                <li className="flex items-center gap-2">
                  <Flame className={clsx("size-4", reading.stakes === "high" ? "text-vermilion" : "text-gold")} aria-hidden />
                  {reading.stakes === "high" ? "High stakes" : reading.stakes === "medium" ? "Medium stakes" : "Low stakes"}
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="size-4 text-cream" aria-hidden />
                  Recommend {reading.suggested_duration_minutes} min
                </li>
                <li className="flex items-center gap-2">
                  <Sun className="size-4 text-gold" aria-hidden />
                  {reading.preferred_conditions[0] ?? "A workable hour"}
                </li>
              </ul>
              <KairosVoice mode="meet" text={reading.summary} status={reading.stakes === "high" ? "warning" : "neutral"} />
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                <button type="button" onClick={onCloseEdit} className="press min-h-11 text-sm font-semibold text-cream">
                  Looks right
                </button>
                <button type="button" onClick={onEdit} className="press min-h-11 text-sm font-semibold text-gold">
                  Edit
                </button>
                {reading.suggested_duration_minutes !== undefined ? (
                  <button
                    type="button"
                    onClick={() => onUseDuration(reading.suggested_duration_minutes)}
                    className="press min-h-11 text-sm font-semibold text-mute"
                  >
                    Use {reading.suggested_duration_minutes} min
                  </button>
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="mt-2 text-xs text-mute">
          A first reading from the words you used. Read the room if you want Kairos to refine it. The score still comes from the rules.
        </p>
      )}
    </div>
  );
}
