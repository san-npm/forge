import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServicesBody } from '@/app/[locale]/services/page';
import { SERVICES } from '@/data/services';
import { START_PROJECT } from '@/data/nav';

describe('ServicesPage', () => {
  it('renders all three pillar titles and one CTA per pillar', () => {
    render(<ServicesBody locale="en" />);
    expect(screen.getByText(SERVICES.ai.title)).toBeInTheDocument();
    expect(screen.getByText(SERVICES.marketing.title)).toBeInTheDocument();
    expect(screen.getByText(SERVICES.web3.title)).toBeInTheDocument();
    const ctas = screen.getAllByRole('link', { name: START_PROJECT });
    expect(ctas.length).toBeGreaterThanOrEqual(3);
  });

  it('renders the AI pillar before the Web3 pillar (front-door order)', () => {
    render(<ServicesBody locale="en" />);
    const aiIdx = screen.getByText(SERVICES.ai.title).compareDocumentPosition(
      screen.getByText(SERVICES.web3.title),
    );
    // FOLLOWING bit (4) set => ai precedes web3 in the document
    expect(aiIdx & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
