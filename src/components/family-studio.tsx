import { clsx } from "clsx";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { lookupPlace, reversePlace } from "@/lib/geo.functions";
import { planFamily, saveFamilyPlan } from "@/lib/family.functions";
import { FAMILY_INTERESTS, type FamilyInterest, type FamilyPace, type FamilySetting, type FamilySpan, type TravelMode, type WeatherDay } from "@/lib/family";
import { clockLabel, type PlannedStop } from "@/lib/family-day";
import { readHome, writeHome } from "@/lib/office";
import { markOf, readReading } from "@/lib/reading";
import { KairosVoice } from "@/components/kairos-voice";
import { PlanningBrief } from "@/components/planning-brief";
import { parsePlanBrief } from "@/lib/planning.functions";
import { familyChips, type FamilyPlanIntent } from "@/lib/planning-brief";
import { createGoogleCalendarUrl } from "@/lib/google-calendar";
import { ExternalActions } from "@/components/external-actions";

type Point = { label: string; address: string; latitude: number; longitude: number };
type Score = { total: number; age: number; interest: number; weather: number; practical: number; value: number; timing: number; lines: string[] };

const INTEREST_LABEL: Record<FamilyInterest, string> = {
  animals: "Animals",
  science: "Science",
  dinosaurs: "Dinosaurs",
  art: "Art",
  crafts: "Craft",
  cars: "Cars",
  trains: "Trains",
  water: "Water play",
  sports: "Sports",
  nature: "Nature",
  characters: "Characters",
  playground: "Playground",
  performances: "Performances",
  festivals: "Festivals",
  food: "Food",
  technology: "Technology",
  books: "Books",
  museum: "Museums",
  cycling: "Cycling",
  games: "Games",
};

const AVOID = [
  ["long-walks", "Long walks"],
  ["museums", "Museums"],
  ["crowds", "Crowds"],
  ["water", "Water"],
  ["noisy", "Very noisy"],
  ["high-energy", "High energy"],
] as const;

function sgtDate(offset = 0): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(new Date(Date.now() + offset * 86400000));
}

function nextSaturday(offsetWeeks = 0): string {
  const today = sgtDate(offsetWeeks * 7);
  const [year, month, day] = today.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  const weekday = date.getUTCDay();
  date.setUTCDate(date.getUTCDate() + (weekday === 6 ? 0 : 6 - weekday));
  return date.toISOString().slice(0, 10);
}

function dayName(date: string): string {
  return new Intl.DateTimeFormat("en-SG", { weekday: "long", timeZone: "Asia/Singapore" }).format(new Date(`${date}T12:00:00+08:00`));
}

