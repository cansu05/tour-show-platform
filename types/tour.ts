import type {TourCategory} from '@/constants/categories';

export type LocalizedText = {
  tr?: string;
  en?: string;
  de?: string;
};

export type Tour = {
  id: string;
  title: string;
  slug: string;
  keywords: string[];
  categories: TourCategory[];
  shortDescription: string;
  highlights: string[];
  includedServices: string[];
  duration?: string;
  priceText?: string;
  coverImage: string;
  gallery: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  localized?: {
    title?: LocalizedText;
    shortDescription?: LocalizedText;
    duration?: LocalizedText;
    priceText?: LocalizedText;
    keywords?: Record<string, string[]>;
    highlights?: Record<string, string[]>;
    includedServices?: Record<string, string[]>;
  };
};

export type TourDocument = Partial<Omit<Tour, 'id'>> & {
  id?: string;
};

