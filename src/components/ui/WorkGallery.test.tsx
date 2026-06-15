import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkGallery } from '@/components/ui/WorkGallery';
import type { WorkItem } from '@/lib/schema';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const items: WorkItem[] = [
  { slug: 'vinsfins', name: 'Vins Fins', kind: 'E-commerce', link: 'https://www.vinsfins.lu',
    blurb: 'A wine shop', about: 'about', did: [], stack: [], tag: 'web' },
  { slug: 'ophis', name: 'Ophis', kind: 'Web3 / DeFi', link: 'https://ophis.fi',
    blurb: 'DEX aggregator', about: 'about', did: [], stack: [], tag: 'web3' },
];

beforeEach(() => push.mockReset());
afterEach(() => { delete (document as any).startViewTransition; });

describe('WorkGallery', () => {
  it('renders one card per work item with its name and a unique view-transition-name', () => {
    render(<WorkGallery items={items} basePath="/work" />);
    expect(screen.getByText('Vins Fins')).toBeInTheDocument();
    expect(screen.getByText('Ophis')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Vins Fins/ });
    expect(link.style.viewTransitionName).toBe('work-vinsfins');
  });

  it('uses document.startViewTransition when available', () => {
    const stub = vi.fn((cb: () => void) => { cb(); return { finished: Promise.resolve() }; });
    (document as any).startViewTransition = stub;
    render(<WorkGallery items={items} basePath="/work" />);
    fireEvent.click(screen.getByRole('link', { name: /Vins Fins/ }));
    expect(stub).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/work/vinsfins');
  });

  it('falls back to plain navigation when startViewTransition is unavailable', () => {
    render(<WorkGallery items={items} basePath="/work" />);
    fireEvent.click(screen.getByRole('link', { name: /Ophis/ }));
    expect(push).toHaveBeenCalledWith('/work/ophis');
  });
});
