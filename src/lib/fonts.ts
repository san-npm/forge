import { Anton, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';

// Display — ultra-bold condensed poster face for GIANT kinetic headlines, big
// numbers, section labels and work names. ALL-CAPS-friendly; display-only.
export const display = Anton({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
});

// Body — characterful modern grotesque (running text, UI, sub/lead copy).
export const body = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

// Mono — kickers / labels / marquee / metric tags, used as a technical accent.
export const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// Apply on <html> so all three CSS vars are available everywhere.
export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
