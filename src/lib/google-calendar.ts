/**
 * Google Calendar event template. This opens a prefilled page.
 * It does not sign in, read a calendar, or save an event.
 * A later "connect calendar" flow can sit beside this, not inside it.
 */

export type GoogleCalendarEvent = {
  title: string;
  startTime: string;
  durationMinutes: number;
  timezone?: string;
  meetingFormat?: "physical" | "online" | "hybrid" | "";
  venueName?: string;
  room?: string;
  address?: string;
  onlinePlatform?: string;
  onlineUrl?: string;
  kairosScore?: number | null;
  kairosStatus?: string;
  participantCount?: number;
  canAttend?: number;
  preferredCount?: number;
  purpose?: string;
  makanLabel?: string;
  makanName?: string;
  makanTime?: string;
};

const DEFAULT_TIMEZONE = "Asia/Singapore";

function clean(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function joinParts(parts: Array<string | undefined>): string {
  return parts.map((part) => clean(part)).filter(Boolean).join(", ");
}

/** Wall-clock digits in `timeZone`, not UTC. Google reads these with `ctz`. */
export function formatGoogleDate(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const read = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "00";
  const hour = read("hour") === "24" ? "00" : read("hour");
  return `${read("year")}${read("month")}${read("day")}T${hour}${read("minute")}${read("second")}`;
}

function physicalLocation(event: GoogleCalendarEvent): string {
  return joinParts([event.venueName, event.room, event.address]);
}

function locationFor(event: GoogleCalendarEvent): string {
  const format = event.meetingFormat || "physical";
  const physical = physicalLocation(event);
  const platform = clean(event.onlinePlatform);
  if (format === "online") return platform || physical;
  return physical;
}

function descriptionFor(event: GoogleCalendarEvent): string {
  const lines = ["Decided with Kairos 良辰吉日 AI"];
  if (typeof event.kairosScore === "number" && Number.isFinite(event.kairosScore)) {
    const mark = clean(event.kairosStatus);
    lines.push(`Kairos Score: ${event.kairosScore}/100${mark ? ` · ${mark}` : ""}`);
  }
  const roster = event.participantCount;
  if (typeof roster === "number" && roster > 0 && typeof event.canAttend === "number") {
    lines.push(`${event.canAttend}/${roster} participants can attend.`);
  }
  if (typeof roster === "number" && roster > 0 && typeof event.preferredCount === "number") {
    lines.push(`${event.preferredCount}/${roster} marked this as their preferred timing.`);
  }
  const purpose = clean(event.purpose);
  if (purpose) {
    lines.push("");
    lines.push("Purpose:");
    lines.push(purpose);
  }
  const url = clean(event.onlineUrl);
  const platform = clean(event.onlinePlatform);
  if (url && (event.meetingFormat === "online" || event.meetingFormat === "hybrid")) {
    lines.push("");
    lines.push(event.meetingFormat === "hybrid" ? "Join online:" : "Online meeting:");
    if (platform) lines.push(platform);
    lines.push(url);
  }
  const makanName = clean(event.makanName);
  if (makanName) {
    lines.push("");
    lines.push(`${clean(event.makanLabel) || "Makan"}:`);
    lines.push(makanName);
    const makanTime = clean(event.makanTime);
    if (makanTime) lines.push(makanTime);
  }
  lines.push("");
  lines.push("The cosmos gets a vote. Humans still decide.");
  return lines.join("\n");
}

export function createGoogleCalendarUrl(event: GoogleCalendarEvent): string {
  const timeZone = clean(event.timezone) || DEFAULT_TIMEZONE;
  const start = new Date(event.startTime);
  if (Number.isNaN(start.getTime())) throw new Error("That start time cannot be calendared");
  const minutes = Number.isFinite(event.durationMinutes) ? Math.max(1, Math.round(event.durationMinutes)) : 60;
  const end = new Date(start.getTime() + minutes * 60000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: clean(event.title) || "Meeting",
    dates: `${formatGoogleDate(start, timeZone)}/${formatGoogleDate(end, timeZone)}`,
    details: descriptionFor(event),
    ctz: timeZone,
  });
  const location = locationFor(event);
  if (location) params.set("location", location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
