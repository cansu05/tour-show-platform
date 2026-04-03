import type {Tour, TourDocument} from '@/types/tour';
import {createTourDocument, fetchAllTours, fetchTourBySlug, updateTourDocument} from '@/services/firebase/tour.repository';

export async function getAllTours(): Promise<Tour[]> {
  return fetchAllTours();
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  return fetchTourBySlug(slug);
}

export async function createTour(tour: TourDocument): Promise<void> {
  return createTourDocument(tour);
}

export async function updateTour(originalSlug: string, tour: TourDocument): Promise<string> {
  return updateTourDocument(originalSlug, tour);
}
