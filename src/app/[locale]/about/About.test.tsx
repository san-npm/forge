import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutBody } from './page';
import { ABOUT } from '@/data/about';

describe('AboutBody', () => {
  it('renders the founder name, role and bio lead', () => {
    render(<AboutBody />);
    expect(screen.getByText(ABOUT.founderName)).toBeInTheDocument();
    expect(screen.getByText(ABOUT.founderRole)).toBeInTheDocument();
    expect(screen.getByText(ABOUT.bioLead)).toBeInTheDocument();
  });

  it('renders the entity line and all trust facts', () => {
    render(<AboutBody />);
    expect(screen.getByText(ABOUT.entity)).toBeInTheDocument();
    for (const fact of ABOUT.facts) expect(screen.getByText(fact)).toBeInTheDocument();
  });
});
