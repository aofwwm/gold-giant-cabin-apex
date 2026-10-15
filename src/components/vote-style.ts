import type { Choice } from "@/lib/kairos.types";

export const MARK: Record<Choice, string> = {
  love: "😍",
  yes: "🙂",
  soft: "😩",
  no: "❌",
};

export const VOTE_LABEL: Record<Choice, string> = {
  love: "Great for me",
  yes: "Can make it",
  soft: "Please no",
  no: "Cannot",
};

export const VOTE_ORDER: Choice[] = ["love", "yes", "soft", "no"];
