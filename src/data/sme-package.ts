import { z } from 'zod';
import type { Locale } from '@/lib/site-config';

/**
 * Content for the SME Package page, per locale (EN / FR / DE).
 *
 * Single source of truth, validated at module load so malformed copy fails the
 * build. Facts mirror the official programme (Ministry of the Economy +
 * Luxinnovation) and stay IDENTICAL across languages: 70% of eligible costs,
 * EUR 3,000 to EUR 25,000 excl. VAT, reimbursed AFTER delivery, subject to
 * eligibility and Ministry approval.
 *
 * Copy rule: no em-dashes anywhere. Use commas, periods, colons.
 */

const CategorySchema = z.object({
  title: z.string().min(1),
  desc: z.string().min(1),
});

const StepSchema = z.object({
  n: z.string().regex(/^\d{2}$/),
  title: z.string().min(1),
  desc: z.string().min(1),
});

const BonusSchema = z.object({
  title: z.string().min(1),
  desc: z.string().min(1),
});

const FaqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

const SmePackageContentSchema = z.object({
  /** Official guichet.lu programme page (linked, opens in a new tab). */
  officialUrl: z.string().url(),
  hero: z.object({
    kicker: z.string().min(1),
    lead: z.string().min(1),
  }),
  what: z.object({
    kicker: z.string().min(1),
    title: z.string().min(1),
    accent: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
  }),
  categories: z.array(CategorySchema).min(3),
  steps: z.array(StepSchema).length(5),
  bonus: z.array(BonusSchema).length(3),
  eligibility: z.object({
    points: z.array(z.string().min(1)).min(1),
    caveat: z.string().min(1),
  }),
  faqs: z.array(FaqSchema).min(4),
});

export type SmePackageContent = z.infer<typeof SmePackageContentSchema>;

const OFFICIAL_URL =
  'https://guichet.public.lu/en/entreprises/financement-aides/regime-sme-packages/soutien-pme/sme-packages-digital.html';

