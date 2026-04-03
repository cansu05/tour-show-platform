import {fileURLToPath} from 'node:url';

const monorepoRoot = fileURLToPath(new URL('../..', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  outputFileTracingRoot: monorepoRoot
};

export default nextConfig;
