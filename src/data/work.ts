import { WorkSchema, type WorkItem } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';

export type { WorkItem };

// Per-locale WORK. slug, name, link, stack and tag stay constant (brand names
// and the filter tag); kind, blurb, about and did are translated. Order is
// significant. `tag` maps from the (EN) kind for the /work filter.
const WORK_I18N: Record<Locale, WorkItem[]> = {
  en: [
    {
      slug: 'vinsfins',
      name: 'Vins Fins',
      kind: 'E-commerce',
      link: 'https://www.vinsfins.lu',
      blurb: 'A multilingual wine shop & restaurant in the Grund.',
      about:
        "Vins Fins is a wine bar and restaurant in Luxembourg's Grund. We built their online shop and booking site: hundreds of wines, four languages, and a checkout that handles Luxembourg VAT and shipping.",
      did: [
        'Designed and built the site on Next.js',
        'Stripe checkout with Luxembourg VAT',
        'POST Luxembourg shipping + Zenchef bookings',
        'FR / EN / DE / LB, with a light admin',
      ],
      stack: ['Next.js', 'Stripe', 'Vercel'],
      tag: 'web',
    },
    {
      slug: 'lagrocerie',
      name: 'La Grocerie',
      kind: 'E-commerce',
      link: 'https://www.lagrocerie.lu',
      blurb: 'Farm-to-table grocery & natural-wine cellar.',
      about:
        'A sister shop to Vins Fins: a grocery and natural-wine cellar in the Grund, sourcing from short-supply-chain producers. We built the shop, the stock system, and a simple admin the team actually uses.',
      did: [
        'E-commerce on the same stack as Vins Fins',
        'Real-time stock management',
        'Stripe checkout',
        'A lightweight admin',
      ],
      stack: ['Next.js', 'Stripe', 'Vercel KV'],
      tag: 'web',
    },
    {
      slug: 'gategram',
      name: 'Gategram',
      kind: 'Our product',
      link: 'https://gategram.app',
      blurb: 'Sell digital content on Telegram, paid in Stars.',
      about:
        'Our own product: a way for creators to sell digital content inside Telegram and get paid in Stars, with instant delivery, and the creator keeps 95%. Open source.',
      did: [
        'Designed and built the product end to end',
        'Telegram bot + Stars payments',
        'Instant delivery, 95% to the creator',
        'Open-sourced it',
      ],
      stack: ['Telegram', 'Payments', 'Next.js'],
      tag: 'web',
    },
    {
      slug: 'liberclaw',
      name: 'LiberClaw',
      kind: 'AI assistant',
      link: 'https://liberclaw.ai',
      blurb: 'A personal AI assistant you actually control.',
      about:
        'LiberClaw is a personal AI assistant for email, calendar, notes and more, wired into your own accounts. We work on its skills and on how it gets real things done for you.',
      did: [
        'Built assistant skills for email, calendar and notes',
        'Wired them into real accounts',
        'Kept privacy and control front and centre',
      ],
      stack: ['AI agents', 'Skills', 'TypeScript'],
      tag: 'ai',
    },
    {
      slug: 'ophis',
      name: 'Ophis',
      kind: 'Web3 / DeFi',
      link: 'https://ophis.fi',
      blurb: 'An intent-based DEX aggregator for better swaps.',
      about:
        'Ophis is a DEX aggregator: you say what you want, it finds the best way to swap on-chain and protects you from MEV. We handle the product, the brand and the front-end.',
      did: [
        'Product, brand and front-end',
        'Intent-based swap flow',
        'MEV-protected execution + receipts',
      ],
      stack: ['Web3', 'DeFi', 'React'],
      tag: 'web3',
    },
    {
      slug: 'skillsws',
      name: 'Skills.ws',
      kind: 'Our product',
      link: 'https://www.skills.ws',
      blurb: 'A marketplace of skills for AI coding assistants.',
      about:
        'Our own product: a marketplace of ready-made skills for AI coding assistants like Claude Code, Cursor and Codex. Browse, install, and make your assistant better at real work.',
      did: [
        'Designed and built the marketplace',
        '85+ agent skills, browsable and installable',
        'Also shipped as an npm CLI',
      ],
      stack: ['Next.js', 'Vercel', 'npm'],
      tag: 'ai',
    },
    {
      slug: 'alephcloud',
      name: 'Aleph Cloud',
      kind: 'Growth & marketing',
      link: 'https://aleph.cloud',
      blurb: 'Brand, content and growth marketing for the decentralized AI and Web3 cloud.',
      about:
        'A multi-year marketing engagement, not a product we built. We run brand, content and growth marketing for Aleph Cloud, the decentralized cloud for AI and Web3: positioning, written and visual content, and the campaigns that bring developers and projects on board.',
      did: [
        'Brand, content and growth marketing as the engaged partner',
        'Positioning and messaging for a technical, developer audience',
        'Written and visual content across channels',
      ],
      stack: ['Brand', 'Content', 'Growth'],
      tag: 'marketing',
    },
  ],
  fr: [
    {
      slug: 'vinsfins',
      name: 'Vins Fins',
      kind: 'E-commerce',
      link: 'https://www.vinsfins.lu',
      blurb: 'Une cave en ligne multilingue et un restaurant dans le Grund.',
      about:
        "Vins Fins est un bar à vins et restaurant dans le Grund, à Luxembourg. Nous avons construit leur boutique en ligne et leur site de réservation : des centaines de vins, quatre langues, et un paiement qui gère la TVA et la livraison luxembourgeoises.",
      did: [
        'Conçu et développé le site sur Next.js',
        'Paiement Stripe avec TVA luxembourgeoise',
        'Livraison POST Luxembourg + réservations Zenchef',
        'FR / EN / DE / LB, avec une administration légère',
      ],
      stack: ['Next.js', 'Stripe', 'Vercel'],
      tag: 'web',
    },
    {
      slug: 'lagrocerie',
      name: 'La Grocerie',
      kind: 'E-commerce',
      link: 'https://www.lagrocerie.lu',
      blurb: 'Épicerie de circuit court et cave à vins naturels.',
      about:
        'La boutique sœur de Vins Fins : une épicerie et une cave à vins naturels dans le Grund, en circuit court. Nous avons construit la boutique, le système de stock et une administration simple que l’équipe utilise vraiment.',
      did: [
        'E-commerce sur la même base technique que Vins Fins',
        'Gestion des stocks en temps réel',
        'Paiement Stripe',
        'Une administration légère',
      ],
      stack: ['Next.js', 'Stripe', 'Vercel KV'],
      tag: 'web',
    },
    {
      slug: 'gategram',
      name: 'Gategram',
      kind: 'Notre produit',
      link: 'https://gategram.app',
      blurb: 'Vendez du contenu numérique sur Telegram, payé en Stars.',
      about:
        'Notre propre produit : un moyen pour les créateurs de vendre du contenu numérique directement dans Telegram et d’être payés en Stars, avec livraison instantanée, le créateur conservant 95 %. Open source.',
      did: [
        'Conçu et développé le produit de bout en bout',
        'Bot Telegram + paiements en Stars',
        'Livraison instantanée, 95 % pour le créateur',
        'Mis en open source',
      ],
      stack: ['Telegram', 'Paiements', 'Next.js'],
      tag: 'web',
    },
    {
      slug: 'liberclaw',
      name: 'LiberClaw',
      kind: 'Assistant IA',
      link: 'https://liberclaw.ai',
      blurb: 'Un assistant IA personnel que vous contrôlez vraiment.',
      about:
        'LiberClaw est un assistant IA personnel pour les e-mails, l’agenda, les notes et plus encore, connecté à vos propres comptes. Nous travaillons sur ses compétences et sur sa capacité à accomplir des tâches concrètes pour vous.',
      did: [
        'Développé des compétences d’assistant pour e-mails, agenda et notes',
        'Connectées à de vrais comptes',
        'Confidentialité et contrôle au premier plan',
      ],
      stack: ['Agents IA', 'Compétences', 'TypeScript'],
      tag: 'ai',
    },
    {
      slug: 'ophis',
      name: 'Ophis',
      kind: 'Web3 / DeFi',
      link: 'https://ophis.fi',
      blurb: 'Un agrégateur DEX par intention pour de meilleurs swaps.',
      about:
        'Ophis est un agrégateur DEX : vous indiquez ce que vous voulez, il trouve la meilleure façon de swapper on-chain et vous protège du MEV. Nous gérons le produit, la marque et le front-end.',
      did: [
        'Produit, marque et front-end',
        'Flux de swap par intention',
        'Exécution protégée du MEV + reçus',
      ],
      stack: ['Web3', 'DeFi', 'React'],
      tag: 'web3',
    },
    {
      slug: 'skillsws',
      name: 'Skills.ws',
      kind: 'Notre produit',
      link: 'https://www.skills.ws',
      blurb: 'Une marketplace de compétences pour les assistants de code IA.',
      about:
        'Notre propre produit : une marketplace de compétences prêtes à l’emploi pour les assistants de code IA comme Claude Code, Cursor et Codex. Parcourez, installez et rendez votre assistant meilleur sur les tâches réelles.',
      did: [
        'Conçu et développé la marketplace',
        '85+ compétences d’agent, à parcourir et installer',
        'Aussi livrée en CLI npm',
      ],
      stack: ['Next.js', 'Vercel', 'npm'],
      tag: 'ai',
    },
    {
      slug: 'alephcloud',
      name: 'Aleph Cloud',
      kind: 'Croissance & marketing',
      link: 'https://aleph.cloud',
      blurb: 'Marque, contenu et marketing de croissance pour le cloud décentralisé dédié à l’IA et au Web3.',
      about:
        'Une mission marketing pluriannuelle, pas un produit que nous avons construit. Nous gérons la marque, le contenu et le marketing de croissance d’Aleph Cloud, le cloud décentralisé pour l’IA et le Web3 : positionnement, contenu rédactionnel et visuel, et les campagnes qui attirent développeurs et projets.',
      did: [
        'Marque, contenu et marketing de croissance en tant que partenaire engagé',
        'Positionnement et messages pour un public technique de développeurs',
        'Contenu rédactionnel et visuel sur tous les canaux',
      ],
      stack: ['Marque', 'Contenu', 'Croissance'],
      tag: 'marketing',
    },
  ],
  de: [
    {
      slug: 'vinsfins',
      name: 'Vins Fins',
      kind: 'E-Commerce',
      link: 'https://www.vinsfins.lu',
      blurb: 'Ein mehrsprachiger Weinshop und ein Restaurant im Grund.',
      about:
        'Vins Fins ist eine Weinbar und ein Restaurant im Grund in Luxemburg. Wir haben ihren Onlineshop und die Reservierungsseite gebaut: Hunderte Weine, vier Sprachen und ein Checkout, der die luxemburgische Mehrwertsteuer und den Versand abwickelt.',
      did: [
        'Die Website mit Next.js gestaltet und gebaut',
        'Stripe-Checkout mit luxemburgischer Mehrwertsteuer',
        'POST-Luxemburg-Versand + Zenchef-Reservierungen',
        'FR / EN / DE / LB, mit schlanker Administration',
      ],
      stack: ['Next.js', 'Stripe', 'Vercel'],
      tag: 'web',
    },
    {
      slug: 'lagrocerie',
      name: 'La Grocerie',
      kind: 'E-Commerce',
      link: 'https://www.lagrocerie.lu',
      blurb: 'Hofladen-Lebensmittel und Naturweinkeller.',
      about:
        'Ein Schwestergeschäft zu Vins Fins: ein Lebensmittelladen und Naturweinkeller im Grund, der von Produzenten mit kurzen Lieferketten bezieht. Wir haben den Shop, das Bestandssystem und eine einfache Administration gebaut, die das Team wirklich nutzt.',
      did: [
        'E-Commerce auf derselben Basis wie Vins Fins',
        'Bestandsverwaltung in Echtzeit',
        'Stripe-Checkout',
        'Eine schlanke Administration',
      ],
      stack: ['Next.js', 'Stripe', 'Vercel KV'],
      tag: 'web',
    },
    {
      slug: 'gategram',
      name: 'Gategram',
      kind: 'Unser Produkt',
      link: 'https://gategram.app',
      blurb: 'Digitale Inhalte auf Telegram verkaufen, bezahlt in Stars.',
      about:
        'Unser eigenes Produkt: ein Weg für Creator, digitale Inhalte direkt in Telegram zu verkaufen und in Stars bezahlt zu werden, mit sofortiger Auslieferung, wobei der Creator 95 % behält. Open Source.',
      did: [
        'Das Produkt von A bis Z gestaltet und gebaut',
        'Telegram-Bot + Stars-Zahlungen',
        'Sofortige Auslieferung, 95 % für den Creator',
        'Als Open Source veröffentlicht',
      ],
      stack: ['Telegram', 'Zahlungen', 'Next.js'],
      tag: 'web',
    },
    {
      slug: 'liberclaw',
      name: 'LiberClaw',
      kind: 'KI-Assistent',
      link: 'https://liberclaw.ai',
      blurb: 'Ein persönlicher KI-Assistent, den Sie wirklich kontrollieren.',
      about:
        'LiberClaw ist ein persönlicher KI-Assistent für E-Mail, Kalender, Notizen und mehr, angebunden an Ihre eigenen Konten. Wir arbeiten an seinen Fähigkeiten und daran, wie er echte Dinge für Sie erledigt.',
      did: [
        'Assistenten-Fähigkeiten für E-Mail, Kalender und Notizen gebaut',
        'An echte Konten angebunden',
        'Datenschutz und Kontrolle an erster Stelle',
      ],
      stack: ['KI-Agenten', 'Fähigkeiten', 'TypeScript'],
      tag: 'ai',
    },
    {
      slug: 'ophis',
      name: 'Ophis',
      kind: 'Web3 / DeFi',
      link: 'https://ophis.fi',
      blurb: 'Ein intent-basierter DEX-Aggregator für bessere Swaps.',
      about:
        'Ophis ist ein DEX-Aggregator: Sie sagen, was Sie wollen, er findet den besten Weg, on-chain zu swappen, und schützt Sie vor MEV. Wir verantworten Produkt, Marke und Front-End.',
      did: [
        'Produkt, Marke und Front-End',
        'Intent-basierter Swap-Ablauf',
        'MEV-geschützte Ausführung + Belege',
      ],
      stack: ['Web3', 'DeFi', 'React'],
      tag: 'web3',
    },
    {
      slug: 'skillsws',
      name: 'Skills.ws',
      kind: 'Unser Produkt',
      link: 'https://www.skills.ws',
      blurb: 'Ein Marktplatz für Fähigkeiten für KI-Coding-Assistenten.',
      about:
        'Unser eigenes Produkt: ein Marktplatz für fertige Fähigkeiten für KI-Coding-Assistenten wie Claude Code, Cursor und Codex. Durchsuchen, installieren und Ihren Assistenten bei echter Arbeit besser machen.',
      did: [
        'Den Marktplatz gestaltet und gebaut',
        '85+ Agenten-Fähigkeiten, durchsuchbar und installierbar',
        'Auch als npm-CLI veröffentlicht',
      ],
      stack: ['Next.js', 'Vercel', 'npm'],
      tag: 'ai',
    },
    {
      slug: 'alephcloud',
      name: 'Aleph Cloud',
      kind: 'Wachstum & Marketing',
      link: 'https://aleph.cloud',
      blurb: 'Marke, Inhalte und Wachstumsmarketing für die dezentrale Cloud für KI und Web3.',
      about:
        'Eine mehrjährige Marketing-Zusammenarbeit, kein von uns gebautes Produkt. Wir verantworten Marke, Inhalte und Wachstumsmarketing für Aleph Cloud, die dezentrale Cloud für KI und Web3: Positionierung, redaktionelle und visuelle Inhalte und die Kampagnen, die Entwickler und Projekte gewinnen.',
      did: [
        'Marke, Inhalte und Wachstumsmarketing als engagierter Partner',
        'Positionierung und Botschaften für ein technisches Entwicklerpublikum',
        'Redaktionelle und visuelle Inhalte über alle Kanäle',
      ],
      stack: ['Marke', 'Inhalte', 'Wachstum'],
      tag: 'marketing',
    },
  ],
};

const PARSED_WORK: Record<Locale, WorkItem[]> = {
  en: WorkSchema.parse(WORK_I18N.en),
  fr: WorkSchema.parse(WORK_I18N.fr),
  de: WorkSchema.parse(WORK_I18N.de),
};

/** Active-locale work items. */
export function getWork(locale: Locale): WorkItem[] {
  return PARSED_WORK[locale];
}

// EN constant kept for the data tests, proof derivation, and the EN spine.
export const WORK: WorkItem[] = PARSED_WORK.en;
