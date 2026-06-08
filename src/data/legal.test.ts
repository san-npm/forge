import { describe, it, expect } from 'vitest';
import { PRIVACY, TERMS } from '@/data/legal';
import { siteConfig } from '@/lib/site-config';

describe('legal content', () => {
  it('privacy uses the canonical openletz.ai privacy email and no .com', () => {
    const blob = JSON.stringify(PRIVACY);
    expect(blob).toContain(siteConfig.brand.privacyEmail);
    expect(blob).not.toContain('openletz.com');
    expect(blob).not.toContain('bob@');
  });

  it('terms uses the canonical hello email and no .com', () => {
    const blob = JSON.stringify(TERMS);
    expect(blob).toContain(siteConfig.brand.email);
    expect(blob).not.toContain('openletz.com');
  });

  it('drops all grants/quiz/simulator language', () => {
    const blob = (JSON.stringify(PRIVACY) + JSON.stringify(TERMS)).toLowerCase();
    for (const dead of ['quiz', 'simulat', 'subvention', 'eligibilit', 'grant', 'aides']) {
      expect(blob).not.toContain(dead);
    }
  });

  it('each doc has a title and at least 3 sections', () => {
    for (const doc of [PRIVACY, TERMS]) {
      expect(doc.title.length).toBeGreaterThan(0);
      expect(doc.sections.length).toBeGreaterThanOrEqual(3);
    }
  });
});
