import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/sections/HeroSection';
import type { HeroSectionProps } from '@/lib/schema';

const props: HeroSectionProps = {
  type: 'hero',
  h1: 'Websites that think, move & transact.',
  sub: 'A Luxembourg AI agency.',
  lead: 'We build AI agents and the sites around them.',
  primaryCta: { label: 'Start a project', href: '#enquiry' },
  secondaryCta: { label: 'See our work', href: '/work' },
};

describe('HeroSection', () => {
  it('renders the H1, sub and lead in static HTML', () => {
    render(<HeroSection {...props} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Websites that think, move & transact.',
    );
    expect(screen.getByText('A Luxembourg AI agency.')).toBeInTheDocument();
    expect(screen.getByText(/AI agents and the sites/)).toBeInTheDocument();
  });

  it('does NOT render the LCP H1 at opacity:0', () => {
    const { container } = render(<HeroSection {...props} />);
    const h1 = container.querySelector('h1')!;
    // LCP node must be paintable on first paint — no inline opacity:0, no reveal wrapper
    expect(h1.style.opacity === '0').toBe(false);
    expect(h1.getAttribute('data-reveal')).toBeNull();
  });

  it('exposes both CTAs as links to the right targets', () => {
    render(<HeroSection {...props} />);
    expect(screen.getByRole('link', { name: /start a project/i })).toHaveAttribute(
      'href',
      '#enquiry',
    );
    expect(screen.getByRole('link', { name: /see our work/i })).toHaveAttribute('href', '/work');
  });
});
