# CODEBASE_AUDIT.md

Snapshot of where `ignis-mls.com` stands against `STACK_CONVENTIONS.md` as
of **2026-05-01**.

This file is **not** updated as fixes land. It's a point-in-time reference.
When something gets fixed, update `TODO.md` instead.

---

## Inconsistencies (violates convention)

Where the repo currently disagrees with itself or with the stack conventions.

- **`proxy.ts` export style.** `src/proxy.ts:7` uses
  `export default function proxy`. `CLAUDE.md` mandates a *named*
  `proxy` export. Convention says pick one — currently both are claimed.
- **Hardcoded locale matcher in proxy.** `src/proxy.ts:13` hardcodes
  `'/(en|bg|de)/:path*'`. Adding a new locale to `src/i18n/routing.ts`
  silently bypasses the proxy for it. Convention: derive from
  `routing.locales`.
- **Hardcoded hreflang map.** `src/app/[locale]/page.tsx:32-37` lists
  `en/bg/de` literally. The sitemap (`src/app/sitemap.ts:21-23`) derives
  from `routing.locales`, so the two can drift. Convention says derive.
- **Hardcoded OG locale ternary.**
  `src/app/[locale]/page.tsx:45` —
  `locale === 'en' ? 'en_US' : locale === 'de' ? 'de_DE' : 'bg_BG'`.
  Fragile when adding locales.
- **Section component export style is mixed.** Convention is named-only.
  Current state in `src/components/sections/`:
  - Named only: `Pricing`, `FAQ`, `Contact`, `Process`
  - Default only: `Services` (`Services.tsx:241`),
    `Work` (`Work.tsx:238`)
  - Both: `Hero` (`Hero.tsx:115` and `Hero.tsx:305`)
  And `src/app/[locale]/page.tsx:4-11` imports a mix.
- **Inline hex codes everywhere.** Convention forbids inline colors.
  Roughly every section component uses `style={{ background: '#1e1e2e' }}`
  / `'#ff6b2c'` / `rgba(255,107,44,…)` instead of `var(--color-*)`.
  Worst offenders: `src/components/Navbar.tsx:179`,
  `src/components/sections/Contact.tsx:81,90,152-156`,
  `src/components/ui/ProjectModal.tsx:145-156` and many more.
- **`HomepageJsonLd` accepts `locale` and ignores it.**
  `src/components/seo/JsonLd.tsx:95` — `void locale;`. Either localize
  the schema or drop the prop.
- **Imprint loads English unconditionally.**
  `src/app/[locale]/imprint/page.tsx:32` renders `imprintEn` for every
  locale, while privacy/terms/cookie prepend a "translations coming
  soon" notice (`src/app/[locale]/privacy-policy/page.tsx:17-34`).
  Pick one approach.
- **Mixed `<a href="#hash">` vs `<button onClick={scrollIntoView}>`** for
  in-page anchors. `src/components/Footer.tsx:67-76` uses `<a>`;
  `src/components/Navbar.tsx:114-124` uses `<button>`.
- **`data-gsap` selector strings are bare strings inside JSX.** Convention
  says these should live in a typed constants map. Renaming an element
  silently breaks animations.

## Missing pieces (convention says required, repo lacks)

- **`error.tsx` / `not-found.tsx` / `loading.tsx`** — none exist anywhere
  under `src/app/`. Convention requires all three at the locale level.
- **`prefers-reduced-motion` handling** — every GSAP setup
  (`src/components/sections/*.tsx`, `src/components/ui/ProjectModal.tsx`,
  `src/components/legal/LegalPage.tsx`) ignores the media query.
- **`/api/contact` has no validation, no rate limit, no honeypot.**
  `src/app/api/contact/route.ts:9-23` accepts arbitrary JSON and forwards
  it to Formspree. Convention requires Zod + rate limit + honeypot.
- **No cookie consent banner.** A `/cookie-policy` page exists
  (`src/app/[locale]/cookie-policy/page.tsx`) but no banner implementation.
  Acceptable today only because no analytics/cookies are set; mandatory
  the moment that changes.
- **No analytics configured.** Not strictly missing — it's a deliberate
  zero-tracking baseline — but worth flagging that the cookie-policy copy
  in `src/content/legal/cookie-policy.en.ts` describes options the
  implementation does not provide.
- **No security headers.** No `headers()` block in `next.config.ts`.
- **No Prettier config / `.editorconfig`.** Formatting is consistent by
  convention only.
- **No `engines` field in `package.json`, no `.nvmrc`.** Currently
  developed against Node 24.x; nothing pins it.
- **No translation key parity check.** `src/messages/{en,bg,de}.json` are
  hand-synced (each is 289 lines today). A missing key surfaces as an
  empty string at runtime.
- **No tests.** Acceptable for a marketing site per convention. Flagged
  because the repo also contains a multi-step contact form with branching
  validation — that logic would benefit from coverage.
- **Lighthouse score not verified at delivery.** No record of mobile
  Performance ≥ 90 sign-off in the repo.

## Dead code / cleanup

- **Three.js dependencies are dead weight.** `three ^0.183.2` and
  `@types/three ^0.183.1` are in `package.json:12,21`, and `CLAUDE.md`
  describes a Three.js Hero pattern, but **no file in `src/` imports
  `three`**. The current `src/components/sections/Hero.tsx` is 2D
  (Tailwind grid + GSAP). `public/models/` exists and is empty.
  Either restore the 3D hero or `npm uninstall three @types/three`.
- **`README.md` is the `create-next-app` boilerplate.** No project-specific
  content. Convention requires a project-specific README that links to
  `STACK_CONVENTIONS.md`.
- **`docs/privacy-policy-en.html` and `docs/terms-and-conditions-en.html`**
  duplicate `src/content/legal/{privacy-policy,terms-of-service}.en.ts` in
  another format. Either generate one from the other or drop the HTML
  copies.
- **Unused social icons in Contact section.**
  `src/components/sections/Contact.tsx:13-35` defines `IconX`, `IconGitHub`,
  `IconLinceIn` but the rendering block is commented out (`Contact.tsx:218-234`).
  Either restore the social row or drop the icon components.
- **Empty `public/models/` directory.** Tied to the unused Three.js setup —
  remove with the dependency.
- **Inline `eslint-disable react-hooks/exhaustive-deps` in
  `src/components/ui/ProjectModal.tsx:244`.** Worth revisiting whether the
  dependency really needs to be omitted, and adding a comment if it does.
