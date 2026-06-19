<!--
  SAMAVESH — AI Design Context (design.md)
  ----------------------------------------
  This file is the single, authoritative brief an AI agent (or a new engineer)
  reads BEFORE building or changing any UI on the MoSJE estate. It is written to
  be machine-readable: stable headings, explicit token names, explicit rules.

  Keep it in sync — see ".claude/rules/design-system.md" → "AI design context".
  Exact token VALUES are never hand-copied here; they live in the generated
  sources of truth listed under "Source of truth" so this file cannot drift.

  Last reviewed: 2026-06-19 · System version: v0.7
-->

# SAMAVESH Design System — AI Design Context

**SAMAVESH** (समावेश, "inclusion / bringing together") is the shared visual and
interaction language for the **Ministry / Department of Social Justice &
Empowerment (MoSJE/DoSJE), Government of India** — one system behind 13 websites
and 20+ portals serving 33+ organisations and schemes.

If you are an AI agent building UI for any MoSJE app, **read this file first**,
then build only from the tokens and components below. Do not invent visual
values.

---

## 1. Source of truth (never hand-copy values)

| What | Authoritative file | Notes |
|------|--------------------|-------|
| Token **source** (edit here) | `packages/tokens/src/{primitive,semantic,component}.json` | DTCG JSON, 3 tiers |
| Token **CSS contract** (consume here) | `packages/design-system/tokens.css` | generated — `--ds-*` / `--sa-*` |
| Token **TS mirror** | `packages/design-system/tokens.ts` | typed values |
| **Figma** export (code → Figma) | `packages/tokens/dist/figma.tokens.json` | DTCG, import via Tokens-Studio |
| Tailwind presets | `packages/config/tailwind-preset.cjs` (v3), `tokens-tailwind.css` (v4) | generated |
| Components | `packages/design-system/` → `import { … } from "@mosje/design-system"` | one definition each |
| Live docs | the SAMAVESH portal at `/design-system` (`apps/docs`) | foundations + components |
| Figma library | https://www.figma.com/design/qyzTEy8dlb3ssYctlkMX5o/SAMAVESH-Design-System | designer SoT |

**Generated files are never hand-edited.** Change tokens in
`packages/tokens/src/*.json`, then `npm run build -w @mosje/tokens` and
`npm test -w @mosje/tokens`.

---

## 2. How to consume the system

1. **Import components** from the package root — never re-implement them:
   ```tsx
   import { Button, Card, FormField, Input } from "@mosje/design-system";
   import "@mosje/design-system/tokens.css"; // once, app-wide
   ```
2. **Style with tokens, never hardcoded values.** Use the `--ds-*` CSS custom
   properties (below). This works with Tailwind v4, Tailwind v3 (via
   `@mosje/config`), or no framework at all (the docs portal uses pure
   `--ds-*`). Example:
   ```css
   .thing { background: var(--ds-surface); color: var(--ds-ink);
            padding: var(--ds-space-4); border-radius: var(--ds-radius-md); }
   ```
3. **Never** use raw hex, raw px for spacing/type/radius, or ad-hoc rgba. If a
   value you need has no token, that is a token gap — add it to
   `packages/tokens/src/` (see §6), don't hardcode.

---

## 3. Token vocabulary (`--ds-*` contract)

Names are stable; values resolve per theme/mode at runtime. Full list +
resolved values: `packages/design-system/tokens.css`.

**Color — semantic (use these, not the raw ramps):**
- Text: `--ds-ink`, `--ds-ink-strong`, `--ds-ink-muted`, `--ds-on-primary`
- Surface: `--ds-surface`, `--ds-surface-muted`, `--ds-surface-alt`
- Border: `--ds-border`, `--ds-border-strong`
- Brand/action: `--ds-primary`, `--ds-primary-hover` (= `--ds-primary-dark`), `--ds-primary-tonal`, `--ds-primary-ring`
- Links: `--ds-link` (decoupled from primary so it stays readable on dark)
- Status: `--ds-success` / `--ds-success-tonal`, `--ds-warning` / `--ds-warning-tonal`, `--ds-danger` / `--ds-danger-tonal`, `--ds-info` / `--ds-info-tonal`
- Info text: `--ds-ink-info` (use instead of `--ds-info` for body text — correct contrast level)
- Government brand layer: `--ds-saffron` (+ `-light` / `-dark`), `--ds-gov-navy`, `--ds-gov-yellow`
- Overlay/scrim: `--ds-overlay`

**Spacing — two families, both valid:**
- Numeric step scale: `--ds-space-0,1,2,3,4,5,6,8,10,12,14` (4px base; `4`=16px)
- Named t-shirt scale: `--ds-spacing-sm,md,lg,xl`

**Radius:** `--ds-radius-xxs,xs,sm,md,pill`
**Type roles — responsive (use these):** `--ds-type-ROLE-size` and `--ds-type-ROLE-lh` where ROLE is one of `display1-6`, `headline1-6`, `title1-3`, `body1-3`, `label1-3`. These are mobile-first and respond via `@media (min-width: 768px/1024px)` breakpoints automatically. Labels are fixed (no responsive override).
**Type roles — legacy aliases (back-compat):** `--ds-text-display,title-1,title-2,headline,body-1,body-2,body-3,label-1,label-3` (+ matching `--ds-leading-*`) — these now forward to the responsive `--ds-type-*` variables so they are also responsive.
**Font:** `--ds-font-sans` (Noto Sans), `--ds-font-mono`
**Elevation:** `--ds-shadow-xs,lg,xl`
**Motion:** `--ds-duration-fast,base,slow`, `--ds-easing-out,in,in-out`
**Density:** `--ds-control-height`

