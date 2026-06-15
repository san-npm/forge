import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { SITE_URL, LOCALES, DEFAULT_LOCALE, localeUrl, type Locale } from '@/lib/site-config';
import { isProductionHost } from '@/lib/indexing';
import { fontVariables } from '@/lib/fonts';
import {
  organizationJsonLd,
  professionalServiceJsonLd,
  webSiteJsonLd,
  breadcrumbJsonLd,
  homeBreadcrumbLabel,
} from '@/lib/jsonld';
import { Analytics } from '@/components/Analytics';
import { ConsentBanner } from '@/components/ConsentBanner';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { MagneticCursor } from '@/components/ui/MagneticCursor';
import '../globals.css';

const localeOg: Record<Locale, string> = {
  en: 'en_GB',
  fr: 'fr_LU',
  de: 'de_DE',
};

// Per-locale hreflang targeting: Luxembourg + Grande Region + EU expat market.
const hreflangMap: Record<Locale, string[]> = {
  en: ['en', 'en-LU', 'en-GB', 'en-US', 'en-IE'],
  fr: ['fr-LU', 'fr-FR', 'fr-BE', 'fr-CH'],
  de: ['de-LU', 'de-DE', 'de-AT', 'de-CH', 'de-BE'],
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (hasLocale(LOCALES, locale) ? locale : DEFAULT_LOCALE) as Locale;

  const titles: Record<Locale, string> = {
    en: 'Openletz · A Luxembourg AI agency',
    fr: 'Openletz · Une agence IA au Luxembourg',
    de: 'Openletz · Eine KI-Agentur in Luxemburg',
  };

  const descriptions: Record<Locale, string> = {
    en: 'Openletz is a Luxembourg AI agency. We build AI agents, chatbots and automation, the websites and shops around them, and Web3 when it helps, hosted in Europe.',
    fr: "Openletz est une agence IA au Luxembourg. Nous concevons des agents IA, chatbots et automatisations, les sites et boutiques autour, et du Web3 quand c'est utile, hebergés en Europe.",
    de: 'Openletz ist eine KI-Agentur in Luxemburg. Wir bauen KI-Agenten, Chatbots und Automatisierung, die Websites und Shops dazu und Web3, wenn es hilft, gehostet in Europa.',
  };

  const canonicalUrl = localeUrl(loc);
  const shouldIndex = isProductionHost();

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    for (const hl of hreflangMap[l]) {
      languages[hl] = localeUrl(l);
    }
  }
  languages['x-default'] = localeUrl(DEFAULT_LOCALE);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: titles[loc],
      template: '%s · Openletz',
    },
    description: descriptions[loc],
    keywords: [
      'Luxembourg AI agency',
      'AI agents',
      'AI automation',
      'chatbots',
      'Next.js websites Luxembourg',
      'e-commerce Luxembourg',
      'Web3 development',
      'EU AI Act',
      'GDPR',
    ],
    authors: [{ name: 'Openletz', url: SITE_URL }],
    creator: 'Openletz · Commit Media S.à r.l.',
    publisher: 'Openletz',
    formatDetection: { telephone: true, email: true },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: titles[loc],
      description: descriptions[loc],
      url: canonicalUrl,
      siteName: 'Openletz',
      locale: localeOg[loc],
      alternateLocale: (Object.values(localeOg) as string[]).filter((v) => v !== localeOg[loc]),
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Openletz · A Luxembourg AI agency',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[loc],
      description: descriptions[loc].slice(0, 200),
      images: [`${SITE_URL}/og-image.png`],
    },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      ICBM: '49.6117, 6.1300',
      'content-language': loc,
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GSC_VERIFICATION || undefined,
      other: {
        ...(process.env.BING_VERIFICATION ? { 'msvalidate.01': process.env.BING_VERIFICATION } : {}),
        ...(process.env.YANDEX_VERIFICATION
          ? { 'yandex-verification': process.env.YANDEX_VERIFICATION }
          : {}),
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
  const loc = locale as Locale;
  const messages = await getMessages();

  const breadcrumb = breadcrumbJsonLd(loc, [
    { name: homeBreadcrumbLabel(loc), url: localeUrl(loc) },
  ]);

  return (
    <html lang={loc} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Site-wide JSON-LD. Plain <script> (NOT next/script) so the structured
            data renders into the static SSR HTML — next/script defers it into the
            React Flight payload, invisible to AI crawlers / structured-data parsers
            that read raw markup without executing JS. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(webSiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(professionalServiceJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }}
        />
      </head>
      <body className="antialiased">
        <Analytics />
        <ConsentBanner locale={loc} />
        {/* Global custom cursor island: renders null on touch / reduced-motion. */}
        <MagneticCursor />
        <NextIntlClientProvider messages={messages} locale={loc}>
          {/* Layout-level chrome: ONE Nav + ONE Footer wrap every page. */}
          <Nav locale={loc} />
          {children}
          <Footer locale={loc} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
