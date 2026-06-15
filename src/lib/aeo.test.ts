import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const llms = readFileSync(resolve(root, 'public/llms.txt'), 'utf8');
const llmsFull = readFileSync(resolve(root, 'public/llms-full.txt'), 'utf8');

describe.each([
  ['llms.txt', llms],
  ['llms-full.txt', llmsFull],
])('%s host + content invariants', (_name, content) => {
  it('points at the openletz.ai apex', () => {
    expect(content).toContain('https://openletz.ai');
  });
  it('never references a dropped/legacy host', () => {
    expect(content).not.toContain('openletz.com');
    expect(content).not.toContain('openletz.fr');
    expect(content).not.toContain('openletz.info');
  });
  it('carries no grants-era language', () => {
    expect(content).not.toMatch(/Fit 4 (Digital|AI|Innovation)/i);
    expect(content).not.toMatch(/simulateur|eligibility simulator|grants simulator/i);
  });
  it('declares the en/fr/de language set only (no Luxembourgish)', () => {
    expect(content).toMatch(/English/);
    expect(content).toMatch(/French/);
    expect(content).toMatch(/German/);
    expect(content).not.toMatch(/Luxembourgish/);
  });
});

describe('llms.txt full-reference pointer', () => {
  it('points to the apex llms-full.txt', () => {
    expect(llms).toContain('https://openletz.ai/llms-full.txt');
  });
});
