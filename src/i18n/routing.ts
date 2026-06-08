import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { LOCALES, DEFAULT_LOCALE, LOCALE_PREFIX } from '@/lib/site-config';

export const routing = defineRouting({
  // Single source of truth: en/fr/de from site-config.
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  // Default locale (en) served at `/`; fr/de prefixed. Prefixed default
  // 308-redirects to the unprefixed canonical.
  localePrefix: LOCALE_PREFIX,
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
