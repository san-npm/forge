import { NavSchema, FooterSchema, type NavItem, type FooterColumn } from '@/lib/schema';
import { siteConfig } from '@/lib/site-config';
import type { Locale } from '@/lib/site-config';

export type { NavItem, FooterColumn };

/**
 * The one CTA verb (spec §0), per locale. The persistent nav button uses this
 * SEPARATELY from the flat NAV links.
 */
const START_PROJECT_I18N: Record<Locale, string> = {
  en: 'Start a project',
  fr: 'Démarrer un projet',
  de: 'Projekt starten',
};

/** Active-locale CTA verb. */
export function getStartProject(locale: Locale): string {
  return START_PROJECT_I18N[locale];
}

// EN constant kept for the data + Nav tests.
export const START_PROJECT = START_PROJECT_I18N.en;

// Flat nav = 4 links + the persistent START_PROJECT CTA button (rendered by
// Nav.tsx, not part of these arrays). hrefs stay constant; labels translated.
const NAV_I18N: Record<Locale, NavItem[]> = {
  en: [
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Insights', href: '/insights' },
  ],
  fr: [
    { label: 'Services', href: '/services' },
    { label: 'Réalisations', href: '/work' },
    { label: 'À propos', href: '/about' },
    { label: 'Insights', href: '/insights' },
  ],
  de: [
    { label: 'Leistungen', href: '/services' },
    { label: 'Arbeiten', href: '/work' },
    { label: 'Über uns', href: '/about' },
    { label: 'Insights', href: '/insights' },
  ],
};

const PARSED_NAV: Record<Locale, NavItem[]> = {
  en: NavSchema.parse(NAV_I18N.en),
  fr: NavSchema.parse(NAV_I18N.fr),
  de: NavSchema.parse(NAV_I18N.de),
};

/** Active-locale flat nav. */
export function getNav(locale: Locale): NavItem[] {
  return PARSED_NAV[locale];
}

// EN constant kept for the data + Nav tests.
export const NAV: NavItem[] = PARSED_NAV.en;

// 4 lean footer columns (spec §6): Services pillars / Company / Connect / Legal.
// A footer link label must never duplicate a column heading text (Footer.test
// does getByText(heading)). hrefs stay constant; headings + labels translated.
const FOOTER_I18N: Record<Locale, FooterColumn[]> = {
  en: [
    {
      heading: 'Services',
      links: [
        { label: 'All services', href: '/services' },
        { label: 'Funding', href: '/sme-package' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Audit', href: '/audit' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Work', href: '/work' },
        { label: 'Insights', href: '/insights' },
      ],
    },
    {
      heading: 'Connect',
      links: [
        { label: 'LinkedIn', href: siteConfig.brand.linkedin },
        { label: 'Email', href: `mailto:${siteConfig.brand.email}` },
        { label: 'Start a project', href: '/contact' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy', href: '/legal/privacy' },
        { label: 'Terms', href: '/legal/terms' },
      ],
    },
  ],
  fr: [
    {
      heading: 'Services',
      links: [
        { label: 'Tous les services', href: '/services' },
        { label: 'Financement', href: '/sme-package' },
        { label: 'Tarifs', href: '/pricing' },
        { label: 'Audit', href: '/audit' },
      ],
    },
    {
      heading: 'Studio',
      links: [
        { label: 'À propos', href: '/about' },
        { label: 'Réalisations', href: '/work' },
        { label: 'Insights', href: '/insights' },
      ],
    },
    {
      heading: 'Contact',
      links: [
        { label: 'LinkedIn', href: siteConfig.brand.linkedin },
        { label: 'E-mail', href: `mailto:${siteConfig.brand.email}` },
        { label: 'Démarrer un projet', href: '/contact' },
      ],
    },
    {
      heading: 'Mentions légales',
      links: [
        { label: 'Confidentialité', href: '/legal/privacy' },
        { label: 'Conditions', href: '/legal/terms' },
      ],
    },
  ],
  de: [
    {
      heading: 'Leistungen',
      links: [
        { label: 'Alle Leistungen', href: '/services' },
        { label: 'Förderung', href: '/sme-package' },
        { label: 'Preise', href: '/pricing' },
        { label: 'Audit', href: '/audit' },
      ],
    },
    {
      heading: 'Studio',
      links: [
        { label: 'Über uns', href: '/about' },
        { label: 'Arbeiten', href: '/work' },
        { label: 'Insights', href: '/insights' },
      ],
    },
    {
      heading: 'Kontakt',
      links: [
        { label: 'LinkedIn', href: siteConfig.brand.linkedin },
        { label: 'E-Mail', href: `mailto:${siteConfig.brand.email}` },
        { label: 'Projekt starten', href: '/contact' },
      ],
    },
    {
      heading: 'Rechtliches',
      links: [
        { label: 'Datenschutz', href: '/legal/privacy' },
        { label: 'AGB', href: '/legal/terms' },
      ],
    },
  ],
};

const PARSED_FOOTER: Record<Locale, FooterColumn[]> = {
  en: FooterSchema.parse(FOOTER_I18N.en),
  fr: FooterSchema.parse(FOOTER_I18N.fr),
  de: FooterSchema.parse(FOOTER_I18N.de),
};

/** Active-locale footer columns. */
export function getFooter(locale: Locale): FooterColumn[] {
  return PARSED_FOOTER[locale];
}

// EN constant kept for the data + Footer tests.
export const FOOTER: FooterColumn[] = PARSED_FOOTER.en;
