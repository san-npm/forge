import jsPDF from 'jspdf'
import { Program, ProjectRecommendation } from './eligibility'

interface ReportData {
  // Client info
  clientName: string
  clientCompany: string
  clientRcs: string
  clientEmail: string
  // Eligibility data
  programs: Program[]
  projects: ProjectRecommendation[]
  // Language
  lang: string
  t: (key: string) => string
}

const COLORS = {
  primary: [37, 99, 235] as [number, number, number],    // blue-600
  navy: [15, 23, 42] as [number, number, number],        // navy-900
  green: [22, 163, 74] as [number, number, number],      // green-600
  gray: [107, 114, 128] as [number, number, number],     // gray-500
  lightGray: [243, 244, 246] as [number, number, number], // gray-100
  white: [255, 255, 255] as [number, number, number],
}

export function generateReport(data: ReportData): void {
  const { clientName, clientCompany, clientRcs, clientEmail, programs, projects, lang, t } = data
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = 210
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = 20

  const date = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  // ─── Helper functions ───
  function addNewPageIfNeeded(neededSpace: number) {
    if (y + neededSpace > 270) {
      doc.addPage()
      y = 20
      addFooter()
    }
  }

  function addFooter() {
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.gray)
    doc.text('COMMIT MEDIA SARL · RCS B276192 · openletz.com', pageWidth / 2, 290, { align: 'center' })
  }

  function drawLine() {
    doc.setDrawColor(...COLORS.lightGray)
    doc.setLineWidth(0.5)
    doc.line(margin, y, pageWidth - margin, y)
    y += 6
  }

  function addSectionTitle(text: string) {
    addNewPageIfNeeded(20)
    doc.setFontSize(14)
    doc.setTextColor(...COLORS.navy)
    doc.setFont('helvetica', 'bold')
    doc.text(text, margin, y)
    y += 3
    doc.setDrawColor(...COLORS.primary)
    doc.setLineWidth(1)
    doc.line(margin, y, margin + 30, y)
    y += 8
  }

  // ─── Header ───
  doc.setFillColor(...COLORS.navy)
  doc.rect(0, 0, pageWidth, 45, 'F')

  // Logo — draw OpenLetz icon (scaled SVG paths, 8mm square)
  const logoX = margin
  const logoY = 8
  const logoScale = 8 / 69 // 69px viewBox → 8mm
  doc.setFillColor(...COLORS.white)
  // Simplified logo: 8 triangular petals as small filled shapes
  const logoPaths = [
    [20.85, 0.6, 26.85, 6.3, 30.3, 14.4, 34.35, 23.1, 41.25, 0.75],
    [0.45, 20.55, 8.7, 20.25, 13.95, 39.45, 24.75, 26.55, 25.8, 26.55, 14.7, 6],
    [0.45, 49.05, 6, 43.05, 13.95, 39.45, 22.5, 35.25, 0, 28.8],
    [20.85, 68.85, 20.4, 60.6, 26.4, 44.4, 26.4, 43.35, 6, 54.9],
    [49.35, 68.25, 43.2, 62.85, 39.45, 54.9, 35.1, 46.35, 29.1, 69],
    [68.85, 47.4, 60.6, 48, 52.35, 45.15, 44.25, 42.3, 43.2, 42.3, 55.2, 62.4],
    [67.5, 19.05, 62.25, 25.35, 54.45, 29.25, 46.8, 33, 46.2, 33.75, 69, 39.15],
    [46.35, 0, 47.1, 8.25, 44.4, 16.65, 41.7, 24.75, 41.85, 25.8, 61.65, 13.35],
  ]
  logoPaths.forEach(pts => {
    if (pts.length >= 6) {
      doc.triangle(
        logoX + pts[0] * logoScale, logoY + pts[1] * logoScale,
        logoX + pts[2] * logoScale, logoY + pts[3] * logoScale,
        logoX + pts[4] * logoScale, logoY + pts[5] * logoScale,
        'F'
      )
    }
  })

  doc.setTextColor(...COLORS.white)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('OpenLetz', margin + 10, 18)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('openletz.com', margin + 10, 25)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(t('report.title'), margin, 38)

  y = 55

  // ─── Date & Ref ───
  doc.setFontSize(9)
  doc.setTextColor(...COLORS.gray)
  doc.setFont('helvetica', 'normal')
  doc.text(`${t('report.generatedOn')}: ${date}`, margin, y)
  y += 10

  // ─── Client info ───
  addSectionTitle(t('report.clientInfo'))

  doc.setFontSize(10)
  doc.setTextColor(...COLORS.navy)

  const clientFields = [
    [t('report.name'), clientName],
    [t('report.company'), clientCompany],
    [t('report.rcs'), clientRcs],
    [t('report.email'), clientEmail],
  ].filter(([, value]) => value)

  clientFields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(value, margin + 35, y)
    y += 6
  })

  y += 6
  drawLine()

  // ─── Eligible Programs ───
  addSectionTitle(t('results.eligible'))

  programs.forEach((program) => {
    addNewPageIfNeeded(30)

    // Program card background
    doc.setFillColor(...COLORS.lightGray)
    doc.roundedRect(margin, y - 3, contentWidth, 22, 2, 2, 'F')

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.navy)
    doc.text(program.name[lang] || program.name.fr, margin + 4, y + 3)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLORS.primary)
    const grantText = `${program.maxGrant.toLocaleString()} € max · ${program.coveragePercent}% ${t('results.coverage')}`
    doc.text(grantText, margin + 4, y + 10)

    if (program.source) {
      doc.setFontSize(8)
      doc.setTextColor(...COLORS.gray)
      doc.text(`Source: ${program.source[lang] || program.source.fr}`, margin + 4, y + 16)
    }

    y += 26
  })

  y += 4
  drawLine()

  // ─── Recommended Projects ───
  if (projects.length > 0) {
    addSectionTitle(t('results.projects'))

    projects.forEach((project) => {
      addNewPageIfNeeded(35)

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...COLORS.navy)
      const titleLines = doc.splitTextToSize(project.title[lang] || project.title.fr, contentWidth - 8)
      doc.text(titleLines, margin, y)
      y += titleLines.length * 5 + 2

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...COLORS.gray)
      const descLines = doc.splitTextToSize(project.description[lang] || project.description.fr, contentWidth - 8)
      doc.text(descLines, margin, y)
      y += descLines.length * 4 + 4

      // Cost breakdown row
      const colWidth = contentWidth / 3

      // Estimated cost
      doc.setFillColor(...COLORS.lightGray)
      doc.roundedRect(margin, y - 3, colWidth - 2, 14, 2, 2, 'F')
      doc.setFontSize(8)
      doc.setTextColor(...COLORS.gray)
      doc.text(t('results.estimatedCost'), margin + 3, y + 1)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...COLORS.navy)
      doc.text(`${project.estimatedCost.toLocaleString()} \u20AC`, margin + 3, y + 7)

      // Grant coverage
      doc.setFillColor(240, 253, 244)
      doc.roundedRect(margin + colWidth, y - 3, colWidth - 2, 14, 2, 2, 'F')
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...COLORS.green)
      doc.text(t('results.withGrant'), margin + colWidth + 3, y + 1)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(`-${project.grantCoverage.toLocaleString()} \u20AC`, margin + colWidth + 3, y + 7)

      // You pay
      doc.setFillColor(239, 246, 255)
      doc.roundedRect(margin + colWidth * 2, y - 3, colWidth - 2, 14, 2, 2, 'F')
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...COLORS.primary)
      doc.text(t('results.youPay'), margin + colWidth * 2 + 3, y + 1)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(`${project.youPay.toLocaleString()} \u20AC`, margin + colWidth * 2 + 3, y + 7)

      y += 18
      doc.setFont('helvetica', 'normal')
    })

    y += 4
    drawLine()
  }

  // ─── Cost Summary ───
  if (projects.length > 0) {
    addNewPageIfNeeded(40)
    addSectionTitle(t('results.comparison'))

    const totalCostWithout = projects.reduce((sum, p) => sum + p.estimatedCost, 0)
    const totalCostWith = projects.reduce((sum, p) => sum + p.youPay, 0)
    const totalSavings = totalCostWithout - totalCostWith

    doc.setFillColor(...COLORS.lightGray)
    doc.roundedRect(margin, y - 3, contentWidth, 28, 2, 2, 'F')

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLORS.gray)
    doc.text(t('results.without'), margin + 4, y + 3)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.navy)
    doc.text(`${totalCostWithout.toLocaleString()} \u20AC`, margin + 60, y + 3)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLORS.gray)
    doc.text(t('results.with'), margin + 4, y + 11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.primary)
    doc.text(`${totalCostWith.toLocaleString()} \u20AC`, margin + 60, y + 11)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLORS.green)
    doc.text(t('results.savings'), margin + 4, y + 19)
    doc.setFont('helvetica', 'bold')
    doc.text(`${totalSavings.toLocaleString()} \u20AC`, margin + 60, y + 19)

    y += 34
    drawLine()
  }

  // ─── Our services ───
  addNewPageIfNeeded(60)
  addSectionTitle(t('report.services.title'))

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.navy)

  const services = [
    { title: t('report.services.dev.title'), desc: t('report.services.dev.desc') },
    { title: t('report.services.ai.title'), desc: t('report.services.ai.desc') },
    { title: t('report.services.grants.title'), desc: t('report.services.grants.desc') },
  ]

  services.forEach((svc) => {
    addNewPageIfNeeded(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.navy)
    doc.text(`\u2022 ${svc.title}`, margin + 2, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLORS.gray)
    const lines = doc.splitTextToSize(svc.desc, contentWidth - 10)
    doc.text(lines, margin + 6, y)
    y += lines.length * 4 + 5
  })

  y += 4
  drawLine()

  // ─── Next steps ───
  addNewPageIfNeeded(30)
  addSectionTitle(t('report.nextSteps.title'))

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.navy)

  const steps = [
    t('report.nextSteps.step1'),
    t('report.nextSteps.step2'),
    t('report.nextSteps.step3'),
  ]

  steps.forEach((step, i) => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.primary)
    doc.text(`${i + 1}.`, margin + 2, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLORS.navy)
    const lines = doc.splitTextToSize(step, contentWidth - 14)
    doc.text(lines, margin + 10, y)
    y += lines.length * 5 + 3
  })

  // ─── Contact CTA ───
  y += 6
  addNewPageIfNeeded(25)
  doc.setFillColor(...COLORS.primary)
  doc.roundedRect(margin, y - 3, contentWidth, 18, 2, 2, 'F')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.white)
  doc.text(t('report.contact.cta'), pageWidth / 2, y + 4, { align: 'center' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('bob@openletz.com · openletz.com', pageWidth / 2, y + 11, { align: 'center' })

  // ─── Disclaimer ───
  y += 24
  addNewPageIfNeeded(15)
  doc.setFontSize(7)
  doc.setTextColor(...COLORS.gray)
  doc.setFont('helvetica', 'italic')
  const disclaimer = doc.splitTextToSize(t('report.disclaimer'), contentWidth)
  doc.text(disclaimer, margin, y)

  // ─── Footer on all pages ───
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    addFooter()
  }

  // ─── Save ───
  doc.save(`openletz-rapport-eligibilite-${clientCompany || 'rapport'}.pdf`)
}
