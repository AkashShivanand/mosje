# Build Conventions (all builder agents MUST follow)

**Project:** Next.js 16 App Router · React 19 · TypeScript strict · Tailwind v4 · shadcn.
**Root:** `/Users/akashk/Documents/Projects/MoSJE/Portals/dosje-gov-clone`
**Font:** Noto Sans is already global (`font-sans`). Don't re-import fonts.

## Custom Tailwind color tokens (already defined in globals.css — use these classes)
- `gov-blue` = #0373DF (primary; links, buttons, active states) → `bg-gov-blue`, `text-gov-blue`, `border-gov-blue`
- `gov-blue-dark` = #014B92 (hover, section headings)
- `gov-navy` = #003366 (deep footer)
- `saffron` = #F97316 (SAMAVESH orange)
- `saffron-dark` = #7C3503 · `saffron-light` = #FFEDD5
- `gov-yellow` = #FFD323 (BETA / accents)
- `gov-green` (Explore button green; or use #198754)
- `ink` = #1F2124 (headings) → `text-ink`
- `ink-muted` = #1F2937 (body) → `text-ink-muted`
- `surface-muted` = #F8F9FA → `bg-surface-muted`
- shadcn `primary` is mapped to gov blue.

## Layout
- Section wrapper pattern:
  ```tsx
  <section className="<bg + vertical padding>">
    <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">...</div>
  </section>
  ```
- Content max width is **1280px** (matches the header). Mobile-first responsive.
- Section heading style (observed): ~32px, font-semibold, color `text-gov-blue-dark` (#014B92), usually centered with a short muted subtitle below in `text-ink-muted`.
- Cards: white bg, `rounded-lg`, subtle border `border border-gray-200` and/or `shadow-sm`, hover `hover:shadow-md transition`.

## Tech rules
- `import Image from "next/image"` for all images; assets live in `/images/<file>`. Always pass width+height (or `fill` with a sized parent).
- Icons: `lucide-react`.
- `"use client"` ONLY for components with state/interactivity (tabs, carousels). Static sections stay server components.
- Types: import from `@/types` or define a local `interface` at top of file. `cn` from `@/lib/utils`.
- **Named export** matching the filename (e.g. `export function AboutUs()`).
- Must pass `npx tsc --noEmit`. Run it before finishing.
- DO NOT edit `globals.css`, `layout.tsx`, `page.tsx`, or any component you weren't assigned. Only create your own file(s).
- No placeholder/lorem text — use the real content provided in your spec.
- Match a clean Government-of-India portal aesthetic (DBIM): generous whitespace, restrained color, blue accents, accessible contrast.
