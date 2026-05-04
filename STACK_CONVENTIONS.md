# STACK_CONVENTIONS.md

How we build client projects at Ignis-MLS. This is the forward-looking
reference — read it before starting a new project, follow it during, hand it
to clients on delivery.

For where the current `ignis-mls.com` repo deviates from this doc, see
`CODEBASE_AUDIT.md`. For the actions to bring it into compliance, see
`TODO.md`.

---

## 1. Project Setup

**Framework.** Next.js, App Router. New projects pin to the version used by ignis-mls.com at project start (currently Next 16). Major version bumps happen on internal tools first, then propagate to the next client project — never mid-project. React version follows whatever Next ships with. We don't pin React independently or upgrade it ahead of Next. Turbopack is the default dev/build engine — no extra flags needed.

**TypeScript.** TypeScript 5+ with `strict: true`. The path alias
`@/*` → `./src/*` is mandatory; never use `../../` for internal imports.
`noEmit: true`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`.

**Package manager.** npm. `package-lock.json` is committed.

**Node.** Pinned via `.nvmrc` and an `engines` field in `package.json`.

**Scripts.** `dev`, `build`, `start`, `lint` only. `npm run build` is the
correctness check for marketing sites (no test suite required); web apps
add `test`.

---

## 2. Folder Structure

The convention is **where things go**, not what the tree looks like.

| Kind                                | Location                                                    |
| ----------------------------------- | ----------------------------------------------------------- |
| Page route                          | `src/app/[locale]/<route>/page.tsx`                         |
| Homepage section                    | `src/components/sections/<Name>.tsx`                        |
| Section-private subcomponent        | `src/components/sections/<name>/<Sub>.tsx`                  |
| Section-private types               | `src/components/sections/<name>/types.ts`                   |
| Shared layout chrome                | `src/components/<Name>.tsx` (Navbar, Footer)                |
| Shared UI / cross-cutting providers | `src/components/ui/`                                        |
| SEO helpers                         | `src/components/seo/`                                       |
| Static long-form content            | `src/content/<area>/<slug>.<locale>.ts` (or `.md`/`.mdx`)   |
| API route handler                   | `src/app/api/<name>/route.ts(x)`                            |
| Reusable hooks                      | `src/hooks/`                                                |
| Cross-cutting helpers               | `src/lib/`                                                  |
| Shared constants                    | `src/constants/`                                            |
| i18n config                         | `src/i18n/`                                                 |
| Translations                        | `src/messages/<locale>.json`                                |
| Static assets                       | `public/images/<section>/<project>/...`                     |

### Required app-router files per locale tree

Every client project must have, at minimum, under `src/app/[locale]/`:

- `layout.tsx` — locale-aware `<html>` / `<body>`, font setup, i18n provider
- `page.tsx` — homepage
- `error.tsx` — locale-level error boundary
- `not-found.tsx` — branded 404
- `loading.tsx` — loading state for slow segments

And at the app root:

- `src/app/layout.tsx` — minimal pass-through (`return children`)
- `src/app/page.tsx` — `redirect()` to the default locale
- `src/app/sitemap.ts`
- `src/app/robots.ts`

---

## 3. Naming Conventions

**Files.**
- Components: `PascalCase.tsx`.
- Subdirectories holding section-private code: `kebab-case/`.
- Route segments: `kebab-case/`.
- App-router specials: Next.js conventions (`page.tsx`, `layout.tsx`,
  `route.ts(x)`, `sitemap.ts`, `robots.ts`).
- Locale JSON: `<locale>.json`.
- Static content: `<slug>.<locale>.ts`.

**Components.** `PascalCase` function names matching the file. **Named
exports only** — no default exports for components.

**API routes.** HTTP-method-named exports inside `route.ts(x)`
(`export async function POST(...)`). Edge runtime opted in per-route:
`export const runtime = 'edge'`.

**Variables.**
- Module-scope config arrays / lookup maps: `SCREAMING_SNAKE_CASE`.
- Locals and function params: `camelCase`.
- Types and interfaces: `PascalCase`.

**Translation hooks.** Single-namespace components use `t`. Multi-namespace
components alias each: `const tn = useTranslations('nav')`.

**GSAP targets.** Animated nodes are tagged with `data-gsap="<name>"` and
selected via attribute selector inside a `gsap.context`. The selector strings
should live in a typed constants map, not as bare strings inside JSX.

---

## 4. Styling

**Tailwind v4, no JS config.** No `tailwind.config.ts`. All design tokens
live in `src/app/globals.css` under `@theme`. Add a token by adding a CSS
custom property; the matching utility is generated automatically.

**Brand palette is per-project.** Define brand colors, surface colors, text
colors, borders, and easings as CSS variables under `@theme`. Use semantic
names (`--color-bg`, `--color-surface`, `--color-text-secondary`, brand
accents named for the brand) — not raw color names.

**No inline hex codes.** All colors in components reference `var(--color-*)`
or use Tailwind utilities derived from the tokens. No `style={{ background:
'#1e1e2e' }}` — that defeats the token system.

**Fonts.** Loaded through `next/font/google` in the locale layout, exposed
as CSS variables on `<html>`. Bind locale-specific overrides in `globals.css`
when a locale needs a different font for script coverage (e.g. Cyrillic).

**Breakpoints.** Tailwind v4 defaults (`sm`, `md`, `lg`, `xl`) unless the
design system explicitly demands custom ones.

**Colors.**: brand accents, surfaces (bg, surface, surface-2, surface-3), 
  borders, text (primary, secondary, muted), state (success, warning, 
  error, info)
**Fonts.**: --font-display, --font-sans, --font-mono, plus locale 
  fallbacks if needed
**Spacing/radii.**: only deviate from Tailwind defaults if the design 
  system explicitly demands it
**Easings.**: --ease-smooth, --ease-bounce, --ease-sharp at minimum
**Z-index scale.**: 5 steps, defined as CSS variables. Standard values:
  --z-base: 0, --z-dropdown: 10, --z-sticky: 20, --z-modal: 50, 
  --z-toast: 60. No raw z-index numbers in components.

### Animation — GSAP only

GSAP `^3` with ScrollTrigger. No Framer Motion. Plugin registration at
module scope. Every GSAP setup is wrapped in `gsap.context` and reverted on
cleanup, **and gated on `prefers-reduced-motion`**:

```tsx
useEffect(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) return;

  const ctx = gsap.context(() => {
    gsap.fromTo('[data-gsap="heading"]', { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
    });
  }, ref);

  return () => ctx.revert();
}, []);
```

`ctx.revert()` in the cleanup is mandatory — without it, animations leak
across route changes. CSS keyframes are fine for purely cosmetic loops; GSAP
is for anything triggered by scroll or interaction.

---

## 5. Internationalization

**Library.** `next-intl ^4`, integrated through the official Next plugin in
`next.config.ts`.

**Single source of truth.** `src/i18n/routing.ts` exports `routing` via
`defineRouting({ locales, defaultLocale })`. Every other piece of i18n
imports from there — `proxy.ts`, `request.ts`, `navigation.ts`, `sitemap.ts`,
hreflang maps, the locale switcher.

**Locale-aware navigation.** `src/i18n/navigation.ts` re-exports `Link`,
`useRouter`, `usePathname`, `redirect`, `getPathname` from
`createNavigation(routing)`. **Always import these from `@/i18n/navigation`,
never from `next/navigation`** for user-facing navigation. The only
exception is the bare-root `src/app/page.tsx` redirecting into the
localized tree.

**Routing middleware.** Next 16 deprecated `middleware.ts`. Use
`src/proxy.ts` exporting `proxy`. The matcher must derive its locale list
from `routing.locales` — never hardcode it.

**Translations.** One JSON per locale at `src/messages/<locale>.json`. Every
key added to one file must exist in all of them. A CI / pre-commit check
enforces key parity.

**Per-page setup checklist.** Every server component or layout under
`[locale]` must:

1. Receive `params: Promise<{ locale: string }>` and `await` it.
2. Call `setRequestLocale(locale)` before any other next-intl call.
3. Export `generateStaticParams()` returning
   `routing.locales.map((locale) => ({ locale }))`.

**Adding a locale.** Update `routing.ts`, the proxy matcher, the messages
JSON, and any locale-specific font fallback in `globals.css`. Everything
downstream (sitemap, hreflang, locale switcher) reads from `routing.locales`.

---

## 6. Forms & Integrations

**Form library.** React `useState` is acceptable for forms with ≤5 fields
and trivial validation. Anything beyond that uses **Zod + react-hook-form**.

**Email backend.** For MVPs and contact forms: **Formspree, proxied through
a server route**. The Formspree URL is a server-only env var; the form
never sees it. For projects that need control over the sender domain or
templating: **Resend**.

**Submission storage.** Default = email-only via Formspree, no DB write. 
If client requires CRM sync, lead capture, or audit trail beyond email: 
write to Supabase from the API route, return success only after both 
email + DB write succeed (or queue the DB write).

**Calendly.** External link via `<a target="_blank" rel="noopener
noreferrer">` or `window.open`. Never the embedded widget script.

