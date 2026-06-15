import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';
import { FOOTER } from '@/data/nav';
import { siteConfig } from '@/lib/site-config';

describe('Footer', () => {
  it('renders the 4 footer columns', () => {
    const { container } = render(<Footer locale="en" />);
    expect(container.querySelectorAll('[data-footer-col]')).toHaveLength(4);
    for (const col of FOOTER) {
      expect(screen.getByText(col.heading)).toBeInTheDocument();
    }
  });

  it('renders the Commit Media legal entity line', () => {
    render(<Footer locale="en" />);
    expect(screen.getByText(siteConfig.brand.legalEntity)).toBeInTheDocument();
    expect(screen.getByText(/B276192/)).toBeInTheDocument();
  });

  it('embeds the newsletter form', () => {
    const { container } = render(<Footer locale="en" />);
    expect(container.querySelector('[data-newsletter-form]')).toBeInTheDocument();
  });
});
