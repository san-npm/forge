import { describe, it, expect } from 'vitest';
import { serviceJsonLd, offerCatalogJsonLd, STARTING_PRICE_EUR } from '@/lib/jsonld';
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
    expect(items[0].name).toBe(PRICING.tiers[0].name);
  });

  it('emits the real €3,000 SME-minimum anchor on "from €" tiers (lowPrice via minPrice)', () => {
    const node = offerCatalogJsonLd(PRICING.tiers) as Record<string, unknown>;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    // Every tier whose price string shows a euro amount carries an EUR
    // priceSpecification with the €3,000 minPrice; "Let's talk" carries none.
    const anchored = items.filter((i) => i.priceCurrency === 'EUR');
    expect(anchored.length).toBeGreaterThan(0);
    for (const item of anchored) {
      expect(item.priceCurrency).toBe('EUR');
      const spec = item.priceSpecification as Record<string, unknown>;
      expect(spec['@type']).toBe('UnitPriceSpecification');
      expect(spec.priceCurrency).toBe('EUR');
      expect(spec.minPrice).toBe(STARTING_PRICE_EUR);
      expect(spec.minPrice).toBe(3000);
    }
  });

  it('leaves the open-ended custom tier figure-free (no fabricated numeric price)', () => {
    const node = offerCatalogJsonLd(PRICING.tiers) as Record<string, unknown>;
    const items = node.itemListElement as Array<Record<string, unknown>>;
    // The custom / "Let's talk" tier (no euro amount in its price) emits no price.
    const open = items.filter((i) => i.priceCurrency === undefined);
    expect(open.length).toBeGreaterThan(0);
    for (const item of open) {
      expect(item.price).toBeUndefined();
      expect(item.priceSpecification).toBeUndefined();
    }
  });
});
