import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PublicTourDetail} from '@/features/tour-detail/PublicTourDetail';
import {getCachedTourBySlug} from '@/services/tour.server';
import type {AppLocale} from '@/constants/locales';
import {localizeTour} from '@/utils/localize-tour';

type Props = {
  params: Promise<{locale: AppLocale; slug: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const tTour = await getTranslations('tour');
  const tCommon = await getTranslations('common');

  const tour = await getCachedTourBySlug(slug);
  if (!tour) {
    return {title: tTour('missingTour')};
  }

  const localizedTour = localizeTour(tour, locale);

  return {
    title: `${localizedTour.title} | ${tCommon('appName')}`,
    description: localizedTour.shortDescription,
    openGraph: {
      title: localizedTour.title,
      description: localizedTour.shortDescription,
      images: [localizedTour.coverImage],
      type: 'article'
    }
  };
}

export default async function TourDetailPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const tour = await getCachedTourBySlug(slug);
  if (!tour) {
    notFound();
  }

  return <PublicTourDetail tour={localizeTour(tour, locale)} />;
}
