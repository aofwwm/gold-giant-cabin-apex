import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const parsePlanBrief = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({
      mode: z.enum(["dating", "travel", "family", "team_out"]),
      text: z.string().max(500),
      today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { parsePlanningBrief } = await import("./planning-brief.server");
    return parsePlanningBrief(data.mode, data.text, data.today);
  });
