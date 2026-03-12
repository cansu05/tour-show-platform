import type {Tour, TourDocument} from '@/types/tour';
import {TOUR_CATEGORIES} from '@/constants/categories';

const PLACEHOLDER_IMAGE = 'https://picsum.photos/1200/800?random=1';

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

function categoryArray(value: unknown): Tour['categories'] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is Tour['categories'][number] =>
      typeof item === 'string' && TOUR_CATEGORIES.includes(item as Tour['categories'][number])
  );
}

export function mapTourDocument(raw: TourDocument, idFallback: string): Tour | null {
  if (!raw.title || !raw.slug) return null;

  return {
    id: raw.id ?? idFallback,
    title: raw.title,
    slug: raw.slug,
    keywords: stringArray(raw.keywords),
    categories: categoryArray(raw.categories),
    shortDescription: raw.shortDescription ?? '',
    highlights: stringArray(raw.highlights),
    includedServices: stringArray(raw.includedServices),
    duration: raw.duration,
    priceText: raw.priceText,
    coverImage: raw.coverImage || PLACEHOLDER_IMAGE,
    gallery: stringArray(raw.gallery),
    isActive: Boolean(raw.isActive),
    createdAt: toIsoString(raw.createdAt),
    updatedAt: toIsoString(raw.updatedAt),
    localized: raw.localized
  };
}
