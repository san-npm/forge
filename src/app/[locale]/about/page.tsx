import { setRequestLocale } from 'next-intl/server';
import { LOCALES } from '@/lib/site-config';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <h1>About</h1>
      <p>About page — rebuilt in Phase 2.</p>
    </main>
  );
}
