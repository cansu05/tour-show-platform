import {StateCard} from '@/components/common/StateCard';
import {getTranslations} from 'next-intl/server';

export default async function TourNotFound() {
  const tTour = await getTranslations('tour');
  return <StateCard title={tTour('missingTour')} />;
}

