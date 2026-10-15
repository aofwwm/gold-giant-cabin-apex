/** Open-photo helpers. Thumbnails come from the Wikimedia API, never a guessed hash path. */

export type PhotoSource =
  | "wikidata_image"
  | "osm_wikimedia"
  | "wikipedia_lead"
  | "commons_category"
  | "commons_search"
  | "mapillary"
  | "panoramax"
  | "yelp"
  | "foursquare";

export type PlacePhoto = {
  source: PhotoSource;
  fileTitle: string;
  thumbnailUrl: string;
  originalUrl: string;
  descriptionUrl: string;
  width: number;
  height: number;
  mime: string;
  creator: string;
  license: string;
  licenseUrl: string;
  attributionRequired: boolean;
  /** Provider's own place or picture id. Not an OpenStreetMap id. */
  sourcePlaceId?: string;
  retrievedAt?: string;
};

export const NO_PERMITTED_PHOTO = "No usable image was found from configured permitted sources.";

export type CommercialProfile = {
  provider: "yelp" | "foursquare";
  id: string;
  name: string;
  url: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  categories: string[];
  matchedAt: string;
};

const COMMERCIAL = new Set(["restaurant", "cafe", "nightlife"]);

export function isCommercialCategory(category: string): boolean {
  return COMMERCIAL.has(category);
}

export function photoCredit(source: PhotoSource): string {
  if (source === "yelp") return "Yelp";
  if (source === "foursquare") return "Foursquare";
  if (source === "mapillary") return "Mapillary";
  if (source === "panoramax") return "Panoramax";
  return "Wikimedia Commons";
}

export type PhotoQuery = {
  name: string;
  localName?: string;
  wikidataId?: string;
  fileTitle?: string;
  imagePage?: string;
  osmFile?: string;
  commonsCategory?: string;
  wikipedia?: string;
  failedUrl?: string;
  rejectFileTitles?: string[];
  /** Restaurants must not fall through to a Commons name search. */
  commercial?: boolean;
};

const IMAGE_HOSTS = new Set(["upload.wikimedia.org", "thumb.wikimedia.org"]);
const AVOID_FILE = /logo|wordmark|\bicon\b|\bmap\b|diagram|coat of arms|flag of|postage|stamp\b|portrait|selfie|qr[- ]?code|floor plan|location map|signature|autograph|banknote|\bcoin\b|\bseal\b|pictogram|svg$/i;
const PREFER_FILE = /exterior|building|main building|front|facade|façade|\bview\b|entrance|outside|overview|aerial/i;
const GENERIC_NAME = new Set(["museum", "musee", "art", "tower", "tour", "castle", "palace", "garden", "gardens", "park", "shrine", "temple", "bridge", "national", "centre", "center", "the", "and"]);

function fullyDecode(value: string): string {
  let current = value;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (!/%[0-9a-f]{2}/i.test(current)) break;
    try {
      const next = decodeURIComponent(current);
      if (next === current) break;
      current = next;
    } catch {
      break;
    }
  }
  return current;
}

/** Commons file title from a Wikidata P18 URL, a File: title, or a bare filename. */
export function commonsFileTitle(value: string): string {
  const raw = value.trim();
  if (!raw) return "";
  let name = raw;
  if (/^https?:\/\//i.test(raw)) {
    try {
      const path = fullyDecode(new URL(raw).pathname);
      const special = path.indexOf("/Special:FilePath/");
      if (special >= 0) name = path.slice(special + "/Special:FilePath/".length);
      else {
        const wiki = path.toLowerCase().indexOf("/wiki/");
        if (wiki >= 0) name = path.slice(wiki + "/wiki/".length);
        else return "";
      }
    } catch {
      return "";
    }
  }
  name = fullyDecode(name).replace(/_/g, " ").replace(/^(?:file|fichier|datei|archivo|bestand|fil|tiedosto|arquivo|plik):/i, "").split("?")[0].trim();
  if (!name || name.length > 240 || !/\.(jpe?g|png|gif|webp|svg|tiff?)$/i.test(name)) return "";
  return `File:${name}`;
}

export function commonsCategoryTitle(value: string): string {
  const name = value.trim().replace(/^category:/i, "").replace(/_/g, " ").trim();
  if (!name || name.length > 180) return "";
  return `Category:${name}`;
}

export function fileKey(title: string): string {
  return title.replace(/^file:/i, "").replace(/_/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

export function isPermittedPhotoUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".local") || /^\d+\.\d+\.\d+\.\d+$/.test(host)) return false;
    if (IMAGE_HOSTS.has(host)) return !url.pathname.includes("Special:FilePath") && !url.pathname.toLowerCase().includes("/wiki/");
    if (host.endsWith(".yelpcdn.com") || host.endsWith(".4sqi.net") || host.endsWith(".mapillary.com")) return true;
    if (host === "panoramax.xyz" || host.endsWith(".panoramax.xyz") || host.startsWith("panoramax.") || host.endsWith(".geovisio.fr")) return true;
    return false;
  } catch {
    return false;
  }
}

export function isDirectImageUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (!IMAGE_HOSTS.has(url.hostname)) return false;
    if (url.pathname.includes("Special:FilePath") || url.pathname.toLowerCase().includes("/wiki/")) return false;
    return true;
  } catch {
    return false;
  }
}

