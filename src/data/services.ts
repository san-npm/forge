import { ServicesSchema, type ServiceData, type ServiceKey } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';

export type { ServiceData, ServiceKey };

type Services = Record<ServiceKey, ServiceData>;

// Per-locale service pillars. Keys keep the 'ai' | 'web3' | 'marketing' shape;
// the marketing kicker reads "Growth" (EN) / "Croissance" (FR) / "Wachstum" (DE).
const SERVICES_I18N: Record<Locale, Services> = {
  en: {
    ai: {
      kicker: 'What we do · AI',
      title: 'AI agents & automation',
      lead:
        'This is the core of what we do. We build AI agents, chatbots and automations for businesses in Luxembourg, from a quick audit to something running in production, usually in a few weeks.',
      what: [
        {
          t: 'Agents & chatbots',
          d: 'Assistants that answer questions, handle support and do back-office work, in French, English, German or Luxembourgish.',
        },
        {
          t: 'Automations',
          d: 'The repetitive stuff (documents, leads, CRM, ops) handled, with the time saved you can actually measure.',
        },
        {
          t: 'Where to start',
          d: 'A short audit that finds the one or two things worth automating first.',
        },
      ],
      how: ['A quick audit', 'A working prototype you can click', 'Live, with numbers to show it works'],
      proof:
        "We pick tools with GDPR and the EU AI Act in mind. Skills.ws, our marketplace for AI coding assistants, is one of our own, and we have contributed for years to LiberClaw, a personal AI agent platform. Both are in the Work folder.",
      footer:
        "In Luxembourg? Your project may be co-funded through the SME Package, and we'll help with the paperwork.",
    },
    web3: {
      kicker: 'What we do · Web3',
      title: 'Web3 & On-Chain',
      lead:
        "Not the headline, but a tool we reach for when it helps. If a product is better with payments, ownership or token-gating built in, we'll build it on-chain and host it in Europe.",
      what: [
        {
          t: 'Apps & smart contracts',
          d: 'Token-gating, mints and full on-chain apps, built carefully, with audits in mind.',
        },
        { t: 'Token-gated access', d: 'Memberships, paywalls and communities tied to a wallet.' },
        { t: 'European hosting', d: 'Run in Europe, no lock-in.' },
      ],
      how: ['Scope & architecture', 'Build & careful testing', 'Launch + support'],
      proof:
        'We ship real on-chain products, not decks. Ophis (a DEX aggregator) and Gategram are both in the Work folder.',
    },
    marketing: {
      kicker: 'What we do · Growth',
      title: 'Digital & Growth',
      lead: 'The websites and shops that carry it all, plus the marketing to get them seen.',
      what: [
        {
          t: 'Websites & shops',
          d: 'Fast, modern builds on Next.js, like Vins Fins and La Grocerie.',
        },
        {
          t: 'Getting found',
          d: "SEO, plus the newer game of being cited by AI assistants. It's all live on this very site.",
        },
        {
          t: 'Content & analytics',
          d: 'A simple loop (publish, measure, improve) with GA4 and Search Console wired in.',
        },
      ],
      how: ['Position & design', 'Build & instrument', 'Grow & report'],
      proof: 'We have contributed for years to live products, marketing the decentralized cloud Aleph Cloud.',
    },
  },
  fr: {
    ai: {
      kicker: 'Ce que nous faisons · IA',
      title: 'Agents IA & automatisation',
      lead:
        "C'est le cœur de notre métier. Nous concevons des agents IA, des chatbots et des automatisations pour les entreprises au Luxembourg, d'un audit rapide à une solution en production, souvent en quelques semaines.",
      what: [
        {
          t: 'Agents & chatbots',
          d: 'Des assistants qui répondent aux questions, gèrent le support et traitent le back-office, en français, anglais, allemand ou luxembourgeois.',
        },
        {
          t: 'Automatisations',
          d: 'Les tâches répétitives (documents, leads, CRM, opérations) prises en charge, avec un temps gagné réellement mesurable.',
        },
        {
          t: 'Par où commencer',
          d: "Un audit court qui repère les une ou deux choses à automatiser en priorité.",
        },
      ],
      how: ['Un audit rapide', 'Un prototype fonctionnel à tester en un clic', 'En production, avec des chiffres à l’appui'],
      proof:
        "Nous choisissons nos outils en pensant au RGPD et au règlement européen sur l'IA. Skills.ws, notre marketplace pour assistants de code IA, est l'un des nôtres, et nous contribuons depuis des années à LiberClaw, une plateforme d'agent IA personnel. Les deux sont dans le dossier Réalisations.",
      footer:
        'Au Luxembourg ? Votre projet peut être cofinancé via le SME Package (aides aux PME), et nous vous aidons avec les démarches.',
    },
    web3: {
      kicker: 'Ce que nous faisons · Web3',
      title: 'Web3 & On-Chain',
      lead:
        "Pas notre vitrine, mais un outil que nous mobilisons quand il apporte vraiment. Si un produit gagne à intégrer paiements, propriété ou accès par token, nous le construisons on-chain et l'hébergeons en Europe.",
      what: [
        {
          t: 'Applis & smart contracts',
          d: 'Accès par token, mints et applis on-chain complètes, construits avec soin et en pensant aux audits.',
        },
        { t: 'Accès par token', d: 'Adhésions, paywalls et communautés liés à un wallet.' },
        { t: 'Hébergement européen', d: 'En Europe, sans verrouillage.' },
      ],
      how: ['Cadrage & architecture', 'Développement & tests rigoureux', 'Lancement + support'],
      proof:
        'Nous livrons de vrais produits on-chain, pas des slides. Ophis (un agrégateur DEX) et Gategram sont tous deux dans le dossier Réalisations.',
    },
    marketing: {
      kicker: 'Ce que nous faisons · Croissance',
      title: 'Digital & Croissance',
      lead: 'Les sites et boutiques qui portent le tout, et le marketing pour les faire connaître.',
      what: [
        {
          t: 'Sites & boutiques',
          d: 'Des réalisations rapides et modernes sur Next.js, comme Vins Fins et La Grocerie.',
        },
        {
          t: 'Se faire trouver',
          d: "Le SEO, et le nouveau terrain de jeu : être cité par les assistants IA. Tout est en ligne sur ce site même.",
        },
        {
          t: 'Contenu & analytics',
          d: 'Une boucle simple (publier, mesurer, améliorer) avec GA4 et Search Console connectés.',
        },
      ],
      how: ['Positionnement & design', 'Développement & mesure', 'Croissance & reporting'],
      proof: 'Nous contribuons depuis des années à des produits en ligne, en assurant le marketing du cloud décentralisé Aleph Cloud.',
    },
  },
  de: {
    ai: {
      kicker: 'Was wir tun · KI',
      title: 'KI-Agenten & Automatisierung',
      lead:
        'Das ist der Kern unserer Arbeit. Wir bauen KI-Agenten, Chatbots und Automatisierungen für Unternehmen in Luxemburg, vom schnellen Audit bis zur produktiven Lösung, meist in wenigen Wochen.',
      what: [
        {
          t: 'Agenten & Chatbots',
          d: 'Assistenten, die Fragen beantworten, den Support übernehmen und Back-Office-Arbeit erledigen, auf Französisch, Englisch, Deutsch oder Luxemburgisch.',
        },
        {
          t: 'Automatisierungen',
          d: 'Die wiederkehrenden Aufgaben (Dokumente, Leads, CRM, Betrieb) erledigt, mit einer Zeitersparnis, die sich wirklich messen lässt.',
        },
        {
          t: 'Wo anfangen',
          d: 'Ein kurzes Audit, das die ein oder zwei Dinge findet, die sich zuerst zu automatisieren lohnen.',
        },
      ],
      how: ['Ein schnelles Audit', 'Ein klickbarer, funktionierender Prototyp', 'Live, mit Zahlen, die es belegen'],
      proof:
        'Wir wählen unsere Werkzeuge mit Blick auf die DSGVO und die EU-KI-Verordnung. Skills.ws, unser Marktplatz für KI-Coding-Assistenten, ist eines unserer eigenen Produkte, und wir wirken seit Jahren an LiberClaw mit, einer persönlichen KI-Agenten-Plattform. Beide liegen im Ordner Arbeiten.',
      footer:
        'In Luxemburg? Ihr Projekt kann über das SME Package (Förderung für KMU) kofinanziert werden, und wir helfen bei den Formalitäten.',
    },
    web3: {
      kicker: 'Was wir tun · Web3',
      title: 'Web3 & On-Chain',
      lead:
        'Nicht unser Aushängeschild, aber ein Werkzeug, das wir einsetzen, wenn es echten Mehrwert bringt. Profitiert ein Produkt von integrierten Zahlungen, Eigentum oder Token-Gating, bauen wir es on-chain und hosten es in Europa.',
      what: [
        {
          t: 'Apps & Smart Contracts',
          d: 'Token-Gating, Mints und vollständige On-Chain-Apps, sorgfältig gebaut, mit Audits im Blick.',
        },
        { t: 'Token-basierter Zugang', d: 'Mitgliedschaften, Paywalls und Communities, an ein Wallet gebunden.' },
        { t: 'Europäisches Hosting', d: 'In Europa betrieben, ohne Lock-in.' },
      ],
      how: ['Konzept & Architektur', 'Entwicklung & sorgfältiges Testen', 'Launch + Support'],
      proof:
        'Wir liefern echte On-Chain-Produkte, keine Präsentationen. Ophis (ein DEX-Aggregator) und Gategram liegen beide im Ordner Arbeiten.',
    },
    marketing: {
      kicker: 'Was wir tun · Wachstum',
      title: 'Digital & Wachstum',
      lead: 'Die Websites und Shops, die alles tragen, plus das Marketing, das sie sichtbar macht.',
      what: [
        {
          t: 'Websites & Shops',
          d: 'Schnelle, moderne Umsetzungen mit Next.js, wie Vins Fins und La Grocerie.',
        },
        {
          t: 'Gefunden werden',
          d: 'SEO, plus die neue Disziplin, von KI-Assistenten zitiert zu werden. Alles live auf genau dieser Website.',
        },
        {
          t: 'Inhalte & Analytics',
          d: 'Eine einfache Schleife (veröffentlichen, messen, verbessern) mit angebundenem GA4 und Search Console.',
        },
      ],
      how: ['Positionierung & Design', 'Aufbau & Messung', 'Wachstum & Reporting'],
      proof: 'Wir wirken seit Jahren an Live-Produkten mit und verantworten das Marketing der dezentralen Cloud Aleph Cloud.',
    },
  },
};

const PARSED_SERVICES: Record<Locale, Services> = {
  en: ServicesSchema.parse(SERVICES_I18N.en) as Services,
  fr: ServicesSchema.parse(SERVICES_I18N.fr) as Services,
  de: ServicesSchema.parse(SERVICES_I18N.de) as Services,
};

/** Active-locale service pillars. */
export function getServices(locale: Locale): Services {
  return PARSED_SERVICES[locale];
}

// EN constant kept for the data tests and the EN homepage spine.
export const SERVICES: Services = PARSED_SERVICES.en;
