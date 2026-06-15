import { describe, it, expect } from 'vitest';
import { POST, GET, parseBudget, buildReply } from './route';

function rpcRequest(body: unknown) {
  return new Request('http://localhost/api/a2a', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function sendMessage(text: string, id: string | number = 1) {
  return rpcRequest({
    jsonrpc: '2.0',
    id,
    method: 'message/send',
    params: { message: { role: 'user', parts: [{ kind: 'text', text }] } },
  });
}

describe('POST /api/a2a: message/send', () => {
  it('replies with an agent Message for a generic question', async () => {
    const res = await POST(sendMessage('What does Openletz do?'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.jsonrpc).toBe('2.0');
    expect(json.id).toBe(1);
    expect(json.error).toBeUndefined();
    expect(json.result.role).toBe('agent');
    expect(json.result.parts[0].kind).toBe('text');
    expect(typeof json.result.parts[0].text).toBe('string');
    expect(json.result.parts[0].text).toMatch(/Openletz/i);
    expect(json.result.parts[0].text).toMatch(/openletz\.ai\/contact/);
  });

  it('returns an indicative SME grant when the message names a budget', async () => {
    const res = await POST(sendMessage('estimate funding for a 20000 EUR project'));
    expect(res.status).toBe(200);
    const json = await res.json();
    const reply: string = json.result.parts[0].text;
    // 70% of 20,000 = 14,000 grant; 6,000 net.
    expect(reply).toMatch(/14,000/);
    expect(reply).toMatch(/6,000/);
    expect(reply).toMatch(/indicative/i);
    expect(reply).toMatch(/sme-package/);
  });

  it('preserves a string id', async () => {
    const res = await POST(sendMessage('hello', 'abc-123'));
    const json = await res.json();
    expect(json.id).toBe('abc-123');
  });

  it('errors -32602 when the message has no text part', async () => {
    const res = await POST(
      rpcRequest({
        jsonrpc: '2.0',
        id: 9,
        method: 'message/send',
        params: { message: { role: 'user', parts: [] } },
      }),
    );
    const json = await res.json();
    expect(json.result).toBeUndefined();
    expect(json.error.code).toBe(-32602);
    expect(json.id).toBe(9);
  });
});

describe('POST /api/a2a: JSON-RPC errors', () => {
  it('returns -32601 for an unknown method', async () => {
    const res = await POST(rpcRequest({ jsonrpc: '2.0', id: 2, method: 'tasks/get' }));
    const json = await res.json();
    expect(json.error.code).toBe(-32601);
    expect(json.error.message).toMatch(/tasks\/get/);
    expect(json.id).toBe(2);
    expect(json.result).toBeUndefined();
  });

  it('returns -32700 for invalid JSON', async () => {
    const res = await POST(rpcRequest('{ not json'));
    const json = await res.json();
    expect(json.error.code).toBe(-32700);
    expect(json.id).toBeNull();
  });

  it('returns -32600 when jsonrpc version is wrong', async () => {
    const res = await POST(rpcRequest({ jsonrpc: '1.0', id: 3, method: 'message/send' }));
    const json = await res.json();
    expect(json.error.code).toBe(-32600);
    expect(json.id).toBe(3);
  });

  it('returns -32600 when method is missing', async () => {
    const res = await POST(rpcRequest({ jsonrpc: '2.0', id: 4 }));
    const json = await res.json();
    expect(json.error.code).toBe(-32600);
  });
});

describe('GET /api/a2a', () => {
  it('returns the agent card', async () => {
    const res = await GET();
    const json = await res.json();
    expect(json.name).toBe('Openletz Studio Agent');
    expect(json.url).toMatch(/\/api\/a2a$/);
    expect(json.preferredTransport).toBe('JSONRPC');
    expect(Array.isArray(json.skills)).toBe(true);
  });
});

describe('parseBudget', () => {
  it('reads a plain number', () => {
    expect(parseBudget('estimate for 20000 eur')).toBe(20000);
  });
  it('strips a thousands separator', () => {
    expect(parseBudget('budget is EUR 12,000')).toBe(12000);
    expect(parseBudget('budget is 12.000 euros')).toBe(12000);
  });
  it('returns undefined when there is no number', () => {
    expect(parseBudget('what do you build?')).toBeUndefined();
  });
  it('picks the largest plausible amount', () => {
    expect(parseBudget('around 5000 to 20000 eur')).toBe(20000);
  });
});

describe('buildReply', () => {
  it('describes services with no funding context', () => {
    const r = buildReply('do you build multilingual websites?');
    expect(r).toMatch(/Openletz/);
    expect(r).toMatch(/contact/);
  });
  it('invites a budget when funding is mentioned without a number', () => {
    const r = buildReply('am I eligible for the SME grant?');
    expect(r).toMatch(/70%/);
    expect(r).toMatch(/budget/i);
  });
  it('clamps an out-of-band budget and flags it', () => {
    const r = buildReply('grant for a 40000 EUR project');
    // Capped to 25,000 -> 17,500 grant.
    expect(r).toMatch(/17,500/);
    expect(r).toMatch(/outside the eligible band/);
  });
});
