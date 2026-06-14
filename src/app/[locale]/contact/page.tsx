import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { EnquiryForm } from '@/components/EnquiryForm';
import { CONTACT } from '@/data/contact';
import { LOCALES, type Locale, localeUrl, siteConfig } from '@/lib/site-config';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { KineticHeadline } from '@/components/ui/KineticHeadline';

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
    <main className="overflow-hidden px-6 pb-28 pt-24 md:pt-28">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
        {/* ---- Left: pitch + direct links ---- */}
        <div>
          <Reveal
            as="p"
            className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
          >
            <span className="text-accent">/</span> Contact
          </Reveal>

          <KineticHeadline
            as="h1"
            className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
          >
            <span className="block" style={{ fontSize: 'clamp(2.75rem, 9vw, 7rem)' }}>
              Start a <span className="text-accent">project</span>.
            </span>
          </KineticHeadline>

          <Reveal as="p" className="mt-7 max-w-md text-lg text-text-dim md:text-xl">
            {CONTACT.lead}
          </Reveal>

          <div className="mt-10 flex flex-col gap-3 text-text-dim">
            <p>
              {CONTACT.callLine}{' '}
              <a href="https://cal.com/openletz" className="ol-link text-accent">
                Book a 15-minute intro call
              </a>
            </p>
            <p>
              Or email{' '}
              <a href={`mailto:${siteConfig.brand.email}`} className="ol-link text-accent">
                {siteConfig.brand.email}
              </a>
            </p>
          </div>
        </div>

        {/* ---- Right: enquiry form ---- */}
        <Reveal className="w-full rounded-2xl border border-hairline bg-surface p-7 md:p-9">
          <EnquiryForm pillars={CONTACT.types} />
        </Reveal>
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
  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Contact', url: localeUrl(locale, '/contact') },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />
      <ContactBody />
    </>
  );
}
