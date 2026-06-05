// Openletz OS — lightweight UI i18n for the hero strings (the most-seen copy).
// FR/DE/LB are first-pass; the content workflow's native translations replace them.
import { STUDIO } from './osData';

export type Lang = 'en' | 'fr' | 'de' | 'lb';

export interface Hero {
  tagline: string;
  sub: string;
  welcomeLead: string;
  hint: string;
  newProject: string;
  seeWork: string;
}

export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'lb', flag: '🇱🇺', label: 'Lëtzebuergesch' },
];

export const HERO: Record<Lang, Hero> = {
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
      'On conçoit et développe vos produits digitaux de A à Z — rendus intelligents par l’IA, portés on-chain quand ça apporte vraiment, hébergés en Europe et marketés pour grandir. Un seul studio responsable, du concret livré, zéro promesse en l’air.',
    hint: 'Double-cliquez sur une icône pour découvrir ce qu’on fait — ou lancez « Nouveau projet ».',
    newProject: 'Nouveau projet ▸',
    seeWork: 'Voir nos réalisations',
  },
  de: {
    tagline: 'Websites, die denken, bewegen und handeln.',
    sub: 'Eine KI-Agentur in Luxemburg.',
    welcomeLead:
      'Wir gestalten und entwickeln digitale Produkte von A bis Z — smart gemacht mit KI, on-chain gebracht, wo es echten Mehrwert schafft, in Europa gehostet und für Wachstum vermarktet. Ein Studio mit voller Verantwortung, echte fertige Arbeit, kein Blendwerk.',
    hint: 'Doppelklicken Sie auf ein Icon, um zu sehen, was wir tun — oder starten Sie „Neues Projekt".',
    newProject: 'Neues Projekt ▸',
    seeWork: 'Unsere Arbeiten ansehen',
  },
  lb: {
    tagline: 'Websäiten déi denken, sech beweegen an handelen.',
    sub: 'Eng KI-Agentur zu Lëtzebuerg.',
    welcomeLead:
      'Mir designen a bauen digital Produkter vun A bis Z — schlau gemaach mat KI, op d’Chain bruecht wann et eppes bréngt, an Europa gehost a vermaart fir ze wuessen. Ee Studio dat d’Verantwortung iwwerhëlt, richteg fäerdeg Aarbecht, keng eidel Verspriechen.',
    hint: 'Duebelklick op en Icon fir ze gesinn wat mir maachen — oder dréck op „Neit Projet".',
    newProject: 'Neit Projet ▸',
    seeWork: 'Eis Aarbechte kucken',
  },
};
