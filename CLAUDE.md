# CLAUDE.md — Openletz

## Project Overview

Openletz (`openletz`) is the website of **a Luxembourg AI agency** (solo founder-operator: Clément Fermaud / Commit Media S.à r.l., RCS B276192). Tagline: "Websites that think, move & transact." AI agents & automation are the front door; digital & growth is the body; Web3/on-chain is secondary depth. The site's one job is to convert a qualified visitor into a **project enquiry**.

This repo replaced an earlier Mac-OS-"Aqua" desktop homepage (scrapped) and, before that, a Fit-4-Digital grants-**consultant** identity (an OS-shell + eligibility quiz, deleted). Do not reintroduce the OS-shell, the eligibility quiz, or the "Fit 4 Digital/AI" grants-consultant positioning. NOTE: the **SME Package** page + funding simulator (`/sme-package`) IS a current, legitimate value-add service (70% state co-funding we help clients claim) — it uses funding vocabulary (grant, eligibility) on purpose; that is not the killed identity.

## Tech Stack

- **Framework:** Next.js 16 (App Router) / React 19
- **Language:** TypeScript 5.7 (strict)
- **i18n:** next-intl 4.x — **en (default, at `/`) · fr · de**, ALL content fully translated. Content modules are locale-keyed (`Record<Locale, T>` + `getX(locale)` accessors; `getHomeSections(locale)`, `getUiStrings(locale)`). Blog/case-study bodies are localized via `content/blog/<slug>.<locale>.mdx` + `getPostBody(post, locale)`.
- **Design:** "**Bold Kinetic**" — ink-black `#0A0A0B` + electric-lime `#C6FF3A` accent + film grain. Tailwind 3.4; tokens in `src/styles/tokens.css`; `.ol-btn`/`.ol-btn-ghost`/`.ol-input`/`.ol-chip`/`.ol-link`/`.ol-range` component classes in `globals.css`. Fonts (`src/lib/fonts.ts`): **Anton** display (`font-display`, giant poster headings), **Hanken Grotesk** body (`font-body`), JetBrains Mono labels (`font-mono`). NOT monochrome.
- **Content:** typed `src/data/*.ts` validated with **Zod** (single source of truth, parsed per locale at load)
- **Motion:** **GSAP 3.15** (`SplitText`/`ScrollTrigger` via `@gsap/react` `useGSAP`, registered in `src/lib/gsap.ts`) drives the kinetic headline, marquee, magnetic cursor and scroll reveals; `motion/react` for magnetic buttons. All effects are post-hydration enhancements: content renders full-opacity in SSR and stays legible under `prefers-reduced-motion`.
- **Blog:** MDX read with `gray-matter` (`src/lib/blog.ts`); rendered by the dependency-free `src/lib/markdown.ts` (escapes-first, XSS-safe)
- **Tests:** Vitest + Testing Library (unit/component), Playwright (E2E)
- **Hosting:** Vercel

## Canonical domain

**`https://openletz.ai`** (apex — no `www`, no trailing slash). The one definition lives in `src/lib/site-config.ts` (`SITE_URL`, `LOCALES`, `DEFAULT_LOCALE`, `localeUrl`, `siteConfig`). Every JSON-LD `@id`/`url`, sitemap, canonical, robots `Sitemap:`, and redirect imports from there — never hardcode a host. Host canonicalization (`.com`/`www`/`.fr`/`.info` → apex) and per-URL legacy 301s live in `src/lib/redirects.ts`, consumed by `next.config.mjs`.

## Commands

```bash
npm run dev        # dev server (localhost:3000; E2E uses PORT=3030)
npm run build      # production build
npm run start      # serve production build
npm run lint       # NOTE: broken — `next lint` was removed in Next 16; ESLint not yet configured (follow-up). Use typecheck + build as the gates.
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
- **Portfolio (honest split, owner-confirmed):** **built products** (our own) = Gategram, Ophis, Skills.ws. **Client builds** = Vins Fins, La Grocerie. **CONTRIBUTED-TO, NOT owned** = LiberClaw, LibertAI, Aleph Cloud — the founder contributed to these for years; copy MUST say "contributed"/"not our product" and NEVER imply Openletz built or owns them (in Work they carry kind `Contributor` + tag `contributed`; keep their external links liberclaw.ai / libertai.io / aleph.cloud). Never list aleph-fileshare. "Greg" is an internal codename for Ophis. Never say "Aleph.im" (always "Aleph Cloud").
- **SME Package:** the funding angle now has a full page + simulator (`/sme-package`, 70% state co-funding, €3k–€25k, Ministry of the Economy + Luxinnovation). Surface it (footer + soft links on services/pricing). Commit Media itself is SME-Package eligible (not Fit 4 AI). Keep funding facts exact + caveated (indicative, subject to eligibility + approval, reimbursed after delivery).

## API routes (salvaged)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact` | POST | Enquiry form → `data/contacts.json` + Telegram/webhook fan-out; validated by `ContactPayloadSchema` |
| `/api/newsletter` | POST | Newsletter signup, deduped; validated by `NewsletterSchema` |
| `/api/md/[[...slug]]` | GET | Markdown rendering of pages for AI crawlers |
| `/api/well-known/*` | GET | RFC 9727 agent-discovery (openapi, api-catalog) |

Serverless FS is ephemeral — the Telegram/webhook notification is the durable lead trail; confirm `TELEGRAM_BOT_TOKEN`/`CHAT_ID`, `NOTIFICATION_WEBHOOK_URL`, `ADMIN_TOKEN` env vars in production.
