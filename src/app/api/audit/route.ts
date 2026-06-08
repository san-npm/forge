// src/app/api/audit/route.ts
import { NextResponse } from 'next/server';
import { scoreAudit } from '@/lib/audit';
import {
  AuditRequestSchema,
  normalizeAuditUrl,
  isBlockedHost,
  extractSignals,
} from '@/lib/audit-fetch';

export const runtime = 'nodejs';

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
    const res = await fetch(`${origin}/${file}`, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
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

  let target: URL;
  try {
    target = new URL(normalizeAuditUrl(parsed.data.url));
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
  if (isBlockedHost(target.hostname)) {
    return NextResponse.json({ error: 'That host cannot be audited' }, { status: 400 });
  }

  let html: string;
  let finalUrl: string;
  try {
    const res = await fetch(target.toString(), {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': 'OpenletzAuditBot/1.0 (+https://openletz.ai/audit)' },
      signal: AbortSignal.timeout(8000),
    });
    finalUrl = res.url || target.toString();
    if (isBlockedHost(new URL(finalUrl).hostname)) {
      return NextResponse.json({ error: 'That host cannot be audited' }, { status: 400 });
    }
    html = (await res.text()).slice(0, 1_000_000);
  } catch {
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
