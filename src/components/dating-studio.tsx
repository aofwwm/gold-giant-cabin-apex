import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { lookupPlace, reversePlace } from "@/lib/geo.functions";
import { planDate, parseDateBrief, saveDatingPlan } from "@/lib/dating.functions";
import { intentChips, reconcileControls, budgetLabel, type DatingControls, type DatingIntent, type IntentConflict, type LockKey } from "@/lib/dating-intent";
import { DATE_FOODS, DATE_TYPES, DATE_VIBES, readSeenPlaces, rememberSeenPlaces, type DateFood, type DateType, type DateVibe, type DatingPlan, type DatingScore, type DatingStop, type SelectedOrigin } from "@/lib/dating";
import { clockLabel } from "@/lib/family-day";
import { generateInviteSlug, readDatingInviteLink, readDatingPlanId, saveDatingPlanId } from "@/lib/dating-invite";
import { DatingInvitePanel } from "@/components/dating-invite-panel";
import { KairosVoice } from "@/components/kairos-voice";
import { PlanningBrief } from "@/components/planning-brief";
import { markOf, readReading } from "@/lib/reading";
import { createGoogleCalendarUrl } from "@/lib/google-calendar";
import { ExternalActions } from "@/components/external-actions";
import { readHome, writeHome } from "@/lib/office";
import type { WeatherDay } from "@/lib/family";

type Point = SelectedOrigin;

const TYPE_LABEL: Record<DateType, string> = {
  first: "First date",
  casual: "Casual date",
  night: "Date night",
  anniversary: "Anniversary",
  surprise: "Surprise date",
  married: "Married couple",
  parents: "Parents’ night out",
};

const WHEN = [
  ["breakfast", "Breakfast", 9 * 60],
  ["brunch", "Brunch", 11 * 60],
  ["afternoon", "Afternoon", 14 * 60],
  ["sunset", "Sunset", 17 * 60 + 30],
  ["dinner", "Dinner", 19 * 60],
  ["night", "Night", 20 * 60 + 30],
] as const;

function sgtDate(offset = 0): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(new Date(Date.now() + offset * 86400000));
}

function nextFriday(): string {
  const today = sgtDate();
  const [year, month, day] = today.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  const weekday = date.getUTCDay();
  const hop = weekday === 5 ? 0 : (5 - weekday + 7) % 7;
  date.setUTCDate(date.getUTCDate() + hop);
  return date.toISOString().slice(0, 10);
}

