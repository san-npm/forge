'use client'

import { useLanguage } from '@/context/LanguageContext'

interface LandingPageProps {
  onStart: () => void
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-block mb-6 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
            {t('hero.trust')} — Luxinnovation &middot; Ministère de l&apos;Économie
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {t('hero.title')}
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-lg font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:from-primary-700 hover:to-primary-800 transition-all transform hover:-translate-y-0.5"
          >
            {t('hero.cta')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      {/* Key figures */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center animate-slide-up">
              <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                {t('hero.stat1.value')}
              </div>
              <div className="text-gray-500 text-sm sm:text-base">
                {t('hero.stat1.label')}
              </div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                {t('hero.stat2.value')}
              </div>
              <div className="text-gray-500 text-sm sm:text-base">
                {t('hero.stat2.label')}
              </div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                {t('hero.stat3.value')}
              </div>
              <div className="text-gray-500 text-sm sm:text-base">
                {t('hero.stat3.label')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs text-gray-400 uppercase tracking-wider mb-6">
            {t('hero.trust')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">LX</span>
              </div>
              <span className="text-sm font-medium">Luxinnovation</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">ME</span>
              </div>
              <span className="text-sm font-medium">Ministère de l&apos;Économie</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">DL</span>
              </div>
              <span className="text-sm font-medium">Digital Luxembourg</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
