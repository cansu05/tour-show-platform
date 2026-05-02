import {NextResponse} from 'next/server';
import {LOCALES, type AppLocale} from '@shared/locales';
import type {TourLocalizedContent} from '@/types/tour';

const TARGET_LOCALES = LOCALES.filter((locale) => locale !== 'tr') as Exclude<AppLocale, 'tr'>[];

const LOCALE_NAMES: Record<(typeof TARGET_LOCALES)[number], string> = {
  de: 'German',
  en: 'English',
  ru: 'Russian',
  fr: 'French',
  sk: 'Slovak',
  cs: 'Czech'
};

type TranslateTourRequest = {
  source?: TourLocalizedContent;
};

type TranslateTourResponse = {
  localized: Partial<Record<AppLocale, TourLocalizedContent>>;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

function getOutputText(result: OpenAIResponse) {
  if (typeof result.output_text === 'string') return result.output_text;

  return (
    result.output
      ?.flatMap((item) => item.content || [])
      .filter((content) => content.type === 'output_text' && typeof content.text === 'string')
      .map((content) => content.text)
      .join('\n') || ''
  );
}

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => normalizeText(item)).filter(Boolean) : [];
}

function normalizeLocalizedPayload(raw: unknown, sourceTitle: string): Partial<Record<AppLocale, TourLocalizedContent>> {
  if (!raw || typeof raw !== 'object') return {};
  const source = raw as Partial<Record<AppLocale, Partial<TourLocalizedContent>>>;

  return TARGET_LOCALES.reduce<Partial<Record<AppLocale, TourLocalizedContent>>>((acc, locale) => {
    const content = source[locale];
    if (!content) return acc;

    acc[locale] = {
      title: sourceTitle,
      shortDescription: normalizeText(content.shortDescription),
      description: normalizeText(content.description),
      thingsToBring: normalizeList(content.thingsToBring),
      importantNotes: normalizeList(content.importantNotes)
    };

    return acc;
  }, {});
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({message: 'OPENAI_API_KEY tanimli degil.'}, {status: 500});
  }

  try {
    const payload = (await request.json()) as TranslateTourRequest;
    const source = payload.source;

    if (!source?.title?.trim()) {
      return NextResponse.json({message: 'Cevirmek icin tur adi zorunlu.'}, {status: 400});
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TRANSLATION_MODEL || 'gpt-4o-mini',
        instructions:
          'You are a professional tourism content translator. Translate Turkish tour content into the requested locales, but do not translate the tour title. Keep the title exactly as provided in the source for every locale. Preserve meaning, prices, place names, brand names, numbers, and HTML-free plain text. Keep list lengths aligned with the source lists.',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify({
                  sourceLocale: 'tr',
                  targetLocales: TARGET_LOCALES.map((locale) => ({locale, language: LOCALE_NAMES[locale]})),
                  source
                })
              }
            ]
          }
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'tour_translations',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: Object.fromEntries(
                TARGET_LOCALES.map((locale) => [
                  locale,
                  {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      title: {type: 'string'},
                      shortDescription: {type: 'string'},
                      description: {type: 'string'},
                      thingsToBring: {type: 'array', items: {type: 'string'}},
                      importantNotes: {type: 'array', items: {type: 'string'}}
                    },
                    required: ['title', 'shortDescription', 'description', 'thingsToBring', 'importantNotes']
                  }
                ])
              ),
              required: TARGET_LOCALES
            }
          }
        }
      })
    });

    const result = (await response.json().catch(() => null)) as OpenAIResponse | null;
    if (!response.ok || !result) {
      return NextResponse.json({message: result?.error?.message || 'Ceviri servisi yanit vermedi.'}, {status: 502});
    }

    const outputText = getOutputText(result);
    const translated = normalizeLocalizedPayload(JSON.parse(outputText), source.title.trim()) as TranslateTourResponse['localized'];

    return NextResponse.json({localized: translated});
  } catch {
    return NextResponse.json({message: 'Ceviri olusturulamadi.'}, {status: 500});
  }
}