const SME_PACKAGE_I18N: Record<Locale, SmePackageContent> = {
  en: {
    officialUrl: OFFICIAL_URL,
    hero: {
      kicker: 'SME Package · Luxembourg',
      lead: 'A Luxembourg state grant covers 70% of your digital or AI project, from EUR 3,000 to EUR 25,000. We scope it, build it, and help you claim it.',
    },
    what: {
      kicker: 'What it is',
      title: 'State aid for Luxembourg SMEs',
      accent: 'aid',
      body: [
        'The SME Package is a Luxembourg state aid scheme run by the Ministry of the Economy, developed with Luxinnovation, in place since 2019. It reimburses 70% of the eligible cost of a qualifying project.',
        'Eligible projects run from EUR 3,000 to EUR 25,000 excluding VAT. They are open to SMEs with a Luxembourg business permit and a registered office in Luxembourg that meet the SME criteria. Openletz is the eligible service provider: you receive the grant, not us.',
      ],
    },
    categories: [
      { title: 'Website & e-commerce', desc: 'Creation of a website or online shop, built to convert and to last.' },
      { title: 'Digital & social marketing', desc: 'Digital marketing and social presence that get your work seen.' },
      { title: 'AI initiatives', desc: 'AI agents, chatbots and automations applied to your real operations.' },
      { title: 'Management systems / ERP', desc: 'ERP, business software and cash-register systems that fit how you work.' },
      { title: 'E-invoicing', desc: 'Electronic invoicing set up cleanly and ready for what is required.' },
    ],
    steps: [
      { n: '01', title: 'Pre-analysis', desc: 'A first analysis with the House of Entrepreneurship or the Chamber of Skilled Trades to confirm the fit.' },
      { n: '02', title: 'Define & quote', desc: 'We define the package together and prepare a quote between EUR 3,000 and EUR 25,000.' },
      { n: '03', title: 'Application', desc: 'The application is submitted, and the Ministry of the Economy decides on the aid.' },
      { n: '04', title: 'We build it', desc: 'Once approved, Openletz implements the project as scoped.' },
      { n: '05', title: 'You claim 70% back', desc: 'After completion you pay the provider, then the Ministry reimburses 70% to your company.' },
    ],
    bonus: [
      { title: 'Paperwork, handled with you', desc: 'We help prepare the application and the supporting documents so the process is not on your plate alone.' },
      { title: 'We scope what qualifies', desc: 'We only take on projects we believe fit the programme, so your application stands on solid ground. We never promise approval.' },
      { title: 'You own everything', desc: 'The website, the code, the automations, the accounts: everything we build is yours to keep.' },
    ],
    eligibility: {
      points: [
        'An SME with a Luxembourg business permit.',
        'A registered office in Luxembourg.',
        'Meeting the SME criteria (staff and financial thresholds).',
        'A defined project in an eligible area, scoped between EUR 3,000 and EUR 25,000 excl. VAT.',
      ],
      caveat:
        'These figures are indicative. Actual aid depends on your eligibility and on approval by the Ministry of the Economy. The SME Package reimburses 70% after the project is delivered: you pay the provider first, then your company is reimbursed.',
    },
    faqs: [
      { q: 'Who is eligible?', a: 'SMEs with a Luxembourg business permit and a registered office in Luxembourg that meet the SME criteria, for a project in an eligible area scoped between EUR 3,000 and EUR 25,000 excluding VAT.' },
      { q: 'How much do I get back?', a: 'The programme reimburses 70% of the eligible project cost. A EUR 10,000 project means about EUR 7,000 back, so it costs your company roughly EUR 3,000 net. Only up to EUR 25,000 of cost counts toward the grant.' },
      { q: 'When do I receive the grant?', a: 'After the project is delivered. Your company pays the provider first, then the Ministry of the Economy reimburses 70%. It is a reimbursement, not an upfront payment.' },
      { q: 'What can it fund?', a: 'Eligible areas include website and e-commerce creation, digital and social marketing, AI initiatives, management systems and ERP, and e-invoicing, among others such as customer experience, energy transition and cybersecurity.' },
      { q: 'Do you guarantee approval?', a: 'No. No provider can guarantee a grant, since the Ministry of the Economy decides. What we do is only take on projects we believe qualify, and help you prepare a clean application.' },
    ],
  },
  fr: {
    officialUrl: OFFICIAL_URL,
    hero: {
      kicker: 'SME Package · Luxembourg',
      lead: 'Une aide d’État luxembourgeoise couvre 70 % de votre projet digital ou IA, de 3 000 EUR à 25 000 EUR. Nous le cadrons, le développons et vous aidons à le demander.',
    },
    what: {
      kicker: 'Ce que c’est',
      title: 'Une aide d’État pour les PME luxembourgeoises',
      accent: 'aide',
      body: [
        'Le SME Package est un régime d’aide d’État luxembourgeois géré par le Ministère de l’Économie, développé avec Luxinnovation, en place depuis 2019. Il rembourse 70 % du coût éligible d’un projet qualifiant.',
        'Les projets éligibles vont de 3 000 EUR à 25 000 EUR hors TVA. Ils sont ouverts aux PME disposant d’une autorisation d’établissement luxembourgeoise et d’un siège social au Luxembourg, répondant aux critères de PME. Openletz est le prestataire éligible : c’est vous qui recevez l’aide, pas nous.',
      ],
    },
    categories: [
      { title: 'Site web & e-commerce', desc: 'Création d’un site ou d’une boutique en ligne, conçus pour convertir et durer.' },
      { title: 'Marketing digital & social', desc: 'Marketing digital et présence sociale qui font connaître votre travail.' },
      { title: 'Initiatives IA', desc: 'Agents IA, chatbots et automatisations appliqués à vos opérations réelles.' },
      { title: 'Systèmes de gestion / ERP', desc: 'ERP, logiciels métiers et systèmes de caisse adaptés à votre façon de travailler.' },
      { title: 'Facturation électronique', desc: 'Une facturation électronique mise en place proprement et prête pour les exigences.' },
    ],
    steps: [
      { n: '01', title: 'Pré-analyse', desc: 'Une première analyse avec la House of Entrepreneurship ou la Chambre des Métiers pour confirmer l’adéquation.' },
      { n: '02', title: 'Cadrer & chiffrer', desc: 'Nous définissons le package ensemble et préparons un devis entre 3 000 EUR et 25 000 EUR.' },
      { n: '03', title: 'Demande', desc: 'La demande est déposée, et le Ministère de l’Économie décide de l’aide.' },
      { n: '04', title: 'Nous le développons', desc: 'Une fois approuvé, Openletz réalise le projet tel que cadré.' },
      { n: '05', title: 'Vous récupérez 70 %', desc: 'Après livraison, vous payez le prestataire, puis le Ministère rembourse 70 % à votre entreprise.' },
    ],
    bonus: [
      { title: 'Les démarches, gérées avec vous', desc: 'Nous aidons à préparer la demande et les pièces justificatives pour que tout ne repose pas sur vous seul.' },
      { title: 'Nous cadrons ce qui est éligible', desc: 'Nous n’acceptons que des projets que nous estimons conformes au programme, pour une demande sur des bases solides. Nous ne promettons jamais l’approbation.' },
      { title: 'Tout vous appartient', desc: 'Le site, le code, les automatisations, les comptes : tout ce que nous construisons vous revient.' },
    ],
    eligibility: {
      points: [
        'Une PME avec une autorisation d’établissement luxembourgeoise.',
        'Un siège social au Luxembourg.',
        'Le respect des critères de PME (seuils d’effectifs et financiers).',
        'Un projet défini dans un domaine éligible, cadré entre 3 000 EUR et 25 000 EUR hors TVA.',
      ],
      caveat:
        'Ces montants sont indicatifs. L’aide réelle dépend de votre éligibilité et de l’approbation du Ministère de l’Économie. Le SME Package rembourse 70 % après la livraison du projet : vous payez d’abord le prestataire, puis votre entreprise est remboursée.',
    },
    faqs: [
      { q: 'Qui est éligible ?', a: 'Les PME disposant d’une autorisation d’établissement luxembourgeoise et d’un siège social au Luxembourg, répondant aux critères de PME, pour un projet dans un domaine éligible cadré entre 3 000 EUR et 25 000 EUR hors TVA.' },
      { q: 'Combien vais-je récupérer ?', a: 'Le programme rembourse 70 % du coût éligible du projet. Un projet de 10 000 EUR représente environ 7 000 EUR remboursés, soit un coût net d’environ 3 000 EUR pour votre entreprise. Seuls 25 000 EUR de coût au maximum comptent pour l’aide.' },
      { q: 'Quand est-ce que je reçois l’aide ?', a: 'Après la livraison du projet. Votre entreprise paie d’abord le prestataire, puis le Ministère de l’Économie rembourse 70 %. C’est un remboursement, pas un paiement initial.' },
      { q: 'Que peut-il financer ?', a: 'Les domaines éligibles incluent la création de site web et d’e-commerce, le marketing digital et social, les initiatives IA, les systèmes de gestion et ERP, et la facturation électronique, parmi d’autres comme l’expérience client, la transition énergétique et la cybersécurité.' },
      { q: 'Garantissez-vous l’approbation ?', a: 'Non. Aucun prestataire ne peut garantir une aide, car c’est le Ministère de l’Économie qui décide. Ce que nous faisons, c’est n’accepter que des projets que nous estimons éligibles, et vous aider à préparer une demande propre.' },
    ],
  },
  de: {
    officialUrl: OFFICIAL_URL,
    hero: {
      kicker: 'SME Package · Luxemburg',
      lead: 'Eine luxemburgische staatliche Förderung deckt 70 % Ihres Digital- oder KI-Projekts ab, von 3.000 EUR bis 25.000 EUR. Wir planen es, bauen es und helfen Ihnen, es zu beantragen.',
    },
    what: {
      kicker: 'Was es ist',
      title: 'Staatliche Förderung für Luxemburger KMU',
      accent: 'Förderung',
      body: [
        'Das SME Package ist ein luxemburgisches staatliches Förderprogramm, das vom Wirtschaftsministerium betrieben und mit Luxinnovation entwickelt wurde und seit 2019 besteht. Es erstattet 70 % der förderfähigen Kosten eines qualifizierenden Projekts.',
        'Förderfähige Projekte reichen von 3.000 EUR bis 25.000 EUR ohne Mehrwertsteuer. Sie stehen KMU mit einer luxemburgischen Niederlassungsgenehmigung und einem eingetragenen Sitz in Luxemburg offen, die die KMU-Kriterien erfüllen. Openletz ist der förderfähige Dienstleister: Sie erhalten die Förderung, nicht wir.',
      ],
    },
    categories: [
      { title: 'Website & E-Commerce', desc: 'Erstellung einer Website oder eines Onlineshops, gebaut, um zu konvertieren und zu bestehen.' },
      { title: 'Digital- & Social-Marketing', desc: 'Digitales Marketing und Social-Präsenz, die Ihre Arbeit sichtbar machen.' },
      { title: 'KI-Initiativen', desc: 'KI-Agenten, Chatbots und Automatisierungen, angewandt auf Ihren realen Betrieb.' },
      { title: 'Managementsysteme / ERP', desc: 'ERP, Unternehmenssoftware und Kassensysteme, die zu Ihrer Arbeitsweise passen.' },
      { title: 'E-Rechnung', desc: 'Elektronische Rechnungsstellung sauber eingerichtet und bereit für die Anforderungen.' },
    ],
    steps: [
      { n: '01', title: 'Voranalyse', desc: 'Eine erste Analyse mit der House of Entrepreneurship oder der Handwerkskammer, um die Eignung zu bestätigen.' },
      { n: '02', title: 'Definieren & anbieten', desc: 'Wir definieren das Paket gemeinsam und erstellen ein Angebot zwischen 3.000 EUR und 25.000 EUR.' },
      { n: '03', title: 'Antrag', desc: 'Der Antrag wird eingereicht, und das Wirtschaftsministerium entscheidet über die Förderung.' },
      { n: '04', title: 'Wir bauen es', desc: 'Nach Genehmigung setzt Openletz das Projekt wie geplant um.' },
      { n: '05', title: 'Sie holen sich 70 % zurück', desc: 'Nach Abschluss zahlen Sie den Dienstleister, dann erstattet das Ministerium 70 % an Ihr Unternehmen.' },
    ],
    bonus: [
      { title: 'Die Formalitäten, mit Ihnen erledigt', desc: 'Wir helfen, den Antrag und die Unterlagen vorzubereiten, damit der Prozess nicht allein auf Ihnen lastet.' },
      { title: 'Wir planen, was förderfähig ist', desc: 'Wir übernehmen nur Projekte, die unserer Einschätzung nach zum Programm passen, damit Ihr Antrag auf solider Grundlage steht. Eine Genehmigung versprechen wir nie.' },
      { title: 'Alles gehört Ihnen', desc: 'Die Website, der Code, die Automatisierungen, die Konten: Alles, was wir bauen, gehört Ihnen.' },
    ],
    eligibility: {
      points: [
        'Ein KMU mit einer luxemburgischen Niederlassungsgenehmigung.',
        'Ein eingetragener Sitz in Luxemburg.',
        'Erfüllung der KMU-Kriterien (Personal- und Finanzschwellen).',
        'Ein definiertes Projekt in einem förderfähigen Bereich, geplant zwischen 3.000 EUR und 25.000 EUR ohne MwSt.',
      ],
      caveat:
        'Diese Zahlen sind indikativ. Die tatsächliche Förderung hängt von Ihrer Förderfähigkeit und der Genehmigung durch das Wirtschaftsministerium ab. Das SME Package erstattet 70 % nach Lieferung des Projekts: Sie zahlen zuerst den Dienstleister, dann wird Ihr Unternehmen erstattet.',
    },
    faqs: [
      { q: 'Wer ist förderfähig?', a: 'KMU mit einer luxemburgischen Niederlassungsgenehmigung und einem eingetragenen Sitz in Luxemburg, die die KMU-Kriterien erfüllen, für ein Projekt in einem förderfähigen Bereich, geplant zwischen 3.000 EUR und 25.000 EUR ohne Mehrwertsteuer.' },
      { q: 'Wie viel bekomme ich zurück?', a: 'Das Programm erstattet 70 % der förderfähigen Projektkosten. Ein Projekt über 10.000 EUR bedeutet etwa 7.000 EUR zurück, sodass es Ihr Unternehmen netto rund 3.000 EUR kostet. Nur bis zu 25.000 EUR Kosten zählen für die Förderung.' },
      { q: 'Wann erhalte ich die Förderung?', a: 'Nach Lieferung des Projekts. Ihr Unternehmen zahlt zuerst den Dienstleister, dann erstattet das Wirtschaftsministerium 70 %. Es ist eine Erstattung, keine Vorauszahlung.' },
      { q: 'Was kann es fördern?', a: 'Förderfähige Bereiche umfassen die Erstellung von Website und E-Commerce, Digital- und Social-Marketing, KI-Initiativen, Managementsysteme und ERP sowie E-Rechnung, neben weiteren wie Kundenerlebnis, Energiewende und Cybersicherheit.' },
      { q: 'Garantieren Sie die Genehmigung?', a: 'Nein. Kein Dienstleister kann eine Förderung garantieren, da das Wirtschaftsministerium entscheidet. Wir übernehmen nur Projekte, die unserer Einschätzung nach förderfähig sind, und helfen Ihnen, einen sauberen Antrag vorzubereiten.' },
    ],
  },
};

const PARSED_SME_PACKAGE: Record<Locale, SmePackageContent> = {
  en: SmePackageContentSchema.parse(SME_PACKAGE_I18N.en),
  fr: SmePackageContentSchema.parse(SME_PACKAGE_I18N.fr),
  de: SmePackageContentSchema.parse(SME_PACKAGE_I18N.de),
};

/** Active-locale SME Package content. */
export function getSmePackage(locale: Locale): SmePackageContent {
  return PARSED_SME_PACKAGE[locale];
}

// EN constant kept as the default.
export const SME_PACKAGE: SmePackageContent = PARSED_SME_PACKAGE.en;
