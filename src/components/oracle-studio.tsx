import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { KairosVoice } from "@/components/kairos-voice";
import { fieldClass } from "@/components/kairos-ui";
import { askOracle } from "@/lib/oracle.functions";
import { parseQuestionContract } from "@/lib/oracle-contract";
import { dailyKey } from "@/lib/oracle-cache";
import {
  ORACLE_FRAMING,
  ORACLE_HOW,
  oracleAvailability,
  plannedSteps,
  selectMethods,
  type OracleLayer,
  type OracleMethodChoice,
  type OracleMethodId,
  type OracleMethodStatus,
  type OracleReading,
  type OracleSignal,
} from "@/lib/oracle";
import { blankItem, readTodayItems, writeTodayItems } from "@/lib/today-store";
import { sgtNow } from "@/lib/time";

const HINTS = [
  { id: "love", label: "Love" },
  { id: "career", label: "Career" },
  { id: "money", label: "Money" },
  { id: "timing", label: "Timing" },
  { id: "travel", label: "Travel" },
  { id: "family", label: "Family" },
  { id: "decision", label: "Decisions" },
  { id: "", label: "Ask anything" },
] as const;

const EXAMPLES = [
  "Is tomorrow a good day to ask my boss for a promotion?",
  "Should I leave my current job?",
  "Are we compatible?",
  "Which day between 10 and 20 October is best to launch?",
];

const STORE = "kairos-oracle-readings";
const CURRENT = "kairos-oracle-current";
const DAILY = "kairos-oracle-daily";

type Saved = { id: string; date: string; question: string; energy: string; category: string; reading: OracleReading };
type DailySaved = { key: string; reading: OracleReading };

