import { describe, it, expect } from 'vitest';
import {
  organizationJsonLd,
  professionalServiceJsonLd,
  webSiteJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  AGENCY_FAQS,
} from '@/lib/jsonld';
import { SITE_URL } from '@/lib/site-config';

function asString(obj: object): string {
  return JSON.stringify(obj);
}

describe('organizationJsonLd', () => {
  const org = organizationJsonLd() as Record<string, unknown>;
  it('uses the openletz.ai apex everywhere (no .com)', () => {
    const s = asString(org);
    expect(s).toContain('openletz.ai');
    expect(s).not.toContain('openletz.com');
  });
  it('has the right @type, @id and email', () => {
    expect(org['@type']).toBe('Organization');
    expect(org['@id']).toBe(`${SITE_URL}/#organization`);
    expect(org.email).toBe('hello@openletz.ai');
    expect(org.email).not.toBe('bob@openletz.com');
  });
  it('uses the brand logo from site-config', () => {
    expect(asString(org)).toContain('/openletz-logo.png');
  });
});

describe('professionalServiceJsonLd', () => {
  const svc = professionalServiceJsonLd() as Record<string, unknown>;
  it('has the localbusiness @id and openletz.ai host', () => {
    expect(svc['@type']).toBe('ProfessionalService');
    expect(svc['@id']).toBe(`${SITE_URL}/#localbusiness`);
    expect(asString(svc)).not.toContain('openletz.com');
    expect(svc.email).toBe('hello@openletz.ai');
  });
});

describe('webSiteJsonLd', () => {
  const site = webSiteJsonLd() as Record<string, unknown>;
  it('replaces the dropped WebApplication with a WebSite node', () => {
    expect(site['@type']).toBe('WebSite');
    expect(site['@id']).toBe(`${SITE_URL}/#website`);
    expect(site.url).toBe(SITE_URL);
  });
  it('does not carry the Simulateur naming', () => {
    expect(asString(site)).not.toContain('Simulateur');
    expect(asString(site)).not.toContain('WebApplication');
  });
});

describe('breadcrumbJsonLd', () => {
  it('builds a BreadcrumbList from items', () => {
    const bc = breadcrumbJsonLd('en', [{ name: 'Home', url: SITE_URL }]) as Record<string, unknown>;
    expect(bc['@type']).toBe('BreadcrumbList');
    const items = bc.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(1);
    expect(items[0].position).toBe(1);
    expect(items[0].name).toBe('Home');
    expect(items[0].item).toBe(SITE_URL);
  });
});

describe('faqJsonLd / AGENCY_FAQS', () => {
  it('AGENCY_FAQS are agency questions (not grants)', () => {
    const joined = AGENCY_FAQS.map((f) => f.q).join(' ');
    expect(joined).toContain('What is Openletz?');
    expect(joined).not.toMatch(/simulateur|éligibilité|grant simulator/i);
  });
  it('faqJsonLd wraps q/a into Question/Answer entities', () => {
    const faq = faqJsonLd(AGENCY_FAQS) as Record<string, unknown>;
    expect(faq['@type']).toBe('FAQPage');
    const main = faq.mainEntity as Array<Record<string, unknown>>;
    expect(main.length).toBe(AGENCY_FAQS.length);
    expect(main[0]['@type']).toBe('Question');
    expect((main[0].acceptedAnswer as Record<string, unknown>)['@type']).toBe('Answer');
  });
});
