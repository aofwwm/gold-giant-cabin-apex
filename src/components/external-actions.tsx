import { AFFILIATE_DISCLOSURE, RATE_NOTE, recordAffiliateClick, type AffiliateCategory } from "@/lib/affiliate";
import { placeActions, type ActionInput, type ExternalAction, type ExternalActionType } from "@/lib/external-actions";
import { liveHotelRates } from "@/lib/hotel-rates";
import { detectPlatform } from "@/lib/travel-routing";

const CATEGORY: Partial<Record<ExternalActionType, AffiliateCategory>> = {
  BOOK_HOTEL: "HOTEL",
  BUY_TICKET: "ATTRACTION",
  BOOK_ACTIVITY: "ACTIVITY",
  RESERVE_RESTAURANT: "RESTAURANT",
  ORDER_FOOD: "FOOD_DELIVERY",
  REQUEST_QUOTE: "TEAM_ACTIVITY",
  BOOK_TRANSPORT: "TRANSPORT",
  BUY_ESIM: "ESIM",
  RENT_CAR: "CAR_RENTAL",
};

/** Opens the specialist app or a new browser tab. Never an embedded page. */
export function ExternalActions({ input, heading = "ELSEWHERE", notes = true }: { input: ActionInput; heading?: string; notes?: boolean }) {
  const actions = placeActions(input, detectPlatform());
  if (!actions.length) return null;
  const hotels = actions.filter((action) => action.type === "BOOK_HOTEL");
  const rest = actions.filter((action) => action.type !== "BOOK_HOTEL");
  const affiliate = actions.some((action) => action.source === "affiliate");
  const notesList = [...new Set(rest.map((action) => action.disclosure).filter((line): line is string => Boolean(line) && line !== AFFILIATE_DISCLOSURE && line !== RATE_NOTE))];
  const live = Boolean(liveHotelRates());
  return (
    <div className="mt-3">
      {hotels.length ? (
        <div>
          <p className="text-xs font-semibold tracking-brand text-accent">{live ? "COMPARE LIVE PRICES" : "CHECK HOTELS"}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {hotels.map((action) => (
              <RateLink key={action.id} action={action} mode={input.mode} live={live} />
            ))}
          </div>
          {notes ? <p className="mt-2 text-xs text-mute">{RATE_NOTE}</p> : null}
        </div>
      ) : null}
      {rest.length ? (
        <div className={hotels.length ? "mt-4" : ""}>
          <p className="text-xs font-semibold tracking-brand text-accent">{heading}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {rest.map((action) => (
              <ActionLink key={action.id} action={action} mode={input.mode} />
            ))}
          </div>
        </div>
      ) : null}
      {notes ? notesList.map((note) => (
        <p key={note} className="mt-2 text-xs text-mute">{note}</p>
      )) : null}
      {notes && affiliate ? <p className="mt-2 text-xs text-mute">{AFFILIATE_DISCLOSURE}</p> : null}
    </div>
  );
}

function RateLink({ action, mode, live }: { action: ExternalAction; mode: ActionInput["mode"]; live: boolean }) {
  const name = action.label.replace(/^Check /, "");
  return (
    <a href={action.url} target="_blank" rel="noreferrer" aria-label={action.label} onClick={() => track(action, mode)} className="press min-w-28 rounded-xl px-3 py-2 ring-1 ring-line">
      <span className="block text-xs text-mute">{name}</span>
      <span className="mt-1 block text-sm text-cream">{live ? "Check live price" : "Open"}</span>
    </a>
  );
}

function ActionLink({ action, mode }: { action: ExternalAction; mode: ActionInput["mode"] }) {
  return (
    <a href={action.url} target="_blank" rel="noreferrer" onClick={() => track(action, mode)} className="press inline-flex min-h-11 items-center rounded-xl px-3 text-sm text-cream ring-1 ring-line">
      {action.label}
    </a>
  );
}

function track(action: ExternalAction, mode: ActionInput["mode"]): void {
  const category = CATEGORY[action.type];
  if (!category) return;
  recordAffiliateClick(action, mode, category);
}
