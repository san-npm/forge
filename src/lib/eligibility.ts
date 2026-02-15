export interface QuizAnswers {
  companySize: string
  sector: string
  luxembourgStatus: string
  digitalMaturity: string
  biggestProblem: string
  aiUsage: string
}

export interface Program {
  id: string
  name: Record<string, string>
  description: Record<string, string>
  maxGrant: number
  coveragePercent: number
  eligible: boolean
  source?: Record<string, string>
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
  // Base eligibility: must be established in Luxembourg (with or without permit)
  const isBasicallyEligible = answers.luxembourgStatus !== 'no'

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
  const isLarge = answers.companySize === '250+'

  const isLowDigital =
    answers.digitalMaturity === 'nothing' || answers.digitalMaturity === 'basic-site'

  const usesAI = answers.aiUsage === 'regularly'

  // SME Package Digital — 70% coverage, projects €3,000–€25,000
  // Source: Guichet.lu / Ministry of Economy
  if (isSME) {
    programs.push({
      id: 'sme-digital',
      name: { fr: 'SME Packages — Digital', en: 'SME Packages — Digital' },
      description: {
        fr: "Aide à la digitalisation des PME. Couvre 70 % des coûts éligibles sur des projets de 3 000 à 25 000 € HT (site web, e-commerce, outils de gestion).",
        en: 'SME digitalization aid. Covers 70% of eligible costs on projects from €3,000 to €25,000 excl. VAT (website, e-commerce, management tools).',
      },
      maxGrant: 17500,
      coveragePercent: 70,
      eligible: true,
      source: {
        fr: 'Ministère de l\'Économie / House of Entrepreneurship',
        en: 'Ministry of Economy / House of Entrepreneurship',
      },
    })
  }

  // SME Package AI — 70% coverage, projects €3,000–€25,000
  if (isSME) {
    programs.push({
      id: 'sme-ai',
      name: { fr: 'SME Packages — IA', en: 'SME Packages — AI' },
      description: {
        fr: "Intégration de solutions d'intelligence artificielle. Couvre 70 % des coûts éligibles sur des projets de 3 000 à 25 000 € HT.",
        en: 'AI solution integration. Covers 70% of eligible costs on projects from €3,000 to €25,000 excl. VAT.',
      },
      maxGrant: 17500,
      coveragePercent: 70,
      eligible: true,
      source: {
        fr: 'Ministère de l\'Économie — lancé mars 2025',
        en: 'Ministry of Economy — launched March 2025',
      },
    })
  }

  // SME Package Cybersecurity — 70% coverage, projects €3,000–€25,000
  if (isSME) {
    programs.push({
      id: 'sme-cyber',
      name: { fr: 'SME Packages — Cybersécurité', en: 'SME Packages — Cybersecurity' },
      description: {
        fr: "Renforcement de la cybersécurité des PME. Couvre 70 % des coûts éligibles sur des projets de 3 000 à 25 000 € HT (audit sécurité, pare-feu, formation).",
        en: 'SME cybersecurity strengthening. Covers 70% of eligible costs on projects from €3,000 to €25,000 excl. VAT (security audit, firewall, training).',
      },
      maxGrant: 17500,
      coveragePercent: 70,
      eligible: true,
      source: {
        fr: 'Ministère de l\'Économie — lancé mars 2025',
        en: 'Ministry of Economy — launched March 2025',
      },
    })
  }

  // Fit 4 Digital — Luxinnovation
  // Phase 1: Diagnostic €5,000 (100% covered by state)
  // Phase 2: Up to 50% of implementation costs
  if (isSME) {
    programs.push({
      id: 'fit4digital',
      name: { fr: 'Fit 4 Digital', en: 'Fit 4 Digital' },
      description: {
        fr: 'Programme en 2 phases. Phase 1 : diagnostic digital (5 000 €, 100 % pris en charge). Phase 2 : aide à la mise en œuvre (jusqu\'à 50 % des coûts de consulting + 20 % de l\'investissement).',
        en: 'Two-phase program. Phase 1: digital diagnostic (€5,000, 100% state-funded). Phase 2: implementation aid (up to 50% of consulting costs + 20% of investment).',
      },
      maxGrant: 5000,
      coveragePercent: 100,
      eligible: true,
      source: {
        fr: 'Luxinnovation / Ministère de l\'Économie',
        en: 'Luxinnovation / Ministry of Economy',
      },
    })
  }

