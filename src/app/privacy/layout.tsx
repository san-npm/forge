import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles de Forge. Conforme RGPD.',
  alternates: { canonical: 'https://forge-simulator.lu/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
