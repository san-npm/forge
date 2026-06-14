import { describe, it, expect, afterEach } from 'vitest';
import { isProductionHost } from './indexing';

const ORIG = { ...process.env };
afterEach(() => {
  process.env = { ...ORIG };
});

describe('isProductionHost (portable noindex guard)', () => {
  it('true on Vercel production', () => {
    process.env = { ...ORIG, VERCEL_ENV: 'production', SITE_ENV: undefined, NODE_ENV: 'production' };
    expect(isProductionHost()).toBe(true);
  });

  it('false on Vercel preview', () => {
    process.env = { ...ORIG, VERCEL_ENV: 'preview', SITE_ENV: undefined };
    expect(isProductionHost()).toBe(false);
  });

  it('false on Vercel development', () => {
    process.env = { ...ORIG, VERCEL_ENV: 'development', SITE_ENV: undefined };
    expect(isProductionHost()).toBe(false);
  });

  it('off-Vercel: true only when SITE_ENV=production is explicit', () => {
    process.env = { ...ORIG, VERCEL_ENV: undefined, SITE_ENV: 'production' };
    expect(isProductionHost()).toBe(true);
  });

  it('off-Vercel: false when SITE_ENV is staging', () => {
    process.env = { ...ORIG, VERCEL_ENV: undefined, SITE_ENV: 'staging' };
    expect(isProductionHost()).toBe(false);
  });

  it('off-Vercel with no signal at all: fail closed (no indexing)', () => {
    process.env = { ...ORIG, VERCEL_ENV: undefined, SITE_ENV: undefined, NODE_ENV: 'production' };
    expect(isProductionHost()).toBe(false);
  });
});