function toTime(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function fromTime(value: string): number {
  const [hour, minute] = value.split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function loadSaved(): Point[] {
  try {
    const raw = JSON.parse(localStorage.getItem("kairos-family-saved") ?? "[]") as Point[];
    return Array.isArray(raw) ? raw.filter((item) => item && typeof item.latitude === "number").slice(0, 6) : [];
  } catch {
    return [];
  }
}

function homePoint(): Point | null {
  const saved = readHome();
  if (!saved || typeof saved.latitude !== "number" || typeof saved.longitude !== "number") return null;
  return { label: saved.name || "Home", address: saved.address, latitude: saved.latitude, longitude: saved.longitude };
}

export function FamilyStudio() {
  const [adults, setAdults] = useState(2);
  const [childCount, setChildCount] = useState(2);
  const [ages, setAges] = useState<number[]>([3, 8]);
  const [date, setDate] = useState(nextSaturday);
  const [when, setWhen] = useState("This weekend");
  const [originKind, setOriginKind] = useState<"home" | "current" | "choose" | "saved">("home");
  const [origin, setOrigin] = useState<Point | null>(null);
  const [endKind, setEndKind] = useState<"home" | "start" | "other">("home");
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<Point[]>([]);
  const [lookup, setLookup] = useState("");
  const [lookups, setLookups] = useState<Point[]>([]);
  const [endLookup, setEndLookup] = useState("");
  const [locating, setLocating] = useState(false);
  const [travelMode, setTravelMode] = useState<TravelMode>("drive");
  const [maxTravel, setMaxTravel] = useState(30);
  const [span, setSpan] = useState<FamilySpan>("full");
  const [startMin, setStartMin] = useState(9 * 60);
  const [endMin, setEndMin] = useState(19 * 60);
  const [pace, setPace] = useState<FamilyPace>("balanced");
  const [nap, setNap] = useState<"" | "12" | "13">("");
  const [interests, setInterests] = useState<FamilyInterest[]>([]);
  const [avoid, setAvoid] = useState<string[]>([]);
  const [budget, setBudget] = useState(100);
  const [freeOnly, setFreeOnly] = useState(false);
  const [setting, setSetting] = useState<FamilySetting>("mix");
  const [stroller, setStroller] = useState(false);
  const [toddler, setToddler] = useState(false);
  const [rainSafe, setRainSafe] = useState(false);
  const [wheelchair, setWheelchair] = useState(false);
  const [longWalk, setLongWalk] = useState(false);
  const [booking, setBooking] = useState<"any" | "free" | "nobook">("any");
  const [more, setMore] = useState(false);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState<WeatherDay | null>(null);
  const [stops, setStops] = useState<PlannedStop[]>([]);
  const [backup, setBackup] = useState<{ title: string; address: string; travelLabel: string; setting: string; placeId: string } | null>(null);
  const [score, setScore] = useState<Score | null>(null);
  const [spend, setSpend] = useState<number | null>(null);
  const [travelTotal, setTravelTotal] = useState<number | null>(null);
  const [why, setWhy] = useState("");
  const [eventsNote, setEventsNote] = useState("");
  const [bookingNote, setBookingNote] = useState("");
  const [understood, setUnderstood] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const [readingBrief, setReadingBrief] = useState(false);
  const [briefFailed, setBriefFailed] = useState(false);
  const [familyIntent, setFamilyIntent] = useState<FamilyPlanIntent | null>(null);
  const [hiddenBrief, setHiddenBrief] = useState<string[]>([]);
  const [briefLocks, setBriefLocks] = useState<Record<string, boolean>>({});
  const [briefConflicts, setBriefConflicts] = useState<{ key: string; suggested: string; current: string }[]>([]);

  useEffect(() => {
    setSavedPlaces(loadSaved());
    setOrigin(homePoint());
  }, []);

  const end = endKind === "start" ? origin : endKind === "home" ? homePoint() ?? origin : endPoint ?? origin;
  const young = ages.some((age) => age < 6);
  const ageLabel = ages.length ? ages.map((age) => `${age} yrs`).join(" + ") : "No children";

  function lockBrief(key: string) {
    setBriefLocks((current) => ({ ...current, [key]: true }));
  }

  async function applyFamily(parsed: FamilyPlanIntent, locks = briefLocks) {
    setFamilyIntent(parsed);
    const conflicts: { key: string; suggested: string; current: string }[] = [];
    if (parsed.specificDate) {
      if (locks.date && parsed.specificDate !== date) conflicts.push({ key: "date", suggested: parsed.specificDate, current: date });
      else if (!locks.date) {
        setDate(parsed.specificDate);
        setWhen(parsed.dateIntent === "tomorrow" ? "Tomorrow" : when);
      }
    }
    if (parsed.startMin != null && !locks.time) setStartMin(parsed.startMin);
    if (parsed.endMin != null) {
      if (locks.end && parsed.endMin !== endMin) conflicts.push({ key: "end", suggested: "Home by 6", current: clockLabel(endMin) });
      else if (!locks.end) setEndMin(parsed.endMin);
    }
    if (parsed.indoorOutdoor) {
      if (locks.setting && parsed.indoorOutdoor !== setting) conflicts.push({ key: "setting", suggested: parsed.indoorOutdoor, current: setting });
      else if (!locks.setting) setSetting(parsed.indoorOutdoor);
    }
    if (parsed.interests.length && !locks.interests) setInterests(parsed.interests);
    if (parsed.maxTravelMinutes != null && !locks.travel) setMaxTravel(parsed.maxTravelMinutes);
    if (parsed.travelMode && !locks.travel) setTravelMode(parsed.travelMode);
    if (parsed.pace && !locks.pace) setPace(parsed.pace);
    if (parsed.freeOnly && !locks.budget) setFreeOnly(true);
    if (parsed.stroller && !locks.stroller) setStroller(true);
    if (parsed.rainSafe && !locks.setting) setRainSafe(true);
    setBriefConflicts(conflicts);
    if (parsed.areaText && !locks.area) {
      setOriginKind("choose");
      setLookup(parsed.areaText);
      const found = await lookupPlace({ data: { query: parsed.areaText } }).catch(() => []);
      const points = found.slice(0, 4).map((hit) => ({ label: hit.name || hit.label, address: hit.address || hit.label, latitude: hit.latitude, longitude: hit.longitude }));
      setLookups(points);
      const match = points.find((point) => point.label.toLowerCase().includes(parsed.areaText!.toLowerCase()));
      if (match) setOrigin(match);
    }
  }

  function understandFamily() {
    const query = text.trim();
    if (query.length < 8) return;
    setReadingBrief(true);
    setBriefFailed(false);
    void parsePlanBrief({ data: { mode: "family", text: query, today: sgtDate() } })
      .then((result) => {
        if (result.mode !== "family") return;
        const parsed = result.intent;
        const useful = [parsed.dateIntent, parsed.indoorOutdoor, parsed.maxTravelMinutes, parsed.interests.length].filter(Boolean).length;
        if (!useful) {
          setBriefFailed(true);
          return;
        }
        return applyFamily(parsed);
      })
      .catch(() => setBriefFailed(true))
      .finally(() => setReadingBrief(false));
  }

  function setChildren(count: number) {
    const next = Math.max(0, Math.min(6, count));
    setChildCount(next);
    setAges((current) => Array.from({ length: next }, (_, index) => current[index] ?? 5));
  }

  function applyLength(next: FamilySpan) {
    setSpan(next);
    if (next === "short") {
      setStartMin(10 * 60);
      setEndMin(13 * 60);
    } else if (next === "half") {
      setStartMin(10 * 60);
      setEndMin(15 * 60);
    } else {
      setStartMin(9 * 60);
      setEndMin(19 * 60);
    }
  }

  async function search(query: string, which: "start" | "end") {
    if (query.trim().length < 2) return;
    try {
      const found = await lookupPlace({ data: { query } });
      const points = found.slice(0, 4).map((hit) => ({ label: hit.name || hit.label, address: hit.address || hit.label, latitude: hit.latitude, longitude: hit.longitude }));
      setLookups(points);
      if (which === "end" && points[0]) setEndPoint(points[0]);
    } catch {
      setLookups([]);
    }
  }

  function useCurrent() {
    if (!navigator.geolocation) {
      setError("This browser cannot share a location.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const hit = await reversePlace({ data: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
          setOrigin({
            label: hit?.name || "Current location",
            address: hit?.address || hit?.label || "Current location",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setOriginKind("current");
          setError("");
        } catch {
          setError("Kairos could not name that location.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError("Location access was blocked. Choose a place instead.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  function saveHome() {
    if (!origin) return;
    writeHome({ name: "Home", address: origin.address || origin.label, areaId: "", latitude: origin.latitude, longitude: origin.longitude });
    setOrigin({ ...origin, label: "Home" });
    setOriginKind("home");
    toast.success("Home saved on this browser");
  }

  function rememberPlace() {
    if (!origin) return;
    const next = [origin, ...savedPlaces.filter((item) => item.label !== origin.label)].slice(0, 6);
    setSavedPlaces(next);
    localStorage.setItem("kairos-family-saved", JSON.stringify(next));
    toast.success("Place saved on this browser");
  }

  async function plan(extra?: { rejected?: string[]; indoor?: boolean }) {
    if (!origin || !end) {
      setError("Choose where the day starts.");
      return;
    }
    if (endMin <= startMin + 60) {
      setError("The day needs a later home time.");
      return;
    }
    setError("");
    setPending(true);
    const nextRejected = extra?.rejected ?? rejected;
    const lockedPins = stops
      .filter((stop) => locked[stop.placeId] && (stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner"))
      .map((stop) => ({
        placeId: stop.placeId,
        kind: stop.kind as "activity" | "lunch" | "dinner",
        title: stop.title,
        address: stop.address,
        latitude: stop.latitude,
        longitude: stop.longitude,
        setting: stop.setting,
      }));
    try {
      const result = await planFamily({
        data: {
          adults,
          ages,
          when,
          date,
          location: origin.label,
          latitude: origin.latitude,
          longitude: origin.longitude,
          startAddress: origin.address,
          endLabel: end.label,
          endAddress: end.address,
          endLatitude: end.latitude,
          endLongitude: end.longitude,
          maxTravel,
          budget: freeOnly ? 0 : budget,
          freeOnly,
          setting: extra?.indoor ? "indoor" : setting,
          interests,
          avoid,
          toddler: toddler || ages.some((age) => age < 4),
          stroller,
          mixedAge: ages.length > 1,
          rainSafe: extra?.indoor ? true : rainSafe,
          wheelchair,
          longWalk,
          span,
          pace,
          travelMode,
          startMin,
          endMin,
          napStart: young && nap === "12" ? 12 * 60 : young && nap === "13" ? 13 * 60 : null,
          napEnd: young && nap === "12" ? 14 * 60 : young && nap === "13" ? 15 * 60 : null,
          booking,
          rejected: nextRejected,
          locked: extra?.rejected ? lockedPins : lockedPins,
          text,
        },
      });
      setWeather(result.weather);
      setStops(result.stops);
      setBackup(result.backup);
      setScore(result.score);
      setSpend(result.spend);
      setTravelTotal(result.travelTotal);
      setWhy(result.why);
      setEventsNote(result.eventsNote);
      setBookingNote(result.bookingNote);
      setUnderstood(result.understood);
      if (!result.stops.some((stop) => stop.kind === "activity")) setError("Nothing real fitted that day. Widen the travel time, or drop a filter.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The family plan did not land.");
    } finally {
      setPending(false);
    }
  }

  function another() {
    const ids = stops.filter((stop) => stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner").map((stop) => stop.placeId).filter((id) => id && !locked[id]);
    const next = [...new Set([...rejected, ...ids])];
    setRejected(next);
    void plan({ rejected: next });
  }

  function remix() {
    const ids = stops.filter((stop) => (stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner") && !locked[stop.placeId]).map((stop) => stop.placeId);
    const next = [...new Set([...rejected, ...ids])];
    setRejected(next);
    void plan({ rejected: next });
  }

  const bonus = score ? markOf(readReading(`${date}T10:00:00+08:00`, "family day").score) : null;
  const publicStops = useMemo(
    () =>
      stops.map((stop) =>
        stop.kind === "leave" || stop.kind === "home" || stop.kind === "return" ? { ...stop, address: "" } : stop,
      ),
    [stops],
  );

  async function onSave() {
    if (!origin || !score) return;
    const payload = {
      title: `${dayName(date)} family plan`,
      startDate: date,
      startTime: toTime(startMin),
      endTime: toTime(endMin),
      startLocation: origin.label === "Home" ? "Home" : origin.label,
      endLocation: end?.label === "Home" ? "Home" : end?.label || "End",
      adults,
      childAges: ages,
      budget: freeOnly ? 0 : budget,
      travelMode,
      pace,
      interests,
      preferences: { setting, booking },
      familyScore: score.total,
      stops: publicStops.map((stop, index) => ({
        sequence: index,
        stopType: stop.kind,
        title: stop.title,
        address: stop.address,
        latitude: stop.kind === "leave" || stop.kind === "home" ? null : stop.latitude,
        longitude: stop.kind === "leave" || stop.kind === "home" ? null : stop.longitude,
        startTime: clockLabel(stop.startMin),
        endTime: clockLabel(stop.endMin),
        estimatedCost: stop.cost,
        indoorOutdoor: stop.setting,
        sourceUrl: "",
        sourceType: stop.liveLabel || "place",
        locked: Boolean(locked[stop.placeId]),
      })),
    };
    localStorage.setItem("kairos-family-plan", JSON.stringify(payload));
    try {
      const saved = await saveFamilyPlan({ data: payload });
      toast.success(saved.saved ? "Plan saved" : "Saved on this browser. The Supabase family tables are not there yet.");
    } catch {
      toast.success("Saved on this browser");
    }
  }

  function onShare() {
    const lines = publicStops.map((stop) => `${clockLabel(stop.startMin)} ${stop.title}${stop.address ? ` — ${stop.address}` : ""}`);
    void navigator.clipboard.writeText([`${dayName(date)} family plan`, ...lines].join("\n"));
    toast.success("Copied. Home street is left out.");
  }

  function onCalendar() {
    if (!stops.length) return;
    const first = stops.find((stop) => stop.kind === "activity");
    const start = new Date(`${date}T${toTime(startMin)}:00+08:00`);
    const url = createGoogleCalendarUrl({
      title: `${dayName(date)} family plan`,
      startTime: start.toISOString(),
      durationMinutes: Math.max(60, endMin - startMin),
      meetingFormat: "physical",
      venueName: first?.title,
      address: first?.address,
      purpose: publicStops.map((stop) => `${clockLabel(stop.startMin)} ${stop.title}`).join("\n"),
      kairosScore: score?.total ?? null,
      kairosStatus: bonus ?? "",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const weatherValue = weather ? (weather.morningOutdoor ? "Outdoor morning" : "Indoor morning") : "Not checked yet";
  const weatherNote = weather ? (weather.afternoonOutdoor ? "Outdoor afternoon" : "Indoor afternoon") : "Real forecast, once you plan";

  return (
    <>
      <form
        className="lg:col-span-2"
        onSubmit={(event) => {
          event.preventDefault();
          setRejected([]);
          setLocked({});
          void plan({ rejected: [] });
        }}
      >
        <PlanningBrief
          mode="family"
          kicker="FAMILY"
          question="What would make a good family day?"
          hint="Tell Kairos when, who’s coming and what the kids are into. Ages stay on the form, not guessed from the sentence."
          placeholder="Something indoors tomorrow afternoon for the kids. They like animals and science, and I don’t want to drive more than 20 minutes."
          value={text}
          onChange={setText}
          onUnderstand={understandFamily}
          reading={readingBrief}
          failed={briefFailed}
          chips={familyIntent ? familyChips(familyIntent).filter((chip) => !hiddenBrief.includes(chip.id)) : []}
          onRemove={(chip) => { lockBrief(chip.lock); setHiddenBrief((current) => [...current, chip.id]); }}
          aside={familyIntent?.aside ?? ""}
          conflicts={briefConflicts}
          onKeep={(key) => setBriefConflicts((items) => items.filter((item) => item.key !== key))}
          onUse={(key) => {
            const next = { ...briefLocks, [key]: false };
            setBriefLocks(next);
            if (familyIntent) void applyFamily(familyIntent, next);
          }}
        />

        <p className="mt-4 text-sm font-medium text-cream">Starting from</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={originKind === "home"} onClick={() => { setOriginKind("home"); setOrigin(homePoint()); }}>Home</Chip>
          <Chip on={originKind === "current"} onClick={useCurrent}>{locating ? "Finding you…" : "Current location"}</Chip>
          <Chip on={originKind === "choose"} onClick={() => setOriginKind("choose")}>Choose location</Chip>
          <Chip on={originKind === "saved"} onClick={() => setOriginKind("saved")}>Saved place</Chip>
          <Chip on={false} onClick={rememberPlace}>+</Chip>
        </div>
        {originKind === "home" && !homePoint() ? <p className="mt-2 text-sm text-mute">Set your home location.</p> : null}
        {origin ? <p className="mt-2 text-sm text-cream">{origin.label}{origin.address && origin.label !== "Home" ? ` · ${origin.address}` : ""}</p> : null}
        {originKind === "home" || originKind === "choose" ? (
          <div className="mt-2">
            <input value={lookup} onChange={(event) => setLookup(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void search(lookup, "start"); } }} placeholder="Address, building, postal code, or neighbourhood" className="h-12 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
            <div className="mt-2 flex flex-wrap gap-2">
              {lookups.map((hit) => (
                <Chip key={`${hit.latitude}-${hit.label}`} on={origin?.label === hit.label} onClick={() => setOrigin(hit)}>{hit.label}</Chip>
              ))}
            </div>
            {origin && originKind === "home" ? <button type="button" onClick={saveHome} className="press mt-2 min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Save as Home</button> : null}
          </div>
        ) : null}
        {originKind === "saved" ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {savedPlaces.length ? savedPlaces.map((place) => (
              <Chip key={place.label} on={origin?.label === place.label} onClick={() => setOrigin(place)}>{place.label}</Chip>
            )) : <p className="text-sm text-mute">No saved place yet. Choose one, then +.</p>}
          </div>
        ) : null}

        <p className="mt-4 text-sm font-medium text-cream">End at</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={endKind === "home"} onClick={() => setEndKind("home")}>Back home</Chip>
          <Chip on={endKind === "start"} onClick={() => setEndKind("start")}>Same as start</Chip>
          <Chip on={endKind === "other"} onClick={() => setEndKind("other")}>Choose another location</Chip>
        </div>
        {endKind === "other" ? (
          <input value={endLookup} onChange={(event) => setEndLookup(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void search(endLookup, "end"); } }} placeholder="Where the day should finish" className="mt-2 h-12 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
        ) : null}

        <p className="mt-4 text-sm font-medium text-cream">How are we getting around?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {([["drive", "Drive"], ["transit", "Public transport"], ["ride", "Taxi / ride-hail"], ["walk", "Walk"]] as const).map(([id, label]) => (
            <Chip key={id} on={travelMode === id} onClick={() => { lockBrief("travel"); setTravelMode(id); }}>{label}</Chip>
          ))}
        </div>
        <p className="mt-4 text-sm font-medium text-cream">Max one-way travel</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[15, 20, 30, 45, 60].map((minutes) => (
            <Chip key={minutes} on={maxTravel === minutes} onClick={() => { lockBrief("travel"); setMaxTravel(minutes); }}>{`${minutes} min`}</Chip>
          ))}
          <Chip on={maxTravel === 120} onClick={() => { lockBrief("travel"); setMaxTravel(120); }}>No preference</Chip>
        </div>

        <p className="mt-4 text-sm font-medium text-cream">Plan length</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={span === "short"} onClick={() => applyLength("short")}>2–3 hours</Chip>
          <Chip on={span === "half"} onClick={() => applyLength("half")}>Half day</Chip>
          <Chip on={span === "full"} onClick={() => applyLength("full")}>Full day</Chip>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          <label className="text-sm text-cream">Start<input type="time" value={toTime(startMin)} onChange={(event) => setStartMin(fromTime(event.target.value))} className="mt-1 block h-12 rounded-xl bg-ink px-3 text-cream ring-1 ring-line" /></label>
          <label className="text-sm text-cream">Back home by<input type="time" value={toTime(endMin)} onChange={(event) => { lockBrief("end"); setEndMin(fromTime(event.target.value)); }} className="mt-1 block h-12 rounded-xl bg-ink px-3 text-cream ring-1 ring-line" /></label>
        </div>

        <p className="mt-4 text-sm font-medium text-cream">When</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={when === "Today"} onClick={() => { setWhen("Today"); setDate(sgtDate()); }}>Today</Chip>
          <Chip on={when === "Tomorrow"} onClick={() => { setWhen("Tomorrow"); setDate(sgtDate(1)); }}>Tomorrow</Chip>
          <Chip on={when === "This weekend"} onClick={() => { setWhen("This weekend"); setDate(nextSaturday()); }}>This weekend</Chip>
          <Chip on={when === "Next weekend"} onClick={() => { setWhen("Next weekend"); setDate(nextSaturday(1)); }}>Next weekend</Chip>
        </div>
        <input type="date" value={date} onChange={(event) => { setDate(event.target.value); setWhen("Choose dates"); }} className="mt-2 h-12 rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />

        <div className="mt-4 flex flex-wrap gap-4">
          <Count label="Adults" value={adults} min={1} max={8} onChange={setAdults} />
          <Count label="Children" value={childCount} min={0} max={6} onChange={setChildren} />
        </div>
        {ages.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {ages.map((age, index) => (
              <label key={index} className="text-sm text-mute">Child {index + 1}
                <input type="number" min={0} max={17} value={age} onChange={(event) => setAges((current) => current.map((item, itemIndex) => (itemIndex === index ? Math.max(0, Math.min(17, Number(event.target.value) || 0)) : item)))} className="mt-1 block h-12 w-20 rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
              </label>
            ))}
          </div>
        ) : null}

        <p className="mt-4 text-sm font-medium text-cream">Pace</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["relaxed", "balanced", "packed"] as const).map((item) => (
            <Chip key={item} on={pace === item} onClick={() => { lockBrief("pace"); setPace(item); }}>{item === "packed" ? "Pack it in" : item === "relaxed" ? "Relaxed" : "Balanced"}</Chip>
          ))}
        </div>
        {young ? (
          <>
            <p className="mt-4 text-sm font-medium text-cream">Nap / rest window</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip on={nap === ""} onClick={() => setNap("")}>None</Chip>
              <Chip on={nap === "12"} onClick={() => setNap("12")}>12–2 PM</Chip>
              <Chip on={nap === "13"} onClick={() => setNap("13")}>1–3 PM</Chip>
            </div>
          </>
        ) : null}

        <p className="mt-4 text-sm font-medium text-cream">Interests</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {FAMILY_INTERESTS.map((item) => (
            <Chip key={item} on={interests.includes(item)} onClick={() => { lockBrief("interests"); setInterests((current) => (current.includes(item) ? current.filter((id) => id !== item) : [...current, item])); }}>{INTEREST_LABEL[item]}</Chip>
          ))}
        </div>
        <p className="mt-4 text-sm font-medium text-cream">Not interested in</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {AVOID.map(([id, label]) => (
            <Chip key={id} on={avoid.includes(id)} onClick={() => setAvoid((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))}>{label}</Chip>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-cream">Family total</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={freeOnly} onClick={() => setFreeOnly(true)}>Free only</Chip>
          {[30, 60, 100, 150].map((amount) => (
            <Chip key={amount} on={!freeOnly && budget === amount} onClick={() => { setFreeOnly(false); setBudget(amount); }}>{`≤ $${amount}`}</Chip>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-cream">Indoor / outdoor</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {([["mix", "Mix both"], ["either", "Either"], ["indoor", "Indoor"], ["outdoor", "Outdoor"]] as const).map(([id, label]) => (
            <Chip key={id} on={setting === id} onClick={() => { lockBrief("setting"); setSetting(id); }}>{label}</Chip>
          ))}
        </div>

        <button type="button" onClick={() => setMore((value) => !value)} className="mt-4 text-sm font-semibold text-accent">{more ? "Hide preferences" : "More preferences"}</button>
        {more ? (
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip on={toddler} onClick={() => setToddler((value) => !value)}>Toddler friendly</Chip>
            <Chip on={stroller} onClick={() => { lockBrief("stroller"); setStroller((value) => !value); }}>Stroller friendly</Chip>
            <Chip on={wheelchair} onClick={() => setWheelchair((value) => !value)}>Wheelchair accessible</Chip>
            <Chip on={longWalk} onClick={() => setLongWalk((value) => !value)}>Avoid long walks</Chip>
            <Chip on={rainSafe} onClick={() => { lockBrief("setting"); setRainSafe((value) => !value); }}>Rain-safe</Chip>
            <Chip on={booking === "any"} onClick={() => setBooking("any")}>Anything</Chip>
            <Chip on={booking === "nobook"} onClick={() => setBooking("nobook")}>No booking needed</Chip>
            <Chip on={booking === "free"} onClick={() => { setBooking("free"); setFreeOnly(true); }}>Free entry preferred</Chip>
          </div>
        ) : null}
        <p className="mt-2 text-xs text-mute">Crowds, toilets, parking, and booking are not verified unless the map says so.</p>

        {error ? <p role="alert" className="mt-4 text-sm text-vermilion">{error}</p> : null}
        <button type="submit" disabled={pending || !origin} className="press mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-accent-ink disabled:opacity-50">
          {pending ? "Checking routes and weather…" : "Plan something for us"}
        </button>
      </form>

      <aside className="lg:col-span-3">
        <section className="rounded-2xl bg-panel p-5 shadow-card sm:p-7">
          <p className="text-xs font-semibold tracking-brand text-accent">AGE + WEATHER + INTERESTS</p>
          <h2 className="mt-2 font-sans text-3xl font-semibold leading-tight text-cream">A day the household can actually keep.</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Factor tone="accent" kicker="AGE FIT" value={ageLabel} note={`${adults} adults · ${span === "full" ? "Full day" : span === "half" ? "Half day" : "2–3 hours"}`} />
            <Factor tone={weather?.morningOutdoor ? "leaf" : "sky"} kicker="WEATHER FIT" value={weatherValue} note={weatherNote} />
            <Factor tone="sun" kicker="VALUE FIT" value={freeOnly ? "Free only" : `≤ $${budget}`} note={origin ? `Start ${origin.label}` : "Start not set"} />
          </div>
          <ul className="mt-4 space-y-1 text-sm text-cream">
            {(understood.length ? understood : ["Both children’s ages", "Start and end", "Weather-aware", `${pace} pace`]).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {weather ? (
            <p className="mt-3 text-sm text-mute">
              {dayName(date)} · {weather.windowLabel}. {weather.windowNote}. Rain peaks at {Math.round(weather.maxRain)}%.
              {weather.thunder ? " Thunder is in the forecast." : ""} Kairos does not guess this.
            </p>
          ) : null}

          {score ? (
            <div className="mt-6 rounded-xl bg-ink px-4 py-4 ring-1 ring-accent">
              <p className="text-xs font-semibold tracking-brand text-accent">FAMILY KAIROS FIT</p>
              <p className="mt-1 font-display text-4xl text-accent">{score.total}<span className="text-2xl text-mute"> / 100</span></p>
              <p className="mt-2 text-sm text-mute">Age {score.age}/25 · Interest {score.interest}/20 · Weather {score.weather}/20 · Practical {score.practical}/15 · Value {score.value}/10 · Timing {score.timing}/10</p>
              {bonus ? <p className="mt-2 text-sm text-mute">Bonus {bonus}. It does not override weather, ages, or travel.</p> : null}
              <KairosVoice mode="family" text={why} status={weather && !weather.afternoonOutdoor ? "warning" : weather?.morningOutdoor ? "good" : "neutral"} />
              <p className="mt-2 text-sm text-mute">
                {spend == null ? "Estimated family spend: price unavailable" : `Estimated family spend ~$${spend}. Typical figures only, not a quote.`}
                {travelTotal != null ? ` · Verified travel ~${travelTotal} min` : ""}
              </p>
              <p className="mt-2 text-xs text-mute">{eventsNote} {bookingNote}</p>
            </div>
          ) : null}

          {stops.length ? (
            <ol className="mt-6 space-y-3">
              {stops.map((stop) => (
                <li key={stop.id} className="rounded-xl bg-ink px-4 py-3">
                  <p className="text-xs font-semibold tracking-brand text-sky">{clockLabel(stop.startMin)}{stop.endMin !== stop.startMin ? `–${clockLabel(stop.endMin)}` : ""}</p>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-brand text-accent">{stop.liveLabel || stop.kind.toUpperCase()}</p>
                      <h3 className="font-display text-2xl text-cream">{stop.title}</h3>
                      {stop.address ? <p className="text-sm text-cream">{stop.address}</p> : null}
                      <p className="mt-1 text-sm text-mute">
                        {stop.travelLabel ? `${stop.travelLabel} from the previous stop` : ""}
                        {stop.setting ? ` · ${stop.setting === "indoor" ? "Indoor" : "Outdoor"}` : ""}
                        {stop.ages ? ` · ${stop.ages}` : ""}
                      </p>
                      {stop.opening ? <p className="text-xs text-mute">Hours on the map: {stop.opening}</p> : null}
                      <p className="mt-1 text-sm text-cream">{stop.cost == null ? (stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner" ? "Price unavailable" : stop.why) : `Typical ~$${stop.cost}/pax, not a quote`}</p>
                      {stop.why && stop.cost != null ? <p className="text-sm text-mute">{stop.why}</p> : null}
                    </div>
                    {stop.placeId && stop.kind !== "leave" && stop.kind !== "home" && stop.kind !== "return" && stop.kind !== "rest" && stop.kind !== "snack" ? (
                      <button type="button" aria-pressed={Boolean(locked[stop.placeId])} onClick={() => setLocked((current) => ({ ...current, [stop.placeId]: !current[stop.placeId] }))} className={clsx("press min-h-11 shrink-0 rounded-xl px-3 text-sm font-semibold", locked[stop.placeId] ? "bg-accent text-accent-ink" : "text-accent ring-1 ring-accent")}>
                        {locked[stop.placeId] ? "Keep" : "Lock"}
                      </button>
                    ) : null}
                  </div>
                  {stop.kind === "activity" || stop.kind === "lunch" || stop.kind === "dinner" ? (
                    <ExternalActions
                      input={{
                        mode: "family",
                        kind: stop.kind === "activity" ? "attraction" : "restaurant",
                        countryCode: "SG",
                        navMode: travelMode === "walk" ? "walk" : travelMode === "transit" ? "transit" : "drive",
                        from: (() => {
                          const index = stops.findIndex((item) => item.id === stop.id);
                          const previous = stops[index - 1];
                          return previous ? { lat: previous.latitude, lng: previous.longitude, name: previous.title } : undefined;
                        })(),
                        place: { id: stop.placeId, name: stop.title, address: stop.address, city: "Singapore", countryCode: "SG", lat: stop.latitude, lng: stop.longitude },
                      }}
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}

          {backup ? (
            <div className="mt-4 rounded-xl bg-ink px-4 py-4 ring-1 ring-sky">
              <p className="text-xs font-semibold tracking-brand text-sky">WEATHER BACKUP</p>
              <h3 className="mt-1 font-display text-2xl text-cream">{backup.title}</h3>
              <p className="text-sm text-cream">{backup.address}</p>
              <p className="mt-1 text-sm text-mute">{backup.travelLabel} · {backup.setting}</p>
            </div>
          ) : null}

          {stops.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={another} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Another plan</button>
              <button type="button" onClick={remix} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Remix unlocked parts</button>
              <button type="button" onClick={() => void plan({ indoor: true })} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-sky ring-1 ring-sky">Indoor backup</button>
              <button type="button" onClick={() => void onSave()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Save plan</button>
              <button type="button" onClick={onShare} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Share with family</button>
              <button type="button" onClick={onCalendar} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Add itinerary to calendar</button>
            </div>
          ) : null}
        </section>
      </aside>
    </>
  );
}

function Count({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="text-sm text-cream">{label}
      <input type="number" min={min} max={max} value={value} onChange={(event) => onChange(Math.max(min, Math.min(max, Number(event.target.value) || min)))} className="mt-1 block h-12 w-24 rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
    </label>
  );
}

function Factor({ kicker, value, note, tone }: { kicker: string; value: string; note: string; tone: "accent" | "sky" | "sun" | "leaf" }) {
  const toneClass = { accent: "border-accent text-accent", sky: "border-sky text-sky", sun: "border-sun text-sun", leaf: "border-leaf text-leaf" }[tone];
  return (
    <div className={clsx("border-l-2 pl-3", toneClass)}>
      <p className="text-xs font-semibold tracking-brand">{kicker}</p>
      <p className="mt-1 text-lg font-semibold text-cream">{value}</p>
      <p className="text-sm text-mute">{note}</p>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", on ? "bg-accent text-accent-ink" : "bg-panel text-cream ring-1 ring-line")}>
      {children}
    </button>
  );
}
