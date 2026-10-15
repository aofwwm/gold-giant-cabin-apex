import { RequestGate, shareRequest, TtlCache } from "@/lib/travel-cache";
import { noteCall, noteFailure } from "@/lib/provider-usage";
import { verifiedWebsite } from "@/lib/travel-links";
import { commonsFileTitle } from "@/lib/travel-photo";
import { annotatePlace, type DiscoveredPlace, type StopCategory } from "@/lib/travel-model";
import { destinationLanguages, destinationLocalName, tidyLocalLabel } from "@/lib/travel-names";
import { inferCountry } from "@/lib/travel-routing";

const knowledgeCache = new TtlCache<DestinationProfile>(7 * 24 * 60 * 60 * 1000, 40, "discovery");
const wikiGate = new RequestGate(4, 10_000);
const voyageGate = new RequestGate(1, 2_000);
const UA = "Kairos/1.0 (travel; contact: local)";

export type KnowledgePlace = DiscoveredPlace;

export type GeoBox = { south: number; west: number; north: number; east: number };

export type DestinationProfile = {
  destination: string;
  qid: string;
  places: KnowledgePlace[];
  sourceNote: string;
  fetchedAt: string;
  status: "ok" | "empty" | "failed";
  error: string;
};

const JUNK_TYPE = /language|human\b|organization|organis|university|school|college|commune of|arrondissement|megacity|global city|capital city|largest city|region of|historical country|empire\b|republic\b|regime|terrorist|massacre|genocide|mass shooting|olympic|tournament|conference|scandal|controversy|structure fire|storming|legislature|rapid transit|metro station|railway station|treaty|protocol\b|climate change agreement|environmental protocol|library|archives|higher education|grande école|grande ecole|engineering school|destroyed building|archaeological artefact|archaeological artifact|intergovernmental|administrative territorial|peace conference|former entity|insurgency|political scandal|sports season|football|financial center|central business district|department of|prefecture|airport|aerodrome|airline/;
const SIGHT_WORD = /museum|gallery|temple|shrine|castle|palace|park|garden|tower|statue|bridge|cathedral|basilica|church|chapel|mosque|synagogue|monastery|abbey|market|zoo|aquarium|monument|memorial|pagoda|fort|opera|theme park|amusement|attraction/;

/** A city, town, or "tourist destination" is a container, not a 90-minute sight. */
export function isSettlementType(typeLabel: string, description = ""): boolean {
  const type = typeLabel.toLowerCase();
  const desc = description.toLowerCase();
  const withoutDestination = type.replace(/tourist destinations?/g, "");
  if (SIGHT_WORD.test(withoutDestination)) return false;
  if (/\b(city|town|village|municipality|human settlement|metropolis|special ward|core city|prefecture|county|province|borough|commune)\b/.test(type)) return true;
  if (/\btourist destination\b/.test(type)) return true;
  if (/^(city|town|village|municipality|ward|special city|core city|human settlement|tourist destination)\b/.test(desc)) return true;
  return false;
}

export function discoveryBox(area: { latitude: number; longitude: number; bbox?: [number, number, number, number] }): GeoBox {
  const raw = area.bbox;
  if (raw && raw.length === 4 && raw.every((value) => Number.isFinite(value))) {
    const [south, west, north, east] = raw;
    const height = north - south;
    const width = east - west;
    if (south < north && west < east && height > 0.015 && height < 0.85 && width > 0.015 && width < 0.85) {
      const padLat = Math.min(0.02, height * 0.08);
      const padLng = Math.min(0.02, width * 0.08);
      return { south: south - padLat, west: west - padLng, north: north + padLat, east: east + padLng };
    }
  }
  return radiusBox(area.latitude, area.longitude, 14000);
}

