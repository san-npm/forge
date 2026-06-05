'use client';

import { useRef } from 'react';
import { AquaIcon, AquaTrash } from './aquaIcons';
import { APPS, type WindowId } from './osData';

const MAX_SCALE = 1.7;
const RADIUS = 92;

export default function Dock({ onOpen, openIds }: { onOpen: (id: WindowId) => void; openIds: WindowId[] }) {
  const items = useRef<(HTMLDivElement | null)[]>([]);

  const magnify = (clientX: number) => {
    items.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const d = Math.abs(clientX - center);
      const s = d < RADIUS ? 1 + (MAX_SCALE - 1) * (1 - d / RADIUS) : 1;
      el.style.transform = `scale(${s.toFixed(3)})`;
    });
  };
  const reset = () => items.current.forEach((el) => { if (el) el.style.transform = 'scale(1)'; });

  return (
    <div className="os-dock-wrap">
      <div
        className="os-dock"
        onMouseMove={(e) => magnify(e.clientX)}
        onMouseLeave={reset}
      >
        {APPS.map((app, i) => (
          <div
            key={app.id}
            ref={(el) => { items.current[i] = el; }}
            className="os-dock-item"
            onClick={() => onOpen(app.id)}
            role="button"
            aria-label={app.label}
          >
            <span className="os-dock-tip">{app.label}</span>
            <div className="os-dock-tile"><AquaIcon name={app.icon} /></div>
            {openIds.includes(app.id) && <span className="os-dock-run" />}
          </div>
        ))}

        <div className="os-dock-sep" />

        <div
          className="os-dock-item"
          data-variant="trash"
          ref={(el) => { items.current[APPS.length] = el; }}
          role="button"
          aria-label="Trash"
        >
          <span className="os-dock-tip">Trash</span>
          <div className="os-dock-tile"><AquaTrash /></div>
        </div>
      </div>
    </div>
  );
}
