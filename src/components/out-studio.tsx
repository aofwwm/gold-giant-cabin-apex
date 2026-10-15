import { clsx } from "clsx";
import { Dices } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { findOuting } from "@/lib/coord.functions";
import { KairosVoice } from "@/components/kairos-voice";
import { PlanningBrief } from "@/components/planning-brief";
import { parsePlanBrief } from "@/lib/planning.functions";
import { teamChips, type TeamOutIntent } from "@/lib/planning-brief";
import { buildConcepts, originFromArea, parseOuting, type Concept, type OutingBrief } from "@/lib/coord";
import { AREAS } from "@/lib/directory";
import { createEvent } from "@/lib/kairos.functions";
import { readOffice, writeOffice, type SavedOffice } from "@/lib/office";
import { suggestMeetingSlots } from "@/lib/time";
import { ExternalActions } from "@/components/external-actions";

const ENERGY = [
  { id: "low", label: "Chill" },
  { id: "moderate", label: "Moderate" },
  { id: "high", label: "Active" },
] as const;

const SETTINGS = [
  { id: "indoor", label: "Indoor" },
  { id: "outdoor", label: "Outdoor" },
  { id: "either", label: "Either" },
] as const;

const WINDOWS = ["Friday afternoon", "After work", "Morning", "This week"] as const;

const SPEND = [
  { id: "under10" as const, label: "<$10", budget: 9, budgetMin: 0 },
  { id: "mid" as const, label: "$10–$20", budget: 20, budgetMin: 10 },
  { id: "any" as const, label: "Any", budget: 200, budgetMin: 0 },
];

