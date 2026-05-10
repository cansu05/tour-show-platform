import {describe, expect, it} from 'vitest';
import {sortTourDays} from '@shared/index';

describe('sortTourDays', () => {
  it('sorts available tour days from monday to sunday', () => {
    expect(sortTourDays(['saturday', 'tuesday', 'thursday', 'monday', 'wednesday', 'friday', 'sunday'])).toEqual([
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ]);
  });

  it('keeps unknown day values at the end', () => {
    expect(sortTourDays(['holiday', 'friday', 'monday'])).toEqual(['monday', 'friday', 'holiday']);
  });
});
