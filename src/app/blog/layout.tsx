import type { Metadata } from 'next'

const SITE_URL = 'https://forge-simulator.lu'

export const metadata: Metadata = {
  title: 'Le Digital au Luxembourg — Blog Forge',
  description:
    'Subventions, IA et stratégies concrètes pour les PME luxembourgeoises. Guides pratiques sur SME Package, Fit 4 Digital, Fit 4 AI et Luxinnovation.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Le Digital au Luxembourg — Blog Forge',
    description: 'Subventions, IA et stratégies concrètes pour les PME qui veulent passer à l\'action.',
    url: `${SITE_URL}/blog`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Blog Forge — Le Digital au Luxembourg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Digital au Luxembourg — Blog Forge',
    description: 'Subventions, IA et stratégies concrètes pour les PME luxembourgeoises.',
    images: [`${SITE_URL}/og-image.png`],
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
