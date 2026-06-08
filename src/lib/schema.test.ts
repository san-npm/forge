import { describe, it, expect } from 'vitest';
import {
  StudioSchema,
  ServiceKeySchema,
  ServiceDataSchema,
  ServicesSchema,
  WorkItemSchema,
  WorkSchema,
  AboutSchema,
  ContactDataSchema,
  IconKeySchema,
  PriceTierSchema,
  PricingSchema,
  HeroSchema,
  HeroI18nSchema,
  LocaleSchema,
  NavItemSchema,
  NavSchema,
  FooterColumnSchema,
  FooterSchema,
  ProofLogoSchema,
  ProofMetricSchema,
  ContactPayloadSchema,
  NewsletterSchema,
} from '@/lib/schema';

describe('LocaleSchema', () => {
  it('accepts en/fr/de', () => {
    expect(LocaleSchema.parse('en')).toBe('en');
    expect(LocaleSchema.parse('fr')).toBe('fr');
    expect(LocaleSchema.parse('de')).toBe('de');
  });
  it('rejects dropped locales', () => {
    expect(LocaleSchema.safeParse('lb').success).toBe(false);
    expect(LocaleSchema.safeParse('it').success).toBe(false);
  });
});

describe('StudioSchema', () => {
  it('accepts a complete studio', () => {
    expect(
      StudioSchema.parse({
        name: 'Openletz',
        tagline: 'x',
        sub: 'y',
        welcomeLead: 'z',
        hint: 'h',
      }),
    ).toBeTruthy();
  });
  it('rejects empty strings', () => {
    expect(
      StudioSchema.safeParse({ name: '', tagline: 'x', sub: 'y', welcomeLead: 'z', hint: 'h' })
        .success,
    ).toBe(false);
  });
});

describe('ServiceKeySchema / ServiceDataSchema / ServicesSchema', () => {
  const svc = {
    kicker: 'k',
    title: 't',
    lead: 'l',
    what: [{ t: 'a', d: 'b' }],
    how: ['1', '2', '3'],
    proof: 'p',
  };
  it('accepts the 3 service keys', () => {
    expect(ServiceKeySchema.parse('ai')).toBe('ai');
    expect(ServiceKeySchema.parse('web3')).toBe('web3');
    expect(ServiceKeySchema.parse('marketing')).toBe('marketing');
  });
  it('rejects unknown keys', () => {
    expect(ServiceKeySchema.safeParse('growth').success).toBe(false);
  });
  it('accepts a service with optional footer', () => {
    expect(ServiceDataSchema.parse({ ...svc, footer: 'f' })).toBeTruthy();
    expect(ServiceDataSchema.parse(svc)).toBeTruthy();
  });
  it('parses a full Services record', () => {
    expect(ServicesSchema.parse({ ai: svc, web3: svc, marketing: svc })).toBeTruthy();
  });
});

describe('WorkItemSchema / WorkSchema', () => {
  const item = {
    slug: 'vinsfins',
    name: 'Vins Fins',
    kind: 'E-commerce',
    link: 'https://www.vinsfins.lu',
    blurb: 'b',
    about: 'a',
    did: ['x'],
    stack: ['Next.js'],
  };
  it('accepts a work item with optional tag', () => {
    expect(WorkItemSchema.parse({ ...item, tag: 'web' })).toBeTruthy();
    expect(WorkItemSchema.parse(item)).toBeTruthy();
  });
  it('rejects a non-url link', () => {
    expect(WorkItemSchema.safeParse({ ...item, link: 'not a url' }).success).toBe(false);
  });
  it('rejects a bad slug', () => {
    expect(WorkItemSchema.safeParse({ ...item, slug: 'Vins Fins' }).success).toBe(false);
  });
  it('requires exactly 6 items', () => {
    expect(WorkSchema.safeParse([item]).success).toBe(false);
    expect(WorkSchema.safeParse(Array.from({ length: 6 }, () => item)).success).toBe(true);
  });
});

describe('AboutSchema', () => {
  it('requires exactly 3 facts', () => {
    const base = { bioLead: 'b', founderName: 'C', founderRole: 'r', entity: 'e' };
    expect(AboutSchema.safeParse({ ...base, facts: ['1', '2'] }).success).toBe(false);
    expect(AboutSchema.safeParse({ ...base, facts: ['1', '2', '3'] }).success).toBe(true);
  });
});

describe('ContactDataSchema', () => {
  it('requires exactly 4 types', () => {
    const base = { lead: 'l', callLine: 'c' };
    expect(ContactDataSchema.safeParse({ ...base, types: ['a', 'b', 'c'] }).success).toBe(false);
    expect(ContactDataSchema.safeParse({ ...base, types: ['a', 'b', 'c', 'd'] }).success).toBe(true);
  });
});

describe('IconKeySchema / PriceTierSchema / PricingSchema', () => {
  const tier = {
    name: 'AI',
    icon: 'ai',
    price: 'from €X',
    desc: 'd',
    feats: ['1', '2', '3'],
  };
  it('accepts a known icon key', () => {
    expect(IconKeySchema.parse('growth')).toBe('growth');
  });
  it('rejects an unknown icon key', () => {
    expect(IconKeySchema.safeParse('rocket').success).toBe(false);
  });
  it('requires exactly 3 feats', () => {
    expect(PriceTierSchema.safeParse({ ...tier, feats: ['1', '2'] }).success).toBe(false);
    expect(PriceTierSchema.parse({ ...tier, highlight: true })).toBeTruthy();
  });
  it('requires exactly 4 tiers', () => {
    const base = { lead: 'l', note: 'n' };
    expect(PricingSchema.safeParse({ ...base, tiers: [tier, tier, tier] }).success).toBe(false);
    expect(PricingSchema.safeParse({ ...base, tiers: [tier, tier, tier, tier] }).success).toBe(true);
  });
});

