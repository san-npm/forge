import type { Locale } from '@/lib/site-config';

/**
 * Centralized, typed UI / page-chrome strings per locale. These are the inline
 * labels, kickers, section headings, FAQ Q&As and button copy that live in the
 * page/section JSX (not in the content data modules). One typed object per
 * locale keeps the strings type-safe and lets pages select by active locale via
 * getUiStrings(locale). EN is the source of truth; FR/DE are professional
 * Luxembourg-business translations. No em-dashes anywhere.
 */
export interface UiStrings {
  hero: {
    kicker: string;
    capabilities: string[];
    marqueeLabel: string;
  };
  sections: {
    proofStripLabel: string;
    servicesKicker: string;
    servicesTitle: string;
    servicesAccent: string;
    servicesSubhead: string;
    processKicker: string;
    processTitle: string;
    processAccent: string;
    processSubhead: string;
    selectedWorkKicker: string;
    selectedWorkTitle: string;
    selectedWorkAccent: string;
    selectedWorkSubhead: string;
    allWork: string;
    trustKicker: string;
    trustHeadline: string;
    enquiryKicker: string;
    enquiryTitle: string;
    enquiryAccent: string;
    bookCall: string;
  };
  common: {
    startProject: string;
    seeOurWork: string;
    questionsAnsweredPre: string;
    questionsAnsweredAccent: string;
    faqKicker: string;
    visit: string;
    read: string;
    backToWork: string;
    visitLiveSite: string;
    wantOneLikeThis: string;
    wantOneLikeThisAccent: string;
    closingBuildLead: string;
  };
  kindLabels: Record<string, string>;
  pillarLabels: Record<string, string>;
  enquiryForm: {
    name: string;
    email: string;
    companySize: string;
    pillar: string;
    budget: string;
    message: string;
    choose: string;
    submit: string;
    sending: string;
    success: string;
    invalid: string;
    generalError: string;
    networkError: string;
  };
  newsletter: {
    email: string;
    subscribe: string;
    subscribed: string;
    already: string;
    invalid: string;
    error: string;
    networkError: string;
  };
  nav: {
    changeLanguage: string;
    home: string;
  };
  services: {
    heroKicker: string;
    heroTitleA: string;
    heroTitleAccent: string;
    heroTitleB: string;
    heroLead: string;
    fundingLead: string;
    seeSmePackage: string;
    faqs: { q: string; a: string }[];
  };
  pricing: {
    heroKicker: string;
    heroTitleA: string;
    heroTitleAccent: string;
    heroTitleB: string;
    fundingLead: string;
    seeSmePackage: string;
    mostPopular: string;
    faqs: { q: string; a: string }[];
    closingTitle: string;
    closingTitleAccent: string;
    closingLead: string;
  };
  about: {
    heroKicker: string;
    heroTitleA: string;
    heroTitleAccent: string;
    heroTitleB: string;
    placeholderCaption: string;
    euKicker: string;
    closingTitle: string;
    closingTitleAccent: string;
  };
  work: {
    kicker: string;
    titleA: string;
    titleAccent: string;
    lead: string;
    filterLabel: string;
    filters: { all: string; ai: string; web: string; web3: string; growth: string };
  };
  caseStudy: {
    problem: string;
    process: string;
    result: string;
    pending: string;
    closingLead: string;
  };
  contact: {
    kicker: string;
    titleA: string;
    titleAccent: string;
    bookCall: string;
    orEmail: string;
  };
  audit: {
    kicker: string;
    titleA: string;
    titleAccent: string;
    titleB: string;
    metaTitle: string;
    metaDescription: string;
    lead: string;
    urlLabel: string;
    placeholder: string;
    run: string;
    checking: string;
    grade: string;
    fixWithUs: string;
    genericError: string;
    faqs: { q: string; a: string }[];
  };
  sme: {
    simulator: {
      projectBudget: string;
      budgetAria: string;
      sliderAria: string;
      stateGrant: string;
      yourNetCost: string;
      /** aria-label template for the split bar; {grant}/{net} are percentages. */
      splitAriaTemplate: string;
      grantLabel: string;
      youLabel: string;
      capNote: string;
      minNote: string;
      caveat: string;
      officialDetails: string;
    };
    heroTitleA: string;
    heroTitleAccent: string;
    heroTitleB: string;
    whatTitleA: string;
    whatTitleAccent: string;
    whatTitleB: string;
    catKicker: string;
    catTitleA: string;
    catTitleAccent: string;
    catTitleB: string;
    stepsKicker: string;
    stepsTitleA: string;
    stepsTitleAccent: string;
    bonusKicker: string;
    bonusTitleA: string;
    bonusTitleAccent: string;
    eligibilityKicker: string;
    eligibilityTitle: string;
    honestPart: string;
    readOfficial: string;
    closingTitleA: string;
    closingTitleAccent: string;
    closingLead: string;
  };
  insights: {
    metaTitle: string;
    metaDescription: string;
    kicker: string;
    titleA: string;
    titleAccent: string;
    lead: string;
    noPosts: string;
    latest: string;
    backToInsights: string;
    by: string;
    readerKicker: string;
  };
}

