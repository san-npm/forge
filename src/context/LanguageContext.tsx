'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'fr' | 'en'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.simulator': { fr: 'Simulateur', en: 'Simulator' },
  'nav.programs': { fr: 'Programmes', en: 'Programs' },
  'nav.contact': { fr: 'Contact', en: 'Contact' },

  // Landing page
  'hero.title': {
    fr: 'Découvrez combien le Luxembourg finance votre transformation digitale & IA',
    en: 'Discover how much Luxembourg will pay for your digital & AI transformation',
  },
  'hero.subtitle': {
    fr: 'Simulez vos aides en 2 minutes. Gratuit, confidentiel, sans engagement.',
    en: 'Simulate your funding in 2 minutes. Free, confidential, no commitment.',
  },
  'hero.cta': { fr: 'Estimer mes aides', en: 'Estimate my funding' },
  'hero.stat1.value': { fr: '70%', en: '70%' },
  'hero.stat1.label': { fr: 'remboursé en moyenne', en: 'reimbursed on average' },
  'hero.stat2.value': { fr: '25 000 €', en: '€25,000' },
  'hero.stat2.label': { fr: "jusqu'à de subvention", en: 'up to in grants' },
  'hero.stat3.value': { fr: '5', en: '5' },
  'hero.stat3.label': { fr: 'programmes disponibles', en: 'programs available' },
  'hero.trust': {
    fr: 'Programmes référencés',
    en: 'Referenced programs',
  },

  // Quiz
  'quiz.progress': { fr: 'Question', en: 'Question' },
  'quiz.of': { fr: 'sur', en: 'of' },
  'quiz.next': { fr: 'Suivant', en: 'Next' },
  'quiz.back': { fr: 'Retour', en: 'Back' },
  'quiz.seeResults': { fr: 'Voir mes résultats', en: 'See my results' },

  // Question 1
  'q1.title': { fr: 'Quelle est la taille de votre entreprise ?', en: 'What is your company size?' },
  'q1.o1': { fr: 'Auto-entrepreneur', en: 'Sole proprietor' },
  'q1.o2': { fr: '1-10 employés', en: '1-10 employees' },
  'q1.o3': { fr: '11-50 employés', en: '11-50 employees' },
  'q1.o4': { fr: '51-250 employés', en: '51-250 employees' },
  'q1.o5': { fr: '250+ employés', en: '250+ employees' },

  // Question 2
  'q2.title': { fr: "Quel est votre secteur d'activité ?", en: 'What is your industry?' },
  'q2.o1': { fr: 'HORECA (hôtellerie, restauration)', en: 'HORECA (hospitality, food service)' },
  'q2.o2': { fr: 'Commerce de détail', en: 'Retail' },
  'q2.o3': { fr: 'Artisanat', en: 'Crafts & trades' },
  'q2.o4': { fr: 'Services professionnels', en: 'Professional services' },
  'q2.o5': { fr: 'Production / Industrie', en: 'Manufacturing / Industry' },
  'q2.o6': { fr: 'Vin / Agriculture', en: 'Wine / Agriculture' },
  'q2.o7': { fr: 'Autre', en: 'Other' },

  // Question 3
  'q3.title': { fr: 'Votre siège social est-il au Luxembourg ?', en: 'Is your headquarters in Luxembourg?' },
  'q3.o1': { fr: 'Oui', en: 'Yes' },
  'q3.o2': { fr: 'Non', en: 'No' },

  // Question 4
  'q4.title': { fr: "Avez-vous une autorisation d'établissement ?", en: 'Do you have a business permit (autorisation d\'établissement)?' },
  'q4.o1': { fr: 'Oui', en: 'Yes' },
  'q4.o2': { fr: 'Non', en: 'No' },
  'q4.o3': { fr: 'Je ne sais pas', en: "I don't know" },

  // Question 5
  'q5.title': { fr: 'Avez-vous déjà un site web / outils digitaux ?', en: 'Do you already have a website / digital tools?' },
  'q5.o1': { fr: 'Rien du tout', en: 'Nothing at all' },
  'q5.o2': { fr: 'Site web basique', en: 'Basic website' },
  'q5.o3': { fr: 'Site web + réseaux sociaux', en: 'Website + social media' },
  'q5.o4': { fr: 'Outils de gestion (CRM, ERP...)', en: 'Management tools (CRM, ERP...)' },

  // Question 6
  'q6.title': { fr: "Quel est votre plus gros problème aujourd'hui ?", en: 'What is your biggest challenge today?' },
  'q6.o1': { fr: 'Trouver des clients', en: 'Finding customers' },
  'q6.o2': { fr: "Gérer l'administratif", en: 'Managing admin tasks' },
  'q6.o3': { fr: 'Communiquer avec les clients', en: 'Communicating with clients' },
  'q6.o4': { fr: 'Gagner du temps', en: 'Saving time' },
  'q6.o5': { fr: 'Autre', en: 'Other' },

  // Question 7
  'q7.title': { fr: "Avez-vous déjà utilisé des outils d'IA ?", en: 'Have you ever used AI tools?' },
  'q7.o1': { fr: 'Jamais', en: 'Never' },
  'q7.o2': { fr: 'Un peu (ChatGPT...)', en: 'A little (ChatGPT...)' },
  'q7.o3': { fr: 'Oui, régulièrement', en: 'Yes, regularly' },

  // Question 8
  'q8.title': { fr: 'Quel budget envisagez-vous ?', en: 'What budget are you considering?' },
  'q8.o1': { fr: 'Moins de 3 000 €', en: 'Less than €3,000' },
  'q8.o2': { fr: '3 000 - 10 000 €', en: '€3,000 - €10,000' },
  'q8.o3': { fr: '10 000 - 25 000 €', en: '€10,000 - €25,000' },
  'q8.o4': { fr: 'Plus de 25 000 €', en: 'More than €25,000' },
  'q8.o5': { fr: 'Aucune idée', en: 'No idea' },

  // Results
  'results.title': { fr: 'Vos résultats personnalisés', en: 'Your personalized results' },
  'results.eligible': { fr: 'Programmes éligibles', en: 'Eligible programs' },
  'results.upTo': { fr: "Jusqu'à", en: 'Up to' },
  'results.grant': { fr: 'de subvention', en: 'in grants' },
  'results.coverage': { fr: 'de couverture', en: 'coverage' },
  'results.projects': { fr: 'Projets recommandés pour vous', en: 'Recommended projects for you' },
  'results.estimatedCost': { fr: 'Coût estimé', en: 'Estimated cost' },
  'results.withGrant': { fr: 'Avec aide', en: 'With grant' },
  'results.youPay': { fr: 'Vous payez', en: 'You pay' },
  'results.savings': { fr: "Économie grâce aux aides", en: 'Savings from grants' },
  'results.comparison': { fr: 'Comparatif des coûts', en: 'Cost comparison' },
  'results.without': { fr: 'Sans aide', en: 'Without grant' },
  'results.with': { fr: 'Avec aide', en: 'With grant' },
  'results.getReport': { fr: 'Recevoir mon rapport détaillé', en: 'Get my detailed report' },
  'results.emailPlaceholder': { fr: 'Votre adresse email', en: 'Your email address' },
  'results.send': { fr: 'Envoyer', en: 'Send' },
  'results.sent': { fr: 'Rapport envoyé !', en: 'Report sent!' },
  'results.sentDesc': { fr: 'Consultez votre boîte mail pour le rapport détaillé.', en: 'Check your inbox for the detailed report.' },
  'results.notEligible': {
    fr: "Malheureusement, votre entreprise ne semble pas éligible aux programmes luxembourgeois. Le siège social doit être au Luxembourg et vous devez disposer d'une autorisation d'établissement.",
    en: 'Unfortunately, your company does not appear to be eligible for Luxembourg programs. The headquarters must be in Luxembourg and you must have a business permit.',
  },
  'results.contactAnyway': { fr: 'Contactez-nous quand même', en: 'Contact us anyway' },
  'results.nextStep': { fr: 'Prochaine étape', en: 'Next step' },
  'results.talkExpert': { fr: 'Parler à un expert', en: 'Talk to an expert' },

  // Agent & Contact
  'agent.title': { fr: 'Agent IA — Posez vos questions', en: 'AI Agent — Ask your questions' },
  'agent.placeholder': { fr: 'Posez votre question ici...', en: 'Ask your question here...' },
  'agent.welcome': {
    fr: "Bonjour ! Je suis l'assistant IA du simulateur. Posez-moi vos questions sur les programmes d'aides luxembourgeois, l'éligibilité, les démarches...",
    en: "Hello! I'm the simulator's AI assistant. Ask me about Luxembourg funding programs, eligibility, procedures...",
  },
  'contact.title': { fr: 'Être rappelé sous 48h', en: 'Get a callback within 48h' },
  'contact.name': { fr: 'Nom complet', en: 'Full name' },
  'contact.email': { fr: 'Email', en: 'Email' },
  'contact.phone': { fr: 'Téléphone', en: 'Phone' },
  'contact.message': { fr: 'Message (optionnel)', en: 'Message (optional)' },
  'contact.submit': { fr: 'Être rappelé sous 48h', en: 'Get a callback within 48h' },
  'contact.success': { fr: 'Demande envoyée !', en: 'Request sent!' },
  'contact.successDesc': { fr: 'Un expert vous contactera sous 48h.', en: 'An expert will contact you within 48h.' },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('fr')

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
