import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProofStripShell } from '@/components/sections/ProofStripSection';
import type { ProofStripSectionProps } from '@/lib/schema';
import type { ProofSnapshot } from '@/lib/proof';

const props: ProofStripSectionProps = {
  type: 'proofStrip',
  label: 'Shipped & live',
  logos: [
    { slug: 'vinsfins', name: 'Vins Fins', src: '/clients/vinsfins-logo.png', href: 'https://www.vinsfins.lu' },
    { slug: 'lagrocerie', name: 'La Grocerie', src: '/clients/lagrocerie-logo.png', href: 'https://www.lagrocerie.lu' },
  ],
  metrics: [{ id: 'shipped', label: 'Products shipped', value: 6, suffix: '+' }],
};

const snapshot: ProofSnapshot = {
  metrics: props.metrics,
  verifiedAt: Date.now(),
  degraded: false,
};

describe('ProofStripShell', () => {
  it('renders the label and every wordmark in static HTML (crawlable)', () => {
    render(<ProofStripShell {...props} snapshot={snapshot} />);
    expect(screen.getByText('Shipped & live')).toBeInTheDocument();
    expect(screen.getByText('Vins Fins')).toBeInTheDocument();
    expect(screen.getByText('La Grocerie')).toBeInTheDocument();
  });

  it('each wordmark links to the live product', () => {
    render(<ProofStripShell {...props} snapshot={snapshot} />);
    expect(screen.getByRole('link', { name: /vins fins/i })).toHaveAttribute(
      'href',
      'https://www.vinsfins.lu',
    );
  });
});
