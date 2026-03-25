import type { Metadata } from 'next'

const SITE_URL = 'https://www.openletz.com'

const titles: Record<string, string> = {
  fr: 'Le Digital au Luxembourg — Blog OpenLetz',
  en: 'Digital in Luxembourg — OpenLetz Blog',
  de: 'Digitalisierung in Luxemburg — OpenLetz Blog',
  lb: 'Digital zu Lëtzebuerg — OpenLetz Blog',
  it: 'Il Digitale in Lussemburgo — Blog OpenLetz',
  pt: 'O Digital no Luxemburgo — Blog OpenLetz',
  es: 'Lo Digital en Luxemburgo — Blog OpenLetz',
  ru: 'Цифровизация в Люксембурге — Блог OpenLetz',
  ar: 'الرقمنة في لوكسمبورغ — مدونة OpenLetz',
  tr: 'Lüksemburg\'da Dijitalleşme — OpenLetz Blog',
  uk: 'Цифровізація в Люксембурзі — Блог OpenLetz',
}

const descriptions: Record<string, string> = {
  fr: 'Subventions, IA et stratégies concrètes pour les PME luxembourgeoises. Guides pratiques sur SME Package, Fit 4 Digital, Fit 4 AI et Luxinnovation.',
  en: 'Grants, AI and actionable strategies for Luxembourg SMEs. Practical guides on SME Package, Fit 4 Digital, Fit 4 AI and Luxinnovation.',
  de: 'Fördermittel, KI und konkrete Strategien für luxemburgische KMU. Praktische Leitfäden zu SME Package, Fit 4 Digital, Fit 4 AI und Luxinnovation.',
  lb: 'Subventiounen, KI a konkret Strategien fir Lëtzebuerger KMU. Praktesch Guides iwwer SME Package, Fit 4 Digital, Fit 4 AI an Luxinnovation.',
  it: 'Sovvenzioni, IA e strategie concrete per le PMI lussemburghesi. Guide pratiche su SME Package, Fit 4 Digital, Fit 4 AI e Luxinnovation.',
  pt: 'Apoios, IA e estratégias concretas para PME luxemburguesas. Guias práticos sobre SME Package, Fit 4 Digital, Fit 4 AI e Luxinnovation.',
  es: 'Subvenciones, IA y estrategias concretas para PYMES luxemburguesas. Guías prácticas sobre SME Package, Fit 4 Digital, Fit 4 AI y Luxinnovation.',
  ru: 'Субсидии, ИИ и конкретные стратегии для МСП Люксембурга. Практические руководства по SME Package, Fit 4 Digital, Fit 4 AI и Luxinnovation.',
  ar: 'المنح والذكاء الاصطناعي والاستراتيجيات العملية للشركات الصغيرة في لوكسمبورغ. أدلة عملية حول SME Package و Fit 4 Digital و Fit 4 AI و Luxinnovation.',
  tr: 'Lüksemburg KOBİ\'leri için hibeler, YZ ve somut stratejiler. SME Package, Fit 4 Digital, Fit 4 AI ve Luxinnovation hakkında pratik rehberler.',
  uk: 'Субсидії, ШІ та конкретні стратегії для МСП Люксембургу. Практичні посібники з SME Package, Fit 4 Digital, Fit 4 AI та Luxinnovation.',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
    alternates: { canonical: `${SITE_URL}/${locale}/blog` },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      'ICBM': '49.6117, 6.1300',
    },
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      url: `${SITE_URL}/${locale}/blog`,
      type: 'website',
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: `Blog OpenLetz` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      images: [`${SITE_URL}/og-image.png`],
    },
  }
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
