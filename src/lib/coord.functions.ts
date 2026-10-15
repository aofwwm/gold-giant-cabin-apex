import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CUISINE_OPTIONS, MORE_CUISINES, PLACE_TYPES } from "@/lib/coord";

const minutes = z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(25)]);
const cuisineEnum = z.enum([...CUISINE_OPTIONS, ...MORE_CUISINES].map((item) => item.id) as [
  (typeof CUISINE_OPTIONS)[number]["id"],
  ...(typeof MORE_CUISINES)[number]["id"][],
]);
const placeEnum = z.enum(PLACE_TYPES.map((item) => item.id) as [(typeof PLACE_TYPES)[number]["id"], ...((typeof PLACE_TYPES)[number]["id"])[]]);

export const findMakan = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        text: z.string().trim().max(400).optional().default(""),
        areaId: z.string().trim().max(24).optional().default(""),
        address: z.string().trim().max(160).optional().default(""),
        groupSize: z.number().int().min(1).max(40).optional().default(4),
        minutes,
        budget: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional().default(0),
        dietary: z.enum(["", "halal", "vegetarian", "vegan"]).optional().default(""),
        mood: z.enum(["", "quick", "comfortable", "different", "coffee", "casual"]).optional().default(""),
        timing: z.enum(["", "before", "after"]).optional().default(""),
        explain: z.boolean().optional().default(true),
        latitude: z.number().gte(-90).lte(90).nullable().optional(),
        longitude: z.number().gte(-180).lte(180).nullable().optional(),
        originSource: z.enum(["", "meeting", "office", "home", "current", "choose"]).optional().default(""),
        originName: z.string().trim().max(80).optional().default(""),
        allowDistance: z.boolean().optional().default(false),
        cuisines: z.array(cuisineEnum).max(16).optional().default([]),
        placeTypes: z.array(placeEnum).max(5).optional().default([]),
        savedPlaces: z
          .array(
            z.object({
              id: z.string().trim().max(80),
              name: z.string().trim().max(80),
              address: z.string().trim().max(160).optional().default(""),
              latitude: z.number().gte(-90).lte(90),
              longitude: z.number().gte(-180).lte(180),
              cuisine: z.string().trim().max(80).optional().default(""),
              placeKind: z.string().trim().max(24).optional().default(""),
            }),
          )
          .max(24)
          .optional()
          .default([]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { searchMakan } = await import("./coord.server");
    return searchMakan(data);
  });

export const findOuting = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        text: z.string().trim().min(8).max(500),
        areaId: z.string().trim().max(24).optional().default(""),
        groupSize: z.number().int().min(2).max(80).optional().default(12),
        budget: z.number().int().min(0).max(200).optional().default(50),
        budgetMin: z.number().int().min(0).max(200).optional().default(0),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { shapeOuting } = await import("./coord.server");
    return shapeOuting(data);
  });
