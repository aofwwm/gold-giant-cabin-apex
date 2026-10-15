import { isPermittedPhotoUrl, type PhotoQuery, type PlacePhoto } from "@/lib/travel-photo";

export type PhotoStatus = "UNRESOLVED" | "LOADING" | "READY" | "UNAVAILABLE" | "ERROR";

export type PhotoRecord = {
  key: string;
  status: PhotoStatus;
  photo: PlacePhoto | null;
};

export type PrefetchTarget = {
  id: string;
  name: string;
  localName?: string;
  wikidataId?: string;
  provider?: string;
  providerId?: string;
  fileTitle?: string;
  imagePage?: string;
  commonsCategory?: string;
  wikipedia?: string;
  category?: string;
  image?: string;
  photo?: PlacePhoto | null;
  day?: number | null;
  rank?: number;
};

export type PhotoResolver = (target: PrefetchTarget, query: PhotoQuery) => Promise<PlacePhoto | null>;

type Task = {
  key: string;
  priority: number;
  seq: number;
  target: PrefetchTarget;
  failedUrl: string;
  rejectFileTitles: string[];
  resolve: PhotoResolver;
  finish: (record: PhotoRecord) => void;
};

const STORAGE_KEY = "kairos-place-photos";
const EMPTY_PHOTO: PlacePhoto = {
  source: "commons_search",
  fileTitle: "",
  thumbnailUrl: "",
  originalUrl: "",
  descriptionUrl: "",
  width: 0,
  height: 0,
  mime: "",
  creator: "",
  license: "",
  licenseUrl: "",
  attributionRequired: false,
};

function qidOf(value: string | undefined): string {
  return value && /^Q\d+$/.test(value) ? value : "";
}

export function photoCacheKey(target: { id?: string; wikidataId?: string }): string {
  const id = target.id?.trim() || "";
  if (id) return `place:${id}`;
  const qid = qidOf(target.wikidataId);
  return qid ? `wd:${qid}` : "";
}

export function photoQuery(target: PrefetchTarget, extra?: { failedUrl?: string; rejectFileTitles?: string[] }): PhotoQuery {
  return {
    name: target.name,
    localName: target.localName || "",
    wikidataId: qidOf(target.wikidataId),
    fileTitle: target.fileTitle || target.photo?.fileTitle || "",
    imagePage: target.imagePage || "",
    osmFile: "",
    commonsCategory: target.commonsCategory || "",
    wikipedia: target.wikipedia || "",
    failedUrl: extra?.failedUrl || "",
    rejectFileTitles: extra?.rejectFileTitles || [],
    commercial: false,
  };
}

function knownPhoto(target: PrefetchTarget): PlacePhoto | null {
  if (target.photo?.thumbnailUrl && isPermittedPhotoUrl(target.photo.thumbnailUrl)) return target.photo;
  if (target.image && isPermittedPhotoUrl(target.image)) {
    return {
      ...EMPTY_PHOTO,
      source: target.photo?.source || "wikidata_image",
      fileTitle: target.fileTitle || target.photo?.fileTitle || "",
      thumbnailUrl: target.image,
      originalUrl: target.photo?.originalUrl || target.image,
      descriptionUrl: target.imagePage || target.photo?.descriptionUrl || "",
      license: target.photo?.license || "",
      licenseUrl: target.photo?.licenseUrl || "",
      creator: target.photo?.creator || "",
      attributionRequired: target.photo?.attributionRequired || false,
      retrievedAt: target.photo?.retrievedAt,
    };
  }
  return null;
}

function statusWord(status: PhotoStatus): "MISS" | "PENDING" | "READY" | "FAILED" {
  if (status === "LOADING") return "PENDING";
  if (status === "READY") return "READY";
  if (status === "UNAVAILABLE" || status === "ERROR") return "FAILED";
  return "MISS";
}

