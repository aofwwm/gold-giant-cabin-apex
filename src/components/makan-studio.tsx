import { clsx } from "clsx";
import { Check, Dices, MapPin } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { fieldClass } from "@/components/kairos-ui";
import { KairosVoice } from "@/components/kairos-voice";
import { findMakan } from "@/lib/coord.functions";
import {
  CUISINE_OPTIONS,
  MORE_CUISINES,
  PLACE_TYPES,
  cuisineLabel,
  placeKindLabel,
  priceLabel,
  resultBlurb,
  sortMakanHits,
  spinOne,
  type CuisineId,
  type Hit,
  type MakanBrief,
  type MakanSort,
  type MatchContext,
  type PlaceKind,
} from "@/lib/coord";
import { AREAS, matchArea } from "@/lib/directory";
import { lookupPlace, reversePlace } from "@/lib/geo.functions";
import { fetchEvent } from "@/lib/kairos.functions";
import type { EventView } from "@/lib/kairos.types";
import type { MakanOrigin } from "@/lib/makan-origin";
import { readHome, readOffice, writeHome, writeOffice, type SavedOffice } from "@/lib/office";
import { mealFollowOn, placeSummary } from "@/lib/place";
import { ExternalActions } from "@/components/external-actions";

const WALKS = [
  { id: 5 as const, label: "5 min walk" },
  { id: 10 as const, label: "10 min walk" },
  { id: 15 as const, label: "15 min walk" },
  { id: 25 as const, label: "Short ride" },
];

const BUDGETS = [
  { id: 1 as const, label: "<$10" },
  { id: 2 as const, label: "$10–$20" },
  { id: 0 as const, label: "Any" },
];

const DIETS = [
  { id: "", label: "No restriction" },
  { id: "halal", label: "Halal" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "other", label: "Other" },
] as const;

const MOODS = [
  { id: "", label: "Any" },
  { id: "quick", label: "Quick" },
  { id: "comfortable", label: "Comfortable" },
  { id: "different", label: "Something different" },
  { id: "coffee", label: "Coffee" },
  { id: "casual", label: "Casual team lunch" },
] as const;

const MEALS = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "before", label: "Before meeting" },
  { id: "after", label: "After meeting" },
] as const;

type Meal = (typeof MEALS)[number]["id"];
type Origin = "meeting" | "office" | "home" | "current" | "choose";
type PlaceHit = {
  name?: string;
  label: string;
  address: string;
  kind?: string;
  latitude: number;
  longitude: number;
  providerId?: string;
};
type SavedFav = {
  id: string;
  name: string;
  address: string;
  mapsUrl: string;
  lat: number;
  lng: number;
  cuisine?: string;
  placeKind?: Hit["placeKind"];
  cuisines?: CuisineId[];
  minutes?: number;
  verified?: boolean;
};

function favKey(hit: { id: string; name: string }): string {
  return hit.id || hit.name.toLowerCase();
}

function readFavs(): SavedFav[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem("kairos-makan-favs") ?? "[]") as SavedFav[];
    return Array.isArray(raw) ? raw.filter((item) => item && typeof item.name === "string" && typeof item.id === "string").slice(0, 24) : [];
  } catch {
    return [];
  }
}

function writeFavs(next: SavedFav[]) {
  localStorage.setItem("kairos-makan-favs", JSON.stringify(next.slice(0, 24)));
}

function budgetCopy(id: number): string {
  if (id === 1) return "Under $10/pax";
  if (id === 2) return "$10–$20/pax";
  return "Any budget";
}

function mealWindow(meal: Meal): string {
  if (meal === "breakfast") return "8:00 AM – 9:30 AM";
  if (meal === "lunch") return "11:40 AM – 12:45 PM";
  if (meal === "dinner") return "6:30 PM – 8:00 PM";
  if (meal === "before") return "Before the meeting";
  return "After the meeting";
}

function dietApi(value: (typeof DIETS)[number]["id"]): MakanBrief["dietary"] {
  return value === "other" ? "" : value;
}

