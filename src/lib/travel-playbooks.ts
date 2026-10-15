import type { DayTemplate, DurationBand, PlaybookEdge, PlaybookNode, ReferenceItinerary, TravelPlaybook } from "@/lib/travel-playbook";

/**
 * Structural route knowledge only. Facts are short signals from open guides.
 * No tour-operator prose is stored.
 */

const WHEN = "2026-10-04";

function node(id: string, name: string, kind: PlaybookNode["kind"], latitude: number, longitude: number, countryCode: string, experienceGroups: string[], hints: string[], radiusKm?: number): PlaybookNode {
  return { id, name, kind, latitude, longitude, countryCode, experienceGroups, hints, radiusKm };
}

function day(nodeId: string, stay: string, role: DayTemplate["role"], title: string, groups: string[], optional = false): DayTemplate {
  return { node: nodeId, stay, role, title, groups, optional };
}

function source(id: string, sourceName: string, sourceType: ReferenceItinerary["sourceType"], sourceUrl: string, scope: string, nights: number, routeNodes: ReferenceItinerary["routeNodes"], experienceGroups: string[], extractedFacts: string[]): ReferenceItinerary {
  return { id, sourceName, sourceType, sourceUrl, destinationScope: scope, title: "Structural route signals", nights, routeNodes, experienceGroups, extractedFacts, retrievedAt: WHEN };
}

const japanNodes: PlaybookNode[] = [
  node("tokyo", "Tokyo", "city", 35.6812, 139.7671, "JP", ["landmark", "city", "neighbourhood"], ["Senso-ji", "Meiji", "Shibuya", "teamLab", "Tokyo National"]),
  node("fuji", "Fuji area", "nature", 35.498, 138.768, "JP", ["nature"], ["Fuji", "Kawaguchiko", "Chureito", "Hakone"], 28),
  node("hakone", "Hakone", "region", 35.232, 139.107, "JP", ["nature"], ["Hakone", "Lake Ashi", "Owakudani"], 16),
  node("kyoto", "Kyoto", "city", 35.0116, 135.7681, "JP", ["heritage"], ["Fushimi", "Kiyomizu", "Arashiyama", "Gion", "Kinkaku"]),
  node("nara", "Nara", "city", 34.6851, 135.8048, "JP", ["heritage"], ["Todai-ji", "Nara Park", "Kasuga"], 12),
  node("osaka", "Osaka", "city", 34.6937, 135.5023, "JP", ["food", "city"], ["Osaka Castle", "Dotonbori", "Kuromon"], 12),
  node("hiroshima", "Hiroshima", "city", 34.3853, 132.4553, "JP", ["heritage"], ["Peace Memorial", "Miyajima", "Itsukushima"], 18),
  node("kamakura", "Kamakura", "town", 35.3192, 139.5467, "JP", ["heritage"], ["Kotoku-in", "Hachimangu", "Daibutsu", "Great Buddha"], 10),
  node("tokyo-family", "Tokyo with children", "city", 35.716, 139.774, "JP", ["family"], ["Ueno Zoo", "teamLab", "Sunshine Aquarium", "Disney"]),
];

