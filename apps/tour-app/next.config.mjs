import path from 'node:path';
import {fileURLToPath} from 'node:url';

const appRoot = fileURLToPath(new URL('.', import.meta.url));
const monorepoRoot = fileURLToPath(new URL('../..', import.meta.url));
const nextIntlConfigPath = path.resolve(appRoot, './i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      }
    ]
  },
  typedRoutes: true,
  outputFileTracingRoot: monorepoRoot,
  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias['next-intl/config'] = nextIntlConfigPath;

    return config;
  }
};

export default nextConfig;

