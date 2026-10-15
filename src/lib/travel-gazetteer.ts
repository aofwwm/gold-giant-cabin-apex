import type { PlaybookAnchor, SourceType } from "@/lib/travel-playbook";

/** Verified place coordinates. The compiler clusters these. It does not invent positions. */
export type GazetteerPlace = {
  id: string;
  destinationId: string;
  areaId: string;
  areaName: string;
  name: string;
  localName: string;
  lat: number;
  lng: number;
  groups: string[];
  tier: PlaybookAnchor["tier"];
  duration: number;
  category: PlaybookAnchor["category"];
  indoor?: boolean;
  excursion?: PlaybookAnchor["excursion"];
  wikidataId?: string;
  sources?: SourceType[];
};

export const GAZETTEER: GazetteerPlace[] = [
  { id: "westminster", destinationId: "london", areaId: "westminster", areaName: "Westminster", name: "Palace of Westminster", localName: "Palace of Westminster", lat: 51.4995, lng: -0.1248, groups: ["heritage", "landmark"], tier: "core", duration: 75, category: "historic", wikidataId: "Q3444573", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "british-museum", destinationId: "london", areaId: "museums", areaName: "Bloomsbury", name: "British Museum", localName: "British Museum", lat: 51.5194, lng: -0.1269, groups: ["heritage"], tier: "core", duration: 120, category: "museum", indoor: true, wikidataId: "Q6373", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "tower-london", destinationId: "london", areaId: "tower", areaName: "The Tower", name: "Tower of London", localName: "Tower of London", lat: 51.5081, lng: -0.0759, groups: ["heritage", "landmark"], tier: "core", duration: 90, category: "historic", wikidataId: "Q62378", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "london-eye", destinationId: "london", areaId: "south-bank", areaName: "South Bank", name: "London Eye", localName: "London Eye", lat: 51.5033, lng: -0.1195, groups: ["landmark", "views"], tier: "strong", duration: 50, category: "viewpoint", wikidataId: "Q205293", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "borough-market", destinationId: "london", areaId: "south-bank", areaName: "South Bank", name: "Borough Market", localName: "Borough Market", lat: 51.5055, lng: -0.091, groups: ["food", "neighbourhood"], tier: "strong", duration: 60, category: "market", wikidataId: "Q658434", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "windsor-castle", destinationId: "london", areaId: "windsor", areaName: "Windsor", name: "Windsor Castle", localName: "Windsor Castle", lat: 51.4839, lng: -0.6044, groups: ["heritage"], tier: "core", duration: 120, category: "historic", excursion: "full", wikidataId: "Q42646", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "greenwich", destinationId: "london", areaId: "greenwich", areaName: "Greenwich", name: "Royal Observatory", localName: "Royal Observatory Greenwich", lat: 51.4778, lng: -0.0014, groups: ["heritage", "landmark"], tier: "strong", duration: 70, category: "historic", excursion: "half", wikidataId: "Q192688", sources: ["wikidata", "wikivoyage", "tourism-board"] },

  { id: "gyeongbokgung", destinationId: "seoul", areaId: "jongno", areaName: "Jongno", name: "Gyeongbokgung", localName: "경복궁", lat: 37.5796, lng: 126.977, groups: ["heritage", "landmark"], tier: "core", duration: 90, category: "historic", wikidataId: "Q492410", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "bukchon", destinationId: "seoul", areaId: "jongno", areaName: "Jongno", name: "Bukchon Hanok Village", localName: "북촌한옥마을", lat: 37.5826, lng: 126.985, groups: ["neighbourhood", "heritage"], tier: "strong", duration: 60, category: "historic", wikidataId: "Q498746", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "changdeokgung", destinationId: "seoul", areaId: "jongno", areaName: "Jongno", name: "Changdeokgung", localName: "창덕궁", lat: 37.5794, lng: 126.991, groups: ["heritage"], tier: "strong", duration: 80, category: "historic", wikidataId: "Q478096", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "namsan", destinationId: "seoul", areaId: "namsan", areaName: "Namsan", name: "N Seoul Tower", localName: "N서울타워", lat: 37.5512, lng: 126.9882, groups: ["views", "landmark"], tier: "strong", duration: 60, category: "viewpoint", wikidataId: "Q494734", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "hwaseong", destinationId: "seoul", areaId: "suwon", areaName: "Suwon", name: "Hwaseong Fortress", localName: "화성", lat: 37.2857, lng: 127.0124, groups: ["heritage"], tier: "core", duration: 90, category: "historic", excursion: "full", wikidataId: "Q495094", sources: ["wikidata", "wikivoyage", "tourism-board"] },

  { id: "colosseum", destinationId: "rome", areaId: "ancient", areaName: "Ancient Rome", name: "Colosseum", localName: "Colosseo", lat: 41.8902, lng: 12.4922, groups: ["heritage", "landmark"], tier: "core", duration: 90, category: "historic", wikidataId: "Q10285", sources: ["wikidata", "wikivoyage", "wikipedia"] },
  { id: "forum", destinationId: "rome", areaId: "ancient", areaName: "Ancient Rome", name: "Roman Forum", localName: "Foro Romano", lat: 41.8925, lng: 12.4853, groups: ["heritage"], tier: "core", duration: 70, category: "historic", wikidataId: "Q187578", sources: ["wikidata", "wikivoyage", "wikipedia"] },
  { id: "vatican", destinationId: "rome", areaId: "vatican", areaName: "Vatican", name: "Vatican Museums", localName: "Musei Vaticani", lat: 41.9065, lng: 12.4536, groups: ["heritage", "landmark"], tier: "core", duration: 150, category: "museum", indoor: true, wikidataId: "Q182955", sources: ["wikidata", "wikivoyage", "wikipedia"] },
  { id: "trevi", destinationId: "rome", areaId: "centre", areaName: "Centro", name: "Trevi Fountain", localName: "Fontana di Trevi", lat: 41.9009, lng: 12.4833, groups: ["landmark", "neighbourhood"], tier: "strong", duration: 30, category: "landmark", wikidataId: "Q186125", sources: ["wikidata", "wikivoyage", "wikipedia"] },
  { id: "tivoli", destinationId: "rome", areaId: "tivoli", areaName: "Tivoli", name: "Villa d'Este", localName: "Villa d'Este", lat: 41.9636, lng: 12.7965, groups: ["heritage", "nature"], tier: "strong", duration: 90, category: "garden", excursion: "full", wikidataId: "Q821299", sources: ["wikidata", "wikivoyage", "wikipedia"] },

  { id: "sagrada", destinationId: "barcelona", areaId: "eixample", areaName: "Eixample", name: "Sagrada Família", localName: "Sagrada Família", lat: 41.4036, lng: 2.1744, groups: ["landmark", "heritage"], tier: "core", duration: 90, category: "historic", wikidataId: "Q48435", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "gothic", destinationId: "barcelona", areaId: "gothic", areaName: "Gothic Quarter", name: "Barcelona Cathedral", localName: "Catedral de Barcelona", lat: 41.3839, lng: 2.1762, groups: ["heritage", "neighbourhood"], tier: "strong", duration: 50, category: "historic", wikidataId: "Q17155", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "guell", destinationId: "barcelona", areaId: "guell", areaName: "Park Güell", name: "Park Güell", localName: "Park Güell", lat: 41.4145, lng: 2.1527, groups: ["landmark", "nature"], tier: "strong", duration: 70, category: "garden", wikidataId: "Q212013", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "montjuic", destinationId: "barcelona", areaId: "montjuic", areaName: "Montjuïc", name: "Montjuïc", localName: "Montjuïc", lat: 41.3634, lng: 2.1649, groups: ["views", "nature"], tier: "strong", duration: 70, category: "viewpoint", sources: ["wikivoyage", "tourism-board"] },
  { id: "montserrat", destinationId: "barcelona", areaId: "montserrat", areaName: "Montserrat", name: "Santa Maria de Montserrat", localName: "Santa Maria de Montserrat", lat: 41.593, lng: 1.837, groups: ["heritage", "nature"], tier: "core", duration: 120, category: "historic", excursion: "full", wikidataId: "Q1128683", sources: ["wikidata", "wikivoyage", "tourism-board"] },

  { id: "odori", destinationId: "hokkaido", areaId: "sapporo", areaName: "Sapporo", name: "Odori Park", localName: "大通公園", lat: 43.0596, lng: 141.347, groups: ["neighbourhood", "nature"], tier: "core", duration: 50, category: "park", wikidataId: "Q1194787", sources: ["wikidata", "wikivoyage", "tourism-board"] },
  { id: "nijo-market", destinationId: "hokkaido", areaId: "sapporo-park", areaName: "Sapporo", name: "Nijo Market", localName: "二条市場", lat: 43.062, lng: 141.354, groups: ["food"], tier: "strong", duration: 50, category: "market", sources: ["wikivoyage", "tourism-board"] },
  { id: "otaru-canal", destinationId: "hokkaido", areaId: "otaru", areaName: "Otaru", name: "Otaru Canal", localName: "小樽運河", lat: 43.196, lng: 141.002, groups: ["neighbourhood"], tier: "strong", duration: 70, category: "landmark", excursion: "half", sources: ["wikivoyage", "tourism-board"] },
  { id: "blue-pond", destinationId: "hokkaido", areaId: "biei", areaName: "Biei", name: "Blue Pond", localName: "青い池", lat: 43.4934, lng: 142.6142, groups: ["nature"], tier: "core", duration: 40, category: "viewpoint", excursion: "full", sources: ["wikivoyage", "tourism-board"] },
  { id: "farm-tomita", destinationId: "hokkaido", areaId: "furano", areaName: "Furano", name: "Farm Tomita", localName: "ファーム富田", lat: 43.419, lng: 142.429, groups: ["nature"], tier: "strong", duration: 60, category: "garden", excursion: "full", sources: ["wikivoyage", "tourism-board"] },

  { id: "hallgrimskirkja", destinationId: "iceland", areaId: "reykjavik", areaName: "Reykjavík", name: "Hallgrímskirkja", localName: "Hallgrímskirkja", lat: 64.1417, lng: -21.9266, groups: ["landmark"], tier: "core", duration: 40, category: "historic", wikidataId: "Q547340", sources: ["wikidata", "wikivoyage"] },
  { id: "thingvellir", destinationId: "iceland", areaId: "golden", areaName: "Golden Circle", name: "Þingvellir", localName: "Þingvellir", lat: 64.255, lng: -21.129, groups: ["nature", "heritage"], tier: "core", duration: 70, category: "park", excursion: "full", wikidataId: "Q844882", sources: ["wikidata", "wikivoyage"] },
  { id: "geysir", destinationId: "iceland", areaId: "golden", areaName: "Golden Circle", name: "Geysir", localName: "Geysir", lat: 64.3104, lng: -20.3024, groups: ["nature"], tier: "core", duration: 40, category: "viewpoint", excursion: "full", wikidataId: "Q217437", sources: ["wikidata", "wikivoyage"] },
  { id: "skogafoss", destinationId: "iceland", areaId: "south", areaName: "South Coast", name: "Skógafoss", localName: "Skógafoss", lat: 63.5321, lng: -19.5114, groups: ["nature"], tier: "core", duration: 40, category: "viewpoint", excursion: "full", wikidataId: "Q826123", sources: ["wikidata", "wikivoyage"] },
  { id: "jokulsarlon", destinationId: "iceland", areaId: "south", areaName: "South Coast", name: "Jökulsárlón", localName: "Jökulsárlón", lat: 64.0784, lng: -16.2306, groups: ["nature"], tier: "strong", duration: 50, category: "viewpoint", excursion: "full", wikidataId: "Q834127", sources: ["wikidata", "wikivoyage"] },

  { id: "ubud-palace", destinationId: "bali", areaId: "ubud", areaName: "Ubud", name: "Ubud Palace", localName: "Puri Saren Agung", lat: -8.5065, lng: 115.2626, groups: ["heritage", "neighbourhood"], tier: "core", duration: 40, category: "historic", sources: ["wikivoyage", "tourism-board"] },
  { id: "monkey-forest", destinationId: "bali", areaId: "ubud", areaName: "Ubud", name: "Sacred Monkey Forest", localName: "Mandala Suci Wenara Wana", lat: -8.5183, lng: 115.2586, groups: ["nature"], tier: "strong", duration: 60, category: "park", sources: ["wikivoyage", "tourism-board"] },
  { id: "tegallalang", destinationId: "bali", areaId: "ubud-ridge", areaName: "Ubud ridge", name: "Tegallalang Rice Terrace", localName: "Tegallalang", lat: -8.4312, lng: 115.2792, groups: ["nature"], tier: "core", duration: 50, category: "viewpoint", sources: ["wikivoyage", "tourism-board"] },
  { id: "uluwatu-temple", destinationId: "bali", areaId: "uluwatu", areaName: "Uluwatu", name: "Uluwatu Temple", localName: "Pura Luhur Uluwatu", lat: -8.8291, lng: 115.0849, groups: ["heritage", "views"], tier: "core", duration: 70, category: "historic", excursion: "full", sources: ["wikivoyage", "tourism-board"] },
  { id: "tanah-lot", destinationId: "bali", areaId: "tanah-lot", areaName: "Tanah Lot", name: "Tanah Lot", localName: "Pura Tanah Lot", lat: -8.6212, lng: 115.0868, groups: ["heritage", "views"], tier: "strong", duration: 60, category: "historic", excursion: "half", sources: ["wikivoyage", "tourism-board"] },

  { id: "tekapo", destinationId: "nz-south-island", areaId: "tekapo", areaName: "Lake Tekapo", name: "Lake Tekapo", localName: "Lake Tekapo", lat: -44.0047, lng: 170.4771, groups: ["nature"], tier: "core", duration: 60, category: "viewpoint", excursion: "full", sources: ["wikivoyage", "tourism-board"] },
  { id: "aoraki", destinationId: "nz-south-island", areaId: "aoraki", areaName: "Aoraki / Mount Cook", name: "Aoraki / Mount Cook", localName: "Aoraki", lat: -43.734, lng: 170.096, groups: ["nature"], tier: "core", duration: 90, category: "viewpoint", excursion: "full", sources: ["wikivoyage", "tourism-board"] },
  { id: "queenstown-gardens", destinationId: "nz-south-island", areaId: "queenstown", areaName: "Queenstown", name: "Queenstown Gardens", localName: "Queenstown Gardens", lat: -45.038, lng: 168.66, groups: ["nature", "neighbourhood"], tier: "strong", duration: 50, category: "park", sources: ["wikivoyage", "tourism-board"] },
  { id: "wanaka", destinationId: "nz-south-island", areaId: "wanaka", areaName: "Wanaka", name: "Lake Wanaka", localName: "Lake Wānaka", lat: -44.694, lng: 169.142, groups: ["nature"], tier: "strong", duration: 50, category: "viewpoint", sources: ["wikivoyage", "tourism-board"] },
  { id: "milford", destinationId: "nz-south-island", areaId: "milford", areaName: "Milford Sound", name: "Milford Sound", localName: "Piopiotahi", lat: -44.671, lng: 167.926, groups: ["nature"], tier: "core", duration: 120, category: "viewpoint", excursion: "full", sources: ["wikivoyage", "tourism-board"] },
];
