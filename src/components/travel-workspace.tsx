import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { KairosVoice } from "@/components/kairos-voice";
import { hoursLine } from "@/lib/travel-story";
import { PlaceDetail, PlacePhoto, PlaceTitle, NavigateControl } from "@/components/travel-place";
import { HotelShortlist } from "@/components/travel-hotels";
import { TravelMap } from "@/components/travel-map";
import { routeTripDay } from "@/lib/travel.functions";
import { prefetchScheduledPhotos } from "@/lib/travel-photo-client";
import { hasYoungChild } from "@/lib/travel";
import { placeMatches, readableName, routeLabel } from "@/lib/travel-names";
import type { PlacePhoto as PlacePhotoRecord } from "@/lib/travel-photo";
import { usefulLegReason } from "@/lib/travel-routing";
import { dayOutline, fillFreeGap, foodAlternatives, keepStop, nearbyContext, nearbyOptions, swapFoodStop, type NearbyOption } from "@/lib/travel-itinerary";
import {
  applyRoute,
  applySuggestedOrder,
  applyPlacePhoto,
  bestDayFor,
  dayStops,
  discoverSections,
  displayClock,
  durationPhrase,
  excludePlace,
  experienceBalance,
  moveStop,
  normalizeTravelParty,
  notableOmissions,
  rebalanceTrip,
  savePlace,
  scheduleStop,
  selectBase,
  selectLegMode,
  suggestOrder,
  unscheduleStop,
  type LegMode,
  type RebalanceKind,
  type Trip,
  type TripBooking,
  type TripStop,
} from "@/lib/travel-model";

const VIEWS = ["Plan", "Discover", "Map", "Bookings"] as const;

