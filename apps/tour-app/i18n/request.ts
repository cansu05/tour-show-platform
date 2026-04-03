import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from '@/i18n/routing';

const NAMESPACES = ['common', 'home', 'tour', 'search', 'share'] as const;

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;
  const activeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

  const entries = await Promise.all(
    NAMESPACES.map(async (namespace) => {
      const mod = await import(`../messages/${activeLocale}/${namespace}.json`);
      return [namespace, mod.default];
    })
  );

  return {
    locale: activeLocale,
    messages: Object.fromEntries(entries)
  };
});

