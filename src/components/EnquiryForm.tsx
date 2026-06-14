'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { ContactPayloadSchema, type ContactPayload } from '@/lib/schema';
import { MagneticButton } from '@/components/ui/MagneticButton';

const COMPANY_SIZES: NonNullable<ContactPayload['companySize']>[] = [
  'solo', '1-10', '11-50', '51-250', '250+',
];
const BUDGETS: NonNullable<ContactPayload['budget']>[] = [
  '<5k', '5-15k', '15-50k', '50k+', 'unsure',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function EnquiryForm({ pillars }: { pillars: string[] }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    const fd = new FormData(e.currentTarget);
    const candidate = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: optional(fd.get('company')),
      companySize: optional(fd.get('companySize')),
      pillar: optional(fd.get('pillar')),
      budget: optional(fd.get('budget')),
      message: optional(fd.get('message')),
    };

    const parsed = ContactPayloadSchema.safeParse(candidate);
    if (!parsed.success) {
      setStatus('error');
      setError('Please enter your name and a valid email.');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        setStatus('success');
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus('error');
      setError(data.error ?? 'Something went wrong. Please try again.');
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <p data-enquiry-success className="text-text">
        Thanks, we've got it. We reply within one business day.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4" data-enquiry-form>
      <Field label="Name" id="name">
        <input id="name" name="name" required maxLength={500} className="ol-input" />
      </Field>
      <Field label="Email" id="email">
        <input id="email" name="email" type="email" required maxLength={500} className="ol-input" />
      </Field>
      <Field label="Company size" id="companySize">
        <select id="companySize" name="companySize" className="ol-input" defaultValue="">
          <option value="" disabled>Choose&hellip;</option>
          {COMPANY_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field label="What can we help with (pillar)" id="pillar">
        <select id="pillar" name="pillar" className="ol-input" defaultValue="">
          <option value="" disabled>Choose&hellip;</option>
          {pillars.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </Field>
      <Field label="Budget" id="budget">
        <select id="budget" name="budget" className="ol-input" defaultValue="">
          <option value="" disabled>Choose&hellip;</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </Field>
      <Field label="Tell us what you want to build (message)" id="message">
        <textarea id="message" name="message" rows={4} maxLength={2000} className="ol-input" />
      </Field>

      {status === 'error' && (
        <p role="alert" className="text-text-dim text-sm">{error}</p>
      )}

      <MagneticButton type="submit" disabled={status === 'submitting'} className="ol-btn mt-2 w-fit disabled:opacity-60">
        {status === 'submitting' ? 'Sending…' : 'Start a project'}
      </MagneticButton>
    </form>
  );
}

function optional(v: FormDataEntryValue | null): string | undefined {
  const s = typeof v === 'string' ? v.trim() : '';
  return s.length ? s : undefined;
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="grid gap-1 text-text-dim text-sm">
      <span>{label}</span>
      {children}
    </label>
  );
}
