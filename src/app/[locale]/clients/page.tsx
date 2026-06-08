import { setRequestLocale } from 'next-intl/server';
import { LOCALES } from '@/lib/site-config';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <h1>Work</h1>
      <p>Portfolio / clients — rebuilt in Phase 2.</p>
    </main>
  );
}
