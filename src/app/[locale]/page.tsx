import { setRequestLocale } from 'next-intl/server';
import { LOCALES } from '@/lib/site-config';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <h1>Websites that think, move &amp; transact.</h1>
      <p>A Luxembourg AI agency.</p>
    </main>
  );
}
