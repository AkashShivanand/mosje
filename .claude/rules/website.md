---
paths:
  - "dosje/**/*.tsx"
  - "dosje/**/*.ts"
  - "dosje/**/*.css"
---

# Website rules (`dosje/` — the unified informational site)

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind **v4** · shadcn. Noto Sans.
⚠️ **Next.js 16 has breaking changes vs. training data** — when unsure, read `dosje/AGENTS.md` / `node_modules/next/dist/docs/`. `params`/`searchParams` are async; mind caching defaults.

## Components
- Server components by default; add `"use client"` ONLY for state/effects/interactivity (carousels, tabs, modals, the ticker).
- Named export matching the filename. No `any`.
- Container rhythm: `mx-auto max-w-[1280px] px-4`, sections `py-12 md:py-16`. Mobile-first.

## Styling — tokens, never literals
Use the brand Tailwind tokens defined in `src/app/globals.css`:
`gov-blue #0373DF` · `gov-blue-dark #014B92` · `gov-navy #003366` · `saffron #F97316` · `saffron-light #FFEDD5` · `gov-yellow #FFD323` · `ink` · `ink-muted` · `surface-muted #F8F9FA`.
No raw hex/rgb in components. Section headings: ~32px, `font-semibold`, `text-gov-blue-dark`.

## Assets & icons
- `next/image` for every image; assets live in `public/images` (and `public/seo` for favicons).
- `lucide-react` for icons — **note this version dropped brand social icons (Facebook/Twitter/Instagram); use inline brand SVGs.**

## Accessibility (required)
WCAG 2.1 AA + GIGW. Semantic landmarks, one `<h1>`, alt text, `aria-label` on icon-only controls, keyboard support + visible focus, AA contrast. Run `/a11y` before shipping a page.

## Growth
New pages/sections (porting the 13 legacy sites' content) are reverse-engineered with the global **`clone-website`** skill, then QA'd with `/qa <live-url>`.
