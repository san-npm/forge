import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Providers from './providers'

const SITE_URL = 'https://www.openletz.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OpenLetz — Simulateur Aides Digitalisation & IA Luxembourg | Subventions PME',
    template: '%s | OpenLetz Luxembourg',
  },
  description:
    'Simulateur gratuit d\'éligibilité aux aides luxembourgeoises pour PME. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — jusqu\'à 25 000 € de subvention. Résultats en 10 secondes.',
  keywords: [
    'aides digitalisation Luxembourg',
    'subventions PME Luxembourg',
    'SME Package Digital',
    'SME Package IA',
    'Fit 4 Digital',
    'Fit 4 AI',
    'Fit 4 Innovation',
    'Luxinnovation',
    'transformation digitale Luxembourg',
    'aides entreprises Luxembourg',
    'simulateur subventions',
    'House of Entrepreneurship',
    'digitalisation PME',
    'intelligence artificielle PME Luxembourg',
    'Förderprogramme Luxemburg',
    'KMU Digitalisierung Luxemburg',
    'grants Luxembourg SME',
    'digitalization grants',
    'Grande Région',
    'aides publiques Luxembourg',
  ],
  authors: [{ name: 'OpenLetz', url: SITE_URL }],
  creator: 'OpenLetz — COMMIT MEDIA SARL',
  publisher: 'OpenLetz',
  formatDetection: { telephone: true, email: true },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'OpenLetz — Simulateur Aides Digitalisation & IA Luxembourg',
    description:
      'Simulateur gratuit : identifiez les subventions luxembourgeoises pour votre PME en 10 secondes. Jusqu\'à 25 000 € et 70 % de couverture.',
    url: SITE_URL,
    siteName: 'OpenLetz',
    locale: 'fr_LU',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'OpenLetz — Simulateur aides digitalisation Luxembourg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenLetz — Simulateur Aides Digitalisation Luxembourg',
    description: 'Identifiez vos subventions PME en 10 sec. Gratuit.',
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  verification: {
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'OpenLetz',
  legalName: 'COMMIT MEDIA SARL',
  url: SITE_URL,
  logo: `${SITE_URL}/openletz-logo.png`,
  description:
    'Simulateur gratuit d\'aides luxembourgeoises pour la transformation digitale et l\'innovation IA des PME.',
  email: 'bob@openletz.com',
  telephone: '+352661968051',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Luxembourg',
    addressCountry: 'LU',
  },
  areaServed: [
    { '@type': 'Country', name: 'Luxembourg' },
    { '@type': 'AdministrativeArea', name: 'Grande Région' },
  ],
  sameAs: [],
  knowsAbout: [
    'SME Package Digital',
    'SME Package AI',
    'Fit 4 Digital',
    'Fit 4 AI',
    'Fit 4 Innovation',
    'Luxinnovation',
    'digitalisation PME',
    'intelligence artificielle',
  ],
}

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${SITE_URL}/#webapp`,
  name: 'OpenLetz — Simulateur d\'Aides Luxembourg',
  url: SITE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  description:
    'Simulez votre éligibilité aux aides luxembourgeoises pour la transformation digitale et l\'IA. 6 programmes analysés, résultats en 10 secondes.',
  creator: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
  },
  inLanguage: ['fr', 'en', 'de', 'lb', 'it', 'pt'],
  availableLanguage: [
    { '@type': 'Language', name: 'French', alternateName: 'fr' },
    { '@type': 'Language', name: 'English', alternateName: 'en' },
    { '@type': 'Language', name: 'German', alternateName: 'de' },
    { '@type': 'Language', name: 'Luxembourgish', alternateName: 'lb' },
    { '@type': 'Language', name: 'Italian', alternateName: 'it' },
    { '@type': 'Language', name: 'Portuguese', alternateName: 'pt' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2Z75PD960S"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-2Z75PD960S');`}
        </Script>
        <Script
          id="json-ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="json-ld-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
