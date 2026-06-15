import bundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';
import { allRedirects } from './src/lib/redirects.ts';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  cacheComponents: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), browsing-topics=(), interest-cohort=(), idle-detection=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // AI-usage preferences (contentsignals.org) as a header, so robots.txt
          // stays standard/valid for Google + Bing parsers.
          { key: 'Content-Signal', value: 'search=yes, ai-input=yes, ai-train=no' },
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
      {
        // Agent Skills discovery (cloudflare/agent-skills-discovery-rfc v0.2.0):
        // agents fetch index.json + SKILL.md cross-origin, so the static files
        // under public/.well-known/agent-skills/ need permissive CORS. The
        // Content-Type is set correctly by Next's static file server.
        source: '/.well-known/agent-skills/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, HEAD, OPTIONS' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/.well-known/api-catalog', destination: '/api/well-known/api-catalog' },
      { source: '/.well-known/openapi.yaml', destination: '/api/well-known/openapi' },
    ];
  },
  async redirects() {
    return allRedirects();
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
