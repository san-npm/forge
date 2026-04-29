import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['fr', 'en', 'de', 'lb', 'it', 'pt', 'es', 'ru', 'ar', 'tr', 'uk'],
  defaultLocale: 'fr',
  // Default locale served at `/` (not `/fr`); prefixed routes 308-redirect to the unprefixed canonical.
  localePrefix: 'as-needed',
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
