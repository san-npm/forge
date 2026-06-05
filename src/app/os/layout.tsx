import type { Metadata } from 'next';
import { Lato, JetBrains_Mono } from 'next/font/google';
import './os.css';

// Lato = cross-platform fallback for Lucida Grande (native on macOS).
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--f-lato', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Openletz — AI & Web3 Studio · Luxembourg',
  description:
    'A Luxembourg AI & Web3 studio. We build websites that think, move and transact — AI automation, on-chain products and growth.',
  robots: { index: false, follow: false }, // prototype route — never index
};

export default function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