function photoLog(target: PrefetchTarget, record: PhotoRecord, phase: string): void {
  const dev = (import.meta as { env?: { DEV?: boolean } }).env?.DEV;
  if (!dev) return;
  console.info(
    [
      `[PHOTO DEBUG] ${phase}`,
      `place: ${target.name}`,
      `scheduledPlaceId: ${target.id}`,
      `canonicalPlaceId: ${target.id}`,
      `provider: ${target.provider || "-"}`,
      `wikidataId: ${qidOf(target.wikidataId) || "-"}`,
      `photoCacheKey: ${record.key}`,
      `photoCacheStatus: ${statusWord(record.status)}`,
      `photoUrl: ${record.photo?.thumbnailUrl || "-"}`,
      `photoResolutionStarted: ${record.status === "UNRESOLVED" ? "NO" : "YES"}`,
      `itineraryCardPhoto: ${record.photo?.thumbnailUrl || target.image || "-"}`,
    ].join("\n"),
  );
}

export function createPhotoStore() {
  const records = new Map<string, PhotoRecord>();
  const placeholders = new Map<string, PhotoRecord>();
  const alias = new Map<string, string>();
  const listeners = new Set<() => void>();
  const inflight = new Map<string, Promise<PhotoRecord>>();
  const pending: Task[] = [];
  let active = 0;
  let limit = 3;
  let seq = 0;
  let hydrated = false;

  function notify(): void {
    for (const listener of listeners) listener();
  }

  function placeholder(key: string): PhotoRecord {
    const found = placeholders.get(key);
    if (found) return found;
    const next = { key, status: "UNRESOLVED" as const, photo: null };
    placeholders.set(key, next);
    return next;
  }

  function canonical(key: string): string {
    return alias.get(key) ?? key;
  }

  function read(key: string): PhotoRecord {
    const id = canonical(key);
    return records.get(id) ?? placeholder(id);
  }

  function write(key: string, record: PhotoRecord): void {
    records.set(key, record);
    placeholders.delete(key);
    notify();
  }

  function link(target: PrefetchTarget, key: string): void {
    const qid = qidOf(target.wikidataId);
    if (qid) alias.set(`wd:${qid}`, key);
    if (target.providerId) alias.set(`provider:${target.providerId}`, key);
  }

  function persist(): void {
    if (typeof localStorage === "undefined") return;
    const rows: { key: string; photo: PlacePhoto; at: number }[] = [];
    for (const [key, record] of records) {
      if (record.status !== "READY" || !record.photo || !isPermittedPhotoUrl(record.photo.thumbnailUrl)) continue;
      rows.push({ key, photo: record.photo, at: Date.now() });
    }
    const kept = rows.slice(-80);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, rows: kept }));
    } catch {
      /* Quota or private mode. The in-memory cache still serves this trip. */
    }
  }

  function hydrate(raw?: string | null): void {
    if (hydrated && raw === undefined) return;
    hydrated = true;
    const text = raw !== undefined ? raw : typeof localStorage === "undefined" ? null : localStorage.getItem(STORAGE_KEY);
    if (!text) return;
    try {
      const parsed = JSON.parse(text) as { rows?: { key: string; photo: PlacePhoto }[] };
      for (const row of parsed.rows ?? []) {
        if (!row?.key || !row.photo || !isPermittedPhotoUrl(row.photo.thumbnailUrl)) continue;
        if (records.has(row.key)) continue;
        records.set(row.key, { key: row.key, status: "READY", photo: row.photo });
      }
      notify();
    } catch {
      /* Ignore a damaged photo cache. */
    }
  }

  function serialize(): string {
    const rows: { key: string; photo: PlacePhoto }[] = [];
    for (const [key, record] of records) {
      if (record.status === "READY" && record.photo) rows.push({ key, photo: record.photo });
    }
    return JSON.stringify({ v: 1, rows });
  }

  function pump(): void {
    pending.sort((a, b) => a.priority - b.priority || a.seq - b.seq);
    while (active < limit && pending.length) {
      const task = pending.shift();
      if (!task) break;
      active += 1;
      void run(task).finally(() => {
        active -= 1;
        inflight.delete(task.key);
        pump();
      });
    }
  }

  async function run(task: Task): Promise<void> {
    const ready = knownPhoto(task.target);
    if (ready && !task.failedUrl) {
      const record = { key: task.key, status: "READY" as const, photo: ready };
      write(task.key, record);
      photoLog(task.target, record, "cached");
      persist();
      task.finish(record);
      return;
    }
    const loading = { key: task.key, status: "LOADING" as const, photo: null };
    write(task.key, loading);
    photoLog(task.target, loading, "resolve");
    let attempts = 0;
    while (attempts < 2) {
      attempts += 1;
      try {
        const photo = await task.resolve(task.target, photoQuery(task.target, { failedUrl: task.failedUrl, rejectFileTitles: task.rejectFileTitles }));
        if (photo?.thumbnailUrl && isPermittedPhotoUrl(photo.thumbnailUrl)) {
          const record = { key: task.key, status: "READY" as const, photo };
          write(task.key, record);
          photoLog(task.target, record, "ready");
          persist();
          task.finish(record);
          return;
        }
        const record = { key: task.key, status: "UNAVAILABLE" as const, photo: null };
        write(task.key, record);
        photoLog(task.target, record, "unavailable");
        task.finish(record);
        return;
      } catch {
        if (attempts >= 2) break;
      }
    }
    const record = { key: task.key, status: "ERROR" as const, photo: null };
    write(task.key, record);
    photoLog(task.target, record, "error");
    task.finish(record);
  }

  function enqueue(target: PrefetchTarget, priority: number, resolve: PhotoResolver, extra?: { failedUrl?: string; rejectFileTitles?: string[] }): Promise<PhotoRecord> {
    const key = photoCacheKey(target);
    if (!key) return Promise.resolve(placeholder(""));
    link(target, key);
    const retry = Boolean(extra?.failedUrl);
    const current = records.get(key);
    const readyNow = !retry && knownPhoto(target);
    if (readyNow) {
      const record = { key, status: "READY" as const, photo: readyNow };
      write(key, record);
      persist();
      return Promise.resolve(record);
    }
    if (!retry && current && (current.status === "READY" || current.status === "UNAVAILABLE" || current.status === "ERROR")) {
      return Promise.resolve(current);
    }
    const existing = inflight.get(key);
    if (existing && !retry) return existing;
    if (retry) {
      const index = pending.findIndex((task) => task.key === key);
      if (index >= 0) pending.splice(index, 1);
    }
    const promise = new Promise<PhotoRecord>((finish) => {
      pending.push({
        key,
        priority,
        seq: ++seq,
        target,
        failedUrl: extra?.failedUrl || "",
        rejectFileTitles: extra?.rejectFileTitles || [],
        resolve,
        finish,
      });
    });
    inflight.set(key, promise);
    write(key, { key, status: "LOADING", photo: null });
    return promise;
  }

  function prefetch(targets: PrefetchTarget[], options: { priorityIds?: string[]; resolve: PhotoResolver; concurrency?: number }): Promise<PhotoRecord[]> {
    hydrate();
    if (options.concurrency) limit = Math.max(1, Math.min(4, options.concurrency));
    const priority = new Set(options.priorityIds ?? []);
    const unique: PrefetchTarget[] = [];
    const seen = new Set<string>();
    for (const target of targets) {
      const key = photoCacheKey(target);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(target);
    }
    const jobs = unique.map((target) => {
      const lead = priority.has(target.id);
      const rank = lead ? 0 : typeof target.rank === "number" ? target.rank : target.day == null ? 80 : 10 + Math.max(0, target.day);
      return enqueue(target, rank, options.resolve);
    });
    pump();
    return Promise.all(jobs);
  }

  function retry(target: PrefetchTarget, failedUrl: string, resolve: PhotoResolver): Promise<PhotoRecord> {
    const titles = [target.fileTitle, target.photo?.fileTitle].filter((value): value is string => Boolean(value));
    const job = enqueue(target, 0, resolve, { failedUrl, rejectFileTitles: titles });
    pump();
    return job;
  }

  return {
    read,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    prefetch,
    enqueue,
    retry,
    hydrate,
    serialize,
    reset() {
      records.clear();
      placeholders.clear();
      alias.clear();
      inflight.clear();
      pending.splice(0, pending.length);
      active = 0;
      seq = 0;
      hydrated = false;
      notify();
    },
  };
}

export const placePhotos = createPhotoStore();
