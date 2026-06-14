import type { Locale } from '@/lib/site-config';

/**
 * Locale-prefixes an INTERNAL path href (en at `/`, fr/de under `/fr` `/de`).
 * Hash links, absolute URLs and protocol links pass through untouched, so a
 * `#enquiry` CTA stays locale-agnostic while `/work` becomes `/fr/work`.
 *
 * Mirrors the helper the Nav/Hero use; extracted so every section links
 * locale-aware without duplicating the rule.
 */
export function localeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/')) return href; // hash, http(s), mailto, tel, …
  const prefix = locale === 'en' ? '' : `/${locale}`;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) return href; // already prefixed
  return `${prefix}${href}`;
}
