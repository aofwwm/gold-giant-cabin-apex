import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Check, Copy, Dices, Plus, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { clsx } from "clsx";
import { toast } from "sonner";
import { BoardHero, pickWinner, scoreSlots } from "@/components/kairos-board";
import { ConfettiBurst, Frame, SlotCard, fieldClass } from "@/components/kairos-ui";
import { addComment, addSlot, castVote, consultOracle, fetchEvent, spinVenue } from "@/lib/kairos.functions";
import { explainKairos, interpretCosmos } from "@/lib/kairos.intelligence";
import { cosmicProse, explainFromScores, type ExplanationView } from "@/lib/explain";
import { TYPE_LABEL } from "@/lib/mission";
import { scoreFingerprint } from "@/lib/score";
import type { Choice, OracleSource, SlotView, VoteView } from "@/lib/kairos.types";
import { formatMoment, formatWhen, isoToLocal, suggestSupper } from "@/lib/time";
import { CATEGORIES, categoryLabel, isCategory, type CategoryId } from "@/lib/venues";
import { mealFollowOn, placeSummary, PLATFORM_LABEL } from "@/lib/place";
import { createGoogleCalendarUrl } from "@/lib/google-calendar";

export const Route = createFileRoute("/meet/$code")({
  loader: async ({ params }) => {
    if (!/^[a-zA-Z0-9]{4,12}$/.test(params.code)) throw notFound();
    const event = await fetchEvent({ data: { code: params.code } });
    if (!event) throw notFound();
    return event;
  },
  // A slow refresh must not swap the page for "Opening the board…". That remount
  // throws the reader back to the top while they are choosing a time.
  pendingMs: 60_000,
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.title} · Kairos` : "Kairos" }],
  }),
  notFoundComponent: Missing,
  pendingComponent: Pending,
  component: MeetPage,
});

function Pending() {
  return (
    <Frame>
      <p className="px-6 py-24 text-center text-mute">Opening the board…</p>
    </Frame>
  );
}

function Missing() {
  return (
    <Frame>
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="font-display text-3xl text-vermilion">吉</p>
        <h1 className="mt-3 font-display text-3xl">This code has no board</h1>
        <p className="mt-2 text-mute">It may be mistyped, or the hour was never opened.</p>
        <Link
          to="/"
          search={{ mode: "meet", code: "" }}
          className="press mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-vermilion px-5 font-semibold text-cream"
        >
          Start one
        </Link>
      </main>
    </Frame>
  );
}

function mergeVotes(slot: SlotView, nick: string, optimistic: Record<string, Choice>): VoteView[] {
  const key = nick.trim().toLowerCase();
  const choice = optimistic[slot.id];
  if (!choice || !key) return slot.votes;
  const rest = slot.votes.filter((vote) => vote.nickname.toLowerCase() !== key);
  return [...rest, { nickname: nick.trim(), choice }];
}

function MeetPage() {
  const data = Route.useLoaderData();
  const { code } = Route.useParams();
  const router = useRouter();
  const [nick, setNick] = useState("");
  const [nickReady, setNickReady] = useState(false);
  const [optimistic, setOptimistic] = useState<Record<string, Choice>>({});
  const [pendingSlot, setPendingSlot] = useState("");
  const [burst, setBurst] = useState(0);
  const [copied, setCopied] = useState(false);
  const [oracle, setOracle] = useState<{ text: string; source: OracleSource } | null>(null);
  const [oracleBusy, setOracleBusy] = useState(false);
  const [vibe, setVibe] = useState<CategoryId>(isCategory(data.category) ? data.category : "supper");
  const [spinning, setSpinning] = useState(false);
  const [extraTime, setExtraTime] = useState(() => {
    const anchor = data.anchorAt || data.slots[0]?.startsAt || "";
    return anchor ? isoToLocal(anchor) : suggestSupper();
  });
  const [extraLabel, setExtraLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState("");
  const [noting, setNoting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [explanation, setExplanation] = useState<ExplanationView | null>(null);
  const [explainPending, setExplainPending] = useState(false);
  const [stale, setStale] = useState(false);
  const [cosmicText, setCosmicText] = useState("");
  const [cosmicPending, setCosmicPending] = useState(false);
  const [calendarNote, setCalendarNote] = useState("");
  const cosmicFor = useRef("");

  useEffect(() => {
    setNick(localStorage.getItem("kairos-nick") ?? "");
    setNickReady(true);
    try {
      if (sessionStorage.getItem(`kairos-revealed-${code}`) === "1") setRevealed(true);
    } catch {
      // Private mode can refuse storage. The button still works.
    }
  }, [code]);

  useEffect(() => {
    if (!nickReady) return;
    localStorage.setItem("kairos-nick", nick);
  }, [nick, nickReady]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const y = window.scrollY;
      void router.invalidate().finally(() => {
        requestAnimationFrame(() => {
          if (y > 80 && window.scrollY < 8) window.scrollTo(0, y);
        });
      });
    }, 8000);
    return () => window.clearInterval(id);
  }, [router]);

  useEffect(() => {
    setOptimistic((prev) => {
      let changed = false;
      const next = { ...prev };
      const key = nick.trim().toLowerCase();
      for (const slot of data.slots) {
        const choice = next[slot.id];
        if (!choice || !key) continue;
        const landed = slot.votes.some((vote) => vote.nickname.toLowerCase() === key && vote.choice === choice);
        if (landed) {
          delete next[slot.id];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [data, nick]);

  const displaySlots = data.slots.map((slot) => ({
    ...slot,
    votes: mergeVotes(slot, nick, optimistic),
  }));
  const scored = scoreSlots(displaySlots, data.title, data.kind, data.durationMin, data.mission);
  const winner = pickWinner(scored);
  const where = placeSummary(data.place);
  const mealChosen = data.place.makanWhen === "before" || data.place.makanWhen === "after";
  const meal = revealed && winner && winner.layer.total != null ? mealFollowOn(data.place, winner.slot.startsAt, data.durationMin) : null;
  const follow = meal ? { ...meal, href: `/?mode=makan&code=${code}` } : null;
  const askedFingerprint = useRef("");
  const fingerprint = scoreFingerprint(scored);
  const localExplanation: ExplanationView = {
    ...explainFromScores(scored, data.durationMin, data.mission),
    fingerprint,
    source: "rules",
  };
  const shownExplanation = explanation?.fingerprint === fingerprint ? explanation : localExplanation;
  const oracleText = oracle?.text || data.oracleText;
  const oracleSource = oracle?.source || data.oracleSource;

  function reveal() {
    setRevealed(true);
    try {
      sessionStorage.setItem(`kairos-revealed-${code}`, "1");
    } catch {
      // The pick still shows for this visit.
    }
    if (window.innerWidth < 1024) {
      document.getElementById("kairos-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function requestExplanation(fp: string, refresh = false) {
    askedFingerprint.current = fp;
    setExplainPending(true);
    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      setExplainPending(false);
      setStale(true);
    }, 22000);
    void explainKairos({ data: { code, refresh } })
      .then((result) => {
        if (settled || askedFingerprint.current !== fp) return;
        setExplanation(result);
        setStale(result.fingerprint !== fp || result.source === "rules");
      })
      .catch(() => {
        if (settled) return;
        setExplanation(null);
        setStale(true);
      })
      .finally(() => {
        settled = true;
        window.clearTimeout(timer);
        setExplainPending(false);
      });
  }

  useEffect(() => {
    if (!revealed || !winner || winner.layer.total == null) return;
    if (explanation && explanation.fingerprint !== fingerprint) {
      setStale(true);
      return;
    }
    if (explanation?.fingerprint === fingerprint) {
      setStale(explanation.source === "rules");
      return;
    }
    if (askedFingerprint.current === fingerprint) return;
    requestExplanation(fingerprint);
    // requestExplanation is stable enough for this click-driven reading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, fingerprint, explanation, code]);

  function refreshExplanation() {
    requestExplanation(fingerprint, true);
  }

  function openCosmic() {
    if (!winner) return;
    const local = cosmicProse(winner.layer.reading);
    window.setTimeout(() => {
      document.getElementById("full-reading")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 40);
    if (cosmicFor.current === winner.slot.id) return;
    if (!cosmicText) setCosmicText(local);
    const slotId = winner.slot.id;
    setCosmicPending(true);
    void interpretCosmos({ data: { code, slotId } })
      .then((result) => {
        setCosmicText(result.prose || local);
        cosmicFor.current = slotId;
      })
      .catch(() => setCosmicText(local))
      .finally(() => setCosmicPending(false));
  }

  async function copyText(text: string, ok: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(ok);
    } catch {
      toast.error("Could not copy. The code is on screen.");
    }
  }

  function shareMoment() {
    if (!winner || winner.layer.total == null) return;
    const when = winner.slot.label || formatMoment(winner.slot.startsAt);
    const text = [
      data.title,
      `Kairos pick: ${when}`,
      `Kairos Score: ${winner.layer.total} / 100`,
      `People ${winner.layer.people.points}/40 · Moment ${winner.layer.moment}/30 · Cosmos ${winner.layer.cosmicFit}/30`,
      `${window.location.origin}/meet/${code}`,
    ].join("\n");
    void copyText(text, "Moment copied");
  }

  function copyResult() {
    if (!winner || winner.layer.total == null) return;
    const when = winner.slot.label || formatMoment(winner.slot.startsAt);
    const lines = scored.map((item) => {
      const label = item.slot.label || formatMoment(item.slot.startsAt);
      const total = item.layer.total == null ? "waiting" : `${item.layer.total}`;
      return `${label}: ${total} · people ${item.layer.people.waiting ? "—" : item.layer.people.points} · moment ${item.layer.moment} · cosmos ${item.layer.cosmicFit}`;
    });
    void copyText([`${data.title}`, `Kairos pick: ${when} · ${winner.layer.total} / 100`, ...lines].join("\n"), "Result copied");
  }

  function downloadInvite() {
    if (!winner || winner.layer.total == null) return;
    const start = new Date(winner.slot.startsAt);
    const end = new Date(start.getTime() + data.durationMin * 60000);
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const when = winner.slot.label || formatMoment(winner.slot.startsAt);
    const description = `Kairos Score ${winner.layer.total} / 100. People ${winner.layer.people.points}/40, moment ${winner.layer.moment}/30, cosmos ${winner.layer.cosmicFit}/30. ${when}.`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kairos//EN",
      "BEGIN:VEVENT",
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${data.title.replace(/[\n,;]/g, " ")}`,
      `LOCATION:${placeSummary(data.place).replace(/[\n,;]/g, " ")}`,
      data.place.meetingUrl ? `URL:${data.place.meetingUrl}` : "",
      `DESCRIPTION:${description.replace(/[\n,;]/g, " ")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kairos.ics";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function openGoogleCalendar() {
    if (!winner || winner.layer.total == null) return;
    const platform =
      data.place.platform === "teams"
        ? "Microsoft Teams"
        : data.place.platform === "zoom"
          ? "Zoom"
          : data.place.platform === "skype"
            ? "Skype"
            : data.place.platform === "meet"
              ? "Google Meet"
              : data.place.platform === "webex"
                ? "Webex"
                : data.place.meetingUrl
                  ? "Online"
                  : "";
    const people = winner.layer.people;
    const url = createGoogleCalendarUrl({
      title: data.title,
      startTime: winner.slot.startsAt,
      durationMinutes: data.durationMin,
      timezone: "Asia/Singapore",
      meetingFormat: data.place.format,
      venueName: data.place.venueName,
      room: data.place.room,
      address: data.place.address,
      onlinePlatform: platform,
      onlineUrl: data.place.meetingUrl,
      kairosScore: winner.layer.total,
      kairosStatus: winner.layer.mark,
      participantCount: people.waiting ? undefined : people.roster,
      canAttend: people.waiting ? undefined : people.able,
      preferredCount: people.waiting ? undefined : people.love,
      purpose: data.mission?.summary ?? "",
    });
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    setCalendarNote(opened ? "Review and save the event in Google Calendar." : "Allow pop-ups, then try Add to Google Calendar again.");
  }

  async function copyLink() {
    const url = `${window.location.origin}/meet/${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy. The code is on screen.");
    }
  }

  async function vote(slotId: string, choice: Choice) {
    const name = nick.trim();
    if (!name) {
      toast.error("Add a nickname. The cosmos does not take blank ballots.");
      document.getElementById("nickname")?.focus();
      return;
    }
    setOptimistic((prev) => ({ ...prev, [slotId]: choice }));
    setPendingSlot(slotId);
    try {
      await castVote({ data: { code, slotId, nickname: name, choice } });
      if (choice === "love" || choice === "yes") setBurst((value) => value + 1);
      await router.invalidate();
    } catch (err) {
      setOptimistic((prev) => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
      toast.error(err instanceof Error ? err.message : "That vote did not land");
    } finally {
      setPendingSlot("");
    }
  }

  async function askOracle() {
    setOracleBusy(true);
    try {
      const result = await consultOracle({ data: { code } });
      setOracle(result);
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The oracle is quiet");
    } finally {
      setOracleBusy(false);
    }
  }

  async function spin() {
    setSpinning(true);
    try {
      const result = await spinVenue({
        data: { code, category: vibe, startsAt: extraTime || undefined },
      });
      toast.success(
        result.source === "grok" ? `${result.name} — Kairos checked the name` : `${result.name} — from the house list`,
      );
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The wheel stuck");
    } finally {
      setSpinning(false);
    }
  }

  async function onAdd(event: FormEvent) {
    event.preventDefault();
    if (!extraTime) {
      toast.error("Pick a time");
      return;
    }
    setAdding(true);
    try {
      await addSlot({
        data: { code, startsAt: extraTime, label: extraLabel.trim() || undefined },
      });
      setExtraLabel("");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add that");
    } finally {
      setAdding(false);
    }
  }

  async function onNote(event: FormEvent) {
    event.preventDefault();
    const name = nick.trim();
    const body = note.trim();
    if (!name) {
      toast.error("Sign the slip with a nickname.");
      document.getElementById("nickname")?.focus();
      return;
    }
    if (!body) return;
    setNoting(true);
    try {
      await addComment({ data: { code, nickname: name, body } });
      setNote("");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The slip did not stick");
    } finally {
      setNoting(false);
    }
  }

  const mineFor = (slot: SlotView): Choice | undefined => {
    const key = nick.trim().toLowerCase();
    if (!key) return undefined;
    return slot.votes.find((vote) => vote.nickname.toLowerCase() === key)?.choice;
  };

  return (
    <Frame>
      <ConfettiBurst burst={burst} />
      <header className="sticky top-0 z-20 border-b border-line bg-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" search={{ mode: "meet", code: "" }} className="press grid size-11 place-items-center rounded-xl ring-1 ring-line" aria-label="Home">
            <ArrowLeft className="size-4" />
          </Link>
          <nav className="flex gap-3 text-sm" aria-label="Kairos">
            <Link to="/" search={{ mode: "meet", code: "" }} className="font-semibold text-cream">Meet</Link>
            {mealChosen ? <Link to="/makan" search={{ code }} className="text-mute">Makan</Link> : null}
            <Link to="/out" className="text-mute">Team Out</Link>
          </nav>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gold">
              <span className="tracking-brand">{data.kind === "makan" ? "MAKAN" : "MEETING"}</span>
              {data.category ? <span className="font-medium text-mute"> · {categoryLabel(data.category)}</span> : null}
            </p>
            <h1 className="truncate font-display text-xl">{data.title}</h1>
          </div>
          <p className="font-mono text-sm tracking-widest text-gold">{code}</p>
          <button
            type="button"
            onClick={() => void copyLink()}
            className="press inline-flex h-11 items-center gap-2 rounded-xl bg-gold px-3 text-sm font-semibold text-ink"
          >
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <main id="votes" className="order-1 min-w-0 space-y-4 lg:order-1">
          <div className="rounded-2xl bg-panel p-4 ring-1 ring-line">
            <label htmlFor="nickname" className="text-sm font-medium text-cream">
              Your nickname
            </label>
            <input
              id="nickname"
              value={nick}
              onChange={(event) => setNick(event.target.value)}
              maxLength={24}
              autoComplete="nickname"
              placeholder="Mei, not mei@company.com"
              className={clsx(fieldClass, "mt-2")}
            />
            <p className="mt-2 text-xs text-mute">
              No login. No calendar. {data.durationMin} min
              {data.anchorAt ? ` · gather ${formatWhen(data.anchorAt)}` : ""}. One face per time. Names are not accounts.
            </p>
            {where || data.place.meetingUrl ? (
              <div className="mt-3 border-t border-line pt-3">
                <p className="text-xs font-semibold tracking-brand text-gold">
                  {data.place.format === "online" ? "ONLINE" : data.place.format === "hybrid" ? "HYBRID" : "PHYSICAL"}
                </p>
                {where ? <p className="mt-1 text-sm text-cream">{where}</p> : null}
                {data.place.meetingUrl ? (
                  <a href={data.place.meetingUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex text-sm font-semibold text-gold">
                    Join {PLATFORM_LABEL[data.place.platform]}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {displaySlots.length === 0 ? (
            <div className="rounded-2xl bg-panel px-4 py-10 text-center shadow-card">
              <h2 className="font-display text-2xl">No options on the table</h2>
              <p className="mt-2 text-sm text-mute">Spin a venue or add a time. Then the ballots open.</p>
            </div>
          ) : (
            displaySlots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                durationMin={data.durationMin}
                leading={revealed && winner?.slot.id === slot.id}
                mine={mineFor(slot)}
                pending={pendingSlot === slot.id}
                onVote={(choice) => void vote(slot.id, choice)}
              />
            ))
          )}

          <section className="rounded-2xl bg-panel p-4 shadow-card sm:p-5">
            <h2 className="font-display text-xl">Slips</h2>
            <form onSubmit={(event) => void onNote(event)} className="mt-3 flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="slip">
                Short note
              </label>
              <input
                id="slip"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={180}
                placeholder="Running ten minutes late"
                className={fieldClass}
              />
              <button
                type="submit"
                disabled={noting}
                className="press h-12 shrink-0 rounded-xl bg-ink px-4 font-semibold text-cream ring-1 ring-line disabled:opacity-50"
              >
                Leave a slip
              </button>
            </form>
            {data.comments.length === 0 ? (
              <p className="mt-3 text-sm text-mute">No slips yet. One line beats a twelve-message thread.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {data.comments.map((comment) => (
                  <li key={comment.id} className="border-t border-line pt-3">
                    <p className="text-sm text-cream">{comment.body}</p>
                    <p className="mt-1 text-xs text-mute">
                      {comment.nickname} · {formatWhen(comment.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <form onSubmit={(event) => void onAdd(event)} className="rounded-2xl bg-panel p-4 shadow-card sm:p-5">
            <h2 className="font-display text-xl">Add a time</h2>
            <label className="mt-3 block text-sm text-mute" htmlFor="extra-label">
              Place, optional
            </label>
            <input
              id="extra-label"
              value={extraLabel}
              onChange={(event) => setExtraLabel(event.target.value)}
              maxLength={80}
              placeholder="Swee Choon"
              className={clsx(fieldClass, "mt-1")}
            />
            <label className="mt-3 block text-sm text-mute" htmlFor="extra-time">
              Date and time, Singapore
            </label>
            <input
              id="extra-time"
              type="datetime-local"
              value={extraTime}
              onChange={(event) => setExtraTime(event.target.value)}
              className={clsx(fieldClass, "mt-1")}
            />
            <button
              type="submit"
              disabled={adding}
              className="press mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-cream ring-1 ring-line disabled:opacity-50"
            >
              <Plus className="size-4" aria-hidden />
              {adding ? "Adding…" : "Add to the board"}
            </button>
          </form>
        </main>

        <aside className="order-2 space-y-4 lg:sticky lg:top-20 lg:order-2">
          <BoardHero
            scored={scored}
            durationMin={data.durationMin}
            revealed={revealed}
            onReveal={reveal}
            onShare={shareMoment}
            onCopy={copyResult}
            onFull={openCosmic}
            onInvite={downloadInvite}
            pending={false}
            explanation={revealed ? shownExplanation : null}
            explainPending={explainPending}
            stale={stale}
            onRefreshExplanation={refreshExplanation}
            cosmicText={cosmicText}
            cosmicPending={cosmicPending}
            missionLabel={data.mission ? `${TYPE_LABEL[data.mission.meeting_type]} · ${data.mission.stakes} stakes` : ""}
            missionSummary={data.mission?.summary ?? ""}
            where={where}
            followOn={follow}
            onGoogleCalendar={openGoogleCalendar}
            googleNote={calendarNote}
          />
          <section className="rounded-2xl bg-panel p-4 shadow-card">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-gold" aria-hidden />
              <h2 className="font-display text-xl">Oracle</h2>
            </div>
            <p className="mt-2 text-sm text-mute">Two sentences. The title, the votes, and a Singaporean shrug.</p>
            {oracleText ? (
              <div className="fortune-slip mt-3 rounded-xl px-4 py-4" key={oracleText}>
                <p className="font-display text-base leading-snug">{oracleText}</p>
                <p className="mt-2 text-xs">
                  {oracleSource === "grok" ? "Read by Kairos" : "Local tong shu — Kairos was offline"}
                </p>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => void askOracle()}
              disabled={oracleBusy}
              className="press mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-cream ring-1 ring-line disabled:opacity-50"
            >
              <Sparkles className="size-4" aria-hidden />
              {oracleBusy ? "Consulting…" : oracleText ? "Ask again" : "Consult the oracle"}
            </button>
          </section>

          {mealChosen ? (
          <section className="rounded-2xl bg-panel p-4 shadow-card">
            <div className="flex items-center gap-2">
              <Dices className="size-4 text-jade" aria-hidden />
              <h2 className="font-display text-xl">Makan roulette</h2>
            </div>
            <p className="mt-2 text-sm text-mute">
              {data.place.makanWhen === "before" ? "Before the meeting: spin a spot onto the board." : "After the meeting: spin a supper, a court, or a drink."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={vibe === item.id}
                  onClick={() => setVibe(item.id)}
                  className={clsx(
                    "press min-h-10 rounded-xl px-2.5 text-left text-xs font-semibold",
                    vibe === item.id ? "bg-jade text-ink" : "bg-ink text-cream ring-1 ring-line",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => void spin()}
              disabled={spinning}
              className="press mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-jade font-semibold text-ink disabled:opacity-50"
            >
              <Dices className="size-4" aria-hidden />
              {spinning ? "Spinning…" : "Spin the roulette"}
            </button>
          </section>
          ) : null}
        </aside>
      </div>
    </Frame>
  );
}
