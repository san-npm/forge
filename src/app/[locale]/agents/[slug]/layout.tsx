import type { Metadata } from 'next'
import { AGENTS } from '@/lib/agents'
import { safeJsonLd } from '@/lib/safeJsonLd'
import { localeUrl } from '@/lib/locale-url'

const SITE_URL = 'https://www.openletz.com'

type Props = { params: Promise<{ slug: string; locale: string }> }

export async function generateStaticParams() {
  return AGENTS.map((a) => ({ slug: a.slug }))
}

const gdprLabels: Record<string, Record<string, string>> = {
  true: {
    fr: 'Conforme RGPD', en: 'GDPR Compliant', de: 'DSGVO-konform',
    lb: 'RGPD-konform', it: 'Conforme GDPR', pt: 'Conforme RGPD',
    es: 'Conforme RGPD', ru: 'Соответствует GDPR', ar: 'متوافق مع GDPR',
    tr: 'KVKK Uyumlu', uk: 'Відповідає GDPR',
  },
  partial: {
    fr: 'RGPD partiel', en: 'Partial GDPR', de: 'DSGVO teilweise',
    lb: 'RGPD partiell', it: 'GDPR parziale', pt: 'RGPD parcial',
    es: 'RGPD parcial', ru: 'Частично GDPR', ar: 'GDPR جزئي',
    tr: 'Kısmi KVKK', uk: 'Частково GDPR',
  },
  false: {
    fr: 'Non conforme RGPD', en: 'Not GDPR Compliant', de: 'Nicht DSGVO-konform',
    lb: 'Net RGPD-konform', it: 'Non conforme GDPR', pt: 'Não conforme RGPD',
    es: 'No conforme RGPD', ru: 'Не соответствует GDPR', ar: 'غير متوافق مع GDPR',
    tr: 'KVKK Uyumsuz', uk: 'Не відповідає GDPR',
  },
}

const euDataLabels: Record<string, string> = {
  fr: 'Résidence données UE', en: 'EU Data Residency', de: 'EU-Datenresidenz',
  lb: 'EU Daten-Residenz', it: 'Residenza dati UE', pt: 'Residência dados UE',
  es: 'Residencia datos UE', ru: 'Хранение данных в ЕС', ar: 'إقامة البيانات في الاتحاد الأوروبي',
  tr: 'AB Veri İkameti', uk: 'Зберігання даних в ЄС',
}

const titleTemplates: Record<string, string> = {
  fr: '{name} — Avis, Tarifs & Conformité RGPD pour PME Luxembourg',
  en: '{name} — Review, Pricing & GDPR Compliance for Luxembourg SMEs',
  de: '{name} — Bewertung, Preise & DSGVO-Konformität für KMU Luxemburg',
  lb: '{name} — Bewäertung, Präisser & RGPD Konformitéit fir KMU Lëtzebuerg',
  it: '{name} — Recensione, Prezzi & Conformità GDPR per PMI Lussemburgo',
  pt: '{name} — Avaliação, Preços & Conformidade RGPD para PME Luxemburgo',
  es: '{name} — Reseña, Precios & Cumplimiento RGPD para PYMES Luxemburgo',
  ru: '{name} — Обзор, Цены и Соответствие GDPR для МСП Люксембурга',
  ar: '{name} — مراجعة، أسعار وتوافق GDPR للشركات الصغيرة في لوكسمبورغ',
  tr: '{name} — İnceleme, Fiyatlar & KVKK Uyumluluğu Lüksemburg KOBİ\'leri',
  uk: '{name} — Огляд, Ціни та Відповідність GDPR для МСП Люксембургу',
}

const breadcrumbLabels: Record<string, { directory: string }> = {
  fr: { directory: 'Outils IA' }, en: { directory: 'AI Tools' },
  de: { directory: 'KI-Tools' }, lb: { directory: 'KI-Tools' },
  it: { directory: 'Strumenti IA' }, pt: { directory: 'Ferramentas IA' },
  es: { directory: 'Herramientas IA' }, ru: { directory: 'ИИ-инструменты' },
  ar: { directory: 'أدوات الذكاء الاصطناعي' }, tr: { directory: 'YZ Araçları' },
  uk: { directory: 'ШІ-інструменти' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const agent = AGENTS.find((a) => a.slug === slug)
  if (!agent) return { title: locale === 'fr' ? 'Outil IA introuvable' : 'AI Tool not found' }

  const gdprKey = String(agent.euCompliance.gdprCompliant)
  const gdpr = gdprLabels[gdprKey]?.[locale] || gdprLabels[gdprKey]?.en || ''
  const euData = agent.euCompliance.hasEuDataResidency ? (euDataLabels[locale] || euDataLabels.en) : ''
  const desc = agent.description[locale as keyof typeof agent.description] || agent.description.en
  const pricing = agent.pricing[locale as keyof typeof agent.pricing] || agent.pricing.en
  const title = (titleTemplates[locale] || titleTemplates.en).replace('{name}', agent.name)

  return {
    title,
    description: `${desc} ${gdpr}. ${euData ? euData + '. ' : ''}${pricing}.`,
    alternates: { canonical: localeUrl(locale, `/agents/${agent.slug}`) },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      'ICBM': '49.6117, 6.1300',
    },
    openGraph: {
      title: `${agent.name} — ${gdpr} | OpenLetz`,
      description: desc,
      url: localeUrl(locale, `/agents/${agent.slug}`),
    },
  }
}

export default async function AgentSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const agent = AGENTS.find((a) => a.slug === slug)
  const labels = breadcrumbLabels[locale] || breadcrumbLabels.en
  const breadcrumbJsonLd = agent
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OpenLetz', item: localeUrl(locale) },
          { '@type': 'ListItem', position: 2, name: labels.directory, item: localeUrl(locale, '/agents') },
          { '@type': 'ListItem', position: 3, name: agent.name, item: localeUrl(locale, `/agents/${agent.slug}`) },
        ],
      }
    : null

  // SoftwareApplication schema for rich results
  const desc = agent?.description[locale as keyof typeof agent.description] || agent?.description.en || ''
  const pricing = agent?.pricing[locale as keyof typeof agent.pricing] || agent?.pricing.en || ''
  const softwareJsonLd = agent
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: agent.name,
        applicationCategory: 'BusinessApplication',
        description: desc,
        url: agent.url,
        offers: {
          '@type': 'Offer',
          price: agent.free ? '0' : undefined,
          priceCurrency: 'EUR',
          description: pricing,
        },
        author: {
          '@type': 'Organization',
          name: agent.vendor,
        },
      }
    : null

  return (
    <>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
        />
      )}
      {softwareJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(softwareJsonLd) }}
        />
      )}
      {children}
    </>
  )
}
