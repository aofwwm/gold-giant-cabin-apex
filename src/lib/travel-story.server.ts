import "@tanstack/react-start/server-only";

import { geminiJson } from "@/lib/gemini.server";
import { noteCall } from "@/lib/provider-usage";
import { shareRequest, TtlCache } from "@/lib/travel-cache";
import { readableName } from "@/lib/travel-names";
import {
  acceptExperienceLine,
  buildPlaceStory,
  nearbyPlaceNames,
  type PlaceStory,
  type StoryInput,
} from "@/lib/travel-story";

const extractCache = new TtlCache<string>(14 * 24 * 60 * 60 * 1000, 400, "discovery");
const storyCache = new TtlCache<Record<string, { whyIconic: string; whyGo: string }>>(7 * 24 * 60 * 60 * 1000, 40, "gemini");
const SEE = new Set(["attraction", "museum", "park", "garden", "viewpoint", "landmark", "historic", "theme_park", "zoo", "aquarium", "shopping", "beach", "family"]);
const UA = "Kairos/1.0 (travel; contact: local)";

type StoryPlace = StoryInput & {
  id: string;
  lat: number;
  lng: number;
  displayName?: string;
  nameEn?: string;
  wikipedia?: string;
  photo?: { source?: string };
  localNameSource?: string;
  story?: PlaceStory;
};

function wikiTitle(place: StoryPlace): string {
  const wiki = place.wikipedia || "";
  if (/^en:/i.test(wiki)) return wiki.slice(3).replace(/_/g, " ").trim();
  const source = (place.name || "").trim();
  if (source && !/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(source)) return source;
  const english = (place.displayName || place.nameEn || "").trim();
  if (english) return english;
  return source;
}

async function wikipediaExtracts(titles: string[]): Promise<Map<string, string>> {
  const found = new Map<string, string>();
  const pending: string[] = [];
  for (const title of titles) {
    const cached = extractCache.get(title.toLowerCase());
    if (cached) found.set(title.toLowerCase(), cached);
    else if (!pending.some((item) => item.toLowerCase() === title.toLowerCase())) pending.push(title);
  }
  for (let index = 0; index < pending.length; index += 20) {
    const chunk = pending.slice(index, index + 20);
    const url = new URL("https://en.wikipedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("format", "json");
    url.searchParams.set("formatversion", "2");
    url.searchParams.set("redirects", "1");
    url.searchParams.set("prop", "extracts");
    url.searchParams.set("exintro", "1");
    url.searchParams.set("explaintext", "1");
    url.searchParams.set("exsentences", "2");
    url.searchParams.set("titles", chunk.join("|"));
    noteCall("discovery", "wikipedia");
    const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA }, signal: AbortSignal.timeout(12000) }).catch(() => null);
    if (!res?.ok) continue;
    const body = (await res.json()) as { query?: { redirects?: { from?: string; to?: string }[]; pages?: { title?: string; extract?: string; missing?: boolean }[] } };
    const byTitle = new Map<string, string>();
    for (const page of body.query?.pages ?? []) {
      const extract = (page.extract || "").replace(/\s*\([^)]*[:[\]][^)]*\)/g, " ").replace(/\s+/g, " ").trim();
      if (page.title && extract && !page.missing) byTitle.set(page.title.toLowerCase(), extract.slice(0, 700));
    }
    for (const redirect of body.query?.redirects ?? []) {
      const extract = redirect.to ? byTitle.get(redirect.to.toLowerCase()) : "";
      if (redirect.from && extract) byTitle.set(redirect.from.toLowerCase(), extract);
    }
    for (const title of chunk) {
      const extract = byTitle.get(title.toLowerCase()) || "";
      if (!extract) continue;
      extractCache.set(title.toLowerCase(), extract);
      found.set(title.toLowerCase(), extract);
    }
  }
  return found;
}

