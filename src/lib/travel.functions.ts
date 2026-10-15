import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { explicitChildAges, TRAVEL_INTERESTS, TRAVEL_STYLES } from "@/lib/travel";

export const searchTravelDestinations = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ query: z.string().trim().min(2).max(80) }).parse(input))
  .handler(async ({ data }) => {
    const { searchTravelDestinations: search } = await import("./travel.server");
    return search(data.query);
  });

const area = z.object({
  name: z.string().trim().min(2).max(80),
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  countryCode: z.string().trim().max(8).optional().default(""),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
});

const brief = z.object({
  destination: z.string().trim().min(2).max(80),
  address: z.string().trim().max(160).optional().default(""),
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nights: z.number().int().min(1).max(90),
  adults: z.number().int().min(1).max(16),
  childAges: z.array(z.number().int().min(0).max(17)).max(6).optional().default([]),
  pace: z.enum(["relaxed", "balanced", "full"]),
  move: z.enum(["walk", "drive", "transit"]),
  budget: z.enum(["simple", "mid", "splurge"]),
  interests: z.array(z.enum(TRAVEL_INTERESTS)).max(7).optional().default([]),
  oneBase: z.boolean(),
  rejected: z.array(z.string().trim().max(80)).max(24).optional().default([]),
  lockedDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(7).optional().default([]),
  salt: z.number().int().min(0).max(20).optional().default(0),
  areas: z.array(area).max(3).optional().default([]),
  mustVisit: z.array(z.string().trim().max(80)).max(8).optional().default([]),
  styles: z.array(z.enum(TRAVEL_STYLES)).max(2).optional().default(["comfort"]),
  balance: z.enum(["city", "balanced", "nature"]).optional().default("balanced"),
  firstVisit: z.boolean().optional().default(true),
  focus: z.enum(["icons", "local"]).optional().default("icons"),
  foodPlanning: z.enum(["minimal", "meals", "balanced", "feature"]).optional().default("balanced"),
});

export const resolveTravelHotel = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({
    query: z.string().trim().min(2).max(120),
    near: z.array(z.object({ lat: z.number().gte(-90).lte(90), lng: z.number().gte(-180).lte(180) })).min(1).max(8),
  }).parse(input))
  .handler(async ({ data }) => {
    const { locateHotel } = await import("./travel.server");
    return locateHotel(data.query, data.near);
  });

export const planTrip = createServerFn({ method: "POST" })
  .validator((input: unknown) => brief.parse(input))
  .handler(async ({ data }) => {
    const { planTravel } = await import("./travel.server");
    return planTravel({
      ...data,
      address: data.address ?? "",
      childAges: explicitChildAges(data.childAges),
      interests: data.interests ?? [],
      rejected: data.rejected ?? [],
      lockedDates: data.lockedDates ?? [],
      salt: data.salt ?? 0,
      areas: data.areas ?? [],
      mustVisit: data.mustVisit ?? [],
      styles: data.styles ?? ["comfort"],
      balance: data.balance ?? "balanced",
      firstVisit: data.firstVisit !== false,
      focus: data.focus ?? "icons",
      foodPlanning: data.foodPlanning ?? "balanced",
    });
  });

export const refreshPlacePhoto = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({
    name: z.string().trim().max(120).optional().default(""),
    localName: z.string().trim().max(120).optional().default(""),
    wikidataId: z.string().trim().max(16).optional().default(""),
    fileTitle: z.string().trim().max(300).optional().default(""),
    imagePage: z.string().trim().max(500).optional().default(""),
    osmFile: z.string().trim().max(300).optional().default(""),
    commonsCategory: z.string().trim().max(200).optional().default(""),
    wikipedia: z.string().trim().max(200).optional().default(""),
    failedUrl: z.string().trim().max(500).optional().default(""),
    rejectFileTitles: z.array(z.string().trim().max(300)).max(8).optional().default([]),
    category: z.string().trim().max(40).optional().default(""),
  }).parse(input))
  .handler(async ({ data }) => {
    const { resolvePlacePhoto } = await import("./travel-photo.server");
    const { isCommercialCategory } = await import("./travel-photo");
    const qid = /^Q\d+$/.test(data.wikidataId) ? data.wikidataId : "";
    return resolvePlacePhoto({ ...data, wikidataId: qid, commercial: isCommercialCategory(data.category) });
  });

export const routeTripDay = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({
    move: z.enum(["walk", "drive", "transit"]),
    points: z.array(z.object({
      lat: z.number().gte(-90).lte(90),
      lng: z.number().gte(-180).lte(180),
    })).min(2).max(8),
  }).parse(input))
  .handler(async ({ data }) => {
    const { routeTravelDay } = await import("./travel.server");
    return routeTravelDay(data.move, data.points);
  });