export function OutStudio() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [where, setWhere] = useState<"office" | "area" | "anywhere">("office");
  const [areaId, setAreaId] = useState("");
  const [groupSize, setGroupSize] = useState(20);
  const [spend, setSpend] = useState<(typeof SPEND)[number]["id"]>("any");
  const [groupTouched, setGroupTouched] = useState(false);
  const [energy, setEnergy] = useState<OutingBrief["energy"] | "">("");
  const [setting, setSetting] = useState<(typeof SETTINGS)[number]["id"] | "">("");
  const [when, setWhen] = useState("");
  const [editing, setEditing] = useState(false);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [origin, setOrigin] = useState("");
  const [pending, setPending] = useState(false);
  const [polling, setPolling] = useState("");
  const [error, setError] = useState("");
  const [source, setSource] = useState<"rules" | "grok" | "">("");
  const [roll, setRoll] = useState(0);
  const [rolled, setRolled] = useState<{ origin: { lat: number; lng: number } | null; brief: OutingBrief } | null>(null);
  const [office, setOffice] = useState<SavedOffice | null>(null);
  const [officeName, setOfficeName] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [readingBrief, setReadingBrief] = useState(false);
  const [briefFailed, setBriefFailed] = useState(false);
  const [teamIntent, setTeamIntent] = useState<TeamOutIntent | null>(null);
  const [hiddenBrief, setHiddenBrief] = useState<string[]>([]);
  const [briefLocks, setBriefLocks] = useState<Record<string, boolean>>({});
  const [budgetEach, setBudgetEach] = useState<number | null>(null);
  const [briefConflicts, setBriefConflicts] = useState<{ key: string; suggested: string; current: string }[]>([]);

  useEffect(() => {
    const saved = readOffice();
    if (!saved) return;
    setOffice(saved);
    setOfficeName(saved.name);
    setOfficeAddress(saved.address);
    if (saved.areaId) setAreaId(saved.areaId);
  }, []);

  const live = useMemo(() => parseOuting(text), [text]);

  function lockBrief(key: string) {
    setBriefLocks((current) => ({ ...current, [key]: true }));
  }

  function applyTeam(parsed: TeamOutIntent, locks = briefLocks) {
    setTeamIntent(parsed);
    const conflicts: { key: string; suggested: string; current: string }[] = [];
    if (parsed.groupSize) {
      if ((locks.group || groupTouched) && parsed.groupSize !== groupSize) conflicts.push({ key: "group", suggested: `${parsed.groupSize} people`, current: `${groupSize} people` });
      else if (!locks.group && !groupTouched) setGroupSize(parsed.groupSize);
    }
    if (parsed.whenLabel) {
      if (locks.when && parsed.whenLabel !== when) conflicts.push({ key: "when", suggested: parsed.whenLabel, current: when || "unset" });
      else if (!locks.when) setWhen(parsed.whenLabel);
    }
    if (parsed.budgetPerPerson) {
      if (locks.budget && parsed.budgetPerPerson !== budgetEach) conflicts.push({ key: "budget", suggested: `≤ $${parsed.budgetPerPerson}`, current: budgetEach ? `≤ $${budgetEach}` : spend });
      else if (!locks.budget) setBudgetEach(parsed.budgetPerPerson);
    }
    if (parsed.intensity === "low") {
      if (locks.energy && energy !== "low") conflicts.push({ key: "energy", suggested: "Not too physical", current: energy || "unset" });
      else if (!locks.energy) setEnergy("low");
    }
    if (parsed.areaId) {
      if (!locks.area) {
        setWhere("area");
        setAreaId(parsed.areaId);
      }
    }
    setBriefConflicts(conflicts);
  }

  function understandTeam() {
    const query = text.trim();
    if (query.length < 8) return;
    setReadingBrief(true);
    setBriefFailed(false);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    void parsePlanBrief({ data: { mode: "team_out", text: query, today } })
      .then((result) => {
        if (result.mode !== "team_out") return;
        const parsed = result.intent;
        if (!parsed.groupSize && !parsed.whenLabel && !parsed.budgetPerPerson && !parsed.areaIntent) {
          setBriefFailed(true);
          return;
        }
        applyTeam(parsed);
      })
      .catch(() => setBriefFailed(true))
      .finally(() => setReadingBrief(false));
  }

  const shownEnergy = energy || (text.trim().length > 8 ? live.energy : "moderate");
  const shownWhen = when || live.when;
  const spendChoice = SPEND.find((item) => item.id === spend) ?? SPEND[2];
  const areaLabel = AREAS.find((area) => area.id === areaId)?.label || (where === "anywhere" ? "Anywhere" : office?.name || "Near the office");
  const looking = lookingFor(live, setting, shownEnergy);

  async function onShape() {
    const line = text.trim();
    if (line.length < 8) {
      setError("Say who, roughly when, and what you do not want.");
      return;
    }
    setError("");
    const extra = [
      shownWhen,
      setting === "indoor" ? "indoor" : setting === "outdoor" ? "outdoor" : "",
      shownEnergy === "low" ? "chill" : shownEnergy === "high" ? "active" : "moderate energy",
    ]
      .filter(Boolean)
      .join(", ");
    const packed = extra ? `${line}. ${extra}` : line;
    const localOrigin = where === "anywhere" ? null : originFromArea(where === "office" ? office?.areaId || areaId : areaId, `${packed} ${office?.address ?? ""}`);
    const localBrief = {
      ...parseOuting(packed),
      areaId: where === "anywhere" ? "" : office?.areaId || areaId,
      groupSize,
      budget: budgetEach ?? spendChoice.budget,
      budgetMin: budgetEach ? 0 : spendChoice.budgetMin,
    };
    setConcepts(buildConcepts(localOrigin, localBrief));
    setOrigin(localOrigin?.label || areaLabel);
    setRoll(0);
    setRolled({ origin: localOrigin, brief: localBrief });
    setPending(true);
    try {
      const result = await findOuting({
        data: {
          text: packed,
          areaId: where === "anywhere" ? "" : office?.areaId || areaId,
          groupSize,
          budget: budgetEach ?? spendChoice.budget,
          budgetMin: budgetEach ? 0 : spendChoice.budgetMin,
        },
      });
      setConcepts(result.concepts);
      setOrigin(result.originLabel);
      setSource(result.source);
      setRoll(0);
      setRolled({ origin: localOrigin, brief: result.brief });
      if (result.concepts.length === 0) setError("Nothing real fit that brief. Widen the area or the budget.");
    } catch (err) {
      if (concepts.length === 0) setError(err instanceof Error ? err.message : "The brief did not land");
    } finally {
      setPending(false);
    }
  }

  function onReroll() {
    if (!rolled) return;
    const nextRoll = roll + 1;
    const next = buildConcepts(rolled.origin, rolled.brief, nextRoll);
    const same = next.map((concept) => concept.title).join("|") === concepts.map((concept) => concept.title).join("|");
    if (!next.length || same) {
      setError("That's the full list for this brief.");
      return;
    }
    setError("");
    setRoll(nextRoll);
    setConcepts(next);
    setSource("rules");
  }

  async function onPoll(concept: Concept) {
    setPolling(concept.id);
    try {
      const stop = concept.stops[0];
      const created = await createEvent({
        data: {
          title: concept.title.slice(0, 80),
          kind: "meeting",
          durationMin: concept.hours >= 2 ? 120 : 90,
          category: "",
          slots: suggestMeetingSlots().slice(0, 3).map((startsAt) => ({ startsAt, label: stop?.name ?? "" })),
          place: {
            format: "physical",
            venueName: stop?.name ?? "",
            room: "",
            address: stop?.address ?? "",
            platform: "",
            meetingUrl: "",
            makanWhen: concept.stops.length > 1 ? "after" : "",
          },
        },
      });
      toast.success("Poll is open");
      await navigate({ to: "/meet/$code", params: { code: created.code } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open the poll");
      setPolling("");
    }
  }

  const understood = text.trim().length > 8;

  return (
    <>
      <form
        className="lg:col-span-2"
        onSubmit={(event) => {
          event.preventDefault();
          void onShape();
        }}
      >
        <PlanningBrief
          mode="team_out"
          kicker="TEAM OUT"
          question="What kind of team outing are we planning?"
          hint="Tell Kairos the group, budget, timing and what kind of experience you want."
          placeholder="About 20 people next Friday afternoon. $50 each, something interactive, preferably central, and please not another dinner."
          value={text}
          onChange={setText}
          onUnderstand={understandTeam}
          reading={readingBrief}
          failed={briefFailed}
          chips={teamIntent ? teamChips(teamIntent).filter((chip) => !hiddenBrief.includes(chip.id)) : []}
          onRemove={(chip) => { lockBrief(chip.lock); setHiddenBrief((current) => [...current, chip.id]); }}
          aside={teamIntent?.aside ?? ""}
          conflicts={briefConflicts}
          onKeep={(key) => setBriefConflicts((items) => items.filter((item) => item.key !== key))}
          onUse={(key) => {
            const next = { ...briefLocks, [key]: false };
            setBriefLocks(next);
            if (key === "group") setGroupTouched(false);
            if (teamIntent) applyTeam(teamIntent, key === "group" ? next : { ...next, group: groupTouched });
          }}
        />
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-cream">Location</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    ["office", "Near office"],
                    ["area", "Choose area"],
                    ["anywhere", "Anywhere"],
                  ] as const
                ).map(([id, label]) => (
                  <Chip key={id} on={where === id} onClick={() => { lockBrief("area"); setWhere(id); }}>
                    {label}
                  </Chip>
                ))}
              </div>
              {where === "area" ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {AREAS.map((area) => (
                    <Chip key={area.id} on={areaId === area.id} onClick={() => setAreaId(area.id === areaId ? "" : area.id)}>
                      {area.label}
                    </Chip>
                  ))}
                </div>
              ) : where === "office" ? (
                <div className="mt-2 rounded-xl bg-ink px-3 py-3 ring-1 ring-line">
                  <p className="text-sm text-mute">
                    {office ? `Using ${office.name}. Saved on this browser.` : "No office saved yet. Add it once, then Near office has a place."}
                  </p>
                  <input
                    value={officeName}
                    onChange={(input) => setOfficeName(input.target.value)}
                    placeholder="Office name"
                    maxLength={80}
                    className="mt-2 h-12 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
                  />
                  <input
                    value={officeAddress}
                    onChange={(input) => setOfficeAddress(input.target.value)}
                    placeholder="Street or building"
                    maxLength={160}
                    className="mt-2 h-12 w-full rounded-xl bg-panel px-3 text-cream ring-1 ring-line"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {AREAS.map((area) => (
                      <Chip key={area.id} on={areaId === area.id} onClick={() => setAreaId(area.id)}>
                        {area.label}
                      </Chip>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const name = officeName.trim() || officeAddress.trim();
                      if (name.length < 3) {
                        setError("Type the office building or street, then save it.");
                        return;
                      }
                      const saved = { name: name.slice(0, 80), address: (officeAddress.trim() || name).slice(0, 160), areaId };
                      writeOffice(saved);
                      setOffice(saved);
                      setError("");
                      toast.success("Office saved on this browser");
                    }}
                    className="press mt-2 min-h-11 rounded-xl bg-gold px-3 text-sm font-semibold text-ink"
                  >
                    {office ? "Update office" : "Save office"}
                  </button>
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="text-sm text-cream">
                Group size
                <input
                  type="number"
                  min={2}
                  max={80}
                  value={groupSize}
                  onChange={(input) => {
                    lockBrief("group");
                    setGroupTouched(true);
                    setGroupSize(Math.max(2, Math.min(80, Number(input.target.value) || 2)));
                  }}
                  className="mt-1 block h-12 w-24 rounded-xl bg-ink px-3 text-cream ring-1 ring-line"
                />
              </label>
              <label className="text-sm text-cream">
                Budget / pax
                <div className="mt-1 flex flex-wrap gap-2">
                  {budgetEach ? <Chip on onClick={() => { lockBrief("budget"); setBudgetEach(null); }}>{`≤ $${budgetEach}`}</Chip> : null}
                  {SPEND.map((item) => (
                    <Chip key={item.id} on={!budgetEach && spend === item.id} onClick={() => { lockBrief("budget"); setBudgetEach(null); setSpend(item.id); }}>
                      {item.label}
                    </Chip>
                  ))}
                </div>
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-cream">Time window</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {WINDOWS.map((item) => (
                  <Chip key={item} on={when === item} onClick={() => { lockBrief("when"); setWhen(when === item ? "" : item); }}>
                    {item}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-cream">Energy</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ENERGY.map((item) => (
                  <Chip key={item.id} on={shownEnergy === item.id} onClick={() => { lockBrief("energy"); setEnergy(item.id); }}>
                    {item.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-cream">Indoor / outdoor</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SETTINGS.map((item) => (
                  <Chip key={item.id} on={setting === item.id} onClick={() => setSetting(item.id)}>
                    {item.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

        {error ? (
          <p role="alert" className="mt-4 text-sm text-vermilion">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="press mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-vermilion text-base font-semibold text-cream disabled:opacity-50"
        >
          {pending ? "Reading the brief…" : "Find something worth doing"}
        </button>
      </form>

      <aside className="lg:col-span-3">
        <section id="kairos-result" className="rounded-2xl bg-panel p-5 shadow-card sm:p-7">
          <p className="text-xs font-semibold tracking-brand text-gold">PEOPLE + PLACE + VIBE</p>
          <h2 className="mt-2 max-w-xl font-sans text-3xl font-semibold leading-tight text-cream sm:text-4xl">
            Find something the department will actually want to turn up for.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Factor kicker="GROUP FIT" tone="jade" value={`${groupSize} pax`} note={areaLabel} />
            <Factor kicker="PRACTICAL FIT" tone="cream" value={budgetEach ? `≤ $${budgetEach}` : spendChoice.label === "Any" ? "Any" : spendChoice.label} note={teamIntent?.hours ? `${teamIntent.hours} hrs` : live.hours ? `${live.hours} hrs` : "A few hours"} />
            <Factor
              kicker="VIBE FIT"
              tone="gold"
              value={ENERGY.find((item) => item.id === shownEnergy)?.label ?? "Moderate"}
              note={setting === "either" || !setting ? "Indoor or outdoor" : setting === "indoor" ? "Indoor" : "Outdoor"}
            />
          </div>

          {concepts.length === 0 ? (
            <div className="mt-8 rounded-xl bg-ink px-4 py-4">
              <p className="text-xs font-semibold tracking-brand text-cream">KAIROS IS LOOKING FOR</p>
              <ul className="mt-3 space-y-1 text-sm text-cream">
                {looking.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-mute">Real places only. Nothing here is booked, and prices are typical, not a quote.</p>
            </div>
          ) : (
            <>
              <KairosVoice
                mode="out"
                text={roll > 0 ? "Okay. Another set. Still real places, still nobody in matching shirts." : "Something social, not too corporate, and nobody has to wear matching T-shirts."}
              />
              <ol className="mt-4 space-y-3">
              {concepts.map((concept, index) => (
                <li key={concept.id} className="rounded-xl bg-ink px-4 py-4">
                  <p className="text-xs font-semibold tracking-brand text-gold">
                    {String(index + 1).padStart(2, "0")} · {concept.personality.toUpperCase()}
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-cream">{concept.title}</h3>
                  <p className="mt-2 text-sm text-mute">
                    {concept.hours} hrs · ~${concept.approxSgd}/pax · {concept.pax} pax
                    {origin ? ` · ${origin}` : ""}
                  </p>
                  <p className="mt-2 text-sm text-cream">{concept.why}</p>
                  <ul className="mt-3 space-y-2">
                    {concept.stops.map((stop) => (
                      <li key={stop.id}>
                        <p className="text-sm text-mute">{stop.name}</p>
                        <ExternalActions
                          heading="VENUE"
                          input={{
                            mode: "out",
                            kind: "venue",
                            countryCode: "SG",
                            from: rolled?.origin ? { lat: rolled.origin.lat, lng: rolled.origin.lng, name: origin || "Start" } : undefined,
                            place: { id: stop.id, name: stop.name, address: stop.address, city: "Singapore", countryCode: "SG", lat: stop.lat, lng: stop.lng },
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={polling === concept.id}
                    onClick={() => void onPoll(concept)}
                    className="press mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-vermilion font-semibold text-cream disabled:opacity-50"
                  >
                    {polling === concept.id ? "Opening the poll…" : "Need a date? Create a Kairos poll"}
                  </button>
                </li>
              ))}
              <button
                type="button"
                onClick={onReroll}
                className="press inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold"
              >
                <Dices className="size-4" aria-hidden />
                Re-roll options
              </button>
              <p className="text-xs text-mute">
                Real places only{source === "grok" ? ". Kairos phrased the fit." : ". Rules picked the fit."}
              </p>
            </ol>
            </>
          )}
        </section>
      </aside>
    </>
  );
}

function lookingFor(brief: OutingBrief, setting: string, energy: string): string[] {
  const lines = ["Creative workshop", "Light competitive activity", "Social outdoor option"];
  if (brief.styles.includes("creative") || brief.avoid.includes("corporate")) lines[0] = "Something memorable, not a town hall";
  if (energy === "low" || brief.styles.includes("chill")) lines[2] = "Easy conversation, low planning";
  if (energy === "high" || brief.styles.includes("competitive")) lines[1] = "Light competitive activity";
  if (setting === "indoor") lines[2] = "Indoor, rain does not cancel it";
  if (brief.avoid.includes("dinner-only")) lines.push("Not dinner-only");
  return lines.slice(0, 3);
}

function Factor({ kicker, value, note, tone }: { kicker: string; value: string; note: string; tone: "jade" | "cream" | "gold" }) {
  return (
    <div className={clsx("border-l-2 pl-3", tone === "jade" ? "border-jade" : tone === "gold" ? "border-gold" : "border-cream")}>
      <p className={clsx("text-xs font-semibold tracking-brand", tone === "jade" ? "text-jade" : tone === "gold" ? "text-gold" : "text-cream")}>{kicker}</p>
      <p className="mt-1 text-lg font-semibold text-cream">{value}</p>
      <p className="text-sm text-mute">{note}</p>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={clsx("press min-h-11 rounded-xl px-3 text-sm font-semibold", on ? "bg-gold text-ink" : "bg-panel text-cream ring-1 ring-line")}
    >
      {children}
    </button>
  );
}

function Tag({ children }: { children: string }) {
  return <span className="rounded-full bg-ink px-3 py-1 text-sm text-cream ring-1 ring-line">{children}</span>;
}
