import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation',
  description: 'Conditions générales d\'utilisation du simulateur OpenLetz et des services associés.',
  alternates: { canonical: 'https://www.openletz.com/terms' },
  robots: { index: true, follow: true },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
