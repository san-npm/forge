'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function Navbar() {
  const { lang, setLang, t } = useLanguage()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Forge</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <span className="hover:text-primary-600 cursor-pointer transition-colors">
              {t('nav.simulator')}
            </span>
            <span className="hover:text-primary-600 cursor-pointer transition-colors">
              {t('nav.programs')}
            </span>
            <span className="hover:text-primary-600 cursor-pointer transition-colors">
              {t('nav.contact')}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setLang('fr')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                lang === 'fr'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                lang === 'en'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
