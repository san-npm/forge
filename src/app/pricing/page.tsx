'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'
import { AGENTS } from '@/lib/agents'

export default function PricingPage() {
  const { t, lang } = useLanguage()

  const plans = [
    {
      titleKey: 'pricing.free.title',
      priceKey: 'pricing.free.price',
      features: ['pricing.free.f1', 'pricing.free.f2', 'pricing.free.f3', 'pricing.free.f4'],
      ctaKey: 'pricing.cta.free',
      ctaHref: '/',
      highlighted: false,
    },
    {
      titleKey: 'pricing.starter.title',
      priceKey: 'pricing.starter.price',
      priceSuffix: 'pricing.perProject',
      features: ['pricing.starter.f1', 'pricing.starter.f2', 'pricing.starter.f3', 'pricing.starter.f4'],
      ctaKey: 'pricing.cta.contact',
      ctaHref: '/',
      highlighted: true,
    },
    {
      titleKey: 'pricing.pro.title',
      priceKey: 'pricing.pro.price',
      features: ['pricing.pro.f1', 'pricing.pro.f2', 'pricing.pro.f3', 'pricing.pro.f4'],
      ctaKey: 'pricing.cta.contact',
      ctaHref: '/',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageNavbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Section 1: Forge Service Pricing */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
              {t('pricing.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 animate-slide-up ${
                  plan.highlighted
                    ? 'border-2 border-primary-500 shadow-lg scale-[1.02]'
                    : 'border-gray-200 shadow hover:shadow-md'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      {t('pricing.recommended')}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t(plan.titleKey)}
                </h3>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {t(plan.priceKey)}
                  </span>
                  {plan.priceSuffix && (
                    <span className="text-sm text-gray-500 ml-1">
                      {t(plan.priceSuffix)}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((featureKey) => (
                    <li key={featureKey} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`block text-center py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-700 hover:to-accent-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(plan.ctaKey)}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: AI Tools Pricing */}
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
                  <tr
                    key={agent.slug}
                    className="hover:bg-primary-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/agents/${agent.slug}`}
                        className="text-sm font-medium text-primary-700 hover:text-primary-800 hover:underline"
                      >
                        {agent.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full capitalize">
                        {agent.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                          agent.free
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {agent.free ? t('directory.free') : t('directory.paid')}
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
                className="block rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">
                    {agent.name}
                  </h3>
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                      agent.free
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {agent.free ? t('directory.free') : t('directory.paid')}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full capitalize">
                    {agent.category}
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
