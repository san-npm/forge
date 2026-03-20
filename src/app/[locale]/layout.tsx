import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Script from 'next/script';
import type { Metadata } from 'next';
import Providers from './providers';
import '../globals.css';

const SITE_URL = 'https://www.openletz.com';

const localeNames: Record<string, string> = {
  fr: 'French',
  en: 'English',
  de: 'German',
  lb: 'Luxembourgish',
  it: 'Italian',
  pt: 'Portuguese',
};

const localeOg: Record<string, string> = {
  fr: 'fr_LU',
  en: 'en_GB',
  de: 'de_LU',
  lb: 'lb_LU',
  it: 'it_LU',
  pt: 'pt_PT',
};

// hreflang mappings for cross-country targeting
const hreflangMap: Record<string, string[]> = {
  fr: ['fr-LU', 'fr-FR', 'fr-BE', 'fr-CH'],
  de: ['de-LU', 'de-DE', 'de-AT', 'de-CH'],
  it: ['it-LU', 'it-IT', 'it-CH'],
  pt: ['pt-LU', 'pt-PT', 'pt-BR'],
  en: ['en'],
  lb: ['lb'],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    fr: 'OpenLetz — Simulateur Aides Digitalisation & IA Luxembourg | Subventions PME',
    en: 'OpenLetz — SME Digitalization & AI Grants Simulator Luxembourg',
    de: 'OpenLetz — KMU Digitalisierung & KI Fördersimulator Luxemburg',
    lb: 'OpenLetz — KMU Digitaliséierung & KI Hëllefen Simulator Lëtzebuerg',
    it: 'OpenLetz — Simulatore Sovvenzioni Digitalizzazione & IA Lussemburgo',
    pt: 'OpenLetz — Simulador Apoios Digitalização & IA Luxemburgo',
  };

  const descriptions: Record<string, string> = {
    fr: "Simulateur gratuit d'éligibilité aux aides luxembourgeoises pour PME. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — jusqu'à 25 000 € de subvention.",
    en: 'Free eligibility simulator for Luxembourg SME grants. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — up to €25,000 in funding.',
    de: 'Kostenloser Förderfähigkeitssimulator für luxemburgische KMU. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — bis zu 25.000 €.',
    lb: "Gratis Eligibilitéitssimulator fir Lëtzebuerger KMU. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — bis zu 25.000 € Subventioun.",
    it: 'Simulatore gratuito di ammissibilità per sovvenzioni PMI lussemburghesi. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — fino a 25.000 €.',
    pt: 'Simulador gratuito de elegibilidade para apoios PME luxemburgueses. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — até 25.000 €.',
  };

  const canonicalUrl = `${SITE_URL}/${locale}`;

  // Build hreflang alternates
  const languages: Record<string, string> = {};
  for (const [loc, hreflangs] of Object.entries(hreflangMap)) {
    for (const hl of hreflangs) {
      languages[hl] = `${SITE_URL}/${loc}`;
    }
  }
  languages['x-default'] = `${SITE_URL}/fr`;

  // Build og:locale:alternate list
  const ogAlternates = Object.values(localeOg).filter((l) => l !== localeOg[locale]);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: titles[locale] || titles.fr,
      template: '%s | OpenLetz Luxembourg',
    },
    description: descriptions[locale] || descriptions.fr,
    keywords: [
      'aides digitalisation Luxembourg',
      'subventions PME Luxembourg',
      'SME Package Digital',
      'Fit 4 Digital',
      'Fit 4 AI',
      'Fit 4 Innovation',
      'Luxinnovation',
      'grants Luxembourg SME',
      'KMU Digitalisierung Luxemburg',
    ],
    authors: [{ name: 'OpenLetz', url: SITE_URL }],
    creator: 'OpenLetz — COMMIT MEDIA SARL',
    publisher: 'OpenLetz',
    formatDetection: { telephone: true, email: true },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      url: canonicalUrl,
      siteName: 'OpenLetz',
      locale: localeOg[locale] || 'fr_LU',
      alternateLocale: ogAlternates,
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
      title: titles[locale] || titles.fr,
      description: (descriptions[locale] || descriptions.fr).slice(0, 200),
      images: [`${SITE_URL}/og-image.png`],
    },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      ICBM: '49.6117, 6.1300',
      'content-language': locale,
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
  };
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
    "Simulateur gratuit d'aides luxembourgeoises pour la transformation digitale et l'innovation IA des PME.",
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
  sameAs: ['https://www.linkedin.com/company/openletz'],
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
};

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
  sameAs: ['https://www.linkedin.com/company/openletz'],
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${SITE_URL}/#webapp`,
  name: "OpenLetz — Simulateur d'Aides Luxembourg",
  url: SITE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  description:
    "Simulez votre éligibilité aux aides luxembourgeoises pour la transformation digitale et l'IA. 6 programmes analysés, résultats en 10 secondes.",
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
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  // FAQPage JSON-LD (homepage FAQ in French — the default indexable language)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Le simulateur est-il vraiment gratuit ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui, le simulateur est 100% gratuit et sans engagement. Vous répondez à 6 questions et obtenez vos résultats instantanément.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quels programmes sont analysés ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nous analysons 6 programmes luxembourgeois : SME Package Digital, SME Package AI, SME Package Cybersecurity, Fit 4 Digital, Fit 4 AI et Fit 4 Innovation.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qui peut bénéficier de ces aides ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Toute PME établie au Luxembourg avec une autorisation d'établissement. La plupart des secteurs sont éligibles, y compris HORECA, commerce, artisanat, services et industrie.",
        },
      },
      {
        '@type': 'Question',
        name: 'Combien puis-je obtenir ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Selon votre profil, vous pouvez recevoir jusqu'à 25 000 € d'aides avec jusqu'à 70% de vos coûts de projet couverts.",
        },
      },
      {
        '@type': 'Question',
        name: 'Combien de temps prend le processus ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "La simulation prend 10 secondes. Si vous êtes éligible, le processus de demande d'aide prend généralement 4 à 8 semaines selon le programme.",
        },
      },
    ],
  };

  return (
    <html lang={locale}>
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
        <Script
          id="json-ld-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
