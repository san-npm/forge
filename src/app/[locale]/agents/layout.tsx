import type { Metadata } from 'next'

const SITE_URL = 'https://www.openletz.com'

const titles: Record<string, string> = {
  fr: 'Répertoire Outils IA — 32 Agents IA avec Conformité RGPD & EU AI Act',
  en: 'AI Tools Directory — 32 AI Agents with GDPR & EU AI Act Compliance',
  de: 'KI-Tools Verzeichnis — 32 KI-Agenten mit DSGVO & EU AI Act Konformität',
  lb: 'KI-Tools Repertoire — 32 KI Agenten mat RGPD & EU AI Act Konformitéit',
  it: 'Directory Strumenti IA — 32 Agenti IA con Conformità GDPR & EU AI Act',
  pt: 'Diretório Ferramentas IA — 32 Agentes IA com Conformidade RGPD & EU AI Act',
  es: 'Directorio Herramientas IA — 32 Agentes IA con Cumplimiento RGPD & EU AI Act',
  ru: 'Каталог ИИ-инструментов — 32 ИИ-агента с соответствием GDPR и EU AI Act',
  ar: 'دليل أدوات الذكاء الاصطناعي — 32 أداة مع التوافق مع GDPR و EU AI Act',
  tr: 'Yapay Zekâ Araçları Dizini — KVKK & EU AI Act Uyumlu 32 YZ Aracı',
  uk: 'Каталог ШІ-інструментів — 32 ШІ-агенти з відповідністю GDPR та EU AI Act',
}

const descriptions: Record<string, string> = {
  fr: 'Comparez 32 outils IA pour entreprises : ChatGPT, Claude, Midjourney, Copilot et plus. Conformité RGPD, EU AI Act, résidence données UE. Tarifs et avis pour PME au Luxembourg.',
  en: 'Compare 32 AI tools for business: ChatGPT, Claude, Midjourney, Copilot and more. GDPR compliance, EU AI Act, EU data residency. Pricing and reviews for Luxembourg SMEs.',
  de: 'Vergleichen Sie 32 KI-Tools für Unternehmen: ChatGPT, Claude, Midjourney, Copilot und mehr. DSGVO, EU AI Act, EU-Datenresidenz. Preise und Bewertungen für KMU in Luxemburg.',
  lb: 'Vergläicht 32 KI-Tools fir Betriber: ChatGPT, Claude, Midjourney, Copilot a méi. RGPD, EU AI Act, EU Daten-Residenz. Präisser an Avis fir KMU zu Lëtzebuerg.',
  it: 'Confronta 32 strumenti IA per imprese: ChatGPT, Claude, Midjourney, Copilot e altri. Conformità GDPR, EU AI Act, residenza dati UE. Prezzi e recensioni per PMI in Lussemburgo.',
  pt: 'Compare 32 ferramentas IA para empresas: ChatGPT, Claude, Midjourney, Copilot e mais. Conformidade RGPD, EU AI Act, residência de dados UE. Preços e avaliações para PME no Luxemburgo.',
  es: 'Compara 32 herramientas IA para empresas: ChatGPT, Claude, Midjourney, Copilot y más. Cumplimiento RGPD, EU AI Act, residencia datos UE. Precios y reseñas para PYMES en Luxemburgo.',
  ru: 'Сравните 32 ИИ-инструмента для бизнеса: ChatGPT, Claude, Midjourney, Copilot и другие. GDPR, EU AI Act, хранение данных в ЕС. Цены и отзывы для МСП в Люксембурге.',
  ar: 'قارن 32 أداة ذكاء اصطناعي للأعمال: ChatGPT، Claude، Midjourney، Copilot والمزيد. توافق GDPR، EU AI Act. أسعار ومراجعات للشركات الصغيرة في لوكسمبورغ.',
  tr: 'İşletmeler için 32 YZ aracını karşılaştırın: ChatGPT, Claude, Midjourney, Copilot ve daha fazlası. KVKK, EU AI Act uyumluluğu. Lüksemburg KOBİ\'leri için fiyatlar ve değerlendirmeler.',
  uk: 'Порівняйте 32 ШІ-інструменти для бізнесу: ChatGPT, Claude, Midjourney, Copilot та інші. GDPR, EU AI Act, зберігання даних в ЄС. Ціни та відгуки для МСП у Люксембурзі.',
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
    alternates: { canonical: `${SITE_URL}/${locale}/agents` },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      'ICBM': '49.6117, 6.1300',
    },
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      url: `${SITE_URL}/${locale}/agents`,
    },
  }
}

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
