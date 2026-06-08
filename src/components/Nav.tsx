'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/site-config';
import { localeUrl } from '@/lib/site-config';
import { NAV, START_PROJECT } from '@/data/nav';
import { LANGS } from '@/data/hero-i18n';

export function Nav({ locale }: { locale: Locale }) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return (
    <nav data-nav className="flex items-center justify-between px-6 py-4">
      <Link href={`${prefix}/`} className="font-semibold text-text">
        Openletz
      </Link>
      <ul role="list" className="hidden items-center gap-6 md:flex">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link href={`${prefix}${item.href}`} className="text-text-dim hover:text-hot">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4">
        <ul role="list" className="flex items-center gap-2" aria-label="Language">
          {LANGS.map((lang) => (
            <li key={lang.code}>
              <Link
                href={localeUrl(lang.code)}
                aria-label={lang.label}
                aria-current={lang.code === locale ? 'true' : undefined}
                className="text-sm text-text-dim hover:text-hot"
                data-active={lang.code === locale}
              >
                {lang.flag} {lang.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={`${prefix}/#enquiry`} className="ol-btn" data-cta>
          {START_PROJECT}
        </Link>
      </div>
    </nav>
  );
}
