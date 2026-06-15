export const SITE_URL = 'https://openletz.ai' as const; // apex, no www, no trailing slash

export const LOCALES = ['en', 'fr', 'de'] as const;
export type Locale = (typeof LOCALES)[number]; // 'en' | 'fr' | 'de'

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_PREFIX = 'as-needed' as const;

export interface SiteConfig {
  siteUrl: string;
  locales: readonly Locale[];
  defaultLocale: Locale;
  localePrefix: 'as-needed';
  brand: {
    name: string;
    legalEntity: string;
    email: string;
    privacyEmail: string;
    linkedin: string;
    logoPng: string;
    logoSvg: string;
  };
}

export const siteConfig: SiteConfig = {
  siteUrl: SITE_URL,
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: LOCALE_PREFIX,
  brand: {
    name: 'Openletz',
    legalEntity: 'Commit Media S.à r.l. · RCS B276192 · Luxembourg',
    email: 'hello@openletz.ai',
    privacyEmail: 'privacy@openletz.ai',
    linkedin: 'https://www.linkedin.com/company/commit-media', // OWNER: confirm exact handle
    logoPng: `${SITE_URL}/openletz-logo.png`,
    logoSvg: `${SITE_URL}/openletz.svg`,
  },
};

/**
 * Canonical URL builder. EN (default) is unprefixed; fr/de are prefixed.
 * localeUrl('en')          -> 'https://openletz.ai'
 * localeUrl('en', '/work') -> 'https://openletz.ai/work'
 * localeUrl('fr', '/work') -> 'https://openletz.ai/fr/work'
 * localeUrl('de')          -> 'https://openletz.ai/de'
 */
export function localeUrl(locale: Locale, path = ''): string {
  const clean = path && !path.startsWith('/') ? `/${path}` : path;
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}${clean}` || SITE_URL;
}
