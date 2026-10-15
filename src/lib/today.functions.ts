import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const todayWeather = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ date: z.string(), latitude: z.number(), longitude: z.number() }).parse(input))
  .handler(async ({ data }) => {
    const { readTodayWeather } = await import("./today.server");
    return readTodayWeather(data.date, data.latitude, data.longitude);
  });

export const todayRoutes = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      pairs: z.array(z.object({
        key: z.string(),
        from: z.object({ lat: z.number(), lng: z.number() }),
        to: z.object({ lat: z.number(), lng: z.number() }),
      })).max(12),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { routeTodayLegs } = await import("./today.server");
    return routeTodayLegs(data.pairs);
  });

export const parseToday = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ text: z.string().min(2).max(240), date: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { parseTodayLine } = await import("./today.server");
    return parseTodayLine(data.text, data.date);
  });

export const explainToday = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ facts: z.string().max(1200) }).parse(input))
  .handler(async ({ data }) => {
    const { todayVoice } = await import("./today.server");
    return todayVoice(data.facts);
  });
