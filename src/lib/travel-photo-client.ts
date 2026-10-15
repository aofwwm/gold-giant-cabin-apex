import type { TripStop } from "@/lib/travel-model";
import type { PlacePhoto } from "@/lib/travel-photo";
import { refreshPlacePhoto } from "@/lib/travel.functions";
import { photoCacheKey, placePhotos, type PhotoResolver, type PrefetchTarget } from "@/lib/travel-photo-prefetch";

export { photoCacheKey, placePhotos };

function targetFromStop(stop: TripStop): PrefetchTarget {
  return {
    id: stop.id,
    name: stop.displayName || stop.nameEnglish || stop.name,
    localName: stop.nameLocal || stop.localName || "",
    wikidataId: stop.wikidataId,
    provider: stop.provider,
    providerId: stop.providerId,
    fileTitle: stop.photo?.fileTitle || stop.commonsFile || "",
    imagePage: stop.imagePage,
    commonsCategory: stop.commonsCategory,
    wikipedia: stop.wikipedia,
    category: stop.category,
    image: stop.image,
    photo: stop.photo,
    day: stop.day,
  };
}

const resolveStop: PhotoResolver = (target, query) => refreshPlacePhoto({
  data: {
    name: query.name,
    localName: query.localName || "",
    wikidataId: query.wikidataId || "",
    fileTitle: query.fileTitle || "",
    imagePage: query.imagePage || "",
    osmFile: query.osmFile || "",
    commonsCategory: query.commonsCategory || "",
    wikipedia: query.wikipedia || "",
    failedUrl: query.failedUrl || "",
    rejectFileTitles: query.rejectFileTitles || [],
    category: target.category || "",
  },
});

export function prefetchScheduledPhotos(stops: TripStop[], priorityIds: string[] = []): Promise<void> {
  const lead = new Set(priorityIds);
  const targets = stops
    .filter((stop) => stop.category !== "stay" && stop.provider !== "area")
    .map((stop) => ({
      ...targetFromStop(stop),
      rank: lead.has(stop.id) ? 0 : stop.day == null ? 80 : 10 + stop.day,
    }));
  return placePhotos.prefetch(targets, { priorityIds, resolve: resolveStop, concurrency: 3 }).then(() => undefined);
}

export function ensureStopPhoto(stop: TripStop): void {
  if (stop.provider === "area") return;
  const lead = stop.day === 0 ? [stop.id] : [];
  void placePhotos.prefetch([targetFromStop(stop)], { priorityIds: lead, resolve: resolveStop, concurrency: 3 });
}

export function retryStopPhoto(stop: TripStop, failedUrl: string): Promise<PlacePhoto | null> {
  return placePhotos.retry(targetFromStop(stop), failedUrl, resolveStop).then((record) => record.photo);
}

export function logStopPhoto(phase: string, stop: TripStop): void {
  const dev = (import.meta as { env?: { DEV?: boolean } }).env?.DEV;
  if (!dev) return;
  const key = photoCacheKey(stop);
  const record = placePhotos.read(key);
  const started = record.status === "UNRESOLVED" ? "NO" : "YES";
  const status = record.status === "LOADING" ? "PENDING" : record.status === "READY" ? "READY" : record.status === "UNRESOLVED" ? "MISS" : "FAILED";
  console.info(
    [
      `[PHOTO DEBUG] ${phase}`,
      `place: ${stop.displayName || stop.name}`,
      `scheduledPlaceId: ${stop.id}`,
      `canonicalPlaceId: ${stop.id}`,
      `provider: ${stop.provider}`,
      `wikidataId: ${stop.wikidataId || "-"}`,
      `photoCacheKey: ${key}`,
      `photoCacheStatus: ${status}`,
      `photoUrl: ${record.photo?.thumbnailUrl || "-"}`,
      `photoResolutionStarted: ${started}`,
      `itineraryCardPhoto: ${record.photo?.thumbnailUrl || stop.image || "-"}`,
    ].join("\n"),
  );
}
