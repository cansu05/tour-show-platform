import {TOUR_REGIONS} from '@shared/index';
import type {Tour, TourDocument, TourParticipantRules, TourRegionPricing} from '@/types/tour';
import {sortTourDays} from '@shared/index';
import type {TourLifecycleStatus} from '@/features/dashboard/admin-data';
import {slugify} from '@/utils/slug';

export type DashboardRegionInput = {
  enabled: boolean;
  adultPrice: string;
  childPrice: string;
  availableDays: string[];
};

export type DashboardTourInput = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categories: string[];
  keywords: string[];
  thingsToBring: string[];
  importantNotes: string[];
  localized?: Tour['localized'];
  coverImage: string;
  gallery: string;
  videoUrl: string;
  currency: string;
  campaignPrice: string;
  hasTransfer: boolean;
  hasMeal: boolean;
  isAdvantage: boolean;
  publishState: TourLifecycleStatus;
  participantRules: {
    freeChildMinAge: string;
    freeChildMaxAge: string;
    childMinAge: string;
    childMaxAge: string;
  };
  regions: Record<string, DashboardRegionInput>;
};

export const DASHBOARD_INITIAL_FORM: DashboardTourInput = {
  slug: '',
  title: '',
  shortDescription: '',
  description: '',
  categories: [],
  keywords: [],
  thingsToBring: [],
  importantNotes: [],
  localized: {},
  coverImage: '',
  gallery: '',
  videoUrl: '',
  currency: 'EUR',
  campaignPrice: '',
  hasTransfer: true,
  hasMeal: false,
  isAdvantage: false,
  publishState: 'draft',
  participantRules: {
    freeChildMinAge: '0',
    freeChildMaxAge: '4',
    childMinAge: '5',
    childMaxAge: '12'
  },
  regions: {
    kemer: {enabled: true, adultPrice: '', childPrice: '', availableDays: []},
    antalyaBelek: {enabled: true, adultPrice: '', childPrice: '', availableDays: []},
    sideManavgat: {enabled: true, adultPrice: '', childPrice: '', availableDays: []},
    alanya: {enabled: true, adultPrice: '', childPrice: '', availableDays: []}
  }
};

function splitMultiline(value: string) {
  return value.split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean);
}

function resolveFormCoverImage(coverImage: string, gallery: string[]) {
  return coverImage.trim() || gallery[0] || '';
}

function parseOptionalNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error('Sayısal alanlarda yalnızca sayı girin.');
  }
  return parsed;
}

function buildParticipantRules(input: DashboardTourInput['participantRules']): TourParticipantRules | undefined {
  const rules = {
    freeChildMinAge: parseOptionalNumber(input.freeChildMinAge),
    freeChildMaxAge: parseOptionalNumber(input.freeChildMaxAge),
    childMinAge: parseOptionalNumber(input.childMinAge),
    childMaxAge: parseOptionalNumber(input.childMaxAge)
  };

  return Object.values(rules).some((value) => value !== undefined) ? rules : undefined;
}

function buildRegionPricing(regions: DashboardTourInput['regions']) {
  return Object.entries(regions).reduce<Record<string, TourRegionPricing>>((acc, [regionKey, region]) => {
    if (!region.enabled) return acc;

    const adultPrice = parseOptionalNumber(region.adultPrice);
    const childPrice = parseOptionalNumber(region.childPrice);
    const availableDays = sortTourDays(region.availableDays.filter(Boolean));

    if (adultPrice === undefined && childPrice === undefined && availableDays.length === 0) {
      return acc;
    }

    acc[regionKey] = {adultPrice, childPrice, availableDays};
    return acc;
  }, {});
}

function syncLocalizedTitles(localized: Tour['localized'], title: string): Tour['localized'] {
  if (!localized) return {};

  return Object.fromEntries(
    Object.entries(localized).map(([locale, content]) => [
      locale,
      content
        ? {
            ...content,
            title
          }
        : content
    ])
  ) as Tour['localized'];
}

export function normalizeDashboardSlug(value: string) {
  return slugify(value);
}

