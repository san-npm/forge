# OpenLetz — SEO / GEO / AEO Audit

**Date:** 2026-04-08
**Scope:** https://www.openletz.com (FR primary, 5+ langs deployed)
**Goal:** Increase organic traffic & sales (simulator submissions, expert calls, paid services)

---

## TL;DR — Top 10 priorities (ordered by impact ÷ effort)

1. **Ship real blog content.** /fr/blog renders an empty shell. This is the single biggest leak: 0 indexable articles = 0 long-tail traffic. Target 2 posts/week for 90 days.
2. **Fix sitemap ↔ hreflang mismatch.** Sitemap lists 5 langs, hreflang declares 11. Pick one set; mismatch confuses Google and burns crawl budget on 404/soft-404s.
3. **Thicken agent pages.** Each /agents/[slug] is ~400 words with no H2s, no pros/cons, no FAQ, no alternatives. Rebuild template → 1,200–1,800 words with structured sections + Product/Review + FAQPage schema.
4. **Add a programs hub.** /fr/aides/sme-package-digital, /fit-4-ai, etc. — one canonical pillar page per grant program with eligibility matrix, amounts, deadlines, examples. These are the highest commercial-intent queries you currently don't own.
5. **Publish llms.txt v2 + llms-full.txt.** Current llms.txt is OK but minimal. Add a long-form llms-full.txt with citable facts (program names, ceilings, %, eligibility rules, FAQs) — this is what GPT/Claude/Perplexity will quote.
6. **E-E-A-T signals.** Add named author bios (Clément + Bob), credentials, COMMIT MEDIA legal page, client logos, real testimonials with Schema Review markup.
7. **Local SEO.** Create Google Business Profile for COMMIT MEDIA (Luxembourg), add LocalBusiness schema with full NAP, embed Google Map on /contact, encourage reviews.
8. **Backlinks.** Pitch guest posts on Silicon Luxembourg, Paperjam, Luxinnovation blog; submit to startups.lu, House of Entrepreneurship resource pages, Made in Luxembourg directory.
9. **Conversion tracking + UTM hygiene.** GTM and GA4 are wired but I see no event taxonomy. Define `simulator_start`, `simulator_complete`, `expert_request`, `quote_request` and tie them to revenue.
10. **Core Web Vitals + image weight.** Homepage is 91 KB HTML which is fine, but no LCP/INP audit done. Run PageSpeed Insights on /fr and /fr/agents — fix any LCP > 2.5s.

---

## 1. Technical SEO

### What's already good
- ✅ Next.js SSR, fast TTFB (~200ms from Europe)
- ✅ Hreflang tags present (11 languages)
- ✅ Canonical tags present (`/fr` etc.)
- ✅ Sitemap.xml served, robots.txt clean
- ✅ JSON-LD: Organization, WebApplication, ProfessionalService, FAQPage, HowTo, Breadcrumb
- ✅ AI bot allowlist in robots.txt (GPTBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bytespider)
- ✅ OG tags + Twitter Card present
- ✅ GTM + GA4 installed

### Issues & fixes

| # | Issue | Severity | Fix |
|---|---|---|---|
| T1 | Sitemap declares 5 locales, hreflang declares 11 → soft-404 risk | High | Either generate routes for all 11 or trim hreflang to 5. Recommend: ship 5 cleanly (FR/EN/DE/LB/PT) + delete the others until translated. |
| T2 | `/fr/blog` returns 200 but body is empty (likely client-rendered or no posts) | Critical | SSR the blog index from MDX at build time. Verify with `curl -s .../fr/blog \| grep -i article`. |
| T3 | Canonical points to `/fr` but no `og:locale:alternate` for other langs | Medium | Add `og:locale:alternate` for each translated locale. |
| T4 | No `lastmod` precision in sitemap (uses `now`) | Low | Use git mtime per route so Google sees real freshness. |
| T5 | Missing `/llms-full.txt` long-form file | Medium | See section 3 below. |
| T6 | No structured data on individual blog posts | High when blog ships | Add `Article` + `BreadcrumbList` JSON-LD per post. |
| T7 | No 404 page UX or soft-404 monitoring | Low | Add a styled 404 with internal links. |
| T8 | Google Search Console verification commented out in layout.tsx | High | Add the verification meta + verify in GSC + Bing Webmaster + IndexNow. |
| T9 | No image optimization audit | Medium | Confirm `next/image` used everywhere; add explicit `width`/`height`; serve AVIF. |
| T10 | No security headers audit (CSP, HSTS, X-Frame-Options) | Low for SEO, high for trust | Add via `next.config.js` headers. |

