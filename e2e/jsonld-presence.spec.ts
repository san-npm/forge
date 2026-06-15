import { test, expect, request } from '@playwright/test';
import { SITE_URL } from '@/lib/site-config';

// Extract all JSON-LD payloads from raw SSR HTML.
function extractJsonLd(html: string): any[] {
  const blocks: any[] = [];
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw) continue;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) blocks.push(...parsed);
    else if (parsed['@graph']) blocks.push(...parsed['@graph']);
    else blocks.push(parsed);
  }
  return blocks;
}

function typesOf(blocks: any[]): Set<string> {
  const out = new Set<string>();
  for (const b of blocks) {
    const t = b['@type'];
    if (Array.isArray(t)) t.forEach((x) => out.add(x));
    else if (t) out.add(t);
  }
  return out;
}

// Recursively collect every string value under url/@id/email keys.
function collectUrlsAndEmails(node: any, acc: string[] = []): string[] {
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if ((k === 'url' || k === '@id' || k === 'email') && typeof v === 'string') acc.push(v);
      else if (typeof v === 'object') collectUrlsAndEmails(v, acc);
    }
  }
  return acc;
}

// Expected @type per route (from jsonld.ts builders wired into layouts).
const ROUTE_SCHEMAS: { path: string; expect: string[] }[] = [
  { path: '/', expect: ['Organization', 'ProfessionalService', 'WebSite'] },
  { path: '/about', expect: ['Organization', 'BreadcrumbList'] },
  { path: '/contact', expect: ['Organization', 'BreadcrumbList'] },
  { path: '/services', expect: ['Organization', 'FAQPage', 'BreadcrumbList'] },
  { path: '/pricing', expect: ['Organization', 'BreadcrumbList'] },
  { path: '/work', expect: ['Organization', 'BreadcrumbList'] },
  { path: '/insights/ai-agents-luxembourg-businesses', expect: ['Organization', 'BlogPosting', 'BreadcrumbList'] },
  { path: '/work/vinsfins', expect: ['Organization', 'Article', 'BreadcrumbList'] },
];

test.describe('JSON-LD presence + canonical domain', () => {
  for (const { path, expect: wanted } of ROUTE_SCHEMAS) {
    test(`${path} emits ${wanted.join(', ')} and uses openletz.ai everywhere`, async ({ baseURL }) => {
      const ctx = await request.newContext({ baseURL });
      const res = await ctx.get(path);
      expect(res.status()).toBe(200);
      const html = await res.text();
      const blocks = extractJsonLd(html);
      expect(blocks.length, `${path} has at least one JSON-LD block`).toBeGreaterThan(0);

      const present = typesOf(blocks);
      for (const t of wanted) {
        expect(present.has(t), `${path} must emit @type ${t}`).toBe(true);
      }

      // No dropped grants-era schema should ever appear.
      expect(present.has('WebApplication'), `${path} must NOT emit dropped WebApplication`).toBe(false);
      expect(present.has('HowTo'), `${path} must NOT emit dropped HowTo`).toBe(false);

      // Every url/@id/email must be on the canonical apex (no www, no .com/.fr/.info).
      const refs = blocks.flatMap((b) => collectUrlsAndEmails(b));
      for (const ref of refs) {
        if (ref.startsWith('http')) {
          expect(ref.startsWith(SITE_URL), `${path}: "${ref}" must start with ${SITE_URL}`).toBe(true);
        } else if (ref.includes('@')) {
          expect(ref.endsWith('@openletz.ai'), `${path}: email "${ref}" must be @openletz.ai`).toBe(true);
        }
      }
      await ctx.dispose();
    });
  }
});
