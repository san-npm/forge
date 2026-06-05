'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import MenuBar from './MenuBar';
import DesktopIcon from './DesktopIcon';
import MacWindow from './MacWindow';
import Dock from './Dock';
import { WindowBody } from './windows';
import { AppleIcon, Spinner } from './icons';
import { APPS, STUDIO, type WindowId } from './osData';
import type { Lang } from './osI18n';

gsap.registerPlugin(useGSAP);

interface OpenWin { id: WindowId; z: number }

/* ---------------- Aqua boot ---------------- */
function Boot({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const finish = useCallback(() => { if (!done.current) { done.current = true; onDone(); } }, [onDone]);

  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: finish });
    tl.from('.os-boot-apple', { autoAlpha: 0, scale: 0.82, duration: 0.5, ease: 'power2.out' })
      .from('.os-boot-title', { autoAlpha: 0, y: 6, duration: 0.4 }, '-=0.2')
      .to({}, { duration: 0.9 })
      .to(ref.current, { autoAlpha: 0, duration: 0.35 });
  }, { scope: ref });

  return (
    <div className="os-boot" ref={ref} onClick={finish}>
      <div className="os-boot-inner">
        <div className="os-boot-apple"><AppleIcon /></div>
        <div className="os-spinner"><Spinner /></div>
        <div className="os-boot-title">Welcome to {STUDIO.name}</div>
        <div className="os-boot-skip">click to skip</div>
      </div>
    </div>
  );
}

/* ---------------- the OS ---------------- */
export default function OpenletzOS() {
  const [booted, setBooted] = useState(false);
  const [intro, setIntro] = useState(true);
  const [appearance, setAppearance] = useState<'blue' | 'graphite'>('blue');
  const [lang, setLang] = useState<Lang>('en');
  const [wins, setWins] = useState<OpenWin[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const zCounter = useRef(10);
  const deskRef = useRef<HTMLDivElement>(null);

  const focus = useCallback((id: WindowId) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWins((prev) => prev.map((w) => (w.id === id ? { ...w, z } : w)));
  }, []);

  const open = useCallback((id: WindowId) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWins((prev) => (prev.some((w) => w.id === id)
      ? prev.map((w) => (w.id === id ? { ...w, z } : w))
      : [...prev, { id, z }]));
  }, []);

  const close = useCallback((id: WindowId) => {
    setWins((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const handleBootDone = useCallback(() => {
    setBooted(true);
    zCounter.current += 1;
    setWins([{ id: 'welcome', z: zCounter.current }]);
    try { sessionStorage.setItem('openletz-os-booted', '1'); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const noboot = params.has('noboot');
    const langParam = params.get('lang');
    if (langParam && ['en', 'fr', 'de', 'lb'].includes(langParam)) setLang(langParam as Lang);
    let seen = false;
    try { seen = sessionStorage.getItem('openletz-os-booted') === '1'; } catch { /* ignore */ }
    if (reduce || seen || noboot) { setIntro(false); handleBootDone(); }
  }, [handleBootDone]);

  // deep-link: /?open=<app> opens that window once booted
  useEffect(() => {
    if (!booted) return;
    const id = new URLSearchParams(window.location.search).get('open');
    if (id && APPS.some((a) => a.id === id)) open(id as WindowId);
  }, [booted, open]);

  const toggleAppearance = useCallback(() => setAppearance((a) => (a === 'blue' ? 'graphite' : 'blue')), []);

  // reveal desktop furniture + dock once booted (skipped when intro is off)
  useGSAP(() => {
    if (!booted || !intro) return;
    gsap.from('.os-icon', { autoAlpha: 0, x: 10, duration: 0.4, stagger: 0.08, ease: 'power2.out' });
    gsap.from('.os-dock', { autoAlpha: 0, y: 90, duration: 0.5, ease: 'back.out(1.4)', delay: 0.1 });
  }, { dependencies: [booted, intro], scope: deskRef });

  const topId = wins.reduce<OpenWin | null>((a, b) => (!a || b.z > a.z ? b : a), null)?.id ?? null;
  const openIds = wins.map((w) => w.id);

  return (
    <div className="os-root" data-appearance={appearance}>
      {!booted && <Boot onDone={handleBootDone} />}

      <MenuBar onOpen={open} appearance={appearance} onToggleAppearance={toggleAppearance} lang={lang} onSelectLang={setLang} />

      <div className="os-desktop" ref={deskRef} onPointerDown={() => setSelected(null)}>
        {/* desktop drives / files, top-right */}
        <DesktopIcon
          label="Macintosh HD" icon="drive" right={28} y={20}
          selected={selected === 'hd'} onSelect={() => setSelected('hd')} onOpen={() => open('work')}
        />
        <DesktopIcon
          label="Read Me" icon="doc" right={28} y={126}
          selected={selected === 'readme'} onSelect={() => setSelected('readme')} onOpen={() => open('welcome')}
        />
        {APPS.filter((a) => a.desktopOnly).map((app, i) => (
          <DesktopIcon
            key={app.id} label={app.label} icon={app.icon} right={28} y={216 + i * 96}
            selected={selected === app.id} onSelect={() => setSelected(app.id)} onOpen={() => open(app.id)}
          />
        ))}

        {booted && wins.map((w) => {
          const app = APPS.find((a) => a.id === w.id)!;
          return (
            <MacWindow
              key={w.id}
              title={app.label}
              z={w.z}
              active={topId === w.id}
              x={app.win.x}
              y={app.win.y}
              w={app.win.w}
              h={app.win.h}
              onClose={() => close(w.id)}
              onFocus={() => focus(w.id)}
            >
              <WindowBody id={w.id} onOpen={open} lang={lang} />
            </MacWindow>
          );
        })}

        {booted && <Dock onOpen={open} openIds={openIds} />}
      </div>
    </div>
  );
}
