import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProofStripSection } from '@/components/sections/ProofStripSection';
import type { ProofStripSectionProps } from '@/lib/schema';

const props: ProofStripSectionProps = {
  type: 'proofStrip',
  label: 'Shipped & live',
  logos: [
    { slug: 'vinsfins', name: 'Vins Fins', src: '/clients/vinsfins.png', href: 'https://www.vinsfins.lu' },
    { slug: 'lagrocerie', name: 'La Grocerie', src: '/clients/lagrocerie.png', href: 'https://www.lagrocerie.lu' },
  ],
  metrics: [
    { id: 'shipped', label: 'Products shipped & live', value: 6, suffix: '' },
    { id: 'years', label: 'Years building', value: 5, suffix: '+' },
  ],
};

describe('ProofStripSection', () => {
  it('renders the label and every wordmark in static HTML (crawlable)', () => {
    render(<ProofStripSection {...props} />);
    expect(screen.getByText('Shipped & live')).toBeInTheDocument();
    expect(screen.getByText('Vins Fins')).toBeInTheDocument();
    expect(screen.getByText('La Grocerie')).toBeInTheDocument();
  });

  it('each wordmark links to the live product', () => {
    render(<ProofStripSection {...props} />);
    expect(screen.getByRole('link', { name: /vins fins/i })).toHaveAttribute(
      'href',
      'https://www.vinsfins.lu',
    );
  });

  it('renders the static metric labels and real values in SSR (no live placeholder)', () => {
    const { container } = render(<ProofStripSection {...props} />);
    expect(screen.getByText('Products shipped & live')).toBeInTheDocument();
    expect(screen.getByText('Years building')).toBeInTheDocument();
    // The real numbers paint immediately (CountUp seeds to `to`).
    expect(container.textContent).toContain('6');
    expect(container.textContent).toContain('5');
  });

  it('shows no degraded "—" placeholder and no Aleph metric', () => {
    const { container } = render(<ProofStripSection {...props} />);
    expect(container.textContent).not.toContain('—');
    expect(container.textContent).not.toMatch(/aleph/i);
    expect(container.textContent).not.toMatch(/node/i);
  });
});
