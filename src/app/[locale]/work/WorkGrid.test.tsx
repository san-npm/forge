import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkGrid } from './WorkGrid';
import { WORK } from '@/data/work';

describe('WorkGrid', () => {
  it('renders every work item with a link to its live product', () => {
    render(<WorkGrid items={WORK} />);
    for (const w of WORK) {
      const link = screen.getByRole('link', { name: new RegExp(w.name, 'i') });
      expect(link).toHaveAttribute('href', w.link);
    }
  });

  it('renders the AI / Web / Web3 / Growth filter controls', () => {
    render(<WorkGrid items={WORK} />);
    expect(screen.getByRole('tab', { name: /^all$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^ai$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^web3$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^growth$/i })).toBeInTheDocument();
  });

  it('filtering to Growth shows only the Aleph Cloud marketing card', async () => {
    const user = userEvent.setup();
    render(<WorkGrid items={WORK} />);
    await user.click(screen.getByRole('tab', { name: /^growth$/i }));
    expect(screen.getByRole('link', { name: /aleph cloud/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /vins fins/i })).not.toBeInTheDocument();
  });
});