---

## 4. Theming — three independent axes

Theming is attribute-driven on the root element; tokens react automatically.

| Axis | Attribute | Values | Meaning |
|------|-----------|--------|---------|
| Brand / colour mode | `data-color-mode` | `blue-light` (default), `blue-dark` | which primary ramp |
| Appearance | `data-theme` | (unset = light), `dark`, `hc` | light / dark / high-contrast |
| Density | `data-density` | (unset = comfortable), `compact` | control height |

- The colour-mode axis is managed by `ColorModeProvider` / `useColorMode()` from
  the package. The appearance + density axes are plain attributes you can set on
  `<html>`; light is the `:root` default and is also explicitly addressable via
  `[data-theme="light"]` so nested theme "islands" (e.g. a docs playground
  previewing dark inside a light page) resolve correctly.
- To avoid a flash, set the attribute before first paint (see
  `colorModeInitScript()` and the docs app's `themeInitScript()`).

---

## 5. Component inventory

Import any of these from `@mosje/design-system`. Each has one definition; do not
fork. Live examples: `/design-system/components/*` and Storybook.

- **Actions** — `Button`
- **Forms** — `Input`, `Textarea`, `Select`, `FormField` (label/hint/error wiring), `Checkbox`, `Radio`, `Toggle`, `Search`
- **Data display** — `Card` (+ `CardHeader`, `CardBody`, `CardFooter`, `CardTitle`, `CardSubtitle`), `Badge`, `Chip`, `Avatar`, `MetricCard` (stat tile: label, value, optional icon badge, optional change indicator)`
- **Feedback** — `Alert`, `Loader`, `EmptyState`
- **Navigation / chrome** — `AppSwitcher`, `ZoneSwitcher`, `ColorModeSwitcher`
- **Accessibility** — `AccessibilityWidget`
- **Colour-mode system** — `ColorModeProvider`, `useColorMode`, `applyColorMode`, `colorModeInitScript`

---

## 6. Non-negotiable rules (apply to every screen)

These are project standing instructions — treat as hard constraints.

1. **Tokens first, always.** No hardcoded hex/px/rgba/shadows. Missing value →
   add a token in `packages/tokens/src/`, rebuild, then use it.
2. **Typeface is Noto Sans** (`--ds-font-sans`) across all gov properties.
   Devanagari uses `--sa-font-family-devanagari`. Don't introduce other fonts.
3. **Logo & favicon = the National Emblem** (`National-Emblem-logo.svg` /
   `National_Emblem_logo_white.svg`). Never an invented/abstract mark.
4. **No Indian tricolour band/stripe motif** (saffron-white-green flag bar) in
   any chrome — headers, footers, hero bands, dividers — unless the user
   explicitly asks. A single brand-token accent is fine; the flag stripe is not.
5. **Accessibility is non-negotiable** — target **WCAG 2.1 AA + GIGW**: semantic
   HTML, alt text, keyboard nav, visible focus (`--ds-primary-ring`), AA
   contrast, ≥44px touch targets. Run the `accessibility-auditor` agent before
   shipping a page.
6. **The release gate:** every component/pattern must work accessibly, in Hindi
   and English, on a ₹6,000 Android phone on 3G. If it doesn't, it doesn't ship.
   → mobile-first, responsive, no horizontal overflow, fluid type.
7. **Bilingual by default** — EN + हिन्दी; never hardcode English-only layouts
   that break with Devanagari.
8. **Real content, real assets** — no lorem/placeholder in production pages.

### Do / Don't (quick reference for AI)

- ✅ `var(--ds-space-4)` · ❌ `padding: 16px`
- ✅ `var(--ds-primary)` / `var(--ds-link)` · ❌ `#0373df`
- ✅ `import { Button } from "@mosje/design-system"` · ❌ a new `<button className="...">`
- ✅ `data-theme="dark"` + tokens · ❌ a second hardcoded dark palette
- ✅ National Emblem · ❌ abstract logo · ❌ tricolour stripe

---

## 7. Workflow & commands

- Regenerate tokens: `npm run build -w @mosje/tokens`
- Assert contract: `npm test -w @mosje/tokens`
- Figma ↔ tokens sync: `/sync-figma` (see `.claude/commands/sync-figma.md`)
- Review UI for drift: `design-system-guardian` agent
- Audit a page: `accessibility-auditor` agent
- Run the docs portal: `npm run dev:docs` → `http://localhost:3002/design-system`

---

## 8. Staying in sync (contract)

This file, `AGENTS.md`, and the portal's `llms.txt` are kept in lockstep with the
tokens, the components, and the Figma library. Whenever you change a token, add or
change a component, or sync Figma, you **must** update these (see the rule in
`.claude/rules/design-system.md`). `llms.txt` is generated from the portal nav so
it self-syncs; this file and `AGENTS.md` are reviewed on every token/component/
Figma change and the "Last reviewed" date above is bumped.
