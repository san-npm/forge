// Openletz OS — colourful, glossy "Aqua"-style icons (Mac OS X 10.x lineage).
// Smooth gradients, a top-down light source, glossy highlights, soft depth.
// Each icon owns namespaced gradient ids; duplicate instances are harmless
// (identical defs), so no runtime unique-id is needed.
import type { IconKey } from './osData';

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" shapeRendering="geometricPrecision" aria-hidden>
      {children}
    </svg>
  );
}

/* Finder-style two-tone face */
function MacFace() {
  return (
    <Frame>
      <defs>
        <linearGradient id="fdL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a6dbff" /><stop offset="1" stopColor="#3a8fe0" /></linearGradient>
        <linearGradient id="fdR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f7fd6" /><stop offset="1" stopColor="#16448f" /></linearGradient>
        <clipPath id="fdClip"><rect x="5" y="5" width="38" height="38" rx="10" /></clipPath>
      </defs>
      <g clipPath="url(#fdClip)">
        <rect x="5" y="5" width="38" height="38" fill="url(#fdR)" />
        <path d="M5 5 H31 L15 43 H5 Z" fill="url(#fdL)" />
        <rect x="6" y="6" width="36" height="15" rx="8" fill="#ffffff" opacity="0.22" />
        <rect x="17" y="16" width="3.4" height="6" rx="1" fill="#0d2c5c" />
        <circle cx="31" cy="18.5" r="2.1" fill="#d6ebff" />
        <path d="M14 30 q9 7 20 1" fill="none" stroke="#0d2c5c" strokeWidth="2" strokeLinecap="round" />
      </g>
      <rect x="5" y="5" width="38" height="38" rx="10" fill="none" stroke="#103a7d" strokeWidth="1" />
    </Frame>
  );
}

/* glossy AI orb + sparkle */
function AIOrb() {
  return (
    <Frame>
      <defs>
        <radialGradient id="aiS" cx="36%" cy="30%" r="78%"><stop offset="0" stopColor="#efe0ff" /><stop offset="0.34" stopColor="#a36cf2" /><stop offset="1" stopColor="#561fb0" /></radialGradient>
      </defs>
      <ellipse cx="24" cy="42" rx="12" ry="2.6" fill="#000" opacity="0.16" />
      <circle cx="24" cy="25" r="17" fill="url(#aiS)" stroke="#46169a" strokeWidth="0.6" />
      <ellipse cx="18.5" cy="17" rx="9" ry="5" fill="#ffffff" opacity="0.5" />
      <path d="M34 8 l1.7 4.2 l4.2 1.7 l-4.2 1.7 l-1.7 4.2 l-1.7-4.2 l-4.2-1.7 l4.2-1.7 Z" fill="#ffffff" />
      <circle cx="13" cy="34" r="1.6" fill="#ffffff" opacity="0.92" />
    </Frame>
  );
}

/* isometric glass cube */
function Cube() {
  return (
    <Frame>
      <defs>
        <linearGradient id="cbT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c7ecff" /><stop offset="1" stopColor="#74c4f2" /></linearGradient>
        <linearGradient id="cbL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4aa3e8" /><stop offset="1" stopColor="#2766c2" /></linearGradient>
        <linearGradient id="cbR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f8bd6" /><stop offset="1" stopColor="#1a4f9e" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="13" ry="2.4" fill="#000" opacity="0.15" />
      <path d="M24 7 L40 15.5 L24 24 L8 15.5 Z" fill="url(#cbT)" stroke="#1c4f96" strokeWidth="0.5" />
      <path d="M8 15.5 L24 24 L24 42 L8 33.5 Z" fill="url(#cbL)" stroke="#1c4f96" strokeWidth="0.5" />
      <path d="M40 15.5 L24 24 L24 42 L40 33.5 Z" fill="url(#cbR)" stroke="#1c4f96" strokeWidth="0.5" />
      <path d="M24 8.5 L37.5 15.6 L24 22.6 L10.5 15.6 Z" fill="#ffffff" opacity="0.28" />
    </Frame>
  );
}

