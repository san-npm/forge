import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProofStripLive } from '@/components/ui/ProofStripLive';
import type { ProofSnapshot } from '@/lib/proof';

const base: ProofSnapshot = {
  metrics: [
    { id: 'shipped', label: 'Products shipped', value: 6, suffix: '+' },
    { id: 'alephNodes', label: 'Aleph nodes', value: 1234, live: true },
  ],
  verifiedAt: Date.now() - 5 * 60_000,
  degraded: false,
};

describe('ProofStripLive', () => {
  it('renders each metric label', () => {
    render(<ProofStripLive snapshot={base} />);
    expect(screen.getByText('Products shipped')).toBeInTheDocument();
    expect(screen.getByText('Aleph nodes')).toBeInTheDocument();
  });

  it('shows a "verified N min ago" freshness label', () => {
    render(<ProofStripLive snapshot={base} />);
    expect(screen.getByText(/verified 5 min ago/i)).toBeInTheDocument();
  });

  it('never throws and still renders on a degraded snapshot', () => {
    const degraded: ProofSnapshot = { ...base, degraded: true };
    expect(() => render(<ProofStripLive snapshot={degraded} />)).not.toThrow();
    expect(screen.getByText(/verified/i)).toBeInTheDocument();
  });

  it('omits null-valued metrics gracefully', () => {
    const withNull: ProofSnapshot = {
      ...base,
      metrics: [{ id: 'pending', label: 'Pending', value: null }],
    };
    expect(() => render(<ProofStripLive snapshot={withNull} />)).not.toThrow();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});
