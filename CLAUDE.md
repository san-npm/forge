# CLAUDE.md — Forge Simulator

## Project Overview

Forge (`forge-simulator`) is a bilingual (French/English) Next.js web application that helps Luxembourg-based SMEs simulate their eligibility for government digital transformation and AI innovation funding programs. Users complete an 8-question quiz, and the app recommends eligible programs with estimated grant amounts and project suggestions.

## Tech Stack

- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript 5.7 (strict mode)
- **UI:** React 18, Tailwind CSS 3.4
- **Build tooling:** PostCSS + Autoprefixer
- **No backend** — fully client-side application

## Repository Structure

```
src/
├── app/
│   ├── layout.tsx          # Root HTML layout (lang=fr, meta tags)
│   ├── page.tsx            # Main entry — screen state machine & app orchestration
│   └── globals.css         # Tailwind directives + custom animations
├── components/
│   ├── Navbar.tsx           # Fixed nav bar with FR/EN language toggle
│   ├── LandingPage.tsx      # Hero section, stats, trust badges
│   ├── Quiz.tsx             # 8-question multi-step quiz
│   ├── Results.tsx          # Eligible programs, project recommendations, cost comparison
│   └── AgentContact.tsx     # AI chat interface + contact callback form
├── context/
│   └── LanguageContext.tsx   # React Context for i18n (149+ translation keys, FR/EN)
└── lib/
    └── eligibility.ts       # Core business logic: eligibility engine + chatbot responses
```

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint via Next.js preset
```

There is no test suite configured. No CI/CD pipeline exists.

## Architecture

### Screen Flow

The app is a single-page client-side application with four screens managed by state in `src/app/page.tsx`:

```
Landing → Quiz (8 questions) → Results → Agent Contact
```

Screen transitions use `useState<'landing' | 'quiz' | 'results' | 'agent'>`.

### Internationalization

All user-facing text lives in `src/context/LanguageContext.tsx` as a `translations` dictionary keyed by dot-notation strings (e.g., `'hero.title'`, `'q1.o2'`). Use the `useLanguage()` hook to access `t(key)` for translations and `lang`/`setLang` for the current language. Default language is French.

When adding new UI text, add both `fr` and `en` entries to the `translations` object in `LanguageContext.tsx` — never hardcode strings in components.

### Eligibility Logic

`src/lib/eligibility.ts` contains two pure functions:

- **`computeEligibility(answers: QuizAnswers)`** — Determines eligible programs (up to 5) and generates project recommendations based on company size, sector, digital maturity, and stated problems. Base eligibility requires Luxembourg HQ + business permit.
- **`getAgentResponse(question: string, lang: string)`** — Keyword-matching chatbot that returns canned responses in FR/EN for eligibility, duration, cost, and Luxinnovation topics.

### Component Communication

Components receive callbacks via props (`onStart`, `onComplete`, `onBack`, `onNext`). State flows down from `page.tsx`. All components use `'use client'` directive.

## Key Conventions

- **Path aliases:** Use `@/` to import from `src/` (e.g., `import { useLanguage } from '@/context/LanguageContext'`)
- **Styling:** Tailwind utility classes only. Custom theme colors are `primary` (blue) and `accent` (purple) defined in `tailwind.config.js`. Custom animations (`fadeIn`, `slideUp`, `slideInRight`, `slideInLeft`) are defined in `globals.css`.
- **Type safety:** All component props have explicit TypeScript interfaces. Business logic types (`QuizAnswers`, `Program`, `ProjectRecommendation`) are exported from `eligibility.ts`.
- **Bilingual content:** Program names/descriptions use `Record<string, string>` with `fr`/`en` keys. UI strings use the `t()` translation function.
- **Client-side only:** Every component file starts with `'use client'`. There are no server components, API routes, or server actions.

## Funding Programs

The eligibility engine evaluates five programs:

| Program ID       | Name              | Max Grant | Coverage |
|------------------|-------------------|-----------|----------|
| `sme-digital`    | SME Package Digital | €5,000   | 50%      |
| `sme-ai`         | SME Package AI      | €17,500  | 70%      |
| `fit4digital`    | Fit 4 Digital       | €12,000  | 60%      |
| `fit4ai`         | Fit 4 AI            | €25,000  | 70%      |
| `fit4innovation` | Fit 4 Innovation    | €15,000  | 50%      |
