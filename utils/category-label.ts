import {normalizeTurkishText} from '@/utils/normalize';

export const CATEGORY_LABEL_KEYS = [
  'aile',
  'doga',
  'deniz',
  'tarih',
  'macera',
  'gunubirlik',
  'konaklamali'
] as const;

export type CategoryLabelKey = (typeof CATEGORY_LABEL_KEYS)[number];

export function toCategoryLabelKey(category: string): CategoryLabelKey | null {
  const normalized = normalizeTurkishText(category).replace(/[^a-z]/g, '');

  if (CATEGORY_LABEL_KEYS.includes(normalized as CategoryLabelKey)) {
    return normalized as CategoryLabelKey;
  }

  return null;
}
