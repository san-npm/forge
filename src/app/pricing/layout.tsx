import type { Metadata } from 'next'

const SITE_URL = 'https://www.openletz.com'

export const metadata: Metadata = {
  title: 'Tarifs — Développement Web, Intégration IA & Conseil Subventions Luxembourg',
  description:
    'Services OpenLetz : développement web dès 900 €, intégration IA dès 900 €, maintenance dès 90 €/mois, conseil subventions dès 290 €. Éligible aux aides luxembourgeoises SME Package et Fit 4 Digital.',
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: 'Tarifs Services Digitaux & IA — Éligible Subventions | OpenLetz',
    description: 'Développement web, IA, maintenance. Éligible aux aides SME Package Luxembourg.',
    url: `${SITE_URL}/pricing`,
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
