import { sgtNow } from "./time.ts";
import { answerFits, mentionedDay, methodMatrix, parseQuestionContract, type QuestionContract } from "./oracle-contract.ts";

export const ORACLE_FRAMING = "Use this for reflection, curiosity, and timing — not certainty.";

export const ORACLE_HOW =
  "Kairos chooses the divination methods that best fit your question. A timing question may use Tong Shu, while a decision may call for Tarot or I Ching. Different questions, different signs.";

export type OracleEnergy =
  | "FAVOURABLE"
  | "FAVOURABLE WITH CAUTION"
  | "MIXED"
  | "NEUTRAL"
  | "BETTER TO WAIT"
  | "UNCLEAR";

export type OracleLean = "favourable" | "caution" | "wait" | "neutral";
export type OracleGuard = "none" | "health" | "money" | "harm";
export type OracleMode = "read" | "compare" | "dates" | "daily";
export type OracleTopic = "career" | "sign" | "travel" | "money" | "love" | "family" | "general";

export type OracleLayer = {
  id: "tongShu" | "tarot" | "iching" | "numerology" | "zodiac" | "bazi";
  name: string;
  result: string;
  detail: string;
  line: string;
  lean: OracleLean;
};

export type OracleSide = {
  label: string;
  energy: OracleEnergy;
  layers: OracleLayer[];
  tradeoff: string;
};

export type OracleDatePick = {
  date: string;
  label: string;
  energy: OracleEnergy;
  score: number;
  band: OracleBand;
  action: "宜" | "忌" | "平";
  actionLabel: string;
  layers: OracleLayer[];
};

export type OracleBand = "大吉" | "吉" | "中吉" | "中" | "中凶" | "凶";

export type OracleSignal = {
  method: OracleMethodId;
  name: string;
  mark: string;
  direction: -1 | 0 | 1;
  strength: number;
  applicability: number;
  weight: number;
  signal: "吉" | "中" | "忌";
  strengthLabel: "Strong" | "Moderate" | "Light";
  raw: string;
  interpretation: string;
  whyItMatters: string;
};

export type OracleSynthesis = {
  band: OracleBand;
  bandLabel: string;
  action: "宜" | "忌" | "平";
  actionLabel: string;
  agreement: "STRONG" | "LEANING" | "MIXED" | "SPLIT";
  supportive: number;
  neutral: number;
  cautionary: number;
  conflict: string;
  mixed: boolean;
  goodFor: string[];
  lessFor: string[];
  note: string;
  dimension?: string;
  cycle?: string;
  window?: string;
  windowLabel?: string;
};

export type OracleMethodId = "tong_shu" | "tarot" | "iching" | "numerology" | "zodiac" | "bazi" | "astrology";
export type OracleMethodStatus = "selected" | "not_used" | "not_relevant" | "needs_info" | "not_connected";

export type OracleMethodChoice = {
  method: OracleMethodId;
  name: string;
  mark: string;
  selected: boolean;
  status: OracleMethodStatus;
  reason: string;
  relevance: number;
};

export type OracleBazi = {
  pillars: string;
  elements: string;
  line: string;
  complete: boolean;
};

export type OracleReading = {
  id: string;
  question: string;
  questionType: string;
  topic: OracleTopic;
  guard: OracleGuard;
  mode: OracleMode;
  energy: OracleEnergy;
  says: string;
  attention: string[];
  expand: string;
  cameo: string;
  layers: OracleLayer[];
  sides: OracleSide[];
  dates: OracleDatePick[];
  steps: string[];
  used: string;
  methods: OracleMethodChoice[];
  signals: OracleSignal[];
  synthesis: OracleSynthesis | null;
  scanned: string;
  bazi: OracleBazi | null;
  contract?: QuestionContract | null;
  answer?: { direct: string; timing: string; why: string; helps: string; delays: string } | null;
  validation?: { ok: boolean; reason: string };
  ledger?: {
    promptVersion: string;
    schemaVersion: string;
    model: string;
    fallbackModelUsed: boolean;
    generatedAt: string;
    classifier: "LOCAL";
    llmCalls: number;
    cache: "HIT" | "MISS";
  };
};

export type OracleInput = {
  question?: string;
  mode?: "ask" | "daily" | "compare" | "dates";
  hint?: string;
  optionA?: string;
  optionB?: string;
  windowDays?: number;
  birthDate?: string;
  birthDateB?: string;
  birthTime?: string;
  birthPlace?: string;
  include?: OracleMethodId[];
  asOf?: string;
  rng?: () => number;
  fresh?: boolean;
};

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
const ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"] as const;
const BRANCH_ELEMENT = ["Water", "Earth", "Wood", "Wood", "Earth", "Fire", "Fire", "Earth", "Metal", "Metal", "Earth", "Water"] as const;

const LUNAR_NEW_YEAR: Record<number, string> = {
  2020: "2020-01-25",
  2021: "2021-02-12",
  2022: "2022-02-01",
  2023: "2023-01-22",
  2024: "2024-02-10",
  2025: "2025-01-29",
  2026: "2026-02-17",
  2027: "2027-02-06",
  2028: "2028-01-26",
  2029: "2029-02-13",
  2030: "2030-02-03",
  2031: "2031-01-23",
  2032: "2032-02-11",
  2033: "2033-01-31",
  2034: "2034-02-19",
  2035: "2035-02-08",
  2036: "2036-01-28",
};

const SOLAR_MONTHS: { month: number; day: number; branch: number }[] = [
  { month: 1, day: 6, branch: 1 },
  { month: 2, day: 4, branch: 2 },
  { month: 3, day: 6, branch: 3 },
  { month: 4, day: 5, branch: 4 },
  { month: 5, day: 6, branch: 5 },
  { month: 6, day: 6, branch: 6 },
  { month: 7, day: 7, branch: 7 },
  { month: 8, day: 8, branch: 8 },
  { month: 9, day: 8, branch: 9 },
  { month: 10, day: 8, branch: 10 },
  { month: 11, day: 7, branch: 11 },
  { month: 12, day: 7, branch: 0 },
];

type OfficerLean = Record<OracleTopic, OracleLean>;

const OFFICERS: { name: string; yi: string; ji: string; line: string; lean: OfficerLean }[] = [
  { name: "建", yi: "赴任", ji: "动土", line: "A building day. Suitable for taking up a post, not for tearing a plan apart.", lean: pack("favourable", "caution", "neutral", "neutral", "caution", "favourable", "neutral") },
  { name: "除", yi: "扫舍", ji: "签约", line: "A clearing day. Good for removing clutter. Weak for a signature.", lean: pack("neutral", "wait", "neutral", "neutral", "neutral", "favourable", "neutral") },
  { name: "满", yi: "开市", ji: "远行", line: "A full day. Money talk has support. A long journey does not.", lean: pack("neutral", "neutral", "wait", "favourable", "neutral", "neutral", "neutral") },
  { name: "平", yi: "修整", ji: "诉讼", line: "An even day. Ordinary matters are fine. Do not pick a fight.", lean: pack("neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral") },
  { name: "定", yi: "订盟", ji: "词讼", line: "A settling day. Contracts and promises sit more comfortably.", lean: pack("favourable", "favourable", "neutral", "neutral", "favourable", "favourable", "favourable") },
  { name: "执", yi: "捕捉", ji: "开市", line: "A holding day. Keep what you have. A new launch is impatient.", lean: pack("caution", "caution", "caution", "wait", "caution", "neutral", "caution") },
  { name: "破", yi: "求医", ji: "大事", line: "A breaking day. Major asks, signatures, and departures should wait.", lean: pack("wait", "wait", "wait", "wait", "wait", "caution", "wait") },
  { name: "危", yi: "安床", ji: "远行", line: "A precarious day. Stay with what is close. Travel wants a steadier date.", lean: pack("caution", "caution", "wait", "caution", "caution", "neutral", "caution") },
  { name: "成", yi: "开市", ji: "诉讼", line: "A completing day. Launches, agreements, and meetings can land.", lean: pack("favourable", "favourable", "favourable", "favourable", "favourable", "favourable", "favourable") },
  { name: "收", yi: "纳财", ji: "开业", line: "A gathering day. Collecting and closing suit it. A brand-new start less so.", lean: pack("neutral", "favourable", "neutral", "favourable", "neutral", "neutral", "neutral") },
  { name: "开", yi: "求职", ji: "安葬", line: "An opening day. Conversations, travel, and first approaches are supported.", lean: pack("favourable", "favourable", "favourable", "favourable", "favourable", "favourable", "favourable") },
  { name: "闭", yi: "塞穴", ji: "出行", line: "A closed day. Going out, pitching, and signing meet resistance.", lean: pack("wait", "wait", "wait", "caution", "caution", "neutral", "wait") },
];

function pack(career: OracleLean, sign: OracleLean, travel: OracleLean, money: OracleLean, love: OracleLean, family: OracleLean, general: OracleLean): OfficerLean {
  return { career, sign, travel, money, love, family, general };
}

type Card = { name: string; up: [OracleLean, string]; down: [OracleLean, string] };

const MAJOR: Card[] = [
  { name: "The Fool", up: ["caution", "A beginning, not a plan."], down: ["wait", "Impulse is louder than judgement."] },
  { name: "The Magician", up: ["favourable", "You already have the means."], down: ["caution", "Skill is there. Focus is not."] },
  { name: "The High Priestess", up: ["neutral", "Wait for what is not being said."], down: ["caution", "Secrets are doing the talking."] },
  { name: "The Empress", up: ["favourable", "Something can grow if you let it."], down: ["caution", "Comfort is crowding the decision."] },
  { name: "The Emperor", up: ["favourable", "Structure will carry this."], down: ["caution", "Control is pretending to be clarity."] },
  { name: "The Hierophant", up: ["neutral", "Use the proper channel."], down: ["caution", "The rulebook is getting in the way."] },
  { name: "The Lovers", up: ["favourable", "A real choice, not a vibe."], down: ["caution", "Alignment is being assumed."] },
  { name: "The Chariot", up: ["favourable", "Movement, if you steer."], down: ["wait", "Force will scatter this."] },
  { name: "Strength", up: ["favourable", "Confidence with restraint."], down: ["caution", "The grip is tighter than the nerve."] },
  { name: "The Hermit", up: ["neutral", "Reflection before the room."], down: ["caution", "Isolation is posing as wisdom."] },
  { name: "Wheel of Fortune", up: ["favourable", "The turn is real. It is not yours to command."], down: ["caution", "A turn, not a rescue."] },
  { name: "Justice", up: ["neutral", "Facts before preference."], down: ["caution", "The account is not balanced yet."] },
  { name: "The Hanged Man", up: ["wait", "Pause. The view changes."], down: ["caution", "Delay has become a habit."] },
  { name: "Death", up: ["caution", "An ending that makes room. Not a threat."], down: ["wait", "Something is being kept past its time."] },
  { name: "Temperance", up: ["favourable", "Blend it. Do not spike it."], down: ["caution", "The mix is off."] },
  { name: "The Devil", up: ["caution", "A hook, not a destiny."], down: ["wait", "You can leave the hook. Not today by force."] },
  { name: "The Tower", up: ["wait", "A sudden break. Do not build on it yet."], down: ["caution", "The shock is smaller if you stop pretending."] },
  { name: "The Star", up: ["favourable", "A quiet yes, still early."], down: ["caution", "Hope is outrunning the facts."] },
  { name: "The Moon", up: ["caution", "Fog. Ask twice."], down: ["wait", "The picture is not trustworthy yet."] },
  { name: "The Sun", up: ["favourable", "Visibility helps. Ego does not."], down: ["caution", "Bright, and a little blinding."] },
  { name: "Judgement", up: ["favourable", "A call you have already heard."], down: ["caution", "The doubt is the unfinished part."] },
  { name: "The World", up: ["favourable", "A cycle can close cleanly."], down: ["caution", "Almost. Not quite the last step."] },
];

