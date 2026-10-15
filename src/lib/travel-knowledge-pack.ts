import { GAZETTEER, type GazetteerPlace } from "@/lib/travel-gazetteer";
import { isGenericDayTheme } from "@/lib/travel-names";
import type { PlaybookAnchor, PlaybookDayPattern, PlaybookScope, SourceType, VisitMode } from "@/lib/travel-playbook";

export type KnowledgeScope =
  | "COUNTRY"
  | "CITY"
  | "REGION"
  | "ISLAND"
  | "NATURE_REGION"
  | "ROAD_TRIP_REGION"
  | "ARCHIPELAGO"
  | "EXCURSION_AREA"
  | "ATTRACTION_CLUSTER"
  | "MULTI_DESTINATION_CORRIDOR";

export type KnowledgeStatus = "VERIFIED" | "COMPILED" | "THIN";

export type DestinationKnowledgePack = {
  id: string;
  destinationId: string;
  destinationName: string;
  destinationScope: KnowledgeScope;
  countryCode: string;
  parentDestinationId?: string;
  childDestinationIds: string[];
  playbookIds: string[];
  experienceGroups: string[];
  anchors: PlaybookAnchor[];
  dayPatterns: PlaybookDayPattern[];
  excursionRelationships: { from: string; to: string; relation: "day-trip" | "excursion"; anchorIds: string[] }[];
  baseRelationships: { areaId: string; role: string }[];
  geographicClusters: { id: string; name: string; lat: number; lng: number; anchorIds: string[] }[];
  durationGuidance: { patternId: string; minutes: number }[];
  seasonNotes: string[];
  sourceEvidence: { name: string; sourceType: SourceType; sourceUrl: string }[];
  unresolvedHints: string[];
  status: KnowledgeStatus;
  confidence: "high" | "medium" | "low";
  version: number;
  createdAt: string;
  lastVerified: string;
};

type FactArea = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  role: string;
  groups: string[];
  hints: string[];
  later?: boolean;
};

type FactSource = { name: string; sourceType: SourceType; sourceUrl: string };

export type KnowledgeFact = {
  id: string;
  name: string;
  aliases: string[];
  scope: PlaybookScope;
  parent?: string;
  countryCode: string;
  areas: FactArea[];
  sources: FactSource[];
};

type CuratedPack = {
  id: string;
  aliases: string[];
  anchors: PlaybookAnchor[];
  patterns: PlaybookDayPattern[];
  firstVisitGroups: string[];
};

const cache = new Map<string, DestinationKnowledgePack>();
let facts: KnowledgeFact[] = [];
let curated: CuratedPack[] = [];
let builds = 0;
let persist: ((packs: DestinationKnowledgePack[]) => void) | null = null;

export function setDestinationFacts(rows: KnowledgeFact[]): void {
  facts = rows;
}

export function registerCuratedPacks(packs: CuratedPack[]): void {
  curated = packs;
}

export function knowledgeBuildCount(): number {
  return builds;
}

export function onKnowledgePersist(save: (packs: DestinationKnowledgePack[]) => void): void {
  persist = save;
}

export function exportKnowledgeSnapshot(): DestinationKnowledgePack[] {
  return [...cache.values()].filter((pack) => pack.status !== "VERIFIED");
}

export function importKnowledgeSnapshot(packs: DestinationKnowledgePack[]): void {
  for (const pack of packs) {
    if (!pack?.id || !pack.anchors?.length || cache.has(pack.id)) continue;
    cache.set(pack.id, pack);
  }
}

