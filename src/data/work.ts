import { WorkSchema, type WorkItem } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';

export type { WorkItem };

// Per-locale WORK. slug, name, link, stack and tag stay constant (brand names
// and the filter tag); kind, blurb, about and did are translated. Order is
// significant: built products first, then client builds, then projects
// contributed to. `tag` drives the /work filter and the honest split:
//   - built products (Gategram, Skills.ws, Ophis): tag 'web' / 'ai' / 'web3'
//   - client builds (Vins Fins, La Grocerie): tag 'web'
//   - CONTRIBUTED to, never owned (LiberClaw, LibertAI, Aleph Cloud): tag
//     'contributed', kind 'Contributor'. Their copy ONLY says the founder
//     contributed / worked on them for years, never that Openletz built them.
const WORK_I18N: Record<Locale, WorkItem[]> = {
  en: [
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
      slug: 'ophis',
      name: 'Ophis',
      kind: 'Our product',
      link: 'https://ophis.fi',
      blurb: 'An intent-based DEX aggregator for better swaps.',
      about:
        'Our own product: a DEX aggregator where you say what you want, it finds the best way to swap on-chain and protects you from MEV. We built the product, the brand and the front-end.',
      did: [
        'Product, brand and front-end',
        'Intent-based swap flow',
        'MEV-protected execution + receipts',
      ],
      stack: ['Web3', 'DeFi', 'React'],
      tag: 'web3',
    },
    {
      slug: 'vinsfins',
      name: 'Vins Fins',
      kind: 'Client build',
      link: 'https://www.vinsfins.lu',
      blurb: 'A multilingual wine shop & restaurant in the Grund.',
      about:
        "Vins Fins is a wine bar and restaurant in Luxembourg's Grund. We built their online shop and booking site for them: hundreds of wines, four languages, and a checkout that handles Luxembourg VAT and shipping.",
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
      kind: 'Client build',
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
      slug: 'liberclaw',
      name: 'LiberClaw',
      kind: 'Contributor',
      link: 'https://liberclaw.ai',
      blurb: 'Years contributing to the personal AI agent platform built on Aleph.',
      about:
        'Not our product: a personal AI agent platform built on Aleph. We contributed to it for years, working on its assistant skills for email, calendar and notes and on how it gets real things done, while privacy and control stay with the user.',
      did: [
        'Contributed to assistant skills for email, calendar and notes',
        'Worked on getting real things done for the user',
        'Kept privacy and control front and centre',
      ],
      stack: ['AI agents', 'Skills', 'TypeScript'],
      tag: 'contributed',
    },
    {
      slug: 'libertai',
      name: 'LibertAI',
      kind: 'Contributor',
      link: 'https://libertai.io',
      blurb: 'Years contributing to the decentralized AI inference platform.',
      about:
        'Not our product: a decentralized AI inference platform. We contributed to it for years, helping with positioning, content and growth around private, censorship-resistant AI that runs on a decentralized network.',
      did: [
        'Contributed to positioning and messaging',
        'Worked on content and growth for a technical audience',
        'Supported a private, decentralized take on AI inference',
      ],
      stack: ['Decentralized AI', 'Content', 'Growth'],
      tag: 'contributed',
    },
    {
      slug: 'alephcloud',
      name: 'Aleph Cloud',
      kind: 'Contributor',
      link: 'https://aleph.cloud',
      blurb: 'Years of marketing, growth and contribution to the decentralized AI and Web3 cloud.',
      about:
        'Not our product: the decentralized cloud for AI and Web3. We contributed to it for years through marketing and growth: positioning, written and visual content, and the campaigns that bring developers and projects on board.',
      did: [
        'Years of brand, content and growth marketing as a contributor',
        'Positioning and messaging for a technical, developer audience',
        'Written and visual content across channels',
      ],
      stack: ['Brand', 'Content', 'Growth'],
      tag: 'contributed',
    },
  ],
  fr: [
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
      slug: 'ophis',
      name: 'Ophis',
      kind: 'Notre produit',
      link: 'https://ophis.fi',
      blurb: 'Un agrégateur DEX par intention pour de meilleurs swaps.',
      about:
        'Notre propre produit : un agrégateur DEX où vous indiquez ce que vous voulez, il trouve la meilleure façon de swapper on-chain et vous protège du MEV. Nous avons construit le produit, la marque et le front-end.',
      did: [
        'Produit, marque et front-end',
        'Flux de swap par intention',
        'Exécution protégée du MEV + reçus',
      ],
      stack: ['Web3', 'DeFi', 'React'],
      tag: 'web3',
    },
    {
      slug: 'vinsfins',
      name: 'Vins Fins',
      kind: 'Projet client',
      link: 'https://www.vinsfins.lu',
      blurb: 'Une cave en ligne multilingue et un restaurant dans le Grund.',
      about:
        "Vins Fins est un bar à vins et restaurant dans le Grund, à Luxembourg. Nous avons construit pour eux leur boutique en ligne et leur site de réservation : des centaines de vins, quatre langues, et un paiement qui gère la TVA et la livraison luxembourgeoises.",
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
      kind: 'Projet client',
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
      slug: 'liberclaw',
      name: 'LiberClaw',
      kind: 'Contributeur',
      link: 'https://liberclaw.ai',
      blurb: 'Des années de contribution à la plateforme d’agent IA personnel bâtie sur Aleph.',
      about:
        'Pas notre produit : une plateforme d’agent IA personnel bâtie sur Aleph. Nous y avons contribué pendant des années, en travaillant sur ses compétences d’assistant pour e-mails, agenda et notes et sur sa capacité à accomplir des tâches concrètes, la confidentialité et le contrôle restant côté utilisateur.',
      did: [
        'Contribué aux compétences d’assistant pour e-mails, agenda et notes',
        'Travaillé sur l’accomplissement de tâches concrètes pour l’utilisateur',
        'Confidentialité et contrôle au premier plan',
      ],
      stack: ['Agents IA', 'Compétences', 'TypeScript'],
      tag: 'contributed',
    },
    {
      slug: 'libertai',
      name: 'LibertAI',
      kind: 'Contributeur',
      link: 'https://libertai.io',
      blurb: 'Des années de contribution à la plateforme d’inférence IA décentralisée.',
      about:
        'Pas notre produit : une plateforme d’inférence IA décentralisée. Nous y avons contribué pendant des années, en aidant sur le positionnement, le contenu et la croissance autour d’une IA privée et résistante à la censure qui tourne sur un réseau décentralisé.',
      did: [
        'Contribué au positionnement et aux messages',
        'Travaillé sur le contenu et la croissance pour un public technique',
        'Soutenu une approche privée et décentralisée de l’inférence IA',
      ],
      stack: ['IA décentralisée', 'Contenu', 'Croissance'],
      tag: 'contributed',
    },
    {
      slug: 'alephcloud',
      name: 'Aleph Cloud',
      kind: 'Contributeur',
      link: 'https://aleph.cloud',
      blurb: 'Des années de marketing, de croissance et de contribution au cloud décentralisé dédié à l’IA et au Web3.',
      about:
        'Pas notre produit : le cloud décentralisé pour l’IA et le Web3. Nous y avons contribué pendant des années via le marketing et la croissance : positionnement, contenu rédactionnel et visuel, et les campagnes qui attirent développeurs et projets.',
      did: [
        'Des années de marque, de contenu et de marketing de croissance en tant que contributeur',
        'Positionnement et messages pour un public technique de développeurs',
        'Contenu rédactionnel et visuel sur tous les canaux',
      ],
      stack: ['Marque', 'Contenu', 'Croissance'],
      tag: 'contributed',
    },
  ],
  de: [
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
      slug: 'ophis',
      name: 'Ophis',
      kind: 'Unser Produkt',
      link: 'https://ophis.fi',
      blurb: 'Ein intent-basierter DEX-Aggregator für bessere Swaps.',
      about:
        'Unser eigenes Produkt: ein DEX-Aggregator, bei dem Sie sagen, was Sie wollen, er findet den besten Weg, on-chain zu swappen, und schützt Sie vor MEV. Wir haben Produkt, Marke und Front-End gebaut.',
      did: [
        'Produkt, Marke und Front-End',
        'Intent-basierter Swap-Ablauf',
        'MEV-geschützte Ausführung + Belege',
      ],
      stack: ['Web3', 'DeFi', 'React'],
      tag: 'web3',
    },
    {
      slug: 'vinsfins',
      name: 'Vins Fins',
      kind: 'Kundenprojekt',
      link: 'https://www.vinsfins.lu',
      blurb: 'Ein mehrsprachiger Weinshop und ein Restaurant im Grund.',
      about:
        'Vins Fins ist eine Weinbar und ein Restaurant im Grund in Luxemburg. Wir haben für sie ihren Onlineshop und die Reservierungsseite gebaut: Hunderte Weine, vier Sprachen und ein Checkout, der die luxemburgische Mehrwertsteuer und den Versand abwickelt.',
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
      kind: 'Kundenprojekt',
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
      slug: 'liberclaw',
      name: 'LiberClaw',
      kind: 'Mitwirkung',
      link: 'https://liberclaw.ai',
      blurb: 'Jahre der Mitwirkung an der persönlichen KI-Agenten-Plattform auf Basis von Aleph.',
      about:
        'Nicht unser Produkt: eine persönliche KI-Agenten-Plattform auf Basis von Aleph. Wir haben jahrelang mitgewirkt, an ihren Assistenten-Fähigkeiten für E-Mail, Kalender und Notizen und daran, wie sie echte Dinge erledigt, während Datenschutz und Kontrolle bei der Nutzerin bleiben.',
      did: [
        'An Assistenten-Fähigkeiten für E-Mail, Kalender und Notizen mitgewirkt',
        'Daran gearbeitet, echte Dinge für die Nutzerin zu erledigen',
        'Datenschutz und Kontrolle an erster Stelle',
      ],
      stack: ['KI-Agenten', 'Fähigkeiten', 'TypeScript'],
      tag: 'contributed',
    },
    {
      slug: 'libertai',
      name: 'LibertAI',
      kind: 'Mitwirkung',
      link: 'https://libertai.io',
      blurb: 'Jahre der Mitwirkung an der dezentralen KI-Inferenz-Plattform.',
      about:
        'Nicht unser Produkt: eine dezentrale KI-Inferenz-Plattform. Wir haben jahrelang mitgewirkt, mit Hilfe bei Positionierung, Inhalten und Wachstum rund um eine private, zensurresistente KI, die auf einem dezentralen Netzwerk läuft.',
      did: [
        'An Positionierung und Botschaften mitgewirkt',
        'An Inhalten und Wachstum für ein technisches Publikum gearbeitet',
        'Einen privaten, dezentralen Ansatz für KI-Inferenz unterstützt',
      ],
      stack: ['Dezentrale KI', 'Inhalte', 'Wachstum'],
      tag: 'contributed',
    },
    {
      slug: 'alephcloud',
      name: 'Aleph Cloud',
      kind: 'Mitwirkung',
      link: 'https://aleph.cloud',
      blurb: 'Jahre an Marketing, Wachstum und Mitwirkung an der dezentralen Cloud für KI und Web3.',
      about:
        'Nicht unser Produkt: die dezentrale Cloud für KI und Web3. Wir haben jahrelang mitgewirkt, über Marketing und Wachstum: Positionierung, redaktionelle und visuelle Inhalte und die Kampagnen, die Entwickler und Projekte gewinnen.',
      did: [
        'Jahre an Marke, Inhalten und Wachstumsmarketing als Mitwirkende',
        'Positionierung und Botschaften für ein technisches Entwicklerpublikum',
        'Redaktionelle und visuelle Inhalte über alle Kanäle',
      ],
      stack: ['Marke', 'Inhalte', 'Wachstum'],
      tag: 'contributed',
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
