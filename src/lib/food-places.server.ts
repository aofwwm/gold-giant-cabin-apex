import "@tanstack/react-start/server-only";
import { annotatePlace, distanceMeters, mapsLink, walkMinutes, type Hit, type PlaceKind } from "@/lib/coord";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

type FoodRow = {
  id: string;
  provider: string;
  provider_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  place_type: string;
  cuisine_tags: string[] | null;
  mall_name: string;
  unit_number: string;
  source: string;
};

function rowToHit(row: FoodRow, origin: { lat: number; lng: number; label: string }): Hit | null {
  if (!row.name || !Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) return null;
  const meters = distanceMeters(origin.lat, origin.lng, row.latitude, row.longitude);
  const kind = row.place_type as PlaceKind | "other" | "";
  const hit = annotatePlace(
    {
      id: row.id || `${row.provider}-${row.provider_id}`,
      name: row.name.slice(0, 80),
      cuisine: "",
      address: (row.address || origin.label).slice(0, 120),
      area: row.mall_name || origin.label,
      lat: row.latitude,
      lng: row.longitude,
      minutes: walkMinutes(meters),
      meters: Math.round(meters),
      price: 0,
      approxSgd: null,
      dietary: [],
      why: "",
      source: "map",
      mapsUrl: mapsLink(row.name, row.address || origin.label),
      placeKind: kind === "restaurant" || kind === "cafe" || kind === "hawker" || kind === "kopitiam" || kind === "bakery" || kind === "other" ? kind : undefined,
    },
    { cuisineText: (row.cuisine_tags ?? []).join(" "), amenity: row.place_type },
  );
  return hit;
}

export async function readCachedFood(origin: { lat: number; lng: number; label: string }, radius: number): Promise<Hit[]> {
  try {
    if (!supabaseConfigured()) return [];
    const dLat = radius / 111320;
    const dLng = radius / (111320 * Math.cos((origin.lat * Math.PI) / 180));
    const { data, error } = await getSupabase()
      .from("food_places")
      .select("id, provider, provider_id, name, address, latitude, longitude, place_type, cuisine_tags, mall_name, unit_number, source")
      .gte("latitude", origin.lat - dLat)
      .lte("latitude", origin.lat + dLat)
      .gte("longitude", origin.lng - dLng)
      .lte("longitude", origin.lng + dLng)
      .limit(200);
    if (error || !data) return [];
    const hits: Hit[] = [];
    for (const row of data as FoodRow[]) {
      const hit = rowToHit(row, origin);
      if (!hit || hit.meters > radius + 40) continue;
      hits.push(hit);
    }
    return hits;
  } catch {
    return [];
  }
}

export async function rememberFoodPlaces(hits: Hit[], mallName = ""): Promise<number> {
  try {
    if (!supabaseConfigured() || !hits.length) return 0;
    const rows = hits.slice(0, 80).map((hit) => {
      const providerId = hit.id.replace(/^osm-/, "");
      return {
        id: hit.id.slice(0, 120),
        provider: hit.id.startsWith("osm-") ? "osm" : "kairos",
        provider_id: providerId.slice(0, 80),
        name: hit.name.slice(0, 80),
        address: hit.address.slice(0, 160),
        latitude: hit.lat,
        longitude: hit.lng,
        place_type: hit.placeKind && hit.placeKind !== "other" ? hit.placeKind : "",
        cuisine_tags: hit.cuisines ?? [],
        mall_name: hit.meters < 250 ? mallName.slice(0, 80) : "",
        unit_number: "",
        source: "osm",
        verified_at: new Date().toISOString(),
      };
    });
    const { error } = await getSupabase().from("food_places").upsert(rows, { onConflict: "id" });
    return error ? 0 : rows.length;
  } catch {
    return 0;
  }
}

