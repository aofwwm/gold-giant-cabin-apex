import type { DayTemplate, DurationBand, NodeKind, PlaybookEdge, PlaybookNode, PlaybookScope, ReferenceItinerary, SourceType, TravelPlaybook } from "@/lib/travel-playbook";
import { attachExperience } from "@/lib/travel-anchors";
import { setDestinationFacts } from "@/lib/travel-knowledge-pack";

/**
 * Compact structural facts for high-demand destinations.
 * Names, coordinates, and relationships only. No guide prose and no operator copy.
 * The same synthesizer turns these into playbooks. A destination that is not listed
 * is built later from open guides or from the resolved map centre.
 */

export type AreaRole = "base" | "focus" | "day-trip" | "excursion" | "transfer";

export type FactArea = {
  id: string;
  name: string;
  kind: NodeKind;
  lat: number;
  lng: number;
  role: AreaRole;
  groups: string[];
  hints: string[];
  optional?: boolean;
  later?: boolean;
  radiusKm?: number;
};

export type FactSource = {
  name: string;
  sourceType: SourceType;
  sourceUrl: string;
  stops: string[];
  facts: string[];
};

export type DestinationFact = {
  id: string;
  name: string;
  aliases: string[];
  scope: PlaybookScope;
  parent?: string;
  countryCode: string;
  areas: FactArea[];
  sources: FactSource[];
};

const WHEN = "2026-10-04";

function area(id: string, name: string, kind: NodeKind, lat: number, lng: number, role: AreaRole, groups: string[], hints: string[], extra?: { optional?: boolean; later?: boolean; radiusKm?: number }): FactArea {
  return { id, name, kind, lat, lng, role, groups, hints, ...extra };
}

function pageUrl(site: "wv" | "wp", page: string): string {
  const slug = page.replace(/ /g, "_");
  return site === "wv" ? `https://en.wikivoyage.org/wiki/${slug}` : `https://en.wikipedia.org/wiki/${slug}`;
}

function sourcesFor(name: string, page: string, stops: string[], board?: { name: string; url: string }): FactSource[] {
  const structure = `${stops.slice(0, 4).join(", ")} are the structural stops for a first look at ${name}.`;
  const rows: FactSource[] = [
    {
      name: `Wikivoyage ${page}`,
      sourceType: "wikivoyage",
      sourceUrl: pageUrl("wv", page),
      stops,
      facts: [structure, "Only place names and relationships are stored."],
    },
    {
      name: `Wikipedia ${page}`,
      sourceType: "wikipedia",
      sourceUrl: pageUrl("wp", page),
      stops,
      facts: [`Open encyclopedia entry used to confirm ${name}.`, "Article prose is not stored."],
    },
  ];
  if (board) {
    rows.unshift({
      name: board.name,
      sourceType: "tourism-board",
      sourceUrl: board.url,
      stops,
      facts: [`Official visitor pages for ${name} use the same main stops.`, "No official page text is stored."],
    });
  }
  return rows;
}

function place(input: {
  id: string;
  name: string;
  aliases: string[];
  scope: PlaybookScope;
  parent?: string;
  countryCode: string;
  areas: FactArea[];
  page: string;
  board?: { name: string; url: string };
}): DestinationFact {
  const stops = input.areas.filter((item) => !item.later).map((item) => item.name);
  return {
    id: input.id,
    name: input.name,
    aliases: [...new Set([input.id.replace(/-/g, " "), input.name.toLowerCase(), ...input.aliases.map((alias) => alias.toLowerCase())])],
    scope: input.scope,
    parent: input.parent,
    countryCode: input.countryCode,
    areas: input.areas,
    sources: sourcesFor(input.name, input.page, stops, input.board),
  };
}

