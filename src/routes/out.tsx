import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/out")({
  beforeLoad: () => {
    throw redirect({ to: "/", search: { mode: "out", code: "" } });
  },
});