export function validateDashboardTourInput(input: DashboardTourInput): void {
  const title = input.title.trim();
  const shortDescription = input.shortDescription.trim();
  const description = input.description.trim();
  const gallery = splitMultiline(input.gallery);
  const coverImage = resolveFormCoverImage(input.coverImage, gallery);
  const byRegion = buildRegionPricing(input.regions);
  const isDraft = input.publishState === 'draft';

  if (!normalizeDashboardSlug(input.slug || input.title)) throw new Error('Geçerli bir slug üretilemedi.');
  if (!title) throw new Error('Tur adı zorunludur.');
  if (!isDraft && !shortDescription) throw new Error('Kısa açıklama zorunludur.');
  if (!isDraft && !description) throw new Error('Detaylı açıklama zorunludur.');
  if (!isDraft && !coverImage) throw new Error('Kapak görseli zorunludur.');
  if (!isDraft && input.categories.length === 0) throw new Error('En az bir kategori seçin.');
  if (!isDraft && Object.keys(byRegion).length === 0) throw new Error('En az bir bölge için fiyat veya gün bilgisi girin.');
}

export function buildTourDocumentFromDashboardInput(input: DashboardTourInput): TourDocument {
  validateDashboardTourInput(input);

  const slug = normalizeDashboardSlug(input.slug || input.title);
  const title = input.title.trim();
  const shortDescription = input.shortDescription.trim();
  const description = input.description.trim();
  const gallery = splitMultiline(input.gallery);
  const coverImage = resolveFormCoverImage(input.coverImage, gallery);
  const thingsToBring = input.thingsToBring.map((entry) => entry.trim()).filter(Boolean);
  const importantNotes = input.importantNotes.map((entry) => entry.trim()).filter(Boolean);
  const keywords = input.keywords.map((entry) => entry.trim()).filter(Boolean);
  const byRegion = buildRegionPricing(input.regions);

  return {
    slug,
    isActive: input.publishState === 'active',
    publishState: input.publishState,
    categories: input.categories,
    hasTransfer: input.hasTransfer,
    hasMeal: input.hasMeal,
    isAdvantage: input.isAdvantage,
    campaignPrice: parseOptionalNumber(input.campaignPrice),
    pricing: {currency: input.currency.trim() || 'EUR', byRegion},
    participantRules: buildParticipantRules(input.participantRules),
    coverImage,
    gallery,
    videoUrl: input.videoUrl.trim() || undefined,
    localized: {
      ...syncLocalizedTitles(input.localized, title),
      tr: {
        title,
        shortDescription,
        description,
        thingsToBring,
        importantNotes
      }
    },
    title,
    shortDescription,
    description,
    thingsToBring,
    importantNotes,
    keywords
  };
}

export function buildDashboardFormFromTour(tour: Tour): DashboardTourInput {
  const byRegion = tour.pricing.byRegion || {};
  const publishState = tour.publishState || (tour.isActive ? 'active' : 'passive');
  const gallery = tour.gallery || [];

  return {
    slug: tour.slug,
    title: tour.localized?.tr?.title || tour.title || '',
    shortDescription: tour.localized?.tr?.shortDescription || tour.shortDescription || '',
    description: tour.localized?.tr?.description || tour.description || '',
    categories: tour.categories || [],
    keywords: tour.keywords || [],
    thingsToBring: tour.localized?.tr?.thingsToBring || tour.thingsToBring || [],
    importantNotes: tour.localized?.tr?.importantNotes || tour.importantNotes || [],
    localized: tour.localized || {},
    coverImage: resolveFormCoverImage(tour.coverImage || '', gallery),
    gallery: gallery.join('\n'),
    videoUrl: tour.videoUrl || '',
    currency: tour.pricing.currency || 'EUR',
    campaignPrice: typeof tour.campaignPrice === 'number' ? String(tour.campaignPrice) : '',
    hasTransfer: tour.hasTransfer,
    hasMeal: tour.hasMeal,
    isAdvantage: Boolean(tour.isAdvantage),
    publishState,
    participantRules: {
      freeChildMinAge: tour.participantRules?.freeChildMinAge?.toString() || '',
      freeChildMaxAge: tour.participantRules?.freeChildMaxAge?.toString() || '',
      childMinAge: tour.participantRules?.childMinAge?.toString() || '',
      childMaxAge: tour.participantRules?.childMaxAge?.toString() || ''
    },
    regions: TOUR_REGIONS.reduce<Record<string, DashboardRegionInput>>((acc, region) => {
      acc[region.key] = {
        enabled: Boolean(byRegion[region.key]),
        adultPrice: byRegion[region.key]?.adultPrice?.toString() || '',
        childPrice: byRegion[region.key]?.childPrice?.toString() || '',
        availableDays: sortTourDays(byRegion[region.key]?.availableDays || [])
      };
      return acc;
    }, {})
  };
}

export function buildDuplicateTourForm(tour: Tour): DashboardTourInput {
  const duplicated = buildDashboardFormFromTour(tour);

  return {
    ...duplicated,
    slug: '',
    title: `${duplicated.title} Kopya`,
    publishState: 'draft'
  };
}

