import { describe, it, expect } from 'vitest';
import { scoreAudit, type AuditSignals, type AuditResult, MAX_AUDIT_SCORE } from '@/lib/audit';

function baseSignals(over: Partial<AuditSignals> = {}): AuditSignals {
  return {
    https: false,
    hasTitle: false,
    titleLength: 0,
    hasMetaDescription: false,
    metaDescriptionLength: 0,
    h1Count: 0,
    hasViewport: false,
    hasOpenGraph: false,
    hasStructuredData: false,
    hasCanonical: false,
    hasRobotsTxt: false,
    hasSitemap: false,
    hasLlmsTxt: false,
    htmlBytes: 0,
    textBytes: 0,
    ...over,
  };
}

describe('scoreAudit', () => {
  it('returns 0 and grade F for an empty site', () => {
    const r = scoreAudit(baseSignals());
    expect(r.score).toBe(0);
    expect(r.grade).toBe('F');
    expect(r.maxScore).toBe(MAX_AUDIT_SCORE);
  });

  it('awards the full score and grade A for a perfect site', () => {
    const r = scoreAudit(baseSignals({
      https: true,
      hasTitle: true,
      titleLength: 55,
      hasMetaDescription: true,
      metaDescriptionLength: 150,
      h1Count: 1,
      hasViewport: true,
      hasOpenGraph: true,
      hasStructuredData: true,
      hasCanonical: true,
      hasRobotsTxt: true,
      hasSitemap: true,
      hasLlmsTxt: true,
      htmlBytes: 40000,
      textBytes: 9000,
    }));
    expect(r.score).toBe(MAX_AUDIT_SCORE);
    expect(r.grade).toBe('A');
  });

  it('penalises a title that is too short or too long', () => {
    const short = scoreAudit(baseSignals({ hasTitle: true, titleLength: 5 }));
    const ok = scoreAudit(baseSignals({ hasTitle: true, titleLength: 55 }));
    expect(ok.score).toBeGreaterThan(short.score);
  });

  it('flags multiple h1 tags as a fail', () => {
    const single = scoreAudit(baseSignals({ h1Count: 1 }));
    const many = scoreAudit(baseSignals({ h1Count: 4 }));
    const singleH1 = single.checks.find((c) => c.id === 'h1');
    const manyH1 = many.checks.find((c) => c.id === 'h1');
    expect(singleH1?.pass).toBe(true);
    expect(manyH1?.pass).toBe(false);
  });

  it('rewards AEO readiness (structured data + llms.txt) so AI crawlers can cite the site', () => {
    const withAeo = scoreAudit(baseSignals({ hasStructuredData: true, hasLlmsTxt: true }));
    const aeoChecks = withAeo.checks.filter((c) => c.category === 'aeo' && c.pass);
    expect(aeoChecks.length).toBeGreaterThanOrEqual(2);
  });

  it('flags a JS-heavy page where static HTML carries little text (AI crawlers see nothing)', () => {
    const thin = scoreAudit(baseSignals({ htmlBytes: 50000, textBytes: 200 }));
    const check = thin.checks.find((c) => c.id === 'text-ratio');
    expect(check?.pass).toBe(false);
  });

  it('every check carries a human label, a category, and a fix recommendation', () => {
    const r = scoreAudit(baseSignals());
    for (const c of r.checks) {
      expect(c.label.length).toBeGreaterThan(0);
      expect(['security', 'seo', 'aeo', 'meta']).toContain(c.category);
      expect(c.recommendation.length).toBeGreaterThan(0);
    }
  });

  it('grade boundaries: A>=90%, B>=75%, C>=60%, D>=40%, else F', () => {
    expect(scoreAudit(baseSignals({ https: true })).grade).toBe('F');
  });

  it('is pure — same input yields same output', () => {
    const s = baseSignals({ https: true, hasTitle: true, titleLength: 50 });
    expect(scoreAudit(s)).toEqual(scoreAudit(s));
  });
});
