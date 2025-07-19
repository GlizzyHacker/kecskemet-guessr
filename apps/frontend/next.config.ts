import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
        hostname: new URL(process.env.NEXT_PUBLIC_API_URL!).hostname,
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(config);
