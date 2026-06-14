import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

// next-intl's createNavigation imports next/navigation which doesn't resolve in
// jsdom; stub the localized Link/usePathname so Nav + LanguageDropdown render.
vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href, ...rest }: { children: ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => '/',
}));

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

  it('renders the persistent Start a project CTA with the lime pill class', () => {
    render(<Nav locale="en" />);
    const cta = screen.getByRole('link', { name: START_PROJECT });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveClass('ol-btn');
  });

  it('still supports en/fr/de as the locale set', () => {
    // Language switching now lives in the <LanguageDropdown /> menu button.
    expect(LANGS.map((l) => l.code)).toEqual(['en', 'fr', 'de']);
    render(<Nav locale="en" />);
    expect(screen.getByRole('button', { name: /change language/i })).toBeInTheDocument();
  });
});
