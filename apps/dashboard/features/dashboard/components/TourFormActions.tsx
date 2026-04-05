'use client';

import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded';
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import {StickyFormActions, buttonClassName} from '@/features/dashboard/components/admin-ui';
import type {TourLifecycleStatus} from '@/features/dashboard/admin-data';

export function TourFormActions({
  actionHint,
  canPreview,
  canSaveDraft,
  canSubmitSelectedState,
  isSubmitting,
  submitIntent,
  publishState,
  onReset,
  onOpenPreview,
  onSaveDraft,
  onSaveSelectedState
}: {
  actionHint: string;
  canPreview: boolean;
  canSaveDraft: boolean;
  canSubmitSelectedState: boolean;
  isSubmitting: boolean;
  submitIntent: TourLifecycleStatus | null;
  publishState: TourLifecycleStatus;
  onReset: () => void;
  onOpenPreview: () => void;
  onSaveDraft: () => void;
  onSaveSelectedState: () => void;
}) {
  return (
    <StickyFormActions>
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink">Kaydetme akışı</p>
        <p className="text-sm text-ink-muted">{actionHint}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onReset} className={buttonClassName({variant: 'ghost'})} disabled={isSubmitting}>
          <RestartAltRoundedIcon sx={{fontSize: 18}} />
          Sıfırla
        </button>
        <button type="button" onClick={onOpenPreview} className={buttonClassName({variant: 'secondary'})} disabled={!canPreview || isSubmitting}>
          <PreviewRoundedIcon sx={{fontSize: 18}} />
          Önizle
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          className={buttonClassName({variant: 'secondary'})}
          disabled={!canSaveDraft || isSubmitting}
        >
          <DraftsRoundedIcon sx={{fontSize: 18}} />
          {isSubmitting && submitIntent === 'draft' ? 'Kaydediliyor...' : 'Taslak kaydet'}
        </button>
        <button
          type="button"
          onClick={onSaveSelectedState}
          className={buttonClassName({variant: 'primary'})}
          disabled={!canSubmitSelectedState || isSubmitting}
        >
          {publishState === 'active' ? <PublishRoundedIcon sx={{fontSize: 18}} /> : <AutoAwesomeRoundedIcon sx={{fontSize: 18}} />}
          {isSubmitting && submitIntent === publishState
            ? 'Kaydediliyor...'
            : publishState === 'active'
              ? 'Aktif kaydet'
              : publishState === 'passive'
                ? 'Pasif kaydet'
                : 'Seçili durumu kaydet'}
        </button>
      </div>
    </StickyFormActions>
  );
}
