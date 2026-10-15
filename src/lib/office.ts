const OFFICE_KEY = "kairos-office";
const HOME_KEY = "kairos-home";

export type SavedOffice = {
  name: string;
  address: string;
  areaId: string;
  latitude?: number;
  longitude?: number;
};

function readPlace(key: string): SavedOffice | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedOffice>;
    const address = String(parsed.address ?? "").trim().slice(0, 160);
    const name = String(parsed.name ?? "").trim().slice(0, 80);
    if (address.length < 3 && name.length < 3) return null;
    const areaId = String(parsed.areaId ?? "").slice(0, 24);
    const latitude = typeof parsed.latitude === "number" && Number.isFinite(parsed.latitude) ? parsed.latitude : undefined;
    const longitude = typeof parsed.longitude === "number" && Number.isFinite(parsed.longitude) ? parsed.longitude : undefined;
    return { name: name || address, address: address || name, areaId, latitude, longitude };
  } catch {
    return null;
  }
}

function writePlace(key: string, place: SavedOffice): void {
  localStorage.setItem(key, JSON.stringify(place));
}

export function readOffice(): SavedOffice | null {
  return readPlace(OFFICE_KEY);
}

export function writeOffice(office: SavedOffice): void {
  writePlace(OFFICE_KEY, office);
}

export function readHome(): SavedOffice | null {
  return readPlace(HOME_KEY);
}

export function writeHome(home: SavedOffice): void {
  writePlace(HOME_KEY, home);
}