export const STARTER_FACTS: DestinationFact[] = [
  place({
    id: "tokyo",
    name: "Tokyo",
    aliases: ["tokyo"],
    scope: "city",
    parent: "japan",
    countryCode: "JP",
    page: "Tokyo",
    board: { name: "Tokyo Tourism", url: "https://www.gotokyo.org/en/" },
    areas: [
      area("tokyo", "Tokyo", "city", 35.6812, 139.7671, "base", ["city", "landmark"], ["Senso-ji", "Imperial Palace", "teamLab"]),
      area("asakusa", "Asakusa", "city", 35.7148, 139.7967, "focus", ["heritage", "neighbourhood"], ["Senso-ji", "Nakamise"]),
      area("shibuya", "Shibuya and Harajuku", "city", 35.6595, 139.7004, "focus", ["neighbourhood", "city"], ["Shibuya", "Meiji", "Harajuku"]),
      area("kamakura", "Kamakura", "town", 35.3192, 139.5467, "day-trip", ["heritage"], ["Kotoku-in", "Hachimangu", "Great Buddha"], { radiusKm: 10 }),
      area("hakone", "Hakone", "region", 35.232, 139.107, "excursion", ["nature"], ["Hakone", "Lake Ashi"], { optional: true, radiusKm: 16 }),
    ],
  }),
  place({
    id: "kansai",
    name: "Kansai",
    aliases: ["kansai", "kyoto osaka"],
    scope: "region",
    parent: "japan",
    countryCode: "JP",
    page: "Kansai",
    areas: [
      area("kyoto", "Kyoto", "city", 35.0116, 135.7681, "base", ["heritage"], ["Fushimi", "Kiyomizu", "Arashiyama", "Gion"]),
      area("kyoto-east", "Eastern Kyoto", "city", 35.0037, 135.7788, "focus", ["heritage", "neighbourhood"], ["Gion", "Philosopher's Path"]),
      area("nara", "Nara", "city", 34.6851, 135.8048, "day-trip", ["heritage"], ["Todai-ji", "Nara Park"], { radiusKm: 12 }),
      area("osaka", "Osaka", "city", 34.6937, 135.5023, "transfer", ["food", "city"], ["Dotonbori", "Osaka Castle"]),
      area("kobe", "Kobe", "city", 34.6901, 135.1956, "day-trip", ["city"], ["Kobe", "Harborland"], { optional: true }),
    ],
  }),
  place({
    id: "hokkaido",
    name: "Hokkaido",
    aliases: ["hokkaido"],
    scope: "region",
    parent: "japan",
    countryCode: "JP",
    page: "Hokkaido",
    board: { name: "Visit Hokkaido", url: "https://www.visit-hokkaido.jp/en/" },
    areas: [
      area("sapporo", "Sapporo", "city", 43.0618, 141.3545, "base", ["city", "food"], ["Odori", "Sapporo"]),
      area("sapporo-park", "Sapporo parks", "city", 43.054, 141.347, "focus", ["neighbourhood"], ["Odori Park", "Nijo Market"]),
      area("otaru", "Otaru", "town", 43.1907, 140.9947, "day-trip", ["neighbourhood"], ["Otaru Canal"], { radiusKm: 10 }),
      area("furano", "Furano", "town", 43.342, 142.383, "transfer", ["nature"], ["Furano", "lavender fields"], { radiusKm: 18 }),
      area("biei", "Biei", "nature", 43.588, 142.467, "excursion", ["nature"], ["Biei", "Blue Pond"], { radiusKm: 16 }),
      area("hakodate", "Hakodate", "city", 41.7687, 140.729, "transfer", ["city"], ["Hakodate", "Goryokaku"], { later: true }),
    ],
  }),
  place({
    id: "kyushu",
    name: "Kyushu",
    aliases: ["kyushu"],
    scope: "region",
    parent: "japan",
    countryCode: "JP",
    page: "Kyushu",
    areas: [
      area("fukuoka", "Fukuoka", "city", 33.5902, 130.4017, "base", ["food", "city"], ["Hakata", "Canal City"]),
      area("dazaifu", "Dazaifu", "town", 33.5194, 130.535, "day-trip", ["heritage"], ["Dazaifu Tenmangu"], { radiusKm: 10 }),
      area("beppu", "Beppu and Yufuin", "region", 33.2846, 131.491, "transfer", ["nature"], ["Beppu", "Yufuin"], { radiusKm: 18 }),
      area("nagasaki", "Nagasaki", "city", 32.7503, 129.8779, "transfer", ["heritage"], ["Glover Garden", "Peace Park"], { later: true }),
    ],
  }),
  place({
    id: "okinawa",
    name: "Okinawa",
    aliases: ["okinawa"],
    scope: "island",
    parent: "japan",
    countryCode: "JP",
    page: "Okinawa",
    areas: [
      area("naha", "Naha", "city", 26.2124, 127.6809, "base", ["city", "heritage"], ["Shuri", "Kokusai"]),
      area("shuri", "Shuri", "city", 26.217, 127.719, "focus", ["heritage"], ["Shuri Castle"]),
      area("churaumi", "Motobu and the aquarium", "nature", 26.694, 127.878, "excursion", ["nature", "family"], ["Churaumi"], { radiusKm: 20 }),
      area("kerama", "Kerama Islands", "island", 26.19, 127.3, "day-trip", ["nature"], ["Kerama"], { optional: true, radiusKm: 14 }),
    ],
  }),
  place({
    id: "seoul",
    name: "Seoul",
    aliases: ["seoul"],
    scope: "city",
    parent: "south-korea",
    countryCode: "KR",
    page: "Seoul",
    board: { name: "Visit Seoul", url: "https://english.visitseoul.net/" },
    areas: [
      area("seoul", "Seoul", "city", 37.5665, 126.978, "base", ["heritage", "city"], ["Gyeongbokgung", "Bukchon"]),
      area("jongno", "Jongno palaces", "city", 37.5796, 126.977, "focus", ["heritage"], ["Gyeongbokgung", "Changdeokgung"]),
      area("hongdae", "Hongdae and the river", "city", 37.5563, 126.9236, "focus", ["neighbourhood", "food"], ["Hongdae"]),
      area("suwon", "Suwon", "city", 37.2636, 127.0286, "day-trip", ["heritage"], ["Hwaseong"], { radiusKm: 12 }),
    ],
  }),
  place({
    id: "south-korea",
    name: "South Korea",
    aliases: ["south korea", "republic of korea"],
    scope: "country",
    countryCode: "KR",
    page: "South Korea",
    board: { name: "Visit Korea", url: "https://english.visitkorea.or.kr/" },
    areas: [
      area("seoul", "Seoul", "city", 37.5665, 126.978, "base", ["heritage", "city"], ["Gyeongbokgung", "Bukchon"]),
      area("jongno", "Palace quarter", "city", 37.5796, 126.977, "focus", ["heritage"], ["Gyeongbokgung"]),
      area("suwon", "Suwon", "city", 37.2636, 127.0286, "day-trip", ["heritage"], ["Hwaseong"], { radiusKm: 12 }),
      area("gyeongju", "Gyeongju", "city", 35.8562, 129.2247, "transfer", ["heritage"], ["Bulguksa", "Tumuli"], { later: true }),
      area("busan", "Busan", "city", 35.1796, 129.0756, "transfer", ["city", "food"], ["Haeundae", "Jagalchi"], { later: true }),
    ],
  }),
  place({
    id: "beijing",
    name: "Beijing",
    aliases: ["beijing", "peking"],
    scope: "city",
    countryCode: "CN",
    page: "Beijing",
    areas: [
      area("beijing", "Beijing", "city", 39.9042, 116.4074, "base", ["heritage", "landmark"], ["Forbidden City", "Tiananmen"]),
      area("temple", "Temple of Heaven", "city", 39.8822, 116.4066, "focus", ["heritage"], ["Temple of Heaven"]),
      area("summer", "Summer Palace", "city", 39.999, 116.275, "focus", ["heritage", "nature"], ["Summer Palace"]),
      area("wall", "Mutianyu Great Wall", "nature", 40.431, 116.563, "day-trip", ["heritage", "nature"], ["Great Wall", "Mutianyu"], { radiusKm: 14 }),
    ],
  }),
  place({
    id: "shanghai",
    name: "Shanghai",
    aliases: ["shanghai"],
    scope: "city",
    countryCode: "CN",
    page: "Shanghai",
    areas: [
      area("shanghai", "Shanghai", "city", 31.2304, 121.4737, "base", ["city", "landmark"], ["The Bund", "Nanjing Road"]),
      area("bund", "The Bund", "city", 31.240, 121.490, "focus", ["landmark"], ["The Bund"]),
      area("french", "Former French Concession", "city", 31.216, 121.45, "focus", ["neighbourhood"], ["French Concession"]),
      area("suzhou", "Suzhou", "city", 31.2989, 120.5853, "day-trip", ["heritage", "nature"], ["Suzhou gardens"], { radiusKm: 14 }),
    ],
  }),
  place({
    id: "yunnan",
    name: "Yunnan",
    aliases: ["yunnan"],
    scope: "road",
    countryCode: "CN",
    page: "Yunnan",
    areas: [
      area("kunming", "Kunming", "city", 25.0389, 102.7183, "base", ["city"], ["Kunming"]),
      area("stone", "Stone Forest", "nature", 24.816, 103.323, "day-trip", ["nature"], ["Stone Forest"], { radiusKm: 12 }),
      area("dali", "Dali", "town", 25.6065, 100.2676, "transfer", ["heritage", "nature"], ["Dali old town", "Erhai"], { radiusKm: 16 }),
      area("lijiang", "Lijiang", "town", 26.855, 100.227, "transfer", ["heritage", "nature"], ["Lijiang old town"], { radiusKm: 14 }),
    ],
  }),
  place({
    id: "hong-kong",
    name: "Hong Kong",
    aliases: ["hong kong"],
    scope: "city",
    countryCode: "HK",
    page: "Hong Kong",
    board: { name: "Discover Hong Kong", url: "https://www.discoverhongkong.com/" },
    areas: [
      area("hong-kong", "Hong Kong Island", "city", 22.279, 114.162, "base", ["city", "landmark"], ["Central", "Victoria Peak"]),
      area("peak", "Victoria Peak", "city", 22.2759, 114.1455, "focus", ["landmark", "nature"], ["The Peak"]),
      area("kowloon", "Kowloon", "city", 22.2988, 114.1722, "focus", ["neighbourhood", "food"], ["Tsim Sha Tsui", "Temple Street"]),
      area("lantau", "Lantau", "island", 22.254, 113.904, "day-trip", ["heritage", "nature"], ["Ngong Ping", "Big Buddha"], { radiusKm: 14 }),
    ],
  }),
  place({
    id: "taiwan",
    name: "Taiwan",
    aliases: ["taiwan"],
    scope: "island",
    countryCode: "TW",
    page: "Taiwan",
    board: { name: "Taiwan Tourism", url: "https://eng.taiwan.net.tw/" },
    areas: [
      area("taipei", "Taipei", "city", 25.033, 121.5654, "base", ["city", "food"], ["Taipei 101", "night markets"]),
      area("datong", "Datong", "city", 25.064, 121.51, "focus", ["heritage", "food"], ["Dadaocheng"]),
      area("jiufen", "Jiufen", "town", 25.1096, 121.844, "day-trip", ["neighbourhood"], ["Jiufen"], { radiusKm: 8 }),
      area("beitou", "Beitou", "town", 25.136, 121.506, "focus", ["nature"], ["Beitou hot springs"]),
      area("hualien", "Hualien and Taroko", "nature", 24.158, 121.621, "transfer", ["nature"], ["Taroko"], { later: true, radiusKm: 24 }),
    ],
  }),
  place({
    id: "thailand",
    name: "Thailand",
    aliases: ["thailand"],
    scope: "country",
    countryCode: "TH",
    page: "Thailand",
    board: { name: "Tourism Authority of Thailand", url: "https://www.tourismthailand.org/" },
    areas: [
      area("bangkok", "Bangkok", "city", 13.7563, 100.5018, "base", ["heritage", "food", "city"], ["Grand Palace", "Wat Pho"]),
      area("riverside", "Bangkok riverside", "city", 13.742, 100.491, "focus", ["heritage", "neighbourhood"], ["Wat Arun", "Chinatown"]),
      area("ayutthaya", "Ayutthaya", "town", 14.3532, 100.568, "day-trip", ["heritage"], ["Ayutthaya"], { radiusKm: 12 }),
      area("chiang-mai", "Chiang Mai", "city", 18.7883, 98.9853, "transfer", ["heritage", "nature"], ["Old City", "Doi Suthep"], { later: true }),
    ],
  }),
  place({
    id: "bangkok",
    name: "Bangkok",
    aliases: ["bangkok"],
    scope: "city",
    parent: "thailand",
    countryCode: "TH",
    page: "Bangkok",
    areas: [
      area("bangkok", "Bangkok", "city", 13.7563, 100.5018, "base", ["heritage", "food"], ["Grand Palace", "Wat Pho"]),
      area("riverside", "Riverside temples", "city", 13.743, 100.488, "focus", ["heritage"], ["Wat Arun", "Wat Pho"]),
      area("chinatown", "Chinatown", "city", 13.74, 100.51, "focus", ["food", "neighbourhood"], ["Yaowarat"]),
      area("ayutthaya", "Ayutthaya", "town", 14.3532, 100.568, "day-trip", ["heritage"], ["Ayutthaya"], { radiusKm: 12 }),
    ],
  }),
  place({
    id: "vietnam",
    name: "Vietnam",
    aliases: ["vietnam"],
    scope: "country",
    countryCode: "VN",
    page: "Vietnam",
    board: { name: "Vietnam Tourism", url: "https://vietnam.travel/" },
    areas: [
      area("hanoi", "Hanoi", "city", 21.0278, 105.8342, "base", ["heritage", "food"], ["Old Quarter", "Hoan Kiem"]),
      area("old-quarter", "Old Quarter", "city", 21.035, 105.85, "focus", ["neighbourhood", "food"], ["Old Quarter"]),
      area("halong", "Ha Long Bay", "nature", 20.9101, 107.1839, "excursion", ["nature"], ["Ha Long"], { radiusKm: 28 }),
      area("hoi-an", "Hoi An", "town", 15.8801, 108.338, "transfer", ["heritage"], ["Hoi An old town"], { later: true }),
    ],
  }),
  place({
    id: "bali",
    name: "Bali",
    aliases: ["bali"],
    scope: "island",
    countryCode: "ID",
    page: "Bali",
    board: { name: "Indonesia Travel", url: "https://www.indonesia.travel/" },
    areas: [
      area("ubud", "Ubud", "region", -8.5069, 115.2625, "base", ["nature", "heritage"], ["Ubud", "rice terraces", "monkey forest"], { radiusKm: 12 }),
      area("ubud-ridge", "Ubud ridge", "nature", -8.45, 115.28, "focus", ["nature"], ["Tegallalang"], { radiusKm: 10 }),
      area("seminyak", "Seminyak", "town", -8.6913, 115.168, "transfer", ["beach", "food"], ["Seminyak", "Canggu"]),
      area("uluwatu", "Uluwatu", "nature", -8.8291, 115.0849, "excursion", ["nature", "heritage"], ["Uluwatu"], { radiusKm: 10 }),
      area("nusa", "Nusa Penida", "island", -8.727, 115.544, "day-trip", ["nature"], ["Nusa Penida"], { optional: true, radiusKm: 16 }),
    ],
  }),
  place({
    id: "malaysia",
    name: "Malaysia",
    aliases: ["malaysia"],
    scope: "country",
    countryCode: "MY",
    page: "Malaysia",
    areas: [
      area("kl", "Kuala Lumpur", "city", 3.139, 101.6869, "base", ["city", "landmark"], ["Petronas", "KLCC"]),
      area("chinatown", "Chinatown and Bukit Bintang", "city", 3.143, 101.697, "focus", ["food", "neighbourhood"], ["Petaling Street"]),
      area("caves", "Batu Caves", "town", 3.2374, 101.684, "day-trip", ["heritage"], ["Batu Caves"], { radiusKm: 8 }),
      area("melaka", "Melaka", "city", 2.1896, 102.2501, "day-trip", ["heritage"], ["Dutch Square"], { optional: true, radiusKm: 10 }),
    ],
  }),
  place({
    id: "london",
    name: "London",
    aliases: ["london"],
    scope: "city",
    parent: "united-kingdom",
    countryCode: "GB",
    page: "London",
    board: { name: "Visit London", url: "https://www.visitlondon.com/" },
    areas: [
      area("london", "London", "city", 51.5074, -0.1278, "base", ["landmark", "heritage"], ["Westminster", "Big Ben", "Thames"]),
      area("south-bank", "South Bank", "city", 51.5055, -0.115, "focus", ["landmark", "food"], ["South Bank", "Borough Market", "Tate"]),
      area("museums", "Bloomsbury museums", "city", 51.5194, -0.127, "focus", ["heritage"], ["British Museum"]),
      area("windsor", "Windsor", "town", 51.4839, -0.6044, "day-trip", ["heritage"], ["Windsor Castle"], { radiusKm: 8 }),
      area("greenwich", "Greenwich", "town", 51.4826, -0.0077, "day-trip", ["nature", "heritage"], ["Greenwich", "Royal Observatory"], { optional: true, radiusKm: 8 }),
    ],
  }),
  place({
    id: "united-kingdom",
    name: "United Kingdom",
    aliases: ["united kingdom", "uk", "britain"],
    scope: "country",
    countryCode: "GB",
    page: "United Kingdom",
    board: { name: "VisitBritain", url: "https://www.visitbritain.com/" },
    areas: [
      area("london", "London", "city", 51.5074, -0.1278, "base", ["landmark", "city"], ["Westminster", "British Museum"]),
      area("south-bank", "South Bank", "city", 51.5055, -0.115, "focus", ["neighbourhood"], ["South Bank"]),
      area("windsor", "Windsor", "town", 51.4839, -0.6044, "day-trip", ["heritage"], ["Windsor Castle"], { radiusKm: 8 }),
      area("edinburgh", "Edinburgh", "city", 55.9533, -3.1883, "transfer", ["heritage"], ["Edinburgh Castle", "Royal Mile"], { later: true }),
      area("bath", "Bath", "city", 51.3811, -2.359, "day-trip", ["heritage"], ["Roman Baths"], { later: true }),
    ],
  }),
  place({
    id: "barcelona",
    name: "Barcelona",
    aliases: ["barcelona"],
    scope: "city",
    parent: "spain",
    countryCode: "ES",
    page: "Barcelona",
    board: { name: "Turisme de Barcelona", url: "https://www.barcelonaturisme.com/" },
    areas: [
      area("barcelona", "Barcelona", "city", 41.3874, 2.1686, "base", ["landmark", "heritage"], ["Gothic Quarter", "La Rambla"]),
      area("gothic", "Gothic Quarter", "city", 41.383, 2.176, "focus", ["heritage", "neighbourhood"], ["Gothic Quarter", "Born"]),
      area("eixample", "Eixample and Sagrada Família", "city", 41.4036, 2.1744, "focus", ["landmark"], ["Sagrada Família"]),
      area("montserrat", "Montserrat", "nature", 41.591, 1.837, "day-trip", ["nature", "heritage"], ["Montserrat"], { radiusKm: 10 }),
      area("montjuic", "Montjuïc", "city", 41.363, 2.164, "focus", ["nature", "landmark"], ["Montjuïc"], { optional: true }),
    ],
  }),
  place({
    id: "spain",
    name: "Spain",
    aliases: ["spain"],
    scope: "country",
    countryCode: "ES",
    page: "Spain",
    board: { name: "Spain Tourism", url: "https://www.spain.info/" },
    areas: [
      area("madrid", "Madrid", "city", 40.4168, -3.7038, "base", ["heritage", "city"], ["Prado", "Retiro"]),
      area("retiro", "Retiro and the museums", "city", 40.415, -3.684, "focus", ["heritage"], ["Prado", "Retiro"]),
      area("toledo", "Toledo", "city", 39.8628, -4.0273, "day-trip", ["heritage"], ["Toledo"], { radiusKm: 8 }),
      area("barcelona", "Barcelona", "city", 41.3874, 2.1686, "transfer", ["landmark"], ["Sagrada Família", "Gothic Quarter"], { later: true }),
      area("seville", "Seville", "city", 37.3891, -5.9845, "transfer", ["heritage"], ["Alcázar"], { later: true }),
    ],
  }),
  place({
    id: "portugal",
    name: "Portugal",
    aliases: ["portugal"],
    scope: "country",
    countryCode: "PT",
    page: "Portugal",
    board: { name: "Visit Portugal", url: "https://www.visitportugal.com/" },
    areas: [
      area("lisbon", "Lisbon", "city", 38.7223, -9.1393, "base", ["heritage", "neighbourhood"], ["Alfama", "Belém"]),
      area("alfama", "Alfama and Belém", "city", 38.712, -9.13, "focus", ["heritage", "neighbourhood"], ["Alfama", "Belém Tower"]),
      area("sintra", "Sintra", "town", 38.8029, -9.3817, "day-trip", ["heritage", "nature"], ["Pena Palace", "Sintra"], { radiusKm: 10 }),
      area("porto", "Porto", "city", 41.1579, -8.6291, "transfer", ["heritage", "food"], ["Ribeira", "Dom Luís"]),
      area("algarve", "Algarve", "region", 37.0179, -7.9304, "transfer", ["beach", "nature"], ["Lagos", "cliffs"], { later: true, radiusKm: 24 }),
    ],
  }),
  place({
    id: "rome",
    name: "Rome",
    aliases: ["rome", "roma"],
    scope: "city",
    parent: "italy",
    countryCode: "IT",
    page: "Rome",
    areas: [
      area("rome", "Rome", "city", 41.8902, 12.4922, "base", ["heritage", "landmark"], ["Colosseum", "Forum"]),
      area("ancient", "Ancient Rome", "city", 41.8902, 12.4922, "focus", ["heritage"], ["Colosseum", "Forum", "Palatine"]),
      area("vatican", "Vatican and Trastevere", "city", 41.9029, 12.4534, "focus", ["heritage", "neighbourhood"], ["Vatican", "Trastevere"]),
      area("tivoli", "Tivoli", "town", 41.963, 12.797, "day-trip", ["heritage", "nature"], ["Villa d'Este"], { optional: true, radiusKm: 8 }),
    ],
  }),
  place({
    id: "provence",
    name: "Provence",
    aliases: ["provence"],
    scope: "region",
    parent: "france",
    countryCode: "FR",
    page: "Provence",
    areas: [
      area("avignon", "Avignon", "city", 43.9493, 4.8055, "base", ["heritage"], ["Palais des Papes"]),
      area("aix", "Aix-en-Provence", "city", 43.5297, 5.4474, "day-trip", ["neighbourhood"], ["Aix"], { radiusKm: 8 }),
      area("arles", "Arles", "town", 43.6766, 4.6278, "day-trip", ["heritage"], ["Arles amphitheatre"], { radiusKm: 8 }),
      area("luberon", "Luberon", "nature", 43.83, 5.3, "excursion", ["nature"], ["Luberon villages"], { radiusKm: 18 }),
    ],
  }),
  place({
    id: "greece",
    name: "Greece",
    aliases: ["greece"],
    scope: "country",
    countryCode: "GR",
    page: "Greece",
    board: { name: "Visit Greece", url: "https://www.visitgreece.gr/" },
    areas: [
      area("athens", "Athens", "city", 37.9838, 23.7275, "base", ["heritage", "landmark"], ["Acropolis", "Plaka"]),
      area("acropolis", "Acropolis and Plaka", "city", 37.9715, 23.7267, "focus", ["heritage"], ["Acropolis", "Plaka"]),
      area("cape", "Cape Sounion", "nature", 37.6502, 24.0245, "day-trip", ["heritage", "nature"], ["Temple of Poseidon"], { radiusKm: 10 }),
      area("santorini", "Santorini", "island", 36.3932, 25.4615, "transfer", ["nature", "landmark"], ["Oia", "Fira"], { later: true }),
    ],
  }),
  place({
    id: "norway",
    name: "Norway",
    aliases: ["norway"],
    scope: "country",
    countryCode: "NO",
    page: "Norway",
    board: { name: "Visit Norway", url: "https://www.visitnorway.com/" },
    areas: [
      area("oslo", "Oslo", "city", 59.9139, 10.7522, "base", ["city", "nature"], ["Opera", "Vigeland"]),
      area("vigeland", "Vigeland and the harbour", "city", 59.927, 10.7, "focus", ["landmark", "neighbourhood"], ["Vigeland", "Aker Brygge"]),
      area("bergen", "Bergen", "city", 60.3913, 5.3221, "transfer", ["heritage", "nature"], ["Bryggen", "Fløyen"], { later: true }),
      area("fjord", "Sognefjord", "nature", 61.1, 6.8, "excursion", ["nature"], ["Sognefjord"], { later: true, radiusKm: 30 }),
    ],
  }),
  place({
    id: "netherlands",
    name: "Netherlands",
    aliases: ["netherlands", "holland"],
    scope: "country",
    countryCode: "NL",
    page: "Netherlands",
    board: { name: "Holland.com", url: "https://www.holland.com/" },
    areas: [
      area("amsterdam", "Amsterdam", "city", 52.3676, 4.9041, "base", ["city", "heritage"], ["Canal ring", "Rijksmuseum"]),
      area("jordaan", "Canal ring", "city", 52.373, 4.883, "focus", ["neighbourhood"], ["Jordaan", "canals"]),
      area("haarlem", "Haarlem", "city", 52.3874, 4.6462, "day-trip", ["heritage"], ["Haarlem"], { optional: true, radiusKm: 8 }),
      area("zaanse", "Zaanse Schans", "town", 52.473, 4.817, "day-trip", ["heritage"], ["Zaanse Schans"], { radiusKm: 6 }),
    ],
  }),
  place({
    id: "germany",
    name: "Germany",
    aliases: ["germany"],
    scope: "country",
    countryCode: "DE",
    page: "Germany",
    board: { name: "Germany Travel", url: "https://www.germany.travel/" },
    areas: [
      area("berlin", "Berlin", "city", 52.52, 13.405, "base", ["heritage", "city"], ["Museum Island", "Brandenburg Gate"]),
      area("mitte", "Mitte", "city", 52.52, 13.4, "focus", ["heritage", "neighbourhood"], ["Museum Island"]),
      area("potsdam", "Potsdam", "city", 52.3906, 13.0645, "day-trip", ["heritage", "nature"], ["Sanssouci"], { radiusKm: 10 }),
      area("munich", "Munich", "city", 48.1351, 11.582, "transfer", ["city", "heritage"], ["Marienplatz", "English Garden"], { later: true }),
    ],
  }),
  place({
    id: "austria",
    name: "Austria",
    aliases: ["austria"],
    scope: "country",
    countryCode: "AT",
    page: "Austria",
    board: { name: "Austria.info", url: "https://www.austria.info/" },
    areas: [
      area("vienna", "Vienna", "city", 48.2082, 16.3738, "base", ["heritage", "landmark"], ["Stephansdom", "Ringstrasse"]),
      area("schonbrunn", "Schönbrunn", "city", 48.1845, 16.3122, "focus", ["heritage"], ["Schönbrunn"]),
      area("salzburg", "Salzburg", "city", 47.8095, 13.055, "transfer", ["heritage"], ["Altstadt", "Hohensalzburg"], { later: true }),
      area("hallstatt", "Hallstatt", "town", 47.5622, 13.6493, "excursion", ["nature", "heritage"], ["Hallstatt"], { later: true, radiusKm: 8 }),
    ],
  }),
  place({
    id: "czech-republic",
    name: "Czech Republic",
    aliases: ["czech republic", "czechia"],
    scope: "country",
    countryCode: "CZ",
    page: "Czech Republic",
    board: { name: "Visit Czech Republic", url: "https://www.visitczechrepublic.com/" },
    areas: [
      area("prague", "Prague", "city", 50.0755, 14.4378, "base", ["heritage", "landmark"], ["Old Town", "Charles Bridge"]),
      area("castle", "Prague Castle", "city", 50.091, 14.401, "focus", ["heritage"], ["Prague Castle", "Malá Strana"]),
      area("kutna", "Kutná Hora", "town", 49.948, 15.268, "day-trip", ["heritage"], ["Sedlec", "St Barbara"], { optional: true, radiusKm: 8 }),
    ],
  }),
  place({
    id: "hungary",
    name: "Hungary",
    aliases: ["hungary"],
    scope: "country",
    countryCode: "HU",
    page: "Hungary",
    board: { name: "Visit Hungary", url: "https://visithungary.com/" },
    areas: [
      area("budapest", "Budapest", "city", 47.4979, 19.0402, "base", ["heritage", "landmark"], ["Parliament", "Danube"]),
      area("buda", "Buda Castle", "city", 47.496, 19.039, "focus", ["heritage"], ["Buda Castle", "Fisherman's Bastion"]),
      area("pest", "Pest", "city", 47.5, 19.06, "focus", ["neighbourhood", "food"], ["Ruin bars", "Great Market Hall"]),
      area("szentendre", "Szentendre", "town", 47.67, 19.076, "day-trip", ["heritage"], ["Szentendre"], { optional: true, radiusKm: 6 }),
    ],
  }),
  place({
    id: "new-york",
    name: "New York",
    aliases: ["new york", "new york city", "nyc"],
    scope: "city",
    countryCode: "US",
    page: "New York City",
    board: { name: "NYC Tourism", url: "https://www.nyctourism.com/" },
    areas: [
      area("manhattan", "Manhattan", "city", 40.758, -73.9855, "base", ["landmark", "city"], ["Midtown", "Central Park"]),
      area("midtown", "Midtown and the park", "city", 40.769, -73.972, "focus", ["landmark", "nature"], ["Central Park", "Fifth Avenue"]),
      area("downtown", "Downtown", "city", 40.706, -74.009, "focus", ["heritage", "neighbourhood"], ["Battery", "Brooklyn Bridge"]),
      area("brooklyn", "Brooklyn", "city", 40.691, -73.991, "day-trip", ["neighbourhood", "food"], ["DUMBO", "Brooklyn Heights"], { radiusKm: 8 }),
    ],
  }),
  place({
    id: "california",
    name: "California",
    aliases: ["california"],
    scope: "road",
    countryCode: "US",
    page: "California",
    board: { name: "Visit California", url: "https://www.visitcalifornia.com/" },
    areas: [
      area("san-francisco", "San Francisco", "city", 37.7749, -122.4194, "base", ["city", "landmark"], ["Golden Gate", "Ferry Building"]),
      area("bridge", "Golden Gate", "city", 37.8199, -122.4783, "focus", ["landmark", "nature"], ["Golden Gate", "Crissy Field"]),
      area("napa", "Napa Valley", "region", 38.5025, -122.2654, "day-trip", ["food", "nature"], ["Napa"], { radiusKm: 16 }),
      area("yosemite", "Yosemite", "nature", 37.8651, -119.5383, "transfer", ["nature"], ["Yosemite Valley"], { radiusKm: 28 }),
    ],
  }),
  place({
    id: "canada",
    name: "Canada",
    aliases: ["canada"],
    scope: "country",
    countryCode: "CA",
    page: "Canada",
    board: { name: "Destination Canada", url: "https://travel.destinationcanada.com/" },
    areas: [
      area("vancouver", "Vancouver", "city", 49.2827, -123.1207, "base", ["city", "nature"], ["Stanley Park", "Gastown"]),
      area("stanley", "Stanley Park", "city", 49.3043, -123.1443, "focus", ["nature"], ["Stanley Park"]),
      area("whistler", "Whistler", "town", 50.1163, -122.9574, "excursion", ["nature"], ["Whistler"], { optional: true, radiusKm: 14 }),
      area("banff", "Banff", "nature", 51.1784, -115.5708, "transfer", ["nature"], ["Banff", "Lake Louise"], { later: true, radiusKm: 24 }),
    ],
  }),
  place({
    id: "australia",
    name: "Australia",
    aliases: ["australia"],
    scope: "country",
    countryCode: "AU",
    page: "Australia",
    board: { name: "Tourism Australia", url: "https://www.australia.com/" },
    areas: [
      area("sydney", "Sydney", "city", -33.8688, 151.2093, "base", ["landmark", "city"], ["Opera House", "Harbour Bridge"]),
      area("harbour", "Sydney Harbour", "city", -33.8568, 151.2153, "focus", ["landmark"], ["Opera House", "The Rocks"]),
      area("blue", "Blue Mountains", "nature", -33.7, 150.3, "day-trip", ["nature"], ["Blue Mountains"], { radiusKm: 20 }),
      area("melbourne", "Melbourne", "city", -37.8136, 144.9631, "transfer", ["city", "food"], ["CBD", "laneways"], { later: true }),
    ],
  }),
  place({
    id: "new-zealand",
    name: "New Zealand",
    aliases: ["new zealand"],
    scope: "country",
    countryCode: "NZ",
    page: "New Zealand",
    board: { name: "New Zealand Tourism", url: "https://www.newzealand.com/" },
    areas: [
      area("auckland", "Auckland", "city", -36.8509, 174.7645, "base", ["city", "nature"], ["Harbour", "Sky Tower"]),
      area("harbour", "Auckland harbour", "city", -36.84, 174.76, "focus", ["neighbourhood"], ["Viaduct", "Devonport"]),
      area("rotorua", "Rotorua", "region", -38.1368, 176.2497, "transfer", ["nature", "heritage"], ["Rotorua", "geothermal"], { later: true, radiusKm: 16 }),
      area("queenstown", "Queenstown", "city", -45.0312, 168.6626, "transfer", ["nature"], ["Queenstown"], { later: true }),
    ],
  }),
  place({
    id: "nz-south-island",
    name: "New Zealand South Island",
    aliases: ["new zealand south island", "south island"],
    scope: "road",
    parent: "new-zealand",
    countryCode: "NZ",
    page: "South Island",
    board: { name: "New Zealand Tourism", url: "https://www.newzealand.com/" },
    areas: [
      area("christchurch", "Christchurch", "city", -43.5321, 172.6362, "base", ["city"], ["Christchurch botanic"]),
      area("tekapo", "Lake Tekapo", "nature", -44.0047, 170.4771, "transfer", ["nature"], ["Lake Tekapo", "Aoraki"], { radiusKm: 22 }),
      area("aoraki", "Aoraki / Mount Cook", "nature", -43.734, 170.096, "excursion", ["nature"], ["Aoraki"], { radiusKm: 20 }),
      area("queenstown", "Queenstown", "city", -45.0312, 168.6626, "transfer", ["nature", "city"], ["Queenstown"]),
      area("wanaka", "Wanaka", "town", -44.694, 169.142, "day-trip", ["nature"], ["Wanaka"], { radiusKm: 12 }),
      area("milford", "Milford Sound", "nature", -44.671, 167.926, "excursion", ["nature"], ["Milford Sound"], { radiusKm: 20 }),
    ],
  }),
  place({
    id: "turkey",
    name: "Turkey",
    aliases: ["turkey", "türkiye", "turkiye"],
    scope: "country",
    countryCode: "TR",
    page: "Turkey",
    board: { name: "GoTürkiye", url: "https://goturkiye.com/" },
    areas: [
      area("istanbul", "Istanbul", "city", 41.0082, 28.9784, "base", ["heritage", "landmark"], ["Hagia Sophia", "Grand Bazaar"]),
      area("sultanahmet", "Sultanahmet", "city", 41.0054, 28.9768, "focus", ["heritage"], ["Hagia Sophia", "Blue Mosque"]),
      area("bosphorus", "Bosphorus", "city", 41.08, 29.04, "focus", ["nature", "neighbourhood"], ["Bosphorus"]),
      area("cappadocia", "Cappadocia", "region", 38.6431, 34.8289, "transfer", ["nature", "heritage"], ["Göreme"], { later: true, radiusKm: 18 }),
    ],
  }),
  place({
    id: "uae",
    name: "United Arab Emirates",
    aliases: ["united arab emirates", "uae"],
    scope: "country",
    countryCode: "AE",
    page: "United Arab Emirates",
    areas: [
      area("dubai", "Dubai", "city", 25.2048, 55.2708, "base", ["landmark", "city"], ["Dubai Creek", "Al Fahidi"]),
      area("creek", "Dubai Creek", "city", 25.265, 55.3, "focus", ["heritage", "neighbourhood"], ["Al Fahidi", "Dubai Creek"]),
      area("abu-dhabi", "Abu Dhabi", "city", 24.4539, 54.3773, "day-trip", ["landmark"], ["Sheikh Zayed Mosque"], { radiusKm: 14 }),
    ],
  }),
  place({
    id: "morocco",
    name: "Morocco",
    aliases: ["morocco"],
    scope: "country",
    countryCode: "MA",
    page: "Morocco",
    board: { name: "Visit Morocco", url: "https://www.visitmorocco.com/" },
    areas: [
      area("marrakech", "Marrakech", "city", 31.6295, -7.9811, "base", ["heritage", "city"], ["Medina", "Jemaa el-Fna"]),
      area("medina", "Marrakech medina", "city", 31.626, -7.989, "focus", ["heritage", "neighbourhood"], ["Medina", "souks"]),
      area("atlas", "Atlas foothills", "nature", 31.3, -7.7, "excursion", ["nature"], ["Atlas"], { radiusKm: 22 }),
      area("fes", "Fes", "city", 34.0181, -5.0078, "transfer", ["heritage"], ["Fes el-Bali"], { later: true }),
    ],
  }),
  place({
    id: "mexico",
    name: "Mexico",
    aliases: ["mexico"],
    scope: "country",
    countryCode: "MX",
    page: "Mexico",
    board: { name: "Visit Mexico", url: "https://www.visitmexico.com/" },
    areas: [
      area("mexico-city", "Mexico City", "city", 19.4326, -99.1332, "base", ["heritage", "food", "city"], ["Centro", "Roma"]),
      area("centro", "Historic centre", "city", 19.433, -99.133, "focus", ["heritage"], ["Zócalo", "Templo Mayor"]),
      area("teotihuacan", "Teotihuacan", "town", 19.6925, -98.8435, "day-trip", ["heritage"], ["Teotihuacan"], { radiusKm: 10 }),
      area("oaxaca", "Oaxaca", "city", 17.0732, -96.7266, "transfer", ["heritage", "food"], ["Oaxaca"], { later: true }),
    ],
  }),
  place({
    id: "scottish-highlands",
    name: "Scottish Highlands",
    aliases: ["scottish highlands", "highlands"],
    scope: "nature",
    parent: "united-kingdom",
    countryCode: "GB",
    page: "Scottish Highlands",
    board: { name: "VisitScotland", url: "https://www.visitscotland.com/" },
    areas: [
      area("inverness", "Inverness", "city", 57.4778, -4.2247, "base", ["city"], ["Inverness"]),
      area("ness", "Loch Ness", "nature", 57.3229, -4.4244, "day-trip", ["nature"], ["Loch Ness"], { radiusKm: 16 }),
      area("skye", "Isle of Skye", "island", 57.3, -6.2, "transfer", ["nature"], ["Skye"], { radiusKm: 22 }),
      area("glencoe", "Glencoe", "nature", 56.6826, -5.102, "excursion", ["nature"], ["Glencoe"], { radiusKm: 14 }),
    ],
  }),
];