### Crawl budget
- Site is small (~50 URLs incl. agents × 5 langs) — crawl budget is not currently a bottleneck. Will become one once blog scales past ~500 posts × 5 langs = 2,500 URLs. Plan pagination + `noindex` on filter pages now.

---

## 2. On-page SEO — content audit

### Homepage `/fr`
- **Title:** Strong, includes primary keyword stack ("Aides Digitalisation & IA Luxembourg | Subventions PME"). 71 chars — within limits.
- **Meta description:** Good — has the offer ("jusqu'à 25 000 €"), the time-to-value ("10 secondes"), and program names. Could add a CTA verb: "Testez en 10 sec."
- **H1:** "Digitalisez votre PME grâce aux aides luxembourgeoises" — solid, keyword-rich, action verb.
- **Word count:** ~800–1,000 — acceptable for a SaaS landing page but thin vs. competitors' pillar pages.
- **Internal linking:** Top nav covers main sections but body copy doesn't link to program detail pages (because they don't exist yet — see Recommendation R1).

**Fixes:**
- Add a "Programmes analysés" section with one card per grant linking to `/fr/aides/[program-slug]`.
- Add a comparison table: program × max amount × % couverture × éligibilité × délai → very citable by AI engines.
- Add a "Questions fréquentes" accordion (8–12 Q&As) wrapped in `FAQPage` schema (already declared, but make sure questions match real Google "People Also Ask" data).

### Agents directory `/fr/agents`
- 33 tools, 6 categories — good breadth.
- Each card: name, 1-sentence description, tags, GDPR badge, link to detail page.
- **Problem:** zero unique copy per category. No category landing pages → losing queries like "meilleur outil IA contenu RGPD Luxembourg".

**Fixes:**
- Add 200–400 word intros per category page: `/fr/agents/categorie/assistants`, `/contenu`, etc.
- Add a "Comparison table" view (sortable by price, GDPR, EU hosting).
- Add structured `ItemList` JSON-LD on the directory page.

### Agent detail pages `/fr/agents/[slug]`
- ~400 words, no H2s, no FAQ, no pros/cons, no alternatives section, no screenshots.
- **This is your highest-leverage rewrite.** These pages can rank for "[tool] avis", "[tool] RGPD", "[tool] alternative Luxembourg".

