import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { EnquiryForm } from '@/components/EnquiryForm';
import { getContact } from '@/data/contact';
import { getUiStrings } from '@/data/ui';
import { LOCALES, type Locale, localeUrl, siteConfig } from '@/lib/site-config';
import { breadcrumbJsonLd, homeBreadcrumbLabel } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { KineticHeadline } from '@/components/ui/KineticHeadline';
import { CalendlyInline } from '@/components/CalendlyInline';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const TITLES: Record<Locale, string> = {
  en: 'Contact · Openletz',
  fr: 'Contact · Openletz',
  de: 'Kontakt · Openletz',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLES[locale],
    description: getContact(locale).lead,
    alternates: { canonical: localeUrl(locale, '/contact') },
  };
}

export function ContactBody({ locale = 'en' as Locale }: { locale?: Locale }) {
  const CONTACT = getContact(locale);
  const t = getUiStrings(locale);
  const c = t.contact;
  const book = {
    en: {
      word: 'Book',
      accent: 'a call',
      lead: 'Prefer to talk first? Grab a 15-minute slot that suits you. No forms, no pressure.',
    },
    fr: {
      word: 'Réservez',
      accent: 'un appel',
      lead: 'Vous préférez parler ? Choisissez un créneau de 15 minutes qui vous convient. Sans formulaire, sans pression.',
    },
    de: {
      word: 'Buchen Sie',
      accent: 'einen Anruf',
      lead: 'Lieber erst sprechen? Schnappen Sie sich einen passenden 15-Minuten-Slot. Kein Formular, kein Druck.',
    },
  }[locale];
  return (
    <main className="overflow-hidden px-6 pb-28 pt-24 md:pt-28">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
        {/* ---- Left: pitch + direct links ---- */}
        <div>
          <Reveal
            as="p"
            className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
          >
            <span className="text-accent">/</span> {c.kicker}
          </Reveal>

          <KineticHeadline
            as="h1"
            className="font-display uppercase leading-[0.92] tracking-[-0.01em] text-text text-balance"
          >
            <span className="block" style={{ fontSize: 'clamp(2.75rem, 9vw, 7rem)' }}>
              {c.titleA}
              <span className="text-accent">{c.titleAccent}</span>.
            </span>
          </KineticHeadline>

          <Reveal as="p" className="mt-7 max-w-md text-lg text-text-dim md:text-xl">
            {CONTACT.lead}
          </Reveal>

          <div className="mt-10 flex flex-col gap-3 text-text-dim">
            <p>
              {CONTACT.callLine}{' '}
              <a href="#book-a-call" className="ol-link text-accent">
                {c.bookCall}
              </a>
            </p>
            <p>
              {c.orEmail}{' '}
              <a href={`mailto:${siteConfig.brand.email}`} className="ol-link text-accent">
                {siteConfig.brand.email}
              </a>
            </p>
          </div>
        </div>

        {/* ---- Right: enquiry form ---- */}
        <Reveal className="w-full rounded-2xl border border-hairline bg-surface p-7 md:p-9">
          <EnquiryForm pillars={CONTACT.types} ui={t} />
        </Reveal>
      </div>

      <section id="book-a-call" className="mx-auto mt-24 max-w-3xl scroll-mt-28 md:mt-28">
        <Reveal
          as="h2"
          className="font-display text-3xl uppercase leading-[0.95] tracking-tight text-text md:text-5xl"
        >
          {book.word} <span className="text-accent">{book.accent}</span>.
        </Reveal>
        <Reveal as="p" className="mt-4 max-w-xl text-text-dim md:text-lg">
          {book.lead}
        </Reveal>
        <Reveal className="mt-9">
          <CalendlyInline />
        </Reveal>
      </section>
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
    { name: homeBreadcrumbLabel(locale), url: localeUrl(locale) },
    { name: 'Contact', url: localeUrl(locale, '/contact') },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />
      <ContactBody locale={locale} />
    </>
  );
}
