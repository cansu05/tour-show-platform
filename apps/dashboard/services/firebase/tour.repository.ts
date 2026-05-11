import {FieldValue} from 'firebase-admin/firestore';
import {adminDb} from '@/lib/firebase/admin';
import type {Tour, TourDocument} from '@/types/tour';
import {TourConflictError, TourDataAccessError, TourValidationError} from '@/services/firebase/tour.errors';

function ensureAdminDb() {
  if (!adminDb) {
    throw new TourDataAccessError('Firebase Admin SDK is not configured.');
  }

  return adminDb.collection('tours');
}

function toIsoString(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && value !== null && '_seconds' in value) {
    const seconds = Number((value as {_seconds: number})._seconds);
    if (!Number.isNaN(seconds)) return new Date(seconds * 1000).toISOString();
  }
  return new Date().toISOString();
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
}

function parsePublishState(value: unknown): Tour['publishState'] {
  return value === 'active' || value === 'draft' || value === 'passive' ? value : undefined;
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function resolveDashboardCoverImage(rawCoverImage: unknown, gallery: string[]) {
  const coverImage = normalizeOptionalString(rawCoverImage);
  if (coverImage) {
    return coverImage;
  }

  return gallery[0] || '';
}

function mapDashboardTour(raw: Record<string, unknown>, id: string): Tour | null {
  const slug = typeof raw.slug === 'string' ? raw.slug : id;
  if (!slug) return null;

  const localized = raw.localized as Tour['localized'] | undefined;
  const gallery = stringArray(raw.gallery);
  const videoUrls = Array.from(
    new Set([...stringArray(raw.videoUrls), normalizeOptionalString(raw.videoUrl)].filter((entry): entry is string => Boolean(entry)))
  );
  const trContent = localized?.tr;
  const fallbackLocalized = Object.values(localized || {}).find(Boolean);
  const title = trContent?.title || fallbackLocalized?.title || (typeof raw.title === 'string' ? raw.title : slug);
  const shortDescription =
    trContent?.shortDescription ||
    fallbackLocalized?.shortDescription ||
    (typeof raw.shortDescription === 'string' ? raw.shortDescription : '');
  const description =
    trContent?.description ||
    fallbackLocalized?.description ||
    (typeof raw.description === 'string' ? raw.description : undefined);

  return {
    id,
    slug,
    isActive: Boolean(raw.isActive),
    publishState: parsePublishState(raw.publishState) || (Boolean(raw.isActive) ? 'active' : 'passive'),
    categories: stringArray(raw.categories),
    hasTransfer: Boolean(raw.hasTransfer),
    hasMeal: Boolean(raw.hasMeal),
    isAdvantage: Boolean(raw.isAdvantage),
    campaignPrice: typeof raw.campaignPrice === 'number' ? raw.campaignPrice : undefined,
    pricing: (raw.pricing as Tour['pricing']) || {currency: 'EUR', byRegion: {}},
    participantRules: raw.participantRules as Tour['participantRules'],
    coverImage: resolveDashboardCoverImage(raw.coverImage, gallery),
    gallery,
    videoUrl: videoUrls[0],
    videoUrls,
    localized,
    title,
    shortDescription,
    description,
    thingsToBring: trContent?.thingsToBring || stringArray(raw.thingsToBring),
    importantNotes: trContent?.importantNotes || stringArray(raw.importantNotes),
    priceText: typeof raw.priceText === 'string' ? raw.priceText : undefined,
    keywords: stringArray(raw.keywords),
    createdAt: toIsoString(raw.createdAt),
    updatedAt: toIsoString(raw.updatedAt)
  };
}

export async function fetchAllTours(): Promise<Tour[]> {
  const tourCollection = ensureAdminDb();

  try {
    const snapshot = await tourCollection.orderBy('updatedAt', 'desc').get();

    return snapshot.docs
      .map((doc) => mapDashboardTour(doc.data() as Record<string, unknown>, doc.id))
      .filter((tour): tour is Tour => Boolean(tour));
  } catch (error) {
    throw new TourDataAccessError('Failed to fetch tours.', {cause: error});
  }
}

export async function fetchTourBySlug(slug: string): Promise<Tour | null> {
  const tourCollection = ensureAdminDb();

  try {
    const snapshot = await tourCollection.doc(slug).get();
    if (!snapshot.exists) return null;

    return mapDashboardTour(snapshot.data() as Record<string, unknown>, snapshot.id);
  } catch (error) {
    throw new TourDataAccessError(`Failed to fetch tour: ${slug}`, {cause: error});
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

export async function updateTourDocument(originalSlug: string, tour: TourDocument): Promise<string> {
  if (!originalSlug) {
    throw new TourValidationError('Güncellenecek tur bilgisi bulunamadı.');
  }
  if (!tour.slug) {
    throw new TourValidationError('Tur slug alanı zorunludur.');
  }

  const tourCollection = ensureAdminDb();

  try {
    const sourceRef = tourCollection.doc(originalSlug);
    const sourceSnapshot = await sourceRef.get();
    if (!sourceSnapshot.exists) {
      throw new TourValidationError('Güncellenecek tur bulunamadı.');
    }

    const existingCreatedAt = sourceSnapshot.get('createdAt');

    if (tour.slug !== originalSlug) {
      const targetRef = tourCollection.doc(tour.slug);
      const targetSnapshot = await targetRef.get();
      if (targetSnapshot.exists) {
        throw new TourConflictError(`"${tour.slug}" slug'i zaten kayıtlı.`);
      }

      const batch = adminDb!.batch();
      batch.set(targetRef, {
        ...tour,
        slug: tour.slug,
        createdAt: existingCreatedAt ?? FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
      batch.delete(sourceRef);
      await batch.commit();
      return tour.slug;
    }

    await sourceRef.set(
      {
        ...tour,
        slug: tour.slug,
        createdAt: existingCreatedAt ?? FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      },
      {merge: false}
    );

    return tour.slug;
  } catch (error) {
    if (error instanceof TourValidationError || error instanceof TourConflictError) {
      throw error;
    }

    throw new TourDataAccessError(`Failed to update tour: ${originalSlug}`, {cause: error});
  }
}
