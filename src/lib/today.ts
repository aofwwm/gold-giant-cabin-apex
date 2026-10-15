export type TodayKind = "meet" | "makan" | "out" | "family" | "date" | "task" | "errand" | "appointment" | "personal" | "travel";
export type TodayStatus = "confirmed" | "tentative" | "flexible" | "completed" | "cancelled";

export type TodayPlace = {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
};

export type TodayRepeat = {
  every: number;
  unit: "day" | "week" | "month";
  until: string;
};

export type TodayItem = {
  id: string;
  sourceType: "meet" | "family" | "dating" | "manual" | "travel";
  sourceId: string;
  title: string;
  kind: TodayKind;
  date: string;
  startMin: number;
  endMin: number;
  place: TodayPlace | null;
  status: TodayStatus;
  flexible: boolean;
  locked: boolean;
  notes: string;
  online: boolean;
  outdoor: boolean;
  href: string;
  seriesId?: string;
  repeat?: TodayRepeat | null;
  skipped?: string[];
  doneOn?: string[];
};

export type TravelLeg = {
  key: string;
  fromId: string;
  toId: string;
  minutes: number | null;
  meters: number | null;
};

export type FreeWindow = { startMin: number; endMin: number; minutes: number };
export type DayConflict = { id: string; beforeId: string; afterId: string; have: number; need: number; text: string };
export type ReplanMove = { id: string; title: string; from: number; to: number | null; reason: string };

export const TRAVEL_BUFFER = 10;
export const FREE_MIN = 30;
const DAY_START = 8 * 60;
const DAY_END = 22 * 60;

export function parseClock(label: string): number | null {
  const spoken = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim());
  if (spoken) {
    let hour = Number(spoken[1]) % 12;
    if (spoken[3].toUpperCase() === "PM") hour += 12;
    return hour * 60 + Number(spoken[2]);
  }
  const plain = /^(\d{1,2}):(\d{2})$/.exec(label.trim());
  if (!plain) return null;
  const hour = Number(plain[1]);
  const minute = Number(plain[2]);
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
}

export function located(place: TodayPlace | null): place is TodayPlace & { latitude: number; longitude: number } {
  return Boolean(place && place.latitude != null && place.longitude != null && Number.isFinite(place.latitude) && Number.isFinite(place.longitude));
}

export function repeatLabel(repeat?: TodayRepeat | null): string {
  if (!repeat || repeat.every < 1) return "";
  if (repeat.every === 1) return `Every ${repeat.unit}`;
  return `Every ${repeat.every} ${repeat.unit}s`;
}

function dateParts(value: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

function dayNumber(value: string): number | null {
  const parts = dateParts(value);
  if (!parts) return null;
  return Math.floor(Date.UTC(parts.y, parts.m - 1, parts.d) / 86400000);
}

export function occursOn(item: TodayItem, view: string): boolean {
  if (!item.repeat) return item.date === view;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(view) || view < item.date) return false;
  if (item.skipped?.includes(view)) return false;
  const until = item.repeat.until || "";
  if (until && view > until) return false;
  const start = dayNumber(item.date);
  const end = dayNumber(view);
  if (start == null || end == null) return false;
  const every = Math.max(1, Math.min(52, Math.round(item.repeat.every) || 1));
  const elapsed = end - start;
  if (elapsed > 366 && !until) return false;
  if (item.repeat.unit === "day") return elapsed % every === 0;
  if (item.repeat.unit === "week") return elapsed % (every * 7) === 0;
  const from = dateParts(item.date);
  const to = dateParts(view);
  if (!from || !to || to.d !== from.d) return false;
  const months = (to.y - from.y) * 12 + (to.m - from.m);
  return months >= 0 && months % every === 0;
}

export function itemsForDate(items: TodayItem[], view: string): TodayItem[] {
  return items.flatMap((item) => {
    if (!occursOn(item, view)) return [];
    if (!item.repeat || item.date === view) {
      const done = item.doneOn?.includes(view);
      return [done ? { ...item, status: "completed" as const } : item];
    }
    return [{
      ...item,
      id: `${item.id}@${view}`,
      seriesId: item.id,
      date: view,
      status: item.doneOn?.includes(view) ? "completed" as const : item.status === "completed" ? "confirmed" as const : item.status,
    }];
  });
}

