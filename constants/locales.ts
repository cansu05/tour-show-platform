export const LOCALES = ['de', 'en', 'tr'] as const;
export const DEFAULT_LOCALE = 'de';

export type AppLocale = (typeof LOCALES)[number];

