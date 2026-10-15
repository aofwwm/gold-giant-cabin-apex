import { createRequire } from "node:module";
import { distanceMeters } from "@/lib/coord";
import { findStarterFact, playbookFromFact, STARTER_FACTS, type DestinationFact } from "@/lib/travel-playbook-facts";
import {
  consensusFrom,
  describePlaybook,
  guardSourceCoverage,
  type DayTemplate,
  type PlaybookConfidence,
  type PlaybookScope,
  type PlaybookStatus,
  type ReferenceItinerary,
  type SourceCoverage,
  type TravelPlaybook,
} from "@/lib/travel-playbook";
import { PLAYBOOKS } from "@/lib/travel-playbooks";
import { englishAreaName } from "@/lib/travel-names";
import { ensureDestinationKnowledge } from "@/lib/travel-knowledge-pack";

/**
 * Playbook registry.
 * Curated seeds stay. Popular destinations are synthesised once from structural facts.
 * Any other destination is built on first request and reused. No Gemini call.
 * Operator consensus is never invented. A failed build returns null so the
 * existing destination planner can still make the trip.
 */

export const PLAYBOOK_SCHEMA_VERSION = 1;

export type GeoHint = {
  latitude?: number;
  longitude?: number;
  countryCode?: string;
  scope?: PlaybookScope;
  refresh?: boolean;
};

export type GuideArea = {
  name: string;
  section: "region" | "city" | "other" | "day-trip";
};

export type GuideExtract = {
  areas: GuideArea[];
  sources: { name: string; sourceType: ReferenceItinerary["sourceType"]; sourceUrl: string; facts: string[]; stops: string[] }[];
  warnings?: string[];
};

export type PlaybookReaders = {
  operators?: (name: string) => Promise<GuideExtract | null>;
  openGuides?: (name: string) => Promise<GuideExtract | null>;
  locate?: (name: string) => Promise<{ latitude: number; longitude: number } | null>;
};

export type RegistryRow = {
  destinationId: string;
  destinationName: string;
  destinationScope: PlaybookScope;
  status: PlaybookStatus;
  confidence: PlaybookConfidence;
  version: number;
  sourceCount: number;
  sourceDiversity: SourceCoverage;
  createdAt: string;
  lastVerified: string;
  nextReviewAt: string;
  parentId?: string;
};

const require = createRequire(import.meta.url);
const registry = new Map<string, TravelPlaybook>();
let warmed = false;
let builds = 0;
let network = false;
let persistPath = "";
let readers: PlaybookReaders = {};

export function playbookGeminiCalls(): number {
  return 0;
}

export function playbookBuildCount(): number {
  return builds;
}

export function resetPlaybookBuildCount(): void {
  builds = 0;
}

export function setPlaybookNetwork(enabled: boolean): void {
  network = enabled;
}

export function setPlaybookReaders(next: PlaybookReaders | null): void {
  readers = next ?? {};
}

export function enablePlaybookPersistence(path = "data/playbooks/generated.json"): void {
  persistPath = path;
}

export function resetPlaybookRegistryForTests(): void {
  registry.clear();
  warmed = false;
  builds = 0;
  network = false;
  persistPath = "";
  readers = {};
  for (const book of PLAYBOOKS) registry.set(book.id, stampCurated(book));
  warmed = true;
}

function stampCurated(book: TravelPlaybook): TravelPlaybook {
  const verified = book.lastUpdated;
  return {
    ...book,
    origin: "curated",
    status: "CURATED",
    sourceCoverage: guardSourceCoverage(book.references),
    playbookVersion: book.playbookVersion ?? 1,
    schemaVersion: PLAYBOOK_SCHEMA_VERSION,
    parentId: book.parentId || book.parentCountry,
    createdAt: verified,
    lastVerified: verified,
    nextReviewAt: addDays(verified, 180),
    warnings: book.warnings ?? [],
    sourceSnapshot: book.references.map((ref) => ({ id: ref.id, name: ref.sourceName, sourceType: ref.sourceType, sourceUrl: ref.sourceUrl })),
  };
}

