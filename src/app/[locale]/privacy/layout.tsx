import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    fr: 'Politique de Confidentialité', en: 'Privacy Policy', de: 'Datenschutzerklärung',
    lb: 'Dateschutz', it: 'Politica sulla Privacy', pt: 'Política de Privacidade',
    es: 'Política de Privacidad', ru: 'Политика конфиденциальности', ar: 'سياسة الخصوصية',
    tr: 'Gizlilik Politikası', uk: 'Політика конфіденційності',
  }
  return {
    title: titles[locale] || titles.fr,
    description: locale === 'fr'
      ? 'Politique de confidentialité et protection des données personnelles de OpenLetz. Conforme RGPD.'
      : 'Privacy policy and personal data protection at OpenLetz. GDPR compliant.',
  }
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
