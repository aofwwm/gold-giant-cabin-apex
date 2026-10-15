import { RequestGate, shareRequest, TtlCache } from "@/lib/travel-cache";
import { noteCall, noteFailure } from "@/lib/provider-usage";
import type { DiscoveredPlace } from "@/lib/travel-model";
import {
  commonsCategoryTitle,
  commonsFileTitle,
  fileKey,
  isCommercialCategory,
  isPermittedPhotoUrl,
  parseWikipedia,
  photoFromImageInfo,
  scoreCommonsFile,
  searchPhotoOk,
  stableMediaUrl,
  type PhotoQuery,
  type PhotoSource,
  type PlacePhoto,
} from "@/lib/travel-photo";
import { enrichCommercialPlace, referencedStreetPhoto } from "@/lib/travel-commerce.server";

const photoCache = new TtlCache<PlacePhoto>(14 * 24 * 60 * 60 * 1000, 500, "photo");
const placePhotoCache = new TtlCache<PlacePhoto>(6 * 60 * 60 * 1000, 400, "photo");
const missCache = new TtlCache<true>(60 * 60 * 1000, 500, "photo");
const hintCache = new TtlCache<WikidataHints>(7 * 24 * 60 * 60 * 1000, 300, "photo");
const commonsGate = new RequestGate(12, 5_000);
const UA = "Kairos/1.0 (travel photos; contact: local)";
const THUMB = "960";

const urlToFile = new Map<string, string>();

type WikidataHints = { files: string[]; category: string; wikipedia: string };

type CommonsPage = {
  title?: string;
  missing?: boolean;
  imageinfo?: {
    thumburl?: string;
    thumbwidth?: number;
    thumbheight?: number;
    url?: string;
    descriptionurl?: string;
    mime?: string;
    width?: number;
    height?: number;
    extmetadata?: Record<string, { value?: string } | undefined>;
  }[];
};

const SEE = new Set(["attraction", "museum", "park", "garden", "viewpoint", "landmark", "historic", "theme_park", "zoo", "aquarium", "shopping", "beach", "family"]);

function logPhoto(place: string, qid: string, candidates: number, photo: PlacePhoto | null, reason: string): void {
  console.info(`[PLACE PHOTO] Place: ${place} Wikidata: ${qid || "-"} Candidates: ${candidates} Selected file: ${photo?.fileTitle || "-"} Thumbnail: ${photo?.thumbnailUrl || "-"} License: ${photo?.license || "-"} Render: ${photo ? "PASS" : "FAIL"} Failure reason: ${photo ? "-" : reason}`);
}

async function wikiGet(endpoint: string, params: Record<string, string>): Promise<unknown | null> {
  const url = new URL(endpoint);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  let wait = 400;
  let network = 0;
  let spins = 0;
  while (network < 3 && spins < 8) {
    spins += 1;
    if (!commonsGate.allow()) {
      await new Promise((resolve) => setTimeout(resolve, wait));
      wait = Math.min(wait * 2, 2000);
      continue;
    }
    network += 1;
    try {
      noteCall("photo", "wikimedia");
      const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA }, signal: AbortSignal.timeout(12000) });
      const text = await res.text();
      const retryable = res.status === 429 || res.status === 502 || res.status === 503 || !text.trim().startsWith("{");
      if (retryable && network < 3) {
        await new Promise((resolve) => setTimeout(resolve, wait));
        wait = Math.min(wait * 2, 2000);
        continue;
      }
      if (!res.ok || !text.trim().startsWith("{")) {
        noteFailure("photo", "wikimedia", `HTTP ${res.status}`);
        return null;
      }
      return JSON.parse(text) as unknown;
    } catch {
      if (network >= 3) break;
      await new Promise((resolve) => setTimeout(resolve, wait));
      wait = Math.min(wait * 2, 2000);
    }
  }
  noteFailure("photo", "wikimedia", "Wikimedia did not answer.");
  return null;
}

export function forgetPhotoUrl(url: string): void {
  const key = urlToFile.get(stableMediaUrl(url)) || urlToFile.get(url);
  if (!key) return;
  photoCache.delete(key);
  urlToFile.delete(stableMediaUrl(url));
}

