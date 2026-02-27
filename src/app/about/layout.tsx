import type { Metadata } from 'next'

const SITE_URL = 'https://forge-simulator.lu'

export const metadata: Metadata = {
  title: 'À Propos — Notre Mission pour les PME Luxembourgeoises',
  description:
    'Forge aide les PME luxembourgeoises à trouver et obtenir des subventions pour leur transformation digitale et IA. 6 programmes analysés, simulateur gratuit, accompagnement expert.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'À Propos de Forge — Aides Digitalisation Luxembourg',
    description: 'Notre mission : simplifier l\'accès aux subventions digitales pour les PME au Luxembourg.',
    url: `${SITE_URL}/about`,
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
