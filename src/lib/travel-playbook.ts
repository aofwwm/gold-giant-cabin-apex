import { distanceMeters } from "@/lib/coord";
import { explicitChildAges, type TravelBalance, type TravelInterest, type TravelPace, type TravelStyle } from "@/lib/travel";
import { attachExperience } from "@/lib/travel-anchors";
import { cleanTheme, englishAreaName, isGenericDayTheme } from "@/lib/travel-names";
import { PLAYBOOKS } from "@/lib/travel-playbooks";

export type VisitMode = "STAY" | "DAY_TRIP" | "EXCURSION" | "PASS_THROUGH";
export type NodeKind = "country" | "region" | "city" | "town" | "nature" | "corridor" | "island" | "excursion";
export type Signal = "core" | "common" | "optional" | "niche";
export type PlaybookConfidence = "high" | "medium" | "low";
export type SourceType = "operator" | "tourism-board" | "wikivoyage" | "wikipedia" | "wikidata" | "openstreetmap";
export type PlaybookScope = "city" | "country" | "road" | "region" | "island" | "nature" | "excursion" | "corridor";
export type PlaybookStatus = "CURATED" | "GENERATED" | "PROVISIONAL" | "STALE" | "BUILDING" | "FAILED";
export type SourceCoverage = "OPEN_GUIDE_ONLY" | "MULTI_SOURCE" | "MULTI_OPERATOR_CONSENSUS" | "GEOGRAPHY_ONLY";
export type DayRole = "arrival" | "icons" | "neighbourhood" | "day-trip" | "nature" | "food" | "family" | "regional" | "heritage" | "departure";

export type PlaybookNode = {
  id: string;
  name: string;
  kind: NodeKind;
  latitude: number;
  longitude: number;
  countryCode: string;
  experienceGroups: string[];
  hints: string[];
  radiusKm?: number;
};

export type AnchorTier = "core" | "strong" | "optional" | "niche";

/** A verified place that belongs to a day pattern. Coordinates and groups only. No guide prose. */
export type PlaybookAnchor = {
  id: string;
  name: string;
  localName: string;
  lat: number;
  lng: number;
  areaId: string;
  areaName: string;
  groups: string[];
  tier: AnchorTier;
  duration: number;
  category: "attraction" | "museum" | "park" | "garden" | "viewpoint" | "landmark" | "historic" | "theme_park" | "zoo" | "aquarium" | "shopping" | "market";
  indoor: boolean;
  excursion: "none" | "half" | "full";
  wikidataId?: string;
  sources: SourceType[];
};

export type PlaybookDayPattern = {
  id: string;
  theme: string;
  areaIds: string[];
  requiredGroups: string[];
  anchorIds: string[];
  optionalGroups: string[];
  visitMode: VisitMode;
  expectedMinutes: number;
  mealContext?: string;
  evidence: string[];
};

export type PlaybookEdge = {
  from: string;
  to: string;
  relation: "follows" | "day-trip" | "excursion" | "transfer";
  signal: Signal;
};

export type DayTemplate = {
  node: string;
  stay: string;
  role: DayRole;
  title: string;
  groups: string[];
  optional?: boolean;
};

export type DurationBand = {
  id: string;
  label: string;
  minNights: number;
  maxNights: number;
  firstVisit: boolean;
  days: DayTemplate[];
  /** Named only. Not scheduled into the first week. */
  later?: string[];
};

export type ReferenceStop = {
  destinationName: string;
  destinationType: NodeKind;
  visitMode: VisitMode;
  nights?: number;
};

export type ReferenceItinerary = {
  id: string;
  sourceName: string;
  sourceType: SourceType;
  sourceUrl: string;
  destinationScope: string;
  title: string;
  nights: number;
  routeNodes: ReferenceStop[];
  experienceGroups: string[];
  extractedFacts: string[];
  retrievedAt: string;
};

export type TravelPlaybook = {
  id: string;
  destinationName: string;
  aliases: string[];
  scope: PlaybookScope;
  parentCountry?: string;
  longitude: number;
  nodes: PlaybookNode[];
  edges: PlaybookEdge[];
  bands: DurationBand[];
  references: ReferenceItinerary[];
  confidence: PlaybookConfidence;
  lastUpdated: string;
  cultureNode?: string;
  natureNode?: string;
  cityNode?: string;
  familyNode?: string;
  foodNode?: string;
  /** Set on playbooks built by the registry. Curated seeds leave this empty. */
  origin?: "curated" | "generated";
  status?: PlaybookStatus;
  sourceCoverage?: SourceCoverage;
  playbookVersion?: number;
  schemaVersion?: number;
  parentId?: string;
  warnings?: string[];
  createdAt?: string;
  lastVerified?: string;
  nextReviewAt?: string;
  /** Source names and types at the time this version was saved. Not prose. */
  sourceSnapshot?: { id: string; name: string; sourceType: SourceType; sourceUrl: string }[];
  anchors?: PlaybookAnchor[];
  patterns?: PlaybookDayPattern[];
  /** Experience groups a first visit should still meet after personalisation. */
  firstVisitGroups?: string[];
};

