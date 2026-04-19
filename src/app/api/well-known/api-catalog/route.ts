import { NextResponse } from 'next/server';

// RFC 9727 API Catalog in linkset+json (RFC 9264) form.
// Agents hit /.well-known/api-catalog; next.config rewrite forwards here.
export async function GET() {
  const base = 'https://www.openletz.com';

  const linkset = {
    linkset: [
      {
        anchor: `${base}/api/blog`,
        'service-desc': [
          { href: `${base}/.well-known/openapi.yaml`, type: 'application/yaml' },
        ],
        'service-doc': [
          { href: `${base}/en/blog`, type: 'text/html' },
        ],
        status: [
          { href: `${base}/api/health`, type: 'application/json' },
        ],
      },
      {
        anchor: `${base}/api/newsletter`,
        'service-desc': [
          { href: `${base}/.well-known/openapi.yaml`, type: 'application/yaml' },
        ],
        'service-doc': [
          { href: `${base}/en/pricing`, type: 'text/html' },
        ],
      },
      {
        anchor: `${base}/api/contact`,
        'service-desc': [
          { href: `${base}/.well-known/openapi.yaml`, type: 'application/yaml' },
        ],
        'service-doc': [
          { href: `${base}/en/contact`, type: 'text/html' },
        ],
      },
    ],
  };

  return NextResponse.json(linkset, {
    headers: {
      'Content-Type': 'application/linkset+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
