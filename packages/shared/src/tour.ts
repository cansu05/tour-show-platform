import type {AppLocale} from "./locales";

export type TourRegionPricing = {
  adultPrice?: number | null;
  childPrice?: number | null;
  availableDays?: string[];
};

export type TourPricing = {
  currency?: string;
  byRegion?: Record<string, TourRegionPricing>;
};

export type TourParticipantRules = {
  freeChildMinAge?: number | null;
  freeChildMaxAge?: number | null;
  childMinAge?: number | null;
  childMaxAge?: number | null;
};

export type TourLocalizedContent = {
  title: string;
  shortDescription: string;
  description?: string;
  thingsToBring?: string[];
  importantNotes?: string[];
};

export type TourPublishState = "active" | "draft" | "passive";

export type Tour = {
  id: string;
  slug: string;
  isActive: boolean;
  publishState?: TourPublishState;
  categories: string[];
  hasTransfer: boolean;
  hasMeal: boolean;
  isAdvantage?: boolean;
  campaignPrice?: number | null;
  pricing: TourPricing;
  participantRules?: TourParticipantRules;
  coverImage: string;
  gallery: string[];
  videoUrl?: string;
  localized?: Partial<Record<AppLocale, TourLocalizedContent>>;
  title: string;
  shortDescription: string;
  description?: string;
  thingsToBring: string[];
  importantNotes: string[];
  priceText?: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};

export type TourDocument = Partial<Omit<Tour, "id">> & {
  id?: string;
};
