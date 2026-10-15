export type MakanOriginSource = "meeting_location" | "office" | "home" | "current_location" | "manual";

/** One reading for a makan search. Not a location history. */
export type MakanOrigin = {
  source: MakanOriginSource;
  label?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  providerId?: string;
};
