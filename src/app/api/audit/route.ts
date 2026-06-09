// src/app/api/audit/route.ts
import { NextResponse } from 'next/server';
import { scoreAudit } from '@/lib/audit';
import {
  AuditRequestSchema,
  normalizeAuditUrl,
  safeAuditFetch,
  extractSignals,
} from '@/lib/audit-fetch';

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

async function probe(origin: string, file: string): Promise<boolean> {
  try {
    // Same SSRF-safe path (host re-validation + manual redirect checks) as the
    // main fetch, so a robots.txt 30x to an internal address can't be followed.
    const { response } = await safeAuditFetch(`${origin}/${file}`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = AuditRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'A valid URL is required' }, { status: 400 });
  }

  // Normalize first so an obviously invalid / non-http(s) URL is a clean 400
  // before we attempt any network work.
  let startUrl: string;
  try {
    startUrl = normalizeAuditUrl(parsed.data.url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  let html: string;
  let finalUrl: string;
  try {
    // safeAuditFetch performs the SSRF guard (literal + DNS resolution checks)
    // and follows redirects manually, re-validating every hop's host. The
    // previous post-fetch isBlockedHost(finalUrl) check is now redundant and has
    // been removed — per-hop validation supersedes it.
    const { response, finalUrl: resolved } = await safeAuditFetch(startUrl, {
      headers: { 'user-agent': 'OpenletzAuditBot/1.0 (+https://openletz.ai/audit)' },
      signal: AbortSignal.timeout(8000),
    });
    finalUrl = resolved;
    html = (await response.text()).slice(0, 1_000_000);
  } catch (err) {
    // Never throw to the client. A blocked host (SSRF guard) is a 400; any other
    // failure (DNS, network, timeout, too many redirects) is a generic 502.
    const message = err instanceof Error ? err.message : '';
    if (
      message === 'Host is not allowed' ||
      message === 'Host could not be resolved' ||
      message === 'Host resolved to an invalid address' ||
      message === 'Host resolves to a blocked address' ||
      message === 'Invalid URL' ||
      message === 'Only http(s) URLs are supported' ||
      message === 'Invalid host'
    ) {
      return NextResponse.json({ error: 'That host cannot be audited' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Could not reach that URL' }, { status: 502 });
  }

  const origin = new URL(finalUrl).origin;
  const [robotsTxt, sitemap, llmsTxt] = await Promise.all([
    probe(origin, 'robots.txt'),
    probe(origin, 'sitemap.xml'),
    probe(origin, 'llms.txt'),
  ]);

  const signals = extractSignals(finalUrl, html, { robotsTxt, sitemap, llmsTxt });
  const result = scoreAudit(signals);

  return NextResponse.json({ url: finalUrl, ...result }, { status: 200 });
}
