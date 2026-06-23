# TODO

## Completed

- [x] Add Privacy Policy route at /privacy-policy
- [x] Add Terms of Service route at /terms-of-service
- [x] Add legal links to footer
- [x] Cookie Policy page at /cookie-policy
- [x] Cookie Policy link in footer
- [x] Imprint page at /imprint (bilingual DE/EN)
- [x] GDPR consent checkbox on contact form, linking to Privacy Policy
- [x] Per-page metadata (homepage) — generateMetadata with i18n, OG, Twitter cards, hreflang
- [x] Open Graph image generation — /api/og edge route (997×630)
- [x] sitemap.xml — 15 URLs (5 routes × 3 locales) with hreflang alternates
- [x] robots.txt with AI crawler permissions (GPTBot, ClaudeBot, PerplexityBot, etc.)
- [x] JSON-LD: Organization, ProfessionalService, FAQPage
- [x] llms.txt — public/llms.txt for AI context
- [x] FAQ section on homepage — accordion, GSAP entrance, i18n (EN/DE/BG)

## Pending

- [x] Submit sitemap to Google Search Console
- [x] Submit sitemap to Bing Webmaster Tools
- [ ] Translate Privacy Policy, Terms of Service, Cookie Policy to BG and DE
- [ ] Set up VoIP business phone number (optional)
- [x] Add real screenshots to portfolio projects (replace mockup placeholders)
- [x] Reposition pricing display on the site to match FAQ pricing (€490 / €997 / quoted) — currently shows €490
- [x] Lazy-load below-the-fold sections via dynamic import
- [x] Lazy-load vanilla-tilt
- [x] Scope ProjectModal to homepage only
- [x] Optimize font loading (audit and trim unused weights and families)

---

## Stack Conventions Compliance — ignis-mls

Sourced from `CODEBASE_AUDIT.md` (snapshot 2026-05-01). See
`STACK_CONVENTIONS.md` for the rules these are reconciling against.

### Must fix before using as client template

- [x] Add `error.tsx`, `not-found.tsx`, `loading.tsx` at locale level
- [x] Add `prefers-reduced-motion` handling to all GSAP setups
- [x] Add rate limit + honeypot + Zod validation to `/api/contact`
- [x] Replace inline hex colors with CSS variables (sweep)
- [ ] Add Prettier config + `.editorconfig`
- [ ] Pin Node version (`.nvmrc` + `engines` field)
- [ ] Centralize hreflang map — derive from `routing.locales` (page metadata + OG locale ternary + proxy matcher)
- [ ] Localize imprint or apply consistent fallback notice across legal pages
- [ ] Decide on cookie banner before adding any analytics
- [ ] Add translation key parity check script
- [ ] Resolve `proxy.ts` export style (`CLAUDE.md` says named, file is default)
- [ ] Either localize `HomepageJsonLd` or drop the unused `locale` prop

### Nice to have

- [ ] Introduce `src/lib/` + `src/hooks/` + `src/constants/` structure
- [ ] Replace boilerplate `README.md` with project-specific version that links to `STACK_CONVENTIONS.md`
- [ ] Drop or restore Three.js (currently dead weight; `public/models/` empty)
- [ ] Move `data-gsap` selector strings to typed constants
- [ ] Drop `docs/` HTML duplicates of legal content
- [ ] Decide named vs default export consistency (sweep)
- [ ] Restore or remove the commented-out social-icons block in `Contact.tsx`
- [ ] Add security headers via `next.config.ts` `headers()`
- [ ] Revisit the `eslint-disable react-hooks/exhaustive-deps` in `ProjectModal.tsx:244`
