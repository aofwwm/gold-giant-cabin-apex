import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { toast } from "sonner";
import { answerDatingInvite, createDatingInvite, polishDatingInvite } from "@/lib/dating.functions";
import {
  INVITE_SLUG,
  buildShareMessage,
  draftInvitation,
  dressLabel,
  durationLabel,
  ensureInviteSlug,
  invitationStatusLabel,
  inviteFooter,
  inviteUrlIsLocal,
  onlyRecipientShare,
  plannerInviteUrl,
  publicArea,
  publicInviteUrl,
  readDatingInviteLink,
  rememberDatingReply,
  saveDatingInviteLink,
  withShareUrl,
  type DatingInvite,
  type InviteTone,
  type InviteVisibility,
} from "@/lib/dating-invite";
import { loadPlannerInvite } from "@/lib/dating-planner-read";
import type { DatingStop } from "@/lib/dating";
import { KairosVoice } from "@/components/kairos-voice";
import { clockLabel } from "@/lib/family-day";

const INVITE_MEMORY = "kairos-dating-invite";

type InviteMemory = { slug: string; seen: Partial<Record<DatingInvite["status"], string>> };

function readInviteMemory(): InviteMemory | null {
  try {
    const raw = localStorage.getItem(INVITE_MEMORY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InviteMemory;
    if (!parsed || typeof parsed.slug !== "string" || !INVITE_SLUG.test(parsed.slug)) return null;
    return { slug: parsed.slug, seen: parsed.seen && typeof parsed.seen === "object" ? parsed.seen : {} };
  } catch {
    return null;
  }
}

function rememberInvite(slug: string, status?: DatingInvite["status"]): string {
  const current = readInviteMemory();
  const seen = current?.slug === slug ? { ...current.seen } : {};
  if (status && !seen[status]) seen[status] = new Date().toISOString();
  localStorage.setItem(INVITE_MEMORY, JSON.stringify({ slug, seen }));
  return status ? seen[status] ?? "" : "";
}

function updatedLabel(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(delta) || delta < 60_000) return "Updated just now";
  const minutes = Math.round(delta / 60_000);
  if (minutes < 60) return `Updated ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Updated ${hours} hr ago`;
  return `Updated ${Math.round(hours / 24)} days ago`;
}

const TONE_LABEL: Record<InviteTone, string> = {
  minimal: "Minimal",
  warm: "Warm",
  playful: "Playful",
  romantic: "Romantic",
};

async function writeClipboard(text: string): Promise<"copied" | "manual"> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return "copied";
    }
  } catch {
    // Fall through to a selectable box.
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "0";
  field.style.left = "0";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.focus();
  field.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  return ok ? "copied" : "manual";
}

