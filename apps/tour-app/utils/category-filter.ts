import type {Tour} from '@/types/tour';

export const MONTHLY_ADVANTAGE_FILTER = '__monthly_advantage__';

export function isAdvantageTour(tour: Tour): boolean {
  return tour.isAdvantage === true;
}

export function filterToursByCategory(tours: Tour[], category: string | null): Tour[] {
  if (!category) return tours;
  if (category === MONTHLY_ADVANTAGE_FILTER) return tours.filter(isAdvantageTour);
  return tours.filter((tour) => tour.categories.includes(category as Tour['categories'][number]));
}

