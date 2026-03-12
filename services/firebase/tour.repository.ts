import {adminDb} from '@/lib/firebase/admin';
import type {Tour} from '@/types/tour';
import {mapTourDocument} from '@/services/firebase/tour.mapper';

function ensureAdminDb() {
  if (!adminDb) {
    return null;
  }

  return adminDb.collection('tours');
}

export async function fetchActiveTours(): Promise<Tour[]> {
  const tourCollection = ensureAdminDb();
  if (!tourCollection) return [];

  try {
    const snapshot = await tourCollection.where('isActive', '==', true).get();

    return snapshot.docs
      .map((doc) => mapTourDocument({id: doc.id, ...(doc.data() as Record<string, unknown>)}, doc.id))
      .filter((tour): tour is Tour => Boolean(tour));
  } catch (error) {
    console.warn('[firebase-admin] Failed to fetch active tours.', error);
    return [];
  }
}

export async function fetchTourBySlug(slug: string): Promise<Tour | null> {
  const tourCollection = ensureAdminDb();
  if (!tourCollection) return null;

  try {
    const snapshot = await tourCollection.where('slug', '==', slug).where('isActive', '==', true).limit(1).get();
    const first = snapshot.docs[0];

    if (!first) return null;

    return mapTourDocument({id: first.id, ...(first.data() as Record<string, unknown>)}, first.id);
  } catch (error) {
    console.warn(`[firebase-admin] Failed to fetch tour by slug: ${slug}`, error);
    return null;
  }
}
