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
