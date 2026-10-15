import { useState, type ReactNode } from "react";
import { clsx } from "clsx";
import { ExternalActions } from "@/components/external-actions";
import { PlacePhoto, PlaceTitle } from "@/components/travel-place";
import { AFFILIATE_DISCLOSURE, RATE_NOTE, resolveCommerceActions } from "@/lib/affiliate";
import { placeActions } from "@/lib/external-actions";
import {
  applyBookedHotel,
  hotelOptimizerEnabled,
  matchBookedHotel,
  recommendStayAreas,
  stayNearPoints,
  type StayArea,
} from "@/lib/hotel-bases";
import { resolveTravelHotel } from "@/lib/travel.functions";
import {
  budgetText,
  DEFAULT_HOTEL_PREFERENCES,
  presetPreferences,
  type BudgetBand,
  type HotelPreferences,
  type HotelPreset,
  type HotelStyle,
  type LocationFocus,
} from "@/lib/hotel-shortlist";
import { liveHotelRates } from "@/lib/hotel-rates";
import {
  likeHotel,
  rejectHotel,
  rerollHotels,
  selectBase,
  setHotelPreferences,
  toggleKeptHotel,
  type HotelPick,
  type Trip,
  type TripStop,
} from "@/lib/travel-model";
import type { PlacePhoto as PlacePhotoRecord } from "@/lib/travel-photo";
import { addDays, explicitChildAges } from "@/lib/travel";
import { detectPlatform } from "@/lib/travel-routing";

const PRESETS: { id: HotelPreset; label: string }[] = [
  { id: "overall", label: "Best overall" },
  { id: "location", label: "Best location" },
  { id: "quiet", label: "Quiet" },
  { id: "value", label: "Value" },
  { id: "family", label: "Family" },
  { id: "luxury", label: "Luxury" },
  { id: "minimum-travel", label: "Minimum travel" },
];

const REASONS = [
  ["too-expensive", "Too expensive"],
  ["too-far", "Too far"],
  ["too-small", "Too small"],
  ["too-basic", "Too basic"],
  ["too-noisy", "Too noisy"],
  ["area", "Don't like the area"],
  ["", "Skip"],
] as const;

export function HotelShortlist({
  trip,
  highlighted,
  onChange,
  onHighlight,
  onOpen,
  onPhoto,
}: {
  trip: Trip;
  highlighted: string | null;
  onChange: (trip: Trip) => void;
  onHighlight: (id: string) => void;
  onOpen: (id: string) => void;
  onPhoto: (stopId: string, photo: PlacePhotoRecord) => void;
}) {
  if (!hotelOptimizerEnabled()) return <WhereToStay trip={trip} onChange={onChange} />;
  return <HotelOptimizer trip={trip} highlighted={highlighted} onChange={onChange} onHighlight={onHighlight} onOpen={onOpen} onPhoto={onPhoto} />;
}

function WhereToStay({ trip, onChange }: { trip: Trip; onChange: (trip: Trip) => void }) {
  const areas = recommendStayAreas(trip);
  const booked = trip.stops.find((stop) => stop.category === "stay" && stop.day != null && stop.bookingStatus === "booked" && stop.provider !== "area");
  return (
    <section className="grid gap-3">
      <div>
        <p className="text-xs font-semibold tracking-brand text-accent">WHERE TO STAY</p>
        <p className="mt-1 text-sm text-mute">Kairos recommends the area. You check hotels on a booking site, then add the one you book.</p>
      </div>
      {booked ? (
        <div className="rounded-xl bg-ink px-3 py-3 text-sm ring-1 ring-accent">
          <p className="text-xs font-semibold tracking-brand text-accent">YOUR HOTEL</p>
          <p className="mt-1 font-semibold text-cream">{booked.displayName || booked.name}</p>
          <p className="mt-1 text-mute">{booked.address}</p>
          <p className="mt-1 text-mute">This is the base for the nearby days. The sights are unchanged.</p>
        </div>
      ) : null}
      {areas.length ? (
        <ul className="grid gap-3">
          {areas.map((area) => <StayCard key={area.id} trip={trip} area={area} />)}
        </ul>
      ) : <p className="text-sm text-mute">No base area yet. The sightseeing days need to be on the plan first.</p>}
      <BookedHotelForm trip={trip} onChange={onChange} />
    </section>
  );
}