function remember(photo: PlacePhoto): PlacePhoto {
  const key = fileKey(photo.fileTitle);
  photoCache.set(key, photo);
  missCache.delete(key);
  urlToFile.set(photo.thumbnailUrl, key);
  return photo;
}

function cachedPhoto(title: string): PlacePhoto | null {
  return photoCache.get(fileKey(title)) ?? null;
}

async function imageInfoBatch(titles: string[], source: PhotoSource): Promise<Map<string, PlacePhoto>> {
  const found = new Map<string, PlacePhoto>();
  const pending: string[] = [];
  for (const title of titles) {
    const normalized = commonsFileTitle(title);
    if (!normalized) continue;
    const key = fileKey(normalized);
    if (found.has(key) || pending.some((item) => fileKey(item) === key)) continue;
    const cached = cachedPhoto(normalized);
    if (cached) {
      found.set(key, cached.source === source ? cached : { ...cached, source });
      continue;
    }
    if (missCache.get(key)) continue;
    pending.push(normalized);
  }
  for (let index = 0; index < pending.length; index += 20) {
    const chunk = pending.slice(index, index + 20);
    const body = await wikiGet("https://commons.wikimedia.org/w/api.php", {
      action: "query",
      format: "json",
      formatversion: "2",
      redirects: "1",
      prop: "imageinfo",
      iiprop: "url|size|mime|extmetadata",
      iiurlwidth: THUMB,
      titles: chunk.join("|"),
    }) as { query?: { redirects?: { from?: string; to?: string }[]; normalized?: { from?: string; to?: string }[]; pages?: CommonsPage[] } } | null;
    if (!body?.query) continue;
    const pages = body.query.pages ?? [];
    for (const page of pages) {
      const photo = photoFromImageInfo(source, page);
      if (photo) {
        remember(photo);
        found.set(fileKey(photo.fileTitle), photo);
      } else if (page.missing && page.title) missCache.set(fileKey(page.title), true);
    }
    for (const redirect of [...(body.query.redirects ?? []), ...(body.query.normalized ?? [])]) {
      if (!redirect.from || !redirect.to) continue;
      const photo = found.get(fileKey(redirect.to));
      if (photo) found.set(fileKey(redirect.from), photo);
    }
    for (const title of chunk) {
      const key = fileKey(title);
      if (!found.has(key)) {
        const page = pages.find((row) => row.title && fileKey(row.title) === key);
        if (page?.missing) missCache.set(key, true);
      }
    }
  }
  return found;
}

async function imageInfoOne(title: string, source: PhotoSource): Promise<PlacePhoto | null> {
  const map = await imageInfoBatch([title], source);
  const normalized = commonsFileTitle(title);
  return normalized ? map.get(fileKey(normalized)) ?? null : null;
}

async function wikidataPhotoHints(qid: string): Promise<WikidataHints> {
  const cached = hintCache.get(qid);
  if (cached) return cached;
  const empty = { files: [], category: "", wikipedia: "" };
  const body = await wikiGet("https://www.wikidata.org/w/api.php", {
    action: "wbgetentities",
    format: "json",
    props: "claims|sitelinks",
    ids: qid,
  }) as { entities?: Record<string, { claims?: Record<string, { mainsnak?: { datavalue?: { value?: unknown } } }[]>; sitelinks?: Record<string, { title?: string }> }> } | null;
  const entity = body?.entities?.[qid];
  if (!entity || (entity as { missing?: string }).missing) {
    return empty;
  }
  const files: string[] = [];
  const take = (prop: string) => {
    for (const claim of entity.claims?.[prop] ?? []) {
      const value = claim.mainsnak?.datavalue?.value;
      if (typeof value !== "string") continue;
      const title = commonsFileTitle(value);
      if (title && !files.includes(title)) files.push(title);
    }
  };
  take("P18");
  take("P9721");
  const categoryValue = entity.claims?.P373?.[0]?.mainsnak?.datavalue?.value;
  const category = typeof categoryValue === "string" ? commonsCategoryTitle(categoryValue) : "";
  const en = entity.sitelinks?.enwiki?.title || "";
  const ja = entity.sitelinks?.jawiki?.title || "";
  const wikipedia = en ? `en:${en}` : ja ? `ja:${ja}` : "";
  const hints = { files, category, wikipedia };
  if (files.length || category || wikipedia) hintCache.set(qid, hints);
  return hints;
}

