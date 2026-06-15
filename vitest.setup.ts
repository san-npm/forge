import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Stub the GSAP barrel (@/lib/gsap) for the test environment. The redesigned
// pages render ScrollReveal / KineticHeadline islands that import it; the real
// module registers ScrollTrigger and a requestAnimationFrame ticker loop that
// jsdom can't run and that throws after the environment is torn down. The unit
// and component tests only assert on the SSR / static content the islands
// render regardless of motion, so a no-op stub is faithful and deterministic.
vi.mock('@/lib/gsap', () => {
  const noop = () => {};
  const tween = { revert: noop, kill: noop };
  const gsap = {
    from: () => tween,
    to: () => tween,
    set: () => tween,
    context: () => ({ revert: noop, add: noop }),
    registerPlugin: noop,
    ticker: { add: noop, remove: noop, lagSmoothing: noop },
  };
  const SplitText = {
    create: () => ({ chars: [], words: [], lines: [], revert: noop }),
  };
  return {
    gsap,
    ScrollTrigger: { create: () => ({ kill: noop }), refresh: noop },
    SplitText,
    // useGSAP runs the effect callback once (cleanup ignored) so islands mount.
    useGSAP: (cb: () => void | (() => void)) => {
      if (typeof cb === 'function') cb();
    },
  };
});

// jsdom has no matchMedia; reduced-motion + responsive code reads it.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// jsdom has no IntersectionObserver; reveal/count-up islands observe.
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class MockIntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }
  // @ts-expect-error -- assigning a test double to the global
  window.IntersectionObserver = MockIntersectionObserver;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;
}