function sgtIso(): string {
  const now = sgtNow();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.y}-${pad(now.m)}-${pad(now.d)}`;
}

function loadSaved(): Saved[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE) ?? "[]") as Saved[];
    return Array.isArray(raw) ? raw.filter((item) => item && typeof item.id === "string").slice(0, 20) : [];
  } catch {
    return [];
  }
}

function loadDaily(key: string): OracleReading | null {
  try {
    const raw = JSON.parse(localStorage.getItem(DAILY) ?? "null") as DailySaved | null;
    if (!raw || raw.key !== key || typeof raw.reading?.id !== "string" || !Array.isArray(raw.reading.layers)) return null;
    return raw.reading;
  } catch {
    return null;
  }
}

function storeDaily(key: string, reading: OracleReading): void {
  try {
    localStorage.setItem(DAILY, JSON.stringify({ key, reading } satisfies DailySaved));
  } catch {
    /* Quota or private mode. The draw still stays on screen. */
  }
}

function statusWord(status: OracleMethodStatus): string {
  if (status === "not_connected") return "Not connected";
  if (status === "needs_info") return "Needs information";
  if (status === "not_relevant") return "Not relevant";
  if (status === "not_used") return "Not used";
  return "";
}

function CrystalBall({ phase, steps, reading, question }: { phase: "idle" | "reading" | "reveal"; steps: string[]; reading: OracleReading | null; question: string }) {
  const synthesis = reading?.synthesis;
  return (
    <div className="oracle-ball" data-phase={phase}>
      <span className="oracle-ball__mist" aria-hidden />
      <span className="oracle-ball__mist oracle-ball__mist--slow" aria-hidden />
      <div className="oracle-ball__copy" aria-live="polite">
        {phase === "idle" ? (
          <>
            <p className="oracle-ball__kicker">ASK ORACLE</p>
            {question.trim() ? <p className="oracle-ball__says">{question.trim()}</p> : null}
          </>
        ) : null}
        {phase === "reading" ? (
          <ol className="oracle-ball__steps">
            {steps.map((step) => (
              <li key={step} className="oracle-ball__step">{step}</li>
            ))}
          </ol>
        ) : null}
        {phase === "reveal" && synthesis ? (
          <>
            <p className="oracle-ball__kicker">{synthesis.dimension || "OVERALL"}</p>
            <p className="oracle-ball__band">{synthesis.band}</p>
            <p className="oracle-ball__quiet">{synthesis.bandLabel}</p>
            {synthesis.cycle ? <p className="oracle-ball__quiet">{synthesis.cycle}</p> : null}
            {synthesis.window ? (
              <>
                <p className="oracle-ball__action">{synthesis.windowLabel || "WINDOW"}</p>
                <p className="oracle-ball__quiet">{synthesis.window}</p>
              </>
            ) : (
              <>
                <p className="oracle-ball__action">{synthesis.action}</p>
                <p className="oracle-ball__quiet">{synthesis.actionLabel}</p>
              </>
            )}
          </>
        ) : null}
        {phase === "reveal" && reading && !synthesis ? <p className="oracle-ball__says">{reading.says}</p> : null}
      </div>
    </div>
  );
}

function MethodReport({ methods }: { methods: OracleMethodChoice[] }) {
  const selected = methods.filter((item) => item.selected);
  const rest = methods.filter((item) => !item.selected);
  return (
    <section aria-label="Divination methods Kairos selected">
      <p className="text-xs font-semibold tracking-brand text-sky">
        KAIROS SELECTED · {selected.length} {selected.length === 1 ? "METHOD" : "METHODS"}
      </p>
      <p className="mt-2 text-sm text-mute">Based on what you're asking, these methods are most relevant.</p>
      {selected.length ? (
        <ul className="mt-3 space-y-3">
          {selected.map((item) => (
            <li key={item.method} className="border-l-2 border-sky pl-3">
              <p className="text-sm font-semibold text-cream">
                {item.name}
                {item.mark ? ` · ${item.mark}` : ""}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-mute">{item.reason}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-cream">No divination method fits this question.</p>
      )}
      {rest.length ? (
        <details className="mt-3">
          <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-sky">View all methods</summary>
          <ul className="space-y-3 pb-2">
            {rest.map((item) => (
              <li key={item.method}>
                <p className="text-sm font-semibold text-cream">
                  {item.name}
                  {item.mark ? ` · ${item.mark}` : ""}
                </p>
                <p className="text-xs font-semibold tracking-brand text-sun">{statusWord(item.status)}</p>
                <p className="mt-1 text-sm leading-relaxed text-mute">{item.reason}</p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

function SignalEssay({ signal, open }: { signal: OracleSignal; open?: boolean }) {
  return (
    <details {...(open ? { open: true } : {})} className="rounded-xl bg-panel px-4 py-3 ring-1 ring-line">
      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3">
        <span className="text-sm font-semibold text-cream">
          {signal.name}
          {signal.mark ? ` · ${signal.mark}` : ""}
        </span>
        <span className="font-display text-3xl text-cream">{signal.signal}</span>
      </summary>
      <dl className="mt-3 grid gap-3 text-sm">
        <div>
          <dt className="text-xs font-semibold tracking-brand text-sky">STRENGTH</dt>
          <dd className="text-cream">{signal.strengthLabel}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-brand text-sky">ANALYSIS</dt>
          <dd className="leading-relaxed text-mute">{signal.interpretation}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-brand text-sky">WHY IT MATTERS</dt>
          <dd className="leading-relaxed text-mute">{signal.whyItMatters}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-brand text-sky">RAW RESULT</dt>
          <dd className="text-cream" data-oracle-raw={signal.method}>{signal.raw}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-brand text-sky">INTERPRETATION</dt>
          <dd className="leading-relaxed text-mute">{signal.interpretation}</dd>
        </div>
      </dl>
    </details>
  );
}

function LayerBlock({ layer }: { layer: OracleLayer }) {
  const signal = layer.lean === "favourable" ? "吉" : layer.lean === "neutral" ? "中" : "忌";
  return (
    <article className="rounded-xl bg-ink px-4 py-3 ring-1 ring-line">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold tracking-brand text-sky">{layer.name}</p>
        <p className="font-display text-2xl text-cream">{signal}</p>
      </div>
      <p className="mt-1 text-sm text-cream" data-oracle-raw={layer.id}>{layer.result}</p>
      <p className="text-sm text-sun">{layer.detail}</p>
      <p className="mt-1 text-sm leading-relaxed text-mute">{layer.line}</p>
    </article>
  );
}

function UsedList({ reading }: { reading: OracleReading }) {
  const signals = reading.signals ?? [];
  return (
    <section aria-label="Used in this reading">
      <p className="text-xs font-semibold tracking-brand text-sky">USED IN THIS READING</p>
      {signals.length ? (
        <ul className="mt-3 space-y-3">
          {signals.map((signal) => (
            <li key={signal.method} className="border-l-2 border-sky pl-3">
              <p className="text-sm font-semibold text-cream">
                {signal.name}
                {signal.mark ? ` · ${signal.mark}` : ""}
                <span className="ml-2 font-display text-xl">{signal.signal}</span>
              </p>
              <p className="text-sm text-cream">{signal.raw}</p>
              <p className="mt-1 text-sm text-mute">{signal.interpretation}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-mute">No method produced a result for this question.</p>
      )}
    </section>
  );
}

export function OracleStudio() {
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");
  const [panel, setPanel] = useState<"ask" | "compare" | "dates">("ask");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [windowDays, setWindowDays] = useState(7);
  const [birthDate, setBirthDate] = useState("");
  const [birthDateB, setBirthDateB] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [manual, setManual] = useState(false);
  const [picked, setPicked] = useState<OracleMethodId[]>([]);
  const [reading, setReading] = useState<OracleReading | null>(null);
  const [pending, setPending] = useState(false);
  const [pendingMode, setPendingMode] = useState<"ask" | "daily" | "compare" | "dates">("ask");
  const [error, setError] = useState("");
  const [why, setWhy] = useState(false);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState("");
  const flight = useRef<Promise<void> | null>(null);

  const catalog = oracleAvailability(birthDate, birthDateB);
  const selectable = catalog.filter((item) => item.status === "available").map((item) => item.method);
  const loveReading = selectMethods({
    question: question.trim() || (hint === "love" ? "love" : "ask"),
    mode: "ask",
    hint,
    birthDate,
    birthDateB,
  }).some((item) => item.method === "zodiac" && (item.status === "needs_info" || item.status === "selected"));

  useEffect(() => {
    setSaved(loadSaved());
    try {
      const raw = sessionStorage.getItem(CURRENT);
      if (!raw) return;
      const parsed = JSON.parse(raw) as OracleReading;
      if (parsed && typeof parsed.id === "string" && Array.isArray(parsed.layers)) {
        setReading(parsed);
        setQuestion(parsed.question ?? "");
      }
    } catch {
      /* A broken saved draw should not block a new question. */
    }
  }, []);

  useEffect(() => {
    if (!reading) return;
    try {
      sessionStorage.setItem(CURRENT, JSON.stringify(reading));
    } catch {
      /* Quota or private mode. The draw still stays on screen. */
    }
  }, [reading]);

  async function ask(mode: "ask" | "daily" | "compare" | "dates" = panel === "ask" ? "ask" : panel, fresh = false) {
    if (flight.current) return;
    const text = question.trim();
    if (mode !== "daily" && mode !== "compare" && text.length < 4) {
      setError("Ask a real question. A word is not an omen.");
      return;
    }
    if (mode === "compare" && (optionA.trim().length < 2 || optionB.trim().length < 2) && !/\bor\b/i.test(text)) {
      setError("Name both choices.");
      return;
    }
    const asked = mode === "daily" ? "What is the energy of today?" : text;
    const askedHint = mode === "compare" ? "compare" : mode === "dates" ? "which day" : mode === "daily" ? "today" : hint;
    if (selectMethods({ question: asked, mode, hint: askedHint, birthDate, birthDateB }).some((item) => item.method === "zodiac" && item.status === "needs_info")) {
      setError("Love compatibility needs both dates of birth.");
      return;
    }
    const include = manual ? picked.filter((id) => selectable.includes(id)) : undefined;
    const dayKey = dailyKey({ birthDate, birthDateB, include }, sgtIso());
    if (mode === "daily" && !fresh) {
      const cached = loadDaily(dayKey);
      if (cached) {
        setError("");
        setReading(cached);
        setQuestion(cached.question);
        return;
      }
    }
    setError("");
    setPendingMode(mode);
    setPending(true);
    setWhy(false);
    setCopied(false);
    setAdded("");
    const run = (async () => {
      const next = await askOracle({
        data: {
          question: mode === "daily" ? "What is the energy of today?" : text,
          mode,
          hint: mode === "compare" ? "compare" : mode === "dates" ? "which day" : hint,
          optionA,
          optionB,
          windowDays,
          birthDate,
          birthDateB,
          birthTime,
          birthPlace,
          include,
          fresh,
        },
      });
      setReading(next);
      if (mode === "daily") storeDaily(dayKey, next);
    })();
    flight.current = run;
    try {
      await run;
    } catch (err) {
      setError(err instanceof Error ? err.message : "The reading did not come back.");
    } finally {
      flight.current = null;
      setPending(false);
    }
  }

  function saveReading() {
    if (!reading || reading.guard !== "none") return;
    const next = [
      {
        id: reading.id,
        date: new Date().toISOString().slice(0, 10),
        question: reading.question,
        energy: reading.synthesis?.band ?? reading.energy,
        category: reading.questionType,
        reading,
      },
      ...loadSaved().filter((item) => item.id !== reading.id),
    ].slice(0, 20);
    localStorage.setItem(STORE, JSON.stringify(next));
    setSaved(next);
  }

  async function shareReading() {
    if (!reading) return;
    const synthesis = reading.synthesis;
    const text = [
      "ORACLE",
      reading.question,
      synthesis ? `OVERALL ${synthesis.band} · ${synthesis.bandLabel}` : reading.energy,
      synthesis ? `FOR THIS ACTION ${synthesis.action} · ${synthesis.actionLabel}` : "",
      synthesis ? `AGREEMENT ${synthesis.agreement}` : "",
      "神婆 SAYS",
      reading.says,
      ORACLE_FRAMING,
    ].filter(Boolean).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setError("The reading stayed on this page. Copy is blocked.");
    }
  }

  function addDate(iso: string, label: string) {
    const items = readTodayItems();
    const title = `Oracle · ${label}`;
    if (items.some((item) => item.date === iso && item.title === title)) {
      setAdded(iso);
      return;
    }
    writeTodayItems([
      {
        ...blankItem(iso, "personal"),
        title,
        notes: "A timing note from Oracle. Reflection, not a booking.",
        status: "tentative",
        flexible: true,
      },
      ...items,
    ]);
    setAdded(iso);
  }

  function toggleMethod(method: OracleMethodId) {
    setPicked((current) => (current.includes(method) ? current.filter((item) => item !== method) : [...current, method]));
  }

  const steps = pending
    ? plannedSteps({
        question: pendingMode === "daily" ? "What is the energy of today?" : question,
        mode: pendingMode,
        hint: pendingMode === "compare" ? "compare" : pendingMode === "dates" ? "which day" : hint,
        birthDate,
        include: manual ? picked.filter((id) => selectable.includes(id)) : undefined,
      })
    : [];
  const phase = pending ? "reading" : reading ? "reveal" : "idle";
  const savedThis = Boolean(reading && saved.some((item) => item.id === reading.id));
  const howLead = ORACLE_HOW.slice(0, ORACLE_HOW.lastIndexOf("Different")).trim();
  const howRest = ORACLE_HOW.slice(ORACLE_HOW.lastIndexOf("Different"));

  const form = (
    <div>
      <div className="mt-5">
        <p className="text-xs font-semibold tracking-brand text-sky">READING METHODS</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" aria-pressed={!manual} onClick={() => setManual(false)} className={clsx("press min-h-11 rounded-full px-3 text-sm font-semibold", !manual ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>
            AUTO
          </button>
          <button
            type="button"
            aria-pressed={manual}
            onClick={() => {
              setManual(true);
              setPicked(selectable);
            }}
            className={clsx("press min-h-11 rounded-full px-3 text-sm font-semibold", manual ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}
          >
            Choose
          </button>
        </div>
        <p className="mt-2 text-sm text-mute">{manual ? "Only the methods you tick are used. Anything not connected stays off." : "Kairos will select the methods relevant to your question."}</p>
        <details className="mt-2">
          <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-sky">View methods</summary>
          <ul className="space-y-3 pb-2">
            {catalog.map((item) => (
              <li key={item.method}>
                <label className="flex min-h-11 items-start gap-3">
                  {manual ? (
                    <input
                      type="checkbox"
                      className="mt-1 size-4"
                      disabled={item.status !== "available"}
                      checked={item.status === "available" && picked.includes(item.method)}
                      onChange={() => toggleMethod(item.method)}
                    />
                  ) : null}
                  <span>
                    <span className="text-sm font-semibold text-cream">
                      {item.name}
                      {item.mark ? ` · ${item.mark}` : ""}
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold tracking-brand text-sun">{item.statusLabel}</span>
                    <span className="mt-1 block text-sm text-mute">{item.blurb}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {HINTS.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={hint === item.id && panel === "ask"}
            onClick={() => {
              setPanel("ask");
              setHint(item.id);
            }}
            className={clsx("press min-h-11 rounded-full px-3 text-sm font-semibold", hint === item.id && panel === "ask" ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label className="mt-5 block text-sm font-semibold text-cream" htmlFor="oracle-question">
        What would you like to ask?
      </label>
      <textarea
        id="oracle-question"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        rows={4}
        placeholder="Should I make the move?"
        className="mt-2 w-full resize-none rounded-2xl bg-ink px-4 py-3 text-base text-cream ring-1 ring-line outline-none placeholder:text-mute"
      />
      {parseQuestionContract(question, hint, "ask").needsBirth && !birthDate ? (
        <p className="mt-2 text-sm text-sun">This asks for a longer cycle. Add a date of birth if you want a personal-year window. Oracle will not guess one, and it does not read a saved profile.</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button key={example} type="button" onClick={() => { setPanel("ask"); setQuestion(example); if (/compatib/i.test(example)) setHint("love"); }} className="press min-h-11 rounded-full px-3 text-left text-sm text-mute ring-1 ring-line">
            {example}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => { setPanel("ask"); void ask("ask"); }} disabled={pending} className="press min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink">
          {pending && panel === "ask" ? "Reading…" : "Ask Oracle"}
        </button>
        <button type="button" onClick={() => setPanel("compare")} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", panel === "compare" ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>
          Compare two choices
        </button>
        <button type="button" onClick={() => setPanel("dates")} className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", panel === "dates" ? "bg-accent text-accent-ink" : "text-cream ring-1 ring-line")}>
          Pick a date
        </button>
        <button type="button" onClick={() => void ask("daily")} disabled={pending} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-sky ring-1 ring-sky">
          Daily reading
        </button>
      </div>

      {panel === "compare" ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-cream">
            Option A
            <input value={optionA} onChange={(event) => setOptionA(event.target.value)} className={`${fieldClass} mt-1`} placeholder="Job A" />
          </label>
          <label className="block text-sm text-cream">
            Option B
            <input value={optionB} onChange={(event) => setOptionB(event.target.value)} className={`${fieldClass} mt-1`} placeholder="Job B" />
          </label>
          <button type="button" onClick={() => void ask("compare")} disabled={pending} className="press min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink sm:col-span-2">
            Compare
          </button>
        </div>
      ) : null}

      {panel === "dates" ? (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm text-cream">
            Window, if you do not name dates
            <select value={windowDays} onChange={(event) => setWindowDays(Number(event.target.value))} className={`${fieldClass} mt-1`}>
              <option value={7}>Next 7 days</option>
              <option value={14}>Next 14 days</option>
            </select>
          </label>
          <button type="button" onClick={() => void ask("dates")} disabled={pending} className="press min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink">
            Find dates
          </button>
        </div>
      ) : null}

      <details className="mt-4 rounded-xl bg-panel px-4 py-3 ring-1 ring-line" {...(loveReading ? { open: true } : {})}>
        <summary className="cursor-pointer text-sm font-semibold text-cream">{loveReading ? "Both dates of birth" : "Personal details, optional"}</summary>
        <p className="mt-2 text-sm text-mute">
          {loveReading
            ? "Love compatibility reads two people. Both dates of birth are required. Birth time and place are not used. Shared readings leave birth details out."
            : "Love compatibility needs both dates of birth. A longer when-question can use a date of birth if you type it here. Nothing is taken from a profile. Birth time and place are not used. Shared readings leave birth details out."}
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-cream">Your date of birth{loveReading ? " *" : ""}
            <input type="date" required={loveReading} value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className={`${fieldClass} mt-1`} />
          </label>
          <label className="text-sm text-cream">Their date of birth{loveReading ? " *" : ""}
            <input type="date" required={loveReading} value={birthDateB} onChange={(event) => setBirthDateB(event.target.value)} className={`${fieldClass} mt-1`} />
          </label>
          <label className="text-sm text-cream">Time of birth
            <input type="time" value={birthTime} onChange={(event) => setBirthTime(event.target.value)} className={`${fieldClass} mt-1`} />
          </label>
          <label className="text-sm text-cream">Birth place
            <input value={birthPlace} onChange={(event) => setBirthPlace(event.target.value)} placeholder="Singapore" className={`${fieldClass} mt-1`} />
          </label>
        </div>
      </details>
      {error ? <p className="mt-3 text-sm text-caution">{error}</p> : null}
    </div>
  );

  return (
    <div className="lg:col-span-5">
      <div>
        <h2 className="font-sans text-4xl font-semibold tracking-brand text-cream">ORACLE</h2>
        <p className="mt-1 text-base text-cream">Ask what’s on your mind.</p>
        <p className="text-sm text-mute">Timing, choices, relationships, work — or just curiosity.</p>
      </div>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <CrystalBall phase={phase} steps={steps} reading={reading} question={question} />
        </div>
        <div className="lg:col-span-3">
          {reading ? (
            <div className={clsx(pending && "opacity-60")}>
              <p className="text-xs font-semibold tracking-brand text-sky">QUESTION</p>
              <h3 className="mt-1 font-display text-2xl text-cream">{reading.question}</h3>
              <KairosVoice mode="oracle" label="神婆 SAYS" text={reading.says} status={reading.guard === "harm" || reading.synthesis?.action === "忌" ? "warning" : reading.synthesis?.action === "宜" ? "good" : "neutral"} />
              {reading.answer ? (
                <div className="mt-4 grid gap-3">
                  <p className="text-sm text-cream"><span className="text-xs font-semibold tracking-brand text-sky">TIMING </span>{reading.answer.timing}</p>
                  <p className="text-sm leading-relaxed text-mute"><span className="font-semibold text-cream">Why. </span>{reading.answer.why}</p>
                  <p className="text-sm leading-relaxed text-mute"><span className="font-semibold text-cream">What helps. </span>{reading.answer.helps}</p>
                  <p className="text-sm leading-relaxed text-mute"><span className="font-semibold text-cream">What could delay it. </span>{reading.answer.delays}</p>
                </div>
              ) : null}
              {reading.guard === "harm" ? <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">{reading.expand}</p> : null}
              {reading.cameo ? <p className="mt-2 text-sm text-sun">{reading.cameo}</p> : null}
              {reading.guard === "none" ? (
              <div className="mt-6 grid gap-6">
                <UsedList reading={reading} />
                {reading.methods?.length ? <MethodReport key={reading.id} methods={reading.methods} /> : null}
              </div>
              ) : reading.guard !== "harm" ? (
              <div className="mt-6">
                <UsedList reading={reading} />
              </div>
              ) : null}
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold tracking-brand text-sky">HOW ORACLE WORKS</p>
              <p className="mt-2 text-sm leading-relaxed text-cream">{howLead}</p>
              <p className="mt-1 text-sm text-mute">{howRest}</p>
              <p className="mt-4 text-xs font-semibold tracking-brand text-sky">THE SIGNS</p>
              <p className="mt-2 text-sm text-mute">
                {catalog.filter((item) => item.status === "available").length} methods available. Love compatibility needs both dates of birth. BaZi and astrology are not connected.
              </p>
              {form}
              {!pending ? <KairosVoice mode="oracle" label="神婆 SAYS" text="Questions first. Omens later." /> : null}
            </div>
          )}
        </div>
      </div>

      {reading ? (
        <div className={clsx("mt-8", pending && "opacity-60")}>
          {(reading.signals ?? []).length ? (
            <section className="grid gap-3">
              <p className="text-xs font-semibold tracking-brand text-sky">DETAILED READING</p>
              {(reading.signals ?? []).map((signal, index) => (
                <SignalEssay key={signal.method} signal={signal} open={index === 0} />
              ))}
            </section>
          ) : null}

          {reading.sides.length ? (
            <section className="mt-6">
              <p className="text-xs font-semibold tracking-brand text-sky">THE TWO CHOICES</p>
              <p className="mt-2 text-sm text-mute">{reading.synthesis?.actionLabel || "No winner was assigned."}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {reading.sides.map((side) => (
                  <section key={side.label} className="rounded-xl bg-panel px-4 py-4 ring-1 ring-line">
                    <p className="text-xs font-semibold tracking-brand text-sky">{side.label}</p>
                    <p className="mt-1 text-sm text-mute">{side.tradeoff}</p>
                    <div className="mt-3 grid gap-2">
                      {side.layers.map((layer) => <LayerBlock key={`${side.label}-${layer.name}-${layer.result}`} layer={layer} />)}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ) : null}

          {reading.dates.length ? (
            <section className="mt-6">
              <p className="text-xs font-semibold tracking-brand text-sky">CANDIDATE DATES</p>
              {reading.scanned ? <p className="mt-2 text-sm text-mute">{reading.scanned}</p> : null}
              <ol className="mt-3 space-y-3">
                {reading.dates.map((day) => (
                  <li key={day.date} className="rounded-xl bg-panel px-4 py-4 ring-1 ring-line">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-display text-2xl text-cream">{day.label}</p>
                        <p className="text-sm text-cream">
                          <span className="font-display text-3xl">{day.band}</span>
                          <span className="ml-3 font-display text-2xl text-sun">{day.action}</span>
                        </p>
                        <p className="text-sm text-mute">{day.actionLabel}</p>
                      </div>
                      <button type="button" onClick={() => addDate(day.date, day.label)} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-accent ring-1 ring-accent">
                        {added === day.date ? "Added" : "Add to Today"}
                      </button>
                    </div>
                    <div className="mt-3 grid gap-2">
                      {day.layers.map((layer) => <LayerBlock key={`${day.date}-${layer.id}`} layer={layer} />)}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {reading.synthesis ? (
            <section className="mt-8 max-w-3xl">
              <p className="text-xs font-semibold tracking-brand text-sky">METHOD AGREEMENT</p>
              <p className="mt-1 font-display text-4xl text-cream">{reading.synthesis.agreement}</p>
              <p className="mt-1 text-sm text-mute">
                {reading.synthesis.supportive} supportive · {reading.synthesis.neutral} neutral · {reading.synthesis.cautionary} cautionary
              </p>
              {reading.synthesis.mixed && reading.mode !== "compare" ? <p className="mt-4 font-display text-3xl text-cream">THE SIGNS ARE MIXED</p> : null}
              {(reading.signals ?? []).length ? (
                <ul className="mt-3 space-y-1 text-sm text-cream">
                  {(reading.signals ?? []).map((signal) => (
                    <li key={`agree-${signal.method}`}>
                      {signal.name}: {signal.signal}
                    </li>
                  ))}
                </ul>
              ) : null}
              {reading.synthesis.conflict ? <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">{reading.synthesis.conflict}</p> : null}

              <div className="mt-6">
                <p className="text-xs font-semibold tracking-brand text-sky">WHAT THIS MEANS</p>
                <p className="mt-3 text-sm font-semibold text-cream">Good for</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-cream">
                  {reading.synthesis.goodFor.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p className="mt-3 text-sm font-semibold text-cream">Less suitable for</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-cream">
                  {reading.synthesis.lessFor.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p className="mt-3 text-sm text-mute">{reading.synthesis.note}</p>
              </div>
            </section>
          ) : null}

          <button type="button" onClick={() => setWhy((open) => !open)} className="press mt-6 min-h-11 text-sm font-semibold text-sky">
            {why ? "Hide the longer note" : "Why?"}
          </button>
          {why ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-mute">{reading.expand}</p> : null}
          {reading.attention.length ? (
            <div className="mt-4">
              <p className="text-xs font-semibold tracking-brand text-sky">PAY ATTENTION TO</p>
              <ul className="mt-2 space-y-1 text-sm text-cream">
                {reading.attention.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}
          <p className="mt-4 text-sm text-sun">{ORACLE_FRAMING}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {reading.layers.some((layer) => layer.id === "tarot" || layer.id === "iching") || reading.sides.some((side) => side.layers.some((layer) => layer.id === "tarot")) ? (
              <button type="button" disabled={pending} onClick={() => void ask(reading.mode === "daily" ? "daily" : reading.mode === "dates" ? "dates" : reading.mode === "compare" ? "compare" : "ask", true)} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line disabled:opacity-50">
                Draw again
              </button>
            ) : null}
            {reading.guard === "none" ? (
              <button type="button" onClick={saveReading} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
                {savedThis ? "Saved" : "Save reading"}
              </button>
            ) : null}
            <button type="button" onClick={() => void shareReading()} className="press min-h-11 rounded-xl px-3 text-sm font-semibold text-cream ring-1 ring-line">
              {copied ? "Copied" : "Share reading"}
            </button>
          </div>
          <p className="mt-2 text-xs text-mute">Refresh keeps this draw. Draw again, or a new question, is the only thing that changes it.</p>

          <details className="mt-8 max-w-xl rounded-xl bg-panel px-4 py-3 ring-1 ring-line">
            <summary className="cursor-pointer text-sm font-semibold text-cream">Ask another question</summary>
            {form}
          </details>

          {saved.length ? (
            <div className="mt-8">
              <p className="text-xs font-semibold tracking-brand text-sky">MY READINGS</p>
              <ul className="mt-2 space-y-2">
                {saved.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => { setReading(item.reading); setQuestion(item.question); }} className="press flex min-h-11 w-full items-center justify-between gap-3 rounded-xl bg-panel px-3 text-left ring-1 ring-line">
                      <span className="truncate text-sm text-cream">{item.question}</span>
                      <span className="shrink-0 text-xs text-mute">{item.energy}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
