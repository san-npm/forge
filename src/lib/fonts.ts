import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

// Display — high-contrast grotesque with character (H1, large display type).
export const display = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Body — clean humanist/grotesque sans (running text, UI).
export const body = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

// Mono — kickers / metric labels / genuine technical accents, used sparingly.
export const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// Apply on <html> so all three CSS vars are available everywhere.
export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