const EN: UiStrings = {
  hero: {
    kicker: 'Luxembourg AI studio',
    capabilities: ['AI AGENTS', 'AUTOMATION', 'CHATBOTS', 'WEB & SHOPS', 'WEB3', 'ON-CHAIN', 'GROWTH'],
    marqueeLabel: 'What we build',
  },
  sections: {
    proofStripLabel: 'Shipped & live',
    servicesKicker: 'What we do',
    servicesTitle: 'Three Ways We Build',
    servicesAccent: 'Build',
    servicesSubhead: 'AI agents and automation lead. Digital and growth carry it. Web3 adds depth when it helps.',
    processKicker: 'The process',
    processTitle: 'How We Work',
    processAccent: 'Work',
    processSubhead: 'A short, honest path from idea to something live you can measure.',
    selectedWorkKicker: 'Our work',
    selectedWorkTitle: 'Selected Work',
    selectedWorkAccent: 'Work',
    selectedWorkSubhead: 'Real products we designed, built and shipped, plus the brands we help grow.',
    allWork: 'All work',
    trustKicker: 'Where we stand',
    trustHeadline: 'European by default.',
    enquiryKicker: 'Start a project',
    enquiryTitle: "Let's Build It",
    enquiryAccent: 'Build',
    bookCall: 'Book a 15-minute intro call',
  },
  common: {
    startProject: 'Start a project',
    seeOurWork: 'See our work',
    questionsAnsweredPre: 'Questions, ',
    questionsAnsweredAccent: 'answered',
    faqKicker: 'FAQ',
    visit: 'Visit',
    read: 'Read',
    backToWork: 'Back to work',
    visitLiveSite: 'Visit the live site',
    wantOneLikeThis: 'Want one like this?',
    wantOneLikeThisAccent: 'this',
    closingBuildLead: 'Tell us what you want to build. We scope it, build it, and ship it.',
  },
  kindLabels: {
    'E-commerce': 'E-COMMERCE',
    'Our product': 'OUR PRODUCT',
    'AI assistant': 'AI ASSISTANT',
    'Web3 / DeFi': 'WEB3 · DEFI',
    'Growth & marketing': 'GROWTH · MARKETING',
  },
  pillarLabels: {
    'AI automation': 'AI automation',
    'Web3 / on-chain': 'Web3 / on-chain',
    'Website & growth': 'Website & growth',
    'Not sure yet': 'Not sure yet',
  },
  enquiryForm: {
    name: 'Name',
    email: 'Email',
    companySize: 'Company size',
    pillar: 'What can we help with (pillar)',
    budget: 'Budget',
    message: 'Tell us what you want to build (message)',
    choose: 'Choose…',
    submit: 'Start a project',
    sending: 'Sending…',
    success: "Thanks, we've got it. We reply within one business day.",
    invalid: 'Please enter your name and a valid email.',
    generalError: 'Something went wrong. Please try again.',
    networkError: 'Network error. Please try again.',
  },
  newsletter: {
    email: 'Email',
    subscribe: 'Subscribe',
    subscribed: 'Subscribed, thanks.',
    already: "You're already subscribed, thanks.",
    invalid: 'Please enter a valid email.',
    error: 'Something went wrong.',
    networkError: 'Network error. Please try again.',
  },
  nav: {
    changeLanguage: 'Change language',
    home: 'Openletz home',
  },
  services: {
    heroKicker: 'What we do',
    heroTitleA: 'One studio, three ways ',
    heroTitleAccent: 'in',
    heroTitleB: '.',
    heroLead: 'AI agents and automation are the front door. Websites and growth carry it all. Web3 when it helps.',
    fundingLead: 'Up to 70% of your project can be state funded.',
    seeSmePackage: 'See the SME Package.',
    faqs: [
      {
        q: 'Do I have to use all three?',
        a: 'No. AI is the usual front door; we add growth and Web3 only when they help.',
      },
      {
        q: 'Where does my data live?',
        a: 'In Europe. We choose tools with GDPR and the EU AI Act in mind and can deploy on EU or Aleph-hosted infrastructure.',
      },
    ],
  },
  pricing: {
    heroKicker: 'Pricing',
    heroTitleA: 'A fixed ',
    heroTitleAccent: 'quote',
    heroTitleB: ', up front.',
    fundingLead: 'Most projects qualify for 70% state co-funding.',
    seeSmePackage: 'See the SME Package.',
    mostPopular: 'Most popular',
    faqs: [
      {
        q: 'Why no public prices?',
        a: 'Because honest scoping beats a number that fits nobody. You tell us what you want to build, we scope it, and every project gets a fixed quote up front.',
      },
      {
        q: 'Can my project be co-funded?',
        a: 'If you are based in Luxembourg, most projects qualify for 70% state co-funding through the SME Package, and we help with the paperwork.',
      },
    ],
    closingTitle: 'Tell us what you want to build.',
    closingTitleAccent: 'build',
    closingLead: 'We scope it, quote it up front, and ship it.',
  },
  about: {
    heroKicker: 'About',
    heroTitleA: 'One studio. One person you ',
    heroTitleAccent: 'talk',
    heroTitleB: ' to.',
    placeholderCaption: 'Commit Media · Luxembourg',
    euKicker: 'European by default',
    closingTitle: 'Work with me directly.',
    closingTitleAccent: 'directly',
  },
  work: {
    kicker: 'Selected work',
    titleA: 'Selected ',
    titleAccent: 'work',
    lead: 'Real products we designed, built and shipped, plus the brands we help grow. Filter by what you are building.',
    filterLabel: 'Filter work by type',
    filters: { all: 'All', ai: 'AI', web: 'Web', web3: 'Web3', growth: 'Growth' },
  },
  caseStudy: {
    problem: 'Problem',
    process: 'Process',
    result: 'Result',
    pending: 'pending',
    closingLead: 'Tell us what you want to build. We scope it, build it, and ship it.',
  },
  contact: {
    kicker: 'Contact',
    titleA: 'Start a ',
    titleAccent: 'project',
    bookCall: 'Book a 15-minute intro call',
    orEmail: 'Or email',
  },
  audit: {
    kicker: 'Free readiness check',
    titleA: 'Is your site ready for ',
    titleAccent: 'AI',
    titleB: '?',
    metaTitle: 'Free AI & web readiness audit · Openletz',
    metaDescription:
      'Check your site against the signals AI assistants and search engines look for. Concrete results in seconds, free.',
    lead: 'AI assistants and search engines read your site differently than people do. Run a free check against the signals they look for: HTTPS, metadata, structured data, llms.txt, and whether your content is in the static HTML at all. You get concrete results in seconds.',
    urlLabel: 'Website URL',
    placeholder: 'yourdomain.com',
    run: 'Run the audit',
    checking: 'Checking...',
    grade: 'Grade',
    fixWithUs: 'Fix this with us',
    genericError: 'Something went wrong. Please try again.',
    faqs: [
      {
        q: 'What does the audit check?',
        a: 'HTTPS, title and meta tags, headings, structured data, llms.txt, sitemap, and whether your content is in the static HTML AI crawlers read.',
      },
      {
        q: 'Is it really free?',
        a: 'Yes. It runs server-side in a few seconds. If you want help fixing what it finds, that is where we come in.',
      },
    ],
  },
  sme: {
    simulator: {
      projectBudget: 'Project budget',
      budgetAria: 'Project budget in euros',
      sliderAria: 'Project budget slider',
      stateGrant: 'State grant',
      yourNetCost: 'Your net cost',
      splitAriaTemplate: '{grant} percent state grant, {net} percent your net cost',
      grantLabel: 'Grant',
      youLabel: 'You',
      capNote: 'Eligible costs are capped at EUR 25,000. Above that, only EUR 25,000 counts toward the grant.',
      minNote: 'The minimum eligible project is EUR 3,000.',
      caveat:
        'Indicative estimate. Actual aid depends on your eligibility and Ministry of the Economy approval. The SME Package reimburses 70% after the project is delivered.',
      officialDetails: 'Official programme details',
    },
    heroTitleA: 'Get ',
    heroTitleAccent: '70%',
    heroTitleB: ' of your project funded.',
    whatTitleA: 'State ',
    whatTitleAccent: 'aid',
    whatTitleB: ' for Luxembourg SMEs',
    catKicker: 'What it can fund',
    catTitleA: 'Where the ',
    catTitleAccent: '70%',
    catTitleB: ' applies',
    stepsKicker: 'How it works',
    stepsTitleA: 'From idea to ',
    stepsTitleAccent: 'reimbursement',
    bonusKicker: 'What Openletz adds',
    bonusTitleA: 'Not just the ',
    bonusTitleAccent: 'build',
    eligibilityKicker: 'Who qualifies',
    eligibilityTitle: 'Eligibility',
    honestPart: 'The honest part',
    readOfficial: 'Read the official programme',
    closingTitleA: 'Let us scope a project that ',
    closingTitleAccent: 'qualifies',
    closingLead:
      'Tell us what you want to build. We will scope it to fit the programme, help with the application, and build it.',
  },
  insights: {
    metaTitle: 'Insights · Openletz',
    metaDescription:
      'Notes from a Luxembourg AI studio: AI automation, AEO and GEO, the EU AI Act, state funding, and shipping real products.',
    kicker: 'Insights / Notes from a Luxembourg AI studio',
    titleA: 'Field ',
    titleAccent: 'notes',
    lead: 'What we are building, what we are learning, and how to make it pay.',
    noPosts: 'New posts are on the way.',
    latest: 'Latest',
    backToInsights: 'Back to insights',
    by: 'By',
    readerKicker: 'Insights',
  },
};

