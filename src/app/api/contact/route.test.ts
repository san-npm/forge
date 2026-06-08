import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock fs/promises to avoid disk writes in tests.
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn().mockResolvedValue('[]'),
    writeFile: vi.fn().mockResolvedValue(undefined),
    mkdir: vi.fn().mockResolvedValue(undefined),
  },
  readFile: vi.fn().mockResolvedValue('[]'),
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

// Mock notifications to avoid external calls.
vi.mock('@/lib/notifications', () => ({
  sendNotification: vi.fn(),
}));

// Mock rateLimit — default to allowed; individual tests override.
vi.mock('@/lib/rateLimit', () => ({
  rateLimit: vi.fn(() => ({ ok: true, remaining: 4 })),
}));

// Import the route handler + rateLimit mock AFTER mocks are registered.
const { POST } = await import('./route');
const { rateLimit } = await import('@/lib/rateLimit');
const rateLimitMock = vi.mocked(rateLimit);

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    rateLimitMock.mockReturnValue({ ok: true, remaining: 4 });
  });

  it('returns 200 for a minimal valid payload', async () => {
    const res = await POST(makeRequest({ name: 'Ada', email: 'ada@example.com' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('returns 200 for a full payload with all optional fields', async () => {
    const res = await POST(
      makeRequest({
        name: 'Ada',
        email: 'ada@example.com',
        phone: '+352',
        company: 'ACME',
        companySize: '1-10',
        pillar: 'AI automation',
        budget: '5-15k',
        message: 'Build me an agent.',
      }),
    );
    expect(res.status).toBe(200);
  });

  it('returns 400 when name is missing', async () => {
    const res = await POST(makeRequest({ email: 'ada@example.com' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/name and email are required/i);
  });

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ name: 'Ada' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/name and email are required/i);
  });

  it('returns 400 for an invalid email format', async () => {
    const res = await POST(makeRequest({ name: 'Ada', email: 'not-an-email' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/invalid email format/i);
  });

  it('returns 400 when name exceeds 500 chars', async () => {
    const res = await POST(makeRequest({ name: 'a'.repeat(501), email: 'a@b.co' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when message exceeds 2000 chars', async () => {
    const res = await POST(makeRequest({ name: 'A', email: 'a@b.co', message: 'm'.repeat(2001) }));
    expect(res.status).toBe(400);
  });

  it('returns 429 when rate limit is exceeded', async () => {
    rateLimitMock.mockReturnValue({ ok: false, remaining: 0 });
    const res = await POST(makeRequest({ name: 'Ada', email: 'ada@example.com' }));
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toMatch(/too many requests/i);
  });
});
