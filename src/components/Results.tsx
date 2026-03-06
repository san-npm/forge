'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Program, ProjectRecommendation } from '@/lib/eligibility'
import { jsPDF } from 'jspdf'

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
    const isFr = lang === 'fr' || lang === 'lb'
    const date = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-GB', {
      year: 'numeric', month: 'long', day: 'numeric',
    })

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - margin * 2
    let y = 20

    // ── Helper functions ──
    const addText = (text: string, size: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [30, 30, 60]) => {
      doc.setFontSize(size)
      doc.setFont('helvetica', style)
      doc.setTextColor(...color)
      const lines = doc.splitTextToSize(text, contentWidth)
      if (y + lines.length * (size * 0.4) > 270) {
        doc.addPage()
        y = 20
      }
      doc.text(lines, margin, y)
      y += lines.length * (size * 0.45) + 2
    }

    const addLine = () => {
      doc.setDrawColor(200, 200, 210)
      doc.setLineWidth(0.3)
      doc.line(margin, y, pageWidth - margin, y)
      y += 6
    }

    const checkPage = (needed: number) => {
      if (y + needed > 270) {
        doc.addPage()
        y = 20
      }
    }

    // ── Header ──
    doc.setFillColor(20, 25, 60)
    doc.rect(0, 0, pageWidth, 42, 'F')

    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('OpenLetz', margin, 18)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(180, 185, 220)
    doc.text(isFr
      ? 'Simulateur d\'aides a la digitalisation des PME luxembourgeoises'
      : 'Luxembourg SME digitalisation grants simulator',
      margin, 26)

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(t('report.title'), margin, 36)

    y = 52

    // ── Date ──
    addText(`${t('report.generatedOn')} : ${date}`, 9, 'normal', [120, 120, 140])
    y += 2

    // ── Disclaimer ──
    doc.setFillColor(245, 247, 255)
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 130)
    const disclaimerText = isFr
      ? 'Ce rapport est une estimation indicative basee sur vos reponses. Les montants indiques sont des maximums theoriques (HTVA). L\'eligibilite definitive est determinee par les organismes officiels (House of Entrepreneurship, Chambre des Metiers, Luxinnovation).'
      : 'This report is an indicative estimate based on your answers. Amounts shown are theoretical maximums (excl. VAT). Final eligibility is determined by official bodies (House of Entrepreneurship, Chambre des Metiers, Luxinnovation).'
    const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 8)
    doc.text(disclaimerLines, margin + 4, y + 5)
    y += 22

    addLine()

    // ── Eligible Programs ──
    addText(t('results.eligible'), 14, 'bold', [20, 25, 60])
    y += 2

    programs.forEach((program) => {
      checkPage(24)
      doc.setFillColor(250, 251, 255)
      doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F')
      doc.setDrawColor(200, 210, 240)
      doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'S')

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 30, 60)
      doc.text(program.name[lang] || program.name.fr, margin + 4, y + 7)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(80, 80, 110)
      doc.text(
        `${t('results.upTo')} ${program.maxGrant.toLocaleString()} \u20AC HT  |  ${program.coveragePercent}% ${t('results.coverage')}`,
        margin + 4, y + 14
      )

      y += 24
    })

    y += 4
    addLine()

    // ── Recommended Projects ──
    if (projects.length > 0) {
      addText(t('results.projects'), 14, 'bold', [20, 25, 60])
      y += 2

      projects.forEach((project) => {
        checkPage(32)
        doc.setFillColor(250, 253, 250)
        doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'F')
        doc.setDrawColor(200, 230, 200)
        doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'S')

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(30, 30, 60)
        doc.text(project.title[lang] || project.title.fr, margin + 4, y + 7)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 110)
        const descLines = doc.splitTextToSize(
          project.description[lang] || project.description.fr,
          contentWidth - 8
        )
        doc.text(descLines.slice(0, 2), margin + 4, y + 13)

        const costY = y + 22
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60, 60, 90)
        doc.text(`${t('results.estimatedCost')}: ${project.estimatedCost.toLocaleString()} \u20AC`, margin + 4, costY)
        doc.setTextColor(22, 130, 60)
        doc.text(`${t('results.withGrant')}: -${project.grantCoverage.toLocaleString()} \u20AC`, margin + 64, costY)
        doc.setTextColor(30, 80, 170)
        doc.text(`${t('results.youPay')}: ${project.youPay.toLocaleString()} \u20AC`, margin + 120, costY)

        y += 32
      })

      y += 4
      addLine()

      // ── Cost Comparison Summary ──
      checkPage(30)
      addText(t('results.comparison'), 14, 'bold', [20, 25, 60])
      y += 2

      doc.setFillColor(240, 245, 255)
      doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F')

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(120, 120, 140)
      doc.text(`${t('results.without')}: ${totalCostWithout.toLocaleString()} \u20AC`, margin + 4, y + 8)

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 80, 170)
      doc.text(`${t('results.with')}: ${totalCostWith.toLocaleString()} \u20AC`, margin + 4, y + 15)

      doc.setTextColor(22, 130, 60)
      doc.text(`${t('results.savings')}: ${totalSavings.toLocaleString()} \u20AC`, margin + 90, y + 15)

      y += 30
    }

    addLine()

    // ── About the programs ──
    checkPage(40)
    addText(
      isFr ? 'A propos des programmes' : 'About the programs',
      14, 'bold', [20, 25, 60]
    )
    y += 1
    addText(
      isFr
        ? 'Les SME Packages sont geres par le Ministere de l\'Economie via la House of Entrepreneurship et la Chambre des Metiers. Ils couvrent jusqu\'a 70 % des depenses eligibles sur des projets de 3 000 a 25 000 \u20AC HTVA (soit un maximum de 17 500 \u20AC de subvention). Les programmes Fit 4 (Digital, AI, Innovation) sont geres par Luxinnovation. Tous ces programmes sont cumulables sous certaines conditions, dans la limite des plafonds europeens d\'aides d\'Etat (regle de minimis).'
        : 'SME Packages are managed by the Ministry of Economy through the House of Entrepreneurship and Chambre des Metiers. They cover up to 70% of eligible costs on projects from \u20AC3,000 to \u20AC25,000 excl. VAT (maximum grant: \u20AC17,500). Fit 4 programs (Digital, AI, Innovation) are managed by Luxinnovation. All programs can be combined under certain conditions, within EU state aid limits (de minimis rule).',
      9, 'normal', [80, 80, 110]
    )

    y += 6
    addLine()

    // ── Contact / COMMIT MEDIA ──
    checkPage(50)
    doc.setFillColor(20, 25, 60)
    doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'F')

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(
      isFr ? 'Besoin d\'accompagnement ?' : 'Need support?',
      margin + 6, y + 10
    )

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(180, 185, 220)
    doc.text(
      isFr
        ? 'Un expert vous accompagne gratuitement dans vos demarches d\'aides luxembourgeoises.'
        : 'An expert will guide you through Luxembourg grant applications at no charge.',
      margin + 6, y + 17
    )

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('Bob  |  AI Manager — OpenLetz', margin + 6, y + 26)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(180, 185, 220)
    doc.text('bob@openletz.com  |  +352 661 968 051  |  openletz.com', margin + 6, y + 32)

    y += 46

    // ── Footer ──
    checkPage(16)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 160, 180)
    doc.text(
      '\u00A9 2025\u20132026 COMMIT MEDIA SARL (RCS B276192)  |  openletz.com',
      pageWidth / 2, y + 4,
      { align: 'center' }
    )
    doc.text(
      isFr
        ? 'Ce document est genere automatiquement et ne constitue pas un engagement contractuel.'
        : 'This document is automatically generated and does not constitute a contractual commitment.',
      pageWidth / 2, y + 8,
      { align: 'center' }
    )

    // ── Save ──
    doc.save('openletz-rapport-eligibilite.pdf')
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
                    <span className="text-sm text-gray-400 mr-1">{t('results.upTo')}</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {program.maxGrant.toLocaleString()} €
                    </span>
                    <span className="text-xs text-gray-400 ml-1">HT</span>
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
          <div className="p-8 bg-primary-50 rounded-2xl text-center">
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
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
