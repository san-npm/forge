export interface QuizAnswers {
  companySize: string
  sector: string
  hqLuxembourg: string
  businessPermit: string
  digitalMaturity: string
  biggestProblem: string
  aiUsage: string
  budget: string
}

export interface Program {
  id: string
  name: Record<string, string>
  description: Record<string, string>
  maxGrant: number
  coveragePercent: number
  eligible: boolean
}

export interface ProjectRecommendation {
  title: Record<string, string>
  description: Record<string, string>
  estimatedCost: number
  grantCoverage: number
  youPay: number
  programId: string
}

export function computeEligibility(answers: QuizAnswers): {
  eligible: boolean
  programs: Program[]
  projects: ProjectRecommendation[]
} {
  // Base eligibility: must be in Luxembourg with business permit
  const isBasicallyEligible =
    answers.hqLuxembourg === 'yes' && answers.businessPermit !== 'no'

  if (!isBasicallyEligible) {
    return { eligible: false, programs: [], projects: [] }
  }

  const programs: Program[] = []
  const projects: ProjectRecommendation[] = []

  const isSmall =
    answers.companySize === 'solo' ||
    answers.companySize === '1-10' ||
    answers.companySize === '11-50'

  const isMedium = answers.companySize === '51-250'
  const isSME = isSmall || isMedium

  const isLowDigital =
    answers.digitalMaturity === 'nothing' || answers.digitalMaturity === 'basic-site'

  const usesAI = answers.aiUsage === 'regularly'

  // SME Package Digital
  if (isSME && isLowDigital) {
    programs.push({
      id: 'sme-digital',
      name: { fr: 'SME Package — Digital', en: 'SME Package — Digital' },
      description: {
        fr: "Accompagnement à la digitalisation des PME. Diagnostic digital, plan d'action et mise en œuvre.",
        en: 'SME digitalization support. Digital assessment, action plan and implementation.',
      },
      maxGrant: 5000,
      coveragePercent: 50,
      eligible: true,
    })
  }

  // SME Package AI
  if (isSME) {
    programs.push({
      id: 'sme-ai',
      name: { fr: 'SME Package — IA', en: 'SME Package — AI' },
      description: {
        fr: "Intégration de solutions d'intelligence artificielle dans votre entreprise. Diagnostic IA + implémentation.",
        en: 'Integration of artificial intelligence solutions in your business. AI assessment + implementation.',
      },
      maxGrant: 17500,
      coveragePercent: 70,
      eligible: true,
    })
  }

  // Fit 4 Digital
  if (isSME && isLowDigital) {
    programs.push({
      id: 'fit4digital',
      name: { fr: 'Fit 4 Digital', en: 'Fit 4 Digital' },
      description: {
        fr: 'Programme intensif de transformation digitale. Audit complet + feuille de route + accompagnement à la mise en œuvre.',
        en: 'Intensive digital transformation program. Full audit + roadmap + implementation support.',
      },
      maxGrant: 12000,
      coveragePercent: 60,
      eligible: true,
    })
  }

  // Fit 4 AI
  if (isSME) {
    programs.push({
      id: 'fit4ai',
      name: { fr: 'Fit 4 AI', en: 'Fit 4 AI' },
      description: {
        fr: "Programme d'accompagnement IA avancé. De l'identification des cas d'usage à l'implémentation de solutions IA.",
        en: 'Advanced AI support program. From use case identification to AI solution implementation.',
      },
      maxGrant: 25000,
      coveragePercent: 70,
      eligible: true,
    })
  }

  // Fit 4 Innovation
  if (isSME || answers.companySize === '250+') {
    programs.push({
      id: 'fit4innovation',
      name: { fr: 'Fit 4 Innovation', en: 'Fit 4 Innovation' },
      description: {
        fr: "Programme d'innovation globale. Stratégie d'innovation, R&D, nouveaux produits et services.",
        en: 'Global innovation program. Innovation strategy, R&D, new products and services.',
      },
      maxGrant: 15000,
      coveragePercent: 50,
      eligible: true,
    })
  }

  // Generate project recommendations based on sector + problem
  const sector = answers.sector
  const problem = answers.biggestProblem

  if (problem === 'find-clients') {
    if (sector === 'horeca') {
      projects.push({
        title: {
          fr: 'Site web optimisé + Google Business + newsletter IA ciblée',
          en: 'Optimized website + Google Business + targeted AI newsletter',
        },
        description: {
          fr: 'Création d\'un site web professionnel, optimisation Google Business Profile pour la visibilité locale, et mise en place d\'une newsletter automatisée par IA ciblant les expats et touristes.',
          en: 'Professional website creation, Google Business Profile optimization for local visibility, and AI-automated newsletter targeting expats and tourists.',
        },
        estimatedCost: 6000,
        grantCoverage: 4200,
        youPay: 1800,
        programId: 'sme-ai',
      })
    } else if (sector === 'retail') {
      projects.push({
        title: {
          fr: 'E-commerce + campagnes publicitaires IA',
          en: 'E-commerce + AI advertising campaigns',
        },
        description: {
          fr: 'Boutique en ligne professionnelle avec gestion de stock intégrée + campagnes publicitaires optimisées par IA sur les réseaux sociaux.',
          en: 'Professional online store with integrated inventory management + AI-optimized social media advertising campaigns.',
        },
        estimatedCost: 8000,
        grantCoverage: 5600,
        youPay: 2400,
        programId: 'sme-ai',
      })
    } else {
      projects.push({
        title: {
          fr: 'Stratégie d\'acquisition digitale + CRM intelligent',
          en: 'Digital acquisition strategy + smart CRM',
        },
        description: {
          fr: 'Mise en place d\'une stratégie d\'acquisition clients multicanal avec CRM intelligent pour le suivi et la relance automatisée.',
          en: 'Multi-channel customer acquisition strategy with smart CRM for automated follow-up and engagement.',
        },
        estimatedCost: 10000,
        grantCoverage: 7000,
        youPay: 3000,
        programId: 'sme-ai',
      })
    }
  }

  if (problem === 'manage-admin') {
    projects.push({
      title: {
        fr: 'Automatisation administrative par IA',
        en: 'AI-powered admin automation',
      },
      description: {
        fr: 'Facturation automatique, gestion des rendez-vous, comptabilité simplifiée avec outils IA intégrés.',
        en: 'Automated invoicing, appointment management, simplified accounting with integrated AI tools.',
      },
      estimatedCost: 7000,
      grantCoverage: 4900,
      youPay: 2100,
      programId: 'sme-ai',
    })
  }

  if (problem === 'communicate') {
    projects.push({
      title: {
        fr: 'Chatbot IA + communication client automatisée',
        en: 'AI chatbot + automated client communication',
      },
      description: {
        fr: 'Chatbot intelligent sur votre site et réseaux, réponses automatiques multilingues, suivi client personnalisé par IA.',
        en: 'Smart chatbot on your website and social media, multilingual auto-responses, AI-personalized client follow-up.',
      },
      estimatedCost: 5000,
      grantCoverage: 3500,
      youPay: 1500,
      programId: 'sme-ai',
    })
  }

  if (problem === 'save-time') {
    projects.push({
      title: {
        fr: 'Suite d\'outils IA productivité',
        en: 'AI productivity toolkit',
      },
      description: {
        fr: 'Intégration d\'outils IA pour automatiser les tâches répétitives : emails, reporting, planification, gestion documentaire.',
        en: 'AI tool integration to automate repetitive tasks: emails, reporting, scheduling, document management.',
      },
      estimatedCost: 4000,
      grantCoverage: 2800,
      youPay: 1200,
      programId: 'sme-ai',
    })
  }

  // Add a second project if low digital maturity
  if (isLowDigital && projects.length < 2) {
    projects.push({
      title: {
        fr: 'Pack digitalisation fondamentale',
        en: 'Fundamental digitalization pack',
      },
      description: {
        fr: 'Site web professionnel, présence réseaux sociaux, outils de base (email pro, cloud, agenda partagé).',
        en: 'Professional website, social media presence, basic tools (professional email, cloud, shared calendar).',
      },
      estimatedCost: 3500,
      grantCoverage: 1750,
      youPay: 1750,
      programId: 'sme-digital',
    })
  }

  // Add AI specific project if user already uses AI
  if (usesAI) {
    projects.push({
      title: {
        fr: 'Déploiement IA avancé sur mesure',
        en: 'Custom advanced AI deployment',
      },
      description: {
        fr: 'Audit de vos usages IA actuels, identification de nouveaux cas d\'usage à fort ROI, déploiement de solutions sur mesure.',
        en: 'Audit of your current AI usage, identification of high-ROI new use cases, deployment of custom solutions.',
      },
      estimatedCost: 20000,
      grantCoverage: 14000,
      youPay: 6000,
      programId: 'fit4ai',
    })
  }

  return { eligible: true, programs, projects }
}

