# Openletz.ai — Website Redesign Design Spec

**Date:** 2026-06-07
**Repo:** `san-npm/forge` (local `~/forge`)
**Replaces:** the Mac OS X "Aqua" desktop-OS homepage (branch `openletz-os`), which is being scrapped.
**Companion research:** `~/openletz-website-intel-2026-06.md` (full audit + 5 research lanes), `~/openletz-rebrand-strategy-2026-06.md` (positioning), `~/openletz-keywords-2026-06.md`.

---

## 1. Goal & positioning (LOCKED — not re-litigated here)

Openletz is **a Luxembourg AI agency**. AI agents/automation are the **front door** (core, broad funnel); digital & growth (websites, e-commerce, SEO/AEO) is the **body**; Web3/on-chain is **secondary depth** ("when it helps"). Solo founder-operator: **Clément Fermaud / Commit Media S.à r.l. (RCS B276192)**.

**Tagline:** "Websites that think, move & transact." · sub "A Luxembourg AI agency."

**The job of the site:** convert a qualified visitor into a **project enquiry**. The redesign exists to fix the two failures of the OS site, confirmed by the owner: **(1) it was gimmicky / not credible for serious B2B clients, and (2) it buried the offer.** Therefore: a clear promise above the fold, one obvious primary action, and unfakeable proof that the studio actually ships.

