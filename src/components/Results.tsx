'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Program, ProjectRecommendation } from '@/lib/eligibility'

interface ResultsProps {
  eligible: boolean
  programs: Program[]
  projects: ProjectRecommendation[]
  onNext: () => void
}

export default function Results({ eligible, programs, projects, onNext }: ResultsProps) {
  const { lang, t } = useLanguage()
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || submitting) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setEmailSent(true)
      }
    } catch {
      // Silently fail — not critical
    } finally {
      setSubmitting(false)
    }
  }

  const totalCostWithout = projects.reduce((sum, p) => sum + p.estimatedCost, 0)
  const totalCostWith = projects.reduce((sum, p) => sum + p.youPay, 0)
  const totalSavings = totalCostWithout - totalCostWith

  function handleDownloadPdf() {
    const date = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-GB', {
      year: 'numeric', month: 'long', day: 'numeric',
    })

    const programLines = programs.map(
      (p) => `  - ${p.name[lang] || p.name.fr}: ${p.maxGrant.toLocaleString()} € (${p.coveragePercent}% ${t('results.coverage')})`
    ).join('\n')

    const projectLines = projects.map(
      (p) => `  - ${p.title[lang] || p.title.fr}\n    ${t('results.estimatedCost')}: ${p.estimatedCost.toLocaleString()} € | ${t('results.withGrant')}: -${p.grantCoverage.toLocaleString()} € | ${t('results.youPay')}: ${p.youPay.toLocaleString()} €`
    ).join('\n\n')

    const content = `${t('report.title')}
${'='.repeat(40)}
${t('report.generatedOn')}: ${date}

${'─'.repeat(40)}
${t('results.eligible')}
${'─'.repeat(40)}
${programLines}

${'─'.repeat(40)}
${t('results.projects')}
${'─'.repeat(40)}
${projectLines}

${'─'.repeat(40)}
${t('results.comparison')}
${'─'.repeat(40)}
  ${t('results.without')}: ${totalCostWithout.toLocaleString()} €
  ${t('results.with')}: ${totalCostWith.toLocaleString()} €
  ${t('results.savings')}: ${totalSavings.toLocaleString()} €

${'─'.repeat(40)}
forge-simulator.lu
`

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forge-rapport-eligibilite.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!eligible) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-lg text-center animate-fade-in">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            {t('results.notEligible')}
          </p>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            {t('results.contactAnyway')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {t('results.title')}
          </h1>
        </div>

        {/* Eligible Programs */}
        <section className="mb-12 animate-slide-up">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">1</span>
            {t('results.eligible')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {programs.map((program) => (
              <div
                key={program.id}
                className="p-5 bg-white border-2 border-primary-100 rounded-xl hover:border-primary-300 transition-colors"
              >
                <h3 className="font-bold text-gray-900 mb-1">{program.name[lang] || program.name.fr}</h3>
                <p className="text-sm text-gray-500 mb-4">{program.description[lang] || program.description.fr}</p>
                <div className="flex items-baseline gap-4">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">
                      {program.maxGrant.toLocaleString()} €
                    </span>
                    <span className="text-sm text-gray-400 ml-1">{t('results.grant')}</span>
                  </div>
                  <div className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-sm font-medium">
                    {program.coveragePercent}% {t('results.coverage')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Projects */}
        {projects.length > 0 && (
          <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center text-accent-600 text-sm font-bold">2</span>
              {t('results.projects')}
            </h2>
            <div className="space-y-4">
              {projects.map((project, i) => (
                <div
                  key={i}
                  className="p-6 bg-white border border-gray-200 rounded-xl"
                >
                  <h3 className="font-bold text-gray-900 mb-2">{project.title[lang] || project.title.fr}</h3>
                  <p className="text-sm text-gray-500 mb-5">{project.description[lang] || project.description.fr}</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">{t('results.estimatedCost')}</div>
                      <div className="font-bold text-gray-900">{project.estimatedCost.toLocaleString()} €</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xs text-green-600 mb-1">{t('results.withGrant')}</div>
                      <div className="font-bold text-green-700">-{project.grantCoverage.toLocaleString()} €</div>
                    </div>
                    <div className="text-center p-3 bg-primary-50 rounded-lg">
                      <div className="text-xs text-primary-600 mb-1">{t('results.youPay')}</div>
                      <div className="font-bold text-primary-700">{project.youPay.toLocaleString()} €</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cost Comparison */}
        {projects.length > 0 && (
          <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-bold">3</span>
              {t('results.comparison')}
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="p-6 text-center border-r border-gray-200">
                  <div className="text-sm text-gray-400 mb-2">{t('results.without')}</div>
                  <div className="text-3xl font-bold text-gray-400 line-through">
                    {totalCostWithout.toLocaleString()} €
                  </div>
                </div>
                <div className="p-6 text-center bg-primary-50">
                  <div className="text-sm text-primary-600 mb-2">{t('results.with')}</div>
                  <div className="text-3xl font-bold text-primary-700">
                    {totalCostWith.toLocaleString()} €
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 text-center border-t border-green-100">
                <span className="text-green-700 font-semibold">
                  {t('results.savings')} : {totalSavings.toLocaleString()} €
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Download Report */}
        {projects.length > 0 && (
          <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="text-center">
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary-200 text-primary-700 font-semibold rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('results.downloadPdf')}
              </button>
            </div>
          </section>
        )}

        {/* Newsletter subscription */}
        <section className="mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-8 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl text-center">
            {!emailSent ? (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {t('results.getReport')}
                </h3>
                <form onSubmit={handleEmailSubmit} className="flex gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('results.emailPlaceholder')}
                    required
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {t('results.send')}
                  </button>
                </form>
              </>
            ) : (
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-green-700 mb-1">{t('results.sent')}</h3>
                <p className="text-sm text-gray-500">{t('results.sentDesc')}</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-3">{t('results.nextStep')}</p>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            {t('results.talkExpert')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
