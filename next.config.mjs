import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com",
              "frame-src 'self' https://www.googletagmanager.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'openletz.com' }],
        destination: 'https://www.openletz.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'openletz.ai' }],
        destination: 'https://www.openletz.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'openletz.fr' }],
        destination: 'https://www.openletz.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.openletz.fr' }],
        destination: 'https://www.openletz.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'openletz.info' }],
        destination: 'https://www.openletz.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.openletz.info' }],
        destination: 'https://www.openletz.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.openletz.ai' }],
        destination: 'https://www.openletz.com/:path*',
        permanent: true,
      },
      // Short blog URL: openletz.com/blog/xxx → /fr/blog/xxx
      // The canonical article lives under /fr/blog/:slug (FR is the default
      // locale). Accepting the shorter public URL form as a permanent alias
      // makes it easier to share and matches user intent.
      {
        source: '/blog',
        destination: '/fr/blog',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/fr/blog/:slug',
        permanent: true,
      },
      // Same shortcut for the new grant-program pillar pages
      {
        source: '/aides',
        destination: '/fr/aides',
        permanent: true,
      },
      {
        source: '/aides/:slug',
        destination: '/fr/aides/:slug',
        permanent: true,
      },
    ];
  },

};

export default withNextIntl(nextConfig);
