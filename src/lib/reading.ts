import { peopleFit, type PeopleFit } from "./tally";
import type { Kind, VoteView } from "./kairos.types";

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const YI: { tag: string; note: string }[] = [
  { tag: "宜 开市", note: "Suitable for opening the pitch" },
  { tag: "宜 签合同", note: "Suitable for signing contracts" },
  { tag: "宜 会友", note: "Suitable for gathering the team" },
  { tag: "宜 纳财", note: "Suitable for talking budget" },
  { tag: "宜 出行", note: "Suitable for leaving the building" },
  { tag: "宜 祭祀", note: "Suitable for the weekly ritual standup" },
  { tag: "宜 交易", note: "Suitable for vendor haggling" },
  { tag: "宜 宴请", note: "Suitable for makan on the company card" },
];

const JI: { tag: string; note: string }[] = [
  { tag: "忌 提加薪", note: "Avoid asking for a pay raise" },
  { tag: "忌 远行", note: "Avoid a meeting that could have been a note" },
  { tag: "忌 动土", note: "Avoid ripping up the roadmap" },
  { tag: "忌 诉讼", note: "Avoid blaming the vendor on the call" },
  { tag: "忌 安葬", note: "Avoid killing the pet project" },
  { tag: "忌 嫁娶", note: "Avoid announcing the reorg" },
  { tag: "忌 开仓", note: "Avoid unlocking the snack drawer early" },
  { tag: "忌 词讼", note: "Avoid the reply-all" },
];

const TAROT: { name: string; epithet: string; note: string }[] = [
  { name: "The Chariot", epithet: "forward motion", note: "Push the aggressive deadline today" },
  { name: "The Empress", epithet: "abundance and receptiveness", note: "Bring snacks. The room will soften" },
  { name: "The Tower", epithet: "a sudden interruption", note: "Someone will say take this offline" },
  { name: "Wheel of Fortune", epithet: "a number that wobbles, then lands", note: "The budget number will wobble, then land" },
  { name: "The Star", epithet: "a quiet yes", note: "A quiet yes is hiding in this hour" },
  { name: "The Fool", epithet: "one bold slide", note: "Walk in with one slide. Bold. Risky" },
  { name: "Justice", epithet: "the spreadsheet over the vibe", note: "Bring the spreadsheet. Leave the vibes" },
  { name: "The Moon", epithet: "foggy requirements", note: "Requirements are fog. Ask twice" },
  { name: "Strength", epithet: "hold the silence", note: "Hold the silence after you name the price" },
  { name: "Temperance", epithet: "one kopi, one hard question", note: "Mix one kopi-o with one hard question" },
  { name: "The Magician", epithet: "you already have the deck", note: "You already have the deck. Stop apologising" },
  { name: "Death", epithet: "cut the extra slide", note: "Kill the extra slide. The deck thanks you" },
];

const ZODIAC: { name: string; gloss: string; note: string }[] = [
  { name: "Rat day", gloss: "quick and opportunistic", note: "Spot the gap in the agenda and take it" },
  { name: "Ox day", gloss: "stable and deliberate", note: "Slow, documented, impossible to argue with" },
  { name: "Tiger day", gloss: "bold, one clean charge", note: "Charge once. Do not pace the room" },
  { name: "Rabbit day", gloss: "soft voice, firm close", note: "Soft voice, firm close" },
  { name: "Dragon day", gloss: "they expect a little theatre", note: "They expect theatre. Give them one clean number" },
  { name: "Snake day", gloss: "wait for the second answer", note: "Wait. The second answer is the real one" },
  { name: "Horse day", gloss: "fast agenda, no grazing", note: "Charge the agenda. Don't graze" },
  { name: "Goat day", gloss: "consensus, if nobody is hungry", note: "Consensus is available if nobody is hungry" },
  { name: "Monkey day", gloss: "wit helps, ego does not", note: "A joke will land. Do not make it about the boss" },
  { name: "Rooster day", gloss: "start on time or lose the hour", note: "Start on time or the charm expires" },
  { name: "Dog day", gloss: "loyalty hour, bring the doer", note: "Loyalty hour. Bring the person who did the work" },
  { name: "Pig day", gloss: "feed them and the signature comes", note: "Feed them and the signature comes easier" },
];

