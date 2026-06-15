import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { siteConfig } from '@/lib/site-config';

const ROOT = process.cwd();

// The Organization JSON-LD `logo` points here; a 404 logo is a Rich-Results error.
function publicPathFromUrl(url: string): string {
  return join(ROOT, 'public', new URL(url).pathname.replace(/^\//, ''));
}

describe('launch assets', () => {
  it('the JSON-LD logo file actually exists in /public', () => {
    const p = publicPathFromUrl(siteConfig.brand.logoPng);
    expect(existsSync(p), `${p} (siteConfig.brand.logoPng) must exist`).toBe(true);
    expect(statSync(p).size, 'logo must be non-empty').toBeGreaterThan(0);
  });

  it('the brand SVG mark exists', () => {
    const p = publicPathFromUrl(siteConfig.brand.logoSvg);
    expect(existsSync(p), `${p} (siteConfig.brand.logoSvg) must exist`).toBe(true);
  });

  it('the OG image exists (social + crawler preview)', () => {
    expect(existsSync(join(ROOT, 'public', 'og-image.png'))).toBe(true);
  });
});
