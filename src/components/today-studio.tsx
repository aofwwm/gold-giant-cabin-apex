import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { KairosVoice } from "@/components/kairos-voice";
import { ExternalActions } from "@/components/external-actions";
import { clockLabel } from "@/lib/family-day";
import { explainToday, parseToday, todayRoutes, todayWeather } from "@/lib/today.functions";
import { addCalendarDays, sgtNow } from "@/lib/time";
import { lookupPlace } from "@/lib/geo.functions";
import { itemsFromTravel } from "@/lib/travel";
import { readConfirmedDating } from "@/lib/dating-invite";
import {
  activeItems,
  confirmedInviteItem,
  dayAside,
  findConflicts,
  freeWindows,
  itemsForDate,
  itemsFromDating,
  itemsFromFamily,
  itemsFromMeets,
  leaveBy,
  located,
  repeatLabel,
  replanDay,
  travelPairs,
  type DayConflict,
  type FreeWindow,
  type TodayItem,
  type TodayKind,
  type TodayPlace,
  type TravelLeg,
} from "@/lib/today";
import { blankItem, readJson, readMeetPins, readTodayItems, writeTodayItems } from "@/lib/today-store";

const KIND: Record<TodayKind, string> = {
  meet: "Meet",
  makan: "Makan",
  out: "Team Out",
  family: "Family",
  date: "Date",
  task: "Task",
  errand: "Errand",
  appointment: "Appointment",
  personal: "Personal",
  travel: "Travel",
};

function isoDate(offset = 0): string {
  const now = sgtNow();
  const day = addCalendarDays(now.y, now.m, now.d, offset);
  return `${day.y}-${String(day.m).padStart(2, "0")}-${String(day.d).padStart(2, "0")}`;
}

function shift(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const next = addCalendarDays(year ?? 2026, month ?? 1, day ?? 1, days);
  return `${next.y}-${String(next.m).padStart(2, "0")}-${String(next.d).padStart(2, "0")}`;
}

function heading(date: string): { greet: string; weekday: string; rest: string } {
  const now = sgtNow();
  const minutes = now.hour * 60 + now.minute;
  const greet = date !== isoDate() ? "The day" : minutes < 12 * 60 ? "Good morning" : minutes < 17 * 60 ? "Good afternoon" : "Good evening";
  const label = new Intl.DateTimeFormat("en-SG", { timeZone: "Asia/Singapore", weekday: "long", day: "numeric", month: "long" }).format(new Date(`${date}T12:00:00+08:00`));
  const [weekday, ...rest] = label.split(" ");
  return { greet, weekday: weekday?.replace(",", "") ?? "", rest: rest.join(" ") };
}

