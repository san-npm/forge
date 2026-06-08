// src/components/AuditForm.tsx
'use client';

import { useState } from 'react';

interface Check {
  id: string;
  label: string;
  category: string;
  pass: boolean;
  weight: number;
  recommendation: string;
}
interface AuditResponse {
  url: string;
  score: number;
  maxScore: number;
  grade: string;
  checks: Check[];
}

export function AuditForm({ enquiryHref }: { enquiryHref: string }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setResult(json as AuditResponse);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="audit-url" className="sr-only">
          Website URL
        </label>
        <input
          id="audit-url"
          name="url"
          type="text"
          inputMode="url"
          required
          placeholder="yourdomain.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-md border border-hairline bg-surface-2 px-4 py-3 text-text placeholder:text-text-dim"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-hot px-6 py-3 font-medium text-bg disabled:opacity-60"
        >
          {loading ? 'Checking...' : 'Run the audit'}
        </button>
      </form>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-text">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-10" data-testid="audit-result">
          <div className="flex items-baseline gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-text-dim">Grade</p>
              <p className="text-5xl font-semibold text-text">{result.grade}</p>
            </div>
            <p className="text-text-dim">
              {result.score} / {result.maxScore}
            </p>
          </div>

          <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
            {result.checks.map((c) => (
              <li key={c.id} className="flex items-start gap-3 py-3">
                <span aria-hidden className={c.pass ? 'text-hot' : 'text-text-dim'}>
                  {c.pass ? '✓' : '✗'}
                </span>
                <span>
                  <span className="block text-text">{c.label}</span>
                  {!c.pass ? (
                    <span className="block text-sm text-text-dim">{c.recommendation}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <a
              href={enquiryHref}
              className="inline-flex items-center rounded-md bg-hot px-6 py-3 font-medium text-bg"
            >
              Fix this with us
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
