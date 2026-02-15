'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'
import AgentLogo from '@/components/AgentLogo'
import { AGENTS } from '@/lib/agents'

const serviceIcons = {
  dev: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  ai: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  maintenance: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  consulting: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
}

export default function PricingPage() {
  const { t, lang } = useLanguage()

  const services = [
    {
      key: 'dev',
      titleKey: 'pricing.svc.dev.title',
      priceKey: 'pricing.svc.dev.price',
      descKey: 'pricing.svc.dev.desc',
      features: ['pricing.svc.dev.f1', 'pricing.svc.dev.f2', 'pricing.svc.dev.f3', 'pricing.svc.dev.f4', 'pricing.svc.dev.f5'],
      icon: serviceIcons.dev,
      highlighted: true,
      color: 'primary',
    },
    {
      key: 'ai',
      titleKey: 'pricing.svc.ai.title',
      priceKey: 'pricing.svc.ai.price',
      descKey: 'pricing.svc.ai.desc',
      features: ['pricing.svc.ai.f1', 'pricing.svc.ai.f2', 'pricing.svc.ai.f3', 'pricing.svc.ai.f4', 'pricing.svc.ai.f5'],
      icon: serviceIcons.ai,
      highlighted: true,
      color: 'accent',
    },
    {
      key: 'maintenance',
      titleKey: 'pricing.svc.maintenance.title',
      priceKey: 'pricing.svc.maintenance.price',
      descKey: 'pricing.svc.maintenance.desc',
      features: ['pricing.svc.maintenance.f1', 'pricing.svc.maintenance.f2', 'pricing.svc.maintenance.f3', 'pricing.svc.maintenance.f4'],
      icon: serviceIcons.maintenance,
      highlighted: false,
      color: 'gray',
    },
    {
      key: 'consulting',
      titleKey: 'pricing.svc.consulting.title',
      priceKey: 'pricing.svc.consulting.price',
      descKey: 'pricing.svc.consulting.desc',
      features: ['pricing.svc.consulting.f1', 'pricing.svc.consulting.f2', 'pricing.svc.consulting.f3', 'pricing.svc.consulting.f4'],
      icon: serviceIcons.consulting,
      highlighted: false,
      color: 'gray',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageNavbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 mb-4 animate-slide-up">
              {t('pricing.title')}
            </h1>
            <p className="text-lg text-navy-500 max-w-3xl mx-auto animate-slide-up">
              {t('pricing.subtitle')}
            </p>
          </div>

          {/* AI Advantage banner */}
          <div className="max-w-3xl mx-auto mb-16 animate-slide-up">
            <div className="relative rounded-2xl bg-navy-900 p-6 sm:p-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold">{t('pricing.advantage.title')}</h2>
                </div>
                <p className="text-navy-300 leading-relaxed text-sm sm:text-base">
                  {t('pricing.advantage.text')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Free Simulator */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 animate-slide-up">
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 sm:p-8 text-center bg-gray-50/50">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.free.title')}</h2>
            <p className="text-3xl font-bold text-green-600 mb-4">{t('pricing.free.price')}</p>
            <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('pricing.free.f1')}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('pricing.free.f2')}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('pricing.free.f3')}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('pricing.free.f4')}
              </span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              {t('pricing.cta.free')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Services Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((svc, idx) => (
              <div
                key={svc.key}
                className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 animate-slide-up ${
                  svc.highlighted
                    ? 'border-2 border-primary-200 shadow-lg bg-white'
                    : 'border-gray-200 shadow-sm hover:shadow-md bg-white'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {svc.highlighted && (
                  <div className="absolute -top-3 right-6">
                    <span className={`inline-block text-white text-xs font-semibold px-3 py-1 rounded-full ${
                      svc.color === 'primary' ? 'bg-primary-600' : 'bg-accent-500'
                    }`}>
                      {t('pricing.recommended')}
                    </span>
                  </div>
                )}

                {/* Icon + title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    svc.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                    svc.color === 'accent' ? 'bg-accent-100 text-accent-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {svc.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{t(svc.titleKey)}</h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <span className={`text-2xl font-bold ${
                    svc.color === 'primary' ? 'text-primary-600' :
                    svc.color === 'accent' ? 'text-accent-600' :
                    'text-gray-900'
                  }`}>
                    {t(svc.priceKey)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">{t(svc.descKey)}</p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {svc.features.map((fKey) => (
                    <li key={fKey} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">{t(fKey)}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/"
                  className={`block text-center py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                    svc.highlighted
                      ? 'bg-navy-900 text-white hover:bg-navy-800 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('pricing.cta.contact')}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* AI Tools Pricing */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
              {t('pricing.agents.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up">
              {t('pricing.agents.subtitle')}
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 shadow animate-slide-up">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {t('directory.cat.all') === 'All' ? 'Name' : 'Nom'}
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {lang === 'fr' ? 'Catégorie' : lang === 'en' ? 'Category' : lang === 'de' ? 'Kategorie' : lang === 'lb' ? 'Kategorie' : lang === 'it' ? 'Categoria' : 'Categoria'}
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {t('directory.free')}/{t('directory.paid')}
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {t('agent.pricing')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {AGENTS.map((agent) => (
                  <tr key={agent.slug} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/agents/${agent.slug}`}
                        className="inline-flex items-center gap-3 text-sm font-medium text-primary-700 hover:text-primary-800 hover:underline"
                      >
                        <AgentLogo slug={agent.slug} name={agent.name} size="sm" />
                        {agent.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full capitalize">
                        {agent.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                        agent.free ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {agent.free ? t('directory.freemium') : t('directory.paid')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      {agent.pricing[lang] || agent.pricing.fr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 animate-slide-up">
            {AGENTS.map((agent) => (
              <Link
                key={agent.slug}
                href={`/agents/${agent.slug}`}
                className="block rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200 bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AgentLogo slug={agent.slug} name={agent.name} size="sm" />
                    <h3 className="text-base font-semibold text-gray-900">{agent.name}</h3>
                  </div>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                    agent.free ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {agent.free ? t('directory.freemium') : t('directory.paid')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {agent.pricing[lang] || agent.pricing.fr}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
