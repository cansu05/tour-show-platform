import type {Tour, TourDocument} from '@/types/tour';

export type TourLifecycleStatus = 'active' | 'draft' | 'passive';

export type TourHealth = {
  completion: number;
  issues: string[];
  status: TourLifecycleStatus;
};

const COMPLETION_CHECKS = [
  (tour: Tour) => Boolean(tour.title.trim()),
  (tour: Tour) => Boolean(tour.shortDescription.trim()),
  (tour: Tour) => Boolean(tour.description?.trim()),
  (tour: Tour) => tour.categories.length > 0,
  (tour: Tour) => Boolean(tour.coverImage),
  (tour: Tour) => Object.keys(tour.pricing.byRegion || {}).length > 0,
  (tour: Tour) => tour.gallery.length > 0
] as const;

export function formatDateTime(value?: string) {
  if (!value) return '-';

  try {
    return new Intl.DateTimeFormat('tr-TR', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(value));
  } catch {
    return value;
  }
}

export function getTourIssues(tour: Tour) {
  const issues: string[] = [];

  if (!tour.coverImage) issues.push('Kapak görseli eksik');
  if (!tour.shortDescription?.trim()) issues.push('Kısa açıklama eksik');
  if (!tour.description?.trim()) issues.push('Detaylı açıklama eksik');
  if (tour.categories.length === 0) issues.push('Kategori seçilmemiş');
  if (Object.keys(tour.pricing.byRegion || {}).length === 0) issues.push('Bölge fiyatları girilmemiş');
  if (tour.gallery.length === 0) issues.push('Galeri boş');

  return issues;
}

export function getTourHealth(tour: Tour): TourHealth {
  const completedChecks = COMPLETION_CHECKS.filter((check) => check(tour)).length;
  const completion = Math.round((completedChecks / COMPLETION_CHECKS.length) * 100);
  const issues = getTourIssues(tour);
  const status: TourLifecycleStatus = tour.publishState || (issues.length > 0 ? 'draft' : tour.isActive ? 'active' : 'passive');

  return {completion, issues, status};
}

export function buildTourDocumentFromExistingTour(tour: Tour, overrides: Partial<TourDocument> = {}): TourDocument {
  return {
    slug: overrides.slug ?? tour.slug,
    isActive: overrides.isActive ?? tour.isActive,
    publishState: overrides.publishState ?? tour.publishState,
    categories: overrides.categories ?? tour.categories,
    hasTransfer: overrides.hasTransfer ?? tour.hasTransfer,
    hasMeal: overrides.hasMeal ?? tour.hasMeal,
    campaignPrice: overrides.campaignPrice ?? tour.campaignPrice,
    pricing: overrides.pricing ?? tour.pricing,
    participantRules: overrides.participantRules ?? tour.participantRules,
    coverImage: overrides.coverImage ?? tour.coverImage,
    gallery: overrides.gallery ?? tour.gallery,
    videoUrl: overrides.videoUrl ?? tour.videoUrl,
    localized: overrides.localized ?? tour.localized,
    title: overrides.title ?? tour.title,
    shortDescription: overrides.shortDescription ?? tour.shortDescription,
    description: overrides.description ?? tour.description,
    thingsToBring: overrides.thingsToBring ?? tour.thingsToBring,
    importantNotes: overrides.importantNotes ?? tour.importantNotes,
    keywords: overrides.keywords ?? tour.keywords
  };
}

export function getDashboardOverview(tours: Tour[]) {
  const toursWithHealth = tours.map((tour) => ({tour, ...getTourHealth(tour)}));
  const sorted = [...toursWithHealth].sort((left, right) => +new Date(right.tour.updatedAt) - +new Date(left.tour.updatedAt));
  const activeTours = toursWithHealth.filter((item) => item.status === 'active');
  const draftTours = toursWithHealth.filter((item) => item.status === 'draft');
  const passiveTours = toursWithHealth.filter((item) => item.status === 'passive');
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const updatedThisWeek = tours.filter((tour) => +new Date(tour.updatedAt) >= weekAgo);
  const attentionTours = sorted.filter((item) => item.issues.length > 0).slice(0, 5);

  return {
    totals: {
      total: tours.length,
      active: activeTours.length,
      draft: draftTours.length,
      passive: passiveTours.length,
      updatedThisWeek: updatedThisWeek.length
    },
    lastUpdatedAt: sorted[0]?.tour.updatedAt,
    recentTours: sorted.slice(0, 5),
    attentionTours
  };
}

