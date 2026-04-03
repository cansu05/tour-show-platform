import {getTranslations} from 'next-intl/server';
import {StateCard} from '@/components/common/StateCard';

export default async function LocaleNotFound() {
  const tCommon = await getTranslations('common');
  return <StateCard title={tCommon('pageNotFoundTitle')} description={tCommon('pageNotFoundDescription')} />;
}