describe('HeroSchema / HeroI18nSchema', () => {
  const hero = {
    tagline: 't',
    sub: 's',
    welcomeLead: 'w',
    hint: 'h',
    newProject: 'np',
    seeWork: 'sw',
  };
  it('accepts a hero', () => {
    expect(HeroSchema.parse(hero)).toBeTruthy();
  });
  it('parses an en/fr/de hero record', () => {
    expect(HeroI18nSchema.parse({ en: hero, fr: hero, de: hero })).toBeTruthy();
  });
});

describe('NavItemSchema / NavSchema', () => {
  const item = { label: 'Services', href: '/services' };
  it('accepts a label+href nav item', () => {
    expect(NavItemSchema.parse(item)).toBeTruthy();
  });
  it('rejects a nav item missing href', () => {
    expect(NavItemSchema.safeParse({ label: 'Services' }).success).toBe(false);
  });
  it('accepts a flat nav array', () => {
    expect(NavSchema.parse([item, { label: 'Work', href: '/work' }])).toBeTruthy();
  });
});

describe('FooterColumnSchema / FooterSchema', () => {
  const col = {
    heading: 'Services',
    links: [{ label: 'AI', href: '/services' }],
  };
  it('accepts a footer column', () => {
    expect(FooterColumnSchema.parse(col)).toBeTruthy();
  });
  it('rejects a column with a malformed link', () => {
    expect(
      FooterColumnSchema.safeParse({ heading: 'X', links: [{ label: 'A' }] }).success,
    ).toBe(false);
  });
  it('requires exactly 4 footer columns', () => {
    expect(FooterSchema.safeParse([col, col, col]).success).toBe(false);
    expect(FooterSchema.safeParse([col, col, col, col]).success).toBe(true);
  });
});

describe('ProofLogoSchema', () => {
  const logo = {
    slug: 'vinsfins',
    name: 'Vins Fins',
    src: '/clients/vinsfins.png',
    href: 'https://www.vinsfins.lu',
  };
  it('accepts a proof logo', () => {
    expect(ProofLogoSchema.parse(logo)).toBeTruthy();
  });
  it('rejects a bad slug', () => {
    expect(ProofLogoSchema.safeParse({ ...logo, slug: 'Vins Fins' }).success).toBe(false);
  });
  it('rejects a non-url href', () => {
    expect(ProofLogoSchema.safeParse({ ...logo, href: 'nope' }).success).toBe(false);
  });
});

describe('ProofMetricSchema', () => {
  it('accepts a static numeric metric', () => {
    expect(
      ProofMetricSchema.parse({ id: 'shipped', label: 'Products shipped', value: 6, suffix: '+' }),
    ).toBeTruthy();
  });
  it('accepts a live metric whose value is filled at runtime (value: null)', () => {
    expect(
      ProofMetricSchema.parse({ id: 'alephNodes', label: 'Aleph nodes', value: null, live: true }),
    ).toBeTruthy();
  });
  it('rejects a metric missing an id', () => {
    expect(ProofMetricSchema.safeParse({ label: 'x', value: 1 }).success).toBe(false);
  });
});

describe('ContactPayloadSchema', () => {
  it('accepts the minimal valid payload', () => {
    expect(ContactPayloadSchema.parse({ name: 'A', email: 'a@b.co' })).toBeTruthy();
  });
  it('trims and accepts all optional fields', () => {
    const parsed = ContactPayloadSchema.parse({
      name: '  A  ',
      email: ' a@b.co ',
      phone: '+352',
      company: 'Co',
      companySize: '1-10',
      pillar: 'AI automation',
      budget: '5-15k',
      message: 'hi',
    });
    expect(parsed.name).toBe('A');
    expect(parsed.email).toBe('a@b.co');
  });
  it('rejects a missing name', () => {
    expect(ContactPayloadSchema.safeParse({ email: 'a@b.co' }).success).toBe(false);
  });
  it('rejects a malformed email', () => {
    expect(ContactPayloadSchema.safeParse({ name: 'A', email: 'nope' }).success).toBe(false);
  });
  it('rejects an unknown pillar/companySize/budget enum', () => {
    expect(
      ContactPayloadSchema.safeParse({ name: 'A', email: 'a@b.co', pillar: 'Other' }).success,
    ).toBe(false);
    expect(
      ContactPayloadSchema.safeParse({ name: 'A', email: 'a@b.co', companySize: '500+' }).success,
    ).toBe(false);
    expect(
      ContactPayloadSchema.safeParse({ name: 'A', email: 'a@b.co', budget: '100k' }).success,
    ).toBe(false);
  });
  it('enforces the 500/2000 field caps', () => {
    expect(
      ContactPayloadSchema.safeParse({ name: 'a'.repeat(501), email: 'a@b.co' }).success,
    ).toBe(false);
    expect(
      ContactPayloadSchema.safeParse({ name: 'A', email: 'a@b.co', message: 'm'.repeat(2001) })
        .success,
    ).toBe(false);
  });
});

describe('NewsletterSchema', () => {
  it('accepts a valid email', () => {
    expect(NewsletterSchema.parse({ email: 'a@b.co' })).toBeTruthy();
  });
  it('rejects a malformed email', () => {
    expect(NewsletterSchema.safeParse({ email: 'nope' }).success).toBe(false);
  });
});
