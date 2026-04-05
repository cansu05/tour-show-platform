import type {Tour} from '@/types/tour';

export function buildTourImageSet(tour: Tour) {
  return Array.from(new Set([tour.coverImage, ...tour.gallery].filter(Boolean)));
}

export function getTourDetailFlags(tour: Tour) {
  const hasCampaignPrice = typeof tour.campaignPrice === 'number';
  const hasImportantNotes = tour.importantNotes.length > 0;
  const hasFreeChildRule =
    typeof tour.participantRules?.freeChildMinAge === 'number' &&
    typeof tour.participantRules?.freeChildMaxAge === 'number' &&
    !(
      tour.participantRules.freeChildMinAge === 0 &&
      tour.participantRules.freeChildMaxAge === 0
    );
  const hasChildRule =
    typeof tour.participantRules?.childMinAge === 'number' &&
    typeof tour.participantRules?.childMaxAge === 'number';

  return {
    hasCampaignPrice,
    hasImportantNotes,
    hasFreeChildRule,
    hasChildRule,
    pricingRows: Object.entries(tour.pricing.byRegion || {})
  };
}