export function getAgentResponse(question: string, lang: string): string {
  const q = question.toLowerCase()

  const responses: Record<string, Record<string, string>> = {
    eligibility: {
      fr: "Pour être éligible aux programmes d'aides luxembourgeois, votre entreprise doit : 1) Avoir son siège social au Luxembourg, 2) Disposer d'une autorisation d'établissement, 3) Être une PME (pour la plupart des programmes). Les auto-entrepreneurs et grandes entreprises peuvent aussi être éligibles à certains programmes.",
      en: 'To be eligible for Luxembourg funding programs, your company must: 1) Have its headquarters in Luxembourg, 2) Have a business permit (autorisation d\'établissement), 3) Be an SME (for most programs). Sole proprietors and large companies may also be eligible for certain programs.',
    },
    duration: {
      fr: "Le processus varie selon le programme : le SME Package prend généralement 2-3 mois du diagnostic à la mise en œuvre. Les programmes Fit 4 peuvent durer 4-6 mois. La demande initiale est traitée en 2-4 semaines.",
      en: 'The process varies by program: the SME Package typically takes 2-3 months from assessment to implementation. Fit 4 programs can last 4-6 months. The initial application is processed in 2-4 weeks.',
    },
    luxinnovation: {
      fr: "Luxinnovation est l'agence nationale de l'innovation au Luxembourg. Elle gère plusieurs programmes d'aide à la digitalisation et à l'innovation des entreprises, dont les SME Packages et les programmes Fit 4. C'est votre interlocuteur principal pour ces aides.",
      en: 'Luxinnovation is Luxembourg\'s national innovation agency. It manages several digitalization and innovation support programs for businesses, including SME Packages and Fit 4 programs. They are your main point of contact for these grants.',
    },
    cost: {
      fr: "L'utilisation du simulateur est 100% gratuite. Les programmes d'aide couvrent entre 50% et 70% des coûts de votre projet. Par exemple, pour un projet à 10 000 €, vous pourriez ne payer que 3 000 €, le reste étant couvert par la subvention.",
      en: 'Using the simulator is 100% free. Support programs cover between 50% and 70% of your project costs. For example, for a €10,000 project, you might only pay €3,000, with the rest covered by the grant.',
    },
    default: {
      fr: "Merci pour votre question ! Pour une réponse précise et personnalisée, je vous recommande de remplir le formulaire de contact. Un expert vous rappellera sous 48h pour répondre à toutes vos questions. Vous pouvez aussi relancer le simulateur pour estimer vos aides.",
      en: 'Thanks for your question! For a precise and personalized answer, I recommend filling out the contact form. An expert will call you back within 48h to answer all your questions. You can also run the simulator again to estimate your funding.',
    },
  }

  let key = 'default'
  if (q.includes('éligib') || q.includes('eligib') || q.includes('eligible') || q.includes('activité')) {
    key = 'eligibility'
  } else if (q.includes('temps') || q.includes('durée') || q.includes('duration') || q.includes('long') || q.includes('how long')) {
    key = 'duration'
  } else if (q.includes('luxinnovation') || q.includes('qui est') || q.includes('who is')) {
    key = 'luxinnovation'
  } else if (q.includes('coût') || q.includes('cost') || q.includes('prix') || q.includes('price') || q.includes('combien') || q.includes('how much') || q.includes('gratuit') || q.includes('free')) {
    key = 'cost'
  }

  return responses[key]?.[lang] ?? responses.default[lang === 'fr' ? 'fr' : 'en']
}
