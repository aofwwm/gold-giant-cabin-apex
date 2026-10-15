import { createServerFn } from "@tanstack/react-start";
import { INVITE_SLUG, ensureInviteSlug } from "@/lib/dating-invite";
import { z } from "zod";
import { DATE_FOODS, DATE_TYPES, DATE_VIBES } from "@/lib/dating";

const brief = z.object({
  dateType: z.enum(DATE_TYPES),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  whenLabel: z.string().max(40).optional().default(""),
  startMin: z.number().int().min(360).max(1320),
  span: z.enum(["quick", "half", "full"]),
  budget: z.number().int().min(0).max(500),
  freeOnly: z.boolean(),
  latitude: z.number(),
  longitude: z.number(),
  area: z.string().trim().min(2).max(80),
  originAddress: z.string().max(160).optional().default(""),
  originProvider: z.string().max(40).optional().default(""),
  originId: z.string().max(80).optional().default(""),
  maxTravel: z.number().int().min(15).max(120),
  travelMode: z.enum(["drive", "walk", "ride", "transit"]),
  setting: z.enum(["indoor", "outdoor", "either", "mix"]),
  vibes: z.array(z.enum(DATE_VIBES)).max(8),
  foods: z.array(z.enum(DATE_FOODS)).max(8),
  pressure: z.enum(["low", "balanced", "memorable"]),
  formality: z.enum(["casual", "smart", "dress"]),
  alcohol: z.enum(["any", "none", "ok"]),
  crowd: z.enum(["avoid", "ok", "lively"]),
  diets: z.array(z.string().max(20)).max(6).optional().default([]),
  goal: z.string().max(40).optional().default(""),
  text: z.string().max(500).optional().default(""),
  rejected: z.array(z.string().max(120)).max(48).optional().default([]),
  rejectedVenues: z.array(z.string().max(120)).max(48).optional().default([]),
  seen: z.array(z.string().max(80)).max(24).optional().default([]),
  spin: z.number().int().min(0).max(24).optional().default(0),
  tightSecondLeg: z.boolean().optional().default(false),
  avoid: z.array(z.string().max(40)).max(6).optional().default([]),
  locked: z
    .array(
      z.object({
        placeId: z.string().max(80),
        title: z.string().max(80),
        address: z.string().max(160),
        latitude: z.number(),
        longitude: z.number(),
        setting: z.enum(["indoor", "outdoor"]),
        kind: z.enum(["meal", "cafe", "scenic", "activity"]),
      }),
    )
    .max(4)
    .optional()
    .default([]),
});

export const planDate = createServerFn({ method: "POST" })
  .validator((input: unknown) => brief.parse(input))
  .handler(async ({ data }) => {
    const { searchDating } = await import("./dating.server");
    return searchDating({
      ...data,
      whenLabel: data.whenLabel ?? "",
      diets: data.diets ?? [],
      goal: data.goal ?? "",
      text: data.text ?? "",
      rejected: data.rejected ?? [],
      rejectedVenues: data.rejectedVenues ?? [],
      tightSecondLeg: data.tightSecondLeg ?? false,
      avoid: data.avoid ?? [],
      locked: data.locked ?? [],
      seen: data.seen ?? [],
      spin: data.spin ?? 0,
    });
  });

export const parseDateBrief = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ text: z.string().max(500), today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(input))
  .handler(async ({ data }) => {
    const { parseDatingIntent } = await import("./dating.server");
    return parseDatingIntent(data.text, data.today);
  });

