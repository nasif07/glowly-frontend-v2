/** Mirrors glowly-backend/src/modules/consultation/consultation.model.js. */

export const AGE_RANGES = ["under-18", "18-24", "25-34", "35-44", "45+"] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

export const SKIN_TYPES = [
  "oily",
  "dry",
  "combination",
  "normal",
  "sensitive",
  "not-sure",
] as const;
export type SkinType = (typeof SKIN_TYPES)[number];

export const CONSULTATION_STATUSES = [
  "new",
  "in_review",
  "contacted",
  "closed",
] as const;
export type ConsultationStatus = (typeof CONSULTATION_STATUSES)[number];

export interface ConsultationNote {
  _id: string;
  body: string;
  author?: { _id: string; firstName?: string; lastName?: string; email?: string } | null;
  createdAt: string;
}

/** A row in the admin list (no notes, no photo links). */
export interface ConsultationSummary {
  _id: string;
  consultationId?: string;
  name: string;
  whatsapp: string;
  ageRange?: AgeRange;
  skinType?: SkinType;
  concern: string;
  language: "en" | "bn";
  status: ConsultationStatus;
  photoCount: number;
  contactedAt?: string;
  closedAt?: string;
  photosPurgedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** One consultation for the admin detail page. */
export interface Consultation extends Omit<ConsultationSummary, "photoCount"> {
  /** Signed links that stop working after `photoLinkSeconds`. */
  photos: { index: number; url: string | null }[];
  photoLinkSeconds: number;
  /** Set when the links couldn't be made (e.g. storage not configured). */
  photoError?: string;
  notes: ConsultationNote[];
  consentAt: string;
}

export interface ConsultationListMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  counts: Record<ConsultationStatus, number>;
}

export interface ConsultationsQuery {
  status?: ConsultationStatus;
  search?: string;
  page?: number;
  limit?: number;
}
