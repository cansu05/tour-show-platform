import type {AppLocale} from '@/constants/locales';

export function buildTourShareUrl(baseUrl: string, locale: AppLocale, slug: string): string {
  const safeBase = baseUrl.replace(/\/$/, '');
  return `${safeBase}/${locale}/tours/${slug}`;
}

export function buildWhatsAppShareUrl(text: string, url: string): string {
  const payload = `${text}\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(payload)}`;
}