function radiusBox(lat: number, lng: number, radius: number): GeoBox {
  const dLat = radius / 111320;
  const dLng = radius / (111320 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
  return { south: lat - dLat, west: lng - dLng, north: lat + dLat, east: lng + dLng };
}

export function classifyVisit(typeLabel: string, name: string): { category: StopCategory; indoor: boolean; groups: string[] } | null {
  const type = typeLabel.toLowerCase();
  const label = name.toLowerCase();
  if (!type && !label) return null;
  if (/university|airport|college|railway station|metro station/.test(label)) return null;
  if (JUNK_TYPE.test(type) || type.includes("destroyed")) return null;
  if (isSettlementType(typeLabel, "")) return null;
  if (/\briver\b/.test(type) && !type.includes("island")) return null;
  const heritage = ["heritage"];
  const nature = ["nature"];
  if (type.includes("museum") || type.includes("gallery") || type.includes("cultural centre") || type.includes("cultural center")) return { category: "museum", indoor: true, groups: heritage };
  if (type.includes("zoo") || type.includes("aquarium") || type.includes("safari") || type.includes("menagerie")) return { category: type.includes("aquarium") ? "aquarium" : "zoo", indoor: type.includes("aquarium"), groups: ["wildlife"] };
  if (type.includes("amusement") || type.includes("theme park")) return { category: "theme_park", indoor: false, groups: ["city"] };
  if (type.includes("tower") || type.includes("obelisk") || type.includes("ferris") || type.includes("wheel") || type.includes("observation")) return { category: "attraction", indoor: false, groups: heritage };
  if (type.includes("garden") || type.includes("botanical")) return { category: "garden", indoor: false, groups: nature };
  if (type.includes("nature reserve") || type.includes("national park") || type.includes("mountain") || type.includes("beach") || type.includes("park")) return { category: type.includes("beach") ? "beach" : "park", indoor: false, groups: nature };
  if (type.includes("cathedral") || type.includes("basilica") || type.includes("church") || type.includes("chapel") || type.includes("temple") || type.includes("mosque") || type.includes("synagogue") || type.includes("monastery") || type.includes("abbey") || type.includes("shrine")) return { category: "historic", indoor: true, groups: heritage };
  if (type.includes("canal") || type.includes("irrigation") || type.includes("heritage") || type.includes("aaaaa") || type.includes("archaeological") || type.includes("monument") || type.includes("memorial") || type.includes("palace") || type.includes("castle") || type.includes("opera") || type.includes("historic") || type.includes("triumphal") || type.includes("arch")) return { category: type.includes("opera") ? "attraction" : "historic", indoor: type.includes("opera") || type.includes("palace") || type.includes("castle"), groups: heritage };
  if (type.includes("bridge") || type.includes("square") || type.includes("plaza") || type.includes("statue") || type.includes("sculpture") || type.includes("fountain")) return { category: "landmark", indoor: false, groups: heritage };
  if (type.includes("boulevard") || type.includes("avenue") || type.includes("promenade") || type.includes("neighbourhood") || type.includes("neighborhood") || type.includes("quarter") || type.includes("district") || /\bhill\b/.test(type)) return { category: "landmark", indoor: false, groups: ["neighbourhood"] };
  if (type.includes("island")) return { category: "attraction", indoor: false, groups: heritage };
  if (type.includes("cemetery")) return { category: "historic", indoor: false, groups: heritage };
  if (type.includes("market") || type.includes("bazaar") || type.includes("shopping")) return { category: "market", indoor: true, groups: ["shopping"] };
  if (type.includes("theatre") || type.includes("theater") || type.includes("arts centre") || type.includes("concert hall")) return { category: "attraction", indoor: true, groups: heritage };
  if (type.includes("attraction") || type.includes("tourist") || /panda|wildlife/.test(label)) return { category: /panda|wildlife/.test(label) ? "zoo" : "attraction", indoor: false, groups: /panda|wildlife/.test(label) ? ["wildlife"] : ["city"] };
  return null;
}

type SparqlHit = { places: KnowledgePlace[]; status: "ok" | "empty" | "failed"; error: string };

function placeFromRow(id: string, row: { name: string; nameEn: string; nameLocal: string; lat: number; lng: number; description: string; image: string; website: string; sitelinks: number; types: string[] }): KnowledgePlace | null {
  const blob = `${row.types.join(" ")} ${row.name} ${row.description}`;
  if (/university|airport|college|railway station|metro station/i.test(blob)) return null;
  if (/^main island\b/i.test(row.description)) return null;
  if (isSettlementType(row.types.join(" | "), row.description)) return null;
  if (/disputed|sovereignty|military|armed forces|live-firing|restricted area|training area/i.test(row.description)) return null;
  const island = row.types.some((type) => /island/i.test(type));
  const visitableIsland = /resort|park|beach|tourist|theme|village|conservation|wetland|garden/i.test(`${row.name} ${row.description}`);
  if (island && row.sitelinks < 30 && !visitableIsland) return null;
  const mapped = classifyVisit(row.types.join(" | "), row.name);
  if (!mapped) return null;
  const file = commonsFileTitle(row.image);
  return {
    id: `wd:${id}`,
    provider: "wikidata",
    providerId: `wd:${id}`,
    name: row.name,
    category: mapped.category,
    address: "",
    lat: row.lat,
    lng: row.lng,
    indoor: mapped.indoor,
    area: "",
    opening: "",
    nameEn: row.nameEn,
    nameLocal: row.nameLocal,
    localName: row.nameLocal,
    translationSource: row.nameEn ? "wikidata_en" : "",
    description: row.description,
    image: "",
    imagePage: "",
    wikidataId: id,
    commonsFile: file,
    website: verifiedWebsite(row.website),
    sitelinks: row.sitelinks,
    groups: mapped.groups,
    sourceNote: `Wikidata ${id}`,
  };
}

async function sparqlBox(box: GeoBox, minLinks: number, limit: number, countryCode: string, outside?: GeoBox): Promise<SparqlHit> {
  if (!wikiGate.allow()) return { places: [], status: "failed", error: "Wikidata rate limit." };
  const outsideFilter = outside
    ? `BIND(geof:longitude(?coord) AS ?lon) BIND(geof:latitude(?coord) AS ?lat) FILTER(?lat < ${outside.south} || ?lat > ${outside.north} || ?lon < ${outside.west} || ?lon > ${outside.east})`
    : "";
  const langs = destinationLanguages(countryCode).map((lang) => lang.toLowerCase()).filter((lang) => lang !== "en" && /^[a-z]{2,3}(?:-[a-z]{2,5})?$/.test(lang));
  const localClause = langs.length
    ? `OPTIONAL { ?place rdfs:label ?localLabel . FILTER(LANG(?localLabel) IN (${langs.map((lang) => `"${lang}"`).join(", ")})) }`
    : "";
  const query = `SELECT ?place ?placeLabel ?placeDescription ?coord ?image ?website ?sitelinks ?typeLabel ?enLabel ?localLabel WHERE {
    {
      SELECT DISTINCT ?place ?sitelinks WHERE {
        SERVICE wikibase:box {
          ?place wdt:P625 ?coord .
          bd:serviceParam wikibase:cornerSouthWest "Point(${box.west} ${box.south})"^^geo:wktLiteral .
          bd:serviceParam wikibase:cornerNorthEast "Point(${box.east} ${box.north})"^^geo:wktLiteral .
        }
        ?place wikibase:sitelinks ?sitelinks .
        FILTER(?sitelinks >= ${minLinks})
        ${outsideFilter}
      } ORDER BY DESC(?sitelinks) LIMIT ${limit}
    }
    OPTIONAL { ?place wdt:P625 ?coord }
    OPTIONAL { ?place wdt:P18 ?image }
    OPTIONAL { ?place wdt:P856 ?website }
    OPTIONAL { ?place wdt:P31 ?type . ?type rdfs:label ?typeLabel . FILTER(LANG(?typeLabel) = "en") }
    OPTIONAL { ?place rdfs:label ?enLabel . FILTER(LANG(?enLabel) = "en") }
    ${localClause}
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }`;
  let res: Response;
  try {
    const url = new URL("https://query.wikidata.org/sparql");
    url.searchParams.set("format", "json");
    url.searchParams.set("query", query);
    noteCall("discovery", "wikidata");
    res = await fetch(url, { headers: { Accept: "application/sparql-results+json", "User-Agent": UA }, signal: AbortSignal.timeout(outside ? 12000 : 16000) });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError" ? "Wikidata timed out." : "Wikidata request failed.";
    return { places: [], status: "failed", error: message };
  }
  if (!res.ok) {
    noteFailure("discovery", "wikidata", `HTTP ${res.status}`);
    return { places: [], status: "failed", error: `Wikidata HTTP ${res.status}.` };
  }
  const body = (await res.json()) as { results?: { bindings?: Record<string, { value?: string }>[] } };
  const grouped = new Map<string, { name: string; nameEn: string; nameLocal: string; lat: number; lng: number; description: string; image: string; website: string; sitelinks: number; types: string[] }>();
  for (const row of body.results?.bindings ?? []) {
    const id = row.place?.value?.split("/").pop() ?? "";
    const coord = row.coord?.value ?? "";
    const match = coord.match(/Point\(([-0-9.]+) ([-0-9.]+)\)/);
    const name = (row.placeLabel?.value ?? "").trim();
    if (!id || !match || !name || name === id) continue;
    const current = grouped.get(id) ?? {
      name: name.slice(0, 80),
      nameEn: "",
      nameLocal: "",
      lat: Number(match[2]),
      lng: Number(match[1]),
      description: (row.placeDescription?.value ?? "").slice(0, 280),
      image: row.image?.value ?? "",
      website: "",
      sitelinks: Number(row.sitelinks?.value ?? 0) || 0,
      types: [],
    };
    const en = tidyLocalLabel(row.enLabel?.value ?? "");
    const local = tidyLocalLabel(row.localLabel?.value ?? "");
    if (en && !current.nameEn) current.nameEn = en.slice(0, 80);
    if (local && local.toLowerCase() !== en.toLowerCase() && !current.nameLocal) current.nameLocal = local.slice(0, 80);
    const typeLabel = row.typeLabel?.value ?? "";
    if (typeLabel && !current.types.includes(typeLabel)) current.types.push(typeLabel);
    if (!current.image && row.image?.value) current.image = row.image.value;
    if (!current.website && row.website?.value) current.website = row.website.value;
    if (!current.description && row.placeDescription?.value) current.description = row.placeDescription.value.slice(0, 280);
    grouped.set(id, current);
  }
  const places: KnowledgePlace[] = [];
  for (const [id, row] of grouped) {
    const place = placeFromRow(id, row);
    if (place) places.push(place);
  }
  return { places, status: places.length ? "ok" : "empty", error: places.length ? "" : "Wikidata returned no visitable places in this area." };
}

async function searchQid(name: string): Promise<string> {
  if (!wikiGate.allow()) return "";
  const url = new URL("https://www.wikidata.org/w/api.php");
  url.searchParams.set("action", "wbsearchentities");
  url.searchParams.set("search", name);
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("type", "item");
  url.searchParams.set("limit", "5");
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) return "";
  const body = (await res.json()) as { search?: { id?: string; description?: string; label?: string }[] };
  const hit = (body.search ?? []).find((row) => row.id && !/human|singer|film|album/i.test(row.description ?? ""));
  return hit?.id ?? "";
}