export function MakanStudio({ code }: { code: string }) {
  const [event, setEvent] = useState<EventView | null>(null);
  const [origin, setOrigin] = useState<Origin>(code ? "meeting" : "choose");
  const [areaId, setAreaId] = useState("");
  const [address, setAddress] = useState("");
  const [groupSize, setGroupSize] = useState(6);
  const [groupDraft, setGroupDraft] = useState("6");
  const [minutes, setMinutes] = useState<(typeof WALKS)[number]["id"]>(10);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number]["id"]>(2);
  const [dietary, setDietary] = useState<(typeof DIETS)[number]["id"]>("");
  const [mood, setMood] = useState<(typeof MOODS)[number]["id"]>("");
  const [cuisines, setCuisines] = useState<CuisineId[]>([]);
  const [placeTypes, setPlaceTypes] = useState<PlaceKind[]>([]);
  const [moreCuisine, setMoreCuisine] = useState(false);
  const [sortMode, setSortMode] = useState<MakanSort>("match");
  const [randomSeed, setRandomSeed] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [favs, setFavs] = useState<SavedFav[]>([]);
  const [forcedIds, setForcedIds] = useState<string[]>([]);
  const [meal, setMeal] = useState<Meal>("lunch");
  const [hits, setHits] = useState<Hit[]>([]);
  const [pool, setPool] = useState<Hit[]>([]);
  const [pick, setPick] = useState<Hit | null>(null);
  const [chosenId, setChosenId] = useState("");
  const [note, setNote] = useState("");
  const [originLabel, setOriginLabel] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [office, setOffice] = useState<SavedOffice | null>(null);
  const [officeName, setOfficeName] = useState("");
  const [home, setHome] = useState<SavedOffice | null>(null);
  const [homeName, setHomeName] = useState("");
  const [searchStatus, setSearchStatus] = useState<"" | "ok" | "geocode" | "routes" | "walk" | "filters" | "distance">("");
  const [resolvedFrom, setResolvedFrom] = useState("");
  const [geo, setGeo] = useState<MakanOrigin | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const [locKind, setLocKind] = useState<"" | "denied" | "unavailable" | "timeout" | "unsupported" | "insecure">("");
  const [approximate, setApproximate] = useState(false);
  const [lookup, setLookup] = useState("");
  const [lookups, setLookups] = useState<PlaceHit[]>([]);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupMiss, setLookupMiss] = useState(false);
  const locateGen = useRef(0);
  const lookupGen = useRef(0);

  useEffect(() => {
    setFavs(readFavs());
  }, []);

  useEffect(() => {
    if (origin !== "choose") return;
    const query = lookup.trim();
    if (geo?.source === "manual" && query === (geo.label || "")) return;
    if (query.length < 2) {
      setLookups([]);
      setLookupMiss(false);
      return;
    }
    const gen = lookupGen.current + 1;
    lookupGen.current = gen;
    const timer = window.setTimeout(() => {
      setLookingUp(true);
      setLookupMiss(false);
      void lookupPlace({ data: { query } })
        .then((found) => {
          if (lookupGen.current !== gen) return;
          setLookups(found);
          setLookupMiss(found.length === 0);
          if (found.length) setError("");
        })
        .catch(() => {
          if (lookupGen.current !== gen) return;
          setLookups([]);
          setLookupMiss(true);
          setError("The place search did not answer. Try again.");
        })
        .finally(() => {
          if (lookupGen.current === gen) setLookingUp(false);
        });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [lookup, origin, geo?.label, geo?.source]);

  useEffect(() => {
    const saved = readOffice();
    if (!saved) return;
    setOffice(saved);
    setOfficeName(saved.name);
    if (!code) {
      setOrigin("office");
      setAddress(saved.address);
      if (saved.areaId) setAreaId(saved.areaId);
      setOriginLabel(saved.name || saved.address);
      setGeo({
        source: "office",
        label: saved.name || saved.address,
        address: saved.address,
        latitude: saved.latitude,
        longitude: saved.longitude,
      });
    }
  }, [code]);

  useEffect(() => {
    const saved = readHome();
    if (!saved) return;
    setHome(saved);
    setHomeName(saved.name);
  }, []);

  useEffect(() => {
    if (!code) return;
    let live = true;
    void fetchEvent({ data: { code } }).then((loaded) => {
      if (!live || !loaded) return;
      setEvent(loaded);
      const place = loaded.place;
      const where = place.address || place.venueName;
      if (where) {
        setAddress(where);
        setOriginLabel(where);
        setGeo({ source: "meeting_location", label: where, address: where });
        void lookupPlace({ data: { query: where } })
          .then((found) => {
            const first = found[0];
            if (!live || !first) return;
            setGeo({
              source: "meeting_location",
              label: first.label || where,
              address: first.address || where,
              latitude: first.latitude,
              longitude: first.longitude,
            });
            const area = matchArea(`${first.label} ${first.address}`);
            if (area) setAreaId(area.id);
          })
          .catch(() => {
            // The meeting address still stands if the geocoder is quiet.
          });
      }
      const area = matchArea(`${place.address} ${place.venueName}`);
      if (area) setAreaId(area.id);
      if (place.makanWhen === "before") setMeal("before");
      else if (place.makanWhen === "after") setMeal("after");
      setOrigin(where ? "meeting" : "choose");
    });
    return () => {
      live = false;
    };
  }, [code]);

  const timing = meal === "before" || meal === "after" ? meal : "";
  const fromLabel =
    originLabel ||
    address.trim() ||
    AREAS.find((area) => area.id === areaId)?.label ||
    (origin === "office" ? "My office" : "Pick a place");
  const dietLabel = DIETS.find((item) => item.id === dietary)?.label ?? "No restriction";
  const walkLabel = WALKS.find((item) => item.id === minutes)?.label ?? "10 min walk";
  const shown = (pick ? [pick] : hits).filter((hit) =>
    searchStatus === "distance" ? hit.verified !== true : hit.verified === true && hit.minutes <= minutes,
  );
  const matchContext: MatchContext = {
    groupSize,
    minutes,
    budget,
    dietary: dietApi(dietary),
    mood,
    meal: MEALS.find((item) => item.id === meal)?.label ?? "Lunch",
    cuisines,
    placeTypes,
    favouriteKeys: favs.map((fav) => favKey(fav)),
    seed: randomSeed,
  };
  const sorted = sortMakanHits(shown, sortMode === "favourites" ? "favourites" : sortMode, matchContext);
  const visible = sortMode === "random" ? sorted.slice(0, 1) : sorted.slice(0, showMore ? sorted.length : 8);
  const shownKeys = new Set(sorted.map((hit) => favKey(hit)));
  const outsideFavs = favs.filter((fav) => !shownKeys.has(favKey(fav)) && !forcedIds.includes(favKey(fav)));
  const forcedFavs = favs.filter((fav) => forcedIds.includes(favKey(fav)) && !shownKeys.has(favKey(fav)));
  const cards = shown;
  const chosen = cards.find((hit) => hit.id === chosenId) ?? null;
  const originWord =
    origin === "office" ? "Office" : origin === "home" ? "Home" : origin === "current" ? "Current location" : origin === "meeting" ? "Meeting" : "Place";
  const emptyStatus = cards.length === 0 && searchStatus === "ok" ? "walk" : searchStatus;

  function setGroup(next: number) {
    const size = Math.max(1, Math.min(40, Math.trunc(next) || 1));
    setGroupSize(size);
    setGroupDraft(String(size));
  }

  function onGroupDraft(raw: string) {
    if (raw !== "" && !/^\d{1,2}$/.test(raw)) return;
    setGroupDraft(raw);
    if (raw === "") return;
    const next = Number(raw);
    if (next >= 1 && next <= 40) setGroupSize(next);
  }

  function meetingText() {
    if (!event) return "";
    return [event.place.venueName, event.place.address].map((part) => part.trim()).filter(Boolean).join(", ");
  }

  function activePoint(): { lat: number; lng: number; label: string } | null {
    if (!geo || geo.latitude == null || geo.longitude == null) return null;
    const source =
      origin === "current"
        ? "current_location"
        : origin === "office"
          ? "office"
          : origin === "home"
            ? "home"
            : origin === "meeting"
              ? "meeting_location"
              : "manual";
    if (geo.source !== source) return null;
    return { lat: geo.latitude, lng: geo.longitude, label: geo.label || geo.address || "Here" };
  }

  function applySaved(kind: "office" | "home", saved: SavedOffice) {
    if (kind === "office") {
      setOffice(saved);
      setOfficeName(saved.name);
    } else {
      setHome(saved);
      setHomeName(saved.name);
    }
    setAddress(saved.address);
    setOriginLabel(saved.name || saved.address);
    setOrigin(kind);
    setGeo({
      source: kind,
      label: saved.name || saved.address,
      address: saved.address,
      latitude: saved.latitude,
      longitude: saved.longitude,
    });
    setLocError("");
    setError("");
  }

  function pickManual(hit: PlaceHit) {
    const name = hit.name || hit.label;
    setGeo({
      source: "manual",
      label: name,
      address: hit.address,
      latitude: hit.latitude,
      longitude: hit.longitude,
      providerId: hit.providerId,
    });
    setAddress(hit.address || name);
    setOriginLabel(name);
    setLookup(name);
    setLookups([]);
    setLookupMiss(false);
    setError("");
  }

  function clearManual() {
    lookupGen.current += 1;
    setGeo(null);
    setLookup("");
    setLookups([]);
    setLookupMiss(false);
    setLookingUp(false);
    setAddress("");
    setOriginLabel("");
    setError("");
  }

  async function pinAddress(source: MakanOrigin["source"], label: string, line: string) {
    setAddress(line);
    setOriginLabel(label);
    setGeo({ source, label, address: line });
    try {
      const found = await lookupPlace({ data: { query: line } });
      const first = found[0];
      if (!first) return;
      setGeo({
        source,
        label: first.label || label,
        address: first.address || line,
        latitude: first.latitude,
        longitude: first.longitude,
      });
      const area = matchArea(`${first.label} ${first.address}`);
      if (area) setAreaId(area.id);
    } catch {
      // Keep the written address. Do not invent a coordinate.
    }
  }

  function requestCurrentLocation() {
    setOrigin("current");
    setError("");
    setLocError("");
    setLocKind("");
    setApproximate(false);
    if (typeof window === "undefined" || !window.isSecureContext) {
      setLocKind("insecure");
      setLocError("Location needs a secure page. Open Kairos on https, or choose a location.");
      return;
    }
    if (!navigator.geolocation) {
      setLocKind("unsupported");
      setLocError("Your browser doesn’t support location detection.");
      return;
    }
    setLocating(true);
    const gen = locateGen.current + 1;
    locateGen.current = gen;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (locateGen.current !== gen) return;
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracyMeters = Math.round(position.coords.accuracy);
        setApproximate(accuracyMeters > 500);
        setGeo({ source: "current_location", label: "Current location detected", latitude, longitude, accuracyMeters });
        setOriginLabel("Current location detected");
        setLocating(false);
        void reversePlace({ data: { latitude, longitude } })
          .then((found) => {
            if (locateGen.current !== gen || !found?.label) return;
            setOriginLabel(found.label);
            setAddress(found.address || "");
            setGeo((current) =>
              current?.source === "current_location" ? { ...current, label: found.label, address: found.address } : current,
            );
            const area = matchArea(`${found.label} ${found.address}`);
            if (area) setAreaId(area.id);
          })
          .catch(() => {
            // Coordinates stay. The name stays "Current location detected".
          });
      },
      (err) => {
        if (locateGen.current !== gen) return;
        setLocating(false);
        setGeo((current) => (current?.source === "current_location" ? null : current));
        if (err.code === err.PERMISSION_DENIED) {
          setLocKind("denied");
          setLocError("Location access was blocked.");
        } else if (err.code === err.TIMEOUT) {
          setLocKind("timeout");
          setLocError("Location is taking too long.");
        } else {
          setLocKind("unavailable");
          setLocError("We couldn’t determine your current location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }

  function chooseOrigin(value: Origin) {
    setError("");
    if (value === "current") {
      requestCurrentLocation();
      return;
    }
    setOrigin(value);
    setLocError("");
    locateGen.current += 1;
    if (value === "office" || value === "home") {
      const saved = value === "office" ? (office ?? readOffice()) : (home ?? readHome());
      if (saved) applySaved(value, saved);
      else {
        setAddress("");
        setGeo(null);
        setOriginLabel("");
        setError(value === "office" ? "Office location not set." : "Home location not set.");
      }
      return;
    }
    if (value === "meeting") {
      const where = meetingText();
      if (!where) {
        setGeo(null);
        setError("No physical meeting location available.");
        return;
      }
      const area = matchArea(`${event?.place.address ?? ""} ${event?.place.venueName ?? ""}`);
      if (area) setAreaId(area.id);
      void pinAddress("meeting_location", where, where);
    }
  }

  async function savePlace(kind: "office" | "home") {
    const line = address.trim();
    const name = (kind === "office" ? officeName : homeName).trim() || line;
    if (name.length < 3) {
      setError(kind === "office" ? "Type the office building or street, then save it." : "Type the home street, then save it.");
      return;
    }
    const saved: SavedOffice = {
      name: name.slice(0, 80),
      address: (line || name).slice(0, 160),
      areaId: "",
    };
    if (kind === "office") writeOffice(saved);
    else writeHome(saved);
    applySaved(kind, saved);
    toast.success(kind === "office" ? "Office saved on this browser" : "Home saved on this browser");
    try {
      const found = await lookupPlace({ data: { query: saved.address } });
      const first = found[0];
      if (!first) return;
      const pinned: SavedOffice = { ...saved, latitude: first.latitude, longitude: first.longitude };
      if (kind === "office") writeOffice(pinned);
      else writeHome(pinned);
      applySaved(kind, pinned);
    } catch {
      // The address is saved. Find makan will geocode it again.
    }
  }

  async function runLookup() {
    const query = lookup.trim();
    if (query.length < 2) {
      setError("Type a building, mall, MRT, or address.");
      return;
    }
    const gen = lookupGen.current + 1;
    lookupGen.current = gen;
    setLookingUp(true);
    setLookupMiss(false);
    setError("");
    try {
      const found = await lookupPlace({ data: { query } });
      if (lookupGen.current !== gen) return;
      setLookups(found);
      setLookupMiss(found.length === 0);
    } catch {
      if (lookupGen.current !== gen) return;
      setLookups([]);
      setLookupMiss(true);
      setError("The place search did not answer. Try again.");
    } finally {
      if (lookupGen.current === gen) setLookingUp(false);
    }
  }

  function placeReady(): boolean {
    if (origin === "current") return geo?.source === "current_location" && geo.latitude != null && geo.longitude != null;
    if (origin === "office") return Boolean(office && (office.address || office.name));
    if (origin === "home") return Boolean(home && (home.address || home.name));
    if (origin === "meeting") return Boolean(meetingText());
    if (origin === "choose") return geo?.source === "manual" && geo.latitude != null && geo.longitude != null;
    return Boolean(address.trim() || areaId);
  }

  async function onFind(override?: {
    minutes?: (typeof WALKS)[number]["id"];
    allowDistance?: boolean;
    budget?: (typeof BUDGETS)[number]["id"];
    dietary?: (typeof DIETS)[number]["id"];
    mood?: (typeof MOODS)[number]["id"];
    cuisines?: CuisineId[];
    placeTypes?: PlaceKind[];
  }) {
    const walk = override?.minutes ?? minutes;
    const spend = override?.budget ?? budget;
    const diet = override?.dietary ?? dietary;
    const vibe = override?.mood ?? mood;
    const chosenCuisines = override && "cuisines" in override ? (override.cuisines ?? []) : cuisines;
    const chosenPlaces = override && "placeTypes" in override ? (override.placeTypes ?? []) : placeTypes;
    if (override?.minutes) setMinutes(override.minutes);
    if (override?.budget != null) setBudget(override.budget);
    if (override?.dietary != null) setDietary(override.dietary);
    if (override?.mood != null) setMood(override.mood);
    if (override && "cuisines" in override) setCuisines(chosenCuisines);
    if (override && "placeTypes" in override) setPlaceTypes(chosenPlaces);
    if (origin === "current" && locating) {
      setError("Still finding you.");
      return;
    }
    if (origin === "office" && !office) {
      setError("Office location not set.");
      return;
    }
    if (origin === "home" && !home) {
      setError("Home location not set.");
      return;
    }
    if (origin === "meeting" && !meetingText()) {
      setError("No physical meeting location available.");
      return;
    }
    if (origin === "current" && geo?.source !== "current_location") {
      setError(locError || "Use my current location, or choose a place.");
      return;
    }
    if (origin === "choose" && !(geo?.source === "manual" && geo.latitude != null && geo.longitude != null)) {
      setError("Select a place from the search results.");
      return;
    }
    setError("");
    setSearchStatus("");
    setPick(null);
    setChosenId("");
    setHits([]);
    setPool([]);
    setShowMore(false);
    setForcedIds([]);
    setNote(walk < 25 ? "Checking walking routes…" : "Checking the map…");
    const here = activePoint();
    const placeName = origin === "home" ? home?.name || homeName : origin === "office" ? office?.name || officeName : "";
    const queryAddress = address.trim() || (origin === "home" ? home?.address || "" : origin === "office" ? office?.address || "" : geo?.address || geo?.label || "");
    setPending(true);
    try {
      const result = await findMakan({
        data: {
          text: `${meal} ${queryAddress} ${groupSize} pax ${diet} ${vibe}`.trim(),
          areaId: "",
          address: queryAddress,
          groupSize,
          minutes: walk,
          budget: spend,
          dietary: dietApi(diet),
          mood: vibe,
          timing,
          explain: true,
          latitude: here?.lat ?? null,
          longitude: here?.lng ?? null,
          originName: geo?.label || placeName || "",
          savedPlaces: favs
            .filter((fav) => Number.isFinite(fav.lat) && Number.isFinite(fav.lng))
            .slice(0, 24)
            .map((fav) => ({
              id: fav.id,
              name: fav.name,
              address: fav.address,
              latitude: fav.lat,
              longitude: fav.lng,
              cuisine: fav.cuisine ?? "",
              placeKind: fav.placeKind ?? "",
            })),
          originSource: origin,
          allowDistance: override?.allowDistance ?? false,
          cuisines: chosenCuisines,
          placeTypes: chosenPlaces,
        },
      });
      setResolvedFrom(result.originAddress || result.originLabel || queryAddress);
      setOriginLabel(placeName || result.originLabel || queryAddress);
      setSearchStatus(result.status);
      if (result.status === "ok" || result.status === "distance") {
        setHits(result.hits);
        setPool(result.hits);
        setNote(result.note);
        setError("");
      } else {
        setHits([]);
        setPool([]);
        setNote(result.note);
        setError("");
      }
    } catch (err) {
      setHits([]);
      setPool([]);
      setSearchStatus("routes");
      setNote(err instanceof Error ? err.message : "Walking routes are temporarily unavailable.");
    } finally {
      setPending(false);
    }
  }

  function toggleCuisine(id: CuisineId) {
    setCuisines((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePlace(id: PlaceKind) {
    setPlaceTypes((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleFav(hit: Hit | SavedFav) {
    const key = favKey(hit);
    const exists = favs.some((fav) => favKey(fav) === key);
    const next = exists
      ? favs.filter((fav) => favKey(fav) !== key)
      : [
          {
            id: hit.id,
            name: hit.name,
            address: hit.address,
            mapsUrl: hit.mapsUrl,
            lat: hit.lat,
            lng: hit.lng,
            cuisine: hit.cuisine,
            placeKind: hit.placeKind,
            cuisines: hit.cuisines,
            minutes: "minutes" in hit ? hit.minutes : undefined,
            verified: "verified" in hit ? hit.verified : undefined,
          },
          ...favs,
        ].slice(0, 24);
    setFavs(next);
    writeFavs(next);
    toast.success(exists ? "Removed from favourites" : "Saved on this browser");
  }

  function editFilters() {
    document.getElementById("makan-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onSpin() {
    if (origin === "office" && !office) {
      setError("Office location not set.");
      return;
    }
    if (origin === "home" && !home) {
      setError("Home location not set.");
      return;
    }
    const source = pool.length ? pool : hits;
    const next = spinOne(source, pick?.id);
    if (!next) {
      setError("Find makan first. Roulette only spins places already inside the walk.");
      return;
    }
    if (!pool.length) {
      setPool(source);
      setHits(source);
      setOriginLabel(geo?.label || address.trim() || office?.name || home?.name || "");
    }
    setPick(next);
    setChosenId(next.id);
    setError("");
    setNote("Enough discussion. The universe has chosen.");
  }

  function saveIcs(hit: Hit) {
    const start = mealStart(event, timing);
    const end = new Date(start.getTime() + 60 * 60000);
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kairos//EN",
      "BEGIN:VEVENT",
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${`Makan · ${hit.name}`.replace(/[\n,;]/g, " ")}`,
      `LOCATION:${`${hit.name}, ${hit.address}`.replace(/[\n,;]/g, " ")}`,
      `DESCRIPTION:${hit.why.replace(/[\n,;]/g, " ")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kairos-makan.ics";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  const follow = event?.slots[0] ? mealFollowOn(event.place, event.slots[0].startsAt, event.durationMin) : null;

  return (
    <>
      <form
        id="makan-form"
        className="lg:col-span-2"
        onSubmit={(eventForm) => {
          eventForm.preventDefault();
          void onFind();
        }}
      >
        <p className="text-xs font-semibold tracking-brand text-gold">1 · SET THE MAKAN</p>
        <h2 className="mt-1 font-display text-2xl text-cream">Where are we eating from?</h2>
        {event ? (
          <p className="mt-2 text-sm text-mute">
            From {event.title}
            {follow ? ` · ${follow.title.replace("?", "")}` : ""}
            {placeSummary(event.place) ? ` · ${placeSummary(event.place)}` : ""}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip on={origin === "meeting"} onClick={() => chooseOrigin("meeting")}>
            Meeting location
          </Chip>
          <Chip on={origin === "office"} onClick={() => chooseOrigin("office")}>
            Office
          </Chip>
          <Chip on={origin === "home"} onClick={() => chooseOrigin("home")}>
            Home
          </Chip>
          <Chip on={origin === "current"} disabled={locating} onClick={() => chooseOrigin("current")}>
            {locating ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden />
                Finding you...
              </span>
            ) : geo?.source === "current_location" && origin === "current" ? (
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5" aria-hidden />
                Current location
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden />
                Use my current location
              </span>
            )}
          </Chip>
          <Chip on={origin === "choose"} onClick={() => chooseOrigin("choose")}>
            Choose location
          </Chip>
        </div>
        {origin === "meeting" ? (
          meetingText() ? (
            <p className="mt-3 text-sm text-cream">{geo?.source === "meeting_location" ? geo.label || meetingText() : meetingText()}</p>
          ) : (
            <p className="mt-3 text-sm text-mute">No physical meeting location available.</p>
          )
        ) : null}
        {origin === "current" ? (
          <div className="mt-3 rounded-xl bg-ink px-3 py-3 ring-1 ring-line">
            {locating ? (
              <p className="text-sm text-cream">Finding you...</p>
            ) : locError ? (
              <>
                <p role="alert" className="text-sm text-vermilion">
                  {locError}
                </p>
                <p className="mt-1 text-sm text-mute">
                  {locKind === "denied" ? "Choose an area instead." : "Choose a location instead."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {locKind === "timeout" ? (
                    <button type="button" onClick={requestCurrentLocation} className="press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink">
                      Try again
                    </button>
                  ) : null}
                  <button type="button" onClick={() => chooseOrigin("choose")} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                    Choose location
                  </button>
                </div>
              </>
            ) : geo?.source === "current_location" ? (
              <>
                <p className="text-sm font-semibold text-cream">{geo.label || "Current location detected"}</p>
                <p className="mt-1 text-sm text-mute">Used only to find places nearby.</p>
                {approximate ? (
                  <div className="mt-2">
                    <p className="text-sm text-gold">Location is approximate.</p>
                    <button type="button" onClick={() => chooseOrigin("choose")} className="press mt-2 text-sm font-semibold text-cream">
                      Choose location instead
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-mute">Used only to find places nearby.</p>
            )}
          </div>
        ) : origin === "office" || origin === "home" ? (
          <div className="mt-3 rounded-xl bg-ink px-3 py-3 ring-1 ring-line">
            <p className="text-xs font-semibold tracking-brand text-gold">{origin === "office" ? "OFFICE" : "HOME"}</p>
            <p className="mt-1 text-sm text-mute">
              {origin === "office"
                ? office
                  ? `${office.name}. ${office.address}`
                  : "Office location not set."
                : home
                  ? `${home.name}. ${home.address}`
                  : "Home location not set."}
            </p>
            <input
              value={origin === "office" ? officeName : homeName}
              onChange={(input) => (origin === "office" ? setOfficeName(input.target.value) : setHomeName(input.target.value))}
              placeholder={origin === "office" ? "Office name" : "Home name"}
              maxLength={80}
              className={clsx(fieldClass, "mt-3")}
            />
            <input
              value={address}
              onChange={(input) => setAddress(input.target.value)}
              placeholder="Street or building"
              maxLength={160}
              className={clsx(fieldClass, "mt-2")}
            />
            <button
              type="button"
              onClick={() => void savePlace(origin === "home" ? "home" : "office")}
              className="press mt-3 min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink"
            >
              {origin === "office" ? (office ? "Update office location" : "Set office location") : home ? "Update home" : "Set home location"}
            </button>
          </div>
        ) : origin === "choose" ? (
          geo?.source === "manual" && geo.latitude != null ? (
            <div className="mt-3 rounded-xl bg-ink px-3 py-3 ring-1 ring-line">
              <p className="text-xs font-semibold tracking-brand text-gold">SEARCHING FROM</p>
              <p className="mt-1 text-sm font-semibold text-cream">{geo.label}</p>
              {geo.address ? <p className="mt-1 text-sm text-mute">{geo.address}</p> : null}
              <button type="button" onClick={clearManual} className="press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                Change
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <input
                value={lookup}
                onChange={(input) => {
                  setLookup(input.target.value);
                  if (geo?.source === "manual") setGeo(null);
                }}
                onKeyDown={(input) => {
                  if (input.key === "Enter") {
                    input.preventDefault();
                    void runLookup();
                  }
                }}
                placeholder="Search building, mall, MRT or address..."
                maxLength={120}
                className={fieldClass}
              />
              {lookingUp ? <p className="mt-2 text-sm text-mute">Searching places...</p> : null}
              {lookups.length ? (
                <div className="mt-2 space-y-2">
                  {lookups.map((hit) => (
                    <div key={`${hit.providerId || hit.label}-${hit.latitude}`} className="rounded-xl bg-ink px-3 py-3 ring-1 ring-line">
                      <p className="text-sm font-semibold text-cream">{hit.name || hit.label}</p>
                      {hit.address ? <p className="mt-1 text-sm text-mute">{hit.address}</p> : null}
                      {hit.kind ? <p className="mt-1 text-sm text-cream">{hit.kind}</p> : null}
                      <button type="button" onClick={() => pickManual(hit)} className="press mt-3 min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink">
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              {lookupMiss && !lookingUp ? (
                <div className="mt-3 rounded-xl bg-ink px-3 py-3 ring-1 ring-line">
                  <p className="text-sm text-cream">We couldn't find that place.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={clearManual} className="press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink">
                      Try another search
                    </button>
                    <button type="button" onClick={() => chooseOrigin("current")} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                      Use current location
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )
        ) : null}

        <p className="mt-4 text-sm font-medium text-cream">When?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {MEALS.map((item) => (
            <Chip key={item.id} on={meal === item.id} onClick={() => setMeal(item.id)}>
              {item.label}
            </Chip>
          ))}
        </div>

        <label className="mt-4 block text-sm font-medium text-cream" htmlFor="makan-pax">
          Group size
        </label>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            aria-label="Fewer people"
            disabled={groupSize <= 1}
            onClick={() => setGroup(groupSize - 1)}
            className="press grid size-12 shrink-0 place-items-center rounded-xl bg-panel text-lg font-semibold text-cream ring-1 ring-line disabled:opacity-40"
          >
            −
          </button>
          <div className="w-20">
            <input
              id="makan-pax"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              enterKeyHint="done"
              maxLength={2}
              value={groupDraft}
              onChange={(input) => onGroupDraft(input.target.value)}
              onBlur={() => setGroup(Number(groupDraft))}
              className={clsx(fieldClass, "text-center tabular-nums")}
            />
          </div>
          <button
            type="button"
            aria-label="More people"
            disabled={groupSize >= 40}
            onClick={() => setGroup(groupSize + 1)}
            className="press grid size-12 shrink-0 place-items-center rounded-xl bg-panel text-lg font-semibold text-cream ring-1 ring-line disabled:opacity-40"
          >
            +
          </button>
        </div>

        <p className="mt-4 text-sm font-medium text-cream">Budget</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BUDGETS.map((item) => (
            <Chip key={item.id} on={budget === item.id} onClick={() => setBudget(item.id)}>
              {item.label}
            </Chip>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-cream">Dietary</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DIETS.map((item) => (
            <Chip key={item.id || "none"} on={dietary === item.id} onClick={() => setDietary(item.id)}>
              {item.label}
            </Chip>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-cream">How far?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {WALKS.map((item) => (
            <Chip key={item.id} on={minutes === item.id} onClick={() => setMinutes(item.id)}>
              {item.label}
            </Chip>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-cream">What do you feel like?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={cuisines.length === 0} onClick={() => setCuisines([])}>
            Any
          </Chip>
          {CUISINE_OPTIONS.map((item) => (
            <Chip key={item.id} on={cuisines.includes(item.id)} onClick={() => toggleCuisine(item.id)}>
              {cuisines.includes(item.id) ? `${item.label} ✓` : item.label}
            </Chip>
          ))}
          <Chip on={moreCuisine || MORE_CUISINES.some((item) => cuisines.includes(item.id))} onClick={() => setMoreCuisine((open) => !open)}>
            More
          </Chip>
          {moreCuisine || MORE_CUISINES.some((item) => cuisines.includes(item.id))
            ? MORE_CUISINES.map((item) => (
                <Chip key={item.id} on={cuisines.includes(item.id)} onClick={() => toggleCuisine(item.id)}>
                  {cuisines.includes(item.id) ? `${item.label} ✓` : item.label}
                </Chip>
              ))
            : null}
        </div>

        <p className="mt-4 text-sm font-medium text-cream">What kind of place?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip on={placeTypes.length === 0} onClick={() => setPlaceTypes([])}>
            Any
          </Chip>
          {PLACE_TYPES.map((item) => (
            <Chip key={item.id} on={placeTypes.includes(item.id)} onClick={() => togglePlace(item.id)}>
              {placeTypes.includes(item.id) ? `${item.label} ✓` : item.label}
            </Chip>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-cream">Vibe</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {MOODS.filter((item) => item.id).map((item) => (
            <Chip key={item.id} on={mood === item.id} onClick={() => setMood(item.id)}>
              {item.label}
            </Chip>
          ))}
        </div>

        {error ? (
          <p role="alert" className="mt-4 text-sm text-vermilion">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="press mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-vermilion text-base font-semibold text-cream disabled:opacity-50"
        >
          {pending ? "Looking around…" : "Find makan"}
        </button>
        <button type="button" onClick={onSpin} className="press mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-panel text-sm font-semibold text-gold ring-1 ring-line">
          <Dices className="size-4" aria-hidden />
          {pick ? "Spin again" : "Makan roulette"}
        </button>
      </form>

      <aside className="lg:col-span-3">
        <section id="kairos-result" className="rounded-2xl bg-panel p-5 shadow-card sm:p-7">
          <p className="text-xs font-semibold tracking-brand text-gold">LOCATION + GROUP + APPETITE</p>
          <h2 className="mt-2 max-w-xl font-sans text-3xl font-semibold leading-tight text-cream sm:text-4xl">
            Find somewhere nearby that fits the group — before someone says “anything lah”.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Factor kicker="LOCATION FIT" tone="jade" value={walkLabel} note={resolvedFrom ? `Searching from: ${originWord} · ${resolvedFrom}` : "From the place you named."} />
            <Factor kicker="GROUP FIT" tone="cream" value={`${groupSize} pax`} note={dietLabel} />
            <Factor kicker="MEAL FIT" tone="gold" value={MEALS.find((item) => item.id === meal)?.label ?? "Lunch"} note={budgetCopy(budget)} />
          </div>

          {searchStatus === "ok" || searchStatus === "filters" || searchStatus === "distance" ? (
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-cream">
              <span className="rounded-full bg-ink px-3 py-1">{minutes < 25 ? `${minutes} min walk` : "Short ride"}</span>
              <span className="rounded-full bg-ink px-3 py-1">{cuisines.length ? cuisines.map(cuisineLabel).join(" + ") : "Any cuisine"}</span>
              <span className="rounded-full bg-ink px-3 py-1">{placeTypes.length ? placeTypes.map((item) => placeKindLabel(item)).join(" + ") : "Any place"}</span>
              <span className="rounded-full bg-ink px-3 py-1">{budget === 1 ? "≤$10/pax" : budget === 2 ? "$10–$20/pax" : "Any budget"}</span>
              <span className="rounded-full bg-ink px-3 py-1">{dietary ? dietLabel : "No dietary restriction"}</span>
              <button type="button" onClick={editFilters} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-gold">
                Edit filters
              </button>
            </div>
          ) : null}

          {cards.length === 0 ? (
            <div className="mt-8 rounded-xl bg-ink px-4 py-4">
              {resolvedFrom ? <p className="text-sm text-cream">Searching from: {originWord} · {resolvedFrom}</p> : null}
              {emptyStatus === "geocode" ? (
                <>
                  <p className="mt-3 text-sm text-cream">
                    {origin === "home"
                      ? "We couldn't locate your saved home."
                      : origin === "office"
                        ? "We couldn't locate your saved office."
                        : "We couldn't find that place."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {origin === "office" || origin === "home" ? (
                      <button type="button" onClick={() => chooseOrigin(origin)} className="press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink">
                        {origin === "home" ? "Update home" : "Update office location"}
                      </button>
                    ) : (
                      <>
                        <button type="button" onClick={() => { clearManual(); chooseOrigin("choose"); }} className="press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink">
                          Try another search
                        </button>
                        <button type="button" onClick={() => chooseOrigin("current")} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                          Use current location
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : emptyStatus === "routes" ? (
                <>
                  <p className="mt-3 text-sm text-cream">Walking routes are temporarily unavailable.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => void onFind()} className="press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink">
                      Try again
                    </button>
                    <button type="button" onClick={() => chooseOrigin("choose")} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                      Choose another location
                    </button>
                    <button type="button" onClick={() => void onFind({ allowDistance: true })} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                      Show nearby by distance instead
                    </button>
                  </div>
                </>
              ) : emptyStatus === "walk" ? (
                <>
                  <p className="mt-3 text-sm text-cream">No suitable places found within a {minutes}-minute walk.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {minutes < 15 ? (
                      <button
                        type="button"
                        onClick={() => void onFind({ minutes: minutes === 5 ? 10 : 15 })}
                        className="press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink"
                      >
                        Expand to {minutes === 5 ? 10 : 15} min
                      </button>
                    ) : null}
                    <button type="button" onClick={() => chooseOrigin("choose")} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                      Choose another location
                    </button>
                  </div>
                </>
              ) : emptyStatus === "filters" ? (
                <>
                  <p className="mt-3 text-sm text-cream">No places matched all your filters.</p>
                  <ul className="mt-2 space-y-1 text-sm text-mute">
                    <li>≤{minutes} min walk</li>
                    {cuisines.length ? <li>{cuisines.map(cuisineLabel).join(" + ")}</li> : null}
                    {placeTypes.length ? <li>{placeTypes.map((item) => placeKindLabel(item)).join(" + ")}</li> : null}
                    {budget === 1 ? <li>≤$10/pax</li> : budget === 2 ? <li>$10–$20/pax</li> : null}
                    {dietary ? <li>{dietLabel}</li> : null}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {minutes < 15 ? (
                      <button
                        type="button"
                        onClick={() => void onFind({ minutes: minutes === 5 ? 10 : 15 })}
                        className="press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink"
                      >
                        Expand to {minutes === 5 ? 10 : 15} min
                      </button>
                    ) : null}
                    {cuisines.length ? (
                      <button type="button" onClick={() => void onFind({ cuisines: [] })} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                        Clear cuisine
                      </button>
                    ) : null}
                    {placeTypes.length ? (
                      <button type="button" onClick={() => void onFind({ placeTypes: [] })} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                        Clear place type
                      </button>
                    ) : null}
                    {budget !== 0 ? (
                      <button type="button" onClick={() => void onFind({ budget: 0 })} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                        Increase budget
                      </button>
                    ) : null}
                    {dietary ? (
                      <button type="button" onClick={() => void onFind({ dietary: "" })} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                        Clear dietary
                      </button>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold tracking-brand text-cream">PREPARING THE SEARCH</p>
                  <ul className="mt-3 space-y-1 text-sm text-cream">
                    <li>Searching from: {fromLabel}</li>
                    <li>
                      {MEALS.find((item) => item.id === meal)?.label} window: {mealWindow(meal)}
                    </li>
                    <li>
                      {groupSize} people · {walkLabel} · {budgetCopy(budget)}
                      {dietary ? ` · ${dietLabel}` : ""}
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-mute">{note || "Real places only. Kairos will not invent a restaurant."}</p>
                </>
              )}
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              <KairosVoice
                mode="makan"
                text={`${groupSize} people, ${walkLabel.replace(" walk", "")}, ${budgetCopy(budget).toLowerCase()}. I've narrowed the argument down.`}
              />
              {pick ? (
                <p className="text-sm text-gold">Enough discussion. The universe has chosen.</p>
              ) : (
                <>
                  <p className="text-xs font-semibold tracking-brand text-cream">
                    {cards.length === 1 ? "1 match found in Kairos's current place sources." : `${cards.length} matches found in Kairos's current place sources.`}
                  </p>
                  <p className="text-sm text-mute">Not every food place nearby is in these sources.</p>
                  <p className="text-sm text-mute">
                    {sortMode === "closest"
                      ? "Closest verified walks"
                      : sortMode === "random"
                        ? "One place from the filtered shortlist"
                        : sortMode === "favourites"
                          ? "Saved places that still fit"
                          : "Best match for this group"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["closest", "Closest"],
                        ["match", "Best match"],
                        ["random", "Random"],
                        ["favourites", "Favourites"],
                      ] as const
                    ).map(([id, label]) => (
                      <Chip
                        key={id}
                        on={sortMode === id}
                        onClick={() => {
                          if (id === "random") setRandomSeed((seed) => seed + 1);
                          setSortMode(id);
                        }}
                      >
                        {label}
                      </Chip>
                    ))}
                  </div>
                </>
              )}
              {visible.length === 0 ? <p className="text-sm text-cream">No saved favourites fit these filters.</p> : null}
              {visible.map((hit, index) => {
                const kind = placeKindLabel(hit.placeKind);
                const taste = (hit.cuisines ?? []).slice(0, 2).map(cuisineLabel).join(" · ");
                const meta = [taste, kind].filter(Boolean).join(" · ");
                const saved = favs.some((fav) => favKey(fav) === favKey(hit));
                const knownPrice = hit.approxSgd != null || hit.price > 0 ? priceLabel(hit.price, hit.approxSgd) : "";
                return (
                <article key={hit.id} className="rounded-xl bg-ink px-4 py-4">
                  {pick ? <p className="text-xs font-semibold tracking-brand text-gold">KAIROS PICK</p> : null}
                  <h3 className="font-display text-2xl text-cream">{pick ? hit.name : `${index + 1} · ${hit.name}`}</h3>
                  <p className="mt-2 text-sm text-cream">
                    {searchStatus === "distance" || !hit.verified ? `${hit.meters} m straight line` : `${hit.minutes} min walk`}
                  </p>
                  {meta ? <p className="mt-1 text-sm text-cream">{meta}</p> : null}
                  {knownPrice ? <p className="mt-1 text-sm text-cream">{knownPrice}</p> : null}
                  {hit.openingHours ? <p className="mt-1 text-sm text-mute">Hours: {hit.openingHours}</p> : null}
                  <p className="mt-2 text-sm text-mute">
                    Why Kairos picked it: {pick ? hit.why : resultBlurb(hit, matchContext, { favourite: saved, rank: index, mode: sortMode })}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pick ? (
                      <a href={hit.mapsUrl} target="_blank" rel="noreferrer" className="press inline-flex min-h-11 items-center rounded-xl bg-gold px-3 text-sm font-semibold text-ink">
                        Go here
                      </a>
                    ) : (
                      <>
                        <button type="button" onClick={() => setChosenId(hit.id)} className="press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink">
                          View
                        </button>
                        <a href={hit.mapsUrl} target="_blank" rel="noreferrer" className="press inline-flex min-h-11 items-center rounded-xl bg-ink px-3 text-sm font-semibold text-cream ring-1 ring-line">
                          Directions
                        </a>
                        <button type="button" onClick={() => toggleFav(hit)} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                          {saved ? "★ Saved" : "★ Save"}
                        </button>
                      </>
                    )}
                  </div>
                  <ExternalActions
                    input={{
                      mode: "makan",
                      kind: "restaurant",
                      countryCode: "SG",
                      navMode: "walk",
                      from: geo?.latitude != null && geo.longitude != null ? { lat: geo.latitude, lng: geo.longitude, name: geo.label || "Start" } : undefined,
                      place: { id: hit.id, name: hit.name, address: hit.address, city: hit.area || "Singapore", countryCode: "SG", lat: hit.lat, lng: hit.lng },
                    }}
                  />
                  {pick || chosen?.id === hit.id ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => saveIcs(hit)} className="press min-h-11 rounded-xl bg-panel px-3 text-sm font-semibold text-cream ring-1 ring-line">
                        Add to calendar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const move = hit.verified ? `${hit.minutes} min walk` : `${hit.meters} m straight line`;
                          const blurb = [hit.name, move, meta, knownPrice, hit.openingHours ? `Hours: ${hit.openingHours}` : "", hit.address, hit.mapsUrl]
                            .filter(Boolean)
                            .join("\n");
                          void navigator.clipboard.writeText(blurb).then(
                            () => toast.success("Shared text copied"),
                            () => toast.message("Copy did not land. The name is on screen."),
                          );
                        }}
                        className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream"
                      >
                        Share with group
                      </button>
                    </div>
                  ) : null}
                </article>
                );
              })}
              {!pick && sortMode !== "random" && sorted.length > 8 && !showMore ? (
                <button type="button" onClick={() => setShowMore(true)} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-gold">
                  Show more
                </button>
              ) : null}
              {forcedFavs.length ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-brand text-gold">USING ANYWAY</p>
                  {forcedFavs.map((fav) => (
                    <article key={fav.id} className="rounded-xl bg-ink px-4 py-4">
                      <h3 className="font-display text-2xl text-cream">{fav.name}</h3>
                      <p className="mt-2 text-sm text-mute">Outside the current filters. Not rechecked as a verified walk for this search.</p>
                      <a href={fav.mapsUrl} target="_blank" rel="noreferrer" className="press mt-3 inline-flex min-h-11 items-center rounded-xl bg-ink px-3 text-sm font-semibold text-cream ring-1 ring-line">
                        Directions
                      </a>
                    </article>
                  ))}
                </div>
              ) : null}
              {outsideFavs.length ? (
                <div className="rounded-xl bg-ink px-4 py-4">
                  <p className="text-sm text-cream">Favourite, but outside your current filters</p>
                  <div className="mt-3 space-y-3">
                    {outsideFavs.map((fav) => (
                      <div key={fav.id} className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-cream">{fav.name}</p>
                          {fav.verified && fav.minutes ? <p className="text-sm text-mute">{fav.minutes} min walk</p> : null}
                          <p className="text-sm text-mute">Current limit: {minutes < 25 ? `${minutes} min walk` : "short ride"}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setForcedIds((current) => (current.includes(favKey(fav)) ? current : [...current, favKey(fav)]))}
                          className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line"
                        >
                          Use anyway
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {pick ? (
                <button type="button" onClick={onSpin} className="press inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold">
                  <Dices className="size-4" aria-hidden />
                  Spin again
                </button>
              ) : null}
              {note ? <p className="text-xs text-mute">{note}</p> : null}
            </div>
          )}
        </section>
      </aside>
    </>
  );
}

function Factor({ kicker, value, note, tone }: { kicker: string; value: string; note: string; tone: "jade" | "cream" | "gold" }) {
  return (
    <div className={clsx("border-l-2 pl-3", tone === "jade" ? "border-jade" : tone === "gold" ? "border-gold" : "border-cream")}>
      <p className={clsx("text-xs font-semibold tracking-brand", tone === "jade" ? "text-jade" : tone === "gold" ? "text-gold" : "text-cream")}>{kicker}</p>
      <p className="mt-1 text-lg font-semibold text-cream">{value}</p>
      <p className="text-sm text-mute">{note}</p>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
  disabled = false,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "press min-h-11 rounded-xl px-3 text-sm font-semibold disabled:opacity-50",
        on ? "bg-jade text-ink" : "bg-panel text-cream ring-1 ring-line",
      )}
    >
      {children}
    </button>
  );
}

function mealStart(event: EventView | null, timing: "" | "before" | "after"): Date {
  const slot = event?.slots[0];
  if (slot && event) {
    const start = new Date(slot.startsAt);
    const shift = timing === "before" ? -75 : event.durationMin + 15;
    return new Date(start.getTime() + shift * 60000);
  }
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 4, 30));
}
