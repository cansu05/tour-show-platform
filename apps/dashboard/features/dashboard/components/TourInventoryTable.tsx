'use client';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {formatDateTime} from '@/features/dashboard/admin-data';
import {LoadingLink} from '@/features/dashboard/components/LoadingLink';
import {Pill, SectionCard, StatusBadge} from '@/features/dashboard/components/admin-ui';
import type {TourInventoryTableProps} from '@/features/dashboard/tour-inventory.types';

const actionLinkClassName =
  'inline-flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-brand';

export function TourInventoryTable({
  items,
  onPreview
}: TourInventoryTableProps) {
  return (
    <SectionCard title="Tur listesi" action={<Pill>{items.length} sonuç</Pill>}>
      <div className="overflow-hidden rounded-[24px] border border-line">
        <div className="hidden grid-cols-[minmax(0,1.45fr)_0.6fr_0.9fr_0.9fr_1.05fr_1.05fr] gap-4 bg-panel-subtle px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted xl:grid">
          <span>Tur</span>
          <span>Durum</span>
          <span>Meta</span>
          <span>Kategoriler</span>
          <span>Son güncelleme</span>
          <span>Aksiyonlar</span>
        </div>
        <div className="divide-y divide-line">
          {items.map(({tour, health}) => (
            <div
              key={tour.id}
              className="grid gap-4 px-4 py-4 transition hover:bg-panel-subtle xl:grid-cols-[minmax(0,1.45fr)_0.6fr_0.9fr_0.9fr_1.05fr_1.05fr] xl:items-center"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium text-ink">{tour.title}</p>
                  <span className="rounded-full bg-panel-strong px-2 py-1 text-[11px] font-medium text-ink-soft">
                    /{tour.slug}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-ink-muted">
                  {tour.shortDescription || 'Kısa açıklama girilmemiş.'}
                </p>
              </div>
              <div>
                <StatusBadge status={health.status} />
              </div>
              <div className="space-y-1 text-sm text-ink-muted">
                <p>Transfer: {tour.hasTransfer ? 'Var' : 'Yok'}</p>
                <p>Yemek: {tour.hasMeal ? 'Var' : 'Yok'}</p>
                <p>Video: {tour.videoUrl ? 'Var' : 'Yok'}</p>
                <p>Galeri: {tour.gallery.length}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tour.categories.map((item) => (
                  <span
                    key={`${tour.id}-${item}`}
                    className="rounded-full border border-line bg-panel px-2.5 py-1 text-xs font-medium text-ink-soft"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="space-y-1 text-sm text-ink-muted">
                <p>{formatDateTime(tour.updatedAt)}</p>
                <p>%{health.completion} tamamlandı</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <button type="button" onClick={() => onPreview(tour)} className={actionLinkClassName}>
                  <VisibilityRoundedIcon sx={{fontSize: 18}} />
                  Önizle
                </button>
                <LoadingLink
                  href={`/tours/${tour.slug}/edit`}
                  loadingLabel="Tur açılıyor..."
                  className={actionLinkClassName}
                >
                  <EditRoundedIcon sx={{fontSize: 18}} />
                  Düzenle
                </LoadingLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