const ASTRO: Record<string, string> = {
  Mon: "Moon-ruled. Feelings sit close to the agenda.",
  Tue: "Mars-ruled. Direct, and a little sharp.",
  Wed: "Mercury-ruled. Good for detail and vendors.",
  Thu: "Jupiter-ruled. Expansive. Watch the scope.",
  Fri: "Supportive social alignment.",
  Sat: "Saturn-ruled. Quiet, slightly severe.",
  Sun: "Sun-ruled. Visibility is high. So is ego.",
};

const ROOT_SCORE = [0, 74, 68, 80, 62, 77, 84, 70, 88, 73];
const ROOT_NOTE = [
  "",
  "Root 1. A starting number. Direct, slightly impatient.",
  "Root 2. Cooperative, not commanding.",
  "Root 3. Social. The room will talk.",
  "Root 4. Structural. Bring the spreadsheet.",
  "Root 5. Restless. Keep the agenda short.",
  "Root 6. Harmonising. Good for a gathering.",
  "Root 7. Analytical. Questions will run long.",
  "Root 8. Material. Budgets feel natural.",
  "Root 9. Closing energy. Good for decisions, poor for new scope.",
];

export type Mission = "pitch" | "vendor" | "difficult" | "bonding" | "makan" | "general";

export type Factor = {
  id: string;
  label: string;
  points: number;
  max: number;
  note: string;
};

export type CosmicVote = {
  id: string;
  label: string;
  points: number;
  max: number;
  hundred: number;
  note: string;
  detail: string;
  mark: string;
};

export type OfficeWeather = {
  label: string;
  summary: string;
  forecast: string;
};

export type KairosReading = {
  score: number;
  mark: "吉" | "平" | "凶";
  real: number;
  cosmic: number;
  blend: number;
  mission: Mission;
  verdict: string;
  support: [string, string];
  availability: Factor;
  calendar: Factor;
  breathing: Factor;
  fit: Factor;
  tongshu: CosmicVote;
  zodiac: CosmicVote;
  tarot: CosmicVote;
  astrology: CosmicVote;
  numerology: CosmicVote;
  yi: string;
  yiNote: string;
  ji: string;
  jiNote: string;
  tarotName: string;
  tarotNote: string;
  zodiacName: string;
  zodiacNote: string;
  weather: OfficeWeather;
  boss: string;
};

