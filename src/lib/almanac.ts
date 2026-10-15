import type { Kind } from "./kairos.types";
import { hashString, markOf, readReading, type ReadOptions } from "./reading";

export { hashString };

export type Almanac = {
  score: number;
  yi: string;
  yiNote: string;
  ji: string;
  jiNote: string;
  tarot: string;
  tarotNote: string;
  zodiac: string;
  zodiacNote: string;
  boss: string;
};

export function readAlmanac(iso: string, title: string, options?: ReadOptions & { kind?: Kind }): Almanac {
  const reading = readReading(iso, title, options);
  return {
    score: reading.score,
    yi: reading.yi,
    yiNote: reading.yiNote,
    ji: reading.ji,
    jiNote: reading.jiNote,
    tarot: reading.tarotName,
    tarotNote: reading.tarotNote,
    zodiac: reading.zodiacName,
    zodiacNote: reading.zodiacNote,
    boss: reading.boss,
  };
}

export function clearanceWord(score: number): string {
  return markOf(score);
}

export function localOracle(title: string, when: string, score: number): string {
  const n = hashString(`${title}|${when}`) % 4;
  const first = [
    `The hour and the almanac both looked at ${when}.`,
    `${when} carries a Kairos score of ${score} / 100 for “${title}”.`,
    `Tong shu circled ${when} and nodded, with reservations.`,
    `For “${title}”, the least crowded good hour is ${when}.`,
  ][n];
  const second = [
    `Open with the ask. The room will not fund a prologue.`,
    `Bring one number, one decision, and zero apology slides.`,
    `If someone says “let's take this offline”, the good hour is already going.`,
    `Humans still vote. The score is a briefing, not a prophecy.`,
  ][(n + score) % 4];
  return `${first} ${second}`;
}
