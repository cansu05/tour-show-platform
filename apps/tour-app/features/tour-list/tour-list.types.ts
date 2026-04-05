import type {Tour} from '@/types/tour';

export type TourListClientProps = {
  tours: Tour[];
};

export type TourListHeroProps = {
  title: string;
  subtitle: string;
};

export type TourListFeedbackState = {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
};
