import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactBody } from './page';
import { CONTACT } from '@/data/contact';

describe('ContactBody', () => {
  it('renders the lead, the enquiry form and the call line', () => {
    const { container } = render(<ContactBody />);
    expect(screen.getByText(CONTACT.lead)).toBeInTheDocument();
    expect(container.querySelector('[data-enquiry-form]')).toBeInTheDocument();
    expect(screen.getByText(/15-minute intro call/i)).toBeInTheDocument();
  });

  it('offers every CONTACT pillar in the form', () => {
    render(<ContactBody />);
    const select = screen.getByLabelText(/pillar|what can we help/i);
    for (const t of CONTACT.types) {
      expect(select).toHaveTextContent(t);
    }
  });
});