**API routes accepting user input.** Required, not optional:

- Server-side schema validation (Zod).
- Honeypot field.
- Rate limiting (Upstash / Vercel KV / equivalent).
- Body size limit.
- Generic error responses (no stack traces leaked).

---

## 7. GDPR & Compliance

**Cookie consent banner.** Required the moment any analytics, tracking,
or non-essential cookie is added. Until then, no banner is needed *and* no
cookies/localStorage may be written.

**Legal pages for EU clients.** All four required, all under `[locale]`,
all marked `robots: 'noindex, follow'`:

- `/privacy-policy`
- `/terms-of-service`
- `/cookie-policy`
- `/imprint`

Each is a thin server component that loads markdown content from
`src/content/legal/<slug>.<locale>.ts(x)` and renders through a shared
`LegalPage` component.

**Contact form consent.** A privacy-consent checkbox is required on every
contact form, with a localized link to `/privacy-policy`. The submitted
payload must include a consent string (e.g. `privacy_consent: 'I have read
and agree to the Privacy Policy'`) for audit purposes.

**Data principles.** No first-party cookies, localStorage, sessionStorage,
or IndexedDB writes without consent. Form data is forwarded to a
third-party processor (Formspree / Resend) and not stored server-side
unless the project explicitly requires it.

---

