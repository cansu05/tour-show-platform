'use client';

import type {ChangeEvent, DragEvent, KeyboardEvent, ReactNode} from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import MovieRoundedIcon from '@mui/icons-material/MovieRounded';
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import {TOUR_CATEGORIES, TOUR_DAYS, TOUR_REGIONS} from '@shared/index';
import {getTourHealth, type TourLifecycleStatus} from '@/features/dashboard/admin-data';
import {toDashboardMediaUrl, TourPreviewDialog, type TourPreviewData} from '@/features/dashboard/TourPreviewDialog';
import {cn, InputShell, Pill, SectionCard, StatusBadge, StickyFormActions, buttonClassName, textInputClassName} from '@/features/dashboard/components/admin-ui';
import {
  buildTourDocumentFromDashboardInput,
  DASHBOARD_INITIAL_FORM,
  normalizeDashboardSlug,
  type DashboardTourInput
} from '@/features/dashboard/tour-form-data';

type SubmitState = {
  type: 'success' | 'error';
  message: string;
} | null;

type UploadResult = {
  coverImage: string;
  gallery: string[];
  videoUrl: string;
};

type SectionConfig = {
  id: string;
  title: string;
  description: string;
};

type GalleryMediaItem =
  | {id: string; kind: 'existing'; url: string}
  | {id: string; kind: 'new'; file: File};

const FORM_SECTIONS: SectionConfig[] = [
  {id: 'basic', title: 'Temel Bilgiler', description: 'Başlık, slug ve giriş metinleri.'},
  {id: 'classification', title: 'Kategoriler ve Konumlama', description: 'Turun yerleştiği kategori grupları.'},
  {id: 'content', title: 'İçerik Bilgileri', description: 'Açıklama, anahtar kelimeler ve hazırlık listeleri.'},
  {id: 'services', title: 'Hizmet Özellikleri', description: 'Transfer, yemek ve medya özellikleri.'},
  {id: 'pricing', title: 'Fiyatlandırma', description: 'Bölge bazlı fiyat ve gün kurgusu.'},
  {id: 'rules', title: 'Katılımcı Kuralları', description: 'Yaş ve çocuk aralıkları.'},
  {id: 'media', title: 'Medya', description: 'Kapak, galeri ve video yükleme alanı.'},
  {id: 'publish', title: 'Yayın Ayarları', description: 'Taslak, pasif ve aktif durumlar.'}
];

function createExistingGalleryItems(urls: string[]): GalleryMediaItem[] {
  return urls.map((url, index) => ({id: `existing-${index}-${url}`, kind: 'existing', url}));
}

function createNewGalleryItems(files: File[]): GalleryMediaItem[] {
  return files.map((file, index) => ({
    id: `new-${Date.now()}-${index}-${file.name}-${file.size}`,
    kind: 'new',
    file
  }));
}

function moveArrayItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) return items;

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function getValidationErrors(form: DashboardTourInput, options?: {coverFile?: File | null; galleryCount?: number; publishState?: TourLifecycleStatus}) {
  const errors: Record<string, string> = {};
  const publishState = options?.publishState ?? form.publishState;
  const isDraft = publishState === 'draft';
  const hasGalleryImage = (options?.galleryCount ?? splitMediaLines(form.gallery).length) > 0;
  const hasCoverImage = Boolean(form.coverImage.trim() || options?.coverFile || hasGalleryImage);

  if (!form.title.trim()) errors.title = 'Tur ad? zorunlu.';
  if (!normalizeDashboardSlug(form.slug || form.title)) errors.slug = 'Ge?erli bir slug ?retilemedi.';
  if (!isDraft && !form.shortDescription.trim()) errors.shortDescription = 'K?sa a??klama zorunlu.';
  if (!isDraft && !form.description.trim()) errors.description = 'Detayl? a??klama zorunlu.';
  if (!isDraft && form.categories.length === 0) errors.categories = 'En az bir kategori se?in.';
  if (!isDraft && !hasCoverImage) errors.coverImage = 'Kapak g?rseli ekleyin veya en az bir galeri g?rseli y?kleyin.';

  const hasRegionData = Object.values(form.regions).some((region) => region.enabled && (region.adultPrice.trim() || region.childPrice.trim() || region.availableDays.length > 0));
  if (!isDraft && !hasRegionData) errors.regions = 'En az bir b?lge i?in fiyat veya g?n bilgisi girin.';

  return errors;
}

function getSectionStatus(sectionId: string, form: DashboardTourInput, options?: {galleryCount?: number; hasCoverFile?: boolean}) {
  switch (sectionId) {
    case 'basic':
      return form.title.trim() && form.shortDescription.trim() ? 'complete' : 'pending';
    case 'classification':
      return form.categories.length > 0 ? 'complete' : 'pending';
    case 'content':
      return form.description.trim() ? 'complete' : 'pending';
    case 'services':
      return form.hasTransfer || form.hasMeal ? 'complete' : 'pending';
    case 'pricing':
      return Object.values(form.regions).some((region) => region.enabled && region.adultPrice.trim()) ? 'complete' : 'pending';
    case 'rules':
      return form.participantRules.childMaxAge.trim() ? 'complete' : 'pending';
    case 'media':
      return form.coverImage.trim() || options?.hasCoverFile || (options?.galleryCount ?? splitMediaLines(form.gallery).length) > 0 ? 'complete' : 'pending';
    case 'publish':
      return form.publishState ? 'complete' : 'pending';
    default:
      return 'pending';
  }
}