async function wikidataPhotoHintsBatch(qids: string[]): Promise<Map<string, WikidataHints>> {
  const out = new Map<string, WikidataHints>();
  const pending: string[] = [];
  for (const qid of qids) {
    if (!/^Q\d+$/.test(qid)) continue;
    const cached = hintCache.get(qid);
    if (cached) out.set(qid, cached);
    else if (!pending.includes(qid)) pending.push(qid);
  }
  for (let index = 0; index < pending.length; index += 40) {
    const chunk = pending.slice(index, index + 40);
    const body = await wikiGet("https://www.wikidata.org/w/api.php", {
      action: "wbgetentities",
      format: "json",
      props: "claims|sitelinks",
      ids: chunk.join("|"),
    }) as { entities?: Record<string, { missing?: string; claims?: Record<string, { mainsnak?: { datavalue?: { value?: unknown } } }[]>; sitelinks?: Record<string, { title?: string }> }> } | null;
    for (const qid of chunk) {
      const entity = body?.entities?.[qid];
      if (!entity || entity.missing) continue;
      const files: string[] = [];
      for (const prop of ["P18", "P9721"]) {
        for (const claim of entity.claims?.[prop] ?? []) {
          const value = claim.mainsnak?.datavalue?.value;
          if (typeof value !== "string") continue;
          const title = commonsFileTitle(value);
          if (title && !files.includes(title)) files.push(title);
        }
      }
      const categoryValue = entity.claims?.P373?.[0]?.mainsnak?.datavalue?.value;
      const category = typeof categoryValue === "string" ? commonsCategoryTitle(categoryValue) : "";
      const en = entity.sitelinks?.enwiki?.title || "";
      const ja = entity.sitelinks?.jawiki?.title || "";
      const wikipedia = en ? `en:${en}` : ja ? `ja:${ja}` : "";
      const hints = { files, category, wikipedia };
      if (files.length || category || wikipedia) hintCache.set(qid, hints);
      out.set(qid, hints);
    }
  }
  return out;
}

async function wikipediaLeadFile(wikipedia: string): Promise<string> {
  const parsed = parseWikipedia(wikipedia);
  if (!parsed) return "";
  const body = await wikiGet(`https://${parsed.lang}.wikipedia.org/w/api.php`, {
    action: "query",
    format: "json",
    formatversion: "2",
    redirects: "1",
    prop: "pageimages",
    piprop: "name",
    titles: parsed.title,
  }) as { query?: { pages?: { pageimage?: string; missing?: boolean }[] } } | null;
  const page = body?.query?.pages?.find((row) => row.pageimage && !row.missing);
  return page?.pageimage ? commonsFileTitle(page.pageimage) : "";
}

async function wikipediaLeadBatch(rows: { id: string; wikipedia: string }[]): Promise<Map<string, string>> {
  const found = new Map<string, string>();
  const groups = new Map<string, { id: string; title: string }[]>();
  for (const row of rows) {
    const parsed = parseWikipedia(row.wikipedia);
    if (!parsed) continue;
    const list = groups.get(parsed.lang) ?? [];
    list.push({ id: row.id, title: parsed.title });
    groups.set(parsed.lang, list);
  }
  for (const [lang, list] of groups) {
    for (let index = 0; index < list.length; index += 20) {
      const chunk = list.slice(index, index + 20);
      const body = await wikiGet(`https://${lang}.wikipedia.org/w/api.php`, {
        action: "query",
        format: "json",
        formatversion: "2",
        redirects: "1",
        prop: "pageimages",
        piprop: "name",
        titles: chunk.map((row) => row.title).join("|"),
      }) as { query?: { normalized?: { from: string; to: string }[]; pages?: { title?: string; pageimage?: string }[] } } | null;
      const byTitle = new Map<string, string>();
      for (const page of body?.query?.pages ?? []) {
        const file = page.pageimage ? commonsFileTitle(page.pageimage) : "";
        if (page.title && file) byTitle.set(page.title.toLowerCase(), file);
      }
      for (const row of chunk) {
        const file = byTitle.get(row.title.toLowerCase());
        if (file) found.set(row.id, file);
      }
    }
  }
  return found;
}