export function DatingInvitePanel({
  dateType,
  weekday,
  when,
  span,
  areaLabel,
  formality,
  vibes,
  stops,
  mark,
  planId,
  date,
  statusOnly = false,
}: {
  dateType: string;
  weekday: string;
  when: string;
  span: string;
  areaLabel: string;
  formality: string;
  vibes: string[];
  stops: DatingStop[];
  mark: "吉" | "平" | "凶";
  planId: string;
  date: string;
  statusOnly?: boolean;
}) {
  const area = publicArea(areaLabel);
  const [tone, setTone] = useState<InviteTone>("warm");
  const [visibility, setVisibility] = useState<InviteVisibility>("full");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [ownVoice, setOwnVoice] = useState(false);
  const [slug, setSlug] = useState("");
  const [plannerToken, setPlannerToken] = useState("");
  const [editToken, setEditToken] = useState("");
  const [publishedKey, setPublishedKey] = useState("");
  const [reply, setReply] = useState<DatingInvite | null>(null);
  const [pending, setPending] = useState(false);
  const [phase, setPhase] = useState<"idle" | "creating" | "ready" | "error">("idle");
  const [shareError, setShareError] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState<"" | "link" | "message" | "planner">("");
  const [notice, setNotice] = useState("");
  const [manualCopy, setManualCopy] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [previewEdited, setPreviewEdited] = useState(false);
  const [replyChecked, setReplyChecked] = useState("");
  const [replyError, setReplyError] = useState("");
  const [canNative, setCanNative] = useState(false);

  const draft = useMemo(
    () => draftInvitation({ tone, dateType, weekday, area, span, when }),
    [tone, dateType, weekday, area, span, when],
  );
  const shown = ownVoice ? message : message || draft.message;
  const cardStops = visibility === "mystery" ? [] : visibility === "first" ? stops.slice(0, 1) : stops;
  const footer = inviteFooter(mark);
  const clock = stops[0] ? clockLabel(stops[0].startMin) : when;
  const visibleStop = visibility === "mystery" ? "" : cardStops[0]?.title ?? "";
  const snapshot = JSON.stringify({
    title: draft.title,
    clock,
    area,
    message: shown,
    note,
    tone,
    visibility,
    name,
    stops: cardStops.map((stop) => stop.placeId),
  });

  useEffect(() => {
    setCanNative(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    const saved = readDatingInviteLink(planId);
    const token = saved?.plannerToken ?? "";
    setPlannerToken(token);
    setSlug(saved?.inviteSlug ?? "");
    if (!token) setReply(null);
  }, [planId]);

  useEffect(() => {
    if (!plannerToken || !INVITE_SLUG.test(plannerToken)) return;
    let stop = false;
    async function load() {
      if (document.visibilityState === "hidden") return;
      const found = await loadPlannerInvite(plannerToken);
      if (stop) return;
      if (!found) {
        setReplyError("Couldn’t refresh the reply.");
        return;
      }
      setReplyError("");
      setSlug(found.slug);
      setReply(found);
      setPhase("ready");
      setReplyChecked(found.updatedAt || rememberInvite(found.slug, found.status));
      rememberDatingReply(planId, found.status, {
        inviteSlug: found.slug,
        date,
        title: draft.title,
        area,
        startMin: stops[0]?.startMin,
        endMin: stops[stops.length - 1]?.endMin,
      });
    }
    void load();
    const timer = window.setInterval(() => void load(), 12000);
    const onFocus = () => void load();
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stop = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [plannerToken, planId, date, draft.title, area, stops]);

  useEffect(() => {
    if (!previewOpen || previewEdited || !slug) return;
    setPreview(buildShareMessage({
      visibility,
      weekday,
      time: clock,
      area,
      duration: durationLabel(span),
      name,
      note,
      firstStop: visibleStop,
      url: publicInviteUrl(slug),
    }));
  }, [previewOpen, previewEdited, slug, visibility, weekday, clock, area, span, name, note, visibleStop]);

  async function publish(): Promise<string> {
    if (slug && publishedKey === snapshot) {
      setPhase("ready");
      return publicInviteUrl(slug);
    }
    setPhase("creating");
    setShareError("");
    setPending(true);
    console.info("[Dating Share] 1. Share initiated");
    try {
      console.info("[Dating Share] 2. Public payload generated");
      console.info("[Dating Share] 3. Supabase RPC create_dating_invitation started");
      const payload = {
        title: draft.title.slice(0, 80),
        whenLabel: `${weekday}${stops[0] ? ` · ${clockLabel(stops[0].startMin)}` : ""}`.trim().slice(0, 60),
        area: area.slice(0, 80),
        message: shown.slice(0, 280),
        note,
        duration: durationLabel(span).slice(0, 40),
        dress: dressLabel(formality).slice(0, 40),
        vibe: (vibes.slice(0, 3).join(" · ") || "Easy").slice(0, 80),
        tone,
        visibility,
        recipientName: name.slice(0, 40),
        dateType: dateType.slice(0, 20),
        stops: cardStops.slice(0, 8).map((stop) => ({
          slot: stop.slot.slice(0, 40),
          title: stop.title.slice(0, 80),
          address: stop.address.slice(0, 160),
          time: `${clockLabel(stop.startMin)}–${clockLabel(stop.endMin)}`.slice(0, 40),
          setting: stop.setting.slice(0, 12),
        })),
        footer: footer.slice(0, 80),
        slug: ensureInviteSlug(slug),
        editToken,
      };
      console.log("[INVITE] payload before validation", payload);
      console.log("[INVITE] slug", payload.slug);
      console.log("[INVITE] slug length", payload.slug.length);
      console.log("[INVITE] regex passes", INVITE_SLUG.test(payload.slug));
      if (!INVITE_SLUG.test(payload.slug)) throw new Error("Invalid invite slug generated");
      const saved = await createDatingInvite({ data: payload });
      console.info("[Dating Share] 4. Supabase response received");
      console.info("[Dating Share] 5. invite_slug obtained", saved.slug);
      setSlug(saved.slug);
      setPlannerToken(saved.plannerToken);
      saveDatingInviteLink(planId || "current", {
        plannerToken: saved.plannerToken,
        inviteSlug: saved.slug,
        date,
        title: draft.title,
        area,
        startMin: stops[0]?.startMin,
        endMin: stops[stops.length - 1]?.endMin,
        status: "pending",
      });
      setEditToken(saved.editToken);
      setPublishedKey(snapshot);
      rememberInvite(saved.slug);
      const url = publicInviteUrl(saved.slug);
      console.info("[Dating Share] 6. public URL generated", url);
      setPhase("ready");
      console.info("[Dating Share] 7. Share buttons enabled");
      return url;
    } catch (err) {
      console.error("[Dating Share] failed:", err);
      setPhase("error");
      setShareError(err instanceof Error ? err.message : "");
      return "";
    } finally {
      setPending(false);
    }
  }

  function composed(url: string): string {
    const generated = buildShareMessage({
      visibility,
      weekday,
      time: clock,
      area,
      duration: durationLabel(span),
      name,
      note,
      firstStop: visibleStop,
      url,
    });
    return onlyRecipientShare(previewEdited ? withShareUrl(preview, url) : generated);
  }

  function flash(kind: "link" | "message" | "planner") {
    setCopied(kind);
    setNotice(kind === "planner" ? "Planner link copied ✓" : kind === "link" ? "Link copied ✓" : "Message copied ✓");
    window.setTimeout(() => {
      setCopied("");
      setNotice("");
    }, 1800);
  }

  async function openShare() {
    setShareOpen(true);
    setManualCopy("");
    await publish();
  }

  async function copyLink() {
    const url = link || (await publish());
    if (!url.includes("/date/")) return;
    await revealCopy(url, "link");
  }

  function copyReadyLink() {
    if (!link) {
      void copyLink();
      return;
    }
    const field = document.getElementById("invite-public-url");
    if (field instanceof HTMLInputElement) {
      field.focus();
      field.select();
    }
    void revealCopy(link, "link");
  }

  async function revealCopy(text: string, kind: "link" | "message" | "planner") {
    const result = await writeClipboard(text);
    if (result === "copied") {
      setManualCopy("");
      flash(kind);
      return;
    }
    setManualCopy(text);
    setNotice(kind === "link" ? "Select the link, then copy it." : "Select the message, then copy it.");
    window.setTimeout(() => {
      const field = document.getElementById(kind === "link" ? "invite-public-url" : "invite-manual-copy");
      if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
        field.focus();
        field.select();
      }
    }, 0);
  }
  async function openMessage() {
    const url = link || (await publish());
    if (!url) return;
    setPreviewOpen(true);
    if (!previewEdited) setPreview(buildShareMessage({
      visibility,
      weekday,
      time: clock,
      area,
      duration: durationLabel(span),
      name,
      note,
      firstStop: visibleStop,
      url,
    }));
  }

  async function copyMessage() {
    const url = link || (await publish());
    if (!url) return;
    const text = withShareUrl(preview || composed(url), url);
    await revealCopy(text, "message");
  }

  function shareNative() {
    if (!link || typeof navigator.share !== "function") return;
    const text = composed(link).replace(link, "").trim();
    void navigator.share({ title: draft.title, text, url: link }).catch(() => {
      setNotice("Sharing was cancelled. The link is still here to copy.");
    });
  }

  async function suggest() {
    setPending(true);
    try {
      const result = await polishDatingInvite({ data: { tone, draft: shown, note, dateType } });
      if (result.message) {
        setOwnVoice(true);
        setMessage(result.message);
      } else {
        toast.message("Kept the original wording.");
      }
    } finally {
      setPending(false);
    }
  }

  async function checkReply() {
    if (!plannerToken || !INVITE_SLUG.test(plannerToken)) return;
    const found = await loadPlannerInvite(plannerToken);
    if (!found) {
      setReplyError("Couldn’t refresh the reply.");
      return;
    }
    setReplyError("");
    setSlug(found.slug);
    setReply(found);
    setReplyChecked(found.updatedAt || rememberInvite(found.slug, found.status));
    rememberDatingReply(planId, found.status, {
      inviteSlug: found.slug,
      date,
      title: draft.title,
      area,
      startMin: stops[0]?.startMin,
      endMin: stops[stops.length - 1]?.endMin,
    });
  }

  const link = slug && !publicInviteUrl(slug).includes("/date/manage/") ? publicInviteUrl(slug) : "";
  const plannerLink = plannerToken ? plannerInviteUrl(plannerToken) : "";
  const shared = link ? composed(link) : "";
  const whatsappHref = link && !shared.includes("/date/manage/") ? `https://wa.me/?text=${encodeURIComponent(shared)}` : "";

  const statusCard = (
    <InvitationStatus plannerToken={plannerToken} slug={slug} reply={reply} updatedAt={reply?.updatedAt || replyChecked} error={replyError} onRefresh={() => void checkReply()} />
  );
  const privateLink = plannerLink ? (
    <div className="mt-4">
      <label className="text-xs font-semibold tracking-brand text-mute" htmlFor="invite-planner-url">Keep this link private.</label>
      <input id="invite-planner-url" readOnly value={plannerLink} onFocus={(event) => event.currentTarget.select()} className="mt-1 h-11 w-full rounded-xl bg-panel px-3 text-sm text-cream ring-1 ring-line" />
      <button type="button" onClick={() => void revealCopy(plannerLink, "planner")} className="press mt-2 min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
        {copied === "planner" ? "Copied ✓" : "Copy planner link"}
      </button>
    </div>
  ) : null;

  if (statusOnly) {
    return (
      <div className="mt-6 rounded-2xl bg-ink px-4 py-4 ring-1 ring-line">
        {statusCard}
        {privateLink}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl bg-ink px-4 py-4 ring-1 ring-line">
      <p className="text-xs font-semibold tracking-brand text-accent">SHARE THE PLAN</p>
      <p className="mt-1 text-sm text-mute">A short note for the other person. They do not need an account.</p>

      <label className="mt-4 block text-sm text-cream" htmlFor="invite-name">Recipient name, optional</label>
      <input id="invite-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={40} className="mt-1 h-11 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line" />

      <p className="mt-4 text-sm text-cream">Tone</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(TONE_LABEL) as InviteTone[]).map((item) => (
          <button key={item} type="button" aria-pressed={tone === item} onClick={() => { setTone(item); if (!ownVoice) setMessage(""); }} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", tone === item ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>
            {TONE_LABEL[item]}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-cream">What they see</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {([
          ["full", "Full plan"],
          ["first", "First stop only"],
          ["mystery", "Mystery"],
        ] as const).map(([item, label]) => (
          <button key={item} type="button" aria-pressed={visibility === item} onClick={() => { setVisibility(item); setPreviewEdited(false); }} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", visibility === item ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>
            {label}
          </button>
        ))}
      </div>

      <label className="mt-4 block text-sm text-cream" htmlFor="invite-note">Personal note, optional</label>
      <textarea id="invite-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={180} rows={2} placeholder="Been wanting to check this place out with you." className="mt-1 w-full rounded-xl bg-panel px-3 py-2 text-cream ring-1 ring-line" />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" disabled={pending} onClick={() => void suggest()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Suggest wording</button>
        <button type="button" onClick={() => { setOwnVoice(true); setMessage(""); }} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Write it myself</button>
      </div>
      {ownVoice ? (
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={280} rows={3} placeholder="Your words." className="mt-2 w-full rounded-xl bg-panel px-3 py-2 text-cream ring-1 ring-line" />
      ) : null}

      <article className="rise mt-4 rounded-2xl bg-panel px-4 py-5 ring-1 ring-accent">
        {name ? <p className="text-sm text-mute">For {name}</p> : null}
        <h3 className="font-display text-2xl text-cream">{draft.title}</h3>
        <p className="mt-1 text-sm text-sky">{weekday}{stops[0] ? ` · ${clockLabel(stops[0].startMin)}` : ""}</p>
        <p className="text-sm text-cream">{area}</p>
        <p className="mt-3 text-sm text-cream">{shown}</p>
        {note ? <p className="mt-2 text-sm text-mute">{note}</p> : null}
        <p className="mt-3 text-sm text-mute">{durationLabel(span)} · {dressLabel(formality)}{vibes.length ? ` · ${vibes.slice(0, 2).join(" + ")}` : ""}</p>
        {visibility === "mystery" ? <p className="mt-3 text-sm text-cream">The rest of the plan stays with you until later.</p> : null}
        {cardStops.map((stop) => (
          <div key={stop.placeId} className="mt-3 border-t border-line pt-3">
            <p className="text-xs font-semibold tracking-brand text-accent">{stop.slot} · {clockLabel(stop.startMin)}</p>
            <p className="text-cream">{stop.title}</p>
            <p className="text-sm text-mute">{stop.address}</p>
          </div>
        ))}
        <p className="mt-4 text-xs text-mute">{footer}</p>
      </article>

      <InvitationStatus plannerToken={plannerToken} slug={slug} reply={reply} updatedAt={reply?.updatedAt || replyChecked} error={replyError} onRefresh={() => void checkReply()} />

      {privateLink}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={pending} onClick={() => void openShare()} className="press min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink">Share</button>
      </div>

      {shareOpen ? (
        <div className="mt-4 rounded-2xl bg-panel px-4 py-4 ring-1 ring-accent">
          <p className="text-xs font-semibold tracking-brand text-accent">SHARE YOUR INVITATION</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={whatsappHref || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={phase !== "ready" || !whatsappHref}
              onClick={(event) => {
                if (phase !== "ready" || !whatsappHref) event.preventDefault();
              }}
              className={clsx("press inline-flex min-h-11 items-center rounded-xl bg-accent px-3 text-sm font-semibold text-accent-ink", (phase !== "ready" || !whatsappHref) && "pointer-events-none opacity-50")}
            >
              WhatsApp
            </a>
            {canNative ? (
              <button type="button" disabled={phase !== "ready" || !link} onClick={shareNative} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Share…</button>
            ) : null}
            <button type="button" disabled={phase !== "ready" || !link} onClick={copyReadyLink} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">
              {copied === "link" ? "Copied ✓" : "Copy link"}
            </button>
            <button type="button" disabled={phase !== "ready" || !link} onClick={() => void openMessage()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
              Copy message + link
            </button>
          </div>
          {phase === "creating" ? <p className="mt-3 text-sm text-mute">Creating the link…</p> : null}
          {phase === "error" ? (
            <div className="mt-3">
              <p className="text-sm text-cream">Couldn’t create the invitation.</p>
              {shareError ? <p className="mt-1 text-sm text-mute">{shareError}</p> : null}
              <button type="button" onClick={() => void publish()} className="press mt-3 min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Try again</button>
            </div>
          ) : null}
          {notice ? <p role="status" className="mt-3 text-sm text-leaf">{notice}</p> : null}
          {previewOpen ? (
            <div className="mt-4">
              <p className="text-xs font-semibold tracking-brand text-accent">MESSAGE PREVIEW</p>
              <textarea
                id="share-preview"
                value={preview}
                rows={5}
                maxLength={500}
                onChange={(event) => { setPreviewEdited(true); setPreview(event.target.value); }}
                className="mt-2 w-full rounded-xl bg-ink px-3 py-2 text-sm text-cream ring-1 ring-line"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => document.getElementById("share-preview")?.focus()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Edit</button>
                <button type="button" disabled={pending} onClick={() => void copyMessage()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">
                  {copied === "message" ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>
          ) : null}
          {manualCopy ? (
            <textarea id="invite-manual-copy" readOnly value={manualCopy} onFocus={(event) => event.currentTarget.select()} rows={4} className="mt-3 w-full rounded-xl bg-ink px-3 py-2 text-sm text-cream ring-1 ring-line" />
          ) : null}
          <label className="mt-3 block text-xs font-semibold tracking-brand text-mute" htmlFor="invite-public-url">Invitation link</label>
          <input id="invite-public-url" readOnly value={phase === "ready" ? link : phase === "error" ? "" : phase === "creating" ? "Creating the link…" : ""} onFocus={(event) => event.currentTarget.select()} className="mt-1 h-11 w-full rounded-xl bg-ink px-3 text-sm text-cream ring-1 ring-line" />
          {link && inviteUrlIsLocal(link) ? <p className="mt-2 text-sm text-caution">This link is only available on your local machine.</p> : null}
          <p className="mt-2 text-xs text-mute">Nothing is sent until you press send in WhatsApp or another app.</p>
        </div>
      ) : null}

      {slug ? (
        <KairosVoice
          mode="dating"
          text={visibility === "mystery" ? "Less information. More confidence. I respect it." : "The note is ready. Send it when you are."}
          status="good"
          mark="吉"
        />
      ) : null}
    </div>
  );
}

function InvitationStatus({
  plannerToken,
  slug,
  reply,
  updatedAt,
  error,
  onRefresh,
}: {
  plannerToken: string;
  slug: string;
  reply: DatingInvite | null;
  updatedAt: string;
  error: string;
  onRefresh: () => void;
}) {
  const quote = reply?.replyNote?.trim() ?? "";
  const label = reply ? invitationStatusLabel(reply.status) : "";
  return (
    <section className="mt-4 rounded-2xl bg-panel px-4 py-4 ring-1 ring-line">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-brand text-accent">INVITATION</p>
        {plannerToken ? <button type="button" onClick={onRefresh} className="text-xs font-semibold text-mute">Refresh</button> : null}
      </div>
      {!plannerToken && !slug ? <p className="mt-2 text-sm font-semibold text-cream">NOT SENT</p> : null}
      {plannerToken && !reply && !error ? <p className="mt-2 text-sm text-mute">Checking the reply…</p> : null}
      {label ? <p className={clsx("mt-2 text-sm font-semibold", reply?.status === "sounds_good" ? "text-leaf" : reply?.status === "alternate_time_requested" ? "tracking-brand text-accent" : "text-cream")}>{label}</p> : null}
      {quote ? <p className="mt-2 text-sm text-cream">“{quote}”</p> : null}
      {reply?.status === "alternate_time_requested" ? <a href="#dating-when" className="press mt-3 inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">Review timing</a> : null}
      {reply && reply.status !== "pending" && updatedAt ? <p className="mt-2 text-xs text-mute">{updatedLabel(updatedAt)}</p> : null}
      {error ? <p className="mt-2 text-sm text-caution">{error}</p> : null}
    </section>
  );
}
