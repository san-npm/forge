'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useLanguage } from '@/context/LanguageContext'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'

type Project = {
  id: 'vinsfins' | 'grocerie'
  url: string
  domain: string
  accent: 'wine' | 'olive'
  logo: { src: string; width: number; height: number; boxClass: string }
  // Visible feature bullets — labels come from messages/*.json; the keys
  // here just control which bullets render and in which order. Tech-stack
  // fingerprints stay in the JSON-LD `keywords` so AI engines still
  // categorize the work without exposing jargon to potential leads.
  delivered: ('ecommerce' | 'i18n' | 'stock' | 'seo' | 'perf' | 'admin')[]
}

const projects: Project[] = [
  {
    id: 'vinsfins',
    url: 'https://www.vinsfins.lu',
    domain: 'vinsfins.lu',
    accent: 'wine',
    logo: { src: '/clients/vinsfins-logo.png', width: 56, height: 56, boxClass: 'w-14 h-14' },
    delivered: ['ecommerce', 'i18n', 'stock', 'seo', 'perf', 'admin'],
  },
  {
    id: 'grocerie',
    url: 'https://www.lagrocerie.lu',
    domain: 'lagrocerie.lu',
    accent: 'olive',
    logo: { src: '/clients/lagrocerie-logo.png', width: 140, height: 56, boxClass: 'w-32 h-14' },
    delivered: ['ecommerce', 'i18n', 'stock', 'seo', 'perf', 'admin'],
  },
]

const accentClasses: Record<Project['accent'], { bar: string; bg: string; text: string; ring: string }> = {
  wine: {
    bar: 'bg-gradient-to-r from-rose-500 to-amber-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-100',
  },
  olive: {
    bar: 'bg-gradient-to-r from-emerald-600 to-amber-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-100',
  },
}

const deliveredIcons: Record<NonNullable<Project['delivered'][number]>, React.ReactNode> = {
  ecommerce: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  i18n: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  ),
  stock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  seo: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  perf: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  admin: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
}

export default function ClientsPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageNavbar />

      <main className="flex-1 pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <header className="text-center mb-14 animate-fade-in">
            <p className="text-sm font-semibold tracking-wide uppercase text-primary-600 mb-3">
              {t('clients.eyebrow')}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-4">
              {t('clients.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('clients.subtitle')}
            </p>
            <p className="text-base text-gray-500 max-w-2xl mx-auto mt-4">
              {t('clients.intro')}
            </p>
          </header>

          {/* Projects */}
          <section className="grid gap-8 lg:grid-cols-2 mb-16">
            {projects.map((p, i) => {
              const accent = accentClasses[p.accent]
              return (
                <article
                  key={p.id}
                  className="rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                  aria-labelledby={`project-${p.id}-name`}
                >
                  {/* Brand strip */}
                  <div className={`h-2 ${accent.bar}`} />

                  <div className="p-7">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className={`${p.logo.boxClass} rounded-2xl ring-4 ${accent.ring} ${accent.bg} flex items-center justify-center p-2 shrink-0`}
                      >
                        <Image
                          src={p.logo.src}
                          alt={t(`clients.${p.id}.name`)}
                          width={p.logo.width}
                          height={p.logo.height}
                          className="max-h-full max-w-full w-auto h-auto object-contain"
                        />
                      </div>
                      <div>
                        <h2 id={`project-${p.id}-name`} className="text-2xl font-bold text-navy-900">
                          {t(`clients.${p.id}.name`)}
                        </h2>
                        <p className="text-sm text-gray-500">{p.domain}</p>
                      </div>
                    </div>

                    {/* Pills */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${accent.bg} ${accent.text}`}>
                        {t(`clients.${p.id}.tagline`)}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {t(`clients.${p.id}.location`)}
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {t(`clients.${p.id}.summary`)}
                    </p>

                    {/* Delivered */}
                    <div className="mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-navy-500 mb-3">
                        {t('clients.delivered.title')}
                      </h3>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                        {p.delivered.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className={`mt-0.5 ${accent.text}`}>{deliveredIcons[feature]}</span>
                            <span>{t(`clients.delivered.${feature}`)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:text-primary-600 transition-colors"
                    >
                      {t('clients.viewSite')}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </article>
              )
            })}
          </section>

          {/* AEO/GEO: explicit Q&A block — LLMs index this directly. */}
          <section className="mb-16 p-8 bg-navy-50 rounded-3xl">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">
              {t('clients.faq.title')}
            </h2>
            <dl className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <dt className="font-semibold text-navy-900 mb-1.5">
                    {t(`clients.faq.q${i}.q`)}
                  </dt>
                  <dd className="text-gray-700 leading-relaxed">
                    {t(`clients.faq.q${i}.a`)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Bottom CTA */}
          <section className="text-center bg-gradient-to-br from-navy-900 to-navy-800 text-white rounded-3xl p-10 sm:p-14">
            <h2 className="text-3xl font-bold mb-3">{t('clients.cta.title')}</h2>
            <p className="text-navy-100 mb-7 max-w-xl mx-auto">{t('clients.cta.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-navy-900 font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                {t('clients.cta.primary')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent text-white border-2 border-white/30 font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                {t('clients.cta.secondary')}
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
