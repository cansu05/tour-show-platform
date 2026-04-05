'use client';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {formatDateTime} from '@/features/dashboard/admin-data';
import {LoadingLink} from '@/features/dashboard/components/LoadingLink';
import {Pill, SectionCard, StatusBadge} from '@/features/dashboard/components/admin-ui';
import type {TourInventoryCardsProps} from '@/features/dashboard/tour-inventory.types';

const actionLinkClassName =
  'inline-flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-brand';

export function TourInventoryCards({
  items,
  onPreview
}: TourInventoryCardsProps) {
  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      {items.map(({tour, health}) => (
        <SectionCard
          key={tour.id}
          title={tour.title}
          description={tour.shortDescription || 'Kısa açıklama girilmemiş.'}
          compact
          action={<StatusBadge status={health.status} />}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Pill>/{tour.slug}</Pill>
              <Pill>Galeri {tour.gallery.length}</Pill>
              <Pill>Video {tour.videoUrl ? 'Var' : 'Yok'}</Pill>
              <Pill>Transfer {tour.hasTransfer ? 'Var' : 'Yok'}</Pill>
            </div>
            <div className="flex flex-wrap gap-2">
              {tour.categories.map((item) => (
                <span
                  key={`${tour.id}-${item}`}
                  className="rounded-full bg-panel-strong px-2.5 py-1 text-xs font-medium text-ink-soft"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm text-ink-muted">
              <span>Son güncelleme {formatDateTime(tour.updatedAt)}</span>
              <span>%{health.completion} tamamlandı</span>
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
        </SectionCard>
      ))}
    </div>
  );
}
