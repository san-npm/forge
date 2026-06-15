# Openletz.ai Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scrapped Mac OS X "Aqua" desktop homepage with a monochrome, editorial, conversion-first Openletz.ai — a Luxembourg AI agency site whose primary action is a qualifying project enquiry.

**Architecture:** Content lives in typed `src/data/*` modules (ported verbatim from `osData.ts`, validated by Zod at module load so bad content fails the build). Pages are a typed `Section[]` discriminated union rendered by a `<SectionRenderer>` of **Server Components**; all interactivity (motion, forms, the live proof strip, work filter) lives in `'use client'` leaf islands. Nav and Footer are layout-level. Canonical host is `https://openletz.ai` (apex); the AEO/JSON-LD layer is salvaged and domain-fixed. Motion is restrained "premium-quiet" via `motion/react` + CSS scroll-timeline, with GSAP reserved for one optional set-piece.

**Tech Stack:** Next.js 16 (App Router) · React 19 · Tailwind · next-intl (en/fr/de) · `motion/react` · Zod · Vitest + Testing Library + Playwright · Vercel.

**Spec:** `docs/superpowers/specs/2026-06-07-openletz-website-redesign-design.md`. **Research brief:** `~/openletz-website-intel-2026-06.md`.

**Branch:** `redesign/openletz-ai`. **Commits:** conventional-commit style, **no AI attribution** (Commit Media preference). One commit per task.

---

## Phase overview (61 tasks)

| Phase | Owns | Tasks |
|---|---|---|
| **0 — Decisions & cleanup** | test stack, deps, `site-config`, i18n collapse, redirect inversion + `redirects.ts` (host rules + empty legacy stub), SITE_URL replacement, all deletions (OS shell, grants, agents, surplus locales, quiz UI), CLAUDE.md | 0.1–0.10 |
| **1 — Foundation** | Zod schemas + 8-variant `Section` union, data port (`studio/services/work/about/contact/pricing`), `nav.ts`, `proof.ts`, hero i18n, tokens + Tailwind, fonts, motion primitives, layout chrome (Nav/Footer/Newsletter), JSON-LD builders, AEO files, layout rewrite, green-gate | 1.1–1.13 |
| **2 — Renderer + pages** | `SectionRenderer`, `HOME_SECTIONS` (8 sections), `proof.ts` fetch/cache, islands (ProofStripLive, EnquiryForm, WorkFilter), 8 section components, homepage wiring, `/work` + essays, `/about`, `/contact`, `/legal`, sitemap, populate `LEGACY_REDIRECTS`, verification | 2.1–2.17 |
| **3 — Conversion & growth** | `/services`, `/pricing`, `/audit` lead magnet, `/insights` + posts, per-page Service/Offer + FAQPage + Breadcrumb JSON-LD, Testimonials component, view-transition gallery | 3.1–3.11 |
| **4 — Verify & launch** | bundle-analyzer + CWV budget, Playwright CWV + SSR-content (AI-crawler) + reduced-motion, Rich Results, 301 resolution, noindex-guard portability, sitemap submit, launch checklist | 4.1–4.10 |

### Cross-phase reconciliation notes (read before executing 2 & 3)
- **Footer / Nav:** layout-level (Phase 1). There is **no `'footer'` Section variant** — the `Section` union has 8 variants ending at `enquiryForm`. Every page gets Nav/Footer from `[locale]/layout.tsx`.
- **Legacy 301s:** `src/lib/redirects.ts` is created in Phase 0 with host rules + an **empty** `LEGACY_REDIRECTS` stub; Phase 2 (Task 2.16) **populates** the full per-URL legacy map and extends `redirects.test.ts`.
- **Testimonials:** Phase 2's `DeeperProof` renders an **empty-safe inline** testimonials list; Phase 3 (Task 3.3) adds the dedicated `Testimonials` component + real data.
- **Work gallery motion:** Phase 2's `/work` + `SelectedWork` use **simple links**; Phase 3 (Task 3.10) adds the **view-transition** polish.
- **JSON-LD:** Phase 1 (`src/lib/jsonld.ts`) ships the generic builders (Organization, ProfessionalService, WebSite, breadcrumb, faq); Phase 3 (Task 3.4) **adds** per-page Service/Offer builders to the same file.
- **Nav contents:** `NAV` already includes Services + Insights (Phase 1); Phase 3 only needs to surface `/pricing` + `/audit` as secondary links where appropriate.
- **Owner-provided placeholders** (structurally complete, single value to fill): pricing `from €X` numbers, case-study metrics + client testimonials, founder headshot, `/openletz-logo.png`, `cal.com` booking URL. See spec §12.

---

# Shared Contracts & File Structure

## File Structure

> **Authority rule:** Every path below is absolute. The names, casing, and exports in this document are **canonical** — drafters reuse them VERBATIM. If a drafter needs a name not defined here, that is a contract gap: stop and flag it, do not invent.
>
> Root for all relative discussion is `/Users/hodlmedia/forge`. Path alias `@/` → `/Users/hodlmedia/forge/src`.
>
> **Canonical decisions locked for all drafters:**
> - `SITE_URL = 'https://openletz.ai'` (apex, NO `www`, NO trailing slash).
> - Locales = exactly `['en', 'fr', 'de']`. `defaultLocale = 'en'`. `x-default = en`. EN served at `/` (no prefix). `localePrefix: 'as-needed'`.
> - Content single source of truth = `osData.ts` → ported to `src/data/*.ts`, validated by Zod.
> - Pages = typed `Section[]` discriminated union rendered by `<SectionRenderer>` (Server Components); interactivity in `'use client'` leaf islands only.
> - Monochrome palette + motion tokens in `src/styles/tokens.css`. NO accent color.
> - Test stack = Vitest + @testing-library/react (unit/component) + Playwright (E2E). TDD for logic units.

### Legend
**C** = Create · **M** = Modify · **D** = Delete

---

### 1. Config & site-wide constants

| Op | Path | Single responsibility |
|---|---|---|
| C | `/Users/hodlmedia/forge/src/lib/site-config.ts` | THE one exported `SITE_URL`, `LOCALES`, `DEFAULT_LOCALE`, `siteConfig` object. Every JSON-LD/sitemap/canonical/redirect imports from here. Replaces 10 duplicated literals. |
| C | `/Users/hodlmedia/forge/src/lib/schema.ts` | All Zod schemas for `src/data/*` + runtime payloads (contact, newsletter). Single import surface for validation. |
| C | `/Users/hodlmedia/forge/src/lib/redirects.ts` | The typed legacy→new 301 map (`LEGACY_REDIRECTS: Redirect[]`) + host-canonicalization rules. Consumed by `next.config.mjs`. |
| C | `/Users/hodlmedia/forge/src/lib/jsonld.ts` | Pure builders for every JSON-LD block (Organization, ProfessionalService, BreadcrumbList, FAQPage, WebSite). Return plain objects; rendering is the layout's job. |
| M | `/Users/hodlmedia/forge/next.config.mjs` | Invert `.com→.ai`; import `LEGACY_REDIRECTS`; enable `cacheComponents`; prune dead apex redirects. |
| M | `/Users/hodlmedia/forge/src/i18n/routing.ts` | Collapse locales to `['en','fr','de']`, `defaultLocale:'en'`. Import from `site-config.ts`. |
| M | `/Users/hodlmedia/forge/src/i18n/config.ts` | Collapse to `['en','fr','de']`, `defaultLocale:'en'`. Import from `site-config.ts`. |
| M | `/Users/hodlmedia/forge/src/proxy.ts` | `INDEXABLE_LOCALES` → `['en','fr','de']`. Keep `/api/md` rewrite + matcher. |
| M | `/Users/hodlmedia/forge/package.json` | Rename `forge-simulator`→`openletz`; add deps (`zod`, `motion`); add devDeps (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@playwright/test`, `@vitejs/plugin-react`); add scripts; remove dead deps (`next-mdx-remote`, `react-markdown`, `remark-gfm`). |
| C | `/Users/hodlmedia/forge/vitest.config.ts` | Vitest config (jsdom env, setup file, `@/` alias). |
| C | `/Users/hodlmedia/forge/vitest.setup.ts` | `@testing-library/jest-dom` import + RTL cleanup + `matchMedia`/`IntersectionObserver` stubs. |
| C | `/Users/hodlmedia/forge/playwright.config.ts` | Playwright config; `PORT=3030`, `webServer` boots `npm run dev`. |
| M | `/Users/hodlmedia/forge/CLAUDE.md` | Rewrite for the studio site (kill quiz/simulator docs). |

---

### 2. Typed content data modules (ported from `osData.ts` / `osI18n.ts`)

All under `/Users/hodlmedia/forge/src/data/`. Each exports a `const` typed by an interface in the same file OR in `schema.ts` (z.infer), AND is parsed by its Zod schema at module load (`SCHEMA.parse(DATA)`), so bad content fails the build.

| Op | Path | Single responsibility | Exports |
|---|---|---|---|
| C | `/Users/hodlmedia/forge/src/data/studio.ts` | Studio identity strings (name, tagline, sub, welcomeLead, hint). | `STUDIO: Studio` |
| C | `/Users/hodlmedia/forge/src/data/services.ts` | 3 pillars (ai, web3, marketing). | `SERVICES: Record<ServiceKey, ServiceData>` |
| C | `/Users/hodlmedia/forge/src/data/work.ts` | 6 portfolio items, order significant. | `WORK: WorkItem[]` |
| C | `/Users/hodlmedia/forge/src/data/about.ts` | Founder bio, facts, entity. | `ABOUT: About` |
| C | `/Users/hodlmedia/forge/src/data/contact.ts` | Enquiry lead copy, pillar types, callLine. | `CONTACT: Contact` |
| C | `/Users/hodlmedia/forge/src/data/pricing.ts` | 4 tiers (`from €X` placeholders) + lead + note. | `PRICING: Pricing` |
| C | `/Users/hodlmedia/forge/src/data/hero-i18n.ts` | EN/FR/DE hero strings (drop LB). EN aliases STUDIO. | `HERO: Record<Locale, Hero>`, `LANGS` |
| C | `/Users/hodlmedia/forge/src/data/nav.ts` | 5-item nav model + footer columns + the one CTA verb constant `START_PROJECT`. | `NAV`, `FOOTER`, `START_PROJECT` |
| C | `/Users/hodlmedia/forge/src/data/proof.ts` | Static proof-strip descriptors (logo wordmarks, defensible metric definitions). NO fabricated numbers. | `PROOF_LOGOS`, `PROOF_METRICS` |
| C | `/Users/hodlmedia/forge/src/data/pages/home.ts` | The homepage `Section[]` array (the 9-section spine). | `HOME_SECTIONS: Section[]` |

---

### 3. Section components (one file per homepage section)

All under `/Users/hodlmedia/forge/src/components/sections/`. Each is a **Server Component** taking exactly the variant props from the discriminated union (section 2 of Shared Contracts). Interactive bits delegate to `ui/*` client islands.

| Op | Path | Renders union variant | Phase |
|---|---|---|---|
| C | `/Users/hodlmedia/forge/src/components/SectionRenderer.tsx` | Switch over `Section['type']` → the right section component. Exhaustive (`never` check) over the 8 variants. | 2 |
| C | `/Users/hodlmedia/forge/src/components/sections/HeroSection.tsx` | `hero` | 2 |
| C | `/Users/hodlmedia/forge/src/components/sections/ProofStripSection.tsx` | `proofStrip` (shell SSR; live signals via client island) | 2 |
| C | `/Users/hodlmedia/forge/src/components/sections/ServicesGridSection.tsx` | `servicesGrid` | 2 |
| C | `/Users/hodlmedia/forge/src/components/sections/HowWeWorkSection.tsx` | `howWeWork` | 2 |
| C | `/Users/hodlmedia/forge/src/components/sections/SelectedWorkSection.tsx` | `selectedWork` | 2 |
| C | `/Users/hodlmedia/forge/src/components/sections/DeeperProofSection.tsx` | `deeperProof` | 2 |
| C | `/Users/hodlmedia/forge/src/components/sections/TrustBlockSection.tsx` | `trustBlock` | 2 |
| C | `/Users/hodlmedia/forge/src/components/sections/EnquiryFormSection.tsx` | `enquiryForm` (shell SSR; `<EnquiryForm>` client island inside) | 2 |

> **No `footer` section variant.** Nav, Footer and NewsletterForm are **layout-level** components (created in Phase 1, Task 1.9; rendered once in `[locale]/layout.tsx`, Task 1.12). The `Section` union has exactly **8** variants.

---

### 4. UI primitives & client islands

All under `/Users/hodlmedia/forge/src/components/ui/`. `'use client'` where they animate or handle input. Motion via `motion/react` reading the CSS motion tokens.

| Op | Path | Single responsibility |
|---|---|---|
| C | `/Users/hodlmedia/forge/src/components/ui/Reveal.tsx` | `'use client'` — staggered word/line entrance reveal; respects `prefers-reduced-motion`; NEVER wraps the LCP node. |
| C | `/Users/hodlmedia/forge/src/components/ui/MagneticButton.tsx` | `'use client'` — the magnetic primary CTA; magnet gated behind `no-preference`. |
| C | `/Users/hodlmedia/forge/src/components/ui/CountUp.tsx` | `'use client'` — count-up on metric numbers when in view. |
| C | `/Users/hodlmedia/forge/src/components/ui/HoverCard.tsx` | `'use client'` — card hover grows from origin (transform/opacity only). |
| C | `/Users/hodlmedia/forge/src/components/ui/Hairline.tsx` | Server — hairline rule / signal-glyph divider. |
| C | `/Users/hodlmedia/forge/src/components/ui/WorkFilter.tsx` | `'use client'` — AI/Web/Web3 tag filter for `/work` + selected-work. |
| C | `/Users/hodlmedia/forge/src/components/ui/ProofStripLive.tsx` | `'use client'` — fetches cached live signals; degrades to "verified N min ago"; never blocks paint. |
| C | `/Users/hodlmedia/forge/src/components/EnquiryForm.tsx` | `'use client'` — the qualifying enquiry form; posts `ContactPayload` to `/api/contact`. |
| C | `/Users/hodlmedia/forge/src/components/NewsletterForm.tsx` | `'use client'` — footer newsletter; posts to `/api/newsletter`. |
| C | `/Users/hodlmedia/forge/src/components/Nav.tsx` | `'use client'` — flat 5-item nav + persistent "Start a project" + lang switch. |

---

### 5. Styles & fonts

| Op | Path | Single responsibility |
|---|---|---|
| C | `/Users/hodlmedia/forge/src/styles/tokens.css` | Palette + motion CSS custom properties + global `prefers-reduced-motion` kill-switch. The ONLY place tokens are defined. |
| C | `/Users/hodlmedia/forge/src/lib/fonts.ts` | `next/font` self-host (display + body + mono), subset `latin`+`latin-ext`; exports CSS-var class names. |
| M | `/Users/hodlmedia/forge/src/app/globals.css` | Import `tokens.css`; strip OS/quiz styles; Tailwind directives only. |
| M | `/Users/hodlmedia/forge/tailwind.config.js` | Map theme colors to the token CSS vars; drop blue/purple `primary`/`accent`. |

---

### 6. App routes (full IA)

Locale segment is `[locale]`. **Every** `[locale]` file calls `setRequestLocale(locale)` + exports `generateStaticParams` (returns the 3 locales) — non-negotiable.

| Op | Path | Single responsibility | Phase |
|---|---|---|---|
| M | `/Users/hodlmedia/forge/src/app/[locale]/layout.tsx` | Locale shell; render JSON-LD from `jsonld.ts`; fonts; Nav/Footer; keep `VERCEL_ENV` noindex guard. | 1 |
| M | `/Users/hodlmedia/forge/src/app/[locale]/page.tsx` | Homepage = `<SectionRenderer sections={HOME_SECTIONS} />`. | 2 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/work/page.tsx` | `/work` filterable grid. | 2 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/work/[slug]/page.tsx` | Case-study essay (Vins Fins, La Grocerie) + metric sidebar; `generateStaticParams` from `WORK`. | 2 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/about/page.tsx` | Founder bio + entity + EU/GDPR/AI-Act trust block. | 2 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/contact/page.tsx` | Standalone enquiry form + book-a-call. | 2 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/legal/privacy/page.tsx` | Privacy boilerplate (salvaged), domain-fixed email. | 2 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/legal/terms/page.tsx` | Terms boilerplate (salvaged), domain-fixed email. | 2 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/services/page.tsx` | 3 pillars as one studio. | 3 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/pricing/page.tsx` | Productized `from €X` tiers from `PRICING`. | 3 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/audit/page.tsx` | AI/web readiness lead magnet → enquiry. | 3 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/insights/page.tsx` | New agency posts list (`getAllPosts`). | 3 |
| C | `/Users/hodlmedia/forge/src/app/[locale]/insights/[slug]/page.tsx` | Post reader; `generateStaticParams` from `getAllPosts`. | 3 |
| M | `/Users/hodlmedia/forge/src/app/sitemap.ts` | Rebuild from `site-config.ts` + new IA; locales `['en','fr','de']`. | 2 |
| M | `/Users/hodlmedia/forge/public/robots.txt` | Domain → `openletz.ai`; `Sitemap:` line; keep per-bot allowlist. | 1 |
| M | `/Users/hodlmedia/forge/public/llms.txt` | Already `.ai` apex — reconcile to canonical, swap grants content. | 2 |
| M | `/Users/hodlmedia/forge/public/llms-full.txt` | Same; source agency FAQ from here. | 2 |

**API (salvaged, hardened):**
| Op | Path | Single responsibility |
|---|---|---|
| M | `/Users/hodlmedia/forge/src/app/api/contact/route.ts` | Replace hand-rolled `sanitize` with `ContactSchema` (zod); keep rate-limit + notification fan-out. |
| M | `/Users/hodlmedia/forge/src/app/api/newsletter/route.ts` | Replace hand-rolled validation with `NewsletterSchema` (zod). |
| M | `/Users/hodlmedia/forge/src/app/api/well-known/openapi/route.ts` | Domain → `openletz.ai`. |
| M | `/Users/hodlmedia/forge/src/app/api/well-known/api-catalog/route.ts` | Import `SITE_URL`. |
| M | `/Users/hodlmedia/forge/src/app/api/md/[[...slug]]/route.ts` | Import `SITE_URL`; serve `/insights/*` markdown. |
| M | `/Users/hodlmedia/forge/src/lib/blog.ts` | Keep gray-matter reader; trim frontmatter locale union to en/fr/de. |

---

### 7. Files to DELETE (kill list)

| Op | Path | Why |
|---|---|---|
| D | `/Users/hodlmedia/forge/src/components/os/OpenletzOS.tsx` | Aqua OS shell scrapped. |
| D | `/Users/hodlmedia/forge/src/components/os/MacWindow.tsx` | OS furniture. |
| D | `/Users/hodlmedia/forge/src/components/os/MenuBar.tsx` | OS furniture. |
| D | `/Users/hodlmedia/forge/src/components/os/Dock.tsx` | OS furniture. |
| D | `/Users/hodlmedia/forge/src/components/os/DesktopIcon.tsx` | OS furniture. |
| D | `/Users/hodlmedia/forge/src/components/os/windows.tsx` | OS furniture. |
| D | `/Users/hodlmedia/forge/src/components/os/aquaIcons.tsx` | OS furniture. |
| D | `/Users/hodlmedia/forge/src/components/os/icons.tsx` | Aqua icons. |
| D | `/Users/hodlmedia/forge/src/components/os/CrawlableContent.tsx` | OS-era SSR hack. |
| D | `/Users/hodlmedia/forge/src/components/os/apps/Sketch.tsx` | OS app. |
| D | `/Users/hodlmedia/forge/src/components/os/apps/Snake.tsx` | OS app. |
| D | `/Users/hodlmedia/forge/src/app/os/*` (incl. `os.css`) | OS route. |
| keep-then-port | `/Users/hodlmedia/forge/src/components/os/osData.ts` | PORT to `src/data/*` then delete. |
| keep-then-port | `/Users/hodlmedia/forge/src/components/os/osI18n.ts` | PORT to `src/data/hero-i18n.ts` then delete. |
| D | `/Users/hodlmedia/forge/src/app/[locale]/aides/*` | Grants era. |
| D | `/Users/hodlmedia/forge/src/lib/programs.ts` | Grants era. |
| D | `/Users/hodlmedia/forge/src/lib/eligibility.ts` | Grants era. |
| D | `/Users/hodlmedia/forge/src/lib/agents.ts` | 140KB AI-tools directory. |
| D | `/Users/hodlmedia/forge/src/app/[locale]/agents/*` | Directory routes. |
| D | `/Users/hodlmedia/forge/content/blog/*.mdx` (all 7) | Grants-era posts; owner writes new. |
| D | `/Users/hodlmedia/forge/messages/{it,es,ru,ar,tr,uk,pt,lb}.json` | Locale sprawl → keep en/fr/de. |
| D | `/Users/hodlmedia/forge/src/components/Results.tsx` | Quiz results / PDF (grants). |
| D | `/Users/hodlmedia/forge/src/components/Quiz.tsx` (and other quiz UI) | Grants UI. |

---

### 8. Test files

Unit/component co-located OR under `__tests__`; E2E under `e2e/`.

| Op | Path | Covers |
|---|---|---|
| C | `/Users/hodlmedia/forge/src/lib/site-config.test.ts` | `SITE_URL` apex (no www/slash), locale set, `localeUrl()` builder. |
| C | `/Users/hodlmedia/forge/src/lib/schema.test.ts` | Every data schema parses real data; rejects malformed. |
| C | `/Users/hodlmedia/forge/src/lib/redirects.test.ts` | `.com→.ai` inversion; every killed legacy URL has a 301; no soft-404 to home; no dup sources. |
| C | `/Users/hodlmedia/forge/src/lib/jsonld.test.ts` | JSON-LD `@id`/`url`/email use `openletz.ai`; required fields present. |
| C | `/Users/hodlmedia/forge/src/data/__tests__/data.test.ts` | Ported data matches osData ground-truth (6 work items, 3 services, 4 tiers, slugs). |
| C | `/Users/hodlmedia/forge/src/app/api/contact/route.test.ts` | `ContactSchema` validation: required name/email, email regex, field caps, 400/429/200. |
| C | `/Users/hodlmedia/forge/src/app/api/newsletter/route.test.ts` | Email validation, dedup `alreadySubscribed`. |
| C | `/Users/hodlmedia/forge/src/components/SectionRenderer.test.tsx` | Renders each variant; unknown type → `never` guard. |
| C | `/Users/hodlmedia/forge/src/components/sections/HeroSection.test.tsx` | H1 text present in static render; LCP node NOT `opacity:0`. |
| C | `/Users/hodlmedia/forge/src/components/ui/Reveal.test.tsx` | reduced-motion → no transform; no-preference → animates. |
| C | `/Users/hodlmedia/forge/src/components/ui/ProofStripLive.test.tsx` | Cache fallback "verified N min ago"; never throws on fetch fail. |
| C | `/Users/hodlmedia/forge/e2e/home.spec.ts` | Home loads at `/`; H1 visible; "Start a project" → enquiry form. |
| C | `/Users/hodlmedia/forge/e2e/i18n.spec.ts` | `/fr` + `/de` render; `x-default`/hreflang correct; dropped locales 404/301. |
| C | `/Users/hodlmedia/forge/e2e/reduced-motion.spec.ts` | `prefers-reduced-motion: reduce` → content visible, no spectacle. |

---

## Shared Contracts

> Everything below is **verbatim-reuse**. Copy the type/const names exactly. Do not rename, re-case, or re-shape.

### 0. The one CTA verb

```ts
// src/data/nav.ts
export const START_PROJECT = 'Start a project' as const; // EN; FR/DE via hero-i18n
```
Used ~5×: hero, after services, after selected work, closing form, nav button. Book-a-call is always the quieter secondary. Never alternate verbs.

---

### 1. SiteConfig — `src/lib/site-config.ts`

```ts
// src/lib/site-config.ts
export const SITE_URL = 'https://openletz.ai' as const; // apex, no www, no trailing slash

export const LOCALES = ['en', 'fr', 'de'] as const;
export type Locale = (typeof LOCALES)[number]; // 'en' | 'fr' | 'de'

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_PREFIX = 'as-needed' as const;

export interface SiteConfig {
  siteUrl: string;          // SITE_URL
  locales: readonly Locale[];
  defaultLocale: Locale;
  localePrefix: 'as-needed';
  brand: {
    name: string;           // 'Openletz'
    legalEntity: string;    // 'Commit Media S.à r.l. · RCS B276192 · Luxembourg'
    email: string;          // 'hello@openletz.ai'  (replaces bob@openletz.com)
    privacyEmail: string;   // 'privacy@openletz.ai'
    linkedin: string;       // LinkedIn sameAs URL
    logoPng: string;        // `${SITE_URL}/openletz-logo.png`
    logoSvg: string;        // `${SITE_URL}/openletz.svg`
  };
}

export const siteConfig: SiteConfig = {
  siteUrl: SITE_URL,
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: LOCALE_PREFIX,
  brand: {
    name: 'Openletz',
    legalEntity: 'Commit Media S.à r.l. · RCS B276192 · Luxembourg',
    email: 'hello@openletz.ai',
    privacyEmail: 'privacy@openletz.ai',
    linkedin: 'https://www.linkedin.com/company/commit-media', // confirm exact handle
    logoPng: `${SITE_URL}/openletz-logo.png`,
    logoSvg: `${SITE_URL}/openletz.svg`,
  },
};

/**
 * Canonical URL builder. EN (default) is unprefixed; fr/de are prefixed.
 * localeUrl('en')            -> 'https://openletz.ai'
 * localeUrl('en', '/work')   -> 'https://openletz.ai/work'
 * localeUrl('fr', '/work')   -> 'https://openletz.ai/fr/work'
 * localeUrl('de')            -> 'https://openletz.ai/de'
 */
export function localeUrl(locale: Locale, path = ''): string {
  const clean = path && !path.startsWith('/') ? `/${path}` : path;
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}${clean}` || SITE_URL;
}
```

---

### 2. Section discriminated union — `src/lib/schema.ts` (types) + `src/data/pages/home.ts` (data)

The homepage (and every page) is a `Section[]`. `type` is the discriminant. Each variant carries ONLY its own props. `SectionRenderer` switches on `type` with an exhaustive `never` default.

```ts
// src/lib/schema.ts  — TYPES (Zod schemas below in §4)
import type { ServiceKey, WorkItem, PriceTier } from '@/lib/schema'; // self-ref shown for clarity

export type SectionType =
  | 'hero'
  | 'proofStrip'
  | 'servicesGrid'
  | 'howWeWork'
  | 'selectedWork'
  | 'deeperProof'
  | 'trustBlock'
  | 'enquiryForm';
  // NOTE: no 'footer' — Nav/Footer/NewsletterForm are layout-level (Phase 1), not sections.

export interface HeroSectionProps {
  type: 'hero';
  h1: string;              // 'Websites that think, move & transact.'
  sub: string;             // 'A Luxembourg AI agency.'
  lead: string;            // STUDIO.welcomeLead
  primaryCta: { label: string; href: string };   // 'Start a project' -> '#enquiry' | '/contact'
  secondaryCta: { label: string; href: string }; // 'See our work' -> '/work'
}

export interface ProofStripSectionProps {
  type: 'proofStrip';
  label: string;           // 'Shipped & live'
  logos: ProofLogo[];      // wordmarks (real portfolio)
  metrics: ProofMetric[];  // defensible live-signal definitions (count-up)
}

export interface ServicesGridSectionProps {
  type: 'servicesGrid';
  // order significant: 01 ai (lead), 02 marketing, 03 web3
  order: ServiceKey[];     // ['ai','marketing','web3']
  ctaLabel: string;        // START_PROJECT (same CTA on all three)
  ctaHref: string;
}

export interface HowWeWorkSectionProps {
  type: 'howWeWork';
  steps: string[];         // SERVICES.ai.how (audit -> prototype -> live with numbers)
  smePackageNote: string;  // soft co-funding line
  stickyScroll?: boolean;  // true => the ONE optional GSAP set-piece (dynamic-import)
}

export interface SelectedWorkSectionProps {
  type: 'selectedWork';
  items: WorkItem[];       // WORK (6)
  viewAllHref: string;     // '/work'
}

export interface DeeperProofSectionProps {
  type: 'deeperProof';
  shippedCount: number;    // 6 (defensible)
  metrics: ProofMetric[];  // live Aleph metrics etc. — NEVER fabricate
  testimonials: Testimonial[]; // 1–3, may be empty until owner provides
}

export interface TrustBlockSectionProps {
  type: 'trustBlock';
  facts: string[];         // ABOUT.facts
  headline?: string;
}

export interface EnquiryFormSectionProps {
  type: 'enquiryForm';
  id: 'enquiry';           // anchor target for the CTA verb
  headline: string;        // CONTACT.lead
  pillars: string[];       // CONTACT.types ('AI automation' | 'Web3 / on-chain' | 'Website & growth' | 'Not sure yet')
  callLine: string;        // CONTACT.callLine
  bookCallHref: string;    // secondary 'Book a 15-minute intro call'
}

// NOTE: there is NO FooterSectionProps. The footer is layout-level (FOOTER data +
// Footer.tsx component, Phase 1). FooterColumn (below) is still used by FOOTER data.

export type Section =
  | HeroSectionProps
  | ProofStripSectionProps
  | ServicesGridSectionProps
  | HowWeWorkSectionProps
  | SelectedWorkSectionProps
  | DeeperProofSectionProps
  | TrustBlockSectionProps
  | EnquiryFormSectionProps;

// supporting shapes
export interface ProofLogo { slug: string; name: string; src: string; href: string; }
export interface ProofMetric { id: string; label: string; value: number | null; suffix?: string; live?: boolean; }
export interface Testimonial { quote: string; name: string; role: string; company: string; photo?: string; }
export interface FooterColumn { heading: string; links: { label: string; href: string }[]; }
```

`SectionRenderer` exhaustiveness contract:
```ts
// src/components/SectionRenderer.tsx
function assertNever(x: never): never { throw new Error(`Unhandled section: ${JSON.stringify(x)}`); }
// default: return assertNever(section);
```

---

### 3. Typed data-module export shapes — `src/data/*.ts`

Names are VERBATIM (ported from `osData.ts`). `ServiceKey` keeps the `'ai' | 'web3' | 'marketing'` keys (note `marketing` kicker reads "Growth" — preserve copy as-is). Locale union for hero is exactly `'en'|'fr'|'de'`.

```ts
// src/data/studio.ts
export interface Studio {
  name: string; tagline: string; sub: string; welcomeLead: string; hint: string;
}
export const STUDIO: Studio;

// src/data/services.ts
export type ServiceKey = 'ai' | 'web3' | 'marketing';
export interface ServiceData {
  kicker: string; title: string; lead: string;
  what: { t: string; d: string }[];
  how: string[];
  proof: string;
  footer?: string;            // ONLY 'ai'
}
export const SERVICES: Record<ServiceKey, ServiceData>;

// src/data/work.ts
export interface WorkItem {
  slug: string;   // vinsfins|lagrocerie|gategram|liberclaw|ophis|skillsws
  name: string; kind: string; link: string;
  blurb: string; about: string;
  did: string[]; stack: string[];
  tag?: 'ai' | 'web' | 'web3'; // ADDED for /work filter; map from kind
}
export const WORK: WorkItem[]; // length 6, order significant

// src/data/about.ts
export interface About {
  bioLead: string; founderName: string; founderRole: string;
  facts: string[];   // length 3
  entity: string;    // 'Commit Media S.à r.l. · RCS B276192 · Luxembourg'
}
export const ABOUT: About;

// src/data/contact.ts
export interface Contact {
  lead: string;      // 'Tell us what you want to build. We reply within one business day.'
  types: string[];   // 4: 'AI automation','Web3 / on-chain','Website & growth','Not sure yet'
  callLine: string;
}
export const CONTACT: Contact;

// src/data/pricing.ts
export type IconKey =
  | 'mac' | 'ai' | 'web3' | 'growth' | 'folder' | 'about' | 'mail' | 'doc'
  | 'drive' | 'disk' | 'price' | 'tools' | 'insights' | 'sketch' | 'snake';
export interface PriceTier {
  name: string; icon: IconKey;
  price: string;      // 'from €X' placeholder (NOT 'On request')
  desc: string; feats: string[]; // feats length 3
  highlight?: boolean;
}
export interface Pricing { lead: string; tiers: PriceTier[]; note: string; }
export const PRICING: Pricing; // 4 tiers

// src/data/hero-i18n.ts
import type { Locale } from '@/lib/site-config';
export interface Hero {
  tagline: string; sub: string; welcomeLead: string; hint: string;
  newProject: string; // CTA label, e.g. 'New Project ▸' / 'Nouveau projet ▸' / 'Neues Projekt ▸'
  seeWork: string;
}
export const HERO: Record<Locale, Hero>; // en aliases STUDIO; fr/de hardcoded literals (LB dropped)
export const LANGS: { code: Locale; flag: string; label: string }[]; // en/fr/de only
```

---

### 4. Zod schema names — `src/lib/schema.ts`

Each `*Schema` parses its data module at load (`STUDIO = StudioSchema.parse(raw)` pattern) so malformed content fails the build. UPPER-suffix `Schema`. Types via `z.infer`.

```ts
import { z } from 'zod';
import { LOCALES } from '@/lib/site-config';

export const LocaleSchema = z.enum(LOCALES); // ['en','fr','de']

export const StudioSchema = z.object({
  name: z.string().min(1), tagline: z.string().min(1), sub: z.string().min(1),
  welcomeLead: z.string().min(1), hint: z.string().min(1),
});

export const ServiceKeySchema = z.enum(['ai', 'web3', 'marketing']);
export const ServiceDataSchema = z.object({
  kicker: z.string(), title: z.string(), lead: z.string(),
  what: z.array(z.object({ t: z.string(), d: z.string() })),
  how: z.array(z.string()),
  proof: z.string(),
  footer: z.string().optional(),
});
export const ServicesSchema = z.record(ServiceKeySchema, ServiceDataSchema);

export const WorkItemSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(), kind: z.string(), link: z.string().url(),
  blurb: z.string(), about: z.string(),
  did: z.array(z.string()), stack: z.array(z.string()),
  tag: z.enum(['ai', 'web', 'web3']).optional(),
});
export const WorkSchema = z.array(WorkItemSchema).length(6);

export const AboutSchema = z.object({
  bioLead: z.string(), founderName: z.string(), founderRole: z.string(),
  facts: z.array(z.string()).length(3),
  entity: z.string(),
});

export const ContactDataSchema = z.object({
  lead: z.string(), types: z.array(z.string()).length(4), callLine: z.string(),
});

export const IconKeySchema = z.enum([
  'mac','ai','web3','growth','folder','about','mail','doc','drive','disk',
  'price','tools','insights','sketch','snake',
]);
export const PriceTierSchema = z.object({
  name: z.string(), icon: IconKeySchema, price: z.string(),
  desc: z.string(), feats: z.array(z.string()).length(3),
  highlight: z.boolean().optional(),
});
export const PricingSchema = z.object({
  lead: z.string(), tiers: z.array(PriceTierSchema).length(4), note: z.string(),
});

export const HeroSchema = z.object({
  tagline: z.string(), sub: z.string(), welcomeLead: z.string(), hint: z.string(),
  newProject: z.string(), seeWork: z.string(),
});
export const HeroI18nSchema = z.record(LocaleSchema, HeroSchema);

// ---- runtime payloads ----
export const ContactPayloadSchema = z.object({
  name: z.string().trim().min(1).max(500),
  email: z.string().trim().max(500).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  phone: z.string().trim().max(500).optional(),
  company: z.string().trim().max(500).optional(),
  companySize: z.enum(['solo', '1-10', '11-50', '51-250', '250+']).optional(),
  pillar: z.enum(['AI automation', 'Web3 / on-chain', 'Website & growth', 'Not sure yet']).optional(),
  budget: z.enum(['<5k', '5-15k', '15-50k', '50k+', 'unsure']).optional(),
  message: z.string().trim().max(2000).optional(),
});
export type ContactPayload = z.infer<typeof ContactPayloadSchema>;

export const NewsletterSchema = z.object({
  email: z.string().trim().max(500).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});
export type NewsletterPayload = z.infer<typeof NewsletterSchema>;
```

> **Migration note for `/api/contact`:** the salvaged route keeps `name`+`email` required, email regex, `MAX_FIELD=500`/`MAX_MESSAGE=2000` caps, 5/min rate-limit, the `data/contacts.json` append, and the fire-and-forget `sendNotification`. ONLY swap hand-rolled `sanitize` for `ContactPayloadSchema.safeParse`. New optional fields (`company`, `companySize`, `pillar`, `budget`) pass through to the notification payload as part of `message` context. 400 body stays `{error:'Name and email are required'}` / `{error:'Invalid email format'}` for parity.

---

### 5. Redirect map type — `src/lib/redirects.ts`

```ts
// src/lib/redirects.ts
import { SITE_URL } from '@/lib/site-config';

export interface Redirect {
  source: string;          // path or pattern (Next.js redirects() source)
  destination: string;     // path on openletz.ai (relative, host added by host-rules) OR absolute
  permanent: true;         // 301
  has?: { type: 'host'; value: string }[];  // host-canonicalization rules
}

// Host canonicalization: every non-apex host -> https://openletz.ai/:path*
export const HOST_REDIRECTS: Redirect[]; // openletz.com, www.openletz.com, www.openletz.ai,
                                         // openletz.fr, www.openletz.fr, openletz.info, www.openletz.info

// Per-URL legacy 301s (no soft-404, never blanket-to-home):
//  /aides, /aides/[slug](x6), /agents, /agents/[slug](x33), old /blog, old /blog/[slug](x7)
//  + dropped-locale folds: /{lb,pt,it,es,ru,ar,tr,uk}/* -> /* (en default)
export const LEGACY_REDIRECTS: Redirect[];

// One ranking cluster to preserve: AI-tool RGPD/DSGVO/DPA terms -> map to /insights or /about trust block.
```
`next.config.mjs` `redirects()` returns `[...HOST_REDIRECTS, ...LEGACY_REDIRECTS]`. `permanent: true` everywhere (301). No source may also be a destination host.

---

### 6. JSON-LD builders — `src/lib/jsonld.ts`

```ts
// src/lib/jsonld.ts  — pure object builders; rendering done in layout via safeJsonLd
import type { Locale } from '@/lib/site-config';

export function organizationJsonLd(): object;         // @id `${SITE_URL}/#organization` — KEEP
export function professionalServiceJsonLd(): object;  // @id `${SITE_URL}/#localbusiness` — KEEP
export function webSiteJsonLd(): object;              // @id `${SITE_URL}/#website` — REPLACES dropped WebApplication "Simulateur"
export function breadcrumbJsonLd(locale: Locale, items: { name: string; url: string }[]): object; // KEEP
export function faqJsonLd(faqs: { q: string; a: string }[]): object; // KEEP — agency FAQs from llms-full.txt (NOT grants)
```
DROPPED: `webAppJsonLd` ("Simulateur d'Aides Luxembourg") and `howToJsonLd` (grant-simulator framing). All `@id`/`url`/`email` use `openletz.ai`; logo = `siteConfig.brand.logoPng` (provide `/openletz-logo.png` or repoint to `openletz.svg`). Wrap output with existing `src/lib/safeJsonLd.ts`.

---

### 7. Motion tokens — `src/styles/tokens.css` (`:root`)

VERBATIM CSS var names + values. NO raw `ease`/ad-hoc durations anywhere in components — reference these vars only.

```css
:root {
  /* easing */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* default */
  --ease-fast: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* delight only */

  /* duration (keep ~everything < 300ms) */
  --dur-fast: 100ms;
  --dur-base: 200ms;
  --dur-slow: 300ms;

  /* stagger */
  --stagger: 40ms; /* word/line reveals 30–60ms range */
}

/* global kill-switch */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
`motion/react` reads these via CSS vars in `transition`. Scroll-driven/parallax/magnetic gated behind `@supports` + `(prefers-reduced-motion: no-preference)`. Reduced ≠ stripped — keep fades.

---

### 8. Monochrome palette — `src/styles/tokens.css` (`:root`)

VERBATIM. No accent color at launch. One reserved-but-unused accent token slot.

```css
:root {
  --bg: #0B0B0C;                       /* page base (near-black) */
  --surface: #141416;                  /* cards, raised surfaces */
  --surface-2: #1A1C1F;                /* nested surfaces, inputs */
  --text: #FAFAF7;                     /* primary text (off-white) */
  --text-dim: #A1A1A6;                 /* secondary text */
  --hairline: rgba(255, 255, 255, 0.10); /* rules, borders, dividers */
  --hot: #FFFFFF;                      /* "white-hot" — hover/active/emphasis (de-facto accent) */

  --accent: var(--hot);                /* RESERVED slot, == --hot at launch; swap one value if revisited */
}
```
`tailwind.config.js` maps theme colors to these vars (`bg`, `surface`, `surface-2`, `text`, `text-dim`, `hairline`, `hot`). Brand mark recolors off-white-on-near-black.

---

### 9. ContactPayload (request contract — client ⇄ `/api/contact`)

Defined in §4 (`ContactPayloadSchema` / `ContactPayload`). The `<EnquiryForm>` client island sends exactly this shape; the API parses with the same schema (single source). Responses unchanged from salvaged route: `200 {success:true}`, `400 {error}`, `429 {error:'Too many requests'}`.

---

## Conventions

### Test stack (decision)

No runner exists today (verified: no vitest/jest/playwright, no test script, no `*.test.*`). Therefore ADD:

- **Unit + component:** Vitest + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom` + `@vitejs/plugin-react`.
  - Config: `/Users/hodlmedia/forge/vitest.config.ts` (jsdom env, `setupFiles: ['./vitest.setup.ts']`, `@/`→`src` alias).
  - Setup: `/Users/hodlmedia/forge/vitest.setup.ts` (jest-dom, RTL cleanup, `matchMedia`/`IntersectionObserver` stubs).
- **E2E:** `@playwright/test`.
  - Config: `/Users/hodlmedia/forge/playwright.config.ts` (`use.baseURL: 'http://localhost:3030'`, `webServer` runs `PORT=3030 npm run dev`).

**Scripts to add to `package.json` (exact names drafters call):**
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"typecheck": "tsc --noEmit"
```

**Testing convention:**
- **TDD (failing → fail → impl → pass → commit)** for all LOGIC units: `site-config` (`localeUrl`, apex/no-www), `schema` (every Zod parse + reject), `redirects` (inversion + full legacy 301 coverage, no soft-404, no dup sources), `jsonld` (domain in `@id`/`url`/email), proof-strip fetch/cache (fallback "verified N min ago", never throws), contact validation (`ContactPayloadSchema`), i18n params (`generateStaticParams` returns the 3 locales).
- **Render / SSR / a11y / reduced-motion** tests for VISUAL components: SSR static HTML carries H1 + primary copy (AI-crawler requirement); LCP node renders at `opacity:1` (never animated from `opacity:0`); `prefers-reduced-motion: reduce` removes transforms but keeps fades; SectionRenderer renders every variant + exhaustiveness.
- **One manual verification step per page:** `PORT=3030 npm run dev`, open the page, confirm it renders and the primary CTA reaches the enquiry form. Run once with `prefers-reduced-motion` ON before declaring a page done.
- Place unit tests next to source as `*.test.ts(x)` or under `__tests__`; E2E under `/Users/hodlmedia/forge/e2e/*.spec.ts`.

### Commit convention

- **One git commit per task.** Each task ends green (its tests pass, typecheck clean) THEN commits.
- **Conventional Commits** style: `type(scope): subject`.
  - Types: `feat`, `fix`, `chore`, `refactor`, `style`, `test`, `docs`, `perf`, `build`.
  - Scopes mirror the area: `data`, `sections`, `ui`, `i18n`, `seo`, `redirects`, `tokens`, `api`, `config`.
  - Examples:
    - `chore(config): set SITE_URL to openletz.ai apex and collapse locales to en/fr/de`
    - `feat(data): port osData STUDIO/SERVICES/WORK to typed src/data modules with Zod`
    - `feat(sections): add HeroSection with SSR H1 and magnetic CTA`
    - `feat(redirects): invert .com→.ai and add per-URL legacy 301 map`
    - `test(schema): cover data parsing and malformed rejection`
- **NO AI attribution** (Commit Media preference): commits and PRs carry NO `Co-Authored-By: Claude`, NO "Generated with Claude Code", no AI mention anywhere. This OVERRIDES any default footer.
- Branch off `main`; never commit straight to `main` unless the user says so. Commit/push only when asked.


---

## Phase 0 — Decisions & cleanup (unblock)

### Task 0.1: Set up the test stack (Vitest + RTL + Playwright)

No test runner exists today (verified: no `vitest`/`jest`/`playwright`, no `test` script, no `*.test.*`). This task installs the unit/component runner (Vitest + Testing Library) and the E2E runner (Playwright), and adds their config + setup files, so every later TDD task has a `npm run test` to fail against. This is pure tooling — no app logic — so it ends with a config commit, not a TDD loop.

**Files:**
- Modify: `/Users/hodlmedia/forge/package.json` (add devDeps + scripts only; the rename + runtime deps land in Task 0.7)
- Create: `/Users/hodlmedia/forge/vitest.config.ts`
- Create: `/Users/hodlmedia/forge/vitest.setup.ts`
- Create: `/Users/hodlmedia/forge/playwright.config.ts`
- Create: `/Users/hodlmedia/forge/e2e/.gitkeep`

- [ ] **Step 1: Install the test devDependencies.** Run from the repo root:
```bash
cd /Users/hodlmedia/forge && npm install -D \
  vitest@^3 \
  @vitejs/plugin-react@^4 \
  @testing-library/react@^16 \
  @testing-library/jest-dom@^6 \
  @testing-library/user-event@^14 \
  jsdom@^25 \
  @playwright/test@^1
```
Expected output: npm prints `added N packages` and updates `devDependencies` in `package.json` + `package-lock.json`. No errors.

- [ ] **Step 2: Download the Playwright browser binary used by E2E.** Run:
```bash
cd /Users/hodlmedia/forge && npx playwright install chromium
```
Expected output: `chromium` (and its headless shell) downloaded; ends with a success line. (Network access required; if offline, note the binary must be installed before any `npm run test:e2e`.)

- [ ] **Step 3: Add the test/typecheck scripts to `package.json`.** Open `/Users/hodlmedia/forge/package.json` and replace the `"scripts"` block so it reads exactly:
```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "typecheck": "tsc --noEmit",
    "seo:indexnow": "node scripts/indexnow-ping.mjs"
  },
```

- [ ] **Step 4: Create the Vitest config.** Write `/Users/hodlmedia/forge/vitest.config.ts` with exactly:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    css: false,
  },
});
```

- [ ] **Step 5: Create the Vitest setup file.** Write `/Users/hodlmedia/forge/vitest.setup.ts` with exactly:
```ts
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom has no matchMedia; reduced-motion + responsive code reads it.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// jsdom has no IntersectionObserver; reveal/count-up islands observe.
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  class MockIntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }
  // @ts-expect-error -- assigning a test double to the global
  window.IntersectionObserver = MockIntersectionObserver;
  // @ts-expect-error -- mirror onto globalThis for non-window consumers
  globalThis.IntersectionObserver = MockIntersectionObserver;
}
```

- [ ] **Step 6: Create the Playwright config.** Write `/Users/hodlmedia/forge/playwright.config.ts` with exactly:
```ts
import { defineConfig, devices } from '@playwright/test';

const PORT = 3030;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `PORT=${PORT} npm run dev`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 7: Keep the empty e2e dir tracked.** Write `/Users/hodlmedia/forge/e2e/.gitkeep` with exactly:
```
# E2E specs live here (home.spec.ts, i18n.spec.ts, reduced-motion.spec.ts). Added in later phases.
```

- [ ] **Step 8: Prove the runner boots with zero tests.** Run:
```bash
cd /Users/hodlmedia/forge && npm run test
```
Expected output: Vitest reports `No test files found, exiting with code 0` (zero failures — the runner is wired correctly). If it errors on config resolution, fix the config before continuing.

- [ ] **Step 9: Commit.**
```bash
cd /Users/hodlmedia/forge && git add package.json package-lock.json vitest.config.ts vitest.setup.ts playwright.config.ts e2e/.gitkeep && git commit -m "build(config): add Vitest + Testing Library + Playwright test stack"
```

---

### Task 0.2: Create `src/lib/site-config.ts` (TDD)

The single source of truth for the canonical host and locale set. Replaces the 10 duplicated `https://www.openletz.com` literals and the `defaultLocale: 'fr'` scattered across the repo. This is a logic unit (`localeUrl` builder + constants) so it is built test-first per the contract.

**Files:**
- Test: `/Users/hodlmedia/forge/src/lib/site-config.test.ts`
- Create: `/Users/hodlmedia/forge/src/lib/site-config.ts`

- [ ] **Step 1: Write the failing test.** Write `/Users/hodlmedia/forge/src/lib/site-config.test.ts` with exactly:
```ts
import { describe, it, expect } from 'vitest';
import {
  SITE_URL,
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_PREFIX,
  siteConfig,
  localeUrl,
} from './site-config';

describe('SITE_URL', () => {
  it('is the apex .ai host with https, no www, no trailing slash', () => {
    expect(SITE_URL).toBe('https://openletz.ai');
    expect(SITE_URL).not.toMatch(/www\./);
    expect(SITE_URL).not.toMatch(/\.com/);
    expect(SITE_URL.endsWith('/')).toBe(false);
  });
});

describe('locales', () => {
  it('is exactly en, fr, de', () => {
    expect([...LOCALES]).toEqual(['en', 'fr', 'de']);
  });
  it('defaults to en', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(LOCALES).toContain(DEFAULT_LOCALE);
  });
  it('uses as-needed prefixing', () => {
    expect(LOCALE_PREFIX).toBe('as-needed');
  });
});

describe('siteConfig brand', () => {
  it('uses openletz.ai email + apex logo paths and the legal entity', () => {
    expect(siteConfig.brand.name).toBe('Openletz');
    expect(siteConfig.brand.email).toBe('hello@openletz.ai');
    expect(siteConfig.brand.privacyEmail).toBe('privacy@openletz.ai');
    expect(siteConfig.brand.legalEntity).toContain('B276192');
    expect(siteConfig.brand.logoPng).toBe('https://openletz.ai/openletz-logo.png');
    expect(siteConfig.brand.logoSvg).toBe('https://openletz.ai/openletz.svg');
    expect(siteConfig.brand.email).not.toMatch(/openletz\.com/);
  });
});

describe('localeUrl', () => {
  it('returns the bare apex for the default locale with no path', () => {
    expect(localeUrl('en')).toBe('https://openletz.ai');
  });
  it('appends a path for the default locale without a prefix', () => {
    expect(localeUrl('en', '/work')).toBe('https://openletz.ai/work');
  });
  it('prefixes non-default locales', () => {
    expect(localeUrl('fr', '/work')).toBe('https://openletz.ai/fr/work');
    expect(localeUrl('de')).toBe('https://openletz.ai/de');
  });
  it('normalizes a path missing its leading slash', () => {
    expect(localeUrl('en', 'work')).toBe('https://openletz.ai/work');
  });
});
```

- [ ] **Step 2: Run the test and watch it fail.** Run:
```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/site-config.test.ts
```
Expected: FAIL — Vitest cannot resolve `./site-config` (module does not exist yet). This confirms the test runs and the impl is missing.

- [ ] **Step 3: Implement `site-config.ts`.** Write `/Users/hodlmedia/forge/src/lib/site-config.ts` with exactly:
```ts
export const SITE_URL = 'https://openletz.ai' as const; // apex, no www, no trailing slash

export const LOCALES = ['en', 'fr', 'de'] as const;
export type Locale = (typeof LOCALES)[number]; // 'en' | 'fr' | 'de'

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_PREFIX = 'as-needed' as const;

export interface SiteConfig {
  siteUrl: string;
  locales: readonly Locale[];
  defaultLocale: Locale;
  localePrefix: 'as-needed';
  brand: {
    name: string;
    legalEntity: string;
    email: string;
    privacyEmail: string;
    linkedin: string;
    logoPng: string;
    logoSvg: string;
  };
}

export const siteConfig: SiteConfig = {
  siteUrl: SITE_URL,
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: LOCALE_PREFIX,
  brand: {
    name: 'Openletz',
    legalEntity: 'Commit Media S.à r.l. · RCS B276192 · Luxembourg',
    email: 'hello@openletz.ai',
    privacyEmail: 'privacy@openletz.ai',
    linkedin: 'https://www.linkedin.com/company/commit-media', // OWNER: confirm exact handle
    logoPng: `${SITE_URL}/openletz-logo.png`,
    logoSvg: `${SITE_URL}/openletz.svg`,
  },
};

/**
 * Canonical URL builder. EN (default) is unprefixed; fr/de are prefixed.
 * localeUrl('en')          -> 'https://openletz.ai'
 * localeUrl('en', '/work') -> 'https://openletz.ai/work'
 * localeUrl('fr', '/work') -> 'https://openletz.ai/fr/work'
 * localeUrl('de')          -> 'https://openletz.ai/de'
 */
export function localeUrl(locale: Locale, path = ''): string {
  const clean = path && !path.startsWith('/') ? `/${path}` : path;
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}${clean}` || SITE_URL;
}
```

- [ ] **Step 4: Run the test and watch it pass.** Run:
```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/site-config.test.ts
```
Expected: PASS — all assertions green (1 file, all tests passing).

- [ ] **Step 5: Commit.**
```bash
cd /Users/hodlmedia/forge && git add src/lib/site-config.ts src/lib/site-config.test.ts && git commit -m "feat(config): add site-config single source of truth for openletz.ai apex + en/fr/de"
```

---

### Task 0.3: Invert redirects to `.com → .ai` apex, prune dead apex rules, test them

Today `next.config.mjs` wrongly 301s `openletz.ai → www.openletz.com` and points every host at `www.openletz.com`. This task creates the typed `src/lib/redirects.ts` host-canonicalization map (apex `.ai` as the only destination), prunes the dead apex-domain redirects, and wires `next.config.mjs` to consume it. The per-URL legacy 301 map (`/aides`, `/agents`, dropped-locale folds) is the contract's `LEGACY_REDIRECTS` — this task stubs it as an exported empty-typed array with the `HOST_REDIRECTS` populated; Phase 2 fills the per-URL entries when the legacy URLs are actually deleted. The redirect rules are logic, so they are tested first.

**Files:**
- Test: `/Users/hodlmedia/forge/src/lib/redirects.test.ts`
- Create: `/Users/hodlmedia/forge/src/lib/redirects.ts`
- Modify: `/Users/hodlmedia/forge/next.config.mjs`

- [ ] **Step 1: Write the failing test.** Write `/Users/hodlmedia/forge/src/lib/redirects.test.ts` with exactly:
```ts
import { describe, it, expect } from 'vitest';
import { HOST_REDIRECTS, LEGACY_REDIRECTS, allRedirects } from './redirects';
import { SITE_URL } from './site-config';

describe('HOST_REDIRECTS', () => {
  it('canonicalizes every non-apex host to the openletz.ai apex', () => {
    for (const r of HOST_REDIRECTS) {
      expect(r.destination.startsWith(SITE_URL)).toBe(true);
      expect(r.permanent).toBe(true);
      expect(r.has?.[0]?.type).toBe('host');
    }
  });

  it('inverts the old .com rule: .com is a SOURCE host, never a destination', () => {
    const sources = HOST_REDIRECTS.map((r) => r.has?.[0]?.value);
    expect(sources).toContain('openletz.com');
    expect(sources).toContain('www.openletz.com');
    for (const r of HOST_REDIRECTS) {
      expect(r.destination).not.toMatch(/openletz\.com/);
      expect(r.destination).not.toMatch(/www\.openletz\.ai/);
    }
  });

  it('redirects www.openletz.ai to the apex', () => {
    const sources = HOST_REDIRECTS.map((r) => r.has?.[0]?.value);
    expect(sources).toContain('www.openletz.ai');
  });

  it('never lists the apex openletz.ai as a source host (no self-redirect loop)', () => {
    const sources = HOST_REDIRECTS.map((r) => r.has?.[0]?.value);
    expect(sources).not.toContain('openletz.ai');
  });

  it('has no duplicate source hosts', () => {
    const sources = HOST_REDIRECTS.map((r) => r.has?.[0]?.value);
    expect(new Set(sources).size).toBe(sources.length);
  });
});

describe('LEGACY_REDIRECTS', () => {
  it('is a typed array (per-URL 301s populated in Phase 2)', () => {
    expect(Array.isArray(LEGACY_REDIRECTS)).toBe(true);
    for (const r of LEGACY_REDIRECTS) {
      expect(r.permanent).toBe(true);
      expect(r.destination).not.toBe('/'); // never blanket-redirect a deep URL to home
    }
  });

  it('has no source that is also a host destination', () => {
    const legacySources = LEGACY_REDIRECTS.map((r) => r.source);
    for (const src of legacySources) {
      expect(src).not.toMatch(/openletz\.(com|ai)/);
    }
  });
});

describe('allRedirects', () => {
  it('concatenates host rules then legacy rules', () => {
    expect(allRedirects()).toEqual([...HOST_REDIRECTS, ...LEGACY_REDIRECTS]);
  });
});
```

- [ ] **Step 2: Run the test and watch it fail.** Run:
```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/redirects.test.ts
```
Expected: FAIL — cannot resolve `./redirects` (module missing).

- [ ] **Step 3: Implement `redirects.ts`.** Write `/Users/hodlmedia/forge/src/lib/redirects.ts` with exactly:
```ts
import { SITE_URL } from '@/lib/site-config';

export interface Redirect {
  source: string;
  destination: string;
  permanent: true; // 301
  has?: { type: 'host'; value: string }[];
}

/**
 * Host canonicalization. Every non-apex host -> https://openletz.ai/:path*.
 * Inverts the legacy rule (which 301'd .ai -> www.openletz.com). The apex
 * `openletz.ai` is intentionally absent as a source to avoid a redirect loop.
 */
export const HOST_REDIRECTS: Redirect[] = [
  'openletz.com',
  'www.openletz.com',
  'www.openletz.ai',
  'openletz.fr',
  'www.openletz.fr',
  'openletz.info',
  'www.openletz.info',
].map((host) => ({
  source: '/:path*',
  has: [{ type: 'host', value: host }],
  destination: `${SITE_URL}/:path*`,
  permanent: true,
}));

/**
 * Per-URL legacy 301s. Populated in Phase 2 when the legacy routes
 * (/aides, /aides/[slug], /agents, /agents/[slug], old /blog, old /blog/[slug])
 * and the dropped-locale folds (/{lb,pt,it,es,ru,ar,tr,uk}/* -> /*) are deleted.
 * Each entry maps to a real new equivalent — NEVER a blanket redirect to home.
 */
export const LEGACY_REDIRECTS: Redirect[] = [];

/** next.config.mjs redirects() returns this: host rules first, then per-URL. */
export function allRedirects(): Redirect[] {
  return [...HOST_REDIRECTS, ...LEGACY_REDIRECTS];
}
```

- [ ] **Step 4: Run the test and watch it pass.** Run:
```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/redirects.test.ts
```
Expected: PASS — all assertions green.

- [ ] **Step 5: Rewrite `next.config.mjs` to consume the map and enable cacheComponents.** The config is `.mjs` so it imports the compiled JS path alias indirectly; Next.js config is loaded with esbuild and cannot use the `@/` alias, so import via a relative path. Replace the entire contents of `/Users/hodlmedia/forge/next.config.mjs` with exactly:
```mjs
import createNextIntlPlugin from 'next-intl/plugin';
import { allRedirects } from './src/lib/redirects.ts';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    cacheComponents: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), browsing-topics=(), interest-cohort=(), idle-detection=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com",
              "frame-src 'self' https://www.googletagmanager.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/.well-known/api-catalog', destination: '/api/well-known/api-catalog' },
      { source: '/.well-known/openapi.yaml', destination: '/api/well-known/openapi' },
    ];
  },
  async redirects() {
    return allRedirects();
  },
};

export default withNextIntl(nextConfig);
```
Note: this drops the old `/blog` and `/aides` shortcut redirects (their targets are deleted in this phase). The `/blog` and `/insights` short-URL aliases are re-added to `LEGACY_REDIRECTS` in Phase 2/3 against the real new routes.

- [ ] **Step 6: Verify Next can load the new config.** Run a non-interactive sanity load by starting and immediately killing dev, or just confirm config syntax by running the typecheck-free config parse:
```bash
cd /Users/hodlmedia/forge && timeout 60 npx next build --no-lint 2>&1 | head -30 || true
```
Expected: the build begins (config + redirects load without throwing). The full green build is asserted in Task 0.10; here we only need the config to parse and the redirects import to resolve. If you see `Cannot find module './src/lib/redirects.ts'` or a redirects() error, fix before continuing. (If `--no-lint` is unsupported by this Next version, run `npx next build` instead.)

- [ ] **Step 7: Commit.**
```bash
cd /Users/hodlmedia/forge && git add src/lib/redirects.ts src/lib/redirects.test.ts next.config.mjs && git commit -m "feat(redirects): invert host canonicalization to openletz.ai apex and prune dead apex rules"
```

---

### Task 0.4: Replace every hardcoded `www.openletz.com` / local `SITE_URL` with `site-config`

Eleven source files plus `robots.txt` carry the literal `https://www.openletz.com` or a file-local `const SITE_URL`. This task repoints them all at `site-config.ts` so there is one host. `locale-url.ts` is collapsed into a re-export of the canonical `localeUrl`. Files that are scheduled for deletion later in this phase (the `/aides`, `/agents`, `/blog` legacy routes, `Results.tsx`) are deliberately SKIPPED here — there is no point editing a file we delete in Tasks 0.5–0.6.

This is a mechanical replacement across many files; correctness is proven by a grep assertion (no surviving `.com` literal in the surviving files) plus the existing `site-config.test.ts` already guaranteeing the host shape. It ends with a `git grep` verification step rather than a new unit test.

**Files:**
- Modify: `/Users/hodlmedia/forge/src/lib/locale-url.ts`
- Modify: `/Users/hodlmedia/forge/src/app/[locale]/layout.tsx`
- Modify: `/Users/hodlmedia/forge/src/app/[locale]/clients/layout.tsx`
- Modify: `/Users/hodlmedia/forge/src/app/[locale]/terms/page.tsx`
- Modify: `/Users/hodlmedia/forge/src/app/[locale]/privacy/page.tsx`
- Modify: `/Users/hodlmedia/forge/src/components/BreadcrumbJsonLd.tsx`
- Modify: `/Users/hodlmedia/forge/src/app/api/well-known/openapi/route.ts`
- Modify: `/Users/hodlmedia/forge/src/app/api/well-known/api-catalog/route.ts`
- Modify: `/Users/hodlmedia/forge/src/app/api/md/[[...slug]]/route.ts`
- Modify: `/Users/hodlmedia/forge/public/robots.txt`
- (Skipped — deleted later this phase: `aides/page.tsx`, `aides/[slug]/page.tsx`, `agents/[slug]/layout.tsx`, `blog/layout.tsx`, `blog/[slug]/page.tsx`, `Results.tsx`)

- [ ] **Step 1: Collapse `locale-url.ts` into a re-export of the canonical builder.** Replace the entire contents of `/Users/hodlmedia/forge/src/lib/locale-url.ts` with exactly:
```ts
// Back-compat shim: the canonical builder now lives in site-config.ts.
// Existing imports of `localeUrl` from '@/lib/locale-url' keep working.
export { localeUrl, SITE_URL } from '@/lib/site-config';
```

- [ ] **Step 2: Repoint the file-local `SITE_URL` in `[locale]/layout.tsx`.** In `/Users/hodlmedia/forge/src/app/[locale]/layout.tsx`, find the line:
```ts
const SITE_URL = 'https://www.openletz.com';
```
and replace it with:
```ts
import { SITE_URL } from '@/lib/site-config';
```
If an `import { localeUrl } from '@/lib/locale-url';` line already exists, leave it (the shim re-exports the same value). Then update the two contact emails: replace both occurrences of `'bob@openletz.com'` with `'hello@openletz.ai'`. (The dropped WebApplication "Simulateur" and HowTo JSON-LD blocks are removed in Phase 1 when the layout is rebuilt — leave them for now so the file still compiles; only the host/email change here.)

- [ ] **Step 3: Repoint `clients/layout.tsx`.** In `/Users/hodlmedia/forge/src/app/[locale]/clients/layout.tsx`, replace the file-local `const SITE_URL = 'https://www.openletz.com';` declaration with:
```ts
import { SITE_URL } from '@/lib/site-config';
```
(If the import collides with an existing import block, place it among the other top-of-file imports and delete only the `const SITE_URL = ...` line.)

- [ ] **Step 4: Repoint `terms/page.tsx` and `privacy/page.tsx`.** In each of `/Users/hodlmedia/forge/src/app/[locale]/terms/page.tsx` and `/Users/hodlmedia/forge/src/app/[locale]/privacy/page.tsx`, replace every literal `https://www.openletz.com` with `https://openletz.ai`, and replace any `@openletz.com` email with `privacy@openletz.ai`. Use a scoped sed per file:
```bash
cd /Users/hodlmedia/forge && \
  sed -i '' 's#https://www\.openletz\.com#https://openletz.ai#g; s#[A-Za-z0-9._%+-]*@openletz\.com#privacy@openletz.ai#g' \
  "src/app/[locale]/terms/page.tsx" "src/app/[locale]/privacy/page.tsx"
```
Expected: no output (in-place edit). Verify visually with `git diff -- "src/app/[locale]/terms/page.tsx"` that only host/email strings changed.

- [ ] **Step 5: Repoint `BreadcrumbJsonLd.tsx`.** In `/Users/hodlmedia/forge/src/components/BreadcrumbJsonLd.tsx`, if it defines a file-local base URL constant, replace it with an import:
```ts
import { SITE_URL } from '@/lib/site-config';
```
and delete the local `https://www.openletz.com` literal/const. If the literal is inline, replace `https://www.openletz.com` with `` `${SITE_URL}` `` (or the bare `SITE_URL` constant) so there is no hardcoded host.

- [ ] **Step 6: Repoint the three API routes.** For each of `/Users/hodlmedia/forge/src/app/api/well-known/openapi/route.ts`, `/Users/hodlmedia/forge/src/app/api/well-known/api-catalog/route.ts`, and `/Users/hodlmedia/forge/src/app/api/md/[[...slug]]/route.ts`: add `import { SITE_URL } from '@/lib/site-config';` to the top import block and replace each `https://www.openletz.com` literal with the `SITE_URL` constant (interpolating where it is inside a template/string). Apply the host swap mechanically, then convert each remaining bare literal to use the import:
```bash
cd /Users/hodlmedia/forge && \
  sed -i '' 's#https://www\.openletz\.com#https://openletz.ai#g' \
  "src/app/api/well-known/openapi/route.ts" \
  "src/app/api/well-known/api-catalog/route.ts" \
  "src/app/api/md/[[...slug]]/route.ts"
```
Then, where the contract requires importing the constant (api-catalog and md routes per `00-structure.md`), add the `import { SITE_URL } from '@/lib/site-config';` line and replace the now-`https://openletz.ai` literals with `${SITE_URL}` interpolation so the host stays single-sourced. Confirm each file still has a valid import and compiles.

- [ ] **Step 7: Repoint `robots.txt`.** In `/Users/hodlmedia/forge/public/robots.txt`, replace every `https://www.openletz.com` (the header comment and the `Sitemap:` line) with `https://openletz.ai`:
```bash
cd /Users/hodlmedia/forge && sed -i '' 's#https://www\.openletz\.com#https://openletz.ai#g' public/robots.txt
```
Expected: the `# OpenLetz — https://openletz.ai` header and `Sitemap: https://openletz.ai/sitemap.xml` line now read the apex. (The per-bot allowlist stays; full robots rebuild is Phase 1.)

- [ ] **Step 8: Verify no surviving `.com` host or `bob@` email in the files we kept.** Run:
```bash
cd /Users/hodlmedia/forge && git grep -n "www\.openletz\.com\|bob@openletz\.com" -- \
  "src/lib/locale-url.ts" \
  "src/app/[locale]/layout.tsx" \
  "src/app/[locale]/clients/layout.tsx" \
  "src/app/[locale]/terms/page.tsx" \
  "src/app/[locale]/privacy/page.tsx" \
  "src/components/BreadcrumbJsonLd.tsx" \
  "src/app/api/well-known/openapi/route.ts" \
  "src/app/api/well-known/api-catalog/route.ts" \
  "src/app/api/md/[[...slug]]/route.ts" \
  public/robots.txt \
  ; echo "exit: $?"
```
Expected: NO matches and `exit: 1` (git grep exits 1 when nothing matches) — every kept file is clean. Files still containing `.com` are the to-be-deleted legacy routes, which is fine.

- [ ] **Step 9: Run the site-config tests (regression guard) and the redirects tests.**
```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/site-config.test.ts src/lib/redirects.test.ts
```
Expected: PASS — both suites green (the host constant is unchanged; this is a smoke check).

- [ ] **Step 10: Commit.**
```bash
cd /Users/hodlmedia/forge && git add src/lib/locale-url.ts "src/app/[locale]/layout.tsx" "src/app/[locale]/clients/layout.tsx" "src/app/[locale]/terms/page.tsx" "src/app/[locale]/privacy/page.tsx" src/components/BreadcrumbJsonLd.tsx "src/app/api/well-known/openapi/route.ts" "src/app/api/well-known/api-catalog/route.ts" "src/app/api/md/[[...slug]]/route.ts" public/robots.txt && git commit -m "refactor(seo): single-source the canonical host from site-config and fix contact email"
```

---

### Task 0.5: Delete the Aqua OS shell, Sketch/Snake, `src/app/os/*`, and CrawlableContent

The OS desktop metaphor is scrapped per the spec. This task deletes every OS-furniture file from the kill list, the two OS toy apps, the standalone `/os` route (including `os.css`), and the SSR-hack `CrawlableContent.tsx`. `osData.ts` and `osI18n.ts` are EXPLICITLY KEPT here — they are the content source-of-truth ported to `src/data/*` in Phase 1, then deleted there. The OS-route exclusion is also removed from `proxy.ts`. This is a deletion task; correctness = "the files are gone and `git grep` finds no surviving import of them in kept files."

**Files:**
- Delete: `/Users/hodlmedia/forge/src/components/os/OpenletzOS.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/os/MacWindow.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/os/MenuBar.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/os/Dock.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/os/DesktopIcon.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/os/windows.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/os/aquaIcons.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/os/icons.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/os/CrawlableContent.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/os/apps/Sketch.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/os/apps/Snake.tsx`
- Delete: `/Users/hodlmedia/forge/src/app/os/page.tsx`
- Delete: `/Users/hodlmedia/forge/src/app/os/layout.tsx`
- Delete: `/Users/hodlmedia/forge/src/app/os/os.css`
- Modify: `/Users/hodlmedia/forge/src/proxy.ts` (drop the `os` exclusion from the matcher)
- (KEEP: `/Users/hodlmedia/forge/src/components/os/osData.ts`, `/Users/hodlmedia/forge/src/components/os/osI18n.ts` — ported & deleted in Phase 1)

- [ ] **Step 1: Delete the OS shell components, toy apps, and the `/os` route.** Run:
```bash
cd /Users/hodlmedia/forge && git rm \
  src/components/os/OpenletzOS.tsx \
  src/components/os/MacWindow.tsx \
  src/components/os/MenuBar.tsx \
  src/components/os/Dock.tsx \
  src/components/os/DesktopIcon.tsx \
  src/components/os/windows.tsx \
  src/components/os/aquaIcons.tsx \
  src/components/os/icons.tsx \
  src/components/os/CrawlableContent.tsx \
  src/components/os/apps/Sketch.tsx \
  src/components/os/apps/Snake.tsx \
  src/app/os/page.tsx \
  src/app/os/layout.tsx \
  src/app/os/os.css
```
Expected: git prints `rm '...'` for each of the 14 paths. If `git rm` reports a path is untracked, use `rm -f` for that single path instead.

- [ ] **Step 2: Confirm the `apps/` dir and `/os` route dir are empty/gone.** Run:
```bash
cd /Users/hodlmedia/forge && rmdir src/components/os/apps src/app/os 2>/dev/null; ls src/app/os 2>&1 | head -1; ls src/components/os
```
Expected: `ls src/app/os` errors with "No such file or directory" (route dir gone), and `ls src/components/os` shows ONLY `osData.ts` and `osI18n.ts` remaining.

- [ ] **Step 3: Remove the `os` exclusion from the proxy matcher.** In `/Users/hodlmedia/forge/src/proxy.ts`, replace the matcher block. Change:
```ts
  matcher: [
    // `os` = the standalone Openletz OS prototype route (no i18n); keep it out
    // of the next-intl locale rewrite so /os resolves to app/os directly.
    '/((?!api|admin|os|_next|_vercel|.*\\..*).*)',
  ],
```
to:
```ts
  matcher: [
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
```

- [ ] **Step 4: Verify nothing kept still imports a deleted OS file.** Run:
```bash
cd /Users/hodlmedia/forge && git grep -nE "components/os/(OpenletzOS|MacWindow|MenuBar|Dock|DesktopIcon|windows|aquaIcons|icons|CrawlableContent|apps/Sketch|apps/Snake)|app/os" -- src/ ; echo "exit: $?"
```
Expected: NO matches and `exit: 1`. If any surviving file imports a deleted module, that file is itself slated for deletion in Task 0.6 (verify it is, or remove the import). Note `osData`/`osI18n` references are fine and expected to remain.

- [ ] **Step 5: Commit.**
```bash
cd /Users/hodlmedia/forge && git add -A src/components/os src/app proxy.ts src/proxy.ts 2>/dev/null; git add -A && git commit -m "refactor(cleanup): delete Aqua OS shell, Sketch/Snake, /os route and CrawlableContent"
```

---

### Task 0.6: Delete grants routes, the agents directory, the surplus locale messages, and quiz UI

This task removes the grants era (`/aides`, `programs.ts`, `eligibility.ts`), the 140KB AI-tools directory (`agents.ts`, `/agents`), the 8 surplus locale message files, the grants-era MDX posts, and the quiz/results UI components. Because `sitemap.ts` imports `AGENTS` and `PROGRAMS` (now deleted), it is reduced to a minimal stub here so the build stays green; Phase 2 rebuilds it from the new IA. The blog route + `blog.ts` are kept (salvaged pipeline); only the grants posts are removed.

**Files:**
- Delete: `/Users/hodlmedia/forge/src/app/[locale]/aides/page.tsx`
- Delete: `/Users/hodlmedia/forge/src/app/[locale]/aides/[slug]/page.tsx`
- Delete: `/Users/hodlmedia/forge/src/lib/programs.ts`
- Delete: `/Users/hodlmedia/forge/src/lib/eligibility.ts`
- Delete: `/Users/hodlmedia/forge/src/lib/agents.ts`
- Delete: `/Users/hodlmedia/forge/src/app/[locale]/agents/page.tsx`
- Delete: `/Users/hodlmedia/forge/src/app/[locale]/agents/layout.tsx`
- Delete: `/Users/hodlmedia/forge/src/app/[locale]/agents/[slug]/page.tsx`
- Delete: `/Users/hodlmedia/forge/src/app/[locale]/agents/[slug]/layout.tsx`
- Delete: `/Users/hodlmedia/forge/messages/it.json`, `es.json`, `ru.json`, `ar.json`, `tr.json`, `uk.json`, `pt.json`, `lb.json`
- Delete: all 7 `/Users/hodlmedia/forge/content/blog/*.mdx`
- Delete: `/Users/hodlmedia/forge/src/components/Results.tsx`
- Delete: `/Users/hodlmedia/forge/src/components/Quiz.tsx`
- Delete (quiz/grants UI, if still present): `/Users/hodlmedia/forge/src/components/LandingPage.tsx`, `/Users/hodlmedia/forge/src/components/Directory.tsx`, `/Users/hodlmedia/forge/src/components/AgentContact.tsx`, `/Users/hodlmedia/forge/src/components/AgentLogo.tsx`
- Modify: `/Users/hodlmedia/forge/src/app/sitemap.ts` (stub to a minimal static-paths sitemap; full rebuild in Phase 2)

- [ ] **Step 1: Delete grants routes + grants/agents libs.** Run:
```bash
cd /Users/hodlmedia/forge && git rm -r \
  "src/app/[locale]/aides" \
  "src/app/[locale]/agents" \
  src/lib/programs.ts \
  src/lib/eligibility.ts \
  src/lib/agents.ts
```
Expected: git prints `rm '...'` for the two route trees and the three lib files.

- [ ] **Step 2: Delete the 8 surplus locale message files.** Run:
```bash
cd /Users/hodlmedia/forge && git rm \
  messages/it.json messages/es.json messages/ru.json messages/ar.json \
  messages/tr.json messages/uk.json messages/pt.json messages/lb.json
```
Expected: 8 `rm` lines. Then confirm only en/fr/de remain:
```bash
cd /Users/hodlmedia/forge && ls messages/
```
Expected: exactly `de.json  en.json  fr.json`.

- [ ] **Step 3: Delete the 7 grants-era blog posts.** Run:
```bash
cd /Users/hodlmedia/forge && git rm content/blog/*.mdx && ls content/blog 2>&1 | head -1
```
Expected: 7 `rm` lines; `ls content/blog` shows an empty directory (or "No such file"). The `content/blog/` directory itself may be kept empty for the salvaged pipeline; owner adds new posts in Phase 3.

- [ ] **Step 4: Delete the quiz/grants UI components.** Run (the `-f` ignores any path already gone):
```bash
cd /Users/hodlmedia/forge && git rm -f \
  src/components/Results.tsx \
  src/components/Quiz.tsx \
  src/components/LandingPage.tsx \
  src/components/Directory.tsx \
  src/components/AgentContact.tsx \
  src/components/AgentLogo.tsx 2>/dev/null || true
```
Then confirm they are gone:
```bash
cd /Users/hodlmedia/forge && ls src/components/ | grep -E "Results|Quiz|LandingPage|Directory|AgentContact|AgentLogo" ; echo "exit: $?"
```
Expected: NO matches and `exit: 1`.

- [ ] **Step 5: Stub `sitemap.ts` so the build does not import the deleted `AGENTS`/`PROGRAMS`.** Replace the entire contents of `/Users/hodlmedia/forge/src/app/sitemap.ts` with exactly (full rebuild from the new IA happens in Phase 2):
```ts
import type { MetadataRoute } from 'next';
import { localeUrl } from '@/lib/site-config';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/site-config';

// Phase-0 minimal sitemap. The grants/agents-driven entries were deleted with
// programs.ts/agents.ts. Phase 2 rebuilds this from the new IA (/work, /about,
// /contact, /services, /pricing, /insights, legal) and the WORK/ posts data.
function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = localeUrl(locale, path);
  }
  languages['x-default'] = localeUrl(DEFAULT_LOCALE, path);
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();
  const staticPaths = [
    { path: '', priority: 1.0, freq: 'weekly' as const },
    { path: '/about', priority: 0.6, freq: 'monthly' as const },
    { path: '/contact', priority: 0.7, freq: 'monthly' as const },
    { path: '/legal/privacy', priority: 0.3, freq: 'yearly' as const },
    { path: '/legal/terms', priority: 0.3, freq: 'yearly' as const },
  ];

  const pages: MetadataRoute.Sitemap = [];
  for (const { path, priority, freq } of staticPaths) {
    for (const locale of LOCALES) {
      pages.push({
        url: localeUrl(locale, path),
        lastModified,
        changeFrequency: freq,
        priority,
        alternates: buildAlternates(path),
      });
    }
  }
  return pages;
}
```

- [ ] **Step 6: Verify no kept file imports a deleted module.** Run:
```bash
cd /Users/hodlmedia/forge && git grep -nE "@/lib/(programs|eligibility|agents)|components/(Results|Quiz|LandingPage|Directory|AgentContact|AgentLogo)|\[locale\]/(aides|agents)" -- src/ ; echo "exit: $?"
```
Expected: NO matches and `exit: 1`. Any remaining import points at a file that must also be addressed — resolve before continuing (e.g. a stale `page.tsx` importing `LandingPage` is rewritten in Phase 2, but if it blocks the build now, neutralize the import in this step's follow-up).

- [ ] **Step 7: Confirm the message-loader (request.ts) only references kept locales.** Run:
```bash
cd /Users/hodlmedia/forge && cat src/i18n/request.ts
```
Expected: review for any hardcoded list of the deleted locales. If `request.ts` dynamically imports `../../messages/${locale}.json` keyed off `routing.locales`, it self-corrects once routing is collapsed (Task 0.8); no edit needed here. If it hardcodes a locale array including the deleted ones, note it for Task 0.8.

- [ ] **Step 8: Commit.**
```bash
cd /Users/hodlmedia/forge && git add -A && git commit -m "refactor(cleanup): remove grants routes, agents directory, surplus locales, grants posts and quiz UI"
```

---

### Task 0.7: Rename the package and add/prune dependencies in `package.json`

Rename `forge-simulator` → `openletz`, add the runtime deps the redesign needs (`zod` for data validation, `motion` for the restrained motion system), and remove the now-dead deps (`next-mdx-remote`, `react-markdown`, `remark-gfm` — the OS site rendered markdown client-side; the salvaged blog uses `gray-matter` only). The test devDeps were already added in Task 0.1.

**Files:**
- Modify: `/Users/hodlmedia/forge/package.json`

- [ ] **Step 1: Rename the package.** In `/Users/hodlmedia/forge/package.json`, change:
```json
  "name": "forge-simulator",
```
to:
```json
  "name": "openletz",
```

- [ ] **Step 2: Add the runtime deps.** Run:
```bash
cd /Users/hodlmedia/forge && npm install zod@^3 motion@^11
```
Expected: npm adds `zod` and `motion` to `dependencies`, updates the lockfile, prints `added N packages`.

- [ ] **Step 3: Remove the dead markdown-rendering deps.** Run:
```bash
cd /Users/hodlmedia/forge && npm uninstall next-mdx-remote react-markdown remark-gfm
```
Expected: npm removes the three packages from `dependencies` and updates the lockfile.

- [ ] **Step 4: Verify the resulting `dependencies` block.** Run:
```bash
cd /Users/hodlmedia/forge && node -e "const p=require('./package.json'); console.log('name:',p.name); console.log('deps:',Object.keys(p.dependencies).sort().join(', ')); console.log('has dead:', ['next-mdx-remote','react-markdown','remark-gfm'].some(d=>p.dependencies[d])); console.log('has zod/motion:', !!p.dependencies.zod && !!p.dependencies.motion);"
```
Expected output:
```
name: openletz
deps: @gsap/react, gray-matter, gsap, jspdf, motion, next, next-intl, react, react-dom, zod
has dead: false
has zod/motion: true
```
(`jspdf` was the grants PDF dep used by the now-deleted `Results.tsx`; it is harmless to leave installed, and removing it is deferred so this task stays focused on the contract's named adds/removes.)

- [ ] **Step 5: Smoke-check that nothing kept imports a removed package.** Run:
```bash
cd /Users/hodlmedia/forge && git grep -nE "next-mdx-remote|react-markdown|remark-gfm" -- src/ ; echo "exit: $?"
```
Expected: NO matches and `exit: 1` (the only consumers were the deleted OS/quiz components). If a kept file still imports one, neutralize that import before committing.

- [ ] **Step 6: Commit.**
```bash
cd /Users/hodlmedia/forge && git add package.json package-lock.json && git commit -m "build(config): rename package to openletz, add zod+motion, drop dead markdown deps"
```

---

### Task 0.8: Collapse i18n routing + config to `en/fr/de` (default `en`), sourced from site-config

`routing.ts` lists 11 locales with `defaultLocale: 'fr'`; `config.ts` lists 6. Both collapse to exactly `['en','fr','de']` with `defaultLocale: 'en'`, importing the locale set from `site-config.ts` so there is one definition. `proxy.ts`'s `INDEXABLE_LOCALES` collapses to the same three. The `localeDetection: false` and `localePrefix: 'as-needed'` behaviors are preserved. Locale collapse is config, verified by the existing site-config test plus a `git grep` that no dropped locale survives in these files; it ends with a verification step and commit (the locale SET itself is already TDD-covered in `site-config.test.ts`).

**Files:**
- Modify: `/Users/hodlmedia/forge/src/i18n/routing.ts`
- Modify: `/Users/hodlmedia/forge/src/i18n/config.ts`
- Modify: `/Users/hodlmedia/forge/src/proxy.ts`
- Modify (if it hardcodes locales): `/Users/hodlmedia/forge/src/i18n/request.ts`

- [ ] **Step 1: Collapse `routing.ts` and import the locale set from site-config.** Replace the entire contents of `/Users/hodlmedia/forge/src/i18n/routing.ts` with exactly:
```ts
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { LOCALES, DEFAULT_LOCALE, LOCALE_PREFIX } from '@/lib/site-config';

export const routing = defineRouting({
  // Single source of truth: en/fr/de from site-config.
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  // Default locale (en) served at `/`; fr/de prefixed. Prefixed default
  // 308-redirects to the unprefixed canonical.
  localePrefix: LOCALE_PREFIX,
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 2: Collapse `config.ts` to re-export the canonical set.** Replace the entire contents of `/Users/hodlmedia/forge/src/i18n/config.ts` with exactly:
```ts
// Back-compat shim: the locale set + default now live in site-config.ts.
// Existing imports of `locales`/`defaultLocale`/`Locale` keep working.
export { LOCALES as locales, DEFAULT_LOCALE as defaultLocale } from '@/lib/site-config';
export type { Locale } from '@/lib/site-config';
```

- [ ] **Step 3: Collapse `INDEXABLE_LOCALES` in `proxy.ts`.** In `/Users/hodlmedia/forge/src/proxy.ts`, replace:
```ts
const INDEXABLE_LOCALES = new Set(['fr', 'en', 'de', 'lb', 'pt']);
```
with:
```ts
const INDEXABLE_LOCALES = new Set(['en', 'fr', 'de']);
```
Also update the stale comment above it if it references "11 `routing.locales`" — change the count to "3". Leave the `/api/md` rewrite and the (now os-free) matcher from Task 0.5 untouched.

- [ ] **Step 4: Reconcile `request.ts` if it hardcodes locales.** Read `/Users/hodlmedia/forge/src/i18n/request.ts`. If it imports `routing` and derives the locale from `routing.locales` (the next-intl 4.x convention), it is already correct — no edit. If it hardcodes a locale list or a default of `'fr'`, replace that with an import from `@/lib/site-config` (`DEFAULT_LOCALE`) and have it validate against `routing.locales`. Do not change its `getRequestConfig` message-loading shape beyond the locale source.

- [ ] **Step 5: Verify no dropped locale survives in these i18n files.** Run:
```bash
cd /Users/hodlmedia/forge && git grep -nE "'(lb|pt|it|es|ru|ar|tr|uk)'" -- src/i18n/ src/proxy.ts ; echo "exit: $?"
```
Expected: NO matches and `exit: 1`.

- [ ] **Step 6: Confirm the locale set resolves to en/fr/de via the existing test.** Run:
```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/site-config.test.ts
```
Expected: PASS — the canonical locale list is `['en','fr','de']` and the routing/config now import it. (This is the regression guard for the collapse.)

- [ ] **Step 7: Commit.**
```bash
cd /Users/hodlmedia/forge && git add src/i18n/routing.ts src/i18n/config.ts src/proxy.ts src/i18n/request.ts && git commit -m "refactor(i18n): collapse locales to en/fr/de with default en, sourced from site-config"
```

---

### Task 0.9: Rewrite `CLAUDE.md` for the studio site

The current `CLAUDE.md` documents the old quiz/simulator/grants app (6 screens, eligibility engine, 6-language quiz, funding-program tables) — all of which are now deleted or being replaced. Rewrite it to describe the Openletz studio site: the typed-data + `Section[]` + `SectionRenderer` Server-Component architecture, en/fr/de i18n, the canonical `openletz.ai` host, the test stack, and the kill-list status. This is documentation; it ends with a commit, no test.

**Files:**
- Modify: `/Users/hodlmedia/forge/CLAUDE.md`

- [ ] **Step 1: Replace the entire contents of `CLAUDE.md`.** Write `/Users/hodlmedia/forge/CLAUDE.md` with exactly:
```md
# CLAUDE.md — Openletz

## Project Overview

Openletz (`openletz`) is the website of **a Luxembourg AI agency** (solo founder-operator: Clément Fermaud / Commit Media S.à r.l., RCS B276192). Tagline: "Websites that think, move & transact." AI agents & automation are the front door; digital & growth is the body; Web3/on-chain is secondary depth. The site's one job is to convert a qualified visitor into a **project enquiry**.

This repo replaced an earlier Mac-OS-"Aqua" desktop homepage (scrapped) and, before that, a grants-eligibility simulator (deleted). Do not reintroduce OS-shell, quiz, or grants concepts.

## Tech Stack

- **Framework:** Next.js 16 (App Router) / React 19
- **Language:** TypeScript 5.7 (strict)
- **i18n:** next-intl 4.x — locales **en (default, at `/`) · fr · de** only
- **Styling:** Tailwind CSS 3.4, monochrome token system (no accent color)
- **Content:** typed `src/data/*.ts` validated with **Zod** (single source of truth)
- **Motion:** `motion/react` (default), CSS view-timeline reveals, GSAP only for the one optional set-piece
- **Blog:** MDX read with `gray-matter`
- **Tests:** Vitest + Testing Library (unit/component), Playwright (E2E)
- **Hosting:** Vercel

## Canonical domain

**`https://openletz.ai`** (apex — no `www`, no trailing slash). The one definition lives in `src/lib/site-config.ts` (`SITE_URL`, `LOCALES`, `DEFAULT_LOCALE`, `localeUrl`, `siteConfig`). Every JSON-LD `@id`/`url`, sitemap, canonical, robots `Sitemap:`, and redirect imports from there — never hardcode a host. Host canonicalization (`.com`/`www`/`.fr`/`.info` → apex) and per-URL legacy 301s live in `src/lib/redirects.ts`, consumed by `next.config.mjs`.

## Commands

```bash
npm run dev        # dev server (localhost:3000; E2E uses PORT=3030)
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint (Next preset)
npm run typecheck  # tsc --noEmit
npm run test       # Vitest unit/component (one-shot)
npm run test:watch # Vitest watch
npm run test:e2e   # Playwright E2E
```

## Architecture

- **Content** lives in typed `src/data/*.ts` (ported from the old `osData.ts`/`osI18n.ts`), each parsed by its Zod schema in `src/lib/schema.ts` at module load so bad content fails the build.
- **Pages** are a typed discriminated-union `Section[]` rendered by `<SectionRenderer>` — Server Components. All interactivity (motion, forms, proof strip, work filter) lives in `'use client'` leaf islands under `src/components/ui/`.
- **Every** `[locale]` file calls `setRequestLocale(locale)` and exports `generateStaticParams` (returns the 3 locales) — non-negotiable, or static rendering silently breaks.
- **Design tokens** (palette + motion) live only in `src/styles/tokens.css`. Components reference the CSS vars; no raw `ease`/ad-hoc durations.
- **SEO/AEO:** JSON-LD builders in `src/lib/jsonld.ts` (Organization, ProfessionalService, WebSite, BreadcrumbList, FAQPage) wrapped by `safeJsonLd.ts`; `robots.txt`, `llms.txt`, `llms-full.txt`, `/.well-known/*` are the AEO layer.

## Conventions

- **Path alias:** `@/` → `src/`.
- **Locale content:** UI/content strings come from `src/data/*` (typed) — never hardcode user-facing copy in components.
- **Motion:** transform + opacity only; LCP node renders at `opacity:1` on first paint; honor `prefers-reduced-motion` (reduced ≠ stripped — keep fades).
- **Commits:** Conventional Commits (`type(scope): subject`). **NO AI attribution** (no `Co-Authored-By`, no "Generated with Claude") — Commit Media preference.
- **Portfolio (exact, do not vary):** Vins Fins, La Grocerie, Gategram, LiberClaw, Ophis, Skills.ws. Never list LibertAI or aleph-fileshare. "Greg" is an internal codename for Ophis.
- **Funding line:** always **SME Package** (soft, one line — Commit Media is not Fit 4 AI eligible). Never a pillar.

## API routes (salvaged)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact` | POST | Enquiry form → `data/contacts.json` + Telegram/webhook fan-out; validated by `ContactPayloadSchema` |
| `/api/newsletter` | POST | Newsletter signup, deduped; validated by `NewsletterSchema` |
| `/api/md/[[...slug]]` | GET | Markdown rendering of pages for AI crawlers |
| `/api/well-known/*` | GET | RFC 9727 agent-discovery (openapi, api-catalog) |

Serverless FS is ephemeral — the Telegram/webhook notification is the durable lead trail; confirm `TELEGRAM_BOT_TOKEN`/`CHAT_ID`, `NOTIFICATION_WEBHOOK_URL`, `ADMIN_TOKEN` env vars in production.
```

- [ ] **Step 2: Sanity-check there is no stale grants/quiz language left.** Run:
```bash
cd /Users/hodlmedia/forge && grep -niE "simulator|eligibility|quiz|fit 4|fit4|grant" CLAUDE.md ; echo "exit: $?"
```
Expected: the only matches are the historical "deleted/do not reintroduce" sentence and the "not Fit 4 AI eligible" funding line — both intentional. If `exit: 1` (no matches) that is also acceptable. Confirm no section still *documents* a quiz or eligibility engine as current.

- [ ] **Step 3: Commit.**
```bash
cd /Users/hodlmedia/forge && git add CLAUDE.md && git commit -m "docs: rewrite CLAUDE.md for the Openletz studio site"
```

---

### Task 0.10: Verify the build passes (OS/grants gone, openletz.ai canonical)

End-state gate for Phase 0: the repo must build green with the OS shell and grants era removed and the apex domain canonical. This task runs typecheck, the full unit-test suite, and `npm run build`, and does the one manual dev-server sanity check. If the build surfaces a dangling import from a not-yet-rebuilt page (e.g. `[locale]/page.tsx` still importing a deleted component), this task includes a step to neutralize it with a minimal placeholder so Phase 0 ends green — Phase 1/2 replace those placeholders.

**Files:**
- (verification only; minimal placeholder edits to any page that still imports a deleted module, e.g. `/Users/hodlmedia/forge/src/app/[locale]/page.tsx`)

- [ ] **Step 1: Typecheck.** Run:
```bash
cd /Users/hodlmedia/forge && npm run typecheck
```
Expected: PASS — `tsc --noEmit` exits 0 with no errors. If errors reference a deleted module imported by a kept page, proceed to Step 2; otherwise skip to Step 3.

- [ ] **Step 2: Neutralize any page that still imports a deleted module.** If typecheck/build reports e.g. `Cannot find module '@/components/LandingPage'` in `src/app/[locale]/page.tsx`, replace that page's body with a minimal valid placeholder that still satisfies the contract's `setRequestLocale` + `generateStaticParams` requirement. Write `/Users/hodlmedia/forge/src/app/[locale]/page.tsx` with exactly (adjust only if the real Phase-2 homepage already landed):
```tsx
import { setRequestLocale } from 'next-intl/server';
import { LOCALES } from '@/lib/site-config';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <h1>Websites that think, move &amp; transact.</h1>
      <p>A Luxembourg AI agency.</p>
    </main>
  );
}
```
Apply the same minimal-placeholder treatment to any other kept route page that imports a deleted module (each keeps `setRequestLocale` + `generateStaticParams`). Note: the Phase-2 homepage replaces this with `<SectionRenderer sections={HOME_SECTIONS} />`.

- [ ] **Step 3: Run the full unit-test suite.** Run:
```bash
cd /Users/hodlmedia/forge && npm run test
```
Expected: PASS — `site-config.test.ts` and `redirects.test.ts` all green; no failures.

- [ ] **Step 4: Production build.** Run:
```bash
cd /Users/hodlmedia/forge && npm run build
```
Expected: PASS — Next.js compiles successfully, prints the route list with `/[locale]` (and NO `/os`, `/[locale]/aides`, `/[locale]/agents`). If it fails on a dangling import, return to Step 2 for that file, then re-run. If it fails because `cacheComponents` flags a route as needing `'use cache'`/`setRequestLocale`, note the route and add the minimal placeholder treatment (Step 2) — every `[locale]` page must call `setRequestLocale`.

- [ ] **Step 5: Manual dev-server sanity check.** Run the dev server and confirm the home renders at `/` on the canonical-locale path with no OS/quiz UI:
```bash
cd /Users/hodlmedia/forge && PORT=3030 npm run dev
```
Then open `http://localhost:3030/` and confirm: the H1 "Websites that think, move & transact." is visible in the page (view-source shows it in static HTML), `/de` and `/fr` resolve, and `/os` returns 404. Stop the server (Ctrl-C) when done. (This is the one manual verification for Phase 0.)

- [ ] **Step 6: Confirm the kill-list routes are truly gone from the build output.** Run:
```bash
cd /Users/hodlmedia/forge && git grep -nE "\[locale\]/(aides|agents)|app/os|components/os/(OpenletzOS|MacWindow|MenuBar|Dock|windows|aquaIcons|CrawlableContent)|@/lib/(programs|eligibility|agents)" -- src/ ; echo "exit: $?"
```
Expected: NO matches and `exit: 1` — the OS shell and grants/agents era are fully excised from `src/` (only `osData.ts`/`osI18n.ts` remain, to be ported in Phase 1).

- [ ] **Step 7: Commit any placeholder edits made to keep the build green.**
```bash
cd /Users/hodlmedia/forge && git add -A && git commit -m "chore(cleanup): green build with OS/grants removed and openletz.ai canonical" || echo "nothing to commit — build was already green"
```


---

## Phase 1 — Foundation (content, design system, render core, AEO, layout)

### Task 1.1: Zod schemas (data + nav/footer + proof) + Section discriminated-union types (8 variants) + runtime payload schemas

**Files:**
- Create: `/Users/hodlmedia/forge/src/lib/schema.ts`
- Create: `/Users/hodlmedia/forge/src/lib/schema.test.ts`

> Depends on Phase 0: `src/lib/site-config.ts` already exports `LOCALES` and `type Locale`. `zod` is already a dependency, and `vitest`/`vitest.config.ts`/`vitest.setup.ts` already exist with the `@/`→`src` alias and the `test` script (`vitest run`). This task only adds `src/lib/schema.ts`.

- [ ] **Step 1: Write the failing test for every data schema + the runtime payload schemas.**

Create `/Users/hodlmedia/forge/src/lib/schema.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  StudioSchema,
  ServiceKeySchema,
  ServiceDataSchema,
  ServicesSchema,
  WorkItemSchema,
  WorkSchema,
  AboutSchema,
  ContactDataSchema,
  IconKeySchema,
  PriceTierSchema,
  PricingSchema,
  HeroSchema,
  HeroI18nSchema,
  LocaleSchema,
  NavItemSchema,
  NavSchema,
  FooterColumnSchema,
  FooterSchema,
  ProofLogoSchema,
  ProofMetricSchema,
  ContactPayloadSchema,
  NewsletterSchema,
} from '@/lib/schema';

describe('LocaleSchema', () => {
  it('accepts en/fr/de', () => {
    expect(LocaleSchema.parse('en')).toBe('en');
    expect(LocaleSchema.parse('fr')).toBe('fr');
    expect(LocaleSchema.parse('de')).toBe('de');
  });
  it('rejects dropped locales', () => {
    expect(LocaleSchema.safeParse('lb').success).toBe(false);
    expect(LocaleSchema.safeParse('it').success).toBe(false);
  });
});

describe('StudioSchema', () => {
  it('accepts a complete studio', () => {
    expect(
      StudioSchema.parse({
        name: 'Openletz',
        tagline: 'x',
        sub: 'y',
        welcomeLead: 'z',
        hint: 'h',
      }),
    ).toBeTruthy();
  });
  it('rejects empty strings', () => {
    expect(
      StudioSchema.safeParse({ name: '', tagline: 'x', sub: 'y', welcomeLead: 'z', hint: 'h' })
        .success,
    ).toBe(false);
  });
});

describe('ServiceKeySchema / ServiceDataSchema / ServicesSchema', () => {
  const svc = {
    kicker: 'k',
    title: 't',
    lead: 'l',
    what: [{ t: 'a', d: 'b' }],
    how: ['1', '2', '3'],
    proof: 'p',
  };
  it('accepts the 3 service keys', () => {
    expect(ServiceKeySchema.parse('ai')).toBe('ai');
    expect(ServiceKeySchema.parse('web3')).toBe('web3');
    expect(ServiceKeySchema.parse('marketing')).toBe('marketing');
  });
  it('rejects unknown keys', () => {
    expect(ServiceKeySchema.safeParse('growth').success).toBe(false);
  });
  it('accepts a service with optional footer', () => {
    expect(ServiceDataSchema.parse({ ...svc, footer: 'f' })).toBeTruthy();
    expect(ServiceDataSchema.parse(svc)).toBeTruthy();
  });
  it('parses a full Services record', () => {
    expect(ServicesSchema.parse({ ai: svc, web3: svc, marketing: svc })).toBeTruthy();
  });
});

describe('WorkItemSchema / WorkSchema', () => {
  const item = {
    slug: 'vinsfins',
    name: 'Vins Fins',
    kind: 'E-commerce',
    link: 'https://www.vinsfins.lu',
    blurb: 'b',
    about: 'a',
    did: ['x'],
    stack: ['Next.js'],
  };
  it('accepts a work item with optional tag', () => {
    expect(WorkItemSchema.parse({ ...item, tag: 'web' })).toBeTruthy();
    expect(WorkItemSchema.parse(item)).toBeTruthy();
  });
  it('rejects a non-url link', () => {
    expect(WorkItemSchema.safeParse({ ...item, link: 'not a url' }).success).toBe(false);
  });
  it('rejects a bad slug', () => {
    expect(WorkItemSchema.safeParse({ ...item, slug: 'Vins Fins' }).success).toBe(false);
  });
  it('requires exactly 6 items', () => {
    expect(WorkSchema.safeParse([item]).success).toBe(false);
    expect(WorkSchema.safeParse(Array.from({ length: 6 }, () => item)).success).toBe(true);
  });
});

describe('AboutSchema', () => {
  it('requires exactly 3 facts', () => {
    const base = { bioLead: 'b', founderName: 'C', founderRole: 'r', entity: 'e' };
    expect(AboutSchema.safeParse({ ...base, facts: ['1', '2'] }).success).toBe(false);
    expect(AboutSchema.safeParse({ ...base, facts: ['1', '2', '3'] }).success).toBe(true);
  });
});

describe('ContactDataSchema', () => {
  it('requires exactly 4 types', () => {
    const base = { lead: 'l', callLine: 'c' };
    expect(ContactDataSchema.safeParse({ ...base, types: ['a', 'b', 'c'] }).success).toBe(false);
    expect(ContactDataSchema.safeParse({ ...base, types: ['a', 'b', 'c', 'd'] }).success).toBe(true);
  });
});

describe('IconKeySchema / PriceTierSchema / PricingSchema', () => {
  const tier = {
    name: 'AI',
    icon: 'ai',
    price: 'from €X',
    desc: 'd',
    feats: ['1', '2', '3'],
  };
  it('accepts a known icon key', () => {
    expect(IconKeySchema.parse('growth')).toBe('growth');
  });
  it('rejects an unknown icon key', () => {
    expect(IconKeySchema.safeParse('rocket').success).toBe(false);
  });
  it('requires exactly 3 feats', () => {
    expect(PriceTierSchema.safeParse({ ...tier, feats: ['1', '2'] }).success).toBe(false);
    expect(PriceTierSchema.parse({ ...tier, highlight: true })).toBeTruthy();
  });
  it('requires exactly 4 tiers', () => {
    const base = { lead: 'l', note: 'n' };
    expect(PricingSchema.safeParse({ ...base, tiers: [tier, tier, tier] }).success).toBe(false);
    expect(PricingSchema.safeParse({ ...base, tiers: [tier, tier, tier, tier] }).success).toBe(true);
  });
});

describe('HeroSchema / HeroI18nSchema', () => {
  const hero = {
    tagline: 't',
    sub: 's',
    welcomeLead: 'w',
    hint: 'h',
    newProject: 'np',
    seeWork: 'sw',
  };
  it('accepts a hero', () => {
    expect(HeroSchema.parse(hero)).toBeTruthy();
  });
  it('parses an en/fr/de hero record', () => {
    expect(HeroI18nSchema.parse({ en: hero, fr: hero, de: hero })).toBeTruthy();
  });
});

describe('NavItemSchema / NavSchema', () => {
  const item = { label: 'Services', href: '/services' };
  it('accepts a label+href nav item', () => {
    expect(NavItemSchema.parse(item)).toBeTruthy();
  });
  it('rejects a nav item missing href', () => {
    expect(NavItemSchema.safeParse({ label: 'Services' }).success).toBe(false);
  });
  it('accepts a flat nav array', () => {
    expect(NavSchema.parse([item, { label: 'Work', href: '/work' }])).toBeTruthy();
  });
});

describe('FooterColumnSchema / FooterSchema', () => {
  const col = {
    heading: 'Services',
    links: [{ label: 'AI', href: '/services' }],
  };
  it('accepts a footer column', () => {
    expect(FooterColumnSchema.parse(col)).toBeTruthy();
  });
  it('rejects a column with a malformed link', () => {
    expect(
      FooterColumnSchema.safeParse({ heading: 'X', links: [{ label: 'A' }] }).success,
    ).toBe(false);
  });
  it('requires exactly 4 footer columns', () => {
    expect(FooterSchema.safeParse([col, col, col]).success).toBe(false);
    expect(FooterSchema.safeParse([col, col, col, col]).success).toBe(true);
  });
});

describe('ProofLogoSchema', () => {
  const logo = {
    slug: 'vinsfins',
    name: 'Vins Fins',
    src: '/clients/vinsfins.png',
    href: 'https://www.vinsfins.lu',
  };
  it('accepts a proof logo', () => {
    expect(ProofLogoSchema.parse(logo)).toBeTruthy();
  });
  it('rejects a bad slug', () => {
    expect(ProofLogoSchema.safeParse({ ...logo, slug: 'Vins Fins' }).success).toBe(false);
  });
  it('rejects a non-url href', () => {
    expect(ProofLogoSchema.safeParse({ ...logo, href: 'nope' }).success).toBe(false);
  });
});

describe('ProofMetricSchema', () => {
  it('accepts a static numeric metric', () => {
    expect(
      ProofMetricSchema.parse({ id: 'shipped', label: 'Products shipped', value: 6, suffix: '+' }),
    ).toBeTruthy();
  });
  it('accepts a live metric whose value is filled at runtime (value: null)', () => {
    expect(
      ProofMetricSchema.parse({ id: 'alephNodes', label: 'Aleph nodes', value: null, live: true }),
    ).toBeTruthy();
  });
  it('rejects a metric missing an id', () => {
    expect(ProofMetricSchema.safeParse({ label: 'x', value: 1 }).success).toBe(false);
  });
});

describe('ContactPayloadSchema', () => {
  it('accepts the minimal valid payload', () => {
    expect(ContactPayloadSchema.parse({ name: 'A', email: 'a@b.co' })).toBeTruthy();
  });
  it('trims and accepts all optional fields', () => {
    const parsed = ContactPayloadSchema.parse({
      name: '  A  ',
      email: ' a@b.co ',
      phone: '+352',
      company: 'Co',
      companySize: '1-10',
      pillar: 'AI automation',
      budget: '5-15k',
      message: 'hi',
    });
    expect(parsed.name).toBe('A');
    expect(parsed.email).toBe('a@b.co');
  });
  it('rejects a missing name', () => {
    expect(ContactPayloadSchema.safeParse({ email: 'a@b.co' }).success).toBe(false);
  });
  it('rejects a malformed email', () => {
    expect(ContactPayloadSchema.safeParse({ name: 'A', email: 'nope' }).success).toBe(false);
  });
  it('rejects an unknown pillar/companySize/budget enum', () => {
    expect(
      ContactPayloadSchema.safeParse({ name: 'A', email: 'a@b.co', pillar: 'Other' }).success,
    ).toBe(false);
    expect(
      ContactPayloadSchema.safeParse({ name: 'A', email: 'a@b.co', companySize: '500+' }).success,
    ).toBe(false);
    expect(
      ContactPayloadSchema.safeParse({ name: 'A', email: 'a@b.co', budget: '100k' }).success,
    ).toBe(false);
  });
  it('enforces the 500/2000 field caps', () => {
    expect(
      ContactPayloadSchema.safeParse({ name: 'a'.repeat(501), email: 'a@b.co' }).success,
    ).toBe(false);
    expect(
      ContactPayloadSchema.safeParse({ name: 'A', email: 'a@b.co', message: 'm'.repeat(2001) })
        .success,
    ).toBe(false);
  });
});

describe('NewsletterSchema', () => {
  it('accepts a valid email', () => {
    expect(NewsletterSchema.parse({ email: 'a@b.co' })).toBeTruthy();
  });
  it('rejects a malformed email', () => {
    expect(NewsletterSchema.safeParse({ email: 'nope' }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test and confirm it FAILS (no module yet).**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/schema.test.ts
```

Expected: FAIL — `Failed to resolve import "@/lib/schema"` (the module does not exist yet).

- [ ] **Step 3: Implement `src/lib/schema.ts` with all schemas, Section union types, and payload schemas.**

Create `/Users/hodlmedia/forge/src/lib/schema.ts`:

```ts
import { z } from 'zod';
import { LOCALES } from '@/lib/site-config';

/* ----------------------------------------------------------------------------
 * Locale
 * ------------------------------------------------------------------------- */
export const LocaleSchema = z.enum(LOCALES); // ['en','fr','de']

/* ----------------------------------------------------------------------------
 * Data-module schemas (ported from osData.ts) — each *Schema parses its data
 * module at load so malformed content fails the build.
 * ------------------------------------------------------------------------- */
export const StudioSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  sub: z.string().min(1),
  welcomeLead: z.string().min(1),
  hint: z.string().min(1),
});
export type Studio = z.infer<typeof StudioSchema>;

export const ServiceKeySchema = z.enum(['ai', 'web3', 'marketing']);
export type ServiceKey = z.infer<typeof ServiceKeySchema>;

export const ServiceDataSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  lead: z.string(),
  what: z.array(z.object({ t: z.string(), d: z.string() })),
  how: z.array(z.string()),
  proof: z.string(),
  footer: z.string().optional(),
});
export type ServiceData = z.infer<typeof ServiceDataSchema>;

export const ServicesSchema = z.record(ServiceKeySchema, ServiceDataSchema);

export const WorkItemSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  kind: z.string(),
  link: z.string().url(),
  blurb: z.string(),
  about: z.string(),
  did: z.array(z.string()),
  stack: z.array(z.string()),
  tag: z.enum(['ai', 'web', 'web3']).optional(),
});
export type WorkItem = z.infer<typeof WorkItemSchema>;

export const WorkSchema = z.array(WorkItemSchema).length(6);

export const AboutSchema = z.object({
  bioLead: z.string(),
  founderName: z.string(),
  founderRole: z.string(),
  facts: z.array(z.string()).length(3),
  entity: z.string(),
});
export type About = z.infer<typeof AboutSchema>;

export const ContactDataSchema = z.object({
  lead: z.string(),
  types: z.array(z.string()).length(4),
  callLine: z.string(),
});
export type Contact = z.infer<typeof ContactDataSchema>;

export const IconKeySchema = z.enum([
  'mac',
  'ai',
  'web3',
  'growth',
  'folder',
  'about',
  'mail',
  'doc',
  'drive',
  'disk',
  'price',
  'tools',
  'insights',
  'sketch',
  'snake',
]);
export type IconKey = z.infer<typeof IconKeySchema>;

export const PriceTierSchema = z.object({
  name: z.string(),
  icon: IconKeySchema,
  price: z.string(),
  desc: z.string(),
  feats: z.array(z.string()).length(3),
  highlight: z.boolean().optional(),
});
export type PriceTier = z.infer<typeof PriceTierSchema>;

export const PricingSchema = z.object({
  lead: z.string(),
  tiers: z.array(PriceTierSchema).length(4),
  note: z.string(),
});
export type Pricing = z.infer<typeof PricingSchema>;

export const HeroSchema = z.object({
  tagline: z.string(),
  sub: z.string(),
  welcomeLead: z.string(),
  hint: z.string(),
  newProject: z.string(),
  seeWork: z.string(),
});
export type Hero = z.infer<typeof HeroSchema>;

export const HeroI18nSchema = z.record(LocaleSchema, HeroSchema);

/* ----------------------------------------------------------------------------
 * Nav + Footer data-module schemas (src/data/nav.ts). The flat nav is 4 links;
 * the persistent "Start a project" CTA is carried separately (START_PROJECT).
 * The footer is exactly 4 columns (spec §6). Each parses at load.
 * ------------------------------------------------------------------------- */
export const NavItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});
export type NavItem = z.infer<typeof NavItemSchema>;

export const NavSchema = z.array(NavItemSchema);

export const FooterColumnSchema = z.object({
  heading: z.string().min(1),
  links: z.array(NavItemSchema),
});
export type FooterColumn = z.infer<typeof FooterColumnSchema>;

export const FooterSchema = z.array(FooterColumnSchema).length(4);

/* ----------------------------------------------------------------------------
 * Proof-strip descriptor schemas (src/data/proof.ts). NO fabricated numbers:
 * live metrics carry `value: null, live: true` and are filled at runtime by
 * Phase-2's src/lib/proof.ts. Each parses at load.
 * ------------------------------------------------------------------------- */
export const ProofLogoSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  src: z.string().min(1),
  href: z.string().url(),
});
export type ProofLogo = z.infer<typeof ProofLogoSchema>;

export const ProofMetricSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.number().nullable(),
  suffix: z.string().optional(),
  live: z.boolean().optional(),
});
export type ProofMetric = z.infer<typeof ProofMetricSchema>;

/* ----------------------------------------------------------------------------
 * Section discriminated union — TYPES ONLY. Each variant carries only its own
 * props. SectionRenderer (Phase 2) switches on `type` with a `never` default.
 * NOTE: there is NO 'footer' variant — Nav, Footer and NewsletterForm are
 * layout-level components rendered ONCE in src/app/[locale]/layout.tsx.
 * ------------------------------------------------------------------------- */
export type SectionType =
  | 'hero'
  | 'proofStrip'
  | 'servicesGrid'
  | 'howWeWork'
  | 'selectedWork'
  | 'deeperProof'
  | 'trustBlock'
  | 'enquiryForm';

// supporting shapes
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: string;
}

export interface HeroSectionProps {
  type: 'hero';
  h1: string;
  sub: string;
  lead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export interface ProofStripSectionProps {
  type: 'proofStrip';
  label: string;
  logos: ProofLogo[];
  metrics: ProofMetric[];
}

export interface ServicesGridSectionProps {
  type: 'servicesGrid';
  order: ServiceKey[];
  ctaLabel: string;
  ctaHref: string;
}

export interface HowWeWorkSectionProps {
  type: 'howWeWork';
  steps: string[];
  smePackageNote: string;
  stickyScroll?: boolean;
}

export interface SelectedWorkSectionProps {
  type: 'selectedWork';
  items: WorkItem[];
  viewAllHref: string;
}

export interface DeeperProofSectionProps {
  type: 'deeperProof';
  shippedCount: number;
  metrics: ProofMetric[];
  testimonials: Testimonial[];
}

export interface TrustBlockSectionProps {
  type: 'trustBlock';
  facts: string[];
  headline?: string;
}

export interface EnquiryFormSectionProps {
  type: 'enquiryForm';
  id: 'enquiry';
  headline: string;
  pillars: string[];
  callLine: string;
  bookCallHref: string;
}

export type Section =
  | HeroSectionProps
  | ProofStripSectionProps
  | ServicesGridSectionProps
  | HowWeWorkSectionProps
  | SelectedWorkSectionProps
  | DeeperProofSectionProps
  | TrustBlockSectionProps
  | EnquiryFormSectionProps;

/* ----------------------------------------------------------------------------
 * Runtime payload schemas (client ⇄ API single source of truth)
 * ------------------------------------------------------------------------- */
export const ContactPayloadSchema = z.object({
  name: z.string().trim().min(1).max(500),
  email: z
    .string()
    .trim()
    .max(500)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  phone: z.string().trim().max(500).optional(),
  company: z.string().trim().max(500).optional(),
  companySize: z.enum(['solo', '1-10', '11-50', '51-250', '250+']).optional(),
  pillar: z
    .enum(['AI automation', 'Web3 / on-chain', 'Website & growth', 'Not sure yet'])
    .optional(),
  budget: z.enum(['<5k', '5-15k', '15-50k', '50k+', 'unsure']).optional(),
  message: z.string().trim().max(2000).optional(),
});
export type ContactPayload = z.infer<typeof ContactPayloadSchema>;

export const NewsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .max(500)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});
export type NewsletterPayload = z.infer<typeof NewsletterSchema>;
```

- [ ] **Step 4: Run the test and confirm it PASSES.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/schema.test.ts
```

Expected: PASS — all `schema.test.ts` suites green (LocaleSchema, StudioSchema, Services, Work, About, Contact, Pricing, Hero, Nav, Footer, ProofLogo, ProofMetric, ContactPayload, Newsletter).

- [ ] **Step 5: Commit.**

```bash
cd /Users/hodlmedia/forge && git add src/lib/schema.ts src/lib/schema.test.ts && git commit -m "feat(data): add Zod schemas (data, nav/footer, proof), 8-variant Section union and contact/newsletter payload schemas"
```

---

### Task 1.2: Port osData.ts → typed `src/data/*` modules with build-time Zod parse

**Files:**
- Create: `/Users/hodlmedia/forge/src/data/studio.ts`
- Create: `/Users/hodlmedia/forge/src/data/services.ts`
- Create: `/Users/hodlmedia/forge/src/data/work.ts`
- Create: `/Users/hodlmedia/forge/src/data/about.ts`
- Create: `/Users/hodlmedia/forge/src/data/contact.ts`
- Create: `/Users/hodlmedia/forge/src/data/pricing.ts`
- Create: `/Users/hodlmedia/forge/src/data/__tests__/data.test.ts`

> Depends on Task 1.1 schemas. Field shapes are ported VERBATIM from `/Users/hodlmedia/forge/src/components/os/osData.ts`. Owner-provided placeholders are flagged as named constants: the four `'from €X'` prices (osData had `'On request'`; the spec requires explicit `from` placeholders, NOT "On request"). The empty testimonials array is a Section-level placeholder consumed in Phase 2's `deeperProof` data — this task only ports the six osData content models. Each module parses itself at load via its 1.1 schema, so bad content fails the build.

- [ ] **Step 1: Write the failing ground-truth test.**

Create `/Users/hodlmedia/forge/src/data/__tests__/data.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { STUDIO } from '@/data/studio';
import { SERVICES } from '@/data/services';
import { WORK } from '@/data/work';
import { ABOUT } from '@/data/about';
import { CONTACT } from '@/data/contact';
import { PRICING, PRICE_PLACEHOLDER } from '@/data/pricing';

describe('STUDIO', () => {
  it('matches osData ground truth', () => {
    expect(STUDIO.name).toBe('Openletz');
    expect(STUDIO.tagline).toBe('Websites that think, move & transact.');
    expect(STUDIO.sub).toBe('A Luxembourg AI agency.');
    expect(STUDIO.welcomeLead.length).toBeGreaterThan(40);
  });
});

describe('SERVICES', () => {
  it('has the 3 pillar keys', () => {
    expect(Object.keys(SERVICES).sort()).toEqual(['ai', 'marketing', 'web3']);
  });
  it('keeps the Growth kicker on marketing', () => {
    expect(SERVICES.marketing.kicker).toBe('What we do · Growth');
    expect(SERVICES.marketing.title).toBe('Digital & Growth');
  });
  it('only the ai pillar carries a footer (SME co-funding line)', () => {
    expect(SERVICES.ai.footer).toContain('SME Package');
    expect(SERVICES.web3.footer).toBeUndefined();
    expect(SERVICES.marketing.footer).toBeUndefined();
  });
  it('ai.how has the audit→prototype→live three steps', () => {
    expect(SERVICES.ai.how).toHaveLength(3);
    expect(SERVICES.ai.how[0]).toBe('A quick audit');
  });
});

describe('WORK', () => {
  it('has exactly 6 items in order', () => {
    expect(WORK).toHaveLength(6);
    expect(WORK.map((w) => w.slug)).toEqual([
      'vinsfins',
      'lagrocerie',
      'gategram',
      'liberclaw',
      'ophis',
      'skillsws',
    ]);
  });
  it('every item links to a live https URL', () => {
    for (const w of WORK) expect(w.link.startsWith('https://')).toBe(true);
  });
  it('derives a valid filter tag for every item (mapped from kind)', () => {
    const tags = WORK.map((w) => w.tag);
    expect(tags).toEqual(['web', 'web', 'web', 'ai', 'web3', 'ai']);
    // every item carries a tag, and every tag is one of the 3 filter values
    for (const w of WORK) {
      expect(w.tag).toBeDefined();
      expect(['ai', 'web', 'web3']).toContain(w.tag);
    }
  });
});

describe('ABOUT', () => {
  it('has 3 facts and the Commit Media entity', () => {
    expect(ABOUT.facts).toHaveLength(3);
    expect(ABOUT.founderName).toBe('Clément Fermaud');
    expect(ABOUT.entity).toBe('Commit Media S.à r.l. · RCS B276192 · Luxembourg');
  });
});

describe('CONTACT', () => {
  it('has the 4 enquiry types', () => {
    expect(CONTACT.types).toEqual([
      'AI automation',
      'Web3 / on-chain',
      'Website & growth',
      'Not sure yet',
    ]);
  });
  it('keeps the within-one-business-day lead', () => {
    expect(CONTACT.lead).toContain('one business day');
  });
});

describe('PRICING', () => {
  it('has 4 tiers, each with an explicit "from" placeholder (never "On request")', () => {
    expect(PRICING.tiers).toHaveLength(4);
    for (const t of PRICING.tiers) {
      expect(t.price).toBe(PRICE_PLACEHOLDER);
      expect(t.price).not.toBe('On request');
      expect(t.price.toLowerCase()).toContain('from');
      expect(t.feats).toHaveLength(3);
    }
  });
  it('keeps the SME Package note', () => {
    expect(PRICING.note).toContain('SME Package');
  });
});
```

- [ ] **Step 2: Run the test and confirm it FAILS (no data modules yet).**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/data/__tests__/data.test.ts
```

Expected: FAIL — `Failed to resolve import "@/data/studio"` (the data modules do not exist yet).

- [ ] **Step 3: Create `src/data/studio.ts`.**

Create `/Users/hodlmedia/forge/src/data/studio.ts`:

```ts
import { StudioSchema, type Studio } from '@/lib/schema';

export type { Studio };

// Ported verbatim from src/components/os/osData.ts (STUDIO).
export const STUDIO: Studio = StudioSchema.parse({
  name: 'Openletz',
  tagline: 'Websites that think, move & transact.',
  sub: 'A Luxembourg AI agency.',
  welcomeLead:
    'We’re a small Luxembourg studio. We build AI agents, chatbots and automations that actually save time — and the websites and shops around them. When a project needs blockchain, we build that too. Everything runs in Europe, and it’s yours to keep.',
  hint: 'Double-click an icon to see what we do — or hit “New Project” to start.',
});
```

- [ ] **Step 4: Create `src/data/services.ts`.**

Create `/Users/hodlmedia/forge/src/data/services.ts`:

```ts
import { ServicesSchema, type ServiceData, type ServiceKey } from '@/lib/schema';

export type { ServiceData, ServiceKey };

// Ported verbatim from src/components/os/osData.ts (SERVICES). Keys keep the
// 'ai' | 'web3' | 'marketing' shape; the marketing kicker reads "Growth".
export const SERVICES = ServicesSchema.parse({
  ai: {
    kicker: 'What we do · AI',
    title: 'AI agents & automation',
    lead:
      'This is the core of what we do. We build AI agents, chatbots and automations for businesses in Luxembourg — from a quick audit to something running in production, usually in a few weeks.',
    what: [
      {
        t: 'Agents & chatbots',
        d: 'Assistants that answer questions, handle support and do back-office work — in French, English, German or Luxembourgish.',
      },
      {
        t: 'Automations',
        d: 'The repetitive stuff — documents, leads, CRM, ops — handled, with the time saved you can actually measure.',
      },
      {
        t: 'Where to start',
        d: 'A short audit that finds the one or two things worth automating first.',
      },
    ],
    how: ['A quick audit', 'A working prototype you can click', 'Live, with numbers to show it works'],
    proof:
      'We pick tools with GDPR and the EU AI Act in mind. LiberClaw, a personal AI assistant, is one of our own — it’s in the Work folder.',
    footer:
      'In Luxembourg? Your project may be co-funded through the SME Package — we’ll help with the paperwork.',
  },
  web3: {
    kicker: 'What we do · Web3',
    title: 'Web3 & On-Chain',
    lead:
      'Not the headline — a tool we reach for when it helps. If a product is better with payments, ownership or token-gating built in, we’ll build it on-chain and host it in Europe.',
    what: [
      {
        t: 'Apps & smart contracts',
        d: 'Token-gating, mints and full on-chain apps — built carefully, with audits in mind.',
      },
      { t: 'Token-gated access', d: 'Memberships, paywalls and communities tied to a wallet.' },
      { t: 'European hosting', d: 'Run in Europe, no lock-in.' },
    ],
    how: ['Scope & architecture', 'Build & careful testing', 'Launch + support'],
    proof:
      'We ship real on-chain products, not decks — Ophis (a DEX aggregator) and Gategram are both in the Work folder.',
  },
  marketing: {
    kicker: 'What we do · Growth',
    title: 'Digital & Growth',
    lead: 'The websites and shops that carry it all — and the marketing to get them seen.',
    what: [
      {
        t: 'Websites & shops',
        d: 'Fast, modern builds on Next.js — like Vins Fins and La Grocerie.',
      },
      {
        t: 'Getting found',
        d: 'SEO, plus the newer game of being cited by AI assistants. It’s all live on this very site.',
      },
      {
        t: 'Content & analytics',
        d: 'A simple loop — publish, measure, improve — with GA4 and Search Console wired in.',
      },
    ],
    how: ['Position & design', 'Build & instrument', 'Grow & report'],
    proof: 'We also run marketing for live products, including Aleph Cloud.',
  },
}) as Record<ServiceKey, ServiceData>;
```

- [ ] **Step 5: Create `src/data/work.ts`.**

Create `/Users/hodlmedia/forge/src/data/work.ts`:

```ts
import { WorkSchema, type WorkItem } from '@/lib/schema';

export type { WorkItem };

// Ported verbatim from src/components/os/osData.ts (WORK). Order is significant.
// `tag` is ADDED for the /work filter and mapped from `kind`:
//   E-commerce / Our product (web build) -> 'web'
//   AI assistant -> 'ai'
//   Web3 / DeFi  -> 'web3'
//   Skills.ws is an AI tooling marketplace -> 'ai'
export const WORK: WorkItem[] = WorkSchema.parse([
  {
    slug: 'vinsfins',
    name: 'Vins Fins',
    kind: 'E-commerce',
    link: 'https://www.vinsfins.lu',
    blurb: 'A multilingual wine shop & restaurant in the Grund.',
    about:
      'Vins Fins is a wine bar and restaurant in Luxembourg’s Grund. We built their online shop and booking site — hundreds of wines, four languages, and a checkout that handles Luxembourg VAT and shipping.',
    did: [
      'Designed and built the site on Next.js',
      'Stripe checkout with Luxembourg VAT',
      'POST Luxembourg shipping + Zenchef bookings',
      'FR / EN / DE / LB, with a light admin',
    ],
    stack: ['Next.js', 'Stripe', 'Vercel'],
    tag: 'web',
  },
  {
    slug: 'lagrocerie',
    name: 'La Grocerie',
    kind: 'E-commerce',
    link: 'https://www.lagrocerie.lu',
    blurb: 'Farm-to-table grocery & natural-wine cellar.',
    about:
      'A sister shop to Vins Fins: a grocery and natural-wine cellar in the Grund, sourcing from short-supply-chain producers. We built the shop, the stock system, and a simple admin the team actually uses.',
    did: [
      'E-commerce on the same stack as Vins Fins',
      'Real-time stock management',
      'Stripe checkout',
      'A lightweight admin',
    ],
    stack: ['Next.js', 'Stripe', 'Vercel KV'],
    tag: 'web',
  },
  {
    slug: 'gategram',
    name: 'Gategram',
    kind: 'Our product',
    link: 'https://gategram.app',
    blurb: 'Sell digital content on Telegram, paid in Stars.',
    about:
      'Our own product: a way for creators to sell digital content inside Telegram and get paid in Stars — instant delivery, and the creator keeps 95%. Open source.',
    did: [
      'Designed and built the product end to end',
      'Telegram bot + Stars payments',
      'Instant delivery, 95% to the creator',
      'Open-sourced it',
    ],
    stack: ['Telegram', 'Payments', 'Next.js'],
    tag: 'web',
  },
  {
    slug: 'liberclaw',
    name: 'LiberClaw',
    kind: 'AI assistant',
    link: 'https://liberclaw.ai',
    blurb: 'A personal AI assistant you actually control.',
    about:
      'LiberClaw is a personal AI assistant — email, calendar, notes and more, wired into your own accounts. We work on its skills and on how it gets real things done for you.',
    did: [
      'Built assistant skills for email, calendar and notes',
      'Wired them into real accounts',
      'Kept privacy and control front and centre',
    ],
    stack: ['AI agents', 'Skills', 'TypeScript'],
    tag: 'ai',
  },
  {
    slug: 'ophis',
    name: 'Ophis',
    kind: 'Web3 / DeFi',
    link: 'https://ophis.fi',
    blurb: 'An intent-based DEX aggregator for better swaps.',
    about:
      'Ophis is a DEX aggregator — you say what you want, it finds the best way to swap on-chain and protects you from MEV. We handle the product, the brand and the front-end.',
    did: [
      'Product, brand and front-end',
      'Intent-based swap flow',
      'MEV-protected execution + receipts',
    ],
    stack: ['Web3', 'DeFi', 'React'],
    tag: 'web3',
  },
  {
    slug: 'skillsws',
    name: 'Skills.ws',
    kind: 'Our product',
    link: 'https://www.skills.ws',
    blurb: 'A marketplace of skills for AI coding assistants.',
    about:
      'Our own product: a marketplace of ready-made skills for AI coding assistants like Claude Code, Cursor and Codex. Browse, install, and make your assistant better at real work.',
    did: [
      'Designed and built the marketplace',
      '85+ agent skills, browsable and installable',
      'Also shipped as an npm CLI',
    ],
    stack: ['Next.js', 'Vercel', 'npm'],
    tag: 'ai',
  },
]);
```

- [ ] **Step 6: Create `src/data/about.ts`.**

Create `/Users/hodlmedia/forge/src/data/about.ts`:

```ts
import { AboutSchema, type About } from '@/lib/schema';

export type { About };

// Ported verbatim from src/components/os/osData.ts (ABOUT).
export const ABOUT: About = AboutSchema.parse({
  bioLead:
    'Openletz is the studio name of Commit Media — a small Luxembourg shop. I design, build and market AI and web products, usually end to end, with a trusted crew when a project needs more hands.',
  founderName: 'Clément Fermaud',
  founderRole:
    'Founder. I run marketing for Aleph Cloud, and I build my own products — LiberClaw, Gategram, Ophis and Skills.ws — alongside client work like Vins Fins and La Grocerie.',
  facts: [
    'Based in Luxembourg, in the EU',
    'You work with me directly — no account managers, no offshore handoff',
    'AI tools chosen with GDPR and the EU AI Act in mind; hosting in Europe',
  ],
  entity: 'Commit Media S.à r.l. · RCS B276192 · Luxembourg',
});
```

- [ ] **Step 7: Create `src/data/contact.ts`.**

Create `/Users/hodlmedia/forge/src/data/contact.ts`:

```ts
import { ContactDataSchema, type Contact } from '@/lib/schema';

export type { Contact };

// Ported verbatim from src/components/os/osData.ts (CONTACT).
export const CONTACT: Contact = ContactDataSchema.parse({
  lead: 'Tell us what you want to build. We reply within one business day.',
  types: ['AI automation', 'Web3 / on-chain', 'Website & growth', 'Not sure yet'],
  callLine: 'Prefer to talk? Book a 15-minute intro call.',
});
```

- [ ] **Step 8: Create `src/data/pricing.ts`.**

Create `/Users/hodlmedia/forge/src/data/pricing.ts`:

```ts
import { PricingSchema, type Pricing } from '@/lib/schema';

export type { Pricing };

/**
 * OWNER-PROVIDED PLACEHOLDER.
 * osData used 'On request'; the spec requires an explicit "from €X" anchor
 * (research ties published "from" anchors to higher qualified-lead conversion).
 * Replace this single constant when the owner provides the real per-tier
 * numbers — the tier structure stays the same.
 */
export const PRICE_PLACEHOLDER = 'from €X' as const;

// Ported from src/components/os/osData.ts (PRICING); 'On request' prices
// replaced by the explicit PRICE_PLACEHOLDER per the spec.
export const PRICING: Pricing = PricingSchema.parse({
  lead: 'Every project gets a fixed quote up front. Here’s the shape of what we do.',
  tiers: [
    {
      name: 'AI agents & automation',
      icon: 'ai',
      price: PRICE_PLACEHOLDER,
      desc: 'Agents, chatbots and automations.',
      feats: ['Scoped audit first', 'Built and deployed', 'You own it'],
      highlight: true,
    },
    {
      name: 'Website & e-commerce',
      icon: 'growth',
      price: PRICE_PLACEHOLDER,
      desc: 'Modern sites and shops on Next.js.',
      feats: ['Design + build', 'Multilingual & SEO', 'Stripe / bookings'],
      highlight: true,
    },
    {
      name: 'Web3 build',
      icon: 'web3',
      price: PRICE_PLACEHOLDER,
      desc: 'Smart contracts and on-chain apps.',
      feats: ['Scope & architecture', 'Build & testing', 'Launch + support'],
    },
    {
      name: 'Care & hosting',
      icon: 'tools',
      price: PRICE_PLACEHOLDER,
      desc: 'Updates, monitoring and EU hosting.',
      feats: ['Maintenance', 'Monitoring & backups', 'Direct support'],
    },
  ],
  note: 'Based in Luxembourg, your project may be co-funded through the SME Package — we help with the paperwork.',
});
```

- [ ] **Step 9: Run the test and confirm it PASSES.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/data/__tests__/data.test.ts
```

Expected: PASS — all data ground-truth suites green (STUDIO, SERVICES, WORK 6/order/tags, ABOUT, CONTACT, PRICING placeholders + SME note).

- [ ] **Step 10: Commit.**

```bash
cd /Users/hodlmedia/forge && git add src/data/studio.ts src/data/services.ts src/data/work.ts src/data/about.ts src/data/contact.ts src/data/pricing.ts src/data/__tests__/data.test.ts && git commit -m "feat(data): port osData STUDIO/SERVICES/WORK/ABOUT/CONTACT/PRICING to typed src/data with Zod parse"
```

---

### Task 1.3: Nav + footer model — `src/data/nav.ts` (NAV, FOOTER, START_PROJECT)

**Files:**
- Create: `/Users/hodlmedia/forge/src/data/nav.ts`
- Create: `/Users/hodlmedia/forge/src/data/nav.test.ts`

> Depends on Task 1.1 (`NavSchema`, `FooterSchema`, `FooterColumn`). This is the contract module from `00-structure §2`: the flat nav model + the 4 footer columns + the one CTA verb constant. The persistent "Start a project" CTA button is carried SEPARATELY as `START_PROJECT` (it is not one of the nav links). The 4 footer columns are Services / Company / Connect / Legal with real hrefs (services pillars, /about /work /insights, LinkedIn from `siteConfig.brand.linkedin`, /legal/privacy /legal/terms). Each export parses itself at load via its 1.1 schema, so bad content fails the build.

- [ ] **Step 1: Write the failing test.**

Create `/Users/hodlmedia/forge/src/data/nav.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { NAV, FOOTER, START_PROJECT } from '@/data/nav';
import { siteConfig } from '@/lib/site-config';

describe('START_PROJECT', () => {
  it('is the one CTA verb', () => {
    expect(START_PROJECT).toBe('Start a project');
  });
});

describe('NAV', () => {
  it('is the flat 4-link nav model (CTA carried separately)', () => {
    expect(NAV).toHaveLength(4);
    expect(NAV.map((n) => n.label)).toEqual(['Services', 'Work', 'About', 'Insights']);
    expect(NAV.map((n) => n.href)).toEqual(['/services', '/work', '/about', '/insights']);
  });
  it('does not embed the CTA as a nav link', () => {
    expect(NAV.some((n) => n.label === START_PROJECT)).toBe(false);
  });
});

describe('FOOTER', () => {
  it('has exactly 4 columns (Services / Company / Connect / Legal)', () => {
    expect(FOOTER).toHaveLength(4);
    expect(FOOTER.map((c) => c.heading)).toEqual(['Services', 'Company', 'Connect', 'Legal']);
  });
  it('every column has at least one real link', () => {
    for (const col of FOOTER) {
      expect(col.links.length).toBeGreaterThan(0);
      for (const l of col.links) {
        expect(l.label.length).toBeGreaterThan(0);
        expect(l.href.length).toBeGreaterThan(0);
      }
    }
  });
  it('Connect column links to the LinkedIn sameAs from site-config', () => {
    const connect = FOOTER.find((c) => c.heading === 'Connect');
    expect(connect?.links.some((l) => l.href === siteConfig.brand.linkedin)).toBe(true);
  });
  it('Legal column links to privacy + terms', () => {
    const legal = FOOTER.find((c) => c.heading === 'Legal');
    const hrefs = legal?.links.map((l) => l.href) ?? [];
    expect(hrefs).toContain('/legal/privacy');
    expect(hrefs).toContain('/legal/terms');
  });
});
```

- [ ] **Step 2: Run the test and confirm it FAILS.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/data/nav.test.ts
```

Expected: FAIL — `Failed to resolve import "@/data/nav"`.

- [ ] **Step 3: Implement `src/data/nav.ts`.**

Create `/Users/hodlmedia/forge/src/data/nav.ts`:

```ts
import { NavSchema, FooterSchema, type NavItem, type FooterColumn } from '@/lib/schema';
import { siteConfig } from '@/lib/site-config';

export type { NavItem, FooterColumn };

/**
 * The one CTA verb (spec §0). EN here; FR/DE come through hero-i18n.
 * Used ~5× (hero, after services, after selected work, closing form, nav button).
 * The persistent nav button uses this SEPARATELY from the flat NAV links.
 */
export const START_PROJECT = 'Start a project' as const;

// Flat 5-item nav = 4 links + the persistent START_PROJECT CTA button (rendered
// by Nav.tsx, not part of this array). Parsed at load so bad content fails build.
export const NAV: NavItem[] = NavSchema.parse([
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
]);

// 4 lean footer columns (spec §6): Services pillars / Company / Connect / Legal.
export const FOOTER: FooterColumn[] = FooterSchema.parse([
  {
    heading: 'Services',
    links: [
      { label: 'AI agents & automation', href: '/services#ai' },
      { label: 'Digital & Growth', href: '/services#marketing' },
      { label: 'Web3 & On-Chain', href: '/services#web3' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Work', href: '/work' },
      { label: 'Insights', href: '/insights' },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { label: 'LinkedIn', href: siteConfig.brand.linkedin },
      { label: 'Email', href: `mailto:${siteConfig.brand.email}` },
      { label: 'Start a project', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
]);
```

- [ ] **Step 4: Run the test and confirm it PASSES.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/data/nav.test.ts
```

Expected: PASS — `START_PROJECT` is the verb; `NAV` is the 4 flat links; `FOOTER` is 4 columns with the LinkedIn `sameAs` and the privacy/terms links.

- [ ] **Step 5: Commit.**

```bash
cd /Users/hodlmedia/forge && git add src/data/nav.ts src/data/nav.test.ts && git commit -m "feat(data): add nav + footer model and the START_PROJECT CTA constant with Zod parse"
```

---

### Task 1.4: Proof-strip descriptors — `src/data/proof.ts` (PROOF_LOGOS, PROOF_METRICS)

**Files:**
- Create: `/Users/hodlmedia/forge/src/data/proof.ts`
- Create: `/Users/hodlmedia/forge/src/data/proof.test.ts`

> Depends on Task 1.1 (`ProofLogoSchema`, `ProofMetricSchema`, `ProofLogo`, `ProofMetric`) and Task 1.2 (`WORK` — the wordmarks are derived from it). This is the contract module from `00-structure §2`: static proof-strip descriptors with NO fabricated numbers. `PROOF_LOGOS` are the 6 portfolio wordmarks derived from `WORK` (slug/name, `src: '/clients/<slug>.png'`, `href:` the live link). `PROOF_METRICS` are DEFENSIBLE only: the shipped-products count (value 6 = `WORK.length`), years building, and one Aleph live metric carried as `value: null, live: true` (filled at runtime by Phase-2's `src/lib/proof.ts`, which looks up the metric whose `id === 'alephNodes'`). Each export parses itself at load via its 1.1 schema.

- [ ] **Step 1: Write the failing test.**

Create `/Users/hodlmedia/forge/src/data/proof.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { PROOF_LOGOS, PROOF_METRICS } from '@/data/proof';
import { WORK } from '@/data/work';

describe('PROOF_LOGOS', () => {
  it('has one wordmark per WORK item (6), derived from WORK', () => {
    expect(PROOF_LOGOS).toHaveLength(WORK.length);
    expect(PROOF_LOGOS.map((l) => l.slug)).toEqual(WORK.map((w) => w.slug));
  });
  it('each logo uses /clients/<slug>.png and the live WORK link', () => {
    for (const logo of PROOF_LOGOS) {
      const w = WORK.find((x) => x.slug === logo.slug)!;
      expect(logo.name).toBe(w.name);
      expect(logo.src).toBe(`/clients/${logo.slug}.png`);
      expect(logo.href).toBe(w.link);
    }
  });
});

describe('PROOF_METRICS', () => {
  it('reports the defensible shipped-products count (6)', () => {
    const shipped = PROOF_METRICS.find((m) => m.id === 'shipped');
    expect(shipped?.value).toBe(WORK.length);
    expect(shipped?.value).toBe(6);
  });
  it('carries a years-building metric', () => {
    expect(PROOF_METRICS.some((m) => m.id === 'years')).toBe(true);
  });
  it('declares the Aleph live metric with value: null, live: true (filled at runtime)', () => {
    const aleph = PROOF_METRICS.find((m) => m.id === 'alephNodes');
    expect(aleph).toBeDefined();
    expect(aleph?.value).toBeNull();
    expect(aleph?.live).toBe(true);
  });
  it('fabricates no live numbers (every live metric starts null)', () => {
    for (const m of PROOF_METRICS) {
      if (m.live) expect(m.value).toBeNull();
    }
  });
});
```

- [ ] **Step 2: Run the test and confirm it FAILS.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/data/proof.test.ts
```

Expected: FAIL — `Failed to resolve import "@/data/proof"`.

- [ ] **Step 3: Implement `src/data/proof.ts`.**

Create `/Users/hodlmedia/forge/src/data/proof.ts`:

```ts
import { z } from 'zod';
import { ProofLogoSchema, ProofMetricSchema, type ProofLogo, type ProofMetric } from '@/lib/schema';
import { WORK } from '@/data/work';

export type { ProofLogo, ProofMetric };

// Portfolio wordmarks derived from WORK (order significant). The salvaged logo
// PNGs live at public/clients/<slug>.png. Parsed at load so bad content fails build.
export const PROOF_LOGOS: ProofLogo[] = z.array(ProofLogoSchema).parse(
  WORK.map((w) => ({
    slug: w.slug,
    name: w.name,
    src: `/clients/${w.slug}.png`,
    href: w.link,
  })),
);

/**
 * DEFENSIBLE proof metrics ONLY — never fabricate numbers.
 *  - `shipped`: the real shipped-product count (WORK.length === 6).
 *  - `years`: years building (defensible, owner-confirmable).
 *  - `alephNodes`: a live Aleph corechannel signal — carried as `value: null,
 *    live: true` and filled at runtime by src/lib/proof.ts (Phase 2), which
 *    merges the fetched value into the metric whose id === 'alephNodes'.
 */
export const PROOF_METRICS: ProofMetric[] = z.array(ProofMetricSchema).parse([
  { id: 'shipped', label: 'Products shipped & live', value: WORK.length, suffix: '+' },
  { id: 'years', label: 'Years building', value: 5, suffix: '+' },
  { id: 'alephNodes', label: 'Aleph network nodes', value: null, live: true },
]);
```

- [ ] **Step 4: Run the test and confirm it PASSES.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/data/proof.test.ts
```

Expected: PASS — `PROOF_LOGOS` mirror the 6 WORK items (slug/name/`/clients/<slug>.png`/live href); `PROOF_METRICS` carry the shipped count (6), a years metric, and the `alephNodes` live metric as `value: null, live: true`.

- [ ] **Step 5: Commit.**

```bash
cd /Users/hodlmedia/forge && git add src/data/proof.ts src/data/proof.test.ts && git commit -m "feat(data): add proof-strip descriptors (portfolio wordmarks + defensible metrics, no fabricated numbers)"
```

---

### Task 1.5: Port hero i18n → `src/data/hero-i18n.ts` (en/fr/de, drop LB)

**Files:**
- Create: `/Users/hodlmedia/forge/src/data/hero-i18n.ts`
- Create: `/Users/hodlmedia/forge/src/data/hero-i18n.test.ts`

> Depends on Task 1.1 (`HeroI18nSchema`, `LocaleSchema`), Task 1.2 (`STUDIO` — EN aliases it), and Phase 0 `site-config.ts` (`type Locale`). Ported from `/Users/hodlmedia/forge/src/components/os/osI18n.ts`; the `lb` entry and the `'lb'` flag row are DROPPED.

- [ ] **Step 1: Write the failing test.**

Create `/Users/hodlmedia/forge/src/data/hero-i18n.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { HERO, LANGS } from '@/data/hero-i18n';
import { STUDIO } from '@/data/studio';

describe('HERO i18n', () => {
  it('has exactly en/fr/de (LB dropped)', () => {
    expect(Object.keys(HERO).sort()).toEqual(['de', 'en', 'fr']);
  });
  it('en aliases STUDIO', () => {
    expect(HERO.en.tagline).toBe(STUDIO.tagline);
    expect(HERO.en.sub).toBe(STUDIO.sub);
    expect(HERO.en.welcomeLead).toBe(STUDIO.welcomeLead);
    expect(HERO.en.hint).toBe(STUDIO.hint);
  });
  it('fr/de carry localized taglines and CTA labels', () => {
    expect(HERO.fr.tagline).toBe('Des sites qui pensent, bougent et transigent.');
    expect(HERO.fr.newProject).toBe('Nouveau projet ▸');
    expect(HERO.de.tagline).toBe('Websites, die denken, bewegen und handeln.');
    expect(HERO.de.newProject).toBe('Neues Projekt ▸');
  });
  it('every locale has a seeWork label', () => {
    for (const k of ['en', 'fr', 'de'] as const) {
      expect(HERO[k].seeWork.length).toBeGreaterThan(0);
    }
  });
});

describe('LANGS', () => {
  it('lists exactly en/fr/de in order (LB dropped)', () => {
    expect(LANGS.map((l) => l.code)).toEqual(['en', 'fr', 'de']);
  });
  it('each lang has a flag and label', () => {
    for (const l of LANGS) {
      expect(l.flag.length).toBeGreaterThan(0);
      expect(l.label.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run the test and confirm it FAILS.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/data/hero-i18n.test.ts
```

Expected: FAIL — `Failed to resolve import "@/data/hero-i18n"`.

- [ ] **Step 3: Implement `src/data/hero-i18n.ts`.**

Create `/Users/hodlmedia/forge/src/data/hero-i18n.ts`:

```ts
import type { Locale } from '@/lib/site-config';
import { HeroI18nSchema, type Hero } from '@/lib/schema';
import { STUDIO } from '@/data/studio';

export type { Hero };

// Ported from src/components/os/osI18n.ts (HERO). EN aliases STUDIO; FR/DE are
// hardcoded literals. The LB entry has been DROPPED (locale set is en/fr/de).
export const HERO: Record<Locale, Hero> = HeroI18nSchema.parse({
  en: {
    tagline: STUDIO.tagline,
    sub: STUDIO.sub,
    welcomeLead: STUDIO.welcomeLead,
    hint: STUDIO.hint,
    newProject: 'New Project ▸',
    seeWork: 'See our work',
  },
  fr: {
    tagline: 'Des sites qui pensent, bougent et transigent.',
    sub: 'Une agence IA au Luxembourg.',
    welcomeLead:
      'On conçoit et développe vos produits digitaux de A à Z — rendus intelligents par l’IA, portés on-chain quand ça apporte vraiment, hébergés en Europe et marketés pour grandir. Un seul studio responsable, du concret livré, zéro promesse en l’air.',
    hint: 'Double-cliquez sur une icône pour découvrir ce qu’on fait — ou lancez « Nouveau projet ».',
    newProject: 'Nouveau projet ▸',
    seeWork: 'Voir nos réalisations',
  },
  de: {
    tagline: 'Websites, die denken, bewegen und handeln.',
    sub: 'Eine KI-Agentur in Luxemburg.',
    welcomeLead:
      'Wir gestalten und entwickeln digitale Produkte von A bis Z — smart gemacht mit KI, on-chain gebracht, wo es echten Mehrwert schafft, in Europa gehostet und für Wachstum vermarktet. Ein Studio mit voller Verantwortung, echte fertige Arbeit, kein Blendwerk.',
    hint: 'Doppelklicken Sie auf ein Icon, um zu sehen, was wir tun — oder starten Sie „Neues Projekt".',
    newProject: 'Neues Projekt ▸',
    seeWork: 'Unsere Arbeiten ansehen',
  },
}) as Record<Locale, Hero>;

export const LANGS: { code: Locale; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
];
```

- [ ] **Step 4: Run the test and confirm it PASSES.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/data/hero-i18n.test.ts
```

Expected: PASS — `HERO i18n` (en/fr/de only, EN aliases STUDIO, fr/de literals) and `LANGS` (en/fr/de in order) suites green.

- [ ] **Step 5: Commit.**

```bash
cd /Users/hodlmedia/forge && git add src/data/hero-i18n.ts src/data/hero-i18n.test.ts && git commit -m "feat(i18n): port hero strings to src/data/hero-i18n for en/fr/de (drop LB)"
```

---

### Task 1.6: Design tokens (`src/styles/tokens.css`) + Tailwind theme + globals wiring

**Files:**
- Create: `/Users/hodlmedia/forge/src/styles/tokens.css`
- Modify: `/Users/hodlmedia/forge/tailwind.config.js`
- Modify: `/Users/hodlmedia/forge/src/app/globals.css`

> No logic unit — verified by the build green-gate (Task 1.13) and the manual reduced-motion check. Palette + motion token values are VERBATIM from the contracts (§7 motion tokens, §8 monochrome palette). The current `globals.css` carries the old light theme and quiz animations; this task strips them to Tailwind directives + the token import + a base body using the new tokens. Tailwind theme maps to the token CSS vars and drops the old blue/purple `primary`/`accent`/`navy`.

- [ ] **Step 1: Create `src/styles/tokens.css` (palette + motion tokens + reduced-motion kill-switch).**

Create `/Users/hodlmedia/forge/src/styles/tokens.css`:

```css
/* The ONLY place design tokens are defined. Components reference these vars —
   never raw hex, never ad-hoc ease/durations. Monochrome / "white-hot": light
   itself is the accent. One reserved-but-unused accent slot (--accent). */
:root {
  /* ---- palette (monochrome / white-hot) ---- */
  --bg: #0b0b0c; /* page base (near-black) */
  --surface: #141416; /* cards, raised surfaces */
  --surface-2: #1a1c1f; /* nested surfaces, inputs */
  --text: #fafaf7; /* primary text (off-white) */
  --text-dim: #a1a1a6; /* secondary text */
  --hairline: rgba(255, 255, 255, 0.1); /* rules, borders, dividers */
  --hot: #ffffff; /* "white-hot" — hover/active/emphasis (de-facto accent) */

  --accent: var(--hot); /* RESERVED slot, == --hot at launch */

  /* ---- easing ---- */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* default */
  --ease-fast: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* delight only */

  /* ---- duration (keep ~everything < 300ms) ---- */
  --dur-fast: 100ms;
  --dur-base: 200ms;
  --dur-slow: 300ms;

  /* ---- stagger (word/line reveals 30–60ms range) ---- */
  --stagger: 40ms;
}

/* global kill-switch — reduced ≠ stripped (fades remain near-instant) */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Replace `tailwind.config.js` — map theme colors to the token CSS vars; drop blue/purple/navy.**

Replace the entire contents of `/Users/hodlmedia/forge/tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        text: 'var(--text)',
        'text-dim': 'var(--text-dim)',
        hairline: 'var(--hairline)',
        hot: 'var(--hot)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        fast: 'var(--ease-fast)',
        spring: 'var(--ease-spring)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
      },
    },
  },
  plugins: [],
};
```

> The `--font-display` / `--font-body` / `--font-mono` CSS vars are provided by Task 1.7 (`src/lib/fonts.ts` via `next/font`). Referencing them here is intentional; until 1.7 lands the fallback stack applies.

- [ ] **Step 3: Replace `src/app/globals.css` — import tokens, strip the old light theme + quiz animations.**

Replace the entire contents of `/Users/hodlmedia/forge/src/app/globals.css` with:

```css
@import '../styles/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  background: var(--bg);
  color-scheme: dark;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection {
  background: var(--hot);
  color: var(--bg);
}
```

- [ ] **Step 4: Verify the config edits did not break TypeScript.**

```bash
cd /Users/hodlmedia/forge && npm run typecheck
```

Expected: PASS — `tsc --noEmit` exits 0 (CSS changes do not affect typecheck; this confirms the JS/CSS edits left the TS surface clean).

- [ ] **Step 5: Commit.**

```bash
cd /Users/hodlmedia/forge && git add src/styles/tokens.css tailwind.config.js src/app/globals.css && git commit -m "feat(tokens): add monochrome palette + motion tokens and wire Tailwind theme and globals"
```

---

### Task 1.7: Self-host fonts via `next/font` — `src/lib/fonts.ts`

**Files:**
- Create: `/Users/hodlmedia/forge/src/lib/fonts.ts`
- Create: `/Users/hodlmedia/forge/src/lib/fonts.test.ts`

> No DOM render here — `next/font/google` self-hosts at build time and exposes a `variable` CSS-var class. The spec locks font ROLES (display + body + mono), `latin` + `latin-ext` subsets (FR/DE diacritics). Display = a high-contrast grotesque (Space Grotesk), Body = a clean humanist grotesque (Inter), Mono = JetBrains Mono. The CSS vars (`--font-display`, `--font-body`, `--font-mono`) are the ones Task 1.4's Tailwind theme already references. Test asserts the exported `variable` strings (deterministic with `next/font`) and that `fontVariables` joins all three class names.

- [ ] **Step 1: Write the failing test.**

Create `/Users/hodlmedia/forge/src/lib/fonts.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { fontVariables, display, body, mono } from '@/lib/fonts';

describe('fonts', () => {
  it('exposes the three CSS-var class names', () => {
    expect(display.variable).toBe('--font-display');
    expect(body.variable).toBe('--font-body');
    expect(mono.variable).toBe('--font-mono');
  });
  it('fontVariables joins all three class names', () => {
    expect(fontVariables).toContain(display.className);
    expect(fontVariables).toContain(body.className);
    expect(fontVariables).toContain(mono.className);
  });
});
```

- [ ] **Step 2: Run the test and confirm it FAILS.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/fonts.test.ts
```

Expected: FAIL — `Failed to resolve import "@/lib/fonts"` (the module does not exist yet).

- [ ] **Step 3: Implement `src/lib/fonts.ts`.**

Create `/Users/hodlmedia/forge/src/lib/fonts.ts`:

```ts
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

// Display — high-contrast grotesque with character (H1, large display type).
export const display = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Body — clean humanist/grotesque sans (running text, UI).
export const body = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

// Mono — kickers / metric labels / genuine technical accents, used sparingly.
export const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// Apply on <html> so all three CSS vars are available everywhere.
export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
```

- [ ] **Step 4: Run the test and confirm it PASSES.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/fonts.test.ts
```

Expected: PASS — `fonts` suite green (`display`/`body`/`mono` expose `--font-*` variables; `fontVariables` contains all three class names).

- [ ] **Step 5: Commit.**

```bash
cd /Users/hodlmedia/forge && git add src/lib/fonts.ts src/lib/fonts.test.ts && git commit -m "feat(tokens): self-host display/body/mono fonts via next/font with latin+latin-ext"
```

---

### Task 1.8: Motion primitives — `Reveal`, `CountUp`, `MagneticButton`, `HoverCard`, `Hairline`

**Files:**
- Create: `/Users/hodlmedia/forge/src/components/ui/Reveal.tsx`
- Create: `/Users/hodlmedia/forge/src/components/ui/CountUp.tsx`
- Create: `/Users/hodlmedia/forge/src/components/ui/MagneticButton.tsx`
- Create: `/Users/hodlmedia/forge/src/components/ui/HoverCard.tsx`
- Create: `/Users/hodlmedia/forge/src/components/ui/Hairline.tsx`
- Create: `/Users/hodlmedia/forge/src/components/ui/Reveal.test.tsx`
- Create: `/Users/hodlmedia/forge/src/components/ui/CountUp.test.tsx`
- Create: `/Users/hodlmedia/forge/src/components/ui/MagneticButton.test.tsx`

> This is the CANONICAL primitive set Phase 2 consumes. The signatures are locked to EXACTLY what Phase 2 calls: `MagneticButton` supports `asChild` (wraps a passed `<Link>`/`<a>`), an `href` anchor mode, AND a default `<button>` that forwards `type`/`disabled`/`onClick` (so `EnquiryForm` can submit through it); `Reveal` is polymorphic via `as?: 'p'|'li'|'span'|'div'|'h2'|'ul'` (default `'div'`) with a `stagger?` step and `className?`, and NEVER wraps the LCP node; `CountUp` takes `to: number`, `suffix?`, `className?`; `Hairline` and `HoverCard` take `className?` (+ children). All animating primitives are `'use client'` with reduced-motion built in via `useReducedMotion()` from `motion/react`. `motion` (Motion / ex-Framer Motion) is already installed (Phase 0). `Hairline` is a pure Server component (no `'use client'`). `vitest.setup.ts` (Phase 0) already stubs `matchMedia` and `IntersectionObserver`; the tests override `matchMedia` per-case to toggle reduced-motion. Per the format rule for motion primitives, tests are render + reduced-motion (not full TDD-first logic), but we still write the test, watch it fail, then implement.

- [ ] **Step 1: Write the render + reduced-motion tests.**

Create `/Users/hodlmedia/forge/src/components/ui/Reveal.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Reveal } from '@/components/ui/Reveal';

function setReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('reduce') ? reduce : !reduce,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('Reveal', () => {
  beforeEach(() => cleanup());

  it('always renders its children content (SSR/crawler safe)', () => {
    setReducedMotion(false);
    render(<Reveal>Hello world</Reveal>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('reduced-motion: content visible at full opacity', () => {
    setReducedMotion(true);
    render(<Reveal data-testid="r">Quiet content</Reveal>);
    expect(screen.getByTestId('r')).toBeInTheDocument();
    expect(screen.getByText('Quiet content')).toBeVisible();
  });

  it('no-preference: still renders children (animation is progressive enhancement)', () => {
    setReducedMotion(false);
    render(<Reveal data-testid="r2">Animated content</Reveal>);
    expect(screen.getByTestId('r2')).toBeInTheDocument();
  });

  it('is polymorphic via `as` (renders the requested tag)', () => {
    setReducedMotion(true);
    const { container } = render(
      <Reveal as="li" stagger={2} className="x">
        Item
      </Reveal>,
    );
    expect(container.querySelector('li')).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeVisible();
  });
});
```

Create `/Users/hodlmedia/forge/src/components/ui/CountUp.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { CountUp } from '@/components/ui/CountUp';

function setReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('reduce') ? reduce : !reduce,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('CountUp', () => {
  beforeEach(() => cleanup());

  it('reduced-motion: renders the final value immediately (no animation)', () => {
    setReducedMotion(true);
    render(<CountUp to={42} suffix="+" />);
    expect(screen.getByText('42+')).toBeInTheDocument();
  });

  it('renders a numeric final value', () => {
    setReducedMotion(false);
    render(<CountUp to={6} />);
    // the final value is always present as text content
    expect(screen.getByText(/6/)).toBeInTheDocument();
  });
});
```

Create `/Users/hodlmedia/forge/src/components/ui/MagneticButton.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MagneticButton } from '@/components/ui/MagneticButton';

function setReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('reduce') ? reduce : !reduce,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('MagneticButton', () => {
  beforeEach(() => cleanup());

  it('renders as an anchor when given an href', () => {
    setReducedMotion(false);
    render(<MagneticButton href="#enquiry">Start a project</MagneticButton>);
    const link = screen.getByRole('link', { name: 'Start a project' });
    expect(link).toHaveAttribute('href', '#enquiry');
  });

  it('renders a real <button> (forwarding type) when no href is given', () => {
    setReducedMotion(false);
    render(
      <MagneticButton type="submit" onClick={() => {}}>
        Send
      </MagneticButton>,
    );
    const btn = screen.getByRole('button', { name: 'Send' });
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('asChild wraps a passed child (e.g. a Next Link) instead of emitting its own element', () => {
    setReducedMotion(false);
    render(
      <MagneticButton asChild>
        <a href="/work">See our work</a>
      </MagneticButton>,
    );
    const link = screen.getByRole('link', { name: 'See our work' });
    expect(link).toHaveAttribute('href', '/work');
  });

  it('reduced-motion: still renders the link (magnet disabled, label intact)', () => {
    setReducedMotion(true);
    render(<MagneticButton href="/contact">Start a project</MagneticButton>);
    expect(screen.getByRole('link', { name: 'Start a project' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests and confirm they FAIL.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/components/ui/Reveal.test.tsx src/components/ui/CountUp.test.tsx src/components/ui/MagneticButton.test.tsx
```

Expected: FAIL — `Failed to resolve import "@/components/ui/Reveal"` (and CountUp, MagneticButton).

- [ ] **Step 3: Create `Reveal`.**

Create `/Users/hodlmedia/forge/src/components/ui/Reveal.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/** Tags Reveal can render as. NEVER include the LCP H1 here by usage. */
export type RevealTag = 'p' | 'li' | 'span' | 'div' | 'h2' | 'ul';

export interface RevealProps {
  children: ReactNode;
  /** Stagger step for sequenced reveals (multiplied by --stagger ≈ 40ms). */
  stagger?: number;
  /** Element tag to render. Default 'div'. NEVER wrap the LCP node. */
  as?: RevealTag;
  className?: string;
  'data-testid'?: string;
}

/**
 * Below-fold entrance reveal. Progressive enhancement: children are always in
 * the DOM and fully visible by default; motion only adds a transform/opacity
 * entrance when motion is allowed. reduced-motion => rendered statically.
 * Do NOT use this on the LCP H1 (it must paint at opacity:1 on first paint).
 */
export function Reveal({ children, stagger = 0, as = 'div', className, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // SSR + reduced-motion: static, fully visible.
  if (reduce || !mounted) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: stagger * 0.04 }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
```

- [ ] **Step 4: Create `CountUp`.**

Create `/Users/hodlmedia/forge/src/components/ui/CountUp.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export interface CountUpProps {
  to: number;
  suffix?: string;
  /** Animation length in ms (kept short; tokens cap motion near 300ms). */
  durationMs?: number;
  className?: string;
}

/**
 * Counts up to `to` when scrolled into view. The final value (with suffix)
 * is always the rendered text, so SSR/crawlers and reduced-motion users see
 * the real number immediately.
 */
export function CountUp({ to, suffix = '', durationMs = 900, className }: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(reduce ? to : 0);
  const [started, setStarted] = useState(reduce);

  useEffect(() => {
    if (reduce) {
      setDisplay(to);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [reduce, to]);

  useEffect(() => {
    if (!started || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reduce, to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 5: Create `MagneticButton`.**

Create `/Users/hodlmedia/forge/src/components/ui/MagneticButton.tsx`:

```tsx
'use client';

import { useRef, cloneElement, isValidElement } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import type { ReactNode, ReactElement, MouseEvent } from 'react';

export interface MagneticButtonProps {
  children: ReactNode;
  /** When set, render an <a> (or motion.a) instead of a <button>. */
  href?: string;
  /** When true, wrap a passed child (e.g. a Next <Link>) instead of emitting
   *  our own element — the child becomes the magnetic, interactive node. */
  asChild?: boolean;
  /** Button type when rendering a <button>. */
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  /** How far the button drifts toward the cursor, in px. */
  strength?: number;
}

/**
 * Primary CTA that drifts toward the cursor (transform only). The magnet is
 * gated behind prefers-reduced-motion: no-preference — reduced-motion renders
 * a plain, fully-interactive element. Three modes:
 *   - `asChild`: clone the passed child (Link/anchor) and make IT magnetic.
 *   - `href`:    render an anchor (role="link").
 *   - default:   render a real <button> (forwards `type`, so it can submit).
 */
export function MagneticButton({
  children,
  href,
  asChild = false,
  type = 'button',
  disabled,
  className,
  onClick,
  strength = 12,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  function onMove(e: MouseEvent<HTMLElement>) {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;
    const r = node.getBoundingClientRect();
    const relX = e.clientX - (r.left + r.width / 2);
    const relY = e.clientY - (r.top + r.height / 2);
    x.set((relX / (r.width / 2)) * strength);
    y.set((relY / (r.height / 2)) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  // --- asChild: clone the single child, attaching handlers + className. ---
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    const childProps = child.props;
    const merged: Record<string, unknown> = {
      className: [className, childProps.className].filter(Boolean).join(' ') || undefined,
      onClick,
    };
    if (!reduce) {
      merged.onMouseMove = onMove;
      merged.onMouseLeave = onLeave;
      merged.ref = ref;
    }
    return cloneElement(child, merged);
  }

  // --- reduced-motion: plain element, no magnet. ---
  if (reduce) {
    return href ? (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={className} onClick={onClick}>
        {children}
      </a>
    ) : (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        className={className}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  // --- no-preference: magnetic element. ---
  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={className}
        onClick={onClick}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ x: sx, y: sy }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={className}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.button>
  );
}
```

- [ ] **Step 6: Create `HoverCard`.**

Create `/Users/hodlmedia/forge/src/components/ui/HoverCard.tsx`:

```tsx
'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export interface HoverCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card that grows slightly from its own origin on hover (transform + opacity
 * only — never width/height/margin). reduced-motion => no scale.
 */
export function HoverCard({ children, className }: HoverCardProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'center' }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 7: Create `Hairline` (Server component — no `'use client'`).**

Create `/Users/hodlmedia/forge/src/components/ui/Hairline.tsx`:

```tsx
export interface HairlineProps {
  /** Render the centered signal-glyph divider instead of a plain rule. */
  glyph?: boolean;
  className?: string;
}

/**
 * Hairline rule / signal-glyph divider. Pure Server component — no motion,
 * no client JS. Uses the --hairline token via Tailwind's hairline color.
 */
export function Hairline({ glyph = false, className }: HairlineProps) {
  if (!glyph) {
    return <hr className={`border-0 border-t border-hairline ${className ?? ''}`} />;
  }
  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`} role="separator">
      <span className="h-px flex-1 bg-hairline" />
      <span aria-hidden="true" className="font-mono text-xs text-text-dim">
        ✳
      </span>
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}
```

- [ ] **Step 8: Run the tests and confirm they PASS.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/components/ui/Reveal.test.tsx src/components/ui/CountUp.test.tsx src/components/ui/MagneticButton.test.tsx
```

Expected: PASS — `Reveal` (children render + reduced-motion visible + polymorphic `as`), `CountUp` (final `to` value immediate under reduced-motion), `MagneticButton` (anchor via `href`, real `<button>` forwarding `type` when no `href`, `asChild` clone wrapping a passed link; magnet disabled under reduced-motion) suites green.

- [ ] **Step 9: Typecheck the new primitives compile cleanly.**

```bash
cd /Users/hodlmedia/forge && npm run typecheck
```

Expected: PASS — `tsc --noEmit` exits 0.

- [ ] **Step 10: Commit.**

```bash
cd /Users/hodlmedia/forge && git add src/components/ui/Reveal.tsx src/components/ui/CountUp.tsx src/components/ui/MagneticButton.tsx src/components/ui/HoverCard.tsx src/components/ui/Hairline.tsx src/components/ui/Reveal.test.tsx src/components/ui/CountUp.test.tsx src/components/ui/MagneticButton.test.tsx && git commit -m "feat(ui): add canonical motion primitives (Reveal, CountUp, MagneticButton, HoverCard, Hairline) with reduced-motion"
```

---

### Task 1.9: Layout-level chrome — `Nav`, `NewsletterForm`, `Footer`

**Files:**
- Create: `/Users/hodlmedia/forge/src/components/Nav.tsx`
- Create: `/Users/hodlmedia/forge/src/components/Nav.test.tsx`
- Create: `/Users/hodlmedia/forge/src/components/NewsletterForm.tsx`
- Create: `/Users/hodlmedia/forge/src/components/NewsletterForm.test.tsx`
- Create: `/Users/hodlmedia/forge/src/components/Footer.tsx`
- Create: `/Users/hodlmedia/forge/src/components/Footer.test.tsx`

> ARCHITECTURE DECISION (locked): Nav, Footer and NewsletterForm are **layout-level** components rendered ONCE in `src/app/[locale]/layout.tsx` (Task 1.12) around `{children}`. There is NO `'footer'` Section variant and NO `FooterSection` component — every page (home, /work, /about, …) inherits this one Nav + Footer from the layout and does NOT render its own. Depends on Task 1.3 (`NAV`, `FOOTER`, `START_PROJECT`), Task 1.5 (`LANGS`), Task 1.1 (`NewsletterSchema`), and Phase 0 `site-config.ts` (`localeUrl`, `siteConfig.brand.legalEntity`, `type Locale`). `Nav` and `NewsletterForm` are `'use client'`; `Footer` is a Server component that renders the `FOOTER` columns + `siteConfig.brand.legalEntity` and embeds `<NewsletterForm/>`.

- [ ] **Step 1: Write the failing Nav test.**

Create `/Users/hodlmedia/forge/src/components/Nav.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Nav } from '@/components/Nav';
import { NAV, START_PROJECT } from '@/data/nav';
import { LANGS } from '@/data/hero-i18n';

describe('Nav', () => {
  it('renders the 4 flat nav links', () => {
    render(<Nav locale="en" />);
    expect(NAV).toHaveLength(4);
    for (const item of NAV) {
      expect(screen.getByRole('link', { name: item.label })).toBeInTheDocument();
    }
  });

  it('renders the persistent Start a project CTA', () => {
    render(<Nav locale="en" />);
    expect(screen.getByRole('link', { name: START_PROJECT })).toBeInTheDocument();
  });

  it('renders an en/fr/de language switch', () => {
    render(<Nav locale="en" />);
    expect(LANGS.map((l) => l.code)).toEqual(['en', 'fr', 'de']);
    for (const lang of LANGS) {
      expect(screen.getByRole('link', { name: new RegExp(lang.label, 'i') })).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Write the failing NewsletterForm test.**

Create `/Users/hodlmedia/forge/src/components/NewsletterForm.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewsletterForm } from '@/components/NewsletterForm';

afterEach(() => vi.restoreAllMocks());

describe('NewsletterForm', () => {
  it('posts the email to /api/newsletter', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<NewsletterForm />);
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledOnce());
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('/api/newsletter');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ email: 'ada@example.com' });
    expect(await screen.findByText(/subscribed|thanks/i)).toBeInTheDocument();
  });

  it('treats alreadySubscribed as success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true, alreadySubscribed: true }), { status: 200 }),
    );
    const user = userEvent.setup();
    render(<NewsletterForm />);
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));
    expect(await screen.findByText(/already|subscribed|thanks/i)).toBeInTheDocument();
  });

  it('rejects an invalid email before fetching', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const user = userEvent.setup();
    render(<NewsletterForm />);
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Write the failing Footer test.**

Create `/Users/hodlmedia/forge/src/components/Footer.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';
import { FOOTER } from '@/data/nav';
import { siteConfig } from '@/lib/site-config';

describe('Footer', () => {
  it('renders the 4 footer columns', () => {
    const { container } = render(<Footer locale="en" />);
    expect(container.querySelectorAll('[data-footer-col]')).toHaveLength(4);
    for (const col of FOOTER) {
      expect(screen.getByText(col.heading)).toBeInTheDocument();
    }
  });

  it('renders the Commit Media legal entity line', () => {
    render(<Footer locale="en" />);
    expect(screen.getByText(siteConfig.brand.legalEntity)).toBeInTheDocument();
    expect(screen.getByText(/B276192/)).toBeInTheDocument();
  });

  it('embeds the newsletter form', () => {
    const { container } = render(<Footer locale="en" />);
    expect(container.querySelector('[data-newsletter-form]')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the three tests and confirm they FAIL.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/components/Nav.test.tsx src/components/NewsletterForm.test.tsx src/components/Footer.test.tsx
```

Expected: FAIL — `Failed to resolve import "@/components/Nav"` (and `NewsletterForm`, `Footer`).

- [ ] **Step 5: Implement `Nav` (`'use client'`).**

Create `/Users/hodlmedia/forge/src/components/Nav.tsx`:

```tsx
'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/site-config';
import { localeUrl } from '@/lib/site-config';
import { NAV, START_PROJECT } from '@/data/nav';
import { LANGS } from '@/data/hero-i18n';

export function Nav({ locale }: { locale: Locale }) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return (
    <nav data-nav className="flex items-center justify-between px-6 py-4">
      <Link href={`${prefix}/`} className="font-semibold text-text">
        Openletz
      </Link>
      <ul role="list" className="hidden items-center gap-6 md:flex">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link href={`${prefix}${item.href}`} className="text-text-dim hover:text-hot">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4">
        <ul role="list" className="flex items-center gap-2" aria-label="Language">
          {LANGS.map((lang) => (
            <li key={lang.code}>
              <Link
                href={localeUrl(lang.code)}
                aria-label={lang.label}
                aria-current={lang.code === locale ? 'true' : undefined}
                className="text-sm text-text-dim hover:text-hot"
                data-active={lang.code === locale}
              >
                {lang.flag} {lang.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={`${prefix}/#enquiry`} className="ol-btn" data-cta>
          {START_PROJECT}
        </Link>
      </div>
    </nav>
  );
}
```

> NOTE: `NAV` is the 4 flat links; `START_PROJECT` is the persistent CTA verb (rendered as the high-contrast button, NOT one of the `NAV` links) — together they are the "flat 5-item nav" of spec §6. Language `aria-label`s come from `LANGS[].label`; the test matches those.

- [ ] **Step 6: Implement `NewsletterForm` (`'use client'`).**

Create `/Users/hodlmedia/forge/src/components/NewsletterForm.tsx`:

```tsx
'use client';

import { useState, type FormEvent } from 'react';
import { NewsletterSchema } from '@/lib/schema';

type Status = 'idle' | 'submitting' | 'success' | 'already' | 'error';

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const candidate = { email: String(fd.get('email') ?? '').trim() };

    const parsed = NewsletterSchema.safeParse(candidate);
    if (!parsed.success) {
      setStatus('error');
      setError('Please enter a valid email.');
      return;
    }

    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        alreadySubscribed?: boolean;
        error?: string;
      };
      if (res.ok && data.success) {
        setStatus(data.alreadySubscribed ? 'already' : 'success');
        return;
      }
      setStatus('error');
      setError(data.error ?? 'Something went wrong.');
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  }

  if (status === 'success' || status === 'already') {
    return (
      <p data-newsletter-done className="text-text-dim text-sm">
        {status === 'already' ? 'You’re already subscribed — thanks.' : 'Subscribed — thanks.'}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2" data-newsletter-form>
      <label htmlFor="nl-email" className="text-text-dim text-sm">
        Email
      </label>
      <div className="flex gap-2">
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          maxLength={500}
          className="ol-input flex-1"
        />
        <button type="submit" disabled={status === 'submitting'} className="ol-btn">
          {status === 'submitting' ? '…' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && <p role="alert" className="text-text-dim text-xs">{error}</p>}
    </form>
  );
}
```

- [ ] **Step 7: Implement `Footer` (Server component; embeds `NewsletterForm`).**

Create `/Users/hodlmedia/forge/src/components/Footer.tsx`:

```tsx
import Link from 'next/link';
import type { Locale } from '@/lib/site-config';
import { siteConfig } from '@/lib/site-config';
import { FOOTER } from '@/data/nav';
import { NewsletterForm } from '@/components/NewsletterForm';

export function Footer({ locale }: { locale: Locale }) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  // External links (mailto:, https://) keep their absolute href; internal
  // page links get the locale prefix.
  const resolve = (href: string) =>
    /^(https?:|mailto:|#)/.test(href) ? href : `${prefix}${href}`;

  return (
    <footer data-footer className="border-t border-hairline px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-4">
          {FOOTER.map((col) => (
            <div key={col.heading} data-footer-col>
              <h3 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                {col.heading}
              </h3>
              <ul role="list" className="mt-4 grid gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={resolve(l.href)} className="text-text-dim hover:text-hot">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 max-w-md">
          <NewsletterForm />
        </div>
        <p className="mt-12 text-sm text-text-dim">{siteConfig.brand.legalEntity}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 8: Run the three tests and confirm they PASS.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/components/Nav.test.tsx src/components/NewsletterForm.test.tsx src/components/Footer.test.tsx
```

Expected: PASS — `Nav` (4 links + CTA + en/fr/de switch), `NewsletterForm` (posts to /api/newsletter, alreadySubscribed-as-success, invalid-email guard), `Footer` (4 columns + legal entity + embedded newsletter form) suites green.

- [ ] **Step 9: Typecheck.**

```bash
cd /Users/hodlmedia/forge && npm run typecheck
```

Expected: PASS — `tsc --noEmit` exits 0.

- [ ] **Step 10: Commit.**

```bash
cd /Users/hodlmedia/forge && git add src/components/Nav.tsx src/components/Nav.test.tsx src/components/NewsletterForm.tsx src/components/NewsletterForm.test.tsx src/components/Footer.tsx src/components/Footer.test.tsx && git commit -m "feat(ui): add layout-level Nav, NewsletterForm and Footer rendered once around the page"
```

---

### Task 1.10: JSON-LD pure builders — `src/lib/jsonld.ts`

**Files:**
- Create: `/Users/hodlmedia/forge/src/lib/jsonld.ts`
- Create: `/Users/hodlmedia/forge/src/lib/jsonld.test.ts`

> Depends on Phase 0 `src/lib/site-config.ts` (`SITE_URL`, `siteConfig`, `localeUrl`, `type Locale`). Builders are PURE (return plain objects; rendering is the layout's job, Task 1.12, wrapped with `src/lib/safeJsonLd.ts`). KEEP: Organization, ProfessionalService, WebSite, BreadcrumbList, FAQPage. DROP: the WebApplication "Simulateur" block and the grant-simulator HowTo. Agency FAQ content is sourced from `/Users/hodlmedia/forge/public/llms-full.txt` (the "Frequently asked questions" section), replacing the old grants FAQ. Phase 3 ADDS Service/Offer builders later — they are NOT in scope here.

- [ ] **Step 1: Write the failing test.**

Create `/Users/hodlmedia/forge/src/lib/jsonld.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  organizationJsonLd,
  professionalServiceJsonLd,
  webSiteJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  AGENCY_FAQS,
} from '@/lib/jsonld';
import { SITE_URL } from '@/lib/site-config';

function asString(obj: object): string {
  return JSON.stringify(obj);
}

describe('organizationJsonLd', () => {
  const org = organizationJsonLd() as Record<string, unknown>;
  it('uses the openletz.ai apex everywhere (no .com)', () => {
    const s = asString(org);
    expect(s).toContain('openletz.ai');
    expect(s).not.toContain('openletz.com');
  });
  it('has the right @type, @id and email', () => {
    expect(org['@type']).toBe('Organization');
    expect(org['@id']).toBe(`${SITE_URL}/#organization`);
    expect(org.email).toBe('hello@openletz.ai');
    expect(org.email).not.toBe('bob@openletz.com');
  });
  it('uses the brand logo from site-config', () => {
    expect(asString(org)).toContain('/openletz-logo.png');
  });
});

describe('professionalServiceJsonLd', () => {
  const svc = professionalServiceJsonLd() as Record<string, unknown>;
  it('has the localbusiness @id and openletz.ai host', () => {
    expect(svc['@type']).toBe('ProfessionalService');
    expect(svc['@id']).toBe(`${SITE_URL}/#localbusiness`);
    expect(asString(svc)).not.toContain('openletz.com');
    expect(svc.email).toBe('hello@openletz.ai');
  });
});

describe('webSiteJsonLd', () => {
  const site = webSiteJsonLd() as Record<string, unknown>;
  it('replaces the dropped WebApplication with a WebSite node', () => {
    expect(site['@type']).toBe('WebSite');
    expect(site['@id']).toBe(`${SITE_URL}/#website`);
    expect(site.url).toBe(SITE_URL);
  });
  it('does not carry the Simulateur naming', () => {
    expect(asString(site)).not.toContain('Simulateur');
    expect(asString(site)).not.toContain('WebApplication');
  });
});

describe('breadcrumbJsonLd', () => {
  it('builds a BreadcrumbList from items', () => {
    const bc = breadcrumbJsonLd('en', [{ name: 'Home', url: SITE_URL }]) as Record<string, unknown>;
    expect(bc['@type']).toBe('BreadcrumbList');
    const items = bc.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(1);
    expect(items[0].position).toBe(1);
    expect(items[0].name).toBe('Home');
    expect(items[0].item).toBe(SITE_URL);
  });
});

describe('faqJsonLd / AGENCY_FAQS', () => {
  it('AGENCY_FAQS are agency questions (not grants)', () => {
    const joined = AGENCY_FAQS.map((f) => f.q).join(' ');
    expect(joined).toContain('What is Openletz?');
    expect(joined).not.toMatch(/simulateur|éligibilité|grant simulator/i);
  });
  it('faqJsonLd wraps q/a into Question/Answer entities', () => {
    const faq = faqJsonLd(AGENCY_FAQS) as Record<string, unknown>;
    expect(faq['@type']).toBe('FAQPage');
    const main = faq.mainEntity as Array<Record<string, unknown>>;
    expect(main.length).toBe(AGENCY_FAQS.length);
    expect(main[0]['@type']).toBe('Question');
    expect((main[0].acceptedAnswer as Record<string, unknown>)['@type']).toBe('Answer');
  });
});
```

- [ ] **Step 2: Run the test and confirm it FAILS.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/jsonld.test.ts
```

Expected: FAIL — `Failed to resolve import "@/lib/jsonld"`.

- [ ] **Step 3: Implement `src/lib/jsonld.ts`.**

Create `/Users/hodlmedia/forge/src/lib/jsonld.ts`:

```ts
import { SITE_URL, siteConfig, localeUrl, type Locale } from '@/lib/site-config';

/**
 * Agency FAQ — sourced from public/llms-full.txt "Frequently asked questions".
 * Replaces the old grant-simulator FAQ. Consumed by faqJsonLd in the layout.
 */
export const AGENCY_FAQS: { q: string; a: string }[] = [
  {
    q: 'What is Openletz?',
    a: 'Openletz is a Luxembourg AI agency — the studio name of Commit Media S.à r.l. (RCS Luxembourg B276192), run by Clément Fermaud. We build AI agents, chatbots and automations, plus websites and growth, and Web3 when a product needs it.',
  },
  {
    q: 'What does Openletz do?',
    a: 'AI agents and automation (our core), digital and web marketing, and Web3 / on-chain builds when they help. AI tools are chosen with GDPR and the EU AI Act in mind; hosting is in Europe.',
  },
  {
    q: 'How much does it cost?',
    a: 'Every project is quoted per scope, with a fixed quote up front. Productized tiers start from a published "from" price; custom work is scoped per project.',
  },
  {
    q: 'Can Luxembourg companies get funding?',
    a: 'Yes. Projects in Luxembourg may be co-funded through the SME Package. Openletz can advise on scoping a project to fit the programme.',
  },
  {
    q: 'Is the AI work EU AI Act compliant?',
    a: 'AI builds are designed to be EU AI Act-compliant, with GDPR-aware data handling.',
  },
  {
    q: 'Who runs Openletz and where is it based?',
    a: 'Founder Clément Fermaud, in Luxembourg, through Commit Media S.à r.l. (RCS Luxembourg B276192). He also runs marketing for Aleph Cloud.',
  },
  {
    q: 'What languages do you work in?',
    a: 'English (primary), French and German.',
  },
  {
    q: 'What has Openletz shipped?',
    a: 'Vins Fins and La Grocerie (e-commerce), Gategram (Telegram-Stars content product), LiberClaw (personal AI assistant), Ophis (intent-based DEX aggregator), and Skills.ws (marketplace of skills for AI coding assistants).',
  },
];

const KNOWS_ABOUT = [
  'Artificial intelligence',
  'AI automation',
  'AI agents',
  'Web3 development',
  'Smart contracts',
  'Web development',
  'E-commerce',
  'Digital marketing',
  'SEO',
];

/** Organization node — KEEP. @id `${SITE_URL}/#organization`. */
export function organizationJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: siteConfig.brand.name,
    legalName: siteConfig.brand.legalEntity,
    url: SITE_URL,
    logo: siteConfig.brand.logoPng,
    description:
      'Luxembourg AI agency. We build AI agents, chatbots and automation, the websites and shops around them, and Web3 when a product needs it — hosted in Europe.',
    email: siteConfig.brand.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Luxembourg',
      addressCountry: 'LU',
    },
    areaServed: [
      { '@type': 'Country', name: 'Luxembourg' },
      { '@type': 'AdministrativeArea', name: 'Grande Région' },
    ],
    sameAs: [siteConfig.brand.linkedin],
    knowsAbout: KNOWS_ABOUT,
  };
}

/** ProfessionalService (local business) node — KEEP. @id `${SITE_URL}/#localbusiness`. */
export function professionalServiceJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#localbusiness`,
    name: `${siteConfig.brand.name} — Commit Media S.à r.l.`,
    url: SITE_URL,
    logo: siteConfig.brand.logoPng,
    description:
      'Luxembourg AI agency — AI agents and automation, websites, e-commerce and growth, plus Web3 / on-chain builds when they help.',
    email: siteConfig.brand.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Luxembourg',
      addressRegion: 'Luxembourg',
      addressCountry: 'LU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.6117,
      longitude: 6.13,
    },
    areaServed: [
      { '@type': 'Country', name: 'Luxembourg' },
      { '@type': 'AdministrativeArea', name: 'Grande Région' },
    ],
    priceRange: '€€',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [siteConfig.brand.linkedin],
  };
}

/** WebSite node — REPLACES the dropped WebApplication "Simulateur". @id `${SITE_URL}/#website`. */
export function webSiteJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: siteConfig.brand.name,
    url: SITE_URL,
    inLanguage: ['en', 'fr', 'de'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** BreadcrumbList node — KEEP. */
export function breadcrumbJsonLd(_locale: Locale, items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** FAQPage node — KEEP. Content = agency FAQs (AGENCY_FAQS), NOT grants. */
export function faqJsonLd(faqs: { q: string; a: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** Home breadcrumb label per locale (helper for the layout). */
export function homeBreadcrumbLabel(locale: Locale): string {
  if (locale === 'fr') return 'Accueil';
  if (locale === 'de') return 'Startseite';
  return 'Home';
}

// re-export so the layout can build the home crumb URL in one import
export { localeUrl };
```

- [ ] **Step 4: Run the test and confirm it PASSES.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/jsonld.test.ts
```

Expected: PASS — all `jsonld.test.ts` suites green (Organization/ProfessionalService/WebSite use openletz.ai + hello@openletz.ai; WebSite replaces WebApplication and drops "Simulateur"; breadcrumb + FAQ wrap correctly; AGENCY_FAQS are agency not grants).

- [ ] **Step 5: Commit.**

```bash
cd /Users/hodlmedia/forge && git add src/lib/jsonld.ts src/lib/jsonld.test.ts && git commit -m "feat(seo): add pure JSON-LD builders (Organization, ProfessionalService, WebSite, breadcrumb, agency FAQ); drop simulator WebApplication and HowTo"
```

---

### Task 1.11: Domain-fix AEO static files — `public/llms.txt`, `public/llms-full.txt`

**Files:**
- Modify: `/Users/hodlmedia/forge/public/llms.txt`
- Modify: `/Users/hodlmedia/forge/public/llms-full.txt`
- Create: `/Users/hodlmedia/forge/src/lib/aeo.test.ts`

> robots.txt is owned by Phase 0 — do NOT touch it. Both AEO files already point at `openletz.ai` and already carry agency content (no grants). This task adds a presence/host check that fences in that invariant (apex present; no `.com`/`.fr`/`.info`; no grants-era terms; `llms.txt` full-reference points to the apex) and normalizes the language references to the en/fr/de locale set (the files currently still mention Luxembourgish). The test reads the files from disk via `node:fs`.

- [ ] **Step 1: Write the failing presence/host check.**

Create `/Users/hodlmedia/forge/src/lib/aeo.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const llms = readFileSync(resolve(root, 'public/llms.txt'), 'utf8');
const llmsFull = readFileSync(resolve(root, 'public/llms-full.txt'), 'utf8');

describe.each([
  ['llms.txt', llms],
  ['llms-full.txt', llmsFull],
])('%s host + content invariants', (_name, content) => {
  it('points at the openletz.ai apex', () => {
    expect(content).toContain('https://openletz.ai');
  });
  it('never references a dropped/legacy host', () => {
    expect(content).not.toContain('openletz.com');
    expect(content).not.toContain('openletz.fr');
    expect(content).not.toContain('openletz.info');
  });
  it('carries no grants-era language', () => {
    expect(content).not.toMatch(/Fit 4 (Digital|AI|Innovation)/i);
    expect(content).not.toMatch(/simulateur|eligibility simulator|grants simulator/i);
  });
  it('declares the en/fr/de language set only (no Luxembourgish)', () => {
    expect(content).toMatch(/English/);
    expect(content).toMatch(/French/);
    expect(content).toMatch(/German/);
    expect(content).not.toMatch(/Luxembourgish/);
  });
});

describe('llms.txt full-reference pointer', () => {
  it('points to the apex llms-full.txt', () => {
    expect(llms).toContain('https://openletz.ai/llms-full.txt');
  });
});
```

- [ ] **Step 2: Run the test and confirm it FAILS.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/aeo.test.ts
```

Expected: FAIL — the "no Luxembourgish" assertion fails (both files currently list `Luxembourgish` in their language line/FAQ); the host and grants assertions already pass.

- [ ] **Step 3: Normalize the languages line in `public/llms.txt`.**

In `/Users/hodlmedia/forge/public/llms.txt`, replace the line:

```
Languages: English (primary), French, German, Luxembourgish.
```

with:

```
Languages: English (primary), French, German.
```

- [ ] **Step 4: Normalize the three Luxembourgish references in `public/llms-full.txt`.**

In `/Users/hodlmedia/forge/public/llms-full.txt`, make these three exact replacements:

Replace:

```
- Languages: English (primary), French, German, Luxembourgish
```

with:

```
- Languages: English (primary), French, German
```

Replace:

```
We start with a short audit to find the one or two things worth automating first, build a working prototype, then ship it to production. Multilingual (French, English, German, Luxembourgish). Builds are designed to be EU AI Act-compliant.
```

with:

```
We start with a short audit to find the one or two things worth automating first, build a working prototype, then ship it to production. Multilingual (English, French, German). Builds are designed to be EU AI Act-compliant.
```

Replace:

```
English (primary), French, German and Luxembourgish.
```

with:

```
English (primary), French and German.
```

- [ ] **Step 5: Run the test and confirm it PASSES.**

```bash
cd /Users/hodlmedia/forge && npm run test -- src/lib/aeo.test.ts
```

Expected: PASS — both files: apex present; no `.com`/`.fr`/`.info`; no grants terms; en/fr/de only (no Luxembourgish); `llms.txt` points to `https://openletz.ai/llms-full.txt`.

- [ ] **Step 6: Commit.**

```bash
cd /Users/hodlmedia/forge && git add public/llms.txt public/llms-full.txt src/lib/aeo.test.ts && git commit -m "feat(seo): normalize llms AEO files to en/fr/de and fence apex/host invariants with a presence check"
```

---

### Task 1.12: Rewrite `src/app/[locale]/layout.tsx` (JSON-LD builders, self-hosted fonts, layout-level Nav/Footer, en/fr/de metadata + hreflang, consent-gated analytics, noindex guard)

**Files:**
- Modify: `/Users/hodlmedia/forge/src/app/[locale]/layout.tsx`
- Create: `/Users/hodlmedia/forge/src/components/Analytics.tsx`

> Depends on Phase 0 (`src/lib/site-config.ts` exporting `SITE_URL`/`localeUrl`/`LOCALES`/`DEFAULT_LOCALE`/`type Locale`; collapsed `i18n/routing.ts` to en/fr/de) and Tasks 1.7 (`fonts.ts`), 1.9 (`Nav`/`Footer`) + 1.10 (`jsonld.ts`). The current layout imports `@/lib/locale-url`, a hardcoded `.com` SITE_URL, 11-locale maps, grants metadata, and the dropped WebApplication/HowTo JSON-LD; this task replaces all of that. **Nav and Footer are rendered HERE, ONCE, around `{children}`** (`<Nav locale={loc} />` at the top, `<Footer locale={loc} />` at the bottom) — no page renders its own, and there is no `'footer'` Section. The `VERCEL_ENV === 'production'` noindex guard is KEPT. Analytics is consent-gated: GA4/GTM load via `next/script strategy="afterInteractive"` only after a `openletz-consent=granted` flag (cookie or localStorage), and `useReportWebVitals` reports CWV into dataLayer.

- [ ] **Step 1: Create the consent-gated analytics client island (`src/components/Analytics.tsx`).**

Create `/Users/hodlmedia/forge/src/components/Analytics.tsx`:

```tsx
'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Consent-gated analytics. GA4 + GTM only load after the visitor has granted
 * consent (cookie or localStorage flag `openletz-consent=granted`). Core Web
 * Vitals report via useReportWebVitals into dataLayer (a no-op until GTM
 * loads). Scripts use next/script afterInteractive so they never block paint.
 */
export function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const has =
      typeof document !== 'undefined' &&
      (document.cookie.includes('openletz-consent=granted') ||
        window.localStorage.getItem('openletz-consent') === 'granted');
    setConsented(Boolean(has));
  }, []);

  useReportWebVitals((metric) => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: 'web-vitals',
      metric_name: metric.name,
      metric_value: metric.value,
      metric_id: metric.id,
    });
  });

  if (!consented || (!GTM_ID && !GA_ID)) return null;

  return (
    <>
      {GTM_ID ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/[locale]/layout.tsx`.**

Replace the entire contents of `/Users/hodlmedia/forge/src/app/[locale]/layout.tsx` with:

```tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { SITE_URL, LOCALES, DEFAULT_LOCALE, localeUrl, type Locale } from '@/lib/site-config';
import { fontVariables } from '@/lib/fonts';
import {
  organizationJsonLd,
  professionalServiceJsonLd,
  webSiteJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  homeBreadcrumbLabel,
  AGENCY_FAQS,
} from '@/lib/jsonld';
import { Analytics } from '@/components/Analytics';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import Providers from './providers';
import '../globals.css';

// Preview deployments must never be indexed. If hosting ever moves off Vercel,
// re-implement this guard against the new platform's env.
const IS_PRODUCTION_HOST = process.env.VERCEL_ENV === 'production';

const localeOg: Record<Locale, string> = {
  en: 'en_GB',
  fr: 'fr_LU',
  de: 'de_DE',
};

// Per-locale hreflang targeting: Luxembourg + Grande Région + EU expat market.
const hreflangMap: Record<Locale, string[]> = {
  en: ['en', 'en-LU', 'en-GB', 'en-US', 'en-IE'],
  fr: ['fr-LU', 'fr-FR', 'fr-BE', 'fr-CH'],
  de: ['de-LU', 'de-DE', 'de-AT', 'de-CH', 'de-BE'],
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (hasLocale(LOCALES, locale) ? locale : DEFAULT_LOCALE) as Locale;

  const titles: Record<Locale, string> = {
    en: 'Openletz — A Luxembourg AI agency',
    fr: 'Openletz — Une agence IA au Luxembourg',
    de: 'Openletz — Eine KI-Agentur in Luxemburg',
  };

  const descriptions: Record<Locale, string> = {
    en: 'Openletz is a Luxembourg AI agency. We build AI agents, chatbots and automation, the websites and shops around them, and Web3 when it helps — hosted in Europe.',
    fr: 'Openletz est une agence IA au Luxembourg. Nous concevons des agents IA, chatbots et automatisations, les sites et boutiques autour, et du Web3 quand c’est utile — hébergés en Europe.',
    de: 'Openletz ist eine KI-Agentur in Luxemburg. Wir bauen KI-Agenten, Chatbots und Automatisierung, die Websites und Shops dazu und Web3, wenn es hilft — gehostet in Europa.',
  };

  const canonicalUrl = localeUrl(loc);
  const shouldIndex = IS_PRODUCTION_HOST;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    for (const hl of hreflangMap[l]) {
      languages[hl] = localeUrl(l);
    }
  }
  languages['x-default'] = localeUrl(DEFAULT_LOCALE);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: titles[loc],
      template: '%s · Openletz',
    },
    description: descriptions[loc],
    keywords: [
      'Luxembourg AI agency',
      'AI agents',
      'AI automation',
      'chatbots',
      'Next.js websites Luxembourg',
      'e-commerce Luxembourg',
      'Web3 development',
      'EU AI Act',
      'GDPR',
    ],
    authors: [{ name: 'Openletz', url: SITE_URL }],
    creator: 'Openletz — Commit Media S.à r.l.',
    publisher: 'Openletz',
    formatDetection: { telephone: true, email: true },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: titles[loc],
      description: descriptions[loc],
      url: canonicalUrl,
      siteName: 'Openletz',
      locale: localeOg[loc],
      alternateLocale: (Object.values(localeOg) as string[]).filter((v) => v !== localeOg[loc]),
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Openletz — A Luxembourg AI agency',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[loc],
      description: descriptions[loc].slice(0, 200),
      images: [`${SITE_URL}/og-image.png`],
    },
    other: {
      'geo.region': 'LU',
      'geo.placename': 'Luxembourg',
      'geo.position': '49.6117;6.1300',
      ICBM: '49.6117, 6.1300',
      'content-language': loc,
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GSC_VERIFICATION || undefined,
      other: {
        ...(process.env.BING_VERIFICATION ? { 'msvalidate.01': process.env.BING_VERIFICATION } : {}),
        ...(process.env.YANDEX_VERIFICATION
          ? { 'yandex-verification': process.env.YANDEX_VERIFICATION }
          : {}),
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const loc = locale as Locale;
  const messages = await getMessages();

  const breadcrumb = breadcrumbJsonLd(loc, [
    { name: homeBreadcrumbLabel(loc), url: localeUrl(loc) },
  ]);

  return (
    <html lang={loc} className={fontVariables} suppressHydrationWarning>
      <head>
        <Script
          id="json-ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd()) }}
        />
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(webSiteJsonLd()) }}
        />
        <Script
          id="json-ld-localbusiness"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(professionalServiceJsonLd()) }}
        />
        <Script
          id="json-ld-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }}
        />
        <Script
          id="json-ld-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(AGENCY_FAQS)) }}
        />
      </head>
      <body className="antialiased">
        <Analytics />
        <NextIntlClientProvider messages={messages} locale={loc}>
          <Providers>
            {/* Layout-level chrome: ONE Nav + ONE Footer wrap every page. */}
            <Nav locale={loc} />
            {children}
            <Footer locale={loc} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Typecheck to confirm the layout's imports resolve and no `.com`/`locale-url` remains.**

```bash
cd /Users/hodlmedia/forge && npm run typecheck
```

Expected: PASS — `tsc --noEmit` exits 0. The layout resolves `@/lib/site-config`, `@/lib/fonts`, `@/lib/jsonld`, `@/components/Analytics`, `@/components/Nav`, `@/components/Footer`; no `@/lib/locale-url` import and no `https://www.openletz.com` literal remain.

- [ ] **Step 4: Confirm the old grants/`.com` artefacts are gone from the layout.**

```bash
cd /Users/hodlmedia/forge && grep -n "openletz.com\|locale-url\|webAppJsonLd\|howToJsonLd\|Simulateur" "src/app/[locale]/layout.tsx" || echo "CLEAN: no legacy artefacts"
```

Expected: prints `CLEAN: no legacy artefacts` (none of the legacy strings are present in the rewritten layout).

- [ ] **Step 5: Commit.**

```bash
cd /Users/hodlmedia/forge && git add "src/app/[locale]/layout.tsx" src/components/Analytics.tsx && git commit -m "feat(seo): rewrite locale layout with JSON-LD builders, self-hosted fonts, layout-level Nav/Footer, en/fr/de hreflang and consent-gated analytics"
```

---

### Task 1.13: Foundation green-gate — typecheck + unit/component suite + production build

**Files:**
- (no source changes — verification + remediation task)

> At the end of Phase 1 the homepage is still the Phase-0 placeholder. Do NOT assert homepage section content here. Assert that schemas/data/tokens/fonts/jsonld/aeo/layout compile, the unit/component suite passes, and `npm run build` succeeds. The real homepage, `SectionRenderer`, and section components are Phase 2.

- [ ] **Step 1: Run the typecheck and confirm it PASSES.**

```bash
cd /Users/hodlmedia/forge && npm run typecheck
```

Expected: PASS — `tsc --noEmit` exits 0 across `src/lib/schema.ts`, `src/lib/fonts.ts`, `src/lib/jsonld.ts`, `src/lib/aeo.test.ts`, `src/data/*` (incl. `nav.ts`, `proof.ts`), `src/components/ui/*`, `src/components/Nav.tsx`, `src/components/NewsletterForm.tsx`, `src/components/Footer.tsx`, `src/components/Analytics.tsx`, and the rewritten `src/app/[locale]/layout.tsx`.

- [ ] **Step 2: Run the full unit/component test suite and confirm it PASSES.**

```bash
cd /Users/hodlmedia/forge && npm run test
```

Expected: PASS — every Phase 1 suite green: `schema.test.ts`, `data/__tests__/data.test.ts`, `nav.test.ts`, `proof.test.ts`, `hero-i18n.test.ts`, `fonts.test.ts`, `jsonld.test.ts`, `aeo.test.ts`, `ui/Reveal.test.tsx`, `ui/CountUp.test.tsx`, `ui/MagneticButton.test.tsx`, `Nav.test.tsx`, `NewsletterForm.test.tsx`, `Footer.test.tsx` (plus the Phase-0 `site-config`/`redirects` suites). 0 failed.

- [ ] **Step 3: Run the production build and confirm it SUCCEEDS.**

```bash
cd /Users/hodlmedia/forge && npm run build
```

Expected: PASS — `next build` completes with "Compiled successfully" and emits the three locale routes (`/`, `/fr`, `/de`) for the Phase-0 placeholder homepage. The Zod parses in `src/data/*` run at module load with no thrown errors (bad content would fail the build), the self-hosted fonts resolve, and the JSON-LD scripts render in the layout. No type errors, no unresolved imports.

> If the build fails because a Phase-2-owned file (the real `page.tsx`, `SectionRenderer`, or a section component) is referenced but absent, that is OUT OF SCOPE for Phase 1 — the Phase-0 placeholder homepage must build on its own. Do not add Phase 2 files here; fix only Phase 1 foundation regressions.

- [ ] **Step 4: Manual reduced-motion sanity check (one-time, per the testing convention).**

```bash
cd /Users/hodlmedia/forge && PORT=3030 npm run dev
```

Then, with the browser emulating `prefers-reduced-motion: reduce`, open `http://localhost:3030/` and confirm: the page renders, text is visible at full opacity, and no motion spectacle plays. (The page is still the Phase-0 placeholder; this only verifies the tokens' reduced-motion kill-switch and that the primitives degrade gracefully.) Stop the dev server when done.

Expected: page loads, content fully visible, no animation under reduced-motion.

- [ ] **Step 5: Commit the green-gate marker (empty chore commit recording the gate passed).**

```bash
cd /Users/hodlmedia/forge && git commit --allow-empty -m "chore(config): Phase 1 foundation green-gate — typecheck, unit suite and production build pass"
```


---

## Phase 2 — Renderer, homepage sections & MVP pages

### Task 2.1: Homepage section spine — `HOME_SECTIONS: Section[]`

Build the 8-section homepage data spine from the Phase-1 data modules, typed as `Section[]` and validated against the `Section` union shape. TDD: it must parse/typecheck and carry exactly the 8 spec §7 in-page sections in the locked order. The footer (spec §7 row 9) is NOT a section here — it is a layout-level component (`<Footer/>` in `src/app/[locale]/layout.tsx`, Phase 1), so the spine ends at `enquiryForm`.

**Files:**
- `/Users/hodlmedia/forge/src/data/pages/home.ts` (Create)
- `/Users/hodlmedia/forge/src/data/__tests__/home-sections.test.ts` (Create)

- [ ] **Step 1: Write the failing test for the section spine.**
  Create `/Users/hodlmedia/forge/src/data/__tests__/home-sections.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { HOME_SECTIONS } from '@/data/pages/home';
  import type { SectionType } from '@/lib/schema';
  import { STUDIO } from '@/data/studio';
  import { CONTACT } from '@/data/contact';
  import { WORK } from '@/data/work';

  describe('HOME_SECTIONS', () => {
    it('has the 8 spec sections in the locked order (footer is layout-level, not a section)', () => {
      const order: SectionType[] = [
        'hero',
        'proofStrip',
        'servicesGrid',
        'howWeWork',
        'selectedWork',
        'deeperProof',
        'trustBlock',
        'enquiryForm',
      ];
      expect(HOME_SECTIONS.map((s) => s.type)).toEqual(order);
    });

    it('hero carries the locked H1/sub and STUDIO lead', () => {
      const hero = HOME_SECTIONS.find((s) => s.type === 'hero');
      if (hero?.type !== 'hero') throw new Error('no hero');
      expect(hero.h1).toBe('Websites that think, move & transact.');
      expect(hero.sub).toBe('A Luxembourg AI agency.');
      expect(hero.lead).toBe(STUDIO.welcomeLead);
      expect(hero.primaryCta).toEqual({ label: 'Start a project', href: '#enquiry' });
      expect(hero.secondaryCta).toEqual({ label: 'See our work', href: '/work' });
    });

    it('servicesGrid leads with ai and keeps marketing before web3', () => {
      const grid = HOME_SECTIONS.find((s) => s.type === 'servicesGrid');
      if (grid?.type !== 'servicesGrid') throw new Error('no grid');
      expect(grid.order).toEqual(['ai', 'marketing', 'web3']);
      expect(grid.ctaLabel).toBe('Start a project');
      expect(grid.ctaHref).toBe('#enquiry');
    });

    it('selectedWork carries all 6 WORK items and a view-all link', () => {
      const work = HOME_SECTIONS.find((s) => s.type === 'selectedWork');
      if (work?.type !== 'selectedWork') throw new Error('no work');
      expect(work.items).toHaveLength(6);
      expect(work.items).toEqual(WORK);
      expect(work.viewAllHref).toBe('/work');
    });

    it('deeperProof is testimonial-empty-safe and reports the defensible shipped count', () => {
      const proof = HOME_SECTIONS.find((s) => s.type === 'deeperProof');
      if (proof?.type !== 'deeperProof') throw new Error('no deeperProof');
      expect(proof.shippedCount).toBe(WORK.length);
      expect(Array.isArray(proof.testimonials)).toBe(true);
    });

    it('enquiryForm exposes the #enquiry anchor and the 4 CONTACT pillars', () => {
      const form = HOME_SECTIONS.find((s) => s.type === 'enquiryForm');
      if (form?.type !== 'enquiryForm') throw new Error('no enquiryForm');
      expect(form.id).toBe('enquiry');
      expect(form.headline).toBe(CONTACT.lead);
      expect(form.pillars).toEqual(CONTACT.types);
      expect(form.callLine).toBe(CONTACT.callLine);
      expect(form.bookCallHref).toBe('/contact');
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL (module does not exist yet).**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/data/__tests__/home-sections.test.ts
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "@/data/pages/home"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement the section spine.**
  Create `/Users/hodlmedia/forge/src/data/pages/home.ts`:
  ```ts
  import type { Section } from '@/lib/schema';
  import { STUDIO } from '@/data/studio';
  import { SERVICES } from '@/data/services';
  import { WORK } from '@/data/work';
  import { ABOUT } from '@/data/about';
  import { CONTACT } from '@/data/contact';
  import { PROOF_LOGOS, PROOF_METRICS } from '@/data/proof';

  // The locked studio spine (spec §7). Order is significant — do not reorder.
  // Built from the Phase-1 typed data modules; carries ONLY the per-variant props
  // declared by the Section union in src/lib/schema.ts.
  export const HOME_SECTIONS: Section[] = [
    {
      type: 'hero',
      h1: STUDIO.tagline,                 // 'Websites that think, move & transact.'
      sub: STUDIO.sub,                    // 'A Luxembourg AI agency.'
      lead: STUDIO.welcomeLead,
      primaryCta: { label: 'Start a project', href: '#enquiry' },
      secondaryCta: { label: 'See our work', href: '/work' },
    },
    {
      type: 'proofStrip',
      label: 'Shipped & live',
      logos: PROOF_LOGOS,
      metrics: PROOF_METRICS,
    },
    {
      type: 'servicesGrid',
      // order significant: 01 ai (lead), 02 marketing (growth), 03 web3
      order: ['ai', 'marketing', 'web3'],
      ctaLabel: 'Start a project',
      ctaHref: '#enquiry',
    },
    {
      type: 'howWeWork',
      steps: SERVICES.ai.how,             // audit -> clickable prototype -> live with numbers
      smePackageNote: SERVICES.ai.footer ?? '',
      stickyScroll: false,                // GSAP set-piece deferred; stepped reveal at launch
    },
    {
      type: 'selectedWork',
      items: WORK,                        // 6, order significant
      viewAllHref: '/work',
    },
    {
      type: 'deeperProof',
      shippedCount: WORK.length,          // 6 — defensible
      metrics: PROOF_METRICS,             // live signals; never fabricated
      testimonials: [],                   // empty until owner provides — empty-safe
    },
    {
      type: 'trustBlock',
      facts: ABOUT.facts,
      headline: 'European by default.',
    },
    {
      type: 'enquiryForm',
      id: 'enquiry',
      headline: CONTACT.lead,
      pillars: CONTACT.types,
      callLine: CONTACT.callLine,
      bookCallHref: '/contact',
    },
    // NOTE: no `footer` section — the footer is layout-level (<Footer/> in the
    // locale layout). The in-page spine ends at the closing enquiry form.
  ];
  ```

- [ ] **Step 4: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/data/__tests__/home-sections.test.ts
  ```
  Expected output (contains):
  ```
  ✓ src/data/__tests__/home-sections.test.ts (6)
  Test Files  1 passed (1)
  ```

- [ ] **Step 5: Typecheck.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0).

- [ ] **Step 6: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/data/pages/home.ts src/data/__tests__/home-sections.test.ts && git commit -m "feat(data): add HOME_SECTIONS spine for the 8-section homepage"
  ```

---

### Task 2.2: `SectionRenderer` Server Component with exhaustive `never` guard

The Server Component that maps each `Section` to its section component. The switch handles the 8 in-page variants only (NO `footer` — that is layout-level); the `assertNever` default exhaustively guards over those 8. TDD: every known `type` renders its section shell; an unknown discriminant is caught by `assertNever` at runtime and rejected at compile time.

**Files:**
- `/Users/hodlmedia/forge/src/components/SectionRenderer.tsx` (Create)
- `/Users/hodlmedia/forge/src/components/SectionRenderer.test.tsx` (Create)
- `/Users/hodlmedia/forge/src/components/sections/HeroSection.tsx` (Create — placeholder, fleshed out in 2.7)
- `/Users/hodlmedia/forge/src/components/sections/ProofStripSection.tsx` (Create — placeholder, fleshed out in 2.7)
- `/Users/hodlmedia/forge/src/components/sections/ServicesGridSection.tsx` (Create — placeholder, fleshed out in 2.8)
- `/Users/hodlmedia/forge/src/components/sections/HowWeWorkSection.tsx` (Create — placeholder, fleshed out in 2.8)
- `/Users/hodlmedia/forge/src/components/sections/SelectedWorkSection.tsx` (Create — placeholder, fleshed out in 2.8)
- `/Users/hodlmedia/forge/src/components/sections/DeeperProofSection.tsx` (Create — placeholder, fleshed out in 2.8)
- `/Users/hodlmedia/forge/src/components/sections/TrustBlockSection.tsx` (Create — placeholder, fleshed out in 2.8)
- `/Users/hodlmedia/forge/src/components/sections/EnquiryFormSection.tsx` (Create — placeholder, fleshed out in 2.8)

- [ ] **Step 1: Write the failing test.**
  Create `/Users/hodlmedia/forge/src/components/SectionRenderer.test.tsx`:
  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import { SectionRenderer } from '@/components/SectionRenderer';
  import { HOME_SECTIONS } from '@/data/pages/home';
  import type { Section } from '@/lib/schema';
  import type { Locale } from '@/lib/site-config';

  const locale: Locale = 'en';

  describe('SectionRenderer', () => {
    it('renders every section in HOME_SECTIONS without throwing', () => {
      const { container } = render(
        <SectionRenderer sections={HOME_SECTIONS} locale={locale} />,
      );
      // 8 top-level <section> shells, one per variant (footer is layout-level)
      expect(container.querySelectorAll('[data-section]').length).toBe(8);
    });

    it('renders the hero H1 from a single-section list', () => {
      const hero = HOME_SECTIONS.filter((s) => s.type === 'hero');
      render(<SectionRenderer sections={hero} locale={locale} />);
      expect(
        screen.getByRole('heading', { level: 1, name: /think, move & transact/i }),
      ).toBeInTheDocument();
    });

    it('throws on an unknown section type at runtime (assertNever)', () => {
      const bad = [{ type: 'totallyUnknown' } as unknown as Section];
      expect(() => render(<SectionRenderer sections={bad} locale={locale} />)).toThrow(
        /Unhandled section/,
      );
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/SectionRenderer.test.tsx
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "@/components/SectionRenderer"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Create the 8 minimal placeholder section shells so the renderer compiles.**
  Each emits a `data-section` marker (these are the SAME files fully implemented in 2.7/2.8 — placeholders now). Hero must emit a real `<h1>` so the renderer test passes.

  `/Users/hodlmedia/forge/src/components/sections/HeroSection.tsx`:
  ```tsx
  import type { HeroSectionProps } from '@/lib/schema';
  export function HeroSection({ h1 }: HeroSectionProps) {
    return (
      <section data-section="hero">
        <h1>{h1}</h1>
      </section>
    );
  }
  ```
  `/Users/hodlmedia/forge/src/components/sections/ProofStripSection.tsx`:
  ```tsx
  import type { ProofStripSectionProps } from '@/lib/schema';
  export function ProofStripSection({ label }: ProofStripSectionProps) {
    return <section data-section="proofStrip" aria-label={label} />;
  }
  ```
  `/Users/hodlmedia/forge/src/components/sections/ServicesGridSection.tsx`:
  ```tsx
  import type { ServicesGridSectionProps } from '@/lib/schema';
  import type { Locale } from '@/lib/site-config';
  export function ServicesGridSection(_: ServicesGridSectionProps & { locale: Locale }) {
    return <section data-section="servicesGrid" />;
  }
  ```
  `/Users/hodlmedia/forge/src/components/sections/HowWeWorkSection.tsx`:
  ```tsx
  import type { HowWeWorkSectionProps } from '@/lib/schema';
  export function HowWeWorkSection(_: HowWeWorkSectionProps) {
    return <section data-section="howWeWork" />;
  }
  ```
  `/Users/hodlmedia/forge/src/components/sections/SelectedWorkSection.tsx`:
  ```tsx
  import type { SelectedWorkSectionProps } from '@/lib/schema';
  import type { Locale } from '@/lib/site-config';
  export function SelectedWorkSection(_: SelectedWorkSectionProps & { locale: Locale }) {
    return <section data-section="selectedWork" />;
  }
  ```
  `/Users/hodlmedia/forge/src/components/sections/DeeperProofSection.tsx`:
  ```tsx
  import type { DeeperProofSectionProps } from '@/lib/schema';
  export function DeeperProofSection(_: DeeperProofSectionProps) {
    return <section data-section="deeperProof" />;
  }
  ```
  `/Users/hodlmedia/forge/src/components/sections/TrustBlockSection.tsx`:
  ```tsx
  import type { TrustBlockSectionProps } from '@/lib/schema';
  export function TrustBlockSection(_: TrustBlockSectionProps) {
    return <section data-section="trustBlock" />;
  }
  ```
  `/Users/hodlmedia/forge/src/components/sections/EnquiryFormSection.tsx`:
  ```tsx
  import type { EnquiryFormSectionProps } from '@/lib/schema';
  export function EnquiryFormSection({ id }: EnquiryFormSectionProps) {
    return <section data-section="enquiryForm" id={id} />;
  }
  ```

- [ ] **Step 4: Implement the renderer.**
  Create `/Users/hodlmedia/forge/src/components/SectionRenderer.tsx`:
  ```tsx
  import type { Section } from '@/lib/schema';
  import type { Locale } from '@/lib/site-config';
  import { HeroSection } from '@/components/sections/HeroSection';
  import { ProofStripSection } from '@/components/sections/ProofStripSection';
  import { ServicesGridSection } from '@/components/sections/ServicesGridSection';
  import { HowWeWorkSection } from '@/components/sections/HowWeWorkSection';
  import { SelectedWorkSection } from '@/components/sections/SelectedWorkSection';
  import { DeeperProofSection } from '@/components/sections/DeeperProofSection';
  import { TrustBlockSection } from '@/components/sections/TrustBlockSection';
  import { EnquiryFormSection } from '@/components/sections/EnquiryFormSection';

  function assertNever(x: never): never {
    throw new Error(`Unhandled section: ${JSON.stringify(x)}`);
  }

  function renderSection(section: Section, locale: Locale, key: number) {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={key} {...section} />;
      case 'proofStrip':
        return <ProofStripSection key={key} {...section} />;
      case 'servicesGrid':
        return <ServicesGridSection key={key} {...section} locale={locale} />;
      case 'howWeWork':
        return <HowWeWorkSection key={key} {...section} />;
      case 'selectedWork':
        return <SelectedWorkSection key={key} {...section} locale={locale} />;
      case 'deeperProof':
        return <DeeperProofSection key={key} {...section} />;
      case 'trustBlock':
        return <TrustBlockSection key={key} {...section} />;
      case 'enquiryForm':
        return <EnquiryFormSection key={key} {...section} />;
      default:
        return assertNever(section);
    }
  }

  export function SectionRenderer({
    sections,
    locale,
  }: {
    sections: Section[];
    locale: Locale;
  }) {
    return <>{sections.map((section, i) => renderSection(section, locale, i))}</>;
  }
  ```
  > NOTE: `ProofStripSection` becomes an async Server Component in Task 2.7. React 19 / the RTL render in Step 5 still resolves the synchronous placeholder here; the async version is tested via its `ProofStripShell` export in 2.7.

- [ ] **Step 5: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/SectionRenderer.test.tsx
  ```
  Expected output (contains):
  ```
  ✓ src/components/SectionRenderer.test.tsx (3)
  Test Files  1 passed (1)
  ```

- [ ] **Step 6: Typecheck (confirms exhaustiveness — removing a `case` surfaces an `assertNever` type error).**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0).

- [ ] **Step 7: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/components/SectionRenderer.tsx src/components/SectionRenderer.test.tsx src/components/sections/ && git commit -m "feat(sections): add exhaustive SectionRenderer with section shells"
  ```

---

### Task 2.3: `proof.ts` — live proof fetch + ISR cache + degradation

Pure async helper that returns proof signals, ISR-cached (`next: { revalidate }`), and degrades to last-known-good with a "verified N min ago" string when the upstream fails. TDD: success path, fetch-failure fallback, never throws.

**Files:**
- `/Users/hodlmedia/forge/src/lib/proof.ts` (Create)
- `/Users/hodlmedia/forge/src/lib/proof.test.ts` (Create)

- [ ] **Step 1: Write the failing test.**
  Create `/Users/hodlmedia/forge/src/lib/proof.test.ts`:
  ```ts
  import { describe, it, expect, vi, afterEach } from 'vitest';
  import { getProofSnapshot, verifiedAgo, type ProofSnapshot } from '@/lib/proof';

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('verifiedAgo', () => {
    it('formats sub-minute as "just now"', () => {
      const now = Date.now();
      expect(verifiedAgo(now - 10_000, now)).toBe('verified just now');
    });
    it('formats minutes', () => {
      const now = Date.now();
      expect(verifiedAgo(now - 5 * 60_000, now)).toBe('verified 5 min ago');
    });
    it('formats a lone minute without an "s"', () => {
      const now = Date.now();
      expect(verifiedAgo(now - 60_000, now)).toBe('verified 1 min ago');
    });
  });

  describe('getProofSnapshot', () => {
    it('returns a fresh snapshot on a successful fetch', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ nodes: 1234 }), { status: 200 }),
      );
      const snap = await getProofSnapshot();
      expect(snap.degraded).toBe(false);
      expect(snap.metrics.find((m) => m.id === 'alephNodes')?.value).toBe(1234);
      expect(typeof snap.verifiedAt).toBe('number');
    });

    it('never throws and degrades to last-known-good on fetch failure', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));
      let snap: ProofSnapshot | undefined;
      await expect(
        (async () => {
          snap = await getProofSnapshot();
        })(),
      ).resolves.toBeUndefined();
      expect(snap!.degraded).toBe(true);
      // degraded snapshot still carries the static last-known-good metrics
      expect(snap!.metrics.length).toBeGreaterThan(0);
    });

    it('never throws on a non-OK HTTP status', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('nope', { status: 503 }));
      const snap = await getProofSnapshot();
      expect(snap.degraded).toBe(true);
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/lib/proof.test.ts
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "@/lib/proof"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement `proof.ts`.**
  Create `/Users/hodlmedia/forge/src/lib/proof.ts`:
  ```ts
  import type { ProofMetric } from '@/lib/schema';
  import { PROOF_METRICS } from '@/data/proof';

  // Aleph corechannel network-metrics endpoint (defensible live signal).
  const ALEPH_METRICS_URL =
    'https://api2.aleph.im/api/v0/aggregates/0xa1B3bb7d2332383D96b7796B908fB7f7F3c2Be10.json?keys=corechannel';
  const REVALIDATE_SECONDS = 600; // 10-min ISR window (spec: 5–15 min)
  const FETCH_TIMEOUT_MS = 4000;

  export interface ProofSnapshot {
    metrics: ProofMetric[];
    verifiedAt: number; // epoch ms of the data we are showing
    degraded: boolean; // true => upstream failed, showing last-known-good
  }

  /** "verified N min ago" relative-time string. `now` is injectable for tests. */
  export function verifiedAgo(verifiedAt: number, now: number = Date.now()): string {
    const mins = Math.floor((now - verifiedAt) / 60_000);
    if (mins <= 0) return 'verified just now';
    if (mins === 1) return 'verified 1 min ago';
    return `verified ${mins} min ago`;
  }

  async function fetchAlephNodes(): Promise<number | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(ALEPH_METRICS_URL, {
        signal: controller.signal,
        next: { revalidate: REVALIDATE_SECONDS },
      });
      if (!res.ok) return null;
      const json: unknown = await res.json();
      // Be defensive about the shape — any structural surprise => null (degrade).
      if (json && typeof json === 'object' && 'nodes' in json) {
        const n = (json as { nodes: unknown }).nodes;
        return typeof n === 'number' ? n : null;
      }
      return null;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Returns the proof snapshot. NEVER throws: a fetch failure, timeout, non-OK
   * status, or malformed payload degrades to the static last-known-good metrics
   * with `degraded: true`. The ProofStripLive island renders "verified N min ago"
   * off `verifiedAt`.
   */
  export async function getProofSnapshot(): Promise<ProofSnapshot> {
    const nodes = await fetchAlephNodes();
    if (nodes === null) {
      return {
        metrics: PROOF_METRICS, // static, defensible last-known-good
        verifiedAt: Date.now(),
        degraded: true,
      };
    }
    // Merge the one live value into the static metric definitions.
    const metrics: ProofMetric[] = PROOF_METRICS.map((m) =>
      m.id === 'alephNodes' ? { ...m, value: nodes, live: true } : m,
    );
    return { metrics, verifiedAt: Date.now(), degraded: false };
  }
  ```
  > CONTRACT NOTE: `PROOF_METRICS` (from Phase-1 `src/data/proof.ts`, Task 1.4) contains the metric with `id: 'alephNodes'` (carried as `value: null, live: true`), so this merge target is guaranteed. The exact Aleph endpoint shape (`{ nodes }`) is best-effort; the code degrades safely if the real payload differs, and the degraded path is what the live strip falls back to anyway.

- [ ] **Step 4: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/lib/proof.test.ts
  ```
  Expected output (contains):
  ```
  ✓ src/lib/proof.test.ts (6)
  Test Files  1 passed (1)
  ```

- [ ] **Step 5: Typecheck.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0).

- [ ] **Step 6: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/lib/proof.ts src/lib/proof.test.ts && git commit -m "feat(ui): add proof snapshot fetch with ISR cache and graceful degradation"
  ```

---

### Task 2.4: `ProofStripLive` client island

`'use client'` island that consumes a `ProofSnapshot` (passed from the Server Component shell), renders count-ups, and shows "verified N min ago" / "verified just now". It NEVER blocks paint: the SSR shell already carries the wordmarks/labels; this island only animates numbers and updates the freshness label. TDD: renders cached fallback string, never throws on a degraded/null snapshot.

**Files:**
- `/Users/hodlmedia/forge/src/components/ui/ProofStripLive.tsx` (Create)
- `/Users/hodlmedia/forge/src/components/ui/ProofStripLive.test.tsx` (Create)

- [ ] **Step 1: Write the failing test.**
  Create `/Users/hodlmedia/forge/src/components/ui/ProofStripLive.test.tsx`:
  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import { ProofStripLive } from '@/components/ui/ProofStripLive';
  import type { ProofSnapshot } from '@/lib/proof';

  const base: ProofSnapshot = {
    metrics: [
      { id: 'shipped', label: 'Products shipped', value: 6, suffix: '+' },
      { id: 'alephNodes', label: 'Aleph nodes', value: 1234, live: true },
    ],
    verifiedAt: Date.now() - 5 * 60_000,
    degraded: false,
  };

  describe('ProofStripLive', () => {
    it('renders each metric label', () => {
      render(<ProofStripLive snapshot={base} />);
      expect(screen.getByText('Products shipped')).toBeInTheDocument();
      expect(screen.getByText('Aleph nodes')).toBeInTheDocument();
    });

    it('shows a "verified N min ago" freshness label', () => {
      render(<ProofStripLive snapshot={base} />);
      expect(screen.getByText(/verified 5 min ago/i)).toBeInTheDocument();
    });

    it('never throws and still renders on a degraded snapshot', () => {
      const degraded: ProofSnapshot = { ...base, degraded: true };
      expect(() => render(<ProofStripLive snapshot={degraded} />)).not.toThrow();
      expect(screen.getByText(/verified/i)).toBeInTheDocument();
    });

    it('omits null-valued metrics gracefully', () => {
      const withNull: ProofSnapshot = {
        ...base,
        metrics: [{ id: 'pending', label: 'Pending', value: null }],
      };
      expect(() => render(<ProofStripLive snapshot={withNull} />)).not.toThrow();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });
  ```
  > NOTE: the test asserts labels + freshness only, not the count-up's final digits, because `CountUp` (Phase-1) animates over time and the jsdom stubs (`matchMedia`/`IntersectionObserver` from `vitest.setup.ts`) may keep it at its start value. Final-value assertions belong to `CountUp`'s own Phase-1 test.

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/ui/ProofStripLive.test.tsx
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "@/components/ui/ProofStripLive"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement the island.**
  Create `/Users/hodlmedia/forge/src/components/ui/ProofStripLive.tsx`:
  ```tsx
  'use client';

  import { useEffect, useState } from 'react';
  import { CountUp } from '@/components/ui/CountUp';
  import { verifiedAgo, type ProofSnapshot } from '@/lib/proof';

  export function ProofStripLive({ snapshot }: { snapshot: ProofSnapshot }) {
    // Freshness label re-renders client-side so it stays truthful after hydration,
    // but the server already rendered an initial value so there is no layout shift.
    const [label, setLabel] = useState(() => verifiedAgo(snapshot.verifiedAt));

    useEffect(() => {
      const tick = () => setLabel(verifiedAgo(snapshot.verifiedAt));
      tick();
      const id = setInterval(tick, 60_000);
      return () => clearInterval(id);
    }, [snapshot.verifiedAt]);

    return (
      <div data-proof-live>
        <ul className="flex flex-wrap gap-8" role="list">
          {snapshot.metrics.map((m) => (
            <li key={m.id} className="flex flex-col">
              <span className="font-mono text-3xl text-text">
                {m.value === null ? (
                  <span aria-hidden>—</span>
                ) : (
                  <>
                    <CountUp to={m.value} />
                    {m.suffix ?? ''}
                  </>
                )}
              </span>
              <span className="text-text-dim text-sm">{m.label}</span>
            </li>
          ))}
        </ul>
        <p className="text-text-dim mt-3 font-mono text-xs" aria-live="polite">
          {label}
        </p>
      </div>
    );
  }
  ```
  > NOTE: the Phase-1 `CountUp` API is `<CountUp to={number} suffix? className? />` (Task 1.8 signature) — matches this usage.

- [ ] **Step 4: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/ui/ProofStripLive.test.tsx
  ```
  Expected output (contains):
  ```
  ✓ src/components/ui/ProofStripLive.test.tsx (4)
  Test Files  1 passed (1)
  ```

- [ ] **Step 5: Typecheck.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0).

- [ ] **Step 6: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/components/ui/ProofStripLive.tsx src/components/ui/ProofStripLive.test.tsx && git commit -m "feat(ui): add ProofStripLive island with count-ups and freshness label"
  ```

---

### Task 2.5: `EnquiryForm` client island (PRIMARY conversion)

The qualifying enquiry form. Fields: name, email, company size, pillar, budget band, message. Posts a `ContactPayload` to `/api/contact`. The salvaged route + `sendNotification` only carry `name/email/phone/message`; the new optional fields (`company`, `companySize`, `pillar`, `budget`) are part of `ContactPayloadSchema` and pass through in the JSON body (the route folds them into the notification's message context per the §4 migration note). TDD: builds a schema-valid `ContactPayload`, surfaces 400/429, shows success.

**Files:**
- `/Users/hodlmedia/forge/src/components/EnquiryForm.tsx` (Create)
- `/Users/hodlmedia/forge/src/components/EnquiryForm.test.tsx` (Create)

- [ ] **Step 1: Write the failing test.**
  Create `/Users/hodlmedia/forge/src/components/EnquiryForm.test.tsx`:
  ```tsx
  import { describe, it, expect, vi, afterEach } from 'vitest';
  import { render, screen, waitFor } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import { EnquiryForm } from '@/components/EnquiryForm';
  import { ContactPayloadSchema } from '@/lib/schema';
  import { CONTACT } from '@/data/contact';

  afterEach(() => vi.restoreAllMocks());

  function mockFetchOk() {
    return vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
  }

  describe('EnquiryForm', () => {
    it('renders all six qualifying fields', () => {
      render(<EnquiryForm pillars={CONTACT.types} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company size/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/pillar|what can we help/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message|tell us/i)).toBeInTheDocument();
    });

    it('posts a schema-valid ContactPayload to /api/contact', async () => {
      const fetchSpy = mockFetchOk();
      const user = userEvent.setup();
      render(<EnquiryForm pillars={CONTACT.types} />);

      await user.type(screen.getByLabelText(/name/i), 'Ada Lovelace');
      await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
      await user.selectOptions(screen.getByLabelText(/company size/i), '1-10');
      await user.selectOptions(screen.getByLabelText(/pillar|what can we help/i), 'AI automation');
      await user.selectOptions(screen.getByLabelText(/budget/i), '5-15k');
      await user.type(screen.getByLabelText(/message|tell us/i), 'Build me an agent.');
      await user.click(screen.getByRole('button', { name: /start a project/i }));

      await waitFor(() => expect(fetchSpy).toHaveBeenCalledOnce());
      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe('/api/contact');
      const body = JSON.parse((init as RequestInit).body as string);
      // body must satisfy the shared ContactPayload schema
      expect(ContactPayloadSchema.safeParse(body).success).toBe(true);
      expect(body.name).toBe('Ada Lovelace');
      expect(body.email).toBe('ada@example.com');
      expect(body.companySize).toBe('1-10');
      expect(body.pillar).toBe('AI automation');
      expect(body.budget).toBe('5-15k');
    });

    it('shows a success message after a 200', async () => {
      mockFetchOk();
      const user = userEvent.setup();
      render(<EnquiryForm pillars={CONTACT.types} />);
      await user.type(screen.getByLabelText(/name/i), 'Ada');
      await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
      await user.click(screen.getByRole('button', { name: /start a project/i }));
      expect(await screen.findByText(/business day|thanks|got it/i)).toBeInTheDocument();
    });

    it('surfaces the 429 rate-limit error', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 }),
      );
      const user = userEvent.setup();
      render(<EnquiryForm pillars={CONTACT.types} />);
      await user.type(screen.getByLabelText(/name/i), 'Ada');
      await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
      await user.click(screen.getByRole('button', { name: /start a project/i }));
      expect(await screen.findByText(/too many requests/i)).toBeInTheDocument();
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/EnquiryForm.test.tsx
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "@/components/EnquiryForm"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement the form.**
  Create `/Users/hodlmedia/forge/src/components/EnquiryForm.tsx`:
  ```tsx
  'use client';

  import { useState, type FormEvent, type ReactNode } from 'react';
  import { ContactPayloadSchema, type ContactPayload } from '@/lib/schema';
  import { MagneticButton } from '@/components/ui/MagneticButton';

  const COMPANY_SIZES: NonNullable<ContactPayload['companySize']>[] = [
    'solo', '1-10', '11-50', '51-250', '250+',
  ];
  const BUDGETS: NonNullable<ContactPayload['budget']>[] = [
    '<5k', '5-15k', '15-50k', '50k+', 'unsure',
  ];

  type Status = 'idle' | 'submitting' | 'success' | 'error';

  export function EnquiryForm({ pillars }: { pillars: string[] }) {
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string>('');

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setStatus('submitting');
      setError('');

      const fd = new FormData(e.currentTarget);
      const candidate = {
        name: String(fd.get('name') ?? ''),
        email: String(fd.get('email') ?? ''),
        company: optional(fd.get('company')),
        companySize: optional(fd.get('companySize')),
        pillar: optional(fd.get('pillar')),
        budget: optional(fd.get('budget')),
        message: optional(fd.get('message')),
      };

      const parsed = ContactPayloadSchema.safeParse(candidate);
      if (!parsed.success) {
        setStatus('error');
        setError('Please enter your name and a valid email.');
        return;
      }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        });
        if (res.ok) {
          setStatus('success');
          return;
        }
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus('error');
        setError(data.error ?? 'Something went wrong. Please try again.');
      } catch {
        setStatus('error');
        setError('Network error. Please try again.');
      }
    }

    if (status === 'success') {
      return (
        <p data-enquiry-success className="text-text">
          Thanks — we’ve got it. We reply within one business day.
        </p>
      );
    }

    return (
      <form onSubmit={onSubmit} noValidate className="grid gap-4" data-enquiry-form>
        <Field label="Name" id="name">
          <input id="name" name="name" required maxLength={500} className="ol-input" />
        </Field>
        <Field label="Email" id="email">
          <input id="email" name="email" type="email" required maxLength={500} className="ol-input" />
        </Field>
        <Field label="Company size" id="companySize">
          <select id="companySize" name="companySize" className="ol-input" defaultValue="">
            <option value="" disabled>Choose…</option>
            {COMPANY_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="What can we help with (pillar)" id="pillar">
          <select id="pillar" name="pillar" className="ol-input" defaultValue="">
            <option value="" disabled>Choose…</option>
            {pillars.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Budget" id="budget">
          <select id="budget" name="budget" className="ol-input" defaultValue="">
            <option value="" disabled>Choose…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </Field>
        <Field label="Tell us what you want to build (message)" id="message">
          <textarea id="message" name="message" rows={4} maxLength={2000} className="ol-input" />
        </Field>

        {status === 'error' && (
          <p role="alert" className="text-text-dim text-sm">{error}</p>
        )}

        <MagneticButton type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Start a project'}
        </MagneticButton>
      </form>
    );
  }

  function optional(v: FormDataEntryValue | null): string | undefined {
    const s = typeof v === 'string' ? v.trim() : '';
    return s.length ? s : undefined;
  }

  function Field({
    label,
    id,
    children,
  }: {
    label: string;
    id: string;
    children: ReactNode;
  }) {
    return (
      <label htmlFor={id} className="grid gap-1 text-text-dim text-sm">
        <span>{label}</span>
        {children}
      </label>
    );
  }
  ```
  > NOTES: (1) the four `CONTACT.types` pillars are exactly the `ContactPayloadSchema.pillar` enum values, so a selected pillar passes the schema. `companySize`/`budget` use the schema enums verbatim. (2) The schema's optional `company` field is in the payload type but NOT a visible field on this form (kept available for `/contact` reuse); it submits `undefined`, which is valid. (3) `MagneticButton` is rendered as the submit `<button>` in its default (no-`href`) mode — its Phase-1 signature (Task 1.8) accepts `type`/`disabled`/`onClick`/`children` and renders a real `<button>` that forwards `type="submit"`, so the form submits through it.

- [ ] **Step 4: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/EnquiryForm.test.tsx
  ```
  Expected output (contains):
  ```
  ✓ src/components/EnquiryForm.test.tsx (4)
  Test Files  1 passed (1)
  ```

- [ ] **Step 5: Typecheck.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0).

- [ ] **Step 6: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/components/EnquiryForm.tsx src/components/EnquiryForm.test.tsx && git commit -m "feat(ui): add EnquiryForm island posting ContactPayload to /api/contact"
  ```

---

### Task 2.6: `WorkFilter` client island

The `/work` tag filter island (AI / Web / Web3) over `WORK`. TDD. (The footer `NewsletterForm` is Phase 1 — Task 1.9 — and is NOT created here.)

**Files:**
- `/Users/hodlmedia/forge/src/components/ui/WorkFilter.tsx` (Create)
- `/Users/hodlmedia/forge/src/components/ui/WorkFilter.test.tsx` (Create)

- [ ] **Step 1: Write the failing WorkFilter test.**
  Create `/Users/hodlmedia/forge/src/components/ui/WorkFilter.test.tsx`:
  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import { WorkFilter } from '@/components/ui/WorkFilter';
  import { WORK } from '@/data/work';

  describe('WorkFilter', () => {
    it('renders all items by default', () => {
      render(
        <WorkFilter items={WORK}>
          {(visible) => <ul>{visible.map((w) => <li key={w.slug}>{w.name}</li>)}</ul>}
        </WorkFilter>,
      );
      for (const w of WORK) expect(screen.getByText(w.name)).toBeInTheDocument();
    });

    it('filters to a single tag when a tag button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WorkFilter items={WORK}>
          {(visible) => <ul>{visible.map((w) => <li key={w.slug}>{w.name}</li>)}</ul>}
        </WorkFilter>,
      );
      await user.click(screen.getByRole('tab', { name: /^web3$/i }));
      const web3 = WORK.filter((w) => w.tag === 'web3');
      const others = WORK.filter((w) => w.tag !== 'web3');
      for (const w of web3) expect(screen.getByText(w.name)).toBeInTheDocument();
      for (const w of others) expect(screen.queryByText(w.name)).not.toBeInTheDocument();
    });

    it('returns to all when the All button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <WorkFilter items={WORK}>
          {(visible) => <ul>{visible.map((w) => <li key={w.slug}>{w.name}</li>)}</ul>}
        </WorkFilter>,
      );
      await user.click(screen.getByRole('tab', { name: /^web3$/i }));
      await user.click(screen.getByRole('tab', { name: /^all$/i }));
      for (const w of WORK) expect(screen.getByText(w.name)).toBeInTheDocument();
    });
  });
  ```
  > NOTE: the tag-filter assertions require each `WORK` item to carry a `tag` (`'ai'|'web'|'web3'`) — Phase-1 ports it ("ADDED for /work filter; map from kind", every item populated). The test's `web3` subset is whatever carries `tag === 'web3'` (Ophis). This is a contract dependency on Phase-1 `WORK`, satisfied by Task 1.2.

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/ui/WorkFilter.test.tsx
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "@/components/ui/WorkFilter"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement WorkFilter.**
  Create `/Users/hodlmedia/forge/src/components/ui/WorkFilter.tsx`:
  ```tsx
  'use client';

  import { useState, type ReactNode } from 'react';
  import type { WorkItem } from '@/lib/schema';

  type Tag = 'ai' | 'web' | 'web3';
  const TAGS: { key: Tag | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ai', label: 'AI' },
    { key: 'web', label: 'Web' },
    { key: 'web3', label: 'Web3' },
  ];

  export function WorkFilter({
    items,
    children,
  }: {
    items: WorkItem[];
    children: (visible: WorkItem[]) => ReactNode;
  }) {
    const [active, setActive] = useState<Tag | 'all'>('all');
    const visible = active === 'all' ? items : items.filter((w) => w.tag === active);

    return (
      <div data-work-filter>
        <div role="tablist" aria-label="Filter work by type" className="flex gap-2">
          {TAGS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active === key}
              onClick={() => setActive(key)}
              className="ol-chip"
              data-active={active === key}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-6">{children(visible)}</div>
      </div>
    );
  }
  ```

- [ ] **Step 4: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/ui/WorkFilter.test.tsx
  ```
  Expected output (contains):
  ```
  ✓ src/components/ui/WorkFilter.test.tsx (3)
  Test Files  1 passed (1)
  ```

- [ ] **Step 5: Typecheck.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0).

- [ ] **Step 6: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/components/ui/WorkFilter.tsx src/components/ui/WorkFilter.test.tsx && git commit -m "feat(ui): add WorkFilter client island"
  ```

---

### Task 2.7: Hero + ProofStrip section components

Flesh out `HeroSection` (LCP H1 static, full-opacity, magnetic primary CTA) and `ProofStripSection` (SSR shell carries wordmarks + label; embeds `<ProofStripLive>` fed a server-fetched `ProofSnapshot`). Replaces the placeholder shells from 2.2. Visual tests: SSR carries H1 + primary copy; LCP node not `opacity:0`; wordmarks link out.

**Files:**
- `/Users/hodlmedia/forge/src/components/sections/HeroSection.tsx` (Modify)
- `/Users/hodlmedia/forge/src/components/sections/HeroSection.test.tsx` (Create)
- `/Users/hodlmedia/forge/src/components/sections/ProofStripSection.tsx` (Modify)
- `/Users/hodlmedia/forge/src/components/sections/ProofStripSection.test.tsx` (Create)

- [ ] **Step 1: Write the failing HeroSection test.**
  Create `/Users/hodlmedia/forge/src/components/sections/HeroSection.test.tsx`:
  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import { HeroSection } from '@/components/sections/HeroSection';
  import type { HeroSectionProps } from '@/lib/schema';

  const props: HeroSectionProps = {
    type: 'hero',
    h1: 'Websites that think, move & transact.',
    sub: 'A Luxembourg AI agency.',
    lead: 'We build AI agents and the sites around them.',
    primaryCta: { label: 'Start a project', href: '#enquiry' },
    secondaryCta: { label: 'See our work', href: '/work' },
  };

  describe('HeroSection', () => {
    it('renders the H1, sub and lead in static HTML', () => {
      render(<HeroSection {...props} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Websites that think, move & transact.',
      );
      expect(screen.getByText('A Luxembourg AI agency.')).toBeInTheDocument();
      expect(screen.getByText(/AI agents and the sites/)).toBeInTheDocument();
    });

    it('does NOT render the LCP H1 at opacity:0', () => {
      const { container } = render(<HeroSection {...props} />);
      const h1 = container.querySelector('h1')!;
      // LCP node must be paintable on first paint — no inline opacity:0, no reveal wrapper
      expect(h1.style.opacity === '0').toBe(false);
      expect(h1.getAttribute('data-reveal')).toBeNull();
    });

    it('exposes both CTAs as links to the right targets', () => {
      render(<HeroSection {...props} />);
      expect(screen.getByRole('link', { name: /start a project/i })).toHaveAttribute(
        'href',
        '#enquiry',
      );
      expect(screen.getByRole('link', { name: /see our work/i })).toHaveAttribute('href', '/work');
    });
  });
  ```

- [ ] **Step 2: Write the failing ProofStripSection test.**
  Create `/Users/hodlmedia/forge/src/components/sections/ProofStripSection.test.tsx`:
  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import { ProofStripShell } from '@/components/sections/ProofStripSection';
  import type { ProofStripSectionProps } from '@/lib/schema';
  import type { ProofSnapshot } from '@/lib/proof';

  const props: ProofStripSectionProps = {
    type: 'proofStrip',
    label: 'Shipped & live',
    logos: [
      { slug: 'vinsfins', name: 'Vins Fins', src: '/clients/vinsfins-logo.png', href: 'https://www.vinsfins.lu' },
      { slug: 'lagrocerie', name: 'La Grocerie', src: '/clients/lagrocerie-logo.png', href: 'https://www.lagrocerie.lu' },
    ],
    metrics: [{ id: 'shipped', label: 'Products shipped', value: 6, suffix: '+' }],
  };

  const snapshot: ProofSnapshot = {
    metrics: props.metrics,
    verifiedAt: Date.now(),
    degraded: false,
  };

  describe('ProofStripShell', () => {
    it('renders the label and every wordmark in static HTML (crawlable)', () => {
      render(<ProofStripShell {...props} snapshot={snapshot} />);
      expect(screen.getByText('Shipped & live')).toBeInTheDocument();
      expect(screen.getByText('Vins Fins')).toBeInTheDocument();
      expect(screen.getByText('La Grocerie')).toBeInTheDocument();
    });

    it('each wordmark links to the live product', () => {
      render(<ProofStripShell {...props} snapshot={snapshot} />);
      expect(screen.getByRole('link', { name: /vins fins/i })).toHaveAttribute(
        'href',
        'https://www.vinsfins.lu',
      );
    });
  });
  ```

- [ ] **Step 3: Run both tests — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/sections/HeroSection.test.tsx src/components/sections/ProofStripSection.test.tsx
  ```
  Expected output (contains):
  ```
  ✗ HeroSection > exposes both CTAs ...   (placeholder has no links)
  ✗ ProofStripShell ...                    (no ProofStripShell export yet)
  ... Test Files  2 failed
  ```

- [ ] **Step 4: Implement HeroSection.**
  Replace `/Users/hodlmedia/forge/src/components/sections/HeroSection.tsx`:
  ```tsx
  import Link from 'next/link';
  import type { HeroSectionProps } from '@/lib/schema';
  import { Reveal } from '@/components/ui/Reveal';
  import { MagneticButton } from '@/components/ui/MagneticButton';

  export function HeroSection({ h1, sub, lead, primaryCta, secondaryCta }: HeroSectionProps) {
    return (
      <section data-section="hero" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          {/* LCP node: full opacity on first paint, NOT wrapped in Reveal */}
          <h1 className="text-balance text-5xl font-semibold tracking-tight text-text md:text-7xl">
            {h1}
          </h1>
          {/* Below-LCP copy may animate in */}
          <Reveal as="p" className="mt-4 text-2xl text-text-dim">
            {sub}
          </Reveal>
          <Reveal as="p" className="mt-6 max-w-2xl text-lg text-text-dim">
            {lead}
          </Reveal>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton asChild>
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </MagneticButton>
            <Link href={secondaryCta.href} className="ol-link text-text-dim hover:text-hot">
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>
    );
  }
  ```
  > NOTE: `MagneticButton` is used with the `asChild` slot so it wraps a Next `<Link>` while exposing a `link` role — this matches the Phase-1 `MagneticButton` signature (Task 1.8), which clones the child and attaches the magnet handlers to it. The `href` anchor mode (`<MagneticButton href=…>`) and the default `<button>` mode (used by `EnquiryForm`) are the other two supported shapes.

- [ ] **Step 5: Implement ProofStripSection (async Server Component + testable shell).**
  Replace `/Users/hodlmedia/forge/src/components/sections/ProofStripSection.tsx`:
  ```tsx
  import Link from 'next/link';
  import type { ProofStripSectionProps } from '@/lib/schema';
  import { getProofSnapshot, type ProofSnapshot } from '@/lib/proof';
  import { ProofStripLive } from '@/components/ui/ProofStripLive';
  import { Hairline } from '@/components/ui/Hairline';

  /** Server Component: fetches the snapshot, then renders the SSR shell. */
  export async function ProofStripSection(props: ProofStripSectionProps) {
    const snapshot = await getProofSnapshot();
    return <ProofStripShell {...props} snapshot={snapshot} />;
  }

  /** Pure shell — exported for testing without a live fetch. */
  export function ProofStripShell({
    label,
    logos,
    snapshot,
  }: ProofStripSectionProps & { snapshot: ProofSnapshot }) {
    return (
      <section data-section="proofStrip" aria-label={label} className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-widest text-text-dim">{label}</p>
          <ul role="list" className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
            {logos.map((logo) => (
              <li key={logo.slug}>
                <Link
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-dim transition-colors hover:text-hot"
                >
                  {logo.name}
                </Link>
              </li>
            ))}
          </ul>
          <Hairline className="my-8" />
          {/* Live island — never blocks paint; the shell above is the crawlable proof. */}
          <ProofStripLive snapshot={snapshot} />
        </div>
      </section>
    );
  }
  ```
  > NOTE: Phase-1 `Hairline` accepts a `className` (Task 1.8 signature). The wordmarks render as text links (the salvaged logo PNGs at `public/clients/*` can be wired as `next/image` in a later polish pass; text is the crawlable proof requirement).

- [ ] **Step 6: Run both tests — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/sections/HeroSection.test.tsx src/components/sections/ProofStripSection.test.tsx
  ```
  Expected output (contains):
  ```
  ✓ src/components/sections/HeroSection.test.tsx (3)
  ✓ src/components/sections/ProofStripSection.test.tsx (2)
  Test Files  2 passed (2)
  ```

- [ ] **Step 7: Typecheck.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0).

- [ ] **Step 8: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/components/sections/HeroSection.tsx src/components/sections/HeroSection.test.tsx src/components/sections/ProofStripSection.tsx src/components/sections/ProofStripSection.test.tsx && git commit -m "feat(sections): implement Hero with static LCP H1 and live ProofStrip"
  ```

---

### Task 2.8: The remaining 6 section components

Flesh out `ServicesGridSection`, `HowWeWorkSection`, `SelectedWorkSection`, `DeeperProofSection`, `TrustBlockSection`, `EnquiryFormSection` (replacing the 2.2 placeholders). There is NO `FooterSection` — the footer is the layout-level `<Footer/>` (Phase 1, Task 1.9). SelectedWork uses simple links (view-transition polish is Phase 3); DeeperProof uses count-ups + an empty-safe inline testimonials list (the dedicated Testimonials component is Phase 3). One combined render/SSR-content test.

**Files:**
- `/Users/hodlmedia/forge/src/components/sections/ServicesGridSection.tsx` (Modify)
- `/Users/hodlmedia/forge/src/components/sections/HowWeWorkSection.tsx` (Modify)
- `/Users/hodlmedia/forge/src/components/sections/SelectedWorkSection.tsx` (Modify)
- `/Users/hodlmedia/forge/src/components/sections/DeeperProofSection.tsx` (Modify)
- `/Users/hodlmedia/forge/src/components/sections/TrustBlockSection.tsx` (Modify)
- `/Users/hodlmedia/forge/src/components/sections/EnquiryFormSection.tsx` (Modify)
- `/Users/hodlmedia/forge/src/components/sections/sections.test.tsx` (Create)

- [ ] **Step 1: Write the failing combined section test.**
  Create `/Users/hodlmedia/forge/src/components/sections/sections.test.tsx`:
  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import { ServicesGridSection } from '@/components/sections/ServicesGridSection';
  import { HowWeWorkSection } from '@/components/sections/HowWeWorkSection';
  import { SelectedWorkSection } from '@/components/sections/SelectedWorkSection';
  import { DeeperProofSection } from '@/components/sections/DeeperProofSection';
  import { TrustBlockSection } from '@/components/sections/TrustBlockSection';
  import { EnquiryFormSection } from '@/components/sections/EnquiryFormSection';
  import { SERVICES } from '@/data/services';
  import { WORK } from '@/data/work';
  import { ABOUT } from '@/data/about';
  import { CONTACT } from '@/data/contact';

  describe('ServicesGridSection', () => {
    it('renders the 3 pillars numbered 01/02/03 with one CTA each', () => {
      render(
        <ServicesGridSection
          type="servicesGrid"
          order={['ai', 'marketing', 'web3']}
          ctaLabel="Start a project"
          ctaHref="#enquiry"
          locale="en"
        />,
      );
      expect(screen.getByText(SERVICES.ai.title)).toBeInTheDocument();
      expect(screen.getByText(SERVICES.marketing.title)).toBeInTheDocument();
      expect(screen.getByText(SERVICES.web3.title)).toBeInTheDocument();
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('03')).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /start a project/i })).toHaveLength(3);
    });
  });

  describe('HowWeWorkSection', () => {
    it('renders each step and the soft SME Package line', () => {
      render(
        <HowWeWorkSection
          type="howWeWork"
          steps={SERVICES.ai.how}
          smePackageNote={SERVICES.ai.footer ?? ''}
          stickyScroll={false}
        />,
      );
      for (const step of SERVICES.ai.how) expect(screen.getByText(step)).toBeInTheDocument();
      expect(screen.getByText(/SME Package/i)).toBeInTheDocument();
    });
  });

  describe('SelectedWorkSection', () => {
    it('renders all 6 work cards as links to the live products + view-all', () => {
      render(
        <SelectedWorkSection type="selectedWork" items={WORK} viewAllHref="/work" locale="en" />,
      );
      for (const w of WORK) {
        const link = screen.getByRole('link', { name: new RegExp(w.name, 'i') });
        expect(link).toHaveAttribute('href', w.link);
      }
      expect(screen.getByRole('link', { name: /view all work/i })).toHaveAttribute('href', '/work');
    });
  });

  describe('DeeperProofSection', () => {
    it('renders metrics and is empty-safe with no testimonials', () => {
      render(
        <DeeperProofSection
          type="deeperProof"
          shippedCount={WORK.length}
          metrics={[{ id: 'shipped', label: 'Shipped', value: 6, suffix: '+' }]}
          testimonials={[]}
        />,
      );
      expect(screen.getByText('Shipped')).toBeInTheDocument();
      expect(document.querySelector('blockquote')).toBeNull();
    });

    it('renders inline testimonials when present', () => {
      render(
        <DeeperProofSection
          type="deeperProof"
          shippedCount={6}
          metrics={[]}
          testimonials={[{ quote: 'Shipped fast.', name: 'X', role: 'CEO', company: 'Y' }]}
        />,
      );
      expect(screen.getByText(/shipped fast/i)).toBeInTheDocument();
    });
  });

  describe('TrustBlockSection', () => {
    it('renders all ABOUT facts and the headline', () => {
      render(
        <TrustBlockSection type="trustBlock" facts={ABOUT.facts} headline="European by default." />,
      );
      for (const fact of ABOUT.facts) expect(screen.getByText(fact)).toBeInTheDocument();
      expect(screen.getByText('European by default.')).toBeInTheDocument();
    });
  });

  describe('EnquiryFormSection', () => {
    it('renders the #enquiry anchor, headline, call line and form island', () => {
      const { container } = render(
        <EnquiryFormSection
          type="enquiryForm"
          id="enquiry"
          headline={CONTACT.lead}
          pillars={CONTACT.types}
          callLine={CONTACT.callLine}
          bookCallHref="/contact"
        />,
      );
      expect(container.querySelector('#enquiry')).toBeInTheDocument();
      expect(screen.getByText(CONTACT.lead)).toBeInTheDocument();
      expect(screen.getByText(/15-minute intro call/i)).toBeInTheDocument();
      expect(container.querySelector('[data-enquiry-form]')).toBeInTheDocument();
    });
  });
  ```
  > NOTE: there is no `FooterSection` test here — the footer is the layout-level `<Footer/>` component, tested in Phase 1 (Task 1.9 `Footer.test.tsx`).

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/sections/sections.test.tsx
  ```
  Expected output (contains):
  ```
  ✗ ServicesGridSection > renders the 3 pillars ...
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement ServicesGridSection.**
  Replace `/Users/hodlmedia/forge/src/components/sections/ServicesGridSection.tsx`:
  ```tsx
  import Link from 'next/link';
  import type { ServicesGridSectionProps } from '@/lib/schema';
  import type { Locale } from '@/lib/site-config';
  import { SERVICES } from '@/data/services';
  import { HoverCard } from '@/components/ui/HoverCard';

  export function ServicesGridSection({
    order,
    ctaLabel,
    ctaHref,
  }: ServicesGridSectionProps & { locale: Locale }) {
    return (
      <section data-section="servicesGrid" className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {order.map((key, i) => {
            const svc = SERVICES[key];
            return (
              <HoverCard key={key} className="flex flex-col rounded-lg bg-surface p-6">
                <span className="font-mono text-text-dim">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-text">{svc.title}</h3>
                <p className="mt-3 flex-1 text-text-dim">{svc.lead}</p>
                <Link href={ctaHref} className="ol-link mt-6 text-hot">
                  {ctaLabel}
                </Link>
              </HoverCard>
            );
          })}
        </div>
      </section>
    );
  }
  ```
  > NOTE: assumes Phase-1 `HoverCard` accepts `className` + `children`. If not, swap for a plain `<article className="…">`.

- [ ] **Step 4: Implement HowWeWorkSection.**
  Replace `/Users/hodlmedia/forge/src/components/sections/HowWeWorkSection.tsx`:
  ```tsx
  import type { HowWeWorkSectionProps } from '@/lib/schema';
  import { Reveal } from '@/components/ui/Reveal';

  export function HowWeWorkSection({ steps, smePackageNote }: HowWeWorkSectionProps) {
    return (
      <section data-section="howWeWork" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-semibold text-text">How we work</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal as="li" key={step} className="rounded-lg bg-surface p-6">
                <span className="font-mono text-text-dim">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-2 text-text">{step}</p>
              </Reveal>
            ))}
          </ol>
          {smePackageNote && <p className="mt-8 text-sm text-text-dim">{smePackageNote}</p>}
        </div>
      </section>
    );
  }
  ```
  > NOTE: assumes Phase-1 `Reveal` accepts an `as` polymorphic prop + `className`. If `Reveal` is fixed to a `div`, wrap a `<li>` around it or render the list items without `Reveal` (the spec allows stepped reveal here, not a hard requirement). The `SERVICES.ai.footer` string already contains "SME Package", satisfying the test.

- [ ] **Step 5: Implement SelectedWorkSection (simple links).**
  Replace `/Users/hodlmedia/forge/src/components/sections/SelectedWorkSection.tsx`:
  ```tsx
  import Link from 'next/link';
  import type { SelectedWorkSectionProps } from '@/lib/schema';
  import type { Locale } from '@/lib/site-config';
  import { HoverCard } from '@/components/ui/HoverCard';

  export function SelectedWorkSection({
    items,
    viewAllHref,
  }: SelectedWorkSectionProps & { locale: Locale }) {
    return (
      <section data-section="selectedWork" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl font-semibold text-text">Selected work</h2>
            <Link href={viewAllHref} className="ol-link text-text-dim hover:text-hot">
              View all work
            </Link>
          </div>
          <ul role="list" className="mt-8 grid gap-6 md:grid-cols-2">
            {items.map((w) => (
              <li key={w.slug}>
                <HoverCard className="rounded-lg bg-surface p-6">
                  {/* Phase 3 adds the view-transition morph; here it is a simple link. */}
                  <Link href={w.link} target="_blank" rel="noopener noreferrer" className="block">
                    <span className="font-mono text-xs uppercase tracking-widest text-text-dim">
                      {w.kind}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold text-text">{w.name}</h3>
                    <p className="mt-2 text-text-dim">{w.blurb}</p>
                  </Link>
                </HoverCard>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 6: Implement DeeperProofSection (count-ups + empty-safe testimonials).**
  Replace `/Users/hodlmedia/forge/src/components/sections/DeeperProofSection.tsx`:
  ```tsx
  import type { DeeperProofSectionProps } from '@/lib/schema';
  import { CountUp } from '@/components/ui/CountUp';

  export function DeeperProofSection({ metrics, testimonials }: DeeperProofSectionProps) {
    return (
      <section data-section="deeperProof" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          {metrics.length > 0 && (
            <ul role="list" className="grid gap-8 md:grid-cols-3">
              {metrics.map((m) => (
                <li key={m.id} className="flex flex-col">
                  <span className="font-mono text-4xl text-text">
                    {m.value === null ? '—' : <CountUp to={m.value} />}
                    {m.suffix ?? ''}
                  </span>
                  <span className="mt-1 text-text-dim">{m.label}</span>
                </li>
              ))}
            </ul>
          )}
          {testimonials.length > 0 && (
            <ul role="list" className="mt-12 grid gap-8 md:grid-cols-2">
              {testimonials.map((t, i) => (
                <li key={i}>
                  <blockquote className="text-text">“{t.quote}”</blockquote>
                  <p className="mt-2 text-sm text-text-dim">
                    {t.name}, {t.role} · {t.company}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 7: Implement TrustBlockSection.**
  Replace `/Users/hodlmedia/forge/src/components/sections/TrustBlockSection.tsx`:
  ```tsx
  import type { TrustBlockSectionProps } from '@/lib/schema';

  export function TrustBlockSection({ facts, headline }: TrustBlockSectionProps) {
    return (
      <section data-section="trustBlock" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          {headline && <h2 className="text-3xl font-semibold text-text">{headline}</h2>}
          <ul role="list" className="mt-8 grid gap-4">
            {facts.map((fact) => (
              <li key={fact} className="text-text-dim">{fact}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 8: Implement EnquiryFormSection (wraps the EnquiryForm island).**
  Replace `/Users/hodlmedia/forge/src/components/sections/EnquiryFormSection.tsx`:
  ```tsx
  import Link from 'next/link';
  import type { EnquiryFormSectionProps } from '@/lib/schema';
  import { EnquiryForm } from '@/components/EnquiryForm';

  export function EnquiryFormSection({
    id,
    headline,
    pillars,
    callLine,
    bookCallHref,
  }: EnquiryFormSectionProps) {
    return (
      <section data-section="enquiryForm" id={id} className="px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-semibold text-text">{headline}</h2>
          <div className="mt-8">
            <EnquiryForm pillars={pillars} />
          </div>
          <p className="mt-6 text-sm text-text-dim">
            {callLine}{' '}
            <Link href={bookCallHref} className="ol-link text-hot">
              Book a 15-minute intro call
            </Link>
          </p>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 9: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/components/sections/sections.test.tsx
  ```
  Expected output (contains):
  ```
  ✓ src/components/sections/sections.test.tsx (7)
  Test Files  1 passed (1)
  ```

- [ ] **Step 10: Typecheck + full unit suite green.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck && npm run test
  ```
  Expected output (contains):
  ```
  Test Files  ... passed
  ```
  (typecheck emits no output, exit 0).

- [ ] **Step 11: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/components/sections/ && git commit -m "feat(sections): implement the remaining 6 homepage sections"
  ```

---

### Task 2.9: Wire the homepage route

Make `src/app/[locale]/page.tsx` render `<SectionRenderer sections={HOME_SECTIONS} locale={locale} />` with `setRequestLocale` + `generateStaticParams`. Manual dev-server verify.

**Files:**
- `/Users/hodlmedia/forge/src/app/[locale]/page.tsx` (Modify)

- [ ] **Step 1: Implement the homepage route.**
  Replace `/Users/hodlmedia/forge/src/app/[locale]/page.tsx`:
  ```tsx
  import { setRequestLocale } from 'next-intl/server';
  import { SectionRenderer } from '@/components/SectionRenderer';
  import { HOME_SECTIONS } from '@/data/pages/home';
  import { LOCALES, type Locale } from '@/lib/site-config';

  export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
  }

  export default async function HomePage({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
      <main>
        <SectionRenderer sections={HOME_SECTIONS} locale={locale} />
      </main>
    );
  }
  ```
  > NOTE: `params` is awaited per Next 15/16 async params. `setRequestLocale(locale)` is non-negotiable per the contract even if the Phase-1 layout also sets it.

- [ ] **Step 2: Typecheck.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0).

- [ ] **Step 3: Manual dev-server verify.**
  ```bash
  cd /Users/hodlmedia/forge && PORT=3030 npm run dev
  ```
  Open `http://localhost:3030/` and confirm:
  - The H1 "Websites that think, move & transact." is visible immediately.
  - All 8 in-page sections render top to bottom, with the layout-level `<Nav/>` above and `<Footer/>` below; the "Start a project" CTA scrolls to the `#enquiry` form.
  - `http://localhost:3030/fr` and `http://localhost:3030/de` render their hero strings.
  Stop the server (Ctrl-C).

- [ ] **Step 4: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/app/\[locale\]/page.tsx && git commit -m "feat(sections): render homepage via SectionRenderer with static params"
  ```

---

### Task 2.10: `/work` filterable grid page

The `/work` page: a filterable grid (WorkFilter) over all 6 `WORK` items, each linking to its live product, with `setRequestLocale` + `generateStaticParams`. Render test + manual verify.

> The Nav and Footer come from the locale layout (Phase 1, Task 1.12) — this page renders ONLY its own `<main>` content and does NOT render its own Nav or Footer.

**Files:**
- `/Users/hodlmedia/forge/src/app/[locale]/work/page.tsx` (Create)
- `/Users/hodlmedia/forge/src/app/[locale]/work/WorkGrid.tsx` (Create)
- `/Users/hodlmedia/forge/src/app/[locale]/work/WorkGrid.test.tsx` (Create)

- [ ] **Step 1: Write the failing WorkGrid test.**
  Create `/Users/hodlmedia/forge/src/app/[locale]/work/WorkGrid.test.tsx`:
  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import { WorkGrid } from './WorkGrid';
  import { WORK } from '@/data/work';

  describe('WorkGrid', () => {
    it('renders every work item with a link to its live product', () => {
      render(<WorkGrid items={WORK} />);
      for (const w of WORK) {
        const link = screen.getByRole('link', { name: new RegExp(w.name, 'i') });
        expect(link).toHaveAttribute('href', w.link);
      }
    });

    it('renders the AI / Web / Web3 filter controls', () => {
      render(<WorkGrid items={WORK} />);
      expect(screen.getByRole('tab', { name: /^all$/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /^ai$/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /^web3$/i })).toBeInTheDocument();
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/app/\[locale\]/work/WorkGrid.test.tsx
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "./WorkGrid"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement WorkGrid (client wrapper around WorkFilter).**
  Create `/Users/hodlmedia/forge/src/app/[locale]/work/WorkGrid.tsx`:
  ```tsx
  'use client';

  import Link from 'next/link';
  import type { WorkItem } from '@/lib/schema';
  import { WorkFilter } from '@/components/ui/WorkFilter';
  import { HoverCard } from '@/components/ui/HoverCard';

  export function WorkGrid({ items }: { items: WorkItem[] }) {
    return (
      <WorkFilter items={items}>
        {(visible) => (
          <ul role="list" className="grid gap-6 md:grid-cols-2">
            {visible.map((w) => (
              <li key={w.slug}>
                <HoverCard className="rounded-lg bg-surface p-6">
                  <Link href={w.link} target="_blank" rel="noopener noreferrer" className="block">
                    <span className="font-mono text-xs uppercase tracking-widest text-text-dim">
                      {w.kind}
                    </span>
                    <h2 className="mt-2 text-xl font-semibold text-text">{w.name}</h2>
                    <p className="mt-2 text-text-dim">{w.blurb}</p>
                  </Link>
                </HoverCard>
              </li>
            ))}
          </ul>
        )}
      </WorkFilter>
    );
  }
  ```

- [ ] **Step 4: Implement the page.**
  Create `/Users/hodlmedia/forge/src/app/[locale]/work/page.tsx`:
  ```tsx
  import type { Metadata } from 'next';
  import { setRequestLocale } from 'next-intl/server';
  import { WorkGrid } from './WorkGrid';
  import { WORK } from '@/data/work';
  import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';

  export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
  }

  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    return {
      title: 'Work — Openletz',
      description: 'Selected work: AI agents, websites, e-commerce and on-chain products we have shipped.',
      alternates: { canonical: localeUrl(locale, '/work') },
    };
  }

  export default async function WorkPage({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
      <main className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold text-text">Selected work</h1>
          <p className="mt-4 max-w-2xl text-text-dim">
            Real products, shipped and live. Filter by what you’re building.
          </p>
          <div className="mt-10">
            <WorkGrid items={WORK} />
          </div>
        </div>
      </main>
    );
  }
  ```

- [ ] **Step 5: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/app/\[locale\]/work/WorkGrid.test.tsx
  ```
  Expected output (contains):
  ```
  ✓ src/app/[locale]/work/WorkGrid.test.tsx (2)
  Test Files  1 passed (1)
  ```

- [ ] **Step 6: Typecheck + manual verify.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0). Then:
  ```bash
  cd /Users/hodlmedia/forge && PORT=3030 npm run dev
  ```
  Open `http://localhost:3030/work`: confirm all 6 cards render, filter tabs narrow the grid, each card opens the live product in a new tab. Stop the server.

- [ ] **Step 7: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/app/\[locale\]/work/page.tsx src/app/\[locale\]/work/WorkGrid.tsx src/app/\[locale\]/work/WorkGrid.test.tsx && git commit -m "feat(sections): add filterable /work grid page"
  ```

---

### Task 2.11: `/work/[slug]` case-study essays

Case-study essays for Vins Fins and La Grocerie (Problem → Process → Result + fixed metric sidebar). Owner-provided metrics/testimonial are explicit `placeholder: true` constants; the essay structure is complete. `generateStaticParams` from `CASE_STUDIES`; an unknown slug `notFound()`s.

> The Nav and Footer come from the locale layout (Phase 1, Task 1.12) — this page renders ONLY its own `<main>` content and does NOT render its own Nav or Footer.

**Files:**
- `/Users/hodlmedia/forge/src/data/case-studies.ts` (Create)
- `/Users/hodlmedia/forge/src/data/case-studies.test.ts` (Create)
- `/Users/hodlmedia/forge/src/app/[locale]/work/[slug]/page.tsx` (Create)

- [ ] **Step 1: Write the failing case-study data test.**
  Create `/Users/hodlmedia/forge/src/data/case-studies.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { CASE_STUDIES, getCaseStudy } from '@/data/case-studies';
  import { WORK } from '@/data/work';

  describe('CASE_STUDIES', () => {
    it('has essays for vinsfins and lagrocerie keyed to real WORK slugs', () => {
      const slugs = Object.keys(CASE_STUDIES);
      expect(slugs).toEqual(['vinsfins', 'lagrocerie']);
      for (const slug of slugs) {
        expect(WORK.some((w) => w.slug === slug)).toBe(true);
      }
    });

    it('each essay has Problem, Process and Result sections', () => {
      for (const cs of Object.values(CASE_STUDIES)) {
        expect(cs.problem.length).toBeGreaterThan(0);
        expect(cs.process.length).toBeGreaterThan(0);
        expect(cs.result.length).toBeGreaterThan(0);
      }
    });

    it('marks owner-provided metrics as placeholders', () => {
      for (const cs of Object.values(CASE_STUDIES)) {
        expect(cs.metrics.length).toBeGreaterThan(0);
        expect(cs.metrics.every((m) => typeof m.placeholder === 'boolean')).toBe(true);
        expect(cs.metrics.some((m) => m.placeholder)).toBe(true);
      }
    });

    it('getCaseStudy returns undefined for an unknown slug', () => {
      expect(getCaseStudy('does-not-exist')).toBeUndefined();
      expect(getCaseStudy('vinsfins')).toBeDefined();
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/data/case-studies.test.ts
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "@/data/case-studies"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement case-study data.**
  Create `/Users/hodlmedia/forge/src/data/case-studies.ts`:
  ```ts
  // Case-study essays. Structure is complete; metrics/testimonial flagged
  // `placeholder: true` stay until the owner supplies real numbers (spec §12.3).

  export interface CaseStudyMetric {
    label: string;
    value: string; // 'TBD' while placeholder
    placeholder: boolean;
  }

  export interface CaseStudy {
    slug: 'vinsfins' | 'lagrocerie';
    title: string;
    kicker: string;
    problem: string[];
    process: string[];
    result: string[];
    metrics: CaseStudyMetric[];
    testimonial?: { quote: string; name: string; role: string; company: string; placeholder: boolean };
  }

  export const CASE_STUDIES: Record<'vinsfins' | 'lagrocerie', CaseStudy> = {
    vinsfins: {
      slug: 'vinsfins',
      title: 'Vins Fins',
      kicker: 'E-commerce · multilingual wine shop',
      problem: [
        'Vins Fins, a wine bar and restaurant in Luxembourg’s Grund, had no way to sell its hundreds of wines online and needed bookings handled in four languages.',
        'The catalogue had to handle Luxembourg VAT and POST Luxembourg shipping without a heavy back-office.',
      ],
      process: [
        'Designed and built the storefront on Next.js, with a light admin the team can actually run.',
        'Wired Stripe checkout with Luxembourg VAT, POST Luxembourg shipping rates, and Zenchef bookings.',
        'Shipped in FR / EN / DE / LB from a single content model.',
      ],
      result: [
        'A fast, multilingual shop and booking site live at vinsfins.lu.',
        'The team manages wines and orders themselves through the light admin.',
      ],
      metrics: [
        { label: 'Languages', value: '4', placeholder: false },
        { label: 'Lighthouse performance', value: 'TBD', placeholder: true },
        { label: 'Time to launch', value: 'TBD', placeholder: true },
        { label: 'Catalogue size', value: 'TBD', placeholder: true },
      ],
      testimonial: {
        quote: 'TBD — owner to provide.',
        name: 'TBD',
        role: 'TBD',
        company: 'Vins Fins',
        placeholder: true,
      },
    },
    lagrocerie: {
      slug: 'lagrocerie',
      title: 'La Grocerie',
      kicker: 'E-commerce · farm-to-table grocery & natural wine',
      problem: [
        'La Grocerie, a sister shop to Vins Fins, needed a grocery and natural-wine store sourcing from short-supply-chain producers.',
        'It had to share infrastructure with Vins Fins (Stripe, stock) while staying its own brand.',
      ],
      process: [
        'Built the shop on the same Next.js stack as Vins Fins, sharing the Stripe account and stock KV.',
        'Added real-time stock management and a lightweight admin the team uses daily.',
      ],
      result: [
        'A grocery and natural-wine cellar live at lagrocerie.lu.',
        'Shared infrastructure with Vins Fins keeps operations simple for one small team.',
      ],
      metrics: [
        { label: 'Shared stack', value: 'Vins Fins', placeholder: false },
        { label: 'Lighthouse performance', value: 'TBD', placeholder: true },
        { label: 'Time to launch', value: 'TBD', placeholder: true },
        { label: 'Catalogue size', value: 'TBD', placeholder: true },
      ],
      testimonial: {
        quote: 'TBD — owner to provide.',
        name: 'TBD',
        role: 'TBD',
        company: 'La Grocerie',
        placeholder: true,
      },
    },
  };

  export function getCaseStudy(slug: string): CaseStudy | undefined {
    return (CASE_STUDIES as Record<string, CaseStudy>)[slug];
  }
  ```

- [ ] **Step 4: Implement the case-study page.**
  Create `/Users/hodlmedia/forge/src/app/[locale]/work/[slug]/page.tsx`:
  ```tsx
  import type { Metadata } from 'next';
  import { notFound } from 'next/navigation';
  import { setRequestLocale } from 'next-intl/server';
  import { CASE_STUDIES, getCaseStudy } from '@/data/case-studies';
  import { WORK } from '@/data/work';
  import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';

  export function generateStaticParams() {
    return LOCALES.flatMap((locale) =>
      Object.keys(CASE_STUDIES).map((slug) => ({ locale, slug })),
    );
  }

  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: Locale; slug: string }>;
  }): Promise<Metadata> {
    const { locale, slug } = await params;
    const cs = getCaseStudy(slug);
    if (!cs) return {};
    return {
      title: `${cs.title} — Case study — Openletz`,
      description: cs.kicker,
      alternates: { canonical: localeUrl(locale, `/work/${slug}`) },
    };
  }

  export default async function CaseStudyPage({
    params,
  }: {
    params: Promise<{ locale: Locale; slug: string }>;
  }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const cs = getCaseStudy(slug);
    if (!cs) notFound();
    const work = WORK.find((w) => w.slug === slug);

    return (
      <main className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[2fr_1fr]">
          <article className="max-w-none">
            <p className="font-mono text-xs uppercase tracking-widest text-text-dim">{cs.kicker}</p>
            <h1 className="mt-2 text-4xl font-semibold text-text">{cs.title}</h1>

            <h2 className="mt-10 text-2xl font-semibold text-text">Problem</h2>
            {cs.problem.map((p, i) => (
              <p key={i} className="mt-3 text-text-dim">{p}</p>
            ))}

            <h2 className="mt-10 text-2xl font-semibold text-text">Process</h2>
            {cs.process.map((p, i) => (
              <p key={i} className="mt-3 text-text-dim">{p}</p>
            ))}

            <h2 className="mt-10 text-2xl font-semibold text-text">Result</h2>
            {cs.result.map((p, i) => (
              <p key={i} className="mt-3 text-text-dim">{p}</p>
            ))}

            {work && (
              <p className="mt-10">
                <a href={work.link} target="_blank" rel="noopener noreferrer" className="ol-link text-hot">
                  Visit {cs.title} ↗
                </a>
              </p>
            )}
          </article>

          {/* Fixed metric sidebar */}
          <aside className="md:sticky md:top-24 md:self-start">
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">By the numbers</h2>
            <dl className="mt-4 grid gap-4">
              {cs.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="text-text-dim text-sm">{m.label}</dt>
                  <dd className="font-mono text-2xl text-text">
                    {m.value}
                    {m.placeholder && (
                      <span className="ml-1 align-super text-[10px] text-text-dim">(pending)</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </main>
    );
  }
  ```

- [ ] **Step 5: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/data/case-studies.test.ts
  ```
  Expected output (contains):
  ```
  ✓ src/data/case-studies.test.ts (4)
  Test Files  1 passed (1)
  ```

- [ ] **Step 6: Typecheck + manual verify.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0). Then:
  ```bash
  cd /Users/hodlmedia/forge && PORT=3030 npm run dev
  ```
  Open `http://localhost:3030/work/vinsfins` and `http://localhost:3030/work/lagrocerie`: confirm Problem/Process/Result render with the metric sidebar (pending markers visible), and `/work/gategram` returns the 404 page. Stop the server.

- [ ] **Step 7: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/data/case-studies.ts src/data/case-studies.test.ts src/app/\[locale\]/work/\[slug\]/page.tsx && git commit -m "feat(sections): add Vins Fins and La Grocerie case-study essays"
  ```

---

### Task 2.12: `/about` page

Founder-forward bio + Commit Media entity + the EU/GDPR/AI-Act trust block. From `ABOUT`. `setRequestLocale` + `generateStaticParams`. Render test (against an exported body) + manual verify.

> The Nav and Footer come from the locale layout (Phase 1, Task 1.12) — this page renders ONLY its own `<main>` content and does NOT render its own Nav or Footer.

**Files:**
- `/Users/hodlmedia/forge/src/app/[locale]/about/page.tsx` (Create)
- `/Users/hodlmedia/forge/src/app/[locale]/about/About.test.tsx` (Create)

- [ ] **Step 1: Write the failing test.**
  Create `/Users/hodlmedia/forge/src/app/[locale]/about/About.test.tsx`:
  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import { AboutBody } from './page';
  import { ABOUT } from '@/data/about';

  describe('AboutBody', () => {
    it('renders the founder name, role and bio lead', () => {
      render(<AboutBody />);
      expect(screen.getByText(ABOUT.founderName)).toBeInTheDocument();
      expect(screen.getByText(ABOUT.founderRole)).toBeInTheDocument();
      expect(screen.getByText(ABOUT.bioLead)).toBeInTheDocument();
    });

    it('renders the entity line and all trust facts', () => {
      render(<AboutBody />);
      expect(screen.getByText(ABOUT.entity)).toBeInTheDocument();
      for (const fact of ABOUT.facts) expect(screen.getByText(fact)).toBeInTheDocument();
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/app/\[locale\]/about/About.test.tsx
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "./page"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement the page (export `AboutBody` for testing).**
  Create `/Users/hodlmedia/forge/src/app/[locale]/about/page.tsx`:
  ```tsx
  import type { Metadata } from 'next';
  import { setRequestLocale } from 'next-intl/server';
  import { ABOUT } from '@/data/about';
  import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';

  export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
  }

  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    return {
      title: 'About — Openletz',
      description: ABOUT.bioLead,
      alternates: { canonical: localeUrl(locale, '/about') },
    };
  }

  /** Body extracted so it can be unit-tested without async params. */
  export function AboutBody() {
    return (
      <main className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold text-text">{ABOUT.founderName}</h1>
          <p className="mt-2 text-text-dim">{ABOUT.founderRole}</p>
          <p className="mt-8 text-lg text-text-dim">{ABOUT.bioLead}</p>

          <section className="mt-12 rounded-lg border border-hairline p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-text-dim">
              European by default
            </h2>
            <ul role="list" className="mt-4 grid gap-3">
              {ABOUT.facts.map((fact) => (
                <li key={fact} className="text-text-dim">{fact}</li>
              ))}
            </ul>
          </section>

          <p className="mt-12 text-sm text-text-dim">{ABOUT.entity}</p>
        </div>
      </main>
    );
  }

  export default async function AboutPage({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <AboutBody />;
  }
  ```

- [ ] **Step 4: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/app/\[locale\]/about/About.test.tsx
  ```
  Expected output (contains):
  ```
  ✓ src/app/[locale]/about/About.test.tsx (2)
  Test Files  1 passed (1)
  ```

- [ ] **Step 5: Typecheck + manual verify.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0). Then:
  ```bash
  cd /Users/hodlmedia/forge && PORT=3030 npm run dev
  ```
  Open `http://localhost:3030/about`: confirm founder bio, the 3 trust facts and the entity line render. Stop the server.

- [ ] **Step 6: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/app/\[locale\]/about/page.tsx src/app/\[locale\]/about/About.test.tsx && git commit -m "feat(sections): add founder-forward /about page with EU trust block"
  ```

---

### Task 2.13: `/contact` standalone page

Standalone enquiry page: reuse `EnquiryForm` (the same `CONTACT.types` pillars) + the book-a-call secondary line. `setRequestLocale` + `generateStaticParams`. Render test + manual verify.

> The Nav and Footer come from the locale layout (Phase 1, Task 1.12) — this page renders ONLY its own `<main>` content and does NOT render its own Nav or Footer.

**Files:**
- `/Users/hodlmedia/forge/src/app/[locale]/contact/page.tsx` (Create)
- `/Users/hodlmedia/forge/src/app/[locale]/contact/Contact.test.tsx` (Create)

- [ ] **Step 1: Write the failing test.**
  Create `/Users/hodlmedia/forge/src/app/[locale]/contact/Contact.test.tsx`:
  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import { ContactBody } from './page';
  import { CONTACT } from '@/data/contact';

  describe('ContactBody', () => {
    it('renders the lead, the enquiry form and the call line', () => {
      const { container } = render(<ContactBody />);
      expect(screen.getByText(CONTACT.lead)).toBeInTheDocument();
      expect(container.querySelector('[data-enquiry-form]')).toBeInTheDocument();
      expect(screen.getByText(/15-minute intro call/i)).toBeInTheDocument();
    });

    it('offers every CONTACT pillar in the form', () => {
      render(<ContactBody />);
      const select = screen.getByLabelText(/pillar|what can we help/i);
      for (const t of CONTACT.types) {
        expect(select).toHaveTextContent(t);
      }
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/app/\[locale\]/contact/Contact.test.tsx
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "./page"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement the page (export `ContactBody`).**
  Create `/Users/hodlmedia/forge/src/app/[locale]/contact/page.tsx`:
  ```tsx
  import type { Metadata } from 'next';
  import { setRequestLocale } from 'next-intl/server';
  import { EnquiryForm } from '@/components/EnquiryForm';
  import { CONTACT } from '@/data/contact';
  import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';

  export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
  }

  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    return {
      title: 'Contact — Openletz',
      description: CONTACT.lead,
      alternates: { canonical: localeUrl(locale, '/contact') },
    };
  }

  export function ContactBody() {
    return (
      <main className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-semibold text-text">Start a project</h1>
          <p className="mt-4 text-lg text-text-dim">{CONTACT.lead}</p>
          <div className="mt-10">
            <EnquiryForm pillars={CONTACT.types} />
          </div>
          <p className="mt-8 text-sm text-text-dim">
            {CONTACT.callLine}{' '}
            <a href="https://cal.com/openletz" className="ol-link text-hot">
              Book a 15-minute intro call
            </a>
          </p>
        </div>
      </main>
    );
  }

  export default async function ContactPage({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ContactBody />;
  }
  ```
  > NOTE: the book-a-call URL (`cal.com/openletz`) is a placeholder pending the owner's real scheduling link (spec §12). It is the quieter secondary action; the enquiry form remains primary.

- [ ] **Step 4: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/app/\[locale\]/contact/Contact.test.tsx
  ```
  Expected output (contains):
  ```
  ✓ src/app/[locale]/contact/Contact.test.tsx (2)
  Test Files  1 passed (1)
  ```

- [ ] **Step 5: Typecheck + manual verify.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0). Then:
  ```bash
  cd /Users/hodlmedia/forge && PORT=3030 npm run dev
  ```
  Open `http://localhost:3030/contact`: confirm the form renders all six fields and the book-a-call line appears. Stop the server.

- [ ] **Step 6: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/app/\[locale\]/contact/page.tsx src/app/\[locale\]/contact/Contact.test.tsx && git commit -m "feat(sections): add standalone /contact page reusing EnquiryForm"
  ```

---

### Task 2.14: `/legal/privacy` + `/legal/terms`

Salvaged boilerplate, domain-fixed: emails → `siteConfig.brand.email` / `privacyEmail`; grants/quiz/simulator language removed. `setRequestLocale` + `generateStaticParams`. Render tests assert the canonical domain email appears and no grants/quiz wording remains.

> The Nav and Footer come from the locale layout (Phase 1, Task 1.12) — these pages render ONLY their own `<main>` content and do NOT render their own Nav or Footer.

**Files:**
- `/Users/hodlmedia/forge/src/data/legal.ts` (Create)
- `/Users/hodlmedia/forge/src/data/legal.test.ts` (Create)
- `/Users/hodlmedia/forge/src/app/[locale]/legal/privacy/page.tsx` (Create)
- `/Users/hodlmedia/forge/src/app/[locale]/legal/terms/page.tsx` (Create)

- [ ] **Step 1: Write the failing legal-content test.**
  Create `/Users/hodlmedia/forge/src/data/legal.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import { PRIVACY, TERMS } from '@/data/legal';
  import { siteConfig } from '@/lib/site-config';

  describe('legal content', () => {
    it('privacy uses the canonical openletz.ai privacy email and no .com', () => {
      const blob = JSON.stringify(PRIVACY);
      expect(blob).toContain(siteConfig.brand.privacyEmail);
      expect(blob).not.toContain('openletz.com');
      expect(blob).not.toContain('bob@');
    });

    it('terms uses the canonical hello email and no .com', () => {
      const blob = JSON.stringify(TERMS);
      expect(blob).toContain(siteConfig.brand.email);
      expect(blob).not.toContain('openletz.com');
    });

    it('drops all grants/quiz/simulator language', () => {
      const blob = (JSON.stringify(PRIVACY) + JSON.stringify(TERMS)).toLowerCase();
      for (const dead of ['quiz', 'simulat', 'subvention', 'eligibilit', 'grant', 'aides']) {
        expect(blob).not.toContain(dead);
      }
    });

    it('each doc has a title and at least 3 sections', () => {
      for (const doc of [PRIVACY, TERMS]) {
        expect(doc.title.length).toBeGreaterThan(0);
        expect(doc.sections.length).toBeGreaterThanOrEqual(3);
      }
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/data/legal.test.ts
  ```
  Expected output (contains):
  ```
  Error: Failed to resolve import "@/data/legal"
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Implement the legal content (salvaged structure, domain-fixed, agency-rewritten).**
  Create `/Users/hodlmedia/forge/src/data/legal.ts`:
  ```ts
  import { siteConfig } from '@/lib/site-config';

  export interface LegalSection { title: string; body: string }
  export interface LegalDoc { title: string; lastUpdated: string; sections: LegalSection[] }

  const { email, privacyEmail, legalEntity } = siteConfig.brand;

  export const PRIVACY: LegalDoc = {
    title: 'Privacy Policy',
    lastUpdated: '2026-06-07',
    sections: [
      {
        title: '1. Who we are',
        body: `Openletz is the studio name of ${legalEntity}. We are the data controller for personal data collected through this website. For any privacy request, contact ${privacyEmail}.`,
      },
      {
        title: '2. Data we collect',
        body:
          'We collect only what you give us: the name, email and message you submit through the enquiry form, and the email address you submit to the newsletter. We do not run trackers beyond privacy-respecting analytics, and we never sell or rent your data.',
      },
      {
        title: '3. How we use it',
        body:
          'Enquiry details are used to reply to your project request. Newsletter emails are used only to send occasional studio updates; you can unsubscribe at any time.',
      },
      {
        title: '4. Where it lives',
        body:
          'Data is processed in the EU. We choose tools with the GDPR in mind and host in Europe wherever possible.',
      },
      {
        title: '5. Your rights',
        body: `Under the GDPR you can access, correct or delete your data, or object to its processing. Email ${privacyEmail} and we will respond within one month.`,
      },
    ],
  };

  export const TERMS: LegalDoc = {
    title: 'Terms of Service',
    lastUpdated: '2026-06-07',
    sections: [
      {
        title: '1. Who we are',
        body: `This website is operated by ${legalEntity}, trading as Openletz. Contact: ${email}.`,
      },
      {
        title: '2. What this site is',
        body:
          'Openletz is the website of a Luxembourg AI agency. It presents our services and work and lets you start a project enquiry. It does not, by itself, create a contract for services.',
      },
      {
        title: '3. Engagements',
        body:
          'Any project we take on is governed by a separate written quote and agreement. Nothing on this site is a binding offer.',
      },
      {
        title: '4. Intellectual property',
        body:
          'The site’s content and brand are ours unless stated otherwise. Client work shown here is published with permission.',
      },
      {
        title: '5. Liability & law',
        body: 'The site is provided “as is”. These terms are governed by Luxembourg law.',
      },
    ],
  };
  ```

- [ ] **Step 4: Implement the two legal pages.**
  Create `/Users/hodlmedia/forge/src/app/[locale]/legal/privacy/page.tsx`:
  ```tsx
  import type { Metadata } from 'next';
  import { setRequestLocale } from 'next-intl/server';
  import { PRIVACY } from '@/data/legal';
  import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';

  export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
  }

  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    return {
      title: `${PRIVACY.title} — Openletz`,
      alternates: { canonical: localeUrl(locale, '/legal/privacy') },
    };
  }

  export default async function PrivacyPage({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
      <main className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold text-text">{PRIVACY.title}</h1>
          <p className="mt-2 text-sm text-text-dim">Last updated {PRIVACY.lastUpdated}</p>
          {PRIVACY.sections.map((s) => (
            <section key={s.title} className="mt-10">
              <h2 className="text-xl font-semibold text-text">{s.title}</h2>
              <p className="mt-3 text-text-dim">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
    );
  }
  ```
  Create `/Users/hodlmedia/forge/src/app/[locale]/legal/terms/page.tsx`:
  ```tsx
  import type { Metadata } from 'next';
  import { setRequestLocale } from 'next-intl/server';
  import { TERMS } from '@/data/legal';
  import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';

  export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
  }

  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    return {
      title: `${TERMS.title} — Openletz`,
      alternates: { canonical: localeUrl(locale, '/legal/terms') },
    };
  }

  export default async function TermsPage({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return (
      <main className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold text-text">{TERMS.title}</h1>
          <p className="mt-2 text-sm text-text-dim">Last updated {TERMS.lastUpdated}</p>
          {TERMS.sections.map((s) => (
            <section key={s.title} className="mt-10">
              <h2 className="text-xl font-semibold text-text">{s.title}</h2>
              <p className="mt-3 text-text-dim">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
    );
  }
  ```

- [ ] **Step 5: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/data/legal.test.ts
  ```
  Expected output (contains):
  ```
  ✓ src/data/legal.test.ts (4)
  Test Files  1 passed (1)
  ```

- [ ] **Step 6: Typecheck + manual verify.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0). Then:
  ```bash
  cd /Users/hodlmedia/forge && PORT=3030 npm run dev
  ```
  Open `http://localhost:3030/legal/privacy` and `http://localhost:3030/legal/terms`: confirm both render with `openletz.ai` emails. Stop the server.

- [ ] **Step 7: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/data/legal.ts src/data/legal.test.ts src/app/\[locale\]/legal/ && git commit -m "feat(seo): add domain-fixed privacy and terms pages"
  ```

---

### Task 2.15: Rebuild `sitemap.ts` for the new IA

Replace the grants/agents/blog sitemap with the Phase-2 IA: home, /work, /work/[vinsfins|lagrocerie], /about, /contact, /legal/privacy, /legal/terms — across en/fr/de from `site-config`. (Phase 3 EXTENDS it with /services, /pricing, /audit, /insights — do NOT add those here.) TDD.

**Files:**
- `/Users/hodlmedia/forge/src/app/sitemap.ts` (Modify)
- `/Users/hodlmedia/forge/src/app/sitemap.test.ts` (Create)

- [ ] **Step 1: Write the failing test.**
  Create `/Users/hodlmedia/forge/src/app/sitemap.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest';
  import sitemap from '@/app/sitemap';
  import { localeUrl } from '@/lib/site-config';

  describe('sitemap', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    it('includes the Phase-2 IA paths for the default locale', () => {
      for (const path of ['', '/work', '/work/vinsfins', '/work/lagrocerie', '/about', '/contact', '/legal/privacy', '/legal/terms']) {
        expect(urls).toContain(localeUrl('en', path));
      }
    });

    it('emits all three locales', () => {
      expect(urls).toContain(localeUrl('fr', '/work'));
      expect(urls).toContain(localeUrl('de', '/about'));
    });

    it('contains NO grants/agents/blog/clients legacy URLs', () => {
      const joined = urls.join('\n');
      for (const dead of ['/aides', '/agents', '/blog', '/clients']) {
        expect(joined).not.toContain(dead);
      }
    });

    it('does NOT yet include Phase-3 routes', () => {
      const joined = urls.join('\n');
      for (const later of ['/services', '/pricing', '/audit', '/insights']) {
        expect(joined).not.toContain(later);
      }
    });

    it('uses the openletz.ai apex on every URL', () => {
      for (const url of urls) expect(url.startsWith('https://openletz.ai')).toBe(true);
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL (old sitemap imports AGENTS/PROGRAMS; legacy/Phase-3 assertions fail).**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/app/sitemap.test.ts
  ```
  Expected output (contains):
  ```
  ✗ sitemap > contains NO grants/agents/blog/clients legacy URLs
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Rebuild the sitemap.**
  Replace `/Users/hodlmedia/forge/src/app/sitemap.ts`:
  ```ts
  import type { MetadataRoute } from 'next';
  import { LOCALES, localeUrl } from '@/lib/site-config';
  import { CASE_STUDIES } from '@/data/case-studies';

  // Phase-2 IA only. Phase 3 EXTENDS this with /services, /pricing, /audit, /insights.
  const STATIC_PATHS: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '', priority: 1.0, freq: 'weekly' },
    { path: '/work', priority: 0.8, freq: 'monthly' },
    { path: '/about', priority: 0.6, freq: 'monthly' },
    { path: '/contact', priority: 0.7, freq: 'monthly' },
    { path: '/legal/privacy', priority: 0.3, freq: 'yearly' },
    { path: '/legal/terms', priority: 0.3, freq: 'yearly' },
  ];

  function alternates(path: string) {
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) languages[locale] = localeUrl(locale, path);
    languages['x-default'] = localeUrl('en', path);
    return { languages };
  }

  export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    const out: MetadataRoute.Sitemap = [];

    for (const { path, priority, freq } of STATIC_PATHS) {
      for (const locale of LOCALES) {
        out.push({
          url: localeUrl(locale, path),
          lastModified,
          changeFrequency: freq,
          priority,
          alternates: alternates(path),
        });
      }
    }

    for (const slug of Object.keys(CASE_STUDIES)) {
      const path = `/work/${slug}`;
      for (const locale of LOCALES) {
        out.push({
          url: localeUrl(locale, path),
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: alternates(path),
        });
      }
    }

    return out;
  }
  ```

- [ ] **Step 4: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/app/sitemap.test.ts
  ```
  Expected output (contains):
  ```
  ✓ src/app/sitemap.test.ts (5)
  Test Files  1 passed (1)
  ```

- [ ] **Step 5: Typecheck.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0).

- [ ] **Step 6: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/app/sitemap.ts src/app/sitemap.test.ts && git commit -m "feat(seo): rebuild sitemap for the Phase-2 IA"
  ```

---

### Task 2.16: Populate `LEGACY_REDIRECTS` (full per-URL 301 map)

Fill the empty `LEGACY_REDIRECTS` stub (created in Phase 0) with the real killed-legacy-URL → new-equivalent 301 map, and extend `redirects.test.ts` so every killed legacy URL has a 301, none of the content slugs blanket-redirect to home, and there are no duplicate sources. Real legacy slugs (verified in the repo before deletion): `/aides` + 6 program slugs, `/agents` + 33 agent slugs, old `/blog` + 7 post slugs, `/clients`, plus the 8 dropped-locale folds (`lb pt it es ru ar tr uk`). The RGPD/DSGVO/DPA ranking cluster (under `/agents/*`) is preserved by mapping `/agents/*` → `/about` (the EU/GDPR/AI-Act trust block).

**Files:**
- `/Users/hodlmedia/forge/src/lib/redirects.ts` (Modify — populate `LEGACY_REDIRECTS`)
- `/Users/hodlmedia/forge/src/lib/redirects.test.ts` (Modify — extend coverage)

- [ ] **Step 1: Append the legacy-coverage test block.**
  Append to `/Users/hodlmedia/forge/src/lib/redirects.test.ts` (the Phase-0 test already covers the `HOST_REDIRECTS` `.com→.ai` inversion):
  ```ts
  import { describe, it, expect } from 'vitest';
  import { LEGACY_REDIRECTS } from '@/lib/redirects';

  // The real killed legacy slugs (verified against the repo before deletion).
  const AIDES_SLUGS = [
    'fit-4-ai',
    'fit-4-digital',
    'fit-4-innovation',
    'sme-package-ai',
    'sme-package-cybersecurite',
    'sme-package-digital',
  ];
  const AGENT_SLUGS = [
    'liberclaw', 'chatgpt', 'claude', 'perplexity', 'jasper', 'copy-ai', 'elevenlabs',
    'zapier-ai', 'notion-ai', 'otter-ai', 'julius-ai', 'rows-ai', 'monkeylearn', 'midjourney',
    'canva-ai', 'runway', 'github-copilot', 'cursor', 'v0-by-vercel', 'google-gemini', 'mistral',
    'deepl', 'grammarly', 'synthesia', 'hubspot-ai', 'fireflies-ai', 'durable', 'writesonic',
    'tome', 'surfer-seo', 'make', 'heygen', 'beautiful-ai',
  ];
  const BLOG_SLUGS = [
    'aide-cybersecurite-pme-luxembourg',
    'aides-luxembourg-2026-annuaire-complet',
    'fit-4-ai-guide-complet',
    'fit-4-digital-vs-fit-4-ai-comparaison',
    'quelle-aide-digitalisation-choisir',
    'sme-package-digital-guide-complet',
    'top-outils-ia-pme-luxembourg',
  ];
  const DROPPED_LOCALES = ['lb', 'pt', 'it', 'es', 'ru', 'ar', 'tr', 'uk'];

  const sources = () => LEGACY_REDIRECTS.map((r) => r.source);

  describe('LEGACY_REDIRECTS coverage', () => {
    it('every redirect is a permanent 301', () => {
      for (const r of LEGACY_REDIRECTS) expect(r.permanent).toBe(true);
    });

    it('redirects the /aides index and all 6 program slugs', () => {
      const s = sources();
      expect(s).toContain('/aides');
      for (const slug of AIDES_SLUGS) expect(s).toContain(`/aides/${slug}`);
    });

    it('redirects the /agents index and all 33 agent slugs', () => {
      const s = sources();
      expect(s).toContain('/agents');
      for (const slug of AGENT_SLUGS) expect(s).toContain(`/agents/${slug}`);
    });

    it('redirects the old /blog index and all 7 posts', () => {
      const s = sources();
      expect(s).toContain('/blog');
      for (const slug of BLOG_SLUGS) expect(s).toContain(`/blog/${slug}`);
    });

    it('redirects /clients', () => {
      expect(sources()).toContain('/clients');
    });

    it('folds every dropped locale prefix to its unprefixed equivalent', () => {
      const s = sources();
      for (const loc of DROPPED_LOCALES) expect(s).toContain(`/${loc}/:path*`);
    });

    it('preserves the RGPD/DSGVO/DPA cluster by sending agents to the trust block', () => {
      const agentRules = LEGACY_REDIRECTS.filter((r) => r.source.startsWith('/agents/'));
      expect(agentRules.length).toBeGreaterThan(0);
      for (const r of agentRules) expect(r.destination).toBe('/about');
    });

    it('has no duplicate sources', () => {
      const s = sources();
      expect(new Set(s).size).toBe(s.length);
    });

    it('never maps a real content slug straight to home', () => {
      const contentRules = LEGACY_REDIRECTS.filter(
        (r) =>
          r.source.startsWith('/agents/') ||
          r.source.startsWith('/aides/') ||
          r.source.startsWith('/blog/'),
      );
      for (const r of contentRules) expect(r.destination).not.toBe('/');
    });
  });
  ```

- [ ] **Step 2: Run the test — expect FAIL (stub is empty).**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/lib/redirects.test.ts
  ```
  Expected output (contains):
  ```
  ✗ LEGACY_REDIRECTS coverage > redirects the /aides index and all 6 program slugs
  ... Test Files  1 failed
  ```

- [ ] **Step 3: Populate `LEGACY_REDIRECTS`.**
  In `/Users/hodlmedia/forge/src/lib/redirects.ts`, keep the Phase-0 `Redirect` interface and `HOST_REDIRECTS` untouched and replace the empty `LEGACY_REDIRECTS` stub with:
  ```ts
  const AIDES_SLUGS = [
    'fit-4-ai',
    'fit-4-digital',
    'fit-4-innovation',
    'sme-package-ai',
    'sme-package-cybersecurite',
    'sme-package-digital',
  ];

  const AGENT_SLUGS = [
    'liberclaw', 'chatgpt', 'claude', 'perplexity', 'jasper', 'copy-ai', 'elevenlabs',
    'zapier-ai', 'notion-ai', 'otter-ai', 'julius-ai', 'rows-ai', 'monkeylearn', 'midjourney',
    'canva-ai', 'runway', 'github-copilot', 'cursor', 'v0-by-vercel', 'google-gemini', 'mistral',
    'deepl', 'grammarly', 'synthesia', 'hubspot-ai', 'fireflies-ai', 'durable', 'writesonic',
    'tome', 'surfer-seo', 'make', 'heygen', 'beautiful-ai',
  ];

  const BLOG_SLUGS = [
    'aide-cybersecurite-pme-luxembourg',
    'aides-luxembourg-2026-annuaire-complet',
    'fit-4-ai-guide-complet',
    'fit-4-digital-vs-fit-4-ai-comparaison',
    'quelle-aide-digitalisation-choisir',
    'sme-package-digital-guide-complet',
    'top-outils-ia-pme-luxembourg',
  ];

  const DROPPED_LOCALES = ['lb', 'pt', 'it', 'es', 'ru', 'ar', 'tr', 'uk'];

  function legacy(source: string, destination: string): Redirect {
    return { source, destination, permanent: true };
  }

  export const LEGACY_REDIRECTS: Redirect[] = [
    // --- Grants era (/aides) — the studio no longer does grant consulting.
    //     Index -> home; the 6 program guides -> /about (the SME Package is mentioned softly there).
    legacy('/aides', '/'),
    ...AIDES_SLUGS.map((slug) => legacy(`/aides/${slug}`, '/about')),

    // --- AI-tools directory (/agents) — killed.
    //     RGPD/DSGVO/DPA ranking cluster preserved: ALL /agents/* land on the
    //     EU/GDPR/AI-Act trust block (/about); the index goes to /work (real products).
    legacy('/agents', '/work'),
    ...AGENT_SLUGS.map((slug) => legacy(`/agents/${slug}`, '/about')),

    // --- Old grants-era blog — all 7 posts removed; posts -> /work, index -> home
    //     (new agency posts arrive in Phase 3 at /insights).
    legacy('/blog', '/'),
    ...BLOG_SLUGS.map((slug) => legacy(`/blog/${slug}`, '/work')),

    // --- Legacy clients page folded into /work.
    legacy('/clients', '/work'),

    // --- Dropped-locale folds: collapse the 8 removed locale prefixes onto the EN default.
    ...DROPPED_LOCALES.map((loc) => legacy(`/${loc}/:path*`, '/:path*')),
  ];
  ```
  > NOTE: per-slug `/agents/:slug` and `/blog/:slug` rules (rather than one wildcard) are used so Google sees an exact 301 for each previously-indexed URL and the exhaustive-slug test passes. The `/{loc}/:path*` folds use Next.js path-pattern syntax and are the ONLY rules whose destination contains `/` as a path segment — the "no content slug to home" test exempts them because they don't start with `/agents//aides//blog/`.

- [ ] **Step 4: Run the test — expect PASS.**
  ```bash
  cd /Users/hodlmedia/forge && npm run test -- src/lib/redirects.test.ts
  ```
  Expected output (contains):
  ```
  ✓ src/lib/redirects.test.ts (...)
  Test Files  1 passed (1)
  ```

- [ ] **Step 5: Typecheck.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck
  ```
  Expected output: no output (exit 0).

- [ ] **Step 6: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add src/lib/redirects.ts src/lib/redirects.test.ts && git commit -m "feat(redirects): populate per-URL legacy 301 map for killed grants/agents/blog URLs"
  ```

---

### Task 2.17: Phase-2 end-state verification

Whole-site dev-server pass with `prefers-reduced-motion` ON, an E2E homepage spec, a reduced-motion spec, and a green typecheck + unit + build.

**Files:**
- `/Users/hodlmedia/forge/e2e/home.spec.ts` (Create)
- `/Users/hodlmedia/forge/e2e/reduced-motion.spec.ts` (Create)

- [ ] **Step 1: Write the homepage E2E spec.**
  Create `/Users/hodlmedia/forge/e2e/home.spec.ts`:
  ```ts
  import { test, expect } from '@playwright/test';

  test.describe('homepage', () => {
    test('loads at / with the LCP H1 visible', async ({ page }) => {
      await page.goto('/');
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText(/think, move & transact/i);
    });

    test('renders all 8 in-page homepage sections (footer is layout-level)', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('[data-section]')).toHaveCount(8);
    });

    test('"Start a project" reaches the enquiry form', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: /start a project/i }).first().click();
      await expect(page.locator('#enquiry')).toBeInViewport();
      await expect(page.locator('#enquiry [data-enquiry-form]')).toBeVisible();
    });

    test('the H1 paints regardless of the live proof strip', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('the layout-level Nav and Footer wrap the page', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('[data-nav]')).toBeVisible();
      await expect(page.locator('[data-footer]')).toBeVisible();
      // the footer's newsletter form is present (layout-level, not a section)
      await expect(page.locator('[data-footer] [data-newsletter-form]')).toBeAttached();
    });
  });
  ```

- [ ] **Step 2: Write the reduced-motion E2E spec.**
  Create `/Users/hodlmedia/forge/e2e/reduced-motion.spec.ts`:
  ```ts
  import { test, expect } from '@playwright/test';

  test.use({ reducedMotion: 'reduce' });

  test.describe('prefers-reduced-motion: reduce', () => {
    test('content is fully visible with no spectacle', async ({ page }) => {
      await page.goto('/');
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      // LCP node must be fully opaque even with motion reduced
      await expect(h1).toHaveCSS('opacity', '1');
    });

    test('the sub-line reveal still ends visible (reduced != stripped)', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByText('A Luxembourg AI agency.')).toBeVisible();
    });

    test('the enquiry form is reachable and usable', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: /start a project/i }).first().click();
      await expect(page.getByLabel(/name/i)).toBeVisible();
    });
  });
  ```

- [ ] **Step 3: Run the full unit suite + typecheck — expect green.**
  ```bash
  cd /Users/hodlmedia/forge && npm run typecheck && npm run test
  ```
  Expected output (contains):
  ```
  Test Files  ... passed
  ```
  (typecheck emits no output, exit 0).

- [ ] **Step 4: Run the E2E specs (Playwright boots `PORT=3030 npm run dev` via webServer).**
  ```bash
  cd /Users/hodlmedia/forge && npm run test:e2e -- e2e/home.spec.ts e2e/reduced-motion.spec.ts
  ```
  Expected output (contains):
  ```
  8 passed
  ```

- [ ] **Step 5: Production build — expect green.**
  ```bash
  cd /Users/hodlmedia/forge && npm run build
  ```
  Expected output (contains):
  ```
  ✓ Compiled successfully
  ... Generating static pages
  ```
  with no type or lint errors.

- [ ] **Step 6: Whole-site manual verification with reduced-motion ON.**
  ```bash
  cd /Users/hodlmedia/forge && PORT=3030 npm run dev
  ```
  With OS "reduce motion" enabled OR DevTools rendering emulation `prefers-reduced-motion: reduce`, walk every Phase-2 route and confirm each renders, content is visible, the layout-level Nav + Footer appear on every page (no page renders its own), and the primary CTA reaches the enquiry form:
  `/`, `/work`, `/work/vinsfins`, `/work/lagrocerie`, `/about`, `/contact`, `/legal/privacy`, `/legal/terms`, plus `/fr` and `/de`. Confirm a killed legacy URL (e.g. `/agents/claude`) 301s to `/about`. Stop the server.

- [ ] **Step 7: Commit.**
  ```bash
  cd /Users/hodlmedia/forge && git add e2e/home.spec.ts e2e/reduced-motion.spec.ts && git commit -m "test(sections): add homepage and reduced-motion E2E specs"
  ```


---

## Phase 3 — Conversion & growth layers

### Task 3.1: Audit scoring logic — `src/lib/audit.ts` (TDD)

The `/audit` lead magnet's brain. A **pure**, framework-free scoring function over a normalized "signals" object (extracted server-side from a fetched URL in Task 3.2). This task TDDs ONLY the deterministic scoring/grading — no network. Network fetch + rate-limit live in the API route (Task 3.2).

**Files:**
- Create: `/Users/hodlmedia/forge/src/lib/audit.ts`
- Test: `/Users/hodlmedia/forge/src/lib/audit.test.ts`

- [ ] **Step 1: Write the failing test.**

```ts
// src/lib/audit.test.ts
import { describe, it, expect } from 'vitest';
import { scoreAudit, type AuditSignals, type AuditResult, MAX_AUDIT_SCORE } from '@/lib/audit';

function baseSignals(over: Partial<AuditSignals> = {}): AuditSignals {
  return {
    https: false,
    hasTitle: false,
    titleLength: 0,
    hasMetaDescription: false,
    metaDescriptionLength: 0,
    h1Count: 0,
    hasViewport: false,
    hasOpenGraph: false,
    hasStructuredData: false,
    hasCanonical: false,
    hasRobotsTxt: false,
    hasSitemap: false,
    hasLlmsTxt: false,
    htmlBytes: 0,
    textBytes: 0,
    ...over,
  };
}

describe('scoreAudit', () => {
  it('returns 0 and grade F for an empty site', () => {
    const r = scoreAudit(baseSignals());
    expect(r.score).toBe(0);
    expect(r.grade).toBe('F');
    expect(r.maxScore).toBe(MAX_AUDIT_SCORE);
  });

  it('awards the full score and grade A for a perfect site', () => {
    const r = scoreAudit(baseSignals({
      https: true,
      hasTitle: true,
      titleLength: 55,
      hasMetaDescription: true,
      metaDescriptionLength: 150,
      h1Count: 1,
      hasViewport: true,
      hasOpenGraph: true,
      hasStructuredData: true,
      hasCanonical: true,
      hasRobotsTxt: true,
      hasSitemap: true,
      hasLlmsTxt: true,
      htmlBytes: 40000,
      textBytes: 9000,
    }));
    expect(r.score).toBe(MAX_AUDIT_SCORE);
    expect(r.grade).toBe('A');
  });

  it('penalises a title that is too short or too long', () => {
    const short = scoreAudit(baseSignals({ hasTitle: true, titleLength: 5 }));
    const ok = scoreAudit(baseSignals({ hasTitle: true, titleLength: 55 }));
    expect(ok.score).toBeGreaterThan(short.score);
  });

  it('flags multiple h1 tags as a fail', () => {
    const single = scoreAudit(baseSignals({ h1Count: 1 }));
    const many = scoreAudit(baseSignals({ h1Count: 4 }));
    const singleH1 = single.checks.find((c) => c.id === 'h1');
    const manyH1 = many.checks.find((c) => c.id === 'h1');
    expect(singleH1?.pass).toBe(true);
    expect(manyH1?.pass).toBe(false);
  });

  it('rewards AEO readiness (structured data + llms.txt) so AI crawlers can cite the site', () => {
    const withAeo = scoreAudit(baseSignals({ hasStructuredData: true, hasLlmsTxt: true }));
    const aeoChecks = withAeo.checks.filter((c) => c.category === 'aeo' && c.pass);
    expect(aeoChecks.length).toBeGreaterThanOrEqual(2);
  });

  it('flags a JS-heavy page where static HTML carries little text (AI crawlers see nothing)', () => {
    const thin = scoreAudit(baseSignals({ htmlBytes: 50000, textBytes: 200 }));
    const check = thin.checks.find((c) => c.id === 'text-ratio');
    expect(check?.pass).toBe(false);
  });

  it('every check carries a human label, a category, and a fix recommendation', () => {
    const r = scoreAudit(baseSignals());
    for (const c of r.checks) {
      expect(c.label.length).toBeGreaterThan(0);
      expect(['security', 'seo', 'aeo', 'meta']).toContain(c.category);
      expect(c.recommendation.length).toBeGreaterThan(0);
    }
  });

  it('grade boundaries: A>=90%, B>=75%, C>=60%, D>=40%, else F', () => {
    expect(scoreAudit(baseSignals({ https: true })).grade).toBe('F');
  });

  it('is pure — same input yields same output', () => {
    const s = baseSignals({ https: true, hasTitle: true, titleLength: 50 });
    expect(scoreAudit(s)).toEqual(scoreAudit(s));
  });
});
```

- [ ] **Step 2: Run the test — expect FAIL (module does not exist).**

```bash
npx vitest run src/lib/audit.test.ts
```

Expected: FAIL — `Failed to resolve import "@/lib/audit"` / `scoreAudit is not a function`.

- [ ] **Step 3: Implement `src/lib/audit.ts` (minimal, pure).**

```ts
// src/lib/audit.ts
// Pure scoring logic for the /audit lead magnet. NO network here — the API route
// (src/app/api/audit/route.ts) fetches the URL, extracts AuditSignals, and calls scoreAudit.

export interface AuditSignals {
  https: boolean;
  hasTitle: boolean;
  titleLength: number;
  hasMetaDescription: boolean;
  metaDescriptionLength: number;
  h1Count: number;
  hasViewport: boolean;
  hasOpenGraph: boolean;
  hasStructuredData: boolean;
  hasCanonical: boolean;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  hasLlmsTxt: boolean;
  htmlBytes: number;
  textBytes: number;
}

export type AuditCategory = 'security' | 'seo' | 'aeo' | 'meta';
export type AuditGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface AuditCheck {
  id: string;
  label: string;
  category: AuditCategory;
  pass: boolean;
  weight: number;
  recommendation: string;
}

export interface AuditResult {
  score: number;        // sum of weights for passing checks
  maxScore: number;     // MAX_AUDIT_SCORE
  grade: AuditGrade;
  checks: AuditCheck[];
}

// 13 checks; weights sum to MAX_AUDIT_SCORE.
const CHECK_WEIGHTS = {
  https: 10,
  title: 10,
  metaDescription: 8,
  h1: 8,
  viewport: 6,
  openGraph: 6,
  canonical: 6,
  structuredData: 12,
  llmsTxt: 10,
  textRatio: 8,
  robotsTxt: 4,
  sitemap: 6,
  metaLength: 6,
} as const;

export const MAX_AUDIT_SCORE = Object.values(CHECK_WEIGHTS).reduce((a, b) => a + b, 0);

function gradeFor(pct: number): AuditGrade {
  if (pct >= 90) return 'A';
  if (pct >= 75) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
}

export function scoreAudit(s: AuditSignals): AuditResult {
  const titleOk = s.hasTitle && s.titleLength >= 15 && s.titleLength <= 65;
  const metaLenOk = s.hasMetaDescription && s.metaDescriptionLength >= 70 && s.metaDescriptionLength <= 165;
  const textRatioOk = s.htmlBytes > 0 && s.textBytes / s.htmlBytes >= 0.05 && s.textBytes >= 500;

  const checks: AuditCheck[] = [
    { id: 'https', label: 'Served over HTTPS', category: 'security', pass: s.https, weight: CHECK_WEIGHTS.https,
      recommendation: 'Serve the site over HTTPS with a valid certificate.' },
    { id: 'title', label: 'Has a well-sized <title>', category: 'seo', pass: titleOk, weight: CHECK_WEIGHTS.title,
      recommendation: 'Add a unique 15–65 character title to every page.' },
    { id: 'meta-description', label: 'Has a meta description', category: 'meta', pass: s.hasMetaDescription, weight: CHECK_WEIGHTS.metaDescription,
      recommendation: 'Add a descriptive meta description tag.' },
    { id: 'meta-length', label: 'Meta description is well-sized', category: 'meta', pass: metaLenOk, weight: CHECK_WEIGHTS.metaLength,
      recommendation: 'Keep the meta description between 70 and 165 characters.' },
    { id: 'h1', label: 'Exactly one <h1>', category: 'seo', pass: s.h1Count === 1, weight: CHECK_WEIGHTS.h1,
      recommendation: 'Use exactly one <h1> that states the page topic.' },
    { id: 'viewport', label: 'Mobile viewport set', category: 'meta', pass: s.hasViewport, weight: CHECK_WEIGHTS.viewport,
      recommendation: 'Add a responsive viewport meta tag.' },
    { id: 'open-graph', label: 'Open Graph tags present', category: 'meta', pass: s.hasOpenGraph, weight: CHECK_WEIGHTS.openGraph,
      recommendation: 'Add og:title/og:description/og:image for rich link previews.' },
    { id: 'canonical', label: 'Canonical URL declared', category: 'seo', pass: s.hasCanonical, weight: CHECK_WEIGHTS.canonical,
      recommendation: 'Declare a canonical URL to avoid duplicate-content dilution.' },
    { id: 'structured-data', label: 'Structured data (JSON-LD)', category: 'aeo', pass: s.hasStructuredData, weight: CHECK_WEIGHTS.structuredData,
      recommendation: 'Add Schema.org JSON-LD so AI assistants and search engines understand the page.' },
    { id: 'llms-txt', label: 'llms.txt for AI crawlers', category: 'aeo', pass: s.hasLlmsTxt, weight: CHECK_WEIGHTS.llmsTxt,
      recommendation: 'Publish /llms.txt to guide AI assistants to your canonical content.' },
    { id: 'text-ratio', label: 'Content is in the static HTML', category: 'aeo', pass: textRatioOk, weight: CHECK_WEIGHTS.textRatio,
      recommendation: 'Render text server-side — AI crawlers do not run your JavaScript.' },
    { id: 'robots-txt', label: 'robots.txt present', category: 'seo', pass: s.hasRobotsTxt, weight: CHECK_WEIGHTS.robotsTxt,
      recommendation: 'Add a robots.txt that points to your sitemap.' },
    { id: 'sitemap', label: 'XML sitemap present', category: 'seo', pass: s.hasSitemap, weight: CHECK_WEIGHTS.sitemap,
      recommendation: 'Publish an XML sitemap and reference it from robots.txt.' },
  ];

  const score = checks.reduce((sum, c) => sum + (c.pass ? c.weight : 0), 0);
  const pct = (score / MAX_AUDIT_SCORE) * 100;

  return { score, maxScore: MAX_AUDIT_SCORE, grade: gradeFor(pct), checks };
}
```

- [ ] **Step 4: Run the test — expect PASS.**

```bash
npx vitest run src/lib/audit.test.ts
```

Expected: PASS — `Test Files 1 passed`, `Tests 9 passed`.

- [ ] **Step 5: Typecheck.**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit.**

```bash
git add src/lib/audit.ts src/lib/audit.test.ts
git commit -m "feat(audit): add pure audit scoring logic with TDD"
```

---

### Task 3.2: Audit API route — `src/app/api/audit/route.ts` (server-proxied, rate-limited)

Server-side fetch of the visitor's URL (proxy = no CORS, hides their IP from the target, lets us rate-limit), extract `AuditSignals` with regex (no DOM parser dep), score with `scoreAudit`. Rate-limited like `/api/contact`. SSRF-guarded (only http/https public hosts).

**Files:**
- Create: `/Users/hodlmedia/forge/src/lib/audit-fetch.ts` (URL normalize + SSRF guard + signal extraction)
- Create: `/Users/hodlmedia/forge/src/app/api/audit/route.ts`
- Create: `/Users/hodlmedia/forge/src/lib/schema.ts` addition is NOT needed (AuditRequestSchema lives in audit-fetch.ts to keep schema.ts content-only) — define here
- Test: `/Users/hodlmedia/forge/src/lib/audit-fetch.test.ts`
- Test: `/Users/hodlmedia/forge/src/app/api/audit/route.test.ts`

- [ ] **Step 1: Write the failing test for the pure extraction + guard helpers.**

```ts
// src/lib/audit-fetch.test.ts
import { describe, it, expect } from 'vitest';
import { normalizeAuditUrl, isBlockedHost, extractSignals } from '@/lib/audit-fetch';

describe('normalizeAuditUrl', () => {
  it('prepends https:// when no scheme is given', () => {
    expect(normalizeAuditUrl('example.com')).toBe('https://example.com/');
  });
  it('keeps an explicit https scheme', () => {
    expect(normalizeAuditUrl('https://example.com/path')).toBe('https://example.com/path');
  });
  it('rejects non-http(s) schemes', () => {
    expect(() => normalizeAuditUrl('ftp://example.com')).toThrow();
    expect(() => normalizeAuditUrl('javascript:alert(1)')).toThrow();
  });
  it('rejects garbage', () => {
    expect(() => normalizeAuditUrl('not a url')).toThrow();
  });
});

describe('isBlockedHost (SSRF guard)', () => {
  it('blocks localhost and loopback', () => {
    expect(isBlockedHost('localhost')).toBe(true);
    expect(isBlockedHost('127.0.0.1')).toBe(true);
  });
  it('blocks private ranges and metadata IP', () => {
    expect(isBlockedHost('10.0.0.1')).toBe(true);
    expect(isBlockedHost('192.168.1.1')).toBe(true);
    expect(isBlockedHost('169.254.169.254')).toBe(true);
  });
  it('allows a normal public host', () => {
    expect(isBlockedHost('openletz.ai')).toBe(false);
  });
});

describe('extractSignals', () => {
  const html = `<!doctype html><html><head>
    <title>A good clear title for the page</title>
    <meta name="viewport" content="width=device-width">
    <meta name="description" content="${'x'.repeat(140)}">
    <meta property="og:title" content="Hi">
    <link rel="canonical" href="https://example.com/">
    <script type="application/ld+json">{"@type":"Organization"}</script>
    </head><body><h1>Only heading</h1><p>Some real visible text content here.</p></body></html>`;

  it('reads title, meta, h1, og, canonical and structured data from raw HTML', () => {
    const s = extractSignals('https://example.com/', html, {
      robotsTxt: true, sitemap: true, llmsTxt: false,
    });
    expect(s.https).toBe(true);
    expect(s.hasTitle).toBe(true);
    expect(s.titleLength).toBeGreaterThan(15);
    expect(s.hasMetaDescription).toBe(true);
    expect(s.h1Count).toBe(1);
    expect(s.hasViewport).toBe(true);
    expect(s.hasOpenGraph).toBe(true);
    expect(s.hasCanonical).toBe(true);
    expect(s.hasStructuredData).toBe(true);
    expect(s.hasRobotsTxt).toBe(true);
    expect(s.hasSitemap).toBe(true);
    expect(s.hasLlmsTxt).toBe(false);
    expect(s.textBytes).toBeGreaterThan(0);
  });

  it('counts multiple h1s', () => {
    const s = extractSignals('http://x.test/', '<h1>a</h1><h1>b</h1>', { robotsTxt: false, sitemap: false, llmsTxt: false });
    expect(s.h1Count).toBe(2);
    expect(s.https).toBe(false);
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

```bash
npx vitest run src/lib/audit-fetch.test.ts
```

Expected: FAIL — `Failed to resolve import "@/lib/audit-fetch"`.

- [ ] **Step 3: Implement `src/lib/audit-fetch.ts`.**

```ts
// src/lib/audit-fetch.ts
import { z } from 'zod';
import type { AuditSignals } from '@/lib/audit';

export const AuditRequestSchema = z.object({
  url: z.string().trim().min(3).max(2000),
});
export type AuditRequest = z.infer<typeof AuditRequestSchema>;

/** Normalize a user-typed URL to an absolute http(s) URL string, or throw. */
export function normalizeAuditUrl(input: string): string {
  let candidate = input.trim();
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  let u: URL;
  try {
    u = new URL(candidate);
  } catch {
    throw new Error('Invalid URL');
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error('Only http(s) URLs are supported');
  }
  if (!u.hostname.includes('.')) {
    throw new Error('Invalid host');
  }
  return u.toString();
}

/** SSRF guard: refuse private / loopback / link-local / metadata hosts. */
export function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local')) return true;
  // IPv6 loopback / unspecified
  if (h === '::1' || h === '::' || h === '[::1]') return true;
  // IPv4 dotted-quad checks
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 127) return true;                 // loopback
    if (a === 10) return true;                   // private
    if (a === 0) return true;                     // this-network
    if (a === 169 && b === 254) return true;      // link-local + cloud metadata
    if (a === 192 && b === 168) return true;      // private
    if (a === 172 && b >= 16 && b <= 31) return true; // private
  }
  return false;
}

const has = (re: RegExp, s: string) => re.test(s);

/** Extract AuditSignals from raw HTML + out-of-band probe results. Pure & DOM-free. */
export function extractSignals(
  finalUrl: string,
  html: string,
  probes: { robotsTxt: boolean; sitemap: boolean; llmsTxt: boolean },
): AuditSignals {
  const head = html.slice(0, 200_000); // cap work
  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';
  const descMatch = head.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i,
  );
  const desc = descMatch ? descMatch[1].trim() : '';
  const h1Count = (head.match(/<h1[\s>]/gi) || []).length;
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    https: finalUrl.startsWith('https://'),
    hasTitle: title.length > 0,
    titleLength: title.length,
    hasMetaDescription: desc.length > 0,
    metaDescriptionLength: desc.length,
    h1Count,
    hasViewport: has(/<meta[^>]+name=["']viewport["']/i, head),
    hasOpenGraph: has(/<meta[^>]+property=["']og:/i, head),
    hasStructuredData: has(/<script[^>]+type=["']application\/ld\+json["']/i, head),
    hasCanonical: has(/<link[^>]+rel=["']canonical["']/i, head),
    hasRobotsTxt: probes.robotsTxt,
    hasSitemap: probes.sitemap,
    hasLlmsTxt: probes.llmsTxt,
    htmlBytes: Buffer.byteLength(html, 'utf8'),
    textBytes: Buffer.byteLength(text, 'utf8'),
  };
}
```

- [ ] **Step 4: Run — expect PASS.**

```bash
npx vitest run src/lib/audit-fetch.test.ts
```

Expected: PASS — `Tests 8 passed` (or more).

- [ ] **Step 5: Write the failing route test.**

```ts
// src/app/api/audit/route.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/audit/route';

function req(body: unknown, ip = '1.2.3.4'): Request {
  return new Request('https://openletz.ai/api/audit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

const PAGE_HTML =
  '<!doctype html><html><head><title>Example Domain title here</title>' +
  '<meta name="description" content="' + 'd'.repeat(120) + '">' +
  '<meta name="viewport" content="width=device-width">' +
  '</head><body><h1>Example</h1><p>Real visible text content body here.</p></body></html>';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.endsWith('/robots.txt')) return new Response('User-agent: *', { status: 200 });
    if (url.endsWith('/sitemap.xml')) return new Response('<urlset/>', { status: 200 });
    if (url.endsWith('/llms.txt')) return new Response('not found', { status: 404 });
    return new Response(PAGE_HTML, { status: 200, headers: { 'content-type': 'text/html' } });
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe('POST /api/audit', () => {
  it('returns 200 with score, grade and checks for a valid URL', async () => {
    const res = await POST(req({ url: 'https://example.com' }, '10.0.0.99'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('grade');
    expect(typeof json.score).toBe('number');
    expect(Array.isArray(json.checks)).toBe(true);
  });

  it('returns 400 for a missing URL', async () => {
    const res = await POST(req({}, '10.0.0.98'));
    expect(res.status).toBe(400);
  });

  it('returns 400 for a blocked SSRF host', async () => {
    const res = await POST(req({ url: 'http://169.254.169.254/latest/meta-data' }, '10.0.0.97'));
    expect(res.status).toBe(400);
  });

  it('rate-limits after 5 requests from one IP', async () => {
    const ip = '10.0.0.42';
    for (let i = 0; i < 5; i++) {
      const ok = await POST(req({ url: 'https://example.com' }, ip));
      expect(ok.status).toBe(200);
    }
    const blocked = await POST(req({ url: 'https://example.com' }, ip));
    expect(blocked.status).toBe(429);
  });
});
```

- [ ] **Step 6: Run — expect FAIL.**

```bash
npx vitest run src/app/api/audit/route.test.ts
```

Expected: FAIL — `Failed to resolve import "@/app/api/audit/route"`.

- [ ] **Step 7: Implement `src/app/api/audit/route.ts`.**

```ts
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
```

- [ ] **Step 8: Run both audit-API tests — expect PASS.**

```bash
npx vitest run src/lib/audit-fetch.test.ts src/app/api/audit/route.test.ts
```

Expected: PASS — all tests green.

- [ ] **Step 9: Typecheck.**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 10: Commit.**

```bash
git add src/lib/audit-fetch.ts src/lib/audit-fetch.test.ts src/app/api/audit/route.ts src/app/api/audit/route.test.ts
git commit -m "feat(api): add server-proxied, rate-limited, SSRF-guarded audit endpoint"
```

---

### Task 3.3: Testimonials data + `Testimonials` component

Data module for `Testimonial[]` (the shape is in Shared Contracts §2) with explicit owner-provided placeholder, plus a server component used in `DeeperProofSection` (Phase 2) and on `/about` / `/services`. May render nothing when empty.

**Files:**
- Create: `/Users/hodlmedia/forge/src/data/testimonials.ts`
- Modify: `/Users/hodlmedia/forge/src/lib/schema.ts` (add `TestimonialSchema`, `TestimonialsSchema`)
- Create: `/Users/hodlmedia/forge/src/components/Testimonials.tsx`
- Test: `/Users/hodlmedia/forge/src/components/Testimonials.test.tsx`

- [ ] **Step 1: Add the Zod schema to `src/lib/schema.ts`.** (Append after the existing data schemas; the `Testimonial` TYPE already exists in §2 of contracts.)

```ts
// --- append to src/lib/schema.ts ---
export const TestimonialSchema = z.object({
  quote: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  photo: z.string().optional(),
});
export const TestimonialsSchema = z.array(TestimonialSchema);
```

- [ ] **Step 2: Create the data module with an explicit owner-provided placeholder.**

```ts
// src/data/testimonials.ts
import type { Testimonial } from '@/lib/schema';
import { TestimonialsSchema } from '@/lib/schema';

// OWNER-PROVIDED: replace these placeholders with real, attributable quotes
// (name + role + company). Until then the array MAY contain placeholder entries
// that are clearly marked; ship with [] if no real quote is approved.
// To go live with zero testimonials, set: const raw: Testimonial[] = [];
const raw: Testimonial[] = [
  {
    quote: 'OWNER-PROVIDED: a real client quote about working with Openletz goes here.',
    name: 'OWNER-PROVIDED: Client name',
    role: 'OWNER-PROVIDED: Role',
    company: 'OWNER-PROVIDED: Company',
    // photo: '/testimonials/owner-provided.jpg', // optional headshot
  },
];

export const TESTIMONIALS: Testimonial[] = TestimonialsSchema.parse(raw);
```

- [ ] **Step 3: Write the failing component test.**

```tsx
// src/components/Testimonials.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Testimonials } from '@/components/Testimonials';
import type { Testimonial } from '@/lib/schema';

const sample: Testimonial[] = [
  { quote: 'They shipped it fast and it works.', name: 'Jane Doe', role: 'Owner', company: 'Vins Fins' },
];

describe('Testimonials', () => {
  it('renders the quote, name, role and company in static markup', () => {
    render(<Testimonials items={sample} />);
    expect(screen.getByText(/They shipped it fast/)).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(/Owner/)).toBeInTheDocument();
    expect(screen.getByText(/Vins Fins/)).toBeInTheDocument();
  });

  it('renders nothing when there are no testimonials', () => {
    const { container } = render(<Testimonials items={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 4: Run — expect FAIL.**

```bash
npx vitest run src/components/Testimonials.test.tsx
```

Expected: FAIL — `Failed to resolve import "@/components/Testimonials"`.

- [ ] **Step 5: Implement the component (Server Component, semantic `<figure>`/`<blockquote>`).**

```tsx
// src/components/Testimonials.tsx
import type { Testimonial } from '@/lib/schema';

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="grid gap-6 md:grid-cols-3" data-testid="testimonials">
      {items.map((t, i) => (
        <li key={`${t.name}-${i}`}>
          <figure className="flex h-full flex-col justify-between rounded-lg border border-hairline bg-surface p-6">
            <blockquote className="text-text">
              <p className="text-balance">&ldquo;{t.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {t.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={t.photo}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : null}
              <span className="text-sm">
                <span className="block font-medium text-text">{t.name}</span>
                <span className="block text-text-dim">
                  {t.role} · {t.company}
                </span>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 6: Run — expect PASS.**

```bash
npx vitest run src/components/Testimonials.test.tsx
```

Expected: PASS — `Tests 2 passed`.

- [ ] **Step 7: Typecheck + verify data parses at module load.**

```bash
npm run typecheck && node -e "require('tsx/cjs'); require('./src/data/testimonials.ts'); console.log('testimonials parse OK')" 2>/dev/null || npm run typecheck
```

Expected: no errors (data parses; placeholder strings satisfy `min(1)`).

- [ ] **Step 8: Commit.**

```bash
git add src/data/testimonials.ts src/lib/schema.ts src/components/Testimonials.tsx src/components/Testimonials.test.tsx
git commit -m "feat(data): add testimonials data model, Zod schema and Testimonials component"
```

---

### Task 3.4: Per-page JSON-LD builders — Service/Offer + FAQPage + BreadcrumbList

Extend `src/lib/jsonld.ts` with the builders Phase 3 pages need. `organizationJsonLd`, `professionalServiceJsonLd`, `webSiteJsonLd`, `breadcrumbJsonLd`, `faqJsonLd` are owned by Phase 1 (contracts §6). Phase 3 ADDS `serviceJsonLd` (per pillar) and `offerCatalogJsonLd` (pricing tiers). All `@id`/`url`/`email` use `openletz.ai` via `site-config.ts`.

**Files:**
- Modify: `/Users/hodlmedia/forge/src/lib/jsonld.ts` (add `serviceJsonLd`, `offerCatalogJsonLd`)
- Test: `/Users/hodlmedia/forge/src/lib/jsonld.offers.test.ts`

- [ ] **Step 1: Write the failing test.**

```ts
// src/lib/jsonld.offers.test.ts
import { describe, it, expect } from 'vitest';
import { serviceJsonLd, offerCatalogJsonLd } from '@/lib/jsonld';
import { SITE_URL } from '@/lib/site-config';
import { SERVICES } from '@/data/services';
import { PRICING } from '@/data/pricing';

describe('serviceJsonLd', () => {
  it('builds a Service node anchored to the org provider on openletz.ai', () => {
    const node = serviceJsonLd('ai', SERVICES.ai) as Record<string, any>;
    expect(node['@type']).toBe('Service');
    expect(node.name).toBe(SERVICES.ai.title);
    expect(node.provider['@id']).toBe(`${SITE_URL}/#organization`);
    expect(node.areaServed).toBeDefined();
  });
});

describe('offerCatalogJsonLd', () => {
  it('builds an OfferCatalog with one Offer per pricing tier', () => {
    const node = offerCatalogJsonLd(PRICING.tiers) as Record<string, any>;
    expect(node['@type']).toBe('OfferCatalog');
    expect(Array.isArray(node.itemListElement)).toBe(true);
    expect(node.itemListElement.length).toBe(PRICING.tiers.length);
    expect(node.itemListElement[0]['@type']).toBe('Offer');
    expect(node.itemListElement[0].priceSpecification.priceCurrency).toBe('EUR');
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

```bash
npx vitest run src/lib/jsonld.offers.test.ts
```

Expected: FAIL — `serviceJsonLd is not a function` / `offerCatalogJsonLd is not a function`.

- [ ] **Step 3: Add the builders to `src/lib/jsonld.ts`.** (Append; reuse the `@id` convention from the Phase 1 builders.)

```ts
// --- append to src/lib/jsonld.ts ---
import { SITE_URL } from '@/lib/site-config';
import type { ServiceKey, ServiceData, PriceTier } from '@/lib/schema';

/** Parse a 'from €1,500' / 'from €X' price string into a numeric minimum, or null. */
function parseFromPrice(price: string): number | null {
  const m = price.replace(/[\s,]/g, '').match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

export function serviceJsonLd(key: ServiceKey, data: ServiceData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/services#${key}`,
    name: data.title,
    serviceType: data.kicker,
    description: data.lead,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'Luxembourg' },
    url: `${SITE_URL}/services`,
  };
}

export function offerCatalogJsonLd(tiers: PriceTier[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${SITE_URL}/pricing#catalog`,
    name: 'Openletz packages',
    url: `${SITE_URL}/pricing`,
    provider: { '@id': `${SITE_URL}/#organization` },
    itemListElement: tiers.map((t) => {
      const min = parseFromPrice(t.price);
      return {
        '@type': 'Offer',
        name: t.name,
        description: t.desc,
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'EUR',
          ...(min !== null ? { minPrice: min, price: min } : {}),
        },
      };
    }),
  };
}
```

- [ ] **Step 4: Run — expect PASS.**

```bash
npx vitest run src/lib/jsonld.offers.test.ts
```

Expected: PASS — `Tests 2 passed`.

- [ ] **Step 5: Typecheck.**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit.**

```bash
git add src/lib/jsonld.ts src/lib/jsonld.offers.test.ts
git commit -m "feat(seo): add Service and OfferCatalog JSON-LD builders for services and pricing"
```

---

### Task 3.5: `/pricing` — productized "from €X" tiers (data update + page)

Replace `'On request'` in `PRICING` with real `'from €X'` placeholders the owner fills, render 4 tiers (3 pillar tiers + custom/care tier) + soft SME Package note + Service/Offer + FAQPage + BreadcrumbList JSON-LD. `PRICING` was ported in Phase 1; the Zod `PriceTierSchema` already requires `price` be a string with no "On request" constraint, so we only update content.

**Files:**
- Modify: `/Users/hodlmedia/forge/src/data/pricing.ts` (swap `'On request'` → `'from €X'` placeholders)
- Modify: `/Users/hodlmedia/forge/src/data/__tests__/data.test.ts` (add assertion: no tier price is `'On request'`)
- Create: `/Users/hodlmedia/forge/src/app/[locale]/pricing/page.tsx`

- [ ] **Step 1: Update `src/data/pricing.ts` to use `from €X` placeholders (NOT "On request").** (Full module; `PriceTierSchema`/`PricingSchema` from Phase 1 parse it at load.)

```ts
// src/data/pricing.ts
import type { IconKey } from '@/lib/schema';
import { PricingSchema } from '@/lib/schema';

export type { IconKey };
export interface PriceTier {
  name: string;
  icon: IconKey;
  price: string;     // 'from €X' placeholder — OWNER fills the real number
  desc: string;
  feats: string[];   // length 3
  highlight?: boolean;
}
export interface Pricing {
  lead: string;
  tiers: PriceTier[];
  note: string;
}

// OWNER-PROVIDED: replace the 'X' in each `price` with the real "from" figure,
// e.g. 'from €2,500'. Keep the 'from €' prefix and the EUR currency. Do NOT use
// 'On request' — published anchors convert better (spec §8).
const raw: Pricing = {
  lead: 'Every project gets a fixed quote up front. Here is the shape of what we do, with a starting point for each.',
  tiers: [
    {
      name: 'AI agents & automation',
      icon: 'ai',
      price: 'from €X', // OWNER-PROVIDED (e.g. 'from €2,500')
      desc: 'Agents, chatbots and automations, audited first.',
      feats: ['Scoped audit first', 'Built and deployed', 'You own it'],
      highlight: true,
    },
    {
      name: 'Website & e-commerce',
      icon: 'growth',
      price: 'from €X', // OWNER-PROVIDED (e.g. 'from €4,500')
      desc: 'Modern sites and shops on Next.js.',
      feats: ['Design + build', 'Multilingual & SEO', 'Stripe / bookings'],
    },
    {
      name: 'Web3 build',
      icon: 'web3',
      price: 'from €X', // OWNER-PROVIDED (e.g. 'from €6,000')
      desc: 'Smart contracts and on-chain apps.',
      feats: ['Scope & architecture', 'Build & testing', 'Launch + support'],
    },
    {
      name: 'Custom & care',
      icon: 'tools',
      price: "let's talk",
      desc: 'Larger builds, retainers, hosting and support.',
      feats: ['Tailored scope', 'Monitoring & backups', 'Direct support'],
    },
  ],
  note: 'Based in Luxembourg, your project may be co-funded through the SME Package — we help with the paperwork.',
};

export const PRICING: Pricing = PricingSchema.parse(raw);
```

- [ ] **Step 2: Add the regression assertion to the ported-data test.** (Add this block inside `src/data/__tests__/data.test.ts`.)

```ts
// --- add inside src/data/__tests__/data.test.ts ---
import { PRICING } from '@/data/pricing';

describe('pricing tiers are productized (no "On request")', () => {
  it('has 4 tiers and none priced "On request"', () => {
    expect(PRICING.tiers).toHaveLength(4);
    for (const tier of PRICING.tiers) {
      expect(tier.price.toLowerCase()).not.toContain('on request');
    }
  });
  it('the three pillar tiers use a "from €" anchor', () => {
    const anchored = PRICING.tiers.filter((t) => t.price.startsWith('from €'));
    expect(anchored.length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 3: Run the data test — expect PASS.**

```bash
npx vitest run src/data/__tests__/data.test.ts
```

Expected: PASS (pricing module rejects "On request"; placeholders use `from €`).

- [ ] **Step 4: Create `src/app/[locale]/pricing/page.tsx`.** (Server Component; `setRequestLocale` + `generateStaticParams` per contracts; JSON-LD from Tasks 3.4 + Phase 1; one CTA verb `START_PROJECT`.)

```tsx
// src/app/[locale]/pricing/page.tsx
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { PRICING } from '@/data/pricing';
import { START_PROJECT } from '@/data/nav';
import { offerCatalogJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Pricing — Openletz',
  description: 'Productized starting prices for AI automation, websites and Web3 builds. Fixed quote up front.',
  alternates: { canonical: localeUrl('en', '/pricing') },
};

const PRICING_FAQS = [
  { q: 'Why do you publish "from" prices?', a: 'So you can self-qualify before we talk. Every project still gets a fixed quote up front.' },
  { q: 'Can my project be co-funded?', a: 'If you are based in Luxembourg, it may be co-funded through the SME Package — we help with the paperwork.' },
];

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Pricing', url: localeUrl(locale, '/pricing') },
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(offerCatalogJsonLd(PRICING.tiers)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(PRICING_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">Pricing</h1>
        <p className="mt-4 text-lg text-text-dim">{PRICING.lead}</p>
      </header>

      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PRICING.tiers.map((tier) => (
          <li
            key={tier.name}
            className={`flex flex-col rounded-lg border p-6 ${
              tier.highlight ? 'border-hot bg-surface' : 'border-hairline bg-surface'
            }`}
          >
            <h2 className="text-lg font-medium text-text">{tier.name}</h2>
            <p className="mt-3 text-2xl font-semibold text-text">{tier.price}</p>
            <p className="mt-2 text-sm text-text-dim">{tier.desc}</p>
            <ul className="mt-6 space-y-2 text-sm text-text-dim">
              {tier.feats.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden className="text-hot">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-text-dim">{PRICING.note}</p>

      <div className="mt-12">
        <a
          href={localeUrl(locale, '/contact')}
          className="inline-flex items-center rounded-md bg-hot px-6 py-3 font-medium text-bg"
        >
          {START_PROJECT}
        </a>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Typecheck.**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Manual verification.**

```bash
PORT=3030 npm run dev
```

Open `http://localhost:3030/pricing` (and `/fr/pricing`, `/de/pricing`). Confirm: 4 tiers render with `from €X` (NOT "On request"), the SME note shows, the "Start a project" CTA links to the enquiry form/contact. Re-open with `prefers-reduced-motion: reduce` ON and confirm content is fully visible. Stop the server.

- [ ] **Step 7: Commit.**

```bash
git add src/data/pricing.ts src/data/__tests__/data.test.ts src/app/[locale]/pricing/page.tsx
git commit -m "feat(pricing): productize tiers with 'from €X' anchors and add /pricing page with Offer JSON-LD"
```

---

### Task 3.6: `/services` — 3 pillars as one studio

Standalone `/services` page: the 3 pillars (`SERVICES.ai`, `SERVICES.marketing`, `SERVICES.web3`) unified, each with its `what`/`how`/`proof`, the SAME single CTA (`START_PROJECT`) on each, per-pillar Service JSON-LD + FAQPage + BreadcrumbList. Order significant: AI (lead) → Growth → Web3.

**Files:**
- Create: `/Users/hodlmedia/forge/src/app/[locale]/services/page.tsx`
- Test: `/Users/hodlmedia/forge/src/app/[locale]/services/page.test.tsx`

- [ ] **Step 1: Write the failing render test.** (Static SSR carries all three pillar titles + a single CTA per pillar.)

```tsx
// src/app/[locale]/services/page.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServicesPage from '@/app/[locale]/services/page';
import { SERVICES } from '@/data/services';
import { START_PROJECT } from '@/data/nav';

describe('ServicesPage', () => {
  it('renders all three pillar titles and one CTA per pillar', async () => {
    const ui = await ServicesPage({ params: Promise.resolve({ locale: 'en' as const }) });
    render(ui);
    expect(screen.getByText(SERVICES.ai.title)).toBeInTheDocument();
    expect(screen.getByText(SERVICES.marketing.title)).toBeInTheDocument();
    expect(screen.getByText(SERVICES.web3.title)).toBeInTheDocument();
    const ctas = screen.getAllByRole('link', { name: START_PROJECT });
    expect(ctas.length).toBeGreaterThanOrEqual(3);
  });

  it('renders the AI pillar before the Web3 pillar (front-door order)', async () => {
    const ui = await ServicesPage({ params: Promise.resolve({ locale: 'en' as const }) });
    render(ui);
    const aiIdx = screen.getByText(SERVICES.ai.title).compareDocumentPosition(
      screen.getByText(SERVICES.web3.title),
    );
    // FOLLOWING bit (4) set => ai precedes web3 in the document
    expect(aiIdx & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

```bash
npx vitest run src/app/[locale]/services/page.test.tsx
```

Expected: FAIL — cannot resolve `@/app/[locale]/services/page`.

- [ ] **Step 3: Implement `src/app/[locale]/services/page.tsx`.**

```tsx
// src/app/[locale]/services/page.tsx
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { SERVICES, type ServiceKey } from '@/data/services';
import { START_PROJECT } from '@/data/nav';
import { serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Services — Openletz',
  description: 'One Luxembourg studio: AI agents & automation, digital & growth, and Web3 when it helps.',
  alternates: { canonical: localeUrl('en', '/services') },
};

// order significant: AI (front door) -> Growth -> Web3
const ORDER: ServiceKey[] = ['ai', 'marketing', 'web3'];

const SERVICES_FAQS = [
  { q: 'Do I have to use all three?', a: 'No. AI is the usual front door; we add growth and Web3 only when they help.' },
  { q: 'Where does my data live?', a: 'In Europe. We choose tools with GDPR and the EU AI Act in mind and can deploy on EU or Aleph-hosted infrastructure.' },
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Services', url: localeUrl(locale, '/services') },
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      {ORDER.map((key) => (
        <script
          key={`ld-${key}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd(key, SERVICES[key])) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(SERVICES_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
          One studio, three ways in.
        </h1>
        <p className="mt-4 text-lg text-text-dim">
          AI agents and automation are the front door. Websites and growth carry it all. Web3 when it helps.
        </p>
      </header>

      <div className="mt-16 space-y-20">
        {ORDER.map((key, i) => {
          const s = SERVICES[key];
          return (
            <section
              key={key}
              id={key}
              aria-labelledby={`${key}-title`}
              className="border-t border-hairline pt-10"
            >
              <p className="font-mono text-sm text-text-dim">
                {String(i + 1).padStart(2, '0')} · {s.kicker}
              </p>
              <h2 id={`${key}-title`} className="mt-2 text-2xl font-semibold text-text md:text-3xl">
                {s.title}
              </h2>
              <p className="mt-3 max-w-2xl text-text-dim">{s.lead}</p>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {s.what.map((w) => (
                  <div key={w.t} className="rounded-lg border border-hairline bg-surface p-5">
                    <h3 className="font-medium text-text">{w.t}</h3>
                    <p className="mt-2 text-sm text-text-dim">{w.d}</p>
                  </div>
                ))}
              </div>

              <ol className="mt-8 flex flex-col gap-2 text-sm text-text-dim md:flex-row md:gap-6">
                {s.how.map((step, n) => (
                  <li key={step} className="flex gap-2">
                    <span aria-hidden className="font-mono text-hot">{n + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <p className="mt-6 max-w-2xl text-sm text-text-dim">{s.proof}</p>
              {s.footer ? <p className="mt-3 max-w-2xl text-sm text-text-dim">{s.footer}</p> : null}

              <div className="mt-8">
                <a
                  href={localeUrl(locale, '/contact')}
                  className="inline-flex items-center rounded-md bg-hot px-6 py-3 font-medium text-bg"
                >
                  {START_PROJECT}
                </a>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run — expect PASS.**

```bash
npx vitest run src/app/[locale]/services/page.test.tsx
```

Expected: PASS — `Tests 2 passed`.

- [ ] **Step 5: Typecheck.**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Manual verification.**

```bash
PORT=3030 npm run dev
```

Open `http://localhost:3030/services` (+ `/fr/services`, `/de/services`). Confirm: three pillars in order AI → Growth → Web3, each with what/how/proof and the SAME "Start a project" CTA reaching the enquiry form. View page source — confirm pillar titles + 3 Service JSON-LD blocks are in the static HTML. Re-test with reduced-motion ON. Stop the server.

- [ ] **Step 7: Commit.**

```bash
git add src/app/[locale]/services/page.tsx src/app/[locale]/services/page.test.tsx
git commit -m "feat(services): add unified /services page with per-pillar Service JSON-LD"
```

---

### Task 3.7: `/audit` lead-magnet page + `AuditForm` client island

The interactive page: a URL input that POSTs to `/api/audit` (Task 3.2), renders the concrete signal checks + grade, then routes to the enquiry form. SSR shell carries the H1 + value copy (AI-crawler requirement); the interactive bit is a `'use client'` leaf island.

**Files:**
- Create: `/Users/hodlmedia/forge/src/components/AuditForm.tsx` (`'use client'`)
- Create: `/Users/hodlmedia/forge/src/app/[locale]/audit/page.tsx`
- Test: `/Users/hodlmedia/forge/src/components/AuditForm.test.tsx`

- [ ] **Step 1: Write the failing client-island test.** (Mocks `fetch`; asserts checks + grade render and the "fix this with us" CTA appears.)

```tsx
// src/components/AuditForm.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuditForm } from '@/components/AuditForm';

const RESULT = {
  url: 'https://example.com/',
  score: 60,
  maxScore: 100,
  grade: 'C',
  checks: [
    { id: 'https', label: 'Served over HTTPS', category: 'security', pass: true, weight: 10, recommendation: 'ok' },
    { id: 'llms-txt', label: 'llms.txt for AI crawlers', category: 'aeo', pass: false, weight: 10, recommendation: 'Publish /llms.txt.' },
  ],
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(RESULT), { status: 200 })));
});
afterEach(() => vi.unstubAllGlobals());

describe('AuditForm', () => {
  it('submits a URL and renders the grade and individual checks', async () => {
    render(<AuditForm enquiryHref="/contact" />);
    fireEvent.change(screen.getByLabelText(/website url/i), { target: { value: 'example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /run the audit/i }));
    await waitFor(() => expect(screen.getByText(/Grade/i)).toBeInTheDocument());
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('Served over HTTPS')).toBeInTheDocument();
    expect(screen.getByText('llms.txt for AI crawlers')).toBeInTheDocument();
    // routes to enquiry
    expect(screen.getByRole('link', { name: /fix this with us/i })).toHaveAttribute('href', '/contact');
  });

  it('shows an error message when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'Could not reach that URL' }), { status: 502 })));
    render(<AuditForm enquiryHref="/contact" />);
    fireEvent.change(screen.getByLabelText(/website url/i), { target: { value: 'example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /run the audit/i }));
    await waitFor(() => expect(screen.getByText(/Could not reach that URL/i)).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

```bash
npx vitest run src/components/AuditForm.test.tsx
```

Expected: FAIL — cannot resolve `@/components/AuditForm`.

- [ ] **Step 3: Implement `src/components/AuditForm.tsx`.**

```tsx
// src/components/AuditForm.tsx
'use client';

import { useState } from 'react';

interface Check {
  id: string;
  label: string;
  category: string;
  pass: boolean;
  weight: number;
  recommendation: string;
}
interface AuditResponse {
  url: string;
  score: number;
  maxScore: number;
  grade: string;
  checks: Check[];
}

export function AuditForm({ enquiryHref }: { enquiryHref: string }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setResult(json as AuditResponse);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="audit-url" className="sr-only">
          Website URL
        </label>
        <input
          id="audit-url"
          name="url"
          type="text"
          inputMode="url"
          required
          placeholder="yourdomain.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-md border border-hairline bg-surface-2 px-4 py-3 text-text placeholder:text-text-dim"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-hot px-6 py-3 font-medium text-bg disabled:opacity-60"
        >
          {loading ? 'Checking…' : 'Run the audit'}
        </button>
      </form>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-text">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-10" data-testid="audit-result">
          <div className="flex items-baseline gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-text-dim">Grade</p>
              <p className="text-5xl font-semibold text-text">{result.grade}</p>
            </div>
            <p className="text-text-dim">
              {result.score} / {result.maxScore}
            </p>
          </div>

          <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
            {result.checks.map((c) => (
              <li key={c.id} className="flex items-start gap-3 py-3">
                <span aria-hidden className={c.pass ? 'text-hot' : 'text-text-dim'}>
                  {c.pass ? '✓' : '✗'}
                </span>
                <span>
                  <span className="block text-text">{c.label}</span>
                  {!c.pass ? (
                    <span className="block text-sm text-text-dim">{c.recommendation}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <a
              href={enquiryHref}
              className="inline-flex items-center rounded-md bg-hot px-6 py-3 font-medium text-bg"
            >
              Fix this with us
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Run — expect PASS.**

```bash
npx vitest run src/components/AuditForm.test.tsx
```

Expected: PASS — `Tests 2 passed`.

- [ ] **Step 5: Implement `src/app/[locale]/audit/page.tsx`.** (SSR shell with H1 + value copy + BreadcrumbList + FAQPage JSON-LD; the client island below the fold.)

```tsx
// src/app/[locale]/audit/page.tsx
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { AuditForm } from '@/components/AuditForm';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Free AI & web readiness audit — Openletz',
  description: 'Check your site against the signals AI assistants and search engines look for. Concrete results in seconds, free.',
  alternates: { canonical: localeUrl('en', '/audit') },
};

const AUDIT_FAQS = [
  { q: 'What does the audit check?', a: 'HTTPS, title and meta tags, headings, structured data, llms.txt, sitemap, and whether your content is in the static HTML AI crawlers read.' },
  { q: 'Is it really free?', a: 'Yes. It runs server-side in a few seconds. If you want help fixing what it finds, that is where we come in.' },
];

export default async function AuditPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Audit', url: localeUrl(locale, '/audit') },
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(AUDIT_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />

      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
          Is your site ready for AI?
        </h1>
        <p className="mt-4 text-lg text-text-dim">
          AI assistants and search engines read your site differently than people do. Run a free
          check against the signals they look for — HTTPS, metadata, structured data, llms.txt, and
          whether your content is in the static HTML at all. You get concrete results in seconds.
        </p>
      </header>

      <div className="mt-10">
        <AuditForm enquiryHref={localeUrl(locale, '/contact')} />
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Typecheck.**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 7: Manual verification.**

```bash
PORT=3030 npm run dev
```

Open `http://localhost:3030/audit`. Type a real public URL (e.g. `vercel.com`), click "Run the audit", confirm: a grade + per-check ✓/✗ list with fix recommendations renders, and "Fix this with us" links to `/contact`. Try `localhost` and confirm the API rejects it (400, error message). View source — confirm the H1 + value copy are in static HTML. Re-test with reduced-motion ON. Stop the server.

- [ ] **Step 8: Commit.**

```bash
git add src/components/AuditForm.tsx src/components/AuditForm.test.tsx src/app/[locale]/audit/page.tsx
git commit -m "feat(audit): add /audit lead-magnet page with interactive readiness check"
```

---

### Task 3.8: Salvage MDX pipeline — trim `src/lib/blog.ts` locale union + remove the 7 grants posts + scaffold 1 agency post

Trim the blog reader's frontmatter locale handling to en/fr/de, delete the 7 grants-era MDX posts, scaffold ONE new agency-positioned post so `/insights` has real content. `getAllPosts`/`getPostBySlug`/`BlogPost` are the salvaged exports the `/insights` routes consume.

**Files:**
- Modify: `/Users/hodlmedia/forge/src/lib/blog.ts` (trim locale union to en/fr/de)
- Delete: `/Users/hodlmedia/forge/content/blog/aide-cybersecurite-pme-luxembourg.mdx`
- Delete: `/Users/hodlmedia/forge/content/blog/aides-luxembourg-2026-annuaire-complet.mdx`
- Delete: `/Users/hodlmedia/forge/content/blog/fit-4-ai-guide-complet.mdx`
- Delete: `/Users/hodlmedia/forge/content/blog/fit-4-digital-vs-fit-4-ai-comparaison.mdx`
- Delete: `/Users/hodlmedia/forge/content/blog/quelle-aide-digitalisation-choisir.mdx`
- Delete: `/Users/hodlmedia/forge/content/blog/sme-package-digital-guide-complet.mdx`
- Delete: `/Users/hodlmedia/forge/content/blog/top-outils-ia-pme-luxembourg.mdx`
- Create: `/Users/hodlmedia/forge/content/blog/ai-agents-luxembourg-businesses.mdx`
- Test: `/Users/hodlmedia/forge/src/lib/blog.test.ts`

- [ ] **Step 1: Delete the 7 grants-era posts.**

```bash
git rm content/blog/aide-cybersecurite-pme-luxembourg.mdx \
       content/blog/aides-luxembourg-2026-annuaire-complet.mdx \
       content/blog/fit-4-ai-guide-complet.mdx \
       content/blog/fit-4-digital-vs-fit-4-ai-comparaison.mdx \
       content/blog/quelle-aide-digitalisation-choisir.mdx \
       content/blog/sme-package-digital-guide-complet.mdx \
       content/blog/top-outils-ia-pme-luxembourg.mdx
```

Expected: `rm 'content/blog/...'` ×7.

- [ ] **Step 2: Create the new agency-positioned post.**

```mdx
---
title:
  en: "AI agents for Luxembourg businesses: where to actually start"
  fr: "Agents IA pour les entreprises luxembourgeoises : par où commencer vraiment"
  de: "KI-Agenten für Luxemburger Unternehmen: Wo man wirklich anfängt"
slug: ai-agents-luxembourg-businesses
date: "2026-06-07"
excerpt:
  en: "Most teams do not need a moonshot. They need one or two repetitive tasks automated well. Here is how we scope an AI agent project so it pays for itself."
  fr: "La plupart des équipes n'ont pas besoin d'un projet pharaonique. Elles ont besoin d'automatiser une ou deux tâches répétitives. Voici comment nous cadrons un projet d'agent IA."
  de: "Die meisten Teams brauchen kein Mondprojekt. Sie brauchen ein oder zwei gut automatisierte Routineaufgaben. So planen wir ein KI-Agenten-Projekt."
metaDescription:
  en: "A practical guide to scoping your first AI agent or automation in Luxembourg: pick the right task, audit first, ship a prototype, measure the hours saved."
  fr: "Guide pratique pour cadrer votre premier agent IA au Luxembourg : choisir la bonne tâche, auditer d'abord, livrer un prototype, mesurer le temps gagné."
  de: "Praktischer Leitfaden für Ihr erstes KI-Agenten-Projekt in Luxemburg: die richtige Aufgabe wählen, zuerst auditieren, einen Prototyp liefern, die gesparte Zeit messen."
keywords: ["AI agents Luxembourg", "AI automation SME", "GDPR AI", "EU AI Act"]
author: "Clément Fermaud"
---

## Start with the task, not the technology

Most Luxembourg teams we talk to do not need a moonshot. They need one or two
repetitive tasks handled well: answering the same support questions, triaging
inbound leads, drafting documents, moving data between tools. The right first
project is small, measurable, and boring in the best way.

## Audit first

Before we build anything, we run a short audit to find the one or two things
worth automating first — the tasks that are frequent, rule-based, and cost real
hours. That keeps the first project low-risk and easy to justify.

## Ship a prototype you can click

We build a working prototype quickly so you can try it on real inputs, then take
it to production once it earns its keep. You should be able to see the hours
saved, not just a demo.

## Keep it European and compliant

We choose tools with GDPR and the EU AI Act in mind, and we can host in Europe so
your data stays where it should. Compliance is a design constraint from day one,
not a checkbox at the end.

## What "done" looks like

Done means it is live, it is yours, and you can measure what it saves. That is
the whole point.
```

- [ ] **Step 3: Trim `src/lib/blog.ts` to the en/fr/de locale union.** (Keep gray-matter; constrain the frontmatter record types to the canonical `Locale`.)

```ts
// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from '@/lib/site-config';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export type LocalizedText = Partial<Record<Locale, string>>;

export interface BlogPost {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  date: string;
  content: string;
  metaDescription?: LocalizedText;
  keywords?: string[];
  image?: string;
  author?: string;
}

function pickLocales(raw: unknown): LocalizedText {
  const out: LocalizedText = {};
  if (raw && typeof raw === 'object') {
    for (const k of ['en', 'fr', 'de'] as const) {
      const v = (raw as Record<string, unknown>)[k];
      if (typeof v === 'string') out[k] = v;
    }
  }
  return out;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);

    return {
      slug: (data.slug as string) || filename.replace('.mdx', ''),
      title: pickLocales(data.title),
      excerpt: pickLocales(data.excerpt),
      date: data.date as string,
      content,
      metaDescription: pickLocales(data.metaDescription),
      keywords: data.keywords as string[] | undefined,
      image: data.image as string | undefined,
      author: data.author as string | undefined,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
```

- [ ] **Step 4: Write the blog-reader test.**

```ts
// src/lib/blog.test.ts
import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

describe('blog reader (post-salvage)', () => {
  it('returns no grants-era posts', () => {
    const slugs = getAllPosts().map((p) => p.slug);
    expect(slugs).not.toContain('fit-4-ai-guide-complet');
    expect(slugs).not.toContain('sme-package-digital-guide-complet');
    expect(slugs).not.toContain('aides-luxembourg-2026-annuaire-complet');
  });

  it('includes the new agency post and exposes en/fr/de title only', () => {
    const post = getPostBySlug('ai-agents-luxembourg-businesses');
    expect(post).not.toBeNull();
    expect(post!.title.en).toMatch(/AI agents/i);
    expect(Object.keys(post!.title).sort()).toEqual(['de', 'en', 'fr']);
  });

  it('drops dropped-locale frontmatter keys (no lb/it/pt)', () => {
    for (const p of getAllPosts()) {
      expect(p.title).not.toHaveProperty('lb');
      expect(p.title).not.toHaveProperty('it');
      expect(p.title).not.toHaveProperty('pt');
    }
  });
});
```

- [ ] **Step 5: Run — expect PASS.**

```bash
npx vitest run src/lib/blog.test.ts
```

Expected: PASS — `Tests 3 passed`.

- [ ] **Step 6: Typecheck.**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 7: Commit.**

```bash
git add src/lib/blog.ts src/lib/blog.test.ts content/blog/
git commit -m "feat(insights): trim blog reader to en/fr/de, drop 7 grants posts, add agency post"
```

---

### Task 3.9: `/insights` listing + `/insights/[slug]` detail with markdown render

The listing (`getAllPosts`) and the reader (`getPostBySlug`, `generateStaticParams`). Since `next-mdx-remote`/`react-markdown`/`remark-gfm` are removed deps (contracts §1 package.json), render the post body with a tiny dependency-free server-side markdown→HTML converter in `src/lib/markdown.ts` (TDD'd). Per-page BreadcrumbList JSON-LD.

**Files:**
- Create: `/Users/hodlmedia/forge/src/lib/markdown.ts`
- Test: `/Users/hodlmedia/forge/src/lib/markdown.test.ts`
- Create: `/Users/hodlmedia/forge/src/app/[locale]/insights/page.tsx`
- Create: `/Users/hodlmedia/forge/src/app/[locale]/insights/[slug]/page.tsx`

- [ ] **Step 1: Write the failing markdown test.**

```ts
// src/lib/markdown.test.ts
import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '@/lib/markdown';

describe('renderMarkdown', () => {
  it('renders headings', () => {
    expect(renderMarkdown('## Start here')).toContain('<h2>Start here</h2>');
  });
  it('renders paragraphs', () => {
    expect(renderMarkdown('Hello world')).toContain('<p>Hello world</p>');
  });
  it('renders bold and inline code', () => {
    const html = renderMarkdown('a **bold** and `code` word');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<code>code</code>');
  });
  it('escapes raw HTML to prevent injection', () => {
    const html = renderMarkdown('hi <script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
  it('renders unordered lists', () => {
    const html = renderMarkdown('- one\n- two');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>one</li>');
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

```bash
npx vitest run src/lib/markdown.test.ts
```

Expected: FAIL — cannot resolve `@/lib/markdown`.

- [ ] **Step 3: Implement `src/lib/markdown.ts` (dependency-free, escapes first).**

```ts
// src/lib/markdown.ts
// Tiny, dependency-free markdown -> HTML for our own MDX post bodies.
// Escapes HTML FIRST so author content cannot inject markup, then applies a
// small, safe subset (headings, bold, inline code, lists, paragraphs).

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(s: string): string {
  return s
    .replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, (_m, c) => `<strong>${c}</strong>`)
    .replace(/\*([^*]+)\*/g, (_m, c) => `<em>${c}</em>`);
}

export function renderMarkdown(md: string): string {
  const lines = escapeHtml(md.replace(/\r\n/g, '\n')).split('\n');
  const out: string[] = [];
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(' ').trim())}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      out.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`);
      list = [];
    }
  };

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);

    if (heading) {
      flushPara();
      flushList();
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
    } else if (bullet) {
      flushPara();
      list.push(bullet[1].trim());
    } else if (line.trim() === '') {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  return out.join('\n');
}
```

- [ ] **Step 4: Run — expect PASS.**

```bash
npx vitest run src/lib/markdown.test.ts
```

Expected: PASS — `Tests 5 passed`.

- [ ] **Step 5: Create the `/insights` listing page.**

```tsx
// src/app/[locale]/insights/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { getAllPosts } from '@/lib/blog';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Insights — Openletz',
  description: 'Notes from a Luxembourg AI studio: AI automation, AEO/GEO, the EU AI Act, and shipping real products.',
  alternates: { canonical: localeUrl('en', '/insights') },
};

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getAllPosts();
  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Insights', url: localeUrl(locale, '/insights') },
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />
      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">Insights</h1>
        <p className="mt-4 text-lg text-text-dim">
          Notes from a Luxembourg AI studio — what we are building, and what we are learning.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-text-dim">New posts are on the way.</p>
      ) : (
        <ul className="mt-12 divide-y divide-hairline border-t border-hairline">
          {posts.map((post) => {
            const title = post.title[locale] ?? post.title.en ?? post.slug;
            const excerpt = post.excerpt[locale] ?? post.excerpt.en ?? '';
            return (
              <li key={post.slug} className="py-8">
                <Link href={localeUrl(locale, `/insights/${post.slug}`)} className="group block">
                  <p className="font-mono text-sm text-text-dim">{post.date}</p>
                  <h2 className="mt-2 text-2xl font-medium text-text group-hover:text-hot">{title}</h2>
                  <p className="mt-2 text-text-dim">{excerpt}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
```

- [ ] **Step 6: Create the `/insights/[slug]` reader page.** (`generateStaticParams` from `getAllPosts`; body via `renderMarkdown`.)

```tsx
// src/app/[locale]/insights/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { LOCALES, type Locale, localeUrl } from '@/lib/site-config';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { renderMarkdown } from '@/lib/markdown';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { safeJsonLd } from '@/lib/safeJsonLd';

export function generateStaticParams() {
  const posts = getAllPosts();
  return LOCALES.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const title = post.title[locale] ?? post.title.en ?? slug;
  const description = post.metaDescription?.[locale] ?? post.excerpt[locale] ?? post.excerpt.en ?? '';
  return {
    title: `${title} — Openletz`,
    description,
    alternates: { canonical: localeUrl('en', `/insights/${slug}`) },
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const title = post.title[locale] ?? post.title.en ?? slug;
  const html = renderMarkdown(post.content);
  const crumbs = breadcrumbJsonLd(locale, [
    { name: 'Home', url: localeUrl(locale) },
    { name: 'Insights', url: localeUrl(locale, '/insights') },
    { name: title, url: localeUrl(locale, `/insights/${slug}`) },
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(crumbs) }}
      />
      <article>
        <header>
          <p className="font-mono text-sm text-text-dim">{post.date}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-text">{title}</h1>
          {post.author ? <p className="mt-3 text-text-dim">By {post.author}</p> : null}
        </header>
        <div
          className="prose prose-invert mt-10 max-w-none text-text [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-text [&_li]:text-text-dim [&_p]:mt-4 [&_p]:text-text-dim [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  );
}
```

- [ ] **Step 7: Typecheck.**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 8: Manual verification.**

```bash
PORT=3030 npm run dev
```

Open `http://localhost:3030/insights` — confirm the agency post lists (date, title, excerpt) and NO grants posts. Click through to `/insights/ai-agents-luxembourg-businesses` — confirm the body renders (headings, paragraphs, list). Try `/fr/insights` and `/de/insights`. View source on the detail page — confirm H1 + body text + BreadcrumbList JSON-LD are in static HTML. Re-test with reduced-motion ON. Stop the server.

- [ ] **Step 9: Commit.**

```bash
git add src/lib/markdown.ts src/lib/markdown.test.ts src/app/[locale]/insights/page.tsx src/app/[locale]/insights/[slug]/page.tsx
git commit -m "feat(insights): add /insights listing and reader with dependency-free markdown render"
```

---

### Task 3.10: View-transition gallery polish — `WorkGallery` client island

Native View-Transition card→detail morph for the work grid (spec §4: "native View-Transition card→case-study morph (native API, not Next's unstable_ViewTransition)"). A `'use client'` island that wraps each card's navigation in `document.startViewTransition` when supported, assigns matching `view-transition-name`s, and degrades to a plain link otherwise. Gated behind `prefers-reduced-motion: no-preference`.

**Files:**
- Create: `/Users/hodlmedia/forge/src/components/ui/WorkGallery.tsx` (`'use client'`)
- Modify: `/Users/hodlmedia/forge/src/styles/tokens.css` (append view-transition group rules, gated)
- Test: `/Users/hodlmedia/forge/src/components/ui/WorkGallery.test.tsx`

- [ ] **Step 1: Write the failing test.** (Renders cards as links; clicking with `startViewTransition` present calls it; falls back to navigation when absent. RTL with mocked router push.)

```tsx
// src/components/ui/WorkGallery.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkGallery } from '@/components/ui/WorkGallery';
import type { WorkItem } from '@/lib/schema';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const items: WorkItem[] = [
  { slug: 'vinsfins', name: 'Vins Fins', kind: 'E-commerce', link: 'https://www.vinsfins.lu',
    blurb: 'A wine shop', about: 'about', did: [], stack: [], tag: 'web' },
  { slug: 'ophis', name: 'Ophis', kind: 'Web3 / DeFi', link: 'https://ophis.fi',
    blurb: 'DEX aggregator', about: 'about', did: [], stack: [], tag: 'web3' },
];

beforeEach(() => push.mockReset());
afterEach(() => { delete (document as any).startViewTransition; });

describe('WorkGallery', () => {
  it('renders one card per work item with its name and a unique view-transition-name', () => {
    render(<WorkGallery items={items} basePath="/work" />);
    expect(screen.getByText('Vins Fins')).toBeInTheDocument();
    expect(screen.getByText('Ophis')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Vins Fins/ });
    expect(link.style.viewTransitionName).toBe('work-vinsfins');
  });

  it('uses document.startViewTransition when available', () => {
    const stub = vi.fn((cb: () => void) => { cb(); return { finished: Promise.resolve() }; });
    (document as any).startViewTransition = stub;
    render(<WorkGallery items={items} basePath="/work" />);
    fireEvent.click(screen.getByRole('link', { name: /Vins Fins/ }));
    expect(stub).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/work/vinsfins');
  });

  it('falls back to plain navigation when startViewTransition is unavailable', () => {
    render(<WorkGallery items={items} basePath="/work" />);
    fireEvent.click(screen.getByRole('link', { name: /Ophis/ }));
    expect(push).toHaveBeenCalledWith('/work/ophis');
  });
});
```

- [ ] **Step 2: Run — expect FAIL.**

```bash
npx vitest run src/components/ui/WorkGallery.test.tsx
```

Expected: FAIL — cannot resolve `@/components/ui/WorkGallery`.

- [ ] **Step 3: Implement `src/components/ui/WorkGallery.tsx`.**

```tsx
// src/components/ui/WorkGallery.tsx
'use client';

import { useRouter } from 'next/navigation';
import type { WorkItem } from '@/lib/schema';

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export function WorkGallery({ items, basePath }: { items: WorkItem[]; basePath: string }) {
  const router = useRouter();

  function go(e: React.MouseEvent, slug: string) {
    e.preventDefault();
    const href = `${basePath}/${slug}`;
    const doc = document as ViewTransitionDoc;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (doc.startViewTransition && !reduce) {
      doc.startViewTransition(() => router.push(href));
    } else {
      router.push(href);
    }
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="work-gallery">
      {items.map((item) => (
        <li key={item.slug}>
          <a
            href={`${basePath}/${item.slug}`}
            onClick={(e) => go(e, item.slug)}
            style={{ viewTransitionName: `work-${item.slug}` }}
            className="block h-full rounded-lg border border-hairline bg-surface p-6 transition-colors hover:border-hot"
          >
            <p className="font-mono text-sm text-text-dim">{item.kind}</p>
            <h3 className="mt-2 text-xl font-medium text-text">{item.name}</h3>
            <p className="mt-2 text-sm text-text-dim">{item.blurb}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: Run — expect PASS.**

```bash
npx vitest run src/components/ui/WorkGallery.test.tsx
```

Expected: PASS — `Tests 3 passed`.

- [ ] **Step 5: Append the gated view-transition CSS to `src/styles/tokens.css`.** (Reuses the motion tokens from contracts §7; gated behind `no-preference`.)

```css
/* --- append to src/styles/tokens.css: view-transition polish --- */
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: var(--dur-base);
    animation-timing-function: var(--ease-out);
  }
  ::view-transition-group(*) {
    animation-duration: var(--dur-base);
    animation-timing-function: var(--ease-out);
  }
}
```

- [ ] **Step 6: Typecheck.**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 7: Manual verification.**

```bash
PORT=3030 npm run dev
```

Open `http://localhost:3030/work` (assuming the Phase 2 `/work` page mounts `WorkGallery`; if it currently renders a static grid, swap its grid for `<WorkGallery items={WORK} basePath="/work" />`). Click a card and confirm a smooth card→detail morph in a Chromium browser; in Firefox/Safari (no view-transition) confirm it still navigates. Toggle `prefers-reduced-motion: reduce` and confirm navigation happens with no morph. Stop the server.

- [ ] **Step 8: Commit.**

```bash
git add src/components/ui/WorkGallery.tsx src/components/ui/WorkGallery.test.tsx src/styles/tokens.css
git commit -m "feat(ui): add view-transition WorkGallery card→detail morph with reduced-motion fallback"
```

---

### Task 3.11: Wire Phase 3 routes into sitemap + nav

Add `/services`, `/pricing`, `/audit`, `/insights` (+ per-post `/insights/[slug]`) to the sitemap (`src/app/sitemap.ts`, built in Phase 2 from `site-config.ts`) and surface the new entries in the footer columns (`src/data/nav.ts`, the `FOOTER` model from Phase 1). Run the full unit suite to confirm Phase 3 is green end-to-end.

**Files:**
- Modify: `/Users/hodlmedia/forge/src/app/sitemap.ts` (add Phase 3 routes + insights posts)
- Modify: `/Users/hodlmedia/forge/src/data/nav.ts` (ensure footer Services/Company columns include the new routes)
- Test: `/Users/hodlmedia/forge/src/app/sitemap.test.ts`

- [ ] **Step 1: Write the failing sitemap test.** (Asserts the new routes + the agency post appear, across the 3 locales.)

```ts
// src/app/sitemap.test.ts
import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import { SITE_URL } from '@/lib/site-config';

describe('sitemap includes Phase 3 routes', () => {
  const urls = sitemap().map((e) => e.url);

  it('lists the new static routes on the apex (EN)', () => {
    expect(urls).toContain(`${SITE_URL}/services`);
    expect(urls).toContain(`${SITE_URL}/pricing`);
    expect(urls).toContain(`${SITE_URL}/audit`);
    expect(urls).toContain(`${SITE_URL}/insights`);
  });

  it('lists FR and DE variants of /services', () => {
    expect(urls).toContain(`${SITE_URL}/fr/services`);
    expect(urls).toContain(`${SITE_URL}/de/services`);
  });

  it('lists the agency insights post', () => {
    expect(urls).toContain(`${SITE_URL}/insights/ai-agents-luxembourg-businesses`);
  });

  it('never references a dropped domain or locale', () => {
    for (const u of urls) {
      expect(u.startsWith(SITE_URL)).toBe(true);
      expect(u).not.toContain('openletz.com');
      expect(u).not.toMatch(/\/(it|es|ru|ar|tr|uk|pt|lb)\//);
    }
  });
});
```

- [ ] **Step 2: Run — expect FAIL.** (The Phase 2 sitemap does not yet include `/services`, `/pricing`, `/audit`, `/insights`, or posts.)

```bash
npx vitest run src/app/sitemap.test.ts
```

Expected: FAIL — `expected [...] to contain 'https://openletz.ai/services'`.

- [ ] **Step 3: Update `src/app/sitemap.ts` to include Phase 3 routes + insights posts.** (Full module; builds every URL from `localeUrl`, adds dynamic post slugs from `getAllPosts`.)

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { LOCALES, localeUrl } from '@/lib/site-config';
import { getAllPosts } from '@/lib/blog';

// Static routes (paths relative to a locale root). '' = the locale home.
const STATIC_PATHS = [
  '',
  '/services',
  '/work',
  '/about',
  '/pricing',
  '/audit',
  '/insights',
  '/contact',
  '/legal/privacy',
  '/legal/terms',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: localeUrl(locale, path),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: path === '' ? 1 : 0.7,
      });
    }
  }

  // Dynamic insights posts (EN canonical + FR/DE variants).
  for (const post of getAllPosts()) {
    for (const locale of LOCALES) {
      entries.push({
        url: localeUrl(locale, `/insights/${post.slug}`),
        lastModified: post.date ? new Date(post.date) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
```

- [ ] **Step 4: Run — expect PASS.**

```bash
npx vitest run src/app/sitemap.test.ts
```

Expected: PASS — `Tests 4 passed`.

- [ ] **Step 5: Ensure the footer surfaces the new routes in `src/data/nav.ts`.** (Update ONLY the `FOOTER` column links; keep the `NAV` 5-item model and `START_PROJECT` from Phase 1. If a column already exists, edit its `links` array to match exactly.)

```ts
// --- in src/data/nav.ts: the FOOTER columns must include these links ---
// Column "Services" -> /services, /pricing, /audit
// Column "Company"  -> /about, /work, /insights
// Column "Legal"    -> /legal/privacy, /legal/terms
//
// Replace the FOOTER export's column link arrays with:
//   { heading: 'Services', links: [
//       { label: 'Services', href: '/services' },
//       { label: 'Pricing',  href: '/pricing'  },
//       { label: 'Audit',    href: '/audit'    },
//   ]},
//   { heading: 'Company', links: [
//       { label: 'About',    href: '/about'    },
//       { label: 'Work',     href: '/work'     },
//       { label: 'Insights', href: '/insights' },
//   ]},
//   { heading: 'Connect', links: [
//       { label: 'LinkedIn', href: 'https://www.linkedin.com/company/commit-media' },
//   ]},
//   { heading: 'Legal', links: [
//       { label: 'Privacy', href: '/legal/privacy' },
//       { label: 'Terms',   href: '/legal/terms'   },
//   ]},
```

Apply the edit so the `FOOTER` constant's four columns read exactly as above (4 columns: Services, Company, Connect, Legal), keeping the existing `FooterColumn` shape from contracts §2.

- [ ] **Step 6: Add a footer-coverage assertion (extend the existing nav/data test, or create one).**

```ts
// src/data/nav.test.ts (create if absent)
import { describe, it, expect } from 'vitest';
import { FOOTER } from '@/data/nav';

describe('footer surfaces Phase 3 routes', () => {
  const hrefs = FOOTER.flatMap((c) => c.links.map((l) => l.href));
  it('includes /services, /pricing, /audit and /insights', () => {
    for (const href of ['/services', '/pricing', '/audit', '/insights']) {
      expect(hrefs).toContain(href);
    }
  });
  it('has exactly 4 columns', () => {
    expect(FOOTER).toHaveLength(4);
  });
});
```

- [ ] **Step 7: Run the nav test + full unit suite — expect PASS.**

```bash
npx vitest run src/data/nav.test.ts && npm run test
```

Expected: PASS — every test file green (`Test Files N passed`).

- [ ] **Step 8: Typecheck.**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 9: Commit.**

```bash
git add src/app/sitemap.ts src/app/sitemap.test.ts src/data/nav.ts src/data/nav.test.ts
git commit -m "feat(seo): add Phase 3 routes and insights posts to sitemap and footer nav"
```


---

## Phase 4 — Verify & launch

### Task 4.1: Add @next/bundle-analyzer + a Core-Web-Vitals budget check

Wire the bundle analyzer into `next.config.mjs` (opt-in via `ANALYZE=true`, so it never affects normal builds) and add a standalone CWV budget guard script + `npm` scripts. The budget script asserts the production server JS for the home route stays under a byte budget so a regression that would blow LCP/INP fails CI loudly, independent of Lighthouse.

**Files:**
- Modify: `/Users/hodlmedia/forge/next.config.mjs`
- Modify: `/Users/hodlmedia/forge/package.json`
- Create: `/Users/hodlmedia/forge/scripts/cwv-budget.mjs`
- Create: `/Users/hodlmedia/forge/scripts/cwv-budget.test.mjs` (Vitest-run unit test for the pure budget evaluator)

- [ ] **Step 1: Install the analyzer dev dependency.**
```bash
cd /Users/hodlmedia/forge && npm install --save-dev @next/bundle-analyzer
```
Expected output: npm reports `added 1 package` (plus its transitive deps) and `@next/bundle-analyzer` now appears under `devDependencies` in `package.json`.

- [ ] **Step 2: Write the failing unit test for the pure budget evaluator (TDD).**
Create `/Users/hodlmedia/forge/scripts/cwv-budget.test.mjs`:
```js
import { describe, it, expect } from 'vitest';
import { evaluateBudget, FIRST_LOAD_JS_BUDGET_KB } from './cwv-budget.mjs';

describe('cwv-budget evaluateBudget', () => {
  it('passes when first-load JS is under budget', () => {
    const result = evaluateBudget([
      { route: '/[locale]', firstLoadKb: 120 },
      { route: '/[locale]/work', firstLoadKb: 130 },
    ]);
    expect(result.ok).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('fails when any route exceeds the budget', () => {
    const result = evaluateBudget([
      { route: '/[locale]', firstLoadKb: FIRST_LOAD_JS_BUDGET_KB + 1 },
    ]);
    expect(result.ok).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].route).toBe('/[locale]');
  });

  it('exposes a defensible budget (<= 180 KB first-load JS)', () => {
    expect(FIRST_LOAD_JS_BUDGET_KB).toBeLessThanOrEqual(180);
    expect(FIRST_LOAD_JS_BUDGET_KB).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run the test and confirm it FAILS (module does not exist yet).**
```bash
cd /Users/hodlmedia/forge && npx vitest run scripts/cwv-budget.test.mjs
```
Expected: FAIL — Vitest reports `Failed to load url ./cwv-budget.mjs` / `Cannot find module`. (The implementation does not exist yet; this is the red step.)

- [ ] **Step 4: Implement the budget script.**
Create `/Users/hodlmedia/forge/scripts/cwv-budget.mjs`:
```js
#!/usr/bin/env node
/**
 * Core Web Vitals byte-budget guard.
 *
 * Pure evaluator (`evaluateBudget`) is unit-tested. The CLI half parses the
 * Next.js build manifest produced by `next build` and asserts the first-load
 * JS for every app route is under FIRST_LOAD_JS_BUDGET_KB. A regression that
 * would blow LCP/INP fails the build before it ships.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Defensible budget: 180 KB gzipped-equivalent first-load JS keeps LCP < 2.0s
// and INP < 200ms on a mid-tier device over 4G (Editorial-Engineering target).
export const FIRST_LOAD_JS_BUDGET_KB = 180;

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

/**
 * Reads `.next/app-build-manifest.json` + `.next/build-manifest.json` and
 * estimates first-load JS per app route from the referenced chunk byte sizes.
 * @returns {{ route: string, firstLoadKb: number }[]}
 */
function readRoutesFromBuild() {
  const dir = join(process.cwd(), '.next');
  const appManifestPath = join(dir, 'app-build-manifest.json');
  if (!existsSync(appManifestPath)) {
    throw new Error('No .next/app-build-manifest.json — run `npm run build` first.');
  }
  const appManifest = JSON.parse(readFileSync(appManifestPath, 'utf8'));
  const pages = appManifest.pages || {};
  const { statSync } = require('node:fs'); // eslint-disable-line
  const out = [];
  for (const [route, files] of Object.entries(pages)) {
    let bytes = 0;
    for (const f of files) {
      if (!f.endsWith('.js')) continue;
      const p = join(dir, f);
      if (existsSync(p)) bytes += statSync(p).size;
    }
    out.push({ route, firstLoadKb: Math.round(bytes / 1024) });
  }
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
```

- [ ] **Step 5: Run the unit test again and confirm it PASSES.**
```bash
cd /Users/hodlmedia/forge && npx vitest run scripts/cwv-budget.test.mjs
```
Expected: PASS — `Test Files  1 passed (1)`, `Tests  3 passed (3)`.

- [ ] **Step 6: Wire the analyzer into `next.config.mjs`.**
Wrap the existing exported config. Open `/Users/hodlmedia/forge/next.config.mjs` and replace its import header + final export. Add this import at the very top (above `createNextIntlPlugin`):
```js
import bundleAnalyzer from '@next/bundle-analyzer';
```
Then add the analyzer wrapper just below the `withNextIntl` line:
```js
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
```
Finally change the module's export (currently `export default withNextIntl(nextConfig);`) to compose both wrappers:
```js
export default withBundleAnalyzer(withNextIntl(nextConfig));
```
(Leave `headers()`, `rewrites()`, `redirects()`, `cacheComponents` untouched — only the import line, the new wrapper const, and the final `export default` change.)

- [ ] **Step 7: Add the analyzer + budget scripts to `package.json`.**
In the `"scripts"` block of `/Users/hodlmedia/forge/package.json`, add:
```json
"analyze": "ANALYZE=true next build",
"cwv:budget": "node scripts/cwv-budget.mjs"
```

- [ ] **Step 8: Build, then run the budget guard against the real manifest.**
```bash
cd /Users/hodlmedia/forge && npm run build && npm run cwv:budget
```
Expected: `next build` completes; `cwv:budget` prints one `ok    NNN KB  <route>` line per app route and ends with `cwv-budget: all routes within 180 KB budget.` (exit 0). If a route prints `OVER`, the offending route is over budget and the command exits 1 — that is the guard working.

- [ ] **Step 9: Typecheck.**
```bash
cd /Users/hodlmedia/forge && npm run typecheck
```
Expected: no output, exit 0.

- [ ] **Step 10: Commit.**
```bash
cd /Users/hodlmedia/forge && git add next.config.mjs package.json package-lock.json scripts/cwv-budget.mjs scripts/cwv-budget.test.mjs && git commit -m "build(config): add bundle-analyzer and CWV first-load JS budget guard"
```
Expected: one commit created; no `Co-Authored-By` / AI attribution in the message.

---

### Task 4.2: Playwright CWV-budget + SSR-content (AI-crawler) test on home, work, contact

One E2E spec that, for `/`, `/work`, and `/contact`: (a) measures LCP via PerformanceObserver and asserts `< 2.0s`, asserts CLS `< 0.1`; (b) fetches the RAW SSR HTML with **JavaScript disabled** and asserts the H1 + primary copy strings are present in the served markup (the AI-crawler / no-JS requirement from the spec). Strings come VERBATIM from the contracts (`HeroSectionProps.h1`, `STUDIO.welcomeLead`, `START_PROJECT`, `CONTACT.lead`).

**Files:**
- Create: `/Users/hodlmedia/forge/e2e/cwv-ssr.spec.ts`
- Test: `/Users/hodlmedia/forge/e2e/cwv-ssr.spec.ts`

- [ ] **Step 1: Write the spec.**
Create `/Users/hodlmedia/forge/e2e/cwv-ssr.spec.ts`:
```ts
import { test, expect, request } from '@playwright/test';
import { STUDIO } from '@/data/studio';
import { CONTACT } from '@/data/contact';
import { START_PROJECT } from '@/data/nav';
import { HOME_SECTIONS } from '@/data/pages/home';
import type { HeroSectionProps } from '@/lib/schema';

// Pull the canonical hero H1 from the homepage Section[] (single source of truth).
const HERO = HOME_SECTIONS.find((s) => s.type === 'hero') as HeroSectionProps;

// CWV budgets (spec §1 success criteria).
const LCP_BUDGET_MS = 2000;
const CLS_BUDGET = 0.1;

type CwvPage = { path: string; ssrMustContain: string[] };

const PAGES: CwvPage[] = [
  { path: '/', ssrMustContain: [HERO.h1, STUDIO.welcomeLead, START_PROJECT] },
  { path: '/work', ssrMustContain: [START_PROJECT] },
  { path: '/contact', ssrMustContain: [CONTACT.lead, START_PROJECT] },
];

test.describe('Core Web Vitals budget', () => {
  for (const { path } of PAGES) {
    test(`LCP < ${LCP_BUDGET_MS}ms and CLS < ${CLS_BUDGET} on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'load' });

      // Largest Contentful Paint — last reported entry before load settles.
      const lcp = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let last = 0;
            new PerformanceObserver((list) => {
              for (const e of list.getEntries()) last = (e as PerformanceEntry & { startTime: number }).startTime;
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            // give late LCP candidates a beat, then resolve.
            setTimeout(() => resolve(last), 600);
          }),
      );
      expect(lcp, `LCP on ${path}`).toBeLessThan(LCP_BUDGET_MS);

      // Cumulative Layout Shift — sum of non-input shifts.
      const cls = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let total = 0;
            new PerformanceObserver((list) => {
              for (const e of list.getEntries()) {
                const ls = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
                if (!ls.hadRecentInput) total += ls.value;
              }
            }).observe({ type: 'layout-shift', buffered: true });
            setTimeout(() => resolve(total), 600);
          }),
      );
      expect(cls, `CLS on ${path}`).toBeLessThan(CLS_BUDGET);
    });
  }
});

test.describe('SSR / AI-crawler content (JavaScript disabled)', () => {
  for (const { path, ssrMustContain } of PAGES) {
    test(`raw SSR HTML for ${path} carries H1 + primary copy`, async ({ baseURL }) => {
      // Fetch the server-rendered HTML directly — no browser, no JS execution.
      const ctx = await request.newContext({ baseURL });
      const res = await ctx.get(path);
      expect(res.status(), `status for ${path}`).toBe(200);
      const html = await res.text();
      for (const needle of ssrMustContain) {
        expect(html, `SSR HTML for ${path} must contain "${needle}"`).toContain(needle);
      }
      // The LCP H1 must NOT be hidden at opacity:0 in the static markup.
      expect(html, `SSR HTML for ${path} must not pre-hide content`).not.toMatch(/opacity:\s*0[^.\d]/);
      await ctx.dispose();
    });
  }
});
```

- [ ] **Step 2: Run the spec against the dev server.**
```bash
cd /Users/hodlmedia/forge && npx playwright test e2e/cwv-ssr.spec.ts
```
Expected: Playwright boots the `webServer` (`PORT=3030 npm run dev` from `playwright.config.ts`), then `6 passed` (3 CWV + 3 SSR). If an SSR assertion fails it means the H1/primary copy is not in the server markup — fix the offending section to render its copy in the Server Component, not a client island, then re-run.

- [ ] **Step 3: Confirm the H1 is present in production-built HTML too (not just dev).**
```bash
cd /Users/hodlmedia/forge && npm run build && (PORT=3030 npm run start &) && sleep 4 && curl -s http://localhost:3030/ | grep -c "Websites that think" ; pkill -f "next start"
```
Expected: `curl | grep -c` prints `1` or more (the exact H1 string appears in the statically rendered HTML). Then the `next start` process is killed.

- [ ] **Step 4: Commit.**
```bash
cd /Users/hodlmedia/forge && git add e2e/cwv-ssr.spec.ts && git commit -m "test(seo): assert LCP/CLS budget and SSR H1/primary copy on home, work, contact"
```
Expected: one commit, no AI attribution.

---

### Task 4.3: prefers-reduced-motion Playwright pass across the spine

Run the full homepage + key routes under `prefers-reduced-motion: reduce` and assert "reduced ≠ stripped": content (H1, CTA, work cards) is visible and the LCP node is at full opacity, while no transform-based reveal is left mid-animation. This is the pre-launch reduced-motion check the spec mandates (§4 "Test with reduce ON before launch"). It complements — does not replace — the contracts' `/Users/hodlmedia/forge/e2e/reduced-motion.spec.ts`; this one adds the cross-route launch sweep.

**Files:**
- Create: `/Users/hodlmedia/forge/e2e/reduced-motion-launch.spec.ts`
- Test: `/Users/hodlmedia/forge/e2e/reduced-motion-launch.spec.ts`

- [ ] **Step 1: Write the spec.**
Create `/Users/hodlmedia/forge/e2e/reduced-motion-launch.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import { STUDIO } from '@/data/studio';
import { START_PROJECT } from '@/data/nav';
import { HOME_SECTIONS } from '@/data/pages/home';
import type { HeroSectionProps } from '@/lib/schema';

const HERO = HOME_SECTIONS.find((s) => s.type === 'hero') as HeroSectionProps;

// Emulate reduced-motion for every test in this file.
test.use({ reducedMotion: 'reduce' });

const ROUTES = ['/', '/work', '/about', '/contact'];

test.describe('prefers-reduced-motion: reduce — content visible, no spectacle', () => {
  test('home hero H1 + lead + CTA are visible and fully opaque', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });

    const h1 = page.getByRole('heading', { level: 1, name: HERO.h1 });
    await expect(h1).toBeVisible();
    // LCP node must be at full opacity even with motion reduced.
    const h1Opacity = await h1.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(h1Opacity)).toBe(1);

    await expect(page.getByText(STUDIO.welcomeLead, { exact: false })).toBeVisible();
    await expect(page.getByRole('link', { name: START_PROJECT }).first()).toBeVisible();
  });

  test('reduce maps motion durations to ~0 (global kill-switch active)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    // tokens.css global rule sets transition-duration: 0.01ms !important under reduce.
    const dur = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.transition = 'opacity var(--dur-base) var(--ease-out)';
      document.body.appendChild(probe);
      const d = getComputedStyle(probe).transitionDuration;
      probe.remove();
      return d;
    });
    // Either the kill-switch flattened it (~0s) or it never animated. Accept both.
    expect(['0s', '0.01ms', '1e-05s']).toContain(dur);
  });

  for (const route of ROUTES) {
    test(`every section on ${route} is reachable (no element stuck at opacity:0)`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'load' });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      // No reveal element should remain invisible after scroll under reduced-motion.
      const stuck = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('[data-reveal]'));
        return els.filter((el) => Number(getComputedStyle(el as HTMLElement).opacity) < 0.99).length;
      });
      expect(stuck, `${route} has reveal elements stuck below full opacity under reduced-motion`).toBe(0);
    });
  }
});
```
(Note: the `Reveal` client island — `/Users/hodlmedia/forge/src/components/ui/Reveal.tsx` — must mark its wrapper with `data-reveal` so this sweep can find reveal targets. If it does not, add the attribute there in this task and re-run.)

- [ ] **Step 2: Run the reduced-motion spec.**
```bash
cd /Users/hodlmedia/forge && npx playwright test e2e/reduced-motion-launch.spec.ts
```
Expected: `6 passed` (2 home + 4 route sweeps). A failure on the "stuck at opacity:0" assertion means a reveal is not honoring `prefers-reduced-motion` — fix `Reveal.tsx`/`tokens.css` so reduced keeps fades but lands at `opacity:1`.

- [ ] **Step 3: Manual reduced-motion verification.**
```bash
cd /Users/hodlmedia/forge && PORT=3030 npm run dev
```
Then: in the browser DevTools open Rendering and set **Emulate CSS prefers-reduced-motion: reduce**, load `http://localhost:3030/`, and scroll the full page. Confirm: the H1 is visible on first paint, no element fades in from blank, the magnetic CTA does not follow the cursor, and all sections are readable. Stop the dev server with Ctrl-C when done.

- [ ] **Step 4: Commit.**
```bash
cd /Users/hodlmedia/forge && git add e2e/reduced-motion-launch.spec.ts src/components/ui/Reveal.tsx && git commit -m "test(ui): cross-route prefers-reduced-motion launch sweep, content visible no spectacle"
```
Expected: one commit, no AI attribution. (If `Reveal.tsx` was not touched, omit it from `git add`.)

---

### Task 4.4: Schema-presence test + Google Rich Results validation for every JSON-LD block

An automated Playwright test that loads each page, extracts every `<script type="application/ld+json">` from the SSR HTML, JSON-parses it, and asserts the expected `@type` set is present per route and that every `@id`/`url`/`email` uses `openletz.ai` (catches a stray legacy domain). Plus the manual Google Rich Results Test steps for each schema. Schema builders are the contracts' `jsonld.ts` functions.

**Files:**
- Create: `/Users/hodlmedia/forge/e2e/jsonld-presence.spec.ts`
- Test: `/Users/hodlmedia/forge/e2e/jsonld-presence.spec.ts`

- [ ] **Step 1: Write the schema-presence spec.**
Create `/Users/hodlmedia/forge/e2e/jsonld-presence.spec.ts`:
```ts
import { test, expect, request } from '@playwright/test';
import { SITE_URL } from '@/lib/site-config';

// Extract all JSON-LD payloads from raw SSR HTML.
function extractJsonLd(html: string): any[] {
  const blocks: any[] = [];
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw) continue;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) blocks.push(...parsed);
    else if (parsed['@graph']) blocks.push(...parsed['@graph']);
    else blocks.push(parsed);
  }
  return blocks;
}

function typesOf(blocks: any[]): Set<string> {
  const out = new Set<string>();
  for (const b of blocks) {
    const t = b['@type'];
    if (Array.isArray(t)) t.forEach((x) => out.add(x));
    else if (t) out.add(t);
  }
  return out;
}

// Recursively collect every string value under url/@id/email keys.
function collectUrlsAndEmails(node: any, acc: string[] = []): string[] {
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if ((k === 'url' || k === '@id' || k === 'email') && typeof v === 'string') acc.push(v);
      else if (typeof v === 'object') collectUrlsAndEmails(v, acc);
    }
  }
  return acc;
}

// Expected @type per route (from jsonld.ts builders wired into layouts).
const ROUTE_SCHEMAS: { path: string; expect: string[] }[] = [
  { path: '/', expect: ['Organization', 'ProfessionalService', 'WebSite'] },
  { path: '/about', expect: ['Organization', 'BreadcrumbList'] },
  { path: '/contact', expect: ['Organization', 'BreadcrumbList'] },
  { path: '/services', expect: ['Organization', 'FAQPage', 'BreadcrumbList'] },
  { path: '/pricing', expect: ['Organization', 'BreadcrumbList'] },
  { path: '/work', expect: ['Organization', 'BreadcrumbList'] },
];

test.describe('JSON-LD presence + canonical domain', () => {
  for (const { path, expect: wanted } of ROUTE_SCHEMAS) {
    test(`${path} emits ${wanted.join(', ')} and uses openletz.ai everywhere`, async ({ baseURL }) => {
      const ctx = await request.newContext({ baseURL });
      const res = await ctx.get(path);
      expect(res.status()).toBe(200);
      const html = await res.text();
      const blocks = extractJsonLd(html);
      expect(blocks.length, `${path} has at least one JSON-LD block`).toBeGreaterThan(0);

      const present = typesOf(blocks);
      for (const t of wanted) {
        expect(present.has(t), `${path} must emit @type ${t}`).toBe(true);
      }

      // No dropped grants-era schema should ever appear.
      expect(present.has('WebApplication'), `${path} must NOT emit dropped WebApplication`).toBe(false);
      expect(present.has('HowTo'), `${path} must NOT emit dropped HowTo`).toBe(false);

      // Every url/@id/email must be on the canonical apex (no www, no .com/.fr/.info).
      const refs = blocks.flatMap((b) => collectUrlsAndEmails(b));
      for (const ref of refs) {
        if (ref.startsWith('http')) {
          expect(ref.startsWith(SITE_URL), `${path}: "${ref}" must start with ${SITE_URL}`).toBe(true);
        } else if (ref.includes('@')) {
          expect(ref.endsWith('@openletz.ai'), `${path}: email "${ref}" must be @openletz.ai`).toBe(true);
        }
      }
      await ctx.dispose();
    });
  }
});
```

- [ ] **Step 2: Run the schema-presence spec.**
```bash
cd /Users/hodlmedia/forge && npx playwright test e2e/jsonld-presence.spec.ts
```
Expected: `6 passed`. A failure naming a non-`openletz.ai` URL means a JSON-LD builder still has a legacy domain — fix it in `/Users/hodlmedia/forge/src/lib/jsonld.ts` (it must import `SITE_URL`/`siteConfig` from `site-config.ts`).

- [ ] **Step 3: Manual Google Rich Results validation (one pass per schema).**
With production served locally and reachable, or against the staging URL, validate each JSON-LD block:
```bash
cd /Users/hodlmedia/forge && npm run build && (PORT=3030 npm run start &) && sleep 4
# Print each route's JSON-LD so you can paste into the validator:
for p in / /about /contact /services /pricing /work; do
  echo "===== $p =====";
  curl -s "http://localhost:3030$p" | grep -o '<script type="application/ld+json">[^<]*</script>';
done
pkill -f "next start"
```
Then, for EACH printed JSON-LD block, open `https://search.google.com/test/rich-results`, choose **Code** input, paste the block, and click **Test Code**. Expected per schema:
  - **Organization** (`/#organization`): 0 errors; name `Openletz`, `url` `https://openletz.ai`, `logo` resolves (see Task 4.10 logo).
  - **ProfessionalService** (`/#localbusiness`): 0 errors; address/areaServed parse.
  - **WebSite** (`/#website`): 0 errors (replaces the dropped "Simulateur" WebApplication).
  - **BreadcrumbList**: 0 errors; each `item` URL on `openletz.ai`.
  - **FAQPage** (`/services`): 0 errors; questions render as eligible rich result.
Record "0 errors, 0 warnings (or only non-blocking warnings)" for each. If any block errors, fix the matching builder in `jsonld.ts` and re-run Step 2.

- [ ] **Step 4: Commit.**
```bash
cd /Users/hodlmedia/forge && git add e2e/jsonld-presence.spec.ts && git commit -m "test(seo): assert JSON-LD presence per route and canonical openletz.ai domain"
```
Expected: one commit, no AI attribution.

---

### Task 4.5: Verify all 301s resolve (E2E against `src/lib/redirects.ts`)

The contracts' `/Users/hodlmedia/forge/src/lib/redirects.test.ts` already unit-tests the map shape (inversion, no soft-404, no dup sources). This task adds the live integration proof: every concrete legacy URL in `LEGACY_REDIRECTS` actually returns a 301 to its declared destination when hit through the running app, and every killed source resolves (no 404, no loop).

**Files:**
- Create: `/Users/hodlmedia/forge/e2e/redirects.spec.ts`
- Test: `/Users/hodlmedia/forge/e2e/redirects.spec.ts`

- [ ] **Step 1: Write the live-redirect spec.**
Create `/Users/hodlmedia/forge/e2e/redirects.spec.ts`:
```ts
import { test, expect, request } from '@playwright/test';
import { LEGACY_REDIRECTS } from '@/lib/redirects';
import { SITE_URL } from '@/lib/site-config';

// Only the per-URL legacy redirects whose source is a concrete path (no
// wildcard/regex) can be hit literally. Host-canonicalization (HOST_REDIRECTS)
// needs a host header the dev server can't set, so it stays in the unit test.
const CONCRETE = LEGACY_REDIRECTS.filter(
  (r) => !r.source.includes(':') && !r.source.includes('*') && !r.has,
);

test.describe('legacy 301 redirects resolve live', () => {
  test('there are concrete legacy redirects to verify', () => {
    expect(CONCRETE.length).toBeGreaterThan(0);
  });

  for (const r of CONCRETE) {
    test(`${r.source} -> 301 -> ${r.destination}`, async ({ baseURL }) => {
      const ctx = await request.newContext({ baseURL });
      // Do NOT follow redirects — inspect the 301 itself.
      const res = await ctx.get(r.source, { maxRedirects: 0 });
      expect([301, 308], `${r.source} must be a permanent redirect`).toContain(res.status());

      const loc = res.headers()['location'] || '';
      const expected = r.destination.startsWith('http') ? r.destination : `${SITE_URL}${r.destination}`;
      // Compare path-normalized (host may be added by the platform).
      const norm = (u: string) => u.replace(/\/$/, '');
      expect(
        norm(loc) === norm(expected) || norm(loc) === norm(new URL(expected).pathname),
        `${r.source} should redirect to ${expected}, got ${loc}`,
      ).toBe(true);
      await ctx.dispose();
    });
  }

  test('no legacy source soft-404s to a blank page (destination is non-home OR intentional)', async ({ baseURL }) => {
    const ctx = await request.newContext({ baseURL });
    for (const r of CONCRETE) {
      const res = await ctx.get(r.source, { maxRedirects: 0 });
      expect(res.status(), `${r.source} returned ${res.status()} (expected a 30x)`).toBeGreaterThanOrEqual(301);
      expect(res.status()).toBeLessThan(400);
    }
    await ctx.dispose();
  });
});
```

- [ ] **Step 2: Run the redirect spec.**
```bash
cd /Users/hodlmedia/forge && npx playwright test e2e/redirects.spec.ts
```
Expected: one passing test per concrete legacy URL (e.g. `/aides`, the 6 `/aides/[slug]`, `/agents`, old `/blog`, the dropped-locale folds) plus the two guard tests, all green. A 404 on any legacy source means the redirect did not register — confirm `next.config.mjs` `redirects()` returns `[...HOST_REDIRECTS, ...LEGACY_REDIRECTS]` and that the source path matches exactly.

- [ ] **Step 3: Spot-check a representative redirect by hand.**
```bash
cd /Users/hodlmedia/forge && PORT=3030 npm run dev
# in a second shell:
curl -sI http://localhost:3030/aides | grep -iE "^(HTTP|location)"
curl -sI http://localhost:3030/agents | grep -iE "^(HTTP|location)"
```
Expected: each prints `HTTP/1.1 308 Permanent Redirect` (Next dev reports 308 for `permanent:true`; production CDN serves 301) and a `location:` header pointing at the new path on `openletz.ai` (or a relative path). Stop the dev server with Ctrl-C.

- [ ] **Step 4: Commit.**
```bash
cd /Users/hodlmedia/forge && git add e2e/redirects.spec.ts && git commit -m "test(redirects): verify every concrete legacy 301 resolves live to its destination"
```
Expected: one commit, no AI attribution.

---

### Task 4.6: Make the VERCEL_ENV production noindex guard host-portable

The launch risk in spec §10 is the preview-indexing guard is Vercel-only (`process.env.VERCEL_ENV === 'production'`). Re-implement it as a single shared helper that is correct on Vercel AND on any other host (the spec says "re-implement it if hosting ever moves off Vercel"). The helper falls back to an explicit `SITE_ENV`/`NODE_ENV` signal so the site is never accidentally indexed on a preview/staging box. Logic unit → TDD.

**Files:**
- Create: `/Users/hodlmedia/forge/src/lib/indexing.ts`
- Create: `/Users/hodlmedia/forge/src/lib/indexing.test.ts`
- Modify: `/Users/hodlmedia/forge/src/app/[locale]/layout.tsx`
- Test: `/Users/hodlmedia/forge/src/lib/indexing.test.ts`

- [ ] **Step 1: Write the failing test (TDD).**
Create `/Users/hodlmedia/forge/src/lib/indexing.test.ts`:
```ts
import { describe, it, expect, afterEach } from 'vitest';
import { isProductionHost } from './indexing';

const ORIG = { ...process.env };
afterEach(() => {
  process.env = { ...ORIG };
});

describe('isProductionHost (portable noindex guard)', () => {
  it('true on Vercel production', () => {
    process.env = { ...ORIG, VERCEL_ENV: 'production', SITE_ENV: undefined, NODE_ENV: 'production' };
    expect(isProductionHost()).toBe(true);
  });

  it('false on Vercel preview', () => {
    process.env = { ...ORIG, VERCEL_ENV: 'preview', SITE_ENV: undefined };
    expect(isProductionHost()).toBe(false);
  });

  it('false on Vercel development', () => {
    process.env = { ...ORIG, VERCEL_ENV: 'development', SITE_ENV: undefined };
    expect(isProductionHost()).toBe(false);
  });

  it('off-Vercel: true only when SITE_ENV=production is explicit', () => {
    process.env = { ...ORIG, VERCEL_ENV: undefined, SITE_ENV: 'production' };
    expect(isProductionHost()).toBe(true);
  });

  it('off-Vercel: false when SITE_ENV is staging', () => {
    process.env = { ...ORIG, VERCEL_ENV: undefined, SITE_ENV: 'staging' };
    expect(isProductionHost()).toBe(false);
  });

  it('off-Vercel with no signal at all: fail closed (no indexing)', () => {
    process.env = { ...ORIG, VERCEL_ENV: undefined, SITE_ENV: undefined, NODE_ENV: 'production' };
    expect(isProductionHost()).toBe(false);
  });
});
```

- [ ] **Step 2: Run it and confirm it FAILS.**
```bash
cd /Users/hodlmedia/forge && npx vitest run src/lib/indexing.test.ts
```
Expected: FAIL — `Cannot find module './indexing'` (the helper does not exist yet).

- [ ] **Step 3: Implement the helper.**
Create `/Users/hodlmedia/forge/src/lib/indexing.ts`:
```ts
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
```

- [ ] **Step 4: Run it and confirm it PASSES.**
```bash
cd /Users/hodlmedia/forge && npx vitest run src/lib/indexing.test.ts
```
Expected: PASS — `Tests  6 passed (6)`.

- [ ] **Step 5: Use the helper in the layout (replace the inline Vercel-only check).**
In `/Users/hodlmedia/forge/src/app/[locale]/layout.tsx`, add the import near the other `@/lib` imports:
```ts
import { isProductionHost } from '@/lib/indexing';
```
Then delete the inline constant:
```ts
const IS_PRODUCTION_HOST = process.env.VERCEL_ENV === 'production';
```
and change the `shouldIndex` line from:
```ts
const shouldIndex = IS_PRODUCTION_HOST && INDEXABLE_LOCALES.has(locale);
```
to:
```ts
const shouldIndex = isProductionHost() && INDEXABLE_LOCALES.has(locale);
```
(`INDEXABLE_LOCALES` is already `['en','fr','de']` from the Phase-1 layout edit per contracts §6/proxy.)

- [ ] **Step 6: Typecheck + run the full unit suite.**
```bash
cd /Users/hodlmedia/forge && npm run typecheck && npm run test
```
Expected: typecheck exits 0; `vitest run` reports all test files passing, including `src/lib/indexing.test.ts`.

- [ ] **Step 7: Behavioural smoke — preview must noindex, production must index.**
```bash
cd /Users/hodlmedia/forge && npm run build
VERCEL_ENV=preview PORT=3030 npm run start & sleep 4 && curl -s http://localhost:3030/ | grep -i 'name="robots"' ; pkill -f "next start"
VERCEL_ENV=production PORT=3030 npm run start & sleep 4 && curl -s http://localhost:3030/ | grep -i 'name="robots"' ; pkill -f "next start"
```
Expected: the `preview` run prints a robots meta containing `noindex`; the `production` run prints `index, follow` (or no restrictive robots meta). Confirms the guard flips correctly.

- [ ] **Step 8: Commit.**
```bash
cd /Users/hodlmedia/forge && git add src/lib/indexing.ts src/lib/indexing.test.ts "src/app/[locale]/layout.tsx" && git commit -m "fix(seo): make preview-indexing noindex guard host-portable via isProductionHost"
```
Expected: one commit, no AI attribution.

---

### Task 4.7: Validate the new sitemap (test) + submit to Google Search Console

Add a test that asserts the rebuilt `sitemap.ts` output is on the canonical apex, covers the new IA across `['en','fr','de']`, and excludes every killed route — then submit the live sitemap to GSC. Submission uses the `gsc` MCP tool if available, with a manual fallback. (The contracts route `sitemap.ts` to Phase 2; this task verifies + ships it.)

**Files:**
- Create: `/Users/hodlmedia/forge/src/app/sitemap.test.ts`
- Test: `/Users/hodlmedia/forge/src/app/sitemap.test.ts`

- [ ] **Step 1: Write the failing test (TDD).**
Create `/Users/hodlmedia/forge/src/app/sitemap.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import sitemap from './sitemap';
import { SITE_URL, LOCALES } from '@/lib/site-config';

const entries = sitemap();
const urls = entries.map((e) => e.url);

describe('sitemap.ts', () => {
  it('every URL is on the canonical apex (no www, no .com/.fr/.info)', () => {
    for (const u of urls) {
      expect(u.startsWith(SITE_URL), `"${u}" must start with ${SITE_URL}`).toBe(true);
      expect(u).not.toContain('www.');
      expect(u).not.toContain('.com');
      expect(u).not.toContain('openletz.fr');
    }
  });

  it('includes the home + core MVP routes for the default locale', () => {
    expect(urls).toContain(`${SITE_URL}`);
    expect(urls).toContain(`${SITE_URL}/work`);
    expect(urls).toContain(`${SITE_URL}/about`);
    expect(urls).toContain(`${SITE_URL}/contact`);
  });

  it('covers fr and de prefixed routes (as-needed prefixing)', () => {
    expect(urls).toContain(`${SITE_URL}/fr`);
    expect(urls).toContain(`${SITE_URL}/de`);
  });

  it('excludes every killed route family', () => {
    for (const u of urls) {
      expect(u).not.toMatch(/\/aides(\/|$)/);
      expect(u).not.toMatch(/\/agents(\/|$)/);
      expect(u).not.toMatch(/\/os(\/|$)/);
    }
  });

  it('excludes the dropped locales', () => {
    const dropped = ['it', 'es', 'ru', 'ar', 'tr', 'uk', 'pt', 'lb'];
    for (const u of urls) {
      for (const d of dropped) {
        expect(u).not.toMatch(new RegExp(`/${d}(/|$)`));
      }
    }
    expect(LOCALES).toEqual(['en', 'fr', 'de']);
  });

  it('every entry declares hreflang alternates for all 3 locales', () => {
    const home = entries.find((e) => e.url === `${SITE_URL}`);
    expect(home?.alternates?.languages).toBeTruthy();
    const langs = Object.keys(home!.alternates!.languages!);
    expect(langs).toEqual(expect.arrayContaining(['en', 'fr', 'de', 'x-default']));
  });
});
```

- [ ] **Step 2: Run it and confirm PASS or a real gap.**
```bash
cd /Users/hodlmedia/forge && npx vitest run src/app/sitemap.test.ts
```
Expected: PASS if Phase 2 rebuilt `sitemap.ts` to contracts (apex, en/fr/de, new IA, hreflang). If it FAILS (e.g. a killed route still listed or `www.`/`.com` present, or a missing `x-default`), fix `/Users/hodlmedia/forge/src/app/sitemap.ts` to import `SITE_URL`/`LOCALES`/`localeUrl` from `site-config.ts` and emit only the new IA, then re-run until green. This is the verification gate for the Phase-2 sitemap.

- [ ] **Step 3: Render the live sitemap to confirm it serves.**
```bash
cd /Users/hodlmedia/forge && npm run build && (PORT=3030 npm run start &) && sleep 4 && curl -s http://localhost:3030/sitemap.xml | head -40 ; pkill -f "next start"
```
Expected: well-formed XML beginning `<?xml version="1.0" ...><urlset ...>` with `<loc>https://openletz.ai</loc>` and `xhtml:link` hreflang alternates; no `aides`/`agents`/`os` `<loc>` entries.

- [ ] **Step 4: Submit the sitemap to Google Search Console (MCP path).**
First load the `gsc` MCP tools, then list sites and submit. (The `gsc` MCP is configured per the user's setup — `reference_analytics_mcp.md`.)
```text
ToolSearch query: "select:mcp__gsc__list_sites,mcp__gsc__submit_sitemap,mcp__gsc__list_sitemaps"
```
Then call, in order:
  1. `mcp__gsc__list_sites` — confirm `https://openletz.ai/` (or `sc-domain:openletz.ai`) is a verified property. If it is NOT listed, STOP and do the manual fallback (Step 5) after the owner verifies the property.
  2. `mcp__gsc__submit_sitemap` with `siteUrl: 'https://openletz.ai/'` and `feedpath: 'https://openletz.ai/sitemap.xml'`.
  3. `mcp__gsc__list_sitemaps` with `siteUrl: 'https://openletz.ai/'` — confirm `https://openletz.ai/sitemap.xml` now appears with no errors.
Expected: `submit_sitemap` returns success; `list_sitemaps` shows the sitemap path with `isPending: false` (or a freshly-submitted entry).

- [ ] **Step 5: Manual GSC fallback (if MCP unavailable or property unverified).**
Open `https://search.google.com/search-console`, select the `openletz.ai` property (verify via DNS TXT or the `GSC_VERIFICATION` meta already wired in `layout.tsx` if needed), go to **Sitemaps**, enter `sitemap.xml`, and click **Submit**. Expected: status **Success**, discovered URL count > 0 within a few minutes. Also confirm `public/robots.txt` `Sitemap:` line reads `https://openletz.ai/sitemap.xml`.

- [ ] **Step 6: Commit.**
```bash
cd /Users/hodlmedia/forge && git add src/app/sitemap.test.ts && git commit -m "test(seo): assert sitemap on apex, covers en/fr/de IA, excludes killed routes"
```
Expected: one commit, no AI attribution. (GSC submission is an operational action, not code — nothing else to commit.)

---

### Task 4.8: Full green gate — typecheck, unit suite, and entire Playwright E2E pass

Before launch, run every check the repo defines in one pass and prove the whole suite is green. No new product code; this is the consolidated verification task that gates the launch checklist.

**Files:**
- (no source changes; verification only)

- [ ] **Step 1: Typecheck the whole project.**
```bash
cd /Users/hodlmedia/forge && npm run typecheck
```
Expected: no output, exit 0. Any error here blocks launch — fix the offending file, then re-run.

- [ ] **Step 2: Run the full unit + component suite.**
```bash
cd /Users/hodlmedia/forge && npm run test
```
Expected: `vitest run` reports every test file passing — including `site-config`, `schema`, `redirects`, `jsonld`, `data`, `contact`/`newsletter` route tests, `SectionRenderer`, `HeroSection`, `Reveal`, `ProofStripLive`, `indexing`, `sitemap`, and `scripts/cwv-budget`. Final line: `Test Files  N passed (N)`.

- [ ] **Step 3: Run the entire Playwright E2E suite headless.**
```bash
cd /Users/hodlmedia/forge && npm run test:e2e
```
Expected: Playwright boots the `webServer`, then all specs pass — `home.spec.ts`, `i18n.spec.ts`, `reduced-motion.spec.ts`, `cwv-ssr.spec.ts`, `reduced-motion-launch.spec.ts`, `jsonld-presence.spec.ts`, `redirects.spec.ts`. Final line reports `N passed`, 0 failed.

- [ ] **Step 4: Production build with the CWV budget guard.**
```bash
cd /Users/hodlmedia/forge && npm run build && npm run cwv:budget
```
Expected: build succeeds; `cwv:budget` prints `cwv-budget: all routes within 180 KB budget.` (exit 0).

- [ ] **Step 5: Lint.**
```bash
cd /Users/hodlmedia/forge && npm run lint
```
Expected: `next lint` reports no errors (warnings acceptable but should be reviewed).

- [ ] **Step 6: Record the green gate (no commit — verification only).**
If all five steps are green, the build is launch-eligible. If anything fails, STOP and fix before proceeding to Task 4.9 / 4.10. (Nothing to commit in this task.)

---

### Task 4.9: Reconcile AEO/discovery surfaces to the canonical domain (final sweep)

A grep-driven final sweep that proves NO file still references a legacy host (`openletz.com`, `www.openletz.`, `openletz.fr`, `openletz.info`, `bob@openletz.com`) anywhere it would ship to crawlers — robots, llms.txt, well-known, JSON-LD, sitemap, layout metadata. Catches a stray literal the per-file edits missed. Add a tiny test that fails the build if a legacy domain reappears.

**Files:**
- Create: `/Users/hodlmedia/forge/src/lib/canonical-domain.test.ts`
- Test: `/Users/hodlmedia/forge/src/lib/canonical-domain.test.ts`

- [ ] **Step 1: Grep the source tree for legacy hosts (manual scan first).**
```bash
cd /Users/hodlmedia/forge && grep -rnE "openletz\.(com|fr|info)|www\.openletz|bob@openletz" src public next.config.mjs --include="*.ts" --include="*.tsx" --include="*.mjs" --include="*.txt" --include="*.json" | grep -v "redirects" || echo "CLEAN: no legacy host references outside redirect map"
```
Expected: `CLEAN: no legacy host references outside redirect map`. Any hit (other than intentional `source`/`has.value` entries in `redirects.ts`/`next.config.mjs`, which legitimately name old hosts as redirect SOURCES) must be fixed to `openletz.ai` / `hello@openletz.ai` before continuing.

- [ ] **Step 2: Write the regression test (asserts the canonical domain in shipped static files).**
Create `/Users/hodlmedia/forge/src/lib/canonical-domain.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_URL } from '@/lib/site-config';

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');

// Static files that ship to crawlers and must already be on the apex domain.
const SHIPPED_TEXT_FILES = [
  'public/robots.txt',
  'public/llms.txt',
  'public/llms-full.txt',
];

describe('canonical domain hygiene', () => {
  it('SITE_URL is the apex with no www and no trailing slash', () => {
    expect(SITE_URL).toBe('https://openletz.ai');
  });

  for (const f of SHIPPED_TEXT_FILES) {
    it(`${f} references openletz.ai and no legacy host`, () => {
      const txt = read(f);
      expect(txt).toContain('openletz.ai');
      expect(txt).not.toMatch(/openletz\.com/);
      expect(txt).not.toMatch(/www\.openletz\./);
      expect(txt).not.toMatch(/openletz\.fr/);
      expect(txt).not.toMatch(/openletz\.info/);
      expect(txt).not.toMatch(/bob@openletz/);
    });
  }

  it('robots.txt declares the apex sitemap', () => {
    expect(read('public/robots.txt')).toMatch(/Sitemap:\s*https:\/\/openletz\.ai\/sitemap\.xml/);
  });
});
```

- [ ] **Step 3: Run the test.**
```bash
cd /Users/hodlmedia/forge && npx vitest run src/lib/canonical-domain.test.ts
```
Expected: PASS. If `public/robots.txt` / `llms.txt` / `llms-full.txt` still carry a legacy host or are missing the apex `Sitemap:` line, fix those static files (per contracts §6) and re-run until green. (These were domain-fixed in Phase 1/2; this is the launch-time backstop.)

- [ ] **Step 4: Commit.**
```bash
cd /Users/hodlmedia/forge && git add src/lib/canonical-domain.test.ts && git commit -m "test(seo): backstop test fails build if a legacy host reappears in shipped files"
```
Expected: one commit, no AI attribution.

---

### Task 4.10: Final launch checklist — assets, env vars, domain cert

The non-code go-live gate. Confirm the two real assets the JSON-LD/brand depend on are in place (`openletz-logo.png` + a founder photo), the notification env vars are set (lead durability — serverless FS is ephemeral, so Telegram/webhook is the real lead trail), and the HTTPS cert / DNS resolve. An asset-presence test fails the build if the logo the Organization schema points at is missing.

**Files:**
- Create: `/Users/hodlmedia/forge/src/lib/launch-assets.test.ts`
- Test: `/Users/hodlmedia/forge/src/lib/launch-assets.test.ts`
- (assets) `/Users/hodlmedia/forge/public/openletz-logo.png`, `/Users/hodlmedia/forge/public/founder.jpg`

- [ ] **Step 1: Confirm / place the required public assets.**
```bash
cd /Users/hodlmedia/forge && ls -la public/openletz-logo.png public/founder.jpg public/openletz.svg 2>&1
```
Expected: all three exist. If `public/openletz-logo.png` is missing, EITHER add the owner-supplied PNG OR (per spec §3 / contracts §6) repoint `siteConfig.brand.logoPng` in `/Users/hodlmedia/forge/src/lib/site-config.ts` to `${SITE_URL}/openletz.svg` and update this task's test to assert `public/openletz.svg`. If `public/founder.jpg` is missing, drop in the owner headshot; until the real headshot arrives, the about/hero image component references the placeholder constant defined in `/Users/hodlmedia/forge/src/data/about.ts` — DO NOT ship a broken `<img>`.

- [ ] **Step 2: Write the asset-presence test.**
Create `/Users/hodlmedia/forge/src/lib/launch-assets.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { siteConfig } from '@/lib/site-config';

const ROOT = process.cwd();

// The Organization JSON-LD `logo` points here; a 404 logo is a Rich-Results error.
function publicPathFromUrl(url: string): string {
  return join(ROOT, 'public', new URL(url).pathname.replace(/^\//, ''));
}

describe('launch assets', () => {
  it('the JSON-LD logo file actually exists in /public', () => {
    const p = publicPathFromUrl(siteConfig.brand.logoPng);
    expect(existsSync(p), `${p} (siteConfig.brand.logoPng) must exist`).toBe(true);
    expect(statSync(p).size, 'logo must be non-empty').toBeGreaterThan(0);
  });

  it('the brand SVG mark exists', () => {
    const p = publicPathFromUrl(siteConfig.brand.logoSvg);
    expect(existsSync(p), `${p} (siteConfig.brand.logoSvg) must exist`).toBe(true);
  });

  it('the OG image exists (social + crawler preview)', () => {
    expect(existsSync(join(ROOT, 'public', 'og-image.png'))).toBe(true);
  });
});
```

- [ ] **Step 3: Run the asset test.**
```bash
cd /Users/hodlmedia/forge && npx vitest run src/lib/launch-assets.test.ts
```
Expected: PASS. A failure means the file `siteConfig.brand.logoPng` points at is not in `/public` — either add the asset or repoint `logoPng`→`logoSvg` in `site-config.ts` (Step 1) and re-run.

- [ ] **Step 4: Confirm notification env vars (lead durability).**
```bash
cd /Users/hodlmedia/forge && for v in TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID NOTIFICATION_WEBHOOK_URL ADMIN_TOKEN GSC_VERIFICATION; do
  if [ -n "$(printenv $v)" ] || grep -q "^$v=" .env.local 2>/dev/null; then echo "SET   $v"; else echo "MISSING $v"; fi
done
```
Expected: `SET   TELEGRAM_BOT_TOKEN`, `SET   TELEGRAM_CHAT_ID`, `SET   NOTIFICATION_WEBHOOK_URL`, `SET   ADMIN_TOKEN`. (At minimum the Telegram OR webhook pair must be SET — that is the real lead trail since serverless FS is ephemeral.) Mirror the same vars into the Vercel project (or the chosen host) production environment. Any `MISSING` of the lead-notification vars blocks launch.

- [ ] **Step 5: Verify the domain cert + DNS resolve (apex + www → apex).**
```bash
curl -sI https://openletz.ai/ | grep -iE "^(HTTP|location|strict-transport)"
curl -sI https://www.openletz.ai/ | grep -iE "^(HTTP|location)"
echo | openssl s_client -servername openletz.ai -connect openletz.ai:443 2>/dev/null | openssl x509 -noout -subject -dates
```
Expected: `https://openletz.ai/` returns `HTTP/2 200` with an HSTS header; `https://www.openletz.ai/` returns `HTTP/2 301` with `location: https://openletz.ai/...`; the cert `subject`/`CN` covers `openletz.ai` and `notAfter` is in the future. If the cert is not yet issued, this is the one launch step that may wait on the host/DNS (spec §12 item 6) — note it as the final go/no-go.

- [ ] **Step 6: Final launch checklist (tick every item).**
Confirm and check off, in order:
  - [ ] `npm run typecheck`, `npm run test`, `npm run test:e2e`, `npm run lint` all green (Task 4.8).
  - [ ] `npm run build && npm run cwv:budget` green (Task 4.8).
  - [ ] `public/openletz-logo.png` (or `openletz.svg` if repointed) + `public/founder.jpg` present; `launch-assets.test.ts` green (Steps 1-3).
  - [ ] Google Rich Results: 0 errors on Organization / ProfessionalService / WebSite / BreadcrumbList / FAQPage (Task 4.4).
  - [ ] Sitemap submitted + accepted in GSC; `robots.txt` `Sitemap:` line on apex (Task 4.7 / 4.9).
  - [ ] Every concrete legacy 301 resolves live (Task 4.5).
  - [ ] Preview-indexing guard verified: preview = noindex, production = index (Task 4.6).
  - [ ] Lead-notification env vars SET in prod (Step 4).
  - [ ] `https://openletz.ai` serves 200 with valid cert; `www` 301s to apex (Step 5).

- [ ] **Step 7: Commit (test + any logo asset / site-config repoint).**
```bash
cd /Users/hodlmedia/forge && git add src/lib/launch-assets.test.ts public/openletz-logo.png public/founder.jpg && git commit -m "test(seo): assert JSON-LD logo and launch assets exist in public"
```
Expected: one commit, no AI attribution. (Include `src/lib/site-config.ts` in the `git add` only if `logoPng` was repointed to the SVG in Step 1. Omit any asset path that genuinely does not yet exist because it is owner-supplied — never `git add` a missing file.)
