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
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      'ICBM': '49.6117, 6.1300',
    },
    openGraph: {
      title: `${agent.name} — Conformité RGPD & Tarifs | OpenLetz`,
      description: agent.description.fr,
      url: `${SITE_URL}/agents/${agent.slug}`,
    },
  }
}

export default function AgentSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const agent = AGENTS.find((a) => a.slug === params.slug)
  const breadcrumbJsonLd = agent
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OpenLetz', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Outils IA', item: `${SITE_URL}/agents` },
          { '@type': 'ListItem', position: 3, name: agent.name, item: `${SITE_URL}/agents/${agent.slug}` },
        ],
      }
    : null

  return (
    <>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      {children}
    </>
  )
}
