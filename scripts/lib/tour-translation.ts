import {LOCALES, type AppLocale} from '../../constants/locales';
import type {Tour} from '../../types/tour';
import {buildLocalizedFields} from '../../utils/ensure-tour-localized';

type TourDraft = Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>;

type LocalizedBundle = {
  title?: string;
  shortDescription?: string;
  duration?: string;
  priceText?: string;
  keywords?: string[];
  highlights?: string[];
  includedServices?: string[];
};

function isSameString(a: string | undefined, b: string | undefined): boolean {
  return (a || '').trim() === (b || '').trim();
}

function isSameList(a: string[] | undefined, b: string[] | undefined): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return a.every((item, index) => item.trim() === (b[index] || '').trim());
}

function needsLocaleTranslation(
  targetLocale: AppLocale,
  sourceLocale: AppLocale,
  base: ReturnType<typeof buildLocalizedFields>
): boolean {
  if (targetLocale === sourceLocale) return false;

  const source = {
    title: base.title?.[sourceLocale],
    shortDescription: base.shortDescription?.[sourceLocale],
    duration: base.duration?.[sourceLocale],
    priceText: base.priceText?.[sourceLocale],
    keywords: base.keywords?.[sourceLocale],
    highlights: base.highlights?.[sourceLocale],
    includedServices: base.includedServices?.[sourceLocale]
  };

  const target = {
    title: base.title?.[targetLocale],
    shortDescription: base.shortDescription?.[targetLocale],
    duration: base.duration?.[targetLocale],
    priceText: base.priceText?.[targetLocale],
    keywords: base.keywords?.[targetLocale],
    highlights: base.highlights?.[targetLocale],
    includedServices: base.includedServices?.[targetLocale]
  };

  return (
    isSameString(source.title, target.title) ||
    isSameString(source.shortDescription, target.shortDescription) ||
    isSameString(source.duration, target.duration) ||
    isSameString(source.priceText, target.priceText) ||
    isSameList(source.keywords, target.keywords) ||
    isSameList(source.highlights, target.highlights) ||
    isSameList(source.includedServices, target.includedServices)
  );
}

async function translateBundleWithOpenAI(
  sourceLocale: AppLocale,
  targetLocale: AppLocale,
  source: LocalizedBundle
): Promise<LocalizedBundle> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return source;

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const system = [
    'You are a tourism content translator.',
    'Translate naturally and keep meaning.',
    'Return only valid JSON.',
    'Do not add markdown or explanations.',
    'If text is not translatable, keep it as-is.'
  ].join(' ');

  const user = {
    instruction: `Translate from ${sourceLocale} to ${targetLocale}.`,
    format: {
      title: 'string',
      shortDescription: 'string',
      duration: 'string',
      priceText: 'string',
      keywords: ['string'],
      highlights: ['string'],
      includedServices: ['string']
    },
    data: source
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: {type: 'json_object'},
      messages: [
        {role: 'system', content: system},
        {role: 'user', content: JSON.stringify(user)}
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI translation failed (${response.status}): ${text}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{message?: {content?: string}}>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI translation returned empty content.');

  const parsed = JSON.parse(content) as LocalizedBundle;
  return parsed;
}

export async function ensureTranslatedLocalized(tour: TourDraft, sourceLocale: AppLocale = 'tr'): Promise<TourDraft> {
  const baseLocalized = buildLocalizedFields(tour);
  const result = structuredClone(baseLocalized);

  const sourceBundle: LocalizedBundle = {
    title: baseLocalized.title?.[sourceLocale],
    shortDescription: baseLocalized.shortDescription?.[sourceLocale],
    duration: baseLocalized.duration?.[sourceLocale],
    priceText: baseLocalized.priceText?.[sourceLocale],
    keywords: baseLocalized.keywords?.[sourceLocale],
    highlights: baseLocalized.highlights?.[sourceLocale],
    includedServices: baseLocalized.includedServices?.[sourceLocale]
  };

  for (const locale of LOCALES) {
    if (!needsLocaleTranslation(locale, sourceLocale, baseLocalized)) continue;
    if (locale === sourceLocale) continue;

    const translated = await translateBundleWithOpenAI(sourceLocale, locale, sourceBundle);

    if (translated.title) (result.title ||= {})[locale] = translated.title;
    if (translated.shortDescription) (result.shortDescription ||= {})[locale] = translated.shortDescription;
    if (translated.duration) (result.duration ||= {})[locale] = translated.duration;
    if (translated.priceText) (result.priceText ||= {})[locale] = translated.priceText;
    if (translated.keywords?.length) (result.keywords ||= {})[locale] = translated.keywords;
    if (translated.highlights?.length) (result.highlights ||= {})[locale] = translated.highlights;
    if (translated.includedServices?.length) (result.includedServices ||= {})[locale] = translated.includedServices;
  }

  return {
    ...tour,
    localized: result
  };
}
