import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnquiryForm } from '@/components/EnquiryForm';
import { ContactPayloadSchema } from '@/lib/schema';
import { CONTACT } from '@/data/contact';

afterEach(() => vi.restoreAllMocks());

function mockFetchOk() {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
}

describe('EnquiryForm', () => {
  it('renders all six qualifying fields', () => {
    render(<EnquiryForm pillars={CONTACT.types} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pillar|what can we help/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message|tell us/i)).toBeInTheDocument();
  });

  it('posts a schema-valid ContactPayload to /api/contact', async () => {
    const fetchSpy = mockFetchOk();
    const user = userEvent.setup();
    render(<EnquiryForm pillars={CONTACT.types} />);

    await user.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.selectOptions(screen.getByLabelText(/company size/i), '1-10');
    await user.selectOptions(screen.getByLabelText(/pillar|what can we help/i), 'AI automation');
    await user.selectOptions(screen.getByLabelText(/budget/i), '5-15k');
    await user.type(screen.getByLabelText(/message|tell us/i), 'Build me an agent.');
    await user.click(screen.getByRole('button', { name: /start a project/i }));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledOnce());
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('/api/contact');
    const body = JSON.parse((init as RequestInit).body as string);
    // body must satisfy the shared ContactPayload schema
    expect(ContactPayloadSchema.safeParse(body).success).toBe(true);
    expect(body.name).toBe('Ada Lovelace');
    expect(body.email).toBe('ada@example.com');
    expect(body.companySize).toBe('1-10');
    expect(body.pillar).toBe('AI automation');
    expect(body.budget).toBe('5-15k');
  });

  it('shows a success message after a 200', async () => {
    mockFetchOk();
    const user = userEvent.setup();
    render(<EnquiryForm pillars={CONTACT.types} />);
    await user.type(screen.getByLabelText(/name/i), 'Ada');
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: /start a project/i }));
    expect(await screen.findByText(/business day|thanks|got it/i)).toBeInTheDocument();
  });

  it('surfaces the 429 rate-limit error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 }),
    );
    const user = userEvent.setup();
    render(<EnquiryForm pillars={CONTACT.types} />);
    await user.type(screen.getByLabelText(/name/i), 'Ada');
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: /start a project/i }));
    expect(await screen.findByText(/too many requests/i)).toBeInTheDocument();
  });
});
