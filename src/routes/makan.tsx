import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/makan")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === "string" ? search.code.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toLowerCase() : "",
  }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/", search: { mode: "makan", code: search.code } });
  },
});
