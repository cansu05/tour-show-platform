import {getTranslations} from 'next-intl/server';
import type {AppLocale} from '@/constants/locales';
import {getCachedActiveTours} from '@/services/tour.server';
import {TourListClient} from '@/features/tour-list/TourListClient';
import {StateCard} from '@/components/common/StateCard';
import {localizeTours} from '@/utils/localize-tour';

type Props = {
  params: Promise<{locale: AppLocale}>;
};

export default async function LocaleHomePage({params}: Props) {
  const {locale} = await params;
  const tCommon = await getTranslations('common');

  try {
    const tours = await getCachedActiveTours();
    return <TourListClient tours={localizeTours(tours, locale)} />;
  } catch {
    return <StateCard title={tCommon('tourLoadError')} />;
  }
}