export type ConsensusNode = {
  name: string;
  signal: Signal;
  sources: number;
  sourceTypes: SourceType[];
};

export type ConsensusEdge = {
  from: string;
  to: string;
  relation: "follows" | "day-trip" | "excursion" | "transfer";
  signal: Signal;
  sources: number;
};

export type ConsensusItineraryGraph = {
  nodes: ConsensusNode[];
  edges: ConsensusEdge[];
  experienceGroups: { name: string; signal: Signal }[];
};

export type DayIntent = {
  index: number;
  nodeId: string;
  title: string;
  role: DayRole;
  areaName: string;
  latitude: number;
  longitude: number;
  stayName: string;
  stayLatitude: number;
  stayLongitude: number;
  countryCode: string;
  visitMode: VisitMode;
  groups: string[];
  hints: string[];
  radiusKm: number;
  requiredGroups?: string[];
  anchorIds?: string[];
  patternId?: string;
};

export type TripPlaybookView = {
  id: string;
  title: string;
  visit: string;
  line: string;
  version: string;
  route: string;
  changes: string[];
  confidence: PlaybookConfidence;
  hotelNote: string;
};

export type PlaybookPlan = {
  id: string;
  scope: PlaybookScope | "multi";
  bandId: string;
  confidence: PlaybookConfidence;
  aliases: string[];
  days: DayIntent[];
  view: TripPlaybookView;
};

export type PlaybookInput = {
  destination: string;
  nights: number;
  pace: TravelPace;
  oneBase: boolean;
  interests: TravelInterest[];
  styles?: TravelStyle[];
  balance: TravelBalance;
  firstVisit: boolean;
  childAges: number[];
};

const PLANNED_CAP = 7;

export function consensusFrom(refs: readonly ReferenceItinerary[]): ConsensusItineraryGraph {
  const total = Math.max(1, refs.length);
  const nodes = new Map<string, { types: Set<SourceType>; sources: number; modes: Set<VisitMode> }>();
  const edges = new Map<string, { from: string; to: string; relation: ConsensusEdge["relation"]; sources: number }>();
  const groups = new Map<string, { types: Set<SourceType>; sources: number }>();
  for (const ref of refs) {
    const seen = new Set<string>();
    ref.routeNodes.forEach((stop, index) => {
      const name = stop.destinationName.trim();
      const key = name.toLowerCase();
      const row = nodes.get(key) ?? { types: new Set<SourceType>(), sources: 0, modes: new Set<VisitMode>() };
      if (!seen.has(key)) {
        row.sources += 1;
        seen.add(key);
      }
      row.types.add(ref.sourceType);
      row.modes.add(stop.visitMode);
      nodes.set(key, row);
      const previous = ref.routeNodes[index - 1];
      if (!previous) return;
      const relation: ConsensusEdge["relation"] = stop.visitMode === "DAY_TRIP" ? "day-trip" : stop.visitMode === "EXCURSION" ? "excursion" : "follows";
      const edgeKey = `${previous.destinationName.toLowerCase()}|${key}|${relation}`;
      const edge = edges.get(edgeKey) ?? { from: previous.destinationName, to: name, relation, sources: 0 };
      edge.sources += 1;
      edges.set(edgeKey, edge);
    });
    for (const group of ref.experienceGroups) {
      const row = groups.get(group) ?? { types: new Set<SourceType>(), sources: 0 };
      row.sources += 1;
      row.types.add(ref.sourceType);
      groups.set(group, row);
    }
  }
  const signal = (sources: number, types: number): Signal => {
    if (sources >= 2 && types >= 2 && sources / total >= 0.6) return "core";
    if (sources >= 2 && types >= 2) return "common";
    if (sources >= 2 || (sources === 1 && types === 1 && refs.length === 1)) return "common";
    return sources === 1 ? "optional" : "niche";
  };
  return {
    nodes: [...nodes.entries()].map(([key, row]) => ({
      name: refs.flatMap((ref) => ref.routeNodes).find((stop) => stop.destinationName.toLowerCase() === key)?.destinationName ?? key,
      signal: signal(row.sources, row.types.size),
      sources: row.sources,
      sourceTypes: [...row.types],
    })),
    edges: [...edges.values()].map((edge) => ({ ...edge, signal: edge.sources >= 2 ? "common" : "optional" })),
    experienceGroups: [...groups.entries()].map(([name, row]) => ({ name, signal: signal(row.sources, row.types.size) })),
  };
}

