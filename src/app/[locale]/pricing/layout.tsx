import type { Metadata } from 'next'
import { localeUrl } from '@/lib/locale-url'

const titles: Record<string, string> = {
  fr: 'Tarifs — Développement Web, Intégration IA & Conseil Subventions Luxembourg',
  en: 'Pricing — Web Development, AI Integration & Grants Advisory Luxembourg',
  de: 'Preise — Webentwicklung, KI-Integration & Förderberatung Luxemburg',
  lb: 'Präisser — Webentwécklung, KI-Integratioun & Subventiounsberodung Lëtzebuerg',
  it: 'Prezzi — Sviluppo Web, Integrazione IA & Consulenza Sovvenzioni Lussemburgo',
  pt: 'Preços — Desenvolvimento Web, Integração IA & Consultoria Apoios Luxemburgo',
  es: 'Precios — Desarrollo Web, Integración IA & Asesoría Subvenciones Luxemburgo',
  ru: 'Цены — Веб-разработка, ИИ-интеграция и консультации по субсидиям Люксембурга',
  ar: 'الأسعار — تطوير الويب، تكامل الذكاء الاصطناعي واستشارات المنح في لوكسمبورغ',
  tr: 'Fiyatlar — Web Geliştirme, YZ Entegrasyonu & Hibe Danışmanlığı Lüksemburg',
  uk: 'Ціни — Веб-розробка, ШІ-інтеграція та консультації з субсидій Люксембургу',
}

const descriptions: Record<string, string> = {
  fr: 'Services OpenLetz : développement web dès 900 €, intégration IA dès 900 €, maintenance dès 90 €/mois, conseil subventions dès 290 €. Éligible aux aides luxembourgeoises SME Package et Fit 4 Digital.',
  en: 'OpenLetz services: web development from €900, AI integration from €900, maintenance from €90/mo, grants advisory from €290. Eligible for Luxembourg SME Package and Fit 4 Digital grants.',
  de: 'OpenLetz Dienstleistungen: Webentwicklung ab 900 €, KI-Integration ab 900 €, Wartung ab 90 €/Monat, Förderberatung ab 290 €. Förderfähig für luxemburgische KMU-Programme.',
  lb: 'OpenLetz Servicer: Webentwécklung vun 900 €, KI-Integratioun vun 900 €, Maintenance vun 90 €/Mount, Subventiounsberodung vun 290 €. Eligibel fir Lëtzebuerger KMU Programmer.',
  it: 'Servizi OpenLetz: sviluppo web da 900 €, integrazione IA da 900 €, manutenzione da 90 €/mese, consulenza sovvenzioni da 290 €. Ammissibile ai programmi PMI lussemburghesi.',
  pt: 'Serviços OpenLetz: desenvolvimento web desde 900 €, integração IA desde 900 €, manutenção desde 90 €/mês, consultoria apoios desde 290 €. Elegível para programas PME luxemburgueses.',
  es: 'Servicios OpenLetz: desarrollo web desde 900 €, integración IA desde 900 €, mantenimiento desde 90 €/mes, asesoría subvenciones desde 290 €. Elegible para programas PYME luxemburgueses.',
  ru: 'Услуги OpenLetz: веб-разработка от 900 €, интеграция ИИ от 900 €, обслуживание от 90 €/мес, консультации по субсидиям от 290 €. Подходит для программ МСП Люксембурга.',
  ar: 'خدمات OpenLetz: تطوير ويب من 900 €، تكامل ذكاء اصطناعي من 900 €، صيانة من 90 €/شهر، استشارات منح من 290 €. مؤهل لبرامج الشركات الصغيرة في لوكسمبورغ.',
  tr: 'OpenLetz hizmetleri: web geliştirme 900 €\'dan, YZ entegrasyonu 900 €\'dan, bakım 90 €/ay\'dan, hibe danışmanlığı 290 €\'dan. Lüksemburg KOBİ programlarına uygun.',
  uk: 'Послуги OpenLetz: веб-розробка від 900 €, ШІ-інтеграція від 900 €, обслуговування від 90 €/міс, консультації з субсидій від 290 €. Підходить для програм МСП Люксембургу.',
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
    alternates: { canonical: localeUrl(locale, '/pricing') },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      'ICBM': '49.6117, 6.1300',
    },
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      url: localeUrl(locale, '/pricing'),
    },
  }
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
