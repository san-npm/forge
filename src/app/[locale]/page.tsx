import { setRequestLocale } from 'next-intl/server';
import { SectionRenderer } from '@/components/SectionRenderer';
import { HOME_SECTIONS } from '@/data/pages/home';
import { LOCALES, type Locale } from '@/lib/site-config';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <SectionRenderer sections={HOME_SECTIONS} locale={locale} />
    </main>
  );
}
