import { useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { PlanningBrief } from "@/components/planning-brief";
import { TravelWorkspace } from "@/components/travel-workspace";
import { parsePlanBrief } from "@/lib/planning.functions";
import { planTrip, searchTravelDestinations } from "@/lib/travel.functions";
import { travelChips, type TravelIntent } from "@/lib/planning-brief";
import { keepLockedDays, normalizeTravelParty, type Trip } from "@/lib/travel-model";
import { applyFoodPlanning } from "@/lib/travel-itinerary";
import { navLabel, readNavPreference, writeNavPreference, type NavPreference } from "@/lib/travel-routing";
import { addDays, parseChildAges, planningDestinations, selectTravelDestination, TRAVEL_INTERESTS, TRAVEL_STYLES, type FoodPlanning, type TravelBalance, type TravelBudget, type TravelDestination, type TravelInterest, type TravelMove, type TravelPace, type TravelStyle } from "@/lib/travel";

const STORE = "kairos-travel-plan";

function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export function TravelStudio() {
  const [destination, setDestination] = useState("");
  const [destinations, setDestinations] = useState<TravelDestination[]>([]);
  const [hits, setHits] = useState<TravelDestination[]>([]);
  const [start, setStart] = useState(todayIso());
  const [nightsText, setNightsText] = useState("3");
  const [adultsText, setAdultsText] = useState("2");
  const [ages, setAges] = useState("");
  const [pace, setPace] = useState<TravelPace>("balanced");
  const [styles, setStyles] = useState<TravelStyle[]>(["comfort"]);
  const [balance, setBalance] = useState<TravelBalance>("balanced");
  const [firstVisit, setFirstVisit] = useState(true);
  const [move, setMove] = useState<TravelMove>("walk");
  const [budget, setBudget] = useState<TravelBudget>("mid");
  const [interests, setInterests] = useState<TravelInterest[]>([]);
  const [foodPlanning, setFoodPlanning] = useState<FoodPlanning>("balanced");
  const [oneBase, setOneBase] = useState(true);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [locked, setLocked] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [salt, setSalt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [brief, setBrief] = useState("");
  const [reading, setReading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [intent, setIntent] = useState<TravelIntent | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [fieldLocks, setFieldLocks] = useState<Record<string, boolean>>({});
  const [mustVisit, setMustVisit] = useState<string[]>([]);
  const [avoidPlaces, setAvoidPlaces] = useState<string[]>([]);
  const [briefConflicts, setBriefConflicts] = useState<{ key: string; suggested: string; current: string }[]>([]);
  const [detailError, setDetailError] = useState("");

  const childAges = useMemo(() => parseChildAges(ages), [ages]);
  const nights = Number(nightsText);
  const adults = Number(adultsText);
  const nightsOk = Number.isInteger(nights) && nights >= 1 && nights <= 90;
  const adultsOk = Number.isInteger(adults) && adults >= 1 && adults <= 16;
  const chosen = planningDestinations(destinations);
  const picked = chosen[0] ?? null;
  const checkout = nightsOk ? addDays(start, nights) : "";
  const lastQuery = useRef("");
  const searchSeq = useRef(0);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) ?? "null") as Trip | null;
      if (raw && Array.isArray(raw.stops) && Array.isArray(raw.days)) {
        const repaired = normalizeTravelParty(raw);
        setTrip(repaired);
        if (repaired.adults) setAdultsText(String(repaired.adults));
        if (repaired.childAges.length) setAges(repaired.childAges.join(", "));
      }
    } catch {
      /* A broken saved trip should not block a new one. */
    }
  }, []);

  useEffect(() => {
    if (!trip) return;
    try {
      localStorage.setItem(STORE, JSON.stringify(trip));
    } catch {
      /* Private mode. The trip still stays on screen. */
    }
  }, [trip]);

  useEffect(() => {
    const query = destination.trim();
    if (query.length < 2) return;
    const handle = window.setTimeout(() => {
      if (lastQuery.current === query.toLowerCase()) return;
      const seq = ++searchSeq.current;
      lastQuery.current = query.toLowerCase();
      void searchTravelDestinations({ data: { query } }).then((found) => {
        if (seq !== searchSeq.current) return;
        setHits(found);
      }).catch(() => {
        if (seq === searchSeq.current) setHits([]);
      });
    }, 600);
    return () => window.clearTimeout(handle);
  }, [destination]);

  function lockField(key: string) {
    setFieldLocks((current) => ({ ...current, [key]: true }));
  }

  async function applyTravel(parsed: TravelIntent, locks = fieldLocks) {
    setIntent(parsed);
    setFailed(false);
    const conflicts: { key: string; suggested: string; current: string }[] = [];
    if (parsed.nights) {
      if (locks.nights && String(parsed.nights) !== nightsText) conflicts.push({ key: "nights", suggested: `${parsed.nights} nights`, current: `${nightsText} nights` });
      else if (!locks.nights) setNightsText(String(parsed.nights));
    }
    if (parsed.pace) {
      if (locks.pace && parsed.pace !== pace) conflicts.push({ key: "pace", suggested: parsed.pace, current: pace });
      else if (!locks.pace) setPace(parsed.pace);
    }
    if (parsed.hotelChangePreference === "minimise") {
      if (locks.hotels && !oneBase) conflicts.push({ key: "hotels", suggested: "Minimise hotel changes", current: "A second base" });
      else if (!locks.hotels) setOneBase(true);
    }
    if (parsed.interests.length && !locks.interests) setInterests(parsed.interests);
    if (!locks.mustVisit) setMustVisit(parsed.mustVisit);
    if (!locks.avoidPlaces) setAvoidPlaces(parsed.avoidPlaces);
    setBriefConflicts(conflicts);
    if (!locks.destinations && parsed.destinations.length) {
      const names = parsed.destinations.filter((item) => item.toLowerCase() !== "japan").slice(0, 3);
      const found: TravelDestination[] = [];
      for (const city of names.length ? names : parsed.destinations.slice(0, 1)) {
        const hitsForCity = await searchTravelDestinations({ data: { query: city } }).catch(() => []);
        const match = hitsForCity.find((hit) => hit.name.toLowerCase() === city.toLowerCase() && hit.type !== "country") ?? hitsForCity.find((hit) => hit.type !== "country");
        if (match && !found.some((item) => item.name === match.name && item.countryCode === match.countryCode)) found.push(match);
      }
      if (found.length) {
        setDestinations(found);
        setDestination(found.map((item) => item.name).join(", "));
        setHits([]);
      }
    }
  }

  function understandTravel() {
    const query = brief.trim();
    if (query.length < 8) return;
    setReading(true);
    setFailed(false);
    void parsePlanBrief({ data: { mode: "travel", text: query, today: todayIso() } })
      .then((result) => {
        if (result.mode !== "travel") return;
        const parsed = result.intent;
        const useful = parsed.destinations.length + parsed.mustVisit.length + (parsed.nights ? 1 : 0) + parsed.mustHave.length;
        if (!useful) {
          setFailed(true);
          return;
        }
        return applyTravel(parsed).then(() => {
          if (/already (done|been|seen)|second visit|not my first/i.test(query)) setFirstVisit(false);
          if (/nature-heavy|mostly nature|more nature/i.test(query)) setBalance("nature");
          if (/city only|city-heavy|no nature/i.test(query)) setBalance("city");
          if (/backpack/i.test(query)) setStyles(["backpacking"]);
          else if (/luxury/i.test(query)) setStyles(["luxury"]);
          else if (/slow travel|take it slow/i.test(query)) setStyles(["slow"]);
          else if (/wellness|spa/i.test(query)) setStyles(["wellness"]);
          else if (/adventure|hike|hiking/i.test(query)) setStyles(["adventure"]);
        });
      })
      .catch(() => setFailed(true))
      .finally(() => setReading(false));
  }

  async function search() {
    const query = destination.trim();
    if (query.length < 2) return;
    const seq = ++searchSeq.current;
    lastQuery.current = query.toLowerCase();
    setDetailError("");
    setNote("Looking up that destination…");
    const found = await searchTravelDestinations({ data: { query } }).catch(() => []);
    if (seq !== searchSeq.current) return;
    setHits(found);
    setNote(found.length ? "" : "No country, city, or region matched. Try Japan, Osaka, or Paris.");
  }

  function addDestination(hit: TravelDestination) {
    searchSeq.current += 1;
    lastQuery.current = hit.displayName.toLowerCase();
    if (import.meta.env.DEV) {
      console.info(`[TRAVEL DESTINATION CLICK]\nresult: ${hit.name}\ntype: ${hit.type}\nprovider: ${hit.provider}\nproviderId: ${hit.providerId || "-"}\nhandler fired: YES`);
    }
    const next = selectTravelDestination(destinations, hit);
    if (next === destinations) {
      setDetailError("Couldn’t load destination details.");
      setNote("Couldn’t load destination details.");
      return;
    }
    setDestinations(next);
    setDestination(hit.displayName);
    setHits([]);
    setDetailError("");
    setNote("");
  }

  async function run(nextSalt = salt, nextRejected = rejected, nextLocked = locked) {
    if (!picked) {
      setNote("Choose a destination from the list first.");
      return;
    }
    if (!nightsOk || !adultsOk) {
      setNote(!nightsOk ? "Nights need to be from 1 to 90." : "Adults need to be from 1 to 16.");
      return;
    }
    setBusy(true);
    setNote("");
    const next = await planTrip({
      data: {
        destination: chosen.map((item) => item.name).join(", ") || picked.name,
        address: picked.displayName,
        latitude: picked.latitude,
        longitude: picked.longitude,
        start,
        nights,
        adults,
        childAges,
        pace,
        move,
        budget,
        interests,
        foodPlanning,
        oneBase,
        rejected: [...new Set([...nextRejected, ...avoidPlaces])].slice(0, 24),
        lockedDates: nextLocked,
        salt: nextSalt,
        areas: chosen.map((item) => ({ name: item.name, latitude: item.latitude, longitude: item.longitude, countryCode: item.countryCode, bbox: item.bbox })),
        mustVisit,
        styles,
        balance,
        firstVisit,
      },
    }).catch(() => null);
    setBusy(false);
    if (!next) {
      setNote("The trip could not be planned. Try again.");
      return;
    }
    const kept = keepLockedDays(trip ? { ...trip, days: trip.days.map((day) => ({ ...day, locked: nextLocked.includes(day.date) })) } : null, next);
    setTrip(kept);
  }

  function reroll() {
    const names = trip?.days.flatMap((day) => day.locked ? [] : trip.stops.filter((stop) => stop.day === day.index && stop.category !== "stay").map((stop) => stop.name)) ?? [];
    const nextRejected = [...new Set([...rejected, ...names])].slice(-24);
    const nextSalt = Math.min(20, salt + 1);
    setRejected(nextRejected);
    setSalt(nextSalt);
    void run(nextSalt, nextRejected);
  }

  function remixDay(date: string) {
    const day = trip?.days.find((item) => item.date === date);
    const names = trip?.stops.filter((stop) => stop.day === day?.index && stop.category !== "stay").map((stop) => stop.name) ?? [];
    const nextRejected = [...new Set([...rejected, ...names])].slice(-24);
    const nextLocked = locked.filter((item) => item !== date);
    const nextSalt = Math.min(20, salt + 1);
    setRejected(nextRejected);
    setLocked(nextLocked);
    setSalt(nextSalt);
    if (trip) setTrip({ ...trip, days: trip.days.map((item) => item.date === date ? { ...item, locked: false } : item) });
    void run(nextSalt, nextRejected, nextLocked);
  }

  return (
    <div className="lg:col-span-5 grid gap-8 lg:grid-cols-5">
      <section className="lg:col-span-2">
        <PlanningBrief
          mode="travel"
          kicker="TRAVEL"
          question="What kind of trip are we planning?"
          hint="Tell Kairos where you’re thinking of going, who’s coming, and what kind of trip you want."
          placeholder="7 days in Japan with two kids. We definitely want Osaka and Nagoya, one snow day, not too many hotel changes, and no crazy early mornings."
          value={brief}
          onChange={setBrief}
          onUnderstand={understandTravel}
          reading={reading}
          failed={failed}
          chips={intent ? travelChips(intent).filter((chip) => !hidden.includes(chip.id)) : []}
          onRemove={(chip) => { lockField(chip.lock); setHidden((current) => [...current, chip.id]); }}
          aside={intent?.aside ?? ""}
          conflicts={briefConflicts}
          onKeep={(key) => setBriefConflicts((items) => items.filter((item) => item.key !== key))}
          onUse={(key) => {
            const next = { ...fieldLocks, [key]: false };
            setFieldLocks(next);
            if (intent) void applyTravel(intent, next);
          }}
        />
        <label className="mt-4 block text-xs text-mute" htmlFor="travel-where">Destination</label>
        <div className="mt-1 flex gap-2">
          <input id="travel-where" value={destination} onChange={(event) => { lockField("destinations"); setDestination(event.target.value); setHits([]); }} placeholder="Japan, Osaka, Paris" className="h-11 min-w-0 flex-1 rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
          <button type="button" onClick={() => void search()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Find</button>
        </div>
        {destinations.length ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {destinations.map((place) => (
              <li key={place.providerId || `${place.type}-${place.name}-${place.countryCode}`}>
                <button type="button" onClick={() => setDestinations(destinations.filter((item) => item !== place))} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">
                  {place.name} · {place.type === "country" ? "selected · remove" : "remove"}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {picked ? <p className="mt-2 text-sm text-cream" role="status">{picked.displayName} selected</p> : null}
        {hits.length ? (
          <ul className="mt-2 space-y-1">
            {hits.map((hit) => (
              <li key={hit.providerId || `${hit.type}-${hit.name}-${hit.latitude}`}>
                <button type="button" onClick={() => addDestination(hit)} className="press min-h-11 w-full rounded-xl px-3 text-left text-sm text-cream ring-1 ring-line">
                  <span className="block">{hit.displayName}</span>
                  <span className="text-mute">{placeType(hit.type)} · add, up to 3 cities</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {detailError ? (
          <p className="mt-2 text-sm text-mute">
            {detailError}{" "}
            <button type="button" onClick={() => void search()} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Retry</button>
          </p>
        ) : null}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="text-xs text-mute">Start
            <input type="date" value={start} onChange={(event) => setStart(event.target.value)} className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
          </label>
          <CountField label="Nights" text={nightsText} min={1} max={90} onText={(value) => { lockField("nights"); setNightsText(value); }} />
          <CountField label="Adults" text={adultsText} min={1} max={16} onText={setAdultsText} />
          <label className="text-xs text-mute">Children’s ages
            <input value={ages} onChange={(event) => setAges(event.target.value)} placeholder="5, 9" className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-cream ring-1 ring-line" />
          </label>
        </div>
        {checkout ? <p className="mt-2 text-sm text-cream">Checkout {prettyDate(checkout)}</p> : null}
        <ChipRow label="Pace" value={pace} options={[["relaxed", "Relaxed"], ["balanced", "Balanced"], ["full", "See more"]]} onChange={(value) => { lockField("pace"); setPace(value); }} />
        <p className="mt-3 text-xs text-mute">Travel style · primary, and one more if you want</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRAVEL_STYLES.map((item) => {
            const on = styles.includes(item);
            return (
              <button key={item} type="button" aria-pressed={on} onClick={() => setStyles((current) => on ? current.filter((entry) => entry !== item) : [...current, item].slice(-2))} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold capitalize", on ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>{item}</button>
            );
          })}
        </div>
        <ChipRow label="City and nature" value={balance} options={[["city", "City-heavy"], ["balanced", "Balanced"], ["nature", "Nature-heavy"]]} onChange={setBalance} />
        <button type="button" aria-pressed={firstVisit} onClick={() => setFirstVisit((value) => !value)} className={clsx("press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold", firstVisit ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>
          {firstVisit ? "First visit. Cover the defining places." : "Not a first visit. Ease off the famous sights."}
        </button>
        <ChipRow label="Getting around" value={move} options={[["walk", "Walk"], ["transit", "Transit"], ["drive", "Drive"]]} onChange={setMove} />
        <p className="mt-1 text-xs text-mute">A preference for each hop. Navigate opens your map app.</p>
        <NavigationSetting />
        <ChipRow label="Budget" value={budget} options={[["simple", "Simple"], ["mid", "Mid"], ["splurge", "Splurge"]]} onChange={setBudget} />
        <ChipRow label="Food planning" value={foodPlanning} options={[["minimal", "Minimal"], ["meals", "Meals only"], ["balanced", "Balanced"], ["feature", "Food is part of the trip"]]} onChange={(value) => { setFoodPlanning(value); setTrip((current) => current ? applyFoodPlanning(current, value) : current); }} />
        <p className="mt-3 text-xs text-mute">Interests</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRAVEL_INTERESTS.map((item) => {
            const on = interests.includes(item);
            return (
              <button key={item} type="button" aria-pressed={on} onClick={() => { lockField("interests"); setInterests(on ? interests.filter((entry) => entry !== item) : [...interests, item]); }} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold capitalize", on ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>{item}</button>
            );
          })}
        </div>
        <button type="button" aria-pressed={oneBase} onClick={() => { lockField("hotels"); setOneBase((value) => !value); }} className={clsx("press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold", oneBase ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>
          {oneBase ? "One base. No hotel hop." : "A second base only if the sights split."}
        </button>
        {mustVisit.length ? <p className="mt-2 text-sm text-cream">Look for {mustVisit.join(", ")}.</p> : null}
        {avoidPlaces.length ? <p className="mt-1 text-sm text-mute">Leave out {avoidPlaces.join(", ")}.</p> : null}
        <p className="mt-2 text-xs text-mute">Budget is a preference. Live prices stay on the booking sites.</p>
        {note ? <p className="mt-3 text-sm text-mute">{note}</p> : null}
        <button type="button" disabled={busy} onClick={() => void run()} className="press mt-4 min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink">{busy ? "Planning…" : "Plan the trip"}</button>
      </section>
      <section className="lg:col-span-3">
        {!trip ? <p className="text-sm text-mute">Plan, map, saved places, and bookings will share one trip.</p> : (
          <TravelWorkspace
            trip={trip}
            busy={busy}
            onChange={setTrip}
            onLock={(date) => {
              setLocked((current) => current.includes(date) ? current.filter((item) => item !== date) : [...current, date]);
              setTrip((current) => current ? { ...current, days: current.days.map((day) => day.date === date ? { ...day, locked: !day.locked } : day) } : current);
            }}
            onRemixDay={remixDay}
            onAnother={reroll}
            onExclude={(name) => setRejected((current) => [...new Set([...current, name])].slice(-24))}
          />
        )}
      </section>
    </div>
  );
}

function placeType(type: TravelDestination["type"]): string {
  if (type === "country") return "Country";
  if (type === "city") return "City";
  if (type === "region") return "Region";
  if (type === "island") return "Island";
  return "Destination";
}

function prettyDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-SG", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, (month || 1) - 1, day || 1)));
}

function CountField({ label, text, min, max, onText }: { label: string; text: string; min: number; max: number; onText: (value: string) => void }) {
  const parsed = Number(text);
  const valid = text !== "" && Number.isInteger(parsed) && parsed >= min && parsed <= max;
  function step(delta: number) {
    const base = valid ? parsed : min;
    onText(String(Math.min(max, Math.max(min, base + delta))));
  }
  return (
    <div>
      <p className="text-xs text-mute" id={`${label}-label`}>{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <button type="button" onClick={() => step(-1)} aria-label={`Fewer ${label}`} className="press h-11 w-11 rounded-xl text-lg text-cream ring-1 ring-line">−</button>
        <input aria-labelledby={`${label}-label`} inputMode="numeric" value={text} onChange={(event) => onText(event.target.value.replace(/[^\d]/g, "").slice(0, 2))} className="h-11 w-16 rounded-xl bg-ink px-2 text-center text-cream ring-1 ring-line" />
        <button type="button" onClick={() => step(1)} aria-label={`More ${label}`} className="press h-11 w-11 rounded-xl text-lg text-cream ring-1 ring-line">+</button>
      </div>
      {text !== "" && !valid ? <p className="mt-1 text-xs text-caution">Use {min} to {max}.</p> : null}
    </div>
  );
}

function NavigationSetting() {
  const [value, setValue] = useState<NavPreference>("automatic");
  useEffect(() => { setValue(readNavPreference()); }, []);
  const options: [NavPreference, string][] = [
    ["automatic", "Automatic"],
    ["google", "Google Maps"],
    ["apple", "Apple Maps"],
    ["amap", "Amap"],
    ["kakao", "Kakao Map"],
    ["naver", "Naver Map"],
  ];
  return (
    <div className="mt-3">
      <p className="text-xs text-mute">Navigation app</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map(([key, text]) => (
          <button key={key} type="button" aria-pressed={value === key} onClick={() => { writeNavPreference(key); setValue(key); }} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", value === key ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>{text}</button>
        ))}
      </div>
      <p className="mt-1 text-xs text-mute">{value === "automatic" ? "Automatic picks a map app for the country and this device. It does not change how Kairos calculates the trip." : `${navLabel(value)} opens when you tap Navigate. Kairos still plans the day itself.`}</p>
    </div>
  );
}

function ChipRow<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (value: T) => void }) {
  return (
    <div className="mt-3">
      <p className="text-xs text-mute">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map(([key, text]) => (
          <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", value === key ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>{text}</button>
        ))}
      </div>
    </div>
  );
}
