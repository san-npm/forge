import type { Metadata } from 'next'
import { localeUrl } from '@/lib/locale-url'

const titles: Record<string, string> = {
  fr: 'À Propos — Notre Mission pour les PME Luxembourgeoises',
  en: 'About — Our Mission for Luxembourg SMEs',
  de: 'Über Uns — Unsere Mission für KMU in Luxemburg',
  lb: 'Iwwer Eis — Eis Missioun fir KMU zu Lëtzebuerg',
  it: 'Chi Siamo — La Nostra Missione per le PMI Lussemburghesi',
  pt: 'Sobre — A Nossa Missão para as PME Luxemburguesas',
  es: 'Acerca — Nuestra Misión para las PYMES Luxemburguesas',
  ru: 'О Нас — Наша Миссия для МСП Люксембурга',
  ar: 'عن الموقع — مهمتنا للشركات الصغيرة في لوكسمبورغ',
  tr: 'Hakkımızda — Lüksemburg KOBİ\'leri İçin Misyonumuz',
  uk: 'Про Нас — Наша Місія для МСП Люксембургу',
}

const descriptions: Record<string, string> = {
  fr: 'OpenLetz aide les PME luxembourgeoises à trouver et obtenir des subventions pour leur transformation digitale et IA. 6 programmes analysés, simulateur gratuit, accompagnement expert.',
  en: 'OpenLetz helps Luxembourg SMEs find and obtain grants for digital transformation and AI. 6 programs analyzed, free simulator, expert support.',
  de: 'OpenLetz hilft luxemburgischen KMU, Fördermittel für Digitalisierung und KI zu finden. 6 Programme analysiert, kostenloser Simulator, Expertenbegleitung.',
  lb: 'OpenLetz hëlleft Lëtzebuerger KMU, Subventiounen fir Digitaliséierung an KI ze fannen. 6 Programmer analyséiert, gratis Simulator, Expert Begleedung.',
  it: 'OpenLetz aiuta le PMI lussemburghesi a trovare sovvenzioni per la trasformazione digitale e IA. 6 programmi analizzati, simulatore gratuito, supporto esperto.',
  pt: 'OpenLetz ajuda as PME luxemburguesas a encontrar apoios para a transformação digital e IA. 6 programas analisados, simulador gratuito, acompanhamento especializado.',
  es: 'OpenLetz ayuda a las PYMES luxemburguesas a encontrar subvenciones para su transformación digital e IA. 6 programas analizados, simulador gratuito, acompañamiento experto.',
  ru: 'OpenLetz помогает МСП Люксембурга находить субсидии на цифровую трансформацию и ИИ. 6 программ, бесплатный симулятор, экспертная поддержка.',
  ar: 'OpenLetz يساعد الشركات الصغيرة في لوكسمبورغ على إيجاد منح التحول الرقمي والذكاء الاصطناعي. 6 برامج، محاكي مجاني، دعم خبراء.',
  tr: 'OpenLetz, Lüksemburg KOBİ\'lerinin dijital dönüşüm ve yapay zekâ hibeleri bulmasına yardımcı olur. 6 program, ücretsiz simülatör, uzman desteği.',
  uk: 'OpenLetz допомагає МСП Люксембургу знаходити субсидії на цифрову трансформацію та ШІ. 6 програм, безкоштовний симулятор, експертна підтримка.',
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
    alternates: { canonical: localeUrl(locale, '/about') },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      'ICBM': '49.6117, 6.1300',
    },
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      url: localeUrl(locale, '/about'),
    },
  }
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
