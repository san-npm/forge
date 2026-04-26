import type { Metadata } from 'next'
import { safeJsonLd } from '@/lib/safeJsonLd'

const SITE_URL = 'https://www.openletz.com'
const PATH = '/clients'

const INDEXABLE_LOCALES = new Set(['fr', 'en', 'de', 'lb', 'pt'])
const IS_PRODUCTION_HOST = process.env.VERCEL_ENV === 'production'

const titles: Record<string, string> = {
  fr: 'Nos clients — Réalisations OpenLetz Luxembourg',
  en: 'Our Clients — OpenLetz Luxembourg Case Studies',
  de: 'Unsere Kunden — OpenLetz Luxemburg Referenzen',
  lb: 'Eis Cliente’n — OpenLetz Lëtzebuerg Realisatiounen',
  it: 'I nostri clienti — Realizzazioni OpenLetz Lussemburgo',
  pt: 'Os nossos clientes — Realizações OpenLetz Luxemburgo',
  es: 'Nuestros clientes — Realizaciones OpenLetz Luxemburgo',
  ru: 'Наши клиенты — Кейсы OpenLetz Люксембург',
  ar: 'عملاؤنا — مشاريع OpenLetz لوكسمبورغ',
  tr: 'Müşterilerimiz — OpenLetz Lüksemburg Vaka Çalışmaları',
  uk: 'Наші клієнти — Кейси OpenLetz Люксембург',
}

const descriptions: Record<string, string> = {
  fr: "Sites web et boutiques en ligne livrés par OpenLetz pour des PME luxembourgeoises : Vins Fins (bar à vins, Grund) et La Grocerie (sandwicherie & cave à vins naturels, Grund, depuis 1923). Aides luxembourgeoises éligibles.",
  en: 'Websites and online shops delivered by OpenLetz for Luxembourg SMEs: Vins Fins (wine bar, Grund) and La Grocerie (deli & natural-wine cellar, Grund, since 1923). Eligible for Luxembourg public grants.',
  de: 'Webseiten und Online-Shops von OpenLetz für luxemburgische KMU: Vins Fins (Weinbar, Grund) und La Grocerie (Sandwicherie & Naturweinkeller, Grund, seit 1923). Förderfähig in Luxemburg.',
  lb: 'Websäiten an Online-Shops geliwwert vun OpenLetz fir Lëtzebuerger KMU: Vins Fins (Weinbar, Gronn) a La Grocerie (Sandwicherie & Naturweinkeller, Gronn, zënter 1923). Lëtzebuerger Hëllefen méiglech.',
  it: 'Siti web e shop online di OpenLetz per PMI lussemburghesi: Vins Fins (wine bar, Grund) e La Grocerie (sandwicheria & cantina naturale, Grund, dal 1923). Sovvenzioni lussemburghesi disponibili.',
  pt: 'Sites e lojas online entregues pela OpenLetz para PMEs luxemburguesas: Vins Fins (bar de vinhos, Grund) e La Grocerie (sandes & vinhos naturais, Grund, desde 1923). Apoios luxemburgueses elegíveis.',
  es: 'Webs y tiendas online entregadas por OpenLetz para PYMES luxemburguesas: Vins Fins (bar de vinos, Grund) y La Grocerie (sandwichería y vinos naturales, Grund, desde 1923). Subvenciones luxemburguesas elegibles.',
  ru: 'Сайты и онлайн-магазины OpenLetz для люксембургских МСП: Vins Fins (винный бар, Гранд) и La Grocerie (сэндвичная и винотека, Гранд, с 1923 года). Возможны субсидии Люксембурга.',
  ar: 'مواقع ومتاجر إلكترونية سلمتها OpenLetz للشركات الصغيرة والمتوسطة في لوكسمبورغ: Vins Fins (بار النبيذ، غروند) و La Grocerie (محل سندويتشات وقبو نبيذ طبيعي، غروند، منذ 1923). منح لوكسمبورغ متاحة.',
  tr: 'OpenLetz\'in Lüksemburg KOBİ\'leri için teslim ettiği web siteleri ve online mağazalar: Vins Fins (şarap barı, Grund) ve La Grocerie (sandviç & doğal şarap mahzeni, Grund, 1923\'ten beri). Lüksemburg hibelerine uygun.',
  uk: 'Сайти та онлайн-магазини OpenLetz для люксембурзьких МСП: Vins Fins (винний бар, Ґрунд) та La Grocerie (сендвічна та винотека, Ґрунд, з 1923 року). Можливі люксембурзькі субсидії.',
}