export function TravelWorkspace({
  trip,
  busy,
  onChange,
  onLock,
  onRemixDay,
  onAnother,
  onExclude,
}: {
  trip: Trip;
  busy: boolean;
  onChange: (trip: Trip) => void;
  onLock: (date: string) => void;
  onRemixDay: (date: string) => void;
  onAnother: () => void;
  onExclude?: (name: string) => void;
}) {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Plan");
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [daysOn, setDaysOn] = useState<number[] | "all">("all");
  const [routing, setRouting] = useState(false);
  const shown = daysOn === "all" ? trip.days.map((day) => day.index) : daysOn;
  const tripRef = useRef(trip);
  tripRef.current = trip;
  useEffect(() => {
    const next = normalizeTravelParty(trip);
    if (next !== trip) onChange(next);
  }, [trip, onChange]);

  function rememberPhoto(stopId: string, photo: PlacePhotoRecord) {
    const next = applyPlacePhoto(tripRef.current, stopId, photo);
    tripRef.current = next;
    onChange(next);
  }
  const stale = trip.days.some((day) => dayStops(trip, day.index).length > 1 && (day.line == null || trip.legs.some((leg) => leg.day === day.index && leg.source !== "osrm" && leg.shown !== "walk")));
  const openStop = trip.stops.find((stop) => stop.id === detail) ?? null;

  const scrollRef = useRef(0);
  function open(id: string) {
    scrollRef.current = typeof window === "undefined" ? 0 : window.scrollY;
    setSelected(id);
    setDetail(id);
  }
  function closeDetail() {
    setDetail(null);
    const y = scrollRef.current;
    requestAnimationFrame(() => window.scrollTo(0, y));
  }

  async function updateRoutes() {
    setRouting(true);
    let next = trip;
    for (const day of trip.days) {
      const rows = dayStops(next, day.index);
      if (rows.length < 2) continue;
      if (day.line && next.legs.filter((leg) => leg.day === day.index).every((leg) => leg.source === "osrm" || leg.shown === "walk")) continue;
      const route = await routeTripDay({ data: { move: trip.move === "walk" ? "walk" : "drive", points: rows.map((stop) => ({ lat: stop.lat, lng: stop.lng })) } }).catch(() => null);
      if (route) next = applyRoute(next, day.index, route);
    }
    setRouting(false);
    onChange(next);
  }

  function toggleDay(index: number) {
    setDaysOn((current) => {
      if (current === "all") return [index];
      const next = current.includes(index) ? current.filter((item) => item !== index) : [...current, index];
      return next.length ? next : "all";
    });
  }

  return (
    <div className="lg:grid lg:grid-cols-5 lg:items-start lg:gap-4">
      <div className="grid gap-4 lg:col-span-3">
        <div>
          <p className="text-xs font-semibold tracking-brand text-accent">TRIP</p>
          <h3 className="mt-1 font-display text-2xl text-cream">{trip.title}</h3>
          {trip.playbook ? (
            <div className="mt-3">
              <p className="text-xs font-semibold tracking-brand text-accent">{trip.playbook.title.toUpperCase()}</p>
              <p className="text-sm text-cream">{trip.playbook.visit}</p>
              <p className="mt-1 text-sm text-cream">{trip.playbook.line}</p>
              <p className="mt-3 text-xs font-semibold tracking-brand text-accent">YOUR VERSION</p>
              <p className="text-sm text-cream">{trip.playbook.version}</p>
              <p className="mt-1 text-sm text-mute">{trip.playbook.route}</p>
              {trip.playbook.changes.length ? (
                <>
                  <p className="mt-3 text-xs font-semibold tracking-brand text-accent">PERSONALISED FOR YOU</p>
                  <ul className="mt-1 space-y-1">
                    {trip.playbook.changes.map((change) => <li key={change} className="text-sm text-cream">{change}</li>)}
                  </ul>
                </>
              ) : null}
            </div>
          ) : null}
          {trip.whyTrip && !/^(First visit|Return visit)\./.test(trip.whyTrip) ? <p className="mt-2 text-sm text-cream">{trip.whyTrip}</p> : null}
          <p className="mt-2 text-sm text-cream">{trip.burden.line}</p>
          <p className="mt-1 text-sm text-mute">{trip.burden.transitMinutes} min moving · {trip.burden.hotelChanges} hotel change{trip.burden.hotelChanges === 1 ? "" : "s"} · {trip.burden.density} days</p>
          {trip.transitNote ? <p className="mt-1 text-sm text-mute">{trip.transitNote}</p> : null}
          <KairosVoice mode="travel" label="Kairos · Away" text={trip.voice} status={trip.burden.line.includes("tiring") ? "warning" : "good"} />
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Trip views">
          {VIEWS.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={view === item} onClick={() => setView(item)} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", item === "Map" && "lg:hidden", view === item ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>{item}</button>
          ))}
        </div>
        {view === "Plan" ? (
          <PlanView
            trip={trip}
            selected={selected}
            busy={busy}
            routing={routing}
            stale={stale}
            onOpen={open}
            onChange={onChange}
            onLock={onLock}
            onRemixDay={onRemixDay}
            onAnother={onAnother}
            onRoutes={() => void updateRoutes()}
            onDiscover={() => setView("Discover")}
            onHighlight={setSelected}
            onMode={(fromId, toId, mode) => onChange(selectLegMode(trip, fromId, toId, mode))}
            onPhoto={rememberPhoto}
          />
        ) : null}
        {view === "Discover" ? <DiscoverView trip={trip} onOpen={open} onChange={onChange} onPhoto={rememberPhoto} /> : null}
        {view === "Map" ? (
          <div className="lg:hidden">
            <DayFilters trip={trip} daysOn={daysOn} onAll={() => setDaysOn("all")} onToggle={toggleDay} />
            <TravelMap trip={trip} days={shown} selected={selected} onSelect={open} />
          </div>
        ) : null}
        {view === "Bookings" ? <BookingsView trip={trip} onChange={onChange} /> : null}
      </div>
      <aside className="sticky top-3 hidden lg:col-span-2 lg:block">
        <DayFilters trip={trip} daysOn={daysOn} onAll={() => setDaysOn("all")} onToggle={toggleDay} />
        <TravelMap trip={trip} days={shown} selected={selected} onSelect={open} />
      </aside>
      {openStop ? (
        <PlaceDetail
          trip={trip}
          stop={openStop}
          best={openStop.day == null ? bestDayFor(trip, openStop.id) : null}
          onClose={closeDetail}
          onAdd={(day) => { onChange(scheduleStop(trip, openStop.id, day)); setDetail(null); }}
          onSave={() => onChange(savePlace(trip, openStop.id))}
          onExclude={() => { onExclude?.(openStop.name); onChange(excludePlace(trip, openStop.id)); setDetail(null); }}
          onRemove={() => { onChange(unscheduleStop(trip, openStop.id)); setDetail(null); }}
          onMove={(day) => { onChange(scheduleStop(unscheduleStop(trip, openStop.id), openStop.id, day)); }}
          onShowMap={() => { setSelected(openStop.id); setView("Map"); setDetail(null); }}
          onPhoto={rememberPhoto}
          returnScroll={scrollRef.current}
        />
      ) : null}
    </div>
  );
}

