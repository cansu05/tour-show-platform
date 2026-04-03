import {adminDb} from '@/lib/firebase/admin';
import {FieldValue} from 'firebase-admin/firestore';
import type {Tour, TourDocument} from '@/types/tour';
import {mapTourDocument} from '@/services/firebase/tour.mapper';
import {TourConflictError, TourDataAccessError, TourValidationError} from '@/services/firebase/tour.errors';

function ensureAdminDb() {
  if (!adminDb) {
    throw new TourDataAccessError('Firebase Admin SDK is not configured.');
  }

  return adminDb.collection('tours');
}

export async function fetchActiveTours(): Promise<Tour[]> {
  const tourCollection = ensureAdminDb();

  try {
    const snapshot = await tourCollection.where('isActive', '==', true).get();

    return snapshot.docs
      .map((doc) => mapTourDocument({id: doc.id, ...(doc.data() as Record<string, unknown>)}, doc.id))
      .filter((tour): tour is Tour => Boolean(tour));
  } catch (error) {
    throw new TourDataAccessError('Failed to fetch active tours.', {cause: error});
  }
}

export async function fetchTourBySlug(slug: string): Promise<Tour | null> {
  const tourCollection = ensureAdminDb();

  try {
    const directSnapshot = await tourCollection.doc(slug).get();

    if (directSnapshot.exists) {
      const raw: Record<string, unknown> & {id: string} = {
        id: directSnapshot.id,
        ...(directSnapshot.data() as Record<string, unknown>)
      };
      if (raw.isActive !== true) return null;

      return mapTourDocument(raw, directSnapshot.id);
    }

    const fallbackSnapshot = await tourCollection.where('slug', '==', slug).where('isActive', '==', true).limit(1).get();
    const first = fallbackSnapshot.docs[0];
    if (!first) return null;

    const raw: Record<string, unknown> & {id: string} = {id: first.id, ...(first.data() as Record<string, unknown>)};
    return mapTourDocument(raw, first.id);
  } catch (error) {
    throw new TourDataAccessError(`Failed to fetch tour by slug: ${slug}`, {cause: error});
  }
}

export async function createTourDocument(tour: TourDocument): Promise<void> {
  if (!tour.slug) {
    throw new TourValidationError('Tur slug alanı zorunludur.');
  }

  const tourCollection = ensureAdminDb();

  try {
    await tourCollection.doc(tour.slug).create({
      ...tour,
      slug: tour.slug,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  } catch (error) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? (error as {code?: number | string}).code : undefined;

    if (code === 6 || code === 'already-exists') {
      throw new TourConflictError(`"${tour.slug}" slug'i zaten kayıtlı.`, {cause: error});
    }

    throw new TourDataAccessError(`Failed to create tour: ${tour.slug}`, {cause: error});
  }
}