const FR: UiStrings = {
  hero: {
    kicker: 'Studio IA luxembourgeois',
    capabilities: ['AGENTS IA', 'AUTOMATISATION', 'CHATBOTS', 'SITES & BOUTIQUES', 'WEB3', 'ON-CHAIN', 'CROISSANCE'],
    marqueeLabel: 'Ce que nous construisons',
  },
  sections: {
    proofStripLabel: 'Livré & en ligne',
    servicesKicker: 'Ce que nous faisons',
    servicesTitle: 'Trois façons de construire',
    servicesAccent: 'construire',
    servicesSubhead: 'Les agents IA et l’automatisation mènent. Le digital et la croissance portent. Le Web3 apporte de la profondeur quand il aide.',
    processKicker: 'La méthode',
    processTitle: 'Comment nous travaillons',
    processAccent: 'travaillons',
    processSubhead: 'Un chemin court et honnête, de l’idée à quelque chose en ligne et mesurable.',
    selectedWorkKicker: 'Nos réalisations',
    selectedWorkTitle: 'Réalisations choisies',
    selectedWorkAccent: 'choisies',
    selectedWorkSubhead: 'De vrais produits que nous avons conçus, développés et livrés, et les marques que nous faisons grandir.',
    allWork: 'Toutes les réalisations',
    trustKicker: 'Notre position',
    trustHeadline: 'Européen par défaut.',
    enquiryKicker: 'Démarrer un projet',
    enquiryTitle: 'Construisons-le',
    enquiryAccent: 'Construisons-le',
    bookCall: 'Réserver un appel de 15 minutes',
  },
  common: {
    startProject: 'Démarrer un projet',
    seeOurWork: 'Voir nos réalisations',
    questionsAnsweredPre: 'Vos questions, nos ',
    questionsAnsweredAccent: 'réponses',
    faqKicker: 'FAQ',
    visit: 'Visiter',
    read: 'Lire',
    backToWork: 'Retour aux réalisations',
    visitLiveSite: 'Voir le site en ligne',
    wantOneLikeThis: 'Vous en voulez un comme ça ?',
    wantOneLikeThisAccent: 'ça',
    closingBuildLead: 'Dites-nous ce que vous voulez construire. Nous le cadrons, le développons et le livrons.',
  },
  kindLabels: {
    'E-commerce': 'E-COMMERCE',
    'Notre produit': 'NOTRE PRODUIT',
    'Assistant IA': 'ASSISTANT IA',
    'Web3 / DeFi': 'WEB3 · DEFI',
    'Croissance & marketing': 'CROISSANCE · MARKETING',
  },
  pillarLabels: {
    'AI automation': 'Automatisation IA',
    'Web3 / on-chain': 'Web3 / on-chain',
    'Website & growth': 'Site web & croissance',
    'Not sure yet': 'Je ne sais pas encore',
  },
  enquiryForm: {
    name: 'Nom',
    email: 'E-mail',
    companySize: 'Taille de l’entreprise',
    pillar: 'En quoi pouvons-nous aider (domaine)',
    budget: 'Budget',
    message: 'Dites-nous ce que vous voulez construire (message)',
    choose: 'Choisir…',
    submit: 'Démarrer un projet',
    sending: 'Envoi…',
    success: 'Merci, c’est bien reçu. Nous répondons sous un jour ouvré.',
    invalid: 'Veuillez indiquer votre nom et un e-mail valide.',
    generalError: 'Une erreur est survenue. Veuillez réessayer.',
    networkError: 'Erreur réseau. Veuillez réessayer.',
  },
  newsletter: {
    email: 'E-mail',
    subscribe: 'S’abonner',
    subscribed: 'Inscrit, merci.',
    already: 'Vous êtes déjà inscrit, merci.',
    invalid: 'Veuillez saisir un e-mail valide.',
    error: 'Une erreur est survenue.',
    networkError: 'Erreur réseau. Veuillez réessayer.',
  },
  nav: {
    changeLanguage: 'Changer de langue',
    home: 'Accueil Openletz',
  },
  services: {
    heroKicker: 'Ce que nous faisons',
    heroTitleA: 'Un studio, trois portes d’',
    heroTitleAccent: 'entrée',
    heroTitleB: '.',
    heroLead: 'Les agents IA et l’automatisation sont la porte d’entrée. Les sites et la croissance portent le tout. Le Web3 quand il aide.',
    fundingLead: 'Jusqu’à 70 % de votre projet peut être financé par l’État.',
    seeSmePackage: 'Découvrir le SME Package.',
    faqs: [
      {
        q: 'Dois-je utiliser les trois ?',
        a: 'Non. L’IA est la porte d’entrée habituelle ; nous ajoutons la croissance et le Web3 uniquement quand ils apportent.',
      },
      {
        q: 'Où sont hébergées mes données ?',
        a: 'En Europe. Nous choisissons des outils pensés pour le RGPD et le règlement européen sur l’IA, et pouvons déployer sur une infrastructure européenne ou hébergée par Aleph.',
      },
    ],
  },
  pricing: {
    heroKicker: 'Tarifs',
    heroTitleA: 'Un ',
    heroTitleAccent: 'devis',
    heroTitleB: ' fixe, en amont.',
    fundingLead: 'La plupart des projets sont éligibles à 70 % de cofinancement de l’État.',
    seeSmePackage: 'Découvrir le SME Package.',
    mostPopular: 'Le plus demandé',
    faqs: [
      {
        q: 'Pourquoi pas de prix publics ?',
        a: 'Parce qu’un cadrage honnête vaut mieux qu’un chiffre qui ne convient à personne. Vous nous dites ce que vous voulez construire, nous le cadrons, et chaque projet reçoit un devis fixe en amont.',
      },
      {
        q: 'Mon projet peut-il être cofinancé ?',
        a: 'Si vous êtes basé au Luxembourg, la plupart des projets sont éligibles à 70 % de cofinancement de l’État via le SME Package, et nous vous aidons avec les démarches.',
      },
    ],
    closingTitle: 'Dites-nous ce que vous voulez construire.',
    closingTitleAccent: 'construire',
    closingLead: 'Nous le cadrons, le chiffrons en amont, et le livrons.',
  },
  about: {
    heroKicker: 'À propos',
    heroTitleA: 'Un studio. Une seule personne à qui ',
    heroTitleAccent: 'parler',
    heroTitleB: '.',
    placeholderCaption: 'Commit Media · Luxembourg',
    euKicker: 'Européen par défaut',
    closingTitle: 'Travaillez avec moi directement.',
    closingTitleAccent: 'directement',
  },
  work: {
    kicker: 'Réalisations choisies',
    titleA: 'Réalisations ',
    titleAccent: 'choisies',
    lead: 'De vrais produits que nous avons conçus, développés et livrés, et les marques que nous faisons grandir. Filtrez selon ce que vous construisez.',
    filterLabel: 'Filtrer les réalisations par type',
    filters: { all: 'Tout', ai: 'IA', web: 'Web', web3: 'Web3', growth: 'Croissance' },
  },
  caseStudy: {
    problem: 'Problème',
    process: 'Démarche',
    result: 'Résultat',
    pending: 'à venir',
    closingLead: 'Dites-nous ce que vous voulez construire. Nous le cadrons, le développons et le livrons.',
  },
  contact: {
    kicker: 'Contact',
    titleA: 'Démarrer un ',
    titleAccent: 'projet',
    bookCall: 'Réserver un appel de 15 minutes',
    orEmail: 'Ou écrivez à',
  },
  audit: {
    kicker: 'Diagnostic gratuit',
    titleA: 'Votre site est-il prêt pour l’',
    titleAccent: 'IA',
    titleB: ' ?',
    metaTitle: 'Audit gratuit de visibilité IA & web · Openletz',
    metaDescription:
      'Évaluez votre site face aux signaux que recherchent les assistants IA et les moteurs de recherche. Des résultats concrets en quelques secondes, gratuitement.',
    lead: 'Les assistants IA et les moteurs de recherche lisent votre site autrement que les humains. Lancez un diagnostic gratuit sur les signaux qu’ils recherchent : HTTPS, métadonnées, données structurées, llms.txt, et la présence de votre contenu dans le HTML statique. Vous obtenez des résultats concrets en quelques secondes.',
    urlLabel: 'URL du site',
    placeholder: 'votredomaine.com',
    run: 'Lancer l’audit',
    checking: 'Analyse en cours...',
    grade: 'Note',
    fixWithUs: 'Corriger avec nous',
    genericError: 'Une erreur est survenue. Veuillez réessayer.',
    faqs: [
      {
        q: 'Que vérifie l’audit ?',
        a: 'HTTPS, balises title et meta, titres, données structurées, llms.txt, sitemap, et la présence de votre contenu dans le HTML statique que lisent les robots IA.',
      },
      {
        q: 'Est-ce vraiment gratuit ?',
        a: 'Oui. Il s’exécute côté serveur en quelques secondes. Si vous voulez de l’aide pour corriger ce qu’il trouve, c’est là que nous intervenons.',
      },
    ],
  },
  sme: {
    simulator: {
      projectBudget: 'Budget du projet',
      budgetAria: 'Budget du projet en euros',
      sliderAria: 'Curseur du budget du projet',
      stateGrant: 'Aide de l’État',
      yourNetCost: 'Votre coût net',
      splitAriaTemplate: '{grant} pour cent d’aide de l’État, {net} pour cent à votre charge',
      grantLabel: 'Aide',
      youLabel: 'Vous',
      capNote: 'Les coûts éligibles sont plafonnés à 25 000 EUR. Au-delà, seuls 25 000 EUR comptent pour l’aide.',
      minNote: 'Le projet minimum éligible est de 3 000 EUR.',
      caveat:
        'Estimation indicative. L’aide réelle dépend de votre éligibilité et de l’approbation du Ministère de l’Économie. Le SME Package rembourse 70 % après la livraison du projet.',
      officialDetails: 'Détails officiels du programme',
    },
    heroTitleA: 'Faites financer ',
    heroTitleAccent: '70%',
    heroTitleB: ' de votre projet.',
    whatTitleA: 'Une ',
    whatTitleAccent: 'aide',
    whatTitleB: ' d’État pour les PME luxembourgeoises',
    catKicker: 'Ce qu’il peut financer',
    catTitleA: 'Où s’appliquent les ',
    catTitleAccent: '70%',
    catTitleB: '',
    stepsKicker: 'Comment ça marche',
    stepsTitleA: 'De l’idée au ',
    stepsTitleAccent: 'remboursement',
    bonusKicker: 'Ce qu’Openletz apporte en plus',
    bonusTitleA: 'Pas seulement le ',
    bonusTitleAccent: 'développement',
    eligibilityKicker: 'Qui est éligible',
    eligibilityTitle: 'Éligibilité',
    honestPart: 'En toute transparence',
    readOfficial: 'Lire le programme officiel',
    closingTitleA: 'Cadrons ensemble un projet qui ',
    closingTitleAccent: 'qualifie',
    closingLead:
      'Dites-nous ce que vous voulez construire. Nous le cadrerons pour qu’il entre dans le programme, vous aiderons avec la demande, et le développerons.',
  },
  insights: {
    metaTitle: 'Insights · Openletz',
    metaDescription:
      'Notes d’un studio IA luxembourgeois : automatisation IA, AEO et GEO, règlement européen sur l’IA, aides d’État et livraison de vrais produits.',
    kicker: 'Insights / Notes d’un studio IA luxembourgeois',
    titleA: 'Notes de ',
    titleAccent: 'terrain',
    lead: 'Ce que nous construisons, ce que nous apprenons, et comment le rentabiliser.',
    noPosts: 'De nouveaux articles arrivent bientôt.',
    latest: 'Dernier',
    backToInsights: 'Retour aux insights',
    by: 'Par',
    readerKicker: 'Insights',
  },
};

