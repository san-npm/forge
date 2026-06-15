'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/site-config';

/**
 * Minimal, GDPR-appropriate analytics consent banner. Analytics (GA4) only load
 * once the visitor accepts (the `Analytics` component is gated on the same
 * `openletz-consent=granted` flag and listens for the `openletz-consent` event,
 * so accepting enables tracking immediately without a reload). Declining records
 * the choice so the banner does not reappear. Shows only until a choice is made.
 */
const COPY: Record<Locale, { text: string; privacy: string; accept: string; decline: string }> = {
  en: {
    text: 'We use privacy-friendly analytics to see what works and improve the site.',
    privacy: 'Privacy',
    accept: 'Accept',
    decline: 'Decline',
  },
  fr: {
    text: 'Nous utilisons des statistiques respectueuses de la vie privée pour améliorer le site.',
    privacy: 'Confidentialité',
    accept: 'Accepter',
    decline: 'Refuser',
  },
  de: {
    text: 'Wir nutzen datenschutzfreundliche Analyse, um die Website zu verbessern.',
    privacy: 'Datenschutz',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
  },
};

function setConsent(value: 'granted' | 'denied') {
  try {
    document.cookie = `openletz-consent=${value}; max-age=31536000; path=/; SameSite=Lax`;
    window.localStorage.setItem('openletz-consent', value);
  } catch {
    /* storage may be blocked; the cookie still records the choice */
  }
  window.dispatchEvent(new Event('openletz-consent'));
}

export function ConsentBanner({ locale }: { locale: Locale }) {
  const [show, setShow] = useState(false);
  const c = COPY[locale] ?? COPY.en;

  useEffect(() => {
    const decided =
      document.cookie.includes('openletz-consent=') ||
      window.localStorage.getItem('openletz-consent') != null;
    if (!decided) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      className="fixed inset-x-3 bottom-3 z-[10000] mx-auto max-w-3xl rounded-lg border border-hairline bg-surface/95 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur md:flex md:items-center md:justify-between md:gap-6"
    >
      <p className="text-sm text-text-dim">
        {c.text}{' '}
        <Link
          href={locale === 'en' ? '/legal/privacy' : `/${locale}/legal/privacy`}
          className="ol-link text-text"
        >
          {c.privacy}
        </Link>
      </p>
      <div className="mt-3 flex shrink-0 items-center gap-3 md:mt-0">
        <button
          type="button"
          onClick={() => {
            setConsent('denied');
            setShow(false);
          }}
          className="ol-btn-ghost px-4 py-2 text-sm"
        >
          {c.decline}
        </button>
        <button
          type="button"
          onClick={() => {
            setConsent('granted');
            setShow(false);
          }}
          className="ol-btn px-4 py-2 text-sm"
        >
          {c.accept}
        </button>
      </div>
    </div>
  );
}
