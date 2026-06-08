import { describe, it, expect } from 'vitest';
import { STUDIO } from '@/data/studio';
import { SERVICES } from '@/data/services';
import { WORK } from '@/data/work';
import { ABOUT } from '@/data/about';
import { CONTACT } from '@/data/contact';
import { PRICING } from '@/data/pricing';

describe('STUDIO', () => {
  it('matches osData ground truth', () => {
    expect(STUDIO.name).toBe('Openletz');
    expect(STUDIO.tagline).toBe('Websites that think, move & transact.');
    expect(STUDIO.sub).toBe('A Luxembourg AI agency.');
    expect(STUDIO.welcomeLead.length).toBeGreaterThan(40);
  });
});

describe('SERVICES', () => {
  it('has the 3 pillar keys', () => {
    expect(Object.keys(SERVICES).sort()).toEqual(['ai', 'marketing', 'web3']);
  });
  it('keeps the Growth kicker on marketing', () => {
    expect(SERVICES.marketing.kicker).toBe('What we do · Growth');
    expect(SERVICES.marketing.title).toBe('Digital & Growth');
  });
  it('only the ai pillar carries a footer (SME co-funding line)', () => {
    expect(SERVICES.ai.footer).toContain('SME Package');
    expect(SERVICES.web3.footer).toBeUndefined();
    expect(SERVICES.marketing.footer).toBeUndefined();
  });
  it('ai.how has the audit→prototype→live three steps', () => {
    expect(SERVICES.ai.how).toHaveLength(3);
    expect(SERVICES.ai.how[0]).toBe('A quick audit');
  });
});

describe('WORK', () => {
  it('has exactly 6 items in order', () => {
    expect(WORK).toHaveLength(6);
    expect(WORK.map((w) => w.slug)).toEqual([
      'vinsfins',
      'lagrocerie',
      'gategram',
      'liberclaw',
      'ophis',
      'skillsws',
    ]);
  });
  it('every item links to a live https URL', () => {
    for (const w of WORK) expect(w.link.startsWith('https://')).toBe(true);
  });
  it('derives a valid filter tag for every item (mapped from kind)', () => {
    const tags = WORK.map((w) => w.tag);
    expect(tags).toEqual(['web', 'web', 'web', 'ai', 'web3', 'ai']);
    // every item carries a tag, and every tag is one of the 3 filter values
    for (const w of WORK) {
      expect(w.tag).toBeDefined();
      expect(['ai', 'web', 'web3']).toContain(w.tag);
    }
  });
});

describe('ABOUT', () => {
  it('has 3 facts and the Commit Media entity', () => {
    expect(ABOUT.facts).toHaveLength(3);
    expect(ABOUT.founderName).toBe('Clément Fermaud');
    expect(ABOUT.entity).toBe('Commit Media S.à r.l. · RCS B276192 · Luxembourg');
  });
});

describe('CONTACT', () => {
  it('has the 4 enquiry types', () => {
    expect(CONTACT.types).toEqual([
      'AI automation',
      'Web3 / on-chain',
      'Website & growth',
      'Not sure yet',
    ]);
  });
  it('keeps the within-one-business-day lead', () => {
    expect(CONTACT.lead).toContain('one business day');
  });
});

describe('PRICING', () => {
  it('has 4 tiers, none priced "On request", each with 3 feats', () => {
    expect(PRICING.tiers).toHaveLength(4);
    for (const t of PRICING.tiers) {
      expect(t.price.toLowerCase()).not.toContain('on request');
      expect(t.feats).toHaveLength(3);
    }
  });
  it('the three pillar tiers use a "from €" anchor', () => {
    const anchored = PRICING.tiers.filter((t) => t.price.startsWith('from €'));
    expect(anchored.length).toBeGreaterThanOrEqual(3);
  });
  it('keeps the SME Package note', () => {
    expect(PRICING.note).toContain('SME Package');
  });
});
