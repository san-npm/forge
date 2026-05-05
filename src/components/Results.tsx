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

// Format an integer with regular ASCII space as thousands separator. The
// browser's Intl `toLocaleString('fr-FR')` returns U+202F (NARROW NO-BREAK
// SPACE), which jsPDF's helvetica core encoding renders as `/` — producing
// "17 /500" instead of "17 500". A plain regex avoids the entire class of bug.
function fmtInt(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// Load /openletz.svg, recolour fills, rasterise to a PNG dataURL.
async function loadLogoDataUrl(fillHex: string, sizePx = 512): Promise<string | null> {
  try {
    const res = await fetch('/openletz.svg')
    const raw = await res.text()
    const recoloured = raw.replace(/fill="#201B21"/gi, `fill="${fillHex}"`)
    const blob = new Blob([recoloured], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    try {
      const img = new Image()
      img.src = url
      await img.decode()
      const canvas = document.createElement('canvas')
      canvas.width = sizePx
      canvas.height = sizePx
      const ctx = canvas.getContext('2d')
      if (!ctx) return null
      ctx.clearRect(0, 0, sizePx, sizePx)
      ctx.drawImage(img, 0, 0, sizePx, sizePx)
      return canvas.toDataURL('image/png')
    } finally {
      URL.revokeObjectURL(url)
    }
  } catch {
    return null
  }
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

  async function handleDownloadPdf() {
    const isFr = lang === 'fr' || lang === 'lb'
    const dateLocale = lang === 'fr' || lang === 'lb' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-GB'
    // Strip narrow no-break space (U+202F) and regular NBSP (U+00A0) so jsPDF
    // renders dates cleanly.
    const date = new Date()
      .toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
      .replace(/ | /g, ' ')

    // Brand palette (mirrors tailwind.config.js)
    const NAVY: [number, number, number] = [20, 25, 60]
    const NAVY_TEXT: [number, number, number] = [30, 30, 60]
    const NAVY_SOFT: [number, number, number] = [80, 80, 110]
    const GREY: [number, number, number] = [120, 120, 140]
    const GREY_FAINT: [number, number, number] = [160, 160, 180]
    const EMERALD: [number, number, number] = [16, 185, 129]   // primary-500
    const EMERALD_DARK: [number, number, number] = [4, 120, 87] // primary-700
    const EMERALD_TINT: [number, number, number] = [236, 253, 245]
    const BORDER_SOFT: [number, number, number] = [226, 232, 240]
    const HEADER_TINT: [number, number, number] = [203, 213, 225]

    const logoWhite = await loadLogoDataUrl('#FFFFFF', 512)

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 18
    const contentWidth = pageWidth - margin * 2
    let y = 20

    const setColor = (rgb: [number, number, number]) =>
      doc.setTextColor(rgb[0], rgb[1], rgb[2])

    const addText = (
      text: string,
      size: number,
      style: 'normal' | 'bold' = 'normal',
      color: [number, number, number] = NAVY_TEXT
    ) => {
      doc.setFontSize(size)
      doc.setFont('helvetica', style)
      setColor(color)
      const lines = doc.splitTextToSize(text, contentWidth)
      if (y + lines.length * (size * 0.4) > pageHeight - 22) {
        doc.addPage()
        y = 22
      }
      doc.text(lines, margin, y)
      y += lines.length * (size * 0.45) + 2
    }

    const addLine = (color: [number, number, number] = BORDER_SOFT) => {
      doc.setDrawColor(color[0], color[1], color[2])
      doc.setLineWidth(0.3)
      doc.line(margin, y, pageWidth - margin, y)
      y += 6
    }

    const checkPage = (needed: number) => {
      if (y + needed > pageHeight - 22) {
        doc.addPage()
        y = 22
      }
    }

    // ── Header band ──────────────────────────────────────────────────────
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2])
    doc.rect(0, 0, pageWidth, 44, 'F')

    let textLeft = margin
    if (logoWhite) {
      doc.addImage(logoWhite, 'PNG', margin, 10, 12, 12)
      textLeft = margin + 16
    }

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('openletz', textLeft, 18)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    setColor(HEADER_TINT)
    doc.text(
      isFr
        ? 'Simulateur d’aides à la digitalisation des PME luxembourgeoises'
        : 'Luxembourg SME digitalisation grants simulator',
      textLeft, 23
    )

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(t('report.title'), margin, 38)

    // Emerald accent strip beneath the band
    doc.setFillColor(EMERALD[0], EMERALD[1], EMERALD[2])
    doc.rect(0, 44, pageWidth, 1.2, 'F')

    y = 56

    // ── Date ─────────────────────────────────────────────────────────────
    addText(`${t('report.generatedOn')} : ${date}`, 9, 'normal', GREY)
    y += 2

    // ── Disclaimer ───────────────────────────────────────────────────────
    doc.setFillColor(EMERALD_TINT[0], EMERALD_TINT[1], EMERALD_TINT[2])
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    setColor(NAVY_SOFT)
    const disclaimerText = isFr
      ? 'Ce rapport est une estimation indicative basée sur vos réponses. Les montants indiqués sont des maximums théoriques (HTVA). L’éligibilité définitive est déterminée par les organismes officiels (House of Entrepreneurship, Chambre des Métiers, Luxinnovation).'
      : 'This report is an indicative estimate based on your answers. Amounts shown are theoretical maximums (excl. VAT). Final eligibility is determined by official bodies (House of Entrepreneurship, Chambre des Métiers, Luxinnovation).'
    const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 8)
    doc.text(disclaimerLines, margin + 4, y + 5)
    y += 24

    addLine()

    // ── Eligible Programs ────────────────────────────────────────────────
    addText(t('results.eligible'), 14, 'bold', NAVY)
    y += 2

    programs.forEach((program) => {
      checkPage(24)
      doc.setFillColor(252, 253, 255)
      doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F')
      doc.setDrawColor(BORDER_SOFT[0], BORDER_SOFT[1], BORDER_SOFT[2])
      doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'S')

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      setColor(NAVY_TEXT)
      doc.text(program.name[lang] || program.name.fr, margin + 4, y + 7.5)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      setColor(NAVY_SOFT)
      doc.text(
        `${t('results.upTo')} ${fmtInt(program.maxGrant)} € HT  |  ${program.coveragePercent} % ${t('results.coverage')}`,
        margin + 4, y + 15
      )

      y += 24
    })

    y += 4
    addLine()

    // ── Recommended Projects ─────────────────────────────────────────────
    if (projects.length > 0) {
      addText(t('results.projects'), 14, 'bold', NAVY)
      y += 2

      projects.forEach((project) => {
        checkPage(34)
        doc.setFillColor(252, 253, 252)
        doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'F')
        doc.setDrawColor(BORDER_SOFT[0], BORDER_SOFT[1], BORDER_SOFT[2])
        doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'S')

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        setColor(NAVY_TEXT)
        doc.text(project.title[lang] || project.title.fr, margin + 4, y + 7)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        setColor(NAVY_SOFT)
        const descLines = doc.splitTextToSize(
          project.description[lang] || project.description.fr,
          contentWidth - 8
        )
        doc.text(descLines.slice(0, 2), margin + 4, y + 13)

        // Three equal columns: estimated · with-grant · you-pay
        const colW = contentWidth / 3
        const costY = y + 25
        const cols: Array<[string, string, [number, number, number]]> = [
          [t('results.estimatedCost'), `${fmtInt(project.estimatedCost)} €`, GREY],
          [t('results.withGrant'), `-${fmtInt(project.grantCoverage)} €`, EMERALD_DARK],
          [t('results.youPay'), `${fmtInt(project.youPay)} €`, NAVY_TEXT],
        ]
        cols.forEach(([label, value, valColor], i) => {
          const cx = margin + i * colW + 4
          doc.setFontSize(7.5)
          doc.setFont('helvetica', 'normal')
          setColor(GREY)
          doc.text(label, cx, costY - 4)
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          setColor(valColor)
          doc.text(value, cx, costY + 1)
        })

        y += 34
      })

      y += 4
      addLine()

      // ── Cost Comparison Summary ────────────────────────────────────────
      checkPage(34)
      addText(t('results.comparison'), 14, 'bold', NAVY)
      y += 2

      doc.setFillColor(EMERALD_TINT[0], EMERALD_TINT[1], EMERALD_TINT[2])
      doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F')

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      setColor(GREY)
      doc.text(
        `${t('results.without')} : ${fmtInt(totalCostWithout)} €`,
        margin + 4, y + 8
      )

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      setColor(NAVY_TEXT)
      doc.text(
        `${t('results.with')} : ${fmtInt(totalCostWith)} €`,
        margin + 4, y + 17
      )

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      setColor(EMERALD_DARK)
      doc.text(
        `${t('results.savings')} : ${fmtInt(totalSavings)} €`,
        margin + contentWidth / 2, y + 17
      )

      y += 32
    }

    addLine()

    // ── About the programs ───────────────────────────────────────────────
    checkPage(50)
    addText(
      isFr ? 'À propos des programmes' : 'About the programs',
      14, 'bold', NAVY
    )
    y += 1
    addText(
      isFr
        ? 'Les SME Packages sont gérés par le Ministère de l’Économie via la House of Entrepreneurship et la Chambre des Métiers. Ils couvrent jusqu’à 70 % des dépenses éligibles sur des projets de 3 000 à 25 000 € HTVA (soit un maximum de 17 500 € de subvention). Les programmes Fit 4 (Digital, AI, Innovation) sont gérés par Luxinnovation. Tous ces programmes sont cumulables sous certaines conditions, dans la limite des plafonds européens d’aides d’État (règle de minimis).'
        : 'SME Packages are managed by the Ministry of Economy through the House of Entrepreneurship and Chambre des Métiers. They cover up to 70 % of eligible costs on projects from €3 000 to €25 000 excl. VAT (maximum grant: €17 500). Fit 4 programs (Digital, AI, Innovation) are managed by Luxinnovation. All programs can be combined under certain conditions, within EU state aid limits (de minimis rule).',
      9, 'normal', NAVY_SOFT
    )

    y += 6
    addLine()

    // ── Contact / COMMIT MEDIA ───────────────────────────────────────────
    checkPage(46)
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2])
    doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'F')

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(
      isFr ? 'Besoin d’accompagnement ?' : 'Need support?',
      margin + 6, y + 10
    )

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    setColor(HEADER_TINT)
    doc.text(
      isFr
        ? 'Un expert vous accompagne gratuitement dans vos démarches d’aides luxembourgeoises.'
        : 'An expert will guide you through Luxembourg grant applications at no charge.',
      margin + 6, y + 17
    )

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('Bob  ·  openletz', margin + 6, y + 26)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    setColor(HEADER_TINT)
    doc.text('bob@openletz.com  ·  +352 661 968 051  ·  openletz.com', margin + 6, y + 32)

    y += 44

    // ── Footer ───────────────────────────────────────────────────────────
    checkPage(14)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    setColor(GREY_FAINT)
    doc.text(
      '© 2025–2026 COMMIT MEDIA SARL (RCS B276192)  ·  openletz.com',
      pageWidth / 2, y + 4,
      { align: 'center' }
    )
    doc.text(
      isFr
        ? 'Ce document est généré automatiquement et ne constitue pas un engagement contractuel.'
        : 'This document is automatically generated and does not constitute a contractual commitment.',
      pageWidth / 2, y + 8,
      { align: 'center' }
    )

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
