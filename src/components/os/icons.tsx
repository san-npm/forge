// Openletz OS — hand-drawn monochrome icons (no external assets / licensing).
// All use currentColor so they invert cleanly on selection.
import type { IconKey } from './osData';

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
};

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" shapeRendering="crispEdges" aria-hidden>
      {children}
    </svg>
  );
}

export function MacIcon() {
  return (
    <Svg>
      <rect x="5" y="3" width="22" height="26" {...S} />
      <rect x="8" y="6" width="16" height="12" {...S} />
      <rect x="9" y="22" width="9" height="3" {...S} />
      <circle cx="22" cy="23.5" r="1.4" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function HappyMacIcon() {
  return (
    <Svg>
      <rect x="5" y="3" width="22" height="26" {...S} />
      <rect x="8" y="6" width="16" height="12" {...S} />
      {/* smiley */}
      <rect x="12" y="9" width="2" height="2" fill="currentColor" stroke="none" />
      <rect x="18" y="9" width="2" height="2" fill="currentColor" stroke="none" />
      <path d="M12 13 q4 4 8 0" {...S} fill="none" />
      <rect x="9" y="22" width="9" height="3" {...S} />
      <circle cx="22" cy="23.5" r="1.4" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function AIIcon() {
  return (
    <Svg>
      <path d="M16 3 L19 13 L29 16 L19 19 L16 29 L13 19 L3 16 L13 13 Z" {...S} fill="none" />
      <path d="M25 4 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2-3 l-3-1.2 l3-1.2 Z" fill="currentColor" stroke="none" />
      <circle cx="7" cy="25" r="1.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function Web3Icon() {
  return (
    <Svg>
      <path d="M16 3 L28 10 L28 22 L16 29 L4 22 L4 10 Z" {...S} />
      <path d="M16 3 L16 16 M16 16 L28 10 M16 16 L4 10" {...S} />
    </Svg>
  );
}

export function GrowthIcon() {
  return (
    <Svg>
      <rect x="4" y="20" width="5" height="8" {...S} />
      <rect x="13" y="14" width="5" height="14" {...S} />
      <rect x="22" y="7" width="5" height="21" {...S} />
      <path d="M4 12 L12 8 L18 11 L28 4" {...S} fill="none" />
      <path d="M23 4 L28 4 L28 9" {...S} fill="none" />
    </Svg>
  );
}

export function FolderIcon() {
  return (
    <Svg>
      <path d="M3 8 L13 8 L16 11 L29 11 L29 26 L3 26 Z" {...S} />
      <path d="M3 14 L29 14" {...S} />
    </Svg>
  );
}

export function AboutIcon() {
  return (
    <Svg>
      <circle cx="16" cy="11" r="5" {...S} />
      <path d="M6 28 q0 -8 10 -8 q10 0 10 8" {...S} fill="none" />
    </Svg>
  );
}

export function MailIcon() {
  return (
    <Svg>
      <rect x="3" y="7" width="26" height="18" {...S} />
      <path d="M3 8 L16 18 L29 8" {...S} fill="none" />
    </Svg>
  );
}

export function DocIcon() {
  return (
    <Svg>
      <path d="M7 3 L20 3 L25 8 L25 29 L7 29 Z" {...S} />
      <path d="M20 3 L20 8 L25 8" {...S} />
      <path d="M11 14 L21 14 M11 18 L21 18 M11 22 L18 22" {...S} />
    </Svg>
  );
}

export function DriveIcon() {
  return (
    <Svg>
      <rect x="3" y="10" width="26" height="13" {...S} />
      <rect x="7" y="14" width="11" height="2" fill="currentColor" stroke="none" />
      <circle cx="24" cy="16.5" r="1.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function DiskIcon() {
  return (
    <Svg>
      <path d="M4 4 L24 4 L28 8 L28 28 L4 28 Z" {...S} />
      <rect x="9" y="4" width="10" height="8" {...S} />
      <rect x="15" y="6" width="2" height="4" fill="currentColor" stroke="none" />
      <rect x="8" y="17" width="16" height="9" {...S} />
    </Svg>
  );
}

export function AppleIcon() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden>
      <path
        fill="currentColor"
        d="M21.7 17c0-3 2.4-4.4 2.5-4.5-1.4-2-3.5-2.3-4.2-2.3-1.8-.2-3.5 1-4.4 1-.9 0-2.3-1-3.8-1-1.9 0-3.7 1.1-4.7 2.9-2 3.5-.5 8.7 1.4 11.5.9 1.4 2 2.9 3.5 2.9 1.4-.1 1.9-.9 3.6-.9 1.6 0 2.1.9 3.6.9 1.5 0 2.4-1.4 3.3-2.8.7-1 1-1.5 1.6-2.7-3.9-1.6-3.9-5-3.4-5z"
      />
      <path fill="currentColor" d="M18.9 8.3c.8-1 1.3-2.3 1.2-3.6-1.1.05-2.5.75-3.3 1.7-.7.8-1.4 2.2-1.2 3.4 1.3.1 2.5-.6 3.3-1.5z" />
    </svg>
  );
}

export function OpenletzLogo() {
  return (
    <svg viewBox="0 0 69 69" width="100%" height="100%" fill="currentColor" aria-hidden>
      <path d="M20.8516 0.597656L26.852 6.29803C29.1021 8.39817 30.3022 11.2484 30.3022 14.3986C30.3022 17.3988 31.5023 20.249 33.6024 22.3491L34.3525 23.0992L41.253 0.747653" />
      <path d="M0.445312 20.551L8.69587 20.251C11.6961 20.101 14.6963 21.3011 16.7964 23.4012C18.8966 25.5013 21.7468 26.5514 24.747 26.5514H25.797L14.6963 6" />
      <path d="M0.450035 49.0522L6.00041 43.0518C8.10055 40.8016 10.9507 39.4515 13.951 39.4515C16.9512 39.4515 19.6513 38.1014 21.7515 36.0013L22.5015 35.2512L0 28.8008" />
      <path d="M20.851 68.8533L20.401 60.6027C20.251 57.6025 21.3011 54.6023 23.4012 52.3522C25.3513 50.252 26.5514 47.2518 26.4014 44.4016V43.3516L6 54.9023" />
      <path d="M49.3529 68.253L43.2025 62.8527C40.9524 60.9026 39.6023 58.0524 39.4523 54.9021C39.3023 51.9019 37.9522 49.2018 35.852 47.1016L35.102 46.3516L29.1016 69.0031" />
      <path d="M68.847 47.4036L60.5965 48.0036C57.5963 48.3036 54.5961 47.2536 52.3459 45.1534C50.0958 43.2033 47.2456 42.1532 44.2454 42.3032H43.1953L55.1961 62.4046" />
      <path d="M67.4968 19.0508L62.2464 25.3512C60.2963 27.6014 57.4461 29.1015 54.4459 29.2515C51.4457 29.4015 48.7455 30.7516 46.7953 33.0017L46.1953 33.7518L68.9969 39.1522" />
      <path d="M46.3539 0L47.1039 8.25056C47.4039 11.2508 46.5039 14.251 44.4038 16.6511C42.4536 18.9013 41.5536 21.7515 41.7036 24.7517L41.8536 25.8018L61.6549 13.3509" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" shapeRendering="crispEdges" aria-hidden>
      <path d="M7 9 L25 9 L23 28 L9 28 Z" {...S} />
      <path d="M11 9 L11 6 L21 6 L21 9" {...S} />
      <path d="M13 13 L13 24 M16 13 L16 24 M19 13 L19 24" {...S} />
    </svg>
  );
}

export function Spinner() {
  const bars = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden style={{ animation: 'spin 1s steps(12) infinite' }}>
      {bars.map((_, i) => (
        <rect
          key={i}
          x="15" y="2" width="2" height="8" rx="1"
          fill="currentColor"
          opacity={0.25 + (i / 12) * 0.75}
          transform={`rotate(${i * 30} 16 16)`}
        />
      ))}
    </svg>
  );
}

const MAP: Partial<Record<IconKey, () => React.JSX.Element>> = {
  mac: MacIcon,
  ai: AIIcon,
  web3: Web3Icon,
  growth: GrowthIcon,
  folder: FolderIcon,
  about: AboutIcon,
  mail: MailIcon,
  doc: DocIcon,
  drive: DriveIcon,
  disk: DiskIcon,
};

export function Icon({ name }: { name: IconKey }) {
  const C = MAP[name] ?? MacIcon;
  return <C />;
}