function StayCard({ trip, area }: { trip: Trip; area: StayArea }) {
  const actions = resolveCommerceActions({
    id: area.id,
    name: area.name,
    city: trip.destination,
    country: trip.countryCode,
    lat: area.lat,
    lng: area.lng,
    category: "HOTEL",
  }, {
    mode: "travel",
    destination: trip.destination,
    checkIn: trip.start,
    checkOut: addDays(trip.start, trip.nights),
    adults: trip.adults,
    childAges: explicitChildAges(trip.childAges),
  });
  const affiliate = actions.some((action) => action.source === "affiliate");
  return (
    <li className="rounded-xl bg-ink px-3 py-3 text-sm">
      <p className="text-xs font-semibold tracking-brand text-accent">{area.role.toUpperCase()}</p>
      <p className="mt-1 font-semibold text-cream">{area.name}</p>
      {area.nightsLabel ? <p className="mt-1 text-mute">{area.nightsLabel}</p> : null}
      <ul className="mt-2 space-y-1 text-mute">
        {area.why.map((line) => <li key={line}>· {line}</li>)}
      </ul>
      {area.tradeoff ? <p className="mt-2 text-mute">{area.tradeoff}</p> : null}
      {actions.length ? (
        <div className="mt-3">
          <p className="text-xs font-semibold tracking-brand text-accent">CHECK HOTELS</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {actions.map((action) => (
              <a key={action.id} href={action.url} target="_blank" rel="noreferrer" className="press inline-flex min-h-11 items-center rounded-xl px-3 text-sm text-cream ring-1 ring-line">{action.label.replace(/^Check /, "")}</a>
            ))}
          </div>
          <p className="mt-2 text-xs text-mute">{RATE_NOTE}</p>
          {affiliate ? <p className="mt-1 text-xs text-mute">{AFFILIATE_DISCLOSURE}</p> : null}
        </div>
      ) : null}
    </li>
  );
}

