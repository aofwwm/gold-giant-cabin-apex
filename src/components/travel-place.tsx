import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Trip, TripStop } from "@/lib/travel-model";
import { localSubtitle, placeCopy, readableName, routeLabel } from "@/lib/travel-names";
import { isPermittedPhotoUrl, photoCredit, type PlacePhoto as PlacePhotoRecord } from "@/lib/travel-photo";
import { EXPERIENCE_LABEL, hoursLine, type ExperienceKey } from "@/lib/travel-story";
import { ensureStopPhoto, logStopPhoto, photoCacheKey, placePhotos, retryStopPhoto } from "@/lib/travel-photo-client";
import { ExternalActions } from "@/components/external-actions";
import { kindFromTravelCategory } from "@/lib/external-actions";
import { addDays } from "@/lib/travel";
import {
  automaticNav,
  detectPlatform,
  handoffChoices,
  inferCountry,
  navLabel,
  navigationHref,
  readNavPreference,
  writeNavPreference,
  type NavApp,
  type NavPoint,
} from "@/lib/travel-routing";

export function PlaceTitle({ place, className }: { place: TripStop | { name: string; displayName?: string; displaySubtitle?: string; nameLocal?: string; localName?: string }; className?: string }) {
  const sub = localSubtitle(place);
  return (
    <>
      <span className={className ?? "block text-cream"}>{readableName(place)}</span>
      {sub ? <span className="block text-sm text-mute">{sub}</span> : null}
    </>
  );
}

function navPoint(point: { lat: number; lng: number; name?: string; nameLocal?: string; localName?: string }, fallback: string): NavPoint {
  return { lat: point.lat, lng: point.lng, name: routeLabel(point) || fallback };
}

export function NavigateControl({ from, to, mode, countryCode }: { from: NavPoint; to: NavPoint; mode: string; countryCode?: string }) {
  const [pref, setPref] = useState(readNavPreference);
  const [open, setOpen] = useState(false);
  const country = inferCountry(to.lat, to.lng, countryCode);
  const resolved = pref === "automatic" ? automaticNav(country, detectPlatform()) : pref;
  const href = navigationHref(resolved, from, to, mode);
  if (pref !== "automatic") {
    return <a href={href} target="_blank" rel="noreferrer" className="press inline-flex min-h-11 items-center rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Navigate</a>;
  }
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Navigate</button>
      {open ? (
        <div className="mt-2 grid gap-2 rounded-xl bg-ink p-3 ring-1 ring-line">
          <p className="text-xs font-semibold tracking-brand text-accent">OPEN WITH</p>
          {handoffChoices(country).slice(0, 3).map((app) => (
            <a key={app} href={navigationHref(app, from, to, mode)} target="_blank" rel="noreferrer" className="press inline-flex min-h-11 items-center text-sm text-cream">{navLabel(app)}</a>
          ))}
          <button type="button" onClick={() => { writeNavPreference(resolved); setPref(resolved); setOpen(false); }} className="press min-h-11 text-left text-sm text-cream">Always use {navLabel(resolved)}</button>
        </div>
      ) : null}
    </div>
  );
}

export function transitLinks(from: { lat: number; lng: number; name?: string; nameLocal?: string; localName?: string }, to: { lat: number; lng: number; name?: string; nameLocal?: string; localName?: string }, mode = "transit"): { href: string; label: string }[] {
  const origin = navPoint(from, "Start");
  const dest = navPoint(to, "End");
  const apps: NavApp[] = ["google", "apple", "amap"];
  return apps.map((app) => ({ href: navigationHref(app, origin, dest, mode), label: navLabel(app) }));
}