export function activeItems(items: TodayItem[]): TodayItem[] {
  return items
    .filter((item) => item.status !== "cancelled")
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
}

export function legKey(from: TodayItem, to: TodayItem): string {
  const a = from.place;
  const b = to.place;
  return `${from.id}|${a?.latitude ?? "x"},${a?.longitude ?? "x"}|${to.id}|${b?.latitude ?? "x"},${b?.longitude ?? "x"}`;
}

export function travelPairs(items: TodayItem[]): { key: string; fromId: string; toId: string; from: { lat: number; lng: number }; to: { lat: number; lng: number } }[] {
  const list = activeItems(items);
  const pairs = [];
  for (let index = 0; index < list.length - 1; index += 1) {
    const from = list[index];
    const to = list[index + 1];
    if (!from || !to || from.online || to.online) continue;
    if (!located(from.place) || !located(to.place)) continue;
    pairs.push({
      key: legKey(from, to),
      fromId: from.id,
      toId: to.id,
      from: { lat: from.place.latitude, lng: from.place.longitude },
      to: { lat: to.place.latitude, lng: to.place.longitude },
    });
  }
  return pairs;
}

export function leaveBy(startMin: number, travelMin: number | null): number | null {
  if (travelMin == null) return null;
  return startMin - travelMin - TRAVEL_BUFFER;
}

export function freeWindows(items: TodayItem[], legs: TravelLeg[]): FreeWindow[] {
  const list = activeItems(items);
  const windows: FreeWindow[] = [];
  let cursor = DAY_START;
  for (const item of list) {
    const incoming = legs.find((leg) => leg.toId === item.id);
    const travel = incoming?.minutes ?? 0;
    const open = item.startMin - travel;
    if (open - cursor >= FREE_MIN) windows.push({ startMin: cursor, endMin: open, minutes: open - cursor });
    cursor = Math.max(cursor, item.endMin);
  }
  if (DAY_END - cursor >= FREE_MIN) windows.push({ startMin: cursor, endMin: DAY_END, minutes: DAY_END - cursor });
  return windows;
}

export function findConflicts(items: TodayItem[], legs: TravelLeg[]): DayConflict[] {
  const list = activeItems(items);
  const found: DayConflict[] = [];
  for (let index = 0; index < list.length - 1; index += 1) {
    const before = list[index];
    const after = list[index + 1];
    if (!before || !after) continue;
    const overlap = before.endMin - after.startMin;
    const leg = legs.find((item) => item.fromId === before.id && item.toId === after.id);
    const travel = before.online || after.online ? 0 : leg?.minutes ?? null;
    if (travel == null) {
      if (overlap > 0) {
        found.push({
          id: `${before.id}:${after.id}`,
          beforeId: before.id,
          afterId: after.id,
          have: Math.max(0, after.startMin - before.endMin),
          need: 0,
          text: `${before.title} still overlaps ${after.title}. Travel is not part of this one.`,
        });
      }
      continue;
    }
    const need = travel + (travel > 0 ? TRAVEL_BUFFER : 0);
    const have = after.startMin - before.endMin;
    if (have < need) {
      found.push({
        id: `${before.id}:${after.id}`,
        beforeId: before.id,
        afterId: after.id,
        have: Math.max(0, have),
        need,
        text: travel > 0
          ? `You need ${need} min to reach ${after.title}, but only ${Math.max(0, have)} min is available.`
          : `${before.title} runs into ${after.title}.`,
      });
    }
  }
  return found;
}

export function replanDay(items: TodayItem[], legs: TravelLeg[]): { next: TodayItem[]; moves: ReplanMove[] } {
  const fixed = activeItems(items).filter((item) => item.locked || !item.flexible || item.status === "confirmed");
  const flexible = activeItems(items).filter((item) => !fixed.some((itemFixed) => itemFixed.id === item.id));
  const moves: ReplanMove[] = [];
  const placed: TodayItem[] = fixed.map((item) => ({ ...item }));
  for (const item of flexible) {
    const duration = Math.max(15, item.endMin - item.startMin);
    const slot = nextGap(placed, duration, legs, item);
    if (slot == null) {
      moves.push({ id: item.id, title: item.title, from: item.startMin, to: null, reason: `${item.title} no longer fits today.` });
      placed.push(item);
      continue;
    }
    if (slot !== item.startMin) moves.push({ id: item.id, title: item.title, from: item.startMin, to: slot, reason: "Moved around the fixed plans." });
    placed.push({ ...item, startMin: slot, endMin: slot + duration });
  }
  return { next: placed.sort((a, b) => a.startMin - b.startMin), moves };
}