async function categoryFiles(category: string): Promise<string[]> {
  const title = commonsCategoryTitle(category);
  if (!title) return [];
  const body = await wikiGet("https://commons.wikimedia.org/w/api.php", {
    action: "query",
    format: "json",
    formatversion: "2",
    list: "categorymembers",
    cmtitle: title,
    cmtype: "file",
    cmnamespace: "6",
    cmlimit: "24",
  }) as { query?: { categorymembers?: { title?: string }[] } } | null;
  return (body?.query?.categorymembers ?? []).map((row) => row.title || "").filter(Boolean);
}

async function commonsSearch(name: string): Promise<string[]> {
  const query = name.trim();
  if (query.length < 4) return [];
  const body = await wikiGet("https://commons.wikimedia.org/w/api.php", {
    action: "query",
    format: "json",
    formatversion: "2",
    list: "search",
    srsearch: `intitle:"${query.replace(/"/g, "")}"`,
    srnamespace: "6",
    srlimit: "8",
  }) as { query?: { search?: { title?: string }[] } } | null;
  return (body?.query?.search ?? []).map((row) => row.title || "").filter(Boolean);
}

function acceptable(photo: PlacePhoto, primary: boolean): boolean {
  const score = scoreCommonsFile(photo.fileTitle, photo.width, photo.height, photo.mime);
  if (score <= -30) return false;
  return primary || score >= 0;
}

export async function resolvePlacePhoto(input: PhotoQuery): Promise<PlacePhoto | null> {
  const bypass = Boolean(input.failedUrl || input.rejectFileTitles?.length);
  const key = [input.wikidataId || "", input.name || "", input.localName || "", input.fileTitle || "", input.commonsCategory || "", input.wikipedia || "", input.commercial ? "c" : ""].join("|").toLowerCase();
  if (!bypass) {
    const cached = placePhotoCache.get(key);
    if (cached) return cached;
    return shareRequest(`resolve-photo:${key}`, () => resolvePlacePhotoFresh(input).then((photo) => {
      if (photo) placePhotoCache.set(key, photo);
      return photo;
    }));
  }
  return resolvePlacePhotoFresh(input);
}

