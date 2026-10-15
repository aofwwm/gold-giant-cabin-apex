import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { clsx } from "clsx";
import { toast } from "sonner";
import { InviteStage } from "@/components/kairos-board";
import { MissionRead } from "@/components/mission-read";
import { Frame, Seal, fieldClass } from "@/components/kairos-ui";
import { HashStudio } from "@/components/hash-studio";
import { KairosNav } from "@/components/kairos-nav";
import { MakanStudio } from "@/components/makan-studio";
import { OutStudio } from "@/components/out-studio";
import { FamilyStudio } from "@/components/family-studio";
import { DatingStudio } from "@/components/dating-studio";
import { TodayStudio } from "@/components/today-studio";
import { TravelStudio } from "@/components/travel-studio";
import { OracleStudio } from "@/components/oracle-studio";
import { createEvent } from "@/lib/kairos.functions";
import { resolveJoinCode } from "@/lib/hash.functions";
import { isKairosMode, type KairosMode } from "@/lib/kairos-modes";
import { analyzeMission, saveMission } from "@/lib/kairos.intelligence";
import { inferMission, missionSchema, type MissionContext } from "@/lib/mission";
import type { Kind } from "@/lib/kairos.types";
import { readReading } from "@/lib/reading";
import { localSgtToIso, suggestMeetingSlots } from "@/lib/time";
import { pinMeet } from "@/lib/today-store";
import { cleanMeetingUrl, type MakanWhen, type MeetingFormat, type MeetingPlatform } from "@/lib/place";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { mode: KairosMode; code: string } => ({
    mode: isKairosMode(search.mode) ? search.mode : "meet",
    code: typeof search.code === "string" ? search.code.replace(/[^a-zA-Z0-9]/g, "").slice(0, 32) : "",
  }),
  component: Home,
});

const DURATIONS = [30, 45, 60, 90, 120] as const;
type Duration = (typeof DURATIONS)[number];

const PRESETS = ["Budget pitch to boss", "Vendor technical sync", "Difficult 1:1", "Friday makan", "Team bonding"] as const;

type Recent = { code: string; title: string; kind: Kind };

function loadRecent(): Recent[] {
  try {
    const raw = JSON.parse(localStorage.getItem("kairos-recent") ?? "[]") as Recent[];
    if (!Array.isArray(raw)) return [];
    return raw.filter((item) => item && typeof item.code === "string" && typeof item.title === "string").slice(0, 6);
  } catch {
    return [];
  }
}

function remember(item: Recent) {
  const next = [item, ...loadRecent().filter((entry) => entry.code !== item.code)].slice(0, 6);
  localStorage.setItem("kairos-recent", JSON.stringify(next));
}

function forgetRecent(code: string): Recent[] {
  const next = loadRecent().filter((entry) => entry.code !== code);
  localStorage.setItem("kairos-recent", JSON.stringify(next));
  return next;
}