export function TodayStudio() {
  const [date, setDate] = useState(isoDate);
  const [manual, setManual] = useState<TodayItem[]>([]);
  const [locks, setLocks] = useState<Record<string, boolean>>({});
  const [legs, setLegs] = useState<TravelLeg[]>([]);
  const [weather, setWeather] = useState<string>("");
  const [weatherState, setWeatherState] = useState<"loading" | "ready" | "none">("loading");
  const [outdoorLater, setOutdoorLater] = useState(true);
  const [voice, setVoice] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [parsed, setParsed] = useState<TodayItem | null>(null);
  const [windowUse, setWindowUse] = useState<FreeWindow | null>(null);
  const [proposal, setProposal] = useState<TodayItem[] | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const [routing, setRouting] = useState(false);
  const [ignored, setIgnored] = useState<string[]>([]);

  useEffect(() => {
    setManual(readTodayItems());
    try {
      const raw = JSON.parse(localStorage.getItem("kairos-today-locks") ?? "{}") as Record<string, boolean>;
      if (raw && typeof raw === "object") setLocks(raw);
    } catch {
      setLocks({});
    }
  }, []);

  const items = useMemo(() => {
    const family = itemsFromFamily(date, readJson("kairos-family-plan"));
    const savedPlan = readJson("kairos-dating-plan");
    const agreed = readConfirmedDating(date);
    const planCovers = Boolean(savedPlan && typeof savedPlan === "object" && (savedPlan as { date?: string }).date === date);
    const datingSource = planCovers ? { ...(savedPlan as object), confirmed: Boolean(agreed) } : savedPlan;
    const dating = itemsFromDating(date, datingSource);
    const agreedItem = dating.length || !agreed ? [] : [confirmedInviteItem(date, agreed)];
    const meets = itemsFromMeets(date, readMeetPins());
    const travel = itemsFromTravel(date, readJson("kairos-travel-plan"));
    return activeItems([...itemsForDate(manual, date), ...family, ...dating, ...agreedItem, ...meets, ...travel]).map((item) =>
      locks[item.id] == null ? item : { ...item, locked: locks[item.id] ?? item.locked, flexible: !(locks[item.id] ?? item.locked) },
    );
  }, [date, manual, locks]);

  const routeKey = travelPairs(items).map((pair) => pair.key).join(";");

  useEffect(() => {
    const pairs = travelPairs(items).map((pair) => ({ key: pair.key, from: pair.from, to: pair.to }));
    if (!pairs.length) {
      setLegs([]);
      return;
    }
    let cancel = false;
    setRouting(true);
    void todayRoutes({ data: { pairs } })
      .then((result) => {
        if (!cancel) setLegs(result.map((leg) => ({ ...leg, fromId: leg.key.split("|")[0] ?? "", toId: leg.key.split("|")[2] ?? "" })));
      })
      .catch(() => {
        if (!cancel) setLegs([]);
      })
      .finally(() => {
        if (!cancel) setRouting(false);
      });
    return () => {
      cancel = true;
    };
  }, [routeKey]);

  useEffect(() => {
    let cancel = false;
    setWeatherState("loading");
    void todayWeather({ data: { date, latitude: 1.3521, longitude: 103.8198 } })
      .then((result) => {
        if (cancel) return;
        if (!result) {
          setWeather("");
          setWeatherState("none");
          return;
        }
        setWeather(result.summary);
        setOutdoorLater(result.afternoonOutdoor);
        setWeatherState("ready");
      })
      .catch(() => {
        if (!cancel) setWeatherState("none");
      });
    return () => {
      cancel = true;
    };
  }, [date]);

  const windows = freeWindows(items, legs);
  const conflicts = findConflicts(items, legs).filter((item) => !ignored.includes(item.id));
  const tasks = items.filter((item) => item.kind === "task" || item.kind === "errand");
  const plans = items.filter((item) => item.kind !== "task" && item.kind !== "errand");
  const aside = dayAside({
    plans: plans.length,
    tasks: tasks.filter((item) => item.status !== "completed").length,
    windows,
    conflicts,
    tight: !outdoorLater && items.some((item) => item.outdoor) ? "Rain is in the forecast. Keep the outdoor plan earlier." : undefined,
  });

  useEffect(() => {
    const facts = JSON.stringify({
      plans: plans.map((item) => item.title),
      tasks: tasks.filter((item) => item.status !== "completed").map((item) => item.title),
      conflicts: conflicts.map((item) => item.text),
      free: windows.map((item) => clockLabel(item.startMin)),
      weather: weather || "unavailable",
    });
    let cancel = false;
    void explainToday({ data: { facts } })
      .then((line) => {
        if (!cancel && line) setVoice(line);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [date, items.map((item) => item.id).join(","), conflicts.length, weather]);

  function saveManual(next: TodayItem[]) {
    setManual(next);
    writeTodayItems(next);
  }

  function commit(item: TodayItem) {
    saveManual([item, ...manual.filter((entry) => entry.id !== item.id)]);
    setAdding(false);
    setParsed(null);
    setDraft("");
    setWindowUse(null);
  }

  async function readDraft() {
    const text = draft.trim();
    if (text.length < 2) return;
    const result = await parseToday({ data: { text, date } }).catch(() => null);
    const start = result?.startMin ?? result?.deadlineMin ?? 16 * 60;
    const duration = result?.duration ?? 30;
    const item = blankItem(result?.date || date, result?.kind ?? "task");
    item.title = result?.title || text;
    item.date = result?.date || date;
    item.startMin = result?.deadlineMin != null ? Math.max(8 * 60, result.deadlineMin - duration) : start;
    item.endMin = (result?.deadlineMin ?? item.startMin) + (result?.deadlineMin != null ? 0 : duration);
    if (result?.deadlineMin != null) item.endMin = result.deadlineMin;
    item.flexible = result?.flexible ?? true;
    item.locked = !item.flexible;
    item.notes = result?.deadlineMin != null ? `Before ${clockLabel(result.deadlineMin)}` : "";
    setParsed(item);
  }

  function applyReplan() {
    if (!proposal) return;
    const manualIds = new Set(manual.map((item) => item.id));
    saveManual(proposal.filter((item) => manualIds.has(item.id) || item.sourceType === "manual"));
    setProposal(null);
  }

  const head = heading(date);
  const now = sgtNow();
  const nowMin = now.hour * 60 + now.minute;
  const viewingToday = date === isoDate();
  const next = items.find((item) => item.endMin >= nowMin) ?? items[0];
  const nextLeave = next ? leaveBy(next.startMin, legs.find((leg) => leg.toId === next.id)?.minutes ?? null) : null;

  return (
    <div className="lg:col-span-5 grid items-start gap-8 lg:grid-cols-5">
      <section className="lg:col-span-3">
        <p className="text-xs font-semibold tracking-brand text-accent">{head.greet}</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-4xl text-cream">{head.weekday}</h2>
            <p className="text-lg text-cream">{head.rest}</p>
            <p className="text-sm text-mute">Singapore</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setDate(shift(date, -1))} className="press grid size-11 place-items-center rounded-xl bg-ink text-cream ring-1 ring-line" aria-label="Previous day">←</button>
            <button type="button" onClick={() => setDate(isoDate())} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", date === isoDate() ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>Today</button>
            <button type="button" onClick={() => setDate(shift(date, 1))} className="press grid size-11 place-items-center rounded-xl bg-ink text-cream ring-1 ring-line" aria-label="Next day">→</button>
          </div>
        </div>
        <input type="date" value={date} onChange={(event) => event.target.value && setDate(event.target.value)} className="mt-3 h-11 rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
        <p className="mt-3 text-sm text-cream">{plans.length} {plans.length === 1 ? "plan" : "plans"} · {tasks.filter((item) => item.status !== "completed").length} {tasks.length === 1 ? "task" : "tasks"} · {windows.length} free {windows.length === 1 ? "window" : "windows"}</p>
        <p className="mt-1 text-sm text-sky">{weatherState === "loading" ? "Checking weather…" : weatherState === "none" ? "Weather unavailable" : weather}</p>
        {!outdoorLater && items.some((item) => item.outdoor) ? <p className="mt-1 text-sm text-caution">Rain is expected later. Outdoor plans are safer earlier.</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => { setAdding(true); setParsed(null); }} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">+ Add</button>
          <button type="button" onClick={() => { const result = replanDay(items, legs); setProposal(result.next); setMoves(result.moves.map((move) => move.to == null ? move.reason : `${move.title}: ${clockLabel(move.from)} → ${clockLabel(move.to)}`)); }} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Replan my day</button>
          <details className="relative">
            <summary className="press flex min-h-11 cursor-pointer list-none items-center rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Find something</summary>
            <div className="absolute z-10 mt-2 flex w-48 flex-col rounded-xl bg-panel p-2 ring-1 ring-line">
              {([
                ["makan", "Makan"],
                ["family", "Family"],
                ["dating", "Dating"],
                ["out", "Team Out"],
              ] as const).map(([mode, label]) => (
                <Link key={mode} to="/" search={{ mode, code: "" }} className="press min-h-11 rounded-lg px-3 py-2 text-sm text-cream">{label}</Link>
              ))}
            </div>
          </details>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-panel px-5 py-8">
            <p className="text-xs font-semibold tracking-brand text-accent">YOUR DAY IS OPEN</p>
            <p className="mt-2 text-lg text-cream">Nothing scheduled yet.</p>
            <button type="button" onClick={() => setAdding(true)} className="press mt-4 min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Add something</button>
            <KairosVoice mode="today" text="Rare sighting: an empty day." />
          </div>
        ) : (
          <ol className="today-spine mt-8 space-y-3">
            {viewingToday ? <li className="today-now text-xs font-semibold tracking-brand">NOW · {clockLabel(nowMin)}</li> : null}
            {items.map((item, index) => {
              const previous = items[index - 1];
              const leg = previous ? legs.find((entry) => entry.fromId === previous.id && entry.toId === item.id) : undefined;
              const depart = leaveBy(item.startMin, leg?.minutes ?? null);
              const past = viewingToday && item.endMin < nowMin;
              const conflict = conflicts.find((entry) => entry.afterId === item.id);
              return (
                <li key={item.id}>
                  {leg ? <p className="mb-2 text-sm text-mute">{leg.minutes == null ? "Travel time unavailable" : `Drive ${leg.minutes} min`}</p> : null}
                  {!leg && previous && !previous.online && !item.online && (!located(previous.place) || !located(item.place)) ? <p className="mb-2 text-sm text-mute">Location not set</p> : null}
                  {windows.filter((window) => previous && window.startMin >= previous.endMin && window.endMin <= item.startMin).map((window) => (
                    <FreeCard key={`${window.startMin}`} window={window} onUse={() => setWindowUse(window)} />
                  ))}
                  <button type="button" onClick={() => setSelected(item.id)} className={clsx("today-item w-full rounded-xl bg-panel px-4 py-3 text-left", past && "opacity-60", item.status === "completed" && "opacity-50", selected === item.id && "today-item-on")} data-kind={item.kind}>
                    <p className="today-tag text-xs font-semibold tracking-brand" data-kind={item.kind}>{item.kind === "date" && item.status === "confirmed" ? "DATE · CONFIRMED" : `${KIND[item.kind]} · ${clockLabel(item.startMin)}–${clockLabel(item.endMin)}`}</p>
                    <p className={clsx("mt-1 text-lg text-cream", item.status === "completed" && "line-through")}>{item.status === "completed" ? "Done · " : ""}{item.title}</p>
                    <p className="text-sm text-mute">{item.kind === "date" && item.status === "confirmed" ? `${clockLabel(item.startMin)}–${clockLabel(item.endMin)} · ` : ""}{item.online ? "Online · no travel" : item.place?.address || item.place?.name || "Location not set"}</p>
                    {item.repeat ? <p className="text-xs text-sky">{repeatLabel(item.repeat)}</p> : null}
                    {depart != null ? <p className="today-leave mt-1 text-sm">Leave by {clockLabel(depart)}</p> : null}
                    {item.locked ? <p className="mt-1 text-xs text-mute">Locked</p> : null}
                  </button>
                  {conflict ? (
                    <div className="mt-2 rounded-xl bg-ink px-3 py-3 ring-1 ring-vermilion">
                      <p className="text-xs font-semibold tracking-brand text-vermilion">CONFLICT</p>
                      <p className="mt-1 text-sm text-cream">{conflict.text}</p>
                      <div className="mt-2 flex gap-2">
                        <button type="button" onClick={() => { const result = replanDay(items, legs); setProposal(result.next); setMoves(result.moves.map((move) => move.reason)); }} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Fix it</button>
                        <button type="button" onClick={() => setIgnored((current) => [...current, conflict.id])} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-mute">Ignore</button>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
            {windows.filter((window) => !items.some((item) => window.endMin <= item.startMin && window.startMin >= (items[items.indexOf(item) - 1]?.endMin ?? 0))).slice(-1).map((window) => (
              <li key={window.startMin}><FreeCard window={window} onUse={() => setWindowUse(window)} /></li>
            ))}
          </ol>
        )}
        {routing ? <p className="mt-3 text-sm text-mute">Checking travel…</p> : null}
        {items.length > 0 ? <KairosVoice mode="today" text={voice || aside} status={conflicts.length || !outdoorLater ? "warning" : "neutral"} /> : null}
      </section>

      <aside className="lg:col-span-2">
        <section className="rounded-2xl bg-panel p-5">
          <p className="text-xs font-semibold tracking-brand text-accent">TODAY AT A GLANCE</p>
          <p className="mt-4 text-xs font-semibold tracking-brand text-sky">NEXT</p>
          <p className="text-lg text-cream">{next ? `${next.title} · ${clockLabel(next.startMin)}` : "Nothing yet"}</p>
          <p className="mt-3 text-xs font-semibold tracking-brand text-sky">LEAVE BY</p>
          <p className="today-leave text-lg">{nextLeave != null ? clockLabel(nextLeave) : "No verified trip"}</p>
          <p className="mt-3 text-xs font-semibold tracking-brand text-sky">WEATHER</p>
          <p className="text-sky">{weatherState === "none" ? "Weather unavailable" : weather || "Checking weather…"}</p>
          <p className="mt-3 text-xs font-semibold tracking-brand text-sky">TASKS</p>
          <p className="text-cream">{tasks.filter((item) => item.status !== "completed").length} remaining</p>
          <p className="mt-3 text-xs font-semibold tracking-brand text-sky">FREE TIME</p>
          <p className="text-cream">{windows[0] ? `${Math.floor(windows[0].minutes / 60)} hr ${windows[0].minutes % 60} min` : "No long gap"}</p>
          <KairosVoice mode="today" text={voice || aside} />
        </section>

        {selected ? (
          <Detail
            item={items.find((item) => item.id === selected) ?? null}
            onClose={() => setSelected("")}
            onChange={(next) => {
              const series = next.seriesId;
              if (series) {
                saveManual(manual.map((item) => {
                  if (item.id !== series) return item;
                  const done = new Set(item.doneOn ?? []);
                  if (next.status === "completed") done.add(next.date);
                  else done.delete(next.date);
                  return { ...item, title: next.title, locked: next.locked, flexible: !next.locked, place: next.place, repeat: next.repeat, doneOn: [...done] };
                }));
                return;
              }
              if (next.sourceType === "manual") saveManual(manual.map((item) => (item.id === next.id ? { ...item, ...next, doneOn: next.status === "completed" ? [...new Set([...(item.doneOn ?? []), next.date])] : (item.doneOn ?? []).filter((day) => day !== next.date) } : item)));
              else {
                const map = { ...locks, [next.id]: next.locked };
                setLocks(map);
                localStorage.setItem("kairos-today-locks", JSON.stringify(map));
              }
            }}
            onDelete={(id) => {
              const hit = items.find((item) => item.id === id);
              if (hit?.repeat || hit?.seriesId) {
                const series = hit.seriesId || hit.id;
                saveManual(manual.map((item) => item.id === series ? { ...item, skipped: [...new Set([...(item.skipped ?? []), hit.date])] } : item));
                return;
              }
              saveManual(manual.filter((item) => item.id !== id));
            }}
          />
        ) : null}

        {adding ? (
          <div className="mt-4 rounded-2xl bg-ink p-4 ring-1 ring-line">
            <p className="text-xs font-semibold tracking-brand text-accent">QUICK ADD</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["personal", "task", "errand", "appointment"] as const).map((kind) => (
                <button key={kind} type="button" onClick={() => setParsed({ ...blankItem(date, kind), title: KIND[kind] })} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">{KIND[kind]}</button>
              ))}
            </div>
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={2} placeholder="Collect parcel before 6" className="mt-3 w-full rounded-xl bg-panel px-3 py-2 text-cream ring-1 ring-line" />
            <button type="button" onClick={() => void readDraft()} className="press mt-2 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Read it</button>
            {parsed ? <Confirm item={parsed} onChange={setParsed} onSave={() => commit(parsed)} onCancel={() => setParsed(null)} /> : null}
          </div>
        ) : null}

        {windowUse ? (
          <div className="mt-4 rounded-2xl bg-ink p-4 ring-1 ring-line">
            <p className="text-xs font-semibold tracking-brand text-accent">USE THIS TIME</p>
            <p className="mt-1 text-sm text-mute">{clockLabel(windowUse.startMin)}–{clockLabel(windowUse.endMin)}. Nothing is added until you confirm.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["task", "errand", "personal"] as const).map((kind) => (
                <button key={kind} type="button" onClick={() => setParsed({ ...blankItem(date, kind), title: "", startMin: windowUse.startMin, endMin: Math.min(windowUse.endMin, windowUse.startMin + 45) })} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">{KIND[kind]}</button>
              ))}
            </div>
            <button type="button" onClick={() => setWindowUse(null)} className="press mt-3 min-h-11 text-sm font-semibold text-mute">Leave it free</button>
            {parsed ? <Confirm item={parsed} onChange={setParsed} onSave={() => commit(parsed)} onCancel={() => setParsed(null)} /> : null}
          </div>
        ) : null}

        {proposal ? (
          <div className="mt-4 rounded-2xl bg-ink p-4 ring-1 ring-line">
            <p className="text-xs font-semibold tracking-brand text-accent">PROPOSED CHANGES</p>
            {moves.length === 0 ? <p className="mt-2 text-sm text-cream">Nothing flexible can move. Locked plans stay where they are.</p> : (
              <ul className="mt-2 space-y-1 text-sm text-cream">{moves.map((line) => <li key={line}>{line}</li>)}</ul>
            )}
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={applyReplan} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Apply changes</button>
              <button type="button" onClick={() => setProposal(null)} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Keep current plan</button>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function FreeCard({ window, onUse }: { window: FreeWindow; onUse: () => void }) {
  const hours = Math.floor(window.minutes / 60);
  const mins = window.minutes % 60;
  return (
    <div className="today-free mb-3 rounded-xl border border-dashed px-4 py-3">
      <p className="text-xs font-semibold tracking-brand text-accent">FREE · {clockLabel(window.startMin)}–{clockLabel(window.endMin)}</p>
      <p className="text-sm text-cream">{hours ? `${hours} hr ` : ""}{mins ? `${mins} min` : ""}</p>
      <KairosVoice mode="today" text="You have a useful gap. Enough for an errand, not a second outing." />
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={onUse} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Use this time</button>
      </div>
    </div>
  );
}

function Confirm({ item, onChange, onSave, onCancel }: { item: TodayItem; onChange: (item: TodayItem) => void; onSave: () => void; onCancel: () => void }) {
  const personal = item.kind === "appointment" || item.kind === "personal";
  const repeat = item.repeat ?? null;
  const mode = !repeat ? "once" : repeat.every === 1 && repeat.unit === "day" && !repeat.until ? "day" : repeat.every === 1 && repeat.unit === "week" && !repeat.until ? "week" : "custom";
  return (
    <div className="mt-3 rounded-xl bg-panel p-3">
      <p className="text-xs text-mute">Check this before it joins the day.</p>
      <input value={item.title} onChange={(event) => onChange({ ...item, title: event.target.value })} className="mt-2 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="text-xs text-mute">Starts
          <input type="time" value={minutesToTime(item.startMin)} onChange={(event) => onChange(withClock(item, event.target.value, "start"))} className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
        </label>
        <label className="text-xs text-mute">Ends
          <input type="time" value={minutesToTime(item.endMin)} onChange={(event) => onChange(withClock(item, event.target.value, "end"))} className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
        </label>
      </div>
      <PlaceField place={item.place} onChange={(place) => onChange({ ...item, place, online: false })} />
      {personal ? (
        <div className="mt-3">
          <p className="text-xs text-mute">Repeats</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {([
              ["once", "Once"],
              ["day", "Every day"],
              ["week", "Every week"],
              ["custom", "Custom"],
            ] as const).map(([key, label]) => (
              <button key={key} type="button" aria-pressed={mode === key} onClick={() => onChange({ ...item, repeat: key === "once" ? null : key === "day" ? { every: 1, unit: "day", until: "" } : key === "week" ? { every: 1, unit: "week", until: "" } : { every: 2, unit: "week", until: "" } })} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", mode === key ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>{label}</button>
            ))}
          </div>
          {mode === "custom" && repeat ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-cream">
              <span>Every</span>
              <input type="number" min={1} max={52} value={repeat.every} onChange={(event) => onChange({ ...item, repeat: { ...repeat, every: Math.max(1, Math.min(52, Number(event.target.value) || 1)) } })} className="h-11 w-16 rounded-xl bg-ink px-2 text-cream ring-1 ring-line" />
              <select value={repeat.unit} onChange={(event) => onChange({ ...item, repeat: { ...repeat, unit: event.target.value as "day" | "week" | "month" } })} className="h-11 rounded-xl bg-ink px-2 text-cream ring-1 ring-line">
                <option value="day">days</option>
                <option value="week">weeks</option>
                <option value="month">months</option>
              </select>
              <label className="text-xs text-mute">Until
                <input type="date" value={repeat.until} onChange={(event) => onChange({ ...item, repeat: { ...repeat, until: event.target.value } })} className="ml-2 h-11 rounded-xl bg-ink px-2 text-cream ring-1 ring-line" />
              </label>
            </div>
          ) : null}
        </div>
      ) : null}
      <p className="mt-2 text-sm text-cream">{KIND[item.kind]} · {clockLabel(item.startMin)}–{clockLabel(item.endMin)}{repeat ? ` · ${repeatLabel(repeat)}` : ""}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" disabled={!item.title.trim()} onClick={onSave} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Add to today</button>
        <button type="button" onClick={onCancel} className="press min-h-11 rounded-xl px-3 text-sm text-mute">Cancel</button>
      </div>
    </div>
  );
}

function minutesToTime(minutes: number): string {
  const day = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(day / 60)).padStart(2, "0")}:${String(day % 60).padStart(2, "0")}`;
}

function withClock(item: TodayItem, value: string, edge: "start" | "end"): TodayItem {
  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return item;
  const next = hour * 60 + minute;
  if (edge === "start") return { ...item, startMin: next, endMin: Math.max(item.endMin, next + 15) };
  return { ...item, endMin: Math.max(next, item.startMin + 15) };
}

function PlaceField({ place, onChange }: { place: TodayPlace | null; onChange: (place: TodayPlace | null) => void }) {
  const [query, setQuery] = useState(place?.name ?? "");
  const [hits, setHits] = useState<{ name: string; address: string; latitude: number; longitude: number }[]>([]);
  const [note, setNote] = useState("");
  async function search() {
    const text = query.trim();
    if (text.length < 2) return;
    setNote("Looking up that place…");
    const found = await lookupPlace({ data: { query: text } }).catch(() => []);
    setHits(found.slice(0, 5).map((hit) => ({ name: hit.name, address: hit.address || hit.label, latitude: hit.latitude, longitude: hit.longitude })));
    setNote(found.length ? "" : "No matching place. Try a mall, station, or address.");
  }
  return (
    <div className="mt-3">
      <label className="text-xs text-mute" htmlFor="today-place">Location</label>
      <div className="mt-1 flex gap-2">
        <input id="today-place" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tampines Mall, or 1 Depot Road" className="h-11 min-w-0 flex-1 rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
        <button type="button" onClick={() => void search()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Find</button>
      </div>
      {place ? <p className="mt-2 text-sm text-cream">{place.name}{place.address ? ` · ${place.address}` : ""}</p> : null}
      {note ? <p className="mt-2 text-sm text-mute">{note}</p> : null}
      {hits.length ? (
        <ul className="mt-2 space-y-1">
          {hits.map((hit) => (
            <li key={`${hit.latitude}-${hit.longitude}`}>
              <button type="button" onClick={() => { onChange({ name: hit.name, address: hit.address, latitude: hit.latitude, longitude: hit.longitude }); setHits([]); setQuery(hit.name); }} className="press min-h-11 w-full rounded-xl px-3 text-left text-sm text-cream ring-1 ring-line">
                <span className="block">{hit.name}</span>
                <span className="text-mute">{hit.address}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Detail({ item, onClose, onChange, onDelete }: { item: TodayItem | null; onClose: () => void; onChange: (item: TodayItem) => void; onDelete: (id: string) => void }) {
  if (!item) return null;
  return (
    <div className="mt-4 rounded-2xl bg-ink p-4 ring-1 ring-line">
      <p className="today-tag text-xs font-semibold tracking-brand" data-kind={item.kind}>{item.kind === "date" && item.status === "confirmed" ? "DATE · CONFIRMED" : KIND[item.kind]}</p>
      <h3 className="mt-1 text-xl text-cream">{item.title}</h3>
      <p className="text-sm text-mute">{clockLabel(item.startMin)}–{clockLabel(item.endMin)}</p>
      <p className="mt-2 text-sm text-cream">{item.online ? "Online" : item.place?.address || item.place?.name || "Location not set"}</p>
      {item.repeat ? <p className="mt-1 text-sm text-sky">{repeatLabel(item.repeat)}</p> : null}
      {item.notes ? <p className="mt-2 text-sm text-mute">{item.notes}</p> : null}
      {!item.online && item.place ? (
        <ExternalActions
          heading="FOR THIS PLAN"
          input={{
            mode: "today",
            kind: "place",
            countryCode: "SG",
            share: true,
            when: { date: item.date, startMin: item.startMin, endMin: item.endMin, timezone: "Asia/Singapore" },
            place: {
              name: item.place.name || item.title,
              address: item.place.address,
              city: "Singapore",
              countryCode: "SG",
              lat: item.place.latitude ?? undefined,
              lng: item.place.longitude ?? undefined,
            },
          }}
        />
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {item.sourceType === "manual" ? (
          <button type="button" onClick={() => onChange({ ...item, status: item.status === "completed" ? "flexible" : "completed" })} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">{item.status === "completed" ? "Undo" : "Done"}</button>
        ) : null}
        <button type="button" onClick={() => onChange({ ...item, locked: !item.locked, flexible: item.locked, status: item.locked ? item.status : "confirmed" })} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">{item.locked ? "Unlock" : "Lock"}</button>
        {item.href.startsWith("/meet/") ? (
          <Link to="/meet/$code" params={{ code: item.sourceId }} className="press inline-flex min-h-11 items-center rounded-xl px-3 text-sm text-sky">Open plan</Link>
        ) : item.kind === "family" || item.kind === "date" || item.kind === "travel" ? (
          <Link to="/" search={{ mode: item.kind === "date" ? "dating" : item.kind === "travel" ? "travel" : "family", code: "" }} className="press inline-flex min-h-11 items-center rounded-xl px-3 text-sm text-sky">Open plan</Link>
        ) : null}
        {item.sourceType === "manual" && (item.repeat || item.seriesId) ? <button type="button" onClick={() => onChange({ ...item, repeat: null })} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Stop repeating</button> : null}
        {item.sourceType === "manual" ? <button type="button" onClick={() => { onDelete(item.id); onClose(); }} className="press min-h-11 rounded-xl px-3 text-sm text-mute">{item.repeat || item.seriesId ? "Delete this time" : "Delete"}</button> : null}
        <button type="button" onClick={onClose} className="press min-h-11 rounded-xl px-3 text-sm text-mute">Close</button>
      </div>
    </div>
  );
}
