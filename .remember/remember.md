# Handoff

## State
Shipped SEO technical fixes for openletz.com (commit `baa1878` on `main`, auto-deployed). Removed preview URL `code-name-forge-ai.vercel.app` from project domains (was indexed as duplicate content). Added `.ai/.fr/.info` domains to Vercel with 308 redirects. Trimmed sitemap + Link-header hreflang to 5 shipped locales (fr/en/de/lb/pt). Untranslated locales (it/es/ru/ar/tr/uk) now `noindex,nofollow`. Env-driven GSC/Bing verification plumbing in `src/app/[locale]/layout.tsx`. IndexNow pinged (240 URLs). Apex redirect upgraded 307→308. Full audit in prior message.

## Next
1. **Tell Clement to change IONOS DNS** for openletz.ai/.fr/.info: apex A → `216.198.79.1`, www CNAME → `cname.vercel-dns.com.` (redirects already live in Vercel, waiting on DNS).
2. **Tell Clement to set `GSC_VERIFICATION` + `BING_VERIFICATION` env vars in Vercel** after adding property at search.google.com/search-console and copying the HTML-tag token, then redeploy + click Verify + submit sitemap.
3. Content cadence is still the big lever: 7/24 planned blog posts shipped (see `SEO-AUDIT-2026-04.md`). Agent detail pages (~400 words) need the 1,200–1,800 word rewrite per that audit.

## Context
- Vercel token lives at `~/Library/Application Support/com.vercel.cli/auth.json`; project is `forge` (prj_dMCv8m7porfS40flgS1EV7L13tDe) under scope `clementfrmds-projects`.
- Robots `index: true/false` is **baked at build time** via `VERCEL_ENV` — local builds without the env set will show noindex. That's correct Vercel behavior (preview builds get noindex, prod builds get index). Middleware adds `X-Robots-Tag` as a runtime belt-and-suspenders.
- `routing.locales` in `src/i18n/routing.ts` still has all 11 so users can browse the untranslated locales; do NOT trim it — that would break those routes. Indexability is controlled separately via `INDEXABLE_LOCALES` in layout + sitemap + middleware.
- Domain is only 2 months old (registered 2026-02-17) — expect 60–120 days before technical fixes show measurable traffic lift. Compounding work from here is content volume + backlinks, not more infra.
