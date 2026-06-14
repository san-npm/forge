'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/site-config';
import { getNav, getStartProject } from '@/data/nav';
import { getUiStrings } from '@/data/ui';
import { LanguageDropdown } from '@/components/LanguageDropdown';

export function Nav({ locale }: { locale: Locale }) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const nav = getNav(locale);
  const startProject = getStartProject(locale);
  const ui = getUiStrings(locale);
  return (
    <nav
      data-nav
      className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-bg/80 px-6 py-4 backdrop-blur-md"
    >
      <Link
        href={`${prefix}/`}
        className="font-display text-xl uppercase tracking-wide text-text"
        aria-label={ui.nav.home}
      >
        Openletz
      </Link>
      <ul role="list" className="hidden items-center gap-7 md:flex">
        {nav.map((item) => (
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
          {startProject}
        </Link>
      </div>
    </nav>
  );
}
