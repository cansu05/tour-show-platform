'use client';

import type {ChangeEvent} from 'react';
import {useCallback, useDeferredValue, useEffect, useMemo, useReducer, useState} from 'react';
import {useRouter} from 'next/navigation';
import type {TourLifecycleStatus} from '@/features/dashboard/admin-data';
import {TourFormActions} from '@/features/dashboard/components/TourFormActions';
import {TourFormSummary} from '@/features/dashboard/components/TourFormSummary';
import {cn} from '@/features/dashboard/components/admin-ui';
import {TourPreviewDialog} from '@/features/dashboard/TourPreviewDialog';
import {
  BasicInformationSection,
  ClassificationSection,
  ContentSection,
  FORM_SECTIONS,
  MediaSection,
  PricingSection,
  PublishSection,
  RulesSection,
  ServicesSection,
  StepNavigation,
  TranslationSection
} from '@/features/dashboard/TourDashboardFormSections';
import {
  buildFormPreviewData,
  createExistingGalleryItems,
  createNewGalleryItems,
  dashboardFormReducer,
  getActionHint,
  getGalleryOrderedItems,
  getSectionStatus,
  getValidationErrors,
  moveArrayItem,
  splitMediaLines,
  type GalleryMediaItem,
  type UploadResult
} from '@/features/dashboard/tour-form-helpers';
import type {SubmitState, TourDashboardFormProps} from '@/features/dashboard/tour-form.types';
import {
  buildTourDocumentFromDashboardInput,
  DASHBOARD_INITIAL_FORM,
  normalizeDashboardSlug,
  validateDashboardTourInput
} from '@/features/dashboard/tour-form-data';
import {validateUploadFiles, type SignedUploadPayload} from '@/features/dashboard/uploads';
import {useObjectUrl, useObjectUrlMap} from '@/features/dashboard/use-object-url-cache';
import type {AppLocale} from '@shared/locales';
import type {TourLocalizedContent} from '@/types/tour';

type JsonMessageResponse = {
  message?: string;
};

type TourTranslationResponse = {
  localized?: Partial<Record<AppLocale, TourLocalizedContent>>;
};

async function readJsonMessageResponse<T>(response: Response): Promise<T | JsonMessageResponse> {
  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();

  if (!rawBody) {
    return {};
  }

  if (contentType.includes('application/json')) {
    return JSON.parse(rawBody) as T;
  }

  const normalizedBody = rawBody.trim();

  if (normalizedBody.startsWith('{') || normalizedBody.startsWith('[')) {
    try {
      return JSON.parse(normalizedBody) as T;
    } catch {
      return {message: normalizedBody};
    }
  }

  return {message: normalizedBody};
}

async function uploadFileToCloudinary(
  cloudName: string,
  apiKey: string,
  signedFile: SignedUploadPayload['files'][number],
  file: File
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', signedFile.timestamp);
  formData.append('folder', signedFile.folder);
  formData.append('public_id', signedFile.publicId);
  formData.append('signature', signedFile.signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData
  });
  const result = (await response.json().catch(() => null)) as
    | {secure_url?: string; error?: {message?: string}}
    | null;

  if (!response.ok || !result?.secure_url) {
    throw new Error(result?.error?.message || 'Cloudinary yuklemesi basarisiz oldu.');
  }

  return result.secure_url;
}

