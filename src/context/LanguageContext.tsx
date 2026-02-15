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
  'nav.directory': {
    fr: 'Agents IA', en: 'AI Agents', lb: 'KI Agenten', de: 'KI-Agenten', it: 'Agenti IA', pt: 'Agentes IA',
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

  // ─── Contact ───
  'contact.title': {
    fr: 'Être rappelé par un expert', en: 'Get a callback from an expert', lb: 'Vun engem Expert zréckgeruff ginn', de: 'Rückruf von einem Experten', it: 'Essere richiamati da un esperto', pt: 'Ser contactado por um especialista',
  },
  'contact.subtitle': {
    fr: 'Remplissez le formulaire et un expert vous recontactera.', en: 'Fill out the form and an expert will get back to you.', lb: 'Fëllt de Formulaire aus an en Expert mellt sech bei Iech.', de: 'Füllen Sie das Formular aus und ein Experte wird sich bei Ihnen melden.', it: 'Compilate il modulo e un esperto vi ricontatterà.', pt: 'Preencha o formulário e um especialista entrará em contacto.',
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

  // ─── Directory ───
  'directory.title': {
    fr: 'Annuaire des Agents IA', en: 'AI Agents Directory', lb: 'KI Agenten Verzeichnis', de: 'KI-Agenten Verzeichnis', it: 'Directory degli Agenti IA', pt: 'Diretório de Agentes IA',
  },
  'directory.subtitle': {
    fr: 'Découvrez les meilleurs outils d\'intelligence artificielle pour votre entreprise au Luxembourg.', en: 'Discover the best artificial intelligence tools for your business in Luxembourg.', lb: 'Entdeckt déi bescht Kënschtlech Intelligenz Tools fir Äert Geschäft zu Lëtzebuerg.', de: 'Entdecken Sie die besten KI-Tools für Ihr Unternehmen in Luxemburg.', it: 'Scopri i migliori strumenti di intelligenza artificiale per la tua azienda in Lussemburgo.', pt: 'Descubra as melhores ferramentas de inteligência artificial para a sua empresa no Luxemburgo.',
  },
  'directory.search': {
    fr: 'Rechercher un outil IA...', en: 'Search for an AI tool...', lb: 'E KI-Tool sichen...', de: 'Ein KI-Tool suchen...', it: 'Cerca uno strumento IA...', pt: 'Procurar uma ferramenta IA...',
  },
  'directory.backToHome': {
    fr: 'Retour à l\'accueil', en: 'Back to home', lb: 'Zréck op d\'Haaptsäit', de: 'Zurück zur Startseite', it: 'Torna alla home', pt: 'Voltar ao início',
  },
  'directory.agents': {
    fr: 'outils trouvés', en: 'tools found', lb: 'Tools fonnt', de: 'Tools gefunden', it: 'strumenti trovati', pt: 'ferramentas encontradas',
  },
  'directory.empty': {
    fr: 'Aucun outil trouvé.', en: 'No tools found.', lb: 'Keen Tool fonnt.', de: 'Keine Tools gefunden.', it: 'Nessuno strumento trovato.', pt: 'Nenhuma ferramenta encontrada.',
  },
  'directory.free': {
    fr: 'Gratuit', en: 'Free', lb: 'Gratis', de: 'Kostenlos', it: 'Gratuito', pt: 'Gratuito',
  },
  'directory.paid': {
    fr: 'Payant', en: 'Paid', lb: 'Bezuelt', de: 'Kostenpflichtig', it: 'A pagamento', pt: 'Pago',
  },
  'directory.cat.all': {
    fr: 'Tout', en: 'All', lb: 'Alles', de: 'Alle', it: 'Tutto', pt: 'Tudo',
  },
  'directory.cat.assistant': {
    fr: 'Assistants', en: 'Assistants', lb: 'Assistenten', de: 'Assistenten', it: 'Assistenti', pt: 'Assistentes',
  },
  'directory.cat.content': {
    fr: 'Contenu', en: 'Content', lb: 'Inhalt', de: 'Inhalt', it: 'Contenuto', pt: 'Conteúdo',
  },
  'directory.cat.productivity': {
    fr: 'Productivité', en: 'Productivity', lb: 'Produktivitéit', de: 'Produktivität', it: 'Produttività', pt: 'Produtividade',
  },
  'directory.cat.analytics': {
    fr: 'Analyse', en: 'Analytics', lb: 'Analyse', de: 'Analyse', it: 'Analisi', pt: 'Análise',
  },
  'directory.cat.creative': {
    fr: 'Création', en: 'Creative', lb: 'Kreativ', de: 'Kreativ', it: 'Creazione', pt: 'Criativo',
  },
  'directory.cat.dev': {
    fr: 'Développement', en: 'Development', lb: 'Entwécklung', de: 'Entwicklung', it: 'Sviluppo', pt: 'Desenvolvimento',
  },

  // ─── Footer ───
  'footer.description': {
    fr: 'Simulateur d\'aides luxembourgeoises pour la transformation digitale et l\'innovation IA des PME.',
    en: 'Luxembourg grants simulator for SME digital transformation and AI innovation.',
    lb: 'Lëtzebuerger Hëllefe-Simulator fir digital Transformatioun an KI-Innovatioun vu KMU.',
    de: 'Luxemburger Fördersimulator für digitale Transformation und KI-Innovation von KMU.',
    it: 'Simulatore di sovvenzioni lussemburghesi per la trasformazione digitale e l\'innovazione IA delle PMI.',
    pt: 'Simulador de apoios luxemburgueses para a transformação digital e inovação IA das PME.',
  },
  'footer.nav': {
    fr: 'Navigation', en: 'Navigation', lb: 'Navigatioun', de: 'Navigation', it: 'Navigazione', pt: 'Navegação',
  },
  'footer.simulator': {
    fr: 'Simulateur', en: 'Simulator', lb: 'Simulator', de: 'Simulator', it: 'Simulatore', pt: 'Simulador',
  },
  'footer.agents': {
    fr: 'Agents IA', en: 'AI Agents', lb: 'KI Agenten', de: 'KI-Agenten', it: 'Agenti IA', pt: 'Agentes IA',
  },
  'footer.about': {
    fr: 'À propos', en: 'About', lb: 'Iwwer eis', de: 'Über uns', it: 'Chi siamo', pt: 'Sobre nós',
  },
  'footer.pricing': {
    fr: 'Tarifs', en: 'Pricing', lb: 'Präisser', de: 'Preise', it: 'Prezzi', pt: 'Preços',
  },
  'footer.legal': {
    fr: 'Légal', en: 'Legal', lb: 'Rechtleches', de: 'Rechtliches', it: 'Legale', pt: 'Legal',
  },
  'footer.privacy': {
    fr: 'Confidentialité', en: 'Privacy', lb: 'Dateschutz', de: 'Datenschutz', it: 'Privacy', pt: 'Privacidade',
  },
  'footer.terms': {
    fr: 'Conditions', en: 'Terms', lb: 'Konditiounen', de: 'Nutzungsbedingungen', it: 'Termini', pt: 'Termos',
  },
  'footer.contact': {
    fr: 'Contact', en: 'Contact', lb: 'Kontakt', de: 'Kontakt', it: 'Contatto', pt: 'Contacto',
  },
  'footer.rights': {
    fr: '© 2025 Forge. Tous droits réservés.', en: '© 2025 Forge. All rights reserved.', lb: '© 2025 Forge. All Rechter reservéiert.', de: '© 2025 Forge. Alle Rechte vorbehalten.', it: '© 2025 Forge. Tutti i diritti riservati.', pt: '© 2025 Forge. Todos os direitos reservados.',
  },

  // ─── PageNavbar ───
  'nav.about': {
    fr: 'À propos', en: 'About', lb: 'Iwwer eis', de: 'Über uns', it: 'Chi siamo', pt: 'Sobre',
  },
  'nav.pricing': {
    fr: 'Tarifs', en: 'Pricing', lb: 'Präisser', de: 'Preise', it: 'Prezzi', pt: 'Preços',
  },

  // ─── Agent Detail Page ───
  'agent.backToDirectory': {
    fr: 'Retour à l\'annuaire', en: 'Back to directory', lb: 'Zréck zum Verzeichnis', de: 'Zurück zum Verzeichnis', it: 'Torna alla directory', pt: 'Voltar ao diretório',
  },
  'agent.visitSite': {
    fr: 'Visiter le site', en: 'Visit website', lb: 'Websäit besichen', de: 'Website besuchen', it: 'Visita il sito', pt: 'Visitar o site',
  },
  'agent.vendor': {
    fr: 'Éditeur', en: 'Vendor', lb: 'Ubidder', de: 'Anbieter', it: 'Fornitore', pt: 'Fornecedor',
  },
  'agent.founded': {
    fr: 'Fondé en', en: 'Founded', lb: 'Gegrënnt', de: 'Gegründet', it: 'Fondato', pt: 'Fundado em',
  },
  'agent.headquarters': {
    fr: 'Siège social', en: 'Headquarters', lb: 'Haaptsëtz', de: 'Hauptsitz', it: 'Sede', pt: 'Sede',
  },
  'agent.pricing': {
    fr: 'Tarifs', en: 'Pricing', lb: 'Präisser', de: 'Preise', it: 'Prezzi', pt: 'Preços',
  },
  'agent.euCompliance': {
    fr: 'Conformité UE', en: 'EU Compliance', lb: 'EU-Konformitéit', de: 'EU-Konformität', it: 'Conformità UE', pt: 'Conformidade UE',
  },
  'agent.gdpr': {
    fr: 'RGPD', en: 'GDPR', lb: 'RGPD', de: 'DSGVO', it: 'GDPR', pt: 'RGPD',
  },
  'agent.euAiAct': {
    fr: 'EU AI Act', en: 'EU AI Act', lb: 'EU AI Act', de: 'EU AI Act', it: 'EU AI Act', pt: 'EU AI Act',
  },
  'agent.dataResidency': {
    fr: 'Résidence de données UE', en: 'EU Data Residency', lb: 'EU-Datenresidenz', de: 'EU-Datenresidenz', it: 'Residenza dati UE', pt: 'Residência de dados UE',
  },
  'agent.dpa': {
    fr: 'DPA disponible', en: 'DPA Available', lb: 'DPA verfügbar', de: 'AVV verfügbar', it: 'DPA disponibile', pt: 'DPA disponível',
  },
  'agent.certifications': {
    fr: 'Certifications', en: 'Certifications', lb: 'Zertifizéierungen', de: 'Zertifizierungen', it: 'Certificazioni', pt: 'Certificações',
  },
  'agent.dataLocation': {
    fr: 'Localisation des données', en: 'Data Location', lb: 'Datenstanduert', de: 'Datenstandort', it: 'Localizzazione dati', pt: 'Localização dos dados',
  },
  'agent.complianceNote': {
    fr: 'Note de conformité', en: 'Compliance Note', lb: 'Konformitéitsnotiz', de: 'Konformitätshinweis', it: 'Nota di conformità', pt: 'Nota de conformidade',
  },
  'agent.yes': {
    fr: 'Oui', en: 'Yes', lb: 'Jo', de: 'Ja', it: 'Sì', pt: 'Sim',
  },
  'agent.no': {
    fr: 'Non', en: 'No', lb: 'Nee', de: 'Nein', it: 'No', pt: 'Não',
  },
  'agent.partial': {
    fr: 'Partiel', en: 'Partial', lb: 'Deelweis', de: 'Teilweise', it: 'Parziale', pt: 'Parcial',
  },
  'agent.noCertifications': {
    fr: 'Aucune certification connue', en: 'No known certifications', lb: 'Keng bekannt Zertifizéierungen', de: 'Keine bekannten Zertifizierungen', it: 'Nessuna certificazione nota', pt: 'Nenhuma certificação conhecida',
  },

  // ─── About Page ───
  'about.title': {
    fr: 'À propos de Forge', en: 'About Forge', lb: 'Iwwer Forge', de: 'Über Forge', it: 'Chi è Forge', pt: 'Sobre o Forge',
  },
  'about.mission.title': {
    fr: 'Notre mission', en: 'Our Mission', lb: 'Eis Missioun', de: 'Unsere Mission', it: 'La nostra missione', pt: 'A nossa missão',
  },
  'about.mission.text': {
    fr: 'Forge aide les PME luxembourgeoises à naviguer dans l\'écosystème des aides publiques pour leur transformation digitale et l\'adoption de l\'intelligence artificielle. Notre simulateur gratuit identifie en 2 minutes les programmes de subventions auxquels vous êtes éligible.',
    en: 'Forge helps Luxembourg SMEs navigate the public funding ecosystem for their digital transformation and AI adoption. Our free simulator identifies in 2 minutes the grant programs you are eligible for.',
    lb: 'Forge hëlleft lëtzebuerger KMU, sech am ëffentleche Fördersystem fir hir digital Transformatioun an KI-Adoptioun ze orientéieren. Eise gratis Simulator identifizéiert an 2 Minutten déi Subventioune fir déi Dir eligibel sidd.',
    de: 'Forge hilft luxemburgischen KMU, sich im öffentlichen Fördersystem für ihre digitale Transformation und KI-Adoption zurechtzufinden. Unser kostenloser Simulator identifiziert in 2 Minuten die Förderprogramme, für die Sie berechtigt sind.',
    it: 'Forge aiuta le PMI lussemburghesi a navigare nell\'ecosistema dei finanziamenti pubblici per la trasformazione digitale e l\'adozione dell\'IA. Il nostro simulatore gratuito identifica in 2 minuti i programmi di sovvenzione per i quali siete ammissibili.',
    pt: 'O Forge ajuda as PME luxemburguesas a navegar no ecossistema de apoios públicos para a sua transformação digital e adoção de IA. O nosso simulador gratuito identifica em 2 minutos os programas de subsídios aos quais é elegível.',
  },
  'about.why.title': {
    fr: 'Pourquoi Forge ?', en: 'Why Forge?', lb: 'Firwat Forge?', de: 'Warum Forge?', it: 'Perché Forge?', pt: 'Porquê Forge?',
  },
  'about.why.text': {
    fr: 'Le Luxembourg offre des programmes de financement parmi les plus généreux d\'Europe pour la digitalisation des PME, mais beaucoup d\'entreprises ne connaissent pas ces aides ou trouvent les démarches complexes. Forge simplifie ce processus.',
    en: 'Luxembourg offers some of Europe\'s most generous funding programs for SME digitalization, but many companies are unaware of these grants or find the process complex. Forge simplifies this process.',
    lb: 'Lëtzebuerg bitt ee vun de generéisten Förderprogrammer an Europa fir d\'Digitaliséierung vu KMU, awer vill Firmen kennen dës Hëllefe net oder fannen de Prozess komplex. Forge vereinfacht dëse Prozess.',
    de: 'Luxemburg bietet einige der großzügigsten Förderprogramme Europas für die Digitalisierung von KMU, aber viele Unternehmen kennen diese Förderungen nicht oder finden den Prozess komplex. Forge vereinfacht diesen Prozess.',
    it: 'Il Lussemburgo offre alcuni dei programmi di finanziamento più generosi d\'Europa per la digitalizzazione delle PMI, ma molte aziende non conoscono questi aiuti o trovano il processo complesso. Forge semplifica questo processo.',
    pt: 'O Luxemburgo oferece alguns dos programas de financiamento mais generosos da Europa para a digitalização das PME, mas muitas empresas desconhecem estes apoios ou consideram o processo complexo. O Forge simplifica este processo.',
  },
  'about.programs.title': {
    fr: '5 programmes référencés', en: '5 referenced programs', lb: '5 referenzéiert Programmer', de: '5 referenzierte Programme', it: '5 programmi referenziati', pt: '5 programas referenciados',
  },
  'about.programs.text': {
    fr: 'Nous analysons votre éligibilité pour les 5 principaux programmes luxembourgeois : SME Package Digital, SME Package IA, Fit 4 Digital, Fit 4 AI et Fit 4 Innovation. Jusqu\'à 25 000 € de subvention et 70 % de couverture.',
    en: 'We analyze your eligibility for the 5 main Luxembourg programs: SME Package Digital, SME Package AI, Fit 4 Digital, Fit 4 AI and Fit 4 Innovation. Up to €25,000 in grants and 70% coverage.',
    lb: 'Mir analyséieren Är Eligibilitéit fir déi 5 Haaptprogrammer: SME Package Digital, SME Package IA, Fit 4 Digital, Fit 4 AI a Fit 4 Innovation. Bis zu 25.000 € Subventioun an 70 % Deckung.',
    de: 'Wir analysieren Ihre Berechtigung für die 5 Hauptprogramme: SME Package Digital, SME Package AI, Fit 4 Digital, Fit 4 AI und Fit 4 Innovation. Bis zu 25.000 € Förderung und 70 % Abdeckung.',
    it: 'Analizziamo la vostra ammissibilità per i 5 principali programmi: SME Package Digital, SME Package IA, Fit 4 Digital, Fit 4 AI e Fit 4 Innovation. Fino a 25.000 € di sovvenzione e 70 % di copertura.',
    pt: 'Analisamos a sua elegibilidade para os 5 principais programas: SME Package Digital, SME Package IA, Fit 4 Digital, Fit 4 AI e Fit 4 Innovation. Até 25.000 € de subsídio e 70 % de cobertura.',
  },
  'about.cta': {
    fr: 'Simuler mes aides', en: 'Simulate my funding', lb: 'Meng Hëllefen simuléieren', de: 'Meine Förderung simulieren', it: 'Simula i miei finanziamenti', pt: 'Simular os meus apoios',
  },

  // ─── Pricing Page ───
  'pricing.title': {
    fr: 'Tarifs', en: 'Pricing', lb: 'Präisser', de: 'Preise', it: 'Prezzi', pt: 'Preços',
  },
  'pricing.subtitle': {
    fr: 'Le simulateur est gratuit. Pour aller plus loin, nous proposons un accompagnement personnalisé.',
    en: 'The simulator is free. To go further, we offer personalized support.',
    lb: 'De Simulator ass gratis. Fir weider ze goen, bidde mir personaliséiert Begleedung.',
    de: 'Der Simulator ist kostenlos. Für weitergehende Unterstützung bieten wir individuelle Begleitung.',
    it: 'Il simulatore è gratuito. Per andare oltre, offriamo supporto personalizzato.',
    pt: 'O simulador é gratuito. Para ir mais longe, oferecemos acompanhamento personalizado.',
  },
  'pricing.free.title': {
    fr: 'Simulateur', en: 'Simulator', lb: 'Simulator', de: 'Simulator', it: 'Simulatore', pt: 'Simulador',
  },
  'pricing.free.price': {
    fr: 'Gratuit', en: 'Free', lb: 'Gratis', de: 'Kostenlos', it: 'Gratuito', pt: 'Gratuito',
  },
  'pricing.free.f1': {
    fr: 'Simulation d\'éligibilité en 2 min', en: 'Eligibility simulation in 2 min', lb: 'Eligibilitéitssimulatioun an 2 Min', de: 'Förderfähigkeitssimulation in 2 Min', it: 'Simulazione ammissibilità in 2 min', pt: 'Simulação de elegibilidade em 2 min',
  },
  'pricing.free.f2': {
    fr: '5 programmes analysés', en: '5 programs analyzed', lb: '5 Programmer analyséiert', de: '5 Programme analysiert', it: '5 programmi analizzati', pt: '5 programas analisados',
  },
  'pricing.free.f3': {
    fr: 'Recommandations de projets', en: 'Project recommendations', lb: 'Projetsempfehlungen', de: 'Projektempfehlungen', it: 'Raccomandazioni di progetti', pt: 'Recomendações de projetos',
  },
  'pricing.free.f4': {
    fr: 'Estimation des coûts et aides', en: 'Cost and grant estimates', lb: 'Käschten- a Hëllefeschätzungen', de: 'Kosten- und Förderschätzungen', it: 'Stima costi e sovvenzioni', pt: 'Estimativa de custos e apoios',
  },
  'pricing.starter.title': {
    fr: 'Accompagnement', en: 'Support', lb: 'Begleedung', de: 'Begleitung', it: 'Accompagnamento', pt: 'Acompanhamento',
  },
  'pricing.starter.price': {
    fr: '490 €', en: '€490', lb: '490 €', de: '490 €', it: '490 €', pt: '490 €',
  },
  'pricing.starter.f1': {
    fr: 'Diagnostic digital complet', en: 'Complete digital assessment', lb: 'Komplett digital Diagnose', de: 'Vollständige digitale Diagnose', it: 'Diagnosi digitale completa', pt: 'Diagnóstico digital completo',
  },
  'pricing.starter.f2': {
    fr: 'Montage du dossier de subvention', en: 'Grant application support', lb: 'Subventiounsdossier-Montage', de: 'Förderantrag-Erstellung', it: 'Preparazione domanda sovvenzione', pt: 'Montagem do processo de subsídio',
  },
  'pricing.starter.f3': {
    fr: 'Suivi avec Luxinnovation', en: 'Follow-up with Luxinnovation', lb: 'Suivi mat Luxinnovation', de: 'Begleitung bei Luxinnovation', it: 'Seguito con Luxinnovation', pt: 'Seguimento com a Luxinnovation',
  },
  'pricing.starter.f4': {
    fr: 'Rapport détaillé PDF', en: 'Detailed PDF report', lb: 'Detailléierte PDF-Rapport', de: 'Detaillierter PDF-Bericht', it: 'Rapporto dettagliato PDF', pt: 'Relatório detalhado PDF',
  },
  'pricing.pro.title': {
    fr: 'Implémentation', en: 'Implementation', lb: 'Implementatioun', de: 'Implementierung', it: 'Implementazione', pt: 'Implementação',
  },
  'pricing.pro.price': {
    fr: 'Sur devis', en: 'Custom quote', lb: 'Op Ufro', de: 'Auf Anfrage', it: 'Su richiesta', pt: 'Sob consulta',
  },
  'pricing.pro.f1': {
    fr: 'Tout de l\'accompagnement', en: 'Everything in Support', lb: 'Alles vun der Begleedung', de: 'Alles aus Begleitung', it: 'Tutto dell\'accompagnamento', pt: 'Tudo do acompanhamento',
  },
  'pricing.pro.f2': {
    fr: 'Implémentation technique complète', en: 'Full technical implementation', lb: 'Komplett technesch Implementatioun', de: 'Vollständige technische Implementierung', it: 'Implementazione tecnica completa', pt: 'Implementação técnica completa',
  },
  'pricing.pro.f3': {
    fr: 'Sélection et déploiement d\'outils IA', en: 'AI tool selection and deployment', lb: 'KI-Tool Auswiel an Deployment', de: 'KI-Tool-Auswahl und -Bereitstellung', it: 'Selezione e deployment strumenti IA', pt: 'Seleção e implementação de ferramentas IA',
  },
  'pricing.pro.f4': {
    fr: 'Formation de votre équipe', en: 'Team training', lb: 'Formatioun vun Ärem Team', de: 'Schulung Ihres Teams', it: 'Formazione del team', pt: 'Formação da equipa',
  },
  'pricing.cta.free': {
    fr: 'Commencer gratuitement', en: 'Start for free', lb: 'Gratis ufänken', de: 'Kostenlos starten', it: 'Inizia gratis', pt: 'Começar gratuitamente',
  },
  'pricing.cta.contact': {
    fr: 'Nous contacter', en: 'Contact us', lb: 'Kontaktéiert eis', de: 'Kontaktieren Sie uns', it: 'Contattaci', pt: 'Contacte-nos',
  },
  'pricing.recommended': {
    fr: 'Recommandé', en: 'Recommended', lb: 'Empfohlen', de: 'Empfohlen', it: 'Consigliato', pt: 'Recomendado',
  },
  'pricing.perProject': {
    fr: 'par projet', en: 'per project', lb: 'pro Projet', de: 'pro Projekt', it: 'per progetto', pt: 'por projeto',
  },
  'pricing.agents.title': {
    fr: 'Tarifs des outils IA', en: 'AI Tools Pricing', lb: 'KI-Tools Präisser', de: 'KI-Tools Preise', it: 'Prezzi strumenti IA', pt: 'Preços ferramentas IA',
  },
  'pricing.agents.subtitle': {
    fr: 'Comparez les prix des principaux outils IA pour votre entreprise.', en: 'Compare prices of the main AI tools for your business.', lb: 'Vergläicht d\'Präisser vun den Haapt-KI-Tools fir Äert Geschäft.', de: 'Vergleichen Sie die Preise der wichtigsten KI-Tools für Ihr Unternehmen.', it: 'Confronta i prezzi dei principali strumenti IA per la tua azienda.', pt: 'Compare os preços das principais ferramentas IA para a sua empresa.',
  },

  // ─── Privacy & Terms ───
  'privacy.title': {
    fr: 'Politique de confidentialité', en: 'Privacy Policy', lb: 'Dateschutzpolitik', de: 'Datenschutzrichtlinie', it: 'Politica sulla privacy', pt: 'Política de privacidade',
  },
  'privacy.lastUpdated': {
    fr: 'Dernière mise à jour', en: 'Last updated', lb: 'Lescht Aktualiséierung', de: 'Zuletzt aktualisiert', it: 'Ultimo aggiornamento', pt: 'Última atualização',
  },
  'terms.title': {
    fr: 'Conditions d\'utilisation', en: 'Terms of Service', lb: 'Notzungsbedingungen', de: 'Nutzungsbedingungen', it: 'Termini di servizio', pt: 'Termos de serviço',
  },
  'terms.lastUpdated': {
    fr: 'Dernière mise à jour', en: 'Last updated', lb: 'Lescht Aktualiséierung', de: 'Zuletzt aktualisiert', it: 'Ultimo aggiornamento', pt: 'Última atualização',
  },

  // ─── Report / PDF ───
  'results.downloadPdf': {
    fr: 'Télécharger le rapport PDF', en: 'Download PDF report', lb: 'PDF-Rapport eroflueden', de: 'PDF-Bericht herunterladen', it: 'Scarica rapporto PDF', pt: 'Descarregar relatório PDF',
  },
  'report.title': {
    fr: 'Rapport d\'éligibilité — Forge', en: 'Eligibility Report — Forge', lb: 'Eligibilitéitsrapport — Forge', de: 'Förderfähigkeitsbericht — Forge', it: 'Rapporto di ammissibilità — Forge', pt: 'Relatório de elegibilidade — Forge',
  },
  'report.generatedOn': {
    fr: 'Généré le', en: 'Generated on', lb: 'Generéiert den', de: 'Erstellt am', it: 'Generato il', pt: 'Gerado em',
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