export function resetKnowledgeForTests(): void {
  cache.clear();
  builds = 0;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function slug(value: string): string {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function scopeOf(scope: PlaybookScope | undefined): KnowledgeScope {
  if (scope === "country") return "COUNTRY";
  if (scope === "region") return "REGION";
  if (scope === "island") return "ISLAND";
  if (scope === "nature") return "NATURE_REGION";
  if (scope === "road") return "ROAD_TRIP_REGION";
  if (scope === "excursion") return "EXCURSION_AREA";
  if (scope === "corridor") return "MULTI_DESTINATION_CORRIDOR";
  return "CITY";
}

function validCoord(lat: number, lng: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  if (Math.abs(lat) < 0.01 && Math.abs(lng) < 0.01) return false;
  return true;
}

function findFact(name: string): KnowledgeFact | undefined {
  const text = name.trim().toLowerCase();
  const id = slug(name);
  return facts.find((fact) => fact.id === id || fact.id === text || fact.name.toLowerCase() === text || fact.aliases.some((alias) => alias.toLowerCase() === text));
}

function findCurated(name: string): CuratedPack | undefined {
  const text = name.trim().toLowerCase();
  const head = text.split(",")[0]?.trim() ?? text;
  const id = slug(head);
  return curated.find((pack) => pack.id === id || pack.id === head || pack.aliases.includes(text) || pack.aliases.includes(head));
}

function childrenOf(id: string): KnowledgeFact[] {
  return facts.filter((fact) => fact.parent === id);
}

function anchorFromGazetteer(place: GazetteerPlace): PlaybookAnchor | null {
  if (!validCoord(place.lat, place.lng)) return null;
  if (!place.name.trim()) return null;
  return {
    id: place.id,
    name: place.name,
    localName: place.localName || place.name,
    lat: place.lat,
    lng: place.lng,
    areaId: place.areaId,
    areaName: place.areaName,
    groups: place.groups,
    tier: place.tier,
    duration: place.duration,
    category: place.category,
    indoor: place.indoor ?? place.category === "museum",
    excursion: place.excursion ?? "none",
    wikidataId: place.wikidataId,
    sources: place.sources ?? ["wikidata", "wikivoyage"],
  };
}

function areaAnchor(area: FactArea, sources: SourceType[]): PlaybookAnchor | null {
  if (!validCoord(area.lat, area.lng)) return null;
  const groups = area.groups.length ? area.groups : ["landmark"];
  const heritage = groups.includes("heritage");
  const nature = groups.includes("nature");
  const food = groups.includes("food");
  const category: PlaybookAnchor["category"] = food ? "market" : nature ? "park" : heritage ? "historic" : "landmark";
  const excursion: PlaybookAnchor["excursion"] = area.role === "day-trip" || area.role === "excursion" ? "full" : "none";
  return {
    id: area.id,
    name: area.name,
    localName: area.name,
    lat: area.lat,
    lng: area.lng,
    areaId: area.id,
    areaName: area.name,
    groups,
    tier: area.role === "day-trip" || area.role === "focus" ? "core" : "strong",
    duration: excursion === "full" ? 150 : 75,
    category,
    indoor: false,
    excursion,
    sources,
  };
}

function patternsFor(destination: string, anchors: PlaybookAnchor[], fact: KnowledgeFact | undefined, evidence: string[]): PlaybookDayPattern[] {
  const areas = new Map<string, PlaybookAnchor[]>();
  for (const anchor of anchors) {
    const list = areas.get(anchor.areaId) ?? [];
    list.push(anchor);
    areas.set(anchor.areaId, list);
  }
  const patterns: PlaybookDayPattern[] = [];
  for (const [areaId, rows] of areas) {
    const meta = fact?.areas.find((area) => area.id === areaId);
    const theme = meta?.name && !isGenericDayTheme(meta.name, destination) ? meta.name : rows[0]?.areaName && !isGenericDayTheme(rows[0].areaName, destination) ? rows[0].areaName : rows[0]?.name ?? "";
    if (!theme || isGenericDayTheme(theme, destination)) continue;
    const mode: VisitMode = meta?.role === "day-trip" ? "DAY_TRIP" : meta?.role === "excursion" || rows.some((row) => row.excursion === "full") ? "EXCURSION" : "STAY";
    const groups = [...new Set(rows.flatMap((row) => row.groups))];
    patterns.push({
      id: `${slug(destination)}-${areaId}`,
      theme,
      areaIds: [areaId],
      requiredGroups: groups.slice(0, 2),
      anchorIds: rows.map((row) => row.id),
      optionalGroups: groups.slice(2),
      visitMode: mode,
      expectedMinutes: rows.reduce((sum, row) => sum + row.duration, 0),
      evidence,
    });
  }
  return patterns;
}

function packShell(input: {
  id: string;
  name: string;
  scope: KnowledgeScope;
  countryCode: string;
  parent?: string;
  anchors: PlaybookAnchor[];
  patterns: PlaybookDayPattern[];
  evidence: DestinationKnowledgePack["sourceEvidence"];
  unresolved: string[];
  status: KnowledgeStatus;
  children?: string[];
  fact?: KnowledgeFact;
}): DestinationKnowledgePack {
  const groups = [...new Set(input.anchors.flatMap((anchor) => anchor.groups))];
  const clusters = new Map<string, DestinationKnowledgePack["geographicClusters"][number]>();
  for (const anchor of input.anchors) {
    const current = clusters.get(anchor.areaId) ?? { id: anchor.areaId, name: anchor.areaName, lat: anchor.lat, lng: anchor.lng, anchorIds: [] };
    current.anchorIds.push(anchor.id);
    clusters.set(anchor.areaId, current);
  }
  const sourceTypes = new Set(input.evidence.map((row) => row.sourceType));
  const confidence = input.status === "VERIFIED" ? "high" : input.anchors.length >= 4 && sourceTypes.size >= 2 ? "high" : input.anchors.length >= 3 ? "medium" : "low";
  const bases = (input.fact?.areas ?? []).filter((area) => area.role === "base").map((area) => ({ areaId: area.id, role: "primary-base" }));
  const excursions = (input.fact?.areas ?? [])
    .filter((area) => area.role === "day-trip" || area.role === "excursion")
    .map((area) => ({
      from: bases[0]?.areaId || input.id,
      to: area.id,
      relation: area.role === "excursion" ? "excursion" as const : "day-trip" as const,
      anchorIds: input.anchors.filter((anchor) => anchor.areaId === area.id).map((anchor) => anchor.id),
    }));
  const stamp = today();
  return {
    id: input.id,
    destinationId: input.id,
    destinationName: input.name,
    destinationScope: input.scope,
    countryCode: input.countryCode,
    parentDestinationId: input.parent,
    childDestinationIds: input.children ?? childrenOf(input.id).map((fact) => fact.id),
    playbookIds: [input.id],
    experienceGroups: groups,
    anchors: input.anchors,
    dayPatterns: input.patterns,
    excursionRelationships: excursions,
    baseRelationships: bases,
    geographicClusters: [...clusters.values()],
    durationGuidance: input.patterns.map((pattern) => ({ patternId: pattern.id, minutes: pattern.expectedMinutes })),
    seasonNotes: [],
    sourceEvidence: input.evidence,
    unresolvedHints: input.unresolved,
    status: input.status,
    confidence,
    version: 1,
    createdAt: stamp,
    lastVerified: stamp,
  };
}

function compileFact(fact: KnowledgeFact): DestinationKnowledgePack {
  const places = GAZETTEER.filter((place) => place.destinationId === fact.id);
  const covered = new Set(places.map((place) => place.areaId));
  const sourceTypes = [...new Set(fact.sources.map((source) => source.sourceType))];
  const anchors: PlaybookAnchor[] = [];
  for (const place of places) {
    const anchor = anchorFromGazetteer(place);
    if (anchor) anchors.push(anchor);
  }
  const unresolved: string[] = [];
  for (const area of fact.areas) {
    if (area.later) continue;
    if (covered.has(area.id)) {
      for (const hint of area.hints) {
        const named = anchors.some((anchor) => anchor.areaId === area.id && anchor.name.toLowerCase().includes(hint.toLowerCase()));
        if (!named && hint.length > 2) unresolved.push(hint);
      }
      continue;
    }
    if (area.name.trim().toLowerCase() === fact.name.trim().toLowerCase()) {
      unresolved.push(...area.hints);
      continue;
    }
    const anchor = areaAnchor(area, sourceTypes.length ? sourceTypes : ["wikivoyage"]);
    if (anchor) anchors.push(anchor);
    else unresolved.push(area.name);
  }
  const evidence = fact.sources.map((source) => ({ name: source.name, sourceType: source.sourceType, sourceUrl: source.sourceUrl }));
  if (places.length) evidence.push({ name: "Open place gazetteer", sourceType: "wikidata", sourceUrl: "https://www.wikidata.org/" });
  const patterns = patternsFor(fact.name, anchors, fact, evidence.map((row) => row.name));
  const status: KnowledgeStatus = anchors.length >= 3 ? "COMPILED" : "THIN";
  return packShell({
    id: fact.id,
    name: fact.name,
    scope: scopeOf(fact.scope),
    countryCode: fact.countryCode,
    parent: fact.parent,
    anchors,
    patterns,
    evidence,
    unresolved: [...new Set(unresolved)].slice(0, 12),
    status,
    fact,
  });
}

function compileCurated(pack: CuratedPack, fact?: KnowledgeFact): DestinationKnowledgePack {
  const evidence = fact?.sources.map((source) => ({ name: source.name, sourceType: source.sourceType, sourceUrl: source.sourceUrl })) ?? [];
  evidence.push({ name: "Verified anchor pack", sourceType: "wikidata", sourceUrl: "https://www.wikidata.org/" });
  return packShell({
    id: pack.id,
    name: fact?.name ?? pack.id,
    scope: scopeOf(fact?.scope ?? "city"),
    countryCode: fact?.countryCode ?? "",
    parent: fact?.parent,
    anchors: pack.anchors,
    patterns: pack.patterns,
    evidence,
    unresolved: [],
    status: "VERIFIED",
    fact,
  });
}

function compileChildren(id: string, name: string): DestinationKnowledgePack | null {
  const kids = childrenOf(id);
  if (!kids.length && !GAZETTEER.some((place) => place.destinationId === id)) return null;
  const anchors: PlaybookAnchor[] = [];
  const seen = new Set<string>();
  for (const child of kids) {
    const pack = ensureDestinationKnowledge(child.name);
    for (const anchor of pack?.anchors ?? []) {
      if (anchor.tier === "optional" || anchor.tier === "niche") continue;
      if (seen.has(anchor.id)) continue;
      seen.add(anchor.id);
      anchors.push(anchor);
    }
  }
  for (const place of GAZETTEER.filter((item) => item.destinationId === id)) {
    const anchor = anchorFromGazetteer(place);
    if (!anchor || seen.has(anchor.id)) continue;
    seen.add(anchor.id);
    anchors.push(anchor);
  }
  if (!anchors.length) return null;
  const fact = findFact(name);
  return packShell({
    id,
    name: fact?.name ?? name,
    scope: fact ? scopeOf(fact.scope) : kids.length ? "COUNTRY" : "REGION",
    countryCode: fact?.countryCode ?? kids[0]?.countryCode ?? "",
    parent: fact?.parent,
    anchors,
    patterns: patternsFor(fact?.name ?? name, anchors, fact, ["Child destination knowledge"]),
    evidence: [{ name: "Composed from regional knowledge", sourceType: "wikivoyage", sourceUrl: "https://en.wikivoyage.org/" }],
    unresolved: [],
    status: anchors.length >= 3 ? "COMPILED" : "THIN",
    children: kids.map((child) => child.id),
    fact,
  });
}

export function buildDestinationAnchorPack(destination: string): DestinationKnowledgePack | null {
  const curatedPack = findCurated(destination);
  if (curatedPack) return compileCurated(curatedPack, findFact(curatedPack.id) ?? findFact(destination));
  const fact = findFact(destination);
  if (fact && (fact.areas.length || GAZETTEER.some((place) => place.destinationId === fact.id))) return compileFact(fact);
  const id = slug(destination);
  if (GAZETTEER.some((place) => place.destinationId === id)) {
    const synthetic: KnowledgeFact = {
      id,
      name: destination.trim(),
      aliases: [id],
      scope: "region",
      countryCode: "",
      areas: [],
      sources: [{ name: "Open place gazetteer", sourceType: "wikidata", sourceUrl: "https://www.wikidata.org/" }],
    };
    return compileFact(synthetic);
  }
  return compileChildren(fact?.id ?? id, fact?.name ?? destination.trim());
}

export function ensureDestinationKnowledge(destination: string): DestinationKnowledgePack | null {
  const key = (findCurated(destination)?.id ?? findFact(destination)?.id ?? slug(destination)).trim();
  if (!key) return null;
  const cached = cache.get(key);
  if (cached) return cached;
  builds += 1;
  const pack = buildDestinationAnchorPack(destination);
  if (!pack) {
    builds -= 1;
    return null;
  }
  cache.set(pack.id, pack);
  persist?.(exportKnowledgeSnapshot());
  return pack;
}

export function knowledgeAnchors(destination: string): PlaybookAnchor[] {
  return ensureDestinationKnowledge(destination)?.anchors ?? [];
}

export function knowledgePatterns(destination: string): PlaybookDayPattern[] {
  return ensureDestinationKnowledge(destination)?.dayPatterns ?? [];
}

export function listKnowledgePacks(): DestinationKnowledgePack[] {
  return [...cache.values()];
}
