import createNextIntlPlugin from 'next-intl/plugin';
import {fileURLToPath} from 'node:url';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const monorepoRoot = fileURLToPath(new URL('../..', import.meta.url));

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
  outputFileTracingRoot: monorepoRoot
};

export default withNextIntl(nextConfig);