const NUMBER_WORD: Record<number, [OracleLean, string]> = {
  1: ["favourable", "Initiative. Do not bulldoze."],
  2: ["neutral", "Cooperation. Not command."],
  3: ["favourable", "Expression. Keep it to one point."],
  4: ["neutral", "Structure. Bring the facts."],
  5: ["caution", "Restless. Shorten the ask."],
  6: ["favourable", "Harmony. Good for a conversation, poor for a fight."],
  7: ["neutral", "Analysis. Questions will run long."],
  8: ["caution", "Material weight. Easy to overplay."],
  9: ["neutral", "Closing energy. Poor for new scope."],
  11: ["caution", "Intensity. Say less than you feel."],
  22: ["favourable", "A builder’s number. Still needs a plan."],
  33: ["neutral", "A heavy number. Do not perform it."],
};

const PYTH: Record<string, number> = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WD_INDEX: Record<string, number> = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

export function randomUnit(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] ?? 0) / 4294967296;
}

export function julianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function dayPillar(iso: string): { stem: number; branch: number; label: string } {
  const [year, month, day] = iso.split("-").map(Number);
  const jdn = julianDay(year ?? 2000, month ?? 1, day ?? 1);
  const stem = (jdn + 9) % 10;
  const branch = (jdn + 1) % 12;
  return { stem, branch, label: `${STEMS[stem]}${BRANCHES[branch]}` };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function addIsoDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 2000, (month ?? 1) - 1, (day ?? 1) + days));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function weekdayIndex(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year ?? 2000, (month ?? 1) - 1, day ?? 1)).getUTCDay();
}

export function formatOracleDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 2000, (month ?? 1) - 1, day ?? 1));
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(date);
}

function todayIso(): string {
  const now = sgtNow();
  return `${now.y}-${pad(now.m)}-${pad(now.d)}`;
}

function solarBranch(iso: string): number {
  const [, month, day] = iso.split("-").map(Number);
  let branch = 0;
  for (const term of SOLAR_MONTHS) {
    if ((month ?? 1) > term.month || ((month ?? 1) === term.month && (day ?? 1) >= term.day)) branch = term.branch;
  }
  return branch;
}

function lunarYear(iso: string): number {
  const year = Number(iso.slice(0, 4));
  const threshold = LUNAR_NEW_YEAR[year];
  if (!threshold) return iso < `${year}-02-04` ? year - 1 : year;
  return iso < threshold ? year - 1 : year;
}

function reduceNumber(value: number): number {
  // Digit sum. Master numbers 11, 22 and 33 are left as they are.
  let n = Math.abs(Math.round(value));
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((sum, ch) => sum + Number(ch), 0);
  }
  return n || 1;
}

/** Date vibration: reduce(year + month + day). */
export function dateNumber(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return reduceNumber((year ?? 0) + (month ?? 0) + (day ?? 0));
}

/** Life path: reduce(sum of every digit in the birth date). */
export function lifePath(iso: string): number {
  const digits = iso.replace(/\D/g, "").split("").reduce((sum, ch) => sum + Number(ch), 0);
  return reduceNumber(digits);
}

export function personalYear(birth: string, day: string): number {
  const month = Number(birth.slice(5, 7));
  const date = Number(birth.slice(8, 10));
  const year = Number(day.slice(0, 4));
  return reduceNumber(month + date + year);
}

export function personalMonth(birth: string, day: string): number {
  return reduceNumber(personalYear(birth, day) + Number(day.slice(5, 7)));
}

/**
 * Personal year: reduce(birth month + birth day + calendar year).
 * Personal month: reduce(personal year + calendar month).
 * Personal day: reduce(personal month + calendar day).
 */
export function personalDay(birth: string, day: string): number {
  return reduceNumber(personalMonth(birth, day) + Number(day.slice(8, 10)));
}

/** Pythagorean name number, then the same reduction. */

export function nameNumber(value: string): number {
  const sum = value.toLowerCase().split("").reduce((total, ch) => total + (PYTH[ch] ?? 0), 0);
  return reduceNumber(sum || 1);
}

function numberLayer(kind: string, value: number, id: "numerology" = "numerology"): OracleLayer {
  const [lean, line] = NUMBER_WORD[value] ?? NUMBER_WORD[9]!;
  const detail = kind === "Date" ? "Date vibration" : kind === "Personal Day" ? "Personal day" : kind === "Name" ? "Name number" : kind;
  return { id, name: "NUMEROLOGY", result: `${kind} ${value}`, detail, line, lean };
}

export function drawTarot(rng: () => number): OracleLayer {
  const card = MAJOR[Math.floor(rng() * MAJOR.length) % MAJOR.length] ?? MAJOR[8]!;
  const reversed = rng() < 0.5;
  const [lean, line] = reversed ? card.down : card.up;
  return {
    id: "tarot",
    name: "TAROT",
    result: card.name,
    detail: reversed ? "Reversed" : "Upright",
    line,
    lean,
  };
}

type Tri = "qian" | "dui" | "li" | "zhen" | "xun" | "kan" | "gen" | "kun";

const TRI_BIT: Record<Tri, number> = { kun: 0, zhen: 1, kan: 2, dui: 3, gen: 4, li: 5, xun: 6, qian: 7 };
const TRI_NAME: Record<Tri, string> = {
  qian: "Heaven",
  dui: "Lake",
  li: "Fire",
  zhen: "Thunder",
  xun: "Wind",
  kan: "Water",
  gen: "Mountain",
  kun: "Earth",
};

type Hex = { up: Tri; lo: Tri; cn: string; en: string; lean: OracleLean; line: string };

const HEX_LIST: Hex[] = [
  { up: "qian", lo: "qian", cn: "乾", en: "The Creative", lean: "favourable", line: "A strong beginning. It still needs a hand on the reins." },
  { up: "kun", lo: "kun", cn: "坤", en: "The Receptive", lean: "neutral", line: "Yield first. Force would miss the shape of this." },
  { up: "kan", lo: "zhen", cn: "屯", en: "Difficulty", lean: "caution", line: "The start is real, and it is not smooth." },
  { up: "gen", lo: "kan", cn: "蒙", en: "Youthful Folly", lean: "caution", line: "Ask someone who has done it. Guessing will wander." },
  { up: "kan", lo: "qian", cn: "需", en: "Waiting", lean: "wait", line: "The moment is coming. Chasing it makes it late." },
  { up: "qian", lo: "kan", cn: "讼", en: "Conflict", lean: "caution", line: "A dispute is available. You do not have to take it." },
  { up: "kun", lo: "kan", cn: "师", en: "The Army", lean: "neutral", line: "This wants order, not a solo charge." },
  { up: "kan", lo: "kun", cn: "比", en: "Holding Together", lean: "favourable", line: "Alliance helps. Isolation makes it smaller." },
  { up: "xun", lo: "qian", cn: "小畜", en: "Small Taming", lean: "neutral", line: "A small restraint now saves a larger one later." },
  { up: "qian", lo: "dui", cn: "履", en: "Treading", lean: "caution", line: "Walk carefully where the ground is not yours." },
  { up: "kun", lo: "qian", cn: "泰", en: "Peace", lean: "favourable", line: "Heaven and earth are speaking. Do not rush the exchange." },
  { up: "qian", lo: "kun", cn: "否", en: "Standstill", lean: "wait", line: "The way is blocked. Pushing makes a scene, not a path." },
  { up: "qian", lo: "li", cn: "同人", en: "Fellowship", lean: "favourable", line: "The right company changes the question." },
  { up: "li", lo: "qian", cn: "大有", en: "Great Possession", lean: "favourable", line: "There is enough. Do not spend it to look certain." },
  { up: "kun", lo: "gen", cn: "谦", en: "Modesty", lean: "favourable", line: "A lower voice carries further here." },
  { up: "zhen", lo: "kun", cn: "豫", en: "Enthusiasm", lean: "favourable", line: "Energy is up. Point it, or it spills." },
  { up: "dui", lo: "zhen", cn: "随", en: "Following", lean: "neutral", line: "Follow what is sound. Not what is loud." },
  { up: "gen", lo: "xun", cn: "蛊", en: "Work on Decay", lean: "caution", line: "Something old needs repair before the new thing." },
  { up: "kun", lo: "dui", cn: "临", en: "Approach", lean: "favourable", line: "Come closer. The opening is real, and brief." },
  { up: "xun", lo: "kun", cn: "观", en: "Contemplation", lean: "neutral", line: "Look longer than you speak." },
  { up: "li", lo: "zhen", cn: "噬嗑", en: "Biting Through", lean: "caution", line: "An obstacle has to be named before it moves." },
  { up: "gen", lo: "li", cn: "贲", en: "Grace", lean: "neutral", line: "Form matters. It is not the substance." },
  { up: "gen", lo: "kun", cn: "剥", en: "Splitting Apart", lean: "wait", line: "What is peeling should not be varnished." },
  { up: "kun", lo: "zhen", cn: "复", en: "Return", lean: "favourable", line: "A turn back toward the start. Small, and timely." },
  { up: "qian", lo: "zhen", cn: "无妄", en: "Innocence", lean: "neutral", line: "Act plainly. A clever angle will show." },
  { up: "gen", lo: "qian", cn: "大畜", en: "Great Taming", lean: "neutral", line: "Hold the energy until it has a use." },
  { up: "gen", lo: "zhen", cn: "颐", en: "Nourishment", lean: "neutral", line: "What you take in will shape the answer." },
  { up: "dui", lo: "xun", cn: "大过", en: "Great Excess", lean: "caution", line: "The load is unusual. The ordinary pace will not hold it." },
  { up: "kan", lo: "kan", cn: "坎", en: "The Abyss", lean: "wait", line: "Danger repeats. Cross it once, honestly." },
  { up: "li", lo: "li", cn: "离", en: "Clarity", lean: "favourable", line: "See it, then decide. Brightness is not permission." },
  { up: "dui", lo: "gen", cn: "咸", en: "Influence", lean: "favourable", line: "Something is moving between you. Do not narrate it too fast." },
  { up: "zhen", lo: "xun", cn: "恒", en: "Duration", lean: "favourable", line: "What lasts is plainer than what excites." },
  { up: "qian", lo: "gen", cn: "遁", en: "Retreat", lean: "wait", line: "Stepping back is a move. It is not a loss yet." },
  { up: "zhen", lo: "qian", cn: "大壮", en: "Great Power", lean: "caution", line: "Strength is here. Using all of it would be crude." },
  { up: "li", lo: "kun", cn: "晋", en: "Progress", lean: "favourable", line: "Advance in the open. A side door is unnecessary." },
  { up: "kun", lo: "li", cn: "明夷", en: "Darkening", lean: "wait", line: "Keep the light low. This is not the hour to be seen." },
  { up: "xun", lo: "li", cn: "家人", en: "The Family", lean: "neutral", line: "The inner room matters more than the announcement." },
  { up: "li", lo: "dui", cn: "睽", en: "Opposition", lean: "caution", line: "You are not looking at the same thing. Say so." },
  { up: "kan", lo: "gen", cn: "蹇", en: "Obstruction", lean: "wait", line: "The block is outside you. Wait for a real opening." },
  { up: "zhen", lo: "kan", cn: "解", en: "Release", lean: "favourable", line: "The knot can loosen. Do not tie a new one." },
  { up: "gen", lo: "dui", cn: "损", en: "Decrease", lean: "neutral", line: "Give something up. The excess is the problem." },
  { up: "xun", lo: "zhen", cn: "益", en: "Increase", lean: "favourable", line: "A gain is available if you do not clutch it." },
  { up: "dui", lo: "qian", cn: "夬", en: "Breakthrough", lean: "caution", line: "Decide cleanly. A speech will not do it." },
  { up: "qian", lo: "xun", cn: "姤", en: "Coming to Meet", lean: "caution", line: "An encounter, not a plan. Notice who arrived." },
  { up: "dui", lo: "kun", cn: "萃", en: "Gathering", lean: "neutral", line: "People will collect around this. Be clear why." },
  { up: "kun", lo: "xun", cn: "升", en: "Pushing Upward", lean: "favourable", line: "Grow by steps. A leap would be theatre." },
  { up: "dui", lo: "kan", cn: "困", en: "Oppression", lean: "wait", line: "Words are cheap here. Keep the ones that are true." },
  { up: "kan", lo: "xun", cn: "井", en: "The Well", lean: "neutral", line: "The source is old and still good. Do not abandon it for novelty." },
  { up: "dui", lo: "li", cn: "革", en: "Revolution", lean: "favourable", line: "Change is due. Make it on purpose." },
  { up: "li", lo: "xun", cn: "鼎", en: "The Cauldron", lean: "favourable", line: "Something can be transformed if you tend the fire." },
  { up: "zhen", lo: "zhen", cn: "震", en: "Shock", lean: "caution", line: "A jolt. After it, return to what you were doing." },
  { up: "gen", lo: "gen", cn: "艮", en: "Keeping Still", lean: "wait", line: "Stop. The next move is not this one." },
  { up: "xun", lo: "gen", cn: "渐", en: "Gradual Progress", lean: "favourable", line: "Slow is the honest speed." },
  { up: "zhen", lo: "dui", cn: "归妹", en: "The Marrying Maiden", lean: "caution", line: "Desire is ahead of the arrangement." },
  { up: "zhen", lo: "li", cn: "丰", en: "Abundance", lean: "favourable", line: "A full hour. Do not pretend it is permanent." },
  { up: "li", lo: "gen", cn: "旅", en: "The Wanderer", lean: "neutral", line: "You are passing through. Travel light in the ask." },
  { up: "xun", lo: "xun", cn: "巽", en: "The Gentle", lean: "neutral", line: "A small influence, repeated, is the one that lands." },
  { up: "dui", lo: "dui", cn: "兑", en: "Joy", lean: "favourable", line: "Pleasure is allowed. It is not the strategy." },
  { up: "xun", lo: "kan", cn: "涣", en: "Dispersion", lean: "caution", line: "What was rigid can loosen. Let the fear go first." },
  { up: "kan", lo: "dui", cn: "节", en: "Limitation", lean: "neutral", line: "A boundary makes this possible." },
  { up: "xun", lo: "dui", cn: "中孚", en: "Inner Truth", lean: "favourable", line: "Sincerity will show. A performance will too." },
  { up: "zhen", lo: "gen", cn: "小过", en: "Small Excess", lean: "caution", line: "A little too much. Trim it before it becomes the story." },
  { up: "kan", lo: "li", cn: "既济", en: "After Completion", lean: "favourable", line: "It can close. Stay awake at the end." },
  { up: "li", lo: "kan", cn: "未济", en: "Before Completion", lean: "caution", line: "Not finished. The last step is the one people skip." },
];

