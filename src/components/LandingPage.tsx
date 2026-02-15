'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

interface LandingPageProps {
  onStart: () => void
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-navy-900 pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-navy-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 text-navy-500 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const { t } = useLanguage()

  const features = [
    {
      titleKey: 'features.1.title',
      descKey: 'features.1.desc',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      titleKey: 'features.2.title',
      descKey: 'features.2.desc',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      titleKey: 'features.3.title',
      descKey: 'features.3.desc',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      titleKey: 'features.4.title',
      descKey: 'features.4.desc',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      titleKey: 'features.5.title',
      descKey: 'features.5.desc',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      titleKey: 'features.6.title',
      descKey: 'features.6.desc',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ]

  const faqs = [
    { qKey: 'faq.1.q', aKey: 'faq.1.a' },
    { qKey: 'faq.2.q', aKey: 'faq.2.a' },
    { qKey: 'faq.3.q', aKey: 'faq.3.a' },
    { qKey: 'faq.4.q', aKey: 'faq.4.a' },
    { qKey: 'faq.5.q', aKey: 'faq.5.a' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <section className="pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: text */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-sm font-medium text-primary-700 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('hero.badge')}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-navy-900 leading-[1.1] mb-6 tracking-tight">
                {t('hero.title')}
              </h1>

              <p className="text-lg text-navy-500 mb-8 max-w-lg leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onStart}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-navy-900 text-white font-semibold rounded-full hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 hover:shadow-xl hover:shadow-navy-900/25 hover:-translate-y-0.5"
                >
                  {t('hero.cta')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-navy-200 text-navy-700 font-semibold rounded-full hover:border-navy-300 hover:bg-navy-50 transition-all"
                >
                  {t('hero.cta2')}
                </Link>
              </div>
            </div>

            {/* Right: floating cards */}
            <div className="relative hidden lg:block">
              <div className="relative h-[420px]">
                {/* Main card */}
                <div className="absolute top-0 right-0 w-[320px] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-slide-up">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{t('results.eligible')}</p>
                      <p className="text-xs text-navy-400">Forge Simulator</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
                      <span className="text-sm font-medium text-navy-700">SME Package Digital</span>
                      <span className="text-sm font-bold text-primary-600">17 500 &euro;</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
                      <span className="text-sm font-medium text-navy-700">Fit 4 AI</span>
                      <span className="text-sm font-bold text-primary-600">25 000 &euro;</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
                      <span className="text-sm font-medium text-navy-700">Fit 4 Innovation</span>
                      <span className="text-sm font-bold text-primary-600">7 500 &euro;</span>
                    </div>
                  </div>
                </div>

                {/* Floating stat card */}
                <div className="absolute bottom-8 left-0 w-[200px] bg-white rounded-2xl shadow-lg border border-gray-100 p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  <p className="text-3xl font-bold text-primary-600 mb-1">{t('hero.stat1.value')}</p>
                  <p className="text-sm text-navy-500">{t('hero.stat1.label')}</p>
                </div>

                {/* Small badge */}
                <div className="absolute top-32 -left-4 bg-white rounded-xl shadow-md border border-gray-100 px-4 py-3 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy-900">{t('hero.stat3.value')} {t('hero.stat3.label')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner logos */}
      <section className="py-10 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-xs text-navy-400 uppercase tracking-widest font-medium mb-6">
            {t('hero.partners')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            <div className="flex items-center gap-2.5 text-navy-300 hover:text-navy-500 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <span className="text-[10px] font-bold text-navy-400">LX</span>
              </div>
              <span className="text-sm font-medium">Luxinnovation</span>
            </div>
            <div className="flex items-center gap-2.5 text-navy-300 hover:text-navy-500 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <span className="text-[10px] font-bold text-navy-400">ME</span>
              </div>
              <span className="text-sm font-medium">Minist&egrave;re de l&apos;&Eacute;conomie</span>
            </div>
            <div className="flex items-center gap-2.5 text-navy-300 hover:text-navy-500 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <span className="text-[10px] font-bold text-navy-400">DL</span>
              </div>
              <span className="text-sm font-medium">Digital Luxembourg</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center animate-slide-up">
              <div className="text-5xl font-bold text-navy-900 mb-2">{t('hero.stat1.value')}</div>
              <div className="text-navy-500">{t('hero.stat1.label')}</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-bold text-navy-900 mb-2">{t('hero.stat2.value')}</div>
              <div className="text-navy-500">{t('hero.stat2.label')}</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-bold text-navy-900 mb-2">{t('hero.stat3.value')}</div>
              <div className="text-navy-500">{t('hero.stat3.label')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-lg text-navy-500 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.titleKey}
                className="bg-white rounded-2xl p-7 border border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-5">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{t(f.titleKey)}</h3>
                <p className="text-navy-500 leading-relaxed text-sm">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 text-center mb-12">
            {t('faq.title')}
          </h2>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem
                key={faq.qKey}
                question={t(faq.qKey)}
                answer={t(faq.aKey)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('hero.title')}
          </h2>
          <p className="text-lg text-navy-300 mb-8 max-w-xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white text-lg font-semibold rounded-full hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:-translate-y-0.5"
          >
            {t('hero.cta')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  )
}
