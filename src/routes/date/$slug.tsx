import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { answerDatingInvite, fetchDatingInvite } from "@/lib/dating.functions";
import { KairosVoice } from "@/components/kairos-voice";
import type { DatingInvite } from "@/lib/dating-invite";

type InviteLoad =
  | { state: "ready"; invite: DatingInvite }
  | { state: "missing" }
  | { state: "error"; message: string };

export const Route = createFileRoute("/date/$slug")({
  loader: async ({ params }) => {
    console.info("[PUBLIC INVITE] route slug:", params.slug);
    return fetchDatingInvite({ data: { slug: params.slug } });
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.state === "ready" ? `${loaderData.invite.title} · Kairos` : "Kairos" }],
  }),
  component: InvitePage,
});

function InvitePage() {
  const params = Route.useParams();
  const initial = Route.useLoaderData() as InviteLoad;
  const [result, setResult] = useState<InviteLoad>(initial);
  const [opening, setOpening] = useState(false);

  async function retry() {
    setOpening(true);
    console.info("[PUBLIC INVITE] route slug:", params.slug);
    console.info("[PUBLIC INVITE] RPC started");
    try {
      const next = (await fetchDatingInvite({ data: { slug: params.slug } })) as InviteLoad;
      console.info("[PUBLIC INVITE] RPC data:", next.state === "ready" ? next.invite : null);
      console.info("[PUBLIC INVITE] RPC error:", next.state === "error" ? next.message : null);
      setResult(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : "The invitation request failed.";
      console.info("[PUBLIC INVITE] RPC error:", message);
      setResult({ state: "error", message });
    } finally {
      setOpening(false);
    }
  }

  if (opening) {
    return (
      <main data-mode="dating" className="grid min-h-screen place-items-center bg-ink px-6 text-cream">
        <p>Opening your invitation…</p>
      </main>
    );
  }
  if (result.state === "error") {
    return (
      <main data-mode="dating" className="grid min-h-screen place-items-center bg-ink px-6 text-center text-cream">
        <div>
          <p>We couldn’t open this invitation right now.</p>
          <button type="button" onClick={() => void retry()} className="press mt-4 min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Try again</button>
        </div>
      </main>
    );
  }
  if (result.state === "missing") {
    return (
      <main data-mode="dating" className="grid min-h-screen place-items-center bg-ink px-6 text-cream">
        <p>This invitation is no longer available.</p>
      </main>
    );
  }
  return <InviteCard initial={result.invite} />;
}

function InviteCard({ initial }: { initial: DatingInvite }) {
  const [invite, setInvite] = useState(initial);
  const [note, setNote] = useState("");
  const [times, setTimes] = useState("");
  const [asking, setAsking] = useState(false);
  const [pending, setPending] = useState(false);

  const [replyError, setReplyError] = useState("");
  const [lastTry, setLastTry] = useState<Exclude<DatingInvite["status"], "pending"> | null>(null);

  async function send(status: Exclude<DatingInvite["status"], "pending">) {
    setPending(true);
    setReplyError("");
    setLastTry(status);
    try {
      const next = await answerDatingInvite({
        data: {
          slug: invite.slug,
          status,
          note,
          times: times.split("\n").map((line) => line.trim()).filter(Boolean),
        },
      });
      if (next.state === "error") {
        console.error("[Dating response error]", next.message);
        setReplyError("Couldn’t send your reply.");
        return;
      }
      setInvite(next.invite);
      setAsking(false);
    } catch (err) {
      console.error("[Dating response error]", err);
      setReplyError("Couldn’t send your reply.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main data-mode="dating" className="min-h-screen bg-ink px-4 py-16 text-cream">
      <article className="rise mx-auto max-w-md rounded-3xl bg-panel px-6 py-8 shadow-card">
        {invite.recipientName ? <p className="text-sm text-mute">For {invite.recipientName}</p> : null}
        <h1 className="font-display text-4xl leading-tight text-cream">{invite.title}</h1>
        <p className="mt-3 text-sm text-sky">{invite.whenLabel}</p>
        <p className="text-lg text-cream">{invite.area}</p>
        <p className="mt-5 text-base text-cream">{invite.message}</p>
        {invite.note ? <p className="mt-3 text-sm text-mute">{invite.note}</p> : null}
        <p className="mt-5 text-sm text-mute">{invite.duration} · {invite.dress}{invite.vibe ? ` · ${invite.vibe}` : ""}</p>
        {invite.visibility === "mystery" ? <p className="mt-4 text-sm text-cream">Everything else is revealed later.</p> : null}
        {invite.stops.map((stop) => (
          <div key={`${stop.time}-${stop.title}`} className="mt-4 border-t border-line pt-4">
            <p className="text-xs font-semibold tracking-brand text-accent">{stop.slot} · {stop.time}</p>
            <p className="mt-1 text-lg text-cream">{stop.title}</p>
            <p className="text-sm text-mute">{stop.address}</p>
          </div>
        ))}
        {invite.footer.includes("吉") ? <KairosVoice mode="dating" text="Solid plan. I'll leave the rest to you." status="good" mark="吉" /> : <p className="mt-6 text-xs text-mute">{invite.footer}</p>}

        {invite.status === "sounds_good" ? (
          <div className="mt-6">
            <p className="text-sm font-semibold tracking-brand text-leaf">YOU’RE IN ✓</p>
            <p className="mt-1 text-sm text-cream">Nice. The planner has your reply.</p>
            {invite.replyNote ? <p className="mt-2 text-sm text-mute">{invite.replyNote}</p> : null}
            <KairosVoice mode="dating" text="Good. My work here is mostly done." status="good" mark="吉" />
          </div>
        ) : null}
        {invite.status === "alternate_time_requested" ? (
          <div className="mt-6">
            <p className="text-sm font-semibold tracking-brand text-accent">GOT IT</p>
            <p className="mt-1 text-sm text-cream">Your timing preference has been sent back.</p>
            {invite.replyNote ? <p className="mt-2 text-sm text-mute">{invite.replyNote}</p> : null}
          </div>
        ) : null}

        {invite.status === "pending" ? (
          <>
            <label className="mt-6 block text-sm text-cream" htmlFor="reply-note">A note, optional</label>
            <textarea id="reply-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} rows={2} className="mt-1 w-full rounded-xl bg-ink px-3 py-2 text-cream ring-1 ring-line" />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" disabled={pending} onClick={() => void send("sounds_good")} className="press min-h-12 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink">
                {invite.dateType === "first" ? "I’m up for it" : "Sounds good"}
              </button>
              <button type="button" onClick={() => setAsking((value) => !value)} className="press min-h-12 rounded-xl px-4 text-sm font-semibold text-cream ring-1 ring-line">
                {invite.dateType === "first" ? "Suggest another time" : "Another day?"}
              </button>
            </div>
            {asking ? (
              <div className="mt-4">
                <label className="text-sm text-cream" htmlFor="other-times">Times that work better</label>
                <textarea id="other-times" value={times} onChange={(event) => setTimes(event.target.value)} rows={3} placeholder={"Saturday evening\nSunday afternoon"} className="mt-1 w-full rounded-xl bg-ink px-3 py-2 text-cream ring-1 ring-line" />
                <button type="button" disabled={pending} onClick={() => void send("alternate_time_requested")} className="press mt-2 min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Send times</button>
              </div>
            ) : null}
            {replyError ? (
              <div className="mt-4">
                <p className="text-sm text-cream">Couldn’t send your reply.</p>
                <button type="button" disabled={pending || !lastTry} onClick={() => lastTry && void send(lastTry)} className="press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Try again</button>
              </div>
            ) : null}
          </>
        ) : null}
      </article>
    </main>
  );
}
