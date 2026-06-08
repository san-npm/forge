import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuditForm } from '@/components/AuditForm';

const RESULT = {
  url: 'https://example.com/',
  score: 60,
  maxScore: 100,
  grade: 'C',
  checks: [
    { id: 'https', label: 'Served over HTTPS', category: 'security', pass: true, weight: 10, recommendation: 'ok' },
    { id: 'llms-txt', label: 'llms.txt for AI crawlers', category: 'aeo', pass: false, weight: 10, recommendation: 'Publish /llms.txt.' },
  ],
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(RESULT), { status: 200 })));
});
afterEach(() => vi.unstubAllGlobals());

describe('AuditForm', () => {
  it('submits a URL and renders the grade and individual checks', async () => {
    render(<AuditForm enquiryHref="/contact" />);
    fireEvent.change(screen.getByLabelText(/website url/i), { target: { value: 'example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /run the audit/i }));
    await waitFor(() => expect(screen.getByText(/Grade/i)).toBeInTheDocument());
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('Served over HTTPS')).toBeInTheDocument();
    expect(screen.getByText('llms.txt for AI crawlers')).toBeInTheDocument();
    // routes to enquiry
    expect(screen.getByRole('link', { name: /fix this with us/i })).toHaveAttribute('href', '/contact');
  });

  it('shows an error message when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'Could not reach that URL' }), { status: 502 })));
    render(<AuditForm enquiryHref="/contact" />);
    fireEvent.change(screen.getByLabelText(/website url/i), { target: { value: 'example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /run the audit/i }));
    await waitFor(() => expect(screen.getByText(/Could not reach that URL/i)).toBeInTheDocument());
  });
});
