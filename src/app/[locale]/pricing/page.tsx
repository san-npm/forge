import { setRequestLocale } from 'next-intl/server';
import { LOCALES } from '@/lib/site-config';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <h1>Pricing</h1>
      <p>Pricing page — rebuilt in Phase 3.</p>
    </main>
  );
}
