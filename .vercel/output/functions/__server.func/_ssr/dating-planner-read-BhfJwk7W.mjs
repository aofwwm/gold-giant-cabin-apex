import { t as INVITE_SLUG } from "./dating-invite-DIfg4EzO.mjs";
import { f as fetchPlannerDatingInvite } from "./router-TB2ea2rn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dating-planner-read-BhfJwk7W.js
/** Status comes only from get_dating_invitation_for_planner(p_planner_token). */
async function loadPlannerInvite(token) {
	if (!INVITE_SLUG.test(token)) return null;
	const planner = await fetchPlannerDatingInvite({ data: { plannerToken: token } }).catch(() => null);
	if (planner?.state !== "ready") return null;
	return planner.invite;
}
//#endregion
export { loadPlannerInvite as t };
