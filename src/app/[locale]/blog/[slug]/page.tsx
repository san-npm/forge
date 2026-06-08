import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES } from '@/lib/site-config';

// Blog posts have been removed; this route is a placeholder until
// /insights is built in Phase 2. No content → 404.
export function generateStaticParams() {
  // Return a minimal set to satisfy cacheComponents requirement.
  // Real posts are ported to /insights in Phase 2.
  return LOCALES.map((locale) => ({ locale, slug: '_placeholder' }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // All real slug requests 404 until /insights replaces this route.
  notFound();
}
