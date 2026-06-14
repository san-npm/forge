#!/usr/bin/env node
/**
 * Core Web Vitals byte-budget guard.
 *
 * Pure evaluator (`evaluateBudget`) is unit-tested. The CLI half parses the
 * Next.js build manifest produced by `next build` and asserts the first-load
 * JS for every app route is under FIRST_LOAD_JS_BUDGET_KB. A regression that
 * would blow LCP/INP fails the build before it ships.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { createRequire } from 'node:module';

// First-load JS REGRESSION guard (gzipped). This is a ceiling that fails CI if a
// heavy dependency or un-split island balloons a route's first-load JS — NOT the
// CWV SLA itself. Real LCP/INP/CLS are measured directly in e2e/cwv-ssr.spec.ts
// (verified 2026-06-14: LCP 68-100ms, CLS 0 on /, /work, /contact).
//
// Calibrated to the measured Next 16 + React 19 App Router baseline: every locale
// route inherits a ~184 KB gzipped shared floor (framework runtime + layout-level
// Nav/Footer/Analytics client chrome) before any page code; the heaviest route
// (home, with the motion + GSAP set-piece) measured ~237 KB. 260 KB leaves ~10%
// headroom over today's worst case so a genuine regression still trips the guard.
// To push first-load JS down (optional perf work, not required — CWV is already
// green): lazy-load the home GSAP set-piece and defer the form islands.
export const FIRST_LOAD_JS_BUDGET_KB = 260;

/**
 * @param {{ route: string, firstLoadKb: number }[]} routes
 * @returns {{ ok: boolean, violations: { route: string, firstLoadKb: number, budget: number }[] }}
 */
export function evaluateBudget(routes) {
  const violations = routes
    .filter((r) => r.firstLoadKb > FIRST_LOAD_JS_BUDGET_KB)
    .map((r) => ({ route: r.route, firstLoadKb: r.firstLoadKb, budget: FIRST_LOAD_JS_BUDGET_KB }));
  return { ok: violations.length === 0, violations };
}

// Resolve a client-chunk path from a manifest (e.g. "/_next/static/chunks/x.js")
// to its on-disk location under `.next/`.
function chunkToDisk(nextDir, chunk) {
  const rel = chunk.replace(/^\/_next\//, '').replace(/^\//, '');
  return join(nextDir, rel);
}

// Gzipped size of a chunk on disk (the budget is "gzipped-equivalent", which is
// what the browser actually downloads over the wire and what CWV reflects).
function gzippedSize(path) {
  if (!existsSync(path)) return 0;
  return gzipSync(readFileSync(path)).length;
}

// Walk `.next/server/app` and collect every `*_client-reference-manifest.js`.
function findClientManifests(dir, acc = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) findClientManifests(p, acc);
    else if (ent.name.endsWith('_client-reference-manifest.js')) acc.push(p);
  }
  return acc;
}

/**
 * Estimates first-load JS per app route from the Next.js 16 build output.
 *
 * Next 16 no longer emits `app-build-manifest.json`. The authoritative
 * per-route first-load chunk list lives in each
 * `.next/server/app/**\/*_client-reference-manifest.js` (the `__RSC_MANIFEST`
 * global). First-load JS for a route = the deduplicated union of that route's
 * ENTRY chunks (`entryJSFiles`: the page entry + the layout entries that wrap
 * it — the JS the browser must download before the route is interactive) plus
 * the shared framework/runtime `rootMainFiles` every route loads. Sizes are
 * summed GZIPPED to match the budget's stated gzipped-equivalent basis (what
 * ships over the wire and drives LCP/INP), not the raw uncompressed bytes.
 * @returns {{ route: string, firstLoadKb: number }[]}
 */
function readRoutesFromBuild() {
  const nextDir = join(process.cwd(), '.next');
  const buildManifestPath = join(nextDir, 'build-manifest.json');
  const appServerDir = join(nextDir, 'server', 'app');
  if (!existsSync(buildManifestPath) || !existsSync(appServerDir)) {
    throw new Error('No .next build output — run `npm run build` first.');
  }

  // Shared first-load JS loaded on every route (framework, runtime, main).
  const buildManifest = JSON.parse(readFileSync(buildManifestPath, 'utf8'));
  const sharedChunks = new Set();
  for (const f of buildManifest.rootMainFiles || []) {
    if (f.endsWith('.js')) sharedChunks.add(f.startsWith('/') ? f : `/_next/${f}`);
  }

  const require = createRequire(import.meta.url);
  const manifests = findClientManifests(appServerDir);
  const out = [];

  for (const manifestPath of manifests) {
    // Each manifest assigns into the global __RSC_MANIFEST. Isolate per file.
    globalThis.self = globalThis;
    globalThis.__RSC_MANIFEST = {};
    delete require.cache[manifestPath];
    require(manifestPath);
    const entries = Object.entries(globalThis.__RSC_MANIFEST);
    for (const [route, manifest] of entries) {
      // Only app *page* routes count toward the user-facing first-load budget
      // (skip /route handlers, API endpoints).
      if (!route.endsWith('/page') && route !== '/page') continue;
      const chunks = new Set(sharedChunks);
      for (const files of Object.values(manifest.entryJSFiles || {})) {
        for (const c of files || []) if (c.endsWith('.js')) chunks.add(c);
      }
      let bytes = 0;
      for (const c of chunks) bytes += gzippedSize(chunkToDisk(nextDir, c));
      out.push({ route: route.replace(/\/page$/, '') || '/', firstLoadKb: Math.round(bytes / 1024) });
    }
  }

  out.sort((a, b) => a.route.localeCompare(b.route));
  return out;
}

// CLI entry — only runs when invoked directly, not when imported by the test.
if (import.meta.url === `file://${process.argv[1]}`) {
  let routes;
  try {
    routes = readRoutesFromBuild();
  } catch (err) {
    console.error(`cwv-budget: ${err.message}`);
    process.exit(2);
  }
  const result = evaluateBudget(routes);
  for (const r of routes) {
    const flag = r.firstLoadKb > FIRST_LOAD_JS_BUDGET_KB ? 'OVER ' : 'ok   ';
    console.log(`${flag} ${String(r.firstLoadKb).padStart(4)} KB  ${r.route}`);
  }
  if (!result.ok) {
    console.error(`\ncwv-budget: ${result.violations.length} route(s) over ${FIRST_LOAD_JS_BUDGET_KB} KB first-load JS budget.`);
    process.exit(1);
  }
  console.log(`\ncwv-budget: all routes within ${FIRST_LOAD_JS_BUDGET_KB} KB budget.`);
}