**New template (target 1,200–1,800 words):**
1. H1: `<Tool> — Avis, prix et conformité RGPD pour PME Luxembourg`
2. TL;DR box (3 bullets) — citable by AI
3. H2: À quoi sert <Tool> (200 words)
4. H2: Fonctionnalités clés (bullet list)
5. H2: Tarifs détaillés (table)
6. H2: Conformité RGPD & EU AI Act (your differentiator)
7. H2: Avantages / Limites (pros/cons table)
8. H2: Alternatives (3–5 internal links to other agents)
9. H2: Cas d'usage pour PME luxembourgeoises (3 mini case studies)
10. H2: FAQ (6–10 questions, schema'd)
11. CTA: "Quelle aide finance <Tool> ?" → simulator

Schema: `Product` + `Review` + `AggregateRating` (when you have reviews) + `FAQPage`.

### Blog `/fr/blog`
- **Currently empty** — biggest single SEO failure on the site.
- 90-day content sprint plan (24 posts):

**Pillar posts (long-form, 2,000+ words, target featured snippets):**
1. SME Package Digital Luxembourg : guide complet 2026
2. Fit 4 AI Luxembourg : éligibilité, montants, dossier
3. Toutes les aides à la digitalisation au Luxembourg en 2026
4. Comment monter un dossier Luxinnovation : étapes & pièges
5. Aides PME Luxembourg vs Belgique vs France : comparatif

**Cluster posts (800–1,200 words, internal-link to pillars):**
- "Combien de temps pour obtenir une aide Fit 4 Digital ?"
- "Quels documents pour le SME Package Digital ?"
- "Aides IA pour artisans luxembourgeois"
- "TVA et subventions Luxembourg : ce qu'il faut savoir"
- "Refus Luxinnovation : que faire ?"
- "ROI d'un site e-commerce financé par l'État"
- ... etc.

**Topical authority moves:**
- Interview Bob + a real PME beneficiary
- Republish official program data with your simulator embedded
- Create a "Luxinnovation glossary" (50 terms, alphabetical, schemed as `DefinedTerm`)

---

## 3. GEO / AEO — Generative & Answer Engine Optimization

This is where you can leapfrog competitors who haven't woken up to it yet.

### What you've done well
- AI bots allowlisted ✅
- llms.txt published ✅
- FAQPage + HowTo schemas already present ✅

### What's missing

**G1. llms-full.txt**
Create `/llms-full.txt` (5–10 KB markdown) containing:
- Every grant program: name, amount, %, eligible companies, application process, link to official source
- Pricing for your services
- 20–30 FAQs with answers
- Glossary of terms
- Citable stats ("X Luxembourg PMEs received Y in 2024")

This is what Claude/GPT/Perplexity will preferentially ingest when answering "aides digitalisation Luxembourg PME".

**G2. Citable, atomic facts**
AI engines cite content that has:
- A clear stat in the first 50 words
- An attribution to a primary source (luxinnovation.lu, guichet.lu)
- A direct answer to a question (no fluff intros)

Audit every page → add a "Fast Facts" or "TL;DR" box at the top of every blog post and agent page.

**G3. Named entities**
Make sure every page mentions: COMMIT MEDIA SARL, RCS B276192, House of Entrepreneurship, Luxinnovation, Ministère de l'Économie, Chambre des Métiers, Chambre de Commerce. AI engines build entity graphs — explicit naming wins citations.

**G4. Schema for AI consumption**
Beyond what you have, add:
- `Dataset` schema for the agents directory (so it's discoverable as a structured resource)
- `Service` schema for Bob's expert callback (with `areaServed`, `priceRange`)
- `GovernmentService` references for each grant program (linking to the official URL via `sameAs`)

**G5. Factual freshness**
AI engines down-rank stale content. Add a visible "Mis à jour le DD/MM/YYYY" date on every grant page and refresh quarterly. Tie it to `dateModified` in JSON-LD.

**G6. Get cited externally**
The fastest GEO win is being mentioned on Wikipedia, news sites, and government pages. Specifically:
- Add OpenLetz to the French Wikipedia "Économie du Luxembourg" page as an external resource (subject to notability)
- Email House of Entrepreneurship asking to be listed as an "outil partenaire"
- Get featured on Silicon Luxembourg, Paperjam Tech, RTL Today

**G7. ChatGPT/Perplexity testing protocol**
Weekly: ask each engine "quelles aides digitalisation Luxembourg PME 2026 ?" and log:
- Are you cited?
- What rank?
- What source did they prefer?
- What facts did they pull?

Use this to drive content updates. I can wire a weekly cron that does this and posts to Telegram.

---

## 4. International SEO

You declare 11 languages but only ship 5. Pick a strategy:

**Option A — Stay focused (recommended):**
- Ship FR (primary), EN, DE, LB, PT
- Trim hreflang in `<head>` to those 5
- Delete IT, ES, RU, AR, TR, UK from declarations

**Option B — Go wide:**
- Auto-translate the missing 6 with DeepL via build script
- Mark each translated page with `Translation` schema and a "Translated from French" notice
- Risk: thin/duplicate content penalties unless you add unique localized stats per market

I recommend A for now. PT is interesting because of the Portuguese-speaking workforce in Luxembourg construction/hospitality — a real underserved audience.

**Per-locale tweaks:**
- DE: target "Förderprogramme Luxemburg KMU Digitalisierung" — currently in keywords but no DE landing page intro acknowledges the cross-border German workforce
- LB: even a thin Luxembourgish version is a huge trust signal locally
- EN: target expat founders + cross-border consultants

---

## 5. Conversion / commercial SEO

Traffic without conversion is vanity. Audit:

**C1. Funnel events**
GA4 is installed but I see no custom events declared. Add:
- `simulator_start` (quiz Q1 viewed)
- `simulator_step_2..6`
- `simulator_complete` (results page)
- `expert_request` (form submit)
- `newsletter_signup`
- `quote_request` (services page)
- `agent_outbound` (clicked external "visit" button)

Tie `simulator_complete` to estimated value (e.g., €50 lead value) for ROAS calculations.

**C2. CTA hierarchy**
Currently "Estimer mes aides" + "Parler à un expert" compete equally. A/B test: make simulator the only primary CTA above the fold; demote expert call to a secondary in-page band after the simulator.

**C3. Pricing page**
Not audited in depth — but if it converts <2%, the issue is usually missing social proof + missing FAQ. Add 3 testimonials with schema, 8 FAQs, and a money-back guarantee.

**C4. Lead magnets**
Offer a downloadable PDF: "Le guide 2026 des aides PME Luxembourg" gated by email. Becomes a 1,500-word indexable landing page + a list-building machine.

---

## 6. Off-page SEO / Link building

Targeted Luxembourg backlinks (priority order):

1. **Government / institutional** (highest authority):
   - Luxinnovation resource page
   - guichet.lu partner section
   - House of Entrepreneurship "outils utiles"
   - Chambre des Métiers digital toolkit
2. **Press**:
   - Silicon Luxembourg (pitch: "We built a free simulator for SME grants — usage stats")
   - Paperjam Tech (data story: "X% of LU SMEs don't claim grants they qualify for")
   - RTL Today (English-language angle)
3. **Directories**:
   - Made in Luxembourg
   - Startups.lu
   - Luxembourg for Finance (if angle)
4. **Communities**:
   - r/Luxembourg, r/Luxembourg_business
   - LinkedIn groups (Luxembourg Entrepreneurs, Tech.lu)
5. **Partnerships**:
   - Cross-link with accountants/fiduciaries who recommend you to clients
   - Affiliate-style backlinks from the AI tools you list (some will link back to "as featured on")

Track via Ahrefs or a weekly cron pulling fresh backlink data.

---

## 7. Quick wins (do this week)

- [ ] Verify Google Search Console + Bing Webmaster + submit sitemap
- [ ] Trim hreflang to match sitemap (5 langs)
- [ ] SSR the blog index OR temporarily `noindex` `/blog` until content ships
- [ ] Publish 2 pillar blog posts (SME Package Digital + Fit 4 AI)
- [ ] Create `/llms-full.txt` with all program facts
- [ ] Add custom GA4 events for the funnel
- [ ] Add Google Business Profile for COMMIT MEDIA Luxembourg
- [ ] Run PageSpeed Insights on `/fr`, `/fr/agents`, `/fr/blog` and fix anything red

## 8. 90-day roadmap

**Weeks 1–2:** Quick wins above + agent page template rewrite + first 4 blog posts
**Weeks 3–6:** 12 more blog posts + program pillar pages (`/fr/aides/[slug]`) + LocalBusiness schema + GBP
**Weeks 7–10:** Backlink outreach (10 pitches/week) + lead magnet PDF + pricing page CRO
**Weeks 11–12:** Measure, double down on what worked, plan Q3

---

## 9. Measurement plan

**KPIs (track weekly in a Notion or Sheets dashboard):**
- Organic sessions (GA4, segmented by lang)
- Keyword rankings (top 20 Luxembourg-grant queries) — use Ahrefs or Semrush
- AI engine citations (manual + cron) — appearance in Perplexity/ChatGPT/Claude answers
- Simulator completions
- Expert callback requests
- Backlinks acquired
- Indexed page count (GSC)

**Targets at day 90:**
- 5,000 organic sessions/month (vs ~baseline TBD)
- 200 simulator completions/month
- 30 expert callback requests/month
- 25 referring domains (vs ~baseline TBD)
- Top 10 in Google for "aides digitalisation PME Luxembourg" + 5 long-tail queries
- Cited in at least 1 of (Perplexity / ChatGPT / Claude) for "aides PME Luxembourg digitalisation"

---

*Audit by Claude, 2026-04-08. Saved at `forge/SEO-AUDIT-2026-04.md`. Ping for any section to be expanded into an actionable ticket list.*
