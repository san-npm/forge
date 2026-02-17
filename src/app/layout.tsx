import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'

const siteUrl = 'https://openletz.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'OpenLetz — Simulateur aides Luxembourg / Luxembourg Grants Simulator',
    template: '%s | OpenLetz',
  },
  description:
    'Simulez vos aides à la digitalisation et IA au Luxembourg & Grande Région. Gratuit, 6 langues. / Simulate your digitalization and AI grants in Luxembourg & Greater Region. Free, 6 languages.',
  keywords: [
    'aides Luxembourg',
    'digitalisation PME',
    'subventions IA Luxembourg',
    'SME Package Digital',
    'Fit 4 Digital',
    'Fit 4 AI',
    'Grande Région',
    'Großregion',
    'Luxembourg grants',
    'AI funding Luxembourg',
    'digital transformation Luxembourg',
    'Lorraine',
    'Wallonie',
    'Saarland',
    'Rheinland-Pfalz',
  ],
  authors: [{ name: 'OpenLetz' }],
  creator: 'OpenLetz',
  publisher: 'OpenLetz',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'fr': siteUrl,
      'en': `${siteUrl}?lang=en`,
      'de': `${siteUrl}?lang=de`,
      'lb': `${siteUrl}?lang=lb`,
      'it': `${siteUrl}?lang=it`,
      'pt': `${siteUrl}?lang=pt`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_LU',
    alternateLocale: ['en_GB', 'de_DE', 'lb_LU', 'it_IT', 'pt_PT'],
    url: siteUrl,
    siteName: 'OpenLetz',
    title: 'OpenLetz — Simulateur aides digitalisation & IA Luxembourg',
    description:
      'Découvrez en 2 minutes les aides publiques luxembourgeoises pour votre transformation digitale et IA. Tarifs préférentiels Grande Région.',
    images: [
      {
        url: `${siteUrl}/openletz.svg`,
        width: 69,
        height: 69,
        alt: 'OpenLetz Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'OpenLetz — Luxembourg Grants Simulator',
    description:
      'Find out in 2 minutes which Luxembourg digitalization & AI grants your SME can get. Free, 6 languages. Greater Region discount available.',
    images: [`${siteUrl}/openletz.svg`],
  },
  other: {
    'geo.region': 'LU',
    'geo.placename': 'Luxembourg',
    'geo.position': '49.6117;6.1300',
    'ICBM': '49.6117, 6.1300',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'OpenLetz',
    description:
      'Simulateur d\'aides à la digitalisation et IA pour PME au Luxembourg et Grande Région. Conseil en transformation digitale.',
    url: siteUrl,
    logo: `${siteUrl}/openletz.svg`,
    image: `${siteUrl}/openletz.svg`,
    areaServed: [
      {
        '@type': 'Country',
        name: 'Luxembourg',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Grande Région / Greater Region',
        containsPlace: [
          { '@type': 'AdministrativeArea', name: 'Lorraine, France' },
          { '@type': 'AdministrativeArea', name: 'Wallonie, Belgique' },
          { '@type': 'AdministrativeArea', name: 'Saarland, Deutschland' },
          { '@type': 'AdministrativeArea', name: 'Rheinland-Pfalz, Deutschland' },
        ],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'LU',
      addressLocality: 'Luxembourg',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.6117,
      longitude: 6.13,
    },
    serviceType: [
      'Digital Transformation Consulting',
      'AI Integration',
      'Grant Simulation',
      'Website & E-commerce Development',
      'Business Process Automation',
    ],
    availableLanguage: [
      { '@type': 'Language', name: 'French' },
      { '@type': 'Language', name: 'English' },
      { '@type': 'Language', name: 'Luxembourgish' },
      { '@type': 'Language', name: 'German' },
      { '@type': 'Language', name: 'Italian' },
      { '@type': 'Language', name: 'Portuguese' },
    ],
    priceRange: '€€',
    knowsAbout: [
      'SME Package Digital Luxembourg',
      'SME Package AI Luxembourg',
      'Fit 4 Digital',
      'Fit 4 AI',
      'Fit 4 Innovation',
      'Luxembourg government grants',
      'Grande Région cross-border business',
    ],
  }

  return (
    <html lang="fr">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
