import type { MissionContext } from "@/lib/mission";
import type { PlaceView } from "@/lib/place";

export type Kind = "meeting" | "makan";
export type Choice = "love" | "yes" | "soft" | "no";
export type OracleSource = "" | "grok" | "almanac";

export type VoteView = { nickname: string; choice: Choice };

export type SlotView = {
  id: string;
  label: string;
  venueNote: string;
  startsAt: string;
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
  votes: VoteView[];
};

export type CommentView = {
  id: string;
  nickname: string;
  body: string;
  createdAt: string;
};

export type EventView = {
  id: string;
  code: string;
  title: string;
  kind: Kind;
  durationMin: number;
  category: string;
  anchorAt: string;
  oracleText: string;
  oracleSource: OracleSource;
  mission: MissionContext | null;
  place: PlaceView;
  slots: SlotView[];
  comments: CommentView[];
};
