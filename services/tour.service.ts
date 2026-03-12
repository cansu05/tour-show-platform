import type {Tour} from '@/types/tour';
import {fetchActiveTours, fetchTourBySlug} from '@/services/firebase/tour.repository';
import {sortToursAlphabetical} from '@/utils/search-rank';

export async function getActiveTours(): Promise<Tour[]> {
  const tours = await fetchActiveTours();
  return sortToursAlphabetical(tours);
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  return fetchTourBySlug(slug);
}

