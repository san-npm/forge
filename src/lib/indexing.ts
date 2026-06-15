/**
 * Portable production-host guard for the preview-indexing kill-switch.
 *
 * Why: Google was ranking Vercel preview deployments above production. The
 * original guard was Vercel-only (`process.env.VERCEL_ENV === 'production'`).
 * This re-implementation keeps Vercel behaviour identical AND stays correct if
 * hosting moves off Vercel:
 *
 *   1. On Vercel: trust VERCEL_ENV — only 'production' indexes.
 *   2. Off Vercel: require an EXPLICIT `SITE_ENV=production` opt-in.
 *   3. No signal at all: FAIL CLOSED (do not index) — a staging box must never
 *      accidentally get indexed.
 *
 * Set `SITE_ENV=production` in the prod environment of any non-Vercel host.
 */
export function isProductionHost(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv) {
    // On Vercel: VERCEL_ENV is authoritative.
    return vercelEnv === 'production';
  }
  // Off Vercel: only an explicit opt-in counts. Fail closed otherwise.
  return process.env.SITE_ENV === 'production';
}
