import { d as distanceMeters } from "./coord-Cq5LMP_P.mjs";
import { n as noteCall, r as noteFailure } from "./provider-usage-CqiDrKv8.mjs";
import { KAIROS_VOICE, geminiJson } from "./gemini.server-D3PyYOAp.mjs";
import { n as TtlCache, r as shareRequest, t as RequestGate } from "./travel-cache-BPZkLeXq.mjs";
import { n as readWeather } from "./family-DnghGkQV.mjs";
import { a as explicitChildAges, f as travelDestinationFromPhoton, u as rankTravelDestinations } from "./travel-tYjUPdjH.mjs";
import { n as commonsCategoryTitle, r as commonsFileTitle, s as parseWikipedia } from "./travel-photo-CU-qA7uW.mjs";
import { B as inferCountry, C as destinationLocalName, Ct as sourceLanguage, Dt as tidyLocalLabel, Et as tidyLatin, G as localNameFits, H as itineraryRequestPlan, I as hasNonLatin, Mt as verifiedWebsite, Nt as voiceStaysInside, O as englishAreaName, P as forecastLocal, Q as nearbyPlaceNames, S as destinationLanguages, V as isGenericDayTheme, _ as buildTrip, a as acceptExperienceLine, at as polishAddress, b as cleanTheme, f as attachExperience, g as buildPlaceStory, k as ensureDestinationKnowledge, kt as translationFits, lt as readableName, mt as resolvePlaceDisplayName, o as annotatePlace, ot as polishReading, q as localTripVoice, tt as onKnowledgePersist, u as applyRoute, v as categoryFromTags, x as dayStops, xt as setDestinationFacts, y as chooseHotelHit, z as importKnowledgeSnapshot } from "./hotel-bases-bpQ2rCBh.mjs";
import { attachPlacePhotos } from "./travel-photo.server-Ctjtfrfe.mjs";
import { t as anyAscii } from "../_libs/any-ascii.mjs";
import { t as pinyin } from "../_libs/pinyin-pro.mjs";
import { createRequire } from "node:module";
//#region node_modules/.nitro/vite/services/ssr/assets/travel.server-CtpmsciF.js
var WHEN$1 = "2026-10-04";
function area(id, name, kind, lat, lng, role, groups, hints, extra) {
	return {
		id,
		name,
		kind,
		lat,
		lng,
		role,
		groups,
		hints,
		...extra
	};
}
function pageUrl(site, page) {
	const slug = page.replace(/ /g, "_");
	return site === "wv" ? `https://en.wikivoyage.org/wiki/${slug}` : `https://en.wikipedia.org/wiki/${slug}`;
}
function sourcesFor(name, page, stops, board) {
	const structure = `${stops.slice(0, 4).join(", ")} are the structural stops for a first look at ${name}.`;
	const rows = [{
		name: `Wikivoyage ${page}`,
		sourceType: "wikivoyage",
		sourceUrl: pageUrl("wv", page),
		stops,
		facts: [structure, "Only place names and relationships are stored."]
	}, {
		name: `Wikipedia ${page}`,
		sourceType: "wikipedia",
		sourceUrl: pageUrl("wp", page),
		stops,
		facts: [`Open encyclopedia entry used to confirm ${name}.`, "Article prose is not stored."]
	}];
	if (board) rows.unshift({
		name: board.name,
		sourceType: "tourism-board",
		sourceUrl: board.url,
		stops,
		facts: [`Official visitor pages for ${name} use the same main stops.`, "No official page text is stored."]
	});
	return rows;
}
function place(input) {
	const stops = input.areas.filter((item) => !item.later).map((item) => item.name);
	return {
		id: input.id,
		name: input.name,
		aliases: [.../* @__PURE__ */ new Set([
			input.id.replace(/-/g, " "),
			input.name.toLowerCase(),
			...input.aliases.map((alias) => alias.toLowerCase())
		])],
		scope: input.scope,
		parent: input.parent,
		countryCode: input.countryCode,
		areas: input.areas,
		sources: sourcesFor(input.name, input.page, stops, input.board)
	};
}
var STARTER_FACTS = [
	place({
		id: "tokyo",
		name: "Tokyo",
		aliases: ["tokyo"],
		scope: "city",
		parent: "japan",
		countryCode: "JP",
		page: "Tokyo",
		board: {
			name: "Tokyo Tourism",
			url: "https://www.gotokyo.org/en/"
		},
		areas: [
			area("tokyo", "Tokyo", "city", 35.6812, 139.7671, "base", ["city", "landmark"], [
				"Senso-ji",
				"Imperial Palace",
				"teamLab"
			]),
			area("asakusa", "Asakusa", "city", 35.7148, 139.7967, "focus", ["heritage", "neighbourhood"], ["Senso-ji", "Nakamise"]),
			area("shibuya", "Shibuya and Harajuku", "city", 35.6595, 139.7004, "focus", ["neighbourhood", "city"], [
				"Shibuya",
				"Meiji",
				"Harajuku"
			]),
			area("kamakura", "Kamakura", "town", 35.3192, 139.5467, "day-trip", ["heritage"], [
				"Kotoku-in",
				"Hachimangu",
				"Great Buddha"
			], { radiusKm: 10 }),
			area("hakone", "Hakone", "region", 35.232, 139.107, "excursion", ["nature"], ["Hakone", "Lake Ashi"], {
				optional: true,
				radiusKm: 16
			})
		]
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
			area("kyoto", "Kyoto", "city", 35.0116, 135.7681, "base", ["heritage"], [
				"Fushimi",
				"Kiyomizu",
				"Arashiyama",
				"Gion"
			]),
			area("kyoto-east", "Eastern Kyoto", "city", 35.0037, 135.7788, "focus", ["heritage", "neighbourhood"], ["Gion", "Philosopher's Path"]),
			area("nara", "Nara", "city", 34.6851, 135.8048, "day-trip", ["heritage"], ["Todai-ji", "Nara Park"], { radiusKm: 12 }),
			area("osaka", "Osaka", "city", 34.6937, 135.5023, "transfer", ["food", "city"], ["Dotonbori", "Osaka Castle"]),
			area("kobe", "Kobe", "city", 34.6901, 135.1956, "day-trip", ["city"], ["Kobe", "Harborland"], { optional: true })
		]
	}),
	place({
		id: "hokkaido",
		name: "Hokkaido",
		aliases: ["hokkaido"],
		scope: "region",
		parent: "japan",
		countryCode: "JP",
		page: "Hokkaido",
		board: {
			name: "Visit Hokkaido",
			url: "https://www.visit-hokkaido.jp/en/"
		},
		areas: [
			area("sapporo", "Sapporo", "city", 43.0618, 141.3545, "base", ["city", "food"], ["Odori", "Sapporo"]),
			area("sapporo-park", "Sapporo parks", "city", 43.054, 141.347, "focus", ["neighbourhood"], ["Odori Park", "Nijo Market"]),
			area("otaru", "Otaru", "town", 43.1907, 140.9947, "day-trip", ["neighbourhood"], ["Otaru Canal"], { radiusKm: 10 }),
			area("furano", "Furano", "town", 43.342, 142.383, "transfer", ["nature"], ["Furano", "lavender fields"], { radiusKm: 18 }),
			area("biei", "Biei", "nature", 43.588, 142.467, "excursion", ["nature"], ["Biei", "Blue Pond"], { radiusKm: 16 }),
			area("hakodate", "Hakodate", "city", 41.7687, 140.729, "transfer", ["city"], ["Hakodate", "Goryokaku"], { later: true })
		]
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
			area("nagasaki", "Nagasaki", "city", 32.7503, 129.8779, "transfer", ["heritage"], ["Glover Garden", "Peace Park"], { later: true })
		]
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
			area("kerama", "Kerama Islands", "island", 26.19, 127.3, "day-trip", ["nature"], ["Kerama"], {
				optional: true,
				radiusKm: 14
			})
		]
	}),
	place({
		id: "seoul",
		name: "Seoul",
		aliases: ["seoul"],
		scope: "city",
		parent: "south-korea",
		countryCode: "KR",
		page: "Seoul",
		board: {
			name: "Visit Seoul",
			url: "https://english.visitseoul.net/"
		},
		areas: [
			area("seoul", "Seoul", "city", 37.5665, 126.978, "base", ["heritage", "city"], ["Gyeongbokgung", "Bukchon"]),
			area("jongno", "Jongno palaces", "city", 37.5796, 126.977, "focus", ["heritage"], ["Gyeongbokgung", "Changdeokgung"]),
			area("hongdae", "Hongdae and the river", "city", 37.5563, 126.9236, "focus", ["neighbourhood", "food"], ["Hongdae"]),
			area("suwon", "Suwon", "city", 37.2636, 127.0286, "day-trip", ["heritage"], ["Hwaseong"], { radiusKm: 12 })
		]
	}),
	place({
		id: "south-korea",
		name: "South Korea",
		aliases: ["south korea", "republic of korea"],
		scope: "country",
		countryCode: "KR",
		page: "South Korea",
		board: {
			name: "Visit Korea",
			url: "https://english.visitkorea.or.kr/"
		},
		areas: [
			area("seoul", "Seoul", "city", 37.5665, 126.978, "base", ["heritage", "city"], ["Gyeongbokgung", "Bukchon"]),
			area("jongno", "Palace quarter", "city", 37.5796, 126.977, "focus", ["heritage"], ["Gyeongbokgung"]),
			area("suwon", "Suwon", "city", 37.2636, 127.0286, "day-trip", ["heritage"], ["Hwaseong"], { radiusKm: 12 }),
			area("gyeongju", "Gyeongju", "city", 35.8562, 129.2247, "transfer", ["heritage"], ["Bulguksa", "Tumuli"], { later: true }),
			area("busan", "Busan", "city", 35.1796, 129.0756, "transfer", ["city", "food"], ["Haeundae", "Jagalchi"], { later: true })
		]
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
			area("wall", "Mutianyu Great Wall", "nature", 40.431, 116.563, "day-trip", ["heritage", "nature"], ["Great Wall", "Mutianyu"], { radiusKm: 14 })
		]
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
			area("bund", "The Bund", "city", 31.24, 121.49, "focus", ["landmark"], ["The Bund"]),
			area("french", "Former French Concession", "city", 31.216, 121.45, "focus", ["neighbourhood"], ["French Concession"]),
			area("suzhou", "Suzhou", "city", 31.2989, 120.5853, "day-trip", ["heritage", "nature"], ["Suzhou gardens"], { radiusKm: 14 })
		]
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
			area("lijiang", "Lijiang", "town", 26.855, 100.227, "transfer", ["heritage", "nature"], ["Lijiang old town"], { radiusKm: 14 })
		]
	}),
	place({
		id: "hong-kong",
		name: "Hong Kong",
		aliases: ["hong kong"],
		scope: "city",
		countryCode: "HK",
		page: "Hong Kong",
		board: {
			name: "Discover Hong Kong",
			url: "https://www.discoverhongkong.com/"
		},
		areas: [
			area("hong-kong", "Hong Kong Island", "city", 22.279, 114.162, "base", ["city", "landmark"], ["Central", "Victoria Peak"]),
			area("peak", "Victoria Peak", "city", 22.2759, 114.1455, "focus", ["landmark", "nature"], ["The Peak"]),
			area("kowloon", "Kowloon", "city", 22.2988, 114.1722, "focus", ["neighbourhood", "food"], ["Tsim Sha Tsui", "Temple Street"]),
			area("lantau", "Lantau", "island", 22.254, 113.904, "day-trip", ["heritage", "nature"], ["Ngong Ping", "Big Buddha"], { radiusKm: 14 })
		]
	}),
	place({
		id: "taiwan",
		name: "Taiwan",
		aliases: ["taiwan"],
		scope: "island",
		countryCode: "TW",
		page: "Taiwan",
		board: {
			name: "Taiwan Tourism",
			url: "https://eng.taiwan.net.tw/"
		},
		areas: [
			area("taipei", "Taipei", "city", 25.033, 121.5654, "base", ["city", "food"], ["Taipei 101", "night markets"]),
			area("datong", "Datong", "city", 25.064, 121.51, "focus", ["heritage", "food"], ["Dadaocheng"]),
			area("jiufen", "Jiufen", "town", 25.1096, 121.844, "day-trip", ["neighbourhood"], ["Jiufen"], { radiusKm: 8 }),
			area("beitou", "Beitou", "town", 25.136, 121.506, "focus", ["nature"], ["Beitou hot springs"]),
			area("hualien", "Hualien and Taroko", "nature", 24.158, 121.621, "transfer", ["nature"], ["Taroko"], {
				later: true,
				radiusKm: 24
			})
		]
	}),
	place({
		id: "thailand",
		name: "Thailand",
		aliases: ["thailand"],
		scope: "country",
		countryCode: "TH",
		page: "Thailand",
		board: {
			name: "Tourism Authority of Thailand",
			url: "https://www.tourismthailand.org/"
		},
		areas: [
			area("bangkok", "Bangkok", "city", 13.7563, 100.5018, "base", [
				"heritage",
				"food",
				"city"
			], ["Grand Palace", "Wat Pho"]),
			area("riverside", "Bangkok riverside", "city", 13.742, 100.491, "focus", ["heritage", "neighbourhood"], ["Wat Arun", "Chinatown"]),
			area("ayutthaya", "Ayutthaya", "town", 14.3532, 100.568, "day-trip", ["heritage"], ["Ayutthaya"], { radiusKm: 12 }),
			area("chiang-mai", "Chiang Mai", "city", 18.7883, 98.9853, "transfer", ["heritage", "nature"], ["Old City", "Doi Suthep"], { later: true })
		]
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
			area("ayutthaya", "Ayutthaya", "town", 14.3532, 100.568, "day-trip", ["heritage"], ["Ayutthaya"], { radiusKm: 12 })
		]
	}),
	place({
		id: "vietnam",
		name: "Vietnam",
		aliases: ["vietnam"],
		scope: "country",
		countryCode: "VN",
		page: "Vietnam",
		board: {
			name: "Vietnam Tourism",
			url: "https://vietnam.travel/"
		},
		areas: [
			area("hanoi", "Hanoi", "city", 21.0278, 105.8342, "base", ["heritage", "food"], ["Old Quarter", "Hoan Kiem"]),
			area("old-quarter", "Old Quarter", "city", 21.035, 105.85, "focus", ["neighbourhood", "food"], ["Old Quarter"]),
			area("halong", "Ha Long Bay", "nature", 20.9101, 107.1839, "excursion", ["nature"], ["Ha Long"], { radiusKm: 28 }),
			area("hoi-an", "Hoi An", "town", 15.8801, 108.338, "transfer", ["heritage"], ["Hoi An old town"], { later: true })
		]
	}),
	place({
		id: "bali",
		name: "Bali",
		aliases: ["bali"],
		scope: "island",
		countryCode: "ID",
		page: "Bali",
		board: {
			name: "Indonesia Travel",
			url: "https://www.indonesia.travel/"
		},
		areas: [
			area("ubud", "Ubud", "region", -8.5069, 115.2625, "base", ["nature", "heritage"], [
				"Ubud",
				"rice terraces",
				"monkey forest"
			], { radiusKm: 12 }),
			area("ubud-ridge", "Ubud ridge", "nature", -8.45, 115.28, "focus", ["nature"], ["Tegallalang"], { radiusKm: 10 }),
			area("seminyak", "Seminyak", "town", -8.6913, 115.168, "transfer", ["beach", "food"], ["Seminyak", "Canggu"]),
			area("uluwatu", "Uluwatu", "nature", -8.8291, 115.0849, "excursion", ["nature", "heritage"], ["Uluwatu"], { radiusKm: 10 }),
			area("nusa", "Nusa Penida", "island", -8.727, 115.544, "day-trip", ["nature"], ["Nusa Penida"], {
				optional: true,
				radiusKm: 16
			})
		]
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
			area("melaka", "Melaka", "city", 2.1896, 102.2501, "day-trip", ["heritage"], ["Dutch Square"], {
				optional: true,
				radiusKm: 10
			})
		]
	}),
	place({
		id: "london",
		name: "London",
		aliases: ["london"],
		scope: "city",
		parent: "united-kingdom",
		countryCode: "GB",
		page: "London",
		board: {
			name: "Visit London",
			url: "https://www.visitlondon.com/"
		},
		areas: [
			area("london", "London", "city", 51.5074, -.1278, "base", ["landmark", "heritage"], [
				"Westminster",
				"Big Ben",
				"Thames"
			]),
			area("south-bank", "South Bank", "city", 51.5055, -.115, "focus", ["landmark", "food"], [
				"South Bank",
				"Borough Market",
				"Tate"
			]),
			area("museums", "Bloomsbury museums", "city", 51.5194, -.127, "focus", ["heritage"], ["British Museum"]),
			area("windsor", "Windsor", "town", 51.4839, -.6044, "day-trip", ["heritage"], ["Windsor Castle"], { radiusKm: 8 }),
			area("greenwich", "Greenwich", "town", 51.4826, -.0077, "day-trip", ["nature", "heritage"], ["Greenwich", "Royal Observatory"], {
				optional: true,
				radiusKm: 8
			})
		]
	}),
	place({
		id: "united-kingdom",
		name: "United Kingdom",
		aliases: [
			"united kingdom",
			"uk",
			"britain"
		],
		scope: "country",
		countryCode: "GB",
		page: "United Kingdom",
		board: {
			name: "VisitBritain",
			url: "https://www.visitbritain.com/"
		},
		areas: [
			area("london", "London", "city", 51.5074, -.1278, "base", ["landmark", "city"], ["Westminster", "British Museum"]),
			area("south-bank", "South Bank", "city", 51.5055, -.115, "focus", ["neighbourhood"], ["South Bank"]),
			area("windsor", "Windsor", "town", 51.4839, -.6044, "day-trip", ["heritage"], ["Windsor Castle"], { radiusKm: 8 }),
			area("edinburgh", "Edinburgh", "city", 55.9533, -3.1883, "transfer", ["heritage"], ["Edinburgh Castle", "Royal Mile"], { later: true }),
			area("bath", "Bath", "city", 51.3811, -2.359, "day-trip", ["heritage"], ["Roman Baths"], { later: true })
		]
	}),
	place({
		id: "barcelona",
		name: "Barcelona",
		aliases: ["barcelona"],
		scope: "city",
		parent: "spain",
		countryCode: "ES",
		page: "Barcelona",
		board: {
			name: "Turisme de Barcelona",
			url: "https://www.barcelonaturisme.com/"
		},
		areas: [
			area("barcelona", "Barcelona", "city", 41.3874, 2.1686, "base", ["landmark", "heritage"], ["Gothic Quarter", "La Rambla"]),
			area("gothic", "Gothic Quarter", "city", 41.383, 2.176, "focus", ["heritage", "neighbourhood"], ["Gothic Quarter", "Born"]),
			area("eixample", "Eixample and Sagrada Família", "city", 41.4036, 2.1744, "focus", ["landmark"], ["Sagrada Família"]),
			area("montserrat", "Montserrat", "nature", 41.591, 1.837, "day-trip", ["nature", "heritage"], ["Montserrat"], { radiusKm: 10 }),
			area("montjuic", "Montjuïc", "city", 41.363, 2.164, "focus", ["nature", "landmark"], ["Montjuïc"], { optional: true })
		]
	}),
	place({
		id: "spain",
		name: "Spain",
		aliases: ["spain"],
		scope: "country",
		countryCode: "ES",
		page: "Spain",
		board: {
			name: "Spain Tourism",
			url: "https://www.spain.info/"
		},
		areas: [
			area("madrid", "Madrid", "city", 40.4168, -3.7038, "base", ["heritage", "city"], ["Prado", "Retiro"]),
			area("retiro", "Retiro and the museums", "city", 40.415, -3.684, "focus", ["heritage"], ["Prado", "Retiro"]),
			area("toledo", "Toledo", "city", 39.8628, -4.0273, "day-trip", ["heritage"], ["Toledo"], { radiusKm: 8 }),
			area("barcelona", "Barcelona", "city", 41.3874, 2.1686, "transfer", ["landmark"], ["Sagrada Família", "Gothic Quarter"], { later: true }),
			area("seville", "Seville", "city", 37.3891, -5.9845, "transfer", ["heritage"], ["Alcázar"], { later: true })
		]
	}),
	place({
		id: "portugal",
		name: "Portugal",
		aliases: ["portugal"],
		scope: "country",
		countryCode: "PT",
		page: "Portugal",
		board: {
			name: "Visit Portugal",
			url: "https://www.visitportugal.com/"
		},
		areas: [
			area("lisbon", "Lisbon", "city", 38.7223, -9.1393, "base", ["heritage", "neighbourhood"], ["Alfama", "Belém"]),
			area("alfama", "Alfama and Belém", "city", 38.712, -9.13, "focus", ["heritage", "neighbourhood"], ["Alfama", "Belém Tower"]),
			area("sintra", "Sintra", "town", 38.8029, -9.3817, "day-trip", ["heritage", "nature"], ["Pena Palace", "Sintra"], { radiusKm: 10 }),
			area("porto", "Porto", "city", 41.1579, -8.6291, "transfer", ["heritage", "food"], ["Ribeira", "Dom Luís"]),
			area("algarve", "Algarve", "region", 37.0179, -7.9304, "transfer", ["beach", "nature"], ["Lagos", "cliffs"], {
				later: true,
				radiusKm: 24
			})
		]
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
			area("ancient", "Ancient Rome", "city", 41.8902, 12.4922, "focus", ["heritage"], [
				"Colosseum",
				"Forum",
				"Palatine"
			]),
			area("vatican", "Vatican and Trastevere", "city", 41.9029, 12.4534, "focus", ["heritage", "neighbourhood"], ["Vatican", "Trastevere"]),
			area("tivoli", "Tivoli", "town", 41.963, 12.797, "day-trip", ["heritage", "nature"], ["Villa d'Este"], {
				optional: true,
				radiusKm: 8
			})
		]
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
			area("luberon", "Luberon", "nature", 43.83, 5.3, "excursion", ["nature"], ["Luberon villages"], { radiusKm: 18 })
		]
	}),
	place({
		id: "greece",
		name: "Greece",
		aliases: ["greece"],
		scope: "country",
		countryCode: "GR",
		page: "Greece",
		board: {
			name: "Visit Greece",
			url: "https://www.visitgreece.gr/"
		},
		areas: [
			area("athens", "Athens", "city", 37.9838, 23.7275, "base", ["heritage", "landmark"], ["Acropolis", "Plaka"]),
			area("acropolis", "Acropolis and Plaka", "city", 37.9715, 23.7267, "focus", ["heritage"], ["Acropolis", "Plaka"]),
			area("cape", "Cape Sounion", "nature", 37.6502, 24.0245, "day-trip", ["heritage", "nature"], ["Temple of Poseidon"], { radiusKm: 10 }),
			area("santorini", "Santorini", "island", 36.3932, 25.4615, "transfer", ["nature", "landmark"], ["Oia", "Fira"], { later: true })
		]
	}),
	place({
		id: "norway",
		name: "Norway",
		aliases: ["norway"],
		scope: "country",
		countryCode: "NO",
		page: "Norway",
		board: {
			name: "Visit Norway",
			url: "https://www.visitnorway.com/"
		},
		areas: [
			area("oslo", "Oslo", "city", 59.9139, 10.7522, "base", ["city", "nature"], ["Opera", "Vigeland"]),
			area("vigeland", "Vigeland and the harbour", "city", 59.927, 10.7, "focus", ["landmark", "neighbourhood"], ["Vigeland", "Aker Brygge"]),
			area("bergen", "Bergen", "city", 60.3913, 5.3221, "transfer", ["heritage", "nature"], ["Bryggen", "Fløyen"], { later: true }),
			area("fjord", "Sognefjord", "nature", 61.1, 6.8, "excursion", ["nature"], ["Sognefjord"], {
				later: true,
				radiusKm: 30
			})
		]
	}),
	place({
		id: "netherlands",
		name: "Netherlands",
		aliases: ["netherlands", "holland"],
		scope: "country",
		countryCode: "NL",
		page: "Netherlands",
		board: {
			name: "Holland.com",
			url: "https://www.holland.com/"
		},
		areas: [
			area("amsterdam", "Amsterdam", "city", 52.3676, 4.9041, "base", ["city", "heritage"], ["Canal ring", "Rijksmuseum"]),
			area("jordaan", "Canal ring", "city", 52.373, 4.883, "focus", ["neighbourhood"], ["Jordaan", "canals"]),
			area("haarlem", "Haarlem", "city", 52.3874, 4.6462, "day-trip", ["heritage"], ["Haarlem"], {
				optional: true,
				radiusKm: 8
			}),
			area("zaanse", "Zaanse Schans", "town", 52.473, 4.817, "day-trip", ["heritage"], ["Zaanse Schans"], { radiusKm: 6 })
		]
	}),
	place({
		id: "germany",
		name: "Germany",
		aliases: ["germany"],
		scope: "country",
		countryCode: "DE",
		page: "Germany",
		board: {
			name: "Germany Travel",
			url: "https://www.germany.travel/"
		},
		areas: [
			area("berlin", "Berlin", "city", 52.52, 13.405, "base", ["heritage", "city"], ["Museum Island", "Brandenburg Gate"]),
			area("mitte", "Mitte", "city", 52.52, 13.4, "focus", ["heritage", "neighbourhood"], ["Museum Island"]),
			area("potsdam", "Potsdam", "city", 52.3906, 13.0645, "day-trip", ["heritage", "nature"], ["Sanssouci"], { radiusKm: 10 }),
			area("munich", "Munich", "city", 48.1351, 11.582, "transfer", ["city", "heritage"], ["Marienplatz", "English Garden"], { later: true })
		]
	}),
	place({
		id: "austria",
		name: "Austria",
		aliases: ["austria"],
		scope: "country",
		countryCode: "AT",
		page: "Austria",
		board: {
			name: "Austria.info",
			url: "https://www.austria.info/"
		},
		areas: [
			area("vienna", "Vienna", "city", 48.2082, 16.3738, "base", ["heritage", "landmark"], ["Stephansdom", "Ringstrasse"]),
			area("schonbrunn", "Schönbrunn", "city", 48.1845, 16.3122, "focus", ["heritage"], ["Schönbrunn"]),
			area("salzburg", "Salzburg", "city", 47.8095, 13.055, "transfer", ["heritage"], ["Altstadt", "Hohensalzburg"], { later: true }),
			area("hallstatt", "Hallstatt", "town", 47.5622, 13.6493, "excursion", ["nature", "heritage"], ["Hallstatt"], {
				later: true,
				radiusKm: 8
			})
		]
	}),
	place({
		id: "czech-republic",
		name: "Czech Republic",
		aliases: ["czech republic", "czechia"],
		scope: "country",
		countryCode: "CZ",
		page: "Czech Republic",
		board: {
			name: "Visit Czech Republic",
			url: "https://www.visitczechrepublic.com/"
		},
		areas: [
			area("prague", "Prague", "city", 50.0755, 14.4378, "base", ["heritage", "landmark"], ["Old Town", "Charles Bridge"]),
			area("castle", "Prague Castle", "city", 50.091, 14.401, "focus", ["heritage"], ["Prague Castle", "Malá Strana"]),
			area("kutna", "Kutná Hora", "town", 49.948, 15.268, "day-trip", ["heritage"], ["Sedlec", "St Barbara"], {
				optional: true,
				radiusKm: 8
			})
		]
	}),
	place({
		id: "hungary",
		name: "Hungary",
		aliases: ["hungary"],
		scope: "country",
		countryCode: "HU",
		page: "Hungary",
		board: {
			name: "Visit Hungary",
			url: "https://visithungary.com/"
		},
		areas: [
			area("budapest", "Budapest", "city", 47.4979, 19.0402, "base", ["heritage", "landmark"], ["Parliament", "Danube"]),
			area("buda", "Buda Castle", "city", 47.496, 19.039, "focus", ["heritage"], ["Buda Castle", "Fisherman's Bastion"]),
			area("pest", "Pest", "city", 47.5, 19.06, "focus", ["neighbourhood", "food"], ["Ruin bars", "Great Market Hall"]),
			area("szentendre", "Szentendre", "town", 47.67, 19.076, "day-trip", ["heritage"], ["Szentendre"], {
				optional: true,
				radiusKm: 6
			})
		]
	}),
	place({
		id: "new-york",
		name: "New York",
		aliases: [
			"new york",
			"new york city",
			"nyc"
		],
		scope: "city",
		countryCode: "US",
		page: "New York City",
		board: {
			name: "NYC Tourism",
			url: "https://www.nyctourism.com/"
		},
		areas: [
			area("manhattan", "Manhattan", "city", 40.758, -73.9855, "base", ["landmark", "city"], ["Midtown", "Central Park"]),
			area("midtown", "Midtown and the park", "city", 40.769, -73.972, "focus", ["landmark", "nature"], ["Central Park", "Fifth Avenue"]),
			area("downtown", "Downtown", "city", 40.706, -74.009, "focus", ["heritage", "neighbourhood"], ["Battery", "Brooklyn Bridge"]),
			area("brooklyn", "Brooklyn", "city", 40.691, -73.991, "day-trip", ["neighbourhood", "food"], ["DUMBO", "Brooklyn Heights"], { radiusKm: 8 })
		]
	}),
	place({
		id: "california",
		name: "California",
		aliases: ["california"],
		scope: "road",
		countryCode: "US",
		page: "California",
		board: {
			name: "Visit California",
			url: "https://www.visitcalifornia.com/"
		},
		areas: [
			area("san-francisco", "San Francisco", "city", 37.7749, -122.4194, "base", ["city", "landmark"], ["Golden Gate", "Ferry Building"]),
			area("bridge", "Golden Gate", "city", 37.8199, -122.4783, "focus", ["landmark", "nature"], ["Golden Gate", "Crissy Field"]),
			area("napa", "Napa Valley", "region", 38.5025, -122.2654, "day-trip", ["food", "nature"], ["Napa"], { radiusKm: 16 }),
			area("yosemite", "Yosemite", "nature", 37.8651, -119.5383, "transfer", ["nature"], ["Yosemite Valley"], { radiusKm: 28 })
		]
	}),
	place({
		id: "canada",
		name: "Canada",
		aliases: ["canada"],
		scope: "country",
		countryCode: "CA",
		page: "Canada",
		board: {
			name: "Destination Canada",
			url: "https://travel.destinationcanada.com/"
		},
		areas: [
			area("vancouver", "Vancouver", "city", 49.2827, -123.1207, "base", ["city", "nature"], ["Stanley Park", "Gastown"]),
			area("stanley", "Stanley Park", "city", 49.3043, -123.1443, "focus", ["nature"], ["Stanley Park"]),
			area("whistler", "Whistler", "town", 50.1163, -122.9574, "excursion", ["nature"], ["Whistler"], {
				optional: true,
				radiusKm: 14
			}),
			area("banff", "Banff", "nature", 51.1784, -115.5708, "transfer", ["nature"], ["Banff", "Lake Louise"], {
				later: true,
				radiusKm: 24
			})
		]
	}),
	place({
		id: "australia",
		name: "Australia",
		aliases: ["australia"],
		scope: "country",
		countryCode: "AU",
		page: "Australia",
		board: {
			name: "Tourism Australia",
			url: "https://www.australia.com/"
		},
		areas: [
			area("sydney", "Sydney", "city", -33.8688, 151.2093, "base", ["landmark", "city"], ["Opera House", "Harbour Bridge"]),
			area("harbour", "Sydney Harbour", "city", -33.8568, 151.2153, "focus", ["landmark"], ["Opera House", "The Rocks"]),
			area("blue", "Blue Mountains", "nature", -33.7, 150.3, "day-trip", ["nature"], ["Blue Mountains"], { radiusKm: 20 }),
			area("melbourne", "Melbourne", "city", -37.8136, 144.9631, "transfer", ["city", "food"], ["CBD", "laneways"], { later: true })
		]
	}),
	place({
		id: "new-zealand",
		name: "New Zealand",
		aliases: ["new zealand"],
		scope: "country",
		countryCode: "NZ",
		page: "New Zealand",
		board: {
			name: "New Zealand Tourism",
			url: "https://www.newzealand.com/"
		},
		areas: [
			area("auckland", "Auckland", "city", -36.8509, 174.7645, "base", ["city", "nature"], ["Harbour", "Sky Tower"]),
			area("harbour", "Auckland harbour", "city", -36.84, 174.76, "focus", ["neighbourhood"], ["Viaduct", "Devonport"]),
			area("rotorua", "Rotorua", "region", -38.1368, 176.2497, "transfer", ["nature", "heritage"], ["Rotorua", "geothermal"], {
				later: true,
				radiusKm: 16
			}),
			area("queenstown", "Queenstown", "city", -45.0312, 168.6626, "transfer", ["nature"], ["Queenstown"], { later: true })
		]
	}),
	place({
		id: "nz-south-island",
		name: "New Zealand South Island",
		aliases: ["new zealand south island", "south island"],
		scope: "road",
		parent: "new-zealand",
		countryCode: "NZ",
		page: "South Island",
		board: {
			name: "New Zealand Tourism",
			url: "https://www.newzealand.com/"
		},
		areas: [
			area("christchurch", "Christchurch", "city", -43.5321, 172.6362, "base", ["city"], ["Christchurch botanic"]),
			area("tekapo", "Lake Tekapo", "nature", -44.0047, 170.4771, "transfer", ["nature"], ["Lake Tekapo", "Aoraki"], { radiusKm: 22 }),
			area("aoraki", "Aoraki / Mount Cook", "nature", -43.734, 170.096, "excursion", ["nature"], ["Aoraki"], { radiusKm: 20 }),
			area("queenstown", "Queenstown", "city", -45.0312, 168.6626, "transfer", ["nature", "city"], ["Queenstown"]),
			area("wanaka", "Wanaka", "town", -44.694, 169.142, "day-trip", ["nature"], ["Wanaka"], { radiusKm: 12 }),
			area("milford", "Milford Sound", "nature", -44.671, 167.926, "excursion", ["nature"], ["Milford Sound"], { radiusKm: 20 })
		]
	}),
	place({
		id: "turkey",
		name: "Turkey",
		aliases: [
			"turkey",
			"türkiye",
			"turkiye"
		],
		scope: "country",
		countryCode: "TR",
		page: "Turkey",
		board: {
			name: "GoTürkiye",
			url: "https://goturkiye.com/"
		},
		areas: [
			area("istanbul", "Istanbul", "city", 41.0082, 28.9784, "base", ["heritage", "landmark"], ["Hagia Sophia", "Grand Bazaar"]),
			area("sultanahmet", "Sultanahmet", "city", 41.0054, 28.9768, "focus", ["heritage"], ["Hagia Sophia", "Blue Mosque"]),
			area("bosphorus", "Bosphorus", "city", 41.08, 29.04, "focus", ["nature", "neighbourhood"], ["Bosphorus"]),
			area("cappadocia", "Cappadocia", "region", 38.6431, 34.8289, "transfer", ["nature", "heritage"], ["Göreme"], {
				later: true,
				radiusKm: 18
			})
		]
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
			area("abu-dhabi", "Abu Dhabi", "city", 24.4539, 54.3773, "day-trip", ["landmark"], ["Sheikh Zayed Mosque"], { radiusKm: 14 })
		]
	}),
	place({
		id: "morocco",
		name: "Morocco",
		aliases: ["morocco"],
		scope: "country",
		countryCode: "MA",
		page: "Morocco",
		board: {
			name: "Visit Morocco",
			url: "https://www.visitmorocco.com/"
		},
		areas: [
			area("marrakech", "Marrakech", "city", 31.6295, -7.9811, "base", ["heritage", "city"], ["Medina", "Jemaa el-Fna"]),
			area("medina", "Marrakech medina", "city", 31.626, -7.989, "focus", ["heritage", "neighbourhood"], ["Medina", "souks"]),
			area("atlas", "Atlas foothills", "nature", 31.3, -7.7, "excursion", ["nature"], ["Atlas"], { radiusKm: 22 }),
			area("fes", "Fes", "city", 34.0181, -5.0078, "transfer", ["heritage"], ["Fes el-Bali"], { later: true })
		]
	}),
	place({
		id: "mexico",
		name: "Mexico",
		aliases: ["mexico"],
		scope: "country",
		countryCode: "MX",
		page: "Mexico",
		board: {
			name: "Visit Mexico",
			url: "https://www.visitmexico.com/"
		},
		areas: [
			area("mexico-city", "Mexico City", "city", 19.4326, -99.1332, "base", [
				"heritage",
				"food",
				"city"
			], ["Centro", "Roma"]),
			area("centro", "Historic centre", "city", 19.433, -99.133, "focus", ["heritage"], ["Zócalo", "Templo Mayor"]),
			area("teotihuacan", "Teotihuacan", "town", 19.6925, -98.8435, "day-trip", ["heritage"], ["Teotihuacan"], { radiusKm: 10 }),
			area("oaxaca", "Oaxaca", "city", 17.0732, -96.7266, "transfer", ["heritage", "food"], ["Oaxaca"], { later: true })
		]
	}),
	place({
		id: "scottish-highlands",
		name: "Scottish Highlands",
		aliases: ["scottish highlands", "highlands"],
		scope: "nature",
		parent: "united-kingdom",
		countryCode: "GB",
		page: "Scottish Highlands",
		board: {
			name: "VisitScotland",
			url: "https://www.visitscotland.com/"
		},
		areas: [
			area("inverness", "Inverness", "city", 57.4778, -4.2247, "base", ["city"], ["Inverness"]),
			area("ness", "Loch Ness", "nature", 57.3229, -4.4244, "day-trip", ["nature"], ["Loch Ness"], { radiusKm: 16 }),
			area("skye", "Isle of Skye", "island", 57.3, -6.2, "transfer", ["nature"], ["Skye"], { radiusKm: 22 }),
			area("glencoe", "Glencoe", "nature", 56.6826, -5.102, "excursion", ["nature"], ["Glencoe"], { radiusKm: 14 })
		]
	})
];
function dayRole(item, index) {
	if (index === 0) return "arrival";
	if (item.role === "day-trip") return "day-trip";
	if (item.role === "excursion") return item.groups.includes("nature") ? "nature" : "regional";
	if (item.role === "transfer") return item.groups.includes("nature") ? "nature" : "regional";
	if (item.groups.includes("heritage")) return "heritage";
	if (item.groups.includes("landmark")) return "icons";
	if (item.groups.includes("food")) return "food";
	return "neighbourhood";
}
function toNode(item, countryCode) {
	return {
		id: item.id,
		name: item.name,
		kind: item.kind,
		latitude: item.lat,
		longitude: item.lng,
		countryCode,
		experienceGroups: item.groups,
		hints: item.hints,
		radiusKm: item.radiusKm
	};
}
function daysFrom(areas) {
	let stay = areas.find((item) => item.role === "base")?.id ?? areas[0]?.id ?? "";
	return areas.map((item, index) => {
		if (item.role === "base" || item.role === "transfer") stay = item.id;
		return {
			node: item.id,
			stay: item.role === "base" || item.role === "transfer" ? item.id : stay,
			role: dayRole(item, index),
			title: item.name,
			groups: [...item.groups],
			optional: item.optional || item.role === "day-trip" && index > 3
		};
	});
}
function band(id, label, minNights, maxNights, days, later) {
	return {
		id,
		label,
		minNights,
		maxNights,
		firstVisit: true,
		days,
		later
	};
}
function playbookFromFact(fact, warnings = []) {
	const active = fact.areas.filter((item) => !item.later);
	const extended = fact.areas;
	const classicDays = daysFrom(active);
	const tasteDays = daysFrom(active.slice(0, Math.min(4, active.length))).map((day, index, list) => ({
		...day,
		optional: index === list.length - 1 && list.length > 2
	}));
	const longerDays = daysFrom(extended);
	const edges = [];
	let base = active[0]?.id ?? extended[0]?.id ?? fact.id;
	for (const item of extended) if (item.role === "base" || item.role === "transfer") {
		if (item.id !== base) edges.push({
			from: base,
			to: item.id,
			relation: "follows",
			signal: "common"
		});
		base = item.id;
	} else if (item.role === "day-trip") edges.push({
		from: base,
		to: item.id,
		relation: "day-trip",
		signal: "common"
	});
	else if (item.role === "excursion") edges.push({
		from: base,
		to: item.id,
		relation: "excursion",
		signal: "common"
	});
	const references = fact.sources.map((source, index) => ({
		id: `${fact.id}-${source.sourceType}-${index}`,
		sourceName: source.name,
		sourceType: source.sourceType,
		sourceUrl: source.sourceUrl,
		destinationScope: fact.name,
		title: "Structural route signals",
		nights: 7,
		routeNodes: source.stops.map((stop) => {
			const match = fact.areas.find((item) => item.name === stop);
			return {
				destinationName: stop,
				destinationType: match?.kind ?? "city",
				visitMode: match?.role === "day-trip" ? "DAY_TRIP" : match?.role === "excursion" ? "EXCURSION" : "STAY"
			};
		}),
		experienceGroups: [...new Set(fact.areas.flatMap((item) => item.groups))].slice(0, 6),
		extractedFacts: source.facts,
		retrievedAt: WHEN$1
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
			band("longer", "With the further stops", 9, 16, longerDays, fact.areas.filter((item) => item.later).map((item) => item.name))
		],
		references,
		confidence: "medium",
		lastUpdated: WHEN$1,
		cultureNode: heritage?.id,
		natureNode: nature?.id,
		cityNode: cityTrip?.id,
		familyNode: family?.id,
		foodNode: food?.id,
		origin: "generated",
		warnings
	});
}
function findStarterFact(name, facts = STARTER_FACTS) {
	const text = name.trim().toLowerCase();
	return facts.find((fact) => fact.id === text || fact.name.toLowerCase() === text || fact.aliases.some((alias) => alias === text));
}
setDestinationFacts(STARTER_FACTS);
var knowledgeCache = new TtlCache(6048e5, 40, "discovery");
var wikiGate = new RequestGate(4, 1e4);
var voyageGate = new RequestGate(1, 2e3);
var UA$2 = "Kairos/1.0 (travel; contact: local)";
var JUNK_TYPE = /language|human\b|organization|organis|university|school|college|commune of|arrondissement|megacity|global city|capital city|largest city|region of|historical country|empire\b|republic\b|regime|terrorist|massacre|genocide|mass shooting|olympic|tournament|conference|scandal|controversy|structure fire|storming|legislature|rapid transit|metro station|railway station|treaty|protocol\b|climate change agreement|environmental protocol|library|archives|higher education|grande école|grande ecole|engineering school|destroyed building|archaeological artefact|archaeological artifact|intergovernmental|administrative territorial|peace conference|former entity|insurgency|political scandal|sports season|football|financial center|central business district|department of|prefecture|airport|aerodrome|airline/;
var SIGHT_WORD = /museum|gallery|temple|shrine|castle|palace|park|garden|tower|statue|bridge|cathedral|basilica|church|chapel|mosque|synagogue|monastery|abbey|market|zoo|aquarium|monument|memorial|pagoda|fort|opera|theme park|amusement|attraction/;
/** A city, town, or "tourist destination" is a container, not a 90-minute sight. */
function isSettlementType(typeLabel, description = "") {
	const type = typeLabel.toLowerCase();
	const desc = description.toLowerCase();
	const withoutDestination = type.replace(/tourist destinations?/g, "");
	if (SIGHT_WORD.test(withoutDestination)) return false;
	if (/\b(city|town|village|municipality|human settlement|metropolis|special ward|core city|prefecture|county|province|borough|commune)\b/.test(type)) return true;
	if (/\btourist destination\b/.test(type)) return true;
	if (/^(city|town|village|municipality|ward|special city|core city|human settlement|tourist destination)\b/.test(desc)) return true;
	return false;
}
function discoveryBox(area) {
	const raw = area.bbox;
	if (raw && raw.length === 4 && raw.every((value) => Number.isFinite(value))) {
		const [south, west, north, east] = raw;
		const height = north - south;
		const width = east - west;
		if (south < north && west < east && height > .015 && height < .85 && width > .015 && width < .85) {
			const padLat = Math.min(.02, height * .08);
			const padLng = Math.min(.02, width * .08);
			return {
				south: south - padLat,
				west: west - padLng,
				north: north + padLat,
				east: east + padLng
			};
		}
	}
	return radiusBox(area.latitude, area.longitude, 14e3);
}
function radiusBox(lat, lng, radius) {
	const dLat = radius / 111320;
	const dLng = radius / (111320 * Math.max(.2, Math.cos(lat * Math.PI / 180)));
	return {
		south: lat - dLat,
		west: lng - dLng,
		north: lat + dLat,
		east: lng + dLng
	};
}
function classifyVisit(typeLabel, name) {
	const type = typeLabel.toLowerCase();
	const label = name.toLowerCase();
	if (!type && !label) return null;
	if (/university|airport|college|railway station|metro station/.test(label)) return null;
	if (JUNK_TYPE.test(type) || type.includes("destroyed")) return null;
	if (isSettlementType(typeLabel, "")) return null;
	if (/\briver\b/.test(type) && !type.includes("island")) return null;
	const heritage = ["heritage"];
	const nature = ["nature"];
	if (type.includes("museum") || type.includes("gallery") || type.includes("cultural centre") || type.includes("cultural center")) return {
		category: "museum",
		indoor: true,
		groups: heritage
	};
	if (type.includes("zoo") || type.includes("aquarium") || type.includes("safari") || type.includes("menagerie")) return {
		category: type.includes("aquarium") ? "aquarium" : "zoo",
		indoor: type.includes("aquarium"),
		groups: ["wildlife"]
	};
	if (type.includes("amusement") || type.includes("theme park")) return {
		category: "theme_park",
		indoor: false,
		groups: ["city"]
	};
	if (type.includes("tower") || type.includes("obelisk") || type.includes("ferris") || type.includes("wheel") || type.includes("observation")) return {
		category: "attraction",
		indoor: false,
		groups: heritage
	};
	if (type.includes("garden") || type.includes("botanical")) return {
		category: "garden",
		indoor: false,
		groups: nature
	};
	if (type.includes("nature reserve") || type.includes("national park") || type.includes("mountain") || type.includes("beach") || type.includes("park")) return {
		category: type.includes("beach") ? "beach" : "park",
		indoor: false,
		groups: nature
	};
	if (type.includes("cathedral") || type.includes("basilica") || type.includes("church") || type.includes("chapel") || type.includes("temple") || type.includes("mosque") || type.includes("synagogue") || type.includes("monastery") || type.includes("abbey") || type.includes("shrine")) return {
		category: "historic",
		indoor: true,
		groups: heritage
	};
	if (type.includes("canal") || type.includes("irrigation") || type.includes("heritage") || type.includes("aaaaa") || type.includes("archaeological") || type.includes("monument") || type.includes("memorial") || type.includes("palace") || type.includes("castle") || type.includes("opera") || type.includes("historic") || type.includes("triumphal") || type.includes("arch")) return {
		category: type.includes("opera") ? "attraction" : "historic",
		indoor: type.includes("opera") || type.includes("palace") || type.includes("castle"),
		groups: heritage
	};
	if (type.includes("bridge") || type.includes("square") || type.includes("plaza") || type.includes("statue") || type.includes("sculpture") || type.includes("fountain")) return {
		category: "landmark",
		indoor: false,
		groups: heritage
	};
	if (type.includes("boulevard") || type.includes("avenue") || type.includes("promenade") || type.includes("neighbourhood") || type.includes("neighborhood") || type.includes("quarter") || type.includes("district") || /\bhill\b/.test(type)) return {
		category: "landmark",
		indoor: false,
		groups: ["neighbourhood"]
	};
	if (type.includes("island")) return {
		category: "attraction",
		indoor: false,
		groups: heritage
	};
	if (type.includes("cemetery")) return {
		category: "historic",
		indoor: false,
		groups: heritage
	};
	if (type.includes("market") || type.includes("bazaar") || type.includes("shopping")) return {
		category: "market",
		indoor: true,
		groups: ["shopping"]
	};
	if (type.includes("theatre") || type.includes("theater") || type.includes("arts centre") || type.includes("concert hall")) return {
		category: "attraction",
		indoor: true,
		groups: heritage
	};
	if (type.includes("attraction") || type.includes("tourist") || /panda|wildlife/.test(label)) return {
		category: /panda|wildlife/.test(label) ? "zoo" : "attraction",
		indoor: false,
		groups: /panda|wildlife/.test(label) ? ["wildlife"] : ["city"]
	};
	return null;
}
function placeFromRow(id, row) {
	const blob = `${row.types.join(" ")} ${row.name} ${row.description}`;
	if (/university|airport|college|railway station|metro station/i.test(blob)) return null;
	if (/^main island\b/i.test(row.description)) return null;
	if (isSettlementType(row.types.join(" | "), row.description)) return null;
	if (/disputed|sovereignty|military|armed forces|live-firing|restricted area|training area/i.test(row.description)) return null;
	const island = row.types.some((type) => /island/i.test(type));
	const visitableIsland = /resort|park|beach|tourist|theme|village|conservation|wetland|garden/i.test(`${row.name} ${row.description}`);
	if (island && row.sitelinks < 30 && !visitableIsland) return null;
	const mapped = classifyVisit(row.types.join(" | "), row.name);
	if (!mapped) return null;
	const file = commonsFileTitle(row.image);
	return {
		id: `wd:${id}`,
		provider: "wikidata",
		providerId: `wd:${id}`,
		name: row.name,
		category: mapped.category,
		address: "",
		lat: row.lat,
		lng: row.lng,
		indoor: mapped.indoor,
		area: "",
		opening: "",
		nameEn: row.nameEn,
		nameLocal: row.nameLocal,
		localName: row.nameLocal,
		translationSource: row.nameEn ? "wikidata_en" : "",
		description: row.description,
		image: "",
		imagePage: "",
		wikidataId: id,
		commonsFile: file,
		website: verifiedWebsite(row.website),
		sitelinks: row.sitelinks,
		groups: mapped.groups,
		sourceNote: `Wikidata ${id}`
	};
}
async function sparqlBox(box, minLinks, limit, countryCode, outside) {
	if (!wikiGate.allow()) return {
		places: [],
		status: "failed",
		error: "Wikidata rate limit."
	};
	const outsideFilter = outside ? `BIND(geof:longitude(?coord) AS ?lon) BIND(geof:latitude(?coord) AS ?lat) FILTER(?lat < ${outside.south} || ?lat > ${outside.north} || ?lon < ${outside.west} || ?lon > ${outside.east})` : "";
	const langs = destinationLanguages(countryCode).map((lang) => lang.toLowerCase()).filter((lang) => lang !== "en" && /^[a-z]{2,3}(?:-[a-z]{2,5})?$/.test(lang));
	const localClause = langs.length ? `OPTIONAL { ?place rdfs:label ?localLabel . FILTER(LANG(?localLabel) IN (${langs.map((lang) => `"${lang}"`).join(", ")})) }` : "";
	const query = `SELECT ?place ?placeLabel ?placeDescription ?coord ?image ?website ?sitelinks ?typeLabel ?enLabel ?localLabel WHERE {
    {
      SELECT DISTINCT ?place ?sitelinks WHERE {
        SERVICE wikibase:box {
          ?place wdt:P625 ?coord .
          bd:serviceParam wikibase:cornerSouthWest "Point(${box.west} ${box.south})"^^geo:wktLiteral .
          bd:serviceParam wikibase:cornerNorthEast "Point(${box.east} ${box.north})"^^geo:wktLiteral .
        }
        ?place wikibase:sitelinks ?sitelinks .
        FILTER(?sitelinks >= ${minLinks})
        ${outsideFilter}
      } ORDER BY DESC(?sitelinks) LIMIT ${limit}
    }
    OPTIONAL { ?place wdt:P625 ?coord }
    OPTIONAL { ?place wdt:P18 ?image }
    OPTIONAL { ?place wdt:P856 ?website }
    OPTIONAL { ?place wdt:P31 ?type . ?type rdfs:label ?typeLabel . FILTER(LANG(?typeLabel) = "en") }
    OPTIONAL { ?place rdfs:label ?enLabel . FILTER(LANG(?enLabel) = "en") }
    ${localClause}
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }`;
	let res;
	try {
		const url = new URL("https://query.wikidata.org/sparql");
		url.searchParams.set("format", "json");
		url.searchParams.set("query", query);
		noteCall("discovery", "wikidata");
		res = await fetch(url, {
			headers: {
				Accept: "application/sparql-results+json",
				"User-Agent": UA$2
			},
			signal: AbortSignal.timeout(outside ? 12e3 : 16e3)
		});
	} catch (error) {
		return {
			places: [],
			status: "failed",
			error: error instanceof Error && error.name === "TimeoutError" ? "Wikidata timed out." : "Wikidata request failed."
		};
	}
	if (!res.ok) {
		noteFailure("discovery", "wikidata", `HTTP ${res.status}`);
		return {
			places: [],
			status: "failed",
			error: `Wikidata HTTP ${res.status}.`
		};
	}
	const body = await res.json();
	const grouped = /* @__PURE__ */ new Map();
	for (const row of body.results?.bindings ?? []) {
		const id = row.place?.value?.split("/").pop() ?? "";
		const match = (row.coord?.value ?? "").match(/Point\(([-0-9.]+) ([-0-9.]+)\)/);
		const name = (row.placeLabel?.value ?? "").trim();
		if (!id || !match || !name || name === id) continue;
		const current = grouped.get(id) ?? {
			name: name.slice(0, 80),
			nameEn: "",
			nameLocal: "",
			lat: Number(match[2]),
			lng: Number(match[1]),
			description: (row.placeDescription?.value ?? "").slice(0, 280),
			image: row.image?.value ?? "",
			website: "",
			sitelinks: Number(row.sitelinks?.value ?? 0) || 0,
			types: []
		};
		const en = tidyLocalLabel(row.enLabel?.value ?? "");
		const local = tidyLocalLabel(row.localLabel?.value ?? "");
		if (en && !current.nameEn) current.nameEn = en.slice(0, 80);
		if (local && local.toLowerCase() !== en.toLowerCase() && !current.nameLocal) current.nameLocal = local.slice(0, 80);
		const typeLabel = row.typeLabel?.value ?? "";
		if (typeLabel && !current.types.includes(typeLabel)) current.types.push(typeLabel);
		if (!current.image && row.image?.value) current.image = row.image.value;
		if (!current.website && row.website?.value) current.website = row.website.value;
		if (!current.description && row.placeDescription?.value) current.description = row.placeDescription.value.slice(0, 280);
		grouped.set(id, current);
	}
	const places = [];
	for (const [id, row] of grouped) {
		const place = placeFromRow(id, row);
		if (place) places.push(place);
	}
	return {
		places,
		status: places.length ? "ok" : "empty",
		error: places.length ? "" : "Wikidata returned no visitable places in this area."
	};
}
async function searchQid(name) {
	if (!wikiGate.allow()) return "";
	const url = new URL("https://www.wikidata.org/w/api.php");
	url.searchParams.set("action", "wbsearchentities");
	url.searchParams.set("search", name);
	url.searchParams.set("language", "en");
	url.searchParams.set("format", "json");
	url.searchParams.set("type", "item");
	url.searchParams.set("limit", "5");
	const res = await fetch(url, {
		headers: {
			Accept: "application/json",
			"User-Agent": UA$2
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) return "";
	return ((await res.json()).search ?? []).find((row) => row.id && !/human|singer|film|album/i.test(row.description ?? ""))?.id ?? "";
}
async function voyageNames(destination) {
	if (!voyageGate.allow()) return /* @__PURE__ */ new Set();
	const url = new URL("https://en.wikivoyage.org/w/api.php");
	url.searchParams.set("action", "parse");
	url.searchParams.set("page", destination);
	url.searchParams.set("prop", "links");
	url.searchParams.set("format", "json");
	url.searchParams.set("redirects", "1");
	const res = await fetch(url, {
		headers: {
			Accept: "application/json",
			"User-Agent": UA$2
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) return /* @__PURE__ */ new Set();
	const body = await res.json();
	const names = /* @__PURE__ */ new Set();
	for (const link of body.parse?.links ?? []) {
		const name = (link["*"] ?? "").replace(/_/g, " ").trim().toLowerCase();
		if (name && !name.startsWith("wikivoyage:") && !name.startsWith("category:")) names.add(name);
	}
	return names;
}
async function destinationProfile(area) {
	const box = discoveryBox(area);
	const country = (area.countryCode || inferCountry(area.latitude, area.longitude) || "").toUpperCase();
	const cacheKey = `v7:${country}:${area.name.toLowerCase()}:${box.south.toFixed(2)},${box.west.toFixed(2)},${box.north.toFixed(2)},${box.east.toFixed(2)}`;
	const cached = knowledgeCache.get(cacheKey);
	if (cached) return cached;
	return shareRequest(`knowledge:${cacheKey}`, async () => {
		const again = knowledgeCache.peek(cacheKey);
		if (again) return again;
		const qid = await searchQid(area.name).catch(() => "");
		const near = await sparqlBox(box, 10, 120, country);
		const wide = radiusBox(area.latitude, area.longitude, 6e4);
		const far = near.status === "failed" ? {
			places: [],
			status: "failed",
			error: near.error
		} : await sparqlBox(wide, 18, 16, country, box);
		const mentioned = near.status === "failed" ? /* @__PURE__ */ new Set() : await voyageNames(area.name).catch(() => /* @__PURE__ */ new Set());
		const merged = /* @__PURE__ */ new Map();
		for (const place of [...near.places, ...far.places]) {
			const previous = merged.get(place.providerId);
			if (!previous || (place.sitelinks ?? 0) > (previous.sitelinks ?? 0)) merged.set(place.providerId, place);
		}
		const places = [...merged.values()].map((place) => {
			const local = destinationLocalName({
				name: place.name,
				nameEn: place.nameEn,
				nameLocal: place.nameLocal,
				countryCode: country
			});
			return annotatePlace({
				...place,
				area: area.name,
				address: place.address || area.name,
				nameLocal: local.name,
				localName: local.name,
				localNameSource: local.source,
				mentioned: mentioned.has(place.name.toLowerCase()) || place.mentioned
			}, area.latitude, area.longitude);
		});
		const status = places.length ? "ok" : near.status === "failed" && !far.places.length ? "failed" : "empty";
		const error = places.length ? "" : near.error || far.error || "Wikidata returned no visitable places.";
		const profile = {
			destination: area.name,
			qid,
			places,
			sourceNote: status === "failed" ? "Wikidata did not load. Nothing was invented." : "Wikidata and OpenStreetMap.",
			fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
			status,
			error
		};
		if (places.length) knowledgeCache.set(cacheKey, profile);
		return profile;
	});
}
function mergePlaces(osm, knowledge, area) {
	const country = (area.countryCode || inferCountry(area.latitude, area.longitude) || "").toUpperCase();
	const localOf = (candidates, nameEn) => {
		for (const candidate of candidates) {
			const picked = destinationLocalName({
				name: "",
				nameEn,
				nameLocal: candidate || "",
				countryCode: country
			});
			if (picked.name) return picked;
		}
		return {
			name: "",
			source: ""
		};
	};
	const used = /* @__PURE__ */ new Set();
	const merged = [];
	for (const spot of osm) {
		const twin = knowledge.find((item) => !used.has(item.id) && sameIdentity(item, spot));
		if (twin) used.add(twin.id);
		const nameEn = spot.nameEn || twin?.nameEn || "";
		const local = localOf([
			spot.nameLocal,
			twin?.nameLocal,
			spot.name
		], nameEn);
		const next = annotatePlace({
			...spot,
			category: spot.category === "attraction" && twin && twin.category !== "attraction" && twin.category !== "stay" ? twin.category : spot.category,
			indoor: spot.category === "attraction" && twin && twin.indoor ? true : spot.indoor,
			localName: local.name,
			nameEn,
			nameLocal: local.name,
			nameLatin: spot.nameLatin || twin?.nameLatin || "",
			localNameSource: local.source,
			translationSource: spot.translationSource || twin?.translationSource || "",
			description: twin?.description || spot.description || "",
			image: "",
			imagePage: "",
			photo: void 0,
			wikidataId: twin?.wikidataId || spot.wikidataId || "",
			commonsFile: twin?.commonsFile || spot.commonsFile || "",
			commonsCategory: twin?.commonsCategory || spot.commonsCategory || "",
			wikipedia: twin?.wikipedia || spot.wikipedia || "",
			mapillaryId: spot.mapillaryId || twin?.mapillaryId || "",
			panoramaxId: spot.panoramaxId || twin?.panoramaxId || "",
			website: spot.website || twin?.website || "",
			region: spot.region || twin?.region || "",
			sitelinks: twin?.sitelinks ?? spot.sitelinks,
			mentioned: twin?.mentioned || spot.mentioned,
			groups: twin?.groups?.length ? twin.groups : spot.groups,
			sourceNote: twin ? `${twin.sourceNote ?? "Wikidata"} · OpenStreetMap` : "OpenStreetMap"
		}, area.latitude, area.longitude);
		merged.push(next);
	}
	for (const place of knowledge) {
		if (used.has(place.id)) continue;
		if (merged.some((item) => sameIdentity(item, place))) continue;
		const local = localOf([place.nameLocal, place.name], place.nameEn);
		merged.push(annotatePlace({
			...place,
			area: area.name,
			address: place.address || area.name,
			nameLocal: local.name,
			localName: local.name,
			localNameSource: local.source
		}, area.latitude, area.longitude));
	}
	return merged;
}
var GENERIC_WORDS = /* @__PURE__ */ new Set([
	"museum",
	"musee",
	"tower",
	"tour",
	"cathedral",
	"cathedrale",
	"basilica",
	"basilique",
	"church",
	"eglise",
	"palace",
	"palais",
	"garden",
	"jardin",
	"park",
	"parc",
	"bridge",
	"pont",
	"national",
	"centre",
	"center",
	"chapel",
	"chapelle",
	"the",
	"des",
	"les",
	"du",
	"de",
	"la",
	"le",
	"of",
	"and"
]);
function foldName(value) {
	return value.toLowerCase().replace(/œ/g, "oe").replace(/æ/g, "ae").normalize("NFD").replace(/\p{M}/gu, "").replace(/[^a-z0-9\u4e00-\u9fff]+/g, " ").trim();
}
function nameStem(value) {
	return foldName(value).split(" ").filter((word) => word.length > 2 && !GENERIC_WORDS.has(word)).join("");
}
function compatiblePlace(left, right) {
	if (left === "stay" || right === "stay") return left === right;
	const food = /* @__PURE__ */ new Set([
		"restaurant",
		"cafe",
		"market",
		"nightlife"
	]);
	if (food.has(left) || food.has(right)) return food.has(left) && food.has(right);
	return true;
}
function sameIdentity(left, right) {
	if (!compatiblePlace(left.category, right.category)) return false;
	if (namesMatch(left.name, right.name)) return true;
	if (left.nameLocal && (namesMatch(left.nameLocal, right.name) || right.nameLocal && namesMatch(left.nameLocal, right.nameLocal))) return true;
	if (right.nameLocal && namesMatch(left.name, right.nameLocal)) return true;
	if (left.nameEn && right.nameEn && namesMatch(left.nameEn, right.nameEn)) return true;
	if (left.nameEn && namesMatch(left.nameEn, right.name)) return true;
	if (right.nameEn && namesMatch(left.name, right.nameEn)) return true;
	return false;
}
function namesMatch(left, right) {
	const stemA = nameStem(left);
	const stemB = nameStem(right);
	if (stemA.length >= 6 && stemA === stemB) return true;
	const a = foldName(left).replace(/ /g, "");
	const b = foldName(right).replace(/ /g, "");
	if (!a || !b) return false;
	if (a === b) return true;
	if (a.length < 6 || b.length < 6) return false;
	const short = a.length < b.length ? a : b;
	const long = a.length < b.length ? b : a;
	return long.includes(short) && short.length / long.length >= .62;
}
var extractCache = new TtlCache(12096e5, 400, "discovery");
var storyCache = new TtlCache(6048e5, 40, "gemini");
var SEE$1 = /* @__PURE__ */ new Set([
	"attraction",
	"museum",
	"park",
	"garden",
	"viewpoint",
	"landmark",
	"historic",
	"theme_park",
	"zoo",
	"aquarium",
	"shopping",
	"beach",
	"family"
]);
var UA$1 = "Kairos/1.0 (travel; contact: local)";
function wikiTitle(place) {
	const wiki = place.wikipedia || "";
	if (/^en:/i.test(wiki)) return wiki.slice(3).replace(/_/g, " ").trim();
	const source = (place.name || "").trim();
	if (source && !/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(source)) return source;
	const english = (place.displayName || place.nameEn || "").trim();
	if (english) return english;
	return source;
}
async function wikipediaExtracts(titles) {
	const found = /* @__PURE__ */ new Map();
	const pending = [];
	for (const title of titles) {
		const cached = extractCache.get(title.toLowerCase());
		if (cached) found.set(title.toLowerCase(), cached);
		else if (!pending.some((item) => item.toLowerCase() === title.toLowerCase())) pending.push(title);
	}
	for (let index = 0; index < pending.length; index += 20) {
		const chunk = pending.slice(index, index + 20);
		const url = new URL("https://en.wikipedia.org/w/api.php");
		url.searchParams.set("action", "query");
		url.searchParams.set("format", "json");
		url.searchParams.set("formatversion", "2");
		url.searchParams.set("redirects", "1");
		url.searchParams.set("prop", "extracts");
		url.searchParams.set("exintro", "1");
		url.searchParams.set("explaintext", "1");
		url.searchParams.set("exsentences", "2");
		url.searchParams.set("titles", chunk.join("|"));
		noteCall("discovery", "wikipedia");
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"User-Agent": UA$1
			},
			signal: AbortSignal.timeout(12e3)
		}).catch(() => null);
		if (!res?.ok) continue;
		const body = await res.json();
		const byTitle = /* @__PURE__ */ new Map();
		for (const page of body.query?.pages ?? []) {
			const extract = (page.extract || "").replace(/\s*\([^)]*[:[\]][^)]*\)/g, " ").replace(/\s+/g, " ").trim();
			if (page.title && extract && !page.missing) byTitle.set(page.title.toLowerCase(), extract.slice(0, 700));
		}
		for (const redirect of body.query?.redirects ?? []) {
			const extract = redirect.to ? byTitle.get(redirect.to.toLowerCase()) : "";
			if (redirect.from && extract) byTitle.set(redirect.from.toLowerCase(), extract);
		}
		for (const title of chunk) {
			const extract = byTitle.get(title.toLowerCase()) || "";
			if (!extract) continue;
			extractCache.set(title.toLowerCase(), extract);
			found.set(title.toLowerCase(), extract);
		}
	}
	return found;
}
async function rewriteBatch(rows) {
	const key = rows.map((row) => `${row.id}:${row.facts.slice(0, 80)}`).join("|").slice(0, 500);
	const cached = storyCache.get(key);
	if (cached) return cached;
	const raw = await geminiJson("Rewrite traveller-facing lines using only the facts given for each place. Do not add dates, people, heights, or events that are not in facts. Do not say popular, must-see, worth visiting, famous place, open place list, or private ranking. whyIconic is one specific sentence. whyGo is the experience, not a repeat of whyIconic. If the facts are only a location, return empty strings.", JSON.stringify({ places: rows.map((row) => ({
		id: row.id,
		name: row.name,
		category: row.category,
		facts: row.facts.slice(0, 500)
	})) }), {
		type: "object",
		properties: { places: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "string" },
					whyIconic: { type: "string" },
					whyGo: { type: "string" }
				},
				required: [
					"id",
					"whyIconic",
					"whyGo"
				]
			}
		} },
		required: ["places"]
	}, 1400).catch(() => null);
	const list = raw && typeof raw === "object" && Array.isArray(raw.places) ? raw.places : [];
	const out = {};
	for (const row of rows) {
		const hit = list.find((item) => item.id === row.id);
		const facts = row.facts;
		const whyIconic = acceptExperienceLine(hit?.whyIconic || "", facts) ? (hit?.whyIconic || "").replace(/\s+/g, " ").trim().slice(0, 280) : "";
		const whyGo = acceptExperienceLine(hit?.whyGo || "", facts) ? (hit?.whyGo || "").replace(/\s+/g, " ").trim().slice(0, 280) : "";
		if (whyIconic || whyGo) out[row.id] = {
			whyIconic,
			whyGo
		};
	}
	if (Object.keys(out).length) storyCache.set(key, out);
	return out;
}
async function attachPlaceStories(places, city) {
	const notable = places.filter((place) => SEE$1.has(place.category) && (place.importance === "iconic" || place.importance === "major" || place.importance === "interest")).slice(0, 24);
	if (!notable.length) return places;
	const key = `${city}:${notable.map((place) => place.id).join(",")}`;
	return shareRequest(`stories:${key}`, async () => {
		const extracts = await wikipediaExtracts(notable.map(wikiTitle).filter((title) => title.length > 2)).catch(() => /* @__PURE__ */ new Map());
		const drafted = places.map((place) => {
			if (!SEE$1.has(place.category)) return place;
			const title = wikiTitle(place).toLowerCase();
			const story = buildPlaceStory({
				...place,
				city,
				extract: extracts.get(title) || "",
				imageSource: place.photo?.source || ""
			}, nearbyPlaceNames(place, places));
			return {
				...place,
				story
			};
		});
		const batch = drafted.filter((place) => place.story && (place.importance === "iconic" || place.importance === "major") && (place.story.factSource === "wikipedia" || place.description && place.description.length > 40)).slice(0, 20).map((place) => ({
			id: place.id,
			name: readableName(place),
			category: place.category,
			facts: `${extracts.get(wikiTitle(place).toLowerCase()) || ""} ${place.description || ""}`.trim(),
			whyIconic: place.story?.whyIconic || "",
			whyGo: place.story?.whyGo || ""
		})).filter((row) => row.facts.length > 40);
		const rewritten = batch.length ? await rewriteBatch(batch).catch(() => ({})) : {};
		return drafted.map((place) => {
			const next = rewritten[place.id];
			if (!next || !place.story) return place;
			const whyIconic = next.whyIconic || place.story.whyIconic;
			const whyGo = next.whyGo || place.story.whyGo;
			return {
				...place,
				story: {
					...place.story,
					whyIconic,
					whyGo,
					shortDescription: whyGo || whyIconic || place.story.shortDescription,
					sourceConfidence: whyIconic ? "verified" : place.story.sourceConfidence
				}
			};
		});
	});
}
var require$2 = createRequire(import.meta.url);
var nameCache = new TtlCache(2592e6, 800, "gemini");
var textCache = new TtlCache(2592e6, 400, "gemini");
function construct(mod) {
	let current = mod;
	for (let hop = 0; hop < 4; hop += 1) {
		if (typeof current === "function") return current;
		if (current && typeof current === "object" && "default" in current) {
			current = current.default;
			continue;
		}
		return null;
	}
	return null;
}
var japanese = null;
function japaneseEngine() {
	if (!japanese) japanese = (async () => {
		try {
			const kuroMod = await import("../_libs/kuroshiro.mjs").then((n) => n.t);
			const anaMod = await import("../_libs/kuroshiro-analyzer-kuromoji.mjs").then((n) => n.t);
			const Kuroshiro = construct(kuroMod);
			const Analyzer = construct(anaMod);
			if (!Kuroshiro || !Analyzer) return null;
			const engine = new Kuroshiro();
			await engine.init(new Analyzer());
			return engine;
		} catch {
			return null;
		}
	})();
	return japanese;
}
function korean(text) {
	try {
		const value = require$2("aromanize").romanize?.(text) ?? "";
		return tidyLatin(value.replace(/[?.!]+$/g, ""));
	} catch {
		return "";
	}
}
/** Deterministic reading. Not an official English name. Japanese does not fall through to Chinese readings. */
async function romanizeName(text, language) {
	const clean = text.replace(/\s+/g, " ").trim();
	if (!clean || !hasNonLatin(clean)) return "";
	if (language === "ja") {
		const engine = await japaneseEngine();
		if (!engine) return "";
		const value = await engine.convert(clean, {
			to: "romaji",
			mode: "spaced",
			romajiSystem: "passport"
		}).catch(() => "");
		return polishReading(clean, tidyLatin(value), "ja");
	}
	if (language === "zh") {
		const value = pinyin(clean, {
			toneType: "none",
			type: "string",
			separator: " "
		});
		const tidy = tidyLatin(value);
		if (tidy) return polishReading(clean, tidy, "zh");
	}
	if (language === "ko") {
		const value = korean(clean);
		if (value) return polishReading(clean, value, "ko");
	}
	const ascii = tidyLatin(anyAscii(clean));
	return polishReading(clean, ascii, language);
}
function cacheKey(local, category) {
	return `en|${category}|${local}`;
}
function confidenceOf(value) {
	const text = value.toLowerCase();
	if (text === "high") return "high";
	if (text === "medium") return "medium";
	return "low";
}
async function translateNames(rows) {
	const found = /* @__PURE__ */ new Map();
	const pending = [];
	for (const row of rows) {
		const cached = nameCache.get(cacheKey(row.local, row.category));
		if (cached) found.set(row.id, cached);
		else pending.push(row);
	}
	for (let index = 0; index < pending.length; index += 24) {
		const chunk = pending.slice(index, index + 24);
		const raw = await geminiJson("You name places for an English-speaking traveller. For each item, return the established English name if one is commonly used, otherwise a close reading of the local name. Keep the same place. Do not substitute a different attraction, hotel, station, or neighbourhood. Do not add facts, descriptions, or addresses. A proper noun with no established English name should stay close to the romanized hint. If you are unsure, repeat the romanized hint and set confidence to low.", JSON.stringify({ names: chunk.map((row) => ({
			placeId: row.id,
			localName: row.local,
			romanizedHint: row.romanized,
			category: row.category
		})) }), {
			type: "object",
			properties: { names: {
				type: "array",
				items: {
					type: "object",
					properties: {
						placeId: { type: "string" },
						localName: { type: "string" },
						englishName: { type: "string" },
						romanizedName: { type: "string" },
						confidence: { type: "string" }
					},
					required: [
						"placeId",
						"englishName",
						"romanizedName",
						"confidence"
					]
				}
			} },
			required: ["names"]
		}, 1200).catch(() => null);
		const names = raw && typeof raw === "object" && Array.isArray(raw.names) ? raw.names : [];
		if (!raw) continue;
		const byId = new Map(chunk.map((row) => [row.id, row]));
		for (const item of names) {
			const id = item.placeId ?? "";
			const row = byId.get(id);
			if (!row || !item.englishName) continue;
			const translated = {
				english: item.englishName.replace(/\s+/g, " ").trim().slice(0, 120),
				romanized: (item.romanizedName ?? row.romanized).replace(/\s+/g, " ").trim().slice(0, 120),
				confidence: confidenceOf(item.confidence ?? "")
			};
			if (!translated.english || hasNonLatin(translated.english)) continue;
			if (!(row.romanized ? translationFits(row.romanized, translated.english) || translationFits(translated.romanized, translated.english) : translated.confidence === "high")) translated.confidence = "low";
			nameCache.set(cacheKey(row.local, row.category), translated);
			found.set(id, translated);
		}
		for (const row of chunk) {
			if (found.has(row.id)) continue;
			const missed = {
				english: row.romanized,
				romanized: row.romanized,
				confidence: "low"
			};
			nameCache.set(cacheKey(row.local, row.category), missed);
			found.set(row.id, missed);
		}
	}
	return found;
}
async function translateDescriptions(rows) {
	const found = /* @__PURE__ */ new Map();
	const pending = [];
	for (const row of rows) {
		const cached = textCache.get(row.text);
		if (cached) found.set(row.id, cached);
		else pending.push(row);
	}
	for (let index = 0; index < pending.length; index += 20) {
		const chunk = pending.slice(index, index + 20);
		const raw = await geminiJson("Translate each description into one concise English sentence. Use only the text given. Do not add places, prices, hours, ratings, or history that is not in the text. If you cannot translate it, return an empty english string.", JSON.stringify({ texts: chunk.map((row) => ({
			placeId: row.id,
			text: row.text
		})) }), {
			type: "object",
			properties: { texts: {
				type: "array",
				items: {
					type: "object",
					properties: {
						placeId: { type: "string" },
						english: { type: "string" }
					},
					required: ["placeId", "english"]
				}
			} },
			required: ["texts"]
		}, 900).catch(() => null);
		const texts = raw && typeof raw === "object" && Array.isArray(raw.texts) ? raw.texts : [];
		if (!raw) continue;
		const byId = new Map(chunk.map((row) => [row.id, row]));
		for (const item of texts) {
			const row = byId.get(item.placeId ?? "");
			const english = (item.english ?? "").replace(/\s+/g, " ").trim().slice(0, 280);
			if (!row || !english || hasNonLatin(english)) continue;
			textCache.set(row.text, english);
			found.set(row.id, english);
		}
	}
	return found;
}
function apply(place, hint, extra) {
	const country = (hint.countryCode ?? "").toUpperCase();
	let nameLocal = place.nameLocal || "";
	if (country && nameLocal && !localNameFits(nameLocal, country)) nameLocal = "";
	if (!nameLocal) {
		const candidate = tidyLocalLabel(place.name || "");
		const english = (place.nameEn || "").trim();
		if (candidate && (!country || localNameFits(candidate, country)) && candidate.toLowerCase() !== english.toLowerCase()) nameLocal = candidate;
	}
	const fields = resolvePlaceDisplayName({
		name: place.name,
		nameEn: place.nameEn,
		nameLatin: place.nameLatin,
		nameLocal,
		romanized: extra?.romanized || place.nameRomanized,
		translated: extra?.translated,
		countryCode: country,
		lat: place.lat,
		lng: place.lng,
		englishSource: place.nameEn ? place.translationSource === "wikidata_en" ? "wikidata_en" : "osm_name_en" : ""
	}, "en");
	return {
		...place,
		...fields,
		localName: fields.nameLocal || nameLocal || ""
	};
}
/**
* Resolve display names once per plan. Official English, then verified Latin, then romanisation, then one batched translation.
* Results are cached in memory. Rendering does not call this. The canonical `name` is left as the source returned it.
*/
async function labelPlaces(places, hint = {}) {
	try {
		const seeded = places.map((place) => apply(place, hint));
		const roman = /* @__PURE__ */ new Map();
		for (const place of seeded) {
			const local = place.nameLocal || (hasNonLatin(place.name) ? place.name : "");
			if (!local || !hasNonLatin(local)) continue;
			if (place.nameLatin && tidyLatin(place.nameLatin)) continue;
			const value = await romanizeName(local, sourceLanguage(local, hint.countryCode, place.lat || hint.latitude, place.lng || hint.longitude)).catch(() => "");
			if (value) roman.set(place.id, value);
		}
		const read = seeded.map((place) => roman.has(place.id) ? apply(place, hint, { romanized: roman.get(place.id) }) : place);
		const unresolved = read.filter((place) => {
			const local = place.nameLocal || place.name;
			if (!hasNonLatin(local)) return false;
			if (place.displayNameQuality === "official") return false;
			if (place.translationSource === "osm_name_latin") return false;
			return true;
		});
		const translated = unresolved.length ? await translateNames(unresolved.map((place) => ({
			id: place.id,
			local: place.nameLocal || place.name,
			romanized: place.nameRomanized || "",
			category: place.category || "place"
		}))) : /* @__PURE__ */ new Map();
		const named = read.map((place) => translated.has(place.id) ? apply(place, hint, {
			romanized: roman.get(place.id) || place.nameRomanized,
			translated: translated.get(place.id)
		}) : place);
		const descriptions = named.filter((place) => place.description && hasNonLatin(place.description));
		const englishText = descriptions.length ? await translateDescriptions(descriptions.map((place) => ({
			id: place.id,
			text: place.description || ""
		}))) : /* @__PURE__ */ new Map();
		return await Promise.all(named.map(async (place) => {
			const descriptionDisplay = englishText.get(place.id) || (place.description && !hasNonLatin(place.description) ? place.description : place.descriptionDisplay || "");
			let addressDisplay = place.addressDisplay && !hasNonLatin(place.addressDisplay) ? place.addressDisplay : "";
			let addressLocal = place.addressLocal || "";
			if (place.address && hasNonLatin(place.address)) {
				addressLocal = place.addressLocal || place.address;
				if (!addressDisplay) {
					const language = sourceLanguage(place.address, hint.countryCode, place.lat || hint.latitude, place.lng || hint.longitude);
					addressDisplay = polishAddress(place.address, await romanizeName(place.address, language).catch(() => ""), language);
				}
			} else if (place.address && !addressDisplay) addressDisplay = place.address;
			return {
				...place,
				descriptionDisplay,
				addressLocal,
				addressDisplay
			};
		}));
	} catch {
		return places;
	}
}
var photonCache = new TtlCache(864e5, 200, "geocode");
var placeCache = new TtlCache(432e5, 200, "discovery");
var matrixCache = new TtlCache(216e5, 200, "routing");
var routeCache = new TtlCache(216e5, 200, "routing");
var weatherCache = new TtlCache(108e5, 200, "weather");
var photonGate = new RequestGate(4, 1e4);
var nominatimGate = new RequestGate(1, 1100);
var overpassGate = new RequestGate(2, 4e3);
var routeGate = new RequestGate(8, 1e4);
var weatherGate = new RequestGate(2, 1e4);
var OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.openstreetmap.fr/api/interpreter"];
var UA = "Kairos/1.0 (travel; contact: local)";
function keyOf(points) {
	return points.map((point) => `${point.lat.toFixed(3)},${point.lng.toFixed(3)}`).join(";");
}
async function photon(query) {
	const url = new URL("https://photon.komoot.io/api/");
	url.searchParams.set("q", query);
	url.searchParams.set("limit", "12");
	url.searchParams.set("lang", "en");
	for (const layer of [
		"country",
		"state",
		"city",
		"county",
		"locality"
	]) url.searchParams.append("layer", layer);
	noteCall("geocode", "photon");
	const res = await fetch(url, {
		headers: {
			Accept: "application/json",
			"User-Agent": UA
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) {
		noteFailure("geocode", "photon", `HTTP ${res.status}`);
		return [];
	}
	const body = await res.json();
	const hits = [];
	for (const feature of body.features ?? []) {
		const [lng, lat] = feature.geometry?.coordinates ?? [];
		const hit = travelDestinationFromPhoton(feature.properties ?? {}, lat, lng);
		if (hit) hits.push(hit);
	}
	return rankTravelDestinations(query, hits);
}
async function nominatim(query) {
	if (!nominatimGate.allow()) return [];
	const url = new URL("https://nominatim.openstreetmap.org/search");
	url.searchParams.set("q", query);
	url.searchParams.set("format", "jsonv2");
	url.searchParams.set("limit", "5");
	url.searchParams.set("addressdetails", "1");
	url.searchParams.set("accept-language", "en");
	noteCall("geocode", "nominatim");
	const res = await fetch(url, {
		headers: {
			Accept: "application/json",
			"User-Agent": UA
		},
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) {
		noteFailure("geocode", "nominatim", `HTTP ${res.status}`);
		return [];
	}
	const body = await res.json();
	const hits = [];
	for (const row of body) {
		const lat = Number(row.lat);
		const lng = Number(row.lon);
		const kind = row.addresstype || row.type || "";
		const mapped = kind === "country" ? "country" : kind === "state" || kind === "region" ? "region" : kind === "island" ? "island" : "city";
		const rawName = row.display_name?.split(",")[0]?.trim() || query;
		const named = englishAreaName(rawName, query);
		const fake = travelDestinationFromPhoton({
			name: named === "this area" ? rawName : named,
			country: row.address?.country || "",
			countrycode: row.address?.country_code || "",
			osm_key: "place",
			osm_value: mapped === "country" ? "country" : mapped === "region" ? "state" : mapped === "island" ? "island" : "city",
			osm_type: row.osm_type,
			osm_id: row.osm_id,
			boundingbox: row.boundingbox
		}, lat, lng);
		if (fake) hits.push(fake);
	}
	return rankTravelDestinations(query, hits);
}
async function searchTravelDestinations(query) {
	const q = query.trim();
	if (q.length < 2) return [];
	const cacheKey = q.toLowerCase();
	const cached = photonCache.get(cacheKey);
	if (cached) return cached;
	return shareRequest(`geo:${cacheKey}`, async () => {
		const again = photonCache.peek(cacheKey);
		if (again) return again;
		let hits = [];
		if (photonGate.allow()) hits = await photon(q).catch(() => []);
		if (!hits.length) hits = await nominatim(q).catch(() => []);
		photonCache.set(cacheKey, hits);
		return hits;
	});
}
/** Resolves a hotel the traveller already booked. Requires coordinates. Never uses the name alone. */
async function locateHotel(query, near) {
	const q = query.trim();
	const centre = near.find((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
	if (q.length < 2 || !centre || !nominatimGate.allow()) return null;
	const url = new URL("https://nominatim.openstreetmap.org/search");
	url.searchParams.set("q", q);
	url.searchParams.set("format", "jsonv2");
	url.searchParams.set("limit", "5");
	url.searchParams.set("addressdetails", "1");
	url.searchParams.set("viewbox", `${centre.lng - .8},${centre.lat + .6},${centre.lng + .8},${centre.lat - .6}`);
	noteCall("geocode", "nominatim");
	try {
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"User-Agent": UA
			},
			signal: AbortSignal.timeout(8e3)
		});
		if (!res.ok) {
			noteFailure("geocode", "nominatim", `HTTP ${res.status}`);
			return null;
		}
		const body = await res.json();
		const hits = [];
		for (const row of body) {
			const lat = Number(row.lat);
			const lng = Number(row.lon);
			const name = (row.name || row.display_name?.split(",")[0] || "").trim();
			if (!name || !Number.isFinite(lat) || !Number.isFinite(lng) || row.osm_id == null) continue;
			const kind = row.osm_type === "way" || row.osm_type === "relation" || row.osm_type === "node" ? row.osm_type : "node";
			hits.push({
				name: name.slice(0, 80),
				lat,
				lng,
				address: (row.display_name || name).slice(0, 160),
				provider: "osm",
				providerId: `osm:${kind}:${row.osm_id}`
			});
		}
		return chooseHotelHit(hits, near, q);
	} catch {
		noteFailure("geocode", "nominatim", "Hotel lookup failed.");
		return null;
	}
}
function overpassQuery(area, box) {
	const { latitude: lat, longitude: lng } = area;
	const inner = `${box.south},${box.west},${box.north},${box.east}`;
	return `[out:json][timeout:18];
(
  node["name"]["tourism"~"^(hotel|guest_house|hostel)$"](around:4200,${lat},${lng});
  way["name"]["tourism"~"^(hotel|guest_house|hostel)$"](around:4200,${lat},${lng});
);
out center 24;
(
  relation["name"]["tourism"~"^(attraction|museum|gallery|viewpoint|zoo|aquarium|theme_park)$"](${inner});
);
out center 18;
(
  way["name"]["tourism"~"^(museum|gallery|viewpoint|zoo|aquarium|theme_park)$"](${inner});
  way["name"]["tourism"="attraction"]["wikidata"](${inner});
  way["name"]["historic"~"^(monument|church|cathedral|monastery|palace|castle|shrine|temple)$"]["wikidata"](${inner});
  way["name"]["leisure"="park"]["wikidata"](${inner});
  relation["name"]["historic"~"^(shrine|temple|castle|palace)$"](${inner});
);
out center 36;
(
  node["name"]["amenity"~"^(restaurant|cafe|marketplace)$"](around:900,${lat},${lng});
);
out center 8;`;
}
function osmLocalName(tags, country, name, nameEn) {
	for (const lang of destinationLanguages(country)) {
		if (lang === "en") continue;
		const value = tidyLocalLabel(tags[`name:${lang}`] || tags[`name:${lang}-Hans`] || tags[`name:${lang}-Hant`] || "");
		if (value && (!country || localNameFits(value, country)) && value.toLowerCase() !== nameEn.toLowerCase()) return value;
	}
	const local = tidyLocalLabel(name);
	if (!local || nameEn && local.toLowerCase() === nameEn.toLowerCase()) return "";
	if (country && !localNameFits(local, country)) return "";
	return local;
}
async function discoverPlaces(area) {
	const region = discoveryBox(area);
	const country = (area.countryCode || inferCountry(area.latitude, area.longitude) || "").toUpperCase();
	const cacheKey = `v9:${country}:${region.south.toFixed(2)},${region.west.toFixed(2)},${region.north.toFixed(2)},${region.east.toFixed(2)}`;
	const cached = placeCache.get(cacheKey);
	if (cached) return {
		...cached,
		places: cached.places.map((spot) => ({
			...spot,
			area: area.name
		}))
	};
	return shareRequest(`places:${cacheKey}`, async () => {
		const again = placeCache.peek(cacheKey);
		if (again) return {
			...again,
			places: again.places.map((spot) => ({
				...spot,
				area: area.name
			}))
		};
		const query = overpassQuery(area, region);
		let lastError = "OpenStreetMap did not answer.";
		for (const host of OVERPASS) {
			if (!overpassGate.allow()) {
				lastError = "OpenStreetMap rate limit.";
				break;
			}
			try {
				noteCall("discovery", "overpass");
				const res = await fetch(host, {
					method: "POST",
					headers: {
						"Content-Type": "text/plain",
						"User-Agent": UA
					},
					body: query,
					signal: AbortSignal.timeout(2e4)
				});
				if (res.status === 429 || res.status === 504 || res.status === 502) {
					lastError = `OpenStreetMap HTTP ${res.status}.`;
					continue;
				}
				if (!res.ok) {
					lastError = `OpenStreetMap HTTP ${res.status}.`;
					continue;
				}
				const body = await res.json();
				const elements = body.elements ?? [];
				if (body.remark && /error|timeout|runtime/i.test(body.remark) && !elements.length) {
					lastError = body.remark.slice(0, 180);
					continue;
				}
				const seen = /* @__PURE__ */ new Set();
				const spots = [];
				for (const element of elements) {
					const tags = element.tags ?? {};
					const mapped = categoryFromTags(tags);
					const name = (tags.name || tags["name:en"] || tags["name:ja"] || tags["name:zh"] || tags["name:ko"] || tags["name:th"] || "").replace(/\s+/g, " ").trim();
					const lat = element.lat ?? element.center?.lat;
					const lng = element.lon ?? element.center?.lon;
					if (!mapped || name.length < 2 || lat == null || lng == null) continue;
					const id = `osm:${element.type}:${element.id}`;
					const nameKey = name.toLowerCase();
					if (seen.has(nameKey) && mapped.category !== "stay") continue;
					if (mapped.category !== "stay") seen.add(nameKey);
					const house = tags["addr:housenumber"] || "";
					const street = tags["addr:street"] || "";
					const city = tags["addr:city"] || "";
					const streetEn = tags["addr:street:en"] || "";
					const cityEn = tags["addr:city:en"] || "";
					const address = [
						house,
						street,
						city
					].filter(Boolean).join(" ");
					const addressEn = [
						house,
						streetEn,
						cityEn
					].filter(Boolean).join(" ");
					const nameEn = (tags["name:en"] || tags["official_name:en"] || tags.int_name || "").replace(/\s+/g, " ").trim();
					const nameLatin = (tags["name:latin"] || tags["name:ja-Latn"] || tags["name:zh-Latn"] || tags["name:ko-Latn"] || tags["name:th-Latn"] || "").replace(/\s+/g, " ").trim();
					const nameLocal = osmLocalName(tags, country, name, nameEn);
					const wikidataId = /^Q\d+$/.test(tags.wikidata || "") ? tags.wikidata : "";
					const commonsRaw = tags.wikimedia_commons || "";
					const imageTag = tags.image || "";
					const imageFile = commonsFileTitle(imageTag);
					const commonsFile = /^category:/i.test(commonsRaw) ? imageFile : commonsFileTitle(commonsRaw.startsWith("http") || /^(file|fichier|category):/i.test(commonsRaw) ? commonsRaw : commonsRaw ? `File:${commonsRaw}` : "") || imageFile;
					const commonsCategory = /^category:/i.test(commonsRaw) ? commonsCategoryTitle(commonsRaw) : "";
					const wikipedia = parseWikipedia(tags.wikipedia || (tags["wikipedia:en"] ? `en:${tags["wikipedia:en"]}` : "")) ? tags.wikipedia || `en:${tags["wikipedia:en"]}` : "";
					const mapillaryId = (tags.mapillary || "").trim().slice(0, 80);
					const panoramaxId = (tags.panoramax || tags["panoramax:id"] || "").trim().slice(0, 80);
					const website = verifiedWebsite(tags.website || tags["contact:website"] || "");
					const regionName = (tags["addr:province:en"] || tags["addr:state:en"] || tags["addr:province"] || tags["addr:state"] || "").replace(/\s+/g, " ").trim().slice(0, 40);
					const locality = (tags["addr:city:en"] || tags["addr:city"] || "").replace(/\s+/g, " ").trim().slice(0, 40);
					spots.push({
						id,
						provider: "osm",
						providerId: id,
						name: name.slice(0, 80),
						category: mapped.category,
						address: (address || area.name).slice(0, 140),
						lat,
						lng,
						indoor: mapped.indoor,
						area: area.name,
						opening: (tags.opening_hours ?? "").slice(0, 240),
						nameEn: nameEn.slice(0, 80),
						nameLatin: nameLatin && nameLatin !== nameEn ? nameLatin.slice(0, 80) : "",
						nameLocal: nameLocal.slice(0, 80),
						localName: nameLocal.slice(0, 80),
						addressLocal: hasNonLatin(address) ? address.slice(0, 140) : "",
						addressDisplay: addressEn && !hasNonLatin(addressEn) ? addressEn.slice(0, 140) : "",
						wikidataId,
						commonsFile,
						commonsCategory,
						wikipedia,
						mapillaryId,
						panoramaxId,
						website,
						region: regionName,
						locality,
						hotel: mapped.category === "stay" ? {
							airConditioning: tags.air_conditioning === "yes" ? "yes" : tags.air_conditioning === "no" ? "no" : "unknown",
							stars: (tags.stars ?? "").slice(0, 12),
							internet: (tags.internet_access ?? "").slice(0, 40),
							breakfast: (tags.breakfast ?? "").slice(0, 40),
							parking: (tags.parking ?? "").slice(0, 40),
							wheelchair: (tags.wheelchair ?? "").slice(0, 40),
							roomSize: (tags["room:size"] || tags.room_size || "").slice(0, 24),
							kind: (tags.tourism ?? "").slice(0, 40)
						} : void 0,
						localNameSource: nameLocal ? "osm_destination_language" : "",
						sourceNote: "OpenStreetMap"
					});
				}
				const stays = /* @__PURE__ */ new Map();
				const rest = [];
				for (const spot of spots) {
					if (spot.category !== "stay") {
						rest.push(spot);
						continue;
					}
					const key = spot.name.toLowerCase();
					const previous = stays.get(key);
					if (!previous || distanceMeters(area.latitude, area.longitude, spot.lat, spot.lng) < distanceMeters(area.latitude, area.longitude, previous.lat, previous.lng)) stays.set(key, spot);
				}
				const places = [...stays.values(), ...rest];
				const hotels = places.some((spot) => spot.category === "stay") ? "ok" : "empty";
				const result = {
					places,
					status: places.length ? "ok" : "empty",
					hotels,
					error: places.length ? "" : "OpenStreetMap returned no named places in this area.",
					rawCount: elements.length,
					parsedCount: places.length
				};
				if (places.length) placeCache.set(cacheKey, result);
				return {
					...result,
					places: places.map((spot) => ({
						...spot,
						area: area.name
					}))
				};
			} catch (error) {
				lastError = error instanceof Error ? error.name === "TimeoutError" ? "OpenStreetMap timed out." : error.message : "OpenStreetMap request failed.";
			}
		}
		noteFailure("discovery", "overpass", lastError);
		return {
			places: [],
			status: "failed",
			hotels: "failed",
			error: lastError,
			rawCount: 0,
			parsedCount: 0
		};
	});
}
function profile(move) {
	if (move === "walk") return {
		host: "https://routing.openstreetmap.de/routed-foot",
		name: "foot"
	};
	return {
		host: "https://router.project-osrm.org",
		name: "driving"
	};
}
async function travelMatrix(move, points) {
	if (points.length < 2) return null;
	const limited = points.slice(0, 28);
	const cacheKey = `${move}:${keyOf(limited)}`;
	const cached = matrixCache.get(cacheKey);
	if (cached) return cached;
	return shareRequest(`matrix:${cacheKey}`, async () => {
		const again = matrixCache.peek(cacheKey);
		if (again) return again;
		const routed = profile(move === "transit" ? "drive" : move);
		if (!routeGate.allow()) return null;
		try {
			const path = limited.map((point) => `${point.lng},${point.lat}`).join(";");
			noteCall("routing", "osrm-matrix");
			const res = await fetch(`${routed.host}/table/v1/${routed.name}/${path}?annotations=duration,distance`, {
				headers: {
					Accept: "application/json",
					"User-Agent": UA
				},
				signal: AbortSignal.timeout(12e3)
			});
			if (!res.ok) {
				noteFailure("routing", "osrm-matrix", `HTTP ${res.status}`);
				return null;
			}
			const body = await res.json();
			const minutes = (body.durations ?? []).map((row) => row.map((value) => typeof value === "number" && value >= 0 ? Math.max(1, Math.round(value / 60)) : null));
			const meters = (body.distances ?? []).map((row) => row.map((value) => typeof value === "number" && value >= 0 ? Math.round(value) : null));
			if (!minutes.length) return null;
			const matrix = {
				minutes,
				meters
			};
			matrixCache.set(cacheKey, matrix);
			return matrix;
		} catch {
			return null;
		}
	});
}
async function travelRoute(move, points) {
	const empty = {
		minutes: [],
		meters: [],
		line: null,
		source: "estimate"
	};
	if (points.length < 2) return empty;
	const cacheKey = `${move}:${keyOf(points)}`;
	const cached = routeCache.get(cacheKey);
	if (cached) return cached;
	return shareRequest(`route:${cacheKey}`, async () => {
		const again = routeCache.peek(cacheKey);
		if (again) return again;
		const routed = profile(move === "transit" ? "drive" : move);
		if (!routeGate.allow()) return empty;
		try {
			const path = points.map((point) => `${point.lng},${point.lat}`).join(";");
			noteCall("routing", "osrm-route");
			const res = await fetch(`${routed.host}/route/v1/${routed.name}/${path}?overview=full&geometries=geojson&steps=false`, {
				headers: {
					Accept: "application/json",
					"User-Agent": UA
				},
				signal: AbortSignal.timeout(12e3)
			});
			if (!res.ok) {
				noteFailure("routing", "osrm-route", `HTTP ${res.status}`);
				return empty;
			}
			const route = (await res.json()).routes?.[0];
			if (!route?.legs?.length) return empty;
			const result = {
				minutes: route.legs.map((leg) => typeof leg.duration === "number" ? Math.max(1, Math.round(leg.duration / 60)) : null),
				meters: route.legs.map((leg) => typeof leg.distance === "number" ? Math.round(leg.distance) : null),
				line: route.geometry?.coordinates?.length ? route.geometry.coordinates : null,
				source: "osrm"
			};
			routeCache.set(cacheKey, result);
			return result;
		} catch {
			return empty;
		}
	});
}
async function travelWeather(origin, dates) {
	const cacheKey = `${origin.lat.toFixed(2)},${origin.lng.toFixed(2)}:${dates[0] ?? ""}:${dates.length}`;
	const cached = weatherCache.get(cacheKey);
	if (cached) return cached;
	return shareRequest(`weather:${cacheKey}`, async () => {
		const again = weatherCache.peek(cacheKey);
		if (again) return again;
		const missed = dates.map((date) => ({
			date,
			outdoorOk: null,
			summary: "Weather did not answer."
		}));
		if (!weatherGate.allow()) return missed;
		try {
			const url = new URL("https://api.met.no/weatherapi/locationforecast/2.0/complete");
			url.searchParams.set("lat", origin.lat.toFixed(4));
			url.searchParams.set("lon", origin.lng.toFixed(4));
			noteCall("weather", "met-no");
			const res = await fetch(url, {
				headers: {
					Accept: "application/json",
					"User-Agent": UA
				},
				signal: AbortSignal.timeout(8e3)
			});
			if (res.status === 429 || !res.ok) {
				noteFailure("weather", "met-no", `HTTP ${res.status}`);
				return missed;
			}
			const body = await res.json();
			const wanted = new Set(dates);
			const grouped = /* @__PURE__ */ new Map();
			for (const entry of body.properties?.timeseries ?? []) {
				const local = forecastLocal(entry.time, origin.lng);
				if (!wanted.has(local.date)) continue;
				const slot = entry.data?.next_1_hours ?? entry.data?.next_6_hours;
				const symbol = slot?.summary?.symbol_code ?? "";
				const given = slot?.details?.probability_of_precipitation;
				const hours = grouped.get(local.date) ?? [];
				hours.push({
					hour: local.hour,
					temp: entry.data?.instant?.details?.air_temperature ?? 0,
					rain: typeof given === "number" ? given : symbol.includes("rain") || symbol.includes("thunder") ? 70 : 15,
					code: symbol.includes("thunder") ? 95 : symbol.includes("rain") ? 63 : 1,
					wind: (entry.data?.instant?.details?.wind_speed ?? 0) * 3.6,
					uv: entry.data?.instant?.details?.ultraviolet_index_clear_sky ?? 0
				});
				grouped.set(local.date, hours);
			}
			const skies = dates.map((date) => {
				const hours = grouped.get(date) ?? [];
				if (!hours.length) return {
					date,
					outdoorOk: null,
					summary: "No forecast for this day yet."
				};
				const day = readWeather(date, hours);
				return {
					date,
					outdoorOk: day.outdoorOk,
					summary: day.summary
				};
			});
			weatherCache.set(cacheKey, skies);
			return skies;
		} catch {
			return missed;
		}
	});
}
/**
* Structural route knowledge only. Facts are short signals from open guides.
* No tour-operator prose is stored.
*/
var WHEN = "2026-10-04";
function node(id, name, kind, latitude, longitude, countryCode, experienceGroups, hints, radiusKm) {
	return {
		id,
		name,
		kind,
		latitude,
		longitude,
		countryCode,
		experienceGroups,
		hints,
		radiusKm
	};
}
function day(nodeId, stay, role, title, groups, optional = false) {
	return {
		node: nodeId,
		stay,
		role,
		title,
		groups,
		optional
	};
}
function source(id, sourceName, sourceType, sourceUrl, scope, nights, routeNodes, experienceGroups, extractedFacts) {
	return {
		id,
		sourceName,
		sourceType,
		sourceUrl,
		destinationScope: scope,
		title: "Structural route signals",
		nights,
		routeNodes,
		experienceGroups,
		extractedFacts,
		retrievedAt: WHEN
	};
}
var japanNodes = [
	node("tokyo", "Tokyo", "city", 35.6812, 139.7671, "JP", [
		"landmark",
		"city",
		"neighbourhood"
	], [
		"Senso-ji",
		"Meiji",
		"Shibuya",
		"teamLab",
		"Tokyo National"
	]),
	node("fuji", "Fuji area", "nature", 35.498, 138.768, "JP", ["nature"], [
		"Fuji",
		"Kawaguchiko",
		"Chureito",
		"Hakone"
	], 28),
	node("hakone", "Hakone", "region", 35.232, 139.107, "JP", ["nature"], [
		"Hakone",
		"Lake Ashi",
		"Owakudani"
	], 16),
	node("kyoto", "Kyoto", "city", 35.0116, 135.7681, "JP", ["heritage"], [
		"Fushimi",
		"Kiyomizu",
		"Arashiyama",
		"Gion",
		"Kinkaku"
	]),
	node("nara", "Nara", "city", 34.6851, 135.8048, "JP", ["heritage"], [
		"Todai-ji",
		"Nara Park",
		"Kasuga"
	], 12),
	node("osaka", "Osaka", "city", 34.6937, 135.5023, "JP", ["food", "city"], [
		"Osaka Castle",
		"Dotonbori",
		"Kuromon"
	], 12),
	node("hiroshima", "Hiroshima", "city", 34.3853, 132.4553, "JP", ["heritage"], [
		"Peace Memorial",
		"Miyajima",
		"Itsukushima"
	], 18),
	node("kamakura", "Kamakura", "town", 35.3192, 139.5467, "JP", ["heritage"], [
		"Kotoku-in",
		"Hachimangu",
		"Daibutsu",
		"Great Buddha"
	], 10),
	node("tokyo-family", "Tokyo with children", "city", 35.716, 139.774, "JP", ["family"], [
		"Ueno Zoo",
		"teamLab",
		"Sunshine Aquarium",
		"Disney"
	])
];
var japanRefs = [
	source("wv-japan", "Wikivoyage Japan", "wikivoyage", "https://en.wikivoyage.org/wiki/Japan", "Japan", 7, [
		{
			destinationName: "Tokyo",
			destinationType: "city",
			visitMode: "STAY",
			nights: 3
		},
		{
			destinationName: "Mount Fuji",
			destinationType: "nature",
			visitMode: "EXCURSION"
		},
		{
			destinationName: "Hakone",
			destinationType: "region",
			visitMode: "DAY_TRIP"
		},
		{
			destinationName: "Kyoto",
			destinationType: "city",
			visitMode: "STAY",
			nights: 2
		},
		{
			destinationName: "Nara",
			destinationType: "city",
			visitMode: "DAY_TRIP"
		},
		{
			destinationName: "Osaka",
			destinationType: "city",
			visitMode: "STAY",
			nights: 2
		}
	], [
		"landmark",
		"heritage",
		"nature"
	], [
		"Listed cities include Tokyo, Kyoto, Osaka, and Nara",
		"Mount Fuji is an other destination, not a city stop",
		"Hakone is named as a day trip from Tokyo",
		"Nara is named as a day trip from Kyoto",
		"A golden route names Tokyo, Mount Fuji, Kyoto, and Osaka"
	]),
	source("wv-tokyo", "Wikivoyage Tokyo", "wikivoyage", "https://en.wikivoyage.org/wiki/Tokyo", "Tokyo", 3, [
		{
			destinationName: "Tokyo",
			destinationType: "city",
			visitMode: "STAY"
		},
		{
			destinationName: "Kamakura",
			destinationType: "town",
			visitMode: "DAY_TRIP"
		},
		{
			destinationName: "Hakone",
			destinationType: "region",
			visitMode: "EXCURSION"
		},
		{
			destinationName: "Nikko",
			destinationType: "town",
			visitMode: "DAY_TRIP"
		}
	], ["heritage", "nature"], [
		"Kamakura is a day trip from Tokyo",
		"Hakone is a nearby excursion from Tokyo",
		"Nikko is a day trip from Tokyo"
	]),
	source("wp-japan", "Wikipedia Tourism in Japan", "wikipedia", "https://en.wikipedia.org/wiki/Tourism_in_Japan", "Japan", 7, [
		{
			destinationName: "Hakone",
			destinationType: "region",
			visitMode: "DAY_TRIP"
		},
		{
			destinationName: "Nara",
			destinationType: "city",
			visitMode: "DAY_TRIP"
		},
		{
			destinationName: "Hiroshima",
			destinationType: "city",
			visitMode: "EXCURSION"
		}
	], ["heritage"], [
		"Hakone is treated as a Kanto add-on",
		"Nara is treated as a Kansai add-on",
		"Hiroshima is treated as a further add-on, not the first-week core"
	])
];
var japanEdges = [
	{
		from: "tokyo",
		to: "fuji",
		relation: "excursion",
		signal: "common"
	},
	{
		from: "tokyo",
		to: "kamakura",
		relation: "day-trip",
		signal: "common"
	},
	{
		from: "tokyo",
		to: "kyoto",
		relation: "follows",
		signal: "common"
	},
	{
		from: "kyoto",
		to: "nara",
		relation: "day-trip",
		signal: "common"
	},
	{
		from: "kyoto",
		to: "osaka",
		relation: "follows",
		signal: "common"
	},
	{
		from: "kyoto",
		to: "hiroshima",
		relation: "excursion",
		signal: "optional"
	}
];
var japanTaste = {
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
		day("kyoto", "kyoto", "neighbourhood", "More of Kyoto", ["heritage", "neighbourhood"], true)
	]
};
var japanClassic = {
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
		day("osaka", "osaka", "departure", "Last day in Osaka", ["neighbourhood"], true)
	],
	later: ["Hiroshima"]
};
var japanDeeper = {
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
		day("hiroshima", "hiroshima", "nature", "Miyajima", ["nature", "heritage"], true)
	],
	later: ["A slower Kansai day"]
};
var japanLong = {
	id: "long",
	label: "Deeper Japan",
	minNights: 13,
	maxNights: 18,
	firstVisit: true,
	days: japanDeeper.days,
	later: ["Hiroshima is already in the first week"]
};
var icelandNodes = [
	node("reykjavik", "Reykjavík", "city", 64.1466, -21.9426, "IS", ["city", "landmark"], [
		"Hallgrimskirkja",
		"Harpa",
		"Old Harbour"
	]),
	node("golden", "Golden Circle", "region", 64.3271, -20.1199, "IS", ["nature"], [
		"Gullfoss",
		"Geysir",
		"Thingvellir",
		"Þingvellir"
	], 30),
	node("south", "South Coast", "corridor", 63.532, -19.511, "IS", ["nature"], [
		"Skogafoss",
		"Seljalandsfoss",
		"Reynisfjara",
		"Vik"
	], 32),
	node("lagoon", "Glacier Lagoon", "nature", 64.0784, -16.2306, "IS", ["nature"], [
		"Jokulsarlon",
		"Diamond Beach",
		"Skaftafell"
	], 24),
	node("akureyri", "North Iceland", "region", 65.6885, -18.1262, "IS", ["nature"], [
		"Akureyri",
		"Godafoss",
		"Myvatn"
	], 28)
];
var icelandRefs = [source("wv-iceland", "Wikivoyage Iceland", "wikivoyage", "https://en.wikivoyage.org/wiki/Iceland", "Iceland", 7, [
	{
		destinationName: "Reykjavík",
		destinationType: "city",
		visitMode: "STAY",
		nights: 2
	},
	{
		destinationName: "Golden Circle",
		destinationType: "region",
		visitMode: "EXCURSION"
	},
	{
		destinationName: "South Coast",
		destinationType: "corridor",
		visitMode: "STAY",
		nights: 3
	},
	{
		destinationName: "Jökulsárlón",
		destinationType: "nature",
		visitMode: "EXCURSION"
	}
], ["nature", "road"], [
	"Regions are the planning unit, not a list of cities",
	"Route 1 is the Ring Road",
	"Golden Circle is the usual excursion from Reykjavík",
	"The south coast is a driving stretch, not a city"
]), source("wp-iceland", "Wikipedia Tourism in Iceland", "wikipedia", "https://en.wikipedia.org/wiki/Tourism_in_Iceland", "Iceland", 7, [
	{
		destinationName: "Reykjavík",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Golden Circle",
		destinationType: "region",
		visitMode: "EXCURSION"
	},
	{
		destinationName: "South Coast",
		destinationType: "corridor",
		visitMode: "STAY"
	},
	{
		destinationName: "Ring Road",
		destinationType: "corridor",
		visitMode: "STAY"
	}
], ["nature", "road"], ["Ring Road, Golden Circle, South Coast, and Reykjavík are the main visitor patterns"])];
var parisNodes = [
	node("paris", "Paris", "city", 48.8566, 2.3522, "FR", [
		"landmark",
		"heritage",
		"food"
	], [
		"Notre-Dame",
		"Marais",
		"Sacré",
		"Eiffel",
		"Louvre",
		"Orsay",
		"Seine"
	]),
	node("eiffel", "Eiffel and the Seine", "city", 48.8584, 2.2945, "FR", ["landmark"], [
		"Eiffel",
		"Trocadéro",
		"Champ de Mars",
		"Seine"
	]),
	node("louvre", "Louvre and the Tuileries", "city", 48.8606, 2.3376, "FR", ["heritage"], [
		"Louvre",
		"Tuileries",
		"Orsay",
		"Palais Royal"
	]),
	node("marais", "The Marais", "city", 48.859, 2.362, "FR", ["food", "neighbourhood"], [
		"Marais",
		"Place des Vosges",
		"Latin Quarter"
	]),
	node("versailles", "Versailles", "town", 48.8049, 2.1204, "FR", ["heritage"], ["Versailles", "Palace of Versailles"], 8),
	node("disney", "Disneyland Paris", "excursion", 48.867, 2.783, "FR", ["family"], ["Disneyland"], 8)
];
var parisRefs = [source("wv-paris", "Wikivoyage Paris", "wikivoyage", "https://en.wikivoyage.org/wiki/Paris", "Paris", 5, [
	{
		destinationName: "Paris",
		destinationType: "city",
		visitMode: "STAY",
		nights: 4
	},
	{
		destinationName: "Eiffel Tower",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Louvre",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Notre-Dame",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Sacré-Cœur",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Versailles",
		destinationType: "town",
		visitMode: "DAY_TRIP"
	}
], [
	"landmark",
	"heritage",
	"food"
], [
	"First-visit sights named include the Eiffel Tower, Louvre, Notre-Dame, Arc de Triomphe, and Sacré-Cœur",
	"Versailles is a day trip by train, not a stop inside central Paris",
	"Other day trips exist, including Fontainebleau and Giverny"
])];
var singaporeNodes = [
	node("marina", "Marina Bay", "city", 1.283, 103.851, "SG", ["landmark"], [
		"Merlion",
		"Marina Bay",
		"ArtScience"
	]),
	node("gardens", "Gardens by the Bay", "city", 1.2816, 103.8636, "SG", ["nature", "landmark"], ["Gardens by the Bay", "Cloud Forest"]),
	node("quarters", "Historic quarters", "city", 1.283, 103.844, "SG", ["heritage"], [
		"Chinatown",
		"Little India",
		"Kampong Glam",
		"Sultan Mosque"
	]),
	node("sentosa", "Sentosa", "island", 1.2494, 103.8303, "SG", ["family", "nature"], [
		"Sentosa",
		"Palawan",
		"Siloso"
	], 8),
	node("food", "Hawker streets", "city", 1.2806, 103.844, "SG", ["food"], [
		"Maxwell",
		"Lau Pa Sat",
		"Chinatown Complex"
	])
];
var singaporeRefs = [source("wv-singapore", "Wikivoyage Singapore", "wikivoyage", "https://en.wikivoyage.org/wiki/Singapore", "Singapore", 5, [
	{
		destinationName: "Marina Bay",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Chinatown",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Little India",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Kampong Glam",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Sentosa",
		destinationType: "island",
		visitMode: "DAY_TRIP"
	}
], [
	"landmark",
	"heritage",
	"food"
], ["Districts include Marina Bay, Chinatown, Little India, Kampong Glam, and the civic centre", "Sentosa is the usual island day, not another city"])];
var chengduNodes = [
	node("chengdu", "Chengdu", "city", 30.6598, 104.0657, "CN", ["heritage", "food"], [
		"Kuanzhai",
		"Jinli",
		"Wuhou",
		"People's Park",
		"Chunxi"
	]),
	node("panda", "Panda base", "nature", 30.733, 104.146, "CN", ["wildlife"], ["Panda", "Giant Panda"], 8),
	node("dujiangyan", "Dujiangyan", "region", 30.998, 103.613, "CN", ["nature", "heritage"], ["Dujiangyan", "Qingcheng"], 16),
	node("leshan", "Leshan", "town", 29.5446, 103.769, "CN", ["heritage"], ["Leshan", "Giant Buddha"], 10)
];
var chengduRefs = [source("wv-chengdu", "Wikivoyage Chengdu", "wikivoyage", "https://en.wikivoyage.org/wiki/Chengdu", "Chengdu", 5, [
	{
		destinationName: "Chengdu",
		destinationType: "city",
		visitMode: "STAY",
		nights: 3
	},
	{
		destinationName: "Panda base",
		destinationType: "nature",
		visitMode: "EXCURSION"
	},
	{
		destinationName: "Dujiangyan",
		destinationType: "region",
		visitMode: "DAY_TRIP"
	},
	{
		destinationName: "Qingcheng Mountain",
		destinationType: "nature",
		visitMode: "DAY_TRIP"
	},
	{
		destinationName: "Leshan",
		destinationType: "town",
		visitMode: "DAY_TRIP"
	}
], [
	"heritage",
	"wildlife",
	"nature",
	"food"
], [
	"City structure includes Jinli, Kuanzhai, Wuhou, and People's Park",
	"The panda base is a defining Chengdu experience",
	"Dujiangyan and Qingcheng are day trips, not city-centre stops",
	"Leshan is a longer day trip"
])];
var nagoyaNodes = [
	node("nagoya", "Nagoya", "city", 35.1815, 136.9066, "JP", ["heritage", "city"], [
		"Nagoya Castle",
		"Atsuta",
		"Osu",
		"Sakae"
	]),
	node("tokugawa", "Tokugawa", "city", 35.183, 136.93, "JP", ["heritage"], [
		"Tokugawa",
		"Tokugawa Art",
		"Tokugawa Garden"
	]),
	node("inuyama", "Inuyama", "town", 35.3885, 136.9394, "JP", ["heritage"], ["Inuyama Castle", "Inuyama"], 12),
	node("ghibli", "Ghibli Park", "excursion", 35.171, 137.089, "JP", ["family"], ["Ghibli"], 8)
];
var nagoyaRefs = [source("wv-nagoya", "Wikivoyage Nagoya", "wikivoyage", "https://en.wikivoyage.org/wiki/Nagoya", "Nagoya", 5, [
	{
		destinationName: "Nagoya",
		destinationType: "city",
		visitMode: "STAY",
		nights: 4
	},
	{
		destinationName: "Inuyama",
		destinationType: "town",
		visitMode: "DAY_TRIP"
	},
	{
		destinationName: "Gifu",
		destinationType: "city",
		visitMode: "DAY_TRIP"
	},
	{
		destinationName: "Ghibli Park",
		destinationType: "excursion",
		visitMode: "DAY_TRIP"
	}
], ["heritage", "food"], ["Inuyama, Gifu, Ise, and Takayama are named as trips beyond the city", "Ghibli Park is in Nagakute, not a castle stop"])];
var swissNodes = [node("lucerne", "Lucerne", "city", 47.0502, 8.3093, "CH", ["landmark", "nature"], [
	"Chapel Bridge",
	"Lake Lucerne",
	"Mount Pilatus"
]), node("interlaken", "Interlaken", "region", 46.6863, 7.8632, "CH", ["nature"], [
	"Interlaken",
	"Jungfrau",
	"Lauterbrunnen"
], 16)];
var swissRefs = [source("wv-swiss", "Wikivoyage Switzerland", "wikivoyage", "https://en.wikivoyage.org/wiki/Switzerland", "Switzerland", 4, [
	{
		destinationName: "Lucerne",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Interlaken",
		destinationType: "region",
		visitMode: "EXCURSION"
	},
	{
		destinationName: "Bernese Highlands",
		destinationType: "region",
		visitMode: "EXCURSION"
	}
], ["nature", "landmark"], ["Lucerne and Interlaken are repeated bases", "Lakes and the Alps are the point of the visit, not a city checklist"])];
var italyNodes = [node("florence", "Florence", "city", 43.7696, 11.2558, "IT", ["heritage", "landmark"], [
	"Duomo",
	"Uffizi",
	"Ponte Vecchio",
	"Accademia"
])];
var italyRefs = [source("wv-florence", "Wikivoyage Florence", "wikivoyage", "https://en.wikivoyage.org/wiki/Florence", "Florence", 3, [
	{
		destinationName: "Florence",
		destinationType: "city",
		visitMode: "STAY",
		nights: 3
	},
	{
		destinationName: "Duomo",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Uffizi",
		destinationType: "city",
		visitMode: "STAY"
	}
], ["heritage"], ["Florence is a stay, not a pass-through", "The Duomo, Uffizi, and Ponte Vecchio define a first visit"])];
var franceRefs = [...parisRefs, source("wv-france", "Wikivoyage France", "wikivoyage", "https://en.wikivoyage.org/wiki/France", "France", 12, [
	{
		destinationName: "Paris",
		destinationType: "city",
		visitMode: "STAY"
	},
	{
		destinationName: "Switzerland",
		destinationType: "country",
		visitMode: "PASS_THROUGH"
	},
	{
		destinationName: "Italy",
		destinationType: "country",
		visitMode: "PASS_THROUGH"
	}
], ["heritage"], ["Eastern France names Switzerland as onward travel", "Southern France names Italy as onward travel"])];
function book(partial) {
	return partial;
}
var PLAYBOOKS = [
	book({
		id: "japan",
		destinationName: "Japan",
		aliases: ["japan"],
		scope: "country",
		longitude: 138,
		nodes: japanNodes,
		edges: japanEdges,
		bands: [
			japanTaste,
			japanClassic,
			japanDeeper,
			japanLong
		],
		references: japanRefs,
		confidence: "medium",
		lastUpdated: WHEN,
		cultureNode: "nara",
		natureNode: "fuji",
		cityNode: "kamakura",
		familyNode: "tokyo-family",
		foodNode: "osaka"
	}),
	book({
		id: "iceland",
		destinationName: "Iceland",
		aliases: ["iceland"],
		scope: "road",
		longitude: -19,
		nodes: icelandNodes,
		edges: [
			{
				from: "reykjavik",
				to: "golden",
				relation: "excursion",
				signal: "core"
			},
			{
				from: "reykjavik",
				to: "south",
				relation: "follows",
				signal: "core"
			},
			{
				from: "south",
				to: "lagoon",
				relation: "excursion",
				signal: "common"
			},
			{
				from: "south",
				to: "akureyri",
				relation: "follows",
				signal: "optional"
			}
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
					day("reykjavik", "reykjavik", "departure", "Last day in Reykjavík", ["city"], true)
				]
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
					day("reykjavik", "reykjavik", "departure", "Return to Reykjavík", ["city"], true)
				]
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
					day("akureyri", "akureyri", "regional", "Toward the north", ["nature"])
				],
				later: ["The rest of the Ring Road"]
			}
		],
		references: icelandRefs,
		confidence: "high",
		lastUpdated: WHEN,
		natureNode: "south",
		cityNode: "reykjavik",
		familyNode: "reykjavik"
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
			{
				from: "paris",
				to: "versailles",
				relation: "day-trip",
				signal: "common"
			},
			{
				from: "paris",
				to: "eiffel",
				relation: "follows",
				signal: "common"
			},
			{
				from: "paris",
				to: "louvre",
				relation: "follows",
				signal: "common"
			}
		],
		bands: [{
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
				day("marais", "paris", "neighbourhood", "A Paris neighbourhood", ["neighbourhood"], true)
			]
		}, {
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
				day("paris", "paris", "departure", "Last morning in Paris", ["neighbourhood"], true)
			]
		}],
		references: parisRefs,
		confidence: "medium",
		lastUpdated: WHEN,
		cultureNode: "versailles",
		natureNode: "versailles",
		foodNode: "marais",
		familyNode: "disney"
	}),
	book({
		id: "france",
		destinationName: "France",
		aliases: ["france"],
		scope: "country",
		longitude: 2.3,
		nodes: parisNodes,
		edges: [{
			from: "paris",
			to: "versailles",
			relation: "day-trip",
			signal: "common"
		}],
		bands: [{
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
				day("paris", "paris", "departure", "Last day in Paris", ["neighbourhood"], true)
			]
		}],
		references: franceRefs,
		confidence: "medium",
		lastUpdated: WHEN,
		cultureNode: "versailles",
		foodNode: "marais",
		familyNode: "disney"
	}),
	book({
		id: "switzerland",
		destinationName: "Switzerland",
		aliases: ["switzerland", "swiss"],
		scope: "country",
		longitude: 8.2,
		nodes: swissNodes,
		edges: [{
			from: "lucerne",
			to: "interlaken",
			relation: "excursion",
			signal: "common"
		}],
		bands: [{
			id: "lakes",
			label: "Lakes and an alpine day",
			minNights: 2,
			maxNights: 8,
			firstVisit: true,
			days: [
				day("lucerne", "lucerne", "icons", "Lucerne and the lake", ["landmark", "nature"]),
				day("interlaken", "lucerne", "nature", "An alpine day", ["nature"]),
				day("lucerne", "lucerne", "neighbourhood", "Another lake day", ["nature"], true)
			]
		}],
		references: swissRefs,
		confidence: "medium",
		lastUpdated: WHEN,
		natureNode: "interlaken"
	}),
	book({
		id: "italy",
		destinationName: "Italy",
		aliases: ["italy"],
		scope: "country",
		longitude: 12.5,
		nodes: italyNodes,
		edges: [],
		bands: [{
			id: "florence",
			label: "Florence first",
			minNights: 2,
			maxNights: 8,
			firstVisit: true,
			days: [
				day("florence", "florence", "icons", "Florence icons", ["heritage", "landmark"]),
				day("florence", "florence", "neighbourhood", "Florence on foot", ["heritage", "neighbourhood"]),
				day("florence", "florence", "heritage", "More of Florence", ["heritage"], true)
			]
		}],
		references: italyRefs,
		confidence: "medium",
		lastUpdated: WHEN,
		foodNode: "florence"
	}),
	book({
		id: "singapore",
		destinationName: "Singapore",
		aliases: ["singapore"],
		scope: "city",
		longitude: 103.85,
		nodes: singaporeNodes,
		edges: [{
			from: "marina",
			to: "sentosa",
			relation: "day-trip",
			signal: "common"
		}],
		bands: [{
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
				day("food", "marina", "food", "Hawker streets", ["food"], true)
			]
		}],
		references: singaporeRefs,
		confidence: "medium",
		lastUpdated: WHEN,
		foodNode: "food",
		familyNode: "sentosa",
		natureNode: "gardens"
	}),
	book({
		id: "chengdu",
		destinationName: "Chengdu",
		aliases: ["chengdu"],
		scope: "city",
		longitude: 104.06,
		nodes: chengduNodes,
		edges: [
			{
				from: "chengdu",
				to: "panda",
				relation: "excursion",
				signal: "common"
			},
			{
				from: "chengdu",
				to: "dujiangyan",
				relation: "day-trip",
				signal: "common"
			},
			{
				from: "chengdu",
				to: "leshan",
				relation: "day-trip",
				signal: "optional"
			}
		],
		bands: [{
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
				day("chengdu", "chengdu", "food", "Sichuan food in the city", ["food"], true)
			]
		}],
		references: chengduRefs,
		confidence: "medium",
		lastUpdated: WHEN,
		cultureNode: "chengdu",
		natureNode: "dujiangyan",
		foodNode: "chengdu",
		cityNode: "chengdu"
	}),
	book({
		id: "nagoya",
		destinationName: "Nagoya",
		aliases: ["nagoya", "central japan"],
		scope: "city",
		parentCountry: "japan",
		longitude: 136.9,
		nodes: nagoyaNodes,
		edges: [{
			from: "nagoya",
			to: "inuyama",
			relation: "day-trip",
			signal: "common"
		}, {
			from: "nagoya",
			to: "ghibli",
			relation: "day-trip",
			signal: "optional"
		}],
		bands: [{
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
				day("nagoya", "nagoya", "food", "Food in Nagoya", ["food"], true)
			]
		}],
		references: nagoyaRefs,
		confidence: "medium",
		lastUpdated: WHEN,
		cultureNode: "inuyama",
		familyNode: "ghibli",
		foodNode: "nagoya"
	})
];
var PLANNED_CAP = 7;
function consensusFrom(refs) {
	const total = Math.max(1, refs.length);
	const nodes = /* @__PURE__ */ new Map();
	const edges = /* @__PURE__ */ new Map();
	const groups = /* @__PURE__ */ new Map();
	for (const ref of refs) {
		const seen = /* @__PURE__ */ new Set();
		ref.routeNodes.forEach((stop, index) => {
			const name = stop.destinationName.trim();
			const key = name.toLowerCase();
			const row = nodes.get(key) ?? {
				types: /* @__PURE__ */ new Set(),
				sources: 0,
				modes: /* @__PURE__ */ new Set()
			};
			if (!seen.has(key)) {
				row.sources += 1;
				seen.add(key);
			}
			row.types.add(ref.sourceType);
			row.modes.add(stop.visitMode);
			nodes.set(key, row);
			const previous = ref.routeNodes[index - 1];
			if (!previous) return;
			const relation = stop.visitMode === "DAY_TRIP" ? "day-trip" : stop.visitMode === "EXCURSION" ? "excursion" : "follows";
			const edgeKey = `${previous.destinationName.toLowerCase()}|${key}|${relation}`;
			const edge = edges.get(edgeKey) ?? {
				from: previous.destinationName,
				to: name,
				relation,
				sources: 0
			};
			edge.sources += 1;
			edges.set(edgeKey, edge);
		});
		for (const group of ref.experienceGroups) {
			const row = groups.get(group) ?? {
				types: /* @__PURE__ */ new Set(),
				sources: 0
			};
			row.sources += 1;
			row.types.add(ref.sourceType);
			groups.set(group, row);
		}
	}
	const signal = (sources, types) => {
		if (sources >= 2 && types >= 2 && sources / total >= .6) return "core";
		if (sources >= 2 && types >= 2) return "common";
		if (sources >= 2 || sources === 1 && types === 1 && refs.length === 1) return "common";
		return sources === 1 ? "optional" : "niche";
	};
	return {
		nodes: [...nodes.entries()].map(([key, row]) => ({
			name: refs.flatMap((ref) => ref.routeNodes).find((stop) => stop.destinationName.toLowerCase() === key)?.destinationName ?? key,
			signal: signal(row.sources, row.types.size),
			sources: row.sources,
			sourceTypes: [...row.types]
		})),
		edges: [...edges.values()].map((edge) => ({
			...edge,
			signal: edge.sources >= 2 ? "common" : "optional"
		})),
		experienceGroups: [...groups.entries()].map(([name, row]) => ({
			name,
			signal: signal(row.sources, row.types.size)
		}))
	};
}
function selectBand(book, nights, firstVisit) {
	const preferred = book.bands.filter((band) => firstVisit ? band.firstVisit : true);
	const pool = preferred.length ? preferred : book.bands;
	const inside = pool.filter((band) => nights >= band.minNights && nights <= band.maxNights);
	if (inside.length) return [...inside].sort((a, b) => a.minNights - b.minNights)[0] ?? inside[0];
	return [...pool].sort((a, b) => distanceToBand(a, nights) - distanceToBand(b, nights) || a.minNights - b.minNights)[0] ?? book.bands[0];
}
function distanceToBand(band, nights) {
	if (nights < band.minNights) return band.minNights - nights;
	if (nights > band.maxNights) return nights - band.maxNights;
	return 0;
}
function mentions(text, alias) {
	const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i").test(text);
}
function matchPlaybooks(destination, books = PLAYBOOKS) {
	const text = destination.toLowerCase();
	const ranked = books.filter((book) => book.aliases.some((alias) => mentions(text, alias))).map((book) => ({
		book,
		length: Math.max(...book.aliases.filter((alias) => mentions(text, alias)).map((alias) => alias.length))
	}));
	const chosen = ranked.filter((row) => !ranked.some((other) => other.book !== row.book && other.length > row.length && other.book.aliases.some((alias) => mentions(text, alias) && alias.toLowerCase().includes(row.book.aliases.find((item) => mentions(text, item))?.toLowerCase() ?? "\n")))).map((row) => row.book);
	const focused = chosen.filter((book) => book.scope === "city" || book.scope === "region" || book.scope === "island" || book.scope === "nature" || book.scope === "excursion");
	if (focused.length === 1) {
		const city = focused[0];
		return chosen.filter((book) => book === city || book.scope !== "country" && book.scope !== "road" && book.scope !== "corridor" || book.id !== (city.parentId || city.parentCountry));
	}
	return chosen;
}
function adaptPlaybook(input, books = PLAYBOOKS) {
	const destination = englishAreaName(input.destination, input.destination);
	const hits = matchPlaybooks(destination === "this area" ? input.destination : destination, books);
	const countries = hits.filter((book) => book.scope === "country" || book.scope === "road");
	if (countries.length >= 2 && !hits.some((book) => book.scope === "city")) return stitch(countries, input);
	const book = hits.find((item) => item.scope === "city") ?? hits[0];
	if (!book) return null;
	return adaptOne(book, input);
}
function adaptOne(raw, input) {
	const book = attachExperience(raw);
	const nights = Math.max(1, input.nights);
	const count = Math.min(PLANNED_CAP, nights);
	const band = selectBand(book, nights, input.firstVisit);
	let days = fitDays(band.days, count);
	const changes = [];
	const maxChanges = book.scope === "road" || book.scope === "nature" || book.scope === "corridor" ? 2 : nights >= 9 ? 2 : input.oneBase ? 1 : 2;
	const collapsed = collapseStays(days, maxChanges);
	days = collapsed.days;
	if (collapsed.names.length) {
		const labels = collapsed.names.map((id) => book.nodes.find((node) => node.id === id)?.name ?? id);
		changes.push(`− Avoided an extra hotel change. ${labels.join(" and ")} ${labels.length === 1 ? "is a day trip" : "are day trips"}.`);
	}
	days = personalise(book, days, input, changes);
	if (input.pace === "relaxed" || (input.styles ?? []).includes("slow")) changes.push("+ Fewer stops each day");
	if (input.pace === "full") changes.push("+ Fuller days");
	if (band.later?.length && nights > band.maxNights) changes.push(`+ ${band.later.join(" and ")} can wait for a later night. Not squeezed into this week.`);
	if (!input.firstVisit) changes.push("+ Icons stepped back on a return visit");
	const intents = days.map((day, index) => toIntent(book, day, index));
	const view = viewFor(book, band, input, intents, changes);
	return {
		id: book.id,
		scope: book.scope,
		bandId: band.id,
		confidence: book.confidence,
		aliases: book.aliases,
		days: intents,
		view
	};
}
function stitch(books, input) {
	const ordered = [...books].sort((a, b) => a.longitude - b.longitude);
	const share = splitCount(Math.min(PLANNED_CAP, Math.max(1, input.nights)), ordered.map((_, index) => index === 0 ? 3 : 2));
	const days = [];
	ordered.forEach((book, index) => {
		const slice = fitDays(selectBand(book, Math.max(book.bands[0]?.minNights ?? 4, share[index] ?? 1), true).days, Math.max(1, share[index] ?? 1));
		for (const day of slice) days.push(toIntent(book, day, days.length));
	});
	const names = ordered.map((book) => book.destinationName);
	const changes = [`+ ${names.join(" → ")} runs as one route, not three separate city lists.`];
	if (explicitChildAges(input.childAges).length) changes.push("+ A day is aimed at the children on this trip");
	const view = {
		id: ordered.map((book) => book.id).join("+"),
		title: "Kairos Classic",
		visit: input.firstVisit ? "First visit" : "Return visit",
		line: `A practical way through ${names.join(", ")} for ${input.nights} nights, then adapted to you.`,
		version: versionLine(input),
		route: routeLine(days),
		changes: changes.slice(0, 5),
		confidence: "medium",
		hotelNote: hotelNote(days)
	};
	return {
		id: view.id,
		scope: "multi",
		bandId: "multi",
		confidence: "medium",
		aliases: [],
		days,
		view
	};
}
function splitCount(total, weights) {
	const sum = weights.reduce((totalWeight, weight) => totalWeight + weight, 0) || 1;
	const raw = weights.map((weight) => Math.max(1, Math.round(total * weight / sum)));
	while (raw.reduce((totalCount, value) => totalCount + value, 0) > total) {
		const index = raw.indexOf(Math.max(...raw));
		if ((raw[index] ?? 1) <= 1) break;
		raw[index] -= 1;
	}
	while (raw.reduce((totalCount, value) => totalCount + value, 0) < total) raw[raw.length - 1] += 1;
	return raw;
}
var EXTRA_THEMES = [
	"Historic streets",
	"Neighbourhoods",
	"Landmarks",
	"Markets and streets"
];
function bareTitle(title) {
	return cleanTheme(title, title);
}
function fitDays(pattern, count) {
	const next = pattern.map((day) => ({
		...day,
		groups: [...day.groups],
		title: bareTitle(day.title)
	}));
	while (next.length > count && next.length > 1) {
		let drop = -1;
		for (let index = next.length - 1; index >= 0; index -= 1) if (next[index]?.optional) {
			drop = index;
			break;
		}
		next.splice(drop >= 0 ? drop : next.length - 1, 1);
	}
	while (next.length < count) {
		const home = [...next].reverse().find((day) => day.node === day.stay) ?? next[next.length - 1];
		if (!home) break;
		const base = bareTitle((next.find((day) => day.node === home.node && day.role !== "neighbourhood") ?? home).title);
		const used = next.filter((day) => day.node === home.node && day.role === "neighbourhood").length;
		const angle = EXTRA_THEMES[used % EXTRA_THEMES.length] ?? "The city";
		let title = `${angle} · ${base}`;
		if (next.some((day) => day.title === title)) title = `${angle} ${used + 2} · ${base}`;
		next.push({
			...home,
			role: "neighbourhood",
			title,
			groups: [.../* @__PURE__ */ new Set([...home.groups, "neighbourhood"])],
			optional: true
		});
	}
	return next;
}
function collapseStays(days, maxChanges) {
	const next = days.map((day) => ({ ...day }));
	const names = [];
	const changes = () => next.reduce((count, day, index) => count + (index > 0 && day.stay !== next[index - 1]?.stay ? 1 : 0), 0);
	while (changes() > maxChanges) {
		const order = [];
		for (const day of next) if (!order.includes(day.stay)) order.push(day.stay);
		const drop = order[order.length - 1];
		const previous = order[order.length - 2];
		if (!drop || !previous) break;
		for (const day of next) {
			if (day.stay !== drop) continue;
			day.stay = previous;
			if (day.node === drop) day.role = day.role === "food" ? "food" : "day-trip";
		}
		names.push(drop);
	}
	return {
		days: next,
		names
	};
}
function personalise(book, days, input, changes) {
	const next = days.map((day) => ({
		...day,
		groups: [...day.groups]
	}));
	const children = explicitChildAges(input.childAges).length > 0;
	const culture = (input.styles ?? []).includes("culture");
	const food = input.interests.includes("food");
	const nature = input.balance === "nature" || input.interests.includes("nature");
	const city = input.balance === "city";
	if (culture && book.cultureNode && !next.some((day) => day.node === book.cultureNode)) {
		const slot = lastWhere(next, (day) => day.node !== book.cultureNode && day.role !== "icons" && day.role !== "heritage" && day.role !== "nature" && day.role !== "food" && day.role !== "family" && day.role !== "arrival");
		const node = book.nodes.find((item) => item.id === book.cultureNode);
		if (node && slot >= 0) {
			const stay = next[slot]?.stay ?? node.id;
			next[slot] = {
				node: node.id,
				stay,
				role: "day-trip",
				title: node.name,
				groups: ["heritage"],
				optional: false
			};
			changes.push(`+ Added ${node.name} for the culture focus`);
		}
	}
	if (nature && !city && book.natureNode) {
		const same = next.filter((day) => day.node === book.natureNode);
		const other = book.nodes.find((node) => node.id !== book.natureNode && node.experienceGroups.includes("nature") && !next.some((day) => day.node === node.id));
		if (!same.length) {
			const node = book.nodes.find((item) => item.id === book.natureNode);
			const slot = lastWhere(next, (day) => day.node !== book.natureNode && (day.role === "neighbourhood" || day.role === "food" || day.role === "departure" || day.role === "day-trip"));
			if (node && slot >= 0 && next[slot]) {
				const home = nearestStayId(book, next, node.id) ?? next[slot].stay;
				const entry = {
					node: node.id,
					stay: home,
					role: "nature",
					title: node.name,
					groups: ["nature"],
					optional: false
				};
				if (home !== next[slot].stay) {
					next.splice(slot, 1);
					const at = lastWhere(next, (day) => day.stay === home);
					next.splice(Math.max(0, at + 1), 0, entry);
				} else next[slot] = entry;
				changes.push(`+ ${node.name} for the outdoor time`);
				changes.push("− Less repetitive city time");
			}
		} else if (other) {
			const slot = lastWhere(next, (day) => day.node !== other.id && day.node !== book.natureNode && (day.role === "neighbourhood" || day.role === "food" || day.role === "departure" || day.role === "day-trip"));
			if (slot >= 0 && next[slot] && next[slot].role !== "day-trip") {
				const home = nearestStayId(book, next, other.id) ?? next[slot].stay;
				next[slot] = {
					node: other.id,
					stay: home,
					role: "nature",
					title: other.name,
					groups: ["nature"],
					optional: false
				};
				changes.push(`+ ${other.name} adds a different outdoor day`);
			} else {
				const city = next.find((day) => day.node !== book.natureNode && !day.groups.includes("nature"));
				if (city) {
					city.groups = [.../* @__PURE__ */ new Set([...city.groups, "nature"])];
					changes.push("+ Outdoor time inside another day, not a second copy of the same excursion");
				}
			}
		} else {
			const slot = next.find((day) => day.node !== book.natureNode && !day.groups.includes("nature") && (day.role === "neighbourhood" || day.role === "icons" || day.role === "heritage"));
			if (slot) {
				slot.groups = [.../* @__PURE__ */ new Set([...slot.groups, "nature"])];
				changes.push("+ Gardens and outdoor time inside the city days");
			}
		}
	}
	if (city && book.cityNode) {
		const slot = next.findIndex((day) => day.role === "nature");
		const node = book.nodes.find((item) => item.id === book.cityNode);
		if (node && slot >= 0) {
			next[slot] = {
				node: node.id,
				stay: next[slot]?.stay ?? node.id,
				role: "day-trip",
				title: node.name,
				groups: ["heritage"],
				optional: false
			};
			changes.push(`+ ${node.name} as a full day trip`);
			changes.push("− A far nature day is off this city-heavy trip");
		}
	}
	if (culture) {
		let stamped = false;
		for (const day of next) {
			if (day.role === "nature" || day.role === "food" || day.role === "family") continue;
			if (!day.groups.includes("heritage")) {
				day.groups = [...day.groups, "heritage"];
				stamped = true;
			}
		}
		if (stamped) changes.push("+ Historic places weigh more inside the same areas");
	}
	if (food) {
		const node = book.foodNode ? book.nodes.find((item) => item.id === book.foodNode) : void 0;
		const slot = node ? next.findIndex((day) => day.node === node.id) : lastWhere(next, (day) => day.role !== "nature" && day.role !== "family");
		if (slot >= 0 && next[slot] && next[slot].role !== "food") {
			const current = next[slot].title;
			const foodTitle = node && isGenericDayTheme(current, book.destinationName) && node.name.toLowerCase() !== book.destinationName.toLowerCase() ? `Food in ${node.name}` : current;
			next[slot] = {
				...next[slot],
				role: "food",
				groups: [.../* @__PURE__ */ new Set([...next[slot].groups, "food"])],
				title: foodTitle
			};
			changes.push("+ A market or food district stays inside the route");
		}
	}
	if (children) {
		const ages = explicitChildAges(input.childAges);
		const youngest = ages.length ? Math.min(...ages) : 12;
		let touched = 0;
		for (const day of next) {
			if (touched >= 2) break;
			if (day.role === "nature" || day.role === "departure") continue;
			if (day.role === "icons") continue;
			day.groups = [.../* @__PURE__ */ new Set([...day.groups, "family"])];
			touched += 1;
		}
		if (touched) {
			const how = youngest <= 5 ? "shorter walks and hands-on stops" : youngest <= 8 ? "interactive stops" : "age-suitable stops";
			changes.push(`+ Days stay on the route, with ${how} for the children on this trip`);
		}
	}
	if (!input.firstVisit) {
		const slot = next.findIndex((day) => day.role === "icons");
		if (slot >= 0 && next[slot]) next[slot] = {
			...next[slot],
			role: "neighbourhood",
			groups: ["neighbourhood"],
			title: `Local ${nodeName(book, next[slot].node)}`
		};
	}
	if (input.balance === "balanced" && culture && next.some((day) => day.role === "nature")) changes.push("+ A nature day stays in, because the trip is not city-only");
	return next;
}
function nearestStayId(book, days, nodeId) {
	const node = book.nodes.find((item) => item.id === nodeId);
	if (!node) return null;
	let best = null;
	let bestMeters = Number.POSITIVE_INFINITY;
	for (const day of days) {
		const stay = book.nodes.find((item) => item.id === day.stay);
		if (!stay) continue;
		const meters = distanceMeters(node.latitude, node.longitude, stay.latitude, stay.longitude);
		if (meters < bestMeters) {
			bestMeters = meters;
			best = stay.id;
		}
	}
	return best;
}
function lastWhere(days, test) {
	for (let index = days.length - 1; index >= 0; index -= 1) {
		const day = days[index];
		if (day && test(day)) return index;
	}
	return -1;
}
function nodeName(book, id) {
	return book.nodes.find((node) => node.id === id)?.name ?? id;
}
function toIntent(book, day, index) {
	const node = book.nodes.find((item) => item.id === day.node) ?? book.nodes[0];
	const stay = book.nodes.find((item) => item.id === day.stay) ?? node;
	if (!node || !stay) throw new Error(`Playbook ${book.id} is missing a node`);
	const away = distanceMeters(node.latitude, node.longitude, stay.latitude, stay.longitude) > 12e3;
	const visitMode = !away ? "STAY" : day.role === "nature" || day.role === "regional" ? "EXCURSION" : "DAY_TRIP";
	const patterns = (book.patterns ?? []).filter((item) => item.areaIds.includes(node.id));
	const pattern = patterns.find((item) => item.theme === day.title) ?? patterns.find((item) => item.requiredGroups.every((group) => day.groups.includes(group)) && day.groups.every((group) => item.requiredGroups.includes(group) || item.optionalGroups.includes(group))) ?? patterns[0];
	const anchorIds = pattern?.anchorIds ?? (book.anchors ?? []).filter((item) => item.areaId === node.id).map((item) => item.id);
	const anchorNames = (book.anchors ?? []).filter((item) => anchorIds.includes(item.id)).map((item) => item.name);
	const title = pattern && shouldUsePatternTheme(day.title, node.name, book.destinationName, pattern.theme) ? pattern.theme : day.title;
	return {
		index,
		nodeId: node.id,
		title,
		role: day.role,
		areaName: node.name,
		latitude: node.latitude,
		longitude: node.longitude,
		stayName: stay.name,
		stayLatitude: stay.latitude,
		stayLongitude: stay.longitude,
		countryCode: stay.countryCode || node.countryCode,
		visitMode,
		groups: [.../* @__PURE__ */ new Set([...day.groups, ...pattern?.requiredGroups ?? []])],
		hints: [.../* @__PURE__ */ new Set([...node.hints, ...anchorNames])],
		radiusKm: node.radiusKm ?? (away ? 18 : 14),
		requiredGroups: [.../* @__PURE__ */ new Set([...pattern?.requiredGroups ?? day.groups, ...day.groups])],
		anchorIds,
		patternId: pattern?.id
	};
}
function shouldUsePatternTheme(title, nodeName, destination, patternTheme) {
	if (!patternTheme || patternTheme === title) return false;
	if (isGenericDayTheme(title, destination)) return true;
	if (title === nodeName && nodeName.trim().toLowerCase() === destination.trim().toLowerCase()) return true;
	if (title === nodeName && patternTheme !== nodeName) return true;
	return false;
}
function routeLine(days) {
	const stays = [];
	const trips = [];
	for (const day of days) {
		if (!stays.includes(day.stayName)) stays.push(day.stayName);
		if (day.visitMode !== "STAY" && !trips.includes(day.areaName)) trips.push(day.areaName);
	}
	const spine = stays.join(" → ");
	return trips.length ? `${spine} · Day trips: ${trips.join(", ")}` : spine;
}
function hotelChanges(days) {
	return days.reduce((count, day, index) => count + (index > 0 && day.stayName !== days[index - 1]?.stayName ? 1 : 0), 0);
}
function hotelNote(days) {
	const stays = [];
	const trips = [];
	for (const day of days) {
		if (!stays.includes(day.stayName)) stays.push(day.stayName);
		if (day.visitMode !== "STAY" && !trips.includes(day.areaName)) trips.push(day.areaName);
	}
	const changes = hotelChanges(days);
	if (changes === 0) return `One base in ${stays[0] ?? "the city"}. Day trips come back to the same hotel.`;
	const tripNote = trips.length ? ` ${trips.join(", ")} ${trips.length === 1 ? "is a day trip" : "are day trips"}, so ${trips.length === 1 ? "it does" : "they do"} not add a hotel.` : "";
	return `${stays.join(" → ")}. ${changes} hotel change${changes === 1 ? "" : "s"}.${tripNote}`;
}
var STYLE_LABEL = {
	backpacking: "Backpacking",
	comfort: "Comfort",
	luxury: "Luxury",
	adventure: "Adventure",
	slow: "Slow travel",
	wellness: "Wellness",
	culture: "Culture"
};
function versionLine(input) {
	const styles = input.styles?.length ? input.styles : ["comfort"];
	const bits = [];
	const culture = styles.includes("culture");
	const food = input.interests.includes("food");
	if (culture && food) bits.push("Culture + Food");
	else if (culture) bits.push("Culture");
	else if (food) bits.push("Food");
	for (const style of styles) {
		if (style === "culture") continue;
		bits.push(STYLE_LABEL[style] ?? style);
	}
	if (!styles.some((style) => style !== "culture")) bits.push("Comfort");
	bits.push(input.pace === "full" ? "See more" : input.pace === "relaxed" ? "Relaxed pace" : "Balanced pace");
	bits.push(input.balance === "city" ? "City-heavy" : input.balance === "nature" ? "Nature-heavy" : "Balanced city/nature");
	return [...new Set(bits)].join(" · ");
}
function viewFor(book, band, input, days, changes) {
	const unique = [...new Set(changes)].slice(0, 5);
	const generated = book.origin === "generated";
	const strong = book.confidence === "high";
	const title = !input.firstVisit ? "Return route" : generated ? strong ? "Kairos Classic" : "Kairos Curated" : "Kairos Classic";
	const line = generated ? strong ? `A strong first-visit route for ${input.nights} nights in ${book.destinationName}, based on established travel patterns.` : `Built from the best destination information currently available for ${book.destinationName}.` : `A proven starting point for ${input.nights} nights in ${book.destinationName}, adapted to your preferences.`;
	return {
		id: book.id,
		title,
		visit: input.firstVisit ? "First visit" : "Return visit",
		line,
		version: versionLine(input),
		route: routeLine(days),
		changes: unique.length ? unique : ["+ Kept the classic shape"],
		confidence: book.confidence,
		hotelNote: hotelNote(days)
	};
}
var OPEN_GUIDE = [
	"wikivoyage",
	"wikipedia",
	"wikidata",
	"openstreetmap"
];
function inferSourceCoverage(refs) {
	if (!refs.length) return "GEOGRAPHY_ONLY";
	const types = new Set(refs.map((ref) => ref.sourceType));
	if (refs.filter((ref) => ref.sourceType === "operator").length >= 2) return "MULTI_OPERATOR_CONSENSUS";
	if ([...types].every((type) => OPEN_GUIDE.includes(type))) return "OPEN_GUIDE_ONLY";
	return "MULTI_SOURCE";
}
/** Drops a claimed operator consensus when no operator source is actually present. */
function guardSourceCoverage(refs, claimed) {
	const inferred = inferSourceCoverage(refs);
	if (claimed === "MULTI_OPERATOR_CONSENSUS" && inferred !== "MULTI_OPERATOR_CONSENSUS") return inferred;
	return claimed ?? inferred;
}
function boxOf(lat, lng, radiusKm) {
	const radius = Math.max(8, Math.min(40, radiusKm));
	const dLat = radius / 111.32;
	const dLng = radius / (111.32 * Math.max(.2, Math.cos(lat * Math.PI / 180)));
	return [
		lat - dLat,
		lng - dLng,
		lat + dLat,
		lng + dLng
	];
}
function searchAreasFor(user, plan) {
	if (!plan) return [...user].slice(0, 3);
	const clusters = [];
	const push = (area) => {
		if (clusters.some((item) => distanceMeters(item.latitude, item.longitude, area.latitude, area.longitude) < 12e3)) return;
		clusters.push(area);
	};
	const stays = plan.days.filter((day, index) => plan.days.findIndex((item) => item.stayName === day.stayName) === index);
	const trips = plan.days.filter((day) => day.visitMode !== "STAY");
	if (plan.scope === "city" && user[0] && Number.isFinite(user[0].latitude)) push({
		...user[0],
		bbox: user[0].bbox
	});
	for (const day of stays) push({
		name: day.stayName,
		latitude: day.stayLatitude,
		longitude: day.stayLongitude,
		countryCode: day.countryCode,
		bbox: boxOf(day.stayLatitude, day.stayLongitude, 14)
	});
	for (const day of trips) push({
		name: day.areaName,
		latitude: day.latitude,
		longitude: day.longitude,
		countryCode: day.countryCode,
		bbox: boxOf(day.latitude, day.longitude, day.radiusKm)
	});
	return clusters.slice(0, 4);
}
function baseAreasFor(user, plan) {
	if (!plan) return [...user].slice(0, 3);
	const bases = [];
	for (const day of plan.days) {
		if (bases.some((item) => item.name === day.stayName)) continue;
		const near = user.find((area) => distanceMeters(area.latitude, area.longitude, day.stayLatitude, day.stayLongitude) < 3e4 && !plan.aliases.some((alias) => area.name.toLowerCase() === alias.toLowerCase()));
		bases.push(near && plan.scope === "city" ? {
			name: day.stayName,
			latitude: near.latitude,
			longitude: near.longitude,
			countryCode: near.countryCode || day.countryCode,
			bbox: near.bbox
		} : {
			name: day.stayName,
			latitude: day.stayLatitude,
			longitude: day.stayLongitude,
			countryCode: day.countryCode
		});
	}
	return bases.slice(0, 3);
}
var require$1 = createRequire(import.meta.url);
var registry = /* @__PURE__ */ new Map();
var warmed = false;
var builds = 0;
var network = false;
var persistPath = "";
var readers = {};
function setPlaybookNetwork(enabled) {
	network = enabled;
}
function enablePlaybookPersistence(path = "data/playbooks/generated.json") {
	persistPath = path;
}
function stampCurated(book) {
	const verified = book.lastUpdated;
	return {
		...book,
		origin: "curated",
		status: "CURATED",
		sourceCoverage: guardSourceCoverage(book.references),
		playbookVersion: book.playbookVersion ?? 1,
		schemaVersion: 1,
		parentId: book.parentId || book.parentCountry,
		createdAt: verified,
		lastVerified: verified,
		nextReviewAt: addDays(verified, 180),
		warnings: book.warnings ?? [],
		sourceSnapshot: book.references.map((ref) => ({
			id: ref.id,
			name: ref.sourceName,
			sourceType: ref.sourceType,
			sourceUrl: ref.sourceUrl
		}))
	};
}
function addDays(iso, days) {
	const [year, month, day] = iso.split("-").map(Number);
	return new Date(Date.UTC(year || 2026, (month || 1) - 1, (day || 1) + days)).toISOString().slice(0, 10);
}
function today() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function playbookSlug(name) {
	return name.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function warm() {
	if (warmed) return;
	warmed = true;
	if (!registry.size) for (const book of PLAYBOOKS) registry.set(book.id, stampCurated(book));
	loadDisk();
}
function loadDisk() {
	if (!persistPath) return;
	try {
		const fs = require$1("node:fs");
		if (!fs.existsSync(persistPath)) return;
		const body = JSON.parse(fs.readFileSync(persistPath, "utf8"));
		if (body.schemaVersion !== 1 || !Array.isArray(body.books)) return;
		for (const book of body.books) {
			if (!book?.id || registry.has(book.id) && registry.get(book.id)?.origin === "curated") continue;
			registry.set(book.id, book);
		}
	} catch {}
}
function saveDisk() {
	if (!persistPath) return;
	try {
		const fs = require$1("node:fs");
		const path = require$1("node:path");
		fs.mkdirSync(path.dirname(persistPath), { recursive: true });
		const books = [...registry.values()].filter((book) => book.origin === "generated");
		fs.writeFileSync(persistPath, JSON.stringify({
			schemaVersion: 1,
			books
		}));
	} catch {}
}
function listPlaybooks() {
	warm();
	return [...registry.values()];
}
function findExact(name) {
	const text = name.trim().toLowerCase();
	const slug = playbookSlug(name);
	return [...registry.values()].find((book) => book.id === slug || book.destinationName.toLowerCase() === text || book.aliases.some((alias) => alias.toLowerCase() === text));
}
function validatePlaybook(book) {
	const warnings = [];
	if (!book.nodes.length || !book.bands.length) return {
		ok: false,
		warnings: ["Playbook has no route."]
	};
	const ids = new Set(book.nodes.map((node) => node.id));
	for (const band of book.bands) {
		if (!band.days.length) warnings.push(`${band.label} has no days.`);
		for (const day of band.days) if (!ids.has(day.node) || !ids.has(day.stay)) return {
			ok: false,
			warnings: [`${band.label} points at a missing place.`]
		};
	}
	for (const node of book.nodes) if (!Number.isFinite(node.latitude) || !Number.isFinite(node.longitude)) return {
		ok: false,
		warnings: [`${node.name} has no coordinates.`]
	};
	if (book.nodes.length === 1 && (book.scope === "country" || book.scope === "road" || book.scope === "region")) warnings.push("Only a single base was available, so this stays provisional.");
	if (!book.nodes.some((node) => node.experienceGroups.length)) warnings.push("No experience groups were found.");
	return {
		ok: true,
		warnings
	};
}
function confidenceFor(book, provisional) {
	const coverage = guardSourceCoverage(book.references, book.sourceCoverage);
	if (coverage === "GEOGRAPHY_ONLY") return "low";
	if (provisional && book.nodes.length < 3) return "low";
	if (!provisional && coverage === "MULTI_OPERATOR_CONSENSUS") return "high";
	const agreed = consensusFrom(book.references).nodes.filter((node) => node.sources >= 2 && node.sourceTypes.length >= 2);
	if (!provisional && coverage === "MULTI_SOURCE" && agreed.length >= 2 && book.nodes.length >= 3) return "high";
	if (book.nodes.length >= 3) return "medium";
	return "low";
}
function finish(book, status, warnings, previousVersion = 0) {
	const checked = validatePlaybook(book);
	if (!checked.ok) return null;
	const merged = [...warnings, ...checked.warnings];
	const provisional = status === "PROVISIONAL" || merged.some((warning) => /provisional/i.test(warning));
	const next = {
		...book,
		origin: "generated",
		status: provisional ? "PROVISIONAL" : status,
		sourceCoverage: guardSourceCoverage(book.references, book.sourceCoverage),
		confidence: confidenceFor({
			...book,
			sourceCoverage: guardSourceCoverage(book.references, book.sourceCoverage)
		}, provisional),
		playbookVersion: previousVersion + 1,
		schemaVersion: 1,
		warnings: merged,
		createdAt: registry.get(book.id)?.createdAt ?? today(),
		lastVerified: today(),
		nextReviewAt: addDays(today(), 180),
		lastUpdated: today(),
		sourceSnapshot: book.references.map((ref) => ({
			id: ref.id,
			name: ref.sourceName,
			sourceType: ref.sourceType,
			sourceUrl: ref.sourceUrl
		}))
	};
	if (next.sourceCoverage === "MULTI_OPERATOR_CONSENSUS" && !next.references.some((ref) => ref.sourceType === "operator")) {
		next.sourceCoverage = guardSourceCoverage(next.references);
		next.warnings = [...next.warnings ?? [], "Operator consensus was removed because no operator source was present."];
		next.confidence = confidenceFor(next, next.status === "PROVISIONAL");
	}
	registry.set(next.id, next);
	saveDisk();
	return next;
}
async function readSources(name) {
	const warnings = [];
	const pieces = [];
	const operator = readers.operators ?? (async () => null);
	const guides = readers.openGuides ?? (network ? fetchOpenGuides : async () => null);
	try {
		const got = await operator(name);
		if (got) pieces.push(got);
	} catch {
		warnings.push("An itinerary source was unavailable. Remaining sources were used.");
	}
	try {
		const got = await guides(name);
		if (got) pieces.push(got);
	} catch {
		warnings.push("An open-guide source was unavailable. Remaining sources were used.");
	}
	return {
		areas: pieces.flatMap((piece) => piece.areas),
		sources: pieces.flatMap((piece) => piece.sources),
		warnings
	};
}
async function ensureTravelPlaybook(destination, hint = {}) {
	warm();
	const asked = destination.trim();
	const named = englishAreaName(asked, asked);
	const name = named === "this area" ? asked : named;
	if (!name) return null;
	const existing = findExact(name);
	if (existing?.origin === "curated" && !findStarterFact(name)) return existing;
	if (existing && !hint.refresh) return existing;
	const previousVersion = existing?.playbookVersion ?? 0;
	if (existing && existing.origin !== "curated") registry.delete(existing.id);
	builds += 1;
	const fact = findStarterFact(name);
	if (fact) {
		const extra = await readSources(name);
		const book = playbookFromFact(fact, extra.warnings ?? []);
		if (extra.sources.length) {
			const seen = new Set(book.references.map((ref) => ref.sourceUrl));
			for (const source of extra.sources) {
				if (seen.has(source.sourceUrl)) continue;
				book.references.push(toReference(fact.id, book.references.length, source));
			}
		}
		book.sourceCoverage = guardSourceCoverage(book.references);
		const stored = finish(book, "GENERATED", extra.warnings ?? [], previousVersion);
		if (stored) return stored;
	}
	const derived = derive(name);
	if (derived) {
		const stored = finish(derived, "GENERATED", derived.warnings ?? [], previousVersion);
		if (stored) return stored;
	}
	const extracted = await readSources(name);
	if (extracted.areas.length || extracted.sources.length) {
		const book = await playbookFromExtract(name, extracted, hint);
		if (book) {
			const stored = finish(book, "PROVISIONAL", extracted.warnings ?? [], previousVersion);
			if (stored) return stored;
		}
	}
	if (Number.isFinite(hint.latitude) && Number.isFinite(hint.longitude)) {
		const stored = finish(geographyPlaybook(name, hint), "PROVISIONAL", ["No guide structure was available. The plan uses the resolved centre only."], previousVersion);
		if (stored) return stored;
	}
	builds -= 1;
	return null;
}
function bootstrapPopularPlaybooks(limit = 40) {
	warm();
	const built = [];
	const failed = [];
	for (const fact of STARTER_FACTS) {
		if (built.length >= limit) break;
		if (registry.has(fact.id)) continue;
		builds += 1;
		const book = playbookFromFact(fact);
		book.sourceCoverage = guardSourceCoverage(book.references);
		const stored = finish(book, "GENERATED", []);
		if (stored) built.push(stored.id);
		else failed.push(fact.id);
	}
	return {
		built,
		failed
	};
}
async function playbooksForPlanning(destination, hint = {}) {
	const parts = destination.split(/\s*(?:,|\+)\s*/).map((part) => part.trim()).filter(Boolean);
	const targets = parts.length > 1 ? parts : [destination];
	for (const target of targets) try {
		await ensureTravelPlaybook(target, hint);
		ensureDestinationKnowledge(target);
	} catch {}
	return listPlaybooks();
}
function derive(name) {
	const needle = name.trim().toLowerCase();
	const slug = playbookSlug(name);
	const parents = [...registry.values()].filter((book) => book.nodes.some((node) => node.name.toLowerCase() === needle || node.id === slug)).sort((a, b) => scopeRank(a.scope) - scopeRank(b.scope));
	for (const parent of parents) {
		if (parent.destinationName.toLowerCase() === needle || parent.aliases.some((alias) => alias.toLowerCase() === needle)) continue;
		const node = parent.nodes.find((item) => item.name.toLowerCase() === needle || item.id === slug);
		if (!node || node.kind === "country") continue;
		const keep = /* @__PURE__ */ new Set([node.id]);
		for (const edge of parent.edges) {
			if (edge.from !== node.id) continue;
			const other = parent.nodes.find((item) => item.id === edge.to);
			if (!other) continue;
			const km = distanceMeters(node.latitude, node.longitude, other.latitude, other.longitude) / 1e3;
			if (edge.relation === "day-trip" || edge.relation === "excursion" && km <= 180 || edge.relation === "follows" && km <= 90) keep.add(other.id);
		}
		const nodes = parent.nodes.filter((item) => keep.has(item.id));
		const days = [{
			node: node.id,
			stay: node.id,
			role: "arrival",
			title: node.name,
			groups: node.experienceGroups.length ? [...node.experienceGroups] : ["heritage"]
		}];
		for (const other of nodes) {
			if (other.id === node.id) continue;
			days.push({
				node: other.id,
				stay: node.id,
				role: "day-trip",
				title: other.name,
				groups: [...other.experienceGroups],
				optional: days.length > 3
			});
		}
		while (days.length < 3) days.push({
			node: node.id,
			stay: node.id,
			role: "neighbourhood",
			title: `Neighbourhoods · ${node.name}`,
			groups: ["neighbourhood"],
			optional: true
		});
		return {
			id: slug,
			destinationName: node.name,
			aliases: [needle, slug.replace(/-/g, " ")],
			scope: node.kind === "town" || node.kind === "city" ? "city" : node.kind === "island" ? "island" : node.kind === "nature" ? "nature" : "region",
			parentCountry: parent.id,
			parentId: parent.id,
			longitude: node.longitude,
			nodes,
			edges: parent.edges.filter((edge) => keep.has(edge.from) && keep.has(edge.to)),
			bands: [
				{
					id: "taste",
					label: "Short stay",
					minNights: 2,
					maxNights: 4,
					firstVisit: true,
					days: days.slice(0, 3)
				},
				{
					id: "classic",
					label: "Classic first visit",
					minNights: 5,
					maxNights: 8,
					firstVisit: true,
					days
				},
				{
					id: "longer",
					label: "Slower stay",
					minNights: 9,
					maxNights: 14,
					firstVisit: true,
					days
				}
			],
			references: parent.references,
			confidence: "medium",
			lastUpdated: today(),
			origin: "generated",
			sourceCoverage: guardSourceCoverage(parent.references),
			cultureNode: nodes.find((item) => item.experienceGroups.includes("heritage"))?.id,
			natureNode: nodes.find((item) => item.experienceGroups.includes("nature"))?.id,
			foodNode: nodes.find((item) => item.experienceGroups.includes("food"))?.id,
			warnings: [`${node.name} is taken from the ${parent.destinationName} playbook. It is not a separately researched country route.`]
		};
	}
	return null;
}
async function playbookFromExtract(name, extract, hint) {
	const located = [];
	for (const area of uniqueAreas(extract.areas).slice(0, 6)) {
		if (located.length >= 4) break;
		const point = await locateArea(area.name);
		if (!point) continue;
		located.push({
			...area,
			...point
		});
	}
	const centre = Number.isFinite(hint.latitude) && Number.isFinite(hint.longitude) ? {
		latitude: hint.latitude,
		longitude: hint.longitude
	} : located[0];
	if (!centre) return null;
	const id = playbookSlug(name);
	const country = (hint.countryCode || "").toUpperCase();
	const areas = located.length ? located : [{
		name,
		section: "city",
		latitude: centre.latitude,
		longitude: centre.longitude
	}];
	const book = playbookFromFact({
		id,
		name,
		aliases: [name.toLowerCase(), id.replace(/-/g, " ")],
		scope: hint.scope ?? (areas.length > 2 ? "region" : "city"),
		countryCode: country,
		areas: areas.map((area, index) => {
			const km = index === 0 ? 0 : distanceMeters(centre.latitude, centre.longitude, area.latitude, area.longitude) / 1e3;
			const role = index === 0 ? "base" : area.section === "day-trip" || km < 90 ? "day-trip" : km < 400 ? "transfer" : "excursion";
			return {
				id: playbookSlug(area.name) || `${id}-${index}`,
				name: area.name,
				kind: area.section === "region" ? "region" : area.section === "other" ? "nature" : "city",
				lat: area.latitude,
				lng: area.longitude,
				role,
				groups: area.section === "region" || area.section === "other" ? ["nature"] : ["heritage"],
				hints: [area.name],
				radiusKm: role === "base" ? 14 : 12
			};
		}),
		sources: extract.sources.length ? extract.sources : [{
			name: "Open guide",
			sourceType: "wikivoyage",
			sourceUrl: `https://en.wikivoyage.org/wiki/${encodeURIComponent(name.replace(/ /g, "_"))}`,
			stops: areas.map((area) => area.name),
			facts: ["Place names were taken from an open guide. Prose was not stored."]
		}]
	}, extract.warnings ?? []);
	book.id = id;
	book.destinationName = name;
	book.sourceCoverage = guardSourceCoverage(book.references);
	return book;
}
function geographyPlaybook(name, hint) {
	const id = playbookSlug(name);
	const book = playbookFromFact({
		id,
		name,
		aliases: [name.toLowerCase()],
		scope: hint.scope ?? "region",
		countryCode: (hint.countryCode || "").toUpperCase(),
		areas: [{
			id,
			name,
			kind: hint.scope === "city" ? "city" : "region",
			lat: hint.latitude,
			lng: hint.longitude,
			role: "base",
			groups: ["landmark"],
			hints: [name]
		}],
		sources: []
	}, ["No operator or open-guide route was available."]);
	book.sourceCoverage = "GEOGRAPHY_ONLY";
	book.references = [];
	return book;
}
function toReference(id, index, source) {
	return {
		id: `${id}-extra-${index}`,
		sourceName: source.name,
		sourceType: source.sourceType,
		sourceUrl: source.sourceUrl,
		destinationScope: id,
		title: "Structural route signals",
		nights: 5,
		routeNodes: source.stops.map((stop) => ({
			destinationName: stop,
			destinationType: "city",
			visitMode: "STAY"
		})),
		experienceGroups: ["heritage"],
		extractedFacts: source.facts,
		retrievedAt: today()
	};
}
function uniqueAreas(areas) {
	const seen = /* @__PURE__ */ new Set();
	const next = [];
	for (const area of areas) {
		const key = area.name.trim().toLowerCase();
		if (!key || seen.has(key) || key.length > 60) continue;
		seen.add(key);
		next.push({
			name: area.name.trim(),
			section: area.section
		});
	}
	return next;
}
async function locateArea(name) {
	if (readers.locate) return readers.locate(name);
	if (!network) return null;
	try {
		const url = new URL("https://photon.komoot.io/api/");
		url.searchParams.set("q", name);
		url.searchParams.set("limit", "1");
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"User-Agent": "KairosTravel/1.0"
			},
			signal: AbortSignal.timeout(2500)
		});
		if (!res.ok) return null;
		const [lng, lat] = (await res.json()).features?.[0]?.geometry?.coordinates ?? [];
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
		return {
			latitude: lat,
			longitude: lng
		};
	} catch {
		return null;
	}
}
function extractVoyageAreas(wikitext) {
	const parts = wikitext.split(/\n(?===+)/);
	const areas = [];
	for (const part of parts) {
		const title = part.match(/^==+\s*([^=]+?)\s*==+/)?.[1]?.trim() ?? "";
		if (!/regions|cities|other destinations|day trips|nearby/i.test(title)) continue;
		const section = /day trip/i.test(title) ? "day-trip" : /region/i.test(title) ? "region" : /cities|city/i.test(title) ? "city" : "other";
		for (const match of part.matchAll(/\[\[([^\]|#:]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g)) {
			const label = (match[2] || match[1] || "").replace(/_/g, " ").trim();
			if (!label || /wikivoyage|category|file|template/i.test(match[1] ?? "")) continue;
			areas.push({
				name: label,
				section
			});
		}
	}
	return uniqueAreas(areas);
}
async function fetchOpenGuides(name) {
	const url = new URL("https://en.wikivoyage.org/w/api.php");
	url.searchParams.set("action", "parse");
	url.searchParams.set("page", name);
	url.searchParams.set("prop", "wikitext");
	url.searchParams.set("format", "json");
	url.searchParams.set("redirects", "1");
	try {
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"User-Agent": "KairosTravel/1.0"
			},
			signal: AbortSignal.timeout(2500)
		});
		if (!res.ok) return null;
		const areas = extractVoyageAreas((await res.json()).parse?.wikitext?.["*"] ?? "");
		if (!areas.length) return null;
		return {
			areas,
			sources: [{
				name: `Wikivoyage ${name}`,
				sourceType: "wikivoyage",
				sourceUrl: `https://en.wikivoyage.org/wiki/${name.replace(/ /g, "_")}`,
				stops: areas.slice(0, 8).map((area) => area.name),
				facts: ["Section headings supplied place names only. Page prose was discarded."]
			}]
		};
	} catch {
		return null;
	}
}
function scopeRank(scope) {
	if (scope === "city" || scope === "excursion") return 0;
	if (scope === "region" || scope === "island" || scope === "nature") return 1;
	if (scope === "road") return 2;
	return 3;
}
var require = createRequire(import.meta.url);
var knowledgePath = "data/knowledge/packs.json";
try {
	const fs = require("node:fs");
	if (fs.existsSync(knowledgePath)) {
		const body = JSON.parse(fs.readFileSync(knowledgePath, "utf8"));
		if (Array.isArray(body.packs)) importKnowledgeSnapshot(body.packs);
	}
} catch {}
onKnowledgePersist((packs) => {
	try {
		const fs = require("node:fs");
		const path = require("node:path");
		fs.mkdirSync(path.dirname(knowledgePath), { recursive: true });
		fs.writeFileSync(knowledgePath, JSON.stringify({ packs }));
	} catch {}
});
setPlaybookNetwork(true);
enablePlaybookPersistence();
bootstrapPopularPlaybooks(80);
function areasOf(input) {
	const extra = (input.areas ?? []).filter((area) => area.name && Number.isFinite(area.latitude) && Number.isFinite(area.longitude));
	if (extra.length) return extra.slice(0, 3);
	return [{
		name: input.destination,
		latitude: input.latitude,
		longitude: input.longitude
	}];
}
var voiceCache = new TtlCache(432e5, 40, "gemini");
async function awayLine(facts, fallback) {
	const cached = voiceCache.get(facts);
	if (cached) return cached;
	const raw = await geminiJson(`${KAIROS_VOICE} You are Kairos · Away. One sentence, under 20 words. Use only the names, burden, and weather in the JSON. Do not mention children, strollers, or a family unless child ages are in the JSON. Do not invent hotels, restaurants, prices, opening hours, ratings, or routes.`, facts, {
		type: "object",
		properties: { line: { type: "string" } }
	}, 80).catch(() => null);
	const line = raw && typeof raw === "object" ? raw.line : null;
	if (typeof line !== "string" || !voiceStaysInside(line)) return fallback;
	const spoken = line.replace(/\s+/g, " ").trim();
	voiceCache.set(facts, spoken);
	return spoken;
}
async function planTravel(input) {
	const areas = areasOf(input);
	const signature = JSON.stringify({
		areas: areas.map((area) => [
			area.name,
			area.latitude.toFixed(3),
			area.longitude.toFixed(3)
		]),
		start: input.start,
		nights: input.nights,
		pace: input.pace,
		move: input.move,
		oneBase: input.oneBase,
		interests: input.interests,
		rejected: input.rejected,
		mustVisit: input.mustVisit ?? [],
		salt: input.salt,
		childAges: explicitChildAges(input.childAges),
		styles: input.styles ?? [],
		balance: input.balance ?? "balanced",
		firstVisit: input.firstVisit !== false,
		focus: input.focus ?? "icons",
		foodPlanning: input.foodPlanning ?? "balanced"
	});
	return shareRequest(`plan:${signature}`, () => planFresh(input, areas));
}
async function planFresh(input, areas) {
	const countryCode = areas.find((area) => area.countryCode)?.countryCode ?? "";
	const books = await playbooksForPlanning(input.destination, {
		latitude: input.latitude,
		longitude: input.longitude,
		countryCode
	}).catch(() => void 0);
	const adapted = adaptPlaybook({
		destination: input.destination,
		nights: input.nights,
		pace: input.pace,
		oneBase: input.oneBase,
		interests: input.interests,
		styles: input.styles,
		balance: input.balance ?? "balanced",
		firstVisit: input.firstVisit !== false,
		childAges: explicitChildAges(input.childAges)
	}, books);
	const discover = searchAreasFor(areas, adapted);
	const stayAreas = baseAreasFor(areas, adapted);
	const primary = discover[0] ?? areas[0] ?? {
		name: input.destination,
		latitude: input.latitude,
		longitude: input.longitude
	};
	const [profile, firstFound] = await Promise.all([destinationProfile(primary).catch(() => null), discoverPlaces(primary)]);
	const found = [firstFound];
	for (const area of discover.slice(1)) found.push(await discoverPlaces(area));
	const discovered = [];
	discover.forEach((area, index) => {
		const spots = found[index]?.places ?? [];
		const knowledge = index === 0 && profile && profile.status !== "failed" ? profile.places : [];
		discovered.push(...mergePlaces(spots, knowledge, area));
	});
	const osm = found.some((item) => item.status === "ok") ? "ok" : found.some((item) => item.status === "empty") ? "empty" : "failed";
	const hotels = found.some((item) => item.hotels === "ok") ? "ok" : found.some((item) => item.hotels === "empty") ? "empty" : "failed";
	const wikidata = profile?.status ?? "failed";
	const sightCount = discovered.filter((spot) => spot.category !== "stay" && spot.category !== "restaurant" && spot.category !== "cafe" && spot.category !== "nightlife" && spot.category !== "transport" && spot.category !== "other").length;
	let note = "";
	if (!sightCount && (osm === "failed" || wikidata === "failed")) note = `Couldn't load places for ${input.destination}.`;
	else if (!sightCount) note = `No places came back for ${input.destination}.`;
	const discovery = {
		osm,
		wikidata,
		hotels,
		note
	};
	const dates = Array.from({ length: Math.min(7, input.nights) }, (_, index) => {
		const [year, month, day] = input.start.split("-").map(Number);
		return new Date(Date.UTC(year, (month || 1) - 1, (day || 1) + index)).toISOString().slice(0, 10);
	});
	const [listed, weather] = await Promise.all([labelPlaces(spreadPlaces(discovered, discover.length > 2 ? 80 : 56), {
		countryCode,
		latitude: primary.latitude,
		longitude: primary.longitude
	}).then((rows) => attachPlacePhotos(rows)).then((rows) => attachPlaceStories(rows, primary.name)), travelWeather({
		lat: primary.latitude,
		lng: primary.longitude
	}, dates)]);
	const points = [...stayAreas.map((area) => ({
		lat: area.latitude,
		lng: area.longitude
	})), ...listed.map((spot) => ({
		lat: spot.lat,
		lng: spot.lng
	}))];
	const matrix = await travelMatrix(input.move, points);
	const transfers = matrix ? stayAreas.map((_, from) => stayAreas.map((__, to) => matrix.minutes[from]?.[to] ?? null)) : null;
	const spotMatrix = matrix ? matrix.minutes.slice(stayAreas.length).map((row) => row.slice(stayAreas.length)) : null;
	let trip = buildTrip({
		destination: input.destination,
		areas: stayAreas,
		start: input.start,
		nights: input.nights,
		adults: input.adults,
		childAges: explicitChildAges(input.childAges),
		pace: input.pace,
		move: input.move,
		oneBase: input.oneBase,
		interests: input.interests,
		rejected: input.rejected,
		mustVisit: input.mustVisit ?? [],
		salt: input.salt,
		lockedDates: input.lockedDates,
		spots: listed,
		weather,
		matrix: spotMatrix,
		transfers,
		styles: input.styles,
		balance: input.balance,
		firstVisit: input.firstVisit,
		focus: input.focus,
		foodPlanning: input.foodPlanning,
		profileNote: "",
		countryCode,
		discovery,
		skeleton: adapted?.days,
		playbook: adapted?.view
	});
	for (const day of trip.days) {
		if (input.lockedDates.includes(day.date)) continue;
		const rows = dayStops(trip, day.index);
		if (rows.length < 2) continue;
		const route = await travelRoute(input.move, rows.map((stop) => ({
			lat: stop.lat,
			lng: stop.lng
		})));
		if (route.source !== "osrm") continue;
		trip = applyRoute(trip, day.index, route);
	}
	const fallback = localTripVoice(trip.burden, trip.days.find((day) => day.outdoorOk === false)?.label ?? "");
	const facts = JSON.stringify({
		destination: trip.destination,
		burden: trip.burden.line,
		bases: trip.bases.map((base) => ({
			label: base.label,
			chosen: base.chosen,
			note: base.note
		})),
		days: trip.days.slice(0, 7).map((day) => ({
			label: day.label,
			weather: day.weather,
			stops: dayStops(trip, day.index).map((stop) => readableName(stop))
		})),
		why: trip.whyTrip,
		coverage: (trip.coverage ?? []).map((row) => ({
			group: row.group,
			status: row.status,
			example: row.example
		})),
		requests: itineraryRequestPlan(areas.length, dates.length)
	});
	trip.voice = await awayLine(facts, fallback);
	logGeneration(input, adapted, trip);
	return trip;
}
function logGeneration(input, adapted, trip) {
	if (process.env.KAIROS_TRAVEL_LOG === "0") return;
	const days = trip.days.filter((day) => trip.stops.some((stop) => stop.day === day.index && stop.category !== "stay"));
	const lines = [
		"[TRAVEL GENERATION]",
		`canonical destination: ${trip.destination}`,
		`selected TravelPlaybook ID: ${adapted?.id ?? "none"}`,
		`TravelPlaybook confidence: ${adapted?.confidence ?? "none"}`,
		`playbook duration band: ${adapted?.bandId ?? "none"}`,
		`fallback planner used: ${adapted ? "NO" : "YES"}`,
		`hotel selected by user: ${(trip.hotelSelectionSource ?? "NONE") === "NONE" ? "NO" : "YES"}`,
		`exact hotel ID: null`,
		`day themes: ${trip.days.map((day) => day.theme || day.intent || day.area).join(" | ")}`,
		`scheduled stops per day: ${trip.days.map((day) => trip.stops.filter((stop) => stop.day === day.index && stop.category !== "stay").length).join(",")}`,
		`validation: ${days.length ? "days-present" : "empty"}`,
		`playbook anchor stops: ${trip.curation?.anchorStops ?? 0}`,
		`supplementary osm stops: ${trip.curation?.osmStops ?? 0}`,
		`experience groups satisfied: ${(trip.curation?.groupsSatisfied ?? []).join(", ") || "none"}`,
		`thin-day repairs: ${trip.curation?.thinRepairs ?? 0}`,
		`fallback: ${(trip.curation?.fallback ?? []).join(", ") || "none"}`,
		"Gemini calls: 0 or 1 voice line, none for the plan",
		`final itinerary source: ${adapted ? "TravelPlaybook" : "place-list"}`
	];
	console.info(lines.join("\n"));
}
var SEE = /* @__PURE__ */ new Set([
	"attraction",
	"museum",
	"park",
	"garden",
	"viewpoint",
	"landmark",
	"historic",
	"theme_park",
	"zoo",
	"aquarium",
	"shopping",
	"beach",
	"family"
]);
var FOOD = /* @__PURE__ */ new Set([
	"restaurant",
	"cafe",
	"market",
	"nightlife"
]);
function spreadPlaces(spots, limit = 56) {
	const rank = (spot) => spot.importance === "iconic" ? 0 : spot.importance === "major" ? 1 : spot.importance === "interest" ? 2 : 3;
	const byArea = /* @__PURE__ */ new Map();
	for (const spot of spots) {
		const list = byArea.get(spot.area) ?? [];
		list.push(spot);
		byArea.set(spot.area, list);
	}
	const picked = [];
	for (const list of byArea.values()) {
		const stays = list.filter((spot) => spot.category === "stay").slice(0, 8);
		const food = list.filter((spot) => FOOD.has(spot.category)).sort((a, b) => rank(a) - rank(b)).slice(0, 8);
		const sights = list.filter((spot) => SEE.has(spot.category)).sort((a, b) => rank(a) - rank(b)).slice(0, 40);
		picked.push(...stays, ...food, ...sights);
	}
	const unique = [];
	for (const spot of picked.sort((a, b) => rank(a) - rank(b))) {
		if (unique.some((item) => item.id === spot.id)) continue;
		const sameName = unique.find((item) => item.name.toLowerCase() === spot.name.toLowerCase());
		if (sameName) {
			if (!(spot.category === "stay" && sameName.category === "stay" && distanceMeters(spot.lat, spot.lng, sameName.lat, sameName.lng) > 1500)) continue;
		}
		unique.push(spot);
		if (unique.length === limit) break;
	}
	return unique;
}
async function routeTravelDay(move, points) {
	return travelRoute(move, points);
}
//#endregion
export { locateHotel, planTravel, routeTravelDay, searchTravelDestinations };
