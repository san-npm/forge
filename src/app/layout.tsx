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
    'aide digitalisation Luxembourg 2026',
    'subvention IA PME Luxembourg',
    'Luxinnovation programmes 2026',
    'digitalisation commerce Luxembourg',
    'aide création site web Luxembourg',
    'KMU Förderung Luxemburg 2026',
    'SME grants Luxembourg English',
    'conformité RGPD outils IA',
    'SME Package Cybersécurité',
    'Saarland Lorraine Wallonie',
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
  other: {
    'geo.region': 'LU',
    'geo.placename': 'Luxembourg',
    'geo.position': '49.6117;6.1300',
    'ICBM': '49.6117, 6.1300',
    'content-language': 'fr, en, de, lb, it, pt',
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
  sameAs: [
    'https://www.linkedin.com/company/openletz',
  ],
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

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#localbusiness`,
  name: 'OpenLetz — COMMIT MEDIA SARL',
  url: SITE_URL,
  logo: `${SITE_URL}/openletz-logo.png`,
  image: `${SITE_URL}/og-image.png`,
  description:
    'Accompagnement des PME luxembourgeoises dans leur transformation digitale et IA. Simulateur de subventions gratuit, développement web, intégration IA.',
  email: 'bob@openletz.com',
  telephone: '+352661968051',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Luxembourg',
    addressRegion: 'Luxembourg',
    addressCountry: 'LU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 49.6117,
    longitude: 6.13,
  },
  areaServed: [
    { '@type': 'Country', name: 'Luxembourg' },
    { '@type': 'AdministrativeArea', name: 'Grande Région' },
  ],
  priceRange: '€€',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  sameAs: [
    'https://www.linkedin.com/company/openletz',
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
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NR4V9KLL');`}
        </Script>
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
        <Script
          id="json-ld-localbusiness"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NR4V9KLL"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
