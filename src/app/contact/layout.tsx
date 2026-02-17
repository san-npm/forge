import type { Metadata } from 'next'

const SITE_URL = 'https://www.openletz.com'

export const metadata: Metadata = {
  title: 'Contact — Accompagnement Subventions & Projets Digitaux',
  description:
    'Contactez OpenLetz pour un accompagnement personnalisé dans vos démarches de subventions luxembourgeoises. Conseil gratuit, montage de dossier, projets digitaux et IA.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contactez OpenLetz — Expert Aides Digitalisation Luxembourg',
    description: 'Accompagnement personnalisé pour vos subventions et projets digitaux au Luxembourg.',
    url: `${SITE_URL}/contact`,
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
