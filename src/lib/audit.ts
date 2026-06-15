// src/lib/audit.ts
// Pure scoring logic for the /audit lead magnet. NO network here — the API route
// (src/app/api/audit/route.ts) fetches the URL, extracts AuditSignals, and calls scoreAudit.

export interface AuditSignals {
  https: boolean;
  hasTitle: boolean;
  titleLength: number;
  hasMetaDescription: boolean;
  metaDescriptionLength: number;
  h1Count: number;
  hasViewport: boolean;
  hasOpenGraph: boolean;
  hasStructuredData: boolean;
  hasCanonical: boolean;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  hasLlmsTxt: boolean;
  htmlBytes: number;
  textBytes: number;
}

export type AuditCategory = 'security' | 'seo' | 'aeo' | 'meta';
export type AuditGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface AuditCheck {
  id: string;
  label: string;
  category: AuditCategory;
  pass: boolean;
  weight: number;
  recommendation: string;
}

export interface AuditResult {
  score: number;        // sum of weights for passing checks
  maxScore: number;     // MAX_AUDIT_SCORE
  grade: AuditGrade;
  checks: AuditCheck[];
}

// 13 checks; weights sum to MAX_AUDIT_SCORE.
const CHECK_WEIGHTS = {
  https: 10,
  title: 10,
  metaDescription: 8,
  h1: 8,
  viewport: 6,
  openGraph: 6,
  canonical: 6,
  structuredData: 12,
  llmsTxt: 10,
  textRatio: 8,
  robotsTxt: 4,
  sitemap: 6,
  metaLength: 6,
} as const;

export const MAX_AUDIT_SCORE = Object.values(CHECK_WEIGHTS).reduce((a, b) => a + b, 0);

function gradeFor(pct: number): AuditGrade {
  if (pct >= 90) return 'A';
  if (pct >= 75) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
}

export function scoreAudit(s: AuditSignals): AuditResult {
  const titleOk = s.hasTitle && s.titleLength >= 15 && s.titleLength <= 65;
  const metaLenOk = s.hasMetaDescription && s.metaDescriptionLength >= 70 && s.metaDescriptionLength <= 165;
  const textRatioOk = s.htmlBytes > 0 && s.textBytes / s.htmlBytes >= 0.05 && s.textBytes >= 500;

  const checks: AuditCheck[] = [
    { id: 'https', label: 'Served over HTTPS', category: 'security', pass: s.https, weight: CHECK_WEIGHTS.https,
      recommendation: 'Serve the site over HTTPS with a valid certificate.' },
    { id: 'title', label: 'Has a well-sized <title>', category: 'seo', pass: titleOk, weight: CHECK_WEIGHTS.title,
      recommendation: 'Add a unique 15-65 character title to every page.' },
    { id: 'meta-description', label: 'Has a meta description', category: 'meta', pass: s.hasMetaDescription, weight: CHECK_WEIGHTS.metaDescription,
      recommendation: 'Add a descriptive meta description tag.' },
    { id: 'meta-length', label: 'Meta description is well-sized', category: 'meta', pass: metaLenOk, weight: CHECK_WEIGHTS.metaLength,
      recommendation: 'Keep the meta description between 70 and 165 characters.' },
    { id: 'h1', label: 'Exactly one <h1>', category: 'seo', pass: s.h1Count === 1, weight: CHECK_WEIGHTS.h1,
      recommendation: 'Use exactly one <h1> that states the page topic.' },
    { id: 'viewport', label: 'Mobile viewport set', category: 'meta', pass: s.hasViewport, weight: CHECK_WEIGHTS.viewport,
      recommendation: 'Add a responsive viewport meta tag.' },
    { id: 'open-graph', label: 'Open Graph tags present', category: 'meta', pass: s.hasOpenGraph, weight: CHECK_WEIGHTS.openGraph,
      recommendation: 'Add og:title/og:description/og:image for rich link previews.' },
    { id: 'canonical', label: 'Canonical URL declared', category: 'seo', pass: s.hasCanonical, weight: CHECK_WEIGHTS.canonical,
      recommendation: 'Declare a canonical URL to avoid duplicate-content dilution.' },
    { id: 'structured-data', label: 'Structured data (JSON-LD)', category: 'aeo', pass: s.hasStructuredData, weight: CHECK_WEIGHTS.structuredData,
      recommendation: 'Add Schema.org JSON-LD so AI assistants and search engines understand the page.' },
    { id: 'llms-txt', label: 'llms.txt for AI crawlers', category: 'aeo', pass: s.hasLlmsTxt, weight: CHECK_WEIGHTS.llmsTxt,
      recommendation: 'Publish /llms.txt to guide AI assistants to your canonical content.' },
    { id: 'text-ratio', label: 'Content is in the static HTML', category: 'aeo', pass: textRatioOk, weight: CHECK_WEIGHTS.textRatio,
      recommendation: 'Render text server-side, because AI crawlers do not run your JavaScript.' },
    { id: 'robots-txt', label: 'robots.txt present', category: 'seo', pass: s.hasRobotsTxt, weight: CHECK_WEIGHTS.robotsTxt,
      recommendation: 'Add a robots.txt that points to your sitemap.' },
    { id: 'sitemap', label: 'XML sitemap present', category: 'seo', pass: s.hasSitemap, weight: CHECK_WEIGHTS.sitemap,
      recommendation: 'Publish an XML sitemap and reference it from robots.txt.' },
  ];

  const score = checks.reduce((sum, c) => sum + (c.pass ? c.weight : 0), 0);
  const pct = (score / MAX_AUDIT_SCORE) * 100;

  return { score, maxScore: MAX_AUDIT_SCORE, grade: gradeFor(pct), checks };
}
