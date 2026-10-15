/**
 * Hotel rate comparison. Live offers are not connected.
 * This module never invents a price. Tests may pass structured offers in.
 * Ranking code must not import this file.
 */

export type BoardBasis = "room-only" | "breakfast" | "half-board" | "unknown";

export type HotelRateOffer = {
  provider: string;
  providerHotelId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  childAges: number[];
  rooms: number;
  roomName: string;
  boardBasis: BoardBasis;
  refundable: boolean | null;
  cancellationSummary: string;
  nightlyPrice: number;
  totalPrice: number;
  taxesIncluded: boolean | null;
  taxesAmount?: number;
  currency: string;
  fetchedAt: string;
  bookingUrl: string;
  affiliate: boolean;
  dataSource: "authorised-provider" | "test-fixture";
};

export type RateComparison = {
  status: "comparable" | "partial" | "not-comparable";
  cheapestProvider: string;
  notes: string[];
};

/** Production has no authorised rate feed. The UI must not call this and then invent numbers. */
export function liveHotelRates(): null {
  return null;
}

export function compareRateOffers(offers: HotelRateOffer[]): RateComparison {
  if (offers.length < 2) return { status: "not-comparable", cheapestProvider: "", notes: ["One offer is not a comparison."] };
  if (offers.some((offer) => offer.dataSource !== "authorised-provider" && offer.dataSource !== "test-fixture")) {
    return { status: "not-comparable", cheapestProvider: "", notes: ["The source is not an authorised rate."] };
  }
  const first = offers[0];
  if (!first) return { status: "not-comparable", cheapestProvider: "", notes: [] };
  const sameStay = offers.every((offer) => offer.providerHotelId === first.providerHotelId && offer.checkIn === first.checkIn && offer.checkOut === first.checkOut && offer.adults === first.adults && offer.rooms === first.rooms && offer.childAges.join(",") === first.childAges.join(",") && offer.currency === first.currency);
  if (!sameStay) return { status: "not-comparable", cheapestProvider: "", notes: ["Hotel, dates, occupancy, or currency differ."] };
  const sameProduct = offers.every((offer) => offer.boardBasis === first.boardBasis && offer.refundable === first.refundable && offer.taxesIncluded === first.taxesIncluded && offer.roomName === first.roomName);
  if (!sameProduct) return { status: "partial", cheapestProvider: "", notes: ["Meals, cancellation, taxes, or room names differ. No cheapest label."] };
  const cheapest = [...offers].sort((a, b) => a.totalPrice - b.totalPrice)[0];
  return { status: "comparable", cheapestProvider: cheapest?.provider ?? "", notes: ["Same hotel, dates, occupancy, room, meals, taxes, and cancellation."] };
}
