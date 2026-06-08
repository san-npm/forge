// src/lib/audit-fetch.ts
import { z } from 'zod';
import type { AuditSignals } from '@/lib/audit';

export const AuditRequestSchema = z.object({
  url: z.string().trim().min(3).max(2000),
});
export type AuditRequest = z.infer<typeof AuditRequestSchema>;

/** Normalize a user-typed URL to an absolute http(s) URL string, or throw. */
export function normalizeAuditUrl(input: string): string {
  let candidate = input.trim();
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  let u: URL;
  try {
    u = new URL(candidate);
  } catch {
    throw new Error('Invalid URL');
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error('Only http(s) URLs are supported');
  }
  if (!u.hostname.includes('.')) {
    throw new Error('Invalid host');
  }
  return u.toString();
}

/** SSRF guard: refuse private / loopback / link-local / metadata hosts. */
export function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local')) return true;
  // IPv6 loopback / unspecified
  if (h === '::1' || h === '::' || h === '[::1]') return true;
  // IPv4 dotted-quad checks
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 127) return true;                 // loopback
    if (a === 10) return true;                  // private
    if (a === 0) return true;                   // this-network
    if (a === 169 && b === 254) return true;    // link-local + cloud metadata
    if (a === 192 && b === 168) return true;    // private
    if (a === 172 && b >= 16 && b <= 31) return true; // private
  }
  return false;
}

const has = (re: RegExp, s: string) => re.test(s);

/** Extract AuditSignals from raw HTML + out-of-band probe results. Pure & DOM-free. */
export function extractSignals(
  finalUrl: string,
  html: string,
  probes: { robotsTxt: boolean; sitemap: boolean; llmsTxt: boolean },
): AuditSignals {
  const head = html.slice(0, 200_000); // cap work
  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';
  const descMatch = head.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i,
  );
  const desc = descMatch ? descMatch[1].trim() : '';
  const h1Count = (head.match(/<h1[\s>]/gi) || []).length;
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const htmlBytes = typeof Buffer !== 'undefined'
    ? Buffer.byteLength(html, 'utf8')
    : new TextEncoder().encode(html).length;
  const textBytes = typeof Buffer !== 'undefined'
    ? Buffer.byteLength(text, 'utf8')
    : new TextEncoder().encode(text).length;

  return {
    https: finalUrl.startsWith('https://'),
    hasTitle: title.length > 0,
    titleLength: title.length,
    hasMetaDescription: desc.length > 0,
    metaDescriptionLength: desc.length,
    h1Count,
    hasViewport: has(/<meta[^>]+name=["']viewport["']/i, head),
    hasOpenGraph: has(/<meta[^>]+property=["']og:/i, head),
    hasStructuredData: has(/<script[^>]+type=["']application\/ld\+json["']/i, head),
    hasCanonical: has(/<link[^>]+rel=["']canonical["']/i, head),
    hasRobotsTxt: probes.robotsTxt,
    hasSitemap: probes.sitemap,
    hasLlmsTxt: probes.llmsTxt,
    htmlBytes,
    textBytes,
  };
}
