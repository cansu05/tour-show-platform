import type {Tour} from '@/types/tour';

export type TourListClientProps = {
  tours: Tour[];
};

export type TourListHeroProps = {
  activeQuickFilter: TourQuickFilter | null;
  onQuickFilterChange: (filter: TourQuickFilter) => void;
};

export type TourQuickFilter = 'today' | 'transfer' | 'family' | 'adventure' | 'economy';

export type TourListFeedbackState = {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
};
