import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MagneticButton } from '@/components/ui/MagneticButton';

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

describe('MagneticButton', () => {
  beforeEach(() => cleanup());

  it('renders as an anchor when given an href', () => {
    setReducedMotion(false);
    render(<MagneticButton href="#enquiry">Start a project</MagneticButton>);
    const link = screen.getByRole('link', { name: 'Start a project' });
    expect(link).toHaveAttribute('href', '#enquiry');
  });

  it('renders a real <button> (forwarding type) when no href is given', () => {
    setReducedMotion(false);
    render(
      <MagneticButton type="submit" onClick={() => {}}>
        Send
      </MagneticButton>,
    );
    const btn = screen.getByRole('button', { name: 'Send' });
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('asChild wraps a passed child (e.g. a Next Link) instead of emitting its own element', () => {
    setReducedMotion(false);
    render(
      <MagneticButton asChild>
        <a href="/work">See our work</a>
      </MagneticButton>,
    );
    const link = screen.getByRole('link', { name: 'See our work' });
    expect(link).toHaveAttribute('href', '/work');
  });

  it('reduced-motion: still renders the link (magnet disabled, label intact)', () => {
    setReducedMotion(true);
    render(<MagneticButton href="/contact">Start a project</MagneticButton>);
    expect(screen.getByRole('link', { name: 'Start a project' })).toBeInTheDocument();
  });
});
