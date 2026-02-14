'use client'

import { useState } from 'react'
import { useLanguage, Language } from '@/context/LanguageContext'

interface Agent {
  name: string
  description: Record<Language, string>
  category: string
  url: string
  tags: string[]
  free: boolean
}

const CATEGORIES: { id: string; labelKey: string; icon: string }[] = [
  { id: 'all', labelKey: 'directory.cat.all', icon: 'Grid' },
  { id: 'assistant', labelKey: 'directory.cat.assistant', icon: 'Chat' },
  { id: 'content', labelKey: 'directory.cat.content', icon: 'Pen' },
  { id: 'productivity', labelKey: 'directory.cat.productivity', icon: 'Zap' },
  { id: 'analytics', labelKey: 'directory.cat.analytics', icon: 'Chart' },
  { id: 'creative', labelKey: 'directory.cat.creative', icon: 'Palette' },
  { id: 'dev', labelKey: 'directory.cat.dev', icon: 'Code' },
]

const AGENTS: Agent[] = [
  // Assistants & Chatbots
  {
    name: 'ChatGPT',
    description: {
      fr: 'Assistant IA polyvalent par OpenAI. Conversation, rédaction, analyse et programmation.',
      en: 'Versatile AI assistant by OpenAI. Conversation, writing, analysis and coding.',
      lb: 'Villsäitegen KI-Assistent vun OpenAI. Konversatioun, Schreiwen, Analyse a Programméierung.',
      de: 'Vielseitiger KI-Assistent von OpenAI. Konversation, Schreiben, Analyse und Programmierung.',
      it: 'Assistente IA versatile di OpenAI. Conversazione, scrittura, analisi e programmazione.',
      pt: 'Assistente IA versátil da OpenAI. Conversação, escrita, análise e programação.',
    },
    category: 'assistant',
    url: 'https://chat.openai.com',
    tags: ['GPT-4', 'Multimodal'],
    free: true,
  },
  {
    name: 'Claude',
    description: {
      fr: "Assistant IA par Anthropic. Excellente compréhension, rédaction longue et analyse de documents.",
      en: 'AI assistant by Anthropic. Excellent comprehension, long-form writing and document analysis.',
      lb: 'KI-Assistent vun Anthropic. Exzellent Verständnis, laangt Schreiwen an Dokumentanalyse.',
      de: 'KI-Assistent von Anthropic. Hervorragendes Verständnis, Langtext und Dokumentenanalyse.',
      it: "Assistente IA di Anthropic. Eccellente comprensione, scrittura lunga e analisi di documenti.",
      pt: 'Assistente IA da Anthropic. Excelente compreensão, escrita longa e análise de documentos.',
    },
    category: 'assistant',
    url: 'https://claude.ai',
    tags: ['Anthropic', 'Documents'],
    free: true,
  },
  {
    name: 'Perplexity',
    description: {
      fr: "Moteur de recherche IA avec sources citées. Idéal pour la veille et la recherche d'informations.",
      en: 'AI search engine with cited sources. Perfect for research and information gathering.',
      lb: 'KI-Sichmaschinn mat zitéierte Quellen. Ideal fir Recherche an Informatiounssammlung.',
      de: 'KI-Suchmaschine mit zitierten Quellen. Ideal für Recherche und Informationssammlung.',
      it: 'Motore di ricerca IA con fonti citate. Perfetto per ricerche e raccolta informazioni.',
      pt: 'Motor de busca IA com fontes citadas. Perfeito para pesquisa e recolha de informação.',
    },
    category: 'assistant',
    url: 'https://perplexity.ai',
    tags: ['Search', 'Sources'],
    free: true,
  },

  // Content & Marketing
  {
    name: 'Jasper',
    description: {
      fr: 'Plateforme de contenu marketing IA. Génère des articles, publicités et contenus de marque.',
      en: 'AI marketing content platform. Generates articles, ads and brand content.',
      lb: 'KI-Marketing-Inhalt Plattform. Generéiert Artikelen, Reklammen a Markeninhalt.',
      de: 'KI-Marketing-Content-Plattform. Erstellt Artikel, Werbung und Markeninhalte.',
      it: 'Piattaforma di contenuti marketing IA. Genera articoli, pubblicità e contenuti di marca.',
      pt: 'Plataforma de conteúdo marketing IA. Gera artigos, anúncios e conteúdo de marca.',
    },
    category: 'content',
    url: 'https://jasper.ai',
    tags: ['Marketing', 'SEO'],
    free: false,
  },
  {
    name: 'Copy.ai',
    description: {
      fr: "Rédacteur IA pour le copywriting. Emails, posts réseaux sociaux, descriptions produits.",
      en: 'AI copywriter. Emails, social media posts, product descriptions.',
      lb: 'KI-Copywriter. Emailen, Social Media Posts, Produktbeschreiwungen.',
      de: 'KI-Copywriter. E-Mails, Social-Media-Posts, Produktbeschreibungen.',
      it: 'Copywriter IA. Email, post social media, descrizioni prodotti.',
      pt: 'Copywriter IA. Emails, posts redes sociais, descrições de produtos.',
    },
    category: 'content',
    url: 'https://copy.ai',
    tags: ['Copywriting', 'Social'],
    free: true,
  },
  {
    name: 'ElevenLabs',
    description: {
      fr: 'Synthèse vocale IA ultra-réaliste. Voix off, doublage, podcasts multilingues.',
      en: 'Ultra-realistic AI voice synthesis. Voiceovers, dubbing, multilingual podcasts.',
      lb: 'Ultra-realistesch KI-Stëmmsynthese. Voiceovers, Synchroniséierung, méisproocheg Podcasts.',
      de: 'Ultra-realistische KI-Sprachsynthese. Voiceover, Synchronisation, mehrsprachige Podcasts.',
      it: 'Sintesi vocale IA ultra-realistica. Voiceover, doppiaggio, podcast multilingue.',
      pt: 'Síntese vocal IA ultra-realista. Voiceovers, dobragem, podcasts multilingues.',
    },
    category: 'content',
    url: 'https://elevenlabs.io',
    tags: ['Voice', 'Audio'],
    free: true,
  },

  // Productivity & Automation
  {
    name: 'Zapier AI',
    description: {
      fr: "Automatisation de workflows avec l'IA. Connectez vos apps et automatisez vos tâches répétitives.",
      en: 'AI-powered workflow automation. Connect your apps and automate repetitive tasks.',
      lb: 'KI-gestäerkt Workflow-Automatisatioun. Verbënnt Är Apps a automatiséiert repetitiv Aufgaben.',
      de: 'KI-gestützte Workflow-Automatisierung. Verbinden Sie Ihre Apps und automatisieren Sie Routineaufgaben.',
      it: "Automazione workflow con IA. Collegate le vostre app e automatizzate i compiti ripetitivi.",
      pt: 'Automação de workflows com IA. Conecte as suas apps e automatize tarefas repetitivas.',
    },
    category: 'productivity',
    url: 'https://zapier.com',
    tags: ['Automation', 'Integration'],
    free: true,
  },
  {
    name: 'Notion AI',
    description: {
      fr: 'IA intégrée à Notion pour rédiger, résumer et organiser vos documents et projets.',
      en: 'AI integrated into Notion to write, summarize and organize your documents and projects.',
      lb: 'KI integréiert an Notion fir Dokumenter a Projete ze schreiwen, zesummefaassen an z\'organiséieren.',
      de: 'KI in Notion integriert zum Schreiben, Zusammenfassen und Organisieren Ihrer Dokumente und Projekte.',
      it: 'IA integrata in Notion per scrivere, riassumere e organizzare documenti e progetti.',
      pt: 'IA integrada no Notion para escrever, resumir e organizar documentos e projetos.',
    },
    category: 'productivity',
    url: 'https://notion.so',
    tags: ['Docs', 'Projects'],
    free: true,
  },
  {
    name: 'Otter.ai',
    description: {
      fr: 'Transcription automatique de réunions et interviews. Notes IA en temps réel.',
      en: 'Automatic meeting and interview transcription. Real-time AI notes.',
      lb: 'Automatesch Transkriptioun vu Reuniounen an Interviewen. Echtzäit KI-Notizen.',
      de: 'Automatische Transkription von Meetings und Interviews. KI-Notizen in Echtzeit.',
      it: 'Trascrizione automatica di riunioni e interviste. Note IA in tempo reale.',
      pt: 'Transcrição automática de reuniões e entrevistas. Notas IA em tempo real.',
    },
    category: 'productivity',
    url: 'https://otter.ai',
    tags: ['Transcription', 'Meetings'],
    free: true,
  },

  // Analytics & Data
  {
    name: 'Julius AI',
    description: {
      fr: "Analyse de données par l'IA. Importez vos fichiers et obtenez des insights instantanés.",
      en: 'AI-powered data analysis. Import your files and get instant insights.',
      lb: 'KI-gestäerkt Datenanalyse. Importéiert Är Fichieren a kritt direkt Insights.',
      de: 'KI-gestützte Datenanalyse. Importieren Sie Ihre Dateien und erhalten Sie sofortige Insights.',
      it: "Analisi dati con IA. Importate i vostri file e ottenete insights istantanei.",
      pt: 'Análise de dados com IA. Importe os seus ficheiros e obtenha insights instantâneos.',
    },
    category: 'analytics',
    url: 'https://julius.ai',
    tags: ['Data', 'Insights'],
    free: true,
  },
  {
    name: 'Rows AI',
    description: {
      fr: 'Tableur avec IA intégrée. Analysez et visualisez vos données avec des prompts naturels.',
      en: 'Spreadsheet with built-in AI. Analyze and visualize data with natural prompts.',
      lb: 'Tabellekalkul mat integréierter KI. Analyséiert a visualiséiert Daten mat natierleche Prompts.',
      de: 'Tabellenkalkulation mit integrierter KI. Analysieren und visualisieren Sie Daten mit natürlichen Prompts.',
      it: 'Foglio di calcolo con IA integrata. Analizzate e visualizzate dati con prompt naturali.',
      pt: 'Folha de cálculo com IA integrada. Analise e visualize dados com prompts naturais.',
    },
    category: 'analytics',
    url: 'https://rows.com',
    tags: ['Spreadsheet', 'Charts'],
    free: true,
  },
  {
    name: 'MonkeyLearn',
    description: {
      fr: "Analyse de texte par IA. Classification, analyse de sentiments et extraction d'informations.",
      en: 'AI text analysis. Classification, sentiment analysis and information extraction.',
      lb: 'KI-Textanalyse. Klassifikatioun, Sentimentanalyse an Informatiounsextraktioun.',
      de: 'KI-Textanalyse. Klassifikation, Sentiment-Analyse und Informationsextraktion.',
      it: "Analisi testo con IA. Classificazione, analisi del sentimento ed estrazione informazioni.",
      pt: 'Análise de texto com IA. Classificação, análise de sentimento e extração de informação.',
    },
    category: 'analytics',
    url: 'https://monkeylearn.com',
    tags: ['NLP', 'Sentiment'],
    free: true,
  },

  // Creative & Design
  {
    name: 'Midjourney',
    description: {
      fr: "Génération d'images IA haut de gamme. Créez des visuels professionnels à partir de descriptions.",
      en: 'High-end AI image generation. Create professional visuals from text descriptions.',
      lb: 'Héichwertig KI-Bildgeneratioun. Erstellt professionell Visuellen aus Textbeschreiwungen.',
      de: 'Hochwertige KI-Bildgenerierung. Erstellen Sie professionelle Visuals aus Textbeschreibungen.',
      it: "Generazione immagini IA di alta gamma. Create visual professionali da descrizioni testuali.",
      pt: 'Geração de imagens IA de alta gama. Crie visuais profissionais a partir de descrições.',
    },
    category: 'creative',
    url: 'https://midjourney.com',
    tags: ['Images', 'Design'],
    free: false,
  },
  {
    name: 'Canva AI',
    description: {
      fr: "Design graphique assisté par l'IA. Présentations, posts sociaux, logos et supports marketing.",
      en: 'AI-assisted graphic design. Presentations, social posts, logos and marketing materials.',
      lb: 'KI-ënnerstëtzt grafesch Design. Presentatiounen, sozial Posts, Logoen a Marketingmaterial.',
      de: 'KI-unterstütztes Grafikdesign. Präsentationen, Social Posts, Logos und Marketingmaterial.',
      it: 'Design grafico assistito da IA. Presentazioni, post social, loghi e materiale marketing.',
      pt: 'Design gráfico assistido por IA. Apresentações, posts sociais, logótipos e materiais de marketing.',
    },
    category: 'creative',
    url: 'https://canva.com',
    tags: ['Design', 'Templates'],
    free: true,
  },
  {
    name: 'Runway',
    description: {
      fr: 'Génération et édition vidéo par IA. Effets spéciaux, animations et production vidéo.',
      en: 'AI video generation and editing. Special effects, animations and video production.',
      lb: 'KI-Videogeneratioun an -Editioun. Spezialeffekter, Animatiounen a Videoproduktioun.',
      de: 'KI-Videogenerierung und -Bearbeitung. Spezialeffekte, Animationen und Videoproduktion.',
      it: 'Generazione e editing video con IA. Effetti speciali, animazioni e produzione video.',
      pt: 'Geração e edição de vídeo com IA. Efeitos especiais, animações e produção vídeo.',
    },
    category: 'creative',
    url: 'https://runwayml.com',
    tags: ['Video', 'Effects'],
    free: true,
  },

  // Development
  {
    name: 'GitHub Copilot',
    description: {
      fr: 'Assistant de programmation IA. Complète votre code, génère des fonctions et aide au débogage.',
      en: 'AI coding assistant. Completes your code, generates functions and helps with debugging.',
      lb: 'KI-Programméierassistent. Komplettéiert Äre Code, generéiert Funktiounen an hëlleft beim Debugging.',
      de: 'KI-Programmierassistent. Vervollständigt Ihren Code, generiert Funktionen und hilft beim Debugging.',
      it: 'Assistente di programmazione IA. Completa il codice, genera funzioni e aiuta nel debugging.',
      pt: 'Assistente de programação IA. Completa o código, gera funções e ajuda na depuração.',
    },
    category: 'dev',
    url: 'https://github.com/features/copilot',
    tags: ['Code', 'IDE'],
    free: false,
  },
  {
    name: 'Cursor',
    description: {
      fr: "IDE avec IA intégrée. Éditeur de code intelligent qui comprend l'ensemble de votre projet.",
      en: 'AI-native IDE. Smart code editor that understands your entire project.',
      lb: 'KI-nativ IDE. Intelligent Code-Editor deen Äert ganzt Projet versteet.',
      de: 'KI-natives IDE. Intelligenter Code-Editor, der Ihr gesamtes Projekt versteht.',
      it: 'IDE con IA nativa. Editor di codice intelligente che comprende tutto il progetto.',
      pt: 'IDE com IA nativa. Editor de código inteligente que compreende todo o projeto.',
    },
    category: 'dev',
    url: 'https://cursor.com',
    tags: ['IDE', 'AI-native'],
    free: true,
  },
  {
    name: 'v0 by Vercel',
    description: {
      fr: 'Générateur d\'interfaces web par IA. Créez des composants UI à partir de descriptions textuelles.',
      en: 'AI web interface generator. Create UI components from text descriptions.',
      lb: 'KI Web-Interface Generator. Erstellt UI-Komponenten aus Textbeschreiwungen.',
      de: 'KI-Web-Interface-Generator. Erstellen Sie UI-Komponenten aus Textbeschreibungen.',
      it: 'Generatore di interfacce web con IA. Create componenti UI da descrizioni testuali.',
      pt: 'Gerador de interfaces web com IA. Crie componentes UI a partir de descrições textuais.',
    },
    category: 'dev',
    url: 'https://v0.dev',
    tags: ['UI', 'React'],
    free: true,
  },
]