function DayFilters({ trip, daysOn, onAll, onToggle }: { trip: Trip; daysOn: number[] | "all"; onAll: () => void; onToggle: (index: number) => void }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <button type="button" onClick={onAll} className={clsx("press min-h-11 rounded-xl px-3 text-sm", daysOn === "all" ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>Whole trip</button>
      {trip.days.filter((day) => dayStops(trip, day.index).some((stop) => stop.category !== "stay")).map((day) => {
        const on = daysOn !== "all" && daysOn.includes(day.index);
        return <button key={day.date} type="button" onClick={() => onToggle(day.index)} className={clsx("press min-h-11 rounded-xl px-3 text-sm", on ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>{`Day ${day.index + 1}`}</button>;
      })}
    </div>
  );
}

function PlanView({
  trip, selected, busy, routing, stale, onOpen, onChange, onLock, onRemixDay, onAnother, onRoutes, onDiscover, onHighlight, onMode, onPhoto,
}: {
  trip: Trip;
  selected: string | null;
  busy: boolean;
  routing: boolean;
  stale: boolean;
  onOpen: (id: string) => void;
  onChange: (trip: Trip) => void;
  onLock: (date: string) => void;
  onRemixDay: (date: string) => void;
  onAnother: () => void;
  onRoutes: () => void;
  onDiscover: () => void;
  onHighlight: (id: string) => void;
  onMode: (fromId: string, toId: string, mode: LegMode) => void;
  onPhoto: (stopId: string, photo: PlacePhotoRecord) => void;
}) {
  const sightsPlanned = trip.stops.some((stop) => stop.day != null && stop.category !== "stay");
  const balance = experienceBalance(trip.coverage, trip.areas[0]?.name || trip.destination);
  const omissions = notableOmissions(trip);
  const timed = trip.legs.some((leg) => leg.minutes != null);
  const [folded, setFolded] = useState<Record<string, boolean>>({});
  const [nearbyDay, setNearbyDay] = useState<number | null>(null);
  const [nearbyAnchor, setNearbyAnchor] = useState<string | undefined>(undefined);
  const [foodOnly, setFoodOnly] = useState(false);
  const scheduledKey = trip.stops
    .filter((stop) => stop.day != null && stop.category !== "stay" && stop.provider !== "area")
    .map((stop) => `${stop.day}:${stop.id}`)
    .join("|");
  const foldKey = trip.days.map((day) => (folded[String(day.index)] ? "1" : "0")).join("");
  useEffect(() => {
    const scheduled = trip.stops.filter((stop) => stop.day != null && stop.category !== "stay" && stop.provider !== "area");
    const open = trip.days.find((day) => !folded[String(day.index)] && scheduled.some((stop) => stop.day === day.index))?.index ?? scheduled[0]?.day ?? 0;
    const priority = scheduled.filter((stop) => stop.day === open).map((stop) => stop.id);
    void prefetchScheduledPhotos(scheduled, priority);
  }, [trip.id, scheduledKey, foldKey]);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`kairos-day-fold:${trip.id}`);
      setFolded(raw ? JSON.parse(raw) as Record<string, boolean> : {});
    } catch {
      setFolded({});
    }
  }, [trip.id]);
  function writeFolds(next: Record<string, boolean>) {
    setFolded(next);
    try { sessionStorage.setItem(`kairos-day-fold:${trip.id}`, JSON.stringify(next)); } catch { /* session only */ }
  }
  function openNearby(day: number, anchorId?: string, meals = false) {
    setNearbyDay(day);
    setNearbyAnchor(anchorId);
    setFoodOnly(meals);
  }
  const nearby = nearbyDay == null ? null : nearbyContext(trip, nearbyDay, nearbyAnchor);
  const nearbyRows = nearby ? nearbyOptions(trip, nearby).filter((row) => !foodOnly || row.band === "food" || row.band === "coffee") : [];
  return (
    <div className="grid gap-4">
      {sightsPlanned ? (
        <div className="flex flex-wrap gap-2">
          {(["city", "nature", "culture", "local", "relaxed", "more"] as RebalanceKind[]).map((kind) => (
            <button key={kind} type="button" onClick={() => onChange(rebalanceTrip(trip, kind))} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">
              {kind === "city" ? "More city" : kind === "nature" ? "More nature" : kind === "culture" ? "More culture" : kind === "local" ? "More local" : kind === "relaxed" ? "More relaxed" : "Fit more in"}
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-ink px-3 py-3">
          <p className="font-semibold text-cream">Couldn't load {trip.destination} places</p>
          <p className="mt-1 text-sm text-mute">{trip.placeNote || "Places didn't load. Try again."}</p>
          <button type="button" disabled={busy} onClick={onAnother} className="press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">{busy ? "Retrying…" : "Retry"}</button>
        </div>
      )}
      {sightsPlanned && balance.length ? (
        <section>
          <p className="text-xs font-semibold tracking-brand text-accent">TRIP BALANCE</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {balance.map((row) => (
              <li key={row.label} className="rounded-lg px-2 py-1 text-sm text-cream ring-1 ring-line">{row.state === "in" ? "✓" : "○"} {row.label}{row.state === "optional" ? " · optional" : ""}</li>
            ))}
          </ul>
          <button type="button" onClick={onDiscover} className="press mt-2 min-h-11 text-sm text-accent">Explore more in Discover</button>
        </section>
      ) : null}
      {omissions.map((stop) => (
        <div key={stop.id} className="rounded-xl bg-ink px-3 py-3 text-sm">
          <p className="font-semibold text-cream">{readableName(stop)}</p>
          <p className="mt-1 text-mute">Not included. It needs most of a day, and would make the rest of this trip rushed.</p>
          <button type="button" onClick={() => onChange(scheduleStop(trip, stop.id, bestDayFor(trip, stop.id)?.day ?? 0))} className="press mt-2 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Add anyway</button>
        </div>
      ))}
      {trip.areas.length > 1 ? (
        <ul className="grid gap-2">
          {trip.bases.map((base) => (
            <li key={base.id} className="rounded-xl bg-ink px-3 py-3 text-sm">
              <p className="font-semibold text-cream">{base.chosen ? "Chosen base · " : "Compared · "}{base.label}</p>
              <p className="mt-1 text-mute">{base.note}</p>
            </li>
          ))}
        </ul>
      ) : null}
      {sightsPlanned ? (
        <HotelShortlist trip={trip} highlighted={selected} onChange={onChange} onHighlight={onHighlight} onOpen={onOpen} onPhoto={onPhoto} />
      ) : null}
      {trip.unmatched.length ? <p className="text-sm text-mute">Couldn't place: {trip.unmatched.join(", ")}.</p> : null}
      {timed ? <p className="text-xs text-mute">Travel times are estimates and may differ from live navigation.</p> : null}
      {stale ? <button type="button" disabled={routing} onClick={onRoutes} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">{routing ? "Routing…" : "Update travel times"}</button> : null}
      {sightsPlanned ? (
        <div className="flex gap-2">
          <button type="button" onClick={() => writeFolds(Object.fromEntries(trip.days.map((day) => [String(day.index), true])))} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Collapse all</button>
          <button type="button" onClick={() => writeFolds({})} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Expand all</button>
        </div>
      ) : null}
      <div className="grid gap-8">
      {trip.days.map((day) => {
        const rows = dayStops(trip, day.index);
        if (!sightsPlanned) return null;
        const idea = suggestOrder(trip, day.index);
        const outline = dayOutline(trip, day.index);
        const closed = Boolean(folded[String(day.index)]);
        const gap = nearbyContext(trip, day.index);
        return (
          <section key={day.date} className="scroll-mt-4 overflow-visible rounded-2xl bg-ink ring-1 ring-line">
            <header className="sticky top-0 z-10 rounded-t-2xl bg-ink px-3 py-3 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-brand text-accent">{outline.title}</p>
                  <h4 className="text-lg text-cream">{outline.headline}</h4>
                  <p className="text-sm text-mute">{outline.character}{day.weather ? ` · ${day.weather}` : ""}</p>
                  <p className="text-sm text-cream">{closed ? outline.collapsed : `${outline.stops} stops · ${outline.minutesLabel}${outline.route ? ` · ${outline.route}` : ""}`}</p>
                </div>
                <button type="button" aria-expanded={!closed} onClick={() => writeFolds({ ...folded, [String(day.index)]: !closed })} className="press min-h-11 shrink-0 rounded-xl px-3 text-sm text-cream ring-1 ring-line">{closed ? "Expand" : "Collapse"}</button>
              </div>
            </header>
            {closed ? null : (
              <div className="px-3 pb-4">
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => onLock(day.date)} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">{day.locked ? "Kept" : "Keep day"}</button>
                  <button type="button" disabled={busy || day.locked} onClick={() => onRemixDay(day.date)} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Remix day</button>
                </div>
                {idea ? (
                  <div className="mt-3 rounded-xl px-3 py-2 ring-1 ring-line">
                    <p className="text-sm text-cream">Better order available. About {idea.saved} min less backtracking: {idea.names.join(" → ")}.</p>
                    <button type="button" onClick={() => onChange(applySuggestedOrder(trip, day.index))} className="press mt-2 min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Apply</button>
                  </div>
                ) : null}
                {rows.length ? (
                  <ol className="mt-3 space-y-3">
                    {rows.map((stop, index) => {
                      const leg = index === 0 ? null : trip.legs.find((item) => item.day === day.index && item.toId === stop.id);
                      const food = stop.category === "restaurant" || stop.category === "cafe" || stop.category === "market";
                      return (
                        <li key={stop.id}>
                          {leg ? <LegLine trip={trip} leg={leg} onMode={(mode) => onMode(leg.fromId, leg.toId, mode)} /> : null}
                          <div className={clsx("flex gap-3 rounded-xl bg-panel/40 px-3 py-2 ring-1", selected === stop.id ? "ring-accent" : "ring-line")}>
                            {stop.category !== "stay" && stop.provider !== "area" ? <PlacePhoto stop={stop} onPhoto={onPhoto} /> : null}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start gap-2">
                                <button type="button" onClick={() => onOpen(stop.id)} className="press min-h-11 min-w-0 flex-1 text-left">
                                  <p className="text-xs font-semibold tracking-brand text-accent">{displayClock(stop.startTime ?? "09:00")}–{displayClock(stop.endTime ?? "10:00")}</p>
                                  <PlaceTitle place={stop} />
                                  <p className="text-sm text-mute">{stopSummary(stop)}</p>
                                  {food && stop.why ? <p className="mt-1 text-sm text-cream">{stop.why}</p> : null}
                                </button>
                                {stop.category !== "stay" ? (
                                  <StopMenu
                                    onEarlier={() => onChange(moveStop(trip, stop.id, -1))}
                                    onLater={() => onChange(moveStop(trip, stop.id, 1))}
                                    onRemove={() => onChange(unscheduleStop(trip, stop.id))}
                                    onNearby={() => openNearby(day.index, stop.id, food)}
                                  />
                                ) : null}
                              </div>
                              {food && stop.provider !== "area" ? (
                                <div className="mt-1 flex flex-wrap gap-2">
                                  <button type="button" onClick={() => onChange(keepStop(trip, stop.id))} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">{stop.kept ? "Kept" : "Keep"}</button>
                                  <button type="button" disabled={!foodAlternatives(trip, stop.id).length} onClick={() => onChange(swapFoodStop(trip, stop.id))} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Swap</button>
                                  <button type="button" onClick={() => openNearby(day.index, stop.id, true)} className="press min-h-11 rounded-xl px-3 text-sm text-accent">Find another nearby</button>
                                </div>
                              ) : null}
                              {food && stop.provider === "area" ? (
                                <button type="button" onClick={() => openNearby(day.index, stop.id, true)} className="press mt-1 min-h-11 text-sm text-accent">Choose restaurant</button>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                ) : <p className="mt-3 text-sm text-mute">Nothing scheduled.</p>}
                {day.freeNote && rows.length && !/open time after/i.test(day.freeNote) ? (
                  <div className="mt-4 rounded-xl bg-panel/50 px-3 py-3 ring-1 ring-line">
                    <p className="text-xs font-semibold tracking-brand text-accent">FREE TIME</p>
                    <p className="text-sm text-cream">{day.freeNote.replace(/^Flight noted:.*$/i, "").trim()}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <button type="button" onClick={() => openNearby(day.index)} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Find nearby</button>
                      {gap && gap.remaining >= 150 ? <button type="button" onClick={() => onChange(fillFreeGap(trip, day.index))} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Fill this gap</button> : null}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        );
      })}
      </div>
      {nearby ? (
        <NearbySheet
          title={foodOnly ? `Food near ${nearby.anchorName}` : `Near ${nearby.anchorName}`}
          note={`You have ${durationPhrase(nearby.remaining)} free${nearby.hasNext ? ` before ${nearby.nextName}` : ""}.`}
          rows={nearbyRows}
          trip={trip}
          onClose={() => setNearbyDay(null)}
          onOpen={onOpen}
          onAdd={(id) => { onChange(scheduleStop(trip, id, nearby.day)); setNearbyDay(null); }}
        />
      ) : null}
      <button type="button" disabled={busy} onClick={onAnother} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Another itinerary</button>
    </div>
  );
}

function LegLine({ trip, leg, onMode }: { trip: Trip; leg: Trip["legs"][number]; onMode: (mode: LegMode) => void }) {
  const [open, setOpen] = useState(false);
  const from = trip.stops.find((stop) => stop.id === leg.fromId);
  const to = trip.stops.find((stop) => stop.id === leg.toId);
  const missing = leg.minutes == null || leg.source === "none";
  const reason = missing ? "" : usefulLegReason(leg.recommendationReason, hasYoungChild(trip.childAges));
  return (
    <div className="mb-2 ml-3 border-l border-line pl-3">
      {(leg.meters ?? 0) >= 8000 ? <p className="text-xs font-semibold tracking-brand text-accent">EXCURSION</p> : <p className="text-xs font-semibold tracking-brand text-accent">↓ BEST WAY</p>}
      <p className="text-sm text-cream">{missing ? "Route not calculated" : leg.label}</p>
      {reason ? <p className="text-sm text-mute">{reason}</p> : null}
      {missing ? <p className="text-sm text-mute">Couldn't time this hop.</p> : null}
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setOpen((value) => !value)} className="press min-h-11 text-sm text-mute">Alternatives</button>
        {from && to ? <NavigateControl from={{ lat: from.lat, lng: from.lng, name: routeLabel(from) }} to={{ lat: to.lat, lng: to.lng, name: routeLabel(to) }} mode={leg.shown ?? "taxi"} countryCode={trip.countryCode} /> : null}
      </div>
      {open ? (
        <div className="mt-2 grid gap-2">
          {(leg.alternatives ?? []).map((alt) => (
            <button key={alt.mode} type="button" disabled={alt.source === "unavailable" || alt.minutes == null} onClick={() => onMode(alt.mode)} className="press min-h-11 rounded-xl px-3 text-left text-sm text-cream ring-1 ring-line">
              {alt.label}{alt.mode === leg.recommendedMode ? " · Suggested" : ""}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StopMenu({ onEarlier, onLater, onRemove, onNearby }: { onEarlier: () => void; onLater: () => void; onRemove: () => void; onNearby: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" aria-label="Stop actions" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="press min-h-11 min-w-11 rounded-xl text-lg text-cream ring-1 ring-line">⋯</button>
      {open ? (
        <div className="absolute right-0 z-20 mt-1 grid min-w-44 rounded-xl bg-panel p-1 ring-1 ring-line">
          <button type="button" onClick={() => { onEarlier(); setOpen(false); }} className="press min-h-11 rounded-lg px-3 text-left text-sm text-cream">Move earlier</button>
          <button type="button" onClick={() => { onLater(); setOpen(false); }} className="press min-h-11 rounded-lg px-3 text-left text-sm text-cream">Move later</button>
          <button type="button" onClick={() => { onNearby(); setOpen(false); }} className="press min-h-11 rounded-lg px-3 text-left text-sm text-cream">Find nearby</button>
          <button type="button" onClick={() => { onRemove(); setOpen(false); }} className="press min-h-11 rounded-lg px-3 text-left text-sm text-cream">Remove</button>
        </div>
      ) : null}
    </div>
  );
}

function NearbySheet({ title, note, rows, trip, onClose, onOpen, onAdd }: {
  title: string;
  note: string;
  rows: NearbyOption[];
  trip: Trip;
  onClose: () => void;
  onOpen: (id: string) => void;
  onAdd: (id: string) => void;
}) {
  const bands: { id: NearbyOption["band"]; label: string }[] = [
    { id: "pick", label: "Kairos picks" },
    { id: "essential", label: "Essential nearby" },
    { id: "fit", label: "Good fit" },
    { id: "food", label: "Food" },
    { id: "coffee", label: "Coffee / break" },
    { id: "scenery", label: "Scenery" },
    { id: "later", label: "If you have more time" },
  ];
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/70 lg:items-center" role="dialog" aria-label={title}>
      <button type="button" className="absolute inset-0" aria-label="Close nearby" onClick={onClose} />
      <div className="relative flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-panel ring-1 ring-line lg:max-h-[80vh] lg:max-w-lg lg:rounded-2xl">
        <div className="flex items-start justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div>
            <p className="text-xs font-semibold tracking-brand text-accent">{title}</p>
            <p className="text-sm text-cream">{note}</p>
          </div>
          <button type="button" onClick={onClose} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Close</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {!rows.length ? <p className="text-sm text-mute">Nothing nearby fits this window. The rest of Discover is unchanged.</p> : null}
          {bands.map((band) => {
            const items = rows.filter((row) => row.band === band.id);
            if (!items.length) return null;
            return (
              <section key={band.id} className="mb-4">
                <p className="text-xs font-semibold tracking-brand text-accent">{band.label.toUpperCase()}</p>
                <ul className="mt-2 space-y-2">
                  {items.map((row) => {
                    const stop = trip.stops.find((item) => item.id === row.stopId);
                    if (!stop) return null;
                    return (
                      <li key={row.stopId} className="rounded-xl bg-ink px-3 py-3">
                        <button type="button" onClick={() => onOpen(stop.id)} className="press min-h-11 w-full text-left">
                          <PlaceTitle place={stop} />
                          <span className="text-sm text-mute">{kindLabel(stop.category)} · {durationPhrase(row.visitMinutes)}</span>
                        </button>
                        <p className="mt-1 text-sm text-cream">{row.whyNow}</p>
                        <button type="button" onClick={() => onAdd(stop.id)} className="press mt-2 min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Add</button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function DiscoverView({ trip, onOpen, onChange, onPhoto }: { trip: Trip; onOpen: (id: string) => void; onChange: (trip: Trip) => void; onPhoto: (stopId: string, photo: PlacePhotoRecord) => void }) {
  const discoverKey = trip.stops.filter((stop) => stop.day == null && stop.category !== "stay" && stop.provider !== "area").map((stop) => stop.id).join("|");
  useEffect(() => {
    const rows = trip.stops.filter((stop) => stop.day == null && stop.category !== "stay" && stop.provider !== "area");
    void prefetchScheduledPhotos(rows, []);
  }, [trip.id, discoverKey]);
  const [query, setQuery] = useState("");
  const sections = discoverSections(trip);
  const needle = query.trim();
  const seen = new Set<string>();
  const matches = needle
    ? trip.stops.filter((stop) => {
      const key = stop.providerId || stop.id;
      if (seen.has(key) || !placeMatches(stop, needle)) return false;
      seen.add(key);
      return true;
    })
    : [];
  return (
    <div className="grid gap-4">
      {trip.cluster ? <p className="text-sm text-cream">{trip.cluster}</p> : null}
      <label className="text-xs text-mute">Search places
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nagoya Castle or 名古屋城" className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
      </label>
      {needle ? (
        matches.length ? (
          <ul className="space-y-2">
            {matches.map((stop) => <DiscoverCard key={stop.id} trip={trip} stop={stop} onOpen={onOpen} onChange={onChange} onPhoto={onPhoto} />)}
          </ul>
        ) : <p className="text-sm text-mute">No place matched that English, romanised, or local name.</p>
      ) : null}
      {!needle && !sections.length ? <p className="text-sm text-mute">No other places came back for this search.</p> : null}
      {!needle ? sections.map((section) => (
        <section key={section.id}>
          <p className="text-xs font-semibold tracking-brand text-accent">{section.title.toUpperCase()}</p>
          <ul className="mt-2 space-y-2">
            {section.stops.map((stop) => <DiscoverCard key={`${section.id}-${stop.id}`} trip={trip} stop={stop} onOpen={onOpen} onChange={onChange} onPhoto={onPhoto} />)}
          </ul>
        </section>
      )) : null}
    </div>
  );
}

function DiscoverCard({ trip, stop, onOpen, onChange, onPhoto }: { trip: Trip; stop: TripStop; onOpen: (id: string) => void; onChange: (trip: Trip) => void; onPhoto: (stopId: string, photo: PlacePhotoRecord) => void }) {
  const best = bestDayFor(trip, stop.id);
  return (
    <li className="rounded-xl bg-ink px-3 py-3">
      <div className="flex gap-3">
        <PlacePhoto stop={stop} onPhoto={onPhoto} />
        <button type="button" onClick={() => onOpen(stop.id)} className="press min-h-11 flex-1 text-left">
          <PlaceTitle place={stop} />
          <span className="text-sm text-mute">{kindLabel(stop.category)}{stop.story?.visitLabel ? ` · ${stop.story.visitLabel}` : ` · ${durationPhrase(stop.duration)}`}</span>
          {stop.story?.shortDescription ? <span className="mt-1 block text-sm text-cream">{stop.story.shortDescription}</span> : null}
          {stop.story?.bestFor.length ? <span className="mt-1 block text-sm text-mute">{stop.story.bestFor.slice(0, 3).join(" · ")}</span> : null}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => onChange(scheduleStop(trip, stop.id, best?.day ?? 0))} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Add to day {(best?.day ?? 0) + 1}</button>
        <button type="button" onClick={() => onChange(savePlace(trip, stop.id))} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Save</button>
        <button type="button" onClick={() => onChange(excludePlace(trip, stop.id))} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Not for me</button>
      </div>
    </li>
  );
}

function stopSummary(stop: TripStop): string {
  if (stop.category === "stay") return stop.bookingStatus === "booked" ? "Your hotel" : stop.provider === "area" ? "Suggested area" : "Base";
  const hours = hoursLine(stop.opening);
  return [visitKind(stop), durationPhrase(stop.duration), hours].filter(Boolean).join(" · ");
}

function visitKind(stop: TripStop): string {
  const start = stop.startTime ?? "";
  if (stop.category === "restaurant" || stop.category === "cafe" || stop.category === "market") {
    if (start >= "16:30") return "Dinner";
    if (start >= "11:00") return stop.category === "cafe" ? "Coffee" : "Lunch";
    return stop.category === "cafe" ? "Coffee" : "Breakfast";
  }
  if (stop.category === "nightlife") return "Evening";
  return kindLabel(stop.category);
}

function kindLabel(category: string): string {
  const text = category.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function BookingsView({ trip, onChange }: { trip: Trip; onChange: (trip: Trip) => void }) {
  const [draft, setDraft] = useState<TripBooking>({ id: "", kind: "hotel", name: "", reference: "", when: "", address: "", notes: "", link: "" });
  function save() {
    const name = draft.name.trim();
    if (name.length < 2) return;
    const booking = { ...draft, id: `book-${Date.now()}`, name };
    let next: Trip = { ...trip, bookings: [booking, ...trip.bookings].slice(0, 30) };
    if (booking.kind === "hotel") {
      const stay = next.stops.find((stop) => stop.category === "stay" && placeMatches(stop, name));
      if (stay) next = selectBase(next, stay.id, true);
    }
    onChange(next);
    setDraft({ id: "", kind: "hotel", name: "", reference: "", when: "", address: "", notes: "", link: "" });
  }
  return (
    <div className="grid gap-3">
      <p className="text-sm text-mute">A note of what you already booked. Kairos does not sell the ticket.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs text-mute">Type
          <select value={draft.kind} onChange={(event) => setDraft({ ...draft, kind: event.target.value as TripBooking["kind"] })} className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line">
            {["flight", "hotel", "train", "reservation", "ticket", "other"].map((kind) => <option key={kind} value={kind}>{kind}</option>)}
          </select>
        </label>
        <label className="text-xs text-mute">Name
          <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
        </label>
        <label className="text-xs text-mute">Reference
          <input value={draft.reference} onChange={(event) => setDraft({ ...draft, reference: event.target.value })} className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
        </label>
        <label className="text-xs text-mute">When
          <input value={draft.when} onChange={(event) => setDraft({ ...draft, when: event.target.value })} placeholder="3 Oct, 14:20" className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
        </label>
        <label className="text-xs text-mute sm:col-span-2">Address or notes
          <input value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
        </label>
      </div>
      <button type="button" onClick={save} className="press min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink">Save booking</button>
      <ul className="space-y-2">
        {trip.bookings.map((booking) => (
          <li key={booking.id} className="rounded-xl bg-ink px-3 py-3 text-sm">
            <p className="font-semibold capitalize text-cream">{booking.kind} · {booking.name}</p>
            <p className="text-mute">{[booking.when, booking.reference, booking.notes].filter(Boolean).join(" · ")}</p>
            <button type="button" onClick={() => onChange({ ...trip, bookings: trip.bookings.filter((item) => item.id !== booking.id) })} className="press mt-2 min-h-11 text-sm text-cream">Remove</button>
          </li>
        ))}
      </ul>
      {!trip.bookings.length ? <p className="text-sm text-mute">No bookings stored.</p> : null}
    </div>
  );
}