const HEX: Hex[] = Array.from({ length: 64 });
{
  const seen = new Set<number>();
  for (const item of HEX_LIST) {
    const value = TRI_BIT[item.lo] | (TRI_BIT[item.up] << 3);
    if (seen.has(value)) throw new Error(`Duplicate I Ching figure: ${item.cn}`);
    seen.add(value);
    HEX[value] = item;
  }
  if (seen.size !== 64) throw new Error("I Ching table is short.");
}

export function castIChing(value: number): OracleLayer {
  const index = ((value % 64) + 64) % 64;
  const item = HEX[index];
  if (!item) throw new Error("I Ching cast missed the table.");
  const figure = Array.from({ length: 6 }, (_, line) => ((index >> line) & 1) === 1 ? "———" : "— —").join(" ");
  return {
    id: "iching",
    name: "I CHING",
    result: `${item.cn} · ${item.en}`,
    detail: `${TRI_NAME[item.up]} over ${TRI_NAME[item.lo]} · ${figure}`,
    line: item.line,
    lean: item.lean,
  };
}

export function drawIChing(rng: () => number): OracleLayer {
  // Three-coin method. Bottom line is the first roll.
  // 6 old yin 1/8, 7 young yang 3/8, 8 young yin 3/8, 9 old yang 1/8.
  const lines = Array.from({ length: 6 }, () => {
    const roll = rng();
    if (roll < 0.125) return { bit: 0, changing: true, value: 6 };
    if (roll < 0.5) return { bit: 1, changing: false, value: 7 };
    if (roll < 0.875) return { bit: 0, changing: false, value: 8 };
    return { bit: 1, changing: true, value: 9 };
  });
  const primary = lines.reduce((sum, line, index) => sum + (line.bit << index), 0);
  const relating = lines.reduce((sum, line, index) => sum + ((line.changing ? 1 - line.bit : line.bit) << index), 0);
  const main = castIChing(primary);
  const next = castIChing(relating);
  const moving = lines.flatMap((line, index) => (line.changing ? [index + 1] : []));
  const figure = lines.map((line) => (line.bit ? (line.changing ? "——— ○" : "———") : line.changing ? "— — ×" : "— —")).join(" ");
  const turn = moving.length
    ? `Changing ${moving.length === 1 ? "line" : "lines"} ${moving.join(", ")} move toward ${next.result}.`
    : "No changing line. The figure stays as cast.";
  return {
    id: "iching",
    name: "I CHING",
    result: main.result,
    detail: `${figure} · coins ${lines.map((line) => line.value).join("")}`,
    line: `${main.line} ${turn} ${moving.length ? next.line : ""}`.trim(),
    lean: main.lean,
  };
}

function officerOf(iso: string) {
  const pillar = dayPillar(iso);
  const index = (pillar.branch - solarBranch(iso) + 12) % 12;
  return OFFICERS[index] ?? OFFICERS[3]!;
}

export function tongShuLayer(iso: string, topic: OracleTopic, birth = ""): OracleLayer {
  const officer = officerOf(iso);
  const lean = officer.lean[topic];
  const pillar = dayPillar(iso);
  const animal = ANIMALS[pillar.branch] ?? "";
  const element = BRANCH_ELEMENT[pillar.branch] ?? "";
  let clash = "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(birth)) {
    const mine = ((lunarYear(birth) - 4) % 12 + 12) % 12;
    const name = ANIMALS[mine] ?? "";
    clash = (mine + 6) % 12 === pillar.branch ? ` · clash ${name}` : ` · no clash ${name}`;
  }
  return {
    id: "tongShu",
    name: "TONG SHU",
    result: leanLabel(lean),
    detail: `${formatOracleDate(iso)} · ${pillar.label} · ${animal} · ${element}${clash} · 宜 ${officer.yi} · 忌 ${officer.ji}`,
    line: officer.line,
    lean,
  };
}

function zodiacBranch(iso: string): number {
  return ((lunarYear(iso) - 4) % 12 + 12) % 12;
}

/** Chinese zodiac from the lunar year, not the Gregorian year. */
export function lunarZodiac(iso: string): string {
  return ANIMALS[zodiacBranch(iso)] ?? "";
}

function relationshipZodiac(birth: string, asOf: string, other = ""): OracleLayer {
  const birthBranch = zodiacBranch(birth);
  const animal = ANIMALS[birthBranch] ?? "Rat";
  if (other && /^\d{4}-\d{2}-\d{2}$/.test(other)) {
    const otherBranch = zodiacBranch(other);
    const otherAnimal = ANIMALS[otherBranch] ?? "Rat";
    const clash = (birthBranch + 6) % 12 === otherBranch;
    const he = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]].some(([a, b]) => (birthBranch === a && otherBranch === b) || (birthBranch === b && otherBranch === a));
    const lean: OracleLean = clash ? "caution" : he ? "favourable" : "neutral";
    const line = clash
      ? `${animal} and ${otherAnimal} clash. Friction is a theme, not a sentence on the two of you.`
      : he
        ? `${animal} and ${otherAnimal} sit in a classical harmony. Ease is not certainty.`
        : `${animal} and ${otherAnimal}. No clash and no classical pair. Context, not a verdict.`;
    return { id: "zodiac", name: "CHINESE ZODIAC", result: `${animal} · ${otherAnimal}`, detail: "Two birth years, lunar boundary applied", line, lean };
  }
  const yearBranch = zodiacBranch(asOf);
  const yearAnimal = ANIMALS[yearBranch] ?? "Rat";
  const clash = (birthBranch + 6) % 12 === yearBranch;
  const he = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]].some(([a, b]) => (birthBranch === a && yearBranch === b) || (birthBranch === b && yearBranch === a));
  let lean: OracleLean = "neutral";
  let line = `${animal}, in a ${yearAnimal} year. One birth chart — context, not a verdict on someone else.`;
  if (clash) {
    lean = "caution";
    line = `${animal} clashes with the ${yearAnimal} year. Friction is a theme, not a sentence.`;
  } else if (he) {
    lean = "favourable";
    line = `${animal} sits easily with the ${yearAnimal} year. Ease is not certainty.`;
  }
  return { id: "zodiac", name: "CHINESE ZODIAC", result: animal, detail: `${yearAnimal} year`, line, lean };
}

function numerologyFor(iso: string, birth?: string, scale: "day" | "month" | "year" = "day"): OracleLayer {
  if (birth && /^\d{4}-\d{2}-\d{2}$/.test(birth)) {
    if (scale === "year") return numberLayer("Personal Year", personalYear(birth, iso));
    if (scale === "month") return numberLayer("Personal Month", personalMonth(birth, iso));
    return numberLayer("Personal Day", personalDay(birth, iso));
  }
  return numberLayer(scale === "year" ? "Year" : "Date", dateNumber(scale === "year" ? `${iso.slice(0, 4)}-01-01` : iso));
}

