import { describe, it, expect } from 'vitest';
import { HOME_SECTIONS } from '@/data/pages/home';
import type { SectionType } from '@/lib/schema';
import { STUDIO } from '@/data/studio';
import { CONTACT } from '@/data/contact';
import { WORK } from '@/data/work';

describe('HOME_SECTIONS', () => {
  it('has the 8 spec sections in the locked order (footer is layout-level, not a section)', () => {
    const order: SectionType[] = [
      'hero',
      'proofStrip',
      'servicesGrid',
      'howWeWork',
      'selectedWork',
      'deeperProof',
      'trustBlock',
      'enquiryForm',
    ];
    expect(HOME_SECTIONS.map((s) => s.type)).toEqual(order);
  });

  it('hero carries the locked H1/sub and STUDIO lead', () => {
    const hero = HOME_SECTIONS.find((s) => s.type === 'hero');
    if (hero?.type !== 'hero') throw new Error('no hero');
    expect(hero.h1).toBe('Websites that think, move & transact.');
    expect(hero.sub).toBe('A Luxembourg AI agency.');
    expect(hero.lead).toBe(STUDIO.welcomeLead);
    expect(hero.primaryCta).toEqual({ label: 'Start a project', href: '#enquiry' });
    expect(hero.secondaryCta).toEqual({ label: 'See our work', href: '/work' });
  });

  it('servicesGrid leads with ai and keeps marketing before web3', () => {
    const grid = HOME_SECTIONS.find((s) => s.type === 'servicesGrid');
    if (grid?.type !== 'servicesGrid') throw new Error('no grid');
    expect(grid.order).toEqual(['ai', 'marketing', 'web3']);
    expect(grid.ctaLabel).toBe('Start a project');
    expect(grid.ctaHref).toBe('#enquiry');
  });

  it('selectedWork carries all 6 WORK items and a view-all link', () => {
    const work = HOME_SECTIONS.find((s) => s.type === 'selectedWork');
    if (work?.type !== 'selectedWork') throw new Error('no work');
    expect(work.items).toHaveLength(6);
    expect(work.items).toEqual(WORK);
    expect(work.viewAllHref).toBe('/work');
  });

  it('deeperProof is testimonial-empty-safe and reports the defensible shipped count', () => {
    const proof = HOME_SECTIONS.find((s) => s.type === 'deeperProof');
    if (proof?.type !== 'deeperProof') throw new Error('no deeperProof');
    expect(proof.shippedCount).toBe(WORK.length);
    expect(Array.isArray(proof.testimonials)).toBe(true);
  });

  it('enquiryForm exposes the #enquiry anchor and the 4 CONTACT pillars', () => {
    const form = HOME_SECTIONS.find((s) => s.type === 'enquiryForm');
    if (form?.type !== 'enquiryForm') throw new Error('no enquiryForm');
    expect(form.id).toBe('enquiry');
    expect(form.headline).toBe(CONTACT.lead);
    expect(form.pillars).toEqual(CONTACT.types);
    expect(form.callLine).toBe(CONTACT.callLine);
    expect(form.bookCallHref).toBe('/contact');
  });
});
