import { useEffect, useState } from "react";
import { affiliateClicks } from "@/lib/affiliate";
import { readCostDiagnostics } from "@/lib/diagnostics.functions";
import { guardrailLabel } from "@/lib/provider-cost";
import type { GuardrailClass } from "@/lib/provider-registry";

type Report = Awaited<ReturnType<typeof readCostDiagnostics>>;

export function CostPanel() {
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  if (!import.meta.env.DEV) return null;
  return <CostDrawer open={open} report={report} onOpen={setOpen} onReport={setReport} />;
}

function hitPercent(hits: number, misses: number): string {
  const looked = hits + misses;
  if (!looked) return "–";
  return `${Math.round((hits / looked) * 100)}%`;
}

function CostDrawer({
  open,
  report,
  onOpen,
  onReport,
}: {
  open: boolean;
  report: Report | null;
  onOpen: (open: boolean) => void;
  onReport: (report: Report) => void;
}) {
  useEffect(() => {
    if (!open) return;
    let live = true;
    void readCostDiagnostics({ data: {} })
      .then((value) => {
        if (live) onReport(value);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [open, onReport]);

  const usage = report && report.enabled ? report.usage : null;
  const clicks = affiliateClicks().length;
  const cards = report && report.enabled ? report.providers.filter((row) => row.requiresCreditCard) : [];
  return (
    <div className="fixed bottom-3 left-3 z-20 max-w-sm">
      <button type="button" onClick={() => onOpen(!open)} className="press min-h-11 rounded-xl bg-panel px-3 text-xs font-semibold text-mute ring-1 ring-line">
        {open ? "Hide cost" : "Dev cost"}
      </button>
      {open ? (
        <div className="mt-2 max-h-[50vh] overflow-y-auto rounded-xl bg-panel p-3 text-xs text-mute ring-1 ring-line">
          <p className="text-cream">This server process only. Not a bill. No keys are shown.</p>
          {!report ? <p className="mt-2">Reading counters…</p> : null}
          {report && !report.enabled ? <p className="mt-2">Diagnostics are off in production.</p> : null}
          {usage && report && report.enabled ? (
            <>
              <p className="mt-2">Model {report.model.activeModel} · {report.model.selection}{report.model.lastServed ? ` · last served ${report.model.lastServed}` : ""}</p>
              <p className="mt-1">Session since {usage.since.slice(0, 16).replace("T", " ")} · today {usage.day}</p>
              <table className="mt-2 w-full text-left">
                <thead>
                  <tr>
                    <th className="py-1 font-semibold text-cream"> </th>
                    <th className="py-1 font-semibold text-cream">Calls</th>
                    <th className="py-1 font-semibold text-cream">Hit</th>
                    <th className="py-1 font-semibold text-cream">Failed</th>
                  </tr>
                </thead>
                <tbody>
                  {(["gemini", "discovery", "geocode", "routing", "weather", "photo"] as const).map((channel) => {
                    const session = usage.session[channel];
                    return (
                      <tr key={channel}>
                        <td className="py-1 capitalize text-cream">{channel === "photo" ? "Images" : channel === "geocode" ? "Geocoder" : channel}</td>
                        <td className="py-1">{session.calls}</td>
                        <td className="py-1">{hitPercent(session.hits, session.misses)}</td>
                        <td className="py-1">{session.failures}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-2">Affiliate clicks this browser: {clicks}</p>
              {cards.length ? (
                <p className="mt-2">{cards.some((row) => row.enabled) ? "Credit-card provider is ON." : "Credit-card providers are off."} {cards.map((row) => row.id).join(", ")}</p>
              ) : null}
              {usage.recentFailures.length ? (
                <ul className="mt-2 space-y-1">
                  {usage.recentFailures.map((item, index) => (
                    <li key={`${item.provider}-${index}`}>{item.channel} · {item.provider} · {item.message}</li>
                  ))}
                </ul>
              ) : null}
              <ul className="mt-3 space-y-1">
                {report.providers.map((row) => (
                  <li key={row.id}>{row.id} · {guardrailLabel(row.costClass as GuardrailClass)} · {row.enabled ? "on" : "off"}{row.requiresCreditCard ? " · card" : ""}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