async function resolvePlacePhotoFresh(input: PhotoQuery): Promise<PlacePhoto | null> {
  const name = input.name.trim();
  const qid = /^Q\d+$/.test(input.wikidataId || "") ? input.wikidataId || "" : "";
  if (input.failedUrl) forgetPhotoUrl(input.failedUrl);
  const rejected = new Set((input.rejectFileTitles ?? []).map((title) => fileKey(commonsFileTitle(title) || title)));
  const ordered: { source: PhotoSource; title: string }[] = [];
  const push = (source: PhotoSource, title: string) => {
    const normalized = commonsFileTitle(title);
    if (!normalized || normalized.includes("|") || rejected.has(fileKey(normalized))) return;
    if (ordered.some((row) => fileKey(row.title) === fileKey(normalized))) return;
    ordered.push({ source, title: normalized });
  };
  push("wikidata_image", input.fileTitle || "");
  push("wikidata_image", input.imagePage || "");
  push("osm_wikimedia", input.osmFile || "");
  let category = input.commonsCategory || "";
  let wikipedia = input.wikipedia || "";
  if (qid) {
    const hints = await wikidataPhotoHints(qid);
    for (const file of hints.files) push(ordered.some((row) => fileKey(row.title) === fileKey(file)) ? "wikidata_image" : "wikidata_image", file);
    if (!category) category = hints.category;
    if (!wikipedia) wikipedia = hints.wikipedia;
  }
  let candidates = ordered.length;
  for (const row of ordered) {
    const photo = await imageInfoOne(row.title, row.source);
    if (photo && acceptable(photo, true)) {
      logPhoto(name, qid, candidates, photo, "");
      return photo;
    }
  }
  if (wikipedia) {
    const lead = await wikipediaLeadFile(wikipedia);
    candidates += lead ? 1 : 0;
    if (lead && !rejected.has(fileKey(lead))) {
      const photo = await imageInfoOne(lead, "wikipedia_lead");
      if (photo && acceptable(photo, true)) {
        logPhoto(name, qid, candidates, photo, "");
        return photo;
      }
    }
  }
  if (category) {
    const files = await categoryFiles(category);
    const ranked = files
      .map((title) => ({ title, score: scoreCommonsFile(title) }))
      .filter((row) => row.score > -10 && !rejected.has(fileKey(row.title)))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    candidates += ranked.length;
    const infos = await imageInfoBatch(ranked.map((row) => row.title), "commons_category");
    let best: PlacePhoto | null = null;
    let bestScore = -1;
    for (const row of ranked) {
      const photo = infos.get(fileKey(row.title));
      if (!photo) continue;
      const score = scoreCommonsFile(photo.fileTitle, photo.width, photo.height, photo.mime);
      if (score > bestScore && acceptable(photo, false)) {
        best = photo;
        bestScore = score;
      }
    }
    if (best) {
      logPhoto(name, qid, candidates, best, "");
      return best;
    }
  }
  if (name && !input.commercial) {
    const hits = await commonsSearch(name);
    const matched = hits.filter((title) => searchPhotoOk(input.name, title, input.localName || "") && !rejected.has(fileKey(title)));
    candidates += matched.length;
    const ranked = matched
      .map((title) => ({ title, score: scoreCommonsFile(title) }))
      .sort((a, b) => b.score - a.score);
    let best: PlacePhoto | null = null;
    let bestScore = -1;
    for (const row of ranked.slice(0, 4)) {
      const photo = await imageInfoOne(row.title, "commons_search");
      if (!photo || !acceptable(photo, false) || !searchPhotoOk(name, photo.fileTitle, input.localName || "")) continue;
      const score = scoreCommonsFile(photo.fileTitle, photo.width, photo.height, photo.mime);
      if (score > bestScore) {
        best = photo;
        bestScore = score;
      }
    }
    if (best) {
      logPhoto(name, qid, candidates, best, "");
      return best;
    }
  }
  logPhoto(name, qid, candidates, null, candidates ? "No usable open image after Wikimedia lookup." : "No open-photo candidate.");
  return null;
}

function qidOf(place: DiscoveredPlace): string {
  if (place.wikidataId && /^Q\d+$/.test(place.wikidataId)) return place.wikidataId;
  const found = `${place.providerId} ${place.id}`.match(/\bQ\d+\b/);
  return found?.[0] ?? "";
}

function seedTitle(place: DiscoveredPlace): string {
  return commonsFileTitle(place.commonsFile || "") || commonsFileTitle(place.imagePage || "") || commonsFileTitle(place.image || "");
}

export async function attachPlacePhotos<T extends DiscoveredPlace>(places: T[]): Promise<T[]> {
  return shareRequest(`photos:${places.map((place) => place.id).slice(0, 12).join(",")}:${places.length}`, () => attach(places));
}