function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const next = new Date(Date.UTC(year || 2026, (month || 1) - 1, (day || 1) + days));
  return next.toISOString().slice(0, 10);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function playbookSlug(name: string): string {
  return name.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function warm(): void {
  if (warmed) return;
  warmed = true;
  if (!registry.size) {
    for (const book of PLAYBOOKS) registry.set(book.id, stampCurated(book));
  }
  loadDisk();
}

function loadDisk(): void {
  if (!persistPath) return;
  try {
    const fs = require("node:fs") as typeof import("node:fs");
    if (!fs.existsSync(persistPath)) return;
    const body = JSON.parse(fs.readFileSync(persistPath, "utf8")) as { schemaVersion?: number; books?: TravelPlaybook[] };
    if (body.schemaVersion !== PLAYBOOK_SCHEMA_VERSION || !Array.isArray(body.books)) return;
    for (const book of body.books) {
      if (!book?.id || registry.has(book.id) && registry.get(book.id)?.origin === "curated") continue;
      registry.set(book.id, book);
    }
  } catch {
    // A bad cache is ignored. The trip still plans.
  }
}

function saveDisk(): void {
  if (!persistPath) return;
  try {
    const fs = require("node:fs") as typeof import("node:fs");
    const path = require("node:path") as typeof import("node:path");
    fs.mkdirSync(path.dirname(persistPath), { recursive: true });
    const books = [...registry.values()].filter((book) => book.origin === "generated");
    fs.writeFileSync(persistPath, JSON.stringify({ schemaVersion: PLAYBOOK_SCHEMA_VERSION, books }));
  } catch {
    // Persistence is a cache, not a requirement.
  }
}

export function listPlaybooks(): TravelPlaybook[] {
  warm();
  return [...registry.values()];
}

export function registryRow(book: TravelPlaybook): RegistryRow {
  return {
    destinationId: book.id,
    destinationName: book.destinationName,
    destinationScope: book.scope,
    status: book.status ?? "CURATED",
    confidence: book.confidence,
    version: book.playbookVersion ?? 1,
    sourceCount: book.references.length,
    sourceDiversity: guardSourceCoverage(book.references, book.sourceCoverage),
    createdAt: book.createdAt ?? book.lastUpdated,
    lastVerified: book.lastVerified ?? book.lastUpdated,
    nextReviewAt: book.nextReviewAt ?? addDays(book.lastVerified ?? book.lastUpdated, 180),
    parentId: book.parentId || book.parentCountry,
  };
}

export function listPlaybookCoverage(): string {
  const header = "Destination | Scope | Status | Confidence | Sources | Verified";
  const lines = listPlaybooks()
    .map(registryRow)
    .sort((a, b) => a.destinationName.localeCompare(b.destinationName))
    .map((row) => `${row.destinationName} | ${row.destinationScope} | ${row.status} | ${row.confidence} | ${row.sourceCount} | ${row.lastVerified}`);
  return [header, ...lines].join("\n");
}

export function playbookChildren(id: string): TravelPlaybook[] {
  return listPlaybooks().filter((book) => (book.parentId || book.parentCountry) === id);
}

export function forgetPlaybook(idOrName: string): void {
  warm();
  const exact = findExact(idOrName);
  if (!exact || exact.origin === "curated") return;
  registry.delete(exact.id);
  saveDisk();
}

function findExact(name: string): TravelPlaybook | undefined {
  const text = name.trim().toLowerCase();
  const slug = playbookSlug(name);
  return [...registry.values()].find((book) => book.id === slug || book.destinationName.toLowerCase() === text || book.aliases.some((alias) => alias.toLowerCase() === text));
}

export function validatePlaybook(book: TravelPlaybook): { ok: boolean; warnings: string[] } {
  const warnings: string[] = [];
  if (!book.nodes.length || !book.bands.length) return { ok: false, warnings: ["Playbook has no route."] };
  const ids = new Set(book.nodes.map((node) => node.id));
  for (const band of book.bands) {
    if (!band.days.length) warnings.push(`${band.label} has no days.`);
    for (const day of band.days) {
      if (!ids.has(day.node) || !ids.has(day.stay)) return { ok: false, warnings: [`${band.label} points at a missing place.`] };
    }
  }
  for (const node of book.nodes) {
    if (!Number.isFinite(node.latitude) || !Number.isFinite(node.longitude)) return { ok: false, warnings: [`${node.name} has no coordinates.`] };
  }
  if (book.nodes.length === 1 && (book.scope === "country" || book.scope === "road" || book.scope === "region")) {
    warnings.push("Only a single base was available, so this stays provisional.");
  }
  if (!book.nodes.some((node) => node.experienceGroups.length)) warnings.push("No experience groups were found.");
  return { ok: true, warnings };
}

function confidenceFor(book: TravelPlaybook, provisional: boolean): PlaybookConfidence {
  const coverage = guardSourceCoverage(book.references, book.sourceCoverage);
  if (coverage === "GEOGRAPHY_ONLY") return "low";
  if (provisional && book.nodes.length < 3) return "low";
  if (!provisional && coverage === "MULTI_OPERATOR_CONSENSUS") return "high";
  const agreed = consensusFrom(book.references).nodes.filter((node) => node.sources >= 2 && node.sourceTypes.length >= 2);
  if (!provisional && coverage === "MULTI_SOURCE" && agreed.length >= 2 && book.nodes.length >= 3) return "high";
  if (book.nodes.length >= 3) return "medium";
  return "low";
}

function finish(book: TravelPlaybook, status: PlaybookStatus, warnings: string[], previousVersion = 0): TravelPlaybook | null {
  const checked = validatePlaybook(book);
  if (!checked.ok) {
    return null;
  }
  const merged = [...warnings, ...checked.warnings];
  const provisional = status === "PROVISIONAL" || merged.some((warning) => /provisional/i.test(warning));
  const next: TravelPlaybook = {
    ...book,
    origin: "generated",
    status: provisional ? "PROVISIONAL" : status,
    sourceCoverage: guardSourceCoverage(book.references, book.sourceCoverage),
    confidence: confidenceFor({ ...book, sourceCoverage: guardSourceCoverage(book.references, book.sourceCoverage) }, provisional),
    playbookVersion: previousVersion + 1,
    schemaVersion: PLAYBOOK_SCHEMA_VERSION,
    warnings: merged,
    createdAt: registry.get(book.id)?.createdAt ?? today(),
    lastVerified: today(),
    nextReviewAt: addDays(today(), 180),
    lastUpdated: today(),
    sourceSnapshot: book.references.map((ref) => ({ id: ref.id, name: ref.sourceName, sourceType: ref.sourceType, sourceUrl: ref.sourceUrl })),
  };
  if (next.sourceCoverage === "MULTI_OPERATOR_CONSENSUS" && !next.references.some((ref) => ref.sourceType === "operator")) {
    next.sourceCoverage = guardSourceCoverage(next.references);
    next.warnings = [...(next.warnings ?? []), "Operator consensus was removed because no operator source was present."];
    next.confidence = confidenceFor(next, next.status === "PROVISIONAL");
  }
  registry.set(next.id, next);
  saveDisk();
  return next;
}

async function readSources(name: string): Promise<GuideExtract> {
  const warnings: string[] = [];
  const pieces: GuideExtract[] = [];
  const operator = readers.operators ?? (async () => null);
  const guides = readers.openGuides ?? (network ? fetchOpenGuides : async () => null);
  try {
    const got = await operator(name);
    if (got) pieces.push(got);
  } catch {
    warnings.push("An itinerary source was unavailable. Remaining sources were used.");
  }
  try {
    const got = await guides(name);
    if (got) pieces.push(got);
  } catch {
    warnings.push("An open-guide source was unavailable. Remaining sources were used.");
  }
  return {
    areas: pieces.flatMap((piece) => piece.areas),
    sources: pieces.flatMap((piece) => piece.sources),
    warnings,
  };
}

export async function ensureTravelPlaybook(destination: string, hint: GeoHint = {}): Promise<TravelPlaybook | null> {
  warm();
  const asked = destination.trim();
  const named = englishAreaName(asked, asked);
  const name = named === "this area" ? asked : named;
  if (!name) return null;
  const existing = findExact(name);
  if (existing?.origin === "curated" && !findStarterFact(name)) return existing;
  if (existing && !hint.refresh) return existing;
  const previousVersion = existing?.playbookVersion ?? 0;
  if (existing && existing.origin !== "curated") registry.delete(existing.id);
  builds += 1;
  const fact = findStarterFact(name);
  if (fact) {
    const extra = await readSources(name);
    const book = playbookFromFact(fact, extra.warnings ?? []);
    if (extra.sources.length) {
      const seen = new Set(book.references.map((ref) => ref.sourceUrl));
      for (const source of extra.sources) {
        if (seen.has(source.sourceUrl)) continue;
        book.references.push(toReference(fact.id, book.references.length, source));
      }
    }
    book.sourceCoverage = guardSourceCoverage(book.references);
    const stored = finish(book, "GENERATED", extra.warnings ?? [], previousVersion);
    if (stored) return stored;
  }
  const derived = derive(name);
  if (derived) {
    const stored = finish(derived, "GENERATED", derived.warnings ?? [], previousVersion);
    if (stored) return stored;
  }
  const extracted = await readSources(name);
  if (extracted.areas.length || extracted.sources.length) {
    const book = await playbookFromExtract(name, extracted, hint);
    if (book) {
      const stored = finish(book, "PROVISIONAL", extracted.warnings ?? [], previousVersion);
      if (stored) return stored;
    }
  }
  if (Number.isFinite(hint.latitude) && Number.isFinite(hint.longitude)) {
    const stored = finish(geographyPlaybook(name, hint), "PROVISIONAL", ["No guide structure was available. The plan uses the resolved centre only."], previousVersion);
    if (stored) return stored;
  }
  builds -= 1;
  return null;
}

export async function buildPlaybook(destination: string, hint: GeoHint = {}): Promise<{ book: TravelPlaybook | null; sheet: string; built: boolean }> {
  warm();
  const existing = findExact(destination);
  if (existing?.origin === "curated" && !findStarterFact(destination)) {
    return { book: existing, sheet: describePlaybook(existing.id, listPlaybooks()), built: false };
  }
  const before = builds;
  const book = await ensureTravelPlaybook(destination, { ...hint, refresh: true });
  return { book, sheet: book ? describePlaybook(book.id, listPlaybooks()) : "", built: builds > before };
}

export function bootstrapPopularPlaybooks(limit = 40): { built: string[]; failed: string[] } {
  warm();
  const built: string[] = [];
  const failed: string[] = [];
  for (const fact of STARTER_FACTS) {
    if (built.length >= limit) break;
    if (registry.has(fact.id)) continue;
    builds += 1;
    const book = playbookFromFact(fact);
    book.sourceCoverage = guardSourceCoverage(book.references);
    const stored = finish(book, "GENERATED", []);
    if (stored) built.push(stored.id);
    else failed.push(fact.id);
  }
  return { built, failed };
}

export async function playbooksForPlanning(destination: string, hint: GeoHint = {}): Promise<TravelPlaybook[]> {
  const parts = destination.split(/\s*(?:,|\+)\s*/).map((part) => part.trim()).filter(Boolean);
  const targets = parts.length > 1 ? parts : [destination];
  for (const target of targets) {
    try {
      await ensureTravelPlaybook(target, hint);
      ensureDestinationKnowledge(target);
    } catch {
      // One failed destination does not block the others or the fallback planner.
    }
  }
  return listPlaybooks();
}

function derive(name: string): TravelPlaybook | null {
  const needle = name.trim().toLowerCase();
  const slug = playbookSlug(name);
  const parents = [...registry.values()]
    .filter((book) => book.nodes.some((node) => node.name.toLowerCase() === needle || node.id === slug))
    .sort((a, b) => scopeRank(a.scope) - scopeRank(b.scope));
  for (const parent of parents) {
    if (parent.destinationName.toLowerCase() === needle || parent.aliases.some((alias) => alias.toLowerCase() === needle)) continue;
    const node = parent.nodes.find((item) => item.name.toLowerCase() === needle || item.id === slug);
    if (!node || node.kind === "country") continue;
    const keep = new Set<string>([node.id]);
    for (const edge of parent.edges) {
      if (edge.from !== node.id) continue;
      const other = parent.nodes.find((item) => item.id === edge.to);
      if (!other) continue;
      const km = distanceMeters(node.latitude, node.longitude, other.latitude, other.longitude) / 1000;
      if (edge.relation === "day-trip" || (edge.relation === "excursion" && km <= 180) || (edge.relation === "follows" && km <= 90)) keep.add(other.id);
    }
    const nodes = parent.nodes.filter((item) => keep.has(item.id));
    const days: DayTemplate[] = [
      { node: node.id, stay: node.id, role: "arrival", title: node.name, groups: node.experienceGroups.length ? [...node.experienceGroups] : ["heritage"] },
    ];
    for (const other of nodes) {
      if (other.id === node.id) continue;
      days.push({ node: other.id, stay: node.id, role: "day-trip", title: other.name, groups: [...other.experienceGroups], optional: days.length > 3 });
    }
    while (days.length < 3) {
      days.push({ node: node.id, stay: node.id, role: "neighbourhood", title: `Neighbourhoods · ${node.name}`, groups: ["neighbourhood"], optional: true });
    }
    const book: TravelPlaybook = {
      id: slug,
      destinationName: node.name,
      aliases: [needle, slug.replace(/-/g, " ")],
      scope: node.kind === "town" || node.kind === "city" ? "city" : node.kind === "island" ? "island" : node.kind === "nature" ? "nature" : "region",
      parentCountry: parent.id,
      parentId: parent.id,
      longitude: node.longitude,
      nodes,
      edges: parent.edges.filter((edge) => keep.has(edge.from) && keep.has(edge.to)),
      bands: [
        { id: "taste", label: "Short stay", minNights: 2, maxNights: 4, firstVisit: true, days: days.slice(0, 3) },
        { id: "classic", label: "Classic first visit", minNights: 5, maxNights: 8, firstVisit: true, days },
        { id: "longer", label: "Slower stay", minNights: 9, maxNights: 14, firstVisit: true, days },
      ],
      references: parent.references,
      confidence: "medium",
      lastUpdated: today(),
      origin: "generated",
      sourceCoverage: guardSourceCoverage(parent.references),
      cultureNode: nodes.find((item) => item.experienceGroups.includes("heritage"))?.id,
      natureNode: nodes.find((item) => item.experienceGroups.includes("nature"))?.id,
      foodNode: nodes.find((item) => item.experienceGroups.includes("food"))?.id,
      warnings: [`${node.name} is taken from the ${parent.destinationName} playbook. It is not a separately researched country route.`],
    };
    return book;
  }
  return null;
}

async function playbookFromExtract(name: string, extract: GuideExtract, hint: GeoHint): Promise<TravelPlaybook | null> {
  const located: { name: string; section: GuideArea["section"]; latitude: number; longitude: number }[] = [];
  for (const area of uniqueAreas(extract.areas).slice(0, 6)) {
    if (located.length >= 4) break;
    const point = await locateArea(area.name);
    if (!point) continue;
    located.push({ ...area, ...point });
  }
  const centre = Number.isFinite(hint.latitude) && Number.isFinite(hint.longitude)
    ? { latitude: hint.latitude as number, longitude: hint.longitude as number }
    : located[0];
  if (!centre) return null;
  const id = playbookSlug(name);
  const country = (hint.countryCode || "").toUpperCase();
  const areas = located.length ? located : [{ name, section: "city" as const, latitude: centre.latitude, longitude: centre.longitude }];
  const fact: DestinationFact = {
    id,
    name,
    aliases: [name.toLowerCase(), id.replace(/-/g, " ")],
    scope: hint.scope ?? (areas.length > 2 ? "region" : "city"),
    countryCode: country,
    areas: areas.map((area, index) => {
      const km = index === 0 ? 0 : distanceMeters(centre.latitude, centre.longitude, area.latitude, area.longitude) / 1000;
      const role = index === 0 ? "base" as const : area.section === "day-trip" || km < 90 ? "day-trip" as const : km < 400 ? "transfer" as const : "excursion" as const;
      return {
        id: playbookSlug(area.name) || `${id}-${index}`,
        name: area.name,
        kind: area.section === "region" ? "region" as const : area.section === "other" ? "nature" as const : "city" as const,
        lat: area.latitude,
        lng: area.longitude,
        role,
        groups: area.section === "region" || area.section === "other" ? ["nature"] : ["heritage"],
        hints: [area.name],
        radiusKm: role === "base" ? 14 : 12,
      };
    }),
    sources: extract.sources.length ? extract.sources : [{
      name: "Open guide",
      sourceType: "wikivoyage",
      sourceUrl: `https://en.wikivoyage.org/wiki/${encodeURIComponent(name.replace(/ /g, "_"))}`,
      stops: areas.map((area) => area.name),
      facts: ["Place names were taken from an open guide. Prose was not stored."],
    }],
  };
  const book = playbookFromFact(fact, extract.warnings ?? []);
  book.id = id;
  book.destinationName = name;
  book.sourceCoverage = guardSourceCoverage(book.references);
  return book;
}

function geographyPlaybook(name: string, hint: GeoHint): TravelPlaybook {
  const id = playbookSlug(name);
  const fact: DestinationFact = {
    id,
    name,
    aliases: [name.toLowerCase()],
    scope: hint.scope ?? "region",
    countryCode: (hint.countryCode || "").toUpperCase(),
    areas: [{
      id,
      name,
      kind: hint.scope === "city" ? "city" : "region",
      lat: hint.latitude as number,
      lng: hint.longitude as number,
      role: "base",
      groups: ["landmark"],
      hints: [name],
    }],
    sources: [],
  };
  const book = playbookFromFact(fact, ["No operator or open-guide route was available."]);
  book.sourceCoverage = "GEOGRAPHY_ONLY";
  book.references = [];
  return book;
}

function toReference(id: string, index: number, source: GuideExtract["sources"][number]): ReferenceItinerary {
  return {
    id: `${id}-extra-${index}`,
    sourceName: source.name,
    sourceType: source.sourceType,
    sourceUrl: source.sourceUrl,
    destinationScope: id,
    title: "Structural route signals",
    nights: 5,
    routeNodes: source.stops.map((stop) => ({ destinationName: stop, destinationType: "city", visitMode: "STAY" })),
    experienceGroups: ["heritage"],
    extractedFacts: source.facts,
    retrievedAt: today(),
  };
}

function uniqueAreas(areas: GuideArea[]): GuideArea[] {
  const seen = new Set<string>();
  const next: GuideArea[] = [];
  for (const area of areas) {
    const key = area.name.trim().toLowerCase();
    if (!key || seen.has(key) || key.length > 60) continue;
    seen.add(key);
    next.push({ name: area.name.trim(), section: area.section });
  }
  return next;
}

async function locateArea(name: string): Promise<{ latitude: number; longitude: number } | null> {
  if (readers.locate) return readers.locate(name);
  if (!network) return null;
  try {
    const url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", name);
    url.searchParams.set("limit", "1");
    const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "KairosTravel/1.0" }, signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    const body = (await res.json()) as { features?: { geometry?: { coordinates?: number[] } }[] };
    const [lng, lat] = body.features?.[0]?.geometry?.coordinates ?? [];
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { latitude: lat as number, longitude: lng as number };
  } catch {
    return null;
  }
}

