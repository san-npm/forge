import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/sections/HeroSection';
import type { HeroSectionProps } from '@/lib/schema';

const props: HeroSectionProps = {
  type: 'hero',
  h1: 'Websites that think, move & transact.',
  sub: 'A Luxembourg AI studio.',
  lead: 'We build AI agents and the sites around them.',
  primaryCta: { label: 'Start a project', href: '#enquiry' },
  secondaryCta: { label: 'See our work', href: '/work' },
};

describe('HeroSection', () => {
  it('renders the full H1, sub and lead in static (SSR) HTML', () => {
    render(<HeroSection {...props} locale="en" />);
    // The complete headline text is present even though verbs are wrapped in
    // accent spans — crawlers + reduced-motion see the real, legible copy.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Websites that think, move & transact.',
    );
    expect(screen.getByText('A Luxembourg AI studio.')).toBeInTheDocument();
    expect(screen.getByText(/AI agents and the sites/)).toBeInTheDocument();
  });

  it('sets the verbs in the lime accent', () => {
    render(<HeroSection {...props} locale="en" />);
    const h1 = screen.getByRole('heading', { level: 1 });
    const accents = h1.querySelectorAll('.text-accent');
    // think · move · transact
    expect(accents.length).toBe(3);
  });

  it('does NOT render the LCP H1 at opacity:0 (paintable on first paint)', () => {
    const { container } = render(<HeroSection {...props} locale="en" />);
    const h1 = container.querySelector('h1')!;
    expect(h1.style.opacity === '0').toBe(false);
    expect(h1.getAttribute('data-reveal')).toBeNull();
  });

  it('exposes both CTAs as links to the right targets (en: no prefix)', () => {
    render(<HeroSection {...props} locale="en" />);
    expect(screen.getByRole('link', { name: /start a project/i })).toHaveAttribute(
      'href',
      '#enquiry',
    );
    expect(screen.getByRole('link', { name: /see our work/i })).toHaveAttribute('href', '/work');
  });

  it('locale-prefixes internal links for non-default locales (fr) but not the hash CTA', () => {
    render(<HeroSection {...props} locale="fr" />);
    // hash CTA is locale-agnostic
    expect(screen.getByRole('link', { name: /start a project/i })).toHaveAttribute(
      'href',
      '#enquiry',
    );
    // internal path is prefixed
    expect(screen.getByRole('link', { name: /see our work/i })).toHaveAttribute(
      'href',
      '/fr/work',
    );
  });
});