function BookedHotelForm({ trip, onChange }: { trip: Trip; onChange: (trip: Trip) => void }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function find() {
    const text = query.trim();
    if (text.length < 2) return;
    const local = matchBookedHotel(trip, text);
    if (local) {
      const next = applyBookedHotel(trip, local);
      if (next === trip) {
        setMessage("That hotel is too far from these days to use as the base.");
        return;
      }
      onChange(next);
      setMessage(`${local.name} is the base. The sights stay where they are.`);
      return;
    }
    setBusy(true);
    try {
      const hit = await resolveTravelHotel({ data: { query: text, near: stayNearPoints(trip) } });
      if (!hit) {
        setMessage("Couldn't place that hotel. Use the full property name. Kairos will not guess from the name alone.");
        return;
      }
      const next = applyBookedHotel(trip, hit);
      if (next === trip) {
        setMessage("That hotel is too far from these days to use as the base.");
        return;
      }
      onChange(next);
      setMessage(`${hit.name} is the base. The sights stay where they are.`);
    } catch {
      setMessage("The map search did not answer. The itinerary is unchanged.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="rounded-xl bg-ink px-3 py-3">
      <p className="text-xs font-semibold tracking-brand text-accent">ALREADY BOOKED?</p>
      <label className="mt-2 block text-sm text-mute" htmlFor="booked-hotel">Add my hotel</label>
      <div className="mt-2 flex flex-wrap gap-2">
        <input id="booked-hotel" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hotel name and city" className="min-h-11 flex-1 rounded-xl bg-transparent px-3 text-sm text-cream ring-1 ring-line" />
        <button type="button" disabled={busy} onClick={() => void find()} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">{busy ? "Looking" : "Add my hotel"}</button>
      </div>
      {message ? <p className="mt-2 text-sm text-mute">{message}</p> : null}
    </div>
  );
}

function HotelOptimizer({
  trip,
  highlighted,
  onChange,
  onHighlight,
  onOpen,
  onPhoto,
}: {
  trip: Trip;
  highlighted: string | null;
  onChange: (trip: Trip) => void;
  onHighlight: (id: string) => void;
  onOpen: (id: string) => void;
  onPhoto: (stopId: string, photo: PlacePhotoRecord) => void;
}) {
  const [open, setOpen] = useState(false);
  const [compare, setCompare] = useState(false);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const prefs = { ...DEFAULT_HOTEL_PREFERENCES, ...trip.hotelPreferences };
  const hotels = trip.hotels ?? [];
  const party = partyLine(trip);
  const base = trip.stops.find((stop) => stop.category === "stay" && stop.day != null) ?? null;
  const rates = liveHotelRates();
  const affiliate = hotels.some((hotel) => {
    const stop = hotelStop(trip, hotel);
    return stop ? placeActions(actionInput(trip, stop), detectPlatform()).some((action) => action.source === "affiliate") : false;
  });

  function apply(next: HotelPreferences) {
    onChange(setHotelPreferences(trip, next));
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold tracking-brand text-accent">HOTELS FOR THIS TRIP</p>
          <p className="mt-1 text-sm text-cream">{summary(prefs)}</p>
          <p className="mt-1 text-sm text-mute">{party}</p>
        </div>
        <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">{open ? "Close" : "Hotel preferences"}</button>
      </div>
      {open ? <PreferencePanel prefs={prefs} onChange={apply} /> : null}
      {prefs.ac === "individual" ? <p className="text-sm text-mute">Individual room control is not the same as a hotel that has air conditioning. Kairos cannot verify room-by-room control from the map.</p> : null}
      {base && !hotels.some((hotel) => hotel.stopId === base.providerId || hotel.name === base.name) ? <p className="text-sm text-mute">The days currently start at {base.name}. Selecting a hotel moves that base. The sights stay.</p> : null}
      {hotels.length ? (
        <ul className="grid gap-3">
          {hotels.map((hotel) => {
            const reasons = hotel.reasons ?? [];
            const matches = hotel.matches ?? [];
            const unverified = hotel.unverified ?? [];
            const tradeoffs = (hotel.tradeoffs ?? []).filter((line) => !line.startsWith("We couldn't verify"));
            const stop = hotelStop(trip, hotel);
            const chosen = Boolean(base && (base.providerId === hotel.stopId || base.name === hotel.name));
            const onMap = Boolean(stop && (highlighted === stop.id || (stop.providerId && highlighted === stop.providerId)));
            return (
              <li key={hotel.stopId} className={clsx("rounded-xl bg-ink px-3 py-3 text-sm ring-1", chosen || onMap ? "ring-accent" : "ring-transparent")}>
                <div className="flex gap-3">
                  {stop && (stop.image || stop.commonsFile || stop.wikidataId) ? <PlacePhoto stop={stop} onPhoto={onPhoto} /> : null}
                  <button type="button" onClick={() => stop && onHighlight(stop.id)} className="press min-h-11 flex-1 text-left">
                    <p className="text-xs font-semibold tracking-brand text-accent">{(hotel.role || "Suggested").toUpperCase()}</p>
                    <PlaceTitle place={stop ?? { name: hotel.name }} className="font-semibold text-cream" />
                  </button>
                </div>
                <p className="mt-2 text-cream">{hotel.location || hotel.why}</p>
                {reasons.length ? (
                  <ul className="mt-2 space-y-1 text-mute">
                    {reasons.map((reason) => <li key={reason}>· {reason}</li>)}
                  </ul>
                ) : null}
                {matches.length ? (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {matches.map((match) => <li key={match.label} className="rounded-lg px-2 py-1 text-cream ring-1 ring-line">✓ {match.label}</li>)}
                  </ul>
                ) : null}
                {unverified.length ? (
                  <details className="mt-2">
                    <summary className="min-h-11 cursor-pointer text-mute">{unverified.length} {unverified.length === 1 ? "preference" : "preferences"} not verified</summary>
                    <ul className="mt-1 space-y-1 text-mute">
                      {unverified.map((item) => <li key={item}>{item}. We couldn't verify this requirement.</li>)}
                    </ul>
                  </details>
                ) : null}
                {tradeoffs.map((line) => <p key={line} className="mt-2 text-mute">Trade-off · {line}</p>)}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" aria-pressed={Boolean(trip.hotelMemory?.kept?.includes(hotel.stopId) || hotel.role === "Kept")} onClick={() => onChange(toggleKeptHotel(trip, hotel.stopId))} className="press min-h-11 rounded-xl px-3 text-cream ring-1 ring-line">{trip.hotelMemory?.kept?.includes(hotel.stopId) ? "Kept" : "Keep"}</button>
                  <button type="button" onClick={() => setRejecting((value) => value === hotel.stopId ? null : hotel.stopId)} className="press min-h-11 rounded-xl px-3 text-cream ring-1 ring-line">Not for me</button>
                  <button type="button" onClick={() => onChange(likeHotel(trip, hotel.stopId))} className="press min-h-11 rounded-xl px-3 text-cream ring-1 ring-line">More like this</button>
                  <button type="button" onClick={() => { onChange(selectBase(trip, hotel.stopId)); if (stop) onHighlight(stop.id); }} className="press min-h-11 rounded-xl bg-accent px-3 font-semibold text-accent-ink">{chosen ? "Selected base" : "Select this hotel"}</button>
                  {stop ? <button type="button" onClick={() => onOpen(stop.id)} className="press min-h-11 rounded-xl px-3 text-cream ring-1 ring-line">Details</button> : null}
                </div>
                {rejecting === hotel.stopId ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {REASONS.map(([id, label]) => (
                      <button key={label} type="button" onClick={() => { onChange(rejectHotel(trip, hotel.stopId, id)); setRejecting(null); }} className="press min-h-11 rounded-xl px-3 text-cream ring-1 ring-line">{label}</button>
                    ))}
                  </div>
                ) : null}
                {stop ? <ExternalActions notes={false} heading="CHECK ELSEWHERE" input={actionInput(trip, stop)} /> : null}
              </li>
            );
          })}
        </ul>
      ) : <p className="text-sm text-mute">No hotel came back for this area.</p>}
      {hotels.length ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onChange(rerollHotels(trip))} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Reroll unlocked hotels</button>
          <button type="button" aria-pressed={compare} onClick={() => setCompare((value) => !value)} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">{compare ? "Hide comparison" : "Compare"}</button>
        </div>
      ) : null}
      {trip.hotelNote ? <p className="text-sm text-mute">{trip.hotelNote}</p> : null}
      {compare && hotels.length ? <HotelCompare trip={trip} hotels={hotels} /> : null}
      {hotels.length ? (
        <div>
          <p className="text-xs font-semibold tracking-brand text-accent">BOOKING</p>
          {rates ? null : <p className="mt-1 text-sm text-mute">Live rates are not connected. {RATE_NOTE}</p>}
          {affiliate ? <p className="mt-1 text-sm text-mute">{AFFILIATE_DISCLOSURE}</p> : null}
        </div>
      ) : null}
    </section>
  );
}

function PreferencePanel({ prefs, onChange }: { prefs: HotelPreferences; onChange: (prefs: HotelPreferences) => void }) {
  return (
    <div className="grid gap-3 rounded-xl bg-ink p-3">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button key={preset.id} type="button" aria-pressed={prefs.preset === preset.id} onClick={() => onChange(presetPreferences(preset.id, prefs))} className={clsx("press min-h-11 rounded-xl px-3 text-sm", prefs.preset === preset.id ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>{preset.label}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Price per night">
          <select value={prefs.budget} onChange={(event) => onChange({ ...prefs, preset: "overall", budget: event.target.value as BudgetBand })} className={selectClass}>
            <option value="any">Any</option>
            <option value="under-150">Under {unit(prefs)}150</option>
            <option value="150-250">{unit(prefs)}150–250</option>
            <option value="250-400">{unit(prefs)}250–400</option>
            <option value="400-600">{unit(prefs)}400–600</option>
            <option value="over-600">{unit(prefs)}600+</option>
          </select>
        </Field>
        <Field label="Currency">
          <select value={prefs.currency} onChange={(event) => onChange({ ...prefs, currency: event.target.value as HotelPreferences["currency"] })} className={selectClass}>
            <option value="SGD">SGD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="JPY">JPY</option>
          </select>
        </Field>
        <Field label="Hotel quality">
          <select value={prefs.quality} onChange={(event) => onChange({ ...prefs, preset: "overall", quality: event.target.value as HotelPreferences["quality"] })} className={selectClass}>
            <option value="any">Any</option>
            <option value="3">3★+</option>
            <option value="4">4★+</option>
            <option value="5">5★</option>
          </select>
        </Field>
        <Toggle label="Quality is a must" on={prefs.qualityMust} onClick={() => onChange({ ...prefs, qualityMust: !prefs.qualityMust })} />
        <Field label="Travel burden">
          <select value={prefs.burden} onChange={(event) => onChange({ ...prefs, preset: "overall", burden: event.target.value as HotelPreferences["burden"] })} className={selectClass}>
            <option value="minimise">Minimise daily travel</option>
            <option value="balanced">Balanced location</option>
            <option value="loose">Location less important</option>
          </select>
        </Field>
        <Field label="Location focus">
          <select value={prefs.location} onChange={(event) => onChange({ ...prefs, preset: "overall", location: event.target.value as LocationFocus })} className={selectClass}>
            <option value="itinerary">Closest to the itinerary</option>
            <option value="station">Near a major station</option>
            <option value="nightlife">Central nightlife / food</option>
            <option value="quiet-area">Quiet neighbourhood</option>
            <option value="airport">Near the airport</option>
            <option value="attraction">Near one attraction</option>
          </select>
        </Field>
        <Field label="Room size">
          <select value={prefs.room} onChange={(event) => onChange({ ...prefs, room: event.target.value as HotelPreferences["room"] })} className={selectClass}>
            <option value="any">No preference</option>
            {["20", "25", "30", "35", "40"].map((size) => <option key={size} value={size}>{size} m²+</option>)}
          </select>
        </Field>
        <Toggle label="Room size is a must" on={prefs.roomMust} onClick={() => onChange({ ...prefs, roomMust: !prefs.roomMust })} />
        <Field label="Air conditioning">
          <select value={prefs.ac} onChange={(event) => onChange({ ...prefs, ac: event.target.value as HotelPreferences["ac"] })} className={selectClass}>
            <option value="any">No preference</option>
            <option value="ac">Must have air conditioning</option>
            <option value="individual">Individual room control</option>
          </select>
        </Field>
        <Toggle label="Air conditioning is a must" on={prefs.acMust} onClick={() => onChange({ ...prefs, acMust: !prefs.acMust })} />
        <Field label="Noise">
          <select value={prefs.noise} onChange={(event) => onChange({ ...prefs, noise: event.target.value as HotelPreferences["noise"] })} className={selectClass}>
            <option value="any">No preference</option>
            <option value="prefer">Prefer quiet</option>
            <option value="strong">Strongly prefer quiet</option>
          </select>
        </Field>
        <Field label="Style">
          <select value={prefs.style} onChange={(event) => onChange({ ...prefs, style: event.target.value as HotelStyle })} className={selectClass}>
            <option value="any">No preference</option>
            <option value="luxury">Luxury</option>
            <option value="boutique">Boutique</option>
            <option value="business">Business</option>
            <option value="family">Family-friendly</option>
            <option value="value">Value</option>
            <option value="traditional">Traditional</option>
            <option value="modern">Modern</option>
          </select>
        </Field>
        <Field label="Bed">
          <select value={prefs.bed} onChange={(event) => onChange({ ...prefs, bed: event.target.value as HotelPreferences["bed"] })} className={selectClass}>
            <option value="any">No preference</option>
            <option value="double">Double</option>
            <option value="twin">Twin</option>
            <option value="king">King</option>
            <option value="family">Family room</option>
            <option value="connecting">Connecting rooms</option>
          </select>
        </Field>
        <Toggle label="Breakfast" on={prefs.breakfast} onClick={() => onChange({ ...prefs, breakfast: !prefs.breakfast })} />
        <Toggle label="Parking" on={prefs.parking} onClick={() => onChange({ ...prefs, parking: !prefs.parking })} />
        <Toggle label="Wheelchair access" on={prefs.wheelchair} onClick={() => onChange({ ...prefs, wheelchair: !prefs.wheelchair })} />
      </div>
      <p className="text-xs text-mute">A must removes a hotel only when the map says it fails. Missing facts stay, with a warning. Price is not used to rank, because no live rate is connected.</p>
    </div>
  );
}

function HotelCompare({ trip, hotels }: { trip: Trip; hotels: HotelPick[] }) {
  const rows = [
    { label: "Estimated first leg", value: (hotel: HotelPick) => `${hotel.averageMin} min average · ${hotel.longestMin} min longest` },
    { label: "Stars", value: (hotel: HotelPick) => verified(hotelStop(trip, hotel), "stars") },
    { label: "Room size", value: (hotel: HotelPick) => verified(hotelStop(trip, hotel), "room") },
    { label: "Air conditioning", value: (hotel: HotelPick) => verified(hotelStop(trip, hotel), "air") },
    { label: "Breakfast", value: (hotel: HotelPick) => verified(hotelStop(trip, hotel), "breakfast") },
    { label: "Wheelchair", value: (hotel: HotelPick) => verified(hotelStop(trip, hotel), "wheelchair") },
    { label: "Parking", value: (hotel: HotelPick) => verified(hotelStop(trip, hotel), "parking") },
  ].filter((row) => hotels.some((hotel) => row.value(hotel)));
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {hotels.map((hotel) => (
        <article key={hotel.stopId} className="rounded-xl bg-ink p-3 text-sm">
          <p className="text-xs font-semibold tracking-brand text-accent">{(hotel.role || "Suggested").toUpperCase()}</p>
          <p className="mt-1 font-semibold text-cream">{hotel.name}</p>
          <dl className="mt-2 space-y-2">
            {rows.map((row) => {
              const text = row.value(hotel);
              if (!text) return null;
              return (
                <div key={row.label}>
                  <dt className="text-mute">{row.label}</dt>
                  <dd className="text-cream">{text}</dd>
                </div>
              );
            })}
          </dl>
        </article>
      ))}
    </div>
  );
}

function verified(stop: TripStop | null, kind: "stars" | "room" | "air" | "breakfast" | "wheelchair" | "parking"): string | null {
  const hotel = stop?.hotel;
  if (!hotel) return null;
  if (kind === "stars") {
    const stars = Number((hotel.stars || "").match(/\d(?:\.\d)?/)?.[0]);
    return stars >= 1 && stars <= 5 ? `${stars}★ on OpenStreetMap` : null;
  }
  if (kind === "room") {
    const room = Number((hotel.roomSize || "").match(/\d{2,3}/)?.[0]);
    return room >= 8 && room <= 200 ? `${room} m² on OpenStreetMap` : null;
  }
  const value = kind === "air" ? hotel.airConditioning : hotel[kind];
  if (value === "yes") return kind === "air" ? "Hotel air conditioning. Not individual room control." : "Yes, on OpenStreetMap";
  if (value === "no") return "No, on OpenStreetMap";
  return null;
}

function hotelStop(trip: Trip, hotel: HotelPick): TripStop | null {
  return trip.stops.find((stop) => stop.category === "stay" && (stop.providerId === hotel.stopId || stop.id === hotel.stopId)) ?? null;
}

function actionInput(trip: Trip, stop: TripStop) {
  return {
    mode: "travel" as const,
    kind: "hotel" as const,
    countryCode: trip.countryCode,
    navigate: false,
    checkIn: trip.start,
    checkOut: addDays(trip.start, trip.nights),
    adults: trip.adults,
    childAges: trip.childAges,
    destination: trip.destination,
    place: {
      id: stop.providerId || stop.id,
      name: stop.name,
      nameEn: stop.nameEn,
      nameLocal: stop.nameLocal,
      localName: stop.localName,
      displayName: stop.displayName,
      nameEnglish: stop.nameEnglish,
      nameRomanized: stop.nameRomanized,
      address: stop.addressDisplay || stop.address,
      city: stop.area,
      region: stop.region,
      countryCode: trip.countryCode,
      lat: stop.lat,
      lng: stop.lng,
      website: stop.website,
    },
  };
}

function partyLine(trip: Trip): string {
  const children = trip.childAges.length ? ` · ${trip.childAges.length === 1 ? "child" : "children"} ${trip.childAges.join(", ")}` : "";
  return `${trip.adults} adult${trip.adults === 1 ? "" : "s"}${children}`;
}

function summary(prefs: HotelPreferences): string {
  return [budgetText(prefs), prefs.quality === "any" ? "Any quality" : `${prefs.quality}★+`, prefs.burden === "minimise" ? "Minimise travel" : prefs.burden === "loose" ? "Location flexible" : "Balanced location"].join(" · ");
}

function unit(prefs: HotelPreferences): string {
  if (prefs.currency === "EUR") return "€";
  if (prefs.currency === "JPY") return "¥";
  if (prefs.currency === "USD") return "US$";
  return "S$";
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="text-xs text-mute">{label}{children}</label>;
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return <button type="button" aria-pressed={on} onClick={onClick} className={clsx("press min-h-11 rounded-xl px-3 text-left text-sm", on ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>{label}</button>;
}

const selectClass = "mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line";
