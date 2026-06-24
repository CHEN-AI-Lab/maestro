import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      { source: '/signin', destination: '/zh/signin', permanent: false },
      { source: '/signup', destination: '/zh/signup', permanent: false },
      { source: '/dashboard', destination: '/zh/dashboard', permanent: false },
      { source: '/pricing', destination: '/zh/pricing', permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);