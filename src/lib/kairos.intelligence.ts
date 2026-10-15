import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { missionSchema } from "@/lib/mission";

const codeSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9]{4,12}$/)
  .transform((value) => value.toLowerCase());

const durationSchema = z.union([z.literal(30), z.literal(45), z.literal(60), z.literal(90), z.literal(120)]);

export const analyzeMission = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        title: z.string().trim().min(2).max(200),
        kind: z.enum(["meeting", "makan"]),
        durationMin: durationSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { analyzeMission: analyze } = await import("./kairos.intelligence.server");
    return analyze(data);
  });

export const explainKairos = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ code: codeSchema, refresh: z.boolean().optional() }).parse(input))
  .handler(async ({ data }) => {
    const { explainKairos: explain } = await import("./kairos.intelligence.server");
    return explain(data);
  });

export const interpretCosmos = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ code: codeSchema, slotId: z.string().trim().min(6).max(16) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { interpretCosmos: interpret } = await import("./kairos.intelligence.server");
    return interpret(data);
  });

export const saveMission = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        code: codeSchema,
        mission: missionSchema,
        source: z.enum(["grok", "rules"]).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { saveMission: save } = await import("./kairos.intelligence.server");
    return save(data);
  });
