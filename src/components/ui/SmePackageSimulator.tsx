'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/site-config';
import { localeHref } from '@/lib/locale-href';
import { getUiStrings } from '@/data/ui';
import { getStartProject } from '@/data/nav';
import {
  computeSmePackage,
  SME_MIN,
  SME_MAX,
  SME_RATE,
} from '@/lib/sme-package';

const STEP = 500;
const DEFAULT_BUDGET = 10000;

/** EUR with no decimals, e.g. 10000 -> "EUR 10,000". The "EUR " code prefix
 * reads cleaner than the symbol on this ink/lime canvas and stays language
 * neutral; grouping uses en-US thousands separators for a consistent layout. */
const eur = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  currencyDisplay: 'code',
  maximumFractionDigits: 0,
});
function formatEur(n: number): string {
  return eur.format(n).replace('EUR', 'EUR ').replace('  ', ' ');
}

interface SmePackageSimulatorProps {
  officialUrl: string;
  locale: Locale;
}

/**
 * Interactive SME Package funding estimator (client island).
 *
 * A slider and a number input (kept in sync) drive the pure computeSmePackage
 * math; the output updates live as the slider moves. The page's static copy is
 * SSR'd elsewhere, this is a tool layered on top: it degrades to nothing useful
 * without JS, which is fine for an interactive estimator. Motion here is a
 * width transition on a bar; reduced-motion users get the same numbers without
 * the animation (the global token kill-switch flattens the transition).
 */
export function SmePackageSimulator({ officialUrl, locale }: SmePackageSimulatorProps) {
  const t = getUiStrings(locale).sme.simulator;
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const sliderId = useId();
  const inputId = useId();

  const { eligible, grant, net, clamped } = computeSmePackage(budget);
  const grantPct = Math.round(SME_RATE * 100); // 70
  const netPct = 100 - grantPct; // 30

  // The slider is bounded to the eligible band; the number input accepts any
  // value (we clamp on commit) so a user can type 40000 and see the cap note.
  function commitInput(raw: string) {
    const parsed = Number(raw.replace(/[^\d.]/g, ''));
    if (!Number.isFinite(parsed)) return;
    setBudget(parsed);
  }

  const sliderValue = Math.min(SME_MAX, Math.max(SME_MIN, budget));

  return (
    <div
      data-sme-simulator
      className="rounded-2xl border border-hairline bg-surface p-6 md:p-8"
    >
      {/* Budget control: slider + number input, kept in sync. */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <label
            htmlFor={sliderId}
            className="font-mono text-xs uppercase tracking-[0.2em] text-text-dim"
          >
            {t.projectBudget}
          </label>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm text-text-dim">EUR</span>
            <input
              id={inputId}
              type="number"
              inputMode="numeric"
              min={SME_MIN}
              max={SME_MAX}
              step={STEP}
              value={budget}
              onChange={(e) => commitInput(e.target.value)}
              aria-label={t.budgetAria}
              className="ol-input w-28 px-3 py-2 text-right font-mono text-base"
            />
          </div>
        </div>

        <input
          id={sliderId}
          type="range"
          min={SME_MIN}
          max={SME_MAX}
          step={STEP}
          value={sliderValue}
          onChange={(e) => setBudget(Number(e.target.value))}
          aria-label={t.sliderAria}
          className="ol-range mt-2 w-full"
        />
        <div className="flex justify-between font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-text-dim">
          <span>{formatEur(SME_MIN)}</span>
          <span>{formatEur(SME_MAX)}</span>
        </div>
      </div>

      {/* Live output: three big Anton numbers. aria-live so the reading updates
          are announced as the slider moves. */}
      <dl
        aria-live="polite"
        className="mt-8 grid gap-6 sm:grid-cols-3"
      >
        <div>
          <dt className="font-mono text-xs uppercase tracking-[0.18em] text-text-dim">
            {t.projectBudget}
          </dt>
          <dd
            className="mt-1 font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {formatEur(eligible)}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-[0.18em] text-text-dim">
            {t.stateGrant} ({grantPct}%)
          </dt>
          <dd
            className="mt-1 font-display uppercase leading-[0.95] tracking-[-0.01em] text-accent"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {formatEur(grant)}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-[0.18em] text-text-dim">
            {t.yourNetCost}
          </dt>
          <dd
            className="mt-1 font-display uppercase leading-[0.95] tracking-[-0.01em] text-accent"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
          >
            {formatEur(net)}
          </dd>
        </div>
      </dl>

      {/* 70/30 split bar: lime grant vs hairline net. */}
      <div
        className="mt-7 flex h-3 w-full overflow-hidden rounded-full border border-hairline"
        role="img"
        aria-label={t.splitAriaTemplate
          .replace('{grant}', String(grantPct))
          .replace('{net}', String(netPct))}
      >
        <span
          className="block bg-accent transition-[width] duration-base ease-out"
          style={{ width: `${grantPct}%` }}
        />
        <span
          className="block bg-surface-2 transition-[width] duration-base ease-out"
          style={{ width: `${netPct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
        <span className="text-accent">{t.grantLabel} {grantPct}%</span>
        <span className="text-text-dim">{t.youLabel} {netPct}%</span>
      </div>

      {/* Clamp note, only when outside the band. */}
      {clamped && (
        <p className="mt-5 rounded-lg border border-hairline bg-surface-2 px-4 py-3 text-sm text-text-dim">
          {budget > SME_MAX ? t.capNote : t.minNote}
        </p>
      )}

      {/* Honest caveat, always visible. */}
      <p className="mt-5 text-sm text-text-dim">
        {t.caveat}{' '}
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ol-link text-text"
        >
          {t.officialDetails}
        </a>
        .
      </p>

      <div className="mt-7">
        <Link href={localeHref('/contact', locale)} className="ol-btn" data-cta>
          {getStartProject(locale)}
        </Link>
      </div>
    </div>
  );
}
