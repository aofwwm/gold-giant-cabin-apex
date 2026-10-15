export const FORMATS = ["physical", "online", "hybrid"] as const;
export type MeetingFormat = (typeof FORMATS)[number];

export const PLATFORMS = ["", "teams", "zoom", "skype", "meet", "webex", "other"] as const;
export type MeetingPlatform = (typeof PLATFORMS)[number];

export const MAKAN_WHEN = ["", "before", "after"] as const;
export type MakanWhen = (typeof MAKAN_WHEN)[number];

export type PlaceView = {
  format: MeetingFormat;
  venueName: string;
  room: string;
  address: string;
  platform: MeetingPlatform;
  meetingUrl: string;
  makanWhen: MakanWhen;
};

export const EMPTY_PLACE: PlaceView = {
  format: "physical",
  venueName: "",
  room: "",
  address: "",
  platform: "",
  meetingUrl: "",
  makanWhen: "",
};

export const PLATFORM_LABEL: Record<MeetingPlatform, string> = {
  "": "Online",
  teams: "Teams",
  zoom: "Zoom",
  skype: "Skype",
  meet: "Google Meet",
  webex: "Webex",
  other: "Online",
};

export function cleanMeetingUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.toString().slice(0, 300);
  } catch {
    return "";
  }
}

export function placeSummary(place: PlaceView): string {
  const physical = [place.venueName, place.room, place.address].map((part) => part.trim()).filter(Boolean).join(" · ");
  const online = place.meetingUrl ? PLATFORM_LABEL[place.platform] : place.platform ? PLATFORM_LABEL[place.platform] : "";
  if (place.format === "online") return online || "Online";
  if (place.format === "hybrid") return [physical || "Hybrid", online].filter(Boolean).join(" · ");
  return physical;
}

export function sgtHour(iso: string): number {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 12;
  return (date.getUTCHours() + 8) % 24;
}

export function mealFollowOn(place: PlaceView, startsAt: string, durationMin: number): { title: string; note: string; label: string } | null {
  if (place.makanWhen !== "before" && place.makanWhen !== "after") return null;
  const start = sgtHour(startsAt);
  const end = (start + Math.max(1, Math.round(durationMin / 60))) % 24;
  const before = place.makanWhen === "before";
  if (before) {
    const meal = start < 11 ? "Breakfast" : "Makan";
    return {
      title: `${meal} before this?`,
      note: place.format === "online" && !place.address ? "Online meeting. Choose where to base the search." : "Leave time to walk there and still start on time.",
      label: "Find something nearby",
    };
  }
  const meal = end < 11 ? "Breakfast" : end < 16 ? "Lunch" : end < 21 ? "Dinner" : "Supper";
  return {
    title: `${meal} after this?`,
    note: place.format === "online" && !place.address ? "Online meeting. Choose where to base the search." : "After it ends, near the meeting.",
    label: "Find makan nearby",
  };
}
