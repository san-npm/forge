import type { Metadata } from 'next'
import { AGENTS } from '@/lib/agents'

const SITE_URL = 'https://www.openletz.com'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return AGENTS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = AGENTS.find((a) => a.slug === params.slug)
  if (!agent) return { title: 'Outil IA introuvable' }

  const gdpr = agent.euCompliance.gdprCompliant === true
    ? 'Conforme RGPD'
    : agent.euCompliance.gdprCompliant === 'partial'
    ? 'RGPD partiel'
    : 'Non conforme RGPD'
  const euData = agent.euCompliance.hasEuDataResidency ? 'Résidence données UE' : ''

  return {
    title: `${agent.name} — Avis, Tarifs & Conformité RGPD pour PME Luxembourg`,
    description: `${agent.description.fr} ${gdpr}. ${euData ? euData + '. ' : ''}Tarifs : ${agent.pricing.fr}. Fiche complète pour PME luxembourgeoises.`,
    alternates: { canonical: `${SITE_URL}/agents/${agent.slug}` },
    openGraph: {
      title: `${agent.name} — Conformité RGPD & Tarifs | OpenLetz`,
      description: agent.description.fr,
      url: `${SITE_URL}/agents/${agent.slug}`,
    },
  }
}

export default function AgentSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
