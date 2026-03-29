import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Script from 'next/script';
import type { Metadata } from 'next';
import { safeJsonLd } from '@/lib/safeJsonLd';
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
  es: 'Spanish',
  ru: 'Russian',
  ar: 'Arabic',
  tr: 'Turkish',
  uk: 'Ukrainian',
};

const localeOg: Record<string, string> = {
  fr: 'fr_LU',
  en: 'en_GB',
  de: 'de_DE',
  lb: 'lb_LU',
  it: 'it_IT',
  pt: 'pt_PT',
  es: 'es_ES',
  ru: 'ru_RU',
  ar: 'ar_SA',
  tr: 'tr_TR',
  uk: 'uk_UA',
};

// Additional OG alternate locales for broader reach
const ogAlternateLocales: Record<string, string[]> = {
  fr: ['fr_FR', 'fr_BE', 'fr_CH', 'fr_CA', 'fr_MA', 'fr_SN', 'fr_CI', 'fr_CM', 'fr_CD'],
  de: ['de_DE', 'de_AT', 'de_CH', 'de_LU'],
  en: ['en_US', 'en_GB', 'en_AU', 'en_CA', 'en_IE', 'en_IN', 'en_ZA'],
  it: ['it_IT', 'it_CH'],
  pt: ['pt_PT', 'pt_BR', 'pt_AO', 'pt_MZ'],
  es: ['es_ES', 'es_MX', 'es_AR', 'es_CO', 'es_CL', 'es_PE', 'es_EC', 'es_VE', 'es_US'],
  ru: ['ru_RU', 'ru_BY', 'ru_KZ', 'ru_KG', 'ru_MD'],
  ar: ['ar_SA', 'ar_AE', 'ar_EG', 'ar_MA', 'ar_DZ', 'ar_TN', 'ar_QA', 'ar_KW', 'ar_BH', 'ar_OM', 'ar_JO', 'ar_LB', 'ar_IQ'],
  tr: ['tr_TR', 'tr_CY'],
  uk: ['uk_UA'],
  lb: [],
};

