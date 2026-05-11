import type {ChangeEvent, DragEvent, KeyboardEvent, ReactNode} from 'react';
import {memo, useRef} from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import MovieRoundedIcon from '@mui/icons-material/MovieRounded';
import {LOCALE_LABELS} from '@shared/locales';
import {TOUR_CATEGORIES, TOUR_DAYS, TOUR_REGIONS} from '@shared/index';
import {toDashboardMediaUrl} from '@/features/dashboard/TourPreviewDialog';
import {buttonClassName, cn, InputShell, SectionCard, textInputClassName} from '@/features/dashboard/components/admin-ui';
import type {
  BasicInformationSectionProps,
  ClassificationSectionProps,
  ContentSectionProps,
  ListEditorProps,
  MediaPreviewStripProps,
  MediaSectionProps,
  MediaUploaderProps,
  PricingSectionProps,
  PublishSectionProps,
  RulesSectionProps,
  SectionConfig,
  SectionStatusMap,
  ServicesSectionProps,
  StepNavigationProps,
  ToggleCardProps,
  TranslationSectionProps
} from '@/features/dashboard/tour-dashboard-form-sections.types';

export const FORM_SECTIONS: SectionConfig[] = [
  {id: 'basic', title: 'Temel Bilgiler', description: 'Başlık, slug ve giriş metinleri.'},
  {id: 'classification', title: 'Kategoriler ve Konumlama', description: 'Turun yerleştiği kategori grupları.'},
  {id: 'content', title: 'İçerik Bilgileri', description: 'Açıklama, anahtar kelimeler ve hazırlık listeleri.'},
  {id: 'translations', title: 'Çeviriler', description: 'TR içerikten diğer dilleri üret.'},
  {id: 'services', title: 'Hizmet Özellikleri', description: 'Transfer, yemek ve medya özellikleri.'},
  {id: 'pricing', title: 'Fiyatlandırma', description: 'Bölge bazlı fiyat ve gün kurgusu.'},
  {id: 'rules', title: 'Katılımcı Kuralları', description: 'Yaş ve çocuk aralıkları.'},
  {id: 'media', title: 'Medya', description: 'Kapak, galeri ve video yükleme alanı.'},
  {id: 'publish', title: 'Yayın Ayarları', description: 'Taslak, pasif ve aktif durumlar.'}
];

const ToggleCard = memo(function ToggleCard({active, title, description, onClick}: ToggleCardProps) {
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
});

const ListEditor = memo(function ListEditor({
  title,
  placeholder,
  hint,
  items,
  draft,
  onDraftChange,
  onAdd,
  onRemove
}: ListEditorProps) {
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
        <button type="button" onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-[16px] border border-line bg-panel px-4 py-3 text-sm font-medium text-ink shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-line-strong hover:bg-panel-subtle">
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
});

