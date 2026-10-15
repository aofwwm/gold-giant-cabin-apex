import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { FAMILY_INTERESTS } from "@/lib/family";

const pin = z.object({
  placeId: z.string().max(80),
  kind: z.enum(["activity", "lunch", "dinner"]),
  title: z.string().max(80),
  address: z.string().max(160),
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  setting: z.enum(["indoor", "outdoor", ""]),
});

const brief = z.object({
  adults: z.number().int().min(1).max(8),
  ages: z.array(z.number().int().min(0).max(17)).max(6),
  when: z.string().trim().max(40).optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().trim().min(2).max(80),
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
  startAddress: z.string().trim().max(160).optional().default(""),
  endLabel: z.string().trim().min(2).max(80),
  endAddress: z.string().trim().max(160).optional().default(""),
  endLatitude: z.number().gte(-90).lte(90),
  endLongitude: z.number().gte(-180).lte(180),
  maxTravel: z.number().int().min(15).max(120),
  budget: z.number().int().min(0).max(500),
  freeOnly: z.boolean(),
  setting: z.enum(["indoor", "outdoor", "either", "mix"]),
  interests: z.array(z.enum(FAMILY_INTERESTS)).max(12),
  avoid: z.array(z.string().trim().max(40)).max(8).optional().default([]),
  toddler: z.boolean(),
  stroller: z.boolean(),
  mixedAge: z.boolean(),
  rainSafe: z.boolean(),
  wheelchair: z.boolean().optional().default(false),
  longWalk: z.boolean().optional().default(false),
  span: z.enum(["short", "half", "full"]),
  pace: z.enum(["relaxed", "balanced", "packed"]),
  travelMode: z.enum(["drive", "transit", "ride", "walk"]),
  startMin: z.number().int().min(360).max(1200),
  endMin: z.number().int().min(420).max(1380),
  napStart: z.number().int().min(0).max(1440).nullable().optional().default(null),
  napEnd: z.number().int().min(0).max(1440).nullable().optional().default(null),
  booking: z.enum(["any", "free", "nobook"]).optional().default("any"),
  rejected: z.array(z.string().max(80)).max(24).optional().default([]),
  locked: z.array(pin).max(8).optional().default([]),
  text: z.string().trim().max(500).optional().default(""),
});

export const planFamily = createServerFn({ method: "POST" })
  .validator((input: unknown) => brief.parse(input))
  .handler(async ({ data }) => {
    const { searchFamily } = await import("./family.server");
    return searchFamily({ ...data, avoid: data.avoid ?? [], wheelchair: data.wheelchair ?? false, longWalk: data.longWalk ?? false, napStart: data.napStart ?? null, napEnd: data.napEnd ?? null, booking: data.booking ?? "any", rejected: data.rejected ?? [], locked: data.locked ?? [], text: data.text ?? "", when: data.when ?? "", startAddress: data.startAddress ?? "", endAddress: data.endAddress ?? "" });
  });

const savedStop = z.object({
  sequence: z.number().int().min(0).max(24),
  stopType: z.string().max(20),
  title: z.string().max(80),
  address: z.string().max(160),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  startTime: z.string().max(8),
  endTime: z.string().max(8),
  estimatedCost: z.number().nullable(),
  indoorOutdoor: z.string().max(12),
  sourceUrl: z.string().max(200).optional().default(""),
  sourceType: z.string().max(20),
  locked: z.boolean(),
});

export const saveFamilyPlan = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        title: z.string().trim().min(2).max(80),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        startTime: z.string().max(8),
        endTime: z.string().max(8),
        startLocation: z.string().max(80),
        endLocation: z.string().max(80),
        adults: z.number().int(),
        childAges: z.array(z.number()),
        budget: z.number().int(),
        travelMode: z.string().max(20),
        pace: z.string().max(20),
        interests: z.array(z.string()).max(12),
        preferences: z.record(z.string(), z.string()).optional().default({}),
        familyScore: z.number().int().nullable(),
        stops: z.array(savedStop).max(24),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { getSupabase, supabaseConfigured } = await import("./supabase");
    if (!supabaseConfigured()) return { saved: false as const, reason: "supabase" as const };
    const supabase = getSupabase();
    const inserted = await supabase
      .from("family_plans")
      .insert({
        title: data.title,
        start_date: data.startDate,
        start_time: data.startTime,
        end_time: data.endTime,
        start_location: data.startLocation,
        end_location: data.endLocation,
        adults: data.adults,
        child_ages: data.childAges,
        budget: data.budget,
        travel_mode: data.travelMode,
        pace: data.pace,
        interests: data.interests,
        preferences: data.preferences,
        family_score: data.familyScore,
      })
      .select("id")
      .single();
    if (inserted.error || !inserted.data?.id) return { saved: false as const, reason: "table" as const };
    const planId = inserted.data.id as string;
    if (data.stops.length) {
      await supabase.from("family_plan_stops").insert(
        data.stops.map((stop) => ({
          plan_id: planId,
          sequence: stop.sequence,
          stop_type: stop.stopType,
          title: stop.title,
          address: stop.address,
          latitude: stop.latitude,
          longitude: stop.longitude,
          start_time: stop.startTime,
          end_time: stop.endTime,
          estimated_cost: stop.estimatedCost,
          indoor_outdoor: stop.indoorOutdoor,
          source_url: stop.sourceUrl,
          source_type: stop.sourceType,
          locked: stop.locked,
        })),
      );
    }
    return { saved: true as const, id: planId };
  });
