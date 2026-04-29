import type { Metadata } from 'next'
import { localeUrl } from '@/lib/locale-url'

const titles: Record<string, string> = {
  fr: 'Contact — Accompagnement Subventions & Projets Digitaux',
  en: 'Contact — Grants Support & Digital Projects',
  de: 'Kontakt — Förderberatung & Digitale Projekte',
  lb: 'Kontakt — Subventiounsbegleedung & Digital Projeten',
  it: 'Contatto — Supporto Sovvenzioni & Progetti Digitali',
  pt: 'Contacto — Apoio Subsídios & Projetos Digitais',
  es: 'Contacto — Asesoría Subvenciones & Proyectos Digitales',
  ru: 'Контакт — Поддержка субсидий и цифровые проекты',
  ar: 'اتصل بنا — دعم المنح والمشاريع الرقمية',
  tr: 'İletişim — Hibe Desteği & Dijital Projeler',
  uk: 'Контакт — Підтримка субсидій та цифрові проекти',
}

const descriptions: Record<string, string> = {
  fr: 'Contactez OpenLetz pour un accompagnement personnalisé dans vos démarches de subventions luxembourgeoises. Conseil gratuit, montage de dossier, projets digitaux et IA.',
  en: 'Contact OpenLetz for personalized support with Luxembourg grant applications. Free consultation, file preparation, digital and AI projects.',
  de: 'Kontaktieren Sie OpenLetz für persönliche Unterstützung bei luxemburgischen Förderanträgen. Kostenlose Beratung, Dossier-Erstellung, Digital- und KI-Projekte.',
  lb: 'Kontaktéiert OpenLetz fir perséinlech Ënnerstëtzung bei Lëtzebuerger Subventiouns-Demanden. Gratis Berodung, Dossier-Montage, Digital- a KI-Projeten.',
  it: 'Contatta OpenLetz per supporto personalizzato nelle domande di sovvenzioni lussemburghesi. Consulenza gratuita, preparazione dossier, progetti digitali e IA.',
  pt: 'Contacte OpenLetz para apoio personalizado nas candidaturas a apoios luxemburgueses. Consultoria gratuita, preparação de dossier, projetos digitais e IA.',
  es: 'Contacte OpenLetz para asesoramiento personalizado en solicitudes de subvenciones luxemburguesas. Consulta gratuita, preparación de expediente, proyectos digitales e IA.',
  ru: 'Свяжитесь с OpenLetz для персонализированной поддержки заявок на субсидии Люксембурга. Бесплатная консультация, подготовка досье, цифровые и ИИ-проекты.',
  ar: 'اتصل بـ OpenLetz للحصول على دعم شخصي في طلبات منح لوكسمبورغ. استشارة مجانية، إعداد الملف، مشاريع رقمية وذكاء اصطناعي.',
  tr: 'Lüksemburg hibe başvurularında kişiselleştirilmiş destek için OpenLetz ile iletişime geçin. Ücretsiz danışmanlık, dosya hazırlama, dijital ve YZ projeleri.',
  uk: 'Зв\'яжіться з OpenLetz для персоналізованої підтримки заявок на субсидії Люксембургу. Безкоштовна консультація, підготовка досьє, цифрові та ШІ-проекти.',
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
    alternates: { canonical: localeUrl(locale, '/contact') },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      'ICBM': '49.6117, 6.1300',
    },
    openGraph: {
      title: titles[locale] || titles.fr,
      description: descriptions[locale] || descriptions.fr,
      url: localeUrl(locale, '/contact'),
    },
  }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