async function voyageNames(destination: string): Promise<Set<string>> {
  if (!voyageGate.allow()) return new Set();
  const url = new URL("https://en.wikivoyage.org/w/api.php");
  url.searchParams.set("action", "parse");
  url.searchParams.set("page", destination);
  url.searchParams.set("prop", "links");
  url.searchParams.set("format", "json");
  url.searchParams.set("redirects", "1");
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) return new Set();
  const body = (await res.json()) as { parse?: { links?: { "*": string }[] } };
  const names = new Set<string>();
  for (const link of body.parse?.links ?? []) {
    const name = (link["*"] ?? "").replace(/_/g, " ").trim().toLowerCase();
    if (name && !name.startsWith("wikivoyage:") && !name.startsWith("category:")) names.add(name);
  }
  return names;
}

export async function destinationProfile(area: { name: string; latitude: number; longitude: number; countryCode?: string; bbox?: [number, number, number, number] }): Promise<DestinationProfile> {
  const box = discoveryBox(area);
  const country = (area.countryCode || inferCountry(area.latitude, area.longitude) || "").toUpperCase();
  const cacheKey = `v7:${country}:${area.name.toLowerCase()}:${box.south.toFixed(2)},${box.west.toFixed(2)},${box.north.toFixed(2)},${box.east.toFixed(2)}`;
  const cached = knowledgeCache.get(cacheKey);
  if (cached) return cached;
  return shareRequest(`knowledge:${cacheKey}`, async () => {
    const again = knowledgeCache.peek(cacheKey);
    if (again) return again;
    const qid = await searchQid(area.name).catch(() => "");
    const near = await sparqlBox(box, 10, 120, country);
    const wide = radiusBox(area.latitude, area.longitude, 60000);
    const far = near.status === "failed" ? { places: [], status: "failed" as const, error: near.error } : await sparqlBox(wide, 18, 16, country, box);
    const mentioned = near.status === "failed" ? new Set<string>() : await voyageNames(area.name).catch(() => new Set<string>());
    const merged = new Map<string, KnowledgePlace>();
    for (const place of [...near.places, ...far.places]) {
      const previous = merged.get(place.providerId);
      if (!previous || (place.sitelinks ?? 0) > (previous.sitelinks ?? 0)) merged.set(place.providerId, place);
    }
    const places = [...merged.values()].map((place) => {
      const local = destinationLocalName({ name: place.name, nameEn: place.nameEn, nameLocal: place.nameLocal, countryCode: country });
      return annotatePlace({
        ...place,
        area: area.name,
        address: place.address || area.name,
        nameLocal: local.name,
        localName: local.name,
        localNameSource: local.source,
        mentioned: mentioned.has(place.name.toLowerCase()) || place.mentioned,
      }, area.latitude, area.longitude);
    });
    const status = places.length ? "ok" : near.status === "failed" && !far.places.length ? "failed" : "empty";
    const error = places.length ? "" : near.error || far.error || "Wikidata returned no visitable places.";
    const profile: DestinationProfile = {
      destination: area.name,
      qid,
      places,
      sourceNote: status === "failed"
        ? "Wikidata did not load. Nothing was invented."
        : "Wikidata and OpenStreetMap.",
      fetchedAt: new Date().toISOString(),
      status,
      error,
    };
    if (places.length) knowledgeCache.set(cacheKey, profile);
    return profile;
  });
}