## 8. Performance

**Images.** `next/image` for everything served from the bundle. WebP
preferred; PNG only when transparency + a specific quality bar demands it.
Filenames follow `thumb.webp`, `hero.webp`, `gallery-N.webp` per project.
Configure `images.remotePatterns` in `next.config.ts` if any external CDN
is used.

**Fonts.** `next/font/google` self-hosts at build time — zero runtime
requests to Google Fonts. Variables exposed on `<html>`, consumed via
Tailwind tokens.

**GSAP.** `gsap.context().revert()` cleanup mandatory.
`prefers-reduced-motion` gate mandatory (see §4).

**OG image.** `/api/og` route uses `runtime: 'edge'` and `next/og`'s
`ImageResponse`. Designed at 1200×630 (or matching the OG spec for the
project).

**Layout.** `<html suppressHydrationWarning>` when the `lang` attribute is
locale-dependent. `body` carries `antialiased overflow-x-hidden`. `passive:
true` on scroll listeners.

**Lighthouse.** Every project ships with **mobile Performance ≥ 90** before
delivery. Accessibility, Best Practices, and SEO ≥ 95.


**What we don't do.**

- No third-party script loaders for things that can ship in the bundle 
  (no Google Tag Manager unless client demands it).
- No client-side route prefetching beyond Next defaults.
- No service workers / PWA shell unless project explicitly needs offline.
- No external image CDN (Cloudflare Images, imgix, Bunny) by default — 
  Vercel's built-in image optimization handles `next/image`. Revisit if 
  Vercel transformation costs become material on a project, OR if the 
  client requires a CDN they already pay for.
- No React Server Components for content that's already client-state 
  driven — don't fight the framework.
---

## 9. SEO

**Metadata.** App Router native `next/metadata`. No `next-seo`. Set
`metadataBase` once at the locale layout. Per-page metadata via
`generateMetadata` consuming the `metadata.<page>.*` translation namespace.

**Hreflang.** `alternates.languages` map derived from `routing.locales` —
never hardcoded. Same for the OG `locale` field. `x-default` points to the
default locale.

**Sitemap.** `src/app/sitemap.ts` returns `MetadataRoute.Sitemap`, looping
`routing.locales × routes`. Every entry includes `alternates.languages`.
`BASE_URL` is a single constant at the top of the file.

**Robots.** `src/app/robots.ts` returns `MetadataRoute.Robots` with the
default rule plus **explicit allow rules for AI crawlers**. The standard
list: `GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `ClaudeBot`,
`anthropic-ai`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`,
`CCBot`, `Bytespider`, `Applebot-Extended`. Sitemap and host fields set.

**JSON-LD.** Lives in `src/components/seo/JsonLd.tsx`. Mounted server-side
on the relevant page. Default schemas: `Organization`,
`ProfessionalService` (or industry equivalent), `FAQPage` when there's an
FAQ section.

