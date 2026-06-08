import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { SectionRenderer } from '@/components/SectionRenderer';
import { HOME_SECTIONS } from '@/data/pages/home';
import type { Section } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';

// ProofStripSection is an async Server Component (fetches live data). In the
// unit-test environment it can't be resolved synchronously, so we stub it with
// a synchronous shell that keeps the data-section marker for the count assertion.
vi.mock('@/components/sections/ProofStripSection', () => ({
  ProofStripSection: ({ label }: { label: string }) => (
    <section data-section="proofStrip" aria-label={label} />
  ),
  ProofStripShell: ({ label }: { label: string }) => (
    <section data-section="proofStrip" aria-label={label} />
  ),
}));

const locale: Locale = 'en';

describe('SectionRenderer', () => {
  it('renders every section in HOME_SECTIONS without throwing', () => {
    const { container } = render(
      <SectionRenderer sections={HOME_SECTIONS} locale={locale} />,
    );
    // 8 top-level <section> shells, one per variant (footer is layout-level).
    expect(container.querySelectorAll('[data-section]').length).toBe(8);
  });

  it('renders the hero H1 from a single-section list', () => {
    const hero = HOME_SECTIONS.filter((s) => s.type === 'hero');
    render(<SectionRenderer sections={hero} locale={locale} />);
    expect(
      screen.getByRole('heading', { level: 1, name: /think, move & transact/i }),
    ).toBeInTheDocument();
  });

  it('throws on an unknown section type at runtime (assertNever)', () => {
    const bad = [{ type: 'totallyUnknown' } as unknown as Section];
    expect(() => render(<SectionRenderer sections={bad} locale={locale} />)).toThrow(
      /Unhandled section/,
    );
  });
});