export function selectBand(book: TravelPlaybook, nights: number, firstVisit: boolean): DurationBand {
  const preferred = book.bands.filter((band) => (firstVisit ? band.firstVisit : true));
  const pool = preferred.length ? preferred : book.bands;
  const inside = pool.filter((band) => nights >= band.minNights && nights <= band.maxNights);
  if (inside.length) return [...inside].sort((a, b) => a.minNights - b.minNights)[0] ?? inside[0];
  return [...pool].sort((a, b) => distanceToBand(a, nights) - distanceToBand(b, nights) || a.minNights - b.minNights)[0] ?? book.bands[0];
}

function distanceToBand(band: DurationBand, nights: number): number {
  if (nights < band.minNights) return band.minNights - nights;
  if (nights > band.maxNights) return nights - band.maxNights;
  return 0;
}

function mentions(text: string, alias: string): boolean {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i").test(text);
}

export function matchPlaybooks(destination: string, books: readonly TravelPlaybook[] = PLAYBOOKS): TravelPlaybook[] {
  const text = destination.toLowerCase();
  const hits = books.filter((book) => book.aliases.some((alias) => mentions(text, alias)));
  const ranked = hits.map((book) => ({
    book,
    length: Math.max(...book.aliases.filter((alias) => mentions(text, alias)).map((alias) => alias.length)),
  }));
  const specific = ranked.filter((row) => !ranked.some((other) => other.book !== row.book && other.length > row.length && other.book.aliases.some((alias) => mentions(text, alias) && alias.toLowerCase().includes(row.book.aliases.find((item) => mentions(text, item))?.toLowerCase() ?? "\n"))));
  const chosen = specific.map((row) => row.book);
  const focused = chosen.filter((book) => book.scope === "city" || book.scope === "region" || book.scope === "island" || book.scope === "nature" || book.scope === "excursion");
  if (focused.length === 1) {
    const city = focused[0];
    return chosen.filter((book) => book === city || (book.scope !== "country" && book.scope !== "road" && book.scope !== "corridor") || book.id !== (city.parentId || city.parentCountry));
  }
  return chosen;
}

export function adaptPlaybook(input: PlaybookInput, books: readonly TravelPlaybook[] = PLAYBOOKS): PlaybookPlan | null {
  const destination = englishAreaName(input.destination, input.destination);
  const hits = matchPlaybooks(destination === "this area" ? input.destination : destination, books);
  const countries = hits.filter((book) => book.scope === "country" || book.scope === "road");
  if (countries.length >= 2 && !hits.some((book) => book.scope === "city")) return stitch(countries, input);
  const book = hits.find((item) => item.scope === "city") ?? hits[0];
  if (!book) return null;
  return adaptOne(book, input);
}

function adaptOne(raw: TravelPlaybook, input: PlaybookInput): PlaybookPlan {
  const book = attachExperience(raw);
  const nights = Math.max(1, input.nights);
  const count = Math.min(PLANNED_CAP, nights);
  const band = selectBand(book, nights, input.firstVisit);
  let days = fitDays(band.days, count);
  const changes: string[] = [];
  const multiBase = book.scope === "road" || book.scope === "nature" || book.scope === "corridor";
  const maxChanges = multiBase ? 2 : nights >= 9 ? 2 : input.oneBase ? 1 : 2;
  const collapsed = collapseStays(days, maxChanges);
  days = collapsed.days;
  if (collapsed.names.length) {
    const labels = collapsed.names.map((id) => book.nodes.find((node) => node.id === id)?.name ?? id);
    changes.push(`− Avoided an extra hotel change. ${labels.join(" and ")} ${labels.length === 1 ? "is a day trip" : "are day trips"}.`);
  }
  days = personalise(book, days, input, changes);
  if (input.pace === "relaxed" || (input.styles ?? []).includes("slow")) changes.push("+ Fewer stops each day");
  if (input.pace === "full") changes.push("+ Fuller days");
  if (band.later?.length && nights > band.maxNights) changes.push(`+ ${band.later.join(" and ")} can wait for a later night. Not squeezed into this week.`);
  if (!input.firstVisit) changes.push("+ Icons stepped back on a return visit");
  const intents = days.map((day, index) => toIntent(book, day, index));
  const view = viewFor(book, band, input, intents, changes);
  return {
    id: book.id,
    scope: book.scope,
    bandId: band.id,
    confidence: book.confidence,
    aliases: book.aliases,
    days: intents,
    view,
  };
}

