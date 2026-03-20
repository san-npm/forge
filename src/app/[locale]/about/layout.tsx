import type { Metadata } from 'next'

const SITE_URL = 'https://www.openletz.com'

export const metadata: Metadata = {
  title: 'À Propos — Notre Mission pour les PME Luxembourgeoises',
  description:
    'OpenLetz aide les PME luxembourgeoises à trouver et obtenir des subventions pour leur transformation digitale et IA. 6 programmes analysés, simulateur gratuit, accompagnement expert.',
  alternates: { canonical: `${SITE_URL}/about` },
  other: {
    'geo.region': 'LU',
    'geo.placename': 'Luxembourg',
    'geo.position': '49.6117;6.1300',
    'ICBM': '49.6117, 6.1300',
  },
  openGraph: {
    title: 'À Propos de OpenLetz — Aides Digitalisation Luxembourg',
    description: 'Notre mission : simplifier l\'accès aux subventions digitales pour les PME au Luxembourg.',
    url: `${SITE_URL}/about`,
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
