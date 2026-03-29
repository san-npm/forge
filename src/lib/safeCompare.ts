import { timingSafeEqual } from 'crypto'

/**
 * Constant-time string comparison to prevent timing attacks on secret tokens.
 */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}