function stitch(books: TravelPlaybook[], input: PlaybookInput): PlaybookPlan {
  const ordered = [...books].sort((a, b) => a.longitude - b.longitude);
  const count = Math.min(PLANNED_CAP, Math.max(1, input.nights));
  const weights = ordered.map((_, index) => (index === 0 ? 3 : 2));
  const share = splitCount(count, weights);
  const days: DayIntent[] = [];
  ordered.forEach((book, index) => {
    const band = selectBand(book, Math.max(book.bands[0]?.minNights ?? 4, share[index] ?? 1), true);
    const slice = fitDays(band.days, Math.max(1, share[index] ?? 1));
    for (const day of slice) days.push(toIntent(book, day, days.length));
  });
  const names = ordered.map((book) => book.destinationName);
  const changes = [`+ ${names.join(" → ")} runs as one route, not three separate city lists.`];
  if (explicitChildAges(input.childAges).length) changes.push("+ A day is aimed at the children on this trip");
  const view: TripPlaybookView = {
    id: ordered.map((book) => book.id).join("+"),
    title: "Kairos Classic",
    visit: input.firstVisit ? "First visit" : "Return visit",
    line: `A practical way through ${names.join(", ")} for ${input.nights} nights, then adapted to you.`,
    version: versionLine(input),
    route: routeLine(days),
    changes: changes.slice(0, 5),
    confidence: "medium",
    hotelNote: hotelNote(days),
  };
  return { id: view.id, scope: "multi", bandId: "multi", confidence: "medium", aliases: [], days, view };
}

function splitCount(total: number, weights: number[]): number[] {
  const sum = weights.reduce((totalWeight, weight) => totalWeight + weight, 0) || 1;
  const raw = weights.map((weight) => Math.max(1, Math.round((total * weight) / sum)));
  while (raw.reduce((totalCount, value) => totalCount + value, 0) > total) {
    const index = raw.indexOf(Math.max(...raw));
    if ((raw[index] ?? 1) <= 1) break;
    raw[index] -= 1;
  }
  while (raw.reduce((totalCount, value) => totalCount + value, 0) < total) raw[raw.length - 1] += 1;
  return raw;
}

const EXTRA_THEMES = ["Historic streets", "Neighbourhoods", "Landmarks", "Markets and streets"];

function bareTitle(title: string): string {
  return cleanTheme(title, title);
}

function fitDays(pattern: DayTemplate[], count: number): DayTemplate[] {
  const next = pattern.map((day) => ({ ...day, groups: [...day.groups], title: bareTitle(day.title) }));
  while (next.length > count && next.length > 1) {
    let drop = -1;
    for (let index = next.length - 1; index >= 0; index -= 1) {
      if (next[index]?.optional) {
        drop = index;
        break;
      }
    }
    next.splice(drop >= 0 ? drop : next.length - 1, 1);
  }
  while (next.length < count) {
    const home = [...next].reverse().find((day) => day.node === day.stay) ?? next[next.length - 1];
    if (!home) break;
    const original = next.find((day) => day.node === home.node && day.role !== "neighbourhood") ?? home;
    const base = bareTitle(original.title);
    const used = next.filter((day) => day.node === home.node && day.role === "neighbourhood").length;
    const angle = EXTRA_THEMES[used % EXTRA_THEMES.length] ?? "The city";
    let title = `${angle} · ${base}`;
    if (next.some((day) => day.title === title)) title = `${angle} ${used + 2} · ${base}`;
    next.push({ ...home, role: "neighbourhood", title, groups: [...new Set([...home.groups, "neighbourhood"])], optional: true });
  }
  return next;
}

function collapseStays(days: DayTemplate[], maxChanges: number): { days: DayTemplate[]; names: string[] } {
  const next = days.map((day) => ({ ...day }));
  const names: string[] = [];
  const changes = () => next.reduce((count, day, index) => count + (index > 0 && day.stay !== next[index - 1]?.stay ? 1 : 0), 0);
  while (changes() > maxChanges) {
    const order: string[] = [];
    for (const day of next) if (!order.includes(day.stay)) order.push(day.stay);
    const drop = order[order.length - 1];
    const previous = order[order.length - 2];
    if (!drop || !previous) break;
    for (const day of next) {
      if (day.stay !== drop) continue;
      day.stay = previous;
      if (day.node === drop) day.role = day.role === "food" ? "food" : "day-trip";
    }
    names.push(drop);
  }
  return { days: next, names };
}