/* glossy green growth bars + arrow */
function Growth() {
  return (
    <Frame>
      <defs>
        <linearGradient id="grB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c4f7a6" /><stop offset="1" stopColor="#34a836" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="14" ry="2.2" fill="#000" opacity="0.14" />
      {[[8, 28, 11], [19, 22, 17], [30, 14, 25]].map(([x, y, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width="9" height={h} rx="2" fill="url(#grB)" stroke="#2c8f2e" strokeWidth="0.5" />
          <rect x={x + 1.5} y={y + 1.5} width="2.5" height={h - 4} rx="1.2" fill="#ffffff" opacity="0.45" />
        </g>
      ))}
      <path d="M9 24 L20 17 L27 21 L41 9" fill="none" stroke="#f4a51f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 8 L42 7.5 L41.5 14.5 Z" fill="#f4a51f" />
    </Frame>
  );
}

/* classic Aqua blue folder */
function Folder() {
  return (
    <Frame>
      <defs>
        <linearGradient id="flB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c4e4ff" /><stop offset="1" stopColor="#6aa8e8" /></linearGradient>
        <linearGradient id="flF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dcefff" /><stop offset="0.5" stopColor="#9ccaf4" /><stop offset="1" stopColor="#4f8cda" /></linearGradient>
        <linearGradient id="flG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0.75" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="42" rx="18" ry="2.4" fill="#000" opacity="0.15" />
      <path d="M6 17 c0-1.4 1-2.4 2.4-2.4 h9 l3 3 h19.2 c1.4 0 2.4 1 2.4 2.4 v15 c0 1.4-1 2.4-2.4 2.4 H8.4 C7 39.8 6 38.8 6 37.4 Z" fill="url(#flB)" stroke="#3f78bf" strokeWidth="0.5" />
      <path d="M6 21 h36 v14.4 c0 1.4-1 2.4-2.4 2.4 H8.4 C7 37.8 6 36.8 6 35.4 Z" fill="url(#flF)" stroke="#3a72bf" strokeWidth="0.6" />
      <path d="M7.5 22 h33 v4.6 c-11 3-22 3-33 0 Z" fill="url(#flG)" />
    </Frame>
  );
}

/* glossy contact card (About) */
function Card() {
  return (
    <Frame>
      <defs>
        <linearGradient id="cdB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#dde6f2" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="42" rx="16" ry="2.2" fill="#000" opacity="0.13" />
      <rect x="7" y="9" width="34" height="30" rx="4" fill="url(#cdB)" stroke="#b6c0d2" strokeWidth="0.7" />
      <rect x="8.5" y="10.5" width="31" height="9" rx="3" fill="#ffffff" opacity="0.55" />
      <circle cx="17" cy="20" r="4.2" fill="#5a8fd8" />
      <path d="M10.5 32 q0-6.5 6.5-6.5 q6.5 0 6.5 6.5 Z" fill="#5a8fd8" />
      <rect x="27" y="17" width="11" height="2.2" rx="1" fill="#8aa0c2" />
      <rect x="27" y="22" width="11" height="2.2" rx="1" fill="#c3cee1" />
      <rect x="27" y="27" width="8.5" height="2.2" rx="1" fill="#c3cee1" />
    </Frame>
  );
}

/* glossy envelope (New Project / contact) */
function Mail() {
  return (
    <Frame>
      <defs>
        <linearGradient id="mlB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffdf6" /><stop offset="1" stopColor="#eae3cd" /></linearGradient>
        <linearGradient id="mlF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#aecdf3" /><stop offset="1" stopColor="#5e93dc" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="42" rx="17" ry="2.2" fill="#000" opacity="0.13" />
      <rect x="6" y="13" width="36" height="24" rx="3.5" fill="url(#mlB)" stroke="#c9bf9c" strokeWidth="0.7" />
      <path d="M6.6 14.5 L24 28 L41.4 14.5" fill="none" stroke="#bcb38f" strokeWidth="0.8" />
      <path d="M6 14 L24 27.4 L42 14 L42 16.4 L24 29.8 L6 16.4 Z" fill="url(#mlF)" />
      <rect x="7.5" y="15" width="33" height="4" rx="2" fill="#ffffff" opacity="0.4" />
    </Frame>
  );
}

/* silver hard drive */
function Drive() {
  return (
    <Frame>
      <defs>
        <linearGradient id="dvB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fdfdff" /><stop offset="0.5" stopColor="#d9dde3" /><stop offset="1" stopColor="#a7adb7" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="40" rx="17" ry="2.4" fill="#000" opacity="0.16" />
      <rect x="6" y="14" width="36" height="20" rx="4" fill="url(#dvB)" stroke="#8d93a0" strokeWidth="0.7" />
      <rect x="7.5" y="15.5" width="33" height="7" rx="3" fill="#ffffff" opacity="0.55" />
      <rect x="10" y="26" width="15" height="4" rx="2" fill="#5a8fd8" />
      <circle cx="36" cy="24" r="2" fill="#7d838e" />
    </Frame>
  );
}

/* document with folded corner (Read Me file) */
function Doc() {
  return (
    <Frame>
      <defs>
        <linearGradient id="dcB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#eef1f6" /></linearGradient>
      </defs>
      <ellipse cx="25" cy="43" rx="13" ry="2" fill="#000" opacity="0.12" />
      <path d="M12 5 H30 L38 13 V41 c0 1-0.8 1.8-1.8 1.8 H13.8 C12.8 42.8 12 42 12 41 Z" fill="url(#dcB)" stroke="#b6c0d2" strokeWidth="0.7" />
      <path d="M30 5 L38 13 H31 c-0.6 0-1-0.4-1-1 Z" fill="#d6dded" />
      <rect x="16" y="12" width="10" height="3" rx="1" fill="#5a8fd8" />
      <rect x="16" y="19" width="18" height="2" rx="1" fill="#c4cee1" />
      <rect x="16" y="24" width="18" height="2" rx="1" fill="#c4cee1" />
      <rect x="16" y="29" width="12" height="2" rx="1" fill="#c4cee1" />
    </Frame>
  );
}

/* glossy floppy disk (save / new project alt) */
function Disk() {
  return (
    <Frame>
      <defs>
        <linearGradient id="dkB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fc0f2" /><stop offset="1" stopColor="#356bc4" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="42" rx="15" ry="2.2" fill="#000" opacity="0.14" />
      <path d="M9 7 H32 L40 15 V39 c0 1-0.8 1.8-1.8 1.8 H10.8 C9.8 40.8 9 40 9 39 Z" fill="url(#dkB)" stroke="#214f97" strokeWidth="0.7" />
      <rect x="15" y="7" width="14" height="9" rx="1" fill="#dfeeff" />
      <rect x="23" y="9" width="3" height="5" rx="1" fill="#3f6cb8" />
      <rect x="13" y="22" width="22" height="13" rx="1.5" fill="#eaf3ff" stroke="#5781c0" strokeWidth="0.5" />
      <rect x="15" y="25" width="14" height="2" rx="1" fill="#9bb7e0" />
    </Frame>
  );
}

/* metal wire trash */
export function AquaTrash() {
  return (
    <Frame>
      <defs>
        <linearGradient id="trB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f1f3f7" /><stop offset="1" stopColor="#b4bbc6" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="13" ry="2" fill="#000" opacity="0.14" />
      <path d="M13 16 H35 L32.4 39.5 c-0.1 1.3-1.2 2.3-2.5 2.3 H18.1 c-1.3 0-2.4-1-2.5-2.3 Z" fill="url(#trB)" stroke="#8a92a0" strokeWidth="0.7" />
      <path d="M19 19 L20 39 M24 19 L24 40 M29 19 L28 39" fill="none" stroke="#9aa2b0" strokeWidth="1" opacity="0.8" />
      <rect x="10" y="12.5" width="28" height="4.5" rx="2.2" fill="url(#trB)" stroke="#8a92a0" strokeWidth="0.7" />
      <rect x="11" y="13.5" width="26" height="1.6" rx="0.8" fill="#ffffff" opacity="0.6" />
    </Frame>
  );
}

/* glossy price tag */
function PriceTag() {
  return (
    <Frame>
      <defs>
        <linearGradient id="ptB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a7e3a0" /><stop offset="1" stopColor="#2f9c46" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="42" rx="15" ry="2.2" fill="#000" opacity="0.14" />
      <path d="M6 22 L22 6 c1-1 2.6-1 3.6 0 L42 22.4 c1 1 1 2.6 0 3.6 L26 42 c-1 1-2.6 1-3.6 0 L6 25.6 c-1-1-1-2.6 0-3.6 Z" fill="url(#ptB)" stroke="#1f7a33" strokeWidth="0.6" />
      <path d="M8 23 L23 8 c0.6-0.6 1.6-0.6 2.2 0 L40 22.6 c-9-2-22-1.5-32 0.4 Z" fill="#ffffff" opacity="0.32" />
      <circle cx="16.5" cy="16.5" r="3.4" fill="#eafff0" stroke="#1f7a33" strokeWidth="0.7" />
      <text x="29" y="32" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontSize="13" fill="#ffffff" textAnchor="middle">€</text>
    </Frame>
  );
}

/* compliance shield + check */
function Shield() {
  return (
    <Frame>
      <defs>
        <linearGradient id="shB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9d4ff" /><stop offset="1" stopColor="#3f7bd0" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="12" ry="2" fill="#000" opacity="0.14" />
      <path d="M24 5 C18 9 12 10 9 10 v13 c0 9 6 14 15 18 c9-4 15-9 15-18 V10 c-3 0-9-1-15-5 Z" fill="url(#shB)" stroke="#27599f" strokeWidth="0.6" />
      <path d="M24 6.5 C19 9.6 13.5 10.8 10.5 11 v6 c8-1.5 19-1.5 27 0 V11 C34.5 10.8 29 9.6 24 6.5 Z" fill="#ffffff" opacity="0.3" />
      <path d="M16 24 L22 30 L33 17" fill="none" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

/* glossy newspaper (insights) */
function News() {
  return (
    <Frame>
      <defs>
        <linearGradient id="nwB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e7ebf2" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="16" ry="2" fill="#000" opacity="0.13" />
      <path d="M9 9 H39 V37 c0 1.6-1.3 2.9-2.9 2.9 H11.9 C10.3 39.9 9 38.6 9 37 Z" fill="url(#nwB)" stroke="#b6c0d2" strokeWidth="0.7" />
      <rect x="12" y="12" width="24" height="2.6" rx="1" fill="#3f6cb8" />
      <rect x="12" y="18" width="11" height="9" rx="1.5" fill="#cdd8ea" />
      <rect x="25" y="18" width="11" height="2" rx="1" fill="#c4cee1" />
      <rect x="25" y="22" width="11" height="2" rx="1" fill="#d6deec" />
      <rect x="25" y="26" width="8" height="2" rx="1" fill="#d6deec" />
      <rect x="12" y="31" width="24" height="2" rx="1" fill="#d6deec" />
    </Frame>
  );
}

/* paint palette (Sketch) */
function Palette() {
  return (
    <Frame>
      <defs>
        <radialGradient id="plB" cx="40%" cy="32%" r="75%"><stop offset="0" stopColor="#fffdf6" /><stop offset="1" stopColor="#e3ddcb" /></radialGradient>
      </defs>
      <ellipse cx="24" cy="42" rx="16" ry="2.2" fill="#000" opacity="0.13" />
      <path d="M24 7 C13 7 5 14 5 23 c0 7 6 11 11 11 c3 0 3-2 3-3.5 c0-2 1.5-3.5 4-3.5 c5 0 11-3 11-9 C38 11 32 7 24 7 Z" fill="url(#plB)" stroke="#bdb59a" strokeWidth="0.7" />
      <ellipse cx="16" cy="29" rx="2.4" ry="2.4" fill="#e0463c" />
      <ellipse cx="13" cy="20" rx="2.4" ry="2.4" fill="#f4b333" />
      <ellipse cx="20" cy="14" rx="2.4" ry="2.4" fill="#3fa648" />
      <ellipse cx="29" cy="15" rx="2.4" ry="2.4" fill="#3f7bd0" />
      <ellipse cx="33" cy="23" rx="2.4" ry="2.4" fill="#9b59c8" />
      <circle cx="25" cy="27" r="3.2" fill="#fff" stroke="#bdb59a" strokeWidth="0.6" />
      {/* brush */}
      <rect x="30" y="30" width="12" height="3.2" rx="1.6" transform="rotate(38 30 30)" fill="#8a5a2b" />
      <path d="M40 38 l4 4 l-1.5 1.5 l-4-4 Z" fill="#c2c6cd" />
    </Frame>
  );
}

/* green snake (Snake game) */
function Snake() {
  return (
    <Frame>
      <defs>
        <linearGradient id="snB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bdf59a" /><stop offset="1" stopColor="#34a836" /></linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="14" ry="2" fill="#000" opacity="0.13" />
      <path d="M10 34 C10 26 20 28 20 21 C20 14 30 14 30 21 C30 26 38 25 38 18"
            fill="none" stroke="url(#snB)" strokeWidth="7" strokeLinecap="round" />
      <path d="M10 34 C10 26 20 28 20 21 C20 14 30 14 30 21 C30 26 38 25 38 18"
            fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <circle cx="38" cy="18" r="4.4" fill="url(#snB)" stroke="#2c8f2e" strokeWidth="0.6" />
      <circle cx="39.4" cy="16.8" r="1.1" fill="#10330f" />
      <circle cx="11" cy="36" r="2.2" fill="#e0463c" />
    </Frame>
  );
}

const AQUA: Record<IconKey, () => React.JSX.Element> = {
  mac: MacFace,
  ai: AIOrb,
  web3: Cube,
  growth: Growth,
  folder: Folder,
  about: Card,
  mail: Mail,
  doc: Doc,
  drive: Drive,
  disk: Disk,
  price: PriceTag,
  tools: Shield,
  insights: News,
  sketch: Palette,
  snake: Snake,
};

export function AquaIcon({ name }: { name: IconKey }) {
  const C = AQUA[name] ?? Folder;
  return <C />;
}
