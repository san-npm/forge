'use client';

import { useState, type FormEvent } from 'react';
import { NewsletterSchema } from '@/lib/schema';

type Status = 'idle' | 'submitting' | 'success' | 'already' | 'error';

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const candidate = { email: String(fd.get('email') ?? '').trim() };

    const parsed = NewsletterSchema.safeParse(candidate);
    if (!parsed.success) {
      setStatus('error');
      setError('Please enter a valid email.');
      return;
    }

    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        alreadySubscribed?: boolean;
        error?: string;
      };
      if (res.ok && data.success) {
        setStatus(data.alreadySubscribed ? 'already' : 'success');
        return;
      }
      setStatus('error');
      setError(data.error ?? 'Something went wrong.');
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  }

  if (status === 'success' || status === 'already') {
    return (
      <p data-newsletter-done className="text-text-dim text-sm">
        {status === 'already' ? "You're already subscribed, thanks." : 'Subscribed, thanks.'}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2" data-newsletter-form>
      <label htmlFor="nl-email" className="text-text-dim text-sm">
        Email
      </label>
      <div className="flex gap-2">
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          maxLength={500}
          className="ol-input flex-1"
        />
        <button type="submit" disabled={status === 'submitting'} className="ol-btn">
          {status === 'submitting' ? '…' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && <p role="alert" className="text-text-dim text-xs">{error}</p>}
    </form>
  );
}