### Success criteria
- A first-time visitor understands *what Openletz does* and *what to do next* within the hero (no interaction required).
- One dominant conversion path: the **qualifying enquiry form**.
- Real shipped work is visible and verifiable (links to live products).
- Static HTML carries the H1 + primary copy (AI crawlers don't render JS).
- Core Web Vitals: **LCP < 2.0s, INP < 200ms, CLS < 0.1.**

---

## 2. Decisions locked in this brainstorm

| Decision | Choice |
|---|---|
| Design register | **Editorial Engineering** (studio-as-publisher; Linear/Vercel/Stripe lineage) |
| Accent / palette | **Monochrome / "white-hot"** — near-black + off-white + greys; **no accent color** (orange explicitly rejected) |
| Signature moment | **Live proof strip** (real shipped products + cached live signals) |
| Motion level | **Restrained "premium-quiet"** |
| Primary conversion | **Qualifying enquiry form** (book-a-call is the secondary option) |
| Pricing | **Productized "from €X" tiers** + custom tier + soft SME Package note |
| Domain | **`https://openletz.ai` (apex)** canonical |
| Languages | **EN (primary, at `/`) + FR + DE** |
| Page scope | **Full IA** |
| Lead magnet `/audit` | Build in **Phase 3** |
| Blog `/insights` | **Keep** — new agency-positioned posts (owner writes them) |
| First case-study essays | **Vins Fins** + **La Grocerie** |

---

## 3. Design language — "Editorial Engineering", monochrome

Confident, quiet, opinionated. Hairline rules, large display type, generous whitespace, proof-by-real-artifact, numbered field-notes. Reads as "a real person with real taste" — the defensible anti-AI-slop stance for an AI studio.

### Palette (monochrome / white-hot)
Light itself is the accent — emphasis comes from pure white against near-black, never from a hue.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0B0B0C` | page base (near-black) |
| `--surface` | `#141416` | cards, raised surfaces |
| `--surface-2` | `#1A1C1F` | nested surfaces, inputs |
| `--text` | `#FAFAF7` | primary text (off-white) |
| `--text-dim` | `#A1A1A6` | secondary text |
| `--hairline` | `rgba(255,255,255,0.10)` | rules, borders, dividers |
| `--hot` | `#FFFFFF` | "white-hot" — hover/active/emphasis, the de-facto accent |

A **single restrained accent slot is reserved but unused** at launch; if pure monochrome reads too plain after build, one accent can be introduced via a single token without touching components. (Not orange.)

### Type
- **Display:** one confident variable sans with character (high-contrast grotesque). Self-hosted via `next/font`, subset `latin` + `latin-ext` (FR/DE diacritics).
- **Body:** clean humanist/grotesque sans.
- **Kickers / metric labels / code-ish accents:** a mono, used sparingly for *genuine* technical content only.
- Exact typefaces are an asset decision (candidates evaluated in the implementation plan); the spec locks the *roles*, not the files.

### Brand mark
The existing 8-fold radial pinwheel (`public/openletz.svg`, currently `#201B21`) recolors cleanly to the monochrome system (off-white on near-black). It doubles as the **"signal" glyph** for dividers and the lockup. Note: JSON-LD references a missing `/openletz-logo.png` — provide it or repoint to `openletz.svg`.

---

## 4. Motion system — restrained "premium-quiet"

Motion must **explain, not decorate**. Linear/Vercel/Stripe register, never Awwwards showreel.

- **Library, two-tier:**
  - **Default:** `motion/react` (ex-Framer Motion) for ~90% of component motion (entrance, stagger, hover, layout, `AnimatePresence`) — compositor-accelerated, protects INP.
  - **CSS first** for trivial reveals/parallax via `animation-timeline: view()` (zero JS), gated behind `@supports` + `prefers-reduced-motion: no-preference`.
  - **GSAP only** for the *one* optional sticky-scroll set-piece — dynamic-imported so its ~23kb never lands on routes that don't use it. (Already installed; do not default to it.)
- **Techniques:** magnetic primary CTA · staggered word/line reveals at **30–60ms** steps · count-ups on metric numbers · card hover that grows from its own origin · native View-Transition card→case-study morph (native API, not Next's `unstable_ViewTransition`).
- **Motion tokens (no raw `ease`/ad-hoc durations):** `--ease-out: cubic-bezier(0.16,1,0.3,1)` (default) · `--ease-fast: cubic-bezier(0.4,0,0.2,1)` · `--ease-spring: cubic-bezier(0.34,1.56,0.64,1)` (delight only) · `--dur-fast:100ms` `--dur-base:200ms` `--dur-slow:300ms` (keep ~everything <300ms).
- **Non-negotiable rules:**
  - Every page SSR/SSG; H1 + primary copy in static HTML.
  - LCP node renders at full opacity on first paint — never animated from `opacity:0`. Progressive enhancement: content is `opacity:1` by default; JS adds a class to enable below-fold reveals.
  - Animate **transform + opacity only** (never width/height/top/left/margin).
  - Exactly **one** `priority` `next/image` (the LCP candidate), explicit dimensions + accurate `sizes`, AVIF→WebP, lazy below fold.
  - Global `@media (prefers-reduced-motion: reduce)` kill-switch (durations → 0.01ms) + gate parallax/scroll-driven/magnetic behind `no-preference`. Reduced ≠ stripped (keep fades). Test with reduce ON before launch.

---

## 5. Domain & migration

**Canonical = `https://openletz.ai` (apex; `www.openletz.ai` 301s to apex).**

- Invert `next.config.mjs` redirects: `.com → .ai` (today `.ai` is wrongly 301'd to `.com`).
- Replace every hardcoded `SITE_URL` / `localeUrl` base (8+ files: `layout.tsx`, `locale-url.ts`, `sitemap.ts`, `robots.txt`, `well-known/*`, AEO files, all JSON-LD `@id`/`url`).
- Valid HTTPS cert for `openletz.ai` (+ `www`) on the host.
- **Per-URL 301s** from every killed legacy URL → new equivalent or home: `/aides/*`, `/agents/*`, old `/blog/*`. Never blanket-redirect to home. Preserve the one ranking cluster (AI-tool RGPD/DSGVO/DPA terms) by mapping it sensibly.
- Canonical tag, sitemap, `robots Sitemap:` line, JSON-LD all agree on the single host.
- Keep the `VERCEL_ENV === 'production'` noindex guard; re-implement it if hosting ever moves off Vercel.

---

## 6. Information architecture (full IA · EN + FR + DE)

EN served at `/`; FR/DE prefixed (`/fr`, `/de`). `defaultLocale = en`, emit `x-default = en`. Collapse the 11-locale sprawl; drop `it/es/ru/ar/tr/uk/pt` and (per decision) LB.

Flat 5-item nav + persistent high-contrast **"Start a project"** button. **One "Services" entry** feeding a unified pillar grid — do NOT split AI vs Marketing into competing menus.

| Path | Purpose | Phase |
|---|---|---|
| `/` | Full studio story → one funnel to the enquiry form | 2 |
| `/services` | 3 pillars as **one studio** (AI · Growth · Web3) | 3 (homepage anchors until then) |
| `/work` | Filterable grid (AI / Web / Web3), links to live artifacts | 2 |
| `/work/[slug]` | Case-study essays (Problem → Process → Result + fixed metric sidebar) | 2 (Vins Fins, La Grocerie) |
| `/about` | Founder-forward bio + Commit Media entity + EU/GDPR/AI-Act trust block | 2 |
| `/pricing` | 3 productized "from €X" tiers + custom + SME Package note | 3 |
| `/audit` | Free AI & web readiness lead magnet (proves capability) | 3 |
| `/insights` + `/insights/[slug]` | New agency-positioned MDX posts | 3 |
| `/contact` | Standalone enquiry form + book-a-call | 2 |
| `/legal/privacy`, `/legal/terms` | Boilerplate (salvaged) | 2 |
| `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/.well-known/*` | AEO layer (salvaged, domain-fixed) | 2 |

**Footer (4 lean columns):** (1) Services / 3 pillars, (2) Company (About, Work, Insights), (3) Connect (LinkedIn `sameAs`), (4) Legal. Surface Luxembourg location/entity prominently + newsletter signup.

---

## 7. Homepage — section by section

Locked studio spine (do not reorder): Hero → proof strip → services grid → how-we-work → selected work → deeper proof → trust block → closing enquiry form → footer.

| # | Section | Purpose | Content (REAL assets) | Motion |
|---|---|---|---|---|
| 1 | **Hero** | one promise + the primary action | H1 "Websites that think, move & transact." / sub "A Luxembourg AI agency." Lead = `STUDIO.welcomeLead`. Primary CTA **"Start a project"** → enquiry form; secondary "See our work". No pillar-stuffing. | LCP H1 full opacity on first paint. Staggered reveal on sub-line only. Magnetic primary CTA. |
| 2 | **Live proof strip** (signature) | instant, unfakeable credibility | Real portfolio wordmarks (Vins Fins, La Grocerie, Gategram, LiberClaw, Ophis, Skills.ws — salvaged logo PNGs) + cached live status/last-deploy + secondary Aleph network-metrics row. Label "Shipped & live". | Count-ups on numbers in view. ISR-cached (5–15 min), degrades to "verified N min ago" — never blocks paint. |
| 3 | **Services grid (one studio)** | 3 pillars as ONE studio | Single 3-card equal-weight grid: 01 AI agents & automation (front door, lead) · 02 Digital & Growth · 03 Web3 & On-Chain. Same single CTA on all three. Numbered 01/02/03 = "parts of one whole". From `SERVICES`. | Card hover grows from origin (200ms ease-out). Stagger reveal 40–50ms. |
| 4 | **How we work** | de-risk the engagement | From `SERVICES.*.how`: audit → clickable prototype → live with numbers. AI pillar framed as low-risk entry. **SME Package** co-funding line lives here, soft ("may be co-funded through the SME Package — we help with the paperwork"). | The ONE optional sticky-scroll set-piece (GSAP) may live here; otherwise stepped reveal. |
| 5 | **Selected work** | proof-by-artifact | Tagged grid (AI/Web/Web3) from `WORK[6]`; each card LINKS to the live product (vinsfins.lu, lagrocerie.lu, gategram.app, liberclaw.ai, ophis.fi, skills.ws). "View all work" link. Tags let each buyer self-filter. | View-transition morph card→case-study. Hover grows from origin. |
| 6 | **Deeper proof** | second-pass credibility | Defensible numbers ONLY: shipped-product count (6+), live Aleph metrics (corechannel API — never fabricate), years building. 1–3 named testimonials (photo/name/role/company). | Count-ups; calm. |
| 7 | **EU/GDPR/AI-Act trust block** | LU/EU sovereignty as moat | From `ABOUT.facts` + llms FAQ: EU-based, GDPR-native, AI-Act-aware; can deploy sovereign/EU or Aleph-hosted infra so data stays in Europe. Truthful deployer-level claims only — no badge-theatre. | Fade only. |
| 8 | **Closing CTA = qualifying enquiry form** (PRIMARY conversion) | convert the warmed-up visitor in place | Action headline (from `CONTACT.lead`: "Tell us what you want to build. We reply within one business day."). Fields: name, email, **company size**, **pillar** (AI/Growth/Web3 from `CONTACT.types`), **budget band**, message. Wired to salvaged `/api/contact` + Telegram/webhook fan-out. Secondary: "Book a 15-minute intro call" (`callLine`). | Fade in; no spectacle. |
| 9 | **Footer** | restate one-studio + local credibility | 4 columns. `Commit Media S.à r.l. · RCS B276192`, LinkedIn `sameAs`, newsletter (salvaged `/api/newsletter`). | None. |

The one CTA verb — **"Start a project"** — repeats ~5× (hero, after services, after selected work, closing form, persistent nav button). Book-a-call is always the quieter secondary. Never alternate verbs.

---

## 8. Pricing (productized)

Three **"from €X"** packages + a custom/"let's talk" tier + the soft SME Package co-funding note. Research (lane-4) ties published "from" anchors to ~+27% qualified-lead conversion vs hidden pricing. **Owner provides the real "from" numbers**; the tier *structure* maps to the 3 pillars (e.g. an AI-automation starter, a website/growth build, a Web3/custom tier). Until numbers exist, tiers render with explicit `from` placeholders, not "On request".

---

## 9. Content

- **Voice:** human, specific, opinionated — never AI-slop. Studio-as-publisher tone.
- **Portfolio (exact — do not vary):** Vins Fins, La Grocerie, Gategram, LiberClaw, Ophis, Skills.ws. **Never list** LibertAI or aleph-fileshare. Ophis is the public brand ("Greg" is internal codename only).
- **Funding:** always **SME Package** (Commit Media is *not* Fit 4 AI eligible). One soft line, not a pillar.
- **First case-study essays:** Vins Fins (catalogue→commerce, multilingual e-commerce; Lighthouse/SEO/launch-time metrics) and La Grocerie (farm-to-table grocery + natural-wine e-commerce, sister site sharing Stripe + stock KV). Problem → Process → Result + fixed metric sidebar.
- **Blog/Insights:** salvage the MDX pipeline; **remove all 7 grants-era posts**; owner writes new agency-positioned posts (AI automation, AEO/GEO, EU-AI-Act, AI×Web3 long-tail).
- All copy ported from the salvaged `osData.ts` (single source of truth) into typed data modules.

---

## 10. Architecture, salvage & kill

**Stack (keep):** Next.js 16 / React 19 / Tailwind / next-intl / Vercel.

**Architecture:** content lives in typed `src/data/*.ts` (ported verbatim from `osData.ts`, validated with **Zod**). Pages are a typed discriminated-union `Section[]` rendered by a `<SectionRenderer>` of **Server Components**; all interactivity (motion, form, proof strip, work filter) lives in `'use client'` leaf islands. Enable `cacheComponents`. Add `setRequestLocale` + `generateStaticParams` to **every** `[locale]` file (or static rendering silently breaks).

**Salvage (keep & port):**
- `src/components/os/osData.ts` — STUDIO, SERVICES, WORK[6], ABOUT, CONTACT, PRICING (the canonical content model).
- `src/components/os/osI18n.ts` — EN/FR/DE hero strings (drop LB unless reinstated).
- AEO/SEO infra: `safeJsonLd.ts`, Organization + ProfessionalService JSON-LD (drop the WebApplication "Simulateur" schema; fix email/logo), FAQ/HowTo/Breadcrumb *generators* (swap grants content for agency FAQs from `llms-full.txt`), `robots.txt` (Content-Signals + per-bot allowlist), `llms.txt` + `llms-full.txt` (domain-fixed).
- `/api/contact`, `/api/newsletter`, notification fan-out (Telegram/webhook), `/api/blog` + `src/lib/blog.ts` MDX pipeline.
- Client logo PNGs in `public/clients/`.

**Kill:**
- Entire Aqua OS shell: `OpenletzOS.tsx`, `MacWindow.tsx`, `MenuBar.tsx`, `Dock.tsx`, `DesktopIcon.tsx`, `windows.tsx`, `aquaIcons.tsx`, `icons.tsx` Aqua furniture, `CrawlableContent.tsx`, `src/app/os/*` (incl. `os.css`), `apps/Sketch.tsx`, `apps/Snake.tsx`.
- Grants era: `src/app/[locale]/aides/*`, `src/lib/programs.ts`, `src/lib/eligibility.ts`, grant blog posts, simulator metadata, `/aides` redirects.
- AI-tools directory: `src/lib/agents.ts` (140KB), `src/app/[locale]/agents/*`, agent sitemap entries.
- Locale sprawl: `messages/{it,es,ru,ar,tr,uk,pt,lb}.json` and dead hreflang/og-locale maps (11 locales → keep 3: en/fr/de).
- GSAP stays installed but only the one set-piece uses it.
- Rewrite/delete `CLAUDE.md` (documents the old quiz/simulator app).
- Prune dead apex-domain redirects in `next.config.mjs`.

**Risks carried into the plan:** domain inversion correctness; indexed-legacy-URL 301 coverage (no soft-404s); preview-indexing guard portability; next-intl 4.x proxy.ts convention under Next 16; lead durability (serverless FS is ephemeral — Telegram/webhook is the real lead trail; confirm env vars).

---

## 11. Build phases

- **Phase 0 — Decisions & cleanup (unblock):** lock domain/locales (done in this spec); rename package from `forge-simulator`; delete the OS shell, grants routes, agents directory, the 8 surplus locales (keep en/fr/de); rewrite/delete `CLAUDE.md`; invert `next.config` redirects; prune dead redirects.
- **Phase 1 — Foundation:** port `osData.ts` → typed `src/data/*` (+ Zod); `<SectionRenderer>` + Server-Component section architecture; salvage AEO infra (swap grants content for agency FAQ, fix domain); collapse next-intl to en/fr/de with `setRequestLocale` + `generateStaticParams` everywhere; enable `cacheComponents`; self-host fonts; design tokens (palette + motion tokens); analytics (GA4/GTM via `next/script afterInteractive` + consent gate + `useReportWebVitals`).
- **Phase 2 — Homepage + MVP pages:** 9-section monochrome homepage (Direction A); live proof strip (cached ISR); `/work` grid + **Vins Fins** & **La Grocerie** essays with metric sidebars; `/about` (founder-forward + EU/AI-Act block); `/contact` wired to `/api/contact` + notifications; legal pages; motion system (Motion default, CSS reveals, tokens, prefers-reduced-motion); rebuild sitemap; **301s from all killed legacy URLs**.
- **Phase 3 — Conversion & growth:** `/services` standalone; `/pricing` (productized "from €X"); `/audit` AI-readiness lead magnet → enquiry; `/insights` + new posts; per-page Service/Offer + FAQPage + BreadcrumbList JSON-LD; view-transition gallery polish; testimonials.
- **Phase 4 — Verify & launch:** Core Web Vitals budget (LCP<2.0s, INP<200ms, CLS<0.1) via `@next/bundle-analyzer` + real-user reporting; test with `prefers-reduced-motion` ON; confirm H1/primary copy in static HTML (AI-crawler check); Google Rich Results test on all schemas; submit new sitemap to GSC; verify 301s resolve.

---

## 12. Assets needed from the owner (not blocking the plan)

1. Real **"from €X"** numbers for the 3 productized pricing tiers.
2. A real **founder headshot** (hero/about; current portrait is a placeholder silhouette).
3. **1–3 client testimonials** + defensible case-study **metrics** (Lighthouse before/after, indexed-pages growth from GSC, catalogue size, time-to-launch) for Vins Fins & La Grocerie.
4. Confirm notification **env vars** carry over (`TELEGRAM_BOT_TOKEN`/`CHAT_ID`, `NOTIFICATION_WEBHOOK_URL`, `ADMIN_TOKEN`).
5. The missing **`/openletz-logo.png`** (or approve repointing JSON-LD to `openletz.svg`).
6. HTTPS cert / DNS for **openletz.ai** on the host.

---

## 13. Out of scope (explicit)

- Re-litigating positioning, pillars, or the 45-agent benchmark (locked).
- The live AI demo hero (Direction B) — reserved as a possible post-launch upgrade, not in this plan.
- A generative/lattice brand motif (Direction C) — not used.
- Any accent color — monochrome at launch (single reserved token if revisited).
- LB, PT, and the 6 machine-translated locales (it/es/ru/ar/tr/uk) — keep only en/fr/de.