export type ReadOptions = {
  kind?: Kind;
  durationMin?: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function factor(id: string, label: string, points: number, max: number, note: string): Factor {
  return { id, label, points, max, note };
}

export function markOf(score: number): "吉" | "平" | "凶" {
  if (score >= 80) return "吉";
  if (score >= 55) return "平";
  return "凶";
}

export function missionOf(title: string, kind: Kind): Mission {
  const t = title.toLowerCase();
  if (kind === "makan" || /\bmakan\b|supper|dinner|lunch|yum cha|zi char/.test(t)) return "makan";
  if (/bond|offsite|retreat|happy hour/.test(t)) return "bonding";
  if (/1:1|1-1|one to one|difficult|feedback|performance|check-in|check in/.test(t)) return "difficult";
  if (/vendor|supplier|technical sync|tech sync|integration/.test(t)) return "vendor";
  if (/pitch|budget|approval|boss|steer|proposal|sign-off|sign off/.test(t)) return "pitch";
  return "general";
}

function sgtClock(iso: string) {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(date);
  const g = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  let hour = Number(g.hour);
  if (hour === 24) hour = 0;
  return {
    dayKey: `${g.year}-${g.month}-${g.day}`,
    hour,
    weekday: g.weekday ?? "",
  };
}

function availability(weekday: string, hour: number, kind: Kind): Factor {
  const weekend = weekday === "Sat" || weekday === "Sun";
  if (kind === "makan") {
    if (hour >= 18 && hour <= 21) {
      return factor("availability", "Availability", 20, 20, "Supper hour. People can leave the building.");
    }
    if (hour >= 12 && hour < 14) {
      return factor("availability", "Availability", 16, 20, "Lunch window. Most can slip out.");
    }
    if (weekend && hour >= 11 && hour <= 21) {
      return factor("availability", "Availability", 18, 20, "Weekend. Hunger is the only conflict.");
    }
    return factor("availability", "Availability", 12, 20, "An odd hour to gather. Expect a few cannots.");
  }
  if (weekend) return factor("availability", "Availability", 9, 20, "Weekend. Only the truly willing will show.");
  if (hour >= 9 && hour < 18) return factor("availability", "Availability", 20, 20, "Everyone can make it.");
  if (hour >= 8 && hour < 9) return factor("availability", "Availability", 14, 20, "Early. A few people will say no.");
  if (hour >= 18 && hour < 20) return factor("availability", "Availability", 14, 20, "Edge of the day. Expect early exits.");
  return factor("availability", "Availability", 8, 20, "Outside office hours. Expect a few cannots.");
}

function calendarLoad(weekday: string, hour: number, kind: Kind): Factor {
  if (kind === "makan" && hour >= 18 && hour < 22) {
    return factor("calendar", "Hour pattern", 18, 20, "The work stack has already ended.");
  }
  if (hour >= 12 && hour < 14 && weekday !== "Sat" && weekday !== "Sun") {
    return factor("calendar", "Hour pattern", 7, 20, "Lunch crush. The hour and the stomachs are both full.");
  }
  if (weekday === "Mon" && hour >= 14 && hour < 16) {
    return factor("calendar", "Hour pattern", 9, 20, "Monday afternoon is usually a crowded pattern.");
  }
  if (weekday === "Mon" && hour >= 16 && hour < 18) {
    return factor("calendar", "Hour pattern", 8, 20, "Monday late day is usually the crowded end of the pattern.");
  }
  if (weekday === "Mon" && hour >= 9 && hour < 12) {
    return factor("calendar", "Hour pattern", 13, 20, "A busy morning pattern. Crowded, not buried.");
  }
  if (weekday === "Fri" && hour >= 16 && hour < 18) {
    return factor("calendar", "Hour pattern", 17, 20, "Friday afternoon is usually the lighter pattern.");
  }
  if (weekday === "Fri" && hour >= 9 && hour < 12) {
    return factor("calendar", "Hour pattern", 16, 20, "Friday morning is lighter than it looks.");
  }
  if (weekday === "Fri" && hour >= 14 && hour < 16) {
    return factor("calendar", "Hour pattern", 15, 20, "Friday afternoon is loosening.");
  }
  if ((weekday === "Sat" || weekday === "Sun") && kind === "makan") {
    return factor("calendar", "Hour pattern", 18, 20, "Weekend. The working week is not the obstacle.");
  }
  if (weekday === "Sat" || weekday === "Sun") {
    return factor("calendar", "Hour pattern", 12, 20, "Few meetings land here — which is also why it is awkward.");
  }
  if (hour >= 16 && hour < 18) return factor("calendar", "Hour pattern", 16, 20, "Late afternoon thins out.");
  if (hour >= 9 && hour < 12) {
    return factor("calendar", "Hour pattern", 15, 20, "Workable morning. A few standing meetings, nothing brutal.");
  }
  if (hour >= 14 && hour < 16) {
    return factor("calendar", "Hour pattern", 11, 20, "Post-lunch density. Survivable, not spacious.");
  }
  return factor("calendar", "Hour pattern", 12, 20, "Ordinary load for this hour.");
}

function breathing(weekday: string, hour: number, durationMin: number): Factor {
  let points = 9;
  let note = "An ordinary buffer around this hour.";
  if (hour >= 12 && hour < 14) {
    points = 5;
    note = "No real buffer. People arrive mid-thought.";
  } else if (weekday === "Fri" && hour >= 16 && hour < 18) {
    points = 12;
    note = "Clear buffer before the meeting.";
  } else if (weekday === "Mon" && hour >= 16 && hour < 18) {
    points = 7;
    note = "Little slack. The hour before is usually taken.";
  } else if (weekday === "Mon" && hour >= 10 && hour < 12) {
    points = 11;
    note = "A pocket before lunch. Not a wide runway.";
  } else if (hour >= 18 && hour < 21) {
    points = 13;
    note = "The office has exhaled. There is air on both sides.";
  } else if (hour >= 10 && hour < 12) {
    points = 12;
    note = "Clear enough on either side.";
  } else if (hour >= 16 && hour < 18) {
    points = 11;
    note = "A gap before the end of the day.";
  } else if (hour >= 14 && hour < 16) {
    points = 8;
    note = "The previous meeting tends to overrun.";
  } else if (hour >= 9 && hour < 10) {
    points = 10;
    note = "Just after the morning rush. A short runway.";
  }
  if (durationMin >= 90) {
    points -= 2;
    note = `${note} A long session needs more air than this.`;
  } else if (durationMin <= 30) {
    points += 1;
  }
  return factor("breathing", "Breathing room", clamp(points, 0, 15), 15, note);
}

function meetingFit(mission: Mission, weekday: string, hour: number): Factor {
  const label = "Meeting fit";
  if (mission === "pitch") {
    if (weekday === "Fri" && hour >= 15 && hour < 18) {
      return factor("fit", label, 9, 10, "Strong window for a budget discussion.");
    }
    if (hour >= 10 && hour < 12) return factor("fit", label, 8, 10, "Good hour for numbers. People are awake.");
    if (weekday === "Mon" && hour >= 15) return factor("fit", label, 6, 10, "The ask will land tired. Keep it to one decision.");
    if (hour >= 9 && hour < 10) return factor("fit", label, 7, 10, "Possible, once the first coffee has landed.");
    if (hour >= 14 && hour < 16) return factor("fit", label, 6, 10, "Post-lunch pitches blur.");
    if (hour >= 12 && hour < 14) return factor("fit", label, 3, 10, "Do not ask for money between bites.");
    return factor("fit", label, 5, 10, "An ordinary hour for a decision.");
  }
  if (mission === "vendor") {
    if (hour >= 10 && hour < 12) return factor("fit", label, 9, 10, "Clean window for a technical sync.");
    if (hour >= 14 && hour < 16) return factor("fit", label, 7, 10, "Acceptable. Watch for overruns.");
    if (weekday === "Fri" && hour >= 16) return factor("fit", label, 6, 10, "They will attend. Depth may not.");
    if (weekday === "Mon" && hour >= 16) return factor("fit", label, 5, 10, "Vendor calls die in the Monday stack.");
    return factor("fit", label, 6, 10, "Workable for a vendor conversation.");
  }
  if (mission === "difficult") {
    if (weekday !== "Mon" && weekday !== "Fri" && hour >= 10 && hour < 12) {
      return factor("fit", label, 9, 10, "Private, alert, and not yet hungry.");
    }
    if (weekday !== "Mon" && weekday !== "Fri" && hour >= 15 && hour < 17) {
      return factor("fit", label, 8, 10, "Quiet enough for a hard conversation.");
    }
    if (weekday === "Fri" && hour >= 15) return factor("fit", label, 5, 10, "Friday softens the room — and the honesty.");
    if (weekday === "Mon" && hour < 12) return factor("fit", label, 4, 10, "Monday morning is a poor time to make it personal.");
    if (weekday === "Mon") return factor("fit", label, 5, 10, "They are depleted. Say less, not more.");
    return factor("fit", label, 6, 10, "Possible. Do not add an audience.");
  }
  if (mission === "bonding") {
    if (weekday === "Fri" && hour >= 16 && hour < 19) return factor("fit", label, 10, 10, "This is what Friday is for.");
    if (hour >= 18 && hour < 21) return factor("fit", label, 8, 10, "After work. The right temperature for bonding.");
    if (hour < 17) return factor("fit", label, 4, 10, "Bonding inside the workday feels like another meeting.");
    return factor("fit", label, 7, 10, "Reasonable for a team hour.");
  }
  if (mission === "makan") {
    if (hour >= 18 && hour <= 21) return factor("fit", label, 10, 10, "Proper makan hour.");
    if (weekday === "Fri" && hour >= 16 && hour < 18) return factor("fit", label, 8, 10, "Early, but Friday will forgive it.");
    if (hour >= 12 && hour < 14) return factor("fit", label, 8, 10, "Lunch can be the meeting.");
    return factor("fit", label, 5, 10, "An odd hour to eat on purpose.");
  }
  if ((hour >= 10 && hour < 12) || (hour >= 16 && hour < 17)) {
    return factor("fit", label, 8, 10, "A sound hour for most conversations.");
  }
  if (hour >= 12 && hour < 14) return factor("fit", label, 4, 10, "Lunch will upstage the agenda.");
  if (weekday === "Mon" && hour >= 16) return factor("fit", label, 6, 10, "Doable. Do not expect extra patience.");
  return factor("fit", label, 7, 10, "Fits a normal working conversation.");
}

function cosmicBase(weekday: string, hour: number) {
  if (weekday === "Fri" && hour >= 16 && hour < 18) return { ts: 11, zo: 7, ta: 6, as: 5 };
  if (weekday === "Mon" && hour >= 10 && hour < 12) return { ts: 7, zo: 5, ta: 4, as: 4 };
  if (weekday === "Mon" && hour >= 15 && hour < 18) return { ts: 8, zo: 7, ta: 4, as: 4 };
  if (hour >= 12 && hour < 14) return { ts: 4, zo: 4, ta: 3, as: 3 };
  if (hour >= 10 && hour < 12) return { ts: 9, zo: 6, ta: 5, as: 5 };
  if (hour >= 16 && hour < 18) return { ts: 9, zo: 6, ta: 5, as: 5 };
  if (hour >= 18 && hour < 21) return { ts: 8, zo: 6, ta: 6, as: 4 };
  if (weekday === "Fri") return { ts: 8, zo: 6, ta: 5, as: 5 };
  return { ts: 7, zo: 5, ta: 5, as: 4 };
}

function yiLine(tag: string, mission: Mission) {
  const primary = tag.replace(/\s+/g, "");
  const companion: Record<Mission, string> = {
    pitch: "宜商议",
    vendor: "宜交易",
    difficult: "宜会友",
    bonding: "宜宴请",
    makan: "宜宴请",
    general: "宜会友",
  };
  const extra = companion[mission];
  return primary === extra ? primary : `${primary} / ${extra}`;
}

function officeWeather(weekday: string, hour: number, calendarPoints: number, mission: Mission): OfficeWeather {
  if (weekday === "Fri" && hour >= 16 && hour < 18) {
    return {
      label: "Partly cloudy",
      summary: "Friday afternoons usually loosen, with room before people head out.",
      forecast:
        mission === "difficult"
          ? "Forecast: 40% chance the honesty gets deferred to next week."
          : "Forecast: 30% chance of “let's discuss offline.”",
    };
  }
  if (weekday === "Mon" && hour >= 15 && hour < 18) {
    return {
      label: "Overcast",
      summary: "Monday late day is a crowded pattern. A pause beforehand is the exception, not a promise.",
      forecast: "Forecast: elevated chance of “can we move this?”",
    };
  }
  if (weekday === "Mon" && hour >= 9 && hour < 12) {
    return {
      label: "Partly cloudy",
      summary: "Monday morning is busy, but this hour often sits between standup and lunch.",
      forecast: "Forecast: moderate chance of a rushed close.",
    };
  }
  if (hour >= 12 && hour < 14) {
    return {
      label: "Overcast",
      summary: "The lunch band. Meetings here compete with food.",
      forecast: "Forecast: high chance of eyes on the clock.",
    };
  }
  if (hour >= 18) {
    return {
      label: "Clearing",
      summary: "The working day has mostly closed. What remains is optional energy.",
      forecast:
        mission === "makan"
          ? "Forecast: 80% chance of “I'm not hungry” followed by two plates."
          : "Forecast: low chance of a surprise stakeholder.",
    };
  }
  if (calendarPoints <= 9) {
    return {
      label: "Overcast",
      summary: "The pattern for this hour is crowded. Slack is the exception.",
      forecast: "Forecast: bring a shorter version of the deck.",
    };
  }
  return {
    label: calendarPoints >= 16 ? "Fair" : "Partly cloudy",
    summary: "A normal office rhythm. Nothing sharp in the pattern, nothing spacious either.",
    forecast: "Forecast: ordinary. No drama in the pattern.",
  };
}

function verdictFor(
  mission: Mission,
  weekday: string,
  hour: number,
  score: number,
  real: number,
  cosmic: number,
): string {
  if (mission === "difficult" && weekday === "Fri" && hour >= 16) {
    return "Friday softens the room. Fine for bonding. Brave for a hard conversation.";
  }
  if (mission === "difficult" && weekday === "Mon") {
    return "Monday is a poor day to make it personal. If it must happen, keep it short.";
  }
  if (weekday === "Fri" && hour >= 16 && hour < 18 && score >= 80) {
    return "Friday glide path. The hour is kind, and the gathering energy is real.";
  }
  if (weekday === "Mon" && hour >= 15 && hour < 18) return "Monday after the pile-up? Brave.";
  if (mission === "makan" && score >= 75) return "The hour is kind. Tong Shu is happy. Proceed lah.";
  if (mission === "vendor" && hour >= 10 && hour < 12) {
    return "A clean window for the technical bits. Lead with the decision, not the archaeology.";
  }
  if (real >= 50 && cosmic >= 24) return "The hour is kind and the almanac is willing. Still your call.";
  if (real >= 50) return "The hour pattern is favourable. The universe is merely polite.";
  if (cosmic >= 22 && real < 45) return "The stars are keen. The hour is not. Trust the people.";
  return "A workable hour. Not the one Kairos would frame.";
}

function supportFor(real: number, cosmic: number): [string, string] {
  if (real >= 55 && cosmic >= 26) return ["The hour likes it.", "The universe likes it too."];
  if (real >= 55) return ["The hour likes it.", "The universe is unbothered."];
  if (real >= 48 && cosmic < 22) return ["The hour can live with it.", "The almanac is neutral."];
  if (real < 48 && cosmic >= 22) return ["The hour is cautious.", "The universe is strangely keen."];
  return ["A mixed hour.", "Neither side is cheering loudly."];
}

function digitRoot(dayKey: string) {
  const digits = dayKey.replace(/\D/g, "").split("").map(Number);
  let sum = digits.reduce((total, n) => total + n, 0);
  while (sum > 9) {
    sum = String(sum)
      .split("")
      .reduce((total, ch) => total + Number(ch), 0);
  }
  return sum || 1;
}

function vote(
  id: string,
  label: string,
  points: number,
  max: number,
  note: string,
  detail: string,
  mark: string,
): CosmicVote {
  return {
    id,
    label,
    points,
    max,
    hundred: max > 0 ? Math.round((points / max) * 100) : 0,
    note,
    detail,
    mark,
  };
}

export function readReading(iso: string, title: string, options: ReadOptions = {}): KairosReading {
  const kind = options.kind ?? "meeting";
  const durationMin = options.durationMin ?? 60;
  const { dayKey, hour, weekday } = sgtClock(iso);
  const mission = missionOf(title, kind);
  const seed = hashString(`${dayKey}|${hour}|${title.trim().toLowerCase()}`);

  const avail = availability(weekday, hour, kind);
  const calendar = calendarLoad(weekday, hour, kind);
  const breath = breathing(weekday, hour, durationMin);
  const fit = meetingFit(mission, weekday, hour);
  const real = avail.points + calendar.points + breath.points + fit.points;

  const base = cosmicBase(weekday, hour);
  const yi = YI[hashString(`${dayKey}|yi|${title}`) % YI.length]!;
  const ji = JI[hashString(`${dayKey}|${hour}|ji`) % JI.length]!;
  const tarotCard = TAROT[seed % TAROT.length]!;
  const zodiacCard = ZODIAC[hashString(dayKey) % ZODIAC.length]!;
  const root = digitRoot(dayKey);

  const tongshu = vote(
    "tongshu",
    "Tong Shu",
    base.ts,
    12,
    yiLine(yi.tag, mission),
    yi.note,
    base.ts >= 10 ? "吉" : base.ts >= 7 ? "平" : "",
  );
  const zodiac = vote(
    "zodiac",
    "Chinese zodiac",
    base.zo,
    8,
    `${zodiacCard.name.replace("day", "Day")} · ${zodiacCard.gloss}`,
    zodiacCard.note,
    "",
  );
  const tarot = vote(
    "tarot",
    "Tarot",
    base.ta,
    8,
    `${tarotCard.name} · ${tarotCard.epithet}`,
    tarotCard.note,
    "",
  );
  const astrology = vote(
    "astrology",
    "Western astrology",
    base.as,
    7,
    ASTRO[weekday] ?? "A quiet sky. Nothing is shouting.",
    ASTRO[weekday] ?? "A quiet sky.",
    "",
  );
  const numerology = vote("numerology", "Numerology", 0, 0, ROOT_NOTE[root] ?? "", ROOT_NOTE[root] ?? "", "");
  numerology.hundred = ROOT_SCORE[root] ?? 70;

  const cosmic = base.ts + base.zo + base.ta + base.as;
  const blend = Math.round(
    tongshu.hundred * 0.33 +
      zodiac.hundred * 0.25 +
      tarot.hundred * 0.2 +
      astrology.hundred * 0.14 +
      numerology.hundred * 0.08,
  );
  const score = clamp(real + cosmic, 0, 100);
  const weather = officeWeather(weekday, hour, calendar.points, mission);

  return {
    score,
    mark: markOf(score),
    real,
    cosmic,
    blend,
    mission,
    verdict: verdictFor(mission, weekday, hour, score, real, cosmic),
    support: supportFor(real, cosmic),
    availability: avail,
    calendar,
    breathing: breath,
    fit,
    tongshu,
    zodiac,
    tarot,
    astrology,
    numerology,
    yi: yi.tag,
    yiNote: yi.note,
    ji: ji.tag,
    jiNote: ji.note,
    tarotName: tarotCard.name,
    tarotNote: tarotCard.note,
    zodiacName: zodiacCard.name,
    zodiacNote: zodiacCard.note,
    weather,
    boss: weather.summary,
  };
}

export function momentPoints(real: number): number {
  return clamp(Math.round((real / 65) * 30), 0, 30);
}

export function cosmicPoints(cosmic: number): number {
  return clamp(Math.round((cosmic / 35) * 30), 0, 30);
}

export type LayerScore = {
  people: PeopleFit;
  moment: number;
  cosmicFit: number;
  total: number | null;
  mark: "吉" | "平" | "凶" | "";
  reading: KairosReading;
};

export function scoreLayers(reading: KairosReading, votes: VoteView[], roster: number): LayerScore {
  const people = peopleFit(votes, roster);
  const moment = momentPoints(reading.real);
  const cosmicFit = cosmicPoints(reading.cosmic);
  const total = people.waiting ? null : clamp(people.points + moment + cosmicFit, 0, 100);
  return {
    people,
    moment,
    cosmicFit,
    total,
    mark: total == null ? "" : markOf(total),
    reading,
  };
}

export function whyBullets(layer: LayerScore, durationMin: number): string[] {
  const { people, reading } = layer;
  const lines: string[] = [];
  if (!people.waiting) {
    if (people.love > 0 && people.love >= people.yes && people.soft === 0 && people.no === 0) {
      lines.push("Strongest group preference");
    } else if (people.soft > 0 && people.love === 0) {
      lines.push("People can attend. Few of them want to.");
    } else if (people.love > 0) {
      lines.push(people.love === 1 ? "One person loves this hour" : `${people.love} people love this hour`);
    }
    lines.push(`${people.able} / ${people.roster} can attend`);
  }
  if (reading.breathing.points >= 11 && durationMin <= 60) {
    lines.push(`Comfortable ${durationMin}-minute window`);
  } else {
    lines.push(reading.fit.note);
  }
  if (reading.tongshu.points >= 10) lines.push("Tong Shu favours meeting and discussion");
  else lines.push(`${reading.tongshu.note}`);
  lines.push(`${reading.tarotName} · ${reading.tarot.note.split(" · ")[1] ?? reading.tarot.detail}`);
  return lines.slice(0, 4);
}

export function voiceLine(layer: LayerScore, weekdayHint: string): string {
  const { people, moment, cosmicFit, reading } = layer;
  if (people.waiting) return "Share the moments. Nicknames do the rest. No login, no calendar.";
  if (people.able === people.roster && people.love >= people.yes && moment >= 20 && cosmicFit >= 20 && weekdayHint === "Fri") {
    return "Friday glide path. Everyone's keen, Tong Shu happy. Proceed lah.";
  }
  if (people.able === people.roster && people.love > 0 && people.soft === 0 && people.no === 0) {
    return "Everyone can make it. Almost everyone actually wants it.";
  }
  if (people.soft > 0 && people.no === 0 && people.love === 0) {
    return "Monday technically works. The room is less keen.";
  }
  if (people.love > 0 && people.yes > 0 && people.no === 0) {
    return `${people.love} ${people.love === 1 ? "person loves" : "people love"} it. ${people.yes} can live with it. Good enough.`;
  }
  if (moment >= 22 && people.able < people.roster) {
    return "The hour is kind. The group is not all in.";
  }
  if (cosmicFit >= 22 && people.points < 24) {
    return "The stars are keen. Trust the people first.";
  }
  return reading.verdict;
}

export function compareLine(reading: KairosReading, isBest: boolean): string {
  const load =
    reading.calendar.points >= 16
      ? "Light hour"
      : reading.calendar.points >= 12
        ? "Moderate hour"
        : "Heavy hour";
  let cosmic = "neutral cosmic timing";
  if (reading.zodiac.points >= 7 && reading.tongshu.points < 10) cosmic = "good zodiac alignment";
  else if (reading.tongshu.points >= 10) cosmic = "favourable Tong Shu";
  else if (reading.cosmic >= 22) cosmic = "friendly cosmic timing";
  const parts = [load, cosmic];
  if (isBest) parts.push("strongest context");
  return parts.join(" · ");
}
