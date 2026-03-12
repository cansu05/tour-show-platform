import {describe, expect, it} from 'vitest';
import {slugify} from '@/utils/slug';

describe('slugify', () => {
  it('creates canonical slug', () => {
    expect(slugify('Salda Gölü')).toBe('salda-golu');
  });
});

