import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

// Stub the localized Link (records the target locale) + usePathname.
vi.mock('@/i18n/routing', () => ({
  Link: ({
    children,
    href,
    locale,
    ...rest
  }: {
    children: ReactNode;
    href: string;
    locale?: string;
  }) => (
    <a href={href} data-locale={locale} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => '/work',
}));

import { LanguageDropdown } from '@/components/LanguageDropdown';

describe('LanguageDropdown', () => {
  it('renders a compact pill showing the current locale code', () => {
    render(<LanguageDropdown locale="en" />);
    const trigger = screen.getByRole('button', { name: /change language/i });
    expect(trigger).toHaveTextContent('EN');
    // Menu is closed by default.
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens a menu with EN / FR / DE that switch locale on the current path', async () => {
    const user = userEvent.setup();
    render(<LanguageDropdown locale="en" />);
    await user.click(screen.getByRole('button', { name: /change language/i }));

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    for (const [label, code] of [
      ['English', 'en'],
      ['Français', 'fr'],
      ['Deutsch', 'de'],
    ] as const) {
      const item = screen.getByRole('menuitem', { name: new RegExp(label, 'i') });
      // Each option points at the same path, re-prefixed by its locale.
      expect(item).toHaveAttribute('href', '/work');
      expect(item).toHaveAttribute('data-locale', code);
    }
  });

  it('marks the active locale as current', async () => {
    const user = userEvent.setup();
    render(<LanguageDropdown locale="fr" />);
    // The trigger's accessible name is localized (fr: "Changer de langue").
    await user.click(screen.getByRole('button', { name: /changer de langue/i }));
    const active = screen.getByRole('menuitem', { name: /français/i });
    expect(active).toHaveAttribute('aria-current', 'true');
  });

  it('closes the menu on Escape', async () => {
    const user = userEvent.setup();
    render(<LanguageDropdown locale="en" />);
    await user.click(screen.getByRole('button', { name: /change language/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
