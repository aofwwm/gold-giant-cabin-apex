import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { pinKey, TRAVEL_MAP_CREDIT, TRAVEL_MAP_STYLE, type Trip, type TripStop } from "@/lib/travel-model";
import { hotelOptimizerEnabled } from "@/lib/hotel-bases";
import { isPermittedPhotoUrl } from "@/lib/travel-photo";
import { localSubtitle, readableName } from "@/lib/travel-names";

const DAY_COLOR = ["#d7b07a", "#7aa0b5", "#7d9a84", "#e6b34d", "#c4899a", "#6fafa6", "#e23b28"];

type FeatureCollection = { type: "FeatureCollection"; features: { type: "Feature"; geometry: { type: string; coordinates: unknown }; properties: Record<string, string> }[] };

function empty(): FeatureCollection {
  return { type: "FeatureCollection", features: [] };
}

function colorFor(day: number): string {
  return DAY_COLOR[day % DAY_COLOR.length] ?? DAY_COLOR[0];
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => {
    if (ch === "&") return "&";
    if (ch === "<") return "<";
    if (ch === ">") return ">";
    if (ch.charCodeAt(0) === 34) return "&quot;";
    return "&#39;";
  });
}

export function TravelMap({
  trip,
  days,
  selected,
  onSelect,
}: {
  trip: Trip;
  days: number[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const host = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const onSelectRef = useRef(onSelect);
  const dataRef = useRef<{ stops: FeatureCollection; lines: FeatureCollection; selected: string | null }>({ stops: empty(), lines: empty(), selected: null });
  const [broken, setBroken] = useState(false);
  onSelectRef.current = onSelect;

  const hotelIds = new Set((trip.hotels ?? []).filter((hotel) => hotelOptimizerEnabled() || hotel.booked).map((hotel) => hotel.stopId));
  const pins = new Map<string, TripStop>();
  for (const stop of trip.stops) {
    if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) continue;
    const onDay = stop.day != null && days.includes(stop.day);
    const picked = stop.id === selected;
    const shortlisted = hotelIds.has(stop.id) || Boolean(stop.providerId && hotelIds.has(stop.providerId));
    if (!onDay && !picked && !shortlisted) continue;
    const key = pinKey(stop);
    if (!pins.has(key) || picked) pins.set(key, stop);
  }
  const stopFeatures: FeatureCollection = {
    type: "FeatureCollection",
    features: [...pins.values()].map((stop) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [stop.lng, stop.lat] },
      properties: {
        id: stop.id,
        name: readableName(stop),
        local: localSubtitle(stop),
        image: isPermittedPhotoUrl(stop.image) ? stop.image ?? "" : "",
        color: colorFor(stop.day ?? 0),
        selected: stop.id === selected ? "yes" : "no",
      },
    })),
  };
  const lineFeatures: FeatureCollection = {
    type: "FeatureCollection",
    features: trip.days.filter((day) => days.includes(day.index) && day.line && day.line.length > 1).map((day) => ({
      type: "Feature",
      geometry: { type: "LineString", coordinates: day.line },
      properties: { color: colorFor(day.index), id: day.date },
    })),
  };
  dataRef.current = { stops: stopFeatures, lines: lineFeatures, selected };

  function paint(map: import("maplibre-gl").Map) {
    const stops = map.getSource("stops") as import("maplibre-gl").GeoJSONSource | undefined;
    const lines = map.getSource("lines") as import("maplibre-gl").GeoJSONSource | undefined;
    if (!stops || !lines) return;
    stops.setData(dataRef.current.stops as never);
    lines.setData(dataRef.current.lines as never);
    const focus = dataRef.current.stops.features.find((feature) => feature.properties.id === dataRef.current.selected);
    if (focus && Array.isArray(focus.geometry.coordinates)) {
      const [lng, lat] = focus.geometry.coordinates as [number, number];
      map.easeTo({ center: [lng, lat], duration: 400 });
      return;
    }
    const coords = dataRef.current.stops.features.map((feature) => feature.geometry.coordinates as [number, number]).filter((pair) => pair?.length === 2);
    if (coords.length === 1 && coords[0]) map.easeTo({ center: coords[0], zoom: 12, duration: 0 });
    else if (coords.length > 1) {
      const west = Math.min(...coords.map((pair) => pair[0]));
      const east = Math.max(...coords.map((pair) => pair[0]));
      const south = Math.min(...coords.map((pair) => pair[1]));
      const north = Math.max(...coords.map((pair) => pair[1]));
      map.fitBounds([[west, south], [east, north]], { padding: 48, maxZoom: 13, duration: 0 });
    }
  }

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let gone = false;
    let map: import("maplibre-gl").Map | null = null;
    const area = trip.areas[0];
    void import("maplibre-gl").then((ml) => {
      if (gone || !node) return;
      ml.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
      map = new ml.Map({
        container: node,
        style: TRAVEL_MAP_STYLE,
        center: [area?.longitude ?? 0, area?.latitude ?? 0],
        zoom: 11,
      });
      map.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        if (!map) return;
        map.addSource("lines", { type: "geojson", data: empty() as never });
        map.addSource("stops", { type: "geojson", data: empty() as never });
        map.addLayer({ id: "lines", type: "line", source: "lines", paint: { "line-color": ["get", "color"], "line-width": 3 } });
        map.addLayer({
          id: "stops",
          type: "circle",
          source: "stops",
          paint: {
            "circle-radius": ["case", ["==", ["get", "selected"], "yes"], 10, 7],
            "circle-color": ["get", "color"],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#f4eadc",
          },
        });
        map.on("click", "stops", (event) => {
          const feature = event.features?.[0];
          const id = feature?.properties?.id;
          const title = typeof feature?.properties?.name === "string" ? feature.properties.name : "";
          const local = typeof feature?.properties?.local === "string" ? feature.properties.local : "";
          const image = typeof feature?.properties?.image === "string" && isPermittedPhotoUrl(feature.properties.image) ? feature.properties.image : "";
          if (typeof id === "string") onSelectRef.current(id);
          if (!map || !title) return;
          const picture = image ? `<img src="${escapeHtml(image)}" alt="" style="display:block;width:100%;height:72px;object-fit:cover;border-radius:8px;margin-bottom:6px" />` : "";
          new ml.Popup({ closeButton: true, maxWidth: "220px" })
            .setLngLat(event.lngLat)
            .setHTML(`${picture}<strong>${escapeHtml(title)}</strong>${local ? `<div>${escapeHtml(local)}</div>` : ""}`)
            .addTo(map);
        });
        mapRef.current = map;
        paint(map);
      });
      map.on("error", () => {
        if (!map?.isStyleLoaded()) setBroken(true);
      });
    }).catch(() => setBroken(true));
    return () => {
      gone = true;
      map?.remove();
      mapRef.current = null;
    };
    // A new trip recentres the map. Stop edits update the sources below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.id]);

  const stamp = `${days.join(",")}:${selected ?? ""}:${stopFeatures.features.map((feature) => feature.properties.id).join(",")}:${lineFeatures.features.length}`;

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    paint(map);
  }, [stamp]);

  const listed = [...pins.values()];
  return (
    <div>
      <div ref={host} className="h-96 w-full overflow-hidden rounded-xl bg-ink" />
      <p className="mt-2 text-xs text-mute">{TRAVEL_MAP_CREDIT}</p>
      {broken ? <p className="mt-2 text-sm text-mute">The map tiles did not load. The stops are still in the plan, with the coordinates we already have.</p> : null}
      {!listed.length ? <p className="mt-2 text-sm text-mute">No mapped stops in this view.</p> : null}
      <ul className="mt-3 space-y-2">
        {listed.map((stop) => (
          <li key={pinKey(stop)}>
            <button type="button" onClick={() => onSelect(stop.id)} className="press min-h-11 w-full rounded-xl px-3 text-left text-sm ring-1 ring-line">
              <span className="text-cream">{readableName(stop)}</span>
              {localSubtitle(stop) ? <span className="mt-1 block text-mute">{localSubtitle(stop)}</span> : null}
              <span className="mt-1 block text-mute">Day {(stop.day ?? 0) + 1} · {stop.category.replace(/_/g, " ")}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