function personalise(book: TravelPlaybook, days: DayTemplate[], input: PlaybookInput, changes: string[]): DayTemplate[] {
  const next = days.map((day) => ({ ...day, groups: [...day.groups] }));
  const children = explicitChildAges(input.childAges).length > 0;
  const culture = (input.styles ?? []).includes("culture");
  const food = input.interests.includes("food");
  const nature = input.balance === "nature" || input.interests.includes("nature");
  const city = input.balance === "city";
  if (culture && book.cultureNode && !next.some((day) => day.node === book.cultureNode)) {
    const slot = lastWhere(next, (day) => day.node !== book.cultureNode && day.role !== "icons" && day.role !== "heritage" && day.role !== "nature" && day.role !== "food" && day.role !== "family" && day.role !== "arrival");
    const node = book.nodes.find((item) => item.id === book.cultureNode);
    if (node && slot >= 0) {
      const stay = next[slot]?.stay ?? node.id;
      next[slot] = { node: node.id, stay, role: "day-trip", title: node.name, groups: ["heritage"], optional: false };
      changes.push(`+ Added ${node.name} for the culture focus`);
    }
  }
  if (nature && !city && book.natureNode) {
    const same = next.filter((day) => day.node === book.natureNode);
    const other = book.nodes.find((node) => node.id !== book.natureNode && node.experienceGroups.includes("nature") && !next.some((day) => day.node === node.id));
    if (!same.length) {
      const node = book.nodes.find((item) => item.id === book.natureNode);
      const slot = lastWhere(next, (day) => day.node !== book.natureNode && (day.role === "neighbourhood" || day.role === "food" || day.role === "departure" || day.role === "day-trip"));
      if (node && slot >= 0 && next[slot]) {
        const home = nearestStayId(book, next, node.id) ?? next[slot].stay;
        const entry: DayTemplate = { node: node.id, stay: home, role: "nature", title: node.name, groups: ["nature"], optional: false };
        const originalStay = next[slot].stay;
        if (home !== originalStay) {
          next.splice(slot, 1);
          const at = lastWhere(next, (day) => day.stay === home);
          next.splice(Math.max(0, at + 1), 0, entry);
        } else next[slot] = entry;
        changes.push(`+ ${node.name} for the outdoor time`);
        changes.push("− Less repetitive city time");
      }
    } else if (other) {
      const slot = lastWhere(next, (day) => day.node !== other.id && day.node !== book.natureNode && (day.role === "neighbourhood" || day.role === "food" || day.role === "departure" || day.role === "day-trip"));
      if (slot >= 0 && next[slot] && next[slot].role !== "day-trip") {
        const home = nearestStayId(book, next, other.id) ?? next[slot].stay;
        next[slot] = { node: other.id, stay: home, role: "nature", title: other.name, groups: ["nature"], optional: false };
        changes.push(`+ ${other.name} adds a different outdoor day`);
      } else {
        const city = next.find((day) => day.node !== book.natureNode && !day.groups.includes("nature"));
        if (city) {
          city.groups = [...new Set([...city.groups, "nature"])];
          changes.push("+ Outdoor time inside another day, not a second copy of the same excursion");
        }
      }
    } else {
      const slot = next.find((day) => day.node !== book.natureNode && !day.groups.includes("nature") && (day.role === "neighbourhood" || day.role === "icons" || day.role === "heritage"));
      if (slot) {
        slot.groups = [...new Set([...slot.groups, "nature"])];
        changes.push("+ Gardens and outdoor time inside the city days");
      }
    }
  }
  if (city && book.cityNode) {
    const slot = next.findIndex((day) => day.role === "nature");
    const node = book.nodes.find((item) => item.id === book.cityNode);
    if (node && slot >= 0) {
      next[slot] = { node: node.id, stay: next[slot]?.stay ?? node.id, role: "day-trip", title: node.name, groups: ["heritage"], optional: false };
      changes.push(`+ ${node.name} as a full day trip`);
      changes.push("− A far nature day is off this city-heavy trip");
    }
  }
  if (culture) {
    let stamped = false;
    for (const day of next) {
      if (day.role === "nature" || day.role === "food" || day.role === "family") continue;
      if (!day.groups.includes("heritage")) {
        day.groups = [...day.groups, "heritage"];
        stamped = true;
      }
    }
    if (stamped) changes.push("+ Historic places weigh more inside the same areas");
  }
  if (food) {
    const node = book.foodNode ? book.nodes.find((item) => item.id === book.foodNode) : undefined;
    const slot = node ? next.findIndex((day) => day.node === node.id) : lastWhere(next, (day) => day.role !== "nature" && day.role !== "family");
    if (slot >= 0 && next[slot] && next[slot].role !== "food") {
      const current = next[slot].title;
      const foodTitle = node && isGenericDayTheme(current, book.destinationName) && node.name.toLowerCase() !== book.destinationName.toLowerCase()
        ? `Food in ${node.name}`
        : current;
      next[slot] = { ...next[slot], role: "food", groups: [...new Set([...next[slot].groups, "food"])], title: foodTitle };
      changes.push("+ A market or food district stays inside the route");
    }
  }
  if (children) {
    const ages = explicitChildAges(input.childAges);
    const youngest = ages.length ? Math.min(...ages) : 12;
    let touched = 0;
    for (const day of next) {
      if (touched >= 2) break;
      if (day.role === "nature" || day.role === "departure") continue;
      if (day.role === "icons") continue;
      day.groups = [...new Set([...day.groups, "family"])];
      touched += 1;
    }
    if (touched) {
      const how = youngest <= 5 ? "shorter walks and hands-on stops" : youngest <= 8 ? "interactive stops" : "age-suitable stops";
      changes.push(`+ Days stay on the route, with ${how} for the children on this trip`);
    }
  }
  if (!input.firstVisit) {
    const slot = next.findIndex((day) => day.role === "icons");
    if (slot >= 0 && next[slot]) next[slot] = { ...next[slot], role: "neighbourhood", groups: ["neighbourhood"], title: `Local ${nodeName(book, next[slot].node)}` };
  }
  if (input.balance === "balanced" && culture && next.some((day) => day.role === "nature")) changes.push("+ A nature day stays in, because the trip is not city-only");
  return next;
}

