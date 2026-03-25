'use client'

import { Link } from '@/i18n/routing'
import { useLanguage } from '@/context/LanguageContext'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'
import { BreadcrumbJsonLd, useBreadcrumbs } from '@/components/BreadcrumbJsonLd'

const programs = [
  { name: 'SME Packages — Digital', maxGrant: '17 500', coverage: 70 },
  { name: 'SME Packages — IA / AI', maxGrant: '17 500', coverage: 70 },
  { name: 'SME Packages — Cybersécurité', maxGrant: '17 500', coverage: 70 },
  { name: 'Fit 4 Digital', maxGrant: '5 000', coverage: 100, note: 'Phase 1' },
  { name: 'Fit 4 AI', maxGrant: '25 000', coverage: 50 },
  { name: 'Fit 4 Innovation', maxGrant: '7 500', coverage: 50 },
]

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    
    <div className="min-h-screen flex flex-col bg-white">
      <PageNavbar />

      <main className="flex-1 pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-4">
              {t('about.title')}
            </h1>
          </div>

          {/* Mission */}
          <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('about.mission.title')}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('about.mission.text')}
                </p>
              </div>
            </div>
          </section>

          {/* Why OpenLetz */}
          <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('about.why.title')}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('about.why.text')}
                </p>
              </div>
            </div>
          </section>

          {/* Programs */}
          <section className="mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start gap-5 mb-8">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('about.programs.title')}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('about.programs.text')}
                </p>
              </div>
            </div>

            {/* Programs grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <div
                  key={program.name}
                  className="p-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-gray-900 mb-3">{program.name}</h3>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">
                        {program.maxGrant} &euro;
                      </span>
                      {'note' in program && (
                        <span className="ml-1.5 text-xs text-gray-400 font-medium">
                          ({(program as { note: string }).note})
                        </span>
                      )}
                    </div>
                    <div className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-semibold">
                      {program.coverage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key figures — GEO credibility signals */}
          <section className="mb-16 animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <div className="flex items-start gap-5 mb-8">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('about.figures.title')}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t('about.figures.text')}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="text-center p-5 bg-navy-50 rounded-2xl">
                <div className="text-3xl font-bold text-navy-900">6</div>
                <div className="text-sm text-gray-600 mt-1">{t('about.figures.stat1')}</div>
              </div>
              <div className="text-center p-5 bg-navy-50 rounded-2xl">
                <div className="text-3xl font-bold text-navy-900">25 000 €</div>
                <div className="text-sm text-gray-600 mt-1">{t('about.figures.stat2')}</div>
              </div>
              <div className="text-center p-5 bg-navy-50 rounded-2xl">
                <div className="text-3xl font-bold text-navy-900">32</div>
                <div className="text-sm text-gray-600 mt-1">{t('about.figures.stat3')}</div>
              </div>
              <div className="text-center p-5 bg-navy-50 rounded-2xl">
                <div className="text-3xl font-bold text-navy-900">10 sec</div>
                <div className="text-sm text-gray-600 mt-1">{t('about.figures.stat4')}</div>
              </div>
            </div>

            {/* Sources for GEO credibility */}
            <div className="p-5 bg-gray-50 rounded-2xl text-sm text-gray-500">
              <p className="font-semibold text-gray-700 mb-2">{t('about.figures.sources')}</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>
                  <a className="text-primary-600 underline" href="https://www.houseofentrepreneurship.lu" target="_blank" rel="noopener noreferrer">
                    House of Entrepreneurship
                  </a> — SME Packages (Digital, IA, Cybersécurité)
                </li>
                <li>
                  <a className="text-primary-600 underline" href="https://www.luxinnovation.lu" target="_blank" rel="noopener noreferrer">
                    Luxinnovation
                  </a> — Fit 4 Digital, Fit 4 AI, Fit 4 Innovation
                </li>
                <li>
                  <a className="text-primary-600 underline" href="https://meco.gouvernement.lu" target="_blank" rel="noopener noreferrer">
                    {t('about.figures.source3')}
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-navy-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              {t('about.cta')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    
  )
}
