import {LOCALES, type AppLocale} from '../constants/locales';
import type {LocalizedText, Tour} from '../types/tour';

type LocalizableTourFields = Pick<
  Tour,
  'title' | 'shortDescription' | 'duration' | 'priceText' | 'keywords' | 'highlights' | 'includedServices'
> & {
  localized?: Tour['localized'];
};

function buildLocalizedText(baseValue: string | undefined, existing: LocalizedText | undefined): LocalizedText | undefined {
  if (!baseValue && !existing) return undefined;

  const result: LocalizedText = {};

  for (const locale of LOCALES) {
    const value = existing?.[locale] || baseValue;
    if (value) result[locale] = value;
  }

  return Object.keys(result).length ? result : undefined;
}

function buildLocalizedList(
  baseValue: string[] | undefined,
  existing: Record<string, string[]> | undefined
): Record<string, string[]> | undefined {
  if ((!baseValue || baseValue.length === 0) && !existing) return undefined;

  const result: Record<string, string[]> = {};

  for (const locale of LOCALES) {
    const value = existing?.[locale] || baseValue || [];
    if (value.length) result[locale] = value;
  }

  return Object.keys(result).length ? result : undefined;
}

export function buildLocalizedFields(tour: Partial<LocalizableTourFields>): NonNullable<Tour['localized']> {
  const localized = tour.localized || {};

  return {
    title: buildLocalizedText(tour.title, localized.title),
    shortDescription: buildLocalizedText(tour.shortDescription, localized.shortDescription),
    duration: buildLocalizedText(tour.duration, localized.duration),
    priceText: buildLocalizedText(tour.priceText, localized.priceText),
    keywords: buildLocalizedList(tour.keywords, localized.keywords),
    highlights: buildLocalizedList(tour.highlights, localized.highlights),
    includedServices: buildLocalizedList(tour.includedServices, localized.includedServices)
  };
}

export function ensureTourLocalized<T extends LocalizableTourFields>(tour: T): T {
  return {
    ...tour,
    localized: buildLocalizedFields(tour)
  };
}

export function pickLocalizedText(
  value: LocalizedText | undefined,
  locale: AppLocale,
  fallback: string | undefined
): string | undefined {
  if (!value) return fallback;
  return value[locale] || value.tr || value.en || value.de || fallback;
}

export function pickLocalizedList(
  value: Record<string, string[]> | undefined,
  locale: AppLocale,
  fallback: string[] | undefined
): string[] | undefined {
  if (!value) return fallback;
  return value[locale] || value.tr || value.en || value.de || fallback;
}