function StepNavigation({
  activeSection,
  form,
  galleryCount,
  hasCoverFile
}: {
  activeSection: string;
  form: DashboardTourInput;
  galleryCount: number;
  hasCoverFile: boolean;
}) {
  return (
    <aside className="sticky top-6 hidden self-start xl:block xl:w-[280px]">
      <div className="rounded-[28px] border border-line bg-panel p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">İçerik Akışı</p>
          <h3 className="text-lg font-semibold text-ink">Tur oluşturma adımları</h3>
        </div>
        <div className="space-y-2">
          {FORM_SECTIONS.map((section, index) => {
            const completed = getSectionStatus(section.id, form, {galleryCount, hasCoverFile}) === 'complete';
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  'flex items-start gap-3 rounded-[20px] px-3 py-3 transition',
                  activeSection === section.id ? 'bg-brand-soft text-brand-strong' : 'hover:bg-panel-subtle'
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-xs font-semibold',
                    completed ? 'bg-brand text-white' : activeSection === section.id ? 'bg-white text-brand-strong' : 'bg-panel-subtle text-ink-muted'
                  )}
                >
                  {completed ? <CheckRoundedIcon sx={{fontSize: 16}} /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink">{section.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-ink-muted">{section.description}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function splitMediaLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildFormPreviewData({
  form,
  coverPreviewUrl,
  galleryPreviewUrls,
  videoPreviewUrl
}: {
  form: DashboardTourInput;
  coverPreviewUrl?: string;
  galleryPreviewUrls: string[];
  videoPreviewUrl?: string;
}): TourPreviewData {
  const slug = normalizeDashboardSlug(form.slug || form.title) || 'taslak-tur';
  const gallery = galleryPreviewUrls.length > 0 ? galleryPreviewUrls : splitMediaLines(form.gallery);
  const coverImage = coverPreviewUrl || gallery[0] || form.coverImage || '';
  const byRegion = Object.entries(form.regions).reduce<Record<string, {adultPrice?: number; childPrice?: number; availableDays?: string[]}>>(
    (acc, [regionKey, region]) => {
      if (!region.enabled) return acc;

      const adultPrice = region.adultPrice.trim() ? Number(region.adultPrice) : undefined;
      const childPrice = region.childPrice.trim() ? Number(region.childPrice) : undefined;
      const availableDays = region.availableDays.filter(Boolean);

      if (adultPrice === undefined && childPrice === undefined && availableDays.length === 0) {
        return acc;
      }

      acc[regionKey] = {adultPrice, childPrice, availableDays};
      return acc;
    },
    {}
  );

  const health = getTourHealth({
    id: 'preview',
    slug,
    isActive: form.publishState === 'active',
    categories: form.categories,
    hasTransfer: form.hasTransfer,
    hasMeal: form.hasMeal,
    campaignPrice: form.campaignPrice.trim() ? Number(form.campaignPrice) : undefined,
    pricing: {currency: form.currency || 'EUR', byRegion},
    participantRules: {
      freeChildMinAge: form.participantRules.freeChildMinAge.trim() ? Number(form.participantRules.freeChildMinAge) : undefined,
      freeChildMaxAge: form.participantRules.freeChildMaxAge.trim() ? Number(form.participantRules.freeChildMaxAge) : undefined,
      childMinAge: form.participantRules.childMinAge.trim() ? Number(form.participantRules.childMinAge) : undefined,
      childMaxAge: form.participantRules.childMaxAge.trim() ? Number(form.participantRules.childMaxAge) : undefined
    },
    coverImage,
    gallery,
    videoUrl: videoPreviewUrl || form.videoUrl || undefined,
    localized: undefined,
    title: form.title || 'İsimsiz tur',
    shortDescription: form.shortDescription,
    description: form.description,
    thingsToBring: form.thingsToBring,
    importantNotes: form.importantNotes,
    priceText: undefined,
    keywords: form.keywords,
    createdAt: '',
    updatedAt: ''
  });

  return {
    title: form.title || 'İsimsiz tur',
    slug,
    categories: form.categories,
    shortDescription: form.shortDescription,
    hasTransfer: form.hasTransfer,
    hasMeal: form.hasMeal,
    videoUrl: videoPreviewUrl || form.videoUrl || undefined,
    coverImage,
    gallery,
    updatedAt: undefined,
    isActive: form.publishState === 'active',
    status: health.status,
    completion: health.completion,
    currency: form.currency || 'EUR',
    pricingByRegion: Object.entries(byRegion).map(([regionKey, value]) => ({
      regionKey,
      adultPrice: value.adultPrice,
      childPrice: value.childPrice,
      availableDays: value.availableDays || []
    }))
  };
}

function ToggleCard({active, title, description, onClick}: {active: boolean; title: string; description: string; onClick: () => void}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-[22px] border p-4 text-left transition',
        active ? 'border-brand/30 bg-brand-soft shadow-[0_16px_28px_rgba(79,70,229,0.10)]' : 'border-line bg-panel hover:border-line-strong hover:bg-panel-subtle'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-ink">{title}</h4>
          <p className="mt-1 text-sm leading-6 text-ink-muted">{description}</p>
        </div>
        <span className={cn('mt-1 flex h-5 w-5 items-center justify-center rounded-full border', active ? 'border-brand bg-brand text-white' : 'border-line')} />
      </div>
    </button>
  );
}

function ListEditor({
  title,
  placeholder,
  hint,
  items,
  draft,
  onDraftChange,
  onAdd,
  onRemove
}: {
  title: string;
  placeholder: string;
  hint?: string;
  items: string[];
  draft: string;
  onDraftChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-ink">{title}</h4>
        {hint ? <p className="text-xs leading-5 text-ink-muted">{hint}</p> : null}
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <input value={draft} onChange={(event) => onDraftChange(event.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} className={textInputClassName()} />
        <button type="button" onClick={onAdd} className={buttonClassName({variant: 'secondary'})}>
          <AddRoundedIcon sx={{fontSize: 18}} />
          Ekle
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-line bg-panel-subtle px-3 py-2 text-sm text-ink-soft">
            {item}
            <button type="button" onClick={() => onRemove(index)} className="rounded-full text-ink-muted transition hover:text-danger-strong">
              <DeleteOutlineRoundedIcon sx={{fontSize: 16}} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function MediaPreviewStrip({type, urls}: {type: 'image' | 'video'; urls: string[]}) {
  if (urls.length === 0) return null;
  const resolvedUrls = urls.map((url) => toDashboardMediaUrl(url));

  return (
    <div className="rounded-[20px] border border-line bg-white p-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Onizleme</p>
      <div className={cn('grid gap-3', urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2 xl:grid-cols-3')}>
        {resolvedUrls.map((url, index) => (
          <div key={`${url}-${index}`} className="overflow-hidden rounded-[18px] border border-line bg-panel-subtle">
            {type === 'image' ? (
              <img src={url} alt={`Medya onizleme ${index + 1}`} className="h-32 w-full object-cover" />
            ) : (
              <video src={url} controls className="h-32 w-full bg-black object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaUploader({
  title,
  description,
  accept,
  multiple = false,
  files,
  existingItems = [],
  previewUrls = [],
  previewType = 'image',
  orderedItems = [],
  icon,
  onChange,
  onRemove,
  onRemoveExisting,
  onMoveOrderedItem,
  onRemoveOrderedItem
}: {
  title: string;
  description: string;
  accept: string;
  multiple?: boolean;
  files: File[];
  existingItems?: string[];
  previewUrls?: string[];
  previewType?: 'image' | 'video';
  orderedItems?: Array<{id: string; label: string; badge?: string}>;
  icon: ReactNode;
  onChange: (files: File[]) => void;
  onRemove: (index: number) => void;
  onRemoveExisting?: (index: number) => void;
  onMoveOrderedItem?: (fromIndex: number, toIndex: number) => void;
  onRemoveOrderedItem?: (index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    onChange(Array.from(event.dataTransfer.files || []));
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Array.from(event.target.files || []));
    event.target.value = '';
  };

  const handleRemove = (index: number) => {
    onRemove(index);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3 rounded-[24px] border border-line bg-panel-subtle p-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-brand-soft text-brand-strong">{icon}</div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-ink">{title}</h4>
              <p className="text-sm leading-6 text-ink-muted">{description}</p>
            </div>
          </div>
          <label
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-line-strong bg-white px-4 py-8 text-center transition hover:border-brand/40 hover:bg-brand-soft/30"
          >
            <CloudUploadRoundedIcon sx={{fontSize: 22}} className="text-brand" />
            <span className="text-sm font-medium text-ink">Dosya sec veya surukleyip birak</span>
            <span className="text-xs text-ink-muted">{multiple ? 'Birden fazla dosya desteklenir' : 'Tek dosya yuklenir'}</span>
            <input ref={inputRef} hidden type="file" accept={accept} multiple={multiple} onChange={handleInputChange} />
          </label>
          {orderedItems.length > 0 ? (
            <div className="space-y-2">
              {orderedItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 rounded-[18px] border border-line bg-white px-3 py-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-ink">{item.label}</span>
                    {item.badge ? <span className="mt-1 inline-flex rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand-strong">{item.badge}</span> : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onMoveOrderedItem?.(index, index - 1)}
                      disabled={index === 0}
                      className="rounded-full p-1 text-ink-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowUpwardRoundedIcon sx={{fontSize: 18}} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveOrderedItem?.(index, index + 1)}
                      disabled={index === orderedItems.length - 1}
                      className="rounded-full p-1 text-ink-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowDownwardRoundedIcon sx={{fontSize: 18}} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveOrderedItem?.(index)}
                      className="rounded-full p-1 text-ink-muted transition hover:text-danger-strong"
                    >
                      <DeleteOutlineRoundedIcon sx={{fontSize: 18}} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between rounded-[18px] border border-line bg-white px-3 py-2 text-sm">
                  <span className="truncate text-ink">{file.name}</span>
                  <button type="button" onClick={() => handleRemove(index)} className="rounded-full text-ink-muted transition hover:text-danger-strong">
                    <DeleteOutlineRoundedIcon sx={{fontSize: 18}} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          {existingItems.length > 0 ? (
            <div className="space-y-2">
              {existingItems.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center justify-between rounded-[18px] border border-line bg-white px-3 py-2 text-sm">
                  <span className="truncate text-ink">{item}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveExisting?.(index)}
                    className="rounded-full text-ink-muted transition hover:text-danger-strong"
                  >
                    <DeleteOutlineRoundedIcon sx={{fontSize: 18}} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <MediaPreviewStrip type={previewType} urls={previewUrls} />
      </div>
    </div>
  );
}

export function TourDashboardForm({
  initialData = DASHBOARD_INITIAL_FORM,
  mode = 'create',
  originalSlug
}: {
  initialData?: DashboardTourInput;
  mode?: 'create' | 'edit';
  originalSlug?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<DashboardTourInput>(initialData);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryMediaItem[]>(() => createExistingGalleryItems(splitMediaLines(initialData.gallery)));
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [keywordsDraft, setKeywordsDraft] = useState('');
  const [thingsDraft, setThingsDraft] = useState('');
  const [notesDraft, setNotesDraft] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState(FORM_SECTIONS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitIntent, setSubmitIntent] = useState<TourLifecycleStatus | 'redirect' | null>(null);
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData.slug));

  useEffect(() => {
    const observers = FORM_SECTIONS.map((section) => {
      const element = document.getElementById(section.id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id);
          }
        },
        {rootMargin: '-20% 0px -60% 0px', threshold: 0.1}
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const coverPreviewUrl = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : ''), [coverFile]);
  const galleryFiles = useMemo(() => galleryItems.flatMap((item) => (item.kind === 'new' ? [item.file] : [])), [galleryItems]);
  const galleryPreviewUrls = useMemo(
    () => galleryItems.map((item) => (item.kind === 'new' ? URL.createObjectURL(item.file) : item.url)),
    [galleryItems]
  );
  const videoPreviewUrl = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : ''), [videoFile]);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      galleryPreviewUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [coverPreviewUrl, galleryPreviewUrls, videoPreviewUrl]);

  useEffect(() => {
    const nextGallery = galleryItems.flatMap((item) => (item.kind === 'existing' ? [item.url] : [])).join('\n');
    setForm((current) => (current.gallery === nextGallery ? current : {...current, gallery: nextGallery}));
  }, [galleryItems]);

  const validationSummary = useMemo(() => getValidationErrors(form, {coverFile, galleryCount: galleryItems.length}), [coverFile, form, galleryItems.length]);
  const draftValidationSummary = useMemo(
    () => getValidationErrors(form, {coverFile, galleryCount: galleryItems.length, publishState: 'draft'}),
    [coverFile, form, galleryItems.length]
  );
  const selectedPublishValidationSummary = useMemo(
    () => getValidationErrors(form, {coverFile, galleryCount: galleryItems.length, publishState: form.publishState}),
    [coverFile, form, galleryItems.length]
  );
  const completionCount = useMemo(
    () =>
      FORM_SECTIONS.filter((section) => getSectionStatus(section.id, form, {galleryCount: galleryItems.length, hasCoverFile: Boolean(coverFile)}) === 'complete')
        .length,
    [coverFile, form, galleryItems.length]
  );
  const previewData = useMemo(
    () =>
      buildFormPreviewData({
        form,
        coverPreviewUrl,
        galleryPreviewUrls,
        videoPreviewUrl
      }),
    [coverPreviewUrl, form, galleryPreviewUrls, videoPreviewUrl]
  );
  const canPreview = Boolean(normalizeDashboardSlug(form.slug || form.title));
  const canSaveDraft = Object.keys(draftValidationSummary).length === 0;
  const canSubmitSelectedState = Object.keys(selectedPublishValidationSummary).length === 0;
  const actionHint = !canPreview
    ? 'Önizleme için önce tur adı girin.'
    : !canSaveDraft
      ? 'Taslak için gerekli alanları tamamlayın.'
      : !canSubmitSelectedState
        ? 'Seçili yayın durumu için eksik alanları tamamlayın.'
        : Object.keys(validationSummary).length === 0
          ? 'Kayda hazır görünüyor.'
          : `${Object.keys(validationSummary).length} alan kontrol bekliyor.`;

  const updateField = <K extends keyof DashboardTourInput>(key: K, value: DashboardTourInput[K]) => {
    setForm((current) => ({...current, [key]: value}));
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setForm((current) => ({
      ...current,
      title,
      slug: slugEdited ? current.slug : normalizeDashboardSlug(title)
    }));
  };

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true);
    updateField('slug', normalizeDashboardSlug(event.target.value));
  };

  const toggleCategory = (category: string) => {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((entry) => entry !== category)
        : [...current.categories, category]
    }));
  };

  const updateParticipantRule = (key: keyof DashboardTourInput['participantRules'], value: string) => {
    setForm((current) => ({
      ...current,
      participantRules: {
        ...current.participantRules,
        [key]: value
      }
    }));
  };

  const updateRegion = (regionKey: string, patch: Partial<DashboardTourInput['regions'][string]>) => {
    setForm((current) => ({
      ...current,
      regions: {
        ...current.regions,
        [regionKey]: {
          ...current.regions[regionKey],
          ...patch
        }
      }
    }));
  };

  const toggleRegionDay = (regionKey: string, dayKey: string) => {
    const region = form.regions[regionKey];
    const nextDays = region.availableDays.includes(dayKey)
      ? region.availableDays.filter((entry) => entry !== dayKey)
      : [...region.availableDays, dayKey];
    updateRegion(regionKey, {availableDays: nextDays});
  };

  const addListItem = (field: 'keywords' | 'thingsToBring' | 'importantNotes', draft: string, clearDraft: () => void) => {
    const value = draft.trim();
    if (!value) return;

    setForm((current) => ({
      ...current,
      [field]: [...current[field], value]
    }));
    clearDraft();
  };

  const removeListItem = (field: 'keywords' | 'thingsToBring' | 'importantNotes', index: number) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const removeExistingCoverImage = () => {
    setForm((current) => ({...current, coverImage: ''}));
  };

  const removeExistingVideo = () => {
    setForm((current) => ({...current, videoUrl: ''}));
  };

  const appendGalleryFiles = (files: File[]) => {
    if (files.length === 0) return;
    setGalleryItems((current) => [...current, ...createNewGalleryItems(files)]);
  };

  const moveGalleryItem = (fromIndex: number, toIndex: number) => {
    setGalleryItems((current) => moveArrayItem(current, fromIndex, toIndex));
  };

  const removeGalleryItem = (index: number) => {
    setGalleryItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const resetForm = () => {
    setForm(initialData);
    setCoverFile(null);
    setGalleryItems(createExistingGalleryItems(splitMediaLines(initialData.gallery)));
    setVideoFile(null);
    setKeywordsDraft('');
    setThingsDraft('');
    setNotesDraft('');
    setSubmitState(null);
    setValidationErrors({});
    setSlugEdited(Boolean(initialData.slug));
  };

  const uploadBatch = async (slug: string, kind: 'cover' | 'gallery' | 'video', files: File[]) => {
    const formData = new FormData();
    formData.append('slug', slug);
    formData.append('kind', kind);
    files.forEach((file) => formData.append('files', file));

    const response = await fetch('/api/dashboard/uploads', {method: 'POST', body: formData});
    const data = (await response.json()) as {files?: string[]; message?: string};

    if (!response.ok || !data.files?.length) {
      throw new Error(data.message || 'Dosya yüklenemedi.');
    }

    return data.files;
  };

  const uploadFiles = async (slug: string): Promise<UploadResult> => {
    const result: UploadResult = {
      coverImage: form.coverImage,
      gallery: [],
      videoUrl: form.videoUrl
    };

    if (coverFile) result.coverImage = (await uploadBatch(slug, 'cover', [coverFile]))[0];
    const uploadedGallery = galleryFiles.length > 0 ? await uploadBatch(slug, 'gallery', galleryFiles) : [];
    let uploadedGalleryIndex = 0;
    result.gallery = galleryItems.flatMap((item) => {
      if (item.kind === 'existing') return item.url ? [item.url] : [];

      const uploadedUrl = uploadedGallery[uploadedGalleryIndex++];
      return uploadedUrl ? [uploadedUrl] : [];
    });
    if (!coverFile && result.gallery.length > 0) {
      result.coverImage = result.gallery[0];
    }
    if (videoFile) result.videoUrl = (await uploadBatch(slug, 'video', [videoFile]))[0];

    return result;
  };

  const runSubmit = (publishState: TourLifecycleStatus) => {
    const nextForm = {...form, publishState};
    const nextErrors = getValidationErrors(nextForm, {coverFile, galleryCount: galleryItems.length, publishState});
    setValidationErrors(nextErrors);
    setSubmitState(null);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState({type: 'error', message: 'Kaydetmeden ?nce zorunlu alanlar? tamamlay?n.'});
      return;
    }

    void (async () => {
      setIsSubmitting(true);
      setSubmitIntent(publishState);

      try {
        const normalizedSlug = normalizeDashboardSlug(nextForm.slug || nextForm.title);
        const uploaded = await uploadFiles(normalizedSlug);
        const payload = buildTourDocumentFromDashboardInput({
          ...nextForm,
          slug: normalizedSlug,
          coverImage: uploaded.coverImage,
          gallery: uploaded.gallery.join('\n'),
          videoUrl: uploaded.videoUrl
        });

        const endpoint = mode === 'edit' && originalSlug ? `/api/dashboard/tours/${originalSlug}` : '/api/dashboard/tours';
        const method = mode === 'edit' ? 'PUT' : 'POST';
        const response = await fetch(endpoint, {
          method,
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        });

        const result = (await response.json().catch(() => null)) as {message?: string; slug?: string} | null;
        if (!response.ok) {
          setSubmitState({type: 'error', message: result?.message || 'Tur kaydedilemedi.'});
          return;
        }

        setForm((current) => ({...current, publishState}));
        setSubmitState({
          type: 'success',
          message:
            result?.message ||
            (publishState === 'active'
              ? 'Tur yayın akışına alındı.'
              : publishState === 'draft'
                ? 'Taslak kaydedildi.'
                : 'Tur pasif durumda kaydedildi.')
        });

        router.push('/tours');
        router.refresh();
      } catch (error) {
        setSubmitState({type: 'error', message: error instanceof Error ? error.message : '??lem tamamlanamad?.'});
      } finally {
        setIsSubmitting(false);
        setSubmitIntent(null);
      }
    })();
  };

  const openPreview = () => {
    const slug = normalizeDashboardSlug(form.slug || form.title);
    if (!slug) {
      setSubmitState({type: 'error', message: 'Önizleme için önce tur adı veya slug girin.'});
      return;
    }

    setIsPreviewOpen(true);
  };

  const currentGalleryCount = form.gallery.split(/\r?\n/).filter(Boolean).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <StepNavigation activeSection={activeSection} form={form} galleryCount={galleryItems.length} hasCoverFile={Boolean(coverFile)} />

      <div className="space-y-6">
        {submitState ? (
          <div className={cn('rounded-[22px] border px-4 py-3 text-sm', submitState.type === 'success' ? 'border-[color:var(--success-soft)] bg-[color:var(--success-soft)] text-success-strong' : 'border-[color:var(--danger-soft)] bg-[color:var(--danger-soft)] text-danger-strong')}>
            {submitState.message}
          </div>
        ) : null}

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
                <StatusBadge status={form.publishState} />
                <span className="text-sm text-ink-muted">{form.publishState === 'active' ? 'Aktif yayında' : form.publishState === 'passive' ? 'Pasif beklemede' : 'Taslak aşamasında'}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill>Slug /{normalizeDashboardSlug(form.slug || form.title) || '-'}</Pill>
                <Pill>{Object.keys(validationSummary).length} kritik kontrol</Pill>
              </div>
            </div>
          </div>
        </SectionCard>

        <section id="basic" className="scroll-mt-24">
          <SectionCard title="Temel Bilgiler" description="Turun başlık yapısı ve giriş metinleri bu bölümde belirlenir.">
            <div className="grid gap-4 lg:grid-cols-2">
              <InputShell label="Tur adı" error={validationErrors.title}>
                <input value={form.title} onChange={handleTitleChange} placeholder="Örn. Antalya Tekne Turu" className={textInputClassName(Boolean(validationErrors.title))} />
              </InputShell>
              <InputShell label="Slug" hint="Boş bırakırsanız tur adına göre otomatik üretilir." error={validationErrors.slug}>
                <input value={form.slug} onChange={handleSlugChange} placeholder="antalya-tekne-turu" className={textInputClassName(Boolean(validationErrors.slug))} />
              </InputShell>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <InputShell label="Kısa açıklama" hint="Liste ekranı ve kartlarda görünen kısa özet." error={validationErrors.shortDescription}>
                <textarea value={form.shortDescription} onChange={(event) => updateField('shortDescription', event.target.value)} rows={3} className={textInputClassName(Boolean(validationErrors.shortDescription))} />
              </InputShell>
              <InputShell label="Detaylı açıklama" hint="Turun ana anlatısı. Satış metni değil, net içerik özeti." error={validationErrors.description}>
                <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows={7} className={textInputClassName(Boolean(validationErrors.description))} />
              </InputShell>
            </div>
          </SectionCard>
        </section>

        <section id="classification" className="scroll-mt-24">
          <SectionCard title="Kategoriler ve Konumlama" description="Turun keşif ve filtreleme sistemindeki yerini belirleyin.">
            <div className="flex flex-wrap gap-3">
              {TOUR_CATEGORIES.map((category) => {
                const active = form.categories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition',
                      active ? 'bg-brand text-white shadow-[0_14px_24px_rgba(79,70,229,0.18)]' : 'border border-line bg-panel text-ink-soft hover:bg-panel-subtle'
                    )}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
            {validationErrors.categories ? <p className="text-sm font-medium text-danger-strong">{validationErrors.categories}</p> : null}
          </SectionCard>
        </section>

        <section id="content" className="scroll-mt-24">
          <SectionCard title="İçerik Bilgileri" description="SEO ve operasyon açısından destekleyici içerik alanlarını düzenleyin.">
            <div className="space-y-6">
              <ListEditor
                title="Anahtar kelimeler"
                hint="Arama ve keşif akışı için kısa etiketler ekleyin."
                placeholder="Örn. tekne turu"
                items={form.keywords}
                draft={keywordsDraft}
                onDraftChange={setKeywordsDraft}
                onAdd={() => addListItem('keywords', keywordsDraft, () => setKeywordsDraft(''))}
                onRemove={(index) => removeListItem('keywords', index)}
              />
              <ListEditor
                title="Yanınıza alacaklarınız"
                hint="Katılımcının tur öncesinde bilmesi gereken hazırlık öğeleri."
                placeholder="Örn. havlu"
                items={form.thingsToBring}
                draft={thingsDraft}
                onDraftChange={setThingsDraft}
                onAdd={() => addListItem('thingsToBring', thingsDraft, () => setThingsDraft(''))}
                onRemove={(index) => removeListItem('thingsToBring', index)}
              />
              <ListEditor
                title="Önemli notlar"
                hint="Rezervasyon veya katılım sırasında kritik olan kısa notlar."
                placeholder="Örn. pasaport zorunludur"
                items={form.importantNotes}
                draft={notesDraft}
                onDraftChange={setNotesDraft}
                onAdd={() => addListItem('importantNotes', notesDraft, () => setNotesDraft(''))}
                onRemove={(index) => removeListItem('importantNotes', index)}
              />
            </div>
          </SectionCard>
        </section>

        <section id="services" className="scroll-mt-24">
          <SectionCard title="Hizmet Özellikleri" description="Turun operasyonel özelliklerini görsel olarak açık ve düzenli şekilde seçin.">
            <div className="grid gap-3 lg:grid-cols-2">
              <ToggleCard active={form.hasTransfer} onClick={() => updateField('hasTransfer', !form.hasTransfer)} title="Transfer dahil" description="Karşılama ve ulaşım hizmeti sunuluyor." />
              <ToggleCard active={form.hasMeal} onClick={() => updateField('hasMeal', !form.hasMeal)} title="Yemek dahil" description="Tur paketine yemek veya ikram dahil." />
            </div>
          </SectionCard>
        </section>

        <section id="pricing" className="scroll-mt-24">
          <SectionCard title="Fiyatlandırma" description="Bölge bazlı fiyatları ve uygun günleri aynı yerde yönetin.">
            <div className="grid gap-4 lg:grid-cols-[0.35fr_0.35fr_1fr]">
              <InputShell label="Para birimi">
                <input value={form.currency} onChange={(event) => updateField('currency', event.target.value)} className={textInputClassName()} />
              </InputShell>
              <InputShell label="Kampanya fiyatı">
                <input value={form.campaignPrice} onChange={(event) => updateField('campaignPrice', event.target.value)} placeholder="Opsiyonel" className={textInputClassName()} />
              </InputShell>
              <div className="rounded-[20px] border border-line bg-panel-subtle px-4 py-3 text-sm text-ink-muted">Bölgesel fiyatlar boş bırakılırsa kayıt taslak kabul edilir. En az bir bölgede yetişkin fiyatı veya uygun gün bilgisi girin.</div>
            </div>
            {validationErrors.regions ? <p className="text-sm font-medium text-danger-strong">{validationErrors.regions}</p> : null}
            <div className="space-y-4">
              {TOUR_REGIONS.map((region) => {
                const value = form.regions[region.key];
                return (
                  <div key={region.key} className="rounded-[24px] border border-line bg-panel-subtle p-4">
                    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-ink">{region.label}</h4>
                        <p className="text-sm text-ink-muted">Bu bölge için fiyat ve haftalık uygunluk yapılandırması.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateRegion(region.key, {enabled: !value.enabled})}
                        className={cn(buttonClassName({variant: value.enabled ? 'primary' : 'secondary', size: 'sm'}), 'w-full lg:w-auto')}
                      >
                        {value.enabled ? 'Bölge aktif' : 'Bölge kapalı'}
                      </button>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      <InputShell label="Yetişkin fiyatı">
                        <input disabled={!value.enabled} value={value.adultPrice} onChange={(event) => updateRegion(region.key, {adultPrice: event.target.value})} className={textInputClassName()} />
                      </InputShell>
                      <InputShell label="Çocuk fiyatı">
                        <input disabled={!value.enabled} value={value.childPrice} onChange={(event) => updateRegion(region.key, {childPrice: event.target.value})} className={textInputClassName()} />
                      </InputShell>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {TOUR_DAYS.map((day) => {
                        const selected = value.availableDays.includes(day.key);
                        return (
                          <button
                            key={day.key}
                            type="button"
                            disabled={!value.enabled}
                            onClick={() => toggleRegionDay(region.key, day.key)}
                            className={cn(
                              'rounded-full px-3 py-2 text-xs font-medium transition',
                              selected ? 'bg-brand text-white' : 'border border-line bg-white text-ink-soft',
                              !value.enabled && 'cursor-not-allowed opacity-50'
                            )}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </section>

        <section id="rules" className="scroll-mt-24">
          <SectionCard title="Katılımcı Kuralları" description="Çocuk ve ücretsiz katılım yaş aralıklarını net biçimde tanımlayın.">
            <div className="grid gap-4 lg:grid-cols-4">
              <InputShell label="Ücretsiz çocuk min yaş">
                <input value={form.participantRules.freeChildMinAge} onChange={(event) => updateParticipantRule('freeChildMinAge', event.target.value)} className={textInputClassName()} />
              </InputShell>
              <InputShell label="Ücretsiz çocuk max yaş">
                <input value={form.participantRules.freeChildMaxAge} onChange={(event) => updateParticipantRule('freeChildMaxAge', event.target.value)} className={textInputClassName()} />
              </InputShell>
              <InputShell label="Çocuk min yaş">
                <input value={form.participantRules.childMinAge} onChange={(event) => updateParticipantRule('childMinAge', event.target.value)} className={textInputClassName()} />
              </InputShell>
              <InputShell label="Çocuk max yaş">
                <input value={form.participantRules.childMaxAge} onChange={(event) => updateParticipantRule('childMaxAge', event.target.value)} className={textInputClassName()} />
              </InputShell>
            </div>
          </SectionCard>
        </section>

        <section id="media" className="scroll-mt-24">
          <SectionCard title="Medya" description="Kapak görseli, galeri ve video alanlarını ayrı bloklarda yöneterek içerik kalitesini yükseltin.">
            <div className="grid gap-4">
              <MediaUploader
                title="Kapak görseli"
                description="Liste ekranı ve tur kartlarında kullanılacak ana görsel."
                accept="image/*"
                files={coverFile ? [coverFile] : []}
                existingItems={form.coverImage && !coverFile ? [form.coverImage] : []}
                previewUrls={coverPreviewUrl ? [coverPreviewUrl] : form.coverImage ? [form.coverImage] : []}
                icon={<ImageRoundedIcon sx={{fontSize: 20}} />}
                onChange={(files) => setCoverFile(files[0] || null)}
                onRemove={() => setCoverFile(null)}
                onRemoveExisting={removeExistingCoverImage}
              />
              <MediaUploader
                title="Tanıtım videosu"
                description="MP4 veya benzeri dosya ile video anlatımı ekleyin."
                accept="video/*"
                files={videoFile ? [videoFile] : []}
                existingItems={form.videoUrl && !videoFile ? [form.videoUrl] : []}
                previewUrls={videoPreviewUrl ? [videoPreviewUrl] : form.videoUrl ? [form.videoUrl] : []}
                previewType="video"
                icon={<MovieRoundedIcon sx={{fontSize: 20}} />}
                onChange={(files) => setVideoFile(files[0] || null)}
                onRemove={() => setVideoFile(null)}
                onRemoveExisting={removeExistingVideo}
              />
            </div>
            <MediaUploader
              title="Galeri görselleri"
              description="Birden fazla görsel yükleyerek tur detay sayfasındaki medya alanını güçlendirin."
              accept="image/*"
              multiple
              files={galleryFiles}
              orderedItems={galleryItems.map((item, index) => ({
                id: item.id,
                label: item.kind === 'existing' ? item.url : item.file.name,
                badge: item.kind === 'new' ? `Yeni ${index + 1}` : undefined
              }))}
              previewUrls={galleryPreviewUrls}
              icon={<CloudUploadRoundedIcon sx={{fontSize: 20}} />}
              onChange={appendGalleryFiles}
              onRemove={() => undefined}
              onMoveOrderedItem={moveGalleryItem}
              onRemoveOrderedItem={removeGalleryItem}
            />
            {validationErrors.coverImage ? <p className="text-sm font-medium text-danger-strong">{validationErrors.coverImage}</p> : null}
          </SectionCard>
        </section>

        <section id="publish" className="scroll-mt-24">
          <SectionCard title="Yayın Ayarları" description="Turun operasyon durumunu ürün akışına uygun biçimde yönetin.">
            <div className="grid gap-3 lg:grid-cols-3">
              <ToggleCard active={form.publishState === 'draft'} onClick={() => updateField('publishState', 'draft')} title="Taslak" description="Eksik alanlar olabilir; içerik hazırlığı sürüyor." />
              <ToggleCard active={form.publishState === 'passive'} onClick={() => updateField('publishState', 'passive')} title="Pasif" description="İçerik hazır ama yayın akışında görünmüyor." />
              <ToggleCard active={form.publishState === 'active'} onClick={() => updateField('publishState', 'active')} title="Aktif" description="Tur yayın akışına alınır ve canlı görünür." />
            </div>
            <div className="rounded-[22px] border border-line bg-panel-subtle p-4 text-sm leading-6 text-ink-muted">
              Önizleme butonu popup içinde kart görünümünü açar. Kapak, galeri ve video bu pencerede dashboard içinden gösterilir.
            </div>
          </SectionCard>
        </section>

        <StickyFormActions>
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <AutoAwesomeRoundedIcon sx={{fontSize: 18}} />
            <span>{actionHint}</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={resetForm} disabled={isSubmitting} className={buttonClassName({variant: 'ghost'})}>
              <RestartAltRoundedIcon sx={{fontSize: 18}} />
              Sıfırla
            </button>
            <button type="button" onClick={openPreview} disabled={isSubmitting || !canPreview} className={buttonClassName({variant: 'secondary'})}>
              <PreviewRoundedIcon sx={{fontSize: 18}} />
              Önizle
            </button>
            <button type="button" onClick={() => runSubmit('draft')} disabled={isSubmitting || !canSaveDraft} className={buttonClassName({variant: 'secondary'})}>
              <DraftsRoundedIcon sx={{fontSize: 18}} />
              {isSubmitting && submitIntent === 'draft' ? 'Taslak kaydediliyor...' : 'Taslak kaydet'}
            </button>
            <button type="button" onClick={() => runSubmit(form.publishState)} disabled={isSubmitting || !canSubmitSelectedState} className={buttonClassName({variant: 'primary'})}>
              <PublishRoundedIcon sx={{fontSize: 18}} />
              {isSubmitting
                ? submitIntent === 'redirect'
                  ? 'Listeye y�nlendiriliyor...'
                  : 'Kaydediliyor...'
                : form.publishState === 'active'
                  ? mode === 'edit'
                    ? 'Aktif olarak kaydet'
                    : 'Yayınla'
                  : form.publishState === 'passive'
                    ? 'Pasif olarak kaydet'
                    : 'Seçili durumu kaydet'}
            </button>
          </div>
        </StickyFormActions>
      </div>
      {isPreviewOpen ? <TourPreviewDialog preview={previewData} onClose={() => setIsPreviewOpen(false)} /> : null}
    </div>
  );
}


