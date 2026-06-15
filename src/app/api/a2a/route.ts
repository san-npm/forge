import { NextResponse } from 'next/server';
import { buildAgentCard } from '@/lib/agent-card';
import { SITE_URL } from '@/lib/site-config';
import { computeSmePackage, SME_MIN, SME_MAX } from '@/lib/sme-package';

/**
 * Minimal A2A (Agent2Agent) JSON-RPC 2.0 endpoint.
 *
 * This is the live endpoint advertised by the agent card's `url`
 * (/.well-known/agent-card.json -> /api/a2a). It implements the single core A2A
 * method `message/send`: it reads the user's text, and replies with a Message
 * (role "agent"). The reply is honest and useful: if the text mentions a
 * budget / funding / grant amount it returns an indicative SME Package estimate
 * via computeSmePackage; otherwise it describes Openletz and points to /contact.
 *
 * Spec: https://a2a-protocol.org/v0.3.0/specification/ (JSON-RPC transport).
 */

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
} as const;

// --- JSON-RPC helpers -------------------------------------------------------

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc: string;
  id?: JsonRpcId;
  method?: string;
  params?: unknown;
}

function rpcError(id: JsonRpcId, code: number, message: string) {
  return NextResponse.json(
    { jsonrpc: '2.0', id, error: { code, message } },
    { headers: JSON_HEADERS },
  );
}

function rpcResult(id: JsonRpcId, result: unknown) {
  return NextResponse.json({ jsonrpc: '2.0', id, result }, { headers: JSON_HEADERS });
}

// --- Message helpers --------------------------------------------------------

/** Extract the concatenated text of all text parts in an A2A message. */
function extractText(params: unknown): string {
  const message = (params as { message?: unknown })?.message as
    | { parts?: unknown }
    | undefined;
  const parts = Array.isArray(message?.parts) ? message.parts : [];
  return parts
    .map((p) => {
      const part = p as { kind?: string; type?: string; text?: unknown };
      // A2A uses `kind: "text"`; tolerate `type: "text"` from looser clients.
      const isText = part?.kind === 'text' || part?.type === 'text';
      return isText && typeof part.text === 'string' ? part.text : '';
    })
    .join(' ')
    .trim();
}

/**
 * Pull a budget amount (EUR) out of free text. Matches the largest number that
 * looks like money: optional EUR/euro/€ marker, digits with , . or space
 * thousands separators. Returns undefined when no plausible amount is present.
 */
export function parseBudget(text: string): number | undefined {
  const matches = text.match(/(?:eur|euro|euros|€)?\s*([\d][\d.,\s]*\d|\d)/gi) ?? [];
  let best: number | undefined;
  for (const raw of matches) {
    const digits = raw.replace(/[^\d.,]/g, '');
    // Drop thousands separators (both , and .) then keep the integer part.
    const normalized = digits.replace(/[.,\s]/g, '');
    if (!normalized) continue;
    const n = Number(normalized);
    if (Number.isFinite(n) && n > 0 && (best === undefined || n > best)) best = n;
  }
  return best;
}

const FUNDING_RE = /fund|grant|aid|sme|subsid|co-?fund|budget|cost|eur|euro|€|\bpaquet\b/i;

/** Build the agent's reply text for a user message. */
export function buildReply(text: string): string {
  const mentionsFunding = FUNDING_RE.test(text);
  const budget = parseBudget(text);

  if (mentionsFunding && budget !== undefined) {
    const { eligible, grant, net, clamped } = computeSmePackage(budget);
    const note = clamped
      ? ` Your figure (EUR ${budget.toLocaleString('en')}) is outside the eligible band of EUR ${SME_MIN.toLocaleString('en')}-${SME_MAX.toLocaleString('en')}, so the estimate uses EUR ${eligible.toLocaleString('en')}.`
      : '';
    return (
      `For an eligible project cost of EUR ${eligible.toLocaleString('en')}, the indicative ` +
      `SME Package grant is EUR ${grant.toLocaleString('en')} (70%), leaving your contribution ` +
      `at EUR ${net.toLocaleString('en')} (30%).${note} This is indicative only: actual aid ` +
      `depends on SME eligibility and Ministry of the Economy / Luxinnovation approval, and is ` +
      `reimbursed after the project is delivered. Details and the full simulator: ${SITE_URL}/sme-package`
    );
  }

  if (mentionsFunding) {
    return (
      `Openletz helps eligible Luxembourg SMEs claim the SME Package: 70% co-funding on eligible ` +
      `project costs (EUR ${SME_MIN.toLocaleString('en')}-${SME_MAX.toLocaleString('en')}), reimbursed ` +
      `after delivery and subject to eligibility and Ministry of the Economy approval. Tell me a ` +
      `project budget in EUR for an indicative estimate, or see ${SITE_URL}/sme-package.`
    );
  }

  return (
    `Openletz is a Luxembourg AI agency (Commit Media S.à r.l.). We build AI agents and automation, ` +
    `websites and shops, and the digital growth around them, with Web3 when it genuinely helps. ` +
    `Hosted in Europe, built with GDPR and the EU AI Act in mind. For eligible Luxembourg SMEs we ` +
    `also help claim the SME Package (70% state co-funding). To scope a project, get in touch at ` +
    `${SITE_URL}/contact.`
  );
}

/** Compose an A2A agent Message in response to the user's message. */
function agentMessage(text: string) {
  return {
    role: 'agent',
    parts: [{ kind: 'text', text }],
    kind: 'message',
    messageId: crypto.randomUUID(),
  };
}

// --- Handlers ---------------------------------------------------------------

export async function POST(request: Request) {
  let body: JsonRpcRequest;
  try {
    body = (await request.json()) as JsonRpcRequest;
  } catch {
    return rpcError(null, -32700, 'Parse error');
  }

  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return rpcError(null, -32600, 'Invalid Request');
  }

  const id: JsonRpcId =
    typeof body.id === 'string' || typeof body.id === 'number' ? body.id : null;

  if (body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    return rpcError(id, -32600, 'Invalid Request');
  }

  if (body.method === 'message/send') {
    const text = extractText(body.params);
    if (!text) {
      return rpcError(id, -32602, 'Invalid params: message must contain a non-empty text part');
    }
    return rpcResult(id, agentMessage(buildReply(text)));
  }

  return rpcError(id, -32601, `Method not found: ${body.method}`);
}

// A GET returns the agent card (handy for humans and lenient clients).
export function GET() {
  return NextResponse.json(buildAgentCard(), { headers: JSON_HEADERS });
}

export function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
