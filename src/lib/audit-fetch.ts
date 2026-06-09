// src/lib/audit-fetch.ts
import { promises as dnsPromises } from 'node:dns';
import ipaddr from 'ipaddr.js';
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
  if (!u.hostname.includes('.') && !u.hostname.includes(':')) {
    throw new Error('Invalid host');
  }
  return u.toString();
}

// IPv4 ranges (per ipaddr.js range()) that must never be reached server-side.
const BLOCKED_IPV4_RANGES = new Set([
  'unspecified', // 0.0.0.0/8
  'loopback', // 127.0.0.0/8
  'private', // 10/8, 172.16/12, 192.168/16
  'linkLocal', // 169.254/16 (incl. 169.254.169.254 cloud metadata)
  'uniqueLocal', // n/a for IPv4, kept for parity
  'carrierGradeNat', // 100.64/10 (CGNAT)
  'broadcast', // 255.255.255.255
  'reserved', // 240/4 and other reserved blocks
]);

// IPv6 ranges (per ipaddr.js range()) that must never be reached server-side.
const BLOCKED_IPV6_RANGES = new Set([
  'unspecified', // ::/128
  'loopback', // ::1/128
  'linkLocal', // fe80::/10
  'uniqueLocal', // fc00::/7
  'reserved', // various reserved blocks
]);

/** True if a parsed ipaddr address falls in a disallowed range. */
function isBlockedAddress(addr: ipaddr.IPv4 | ipaddr.IPv6): boolean {
  // Normalize IPv4-mapped / IPv4-compatible IPv6 (e.g. ::ffff:127.0.0.1) to IPv4
  // so the underlying v4 range checks apply.
  if (addr.kind() === 'ipv6') {
    const v6 = addr as ipaddr.IPv6;
    if (v6.isIPv4MappedAddress()) {
      return BLOCKED_IPV4_RANGES.has(v6.toIPv4Address().range());
    }
    return BLOCKED_IPV6_RANGES.has(v6.range());
  }
  return BLOCKED_IPV4_RANGES.has((addr as ipaddr.IPv4).range());
}

/**
 * SSRF guard: refuse private / loopback / link-local / metadata / reserved hosts.
 *
 * String-level check only (no DNS). It blocks special hostnames and IP literals
 * in every form that resolves to an internal address. For DNS hostnames that
 * resolve to a private IP at runtime, callers MUST additionally run
 * {@link assertHostAllowed}.
 */
export function isBlockedHost(hostname: string): boolean {
  let h = hostname.trim().toLowerCase();
  if (!h) return true; // empty / malformed

  // Strip surrounding brackets from IPv6 literals ([::1] -> ::1).
  if (h.startsWith('[') && h.endsWith(']')) h = h.slice(1, -1);

  // Special-use names that should never be fetched server-side.
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local')) {
    return true;
  }

  // IP literals -------------------------------------------------------------
  if (ipaddr.isValid(h)) {
    // Reject non-canonical IPv4 (octal/hex/leading-zero/integer form). ipaddr's
    // isValid() accepts those liberal forms; only canonical dotted-decimal or a
    // valid IPv6 literal is acceptable here. Anything ambiguous is blocked.
    if (ipaddr.IPv4.isValid(h) && !ipaddr.IPv4.isValidFourPartDecimal(h)) {
      return true; // e.g. 0177.0.0.1, 0x7f.0.0.1, 2130706433
    }
    try {
      return isBlockedAddress(ipaddr.parse(h));
    } catch {
      return true; // unparsable literal -> block
    }
  }

  // A bare token that looks numeric but is not a valid IP literal is suspicious
  // (e.g. integer-form IPv4 like 2130706433 is rejected above; this catches the
  // residue). Treat all-digit hosts as blocked.
  if (/^\d+$/.test(h)) return true;

  return false; // ordinary hostname -> defer to assertHostAllowed for DNS check
}

/**
 * Resolve a hostname and reject if ANY resolved address is in a blocked range.
 * Defeats DNS-rebinding-to-private at check time. Throws on resolution failure
 * or when a resolved address is disallowed.
 *
 * Residual risk: there is a TOCTOU window between this DNS lookup and the actual
 * socket connect — a rebinding attacker could flip the record in between. Fully
 * closing it requires pinning the socket to the resolved IP (custom lookup /
 * agent). For a best-effort, public lead-magnet auditor this is an accepted
 * residual; the manual-redirect re-check below shrinks the window further.
 */
export async function assertHostAllowed(hostname: string): Promise<void> {
  let h = hostname.trim().toLowerCase();
  if (h.startsWith('[') && h.endsWith(']')) h = h.slice(1, -1);

  // Literal-level checks first (covers IP literals & special names cheaply).
  if (isBlockedHost(h)) {
    throw new Error('Host is not allowed');
  }

  // If it's already an IP literal, isBlockedHost fully validated it above.
  if (ipaddr.isValid(h)) return;

  let records: { address: string }[];
  try {
    records = await dnsPromises.lookup(h, { all: true });
  } catch {
    throw new Error('Host could not be resolved');
  }
  if (records.length === 0) {
    throw new Error('Host could not be resolved');
  }
  for (const { address } of records) {
    let parsed: ipaddr.IPv4 | ipaddr.IPv6;
    try {
      parsed = ipaddr.parse(address);
    } catch {
      throw new Error('Host resolved to an invalid address');
    }
    if (isBlockedAddress(parsed)) {
      throw new Error('Host resolves to a blocked address');
    }
  }
}

const MAX_REDIRECTS = 3;

/**
 * SSRF-safe fetch: validates the host (literal + DNS), then follows up to
 * {@link MAX_REDIRECTS} redirects MANUALLY, re-normalizing and re-validating the
 * `Location` of every hop. Each hop is fetched with `redirect: 'manual'` so the
 * runtime never transparently follows a redirect to an internal address. Throws
 * on a disallowed host/IP, a malformed redirect, or too many hops.
 */
export async function safeAuditFetch(
  startUrl: string,
  init: { headers?: Record<string, string>; signal?: AbortSignal },
): Promise<{ response: Response; finalUrl: string }> {
  let current = normalizeAuditUrl(startUrl);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertHostAllowed(new URL(current).hostname);

    const response = await fetch(current, {
      method: 'GET',
      redirect: 'manual',
      headers: init.headers,
      signal: init.signal,
    });

    // 3xx with a Location -> validate the next hop before following it.
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) {
        // Redirect with no target; treat the current response as final.
        return { response, finalUrl: current };
      }
      if (hop === MAX_REDIRECTS) {
        throw new Error('Too many redirects');
      }
      // Resolve relative Location against the current URL, then re-normalize
      // (rejects non-http(s) targets) so the next loop re-validates the host.
      const next = new URL(location, current).toString();
      current = normalizeAuditUrl(next);
      continue;
    }

    return { response, finalUrl: current };
  }

  // Unreachable: the loop either returns or throws.
  throw new Error('Too many redirects');
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
