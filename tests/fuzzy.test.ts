import {describe, expect, it} from 'vitest';
import {isCloseMatch, levenshteinDistance} from '@/utils/fuzzy';

describe('fuzzy utils', () => {
  it('calculates distance', () => {
    expect(levenshteinDistance('kapadokya', 'kapadoky')).toBe(1);
  });

  it('detects close match', () => {
    expect(isCloseMatch('Manavgat', 'managat')).toBe(true);
  });
});

