import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { HashIdentity } from "@/lib/hash";

function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message ?? "Check that and try again");
  return result.data;
}

const codeSchema = z.string().trim().regex(/^[a-zA-Z0-9]{4,32}$/, "That code does not look right");
const participantSchema = z.string().trim().regex(/^[a-zA-Z0-9]{24,80}$/, "Join again from this phone");
const hostSchema = z.union([z.string().trim().regex(/^[a-zA-Z0-9]{24,80}$/), z.literal("")]).optional().default("");

const HostCommand = z.discriminatedUnion("action", [
  z.object({ action: z.literal("pause") }),
  z.object({ action: z.literal("resume") }),
  z.object({ action: z.literal("reveal") }),
  z.object({ action: z.literal("end") }),
  z.object({ action: z.literal("voting"), open: z.boolean(), voteLimit: z.union([z.literal(1), z.literal(3)]).optional() }),
  z.object({ action: z.literal("live"), show: z.boolean() }),
  z.object({ action: z.literal("cosmic"), enabled: z.boolean() }),
  z.object({ action: z.literal("rename"), clusterId: z.string().min(4).max(80), title: z.string().trim().min(1).max(60) }),
  z.object({ action: z.literal("summary"), clusterId: z.string().min(4).max(80), summary: z.string().max(180) }),
  z.object({ action: z.literal("merge"), intoId: z.string().min(4).max(80), fromId: z.string().min(4).max(80) }),
  z.object({ action: z.literal("split"), clusterId: z.string().min(4).max(80), submissionId: z.string().min(4).max(80) }),
  z.object({ action: z.literal("move"), submissionId: z.string().min(4).max(80), clusterId: z.string().min(4).max(80) }),
  z.object({ action: z.literal("pin"), clusterId: z.string().min(4).max(80), pinned: z.boolean() }),
  z.object({ action: z.literal("hide"), submissionId: z.string().min(4).max(80), hidden: z.boolean() }),
  z.object({ action: z.literal("mark"), clusterId: z.string().min(4).max(80), kind: z.enum(["", "action", "park", "discuss", "decide"]), note: z.string().max(160).optional() }),
  z.object({ action: z.literal("lucky") }),
  z.object({ action: z.literal("reroll") }),
]);

export const resolveJoinCode = createServerFn({ method: "GET" })
  .validator((input: unknown) => parse(z.object({ code: codeSchema, participantToken: participantSchema }), input))
  .handler(async ({ data }) => {
    const { resolveJoin } = await import("./hash.server");
    return resolveJoin(data.code, data.participantToken);
  });

export const createHashSession = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(z.object({
    prompt: z.string().trim().min(2, "Ask a question").max(200),
    context: z.string().trim().max(500).optional().default(""),
    starter: z.string().trim().max(24).optional().default("custom"),
    identityMode: z.enum(["anonymous", "named", "choice"]),
    showLiveBoard: z.boolean(),
    blindRound: z.boolean(),
    voteLimit: z.union([z.literal(1), z.literal(3)]),
    cosmicEnabled: z.boolean(),
  }), input))
  .handler(async ({ data }) => {
    const { createHashSession: create } = await import("./hash.server");
    return create({ ...data, identityMode: data.identityMode as HashIdentity });
  });

export const fetchHashRoom = createServerFn({ method: "GET" })
  .validator((input: unknown) => parse(z.object({ code: codeSchema, participantToken: participantSchema.or(z.literal("")), hostToken: hostSchema }), input))
  .handler(async ({ data }) => {
    const { readHashRoom } = await import("./hash.server");
    return readHashRoom(data.code, data.participantToken, data.hostToken);
  });

export const throwHashIdea = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(z.object({
    code: codeSchema,
    participantToken: participantSchema,
    hostToken: hostSchema,
    text: z.string().trim().min(2, "Throw in a few words").max(240),
    anonymous: z.boolean(),
    displayName: z.string().trim().max(24).optional().default(""),
  }), input))
  .handler(async ({ data }) => {
    const { throwIdea } = await import("./hash.server");
    return throwIdea(data);
  });

export const supportHashTheme = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(z.object({ code: codeSchema, participantToken: participantSchema, hostToken: hostSchema, clusterId: z.string().min(4).max(80) }), input))
  .handler(async ({ data }) => {
    const { supportTheme } = await import("./hash.server");
    return supportTheme(data);
  });

export const voteHashTheme = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(z.object({ code: codeSchema, participantToken: participantSchema, hostToken: hostSchema, clusterId: z.string().min(4).max(80) }), input))
  .handler(async ({ data }) => {
    const { voteTheme } = await import("./hash.server");
    return voteTheme(data);
  });

export const collateHashRoom = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(z.object({ code: codeSchema, hostToken: z.string().trim().min(24).max(80), participantToken: participantSchema.or(z.literal("")).optional().default(""), auto: z.boolean().optional().default(false) }), input))
  .handler(async ({ data }) => {
    const { collateRoom } = await import("./hash.server");
    return collateRoom(data.code, data.hostToken, data.auto, data.participantToken);
  });

export const summariseHashRoom = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(z.object({ code: codeSchema, hostToken: z.string().trim().min(24).max(80), participantToken: participantSchema.or(z.literal("")).optional().default("") }), input))
  .handler(async ({ data }) => {
    const { summariseRoom } = await import("./hash.server");
    return summariseRoom(data.code, data.hostToken, data.participantToken);
  });

export const hostHashRoom = createServerFn({ method: "POST" })
  .validator((input: unknown) => parse(z.object({
    code: codeSchema,
    hostToken: z.string().trim().min(24).max(80),
    participantToken: participantSchema.or(z.literal("")).optional().default(""),
    command: HostCommand,
  }), input))
  .handler(async ({ data }) => {
    const { hostCommand } = await import("./hash.server");
    return hostCommand(data.code, data.hostToken, data.command, data.participantToken);
  });