export function extractVoyageAreas(wikitext: string): GuideArea[] {
  const parts = wikitext.split(/\n(?===+)/);
  const areas: GuideArea[] = [];
  for (const part of parts) {
    const title = part.match(/^==+\s*([^=]+?)\s*==+/)?.[1]?.trim() ?? "";
    if (!/regions|cities|other destinations|day trips|nearby/i.test(title)) continue;
    const section: GuideArea["section"] = /day trip/i.test(title) ? "day-trip" : /region/i.test(title) ? "region" : /cities|city/i.test(title) ? "city" : "other";
    for (const match of part.matchAll(/\[\[([^\]|#:]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g)) {
      const label = (match[2] || match[1] || "").replace(/_/g, " ").trim();
      if (!label || /wikivoyage|category|file|template/i.test(match[1] ?? "")) continue;
      areas.push({ name: label, section });
    }
  }
  return uniqueAreas(areas);
}

async function fetchOpenGuides(name: string): Promise<GuideExtract | null> {
  const url = new URL("https://en.wikivoyage.org/w/api.php");
  url.searchParams.set("action", "parse");
  url.searchParams.set("page", name);
  url.searchParams.set("prop", "wikitext");
  url.searchParams.set("format", "json");
  url.searchParams.set("redirects", "1");
  try {
    const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "KairosTravel/1.0" }, signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    const body = (await res.json()) as { parse?: { wikitext?: { "*"?: string } } };
    const wikitext = body.parse?.wikitext?.["*"] ?? "";
    const areas = extractVoyageAreas(wikitext);
    if (!areas.length) return null;
    return {
      areas,
      sources: [{
        name: `Wikivoyage ${name}`,
        sourceType: "wikivoyage",
        sourceUrl: `https://en.wikivoyage.org/wiki/${name.replace(/ /g, "_")}`,
        stops: areas.slice(0, 8).map((area) => area.name),
        facts: ["Section headings supplied place names only. Page prose was discarded."],
      }],
    };
  } catch {
    return null;
  }
}

function scopeRank(scope: PlaybookScope): number {
  if (scope === "city" || scope === "excursion") return 0;
  if (scope === "region" || scope === "island" || scope === "nature") return 1;
  if (scope === "road") return 2;
  return 3;
}
