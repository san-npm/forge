'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { AGENTS, CATEGORIES, AGENT_VISUALS } from '@/lib/agents'
import AgentLogo from '@/components/AgentLogo'

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
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      {/* Header */}
      <div className="bg-navy-900 pb-12">
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-primary-100 hover:text-white transition-colors mb-8 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('directory.backToHome')}
          </button>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in">
            {t('directory.title')}
          </h1>
          <p className="text-lg text-primary-100 max-w-3xl mb-8 animate-fade-in">
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 text-sm shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
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
        <p className="text-sm text-gray-500 mb-6 font-medium">
          {filtered.length} {t('directory.agents')}
        </p>

        {/* Agents grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-20">{t('directory.empty')}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((agent, index) => {
              const cat = CATEGORIES.find((c) => c.id === agent.category)
              const visual = AGENT_VISUALS[agent.slug]
              const gdpr = agent.euCompliance.gdprCompliant
              return (
                <a
                  key={agent.slug}
                  href={`/agents/${agent.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-primary-300 transition-all duration-300 overflow-hidden animate-slide-up hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  {/* Colored top accent bar */}
                  <div
                    className="h-1 w-full"
                    style={{ backgroundColor: visual?.color || '#6B7280' }}
                  />
                  <div className="p-6">
                    {/* Logo + name row */}
                    <div className="flex items-start gap-4 mb-4">
                      <AgentLogo slug={agent.slug} name={agent.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                          {agent.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">{agent.vendor}</p>
                      </div>
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {agent.free ? (
                        <span className="px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 rounded-full border border-green-200">
                          {t('directory.free')}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                          {t('directory.paid')}
                        </span>
                      )}
                      {gdpr === true && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-200">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zm3.707 5.763a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          GDPR
                        </span>
                      )}
                      {gdpr === 'partial' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                          GDPR~
                        </span>
                      )}
                      {cat && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                          {categoryIcons[cat.icon]}
                          {t(cat.labelKey)}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                      {agent.description[lang]}
                    </p>

                    {/* Tags + arrow */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {agent.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-primary-50 text-primary-700 rounded-md font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