function nearestStayId(book: TravelPlaybook, days: DayTemplate[], nodeId: string): string | null {
  const node = book.nodes.find((item) => item.id === nodeId);
  if (!node) return null;
  let best: string | null = null;
  let bestMeters = Number.POSITIVE_INFINITY;
  for (const day of days) {
    const stay = book.nodes.find((item) => item.id === day.stay);
    if (!stay) continue;
    const meters = distanceMeters(node.latitude, node.longitude, stay.latitude, stay.longitude);
    if (meters < bestMeters) {
      bestMeters = meters;
      best = stay.id;
    }
  }
  return best;
}

function lastWhere(days: DayTemplate[], test: (day: DayTemplate) => boolean): number {
  for (let index = days.length - 1; index >= 0; index -= 1) {
    const day = days[index];
    if (day && test(day)) return index;
  }
  return -1;
}

function nodeName(book: TravelPlaybook, id: string): string {
  return book.nodes.find((node) => node.id === id)?.name ?? id;
}

function toIntent(book: TravelPlaybook, day: DayTemplate, index: number): DayIntent {
  const node = book.nodes.find((item) => item.id === day.node) ?? book.nodes[0];
  const stay = book.nodes.find((item) => item.id === day.stay) ?? node;
  if (!node || !stay) {
    throw new Error(`Playbook ${book.id} is missing a node`);
  }
  const away = distanceMeters(node.latitude, node.longitude, stay.latitude, stay.longitude) > 12000;
  const visitMode: VisitMode = !away ? "STAY" : day.role === "nature" || day.role === "regional" ? "EXCURSION" : "DAY_TRIP";
  const patterns = (book.patterns ?? []).filter((item) => item.areaIds.includes(node.id));
  const pattern = patterns.find((item) => item.theme === day.title)
    ?? patterns.find((item) => item.requiredGroups.every((group) => day.groups.includes(group)) && day.groups.every((group) => item.requiredGroups.includes(group) || item.optionalGroups.includes(group)))
    ?? patterns[0];
  const anchorIds = pattern?.anchorIds ?? (book.anchors ?? []).filter((item) => item.areaId === node.id).map((item) => item.id);
  const anchorNames = (book.anchors ?? []).filter((item) => anchorIds.includes(item.id)).map((item) => item.name);
  const title = pattern && shouldUsePatternTheme(day.title, node.name, book.destinationName, pattern.theme) ? pattern.theme : day.title;
  return {
    index,
    nodeId: node.id,
    title,
    role: day.role,
    areaName: node.name,
    latitude: node.latitude,
    longitude: node.longitude,
    stayName: stay.name,
    stayLatitude: stay.latitude,
    stayLongitude: stay.longitude,
    countryCode: stay.countryCode || node.countryCode,
    visitMode,
    groups: [...new Set([...day.groups, ...(pattern?.requiredGroups ?? [])])],
    hints: [...new Set([...node.hints, ...anchorNames])],
    radiusKm: node.radiusKm ?? (away ? 18 : 14),
    requiredGroups: [...new Set([...(pattern?.requiredGroups ?? day.groups), ...day.groups])],
    anchorIds,
    patternId: pattern?.id,
  };
}

function shouldUsePatternTheme(title: string, nodeName: string, destination: string, patternTheme: string): boolean {
  if (!patternTheme || patternTheme === title) return false;
  if (isGenericDayTheme(title, destination)) return true;
  if (title === nodeName && nodeName.trim().toLowerCase() === destination.trim().toLowerCase()) return true;
  if (title === nodeName && patternTheme !== nodeName) return true;
  return false;
}

function routeLine(days: DayIntent[]): string {
  const stays: string[] = [];
  const trips: string[] = [];
  for (const day of days) {
    if (!stays.includes(day.stayName)) stays.push(day.stayName);
    if (day.visitMode !== "STAY" && !trips.includes(day.areaName)) trips.push(day.areaName);
  }
  const spine = stays.join(" → ");
  return trips.length ? `${spine} · Day trips: ${trips.join(", ")}` : spine;
}

function hotelChanges(days: DayIntent[]): number {
  return days.reduce((count, day, index) => count + (index > 0 && day.stayName !== days[index - 1]?.stayName ? 1 : 0), 0);
}