export function mergePlaces(osm: DiscoveredPlace[], knowledge: DiscoveredPlace[], area: { name: string; latitude: number; longitude: number; countryCode?: string }): DiscoveredPlace[] {
  const country = (area.countryCode || inferCountry(area.latitude, area.longitude) || "").toUpperCase();
  const localOf = (candidates: (string | undefined)[], nameEn?: string) => {
    for (const candidate of candidates) {
      const picked = destinationLocalName({ name: "", nameEn, nameLocal: candidate || "", countryCode: country });
      if (picked.name) return picked;
    }
    return { name: "", source: "" };
  };
  const used = new Set<string>();
  const merged: DiscoveredPlace[] = [];
  for (const spot of osm) {
    const twin = knowledge.find((item) => !used.has(item.id) && sameIdentity(item, spot));
    if (twin) used.add(twin.id);
    const nameEn = spot.nameEn || twin?.nameEn || "";
    const local = localOf([spot.nameLocal, twin?.nameLocal, spot.name], nameEn);
    const next = annotatePlace({
      ...spot,
      category: spot.category === "attraction" && twin && twin.category !== "attraction" && twin.category !== "stay" ? twin.category : spot.category,
      indoor: spot.category === "attraction" && twin && twin.indoor ? true : spot.indoor,
      localName: local.name,
      nameEn,
      nameLocal: local.name,
      nameLatin: spot.nameLatin || twin?.nameLatin || "",
      localNameSource: local.source,
      translationSource: spot.translationSource || twin?.translationSource || "",
      description: twin?.description || spot.description || "",
      image: "",
      imagePage: "",
      photo: undefined,
      wikidataId: twin?.wikidataId || spot.wikidataId || "",
      commonsFile: twin?.commonsFile || spot.commonsFile || "",
      commonsCategory: twin?.commonsCategory || spot.commonsCategory || "",
      wikipedia: twin?.wikipedia || spot.wikipedia || "",
      mapillaryId: spot.mapillaryId || twin?.mapillaryId || "",
      panoramaxId: spot.panoramaxId || twin?.panoramaxId || "",
      website: spot.website || twin?.website || "",
      region: spot.region || twin?.region || "",
      sitelinks: twin?.sitelinks ?? spot.sitelinks,
      mentioned: twin?.mentioned || spot.mentioned,
      groups: twin?.groups?.length ? twin.groups : spot.groups,
      sourceNote: twin ? `${twin.sourceNote ?? "Wikidata"} · OpenStreetMap` : "OpenStreetMap",
    }, area.latitude, area.longitude);
    merged.push(next);
  }
  for (const place of knowledge) {
    if (used.has(place.id)) continue;
    if (merged.some((item) => sameIdentity(item, place))) continue;
    const local = localOf([place.nameLocal, place.name], place.nameEn);
    merged.push(annotatePlace({
      ...place,
      area: area.name,
      address: place.address || area.name,
      nameLocal: local.name,
      localName: local.name,
      localNameSource: local.source,
    }, area.latitude, area.longitude));
  }
  return merged;
}

