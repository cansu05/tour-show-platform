import type {AppLocale} from '@/constants/locales';
import type {Tour} from '@/types/tour';
import {pickLocalizedList, pickLocalizedText} from '@/utils/ensure-tour-localized';

export function localizeTour(tour: Tour, locale: AppLocale): Tour {
  return {
    ...tour,
    title: pickLocalizedText(tour.localized?.title, locale, tour.title) || tour.title,
    shortDescription: pickLocalizedText(tour.localized?.shortDescription, locale, tour.shortDescription) || tour.shortDescription,
    duration: pickLocalizedText(tour.localized?.duration, locale, tour.duration),
    priceText: pickLocalizedText(tour.localized?.priceText, locale, tour.priceText),
    keywords: pickLocalizedList(tour.localized?.keywords, locale, tour.keywords) || tour.keywords,
    highlights: pickLocalizedList(tour.localized?.highlights, locale, tour.highlights) || tour.highlights,
    includedServices: pickLocalizedList(tour.localized?.includedServices, locale, tour.includedServices) || tour.includedServices
  };
}

export function localizeTours(tours: Tour[], locale: AppLocale): Tour[] {
  return tours.map((tour) => localizeTour(tour, locale));
}