const breadcrumbLabels: Record<string, { home: string; clients: string }> = {
  fr: { home: 'Accueil', clients: 'Clients' },
  en: { home: 'Home', clients: 'Clients' },
  de: { home: 'Startseite', clients: 'Kunden' },
  lb: { home: 'Heem', clients: 'Cliente’n' },
  it: { home: 'Home', clients: 'Clienti' },
  pt: { home: 'Início', clients: 'Clientes' },
  es: { home: 'Inicio', clients: 'Clientes' },
  ru: { home: 'Главная', clients: 'Клиенты' },
  ar: { home: 'الرئيسية', clients: 'عملاؤنا' },
  tr: { home: 'Ana Sayfa', clients: 'Müşteriler' },
  uk: { home: 'Головна', clients: 'Клієнти' },
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const title = titles[locale] || titles.en
  const description = descriptions[locale] || descriptions.en
  const canonicalUrl = `${SITE_URL}/${locale}${PATH}`
  const shouldIndex = IS_PRODUCTION_HOST && INDEXABLE_LOCALES.has(locale)

  // hreflang alternates — only the 5 indexable locales (matches sitemap policy)
  const languages: Record<string, string> = {}
  for (const loc of ['fr', 'en', 'de', 'lb', 'pt']) {
    languages[loc] = `${SITE_URL}/${loc}${PATH}`
  }
  languages['x-default'] = `${SITE_URL}/fr${PATH}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, languages },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      ICBM: '49.6117, 6.1300',
    },
  }
}

export default async function ClientsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const labels = breadcrumbLabels[locale] || breadcrumbLabels.en

  // BreadcrumbList — required for Google rich results.
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: labels.home, item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: labels.clients, item: `${SITE_URL}/${locale}${PATH}` },
    ],
  }

  // ItemList of CreativeWork — each project is a citable case study with the
  // client as `about` (Organization) and OpenLetz as `creator`. This shape is
  // what Perplexity, Google AI Overviews and similar engines extract when
  // answering "who built site X for client Y".
  const projectsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: 2,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'CreativeWork',
          '@id': `${SITE_URL}/${locale}${PATH}#vinsfins`,
          name: 'Vins Fins — vinsfins.lu',
          url: 'https://www.vinsfins.lu',
          description:
            "E-commerce et site vitrine pour Vins Fins, bar à vins et restaurant au Grund (Luxembourg). Catalogue plusieurs centaines de vins, panier, paiement Stripe, livraison POST Luxembourg, réservations Zenchef, multi-langue FR/EN/DE/LB.",
          inLanguage: ['fr', 'en', 'de', 'lb'],
          datePublished: '2026-01',
          creator: {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'OpenLetz',
            legalName: 'COMMIT MEDIA SARL',
            url: SITE_URL,
          },
          about: {
            '@type': 'Restaurant',
            name: 'Vins Fins',
            url: 'https://www.vinsfins.lu',
            servesCuisine: ['French', 'Wine bar'],
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Luxembourg',
              addressRegion: 'Grund',
              addressCountry: 'LU',
            },
            areaServed: { '@type': 'Country', name: 'Luxembourg' },
          },
          keywords: [
            'Next.js',
            'Stripe',
            'Vercel',
            'e-commerce Luxembourg',
            'wine shop Luxembourg',
            'restaurant booking',
            'Zenchef',
          ],
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'CreativeWork',
          '@id': `${SITE_URL}/${locale}${PATH}#grocerie`,
          name: 'La Grocerie — lagrocerie.lu',
          url: 'https://www.lagrocerie.lu',
          description:
            "Site e-commerce et vitrine pour La Grocerie, sandwicherie artisanale, épicerie fermière et cave à vins naturels au Grund (Luxembourg) depuis 1923. Paiement Stripe, gestion stock temps-réel, multi-langue.",
          inLanguage: ['fr', 'en', 'de', 'lb'],
          datePublished: '2026-02',
          creator: {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'OpenLetz',
            legalName: 'COMMIT MEDIA SARL',
            url: SITE_URL,
          },
          about: {
            '@type': 'Store',
            name: 'La Grocerie',
            url: 'https://www.lagrocerie.lu',
            foundingDate: '1923',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Luxembourg',
              addressRegion: 'Grund',
              addressCountry: 'LU',
            },
            areaServed: { '@type': 'Country', name: 'Luxembourg' },
          },
          keywords: [
            'Next.js',
            'Stripe',
            'Vercel',
            'natural wine',
            'épicerie Luxembourg',
            'Grund',
          ],
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(projectsJsonLd) }}
      />
      {children}
    </>
  )
}
