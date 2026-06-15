import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { CountUp } from '@/components/ui/CountUp';

function setReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('reduce') ? reduce : !reduce,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('CountUp', () => {
  beforeEach(() => cleanup());

  it('reduced-motion: renders the final value immediately (no animation)', () => {
    setReducedMotion(true);
    render(<CountUp to={42} suffix="+" />);
    expect(screen.getByText('42+')).toBeInTheDocument();
  });

  it('renders a numeric final value', () => {
    setReducedMotion(false);
    render(<CountUp to={6} />);
    // the final value is always present as text content
    expect(screen.getByText(/6/)).toBeInTheDocument();
  });
});
