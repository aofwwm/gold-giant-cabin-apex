import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { fetchPlannerDatingInvite, revokeDatingInvite } from "@/lib/dating.functions";
import { INVITE_SLUG, invitationStatusLabel, planIdForPlannerToken, publicInviteUrl, rememberDatingReply, type DatingInvite } from "@/lib/dating-invite";
import { loadPlannerInvite } from "@/lib/dating-planner-read";

type InviteLoad =
  | { state: "ready"; invite: DatingInvite }
  | { state: "missing" }
  | { state: "error"; message: string };

export const Route = createFileRoute("/date/manage/$plannerToken")({
  loader: async ({ params }) => {
    if (!INVITE_SLUG.test(params.plannerToken)) return { state: "missing" } satisfies InviteLoad;
    return fetchPlannerDatingInvite({ data: { plannerToken: params.plannerToken } });
  },
  head: () => ({ meta: [{ title: "Your invitation · Kairos" }] }),
  component: ManagePage,
});

function ManagePage() {
  const { plannerToken } = Route.useParams();
  const initial = Route.useLoaderData() as InviteLoad;
  const [result, setResult] = useState<InviteLoad>(initial);
  const [pending, setPending] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [notice, setNotice] = useState("");
  const invite = result.state === "ready" ? result.invite : null;
  const recipientUrl = invite ? publicInviteUrl(invite.slug) : "";
  const [booting, setBooting] = useState(initial.state !== "ready");

  async function refresh(quiet = false) {
    if (!INVITE_SLUG.test(plannerToken)) {
      setResult({ state: "missing" });
      return;
    }
    if (!quiet) setPending(true);
    try {
      const found = await loadPlannerInvite(plannerToken);
      if (!found) {
        if (!quiet) setResult({ state: "missing" });
        return;
      }
      const planId = planIdForPlannerToken(plannerToken);
      if (planId) rememberDatingReply(planId, found.status, { inviteSlug: found.slug });
      setResult({ state: "ready", invite: found });
    } catch (err) {
      console.error("[Dating planner]", err);
      setResult({ state: "error", message: "Couldn’t open this invitation." });
    } finally {
      if (!quiet) setPending(false);
    }
  }

  useEffect(() => {
    let stop = false;
    async function tick() {
      if (document.visibilityState === "hidden") return;
      await refresh(true);
      if (!stop) setBooting(false);
    }
    void tick();
    const timer = window.setInterval(() => void tick(), 12000);
    const onFocus = () => void tick();
    const onVisible = () => {
      if (document.visibilityState === "visible") void tick();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stop = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [plannerToken]);

  async function copyRecipient() {
    if (!recipientUrl || recipientUrl.includes("/date/manage/")) return;
    try {
      await navigator.clipboard.writeText(recipientUrl);
      setNotice("Recipient link copied");
    } catch {
      setNotice(recipientUrl);
    }
  }

  async function revoke() {
    setPending(true);
    try {
      const next = await revokeDatingInvite({ data: { plannerToken } });
      if (next.state === "error") {
        setNotice("Couldn’t revoke this invitation.");
        return;
      }
      setConfirmRevoke(false);
      await refresh();
    } finally {
      setPending(false);
    }
  }

  if (booting && !invite) {
    return (
      <Shell>
        <p>Opening your invitation…</p>
      </Shell>
    );
  }
  if (result.state === "error") {
    return (
      <Shell>
        <p>We couldn’t open this invitation right now.</p>
        <button type="button" onClick={() => void refresh()} className="press mt-4 min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Try again</button>
      </Shell>
    );
  }
  if (!invite) {
    return (
      <Shell>
        <p>This planner link is not available.</p>
      </Shell>
    );
  }
  if (invite.status === "revoked") {
    return (
      <Shell>
        <p className="text-xs font-semibold tracking-brand text-accent">DATE INVITATION</p>
        <h1 className="mt-2 font-display text-4xl text-cream">{invite.title}</h1>
        <p className="mt-4 text-sm font-semibold text-cream">INVITATION CANCELLED</p>
        <p className="mt-2 text-sm text-cream">The recipient link no longer opens.</p>
      </Shell>
    );
  }

  const statusLabel = invitationStatusLabel(invite.status);
  const code = `KAI-${invite.slug.slice(-4).toUpperCase()}`;

  return (
    <Shell>
      <p className="text-xs font-semibold tracking-brand text-accent">DATE INVITATION</p>
      <h1 className="mt-2 font-display text-4xl text-cream">{invite.title}</h1>
      <p className="mt-3 text-sm text-sky">{invite.whenLabel}</p>
      <p className="text-lg text-cream">{invite.area}</p>
      <p className="mt-5 text-sm text-mute">Status</p>
      <p className={invite.status === "sounds_good" ? "text-sm font-semibold text-leaf" : "text-sm font-semibold text-cream"}>{statusLabel}</p>
      {invite.replyNote ? <p className="mt-2 text-sm text-cream">“{invite.replyNote}”</p> : null}
      {invite.updatedAt ? <p className="mt-2 text-xs text-mute">Updated {invite.updatedAt.slice(0, 16).replace("T", " ")}</p> : null}
      <p className="mt-4 text-sm text-cream">{invite.message}</p>
      {invite.stops.map((stop) => (
        <div key={`${stop.time}-${stop.title}`} className="mt-4 border-t border-line pt-4">
          <p className="text-xs font-semibold tracking-brand text-accent">{stop.slot} · {stop.time}</p>
          <p className="mt-1 text-cream">{stop.title}</p>
          <p className="text-sm text-mute">{stop.address}</p>
        </div>
      ))}
      <p className="mt-4 text-xs text-mute">Date code {code}. This is only a reference, not the private link.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href={recipientUrl ? `https://wa.me/?text=${encodeURIComponent(recipientUrl)}` : undefined} target="_blank" rel="noopener noreferrer" className="press inline-flex min-h-11 items-center rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Share again</a>
        <button type="button" onClick={() => void copyRecipient()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Copy recipient link</button>
        <button type="button" disabled={pending} onClick={() => void refresh()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Refresh</button>
        {invite.status === "alternate_time_requested" ? (
          <Link to="/" search={{ mode: "dating", code: "" }} className="press inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Review timing</Link>
        ) : null}
      </div>
      {notice ? <p className="mt-3 text-sm text-mute">{notice}</p> : null}
      <div className="mt-6 border-t border-line pt-4">
        {confirmRevoke ? (
          <div>
            <p className="text-sm text-cream">Revoke this invitation? The recipient link will stop opening.</p>
            <div className="mt-2 flex gap-2">
              <button type="button" disabled={pending} onClick={() => void revoke()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Revoke</button>
              <button type="button" onClick={() => setConfirmRevoke(false)} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-mute">Cancel</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmRevoke(true)} className="text-sm font-semibold text-mute">Revoke invitation</button>
        )}
      </div>
      <p className="mt-4 text-xs text-mute">This page is private. Share the recipient link, not this address.</p>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <main data-mode="dating" className="min-h-screen bg-ink px-4 py-16 text-cream">
      <article className="mx-auto max-w-md rounded-3xl bg-panel px-6 py-8 shadow-card">{children}</article>
    </main>
  );
}
