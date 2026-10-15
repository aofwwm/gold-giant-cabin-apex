import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { KAIROS_LIFE, KAIROS_TODAY, KAIROS_WORK, type KairosMode } from "@/lib/kairos-modes";

export type { KairosMode };

const LIFE_ON: Record<string, string> = {
  family: "bg-[#6fafa6] text-[#120e0c]",
  dating: "bg-[#c4899a] text-[#1a1214]",
  travel: "bg-[#d7b07a] text-[#1a1410]",
  oracle: "bg-[#7157a6] text-[#f4eadc]",
};

export function KairosNav({ active, code = "" }: { active: KairosMode; code?: string }) {
  const searchFor = (mode: KairosMode) => ({
    mode,
    code: mode === "makan" || (mode === "hash" && active === "hash") ? code : "",
  });
  return (
    <nav aria-label="Kairos mode" className="space-y-4">
      <Link
        to="/"
        search={searchFor("today")}
        aria-current={active === "today" ? "page" : undefined}
        className={clsx(
          "press flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl px-4 py-3",
          active === "today" ? "bg-[#6F7FD8] text-[#f4eadc]" : "bg-[#1c1830] text-[#f4eadc] ring-1 ring-[#6F7FD8]/45",
        )}
      >
        <span>
          <span className="block text-[11px] font-semibold tracking-brand" style={{ color: active === "today" ? "#dbe3ff" : "#9AA8FF" }}>COMMAND CENTRE</span>
          <span className="mt-1 block text-xl font-semibold leading-none">{KAIROS_TODAY.label}</span>
        </span>
        <span className="text-sm" style={{ color: active === "today" ? "#eef1ff" : "#9AA8FF" }}>Your day</span>
      </Link>
      <div className="grid gap-4 lg:grid-cols-2">
        <section>
          <h2 className="text-[11px] font-semibold tracking-brand text-mute">WORK</h2>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {KAIROS_WORK.map((link) => {
              const on = active === link.mode;
              return (
                <Link
                  key={link.mode}
                  to="/"
                  search={searchFor(link.mode)}
                  aria-current={on ? "page" : undefined}
                  className={clsx(
                    "press inline-flex min-h-12 items-center justify-center rounded-xl px-2 text-center text-sm font-semibold leading-tight whitespace-nowrap",
                    on ? "bg-vermilion text-cream ring-1 ring-gold" : "bg-[#1a1410] text-[#f4eadc] ring-1 ring-[#8a5a3a]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </section>
        <section>
          <h2 className="text-[11px] font-semibold tracking-brand text-mute">LIFE</h2>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {KAIROS_LIFE.map((link) => {
              const on = active === link.mode;
              return (
                <Link
                  key={link.mode}
                  to="/"
                  search={searchFor(link.mode)}
                  aria-current={on ? "page" : undefined}
                  className={clsx(
                    "press inline-flex min-h-12 items-center justify-center rounded-xl px-2 text-center text-sm font-semibold leading-tight whitespace-nowrap",
                    on ? LIFE_ON[link.mode] : "bg-panel text-mute ring-1 ring-line",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </nav>
  );
}
