import { describe, it, expect } from 'vitest';
import { CASE_STUDIES, getCaseStudy } from '@/data/case-studies';
import { WORK } from '@/data/work';

describe('CASE_STUDIES', () => {
  it('has essays for vinsfins and lagrocerie keyed to real WORK slugs', () => {
    const slugs = Object.keys(CASE_STUDIES);
    expect(slugs).toEqual(['vinsfins', 'lagrocerie']);
    for (const slug of slugs) {
      expect(WORK.some((w) => w.slug === slug)).toBe(true);
    }
  });

  it('each essay has Problem, Process and Result sections', () => {
    for (const cs of Object.values(CASE_STUDIES)) {
      expect(cs.problem.length).toBeGreaterThan(0);
      expect(cs.process.length).toBeGreaterThan(0);
      expect(cs.result.length).toBeGreaterThan(0);
    }
  });

  it('marks owner-provided metrics as placeholders', () => {
    for (const cs of Object.values(CASE_STUDIES)) {
      expect(cs.metrics.length).toBeGreaterThan(0);
      expect(cs.metrics.every((m) => typeof m.placeholder === 'boolean')).toBe(true);
      expect(cs.metrics.some((m) => m.placeholder)).toBe(true);
    }
  });

  it('getCaseStudy returns undefined for an unknown slug', () => {
    expect(getCaseStudy('does-not-exist')).toBeUndefined();
    expect(getCaseStudy('vinsfins')).toBeDefined();
  });
});
