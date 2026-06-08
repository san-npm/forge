import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Reveal } from '@/components/ui/Reveal';

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

describe('Reveal', () => {
  beforeEach(() => cleanup());

  it('always renders its children content (SSR/crawler safe)', () => {
    setReducedMotion(false);
    render(<Reveal>Hello world</Reveal>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('reduced-motion: content visible at full opacity', () => {
    setReducedMotion(true);
    render(<Reveal data-testid="r">Quiet content</Reveal>);
    expect(screen.getByTestId('r')).toBeInTheDocument();
    expect(screen.getByText('Quiet content')).toBeVisible();
  });

  it('no-preference: still renders children (animation is progressive enhancement)', () => {
    setReducedMotion(false);
    render(<Reveal data-testid="r2">Animated content</Reveal>);
    expect(screen.getByTestId('r2')).toBeInTheDocument();
  });

  it('is polymorphic via `as` (renders the requested tag)', () => {
    setReducedMotion(true);
    const { container } = render(
      <Reveal as="li" stagger={2} className="x">
        Item
      </Reveal>,
    );
    expect(container.querySelector('li')).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeVisible();
  });
});
