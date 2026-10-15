import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const point = {
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
};

export const reversePlace = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object(point).parse(input))
  .handler(async ({ data }) => {
    const { reverseLabel } = await import("./coord.server");
    return reverseLabel(data.latitude, data.longitude);
  });

export const lookupPlace = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ query: z.string().trim().min(2).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { searchPlaces } = await import("./coord.server");
    return searchPlaces(data.query);
  });
