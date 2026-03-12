import {FieldValue} from 'firebase-admin/firestore';
import {adminDb} from '../lib/firebase/admin';
import {ensureTranslatedLocalized} from './lib/tour-translation';
import type {Tour} from '../types/tour';

async function backfillTourLocales() {
  if (!adminDb) {
    throw new Error(
      'Firebase Admin SDK is not initialized. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.'
    );
  }

  const sourceLocale = (process.env.TOUR_SOURCE_LOCALE || 'tr') as 'tr' | 'en' | 'de';
  const snapshot = await adminDb.collection('tours').get();
  let updatedCount = 0;

  for (const doc of snapshot.docs) {
    const raw = doc.data() as Record<string, unknown>;

    const tourDraft: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'> = {
      title: typeof raw.title === 'string' ? raw.title : '',
      slug: typeof raw.slug === 'string' ? raw.slug : doc.id,
      keywords: Array.isArray(raw.keywords) ? raw.keywords.filter((v): v is string => typeof v === 'string') : [],
      categories: Array.isArray(raw.categories)
        ? (raw.categories.filter((v): v is Tour['categories'][number] => typeof v === 'string') as Tour['categories'])
        : [],
      shortDescription: typeof raw.shortDescription === 'string' ? raw.shortDescription : '',
      highlights: Array.isArray(raw.highlights) ? raw.highlights.filter((v): v is string => typeof v === 'string') : [],
      includedServices: Array.isArray(raw.includedServices)
        ? raw.includedServices.filter((v): v is string => typeof v === 'string')
        : [],
      duration: typeof raw.duration === 'string' ? raw.duration : undefined,
      priceText: typeof raw.priceText === 'string' ? raw.priceText : undefined,
      coverImage: typeof raw.coverImage === 'string' ? raw.coverImage : '',
      gallery: Array.isArray(raw.gallery) ? raw.gallery.filter((v): v is string => typeof v === 'string') : [],
      isActive: Boolean(raw.isActive),
      localized: (raw.localized as Tour['localized']) || {}
    };

    const translated = await ensureTranslatedLocalized(tourDraft, sourceLocale);

    await doc.ref.set(
      {
        localized: translated.localized,
        updatedAt: FieldValue.serverTimestamp()
      },
      {merge: true}
    );
    updatedCount += 1;
    console.log(`Updated ${tourDraft.slug}`);
  }

  console.log(`Updated localized fields for ${updatedCount} tours.`);
}

backfillTourLocales().catch((error) => {
  console.error('Backfill failed', error);
  process.exit(1);
});
