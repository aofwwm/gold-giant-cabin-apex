import { o as scoreDating } from "./dating-DQG0N1wV.mjs";
import { t as clipVoice } from "./voice-1qktAoll.mjs";
import { a as SPOTS, d as distanceMeters } from "./coord-Cq5LMP_P.mjs";
import { n as noteCall, r as noteFailure } from "./provider-usage-CqiDrKv8.mjs";
import { KAIROS_VOICE, geminiJson } from "./gemini.server-D3PyYOAp.mjs";
import { n as TtlCache, r as shareRequest } from "./travel-cache-BPZkLeXq.mjs";
import { i as interpretDateBrief, t as acceptModelIntent } from "./dating-intent-C7K9jveX.mjs";
import { n as forecast } from "./family.server-Nh0QeptJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dating.server-CkKxdbA_.js
function place(input) {
	return {
		...input,
		source: "directory"
	};
}
/**
* Dating-only catalogue. Real, walk-in Singapore places spread across the island
* so a date near the east is not secretly a plan for Maxwell and the National Gallery.
* Not added to the shared directory — Makan, Family, and Team Out keep their own lists.
*/
var DATING_PLACES = [
	place({
		id: "date-lagoon",
		name: "East Coast Lagoon Food Village",
		address: "1220 East Coast Parkway, Singapore 468960",
		lat: 1.3009,
		lng: 103.9347,
		role: "meal",
		setting: "outdoor",
		approxSgd: 18,
		cuisine: "Hawker",
		vibes: [
			"foodie",
			"chill",
			"scenic"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Hawker stalls on the park, a short walk from the sea."
	}),
	place({
		id: "date-jumbo-east",
		name: "Jumbo Seafood East Coast",
		address: "1206 East Coast Parkway, Singapore 449886",
		lat: 1.3006,
		lng: 103.9305,
		role: "meal",
		setting: "indoor",
		approxSgd: 55,
		cuisine: "Seafood",
		vibes: [
			"foodie",
			"classy",
			"romantic"
		],
		diets: [],
		alcohol: true,
		opening: "",
		blurb: "Chilli crab on the east coast. Book, or accept the wait."
	}),
	place({
		id: "date-328",
		name: "328 Katong Laksa",
		address: "51 East Coast Road, Singapore 428770",
		lat: 1.3052,
		lng: 103.9046,
		role: "meal",
		setting: "indoor",
		approxSgd: 14,
		cuisine: "Laksa",
		vibes: ["foodie", "chill"],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "A bowl of laksa in Katong. A meal, not an evening by itself."
	}),
	place({
		id: "date-old-airport",
		name: "Old Airport Road Food Centre",
		address: "51 Old Airport Road, Singapore 390051",
		lat: 1.3083,
		lng: 103.8858,
		role: "meal",
		setting: "indoor",
		approxSgd: 16,
		cuisine: "Hawker",
		vibes: ["foodie", "chill"],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "A serious hawker centre. Share two stalls, not one famous queue."
	}),
	place({
		id: "date-tiong-market",
		name: "Tiong Bahru Market",
		address: "30 Seng Poh Road, Singapore 168898",
		lat: 1.2849,
		lng: 103.8326,
		role: "meal",
		setting: "indoor",
		approxSgd: 14,
		cuisine: "Hawker",
		vibes: [
			"foodie",
			"chill",
			"cosy"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Upstairs hawker, downstairs market. Better before the lunch rush ends."
	}),
	place({
		id: "date-tiong-bakery",
		name: "Tiong Bahru Bakery",
		address: "56 Eng Hoon Street, #01-70, Singapore 160056",
		lat: 1.2847,
		lng: 103.8318,
		role: "cafe",
		setting: "indoor",
		approxSgd: 16,
		cuisine: "Bakery",
		vibes: [
			"cosy",
			"chill",
			"foodie"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Pastries and coffee in the estate. A close, not a dinner."
	}),
	place({
		id: "date-adam",
		name: "Adam Road Food Centre",
		address: "2 Adam Road, Singapore 289876",
		lat: 1.3241,
		lng: 103.814,
		role: "meal",
		setting: "indoor",
		approxSgd: 14,
		cuisine: "Hawker",
		vibes: ["foodie", "chill"],
		diets: ["halal"],
		alcohol: false,
		opening: "",
		blurb: "Halal hawker near Bukit Timah. Point, sit, share."
	}),
	place({
		id: "date-chomp",
		name: "Chomp Chomp Food Centre",
		address: "20 Kensington Park Road, Singapore 557269",
		lat: 1.3644,
		lng: 103.8665,
		role: "meal",
		setting: "outdoor",
		approxSgd: 18,
		cuisine: "Hawker",
		vibes: [
			"foodie",
			"fun",
			"chill"
		],
		diets: [],
		alcohol: true,
		opening: "",
		blurb: "Open-air hawker at Serangoon Gardens. Lively at night."
	}),
	place({
		id: "date-changi-village",
		name: "Changi Village Hawker Centre",
		address: "2 Changi Village Road, Singapore 500002",
		lat: 1.3885,
		lng: 103.9876,
		role: "meal",
		setting: "indoor",
		approxSgd: 14,
		cuisine: "Hawker",
		vibes: ["foodie", "chill"],
		diets: ["halal"],
		alcohol: false,
		opening: "",
		blurb: "Nasi lemak country, at the end of the island. Pair it with the boardwalk."
	}),
	place({
		id: "date-zion",
		name: "Zion Riverside Food Centre",
		address: "70 Zion Road, Singapore 247792",
		lat: 1.2925,
		lng: 103.8312,
		role: "meal",
		setting: "indoor",
		approxSgd: 16,
		cuisine: "Hawker",
		vibes: ["foodie", "chill"],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Hawker by the river, a walk from Robertson Quay."
	}),
	place({
		id: "date-satay-bay",
		name: "Satay by the Bay",
		address: "18 Marina Gardens Drive, Singapore 018953",
		lat: 1.2817,
		lng: 103.8686,
		role: "meal",
		setting: "outdoor",
		approxSgd: 22,
		cuisine: "Hawker",
		vibes: [
			"foodie",
			"scenic",
			"chill"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Satay and hawker stalls facing the gardens. Evening is the point."
	}),
	place({
		id: "date-songfa",
		name: "Song Fa Bak Kut Teh",
		address: "11 New Bridge Road, Singapore 059383",
		lat: 1.2855,
		lng: 103.8446,
		role: "meal",
		setting: "indoor",
		approxSgd: 22,
		cuisine: "Bak kut teh",
		vibes: [
			"cosy",
			"foodie",
			"chill"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Peppery bak kut teh in a small room. You will queue. It is still a dinner."
	}),
	place({
		id: "date-samys",
		name: "Samy's Curry",
		address: "25 Dempsey Road, Singapore 249670",
		lat: 1.3046,
		lng: 103.8103,
		role: "meal",
		setting: "indoor",
		approxSgd: 28,
		cuisine: "Indian",
		vibes: [
			"foodie",
			"chill",
			"playful"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Banana-leaf curry in the Dempsey buildings. Messy, which helps."
	}),
	place({
		id: "date-common-man",
		name: "Common Man Coffee Roasters",
		address: "22 Martin Road, Singapore 239058",
		lat: 1.2918,
		lng: 103.8395,
		role: "cafe",
		setting: "indoor",
		approxSgd: 18,
		cuisine: "Coffee",
		vibes: [
			"cosy",
			"quiet",
			"chill"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "A long coffee near Robertson Quay. Better as the open or the close than as dinner."
	}),
	place({
		id: "date-sunday-folks",
		name: "Sunday Folks",
		address: "44 Jalan Merah Saga, #01-52, Singapore 278116",
		lat: 1.3112,
		lng: 103.7955,
		role: "cafe",
		setting: "indoor",
		approxSgd: 18,
		cuisine: "Dessert",
		vibes: [
			"cosy",
			"playful",
			"foodie"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Dessert in Holland Village. Share one thing. Do not order a second dinner."
	}),
	place({
		id: "date-atlas",
		name: "Atlas",
		address: "Parkview Square, 600 North Bridge Road, Singapore 188778",
		lat: 1.3002,
		lng: 103.8574,
		role: "cafe",
		setting: "indoor",
		approxSgd: 32,
		cuisine: "Cocktails",
		vibes: [
			"classy",
			"romantic",
			"quiet"
		],
		diets: [],
		alcohol: true,
		opening: "",
		blurb: "A dressed-up drink in the art deco lobby. Gin is the plot. Not a dinner."
	}),
	place({
		id: "date-museum",
		name: "National Museum of Singapore",
		address: "93 Stamford Road, Singapore 178897",
		lat: 1.2966,
		lng: 103.8485,
		role: "activity",
		setting: "indoor",
		approxSgd: 15,
		cuisine: "Museum",
		vibes: [
			"artsy",
			"quiet",
			"classy"
		],
		diets: [],
		alcohol: false,
		opening: "Mo-Su 10:00-19:00",
		blurb: "One gallery, not the whole museum. You are on a date, not a school trip."
	}),
	place({
		id: "date-acm",
		name: "Asian Civilisations Museum",
		address: "1 Empress Place, Singapore 179555",
		lat: 1.2873,
		lng: 103.8514,
		role: "activity",
		setting: "indoor",
		approxSgd: 15,
		cuisine: "Museum",
		vibes: [
			"artsy",
			"quiet",
			"classy"
		],
		diets: [],
		alcohol: false,
		opening: "Mo-Su 10:00-19:00",
		blurb: "Riverfront museum. Pick one floor and leave while you still want to eat."
	}),
	place({
		id: "date-peranakan",
		name: "Peranakan Museum",
		address: "39 Armenian Street, Singapore 179941",
		lat: 1.2944,
		lng: 103.8489,
		role: "activity",
		setting: "indoor",
		approxSgd: 15,
		cuisine: "Museum",
		vibes: [
			"artsy",
			"cosy",
			"quiet"
		],
		diets: [],
		alcohol: false,
		opening: "Mo-Su 10:00-19:00",
		blurb: "A small museum. The right size for two people who do not want to march."
	}),
	place({
		id: "date-library",
		name: "National Library Building",
		address: "100 Victoria Street, Singapore 188064",
		lat: 1.2975,
		lng: 103.8544,
		role: "activity",
		setting: "indoor",
		approxSgd: 0,
		cuisine: "Library",
		vibes: [
			"quiet",
			"cosy",
			"artsy"
		],
		diets: [],
		alcohol: false,
		opening: "Mo-Su 10:00-21:00",
		blurb: "Free, quiet, and good for a first hour. The view from the upper floors is the excuse."
	}),
	place({
		id: "date-artscience",
		name: "ArtScience Museum",
		address: "6 Bayfront Avenue, Singapore 018974",
		lat: 1.2863,
		lng: 103.8593,
		role: "activity",
		setting: "indoor",
		approxSgd: 20,
		cuisine: "Museum",
		vibes: [
			"artsy",
			"playful",
			"classy"
		],
		diets: [],
		alcohol: false,
		opening: "Mo-Su 10:00-19:00",
		blurb: "The lotus building at Bayfront. Check what is actually on before you promise it."
	}),
	place({
		id: "date-esplanade",
		name: "Esplanade",
		address: "1 Esplanade Drive, Singapore 038981",
		lat: 1.2898,
		lng: 103.8554,
		role: "activity",
		setting: "indoor",
		approxSgd: 0,
		cuisine: "Arts",
		vibes: [
			"classy",
			"scenic",
			"romantic"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Walk the concourse and the roof if it is open. A ticketed show is a different plan."
	}),
	place({
		id: "date-lkc",
		name: "Lee Kong Chian Natural History Museum",
		address: "2 Conservatory Drive, Singapore 117377",
		lat: 1.3013,
		lng: 103.7736,
		role: "activity",
		setting: "indoor",
		approxSgd: 16,
		cuisine: "Museum",
		vibes: [
			"quiet",
			"playful",
			"artsy"
		],
		diets: [],
		alcohol: false,
		opening: "Tu-Su 10:00-19:00",
		blurb: "Whales and bones at NUS. Closed Mondays. Odd in a way that helps a date."
	}),
	place({
		id: "date-science",
		name: "Science Centre Singapore",
		address: "15 Science Centre Road, Singapore 609081",
		lat: 1.3331,
		lng: 103.7357,
		role: "activity",
		setting: "indoor",
		approxSgd: 18,
		cuisine: "Science",
		vibes: [
			"playful",
			"fun",
			"active"
		],
		diets: [],
		alcohol: false,
		opening: "Tu-Su 10:00-18:00",
		blurb: "Hands-on, west side. Better afternoon than date-night. Closed Mondays."
	}),
	place({
		id: "date-hawpar",
		name: "Haw Par Villa",
		address: "262 Pasir Panjang Road, Singapore 118628",
		lat: 1.2844,
		lng: 103.7819,
		role: "activity",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Park",
		vibes: [
			"playful",
			"fun",
			"artsy"
		],
		diets: [],
		alcohol: false,
		opening: "Mo-Su 09:00-19:00",
		blurb: "Mythology dioramas, free, and slightly unhinged. A good surprise, a bad anniversary if you wanted glamour."
	}),
	place({
		id: "date-gillman",
		name: "Gillman Barracks",
		address: "9 Lock Road, Singapore 108937",
		lat: 1.2778,
		lng: 103.8043,
		role: "activity",
		setting: "indoor",
		approxSgd: 0,
		cuisine: "Gallery",
		vibes: [
			"artsy",
			"quiet",
			"classy"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Gallery buildings in the old barracks. Wander two rooms. Some close early."
	}),
	place({
		id: "date-night-safari",
		name: "Night Safari",
		address: "80 Mandai Lake Road, Singapore 729826",
		lat: 1.4022,
		lng: 103.788,
		role: "activity",
		setting: "outdoor",
		approxSgd: 55,
		cuisine: "Night safari",
		vibes: [
			"fun",
			"playful",
			"scenic"
		],
		diets: [],
		alcohol: false,
		opening: "Mo-Su 18:30-23:30",
		blurb: "After dark, up at Mandai. This is the evening, not a prelude to a second dinner."
	}),
	place({
		id: "date-food-playground",
		name: "Food Playground",
		address: "24 Amoy Street, Singapore 069891",
		lat: 1.2801,
		lng: 103.8476,
		role: "activity",
		setting: "indoor",
		approxSgd: 70,
		cuisine: "Cooking class",
		vibes: [
			"playful",
			"foodie",
			"fun"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "A cooking class on Amoy Street. Book it. You cannot walk in and hope."
	}),
	place({
		id: "date-fort-canning",
		name: "Fort Canning Park",
		address: "Fort Canning Park, River Valley Road, Singapore",
		lat: 1.2945,
		lng: 103.8454,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Park",
		vibes: [
			"scenic",
			"quiet",
			"romantic"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "A hill in the middle of town. One loop, then downhill to dinner."
	}),
	place({
		id: "date-barrage",
		name: "Marina Barrage",
		address: "8 Marina Gardens Drive, Singapore 018951",
		lat: 1.2806,
		lng: 103.8707,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "View",
		vibes: [
			"scenic",
			"chill",
			"romantic"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "The green roof is free. You get sky, water, and no ticket queue."
	}),
	place({
		id: "date-macritchie",
		name: "MacRitchie Reservoir",
		address: "MacRitchie Reservoir Park, Singapore",
		lat: 1.342,
		lng: 103.8344,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Nature",
		vibes: [
			"scenic",
			"active",
			"quiet"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "A boardwalk, not a hike you have to finish. Turn around before you are tired of each other."
	}),
	place({
		id: "date-jurong-lake",
		name: "Jurong Lake Gardens",
		address: "Yuan Ching Road, Singapore",
		lat: 1.3346,
		lng: 103.7268,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Park",
		vibes: [
			"scenic",
			"chill",
			"romantic"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "The west-side garden. Lakes, not a mall. Bring the date to the water."
	}),
	place({
		id: "date-pasir-ris",
		name: "Pasir Ris Park",
		address: "Pasir Ris Park, Singapore",
		lat: 1.3816,
		lng: 103.9514,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Park",
		vibes: [
			"scenic",
			"chill",
			"quiet"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Mangroves and a beach park. Slow on purpose."
	}),
	place({
		id: "date-bishan",
		name: "Bishan-Ang Mo Kio Park",
		address: "Bishan-Ang Mo Kio Park, Singapore",
		lat: 1.3624,
		lng: 103.8455,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Park",
		vibes: [
			"scenic",
			"chill",
			"active"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "The river park in the north. A walk, then food nearby. Not a downtown plan."
	}),
	place({
		id: "date-labrador",
		name: "Labrador Nature Reserve",
		address: "Labrador Villa Road, Singapore",
		lat: 1.2663,
		lng: 103.8025,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Park",
		vibes: [
			"scenic",
			"quiet",
			"romantic"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Cliff, war history, and the sea. Short, and better at the end of the day."
	}),
	place({
		id: "date-faber",
		name: "Mount Faber",
		address: "Mount Faber Road, Singapore",
		lat: 1.273,
		lng: 103.819,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "View",
		vibes: [
			"scenic",
			"romantic",
			"quiet"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "A hill and a view of the port. Go for the lookout, not a workout."
	}),
	place({
		id: "date-palawan",
		name: "Palawan Beach",
		address: "Palawan Beach, Sentosa, Singapore",
		lat: 1.2496,
		lng: 103.8224,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Beach",
		vibes: [
			"scenic",
			"romantic",
			"chill"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Sand and a suspension bridge. The island entry is the real cost, not the beach."
	}),
	place({
		id: "date-punggol",
		name: "Punggol Waterway Park",
		address: "Sentul Crescent, Singapore",
		lat: 1.4066,
		lng: 103.9052,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Park",
		vibes: [
			"scenic",
			"chill",
			"active"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "A long waterway in the northeast. Rent nothing. Just walk a stretch of it."
	}),
	place({
		id: "date-coney",
		name: "Coney Island Park",
		address: "Coney Island, Punggol, Singapore",
		lat: 1.4093,
		lng: 103.9216,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Nature",
		vibes: [
			"scenic",
			"quiet",
			"active"
		],
		diets: [],
		alcohol: false,
		opening: "Mo-Su 07:00-19:00",
		blurb: "A wilder park off Punggol. Gates close in the evening. Not a dinner venue."
	}),
	place({
		id: "date-changi-beach",
		name: "Changi Beach Park",
		address: "Nicoll Drive, Singapore",
		lat: 1.391,
		lng: 103.992,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Beach",
		vibes: [
			"scenic",
			"chill",
			"quiet"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "The eastern beach. Pair it with Changi Village, not with a downtown restaurant."
	}),
	place({
		id: "date-dempsey",
		name: "Dempsey Hill",
		address: "11 Dempsey Road, Singapore 249673",
		lat: 1.3048,
		lng: 103.8106,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Neighbourhood walk",
		vibes: [
			"classy",
			"scenic",
			"romantic"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Black-and-white houses and a slow walk. Dinner is one of the rooms, not the car park."
	}),
	place({
		id: "date-robertson",
		name: "Robertson Quay",
		address: "Robertson Quay, Singapore",
		lat: 1.2912,
		lng: 103.8374,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Waterfront",
		vibes: [
			"romantic",
			"scenic",
			"classy"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "The river path. Walk it before you sit down, or after, not both."
	}),
	place({
		id: "date-keong-saik",
		name: "Keong Saik",
		address: "Keong Saik Road, Singapore",
		lat: 1.2804,
		lng: 103.8414,
		role: "scenic",
		setting: "outdoor",
		approxSgd: 0,
		cuisine: "Neighbourhood walk",
		vibes: [
			"cosy",
			"playful",
			"romantic"
		],
		diets: [],
		alcohol: false,
		opening: "",
		blurb: "Shophouse street between Chinatown and the river. Ten minutes of walking is enough."
	}),
	place({
		id: "date-geylang-serai",
		name: "Geylang Serai Market",
		address: "1 Geylang Serai, Singapore 402001",
		lat: 1.3166,
		lng: 103.8966,
		role: "meal",
		setting: "indoor",
		approxSgd: 14,
		cuisine: "Hawker",
		vibes: [
			"foodie",
			"playful",
			"chill"
		],
		diets: ["halal"],
		alcohol: false,
		opening: "",
		blurb: "Halal market and food. Colour, not candlelight."
	}),
	place({
		id: "date-east-coastal",
		name: "The Coastal Settlement",
		address: "200 Netheravon Road, Singapore 508529",
		lat: 1.389061,
		lng: 103.977965,
		role: "meal",
		setting: "indoor",
		approxSgd: 32,
		cuisine: "Cafe restaurant",
		vibes: [
			"cosy",
			"quiet",
			"romantic",
			"chill"
		],
		diets: [],
		alcohol: true,
		opening: "Mo-Fr 10:30-23:00; Sa 08:30-23:00; Su 08:30-22:00",
		blurb: "A quiet old-camp house in Changi. Sit inside and talk. Not the hawker centre down the road."
	}),
	place({
		id: "date-east-little-island",
		name: "Little Island Brewing Co",
		address: "6 Changi Village Road, Singapore 509907",
		lat: 1.389926,
		lng: 103.988706,
		role: "meal",
		setting: "indoor",
		approxSgd: 32,
		cuisine: "Craft taproom",
		vibes: [
			"cosy",
			"chill",
			"foodie"
		],
		diets: [],
		alcohol: true,
		opening: "Tu-We 14:00-22:00; Th 12:00-22:00; Fr-Sa 12:00-00:00; Su 12:00-22:00",
		blurb: "Rustic beer garden behind Changi Village. Indoor seats when you want the breeze without the hawker hall. Weekends can get a band."
	}),
	place({
		id: "date-east-next-door",
		name: "Next Door Spanish Cafe",
		address: "699 East Coast Road, Singapore 459061",
		lat: 1.312082,
		lng: 103.922227,
		role: "meal",
		setting: "indoor",
		approxSgd: 32,
		cuisine: "Spanish bistro",
		vibes: [
			"cosy",
			"romantic",
			"quiet",
			"foodie"
		],
		diets: [],
		alcohol: true,
		opening: "Mo-Th 17:30-23:00; Fr-Sa 12:00-23:00; Su 12:00-21:00",
		blurb: "A small Spanish room in Siglap. Share a few plates. You can hear each other."
	}),
	place({
		id: "date-east-georges",
		name: "Georges @ The Cove",
		address: "133 Pasir Ris Road, Singapore 519149",
		lat: 1.385193,
		lng: 103.944696,
		role: "meal",
		setting: "outdoor",
		approxSgd: 30,
		cuisine: "Bistro",
		vibes: [
			"cosy",
			"chill",
			"scenic",
			"romantic"
		],
		diets: [],
		alcohol: true,
		opening: "Mo-Th 15:00-23:30; Fr 12:00-00:00; Sa 09:00-01:00; Su 09:00-23:30",
		blurb: "The Pasir Ris Park cove. Greenery, a sea breeze, and a table. This is the park Georges, not a second hawker."
	}),
	place({
		id: "date-east-craftsmen",
		name: "Craftsmen Specialty Coffee",
		address: "2 First Street, #01-01 Siglap V, Singapore 458278",
		lat: 1.312847,
		lng: 103.923789,
		role: "cafe",
		setting: "indoor",
		approxSgd: 16,
		cuisine: "Coffee",
		vibes: [
			"cosy",
			"quiet",
			"chill"
		],
		diets: [],
		alcohol: false,
		opening: "Mo-Su 07:00-19:30",
		blurb: "A small Siglap coffee room. Good for a first hour, not a late dinner."
	}),
	place({
		id: "date-east-penny",
		name: "Penny University",
		address: "1 Engku Aman Turn, #01-06 Wisma Geylang Serai, Singapore 408528",
		lat: 1.316494,
		lng: 103.896788,
		role: "cafe",
		setting: "indoor",
		approxSgd: 16,
		cuisine: "Coffee",
		vibes: [
			"cosy",
			"quiet",
			"chill"
		],
		diets: [],
		alcohol: false,
		opening: "Tu-Su 10:00-18:00",
		blurb: "Coffee and cake at Wisma Geylang Serai. Daytime conversation, not a night market."
	}),
	place({
		id: "date-east-birds",
		name: "Birds of Paradise",
		address: "63 East Coast Road, #01-05 The Red House, Singapore 428776",
		lat: 1.305392,
		lng: 103.903484,
		role: "cafe",
		setting: "indoor",
		approxSgd: 12,
		cuisine: "Gelato dessert",
		vibes: [
			"cosy",
			"playful",
			"romantic"
		],
		diets: [],
		alcohol: false,
		opening: "Tu-Su 12:00-22:00",
		blurb: "Botanical gelato in Katong. One shared cup, then the East Coast walk if you still want air."
	}),
	place({
		id: "date-east-common-man",
		name: "Common Man Coffee Roasters Joo Chiat",
		address: "185 Joo Chiat Road, Singapore 427456",
		lat: 1.312079,
		lng: 103.900663,
		role: "cafe",
		setting: "indoor",
		approxSgd: 22,
		cuisine: "Coffee",
		vibes: [
			"cosy",
			"quiet",
			"chill"
		],
		diets: [],
		alcohol: false,
		opening: "Mo 07:30-17:00; Tu-Su 07:30-21:30",
		blurb: "A Joo Chiat shophouse for coffee and a long sit. Quieter than the main road suggests if you take an inside table."
	}),
	place({
		id: "date-east-choice",
		name: "Choice Cuts Goods",
		address: "451 Joo Chiat Road, #01-07 Katong Point, Singapore 427664",
		lat: 1.306918,
		lng: 103.904555,
		role: "cafe",
		setting: "indoor",
		approxSgd: 16,
		cuisine: "Coffee",
		vibes: [
			"cosy",
			"chill",
			"playful"
		],
		diets: [],
		alcohol: true,
		opening: "Tu-Th 11:00-22:00; Fr-Sa 11:00-23:00; Su 11:00-22:00",
		blurb: "Coffee, a sandwich, and something to look at in Katong. A browse, not a food court."
	}),
	place({
		id: "date-east-hub",
		name: "Hub & Spoke Cafe",
		address: "60 Airport Boulevard, #01-T2S-02, Singapore 819643",
		lat: 1.354954,
		lng: 103.989051,
		role: "cafe",
		setting: "indoor",
		approxSgd: 18,
		cuisine: "Cafe",
		vibes: [
			"cosy",
			"quiet",
			"chill",
			"scenic"
		],
		diets: [],
		alcohol: false,
		opening: "Mo-Su 07:30-22:00",
		blurb: "The garden cafe off Changi Terminal 2, public side. Canopy and a quiet table. You do not need a flight."
	}),
	place({
		id: "date-east-bark",
		name: "The Bark Cafe",
		address: "1000 Upper Changi Road North, Singapore 507707",
		lat: 1.362043,
		lng: 103.974006,
		role: "meal",
		setting: "indoor",
		approxSgd: 28,
		cuisine: "Bar and grill",
		vibes: [
			"cosy",
			"chill",
			"romantic"
		],
		diets: [],
		alcohol: true,
		opening: "",
		blurb: "A Changi bar and grill beside the chapel grounds. Sit in. Skip the hawker if you came to talk."
	})
];
function eastConversationalNames() {
	return DATING_PLACES.filter((place) => place.id.startsWith("date-east-")).map((place) => place.name);
}
var DAYS = [
	"Su",
	"Mo",
	"Tu",
	"We",
	"Th",
	"Fr",
	"Sa"
];
var MAGNETS = [
	"lau pa sat",
	"maxwell",
	"newton food",
	"gardens by the bay",
	"din tai fung",
	"national gallery",
	"jumbo seafood",
	"marina bay sands"
];
function hashString(input) {
	let h = 2166136261;
	for (let i = 0; i < input.length; i += 1) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function normalName(value) {
	return value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}
/** True when the label is a district or a walk, not a bookable venue. */
function looksLikeArea(name) {
	const clean = name.trim();
	if (!clean) return false;
	if (/hawker|food centre|food center|food court|restaurant|cafe|café|mall|market|library|museum|hotel|bakery|bistro|kitchen|cinema|theatre|bowling|karaoke|arcade/i.test(clean)) return false;
	if (/park|garden|beach|reservoir|wetland/i.test(clean)) return false;
	return /\b(village|quay|waterfront|promenade|boardwalk|hill)\b/i.test(clean) || /\b(neighbourhood|neighborhood|district)\b/i.test(clean);
}
function placeTitle(place) {
	if (!looksLikeArea(place.name)) return place.name;
	if (/changi village|beach|coast|waterfront|sea|jetty/i.test(`${place.name} ${place.cuisine} ${place.address} ${place.blurb}`) && /village/i.test(place.name)) return `Explore ${place.name} + waterfront`;
	return `Explore ${place.name}`;
}
function namesCollide(a, b) {
	const left = normalName(a);
	const right = normalName(b);
	if (!left || !right) return false;
	if (left === right) return true;
	const shorter = left.length <= right.length ? left : right;
	const longer = left.length <= right.length ? right : left;
	return shorter.length >= 8 && longer.startsWith(`${shorter} `);
}
function discoveryBucket(place) {
	const blob = `${place.name} ${place.cuisine}`.toLowerCase();
	if (/workshop|cooking class|pottery|craft class/.test(blob)) return "workshop";
	if (/festival|pop-up|popup|performance/.test(blob)) return "live event";
	if (/cinema|theatre|theater|karaoke|arcade|bowling|entertainment/.test(blob)) return "entertainment";
	if (/mall|bookstore|bookshop|department store|books\b/.test(blob)) return "shopping";
	if (/museum|gallery|aquarium|attraction|exhibition/.test(blob)) return "attraction";
	if (/park|garden|beach|nature reserve|wetland|mangrove/.test(blob)) return "park";
	if (/dessert|ice cream|bakery|gelato|cake/.test(blob)) return "dessert";
	if (place.role === "scenic") return "scenic";
	if (place.role === "cafe") return "cafe";
	if (place.role === "meal") return "restaurant";
	if (place.role === "activity") return "activity";
	return "other";
}
function placeSpecificity(place) {
	let score = 0;
	if (looksLikeArea(place.name)) score -= 4;
	if (/hawker|food centre|food center|library|museum|mall|park|beach|bowling|karaoke|cinema/i.test(place.name)) score += 2;
	if (place.source === "directory") score += 1;
	if (place.approxSgd > 0) score += 1;
	if (place.opening) score += 1;
	return score;
}
function sameDestination(a, b) {
	if (a.id && a.id === b.id) return true;
	const meters = haversine(a, b);
	const left = normalName(a.name);
	const right = normalName(b.name);
	if (left && left === right && meters < 450) return true;
	const addressA = normalName(a.address);
	const addressB = normalName(b.address);
	if (left && left === right && addressA.length > 8 && addressA === addressB) return true;
	if (meters > 450) return false;
	return namesCollide(a.name, b.name);
}
/** One row per real destination. Provider id, then name + coordinates, then name + address, then a close alias. */
function dedupePlaces(places) {
	const byId = /* @__PURE__ */ new Map();
	for (const place of places) if (!byId.has(place.id)) byId.set(place.id, place);
	const kept = [];
	for (const place of byId.values()) {
		const index = kept.findIndex((other) => sameDestination(place, other));
		if (index < 0) {
			kept.push(place);
			continue;
		}
		const current = kept[index];
		if (!current) continue;
		if (placeSpecificity(place) > placeSpecificity(current) || placeSpecificity(place) === placeSpecificity(current) && place.name.length > current.name.length) kept[index] = place;
	}
	return kept;
}
function cuisineKey(place) {
	return place.cuisine.split(/[;,]/)[0]?.trim().toLowerCase() ?? "";
}
function isMagnet(place) {
	const name = place.name.toLowerCase();
	return MAGNETS.some((magnet) => name.includes(magnet));
}
function loud(place) {
	return /karaoke|bowling|climb|escape|night safari|arcade|bouldering/i.test(`${place.name} ${place.cuisine}`);
}
function hawker(place) {
	return /hawker|food centre|food center|food court|kopitiam|\bmarket\b/i.test(`${place.name} ${place.cuisine}`);
}
/** A room where two people can hear each other. Not a hawker hall. */
function isConversational(place) {
	if (hawker(place) || loud(place)) return false;
	const blob = `${place.name} ${place.cuisine}`;
	if (place.role === "cafe") return true;
	if (place.role === "meal" && /bistro|spanish|coffee|cafe|brew|taproom|grill|western|gelato|dessert|bar/i.test(blob)) return true;
	if (place.role === "meal" && place.vibes.some((vibe) => vibe === "cosy" || vibe === "quiet" || vibe === "romantic")) return true;
	if (place.role === "scenic" && place.vibes.includes("quiet")) return true;
	return false;
}
function quietPlace(place) {
	return place.role === "scenic" || /museum|gallery|library|garden|park|reservoir/i.test(`${place.name} ${place.cuisine}`);
}
function dayToken(dateISO) {
	const [year, month, day] = dateISO.split("-").map(Number);
	if (!year || !month || !day) return null;
	return DAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()] ?? null;
}
function coversDay(spec, day) {
	for (const part of spec.split(",").map((item) => item.trim())) {
		const range = /^([A-Za-z]{2})-([A-Za-z]{2})$/.exec(part);
		if (range) {
			const start = DAYS.indexOf(range[1] ?? "");
			const end = DAYS.indexOf(range[2] ?? "");
			const index = DAYS.indexOf(day);
			if (start < 0 || end < 0 || index < 0) continue;
			if (start <= end && index >= start && index <= end) return true;
			if (start > end && (index >= start || index <= end)) return true;
		} else if (part.slice(0, 2) === day) return true;
	}
	return false;
}
/** True only when the listed hours clearly miss this minute. Unknown hours stay open. */
function likelyClosed(opening, dateISO, minute) {
	const text = opening.trim();
	if (!text || /24\s*\/\s*7/i.test(text)) return false;
	const day = dayToken(dateISO);
	if (!day) return false;
	let sawDay = false;
	let openForDay = false;
	for (const rule of text.split(";").map((item) => item.trim()).filter(Boolean)) {
		const match = /^([A-Za-z]{2}(?:-[A-Za-z]{2})?(?:,[A-Za-z]{2}(?:-[A-Za-z]{2})?)*)\s+(.+)$/.exec(rule);
		if (!match) continue;
		sawDay = true;
		if (!coversDay(match[1] ?? "", day)) continue;
		openForDay = true;
		const hours = match[2] ?? "";
		if (/off|closed/i.test(hours)) return true;
		const span = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/.exec(hours);
		if (!span) return false;
		const open = Number(span[1]) * 60 + Number(span[2]);
		let close = Number(span[3]) * 60 + Number(span[4]);
		if (close <= open) close += 1440;
		const at = minute < open ? minute + 1440 : minute;
		if (at < open - 15 || at > close - 25) return true;
		return false;
	}
	return sawDay && !openForDay;
}
/** Deterministic. The model does not decide whether "full day" means three hours or nine. */
function durationRule(span) {
	if (span === "quick") return {
		min: 90,
		target: 120,
		max: 150,
		minStops: 1,
		maxStops: 2
	};
	if (span === "half") return {
		min: 210,
		target: 255,
		max: 300,
		minStops: 2,
		maxStops: 4
	};
	return {
		min: 420,
		target: 540,
		max: 690,
		minStops: 4,
		maxStops: 7
	};
}
function formatClock(minute) {
	const clock = (minute % 1440 + 1440) % 1440;
	const hour = Math.floor(clock / 60);
	const mins = clock % 60;
	const suffix = hour >= 12 ? "PM" : "AM";
	return `${hour % 12 || 12}:${String(mins).padStart(2, "0")} ${suffix}`;
}
/** Meal and break names follow the clock. 9:14 is never Lunch. 10:37 is never Dinner. */
function clockSlot(minute, role, lean) {
	const clock = (minute % 1440 + 1440) % 1440;
	if (role === "cafe" || lean === "sweet") {
		if (clock < 840) return "Coffee";
		if (clock < 1050) return "Afternoon tea";
		if (clock >= 1260) return "Late dessert";
		return "Dessert";
	}
	if (role === "meal" || lean === "taste") {
		if (clock < 630) return "Breakfast";
		if (clock < 690) return "Brunch";
		if (clock < 870) return "Lunch";
		if (clock < 1050) return "Afternoon bite";
		return clock < 1290 ? "Dinner" : "Supper";
	}
	if (clock < 720) return "Morning";
	if (clock < 1020) return "Afternoon";
	if (clock < 1260) return "Evening";
	return "Late";
}
function nextStart(anchor, previousEnd, travelMin, targetOffset) {
	const earliest = (previousEnd ?? anchor) + Math.max(0, travelMin);
	const target = anchor + Math.max(0, targetOffset);
	return Math.max(anchor, earliest, target);
}
function assessSpan(span, anchor, stops) {
	if (!stops.length) return {
		partial: true,
		line: "Only a partial plan could be verified."
	};
	const rule = durationRule(span);
	const horizon = (stops[stops.length - 1]?.endMin ?? anchor) - anchor;
	if (!stops.every((stop, index) => index === 0 || stop.startMin >= (stops[index - 1]?.endMin ?? 0))) return {
		partial: true,
		line: "Only a partial plan could be verified."
	};
	if (span === "quick" && (stops.length > rule.maxStops || horizon > rule.max + 20)) return {
		partial: true,
		line: "Only a partial plan could be verified."
	};
	if (span === "half" && (horizon < rule.min - 20 || horizon > rule.max + 25)) return {
		partial: true,
		line: "Only a partial plan could be verified."
	};
	if (span === "full") {
		const lateStart = anchor >= 900;
		const midday = stops.some((stop) => stop.kind === "meal" && stop.startMin >= 690 && stop.startMin < 960);
		const reachesEvening = stops.some((stop) => stop.endMin >= 1050);
		const longEnough = horizon >= rule.min;
		const enoughStops = stops.length >= (lateStart ? 3 : rule.minStops);
		if (!longEnough || !enoughStops || !reachesEvening || !(anchor >= 720 || midday)) return {
			partial: true,
			line: "Only a partial plan could be verified."
		};
	}
	return {
		partial: false,
		line: ""
	};
}
function beat(role, minutes, lean, food, offset) {
	return {
		role,
		minutes,
		lean,
		food,
		slot: "Pending",
		targetOffset: Math.max(0, offset)
	};
}
function activityLean(brief) {
	if (brief.foods.includes("museum") || brief.vibes.includes("artsy")) return "look";
	if (brief.foods.some((food) => food === "workshop" || food === "games" || food === "karaoke")) return "play";
	if (brief.foods.some((food) => food === "walk" || food === "view" || food === "nature" || food === "picnic") || brief.vibes.includes("scenic") || brief.setting === "outdoor") return "move";
	if (brief.vibes.some((vibe) => vibe === "fun" || vibe === "playful" || vibe === "active")) return "play";
	if (brief.setting === "indoor" || brief.dateType === "parents") return "look";
	if (brief.dateType === "first") return brief.spin % 2 === 0 ? "move" : "look";
	return [
		"move",
		"look",
		"play"
	][Math.abs(brief.spin) % 3] ?? "move";
}
function roleFor(lean) {
	return lean === "move" ? "scenic" : "activity";
}
function otherLean(lean, spin) {
	return (lean === "move" ? ["look", "play"] : lean === "look" ? ["play", "move"] : ["move", "look"])[Math.abs(spin) % 2] ?? "look";
}
function fullMorning(brief, swap) {
	const start = brief.startMin;
	const primary = activityLean(brief);
	const second = otherLean(primary, brief.spin + (swap ? 1 : 0));
	const third = otherLean(second, brief.spin + 2);
	const firstLean = swap ? second : primary;
	const midLean = swap ? primary : second;
	return {
		id: swap ? "whole-day-swap" : "whole-day",
		label: "The whole day",
		steps: [
			beat(roleFor(firstLean), 80, firstLean, false, 0),
			beat("cafe", 40, "sweet", true, 95),
			beat("meal", 75, "taste", true, Math.max(180, 735 - start)),
			beat(roleFor(midLean), 100, midLean, false, Math.max(270, 825 - start)),
			beat("cafe", 40, "sweet", true, Math.max(390, 930 - start)),
			beat(roleFor(third), 60, third, false, Math.max(450, 1e3 - start)),
			beat("meal", 90, "taste", true, Math.max(520, 1080 - start))
		]
	};
}
function fullForward(brief) {
	const start = brief.startMin;
	const lean = activityLean(brief);
	const second = otherLean(lean, brief.spin);
	const cap = Math.max(120, 1395 - start);
	const horizon = Math.min(540, cap);
	const dinnerClock = start >= 1050 ? start + Math.round(horizon * .35) : Math.max(start + 180, 1050);
	const dinnerOffset = Math.min(Math.max(90, horizon - 90), Math.max(90, dinnerClock - start));
	const drafted = [
		beat(roleFor(lean), 75, lean, false, 0),
		beat("cafe", 35, "sweet", true, Math.min(Math.max(40, dinnerOffset - 50), Math.round(horizon * .22))),
		beat("meal", 80, "taste", true, dinnerOffset),
		beat(roleFor(second), 70, second, false, Math.min(horizon - 80, dinnerOffset + 100)),
		beat("cafe", 40, "sweet", true, Math.min(horizon - 40, Math.max(dinnerOffset + 180, horizon - 50)))
	];
	const steps = [];
	for (const step of drafted) {
		if (step.targetOffset + step.minutes > cap + 20) continue;
		const prev = steps[steps.length - 1];
		if (prev && step.targetOffset < prev.targetOffset + 30) continue;
		steps.push(step);
	}
	return {
		id: "whole-day-forward",
		label: "The long stretch",
		steps: steps.length ? steps : drafted.slice(0, 3)
	};
}
function halfMorning(brief, swap) {
	const start = brief.startMin;
	const lean = activityLean(brief);
	const lunchAt = Math.min(220, Math.max(150, 720 - start));
	const steps = swap ? [
		beat("cafe", 40, "sweet", true, 0),
		beat(roleFor(lean), 80, lean, false, 55),
		beat("meal", 80, "taste", true, lunchAt)
	] : [
		beat(roleFor(lean), 90, lean, false, 0),
		beat("cafe", 40, "sweet", true, 110),
		beat("meal", 80, "taste", true, lunchAt)
	];
	return {
		id: swap ? "half-morning-swap" : "half-morning",
		label: "Until lunch",
		steps
	};
}
function halfAfternoon(brief, swap) {
	const start = brief.startMin;
	const lean = activityLean(brief);
	const dinnerAt = Math.max(190, 1050 - start);
	const steps = swap ? [
		beat("meal", 75, "taste", true, 0),
		beat(roleFor(lean), 70, lean, false, 100),
		beat("cafe", 40, "sweet", true, Math.min(dinnerAt, 230))
	] : [
		beat(roleFor(lean), 80, lean, false, 0),
		beat("cafe", 40, "sweet", true, 100),
		beat("meal", 80, "taste", true, dinnerAt)
	];
	return {
		id: swap ? "half-afternoon-swap" : "half-afternoon",
		label: "The afternoon",
		steps
	};
}
function halfEvening(brief, variant) {
	const lean = activityLean(brief);
	if (variant === 1) return {
		id: "half-table-then-air",
		label: "The table, then air",
		steps: [
			beat("meal", 90, "taste", true, 0),
			beat(roleFor(lean), 60, lean, false, 110),
			beat("cafe", 40, "sweet", true, 190)
		]
	};
	if (variant === 2) return {
		id: "half-hands",
		label: "Do one thing, then eat",
		steps: [beat(roleFor(lean), 80, lean, false, 0), beat("meal", 95, "taste", true, 110)]
	};
	return {
		id: "half-evening",
		label: "The evening",
		steps: [
			beat(roleFor(lean), 70, lean, false, 0),
			beat("meal", 90, "taste", true, 100),
			beat("cafe", 40, "sweet", true, 210)
		]
	};
}
function foodOnly(brief) {
	const meal = brief.foods.includes("cafe") && !brief.foods.includes("dinner") ? "cafe" : "meal";
	const sweet = brief.foods.some((food) => food === "dessert" || food === "cafe" || food === "drinks");
	const steps = [beat(meal, 80, meal === "cafe" ? "sweet" : "taste", true, 0)];
	if (sweet && meal !== "cafe") steps.push(beat("cafe", 40, "sweet", true, 95));
	return {
		id: steps.length > 1 ? "table-and-sweet" : "one-sitting",
		label: steps.length > 1 ? "The meal, then something sweet" : "One sitting",
		steps
	};
}
function shapesFor(brief) {
	if (brief.span === "quick") return [foodOnly(brief)];
	if (brief.span === "full") {
		if (brief.startMin < 720) return [fullMorning(brief, false), fullMorning(brief, true)];
		return [fullForward(brief), fullMorning(brief, false)];
	}
	if (brief.startMin >= 1020) return [
		halfEvening(brief, 0),
		halfEvening(brief, 1),
		halfEvening(brief, 2)
	];
	if (brief.startMin >= 840) return [halfAfternoon(brief, false), halfAfternoon(brief, true)];
	return [halfMorning(brief, false), halfMorning(brief, true)];
}
function pickShape(brief) {
	const shapes = shapesFor(brief);
	return shapes[hashString([
		brief.date,
		brief.dateType,
		brief.span,
		String(brief.startMin),
		brief.foods.join(","),
		brief.vibes.join(","),
		String(brief.spin)
	].join("|")) % shapes.length] ?? shapes[0];
}
function haversine(a, b) {
	const radius = 6371e3;
	const p1 = a.lat * Math.PI / 180;
	const p2 = b.lat * Math.PI / 180;
	const dLat = (b.lat - a.lat) * Math.PI / 180;
	const dLng = (b.lng - a.lng) * Math.PI / 180;
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dLng / 2) ** 2;
	return 2 * radius * Math.asin(Math.min(1, Math.sqrt(h)));
}
function rejected(place, list) {
	const name = normalName(place.name);
	return list.some((item) => item === place.id || normalName(item) === name || namesCollide(item, place.name));
}
function seenPenalty(place, seen) {
	const name = normalName(place.name);
	const index = seen.findIndex((item) => item === place.id || normalName(item) === name);
	if (index < 0) return 0;
	if (index < 3) return 46;
	if (index < 8) return 30;
	return 16;
}
function distanceScore(meters, first, role) {
	if (first) {
		if (meters < 350 && (role === "meal" || role === "cafe")) return -16;
		if (meters < 1600) return 22;
		if (meters < 4e3) return 16;
		if (meters < 7e3) return 6;
		return -10 - Math.min(28, Math.round((meters - 7e3) / 350));
	}
	if (meters < 250) return 4;
	if (meters < 1800) return 24;
	if (meters < 3200) return 12;
	return -16 - Math.min(20, Math.round((meters - 3200) / 400));
}
function scorePlace(place, step, ctx) {
	const fromHere = haversine(ctx.here, place);
	const fromOrigin = haversine(ctx.origin, place);
	let score = distanceScore(ctx.first ? fromOrigin : fromHere, ctx.first, place.role);
	if (!ctx.first && fromOrigin > 9e3) score -= 18;
	score += place.vibes.filter((vibe) => ctx.vibes.includes(vibe)).length * 6;
	score -= seenPenalty(place, ctx.seen);
	if (isMagnet(place) && fromOrigin > 4500) score -= 30;
	else if (isMagnet(place) && fromOrigin > 1200) score -= 8;
	const cuisine = cuisineKey(place);
	if (cuisine && ctx.usedCuisines.includes(cuisine)) score -= 32;
	if (ctx.usedNames.includes(normalName(place.name))) score -= 40;
	if (hawker(place) && ctx.budget >= 120 && ctx.formality !== "casual") score -= 14;
	if (hawker(place) && ctx.budget <= 50) score += 12;
	if (place.approxSgd >= 40 && ctx.budget < 100) score -= 22;
	if (place.approxSgd > 0 && place.approxSgd * 2 <= ctx.budget) score += 4;
	if (ctx.dateType === "first" && ctx.pressure !== "memorable" && loud(place)) score -= 28;
	if (ctx.dateType === "first" && (place.role === "meal" || place.role === "cafe" || quietPlace(place))) score += 6;
	if (ctx.dateType === "parents" && (loud(place) || place.alcohol)) score -= 34;
	if (ctx.dateType === "parents" && place.setting === "indoor" && place.role === "meal") score += 10;
	if ((ctx.dateType === "anniversary" || ctx.formality === "dress") && place.approxSgd >= 35) score += 12;
	if (ctx.dateType === "anniversary" && hawker(place) && ctx.budget >= 100) score -= 10;
	if (ctx.dateType === "surprise" && !isMagnet(place)) score += 5;
	if (ctx.dateType === "married" && !hawker(place) && place.role === "meal") score += 4;
	if (ctx.vibes.includes("quiet") && loud(place)) score -= 16;
	const quietTalk = ctx.vibes.includes("quiet") && (ctx.vibes.includes("cosy") || ctx.crowd === "avoid");
	if (quietTalk && hawker(place)) score -= 58;
	if (quietTalk && loud(place)) score -= 20;
	if (quietTalk && isConversational(place)) score += 18;
	if (ctx.crowd === "avoid" && hawker(place)) score -= 12;
	if (ctx.crowd === "lively" && hawker(place)) score += 6;
	if (step.lean === "move" && place.role === "scenic") score += 16;
	if (step.lean === "look" && /museum|gallery|art|library|culture|aquarium/i.test(`${place.name} ${place.cuisine}`)) score += 16;
	if (step.lean === "play" && /bowl|climb|escape|game|karaoke|cook|pottery|science|bouldering/i.test(`${place.name} ${place.cuisine}`)) score += 16;
	if (step.lean === "talk" && place.setting === "indoor" && !hawker(place)) score += 10;
	if (step.lean === "sweet" && /cafe|dessert|ice|bakery|gelato|kopi|coffee/i.test(`${place.name} ${place.cuisine}`)) score += 8;
	if ((step.lean === "taste" || step.food) && place.role === "meal" && !hawker(place) && ctx.formality !== "casual") score += 6;
	if (place.source === "directory" && place.blurb.length > 40) score += 3;
	score += hashString(`${ctx.seed}|${place.id}`) % 11;
	return score;
}
function fits(place, step) {
	if (place.role === step.role) return true;
	if (step.food) return false;
	if (step.lean === "move" && place.role === "scenic") return true;
	if (step.lean === "look" && (place.role === "activity" || place.role === "scenic")) return true;
	if (step.lean === "play" && place.role === "activity") return true;
	if (place.role === "scenic" || place.role === "activity") return place.role !== step.role;
	return false;
}
function rankPlaces(places, step, ctx, rejectedIds) {
	const eligible = places.filter((place) => {
		if (rejected(place, rejectedIds)) return false;
		if (likelyClosed(place.opening, ctx.date, ctx.minute)) return false;
		return fits(place, step);
	});
	const primary = eligible.filter((place) => place.role === step.role);
	const extra = eligible.filter((place) => place.role !== step.role);
	return (!step.food && primary.length < 3 ? [...primary, ...extra] : primary.length ? primary : extra).map((place) => ({
		place,
		score: scorePlace(place, step, ctx)
	})).sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name)).map((item) => item.place);
}
function pickLine(lines, seed) {
	return lines[hashString(seed) % lines.length] ?? lines[0] ?? "";
}
function doThis(place, step, dateType) {
	const name = place.name;
	const seed = `${name}|${step.slot}|${dateType}|${step.lean}`;
	if (looksLikeArea(name)) return `${placeTitle(place)} is the neighbourhood, not a restaurant. Walk a short stretch. Leave when the conversation has had some air.`;
	if (step.lean === "sweet" || step.role === "cafe") {
		if (step.slot === "Coffee" || step.slot === "Afternoon tea") return pickLine([`A drink and a short pause at ${name}. Then you keep going.`, `${name} is the break, not the destination. One thing to share, then the next part of the day.`], seed);
		return pickLine([`One sweet thing and a drink at ${name}. This closes the date. It is not a second dinner.`, `${name} is the soft landing. Share one thing. If you are both done talking, you are allowed to go home.`], seed);
	}
	if (step.lean === "taste" || step.food && step.role === "meal") {
		if (dateType === "first") return pickLine([`Sit at ${name} and share the meal. Two hours is a full date. You do not owe anyone a second venue.`, `${name} is the conversation. Stay for the sitting. If it goes quiet, that is information, not a reason to add karaoke.`], seed);
		if (dateType === "parents") return `A real table at ${name}. Order as if you mean to feed them well, then let the meal take its time.`;
		if (hawker(place)) return `Share three different plates at ${name}. Not two of the same thing. Leave while you still want the next stop.`;
		return pickLine([`Take a full sitting at ${name}. Share at least one dish. This is the part you cannot rush without ruining the point.`, `Order at ${name} as if the meal is the plan, because it is. Phones down once the food arrives.`], seed);
	}
	if (step.lean === "move" || place.role === "scenic" || /esplanade|quay|boardwalk|concourse/i.test(place.name)) return pickLine([`Walk ${name} without turning it into a photo job. One loop, side by side, then you go eat.`, `Use ${name} for the part where nobody has to hold eye contact. The path does the work. Talk if you want.`], seed);
	if (step.lean === "look") return pickLine([`One room at ${name}, not the whole building. Leave while you still want dinner.`, `At ${name}, pick a single thing to actually look at. The date is what you say about it afterwards.`], seed);
	if (step.lean === "play") return pickLine([`One round at ${name}. Stop while you are still glad you came. Winning is not the evening.`, `${name} gives your hands something to do, so the talking is allowed to be uneven.`], seed);
	return `Spend the time at ${name}, then move on while you still like the idea.`;
}
function lengthLabel(minutes) {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (hours <= 0) return `${rest} min`;
	if (!rest) return `${hours} hr${hours > 1 ? "s" : ""}`;
	return `${hours} hr${hours > 1 ? "s" : ""} ${rest} min`;
}
function landedShape(stops, intended) {
	if (intended.id.startsWith("whole-day") || intended.id.startsWith("half-")) return intended;
	const doing = stops.some((stop) => stop.kind === "scenic" || stop.kind === "activity");
	const meals = stops.filter((stop) => stop.kind === "meal" || stop.kind === "cafe").length;
	const lead = stops[0]?.kind;
	if (doing && meals && (lead === "scenic" || lead === "activity")) {
		if (lead === "activity" && /walk/i.test(intended.label)) return {
			...intended,
			id: "one-room-then-eat",
			label: "One room, then supper"
		};
		return intended;
	}
	if (doing && meals) return {
		...intended,
		id: "table-then-air",
		label: "The table, then air"
	};
	if (!doing && meals > 1) return {
		...intended,
		id: "table-and-sweet",
		label: "The meal, then something sweet"
	};
	if (!doing && meals === 1) return {
		...intended,
		id: "one-sitting",
		label: "One sitting"
	};
	return intended;
}
function narrateDate(input) {
	const { brief, shape, stops } = input;
	const first = stops[0];
	const second = stops[1];
	const third = stops[2];
	const outdoor = stops.filter((stop) => stop.setting === "outdoor");
	const spanMin = first && stops.length ? (stops[stops.length - 1]?.endMin ?? first.endMin) - brief.startMin : 0;
	const moves = Math.max(0, stops.length - 1);
	const moveLine = moves === 0 ? "You stay in one place." : moves === 1 ? "One move between the two stops." : `${moves} moves.`;
	const verdict = assessSpan(brief.span, brief.startMin, stops);
	const lunch = stops.find((stop) => stop.slot === "Lunch" || stop.slot === "Breakfast" || stop.slot === "Brunch");
	const dinner = stops.find((stop) => stop.slot === "Dinner" || stop.slot === "Supper");
	let thesis = first ? `${first.title}. Stay for it. Do not turn a good table into a crawl.` : "I could not build a full evening from places that fit.";
	if (brief.span === "full" && first && lunch && dinner && lunch.title !== dinner.title) thesis = `Leave at ${formatClock(brief.startMin)}. ${first.title} opens it, ${lunch.title} is the middle, and ${dinner.title} is how the day ends.`;
	else if (brief.span === "full" && first) thesis = verdict.partial ? `${first.title} is as far as the day could be verified. It is not a full day yet.` : `${first.title} opens the day. Meals follow the clock, and the hours between them are for doing something.`;
	else if (verdict.partial && first && brief.span !== "quick") thesis = `${first.title} has to carry more of this than it should. Only a partial plan could be verified.`;
	else if (brief.dateType === "first" && first && second && (first.kind === "scenic" || first.kind === "activity")) thesis = `${first.title} is something you do side by side. ${second.title} is where you sit and talk. Either of you can end it after the meal.`;
	else if (brief.dateType === "first" && first && second) thesis = `${first.title} is the meal. ${second.title} only if you are still glad to be sitting there.`;
	else if (brief.dateType === "first" && first) thesis = `${first.title} is the whole date. One sitting, somewhere you can hear each other, and an easy goodnight.`;
	else if (brief.dateType === "anniversary" && first && second) thesis = `${first.title}, then ${second.title}. The sequence is the occasion. You are not collecting venues.`;
	else if (brief.dateType === "parents" && first && second) thesis = `${first.title}, then a seated dinner at ${second.title}. Nothing that needs shouting, and nothing that ends at midnight.`;
	else if (brief.dateType === "parents" && first) thesis = `${first.title} is a proper sit-down. Eat well, talk, and be home before the night gets loud.`;
	else if (brief.dateType === "surprise" && first && second) thesis = `Tell them to meet you at ${first.title}. ${second.title} is the turn — keep that to yourself until you are already walking there.`;
	else if (brief.dateType === "married" && first && second) thesis = `You leave the house for ${first.title}, then ${second.title}. Not a performance. Just not the sofa.`;
	else if (brief.dateType === "casual" && first && second) thesis = `${first.title}, then ${second.title}. Neighbourhood scale. Nobody has to be impressive.`;
	else if (first && second && third) thesis = `${first.title}, then ${second.title}, then ${third.title} only if you are still glad to be out.`;
	else if (first && second) thesis = `${first.title}, then ${second.title}. That is the date: one thing you do, one place you eat.`;
	const dress = brief.formality === "dress" ? outdoor.length ? "Dress for the table. Shoes that can still walk." : "Dress up. This is not a sandals evening." : brief.formality === "casual" ? outdoor.length ? "Casual, and something you can walk in." : "Come as you are. Clean is enough." : brief.dateType === "first" ? "Smart casual. One notch above an errand, well short of a wedding." : outdoor.length ? "Smart casual, with shoes that survive a walk." : "Smart casual. You look like you decided.";
	const rain = !outdoor.length || brief.setting === "indoor" ? "The whole plan is indoors. The forecast can mind itself." : input.backupTitle ? `If it rains, drop ${outdoor[0]?.title ?? "the outdoor stop"} and use ${input.backupTitle} instead. The meal stays.` : outdoor.length === stops.length ? "This one lives outside. If the sky turns, eat earlier and skip the walk." : `If it rains, skip ${outdoor.map((stop) => stop.title).join(" and ")} and stay longer at the indoor stop.`;
	const endClock = stops[stops.length - 1]?.endMin;
	return {
		title: shape.label,
		thesis,
		arc: stops.map((stop) => `${stop.slot} · ${stop.title}`).join(" → "),
		dress,
		pacing: endClock ? `${formatClock(brief.startMin)}–${formatClock(endClock)}. About ${lengthLabel(Math.max(spanMin, 30))}. ${moveLine}` : `About ${lengthLabel(Math.max(spanMin, 30))}. ${moveLine}`,
		rain,
		shape: shape.id,
		partial: verdict.partial,
		note: verdict.partial ? "Only a partial plan could be verified." : input.thin ? "The live map was thin around this start, so I used places I know are real rather than inventing a restaurant." : "Real places, in an order. Prices are typical for two, not a quote."
	};
}
function datingOutdoor(weather, _startMin) {
	if (!weather) return null;
	if (weather.thunder || weather.rainRisk === "high") return false;
	return true;
}
function datingAside(brief, stops, outdoorOk, rain) {
	const hop = stops[0]?.travelMin;
	if (brief.locked.length) return "Keeping this stop. Fixing everything after it.";
	if (brief.rejected.length) return "You're hard to please. One more.";
	if (brief.dateType === "first") return "First date. Keep it simple. Good food, easy conversation, optional second stop.";
	if (brief.freeOnly) return "Romance remains available without GST.";
	if (brief.budget >= 250) return "Okay, somebody is trying.";
	if (brief.setting !== "indoor" && (rain || outdoorOk === false)) return "Rain is in the forecast. Do the indoor bit before the sky changes.";
	if (hop != null && hop >= 30) return `${hop} minutes to the first stop. I would not stretch that for dessert.`;
	if (hop != null) return `${hop} minutes to the first stop. Enough time to decide on dessert.`;
	return "Dinner is sorted. The rest is chemistry, not my department.";
}
var DATE_GEMINI = {
	temperature: .95,
	topP: .95
};
var DATE_WIDEN_NOTE = "Expanded slightly into Siglap/Changi rustic edge for better conversational vibes.";
var OVERPASS = ["https://overpass.openstreetmap.fr/api/interpreter", "https://overpass-api.de/api/interpreter"];
var dateOsmCache = new TtlCache(216e5, 60, "discovery");
var dateRouteCache = new TtlCache(216e5, 400, "routing");
function discoveryRadius(brief) {
	if (brief.travelMode === "walk") return Math.min(4200, Math.max(1800, 800 + brief.maxTravel * 70));
	if (brief.travelMode === "transit") return Math.min(12e3, Math.max(5e3, 2e3 + brief.maxTravel * 160));
	return Math.min(14e3, Math.max(6e3, 2400 + brief.maxTravel * 180));
}
function around(radius, origin) {
	return `(around:${Math.round(radius)},${origin.lat},${origin.lng})`;
}
async function overpass(body) {
	let hash = 0;
	for (let index = 0; index < body.length; index += 1) hash = hash * 33 + body.charCodeAt(index) >>> 0;
	const key = hash.toString(16);
	const cached = dateOsmCache.get(key);
	if (cached) return cached;
	return shareRequest(`date-osm:${key}`, async () => {
		const again = dateOsmCache.peek(key);
		if (again) return again;
		for (const host of OVERPASS) try {
			noteCall("discovery", "overpass-dating");
			const res = await fetch(host, {
				method: "POST",
				headers: {
					"Content-Type": "text/plain",
					"User-Agent": "Kairos/1.0 (dating places)"
				},
				body,
				signal: AbortSignal.timeout(16e3)
			});
			if (!res.ok) continue;
			const elements = (await res.json()).elements ?? [];
			if (elements.length) {
				dateOsmCache.set(key, elements);
				return elements;
			}
		} catch {}
		noteFailure("discovery", "overpass-dating", "Dating places did not load.");
		return [];
	});
}
function weakVenue(name, leisure) {
	if (/carpark|car park|toilet|playground$/i.test(name)) return true;
	if (leisure === "fitness_centre") return true;
	return /anytime fitness|f45|celebrity fitness|pure fitness|fitness first|gymmboxx|ampt fitness|\bblock \d+\b/i.test(name);
}
function classifyOsm(tags, name) {
	const amenity = tags.amenity ?? "";
	const tourism = tags.tourism ?? "";
	const leisure = tags.leisure ?? "";
	const shop = tags.shop ?? "";
	const natural = tags.natural ?? "";
	const blob = `${name} ${amenity} ${tourism} ${leisure} ${shop}`;
	if (weakVenue(name, leisure)) return null;
	if (looksLikeArea(name) && !/hawker|food centre|food center/i.test(name)) return {
		role: "scenic",
		cuisine: /water|beach|coast|quay/i.test(blob) ? "Waterfront" : "Neighbourhood",
		outdoor: true
	};
	if (/karaoke/i.test(blob)) return {
		role: "activity",
		cuisine: "Karaoke",
		outdoor: false
	};
	if (/bowling/i.test(blob)) return {
		role: "activity",
		cuisine: "Bowling",
		outdoor: false
	};
	if (/arcade/i.test(blob)) return {
		role: "activity",
		cuisine: "Arcade",
		outdoor: false
	};
	if (/promenade|boardwalk/i.test(name)) return {
		role: "scenic",
		cuisine: "Waterfront",
		outdoor: true
	};
	if (amenity === "restaurant" || amenity === "food_court") return {
		role: "meal",
		cuisine: (tags.cuisine || "Restaurant").split(";")[0]?.slice(0, 40) || "Restaurant",
		outdoor: false
	};
	if (amenity === "marketplace" && /hawker|food|market/i.test(name)) return {
		role: "meal",
		cuisine: "Hawker",
		outdoor: false
	};
	if (amenity === "cafe" || amenity === "ice_cream" || amenity === "bar" || amenity === "pub" || amenity === "biergarten" || shop === "bakery") return {
		role: "cafe",
		cuisine: shop === "bakery" || amenity === "ice_cream" ? amenity === "ice_cream" ? "Ice cream" : "Bakery" : (tags.cuisine || "Cafe").split(";")[0]?.slice(0, 40) || "Cafe",
		outdoor: amenity === "biergarten"
	};
	if (["cinema", "theatre"].includes(amenity)) return {
		role: "activity",
		cuisine: amenity === "cinema" ? "Cinema" : "Theatre",
		outdoor: false
	};
	if ([
		"museum",
		"gallery",
		"aquarium",
		"theme_park",
		"attraction"
	].includes(tourism)) return {
		role: "activity",
		cuisine: tourism === "theme_park" ? "Attraction" : tourism[0]?.toUpperCase() + tourism.slice(1),
		outdoor: false
	};
	if (tourism === "viewpoint" || natural === "beach" || leisure === "marina") return {
		role: "scenic",
		cuisine: natural === "beach" ? "Beach" : "View",
		outdoor: true
	};
	if ([
		"park",
		"garden",
		"nature_reserve"
	].includes(leisure)) return {
		role: "scenic",
		cuisine: leisure === "park" ? "Park" : "Garden",
		outdoor: true
	};
	if ([
		"library",
		"arts_centre",
		"community_centre",
		"bowling_alley"
	].includes(amenity)) return {
		role: "activity",
		cuisine: amenity === "library" ? "Library" : amenity === "arts_centre" ? "Arts" : "Activity",
		outdoor: false
	};
	if ([
		"sports_centre",
		"ice_rink",
		"miniature_golf",
		"escape_game",
		"water_park",
		"amusement_arcade",
		"bowling_alley"
	].includes(leisure)) return {
		role: "activity",
		cuisine: leisure === "water_park" ? "Water park" : leisure === "escape_game" ? "Escape game" : "Activity",
		outdoor: leisure === "water_park"
	};
	if (shop === "books" || shop === "mall" || shop === "department_store" || shop === "art") return {
		role: "activity",
		cuisine: shop === "mall" || shop === "department_store" ? "Mall" : shop === "books" ? "Books" : "Art",
		outdoor: false
	};
	if (amenity === "marketplace") return {
		role: "activity",
		cuisine: "Market",
		outdoor: false
	};
	return null;
}
function fromElement(element) {
	const tags = element.tags ?? {};
	const name = (tags.name ?? "").replace(/\s+/g, " ").trim();
	const lat = element.lat ?? element.center?.lat;
	const lng = element.lon ?? element.center?.lon;
	if (name.length < 3 || lat == null || lng == null || !element.id) return null;
	const kind = classifyOsm(tags, name);
	if (!kind) return null;
	const address = [
		tags["addr:housenumber"],
		tags["addr:street"],
		tags["addr:postcode"]
	].filter(Boolean).join(" ");
	const outdoor = kind.outdoor || kind.role === "scenic";
	return {
		id: `date-${element.type}-${element.id}`,
		name: name.slice(0, 80),
		address: (address || "Singapore").slice(0, 140),
		lat,
		lng,
		role: kind.role,
		setting: outdoor ? "outdoor" : "indoor",
		approxSgd: 0,
		cuisine: kind.cuisine,
		vibes: outdoor ? ["scenic", "chill"] : kind.role === "cafe" ? ["cosy", "quiet"] : kind.role === "activity" ? ["artsy", "playful"] : ["foodie"],
		diets: tags.cuisine?.includes("halal") ? ["halal"] : [],
		alcohol: tags.amenity === "bar" || tags.amenity === "pub",
		opening: (tags.opening_hours ?? "").slice(0, 80),
		source: "osm",
		blurb: outdoor ? "A mapped place to walk. Price is not on the map." : "Mapped place. Price is not on the map."
	};
}
async function fromMap(origin, radius) {
	const box = around(radius, origin);
	const foodBox = around(Math.min(radius, 4200), origin);
	const food = `[out:json][timeout:20];(nwr["name"]["amenity"~"^(restaurant|cafe|ice_cream|food_court)$"]${foodBox};nwr["name"]["shop"="bakery"]${foodBox};);out center;`;
	const going = `[out:json][timeout:18];(nwr["name"]["amenity"~"^(cinema|theatre|library|arts_centre|community_centre|bowling_alley|marketplace)$"]${box};nwr["name"]["leisure"~"^(sports_centre|ice_rink|miniature_golf|escape_game|bowling_alley|water_park|amusement_arcade|marina)$"]${box};nwr["name"]["tourism"~"^(museum|gallery|attraction|aquarium|theme_park|viewpoint)$"]${box};nwr["name"]["shop"~"^(books|mall|department_store|art)$"]${box};nwr["name"~"karaoke|bowling|arcade|promenade|boardwalk",i]${box};);out center;`;
	const outside = `[out:json][timeout:18];(nwr["name"]["leisure"="park"]${box};nwr["name"]["leisure"="garden"]${box};nwr["name"]["leisure"="nature_reserve"]${box};nwr["name"]["natural"="beach"]${box};);out center;`;
	const batches = await Promise.all([
		overpass(food),
		overpass(going),
		overpass(outside)
	]);
	const seen = /* @__PURE__ */ new Set();
	const hits = [];
	for (const element of batches.flat()) {
		const place = fromElement(element);
		if (!place || seen.has(place.id)) continue;
		seen.add(place.id);
		hits.push(place);
	}
	return hits;
}
function fromDirectory(origin, radius) {
	return [...SPOTS.map((spot) => {
		const outdoor = spot.styles.includes("outdoor") && !spot.styles.includes("indoor");
		const scenic = spot.kind === "out" && /garden|coast|bay|walk|park|view|beach|reservoir/i.test(`${spot.name} ${spot.cuisine} ${spot.blurb}`);
		const cafe = spot.kind === "makan" && (spot.moods.includes("coffee") || /cafe|coffee|dessert|bakery|gelato/i.test(spot.cuisine));
		const role = spot.kind === "makan" ? cafe ? "cafe" : "meal" : scenic ? "scenic" : "activity";
		const vibes = /* @__PURE__ */ new Set();
		if (spot.moods.includes("coffee") || spot.moods.includes("comfortable")) vibes.add("cosy");
		if (spot.styles.includes("chill")) vibes.add("chill");
		if (scenic || outdoor) vibes.add("scenic");
		if (spot.kind === "makan") vibes.add("foodie");
		if (/gallery|museum|art|library/i.test(`${spot.name} ${spot.cuisine}`)) vibes.add("artsy");
		if (spot.price >= 3) vibes.add("classy");
		if (spot.moods.includes("different")) vibes.add("playful");
		if (/karaoke|bowl|climb|escape|game/i.test(`${spot.name} ${spot.cuisine}`)) vibes.add("playful");
		return {
			id: `dir-${spot.id}`,
			name: spot.name,
			address: spot.address,
			lat: spot.lat,
			lng: spot.lng,
			role,
			setting: outdoor ? "outdoor" : "indoor",
			approxSgd: spot.approxSgd,
			cuisine: spot.cuisine,
			vibes: [...vibes],
			diets: spot.dietary,
			alcohol: /bar|wine|cocktail|karaoke/i.test(`${spot.name} ${spot.cuisine}`),
			opening: "",
			source: "directory",
			blurb: spot.blurb
		};
	}), ...DATING_PLACES].filter((place) => distanceMeters(origin.lat, origin.lng, place.lat, place.lng) <= radius);
}
async function routeMinutes(kind, from, to) {
	const key = `${kind}:${from.lat.toFixed(3)},${from.lng.toFixed(3)};${to.lat.toFixed(3)},${to.lng.toFixed(3)}`;
	const cached = dateRouteCache.get(key);
	if (cached !== void 0) return cached;
	return shareRequest(`date-route:${key}`, () => fetchDateRoute(kind, from, to, key));
}
async function fetchDateRoute(kind, from, to, key) {
	const again = dateRouteCache.peek(key);
	if (again !== void 0) return again;
	const path = `${from.lng},${from.lat};${to.lng},${to.lat}`;
	const url = kind === "walk" ? `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${path}?overview=false` : `https://router.project-osrm.org/route/v1/driving/${path}?overview=false`;
	try {
		noteCall("routing", kind === "walk" ? "osm-foot" : "osrm");
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"User-Agent": "Kairos/1.0 (dating routing)"
			},
			signal: AbortSignal.timeout(4500)
		});
		if (!res.ok) return "down";
		const route = (await res.json()).routes?.[0];
		if (!route?.duration || !route.distance) return null;
		const speed = route.distance / route.duration;
		if (kind === "walk" && (speed < .3 || speed > 2.2)) return null;
		if (kind === "drive" && (speed < 1 || speed > 40)) return null;
		const minutes = Math.max(1, Math.round(route.duration / 60));
		if (distanceMeters(from.lat, from.lng, to.lat, to.lng) / (minutes * 60) > (kind === "walk" ? 2.2 : 25)) return null;
		const hit = {
			minutes,
			meters: Math.round(route.distance)
		};
		dateRouteCache.set(key, hit);
		return hit;
	} catch {
		return "down";
	}
}
async function parseDatingIntent(text, today) {
	const local = interpretDateBrief(text, today);
	if (text.trim().length < 8) return local;
	const raw = await geminiJson("Parse a Singapore date-planning brief into JSON. Do not invent venues, addresses, travel times, weather, or prices. budgetMax only if the user stated a number. dateIntent is today, tomorrow, this_friday, this_weekend, or empty. specificDate must be empty. timeOfDay is breakfast, brunch, afternoon, evening, night, or empty. areaText is a region or place name, or empty. budgetLevel is free, cheap, moderate, premium, or empty. vibes and planComponents use only the allowed words. indoorOutdoor is indoor, outdoor, or empty.", text.slice(0, 500), {
		type: "object",
		properties: {
			dateIntent: { type: "string" },
			specificDate: { type: "string" },
			timeOfDay: { type: "string" },
			areaText: { type: "string" },
			budgetLevel: { type: "string" },
			budgetMax: { type: "number" },
			vibes: {
				type: "array",
				items: { type: "string" }
			},
			planComponents: {
				type: "array",
				items: { type: "string" }
			},
			durationPreference: { type: "string" },
			conversationFriendly: { type: "boolean" },
			indoorOutdoor: { type: "string" },
			travelPreference: { type: "string" },
			dateType: { type: "string" },
			specialOccasion: { type: "string" },
			avoid: {
				type: "array",
				items: { type: "string" }
			},
			aside: { type: "string" }
		}
	}, 400, DATE_GEMINI);
	return acceptModelIntent(local, raw, text);
}
function listedAddress(address) {
	const clean = address.replace(/\s+/g, " ").trim();
	if (clean.length < 8 || /^singapore$/i.test(clean) || /^\d+$/.test(clean)) return "Full address was not on the map";
	return clean;
}
function allowed(place, brief, outdoorOk) {
	if (brief.avoid.some((item) => /child|kid/i.test(item)) && /playground|kids|children/i.test(place.name)) return false;
	if (brief.alcohol === "none" && place.alcohol) return false;
	if (brief.diets.length && !brief.diets.every((diet) => place.diets.includes(diet))) return false;
	if (brief.freeOnly && !(place.approxSgd === 0 && place.source === "directory")) return false;
	if (!brief.freeOnly && place.approxSgd > 0 && place.approxSgd * 2 > brief.budget) return false;
	if ((brief.setting === "indoor" || brief.crowd === "avoid") && place.setting === "outdoor" && brief.foods.includes("picnic")) return false;
	if (brief.setting === "indoor" && place.setting !== "indoor") return false;
	if (outdoorOk === false && place.setting === "outdoor" && brief.setting !== "mix") return false;
	return true;
}
var LIVE = {
	taste: "The meal",
	sweet: "The close",
	move: "Side by side",
	look: "One room",
	play: "Hands busy",
	talk: "The conversation"
};
var POOL_CAP = {
	restaurant: 36,
	cafe: 16,
	dessert: 12,
	activity: 22,
	attraction: 12,
	park: 16,
	scenic: 12,
	entertainment: 14,
	shopping: 10,
	workshop: 8,
	"live event": 6,
	other: 8
};
function asArea(place) {
	if (!looksLikeArea(place.name) || place.role === "scenic") return place;
	return {
		...place,
		role: "scenic",
		setting: "outdoor",
		cuisine: place.cuisine || "Neighbourhood"
	};
}
function balancePool(origin, places) {
	const buckets = /* @__PURE__ */ new Map();
	for (const place of places) {
		const bucket = discoveryBucket(place);
		const list = buckets.get(bucket) ?? [];
		list.push(place);
		buckets.set(bucket, list);
	}
	const out = [];
	for (const [bucket, list] of buckets) {
		list.sort((a, b) => distanceMeters(origin.lat, origin.lng, a.lat, a.lng) - distanceMeters(origin.lat, origin.lng, b.lat, b.lng));
		out.push(...list.slice(0, POOL_CAP[bucket] ?? 8));
	}
	return out;
}
function openDuring(place, date, startMin, endMin) {
	if (!place.opening) return true;
	const last = Math.max(startMin + 45, endMin);
	return [
		startMin,
		startMin + Math.round((last - startMin) / 2),
		Math.min(last, 1410)
	].some((minute) => !likelyClosed(place.opening, date, minute));
}
async function tableMinutes(kind, origin, places) {
	const found = /* @__PURE__ */ new Map();
	const host = kind === "walk" ? "https://routing.openstreetmap.de/routed-foot/table/v1/foot" : "https://router.project-osrm.org/table/v1/driving";
	let verified = false;
	for (let index = 0; index < places.length; index += 50) {
		const slice = places.slice(index, index + 50);
		const coords = [`${origin.lng},${origin.lat}`, ...slice.map((place) => `${place.lng},${place.lat}`)].join(";");
		try {
			const res = await fetch(`${host}/${coords}?sources=0&annotations=duration`, {
				headers: {
					Accept: "application/json",
					"User-Agent": "Kairos/1.0 (dating routing)"
				},
				signal: AbortSignal.timeout(7e3)
			});
			if (!res.ok) return verified ? found : null;
			const row = (await res.json()).durations?.[0];
			if (!row) return verified ? found : null;
			verified = true;
			slice.forEach((place, placeIndex) => {
				const seconds = row[placeIndex + 1];
				if (typeof seconds === "number" && Number.isFinite(seconds)) found.set(place.id, Math.max(1, Math.round(seconds / 60)));
			});
		} catch {
			return verified ? found : null;
		}
	}
	return verified ? found : null;
}
async function withinTravel(brief, origin, places) {
	const near = [];
	const check = [];
	for (const place of places) {
		const meters = distanceMeters(origin.lat, origin.lng, place.lat, place.lng);
		if (meters < 280) {
			near.push(place);
			continue;
		}
		if (impossible(brief.travelMode, meters, brief.maxTravel)) continue;
		if (brief.travelMode === "transit") {
			if (Math.max(6, Math.round(meters / 260)) <= brief.maxTravel) near.push(place);
			continue;
		}
		check.push(place);
	}
	if (!check.length) return {
		places: near,
		verified: true
	};
	const table = await tableMinutes(brief.travelMode === "walk" ? "walk" : "drive", origin, check);
	if (!table) return {
		places: [...near, ...check],
		verified: false
	};
	const kept = check.filter((place) => {
		const minutes = table.get(place.id);
		if (minutes == null) return distanceMeters(origin.lat, origin.lng, place.lat, place.lng) <= 900;
		return minutes <= brief.maxTravel;
	});
	return {
		places: [...near, ...kept],
		verified: true
	};
}
function impossible(mode, meters, maxMin) {
	if (mode === "walk") return meters / 75 > maxMin;
	if (mode === "transit") return meters / 220 > maxMin;
	return meters / 420 > maxMin;
}
async function travelLeg(brief, from, fromName, place, maxMin, router) {
	const meters = distanceMeters(from.lat, from.lng, place.lat, place.lng);
	if (meters < 280) return {
		minutes: 3,
		meters: Math.round(meters),
		label: `a short hop from ${fromName}`
	};
	if (impossible(brief.travelMode, meters, maxMin)) return null;
	if (brief.travelMode === "transit") {
		const minutes = Math.max(6, Math.round(meters / 260));
		if (minutes > maxMin) return null;
		return {
			minutes,
			meters: Math.round(meters),
			label: `${minutes} min by public transport from ${fromName}, estimated`
		};
	}
	const kind = brief.travelMode === "walk" ? "walk" : "drive";
	const key = `${kind}:${from.lat.toFixed(4)},${from.lng.toFixed(4)}:${place.id}`;
	if (!router.down) {
		let live = router.cache.get(key);
		if (live === void 0) {
			const routed = await routeMinutes(kind, from, place);
			if (routed === "down") {
				router.down = true;
				live = null;
			} else {
				live = routed;
				router.cache.set(key, live);
			}
		}
		if (live) {
			if (live.minutes > maxMin) return null;
			const word = brief.travelMode === "walk" ? "walk" : "drive";
			return {
				minutes: live.minutes,
				meters: live.meters,
				label: `${live.minutes} min ${word} from ${fromName}`
			};
		}
		if (!router.down && meters > 1800) return null;
	}
	const speed = brief.travelMode === "walk" ? 75 : 380;
	const minutes = Math.max(4, Math.round(meters / speed));
	if (minutes > maxMin) return null;
	const word = brief.travelMode === "walk" ? "walk" : "drive";
	return {
		minutes,
		meters: Math.round(meters),
		label: `about ${minutes} min ${word} from ${fromName}, estimated`
	};
}
function asLocked(lock) {
	return {
		id: lock.placeId,
		name: lock.title,
		address: lock.address,
		lat: lock.latitude,
		lng: lock.longitude,
		role: lock.kind,
		setting: lock.setting,
		approxSgd: 0,
		cuisine: "",
		vibes: [],
		diets: [],
		alcohol: false,
		opening: "",
		source: "directory",
		blurb: "Kept from the stop you locked."
	};
}
function claimLock(step, locks) {
	const index = locks.findIndex((lock) => lock.kind === step.role);
	if (index < 0) return null;
	return locks.splice(index, 1)[0] ?? null;
}
function toPlanBrief(brief) {
	return {
		dateType: brief.dateType,
		date: brief.date,
		startMin: brief.startMin,
		span: brief.span,
		budget: brief.budget,
		freeOnly: brief.freeOnly,
		setting: brief.setting,
		vibes: brief.vibes,
		foods: brief.foods,
		pressure: brief.pressure,
		formality: brief.formality,
		crowd: brief.crowd,
		area: brief.area,
		seen: brief.seen ?? [],
		rejected: brief.rejected ?? [],
		spin: brief.spin ?? brief.rejected?.length ?? 0
	};
}
function quietTalk(brief) {
	const cosy = brief.vibes.includes("cosy");
	const quiet = brief.vibes.includes("quiet");
	if (cosy && quiet) return true;
	return (brief.crowd === "avoid" || /\b(talk|conversation)\b/i.test(brief.text)) && (cosy || quiet);
}
function nearPasirRis(brief) {
	const blob = `${brief.area} ${brief.originAddress}`.toLowerCase();
	if (/pasir ris|loyang|downtown east/.test(blob)) return true;
	return distanceMeters(brief.latitude, brief.longitude, 1.37305, 103.9493) <= 4500;
}
function eastSide(brief) {
	const blob = `${brief.area} ${brief.originAddress} ${brief.text}`.toLowerCase();
	if (/pasir ris|tampines|bedok|changi|katong|siglap|joo chiat|joochiat|east coast|loyang|simei|geylang serai/.test(blob)) return true;
	return brief.longitude >= 103.88 && brief.latitude >= 1.29 && brief.latitude <= 1.43;
}
async function searchDating(brief) {
	const origin = {
		lat: brief.latitude,
		lng: brief.longitude
	};
	const bannedNames = [...new Set((brief.rejectedVenues ?? []).map((name) => name.trim()).filter(Boolean))].slice(0, 48);
	const rejected = [.../* @__PURE__ */ new Set([...brief.rejected ?? [], ...bannedNames])].slice(0, 48);
	const next = {
		...brief,
		seen: brief.seen ?? [],
		rejected,
		rejectedVenues: bannedNames
	};
	const widenReady = quietTalk(next) && nearPasirRis(next);
	const radius = Math.max(discoveryRadius(next), widenReady ? 12e3 : 0);
	const [mapped, cast] = await Promise.all([fromMap(origin, radius), forecast(origin, brief.date)]);
	const weather = cast.weather;
	const outdoorOk = datingOutdoor(weather, next.startMin);
	const rule = durationRule(next.span);
	const rawPlaces = [...fromDirectory(origin, radius), ...mapped].map(asArea);
	const unique = dedupePlaces(rawPlaces).filter((place) => distanceMeters(origin.lat, origin.lng, place.lat, place.lng) <= radius);
	const byCategory = {};
	for (const place of unique) {
		const bucket = discoveryBucket(place);
		byCategory[bucket] = (byCategory[bucket] ?? 0) + 1;
	}
	const geographic = unique;
	const shortlist = balancePool(origin, geographic);
	const travelled = await withinTravel(next, origin, shortlist);
	const afterTravel = travelled.places;
	const afterOpening = afterTravel.filter((place) => openDuring(place, next.date, next.startMin, next.startMin + rule.max));
	let pool = afterOpening.filter((place) => allowed(place, next, outdoorOk));
	let widened = false;
	if (widenReady && pool.filter(isConversational).length < 4) {
		const again = await withinTravel({
			...next,
			maxTravel: Math.max(next.maxTravel, 22)
		}, origin, shortlist);
		const have = new Set(pool.map((place) => place.id));
		const extra = again.places.filter((place) => !have.has(place.id) && isConversational(place) && openDuring(place, next.date, next.startMin, next.startMin + rule.max) && allowed(place, next, outdoorOk));
		if (extra.length) {
			pool = [...pool, ...extra];
			widened = true;
		}
	}
	const vibeMatches = pool.filter((place) => next.vibes.length === 0 || place.vibes.some((vibe) => next.vibes.includes(vibe))).length;
	const discovery = {
		area: next.area,
		raw: rawPlaces.length,
		unique: unique.length,
		byCategory,
		afterGeographic: geographic.length,
		afterTravel: afterTravel.length,
		travelVerified: travelled.verified,
		afterOpeningHours: afterOpening.length,
		afterDateVibe: pool.length,
		vibeMatches,
		widened,
		passedToPlanner: pool.length
	};
	console.info("[DATE DISCOVERY]", discovery);
	const planBrief = toPlanBrief(next);
	const shape = pickShape(planBrief);
	console.info("[DATE PLAN]", {
		planType: next.span,
		startTime: formatClock(next.startMin),
		targetDurationMinutes: rule.target,
		minimumEndTime: formatClock(next.startMin + rule.min),
		maximumEndTime: formatClock(next.startMin + rule.max),
		shape: shape.id,
		stops: shape.steps.length
	});
	console.info("[dating-origin]", {
		name: brief.area,
		address: brief.originAddress,
		provider: brief.originProvider,
		id: brief.originId,
		latitude: brief.latitude,
		longitude: brief.longitude,
		shape: shape.id,
		pool: pool.length
	});
	const router = {
		down: false,
		cache: /* @__PURE__ */ new Map()
	};
	const used = /* @__PURE__ */ new Set();
	const usedCuisines = [];
	const usedNames = [];
	const locks = [...next.locked];
	let here = origin;
	let fromName = brief.area;
	let spent = 0;
	let previousEnd = null;
	const chosen = [];
	for (let index = 0; index < shape.steps.length; index += 1) {
		const step = shape.steps[index];
		const stepNow = outdoorOk === false && next.setting !== "mix" && next.setting !== "outdoor" && step.role === "scenic" ? {
			...step,
			role: "activity",
			lean: step.lean === "move" ? "look" : step.lean
		} : step;
		const intended = nextStart(next.startMin, previousEnd, 0, stepNow.targetOffset);
		const lock = claimLock(stepNow, locks);
		const lockedPlace = lock ? pool.find((place) => place.id === lock.placeId) ?? asLocked(lock) : null;
		const ranked = lockedPlace ? [lockedPlace] : rankPlaces(pool.filter((place) => !used.has(place.id)), stepNow, {
			origin,
			here,
			first: chosen.length === 0,
			vibes: next.vibes,
			dateType: next.dateType,
			pressure: next.pressure,
			crowd: next.crowd,
			formality: next.formality,
			budget: next.budget,
			seen: next.seen,
			usedCuisines,
			usedNames,
			seed: `${shape.id}|${stepNow.lean}|${stepNow.targetOffset}|${next.date}|${planBrief.spin}|${fromName}`,
			minute: intended,
			date: next.date
		}, next.rejected);
		const hop = chosen.length === 0 ? next.maxTravel : Math.min(next.maxTravel, next.tightSecondLeg ? 15 : next.span === "full" ? 35 : 25);
		const laterFood = shape.steps.slice(index).filter((item) => item.food).length - (stepNow.food ? 1 : 0);
		const room = Math.max(0, next.budget - spent);
		const ceiling = laterFood > 0 ? Math.max(0, room - laterFood * 16) : room;
		let picked = null;
		let routed = 0;
		const attemptCap = 12;
		for (const place of ranked) {
			if (!lockedPlace && usedNames.some((name) => namesCollide(name, place.name))) continue;
			const couple = place.approxSgd > 0 ? place.approxSgd * 2 : 0;
			if (!lockedPlace && !next.freeOnly && couple > ceiling) continue;
			if (routed >= attemptCap) break;
			const meters = distanceMeters(here.lat, here.lng, place.lat, place.lng);
			if (!impossible(next.travelMode, meters, next.maxTravel)) routed += 1;
			const leg = await travelLeg(next, here, fromName, place, hop, router) ?? (hop < next.maxTravel ? await travelLeg(next, here, fromName, place, next.maxTravel, router) : null);
			if (!leg) continue;
			if (outdoorOk === false && place.setting === "outdoor" && next.setting !== "mix") continue;
			const start = nextStart(next.startMin, previousEnd, leg.minutes, stepNow.targetOffset);
			const end = start + stepNow.minutes;
			if (end > 1430) continue;
			if (next.span !== "full" && end > next.startMin + rule.max + 15) continue;
			picked = {
				place,
				minutes: leg.minutes,
				meters: leg.meters,
				label: leg.label,
				step: stepNow,
				start,
				end
			};
			break;
		}
		if (!picked) continue;
		console.info("[dating-leg]", {
			from: fromName,
			destination: picked.place.name,
			minutes: picked.minutes,
			meters: picked.meters,
			slot: clockSlot(picked.start, picked.place.role, picked.step.lean)
		});
		used.add(picked.place.id);
		const cuisine = picked.place.cuisine.split(/[;,]/)[0]?.trim().toLowerCase();
		if (cuisine) usedCuisines.push(cuisine);
		usedNames.push(normalName(picked.place.name));
		chosen.push(picked);
		if (picked.place.approxSgd > 0) spent += picked.place.approxSgd * 2;
		here = {
			lat: picked.place.lat,
			lng: picked.place.lng
		};
		fromName = picked.place.name;
		previousEnd = picked.end;
	}
	const kept = [];
	for (const item of chosen) {
		if (item.start < next.startMin || item.end <= item.start) continue;
		const prev = kept[kept.length - 1];
		if (prev && item.start < prev.end) continue;
		if (kept.length >= rule.maxStops) break;
		if (next.span !== "full" && item.end - next.startMin > rule.max + 20) continue;
		kept.push(item);
	}
	const stops = kept.map((item) => {
		const slot = clockSlot(item.start, item.place.role, item.step.lean);
		const labeled = {
			...item.step,
			slot
		};
		return {
			id: item.place.id,
			kind: item.place.role,
			title: placeTitle(item.place),
			address: listedAddress(item.place.address),
			latitude: item.place.lat,
			longitude: item.place.lng,
			startMin: item.start,
			endMin: item.end,
			setting: item.place.setting,
			travelMin: item.minutes,
			travelLabel: item.label,
			cost: item.place.approxSgd > 0 ? item.place.approxSgd : null,
			why: item.place.blurb,
			doThis: doThis(item.place, labeled, next.dateType),
			placeId: item.place.id,
			liveLabel: LIVE[item.step.lean],
			opening: item.place.opening,
			slot
		};
	});
	const indoor = next.setting !== "indoor" && stops.some((stop) => stop.setting === "outdoor") ? rankPlaces(pool.filter((place) => place.setting === "indoor" && !used.has(place.id)), {
		role: "activity",
		minutes: 45,
		slot: "Rain",
		food: false,
		lean: "look",
		targetOffset: 0
	}, {
		origin,
		here,
		first: false,
		vibes: next.vibes,
		dateType: next.dateType,
		pressure: next.pressure,
		crowd: next.crowd,
		formality: next.formality,
		budget: next.budget,
		seen: next.seen,
		usedCuisines,
		usedNames,
		seed: `${shape.id}|rain|${next.date}`,
		minute: next.startMin,
		date: next.date
	}, next.rejected).slice(0, 4) : [];
	let backupPick = null;
	for (const place of indoor) {
		const leg = await travelLeg(next, here, fromName, place, next.maxTravel, router);
		if (!leg) continue;
		backupPick = {
			place,
			...leg
		};
		break;
	}
	const backup = backupPick ? {
		title: placeTitle(backupPick.place),
		address: listedAddress(backupPick.place.address),
		travelLabel: backupPick.label,
		setting: backupPick.place.setting
	} : null;
	const told = landedShape(stops, shape);
	const plan = stops.length ? narrateDate({
		brief: planBrief,
		shape: told,
		stops,
		backupTitle: backup?.title ?? null,
		thin: mapped.length < 4
	}) : null;
	const score = kept.length ? scoreDating(kept.map((item) => item.place), {
		vibes: next.vibes,
		foods: next.foods,
		budget: next.budget,
		freeOnly: next.freeOnly,
		travelMin: kept[0]?.minutes ?? null,
		maxTravel: next.maxTravel,
		weatherOutdoor: outdoorOk,
		stops: kept.length
	}) : null;
	const known = stops.reduce((sum, stop) => sum + (stop.cost ?? 0), 0);
	const spend = known > 0 ? known * 2 : null;
	let why = datingAside(next, stops, outdoorOk, Boolean(weather?.thunder) || outdoorOk === false);
	const banLine = bannedNames.length ? `BANNED VENUES (Do NOT suggest these again): ${bannedNames.join(", ")}` : "";
	const eastLine = eastSide(next) ? `East conversational rooms already on the real list: ${eastConversationalNames().join(", ")}. Prefer that character over a hawker centre when one of them is in the stops. Do not invent a venue.` : "";
	if (stops.length) {
		const raw = await geminiJson(`${KAIROS_VOICE} Write one dry sentence as 月老, maximum 18 words, about this date's shape. Comment only on the JSON. Do not invent weather, times, prices, or places. No destiny, fate, soulmate, or love. No emoji. Do not mention a banned venue. Do not name a place that is not in the JSON titles.`, [
			banLine,
			eastLine,
			JSON.stringify({
				shape: shape.label,
				type: next.dateType,
				rerolled: bannedNames.length > 0,
				titles: stops.map((stop) => stop.title),
				weather: weather ? weather.windowNote : null
			})
		].filter(Boolean).join("\n"), {
			type: "object",
			properties: { why: { type: "string" } }
		}, 80, DATE_GEMINI);
		if (raw && typeof raw === "object" && "why" in raw && typeof raw.why === "string") why = clipVoice(raw.why, 18) || why;
	}
	const cupid = next.setting === "indoor" ? "月老 gives this one a quiet nod." : !weather ? "Timing looks good. The forecast did not come back." : weather.thunder || outdoorOk === false ? "Cupid approves, quietly. The weather still decides anything outdoors." : "月老 gives this one a quiet nod.";
	const widenNote = widened ? DATE_WIDEN_NOTE : "";
	return {
		weather,
		stops,
		backup,
		score,
		spend,
		why,
		cupid,
		eventsNote: [widenNote, plan?.note ?? ""].filter(Boolean).join(" "),
		understood: [
			next.dateType.replace("night", "date night"),
			told.label,
			next.vibes.length ? next.vibes.join(" · ") : "Open vibe",
			next.area,
			next.freeOnly ? "Free" : `≤ $${next.budget} for two`,
			weather ? `${weather.windowLabel}. ${weather.windowNote}.` : "Weather unavailable"
		],
		plan,
		discovery,
		widenNote
	};
}
//#endregion
export { parseDatingIntent, searchDating };