// hreflang mappings for cross-country targeting
// Maximise reach: every country where the language is official or widely spoken
const hreflangMap: Record<string, string[]> = {
  fr: [
    'fr-LU', 'fr-FR', 'fr-BE', 'fr-CH', 'fr-CA',           // Europe + Canada
    'fr-MA', 'fr-TN', 'fr-DZ', 'fr-SN', 'fr-CI',           // Maghreb + West Africa
    'fr-CM', 'fr-CD', 'fr-CG', 'fr-GA', 'fr-ML',           // Central + West Africa
    'fr-BF', 'fr-NE', 'fr-TD', 'fr-GN', 'fr-BJ',           // West + Central Africa
    'fr-TG', 'fr-RW', 'fr-BI', 'fr-MG', 'fr-MU',           // East Africa + Indian Ocean
    'fr-HT', 'fr-MC', 'fr-RE', 'fr-GP', 'fr-MQ',           // Caribbean + DOM-TOM
    'fr-GF', 'fr-PF', 'fr-NC',                               // Overseas territories
  ],
  de: [
    'de-LU', 'de-DE', 'de-AT', 'de-CH', 'de-LI', 'de-BE',  // All German-speaking
  ],
  it: [
    'it-LU', 'it-IT', 'it-CH', 'it-SM', 'it-VA',            // Italy + Swiss Italian + microstates
  ],
  pt: [
    'pt-LU', 'pt-PT', 'pt-BR', 'pt-AO', 'pt-MZ',           // Europe + Brazil + Lusophone Africa
    'pt-CV', 'pt-GW', 'pt-ST', 'pt-TL',                     // Cape Verde, Guinea-Bissau, etc.
  ],
  en: [
    'en', 'en-GB', 'en-US', 'en-IE', 'en-AU', 'en-NZ',     // Core Anglophone
    'en-CA', 'en-SG', 'en-IN', 'en-ZA', 'en-NG',            // Commonwealth + key markets
    'en-KE', 'en-GH', 'en-PH',                               // East Africa + SE Asia
  ],
  es: [
    'es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-CL',           // Spain + major LATAM
    'es-PE', 'es-EC', 'es-VE', 'es-BO', 'es-PY',           // Andean + Southern
    'es-UY', 'es-CR', 'es-PA', 'es-DO', 'es-GT',           // Central America + Caribbean
    'es-HN', 'es-SV', 'es-NI', 'es-CU', 'es-PR',           // Central America + Caribbean
    'es-US', 'es-GQ',                                         // US Hispanic + Eq. Guinea
  ],
  ru: [
    'ru-RU', 'ru-BY', 'ru-KZ', 'ru-KG', 'ru-TJ',           // Russia + CIS
    'ru-UZ', 'ru-MD', 'ru-AM', 'ru-AZ', 'ru-GE',           // Former Soviet states
    'ru-LV', 'ru-EE', 'ru-LT', 'ru-IL',                     // Baltics + Israel (large diaspora)
  ],
  ar: [
    'ar-SA', 'ar-AE', 'ar-EG', 'ar-MA', 'ar-DZ',           // Gulf + North Africa
    'ar-TN', 'ar-LY', 'ar-IQ', 'ar-JO', 'ar-LB',           // Levant + Maghreb
    'ar-SY', 'ar-KW', 'ar-QA', 'ar-BH', 'ar-OM',           // Gulf states
    'ar-YE', 'ar-SD', 'ar-SO', 'ar-MR', 'ar-PS',           // East Africa + Palestine
  ],
  tr: [
    'tr-TR', 'tr-CY', 'tr-DE', 'tr-NL', 'tr-AT',           // Turkey + large diasporas in EU
    'tr-BE', 'tr-FR',                                         // Belgium + France diaspora
  ],
  uk: [
    'uk-UA', 'uk-PL', 'uk-CZ', 'uk-DE',                     // Ukraine + large diaspora (post-2022)
    'uk-CA', 'uk-US',                                         // North American diaspora
  ],
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
    es: 'OpenLetz — Simulador Ayudas Digitalización & IA Luxemburgo | Subvenciones PYME',
    ru: 'OpenLetz — Симулятор субсидий на цифровизацию и ИИ для МСП в Люксембурге',
    ar: 'OpenLetz — محاكي منح الرقمنة والذكاء الاصطناعي للشركات الصغيرة في لوكسمبورغ',
    tr: 'OpenLetz — Lüksemburg KOBİ Dijitalleşme & Yapay Zekâ Hibe Simülatörü',
    uk: 'OpenLetz — Симулятор субсидій на цифровізацію та ШІ для МСП у Люксембурзі',
  };

  const descriptions: Record<string, string> = {
    fr: "Simulateur gratuit d'éligibilité aux aides luxembourgeoises pour PME. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — jusqu'à 25 000 € de subvention.",
    en: 'Free eligibility simulator for Luxembourg SME grants. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — up to €25,000 in funding.',
    de: 'Kostenloser Förderfähigkeitssimulator für luxemburgische KMU. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — bis zu 25.000 €.',
    lb: "Gratis Eligibilitéitssimulator fir Lëtzebuerger KMU. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — bis zu 25.000 € Subventioun.",
    it: 'Simulatore gratuito di ammissibilità per sovvenzioni PMI lussemburghesi. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — fino a 25.000 €.',
    pt: 'Simulador gratuito de elegibilidade para apoios PME luxemburgueses. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — até 25.000 €.',
    es: 'Simulador gratuito de elegibilidad para ayudas luxemburguesas a PYMES. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — hasta 25.000 € de subvención.',
    ru: 'Бесплатный симулятор для определения права на субсидии Люксембурга для МСП. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — до 25 000 €.',
    ar: 'محاكي مجاني لتحديد أهلية الشركات الصغيرة والمتوسطة للحصول على منح لوكسمبورغ. SME Package، Fit 4 Digital، Fit 4 AI، Fit 4 Innovation — حتى 25,000 يورو.',
    tr: 'Lüksemburg KOBİ hibeleri için ücretsiz uygunluk simülatörü. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — 25.000 €\'ya kadar hibe.',
    uk: 'Безкоштовний симулятор для визначення права на субсидії Люксембургу для МСП. SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation — до 25 000 €.',
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

  // Build og:locale:alternate list — include all country variants
  const allOgLocales = new Set<string>();
  for (const [loc, alts] of Object.entries(ogAlternateLocales)) {
    allOgLocales.add(localeOg[loc]);
    for (const alt of alts) allOgLocales.add(alt);
  }
  allOgLocales.delete(localeOg[locale]); // exclude current
  const ogAlternates = Array.from(allOgLocales);

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
  inLanguage: ['fr', 'en', 'de', 'lb', 'it', 'pt', 'es', 'ru', 'ar', 'tr', 'uk'],
  availableLanguage: [
    { '@type': 'Language', name: 'French', alternateName: 'fr' },
    { '@type': 'Language', name: 'English', alternateName: 'en' },
    { '@type': 'Language', name: 'German', alternateName: 'de' },
    { '@type': 'Language', name: 'Luxembourgish', alternateName: 'lb' },
    { '@type': 'Language', name: 'Italian', alternateName: 'it' },
    { '@type': 'Language', name: 'Portuguese', alternateName: 'pt' },
    { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
    { '@type': 'Language', name: 'Russian', alternateName: 'ru' },
    { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
    { '@type': 'Language', name: 'Turkish', alternateName: 'tr' },
    { '@type': 'Language', name: 'Ukrainian', alternateName: 'uk' },
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

  // BreadcrumbList JSON-LD for homepage
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'fr' ? 'Accueil' : locale === 'en' ? 'Home' : locale === 'de' ? 'Startseite' : locale === 'lb' ? 'Heem' : locale === 'it' ? 'Home' : 'Início',
        item: `${SITE_URL}/${locale}`,
      },
    ],
  };

  // FAQPage JSON-LD — dynamically generated from locale messages
  const faqMessages = (messages as Record<string, Record<string, Record<string, string>>>)?.faq || {};
  const faqEntries = [1, 2, 3, 4, 5]
    .map((i) => {
      const q = faqMessages[String(i)]?.q;
      const a = faqMessages[String(i)]?.a;
      if (!q || !a) return null;
      return {
        '@type': 'Question' as const,
        name: q,
        acceptedAnswer: { '@type': 'Answer' as const, text: a },
      };
    })
    .filter(Boolean);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries,
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: locale === 'fr'
      ? 'Comment simuler votre éligibilité aux aides luxembourgeoises'
      : 'How to simulate your eligibility for Luxembourg grants',
    description: locale === 'fr'
      ? 'Répondez à 6 questions et découvrez les programmes de subventions auxquels votre PME est éligible.'
      : 'Answer 6 questions and discover which grant programs your SME is eligible for.',
    totalTime: 'PT2M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: locale === 'fr' ? 'Lancez le simulateur' : 'Start the simulator',
        text: locale === 'fr'
          ? 'Cliquez sur "Commencer" pour démarrer le questionnaire gratuit.'
          : 'Click "Start" to begin the free questionnaire.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: locale === 'fr' ? 'Répondez à 6 questions' : 'Answer 6 questions',
        text: locale === 'fr'
          ? 'Taille, secteur, statut luxembourgeois, maturité digitale, défi principal, usage IA.'
          : 'Company size, sector, Luxembourg status, digital maturity, biggest challenge, AI usage.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: locale === 'fr' ? 'Découvrez vos résultats' : 'Get your results',
        text: locale === 'fr'
          ? 'Recevez la liste des programmes éligibles avec les montants estimés et recommandations de projets.'
          : 'Receive the list of eligible programs with estimated grant amounts and project recommendations.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: locale === 'fr' ? 'Contactez un expert' : 'Contact an expert',
        text: locale === 'fr'
          ? 'Demandez un accompagnement personnalisé pour monter votre dossier de subvention.'
          : 'Request personalized support to prepare your grant application.',
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
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
        />
        <Script
          id="json-ld-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(webAppJsonLd) }}
        />
        <Script
          id="json-ld-localbusiness"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(localBusinessJsonLd) }}
        />
        <Script
          id="json-ld-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
        />
        <Script
          id="json-ld-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
        />
        <Script
          id="json-ld-howto"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(howToJsonLd) }}
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
