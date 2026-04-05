import {getTourHealth, type TourLifecycleStatus} from '@/features/dashboard/admin-data';
import type {DashboardFormAction} from '@/features/dashboard/tour-form.types';
import type {TourPreviewData} from '@/features/dashboard/TourPreviewDialog';
import {
  normalizeDashboardSlug,
  type DashboardTourInput
} from '@/features/dashboard/tour-form-data';

export type UploadResult = {
  coverImage: string;
  gallery: string[];
  videoUrl: string;
};

export type GalleryMediaItem =
  | {id: string; kind: 'existing'; url: string}
  | {id: string; kind: 'new'; file: File};

export type OrderedMediaItem = {
  id: string;
  label: string;
  badge?: string;
};

export type SectionStatusMap = Record<string, 'complete' | 'pending'>;

export function splitMediaLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function getExistingGalleryUrls(items: GalleryMediaItem[]) {
  return items.flatMap((item) => (item.kind === 'existing' ? [item.url] : []));
}

export function createExistingGalleryItems(urls: string[]): GalleryMediaItem[] {
  return urls.map((url, index) => ({id: `existing-${index}-${url}`, kind: 'existing', url}));
}

export function createNewGalleryItems(files: File[]): GalleryMediaItem[] {
  return files.map((file, index) => ({
    id: `new-${Date.now()}-${index}-${file.name}-${file.size}`,
    kind: 'new',
    file
  }));
}

export function moveArrayItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) return items;

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export function getValidationErrors(
  form: DashboardTourInput,
  options?: {
    coverFile?: File | null;
    galleryItems?: GalleryMediaItem[];
    publishState?: TourLifecycleStatus;
  }
) {
  const errors: Record<string, string> = {};
  const publishState = options?.publishState ?? form.publishState;
  const isDraft = publishState === 'draft';
  const galleryCount = options?.galleryItems?.length ?? splitMediaLines(form.gallery).length;
  const hasGalleryImage = galleryCount > 0;
  const hasCoverImage = Boolean(form.coverImage.trim() || options?.coverFile || hasGalleryImage);

  if (!form.title.trim()) errors.title = 'Tur adı zorunlu.';
  if (!normalizeDashboardSlug(form.slug || form.title)) errors.slug = 'Geçerli bir slug üretilemedi.';
  if (!isDraft && !form.shortDescription.trim()) errors.shortDescription = 'Kısa açıklama zorunlu.';
  if (!isDraft && !form.description.trim()) errors.description = 'Detaylı açıklama zorunlu.';
  if (!isDraft && form.categories.length === 0) errors.categories = 'En az bir kategori seçin.';
  if (!isDraft && !hasCoverImage) errors.coverImage = 'Kapak görseli ekleyin veya en az bir galeri görseli yükleyin.';

  const hasRegionData = Object.values(form.regions).some(
    (region) => region.enabled && (region.adultPrice.trim() || region.childPrice.trim() || region.availableDays.length > 0)
  );

  if (!isDraft && !hasRegionData) {
    errors.regions = 'En az bir bölge için fiyat veya gün bilgisi girin.';
  }

  return errors;
}

export function getSectionStatus(
  sectionId: string,
  form: DashboardTourInput,
  options?: {galleryItems?: GalleryMediaItem[]; hasCoverFile?: boolean}
) {
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
      return form.coverImage.trim() || options?.hasCoverFile || (options?.galleryItems?.length ?? splitMediaLines(form.gallery).length) > 0
        ? 'complete'
        : 'pending';
    case 'publish':
      return form.publishState ? 'complete' : 'pending';
    default:
      return 'pending';
  }
}

export function buildFormPreviewData({
  form,
  coverPreviewUrl,
  galleryPreviewUrls,
  galleryItems,
  videoPreviewUrl
}: {
  form: DashboardTourInput;
  coverPreviewUrl?: string;
  galleryPreviewUrls: string[];
  galleryItems: GalleryMediaItem[];
  videoPreviewUrl?: string;
}): TourPreviewData {
  const slug = normalizeDashboardSlug(form.slug || form.title) || 'taslak-tur';
  const fallbackGallery = getExistingGalleryUrls(galleryItems);
  const gallery = galleryPreviewUrls.length > 0 ? galleryPreviewUrls : fallbackGallery;
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
    publishState: form.publishState,
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

export function getGalleryOrderedItems(items: GalleryMediaItem[]): OrderedMediaItem[] {
  return items.map((item, index) => ({
    id: item.id,
    label: item.kind === 'existing' ? item.url : item.file.name,
    badge: item.kind === 'new' ? `Yeni ${index + 1}` : undefined
  }));
}

export function getActionHint(options: {
  canPreview: boolean;
  canSaveDraft: boolean;
  canSubmitSelectedState: boolean;
  validationErrorCount: number;
}) {
  const {canPreview, canSaveDraft, canSubmitSelectedState, validationErrorCount} = options;

  if (!canPreview) return 'Önizleme için önce tur adı girin.';
  if (!canSaveDraft) return 'Taslak için gerekli alanları tamamlayın.';
  if (!canSubmitSelectedState) return 'Seçili yayın durumu için eksik alanları tamamlayın.';
  if (validationErrorCount === 0) return 'Form kayda hazır görünüyor.';
  return `${validationErrorCount} alan kontrol bekliyor.`;
}

export function dashboardFormReducer(state: DashboardTourInput, action: DashboardFormAction): DashboardTourInput {
  switch (action.type) {
    case 'reset':
      return action.payload;
    case 'setField':
      return {
        ...state,
        [action.key]: action.value
      };
    case 'setTitle':
      return {
        ...state,
        title: action.title,
        slug: action.slugEdited ? state.slug : normalizeDashboardSlug(action.title)
      };
    case 'toggleCategory':
      return {
        ...state,
        categories: state.categories.includes(action.category)
          ? state.categories.filter((entry) => entry !== action.category)
          : [...state.categories, action.category]
      };
    case 'updateParticipantRule':
      return {
        ...state,
        participantRules: {
          ...state.participantRules,
          [action.key]: action.value
        }
      };
    case 'updateRegion':
      return {
        ...state,
        regions: {
          ...state.regions,
          [action.regionKey]: {
            ...state.regions[action.regionKey],
            ...action.patch
          }
        }
      };
    case 'toggleRegionDay': {
      const region = state.regions[action.regionKey];
      const nextDays = region.availableDays.includes(action.dayKey)
        ? region.availableDays.filter((entry) => entry !== action.dayKey)
        : [...region.availableDays, action.dayKey];

      return {
        ...state,
        regions: {
          ...state.regions,
          [action.regionKey]: {
            ...region,
            availableDays: nextDays
          }
        }
      };
    }
    case 'addListItem':
      return {
        ...state,
        [action.field]: [...state[action.field], action.value]
      };
    case 'removeListItem':
      return {
        ...state,
        [action.field]: state[action.field].filter((_, index) => index !== action.index)
      };
    default:
      return state;
  }
}
