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

  it('renders the AI / Web / Web3 / Contributed filter controls', () => {
    render(<WorkGrid items={WORK} />);
    expect(screen.getByRole('tab', { name: /^all$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^ai$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^web3$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^contributed$/i })).toBeInTheDocument();
  });

  it('filtering to Contributed shows the contributed projects, not the products we built', async () => {
    const user = userEvent.setup();
    render(<WorkGrid items={WORK} />);
    await user.click(screen.getByRole('tab', { name: /^contributed$/i }));
    expect(screen.getByRole('link', { name: /liberclaw/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /libertai/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /aleph cloud/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /vins fins/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /gategram/i })).not.toBeInTheDocument();
  });
});