function hotelNote(days: DayIntent[]): string {
  const stays: string[] = [];
  const trips: string[] = [];
  for (const day of days) {
    if (!stays.includes(day.stayName)) stays.push(day.stayName);
    if (day.visitMode !== "STAY" && !trips.includes(day.areaName)) trips.push(day.areaName);
  }
  const changes = hotelChanges(days);
  if (changes === 0) return `One base in ${stays[0] ?? "the city"}. Day trips come back to the same hotel.`;
  const tripNote = trips.length ? ` ${trips.join(", ")} ${trips.length === 1 ? "is a day trip" : "are day trips"}, so ${trips.length === 1 ? "it does" : "they do"} not add a hotel.` : "";
  return `${stays.join(" → ")}. ${changes} hotel change${changes === 1 ? "" : "s"}.${tripNote}`;
}

const STYLE_LABEL: Record<string, string> = {
  backpacking: "Backpacking",
  comfort: "Comfort",
  luxury: "Luxury",
  adventure: "Adventure",
  slow: "Slow travel",
  wellness: "Wellness",
  culture: "Culture",
};

function versionLine(input: PlaybookInput): string {
  const styles = input.styles?.length ? input.styles : ["comfort" as TravelStyle];
  const bits: string[] = [];
  const culture = styles.includes("culture");
  const food = input.interests.includes("food");
  if (culture && food) bits.push("Culture + Food");
  else if (culture) bits.push("Culture");
  else if (food) bits.push("Food");
  for (const style of styles) {
    if (style === "culture") continue;
    bits.push(STYLE_LABEL[style] ?? style);
  }
  if (!styles.some((style) => style !== "culture")) bits.push("Comfort");
  bits.push(input.pace === "full" ? "See more" : input.pace === "relaxed" ? "Relaxed pace" : "Balanced pace");
  bits.push(input.balance === "city" ? "City-heavy" : input.balance === "nature" ? "Nature-heavy" : "Balanced city/nature");
  return [...new Set(bits)].join(" · ");
}

function viewFor(book: TravelPlaybook, band: DurationBand, input: PlaybookInput, days: DayIntent[], changes: string[]): TripPlaybookView {
  const unique = [...new Set(changes)].slice(0, 5);
  const generated = book.origin === "generated";
  const strong = book.confidence === "high";
  const title = !input.firstVisit ? "Return route" : generated ? (strong ? "Kairos Classic" : "Kairos Curated") : "Kairos Classic";
  const line = generated
    ? strong
      ? `A strong first-visit route for ${input.nights} nights in ${book.destinationName}, based on established travel patterns.`
      : `Built from the best destination information currently available for ${book.destinationName}.`
    : `A proven starting point for ${input.nights} nights in ${book.destinationName}, adapted to your preferences.`;
  return {
    id: book.id,
    title,
    visit: input.firstVisit ? "First visit" : "Return visit",
    line,
    version: versionLine(input),
    route: routeLine(days),
    changes: unique.length ? unique : ["+ Kept the classic shape"],
    confidence: book.confidence,
    hotelNote: hotelNote(days),
  };
}

const OPEN_GUIDE: SourceType[] = ["wikivoyage", "wikipedia", "wikidata", "openstreetmap"];

export function inferSourceCoverage(refs: readonly ReferenceItinerary[]): SourceCoverage {
  if (!refs.length) return "GEOGRAPHY_ONLY";
  const types = new Set(refs.map((ref) => ref.sourceType));
  const operators = refs.filter((ref) => ref.sourceType === "operator").length;
  if (operators >= 2) return "MULTI_OPERATOR_CONSENSUS";
  const open = [...types].every((type) => OPEN_GUIDE.includes(type));
  if (open) return "OPEN_GUIDE_ONLY";
  return "MULTI_SOURCE";
}

/** Drops a claimed operator consensus when no operator source is actually present. */
export function guardSourceCoverage(refs: readonly ReferenceItinerary[], claimed?: SourceCoverage): SourceCoverage {
  const inferred = inferSourceCoverage(refs);
  if (claimed === "MULTI_OPERATOR_CONSENSUS" && inferred !== "MULTI_OPERATOR_CONSENSUS") return inferred;
  return claimed ?? inferred;
}

export type SearchArea = {
  name: string;
  latitude: number;
  longitude: number;
  countryCode?: string;
  bbox?: [number, number, number, number];
};