const japanRefs: ReferenceItinerary[] = [
  source("wv-japan", "Wikivoyage Japan", "wikivoyage", "https://en.wikivoyage.org/wiki/Japan", "Japan", 7, [
    { destinationName: "Tokyo", destinationType: "city", visitMode: "STAY", nights: 3 },
    { destinationName: "Mount Fuji", destinationType: "nature", visitMode: "EXCURSION" },
    { destinationName: "Hakone", destinationType: "region", visitMode: "DAY_TRIP" },
    { destinationName: "Kyoto", destinationType: "city", visitMode: "STAY", nights: 2 },
    { destinationName: "Nara", destinationType: "city", visitMode: "DAY_TRIP" },
    { destinationName: "Osaka", destinationType: "city", visitMode: "STAY", nights: 2 },
  ], ["landmark", "heritage", "nature"], [
    "Listed cities include Tokyo, Kyoto, Osaka, and Nara",
    "Mount Fuji is an other destination, not a city stop",
    "Hakone is named as a day trip from Tokyo",
    "Nara is named as a day trip from Kyoto",
    "A golden route names Tokyo, Mount Fuji, Kyoto, and Osaka",
  ]),
  source("wv-tokyo", "Wikivoyage Tokyo", "wikivoyage", "https://en.wikivoyage.org/wiki/Tokyo", "Tokyo", 3, [
    { destinationName: "Tokyo", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Kamakura", destinationType: "town", visitMode: "DAY_TRIP" },
    { destinationName: "Hakone", destinationType: "region", visitMode: "EXCURSION" },
    { destinationName: "Nikko", destinationType: "town", visitMode: "DAY_TRIP" },
  ], ["heritage", "nature"], [
    "Kamakura is a day trip from Tokyo",
    "Hakone is a nearby excursion from Tokyo",
    "Nikko is a day trip from Tokyo",
  ]),
  source("wp-japan", "Wikipedia Tourism in Japan", "wikipedia", "https://en.wikipedia.org/wiki/Tourism_in_Japan", "Japan", 7, [
    { destinationName: "Hakone", destinationType: "region", visitMode: "DAY_TRIP" },
    { destinationName: "Nara", destinationType: "city", visitMode: "DAY_TRIP" },
    { destinationName: "Hiroshima", destinationType: "city", visitMode: "EXCURSION" },
  ], ["heritage"], [
    "Hakone is treated as a Kanto add-on",
    "Nara is treated as a Kansai add-on",
    "Hiroshima is treated as a further add-on, not the first-week core",
  ]),
];

const japanEdges: PlaybookEdge[] = [
  { from: "tokyo", to: "fuji", relation: "excursion", signal: "common" },
  { from: "tokyo", to: "kamakura", relation: "day-trip", signal: "common" },
  { from: "tokyo", to: "kyoto", relation: "follows", signal: "common" },
  { from: "kyoto", to: "nara", relation: "day-trip", signal: "common" },
  { from: "kyoto", to: "osaka", relation: "follows", signal: "common" },
  { from: "kyoto", to: "hiroshima", relation: "excursion", signal: "optional" },
];

const japanTaste: DurationBand = {
  id: "taste",
  label: "First taste",
  minNights: 3,
  maxNights: 5,
  firstVisit: true,
  days: [
    day("tokyo", "tokyo", "arrival", "Central Tokyo", ["neighbourhood", "city"]),
    day("tokyo", "tokyo", "icons", "Iconic Tokyo", ["landmark"]),
    day("fuji", "tokyo", "nature", "Fuji area", ["nature"]),
    day("kyoto", "kyoto", "heritage", "Kyoto heritage", ["heritage"]),
    day("kyoto", "kyoto", "neighbourhood", "More of Kyoto", ["heritage", "neighbourhood"], true),
  ],
};

const japanClassic: DurationBand = {
  id: "classic",
  label: "Classic first visit",
  minNights: 6,
  maxNights: 8,
  firstVisit: true,
  days: [
    day("tokyo", "tokyo", "arrival", "Central Tokyo", ["neighbourhood", "city"]),
    day("tokyo", "tokyo", "icons", "Iconic Tokyo", ["landmark"]),
    day("fuji", "tokyo", "nature", "Fuji area", ["nature"]),
    day("kyoto", "kyoto", "heritage", "Kyoto heritage", ["heritage"]),
    day("kyoto", "kyoto", "heritage", "More of Kyoto", ["heritage"]),
    day("osaka", "osaka", "neighbourhood", "Osaka", ["city"], true),
    day("osaka", "osaka", "departure", "Last day in Osaka", ["neighbourhood"], true),
  ],
  later: ["Hiroshima"],
};

const japanDeeper: DurationBand = {
  id: "deeper",
  label: "Classic plus the west",
  minNights: 9,
  maxNights: 12,
  firstVisit: true,
  days: [
    day("tokyo", "tokyo", "arrival", "Central Tokyo", ["city"]),
    day("tokyo", "tokyo", "icons", "Iconic Tokyo", ["landmark"]),
    day("fuji", "tokyo", "nature", "Fuji area", ["nature"]),
    day("kyoto", "kyoto", "heritage", "Kyoto heritage", ["heritage"]),
    day("nara", "kyoto", "day-trip", "Nara", ["heritage"]),
    day("hiroshima", "hiroshima", "heritage", "Hiroshima", ["heritage"]),
    day("hiroshima", "hiroshima", "nature", "Miyajima", ["nature", "heritage"], true),
  ],
  later: ["A slower Kansai day"],
};

const japanLong: DurationBand = {
  id: "long",
  label: "Deeper Japan",
  minNights: 13,
  maxNights: 18,
  firstVisit: true,
  days: japanDeeper.days,
  later: ["Hiroshima is already in the first week"],
};

const icelandNodes: PlaybookNode[] = [
  node("reykjavik", "Reykjavík", "city", 64.1466, -21.9426, "IS", ["city", "landmark"], ["Hallgrimskirkja", "Harpa", "Old Harbour"]),
  node("golden", "Golden Circle", "region", 64.3271, -20.1199, "IS", ["nature"], ["Gullfoss", "Geysir", "Thingvellir", "Þingvellir"], 30),
  node("south", "South Coast", "corridor", 63.532, -19.511, "IS", ["nature"], ["Skogafoss", "Seljalandsfoss", "Reynisfjara", "Vik"], 32),
  node("lagoon", "Glacier Lagoon", "nature", 64.0784, -16.2306, "IS", ["nature"], ["Jokulsarlon", "Diamond Beach", "Skaftafell"], 24),
  node("akureyri", "North Iceland", "region", 65.6885, -18.1262, "IS", ["nature"], ["Akureyri", "Godafoss", "Myvatn"], 28),
];

const icelandRefs: ReferenceItinerary[] = [
  source("wv-iceland", "Wikivoyage Iceland", "wikivoyage", "https://en.wikivoyage.org/wiki/Iceland", "Iceland", 7, [
    { destinationName: "Reykjavík", destinationType: "city", visitMode: "STAY", nights: 2 },
    { destinationName: "Golden Circle", destinationType: "region", visitMode: "EXCURSION" },
    { destinationName: "South Coast", destinationType: "corridor", visitMode: "STAY", nights: 3 },
    { destinationName: "Jökulsárlón", destinationType: "nature", visitMode: "EXCURSION" },
  ], ["nature", "road"], [
    "Regions are the planning unit, not a list of cities",
    "Route 1 is the Ring Road",
    "Golden Circle is the usual excursion from Reykjavík",
    "The south coast is a driving stretch, not a city",
  ]),
  source("wp-iceland", "Wikipedia Tourism in Iceland", "wikipedia", "https://en.wikipedia.org/wiki/Tourism_in_Iceland", "Iceland", 7, [
    { destinationName: "Reykjavík", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Golden Circle", destinationType: "region", visitMode: "EXCURSION" },
    { destinationName: "South Coast", destinationType: "corridor", visitMode: "STAY" },
    { destinationName: "Ring Road", destinationType: "corridor", visitMode: "STAY" },
  ], ["nature", "road"], [
    "Ring Road, Golden Circle, South Coast, and Reykjavík are the main visitor patterns",
  ]),
];

const parisNodes: PlaybookNode[] = [
  node("paris", "Paris", "city", 48.8566, 2.3522, "FR", ["landmark", "heritage", "food"], ["Notre-Dame", "Marais", "Sacré", "Eiffel", "Louvre", "Orsay", "Seine"]),
  node("eiffel", "Eiffel and the Seine", "city", 48.8584, 2.2945, "FR", ["landmark"], ["Eiffel", "Trocadéro", "Champ de Mars", "Seine"]),
  node("louvre", "Louvre and the Tuileries", "city", 48.8606, 2.3376, "FR", ["heritage"], ["Louvre", "Tuileries", "Orsay", "Palais Royal"]),
  node("marais", "The Marais", "city", 48.859, 2.362, "FR", ["food", "neighbourhood"], ["Marais", "Place des Vosges", "Latin Quarter"]),
  node("versailles", "Versailles", "town", 48.8049, 2.1204, "FR", ["heritage"], ["Versailles", "Palace of Versailles"], 8),
  node("disney", "Disneyland Paris", "excursion", 48.867, 2.783, "FR", ["family"], ["Disneyland"], 8),
];

const parisRefs: ReferenceItinerary[] = [
  source("wv-paris", "Wikivoyage Paris", "wikivoyage", "https://en.wikivoyage.org/wiki/Paris", "Paris", 5, [
    { destinationName: "Paris", destinationType: "city", visitMode: "STAY", nights: 4 },
    { destinationName: "Eiffel Tower", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Louvre", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Notre-Dame", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Sacré-Cœur", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Versailles", destinationType: "town", visitMode: "DAY_TRIP" },
  ], ["landmark", "heritage", "food"], [
    "First-visit sights named include the Eiffel Tower, Louvre, Notre-Dame, Arc de Triomphe, and Sacré-Cœur",
    "Versailles is a day trip by train, not a stop inside central Paris",
    "Other day trips exist, including Fontainebleau and Giverny",
  ]),
];

const singaporeNodes: PlaybookNode[] = [
  node("marina", "Marina Bay", "city", 1.283, 103.851, "SG", ["landmark"], ["Merlion", "Marina Bay", "ArtScience"]),
  node("gardens", "Gardens by the Bay", "city", 1.2816, 103.8636, "SG", ["nature", "landmark"], ["Gardens by the Bay", "Cloud Forest"]),
  node("quarters", "Historic quarters", "city", 1.283, 103.844, "SG", ["heritage"], ["Chinatown", "Little India", "Kampong Glam", "Sultan Mosque"]),
  node("sentosa", "Sentosa", "island", 1.2494, 103.8303, "SG", ["family", "nature"], ["Sentosa", "Palawan", "Siloso"], 8),
  node("food", "Hawker streets", "city", 1.2806, 103.844, "SG", ["food"], ["Maxwell", "Lau Pa Sat", "Chinatown Complex"]),
];

const singaporeRefs: ReferenceItinerary[] = [
  source("wv-singapore", "Wikivoyage Singapore", "wikivoyage", "https://en.wikivoyage.org/wiki/Singapore", "Singapore", 5, [
    { destinationName: "Marina Bay", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Chinatown", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Little India", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Kampong Glam", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Sentosa", destinationType: "island", visitMode: "DAY_TRIP" },
  ], ["landmark", "heritage", "food"], [
    "Districts include Marina Bay, Chinatown, Little India, Kampong Glam, and the civic centre",
    "Sentosa is the usual island day, not another city",
  ]),
];

const chengduNodes: PlaybookNode[] = [
  node("chengdu", "Chengdu", "city", 30.6598, 104.0657, "CN", ["heritage", "food"], ["Kuanzhai", "Jinli", "Wuhou", "People's Park", "Chunxi"]),
  node("panda", "Panda base", "nature", 30.733, 104.146, "CN", ["wildlife"], ["Panda", "Giant Panda"], 8),
  node("dujiangyan", "Dujiangyan", "region", 30.998, 103.613, "CN", ["nature", "heritage"], ["Dujiangyan", "Qingcheng"], 16),
  node("leshan", "Leshan", "town", 29.5446, 103.769, "CN", ["heritage"], ["Leshan", "Giant Buddha"], 10),
];

const chengduRefs: ReferenceItinerary[] = [
  source("wv-chengdu", "Wikivoyage Chengdu", "wikivoyage", "https://en.wikivoyage.org/wiki/Chengdu", "Chengdu", 5, [
    { destinationName: "Chengdu", destinationType: "city", visitMode: "STAY", nights: 3 },
    { destinationName: "Panda base", destinationType: "nature", visitMode: "EXCURSION" },
    { destinationName: "Dujiangyan", destinationType: "region", visitMode: "DAY_TRIP" },
    { destinationName: "Qingcheng Mountain", destinationType: "nature", visitMode: "DAY_TRIP" },
    { destinationName: "Leshan", destinationType: "town", visitMode: "DAY_TRIP" },
  ], ["heritage", "wildlife", "nature", "food"], [
    "City structure includes Jinli, Kuanzhai, Wuhou, and People's Park",
    "The panda base is a defining Chengdu experience",
    "Dujiangyan and Qingcheng are day trips, not city-centre stops",
    "Leshan is a longer day trip",
  ]),
];

const nagoyaNodes: PlaybookNode[] = [
  node("nagoya", "Nagoya", "city", 35.1815, 136.9066, "JP", ["heritage", "city"], ["Nagoya Castle", "Atsuta", "Osu", "Sakae"]),
  node("tokugawa", "Tokugawa", "city", 35.183, 136.93, "JP", ["heritage"], ["Tokugawa", "Tokugawa Art", "Tokugawa Garden"]),
  node("inuyama", "Inuyama", "town", 35.3885, 136.9394, "JP", ["heritage"], ["Inuyama Castle", "Inuyama"], 12),
  node("ghibli", "Ghibli Park", "excursion", 35.171, 137.089, "JP", ["family"], ["Ghibli"], 8),
];

const nagoyaRefs: ReferenceItinerary[] = [
  source("wv-nagoya", "Wikivoyage Nagoya", "wikivoyage", "https://en.wikivoyage.org/wiki/Nagoya", "Nagoya", 5, [
    { destinationName: "Nagoya", destinationType: "city", visitMode: "STAY", nights: 4 },
    { destinationName: "Inuyama", destinationType: "town", visitMode: "DAY_TRIP" },
    { destinationName: "Gifu", destinationType: "city", visitMode: "DAY_TRIP" },
    { destinationName: "Ghibli Park", destinationType: "excursion", visitMode: "DAY_TRIP" },
  ], ["heritage", "food"], [
    "Inuyama, Gifu, Ise, and Takayama are named as trips beyond the city",
    "Ghibli Park is in Nagakute, not a castle stop",
  ]),
];

const swissNodes: PlaybookNode[] = [
  node("lucerne", "Lucerne", "city", 47.0502, 8.3093, "CH", ["landmark", "nature"], ["Chapel Bridge", "Lake Lucerne", "Mount Pilatus"]),
  node("interlaken", "Interlaken", "region", 46.6863, 7.8632, "CH", ["nature"], ["Interlaken", "Jungfrau", "Lauterbrunnen"], 16),
];

const swissRefs: ReferenceItinerary[] = [
  source("wv-swiss", "Wikivoyage Switzerland", "wikivoyage", "https://en.wikivoyage.org/wiki/Switzerland", "Switzerland", 4, [
    { destinationName: "Lucerne", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Interlaken", destinationType: "region", visitMode: "EXCURSION" },
    { destinationName: "Bernese Highlands", destinationType: "region", visitMode: "EXCURSION" },
  ], ["nature", "landmark"], [
    "Lucerne and Interlaken are repeated bases",
    "Lakes and the Alps are the point of the visit, not a city checklist",
  ]),
];

const italyNodes: PlaybookNode[] = [
  node("florence", "Florence", "city", 43.7696, 11.2558, "IT", ["heritage", "landmark"], ["Duomo", "Uffizi", "Ponte Vecchio", "Accademia"]),
];

const italyRefs: ReferenceItinerary[] = [
  source("wv-florence", "Wikivoyage Florence", "wikivoyage", "https://en.wikivoyage.org/wiki/Florence", "Florence", 3, [
    { destinationName: "Florence", destinationType: "city", visitMode: "STAY", nights: 3 },
    { destinationName: "Duomo", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Uffizi", destinationType: "city", visitMode: "STAY" },
  ], ["heritage"], [
    "Florence is a stay, not a pass-through",
    "The Duomo, Uffizi, and Ponte Vecchio define a first visit",
  ]),
];

const franceRefs: ReferenceItinerary[] = [
  ...parisRefs,
  source("wv-france", "Wikivoyage France", "wikivoyage", "https://en.wikivoyage.org/wiki/France", "France", 12, [
    { destinationName: "Paris", destinationType: "city", visitMode: "STAY" },
    { destinationName: "Switzerland", destinationType: "country", visitMode: "PASS_THROUGH" },
    { destinationName: "Italy", destinationType: "country", visitMode: "PASS_THROUGH" },
  ], ["heritage"], [
    "Eastern France names Switzerland as onward travel",
    "Southern France names Italy as onward travel",
  ]),
];

function book(partial: TravelPlaybook): TravelPlaybook {
  return partial;
}

export const PLAYBOOKS: TravelPlaybook[] = [
  book({
    id: "japan",
    destinationName: "Japan",
    aliases: ["japan"],
    scope: "country",
    longitude: 138,
    nodes: japanNodes,
    edges: japanEdges,
    bands: [japanTaste, japanClassic, japanDeeper, japanLong],
    references: japanRefs,
    confidence: "medium",
    lastUpdated: WHEN,
    cultureNode: "nara",
    natureNode: "fuji",
    cityNode: "kamakura",
    familyNode: "tokyo-family",
    foodNode: "osaka",
  }),
  book({
    id: "iceland",
    destinationName: "Iceland",
    aliases: ["iceland"],
    scope: "road",
    longitude: -19,
    nodes: icelandNodes,
    edges: [
      { from: "reykjavik", to: "golden", relation: "excursion", signal: "core" },
      { from: "reykjavik", to: "south", relation: "follows", signal: "core" },
      { from: "south", to: "lagoon", relation: "excursion", signal: "common" },
      { from: "south", to: "akureyri", relation: "follows", signal: "optional" },
    ],
    bands: [
      {
        id: "taste",
        label: "Reykjavík and the southwest",
        minNights: 3,
        maxNights: 4,
        firstVisit: true,
        days: [
          day("reykjavik", "reykjavik", "arrival", "Reykjavík", ["city"]),
          day("golden", "reykjavik", "nature", "Golden Circle", ["nature"]),
          day("reykjavik", "reykjavik", "neighbourhood", "Reykjavík again", ["neighbourhood"], true),
          day("reykjavik", "reykjavik", "departure", "Last day in Reykjavík", ["city"], true),
        ],
      },
      {
        id: "south",
        label: "South coast road",
        minNights: 5,
        maxNights: 8,
        firstVisit: true,
        days: [
          day("reykjavik", "reykjavik", "arrival", "Reykjavík", ["city"]),
          day("golden", "reykjavik", "nature", "Golden Circle", ["nature"]),
          day("south", "south", "nature", "South Coast", ["nature"]),
          day("south", "south", "nature", "Waterfalls and the coast", ["nature"]),
          day("lagoon", "south", "nature", "Glacier Lagoon", ["nature"]),
          day("south", "south", "nature", "Back along the coast", ["nature"], true),
          day("reykjavik", "reykjavik", "departure", "Return to Reykjavík", ["city"], true),
        ],
      },
      {
        id: "ring",
        label: "Ring Road",
        minNights: 9,
        maxNights: 16,
        firstVisit: true,
        days: [
          day("reykjavik", "reykjavik", "arrival", "Reykjavík", ["city"]),
          day("golden", "reykjavik", "nature", "Golden Circle", ["nature"]),
          day("south", "south", "nature", "South Coast", ["nature"]),
          day("south", "south", "nature", "Waterfalls and the coast", ["nature"]),
          day("lagoon", "lagoon", "nature", "Glacier Lagoon", ["nature"]),
          day("lagoon", "lagoon", "nature", "The east side of the ice", ["nature"]),
          day("akureyri", "akureyri", "regional", "Toward the north", ["nature"]),
        ],
        later: ["The rest of the Ring Road"],
      },
    ],
    references: icelandRefs,
    confidence: "high",
    lastUpdated: WHEN,
    natureNode: "south",
    cityNode: "reykjavik",
    familyNode: "reykjavik",
  }),
  book({
    id: "paris",
    destinationName: "Paris",
    aliases: ["paris"],
    scope: "city",
    parentCountry: "france",
    longitude: 2.35,
    nodes: parisNodes,
    edges: [
      { from: "paris", to: "versailles", relation: "day-trip", signal: "common" },
      { from: "paris", to: "eiffel", relation: "follows", signal: "common" },
      { from: "paris", to: "louvre", relation: "follows", signal: "common" },
    ],
    bands: [
      {
        id: "classic",
        label: "Classic first visit",
        minNights: 3,
        maxNights: 6,
        firstVisit: true,
        days: [
          day("paris", "paris", "arrival", "Central Paris", ["neighbourhood", "heritage"]),
          day("eiffel", "paris", "icons", "Eiffel and the Seine", ["landmark"]),
          day("louvre", "paris", "heritage", "Louvre and the Tuileries", ["heritage"]),
          day("versailles", "paris", "day-trip", "Versailles", ["heritage"]),
          day("marais", "paris", "neighbourhood", "A Paris neighbourhood", ["neighbourhood"], true),
        ],
      },
      {
        id: "longer",
        label: "Paris with another excursion",
        minNights: 7,
        maxNights: 10,
        firstVisit: true,
        days: [
          day("paris", "paris", "arrival", "Central Paris", ["heritage"]),
          day("eiffel", "paris", "icons", "Eiffel and the Seine", ["landmark"]),
          day("louvre", "paris", "heritage", "Louvre and the Tuileries", ["heritage"]),
          day("versailles", "paris", "day-trip", "Versailles", ["heritage"]),
          day("marais", "paris", "neighbourhood", "The Marais", ["neighbourhood"]),
          day("paris", "paris", "icons", "Another Paris icon", ["landmark"], true),
          day("paris", "paris", "departure", "Last morning in Paris", ["neighbourhood"], true),
        ],
      },
    ],
    references: parisRefs,
    confidence: "medium",
    lastUpdated: WHEN,
    cultureNode: "versailles",
    natureNode: "versailles",
    foodNode: "marais",
    familyNode: "disney",
  }),
  book({
    id: "france",
    destinationName: "France",
    aliases: ["france"],
    scope: "country",
    longitude: 2.3,
    nodes: parisNodes,
    edges: [{ from: "paris", to: "versailles", relation: "day-trip", signal: "common" }],
    bands: [
      {
        id: "classic",
        label: "Paris first",
        minNights: 3,
        maxNights: 8,
        firstVisit: true,
        days: [
          day("eiffel", "paris", "icons", "Eiffel and the Seine", ["landmark"]),
          day("louvre", "paris", "heritage", "Louvre and the Tuileries", ["heritage"]),
          day("versailles", "paris", "day-trip", "Versailles", ["heritage"]),
          day("marais", "paris", "neighbourhood", "A Paris neighbourhood", ["neighbourhood"], true),
          day("paris", "paris", "departure", "Last day in Paris", ["neighbourhood"], true),
        ],
      },
    ],
    references: franceRefs,
    confidence: "medium",
    lastUpdated: WHEN,
    cultureNode: "versailles",
    foodNode: "marais",
    familyNode: "disney",
  }),
  book({
    id: "switzerland",
    destinationName: "Switzerland",
    aliases: ["switzerland", "swiss"],
    scope: "country",
    longitude: 8.2,
    nodes: swissNodes,
    edges: [{ from: "lucerne", to: "interlaken", relation: "excursion", signal: "common" }],
    bands: [
      {
        id: "lakes",
        label: "Lakes and an alpine day",
        minNights: 2,
        maxNights: 8,
        firstVisit: true,
        days: [
          day("lucerne", "lucerne", "icons", "Lucerne and the lake", ["landmark", "nature"]),
          day("interlaken", "lucerne", "nature", "An alpine day", ["nature"]),
          day("lucerne", "lucerne", "neighbourhood", "Another lake day", ["nature"], true),
        ],
      },
    ],
    references: swissRefs,
    confidence: "medium",
    lastUpdated: WHEN,
    natureNode: "interlaken",
  }),
  book({
    id: "italy",
    destinationName: "Italy",
    aliases: ["italy"],
    scope: "country",
    longitude: 12.5,
    nodes: italyNodes,
    edges: [],
    bands: [
      {
        id: "florence",
        label: "Florence first",
        minNights: 2,
        maxNights: 8,
        firstVisit: true,
        days: [
          day("florence", "florence", "icons", "Florence icons", ["heritage", "landmark"]),
          day("florence", "florence", "neighbourhood", "Florence on foot", ["heritage", "neighbourhood"]),
          day("florence", "florence", "heritage", "More of Florence", ["heritage"], true),
        ],
      },
    ],
    references: italyRefs,
    confidence: "medium",
    lastUpdated: WHEN,
    foodNode: "florence",
  }),
  book({
    id: "singapore",
    destinationName: "Singapore",
    aliases: ["singapore"],
    scope: "city",
    longitude: 103.85,
    nodes: singaporeNodes,
    edges: [{ from: "marina", to: "sentosa", relation: "day-trip", signal: "common" }],
    bands: [
      {
        id: "classic",
        label: "Classic first visit",
        minNights: 3,
        maxNights: 7,
        firstVisit: true,
        days: [
          day("marina", "marina", "icons", "Marina Bay", ["landmark"]),
          day("gardens", "marina", "nature", "Gardens by the Bay", ["nature", "landmark"]),
          day("quarters", "marina", "heritage", "Chinatown, Little India, Kampong Glam", ["heritage"]),
          day("sentosa", "marina", "day-trip", "Sentosa", ["nature"], true),
          day("food", "marina", "food", "Hawker streets", ["food"], true),
        ],
      },
    ],
    references: singaporeRefs,
    confidence: "medium",
    lastUpdated: WHEN,
    foodNode: "food",
    familyNode: "sentosa",
    natureNode: "gardens",
  }),
  book({
    id: "chengdu",
    destinationName: "Chengdu",
    aliases: ["chengdu"],
    scope: "city",
    longitude: 104.06,
    nodes: chengduNodes,
    edges: [
      { from: "chengdu", to: "panda", relation: "excursion", signal: "common" },
      { from: "chengdu", to: "dujiangyan", relation: "day-trip", signal: "common" },
      { from: "chengdu", to: "leshan", relation: "day-trip", signal: "optional" },
    ],
    bands: [
      {
        id: "classic",
        label: "City, pandas, and one excursion",
        minNights: 3,
        maxNights: 7,
        firstVisit: true,
        days: [
          day("chengdu", "chengdu", "heritage", "Historic Chengdu", ["heritage", "neighbourhood"]),
          day("panda", "chengdu", "nature", "Panda base", ["wildlife"]),
          day("chengdu", "chengdu", "neighbourhood", "Teahouses and the park", ["heritage", "neighbourhood"]),
          day("dujiangyan", "chengdu", "day-trip", "Dujiangyan and Qingcheng", ["nature", "heritage"]),
          day("chengdu", "chengdu", "food", "Sichuan food in the city", ["food"], true),
        ],
      },
    ],
    references: chengduRefs,
    confidence: "medium",
    lastUpdated: WHEN,
    cultureNode: "chengdu",
    natureNode: "dujiangyan",
    foodNode: "chengdu",
    cityNode: "chengdu",
  }),
  book({
    id: "nagoya",
    destinationName: "Nagoya",
    aliases: ["nagoya", "central japan"],
    scope: "city",
    parentCountry: "japan",
    longitude: 136.9,
    nodes: nagoyaNodes,
    edges: [
      { from: "nagoya", to: "inuyama", relation: "day-trip", signal: "common" },
      { from: "nagoya", to: "ghibli", relation: "day-trip", signal: "optional" },
    ],
    bands: [
      {
        id: "classic",
        label: "Nagoya and a castle town",
        minNights: 3,
        maxNights: 7,
        firstVisit: true,
        days: [
          day("nagoya", "nagoya", "arrival", "Nagoya Castle and the centre", ["heritage", "city"]),
          day("tokugawa", "nagoya", "heritage", "Tokugawa and Atsuta", ["heritage"]),
          day("inuyama", "nagoya", "day-trip", "Inuyama", ["heritage"]),
          day("nagoya", "nagoya", "neighbourhood", "A Nagoya neighbourhood", ["neighbourhood"], true),
          day("nagoya", "nagoya", "food", "Food in Nagoya", ["food"], true),
        ],
      },
    ],
    references: nagoyaRefs,
    confidence: "medium",
    lastUpdated: WHEN,
    cultureNode: "inuyama",
    familyNode: "ghibli",
    foodNode: "nagoya",
  }),
];
