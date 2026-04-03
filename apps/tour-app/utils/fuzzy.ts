import {normalizeTurkishText} from '@/utils/normalize';

export function levenshteinDistance(a: string, b: string): number {
  const s1 = normalizeTurkishText(a);
  const s2 = normalizeTurkishText(b);

  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;

  const dp = Array.from({length: s1.length + 1}, (_, i) => [i]);
  for (let j = 1; j <= s2.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= s1.length; i += 1) {
    for (let j = 1; j <= s2.length; j += 1) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[s1.length][s2.length];
}

export function similarityRatio(a: string, b: string): number {
  const max = Math.max(a.length, b.length);
  if (!max) return 1;
  return 1 - levenshteinDistance(a, b) / max;
}

export function isCloseMatch(a: string, b: string, threshold = 0.62): boolean {
  return similarityRatio(a, b) >= threshold;
}

