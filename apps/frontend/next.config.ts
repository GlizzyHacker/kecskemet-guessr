import type { NextConfig } from 'next';

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

export default config;
