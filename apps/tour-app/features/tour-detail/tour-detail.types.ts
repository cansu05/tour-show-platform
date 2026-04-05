import type {AppLocale} from '@/constants/locales';
import type {Tour} from '@/types/tour';

export type PublicTourDetailProps = {
  tour: Tour;
};

export type PublicTourDetailFeedbackState = {
  open: boolean;
  message: string;
  type: 'success' | 'error';
};

export type TourDetailListProps = {
  items: string[];
};

export type TourDetailSectionCardProps = {
  title: string;
  children: React.ReactNode;
  fullHeight?: boolean;
};

export type TourDetailSidebarProps = {
  tour: Tour;
  locale: AppLocale;
  shareTitle: string;
  campaignPriceLabel: string;
  startingFromLabel: string;
  priceOnRequestLabel: string;
  transferLabel: string;
  mealLabel: string;
  includedLabel: string;
  notIncludedLabel: string;
  onFeedback: (message: string, type: 'success' | 'error') => void;
};

export type TourMetaItemProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};
