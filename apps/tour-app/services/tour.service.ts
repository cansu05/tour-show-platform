import type {Tour, TourDocument} from '@/types/tour';
import {createTourDocument, fetchActiveTours, fetchTourBySlug} from '@/services/firebase/tour.repository';

export async function getActiveTours(): Promise<Tour[]> {
  return fetchActiveTours();
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  return fetchTourBySlug(slug);
}

export async function createTour(tour: TourDocument): Promise<void> {
  return createTourDocument(tour);
}
