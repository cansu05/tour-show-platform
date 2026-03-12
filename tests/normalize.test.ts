import {describe, expect, it} from 'vitest';
import {normalizeTurkishText} from '@/utils/normalize';

describe('normalizeTurkishText', () => {
  it('normalizes Turkish characters and casing', () => {
    expect(normalizeTurkishText('Kapadokya ŞİİR')).toBe('kapadokya siir');
  });

  it('trims extra spaces', () => {
    expect(normalizeTurkishText('  Pamukkale  ')).toBe('pamukkale');
  });
});

