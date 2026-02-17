import type { Metadata } from 'next'

const SITE_URL = 'https://www.openletz.com'

export const metadata: Metadata = {
  title: 'Blog — Aides Digitalisation, IA & Subventions Luxembourg',
  description:
    'Guides, actualités et conseils sur les aides luxembourgeoises pour PME : SME Package, Fit 4 Digital, Fit 4 AI, Luxinnovation. Restez informé sur la transformation digitale au Luxembourg.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Blog OpenLetz — Aides & Digitalisation Luxembourg',
    description: 'Guides et actualités sur les subventions digitales pour PME au Luxembourg.',
    url: `${SITE_URL}/blog`,
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