function dayRole(item: FactArea, index: number): DayTemplate["role"] {
  if (index === 0) return "arrival";
  if (item.role === "day-trip") return "day-trip";
  if (item.role === "excursion") return item.groups.includes("nature") ? "nature" : "regional";
  if (item.role === "transfer") return item.groups.includes("nature") ? "nature" : "regional";
  if (item.groups.includes("heritage")) return "heritage";
  if (item.groups.includes("landmark")) return "icons";
  if (item.groups.includes("food")) return "food";
  return "neighbourhood";
}

function toNode(item: FactArea, countryCode: string): PlaybookNode {
  return {
    id: item.id,
    name: item.name,
    kind: item.kind,
    latitude: item.lat,
    longitude: item.lng,
    countryCode,
    experienceGroups: item.groups,
    hints: item.hints,
    radiusKm: item.radiusKm,
  };
}

function daysFrom(areas: FactArea[]): DayTemplate[] {
  let stay = areas.find((item) => item.role === "base")?.id ?? areas[0]?.id ?? "";
  return areas.map((item, index) => {
    if (item.role === "base" || item.role === "transfer") stay = item.id;
    return {
      node: item.id,
      stay: item.role === "base" || item.role === "transfer" ? item.id : stay,
      role: dayRole(item, index),
      title: item.name,
      groups: [...item.groups],
      optional: item.optional || item.role === "day-trip" && index > 3,
    };
  });
}