function nextGap(placed: TodayItem[], duration: number, legs: TravelLeg[], moving: TodayItem): number | null {
  const blocks = [...placed].sort((a, b) => a.startMin - b.startMin);
  let cursor = DAY_START;
  const candidates = blocks.map((item) => item.startMin).concat([DAY_END]);
  for (const edge of candidates) {
    const travel = travelInto(blocks, moving, cursor, legs);
    const start = cursor + travel;
    if (start + duration <= edge) return start;
    const block = blocks.find((item) => item.startMin === edge);
    if (block) cursor = Math.max(cursor, block.endMin);
  }
  return null;
}

function travelInto(blocks: TodayItem[], moving: TodayItem, cursor: number, legs: TravelLeg[]): number {
  const previous = [...blocks].reverse().find((item) => item.endMin <= cursor);
  if (!previous || previous.online || moving.online) return 0;
  if (!located(previous.place) || !located(moving.place)) return 0;
  const known = legs.find((leg) => leg.fromId === previous.id && leg.toId === moving.id);
  return known?.minutes != null ? known.minutes + TRAVEL_BUFFER : TRAVEL_BUFFER;
}

export function parseQuickRules(text: string, date: string): {
  kind: TodayKind;
  title: string;
  date: string;
  startMin: number | null;
  duration: number;
  deadlineMin: number | null;
  flexible: boolean;
} {
  const clean = text.replace(/\s+/g, " ").trim();
  const lower = clean.toLowerCase();
  const kind: TodayKind = /parcel|grocer|collect|buy|errand/.test(lower)
    ? "errand"
    : /dentist|doctor|appointment|haircut/.test(lower)
      ? "appointment"
      : /lunch|dinner|breakfast|coffee/.test(lower)
        ? "personal"
        : "task";
  let day = date;
  if (/\btomorrow\b/.test(lower)) {
    const [year, month, dayNum] = date.split("-").map(Number);
    const next = new Date(Date.UTC(year ?? 2026, (month ?? 1) - 1, (dayNum ?? 1) + 1));
    day = next.toISOString().slice(0, 10);
  }
  const clock = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(clean);
  let minutes: number | null = null;
  if (clock) {
    let hour = Number(clock[1]) % 12;
    if (clock[3]?.toLowerCase() === "pm") hour += 12;
    minutes = hour * 60 + Number(clock[2] ?? 0);
  }
  const before = /\bbefore\b/i.test(clean);
  const title = clean.replace(/\b(tomorrow|today|before|at)\b.*$/i, "").trim() || clean;
  return {
    kind,
    title: title.charAt(0).toUpperCase() + title.slice(1),
    date: day,
    startMin: before ? null : minutes,
    duration: kind === "errand" ? 20 : kind === "appointment" ? 45 : 30,
    deadlineMin: before ? minutes : null,
    flexible: kind !== "appointment",
  };
}

export function dayAside(input: { plans: number; tasks: number; windows: FreeWindow[]; conflicts: DayConflict[]; tight?: string }): string {
  if (input.plans + input.tasks === 0) return "Rare sighting: an empty day.";
  if (input.conflicts[0]) return input.conflicts[0].text.slice(0, 140);
  if (input.tight) return input.tight;
  const useful = input.windows.find((window) => window.minutes >= 60);
  if (useful) return "There is a useful gap in the afternoon. Enough for an errand, not a second plan.";
  if (input.plans >= 3) return "Busy enough. The gaps are doing the real work.";
  return "The day fits. Nothing needs a rescue yet.";
}

type StopLike = {
  title?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  startTime?: string;
  endTime?: string;
  stopType?: string;
  indoorOutdoor?: string;
  locked?: boolean;
};

export function itemsFromFamily(date: string, raw: unknown): TodayItem[] {
  if (!raw || typeof raw !== "object") return [];
  const plan = raw as { startDate?: string; stops?: StopLike[] };
  if (plan.startDate !== date || !Array.isArray(plan.stops)) return [];
  return plan.stops.flatMap((stop, index) => {
    const start = parseClock(stop.startTime ?? "");
    const end = parseClock(stop.endTime ?? "");
    if (start == null) return [];
    const kind = stop.stopType === "lunch" || stop.stopType === "dinner" ? "family" : "family";
    return [stopItem(`family-${index}`, "family", date, stop.title || "Family stop", kind, start, end ?? start + 60, stop, Boolean(stop.locked), "/?mode=family")];
  });
}

