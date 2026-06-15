import { NextResponse } from 'next/server';
import { buildAgentCard } from '@/lib/agent-card';

// A2A Agent Card (v0.3.0). Agents fetch /.well-known/agent-card.json; the
// next.config rewrite forwards here. The card's `url` points at /api/a2a, a
// live A2A JSON-RPC endpoint (see src/app/api/a2a/route.ts), so the manifest is
// not aspirational. CORS is open because agents fetch the card cross-origin.
export async function GET() {
  return NextResponse.json(buildAgentCard(), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