export const saveDatingPlan = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        title: z.string().min(2).max(80),
        dateType: z.string().max(20),
        budget: z.number().int(),
        travelMode: z.string().max(20),
        area: z.string().max(80),
        startTime: z.string().max(8),
        duration: z.string().max(20),
        preferences: z.record(z.string(), z.string()).optional().default({}),
        datingScore: z.number().int().nullable(),
        stops: z
          .array(
            z.object({
              sequence: z.number().int(),
              stopType: z.string().max(20),
              title: z.string().max(80),
              address: z.string().max(160),
              latitude: z.number(),
              longitude: z.number(),
              startTime: z.string().max(12),
              endTime: z.string().max(12),
              estimatedCost: z.number().nullable(),
              indoorOutdoor: z.string().max(12),
              sourceUrl: z.string().max(200).optional().default(""),
              sourceType: z.string().max(20),
              locked: z.boolean(),
            }),
          )
          .max(6),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { getSupabase, supabaseConfigured } = await import("./supabase");
    if (!supabaseConfigured()) return { saved: false as const, reason: "supabase" as const };
    const supabase = getSupabase();
    const inserted = await supabase
      .from("dating_plans")
      .insert({
        title: data.title,
        date_type: data.dateType,
        budget: data.budget,
        travel_mode: data.travelMode,
        area: data.area,
        start_time: data.startTime,
        duration: data.duration,
        preferences: data.preferences,
        dating_score: data.datingScore,
      })
      .select("id")
      .single();
    if (inserted.error || !inserted.data?.id) return { saved: false as const, reason: "table" as const };
    await supabase.from("dating_plan_stops").insert(
      data.stops.map((stop) => ({
        plan_id: inserted.data.id,
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
    return { saved: true as const, id: inserted.data.id as string };
  });

const inviteInput = z.object({
  title: z.string().min(2).max(80),
  whenLabel: z.string().max(60),
  area: z.string().max(80),
  message: z.string().max(280),
  note: z.string().max(180).optional().default(""),
  duration: z.string().max(40),
  dress: z.string().max(40),
  vibe: z.string().max(80),
  tone: z.enum(["minimal", "warm", "playful", "romantic"]),
  visibility: z.enum(["full", "first", "mystery"]),
  recipientName: z.string().max(40).optional().default(""),
  dateType: z.string().max(20),
  stops: z
    .array(
      z.object({
        slot: z.string().max(40),
        title: z.string().max(80),
        address: z.string().max(160),
        time: z.string().max(40),
        setting: z.string().max(12),
      }),
    )
    .max(8),
  footer: z.string().max(80),
  slug: z.string().regex(INVITE_SLUG),
  editToken: z.string().max(80).optional().default(""),
});

function parseInviteInput(input: unknown) {
  const source = input && typeof input === "object" ? { ...(input as Record<string, unknown>) } : {};
  const incoming = typeof source.slug === "string" ? source.slug : "";
  console.log("[INVITE] payload before validation", { ...source, slug: incoming });
  console.log("[INVITE] slug", incoming);
  console.log("[INVITE] slug length", incoming.length);
  console.log("[INVITE] regex passes", INVITE_SLUG.test(incoming));
  const slug = ensureInviteSlug(incoming);
  console.log("[INVITE] slug used", slug);
  console.log("[INVITE] slug used length", slug.length);
  console.log("[INVITE] regex passes", INVITE_SLUG.test(slug));
  return inviteInput.parse({ ...source, slug });
}

export const createDatingInvite = createServerFn({ method: "POST" })
  .validator(parseInviteInput)
  .handler(async ({ data }) => {
    const { saveDatingInvite } = await import("./dating-invite.server");
    const saved = await saveDatingInvite({
      ...data,
      note: data.note ?? "",
      recipientName: data.recipientName ?? "",
      slug: data.slug ?? "",
      status: "pending",
      replyNote: "",
      replyTimes: [],
      updatedAt: "",
    }, data.editToken ?? "");
    return saved;
  });

export const fetchDatingInvite = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ slug: z.string().min(1).max(64) }).parse(input))
  .handler(async ({ data }) => {
    const { readPublicInvite } = await import("./dating-invite.server");
    return readPublicInvite(data.slug);
  });

export const fetchPlannerDatingInvite = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ plannerToken: z.string().regex(INVITE_SLUG) }).parse(input))
  .handler(async ({ data }) => {
    const { readPlannerInvite } = await import("./dating-invite.server");
    return readPlannerInvite(data.plannerToken);
  });

export const revokeDatingInvite = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ plannerToken: z.string().regex(INVITE_SLUG) }).parse(input))
  .handler(async ({ data }) => {
    const { revokePlannerInvite } = await import("./dating-invite.server");
    return revokePlannerInvite(data.plannerToken);
  });

export const answerDatingInvite = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        slug: z.string().regex(INVITE_SLUG),
        status: z.enum(["sounds_good", "alternate_time_requested"]),
        note: z.string().max(280).optional().default(""),
        times: z.array(z.string().max(40)).max(3).optional().default([]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { replyDatingInvite } = await import("./dating-invite.server");
    return replyDatingInvite(data.slug, { status: data.status, note: data.note ?? "", times: data.times ?? [] });
  });

export const polishDatingInvite = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        tone: z.enum(["minimal", "warm", "playful", "romantic"]),
        draft: z.string().max(280),
        note: z.string().max(180).optional().default(""),
        dateType: z.string().max(20),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { suggestInviteLine } = await import("./dating-invite.server");
    const message = await suggestInviteLine({ tone: data.tone, draft: data.draft, note: data.note ?? "", dateType: data.dateType });
    return { message };
  });