export function itemsFromDating(date: string, raw: unknown): TodayItem[] {
  if (!raw || typeof raw !== "object") return [];
  const plan = raw as { date?: string; title?: string; confirmed?: boolean; stops?: StopLike[] };
  if (plan.date !== date || !Array.isArray(plan.stops)) return [];
  const items = plan.stops.flatMap((stop, index) => {
    const start = parseClock(stop.startTime ?? "");
    const end = parseClock(stop.endTime ?? "");
    if (start == null) return [];
    return [stopItem(`date-${index}`, "dating", date, stop.title || "Date stop", "date", start, end ?? start + 75, stop, Boolean(stop.locked), "/?mode=dating")];
  });
  if (!plan.confirmed || !items.length) return items;
  const first = items[0];
  if (!first) return items;
  return [{
    ...first,
    id: "date-confirmed",
    sourceId: "date-confirmed",
    title: plan.title || first.title || "Date",
    startMin: Math.min(...items.map((item) => item.startMin)),
    endMin: Math.max(...items.map((item) => item.endMin)),
    status: "confirmed",
    flexible: false,
    locked: true,
  }];
}

export function confirmedInviteItem(date: string, agreed: { title: string; area: string; startMin: number; endMin: number; sourceId: string }): TodayItem {
  return {
    id: `date-confirmed-${agreed.sourceId || date}`,
    sourceType: "dating",
    sourceId: agreed.sourceId,
    title: agreed.title || "Date",
    kind: "date",
    date,
    startMin: agreed.startMin,
    endMin: Math.max(agreed.endMin, agreed.startMin + 30),
    place: agreed.area ? { name: agreed.area, address: agreed.area, latitude: null, longitude: null } : null,
    status: "confirmed",
    flexible: false,
    locked: true,
    notes: "",
    online: false,
    outdoor: false,
    href: "/?mode=dating",
  };
}

function stopItem(id: string, source: "family" | "dating", date: string, title: string, kind: TodayKind, start: number, end: number, stop: StopLike, locked: boolean, href: string): TodayItem {
  const latitude = typeof stop.latitude === "number" ? stop.latitude : null;
  const longitude = typeof stop.longitude === "number" ? stop.longitude : null;
  const privateHome = /home/i.test(stop.address ?? "") || stop.stopType === "home" || stop.stopType === "leave";
  return {
    id,
    sourceType: source,
    sourceId: id,
    title,
    kind,
    date,
    startMin: start,
    endMin: Math.max(end, start + 15),
    place: privateHome ? null : { name: title, address: stop.address || "", latitude, longitude },
    status: locked ? "confirmed" : "tentative",
    flexible: !locked,
    locked,
    notes: "",
    online: false,
    outdoor: stop.indoorOutdoor === "outdoor",
    href,
  };
}

export type MeetPin = {
  code: string;
  title: string;
  durationMin: number;
  format: string;
  venue: string;
  address: string;
  slots: string[];
};

export function itemsFromMeets(date: string, pins: MeetPin[]): TodayItem[] {
  return pins.flatMap((pin) =>
    pin.slots.flatMap((slot) => {
      if (!slot.startsWith(date)) return [];
      const time = slot.slice(11, 16);
      const start = parseClock(time);
      if (start == null) return [];
      const online = pin.format === "online";
      return [{
        id: `meet-${pin.code}-${time}`,
        sourceType: "meet" as const,
        sourceId: pin.code,
        title: pin.title || "Meeting",
        kind: "meet" as const,
        date,
        startMin: start,
        endMin: start + (pin.durationMin || 60),
        place: online ? null : { name: pin.venue || pin.address || "Meeting", address: pin.address, latitude: null, longitude: null },
        status: "tentative" as const,
        flexible: false,
        locked: true,
        notes: pin.format === "hybrid" ? "Hybrid. Travel is not assumed until you mark it in person." : "",
        online,
        outdoor: false,
        href: `/meet/${pin.code}`,
      }];
    }),
  );
}