export function stableMediaUrl(value: string): string {
  try {
    const url = new URL(value);
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("utm_")) url.searchParams.delete(key);
    }
    const query = url.searchParams.toString();
    return `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
  } catch {
    return value;
  }
}

export function plainMeta(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\u0026nbsp;/g, " ")
    .replace(/\u0026amp;/g, "\u0026")
    .replace(/\u0026quot;/g, "\"")
    .replace(/\u0026#0?39;|\u0026apos;/g, "'")
    .replace(/\u0026lt;/g, "<")
    .replace(/\u0026gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export function scoreCommonsFile(title: string, width = 0, height = 0, mime = ""): number {
  const name = title.toLowerCase();
  let score = 0;
  if (AVOID_FILE.test(name)) score -= 40;
  if (PREFER_FILE.test(name)) score += 18;
  if (width > 0 && height > 0) {
    if (width >= height) score += 8;
    if (width >= 800) score += 6;
    else if (width >= 480) score += 3;
    else if (width < 240) score -= 8;
  }
  if (mime === "image/jpeg" || mime === "image/webp") score += 4;
  if (mime === "image/png") score += 2;
  if (mime === "image/svg+xml" || mime === "image/gif") score -= 6;
  return score;
}

export function strongIdentityMatch(placeName: string, fileTitle: string, localName = ""): boolean {
  const title = fileTitle.toLowerCase().replace(/^file:/i, "").replace(/_/g, " ");
  const names = [placeName, localName].map((name) => name.trim()).filter(Boolean);
  for (const name of names) {
    const folded = name.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
    if (folded.length >= 6 && title.includes(folded)) return true;
    const tokens = folded.split(/[^a-z0-9\u4e00-\u9fff]+/).filter((word) => word.length >= 4 && !GENERIC_NAME.has(word));
    if (!tokens.length) continue;
    const hits = tokens.filter((token) => title.includes(token));
    if (tokens.length === 1 && hits.length === 1) return true;
    if (hits.length >= 2) return true;
    if (hits.some((token) => token.length >= 8)) return true;
  }
  return false;
}

/** Search hits like "Artwork, Museum" are collection objects, not the place. */
export function searchPhotoOk(placeName: string, fileTitle: string, localName = ""): boolean {
  if (!strongIdentityMatch(placeName, fileTitle, localName)) return false;
  if (scoreCommonsFile(fileTitle) <= -10) return false;
  const bare = fileTitle.replace(/^file:/i, "").trim();
  const head = bare.split(",")[0] ?? bare;
  if (!bare.includes(",")) return true;
  return strongIdentityMatch(placeName, head, localName);
}

export function commercialNameMatch(left: string, right: string): boolean {
  const a = foldCommercial(left);
  const b = foldCommercial(right);
  if (!a || !b || a.length < 2 || b.length < 2) return false;
  if (a === b) return true;
  const short = a.length < b.length ? a : b;
  const long = a.length < b.length ? b : a;
  if (short.length < 3 || !long.includes(short)) return false;
  return short.length / long.length >= 0.6;
}

function foldCommercial(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[\s'’".・·\-]+/g, "").trim();
}

export function parseWikipedia(value: string): { lang: string; title: string } | null {
  const raw = value.trim();
  if (!raw) return null;
  const match = raw.match(/^([a-z-]{2,12}):(.+)$/i);
  if (match) return { lang: match[1].toLowerCase(), title: match[2].replace(/_/g, " ").trim() };
  if (raw.length < 2 || raw.length > 180) return null;
  return { lang: "en", title: raw.replace(/_/g, " ").trim() };
}

type ImageInfo = {
  thumburl?: string;
  thumbwidth?: number;
  thumbheight?: number;
  url?: string;
  descriptionurl?: string;
  mime?: string;
  width?: number;
  height?: number;
  extmetadata?: Record<string, { value?: string } | undefined>;
};

/** Map a Commons imageinfo record. Licence text is copied from extmetadata only. */
export function photoFromImageInfo(source: PhotoSource, page: { title?: string; missing?: boolean; imageinfo?: ImageInfo[] }): PlacePhoto | null {
  if (page.missing) return null;
  const info = page.imageinfo?.[0];
  const thumb = info?.thumburl ? stableMediaUrl(info.thumburl) : "";
  const original = info?.url ? stableMediaUrl(info.url) : "";
  if (!info || !isDirectImageUrl(thumb) || !isDirectImageUrl(original)) return null;
  const mime = info.mime || "";
  if (mime && !mime.startsWith("image/")) return null;
  const meta = info.extmetadata ?? {};
  const license = plainMeta(meta.LicenseShortName?.value);
  const licenseUrl = /^https?:\/\//i.test(plainMeta(meta.LicenseUrl?.value)) ? plainMeta(meta.LicenseUrl?.value) : "";
  const creator = plainMeta(meta.Artist?.value);
  const attr = plainMeta(meta.AttributionRequired?.value).toLowerCase();
  const publicDomain = /^(cc0|public domain|pd\b|no restrictions)/i.test(license) || attr === "false";
  return {
    source,
    fileTitle: page.title || "",
    thumbnailUrl: thumb,
    originalUrl: original,
    descriptionUrl: info.descriptionurl || "",
    width: info.thumbwidth || info.width || 0,
    height: info.thumbheight || info.height || 0,
    mime,
    creator,
    license,
    licenseUrl,
    attributionRequired: !publicDomain,
    retrievedAt: new Date().toISOString(),
  };
}
