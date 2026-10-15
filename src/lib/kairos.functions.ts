import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { missionSchema } from "@/lib/mission";
import { FORMATS, MAKAN_WHEN, PLATFORMS } from "@/lib/place";

function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Check that and try again");
  }
  return result.data;
}

const localTime = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Check the date and time");

const codeSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9]{4,12}$/, "That code does not look right")
  .transform((value) => value.toLowerCase());

const nicknameSchema = z
  .string()
  .trim()
  .min(1, "Add a nickname")
  .max(24, "Nickname is too long")
  .refine((value) => !value.includes("@"), "Use a nickname, not an email")
  .refine((value) => !/[\u0000-\u001f]/.test(value), "That nickname will not print");

const CreateInput = z.object({
  title: z.string().trim().min(2, "Give it a name").max(180, "Keep the purpose to a sentence or two"),
  kind: z.enum(["meeting", "makan"]),
  durationMin: z.union([z.literal(30), z.literal(45), z.literal(60), z.literal(90), z.literal(120)]),
  category: z.enum(["", "supper", "pickle", "board", "drink", "neighbourhood"]),
  slots: z
    .array(
      z.object({
        startsAt: localTime,
        label: z.string().trim().max(80).optional(),
      }),
    )
    .max(6, "Six times is enough drama"),
  anchorAt: z.string().optional(),
  mission: missionSchema.optional(),
  missionSource: z.enum(["grok", "rules"]).optional(),
  place: z
    .object({
      format: z.enum(FORMATS),
      venueName: z.string().trim().max(80).optional().default(""),
      room: z.string().trim().max(80).optional().default(""),
      address: z.string().trim().max(160).optional().default(""),
      platform: z.enum(PLATFORMS).optional().default(""),
      meetingUrl: z.string().trim().max(300).optional().default(""),
      makanWhen: z.enum(MAKAN_WHEN).optional().default(""),
    })
    .optional(),
});

export const fetchEvent = createServerFn({ method: "GET" })
  .validator((input: unknown) => parse(z.object({ code: codeSchema }), input))
  .handler(async ({ data }) => {
    const { loadEvent } = await import("./kairos.functions.server");
    return loadEvent(data.code);
  });

export const createEvent = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(CreateInput, input))
  .handler(async ({ data }) => {
    const { createEvent: create } = await import("./kairos.functions.server");
    return create(data);
  });

export const castVote = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    parse(
      z.object({
        code: codeSchema,
        slotId: z.string().trim().min(6).max(16),
        nickname: nicknameSchema,
        choice: z.enum(["love", "yes", "soft", "no"]),
      }),
      input,
    ),
  )
  .handler(async ({ data }) => {
    const { castVote: vote } = await import("./kairos.functions.server");
    return vote(data);
  });

export const addSlot = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    parse(
      z.object({
        code: codeSchema,
        startsAt: localTime,
        label: z.string().trim().max(80).optional(),
      }),
      input,
    ),
  )
  .handler(async ({ data }) => {
    const { addSlot: add } = await import("./kairos.functions.server");
    return add(data);
  });

export const addComment = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    parse(
      z.object({
        code: codeSchema,
        nickname: nicknameSchema,
        body: z.string().trim().min(1, "Write a short note").max(180, "Keep the slip short"),
      }),
      input,
    ),
  )
  .handler(async ({ data }) => {
    const { addComment: add } = await import("./kairos.functions.server");
    return add(data);
  });

export const consultOracle = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(z.object({ code: codeSchema }), input))
  .handler(async ({ data }) => {
    const { consultOracle: consult } = await import("./kairos.functions.server");
    return consult(data);
  });

export const spinVenue = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    parse(
      z.object({
        code: codeSchema,
        category: z.enum(["supper", "pickle", "board", "drink", "neighbourhood"]),
        startsAt: z.string().optional(),
      }),
      input,
    ),
  )
  .handler(async ({ data }) => {
    const { spinVenue: spin } = await import("./kairos.functions.server");
    return spin(data);
  });
