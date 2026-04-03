export type SearchResult = {
  score: number;
  reason: 'exactTitle' | 'normalizedTitle' | 'keyword' | 'fuzzy';
};

