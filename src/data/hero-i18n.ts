import type { Locale } from '@/lib/site-config';
import { HeroI18nSchema, type Hero } from '@/lib/schema';
import { STUDIO } from '@/data/studio';

export type { Hero };

// Ported from src/components/os/osI18n.ts (HERO). EN aliases STUDIO; FR/DE are
// hardcoded literals. The LB entry has been DROPPED (locale set is en/fr/de).
export const HERO: Record<Locale, Hero> = HeroI18nSchema.parse({
  en: {
    tagline: STUDIO.tagline,
    sub: STUDIO.sub,
    welcomeLead: STUDIO.welcomeLead,
    hint: STUDIO.hint,
    newProject: 'New Project ▸',
    seeWork: 'See our work',
  },
  fr: {
    tagline: 'Des sites qui pensent, bougent et transigent.',
    sub: 'Une agence IA au Luxembourg.',
    welcomeLead:
      "On conçoit et développe vos produits digitaux de A à Z — rendus intelligents par l'IA, portés on-chain quand ça apporte vraiment, hébergés en Europe et marketés pour grandir. Un seul studio responsable, du concret livré, zéro promesse en l'air.",
    hint: "Double-cliquez sur une icône pour découvrir ce qu'on fait — ou lancez « Nouveau projet ».",
    newProject: 'Nouveau projet ▸',
    seeWork: 'Voir nos réalisations',
  },
  de: {
    tagline: 'Websites, die denken, bewegen und handeln.',
    sub: 'Eine KI-Agentur in Luxemburg.',
    welcomeLead:
      'Wir gestalten und entwickeln digitale Produkte von A bis Z — smart gemacht mit KI, on-chain gebracht, wo es echten Mehrwert schafft, in Europa gehostet und für Wachstum vermarktet. Ein Studio mit voller Verantwortung, echte fertige Arbeit, kein Blendwerk.',
    hint: 'Doppelklicken Sie auf ein Icon, um zu sehen, was wir tun — oder starten Sie „Neues Projekt“.',
    newProject: 'Neues Projekt ▸',
    seeWork: 'Unsere Arbeiten ansehen',
  },
}) as Record<Locale, Hero>;

export const LANGS: { code: Locale; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
];
