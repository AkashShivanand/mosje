---
paths:
  - "apps/hub/src/app/portals/**"
---

# Portal rules (`portals/` — functional workflow apps)

The ~20 portals are **authenticated, transactional** apps for MoSJE orgs & schemes (SMILE, PM-AJAY, NOS, scholarships, NSFDC/NSKFDC/NBCFDC, NMBA, …). They are independent apps but must share the website's design language.

**Stack (per the first portal):** Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind **v3** · Radix/shadcn · `class-variance-authority` + `clsx` + `tailwind-merge` · `lucide-react` · `recharts`/`d3` for data.

## Conventions
- Each portal runs on its own dev port (start at **4123**, increment; record in `.claude/launch.json`).
- Same brand tokens and Noto Sans as the website — do not invent a separate palette. (Tailwind v3 token config, not v4 `@theme`.)
- Server components by default; `"use client"` only where needed.
- These handle real workflows/data: **validate all input (Zod), never inline secrets, never log PII.** Auth and access control are first-class.
- No `any`. Named exports. `next/image` for images.

## Accessibility & quality
Same WCAG 2.2 AA + GIGW bar as the website. Run `/review` and `/a11y` before shipping.

## Shared design system
Once `packages/design-system` lands, import tokens/components from `@mosje/design-system` instead of re-declaring them here.