function leanLabel(lean: OracleLean): string {
  if (lean === "favourable") return "Favourable";
  if (lean === "wait") return "Better to wait";
  if (lean === "caution") return "Caution";
  return "Neutral";
}

export function overallEnergy(leans: OracleLean[]): OracleEnergy {
  if (!leans.length) return "UNCLEAR";
  const fav = leans.filter((lean) => lean === "favourable").length;
  const wait = leans.filter((lean) => lean === "wait").length;
  const caution = leans.filter((lean) => lean === "caution").length;
  if (fav > 0 && wait > 0) return "MIXED";
  if (fav > 0 && caution > 0) return "FAVOURABLE WITH CAUTION";
  if (fav > 0) return "FAVOURABLE";
  if (wait > 0) return "BETTER TO WAIT";
  if (caution > 0) return "NEUTRAL";
  return "NEUTRAL";
}

function agreed(leans: OracleLean[]): boolean {
  const loud = leans.filter((lean) => lean !== "neutral");
  return loud.length >= 3 && loud.every((lean) => lean === loud[0]);
}

export function classifyQuestion(text: string, hint = ""): { questionType: string; topic: OracleTopic; guard: OracleGuard; mode: OracleMode } {
  const line = `${hint} ${text}`.toLowerCase();
  if (asksHarm(line)) {
    return { questionType: "harm", topic: "general", guard: "harm", mode: "read" };
  }
  if (/\b(cancer|tumou?r|diagnos\w*|disease|covid|stroke|heart attack|diabetes|hiv|infection|am i sick|do i have)\b/.test(line) && !/\bsick of\b/.test(line)) {
    return { questionType: "health", topic: "general", guard: "health", mode: "read" };
  }
  if (/\b(stock|shares?|crypto|bitcoin|ethereum|invest\w*|portfolio|forex|lottery|gambl\w*)\b/.test(line) || (/\b(double|profit)\b/.test(line) && /\b(definitely|guarantee|sure)\b/.test(line))) {
    return { questionType: "money_speculation", topic: "money", guard: "money", mode: "read" };
  }
  const dates = weekdayHits(text);
  const windowAsk = /\b(which day|which date|best day|what day|day next week|next week|pick a date)\b/.test(line);
  if (windowAsk || (dates.length >= 2 && /\b(better|which|or)\b/.test(line))) {
    const compareDates = dates.length >= 2 && !windowAsk;
    return { questionType: compareDates ? "compare_dates" : "date_pick", topic: topicOf(line), guard: "none", mode: compareDates ? "compare" : "dates" };
  }
  if (hint === "compare" || (/\bor\b/.test(line) && /\b(should|which|job|option|choice|stay|take)\b/.test(line))) {
    return { questionType: "compare", topic: topicOf(line), guard: "none", mode: "compare" };
  }
  const topic = topicOf(line);
  if (topic === "career" && /\b(tomorrow|today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|when|good time|good day)\b/.test(line)) {
    return { questionType: "career_timing", topic: /\b(sign|contract)\b/.test(line) ? "sign" : "career", guard: "none", mode: "read" };
  }
  if (topic === "travel" && /\b(weather|flight|visa|cost|price|route)\b/.test(line)) {
    return { questionType: "travel_practical", topic: "travel", guard: "none", mode: "read" };
  }
  return { questionType: topic === "general" ? "curiosity" : topic, topic, guard: "none", mode: "read" };
}

function asksHarm(line: string): boolean {
  if (/\b(suicide|suicidal|self-harm|self harm|kill myself|killing myself|end my life|take my life|hurt myself|harm myself|end it all|off myself)\b/.test(line)) return true;
  if (/\b(want to die|wanna die|going to die|good time to die|time to die|when (should|will|can|do) i die)\b/.test(line)) return true;
  if (/\b(pass away|passing away)\b/.test(line) && /\b(when|time|day|date|should|will)\b/.test(line)) return true;
  if (/\b(die|dying|death)\b/.test(line) && !/\bdying to\b/.test(line) && !/\bdeadline\b/.test(line)) return true;
  return false;
}

function topicOf(line: string): OracleTopic {
  if (/\b(sign|contract|agreement)\b/.test(line)) return "sign";
  if (/\b(travel|trip|fly|flight|holiday)\b/.test(line)) return "travel";
  if (/\b(family|parent|mum|mom|dad|kids|children)\b/.test(line)) return "family";
  if (/\b(relationship|dating|love|boyfriend|girlfriend|partner|crush|spouse)\b/.test(line)) return "love";
  if (/\b(money|salary|budget|pay|raise|bonus)\b/.test(line)) return "money";
  if (/\b(boss|promotion|job|career|work|interview|resign|launch|meeting)\b/.test(line)) return "career";
  return "general";
}

function weekdayHits(text: string): number[] {
  const found: number[] = [];
  for (const match of text.toLowerCase().matchAll(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/g)) {
    const index = WD_INDEX[match[1] ?? ""];
    if (index != null && !found.includes(index)) found.push(index);
  }
  return found;
}

function resolveDate(text: string, asOf: string): string | null {
  const lower = text.toLowerCase();
  if (/\btomorrow\b/.test(lower)) return addIsoDays(asOf, 1);
  if (/\btoday\b|\btonight\b/.test(lower)) return asOf;
  const named = weekdayHits(text);
  if (named.length === 1) return nextWeekday(asOf, named[0] ?? 0, /\bnext\b/.test(lower));
  const iso = /\b(20\d{2}-\d{2}-\d{2})\b/.exec(text);
  return iso?.[1] ?? null;
}

function nextWeekday(asOf: string, target: number, forceNext: boolean): string {
  const current = weekdayIndex(asOf);
  let delta = (target - current + 7) % 7;
  if (delta === 0) delta = 7;
  if (forceNext && delta <= 2) delta += 7;
  return addIsoDays(asOf, delta);
}

function attentionFor(topic: OracleTopic, energy: OracleEnergy): string[] {
  if (energy === "MIXED") return ["where the signs disagree", "your pace", "what you are trying to force"];
  if (topic === "career" || topic === "sign") return ["timing", "tone", "expectations"];
  if (topic === "love") return ["pace", "honesty", "what you already know"];
  if (topic === "travel") return ["the date", "the reason", "what Travel mode should check"];
  if (topic === "money") return ["the motive", "the timeline", "what is actually in your control"];
  if (topic === "family") return ["the room", "the hour", "how much you need to win"];
  return ["timing", "restraint", "the part you are skipping"];
}

function saysFor(reading: Pick<OracleReading, "guard" | "energy" | "topic" | "questionType" | "mode" | "layers" | "dates" | "synthesis" | "question">): string {
  if (reading.guard === "health") return "This needs a clinician, not a deck. I will not read an illness.";
  if (reading.guard === "harm") return "I will not name a time to die. If this is about you, talk to someone now: SOS 1767, or 988.";
  if (reading.guard === "money") return "Possible? Yes. Guaranteed profit? The crystal ball declined to become a broker.";
  if (reading.questionType === "travel_practical") return "The omen can talk about timing. Weather, flights, and visas belong to Travel.";
  if (/\b(like me|into me)\b/i.test(reading.question)) return "This can describe the weather between you. It cannot treat someone else's private feelings as a fact.";
  if (reading.mode === "dates" && reading.dates[0]) {
    return reading.dates[0].score > 0
      ? `${formatOracleDate(reading.dates[0].date)} looks the least resistant. Strongest is not the same as certain.`
      : `None of these is a clear yes. ${formatOracleDate(reading.dates[0].date)} is only the least resistant.`;
  }
  if (reading.mode === "compare" && reading.questionType === "compare_dates") return "Two dates, two moods. There is no winner, only a less awkward one.";
  if (reading.mode === "compare") return "One looks exciting. One looks sustainable. Those are not always the same thing.";
  if (reading.synthesis?.mixed) return "The signs are mixed. They are not going to pretend otherwise.";
  if (reading.mode === "daily") return "Today is for noticing, not for forcing a plot.";
  const tarot = reading.layers.find((layer) => layer.id === "tarot");
  if (agreed(reading.layers.map((layer) => layer.lean))) return "Three systems agree. That doesn’t happen often.";
  if (reading.energy === "FAVOURABLE" && (reading.topic === "career" || reading.topic === "sign")) return "The timing favours opening the conversation, not forcing the outcome.";
  if (reading.energy === "FAVOURABLE") return "The reading leans toward a yes, and away from a performance.";
  if (reading.energy === "FAVOURABLE WITH CAUTION") return "Good timing. Questionable expectations.";
  if (reading.energy === "MIXED") return "Not a no. More of a don’t rush because you’re impatient.";
  if (reading.energy === "BETTER TO WAIT") return tarot?.lean === "wait" ? "The signs would rather you wait than perform certainty." : "Better to wait. Impatience is not a strategy.";
  return "The signals are polite, not enthusiastic. You still decide.";
}

function expandFor(reading: OracleReading): string {
  if (reading.guard === "harm") return "A birth date does not answer this. The deck will not pick a day. If you might act on it, contact Samaritans of Singapore at 1767, or the 988 Suicide & Crisis Lifeline.";
  if (reading.guard !== "none") return "Divination is not evidence. It will not diagnose, and it will not price a market.";
  const bits = (reading.signals.length ? reading.signals.map((signal) => `${signal.name}: ${signal.signal}. ${signal.interpretation}`) : reading.layers.map((layer) => `${layer.name}: ${layer.result}. ${layer.line}`));
  const conflict = reading.synthesis?.conflict ? ` ${reading.synthesis.conflict}` : "";
  return `${bits.join(" ")}${conflict} The reading leans. It does not promise.`.slice(0, 700);
}

function cameoFor(topic: OracleTopic, layers: OracleLayer[]): string {
  if (topic !== "love") return "";
  const tarot = layers.find((layer) => layer.id === "tarot");
  if (tarot?.result === "The Lovers" || tarot?.result === "The Moon") return "月老 has opinions, apparently.";
  return "";
}

function tradeoff(layer: OracleLayer): string {
  if (layer.lean === "favourable") return "Movement, with the usual uncertainty.";
  if (layer.lean === "wait") return "Stability if you can stand still.";
  if (layer.lean === "caution") return "Interesting, and not especially smooth.";
  return "Little push either way.";
}

function dateWindow(asOf: string, days: number): string[] {
  const count = Math.max(3, Math.min(14, days));
  return Array.from({ length: count }, (_, index) => addIsoDays(asOf, index + 1));
}

const MONTHS: Record<string, number> = {
  january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3, april: 4, apr: 4, may: 5,
  june: 6, jun: 6, july: 7, jul: 7, august: 8, aug: 8, september: 9, sept: 9, sep: 9,
  october: 10, oct: 10, november: 11, nov: 11, december: 12, dec: 12,
};
const MONTH_RE = "january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sept|sep|oct|nov|dec";

