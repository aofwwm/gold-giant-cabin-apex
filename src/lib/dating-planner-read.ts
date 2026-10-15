import { fetchPlannerDatingInvite } from "@/lib/dating.functions";
import { INVITE_SLUG, type DatingInvite } from "@/lib/dating-invite";

/** Status comes only from get_dating_invitation_for_planner(p_planner_token). */
export async function loadPlannerInvite(token: string): Promise<DatingInvite | null> {
  if (!INVITE_SLUG.test(token)) return null;
  const planner = await fetchPlannerDatingInvite({ data: { plannerToken: token } }).catch(() => null);
  if (planner?.state !== "ready") return null;
  return planner.invite;
}
