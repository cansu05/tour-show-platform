import type {Tour} from '@/types/tour';
import type {getTourHealth, TourLifecycleStatus} from '@/features/dashboard/admin-data';

export type TourInventorySortKey = 'updated-desc' | 'updated-asc' | 'title-asc';
export type TourInventoryViewMode = 'table' | 'cards';

export type TourInventoryCounts = Record<'all' | TourLifecycleStatus, number>;

export type TourInventoryFiltersProps = {
  search: string;
  category: string;
  sortKey: TourInventorySortKey;
  viewMode: TourInventoryViewMode;
  status: 'all' | TourLifecycleStatus;
  categories: string[];
  counts: TourInventoryCounts;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: TourInventorySortKey) => void;
  onViewModeChange: (value: TourInventoryViewMode) => void;
  onStatusChange: (value: 'all' | TourLifecycleStatus) => void;
};

export type TourInventoryItem = {
  tour: Tour;
  health: ReturnType<typeof getTourHealth>;
};

export type TourInventoryTableProps = {
  items: TourInventoryItem[];
  onPreview: (tour: Tour) => void;
};

export type TourInventoryCardsProps = {
  items: TourInventoryItem[];
  onPreview: (tour: Tour) => void;
};
