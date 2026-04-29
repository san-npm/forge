import { defaultLocale } from '@/i18n/config';

const SITE_URL = 'https://www.openletz.com';

// With `localePrefix: 'as-needed'` in next-intl routing, the default locale
// is served at the root (no /fr prefix), so URLs omit the locale segment for fr.
export function localeUrl(locale: string, path: string = ''): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}