function boxOf(lat: number, lng: number, radiusKm: number): [number, number, number, number] {
  const radius = Math.max(8, Math.min(40, radiusKm));
  const dLat = radius / 111.32;
  const dLng = radius / (111.32 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
  return [lat - dLat, lng - dLng, lat + dLat, lng + dLng];
}

export function searchAreasFor(user: readonly SearchArea[], plan: PlaybookPlan | null): SearchArea[] {
  if (!plan) return [...user].slice(0, 3);
  const clusters: SearchArea[] = [];
  const push = (area: SearchArea) => {
    if (clusters.some((item) => distanceMeters(item.latitude, item.longitude, area.latitude, area.longitude) < 12000)) return;
    clusters.push(area);
  };
  const stays = plan.days.filter((day, index) => plan.days.findIndex((item) => item.stayName === day.stayName) === index);
  const trips = plan.days.filter((day) => day.visitMode !== "STAY");
  if (plan.scope === "city" && user[0] && Number.isFinite(user[0].latitude)) push({ ...user[0], bbox: user[0].bbox });
  for (const day of stays) push({ name: day.stayName, latitude: day.stayLatitude, longitude: day.stayLongitude, countryCode: day.countryCode, bbox: boxOf(day.stayLatitude, day.stayLongitude, 14) });
  for (const day of trips) push({ name: day.areaName, latitude: day.latitude, longitude: day.longitude, countryCode: day.countryCode, bbox: boxOf(day.latitude, day.longitude, day.radiusKm) });
  return clusters.slice(0, 4);
}

export function baseAreasFor(user: readonly SearchArea[], plan: PlaybookPlan | null): SearchArea[] {
  if (!plan) return [...user].slice(0, 3);
  const bases: SearchArea[] = [];
  for (const day of plan.days) {
    if (bases.some((item) => item.name === day.stayName)) continue;
    const near = user.find((area) => distanceMeters(area.latitude, area.longitude, day.stayLatitude, day.stayLongitude) < 30000 && !plan.aliases.some((alias) => area.name.toLowerCase() === alias.toLowerCase()));
    bases.push(near && plan.scope === "city"
      ? { name: day.stayName, latitude: near.latitude, longitude: near.longitude, countryCode: near.countryCode || day.countryCode, bbox: near.bbox }
      : { name: day.stayName, latitude: day.stayLatitude, longitude: day.stayLongitude, countryCode: day.countryCode });
  }
  return bases.slice(0, 3);
}

function coreRoute(book: TravelPlaybook): string {
  try {
    return routeLine(adaptOne(book, { destination: book.destinationName, nights: 7, pace: "balanced", oneBase: false, interests: [], balance: "balanced", firstVisit: true, childAges: [] }).days);
  } catch {
    const band = book.bands.find((item) => item.id === "classic") ?? book.bands[0];
    return band?.days.map((day) => day.title).join(" → ") ?? "";
  }
}

export function describePlaybook(id: string, books: readonly TravelPlaybook[] = PLAYBOOKS): string {
  const book = books.find((item) => item.id === id || item.aliases.some((alias) => alias.toLowerCase() === id.toLowerCase()));
  if (!book) return "";
  const graph = consensusFrom(book.references);
  const bands = book.bands.map((band) => `${band.label} (${band.minNights}-${band.maxNights} nights): ${band.days.map((day) => day.title).join(" → ")}`).join("\n");
  const sources = book.references.map((ref) => `${ref.sourceName} · ${ref.sourceType} · ${ref.sourceUrl}\n${ref.extractedFacts.map((fact) => `- ${fact}`).join("\n")}`).join("\n");
  const signals = graph.nodes.map((node) => `${node.name} ${node.signal} (${node.sources})`).join(", ");
  const groups = [...new Set(book.nodes.flatMap((node) => node.experienceGroups))];
  const excursions = book.edges
    .filter((edge) => edge.relation === "day-trip" || edge.relation === "excursion")
    .map((edge) => `${edge.from} → ${edge.to} (${edge.relation})`)
    .join(", ");
  const coverage = guardSourceCoverage(book.references, book.sourceCoverage);
  return [
    book.destinationName,
    `Scope: ${book.scope}`,
    `Status: ${book.status ?? "CURATED"}`,
    `Confidence: ${book.confidence}`,
    `Source coverage: ${coverage}`,
    `Playbook version: ${book.playbookVersion ?? 1}`,
    `Schema version: ${book.schemaVersion ?? 1}`,
    `Core route: ${coreRoute(book)}`,
    `Duration bands:\n${bands}`,
    `Experience groups: ${groups.join(", ") || "None"}`,
    `Excursions: ${excursions || "None recorded"}`,
    `Alternative patterns: ${book.bands.map((band) => band.label).join("; ")}`,
    "Traveller variants are applied when a trip is planned (pace, duration, culture, food, nature, city, family). They are not stored as separate playbooks.",
    `Source count: ${book.references.length}`,
    `Source diversity: ${new Set(book.references.map((ref) => ref.sourceType)).size} types`,
    `Signals: ${signals}`,
    `Sources:\n${sources || "None"}`,
    `Last verified: ${book.lastVerified ?? book.lastUpdated}`,
    `Source snapshot: ${(book.sourceSnapshot ?? book.references.map((ref) => ({ name: ref.sourceName, sourceType: ref.sourceType }))).map((ref) => `${ref.name} (${ref.sourceType})`).join("; ") || "None"}`,
    `Warnings: ${book.warnings?.length ? book.warnings.join("; ") : "None"}`,
  ].join("\n");
}

export function listPlaybookIds(books: readonly TravelPlaybook[] = PLAYBOOKS): string[] {
  return books.map((book) => book.id);
}
