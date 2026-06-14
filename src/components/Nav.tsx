'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/site-config';
import { NAV, START_PROJECT } from '@/data/nav';
import { LanguageDropdown } from '@/components/LanguageDropdown';

export function Nav({ locale }: { locale: Locale }) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return (
    <nav
      data-nav
      className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-bg/80 px-6 py-4 backdrop-blur-md"
    >
      <Link
        href={`${prefix}/`}
        className="font-display text-xl uppercase tracking-wide text-text"
        aria-label="Openletz home"
      >
        Openletz
      </Link>
      <ul role="list" className="hidden items-center gap-7 md:flex">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={`${prefix}${item.href}`}
              className="ol-link text-sm font-medium text-text-dim"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        <LanguageDropdown locale={locale} />
        <Link href={`${prefix}/#enquiry`} className="ol-btn" data-cta>
          {START_PROJECT}
        </Link>
      </div>
    </nav>
  );
}
