export const TOUR_CATEGORIES = [
  'aile',
  'doğa',
  'deniz',
  'tarih',
  'macera',
  'günübirlik',
  'konaklamalı'
] as const;

export type TourCategory = (typeof TOUR_CATEGORIES)[number];

