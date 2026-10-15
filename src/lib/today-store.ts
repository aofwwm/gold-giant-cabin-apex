import type { MeetPin, TodayItem, TodayKind, TodayPlace, TodayStatus } from "@/lib/today";

const ITEMS = "kairos-today-items";
const MEETS = "kairos-meet-pins";

export function readTodayItems(): TodayItem[] {
  return read(ITEMS);
}

export function writeTodayItems(items: TodayItem[]) {
  localStorage.setItem(ITEMS, JSON.stringify(items));
}

export function readMeetPins(): MeetPin[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(MEETS) ?? "[]") as MeetPin[];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function pinMeet(pin: MeetPin) {
  const next = [pin, ...readMeetPins().filter((item) => item.code !== pin.code)].slice(0, 12);
  localStorage.setItem(MEETS, JSON.stringify(next));
}

export function readJson(key: string): unknown {
  if (typeof localStorage === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}

function read(key: string): TodayItem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? "[]") as TodayItem[];
    return Array.isArray(raw) ? raw.filter((item) => item && typeof item.id === "string" && typeof item.date === "string") : [];
  } catch {
    return [];
  }
}

export function blankItem(date: string, kind: TodayKind): TodayItem {
  return {
    id: `manual-${Date.now().toString(36)}`,
    sourceType: "manual",
    sourceId: "",
    title: "",
    kind,
    date,
    startMin: 15 * 60,
    endMin: 15 * 60 + 30,
    place: null,
    status: kind === "task" || kind === "errand" ? "flexible" : "tentative",
    flexible: kind === "task" || kind === "errand" || kind === "personal",
    locked: kind === "appointment",
    notes: "",
    online: false,
    outdoor: false,
    href: "",
  };
}

export function placeOrNull(name: string, address: string): TodayPlace | null {
  if (!name.trim() && !address.trim()) return null;
  return { name: name.trim() || address.trim(), address: address.trim(), latitude: null, longitude: null };
}

export function setStatus(items: TodayItem[], id: string, status: TodayStatus): TodayItem[] {
  return items.map((item) => (item.id === id ? { ...item, status } : item));
}
