export type OracleDomain =
  | "wealth"
  | "career"
  | "work"
  | "business"
  | "relationship"
  | "love"
  | "marriage"
  | "family"
  | "health"
  | "travel"
  | "property"
  | "study"
  | "decision"
  | "timing"
  | "luck"
  | "general"
  | "other";

export type OracleQuestionKind =
  | "WHEN"
  | "YES_NO"
  | "WHICH"
  | "SHOULD_I"
  | "WHAT_HAPPENS"
  | "HOW"
  | "WHY"
  | "WHO"
  | "DATE_SELECTION"
  | "COMPATIBILITY"
  | "OPEN_READING";

export type AnswerShape = "timeframe" | "yes_no" | "comparison" | "decision" | "date_rank" | "compatibility" | "mechanism" | "explanation" | "open";
export type TimeHorizon = "day" | "month" | "year" | "long_term" | "unspecified";

export type QuestionContract = {
  rawQuestion: string;
  domain: OracleDomain;
  intent: "prediction" | "decision" | "comparison" | "compatibility" | "daily" | "guidance";
  questionType: OracleQuestionKind;
  answerShape: AnswerShape;
  subjects: string[];
  objects: string[];
  timeHorizon: TimeHorizon;
  decisionOptions: string[];
  mentionedDates: string[];
  mentionedPeople: string[];
  constraints: string[];
  requestedSpecificity: "day" | "approximate_period" | "yes_no" | "comparison" | "open";
  requiredOutputs: string[];
  wealthKind: "" | "accumulation" | "income" | "investment" | "windfall" | "stability";
  contextFacts: string[];
  missingInputs: string[];
  needsBirth: boolean;
  useMatrix: boolean;
  cycleTarget: number;
};

