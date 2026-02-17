import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles de OpenLetz. Conforme RGPD.',
  alternates: { canonical: 'https://www.openletz.com/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