const DE: UiStrings = {
  hero: {
    kicker: 'Luxemburger KI-Studio',
    capabilities: ['KI-AGENTEN', 'AUTOMATISIERUNG', 'CHATBOTS', 'WEBSITES & SHOPS', 'WEB3', 'ON-CHAIN', 'WACHSTUM'],
    marqueeLabel: 'Was wir bauen',
  },
  sections: {
    proofStripLabel: 'Geliefert & live',
    servicesKicker: 'Was wir tun',
    servicesTitle: 'Drei Wege, zu bauen',
    servicesAccent: 'bauen',
    servicesSubhead: 'KI-Agenten und Automatisierung führen. Digital und Wachstum tragen. Web3 schafft Tiefe, wo es hilft.',
    processKicker: 'Der Ablauf',
    processTitle: 'Wie wir arbeiten',
    processAccent: 'arbeiten',
    processSubhead: 'Ein kurzer, ehrlicher Weg von der Idee zu etwas Live-Messbarem.',
    selectedWorkKicker: 'Unsere Arbeiten',
    selectedWorkTitle: 'Ausgewählte Arbeiten',
    selectedWorkAccent: 'Arbeiten',
    selectedWorkSubhead: 'Echte Produkte, die wir gestaltet, gebaut und geliefert haben, dazu die Marken, die wir wachsen lassen.',
    allWork: 'Alle Arbeiten',
    trustKicker: 'Wofür wir stehen',
    trustHeadline: 'Europäisch von Haus aus.',
    enquiryKicker: 'Projekt starten',
    enquiryTitle: 'Bauen wir es',
    enquiryAccent: 'Bauen',
    bookCall: 'Ein 15-minütiges Kennenlerngespräch buchen',
  },
  common: {
    startProject: 'Projekt starten',
    seeOurWork: 'Unsere Arbeiten ansehen',
    questionsAnsweredPre: 'Fragen, ',
    questionsAnsweredAccent: 'beantwortet',
    faqKicker: 'FAQ',
    visit: 'Besuchen',
    read: 'Lesen',
    backToWork: 'Zurück zu den Arbeiten',
    visitLiveSite: 'Die Live-Website besuchen',
    wantOneLikeThis: 'Wollen Sie so eines?',
    wantOneLikeThisAccent: 'so',
    closingBuildLead: 'Sagen Sie uns, was Sie bauen möchten. Wir planen es, bauen es und liefern es.',
  },
  kindLabels: {
    'E-Commerce': 'E-COMMERCE',
    'Unser Produkt': 'UNSER PRODUKT',
    'KI-Assistent': 'KI-ASSISTENT',
    'Web3 / DeFi': 'WEB3 · DEFI',
    'Wachstum & Marketing': 'WACHSTUM · MARKETING',
  },
  pillarLabels: {
    'AI automation': 'KI-Automatisierung',
    'Web3 / on-chain': 'Web3 / On-Chain',
    'Website & growth': 'Website & Wachstum',
    'Not sure yet': 'Noch unsicher',
  },
  enquiryForm: {
    name: 'Name',
    email: 'E-Mail',
    companySize: 'Unternehmensgröße',
    pillar: 'Womit können wir helfen (Bereich)',
    budget: 'Budget',
    message: 'Sagen Sie uns, was Sie bauen möchten (Nachricht)',
    choose: 'Auswählen…',
    submit: 'Projekt starten',
    sending: 'Senden…',
    success: 'Danke, wir haben es. Wir antworten innerhalb eines Werktags.',
    invalid: 'Bitte geben Sie Ihren Namen und eine gültige E-Mail an.',
    generalError: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    networkError: 'Netzwerkfehler. Bitte versuchen Sie es erneut.',
  },
  newsletter: {
    email: 'E-Mail',
    subscribe: 'Abonnieren',
    subscribed: 'Abonniert, danke.',
    already: 'Sie sind bereits abonniert, danke.',
    invalid: 'Bitte geben Sie eine gültige E-Mail an.',
    error: 'Etwas ist schiefgelaufen.',
    networkError: 'Netzwerkfehler. Bitte versuchen Sie es erneut.',
  },
  nav: {
    changeLanguage: 'Sprache ändern',
    home: 'Openletz Startseite',
  },
  services: {
    heroKicker: 'Was wir tun',
    heroTitleA: 'Ein Studio, drei Wege ',
    heroTitleAccent: 'hinein',
    heroTitleB: '.',
    heroLead: 'KI-Agenten und Automatisierung sind die Eingangstür. Websites und Wachstum tragen alles. Web3, wenn es hilft.',
    fundingLead: 'Bis zu 70 % Ihres Projekts können staatlich gefördert werden.',
    seeSmePackage: 'Das SME Package ansehen.',
    faqs: [
      {
        q: 'Muss ich alle drei nutzen?',
        a: 'Nein. KI ist die übliche Eingangstür; Wachstum und Web3 fügen wir nur hinzu, wenn sie helfen.',
      },
      {
        q: 'Wo liegen meine Daten?',
        a: 'In Europa. Wir wählen Werkzeuge mit Blick auf DSGVO und EU-KI-Verordnung und können auf europäischer oder von Aleph gehosteter Infrastruktur deployen.',
      },
    ],
  },
  pricing: {
    heroKicker: 'Preise',
    heroTitleA: 'Ein festes ',
    heroTitleAccent: 'Angebot',
    heroTitleB: ', vorab.',
    fundingLead: 'Die meisten Projekte qualifizieren sich für 70 % staatliche Kofinanzierung.',
    seeSmePackage: 'Das SME Package ansehen.',
    mostPopular: 'Am beliebtesten',
    faqs: [
      {
        q: 'Warum keine öffentlichen Preise?',
        a: 'Weil ehrliche Planung besser ist als eine Zahl, die zu niemandem passt. Sie sagen uns, was Sie bauen möchten, wir planen es, und jedes Projekt erhält vorab ein festes Angebot.',
      },
      {
        q: 'Kann mein Projekt kofinanziert werden?',
        a: 'Wenn Sie in Luxemburg ansässig sind, qualifizieren sich die meisten Projekte für 70 % staatliche Kofinanzierung über das SME Package, und wir helfen bei den Formalitäten.',
      },
    ],
    closingTitle: 'Sagen Sie uns, was Sie bauen möchten.',
    closingTitleAccent: 'bauen',
    closingLead: 'Wir planen es, geben vorab ein Angebot und liefern es.',
  },
  about: {
    heroKicker: 'Über uns',
    heroTitleA: 'Ein Studio. Eine Person zum ',
    heroTitleAccent: 'Reden',
    heroTitleB: '.',
    placeholderCaption: 'Commit Media · Luxemburg',
    euKicker: 'Europäisch von Haus aus',
    closingTitle: 'Arbeiten Sie direkt mit mir.',
    closingTitleAccent: 'direkt',
  },
  work: {
    kicker: 'Ausgewählte Arbeiten',
    titleA: 'Ausgewählte ',
    titleAccent: 'Arbeiten',
    lead: 'Echte Produkte, die wir gestaltet, gebaut und geliefert haben, dazu die Marken, die wir wachsen lassen. Filtern Sie nach dem, was Sie bauen.',
    filterLabel: 'Arbeiten nach Typ filtern',
    filters: { all: 'Alle', ai: 'KI', web: 'Web', web3: 'Web3', growth: 'Wachstum' },
  },
  caseStudy: {
    problem: 'Problem',
    process: 'Vorgehen',
    result: 'Ergebnis',
    pending: 'ausstehend',
    closingLead: 'Sagen Sie uns, was Sie bauen möchten. Wir planen es, bauen es und liefern es.',
  },
  contact: {
    kicker: 'Kontakt',
    titleA: 'Ein Projekt ',
    titleAccent: 'starten',
    bookCall: 'Ein 15-minütiges Kennenlerngespräch buchen',
    orEmail: 'Oder schreiben Sie an',
  },
  audit: {
    kicker: 'Kostenloser Bereitschafts-Check',
    titleA: 'Ist Ihre Website bereit für ',
    titleAccent: 'KI',
    titleB: '?',
    metaTitle: 'Kostenloser KI- & Web-Bereitschafts-Audit · Openletz',
    metaDescription:
      'Prüfen Sie Ihre Website gegen die Signale, auf die KI-Assistenten und Suchmaschinen achten. Konkrete Ergebnisse in Sekunden, kostenlos.',
    lead: 'KI-Assistenten und Suchmaschinen lesen Ihre Website anders als Menschen. Starten Sie einen kostenlosen Check gegen die Signale, auf die sie achten: HTTPS, Metadaten, strukturierte Daten, llms.txt und ob Ihr Inhalt überhaupt im statischen HTML steht. Sie erhalten konkrete Ergebnisse in Sekunden.',
    urlLabel: 'Website-URL',
    placeholder: 'ihredomain.com',
    run: 'Audit starten',
    checking: 'Prüfung läuft...',
    grade: 'Note',
    fixWithUs: 'Mit uns beheben',
    genericError: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    faqs: [
      {
        q: 'Was prüft der Audit?',
        a: 'HTTPS, Title- und Meta-Tags, Überschriften, strukturierte Daten, llms.txt, Sitemap und ob Ihr Inhalt im statischen HTML steht, das KI-Crawler lesen.',
      },
      {
        q: 'Ist er wirklich kostenlos?',
        a: 'Ja. Er läuft serverseitig in wenigen Sekunden. Wenn Sie Hilfe brauchen, das Gefundene zu beheben, kommen wir ins Spiel.',
      },
    ],
  },
  sme: {
    simulator: {
      projectBudget: 'Projektbudget',
      budgetAria: 'Projektbudget in Euro',
      sliderAria: 'Schieberegler für das Projektbudget',
      stateGrant: 'Staatliche Förderung',
      yourNetCost: 'Ihre Nettokosten',
      splitAriaTemplate: '{grant} Prozent staatliche Förderung, {net} Prozent Ihre Nettokosten',
      grantLabel: 'Förderung',
      youLabel: 'Sie',
      capNote: 'Förderfähige Kosten sind auf 25.000 EUR begrenzt. Darüber zählen nur 25.000 EUR für die Förderung.',
      minNote: 'Das förderfähige Mindestprojekt beträgt 3.000 EUR.',
      caveat:
        'Indikative Schätzung. Die tatsächliche Förderung hängt von Ihrer Förderfähigkeit und der Genehmigung des Wirtschaftsministeriums ab. Das SME Package erstattet 70 % nach Lieferung des Projekts.',
      officialDetails: 'Offizielle Programmdetails',
    },
    heroTitleA: 'Lassen Sie ',
    heroTitleAccent: '70%',
    heroTitleB: ' Ihres Projekts fördern.',
    whatTitleA: 'Staatliche ',
    whatTitleAccent: 'Förderung',
    whatTitleB: ' für Luxemburger KMU',
    catKicker: 'Was es fördern kann',
    catTitleA: 'Wo die ',
    catTitleAccent: '70%',
    catTitleB: ' gelten',
    stepsKicker: 'So funktioniert es',
    stepsTitleA: 'Von der Idee zur ',
    stepsTitleAccent: 'Erstattung',
    bonusKicker: 'Was Openletz zusätzlich leistet',
    bonusTitleA: 'Nicht nur das ',
    bonusTitleAccent: 'Bauen',
    eligibilityKicker: 'Wer sich qualifiziert',
    eligibilityTitle: 'Förderfähigkeit',
    honestPart: 'Ehrlich gesagt',
    readOfficial: 'Das offizielle Programm lesen',
    closingTitleA: 'Lassen Sie uns ein Projekt planen, das sich ',
    closingTitleAccent: 'qualifiziert',
    closingLead:
      'Sagen Sie uns, was Sie bauen möchten. Wir planen es passend zum Programm, helfen bei der Antragstellung und bauen es.',
  },
  insights: {
    metaTitle: 'Insights · Openletz',
    metaDescription:
      'Notizen aus einem Luxemburger KI-Studio: KI-Automatisierung, AEO und GEO, die EU-KI-Verordnung, staatliche Förderung und das Liefern echter Produkte.',
    kicker: 'Insights / Notizen aus einem Luxemburger KI-Studio',
    titleA: 'Notizen aus dem ',
    titleAccent: 'Feld',
    lead: 'Was wir bauen, was wir lernen, und wie es sich rechnet.',
    noPosts: 'Neue Beiträge sind unterwegs.',
    latest: 'Neueste',
    backToInsights: 'Zurück zu den Insights',
    by: 'Von',
    readerKicker: 'Insights',
  },
};

const UI: Record<Locale, UiStrings> = { en: EN, fr: FR, de: DE };

/** Active-locale UI / page-chrome strings. */
export function getUiStrings(locale: Locale): UiStrings {
  return UI[locale];
}
