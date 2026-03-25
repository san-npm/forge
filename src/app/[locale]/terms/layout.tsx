import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    fr: "Conditions Générales d'Utilisation", en: 'Terms of Service', de: 'Nutzungsbedingungen',
    lb: 'Notzungsbedéngungen', it: "Termini d'Uso", pt: 'Termos de Serviço',
    es: 'Términos de Servicio', ru: 'Условия использования', ar: 'شروط الاستخدام',
    tr: 'Kullanım Koşulları', uk: 'Умови використання',
  }
  return {
    title: titles[locale] || titles.fr,
    description: locale === 'fr'
      ? "Conditions générales d'utilisation du simulateur OpenLetz et des services associés."
      : 'Terms of service for the OpenLetz simulator and related services.',
  }
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
