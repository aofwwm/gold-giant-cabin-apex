import { useNavigate } from "@tanstack/react-router";
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { fieldClass } from "@/components/kairos-ui";
import { HASH_STARTERS, type HashRoom, type HashTheme } from "@/lib/hash";
import {
  collateHashRoom,
  createHashSession,
  fetchHashRoom,
  hostHashRoom,
  summariseHashRoom,
  supportHashTheme,
  throwHashIdea,
  voteHashTheme,
} from "@/lib/hash.functions";

function hostKey(code: string): string {
  return `kairos-hash-host-${code}`;
}

function meKey(code: string): string {
  return `kairos-hash-me-${code}`;
}

function participantToken(code: string): string {
  const existing = localStorage.getItem(meKey(code));
  if (existing && /^[a-zA-Z0-9]{24,80}$/.test(existing)) return existing;
  const next = crypto.randomUUID().replace(/-/g, "");
  localStorage.setItem(meKey(code), next);
  return next;
}

function keepSynthesis(current: HashRoom | null, next: HashRoom): HashRoom {
  if (next.synthesis || !current?.synthesis || current.code !== next.code) return next;
  return { ...next, synthesis: current.synthesis };
}

function clock(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function HashStudio({ code }: { code: string }) {
  const navigate = useNavigate();
  const [room, setRoom] = useState<HashRoom | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [thrown, setThrown] = useState(false);
  const [openId, setOpenId] = useState("");
  const [present, setPresent] = useState(false);
  const [rename, setRename] = useState("");
  const [summary, setSummary] = useState("");
  const [actionNote, setActionNote] = useState("");
  const [prompt, setPrompt] = useState("What is slowing this project down?");
  const [context, setContext] = useState("");
  const [starter, setStarter] = useState("blockers");
  const [identityMode, setIdentityMode] = useState<"anonymous" | "named" | "choice">("choice");
  const [live, setLive] = useState(true);
  const [blind, setBlind] = useState(false);
  const [cosmic, setCosmic] = useState(false);
  const [voteLimit, setVoteLimit] = useState<1 | 3>(3);

  useEffect(() => {
    if (!code) return;
    let stop = false;
    const load = async () => {
      try {
        const next = await fetchHashRoom({
          data: { code, participantToken: participantToken(code), hostToken: localStorage.getItem(hostKey(code)) ?? "" },
        });
        if (!stop) {
          setRoom((current) => keepSynthesis(current, next));
          setError("");
        }
      } catch (err) {
        if (!stop) setError(err instanceof Error ? err.message : "The room did not open");
      }
    };
    void load();
    const id = window.setInterval(() => {
      if (!document.hidden) void load();
    }, 2500);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, [code]);

  const roomRef = useRef<HashRoom | null>(null);
  roomRef.current = room;

  useEffect(() => {
    const current = roomRef.current;
    if (!current || current.role !== "host" || current.status !== "open" || current.uncollatedCount < 4) return;
    const roomCode = current.code;
    const timer = window.setTimeout(() => {
      const latest = roomRef.current;
      if (!latest || latest.uncollatedCount < 4 || latest.status !== "open") return;
      const hostToken = localStorage.getItem(hostKey(roomCode)) ?? "";
      if (!hostToken) return;
      void collateHashRoom({ data: { code: roomCode, hostToken, auto: true } }).then((next) => setRoom((current) => keepSynthesis(current, next))).catch(() => undefined);
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [room?.code, room?.role, room?.status, room?.uncollatedCount]);

  async function createRoom() {
    setBusy(true);
    setError("");
    try {
      const created = await createHashSession({
        data: { prompt: prompt.trim(), context: context.trim(), starter, identityMode, showLiveBoard: live, blindRound: blind, voteLimit, cosmicEnabled: cosmic },
      });
      localStorage.setItem(hostKey(created.code), created.hostToken);
      await navigate({ to: "/", search: { mode: "hash", code: created.code } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the room");
    } finally {
      setBusy(false);
    }
  }

  async function throwIn() {
    if (!room) return;
    const line = text.trim();
    if (line.length < 2) return;
    setBusy(true);
    setThrown(true);
    setText("");
    try {
      const next = await throwHashIdea({
        data: {
          code: room.code,
          participantToken: participantToken(room.code),
          hostToken: localStorage.getItem(hostKey(room.code)) ?? "",
          text: line,
          anonymous: room.identityMode === "anonymous" || (room.identityMode === "choice" && anonymous),
          displayName: name,
        },
      });
      setRoom((current) => keepSynthesis(current, next));
      setError("");
    } catch (err) {
      setText(line);
      setThrown(false);
      setError(err instanceof Error ? err.message : "That one did not land");
    } finally {
      setBusy(false);
    }
  }

  async function host(command: {
    action: "pause" | "resume" | "reveal" | "end" | "voting" | "live" | "cosmic" | "rename" | "summary" | "merge" | "split" | "move" | "pin" | "hide" | "mark" | "lucky" | "reroll";
    open?: boolean;
    voteLimit?: 1 | 3;
    show?: boolean;
    enabled?: boolean;
    clusterId?: string;
    title?: string;
    summary?: string;
    intoId?: string;
    fromId?: string;
    submissionId?: string;
    pinned?: boolean;
    hidden?: boolean;
    kind?: "" | "action" | "park" | "discuss" | "decide";
    note?: string;
  }) {
    if (!room) return;
    const hostToken = localStorage.getItem(hostKey(room.code)) ?? "";
    setBusy(true);
    try {
      const next = await hostHashRoom({ data: { code: room.code, hostToken, participantToken: participantToken(room.code), command: command as never } });
      setRoom((current) => keepSynthesis(current, next));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The host action did not land");
    } finally {
      setBusy(false);
    }
  }

  if (!code) {
    return (
      <section className="lg:col-span-5 mx-auto w-full max-w-xl">
        <p className="text-xs font-semibold tracking-brand text-gold">WORK · HASH IT OUT</p>
        <h2 className="mt-1 font-display text-3xl text-cream">Open a room</h2>
        <p className="mt-2 text-sm text-mute">One question. Everyone throws ideas in. You collate when the room is full.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {HASH_STARTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={starter === item.id}
              onClick={() => {
                setStarter(item.id);
                if (item.prompt) setPrompt(item.prompt);
              }}
              className={clsx("press min-h-10 rounded-full px-3 text-sm", starter === item.id ? "bg-vermilion font-semibold text-cream" : "bg-[#1a1410] text-cream ring-1 ring-[#8a5a3a]")}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-medium text-cream" htmlFor="hash-prompt">Question</label>
        <textarea id="hash-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} maxLength={200} className={clsx(fieldClass, "mt-2 h-24 py-3")} />
        <label className="mt-4 block text-sm font-medium text-cream" htmlFor="hash-context">Context, optional</label>
        <input id="hash-context" value={context} onChange={(event) => setContext(event.target.value)} maxLength={500} className={clsx(fieldClass, "mt-2")} placeholder="Project, team, or what this is for" />
        <p className="mt-4 text-sm font-medium text-cream">Names</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["choice", "anonymous", "named"] as const).map((mode) => (
            <button key={mode} type="button" aria-pressed={identityMode === mode} onClick={() => setIdentityMode(mode)} className={clsx("press min-h-11 rounded-xl px-2 text-sm font-semibold", identityMode === mode ? "bg-vermilion text-cream" : "bg-[#1a1410] text-cream ring-1 ring-[#8a5a3a]")}>
              {mode === "choice" ? "Their choice" : mode === "anonymous" ? "Anonymous" : "Named"}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-2 text-sm text-cream">
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={live} onChange={(event) => setLive(event.target.checked)} /> Participants can see the live board</label>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={blind} onChange={(event) => setBlind(event.target.checked)} /> Blind first round</label>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={cosmic} onChange={(event) => setCosmic(event.target.checked)} /> Cosmic mode, for a lucky pick later</label>
        </div>
        <label className="mt-3 block text-sm text-cream" htmlFor="hash-votes">Votes each, once voting opens</label>
        <select id="hash-votes" value={voteLimit} onChange={(event) => setVoteLimit(event.target.value === "1" ? 1 : 3)} className={clsx(fieldClass, "mt-2")}>
          <option value={3}>3 votes</option>
          <option value={1}>1 vote</option>
        </select>
        {error ? <p className="mt-3 text-sm text-vermilion">{error}</p> : null}
        <button type="button" disabled={busy || prompt.trim().length < 2} onClick={() => void createRoom()} className="press mt-4 min-h-12 w-full rounded-xl bg-vermilion font-semibold text-cream disabled:opacity-50">Open the room</button>
      </section>
    );
  }

  if (!room) {
    return <section className="lg:col-span-5"><p className="text-mute">{error || "Opening the room…"}</p></section>;
  }

  const hostMode = room.role === "host";
  const boardVisible = hostMode || (room.revealed && room.showLiveBoard) || (!room.blindRound && room.showLiveBoard);
  const open = room.themes.find((theme) => theme.id === openId) ?? null;
  const covered = !hostMode && room.blindRound && !room.revealed;

  return (
    <section className={clsx("lg:col-span-5", present && "fixed inset-0 z-40 overflow-auto bg-ink px-4 py-6 sm:px-10")}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-brand text-gold">HASH IT OUT{hostMode ? " · HOST" : ""}</p>
          <h2 className={clsx("mt-1 max-w-3xl font-display text-cream", present ? "text-4xl sm:text-5xl" : "text-3xl")}>{room.prompt}</h2>
          {room.context ? <p className="mt-2 max-w-2xl text-sm text-mute">{room.context}</p> : null}
        </div>
        {hostMode && !present ? (
          <div className="text-right">
            <p className="font-mono text-2xl tracking-widest text-gold">{room.code}</p>
            <button type="button" className="press mt-1 text-sm font-semibold text-cream" onClick={() => void navigator.clipboard.writeText(`${window.location.origin}${room.sharePath}`).then(() => toast.success("Link copied"))}>Copy link</button>
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-mute">
        {room.participantCount} in the room · {room.submissionCount} {room.submissionCount === 1 ? "voice" : "voices"} here
        {room.uncollatedCount > 0 ? " · The room is thinking" : room.themeCount > 1 ? " · Common ground found" : ""}
        {room.status === "paused" ? " · Paused" : room.status === "voting" ? " · Voting" : room.status === "closed" ? " · Closed" : ""}
      </p>
      {error ? <p className="mt-2 text-sm text-vermilion">{error}</p> : null}

      {room.status === "open" || room.status === "paused" ? (
        <div className="mt-4 rounded-2xl bg-[#1a1410] p-3 ring-1 ring-[#8a5a3a]">
          {covered ? <p className="mb-2 text-sm text-gold">Blind round. The board stays covered until the host reveals it.</p> : null}
          {room.identityMode === "choice" ? (
            <div className="mb-2 flex gap-2">
              <button type="button" aria-pressed={anonymous} onClick={() => setAnonymous(true)} className={clsx("press min-h-10 rounded-full px-3 text-sm", anonymous ? "bg-vermilion text-cream" : "text-mute ring-1 ring-line")}>Anonymous</button>
              <button type="button" aria-pressed={!anonymous} onClick={() => setAnonymous(false)} className={clsx("press min-h-10 rounded-full px-3 text-sm", !anonymous ? "bg-gold text-ink" : "text-mute ring-1 ring-line")}>Use a name</button>
            </div>
          ) : null}
          {room.identityMode === "named" || (room.identityMode === "choice" && !anonymous) ? (
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" maxLength={24} className={clsx(fieldClass, "mb-2")} />
          ) : null}
          <label className="sr-only" htmlFor="hash-idea">Throw in an idea</label>
          <textarea id="hash-idea" value={text} onChange={(event) => setText(event.target.value)} placeholder="Throw in an idea..." maxLength={240} className={clsx(fieldClass, "h-24 py-3 text-base")} />
          <button type="button" disabled={busy || room.status !== "open" || text.trim().length < 2} onClick={() => void throwIn()} className="press mt-2 min-h-12 w-full rounded-xl bg-vermilion text-base font-semibold text-cream disabled:opacity-50">Throw it in</button>
          {thrown ? <p className="mt-2 text-sm text-gold">Thrown in. Add another whenever you want.</p> : null}
        </div>
      ) : null}

      {hostMode && !present ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => void collateHashRoom({ data: { code: room.code, hostToken: localStorage.getItem(hostKey(room.code)) ?? "", participantToken: participantToken(room.code), auto: false } }).then((next) => setRoom((current) => keepSynthesis(current, next))).catch((err) => setError(err instanceof Error ? err.message : "Collate failed"))} className="press min-h-12 rounded-xl bg-gold px-4 font-semibold text-ink">Collate</button>
          <button type="button" onClick={() => void summariseHashRoom({ data: { code: room.code, hostToken: localStorage.getItem(hostKey(room.code)) ?? "", participantToken: participantToken(room.code) } }).then((next) => setRoom(next)).catch((err) => setError(err instanceof Error ? err.message : "The summary did not land"))} className="press min-h-12 rounded-xl bg-[#1a1410] px-4 font-semibold text-cream ring-1 ring-gold">Summarise the room</button>
          {room.blindRound && !room.revealed ? <button type="button" onClick={() => void host({ action: "reveal" })} className="press min-h-12 rounded-xl bg-vermilion px-4 font-semibold text-cream">Reveal</button> : null}
          {room.status === "open" ? <button type="button" onClick={() => void host({ action: "pause" })} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Pause</button> : null}
          {room.status === "paused" ? <button type="button" onClick={() => void host({ action: "resume" })} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Resume</button> : null}
          {room.status !== "voting" && room.status !== "closed" ? <button type="button" onClick={() => void host({ action: "voting", open: true, voteLimit: room.voteLimit === 1 ? 1 : 3 })} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Open voting</button> : null}
          {room.status === "voting" ? <button type="button" onClick={() => void host({ action: "voting", open: false })} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Close voting</button> : null}
          <button type="button" onClick={() => void host({ action: "live", show: !room.showLiveBoard })} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">{room.showLiveBoard ? "Hide board" : "Show board"}</button>
          <button type="button" onClick={() => void host({ action: "cosmic", enabled: !room.cosmicEnabled })} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">{room.cosmicEnabled ? "Cosmic on" : "Cosmic off"}</button>
          {room.cosmicEnabled ? <button type="button" onClick={() => void host({ action: "lucky" })} className="press min-h-11 rounded-xl px-3 text-sm text-gold ring-1 ring-gold">Lucky pick</button> : null}
          {room.cosmicEnabled && room.luckyId ? <button type="button" onClick={() => void host({ action: "reroll" })} className="press min-h-11 rounded-xl px-3 text-sm text-gold ring-1 ring-gold">Reroll luck</button> : null}
          <button type="button" onClick={() => setPresent(true)} className="press min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Present</button>
          {room.status !== "closed" ? <button type="button" onClick={() => void host({ action: "end" })} className="press min-h-11 rounded-xl px-3 text-sm text-mute ring-1 ring-line">End session</button> : null}
        </div>
      ) : null}
      {present ? <button type="button" onClick={() => setPresent(false)} className="press mt-4 min-h-11 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Leave present mode</button> : null}

      {boardVisible ? <Results room={room} /> : null}

      <div className="mt-5">
        <p className="text-xs font-semibold tracking-brand text-gold">{covered && !hostMode ? "YOUR IDEAS" : "LIVE COMMON GROUND"}</p>
        {!room.themes.length && !room.loose.length ? <p className="mt-3 font-display text-2xl text-cream">Quiet room. Throw in the first idea.</p> : null}
        <div className={clsx("mt-3 grid gap-3", present ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
          {room.themes.map((theme) => (
            <ThemeCard key={`${theme.id}-${theme.voices}`} theme={theme} present={present} onOpen={() => { setOpenId(theme.id); setRename(theme.title); setSummary(theme.summary); setActionNote(theme.actionNote); }} />
          ))}
        </div>
        {room.loose.length ? (
          <div className="mt-4">
            {covered && !hostMode ? null : <p className="text-xs font-semibold tracking-brand text-mute">STILL ON THEIR OWN · {room.loose.length}</p>}
            <ul className="mt-2 space-y-2">
              {room.loose.map((line) => (
                <li key={line.id} className="rounded-xl bg-panel px-3 py-3 text-cream ring-1 ring-line">
                  <p>{line.text}</p>
                  <p className="mt-1 text-xs text-mute">{line.label} · {clock(line.createdAt)}{covered && !hostMode ? "" : " · New thread emerging"}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {open && boardVisible ? (
        <div className="mt-4 rounded-2xl bg-ink p-4 ring-1 ring-gold">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-wide text-cream">{open.title}</h3>
              <p className="text-sm text-gold">{open.voices} {open.voices === 1 ? "voice" : "voices"}{open.support ? ` · Same here ${open.support}` : ""}{open.votes ? ` · ${open.votes} ${open.votes === 1 ? "vote" : "votes"}` : ""}</p>
              {open.summary ? <p className="mt-2 text-sm text-mute">{open.summary}</p> : null}
            </div>
            <button type="button" onClick={() => setOpenId("")} className="press min-h-10 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Close</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" disabled={open.mineSupported || busy} onClick={() => void supportHashTheme({ data: { code: room.code, participantToken: participantToken(room.code), hostToken: localStorage.getItem(hostKey(room.code)) ?? "", clusterId: open.id } }).then((next) => setRoom((current) => keepSynthesis(current, next)))} className="press min-h-11 rounded-xl bg-[#1a1410] px-3 text-sm font-semibold text-cream ring-1 ring-[#8a5a3a] disabled:opacity-50">{open.mineSupported ? "You said same here" : "Same here"}</button>
            {room.status === "voting" ? <button type="button" disabled={open.mineVoted || room.votesCast >= room.voteLimit || busy} onClick={() => void voteHashTheme({ data: { code: room.code, participantToken: participantToken(room.code), hostToken: localStorage.getItem(hostKey(room.code)) ?? "", clusterId: open.id } }).then((next) => setRoom((current) => keepSynthesis(current, next)))} className="press min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink disabled:opacity-50">Vote · {Math.max(0, room.voteLimit - room.votesCast)} left</button> : null}
          </div>
          {hostMode ? (
            <div className="mt-3 space-y-2">
              <div className="flex gap-2">
                <input value={rename} onChange={(event) => setRename(event.target.value)} className={fieldClass} aria-label="Theme name" />
                <button type="button" onClick={() => void host({ action: "rename", clusterId: open.id, title: rename })} className="press min-h-12 shrink-0 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Rename</button>
              </div>
              <div className="flex gap-2">
                <input value={summary} onChange={(event) => setSummary(event.target.value)} className={fieldClass} aria-label="Theme summary" placeholder="Summary" />
                <button type="button" onClick={() => void host({ action: "summary", clusterId: open.id, summary })} className="press min-h-12 shrink-0 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">Save</button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => void host({ action: "pin", clusterId: open.id, pinned: !open.pinned })} className="press min-h-10 rounded-xl px-3 text-sm text-cream ring-1 ring-line">{open.pinned ? "Unpin" : "Pin"}</button>
                {room.themes.filter((theme) => theme.id !== open.id).map((theme) => (
                  <button key={theme.id} type="button" onClick={() => void host({ action: "merge", intoId: open.id, fromId: theme.id })} className="press min-h-10 rounded-xl px-3 text-sm text-cream ring-1 ring-line">Merge in {theme.title}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(["action", "park", "discuss", "decide"] as const).map((kind) => (
                  <button key={kind} type="button" onClick={() => void host({ action: "mark", clusterId: open.id, kind, note: actionNote })} className={clsx("press min-h-10 rounded-xl px-3 text-sm", open.actionKind === kind ? "bg-vermilion text-cream" : "text-cream ring-1 ring-line")}>{kind === "decide" ? "Decide now" : kind[0]?.toUpperCase() + kind.slice(1)}</button>
                ))}
              </div>
              <input value={actionNote} onChange={(event) => setActionNote(event.target.value)} placeholder="Action note, optional" maxLength={160} className={fieldClass} />
            </div>
          ) : null}
          <ul className="mt-4 space-y-2">
            {open.lines.map((line) => (
              <li key={line.id} className={clsx("rounded-xl px-3 py-3 ring-1", line.hidden ? "bg-ink text-mute ring-line" : "bg-[#1a1410] text-cream ring-[#8a5a3a]")}>
                <p>{line.text}</p>
                <p className="mt-1 text-xs text-mute">{line.hidden ? "Hidden · " : ""}{line.label} · {clock(line.createdAt)}</p>
                {hostMode ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => void host({ action: "split", clusterId: open.id, submissionId: line.id })} className="press min-h-10 rounded-xl px-3 text-xs text-cream ring-1 ring-line">Split out</button>
                    <button type="button" onClick={() => void host({ action: "hide", submissionId: line.id, hidden: !line.hidden })} className="press min-h-10 rounded-xl px-3 text-xs text-cream ring-1 ring-line">{line.hidden ? "Restore" : "Hide"}</button>
                    {room.themes.filter((theme) => theme.id !== open.id).slice(0, 6).map((theme) => (
                      <button key={theme.id} type="button" onClick={() => void host({ action: "move", submissionId: line.id, clusterId: theme.id })} className="press min-h-10 rounded-xl px-3 text-xs text-cream ring-1 ring-line">Move to {theme.title}</button>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function ThemeCard({ theme, present, onOpen }: { theme: HashTheme; present: boolean; onOpen: () => void }) {
  const grow = theme.prominence;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={clsx(
        "hash-tile press rounded-2xl bg-[#1c1612] p-4 text-left text-cream ring-1",
        grow === 3 ? "sm:col-span-2 ring-2 ring-vermilion" : grow === 2 ? "ring-2 ring-[#e23b28]/80" : grow === 1 ? "ring-[#e6b34d]/80" : "ring-[#8a5a3a]",
        theme.hidden && "opacity-50",
      )}
    >
      <p className={clsx("font-semibold uppercase tracking-wide", present || grow >= 2 ? "text-2xl" : "text-lg")}>{theme.title}</p>
      <p className="mt-1 text-sm font-semibold text-gold">{theme.voices} {theme.voices === 1 ? "voice" : "voices"}{theme.voices >= 3 ? " · This one is growing" : ""}</p>
      {theme.support > 0 ? <p className="text-sm text-cream">Same here · {theme.support}</p> : null}
      {theme.votes > 0 ? <p className="text-sm text-cream">{theme.votes} {theme.votes === 1 ? "vote" : "votes"}</p> : null}
      {theme.summary ? <p className="mt-2 text-sm text-mute">{theme.summary}</p> : null}
      {theme.actionKind ? <p className="mt-2 text-xs font-semibold tracking-brand text-gold">{theme.actionKind === "decide" ? "DECIDE NOW" : theme.actionKind.toUpperCase()}{theme.actionNote ? ` · ${theme.actionNote}` : ""}</p> : null}
    </button>
  );
}

function Results({ room }: { room: HashRoom }) {
  const strongest = room.themes.find((theme) => theme.id === room.strongestId);
  const favourite = room.themes.find((theme) => theme.id === room.favouriteId);
  const hidden = room.themes.find((theme) => theme.id === room.hiddenSignalId);
  const lucky = room.cosmicEnabled ? room.themes.find((theme) => theme.id === room.luckyId) : undefined;
  if (!strongest && !favourite && !hidden && !lucky && !room.synthesis) return null;
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {strongest ? <article className="rounded-2xl bg-[#1a1410] p-4 ring-1 ring-vermilion"><p className="text-xs font-semibold tracking-brand text-gold">STRONGEST SIGNAL</p><p className="mt-1 text-xl text-cream">{strongest.title}</p><p className="text-sm text-mute">{strongest.voices} independent {strongest.voices === 1 ? "voice" : "voices"}</p></article> : null}
      {favourite ? <article className="rounded-2xl bg-[#1a1410] p-4 ring-1 ring-gold"><p className="text-xs font-semibold tracking-brand text-gold">CROWD FAVOURITE</p><p className="mt-1 text-xl text-cream">{favourite.title}</p><p className="text-sm text-mute">{favourite.votes} {favourite.votes === 1 ? "vote" : "votes"} · not the same thing as how often it was raised</p></article> : null}
      {hidden && hidden.id !== strongest?.id && hidden.id !== favourite?.id ? <article className="rounded-2xl bg-[#1a1410] p-4 ring-1 ring-line"><p className="text-xs font-semibold tracking-brand text-mute">HIDDEN SIGNAL</p><p className="mt-1 text-xl text-cream">{hidden.title}</p><p className="text-sm text-mute">Several anonymous responses mention {hidden.summary || hidden.title.toLowerCase()}.</p></article> : null}
      {lucky ? <article className="rounded-2xl bg-[#1a1410] p-4 ring-1 ring-gold"><p className="text-xs font-semibold tracking-brand text-gold">LUCKY PICK</p><p className="mt-1 text-xl text-cream">{lucky.title}</p><p className="text-sm text-mute">The universe gets one vote. It does not change the count.</p></article> : null}
      {room.synthesis ? (
        <article className="rounded-2xl bg-[#1a1410] p-4 ring-1 ring-line sm:col-span-2">
          <p className="text-xs font-semibold tracking-brand text-gold">AI SYNTHESIS{room.synthesis.source === "rules" ? " · FROM THE BOARD" : ""}</p>
          <SynthesisList label="Top themes" items={room.synthesis.topThemes} />
          <SynthesisList label="Areas of agreement" items={room.synthesis.agreement} />
          <SynthesisList label="Differing views" items={room.synthesis.differing} />
          <SynthesisList label="Possible next actions" items={room.synthesis.nextActions} />
          <SynthesisList label="Questions to explore" items={room.synthesis.questions} />
        </article>
      ) : null}
    </div>
  );
}

function SynthesisList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold text-cream">{label}</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-mute">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
