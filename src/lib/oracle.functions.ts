import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ask = z.object({
  question: z.string().max(500).optional().default(""),
  mode: z.enum(["ask", "daily", "compare", "dates"]).optional().default("ask"),
  hint: z.string().max(40).optional().default(""),
  optionA: z.string().max(80).optional().default(""),
  optionB: z.string().max(80).optional().default(""),
  windowDays: z.number().int().min(3).max(14).optional().default(7),
  birthDate: z.string().max(10).optional().default(""),
  birthDateB: z.string().max(10).optional().default(""),
  birthTime: z.string().max(5).optional().default(""),
  birthPlace: z.string().max(40).optional().default(""),
  include: z.array(z.enum(["tong_shu", "tarot", "iching", "numerology", "zodiac", "bazi", "astrology"])).max(7).optional(),
  fresh: z.boolean().optional().default(false),
});

export const askOracle = createServerFn({ method: "POST" })
  .validator((input: unknown) => ask.parse(input))
  .handler(async ({ data }) => {
    const { readOracle } = await import("./oracle.server");
    return readOracle({
      question: data.question,
      mode: data.mode,
      hint: data.hint,
      optionA: data.optionA,
      optionB: data.optionB,
      windowDays: data.windowDays,
      birthDate: data.birthDate,
      birthDateB: data.birthDateB,
      birthTime: data.birthTime,
      birthPlace: data.birthPlace,
      include: data.include,
      fresh: data.fresh,
    });
  });
