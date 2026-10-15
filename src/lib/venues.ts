import { hashString } from "@/lib/almanac";

export const CATEGORIES = [
  { id: "supper", label: "Supper spots" },
  { id: "pickle", label: "Pickleball / badminton" },
  { id: "board", label: "Board games" },
  { id: "drink", label: "Chill drink / craft beer" },
  { id: "neighbourhood", label: "Paya Lebar / Tanjong Pagar / Bugis" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Venue = { name: string; area: string; blurb: string };

const VENUES: Record<CategoryId, Venue[]> = {
  supper: [
    {
      name: "Swee Choon",
      area: "Jalan Besar",
      blurb: "Liu sha bao after the build breaks. Open late enough for the people who said one more slide.",
    },
    {
      name: "Lau Pa Sat",
      area: "Tanjong Pagar",
      blurb: "Satay row under the iron market. The smoke is the icebreaker.",
    },
    {
      name: "Maxwell Food Centre",
      area: "Chinatown",
      blurb: "Tian Tian, or the stall two doors down. Democracy by tray.",
    },
    {
      name: "Newton Food Centre",
      area: "Newton",
      blurb: "Stingray and a vendor who still wants to align.",
    },
  ],
  pickle: [
    {
      name: "Kallang ActiveSG courts",
      area: "Kallang",
      blurb: "Dink the deadline away. Loser buys the isotonic.",
    },
    {
      name: "Our Tampines Hub",
      area: "Tampines",
      blurb: "East-side badminton. Book the hall before the uncles do.",
    },
    {
      name: "Heartbeat @ Bedok",
      area: "Bedok",
      blurb: "Heartland lights, serious footwork, zero slides.",
    },
  ],
  board: [
    {
      name: "The Mind Cafe",
      area: "Prinsep Street",
      blurb: "A wall of games and someone who will teach the rules before the CFO arrives.",
    },
    {
      name: "King and the Pawn",
      area: "Purvis Street, Bugis",
      blurb: "Shophouse, craft beer, three hundred boxes. Eat enough and the cover charge vanishes.",
    },
    {
      name: "ME Cafe & Games",
      area: "Late night",
      blurb: "The one that stays open when the rest of the island has given up.",
    },
  ],
  drink: [
    {
      name: "Native",
      area: "Amoy Street",
      blurb: "A small room and a drink that starts a story. Two rounds, then the train.",
    },
    {
      name: "Little Island Brewing Co.",
      area: "Changi Village",
      blurb: "Sea breeze and a pint. The ferry is not a metaphor.",
    },
    {
      name: "Brewerkz",
      area: "Clarke Quay",
      blurb: "Safe, loud, and nobody has to explain what a saison is.",
    },
    {
      name: "Level 33",
      area: "Marina Bay",
      blurb: "The high one. Pitch less. Look at the water more.",
    },
  ],
  neighbourhood: [
    {
      name: "Haji Lane wander",
      area: "Bugis",
      blurb: "Murals, one tiny bar, and a group photo you will regret fondly.",
    },
    {
      name: "Amoy Street crawl",
      area: "Tanjong Pagar",
      blurb: "Three doors, one decision. Start at the cocktail bar with the shortest menu.",
    },
    {
      name: "Paya Lebar Quarter",
      area: "Paya Lebar",
      blurb: "Mall air-con, a proper dinner, and a train home that still runs.",
    },
  ],
};

export function isCategory(value: string): value is CategoryId {
  return CATEGORIES.some((c) => c.id === value);
}

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? "Singapore night";
}

export function pickVenue(category: CategoryId, salt: number, avoid: string[]): Venue {
  const list = VENUES[category];
  const pool = list.filter((v) => !avoid.some((name) => name.toLowerCase() === v.name.toLowerCase()));
  const use = pool.length > 0 ? pool : list;
  return use[Math.abs(salt) % use.length];
}

export function venueSalt(category: string, extra: string): number {
  return hashString(`${category}|${extra}|${Date.now()}`);
}
