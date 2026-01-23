import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite root and non-locale paths to Norwegian locale internally
        {
          source: '/',
          destination: '/no',
        },
        {
          source: '/cv',
          destination: '/no/cv',
        },
      ],
    }
  },
  async redirects() {
    return [
      // Redirect /no to root (Norwegian should be at root)
      {
        source: '/no',
        destination: '/',
        permanent: true,
      },
      {
        source: '/no/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