**`public/llms.txt`.** Hand-written description of the business for AI
assistants. Required for client projects.

---

## 10. Deployment

**Host.** Vercel by default. No `vercel.json` unless platform defaults need
overriding (custom rewrites, region pinning, etc.).

**Environment variables.**

- `.env.example` is committed and lists every var with placeholder values.
- Real values live in `.env.local` (gitignored).
- Server-only: `SCREAMING_SNAKE_CASE` with no prefix.
- Client-exposed: `NEXT_PUBLIC_` prefix, **only when the value is genuinely
  safe to leak**. If in doubt, proxy through a server route instead
  (Formspree URL is the canonical example).

**Build.** `npm run build`. No postbuild scripts unless they're justified
in a comment at the top of the script.

---

## 11. Code Quality

**ESLint.** Flat config (`eslint.config.mjs`) composing
`eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
Project-specific overrides go in the same file with a brief comment for each.

**Prettier.** Required. `.prettierrc` committed. `.editorconfig` committed.
Optional but recommended: `lint-staged` + `husky` (or `simple-git-hooks`)
for pre-commit formatting.

**TypeScript escape hatches.** No `@ts-ignore` ever — use `@ts-expect-error` 
which fails the build once the underlying type is fixed. Every 
`@ts-expect-error` requires an adjacent comment with the reason and a 
GitHub issue link or TODO with date.

`any` is allowed only at trust boundaries (raw third-party API responses, 
parsed JSON, FormData). Cast or validate (Zod) before passing further.
**Tests.** Marketing sites: not required; `npm run build` is the gate.
Web apps with business logic: required (Vitest + Testing Library, Playwright
for critical flows).

---

## 12. Required Files Checklist

Every new client project must have these at delivery, and the README must
be the source of truth pointing at the rest.

- [ ] `README.md` — project-specific, not the `create-next-app` boilerplate.
      Links to this doc for handoff.
- [ ] `.env.example` — every var listed with a placeholder.
- [ ] `.nvmrc` and an `engines.node` field in `package.json`.
- [ ] `src/app/[locale]/{layout,page,error,not-found,loading}.tsx`
- [ ] `src/app/{robots,sitemap}.ts`
- [ ] `src/proxy.ts` (next-intl proxy)
- [ ] `src/i18n/{routing,request,navigation}.ts`
- [ ] All four legal pages (EU clients): `/privacy-policy`,
      `/terms-of-service`, `/cookie-policy`, `/imprint`
- [ ] ESLint flat config + Prettier config + `.editorconfig`
- [ ] Translation key parity check (script or pre-commit hook)
- [ ] `public/llms.txt`
- [ ] Lighthouse mobile Performance ≥ 90 verified before sign-off
- [ ] Skip-to-main-content link in locale layout
- [ ] Lighthouse Accessibility ≥ 95 verified before sign-off
- [ ] Loom or written content-update walkthrough recorded
- [ ] Vercel project ownership/access documented in README

## 13. Accessibility

Required, not optional. Every project ships with:

- WCAG AA color contrast on all text (verified, not assumed).
- Keyboard navigation for every interactive element. No `onClick` 
  handlers on `<div>` without `role`, `tabIndex`, and key handlers.
- Focus-visible styles on all focusable elements. Never `outline: none` 
  without a replacement.
- `prefers-reduced-motion` gate on every animation (already required §4).
- `alt` text on every meaningful image. Decorative images use `alt=""`.
- Form inputs paired with `<label>` (visible or `sr-only`).
- Semantic HTML: `<button>` for actions, `<a>` for navigation. No 
  exceptions.
- ARIA only when semantic HTML can't express the intent.
- Skip-to-main-content link as the first focusable element on every page.
- Heading hierarchy: one <h1> per page, no skipped levels (h2 → h4 is 
  a violation). Use semantic order even if visual order differs.
- Modal/dialog focus management: trap focus inside, return focus to 
  trigger on close, ESC closes.

Lighthouse Accessibility ≥ 95 verified before delivery.

---

## 14. Handoff

Every client project ships with:

- README.md with: project description, local setup, env var list 
  (referencing .env.example), deployment notes, "how to update content" 
  section if applicable.
- A short Loom (or written) walkthrough of how to update content, swap 
  images, and access the deployed environment.
- Vercel project transferred to client account OR shared with billing 
  on our account (per contract).
- Domain DNS instructions if we're not managing DNS.
- A 30-day post-launch support window terms documented in the proposal, 
  referenced in README.

Handoff is a deliverable, not an afterthought.