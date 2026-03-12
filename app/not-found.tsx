import {getTranslations} from 'next-intl/server';
import {StateCard} from '@/components/common/StateCard';

export default async function GlobalNotFound() {
  const tCommon = await getTranslations('common');
  return <StateCard title={tCommon('pageNotFoundTitle')} description={tCommon('pageNotFoundDescription')} />;
}
