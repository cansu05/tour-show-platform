import {describe, expect, it} from 'vitest';
import {MONTHLY_ADVANTAGE_FILTER, filterToursByCategory, isAdvantageTour} from '@/utils/category-filter';
import type {Tour} from '@/types/tour';

const tours: Tour[] = [
  {
    id: '1',
    title: 'A',
    slug: 'a',
    keywords: [],
    categories: ['aile'],
    shortDescription: '',
    description: '',
    thingsToBring: [],
    importantNotes: [],
    hasTransfer: false,
    hasMeal: false,
    pricing: {currency: 'EUR', byRegion: {}},
    coverImage: 'x',
    gallery: [],
    isActive: true,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: '2',
    title: 'B',
    slug: 'b',
    keywords: [],
    categories: ['macera'],
    shortDescription: '',
    description: '',
    thingsToBring: [],
    importantNotes: [],
    hasTransfer: false,
    hasMeal: false,
    pricing: {currency: 'EUR', byRegion: {}},
    coverImage: 'x',
    gallery: [],
    isActive: true,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: '3',
    title: 'C',
    slug: 'c',
    keywords: [],
    categories: ['deniz'],
    shortDescription: '',
    description: '',
    thingsToBring: [],
    importantNotes: [],
    hasTransfer: false,
    hasMeal: false,
    isAdvantage: true,
    campaignPrice: 25,
    pricing: {currency: 'EUR', byRegion: {}},
    coverImage: 'x',
    gallery: [],
    isActive: true,
    createdAt: '',
    updatedAt: ''
  }
];

describe('filterToursByCategory', () => {
  it('returns all when category is null', () => {
    expect(filterToursByCategory(tours, null)).toHaveLength(3);
  });

  it('filters by category', () => {
    expect(filterToursByCategory(tours, 'aile')).toHaveLength(1);
  });

  it('filters by advantage flag for monthly advantage tours', () => {
    expect(filterToursByCategory(tours, MONTHLY_ADVANTAGE_FILTER)).toEqual([tours[2]]);
  });
});

describe('isAdvantageTour', () => {
  it('returns true when tour is marked as advantage', () => {
    expect(isAdvantageTour(tours[2])).toBe(true);
  });

  it('returns false when tour is not marked as advantage', () => {
    expect(isAdvantageTour(tours[0])).toBe(false);
  });
});
