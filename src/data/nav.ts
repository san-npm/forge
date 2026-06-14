import { NavSchema, FooterSchema, type NavItem, type FooterColumn } from '@/lib/schema';
import { siteConfig } from '@/lib/site-config';

export type { NavItem, FooterColumn };

/**
 * The one CTA verb (spec §0). EN here; FR/DE come through hero-i18n.
 * Used ~5× (hero, after services, after selected work, closing form, nav button).
 * The persistent nav button uses this SEPARATELY from the flat NAV links.
 */
export const START_PROJECT = 'Start a project' as const;

// Flat nav = 4 links + the persistent START_PROJECT CTA button (rendered
// by Nav.tsx, not part of this array). Parsed at load so bad content fails build.
export const NAV: NavItem[] = NavSchema.parse([
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
]);

// 4 lean footer columns (spec §6): Services pillars / Company / Connect / Legal.
export const FOOTER: FooterColumn[] = FooterSchema.parse([
  {
    heading: 'Services',
    links: [
      // Label differs from the 'Services' column heading on purpose so the
      // Footer's getByText(heading) assertion finds a single match.
      { label: 'All services', href: '/services' },
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
]);
