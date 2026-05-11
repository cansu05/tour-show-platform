import type {ChangeEvent, ReactNode} from 'react';
import type {DashboardTourInput} from '@/features/dashboard/tour-form-data';
import type {AppLocale} from '@shared/locales';
import type {TourLocalizedContent} from '@/types/tour';

export type SectionConfig = {
  id: string;
  title: string;
  description: string;
};

export type SectionStatusMap = Record<string, 'complete' | 'pending'>;

export type OrderedMediaItem = {
  id: string;
  label: string;
  badge?: string;
};

export type ToggleCardProps = {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
};

export type ListEditorProps = {
  title: string;
  placeholder: string;
  hint?: string;
  items: string[];
  draft: string;
  onDraftChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export type MediaPreviewStripProps = {
  type: 'image' | 'video';
  urls: string[];
};

export type MediaUploaderProps = {
  title: string;
  description: string;
  accept: string;
  multiple?: boolean;
  files: File[];
  existingItems?: string[];
  previewUrls?: string[];
  previewType?: 'image' | 'video';
  orderedItems?: OrderedMediaItem[];
  icon: ReactNode;
  onChange: (files: File[]) => void;
  onRemove: (index: number) => void;
  onRemoveExisting?: (index: number) => void;
  onMoveOrderedItem?: (fromIndex: number, toIndex: number) => void;
  onRemoveOrderedItem?: (index: number) => void;
};

export type StepNavigationProps = {
  activeSection: string;
  sectionStatuses: SectionStatusMap;
};

export type BasicInformationSectionProps = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  validationErrors: Record<string, string>;
  onTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onShortDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export type ClassificationSectionProps = {
  categories: string[];
  error?: string;
  onToggleCategory: (category: string) => void;
};

export type ContentSectionProps = {
  keywords: string[];
  keywordsDraft: string;
  onKeywordsDraftChange: (value: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (index: number) => void;
  thingsToBring: string[];
  thingsDraft: string;
  onThingsDraftChange: (value: string) => void;
  onAddThingToBring: () => void;
  onRemoveThingToBring: (index: number) => void;
  importantNotes: string[];
  notesDraft: string;
  onNotesDraftChange: (value: string) => void;
  onAddImportantNote: () => void;
  onRemoveImportantNote: (index: number) => void;
};

export type TranslationSectionProps = {
  localized: Partial<Record<AppLocale, TourLocalizedContent>>;
  isTranslating: boolean;
  onTranslate: () => void;
};

export type ServicesSectionProps = {
  hasTransfer: boolean;
  hasMeal: boolean;
  isAdvantage: boolean;
  onToggleTransfer: () => void;
  onToggleMeal: () => void;
  onToggleAdvantage: () => void;
};

export type PricingSectionProps = {
  currency: string;
  campaignPrice: string;
  regions: DashboardTourInput['regions'];
  error?: string;
  onCurrencyChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCampaignPriceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUpdateRegion: (regionKey: string, patch: Partial<DashboardTourInput['regions'][string]>) => void;
  onToggleRegionDay: (regionKey: string, dayKey: string) => void;
};

export type RulesSectionProps = {
  participantRules: DashboardTourInput['participantRules'];
  onUpdateParticipantRule: (key: keyof DashboardTourInput['participantRules'], value: string) => void;
};

export type MediaSectionProps = {
  coverFile: File | null;
  coverImage: string;
  coverPreviewUrls: string[];
  videoFiles: File[];
  videoOrderedItems: OrderedMediaItem[];
  videoPreviewUrls: string[];
  galleryFiles: File[];
  galleryOrderedItems: OrderedMediaItem[];
  galleryPreviewUrls: string[];
  coverError?: string;
  onCoverFileChange: (files: File[]) => void;
  onClearCoverFile: () => void;
  onRemoveExistingCoverImage: () => void;
  onAppendVideoFiles: (files: File[]) => void;
  onMoveVideoItem: (fromIndex: number, toIndex: number) => void;
  onRemoveVideoItem: (index: number) => void;
  onAppendGalleryFiles: (files: File[]) => void;
  onMoveGalleryItem: (fromIndex: number, toIndex: number) => void;
  onRemoveGalleryItem: (index: number) => void;
};

export type PublishSectionProps = {
  publishState: DashboardTourInput['publishState'];
  onSelectDraft: () => void;
  onSelectPassive: () => void;
  onSelectActive: () => void;
};
