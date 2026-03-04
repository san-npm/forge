import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation',
  description: 'Conditions générales d\'utilisation du simulateur OpenLetz et des services associés.',
  alternates: { canonical: 'https://www.openletz.com/terms' },
  other: {
    'geo.region': 'LU',
    'geo.placename': 'Luxembourg',
    'geo.position': '49.6117;6.1300',
    'ICBM': '49.6117, 6.1300',
  },
  robots: { index: true, follow: true },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
