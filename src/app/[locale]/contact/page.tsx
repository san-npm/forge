import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { EnquiryForm } from '@/components/EnquiryForm';
import { CONTACT } from '@/data/contact';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Contact · Openletz',
    description: CONTACT.lead,
    alternates: { canonical: localeUrl(locale, '/contact') },
  };
}

export function ContactBody() {
  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold text-text">Start a project</h1>
        <p className="mt-4 text-lg text-text-dim">{CONTACT.lead}</p>
        <div className="mt-10">
          <EnquiryForm pillars={CONTACT.types} />
        </div>
        <p className="mt-8 text-sm text-text-dim">
          {CONTACT.callLine}{' '}
          <a href="https://cal.com/openletz" className="ol-link text-hot">
            Book a 15-minute intro call
          </a>
        </p>
      </div>
    </main>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactBody />;
}
