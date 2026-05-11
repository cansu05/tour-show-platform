import type {Tour, TourDocument, TourLocalizedContent} from '@/types/tour';
import {getTourPriceSummary} from '@/utils/tour-pricing';

const PLACEHOLDER_IMAGE = 'https://picsum.photos/1200/800?random=99';

function normalizeOptionalString(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function toIsoString(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && value !== null && '_seconds' in value) {
    const seconds = Number((value as {_seconds: number})._seconds);
    if (!Number.isNaN(seconds)) return new Date(seconds * 1000).toISOString();
  }
  return new Date().toISOString();
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
}

function parsePublishState(value: unknown): Tour['publishState'] {
  return value === 'active' || value === 'draft' || value === 'passive' ? value : undefined;
}

function pickBaseContent(localized: Tour['localized']): TourLocalizedContent | undefined {
  if (!localized) return undefined;
  return localized.tr || localized.de || localized.en;
}

export function mapTourDocument(raw: TourDocument, idFallback: string): Tour | null {
  if (!raw.slug) return null;

  const fallbackContent = pickBaseContent(raw.localized);
  const gallery = stringArray(raw.gallery);
  const title = raw.localized?.tr?.title || raw.title || fallbackContent?.title || raw.slug;
  const shortDescription = fallbackContent?.shortDescription || raw.shortDescription || '';
  const priceSummary = getTourPriceSummary(raw.pricing, raw.campaignPrice);

  const coverImage = normalizeOptionalString(raw.coverImage) || gallery[0] || PLACEHOLDER_IMAGE;
  const videoUrls = Array.from(
    new Set([...stringArray(raw.videoUrls), normalizeOptionalString(raw.videoUrl)].filter((entry): entry is string => Boolean(entry)))
  );
  const videoUrl = videoUrls[0];

  return {
    id: raw.id ?? idFallback,
    slug: raw.slug,
    isActive: Boolean(raw.isActive),
    publishState: parsePublishState(raw.publishState) || (Boolean(raw.isActive) ? 'active' : 'passive'),
    categories: stringArray(raw.categories),
    hasTransfer: Boolean(raw.hasTransfer),
    hasMeal: Boolean(raw.hasMeal),
    isAdvantage: Boolean(raw.isAdvantage),
    campaignPrice: typeof raw.campaignPrice === 'number' ? raw.campaignPrice : undefined,
    pricing: raw.pricing || {currency: 'EUR', byRegion: {}},
    participantRules: raw.participantRules,
    coverImage,
    gallery,
    videoUrl,
    videoUrls,
    localized: raw.localized,
    title,
    shortDescription,
    description: fallbackContent?.description || raw.description,
    thingsToBring: fallbackContent?.thingsToBring || stringArray(raw.thingsToBring),
    importantNotes: fallbackContent?.importantNotes || stringArray(raw.importantNotes),
    priceText: raw.priceText || priceSummary.displayPriceText,
    keywords: stringArray(raw.keywords),
    createdAt: toIsoString(raw.createdAt),
    updatedAt: toIsoString(raw.updatedAt)
  };
}
