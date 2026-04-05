'use client';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import ViewAgendaRoundedIcon from '@mui/icons-material/ViewAgendaRounded';
import type {TourLifecycleStatus} from '@/features/dashboard/admin-data';
import {buttonClassName, cn, SectionCard, textInputClassName} from '@/features/dashboard/components/admin-ui';
import type {TourInventoryFiltersProps, TourInventorySortKey, TourInventoryViewMode} from '@/features/dashboard/tour-inventory.types';

export const STATUS_TABS: Array<{key: 'all' | TourLifecycleStatus; label: string}> = [
  {key: 'all', label: 'Tümü'},
  {key: 'active', label: 'Aktif'},
  {key: 'draft', label: 'Taslak'},
  {key: 'passive', label: 'Pasif'}
];

export function TourInventoryFilters({
  search,
  category,
  sortKey,
  viewMode,
  status,
  categories,
  counts,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onViewModeChange,
  onStatusChange
}: TourInventoryFiltersProps) {
  return (
    <SectionCard
      title="Filtreler ve görünüm"
      description="Arama, durum, kategori ve sıralama seçenekleriyle envanteri daha hızlı tarayın."
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.6fr))]">
          <label className="relative">
            <SearchRoundedIcon
              sx={{fontSize: 18}}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tur adı, slug veya açıklama içinde ara"
              className={cn(textInputClassName(), 'pl-11')}
            />
          </label>

          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className={textInputClassName()}
          >
            <option value="all">Tüm kategoriler</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={sortKey}
            onChange={(event) => onSortChange(event.target.value as TourInventorySortKey)}
            className={textInputClassName()}
          >
            <option value="updated-desc">Son güncellenen</option>
            <option value="updated-asc">İlk güncellenen</option>
            <option value="title-asc">Ada göre A-Z</option>
          </select>

          <div className="grid grid-cols-2 gap-2 rounded-[18px] border border-line bg-panel-subtle p-1">
            <button
              type="button"
              onClick={() => onViewModeChange('table' as TourInventoryViewMode)}
              className={cn(
                buttonClassName({
                  variant: viewMode === 'table' ? 'primary' : 'ghost',
                  size: 'sm'
                }),
                'w-full'
              )}
            >
              <TableRowsRoundedIcon sx={{fontSize: 18}} />
              Tablo
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards' as TourInventoryViewMode)}
              className={cn(
                buttonClassName({
                  variant: viewMode === 'cards' ? 'primary' : 'ghost',
                  size: 'sm'
                }),
                'w-full'
              )}
            >
              <ViewAgendaRoundedIcon sx={{fontSize: 18}} />
              Kart
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onStatusChange(tab.key)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                status === tab.key
                  ? 'bg-brand text-white shadow-[0_16px_28px_rgba(79,70,229,0.22)]'
                  : 'border border-line bg-panel text-ink-soft hover:bg-panel-subtle'
              )}
            >
              {tab.label} ({counts[tab.key]})
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
