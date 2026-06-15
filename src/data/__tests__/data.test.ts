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
  it('has the 3 own products, 2 client builds and the 3 contributed projects, in order', () => {
    expect(WORK).toHaveLength(8);
    expect(WORK.map((w) => w.slug)).toEqual([
      'gategram',
      'skillsws',
      'ophis',
      'vinsfins',
      'lagrocerie',
      'liberclaw',
      'libertai',
      'alephcloud',
    ]);
  });
  it('every item links to a live https URL', () => {
    for (const w of WORK) expect(w.link.startsWith('https://')).toBe(true);
  });
  it('derives a valid filter tag for every item (mapped from kind)', () => {
    const tags = WORK.map((w) => w.tag);
    expect(tags).toEqual([
      'web',
      'ai',
      'web3',
      'web',
      'web',
      'contributed',
      'contributed',
      'contributed',
    ]);
    // every item carries a tag, and every tag is one of the filter values
    for (const w of WORK) {
      expect(w.tag).toBeDefined();
      expect(['ai', 'web', 'web3', 'marketing', 'contributed']).toContain(w.tag);
    }
  });

  describe('built products vs client builds vs contributed (honest split)', () => {
    const ownProducts = WORK.filter((w) => w.kind === 'Our product');
    const clientBuilds = WORK.filter((w) => w.kind === 'Client build');
    const contributed = WORK.filter((w) => w.tag === 'contributed');

    it('marks Gategram, Ophis and Skills.ws as our own products', () => {
      expect(ownProducts.map((w) => w.slug).sort()).toEqual(['gategram', 'ophis', 'skillsws']);
    });
    it('marks Vins Fins and La Grocerie as client builds', () => {
      expect(clientBuilds.map((w) => w.slug).sort()).toEqual(['lagrocerie', 'vinsfins']);
    });
    it('marks LiberClaw, LibertAI and Aleph Cloud as contributed (kind Contributor)', () => {
      expect(contributed.map((w) => w.slug)).toEqual(['liberclaw', 'libertai', 'alephcloud']);
      for (const w of contributed) expect(w.kind).toBe('Contributor');
    });
  });

  describe('contributed projects never read as products we built or own', () => {
    const contributed = WORK.filter((w) => w.tag === 'contributed');
    it('every contributed blurb/about says we contributed, never that we built/own them', () => {
      for (const w of contributed) {
        const copy = `${w.blurb} ${w.about}`.toLowerCase();
        // Must explicitly frame as a contribution / not-our-product.
        expect(copy).toMatch(/contribut/);
        expect(copy).toMatch(/not our product/);
        // Strip the honest disclaimer ("not our product") and the neutral
        // "built on Aleph" tech-base phrase, then assert NO positive ownership
        // claim remains ("we built X" / "our product" / "my own product").
        const claims = copy
          .replace(/not our product/g, '')
          .replace(/built on aleph/g, '');
        expect(claims).not.toMatch(/we built|our (own )?product|my own product/);
      }
    });
    it('keeps their external links and never says "Aleph.im"', () => {
      const byslug = (s: string) => contributed.find((w) => w.slug === s)!;
      expect(byslug('liberclaw').link).toBe('https://liberclaw.ai');
      expect(byslug('libertai').link).toBe('https://libertai.io');
      expect(byslug('alephcloud').link).toBe('https://aleph.cloud');
      expect(JSON.stringify(contributed)).not.toMatch(/aleph\.im/i);
    });
  });

  it('lists LibertAI as a contributed project (not a built product)', () => {
    const libertai = WORK.find((w) => w.slug === 'libertai')!;
    expect(libertai).toBeTruthy();
    expect(libertai.tag).toBe('contributed');
    expect(libertai.kind).toBe('Contributor');
  });
});

describe('ABOUT', () => {
  it('has 3 facts and the Commit Media entity', () => {
    expect(ABOUT.facts).toHaveLength(3);
    expect(ABOUT.founderName).toBe('Clément Fermaud');
    expect(ABOUT.entity).toBe('Commit Media S.à r.l. · RCS B276192 · Luxembourg');
  });
  it('founder bio is honest: own products built, client work, contributed to LibertAI/LiberClaw/Aleph', () => {
    const role = ABOUT.founderRole;
    // Owns/builds: Gategram, Ophis, Skills.ws
    expect(role).toMatch(/Gategram/);
    expect(role).toMatch(/Ophis/);
    expect(role).toMatch(/Skills\.ws/);
    // Contributes to (never claims to build/own): LibertAI, LiberClaw, Aleph Cloud
    expect(role.toLowerCase()).toMatch(/contribut/);
    expect(role).toMatch(/LibertAI/);
    expect(role).toMatch(/Aleph Cloud/);
    // Must NOT list the contributed projects as products he builds.
    expect(role).not.toMatch(/build my own products \([^)]*LiberClaw/i);
    expect(role).not.toMatch(/build my own products \([^)]*LibertAI/i);
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
  it('anchors the entry tiers at the SME minimum (from €3,000) and keeps a "let\'s talk" tier', () => {
    const anchored = PRICING.tiers.filter((t) => t.price.includes('€3,000'));
    expect(anchored.length).toBeGreaterThanOrEqual(3);
    for (const t of anchored) {
      expect(t.price.toLowerCase()).toContain('from');
      expect(t.price).toContain('€3,000');
      // no leftover "from €X" placeholder
      expect(t.price).not.toMatch(/from\s*€?X/i);
    }
    expect(PRICING.tiers.some((t) => t.price.toLowerCase().includes("let's talk"))).toBe(true);
  });
  it('lead carries the €3,000 start and the ~€900 net-after-grant hook', () => {
    expect(PRICING.lead).toContain('€3,000');
    expect(PRICING.lead).toContain('€900');
    expect(PRICING.lead.toLowerCase()).toContain('sme package');
  });
  it('keeps the SME Package note and the €3,000 to €25,000 band framing', () => {
    expect(PRICING.note).toContain('SME Package');
    expect(PRICING.note).toContain('€3,000');
    expect(PRICING.note).toContain('€25,000');
  });
});
