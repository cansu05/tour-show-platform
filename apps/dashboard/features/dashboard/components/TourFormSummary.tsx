'use client';

import {Pill, SectionCard, StatusBadge} from '@/features/dashboard/components/admin-ui';
import {FORM_SECTIONS} from '@/features/dashboard/TourDashboardFormSections';

type TourFormSummaryProps = {
  completionCount: number;
  publishState: 'draft' | 'passive' | 'active';
  slug: string;
  validationErrorCount: number;
};

export function TourFormSummary({
  completionCount,
  publishState,
  slug,
  validationErrorCount
}: TourFormSummaryProps) {
  return (
    <SectionCard title="Form özeti" description="Bölüm ilerlemesini ve mevcut yayın modunu canlı olarak takip edin.">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[22px] border border-line bg-panel-subtle p-4">
          <p className="text-sm font-medium text-ink-muted">Tamamlanan bölümler</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink">
            {completionCount}/{FORM_SECTIONS.length}
          </p>
          <div className="mt-3 h-2 rounded-full bg-panel-strong">
            <div className="h-full rounded-full bg-brand" style={{width: `${(completionCount / FORM_SECTIONS.length) * 100}%`}} />
          </div>
        </div>
        <div className="rounded-[22px] border border-line bg-panel-subtle p-4">
          <p className="text-sm font-medium text-ink-muted">Yayın durumu</p>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={publishState} />
            <span className="text-sm text-ink-muted">
              {publishState === 'active'
                ? 'Aktif yayında'
                : publishState === 'passive'
                  ? 'Pasif beklemede'
                  : 'Taslak aşamasında'}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>Slug /{slug || '-'}</Pill>
            <Pill>{validationErrorCount} kritik kontrol</Pill>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
