import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Testimonials } from '@/components/Testimonials';
import type { Testimonial } from '@/lib/schema';

const sample: Testimonial[] = [
  { quote: 'They shipped it fast and it works.', name: 'Jane Doe', role: 'Owner', company: 'Vins Fins' },
];

describe('Testimonials', () => {
  it('renders the quote, name, role and company in static markup', () => {
    render(<Testimonials items={sample} />);
    expect(screen.getByText(/They shipped it fast/)).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(/Owner/)).toBeInTheDocument();
    expect(screen.getByText(/Vins Fins/)).toBeInTheDocument();
  });

  it('renders nothing when there are no testimonials', () => {
    const { container } = render(<Testimonials items={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
