import {describe, expect, it} from 'vitest';
import {buildTourShareUrl} from '@/utils/share-url';

describe('buildTourShareUrl', () => {
  it('builds locale-aware URL', () => {
    expect(buildTourShareUrl('https://example.com/', 'de', 'pamukkale')).toBe('https://example.com/de/tours/pamukkale');
  });
});

