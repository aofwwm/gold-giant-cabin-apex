import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/travel-photo-CU-qA7uW.js
var travel_photo_exports = /* @__PURE__ */ __exportAll({
	NO_PERMITTED_PHOTO: () => NO_PERMITTED_PHOTO,
	commercialNameMatch: () => commercialNameMatch,
	commonsCategoryTitle: () => commonsCategoryTitle,
	commonsFileTitle: () => commonsFileTitle,
	fileKey: () => fileKey,
	isCommercialCategory: () => isCommercialCategory,
	isDirectImageUrl: () => isDirectImageUrl,
	isPermittedPhotoUrl: () => isPermittedPhotoUrl,
	parseWikipedia: () => parseWikipedia,
	photoCredit: () => photoCredit,
	photoFromImageInfo: () => photoFromImageInfo,
	plainMeta: () => plainMeta,
	scoreCommonsFile: () => scoreCommonsFile,
	searchPhotoOk: () => searchPhotoOk,
	stableMediaUrl: () => stableMediaUrl,
	strongIdentityMatch: () => strongIdentityMatch
});
var COMMERCIAL = /* @__PURE__ */ new Set([
	"restaurant",
	"cafe",
	"nightlife"
]);
function isCommercialCategory(category) {
	return COMMERCIAL.has(category);
}
function photoCredit(source) {
	if (source === "yelp") return "Yelp";
	if (source === "foursquare") return "Foursquare";
	if (source === "mapillary") return "Mapillary";
	if (source === "panoramax") return "Panoramax";
	return "Wikimedia Commons";
}
var IMAGE_HOSTS = /* @__PURE__ */ new Set(["upload.wikimedia.org", "thumb.wikimedia.org"]);
var AVOID_FILE = /logo|wordmark|\bicon\b|\bmap\b|diagram|coat of arms|flag of|postage|stamp\b|portrait|selfie|qr[- ]?code|floor plan|location map|signature|autograph|banknote|\bcoin\b|\bseal\b|pictogram|svg$/i;
var PREFER_FILE = /exterior|building|main building|front|facade|façade|\bview\b|entrance|outside|overview|aerial/i;
var GENERIC_NAME = /* @__PURE__ */ new Set([
	"museum",
	"musee",
	"art",
	"tower",
	"tour",
	"castle",
	"palace",
	"garden",
	"gardens",
	"park",
	"shrine",
	"temple",
	"bridge",
	"national",
	"centre",
	"center",
	"the",
	"and"
]);
function fullyDecode(value) {
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
function commonsFileTitle(value) {
	const raw = value.trim();
	if (!raw) return "";
	let name = raw;
	if (/^https?:\/\//i.test(raw)) try {
		const path = fullyDecode(new URL(raw).pathname);
		const special = path.indexOf("/Special:FilePath/");
		if (special >= 0) name = path.slice(special + 18);
		else {
			const wiki = path.toLowerCase().indexOf("/wiki/");
			if (wiki >= 0) name = path.slice(wiki + 6);
			else return "";
		}
	} catch {
		return "";
	}
	name = fullyDecode(name).replace(/_/g, " ").replace(/^(?:file|fichier|datei|archivo|bestand|fil|tiedosto|arquivo|plik):/i, "").split("?")[0].trim();
	if (!name || name.length > 240 || !/\.(jpe?g|png|gif|webp|svg|tiff?)$/i.test(name)) return "";
	return `File:${name}`;
}
function commonsCategoryTitle(value) {
	const name = value.trim().replace(/^category:/i, "").replace(/_/g, " ").trim();
	if (!name || name.length > 180) return "";
	return `Category:${name}`;
}
function fileKey(title) {
	return title.replace(/^file:/i, "").replace(/_/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}
function isPermittedPhotoUrl(value) {
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
function isDirectImageUrl(value) {
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
function stableMediaUrl(value) {
	try {
		const url = new URL(value);
		for (const key of [...url.searchParams.keys()]) if (key.startsWith("utm_")) url.searchParams.delete(key);
		const query = url.searchParams.toString();
		return `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
	} catch {
		return value;
	}
}
function plainMeta(value) {
	if (!value) return "";
	return value.replace(/<[^>]+>/g, " ").replace(/\u0026nbsp;/g, " ").replace(/\u0026amp;/g, "&").replace(/\u0026quot;/g, "\"").replace(/\u0026#0?39;|\u0026apos;/g, "'").replace(/\u0026lt;/g, "<").replace(/\u0026gt;/g, ">").replace(/\s+/g, " ").trim().slice(0, 180);
}
function scoreCommonsFile(title, width = 0, height = 0, mime = "") {
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
function strongIdentityMatch(placeName, fileTitle, localName = "") {
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
function searchPhotoOk(placeName, fileTitle, localName = "") {
	if (!strongIdentityMatch(placeName, fileTitle, localName)) return false;
	if (scoreCommonsFile(fileTitle) <= -10) return false;
	const bare = fileTitle.replace(/^file:/i, "").trim();
	const head = bare.split(",")[0] ?? bare;
	if (!bare.includes(",")) return true;
	return strongIdentityMatch(placeName, head, localName);
}
function commercialNameMatch(left, right) {
	const a = foldCommercial(left);
	const b = foldCommercial(right);
	if (!a || !b || a.length < 2 || b.length < 2) return false;
	if (a === b) return true;
	const short = a.length < b.length ? a : b;
	const long = a.length < b.length ? b : a;
	if (short.length < 3 || !long.includes(short)) return false;
	return short.length / long.length >= .6;
}
function foldCommercial(value) {
	return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[\s'’".・·\-]+/g, "").trim();
}
function parseWikipedia(value) {
	const raw = value.trim();
	if (!raw) return null;
	const match = raw.match(/^([a-z-]{2,12}):(.+)$/i);
	if (match) return {
		lang: match[1].toLowerCase(),
		title: match[2].replace(/_/g, " ").trim()
	};
	if (raw.length < 2 || raw.length > 180) return null;
	return {
		lang: "en",
		title: raw.replace(/_/g, " ").trim()
	};
}
/** Map a Commons imageinfo record. Licence text is copied from extmetadata only. */
function photoFromImageInfo(source, page) {
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
		retrievedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
export { isCommercialCategory as a, photoCredit as c, searchPhotoOk as d, stableMediaUrl as f, fileKey as i, photoFromImageInfo as l, commonsCategoryTitle as n, isPermittedPhotoUrl as o, travel_photo_exports as p, commonsFileTitle as r, parseWikipedia as s, commercialNameMatch as t, scoreCommonsFile as u };
