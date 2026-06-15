'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '@/lib/site-config';
import { getUiStrings } from '@/data/ui';
import { Link, usePathname } from '@/i18n/routing';

const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
];

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  );
}

/**
 * Compact pill that opens a dark menu of EN / FR / DE. Each option is a
 * next-intl <Link> to the SAME path in the chosen locale (usePathname returns
 * the locale-stripped pathname, the Link's `locale` prop re-prefixes it), so
 * switching language keeps the visitor on the current page. Keyboard accessible
 * (Esc closes), closes on outside click, marks the active locale in lime.
 */
export function LanguageDropdown({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  const changeLanguage = getUiStrings(locale).nav.changeLanguage;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={changeLanguage}
        data-cursor
        className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-sm text-text-dim transition-colors duration-base ease-out hover:border-accent hover:text-text"
      >
        <GlobeIcon />
        <span className="font-mono tracking-wider">{current.short}</span>
        <span aria-hidden="true" className="text-[0.6rem] leading-none">
          ▾
        </span>
      </button>

      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label="Language"
          className="absolute right-0 z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-hairline bg-surface py-1 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        >
          {LOCALES.map((l) => {
            const active = l.code === locale;
            return (
              <li key={l.code} role="none">
                <Link
                  href={pathname}
                  locale={l.code}
                  role="menuitem"
                  aria-current={active ? 'true' : undefined}
                  data-active={active}
                  onClick={() => setOpen(false)}
                  className={[
                    'flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors duration-base ease-out',
                    active ? 'text-accent' : 'text-text-dim hover:bg-surface-2 hover:text-text',
                  ].join(' ')}
                >
                  <span>{l.label}</span>
                  <span className="font-mono text-xs tracking-wider">{l.short}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
