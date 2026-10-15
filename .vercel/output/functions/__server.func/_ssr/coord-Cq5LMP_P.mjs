//#region node_modules/.nitro/vite/services/ssr/assets/coord-Cq5LMP_P.js
/** Real Singapore places. Used when a live map search is thin. Never invent names on top of this list. */
var SPOTS = [
	{
		id: "lau-pa-sat",
		name: "Lau Pa Sat",
		kind: "makan",
		area: "Raffles Place",
		address: "18 Raffles Quay, Singapore 048582",
		lat: 1.2806,
		lng: 103.8506,
		cuisine: "Hawker",
		price: 1,
		approxSgd: 12,
		dietary: [],
		moods: ["quick", "casual"],
		styles: ["chill"],
		maxPax: 40,
		blurb: "Iron market hawker centre. Satay row outside after dusk."
	},
	{
		id: "amoy-fc",
		name: "Amoy Street Food Centre",
		kind: "makan",
		area: "Tanjong Pagar",
		address: "7 Maxwell Road, Singapore 069111",
		lat: 1.2794,
		lng: 103.8466,
		cuisine: "Hawker",
		price: 1,
		approxSgd: 10,
		dietary: [],
		moods: ["quick", "casual"],
		styles: ["chill"],
		maxPax: 30,
		blurb: "CBD hawker centre. Short walk from Amoy and Telok Ayer."
	},
	{
		id: "maxwell",
		name: "Maxwell Food Centre",
		kind: "makan",
		area: "Chinatown",
		address: "1 Kadayanallur Street, Singapore 069184",
		lat: 1.2803,
		lng: 103.8448,
		cuisine: "Hawker",
		price: 1,
		approxSgd: 8,
		dietary: [],
		moods: [
			"quick",
			"casual",
			"different"
		],
		styles: ["chill"],
		maxPax: 30,
		blurb: "Chinatown hawker centre. Tian Tian is the famous stall; the next door is often faster."
	},
	{
		id: "ya-kun",
		name: "Ya Kun Kaya Toast",
		kind: "makan",
		area: "Raffles Place",
		address: "Far East Square, 25 China Street, Singapore 049563",
		lat: 1.2834,
		lng: 103.8492,
		cuisine: "Kaya toast",
		price: 1,
		approxSgd: 12,
		dietary: [],
		moods: [
			"quick",
			"coffee",
			"casual"
		],
		styles: ["chill"],
		maxPax: 16,
		blurb: "Kaya toast and kopi. A short breakfast, not a long lunch."
	},
	{
		id: "din-tai-fung",
		name: "Din Tai Fung",
		kind: "makan",
		area: "City Hall",
		address: "Raffles City, 252 North Bridge Road, Singapore 179103",
		lat: 1.294,
		lng: 103.853,
		cuisine: "Dumplings",
		price: 2,
		approxSgd: 25,
		dietary: [],
		moods: ["comfortable", "casual"],
		styles: ["chill"],
		maxPax: 16,
		blurb: "Xiao long bao at Raffles City. Queue is part of the plan."
	},
	{
		id: "coconut-club",
		name: "The Coconut Club",
		kind: "makan",
		area: "Beach Road",
		address: "269 Beach Road, Singapore 199546",
		lat: 1.2984,
		lng: 103.8594,
		cuisine: "Nasi lemak",
		price: 2,
		approxSgd: 22,
		dietary: [],
		moods: [
			"comfortable",
			"different",
			"casual"
		],
		styles: ["chill"],
		maxPax: 12,
		blurb: "Nasi lemak as a sit-down lunch, not a packet."
	},
	{
		id: "violet-oon",
		name: "National Kitchen by Violet Oon",
		kind: "makan",
		area: "Civic District",
		address: "National Gallery Singapore, 1 St Andrew's Road, Singapore 178957",
		lat: 1.2902,
		lng: 103.8514,
		cuisine: "Peranakan",
		price: 3,
		approxSgd: 45,
		dietary: [],
		moods: ["comfortable", "different"],
		styles: ["creative"],
		maxPax: 16,
		blurb: "Peranakan kitchen inside the National Gallery."
	},
	{
		id: "swee-choon",
		name: "Swee Choon",
		kind: "makan",
		area: "Jalan Besar",
		address: "191 Jalan Besar, Singapore 208882",
		lat: 1.3077,
		lng: 103.8565,
		cuisine: "Dim sum",
		price: 1,
		approxSgd: 18,
		dietary: [],
		moods: ["casual", "different"],
		styles: ["chill"],
		maxPax: 20,
		blurb: "Late dim sum. Better after work than at noon."
	},
	{
		id: "zam-zam",
		name: "Zam Zam",
		kind: "makan",
		area: "Kampong Glam",
		address: "697–699 North Bridge Road, Singapore 198675",
		lat: 1.3022,
		lng: 103.8586,
		cuisine: "Murtabak",
		price: 1,
		approxSgd: 14,
		dietary: ["halal"],
		moods: [
			"quick",
			"casual",
			"different"
		],
		styles: ["chill"],
		maxPax: 16,
		blurb: "Halal murtabak on North Bridge Road."
	},
	{
		id: "pariaman",
		name: "Warong Nasi Pariaman",
		kind: "makan",
		area: "Kampong Glam",
		address: "736 North Bridge Road, Singapore 198702",
		lat: 1.3026,
		lng: 103.8598,
		cuisine: "Nasi padang",
		price: 1,
		approxSgd: 14,
		dietary: ["halal"],
		moods: ["quick", "casual"],
		styles: ["chill"],
		maxPax: 16,
		blurb: "Halal nasi padang. Point at the trays."
	},
	{
		id: "indochilli",
		name: "IndoChilli",
		kind: "makan",
		area: "Tanjong Pagar",
		address: "Tanjong Pagar MRT, Singapore",
		lat: 1.2764,
		lng: 103.8454,
		cuisine: "Indonesian",
		price: 1,
		approxSgd: 16,
		dietary: ["halal"],
		moods: ["quick", "casual"],
		styles: ["chill"],
		maxPax: 20,
		blurb: "Halal Indonesian food beside Tanjong Pagar MRT."
	},
	{
		id: "espoir",
		name: "Restaurant Espoir",
		kind: "makan",
		area: "Tanjong Pagar",
		address: "Amoy Street, Singapore",
		lat: 1.2796,
		lng: 103.8475,
		cuisine: "Anglo-French",
		price: 3,
		approxSgd: 48,
		dietary: ["halal"],
		moods: ["comfortable", "different"],
		styles: ["creative"],
		maxPax: 12,
		blurb: "Halal Anglo-French dining on Amoy Street."
	},
	{
		id: "whole-earth",
		name: "Whole Earth",
		kind: "makan",
		area: "Tanjong Pagar",
		address: "76 Peck Seah Street, Singapore 079331",
		lat: 1.2768,
		lng: 103.8436,
		cuisine: "Plant-based Peranakan",
		price: 2,
		approxSgd: 28,
		dietary: ["vegetarian", "vegan"],
		moods: ["comfortable", "different"],
		styles: ["creative"],
		maxPax: 16,
		blurb: "Plant-based Peranakan-Thai. Confirm the vegan plates on the menu."
	},
	{
		id: "blue-ginger",
		name: "The Blue Ginger",
		kind: "makan",
		area: "Tanjong Pagar",
		address: "97 Tanjong Pagar Road, Singapore 088518",
		lat: 1.2756,
		lng: 103.8436,
		cuisine: "Peranakan",
		price: 2,
		approxSgd: 32,
		dietary: [],
		moods: ["comfortable", "different"],
		styles: ["creative"],
		maxPax: 14,
		blurb: "Peranakan shophouse on Tanjong Pagar Road. Not a halal kitchen."
	},
	{
		id: "newton",
		name: "Newton Food Centre",
		kind: "makan",
		area: "Newton",
		address: "500 Clemenceau Avenue North, Singapore 229495",
		lat: 1.3118,
		lng: 103.839,
		cuisine: "Hawker",
		price: 1,
		approxSgd: 15,
		dietary: [],
		moods: ["casual", "different"],
		styles: ["chill", "outdoor"],
		maxPax: 30,
		blurb: "Open-air hawker centre at Newton. Better in the evening."
	},
	{
		id: "ps-cafe",
		name: "PS.Cafe",
		kind: "makan",
		area: "Tanjong Pagar",
		address: "45 Ann Siang Road, Singapore 069719",
		lat: 1.2815,
		lng: 103.8453,
		cuisine: "Cafe",
		price: 2,
		approxSgd: 28,
		dietary: [],
		moods: ["coffee", "comfortable"],
		styles: ["chill"],
		maxPax: 12,
		blurb: "Cafe on Ann Siang. Better for a long coffee than a 30-minute dash."
	},
	{
		id: "jumbo",
		name: "Jumbo Seafood",
		kind: "makan",
		area: "Clarke Quay",
		address: "Riverside Point, 30 Merchant Road, Singapore 058282",
		lat: 1.2908,
		lng: 103.8444,
		cuisine: "Seafood",
		price: 3,
		approxSgd: 55,
		dietary: [],
		moods: ["comfortable", "different"],
		styles: ["chill"],
		maxPax: 20,
		blurb: "Chilli crab at Riverside Point. This is a dinner, not a dash."
	},
	{
		id: "killiney",
		name: "Killiney Kopitiam",
		kind: "makan",
		area: "Somerset",
		address: "67 Killiney Road, Singapore 239525",
		lat: 1.2981,
		lng: 103.8394,
		cuisine: "Kopitiam",
		price: 1,
		approxSgd: 10,
		dietary: [],
		moods: [
			"quick",
			"coffee",
			"casual"
		],
		styles: ["chill"],
		maxPax: 12,
		blurb: "The original Killiney Road kopitiam."
	},
	{
		id: "timbre",
		name: "Timbre+",
		kind: "makan",
		area: "one-north",
		address: "73A Ayer Rajah Crescent, Singapore 139957",
		lat: 1.2998,
		lng: 103.7878,
		cuisine: "Hawker and live music",
		price: 1,
		approxSgd: 16,
		dietary: [],
		moods: ["casual", "different"],
		styles: ["chill"],
		maxPax: 30,
		blurb: "Hawker stalls at one-north, with a stage after dark."
	},
	{
		id: "nylon",
		name: "Nylon Coffee Roasters",
		kind: "makan",
		area: "Everton Park",
		address: "4 Everton Park, Singapore 080004",
		lat: 1.2758,
		lng: 103.8326,
		cuisine: "Coffee",
		price: 1,
		approxSgd: 8,
		dietary: [],
		moods: ["coffee", "quick"],
		styles: ["chill"],
		maxPax: 6,
		blurb: "Small coffee bar. Fine for four, tight for a whole team."
	},
	{
		id: "boulder",
		name: "Boulder Movement",
		kind: "out",
		area: "Bugis",
		address: "Bugis, Singapore",
		lat: 1.2992,
		lng: 103.8554,
		cuisine: "Bouldering",
		price: 2,
		approxSgd: 35,
		dietary: [],
		moods: [],
		styles: [
			"competitive",
			"interactive",
			"indoor"
		],
		maxPax: 20,
		blurb: "Bouldering gym at Bugis. Shoes are rented. No slides required."
	},
	{
		id: "climb-central",
		name: "Climb Central",
		kind: "out",
		area: "Novena",
		address: "Velocity@Novena Square, Singapore",
		lat: 1.3206,
		lng: 103.8437,
		cuisine: "Climbing",
		price: 2,
		approxSgd: 38,
		dietary: [],
		moods: [],
		styles: [
			"competitive",
			"interactive",
			"indoor"
		],
		maxPax: 24,
		blurb: "Climbing gym at Novena. Book a group slot before you promise the afternoon."
	},
	{
		id: "superbowl",
		name: "SuperBowl",
		kind: "out",
		area: "Marina Centre",
		address: "Marina Square, 6 Raffles Boulevard, Singapore 039594",
		lat: 1.291,
		lng: 103.857,
		cuisine: "Bowling",
		price: 2,
		approxSgd: 30,
		dietary: [],
		moods: [],
		styles: [
			"competitive",
			"interactive",
			"indoor"
		],
		maxPax: 30,
		blurb: "Bowling at Marina Square. Easy to explain, easy to join."
	},
	{
		id: "escape-artist",
		name: "The Escape Artist",
		kind: "out",
		area: "Robertson Quay",
		address: "Robertson Quay, Singapore",
		lat: 1.2907,
		lng: 103.8388,
		cuisine: "Escape room",
		price: 2,
		approxSgd: 40,
		dietary: [],
		moods: [],
		styles: [
			"competitive",
			"interactive",
			"creative",
			"indoor"
		],
		maxPax: 18,
		blurb: "Escape rooms at Robertson Quay. Teams split across rooms."
	},
	{
		id: "mind-cafe",
		name: "The Mind Cafe",
		kind: "out",
		area: "Dhoby Ghaut",
		address: "42 Prinsep Street, Singapore 188666",
		lat: 1.2996,
		lng: 103.8495,
		cuisine: "Board games",
		price: 1,
		approxSgd: 18,
		dietary: [],
		moods: ["casual", "coffee"],
		styles: [
			"creative",
			"chill",
			"interactive",
			"indoor"
		],
		maxPax: 20,
		blurb: "Board-game cafe on Prinsep Street. Someone will teach the rules."
	},
	{
		id: "king-pawn",
		name: "King and the Pawn",
		kind: "out",
		area: "Bugis",
		address: "59 Purvis Street, Singapore 188595",
		lat: 1.2983,
		lng: 103.8556,
		cuisine: "Board games",
		price: 2,
		approxSgd: 25,
		dietary: [],
		moods: ["casual", "comfortable"],
		styles: [
			"creative",
			"chill",
			"interactive",
			"indoor"
		],
		maxPax: 16,
		blurb: "Shophouse of board games and drinks on Purvis Street."
	},
	{
		id: "southern-ridges",
		name: "Southern Ridges",
		kind: "out",
		area: "Telok Blangah",
		address: "Henderson Waves, Singapore",
		lat: 1.276,
		lng: 103.8155,
		cuisine: "Walk",
		price: 1,
		approxSgd: 0,
		dietary: [],
		moods: [],
		styles: ["chill", "outdoor"],
		maxPax: 40,
		blurb: "The Henderson Waves walk. Free, shaded in parts, and nobody has to perform."
	},
	{
		id: "gardens",
		name: "Gardens by the Bay",
		kind: "out",
		area: "Marina Bay",
		address: "18 Marina Gardens Drive, Singapore 018953",
		lat: 1.2816,
		lng: 103.8636,
		cuisine: "Gardens",
		price: 1,
		approxSgd: 0,
		dietary: [],
		moods: [],
		styles: [
			"chill",
			"outdoor",
			"creative"
		],
		maxPax: 40,
		blurb: "Outdoor gardens are free. The cooled conservatories are a separate ticket."
	},
	{
		id: "gallery",
		name: "National Gallery Singapore",
		kind: "out",
		area: "Civic District",
		address: "1 St Andrew's Road, Singapore 178957",
		lat: 1.2902,
		lng: 103.8514,
		cuisine: "Gallery",
		price: 1,
		approxSgd: 15,
		dietary: [],
		moods: ["comfortable"],
		styles: [
			"creative",
			"chill",
			"indoor"
		],
		maxPax: 30,
		blurb: "The former City Hall and Supreme Court. Entry rules depend on the day."
	},
	{
		id: "sam",
		name: "Singapore Art Museum at Tanjong Pagar Distripark",
		kind: "out",
		area: "Tanjong Pagar",
		address: "39 Keppel Road, Singapore 089065",
		lat: 1.2722,
		lng: 103.8362,
		cuisine: "Art",
		price: 1,
		approxSgd: 15,
		dietary: [],
		moods: ["different"],
		styles: ["creative", "indoor"],
		maxPax: 25,
		blurb: "SAM in a Keppel Road warehouse. Not a ballroom, not a dinner."
	},
	{
		id: "sccc",
		name: "Singapore Chinese Cultural Centre",
		kind: "out",
		area: "Marina Centre",
		address: "1 Straits Boulevard, Singapore 018906",
		lat: 1.2755,
		lng: 103.8495,
		cuisine: "Culture",
		price: 1,
		approxSgd: 0,
		dietary: [],
		moods: ["comfortable"],
		styles: [
			"creative",
			"chill",
			"indoor"
		],
		maxPax: 30,
		blurb: "Exhibitions and a rooftop garden. Often free to walk in."
	},
	{
		id: "botanic",
		name: "Singapore Botanic Gardens",
		kind: "out",
		area: "Tanglin",
		address: "1 Cluny Road, Singapore 259569",
		lat: 1.3138,
		lng: 103.8159,
		cuisine: "Gardens",
		price: 1,
		approxSgd: 0,
		dietary: [],
		moods: [],
		styles: ["chill", "outdoor"],
		maxPax: 40,
		blurb: "A long walk and a cafe when people get hungry. The garden itself is free."
	},
	{
		id: "east-coast",
		name: "East Coast Park",
		kind: "out",
		area: "East Coast",
		address: "East Coast Park Area C, Singapore",
		lat: 1.3008,
		lng: 103.912,
		cuisine: "Park",
		price: 1,
		approxSgd: 12,
		dietary: [],
		moods: ["casual"],
		styles: [
			"chill",
			"outdoor",
			"competitive"
		],
		maxPax: 40,
		blurb: "Bicycles, sea, and hawker food at the park. Rentals are on site."
	},
	{
		id: "party-world",
		name: "Party World KTV",
		kind: "out",
		area: "Clarke Quay",
		address: "Clarke Quay, Singapore",
		lat: 1.2906,
		lng: 103.846,
		cuisine: "Karaoke",
		price: 2,
		approxSgd: 35,
		dietary: [],
		moods: [],
		styles: [
			"interactive",
			"indoor",
			"creative"
		],
		maxPax: 24,
		blurb: "Private karaoke rooms at Clarke Quay. Opt-in singing, not a talent show."
	},
	{
		id: "thow-kwang",
		name: "Thow Kwang Pottery Jungle",
		kind: "out",
		area: "Jurong",
		address: "85 Lorong Tawas, Singapore 639825",
		lat: 1.355,
		lng: 103.69,
		cuisine: "Pottery",
		price: 2,
		approxSgd: 45,
		dietary: [],
		moods: ["different"],
		styles: ["creative", "interactive"],
		maxPax: 20,
		blurb: "Dragon kiln in western Singapore. A workshop, not a dinner."
	},
	{
		id: "sultan",
		name: "Kampong Glam walk",
		kind: "out",
		area: "Kampong Glam",
		address: "Sultan Mosque, 3 Muscat Street, Singapore 198833",
		lat: 1.3022,
		lng: 103.859,
		cuisine: "Neighbourhood walk",
		price: 1,
		approxSgd: 0,
		dietary: [],
		moods: [],
		styles: [
			"chill",
			"outdoor",
			"creative"
		],
		maxPax: 25,
		blurb: "Start at Sultan Mosque and walk the shophouses. Food is a separate stop."
	}
];
var AREAS = [
	{
		id: "raffles",
		label: "Raffles Place",
		lat: 1.284,
		lng: 103.851
	},
	{
		id: "tanjong",
		label: "Tanjong Pagar",
		lat: 1.276,
		lng: 103.845
	},
	{
		id: "orchard",
		label: "Orchard",
		lat: 1.304,
		lng: 103.832
	},
	{
		id: "bugis",
		label: "Bugis",
		lat: 1.3,
		lng: 103.855
	},
	{
		id: "paya",
		label: "Paya Lebar",
		lat: 1.318,
		lng: 103.893
	},
	{
		id: "onenorth",
		label: "one-north",
		lat: 1.3,
		lng: 103.788
	},
	{
		id: "kampong",
		label: "Kampong Glam",
		lat: 1.302,
		lng: 103.86
	},
	{
		id: "novena",
		label: "Novena",
		lat: 1.32,
		lng: 103.844
	},
	{
		id: "east",
		label: "East Coast",
		lat: 1.301,
		lng: 103.912
	}
];
function areaById(id) {
	return AREAS.find((area) => area.id === id) ?? null;
}
function matchArea(text) {
	const line = text.toLowerCase();
	for (const [needle, id] of [
		["tanjong", "tanjong"],
		["raffles", "raffles"],
		["cbd", "raffles"],
		["hq", "raffles"],
		["orchard", "orchard"],
		["bugis", "bugis"],
		["paya", "paya"],
		["one-north", "onenorth"],
		["onenorth", "onenorth"],
		["one north", "onenorth"],
		["kampong", "kampong"],
		["arab street", "kampong"],
		["novena", "novena"],
		["east coast", "east"],
		["jalan besar", "bugis"],
		["chinatown", "tanjong"],
		["clarke quay", "raffles"]
	]) if (line.includes(needle)) return areaById(id);
	return null;
}
var MINUTES = [
	5,
	10,
	15,
	25
];
function walkMinutes(meters) {
	return Math.max(1, Math.round(meters / 80));
}
function distanceMeters(aLat, aLng, bLat, bLng) {
	const radius = 6371e3;
	const p1 = aLat * Math.PI / 180;
	const p2 = bLat * Math.PI / 180;
	const dLat = (bLat - aLat) * Math.PI / 180;
	const dLng = (bLng - aLng) * Math.PI / 180;
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2;
	return 2 * radius * Math.asin(Math.min(1, Math.sqrt(h)));
}
function mapsLink(name, address) {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`.trim())}`;
}
function priceLabel(price, approx) {
	if (approx === 0) return "Free to enter";
	if (approx) return `~$${approx}/pax`;
	if (price === 1) return "$";
	if (price === 2) return "$$";
	if (price === 3) return "$$$";
	return "Price not listed";
}
var CUISINE_OPTIONS = [
	{
		id: "chinese",
		label: "Chinese"
	},
	{
		id: "japanese",
		label: "Japanese"
	},
	{
		id: "korean",
		label: "Korean"
	},
	{
		id: "western",
		label: "Western"
	},
	{
		id: "indian",
		label: "Indian"
	},
	{
		id: "malay",
		label: "Malay"
	},
	{
		id: "thai",
		label: "Thai"
	},
	{
		id: "vietnamese",
		label: "Vietnamese"
	},
	{
		id: "italian",
		label: "Italian"
	},
	{
		id: "local",
		label: "Local"
	}
];
var MORE_CUISINES = [
	{
		id: "seafood",
		label: "Seafood"
	},
	{
		id: "indonesian",
		label: "Indonesian"
	},
	{
		id: "peranakan",
		label: "Peranakan"
	},
	{
		id: "middle_eastern",
		label: "Middle Eastern"
	},
	{
		id: "mexican",
		label: "Mexican"
	},
	{
		id: "french",
		label: "French"
	}
];
var PLACE_TYPES = [
	{
		id: "restaurant",
		label: "Restaurant"
	},
	{
		id: "cafe",
		label: "Cafe"
	},
	{
		id: "hawker",
		label: "Hawker / Food Centre"
	},
	{
		id: "kopitiam",
		label: "Kopitiam"
	},
	{
		id: "bakery",
		label: "Bakery / Dessert"
	}
];
new Set([...CUISINE_OPTIONS, ...MORE_CUISINES].map((item) => item.id));
var TYPE_CUISINE = {
	chinese_restaurant: "chinese",
	japanese_restaurant: "japanese",
	sushi_restaurant: "japanese",
	ramen_restaurant: "japanese",
	korean_restaurant: "korean",
	indian_restaurant: "indian",
	thai_restaurant: "thai",
	vietnamese_restaurant: "vietnamese",
	italian_restaurant: "italian",
	pizza_restaurant: "italian",
	american_restaurant: "western",
	hamburger_restaurant: "western",
	steak_house: "western",
	seafood_restaurant: "seafood",
	indonesian_restaurant: "indonesian",
	french_restaurant: "french",
	mediterranean_restaurant: "western",
	middle_eastern_restaurant: "middle_eastern",
	turkish_restaurant: "middle_eastern",
	mexican_restaurant: "mexican",
	malaysian_restaurant: "malay"
};
var CUISINE_WORDS = {
	chinese: [
		"chinese",
		"szechuan",
		"sichuan",
		"cantonese",
		"dim sum",
		"dimsum",
		"teochew",
		"hokkien",
		"hakka",
		"dumpling",
		"xiao long bao",
		"zi char"
	],
	japanese: [
		"japanese",
		"sushi",
		"ramen",
		"izakaya",
		"donburi",
		"udon"
	],
	korean: [
		"korean",
		"korean bbq",
		"kbbq"
	],
	western: [
		"western",
		"american",
		"burger",
		"steak",
		"european",
		"british"
	],
	indian: [
		"indian",
		"biryani",
		"tandoor"
	],
	malay: [
		"malay",
		"malaysian",
		"nasi lemak"
	],
	thai: ["thai"],
	vietnamese: ["vietnamese", "pho"],
	italian: [
		"italian",
		"pizza",
		"pasta"
	],
	local: [
		"singaporean",
		"chicken rice",
		"laksa",
		"hainanese",
		"zi char",
		"economy rice"
	],
	seafood: ["seafood"],
	indonesian: [
		"indonesian",
		"nasi padang",
		"padang"
	],
	peranakan: ["peranakan", "nyonya"],
	middle_eastern: [
		"middle eastern",
		"lebanese",
		"turkish",
		"kebab"
	],
	mexican: ["mexican", "taco"],
	french: ["french"]
};
function cuisineLabel(id) {
	return [...CUISINE_OPTIONS, ...MORE_CUISINES].find((item) => item.id === id)?.label ?? id;
}
function placeKindLabel(kind) {
	if (!kind || kind === "other") return "";
	return PLACE_TYPES.find((item) => item.id === kind)?.label ?? "";
}
function inferCuisines(text, types = [], name = "") {
	const found = /* @__PURE__ */ new Set();
	const blob = `${text} ${name}`.toLowerCase().replace(/[_-]+/g, " ");
	for (const [id, words] of Object.entries(CUISINE_WORDS)) if (words.some((word) => blob.includes(word))) found.add(id);
	for (const type of types) {
		const mapped = TYPE_CUISINE[type];
		if (mapped) found.add(mapped);
	}
	return [...found];
}
function classifyPlace(input) {
	const name = (input.name ?? "").toLowerCase();
	const types = new Set(input.types ?? []);
	const amenity = input.amenity ?? "";
	if (/kopitiam|coffeeshop/.test(name) || /\bcoffee shop\b/.test(name)) return "kopitiam";
	if (/hawker|food ?court|food ?centre|food ?center/.test(name) || amenity === "food_court" || types.has("food_court")) return "hawker";
	if (types.has("bakery") || types.has("dessert_shop") || types.has("dessert_restaurant") || types.has("ice_cream_shop") || amenity === "bakery" || amenity === "pastry" || amenity === "confectionery" || amenity === "ice_cream" || /bakery|dessert|gelato|ice cream|cake shop/.test(name)) return "bakery";
	if (types.has("cafe") || types.has("coffee_shop") || amenity === "cafe" || amenity === "coffee") return "cafe";
	if (types.has("restaurant") || amenity === "restaurant" || amenity === "fast_food" || [...types].some((type) => type.endsWith("_restaurant"))) return "restaurant";
	return "other";
}
function annotatePlace(hit, extra = {}) {
	const cuisines = inferCuisines(extra.cuisineText ?? hit.cuisine ?? "", extra.types ?? [], hit.name);
	const placeKind = classifyPlace({
		types: extra.types,
		amenity: extra.amenity,
		name: hit.name
	});
	const label = cuisines.map(cuisineLabel).join(" · ");
	return {
		...hit,
		cuisines,
		placeKind,
		cuisine: label || (extra.cuisineText ? extra.cuisineText.replace(/_/g, " ") : "")
	};
}
function cuisineOk(hit, selected) {
	if (!selected?.length) return true;
	const have = hit.cuisines ?? [];
	if (!have.length) return false;
	return selected.some((id) => have.includes(id));
}
function placeOk(hit, selected) {
	if (!selected?.length) return true;
	if (!hit.placeKind || hit.placeKind === "other") return false;
	return selected.includes(hit.placeKind);
}
function favouriteHit(hit, keys) {
	if (!keys?.length) return false;
	const key = hit.id || hit.name.toLowerCase();
	return keys.includes(key) || keys.includes(hit.name.toLowerCase());
}
function vibeFits(hit, mood) {
	if (!mood) return false;
	if (mood === "coffee") return hit.placeKind === "cafe" || hit.placeKind === "kopitiam";
	if (mood === "comfortable") return hit.placeKind === "restaurant";
	if (mood === "quick") return hit.minutes <= 7 || hit.amenity === "fast_food";
	if (mood === "casual") return hit.placeKind === "hawker" || hit.placeKind === "kopitiam" || hit.placeKind === "cafe";
	return false;
}
function bestMatchScore(hit, ctx = {}) {
	let score = Math.max(0, 30 - Math.min(hit.minutes, 30)) * 4;
	score -= Math.min(hit.meters, 3e3) / 250;
	const cuisines = ctx.cuisines ?? [];
	const places = ctx.placeTypes ?? [];
	if (cuisines.length && (hit.cuisines ?? []).some((id) => cuisines.includes(id))) score += 16;
	if (places.length && hit.placeKind && hit.placeKind !== "other" && places.includes(hit.placeKind)) score += 14;
	if (ctx.dietary && hit.dietary.includes(ctx.dietary)) score += 12;
	if (ctx.budget && hit.approxSgd != null && withinMakanBudget(hit.approxSgd, ctx.budget)) score += 8;
	if (vibeFits(hit, ctx.mood)) score += 10;
	if (favouriteHit(hit, ctx.favouriteKeys)) score += 18;
	const group = ctx.groupSize ?? 1;
	if (group >= 8 && (hit.placeKind === "hawker" || hit.placeKind === "restaurant" || hit.placeKind === "kopitiam")) score += 6;
	if (group >= 8 && (hit.placeKind === "cafe" || hit.placeKind === "bakery")) score -= 4;
	return score;
}
function shuffleHits(hits, seed) {
	const copy = [...hits];
	let state = seed >>> 0 || 1;
	for (let index = copy.length - 1; index > 0; index -= 1) {
		state = Math.imul(state, 1664525) + 1013904223 >>> 0;
		const swap = Math.floor(state / 4294967296 * (index + 1));
		const current = copy[index];
		copy[index] = copy[swap];
		copy[swap] = current;
	}
	return copy;
}
function sortMakanHits(hits, mode, ctx = {}) {
	if (mode === "favourites") return sortMakanHits(hits.filter((hit) => favouriteHit(hit, ctx.favouriteKeys)), "match", ctx);
	if (mode === "random") return shuffleHits(hits, ctx.seed ?? 1);
	if (mode === "closest") return [...hits].sort((a, b) => a.minutes - b.minutes || a.meters - b.meters);
	return [...hits].sort((a, b) => bestMatchScore(b, ctx) - bestMatchScore(a, ctx) || a.minutes - b.minutes || a.meters - b.meters);
}
function resultBlurb(hit, ctx, options) {
	const limit = ctx.minutes ?? hit.minutes;
	const cuisine = (hit.cuisines ?? []).map(cuisineLabel)[0];
	const kind = placeKindLabel(hit.placeKind);
	const meal = (ctx.meal || "meal").toLowerCase();
	if (!hit.verified) return "Straight-line distance only. Walking time was not verified.";
	if (options.mode === "closest" && options.rank === 0) {
		const what = [cuisine, kind].filter(Boolean).join(" ").toLowerCase();
		return what ? `Closest ${what} within your ${limit}-minute limit.` : `Closest option within your ${limit}-minute limit.`;
	}
	if (options.favourite && kind) return `Fits your ${kind.toLowerCase()} preference and is one of your saved favourites.`;
	if (options.favourite) return "One of your saved favourites, and it still fits this search.";
	if (ctx.mood === "quick") return `Best match for a quick ${meal} with ${ctx.groupSize ?? 1} people.`;
	if (ctx.mood === "comfortable" && kind === "Restaurant") return cuisine ? `A sit-down ${cuisine.toLowerCase()} restaurant within your ${limit}-minute limit.` : `A sit-down restaurant within your ${limit}-minute limit.`;
	if (cuisine && kind) return `${cuisine} · ${kind.toLowerCase()} within your ${limit}-minute walk.`;
	if (cuisine) return `${cuisine} option within your ${limit}-minute walk.`;
	if (kind) return `${kind} within your ${limit}-minute walk.`;
	return `Within your ${limit}-minute walk for ${ctx.groupSize ?? 1} people.`;
}
function travelLabel(minutes) {
	if (minutes <= 15) return `${minutes} min walk`;
	if (minutes <= 25) return `${minutes} min, or a short ride`;
	return `about ${minutes} min`;
}
function clampBudget(value) {
	if (value <= 0) return 0;
	if (value < 10) return 1;
	if (value <= 20) return 2;
	return 0;
}
function parseMakan(text, fallback = {}) {
	const line = text.toLowerCase();
	const group = /(\d{1,2})\s*(pax|people|person|staff|of us)/.exec(line);
	const money = /(?:\$|around|about|under|budget)\s*\$?\s*(\d{2,3})/.exec(line) ?? /(\d{2})\s*(?:dollars|bucks|a head|\/pax|per person)/.exec(line);
	const walk = /(\d{1,2})\s*(?:min|minute)/.exec(line);
	const area = matchArea(line);
	let dietary = fallback.dietary ?? "";
	if (line.includes("vegan")) dietary = "vegan";
	else if (line.includes("vegetarian") || line.includes("plant")) dietary = "vegetarian";
	else if (line.includes("halal")) dietary = "halal";
	let mood = fallback.mood ?? "";
	if (line.includes("coffee") || line.includes("kopi")) mood = "coffee";
	else if (line.includes("quick") || line.includes("fast") || line.includes("not too heavy") || line.includes("light")) mood = "quick";
	else if (line.includes("different") || line.includes("something else")) mood = "different";
	else if (line.includes("comfortable") || line.includes("sit down") || line.includes("proper")) mood = "comfortable";
	else if (line.includes("casual")) mood = "casual";
	const minutes = walk ? MINUTES.find((item) => item >= Number(walk[1])) ?? 25 : fallback.minutes ?? 10;
	const timing = line.includes("before") ? "before" : line.includes("after") ? "after" : fallback.timing ?? "";
	return {
		location: fallback.location ?? "",
		areaId: area?.id ?? fallback.areaId ?? "",
		groupSize: group ? Number(group[1]) : fallback.groupSize ?? 4,
		budget: money ? clampBudget(Number(money[1])) : fallback.budget ?? 0,
		dietary,
		minutes,
		mood,
		timing,
		cuisines: fallback.cuisines ?? [],
		placeTypes: fallback.placeTypes ?? []
	};
}
function parseOuting(text) {
	const line = text.toLowerCase();
	const group = /(\d{1,3})\s*(pax|people|person|staff|of us)/.exec(line);
	const money = /(?:\$|around|about|under|budget)\s*\$?\s*(\d{2,3})/.exec(line) ?? /(\d{2,3})\s*(?:dollars|each|a head|\/pax|per person)/.exec(line);
	const area = matchArea(line);
	const styles = [];
	if (/interact|hands-on|do something|bowling|climb|escape/.test(line)) styles.push("interactive");
	if (/creat|art|pottery|workshop|gallery|not another dinner/.test(line)) styles.push("creative");
	if (/chill|walk|easy|not too tiring|conversation|relaxed/.test(line)) styles.push("chill");
	if (/outdoor|outside|park|ridge/.test(line)) styles.push("outdoor");
	if (/indoor|air-?con|rain/.test(line)) styles.push("indoor");
	if (/compet|active|sport/.test(line)) styles.push("competitive");
	const avoid = [];
	if (/not another dinner|no dinner|not dinner|not a dinner/.test(line)) avoid.push("dinner-only");
	if (/not childish|not kids|adult|mixed age|not embarrassing/.test(line)) avoid.push("childish");
	if (/not too hr|not corporate|doesn.?t feel like hr|not team-building|not team building/.test(line)) avoid.push("corporate");
	if (/not too expensive|cheap|budget/.test(line) && !money) avoid.push("pricey");
	let energy = "moderate";
	if (/not too tiring|chill|easy|low key|low-key/.test(line)) energy = "low";
	else if (/active|high energy|sport|climb|bowling/.test(line)) energy = "high";
	let when = "";
	if (line.includes("friday")) when = "Friday";
	if (line.includes("afternoon")) when = when ? `${when} afternoon` : "Afternoon";
	else if (line.includes("after work") || line.includes("evening")) when = when ? `${when} after work` : "After work";
	else if (line.includes("morning")) when = when ? `${when} morning` : "Morning";
	const hoursMatch = /(\d(?:\.\d)?)\s*(?:hour|hr)/.exec(line);
	return {
		groupSize: group ? Math.min(80, Number(group[1])) : 12,
		budget: money ? Number(money[1]) : avoid.includes("pricey") ? 25 : 50,
		areaId: area?.id ?? "",
		areaLabel: area?.label ?? (line.includes("singapore") ? "Singapore" : ""),
		when,
		hours: hoursMatch ? Number(hoursMatch[1]) : 3,
		energy,
		styles: styles.length ? styles : energy === "low" ? ["chill"] : energy === "high" ? ["competitive", "interactive"] : ["interactive"],
		avoid,
		summary: text.trim().slice(0, 280)
	};
}
function dietOk(spot, dietary) {
	if (!dietary) return true;
	if (dietary === "vegan") return spot.dietary.includes("vegan");
	if (dietary === "vegetarian") return spot.dietary.includes("vegetarian") || spot.dietary.includes("vegan");
	if (dietary === "halal") return spot.dietary.includes("halal");
	return true;
}
/** 0 any, 1 under $10, 2 from $10 to $20. Unknown map prices stay in. */
function withinMakanBudget(amount, budget) {
	if (budget === 0 || budget === 3) return true;
	if (amount == null) return true;
	if (budget === 1) return amount < 10;
	return amount >= 10 && amount <= 20;
}
function withinOutingBudget(amount, brief) {
	if (brief.budget >= 200) return true;
	return amount >= (brief.budgetMin ?? 0) && amount <= brief.budget;
}
function makanWhy(hit) {
	const move = travelLabel(hit.minutes);
	const price = hit.approxSgd != null ? `about $${hit.approxSgd} a person.` : "";
	const diet = hit.dietary.includes("halal") ? "Halal." : hit.dietary.includes("vegan") ? "Plant-based." : hit.dietary.includes("vegetarian") ? "Vegetarian." : "";
	const close = hit.minutes <= 10 ? "Close enough that nobody needs to debate transport." : "Far enough to feel like you left the building.";
	return [
		`${move}, ${price}.`,
		diet,
		close
	].filter(Boolean).join(" ");
}
/** Keep places whose routed walk is inside the limit. Missing routes are dropped, not guessed. */
function applyVerifiedWalks(hits, routes, limitMinutes) {
	let resolved = 0;
	const kept = [];
	for (const hit of hits) {
		const route = routes.get(hit.id);
		if (!route || !Number.isFinite(route.seconds) || !Number.isFinite(route.meters)) continue;
		const speed = route.meters / route.seconds;
		if (!Number.isFinite(speed) || speed < .3 || speed > 2.2) continue;
		resolved += 1;
		const minutes = Math.max(1, Math.round(route.seconds / 60));
		if (minutes > limitMinutes) continue;
		const updated = {
			...hit,
			minutes,
			meters: Math.round(route.meters),
			verified: true
		};
		updated.why = makanWhy(updated);
		kept.push(updated);
	}
	return {
		kept,
		resolved
	};
}
function constrainMakan(hits, brief) {
	return hits.filter((hit) => {
		if (!cuisineOk(hit, brief.cuisines)) return false;
		if (!placeOk(hit, brief.placeTypes)) return false;
		if (!dietOk(hit, brief.dietary)) return false;
		const spot = SPOTS.find((item) => item.id === hit.id);
		if (spot && brief.groupSize > spot.maxPax) return false;
		if (brief.mood && spot && !spot.moods.includes(brief.mood)) return false;
		if (brief.budget && !withinMakanBudget(hit.approxSgd, brief.budget)) return false;
		return true;
	});
}
function makanConstraint(brief) {
	const parts = [`≤${brief.minutes} min walk`];
	if (brief.budget === 1) parts.push("under $10/pax");
	else if (brief.budget === 2) parts.push("$10–$20/pax");
	if (brief.dietary === "halal") parts.push("Halal");
	else if (brief.dietary === "vegetarian") parts.push("Vegetarian");
	else if (brief.dietary === "vegan") parts.push("Vegan");
	if (brief.cuisines.length) parts.push(brief.cuisines.map(cuisineLabel).join(" + "));
	if (brief.placeTypes.length) parts.push(brief.placeTypes.map(placeKindLabel).join(" + "));
	if (brief.mood) parts.push(brief.mood);
	return parts.join(" · ");
}
function buildConcepts(origin, brief, roll = 0) {
	const cap = origin ? brief.areaId ? 6e3 : 18e3 : 2e5;
	const shift = Math.max(0, Math.floor(roll));
	const activities = SPOTS.filter((spot) => spot.kind === "out").map((spot) => ({
		spot,
		meters: origin ? distanceMeters(origin.lat, origin.lng, spot.lat, spot.lng) : 0
	})).filter(({ spot, meters }) => meters <= cap && withinOutingBudget(spot.approxSgd, brief) && brief.groupSize <= spot.maxPax).filter(({ spot }) => {
		if (brief.avoid.includes("dinner-only") && spot.kind === "makan") return false;
		if (brief.styles.includes("outdoor") && !spot.styles.includes("outdoor")) return false;
		if (brief.styles.includes("indoor") && spot.styles.includes("outdoor") && !spot.styles.includes("indoor")) return false;
		return true;
	});
	const personalities = [
		{
			id: "competitive",
			personality: "Competitive",
			style: "competitive"
		},
		{
			id: "creative",
			personality: "Creative",
			style: "creative"
		},
		{
			id: "chill",
			personality: "Chill",
			style: "chill"
		}
	];
	const used = /* @__PURE__ */ new Set();
	const concepts = [];
	const order = brief.energy === "low" ? [
		"chill",
		"creative",
		"competitive"
	] : brief.energy === "high" ? [
		"competitive",
		"creative",
		"chill"
	] : brief.avoid.includes("corporate") ? [
		"creative",
		"chill",
		"competitive"
	] : [
		"competitive",
		"creative",
		"chill"
	];
	for (const id of order) {
		const meta = personalities.find((item) => item.id === id);
		if (!meta) continue;
		const pool = activities.filter(({ spot }) => spot.styles.includes(meta.style) && !used.has(spot.id)).sort((a, b) => a.meters - b.meters || a.spot.approxSgd - b.spot.approxSgd);
		let first = pool[0];
		for (let step = 0; step < pool.length; step += 1) {
			const candidate = pool[(shift + step) % pool.length];
			if (candidate && !used.has(candidate.spot.id)) {
				first = candidate;
				break;
			}
		}
		if (!first) continue;
		used.add(first.spot.id);
		const foods = brief.avoid.includes("dinner-only") ? [] : SPOTS.filter((spot) => spot.kind === "makan" && brief.groupSize <= spot.maxPax && spot.id !== first.spot.id).map((spot) => ({
			spot,
			meters: distanceMeters(first.spot.lat, first.spot.lng, spot.lat, spot.lng)
		})).filter(({ meters, spot }) => meters < 1200 && withinOutingBudget(spot.approxSgd, brief)).sort((a, b) => a.meters - b.meters);
		const food = foods.length ? foods[shift % foods.length] ?? null : null;
		const stops = [{
			id: first.spot.id,
			name: first.spot.name,
			address: first.spot.address,
			note: first.spot.blurb,
			lat: first.spot.lat,
			lng: first.spot.lng
		}];
		if (food) stops.push({
			id: food.spot.id,
			name: food.spot.name,
			address: food.spot.address,
			note: `${walkMinutes(food.meters)} min from ${first.spot.name}. ${food.spot.blurb}`,
			lat: food.spot.lat,
			lng: food.spot.lng
		});
		const cost = first.spot.approxSgd + (food ? Math.round(food.spot.approxSgd * .6) : 0);
		const hours = Math.max(2, Math.min(5, brief.hours || 3));
		concepts.push({
			id: meta.id,
			personality: meta.personality,
			title: food ? `${first.spot.name} + ${food.spot.name}` : first.spot.name,
			why: conceptWhy(meta.personality, first.spot, brief),
			hours,
			approxSgd: cost,
			pax: brief.groupSize,
			stops,
			steps: stepsFor(hours, first.spot.name, food?.spot.name ?? "")
		});
	}
	return concepts;
}
function conceptWhy(personality, spot, brief) {
	if (personality === "Competitive") return `${spot.name} is easy to organise and people can join without a rehearsal. Fits about ${brief.groupSize}.`;
	if (personality === "Creative") return `${spot.name} is more memorable than another dinner, without turning the afternoon into a workshop from HR.`;
	return `${spot.name} keeps the cost down and the plan loose. Good if the group would rather talk than perform.`;
}
function stepsFor(hours, primary, food) {
	const endHour = 15 + Math.round(hours);
	const lines = ["2:30 pm · Leave", `3:00 pm · ${primary}`];
	if (food) lines.push(`${clock(endHour - 1)} · ${food}`);
	lines.push(`${clock(endHour)} · Head back`);
	return lines;
}
function clock(hour24) {
	const hour = (hour24 % 24 + 24) % 24;
	const suffix = hour >= 12 ? "pm" : "am";
	return `${hour % 12 || 12}:00 ${suffix}`;
}
function spinOne(items, avoidId) {
	const pool = items.filter((item) => item.id !== avoidId);
	const use = pool.length ? pool : items;
	if (!use.length) return null;
	return use[Math.floor(Math.random() * use.length)] ?? null;
}
function originFromArea(areaId, text) {
	const area = AREAS.find((item) => item.id === areaId) ?? matchArea(text);
	if (!area) return null;
	return {
		lat: area.lat,
		lng: area.lng,
		label: area.label
	};
}
function knownNames() {
	return SPOTS.map((spot) => spot.name);
}
function foreignName(text, allowed) {
	const lower = text.toLowerCase();
	return knownNames().some((name) => !allowed.some((ok) => ok.toLowerCase() === name.toLowerCase()) && lower.includes(name.toLowerCase()));
}
//#endregion
export { sortMakanHits as C, resultBlurb as S, walkMinutes as T, originFromArea as _, SPOTS as a, placeKindLabel as b, buildConcepts as c, distanceMeters as d, foreignName as f, matchArea as g, mapsLink as h, PLACE_TYPES as i, constrainMakan as l, makanWhy as m, CUISINE_OPTIONS as n, annotatePlace as o, makanConstraint as p, MORE_CUISINES as r, applyVerifiedWalks as s, AREAS as t, cuisineLabel as u, parseMakan as v, spinOne as w, priceLabel as x, parseOuting as y };
