import {defineConfig} from 'vitest/config';
import {fileURLToPath} from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': rootDir,
      '@shared': fileURLToPath(new URL('../../packages/shared/src', import.meta.url))
    }
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['vitest.setup.ts']
  }
});
