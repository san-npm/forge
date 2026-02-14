'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'fr' | 'en' | 'lb' | 'de' | 'it' | 'pt'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<string, Record<Language, string>> = {
  // ─── Navbar ───
  'nav.simulator': {
    fr: 'Simulateur', en: 'Simulator', lb: 'Simulator', de: 'Simulator', it: 'Simulatore', pt: 'Simulador',
  },
  'nav.programs': {
    fr: 'Programmes', en: 'Programs', lb: 'Programmer', de: 'Programme', it: 'Programmi', pt: 'Programas',
  },
  'nav.contact': {
    fr: 'Contact', en: 'Contact', lb: 'Kontakt', de: 'Kontakt', it: 'Contatto', pt: 'Contacto',
  },
  'nav.blog': {
    fr: 'Blog', en: 'Blog', lb: 'Blog', de: 'Blog', it: 'Blog', pt: 'Blog',
  },

  // ─── Landing page ───
  'hero.title': {
    fr: 'Découvrez combien le Luxembourg finance votre transformation digitale & IA',
    en: 'Discover how much Luxembourg will fund your digital & AI transformation',
    lb: 'Entdeckt wéi vill Lëtzebuerg fir Är digital & KI Transformatioun bezilt',
    de: 'Entdecken Sie, wie viel Luxemburg für Ihre digitale & KI-Transformation zahlt',
    it: 'Scopri quanto il Lussemburgo finanzia la tua trasformazione digitale e IA',
    pt: 'Descubra quanto o Luxemburgo financia a sua transformação digital e IA',
  },
  'hero.subtitle': {
    fr: 'Simulez vos aides en 2 minutes. Gratuit, confidentiel, sans engagement.',
    en: 'Simulate your funding in 2 minutes. Free, confidential, no commitment.',
    lb: 'Simuléiert Är Hëllefen an 2 Minutten. Gratis, vertraulech, ouni Engagement.',
    de: 'Simulieren Sie Ihre Förderung in 2 Minuten. Kostenlos, vertraulich, unverbindlich.',
    it: 'Simula i tuoi finanziamenti in 2 minuti. Gratuito, confidenziale, senza impegno.',
    pt: 'Simule os seus apoios em 2 minutos. Gratuito, confidencial, sem compromisso.',
  },
  'hero.cta': {
    fr: 'Estimer mes aides', en: 'Estimate my funding', lb: 'Meng Hëllefen schätzen', de: 'Meine Förderung schätzen', it: 'Stima i miei finanziamenti', pt: 'Estimar os meus apoios',
  },
  'hero.stat1.value': {
    fr: '70%', en: '70%', lb: '70%', de: '70%', it: '70%', pt: '70%',
  },
  'hero.stat1.label': {
    fr: 'remboursé en moyenne', en: 'reimbursed on average', lb: 'am Duerchschnëtt rembourséiert', de: 'durchschnittlich erstattet', it: 'rimborsato in media', pt: 'reembolsado em média',
  },
  'hero.stat2.value': {
    fr: '25 000 €', en: '€25,000', lb: '25.000 €', de: '25.000 €', it: '25.000 €', pt: '25.000 €',
  },
  'hero.stat2.label': {
    fr: "jusqu'à de subvention", en: 'up to in grants', lb: 'bis zu u Subventiounen', de: 'bis zu an Zuschüssen', it: 'fino a in sovvenzioni', pt: 'até em subsídios',
  },
  'hero.stat3.value': {
    fr: '5', en: '5', lb: '5', de: '5', it: '5', pt: '5',
  },
  'hero.stat3.label': {
    fr: 'programmes disponibles', en: 'programs available', lb: 'Programmer disponibel', de: 'Programme verfügbar', it: 'programmi disponibili', pt: 'programas disponíveis',
  },
  'hero.trust': {
    fr: 'Programmes référencés', en: 'Referenced programs', lb: 'Referenzéiert Programmer', de: 'Referenzierte Programme', it: 'Programmi di riferimento', pt: 'Programas referenciados',
  },

  // ─── Quiz chrome ───
  'quiz.progress': {
    fr: 'Question', en: 'Question', lb: 'Fro', de: 'Frage', it: 'Domanda', pt: 'Pergunta',
  },
  'quiz.of': {
    fr: 'sur', en: 'of', lb: 'vun', de: 'von', it: 'di', pt: 'de',
  },
  'quiz.next': {
    fr: 'Suivant', en: 'Next', lb: 'Weider', de: 'Weiter', it: 'Avanti', pt: 'Seguinte',
  },
  'quiz.back': {
    fr: 'Retour', en: 'Back', lb: 'Zréck', de: 'Zurück', it: 'Indietro', pt: 'Voltar',
  },
  'quiz.seeResults': {
    fr: 'Voir mes résultats', en: 'See my results', lb: 'Meng Resultater gesinn', de: 'Meine Ergebnisse sehen', it: 'Vedi i miei risultati', pt: 'Ver os meus resultados',
  },

  // ─── Question 1 — Company size ───
  'q1.title': {
    fr: 'Quelle est la taille de votre entreprise ?',
    en: 'What is your company size?',
    lb: 'Wéi grouss ass Äert Unternehmen?',
    de: 'Wie groß ist Ihr Unternehmen?',
    it: 'Qual è la dimensione della vostra azienda?',
    pt: 'Qual é a dimensão da sua empresa?',
  },
  'q1.o1': {
    fr: 'Auto-entrepreneur', en: 'Sole proprietor', lb: 'Selbststännegen', de: 'Einzelunternehmer', it: 'Lavoratore autonomo', pt: 'Empresário em nome individual',
  },
  'q1.o2': {
    fr: '1-10 employés', en: '1-10 employees', lb: '1-10 Mataarbechter', de: '1-10 Mitarbeiter', it: '1-10 dipendenti', pt: '1-10 empregados',
  },
  'q1.o3': {
    fr: '11-50 employés', en: '11-50 employees', lb: '11-50 Mataarbechter', de: '11-50 Mitarbeiter', it: '11-50 dipendenti', pt: '11-50 empregados',
  },
  'q1.o4': {
    fr: '51-250 employés', en: '51-250 employees', lb: '51-250 Mataarbechter', de: '51-250 Mitarbeiter', it: '51-250 dipendenti', pt: '51-250 empregados',
  },
  'q1.o5': {
    fr: '250+ employés', en: '250+ employees', lb: '250+ Mataarbechter', de: '250+ Mitarbeiter', it: '250+ dipendenti', pt: '250+ empregados',
  },

  // ─── Question 2 — Industry sector ───
  'q2.title': {
    fr: "Quel est votre secteur d'activité ?",
    en: 'What is your industry?',
    lb: 'Wéi ass Äre Secteur?',
    de: 'In welcher Branche sind Sie tätig?',
    it: 'Qual è il vostro settore di attività?',
    pt: 'Qual é o seu setor de atividade?',
  },
  'q2.o1': {
    fr: 'HORECA (hôtellerie, restauration)', en: 'HORECA (hospitality, food service)', lb: 'HORECA (Hotellerie, Restauratioun)', de: 'HORECA (Gastronomie, Hotelgewerbe)', it: 'HORECA (ospitalità, ristorazione)', pt: 'HORECA (hotelaria, restauração)',
  },
  'q2.o2': {
    fr: 'Commerce de détail', en: 'Retail', lb: 'Detailhandel', de: 'Einzelhandel', it: 'Commercio al dettaglio', pt: 'Comércio a retalho',
  },
  'q2.o3': {
    fr: 'Artisanat', en: 'Crafts & trades', lb: 'Handwierk', de: 'Handwerk', it: 'Artigianato', pt: 'Artesanato',
  },
  'q2.o4': {
    fr: 'Services professionnels', en: 'Professional services', lb: 'Professionell Servicer', de: 'Dienstleistungen', it: 'Servizi professionali', pt: 'Serviços profissionais',
  },
  'q2.o5': {
    fr: 'Production / Industrie', en: 'Manufacturing / Industry', lb: 'Produktioun / Industrie', de: 'Produktion / Industrie', it: 'Produzione / Industria', pt: 'Produção / Indústria',
  },
  'q2.o6': {
    fr: 'Vin / Agriculture', en: 'Wine / Agriculture', lb: 'Wäin / Landwirtschaft', de: 'Wein / Landwirtschaft', it: 'Vino / Agricoltura', pt: 'Vinho / Agricultura',
  },
  'q2.o7': {
    fr: 'Autre', en: 'Other', lb: 'Anert', de: 'Sonstiges', it: 'Altro', pt: 'Outro',
  },

  // ─── Question 3 — Luxembourg establishment (merged HQ + permit) ───
  'q3.title': {
    fr: 'Votre entreprise est-elle établie au Luxembourg ?',
    en: 'Is your company established in Luxembourg?',
    lb: 'Ass Äert Unternehmen zu Lëtzebuerg etabléiert?',
    de: 'Ist Ihr Unternehmen in Luxemburg ansässig?',
    it: 'La vostra azienda è stabilita in Lussemburgo?',
    pt: 'A sua empresa está estabelecida no Luxemburgo?',
  },
  'q3.o1': {
    fr: "Oui, avec autorisation d'établissement",
    en: 'Yes, with a business permit',
    lb: 'Jo, mat Etablissementsautoriséierung',
    de: 'Ja, mit Niederlassungsgenehmigung',
    it: "Sì, con autorizzazione di stabilimento",
    pt: 'Sim, com autorização de estabelecimento',
  },
  'q3.o2': {
    fr: "Au Luxembourg, mais sans / je ne sais pas pour l'autorisation",
    en: "In Luxembourg, but no permit / I'm not sure",
    lb: "Zu Lëtzebuerg, awer ouni / ech weess et net",
    de: 'In Luxemburg, aber ohne Genehmigung / unsicher',
    it: 'In Lussemburgo, ma senza autorizzazione / non sono sicuro',
    pt: 'No Luxemburgo, mas sem autorização / não tenho a certeza',
  },
  'q3.o3': {
    fr: 'Non, pas au Luxembourg',
    en: 'No, not in Luxembourg',
    lb: 'Nee, net zu Lëtzebuerg',
    de: 'Nein, nicht in Luxemburg',
    it: 'No, non in Lussemburgo',
    pt: 'Não, não no Luxemburgo',
  },

  // ─── Question 4 — Digital maturity ───
  'q4.title': {
    fr: 'Avez-vous déjà un site web / outils digitaux ?',
    en: 'Do you already have a website / digital tools?',
    lb: 'Hutt Dir schonn eng Websäit / digital Tools?',
    de: 'Haben Sie bereits eine Website / digitale Tools?',
    it: 'Avete già un sito web / strumenti digitali?',
    pt: 'Já tem um website / ferramentas digitais?',
  },
  'q4.o1': {
    fr: 'Rien du tout', en: 'Nothing at all', lb: 'Guer näischt', de: 'Gar nichts', it: 'Niente di niente', pt: 'Nada de nada',
  },
  'q4.o2': {
    fr: 'Site web basique', en: 'Basic website', lb: 'Einfach Websäit', de: 'Einfache Website', it: 'Sito web basico', pt: 'Website básico',
  },
  'q4.o3': {
    fr: 'Site web + réseaux sociaux', en: 'Website + social media', lb: 'Websäit + sozial Medien', de: 'Website + soziale Medien', it: 'Sito web + social media', pt: 'Website + redes sociais',
  },
  'q4.o4': {
    fr: 'Outils de gestion (CRM, ERP...)', en: 'Management tools (CRM, ERP...)', lb: 'Gestiounstools (CRM, ERP...)', de: 'Management-Tools (CRM, ERP...)', it: 'Strumenti di gestione (CRM, ERP...)', pt: 'Ferramentas de gestão (CRM, ERP...)',
  },

  // ─── Question 5 — Biggest problem ───
  'q5.title': {
    fr: "Quel est votre plus gros problème aujourd'hui ?",
    en: 'What is your biggest challenge today?',
    lb: "Wat ass Äre gréisste Problem haut?",
    de: 'Was ist heute Ihre größte Herausforderung?',
    it: 'Qual è la vostra sfida più grande oggi?',
    pt: 'Qual é o seu maior desafio hoje?',
  },
  'q5.o1': {
    fr: 'Trouver des clients', en: 'Finding customers', lb: 'Cliente fannen', de: 'Kunden finden', it: 'Trovare clienti', pt: 'Encontrar clientes',
  },
  'q5.o2': {
    fr: "Gérer l'administratif", en: 'Managing admin tasks', lb: 'Administratioun geréieren', de: 'Verwaltung managen', it: "Gestire l'amministrazione", pt: 'Gerir a administração',
  },
  'q5.o3': {
    fr: 'Communiquer avec les clients', en: 'Communicating with clients', lb: 'Mat Cliente kommunizéieren', de: 'Mit Kunden kommunizieren', it: 'Comunicare con i clienti', pt: 'Comunicar com os clientes',
  },
  'q5.o4': {
    fr: 'Gagner du temps', en: 'Saving time', lb: 'Zäit spueren', de: 'Zeit sparen', it: 'Risparmiare tempo', pt: 'Poupar tempo',
  },
  'q5.o5': {
    fr: 'Autre', en: 'Other', lb: 'Anert', de: 'Sonstiges', it: 'Altro', pt: 'Outro',
  },

  // ─── Question 6 — AI usage ───
  'q6.title': {
    fr: "Avez-vous déjà utilisé des outils d'IA ?",
    en: 'Have you ever used AI tools?',
    lb: 'Hutt Dir schonn KI-Tools benotzt?',
    de: 'Haben Sie bereits KI-Tools genutzt?',
    it: 'Avete mai utilizzato strumenti di IA?',
    pt: 'Já utilizou ferramentas de IA?',
  },
  'q6.o1': {
    fr: 'Jamais', en: 'Never', lb: 'Ni', de: 'Nie', it: 'Mai', pt: 'Nunca',
  },
  'q6.o2': {
    fr: 'Un peu (ChatGPT...)', en: 'A little (ChatGPT...)', lb: 'E bëssen (ChatGPT...)', de: 'Ein wenig (ChatGPT...)', it: 'Un po\' (ChatGPT...)', pt: 'Um pouco (ChatGPT...)',
  },
  'q6.o3': {
    fr: 'Oui, régulièrement', en: 'Yes, regularly', lb: 'Jo, reegelméisseg', de: 'Ja, regelmäßig', it: 'Sì, regolarmente', pt: 'Sim, regularmente',
  },

  // ─── Results ───
  'results.title': {
    fr: 'Vos résultats personnalisés', en: 'Your personalized results', lb: 'Är personaliséiert Resultater', de: 'Ihre personalisierten Ergebnisse', it: 'I vostri risultati personalizzati', pt: 'Os seus resultados personalizados',
  },
  'results.eligible': {
    fr: 'Programmes éligibles', en: 'Eligible programs', lb: 'Eligibel Programmer', de: 'Förderfähige Programme', it: 'Programmi ammissibili', pt: 'Programas elegíveis',
  },
  'results.upTo': {
    fr: "Jusqu'à", en: 'Up to', lb: 'Bis zu', de: 'Bis zu', it: 'Fino a', pt: 'Até',
  },
  'results.grant': {
    fr: 'de subvention', en: 'in grants', lb: 'u Subventiounen', de: 'an Zuschüssen', it: 'in sovvenzioni', pt: 'em subsídios',
  },
  'results.coverage': {
    fr: 'de couverture', en: 'coverage', lb: 'Deckung', de: 'Abdeckung', it: 'copertura', pt: 'cobertura',
  },
  'results.projects': {
    fr: 'Projets recommandés pour vous', en: 'Recommended projects for you', lb: 'Recommandéiert Projete fir Iech', de: 'Empfohlene Projekte für Sie', it: 'Progetti consigliati per voi', pt: 'Projetos recomendados para si',
  },
  'results.estimatedCost': {
    fr: 'Coût estimé', en: 'Estimated cost', lb: 'Geschate Käschten', de: 'Geschätzte Kosten', it: 'Costo stimato', pt: 'Custo estimado',
  },
  'results.withGrant': {
    fr: 'Avec aide', en: 'With grant', lb: 'Mat Hëllef', de: 'Mit Förderung', it: 'Con sovvenzione', pt: 'Com apoio',
  },
  'results.youPay': {
    fr: 'Vous payez', en: 'You pay', lb: 'Dir bezuelt', de: 'Sie zahlen', it: 'Voi pagate', pt: 'Você paga',
  },
  'results.savings': {
    fr: 'Économie grâce aux aides', en: 'Savings from grants', lb: 'Spuerungen duerch Hëllefen', de: 'Einsparungen durch Förderung', it: 'Risparmi grazie ai finanziamenti', pt: 'Poupança graças aos apoios',
  },
  'results.comparison': {
    fr: 'Comparatif des coûts', en: 'Cost comparison', lb: 'Käschtevergläich', de: 'Kostenvergleich', it: 'Confronto dei costi', pt: 'Comparação de custos',
  },
  'results.without': {
    fr: 'Sans aide', en: 'Without grant', lb: 'Ouni Hëllef', de: 'Ohne Förderung', it: 'Senza sovvenzione', pt: 'Sem apoio',
  },
  'results.with': {
    fr: 'Avec aide', en: 'With grant', lb: 'Mat Hëllef', de: 'Mit Förderung', it: 'Con sovvenzione', pt: 'Com apoio',
  },
  'results.getReport': {
    fr: 'Recevoir mon rapport détaillé', en: 'Get my detailed report', lb: 'Mäi detailléierte Rapport kréien', de: 'Meinen detaillierten Bericht erhalten', it: 'Ricevere il mio rapporto dettagliato', pt: 'Receber o meu relatório detalhado',
  },
  'results.emailPlaceholder': {
    fr: 'Votre adresse email', en: 'Your email address', lb: 'Är E-Mail Adress', de: 'Ihre E-Mail-Adresse', it: 'Il vostro indirizzo email', pt: 'O seu endereço de email',
  },
  'results.send': {
    fr: 'Envoyer', en: 'Send', lb: 'Schécken', de: 'Senden', it: 'Inviare', pt: 'Enviar',
  },
  'results.sent': {
    fr: 'Inscrit à la newsletter !', en: 'Subscribed to newsletter!', lb: 'Fir den Newsletter ageschriwwen!', de: 'Newsletter abonniert!', it: 'Iscritto alla newsletter!', pt: 'Inscrito na newsletter!',
  },
  'results.sentDesc': {
    fr: 'Vous recevrez nos actualités et conseils sur les aides luxembourgeoises.', en: 'You will receive our news and tips about Luxembourg grants.', lb: 'Dir kritt eis Neuegkeeten an Tipps iwwer lëtzebuerger Hëllefen.', de: 'Sie erhalten unsere Neuigkeiten und Tipps zu luxemburgischen Förderungen.', it: 'Riceverete le nostre novità e consigli sui finanziamenti lussemburghesi.', pt: 'Receberá as nossas novidades e dicas sobre apoios luxemburgueses.',
  },
  'results.notEligible': {
    fr: "Malheureusement, votre entreprise ne semble pas éligible aux programmes luxembourgeois. Le siège social doit être au Luxembourg et vous devez disposer d'une autorisation d'établissement.",
    en: 'Unfortunately, your company does not appear to be eligible for Luxembourg programs. The headquarters must be in Luxembourg and you must have a business permit.',
    lb: 'Leider schéngt Äert Unternehmen net eligibel fir lëtzebuerger Programmer ze sinn. De Sëtz muss zu Lëtzebuerg sinn an Dir musst eng Etablissementsautoriséierung hunn.',
    de: 'Leider scheint Ihr Unternehmen nicht für luxemburgische Programme förderfähig zu sein. Der Sitz muss in Luxemburg sein und Sie müssen eine Niederlassungsgenehmigung besitzen.',
    it: 'Purtroppo la vostra azienda non sembra ammissibile ai programmi lussemburghesi. La sede deve essere in Lussemburgo e dovete avere un\'autorizzazione di stabilimento.',
    pt: 'Infelizmente, a sua empresa não parece ser elegível para os programas luxemburgueses. A sede deve estar no Luxemburgo e deve ter uma autorização de estabelecimento.',
  },
  'results.contactAnyway': {
    fr: 'Contactez-nous quand même', en: 'Contact us anyway', lb: 'Kontaktéiert eis trotzdem', de: 'Kontaktieren Sie uns trotzdem', it: 'Contattateci comunque', pt: 'Contacte-nos na mesma',
  },
  'results.nextStep': {
    fr: 'Prochaine étape', en: 'Next step', lb: 'Nächste Schrëtt', de: 'Nächster Schritt', it: 'Prossimo passo', pt: 'Próximo passo',
  },
  'results.talkExpert': {
    fr: 'Parler à un expert', en: 'Talk to an expert', lb: 'Mat engem Expert schwätzen', de: 'Mit einem Experten sprechen', it: 'Parlare con un esperto', pt: 'Falar com um especialista',
  },

  // ─── Agent & Contact ───
  'agent.title': {
    fr: 'Agent IA — Posez vos questions', en: 'AI Agent — Ask your questions', lb: 'KI Agent — Stellt Är Froen', de: 'KI-Agent — Stellen Sie Ihre Fragen', it: 'Agente IA — Fate le vostre domande', pt: 'Agente IA — Faça as suas perguntas',
  },
  'agent.placeholder': {
    fr: 'Posez votre question ici...', en: 'Ask your question here...', lb: 'Stellt Är Fro hei...', de: 'Stellen Sie Ihre Frage hier...', it: 'Fate la vostra domanda qui...', pt: 'Faça a sua pergunta aqui...',
  },
  'agent.welcome': {
    fr: "Bonjour ! Je suis l'assistant IA de Forge. Posez-moi vos questions sur les programmes d'aides luxembourgeois, l'éligibilité, les démarches...",
    en: "Hello! I'm the Forge AI assistant. Ask me about Luxembourg funding programs, eligibility, procedures...",
    lb: "Moien! Ech sinn de Forge KI-Assistent. Frot mech iwwer lëtzebuerger Hëllefsprogrammer, Eligibilitéit, Demarchen...",
    de: 'Hallo! Ich bin der Forge KI-Assistent. Fragen Sie mich zu luxemburgischen Förderprogrammen, Förderungsfähigkeit, Verfahren...',
    it: "Ciao! Sono l'assistente IA di Forge. Chiedetemi dei programmi di finanziamento lussemburghesi, dell'ammissibilità, delle procedure...",
    pt: 'Olá! Sou o assistente IA da Forge. Pergunte-me sobre programas de apoio luxemburgueses, elegibilidade, procedimentos...',
  },
  'agent.thinking': {
    fr: 'Réflexion en cours...', en: 'Thinking...', lb: 'Denken...', de: 'Denke nach...', it: 'Sto pensando...', pt: 'A pensar...',
  },
  'contact.title': {
    fr: 'Être rappelé par un expert', en: 'Get a callback from an expert', lb: 'Vun engem Expert zréckgeruff ginn', de: 'Rückruf von einem Experten', it: 'Essere richiamati da un esperto', pt: 'Ser contactado por um especialista',
  },
  'contact.name': {
    fr: 'Nom complet', en: 'Full name', lb: 'Ganzen Numm', de: 'Vollständiger Name', it: 'Nome completo', pt: 'Nome completo',
  },
  'contact.company': {
    fr: 'Nom de l\'entreprise', en: 'Company name', lb: 'Numm vun der Firma', de: 'Firmenname', it: 'Nome dell\'azienda', pt: 'Nome da empresa',
  },
  'contact.role': {
    fr: 'Poste / Fonction', en: 'Role / Position', lb: 'Post / Funktioun', de: 'Position / Funktion', it: 'Ruolo / Posizione', pt: 'Cargo / Função',
  },
  'contact.companySize': {
    fr: 'Taille de l\'entreprise', en: 'Company size', lb: 'Gréisst vun der Firma', de: 'Unternehmensgröße', it: 'Dimensione dell\'azienda', pt: 'Dimensão da empresa',
  },
  'contact.companySize.o1': {
    fr: '1-10 employés', en: '1-10 employees', lb: '1-10 Mataarbechter', de: '1-10 Mitarbeiter', it: '1-10 dipendenti', pt: '1-10 empregados',
  },
  'contact.companySize.o2': {
    fr: '11-50 employés', en: '11-50 employees', lb: '11-50 Mataarbechter', de: '11-50 Mitarbeiter', it: '11-50 dipendenti', pt: '11-50 empregados',
  },
  'contact.companySize.o3': {
    fr: '51-250 employés', en: '51-250 employees', lb: '51-250 Mataarbechter', de: '51-250 Mitarbeiter', it: '51-250 dipendenti', pt: '51-250 empregados',
  },
  'contact.companySize.o4': {
    fr: '250+ employés', en: '250+ employees', lb: '250+ Mataarbechter', de: '250+ Mitarbeiter', it: '250+ dipendenti', pt: '250+ empregados',
  },
  'contact.subject': {
    fr: 'Sujet', en: 'Subject', lb: 'Sujet', de: 'Betreff', it: 'Oggetto', pt: 'Assunto',
  },
  'contact.subject.digital': {
    fr: 'Digitalisation', en: 'Digitalization', lb: 'Digitaliséierung', de: 'Digitalisierung', it: 'Digitalizzazione', pt: 'Digitalização',
  },
  'contact.subject.ai': {
    fr: 'Intelligence artificielle', en: 'Artificial intelligence', lb: 'Kënschtlech Intelligenz', de: 'Künstliche Intelligenz', it: 'Intelligenza artificiale', pt: 'Inteligência artificial',
  },
  'contact.subject.innovation': {
    fr: 'Innovation', en: 'Innovation', lb: 'Innovatioun', de: 'Innovation', it: 'Innovazione', pt: 'Inovação',
  },
  'contact.subject.other': {
    fr: 'Autre', en: 'Other', lb: 'Anert', de: 'Sonstiges', it: 'Altro', pt: 'Outro',
  },
  'contact.email': {
    fr: 'Email', en: 'Email', lb: 'E-Mail', de: 'E-Mail', it: 'Email', pt: 'Email',
  },
  'contact.phone': {
    fr: 'Téléphone', en: 'Phone', lb: 'Telefon', de: 'Telefon', it: 'Telefono', pt: 'Telefone',
  },
  'contact.message': {
    fr: 'Message (optionnel)', en: 'Message (optional)', lb: 'Message (optional)', de: 'Nachricht (optional)', it: 'Messaggio (opzionale)', pt: 'Mensagem (opcional)',
  },
  'contact.submit': {
    fr: 'Envoyer ma demande', en: 'Send my request', lb: 'Meng Ufro schécken', de: 'Anfrage senden', it: 'Inviare la mia richiesta', pt: 'Enviar o meu pedido',
  },
  'contact.success': {
    fr: 'Demande envoyée !', en: 'Request sent!', lb: 'Ufro geschéckt!', de: 'Anfrage gesendet!', it: 'Richiesta inviata!', pt: 'Pedido enviado!',
  },
  'contact.successDesc': {
    fr: 'Un expert vous contactera dans les meilleurs délais.', en: 'An expert will contact you as soon as possible.', lb: 'En Expert kontaktéiert Iech esou séier wéi méiglech.', de: 'Ein Experte wird Sie so schnell wie möglich kontaktieren.', it: 'Un esperto vi contatterà il prima possibile.', pt: 'Um especialista entrará em contacto o mais breve possível.',
  },

  // ─── Blog ───
  'blog.title': {
    fr: 'Blog — Aides & Innovation au Luxembourg', en: 'Blog — Grants & Innovation in Luxembourg', lb: 'Blog — Hëllefen & Innovatioun zu Lëtzebuerg', de: 'Blog — Förderung & Innovation in Luxemburg', it: 'Blog — Finanziamenti & Innovazione in Lussemburgo', pt: 'Blog — Apoios & Inovação no Luxemburgo',
  },
  'blog.subtitle': {
    fr: 'Actualités, guides et conseils pour financer votre transformation digitale', en: 'News, guides and tips to fund your digital transformation', lb: 'Neuegkeeten, Guiden an Tipps fir Är digital Transformatioun ze finanzéieren', de: 'Nachrichten, Leitfäden und Tipps zur Finanzierung Ihrer digitalen Transformation', it: 'Notizie, guide e consigli per finanziare la tua trasformazione digitale', pt: 'Notícias, guias e dicas para financiar a sua transformação digital',
  },
  'blog.readMore': {
    fr: 'Lire la suite', en: 'Read more', lb: 'Méi liesen', de: 'Weiterlesen', it: 'Leggi di più', pt: 'Ler mais',
  },
  'blog.backToBlog': {
    fr: 'Retour au blog', en: 'Back to blog', lb: 'Zréck zum Blog', de: 'Zurück zum Blog', it: 'Torna al blog', pt: 'Voltar ao blog',
  },
  'blog.backToHome': {
    fr: "Retour à l'accueil", en: 'Back to home', lb: 'Zréck op d\'Haaptsäit', de: 'Zurück zur Startseite', it: 'Torna alla home', pt: 'Voltar ao início',
  },
  'blog.empty': {
    fr: 'Aucun article pour le moment.', en: 'No articles yet.', lb: 'Nach keng Artikelen.', de: 'Noch keine Artikel.', it: 'Nessun articolo per il momento.', pt: 'Ainda não há artigos.',
  },
  'blog.readTime': {
    fr: 'min de lecture', en: 'min read', lb: 'min Liesentzäit', de: 'Min. Lesezeit', it: 'min di lettura', pt: 'min de leitura',
  },
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
