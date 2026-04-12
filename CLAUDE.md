# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (usually http://localhost:3000)
npm run build    # production build — run this to catch TS and SSG errors before shipping
npm run lint     # ESLint
npm run start    # serve production build
```

There are no tests. `npm run build` is the primary correctness check.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| i18n | next-intl 4 |
| Animation | GSAP 3 + ScrollTrigger |
| 3D | Three.js |
| Card tilt | vanilla-tilt |

## Critical: Next.js 16 breaking changes

`middleware.ts` is **deprecated** — use `src/proxy.ts` instead. The exported function must be named `proxy` (not `default`). The project already uses this convention. Do not create or restore `middleware.ts`.

`params` in layouts and pages is a **Promise** — always `await params` before destructuring:
```ts
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
}
```

## Tailwind CSS v4 — no config file

Tailwind v4 is configured entirely in CSS, not in `tailwind.config.ts`. All design tokens live in `src/app/globals.css` under `@theme`. To add a new color or token, add it there:

```css
@theme {
  --color-my-new-token: #value;
}
```

Tokens are then available as Tailwind utilities: `bg-my-new-token`, `text-my-new-token`, etc.

### Design tokens (defined in `globals.css`)

**Backgrounds:** `bg-bg` `bg-surface` `bg-surface-2` `bg-surface-3`  
**Borders:** `border-border` `border-border-bright`  
**Text:** `text-text` `text-text-secondary` `text-text-muted`  
**Brand:** `bg-ignis` `text-ignis` `bg-ignis-dim` `bg-ignis-glow` `bg-ignis-red` `bg-ember` `bg-gold`  
**CSS utilities (class-based):** `.text-gradient-ignis` `.text-gradient-fire` `.glow-ignis` `.glow-ignis-sm` `.border-ignis-gradient` `.font-display`

**Fonts:** Space Grotesk (`font-display`, headings) + Geist Sans (body) + Geist Mono. Font CSS variables are `--font-space-grotesk`, `--font-geist-sans`, `--font-geist-mono`, set as className on `<html>` in the locale layout.

## i18n architecture

All routes live under `src/app/[locale]/`. The root `src/app/layout.tsx` is a minimal pass-through (`return children`) — the actual `<html>` and `<body>` tags are in `src/app/[locale]/layout.tsx`.

The three i18n files:
- `src/i18n/routing.ts` — single source of truth for locales (`['en', 'bg', 'de']`) and `defaultLocale`
- `src/i18n/request.ts` — server config, loaded by next-intl plugin via `next.config.ts`
- `src/i18n/navigation.ts` — exports locale-aware `Link`, `useRouter`, `usePathname`, `redirect` — **always import these instead of `next/navigation` equivalents**

Translation files: `src/messages/{en,bg,de}.json`. Every key added to one file must be added to all three.

Every server component or layout that receives `params` must call `setRequestLocale(locale)` before any other next-intl calls. Every new locale route segment needs `generateStaticParams` returning `routing.locales.map(locale => ({ locale }))`.

## Component conventions

All section components live in `src/components/sections/`. They are `'use client'` components (GSAP, Three.js, and vanilla-tilt all require the browser). Translations are accessed via `useTranslations('namespace')` from `next-intl`.

**GSAP pattern used throughout:** wrap all GSAP calls in `gsap.context(() => { ... }, containerRef)` and return `() => ctx.revert()` from `useEffect` for cleanup. Register plugins at module level (`gsap.registerPlugin(ScrollTrigger)`).

**vanilla-tilt pattern:** call `VanillaTilt.init(el, options)` in `useEffect`, destroy via `el.vanillaTilt?.destroy()` in the cleanup. The `@types/vanilla-tilt` package is installed.

**Three.js pattern (Hero):** uses an `OrthographicCamera` sized to canvas pixel dimensions so DOM coordinates map 1:1 to Three.js world space. Custom geometry attributes must not use the name `color` — it conflicts with a Three.js built-in; use `particleColor` or similar instead. Cleanup: `cancelAnimationFrame`, `renderer.dispose()`, `geo.dispose()`, `mat.dispose()`.

Add the following sections to CLAUDE.md:

## Build approach
- Always build one section at a time. Never scaffold the entire page at once.
- After completing each section, run `npm run build` to catch TypeScript and SSG errors before moving on.
- Maintain a TODO.md in the project root. After every completed task, mark it done and add the next pending items.

## Design principles
- Dark theme only. Base colors: deep blacks and dark grays.
- Brand accent: fire palette — ignis orange, ember red, molten gold.
- Quality bar: Awwwards level. Never generic AI-looking output.
- Every section must have scroll-triggered entrance animations via GSAP ScrollTrigger.
- Interactive elements (cards, buttons) should have micro-interactions.

## Code conventions
- No inline comments unless the logic is genuinely complex.
- Named exports for all components.
- Never put business logic inside page files — extract to components.
- Images go in /public/images, organized by section.

## Agency context
- This is a portfolio/agency site for Ignis Web Development Studio.
- Services: Landing Pages, Business Websites, Web Apps.
- Target clients: small businesses in Western Europe and English-speaking markets.
- Always write copy that converts, not copy that sounds polite.