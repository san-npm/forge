# CLAUDE.md — Forge Simulator

## Project Overview

Forge (`forge-simulator`) is a multilingual (FR/EN/LB/DE/IT/PT) Next.js web application that helps Luxembourg-based SMEs simulate their eligibility for government digital transformation and AI innovation funding programs. Users complete a 6-question quiz, and the app recommends eligible programs with estimated grant amounts and project suggestions.

## Tech Stack

- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript 5.7 (strict mode)
- **UI:** React 18, Tailwind CSS 3.4
- **AI Agent:** Claude API via `@anthropic-ai/sdk`
- **Blog:** MDX files parsed with `gray-matter`
- **Build tooling:** PostCSS + Autoprefixer

## Repository Structure

```
src/
├── app/
│   ├── layout.tsx              # Root HTML layout (meta tags)
│   ├── page.tsx                # Main entry — screen state machine & app orchestration
│   ├── globals.css             # Tailwind directives + custom animations
│   └── api/
│       ├── chat/route.ts       # Claude API chatbot endpoint
│       ├── contact/route.ts    # Contact form → data/contacts.json
│       ├── newsletter/route.ts # Newsletter → data/newsletter.json
│       └── blog/route.ts       # Serves blog posts from content/blog/
├── components/
│   ├── Navbar.tsx              # Fixed nav bar with 6-language dropdown + blog link
│   ├── LandingPage.tsx         # Hero section, stats, trust badges
│   ├── Quiz.tsx                # 6-question multi-step quiz
│   ├── Results.tsx             # Eligible programs, project recs, newsletter subscription
│   ├── AgentContact.tsx        # Claude-powered chat + contact form (saves to API)
│   └── Blog.tsx                # Blog listing & article reader
├── context/
│   └── LanguageContext.tsx      # React Context for i18n (6 languages, 100+ keys)
└── lib/
    ├── eligibility.ts          # Core business logic: eligibility engine
    └── blog.ts                 # Server-side blog post reader (gray-matter + fs)
content/
└── blog/                       # MDX blog posts with multilingual frontmatter
data/                           # Runtime data (gitignored JSON files)
```

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint via Next.js preset
```

There is no test suite configured. No CI/CD pipeline exists.

## Environment Variables

Copy `.env.example` to `.env.local` and set:

```
ANTHROPIC_API_KEY=sk-ant-...   # Required for AI chat agent
```

## Architecture

### Screen Flow

The app is a single-page application with five screens managed by state in `src/app/page.tsx`:

```
Landing → Quiz (6 questions) → Results → Agent Contact
                                              ↕
                                            Blog
```

Screen transitions use `useState<'landing' | 'quiz' | 'results' | 'agent' | 'blog'>`. The Navbar provides navigation to Simulator (landing), Blog, and Contact (agent).

### Internationalization

Six languages are supported: French (default), English, Luxembourgish, German, Italian, Portuguese.

All user-facing text lives in `src/context/LanguageContext.tsx` as a `translations` dictionary keyed by dot-notation strings (e.g., `'hero.title'`, `'q1.o2'`). The `Language` type is `'fr' | 'en' | 'lb' | 'de' | 'it' | 'pt'`.

Use the `useLanguage()` hook to access `t(key)` for translations, `lang` for current language, and `setLang()` to switch.

When adding new UI text, add entries for **all 6 languages** in the `translations` object — never hardcode strings in components.

### Quiz (6 Questions)

The quiz collects `QuizAnswers` with these fields:
1. `companySize` — solo, 1-10, 11-50, 51-250, 250+
2. `sector` — horeca, retail, crafts, services, manufacturing, wine-agriculture, other
3. `luxembourgStatus` — yes-both, yes-no-permit, no (merged HQ + business permit)
4. `digitalMaturity` — nothing, basic-site, site-social, management-tools
5. `biggestProblem` — find-clients, manage-admin, communicate, save-time, other
6. `aiUsage` — never, a-little, regularly

### Eligibility Logic

`src/lib/eligibility.ts` exports `computeEligibility(answers)` which returns eligible programs and project recommendations. Base eligibility requires `luxembourgStatus !== 'no'`.

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/chat` | POST | Sends user message + history to Claude API, returns response |
| `/api/contact` | POST | Saves contact form data to `data/contacts.json` |
| `/api/newsletter` | POST | Saves email to `data/newsletter.json` (deduplicates) |
| `/api/blog` | GET | Returns all blog posts parsed from `content/blog/*.mdx` |

### Blog

Blog posts are MDX files in `content/blog/` with multilingual frontmatter (title, excerpt in all 6 languages). The `Blog.tsx` component fetches posts via `/api/blog` and renders them client-side. Content is written in French (primary market language).

### Component Communication

Components receive callbacks via props (`onStart`, `onComplete`, `onBack`, `onNext`, `onNavigate`). State flows down from `page.tsx`. All component files use `'use client'` directive. API routes are server-side.

## Key Conventions

- **Path aliases:** Use `@/` to import from `src/` (e.g., `import { useLanguage } from '@/context/LanguageContext'`)
- **Styling:** Tailwind utility classes only. Custom theme colors are `primary` (blue) and `accent` (purple) defined in `tailwind.config.js`. Custom animations (`fadeIn`, `slideUp`, `slideInRight`, `slideInLeft`) are defined in `globals.css`.
- **Type safety:** All component props have explicit TypeScript interfaces. Business logic types (`QuizAnswers`, `Program`, `ProjectRecommendation`) are exported from `eligibility.ts`.
- **Multilingual content:** Program names/descriptions use `Record<string, string>` with language keys. UI strings use the `t()` translation function. Components fall back to French (`[lang] || .fr`) for content records.
- **Client components** use `'use client'`. API routes are server-side and can use Node.js APIs (fs, path).

## Funding Programs

The eligibility engine evaluates five programs:

| Program ID       | Name              | Max Grant | Coverage |
|------------------|-------------------|-----------|----------|
| `sme-digital`    | SME Package Digital | €5,000   | 50%      |
| `sme-ai`         | SME Package AI      | €17,500  | 70%      |
| `fit4digital`    | Fit 4 Digital       | €12,000  | 60%      |
| `fit4ai`         | Fit 4 AI            | €25,000  | 70%      |
| `fit4innovation` | Fit 4 Innovation    | €15,000  | 50%      |
