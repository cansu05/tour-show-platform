import type {Tour} from '@/types/tour';
import type {SearchResult} from '@/types/search';
import {isCloseMatch} from '@/utils/fuzzy';
import {normalizeTurkishText} from '@/utils/normalize';

const GENERIC_SEARCH_TOKENS = new Set([
  'tur',
  'turu',
  'turlar',
  'turlari',
  'gezi',
  'gezisi',
  'gezileri'
]);

function splitSearchTokens(value: string) {
  return value
    .split(/[^a-z0-9]+/g)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function scoreTourAgainstSearch(tour: Tour, term: string): SearchResult | null {
  const raw = term.trim();
  if (!raw) return {score: 1, reason: 'normalizedTitle'};

  const normalizedTerm = normalizeTurkishText(raw);
  const title = tour.title;
  const normalizedTitle = normalizeTurkishText(title);
  const normalizedKeywords = tour.keywords.map((keyword) => normalizeTurkishText(keyword));
  const normalizedCategories = tour.categories.map((category) => normalizeTurkishText(category));
  const searchableText = [normalizedTitle, ...normalizedKeywords, ...normalizedCategories].join(' ');

  if (title.toLocaleLowerCase('tr') === raw.toLocaleLowerCase('tr')) {
    return {score: 100, reason: 'exactTitle'};
  }

  if (normalizedTitle.includes(normalizedTerm)) {
    return {score: 85, reason: 'normalizedTitle'};
  }

  const keywordHit = [...normalizedKeywords, ...normalizedCategories].some((value) => value.includes(normalizedTerm));

  if (keywordHit) {
    return {score: 70, reason: 'keyword'};
  }

  const significantTokens = splitSearchTokens(normalizedTerm).filter(
    (token) => token.length > 1 && !GENERIC_SEARCH_TOKENS.has(token)
  );

  if (significantTokens.length > 0 && significantTokens.every((token) => searchableText.includes(token))) {
    return {score: 68, reason: 'keyword'};
  }

  if (isCloseMatch(normalizedTitle, normalizedTerm)) {
    return {score: 50, reason: 'fuzzy'};
  }

  return null;
}

export function sortToursAlphabetical(tours: Tour[]): Tour[] {
  return [...tours].sort((a, b) => a.title.localeCompare(b.title, 'tr'));
}