function band(id: string, label: string, minNights: number, maxNights: number, days: DayTemplate[], later?: string[]): DurationBand {
  return { id, label, minNights, maxNights, firstVisit: true, days, later };
}

export function playbookFromFact(fact: DestinationFact, warnings: string[] = []): TravelPlaybook {
  const active = fact.areas.filter((item) => !item.later);
  const extended = fact.areas;
  const classicDays = daysFrom(active);
  const tasteDays = daysFrom(active.slice(0, Math.min(4, active.length))).map((day, index, list) => ({ ...day, optional: index === list.length - 1 && list.length > 2 }));
  const longerDays = daysFrom(extended);
  const edges: PlaybookEdge[] = [];
  let base = active[0]?.id ?? extended[0]?.id ?? fact.id;
  for (const item of extended) {
    if (item.role === "base" || item.role === "transfer") {
      if (item.id !== base) edges.push({ from: base, to: item.id, relation: "follows", signal: "common" });
      base = item.id;
    } else if (item.role === "day-trip") edges.push({ from: base, to: item.id, relation: "day-trip", signal: "common" });
    else if (item.role === "excursion") edges.push({ from: base, to: item.id, relation: "excursion", signal: "common" });
  }
  const references: ReferenceItinerary[] = fact.sources.map((source, index) => ({
    id: `${fact.id}-${source.sourceType}-${index}`,
    sourceName: source.name,
    sourceType: source.sourceType,
    sourceUrl: source.sourceUrl,
    destinationScope: fact.name,
    title: "Structural route signals",
    nights: 7,
    routeNodes: source.stops.map((stop) => {
      const match = fact.areas.find((item) => item.name === stop);
      return { destinationName: stop, destinationType: match?.kind ?? "city", visitMode: match?.role === "day-trip" ? "DAY_TRIP" as const : match?.role === "excursion" ? "EXCURSION" as const : "STAY" as const };
    }),
    experienceGroups: [...new Set(fact.areas.flatMap((item) => item.groups))].slice(0, 6),
    extractedFacts: source.facts,
    retrievedAt: WHEN,
  }));
  const heritage = fact.areas.find((item) => item.role === "day-trip" && item.groups.includes("heritage")) ?? fact.areas.find((item) => item.groups.includes("heritage"));
  const nature = fact.areas.find((item) => item.groups.includes("nature") && item.role !== "base") ?? fact.areas.find((item) => item.groups.includes("nature"));
  const food = fact.areas.find((item) => item.groups.includes("food"));
  const family = fact.areas.find((item) => item.groups.includes("family")) ?? fact.areas.find((item) => item.groups.includes("landmark"));
  const cityTrip = fact.areas.find((item) => item.role === "day-trip");
  const primary = fact.areas.find((item) => item.role === "base") ?? fact.areas[0];
  return attachExperience({
    id: fact.id,
    destinationName: fact.name,
    aliases: fact.aliases,
    scope: fact.scope,
    parentCountry: fact.parent,
    parentId: fact.parent,
    longitude: primary?.lng ?? 0,
    nodes: fact.areas.map((item) => toNode(item, fact.countryCode)),
    edges,
    bands: [
      band("taste", "Short stay", 2, 4, tasteDays.length ? tasteDays : classicDays),
      band("classic", "Classic first visit", 5, 8, classicDays),
      band("longer", "With the further stops", 9, 16, longerDays, fact.areas.filter((item) => item.later).map((item) => item.name)),
    ],
    references,
    confidence: "medium",
    lastUpdated: WHEN,
    cultureNode: heritage?.id,
    natureNode: nature?.id,
    cityNode: cityTrip?.id,
    familyNode: family?.id,
    foodNode: food?.id,
    origin: "generated",
    warnings,
  });
}

export function findStarterFact(name: string, facts: readonly DestinationFact[] = STARTER_FACTS): DestinationFact | undefined {
  const text = name.trim().toLowerCase();
  return facts.find((fact) => fact.id === text || fact.name.toLowerCase() === text || fact.aliases.some((alias) => alias === text));
}

setDestinationFacts(STARTER_FACTS);
