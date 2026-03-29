const hits = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  ip: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): { ok: boolean; remaining: number } {
  const now = Date.now()

  // Evict stale entries to prevent unbounded memory growth
  if (hits.size > 10_000) {
    hits.forEach((val, key) => {
      if (now > val.resetAt) hits.delete(key)
    })
  }

  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1 }
  }

  entry.count++
  if (entry.count > limit) {
    return { ok: false, remaining: 0 }
  }
  return { ok: true, remaining: limit - entry.count }
}