async function rewriteBatch(rows: { id: string; name: string; category: string; facts: string; whyIconic: string; whyGo: string }[]): Promise<Record<string, { whyIconic: string; whyGo: string }>> {
  const key = rows.map((row) => `${row.id}:${row.facts.slice(0, 80)}`).join("|").slice(0, 500);
  const cached = storyCache.get(key);
  if (cached) return cached;
  const raw = await geminiJson(
    "Rewrite traveller-facing lines using only the facts given for each place. Do not add dates, people, heights, or events that are not in facts. Do not say popular, must-see, worth visiting, famous place, open place list, or private ranking. whyIconic is one specific sentence. whyGo is the experience, not a repeat of whyIconic. If the facts are only a location, return empty strings.",
    JSON.stringify({ places: rows.map((row) => ({ id: row.id, name: row.name, category: row.category, facts: row.facts.slice(0, 500) })) }),
    {
      type: "object",
      properties: {
        places: {
          type: "array",
          items: {
            type: "object",
            properties: { id: { type: "string" }, whyIconic: { type: "string" }, whyGo: { type: "string" } },
            required: ["id", "whyIconic", "whyGo"],
          },
        },
      },
      required: ["places"],
    },
    1400,
  ).catch(() => null);
  const list = raw && typeof raw === "object" && Array.isArray((raw as { places?: unknown }).places)
    ? (raw as { places: { id?: string; whyIconic?: string; whyGo?: string }[] }).places
    : [];
  const out: Record<string, { whyIconic: string; whyGo: string }> = {};
  for (const row of rows) {
    const hit = list.find((item) => item.id === row.id);
    const facts = row.facts;
    const whyIconic = acceptExperienceLine(hit?.whyIconic || "", facts) ? (hit?.whyIconic || "").replace(/\s+/g, " ").trim().slice(0, 280) : "";
    const whyGo = acceptExperienceLine(hit?.whyGo || "", facts) ? (hit?.whyGo || "").replace(/\s+/g, " ").trim().slice(0, 280) : "";
    if (whyIconic || whyGo) out[row.id] = { whyIconic, whyGo };
  }
  if (Object.keys(out).length) storyCache.set(key, out);
  return out;
}

export async function attachPlaceStories<T extends StoryPlace>(places: T[], city: string): Promise<T[]> {
  const notable = places.filter((place) => SEE.has(place.category) && (place.importance === "iconic" || place.importance === "major" || place.importance === "interest")).slice(0, 24);
  if (!notable.length) return places;
  const key = `${city}:${notable.map((place) => place.id).join(",")}`;
  return shareRequest(`stories:${key}`, async () => {
    const titles = notable.map(wikiTitle).filter((title) => title.length > 2);
    const extracts = await wikipediaExtracts(titles).catch(() => new Map<string, string>());
    const drafted = places.map((place) => {
      if (!SEE.has(place.category)) return place;
      const title = wikiTitle(place).toLowerCase();
      const story = buildPlaceStory({
        ...place,
        city,
        extract: extracts.get(title) || "",
        imageSource: place.photo?.source || "",
      }, nearbyPlaceNames(place, places));
      return { ...place, story };
    });
    const batch = drafted
      .filter((place) => place.story && (place.importance === "iconic" || place.importance === "major") && (place.story.factSource === "wikipedia" || (place.description && place.description.length > 40)))
      .slice(0, 20)
      .map((place) => ({
        id: place.id,
        name: readableName(place),
        category: place.category,
        facts: `${extracts.get(wikiTitle(place).toLowerCase()) || ""} ${place.description || ""}`.trim(),
        whyIconic: place.story?.whyIconic || "",
        whyGo: place.story?.whyGo || "",
      }))
      .filter((row) => row.facts.length > 40);
    const rewritten = batch.length ? await rewriteBatch(batch).catch(() => ({} as Record<string, { whyIconic: string; whyGo: string }>)) : {};
    return drafted.map((place) => {
      const next = rewritten[place.id];
      if (!next || !place.story) return place;
      const whyIconic = next.whyIconic || place.story.whyIconic;
      const whyGo = next.whyGo || place.story.whyGo;
      return {
        ...place,
        story: {
          ...place.story,
          whyIconic,
          whyGo,
          shortDescription: whyGo || whyIconic || place.story.shortDescription,
          sourceConfidence: whyIconic ? "verified" : place.story.sourceConfidence,
        },
      };
    });
  });
}
