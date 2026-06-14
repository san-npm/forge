import { StudioSchema, type Studio } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';

export type { Studio };

// Per-locale studio identity. EN is the source of truth; FR/DE are professional
// Luxembourg-business translations. The tagline verbs (think/move/transact) are
// kept idiomatic so the homepage lime accent still lands on real verbs.
const STUDIO_I18N: Record<Locale, Studio> = {
  en: {
    name: 'Openletz',
    tagline: 'Websites that think, move & transact.',
    sub: 'A Luxembourg AI agency.',
    welcomeLead:
      "We're a small Luxembourg studio. We build AI agents, chatbots and automations that actually save time, plus the websites and shops around them. When a project needs blockchain, we build that too. Everything runs in Europe, and it's yours to keep.",
    hint: 'Double-click an icon to see what we do, or hit "New Project" to start.',
  },
  fr: {
    name: 'Openletz',
    tagline: 'Des sites qui pensent, bougent et transigent.',
    sub: 'Une agence IA au Luxembourg.',
    welcomeLead:
      "Nous sommes un petit studio luxembourgeois. Nous concevons des agents IA, des chatbots et des automatisations qui font vraiment gagner du temps, ainsi que les sites et boutiques qui vont avec. Quand un projet a besoin de blockchain, nous la construisons aussi. Tout tourne en Europe, et tout vous appartient.",
    hint: 'Double-cliquez sur une icône pour découvrir ce que nous faisons, ou lancez « Nouveau projet ».',
  },
  de: {
    name: 'Openletz',
    tagline: 'Websites, die denken, bewegen und handeln.',
    sub: 'Eine KI-Agentur in Luxemburg.',
    welcomeLead:
      'Wir sind ein kleines Luxemburger Studio. Wir bauen KI-Agenten, Chatbots und Automatisierungen, die wirklich Zeit sparen, dazu die Websites und Shops drumherum. Wenn ein Projekt Blockchain braucht, bauen wir auch das. Alles läuft in Europa, und alles gehört Ihnen.',
    hint: 'Doppelklicken Sie auf ein Icon, um zu sehen, was wir tun, oder starten Sie „Neues Projekt".',
  },
};

const PARSED_STUDIO: Record<Locale, Studio> = {
  en: StudioSchema.parse(STUDIO_I18N.en),
  fr: StudioSchema.parse(STUDIO_I18N.fr),
  de: StudioSchema.parse(STUDIO_I18N.de),
};

/** Active-locale studio identity. */
export function getStudio(locale: Locale): Studio {
  return PARSED_STUDIO[locale];
}

// EN constant kept for the data tests and the EN homepage spine.
export const STUDIO: Studio = PARSED_STUDIO.en;
