import {MAX_SUGGESTIONS} from '@/constants/app';
import type {AppLocale} from '@/constants/locales';
import type {Tour} from '@/types/tour';
import {filterToursByCategory} from '@/utils/category-filter';
import {scoreTourAgainstSearch} from '@/utils/search-rank';

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
