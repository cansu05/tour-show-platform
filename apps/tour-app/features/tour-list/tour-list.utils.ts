import {MAX_SUGGESTIONS} from '@/constants/app';
import type {AppLocale} from '@/constants/locales';
import type {Tour} from '@/types/tour';
import {filterToursByCategory} from '@/utils/category-filter';
import {normalizeTurkishText} from '@/utils/normalize';
import {getTourPriceSummary} from '@/utils/tour-pricing';
import {scoreTourAgainstSearch} from '@/utils/search-rank';
import type {TourQuickFilter} from '@/features/tour-list/tour-list.types';

export function getAvailableCategories(tours: Tour[], locale: AppLocale) {
  return Array.from(new Set(tours.flatMap((tour) => tour.categories))).sort((a, b) =>
    a.localeCompare(b, locale)
  );
}

export function rankToursForDisplay({
  tours,
  category,
  search,
  locale
}: {
  tours: Tour[];
  category: string | null;
  search: string;
  locale: AppLocale;
}) {
  const scored = filterToursByCategory(tours, category)
    .map((tour) => ({tour, result: scoreTourAgainstSearch(tour, search)}))
    .filter((entry): entry is {tour: Tour; result: NonNullable<ReturnType<typeof scoreTourAgainstSearch>>} => Boolean(entry.result))
    .sort((a, b) => b.result.score - a.result.score || a.tour.title.localeCompare(b.tour.title, locale));

  return {
    list: scored.map((entry) => entry.tour),
    suggestions: scored
      .filter((entry) => entry.result.reason === 'fuzzy')
      .slice(0, MAX_SUGGESTIONS)
      .map((entry) => entry.tour.title)
  };
}

function getTodayKey() {
  return new Intl.DateTimeFormat('en-US', {weekday: 'long', timeZone: 'Europe/Istanbul'}).format(new Date()).toLowerCase();
}

function getAvailableDays(tour: Tour) {
  return Object.values(tour.pricing.byRegion || {}).flatMap((region) => region.availableDays || []);
}

function getComparablePrice(tour: Tour) {
  if (typeof tour.campaignPrice === 'number') return tour.campaignPrice;
  return getTourPriceSummary(tour.pricing, tour.campaignPrice).minAdultPrice;
}

function isTodayAvailable(tour: Tour) {
  return getAvailableDays(tour).includes(getTodayKey());
}

function isFamilyFriendly(tour: Tour) {
  const hasChildPrice = Object.values(tour.pricing.byRegion || {}).some((region) => typeof region.childPrice === 'number');
  const hasChildRule =
    typeof tour.participantRules?.childMinAge === 'number' ||
    typeof tour.participantRules?.childMaxAge === 'number' ||
    typeof tour.participantRules?.freeChildMinAge === 'number' ||
    typeof tour.participantRules?.freeChildMaxAge === 'number';
  const hasFamilyCategory = tour.categories.some((category) => normalizeTurkishText(category).includes('aile'));

  return hasChildPrice || hasChildRule || hasFamilyCategory;
}

function isAdventureTour(tour: Tour) {
  return tour.categories.some((category) => {
    const normalized = normalizeTurkishText(category);
    return normalized.includes('macera') || normalized.includes('adventure') || normalized.includes('abenteuer');
  });
}

export function applyQuickTourFilter(tours: Tour[], filter: TourQuickFilter | null) {
  if (filter === 'today') {
    return tours.filter(isTodayAvailable);
  }

  if (filter === 'transfer') {
    return tours.filter((tour) => tour.hasTransfer);
  }

  if (filter === 'family') {
    return tours.filter(isFamilyFriendly);
  }

  if (filter === 'adventure') {
    return tours.filter(isAdventureTour);
  }

  if (filter === 'economy') {
    return [...tours]
      .filter((tour) => typeof getComparablePrice(tour) === 'number')
      .sort((left, right) => (getComparablePrice(left) ?? Number.MAX_SAFE_INTEGER) - (getComparablePrice(right) ?? Number.MAX_SAFE_INTEGER));
  }

  return tours;
}
