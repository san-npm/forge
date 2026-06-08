import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Nav } from '@/components/Nav';
import { NAV, START_PROJECT } from '@/data/nav';
import { LANGS } from '@/data/hero-i18n';

describe('Nav', () => {
  it('renders the 4 flat nav links', () => {
    render(<Nav locale="en" />);
    expect(NAV).toHaveLength(4);
    for (const item of NAV) {
      expect(screen.getByRole('link', { name: item.label })).toBeInTheDocument();
    }
  });

  it('renders the persistent Start a project CTA', () => {
    render(<Nav locale="en" />);
    expect(screen.getByRole('link', { name: START_PROJECT })).toBeInTheDocument();
  });

  it('renders an en/fr/de language switch', () => {
    render(<Nav locale="en" />);
    expect(LANGS.map((l) => l.code)).toEqual(['en', 'fr', 'de']);
    for (const lang of LANGS) {
      expect(screen.getByRole('link', { name: new RegExp(lang.label, 'i') })).toBeInTheDocument();
    }
  });
});