function isoChecked(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${pad(month)}-${pad(day)}`;
}

function spanFrom(start: string | null, end: string | null): string[] | null {
  if (!start || !end || start > end) return null;
  const days: string[] = [];
  let cursor = start;
  for (let i = 0; i < 31 && cursor <= end; i += 1) {
    days.push(cursor);
    cursor = addIsoDays(cursor, 1);
  }
  return days.length >= 2 ? days : null;
}

function yearForEnd(asOf: string, month: number, day: number, explicit?: string): number {
  if (explicit && /^20\d{2}$/.test(explicit)) return Number(explicit);
  const year = Number(asOf.slice(0, 4));
  const end = isoChecked(year, month, day);
  return end && end < asOf ? year + 1 : year;
}

/** Inclusive calendar range named in the question, or null when none is named. */
export function dateSpan(text: string, asOf: string): string[] | null {
  const line = text.toLowerCase();
  const ord = "(?:st|nd|rd|th)?";
  const sameMonth = new RegExp(`(?:between|from)\\s+(\\d{1,2})${ord}\\s+(?:and|to)\\s+(\\d{1,2})${ord}\\s+(${MONTH_RE})\\s*(20\\d{2})?`);
  const hit = sameMonth.exec(line);
  if (hit) {
    const month = MONTHS[hit[3] ?? ""] ?? 0;
    const year = yearForEnd(asOf, month, Number(hit[2]), hit[4]);
    return spanFrom(isoChecked(year, month, Number(hit[1])), isoChecked(year, month, Number(hit[2])));
  }
  const cross = new RegExp(`(?:between|from)\\s+(\\d{1,2})${ord}\\s+(${MONTH_RE})\\s*(20\\d{2})?\\s+(?:and|to)\\s+(\\d{1,2})${ord}\\s+(${MONTH_RE})\\s*(20\\d{2})?`);
  const hit2 = cross.exec(line);
  if (hit2) {
    const m1 = MONTHS[hit2[2] ?? ""] ?? 0;
    const m2 = MONTHS[hit2[5] ?? ""] ?? 0;
    const y1 = hit2[3] ? Number(hit2[3]) : yearForEnd(asOf, m2, Number(hit2[4]), hit2[6]);
    const y2 = hit2[6] ? Number(hit2[6]) : m2 < m1 ? y1 + 1 : y1;
    return spanFrom(isoChecked(y1, m1, Number(hit2[1])), isoChecked(y2, m2, Number(hit2[4])));
  }
  const dashed = new RegExp(`\\b(\\d{1,2})${ord}\\s*[-–]\\s*(\\d{1,2})${ord}\\s+(${MONTH_RE})\\s*(20\\d{2})?`);
  const hit3 = dashed.exec(line);
  if (hit3) {
    const month = MONTHS[hit3[3] ?? ""] ?? 0;
    const year = yearForEnd(asOf, month, Number(hit3[2]), hit3[4]);
    return spanFrom(isoChecked(year, month, Number(hit3[1])), isoChecked(year, month, Number(hit3[2])));
  }
  return null;
}

const METHOD_CATALOG: { method: OracleMethodId; name: string; mark: string }[] = [
  { method: "tong_shu", name: "TONG SHU", mark: "通胜" },
  { method: "tarot", name: "TAROT", mark: "" },
  { method: "iching", name: "I CHING", mark: "易经" },
  { method: "numerology", name: "NUMEROLOGY", mark: "" },
  { method: "zodiac", name: "CHINESE ZODIAC", mark: "" },
  { method: "bazi", name: "BAZI", mark: "八字" },
  { method: "astrology", name: "ASTROLOGY", mark: "" },
];

const BLURB: Record<OracleMethodId, string> = {
  tong_shu: "Chinese almanac timing and auspiciousness.",
  tarot: "Symbolic card-based reflection.",
  numerology: "Date- and number-based timing patterns.",
  zodiac: "Zodiac relationships and timing context.",
  iching: "Hexagram-based guidance around change and direction.",
  bazi: "Personalised Five Elements analysis. Four pillars are not calculated.",
  astrology: "Planetary and transit analysis. No ephemeris is connected.",
};

export type OracleAvailability = {
  method: OracleMethodId;
  name: string;
  mark: string;
  blurb: string;
  status: "available" | "needs_info" | "not_connected";
  statusLabel: string;
};

/** What can be used before a question is asked. Not the same as relevance. */
export function oracleAvailability(birthDate = "", birthDateB = ""): OracleAvailability[] {
  const pair = /^\d{4}-\d{2}-\d{2}$/.test(birthDate) && /^\d{4}-\d{2}-\d{2}$/.test(birthDateB);
  return METHOD_CATALOG.map((item) => {
    if (item.method === "bazi" || item.method === "astrology") {
      return { ...item, blurb: BLURB[item.method], status: "not_connected", statusLabel: "Not connected" };
    }
    if (item.method === "zodiac" && !pair) {
      return { ...item, blurb: BLURB.zodiac, status: "needs_info", statusLabel: "Needs both dates of birth" };
    }
    return { ...item, blurb: BLURB[item.method], status: "available", statusLabel: "Available" };
  });
}

type OracleIntent = "guard" | "timing" | "decision" | "relationship" | "daily" | "compare" | "compare_dates" | "curiosity" | "travel_practical" | "forecast";

function asksTiming(line: string, questionType: string, mode: OracleMode): boolean {
  if (questionType === "date_pick" || questionType === "career_timing" || questionType === "compare_dates" || mode === "dates") return true;
  return /\b(tomorrow|today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|good time|good day|best day|which day|which date|what day|auspicious|when should|when is|when do i|when to|what date|pick a date|timing)\b/.test(line);
}

function asksWindow(line: string, questionType: string, mode: OracleMode): boolean {
  if (mode === "dates" || questionType === "date_pick" || questionType === "compare_dates") return true;
  return /\b(which day|which date|best day|what day|pick a date|next week|day next week)\b/.test(line);
}

function asksRelationship(line: string, topic: OracleTopic): boolean {
  if (topic === "love") return true;
  return /\b(compatib\w*|soulmate|between us|chemistry|like me|into me)\b/.test(line);
}

function asksDecision(line: string, topic: OracleTopic, mode: OracleMode, questionType: string): boolean {
  if (mode === "compare" || questionType === "compare") return true;
  if (/\b(should|accept|change|decide|decision|quit|resign|stay or|leave|take the|take this)\b/.test(line)) return true;
  return topic === "career" || topic === "sign" || topic === "money";
}

function intentFor(line: string, classified: { questionType: string; topic: OracleTopic; guard: OracleGuard; mode: OracleMode }, mode: OracleInput["mode"]): OracleIntent {
  if (classified.guard !== "none") return "guard";
  if (mode === "daily" || classified.questionType === "daily") return "daily";
  if (classified.questionType === "compare_dates") return "compare_dates";
  if (classified.questionType === "travel_practical") return "travel_practical";
  if (classified.mode === "dates" || classified.questionType === "date_pick" || mode === "dates") return "timing";
  const relationship = asksRelationship(line, classified.topic);
  const timing = asksTiming(line, classified.questionType, classified.mode);
  if (relationship && !timing) return "relationship";
  if (timing) return "timing";
  if (classified.mode === "compare" || classified.questionType === "compare") return "compare";
  if (asksDecision(line, classified.topic, classified.mode, classified.questionType)) return "decision";
  if (relationship) return "relationship";
  return "curiosity";
}

function choiceFor(method: OracleMethodId, facts: { intent: OracleIntent; window: boolean; relationship: boolean; hasBirth: boolean; hasPair: boolean }): { selected: boolean; status: OracleMethodStatus; reason: string } {
  if (method === "astrology") return { selected: false, status: "not_connected", reason: "Astrology is not connected. Planetary positions are not calculated." };
  if (method === "bazi") return { selected: false, status: "not_connected", reason: "BaZi is not connected. Four pillars are not calculated." };
  if (facts.intent === "guard" || facts.intent === "travel_practical") {
    return { selected: false, status: "not_relevant", reason: "This question is not one for divination." };
  }
  const timing = facts.intent === "timing" || facts.intent === "compare_dates" || facts.intent === "daily";
  const decision = facts.intent === "decision" || facts.intent === "compare";
  const numberReason = facts.window
    ? "Chosen to compare the numerical character of the candidate dates."
    : facts.hasBirth
      ? "Chosen to add your current personal timing cycle to the reading."
      : facts.intent === "timing"
        ? "Chosen to read the numerical character of the date."
        : "Chosen to add the numerical character of the day you asked.";

  if (method === "tong_shu") {
    if (timing) {
      return {
        selected: true,
        status: "selected",
        reason: facts.window ? "Chosen because your question is about choosing an auspicious time." : "Chosen because you're asking about auspicious timing.",
      };
    }
    return { selected: false, status: "not_relevant", reason: "This question is not primarily about date or timing." };
  }
  if (method === "tarot") {
    if (facts.intent === "relationship") return { selected: true, status: "selected", reason: "Chosen to explore the emotional dynamics and underlying tensions." };
    if (decision) return { selected: true, status: "selected", reason: "Chosen to explore the underlying dynamics, opportunities and cautions around the decision." };
    if (facts.intent === "daily") return { selected: true, status: "selected", reason: "Chosen for the mood of the day, not a verdict." };
    if ((facts.intent === "timing" || facts.intent === "compare_dates") && !facts.window) {
      return { selected: true, status: "selected", reason: "Chosen to explore the underlying dynamics, opportunities and cautions around the decision." };
    }
    if (facts.intent === "curiosity") return { selected: true, status: "selected", reason: "The question is open, so a card can name the atmosphere." };
    return { selected: false, status: "not_relevant", reason: "The days are being compared by timing. A card is not part of that comparison." };
  }
  if (method === "iching") {
    if (facts.intent === "timing" || facts.intent === "compare_dates") return { selected: true, status: "selected", reason: "Chosen for guidance around initiation, change and direction." };
    if (facts.intent === "daily") return { selected: false, status: "not_relevant", reason: "A daily note stays with the almanac, the card, and the number." };
    if (decision) return { selected: true, status: "selected", reason: "Chosen for understanding change, direction and how the situation may develop." };
    if (facts.intent === "curiosity") return { selected: true, status: "selected", reason: "A hexagram for the shape of what you're asking." };
    return { selected: false, status: "not_relevant", reason: "This question is about the relationship, not a change of course." };
  }
  if (method === "numerology") {
    if (facts.intent === "relationship") return { selected: false, status: "not_relevant", reason: "A number is not what this question is asking." };
    if (facts.intent === "compare") {
      return {
        selected: true,
        status: "selected",
        reason: facts.hasBirth
          ? "Each choice has a name number, read beside your personal timing cycle."
          : "Each choice has a name number, set beside the numerical character of the day.",
      };
    }
    if (timing || decision || facts.intent === "curiosity") return { selected: true, status: "selected", reason: numberReason };
    return { selected: false, status: "not_relevant", reason: "A number is not what this question is asking." };
  }
  if (!facts.relationship) return { selected: false, status: "not_relevant", reason: "This question is not about compatibility." };
  if (!facts.hasPair) return { selected: false, status: "needs_info", reason: "Needs both dates of birth." };
  return { selected: true, status: "selected", reason: "Chosen for compatibility between the two birth dates." };
}

export function selectMethods(input: OracleInput): OracleMethodChoice[] {
  const mode = input.mode ?? "ask";
  const question = (input.question ?? "").trim() || (mode === "daily" ? "What is the energy of today?" : "");
  const hint = mode === "compare" ? "compare" : mode === "dates" ? "which day" : mode === "daily" ? "today" : input.hint ?? "";
  const classified = classifyQuestion(question, hint);
  const line = `${hint} ${question}`.toLowerCase();
  const intent = intentFor(line, classified, mode);
  const facts = {
    intent,
    window: asksWindow(line, classified.questionType, classified.mode) || mode === "dates" || intent === "compare_dates",
    relationship: asksRelationship(line, classified.topic),
    hasBirth: /^\d{4}-\d{2}-\d{2}$/.test(input.birthDate ?? ""),
    hasPair: /^\d{4}-\d{2}-\d{2}$/.test(input.birthDate ?? "") && /^\d{4}-\d{2}-\d{2}$/.test(input.birthDateB ?? ""),
  };
  const auto = METHOD_CATALOG.map((item) => {
    const choice = choiceFor(item.method, facts);
    return { method: item.method, name: item.name, mark: item.mark, selected: choice.selected, status: choice.status, reason: choice.reason, relevance: choice.selected ? 70 : 15 };
  });
  const contract = parseQuestionContract(question, hint, mode);
  const ranked = contract.useMatrix && intent !== "guard" && intent !== "travel_practical"
    ? METHOD_CATALOG.map((item) => {
        const row = methodMatrix(contract, facts.hasBirth).find((entry) => entry.method === item.method);
        return {
          method: item.method,
          name: item.name,
          mark: item.mark,
          selected: row?.selected ?? false,
          status: row?.status ?? "not_relevant",
          reason: row?.reason ?? "Not used for this question.",
          relevance: row?.relevance ?? 0,
        };
      })
    : auto;
  if (!input.include || intent === "guard" || intent === "travel_practical") return ranked;
  const wanted = new Set(input.include);
  return ranked.map((item) => {
    if (item.status === "not_connected" || item.status === "needs_info") return { ...item, selected: false };
    if (wanted.has(item.method)) {
      return { ...item, selected: true, status: "selected" as const, reason: item.selected ? item.reason : "You included this method for this reading." };
    }
    if (item.selected) return { ...item, selected: false, status: "not_relevant" as const, reason: "You left this method out." };
    return item;
  });
}

function picked(methods: OracleMethodChoice[], method: OracleMethodId): boolean {
  return methods.some((item) => item.method === method && item.selected);
}

const LAYER_METHOD: Record<OracleLayer["id"], OracleMethodId> = {
  tongShu: "tong_shu",
  tarot: "tarot",
  iching: "iching",
  numerology: "numerology",
  zodiac: "zodiac",
  bazi: "bazi",
};

const BAND_LABEL: Record<OracleBand, string> = {
  大吉: "Very favourable",
  吉: "Favourable",
  中吉: "Leaning favourable",
  中: "Mixed",
  中凶: "Leaning unfavourable",
  凶: "Unfavourable",
};

function methodWeight(method: OracleMethodId, intent: OracleIntent): number {
  // Timing: Tong Shu 1, numerology 0.62, I Ching 0.55, tarot 0.34.
  // Relationship: tarot 1, zodiac 0.78.
  // Decision or compare: I Ching 1, tarot 0.92, numerology 0.42, Tong Shu 0.7 if it was selected.
  // Daily: Tong Shu 0.9, tarot 0.7, numerology 0.55.
  // Curiosity: tarot 0.7, I Ching 0.7, numerology 0.45.
  // Anything else that still ran: 0.4.
  if (intent === "timing" || intent === "compare_dates") {
    if (method === "tong_shu") return 1;
    if (method === "numerology") return 0.62;
    if (method === "iching") return 0.55;
    if (method === "tarot") return 0.34;
  }
  if (intent === "relationship") {
    if (method === "tarot") return 1;
    if (method === "zodiac") return 0.78;
  }
  if (intent === "decision" || intent === "compare") {
    if (method === "iching") return 1;
    if (method === "tarot") return 0.92;
    if (method === "numerology") return 0.42;
    if (method === "tong_shu") return 0.7;
  }
  if (intent === "daily") {
    if (method === "tong_shu") return 0.9;
    if (method === "tarot") return 0.7;
    if (method === "numerology") return 0.55;
  }
  if (intent === "curiosity") {
    if (method === "tarot") return 0.7;
    if (method === "iching") return 0.7;
    if (method === "numerology") return 0.45;
  }
  if (intent === "forecast") {
    if (method === "numerology") return 1;
    if (method === "iching") return 0.55;
    if (method === "tarot") return 0.4;
  }
  return 0.4;
}

function directionOf(lean: OracleLean): -1 | 0 | 1 {
  if (lean === "favourable") return 1;
  if (lean === "neutral") return 0;
  return -1;
}

function strengthOf(lean: OracleLean): number {
  if (lean === "favourable" || lean === "wait") return 0.82;
  if (lean === "caution") return 0.64;
  return 0.4;
}

/**
 * Internal blend, not shown as a number.
 * score = Σ(direction × strength × weight) / Σ(strength × weight), from -1 to 1.
 * 大吉 ≥ 0.66, 吉 ≥ 0.33, 中吉 ≥ 0.12, 中 > -0.12, 中凶 > -0.33, else 凶.
 * 宜/忌 is separate: Tong Shu's topic lean is the action, when that method was used.
 */
export function bandFromScore(score: number): OracleBand {
  if (score >= 0.66) return "大吉";
  if (score >= 0.33) return "吉";
  if (score >= 0.12) return "中吉";
  if (score > -0.12) return "中";
  if (score > -0.33) return "中凶";
  return "凶";
}

function intentOfReading(reading: { guard: OracleGuard; mode: OracleMode; questionType: string; topic: OracleTopic }): OracleIntent {
  if (reading.guard !== "none") return "guard";
  if (reading.mode === "daily" || reading.questionType === "daily") return "daily";
  if (reading.questionType === "compare_dates") return "compare_dates";
  if (reading.questionType === "travel_practical") return "travel_practical";
  if (reading.questionType === "when" || reading.questionType === "how") return "forecast";
  if (reading.mode === "dates" || reading.questionType === "date_pick" || reading.questionType === "career_timing") return "timing";
  if (reading.mode === "compare" || reading.questionType === "compare") return "compare";
  if (reading.topic === "love" || reading.questionType === "love") return "relationship";
  if (reading.questionType === "career" || reading.questionType === "sign" || reading.questionType === "money" || reading.questionType === "family") return "decision";
  return "curiosity";
}

function signalFrom(layer: OracleLayer, intent: OracleIntent, reason: string): OracleSignal {
  const method = LAYER_METHOD[layer.id];
  const strength = strengthOf(layer.lean);
  const weight = methodWeight(method, intent);
  return {
    method,
    name: layer.name,
    mark: method === "tong_shu" ? "通胜" : method === "iching" ? "易经" : method === "bazi" ? "八字" : "",
    direction: directionOf(layer.lean),
    strength,
    applicability: weight,
    weight,
    signal: layer.lean === "favourable" ? "吉" : layer.lean === "neutral" ? "中" : "忌",
    strengthLabel: strength >= 0.75 ? "Strong" : strength >= 0.5 ? "Moderate" : "Light",
    raw: `${layer.result} · ${layer.detail}`,
    interpretation: layer.line,
    whyItMatters: reason,
  };
}

function actionFrom(layers: OracleLayer[], score: number): { action: "宜" | "忌" | "平"; actionLabel: string } {
  const tong = layers.find((layer) => layer.id === "tongShu");
  if (tong) {
    if (tong.lean === "favourable") return { action: "宜", actionLabel: "Suitable for this action" };
    if (tong.lean === "wait") return { action: "忌", actionLabel: "Unsuitable to force this action" };
    if (tong.lean === "caution") return { action: "平", actionLabel: "Proceed, with restraint" };
    return { action: "平", actionLabel: "Neither pushed nor blocked" };
  }
  if (score >= 0.33) return { action: "宜", actionLabel: "The signs lean toward moving" };
  if (score >= 0.12) return { action: "宜", actionLabel: "Proceed, with restraint" };
  if (score <= -0.12) return { action: "忌", actionLabel: "Better to hold" };
  return { action: "平", actionLabel: "Neither a clear yes nor a clear no" };
}

function takeaway(topic: OracleTopic, action: "宜" | "忌" | "平"): { goodFor: string[]; lessFor: string[] } {
  if (action === "忌") {
    return {
      goodFor: ["waiting", "preparing what you want to say", "a smaller question"],
      lessFor: ["pushing the action through", "treating the sign as a guarantee"],
    };
  }
  if (action === "平") {
    return {
      goodFor: ["a small, reversible step", "asking rather than announcing"],
      lessFor: ["an ultimatum", "demanding an answer on the spot"],
    };
  }
  if (topic === "love") {
    return {
      goodFor: ["an honest conversation", "saying what you already know"],
      lessFor: ["an ultimatum", "demanding a label on the spot"],
    };
  }
  if (topic === "career" || topic === "sign") {
    return {
      goodFor: ["opening the conversation", "asking a clear question", "stating interest without a demand"],
      lessFor: ["an ultimatum", "forcing an answer on the spot"],
    };
  }
  if (topic === "travel") {
    return {
      goodFor: ["checking the practical details", "leaving slack in the plan"],
      lessFor: ["treating the sign as a booking", "ignoring weather, visas, or cost"],
    };
  }
  return {
    goodFor: ["a clear, modest step", "saying the thing once"],
    lessFor: ["forcing a finish", "treating the sign as a guarantee"],
  };
}

function blend(signals: OracleSignal[], layers: OracleLayer[], topic: OracleTopic): OracleSynthesis {
  let num = 0;
  let den = 0;
  for (const signal of signals) {
    const mass = signal.strength * signal.weight;
    num += signal.direction * mass;
    den += mass;
  }
  const score = den ? num / den : 0;
  const band = signals.length ? bandFromScore(score) : "中";
  const supportive = signals.filter((signal) => signal.direction > 0).length;
  const neutral = signals.filter((signal) => signal.direction === 0).length;
  const cautionary = signals.filter((signal) => signal.direction < 0).length;
  const mixed = supportive > 0 && cautionary > 0;
  const agreement = mixed && supportive === cautionary ? "SPLIT" : mixed ? "MIXED" : supportive >= 2 && cautionary === 0 ? "STRONG" : "LEANING";
  const up = signals.filter((signal) => signal.direction > 0).map((signal) => signal.name);
  const down = signals.filter((signal) => signal.direction < 0).map((signal) => signal.name);
  const conflict = mixed ? `${up.join(", ")} lean supportive. ${down.join(", ")} lean cautionary. The reading will not pretend they agree.` : "";
  const action = actionFrom(layers, score);
  const words = takeaway(topic, action.action);
  const tong = layers.some((layer) => layer.id === "tongShu");
  return {
    band,
    bandLabel: BAND_LABEL[band],
    ...action,
    agreement,
    supportive,
    neutral,
    cautionary,
    conflict,
    mixed,
    goodFor: words.goodFor,
    lessFor: words.lessFor,
    note: tong
      ? "Suitability is the almanac's reading of this kind of action. Hours of the day are not calculated."
      : "No almanac day was read, so this is not a timing instruction.",
  };
}

function scoreDate(iso: string, topic: OracleTopic, birth: string, methods: OracleMethodChoice[]): OracleDatePick {
  const layers: OracleLayer[] = [];
  if (picked(methods, "tong_shu")) layers.push(tongShuLayer(iso, topic, birth));
  if (picked(methods, "numerology")) layers.push(numerologyFor(iso, birth));
  const score = layers.reduce((sum, layer) => sum + (layer.lean === "favourable" ? 3 : layer.lean === "neutral" ? 1 : layer.lean === "caution" ? 0 : -2), 0);
  const signals = layers.map((layer) => signalFrom(layer, "timing", ""));
  const verdict = blend(signals, layers, topic);
  return { date: iso, label: formatOracleDate(iso), energy: overallEnergy(layers.map((layer) => layer.lean)), score, band: verdict.band, action: verdict.action, actionLabel: verdict.actionLabel, layers };
}

function readLayers(iso: string, topic: OracleTopic, rng: () => number, birth: string, other: string, asOf: string, methods: OracleMethodChoice[], scale: "day" | "month" | "year" = "day", contract: QuestionContract | null = null): OracleLayer[] {
  const layers: OracleLayer[] = [];
  if (picked(methods, "tong_shu")) layers.push(tongShuLayer(iso, topic, birth));
  if (picked(methods, "tarot")) layers.push(drawTarot(rng));
  if (picked(methods, "iching")) layers.push(drawIChing(rng));
  if (picked(methods, "numerology")) {
    layers.push(contract?.useMatrix && contract.answerShape === "timeframe" && birth ? forecastLayer(birth, asOf, contract.cycleTarget) : numerologyFor(iso, birth, scale));
  }
  if (picked(methods, "zodiac") && birth) layers.push(relationshipZodiac(birth, asOf, other));
  return layers.map((layer) => contextualise(layer, contract));
}

export function cycleYears(birth: string, asOf: string, target: number): { year: number | null; building: number | null; next: number | null } {
  const start = Number(asOf.slice(0, 4));
  const hits: number[] = [];
  const builds: number[] = [];
  for (let year = start; year <= start + 18; year += 1) {
    const value = personalYear(birth, `${year}-06-01`);
    if (value === target) hits.push(year);
    if (value === 4) builds.push(year);
  }
  const year = hits[0] ?? null;
  return { year, building: builds.find((item) => year == null || item < year) ?? null, next: hits[1] ?? null };
}

function forecastLayer(birth: string, asOf: string, target: number): OracleLayer {
  const current = personalYear(birth, asOf);
  const found = cycleYears(birth, asOf, target);
  const base = numberLayer("Personal Year", current);
  return {
    ...base,
    detail: found.year ? `Personal year ${target} falls in ${found.year}` : `No personal-year ${target} inside 18 years`,
    line: `${base.line} The scale is the year, not the personal day.`,
  };
}

function contextualise(layer: OracleLayer, contract: QuestionContract | null): OracleLayer {
  if (!contract?.useMatrix) return layer;
  if (layer.id === "tarot") return { ...layer, line: `${layer.line} On this question the card names what helps or delays. It does not name the year.` };
  if (layer.id === "iching") {
    const about = contract.domain === "wealth" ? "wealth" : contract.domain === "marriage" ? "marriage" : contract.domain === "business" ? "the business" : "this question";
    return { ...layer, line: `${layer.line} For ${about}, read it as conditions, not as a calendar.` };
  }
  return layer;
}

function domainTopic(domain: QuestionContract["domain"]): OracleTopic {
  if (domain === "wealth") return "money";
  if (domain === "marriage" || domain === "love" || domain === "relationship") return "love";
  if (domain === "career" || domain === "work" || domain === "business") return "career";
  if (domain === "family") return "family";
  if (domain === "travel") return "travel";
  return "general";
}

function readingId(rng: () => number): string {
  return `oracle-${Date.now().toString(36)}-${Math.floor(rng() * 1e9).toString(36)}`;
}

function energyFromBand(band: OracleBand): OracleEnergy {
  if (band === "大吉" || band === "吉") return "FAVOURABLE";
  if (band === "中吉") return "FAVOURABLE WITH CAUTION";
  if (band === "中") return "MIXED";
  return "BETTER TO WAIT";
}

function emptyReading(partial: Omit<OracleReading, "says" | "attention" | "expand" | "cameo" | "signals" | "synthesis" | "scanned"> & { says?: string; scanned?: string }): OracleReading {
  const reading: OracleReading = {
    ...partial,
    says: partial.says ?? "",
    attention: attentionFor(partial.topic, partial.energy),
    expand: "",
    cameo: "",
    signals: [],
    synthesis: null,
    scanned: partial.scanned ?? "",
  };
  const intent = intentOfReading(reading);
  const focus = reading.dates[0] ? [...reading.dates[0].layers, ...reading.layers.filter((layer) => !reading.dates[0]?.layers.some((item) => item.id === layer.id))] : reading.layers;
  const signals = focus.map((layer) => signalFrom(layer, intent, reading.methods.find((item) => item.method === LAYER_METHOD[layer.id])?.reason ?? ""));
  reading.signals = signals;
  if (reading.guard === "none" && signals.length) {
    reading.synthesis = blend(signals, focus, reading.topic);
    if (reading.mode === "compare" && reading.sides.length === 2) {
      const words = takeaway(reading.topic, "平");
      reading.synthesis.band = "中";
      reading.synthesis.bandLabel = BAND_LABEL["中"];
      reading.synthesis.action = "平";
      reading.synthesis.actionLabel = "No winner was assigned";
      reading.synthesis.goodFor = words.goodFor;
      reading.synthesis.lessFor = ["treating either choice as the winner", ...words.lessFor];
      reading.synthesis.mixed = reading.sides[0]?.energy !== reading.sides[1]?.energy || reading.synthesis.mixed;
      reading.synthesis.agreement = reading.sides[0]?.energy !== reading.sides[1]?.energy ? "MIXED" : reading.synthesis.agreement;
      if (reading.sides[0]?.energy !== reading.sides[1]?.energy) reading.synthesis.conflict = "The two choices do not share a single result. Neither is crowned.";
      reading.energy = "MIXED";
    } else {
      reading.energy = energyFromBand(reading.synthesis.band);
    }
  }
  reading.attention = reading.guard === "harm" ? ["someone you can call", "getting through today", "not treating this as an omen"] : attentionFor(reading.topic, reading.energy);
  reading.cameo = cameoFor(reading.topic, reading.layers);
  reading.says = saysFor(reading);
  reading.expand = expandFor(reading);
  return reading;
}

export function plannedSteps(input: OracleInput): string[] {
  const methods = selectMethods(input);
  if (methods.every((item) => !item.selected)) return ["Understanding your question…"];
  const steps = ["Understanding your question…", "Selecting the signs…"];
  if (methods.some((item) => item.selected && item.method === "tarot")) steps.push("Drawing the cards…");
  if (methods.some((item) => item.selected && item.method === "iching")) steps.push("Casting the hexagram…");
  if (methods.some((item) => item.selected && item.method === "tong_shu")) steps.push("Checking the timing…");
  return steps;
}

function usedLine(methods: OracleMethodChoice[]): string {
  const names = methods.filter((item) => item.selected).map((item) => item.name);
  if (!names.length) return "No divination method was used.";
  return `${names.join(", ")}.`;
}

export function buildOracle(input: OracleInput): OracleReading {
  const asOf = input.asOf && /^\d{4}-\d{2}-\d{2}$/.test(input.asOf) ? input.asOf : todayIso();
  const rng = input.rng ?? randomUnit;
  const mode = input.mode ?? "ask";
  const question = (input.question ?? "").trim() || (mode === "daily" ? "What is the energy of today?" : "");
  const hint = mode === "compare" ? "compare" : mode === "dates" ? "which day" : mode === "daily" ? "today" : input.hint ?? "";
  const classified = classifyQuestion(question, hint);
  const birth = input.birthDate && /^\d{4}-\d{2}-\d{2}$/.test(input.birthDate) ? input.birthDate : "";
  const other = input.birthDateB && /^\d{4}-\d{2}-\d{2}$/.test(input.birthDateB) ? input.birthDateB : "";
  const methods = selectMethods({ ...input, question, mode, hint: input.hint, birthDate: birth });
  const steps = plannedSteps({ ...input, question, mode, birthDate: birth });
  const used = usedLine(methods);

  if (classified.guard !== "none") {
    return emptyReading({
      id: readingId(rng),
      question,
      questionType: classified.questionType,
      topic: classified.topic,
      guard: classified.guard,
      mode: "read",
      energy: "UNCLEAR",
      layers: [],
      sides: [],
      dates: [],
      steps,
      used,
      methods,
      bazi: null,
    });
  }

  if (mode === "daily" || classified.questionType === "daily") {
    const layers = readLayers(asOf, "general", rng, birth, other, asOf, methods);
    return emptyReading({
      id: readingId(rng),
      question,
      questionType: "daily",
      topic: "general",
      guard: "none",
      mode: "daily",
      energy: overallEnergy(layers.map((layer) => layer.lean)),
      layers,
      sides: [],
      dates: [],
      steps,
      used,
      methods,
      bazi: null,
    });
  }

  if (classified.mode === "dates" || mode === "dates") {
    const named = dateSpan(question, asOf);
    const days = named ?? dateWindow(asOf, input.windowDays ?? 7);
    const ranked = days.map((iso) => scoreDate(iso, classified.topic, birth, methods)).sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));
    const top = ranked.slice(0, 3);
    const layers = readLayers(asOf, classified.topic, rng, birth, other, asOf, methods).filter((layer) => layer.id !== "tongShu" && layer.id !== "numerology");
    const scanned = named
      ? `Compared ${days.length} days, ${formatOracleDate(days[0] ?? asOf)} to ${formatOracleDate(days[days.length - 1] ?? asOf)}.`
      : `Compared the next ${days.length} days.`;
    return emptyReading({
      id: readingId(rng),
      question,
      questionType: "date_pick",
      topic: classified.topic,
      guard: "none",
      mode: "dates",
      energy: top[0]?.energy ?? "UNCLEAR",
      layers,
      sides: [],
      dates: top,
      steps,
      used,
      methods,
      scanned,
      bazi: null,
    });
  }

  if (classified.mode === "compare" || mode === "compare") {
    const weekdays = weekdayHits(`${input.optionA ?? ""} ${input.optionB ?? ""} ${question}`);
    if (weekdays.length >= 2 && !input.optionA && !input.optionB) {
      const dates = weekdays.slice(0, 2).map((wd) => nextWeekday(asOf, wd, false));
      const sides = dates.map((iso) => {
        const layers = scoreDate(iso, classified.topic, birth, methods).layers;
        return { label: formatOracleDate(iso), energy: overallEnergy(layers.map((layer) => layer.lean)), layers, tradeoff: layers[0]?.line ?? "" };
      });
      const layers = readLayers(asOf, classified.topic, rng, birth, other, asOf, methods).filter((layer) => layer.id !== "tongShu" && layer.id !== "numerology");
      return emptyReading({
        id: readingId(rng),
        question,
        questionType: "compare_dates",
        topic: classified.topic,
        guard: "none",
        mode: "compare",
        energy: sides[0]?.energy === sides[1]?.energy ? sides[0]?.energy ?? "NEUTRAL" : "MIXED",
        layers,
        sides,
        dates: [],
        steps,
        used,
        methods,
        bazi: null,
      });
    }
    const split = splitOptions(question);
    const left = (input.optionA || split?.[0] || "Option A").trim();
    const right = (input.optionB || split?.[1] || "Option B").trim();
    const sharedDate = resolveDate(question, asOf) ?? asOf;
    const sharedRest: OracleLayer[] = [];
    if (picked(methods, "tong_shu")) sharedRest.push(tongShuLayer(sharedDate, classified.topic, birth));
    if (picked(methods, "numerology")) sharedRest.push(numerologyFor(sharedDate, birth));
    const sharedSigns: OracleLayer[] = [];
    if (picked(methods, "iching")) sharedSigns.push(drawIChing(rng));
    if (picked(methods, "zodiac") && birth) sharedSigns.push(relationshipZodiac(birth, asOf, other));
    const make = (label: string): OracleSide => {
      const layers = [...sharedRest.map((layer) => ({ ...layer }))];
      if (picked(methods, "tarot")) layers.push(drawTarot(rng));
      if (picked(methods, "numerology")) layers.push(numberLayer("Name", nameNumber(label)));
      const own = layers.filter((layer) => layer.result.startsWith("Name") || layer.id === "tarot");
      const focus = own.length ? own : layers;
      const lead = layers.find((layer) => layer.id === "tarot") ?? layers[0];
      return { label, energy: overallEnergy(focus.map((layer) => layer.lean)), layers, tradeoff: lead ? tradeoff(lead) : "Little push either way." };
    };
    const sides = [make(left), make(right)];
    return emptyReading({
      id: readingId(rng),
      question: question || `${left} or ${right}?`,
      questionType: "compare",
      topic: classified.topic,
      guard: "none",
      mode: "compare",
      energy: sides[0]?.energy === sides[1]?.energy ? sides[0]?.energy ?? "NEUTRAL" : "MIXED",
      layers: sharedSigns,
      sides,
      dates: [],
      steps,
      used,
      methods,
      bazi: null,
    });
  }

  const when = mentionedDay(question, asOf) ?? resolveDate(question, asOf) ?? asOf;
  const contract = parseQuestionContract(question, hint, mode);
  const scale = contract.useMatrix ? (contract.timeHorizon === "month" ? "month" : "year") : "day";
  const readOn = contract.useMatrix && contract.timeHorizon === "year" && /\bnext year\b/i.test(question)
    ? `${Number(asOf.slice(0, 4)) + 1}-01-01`
    : when;
  const topic = contract.useMatrix ? domainTopic(contract.domain) : classified.topic;
  const layers = readLayers(readOn, topic, rng, birth, other, asOf, methods, scale, contract.useMatrix ? contract : null);
  return publish(emptyReading({
    id: readingId(rng),
    question,
    questionType: contract.useMatrix ? contract.questionType.toLowerCase() : classified.questionType,
    topic,
    guard: "none",
    mode: "read",
    energy: overallEnergy(layers.map((layer) => layer.lean)),
    layers,
    sides: [],
    dates: [],
    steps,
    used,
    methods,
    scanned: readOn === asOf ? "" : `Read for ${formatOracleDate(readOn)}.`,
    bazi: null,
  }), contract, birth, asOf);
}

function publish(reading: OracleReading, contract: QuestionContract, birth: string, asOf: string): OracleReading {
  reading.contract = contract;
  if (reading.guard === "none" && contract.contextFacts.length && !reading.expand.includes("Context kept")) {
    reading.expand = `${reading.expand} Context kept: ${contract.contextFacts.join("; ")}.`.trim();
  }
  if (reading.guard !== "none" || !contract.useMatrix) {
    reading.validation = { ok: true, reason: reading.guard !== "none" ? "guard" : "existing shape" };
    return reading;
  }
  const shaped = shapeForecast(contract, reading, birth, asOf);
  reading.says = shaped.direct;
  reading.expand = shaped.expand;
  reading.attention = shaped.attention;
  reading.answer = { direct: shaped.direct, timing: shaped.timing, why: shaped.why, helps: shaped.helps, delays: shaped.delays };
  if (reading.synthesis) {
    reading.synthesis.dimension = contract.answerShape === "mechanism" ? "PERIOD" : "TIMING";
    reading.synthesis.cycle = shaped.cycle;
    reading.synthesis.window = shaped.window;
    reading.synthesis.windowLabel = shaped.windowLabel;
  }
  reading.validation = answerFits(contract, reading.says);
  return reading;
}

function shapeForecast(contract: QuestionContract, reading: OracleReading, birth: string, asOf: string): { direct: string; timing: string; why: string; helps: string; delays: string; expand: string; attention: string[]; cycle: string; window: string; windowLabel: string } {
  const subject = contract.domain === "wealth" ? "wealth" : contract.domain === "marriage" ? "marriage" : contract.domain === "business" ? "business" : contract.domain === "career" || contract.domain === "work" ? "work" : "this";
  const found = birth ? cycleYears(birth, asOf, contract.cycleTarget) : { year: null, building: null, next: null };
  const card = reading.layers.find((layer) => layer.id === "tarot");
  const hex = reading.layers.find((layer) => layer.id === "iching");
  const yearLine = reading.layers.find((layer) => layer.id === "numerology");
  const helps = card ? `${card.result} ${card.detail.toLowerCase()}: ${card.line}` : "No card was drawn.";
  const delays = hex ? `${hex.result} asks whether support or restraint comes first.` : "No cast was made.";
  const kept = contract.contextFacts.length ? ` Context kept: ${contract.contextFacts.join("; ")}.` : "";
  if (contract.answerShape === "mechanism") {
    const direct = birth && yearLine
      ? `Next year is a ${subject} period, not a single day. ${yearLine.result} is the cycle used. The signs describe how it may unfold, without a guaranteed result.`
      : `Next year is a ${subject} period, not a single day. Without a birth date this stays a conditions reading of how it may unfold.`;
    return {
      direct,
      timing: "the coming year",
      why: yearLine?.line ?? "The period is longer than a personal day.",
      helps,
      delays,
      expand: `${direct} ${helps} ${delays}${kept}`,
      attention: ["the period, not a day", "what would help", "what would delay it"],
      cycle: yearLine?.result ?? "Not calculated",
      window: "Next year",
      windowLabel: "PERIOD",
    };
  }
  if (!birth || !found.year) {
    const direct = `This asks when ${subject} builds, not whether. The reading points to conditions rather than a reliable date. A birth date was not guessed.`;
    return {
      direct,
      timing: "not dated",
      why: "A personal-year window needs a date of birth. BaZi is not connected, so no chart was invented.",
      helps,
      delays,
      expand: `${direct} ${helps} ${delays}${kept}`,
      attention: ["conditions, not a year", "what would help", "what would delay it"],
      cycle: "Not calculated",
      window: "Needs a birth date",
      windowLabel: "STRONGEST WINDOW",
    };
  }
  const building = found.building && found.building < found.year ? ` A building year sits in ${found.building}.` : "";
  const later = found.next ? ` A later cycle falls in ${found.next}.` : "";
  const direct = `The strongest ${subject} window in this reading is ${found.year}, a personal-year ${contract.cycleTarget}.${building} It is a cycle, not a promise.`;
  return {
    direct,
    timing: `${found.year}`,
    why: `${yearLine?.result ?? "The personal year"} is the current cycle. Personal year ${contract.cycleTarget} is the one used for this kind of question.${later}`,
    helps,
    delays,
    expand: `${direct} ${yearLine?.detail ?? ""} ${helps} ${delays}${kept}`.replace(/\s+/g, " ").trim(),
    attention: ["the window, not a promise", "what would help", "what would delay it"],
    cycle: contract.domain === "wealth" ? (found.building && found.building >= Number(asOf.slice(0, 4)) && found.building < found.year ? "BUILDING" : "MATERIAL") : "IN CYCLE",
    window: String(found.year),
    windowLabel: "STRONGEST WINDOW",
  };
}

function splitOptions(text: string): [string, string] | null {
  const parts = text.split(/\s+or\s+/i);
  if (parts.length !== 2) return null;
  const left = parts[0]?.replace(/^(should i |do i |which is better[:,]?\s*)/i, "").trim() ?? "";
  const right = parts[1]?.replace(/[?.!\s]+$/g, "").trim() ?? "";
  if (left.length < 2 || right.length < 2 || left.length > 80 || right.length > 80) return null;
  return [left, right];
}

export function voiceAllowed(text: string, card: string): boolean {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return false;
  if (/%|\b\d+\s*%/.test(clean)) return false;
  if (/\b(guarantee|guaranteed|definitely will|you will be promoted|diagnos|destiny|fated|invest all|four pillars|八字)\b/i.test(clean)) return false;
  if (/\b(mars|venus|mercury|jupiter|saturn|uranus|neptune|pluto|ascendant|horoscope)\b/i.test(clean)) return false;
  if (card && /\b(the fool|magician|priestess|empress|emperor|hierophant|lovers|chariot|strength|hermit|wheel|justice|hanged|death|temperance|devil|tower|star|moon|sun|judgement|world)\b/i.test(clean)) {
    if (!clean.toLowerCase().includes(card.toLowerCase())) return false;
  }
  return true;
}

export function voiceFitsReading(reading: Pick<OracleReading, "contract" | "signals" | "layers">, text: string): boolean {
  if (reading.contract && !answerFits(reading.contract, text).ok) return false;
  const line = text.toLowerCase();
  const raws = [...reading.signals.map((signal) => signal.raw), ...reading.layers.map((layer) => `${layer.result} · ${layer.detail}`)];
  const year = /personal year\s+(\d+)/.exec(line);
  if (year && !raws.some((raw) => raw.toLowerCase().includes(`personal year ${year[1]}`))) return false;
  const tarot = raws.find((raw) => /\b(upright|reversed)\b/i.test(raw));
  if (tarot && /\breversed\b/.test(line) && /upright/i.test(tarot) && !/reversed/i.test(tarot)) return false;
  if (tarot && /\bupright\b/.test(line) && /reversed/i.test(tarot) && !/upright/i.test(tarot)) return false;
  return true;
}

export { WEEKDAYS };
