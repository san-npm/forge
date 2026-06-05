'use client';

import { AquaIcon } from './aquaIcons';
import type { IconKey } from './osData';

interface DesktopIconProps {
  label: string;
  icon: IconKey;
  x?: number;
  y?: number;
  right?: number;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export default function DesktopIcon({ label, icon, x, y, right, selected, onSelect, onOpen }: DesktopIconProps) {
  return (
    <div
      className="os-icon"
      data-selected={selected}
      style={right !== undefined ? { right, top: y } : { left: x, top: y }}
      role="button"
      tabIndex={0}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onDoubleClick={(e) => { e.stopPropagation(); onOpen(); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
    >
      <div className="os-icon-glyph"><AquaIcon name={icon} /></div>
      <span className="os-icon-label">{label}</span>
    </div>
  );
}
