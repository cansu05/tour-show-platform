import {describe, expect, it} from 'vitest';
import type {Tour} from '@/types/tour';
import {localizeTour} from '@/utils/localize-tour';

const tour: Tour = {
  id: '1',
  slug: 'alanya-pirate-ship',
  isActive: true,
  categories: [],
  hasTransfer: true,
  hasMeal: false,
  pricing: {currency: 'EUR', byRegion: {}},
  coverImage: 'cover.jpg',
  gallery: [],
  localized: {
    de: {
      title: 'Alanya Piratenschiff Tour',
      shortDescription: 'Deutsche Kurzbeschreibung'
    },
    tr: {
      title: 'Piratenfahrt Alanya',
      shortDescription: 'Turkce kisa aciklama'
    }
  },
  title: 'Piratenfahrt Alanya',
  shortDescription: 'Turkce kisa aciklama',
  thingsToBring: [],
  importantNotes: [],
  keywords: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

describe('localizeTour', () => {
  it('keeps the canonical tour title while localizing content', () => {
    const localized = localizeTour(tour, 'de');

    expect(localized.title).toBe('Piratenfahrt Alanya');
    expect(localized.shortDescription).toBe('Deutsche Kurzbeschreibung');
  });
});
