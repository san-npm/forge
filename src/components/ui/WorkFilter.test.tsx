import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkFilter } from '@/components/ui/WorkFilter';
import { WORK } from '@/data/work';

describe('WorkFilter', () => {
  it('renders all items by default', () => {
    render(
      <WorkFilter items={WORK}>
        {(visible) => <ul>{visible.map((w) => <li key={w.slug}>{w.name}</li>)}</ul>}
      </WorkFilter>,
    );
    for (const w of WORK) expect(screen.getByText(w.name)).toBeInTheDocument();
  });

  it('filters to a single tag when a tag button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <WorkFilter items={WORK}>
        {(visible) => <ul>{visible.map((w) => <li key={w.slug}>{w.name}</li>)}</ul>}
      </WorkFilter>,
    );
    await user.click(screen.getByRole('tab', { name: /^web3$/i }));
    const web3 = WORK.filter((w) => w.tag === 'web3');
    const others = WORK.filter((w) => w.tag !== 'web3');
    for (const w of web3) expect(screen.getByText(w.name)).toBeInTheDocument();
    for (const w of others) expect(screen.queryByText(w.name)).not.toBeInTheDocument();
  });

  it('returns to all when the All button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <WorkFilter items={WORK}>
        {(visible) => <ul>{visible.map((w) => <li key={w.slug}>{w.name}</li>)}</ul>}
      </WorkFilter>,
    );
    await user.click(screen.getByRole('tab', { name: /^web3$/i }));
    await user.click(screen.getByRole('tab', { name: /^all$/i }));
    for (const w of WORK) expect(screen.getByText(w.name)).toBeInTheDocument();
  });
});