const MediaPreviewStrip = memo(function MediaPreviewStrip({type, urls}: MediaPreviewStripProps) {
  if (urls.length === 0) return null;
  const resolvedUrls = urls.map((url) => toDashboardMediaUrl(url)).filter(Boolean);
  if (resolvedUrls.length === 0) return null;

  return (
    <div className="rounded-[20px] border border-line bg-white p-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Önizleme</p>
      <div className={cn('grid gap-3', resolvedUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2 xl:grid-cols-3')}>
        {resolvedUrls.map((url, index) => (
          <div key={`${url}-${index}`} className="overflow-hidden rounded-[18px] border border-line bg-panel-subtle">
            {type === 'image' ? (
              <img src={url} alt={`Medya önizleme ${index + 1}`} className="h-32 w-full object-cover" />
            ) : (
              <video src={url} controls className="h-32 w-full bg-black object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

const MediaUploader = memo(function MediaUploader({
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
}: MediaUploaderProps) {
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
            <span className="text-sm font-medium text-ink">Dosya seç veya sürükleyip bırak</span>
            <span className="text-xs text-ink-muted">{multiple ? 'Birden fazla dosya desteklenir' : 'Tek dosya yüklenir'}</span>
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
                    <button type="button" onClick={() => onMoveOrderedItem?.(index, index - 1)} disabled={index === 0} className="rounded-full p-1 text-ink-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-35">
                      <ArrowUpwardRoundedIcon sx={{fontSize: 18}} />
                    </button>
                    <button type="button" onClick={() => onMoveOrderedItem?.(index, index + 1)} disabled={index === orderedItems.length - 1} className="rounded-full p-1 text-ink-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-35">
                      <ArrowDownwardRoundedIcon sx={{fontSize: 18}} />
                    </button>
                    <button type="button" onClick={() => onRemoveOrderedItem?.(index)} className="rounded-full p-1 text-ink-muted transition hover:text-danger-strong">
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
                  <button type="button" onClick={() => onRemoveExisting?.(index)} className="rounded-full text-ink-muted transition hover:text-danger-strong">
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
});

export const StepNavigation = memo(function StepNavigation({
  activeSection,
  sectionStatuses
}: StepNavigationProps) {
  return (
    <aside className="sticky top-6 hidden self-start xl:block xl:w-[280px]">
      <div className="rounded-[28px] border border-line bg-panel p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">İçerik akışı</p>
          <h3 className="text-lg font-semibold text-ink">Tur oluşturma adımları</h3>
        </div>
        <div className="space-y-2">
          {FORM_SECTIONS.map((section, index) => {
            const completed = sectionStatuses[section.id] === 'complete';
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  'flex items-start gap-3 rounded-[20px] px-3 py-3 transition',
                  activeSection === section.id ? 'bg-brand-soft text-brand-strong' : 'hover:bg-panel-subtle'
                )}
              >
                <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl text-xs font-semibold', completed ? 'bg-brand text-white' : activeSection === section.id ? 'bg-white text-brand-strong' : 'bg-panel-subtle text-ink-muted')}>
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
});

export const BasicInformationSection = memo(function BasicInformationSection({
  title,
  slug,
  shortDescription,
  description,
  validationErrors,
  onTitleChange,
  onSlugChange,
  onShortDescriptionChange,
  onDescriptionChange
}: BasicInformationSectionProps) {
  return (
    <section id="basic" className="scroll-mt-24">
      <SectionCard title="Temel Bilgiler" description="Turun başlık yapısı ve giriş metinleri bu bölümde belirlenir.">
        <div className="grid gap-4 lg:grid-cols-2">
          <InputShell label="Tur adı" error={validationErrors.title}>
            <input value={title} onChange={onTitleChange} placeholder="Örn. Antalya Tekne Turu" className={textInputClassName(Boolean(validationErrors.title))} />
          </InputShell>
          <InputShell label="Slug" hint="Boş bırakırsanız tur adına göre otomatik üretilir." error={validationErrors.slug}>
            <input value={slug} onChange={onSlugChange} placeholder="antalya-tekne-turu" className={textInputClassName(Boolean(validationErrors.slug))} />
          </InputShell>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <InputShell label="Kısa açıklama" hint="Liste ekranı ve kartlarda görünen kısa özet." error={validationErrors.shortDescription}>
            <textarea value={shortDescription} onChange={onShortDescriptionChange} rows={3} className={textInputClassName(Boolean(validationErrors.shortDescription))} />
          </InputShell>
          <InputShell label="Detaylı açıklama" hint="Turun ana anlatısı. Satış metni değil, net içerik özeti." error={validationErrors.description}>
            <textarea value={description} onChange={onDescriptionChange} rows={7} className={textInputClassName(Boolean(validationErrors.description))} />
          </InputShell>
        </div>
      </SectionCard>
    </section>
  );
});

export const ClassificationSection = memo(function ClassificationSection({
  categories,
  error,
  onToggleCategory
}: ClassificationSectionProps) {
  return (
    <section id="classification" className="scroll-mt-24">
      <SectionCard title="Kategoriler ve Konumlama" description="Turun keşif ve filtreleme sistemindeki yerini belirleyin.">
        <div className="flex flex-wrap gap-3">
          {TOUR_CATEGORIES.map((category) => {
            const active = categories.includes(category);
            return (
              <button key={category} type="button" onClick={() => onToggleCategory(category)} className={cn('rounded-full px-4 py-2 text-sm font-medium transition', active ? 'bg-brand text-white shadow-[0_14px_24px_rgba(79,70,229,0.18)]' : 'border border-line bg-panel text-ink-soft hover:bg-panel-subtle')}>
                {category}
              </button>
            );
          })}
        </div>
        {error ? <p className="text-sm font-medium text-danger-strong">{error}</p> : null}
      </SectionCard>
    </section>
  );
});

export const ContentSection = memo(function ContentSection({
  keywords,
  keywordsDraft,
  onKeywordsDraftChange,
  onAddKeyword,
  onRemoveKeyword,
  thingsToBring,
  thingsDraft,
  onThingsDraftChange,
  onAddThingToBring,
  onRemoveThingToBring,
  importantNotes,
  notesDraft,
  onNotesDraftChange,
  onAddImportantNote,
  onRemoveImportantNote
}: ContentSectionProps) {
  return (
    <section id="content" className="scroll-mt-24">
      <SectionCard title="İçerik Bilgileri" description="SEO ve operasyon açısından destekleyici içerik alanlarını düzenleyin.">
        <div className="space-y-6">
          <ListEditor title="Anahtar kelimeler" hint="Arama ve keşif akışı için kısa etiketler ekleyin." placeholder="Örn. tekne turu" items={keywords} draft={keywordsDraft} onDraftChange={onKeywordsDraftChange} onAdd={onAddKeyword} onRemove={onRemoveKeyword} />
          <ListEditor title="Yanınıza alacaklarınız" hint="Katılımcının tur öncesinde bilmesi gereken hazırlık öğeleri." placeholder="Örn. havlu" items={thingsToBring} draft={thingsDraft} onDraftChange={onThingsDraftChange} onAdd={onAddThingToBring} onRemove={onRemoveThingToBring} />
          <ListEditor title="Önemli notlar" hint="Rezervasyon veya katılım sırasında kritik olan kısa notlar." placeholder="Örn. pasaport zorunludur" items={importantNotes} draft={notesDraft} onDraftChange={onNotesDraftChange} onAdd={onAddImportantNote} onRemove={onRemoveImportantNote} />
        </div>
      </SectionCard>
    </section>
  );
});

export const TranslationSection = memo(function TranslationSection({
  localized,
  isTranslating,
  onTranslate
}: TranslationSectionProps) {
  return (
    <section id="translations" className="scroll-mt-24">
      <SectionCard
        title="Çeviriler"
        description="Türkçe içerikten public sitede kullanılan dil alanlarını üretin."
        action={
          <button type="button" onClick={onTranslate} disabled={isTranslating} className={buttonClassName({variant: 'primary', size: 'sm'})}>
            <AutoAwesomeRoundedIcon sx={{fontSize: 18}} />
            {isTranslating ? 'Üretiliyor...' : 'Çevirileri üret'}
          </button>
        }
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(['de', 'en', 'ru', 'fr', 'sk', 'cs'] as const).map((locale) => {
            const content = localized[locale];
            return (
              <div key={locale} className="rounded-[20px] border border-line bg-panel-subtle p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-ink">{LOCALE_LABELS[locale]}</h4>
                  <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', content ? 'bg-success-soft text-success-strong' : 'bg-panel-strong text-ink-muted')}>
                    {content ? 'Hazır' : 'Bekliyor'}
                  </span>
                </div>
                <p className="line-clamp-2 min-h-10 text-sm leading-5 text-ink-soft">{content?.title || 'Henüz çeviri üretilmedi.'}</p>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </section>
  );
});

export const ServicesSection = memo(function ServicesSection({
  hasTransfer,
  hasMeal,
  isAdvantage,
  onToggleTransfer,
  onToggleMeal,
  onToggleAdvantage
}: ServicesSectionProps) {
  return (
    <section id="services" className="scroll-mt-24">
      <SectionCard title="Hizmet Özellikleri" description="Turun operasyonel özelliklerini görsel olarak açık ve düzenli şekilde seçin.">
        <div className="grid gap-3 lg:grid-cols-3">
          <ToggleCard active={hasTransfer} onClick={onToggleTransfer} title="Transfer dahil" description="Karşılama ve ulaşım hizmeti sunuluyor." />
          <ToggleCard active={hasMeal} onClick={onToggleMeal} title="Yemek dahil" description="Tur paketine yemek veya ikram dahil." />
          <ToggleCard active={isAdvantage} onClick={onToggleAdvantage} title="Avantajlı ürün" description="Bu ayın avantajlı turları bölümünde listelenir." />
        </div>
      </SectionCard>
    </section>
  );
});

export const PricingSection = memo(function PricingSection({
  currency,
  campaignPrice,
  regions,
  error,
  onCurrencyChange,
  onCampaignPriceChange,
  onUpdateRegion,
  onToggleRegionDay
}: PricingSectionProps) {
  return (
    <section id="pricing" className="scroll-mt-24">
      <SectionCard title="Fiyatlandırma" description="Bölge bazlı fiyatları ve uygun günleri aynı yerde yönetin.">
        <div className="grid gap-4 lg:grid-cols-[0.35fr_0.35fr_1fr]">
          <InputShell label="Para birimi">
            <input value={currency} onChange={onCurrencyChange} className={textInputClassName()} />
          </InputShell>
          <InputShell label="Kampanya fiyatı">
            <input value={campaignPrice} onChange={onCampaignPriceChange} placeholder="Opsiyonel" className={textInputClassName()} />
          </InputShell>
          <div className="rounded-[20px] border border-line bg-panel-subtle px-4 py-3 text-sm text-ink-muted">Bölgesel fiyatlar boş bırakılırsa kayıt taslak kabul edilir. En az bir bölgede yetişkin fiyatı veya uygun gün bilgisi girin.</div>
        </div>
        {error ? <p className="text-sm font-medium text-danger-strong">{error}</p> : null}
        <div className="space-y-4">
          {TOUR_REGIONS.map((region) => {
            const value = regions[region.key];
            return (
              <div key={region.key} className="rounded-[24px] border border-line bg-panel-subtle p-4">
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-ink">{region.label}</h4>
                    <p className="text-sm text-ink-muted">Bu bölge için fiyat ve haftalık uygunluk yapılandırması.</p>
                  </div>
                  <button type="button" onClick={() => onUpdateRegion(region.key, {enabled: !value.enabled})} className={cn('inline-flex w-full items-center justify-center gap-2 rounded-[16px] px-3.5 py-2.5 text-sm font-medium transition lg:w-auto', value.enabled ? 'border border-brand bg-brand text-white' : 'border border-line bg-panel text-ink')}>
                    {value.enabled ? 'Bölge aktif' : 'Bölge kapalı'}
                  </button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <InputShell label="Yetişkin fiyatı">
                    <input disabled={!value.enabled} value={value.adultPrice} onChange={(event) => onUpdateRegion(region.key, {adultPrice: event.target.value})} className={textInputClassName()} />
                  </InputShell>
                  <InputShell label="Çocuk fiyatı">
                    <input disabled={!value.enabled} value={value.childPrice} onChange={(event) => onUpdateRegion(region.key, {childPrice: event.target.value})} className={textInputClassName()} />
                  </InputShell>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {TOUR_DAYS.map((day) => {
                    const selected = value.availableDays.includes(day.key);
                    return (
                      <button key={day.key} type="button" disabled={!value.enabled} onClick={() => onToggleRegionDay(region.key, day.key)} className={cn('rounded-full px-3 py-2 text-xs font-medium transition', selected ? 'bg-brand text-white' : 'border border-line bg-white text-ink-soft', !value.enabled && 'cursor-not-allowed opacity-50')}>
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
  );
});

export const RulesSection = memo(function RulesSection({
  participantRules,
  onUpdateParticipantRule
}: RulesSectionProps) {
  return (
    <section id="rules" className="scroll-mt-24">
      <SectionCard title="Katılımcı Kuralları" description="Çocuk ve ücretsiz katılım yaş aralıklarını net biçimde tanımlayın.">
        <div className="grid gap-4 lg:grid-cols-4">
          <InputShell label="Ücretsiz çocuk min yaş">
            <input value={participantRules.freeChildMinAge} onChange={(event) => onUpdateParticipantRule('freeChildMinAge', event.target.value)} className={textInputClassName()} />
          </InputShell>
          <InputShell label="Ücretsiz çocuk max yaş">
            <input value={participantRules.freeChildMaxAge} onChange={(event) => onUpdateParticipantRule('freeChildMaxAge', event.target.value)} className={textInputClassName()} />
          </InputShell>
          <InputShell label="Çocuk min yaş">
            <input value={participantRules.childMinAge} onChange={(event) => onUpdateParticipantRule('childMinAge', event.target.value)} className={textInputClassName()} />
          </InputShell>
          <InputShell label="Çocuk max yaş">
            <input value={participantRules.childMaxAge} onChange={(event) => onUpdateParticipantRule('childMaxAge', event.target.value)} className={textInputClassName()} />
          </InputShell>
        </div>
      </SectionCard>
    </section>
  );
});

export const MediaSection = memo(function MediaSection({
  coverFile,
  coverImage,
  coverPreviewUrls,
  videoFiles,
  videoOrderedItems,
  videoPreviewUrls,
  galleryFiles,
  galleryOrderedItems,
  galleryPreviewUrls,
  coverError,
  onCoverFileChange,
  onClearCoverFile,
  onRemoveExistingCoverImage,
  onAppendVideoFiles,
  onMoveVideoItem,
  onRemoveVideoItem,
  onAppendGalleryFiles,
  onMoveGalleryItem,
  onRemoveGalleryItem
}: MediaSectionProps) {
  return (
    <section id="media" className="scroll-mt-24">
      <SectionCard title="Medya" description="Kapak görseli, galeri ve video alanlarını ayrı bloklarda yöneterek içerik kalitesini yükseltin.">
        <div className="grid gap-4">
          <MediaUploader title="Kapak görseli" description="Liste ekranı ve tur kartlarında kullanılacak ana görsel." accept="image/*" files={coverFile ? [coverFile] : []} existingItems={coverImage && !coverFile ? [coverImage] : []} previewUrls={coverPreviewUrls} icon={<ImageRoundedIcon sx={{fontSize: 20}} />} onChange={onCoverFileChange} onRemove={onClearCoverFile} onRemoveExisting={() => onRemoveExistingCoverImage()} />
          <MediaUploader title="Tanıtım videoları" description="Birden fazla MP4 veya benzeri video anlatımı ekleyin." accept="video/*" multiple files={videoFiles} orderedItems={videoOrderedItems} previewUrls={videoPreviewUrls} previewType="video" icon={<MovieRoundedIcon sx={{fontSize: 20}} />} onChange={onAppendVideoFiles} onRemove={() => undefined} onMoveOrderedItem={onMoveVideoItem} onRemoveOrderedItem={onRemoveVideoItem} />
          <MediaUploader title="Galeri görselleri" description="Birden fazla görsel yükleyerek tur detay sayfasındaki medya alanını güçlendirin." accept="image/*" multiple files={galleryFiles} orderedItems={galleryOrderedItems} previewUrls={galleryPreviewUrls} icon={<CloudUploadRoundedIcon sx={{fontSize: 20}} />} onChange={onAppendGalleryFiles} onRemove={() => undefined} onMoveOrderedItem={onMoveGalleryItem} onRemoveOrderedItem={onRemoveGalleryItem} />
        </div>
        {coverError ? <p className="text-sm font-medium text-danger-strong">{coverError}</p> : null}
      </SectionCard>
    </section>
  );
});

export const PublishSection = memo(function PublishSection({
  publishState,
  onSelectDraft,
  onSelectPassive,
  onSelectActive
}: PublishSectionProps) {
  return (
    <section id="publish" className="scroll-mt-24">
      <SectionCard title="Yayın Ayarları" description="Turun operasyon durumunu ürün akışına uygun biçimde yönetin.">
        <div className="grid gap-3 lg:grid-cols-3">
          <ToggleCard active={publishState === 'draft'} onClick={onSelectDraft} title="Taslak" description="Eksik alanlar olabilir; içerik hazırlığı sürüyor." />
          <ToggleCard active={publishState === 'passive'} onClick={onSelectPassive} title="Pasif" description="İçerik hazır ama yayın akışında görünmüyor." />
          <ToggleCard active={publishState === 'active'} onClick={onSelectActive} title="Aktif" description="Tur yayın akışına alınır ve canlı görünür." />
        </div>
        <div className="rounded-[22px] border border-line bg-panel-subtle p-4 text-sm leading-6 text-ink-muted">
          Önizleme butonu popup içinde kart görünümünü açar. Kapak, galeri ve video bu pencerede dashboard içinden gösterilir.
        </div>
      </SectionCard>
    </section>
  );
});