function timeValue(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function dayName(date: string): string {
  return new Intl.DateTimeFormat("en-SG", { weekday: "long", timeZone: "Asia/Singapore" }).format(new Date(`${date}T12:00:00+08:00`));
}

export function DatingStudio() {
  const [text, setText] = useState("");
  const [locks, setLocks] = useState<Partial<Record<LockKey, boolean>>>({});
  const [intent, setIntent] = useState<DatingIntent | null>(null);
  const [reading, setReading] = useState(false);
  const [conflicts, setConflicts] = useState<IntentConflict[]>([]);
  const [hiddenChips, setHiddenChips] = useState<string[]>([]);
  const [tightHop, setTightHop] = useState(false);
  const [avoid, setAvoid] = useState<string[]>([]);
  const [pendingPlace, setPendingPlace] = useState("");
  const [dateType, setDateType] = useState<DateType>("first");
  const [startMin, setStartMin] = useState(19 * 60);
  const [span, setSpan] = useState<"quick" | "half" | "full">("half");
  const [budget, setBudget] = useState(80);
  const [freeOnly, setFreeOnly] = useState(false);
  const [date, setDate] = useState(nextFriday);
  const [origin, setOrigin] = useState<Point | null>(null);
  const [lookup, setLookup] = useState("");
  const [lookups, setLookups] = useState<Point[]>([]);
  const [lookupNote, setLookupNote] = useState("");
  const [locating, setLocating] = useState(false);
  const searchGen = useRef(0);
  const parseGen = useRef(0);
  const locksRef = useRef(locks);
  locksRef.current = locks;
  const [maxTravel, setMaxTravel] = useState(30);
  const [travelMode, setTravelMode] = useState<"drive" | "walk" | "ride" | "transit">("drive");
  const [setting, setSetting] = useState<"indoor" | "outdoor" | "either" | "mix">("either");
  const [vibes, setVibes] = useState<DateVibe[]>(["cosy", "quiet"]);
  const [foods, setFoods] = useState<DateFood[]>(["dinner", "dessert"]);
  const [pressure, setPressure] = useState<"low" | "balanced" | "memorable">("low");
  const [formality, setFormality] = useState<"casual" | "smart" | "dress">("smart");
  const [alcohol, setAlcohol] = useState<"any" | "none" | "ok">("any");
  const [crowd, setCrowd] = useState<"avoid" | "ok" | "lively">("ok");
  const [diets, setDiets] = useState<string[]>([]);
  const [more, setMore] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState<WeatherDay | null>(null);
  const [stops, setStops] = useState<DatingStop[]>([]);
  const [backup, setBackup] = useState<{ title: string; address: string; travelLabel: string; setting: string } | null>(null);
  const [planId, setPlanId] = useState("");
  const [restoreInvite, setRestoreInvite] = useState(false);
  const [score, setScore] = useState<DatingScore | null>(null);
  const [datePlan, setDatePlan] = useState<DatingPlan | null>(null);
  const [spin, setSpin] = useState(0);
  const [spend, setSpend] = useState<number | null>(null);
  const [why, setWhy] = useState("");
  const [eventsNote, setEventsNote] = useState("");
  const [widenNote, setWidenNote] = useState("");
  const [understood, setUnderstood] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [rejectedVenues, setRejectedVenues] = useState<string[]>([]);
  const [locked, setLocked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const id = readDatingPlanId();
    if (!id) return;
    setPlanId(id);
    setRestoreInvite(Boolean(readDatingInviteLink(id)?.plannerToken));
  }, []);

  useEffect(() => {
    if (planId) saveDatingPlanId(planId);
  }, [planId]);

  function clearPlan() {
    setStops([]);
    setBackup(null);
    setScore(null);
    setDatePlan(null);
    setWeather(null);
    setWhy("");
    setUnderstood([]);
    setEventsNote("");
    setWidenNote("");
    setSpend(null);
    setRejected([]);
    setRejectedVenues([]);
    setLocked({});
  }

  function chooseOrigin(next: Point, fromUser = true) {
    if (!Number.isFinite(next.latitude) || !Number.isFinite(next.longitude)) {
      setError("We couldn't verify this starting location.");
      return;
    }
    if (fromUser) setLocks((current) => ({ ...current, area: true }));
    setOrigin(next);
    setError("");
    clearPlan();
  }

  async function searchArea(raw = lookup) {
    const query = raw.trim();
    if (query.length < 2) {
      setLookups([]);
      setLookupNote(query ? "Type a little more of the place name." : "");
      return;
    }
    const gen = searchGen.current + 1;
    searchGen.current = gen;
    setLookupNote("");
    try {
      const found = await lookupPlace({ data: { query } });
      if (gen !== searchGen.current) return;
      const rows = found.slice(0, 5).map((hit) => ({
        source: "manual_search" as const,
        provider: "photon",
        providerId: hit.providerId || `${hit.latitude.toFixed(5)},${hit.longitude.toFixed(5)}`,
        name: hit.name || hit.label,
        formattedAddress: hit.address || hit.label,
        area: hit.area || "",
        latitude: hit.latitude,
        longitude: hit.longitude,
      }));
      setLookups(rows);
      if (!rows.length) setLookupNote("No places matched. Try a mall, an MRT, or a street.");
      else if (pendingPlace && !locksRef.current.area) {
        const match = rows.find((row) => row.name.toLowerCase().includes(pendingPlace.toLowerCase()));
        if (match) {
          setPendingPlace("");
          chooseOrigin(match, false);
        }
      }
    } catch {
      if (gen !== searchGen.current) return;
      setLookups([]);
      setLookupNote("Location search did not answer. Try again.");
    }
  }

  useEffect(() => {
    const query = lookup.trim();
    if (origin && (query === origin.name || query === origin.formattedAddress)) return;
    const handle = window.setTimeout(() => {
      void searchArea(lookup);
    }, 350);
    return () => window.clearTimeout(handle);
  }, [lookup, origin]);

  function lock(key: LockKey) {
    setLocks((current) => ({ ...current, [key]: true }));
    setConflicts((current) => current.filter((item) => item.key !== key));
  }

  function controlsNow(): DatingControls {
    return { dateType, date, startMin, span, budget, freeOnly, vibes, foods, setting, pressure, maxTravel, crowd };
  }

  function applyIntent(parsed: DatingIntent, locked = locksRef.current) {
    setIntent(parsed);
    const { next, conflicts: found } = reconcileControls(controlsNow(), parsed, locked);
    setDateType(next.dateType);
    setDate(next.date);
    setStartMin(next.startMin);
    setSpan(next.span);
    setBudget(next.budget);
    setFreeOnly(next.freeOnly);
    setVibes(next.vibes);
    setFoods(next.foods);
    setSetting(next.setting);
    setPressure(next.pressure);
    setMaxTravel(next.maxTravel);
    setCrowd(next.crowd);
    setTightHop(!locked.travel && parsed.travelPreference === "short_second_leg");
    setAvoid(parsed.avoid);
    setConflicts(found);
    if (!locked.area && parsed.areaKind === "region" && parsed.areaLabel && parsed.latitude != null && parsed.longitude != null) {
      setLookup(parsed.areaLabel);
      setLookups([]);
      chooseOrigin({
        source: "manual_search",
        provider: "region",
        providerId: parsed.areaText || "region",
        name: parsed.areaLabel,
        formattedAddress: parsed.areaLabel,
        area: parsed.areaLabel,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
      }, false);
    } else if (!locked.area && parsed.areaKind === "place" && parsed.areaLabel) {
      setPendingPlace(parsed.areaLabel);
      setLookup(parsed.areaLabel);
    }
  }

  const applyRef = useRef(applyIntent);
  applyRef.current = applyIntent;

  function dismissChip(id: string, key: LockKey) {
    lock(key);
    setHiddenChips((current) => [...current, id]);
    if (id.startsWith("vibe-")) {
      const vibe = id.slice(5);
      setVibes((current) => current.filter((item) => item !== vibe));
    }
    if (id === "area" && origin?.provider === "region") {
      setOrigin(null);
      setLookup("");
    }
    if (id === "talk") setCrowd("ok");
    if (id === "travel") {
      setTightHop(false);
      setMaxTravel(30);
    }
  }

  function useBrief(key: LockKey) {
    const nextLocks = { ...locksRef.current, [key]: false };
    locksRef.current = nextLocks;
    setLocks(nextLocks);
    if (intent) applyIntent(intent, nextLocks);
  }

  function understandNow() {
    const query = text.trim();
    if (query.length < 8) return;
    setReading(true);
    const gen = parseGen.current + 1;
    parseGen.current = gen;
    void parseDateBrief({ data: { text: query, today: sgtDate() } })
      .then((parsed) => {
        if (gen !== parseGen.current) return;
        applyRef.current(parsed);
      })
      .catch(() => {
        if (gen !== parseGen.current) return;
      })
      .finally(() => {
        if (gen === parseGen.current) setReading(false);
      });
  }

  function pickBudget(amount: number | "free") {
    lock("budget");
    if (amount === "free") {
      setFreeOnly(true);
      noteBudget("Free");
      return;
    }
    setFreeOnly(false);
    setBudget(amount);
    noteBudget(amount >= 250 ? "Premium" : `≤ $${amount}`);
  }

  function noteBudget(current: string) {
    if (!intent || intent.budgetMax == null) return;
    const suggested = budgetLabel(intent);
    if (suggested === current) {
      setConflicts((items) => items.filter((item) => item.key !== "budget"));
      return;
    }
    setConflicts((items) => [...items.filter((item) => item.key !== "budget"), { key: "budget", suggested, current }]);
  }

  function useCurrent() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const hit = await reversePlace({ data: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
          chooseOrigin({
            source: "current",
            provider: "geolocation",
            providerId: "",
            name: hit?.name || "Current location",
            formattedAddress: hit?.address || "Current location",
            area: hit?.area || "",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  async function buildDate(extraRejected?: string[], indoor = false, nextSpin = spin, extraNames?: string[]) {
    if (!origin || !Number.isFinite(origin.latitude) || !Number.isFinite(origin.longitude)) {
      setError("We couldn't verify this starting location.");
      return;
    }
    setError("");
    setPending(true);
    const nextRejected = extraRejected ?? rejected;
    const nextNames = extraNames ?? rejectedVenues;
    try {
      const result = await planDate({
        data: {
          dateType,
          date,
          whenLabel: clockLabel(startMin),
          startMin,
          span,
          budget: freeOnly ? 0 : budget,
          freeOnly,
          latitude: origin.latitude,
          longitude: origin.longitude,
          area: origin.name,
          originAddress: origin.source === "home" ? "" : origin.formattedAddress,
          originProvider: origin.provider,
          originId: origin.providerId,
          maxTravel,
          travelMode,
          setting: indoor ? "indoor" : setting,
          vibes,
          foods,
          pressure,
          formality,
          alcohol,
          crowd,
          diets,
          goal: pressure === "low" ? "Get to know each other" : pressure === "memorable" ? "Celebrate" : "Spend quality time",
          text,
          rejected: nextRejected,
          rejectedVenues: nextNames,
          seen: readSeenPlaces(origin.latitude, origin.longitude),
          spin: nextSpin,
          tightSecondLeg: tightHop,
          avoid,
          locked: stops
            .filter((stop) => locked[stop.placeId])
            .map((stop) => ({
              placeId: stop.placeId,
              title: stop.title,
              address: stop.address,
              latitude: stop.latitude,
              longitude: stop.longitude,
              setting: stop.setting,
              kind: stop.kind,
            })),
        },
      });
      setWeather(result.weather);
      setStops(result.stops);
      setBackup(result.backup);
      setScore(result.score);
      setDatePlan(result.plan);
      setPlanId((current) => current || generateInviteSlug());
      setSpend(result.spend);
      setWhy(result.why);
      setEventsNote(result.eventsNote);
      setWidenNote(result.widenNote ?? "");
      setUnderstood(result.understood);
      if (result.discovery) console.info("[DATE DISCOVERY]", result.discovery);
      if (result.stops.length) {
        rememberSeenPlaces(origin.latitude, origin.longitude, result.stops.flatMap((stop) => [stop.placeId, stop.title]));
      }
      if (!result.stops.length) setError(travelMode === "transit" ? "Nothing real fitted that travel limit." : "Nothing real fitted that brief. Widen the travel time or the budget.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The date plan did not land.");
    } finally {
      setPending(false);
    }
  }

  function suggestedName(title: string): string {
    return title.replace(/^Explore\s+/i, "").replace(/\s+\+\s+waterfront$/i, "").trim();
  }

  function rememberRejected() {
    const open = stops.filter((stop) => !locked[stop.placeId]);
    const names = open.map((stop) => suggestedName(stop.title)).filter(Boolean);
    const ids = open.map((stop) => stop.placeId).filter(Boolean);
    const nextNames = [...new Set([...rejectedVenues, ...names])].slice(0, 48);
    const nextRejected = [...new Set([...rejected, ...ids, ...nextNames])].slice(0, 48);
    setRejectedVenues(nextNames);
    setRejected(nextRejected);
    return { nextNames, nextRejected };
  }

  function another() {
    setPlanId(generateInviteSlug());
    const { nextNames, nextRejected } = rememberRejected();
    const nextSpin = spin + 1;
    setSpin(nextSpin);
    void buildDate(nextRejected, false, nextSpin, nextNames);
  }

  function differentShape() {
    const { nextNames, nextRejected } = rememberRejected();
    const nextSpin = spin + 1;
    setSpin(nextSpin);
    void buildDate(nextRejected, false, nextSpin, nextNames);
  }

  const mark = markOf(readReading(`${date}T${String(Math.floor(startMin / 60)).padStart(2, "0")}:00:00+08:00`, "date evening").score);

  async function onSave() {
    if (!origin || !score) return;
    const payload = {
      title: `${TYPE_LABEL[dateType]} · ${dayName(date)}`,
      date,
      dateType,
      budget,
      travelMode,
      area: origin.source === "home" ? "Home" : origin.name,
      startTime: clockLabel(startMin),
      duration: span,
      preferences: {
        setting,
        pressure,
        formality,
        alcohol,
        originName: origin.name,
        originAddress: origin.source === "home" ? "" : origin.formattedAddress,
        originProvider: origin.provider,
        originId: origin.providerId,
        latitude: String(origin.latitude),
        longitude: String(origin.longitude),
      },
      datingScore: score.total,
      stops: stops.map((stop, index) => ({
        sequence: index,
        stopType: stop.kind,
        title: stop.title,
        address: stop.address,
        latitude: stop.latitude,
        longitude: stop.longitude,
        startTime: clockLabel(stop.startMin),
        endTime: clockLabel(stop.endMin),
        estimatedCost: stop.cost,
        indoorOutdoor: stop.setting,
        sourceUrl: "",
        sourceType: "place",
        locked: Boolean(locked[stop.placeId]),
      })),
    };
    localStorage.setItem("kairos-dating-plan", JSON.stringify(payload));
    try {
      const saved = await saveDatingPlan({ data: payload });
      toast.success(saved.saved ? "Date saved" : "Saved on this browser. The dating tables are not in Supabase yet.");
    } catch {
      toast.success("Saved on this browser");
    }
  }

  function onCalendar() {
    if (!stops[0]) return;
    const start = new Date(`${date}T${String(Math.floor(startMin / 60)).padStart(2, "0")}:${String(startMin % 60).padStart(2, "0")}:00+08:00`);
    const end = stops[stops.length - 1]?.endMin ?? startMin + 120;
    window.open(
      createGoogleCalendarUrl({
        title: TYPE_LABEL[dateType],
        startTime: start.toISOString(),
        durationMinutes: Math.max(60, end - startMin),
        meetingFormat: "physical",
        venueName: stops[0].title,
        address: stops[0].address,
        purpose: stops.map((stop) => `${clockLabel(stop.startMin)} ${stop.title}, ${stop.address}`).join("\n"),
        kairosScore: score?.total ?? null,
      }),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <>
      <form
        className="lg:col-span-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!origin && lookup.trim().length >= 2) {
            void searchArea();
            return;
          }
          setRejected([]);
          setLocked({});
          setSpin(0);
          void buildDate([], false, 0);
        }}
      >
        <PlanningBrief
          mode="dating"
          kicker="DATING"
          question="What kind of date are we planning?"
          hint="Give me the mood. I'll build the evening: what you do, where you eat, and how you move."
          placeholder="First date, east side, Friday evening. Cosy, not expensive, somewhere we can actually talk."
          value={text}
          onChange={setText}
          onUnderstand={() => void understandNow()}
          reading={reading}
          failed={false}
          chips={intent ? intentChips(intent).filter((chip) => !hiddenChips.includes(chip.id)) : []}
          onRemove={(chip) => dismissChip(chip.id, chip.lock as LockKey)}
          aside={intent?.aside ?? ""}
          conflicts={conflicts}
          onKeep={(key) => setConflicts((items) => items.filter((item) => item.key !== key))}
          onUse={(key) => useBrief(key as LockKey)}
        />

        <p className="mt-4 text-sm font-medium text-cream">Date type</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DATE_TYPES.map((item) => (
            <Chip key={item} on={dateType === item} onClick={() => { lock("dateType"); setDateType(item); }}>{TYPE_LABEL[item]}</Chip>
          ))}
        </div>

        <p id="dating-when" className="mt-4 text-sm font-medium text-cream">Time</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {WHEN.map(([id, label, minutes]) => (
            <Chip key={id} on={startMin === minutes} onClick={() => { lock("time"); setStartMin(minutes); }}>{label}</Chip>
          ))}
        </div>
        <label className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-ink px-3 py-2 ring-1 ring-line">
          <span className="text-sm text-cream">Start at {clockLabel(startMin)}</span>
          <input
            type="time"
            value={timeValue(startMin)}
            onChange={(event) => {
              const [hour, minute] = event.target.value.split(":").map(Number);
              if (!Number.isFinite(hour) || !Number.isFinite(minute)) return;
              lock("time");
              setStartMin(Math.min(23 * 60 + 45, Math.max(6 * 60, hour * 60 + minute)));
            }}
            className="h-11 bg-transparent text-cream"
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={date === sgtDate()} onClick={() => { lock("date"); setDate(sgtDate()); }}>Today</Chip>
          <Chip on={date === sgtDate(1)} onClick={() => { lock("date"); setDate(sgtDate(1)); }}>Tomorrow</Chip>
          <Chip on={date === nextFriday()} onClick={() => { lock("date"); setDate(nextFriday()); }}>This Friday</Chip>
        </div>
        <input type="date" value={date} onChange={(event) => { lock("date"); setDate(event.target.value); }} className="mt-2 h-12 rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />

        <p className="mt-4 text-sm font-medium text-cream">What kind of plan?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={span === "quick"} onClick={() => { lock("span"); setSpan("quick"); }}>Food only</Chip>
          <Chip on={span === "half"} onClick={() => { lock("span"); setSpan("half"); }}>Half day with food</Chip>
          <Chip on={span === "full"} onClick={() => { lock("span"); setSpan("full"); }}>Full day with food</Chip>
        </div>
        <p className="mt-2 text-xs text-mute">Food only is one sitting. Anything longer is a full date: something you do, a table, the move between them, and a rain plan.</p>

        <p className="mt-4 text-sm font-medium text-cream">Budget, for two</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={freeOnly} onClick={() => pickBudget("free")}>Free</Chip>
          {[30, 60, 80, 100, 150].map((amount) => (
            <Chip key={amount} on={!freeOnly && budget === amount} onClick={() => pickBudget(amount)}>{`≤ $${amount}`}</Chip>
          ))}
          <Chip on={!freeOnly && budget === 250} onClick={() => pickBudget(250)}>Premium</Chip>
        </div>

        <p className="mt-4 text-sm font-medium text-cream">Starting from</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={origin?.source === "home"} onClick={() => {
            const home = readHome();
            if (home?.latitude == null || home.longitude == null) {
              setError("Set your home location.");
              return;
            }
            chooseOrigin({
              source: "home",
              provider: "saved",
              providerId: "home",
              name: "Home",
              formattedAddress: home.address,
              area: "",
              latitude: home.latitude,
              longitude: home.longitude,
            });
          }}>Home</Chip>
          <Chip on={origin?.source === "current"} onClick={useCurrent}>{locating ? "Finding you…" : "Current location"}</Chip>
        </div>
        <div className="mt-2 flex gap-2">
          <input value={lookup} onChange={(event) => setLookup(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void searchArea(); } }} placeholder="Oasia Resort Sentosa, a mall, a postal code" className="h-12 min-w-0 flex-1 rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
          <button type="button" onClick={() => void searchArea()} className="press h-12 shrink-0 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Find</button>
        </div>
        {lookupNote ? <p className="mt-2 text-sm text-mute">{lookupNote}</p> : null}
        <div className="mt-2 space-y-2">
          {lookups.map((hit) => (
            <button key={hit.providerId} type="button" onClick={() => { setLookup(hit.name); setLookups([]); chooseOrigin(hit); }} className="press block w-full rounded-xl bg-ink px-3 py-3 text-left ring-1 ring-line">
              <span className="block text-sm font-semibold text-cream">{hit.name}</span>
              {hit.area ? <span className="block text-xs text-sky">{hit.area}</span> : null}
              <span className="block text-sm text-mute">{hit.formattedAddress}</span>
              <span className="mt-2 inline-flex text-sm font-semibold text-accent">Use this location</span>
            </button>
          ))}
        </div>
        {origin?.source === "manual_search" ? <button type="button" onClick={() => { writeHome({ name: "Home", address: origin.formattedAddress, areaId: "", latitude: origin.latitude, longitude: origin.longitude }); toast.success("Home saved on this browser"); }} className="press mt-2 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Save as Home</button> : null}
        {origin ? (
          <div className="mt-3 rounded-xl bg-ink px-3 py-3 ring-1 ring-accent">
            <p className="text-xs font-semibold tracking-brand text-accent">SEARCHING FROM</p>
            <p className="mt-1 text-sm font-semibold text-cream">{origin.name}</p>
            <p className="text-sm text-mute">{origin.source === "home" ? "Saved on this browser. The street stays off shared invites." : origin.formattedAddress}</p>
            {origin.area ? <p className="text-xs text-sky">{origin.area}</p> : null}
          </div>
        ) : <p className="mt-2 text-sm text-mute">Choose a result. Typing a name does not set the start.</p>}

        <p className="mt-4 text-sm font-medium text-cream">Travel limit</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[15, 30, 45].map((minutes) => (
            <Chip key={minutes} on={maxTravel === minutes} onClick={() => { lock("travel"); setTightHop(false); setMaxTravel(minutes); clearPlan(); }}>{`${minutes} min`}</Chip>
          ))}
          <Chip on={maxTravel === 90} onClick={() => { lock("travel"); setTightHop(false); setMaxTravel(90); clearPlan(); }}>No preference</Chip>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {([["drive", "Drive"], ["walk", "Walk"], ["ride", "Taxi"], ["transit", "Public transport"]] as const).map(([id, label]) => (
            <Chip key={id} on={travelMode === id} onClick={() => { setTravelMode(id); clearPlan(); }}>{label}</Chip>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-cream">Indoor / outdoor</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["indoor", "outdoor", "either", "mix"] as const).map((item) => (
            <Chip key={item} on={setting === item} onClick={() => { lock("setting"); setSetting(item); }}>{item === "mix" ? "Mixed" : item[0]?.toUpperCase() + item.slice(1)}</Chip>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-cream">Vibe</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DATE_VIBES.map((item) => (
            <Chip key={item} on={vibes.includes(item)} onClick={() => { lock("vibes"); setVibes((current) => current.includes(item) ? current.filter((id) => id !== item) : [...current, item]); }}>{item[0]?.toUpperCase() + item.slice(1)}</Chip>
          ))}
        </div>
        <p className="mt-4 text-sm font-medium text-cream">Food and activity</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DATE_FOODS.map((item) => (
            <Chip key={item} on={foods.includes(item)} onClick={() => { lock("foods"); setFoods((current) => current.includes(item) ? current.filter((id) => id !== item) : [...current, item]); }}>{item[0]?.toUpperCase() + item.slice(1)}</Chip>
          ))}
        </div>

        <button type="button" onClick={() => setMore((value) => !value)} className="mt-4 text-sm font-semibold text-accent">{more ? "Hide preferences" : "More preferences"}</button>
        {more ? (
          <div className="mt-2 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Chip on={pressure === "low"} onClick={() => { lock("pressure"); setPressure("low"); }}>Low-pressure</Chip>
              <Chip on={pressure === "balanced"} onClick={() => { lock("pressure"); setPressure("balanced"); }}>Balanced</Chip>
              <Chip on={pressure === "memorable"} onClick={() => { lock("pressure"); setPressure("memorable"); }}>Make it memorable</Chip>
              <Chip on={formality === "casual"} onClick={() => setFormality("casual")}>Casual</Chip>
              <Chip on={formality === "smart"} onClick={() => setFormality("smart")}>Smart casual</Chip>
              <Chip on={formality === "dress"} onClick={() => setFormality("dress")}>Dress up</Chip>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip on={alcohol === "none"} onClick={() => setAlcohol("none")}>No alcohol</Chip>
              <Chip on={alcohol === "ok"} onClick={() => setAlcohol("ok")}>Drinks okay</Chip>
              <Chip on={crowd === "avoid"} onClick={() => { lock("crowd"); setCrowd("avoid"); }}>Avoid crowds</Chip>
              <Chip on={crowd === "lively"} onClick={() => { lock("crowd"); setCrowd("lively"); }}>Lively is okay</Chip>
              {["halal", "vegetarian", "vegan"].map((diet) => (
                <Chip key={diet} on={diets.includes(diet)} onClick={() => setDiets((current) => current.includes(diet) ? current.filter((item) => item !== diet) : [...current, diet])}>{diet}</Chip>
              ))}
            </div>
            <p className="text-xs text-mute">Noise and crowds are not measured. Diet is only applied when a place actually lists it.</p>
          </div>
        ) : null}

        {error ? <p role="alert" className="mt-4 text-sm text-vermilion">{error}</p> : null}
        <button type="submit" disabled={pending || !origin} className="press mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-accent text-base font-semibold text-accent-ink disabled:opacity-50">
          {pending ? "Building the date…" : "Build the date"}
        </button>
      </form>

      <aside className="lg:col-span-3">
        <section className="rounded-2xl bg-panel p-5 shadow-card sm:p-7">
          <p className="text-xs font-semibold tracking-brand text-accent">{datePlan ? "THE DATE" : "THE EVENING"}</p>
          {datePlan && stops.length ? (
            <>
              <h2 className="mt-2 font-sans text-3xl font-semibold leading-tight text-cream">{datePlan.title}</h2>
              {datePlan.partial ? <p className="mt-2 text-sm font-semibold text-sky">Only a partial plan could be verified.</p> : null}
              <p className="mt-3 text-base leading-relaxed text-cream">{datePlan.thesis}</p>
              {widenNote ? <p className="mt-2 text-sm leading-relaxed text-cream">{widenNote}</p> : null}
              <p className="mt-2 text-sm leading-relaxed text-mute">{datePlan.arc}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="border-l-2 border-accent pl-3">
                  <p className="text-xs font-semibold tracking-brand text-accent">HOW LONG</p>
                  <p className="mt-1 text-sm leading-relaxed text-cream">{datePlan.pacing}</p>
                </div>
                <div className="border-l-2 border-accent pl-3">
                  <p className="text-xs font-semibold tracking-brand text-accent">WHAT TO WEAR</p>
                  <p className="mt-1 text-sm leading-relaxed text-cream">{datePlan.dress}</p>
                </div>
                <div className="border-l-2 border-accent pl-3">
                  <p className="text-xs font-semibold tracking-brand text-accent">IF IT RAINS</p>
                  <p className="mt-1 text-sm leading-relaxed text-cream">{datePlan.rain}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-2 font-sans text-3xl font-semibold leading-tight text-cream">Tell me the mood. I’ll come back with the evening, not a list of restaurants.</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Factor kicker="VIBE FIT" value={vibes.slice(0, 2).join(" · ") || "Open"} note={TYPE_LABEL[dateType]} />
                <Factor kicker="PRACTICAL FIT" value={freeOnly ? "Free" : `≤ $${budget} total`} note={`${maxTravel === 90 ? "Travel open" : `${maxTravel} min travel`} · ${origin?.name ?? "Start not set"}`} />
                <Factor kicker="MOMENT FIT" value={clockLabel(startMin)} note={`${dayName(date)} · ${WHEN.find((item) => item[2] === startMin)?.[1] ?? "Your time"}`} />
              </div>
            </>
          )}
          <ul className="mt-4 space-y-1 text-sm text-cream">
            {(understood.length ? understood : ["What the two of you actually do", "A table, not a crawl", "A different plan if you ask again"]).map((line) => <li key={line}>{line}</li>)}
          </ul>

          {stops.length ? (
            <ol className="mt-6 space-y-3">
              {stops.map((stop) => (
                <li key={stop.id} className="rounded-xl bg-ink px-4 py-3">
                  <p className="text-xs font-semibold tracking-brand text-sky">{clockLabel(stop.startMin)}–{clockLabel(stop.endMin)}</p>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-brand text-accent">{stop.slot}</p>
                      <h3 className="font-display text-2xl text-cream">{stop.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream">{stop.doThis}</p>
                      <p className="mt-2 text-sm text-mute">{stop.address}</p>
                      <p className="mt-1 text-sm text-mute">{stop.travelLabel} · {stop.setting === "indoor" ? "Indoor" : "Outdoor"}{stop.cost == null ? " · Price unavailable" : ` · typical ~$${stop.cost}/pax`}</p>
                      {stop.opening ? <p className="text-xs text-mute">Hours on the map: {stop.opening}</p> : null}
                      {stop.why && stop.why !== stop.doThis ? <p className="mt-1 text-sm text-mute">{stop.why}</p> : null}
                    </div>
                    <button type="button" aria-pressed={Boolean(locked[stop.placeId])} onClick={() => setLocked((current) => ({ ...current, [stop.placeId]: !current[stop.placeId] }))} className={clsx("press min-h-11 shrink-0 rounded-xl px-3 text-sm font-semibold", locked[stop.placeId] ? "bg-accent text-accent-ink" : "text-accent ring-1 ring-accent")}>
                      {locked[stop.placeId] ? "Keep" : "Lock"}
                    </button>
                  </div>
                  <ExternalActions
                    input={{
                      mode: "dating",
                      kind: stop.kind === "meal" || stop.kind === "cafe" ? "restaurant" : "activity",
                      countryCode: "SG",
                      navMode: "walk",
                      from: (() => {
                        const index = stops.findIndex((item) => item.id === stop.id);
                        const previous = stops[index - 1];
                        if (previous) return { lat: previous.latitude, lng: previous.longitude, name: previous.title };
                        return origin ? { lat: origin.latitude, lng: origin.longitude, name: origin.name } : undefined;
                      })(),
                      place: { id: stop.placeId, name: stop.title, address: stop.address, city: "Singapore", countryCode: "SG", lat: stop.latitude, lng: stop.longitude },
                    }}
                  />
                </li>
              ))}
            </ol>
          ) : null}

          {backup && setting !== "indoor" && stops.some((stop) => stop.setting !== "indoor") ? (
            <div className="mt-4 rounded-xl bg-ink px-4 py-4 ring-1 ring-sky">
              <p className="text-xs font-semibold tracking-brand text-sky">RAIN BACKUP</p>
              <h3 className="mt-1 font-display text-2xl text-cream">{backup.title}</h3>
              <p className="text-sm text-cream">{backup.address}</p>
              <p className="mt-1 text-sm text-mute">{backup.travelLabel}</p>
            </div>
          ) : null}

          {score ? (
            <div className="mt-6 rounded-xl bg-ink px-4 py-4 ring-1 ring-accent">
              <p className="text-xs font-semibold tracking-brand text-accent">DATE FIT</p>
              <p className="mt-1 font-display text-4xl text-accent">{score.total}<span className="text-2xl text-mute"> / 100</span></p>
              <ul className="mt-3 space-y-1 text-sm text-cream">
                <li>{score.vibe >= 12 ? "Good setting for a conversation" : "The vibe is a loose fit"}</li>
                <li>{score.value >= 8 ? "Within the budget you set" : "Budget is tight, or a price is missing"}</li>
                <li>{stops.some((stop) => stop.travelLabel.includes("estimated")) ? "Public transport time is an estimate, not a live bus." : stops.some((stop) => stop.travelMin != null) ? "Travel between stops is a real route." : "Travel time was not verified."}</li>
                <li>{weather ? `Weather: ${weather.windowNote}` : "Weather did not come back"}</li>
              </ul>
              <KairosVoice mode="dating" text={why} status={setting !== "indoor" && weather && !weather.afternoonOutdoor ? "warning" : mark === "吉" ? "good" : "neutral"} mark={mark === "吉" ? "吉" : undefined} />
              <p className="mt-2 text-sm text-mute">{spend == null ? "Estimated spend: price unavailable" : `Typical couple spend ~$${spend}. Not a quote.`}</p>
              {eventsNote ? <p className="mt-2 text-xs text-mute">{eventsNote}</p> : null}
            </div>
          ) : null}

          {stops.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={another} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">A different date</button>
              <button type="button" onClick={differentShape} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Different shape</button>
              {setting !== "indoor" && stops.some((stop) => stop.setting !== "indoor") ? (
                <button type="button" onClick={() => void buildDate(rejected, true)} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-sky ring-1 ring-sky">Rain backup</button>
              ) : null}
              <button type="button" onClick={() => void onSave()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Save plan</button>
              <button type="button" onClick={onCalendar} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Add to calendar</button>
            </div>
          ) : null}
          {stops.length && origin ? (
            <DatingInvitePanel
              planId={planId}
              date={date}
              dateType={dateType}
              weekday={dayName(date)}
              when={clockLabel(startMin)}
              span={span}
              areaLabel={origin.name}
              formality={formality}
              vibes={vibes}
              stops={stops}
              mark={mark}
            />
          ) : restoreInvite && planId ? (
            <DatingInvitePanel
              statusOnly
              planId={planId}
              date={date}
              dateType={dateType}
              weekday={dayName(date)}
              when={clockLabel(startMin)}
              span={span}
              areaLabel={origin?.name ?? ""}
              formality={formality}
              vibes={vibes}
              stops={stops}
              mark={mark}
            />
          ) : null}
        </section>
      </aside>
    </>
  );
}

function Factor({ kicker, value, note }: { kicker: string; value: string; note: string }) {
  return (
    <div className="border-l-2 border-accent pl-3 text-accent">
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
