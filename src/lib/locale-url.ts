// Back-compat shim: the canonical builder now lives in site-config.ts.
// Existing imports of `localeUrl` from '@/lib/locale-url' keep working.
// The wider `string` overload preserves compat with legacy files that pass
// the old locale union (lb, pt, it, …) until those files are deleted.
export { SITE_URL } from '@/lib/site-config';
import { SITE_URL as _SITE_URL, localeUrl as _localeUrl, type Locale } from '@/lib/site-config';

export function localeUrl(locale: string, path = ''): string {
  const KNOWN_LOCALES: ReadonlyArray<string> = ['en', 'fr', 'de'];
  if (KNOWN_LOCALES.includes(locale)) {
    return _localeUrl(locale as Locale, path);
  }
  // Unknown locale (lb, pt, …): serve as a path prefix like the old implementation.
  const clean = path && !path.startsWith('/') ? `/${path}` : path;
  return `${_SITE_URL}/${locale}${clean}`;
}
