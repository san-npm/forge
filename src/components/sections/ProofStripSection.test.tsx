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
    { id: 'years', label: 'Years building and marketing', value: 5, suffix: '+' },
    { id: 'disciplines', label: 'Disciplines shipped: AI, web and on-chain', value: 3, suffix: '' },
    { id: 'alephPartner', label: 'Marketing partner to Aleph Cloud', value: null, text: 'Aleph Cloud' },
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
    expect(screen.getByText('Years building and marketing')).toBeInTheDocument();
    expect(screen.getByText('Disciplines shipped: AI, web and on-chain')).toBeInTheDocument();
    // The real numbers paint immediately (CountUp seeds to `to`).
    expect(container.textContent).toContain('5');
    expect(container.textContent).toContain('3');
  });

  it('renders the Aleph Cloud marketing credential as Anton text (not a number)', () => {
    render(<ProofStripSection {...props} />);
    expect(screen.getByText('Marketing partner to Aleph Cloud')).toBeInTheDocument();
    // "Aleph Cloud" appears as the big Anton credential value.
    expect(screen.getByText('Aleph Cloud')).toBeInTheDocument();
  });

  it('does not advertise a bare product count and shows no degraded "—" placeholder', () => {
    const { container } = render(<ProofStripSection {...props} />);
    expect(container.textContent).not.toContain('—');
    expect(container.textContent).not.toMatch(/products?\s+(shipped|live|built)/i);
    // Honest naming only: never "Aleph.im".
    expect(container.textContent).not.toMatch(/aleph\.im/i);
  });
});
