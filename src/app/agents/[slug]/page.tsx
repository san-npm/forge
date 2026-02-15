'use client'

import { useParams } from 'next/navigation'
import { getAgentBySlug, CATEGORIES, AGENT_VISUALS } from '@/lib/agents'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import AgentLogo from '@/components/AgentLogo'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'

function getComplianceStatus(
  value: boolean | 'partial',
  t: (key: string) => string
): { label: string; color: string; icon: React.ReactNode } {
  if (value === true) {
    return {
      label: t('agent.yes'),
      color: 'green',
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    }
  }
  if (value === 'partial') {
    return {
      label: t('agent.partial'),
      color: 'yellow',
      icon: (
        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
  }
  return {
    label: t('agent.no'),
    color: 'red',
    icon: (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  }
}

export default function AgentDetailPage() {
  const params = useParams()
  const { lang, t } = useLanguage()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const agent = getAgentBySlug(slug)

  if (!agent) {
    return (
      <>
        <PageNavbar />
        <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent not found</h1>
            <p className="text-gray-500 mb-6">The agent you are looking for does not exist.</p>
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('agent.backToDirectory')}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const category = CATEGORIES.find((c) => c.id === agent.category)

  const gdprStatus = getComplianceStatus(agent.euCompliance.gdprCompliant, t)
  const euAiActStatus = getComplianceStatus(agent.euCompliance.euAiActReady, t)
  const dataResidencyStatus = getComplianceStatus(agent.euCompliance.hasEuDataResidency, t)
  const dpaStatus = getComplianceStatus(agent.euCompliance.dpaAvailable, t)

  const statusBgMap: Record<string, string> = {
    green: 'bg-green-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50',
  }

  const statusBorderMap: Record<string, string> = {
    green: 'border-green-200',
    yellow: 'border-yellow-200',
    red: 'border-red-200',
  }

  const statusTextMap: Record<string, string> = {
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    red: 'text-red-700',
  }

  return (
    <>
      <PageNavbar />
      <div className="min-h-screen pt-20 pb-16 bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 pb-10">
          <div className="max-w-5xl mx-auto px-4 pt-8">
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 text-sm text-primary-100 hover:text-white transition-colors mb-8 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('agent.backToDirectory')}
            </Link>

            <div className="animate-fade-in">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <AgentLogo slug={slug} name={agent.name} size="lg" className="ring-2 ring-white/30" />
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                    {agent.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {category && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                        {t(category.labelKey)}
                      </span>
                    )}
                    {agent.free ? (
                      <span className="px-3 py-1 text-sm font-medium bg-green-500/20 text-green-100 rounded-full backdrop-blur-sm">
                        {t('directory.free')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm font-medium bg-amber-500/20 text-amber-100 rounded-full backdrop-blur-sm">
                        {t('directory.paid')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-lg text-primary-100 max-w-3xl animate-slide-up">
                {agent.description[lang] || agent.description.fr}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="max-w-5xl mx-auto px-4 -mt-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column: Long description + tags */}
            <div className="lg:col-span-2 animate-slide-up">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {agent.longDescription[lang] || agent.longDescription.fr}
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {agent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-lg font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Info card */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {t('agent.vendor')}
                    </p>
                    <p className="text-sm font-medium text-gray-900">{agent.vendor}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {t('agent.founded')}
                    </p>
                    <p className="text-sm font-medium text-gray-900">{agent.founded}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {t('agent.headquarters')}
                    </p>
                    <p className="text-sm font-medium text-gray-900">{agent.headquarters}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {t('agent.pricing')}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {agent.pricing[lang] || agent.pricing.fr}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EU Compliance Section */}
        <div className="max-w-5xl mx-auto px-4 mt-10">
          <div className="bg-white rounded-2xl border-2 border-primary-200 shadow-sm p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {t('agent.euCompliance')}
              </h2>
            </div>

            {/* Compliance indicators grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className={`rounded-xl border p-4 ${statusBgMap[gdprStatus.color]} ${statusBorderMap[gdprStatus.color]}`}>
                <div className="flex items-center gap-2 mb-2">
                  {gdprStatus.icon}
                  <span className="text-sm font-semibold text-gray-900">{t('agent.gdpr')}</span>
                </div>
                <p className={`text-sm font-medium ${statusTextMap[gdprStatus.color]}`}>
                  {gdprStatus.label}
                </p>
              </div>

              <div className={`rounded-xl border p-4 ${statusBgMap[euAiActStatus.color]} ${statusBorderMap[euAiActStatus.color]}`}>
                <div className="flex items-center gap-2 mb-2">
                  {euAiActStatus.icon}
                  <span className="text-sm font-semibold text-gray-900">{t('agent.euAiAct')}</span>
                </div>
                <p className={`text-sm font-medium ${statusTextMap[euAiActStatus.color]}`}>
                  {euAiActStatus.label}
                </p>
              </div>

              <div className={`rounded-xl border p-4 ${statusBgMap[dataResidencyStatus.color]} ${statusBorderMap[dataResidencyStatus.color]}`}>
                <div className="flex items-center gap-2 mb-2">
                  {dataResidencyStatus.icon}
                  <span className="text-sm font-semibold text-gray-900">{t('agent.dataResidency')}</span>
                </div>
                <p className={`text-sm font-medium ${statusTextMap[dataResidencyStatus.color]}`}>
                  {dataResidencyStatus.label}
                </p>
              </div>

              <div className={`rounded-xl border p-4 ${statusBgMap[dpaStatus.color]} ${statusBorderMap[dpaStatus.color]}`}>
                <div className="flex items-center gap-2 mb-2">
                  {dpaStatus.icon}
                  <span className="text-sm font-semibold text-gray-900">{t('agent.dpa')}</span>
                </div>
                <p className={`text-sm font-medium ${statusTextMap[dpaStatus.color]}`}>
                  {dpaStatus.label}
                </p>
              </div>
            </div>

            {/* Data Location */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {t('agent.dataLocation')}
              </h3>
              <p className="text-sm text-gray-600">
                {agent.euCompliance.dataLocation}
              </p>
            </div>

            {/* Certifications */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {t('agent.certifications')}
              </h3>
              {agent.euCompliance.certifications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {agent.euCompliance.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-50 text-accent-700 rounded-lg text-xs font-medium border border-accent-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      {cert}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  {t('agent.noCertifications')}
                </p>
              )}
            </div>

            {/* Compliance Note */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {t('agent.complianceNote')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {agent.euCompliance.complianceNote[lang] || agent.euCompliance.complianceNote.fr}
              </p>
            </div>
          </div>
        </div>

        {/* CTA: Visit website */}
        <div className="max-w-5xl mx-auto px-4 mt-10 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <a
            href={agent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-accent-600 transition-all shadow-lg shadow-primary-500/25"
          >
            {t('agent.visitSite')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
      <Footer />
    </>
  )
}