  // Fit 4 AI — Luxinnovation
  // 50% for small enterprises (projects €10,000–€50,000) → max €25,000
  // 50% for medium enterprises (projects €10,000–€100,000)
  // 30% for large enterprises
  const fit4aiCoverage = isSmall ? 50 : isMedium ? 50 : 30
  const fit4aiMaxGrant = isSmall ? 25000 : isMedium ? 50000 : 30000
  if (isSME || isLarge) {
    programs.push({
      id: 'fit4ai',
      name: { fr: 'Fit 4 AI', en: 'Fit 4 AI' },
      description: {
        fr: `Programme d'accompagnement IA. Couvre ${fit4aiCoverage} % des coûts éligibles. De l'identification des cas d'usage à l'implémentation de solutions IA.`,
        en: `AI support program. Covers ${fit4aiCoverage}% of eligible costs. From use case identification to AI solution implementation.`,
      },
      maxGrant: fit4aiMaxGrant,
      coveragePercent: fit4aiCoverage,
      eligible: true,
      source: {
        fr: 'Luxinnovation / Ministère de l\'Économie',
        en: 'Luxinnovation / Ministry of Economy',
      },
    })
  }

  // Fit 4 Innovation — Luxinnovation
  // Phase 1: Diagnostic capped at €15,000, 50% covered → max €7,500
  // Phase 2: 50% of consultant fixed remuneration
  // SMEs only
  if (isSME) {
    programs.push({
      id: 'fit4innovation',
      name: { fr: 'Fit 4 Innovation', en: 'Fit 4 Innovation' },
      description: {
        fr: "Programme d'innovation. Phase 1 : diagnostic stratégique (50 % des coûts, plafonné à 15 000 € → max 7 500 €). Phase 2 : accompagnement à la mise en œuvre (50 % du consultant).",
        en: 'Innovation program. Phase 1: strategic diagnostic (50% of costs, capped at €15,000 → max €7,500). Phase 2: implementation support (50% of consultant).',
      },
      maxGrant: 7500,
      coveragePercent: 50,
      eligible: true,
      source: {
        fr: 'Luxinnovation / Ministère de l\'Économie',
        en: 'Luxinnovation / Ministry of Economy',
      },
    })
  }

  // Generate project recommendations based on sector + problem
  const problem = answers.biggestProblem

  if (problem === 'find-clients') {
    if (answers.sector === 'horeca') {
      projects.push({
        title: {
          fr: 'Site web optimisé + Google Business + newsletter IA ciblée',
          en: 'Optimized website + Google Business + targeted AI newsletter',
        },
        description: {
          fr: 'Création d\'un site web professionnel, optimisation Google Business Profile pour la visibilité locale, et mise en place d\'une newsletter automatisée par IA ciblant les expats et touristes.',
          en: 'Professional website creation, Google Business Profile optimization for local visibility, and AI-automated newsletter targeting expats and tourists.',
        },
        estimatedCost: 8000,
        grantCoverage: 5600,
        youPay: 2400,
        programId: 'sme-digital',
      })
    } else if (answers.sector === 'retail') {
      projects.push({
        title: {
          fr: 'E-commerce + campagnes publicitaires IA',
          en: 'E-commerce + AI advertising campaigns',
        },
        description: {
          fr: 'Boutique en ligne professionnelle avec gestion de stock intégrée + campagnes publicitaires optimisées par IA sur les réseaux sociaux.',
          en: 'Professional online store with integrated inventory management + AI-optimized social media advertising campaigns.',
        },
        estimatedCost: 12000,
        grantCoverage: 8400,
        youPay: 3600,
        programId: 'sme-digital',
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
        estimatedCost: 15000,
        grantCoverage: 10500,
        youPay: 4500,
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
      estimatedCost: 10000,
      grantCoverage: 7000,
      youPay: 3000,
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
      estimatedCost: 8000,
      grantCoverage: 5600,
      youPay: 2400,
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
      estimatedCost: 6000,
      grantCoverage: 4200,
      youPay: 1800,
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
      estimatedCost: 5000,
      grantCoverage: 3500,
      youPay: 1500,
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
      estimatedCost: 25000,
      grantCoverage: 12500,
      youPay: 12500,
      programId: 'fit4ai',
    })
  }

  return { eligible: true, programs, projects }
}
