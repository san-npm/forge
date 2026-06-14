// src/components/AuditForm.tsx
'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/site-config';
import { getUiStrings } from '@/data/ui';

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

export function AuditForm({
  enquiryHref,
  locale = 'en' as Locale,
}: {
  enquiryHref: string;
  locale?: Locale;
}) {
  const t = getUiStrings(locale).audit;
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
        setError(json.error ?? t.genericError);
        return;
      }
      setResult(json as AuditResponse);
    } catch {
      setError(t.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="audit-url" className="sr-only">
          {t.urlLabel}
        </label>
        <input
          id="audit-url"
          name="url"
          type="text"
          inputMode="url"
          required
          placeholder={t.placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="ol-input flex-1"
        />
        <button type="submit" disabled={loading} className="ol-btn justify-center disabled:opacity-60">
          {loading ? t.checking : t.run}
        </button>
      </form>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-text">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-12" data-testid="audit-result">
          <div className="flex flex-wrap items-end gap-6 border-b border-hairline pb-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-dim">{t.grade}</p>
              <p
                className="mt-2 font-display uppercase leading-none text-accent"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 6rem)' }}
              >
                {result.grade}
              </p>
            </div>
            <p className="pb-3 font-mono text-text-dim">
              {result.score} / {result.maxScore}
            </p>
          </div>

          <ul className="mt-8 divide-y divide-hairline border-b border-hairline">
            {result.checks.map((c) => (
              <li key={c.id} className="flex items-start gap-3 py-4">
                <span aria-hidden className={c.pass ? 'text-accent' : 'text-text-dim'}>
                  {c.pass ? '✓' : '✗'}
                </span>
                <span>
                  <span className="block text-text">{c.label}</span>
                  {!c.pass ? (
                    <span className="mt-1 block text-sm text-text-dim">{c.recommendation}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <a href={enquiryHref} className="ol-btn" data-cta>
              {t.fixWithUs} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
