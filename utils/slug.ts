import {normalizeTurkishText} from '@/utils/normalize';

export function slugify(value: string): string {
  return normalizeTurkishText(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

