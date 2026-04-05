import type {Tour} from '@/types/tour';
import {formatDateTime, getTourHealth} from '@/features/dashboard/admin-data';
import type {TourPreviewData} from '@/features/dashboard/TourPreviewDialog';

export function buildTourInventoryPreviewData(tour: Tour): TourPreviewData {
  const health = getTourHealth(tour);

  return {
    title: tour.title,
    slug: tour.slug,
    categories: tour.categories,
    shortDescription: tour.shortDescription,
    hasTransfer: tour.hasTransfer,
    hasMeal: tour.hasMeal,
    videoUrl: tour.videoUrl,
    coverImage: tour.coverImage,
    gallery: tour.gallery,
    updatedAt: formatDateTime(tour.updatedAt),
    isActive: tour.isActive,
    status: health.status,
    completion: health.completion,
    currency: tour.pricing.currency,
    pricingByRegion: Object.entries(tour.pricing.byRegion || {}).map(([regionKey, value]) => ({
      regionKey,
      adultPrice: value.adultPrice ?? undefined,
      childPrice: value.childPrice ?? undefined,
      availableDays: value.availableDays || []
    }))
  };
}
