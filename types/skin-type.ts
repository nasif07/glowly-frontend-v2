import type { SkinType } from "@/lib/skin";

/**
 * Media + copy for one homepage "Shop by Skin Type" tile — mirrors the
 * backend `/skin-types` module. Types without a record use the default tile.
 */
export interface SkinTypeMedia {
  _id: string;
  skinType: Exclude<SkinType, "all">;
  mediaType: "image" | "video";
  mediaUrl: string;
  /** R2 object key behind `mediaUrl`. */
  mediaKey?: string | null;
  /** Replaces the built-in description when non-empty. */
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkinTypeMediaInput {
  mediaType?: "image" | "video";
  mediaUrl?: string;
  mediaKey?: string | null;
  description?: string;
}
