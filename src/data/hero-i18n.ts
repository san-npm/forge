import type { Locale } from '@/lib/site-config';
import { HeroI18nSchema, type Hero } from '@/lib/schema';
import { getStudio } from '@/data/studio';

export type { Hero };

// HERO sources its translated identity from the locale-keyed studio module
// (getStudio) so there is ONE source of truth: tagline, sub, welcomeLead and
// hint always equal the studio copy the Bold Kinetic hero renders, in every
// locale. Only the CTA labels are hero-local. The old per-locale literals (and
// the killed Aqua-OS-shell "double-click an icon / New Project" lines) are gone.
// The LB entry has been DROPPED (locale set is en/fr/de).
const EN = getStudio('en');
const FR = getStudio('fr');
const DE = getStudio('de');

export const HERO: Record<Locale, Hero> = HeroI18nSchema.parse({
  en: {
    tagline: EN.tagline,
    sub: EN.sub,
    welcomeLead: EN.welcomeLead,
    hint: EN.hint,
    newProject: 'Start a project',
    seeWork: 'See our work',
  },
  fr: {
    tagline: FR.tagline,
    sub: FR.sub,
    welcomeLead: FR.welcomeLead,
    hint: FR.hint,
    newProject: 'Démarrer un projet',
    seeWork: 'Voir nos réalisations',
  },
  de: {
    tagline: DE.tagline,
    sub: DE.sub,
    welcomeLead: DE.welcomeLead,
    hint: DE.hint,
    newProject: 'Projekt starten',
    seeWork: 'Unsere Arbeiten ansehen',
  },
}) as Record<Locale, Hero>;

export const LANGS: { code: Locale; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
];
