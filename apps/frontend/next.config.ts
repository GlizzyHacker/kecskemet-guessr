import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const config: NextConfig = {
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
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
