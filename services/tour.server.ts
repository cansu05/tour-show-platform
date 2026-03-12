import {unstable_cache} from 'next/cache';
import {APP_REVALIDATE_SECONDS} from '@/constants/app';
import {getActiveTours, getTourBySlug} from '@/services/tour.service';

const getActiveToursCached = unstable_cache(async () => getActiveTours(), ['active-tours'], {
  revalidate: APP_REVALIDATE_SECONDS
});

export async function getCachedActiveTours() {
  return getActiveToursCached();
}

export async function getCachedTourBySlug(slug: string) {
  const cachedFn = unstable_cache(async () => getTourBySlug(slug), ['tour-by-slug', slug], {
    revalidate: APP_REVALIDATE_SECONDS
  });

  return cachedFn();
}