export function TourDashboardForm({
  initialData = DASHBOARD_INITIAL_FORM,
  mode = 'create',
  originalSlug
}: TourDashboardFormProps) {
  const router = useRouter();
  const [form, dispatch] = useReducer(dashboardFormReducer, initialData);
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
  const [isTranslating, setIsTranslating] = useState(false);
  const [submitIntent, setSubmitIntent] = useState<TourLifecycleStatus | null>(null);
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData.slug));

  useEffect(() => {
    dispatch({type: 'reset', payload: initialData});
    setCoverFile(null);
    setGalleryItems(createExistingGalleryItems(splitMediaLines(initialData.gallery)));
    setVideoFile(null);
    setKeywordsDraft('');
    setThingsDraft('');
    setNotesDraft('');
    setSubmitState(null);
    setValidationErrors({});
    setActiveSection(FORM_SECTIONS[0].id);
    setIsSubmitting(false);
    setIsTranslating(false);
    setSubmitIntent(null);
    setSlugEdited(Boolean(initialData.slug));
  }, [initialData]);

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

  const coverPreviewUrl = useObjectUrl(coverFile);
  const videoPreviewUrl = useObjectUrl(videoFile);
  const galleryFiles = useMemo(() => galleryItems.flatMap((item) => (item.kind === 'new' ? [item.file] : [])), [galleryItems]);
  const galleryNewItems = useMemo(
    () => galleryItems.flatMap((item) => (item.kind === 'new' ? [{id: item.id, file: item.file}] : [])),
    [galleryItems]
  );
  const galleryNewItemUrls = useObjectUrlMap(galleryNewItems);
  const galleryPreviewUrls = useMemo(() => {
    const newUrlMap = new Map(galleryNewItems.map((item, index) => [item.id, galleryNewItemUrls[index]]));
    return galleryItems.map((item) => (item.kind === 'new' ? newUrlMap.get(item.id) || '' : item.url));
  }, [galleryItems, galleryNewItems, galleryNewItemUrls]);

  const deferredPreviewForm = useDeferredValue(form);
  const deferredGalleryItems = useDeferredValue(galleryItems);
  const deferredGalleryPreviewUrls = useDeferredValue(galleryPreviewUrls);
  const deferredCoverPreviewUrl = useDeferredValue(coverPreviewUrl);
  const deferredVideoPreviewUrl = useDeferredValue(videoPreviewUrl);

  const derivedState = useMemo(() => {
    const sharedOptions = {coverFile, galleryItems};
    const validationSummary = getValidationErrors(form, sharedOptions);
    const draftValidationSummary = getValidationErrors(form, {...sharedOptions, publishState: 'draft'});
    const selectedPublishValidationSummary = getValidationErrors(form, {...sharedOptions, publishState: form.publishState});
    const sectionStatuses = Object.fromEntries(
      FORM_SECTIONS.map((section) => [
        section.id,
        getSectionStatus(section.id, form, {galleryItems, hasCoverFile: Boolean(coverFile)})
      ])
    ) as Record<string, 'complete' | 'pending'>;

    return {
      validationSummary,
      draftValidationSummary,
      selectedPublishValidationSummary,
      sectionStatuses,
      completionCount: Object.values(sectionStatuses).filter((status) => status === 'complete').length
    };
  }, [coverFile, form, galleryItems]);

  const previewData = useMemo(
    () =>
      buildFormPreviewData({
        form: deferredPreviewForm,
        coverPreviewUrl: deferredCoverPreviewUrl,
        galleryPreviewUrls: deferredGalleryPreviewUrls,
        galleryItems: deferredGalleryItems,
        videoPreviewUrl: deferredVideoPreviewUrl
      }),
    [deferredCoverPreviewUrl, deferredGalleryItems, deferredGalleryPreviewUrls, deferredPreviewForm, deferredVideoPreviewUrl]
  );

  const {validationSummary, draftValidationSummary, selectedPublishValidationSummary, sectionStatuses, completionCount} = derivedState;
  const normalizedSlug = normalizeDashboardSlug(form.slug || form.title);
  const canPreview = Boolean(normalizedSlug);
  const canSaveDraft = Object.keys(draftValidationSummary).length === 0;
  const canSubmitSelectedState = Object.keys(selectedPublishValidationSummary).length === 0;
  const galleryOrderedItems = useMemo(() => getGalleryOrderedItems(galleryItems), [galleryItems]);
  const actionHint = getActionHint({
    canPreview,
    canSaveDraft,
    canSubmitSelectedState,
    validationErrorCount: Object.keys(validationSummary).length
  });

  const setField = useCallback(
    <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
      dispatch({type: 'setField', key, value});
    },
    []
  );

  const handleTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: 'setTitle',
        title: event.target.value,
        slugEdited
      });
    },
    [slugEdited]
  );

  const handleSlugChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSlugEdited(true);
      setField('slug', normalizeDashboardSlug(event.target.value));
    },
    [setField]
  );

  const handleShortDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => setField('shortDescription', event.target.value),
    [setField]
  );
  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => setField('description', event.target.value),
    [setField]
  );
  const handleCurrencyChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setField('currency', event.target.value), [setField]);
  const handleCampaignPriceChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setField('campaignPrice', event.target.value), [setField]);

  const toggleCategory = useCallback((category: string) => {
    dispatch({type: 'toggleCategory', category});
  }, []);

  const updateParticipantRule = useCallback((key: keyof typeof form.participantRules, value: string) => {
    dispatch({type: 'updateParticipantRule', key, value});
  }, []);

  const updateRegion = useCallback((regionKey: string, patch: Partial<(typeof form.regions)[string]>) => {
    dispatch({type: 'updateRegion', regionKey, patch});
  }, []);

  const toggleRegionDay = useCallback((regionKey: string, dayKey: string) => {
    dispatch({type: 'toggleRegionDay', regionKey, dayKey});
  }, []);

  const addListItem = useCallback((field: 'keywords' | 'thingsToBring' | 'importantNotes', draft: string, clearDraft: () => void) => {
    const value = draft.trim();
    if (!value) return;

    dispatch({type: 'addListItem', field, value});
    clearDraft();
  }, []);

  const removeListItem = useCallback((field: 'keywords' | 'thingsToBring' | 'importantNotes', index: number) => {
    dispatch({type: 'removeListItem', field, index});
  }, []);

  const addKeyword = useCallback(() => addListItem('keywords', keywordsDraft, () => setKeywordsDraft('')), [addListItem, keywordsDraft]);
  const removeKeyword = useCallback((index: number) => removeListItem('keywords', index), [removeListItem]);
  const addThingToBring = useCallback(() => addListItem('thingsToBring', thingsDraft, () => setThingsDraft('')), [addListItem, thingsDraft]);
  const removeThingToBring = useCallback((index: number) => removeListItem('thingsToBring', index), [removeListItem]);
  const addImportantNote = useCallback(() => addListItem('importantNotes', notesDraft, () => setNotesDraft('')), [addListItem, notesDraft]);
  const removeImportantNote = useCallback((index: number) => removeListItem('importantNotes', index), [removeListItem]);

  const removeExistingCoverImage = useCallback(() => {
    setField('coverImage', '');
  }, [setField]);

  const removeExistingVideo = useCallback(() => {
    setField('videoUrl', '');
  }, [setField]);

  const handleCoverFileChange = useCallback((files: File[]) => setCoverFile(files[0] || null), []);
  const handleVideoFileChange = useCallback((files: File[]) => setVideoFile(files[0] || null), []);
  const clearCoverFile = useCallback(() => setCoverFile(null), []);
  const clearVideoFile = useCallback(() => setVideoFile(null), []);

  const appendGalleryFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;
    setGalleryItems((current) => [...current, ...createNewGalleryItems(files)]);
  }, []);

  const moveGalleryItem = useCallback((fromIndex: number, toIndex: number) => {
    setGalleryItems((current) => moveArrayItem(current, fromIndex, toIndex));
  }, []);

  const removeGalleryItem = useCallback((index: number) => {
    setGalleryItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const resetForm = useCallback(() => {
    dispatch({type: 'reset', payload: initialData});
    setCoverFile(null);
    setGalleryItems(createExistingGalleryItems(splitMediaLines(initialData.gallery)));
    setVideoFile(null);
    setKeywordsDraft('');
    setThingsDraft('');
    setNotesDraft('');
    setSubmitState(null);
    setValidationErrors({});
    setSlugEdited(Boolean(initialData.slug));
  }, [initialData]);

  const buildTurkishLocalizedContent = useCallback(
    (): TourLocalizedContent => ({
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      thingsToBring: form.thingsToBring.map((entry) => entry.trim()).filter(Boolean),
      importantNotes: form.importantNotes.map((entry) => entry.trim()).filter(Boolean)
    }),
    [form.description, form.importantNotes, form.shortDescription, form.thingsToBring, form.title]
  );

  const generateTranslations = useCallback(() => {
    const source = buildTurkishLocalizedContent();

    if (!source.title) {
      setSubmitState({type: 'error', message: 'Çeviri için önce tur adını girin.'});
      return;
    }

    void (async () => {
      setIsTranslating(true);
      setSubmitState(null);

      try {
        const response = await fetch('/api/dashboard/translations/tour', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({source})
        });
        const data = await readJsonMessageResponse<TourTranslationResponse>(response);

        if (!response.ok || !('localized' in data) || !data.localized) {
          const message = 'message' in data ? data.message : undefined;
          setSubmitState({type: 'error', message: message || 'Çeviriler üretilemedi.'});
          return;
        }

        setField('localized', {tr: source, ...data.localized});
        setSubmitState({type: 'success', message: 'Çeviriler üretildi. Kaydettiğinizde tur kaydına eklenecek.'});
      } catch (error) {
        setSubmitState({type: 'error', message: error instanceof Error ? error.message : 'Çeviri işlemi tamamlanamadı.'});
      } finally {
        setIsTranslating(false);
      }
    })();
  }, [buildTurkishLocalizedContent, setField]);

  const uploadBatch = useCallback(async (slug: string, kind: 'cover' | 'gallery' | 'video', files: File[]) => {
    validateUploadFiles(kind, files);

    const response = await fetch('/api/dashboard/uploads', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        slug,
        kind,
        files: files.map((file) => ({name: file.name, size: file.size, type: file.type}))
      })
    });
    const data = await readJsonMessageResponse<SignedUploadPayload>(response);

    if (!response.ok || !('files' in data) || !data.files?.length || !('cloudName' in data) || !data.cloudName || !('apiKey' in data) || !data.apiKey) {
      const message = 'message' in data ? data.message : undefined;
      throw new Error(message || 'Dosya yuklenemedi.');
    }

    return Promise.all(data.files.map((signedFile, index) => uploadFileToCloudinary(data.cloudName, data.apiKey, signedFile, files[index]!)));
  }, []);

  const uploadFiles = useCallback(
    async (slug: string): Promise<UploadResult> => {
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
    },
    [coverFile, form.coverImage, form.videoUrl, galleryFiles, galleryItems, uploadBatch, videoFile]
  );

  const runSubmit = useCallback(
    (publishState: TourLifecycleStatus) => {
      const nextForm = {...form, publishState};
      const nextErrors = getValidationErrors(nextForm, {coverFile, galleryItems, publishState});
      setValidationErrors(nextErrors);
      setSubmitState(null);

      if (Object.keys(nextErrors).length > 0) {
        setSubmitState({type: 'error', message: 'Kaydetmeden önce zorunlu alanları tamamlayın.'});
        return;
      }

      void (async () => {
        setIsSubmitting(true);
        setSubmitIntent(publishState);

        try {
          const slug = normalizeDashboardSlug(nextForm.slug || nextForm.title);
          validateDashboardTourInput({
            ...nextForm,
            slug,
            coverImage: nextForm.coverImage || (coverFile ? '__pending_cover__' : ''),
            gallery:
              splitMediaLines(nextForm.gallery).join('\n') ||
              (galleryItems.some((item) => item.kind === 'new')
                ? galleryItems.map((item, index) => (item.kind === 'existing' ? item.url : `__pending_gallery_${index}__`)).join('\n')
                : ''),
            videoUrl: nextForm.videoUrl || (videoFile ? '__pending_video__' : '')
          });

          const uploaded = await uploadFiles(slug);
          const payload = buildTourDocumentFromDashboardInput({
            ...nextForm,
            slug,
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

          const result = (await response.json().catch(() => null)) as JsonMessageResponse | null;
          if (!response.ok) {
            setSubmitState({type: 'error', message: result?.message || 'Tur kaydedilemedi.'});
            return;
          }

          setField('publishState', publishState);
          setSubmitState({
            type: 'success',
            message:
              result?.message ||
              (publishState === 'active'
                ? 'Tur yayına alındı.'
                : publishState === 'draft'
                  ? 'Taslak kaydedildi.'
                  : 'Tur pasif durumda kaydedildi.')
          });

          router.push('/tours');
          router.refresh();
        } catch (error) {
          setSubmitState({type: 'error', message: error instanceof Error ? error.message : 'İşlem tamamlanamadı.'});
        } finally {
          setIsSubmitting(false);
          setSubmitIntent(null);
        }
      })();
    },
    [coverFile, form, galleryItems, mode, originalSlug, router, setField, uploadFiles, videoFile]
  );

  const openPreview = useCallback(() => {
    if (!normalizedSlug) {
      setSubmitState({type: 'error', message: 'Önizleme için önce tur adı veya slug girin.'});
      return;
    }

    setIsPreviewOpen(true);
  }, [normalizedSlug]);

  const selectDraftPublishState = useCallback(() => setField('publishState', 'draft'), [setField]);
  const selectPassivePublishState = useCallback(() => setField('publishState', 'passive'), [setField]);
  const selectActivePublishState = useCallback(() => setField('publishState', 'active'), [setField]);
  const toggleTransfer = useCallback(() => setField('hasTransfer', !form.hasTransfer), [form.hasTransfer, setField]);
  const toggleMeal = useCallback(() => setField('hasMeal', !form.hasMeal), [form.hasMeal, setField]);
  const toggleAdvantage = useCallback(() => setField('isAdvantage', !form.isAdvantage), [form.isAdvantage, setField]);
  const saveDraft = useCallback(() => runSubmit('draft'), [runSubmit]);
  const saveSelectedState = useCallback(() => runSubmit(form.publishState), [form.publishState, runSubmit]);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <StepNavigation activeSection={activeSection} sectionStatuses={sectionStatuses} />

        <div className="space-y-6">
          {submitState ? (
            <div
              className={cn(
                'rounded-[22px] border px-4 py-3 text-sm',
                submitState.type === 'success'
                  ? 'border-[color:var(--success-soft)] bg-[color:var(--success-soft)] text-success-strong'
                  : 'border-[color:var(--danger-soft)] bg-[color:var(--danger-soft)] text-danger-strong'
              )}
            >
              {submitState.message}
            </div>
          ) : null}

          <TourFormSummary
            completionCount={completionCount}
            publishState={form.publishState}
            slug={normalizedSlug}
            validationErrorCount={Object.keys(validationSummary).length}
          />

          <BasicInformationSection
            title={form.title}
            slug={form.slug}
            shortDescription={form.shortDescription}
            description={form.description}
            validationErrors={validationErrors}
            onTitleChange={handleTitleChange}
            onSlugChange={handleSlugChange}
            onShortDescriptionChange={handleShortDescriptionChange}
            onDescriptionChange={handleDescriptionChange}
          />

          <ClassificationSection
            categories={form.categories}
            error={validationErrors.categories}
            onToggleCategory={toggleCategory}
          />

          <ContentSection
            keywords={form.keywords}
            keywordsDraft={keywordsDraft}
            onKeywordsDraftChange={setKeywordsDraft}
            onAddKeyword={addKeyword}
            onRemoveKeyword={removeKeyword}
            thingsToBring={form.thingsToBring}
            thingsDraft={thingsDraft}
            onThingsDraftChange={setThingsDraft}
            onAddThingToBring={addThingToBring}
            onRemoveThingToBring={removeThingToBring}
            importantNotes={form.importantNotes}
            notesDraft={notesDraft}
            onNotesDraftChange={setNotesDraft}
            onAddImportantNote={addImportantNote}
            onRemoveImportantNote={removeImportantNote}
          />

          <TranslationSection localized={form.localized || {}} isTranslating={isTranslating} onTranslate={generateTranslations} />

          <ServicesSection
            hasTransfer={form.hasTransfer}
            hasMeal={form.hasMeal}
            isAdvantage={form.isAdvantage}
            onToggleTransfer={toggleTransfer}
            onToggleMeal={toggleMeal}
            onToggleAdvantage={toggleAdvantage}
          />

          <PricingSection
            currency={form.currency}
            campaignPrice={form.campaignPrice}
            regions={form.regions}
            error={validationErrors.regions}
            onCurrencyChange={handleCurrencyChange}
            onCampaignPriceChange={handleCampaignPriceChange}
            onUpdateRegion={updateRegion}
            onToggleRegionDay={toggleRegionDay}
          />

          <RulesSection participantRules={form.participantRules} onUpdateParticipantRule={updateParticipantRule} />

          <MediaSection
            coverFile={coverFile}
            coverImage={form.coverImage}
            coverPreviewUrls={coverPreviewUrl ? [coverPreviewUrl] : form.coverImage ? [form.coverImage] : []}
            videoFile={videoFile}
            videoUrl={form.videoUrl}
            videoPreviewUrls={videoPreviewUrl ? [videoPreviewUrl] : form.videoUrl ? [form.videoUrl] : []}
            galleryFiles={galleryFiles}
            galleryOrderedItems={galleryOrderedItems}
            galleryPreviewUrls={galleryPreviewUrls}
            coverError={validationErrors.coverImage}
            onCoverFileChange={handleCoverFileChange}
            onClearCoverFile={clearCoverFile}
            onRemoveExistingCoverImage={removeExistingCoverImage}
            onVideoFileChange={handleVideoFileChange}
            onClearVideoFile={clearVideoFile}
            onRemoveExistingVideo={removeExistingVideo}
            onAppendGalleryFiles={appendGalleryFiles}
            onMoveGalleryItem={moveGalleryItem}
            onRemoveGalleryItem={removeGalleryItem}
          />

          <PublishSection
            publishState={form.publishState}
            onSelectDraft={selectDraftPublishState}
            onSelectPassive={selectPassivePublishState}
            onSelectActive={selectActivePublishState}
          />

          <TourFormActions
            actionHint={actionHint}
            canPreview={canPreview}
            canSaveDraft={canSaveDraft}
            canSubmitSelectedState={canSubmitSelectedState}
            isSubmitting={isSubmitting}
            submitIntent={submitIntent}
            publishState={form.publishState}
            onReset={resetForm}
            onOpenPreview={openPreview}
            onSaveDraft={saveDraft}
            onSaveSelectedState={saveSelectedState}
          />
        </div>
      </div>

      {isPreviewOpen ? <TourPreviewDialog preview={previewData} onClose={() => setIsPreviewOpen(false)} /> : null}
    </>
  );
}
