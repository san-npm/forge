import { describe, it, expect } from 'vitest';
import {
  SITE_URL,
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_PREFIX,
  siteConfig,
  localeUrl,
} from './site-config';

describe('SITE_URL', () => {
  it('is the apex .ai host with https, no www, no trailing slash', () => {
    expect(SITE_URL).toBe('https://openletz.ai');
    expect(SITE_URL).not.toMatch(/www\./);
    expect(SITE_URL).not.toMatch(/\.com/);
    expect(SITE_URL.endsWith('/')).toBe(false);
  });
});

describe('locales', () => {
  it('is exactly en, fr, de', () => {
    expect([...LOCALES]).toEqual(['en', 'fr', 'de']);
  });
  it('defaults to en', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(LOCALES).toContain(DEFAULT_LOCALE);
  });
  it('uses as-needed prefixing', () => {
    expect(LOCALE_PREFIX).toBe('as-needed');
  });
});

describe('siteConfig brand', () => {
  it('uses openletz.ai email + apex logo paths and the legal entity', () => {
    expect(siteConfig.brand.name).toBe('Openletz');
    expect(siteConfig.brand.email).toBe('hello@openletz.ai');
    expect(siteConfig.brand.privacyEmail).toBe('privacy@openletz.ai');
    expect(siteConfig.brand.legalEntity).toContain('B276192');
    expect(siteConfig.brand.logoPng).toBe('https://openletz.ai/openletz-logo.png');
    expect(siteConfig.brand.logoSvg).toBe('https://openletz.ai/openletz.svg');
    expect(siteConfig.brand.email).not.toMatch(/openletz\.com/);
  });
});

describe('localeUrl', () => {
  it('returns the bare apex for the default locale with no path', () => {
    expect(localeUrl('en')).toBe('https://openletz.ai');
  });
  it('appends a path for the default locale without a prefix', () => {
    expect(localeUrl('en', '/work')).toBe('https://openletz.ai/work');
  });
  it('prefixes non-default locales', () => {
    expect(localeUrl('fr', '/work')).toBe('https://openletz.ai/fr/work');
    expect(localeUrl('de')).toBe('https://openletz.ai/de');
  });
  it('normalizes a path missing its leading slash', () => {
    expect(localeUrl('en', 'work')).toBe('https://openletz.ai/work');
  });
});
