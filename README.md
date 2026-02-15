# Forge Simulator

Forge (`forge-simulator`) is a multilingual (FR/EN/LB/DE/IT/PT) Next.js web application that helps Luxembourg-based SMEs simulate their eligibility for government digital transformation and AI innovation funding programs. Users complete a 6-question quiz, and the app recommends eligible programs with estimated grant amounts and project suggestions.

## Features

- **Eligibility Simulator** -- 6-question quiz that evaluates eligibility for 5 Luxembourg grant programs (up to 25,000 EUR, 70% coverage)
- **AI Agents Directory** -- Curated directory of 18 AI tools with individual detail pages and EU regulatory compliance data (GDPR, EU AI Act, data residency, DPA, certifications)
- **Multilingual** -- Full support for 6 languages: French, English, Luxembourgish, German, Italian, Portuguese
- **Report Download** -- Downloadable eligibility report with program details and cost breakdowns
- **Blog** -- MDX-based multilingual blog with articles about Luxembourg grants and digital transformation
- **Contact** -- Expert callback request form

## Tech Stack

- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript 5.7 (strict mode)
- **UI:** React 18, Tailwind CSS 3.4
- **Blog:** MDX files parsed with `gray-matter`
- **Build tooling:** PostCSS + Autoprefixer

## Getting Started

```bash
npm install
npm run dev      # Start development server (localhost:3000)
```

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint via Next.js preset
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Providers wrapper
│   ├── page.tsx                # Main SPA (landing, quiz, results, contact, blog, directory)
│   ├── providers.tsx           # Client-side LanguageProvider wrapper
│   ├── globals.css             # Tailwind directives + custom animations
│   ├── agents/
│   │   ├── page.tsx            # AI Agents directory listing (standalone route)
│   │   └── [slug]/page.tsx     # Individual agent detail page with EU compliance
│   ├── about/page.tsx          # About Forge
│   ├── pricing/page.tsx        # Forge service pricing + AI tools pricing comparison
│   ├── privacy/page.tsx        # Privacy policy (GDPR-compliant)
│   ├── terms/page.tsx          # Terms of service
│   └── api/
│       ├── contact/route.ts    # Contact form -> data/contacts.json
│       ├── newsletter/route.ts # Newsletter -> data/newsletter.json
│       └── blog/route.ts       # Serves blog posts from content/blog/
├── components/
│   ├── Navbar.tsx              # SPA navigation bar (state-based)
│   ├── PageNavbar.tsx          # Standalone page navigation (Next.js Link-based)
│   ├── Footer.tsx              # Shared footer for standalone pages
│   ├── LandingPage.tsx         # Hero section, stats, trust badges
│   ├── Quiz.tsx                # 6-question multi-step quiz
│   ├── Results.tsx             # Eligible programs, cost comparison, report download
│   ├── AgentContact.tsx        # Contact form
│   ├── Directory.tsx           # AI Agents directory (SPA version)
│   └── Blog.tsx                # Blog listing & article reader
├── context/
│   └── LanguageContext.tsx      # React Context for i18n (6 languages, 200+ keys)
└── lib/
    ├── eligibility.ts          # Core business logic: eligibility engine
    ├── agents.ts               # AI agents data with EU compliance information
    └── blog.ts                 # Server-side blog post reader
content/
└── blog/                       # MDX blog posts with multilingual frontmatter
data/                           # Runtime data (gitignored JSON files)
```

## Architecture

### Routing

The app uses a hybrid routing approach:

- **SPA flow** (`/`): Landing page, quiz, results, contact, blog, and directory are managed by client-side state in `page.tsx`
- **Standalone routes**: `/agents`, `/agents/[slug]`, `/about`, `/pricing`, `/privacy`, `/terms` use Next.js App Router pages with `PageNavbar` and `Footer`

### Internationalization

Six languages supported: French (default), English, Luxembourgish, German, Italian, Portuguese.

All UI text lives in `src/context/LanguageContext.tsx` as a `translations` dictionary. Use `useLanguage()` hook to access `t(key)`, `lang`, and `setLang()`.

### Funding Programs

| Program | Max Grant | Coverage |
|---------|-----------|----------|
| SME Package Digital | 5,000 EUR | 50% |
| SME Package AI | 17,500 EUR | 70% |
| Fit 4 Digital | 12,000 EUR | 60% |
| Fit 4 AI | 25,000 EUR | 70% |
| Fit 4 Innovation | 15,000 EUR | 50% |

### AI Agents & EU Compliance

The directory (`src/lib/agents.ts`) contains 18 AI tools with detailed EU regulatory compliance data:

- **GDPR compliance** status (compliant / partial / non-compliant)
- **EU AI Act** readiness
- **EU data residency** availability
- **DPA** (Data Processing Agreement) availability
- **Security certifications** (SOC 2, ISO 27001, etc.)
- **Compliance notes** per agent in all 6 languages

### Cost Calculation

The eligibility engine (`src/lib/eligibility.ts`) computes costs based on:

1. **Company profile** (size, sector, digital maturity, AI usage)
2. **Program matching** -- which of the 5 programs the company qualifies for
3. **Project recommendations** -- tailored to the company's biggest challenge and sector
4. **Grant coverage** -- `grantCoverage = estimatedCost * coveragePercent` (capped at program max)
5. **You pay** -- `youPay = estimatedCost - grantCoverage`

### Detailed Report

The Results page generates a downloadable report containing:
- List of eligible programs with grant amounts and coverage percentages
- Recommended projects with estimated costs, grant coverage, and amount to pay
- Total cost comparison (with vs without grants) and total savings

## Key Conventions

- **Path aliases:** `@/` imports from `src/`
- **Styling:** Tailwind CSS only. Custom colors: `primary` (blue) and `accent` (purple)
- **Client components:** All `.tsx` use `'use client'`. API routes are server-side.
- **Multilingual content:** Use `t()` for UI strings, `Record<string, string>` for data
