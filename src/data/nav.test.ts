import { describe, it, expect } from 'vitest';
import { NAV, FOOTER, START_PROJECT } from '@/data/nav';
import { siteConfig } from '@/lib/site-config';

describe('START_PROJECT', () => {
  it('is the one CTA verb', () => {
    expect(START_PROJECT).toBe('Start a project');
  });
});

describe('NAV', () => {
  it('is the flat 4-link nav model (CTA carried separately)', () => {
    expect(NAV).toHaveLength(4);
    expect(NAV.map((n) => n.label)).toEqual(['Services', 'Work', 'About', 'Insights']);
    expect(NAV.map((n) => n.href)).toEqual(['/services', '/work', '/about', '/insights']);
  });
  it('does not embed the CTA as a nav link', () => {
    expect(NAV.some((n) => n.label === START_PROJECT)).toBe(false);
  });
});

describe('FOOTER', () => {
  it('has exactly 4 columns (Services / Company / Connect / Legal)', () => {
    expect(FOOTER).toHaveLength(4);
    expect(FOOTER.map((c) => c.heading)).toEqual(['Services', 'Company', 'Connect', 'Legal']);
  });
  it('every column has at least one real link', () => {
    for (const col of FOOTER) {
      expect(col.links.length).toBeGreaterThan(0);
      for (const l of col.links) {
        expect(l.label.length).toBeGreaterThan(0);
        expect(l.href.length).toBeGreaterThan(0);
      }
    }
  });
  it('Connect column links to the LinkedIn sameAs from site-config', () => {
    const connect = FOOTER.find((c) => c.heading === 'Connect');
    expect(connect?.links.some((l) => l.href === siteConfig.brand.linkedin)).toBe(true);
  });
  it('Legal column links to privacy + terms', () => {
    const legal = FOOTER.find((c) => c.heading === 'Legal');
    const hrefs = legal?.links.map((l) => l.href) ?? [];
    expect(hrefs).toContain('/legal/privacy');
    expect(hrefs).toContain('/legal/terms');
  });
});

describe('footer surfaces Phase 3 routes', () => {
  const hrefs = FOOTER.flatMap((c) => c.links.map((l) => l.href));
  it('includes /services, /pricing, /audit and /insights', () => {
    for (const href of ['/services', '/pricing', '/audit', '/insights']) {
      expect(hrefs).toContain(href);
    }
  });
  it('surfaces the SME Package funding page (discoverable in the footer)', () => {
    const funding = FOOTER.flatMap((c) => c.links).find((l) => l.href === '/sme-package');
    expect(funding).toBeDefined();
    expect(funding?.label).toBe('Funding');
  });
  it('has exactly 4 columns', () => {
    expect(FOOTER).toHaveLength(4);
  });
});
