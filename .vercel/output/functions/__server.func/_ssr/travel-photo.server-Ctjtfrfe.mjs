import { d as distanceMeters } from "./coord-Cq5LMP_P.mjs";
import { n as noteCall, r as noteFailure } from "./provider-usage-CqiDrKv8.mjs";
import { n as TtlCache, r as shareRequest, t as RequestGate } from "./travel-cache-BPZkLeXq.mjs";
import { t as logCostGuardrail } from "./provider-registry-DT28z4U1.mjs";
import { a as isCommercialCategory, d as searchPhotoOk, f as stableMediaUrl, i as fileKey, l as photoFromImageInfo, n as commonsCategoryTitle, o as isPermittedPhotoUrl, r as commonsFileTitle, s as parseWikipedia, t as commercialNameMatch, u as scoreCommonsFile } from "./travel-photo-CU-qA7uW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/travel-photo.server-Ctjtfrfe.js
function env(key) {
	return process.env[key]?.trim() || void 0;
}
logCostGuardrail();
var yelpCache = new TtlCache(864e5, 200, "photo");
var streetCache = new TtlCache(6048e5, 200, "photo");
var yelpGate = new RequestGate(6, 6e4);
var streetGate = new RequestGate(6, 1e4);
var UA$1 = "Kairos/1.0 (travel photos; contact: local)";
var YELP_DAY_CAP = 30;
var yelpDay = "";
var yelpUsed = 0;
function namesOf(place) {
	return [
		place.name,
		place.nameLocal,
		place.localName,
		place.nameEn,
		place.displayName
	].filter((name) => Boolean(name && name.trim()));
}
function houseAgrees(left, right) {
	const a = left.match(/\d{1,4}/)?.[0] ?? "";
	const b = right.match(/\d{1,4}/)?.[0] ?? "";
	if (!a || !b) return true;
	return a === b;
}
function yelpLocale(place) {
	if (place.lat >= 30 && place.lat <= 46 && place.lng >= 129 && place.lng <= 146) return "ja_JP";
	if (place.lat >= 33 && place.lat <= 43 && place.lng >= 124 && place.lng < 130) return "ko_KR";
	if (/[\u4e00-\u9fff]/.test(place.name)) return "zh_CN";
	return "";
}
function yelpBudget() {
	const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	if (day !== yelpDay) {
		yelpDay = day;
		yelpUsed = 0;
	}
	if (yelpUsed >= YELP_DAY_CAP || !yelpGate.allow()) return false;
	yelpUsed += 1;
	return true;
}
function photoShell(partial) {
	if (!isPermittedPhotoUrl(partial.thumbnailUrl)) return null;
	return {
		...partial,
		retrievedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
async function yelpMatch(place) {
	const empty = {
		photo: null,
		profile: null,
		match: false
	};
	const key = env("YELP_API_KEY");
	if (!key) return empty;
	const cacheKey = `${place.name.toLowerCase()}:${place.lat.toFixed(3)},${place.lng.toFixed(3)}`;
	const cached = yelpCache.get(cacheKey);
	if (cached) return cached;
	if (!yelpBudget()) return empty;
	const url = new URL("https://api.yelp.com/v3/businesses/search");
	url.searchParams.set("term", place.name);
	url.searchParams.set("latitude", String(place.lat));
	url.searchParams.set("longitude", String(place.lng));
	url.searchParams.set("radius", "200");
	url.searchParams.set("limit", "5");
	const locale = yelpLocale(place);
	if (locale) url.searchParams.set("locale", locale);
	let body = null;
	try {
		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${key}`,
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (res.status === 429 || !res.ok) return empty;
		body = await res.json();
	} catch {
		return empty;
	}
	const names = namesOf(place);
	let best = null;
	for (const biz of body?.businesses ?? []) {
		const lat = biz.coordinates?.latitude;
		const lng = biz.coordinates?.longitude;
		if (lat == null || lng == null || !biz.name || !biz.id) continue;
		const distance = distanceMeters(place.lat, place.lng, lat, lng);
		if (distance > 120) continue;
		if (!names.some((name) => commercialNameMatch(name, biz.name || ""))) continue;
		const yelpAddress = [biz.location?.address1, biz.location?.city].filter(Boolean).join(" ");
		if (!houseAgrees(place.address, yelpAddress)) continue;
		if (!best || distance < best.distance) best = {
			distance,
			biz
		};
	}
	if (!best?.biz.id || !best.biz.name) {
		yelpCache.set(cacheKey, empty);
		return empty;
	}
	const profile = {
		provider: "yelp",
		id: best.biz.id,
		name: best.biz.name,
		url: best.biz.url || `https://www.yelp.com/biz/${best.biz.id}`,
		rating: typeof best.biz.rating === "number" ? best.biz.rating : void 0,
		reviewCount: typeof best.biz.review_count === "number" ? best.biz.review_count : void 0,
		price: best.biz.price || "",
		categories: (best.biz.categories ?? []).map((row) => row.title || "").filter(Boolean).slice(0, 4),
		matchedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const image = best.biz.image_url || "";
	const outcome = {
		photo: image ? photoShell({
			source: "yelp",
			fileTitle: "",
			thumbnailUrl: image,
			originalUrl: image,
			descriptionUrl: profile.url,
			width: 0,
			height: 0,
			mime: "",
			creator: "Yelp",
			license: "Yelp display terms",
			licenseUrl: "https://terms.yelp.com/developers/display_requirements",
			attributionRequired: true,
			sourcePlaceId: profile.id
		}) : null,
		profile,
		match: true
	};
	yelpCache.set(cacheKey, outcome);
	return outcome;
}
function foursquareGate() {
	return {
		configured: Boolean(env("FOURSQUARE_API_KEY")),
		enabled: Boolean(env("FOURSQUARE_API_KEY")) && env("FOURSQUARE_PHOTOS") === "on"
	};
}
async function foursquareMatch(place) {
	const empty = {
		photo: null,
		profile: null,
		match: false
	};
	if (!foursquareGate().enabled) return empty;
	const key = env("FOURSQUARE_API_KEY") || "";
	const url = new URL("https://api.foursquare.com/v3/places/search");
	url.searchParams.set("query", place.name);
	url.searchParams.set("ll", `${place.lat},${place.lng}`);
	url.searchParams.set("radius", "120");
	url.searchParams.set("limit", "5");
	try {
		const res = await fetch(url, {
			headers: {
				Authorization: key,
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) return empty;
		const body = await res.json();
		const names = namesOf(place);
		const biz = (body.results ?? []).find((row) => (row.distance ?? 999) <= 120 && row.fsq_id && row.name && names.some((name) => commercialNameMatch(name, row.name || "")));
		if (!biz?.fsq_id || !biz.name) return empty;
		const photos = await fetch(`https://api.foursquare.com/v3/places/${encodeURIComponent(biz.fsq_id)}/photos?limit=1`, {
			headers: {
				Authorization: key,
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(8e3)
		});
		const first = (photos.ok ? await photos.json() : [])[0];
		const image = first?.prefix && first.suffix ? `${first.prefix}300x300${first.suffix}` : "";
		const profile = {
			provider: "foursquare",
			id: biz.fsq_id,
			name: biz.name,
			url: biz.link || "",
			categories: (biz.categories ?? []).map((row) => row.name || "").filter(Boolean).slice(0, 4),
			matchedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		return {
			photo: image ? photoShell({
				source: "foursquare",
				fileTitle: "",
				thumbnailUrl: image,
				originalUrl: image,
				descriptionUrl: profile.url,
				width: 300,
				height: 300,
				mime: "",
				creator: "Foursquare",
				license: "Foursquare Places API terms",
				licenseUrl: "https://foursquare.com/legal/api-policy",
				attributionRequired: true,
				sourcePlaceId: biz.fsq_id
			}) : null,
			profile,
			match: true
		};
	} catch {
		return empty;
	}
}
function closestFeature(lat, lng, features) {
	let best = null;
	for (const feature of features) {
		const pair = feature.geometry?.coordinates;
		if (!pair || pair.length < 2) continue;
		const meters = distanceMeters(lat, lng, pair[1], pair[0]);
		if (meters > 50) continue;
		if (!best || meters < best.meters) best = {
			feature,
			meters
		};
	}
	return best;
}
async function panoramaPhoto(feature) {
	let thumb = feature.assets?.thumb?.href || feature.assets?.sd?.href || "";
	let license = feature.properties?.license || "";
	let creator = feature.properties?.["geovisio:producer"] || "";
	let page = feature.links?.find((link) => link.rel === "self")?.href || "";
	const licenseHref = feature.links?.find((link) => link.rel === "license")?.href || "";
	if (!thumb && page) {
		if (!streetGate.allow()) return null;
		try {
			const res = await fetch(page, {
				headers: {
					Accept: "application/geo+json",
					"User-Agent": UA$1
				},
				signal: AbortSignal.timeout(8e3)
			});
			if (res.ok) {
				const item = await res.json();
				thumb = item.assets?.thumb?.href || item.assets?.sd?.href || "";
				license = license || item.properties?.license || "";
				creator = creator || item.properties?.["geovisio:producer"] || "";
				page = item.links?.find((link) => link.rel === "self")?.href || page;
			}
		} catch {
			return null;
		}
	}
	if (!thumb || !feature.id) return null;
	return photoShell({
		source: "panoramax",
		fileTitle: "",
		thumbnailUrl: thumb,
		originalUrl: feature.assets?.sd?.href || thumb,
		descriptionUrl: page,
		width: 500,
		height: 0,
		mime: "",
		creator,
		license,
		licenseUrl: licenseHref,
		attributionRequired: true,
		sourcePlaceId: feature.id
	});
}
async function panoramaxNear(lat, lng) {
	const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
	const cached = streetCache.get(cacheKey);
	if (cached !== void 0) return cached;
	if (!streetGate.allow()) return null;
	const dLat = 50 / 111320;
	const dLng = 50 / (111320 * Math.max(.2, Math.cos(lat * Math.PI / 180)));
	const url = new URL("https://api.panoramax.xyz/api/search");
	url.searchParams.set("bbox", `${lng - dLng},${lat - dLat},${lng + dLng},${lat + dLat}`);
	url.searchParams.set("limit", "5");
	try {
		const res = await fetch(url, {
			headers: {
				Accept: "application/geo+json",
				"User-Agent": UA$1
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) return null;
		const near = closestFeature(lat, lng, (await res.json()).features ?? []);
		const photo = near ? await panoramaPhoto(near.feature) : null;
		streetCache.set(cacheKey, photo);
		return photo;
	} catch {
		return null;
	}
}
async function mapillaryPicture(id, lat, lng) {
	const token = env("MAPILLARY_TOKEN");
	if (!token) return null;
	if (!streetGate.allow()) return null;
	const url = new URL(id ? `https://graph.mapillary.com/${encodeURIComponent(id)}` : "https://graph.mapillary.com/images");
	url.searchParams.set("access_token", token);
	url.searchParams.set("fields", "id,thumb_1024_url,creator");
	if (!id) {
		const dLat = 40 / 111320;
		const dLng = 40 / (111320 * Math.max(.2, Math.cos(lat * Math.PI / 180)));
		url.searchParams.set("bbox", `${lng - dLng},${lat - dLat},${lng + dLng},${lat + dLat}`);
		url.searchParams.set("limit", "1");
	}
	try {
		const res = await fetch(url, {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) return null;
		const body = await res.json();
		const row = body.thumb_1024_url ? body : body.data?.[0];
		if (!row?.thumb_1024_url || !row.id) return null;
		return photoShell({
			source: "mapillary",
			fileTitle: "",
			thumbnailUrl: row.thumb_1024_url,
			originalUrl: row.thumb_1024_url,
			descriptionUrl: `https://www.mapillary.com/app/?focus=photo&pKey=${row.id}`,
			width: 1024,
			height: 0,
			mime: "",
			creator: body.creator?.username || "",
			license: "",
			licenseUrl: "https://www.mapillary.com/legal/terms",
			attributionRequired: true,
			sourcePlaceId: row.id
		});
	} catch {
		return null;
	}
}
async function referencedStreetPhoto(place) {
	if (place.mapillaryId) {
		const photo = await mapillaryPicture(place.mapillaryId, place.lat, place.lng);
		if (photo) return photo;
	}
	if (!place.panoramaxId) return null;
	const photo = await panoramaxNear(place.lat, place.lng);
	return photo?.sourcePlaceId === place.panoramaxId ? photo : null;
}
async function enrichCommercialPlace(place, openPhoto) {
	const osm = Boolean(place.commonsFile || place.mapillaryId || place.panoramaxId);
	const yelp = await yelpMatch(place);
	const foursquare = yelp.photo ? {
		photo: null,
		profile: null,
		match: false
	} : await foursquareMatch(place);
	const street = !openPhoto && !yelp.photo && !foursquare.photo && (place.mapillaryId || place.panoramaxId) ? await referencedStreetPhoto(place) : null;
	const mapillary = street?.source === "mapillary" ? street : null;
	const panoramax = street?.source === "panoramax" ? street : null;
	const photo = openPhoto ? null : yelp.photo || foursquare.photo || street;
	const selected = openPhoto ? "open" : photo?.source || "none";
	const yelpConfigured = Boolean(env("YELP_API_KEY"));
	const foursquareState = foursquareGate();
	const note = [
		yelpConfigured ? "" : "Yelp was not called. No API key is configured, and Yelp Places is a 30-day trial followed by a paid plan.",
		foursquareState.enabled ? "" : "Foursquare photos were not called. They are a paid Premium endpoint and stay off unless FOURSQUARE_PHOTOS=on.",
		"Official website images are not fetched. A venue page does not grant a licence to reuse its pictures.",
		"Street photos are used only when OpenStreetMap references that Mapillary or Panoramax picture. A nearby frame is not treated as the storefront."
	].filter(Boolean).join(" ");
	const report = {
		osm,
		wikimedia: openPhoto,
		yelpConfigured,
		yelpMatch: yelp.match,
		yelpPhoto: Boolean(yelp.photo),
		foursquareConfigured: foursquareState.configured,
		foursquareMatch: foursquare.match,
		foursquarePhoto: Boolean(foursquare.photo),
		panoramax: Boolean(panoramax),
		mapillary: Boolean(mapillary),
		selected,
		note
	};
	console.info(`[PLACE PHOTO] commercial Place: ${place.name} OSM: ${osm ? "YES" : "NO"} Wikimedia: ${openPhoto ? "YES" : "NO"} Yelp match: ${yelpConfigured ? yelp.match ? "YES" : "NO" : "not called"} Yelp photo: ${yelp.photo ? "YES" : "NO"} Foursquare match: ${foursquareState.enabled ? foursquare.match ? "YES" : "NO" : "not called"} Panoramax: ${panoramax ? "YES" : "NO"} Selected: ${selected}`);
	return {
		photo,
		profile: yelp.profile || foursquare.profile,
		report
	};
}
var photoCache = new TtlCache(12096e5, 500, "photo");
var placePhotoCache = new TtlCache(216e5, 400, "photo");
var missCache = new TtlCache(36e5, 500, "photo");
var hintCache = new TtlCache(6048e5, 300, "photo");
var commonsGate = new RequestGate(12, 5e3);
var UA = "Kairos/1.0 (travel photos; contact: local)";
var THUMB = "960";
var urlToFile = /* @__PURE__ */ new Map();
var SEE = /* @__PURE__ */ new Set([
	"attraction",
	"museum",
	"park",
	"garden",
	"viewpoint",
	"landmark",
	"historic",
	"theme_park",
	"zoo",
	"aquarium",
	"shopping",
	"beach",
	"family"
]);
function logPhoto(place, qid, candidates, photo, reason) {
	console.info(`[PLACE PHOTO] Place: ${place} Wikidata: ${qid || "-"} Candidates: ${candidates} Selected file: ${photo?.fileTitle || "-"} Thumbnail: ${photo?.thumbnailUrl || "-"} License: ${photo?.license || "-"} Render: ${photo ? "PASS" : "FAIL"} Failure reason: ${photo ? "-" : reason}`);
}
async function wikiGet(endpoint, params) {
	const url = new URL(endpoint);
	for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
	let wait = 400;
	let network = 0;
	let spins = 0;
	while (network < 3 && spins < 8) {
		spins += 1;
		if (!commonsGate.allow()) {
			await new Promise((resolve) => setTimeout(resolve, wait));
			wait = Math.min(wait * 2, 2e3);
			continue;
		}
		network += 1;
		try {
			noteCall("photo", "wikimedia");
			const res = await fetch(url, {
				headers: {
					Accept: "application/json",
					"User-Agent": UA
				},
				signal: AbortSignal.timeout(12e3)
			});
			const text = await res.text();
			if ((res.status === 429 || res.status === 502 || res.status === 503 || !text.trim().startsWith("{")) && network < 3) {
				await new Promise((resolve) => setTimeout(resolve, wait));
				wait = Math.min(wait * 2, 2e3);
				continue;
			}
			if (!res.ok || !text.trim().startsWith("{")) {
				noteFailure("photo", "wikimedia", `HTTP ${res.status}`);
				return null;
			}
			return JSON.parse(text);
		} catch {
			if (network >= 3) break;
			await new Promise((resolve) => setTimeout(resolve, wait));
			wait = Math.min(wait * 2, 2e3);
		}
	}
	noteFailure("photo", "wikimedia", "Wikimedia did not answer.");
	return null;
}
function forgetPhotoUrl(url) {
	const key = urlToFile.get(stableMediaUrl(url)) || urlToFile.get(url);
	if (!key) return;
	photoCache.delete(key);
	urlToFile.delete(stableMediaUrl(url));
}
function remember(photo) {
	const key = fileKey(photo.fileTitle);
	photoCache.set(key, photo);
	missCache.delete(key);
	urlToFile.set(photo.thumbnailUrl, key);
	return photo;
}
function cachedPhoto(title) {
	return photoCache.get(fileKey(title)) ?? null;
}
async function imageInfoBatch(titles, source) {
	const found = /* @__PURE__ */ new Map();
	const pending = [];
	for (const title of titles) {
		const normalized = commonsFileTitle(title);
		if (!normalized) continue;
		const key = fileKey(normalized);
		if (found.has(key) || pending.some((item) => fileKey(item) === key)) continue;
		const cached = cachedPhoto(normalized);
		if (cached) {
			found.set(key, cached.source === source ? cached : {
				...cached,
				source
			});
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
			titles: chunk.join("|")
		});
		if (!body?.query) continue;
		const pages = body.query.pages ?? [];
		for (const page of pages) {
			const photo = photoFromImageInfo(source, page);
			if (photo) {
				remember(photo);
				found.set(fileKey(photo.fileTitle), photo);
			} else if (page.missing && page.title) missCache.set(fileKey(page.title), true);
		}
		for (const redirect of [...body.query.redirects ?? [], ...body.query.normalized ?? []]) {
			if (!redirect.from || !redirect.to) continue;
			const photo = found.get(fileKey(redirect.to));
			if (photo) found.set(fileKey(redirect.from), photo);
		}
		for (const title of chunk) {
			const key = fileKey(title);
			if (!found.has(key)) {
				if (pages.find((row) => row.title && fileKey(row.title) === key)?.missing) missCache.set(key, true);
			}
		}
	}
	return found;
}
async function imageInfoOne(title, source) {
	const map = await imageInfoBatch([title], source);
	const normalized = commonsFileTitle(title);
	return normalized ? map.get(fileKey(normalized)) ?? null : null;
}
async function wikidataPhotoHints(qid) {
	const cached = hintCache.get(qid);
	if (cached) return cached;
	const empty = {
		files: [],
		category: "",
		wikipedia: ""
	};
	const entity = (await wikiGet("https://www.wikidata.org/w/api.php", {
		action: "wbgetentities",
		format: "json",
		props: "claims|sitelinks",
		ids: qid
	}))?.entities?.[qid];
	if (!entity || entity.missing) return empty;
	const files = [];
	const take = (prop) => {
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
	const hints = {
		files,
		category,
		wikipedia
	};
	if (files.length || category || wikipedia) hintCache.set(qid, hints);
	return hints;
}
async function wikidataPhotoHintsBatch(qids) {
	const out = /* @__PURE__ */ new Map();
	const pending = [];
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
			ids: chunk.join("|")
		});
		for (const qid of chunk) {
			const entity = body?.entities?.[qid];
			if (!entity || entity.missing) continue;
			const files = [];
			for (const prop of ["P18", "P9721"]) for (const claim of entity.claims?.[prop] ?? []) {
				const value = claim.mainsnak?.datavalue?.value;
				if (typeof value !== "string") continue;
				const title = commonsFileTitle(value);
				if (title && !files.includes(title)) files.push(title);
			}
			const categoryValue = entity.claims?.P373?.[0]?.mainsnak?.datavalue?.value;
			const category = typeof categoryValue === "string" ? commonsCategoryTitle(categoryValue) : "";
			const en = entity.sitelinks?.enwiki?.title || "";
			const ja = entity.sitelinks?.jawiki?.title || "";
			const wikipedia = en ? `en:${en}` : ja ? `ja:${ja}` : "";
			const hints = {
				files,
				category,
				wikipedia
			};
			if (files.length || category || wikipedia) hintCache.set(qid, hints);
			out.set(qid, hints);
		}
	}
	return out;
}
async function wikipediaLeadFile(wikipedia) {
	const parsed = parseWikipedia(wikipedia);
	if (!parsed) return "";
	const page = (await wikiGet(`https://${parsed.lang}.wikipedia.org/w/api.php`, {
		action: "query",
		format: "json",
		formatversion: "2",
		redirects: "1",
		prop: "pageimages",
		piprop: "name",
		titles: parsed.title
	}))?.query?.pages?.find((row) => row.pageimage && !row.missing);
	return page?.pageimage ? commonsFileTitle(page.pageimage) : "";
}
async function wikipediaLeadBatch(rows) {
	const found = /* @__PURE__ */ new Map();
	const groups = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const parsed = parseWikipedia(row.wikipedia);
		if (!parsed) continue;
		const list = groups.get(parsed.lang) ?? [];
		list.push({
			id: row.id,
			title: parsed.title
		});
		groups.set(parsed.lang, list);
	}
	for (const [lang, list] of groups) for (let index = 0; index < list.length; index += 20) {
		const chunk = list.slice(index, index + 20);
		const body = await wikiGet(`https://${lang}.wikipedia.org/w/api.php`, {
			action: "query",
			format: "json",
			formatversion: "2",
			redirects: "1",
			prop: "pageimages",
			piprop: "name",
			titles: chunk.map((row) => row.title).join("|")
		});
		const byTitle = /* @__PURE__ */ new Map();
		for (const page of body?.query?.pages ?? []) {
			const file = page.pageimage ? commonsFileTitle(page.pageimage) : "";
			if (page.title && file) byTitle.set(page.title.toLowerCase(), file);
		}
		for (const row of chunk) {
			const file = byTitle.get(row.title.toLowerCase());
			if (file) found.set(row.id, file);
		}
	}
	return found;
}
async function categoryFiles(category) {
	const title = commonsCategoryTitle(category);
	if (!title) return [];
	return ((await wikiGet("https://commons.wikimedia.org/w/api.php", {
		action: "query",
		format: "json",
		formatversion: "2",
		list: "categorymembers",
		cmtitle: title,
		cmtype: "file",
		cmnamespace: "6",
		cmlimit: "24"
	}))?.query?.categorymembers ?? []).map((row) => row.title || "").filter(Boolean);
}
async function commonsSearch(name) {
	const query = name.trim();
	if (query.length < 4) return [];
	return ((await wikiGet("https://commons.wikimedia.org/w/api.php", {
		action: "query",
		format: "json",
		formatversion: "2",
		list: "search",
		srsearch: `intitle:"${query.replace(/"/g, "")}"`,
		srnamespace: "6",
		srlimit: "8"
	}))?.query?.search ?? []).map((row) => row.title || "").filter(Boolean);
}
function acceptable(photo, primary) {
	const score = scoreCommonsFile(photo.fileTitle, photo.width, photo.height, photo.mime);
	if (score <= -30) return false;
	return primary || score >= 0;
}
async function resolvePlacePhoto(input) {
	const bypass = Boolean(input.failedUrl || input.rejectFileTitles?.length);
	const key = [
		input.wikidataId || "",
		input.name || "",
		input.localName || "",
		input.fileTitle || "",
		input.commonsCategory || "",
		input.wikipedia || "",
		input.commercial ? "c" : ""
	].join("|").toLowerCase();
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
async function resolvePlacePhotoFresh(input) {
	const name = input.name.trim();
	const qid = /^Q\d+$/.test(input.wikidataId || "") ? input.wikidataId || "" : "";
	if (input.failedUrl) forgetPhotoUrl(input.failedUrl);
	const rejected = new Set((input.rejectFileTitles ?? []).map((title) => fileKey(commonsFileTitle(title) || title)));
	const ordered = [];
	const push = (source, title) => {
		const normalized = commonsFileTitle(title);
		if (!normalized || normalized.includes("|") || rejected.has(fileKey(normalized))) return;
		if (ordered.some((row) => fileKey(row.title) === fileKey(normalized))) return;
		ordered.push({
			source,
			title: normalized
		});
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
		const ranked = (await categoryFiles(category)).map((title) => ({
			title,
			score: scoreCommonsFile(title)
		})).filter((row) => row.score > -10 && !rejected.has(fileKey(row.title))).sort((a, b) => b.score - a.score).slice(0, 6);
		candidates += ranked.length;
		const infos = await imageInfoBatch(ranked.map((row) => row.title), "commons_category");
		let best = null;
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
		const matched = (await commonsSearch(name)).filter((title) => searchPhotoOk(input.name, title, input.localName || "") && !rejected.has(fileKey(title)));
		candidates += matched.length;
		const ranked = matched.map((title) => ({
			title,
			score: scoreCommonsFile(title)
		})).sort((a, b) => b.score - a.score);
		let best = null;
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
function qidOf(place) {
	if (place.wikidataId && /^Q\d+$/.test(place.wikidataId)) return place.wikidataId;
	return `${place.providerId} ${place.id}`.match(/\bQ\d+\b/)?.[0] ?? "";
}
function seedTitle(place) {
	return commonsFileTitle(place.commonsFile || "") || commonsFileTitle(place.imagePage || "") || commonsFileTitle(place.image || "");
}
async function attachPlacePhotos(places) {
	return shareRequest(`photos:${places.map((place) => place.id).slice(0, 12).join(",")}:${places.length}`, () => attach(places));
}
async function attach(places) {
	const photos = /* @__PURE__ */ new Map();
	const targets = places.filter((place) => place.category !== "stay" && place.category !== "transport");
	const seeded = [];
	for (const place of targets) {
		const title = seedTitle(place);
		if (!title) continue;
		const source = place.provider === "osm" && place.commonsFile ? "osm_wikimedia" : "wikidata_image";
		seeded.push({
			id: place.id,
			title,
			source
		});
	}
	const infos = await imageInfoBatch(seeded.map((row) => row.title), "wikidata_image");
	for (const row of seeded) {
		const photo = infos.get(fileKey(row.title));
		if (photo && acceptable(photo, true)) photos.set(row.id, {
			...photo,
			source: row.source
		});
	}
	const needsHints = targets.filter((place) => !photos.has(place.id) && SEE.has(place.category) && qidOf(place)).slice(0, 40);
	const hints = await wikidataPhotoHintsBatch(needsHints.map(qidOf));
	const fromClaims = [];
	const categories = /* @__PURE__ */ new Map();
	const wikis = /* @__PURE__ */ new Map();
	for (const place of needsHints) {
		const hint = hints.get(qidOf(place));
		if (!hint) continue;
		if (hint.category) categories.set(place.id, hint.category);
		if (hint.wikipedia) wikis.set(place.id, hint.wikipedia);
		const title = hint.files[0];
		if (title) fromClaims.push({
			id: place.id,
			title
		});
	}
	const claimed = await imageInfoBatch(fromClaims.map((row) => row.title), "wikidata_image");
	for (const row of fromClaims) {
		const photo = claimed.get(fileKey(row.title));
		if (photo && acceptable(photo, true)) photos.set(row.id, photo);
	}
	const leads = await wikipediaLeadBatch(targets.filter((place) => !photos.has(place.id) && SEE.has(place.category) && (place.wikipedia || wikis.has(place.id))).slice(0, 20).map((place) => ({
		id: place.id,
		wikipedia: place.wikipedia || wikis.get(place.id) || ""
	})));
	const leadInfos = await imageInfoBatch([...leads.values()], "wikipedia_lead");
	for (const [id, title] of leads) {
		const photo = leadInfos.get(fileKey(title));
		if (photo && acceptable(photo, true)) photos.set(id, {
			...photo,
			source: "wikipedia_lead"
		});
	}
	const categoryTargets = targets.filter((place) => !photos.has(place.id) && SEE.has(place.category) && (place.commonsCategory || categories.has(place.id))).slice(0, 4);
	for (const place of categoryTargets) {
		const ranked = (await categoryFiles(place.commonsCategory || categories.get(place.id) || "")).map((title) => ({
			title,
			score: scoreCommonsFile(title)
		})).filter((row) => row.score > -10).sort((a, b) => b.score - a.score).slice(0, 6);
		const infos = await imageInfoBatch(ranked.map((row) => row.title), "commons_category");
		let best = null;
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
	const searchTargets = targets.filter((place) => !photos.has(place.id) && SEE.has(place.category) && (place.importance === "iconic" || place.importance === "major" || (place.sitelinks ?? 0) >= 25)).slice(0, 4);
	for (const place of searchTargets) {
		const ranked = (await commonsSearch(place.name)).filter((title) => searchPhotoOk(place.name, title, place.nameLocal || place.localName || "")).map((title) => ({
			title,
			score: scoreCommonsFile(title)
		})).sort((a, b) => b.score - a.score).slice(0, 3);
		const infos = await imageInfoBatch(ranked.map((row) => row.title), "commons_search");
		let best = null;
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
	const profiles = /* @__PURE__ */ new Map();
	for (const place of commercial) {
		const enriched = await enrichCommercialPlace(place, false);
		if (enriched.photo) photos.set(place.id, enriched.photo);
		if (enriched.profile) profiles.set(place.id, enriched.profile);
	}
	const galleries = /* @__PURE__ */ new Map();
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
		const ranked = (await categoryFiles(category)).map((title) => ({
			title,
			score: scoreCommonsFile(title)
		})).filter((row) => row.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
		const infos = await imageInfoBatch(ranked.map((row) => row.title), "commons_category");
		const chosen = [];
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
		const list = [
			best && bestScore >= heroScore + 8 ? best : hero ?? best ?? null,
			hero,
			...chosen
		].filter((item) => Boolean(item));
		const unique = [];
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
		if (!photo) return place.image && !isPermittedPhotoUrl(place.image) ? {
			...place,
			image: "",
			imagePage: ""
		} : place;
		return {
			...place,
			photo,
			photos: galleries.get(place.id) || [photo],
			image: photo.thumbnailUrl,
			imagePage: photo.descriptionUrl || place.imagePage,
			commerce: profiles.get(place.id) || place.commerce
		};
	});
}
//#endregion
export { attachPlacePhotos, resolvePlacePhoto };