async function attach<T extends DiscoveredPlace>(places: T[]): Promise<T[]> {
  const photos = new Map<string, PlacePhoto>();
  const targets = places.filter((place) => place.category !== "stay" && place.category !== "transport");
  const seeded: { id: string; title: string; source: PhotoSource }[] = [];
  for (const place of targets) {
    const title = seedTitle(place);
    if (!title) continue;
    const source: PhotoSource = place.provider === "osm" && place.commonsFile ? "osm_wikimedia" : "wikidata_image";
    seeded.push({ id: place.id, title, source });
  }
  const infos = await imageInfoBatch(seeded.map((row) => row.title), "wikidata_image");
  for (const row of seeded) {
    const photo = infos.get(fileKey(row.title));
    if (photo && acceptable(photo, true)) photos.set(row.id, { ...photo, source: row.source });
  }
  const needsHints = targets.filter((place) => !photos.has(place.id) && SEE.has(place.category) && qidOf(place)).slice(0, 40);
  const hints = await wikidataPhotoHintsBatch(needsHints.map(qidOf));
  const fromClaims: { id: string; title: string }[] = [];
  const categories = new Map<string, string>();
  const wikis = new Map<string, string>();
  for (const place of needsHints) {
    const hint = hints.get(qidOf(place));
    if (!hint) continue;
    if (hint.category) categories.set(place.id, hint.category);
    if (hint.wikipedia) wikis.set(place.id, hint.wikipedia);
    const title = hint.files[0];
    if (title) fromClaims.push({ id: place.id, title });
  }
  const claimed = await imageInfoBatch(fromClaims.map((row) => row.title), "wikidata_image");
  for (const row of fromClaims) {
    const photo = claimed.get(fileKey(row.title));
    if (photo && acceptable(photo, true)) photos.set(row.id, photo);
  }
  const wikiRows = targets
    .filter((place) => !photos.has(place.id) && SEE.has(place.category) && (place.wikipedia || wikis.has(place.id)))
    .slice(0, 20)
    .map((place) => ({ id: place.id, wikipedia: place.wikipedia || wikis.get(place.id) || "" }));
  const leads = await wikipediaLeadBatch(wikiRows);
  const leadInfos = await imageInfoBatch([...leads.values()], "wikipedia_lead");
  for (const [id, title] of leads) {
    const photo = leadInfos.get(fileKey(title));
    if (photo && acceptable(photo, true)) photos.set(id, { ...photo, source: "wikipedia_lead" });
  }
  const categoryTargets = targets.filter((place) => !photos.has(place.id) && SEE.has(place.category) && (place.commonsCategory || categories.has(place.id))).slice(0, 4);
  for (const place of categoryTargets) {
    const files = await categoryFiles(place.commonsCategory || categories.get(place.id) || "");
    const ranked = files
      .map((title) => ({ title, score: scoreCommonsFile(title) }))
      .filter((row) => row.score > -10)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    const infos = await imageInfoBatch(ranked.map((row) => row.title), "commons_category");
    let best: PlacePhoto | null = null;
    let bestScore = -1;
    for (const row of ranked) {
      const photo = infos.get(fileKey(row.title));
      if (!photo) continue;
      const score = scoreCommonsFile(photo.fileTitle, photo.width, photo.height, photo.mime);
      if (score > bestScore && acceptable(photo, false)) {
        best = photo;
        bestScore = score;
      }
    }
    if (best) photos.set(place.id, best);
  }
  const searchTargets = targets
    .filter((place) => !photos.has(place.id) && SEE.has(place.category) && (place.importance === "iconic" || place.importance === "major" || (place.sitelinks ?? 0) >= 25))
    .slice(0, 4);
  for (const place of searchTargets) {
    const hits = await commonsSearch(place.name);
    const matched = hits.filter((title) => searchPhotoOk(place.name, title, place.nameLocal || place.localName || ""));
    const ranked = matched
      .map((title) => ({ title, score: scoreCommonsFile(title) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    const infos = await imageInfoBatch(ranked.map((row) => row.title), "commons_search");
    let best: PlacePhoto | null = null;
    let bestScore = -1;
    for (const row of ranked) {
      const photo = infos.get(fileKey(row.title));
      if (!photo || !acceptable(photo, false) || !searchPhotoOk(place.name, photo.fileTitle, place.nameLocal || place.localName || "")) continue;
      const score = scoreCommonsFile(photo.fileTitle, photo.width, photo.height, photo.mime);
      if (score > bestScore) {
        best = photo;
        bestScore = score;
      }
    }
    if (best) photos.set(place.id, best);
  }
  const referenced = targets.filter((place) => !photos.has(place.id) && !isCommercialCategory(place.category) && (place.mapillaryId || place.panoramaxId)).slice(0, 4);
  for (const place of referenced) {
    const street = await referencedStreetPhoto(place);
    if (street) photos.set(place.id, street);
  }
  const commercial = targets.filter((place) => isCommercialCategory(place.category) && !photos.has(place.id)).slice(0, 8);
  const profiles = new Map<string, NonNullable<DiscoveredPlace["commerce"]>>();
  for (const place of commercial) {
    const enriched = await enrichCommercialPlace(place, false);
    if (enriched.photo) photos.set(place.id, enriched.photo);
    if (enriched.profile) profiles.set(place.id, enriched.profile);
  }
  const galleries = new Map<string, PlacePhoto[]>();
  const galleryPlaces = targets.filter((place) => SEE.has(place.category) && (place.importance === "iconic" || place.importance === "major")).slice(0, 6);
  const missingCategory = galleryPlaces.filter((place) => !(place.commonsCategory || categories.has(place.id)) && qidOf(place));
  if (missingCategory.length) {
    const extraHints = await wikidataPhotoHintsBatch(missingCategory.map(qidOf));
    for (const place of missingCategory) {
      const hint = extraHints.get(qidOf(place));
      if (hint?.category) categories.set(place.id, hint.category);
    }
  }
  for (const place of galleryPlaces) {
    const category = place.commonsCategory || categories.get(place.id) || "";
    const hero = photos.get(place.id) ?? null;
    if (!category) {
      if (hero) galleries.set(place.id, [hero]);
      continue;
    }
    const files = await categoryFiles(category);
    const ranked = files
      .map((title) => ({ title, score: scoreCommonsFile(title) }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    const infos = await imageInfoBatch(ranked.map((row) => row.title), "commons_category");
    const chosen: PlacePhoto[] = [];
    for (const row of ranked) {
      const photo = infos.get(fileKey(row.title));
      if (!photo || !acceptable(photo, false)) continue;
      if (chosen.some((item) => fileKey(item.fileTitle) === fileKey(photo.fileTitle))) continue;
      chosen.push(photo);
      if (chosen.length === 4) break;
    }
    const heroScore = hero ? scoreCommonsFile(hero.fileTitle, hero.width, hero.height, hero.mime) : -100;
    const best = chosen[0];
    const bestScore = best ? scoreCommonsFile(best.fileTitle, best.width, best.height, best.mime) : -100;
    const lead = best && bestScore >= heroScore + 8 ? best : hero ?? best ?? null;
    const list = [lead, hero, ...chosen].filter((item): item is PlacePhoto => Boolean(item));
    const unique: PlacePhoto[] = [];
    for (const item of list) {
      if (unique.some((have) => fileKey(have.fileTitle) === fileKey(item.fileTitle))) continue;
      unique.push(item);
      if (unique.length === 4) break;
    }
    if (unique[0]) {
      photos.set(place.id, unique[0]);
      galleries.set(place.id, unique);
    }
  }
  let logged = 0;
  for (const place of targets) {
    const photo = photos.get(place.id);
    const hadCandidate = Boolean(seedTitle(place) || categories.has(place.id) || wikis.has(place.id) || place.wikipedia || place.commonsCategory);
    if (!photo && !hadCandidate) continue;
    if (logged >= 24 && !/tokugawa art museum/i.test(place.name)) continue;
    logged += 1;
    logPhoto(place.name, qidOf(place), photo ? 1 : 0, photo ?? null, photo ? "" : "No usable open image after Wikimedia lookup.");
  }
  return places.map((place) => {
    const photo = photos.get(place.id);
    if (!photo) return place.image && !isPermittedPhotoUrl(place.image) ? { ...place, image: "", imagePage: "" } : place;
    return {
      ...place,
      photo,
      photos: galleries.get(place.id) || [photo],
      image: photo.thumbnailUrl,
      imagePage: photo.descriptionUrl || place.imagePage,
      commerce: profiles.get(place.id) || place.commerce,
    };
  });
}
