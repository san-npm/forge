// Back-compat shim: the locale set + default now live in site-config.ts.
// Existing imports of `locales`/`defaultLocale`/`Locale` keep working.
export { LOCALES as locales, DEFAULT_LOCALE as defaultLocale } from '@/lib/site-config';
export type { Locale } from '@/lib/site-config';
