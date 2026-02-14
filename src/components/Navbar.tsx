'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Language } from '@/context/LanguageContext'

const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: 'fr', flag: '\u{1F1EB}\u{1F1F7}', label: 'Français' },
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', label: 'English' },
  { code: 'lb', flag: '\u{1F1F1}\u{1F1FA}', label: 'Lëtzebuergesch' },
  { code: 'de', flag: '\u{1F1E9}\u{1F1EA}', label: 'Deutsch' },
  { code: 'it', flag: '\u{1F1EE}\u{1F1F9}', label: 'Italiano' },
  { code: 'pt', flag: '\u{1F1F5}\u{1F1F9}', label: 'Português' },
]

interface NavbarProps {
  onNavigate?: (screen: string) => void
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const { lang, setLang, t } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)

  const currentLang = LANGUAGES.find((l) => l.code === lang)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate?.('landing')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Forge</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <button onClick={() => onNavigate?.('landing')} className="hover:text-primary-600 transition-colors">
              {t('nav.simulator')}
            </button>
            <button onClick={() => onNavigate?.('directory')} className="hover:text-primary-600 transition-colors">
              {t('nav.directory')}
            </button>
            <button onClick={() => onNavigate?.('blog')} className="hover:text-primary-600 transition-colors">
              {t('nav.blog')}
            </button>
            <button onClick={() => onNavigate?.('agent')} className="hover:text-primary-600 transition-colors">
              {t('nav.contact')}
            </button>
          </div>

          {/* Language selector with flags */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <span className="text-base leading-none">{currentLang?.flag}</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[180px]">
                {LANGUAGES.map(({ code, flag, label }) => (
                  <button
                    key={code}
                    onClick={() => { setLang(code); setLangOpen(false) }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 ${
                      lang === code
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base leading-none">{flag}</span>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