function Home() {
  const { mode, code } = Route.useSearch();
  const navigate = useNavigate();
  const kind: Kind = "meeting";
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState<Duration>(60);
  const [slots, setSlots] = useState<string[]>(() => suggestMeetingSlots());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [recent, setRecent] = useState<Recent[]>([]);
  const [shared, setShared] = useState<{ code: string; key: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [mission, setMission] = useState<MissionContext | null>(null);
  const [missionSource, setMissionSource] = useState<"grok" | "rules">("rules");
  const [missionTitle, setMissionTitle] = useState("");
  const [readingRoom, setReadingRoom] = useState(false);
  const [editingMission, setEditingMission] = useState(false);
  const [format, setFormat] = useState<MeetingFormat>("physical");
  const [venueName, setVenueName] = useState("");
  const [room, setRoom] = useState("");
  const [address, setAddress] = useState("");
  const [platform, setPlatform] = useState<MeetingPlatform>("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [makanWhen, setMakanWhen] = useState<MakanWhen>("");
  const missionLock = useRef("");
  const missionFlight = useRef("");

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  useEffect(() => {
    const line = title.trim();
    const lock = `${kind}|${line}`;
    if (line.length < 2 || editingMission) return;
    if (missionLock.current === `grok|${lock}` || missionLock.current === `edit|${lock}`) return;
    setMission(inferMission(line, kind, duration));
    setMissionSource("rules");
    setMissionTitle(line);
  }, [title, kind, duration, editingMission]);

  const moments = useMemo(() => {
    const times = slots;
    const unique = [...new Set(times.filter(Boolean))];
    const next: { local: string; iso: string; reading: ReturnType<typeof readReading> }[] = [];
    for (const local of unique) {
      try {
        const iso = localSgtToIso(local);
        next.push({
          local,
          iso,
          reading: readReading(iso, title.trim() || "Untitled gathering", {
            kind,
            durationMin: duration,
          }),
        });
      } catch {
        // Incomplete datetime values are skipped until they parse.
      }
    }
    return next;
  }, [kind, slots, title, duration]);

  const draftKey = JSON.stringify({
    title: title.trim(),
    kind,
    duration,
    format,
    venueName,
    room,
    address,
    platform,
    meetingUrl,
    makanWhen,
    times: moments.map((moment) => moment.local),
  });

  useEffect(() => {
    setShared((current) => (current && current.key !== draftKey ? null : current));
  }, [draftKey]);

  function validate(): string {
    if (title.trim().length < 2) return "Name the mission first.";
    if (moments.length === 0) return "Add at least one time.";
    if ((format === "online" || format === "hybrid") && meetingUrl.trim() && !cleanMeetingUrl(meetingUrl)) {
      return "The meeting link needs to be a web address.";
    }
    return "";
  }

  function missionForShare(): { mission: MissionContext; source: "grok" | "rules" } | null {
    const line = title.trim();
    const context = mission && missionTitle === line ? mission : inferMission(line, kind, duration);
    const parsed = missionSchema.safeParse({
      ...context,
      preferred_conditions: context.preferred_conditions.map((item) => item.trim()).filter((item) => item.length > 1).slice(0, 4),
    });
    if (!parsed.success) return null;
    return { mission: parsed.data, source: mission && missionTitle === line ? missionSource : "rules" };
  }

  async function persistMission(code: string) {
    const packed = missionForShare();
    if (!packed) return;
    try {
      await saveMission({ data: { code, mission: packed.mission, source: packed.source } });
    } catch {
      // The board still opens. Moment fit just stays on the hour rules.
    }
  }

  async function ensureBoard(): Promise<string> {
    if (shared && shared.key === draftKey) {
      await persistMission(shared.code);
      return shared.code;
    }
    const packed = missionForShare();
    const created = await createEvent({
      data: {
        title: title.trim(),
        kind,
        durationMin: duration,
        category: "",
        anchorAt: "",
        slots: moments.map((moment) => ({ startsAt: moment.local })),
        mission: packed?.mission,
        missionSource: packed?.source ?? "rules",
        place: {
          format,
          venueName: venueName.trim(),
          room: room.trim(),
          address: address.trim(),
          platform,
          meetingUrl: cleanMeetingUrl(meetingUrl),
          makanWhen,
        },
      },
    });
    remember({ code: created.code, title: title.trim(), kind });
    pinMeet({
      code: created.code,
      title: title.trim(),
      durationMin: duration,
      format,
      venue: venueName.trim(),
      address: address.trim(),
      slots: moments.map((moment) => moment.local),
    });
    setRecent(loadRecent());
    setShared({ code: created.code, key: draftKey });
    return created.code;
  }

  async function onShare(event?: FormEvent) {
    event?.preventDefault();
    const problem = validate();
    setError(problem);
    if (problem) return;
    setPending(true);
    try {
      const code = await ensureBoard();
      const url = `${window.location.origin}/meet/${code}`;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied");
      } catch {
        setCopied(false);
        toast.message("Board is open. Copy the code if the link did not.");
      }
      if (window.innerWidth < 1024) {
        document.getElementById("kairos-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the board");
    } finally {
      setPending(false);
    }
  }

  async function onPoll() {
    const problem = validate();
    setError(problem);
    if (problem) return;
    setPending(true);
    try {
      const code = await ensureBoard();
      await navigate({ to: "/meet/$code", params: { code } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the board");
      setPending(false);
    }
  }

  async function onJoin(event: FormEvent) {
    event.preventDefault();
    const next = joinCode.replace(/[^a-zA-Z0-9]/g, "");
    if (next.length < 4) {
      setError("Codes look like k7m2qx.");
      return;
    }
    const stored = localStorage.getItem(`kairos-hash-me-${next}`);
    const participantToken = stored && /^[a-zA-Z0-9]{24,80}$/.test(stored) ? stored : crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(`kairos-hash-me-${next}`, participantToken);
    try {
      const found = await resolveJoinCode({ data: { code: next, participantToken } });
      if (found.kind === "hash") {
        await navigate({ to: "/", search: { mode: "hash", code: next } });
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code did not open");
      return;
    }
    void navigate({ to: "/meet/$code", params: { code: next.toLowerCase() } });
  }

  async function readRoom(force = false) {
    const line = title.trim();
    if (line.length < 2 || readingRoom) return;
    const lock = `${kind}|${line}`;
    if (!force && missionLock.current === `grok|${lock}`) return;
    if (missionFlight.current === lock) return;
    missionFlight.current = lock;
    setReadingRoom(true);
    try {
      const result = await analyzeMission({ data: { title: line, kind, durationMin: duration } });
      if (title.trim() !== line) return;
      setMission(result.context);
      setMissionSource(result.source);
      setMissionTitle(line);
      setEditingMission(false);
      missionLock.current = result.source === "grok" ? `grok|${lock}` : "";
      if (shared) {
        try {
          await saveMission({ data: { code: shared.code, mission: result.context, source: result.source } });
        } catch {
          // Sharing already worked.
        }
      }
    } catch {
      const fallback = inferMission(line, kind, duration);
      setMission(fallback);
      setMissionSource("rules");
      setMissionTitle(line);
    } finally {
      if (missionFlight.current === lock) missionFlight.current = "";
      setReadingRoom(false);
    }
  }

  return (
    <Frame>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="rise flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-start gap-4">
            <Seal />
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-brand text-gold">GOOD TIMES</p>
              <h1 className="mt-1 font-sans text-4xl font-semibold leading-none tracking-brand sm:text-5xl">KAIROS</h1>
              <p className="mt-2 font-display text-2xl text-vermilion">良辰吉日</p>
            </div>
          </div>
          <form onSubmit={onJoin} className="flex w-full gap-2 sm:w-72">
            <label className="sr-only" htmlFor="join-code">
              Event code
            </label>
            <input
              id="join-code"
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value)}
              placeholder="Have a code?"
              autoCapitalize="none"
              autoCorrect="off"
              className={fieldClass}
            />
            <button type="submit" className="press h-12 shrink-0 rounded-xl bg-panel px-4 font-semibold text-cream ring-1 ring-line">
              Join
            </button>
          </form>
        </header>
        <div data-mode={mode === "family" || mode === "dating" || mode === "today" || mode === "travel" || mode === "oracle" ? mode : "work"}>
        <p className="rise rise-2 mt-5 max-w-2xl text-base text-mute">
          Find the right time. The right place. And what to do next.
        </p>
        <div className="mt-4">
          <KairosNav active={mode} code={code} />
        </div>
        {recent.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold tracking-brand text-mute">RECENT</p>
            {recent.map((item) => (
              <div key={item.code} className="inline-flex min-h-9 max-w-full items-center rounded-full bg-panel ring-1 ring-line">
                <Link
                  to="/meet/$code"
                  params={{ code: item.code }}
                  className="press inline-flex min-h-9 min-w-0 items-center gap-2 rounded-full py-1 pl-3 pr-1 text-sm text-cream"
                >
                  <span className="truncate">{item.title}</span>
                  <span className="font-mono text-xs tracking-widest text-gold">{item.code}</span>
                </Link>
                <button
                  type="button"
                  aria-label={`Remove ${item.title}`}
                  onClick={() => setRecent(forgetRecent(item.code))}
                  className="press mr-1 grid size-8 shrink-0 place-items-center rounded-full text-mute"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div key={mode} className="mode-swap mt-8 grid items-start gap-8 lg:grid-cols-5">
          {mode === "today" ? (
            <TodayStudio />
          ) : mode === "makan" ? (
            <MakanStudio code={code} />
          ) : mode === "out" ? (
            <OutStudio />
          ) : mode === "family" ? (
            <FamilyStudio />
          ) : mode === "dating" ? (
            <DatingStudio />
          ) : mode === "travel" ? (
            <div className="lg:col-span-5">
              <TravelStudio />
            </div>
          ) : mode === "oracle" ? (
            <OracleStudio />
          ) : mode === "hash" ? (
            <HashStudio code={code} />
          ) : (
            <>
          <form id="mission" onSubmit={(event) => void onShare(event)} className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-brand text-gold">1 · SET THE MISSION</p>
            <h2 className="mt-1 font-display text-2xl text-cream">What are you trying to land?</h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((preset) => {
                const selected = title === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setTitle(preset);
                      if (preset === "Friday makan") setDuration(90);
                    }}
                    className={clsx(
                      "press min-h-9 rounded-full px-3 text-sm",
                      selected ? "bg-vermilion font-semibold text-cream" : "bg-panel text-cream ring-1 ring-line",
                    )}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>

            <label className="mt-4 block text-sm font-medium text-cream" htmlFor="event-title">
              Mission
            </label>
            <input
              id="event-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={() => {
                if (title.trim().length >= 24) void readRoom();
              }}
              maxLength={180}
              placeholder="Need to ask Director for additional project funding"
              className={clsx(fieldClass, "mt-2")}
            />
            <MissionRead
              title={title}
              reading={mission && missionTitle === title.trim() ? mission : null}
              editing={editingMission}
              pending={readingRoom}
              onRead={() => void readRoom(true)}
              onEdit={() => setEditingMission(true)}
              onCloseEdit={() => {
                setEditingMission(false);
                if (shared) void persistMission(shared.code);
              }}
              onChange={(next) => {
                missionLock.current = `edit|${kind}|${title.trim()}`;
                setMission(next);
                setMissionSource("rules");
                setMissionTitle(title.trim());
              }}
              onUseDuration={(minutes) => setDuration(minutes)}
            />

            <p className="mt-4 text-sm font-medium text-cream">How long</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DURATIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={duration === value}
                  onClick={() => setDuration(value)}
                  className={clsx(
                    "press min-h-11 min-w-14 rounded-xl px-3 text-sm font-semibold tabular-nums",
                    duration === value ? "bg-gold text-ink" : "bg-panel text-cream ring-1 ring-line",
                  )}
                >
                  {value}m
                </button>
              ))}
            </div>

            <div className="mt-4" id="times">
                <p className="text-xs font-semibold tracking-brand text-gold">2 · POSSIBLE MOMENTS</p>
                <p className="mt-1 text-sm font-medium text-cream">Two to five times, Singapore</p>
                <div className="mt-2 space-y-2">
                  {(slots.length ? slots : ["", "", ""]).map((slot, index) => (
                    <div key={index} className="flex gap-2">
                      <label className="sr-only" htmlFor={`slot-${index}`}>
                        Time {index + 1}
                      </label>
                      <input
                        id={`slot-${index}`}
                        type="datetime-local"
                        value={slot}
                        onChange={(event) =>
                          setSlots((prev) => prev.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))
                        }
                        className={fieldClass}
                      />
                      <button
                        type="button"
                        aria-label={`Remove time ${index + 1}`}
                        disabled={slots.length <= 1}
                        onClick={() => setSlots((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}
                        className="press grid size-12 shrink-0 place-items-center rounded-xl bg-panel text-cream ring-1 ring-line disabled:opacity-40"
                      >
                        <Minus className="size-4" aria-hidden />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={slots.length >= 6}
                  onClick={() =>
                    setSlots((prev) => {
                      if (prev.length >= 6) return prev;
                      const next = suggestMeetingSlots().find((slot) => !prev.includes(slot)) ?? prev[prev.length - 1] ?? "";
                      return [...prev, next];
                    })
                  }
                  className="press mt-2 flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-gold disabled:opacity-40"
                >
                  <Plus className="size-4" aria-hidden />
                  Add a time
                </button>
              </div>

            <p className="mt-4 text-sm font-medium text-cream">Where</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["physical", "Physical"],
                  ["online", "Online"],
                  ["hybrid", "Hybrid"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={format === value}
                  onClick={() => setFormat(value)}
                  className={clsx(
                    "press min-h-11 rounded-xl px-3 text-sm font-semibold",
                    format === value ? "bg-gold text-ink" : "bg-panel text-cream ring-1 ring-line",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {format !== "online" ? (
              <div className="mt-3 space-y-2">
                <input value={venueName} onChange={(event) => setVenueName(event.target.value)} placeholder="Venue or office" maxLength={80} className={fieldClass} />
                <input value={room} onChange={(event) => setRoom(event.target.value)} placeholder="Level, room" maxLength={80} className={fieldClass} />
                <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street address" maxLength={160} className={fieldClass} />
              </div>
            ) : null}
            {format !== "physical" ? (
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["teams", "Teams"],
                      ["zoom", "Zoom"],
                      ["skype", "Skype"],
                      ["meet", "Google Meet"],
                      ["webex", "Webex"],
                      ["other", "Other"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={platform === value}
                      onClick={() => setPlatform(value)}
                      className={clsx(
                        "press min-h-11 rounded-xl px-3 text-sm font-semibold",
                        platform === value ? "bg-jade text-ink" : "bg-panel text-cream ring-1 ring-line",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  value={meetingUrl}
                  onChange={(event) => setMeetingUrl(event.target.value)}
                  placeholder="https://teams.microsoft.com/..."
                  inputMode="url"
                  className={fieldClass}
                />
              </div>
            ) : null}
            <p className="mt-4 text-sm font-medium text-cream">Add makan?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["before", "Before"],
                  ["after", "After"],
                  ["", "Not now"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={makanWhen === value}
                  onClick={() => setMakanWhen(value)}
                  className={clsx(
                    "press min-h-11 rounded-xl px-3 text-sm font-semibold",
                    makanWhen === value ? "bg-vermilion text-cream" : "bg-panel text-cream ring-1 ring-line",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-mute">
              {makanWhen ? "After the board is shared, Kairos carries this place and time into Makan." : "Before or after the meeting. Not another mode."}
            </p>
            {shared && makanWhen ? (
              <Link to="/" search={{ mode: "makan", code: shared.code }} className="mt-3 inline-flex text-sm font-semibold text-gold">
                Find makan nearby
              </Link>
            ) : null}

            {error ? (
              <p role="alert" className="mt-4 text-sm text-vermilion">
                {error}
              </p>
            ) : null}

            <p className="mt-6 text-xs font-semibold tracking-brand text-gold">3 · INVITE THE PEOPLE</p>
            <button
              type="submit"
              disabled={pending}
              className="press mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-vermilion text-base font-semibold text-cream disabled:opacity-50"
            >
              {pending ? "Opening the board…" : "Share the moments"}
            </button>
            <p className="mt-3 text-center text-xs text-mute">Guests vote with a nickname. No login. No calendar access.</p>
          </form>

          <div className="lg:col-span-3">
            <InviteStage
              durationMin={duration}
              moments={moments.map((moment) => ({ iso: moment.iso, reading: moment.reading }))}
              sharedCode={shared?.code ?? ""}
              copied={copied}
              pending={pending}
              onOpen={() => void onPoll()}
              context={mission && missionTitle === title.trim() ? mission : null}
            />
          </div>
            </>
          )}
        </div>

        {mode === "meet" ? (
        <section className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
          {[
            ["1", "Pick the moments", "Offer a few possible times. Not a whole empty week."],
            ["2", "Let people vote", "Not just whether they can make it. How much they actually want the slot."],
            ["3", "Let Kairos decide", "Human preference, meeting context, and a little cosmic luck."],
          ].map(([step, heading, copy]) => (
            <div key={step}>
              <p className="font-display text-2xl text-gold">{step}</p>
              <h2 className="mt-1 flex items-center gap-2 font-semibold text-cream">
                {heading}
                {step === "3" ? <Sparkles className="size-4 text-gold" aria-hidden /> : null}
              </h2>
              <p className="mt-1 text-sm text-mute">{copy}</p>
            </div>
          ))}
        </section>
        ) : null}
        </div>
      </div>
    </Frame>
  );
}
