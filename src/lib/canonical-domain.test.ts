import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_URL } from '@/lib/site-config';

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');

// Static files that ship to crawlers and must already be on the apex domain.
const SHIPPED_TEXT_FILES = [
  'public/robots.txt',
  'public/llms.txt',
  'public/llms-full.txt',
];

describe('canonical domain hygiene', () => {
  it('SITE_URL is the apex with no www and no trailing slash', () => {
    expect(SITE_URL).toBe('https://openletz.ai');
  });

  for (const f of SHIPPED_TEXT_FILES) {
    it(`${f} references openletz.ai and no legacy host`, () => {
      const txt = read(f);
      expect(txt).toContain('openletz.ai');
      expect(txt).not.toMatch(/openletz\.com/);
      expect(txt).not.toMatch(/www\.openletz\./);
      expect(txt).not.toMatch(/openletz\.fr/);
      expect(txt).not.toMatch(/openletz\.info/);
      expect(txt).not.toMatch(/bob@openletz/);
    });
  }

  it('robots.txt declares the apex sitemap', () => {
    expect(read('public/robots.txt')).toMatch(/Sitemap:\s*https:\/\/openletz\.ai\/sitemap\.xml/);
  });
});
