import { Fragment } from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { HeroSectionProps } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
import { Reveal } from '@/components/ui/Reveal';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { KineticHeadline } from '@/components/ui/KineticHeadline';
import { Marquee } from '@/components/ui/Marquee';

// Verbs to set in electric lime per locale. The headline is the verbs of the
// tagline ("think / move / transact" and translations). Words are matched
// case-insensitively against the h1 so the accent survives copy tweaks.
const ACCENT_WORDS: Record<Locale, string[]> = {
  en: ['think', 'move', 'transact'],
  fr: ['pensent', 'bougent', 'transigent'],
  de: ['denken', 'bewegen', 'handeln'],
};

const CAPABILITIES = [
  'AI AGENTS',
  'AUTOMATION',
  'CHATBOTS',
  'WEB & SHOPS',
  'WEB3',
  'ON-CHAIN',
  'GROWTH',
];

/**
 * Locale-prefixes an INTERNAL path href (en at `/`, fr/de under `/fr` `/de`).
 * Hash links, absolute URLs and protocol links pass through untouched — so the
 * `#enquiry` CTA stays locale-agnostic while `/work` becomes `/fr/work`.
 */
function localeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/')) return href; // hash, http(s), mailto, tel, …
  const prefix = locale === 'en' ? '' : `/${locale}`;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) return href; // already prefixed
  return `${prefix}${href}`;
}

/**
 * Renders the h1 string token-by-token, wrapping accent words in a lime span.
 * The FULL original text stays in the DOM (so SSR/crawlers and `toHaveTextContent`
 * see the complete headline); SplitText later preserves the nested spans, so
 * accent words keep their colour through the kinetic reveal.
 */
function renderHeadline(h1: string, accent: string[]): ReactNode {
  const accentSet = new Set(accent.map((w) => w.toLowerCase()));
  // Split on spaces but keep the spaces so the headline reads identically.
  const tokens = h1.split(/(\s+)/);
  return tokens.map((token, i) => {
    const bare = token.replace(/[.,&]/g, '').toLowerCase();
    if (accentSet.has(bare)) {
      return (
        <span key={i} className="text-accent">
          {token}
        </span>
      );
    }
    return <Fragment key={i}>{token}</Fragment>;
  });
}

export function HeroSection({
  h1,
  sub,
  lead,
  primaryCta,
  secondaryCta,
  locale,
}: HeroSectionProps & { locale: Locale }) {
  const accent = ACCENT_WORDS[locale] ?? ACCENT_WORDS.en;

  return (
    <section
      data-section="hero"
      className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden px-6 py-24 md:py-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Kicker */}
        <Reveal
          as="p"
          className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-text-dim"
        >
          <span className="text-accent">/</span> Luxembourg AI studio
        </Reveal>

        {/* LCP node: real text at full opacity in SSR. KineticHeadline only
            animates after hydration when motion is allowed; reduced-motion and
            no-JS leave the headline fully legible. */}
        <KineticHeadline
          as="h1"
          className="font-display text-balance uppercase leading-[0.92] tracking-[-0.01em] text-text"
          // clamp() keeps the poster scale fluid from phone to desktop.
          // Inline so it isn't purged and reads as the single source of size.
        >
          <span className="block" style={{ fontSize: 'clamp(2.75rem, 9vw, 8rem)' }}>
            {renderHeadline(h1, accent)}
          </span>
        </KineticHeadline>

        {/* Sub + lead may animate in (below the LCP). */}
        <Reveal as="p" className="mt-7 max-w-2xl text-xl font-medium text-text md:text-2xl">
          {sub}
        </Reveal>
        <Reveal as="p" className="mt-4 max-w-2xl text-base text-text-dim md:text-lg">
          {lead}
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          {/* Primary CTA: magnetic lime pill. next/link forwards the ref so the
              magnet attaches; href is locale-aware (the #enquiry hash is kept). */}
          <MagneticButton asChild>
            <Link href={localeHref(primaryCta.href, locale)} className="ol-btn" data-cta>
              {primaryCta.label}
            </Link>
          </MagneticButton>
          {/* Secondary: ghost underline link, locale-prefixed internal route. */}
          <Link href={localeHref(secondaryCta.href, locale)} className="ol-link text-text-dim">
            {secondaryCta.label}
          </Link>
        </div>
      </div>

      {/* Capability ticker below the fold line. */}
      <div className="mt-16 w-full md:mt-20">
        <Marquee items={CAPABILITIES} aria-label="What we build" />
      </div>
    </section>
  );
}
