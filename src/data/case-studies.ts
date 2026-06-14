// Case-study essays, per locale. Structure is complete; metrics/testimonial
// flagged `placeholder: true` stay until the owner supplies real numbers
// (spec §12.3). slug stays constant; title, kicker, problem/process/result and
// metric labels are translated. Metric VALUES (e.g. '4', 'Vins Fins', 'TBD')
// stay identical across languages.

import type { Locale } from '@/lib/site-config';

export interface CaseStudyMetric {
  label: string;
  value: string; // 'TBD' while placeholder
  placeholder: boolean;
}

export type CaseStudySlug = 'vinsfins' | 'lagrocerie';

export interface CaseStudy {
  slug: CaseStudySlug;
  title: string;
  kicker: string;
  problem: string[];
  process: string[];
  result: string[];
  metrics: CaseStudyMetric[];
  testimonial?: { quote: string; name: string; role: string; company: string; placeholder: boolean };
}

const CASE_STUDIES_I18N: Record<Locale, Record<CaseStudySlug, CaseStudy>> = {
  en: {
    vinsfins: {
      slug: 'vinsfins',
      title: 'Vins Fins',
      kicker: 'E-commerce · multilingual wine shop',
      problem: [
        "Vins Fins, a wine bar and restaurant in Luxembourg's Grund, had no way to sell its hundreds of wines online and needed bookings handled in four languages.",
        'The catalogue had to handle Luxembourg VAT and POST Luxembourg shipping without a heavy back-office.',
      ],
      process: [
        'Designed and built the storefront on Next.js, with a light admin the team can actually run.',
        'Wired Stripe checkout with Luxembourg VAT, POST Luxembourg shipping rates, and Zenchef bookings.',
        'Shipped in FR / EN / DE / LB from a single content model.',
      ],
      result: [
        'A fast, multilingual shop and booking site live at vinsfins.lu.',
        'The team manages wines and orders themselves through the light admin.',
      ],
      metrics: [
        { label: 'Languages', value: '4', placeholder: false },
        { label: 'Lighthouse performance', value: 'TBD', placeholder: true },
        { label: 'Time to launch', value: 'TBD', placeholder: true },
        { label: 'Catalogue size', value: 'TBD', placeholder: true },
      ],
      testimonial: { quote: 'TBD, owner to provide.', name: 'TBD', role: 'TBD', company: 'Vins Fins', placeholder: true },
    },
    lagrocerie: {
      slug: 'lagrocerie',
      title: 'La Grocerie',
      kicker: 'E-commerce · farm-to-table grocery & natural wine',
      problem: [
        'La Grocerie, a sister shop to Vins Fins, needed a grocery and natural-wine store sourcing from short-supply-chain producers.',
        'It had to share infrastructure with Vins Fins (Stripe, stock) while staying its own brand.',
      ],
      process: [
        'Built the shop on the same Next.js stack as Vins Fins, sharing the Stripe account and stock KV.',
        'Added real-time stock management and a lightweight admin the team uses daily.',
      ],
      result: [
        'A grocery and natural-wine cellar live at lagrocerie.lu.',
        'Shared infrastructure with Vins Fins keeps operations simple for one small team.',
      ],
      metrics: [
        { label: 'Shared stack', value: 'Vins Fins', placeholder: false },
        { label: 'Lighthouse performance', value: 'TBD', placeholder: true },
        { label: 'Time to launch', value: 'TBD', placeholder: true },
        { label: 'Catalogue size', value: 'TBD', placeholder: true },
      ],
      testimonial: { quote: 'TBD, owner to provide.', name: 'TBD', role: 'TBD', company: 'La Grocerie', placeholder: true },
    },
  },
  fr: {
    vinsfins: {
      slug: 'vinsfins',
      title: 'Vins Fins',
      kicker: 'E-commerce · cave en ligne multilingue',
      problem: [
        'Vins Fins, un bar à vins et restaurant dans le Grund à Luxembourg, n’avait aucun moyen de vendre ses centaines de vins en ligne et avait besoin de gérer les réservations en quatre langues.',
        'Le catalogue devait gérer la TVA luxembourgeoise et la livraison POST Luxembourg sans back-office lourd.',
      ],
      process: [
        'Conçu et développé la boutique sur Next.js, avec une administration légère que l’équipe peut vraiment gérer.',
        'Connecté le paiement Stripe avec la TVA luxembourgeoise, les tarifs POST Luxembourg et les réservations Zenchef.',
        'Livré en FR / EN / DE / LB à partir d’un seul modèle de contenu.',
      ],
      result: [
        'Une boutique multilingue rapide et un site de réservation en ligne sur vinsfins.lu.',
        'L’équipe gère elle-même les vins et les commandes via l’administration légère.',
      ],
      metrics: [
        { label: 'Langues', value: '4', placeholder: false },
        { label: 'Performance Lighthouse', value: 'TBD', placeholder: true },
        { label: 'Délai de lancement', value: 'TBD', placeholder: true },
        { label: 'Taille du catalogue', value: 'TBD', placeholder: true },
      ],
      testimonial: { quote: 'À fournir par le propriétaire.', name: 'TBD', role: 'TBD', company: 'Vins Fins', placeholder: true },
    },
    lagrocerie: {
      slug: 'lagrocerie',
      title: 'La Grocerie',
      kicker: 'E-commerce · épicerie de circuit court & vin naturel',
      problem: [
        'La Grocerie, boutique sœur de Vins Fins, avait besoin d’une épicerie et d’une cave à vins naturels s’approvisionnant en circuit court.',
        'Elle devait partager l’infrastructure avec Vins Fins (Stripe, stock) tout en restant sa propre marque.',
      ],
      process: [
        'Construit la boutique sur la même base Next.js que Vins Fins, en partageant le compte Stripe et le stock KV.',
        'Ajouté une gestion des stocks en temps réel et une administration légère que l’équipe utilise au quotidien.',
      ],
      result: [
        'Une épicerie et une cave à vins naturels en ligne sur lagrocerie.lu.',
        'L’infrastructure partagée avec Vins Fins simplifie les opérations pour une petite équipe.',
      ],
      metrics: [
        { label: 'Base partagée', value: 'Vins Fins', placeholder: false },
        { label: 'Performance Lighthouse', value: 'TBD', placeholder: true },
        { label: 'Délai de lancement', value: 'TBD', placeholder: true },
        { label: 'Taille du catalogue', value: 'TBD', placeholder: true },
      ],
      testimonial: { quote: 'À fournir par le propriétaire.', name: 'TBD', role: 'TBD', company: 'La Grocerie', placeholder: true },
    },
  },
  de: {
    vinsfins: {
      slug: 'vinsfins',
      title: 'Vins Fins',
      kicker: 'E-Commerce · mehrsprachiger Weinshop',
      problem: [
        'Vins Fins, eine Weinbar und ein Restaurant im Grund in Luxemburg, hatte keine Möglichkeit, seine Hunderte Weine online zu verkaufen, und brauchte Reservierungen in vier Sprachen.',
        'Der Katalog musste die luxemburgische Mehrwertsteuer und den POST-Luxemburg-Versand ohne schweres Back-Office abwickeln.',
      ],
      process: [
        'Den Shop mit Next.js gestaltet und gebaut, mit einer schlanken Administration, die das Team wirklich bedienen kann.',
        'Stripe-Checkout mit luxemburgischer Mehrwertsteuer, POST-Luxemburg-Versandtarifen und Zenchef-Reservierungen angebunden.',
        'In FR / EN / DE / LB aus einem einzigen Inhaltsmodell ausgeliefert.',
      ],
      result: [
        'Ein schneller, mehrsprachiger Shop und eine Reservierungsseite live unter vinsfins.lu.',
        'Das Team verwaltet Weine und Bestellungen selbst über die schlanke Administration.',
      ],
      metrics: [
        { label: 'Sprachen', value: '4', placeholder: false },
        { label: 'Lighthouse-Performance', value: 'TBD', placeholder: true },
        { label: 'Zeit bis Launch', value: 'TBD', placeholder: true },
        { label: 'Katalogumfang', value: 'TBD', placeholder: true },
      ],
      testimonial: { quote: 'Vom Inhaber bereitzustellen.', name: 'TBD', role: 'TBD', company: 'Vins Fins', placeholder: true },
    },
    lagrocerie: {
      slug: 'lagrocerie',
      title: 'La Grocerie',
      kicker: 'E-Commerce · Hofladen & Naturwein',
      problem: [
        'La Grocerie, ein Schwestergeschäft zu Vins Fins, brauchte einen Lebensmittel- und Naturweinladen, der von Produzenten mit kurzen Lieferketten bezieht.',
        'Es musste die Infrastruktur mit Vins Fins (Stripe, Bestand) teilen und dabei seine eigene Marke bleiben.',
      ],
      process: [
        'Den Shop auf derselben Next.js-Basis wie Vins Fins gebaut, mit gemeinsamem Stripe-Konto und Bestands-KV.',
        'Bestandsverwaltung in Echtzeit und eine schlanke Administration ergänzt, die das Team täglich nutzt.',
      ],
      result: [
        'Ein Lebensmittelladen und Naturweinkeller live unter lagrocerie.lu.',
        'Die gemeinsame Infrastruktur mit Vins Fins hält den Betrieb für ein kleines Team einfach.',
      ],
      metrics: [
        { label: 'Gemeinsame Basis', value: 'Vins Fins', placeholder: false },
        { label: 'Lighthouse-Performance', value: 'TBD', placeholder: true },
        { label: 'Zeit bis Launch', value: 'TBD', placeholder: true },
        { label: 'Katalogumfang', value: 'TBD', placeholder: true },
      ],
      testimonial: { quote: 'Vom Inhaber bereitzustellen.', name: 'TBD', role: 'TBD', company: 'La Grocerie', placeholder: true },
    },
  },
};

// EN constant kept for the case-studies tests.
export const CASE_STUDIES: Record<CaseStudySlug, CaseStudy> = CASE_STUDIES_I18N.en;

/** Active-locale case study by slug (EN default), or undefined for an unknown slug. */
export function getCaseStudy(slug: string, locale: Locale = 'en'): CaseStudy | undefined {
  return (CASE_STUDIES_I18N[locale] as Record<string, CaseStudy>)[slug];
}