const categoryIcons: Record<string, React.ReactNode> = {
  Grid: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Chat: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Pen: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  Zap: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Chart: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Palette: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  Code: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
}

interface DirectoryProps {
  onBack: () => void
}

export default function Directory({ onBack }: DirectoryProps) {
  const { lang, t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = AGENTS.filter((agent) => {
    const matchesCategory = activeCategory === 'all' || agent.category === activeCategory
    const matchesSearch = search === '' ||
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description[lang].toLowerCase().includes(search.toLowerCase()) ||
      agent.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 pb-8">
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-8 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('directory.backToHome')}
          </button>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            {t('directory.title')}
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl mb-8 animate-fade-in">
            {t('directory.subtitle')}
          </p>

          {/* Search */}
          <div className="relative max-w-md animate-slide-up">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('directory.search')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {categoryIcons[cat.icon]}
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Agents count */}
        <p className="text-sm text-gray-400 mb-6">
          {filtered.length} {t('directory.agents')}
        </p>

        {/* Agents grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">{t('directory.empty')}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((agent, index) => {
              const cat = CATEGORIES.find((c) => c.id === agent.category)
              return (
                <a
                  key={agent.name}
                  href={agent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="p-6">
                    {/* Top row: name + free badge */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                        {agent.name}
                      </h3>
                      {agent.free ? (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                          {t('directory.free')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">
                          {t('directory.paid')}
                        </span>
                      )}
                    </div>

                    {/* Category tag */}
                    {cat && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium mb-3">
                        {categoryIcons[cat.icon]}
                        {t(cat.labelKey)}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                      {agent.description[lang]}
                    </p>

                    {/* Tags + arrow */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {agent.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-primary-50 text-primary-600 rounded-md font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
