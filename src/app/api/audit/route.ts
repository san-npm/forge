// src/app/api/audit/route.ts
import { NextResponse } from 'next/server';
import { scoreAudit } from '@/lib/audit';
import {
  AuditRequestSchema,
  normalizeAuditUrl,
  safeAuditFetch,
  extractSignals,
} from '@/lib/audit-fetch';
import { rateLimit } from '@/lib/rateLimit';

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
// Hard cap on the response body we will buffer from an arbitrary allowed host.
// Reading is streamed and aborted once this many bytes have been consumed so a
// huge (or infinite) body cannot exhaust memory.
const MAX_BODY_BYTES = 1_000_000;

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Read a response body but stop after {@link MAX_BODY_BYTES}. Streams chunks from
 * the body reader, decodes incrementally, and cancels the stream once the cap is
 * hit so we never buffer an unbounded body. Falls back to `response.text()` only
 * when no readable stream is available.
 */
async function readCapped(response: Response, maxBytes: number): Promise<string> {
  const body = response.body;
  if (!body) {
    // No stream to meter; text() is the only option. Slice as a backstop.
    return (await response.text()).slice(0, maxBytes);
  }

  const reader = body.getReader();
  const decoder = new TextDecoder('utf-8');
  let out = '';
  let read = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      const remaining = maxBytes - read;
      const chunk = value.length > remaining ? value.subarray(0, remaining) : value;
      out += decoder.decode(chunk, { stream: true });
      read += chunk.length;
      if (read >= maxBytes) {
        await reader.cancel();
        return out;
      }
    }
  } finally {
    reader.releaseLock();
  }
  out += decoder.decode();
  return out;
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
  if (!rateLimit(ip, { limit: MAX_PER_WINDOW, windowMs: WINDOW_MS }).ok) {
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
    // Reject early if the host advertises a body larger than the cap, before we
    // read a single byte.
    const declared = Number(response.headers.get('content-length'));
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Response too large to audit' }, { status: 413 });
    }
    // Stream the body and stop at the cap so a huge response can't exhaust memory.
    html = await readCapped(response, MAX_BODY_BYTES);
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
