import type { Metadata } from 'next'

const SITE_URL = 'https://forge-simulator.lu'

export const metadata: Metadata = {
  title: 'Répertoire Outils IA — 32 Agents IA avec Conformité RGPD & EU AI Act',
  description:
    'Comparez 32 outils IA pour entreprises : ChatGPT, Claude, Midjourney, Copilot et plus. Conformité RGPD, EU AI Act, résidence données UE. Tarifs et avis pour PME au Luxembourg.',
  alternates: { canonical: `${SITE_URL}/agents` },
  openGraph: {
    title: 'Répertoire Outils IA pour PME — Conformité RGPD | Forge',
    description: '32 outils IA comparés : conformité RGPD, EU AI Act, tarifs. Le guide IA pour les PME luxembourgeoises.',
    url: `${SITE_URL}/agents`,
  },
}

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
