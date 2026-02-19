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
    fr: 'Digitalisez votre PME grâce aux aides luxembourgeoises',
    en: 'Digitalize your SME with Luxembourg grants',
    lb: 'Digitaliséiert Är KMU mat Lëtzebuerger Hëllefen',
    de: 'Digitalisieren Sie Ihr KMU mit Luxemburger Förderungen',
    it: 'Digitalizzate la vostra PMI con le sovvenzioni lussemburghesi',
    pt: 'Digitalize a sua PME com os apoios luxemburgueses',
  },
  'hero.subtitle': {
    fr: 'Identifiez les subventions auxquelles votre entreprise est éligible et obtenez une estimation personnalisée de vos financements.',
    en: 'Identify which grants your business qualifies for and get a personalized estimate of your funding.',
    lb: 'Identifizéiert d\'Subventiounen op déi Äert Betrib Urecht huet a kritt eng personaliséiert Schätzung vun Ärer Finanzéierung.',
    de: 'Ermitteln Sie, für welche Zuschüsse Ihr Unternehmen berechtigt ist, und erhalten Sie eine individuelle Förderungsschätzung.',
    it: 'Identificate le sovvenzioni a cui la vostra azienda ha diritto e ottenete una stima personalizzata dei vostri finanziamenti.',
    pt: 'Identifique os subsídios aos quais a sua empresa é elegível e obtenha uma estimativa personalizada do seu financiamento.',
  },
  'hero.cta': {
    fr: 'Estimer mes aides', en: 'Estimate my funding', lb: 'Meng Hëllefen schätzen', de: 'Meine Förderung schätzen', it: 'Stima i miei finanziamenti', pt: 'Estimar os meus apoios',
  },
  'hero.stat1.value': {
    fr: '10 sec', en: '10 sec', lb: '10 Sek', de: '10 Sek', it: '10 sec', pt: '10 seg',
  },
  'hero.stat1.label': {
    fr: 'pour obtenir vos résultats', en: 'to get your results', lb: 'fir Är Resultater ze kréien', de: 'für Ihre Ergebnisse', it: 'per ottenere i risultati', pt: 'para obter os resultados',
  },
  'hero.stat2.value': {
    fr: '100%', en: '100%', lb: '100%', de: '100%', it: '100%', pt: '100%',
  },
  'hero.stat2.label': {
    fr: 'gratuit et confidentiel', en: 'free and confidential', lb: 'gratis a vertraulech', de: 'kostenlos und vertraulich', it: 'gratuito e confidenziale', pt: 'gratuito e confidencial',
  },
  'hero.stat3.value': {
    fr: '6', en: '6', lb: '6', de: '6', it: '6', pt: '6',
  },
  'hero.stat3.label': {
    fr: 'programmes analysés', en: 'programs analyzed', lb: 'Programmer analyséiert', de: 'analysierte Programme', it: 'programmi analizzati', pt: 'programas analisados',
  },
  'hero.trust': {
    fr: 'Programmes référencés', en: 'Referenced programs', lb: 'Referenzéiert Programmer', de: 'Referenzierte Programme', it: 'Programmi di riferimento', pt: 'Programas referenciados',
  },
  'hero.cta2': {
    fr: 'Parler à un expert', en: 'Talk to an expert', lb: 'Mat engem Expert schwätzen', de: 'Mit einem Experten sprechen', it: 'Parlare con un esperto', pt: 'Falar com um especialista',
  },
  'hero.badge': {
    fr: 'Simulateur gratuit', en: 'Free simulator', lb: 'Gratis Simulator', de: 'Kostenloser Simulator', it: 'Simulatore gratuito', pt: 'Simulador gratuito',
  },
  'hero.partners': {
    fr: 'Basé sur les programmes publics de', en: 'Based on public programs from', lb: 'Baséiert op ëffentleche Programmer vun', de: 'Basierend auf öffentlichen Programmen von', it: 'Basato sui programmi pubblici di', pt: 'Baseado nos programas públicos de',
  },
  'hero.luxembourgBanner': {
    fr: 'Programmes référencés par la House of Entrepreneurship',
    en: 'Programs referenced by the House of Entrepreneurship',
    lb: 'Programmer referenzéiert vun der House of Entrepreneurship',
    de: 'Programme referenziert von der House of Entrepreneurship',
    it: 'Programmi referenziati dalla House of Entrepreneurship',
    pt: 'Programas referenciados pela House of Entrepreneurship',
  },

  'hero.card.label': {
    fr: 'Aides luxembourgeoises', en: 'Luxembourg grants', lb: 'Lëtzebuerger Hëllefen', de: 'Luxemburger Förderungen', it: 'Sovvenzioni lussemburghesi', pt: 'Apoios luxemburgueses',
  },
  'hero.card.perProgram': {
    fr: 'max. par programme', en: 'max. per program', lb: 'max. pro Programm', de: 'max. pro Programm', it: 'max. per programma', pt: 'máx. por programa',
  },
  'hero.card.fact1': {
    fr: '6 programmes — Digital, IA, Cybersécurité, Innovation', en: '6 programs — Digital, AI, Cybersecurity, Innovation', lb: '6 Programmer — Digital, KI, Cybersécherheet, Innovatioun', de: '6 Programme — Digital, KI, Cybersicherheit, Innovation', it: '6 programmi — Digitale, IA, Cybersicurezza, Innovazione', pt: '6 programas — Digital, IA, Cibersegurança, Inovação',
  },
  'hero.card.fact2': {
    fr: '50 % à 100 % de couverture selon le programme', en: '50% to 100% coverage depending on the program', lb: '50 % bis 100 % Deckung je no Programm', de: '50 % bis 100 % Abdeckung je nach Programm', it: 'Dal 50 % al 100 % di copertura secondo il programma', pt: '50 % a 100 % de cobertura conforme o programa',
  },
  'hero.card.fact3': {
    fr: 'Résultat en 10 secondes — gratuit et confidentiel', en: 'Results in 10 seconds — free and confidential', lb: 'Resultat an 10 Sekonnen — gratis a vertraulech', de: 'Ergebnis in 10 Sekunden — kostenlos und vertraulich', it: 'Risultato in 10 secondi — gratuito e confidenziale', pt: 'Resultado em 10 segundos — gratuito e confidencial',
  },

  // ─── How it works ───
  'howItWorks.title': {
    fr: 'Comment ça marche ?', en: 'How does it work?', lb: 'Wéi funktionéiert et?', de: 'Wie funktioniert es?', it: 'Come funziona?', pt: 'Como funciona?',
  },
  'howItWorks.subtitle': {
    fr: 'Trois étapes simples pour découvrir vos aides luxembourgeoises.', en: 'Three simple steps to discover your Luxembourg grants.', lb: 'Dräi einfach Schrëtt fir Är Lëtzebuerger Hëllefen z\'entdecken.', de: 'Drei einfache Schritte, um Ihre luxemburgischen Förderungen zu entdecken.', it: 'Tre semplici passaggi per scoprire le vostre sovvenzioni lussemburghesi.', pt: 'Três passos simples para descobrir os seus apoios luxemburgueses.',
  },
  'howItWorks.step1.title': {
    fr: 'Répondez au quiz', en: 'Take the quiz', lb: 'Beäntwert de Quiz', de: 'Machen Sie das Quiz', it: 'Rispondete al quiz', pt: 'Responda ao quiz',
  },
  'howItWorks.step1.desc': {
    fr: '6 questions sur votre entreprise, votre secteur et vos besoins digitaux.', en: '6 questions about your company, sector and digital needs.', lb: '6 Froen iwwer Äert Unternehmen, Äre Secteur an Är digital Bedierfnisser.', de: '6 Fragen zu Ihrem Unternehmen, Ihrer Branche und Ihren digitalen Bedürfnissen.', it: '6 domande sulla vostra azienda, settore ed esigenze digitali.', pt: '6 perguntas sobre a sua empresa, setor e necessidades digitais.',
  },
  'howItWorks.step2.title': {
    fr: 'Obtenez vos résultats', en: 'Get your results', lb: 'Kritt Är Resultater', de: 'Erhalten Sie Ihre Ergebnisse', it: 'Ottenete i risultati', pt: 'Obtenha os seus resultados',
  },
  'howItWorks.step2.desc': {
    fr: 'Découvrez les programmes éligibles avec les montants estimés et projets recommandés.', en: 'Discover eligible programs with estimated amounts and recommended projects.', lb: 'Entdeckt déi eligibel Programmer mat geschate Betréi a recommandéierte Projeten.', de: 'Entdecken Sie förderfähige Programme mit geschätzten Beträgen und empfohlenen Projekten.', it: 'Scoprite i programmi ammissibili con importi stimati e progetti consigliati.', pt: 'Descubra os programas elegíveis com montantes estimados e projetos recomendados.',
  },
  'howItWorks.step3.title': {
    fr: 'Contactez un expert', en: 'Contact an expert', lb: 'Kontaktéiert en Expert', de: 'Kontaktieren Sie einen Experten', it: 'Contattate un esperto', pt: 'Contacte um especialista',
  },
  'howItWorks.step3.desc': {
    fr: 'Un spécialiste vous accompagne gratuitement dans vos démarches d\'aides.', en: 'A specialist will guide you through the grant application process for free.', lb: 'E Spezialist begleet Iech gratis an Äre Hëllefsdemarchen.', de: 'Ein Spezialist begleitet Sie kostenlos durch den Antragsprocess.', it: 'Uno specialista vi guida gratuitamente nel processo di richiesta.', pt: 'Um especialista acompanha-o gratuitamente no processo de candidatura.',
  },

  // ─── CTA section ───
  'cta.title': {
    fr: 'Prêt à financer votre transformation digitale\u00A0?', en: 'Ready to fund your digital transformation?', lb: 'Prett fir Är digital Transformatioun ze finanzéieren?', de: 'Bereit, Ihre digitale Transformation zu finanzieren?', it: 'Pronti a finanziare la vostra trasformazione digitale?', pt: 'Pronto para financiar a sua transformação digital?',
  },
  'cta.subtitle': {
    fr: 'Simulez vos aides en 10 secondes ou contactez directement un expert pour vous accompagner.', en: 'Simulate your grants in 10 seconds or contact an expert directly for guidance.', lb: 'Simuléiert Är Hëllefen an 10 Sekonnen oder kontaktéiert direkt en Expert fir Begleedung.', de: 'Simulieren Sie Ihre Förderungen in 10 Sekunden oder kontaktieren Sie direkt einen Experten.', it: 'Simulate le vostre sovvenzioni in 10 secondi o contattate direttamente un esperto.', pt: 'Simule os seus apoios em 10 segundos ou contacte diretamente um especialista.',
  },
  'cta.contact': {
    fr: 'Contacter un expert', en: 'Contact an expert', lb: 'En Expert kontaktéieren', de: 'Experten kontaktieren', it: 'Contattare un esperto', pt: 'Contactar um especialista',
  },

  // ─── Features section ───
  'features.title': {
    fr: 'Tout ce qu\'il vous faut pour trouver vos aides', en: 'Everything you need to find your grants', lb: 'Alles wat Dir braucht fir Är Hëllefen ze fannen', de: 'Alles was Sie brauchen, um Ihre Förderungen zu finden', it: 'Tutto ciò di cui hai bisogno per trovare i tuoi finanziamenti', pt: 'Tudo o que precisa para encontrar os seus apoios',
  },
  'features.subtitle': {
    fr: 'Notre plateforme analyse votre profil et vous recommande les meilleurs programmes de financement luxembourgeois.', en: 'Our platform analyzes your profile and recommends the best Luxembourg funding programs.', lb: 'Eis Plattform analyséiert Äre Profil an empfiehlt Iech déi bescht Lëtzebuerger Finanzéierungsprogrammer.', de: 'Unsere Plattform analysiert Ihr Profil und empfiehlt die besten luxemburgischen Förderprogramme.', it: 'La nostra piattaforma analizza il tuo profilo e ti consiglia i migliori programmi di finanziamento lussemburghesi.', pt: 'A nossa plataforma analisa o seu perfil e recomenda os melhores programas de financiamento luxemburgueses.',
  },
  'features.1.title': {
    fr: 'Simulation d\'éligibilité', en: 'Eligibility simulation', lb: 'Eligibilitéitssimulatioun', de: 'Förderfähigkeitssimulation', it: 'Simulazione di ammissibilità', pt: 'Simulação de elegibilidade',
  },
  'features.1.desc': {
    fr: 'Répondez à 6 questions et obtenez vos résultats personnalisés en 10 secondes.', en: 'Answer 6 questions and get your personalized results in 10 seconds.', lb: 'Beäntwert 6 Froen a kritt Är personaliséiert Resultater an 10 Sekonnen.', de: 'Beantworten Sie 6 Fragen und erhalten Sie Ihre personalisierten Ergebnisse in 10 Sekunden.', it: 'Rispondi a 6 domande e ottieni i tuoi risultati personalizzati in 10 secondi.', pt: 'Responda a 6 perguntas e obtenha os seus resultados personalizados em 10 segundos.',
  },
  'features.2.title': {
    fr: '6 programmes d\'aides', en: '6 grant programs', lb: '6 Hëllefsprogrammer', de: '6 Förderprogramme', it: '6 programmi di sovvenzione', pt: '6 programas de apoio',
  },
  'features.2.desc': {
    fr: 'Nous analysons SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation et plus encore.', en: 'We analyze SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation and more.', lb: 'Mir analyséieren SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation a méi.', de: 'Wir analysieren SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation und mehr.', it: 'Analizziamo SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation e altro.', pt: 'Analisamos SME Package, Fit 4 Digital, Fit 4 AI, Fit 4 Innovation e mais.',
  },
  'features.3.title': {
    fr: 'Recommandations de projets', en: 'Project recommendations', lb: 'Projetempfehlungen', de: 'Projektempfehlungen', it: 'Raccomandazioni di progetti', pt: 'Recomendações de projetos',
  },
  'features.3.desc': {
    fr: 'Obtenez des idées concrètes de projets avec estimations de coûts et montants d\'aides.', en: 'Get concrete project ideas with cost estimates and grant amounts.', lb: 'Kritt konkret Projetideeën mat Käschteschätzungen an Hëllefsbetréi.', de: 'Erhalten Sie konkrete Projektideen mit Kostenschätzungen und Förderbeträgen.', it: 'Ottieni idee concrete di progetto con stime dei costi e importi delle sovvenzioni.', pt: 'Obtenha ideias concretas de projetos com estimativas de custos e montantes de apoio.',
  },
  'features.4.title': {
    fr: 'Répertoire d\'agents IA', en: 'AI agents directory', lb: 'KI-Agenten Verzeechnes', de: 'KI-Agenten-Verzeichnis', it: 'Directory degli agenti IA', pt: 'Diretório de agentes IA',
  },
  'features.4.desc': {
    fr: 'Parcourez plus de 15 outils IA avec infos conformité RGPD et tarifs.', en: 'Browse 15+ AI tools with GDPR compliance info and pricing.', lb: 'Entdeckt méi wéi 15 KI-Tools mat DSGVO-Konformitéitsinfoen a Präisser.', de: 'Durchsuchen Sie über 15 KI-Tools mit DSGVO-Konformitätsinfos und Preisen.', it: 'Sfoglia oltre 15 strumenti IA con informazioni sulla conformità GDPR e prezzi.', pt: 'Explore mais de 15 ferramentas de IA com informações de conformidade RGPD e preços.',
  },
  'features.5.title': {
    fr: 'Accompagnement expert', en: 'Expert support', lb: 'Expert Begleedung', de: 'Expertenbegleitung', it: 'Supporto esperto', pt: 'Acompanhamento especializado',
  },
  'features.5.desc': {
    fr: 'Connectez-vous avec des spécialistes pour vos demandes d\'aides et projets digitaux.', en: 'Connect with specialists for grant applications and digital projects.', lb: 'Verbannt Iech mat Spezialisten fir Är Hëllefsufroe a digital Projeten.', de: 'Verbinden Sie sich mit Spezialisten für Förderanträge und digitale Projekte.', it: 'Connettiti con specialisti per domande di sovvenzione e progetti digitali.', pt: 'Conecte-se com especialistas para candidaturas a apoios e projetos digitais.',
  },
  'features.6.title': {
    fr: '100% confidentiel', en: '100% confidential', lb: '100% vertraulech', de: '100% vertraulich', it: '100% confidenziale', pt: '100% confidencial',
  },
  'features.6.desc': {
    fr: 'Vos données restent privées. Pas de compte requis, pas de spam.', en: 'Your data stays private. No account required, no spam.', lb: 'Är Daten bleiwe privat. Kee Konto néideg, kee Spam.', de: 'Ihre Daten bleiben privat. Kein Konto erforderlich, kein Spam.', it: 'I tuoi dati restano privati. Nessun account richiesto, nessuno spam.', pt: 'Os seus dados permanecem privados. Sem conta necessária, sem spam.',
  },

  // ─── FAQ section ───
  'faq.title': {
    fr: 'Questions fréquemment posées', en: 'Frequently asked questions', lb: 'Dacks gestallte Froen', de: 'Häufig gestellte Fragen', it: 'Domande frequenti', pt: 'Perguntas frequentes',
  },
  'faq.1.q': {
    fr: 'Le simulateur est-il vraiment gratuit ?', en: 'Is the simulator really free?', lb: 'Ass de Simulator wierklech gratis?', de: 'Ist der Simulator wirklich kostenlos?', it: 'Il simulatore è davvero gratuito?', pt: 'O simulador é realmente gratuito?',
  },
  'faq.1.a': {
    fr: 'Oui, le simulateur est 100% gratuit et sans engagement. Vous répondez à 6 questions et obtenez vos résultats instantanément.', en: 'Yes, the simulator is 100% free with no commitment. You answer 6 questions and get your results instantly.', lb: 'Jo, de Simulator ass 100% gratis an ouni Engagement. Dir beäntwert 6 Froen a kritt Är Resultater direkt.', de: 'Ja, der Simulator ist 100% kostenlos und unverbindlich. Sie beantworten 6 Fragen und erhalten Ihre Ergebnisse sofort.', it: 'Sì, il simulatore è 100% gratuito e senza impegno. Rispondi a 6 domande e ottieni i tuoi risultati istantaneamente.', pt: 'Sim, o simulador é 100% gratuito e sem compromisso. Responde a 6 perguntas e obtém os seus resultados instantaneamente.',
  },
  'faq.2.q': {
    fr: 'Quels programmes sont analysés ?', en: 'What programs are analyzed?', lb: 'Wéi eng Programmer ginn analyséiert?', de: 'Welche Programme werden analysiert?', it: 'Quali programmi vengono analizzati?', pt: 'Que programas são analisados?',
  },
  'faq.2.a': {
    fr: 'Nous analysons 6 programmes luxembourgeois : SME Package Digital, SME Package AI, SME Package Cybersecurity, Fit 4 Digital, Fit 4 AI et Fit 4 Innovation.', en: 'We analyze 6 Luxembourg programs: SME Package Digital, SME Package AI, SME Package Cybersecurity, Fit 4 Digital, Fit 4 AI and Fit 4 Innovation.', lb: 'Mir analyséieren 6 Lëtzebuerger Programmer: SME Package Digital, SME Package AI, SME Package Cybersecurity, Fit 4 Digital, Fit 4 AI a Fit 4 Innovation.', de: 'Wir analysieren 6 luxemburgische Programme: SME Package Digital, SME Package AI, SME Package Cybersecurity, Fit 4 Digital, Fit 4 AI und Fit 4 Innovation.', it: 'Analizziamo 6 programmi lussemburghesi: SME Package Digital, SME Package AI, SME Package Cybersecurity, Fit 4 Digital, Fit 4 AI e Fit 4 Innovation.', pt: 'Analisamos 6 programas luxemburgueses: SME Package Digital, SME Package AI, SME Package Cybersecurity, Fit 4 Digital, Fit 4 AI e Fit 4 Innovation.',
  },
  'faq.3.q': {
    fr: 'Qui peut bénéficier de ces aides ?', en: 'Who can benefit from these grants?', lb: 'Wien kann vun dësen Hëllefen profitéieren?', de: 'Wer kann von diesen Förderungen profitieren?', it: 'Chi può beneficiare di queste sovvenzioni?', pt: 'Quem pode beneficiar destes apoios?',
  },
  'faq.3.a': {
    fr: 'Toute PME établie au Luxembourg avec une autorisation d\'établissement. La plupart des secteurs sont éligibles, y compris HORECA, commerce, artisanat, services et industrie.', en: 'Any SME established in Luxembourg with a business permit. Most sectors are eligible including HORECA, retail, crafts, services and manufacturing.', lb: 'All KMU déi zu Lëtzebuerg etabléiert sinn mat enger Geschäftsgenehmegung. Déi meescht Secteuren sinn eligible, inklusiv HORECA, Handel, Handwierk, Servicer an Industrie.', de: 'Jedes KMU mit Sitz in Luxemburg und einer Geschäftsgenehmigung. Die meisten Branchen sind förderfähig, einschließlich HORECA, Einzelhandel, Handwerk, Dienstleistungen und Industrie.', it: 'Qualsiasi PMI stabilita in Lussemburgo con un permesso commerciale. La maggior parte dei settori è ammissibile, inclusi HORECA, commercio, artigianato, servizi e manifattura.', pt: 'Qualquer PME estabelecida no Luxemburgo com uma autorização de estabelecimento. A maioria dos setores é elegível, incluindo HORECA, comércio, artesanato, serviços e indústria.',
  },
  'faq.4.q': {
    fr: 'Combien puis-je obtenir ?', en: 'How much can I get?', lb: 'Wéi vill kann ech kréien?', de: 'Wie viel kann ich bekommen?', it: 'Quanto posso ottenere?', pt: 'Quanto posso obter?',
  },
  'faq.4.a': {
    fr: 'Selon votre profil, vous pouvez recevoir jusqu\'à 25 000 € d\'aides avec jusqu\'à 70% de vos coûts de projet couverts.', en: 'Depending on your profile, you can receive up to €25,000 in grants with up to 70% of your project costs covered.', lb: 'Ofhängeg vun Ärem Profil kënnt Dir bis zu 25.000 € u Hëllefen kréien mat bis zu 70% vun Äre Projetkäschten gedeckt.', de: 'Je nach Profil können Sie bis zu 25.000 € an Förderungen erhalten, wobei bis zu 70% Ihrer Projektkosten gedeckt werden.', it: 'A seconda del tuo profilo, puoi ricevere fino a 25.000 € in sovvenzioni con fino al 70% dei costi del tuo progetto coperti.', pt: 'Dependendo do seu perfil, pode receber até 25.000 € em apoios com até 70% dos custos do seu projeto cobertos.',
  },
  'faq.5.q': {
    fr: 'Combien de temps prend le processus ?', en: 'How long does the process take?', lb: 'Wéi laang dauert de Prozess?', de: 'Wie lange dauert der Prozess?', it: 'Quanto tempo richiede il processo?', pt: 'Quanto tempo demora o processo?',
  },
  'faq.5.a': {
    fr: 'La simulation prend 10 secondes. Si vous êtes éligible, le processus de demande d\'aide prend généralement 4 à 8 semaines selon le programme.', en: 'The simulation takes 10 seconds. If you\'re eligible, the grant application process typically takes 4-8 weeks depending on the program.', lb: 'D\'Simulatioun dauert 10 Sekonnen. Wann Dir eligible sidd, dauert de Hëllefsuprozess normalerweis 4-8 Wochen ofhängeg vum Programm.', de: 'Die Simulation dauert 10 Sekunden. Wenn Sie förderfähig sind, dauert der Antragsprocess in der Regel 4-8 Wochen je nach Programm.', it: 'La simulazione richiede 10 secondi. Se sei ammissibile, il processo di domanda di sovvenzione richiede in genere 4-8 settimane a seconda del programma.', pt: 'A simulação demora 10 segundos. Se for elegível, o processo de candidatura ao apoio demora normalmente 4 a 8 semanas dependendo do programa.',
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
    fr: 'Non, mais dans la Grande Région',
    en: 'No, but in the Greater Region',
    lb: 'Nee, awer an der Groussregioun',
    de: 'Nein, aber in der Großregion',
    it: 'No, ma nella Grande Regione',
    pt: 'Não, mas na Grande Região',
  },
  'q3.o4': {
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

  // ─── Question 7 — Annual revenue ───
  'q7.title': {
    fr: 'Quel est le chiffre d\'affaires annuel de votre entreprise ?',
    en: 'What is your company\'s annual revenue?',
    lb: 'Wéi héich ass den Joresëmsaz vun Ärem Unternehmen?',
    de: 'Wie hoch ist der Jahresumsatz Ihres Unternehmens?',
    it: 'Qual è il fatturato annuo della vostra azienda?',
    pt: 'Qual é a faturação anual da sua empresa?',
  },
  'q7.o1': {
    fr: 'Moins de 100 000 €', en: 'Under €100,000', lb: 'Manner wéi 100.000 €', de: 'Unter 100.000 €', it: 'Meno di 100.000 €', pt: 'Menos de 100.000 €',
  },
  'q7.o2': {
    fr: '100 000 € – 500 000 €', en: '€100,000 – €500,000', lb: '100.000 € – 500.000 €', de: '100.000 € – 500.000 €', it: '100.000 € – 500.000 €', pt: '100.000 € – 500.000 €',
  },
  'q7.o3': {
    fr: '500 000 € – 2 000 000 €', en: '€500,000 – €2,000,000', lb: '500.000 € – 2.000.000 €', de: '500.000 € – 2.000.000 €', it: '500.000 € – 2.000.000 €', pt: '500.000 € – 2.000.000 €',
  },
  'q7.o4': {
    fr: 'Plus de 2 000 000 €', en: 'Over €2,000,000', lb: 'Méi wéi 2.000.000 €', de: 'Über 2.000.000 €', it: 'Più di 2.000.000 €', pt: 'Mais de 2.000.000 €',
  },

  // ─── Question 8 — Project budget ───
  'q8.title': {
    fr: 'Quel budget envisagez-vous pour votre projet digital / IA ?',
    en: 'What budget are you considering for your digital / AI project?',
    lb: 'Wéi vill Budget plangt Dir fir Äert digitaalt / KI Projet?',
    de: 'Welches Budget planen Sie für Ihr Digital- / KI-Projekt?',
    it: 'Quale budget prevedete per il vostro progetto digitale / IA?',
    pt: 'Que orçamento prevê para o seu projeto digital / IA?',
  },
  'q8.o1': {
    fr: 'Moins de 5 000 €', en: 'Under €5,000', lb: 'Manner wéi 5.000 €', de: 'Unter 5.000 €', it: 'Meno di 5.000 €', pt: 'Menos de 5.000 €',
  },
  'q8.o2': {
    fr: '5 000 € – 15 000 €', en: '€5,000 – €15,000', lb: '5.000 € – 15.000 €', de: '5.000 € – 15.000 €', it: '5.000 € – 15.000 €', pt: '5.000 € – 15.000 €',
  },
  'q8.o3': {
    fr: '15 000 € – 50 000 €', en: '€15,000 – €50,000', lb: '15.000 € – 50.000 €', de: '15.000 € – 50.000 €', it: '15.000 € – 50.000 €', pt: '15.000 € – 50.000 €',
  },
  'q8.o4': {
    fr: 'Plus de 50 000 €', en: 'Over €50,000', lb: 'Méi wéi 50.000 €', de: 'Über 50.000 €', it: 'Più di 50.000 €', pt: 'Mais de 50.000 €',
  },

  // ─── Question 9 — Previous subsidies ───
  'q9.title': {
    fr: 'Avez-vous déjà bénéficié d\'aides publiques luxembourgeoises ?',
    en: 'Have you already received Luxembourg public subsidies?',
    lb: 'Hutt Dir schonn lëtzebuerger ëffentlech Hëllefe kritt?',
    de: 'Haben Sie bereits luxemburgische öffentliche Förderungen erhalten?',
    it: 'Avete già beneficiato di sovvenzioni pubbliche lussemburghesi?',
    pt: 'Já beneficiou de apoios públicos luxemburgueses?',
  },
  'q9.o1': {
    fr: 'Jamais', en: 'Never', lb: 'Ni', de: 'Nie', it: 'Mai', pt: 'Nunca',
  },
  'q9.o2': {
    fr: 'Oui, une fois', en: 'Yes, once', lb: 'Jo, eemol', de: 'Ja, einmal', it: 'Sì, una volta', pt: 'Sim, uma vez',
  },
  'q9.o3': {
    fr: 'Oui, plusieurs fois', en: 'Yes, multiple times', lb: 'Jo, méi Kéieren', de: 'Ja, mehrmals', it: 'Sì, più volte', pt: 'Sim, várias vezes',
  },
  'q9.o4': {
    fr: 'Je ne sais pas', en: 'I don\'t know', lb: 'Ech weess et net', de: 'Ich weiß es nicht', it: 'Non lo so', pt: 'Não sei',
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

  // ─── Grande Région special offer ───
  'results.grandeRegion.title': {
    fr: 'Offre spéciale Grande Région',
    en: 'Greater Region Special Offer',
    lb: 'Spezialoffert Groussregioun',
    de: 'Sonderangebot Großregion',
    it: 'Offerta speciale Grande Regione',
    pt: 'Oferta especial Grande Região',
  },
  'results.grandeRegion.subtitle': {
    fr: 'Votre entreprise est basée dans la Grande Région — vous bénéficiez de tarifs préférentiels !',
    en: 'Your company is based in the Greater Region — you benefit from preferential rates!',
    lb: 'Äert Unternehmen ass an der Groussregioun baséiert — Dir profitéiert vu Virzosspräisser!',
    de: 'Ihr Unternehmen hat seinen Sitz in der Großregion — Sie profitieren von Vorzugskonditionen!',
    it: 'La vostra azienda ha sede nella Grande Regione — beneficiate di tariffe agevolate!',
    pt: 'A sua empresa está sediada na Grande Região — beneficia de tarifas preferenciais!',
  },
  'results.grandeRegion.description': {
    fr: "Bien que les aides publiques luxembourgeoises ne soient pas accessibles aux entreprises hors Luxembourg, nous proposons une remise exclusive aux entreprises de la Grande Région (Lorraine, Wallonie, Rhénanie-Palatinat, Sarre) pour les accompagner dans leur transformation digitale et IA.",
    en: "While Luxembourg public grants are not available to companies outside Luxembourg, we offer an exclusive discount to Greater Region companies (Lorraine, Wallonia, Rhineland-Palatinate, Saarland) to support their digital and AI transformation.",
    lb: "Obwuel lëtzebuerger ëffentlech Hëllefen net fir Firmen ausserhalb vu Lëtzebuerg verfügbar sinn, bidden mir e exklusiven Remise fir Firmen aus der Groussregioun (Lorraine, Wallonie, Rheinland-Pfalz, Saarland) fir hir digital an KI Transformatioun ze ënnerstëtzen.",
    de: "Obwohl luxemburgische öffentliche Förderungen nicht für Unternehmen außerhalb Luxemburgs verfügbar sind, bieten wir einen exklusiven Rabatt für Unternehmen der Großregion (Lothringen, Wallonien, Rheinland-Pfalz, Saarland) an, um ihre digitale und KI-Transformation zu unterstützen.",
    it: "Sebbene i finanziamenti pubblici lussemburghesi non siano accessibili alle aziende fuori dal Lussemburgo, offriamo uno sconto esclusivo alle aziende della Grande Regione (Lorena, Vallonia, Renania-Palatinato, Saarland) per accompagnarle nella trasformazione digitale e IA.",
    pt: "Embora os apoios públicos luxemburgueses não estejam disponíveis para empresas fora do Luxemburgo, oferecemos um desconto exclusivo às empresas da Grande Região (Lorena, Valónia, Renânia-Palatinado, Sarre) para apoiar a sua transformação digital e IA.",
  },
  'results.grandeRegion.discount': {
    fr: '-25% sur tous nos services',
    en: '-25% on all our services',
    lb: '-25% op all eis Servicer',
    de: '-25% auf alle unsere Dienstleistungen',
    it: '-25% su tutti i nostri servizi',
    pt: '-25% em todos os nossos serviços',
  },
  'results.grandeRegion.services': {
    fr: 'Nos services incluent',
    en: 'Our services include',
    lb: 'Eis Servicer enthalen',
    de: 'Unsere Dienstleistungen umfassen',
    it: 'I nostri servizi includono',
    pt: 'Os nossos serviços incluem',
  },
  'results.grandeRegion.service1': {
    fr: 'Stratégie de transformation digitale',
    en: 'Digital transformation strategy',
    lb: 'Digital Transformatiounsstrategie',
    de: 'Digitale Transformationsstrategie',
    it: 'Strategia di trasformazione digitale',
    pt: 'Estratégia de transformação digital',
  },
  'results.grandeRegion.service2': {
    fr: "Intégration d'outils IA sur mesure",
    en: 'Custom AI tool integration',
    lb: 'Personaliséiert KI-Tool Integratioun',
    de: 'Maßgeschneiderte KI-Tool-Integration',
    it: "Integrazione di strumenti IA su misura",
    pt: 'Integração de ferramentas IA personalizadas',
  },
  'results.grandeRegion.service3': {
    fr: 'Création de sites web et e-commerce',
    en: 'Website and e-commerce creation',
    lb: 'Websäit an E-Commerce Kreatioun',
    de: 'Website- und E-Commerce-Erstellung',
    it: 'Creazione di siti web ed e-commerce',
    pt: 'Criação de websites e e-commerce',
  },
  'results.grandeRegion.service4': {
    fr: 'Automatisation des processus métier',
    en: 'Business process automation',
    lb: 'Geschäftsprozess Automatiséierung',
    de: 'Geschäftsprozessautomatisierung',
    it: 'Automazione dei processi aziendali',
    pt: 'Automatização de processos de negócio',
  },
  'results.grandeRegion.cta': {
    fr: 'Profiter de l\'offre Grande Région',
    en: 'Claim the Greater Region offer',
    lb: 'Groussregioun Offert notzen',
    de: 'Großregion-Angebot nutzen',
    it: 'Approfittare dell\'offerta Grande Regione',
    pt: 'Aproveitar a oferta Grande Região',
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
  'contact.rcs': {
    fr: 'Numéro RCS', en: 'RCS number', lb: 'RCS Nummer', de: 'RCS-Nummer', it: 'Numero RCS', pt: 'Número RCS',
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

  // ─── Contact Page (standalone) ───
  'contactPage.title': {
    fr: 'Parlons de votre projet', en: 'Let\'s talk about your project', lb: 'Schwätze mir iwwer Äre Projet', de: 'Sprechen wir über Ihr Projekt', it: 'Parliamo del vostro progetto', pt: 'Vamos falar do seu projeto',
  },
  'contactPage.subtitle': {
    fr: 'Remplissez le formulaire ci-dessous et un expert vous recontactera pour discuter de vos besoins et des aides disponibles.', en: 'Fill out the form below and an expert will get back to you to discuss your needs and available grants.', lb: 'Fëllt de Formulaire hei ënnendrënner aus an en Expert mellt sech bei Iech fir Är Bedierfnisser an déi disponibel Hëllefen ze beschwätzen.', de: 'Füllen Sie das Formular aus und ein Experte wird sich bei Ihnen melden, um Ihre Bedürfnisse und verfügbare Förderungen zu besprechen.', it: 'Compilate il modulo qui sotto e un esperto vi ricontatterà per discutere le vostre esigenze e le sovvenzioni disponibili.', pt: 'Preencha o formulário abaixo e um especialista entrará em contacto para discutir as suas necessidades e os apoios disponíveis.',
  },
  'contactPage.info.expert.title': {
    fr: 'Accompagnement gratuit', en: 'Free guidance', lb: 'Gratis Begleedung', de: 'Kostenlose Begleitung', it: 'Accompagnamento gratuito', pt: 'Acompanhamento gratuito',
  },
  'contactPage.info.expert.desc': {
    fr: 'Un expert analyse votre éligibilité et vous guide dans vos démarches d\'aides luxembourgeoises.', en: 'An expert analyzes your eligibility and guides you through the Luxembourg grant application process.', lb: 'En Expert analyséiert Är Eligibilitéit a begleet Iech an Äre Lëtzebuerger Hëllefsdemarchen.', de: 'Ein Experte analysiert Ihre Förderfähigkeit und begleitet Sie durch den luxemburgischen Antragsprocess.', it: 'Un esperto analizza la vostra ammissibilità e vi guida nelle procedure di sovvenzione lussemburghesi.', pt: 'Um especialista analisa a sua elegibilidade e guia-o no processo de candidatura luxemburguês.',
  },
  'contactPage.info.response.title': {
    fr: 'Réponse sous 24h', en: 'Response within 24h', lb: 'Äntwert bannent 24 Stonnen', de: 'Antwort innerhalb von 24 Std.', it: 'Risposta entro 24 ore', pt: 'Resposta em 24h',
  },
  'contactPage.info.response.desc': {
    fr: 'Notre équipe s\'engage à vous recontacter dans les 24 heures ouvrées suivant votre demande.', en: 'Our team commits to getting back to you within 24 business hours of your request.', lb: 'Eist Team mellt sech bannent 24 Aarbechtsstonnen no Ärer Ufro bei Iech.', de: 'Unser Team meldet sich innerhalb von 24 Geschäftsstunden nach Ihrer Anfrage bei Ihnen.', it: 'Il nostro team si impegna a ricontattarvi entro 24 ore lavorative dalla richiesta.', pt: 'A nossa equipa compromete-se a contactá-lo nas 24 horas úteis seguintes ao seu pedido.',
  },
  'contactPage.info.confidential.title': {
    fr: 'Données protégées', en: 'Data protected', lb: 'Daten geschützt', de: 'Daten geschützt', it: 'Dati protetti', pt: 'Dados protegidos',
  },
  'contactPage.info.confidential.desc': {
    fr: 'Vos informations restent strictement confidentielles et ne sont jamais partagées avec des tiers.', en: 'Your information remains strictly confidential and is never shared with third parties.', lb: 'Är Informatiounen bleiwen strikt vertraulech an ginn ni mat Drëtten gedeelt.', de: 'Ihre Informationen bleiben streng vertraulich und werden niemals an Dritte weitergegeben.', it: 'Le vostre informazioni restano strettamente confidenziali e non vengono mai condivise con terzi.', pt: 'As suas informações permanecem estritamente confidenciais e nunca são partilhadas com terceiros.',
  },
  'contactPage.section.personal': {
    fr: 'Informations personnelles', en: 'Personal information', lb: 'Perséinlech Informatiounen', de: 'Persönliche Informationen', it: 'Informazioni personali', pt: 'Informações pessoais',
  },
  'contactPage.section.company': {
    fr: 'Votre entreprise', en: 'Your company', lb: 'Äert Unternehmen', de: 'Ihr Unternehmen', it: 'La vostra azienda', pt: 'A sua empresa',
  },
  'contactPage.section.request': {
    fr: 'Votre demande', en: 'Your request', lb: 'Är Ufro', de: 'Ihre Anfrage', it: 'La vostra richiesta', pt: 'O seu pedido',
  },
  'contactPage.section.contact': {
    fr: 'Vos coordonnées', en: 'Your contact details', lb: 'Är Kontaktdaten', de: 'Ihre Kontaktdaten', it: 'I vostri contatti', pt: 'Os seus contactos',
  },
  'contactPage.sector': {
    fr: 'Secteur d\'activité', en: 'Industry sector', lb: 'Aktivitéitssecteur', de: 'Branche', it: 'Settore di attività', pt: 'Setor de atividade',
  },
  'contactPage.sector.horeca': {
    fr: 'HORECA (hôtellerie, restauration)', en: 'HORECA (hospitality, food service)', lb: 'HORECA (Hotellerie, Restauratioun)', de: 'HORECA (Gastronomie, Hotelgewerbe)', it: 'HORECA (ospitalità, ristorazione)', pt: 'HORECA (hotelaria, restauração)',
  },
  'contactPage.sector.retail': {
    fr: 'Commerce de détail', en: 'Retail', lb: 'Detailhandel', de: 'Einzelhandel', it: 'Commercio al dettaglio', pt: 'Comércio a retalho',
  },
  'contactPage.sector.crafts': {
    fr: 'Artisanat', en: 'Crafts & trades', lb: 'Handwierk', de: 'Handwerk', it: 'Artigianato', pt: 'Artesanato',
  },
  'contactPage.sector.services': {
    fr: 'Services professionnels', en: 'Professional services', lb: 'Professionell Servicer', de: 'Dienstleistungen', it: 'Servizi professionali', pt: 'Serviços profissionais',
  },
  'contactPage.sector.manufacturing': {
    fr: 'Production / Industrie', en: 'Manufacturing / Industry', lb: 'Produktioun / Industrie', de: 'Produktion / Industrie', it: 'Produzione / Industria', pt: 'Produção / Indústria',
  },
  'contactPage.sector.other': {
    fr: 'Autre', en: 'Other', lb: 'Anert', de: 'Sonstiges', it: 'Altro', pt: 'Outro',
  },
  'contactPage.subject.eligibility': {
    fr: 'Vérifier mon éligibilité', en: 'Check my eligibility', lb: 'Meng Eligibilitéit préiwen', de: 'Meine Förderfähigkeit prüfen', it: 'Verificare la mia ammissibilità', pt: 'Verificar a minha elegibilidade',
  },
  'contactPage.subject.partnership': {
    fr: 'Partenariat', en: 'Partnership', lb: 'Partnerschaft', de: 'Partnerschaft', it: 'Partnership', pt: 'Parceria',
  },
  'contactPage.preferredContact': {
    fr: 'Moyen de contact préféré', en: 'Preferred contact method', lb: 'Bevorzuegt Kontaktmethod', de: 'Bevorzugte Kontaktmethode', it: 'Metodo di contatto preferito', pt: 'Método de contacto preferido',
  },
  'contactPage.preferred.email': {
    fr: 'Email', en: 'Email', lb: 'E-Mail', de: 'E-Mail', it: 'Email', pt: 'Email',
  },
  'contactPage.preferred.phone': {
    fr: 'Téléphone', en: 'Phone', lb: 'Telefon', de: 'Telefon', it: 'Telefono', pt: 'Telefone',
  },
  'contactPage.preferred.either': {
    fr: 'Peu importe', en: 'No preference', lb: 'Egal', de: 'Egal', it: 'Indifferente', pt: 'Sem preferência',
  },
  'contactPage.placeholder.name': {
    fr: 'Jean Dupont', en: 'John Smith', lb: 'Jean Dupont', de: 'Max Mustermann', it: 'Mario Rossi', pt: 'João Silva',
  },
  'contactPage.placeholder.role': {
    fr: 'ex : Gérant, Directeur...', en: 'e.g. Manager, Director...', lb: 'z.B. Gérant, Direkter...', de: 'z.B. Geschäftsführer, Direktor...', it: 'es. Direttore, Manager...', pt: 'ex: Gerente, Diretor...',
  },
  'contactPage.placeholder.company': {
    fr: 'Nom de votre entreprise', en: 'Your company name', lb: 'Numm vun Ärer Firma', de: 'Name Ihres Unternehmens', it: 'Nome della vostra azienda', pt: 'Nome da sua empresa',
  },
  'contactPage.placeholder.rcs': {
    fr: 'ex : B276192', en: 'e.g. B276192', lb: 'z.B. B276192', de: 'z.B. B276192', it: 'es. B276192', pt: 'ex: B276192',
  },
  'contactPage.placeholder.email': {
    fr: 'jean@entreprise.lu', en: 'john@company.lu', lb: 'jean@firma.lu', de: 'max@firma.lu', it: 'mario@azienda.lu', pt: 'joao@empresa.lu',
  },
  'contactPage.placeholder.phone': {
    fr: '+352 621 123 456', en: '+352 621 123 456', lb: '+352 621 123 456', de: '+352 621 123 456', it: '+352 621 123 456', pt: '+352 621 123 456',
  },
  'contactPage.placeholder.message': {
    fr: 'Décrivez votre projet ou vos questions sur les aides disponibles...', en: 'Describe your project or questions about available grants...', lb: 'Beschreiwt Äre Projet oder Är Froen iwwer déi disponibel Hëllefen...', de: 'Beschreiben Sie Ihr Projekt oder Ihre Fragen zu verfügbaren Förderungen...', it: 'Descrivete il vostro progetto o le domande sulle sovvenzioni disponibili...', pt: 'Descreva o seu projeto ou as suas questões sobre os apoios disponíveis...',
  },
  'contactPage.privacy': {
    fr: 'Vos données sont protégées et utilisées uniquement pour traiter votre demande.', en: 'Your data is protected and used only to process your request.', lb: 'Är Daten si geschützt a ginn nëmme benotzt fir Är Ufro ze behandelen.', de: 'Ihre Daten sind geschützt und werden nur zur Bearbeitung Ihrer Anfrage verwendet.', it: 'I vostri dati sono protetti e utilizzati solo per elaborare la vostra richiesta.', pt: 'Os seus dados são protegidos e utilizados apenas para processar o seu pedido.',
  },
  'contactPage.backToHome': {
    fr: 'Retour à l\'accueil', en: 'Back to home', lb: 'Zréck op d\'Haaptsäit', de: 'Zurück zur Startseite', it: 'Torna alla home', pt: 'Voltar ao início',
  },

  // ─── Blog ───
  'blog.title': {
    fr: 'Le Digital au Luxembourg', en: 'Digital in Luxembourg', lb: 'Digital zu Lëtzebuerg', de: 'Digital in Luxemburg', it: 'Il Digitale in Lussemburgo', pt: 'O Digital no Luxemburgo',
  },
  'blog.subtitle': {
    fr: 'Subventions, IA et stratégies concrètes pour les PME qui veulent passer à l\'action', en: 'Grants, AI and practical strategies for SMEs ready to take action', lb: 'Subventiounen, KI a praktesch Strategien fir KMUen déi wëllen handelen', de: 'Förderungen, KI und praktische Strategien für KMU, die handeln wollen', it: 'Finanziamenti, IA e strategie concrete per le PMI pronte ad agire', pt: 'Subsídios, IA e estratégias práticas para PMEs prontas para agir',
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
  'directory.freemium': {
    fr: 'Freemium', en: 'Freemium', lb: 'Freemium', de: 'Freemium', it: 'Freemium', pt: 'Freemium',
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
  'footer.blog': {
    fr: 'Blog', en: 'Blog', lb: 'Blog', de: 'Blog', it: 'Blog', pt: 'Blog',
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
    fr: '© 2026 OpenLetz — COMMIT MEDIA SARL · RCS B276192. Tous droits réservés.', en: '© 2026 OpenLetz — COMMIT MEDIA SARL · RCS B276192. All rights reserved.', lb: '© 2026 OpenLetz — COMMIT MEDIA SARL · RCS B276192. All Rechter reservéiert.', de: '© 2026 OpenLetz — COMMIT MEDIA SARL · RCS B276192. Alle Rechte vorbehalten.', it: '© 2026 OpenLetz — COMMIT MEDIA SARL · RCS B276192. Tutti i diritti riservati.', pt: '© 2026 OpenLetz — COMMIT MEDIA SARL · RCS B276192. Todos os direitos reservados.',
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
    fr: 'À propos de OpenLetz', en: 'About OpenLetz', lb: 'Iwwer OpenLetz', de: 'Über OpenLetz', it: 'Chi è OpenLetz', pt: 'Sobre o OpenLetz',
  },
  'about.mission.title': {
    fr: 'Notre mission', en: 'Our Mission', lb: 'Eis Missioun', de: 'Unsere Mission', it: 'La nostra missione', pt: 'A nossa missão',
  },
  'about.mission.text': {
    fr: 'OpenLetz aide les PME luxembourgeoises à naviguer dans l\'écosystème des aides publiques pour leur transformation digitale et l\'adoption de l\'intelligence artificielle. Notre simulateur gratuit identifie en 10 secondes les programmes de subventions auxquels vous êtes éligible.',
    en: 'OpenLetz helps Luxembourg SMEs navigate the public funding ecosystem for their digital transformation and AI adoption. Our free simulator identifies in 10 seconds the grant programs you are eligible for.',
    lb: 'OpenLetz hëlleft lëtzebuerger KMU, sech am ëffentleche Fördersystem fir hir digital Transformatioun an KI-Adoptioun ze orientéieren. Eise gratis Simulator identifizéiert an 10 Sekonnen déi Subventioune fir déi Dir eligibel sidd.',
    de: 'OpenLetz hilft luxemburgischen KMU, sich im öffentlichen Fördersystem für ihre digitale Transformation und KI-Adoption zurechtzufinden. Unser kostenloser Simulator identifiziert in 10 Sekunden die Förderprogramme, für die Sie berechtigt sind.',
    it: 'OpenLetz aiuta le PMI lussemburghesi a navigare nell\'ecosistema dei finanziamenti pubblici per la trasformazione digitale e l\'adozione dell\'IA. Il nostro simulatore gratuito identifica in 10 secondi i programmi di sovvenzione per i quali siete ammissibili.',
    pt: 'O OpenLetz ajuda as PME luxemburguesas a navegar no ecossistema de apoios públicos para a sua transformação digital e adoção de IA. O nosso simulador gratuito identifica em 10 segundos os programas de subsídios aos quais é elegível.',
  },
  'about.why.title': {
    fr: 'Pourquoi OpenLetz ?', en: 'Why OpenLetz?', lb: 'Firwat OpenLetz?', de: 'Warum OpenLetz?', it: 'Perché OpenLetz?', pt: 'Porquê OpenLetz?',
  },
  'about.why.text': {
    fr: 'Le Luxembourg offre des programmes de financement parmi les plus généreux d\'Europe pour la digitalisation des PME, mais beaucoup d\'entreprises ne connaissent pas ces aides ou trouvent les démarches complexes. OpenLetz simplifie ce processus.',
    en: 'Luxembourg offers some of Europe\'s most generous funding programs for SME digitalization, but many companies are unaware of these grants or find the process complex. OpenLetz simplifies this process.',
    lb: 'Lëtzebuerg bitt ee vun de generéisten Förderprogrammer an Europa fir d\'Digitaliséierung vu KMU, awer vill Firmen kennen dës Hëllefe net oder fannen de Prozess komplex. OpenLetz vereinfacht dëse Prozess.',
    de: 'Luxemburg bietet einige der großzügigsten Förderprogramme Europas für die Digitalisierung von KMU, aber viele Unternehmen kennen diese Förderungen nicht oder finden den Prozess komplex. OpenLetz vereinfacht diesen Prozess.',
    it: 'Il Lussemburgo offre alcuni dei programmi di finanziamento più generosi d\'Europa per la digitalizzazione delle PMI, ma molte aziende non conoscono questi aiuti o trovano il processo complesso. OpenLetz semplifica questo processo.',
    pt: 'O Luxemburgo oferece alguns dos programas de financiamento mais generosos da Europa para a digitalização das PME, mas muitas empresas desconhecem estes apoios ou consideram o processo complexo. O OpenLetz simplifica este processo.',
  },
  'about.programs.title': {
    fr: '6 programmes référencés', en: '6 referenced programs', lb: '6 referenzéiert Programmer', de: '6 referenzierte Programme', it: '6 programmi referenziati', pt: '6 programas referenciados',
  },
  'about.programs.text': {
    fr: 'Nous analysons votre éligibilité pour les 6 principaux programmes luxembourgeois : SME Package Digital, SME Package IA, SME Package Cybersécurité, Fit 4 Digital, Fit 4 AI et Fit 4 Innovation. Jusqu\'à 25 000 € de subvention et 70 % de couverture.',
    en: 'We analyze your eligibility for the 6 main Luxembourg programs: SME Package Digital, SME Package AI, SME Package Cybersecurity, Fit 4 Digital, Fit 4 AI and Fit 4 Innovation. Up to €25,000 in grants and 70% coverage.',
    lb: 'Mir analyséieren Är Eligibilitéit fir déi 6 Haaptprogrammer: SME Package Digital, SME Package IA, SME Package Cybersécurité, Fit 4 Digital, Fit 4 AI a Fit 4 Innovation. Bis zu 25.000 € Subventioun an 70 % Deckung.',
    de: 'Wir analysieren Ihre Berechtigung für die 6 Hauptprogramme: SME Package Digital, SME Package AI, SME Package Cybersicherheit, Fit 4 Digital, Fit 4 AI und Fit 4 Innovation. Bis zu 25.000 € Förderung und 70 % Abdeckung.',
    it: 'Analizziamo la vostra ammissibilità per i 6 principali programmi: SME Package Digital, SME Package IA, SME Package Cybersicurezza, Fit 4 Digital, Fit 4 AI e Fit 4 Innovation. Fino a 25.000 € di sovvenzione e 70 % di copertura.',
    pt: 'Analisamos a sua elegibilidade para os 6 principais programas: SME Package Digital, SME Package IA, SME Package Cibersegurança, Fit 4 Digital, Fit 4 AI e Fit 4 Innovation. Até 25.000 € de subsídio e 70 % de cobertura.',
  },
  'about.cta': {
    fr: 'Simuler mes aides', en: 'Simulate my funding', lb: 'Meng Hëllefen simuléieren', de: 'Meine Förderung simulieren', it: 'Simula i miei finanziamenti', pt: 'Simular os meus apoios',
  },

  // ─── Pricing Page ───
  'pricing.title': {
    fr: 'Nos services & tarifs', en: 'Our services & pricing', lb: 'Eis Servicer & Präisser', de: 'Unsere Services & Preise', it: 'I nostri servizi e prezzi', pt: 'Os nossos serviços e preços',
  },
  'pricing.subtitle': {
    fr: 'Grâce à l\'IA, nous livrons plus vite et moins cher. Le simulateur est gratuit, nos services commencent à partir de 190 €/mois.',
    en: 'Thanks to AI, we deliver faster and cheaper. The simulator is free, our services start from €190/month.',
    lb: 'Dank KI liwwere mir méi séier a méi bëlleg. De Simulator ass gratis, eis Servicer starten ab 190 €/Mount.',
    de: 'Dank KI liefern wir schneller und günstiger. Der Simulator ist kostenlos, unsere Services starten ab 190 €/Monat.',
    it: 'Grazie all\'IA, consegniamo più velocemente e a prezzi più bassi. Il simulatore è gratuito, i nostri servizi partono da 190 €/mese.',
    pt: 'Graças à IA, entregamos mais rápido e mais barato. O simulador é gratuito, os nossos serviços começam a partir de 190 €/mês.',
  },
  'pricing.advantage.title': {
    fr: 'L\'IA nous permet de baisser nos prix', en: 'AI allows us to lower our prices', lb: 'KI erlaabt eis eis Präisser ze senken', de: 'KI ermöglicht uns günstigere Preise', it: 'L\'IA ci permette di abbassare i prezzi', pt: 'A IA permite-nos baixar os preços',
  },
  'pricing.advantage.text': {
    fr: 'Nous utilisons l\'intelligence artificielle dans toutes nos prestations : développement assisté par IA, tests automatisés, maintenance prédictive. Résultat : des projets livrés 2 à 3× plus vite, et des économies que nous partageons avec nos clients.',
    en: 'We use artificial intelligence in all our services: AI-assisted development, automated testing, predictive maintenance. Result: projects delivered 2-3× faster, and savings we share with our clients.',
    lb: 'Mir benotze Kënschtlech Intelligenz an all eise Leeschtungen: KI-ënnerstëtzt Entwécklung, automatiséiert Tester, prädiktiv Maintenance. Resultat: Projete 2-3× méi séier geliwwert, a Spuerungen déi mir mat eise Cliente deelen.',
    de: 'Wir setzen KI in allen Leistungen ein: KI-gestützte Entwicklung, automatisierte Tests, prädiktive Wartung. Ergebnis: Projekte 2-3× schneller geliefert, und Einsparungen, die wir mit unseren Kunden teilen.',
    it: 'Utilizziamo l\'IA in tutti i nostri servizi: sviluppo assistito da IA, test automatizzati, manutenzione predittiva. Risultato: progetti consegnati 2-3× più veloci, e risparmi che condividiamo con i clienti.',
    pt: 'Utilizamos IA em todos os nossos serviços: desenvolvimento assistido por IA, testes automatizados, manutenção preditiva. Resultado: projetos entregues 2-3× mais rápido, e poupanças que partilhamos com os clientes.',
  },
  'pricing.free.title': {
    fr: 'Simulateur', en: 'Simulator', lb: 'Simulator', de: 'Simulator', it: 'Simulatore', pt: 'Simulador',
  },
  'pricing.free.price': {
    fr: 'Gratuit', en: 'Free', lb: 'Gratis', de: 'Kostenlos', it: 'Gratuito', pt: 'Gratuito',
  },
  'pricing.free.f1': {
    fr: 'Simulation d\'éligibilité en 10 sec', en: 'Eligibility simulation in 10 sec', lb: 'Eligibilitéitssimulatioun an 10 Sek', de: 'Förderfähigkeitssimulation in 10 Sek', it: 'Simulazione ammissibilità in 10 sec', pt: 'Simulação de elegibilidade em 10 seg',
  },
  'pricing.free.f2': {
    fr: '6 programmes analysés', en: '6 programs analyzed', lb: '6 Programmer analyséiert', de: '6 Programme analysiert', it: '6 programmi analizzati', pt: '6 programas analisados',
  },
  'pricing.free.f3': {
    fr: 'Recommandations de projets', en: 'Project recommendations', lb: 'Projetsempfehlungen', de: 'Projektempfehlungen', it: 'Raccomandazioni di progetti', pt: 'Recomendações de projetos',
  },
  'pricing.free.f4': {
    fr: 'Estimation des coûts et aides', en: 'Cost and grant estimates', lb: 'Käschten- a Hëllefeschätzungen', de: 'Kosten- und Förderschätzungen', it: 'Stima costi e sovvenzioni', pt: 'Estimativa de custos e apoios',
  },
  'pricing.svc.dev.title': {
    fr: 'Développement Web', en: 'Web Development', lb: 'Web-Entwécklung', de: 'Web-Entwicklung', it: 'Sviluppo Web', pt: 'Desenvolvimento Web',
  },
  'pricing.svc.dev.price': {
    fr: 'À partir de 900 €', en: 'From €900', lb: 'Vun 900 € un', de: 'Ab 900 €', it: 'Da 900 €', pt: 'A partir de 900 €',
  },
  'pricing.svc.dev.desc': {
    fr: 'Sites web, e-commerce, applications — développés avec l\'IA pour un résultat rapide et professionnel.',
    en: 'Websites, e-commerce, apps — built with AI for fast, professional results.',
    lb: 'Websäiten, E-Commerce, Applikatiounen — mat KI entwéckelt fir séier a professionell Resultater.',
    de: 'Websites, E-Commerce, Apps — mit KI entwickelt für schnelle, professionelle Ergebnisse.',
    it: 'Siti web, e-commerce, applicazioni — sviluppati con IA per risultati rapidi e professionali.',
    pt: 'Websites, e-commerce, aplicações — desenvolvidos com IA para resultados rápidos e profissionais.',
  },
  'pricing.svc.dev.f1': {
    fr: 'Sites vitrines & e-commerce', en: 'Showcase & e-commerce sites', lb: 'Vitrine- & E-Commerce-Säiten', de: 'Showcase- & E-Commerce-Seiten', it: 'Siti vetrina & e-commerce', pt: 'Sites vitrine & e-commerce',
  },
  'pricing.svc.dev.f2': {
    fr: 'Applications web sur mesure', en: 'Custom web applications', lb: 'Maßgeschneidert Web-Applikatiounen', de: 'Maßgeschneiderte Web-Anwendungen', it: 'Applicazioni web su misura', pt: 'Aplicações web à medida',
  },
  'pricing.svc.dev.f3': {
    fr: 'Design responsive & moderne', en: 'Responsive & modern design', lb: 'Responsive & modern Design', de: 'Responsives & modernes Design', it: 'Design responsive & moderno', pt: 'Design responsive e moderno',
  },
  'pricing.svc.dev.f4': {
    fr: 'Livraison en 48h max grâce à l\'IA', en: 'Up to 48h delivery thanks to AI', lb: 'Bis zu 48h Liwwerung dank KI', de: 'Lieferung in bis zu 48h dank KI', it: 'Consegna in max 48h grazie all\'IA', pt: 'Entrega em até 48h graças à IA',
  },
  'pricing.svc.dev.f5': {
    fr: 'Éligible aux subventions SME Package', en: 'Eligible for SME Package grants', lb: 'Eligibel fir SME Package Subventiounen', de: 'Förderfähig für SME Package', it: 'Ammissibile per sovvenzioni SME Package', pt: 'Elegível para subsídios SME Package',
  },
  'pricing.svc.ai.title': {
    fr: 'Intégration IA', en: 'AI Integration', lb: 'KI-Integratioun', de: 'KI-Integration', it: 'Integrazione IA', pt: 'Integração IA',
  },
  'pricing.svc.ai.price': {
    fr: 'À partir de 900 €', en: 'From €900', lb: 'Vun 900 € un', de: 'Ab 900 €', it: 'Da 900 €', pt: 'A partir de 900 €',
  },
  'pricing.svc.ai.desc': {
    fr: 'Agents IA, automatisation, solutions sur mesure — intégrez l\'intelligence artificielle dans votre activité.',
    en: 'AI agents, automation, custom solutions — integrate artificial intelligence into your business.',
    lb: 'KI-Agenten, Automatiséierung, personaliséiert Léisungen — integréiert Kënschtlech Intelligenz an Är Aktivitéit.',
    de: 'KI-Agenten, Automatisierung, maßgeschneiderte Lösungen — integrieren Sie KI in Ihr Geschäft.',
    it: 'Agenti IA, automazione, soluzioni personalizzate — integra l\'intelligenza artificiale nella tua attività.',
    pt: 'Agentes IA, automação, soluções personalizadas — integre a inteligência artificial no seu negócio.',
  },
  'pricing.svc.ai.f1': {
    fr: 'Agents IA autonomes', en: 'Autonomous AI agents', lb: 'Autonom KI-Agenten', de: 'Autonome KI-Agenten', it: 'Agenti IA autonomi', pt: 'Agentes IA autónomos',
  },
  'pricing.svc.ai.f2': {
    fr: 'Automatisation de processus', en: 'Process automation', lb: 'Prozess-Automatiséierung', de: 'Prozessautomatisierung', it: 'Automazione dei processi', pt: 'Automação de processos',
  },
  'pricing.svc.ai.f3': {
    fr: 'Analyse de données & reporting', en: 'Data analysis & reporting', lb: 'Datenanalyse & Reporting', de: 'Datenanalyse & Reporting', it: 'Analisi dati & reporting', pt: 'Análise de dados e relatórios',
  },
  'pricing.svc.ai.f4': {
    fr: 'Formation de votre équipe', en: 'Team training', lb: 'Formatioun vun Ärem Team', de: 'Schulung Ihres Teams', it: 'Formazione del team', pt: 'Formação da equipa',
  },
  'pricing.svc.ai.f5': {
    fr: 'Éligible aux subventions SME Package', en: 'Eligible for SME Package grants', lb: 'Eligibel fir SME Package Subventiounen', de: 'Förderfähig für SME Package', it: 'Ammissibile per sovvenzioni SME Package', pt: 'Elegível para subsídios SME Package',
  },
  'pricing.svc.maintenance.title': {
    fr: 'Maintenance', en: 'Maintenance', lb: 'Maintenance', de: 'Wartung', it: 'Manutenzione', pt: 'Manutenção',
  },
  'pricing.svc.maintenance.price': {
    fr: 'À partir de 90 €/mois', en: 'From €90/month', lb: 'Vun 90 €/Mount un', de: 'Ab 90 €/Monat', it: 'Da 90 €/mese', pt: 'A partir de 90 €/mês',
  },
  'pricing.svc.maintenance.desc': {
    fr: 'Maintenance proactive, mises à jour de sécurité, monitoring — votre site toujours au top.',
    en: 'Proactive maintenance, security updates, monitoring — your site always performing.',
    lb: 'Proaktiv Maintenance, Sécherheets-Updates, Monitoring — Är Säit ëmmer um Topp.',
    de: 'Proaktive Wartung, Sicherheitsupdates, Monitoring — Ihre Website stets auf dem neuesten Stand.',
    it: 'Manutenzione proattiva, aggiornamenti di sicurezza, monitoraggio — il vostro sito sempre al top.',
    pt: 'Manutenção proativa, atualizações de segurança, monitorização — o seu site sempre no topo.',
  },
  'pricing.svc.maintenance.f1': {
    fr: 'Monitoring 24/7 & alertes', en: '24/7 monitoring & alerts', lb: '24/7 Monitoring & Alerten', de: '24/7 Monitoring & Warnungen', it: 'Monitoraggio 24/7 & avvisi', pt: 'Monitorização 24/7 e alertas',
  },
  'pricing.svc.maintenance.f2': {
    fr: 'Mises à jour de sécurité', en: 'Security updates', lb: 'Sécherheets-Updates', de: 'Sicherheitsupdates', it: 'Aggiornamenti di sicurezza', pt: 'Atualizações de segurança',
  },
  'pricing.svc.maintenance.f3': {
    fr: 'Sauvegardes automatiques', en: 'Automatic backups', lb: 'Automatesch Backupen', de: 'Automatische Backups', it: 'Backup automatici', pt: 'Backups automáticos',
  },
  'pricing.svc.maintenance.f4': {
    fr: 'Support réactif instantané', en: 'Instant responsive support', lb: 'Sofortege reaktive Support', de: 'Sofortiger reaktiver Support', it: 'Supporto reattivo istantaneo', pt: 'Suporte reativo instantâneo',
  },
  'pricing.svc.consulting.title': {
    fr: 'Conseil Subventions', en: 'Grant Consulting', lb: 'Subventiouns-Berodung', de: 'Förderberatung', it: 'Consulenza Sovvenzioni', pt: 'Consultoria Subsídios',
  },
  'pricing.svc.consulting.price': {
    fr: 'À partir de 290 €', en: 'From €290', lb: 'Vun 290 € un', de: 'Ab 290 €', it: 'Da 290 €', pt: 'A partir de 290 €',
  },
  'pricing.svc.consulting.desc': {
    fr: 'Montage de dossier, suivi avec Luxinnovation — maximisez vos chances d\'obtenir vos aides.',
    en: 'Grant application support, Luxinnovation follow-up — maximize your chances of getting funded.',
    lb: 'Dossier-Montage, Suivi mat Luxinnovation — maximiséiert Är Chancen op Subventiounen.',
    de: 'Antragserstellung, Begleitung bei Luxinnovation — maximieren Sie Ihre Förderchancen.',
    it: 'Preparazione domande, follow-up con Luxinnovation — massimizzate le vostre possibilità.',
    pt: 'Montagem de candidatura, seguimento Luxinnovation — maximize as suas hipóteses.',
  },
  'pricing.svc.consulting.f1': {
    fr: 'Diagnostic d\'éligibilité approfondi', en: 'In-depth eligibility assessment', lb: 'Déifgräifend Eligibilitéitsdiagnose', de: 'Tiefgehende Förderfähigkeitsanalyse', it: 'Diagnosi approfondita di ammissibilità', pt: 'Diagnóstico aprofundado de elegibilidade',
  },
  'pricing.svc.consulting.f2': {
    fr: 'Montage complet du dossier', en: 'Complete application preparation', lb: 'Komplett Dossier-Montage', de: 'Vollständige Antragserstellung', it: 'Preparazione completa del fascicolo', pt: 'Montagem completa do processo',
  },
  'pricing.svc.consulting.f3': {
    fr: 'Suivi jusqu\'à obtention de l\'aide', en: 'Follow-up until grant is obtained', lb: 'Suivi bis d\'Hëllef kritt ass', de: 'Begleitung bis zur Förderzusage', it: 'Seguito fino all\'ottenimento dell\'aiuto', pt: 'Seguimento até à obtenção do apoio',
  },
  'pricing.svc.consulting.f4': {
    fr: 'Rapport détaillé PDF inclus', en: 'Detailed PDF report included', lb: 'Detailléierte PDF-Rapport abegraff', de: 'Detaillierter PDF-Bericht inklusive', it: 'Rapporto dettagliato PDF incluso', pt: 'Relatório detalhado PDF incluído',
  },
  'pricing.cta.free': {
    fr: 'Commencer gratuitement', en: 'Start for free', lb: 'Gratis ufänken', de: 'Kostenlos starten', it: 'Inizia gratis', pt: 'Começar gratuitamente',
  },
  'pricing.cta.contact': {
    fr: 'Nous contacter', en: 'Contact us', lb: 'Kontaktéiert eis', de: 'Kontaktieren Sie uns', it: 'Contattaci', pt: 'Contacte-nos',
  },
  'pricing.recommended': {
    fr: 'Populaire', en: 'Popular', lb: 'Beléift', de: 'Beliebt', it: 'Popolare', pt: 'Popular',
  },
  'pricing.perProject': {
    fr: 'par projet', en: 'per project', lb: 'pro Projet', de: 'pro Projekt', it: 'per progetto', pt: 'por projeto',
  },
  'pricing.perMonth': {
    fr: '/mois', en: '/month', lb: '/Mount', de: '/Monat', it: '/mese', pt: '/mês',
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
    fr: 'Rapport d\'éligibilité — OpenLetz', en: 'Eligibility Report — OpenLetz', lb: 'Eligibilitéitsrapport — OpenLetz', de: 'Förderfähigkeitsbericht — OpenLetz', it: 'Rapporto di ammissibilità — OpenLetz', pt: 'Relatório de elegibilidade — OpenLetz',
  },
  'report.generatedOn': {
    fr: 'Généré le', en: 'Generated on', lb: 'Generéiert den', de: 'Erstellt am', it: 'Generato il', pt: 'Gerado em',
  },
  'report.clientInfo': {
    fr: 'Informations du demandeur', en: 'Applicant information', lb: 'Informatiounen vum Untrëttler', de: 'Antragsteller-Informationen', it: 'Informazioni del richiedente', pt: 'Informações do requerente',
  },
  'report.name': {
    fr: 'Nom', en: 'Name', lb: 'Numm', de: 'Name', it: 'Nome', pt: 'Nome',
  },
  'report.company': {
    fr: 'Entreprise', en: 'Company', lb: 'Firma', de: 'Unternehmen', it: 'Azienda', pt: 'Empresa',
  },
  'report.rcs': {
    fr: 'N° RCS', en: 'RCS No.', lb: 'RCS Nr.', de: 'RCS-Nr.', it: 'N° RCS', pt: 'N.º RCS',
  },
  'report.email': {
    fr: 'Email', en: 'Email', lb: 'Email', de: 'E-Mail', it: 'Email', pt: 'Email',
  },
  'report.services.title': {
    fr: 'Comment nous pouvons vous accompagner', en: 'How we can help you', lb: 'Wéi mir Iech begleede kënnen', de: 'Wie wir Sie begleiten können', it: 'Come possiamo accompagnarvi', pt: 'Como podemos ajudá-lo',
  },
  'report.services.dev.title': {
    fr: 'Développement Web & Digital (à partir de 900 €)', en: 'Web & Digital Development (from €900)', lb: 'Web & Digital Entwécklung (vun 900 €)', de: 'Web- & Digitalentwicklung (ab 900 €)', it: 'Sviluppo Web & Digitale (da 900 €)', pt: 'Desenvolvimento Web & Digital (a partir de 900 €)',
  },
  'report.services.dev.desc': {
    fr: 'Sites web, e-commerce, applications sur mesure. Livraison en 48h max grâce à nos outils IA. Éligible aux subventions SME Package Digital (70 % pris en charge, max 17 500 €).',
    en: 'Websites, e-commerce, custom applications. Delivery in up to 48h thanks to our AI tools. Eligible for SME Package Digital grants (70% covered, max €17,500).',
    lb: 'Websäiten, E-Commerce, personaliséiert Applikatiounen. Liwwerung an max 48h dank eisen KI-Tools. Eligibel fir SME Package Digital Subventiounen (70 % iwwerholl, max 17.500 €).',
    de: 'Websites, E-Commerce, maßgeschneiderte Anwendungen. Lieferung in max 48h dank unserer KI-Tools. Förderfähig für SME Package Digital (70 % abgedeckt, max 17.500 €).',
    it: 'Siti web, e-commerce, applicazioni su misura. Consegna in max 48h grazie ai nostri strumenti IA. Ammissibile per sovvenzioni SME Package Digital (70 % coperto, max 17.500 €).',
    pt: 'Websites, e-commerce, aplicações à medida. Entrega em até 48h graças às nossas ferramentas IA. Elegível para subsídios SME Package Digital (70 % coberto, máx. 17.500 €).',
  },
  'report.services.ai.title': {
    fr: 'Intégration IA & Agents Autonomes (à partir de 900 €)', en: 'AI Integration & Autonomous Agents (from €900)', lb: 'KI-Integratioun & Autonom Agenten (vun 900 €)', de: 'KI-Integration & Autonome Agenten (ab 900 €)', it: 'Integrazione IA & Agenti Autonomi (da 900 €)', pt: 'Integração IA & Agentes Autónomos (a partir de 900 €)',
  },
  'report.services.ai.desc': {
    fr: 'Agents IA autonomes, automatisation de processus, analyse de données. Éligible aux subventions SME Package IA (70 % pris en charge, max 17 500 €) et Fit 4 AI (50 %, max 25 000 €).',
    en: 'Autonomous AI agents, process automation, data analysis. Eligible for SME Package AI grants (70% covered, max €17,500) and Fit 4 AI (50%, max €25,000).',
    lb: 'Autonom KI-Agenten, Prozess-Automatiséierung, Datenanalyse. Eligibel fir SME Package IA (70 % iwwerholl, max 17.500 €) an Fit 4 AI (50 %, max 25.000 €).',
    de: 'Autonome KI-Agenten, Prozessautomatisierung, Datenanalyse. Förderfähig für SME Package KI (70 % abgedeckt, max 17.500 €) und Fit 4 AI (50 %, max 25.000 €).',
    it: 'Agenti IA autonomi, automazione dei processi, analisi dati. Ammissibile per SME Package IA (70 % coperto, max 17.500 €) e Fit 4 AI (50 %, max 25.000 €).',
    pt: 'Agentes IA autónomos, automação de processos, análise de dados. Elegível para SME Package IA (70 % coberto, máx. 17.500 €) e Fit 4 AI (50 %, máx. 25.000 €).',
  },
  'report.services.grants.title': {
    fr: 'Conseil Subventions & Montage de Dossier (à partir de 290 €)', en: 'Grant Consulting & Application Support (from €290)', lb: 'Subventiouns-Berodung & Dossier-Montage (vun 290 €)', de: 'Förderberatung & Antragserstellung (ab 290 €)', it: 'Consulenza Sovvenzioni & Preparazione Domande (da 290 €)', pt: 'Consultoria Subsídios & Montagem de Candidatura (a partir de 290 €)',
  },
  'report.services.grants.desc': {
    fr: 'Diagnostic approfondi, montage complet de votre dossier de demande de subvention, suivi avec Luxinnovation et le Ministère de l\'Économie jusqu\'à obtention de l\'aide.',
    en: 'In-depth assessment, complete grant application preparation, follow-up with Luxinnovation and the Ministry of the Economy until the grant is obtained.',
    lb: 'Déifgräifend Diagnose, komplett Montage vun Ärem Subventiouns-Dossier, Suivi mat Luxinnovation an dem Wirtschaftsministère bis d\'Hëllef accordéiert ass.',
    de: 'Tiefgehende Analyse, vollständige Antragserstellung, Begleitung bei Luxinnovation und dem Wirtschaftsministerium bis zur Förderzusage.',
    it: 'Diagnosi approfondita, preparazione completa della domanda di sovvenzione, seguito con Luxinnovation e il Ministero dell\'Economia fino all\'ottenimento dell\'aiuto.',
    pt: 'Diagnóstico aprofundado, montagem completa da candidatura de subsídio, seguimento com Luxinnovation e o Ministério da Economia até à obtenção do apoio.',
  },
  'report.nextSteps.title': {
    fr: 'Prochaines étapes', en: 'Next steps', lb: 'Nächst Schrëtt', de: 'Nächste Schritte', it: 'Prossimi passi', pt: 'Próximos passos',
  },
  'report.nextSteps.step1': {
    fr: 'Prenez rendez-vous avec un expert OpenLetz pour valider votre éligibilité et affiner vos projets.', en: 'Schedule a meeting with a OpenLetz expert to validate your eligibility and refine your projects.', lb: 'Maacht en Rendez-vous mat engem OpenLetz-Expert fir Är Eligibilitéit ze validéieren an Är Projeten ze verfeineren.', de: 'Vereinbaren Sie einen Termin mit einem OpenLetz-Experten, um Ihre Förderfähigkeit zu bestätigen und Ihre Projekte zu verfeinern.', it: 'Fissate un appuntamento con un esperto OpenLetz per validare la vostra ammissibilità e perfezionare i progetti.', pt: 'Marque uma reunião com um especialista OpenLetz para validar a sua elegibilidade e refinar os seus projetos.',
  },
  'report.nextSteps.step2': {
    fr: 'Nous montons votre dossier de demande de subvention et assurons le suivi avec les organismes.', en: 'We prepare your grant application and handle the follow-up with the relevant organizations.', lb: 'Mir montéieren Äre Subventiouns-Dossier a suiven mat den Organismen.', de: 'Wir bereiten Ihren Förderantrag vor und begleiten Sie bei den zuständigen Stellen.', it: 'Prepariamo la vostra domanda di sovvenzione e seguiamo le pratiche con gli organismi competenti.', pt: 'Preparamos a sua candidatura ao subsídio e asseguramos o acompanhamento junto dos organismos.',
  },
  'report.nextSteps.step3': {
    fr: 'Une fois la subvention obtenue, nous réalisons votre projet digital ou IA dans les délais convenus.', en: 'Once the grant is obtained, we deliver your digital or AI project within the agreed timeline.', lb: 'Wann d\'Subventioun accordéiert ass, realiséiere mir Äre digitalen oder KI-Projet bannent den ofgemaachten Delaien.', de: 'Sobald die Förderung bewilligt ist, realisieren wir Ihr Digital- oder KI-Projekt im vereinbarten Zeitrahmen.', it: 'Una volta ottenuta la sovvenzione, realizziamo il vostro progetto digitale o IA nei tempi concordati.', pt: 'Uma vez obtido o subsídio, realizamos o seu projeto digital ou IA nos prazos acordados.',
  },
  'report.contact.cta': {
    fr: 'Contactez-nous pour démarrer votre projet', en: 'Contact us to start your project', lb: 'Kontaktéiert eis fir Äre Projet ze starten', de: 'Kontaktieren Sie uns, um Ihr Projekt zu starten', it: 'Contattateci per avviare il vostro progetto', pt: 'Contacte-nos para iniciar o seu projeto',
  },
  'report.disclaimer': {
    fr: 'Ce rapport est généré automatiquement à titre indicatif. Les montants et taux de couverture sont basés sur les programmes officiels du Grand-Duché de Luxembourg en vigueur à la date de génération. L\'éligibilité effective doit être confirmée auprès des organismes compétents. COMMIT MEDIA SARL · RCS B276192.',
    en: 'This report is automatically generated for informational purposes. Amounts and coverage rates are based on official Grand Duchy of Luxembourg programs in effect at the date of generation. Actual eligibility must be confirmed with the relevant authorities. COMMIT MEDIA SARL · RCS B276192.',
    lb: 'Dëse Rapport gëtt automatesch generéiert als Informatioun. D\'Beträg a Couverture-Raten baséieren op den offizielle Programmer vum Groussherzogtum Lëtzebuerg zum Datum vun der Generéierung. Déi effektiv Eligibilitéit muss bei den zoustännegen Organismen confirméiert ginn. COMMIT MEDIA SARL · RCS B276192.',
    de: 'Dieser Bericht wird automatisch zu Informationszwecken erstellt. Beträge und Deckungsraten basieren auf den offiziellen Programmen des Großherzogtums Luxemburg zum Erstellungsdatum. Die tatsächliche Förderfähigkeit muss bei den zuständigen Stellen bestätigt werden. COMMIT MEDIA SARL · RCS B276192.',
    it: 'Questo rapporto è generato automaticamente a titolo informativo. Gli importi e le percentuali di copertura si basano sui programmi ufficiali del Granducato di Lussemburgo in vigore alla data di generazione. L\'ammissibilità effettiva deve essere confermata presso gli organismi competenti. COMMIT MEDIA SARL · RCS B276192.',
    pt: 'Este relatório é gerado automaticamente a título informativo. Os montantes e taxas de cobertura baseiam-se nos programas oficiais do Grão-Ducado do Luxemburgo em vigor à data de geração. A elegibilidade efetiva deve ser confirmada junto dos organismos competentes. COMMIT MEDIA SARL · RCS B276192.',
  },
  'report.form.title': {
    fr: 'Vos informations pour le rapport', en: 'Your information for the report', lb: 'Är Informatiounen fir de Rapport', de: 'Ihre Informationen für den Bericht', it: 'Le vostre informazioni per il rapporto', pt: 'As suas informações para o relatório',
  },
  'report.form.generate': {
    fr: 'Générer le rapport PDF', en: 'Generate PDF report', lb: 'PDF-Rapport generéieren', de: 'PDF-Bericht erstellen', it: 'Genera rapporto PDF', pt: 'Gerar relatório PDF',
  },
  'report.form.cancel': {
    fr: 'Annuler', en: 'Cancel', lb: 'Ofbriechen', de: 'Abbrechen', it: 'Annulla', pt: 'Cancelar',
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