const GENERIC_WORDS = new Set(["museum", "musee", "tower", "tour", "cathedral", "cathedrale", "basilica", "basilique", "church", "eglise", "palace", "palais", "garden", "jardin", "park", "parc", "bridge", "pont", "national", "centre", "center", "chapel", "chapelle", "the", "des", "les", "du", "de", "la", "le", "of", "and"]);

function foldName(value: string): string {
  return value.toLowerCase().replace(/œ/g, "oe").replace(/æ/g, "ae").normalize("NFD").replace(/\p{M}/gu, "").replace(/[^a-z0-9\u4e00-\u9fff]+/g, " ").trim();
}

function nameStem(value: string): string {
  return foldName(value).split(" ").filter((word) => word.length > 2 && !GENERIC_WORDS.has(word)).join("");
}

function compatiblePlace(left: DiscoveredPlace["category"], right: DiscoveredPlace["category"]): boolean {
  if (left === "stay" || right === "stay") return left === right;
  const food = new Set(["restaurant", "cafe", "market", "nightlife"]);
  if (food.has(left) || food.has(right)) return food.has(left) && food.has(right);
  return true;
}

function sameIdentity(left: DiscoveredPlace, right: DiscoveredPlace): boolean {
  if (!compatiblePlace(left.category, right.category)) return false;
  if (namesMatch(left.name, right.name)) return true;
  if (left.nameLocal && (namesMatch(left.nameLocal, right.name) || (right.nameLocal && namesMatch(left.nameLocal, right.nameLocal)))) return true;
  if (right.nameLocal && namesMatch(left.name, right.nameLocal)) return true;
  if (left.nameEn && right.nameEn && namesMatch(left.nameEn, right.nameEn)) return true;
  if (left.nameEn && namesMatch(left.nameEn, right.name)) return true;
  if (right.nameEn && namesMatch(left.name, right.nameEn)) return true;
  return false;
}

function namesMatch(left: string, right: string): boolean {
  const stemA = nameStem(left);
  const stemB = nameStem(right);
  if (stemA.length >= 6 && stemA === stemB) return true;
  const a = foldName(left).replace(/ /g, "");
  const b = foldName(right).replace(/ /g, "");
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length < 6 || b.length < 6) return false;
  const short = a.length < b.length ? a : b;
  const long = a.length < b.length ? b : a;
  return long.includes(short) && short.length / long.length >= 0.62;
}
