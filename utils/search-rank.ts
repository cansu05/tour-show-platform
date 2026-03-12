import type {Tour} from '@/types/tour';
import type {SearchResult} from '@/types/search';
import {isCloseMatch} from '@/utils/fuzzy';
import {normalizeTurkishText} from '@/utils/normalize';

export function scoreTourAgainstSearch(tour: Tour, term: string): SearchResult | null {
  const raw = term.trim();
  if (!raw) return {score: 1, reason: 'normalizedTitle'};

  const normalizedTerm = normalizeTurkishText(raw);
  const title = tour.title;
  const normalizedTitle = normalizeTurkishText(title);

  if (title.toLocaleLowerCase('tr') === raw.toLocaleLowerCase('tr')) {
    return {score: 100, reason: 'exactTitle'};
  }

  if (normalizedTitle.includes(normalizedTerm)) {
    return {score: 85, reason: 'normalizedTitle'};
  }

  const keywordHit = tour.keywords.some((keyword) =>
    normalizeTurkishText(keyword).includes(normalizedTerm)
  );

  if (keywordHit) {
    return {score: 70, reason: 'keyword'};
  }

  if (isCloseMatch(normalizedTitle, normalizedTerm)) {
    return {score: 50, reason: 'fuzzy'};
  }

  return null;
}

export function sortToursAlphabetical(tours: Tour[]): Tour[] {
  return [...tours].sort((a, b) => a.title.localeCompare(b.title, 'tr'));
}

