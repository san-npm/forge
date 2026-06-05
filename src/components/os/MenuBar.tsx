'use client';

import { useEffect, useRef, useState } from 'react';
import { OpenletzLogo } from './icons';
import type { WindowId } from './osData';
import { LANGS, type Lang } from './osI18n';

const LANG_MENU = 99;

interface MenuItem { label: string; id?: WindowId; key?: string; disabled?: boolean; sep?: boolean; action?: 'appearance' }
interface Menu { label: string; apple?: boolean; appname?: boolean; items: MenuItem[] }

function useClock() {
  const [t, setT] = useState<string>('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      const h = d.getHours();
      const m = d.getMinutes().toString().padStart(2, '0');
      const ap = h < 12 ? 'AM' : 'PM';
      setT(`${day} ${(h % 12) || 12}:${m} ${ap}`);
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function MenuBar({ onOpen, appearance, onToggleAppearance, lang, onSelectLang }: {
  onOpen: (id: WindowId) => void;
  appearance: 'blue' | 'graphite';
  onToggleAppearance: () => void;
  lang: Lang;
  onSelectLang: (l: Lang) => void;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const clock = useClock();

  const menus: Menu[] = [
    { label: 'apple', apple: true, items: [
      { label: 'About this studio', id: 'about' },
      { sep: true, label: '' },
      { label: 'Read Me', id: 'welcome' },
      { sep: true, label: '' },
      { label: appearance === 'blue' ? 'Use Graphite appearance' : 'Use Blue appearance', action: 'appearance' },
    ] },
    { label: 'Openletz', appname: true, items: [
      { label: 'New Project', id: 'contact', key: '⌘N' },
      { label: 'Open Work', id: 'work', key: '⌘O' },
      { sep: true, label: '' },
      { label: 'Contact us', id: 'contact' },
    ] },
    { label: 'Services', items: [
      { label: 'Artificial Intelligence', id: 'ai' },
      { label: 'Web3 & On-Chain', id: 'web3' },
      { label: 'Digital & Growth', id: 'marketing' },
    ] },
    { label: 'Help', items: [
      { label: 'Read Me first', id: 'welcome' },
      { sep: true, label: '' },
      { label: 'Contact us', id: 'contact' },
    ] },
  ];

  useEffect(() => {
    if (open === null) return;
    const handler = (e: MouseEvent) => { if (!barRef.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  const pick = (item: MenuItem) => {
    setOpen(null);
    if (item.action === 'appearance') { onToggleAppearance(); return; }
    if (item.id && !item.disabled) onOpen(item.id);
  };

  return (
    <div className="os-menubar" ref={barRef}>
      {menus.map((menu, i) => (
        <div key={menu.label} style={{ position: 'relative', display: 'flex' }}>
          <div
            className={`os-menu-item${menu.apple ? ' os-menu-apple' : ''}${menu.appname ? ' os-menu-logo' : ''}`}
            data-open={open === i}
            data-hide-mobile={i >= 2 ? 'true' : undefined}
            onPointerDown={(e) => { e.stopPropagation(); setOpen(open === i ? null : i); }}
            onPointerEnter={() => open !== null && setOpen(i)}
          >
            {menu.apple ? <OpenletzLogo /> : menu.label}
          </div>
          {open === i && (
            <div className="os-dropdown" style={{ left: 0 }}>
              {menu.items.map((item, j) =>
                item.sep ? (
                  <div key={j} className="os-dropdown-sep" />
                ) : (
                  <div
                    key={j}
                    className="os-dropdown-row"
                    aria-disabled={item.disabled}
                    onPointerDown={(e) => { e.stopPropagation(); pick(item); }}
                  >
                    <span>{item.label}</span>
                    {item.key && <span className="os-dropdown-key">{item.key}</span>}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      ))}
      <div className="os-menu-spacer" />

      {/* language picker */}
      <div style={{ position: 'relative', display: 'flex' }}>
        <div
          className="os-menu-item"
          data-open={open === LANG_MENU}
          onPointerDown={(e) => { e.stopPropagation(); setOpen(open === LANG_MENU ? null : LANG_MENU); }}
          onPointerEnter={() => open !== null && setOpen(LANG_MENU)}
          aria-label="Language"
        >
          <span style={{ fontSize: 15, lineHeight: 1 }}>{LANGS.find((l) => l.code === lang)?.flag}</span>
        </div>
        {open === LANG_MENU && (
          <div className="os-dropdown" style={{ right: 0, left: 'auto' }}>
            {LANGS.map((l) => (
              <div
                key={l.code}
                className="os-dropdown-row"
                onPointerDown={(e) => { e.stopPropagation(); onSelectLang(l.code); setOpen(null); }}
              >
                <span>{l.flag}&nbsp; {l.label}</span>
                {l.code === lang && <span>✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="os-menu-clock">{clock}</div>
    </div>
  );
}
