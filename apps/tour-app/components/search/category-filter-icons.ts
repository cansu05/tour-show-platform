import type {AppLocale} from '@/constants/locales';
import {formatCategoryLabel} from '@/utils/tour-labels';
import {normalizeTurkishText} from '@/utils/normalize';

export const CATEGORY_ICON_ORDER = ['aile', 'doga', 'gunubirlik', 'konaklamali', 'macera', 'tarih'] as const;

export type CategoryIconKey = (typeof CATEGORY_ICON_ORDER)[number];

const ICON_COLORS: Record<CategoryIconKey, string> = {
  aile: '#2787D8',
  doga: '#13A56B',
  gunubirlik: '#FF9F1C',
  konaklamali: '#5B8DD6',
  macera: '#1785C7',
  tarih: '#C48A2C'
};

function compact(value: string) {
  return normalizeTurkishText(value).replace(/\s+/g, '');
}

export function getCategoryIconKey(category: string): CategoryIconKey | null {
  const value = `${compact(formatCategoryLabel(category, 'tr'))} ${compact(category)}`;

  if (value.includes('aile')) return 'aile';
  if (value.includes('doga') || value.includes('natur') || value.includes('nature')) return 'doga';
  if (value.includes('gunubirlik') || value.includes('gunluk') || value.includes('daily') || value.includes('tages')) {
    return 'gunubirlik';
  }
  if (value.includes('konaklamali') || value.includes('overnight') || value.includes('nacht')) return 'konaklamali';
  if (value.includes('macera') || value.includes('adventure') || value.includes('abenteuer')) return 'macera';
  if (value.includes('tarih') || value.includes('history') || value.includes('geschichte')) return 'tarih';

  return null;
}

export function getCategoryIconColor(category: string) {
  const key = getCategoryIconKey(category);
  return key ? ICON_COLORS[key] : '#0A77C8';
}

export function sortCategoriesForFilters(categories: string[], locale: AppLocale) {
  return [...categories].sort((left, right) => {
    const leftKey = getCategoryIconKey(left);
    const rightKey = getCategoryIconKey(right);
    const leftIndex = leftKey ? CATEGORY_ICON_ORDER.indexOf(leftKey) : -1;
    const rightIndex = rightKey ? CATEGORY_ICON_ORDER.indexOf(rightKey) : -1;

    if (leftIndex !== -1 || rightIndex !== -1) {
      return (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) - (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex);
    }

    return formatCategoryLabel(left, locale).localeCompare(formatCategoryLabel(right, locale), locale);
  });
}
