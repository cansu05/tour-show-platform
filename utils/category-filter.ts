import type {Tour} from '@/types/tour';

export function filterToursByCategory(tours: Tour[], category: string | null): Tour[] {
  if (!category) return tours;
  return tours.filter((tour) => tour.categories.includes(category as Tour['categories'][number]));
}