export function PlacePhoto({ stop, tall, onPhoto }: { stop: TripStop; tall?: boolean; onPhoto?: (stopId: string, photo: PlacePhotoRecord) => void }) {
  const key = photoCacheKey(stop);
  const record = useSyncExternalStore(placePhotos.subscribe, () => placePhotos.read(key), () => placePhotos.read(key));
  const gallery = (stop.photos ?? []).map((photo) => photo.thumbnailUrl).filter((url) => isPermittedPhotoUrl(url));
  const [pick, setPick] = useState(0);
  const stored = record.status === "READY" && record.photo && isPermittedPhotoUrl(record.photo.thumbnailUrl) ? record.photo.thumbnailUrl : "";
  const direct = isPermittedPhotoUrl(stop.image) ? stop.image ?? "" : "";
  const preferred = gallery[pick] || stored || direct;
  const waiting = !preferred && (record.status === "UNRESOLVED" || record.status === "LOADING");
  const [broken, setBroken] = useState(false);
  const tried = useRef(new Set<string>());
  const onPhotoRef = useRef(onPhoto);
  onPhotoRef.current = onPhoto;
  const box = tall ? "h-64 w-full" : "h-16 w-16 shrink-0";
  useEffect(() => {
    setPick(0);
    setBroken(false);
    tried.current = new Set();
  }, [stop.id]);
  useEffect(() => {
    ensureStopPhoto(stop);
  }, [stop.id, stop.wikidataId, stop.commonsFile, stop.image, stop.wikipedia]);
  useEffect(() => {
    const photo = record.photo;
    if (record.status !== "READY" || !photo || !isPermittedPhotoUrl(photo.thumbnailUrl)) return;
    if (stop.image === photo.thumbnailUrl) return;
    onPhotoRef.current?.(stop.id, photo);
  }, [record.status, record.photo, stop.id, stop.image]);

  const showImage = Boolean(preferred) && !broken;
  if (!showImage && (waiting || record.status === "LOADING")) return <div className={`${box} animate-pulse rounded-xl bg-white/10`} aria-hidden="true" />;
  if (!showImage) {
    if (!tall) return <div className={`${box} rounded-xl bg-white/5`} aria-hidden="true" />;
    return <div className={`grid ${box} place-items-center rounded-xl bg-white/5 text-sm text-mute`}>No photo available</div>;
  }
  return (
    <div>
      <img
        src={preferred}
        alt={readableName(stop)}
        referrerPolicy="no-referrer"
        className={`${box} rounded-xl object-cover`}
        onError={() => {
          if (tried.current.has(preferred)) {
            setBroken(true);
            return;
          }
          tried.current.add(preferred);
          const nextPick = gallery.find((url) => !tried.current.has(url));
          if (nextPick) {
            setPick(gallery.indexOf(nextPick));
            return;
          }
          const commercial = stop.photo?.source === "yelp" || stop.photo?.source === "foursquare" || stop.photo?.source === "mapillary" || stop.photo?.source === "panoramax" || record.photo?.source === "yelp" || record.photo?.source === "foursquare";
          if (commercial) {
            setBroken(true);
            return;
          }
          setBroken(true);
          void retryStopPhoto(stop, preferred).then((photo) => {
            if (photo?.thumbnailUrl && isPermittedPhotoUrl(photo.thumbnailUrl) && !tried.current.has(photo.thumbnailUrl)) setBroken(false);
          });
        }}
      />
      {tall && gallery.length > 1 ? (
        <div className="mt-2 flex gap-2">
          {gallery.slice(0, 4).map((url, index) => (
            <button key={url} type="button" onClick={() => setPick(index)} className={`h-14 w-14 overflow-hidden rounded-lg ring-1 ${index === pick ? "ring-accent" : "ring-line"}`}>
              <img src={url} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Elsewhere({ stop, trip }: { stop: TripStop; trip: Trip }) {
  return (
    <ExternalActions
      heading="CHECK ELSEWHERE"
      input={{
        mode: "travel",
        kind: kindFromTravelCategory(stop.category),
        countryCode: trip.countryCode,
        navigate: false,
        checkIn: trip.start,
        checkOut: addDays(trip.start, trip.nights),
        adults: trip.adults,
        childAges: trip.childAges,
        destination: trip.destination,
        place: {
          id: stop.id,
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
      }}
    />
  );
}

export function PlaceDetail({
  trip,
  stop,
  best,
  onClose,
  onAdd,
  onSave,
  onExclude,
  onRemove,
  onMove,
  onShowMap,
  onPhoto,
  returnScroll = 0,
}: {
  trip: Trip;
  stop: TripStop;
  best: { day: number; minutes: number; reason: string } | null;
  onClose: () => void;
  onAdd: (day: number) => void;
  onSave: () => void;
  onExclude: () => void;
  onRemove: (keep: boolean) => void;
  onMove: (day: number) => void;
  onShowMap: () => void;
  onPhoto?: (stopId: string, photo: PlacePhotoRecord) => void;
  returnScroll?: number;
}) {
  const scheduled = stop.day != null;
  const from = trip.stops.find((item) => item.day === stop.day && item.category === "stay") ?? trip.areas[0];
  const origin = from && "lat" in from ? from : { lat: trip.areas[0]?.latitude ?? stop.lat, lng: trip.areas[0]?.longitude ?? stop.lng };
  const copy = placeCopy(stop);
  const story = stop.story;
  const area = trip.areas[0];
  const originPoint = "name" in origin
    ? navPoint(origin, "Start")
    : { lat: origin.lat, lng: origin.lng, name: area?.name || "Start" };
  const placeLine = [area?.name, trip.destination].filter((value, index, list) => value && list.indexOf(value) === index).join(", ");
  const profile = Object.entries(story?.experienceProfile ?? {}) as [ExperienceKey, number][];
  const hours = hoursLine(stop.opening);
  const hero = stop.photos?.[0] || stop.photo;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const y = returnScroll;
    logStopPhoto("place-detail-open", stop);
    return () => {
      document.body.style.overflow = previous;
      requestAnimationFrame(() => window.scrollTo(0, y));
    };
  }, [returnScroll, stop]);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[80] flex bg-ink lg:justify-end lg:bg-ink/50" role="dialog" aria-modal="true" aria-label={readableName(stop)}>
      <button type="button" className="absolute inset-0 hidden lg:block" aria-label="Close place" onClick={onClose} />
      <div className="relative flex h-[100dvh] w-full flex-col bg-panel lg:w-[28rem] lg:shadow-card">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-panel px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] ring-1 ring-line">
          <p className="text-xs font-semibold tracking-brand text-accent">PLACE</p>
          <button type="button" onClick={onClose} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Close</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <PlacePhoto stop={stop} tall onPhoto={onPhoto} />
        <p className="mt-3 text-xs font-semibold tracking-brand text-accent">{(stop.importance ?? "place").toUpperCase()} · {stop.category.replace(/_/g, " ")}</p>
        <h3 className="font-display text-2xl text-cream"><PlaceTitle place={stop} className="font-display text-2xl text-cream" /></h3>
        {placeLine ? <p className="text-sm text-mute">{placeLine}</p> : null}
        {story?.whyIconic ? (
          <section className="mt-4">
            <p className="text-xs font-semibold tracking-brand text-accent">WHY IT'S ICONIC</p>
            <p className="mt-1 text-sm text-cream">{story.whyIconic}</p>
          </section>
        ) : null}
        {story?.whyGo ? (
          <section className="mt-4">
            <p className="text-xs font-semibold tracking-brand text-accent">WHY GO</p>
            <p className="mt-1 text-sm text-cream">{story.whyGo}</p>
          </section>
        ) : null}
        {!story?.whyIconic && !story?.whyGo && copy.description && !/located|situated/i.test(copy.description) ? <p className="mt-3 text-sm text-cream">{copy.description}</p> : null}
        {story?.signatureExperiences.length ? <p className="mt-3 text-sm text-mute">{story.signatureExperiences.join(" · ")}</p> : null}
        {profile.length ? (
          <section className="mt-4">
            <p className="text-xs font-semibold tracking-brand text-accent">KAIROS EXPERIENCE PROFILE</p>
            <p className="mt-1 text-[11px] text-mute">What kind of visit this is.</p>
            <ul className="mt-2 space-y-1">
              {profile.slice(0, 6).map(([key, value]) => (
                <li key={key} className="flex items-center justify-between text-sm text-cream">
                  <span>{EXPERIENCE_LABEL[key]}</span>
                  <span className="tracking-wide text-accent" aria-label={`${value} of 5`}>{"★".repeat(value)}<span className="text-line/40">{"★".repeat(Math.max(0, 5 - value))}</span></span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {story?.bestFor.length ? (
          <section className="mt-4">
            <p className="text-xs font-semibold tracking-brand text-accent">BEST FOR</p>
            <p className="mt-1 text-sm text-cream">{story.bestFor.join(" · ")}</p>
          </section>
        ) : null}
        <p className="mt-4 text-xs font-semibold tracking-brand text-accent">PLAN FOR</p>
        <p className="mt-1 text-sm text-cream">{story?.visitLabel || `${stop.duration} min`}</p>
        {story?.bestTime ? <p className="mt-2 text-sm text-mute">Best time · {story.bestTime}</p> : null}
        {story?.effort ? <p className="mt-1 text-sm text-mute">{story.effort}</p> : null}
        {hours ? <p className="mt-2 text-sm text-cream">Hours · {hours}</p> : null}
        {story?.nearbyCombos.length ? (
          <section className="mt-4">
            <p className="text-xs font-semibold tracking-brand text-accent">GOOD TO COMBINE WITH</p>
            <p className="mt-1 text-sm text-cream">{story.nearbyCombos.join(" · ")}</p>
          </section>
        ) : null}
        {copy.address ? <p className="mt-3 text-sm text-cream">{copy.address}</p> : null}
        {copy.addressLocal ? <p className="mt-1 text-sm text-mute">{copy.addressLocal}</p> : null}
        {best && !scheduled ? <p className="mt-3 text-sm text-cream">Best fit · Day {best.day + 1}. {best.reason}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {scheduled ? trip.days.slice(0, 7).map((day) => (
            <button key={day.date} type="button" onClick={() => onMove(day.index)} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Move to day {day.index + 1}</button>
          )) : (
            <button type="button" onClick={() => onAdd(best?.day ?? 0)} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Add</button>
          )}
          {!scheduled ? <button type="button" onClick={onSave} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Save</button> : null}
          <button type="button" onClick={onShowMap} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Show on map</button>
          {scheduled ? <button type="button" onClick={() => onRemove(true)} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Remove, keep saved</button> : null}
          <button type="button" onClick={onExclude} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Not for me</button>
        </div>
        <Elsewhere stop={stop} trip={trip} />
        <div className="mt-4">
          <p className="text-xs font-semibold tracking-brand text-accent">GET THERE</p>
          <div className="mt-2">
            <NavigateControl from={originPoint} to={navPoint(stop, readableName(stop))} mode="taxi" countryCode={trip.countryCode} />
          </div>
        </div>
        <details className="mt-4 rounded-xl bg-ink px-3 py-2">
          <summary className="cursor-pointer text-sm text-cream">Sources & photo credits</summary>
          <div className="mt-2 space-y-1 text-xs text-mute">
            <p>Place facts come from OpenStreetMap and Wikidata. A Wikipedia introduction, when used, is CC BY-SA and is not copied in full.</p>
            {story?.localNameSource ? <p>Local name · {story.localNameSource.replace(/_/g, " ")}</p> : null}
            {story?.descriptionSource ? <p>Description · {story.descriptionSource.replace(/_/g, " ")}</p> : null}
            {stop.opening ? <p>Opening hours · OpenStreetMap{hours ? "" : " (could not be read as a simple range)"}{stop.opening ? `: ${stop.opening}` : ""}</p> : null}
            {(stop.photos?.length ? stop.photos : hero ? [hero] : []).map((photo) => (
              <p key={photo.thumbnailUrl}>
                Photo · <a className="text-accent" href={photo.descriptionUrl || photo.thumbnailUrl} target="_blank" rel="noreferrer">{photoCredit(photo.source)}</a>
                {photo.license ? photo.licenseUrl ? <> · <a className="text-accent" href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></> : ` · ${photo.license}` : ""}
                {photo.creator ? ` · ${photo.creator}` : ""}
                {photo.fileTitle ? ` · ${photo.fileTitle.replace(/^File:/, "")}` : ""}
              </p>
            ))}
            {hero?.attributionRequired ? <p>Attribution is required for this photo.</p> : null}
            {stop.commerce?.url ? <p><a className="text-accent" href={stop.commerce.url} target="_blank" rel="noreferrer">{stop.commerce.provider === "yelp" ? "Yelp" : "Foursquare"} · {stop.commerce.name}</a></p> : null}
          </div>
        </details>
        <button type="button" onClick={onClose} className="press mt-3 min-h-11 text-sm text-mute lg:hidden">Back to the itinerary</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
