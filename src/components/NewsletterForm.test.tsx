import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewsletterForm } from '@/components/NewsletterForm';

afterEach(() => vi.restoreAllMocks());

describe('NewsletterForm', () => {
  it('posts the email to /api/newsletter', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<NewsletterForm />);
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledOnce());
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('/api/newsletter');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ email: 'ada@example.com' });
    expect(await screen.findByText(/subscribed|thanks/i)).toBeInTheDocument();
  });

  it('treats alreadySubscribed as success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true, alreadySubscribed: true }), { status: 200 }),
    );
    const user = userEvent.setup();
    render(<NewsletterForm />);
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));
    expect(await screen.findByText(/already|subscribed|thanks/i)).toBeInTheDocument();
  });

  it('rejects an invalid email before fetching', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const user = userEvent.setup();
    render(<NewsletterForm />);
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });
});
