import { describe, it, expect } from 'vitest';
import { serviceJsonLd, offerCatalogJsonLd } from '@/lib/jsonld';
import { SITE_URL } from '@/lib/site-config';
import { SERVICES } from '@/data/services';
import { PRICING } from '@/data/pricing';

describe('serviceJsonLd', () => {
  it('builds a Service node anchored to the org provider on openletz.ai', () => {
    const node = serviceJsonLd('ai', SERVICES.ai) as Record<string, unknown>;
    expect(node['@type']).toBe('Service');
    expect(node.name).toBe(SERVICES.ai.title);
    expect((node.provider as Record<string, unknown>)['@id']).toBe(`${SITE_URL}/#organization`);
    expect(node.areaServed).toBeDefined();
  });
});

describe('offerCatalogJsonLd', () => {
  it('builds an OfferCatalog with one Offer per pricing tier', () => {
    const node = offerCatalogJsonLd(PRICING.tiers) as Record<string, unknown>;
    expect(node['@type']).toBe('OfferCatalog');
    expect(Array.isArray(node.itemListElement)).toBe(true);
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items.length).toBe(PRICING.tiers.length);
    expect(items[0]['@type']).toBe('Offer');
    expect((items[0].priceSpecification as Record<string, unknown>).priceCurrency).toBe('EUR');
  });
});
