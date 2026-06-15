import { AboutSchema, type About } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';

export type { About };

const ABOUT_I18N: Record<Locale, About> = {
  en: {
    bioLead:
      'Openletz is the studio name of Commit Media, a small Luxembourg shop. I design, build and market AI and web products, usually end to end, with a trusted crew when a project needs more hands.',
    founderName: 'Clément Fermaud',
    founderRole:
      'Founder. I build my own products (Gategram, Ophis and Skills.ws) and do client work like Vins Fins and La Grocerie. For years I have also contributed to the decentralized AI and Web3 ecosystem: LibertAI, LiberClaw and Aleph Cloud.',
    facts: [
      'Based in Luxembourg, in the EU',
      'You work with me directly: no account managers, no offshore handoff',
      'AI tools chosen with GDPR and the EU AI Act in mind; hosting in Europe',
    ],
    entity: 'Commit Media S.à r.l. · RCS B276192 · Luxembourg',
  },
  fr: {
    bioLead:
      "Openletz est le nom de studio de Commit Media, une petite structure luxembourgeoise. Je conçois, développe et commercialise des produits IA et web, le plus souvent de bout en bout, avec une équipe de confiance quand un projet demande plus de bras.",
    founderName: 'Clément Fermaud',
    founderRole:
      'Fondateur. Je développe mes propres produits (Gategram, Ophis et Skills.ws) et je réalise des projets clients comme Vins Fins et La Grocerie. Depuis des années, je contribue aussi à l’écosystème de l’IA décentralisée et du Web3 : LibertAI, LiberClaw et Aleph Cloud.',
    facts: [
      'Basé au Luxembourg, dans l’UE',
      'Vous travaillez directement avec moi : pas de chargés de compte, pas de sous-traitance offshore',
      'Outils IA choisis en pensant au RGPD et au règlement européen sur l’IA ; hébergement en Europe',
    ],
    entity: 'Commit Media S.à r.l. · RCS B276192 · Luxembourg',
  },
  de: {
    bioLead:
      'Openletz ist der Studioname von Commit Media, einem kleinen Luxemburger Betrieb. Ich gestalte, entwickle und vermarkte KI- und Web-Produkte, meist von A bis Z, mit einem eingespielten Team, wenn ein Projekt mehr Hände braucht.',
    founderName: 'Clément Fermaud',
    founderRole:
      'Gründer. Ich entwickle meine eigenen Produkte (Gategram, Ophis und Skills.ws) und betreue Kundenprojekte wie Vins Fins und La Grocerie. Seit Jahren wirke ich außerdem am Ökosystem der dezentralen KI und des Web3 mit: LibertAI, LiberClaw und Aleph Cloud.',
    facts: [
      'Ansässig in Luxemburg, in der EU',
      'Sie arbeiten direkt mit mir: keine Account-Manager, keine Auslagerung ins Ausland',
      'KI-Werkzeuge mit Blick auf DSGVO und EU-KI-Verordnung gewählt; Hosting in Europa',
    ],
    entity: 'Commit Media S.à r.l. · RCS B276192 · Luxembourg',
  },
};

const PARSED_ABOUT: Record<Locale, About> = {
  en: AboutSchema.parse(ABOUT_I18N.en),
  fr: AboutSchema.parse(ABOUT_I18N.fr),
  de: AboutSchema.parse(ABOUT_I18N.de),
};

/** Active-locale about content. */
export function getAbout(locale: Locale): About {
  return PARSED_ABOUT[locale];
}

// EN constant kept for the data tests and the EN homepage spine.
export const ABOUT: About = PARSED_ABOUT.en;