const MONTHS: Record<string, number> = {
  january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3, april: 4, apr: 4, may: 5,
  june: 6, jun: 6, july: 7, jul: 7, august: 8, aug: 8, september: 9, sept: 9, sep: 9,
  october: 10, oct: 10, november: 11, nov: 11, december: 12, dec: 12,
};
const MONTH_RE = "january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sept|sep|oct|nov|dec";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function isoOf(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${pad(month)}-${pad(day)}`;
}

function yearFor(asOf: string, month: number, day: number, explicit?: string): number {
  if (explicit && /^20\d{2}$/.test(explicit)) return Number(explicit);
  const year = Number(asOf.slice(0, 4));
  const candidate = isoOf(year, month, day);
  return candidate && candidate < asOf ? year + 1 : year;
}

/** A single named calendar day, such as "18 December". Not a month-only mention. */
export function mentionedDay(text: string, asOf: string): string | null {
  const line = text.toLowerCase();
  const ord = "(?:st|nd|rd|th)?";
  const first = new RegExp(`\\b(\\d{1,2})${ord}\\s+(${MONTH_RE})\\s*(20\\d{2})?`).exec(line);
  if (first) {
    const month = MONTHS[first[2] ?? ""] ?? 0;
    return isoOf(yearFor(asOf, month, Number(first[1]), first[3]), month, Number(first[1]));
  }
  const second = new RegExp(`\\b(${MONTH_RE})\\s+(\\d{1,2})${ord}\\s*(20\\d{2})?`).exec(line);
  if (!second) return null;
  const month = MONTHS[second[1] ?? ""] ?? 0;
  return isoOf(yearFor(asOf, month, Number(second[2]), second[3]), month, Number(second[2]));
}

function domainOf(line: string): OracleDomain {
  if (/\b(house|apartment|condo|property|mortgage)\b/.test(line)) return "property";
  if (/\b(married|marriage|wedding|marry)\b/.test(line)) return "marriage";
  if (/\b(rich|wealth|wealthy|fortune)\b/.test(line)) return "wealth";
  if (/\b(invest|stock|crypto|salary|income|bonus|money|afford)\b/.test(line)) return "wealth";
  if (/\b(business|startup|my own company|company i)\b/.test(line)) return "business";
  if (/\b(promot\w*|career|resign|quit)\b/.test(line)) return "career";
  if (/\b(job|boss|work|office)\b/.test(line)) return "work";
  if (/\b(compatib\w*|boyfriend|girlfriend|dating|crush|partner|like me|into me)\b/.test(line)) return "relationship";
  if (/\b(love|romance)\b/.test(line)) return "love";
  if (/\b(family|parent|mum|mom|dad|kids|children)\b/.test(line)) return "family";
  if (/\b(travel|trip|flight|holiday)\b/.test(line)) return "travel";
  if (/\b(exam|study|studies|school|university)\b/.test(line)) return "study";
  if (/\b(luck|lucky)\b/.test(line)) return "luck";
  if (/\b(health|sick|illness)\b/.test(line) && !/\bsick of\b/.test(line)) return "health";
  return "general";
}

function wealthKind(line: string): QuestionContract["wealthKind"] {
  if (/\b(invest|stock|crypto)\b/.test(line)) return "investment";
  if (/\b(salary|income|raise|bonus|pay)\b/.test(line)) return "income";
  if (/\b(windfall|lottery|jackpot)\b/.test(line)) return "windfall";
  if (/\b(stable|stability|debt|afford)\b/.test(line)) return "stability";
  if (/\b(rich|wealth|wealthy|fortune)\b/.test(line)) return "accumulation";
  return "";
}

function horizonOf(line: string, kind: OracleQuestionKind): TimeHorizon {
  if (/\b(today|tonight|tomorrow|this morning)\b/.test(line)) return "day";
  if (/\b(next week|this week|good day|which day|what day)\b/.test(line) || /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.test(line)) return "day";
  if (/\b(next month|this month|in a month)\b/.test(line)) return "month";
  if (/\b(next year|this year|in a year|coming year)\b/.test(line)) return "year";
  if (kind === "WHEN") return "long_term";
  if (kind === "HOW" || kind === "WHAT_HAPPENS") return "unspecified";
  return "unspecified";
}

function kindOf(line: string): OracleQuestionKind {
  if (/\b(compatib\w*|are we a match|soulmate)\b/.test(line)) return "COMPATIBILITY";
  if (/\b(which day|which date|best day|good day|what day|pick a date|auspicious)\b/.test(line)) return "DATE_SELECTION";
  if (/\bor\b/.test(line) && /\b(which|should|better|job a|job b|option)\b/.test(line)) return "WHICH";
  if (/\bshould i\b/.test(line)) return "SHOULD_I";
  if (/\bwhen\b/.test(line)) return "WHEN";
  if (/\bhow\b/.test(line)) return "HOW";
  if (/\bwhy\b/.test(line)) return "WHY";
  if (/\bwho\b/.test(line)) return "WHO";
  if (/\bwhat (will|happens|would happen)\b/.test(line)) return "WHAT_HAPPENS";
  if (/\b(what should i know|energy of today|today)\b/.test(line)) return "OPEN_READING";
  if (/\b(will|won't|do i|does she|does he|does they|can i|is it|am i)\b/.test(line)) return "YES_NO";
  return "OPEN_READING";
}

function shapeOf(kind: OracleQuestionKind): AnswerShape {
  if (kind === "WHEN") return "timeframe";
  if (kind === "YES_NO") return "yes_no";
  if (kind === "WHICH") return "comparison";
  if (kind === "SHOULD_I") return "decision";
  if (kind === "DATE_SELECTION") return "date_rank";
  if (kind === "COMPATIBILITY") return "compatibility";
  if (kind === "HOW" || kind === "WHAT_HAPPENS") return "mechanism";
  if (kind === "WHY") return "explanation";
  return "open";
}

function factsOf(text: string): string[] {
  const sentences = text.split(/[.!?]+/).map((part) => part.trim()).filter((part) => part.length > 8);
  if (sentences.length < 2) return [];
  const facts: string[] = [];
  for (const sentence of sentences.slice(0, -1)) {
    const line = sentence.toLowerCase();
    if (/\b(leav\w*|resign|quit|company|job)\b/.test(line)) facts.push("a possible change of work");
    if (/\b(business|start my)\b/.test(line)) facts.push("a business transition");
    const month = new RegExp(`\\b(${MONTH_RE})\\b`).exec(line);
    if (month) facts.push(`a timing mention of ${month[1]}`);
    if (/\bnext year\b/.test(line)) facts.push("a next-year horizon");
  }
  return [...new Set(facts)].slice(0, 4);
}

function optionsOf(text: string): string[] {
  const parts = text.split(/\s+or\s+/i);
  if (parts.length !== 2) return [];
  const left = parts[0]?.replace(/^(should i |which is better[:,]?\s*|do i )/i, "").trim() ?? "";
  const right = parts[1]?.replace(/[?.!\s]+$/g, "").trim() ?? "";
  if (left.length < 2 || right.length < 2) return [];
  return [left, right];
}

function cycleTarget(domain: OracleDomain): number {
  if (domain === "marriage" || domain === "love" || domain === "relationship" || domain === "family") return 6;
  if (domain === "career" || domain === "work" || domain === "business") return 1;
  if (domain === "property") return 4;
  return 8;
}

export function parseQuestionContract(question: string, hint = "", mode = "ask"): QuestionContract {
  const rawQuestion = question.trim();
  const line = `${hint} ${rawQuestion}`.toLowerCase();
  const questionType = mode === "daily" ? "OPEN_READING" : mode === "compare" ? "WHICH" : mode === "dates" ? "DATE_SELECTION" : kindOf(line);
  const domain = domainOf(line);
  const timeHorizon = questionType === "DATE_SELECTION" ? "day" : horizonOf(line, questionType);
  const answerShape = shapeOf(questionType);
  const needsBirth = (questionType === "WHEN" && timeHorizon !== "day") || (questionType === "HOW" && (timeHorizon === "year" || timeHorizon === "long_term"));
  const useMatrix = (questionType === "WHEN" && timeHorizon !== "day") || (questionType === "HOW" && timeHorizon !== "day" && timeHorizon !== "unspecified");
  return {
    rawQuestion,
    domain,
    intent: questionType === "COMPATIBILITY" ? "compatibility" : questionType === "SHOULD_I" || questionType === "WHICH" ? "decision" : questionType === "OPEN_READING" ? "daily" : questionType === "WHEN" || questionType === "YES_NO" || questionType === "HOW" ? "prediction" : "guidance",
    questionType,
    answerShape,
    subjects: ["user"],
    objects: domain === "general" ? [] : [domain],
    timeHorizon,
    decisionOptions: optionsOf(rawQuestion),
    mentionedDates: [],
    mentionedPeople: /\b(she|her)\b/.test(line) ? ["she"] : /\b(he|him)\b/.test(line) ? ["he"] : [],
    constraints: [],
    requestedSpecificity: answerShape === "timeframe" ? "approximate_period" : answerShape === "yes_no" ? "yes_no" : answerShape === "comparison" ? "comparison" : answerShape === "date_rank" ? "day" : "open",
    requiredOutputs: answerShape === "timeframe" ? ["direct_answer", "time_window", "drivers", "obstacles"] : ["direct_answer"],
    wealthKind: domain === "wealth" ? wealthKind(line) : "",
    contextFacts: factsOf(rawQuestion),
    missingInputs: needsBirth ? ["date of birth"] : [],
    needsBirth,
    useMatrix,
    cycleTarget: cycleTarget(domain),
  };
}

export type MethodScore = {
  method: "tong_shu" | "tarot" | "iching" | "numerology" | "zodiac" | "bazi" | "astrology";
  relevance: number;
  selected: boolean;
  status: "selected" | "not_relevant" | "needs_info" | "not_connected";
  reason: string;
};

function noun(contract: QuestionContract): string {
  if (contract.domain === "wealth") return contract.wealthKind === "accumulation" ? "longer-term wealth" : "the money question";
  if (contract.domain === "marriage") return "marriage timing";
  if (contract.domain === "business") return "how the business moves";
  if (contract.domain === "career" || contract.domain === "work") return "the longer career cycle";
  if (contract.domain === "property") return "the property decision";
  return "the longer cycle in the question";
}

/** Relevance first. Only available methods can be selected. BaZi and astrology stay disconnected. */
export function methodMatrix(contract: QuestionContract, hasBirth: boolean): MethodScore[] {
  const subject = noun(contract);
  const yearScale = contract.timeHorizon === "year" || contract.timeHorizon === "month";
  const rows: MethodScore[] = [
    {
      method: "bazi",
      relevance: 95,
      selected: false,
      status: "not_connected",
      reason: "BaZi would suit a long cycle, but four pillars are not calculated.",
    },
    {
      method: "astrology",
      relevance: 70,
      selected: false,
      status: "not_connected",
      reason: "Astrology is not connected. Planetary positions are not calculated.",
    },
    {
      method: "numerology",
      relevance: 82,
      selected: hasBirth,
      status: hasBirth ? "selected" : "needs_info",
      reason: hasBirth
        ? yearScale
          ? `Used to read the personal-year cycle for ${subject}.`
          : `Used to narrow ${subject} to your personal-year cycle, not the personal day.`
        : "A personal-year window needs your date of birth. It was not guessed.",
    },
    {
      method: "tarot",
      relevance: 55,
      selected: true,
      status: "selected",
      reason: contract.answerShape === "mechanism"
        ? `Used to describe how ${subject} may unfold, not to name a date.`
        : "Used as a supporting view of what may help or delay that period.",
    },
    {
      method: "iching",
      relevance: 46,
      selected: true,
      status: "selected",
      reason: `Used to see whether ${subject} depends on support, restraint, or a change of course.`,
    },
    {
      method: "tong_shu",
      relevance: 22,
      selected: false,
      status: "not_relevant",
      reason: "The almanac reads a day. This question asks for a longer cycle.",
    },
    {
      method: "zodiac",
      relevance: 12,
      selected: false,
      status: "not_relevant",
      reason: "One animal year does not date this question. Compatibility needs two birth dates.",
    },
  ];
  const picked = rows.filter((row) => row.selected).sort((a, b) => b.relevance - a.relevance).slice(0, 3).map((row) => row.method);
  return rows.map((row) => (row.selected && !picked.includes(row.method) ? { ...row, selected: false, status: "not_relevant" as const, reason: "A stronger method already covers this question." } : row));
}

export function answerFits(contract: QuestionContract | null | undefined, text: string): { ok: boolean; reason: string } {
  if (!contract?.useMatrix) return { ok: true, reason: "not a matrix question" };
  const line = text.replace(/\s+/g, " ").trim();
  if (!line) return { ok: false, reason: "empty" };
  if (/leans toward a yes, and away from a performance/i.test(line)) return { ok: false, reason: "yes/no sentence on the wrong question" };
  if (/\byou will be rich\b/i.test(line) || /\byou will (definitely|certainly)\b/i.test(line)) return { ok: false, reason: "unsupported certainty" };
  if (contract.answerShape === "timeframe") {
    if (!/\b(20\d{2}|birth date|conditions rather than|window|cycle|period)\b/i.test(line)) return { ok: false, reason: "when-question has no window and no reason timing cannot be dated" };
    if (contract.domain === "wealth" && !/\b(wealth|rich|material|money)\b/i.test(line)) return { ok: false, reason: "wealth question never mentions wealth" };
    if (contract.domain === "marriage" && !/\b(marry|marriage|wedding)\b/i.test(line)) return { ok: false, reason: "marriage question never mentions marriage" };
  }
  if (contract.answerShape === "mechanism") {
    if (!/\b(year|period|conditions|unfold|business|work)\b/i.test(line)) return { ok: false, reason: "how-question does not describe the period" };
  }
  return { ok: true, reason: "matches the question" };
}
